-- Stage 13: only signed-in moderators can create lessons or switch them on/off.
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lesson text not null check (char_length(lesson) between 5 and 300),
  active boolean not null default true,
  created_by text not null,
  from_post uuid
);

alter table public.lessons enable row level security;

revoke all on table public.lessons from public, anon, authenticated;
grant all on table public.lessons to service_role;

drop policy if exists "Authenticated users can read lessons" on public.lessons;
create policy "Authenticated users can read lessons"
  on public.lessons
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can add lessons" on public.lessons;
create policy "Authenticated users can add lessons"
  on public.lessons
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can switch lessons" on public.lessons;
create policy "Authenticated users can switch lessons"
  on public.lessons
  for update
  to authenticated
  using (true)
  with check (true);

grant select on table public.lessons to authenticated;
grant insert (lesson, created_by, from_post) on table public.lessons to authenticated;
grant update (active) on table public.lessons to authenticated;

alter table public.events
  add column if not exists lessons_used text[] not null default '{}';
