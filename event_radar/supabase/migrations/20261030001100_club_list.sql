-- Stage 11: the clubs table is stable knowledge the agent reads on every post.
create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null unique,
  nicknames text not null default '',
  usual_place_code text not null default '',
  usual_place_detail text not null default '',
  active boolean not null default true,
  note text not null default ''
);

alter table public.clubs enable row level security;

drop policy if exists "Visitors can read active clubs" on public.clubs;
create policy "Visitors can read active clubs"
  on public.clubs
  for select
  to anon, authenticated
  using (active = true);

-- Visitors can see only the club identity fields, never the moderator's notes or usual-place hints.
revoke all on table public.clubs from public, anon, authenticated;
grant select (id, name, nicknames, active) on public.clubs to anon, authenticated;
grant all on table public.clubs to service_role;

insert into public.clubs (name, nicknames, usual_place_code, usual_place_detail, active, note)
values
  ('Board Game Guild', 'BGG, board game club', 'UU', 'Room 220', true, ''),
  ('Mustang Pitch Society', '', '', '', true, ''),
  ('Women in Finance Circle', '', '', '', true, ''),
  ('Sustainability Crew', '', '', '', true, ''),
  ('Accounting Society', '', '', '', true, ''),
  ('Cal Poly Ski & Snowboard Club', '', '', '', true, '')
on conflict (name) do nothing;

alter table public.events
  add column if not exists agent_notes text[] not null default '{}';

drop policy if exists "Authenticated users can clear events" on public.events;
create policy "Authenticated users can clear events"
  on public.events
  for delete
  to authenticated
  using (true);

grant delete on table public.events to authenticated;
