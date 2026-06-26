create extension if not exists pgcrypto;

create or replace function public.mask_full_name(full_name text)
returns text
language sql
immutable
as $$
  select trim(
    array_to_string(
      array(
        select upper(left(part, 1))
        from unnest(regexp_split_to_array(trim(coalesce(full_name, '')), '\s+')) as part
        where part <> ''
      ),
      ' '
    )
  );
$$;

create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  short_info text,
  long_info text,
  support_needed boolean not null default false,
  image_url text,
  website_url text,
  contact_url text,
  contact_email text,
  responsible_people text[] not null default '{}',
  developments text[] not null default '{}',
  support_types text[] not null default '{}',
  financial_support_info text,
  financial_support_iban text,
  financial_support_description text,
  financial_support_bank_name text,
  moral_support_text text,
  created_at timestamptz not null default now()
);

alter table public.clubs
  add column if not exists contact_email text,
  add column if not exists responsible_people text[] not null default '{}',
  add column if not exists developments text[] not null default '{}',
  add column if not exists support_types text[] not null default '{}',
  add column if not exists financial_support_info text,
  add column if not exists financial_support_iban text,
  add column if not exists financial_support_description text,
  add column if not exists financial_support_bank_name text,
  add column if not exists moral_support_text text;

create index if not exists clubs_name_idx on public.clubs (name);

create table if not exists public.student_events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  short_info text,
  long_info text,
  support_needed boolean not null default false,
  image_url text,
  website_url text,
  contact_email text,
  responsible_people text[] not null default '{}',
  developments text[] not null default '{}',
  support_types text[] not null default '{}',
  financial_support_info text,
  financial_support_iban text,
  financial_support_description text,
  financial_support_bank_name text,
  moral_support_text text,
  created_at timestamptz not null default now()
);

create index if not exists student_events_name_idx on public.student_events (name);

create table if not exists public.student_teams (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  short_info text,
  long_info text,
  support_needed boolean not null default false,
  image_url text,
  website_url text,
  contact_email text,
  responsible_people text[] not null default '{}',
  developments text[] not null default '{}',
  support_types text[] not null default '{}',
  financial_support_info text,
  financial_support_iban text,
  financial_support_description text,
  financial_support_bank_name text,
  moral_support_text text,
  created_at timestamptz not null default now()
);

create index if not exists student_teams_name_idx on public.student_teams (name);

create table if not exists public.club_admins (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (club_id, user_id)
);

create table if not exists public.event_admins (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.student_events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create table if not exists public.team_admins (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.student_teams(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (team_id, user_id)
);

create table if not exists public.alumni_profiles (
  id uuid primary key default gen_random_uuid(),
  graduation_year integer not null,
  full_name text not null,
  linkedin_url text,
  instagram_url text,
  email text,
  whatsapp_number text,
  short_bio text,
  support_topics text[] not null default '{}',
  is_anonymous boolean not null default false,
  text_hash text,
  created_at timestamptz not null default now()
);

alter table public.alumni_profiles
  add column if not exists linkedin_url text,
  add column if not exists instagram_url text,
  add column if not exists whatsapp_number text,
  add column if not exists short_bio text,
  add column if not exists support_topics text[] not null default '{}',
  add column if not exists is_anonymous boolean not null default false,
  add column if not exists text_hash text,
  alter column email drop not null;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'alumni_profiles'
      and column_name = 'phone'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'alumni_profiles'
      and column_name = 'whatsapp_number'
  ) then
    alter table public.alumni_profiles rename column phone to whatsapp_number;
  end if;
end $$;

create index if not exists alumni_profiles_graduation_year_idx on public.alumni_profiles (graduation_year);
create index if not exists alumni_profiles_full_name_idx on public.alumni_profiles (full_name);
create unique index if not exists alumni_profiles_text_hash_key on public.alumni_profiles (text_hash) where text_hash is not null;

create table if not exists public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  graduation_year integer not null,
  graduation_term text not null,
  is_anonymous boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists student_profiles_graduation_year_idx on public.student_profiles (graduation_year);
create index if not exists student_profiles_full_name_idx on public.student_profiles (full_name);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'student_profiles_graduation_year_range'
  ) then
    alter table public.student_profiles
      add constraint student_profiles_graduation_year_range
      check (graduation_year between 1990 and 2030);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'student_profiles_graduation_year_not_2010'
  ) then
    alter table public.student_profiles
      add constraint student_profiles_graduation_year_not_2010
      check (graduation_year <> 2010);
  end if;
