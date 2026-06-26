-- Link student/alumni profiles to authenticated users (one profile per user),
-- add the fields collected at profile-completion time, and let each user manage
-- (insert/update/select) ONLY their own profile via RLS. The previous anonymous
-- service-role insert path is being retired in favour of this owner-bound flow.

-- ---------------------------------------------------------------------------
-- student_profiles: new owner + contact/social columns
-- ---------------------------------------------------------------------------
alter table public.student_profiles
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists whatsapp_number text,
  add column if not exists linkedin_url text,
  add column if not exists instagram_url text,
  add column if not exists short_bio text,
  add column if not exists is_anonymous boolean not null default true;

create unique index if not exists student_profiles_user_id_key
  on public.student_profiles (user_id)
  where user_id is not null;

-- ---------------------------------------------------------------------------
-- alumni_profiles: new owner column (contact/social already exist)
-- ---------------------------------------------------------------------------
alter table public.alumni_profiles
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

create unique index if not exists alumni_profiles_user_id_key
  on public.alumni_profiles (user_id)
  where user_id is not null;

-- ---------------------------------------------------------------------------
-- RLS: a signed-in user can read/insert/update ONLY their own profile row.
-- (Public read still happens through the public_* views, which run as the
--  view owner, so masking/anonymity is preserved for everyone else.)
-- ---------------------------------------------------------------------------
alter table public.student_profiles enable row level security;
alter table public.alumni_profiles enable row level security;

drop policy if exists "student_profiles_self_select" on public.student_profiles;
create policy "student_profiles_self_select"
  on public.student_profiles
  for select
  using (user_id = auth.uid());

drop policy if exists "student_profiles_self_insert" on public.student_profiles;
create policy "student_profiles_self_insert"
  on public.student_profiles
  for insert
  with check (user_id = auth.uid());

drop policy if exists "student_profiles_self_update" on public.student_profiles;
create policy "student_profiles_self_update"
  on public.student_profiles
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "alumni_profiles_self_select" on public.alumni_profiles;
create policy "alumni_profiles_self_select"
  on public.alumni_profiles
  for select
  using (user_id = auth.uid());

drop policy if exists "alumni_profiles_self_insert" on public.alumni_profiles;
create policy "alumni_profiles_self_insert"
  on public.alumni_profiles
  for insert
  with check (user_id = auth.uid());

drop policy if exists "alumni_profiles_self_update" on public.alumni_profiles;
create policy "alumni_profiles_self_update"
  on public.alumni_profiles
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

grant select, insert, update on public.student_profiles to authenticated;
grant select, insert, update on public.alumni_profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Public views: respect each profile's own is_anonymous flag.
-- Anonymous -> mask name, hide contact/social. Otherwise show real values.
-- Student profiles now expose contact/social too (gated by is_anonymous).
--
-- NOTE: the student view gains new columns in a position that collides with
-- the previous definition, so `create or replace view` cannot be used (it
-- forbids reordering/renaming existing output columns -> error 42P16).
-- Drop first, then recreate. Both views are recreated together for symmetry.
-- ---------------------------------------------------------------------------
drop view if exists public.public_student_profiles;
drop view if exists public.public_alumni_profiles;

create view public.public_student_profiles as
select
  id,
  case
    when is_anonymous then public.mask_full_name(full_name)
    else full_name
  end as full_name,
  graduation_year,
  graduation_term,
  case when is_anonymous then null else whatsapp_number end as whatsapp_number,
  case when is_anonymous then null else linkedin_url end as linkedin_url,
  case when is_anonymous then null else instagram_url end as instagram_url,
  case when is_anonymous then null else short_bio end as short_bio,
  is_anonymous,
  created_at
from public.student_profiles;

create view public.public_alumni_profiles as
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

grant select on public.public_student_profiles to anon, authenticated;
grant select on public.public_alumni_profiles to anon, authenticated;
