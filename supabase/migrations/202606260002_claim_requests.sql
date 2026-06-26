-- Self-service claim requests for clubs / events / teams.
-- A signed-in user requests ownership of an entity; the superadmin approves
-- (which inserts the matching *_admins row) or rejects the request.
-- Existing assign_*_admin RPCs and *_admins tables are kept intact; this is
-- an additional path on top of them.

create table if not exists public.claim_requests (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('club', 'event', 'team')),
  entity_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  note text,
  created_at timestamptz not null default now(),
  unique (entity_type, entity_id, user_id)
);

create index if not exists claim_requests_status_idx on public.claim_requests (status, created_at desc);
create index if not exists claim_requests_user_idx on public.claim_requests (user_id);

alter table public.claim_requests enable row level security;

drop policy if exists "claim_requests_self_read" on public.claim_requests;
create policy "claim_requests_self_read"
  on public.claim_requests
  for select
  using (user_id = auth.uid());

drop policy if exists "claim_requests_self_insert" on public.claim_requests;
create policy "claim_requests_self_insert"
  on public.claim_requests
  for insert
  with check (user_id = auth.uid() and status = 'pending');

drop policy if exists "claim_requests_superadmin_all" on public.claim_requests;
create policy "claim_requests_superadmin_all"
  on public.claim_requests
  for all
  using ((auth.jwt() ->> 'email') = 'ubterzioglu@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'ubterzioglu@gmail.com');

-- Superadmin-only review: approve inserts the matching admin row and marks the
-- request approved; reject marks it rejected.
create or replace function public.review_claim_request(request_id uuid, approve boolean)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  req public.claim_requests%rowtype;
begin
  if (auth.jwt() ->> 'email') is distinct from 'ubterzioglu@gmail.com' then
    raise exception 'INSUFFICIENT_PRIVILEGE';
  end if;

  select *
  into req
  from public.claim_requests
  where id = request_id
  limit 1;

  if req.id is null then
    raise exception 'REQUEST_NOT_FOUND';
  end if;

  if not approve then
    update public.claim_requests set status = 'rejected' where id = request_id;
    return;
  end if;

  if req.entity_type = 'club' then
    insert into public.club_admins (club_id, user_id)
    values (req.entity_id, req.user_id)
    on conflict (club_id, user_id) do nothing;
  elsif req.entity_type = 'event' then
    insert into public.event_admins (event_id, user_id)
    values (req.entity_id, req.user_id)
    on conflict (event_id, user_id) do nothing;
  elsif req.entity_type = 'team' then
    insert into public.team_admins (team_id, user_id)
    values (req.entity_id, req.user_id)
    on conflict (team_id, user_id) do nothing;
  end if;

  update public.claim_requests set status = 'approved' where id = request_id;
end;
$$;

revoke all on function public.review_claim_request(uuid, boolean) from public;
grant execute on function public.review_claim_request(uuid, boolean) to authenticated;

grant select, insert on public.claim_requests to authenticated;
grant all on public.claim_requests to service_role;