end $$;

create table if not exists public.alumni_solidarity_topics (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  text_hash text,
  created_at timestamptz not null default now()
);

create table if not exists public.alumni_solidarity_comments (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.alumni_solidarity_topics(id) on delete cascade,
  body text not null,
  text_hash text,
  created_at timestamptz not null default now()
);

alter table public.alumni_solidarity_topics
  add column if not exists text_hash text;

alter table public.alumni_solidarity_comments
  add column if not exists text_hash text;

create index if not exists alumni_solidarity_topics_created_at_idx on public.alumni_solidarity_topics (created_at desc);
create index if not exists alumni_solidarity_comments_topic_id_idx on public.alumni_solidarity_comments (topic_id);
create unique index if not exists alumni_solidarity_topics_text_hash_key on public.alumni_solidarity_topics (text_hash) where text_hash is not null;
create unique index if not exists alumni_solidarity_comments_text_hash_key on public.alumni_solidarity_comments (text_hash) where text_hash is not null;

create table if not exists public.api_rate_limit_events (
  id bigint generated always as identity primary key,
  key text not null,
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists api_rate_limit_events_lookup_idx
  on public.api_rate_limit_events (key, ip_hash, created_at desc);

alter table public.clubs enable row level security;
alter table public.student_events enable row level security;
alter table public.student_teams enable row level security;
alter table public.club_admins enable row level security;
alter table public.event_admins enable row level security;
alter table public.team_admins enable row level security;
alter table public.alumni_profiles enable row level security;
alter table public.student_profiles enable row level security;
alter table public.alumni_solidarity_topics enable row level security;
alter table public.alumni_solidarity_comments enable row level security;
alter table public.api_rate_limit_events enable row level security;

drop policy if exists "clubs_public_read" on public.clubs;
create policy "clubs_public_read"
  on public.clubs
  for select
  using (true);

drop policy if exists "clubs_superadmin_all" on public.clubs;
create policy "clubs_superadmin_all"
  on public.clubs
  for all
  using ((auth.jwt() ->> 'email') = 'ubterzioglu@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'ubterzioglu@gmail.com');

drop policy if exists "clubs_admin_update" on public.clubs;
create policy "clubs_admin_update"
  on public.clubs
  for update
  using (
    exists (
      select 1
      from public.club_admins ca
      where ca.club_id = id
        and ca.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.club_admins ca
      where ca.club_id = id
        and ca.user_id = auth.uid()
    )
  );

drop policy if exists "student_events_public_read" on public.student_events;
create policy "student_events_public_read"
  on public.student_events
  for select
  using (true);

drop policy if exists "student_events_superadmin_all" on public.student_events;
create policy "student_events_superadmin_all"
  on public.student_events
  for all
  using ((auth.jwt() ->> 'email') = 'ubterzioglu@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'ubterzioglu@gmail.com');

drop policy if exists "student_events_admin_update" on public.student_events;
create policy "student_events_admin_update"
  on public.student_events
  for update
  using (
    exists (
      select 1
      from public.event_admins ea
      where ea.event_id = id
        and ea.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.event_admins ea
      where ea.event_id = id
        and ea.user_id = auth.uid()
    )
  );

drop policy if exists "student_teams_public_read" on public.student_teams;
create policy "student_teams_public_read"
  on public.student_teams
  for select
  using (true);

drop policy if exists "student_teams_superadmin_all" on public.student_teams;
create policy "student_teams_superadmin_all"
  on public.student_teams
  for all
  using ((auth.jwt() ->> 'email') = 'ubterzioglu@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'ubterzioglu@gmail.com');

drop policy if exists "student_teams_admin_update" on public.student_teams;
create policy "student_teams_admin_update"
  on public.student_teams
  for update
  using (
    exists (
      select 1
      from public.team_admins ta
      where ta.team_id = id
        and ta.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.team_admins ta
      where ta.team_id = id
        and ta.user_id = auth.uid()
    )
  );

drop policy if exists "club_admins_self_read" on public.club_admins;
create policy "club_admins_self_read"
  on public.club_admins
  for select
  using (user_id = auth.uid());

drop policy if exists "club_admins_superadmin_all" on public.club_admins;
create policy "club_admins_superadmin_all"
  on public.club_admins
  for all
  using ((auth.jwt() ->> 'email') = 'ubterzioglu@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'ubterzioglu@gmail.com');

drop policy if exists "event_admins_self_read" on public.event_admins;
create policy "event_admins_self_read"
  on public.event_admins
  for select
  using (user_id = auth.uid());

drop policy if exists "event_admins_superadmin_all" on public.event_admins;
create policy "event_admins_superadmin_all"
  on public.event_admins
  for all
  using ((auth.jwt() ->> 'email') = 'ubterzioglu@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'ubterzioglu@gmail.com');

drop policy if exists "team_admins_self_read" on public.team_admins;
create policy "team_admins_self_read"
  on public.team_admins
  for select
  using (user_id = auth.uid());

drop policy if exists "team_admins_superadmin_all" on public.team_admins;
create policy "team_admins_superadmin_all"
  on public.team_admins
  for all
  using ((auth.jwt() ->> 'email') = 'ubterzioglu@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'ubterzioglu@gmail.com');

create or replace view public.public_clubs as
select
  id,
  slug,
  name,
  short_info,
  long_info,
  support_needed,
  support_types,
  financial_support_info,
  financial_support_bank_name,
  financial_support_iban,
  financial_support_description,
  moral_support_text,
  image_url,
  website_url,
  contact_email,
  responsible_people,
  developments,
  created_at
from public.clubs;

create or replace view public.public_student_events as
select
  id,
  slug,
  name,
  short_info,
  long_info,
  support_needed,
  support_types,
  financial_support_info,
  financial_support_bank_name,
  financial_support_iban,
  financial_support_description,
  moral_support_text,
  image_url,
  website_url,
  contact_email,
  responsible_people,
  developments,
  created_at
from public.student_events;

create or replace view public.public_student_teams as
select
  id,
  slug,
  name,
  short_info,
  long_info,
  support_needed,
  support_types,
  financial_support_info,
  financial_support_bank_name,
  financial_support_iban,
  financial_support_description,
  moral_support_text,
  image_url,
  website_url,
  contact_email,
  responsible_people,
  developments,
  created_at
from public.student_teams;

create or replace view public.public_alumni_profiles as
select
  id,
  graduation_year,
  case
    when is_anonymous then public.mask_full_name(full_name)
    else full_name
  end as full_name,
  case when is_anonymous then null else linkedin_url end as linkedin_url,
  case when is_anonymous then null else instagram_url end as instagram_url,
  case when is_anonymous then null else email end as email,
  case when is_anonymous then null else whatsapp_number end as whatsapp_number,
  case when is_anonymous then null else short_bio end as short_bio,
  case when is_anonymous then null else support_topics end as support_topics,
  is_anonymous,
  created_at
from public.alumni_profiles;

create or replace view public.public_student_profiles as
select
  id,
  public.mask_full_name(full_name) as full_name,
  graduation_year,
  graduation_term,
  true as is_anonymous,
  created_at
from public.student_profiles;

create or replace view public.public_alumni_solidarity_topics as
select id, title, description, created_at
from public.alumni_solidarity_topics;

create or replace view public.public_alumni_solidarity_comments as
select id, topic_id, body, created_at
from public.alumni_solidarity_comments;

create or replace function public.assign_club_admin(target_email text, target_club_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  target_user_id uuid;
begin
  if (auth.jwt() ->> 'email') is distinct from 'ubterzioglu@gmail.com' then
    raise exception 'INSUFFICIENT_PRIVILEGE';
  end if;

  select id
  into target_user_id
  from auth.users
  where lower(email) = lower(target_email)
  limit 1;

  if target_user_id is null then
    raise exception 'USER_NOT_FOUND';
  end if;

  insert into public.club_admins (club_id, user_id)
  values (target_club_id, target_user_id)
  on conflict (club_id, user_id) do nothing;
end;
$$;

create or replace function public.assign_event_admin(target_email text, target_event_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  target_user_id uuid;
begin
  if (auth.jwt() ->> 'email') is distinct from 'ubterzioglu@gmail.com' then
    raise exception 'INSUFFICIENT_PRIVILEGE';
  end if;

  select id
  into target_user_id
  from auth.users
  where lower(email) = lower(target_email)
  limit 1;

  if target_user_id is null then
    raise exception 'USER_NOT_FOUND';
  end if;

  insert into public.event_admins (event_id, user_id)
  values (target_event_id, target_user_id)
  on conflict (event_id, user_id) do nothing;
end;
$$;

create or replace function public.assign_team_admin(target_email text, target_team_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  target_user_id uuid;
begin
  if (auth.jwt() ->> 'email') is distinct from 'ubterzioglu@gmail.com' then
    raise exception 'INSUFFICIENT_PRIVILEGE';
  end if;

  select id
  into target_user_id
  from auth.users
  where lower(email) = lower(target_email)
  limit 1;

  if target_user_id is null then
    raise exception 'USER_NOT_FOUND';
  end if;

  insert into public.team_admins (team_id, user_id)
  values (target_team_id, target_user_id)
  on conflict (team_id, user_id) do nothing;
end;
$$;

revoke all on function public.assign_club_admin(text, uuid) from public;
revoke all on function public.assign_event_admin(text, uuid) from public;
revoke all on function public.assign_team_admin(text, uuid) from public;

grant execute on function public.assign_club_admin(text, uuid) to authenticated;
grant execute on function public.assign_event_admin(text, uuid) to authenticated;
grant execute on function public.assign_team_admin(text, uuid) to authenticated;

grant select on public.public_clubs to anon, authenticated;
grant select on public.public_student_events to anon, authenticated;
grant select on public.public_student_teams to anon, authenticated;
grant select on public.public_alumni_profiles to anon, authenticated;
grant select on public.public_student_profiles to anon, authenticated;
grant select on public.public_alumni_solidarity_topics to anon, authenticated;
grant select on public.public_alumni_solidarity_comments to anon, authenticated;

grant select, update on public.clubs to authenticated;
grant select, update on public.student_events to authenticated;
grant select, update on public.student_teams to authenticated;
grant select on public.club_admins to authenticated;
grant select on public.event_admins to authenticated;
grant select on public.team_admins to authenticated;

grant all on public.clubs to service_role;
grant all on public.student_events to service_role;
grant all on public.student_teams to service_role;
grant all on public.club_admins to service_role;
grant all on public.event_admins to service_role;
grant all on public.team_admins to service_role;
grant all on public.alumni_profiles to service_role;
grant all on public.student_profiles to service_role;
grant all on public.alumni_solidarity_topics to service_role;
grant all on public.alumni_solidarity_comments to service_role;
grant all on public.api_rate_limit_events to service_role;
grant usage, select on all sequences in schema public to service_role;
