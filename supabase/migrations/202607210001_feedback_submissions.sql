-- Feature suggestions / feedback submitted by signed-in users from the
-- homepage "Ne Yapabilirsin?" section. Superadmin reads all rows and can
-- mark them as read; the sender's user_id is captured for accountability
-- (form is only shown to authenticated users, no anonymous submissions).

create table if not exists public.feedback_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists feedback_submissions_created_idx on public.feedback_submissions (created_at desc);
create index if not exists feedback_submissions_user_idx on public.feedback_submissions (user_id);

alter table public.feedback_submissions enable row level security;

drop policy if exists "feedback_submissions_self_insert" on public.feedback_submissions;
create policy "feedback_submissions_self_insert"
  on public.feedback_submissions
  for insert
  with check (user_id = auth.uid());

drop policy if exists "feedback_submissions_self_read" on public.feedback_submissions;
create policy "feedback_submissions_self_read"
  on public.feedback_submissions
  for select
  using (user_id = auth.uid());

drop policy if exists "feedback_submissions_superadmin_all" on public.feedback_submissions;
create policy "feedback_submissions_superadmin_all"
  on public.feedback_submissions
  for all
  using ((auth.jwt() ->> 'email') = 'ubterzioglu@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'ubterzioglu@gmail.com');

grant select, insert on public.feedback_submissions to authenticated;
grant all on public.feedback_submissions to service_role;
