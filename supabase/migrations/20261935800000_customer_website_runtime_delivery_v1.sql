-- AIPIFY.PLATFORM.APP.CUSTOMER.WEBSITE.RUNTIME.DELIVERY.V1
-- Generic installation-bound CMS runtime delivery, acknowledgement, and
-- HTTP verification ledger. No customer seeds. No apply-side HTTP. No
-- domain / install / customer Production mutations. Staging V2 and CMS V1 preserved.

set search_path = public;

-- ---------------------------------------------------------------------------
-- 1. Runtime delivery config (one row per website)
-- ---------------------------------------------------------------------------

create table if not exists public.customer_website_runtime_delivery (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null unique references public.customer_websites (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  installation_id uuid not null references public.installations (id) on delete cascade,
  contract_version text not null default 'customer_website_runtime_v1',
  enabled boolean not null default true,
  homepage_enabled boolean not null default false,
  mounted_paths text[] not null default array[]::text[],
  fallback_mode text not null default 'customer_runtime'
    check (fallback_mode in ('customer_runtime', 'unavailable')),
  config_version int not null default 1 check (config_version >= 1),
  cache_token text not null default '',
  last_ack_at timestamptz,
  last_http_verified_at timestamptz,
  last_fully_verified_at timestamptz,
  suspended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customer_website_runtime_delivery_org_idx
  on public.customer_website_runtime_delivery (organization_id);
create index if not exists customer_website_runtime_delivery_install_idx
  on public.customer_website_runtime_delivery (installation_id);

alter table public.customer_website_runtime_delivery enable row level security;
revoke all on table public.customer_website_runtime_delivery from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Immutable acknowledgement history
-- ---------------------------------------------------------------------------

create table if not exists public.customer_website_runtime_acknowledgements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  website_id uuid not null references public.customer_websites (id) on delete cascade,
  installation_id uuid not null references public.installations (id) on delete cascade,
  version_id uuid not null references public.customer_website_versions (id) on delete cascade,
  path text not null,
  locale text not null,
  observed_manifest_checksum text not null,
  observed_page_checksum text not null,
  expected_manifest_checksum text not null,
  expected_page_checksum text not null,
  runtime_app_version text,
  runtime_deployment_ref text,
  http_status int,
  status text not null
    check (status in ('verified', 'pending', 'attention', 'mismatch', 'stale', 'failed')),
  match_manifest boolean not null default false,
  match_page boolean not null default false,
  match_version boolean not null default false,
  idempotency_key text not null,
  observed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (organization_id, idempotency_key)
);

create index if not exists customer_website_runtime_ack_website_idx
  on public.customer_website_runtime_acknowledgements (website_id, created_at desc);
create index if not exists customer_website_runtime_ack_install_idx
  on public.customer_website_runtime_acknowledgements (installation_id, created_at desc);

alter table public.customer_website_runtime_acknowledgements enable row level security;
revoke all on table public.customer_website_runtime_acknowledgements from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. HTTP verification attempts (no response body stored)
-- ---------------------------------------------------------------------------

create table if not exists public.customer_website_runtime_http_checks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  website_id uuid not null references public.customer_websites (id) on delete cascade,
  installation_id uuid not null references public.installations (id) on delete cascade,
  version_id uuid references public.customer_website_versions (id) on delete set null,
  operation_id uuid references public.customer_website_operations (id) on delete set null,
  requested_url_host text not null,
  requested_path text not null,
  requested_locale text not null default 'en',
  http_status int,
  observed_version_header text,
  observed_manifest_checksum text,
  observed_page_checksum text,
  observed_installation_header text,
  expected_manifest_checksum text,
  expected_page_checksum text,
  expected_version_id uuid,
  status text not null
    check (status in ('verified', 'pending', 'attention', 'mismatch', 'stale', 'failed', 'blocked')),
  failure_reason text,
  redirect_hops int not null default 0,
  checked_at timestamptz not null default now(),
  created_by uuid,
  idempotency_key text not null,
  unique (organization_id, idempotency_key)
);

create index if not exists customer_website_runtime_http_website_idx
  on public.customer_website_runtime_http_checks (website_id, checked_at desc);

alter table public.customer_website_runtime_http_checks enable row level security;
revoke all on table public.customer_website_runtime_http_checks from public, anon, authenticated;

-- Allow pending_runtime on CMS operations (additive; preserves existing values).
alter table public.customer_website_operations
  drop constraint if exists customer_website_operations_status_check;
alter table public.customer_website_operations
  add constraint customer_website_operations_status_check
  check (status in ('pending_verification', 'pending_runtime', 'active', 'attention', 'failed'));

-- ---------------------------------------------------------------------------
-- 4. Helpers
-- ---------------------------------------------------------------------------

create or replace function public._cwr_normalize_path(p_path text)
returns text
language sql
immutable
set search_path = public
as $$
  select case
    when p_path is null or btrim(p_path) = '' or btrim(p_path) = '/' then '/'
    else regexp_replace(
      case when left(btrim(p_path), 1) = '/' then btrim(p_path) else '/' || btrim(p_path) end,
      '/+$',
      ''
    )
  end;
$$;

revoke all on function public._cwr_normalize_path(text) from public, anon, authenticated;

create or replace function public._cwr_path_allowed(
  p_path text,
  p_mounted text[],
  p_homepage_enabled boolean
)
returns boolean
language plpgsql
stable
set search_path = public
as $$
declare
  v_path text := public._cwr_normalize_path(p_path);
  v_item text;
  v_norm text;
begin
  if v_path = '/' then
    return coalesce(p_homepage_enabled, false);
  end if;
  if p_mounted is null or cardinality(p_mounted) = 0 then
    return false;
  end if;
  foreach v_item in array p_mounted loop
    v_norm := public._cwr_normalize_path(v_item);
    if v_norm = v_path then
      return true;
    end if;
  end loop;
  return false;
end;
$$;

revoke all on function public._cwr_path_allowed(text, text[], boolean)
  from public, anon, authenticated;

