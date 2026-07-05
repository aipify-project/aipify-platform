-- WEBSITE.KOMPIS.V2.04 — Persistent install config storage + safe read/update RPCs
-- Builds on: 20261932300000_tenant_public_companion_faq.sql
-- Feature owner: Customer App (APP) · Core normalizes WebsiteKompisInstallConfig

-- ---------------------------------------------------------------------------
-- 1. tenant_public_companion_install_config
-- ---------------------------------------------------------------------------
create table if not exists public.tenant_public_companion_install_config (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  install_id uuid not null unique references public.installations (id) on delete cascade,
  config jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint tenant_public_companion_install_config_config_object check (
    jsonb_typeof(config) = 'object'
  )
);

comment on table public.tenant_public_companion_install_config is
  'APP-owned raw Website Kompis install config JSON — normalized by Core before public use.';

create index if not exists wpkf_install_config_tenant_idx
  on public.tenant_public_companion_install_config (tenant_id);

alter table public.tenant_public_companion_install_config enable row level security;

revoke all on public.tenant_public_companion_install_config from anon;
revoke all on public.tenant_public_companion_install_config from authenticated;

grant select, insert, update on public.tenant_public_companion_install_config to authenticated;

create policy wpkf_install_config_select_owner_admin
  on public.tenant_public_companion_install_config
  for select
  to authenticated
  using (
    tenant_id = public._wpkf_auth_tenant_id()
    and public._wpkf_auth_is_owner_admin()
  );

create policy wpkf_install_config_insert_owner_admin
  on public.tenant_public_companion_install_config
  for insert
  to authenticated
  with check (
    tenant_id = public._wpkf_auth_tenant_id()
    and public._wpkf_auth_is_owner_admin()
  );

create policy wpkf_install_config_update_owner_admin
  on public.tenant_public_companion_install_config
  for update
  to authenticated
  using (
    tenant_id = public._wpkf_auth_tenant_id()
    and public._wpkf_auth_is_owner_admin()
  )
  with check (
    tenant_id = public._wpkf_auth_tenant_id()
    and public._wpkf_auth_is_owner_admin()
  );

-- ---------------------------------------------------------------------------
-- 2. Config helpers (sanitize + normalize)
-- ---------------------------------------------------------------------------
create or replace function public._wpkf_allowed_icon_variant(p_value text)
returns text
language sql
immutable
set search_path = public
as $$
  select case
    when p_value in (
      'companion-purple-default',
      'companion-purple-dark',
      'companion-purple-light'
    ) then p_value
    else 'companion-purple-default'
  end;
$$;

