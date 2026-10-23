(function () {
  "use strict";

  const config = window.EVENT_RADAR_CONFIG;
  const eventColumns = "id,created_at,status,title,club,event_date,start_time,end_time,place_name,place_detail,cost,free_food,summary";
  const form = document.getElementById("event-form");
  const announcement = document.getElementById("announcement");
  const characterCount = document.getElementById("character-count");
  const submitButton = document.getElementById("submit-button");
  const resultBox = document.getElementById("post-result");
  const resultLabel = document.getElementById("result-label");
  const resultMessage = document.getElementById("result-message");
  const resultReasons = document.getElementById("result-reasons");
  const eventList = document.getElementById("event-list");
  const boardStatus = document.getElementById("board-status");
  const refreshButton = document.getElementById("refresh-button");
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));

  let supabaseClient = null;
  let events = [];
  let activeFilter = "all";

  if (config && config.supabaseUrl && config.publishableKey && window.supabase) {
    supabaseClient = window.supabase.createClient(config.supabaseUrl, config.publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init && init.headers);
          headers.set("apikey", config.publishableKey);
          headers.delete("Authorization");
          return fetch(input, { ...init, headers });
        }
      }
    });
  } else {
    boardStatus.textContent = "The website connection is not configured yet.";
    showEmpty("The event board is not connected. Check config.js and refresh the page.");
  }

  function addText(parent, tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    element.textContent = text;
    parent.appendChild(element);
    return element;
  }

  function showEmpty(message) {
    eventList.replaceChildren();
    const item = document.createElement("li");
    item.className = "empty";
    item.textContent = message;
    eventList.appendChild(item);
  }

  function parseDate(value) {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const parts = value.split("-").map(Number);
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    if (date.getFullYear() !== parts[0] || date.getMonth() !== parts[1] - 1 || date.getDate() !== parts[2]) return null;
    return date;
  }

  function dateParts(value) {
    const date = parseDate(value);
    if (!date) return null;
    return {
      month: new Intl.DateTimeFormat(undefined, { month: "short" }).format(date),
      day: String(date.getDate()),
      full: new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(date)
    };
  }

  function formatTime(value) {
    if (!value) return "";
    const match = value.match(/^([01]?\d|2[0-3]):([0-5]\d)/);
    if (!match) return "";
    const hour = Number(match[1]);
    const minute = match[2];
    const suffix = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute} ${suffix}`;
  }

  function formatWhen(event) {
    const parts = dateParts(event.event_date);
    const start = formatTime(event.start_time);
    const end = formatTime(event.end_time);
    const time = start && end ? `${start} to ${end}` : start || end;
    if (parts && time) return `${parts.full} · ${time}`;
    if (parts) return parts.full;
    return time || "Date and time to be announced";
  }

  function renderEvent(event) {
    const item = document.createElement("li");
    item.className = "event";

    const parts = dateParts(event.event_date);
    if (parts) {
      const date = addText(item, "div", "date", "");
      addText(date, "span", "mon", parts.month);
      addText(date, "span", "day", parts.day);
    } else {
      const date = addText(item, "div", "date tba", "");
      addText(date, "span", "day", "TBA");
    }

    const body = addText(item, "div", "event-body", "");
    addText(body, "p", "when", formatWhen(event));
    addText(body, "h3", "", event.title || "Campus event");

    const metaParts = [];
    if (event.club) metaParts.push(event.club);
    const place = [event.place_name, event.place_detail].filter(Boolean).join(", ");
    if (place) metaParts.push(place);
    if (metaParts.length) addText(body, "p", "meta", metaParts.join(" · "));

    if (event.summary) addText(body, "p", "summary", event.summary);
    const tags = document.createElement("p");
    tags.className = "tags";
    if (event.cost) addText(tags, "span", "tag", event.cost);
    if (event.free_food) addText(tags, "span", "tag food", "🍕 Free food");
    if (tags.childElementCount) body.appendChild(tags);

    return item;
  }

  function renderEvents() {
    const visibleEvents = activeFilter === "food" ? events.filter((event) => event.free_food) : events;
    if (!visibleEvents.length) {
      showEmpty(activeFilter === "food" ? "No published events with free food yet." : "No events yet. Post the first one!");
      return;
    }
    eventList.replaceChildren(...visibleEvents.map(renderEvent));
  }

  async function loadEvents() {
    if (!supabaseClient) return;
    boardStatus.textContent = "Loading events…";
    refreshButton.disabled = true;
    const { data, error } = await supabaseClient
      .from("events")
      .select(eventColumns)
      .eq("status", "published")
      .order("event_date", { ascending: true, nullsFirst: false })
      .order("start_time", { ascending: true, nullsFirst: false });
    refreshButton.disabled = false;

    if (error) {
      console.error("Could not load published events", error);
      boardStatus.textContent = "Events could not be loaded.";
      showEmpty("There was a problem loading events. Check your connection and refresh.");
      return;
    }

    events = data || [];
    boardStatus.textContent = events.length === 1 ? "1 published event" : `${events.length} published events`;
    renderEvents();
  }

  function displayResult(status, message, reasons) {
    const labels = {
      published: "Published",
      waiting: "Waiting for review",
      rejected: "Not posted",
      duplicate: "Already posted",
      error: "Could not complete"
    };
    const resultClass = Object.hasOwn(labels, status) ? status : "error";
    resultBox.className = `result ${resultClass}`;
    resultBox.hidden = false;
    resultLabel.textContent = labels[resultClass];
    resultMessage.textContent = message || "The agent returned no message.";
    resultReasons.replaceChildren();
    const reasonList = Array.isArray(reasons) ? reasons : [];
    for (const reason of reasonList) {
      if (typeof reason === "string" && reason.trim()) addText(resultReasons, "li", "", reason);
    }
    resultReasons.hidden = resultReasons.childElementCount === 0;
  }

  announcement.addEventListener("input", () => {
    characterCount.textContent = `${announcement.value.length.toLocaleString()} / 2,000 characters`;
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const text = announcement.value.trim();
    if (!text || text.length > 2000) {
      displayResult("error", "Enter an announcement between 1 and 2,000 characters.", []);
      return;
    }
    if (!config || !config.supabaseUrl || !config.publishableKey) {
      displayResult("error", "The website connection is not configured yet.", []);
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending…";
    const formData = new FormData();
    formData.set("announcement", text);
    try {
      const response = await fetch(`${config.supabaseUrl}/functions/v1/submit-event`, {
        method: "POST",
        headers: { apikey: config.publishableKey },
        body: formData
      });
      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error("The event agent returned an unreadable answer.");
      }
      if (!response.ok || !result.ok) {
        displayResult("error", result.message || "The event could not be sent. Please try again.", result.reasons);
        return;
      }
      displayResult(result.status, result.message, result.reasons);
      if (result.status === "published" || result.status === "duplicate") await loadEvents();
      if (result.status === "published") {
        form.reset();
        characterCount.textContent = "0 / 2,000 characters";
      }
    } catch (error) {
      console.error("Could not send the announcement", error);
      displayResult("error", error.message || "Could not reach the event agent. Check your connection and try again.", []);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Send announcement";
    }
  });

  refreshButton.addEventListener("click", loadEvents);
  for (const button of filterButtons) {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter === "food" ? "food" : "all";
      for (const filterButton of filterButtons) {
        filterButton.setAttribute("aria-pressed", String(filterButton === button));
      }
      renderEvents();
    });
  }

  if (supabaseClient) loadEvents();
})();
