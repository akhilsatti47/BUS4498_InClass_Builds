-- Stage 12: allow an event to be retired when a club posts an update.
alter table public.events
  drop constraint if exists events_status_check;

alter table public.events
  add constraint events_status_check
  check (status in ('published', 'waiting', 'rejected', 'archived', 'replaced'));

alter table public.events
  add column if not exists replaced_by uuid,
  add column if not exists updates_id uuid;

drop policy if exists "Authenticated users can review events" on public.events;
create policy "Authenticated users can review events"
  on public.events
  for update
  to authenticated
  using (true)
  with check (status in ('published', 'waiting', 'rejected', 'replaced'));

grant update (status, status_reason, reviewed_at, reviewed_by)
  on public.events
  to authenticated;