create or replace function public._wpkf_install_config_bool(
  p_value jsonb,
  p_fallback boolean
)
returns boolean
language sql
immutable
set search_path = public
as $$
  select case
    when jsonb_typeof(p_value) = 'boolean' then (p_value #>> '{}')::boolean
    else p_fallback
  end;
$$;

create or replace function public._wpkf_install_config_locale(
  p_value jsonb,
  p_fallback text
)
returns text
language sql
immutable
set search_path = public
as $$
  select case
    when jsonb_typeof(p_value) = 'string'
      and lower(trim(both from p_value #>> '{}')) in (
        'en', 'no', 'sv', 'da', 'pl', 'uk', 'es'
      )
    then lower(trim(both from p_value #>> '{}'))
    else p_fallback
  end;
$$;

create or replace function public._wpkf_sanitize_install_config_patch(p_patch jsonb)
returns jsonb
language plpgsql
immutable
set search_path = public
as $$
declare
  v_patch jsonb := coalesce(p_patch, '{}'::jsonb);
  v_result jsonb := '{}'::jsonb;
  v_sources jsonb;
  v_key text;
  v_source_key text;
  v_forbidden constant text[] := array[
    'iconUrl', 'iconPath', 'tenantId', 'tenant_id', 'installId', 'customerId', 'companyId'
  ];
begin
  if jsonb_typeof(v_patch) <> 'object' then
    return '{}'::jsonb;
  end if;

  if v_patch ? 'website_kompis' and jsonb_typeof(v_patch -> 'website_kompis') = 'object' then
    v_patch := v_patch -> 'website_kompis';
  elsif v_patch ? 'websiteKompis' and jsonb_typeof(v_patch -> 'websiteKompis') = 'object' then
    v_patch := v_patch -> 'websiteKompis';
  end if;

  for v_key in
    select key
    from jsonb_object_keys(v_patch) as key
  loop
    if v_key = any (v_forbidden) then
      continue;
    end if;

    if v_key in (
      'enabled',
      'iconVariant',
      'defaultLocale',
      'fallbackTone',
      'welcomeMessageVariant',
      'updatedAt'
    ) then
      v_result := v_result || jsonb_build_object(v_key, v_patch -> v_key);
    elsif v_key = 'sources' and jsonb_typeof(v_patch -> 'sources') = 'object' then
      v_sources := '{}'::jsonb;
      for v_source_key in
        select key
        from jsonb_object_keys(v_patch -> 'sources') as key
      loop
        if v_source_key in ('faq', 'currentPage', 'publicSiteIndex', 'aipifyPublic')
          and jsonb_typeof(v_patch -> 'sources' -> v_source_key) = 'boolean' then
          v_sources := v_sources || jsonb_build_object(
            v_source_key,
            v_patch -> 'sources' -> v_source_key
          );
        end if;
      end loop;
      if v_sources <> '{}'::jsonb then
        v_result := v_result || jsonb_build_object('sources', v_sources);
      end if;
    end if;
  end loop;

  return v_result;
end;
$$;

create or replace function public._wpkf_normalize_install_config_json(
  p_raw jsonb,
  p_locale text default 'no'
)
returns jsonb
language plpgsql
immutable
set search_path = public
as $$
declare
  v_raw jsonb := coalesce(p_raw, '{}'::jsonb);
  v_block jsonb := '{}'::jsonb;
  v_sources jsonb;
  v_fallback_locale text := public._wpkf_install_config_locale(
    to_jsonb(p_locale),
    'no'
  );
  v_source_key text;
  v_sources_valid boolean := true;
begin
  if jsonb_typeof(v_raw) <> 'object' then
    v_raw := '{}'::jsonb;
  end if;

  if v_raw ? 'website_kompis' and jsonb_typeof(v_raw -> 'website_kompis') = 'object' then
    v_block := v_raw -> 'website_kompis';
  elsif v_raw ? 'websiteKompis' and jsonb_typeof(v_raw -> 'websiteKompis') = 'object' then
    v_block := v_raw -> 'websiteKompis';
  elsif v_raw ? 'enabled'
    or v_raw ? 'iconVariant'
    or v_raw ? 'sources'
    or v_raw ? 'fallbackTone'
    or v_raw ? 'welcomeMessageVariant'
    or v_raw ? 'defaultLocale' then
    v_block := v_raw;
  end if;

  if v_block ? 'sources' and jsonb_typeof(v_block -> 'sources') = 'object' then
    for v_source_key in
      select key
      from jsonb_object_keys(v_block -> 'sources') as key
    loop
      if v_source_key in ('faq', 'currentPage', 'publicSiteIndex', 'aipifyPublic')
        and jsonb_typeof(v_block -> 'sources' -> v_source_key) <> 'boolean' then
        v_sources_valid := false;
        exit;
      end if;
    end loop;

    if v_sources_valid then
      v_sources := jsonb_build_object(
        'faq', public._wpkf_install_config_bool(v_block -> 'sources' -> 'faq', true),
        'currentPage', public._wpkf_install_config_bool(v_block -> 'sources' -> 'currentPage', true),
        'publicSiteIndex', public._wpkf_install_config_bool(v_block -> 'sources' -> 'publicSiteIndex', false),
        'aipifyPublic', public._wpkf_install_config_bool(v_block -> 'sources' -> 'aipifyPublic', true)
      );
    else
      v_sources := jsonb_build_object(
        'faq', true,
        'currentPage', true,
        'publicSiteIndex', false,
        'aipifyPublic', true
      );
    end if;
  else
    v_sources := jsonb_build_object(
      'faq', true,
      'currentPage', true,
      'publicSiteIndex', false,
      'aipifyPublic', true
    );
  end if;

  return jsonb_build_object(
    'enabled', public._wpkf_install_config_bool(v_block -> 'enabled', true),
    'iconVariant', public._wpkf_allowed_icon_variant(v_block ->> 'iconVariant'),
    'defaultLocale', public._wpkf_install_config_locale(
      v_block -> 'defaultLocale',
      v_fallback_locale
    ),
    'fallbackTone', case
      when v_block ->> 'fallbackTone' in ('professional-friendly', 'short-direct')
      then v_block ->> 'fallbackTone'
      else 'professional-friendly'
    end,
    'sources', v_sources,
    'welcomeMessageVariant', case
      when v_block ->> 'welcomeMessageVariant' in ('standard', 'compact')
      then v_block ->> 'welcomeMessageVariant'
      else 'standard'
    end
  );
end;
$$;

create or replace function public._wpkf_merge_install_config(
  p_existing jsonb,
  p_patch jsonb
)
returns jsonb
language plpgsql
immutable
set search_path = public
as $$
declare
  v_existing jsonb := coalesce(p_existing, '{}'::jsonb);
  v_patch jsonb := public._wpkf_sanitize_install_config_patch(p_patch);
begin
  if v_patch ? 'sources' then
    v_existing := jsonb_set(
      v_existing,
      '{sources}',
      coalesce(v_existing -> 'sources', '{}'::jsonb) || (v_patch -> 'sources'),
      true
    );
    v_patch := v_patch - 'sources';
  end if;

  return v_existing || v_patch;
end;
$$;

create or replace function public._wpkf_assert_install_config_access(p_install_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  if p_install_id is null then
    raise exception 'Install id required';
  end if;

  if public.is_platform_admin() then
    select coalesce(
      i.customer_id,
      (
        select c.id
        from public.customers c
        where c.company_id = i.company_id
        limit 1
      )
    )
    into v_tenant_id
    from public.installations i
    where i.id = p_install_id
      and i.revoked_at is null
    limit 1;

    if v_tenant_id is null then
      raise exception 'Install not found';
    end if;

    return v_tenant_id;
  end if;

  v_tenant_id := public._wpkf_require_owner_admin();

  if not exists (
    select 1
    from public.installations i
    where i.id = p_install_id
      and i.revoked_at is null
      and (
        i.customer_id = v_tenant_id
        or exists (
          select 1
          from public.customers c
          where c.id = v_tenant_id
            and c.company_id = i.company_id
        )
      )
  ) then
    raise exception 'Install not found or access denied';
  end if;

  return v_tenant_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Authenticated read RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_website_kompis_install_config(p_install_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_row public.tenant_public_companion_install_config;
  v_raw jsonb;
begin
  v_tenant_id := public._wpkf_assert_install_config_access(p_install_id);

  select *
  into v_row
  from public.tenant_public_companion_install_config c
  where c.install_id = p_install_id
    and c.tenant_id = v_tenant_id
  limit 1;

  v_raw := coalesce(v_row.config, '{}'::jsonb);

  return jsonb_build_object(
    'ok', true,
    'install_id', p_install_id,
    'config', v_raw,
    'normalized_config', public._wpkf_normalize_install_config_json(v_raw, 'no'),
    'updated_at', v_row.updated_at,
    'updated_by', v_row.updated_by
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Public-safe read RPC (anon)
-- ---------------------------------------------------------------------------
create or replace function public.get_website_kompis_public_install_config(
  p_install_id uuid,
  p_domain text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx record;
  v_row public.tenant_public_companion_install_config;
  v_raw jsonb;
begin
  select c.tenant_id, c.resolved_install_id, c.resolved_domain
  into v_ctx
  from public._wpkf_resolve_visitor_context(p_install_id, p_domain) c
  limit 1;

  if v_ctx.resolved_install_id is null then
    return jsonb_build_object('ok', false);
  end if;

  select *
  into v_row
  from public.tenant_public_companion_install_config c
  where c.install_id = v_ctx.resolved_install_id
    and c.tenant_id = v_ctx.tenant_id
  limit 1;

  v_raw := coalesce(v_row.config, '{}'::jsonb);

  return jsonb_build_object(
    'ok', true,
    'install_id', v_ctx.resolved_install_id,
    'config', v_raw,
    'normalized_config', public._wpkf_normalize_install_config_json(v_raw, 'no'),
    'updated_at', v_row.updated_at
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. Authenticated update RPC
-- ---------------------------------------------------------------------------
create or replace function public.update_website_kompis_install_config(
  p_install_id uuid,
  p_patch jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_existing public.tenant_public_companion_install_config;
  v_merged jsonb;
  v_normalized jsonb;
  v_domain text;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  v_tenant_id := public._wpkf_assert_install_config_access(p_install_id);
  v_merged := public._wpkf_sanitize_install_config_patch(p_patch);

  if v_merged = '{}'::jsonb then
    raise exception 'No valid config patch fields';
  end if;

  select *
  into v_existing
  from public.tenant_public_companion_install_config c
  where c.install_id = p_install_id
    and c.tenant_id = v_tenant_id
  limit 1;

  if v_existing.id is null then
    select public.normalize_domain(i.site_url)
    into v_domain
    from public.installations i
    where i.id = p_install_id
    limit 1;

    insert into public.tenant_public_companion_install_config (
      tenant_id,
      install_id,
      config,
      updated_by
    )
    values (
      v_tenant_id,
      p_install_id,
      v_merged,
      public._wpkf_current_user_id()
    )
    returning * into v_existing;
  else
    v_merged := public._wpkf_merge_install_config(v_existing.config, p_patch);

    update public.tenant_public_companion_install_config c
    set
      config = v_merged,
      updated_at = now(),
      updated_by = public._wpkf_current_user_id()
    where c.id = v_existing.id
    returning * into v_existing;
  end if;

  v_normalized := public._wpkf_normalize_install_config_json(v_existing.config, 'no');

  perform public._wpkf_record_audit_event(
    v_tenant_id,
    null,
    'updated',
    null,
    null,
    null,
    p_install_id,
    v_domain,
    jsonb_build_object(
      'scope',
      'website_kompis_install_config',
      'patch',
      public._wpkf_sanitize_install_config_patch(p_patch),
      'normalized_config',
      v_normalized
    )
  );

  return jsonb_build_object(
    'ok', true,
    'install_id', p_install_id,
    'config', v_existing.config,
    'normalized_config', v_normalized,
    'updated_at', v_existing.updated_at,
    'updated_by', v_existing.updated_by
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. Grants
-- ---------------------------------------------------------------------------
revoke all on function public._wpkf_allowed_icon_variant(text) from public, anon, authenticated;
revoke all on function public._wpkf_install_config_bool(jsonb, boolean) from public, anon, authenticated;
revoke all on function public._wpkf_install_config_locale(jsonb, text) from public, anon, authenticated;
revoke all on function public._wpkf_sanitize_install_config_patch(jsonb) from public, anon, authenticated;
revoke all on function public._wpkf_normalize_install_config_json(jsonb, text) from public, anon, authenticated;
revoke all on function public._wpkf_merge_install_config(jsonb, jsonb) from public, anon, authenticated;
revoke all on function public._wpkf_assert_install_config_access(uuid) from public, anon, authenticated;

revoke all on function public.get_website_kompis_install_config(uuid) from public, anon;
revoke all on function public.get_website_kompis_public_install_config(uuid, text) from public;
revoke all on function public.update_website_kompis_install_config(uuid, jsonb) from public, anon;

grant execute on function public.get_website_kompis_install_config(uuid) to authenticated;
grant execute on function public.get_website_kompis_public_install_config(uuid, text) to anon;
grant execute on function public.update_website_kompis_install_config(uuid, jsonb) to authenticated;
