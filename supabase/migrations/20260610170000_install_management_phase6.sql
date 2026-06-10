-- Phase 6: Install Management — modules, integrations, display fields, pilot seed

alter table public.installations
  add column if not exists name text,
  add column if not exists site_url text,
  add column if not exists last_synced_at timestamptz;

create table public.installation_modules (
  id uuid primary key default gen_random_uuid(),
  installation_id uuid not null references public.installations (id) on delete cascade,
  module_key text not null check (
    module_key in (
      'support_ai',
      'analytics_ai',
      'assistant',
      'commerce_ai',
      'notifications',
      'install_ai'
    )
  ),
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  unique (installation_id, module_key)
);

create index installation_modules_installation_id_idx
  on public.installation_modules (installation_id);

create table public.installation_integrations (
  id uuid primary key default gen_random_uuid(),
  installation_id uuid not null references public.installations (id) on delete cascade,
  integration_key text not null check (
    integration_key in (
      'supabase',
      'shopify',
      'resend',
      'wordpress',
      'stripe',
      'openai'
    )
  ),
  status text not null default 'pending' check (
    status in ('connected', 'pending', 'error', 'disconnected')
  ),
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  unique (installation_id, integration_key)
);

create index installation_integrations_installation_id_idx
  on public.installation_integrations (installation_id);

alter table public.installation_modules enable row level security;
alter table public.installation_integrations enable row level security;

create policy "installation_modules_select_member"
  on public.installation_modules
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

create policy "installation_integrations_select_member"
  on public.installation_integrations
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

revoke insert, update, delete on public.installation_modules from authenticated, anon;
revoke insert, update, delete on public.installation_integrations from authenticated, anon;

drop function if exists public.create_installation(text);

create or replace function public.create_installation(
  p_system_type text,
  p_name text default null,
  p_site_url text default null
)
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
    installation_token_hash,
    name,
    site_url
  )
  values (
    v_company_id,
    p_system_type,
    'pending',
    v_token_hash,
    nullif(trim(p_name), ''),
    nullif(trim(p_site_url), '')
  )
  returning id into v_installation_id;

  return query
  select v_installation_id, v_token;
end;
$$;

revoke execute on function public.create_installation(text, text, text) from public, anon;
grant execute on function public.create_installation(text, text, text) to authenticated;

create or replace function public.seed_unonight_pilot_installation()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_installation_id uuid;
  v_token_hash text;
begin
  select c.id
  into v_company_id
  from public.companies c
  where c.slug in ('aipify', 'aipify-ai')
  order by c.created_at
  limit 1;

  if v_company_id is null then
    return null;
  end if;

  select i.id
  into v_installation_id
  from public.installations i
  where i.company_id = v_company_id
    and i.site_url = 'https://unonight.com'
  limit 1;

  if v_installation_id is not null then
    return v_installation_id;
  end if;

  v_token_hash := public.hash_installation_token('aipify_pilot_unonight_seed');

  insert into public.installations (
    company_id,
    system_type,
    status,
    installation_token_hash,
    name,
    site_url,
    installed_at,
    last_synced_at
  )
  values (
    v_company_id,
    'custom',
    'active',
    v_token_hash,
    'Unonight.com',
    'https://unonight.com',
    now() - interval '14 days',
    now() - interval '2 minutes'
  )
  returning id into v_installation_id;

  insert into public.installation_modules (installation_id, module_key, enabled)
  values
    (v_installation_id, 'support_ai', true),
    (v_installation_id, 'analytics_ai', true),
    (v_installation_id, 'assistant', true);

  insert into public.installation_integrations (
    installation_id,
    integration_key,
    status,
    last_synced_at
  )
  values
    (v_installation_id, 'supabase', 'connected', now() - interval '2 minutes'),
    (v_installation_id, 'shopify', 'connected', now() - interval '5 minutes'),
    (v_installation_id, 'resend', 'connected', now() - interval '8 minutes');

  return v_installation_id;
end;
$$;

revoke execute on function public.seed_unonight_pilot_installation() from public, anon, authenticated;

select public.seed_unonight_pilot_installation();
