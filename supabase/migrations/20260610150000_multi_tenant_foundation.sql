-- Multi-tenant foundation: companies + users

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('owner', 'admin', 'support', 'staff')),
  created_at timestamptz not null default now()
);

create index users_company_id_idx on public.users (company_id);
create index users_auth_user_id_idx on public.users (auth_user_id);

alter table public.companies enable row level security;
alter table public.users enable row level security;

create policy "users_select_own"
  on public.users
  for select
  to authenticated
  using (auth_user_id = auth.uid());

create policy "companies_select_member"
  on public.companies
  for select
  to authenticated
  using (
    id in (
      select company_id
      from public.users
      where auth_user_id = auth.uid()
    )
  );

revoke insert, update, delete on public.companies from authenticated, anon;
revoke insert, update, delete on public.users from authenticated, anon;

create or replace function public.slugify_company_name(company_name text)
returns text
language plpgsql
immutable
as $$
declare
  base_slug text;
begin
  base_slug := lower(trim(company_name));
  base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
  base_slug := trim(both '-' from base_slug);

  if base_slug = '' then
    base_slug := 'company';
  end if;

  return base_slug;
end;
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_company_name text;
  v_full_name text;
  v_slug text;
  v_base_slug text;
  v_suffix int := 0;
begin
  v_full_name := coalesce(new.raw_user_meta_data ->> 'full_name', '');
  v_company_name := coalesce(new.raw_user_meta_data ->> 'company_name', '');

  if v_company_name = '' then
    v_company_name := 'My Company';
  end if;

  if v_full_name = '' then
    v_full_name := split_part(new.email, '@', 1);
  end if;

  v_base_slug := public.slugify_company_name(v_company_name);
  v_slug := v_base_slug;

  while exists (select 1 from public.companies where slug = v_slug) loop
    v_suffix := v_suffix + 1;
    v_slug := v_base_slug || '-' || v_suffix;
  end loop;

  insert into public.companies (name, slug)
  values (v_company_name, v_slug)
  returning id into v_company_id;

  insert into public.users (auth_user_id, company_id, full_name, role)
  values (new.id, v_company_id, v_full_name, 'owner');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_auth_user();
