import { createClient } from "npm:@supabase/supabase-js@2.117.2";

const GROUPME_API = "https://api.groupme.com/v3";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://isebqtcvcwzdudsraabi.supabase.co";
// This is the project's public publishable key. Never put a secret key in this file.
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_On5NeXw6DXBURlRIPeclqQ_TI8uUSqb";
const SOURCE = "groupme";
const MAX_BATCH_SIZE = 20;
const MAX_THREAD_MESSAGES = 4;
const THREAD_LOOKBACK_SECONDS = 10 * 60;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "apikey, content-type, x-client-info",
  "Access-Control-Max-Age": "86400",
};

type GroupMeMessage = {
  id?: unknown;
  text?: unknown;
  user_id?: unknown;
  name?: unknown;
  sender_type?: unknown;
  system?: unknown;
  created_at?: unknown;
};

type GroupMeCall = { status: number; data: unknown };

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" },
  });
}

function readSupabaseSecretKey(): string | undefined {
  const keySet = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (keySet) {
    try {
      const keys = JSON.parse(keySet);
      if (typeof keys?.default === "string" && keys.default) return keys.default;
    } catch {
      console.error("SUPABASE_SECRET_KEYS could not be read as JSON");
    }
  }
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || undefined;
}

function getAdminClient() {
  const key = readSupabaseSecretKey();
  if (!SUPABASE_URL || !key) return null;

  // New sb_secret keys are API keys, not JWTs, so send them on apikey only.
  const customFetch = key.startsWith("sb_secret_")
    ? (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      headers.set("apikey", key);
      headers.delete("Authorization");
      return fetch(input, { ...init, headers });
    }
    : fetch;

  return createClient(SUPABASE_URL, key, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { fetch: customFetch },
  });
}

function getGroupMeConfig() {
  return {
    token: Deno.env.get("GROUPME_TOKEN")?.trim() || "",
    groupId: Deno.env.get("GROUPME_GROUP_ID")?.trim() || "",
    botId: Deno.env.get("GROUPME_BOT_ID")?.trim() || "",
  };
}

