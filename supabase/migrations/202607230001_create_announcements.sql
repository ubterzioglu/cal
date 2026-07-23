-- Hero section announcement marquee, managed from the admin panel.
-- Same pattern as clubs/events/teams: writable base table + public_*
-- view for read-only access, superadmin-only writes via RLS.

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  image_url text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists announcements_display_order_idx on public.announcements (display_order);

alter table public.announcements enable row level security;

drop policy if exists "announcements_public_read" on public.announcements;
create policy "announcements_public_read"
  on public.announcements
  for select
  using (true);

drop policy if exists "announcements_superadmin_all" on public.announcements;
create policy "announcements_superadmin_all"
  on public.announcements
  for all
  using ((auth.jwt() ->> 'email') = 'ubterzioglu@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'ubterzioglu@gmail.com');

grant select on public.announcements to anon, authenticated;
grant all on public.announcements to service_role;

create or replace view public.public_announcements as
select id, title, body, image_url, display_order, created_at
from public.announcements
where is_active = true
order by display_order asc, created_at asc;

grant select on public.public_announcements to anon, authenticated;