create or replace function public._cwr_resolve_install(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_install public.installations;
  v_hash text;
  v_module public.tenant_modules;
  v_website public.customer_websites;
  v_domain public.customer_domains;
  v_delivery public.customer_website_runtime_delivery;
  v_version public.customer_website_versions;
  v_ack jsonb;
begin
  if p_token is null or char_length(p_token) < 20 then
    return jsonb_build_object('ok', false, 'reason', 'invalid_token');
  end if;

  v_hash := public.hash_installation_token(p_token);

  select * into v_install
  from public.installations i
  where i.installation_token_hash = v_hash
    and i.revoked_at is null
    and lower(coalesce(i.status, '')) in ('active', 'warning', 'ready', 'installing')
  limit 1;

  if v_install.id is null then
    return jsonb_build_object('ok', false, 'reason', 'invalid_token');
  end if;

  if lower(coalesce(v_install.environment_type, '')) = 'staging' then
    return jsonb_build_object('ok', false, 'reason', 'wrong_environment');
  end if;

  select * into v_module
  from public.tenant_modules tm
  where tm.tenant_id = v_install.customer_id
    and tm.module_key = 'website_kompis'
  limit 1;

  if v_module.id is null
     or coalesce(v_module.enabled, false) is not true
     or coalesce(v_module.licensed, false) is not true then
    return jsonb_build_object('ok', false, 'reason', 'capability_unavailable');
  end if;

  select * into v_domain
  from public.customer_domains cd
  where cd.installation_id = v_install.id
    and cd.customer_id = v_install.customer_id
    and lower(coalesce(cd.status, '')) not in ('removed', 'suspended')
    and (
      lower(coalesce(cd.verification_status, '')) = 'verified'
      or cd.verified_at is not null
    )
  order by cd.verified_at desc nulls last
  limit 1;

  if v_domain.id is null then
    return jsonb_build_object('ok', false, 'reason', 'domain_not_verified');
  end if;

  select * into v_website
  from public.customer_websites w
  where w.organization_id = v_install.customer_id
    and w.status <> 'archived'
    and (
      w.installation_id = v_install.id
      or w.installation_id is null
      or w.domain_id = v_domain.id
    )
  order by (w.installation_id = v_install.id) desc, w.updated_at desc
  limit 1;

  if v_website.id is null then
    return jsonb_build_object('ok', false, 'reason', 'website_not_provisioned');
  end if;

  select * into v_delivery
  from public.customer_website_runtime_delivery d
  where d.website_id = v_website.id;

  if v_delivery.id is not null and v_delivery.suspended_at is not null then
    return jsonb_build_object('ok', false, 'reason', 'runtime_suspended');
  end if;

  if v_delivery.id is not null and coalesce(v_delivery.enabled, true) is not true then
    return jsonb_build_object('ok', false, 'reason', 'runtime_disabled');
  end if;

  if v_website.current_version_id is not null then
    select * into v_version
    from public.customer_website_versions
    where id = v_website.current_version_id
      and status = 'published';
  end if;

  v_ack := public._platform_portal_app_kompis_ack(
    v_install.customer_id,
    v_install.id,
    v_domain.domain
  );

  if coalesce((v_ack ->> 'ok')::boolean, false) is not true then
    return jsonb_build_object('ok', false, 'reason', 'delivery_not_acknowledged');
  end if;

  return jsonb_build_object(
    'ok', true,
    'installation_id', v_install.id,
    'organization_id', v_install.customer_id,
    'company_id', v_install.company_id,
    'environment_type', coalesce(v_install.environment_type, 'production'),
    'domain', v_domain.domain,
    'domain_id', v_domain.id,
    'website_id', v_website.id,
    'website_status', v_website.status,
    'default_locale', v_website.default_locale,
    'active_locales', to_jsonb(v_website.active_locales),
    'version_id', v_version.id,
    'version_number', v_version.version_number,
    'manifest', v_version.manifest,
    'manifest_checksum', v_version.manifest_checksum,
    'content_checksum', v_version.content_checksum,
    'published', v_version.id is not null,
    'delivery_enabled', coalesce(v_delivery.enabled, true),
    'homepage_enabled', coalesce(v_delivery.homepage_enabled, false),
    'mounted_paths', to_jsonb(coalesce(v_delivery.mounted_paths, array[]::text[])),
    'fallback_mode', coalesce(v_delivery.fallback_mode, 'customer_runtime'),
    'config_version', coalesce(v_delivery.config_version, 1),
    'cache_token', coalesce(nullif(v_delivery.cache_token, ''), coalesce(v_version.manifest_checksum, '')),
    'contract_version', coalesce(v_delivery.contract_version, 'customer_website_runtime_v1'),
    'delivery_ack_ok', true
  );
end;
$$;

revoke all on function public._cwr_resolve_install(text) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 5. Runtime read RPCs (anon via install token)
-- ---------------------------------------------------------------------------

create or replace function public.resolve_customer_website_runtime_context(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v jsonb := public._cwr_resolve_install(p_token);
  v_routes jsonb := '[]'::jsonb;
  v_page jsonb;
begin
  if coalesce((v ->> 'ok')::boolean, false) is not true then
    return v;
  end if;

  if coalesce((v ->> 'published')::boolean, false) is not true then
    return jsonb_build_object(
      'ok', true,
      'contract_version', v ->> 'contract_version',
      'published', false,
      'reason', 'website_not_published',
      'installation_ref', left(replace(v ->> 'installation_id', '-', ''), 12),
      'organization_ref', left(replace(v ->> 'organization_id', '-', ''), 12),
      'website_ref', left(replace(v ->> 'website_id', '-', ''), 12),
      'domain', v ->> 'domain',
      'environment', v ->> 'environment_type',
      'default_locale', v ->> 'default_locale',
      'active_locales', v -> 'active_locales',
      'mounted_paths', v -> 'mounted_paths',
      'homepage_enabled', (v ->> 'homepage_enabled')::boolean,
      'acknowledgement_required', true,
      'cache_token', v ->> 'cache_token',
      'config_version', (v ->> 'config_version')::int
    );
  end if;

  for v_page in
    select value
    from jsonb_array_elements(coalesce(v -> 'manifest' -> 'pages', '[]'::jsonb))
  loop
    if public._cwr_path_allowed(
      v_page ->> 'path',
      array(select jsonb_array_elements_text(coalesce(v -> 'mounted_paths', '[]'::jsonb))),
      coalesce((v ->> 'homepage_enabled')::boolean, false)
    ) then
      v_routes := v_routes || jsonb_build_array(jsonb_build_object(
        'path', public._cwr_normalize_path(v_page ->> 'path'),
        'locale', coalesce(v_page ->> 'locale', v ->> 'default_locale')
      ));
    end if;
  end loop;

  return jsonb_build_object(
    'ok', true,
    'contract_version', v ->> 'contract_version',
    'published', true,
    'installation_ref', left(replace(v ->> 'installation_id', '-', ''), 12),
    'organization_ref', left(replace(v ->> 'organization_id', '-', ''), 12),
    'website_ref', left(replace(v ->> 'website_id', '-', ''), 12),
    'domain', v ->> 'domain',
    'environment', v ->> 'environment_type',
    'version_ref', left(replace(v ->> 'version_id', '-', ''), 12),
    'version_number', (v ->> 'version_number')::int,
    'manifest_checksum', v ->> 'manifest_checksum',
    'default_locale', v ->> 'default_locale',
    'active_locales', v -> 'active_locales',
    'published_routes', v_routes,
    'mounted_paths', v -> 'mounted_paths',
    'homepage_enabled', (v ->> 'homepage_enabled')::boolean,
    'fallback_mode', v ->> 'fallback_mode',
    'acknowledgement_required', true,
    'cache_token', v ->> 'cache_token',
    'config_version', (v ->> 'config_version')::int
  );
end;
$$;

revoke all on function public.resolve_customer_website_runtime_context(text) from public;
grant execute on function public.resolve_customer_website_runtime_context(text) to anon, authenticated;

create or replace function public.resolve_customer_website_runtime_manifest(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v jsonb := public._cwr_resolve_install(p_token);
  v_pages jsonb := '[]'::jsonb;
  v_page jsonb;
  v_path text;
begin
  if coalesce((v ->> 'ok')::boolean, false) is not true then
    return v;
  end if;
  if coalesce((v ->> 'published')::boolean, false) is not true then
    return jsonb_build_object('ok', false, 'reason', 'website_not_published');
  end if;

  for v_page in
    select value from jsonb_array_elements(coalesce(v -> 'manifest' -> 'pages', '[]'::jsonb))
  loop
    v_path := public._cwr_normalize_path(v_page ->> 'path');
    if public._cwr_path_allowed(
      v_path,
      array(select jsonb_array_elements_text(coalesce(v -> 'mounted_paths', '[]'::jsonb))),
      coalesce((v ->> 'homepage_enabled')::boolean, false)
    ) then
      v_pages := v_pages || jsonb_build_array(jsonb_build_object(
        'path', v_path,
        'locale', coalesce(v_page ->> 'locale', v ->> 'default_locale'),
        'title', coalesce(v_page ->> 'title', ''),
        'content_checksum', coalesce(v_page ->> 'content_checksum', ''),
        'revision_number', coalesce((v_page ->> 'revision_number')::int, 0)
      ));
    end if;
  end loop;

  return jsonb_build_object(
    'ok', true,
    'contract_version', v ->> 'contract_version',
    'version_ref', left(replace(v ->> 'version_id', '-', ''), 12),
    'version_number', (v ->> 'version_number')::int,
    'manifest_checksum', v ->> 'manifest_checksum',
    'default_locale', v ->> 'default_locale',
    'locales', v -> 'active_locales',
    'pages', v_pages,
    'cache_token', v ->> 'cache_token'
  );
end;
$$;

revoke all on function public.resolve_customer_website_runtime_manifest(text) from public;
grant execute on function public.resolve_customer_website_runtime_manifest(text) to anon, authenticated;

create or replace function public.resolve_customer_website_runtime_page(
  p_token text,
  p_path text,
  p_locale text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v jsonb := public._cwr_resolve_install(p_token);
  v_path text := public._cwr_normalize_path(p_path);
  v_locale text;
  v_page jsonb;
  v_fallback jsonb;
  v_mounted text[];
begin
  if coalesce((v ->> 'ok')::boolean, false) is not true then
    return v;
  end if;
  if coalesce((v ->> 'published')::boolean, false) is not true then
    return jsonb_build_object('ok', false, 'reason', 'website_not_published');
  end if;

  v_mounted := array(select jsonb_array_elements_text(coalesce(v -> 'mounted_paths', '[]'::jsonb)));
  if not public._cwr_path_allowed(v_path, v_mounted, coalesce((v ->> 'homepage_enabled')::boolean, false)) then
    return jsonb_build_object('ok', false, 'reason', 'route_not_mounted');
  end if;

  v_locale := coalesce(nullif(btrim(coalesce(p_locale, '')), ''), v ->> 'default_locale');

  for v_page in
    select value from jsonb_array_elements(coalesce(v -> 'manifest' -> 'pages', '[]'::jsonb))
  loop
    if public._cwr_normalize_path(v_page ->> 'path') = v_path
       and coalesce(v_page ->> 'locale', '') = v_locale then
      return jsonb_build_object(
        'ok', true,
        'contract_version', v ->> 'contract_version',
        'path', v_path,
        'locale', v_locale,
        'fallback_locale', null,
        'version_ref', left(replace(v ->> 'version_id', '-', ''), 12),
        'version_number', (v ->> 'version_number')::int,
        'manifest_checksum', v ->> 'manifest_checksum',
        'page_checksum', coalesce(v_page ->> 'content_checksum', ''),
        'title', coalesce(v_page ->> 'title', ''),
        'content', coalesce(v_page -> 'content', '{}'::jsonb),
        'seo', coalesce(v_page -> 'seo', '{}'::jsonb),
        'robots', 'index, follow',
        'cache_token', v ->> 'cache_token'
      );
    end if;
    if public._cwr_normalize_path(v_page ->> 'path') = v_path
       and coalesce(v_page ->> 'locale', '') = (v ->> 'default_locale') then
      v_fallback := v_page;
    end if;
  end loop;

  if v_fallback is not null and v_locale is distinct from (v ->> 'default_locale') then
    return jsonb_build_object(
      'ok', true,
      'contract_version', v ->> 'contract_version',
      'path', v_path,
      'locale', v ->> 'default_locale',
      'fallback_locale', v ->> 'default_locale',
      'version_ref', left(replace(v ->> 'version_id', '-', ''), 12),
      'version_number', (v ->> 'version_number')::int,
      'manifest_checksum', v ->> 'manifest_checksum',
      'page_checksum', coalesce(v_fallback ->> 'content_checksum', ''),
      'title', coalesce(v_fallback ->> 'title', ''),
      'content', coalesce(v_fallback -> 'content', '{}'::jsonb),
      'seo', coalesce(v_fallback -> 'seo', '{}'::jsonb),
      'robots', 'index, follow',
      'cache_token', v ->> 'cache_token'
    );
  end if;

  return jsonb_build_object('ok', false, 'reason', 'route_not_found');
end;
$$;

revoke all on function public.resolve_customer_website_runtime_page(text, text, text) from public;
grant execute on function public.resolve_customer_website_runtime_page(text, text, text)
  to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 6. Acknowledgement
-- ---------------------------------------------------------------------------

create or replace function public.acknowledge_customer_website_runtime(
  p_token text,
  p_payload jsonb,
  p_idempotency_key text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v jsonb := public._cwr_resolve_install(p_token);
  v_key text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_path text;
  v_locale text;
  v_obs_manifest text;
  v_obs_page text;
  v_obs_version_ref text;
  v_expected_page text := '';
  v_page jsonb;
  v_status text := 'failed';
  v_match_manifest boolean := false;
  v_match_page boolean := false;
  v_match_version boolean := false;
  v_existing public.customer_website_runtime_acknowledgements;
  v_row public.customer_website_runtime_acknowledgements;
  v_mounted text[];
begin
  if coalesce((v ->> 'ok')::boolean, false) is not true then
    return v;
  end if;
  if v_key is null or char_length(v_key) < 8 or char_length(v_key) > 128 then
    return jsonb_build_object('ok', false, 'reason', 'invalid_idempotency_key');
  end if;
  if coalesce((v ->> 'published')::boolean, false) is not true then
    return jsonb_build_object('ok', false, 'reason', 'website_not_published');
  end if;

  select * into v_existing
  from public.customer_website_runtime_acknowledgements
  where organization_id = (v ->> 'organization_id')::uuid
    and idempotency_key = v_key;
  if v_existing.id is not null then
    return jsonb_build_object(
      'ok', true,
      'status', v_existing.status,
      'acknowledgement_id', v_existing.id,
      'idempotent_replay', true
    );
  end if;

  v_path := public._cwr_normalize_path(coalesce(p_payload ->> 'path', ''));
  v_locale := coalesce(nullif(btrim(coalesce(p_payload ->> 'locale', '')), ''), v ->> 'default_locale');
  v_obs_manifest := coalesce(p_payload ->> 'observed_manifest_checksum', '');
  v_obs_page := coalesce(p_payload ->> 'observed_page_checksum', '');
  v_obs_version_ref := coalesce(p_payload ->> 'observed_version_ref', '');

  v_mounted := array(select jsonb_array_elements_text(coalesce(v -> 'mounted_paths', '[]'::jsonb)));
  if not public._cwr_path_allowed(v_path, v_mounted, coalesce((v ->> 'homepage_enabled')::boolean, false)) then
    return jsonb_build_object('ok', false, 'reason', 'route_not_mounted');
  end if;

  for v_page in
    select value from jsonb_array_elements(coalesce(v -> 'manifest' -> 'pages', '[]'::jsonb))
  loop
    if public._cwr_normalize_path(v_page ->> 'path') = v_path
       and coalesce(v_page ->> 'locale', v ->> 'default_locale') = v_locale then
      v_expected_page := coalesce(v_page ->> 'content_checksum', '');
      exit;
    end if;
  end loop;

  if v_expected_page = '' then
    v_status := 'mismatch';
  else
    v_match_manifest := v_obs_manifest is not distinct from coalesce(v ->> 'manifest_checksum', '');
    v_match_page := v_obs_page is not distinct from v_expected_page;
    v_match_version :=
      v_obs_version_ref = ''
      or v_obs_version_ref = left(replace(v ->> 'version_id', '-', ''), 12);
    if v_match_manifest and v_match_page and v_match_version then
      v_status := 'verified';
    else
      v_status := 'mismatch';
    end if;
  end if;

  insert into public.customer_website_runtime_acknowledgements (
    organization_id, website_id, installation_id, version_id,
    path, locale, observed_manifest_checksum, observed_page_checksum,
    expected_manifest_checksum, expected_page_checksum,
    runtime_app_version, runtime_deployment_ref, http_status,
    status, match_manifest, match_page, match_version,
    idempotency_key, observed_at
  ) values (
    (v ->> 'organization_id')::uuid,
    (v ->> 'website_id')::uuid,
    (v ->> 'installation_id')::uuid,
    (v ->> 'version_id')::uuid,
    v_path, v_locale, v_obs_manifest, v_obs_page,
    coalesce(v ->> 'manifest_checksum', ''), v_expected_page,
    nullif(p_payload ->> 'runtime_app_version', ''),
    nullif(p_payload ->> 'runtime_deployment_ref', ''),
    nullif(p_payload ->> 'http_status', '')::int,
    v_status, v_match_manifest, v_match_page, v_match_version,
    v_key,
    coalesce((p_payload ->> 'rendered_at')::timestamptz, now())
  )
  returning * into v_row;

  update public.customer_website_runtime_delivery
  set last_ack_at = case when v_status = 'verified' then now() else last_ack_at end,
      updated_at = now()
  where website_id = (v ->> 'website_id')::uuid;

  perform public.record_trust_audit_event(
    (v ->> 'organization_id')::uuid,
    'customer_website_runtime_acknowledged',
    case when v_status = 'verified' then 'success' else 'pending' end,
    'website_runtime',
    'Runtime acknowledgement recorded',
    'installation',
    (v ->> 'installation_id')::uuid,
    jsonb_build_object(
      'status', v_status,
      'path', v_path,
      'locale', v_locale,
      'match_manifest', v_match_manifest,
      'match_page', v_match_page
    )
  );

  return jsonb_build_object(
    'ok', true,
    'status', v_status,
    'acknowledgement_id', v_row.id,
    'match_manifest', v_match_manifest,
    'match_page', v_match_page,
    'match_version', v_match_version,
    'idempotent_replay', false
  );
end;
$$;

revoke all on function public.acknowledge_customer_website_runtime(text, jsonb, text) from public;
grant execute on function public.acknowledge_customer_website_runtime(text, jsonb, text)
  to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 7. Ensure runtime delivery row + Platform/APP status
-- ---------------------------------------------------------------------------

create or replace function public._cwr_ensure_delivery_row(
  p_website public.customer_websites
)
returns public.customer_website_runtime_delivery
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.customer_website_runtime_delivery;
  v_install uuid := p_website.installation_id;
begin
  if v_install is null then
    select cd.installation_id into v_install
    from public.customer_domains cd
    where cd.id = p_website.domain_id
    limit 1;
  end if;

  select * into v_row
  from public.customer_website_runtime_delivery
  where website_id = p_website.id;

  if v_row.id is not null then
    return v_row;
  end if;

  if v_install is null then
    return null;
  end if;

  insert into public.customer_website_runtime_delivery (
    website_id, organization_id, installation_id, cache_token
  ) values (
    p_website.id, p_website.organization_id, v_install, ''
  )
  returning * into v_row;

  return v_row;
end;
$$;

revoke all on function public._cwr_ensure_delivery_row(public.customer_websites)
  from public, anon, authenticated;

create or replace function public.get_customer_website_runtime_status()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_website public.customer_websites;
  v_delivery public.customer_website_runtime_delivery;
  v_version public.customer_website_versions;
  v_last_ack public.customer_website_runtime_acknowledgements;
  v_last_http public.customer_website_runtime_http_checks;
  v_op public.customer_website_operations;
begin
  begin
    v_access := public._kompis_operator_require_access();
  exception when others then
    return jsonb_build_object('available', false, 'reason', 'access_denied');
  end;
  if coalesce((v_access ->> 'available')::boolean, false) is not true then
    return jsonb_build_object('available', false, 'reason', 'kompis_unavailable');
  end if;

  v_org := (v_access ->> 'organization_id')::uuid;
  select * into v_website from public.customer_websites where organization_id = v_org;
  if v_website.id is null then
    return jsonb_build_object('available', true, 'website_provisioned', false);
  end if;

  v_delivery := public._cwr_ensure_delivery_row(v_website);

  if v_website.current_version_id is not null then
    select * into v_version from public.customer_website_versions where id = v_website.current_version_id;
  end if;

  select * into v_last_ack
  from public.customer_website_runtime_acknowledgements
  where website_id = v_website.id
  order by created_at desc limit 1;

  select * into v_last_http
  from public.customer_website_runtime_http_checks
  where website_id = v_website.id
  order by checked_at desc limit 1;

  select * into v_op
  from public.customer_website_operations
  where website_id = v_website.id
    and operation_kind in ('publish', 'rollback')
  order by created_at desc limit 1;

  return jsonb_build_object(
    'available', true,
    'website_provisioned', true,
    'website_status', v_website.status,
    'contract_version', coalesce(v_delivery.contract_version, 'customer_website_runtime_v1'),
    'runtime_enabled', coalesce(v_delivery.enabled, true) and v_delivery.suspended_at is null,
    'homepage_enabled', coalesce(v_delivery.homepage_enabled, false),
    'mounted_paths', to_jsonb(coalesce(v_delivery.mounted_paths, array[]::text[])),
    'fallback_mode', coalesce(v_delivery.fallback_mode, 'customer_runtime'),
    'config_version', coalesce(v_delivery.config_version, 1),
    'active_version_number', v_version.version_number,
    'manifest_checksum', v_version.manifest_checksum,
    'db_published', v_version.id is not null and v_version.status = 'published',
    'acknowledgement_status', v_last_ack.status,
    'acknowledgement_at', v_last_ack.created_at,
    'http_status', v_last_http.status,
    'http_checked_at', v_last_http.checked_at,
    'last_operation_status', v_op.status,
    'fully_verified',
      coalesce(v_op.status, '') = 'active'
      and coalesce(v_last_ack.status, '') = 'verified'
      and coalesce(v_last_http.status, '') = 'verified',
    'last_fully_verified_at', v_delivery.last_fully_verified_at
  );
end;
$$;

revoke all on function public.get_customer_website_runtime_status() from public, anon;
grant execute on function public.get_customer_website_runtime_status() to authenticated;

create or replace function public.platform_get_customer_website_runtime_status(
  p_organization_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_website public.customer_websites;
  v_delivery public.customer_website_runtime_delivery;
  v_version public.customer_website_versions;
  v_last_ack public.customer_website_runtime_acknowledgements;
  v_last_http public.customer_website_runtime_http_checks;
  v_op public.customer_website_operations;
begin
  if not public.is_platform_admin() then
    raise exception 'PLATFORM_FORBIDDEN' using errcode = 'P0001';
  end if;

  if p_organization_id is null then
    raise exception 'INVALID_ORGANIZATION' using errcode = 'P0001';
  end if;

  select * into v_website from public.customer_websites where organization_id = p_organization_id;
  if v_website.id is null then
    return jsonb_build_object('organization_id', p_organization_id, 'website_provisioned', false);
  end if;

  select * into v_delivery from public.customer_website_runtime_delivery where website_id = v_website.id;
  if v_website.current_version_id is not null then
    select * into v_version from public.customer_website_versions where id = v_website.current_version_id;
  end if;
  select * into v_last_ack from public.customer_website_runtime_acknowledgements
  where website_id = v_website.id order by created_at desc limit 1;
  select * into v_last_http from public.customer_website_runtime_http_checks
  where website_id = v_website.id order by checked_at desc limit 1;
  select * into v_op from public.customer_website_operations
  where website_id = v_website.id and operation_kind in ('publish', 'rollback')
  order by created_at desc limit 1;

  return jsonb_build_object(
    'organization_id', p_organization_id,
    'website_provisioned', true,
    'website_id', v_website.id,
    'installation_id', coalesce(v_delivery.installation_id, v_website.installation_id),
    'contract_version', coalesce(v_delivery.contract_version, 'customer_website_runtime_v1'),
    'runtime_enabled', coalesce(v_delivery.enabled, true) and v_delivery.suspended_at is null,
    'suspended', v_delivery.suspended_at is not null,
    'homepage_enabled', coalesce(v_delivery.homepage_enabled, false),
    'mounted_paths', to_jsonb(coalesce(v_delivery.mounted_paths, array[]::text[])),
    'fallback_mode', coalesce(v_delivery.fallback_mode, 'customer_runtime'),
    'config_version', coalesce(v_delivery.config_version, 1),
    'cache_token', v_delivery.cache_token,
    'active_version_id', v_version.id,
    'active_version_number', v_version.version_number,
    'expected_manifest_checksum', v_version.manifest_checksum,
    'db_published', v_version.id is not null,
    'acknowledgement_status', v_last_ack.status,
    'observed_manifest_checksum', v_last_ack.observed_manifest_checksum,
    'observed_page_checksum', v_last_ack.observed_page_checksum,
    'http_status', v_last_http.status,
    'http_failure_reason', v_last_http.failure_reason,
    'last_operation_status', v_op.status,
    'fully_verified',
      coalesce(v_op.status, '') = 'active'
      and coalesce(v_last_ack.status, '') = 'verified'
      and coalesce(v_last_http.status, '') = 'verified',
    'last_ack_at', v_delivery.last_ack_at,
    'last_http_verified_at', v_delivery.last_http_verified_at,
    'last_fully_verified_at', v_delivery.last_fully_verified_at
  );
end;
$$;

revoke all on function public.platform_get_customer_website_runtime_status(uuid) from public, anon;
grant execute on function public.platform_get_customer_website_runtime_status(uuid) to authenticated;

create or replace function public.platform_update_customer_website_runtime_config(
  p_organization_id uuid,
  p_mounted_paths text[],
  p_homepage_enabled boolean,
  p_enabled boolean,
  p_fallback_mode text,
  p_internal_reason text,
  p_confirmation boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reason text := nullif(btrim(coalesce(p_internal_reason, '')), '');
  v_website public.customer_websites;
  v_delivery public.customer_website_runtime_delivery;
  v_paths text[] := coalesce(p_mounted_paths, array[]::text[]);
  v_norm text[];
  v_item text;
begin
  perform public._platform_require_high_risk_write();
  if coalesce(p_confirmation, false) is not true then
    raise exception 'CONFIRMATION_REQUIRED' using errcode = 'P0001';
  end if;
  if not public._website_cms_reason_ok(v_reason) then
    raise exception 'INVALID_INTERNAL_REASON' using errcode = 'P0001';
  end if;

  select * into v_website from public.customer_websites where organization_id = p_organization_id;
  if v_website.id is null then
    raise exception 'WEBSITE_NOT_PROVISIONED' using errcode = 'P0001';
  end if;

  v_norm := array[]::text[];
  foreach v_item in array v_paths loop
    v_norm := array_append(v_norm, public._cwr_normalize_path(v_item));
  end loop;

  v_delivery := public._cwr_ensure_delivery_row(v_website);
  if v_delivery.id is null then
    raise exception 'INSTALLATION_REQUIRED' using errcode = 'P0001';
  end if;

  update public.customer_website_runtime_delivery
  set
    mounted_paths = v_norm,
    homepage_enabled = coalesce(p_homepage_enabled, false),
    enabled = coalesce(p_enabled, true),
    fallback_mode = case
      when p_fallback_mode in ('customer_runtime', 'unavailable') then p_fallback_mode
      else fallback_mode
    end,
    config_version = config_version + 1,
    cache_token = md5(coalesce(array_to_string(v_norm, ','), '') || now()::text),
    updated_at = now()
  where id = v_delivery.id
  returning * into v_delivery;

  perform public.record_platform_admin_audit_event(
    'platform_customer_website_runtime_config',
    'website',
    p_organization_id::text,
    jsonb_build_object(
      'website_id', v_website.id,
      'mounted_paths', to_jsonb(v_delivery.mounted_paths),
      'homepage_enabled', v_delivery.homepage_enabled,
      'enabled', v_delivery.enabled,
      'internal_reason', v_reason
    )
  );

  return jsonb_build_object(
    'ok', true,
    'config_version', v_delivery.config_version,
    'mounted_paths', to_jsonb(v_delivery.mounted_paths),
    'homepage_enabled', v_delivery.homepage_enabled,
    'enabled', v_delivery.enabled
  );
end;
$$;

revoke all on function public.platform_update_customer_website_runtime_config(uuid, text[], boolean, boolean, text, text, boolean)
  from public, anon;
grant execute on function public.platform_update_customer_website_runtime_config(uuid, text[], boolean, boolean, text, text, boolean)
  to authenticated;

create or replace function public.platform_record_customer_website_runtime_http_check(
  p_organization_id uuid,
  p_path text,
  p_locale text,
  p_requested_host text,
  p_http_status int,
  p_observed_version_header text,
  p_observed_manifest_checksum text,
  p_observed_page_checksum text,
  p_observed_installation_header text,
  p_redirect_hops int,
  p_failure_reason text,
  p_idempotency_key text,
  p_internal_reason text,
  p_confirmation boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reason text := nullif(btrim(coalesce(p_internal_reason, '')), '');
  v_key text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_website public.customer_websites;
  v_delivery public.customer_website_runtime_delivery;
  v_version public.customer_website_versions;
  v_op public.customer_website_operations;
  v_path text := public._cwr_normalize_path(p_path);
  v_locale text := coalesce(nullif(btrim(coalesce(p_locale, '')), ''), 'en');
  v_expected_page text := '';
  v_page jsonb;
  v_status text := 'failed';
  v_existing public.customer_website_runtime_http_checks;
  v_row public.customer_website_runtime_http_checks;
  v_match boolean := false;
begin
  perform public._platform_require_high_risk_write();
  if coalesce(p_confirmation, false) is not true then
    raise exception 'CONFIRMATION_REQUIRED' using errcode = 'P0001';
  end if;
  if not public._website_cms_reason_ok(v_reason) then
    raise exception 'INVALID_INTERNAL_REASON' using errcode = 'P0001';
  end if;
  if v_key is null or char_length(v_key) < 8 then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;

  select * into v_existing
  from public.customer_website_runtime_http_checks
  where organization_id = p_organization_id and idempotency_key = v_key;
  if v_existing.id is not null then
    return jsonb_build_object('ok', true, 'status', v_existing.status, 'idempotent_replay', true, 'check_id', v_existing.id);
  end if;

  select * into v_website from public.customer_websites where organization_id = p_organization_id;
  if v_website.id is null then
    raise exception 'WEBSITE_NOT_PROVISIONED' using errcode = 'P0001';
  end if;
  v_delivery := public._cwr_ensure_delivery_row(v_website);

  if v_website.current_version_id is not null then
    select * into v_version from public.customer_website_versions where id = v_website.current_version_id;
  end if;

  select * into v_op from public.customer_website_operations
  where website_id = v_website.id and operation_kind in ('publish', 'rollback')
  order by created_at desc limit 1;

  if p_failure_reason in ('ssrf_blocked', 'private_ip_blocked', 'redirect_host_blocked', 'timeout', 'body_limit') then
    v_status := 'blocked';
  elsif v_version.id is null then
    v_status := 'failed';
  elsif coalesce(p_http_status, 0) <> 200 then
    v_status := 'mismatch';
  elsif nullif(btrim(coalesce(p_observed_version_header, '')), '') is null
     or nullif(btrim(coalesce(p_observed_manifest_checksum, '')), '') is null
     or nullif(btrim(coalesce(p_observed_page_checksum, '')), '') is null then
    v_status := 'mismatch';
  else
    for v_page in
      select value from jsonb_array_elements(coalesce(v_version.manifest -> 'pages', '[]'::jsonb))
    loop
      if public._cwr_normalize_path(v_page ->> 'path') = v_path
         and coalesce(v_page ->> 'locale', v_website.default_locale) = v_locale then
        v_expected_page := coalesce(v_page ->> 'content_checksum', '');
        exit;
      end if;
    end loop;

    v_match :=
      coalesce(p_observed_manifest_checksum, '') = coalesce(v_version.manifest_checksum, '')
      and coalesce(p_observed_page_checksum, '') = v_expected_page
      and (
        coalesce(p_observed_version_header, '') = v_version.id::text
        or coalesce(p_observed_version_header, '') = left(replace(v_version.id::text, '-', ''), 12)
        or coalesce(p_observed_version_header, '') = v_version.version_number::text
      );
    v_status := case when v_match then 'verified' else 'mismatch' end;
  end if;

  insert into public.customer_website_runtime_http_checks (
    organization_id, website_id, installation_id, version_id, operation_id,
    requested_url_host, requested_path, requested_locale, http_status,
    observed_version_header, observed_manifest_checksum, observed_page_checksum,
    observed_installation_header, expected_manifest_checksum, expected_page_checksum,
    expected_version_id, status, failure_reason, redirect_hops, idempotency_key
  ) values (
    p_organization_id, v_website.id, coalesce(v_delivery.installation_id, v_website.installation_id),
    v_version.id, v_op.id,
    lower(btrim(p_requested_host)), v_path, v_locale, p_http_status,
    p_observed_version_header, p_observed_manifest_checksum, p_observed_page_checksum,
    p_observed_installation_header, coalesce(v_version.manifest_checksum, ''), v_expected_page,
    v_version.id, v_status, p_failure_reason, coalesce(p_redirect_hops, 0), v_key
  )
  returning * into v_row;

  if v_status = 'verified' then
    update public.customer_website_runtime_delivery
    set last_http_verified_at = now(), updated_at = now()
    where id = v_delivery.id;

    -- Full green only when latest ack is also verified for same version.
    if exists (
      select 1 from public.customer_website_runtime_acknowledgements a
      where a.website_id = v_website.id
        and a.version_id = v_version.id
        and a.status = 'verified'
        and a.created_at > now() - interval '24 hours'
    ) and v_op.id is not null and v_op.status in ('pending_runtime', 'pending_verification', 'attention') then
      update public.customer_website_operations
      set status = 'active',
          runtime_verification = coalesce(runtime_verification, '{}'::jsonb) || jsonb_build_object(
            'http_verified', true,
            'acknowledgement_verified', true,
            'fully_verified', true,
            'checked_at', now()
          )
      where id = v_op.id;
      update public.customer_website_runtime_delivery
      set last_fully_verified_at = now(), updated_at = now()
      where id = v_delivery.id;
    end if;
  end if;

  perform public.record_platform_admin_audit_event(
    'platform_customer_website_runtime_http_check',
    'website',
    p_organization_id::text,
    jsonb_build_object(
      'check_id', v_row.id,
      'status', v_status,
      'path', v_path,
      'internal_reason', v_reason
    )
  );

  return jsonb_build_object(
    'ok', true,
    'status', v_status,
    'check_id', v_row.id,
    'fully_verified', exists (
      select 1 from public.customer_website_operations o
      where o.id = v_op.id and o.status = 'active'
    ),
    'idempotent_replay', false
  );
end;
$$;

revoke all on function public.platform_record_customer_website_runtime_http_check(
  uuid, text, text, text, int, text, text, text, text, int, text, text, text, boolean
) from public, anon;
grant execute on function public.platform_record_customer_website_runtime_http_check(
  uuid, text, text, text, int, text, text, text, text, int, text, text, text, boolean
) to authenticated;

-- ---------------------------------------------------------------------------
-- 8. Publish/rollback: DB verify alone → pending_runtime (not full active)
-- ---------------------------------------------------------------------------

create or replace function public.publish_customer_website_candidate(
  p_candidate_id uuid,
  p_expected_current_version_id uuid,
  p_internal_reason text,
  p_confirmation boolean,
  p_idempotency_key text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_user uuid;
  v_role text;
  v_reason text := nullif(btrim(coalesce(p_internal_reason, '')), '');
  v_key text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_website public.customer_websites;
  v_candidate public.customer_website_versions;
  v_prior_version public.customer_website_versions;
  v_existing_operation public.customer_website_operations;
  v_preview_ok boolean := false;
  v_hostname text;
  v_verification jsonb;
  v_operation public.customer_website_operations;
  v_op_status text;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access ->> 'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access ->> 'organization_id')::uuid;
  v_user := (v_access ->> 'user_id')::uuid;
  v_role := lower(coalesce(v_access ->> 'organization_role', ''));

  if v_role not in ('owner', 'admin', 'organization_owner', 'organization_admin') then
    raise exception 'APPROVAL_ROLE_REQUIRED' using errcode = 'P0001';
  end if;
  if coalesce(p_confirmation, false) is not true then
    raise exception 'CONFIRMATION_REQUIRED' using errcode = 'P0001';
  end if;
  if not public._website_cms_reason_ok(v_reason) then
    raise exception 'INVALID_INTERNAL_REASON' using errcode = 'P0001';
  end if;
  if v_key is null or char_length(v_key) < 8 or char_length(v_key) > 128 then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;
  if coalesce((v_access -> 'acknowledgement' ->> 'ok')::boolean, false) is not true then
    raise exception 'DELIVERY_NOT_ACKNOWLEDGED' using errcode = 'P0001';
  end if;

  select * into v_existing_operation
  from public.customer_website_operations
  where organization_id = v_org and idempotency_key = v_key;
  if v_existing_operation.id is not null then
    return jsonb_build_object(
      'operation_id', v_existing_operation.id,
      'status', v_existing_operation.status,
      'resulting_version_id', v_existing_operation.resulting_version_id,
      'runtime_verification', v_existing_operation.runtime_verification,
      'idempotent_replay', true
    );
  end if;

  select * into v_website from public.customer_websites where organization_id = v_org for update;
  if v_website.id is null then
    raise exception 'WEBSITE_NOT_PROVISIONED' using errcode = 'P0001';
  end if;

  select * into v_candidate
  from public.customer_website_versions
  where id = p_candidate_id and website_id = v_website.id
  for update;
  if v_candidate.id is null then
    raise exception 'CANDIDATE_NOT_FOUND' using errcode = 'P0001';
  end if;
  if v_candidate.status <> 'candidate' then
    raise exception 'CANDIDATE_NOT_PUBLISHABLE' using errcode = 'P0001';
  end if;

  if p_expected_current_version_id is null then
    if v_website.current_version_id is not null then
      raise exception 'VERSION_CONFLICT' using errcode = 'P0001';
    end if;
  elsif p_expected_current_version_id is distinct from v_website.current_version_id then
    raise exception 'VERSION_CONFLICT' using errcode = 'P0001';
  end if;

  v_preview_ok := v_candidate.preview_verified_at is not null;
  if not v_preview_ok then
    select exists(
      select 1 from public.customer_website_previews
      where version_id = v_candidate.id and expires_at > now()
    ) into v_preview_ok;
    if v_preview_ok then
      update public.customer_website_versions
      set preview_verified_at = now()
      where id = v_candidate.id
      returning * into v_candidate;
    end if;
  end if;
  if not v_preview_ok then
    raise exception 'PREVIEW_REQUIRED' using errcode = 'P0001';
  end if;

  if v_website.current_version_id is not null then
    select * into v_prior_version from public.customer_website_versions where id = v_website.current_version_id;
  end if;

  update public.customer_website_versions
  set status = 'published'
  where id = v_candidate.id
  returning * into v_candidate;

  if v_prior_version.id is not null and v_prior_version.status = 'published' then
    update public.customer_website_versions
    set status = 'superseded'
    where id = v_prior_version.id;
  end if;

  update public.customer_websites
  set current_version_id = v_candidate.id, status = 'ready', updated_at = now()
  where id = v_website.id
  returning * into v_website;

  perform public._cwr_ensure_delivery_row(v_website);

  v_hostname := public._website_cms_hostname(v_website, v_access);
  v_verification := public._website_cms_verify_runtime(v_website, v_candidate, v_hostname);
  v_verification := coalesce(v_verification, '{}'::jsonb) || jsonb_build_object(
    'db_verified', coalesce((v_verification ->> 'verified')::boolean, false),
    'http_verified', false,
    'acknowledgement_verified', false,
    'fully_verified', false
  );

  if coalesce((v_verification ->> 'verified')::boolean, false) then
    v_op_status := 'pending_runtime';
  else
    v_op_status := 'attention';
  end if;

  insert into public.customer_website_operations (
    website_id, organization_id, operation_kind, candidate_version_id,
    expected_current_version_id, resulting_version_id, status, idempotency_key,
    confirmation, internal_reason, runtime_verification, error_code, created_by
  ) values (
    v_website.id, v_org, 'publish', v_candidate.id,
    p_expected_current_version_id, v_candidate.id,
    v_op_status,
    v_key, true, v_reason, v_verification,
    case when v_op_status = 'attention' then v_verification ->> 'reason' else null end,
    v_user
  )
  returning * into v_operation;

  perform public.record_trust_audit_event(
    v_org,
    'customer_website_published',
    case when v_operation.status = 'pending_runtime' then 'pending' else 'pending' end,
    'website_cms',
    v_reason,
    'operator',
    v_website.installation_id,
    jsonb_build_object(
      'website_id', v_website.id,
      'operation_id', v_operation.id,
      'candidate_version_id', v_candidate.id,
      'previous_version_id', v_prior_version.id,
      'idempotency_key', v_key,
      'db_verified', coalesce((v_verification ->> 'db_verified')::boolean, false),
      'fully_verified', false
    )
  );

  return jsonb_build_object(
    'operation_id', v_operation.id,
    'status', v_operation.status,
    'version_id', v_candidate.id,
    'version_number', v_candidate.version_number,
    'resulting_version_id', v_operation.resulting_version_id,
    'runtime_verification', v_verification,
    'idempotent_replay', false
  );
end;
$$;

revoke all on function public.publish_customer_website_candidate(uuid, uuid, text, boolean, text)
  from public, anon;
grant execute on function public.publish_customer_website_candidate(uuid, uuid, text, boolean, text)
  to authenticated;

-- Rollback: same pending_runtime contract (DB ok ≠ not fully green).
create or replace function public.rollback_customer_website_version(
  p_target_version_id uuid,
  p_expected_current_version_id uuid,
  p_internal_reason text,
  p_confirmation boolean,
  p_idempotency_key text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_user uuid;
  v_role text;
  v_reason text := nullif(btrim(coalesce(p_internal_reason, '')), '');
  v_key text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_website public.customer_websites;
  v_target public.customer_website_versions;
  v_prior public.customer_website_versions;
  v_existing_operation public.customer_website_operations;
  v_hostname text;
  v_verification jsonb;
  v_operation public.customer_website_operations;
  v_op_status text;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access ->> 'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access ->> 'organization_id')::uuid;
  v_user := (v_access ->> 'user_id')::uuid;
  v_role := lower(coalesce(v_access ->> 'organization_role', ''));

  if v_role not in ('owner', 'admin', 'organization_owner', 'organization_admin') then
    raise exception 'APPROVAL_ROLE_REQUIRED' using errcode = 'P0001';
  end if;
  if coalesce(p_confirmation, false) is not true then
    raise exception 'CONFIRMATION_REQUIRED' using errcode = 'P0001';
  end if;
  if not public._website_cms_reason_ok(v_reason) then
    raise exception 'INVALID_INTERNAL_REASON' using errcode = 'P0001';
  end if;
  if v_key is null or char_length(v_key) < 8 or char_length(v_key) > 128 then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;

  select * into v_existing_operation
  from public.customer_website_operations
  where organization_id = v_org and idempotency_key = v_key;
  if v_existing_operation.id is not null then
    return jsonb_build_object(
      'operation_id', v_existing_operation.id,
      'status', v_existing_operation.status,
      'resulting_version_id', v_existing_operation.resulting_version_id,
      'runtime_verification', v_existing_operation.runtime_verification,
      'idempotent_replay', true
    );
  end if;

  select * into v_website from public.customer_websites where organization_id = v_org for update;
  if v_website.id is null then
    raise exception 'WEBSITE_NOT_PROVISIONED' using errcode = 'P0001';
  end if;
  if p_expected_current_version_id is distinct from v_website.current_version_id then
    raise exception 'VERSION_CONFLICT' using errcode = 'P0001';
  end if;

  select * into v_target
  from public.customer_website_versions
  where id = p_target_version_id and website_id = v_website.id;
  if v_target.id is null then
    raise exception 'TARGET_VERSION_NOT_FOUND' using errcode = 'P0001';
  end if;
  if v_target.status not in ('published', 'superseded') then
    raise exception 'TARGET_NOT_ROLLBACKABLE' using errcode = 'P0001';
  end if;

  if v_website.current_version_id is not null then
    select * into v_prior from public.customer_website_versions where id = v_website.current_version_id;
  end if;

  update public.customer_website_versions
  set status = 'published'
  where id = v_target.id
  returning * into v_target;

  if v_prior.id is not null and v_prior.id is distinct from v_target.id and v_prior.status = 'published' then
    update public.customer_website_versions
    set status = 'superseded'
    where id = v_prior.id;
  end if;

  update public.customer_websites
  set current_version_id = v_target.id, status = 'ready', updated_at = now()
  where id = v_website.id
  returning * into v_website;

  perform public._cwr_ensure_delivery_row(v_website);

  v_hostname := public._website_cms_hostname(v_website, v_access);
  v_verification := public._website_cms_verify_runtime(v_website, v_target, v_hostname);
  v_verification := coalesce(v_verification, '{}'::jsonb) || jsonb_build_object(
    'db_verified', coalesce((v_verification ->> 'verified')::boolean, false),
    'http_verified', false,
    'acknowledgement_verified', false,
    'fully_verified', false
  );

  v_op_status := case
    when coalesce((v_verification ->> 'verified')::boolean, false) then 'pending_runtime'
    else 'attention'
  end;

  insert into public.customer_website_operations (
    website_id, organization_id, operation_kind, candidate_version_id,
    expected_current_version_id, resulting_version_id, status, idempotency_key,
    confirmation, internal_reason, runtime_verification, error_code, created_by
  ) values (
    v_website.id, v_org, 'rollback', v_target.id,
    p_expected_current_version_id, v_target.id,
    v_op_status, v_key, true, v_reason, v_verification,
    case when v_op_status = 'attention' then v_verification ->> 'reason' else null end,
    v_user
  )
  returning * into v_operation;

  perform public.record_trust_audit_event(
    v_org,
    'customer_website_rolled_back',
    'pending',
    'website_cms',
    v_reason,
    'operator',
    v_website.installation_id,
    jsonb_build_object(
      'website_id', v_website.id,
      'operation_id', v_operation.id,
      'target_version_id', v_target.id,
      'previous_version_id', v_prior.id,
      'fully_verified', false
    )
  );

  return jsonb_build_object(
    'operation_id', v_operation.id,
    'status', v_operation.status,
    'version_id', v_target.id,
    'version_number', v_target.version_number,
    'resulting_version_id', v_operation.resulting_version_id,
    'runtime_verification', v_verification,
    'idempotent_replay', false
  );
end;
$$;

revoke all on function public.rollback_customer_website_version(uuid, uuid, text, boolean, text)
  from public, anon;
grant execute on function public.rollback_customer_website_version(uuid, uuid, text, boolean, text)
  to authenticated;