async function groupMeRequest(path: string, params: Record<string, string> = {}): Promise<GroupMeCall> {
  const { token } = getGroupMeConfig();
  if (!token) throw new Error("GroupMe token is not configured");

  const url = new URL(`${GROUPME_API}${path}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  const response = await fetch(url, {
    headers: { "X-Access-Token": token, Accept: "application/json" },
    signal: AbortSignal.timeout(15000),
  });
  if (response.status === 304) return { status: 304, data: null };
  const data = await response.json().catch(() => null);
  return { status: response.status, data };
}

function responsePayload(data: unknown): any {
  if (data && typeof data === "object" && "response" in data) {
    return (data as { response: unknown }).response;
  }
  return data;
}

function responseMessages(data: unknown): GroupMeMessage[] {
  const payload = responsePayload(data);
  if (Array.isArray(payload)) return payload as GroupMeMessage[];
  if (payload && typeof payload === "object" && Array.isArray((payload as any).messages)) {
    return (payload as any).messages as GroupMeMessage[];
  }
  return [];
}

function textValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function messageId(message: GroupMeMessage): string {
  return textValue(message.id).trim();
}

function orderedMessages(messages: GroupMeMessage[]): GroupMeMessage[] {
  return [...messages].sort((a, b) => Number(a.created_at || 0) - Number(b.created_at || 0));
}

function groupNameFrom(data: unknown, fallback: string): string {
  const payload = responsePayload(data);
  const group = payload && typeof payload === "object" && "group" in payload
    ? (payload as any).group
    : payload;
  return textValue(group?.name).trim() || fallback;
}

async function handleGroupMeCheck(): Promise<Response> {
  const { token, groupId, botId } = getGroupMeConfig();
  const checks = { token: false, group: false, bot: botId ? false : null as boolean | null };
  if (!token || !groupId) {
    return jsonResponse({
      ok: false,
      ready: false,
      checks,
      message: "Add the GroupMe token and group ID in Supabase Secrets.",
    });
  }

  try {
    const groupResult = await groupMeRequest(`/groups/${encodeURIComponent(groupId)}`);
    checks.token = groupResult.status !== 401 && groupResult.status !== 403 && groupResult.status < 500;
    const groupPayload = responsePayload(groupResult.data);
    const group = groupPayload && typeof groupPayload === "object" && "group" in groupPayload
      ? (groupPayload as any).group
      : groupPayload;
    checks.group = groupResult.status === 200 && String(group?.id ?? "") === groupId;

    if (botId && checks.token) {
      const botResult = await groupMeRequest("/bots");
      const botPayload = responsePayload(botResult.data);
      const bots = Array.isArray(botPayload)
        ? botPayload
        : Array.isArray(botPayload?.bots)
        ? botPayload.bots
        : [];
      checks.bot = botResult.status === 200 && bots.some((bot: any) =>
        String(bot?.bot_id ?? bot?.id ?? "") === botId &&
        String(bot?.group_id ?? "") === groupId
      );
    }
  } catch {
    // Only report pass/fail. Never return GroupMe credentials or API response bodies.
  }

  const ok = checks.token && checks.group && (checks.bot === null || checks.bot);
  return jsonResponse({
    ok,
    ready: ok,
    checks,
    message: ok ? "The GroupMe token, group, and bot are connected." : "Check the GroupMe token, group ID, and bot ID in Supabase Secrets.",
  });
}

async function readCursor(supabase: NonNullable<ReturnType<typeof getAdminClient>>) {
  const { data, error } = await supabase
    .from("channel_cursor")
    .select("last_id, read_count")
    .eq("source", SOURCE)
    .maybeSingle();
  if (error) throw new Error("Could not read the GroupMe cursor");
  return data as { last_id: string | null; read_count: number | null } | null;
}

async function saveCursor(
  supabase: NonNullable<ReturnType<typeof getAdminClient>>,
  lastId: string,
  readCount: number,
): Promise<void> {
  const { error } = await supabase.from("channel_cursor").upsert({
    source: SOURCE,
    last_id: lastId,
    read_count: readCount,
    updated_at: new Date().toISOString(),
  }, { onConflict: "source" });
  if (error) throw new Error("Could not save the GroupMe cursor");
}

async function getEarlierMessages(message: GroupMeMessage, groupId: string): Promise<string> {
  const id = messageId(message);
  const senderId = textValue(message.user_id);
  const createdAt = Number(message.created_at || 0);
  if (!id || !senderId || !createdAt) return "";

  const result = await groupMeRequest(`/groups/${encodeURIComponent(groupId)}/messages`, {
    before_id: id,
    limit: "100",
  });
  if (result.status === 304) return "";
  if (result.status < 200 || result.status >= 300) throw new Error("Could not read earlier GroupMe messages");

  const cutoff = createdAt - THREAD_LOOKBACK_SECONDS;
  const earlier = orderedMessages(responseMessages(result.data))
    .filter((item) =>
      textValue(item.user_id) === senderId &&
      !item.system &&
      textValue(item.sender_type).toLowerCase() !== "bot" &&
      Number(item.created_at || 0) >= cutoff &&
      Number(item.created_at || 0) < createdAt &&
      Boolean(textValue(item.text).trim())
    )
    .slice(-MAX_THREAD_MESSAGES);

  return earlier.map((item) => {
    const sender = textValue(item.name).trim();
    const text = textValue(item.text).trim().slice(0, 500);
    return sender ? `${sender}: ${text}` : text;
  }).join("\n");
}

async function submitToAgent(
  message: GroupMeMessage,
  groupName: string,
  thread: string,
): Promise<{ status?: string; already_read?: boolean; message?: string; reasons?: string[]; event?: { title?: string }; ok?: boolean }> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/submit-event`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({
      announcement: textValue(message.text).trim(),
      source: SOURCE,
      source_id: messageId(message),
      source_name: groupName,
      thread,
    }),
    signal: AbortSignal.timeout(30000),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result || typeof result !== "object") {
    throw new Error("The event agent could not process a GroupMe message");
  }
  return result;
}

function agentReply(result: { status?: string; message?: string; reasons?: string[]; event?: { title?: string } }): string {
  const reasons = Array.isArray(result.reasons) ? result.reasons.filter((reason) => typeof reason === "string") : [];
  if (result.status === "published") return `Event posted: ${result.event?.title || "your event"}.`;
  if (result.status === "waiting") return `Saved for a moderator to review.${reasons.length ? ` ${reasons.join(" ")}` : ""}`;
  if (result.status === "rejected") return result.message || "This post was not added because it is not an event.";
  if (result.status === "duplicate") return result.message || "This event is already posted.";
  return result.message || "The event agent could not process this post.";
}

