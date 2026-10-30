-- Stage 14: source IDs prevent processing one chat message more than once.
alter table public.events
  add column if not exists source text not null default '',
  add column if not exists source_id text not null default '',
  add column if not exists source_name text not null default '';

create unique index if not exists events_one_per_message
  on public.events (source, source_id)
  where source_id <> '';

-- Only Edge Functions using the service role may read or update chat cursors.
create table if not exists public.channel_cursor (
  source text primary key,
  last_id text not null default '',
  read_count integer not null default 0 check (read_count >= 0),
  updated_at timestamptz not null default now()
);

alter table public.channel_cursor enable row level security;
revoke all on table public.channel_cursor from public, anon, authenticated;
grant all on table public.channel_cursor to service_role;

-- Supabase Cron schedules a call to the publicly invokable reader every minute.
-- pg_cron is already enabled in the target Supabase project.
-- Enable pg_net from Database > Extensions before running this migration.

select cron.schedule(
  'read-chat-channel',
  '* * * * *',
  $job$
    select net.http_post(
      url := 'https://isebqtcvcwzdudsraabi.supabase.co/functions/v1/read-channel',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'apikey', 'sb_publishable_On5NeXw6DXBURlRIPeclqQ_TI8uUSqb'
      ),
      body := '{}'::jsonb,
      timeout_milliseconds := 60000
    );
  $job$
);
