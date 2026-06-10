-- Multi-tenant separation: Platform Admin (Level 1) vs Customer Control Center (Level 2)

alter table public.companies
  add column if not exists is_platform boolean not null default false;

create table if not exists public.platform_admins (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users (id) on delete cascade,
  role text not null check (role in ('super_admin', 'platform_support')),
  created_at timestamptz not null default now()
);

create index if not exists platform_admins_auth_user_id_idx
  on public.platform_admins (auth_user_id);

alter table public.platform_admins enable row level security;

create policy "platform_admins_select_own"
  on public.platform_admins
  for select
  to authenticated
  using (auth_user_id = auth.uid());

revoke insert, update, delete on public.platform_admins from authenticated, anon;

alter table public.users drop constraint if exists users_role_check;

alter table public.users
  add constraint users_role_check
  check (role in ('owner', 'admin', 'support', 'staff', 'read_only'));

update public.companies
set is_platform = true
where slug in ('aipify', 'aipify-ai');

insert into public.companies (name, slug, is_platform)
values ('Unonight', 'unonight', false)
on conflict (slug) do update
set name = excluded.name,
    is_platform = false;

update public.installations i
set company_id = c.id,
    updated_at = now()
from public.companies c
where c.slug = 'unonight'
  and i.site_url = 'https://unonight.com'
  and i.company_id <> c.id;

insert into public.platform_admins (auth_user_id, role)
select u.id, 'super_admin'
from auth.users u
where u.email = 'support@aipify.ai'
on conflict (auth_user_id) do nothing;

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.platform_admins pa
    where pa.auth_user_id = auth.uid()
  );
$$;

revoke execute on function public.is_platform_admin() from public, anon;
grant execute on function public.is_platform_admin() to authenticated;

create or replace function public.list_platform_customers()
returns table (
  id uuid,
  name text,
  slug text,
  created_at timestamptz,
  installation_count bigint,
  user_count bigint
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Insufficient permissions';
  end if;

  return query
  select
    c.id,
    c.name,
    c.slug,
    c.created_at,
    count(distinct i.id) as installation_count,
    count(distinct u.id) as user_count
  from public.companies c
  left join public.installations i on i.company_id = c.id
  left join public.users u on u.company_id = c.id
  where c.is_platform = false
  group by c.id, c.name, c.slug, c.created_at
  order by c.created_at desc;
end;
$$;

revoke execute on function public.list_platform_customers() from public, anon;
grant execute on function public.list_platform_customers() to authenticated;