async function replyWithBot(text: string): Promise<void> {
  const { botId } = getGroupMeConfig();
  if (!botId) return;
  const response = await fetch(`${GROUPME_API}/bots/post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bot_id: botId, text: text.slice(0, 900) }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("GroupMe could not post the bot reply");
}

async function initializeCursor(
  supabase: NonNullable<ReturnType<typeof getAdminClient>>,
  groupId: string,
  previousReadCount: number,
): Promise<Response> {
  const result = await groupMeRequest(`/groups/${encodeURIComponent(groupId)}/messages`, { limit: "1" });
  if (result.status === 304) {
    return jsonResponse({ ok: true, ready: true, initialized: false, last_message_id: "", read_count: previousReadCount, bot: Boolean(getGroupMeConfig().botId) });
  }
  if (result.status < 200 || result.status >= 300) {
    return jsonResponse({ ok: false, message: "GroupMe could not return the newest message." }, 502);
  }
  const newest = orderedMessages(responseMessages(result.data)).filter((message) => messageId(message)).at(-1);
  if (!newest) {
    return jsonResponse({ ok: true, ready: true, initialized: false, last_message_id: "", read_count: previousReadCount, bot: Boolean(getGroupMeConfig().botId) });
  }
  const newestId = messageId(newest);
  await saveCursor(supabase, newestId, previousReadCount);
  return jsonResponse({
    ok: true,
    ready: true,
    initialized: true,
    last_message_id: newestId,
    read_count: previousReadCount,
    bot: Boolean(getGroupMeConfig().botId),
    message: "The reader saved the newest message as its starting point; older messages were not imported.",
  });
}

async function handleGet(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const check = url.searchParams.get("check");
  if (check) {
    if (check !== SOURCE) return jsonResponse({ ok: false, message: "Use check=groupme for this reader." }, 400);
    return await handleGroupMeCheck();
  }

  const config = getGroupMeConfig();
  const supabase = getAdminClient();
  if (!supabase) {
    return jsonResponse({ ok: true, ready: false, last_message_id: "", read_count: 0, bot: Boolean(config.botId) });
  }
  try {
    const cursor = await readCursor(supabase);
    return jsonResponse({
      ok: true,
      ready: Boolean(config.token && config.groupId && SUPABASE_PUBLISHABLE_KEY),
      last_message_id: cursor?.last_id || "",
      read_count: cursor?.read_count || 0,
      bot: Boolean(config.botId),
    });
  } catch {
    return jsonResponse({ ok: false, ready: false, message: "The reader could not load its status. Apply the Stage 14 SQL first." }, 503);
  }
}

async function handlePost(): Promise<Response> {
  const config = getGroupMeConfig();
  if (!config.token || !config.groupId || !SUPABASE_PUBLISHABLE_KEY) {
    return jsonResponse({ ok: false, ready: false, message: "The GroupMe token, group ID, or project settings are missing." }, 503);
  }
  const supabase = getAdminClient();
  if (!supabase) return jsonResponse({ ok: false, ready: false, message: "The reader is missing its Supabase connection settings." }, 503);

  try {
    const groupResult = await groupMeRequest(`/groups/${encodeURIComponent(config.groupId)}`);
    if (groupResult.status < 200 || groupResult.status >= 300) {
      return jsonResponse({ ok: false, ready: false, message: "The GroupMe token or group ID could not be verified." }, 502);
    }
    const groupName = groupNameFrom(groupResult.data, config.groupId);
    const cursor = await readCursor(supabase);
    const lastId = textValue(cursor?.last_id).trim();
    const readCount = Number(cursor?.read_count || 0);

    // On its first run, set a bookmark at the newest message and do not import history.
    if (!lastId) return await initializeCursor(supabase, config.groupId, readCount);

    const batch = await groupMeRequest(`/groups/${encodeURIComponent(config.groupId)}/messages`, {
      after_id: lastId,
      limit: String(MAX_BATCH_SIZE),
    });
    if (batch.status === 304) {
      return jsonResponse({ ok: true, ready: true, processed: 0, last_message_id: lastId, read_count: readCount, bot: Boolean(config.botId) });
    }
    if (batch.status < 200 || batch.status >= 300) {
      return jsonResponse({ ok: false, ready: false, message: "GroupMe could not return new messages." }, 502);
    }

    const messages = orderedMessages(responseMessages(batch.data)).filter((message) => messageId(message));
    if (!messages.length) {
      return jsonResponse({ ok: true, ready: true, processed: 0, last_message_id: lastId, read_count: readCount, bot: Boolean(config.botId) });
    }

    for (const message of messages) {
      const text = textValue(message.text).trim();
      if (!text || message.system || textValue(message.sender_type).toLowerCase() === "bot") continue;
      if (text.length > 2000) {
        if (config.botId) {
          try {
            await replyWithBot("This message is too long for the Event Radar. Please keep event posts under 2,000 characters.");
          } catch {
            console.error("GroupMe could not post a length notice");
          }
        }
        continue;
      }

      let thread = "";
      try {
        thread = await getEarlierMessages(message, config.groupId);
      } catch {
        // The post can still be processed if GroupMe cannot provide its short history.
        console.error("Could not load earlier GroupMe messages");
      }
      const result = await submitToAgent(message, groupName, thread);
      if (result.already_read) continue;
      if (config.botId) {
        try {
          await replyWithBot(agentReply(result));
        } catch {
          // Event processing and cursor advancement should not be undone by a bot reply failure.
          console.error("GroupMe could not post the event agent reply");
        }
      }
    }

    const newestId = messageId(messages[messages.length - 1]);
    const newReadCount = readCount + messages.length;
    await saveCursor(supabase, newestId, newReadCount);
    return jsonResponse({
      ok: true,
      ready: true,
      processed: messages.length,
      last_message_id: newestId,
      read_count: newReadCount,
      bot: Boolean(config.botId),
    });
  } catch {
    console.error("The GroupMe reader could not finish this run");
    return jsonResponse({ ok: false, ready: false, message: "The GroupMe reader hit a problem. Check its Supabase function logs." }, 500);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS_HEADERS });
  if (req.method === "GET") return await handleGet(req);
  if (req.method === "POST") return await handlePost();
  return jsonResponse({ ok: false, message: "Use GET to check the reader or POST to read new GroupMe messages." }, 405);
});
