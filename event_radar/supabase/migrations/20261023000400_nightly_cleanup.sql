create extension if not exists pg_cron with schema pg_catalog;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

select cron.schedule(
  'archive-past-events',
  '0 10 * * *',
  $job$
    update public.events
    set status = 'archived'
    where status in ('published', 'waiting')
      and event_date < (now() at time zone 'America/Los_Angeles')::date;
  $job$
);
