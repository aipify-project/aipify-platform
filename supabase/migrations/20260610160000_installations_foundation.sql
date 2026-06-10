-- Install-first foundation: installations + role mappings

create extension if not exists pgcrypto with schema extensions;

create table public.installations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  system_type text not null check (
    system_type in ('wordpress', 'shopify', 'custom', 'other')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'active', 'paused', 'revoked')
  ),
  installation_token_hash text not null unique,
  installed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index installations_company_id_idx on public.installations (company_id);
create index installations_status_idx on public.installations (status);

create table public.installation_role_mappings (
  id uuid primary key default gen_random_uuid(),
  installation_id uuid not null references public.installations (id) on delete cascade,
  external_role text not null,
  aipify_permission text not null check (
    aipify_permission in ('read', 'write', 'admin', 'none')
  ),
  created_at timestamptz not null default now(),
  unique (installation_id, external_role)
);

create index installation_role_mappings_installation_id_idx
  on public.installation_role_mappings (installation_id);

alter table public.installations enable row level security;
alter table public.installation_role_mappings enable row level security;

create policy "installations_select_member"
  on public.installations
  for select
  to authenticated
  using (
    company_id in (
      select company_id
      from public.users
      where auth_user_id = auth.uid()
    )
  );

create policy "role_mappings_select_member"
  on public.installation_role_mappings
  for select
  to authenticated
  using (
    installation_id in (
      select i.id
      from public.installations i
      join public.users u on u.company_id = i.company_id
      where u.auth_user_id = auth.uid()
    )
  );

revoke insert, update, delete on public.installations from authenticated, anon;
revoke insert, update, delete on public.installation_role_mappings from authenticated, anon;

create or replace function public.generate_installation_token()
returns text
language plpgsql
volatile
set search_path = public
as $$
declare
  raw_token text;
begin
  raw_token := encode(gen_random_bytes(32), 'base64');
  raw_token := replace(replace(replace(raw_token, '+', '-'), '/', '_'), '=', '');
  return 'aipify_' || raw_token;
end;
$$;

revoke execute on function public.generate_installation_token() from public, anon, authenticated;

create or replace function public.hash_installation_token(p_token text)
returns text
language sql
immutable
set search_path = public
as $$
  select encode(digest(p_token, 'sha256'), 'hex');
$$;

revoke execute on function public.hash_installation_token(text) from public, anon, authenticated;

create or replace function public.create_installation(p_system_type text)
returns table (installation_id uuid, installation_token text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_user_role text;
  v_token text;
  v_token_hash text;
  v_installation_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select u.company_id, u.role
  into v_company_id, v_user_role
  from public.users u
  where u.auth_user_id = auth.uid();

  if v_company_id is null then
    raise exception 'No company profile found';
  end if;

  if v_user_role not in ('owner', 'admin') then
    raise exception 'Insufficient permissions';
  end if;

  if p_system_type not in ('wordpress', 'shopify', 'custom', 'other') then
    raise exception 'Invalid system type';
  end if;

  v_token := public.generate_installation_token();
  v_token_hash := public.hash_installation_token(v_token);

  insert into public.installations (
    company_id,
    system_type,
    status,
    installation_token_hash
  )
  values (
    v_company_id,
    p_system_type,
    'pending',
    v_token_hash
  )
  returning id into v_installation_id;

  return query
  select v_installation_id, v_token;
end;
$$;

revoke execute on function public.create_installation(text) from public, anon;
grant execute on function public.create_installation(text) to authenticated;

create or replace function public.verify_installation_token(p_token text)
returns table (
  installation_id uuid,
  company_id uuid,
  system_type text,
  status text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hash text;
begin
  if p_token is null or length(p_token) < 20 then
    return;
  end if;

  v_hash := public.hash_installation_token(p_token);

  return query
  select i.id, i.company_id, i.system_type, i.status
  from public.installations i
  where i.installation_token_hash = v_hash
    and i.status in ('pending', 'active');
end;
$$;

revoke execute on function public.verify_installation_token(text) from public, authenticated;
grant execute on function public.verify_installation_token(text) to anon;

create or replace function public.activate_installation(p_token text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hash text;
  v_updated int;
begin
  v_hash := public.hash_installation_token(p_token);

  update public.installations
  set
    status = 'active',
    installed_at = coalesce(installed_at, now()),
    updated_at = now()
  where installation_token_hash = v_hash
    and status in ('pending', 'active');

  get diagnostics v_updated = row_count;
  return v_updated > 0;
end;
$$;

revoke execute on function public.activate_installation(text) from public, authenticated;
grant execute on function public.activate_installation(text) to anon;
