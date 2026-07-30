-- AIPIFY.PLATFORM.WEBSITE.STAGING.RELEASE.VERIFICATION.V2
-- Path-based staging on the production host (app.aipify.ai) — no new DNS.
-- Reuses the Website CMS V1/rollback-V1 tables and shared verifier helpers
-- (_website_cms_checksum, _website_cms_verify_runtime, _website_cms_hostname,
-- get_public_website_active_version) so staging exercises the *same* runtime
-- verification path real customers use. Staging drivers are re-implemented
-- here (not the operator/_kompis_operator_require_access() RPCs) because this
-- feature intentionally creates no auth user and no operator session — every
-- write is Platform Super Admin driven.
--
-- No customer seeds. No fixture/run rows inserted on apply. Never uses real
-- customer or pilot names. Staging hostnames are always synthetic subdomains
-- of internal.aipify.ai and are never resolvable in real DNS.

set search_path = public;

-- ---------------------------------------------------------------------------
-- 0. Extend environment_type to allow a dedicated internal harness value
--
-- Also widens to 'production': the live constraint (per Aipify Core) only
-- allows internal/pilot/customer/enterprise, but create_platform_portal_customer
-- (20261934400000) already inserts environment_type = 'production' for every
-- new customer. That insert would violate the current constraint the moment
-- ensure_website_staging_environment below calls it. Widening here fixes that
-- latent gap in addition to adding 'staging'.
-- ---------------------------------------------------------------------------

alter table public.customers
  drop constraint if exists customers_environment_type_check;
alter table public.customers
  add constraint customers_environment_type_check
  check (environment_type in ('internal', 'pilot', 'customer', 'enterprise', 'production', 'staging'));

alter table public.installations
  drop constraint if exists installations_environment_type_check;
alter table public.installations
  add constraint installations_environment_type_check
  check (environment_type in ('internal', 'pilot', 'customer', 'enterprise', 'production', 'staging'));

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------

create table if not exists public.website_staging_environments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid not null references public.customers (id) on delete cascade,
  website_id uuid references public.customer_websites (id) on delete set null,
  domain_id uuid references public.customer_domains (id) on delete set null,
  installation_id uuid references public.installations (id) on delete set null,
  staging_host_key text not null,
  status text not null default 'active'
    check (status in ('active', 'attention', 'archived')),
  retention text not null default 'standard'
    check (retention in ('standard', 'extended')),
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  unique (organization_id),
  unique (staging_host_key)
);

create index if not exists website_staging_environments_status_idx
  on public.website_staging_environments (status, created_at desc);

create table if not exists public.website_staging_fixtures (
  id uuid primary key default gen_random_uuid(),
  environment_id uuid not null references public.website_staging_environments (id) on delete cascade,
  fixture_key text not null,
  page_path text not null,
  locale text not null default 'en',
  initial_checksum text,
  updated_checksum text,
  status text not null default 'active'
    check (status in ('active', 'archived')),
  retention text not null default 'standard'
    check (retention in ('standard', 'extended')),
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  unique (environment_id, fixture_key)
);

create index if not exists website_staging_fixtures_env_idx
  on public.website_staging_fixtures (environment_id, status, created_at desc);

create table if not exists public.website_release_verification_runs (
  id uuid primary key default gen_random_uuid(),
  environment_id uuid not null references public.website_staging_environments (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  website_id uuid references public.customer_websites (id) on delete set null,
  fixture_id uuid references public.website_staging_fixtures (id) on delete set null,
  status text not null default 'pending'
    check (status in ('pending', 'running', 'passed', 'failed', 'partial', 'blocked')),
  current_phase text not null default 'initialized'
    check (current_phase in (
      'initialized', 'first_candidate_built', 'first_preview_created', 'first_published', 'first_verified',
      'second_candidate_built', 'second_preview_created', 'second_published', 'second_verified',
      'rolled_back', 'rollback_verified', 'completed'
    )),
  baseline_version_id uuid references public.customer_website_versions (id) on delete set null,
  first_candidate_id uuid references public.customer_website_versions (id) on delete set null,
  first_publish_operation_id uuid references public.customer_website_operations (id) on delete set null,
  second_candidate_id uuid references public.customer_website_versions (id) on delete set null,
  second_publish_operation_id uuid references public.customer_website_operations (id) on delete set null,
  rollback_operation_id uuid references public.customer_website_operations (id) on delete set null,
  preview_refs jsonb not null default '[]'::jsonb,
  expected_checksums jsonb not null default '{}'::jsonb,
  actual_checksums jsonb not null default '{}'::jsonb,
  started_by uuid,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  safe_error_code text,
  idempotency_key text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, idempotency_key)
);

create index if not exists website_release_verification_runs_env_idx
  on public.website_release_verification_runs (environment_id, started_at desc);
create index if not exists website_release_verification_runs_fixture_idx
  on public.website_release_verification_runs (fixture_id, status);

create table if not exists public.website_staging_access_tokens (
  id uuid primary key default gen_random_uuid(),
  environment_id uuid not null references public.website_staging_environments (id) on delete cascade,
  token_hash text not null,
  expires_at timestamptz not null,
  created_by uuid,
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique (token_hash)
);

create index if not exists website_staging_access_tokens_env_idx
  on public.website_staging_access_tokens (environment_id, expires_at desc);

alter table public.website_staging_environments enable row level security;
alter table public.website_staging_fixtures enable row level security;
alter table public.website_release_verification_runs enable row level security;
alter table public.website_staging_access_tokens enable row level security;

-- No direct table policies — access only via SECURITY DEFINER RPCs below.
revoke all on table public.website_staging_environments from public, anon, authenticated;
revoke all on table public.website_staging_fixtures from public, anon, authenticated;
revoke all on table public.website_release_verification_runs from public, anon, authenticated;
revoke all on table public.website_staging_access_tokens from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------

create or replace function public._website_staging_require_super_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.platform_admins pa
    where pa.auth_user_id = auth.uid()
      and pa.role = 'super_admin'
      and coalesce(pa.status, 'active') = 'active'
  ) then
    raise exception 'PLATFORM_SUPER_ADMIN_REQUIRED' using errcode = 'P0001';
  end if;
end;
$$;

revoke all on function public._website_staging_require_super_admin() from public, anon, authenticated;

create or replace function public._website_staging_key_ok(p_key text)
returns boolean
language sql
immutable
set search_path = public
as $$
  select p_key is not null and char_length(p_key) between 8 and 128;
$$;

revoke all on function public._website_staging_key_ok(text) from public, anon, authenticated;

create or replace function public._website_staging_fixture_key_ok(p_key text)
returns boolean
language sql
immutable
set search_path = public
as $$
  select p_key is not null
    and char_length(p_key) between 3 and 64
    and p_key ~ '^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$';
$$;

revoke all on function public._website_staging_fixture_key_ok(text) from public, anon, authenticated;

create or replace function public._website_staging_page_path_ok(p_path text)
returns boolean
language sql
immutable
set search_path = public
as $$
  select p_path is not null
    and char_length(p_path) between 1 and 200
    and p_path ~ '^/[a-z0-9/-]*$'
    and p_path !~ '\.\.';
$$;

revoke all on function public._website_staging_page_path_ok(text) from public, anon, authenticated;

create or replace function public._website_staging_locale_ok(p_locale text)
returns boolean
language sql
immutable
set search_path = public
as $$
  select p_locale is not null and p_locale ~ '^[a-z]{2}(-[a-z]{2})?$';
$$;

revoke all on function public._website_staging_locale_ok(text) from public, anon, authenticated;

create or replace function public._website_staging_generate_host_key()
returns text
language sql
volatile
set search_path = public
as $$
  select 'wv-staging-' || substr(md5(gen_random_uuid()::text), 1, 12) || '.internal.aipify.ai';
$$;

revoke all on function public._website_staging_generate_host_key() from public, anon, authenticated;

-- Isolation guard: staging hostnames must always be synthetic internal
-- subdomains and must never collide with a real (or other staging) domain.
create or replace function public._website_staging_assert_isolated_domain(p_host text)
returns void
language plpgsql
stable
set search_path = public
as $$
begin
  if p_host is null or btrim(p_host) = '' then
    raise exception 'INVALID_HOSTNAME' using errcode = 'P0001';
  end if;
  if p_host !~ '\.internal\.aipify\.ai$' then
    raise exception 'STAGING_DOMAIN_MUST_BE_INTERNAL' using errcode = 'P0001';
  end if;
  if exists (
    select 1 from public.customer_domains cd
    where lower(btrim(cd.domain)) = lower(p_host)
  ) then
    raise exception 'HOSTNAME_COLLISION' using errcode = 'P0001';
  end if;
end;
$$;

revoke all on function public._website_staging_assert_isolated_domain(text) from public, anon, authenticated;

create or replace function public._website_staging_run_snapshot(p_run public.website_release_verification_runs)
returns jsonb
language sql
stable
set search_path = public
as $$
  select jsonb_build_object(
    'id', p_run.id,
    'environment_id', p_run.environment_id,
    'organization_id', p_run.organization_id,
    'website_id', p_run.website_id,
    'fixture_id', p_run.fixture_id,
    'status', p_run.status,
    'current_phase', p_run.current_phase,
    'baseline_version_id', p_run.baseline_version_id,
    'first_candidate_id', p_run.first_candidate_id,
    'first_publish_operation_id', p_run.first_publish_operation_id,
    'second_candidate_id', p_run.second_candidate_id,
    'second_publish_operation_id', p_run.second_publish_operation_id,
    'rollback_operation_id', p_run.rollback_operation_id,
    'preview_refs', p_run.preview_refs,
    'expected_checksums', p_run.expected_checksums,
    'actual_checksums', p_run.actual_checksums,
    'safe_error_code', p_run.safe_error_code,
    'started_at', p_run.started_at,
    'completed_at', p_run.completed_at,
    'idempotency_key', p_run.idempotency_key,
    'created_at', p_run.created_at,
    'updated_at', p_run.updated_at
  );
$$;

revoke all on function public._website_staging_run_snapshot(public.website_release_verification_runs)
  from public, anon, authenticated;

-- Builds one candidate version directly from a fixture (no kompis drafts —
-- this harness never uses operator/auth-user context). Mirrors the shape of
-- build_customer_website_candidate_from_drafts's page/version bookkeeping.
create or replace function public._website_staging_build_candidate(
  p_website public.customer_websites,
  p_fixture public.website_staging_fixtures,
  p_run_id uuid,
  p_iteration int,
  p_reason text,
  p_user uuid
)
returns public.customer_website_versions
language plpgsql
security definer
set search_path = public
as $$
declare
  v_page_id uuid;
  v_revision_number int;
  v_content jsonb;
  v_seo jsonb;
  v_checksum text;
  v_manifest jsonb;
  v_manifest_checksum text;
  v_version_number int;
  v_previous_version_id uuid;
  v_version public.customer_website_versions;
begin
  select id into v_page_id
  from public.customer_website_pages
  where website_id = p_website.id and path = p_fixture.page_path;

  if v_page_id is null then
    insert into public.customer_website_pages (website_id, organization_id, path, page_type, status)
    values (p_website.id, p_website.organization_id, p_fixture.page_path, 'page', 'active')
    returning id into v_page_id;
  else
    update public.customer_website_pages set updated_at = now() where id = v_page_id;
  end if;

  select coalesce(max(revision_number), 0) + 1
  into v_revision_number
  from public.customer_website_page_revisions
  where page_id = v_page_id and locale = p_fixture.locale;

  v_content := jsonb_build_object(
    'title', 'Website Release Verification',
    'iteration', p_iteration,
    'run_id', p_run_id,
    'generated_at', now()
  );
  v_seo := jsonb_build_object('metaDescription', 'Internal release verification fixture — noindex.');
  v_checksum := public._website_cms_checksum(v_content::text || v_seo::text);

  insert into public.customer_website_page_revisions (
    page_id, website_id, organization_id, locale, revision_number,
    content, seo, content_checksum, created_by
  ) values (
    v_page_id, p_website.id, p_website.organization_id, p_fixture.locale, v_revision_number,
    v_content, v_seo, v_checksum, p_user
  );

  v_manifest := jsonb_build_object(
    'pages', jsonb_build_array(jsonb_build_object(
      'page_id', v_page_id,
      'path', p_fixture.page_path,
      'locale', p_fixture.locale,
      'revision_number', v_revision_number,
      'title', 'Website Release Verification',
      'content', v_content,
      'seo', v_seo,
      'content_checksum', v_checksum
    )),
    'extras', '[]'::jsonb,
    'locales', to_jsonb(array[p_fixture.locale]),
    'default_locale', p_website.default_locale,
    'generated_at', now(),
    'run_id', p_run_id,
    'iteration', p_iteration
  );

  select public._website_cms_checksum(v_manifest::text) into v_manifest_checksum;

  select coalesce(max(version_number), 0) + 1 into v_version_number
  from public.customer_website_versions where website_id = p_website.id;

  select id into v_previous_version_id
  from public.customer_website_versions
  where website_id = p_website.id and version_number = v_version_number - 1;

  insert into public.customer_website_versions (
    website_id, organization_id, version_number, status, previous_version_id,
    manifest, content_checksum, manifest_checksum, change_summary, created_by
  ) values (
    p_website.id, p_website.organization_id, v_version_number, 'candidate', v_previous_version_id,
    v_manifest, v_checksum, v_manifest_checksum, p_reason, p_user
  )
  returning * into v_version;

  return v_version;
end;
$$;

revoke all on function public._website_staging_build_candidate(
  public.customer_websites, public.website_staging_fixtures, uuid, int, text, uuid
) from public, anon, authenticated;

-- Internal-harness equivalent of create_customer_website_version_preview +
-- mark_customer_website_preview_verified (auto-verified — no manual browser
-- preview step exists in this Platform Super Admin driven harness).
create or replace function public._website_staging_auto_preview(
  p_version_id uuid,
  p_locale text,
  p_user uuid
)
returns public.customer_website_versions
language plpgsql
security definer
set search_path = public
as $$
declare
  v_version public.customer_website_versions;
begin
  select * into v_version from public.customer_website_versions where id = p_version_id for update;
  if v_version.id is null then
    raise exception 'VERSION_NOT_FOUND' using errcode = 'P0001';
  end if;

  insert into public.customer_website_previews (
    website_id, organization_id, version_id, created_by, locale, noindex, expires_at
  ) values (
    v_version.website_id, v_version.organization_id, v_version.id, p_user,
    coalesce(p_locale, 'en'), true, now() + interval '1 hour'
  );

  update public.customer_website_versions
  set preview_verified_at = now()
  where id = v_version.id
  returning * into v_version;

  return v_version;
end;
$$;

revoke all on function public._website_staging_auto_preview(uuid, text, uuid) from public, anon, authenticated;

-- Internal-harness publish driver — same status transitions and the same
-- shared _website_cms_verify_runtime() verifier real customer publishes use,
-- re-implemented without _kompis_operator_require_access() (no auth user).
create or replace function public._website_staging_publish_version(
  p_website_id uuid,
  p_candidate_id uuid,
  p_reason text,
  p_key text,
  p_user uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_website public.customer_websites;
  v_candidate public.customer_website_versions;
  v_prior public.customer_website_versions;
  v_hostname text;
  v_verification jsonb;
  v_operation public.customer_website_operations;
begin
  select * into v_website from public.customer_websites where id = p_website_id for update;
  if v_website.id is null then
    raise exception 'WEBSITE_NOT_PROVISIONED' using errcode = 'P0001';
  end if;

  select * into v_candidate from public.customer_website_versions where id = p_candidate_id for update;
  if v_candidate.id is null then
    raise exception 'CANDIDATE_NOT_FOUND' using errcode = 'P0001';
  end if;

  if v_website.current_version_id is not null then
    select * into v_prior from public.customer_website_versions where id = v_website.current_version_id;
  end if;

  update public.customer_website_versions
  set status = 'published'
  where id = v_candidate.id
  returning * into v_candidate;

  if v_prior.id is not null and v_prior.status = 'published' then
    update public.customer_website_versions set status = 'superseded' where id = v_prior.id;
  end if;

  update public.customer_websites
  set current_version_id = v_candidate.id, status = 'ready', updated_at = now()
  where id = v_website.id
  returning * into v_website;

  v_hostname := public._website_cms_hostname(v_website, '{}'::jsonb);
  v_verification := public._website_cms_verify_runtime(v_website, v_candidate, v_hostname);

  insert into public.customer_website_operations (
    website_id, organization_id, operation_kind, candidate_version_id,
    expected_current_version_id, resulting_version_id, status, idempotency_key,
    confirmation, internal_reason, runtime_verification, error_code, created_by
  ) values (
    v_website.id, v_website.organization_id, 'publish', v_candidate.id,
    v_prior.id, v_candidate.id,
    case when coalesce((v_verification ->> 'verified')::boolean, false) then 'active' else 'attention' end,
    p_key, true, p_reason, v_verification,
    case when coalesce((v_verification ->> 'verified')::boolean, false) then null else v_verification ->> 'reason' end,
    p_user
  )
  returning * into v_operation;

  begin
    perform public.record_trust_audit_event(
      v_website.organization_id,
      'website_staging_publish',
      case when v_operation.status = 'active' then 'success' else 'pending' end,
      'website_staging_verification',
      p_reason,
      'platform_super_admin',
      v_website.installation_id,
      jsonb_build_object('website_id', v_website.id, 'operation_id', v_operation.id, 'version_id', v_candidate.id)
    );
  exception
    when others then null;
  end;

  return jsonb_build_object(
    'operation_id', v_operation.id,
    'operation_status', v_operation.status,
    'verification', v_verification,
    'version_id', v_candidate.id
  );
end;
$$;

revoke all on function public._website_staging_publish_version(uuid, uuid, text, text, uuid)
  from public, anon, authenticated;

-- Internal-harness rollback driver — mirrors rollback_customer_website_version.
create or replace function public._website_staging_rollback_version(
  p_website_id uuid,
  p_target_id uuid,
  p_reason text,
  p_key text,
  p_user uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_website public.customer_websites;
  v_target public.customer_website_versions;
  v_prior public.customer_website_versions;
  v_hostname text;
  v_verification jsonb;
  v_operation public.customer_website_operations;
begin
  select * into v_website from public.customer_websites where id = p_website_id for update;
  if v_website.id is null then
    raise exception 'WEBSITE_NOT_PROVISIONED' using errcode = 'P0001';
  end if;

  select * into v_target from public.customer_website_versions where id = p_target_id for update;
  if v_target.id is null then
    raise exception 'TARGET_VERSION_NOT_FOUND' using errcode = 'P0001';
  end if;
  if v_target.status not in ('published', 'superseded') then
    raise exception 'TARGET_NOT_PUBLISHABLE_HISTORY' using errcode = 'P0001';
  end if;

  if v_website.current_version_id is not null then
    select * into v_prior from public.customer_website_versions where id = v_website.current_version_id;
  end if;

  update public.customer_website_versions
  set status = 'published'
  where id = v_target.id
  returning * into v_target;

  if v_prior.id is not null and v_prior.status = 'published' then
    update public.customer_website_versions set status = 'superseded' where id = v_prior.id;
  end if;

  update public.customer_websites
  set current_version_id = v_target.id, status = 'ready', updated_at = now()
  where id = v_website.id
  returning * into v_website;

  v_hostname := public._website_cms_hostname(v_website, '{}'::jsonb);
  v_verification := public._website_cms_verify_runtime(v_website, v_target, v_hostname);

  insert into public.customer_website_operations (
    website_id, organization_id, operation_kind, candidate_version_id,
    expected_current_version_id, resulting_version_id, status, idempotency_key,
    confirmation, internal_reason, runtime_verification, error_code, created_by
  ) values (
    v_website.id, v_website.organization_id, 'rollback', v_target.id,
    v_prior.id, v_target.id,
    case when coalesce((v_verification ->> 'verified')::boolean, false) then 'active' else 'attention' end,
    p_key, true, p_reason, v_verification,
    case when coalesce((v_verification ->> 'verified')::boolean, false) then null else v_verification ->> 'reason' end,
    p_user
  )
  returning * into v_operation;

  begin
    perform public.record_trust_audit_event(
      v_website.organization_id,
      'website_staging_rollback',
      case when v_operation.status = 'active' then 'success' else 'pending' end,
      'website_staging_verification',
      p_reason,
      'platform_super_admin',
      v_website.installation_id,
      jsonb_build_object('website_id', v_website.id, 'operation_id', v_operation.id, 'version_id', v_target.id)
    );
  exception
    when others then null;
  end;

  return jsonb_build_object(
    'operation_id', v_operation.id,
    'operation_status', v_operation.status,
    'verification', v_verification,
    'version_id', v_target.id
  );
end;
$$;

revoke all on function public._website_staging_rollback_version(uuid, uuid, text, text, uuid)
  from public, anon, authenticated;

-- Re-verify the live runtime for a given website/version using the exact
-- same shared verifier real customer publish/rollback/reconcile RPCs use.
create or replace function public._website_staging_verify_current(p_website_id uuid, p_version_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_website public.customer_websites;
  v_version public.customer_website_versions;
  v_hostname text;
begin
  select * into v_website from public.customer_websites where id = p_website_id;
  if v_website.id is null then
    return jsonb_build_object('verified', false, 'reason', 'website_not_provisioned', 'checked_at', now());
  end if;

  select * into v_version from public.customer_website_versions where id = p_version_id;
  if v_version.id is null then
    return jsonb_build_object('verified', false, 'reason', 'version_not_found', 'checked_at', now());
  end if;

  v_hostname := public._website_cms_hostname(v_website, '{}'::jsonb);
  return public._website_cms_verify_runtime(v_website, v_version, v_hostname);
end;
$$;

revoke all on function public._website_staging_verify_current(uuid, uuid) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. Platform RPCs
-- ---------------------------------------------------------------------------

create or replace function public.ensure_website_staging_environment(
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
  v_reason text := nullif(btrim(coalesce(p_internal_reason, '')), '');
  v_key text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_env public.website_staging_environments;
  v_website public.customer_websites;
  v_token_row public.website_staging_access_tokens;
  v_customer_id uuid;
  v_company_id uuid;
  v_org_number text;
  v_slug text;
  v_host text;
  v_installation public.installations;
  v_org_domain public.organization_domains;
  v_customer_domain public.customer_domains;
  v_token text;
  v_token_hash text;
  v_attempt int := 0;
  v_max_attempts int := 6;
  v_ok boolean := false;
begin
  perform public._website_staging_require_super_admin();

  if not public._website_cms_reason_ok(v_reason) then
    raise exception 'INVALID_INTERNAL_REASON' using errcode = 'P0001';
  end if;
  if coalesce(p_confirmation, false) is not true then
    raise exception 'CONFIRMATION_REQUIRED' using errcode = 'P0001';
  end if;
  if not public._website_staging_key_ok(v_key) then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;

  select * into v_env
  from public.website_staging_environments
  where status <> 'archived'
  order by created_at asc
  limit 1;

  if v_env.id is not null then
    select * into v_website from public.customer_websites where id = v_env.website_id;

    select * into v_token_row
    from public.website_staging_access_tokens
    where environment_id = v_env.id and revoked_at is null and expires_at > now()
    order by created_at desc
    limit 1;

    v_token := null;
    if v_token_row.id is null then
      v_token := public.generate_installation_token();
      v_token_hash := public.hash_installation_token(v_token);
      insert into public.website_staging_access_tokens (environment_id, token_hash, expires_at, created_by)
      values (v_env.id, v_token_hash, now() + interval '90 days', auth.uid())
      returning * into v_token_row;
    end if;

    return jsonb_build_object(
      'environment_id', v_env.id,
      'organization_id', v_env.organization_id,
      'website_id', v_env.website_id,
      'installation_id', v_env.installation_id,
      'domain_id', v_env.domain_id,
      'staging_host_key', v_env.staging_host_key,
      'status', v_env.status,
      'created', false,
      'idempotent_replay', true,
      'website', case when v_website.id is null then null else jsonb_build_object(
        'id', v_website.id, 'status', v_website.status, 'current_version_id', v_website.current_version_id
      ) end,
      'access_token', case when v_token is null then null else jsonb_build_object(
        'token', v_token, 'expires_at', v_token_row.expires_at
      ) end,
      'access_token_present', v_token_row.id is not null
    );
  end if;

  -- Global, jurisdiction-neutral staging identity.
  -- Never call create_platform_portal_customer here: that path requires a real
  -- country and legal registration number. Staging must not invent national IDs.
  loop
    v_attempt := v_attempt + 1;
    v_slug := 'website-verification-staging-' || substr(md5(gen_random_uuid()::text), 1, 8);
    -- Explicit internal marker — not a national organisation number format.
    v_org_number := 'INT-STAGING-' || upper(substr(md5(gen_random_uuid()::text), 1, 12));

    begin
      if exists (select 1 from public.companies c where lower(c.slug) = v_slug)
         or exists (select 1 from public.organizations o where lower(o.slug) = v_slug)
         or exists (select 1 from public.customers cu where lower(coalesce(cu.slug, '')) = v_slug) then
        raise exception 'DUPLICATE_SLUG' using errcode = 'P0001';
      end if;

      insert into public.companies (name, slug, is_platform)
      values ('Aipify Internal Website Staging', v_slug, false)
      returning id into v_company_id;

      insert into public.customers (
        customer_number,
        company_id,
        customer_type,
        company_name,
        organization_number,
        email,
        country,
        language,
        status,
        environment_type,
        slug,
        timezone
      ) values (
        public.format_customer_number(nextval('public.customer_number_seq')),
        v_company_id,
        'company',
        'Aipify Internal Website Staging — Non-commercial',
        v_org_number,
        'staging-harness+' || v_slug || '@noreply.aipify.internal',
        -- ISO 3166 user-assigned XX = non-jurisdictional / testing identity.
        -- Not a nation of incorporation and not used for billing or legal KYC.
        'XX',
        'en',
        'active',
        'staging',
        v_slug,
        'UTC'
      )
      returning id into v_customer_id;

      perform public._mta_sync_organization_from_customer(v_customer_id);

      if not exists (select 1 from public.organizations o where o.id = v_customer_id) then
        raise exception 'ORGANIZATION_SYNC_FAILED' using errcode = 'P0001';
      end if;

      v_ok := true;
    exception
      when others then
        v_ok := false;
        if v_attempt >= v_max_attempts then
          raise;
        end if;
    end;

    exit when v_ok;
  end loop;

  if v_customer_id is null or v_company_id is null then
    raise exception 'STAGING_CUSTOMER_CREATE_FAILED' using errcode = 'P0001';
  end if;

  v_host := public._platform_portal_normalize_hostname(public._website_staging_generate_host_key());
  perform public._website_staging_assert_isolated_domain(v_host);

  v_token := public.generate_installation_token();
  v_token_hash := public.hash_installation_token(v_token);

  insert into public.installations (
    company_id, customer_id, system_type, status, installation_token_hash,
    name, site_url, wizard_step, token_expires_at, environment_type, provisioning_status
  ) values (
    v_company_id, v_customer_id, 'custom', 'active', v_token_hash,
    'Website Release Verification Staging', 'https://' || v_host, 3,
    now() + interval '3650 days', 'staging', 'completed'
  )
  returning * into v_installation;

  insert into public.organization_domains (
    organization_id, domain, display_name, domain_status, connected_platform,
    verification_status, verification_method, verified_at, license_status, is_primary, metadata
  ) values (
    v_customer_id, v_host, v_host, 'active', 'custom_website',
    'verified', 'manual', now(), 'included', true,
    jsonb_build_object('issued_by', 'ensure_website_staging_environment', 'purpose', 'release_verification')
  )
  returning * into v_org_domain;

  insert into public.customer_domains (
    customer_id, installation_id, domain, status, verification_status, verification_method, verified_at
  ) values (
    v_customer_id, v_installation.id, v_host, 'active', 'verified', 'manual', now()
  )
  returning * into v_customer_domain;

  update public.installations
  set domain_id = v_customer_domain.id, updated_at = now()
  where id = v_installation.id
  returning * into v_installation;

  v_website := public._website_cms_upsert_website(v_customer_id, v_customer_id, v_host, v_installation.id, true);

  insert into public.website_staging_environments (
    organization_id, customer_id, website_id, domain_id, installation_id,
    staging_host_key, status, retention, created_by
  ) values (
    v_customer_id, v_customer_id, v_website.id, v_customer_domain.id, v_installation.id,
    v_host, 'active', 'standard', auth.uid()
  )
  returning * into v_env;

  insert into public.website_staging_access_tokens (environment_id, token_hash, expires_at, created_by)
  values (v_env.id, v_token_hash, now() + interval '90 days', auth.uid())
  returning * into v_token_row;

  perform public.record_platform_admin_audit_event(
    'platform_website_staging_environment_ensure',
    'website_staging_environment',
    v_env.id::text,
    jsonb_build_object(
      'environment_id', v_env.id,
      'organization_id', v_customer_id,
      'website_id', v_website.id,
      'installation_id', v_installation.id,
      'domain_id', v_customer_domain.id,
      'staging_host_key', v_host,
      'idempotency_key', v_key,
      'internal_reason', v_reason,
      'created', true,
      'identity_class', 'internal_staging_non_commercial',
      'organization_number', v_org_number,
      'country_code', 'XX'
    )
  );

  return jsonb_build_object(
    'environment_id', v_env.id,
    'organization_id', v_env.organization_id,
    'website_id', v_website.id,
    'installation_id', v_installation.id,
    'domain_id', v_customer_domain.id,
    'staging_host_key', v_env.staging_host_key,
    'status', v_env.status,
    'created', true,
    'idempotent_replay', false,
    'website', jsonb_build_object(
      'id', v_website.id, 'status', v_website.status, 'current_version_id', v_website.current_version_id
    ),
    'access_token', jsonb_build_object('token', v_token, 'expires_at', v_token_row.expires_at),
    'access_token_present', true
  );
end;
$$;

revoke all on function public.ensure_website_staging_environment(text, boolean, text) from public, anon;
grant execute on function public.ensure_website_staging_environment(text, boolean, text) to authenticated;

create or replace function public.get_website_staging_verification_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_env public.website_staging_environments;
  v_fixtures jsonb := '[]'::jsonb;
  v_runs jsonb := '[]'::jsonb;
  v_kpis jsonb;
  v_token_present boolean := false;
  v_website public.customer_websites;
  v_customer public.customers;
  v_installation public.installations;
  v_latest public.website_release_verification_runs;
  v_license_active boolean := false;
  v_kompis_capability boolean := false;
  v_canonical_delivery boolean := false;
  v_ack_ok boolean := false;
  v_blockers jsonb := '[]'::jsonb;
  v_duration_seconds integer := null;
  v_checksum_match boolean := false;
  v_expected text := null;
  v_actual text := null;
  v_control jsonb;
begin
  perform public._website_staging_require_super_admin();

  select * into v_env
  from public.website_staging_environments
  where status <> 'archived'
  order by created_at asc
  limit 1;

  if v_env.id is null then
    return jsonb_build_object(
      'environment', null,
      'fixtures', '[]'::jsonb,
      'runs', '[]'::jsonb,
      'kpis', jsonb_build_object(
        'total_runs', 0, 'passed_runs', 0, 'failed_runs', 0, 'blocked_runs', 0, 'last_run_at', null
      ),
      'control', jsonb_build_object(
        'app_license_active', false,
        'website_kompis_capability', false,
        'canonical_delivery', false,
        'acknowledgement_ok', false,
        'noindex_required', true,
        'production_isolation', true,
        'current_version_id', null,
        'current_version_number', null,
        'latest_run_id', null,
        'latest_phase', null,
        'first_publish_present', false,
        'second_publish_present', false,
        'rollback_present', false,
        'expected_checksum', null,
        'actual_checksum', null,
        'checksum_match', false,
        'duration_seconds', null,
        'audit_reference', null,
        'blockers', jsonb_build_array('staging_environment_missing')
      )
    );
  end if;

  select exists (
    select 1 from public.website_staging_access_tokens t
    where t.environment_id = v_env.id and t.revoked_at is null and t.expires_at > now()
  ) into v_token_present;

  select * into v_website from public.customer_websites where id = v_env.website_id;
  select * into v_customer from public.customers where id = v_env.organization_id;
  select * into v_installation from public.installations where id = v_env.installation_id;

  select exists (
    select 1 from public.subscriptions s
    where s.customer_id = v_env.organization_id
      and lower(coalesce(s.status, '')) in ('active', 'trialing')
      and lower(coalesce(s.license_service_status, 'active')) <> 'paused'
  ) into v_license_active;

  select exists (
    select 1 from public.tenant_modules tm
    where tm.tenant_id = v_env.organization_id
      and tm.module_key = 'website_kompis'
      and coalesce(tm.enabled, false) = true
  ) into v_kompis_capability;

  select exists (
    select 1 from public.tenant_modules tm
    where tm.tenant_id = v_env.organization_id
      and tm.module_key = 'website_kompis'
      and coalesce(tm.metadata ->> 'delivery_model', '') = 'canonical_v1'
  ) into v_canonical_delivery;

  v_ack_ok := coalesce(v_website.status in ('ready', 'published'), false)
    or coalesce((
      select true
      from public.tenant_modules tm
      where tm.tenant_id = v_env.organization_id
        and tm.module_key = 'website_kompis'
        and coalesce(tm.metadata ->> 'acknowledgement_status', '') = 'verified'
      limit 1
    ), false);

  select * into v_latest
  from public.website_release_verification_runs
  where environment_id = v_env.id
  order by started_at desc nulls last
  limit 1;

  if v_latest.id is not null then
    v_expected := nullif(v_latest.expected_checksums ->> 'second_candidate', '');
    if v_expected is null then
      v_expected := nullif(v_latest.expected_checksums ->> 'first_candidate', '');
    end if;
    v_actual := nullif(v_latest.actual_checksums #>> '{rollback_verify,content_checksum}', '');
    if v_actual is null then
      v_actual := nullif(v_latest.actual_checksums #>> '{second_verify,content_checksum}', '');
    end if;
    if v_actual is null then
      v_actual := nullif(v_latest.actual_checksums #>> '{first_verify,content_checksum}', '');
    end if;
    v_checksum_match := v_expected is not null and v_actual is not null and v_expected = v_actual;
    if v_latest.started_at is not null and v_latest.completed_at is not null then
      v_duration_seconds := greatest(0, floor(extract(epoch from (v_latest.completed_at - v_latest.started_at)))::integer);
    end if;
    if v_latest.safe_error_code is not null then
      v_blockers := v_blockers || jsonb_build_array(v_latest.safe_error_code);
    end if;
    if v_latest.status in ('failed', 'blocked', 'partial') then
      v_blockers := v_blockers || jsonb_build_array('run_' || v_latest.status);
    end if;
  end if;

  if coalesce(v_customer.environment_type, '') is distinct from 'staging' then
    v_blockers := v_blockers || jsonb_build_array('staging_identity_missing');
  end if;
  if coalesce(v_installation.environment_type, '') is distinct from 'staging' then
    v_blockers := v_blockers || jsonb_build_array('staging_installation_missing');
  end if;
  if coalesce(v_env.staging_host_key, '') not like '%.internal.aipify.ai' then
    v_blockers := v_blockers || jsonb_build_array('staging_host_not_internal');
  end if;
  if not v_token_present then
    v_blockers := v_blockers || jsonb_build_array('signed_preview_missing');
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', f.id,
    'fixture_key', f.fixture_key,
    'page_path', f.page_path,
    'locale', f.locale,
    'status', f.status,
    'retention', f.retention,
    'initial_checksum', f.initial_checksum,
    'updated_checksum', f.updated_checksum,
    'created_at', f.created_at,
    'updated_at', f.updated_at
  ) order by f.created_at desc), '[]'::jsonb)
  into v_fixtures
  from public.website_staging_fixtures f
  where f.environment_id = v_env.id and f.status <> 'archived';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id,
    'fixture_id', r.fixture_id,
    'status', r.status,
    'current_phase', r.current_phase,
    'safe_error_code', r.safe_error_code,
    'started_at', r.started_at,
    'completed_at', r.completed_at,
    'updated_at', r.updated_at,
    'first_publish_operation_id', r.first_publish_operation_id,
    'second_publish_operation_id', r.second_publish_operation_id,
    'rollback_operation_id', r.rollback_operation_id,
    'expected_checksums', r.expected_checksums,
    'actual_checksums', r.actual_checksums
  ) order by r.started_at desc), '[]'::jsonb)
  into v_runs
  from (
    select * from public.website_release_verification_runs
    where environment_id = v_env.id
    order by started_at desc
    limit 25
  ) r;

  select jsonb_build_object(
    'total_runs', count(*),
    'passed_runs', count(*) filter (where status = 'passed'),
    'failed_runs', count(*) filter (where status = 'failed'),
    'blocked_runs', count(*) filter (where status = 'blocked'),
    'last_run_at', max(started_at)
  )
  into v_kpis
  from public.website_release_verification_runs
  where environment_id = v_env.id;

  v_control := jsonb_build_object(
    'app_license_active', v_license_active,
    'website_kompis_capability', v_kompis_capability,
    'canonical_delivery', v_canonical_delivery,
    'acknowledgement_ok', v_ack_ok,
    'noindex_required', true,
    'production_isolation',
      coalesce(v_customer.environment_type, '') = 'staging'
      and coalesce(v_installation.environment_type, '') = 'staging'
      and coalesce(v_env.staging_host_key, '') like '%.internal.aipify.ai'
      and coalesce(v_customer.organization_number, '') like 'INT-STAGING-%',
    'current_version_id', v_website.current_version_id,
    'current_version_number', (
      select wcv.version_number from public.customer_website_versions wcv
      where wcv.id = v_website.current_version_id
    ),
    'latest_run_id', v_latest.id,
    'latest_phase', v_latest.current_phase,
    'first_publish_present', v_latest.first_publish_operation_id is not null,
    'second_publish_present', v_latest.second_publish_operation_id is not null,
    'rollback_present', v_latest.rollback_operation_id is not null,
    'expected_checksum', v_expected,
    'actual_checksum', v_actual,
    'checksum_match', v_checksum_match,
    'duration_seconds', v_duration_seconds,
    'audit_reference', v_latest.id,
    'blockers', coalesce(v_blockers, '[]'::jsonb)
  );

  return jsonb_build_object(
    'environment', jsonb_build_object(
      'id', v_env.id,
      'organization_id', v_env.organization_id,
      'website_id', v_env.website_id,
      'installation_id', v_env.installation_id,
      'domain_id', v_env.domain_id,
      'staging_host_key', v_env.staging_host_key,
      'status', v_env.status,
      'retention', v_env.retention,
      'access_token_present', v_token_present,
      'created_at', v_env.created_at,
      'updated_at', v_env.updated_at
    ),
    'fixtures', v_fixtures,
    'runs', v_runs,
    'kpis', v_kpis,
    'control', v_control
  );
end;
$$;

revoke all on function public.get_website_staging_verification_overview() from public, anon;
grant execute on function public.get_website_staging_verification_overview() to authenticated;

create or replace function public.create_website_staging_fixture(
  p_environment_id uuid,
  p_fixture_key text,
  p_locale text,
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
  v_reason text := nullif(btrim(coalesce(p_internal_reason, '')), '');
  v_key text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_fixture_key text := lower(nullif(btrim(coalesce(p_fixture_key, '')), ''));
  v_locale text := lower(nullif(btrim(coalesce(p_locale, 'en')), ''));
  v_env public.website_staging_environments;
  v_fixture public.website_staging_fixtures;
  v_page_path text;
begin
  perform public._website_staging_require_super_admin();

  if p_environment_id is null then
    raise exception 'INVALID_ENVIRONMENT' using errcode = 'P0001';
  end if;
  if not public._website_staging_fixture_key_ok(v_fixture_key) then
    raise exception 'INVALID_FIXTURE_KEY' using errcode = 'P0001';
  end if;
  if not public._website_staging_locale_ok(v_locale) then
    raise exception 'INVALID_LOCALE' using errcode = 'P0001';
  end if;
  if not public._website_cms_reason_ok(v_reason) then
    raise exception 'INVALID_INTERNAL_REASON' using errcode = 'P0001';
  end if;
  if coalesce(p_confirmation, false) is not true then
    raise exception 'CONFIRMATION_REQUIRED' using errcode = 'P0001';
  end if;
  if not public._website_staging_key_ok(v_key) then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;

  select * into v_env from public.website_staging_environments where id = p_environment_id;
  if v_env.id is null or v_env.status = 'archived' then
    raise exception 'ENVIRONMENT_NOT_AVAILABLE' using errcode = 'P0001';
  end if;

  select * into v_fixture
  from public.website_staging_fixtures
  where environment_id = p_environment_id and fixture_key = v_fixture_key;

  if v_fixture.id is not null then
    if v_fixture.status = 'archived' then
      raise exception 'FIXTURE_ARCHIVED' using errcode = 'P0001';
    end if;
    return jsonb_build_object(
      'id', v_fixture.id,
      'environment_id', v_fixture.environment_id,
      'fixture_key', v_fixture.fixture_key,
      'page_path', v_fixture.page_path,
      'locale', v_fixture.locale,
      'status', v_fixture.status,
      'created', false,
      'idempotent_replay', true
    );
  end if;

  v_page_path := '/website-release-verification/' || v_fixture_key;
  if not public._website_staging_page_path_ok(v_page_path) then
    raise exception 'INVALID_PAGE_PATH' using errcode = 'P0001';
  end if;

  insert into public.website_staging_fixtures (
    environment_id, fixture_key, page_path, locale, status, retention, created_by
  ) values (
    p_environment_id, v_fixture_key, v_page_path, v_locale, 'active', 'standard', auth.uid()
  )
  returning * into v_fixture;

  perform public.record_platform_admin_audit_event(
    'platform_website_staging_fixture_create',
    'website_staging_fixture',
    v_fixture.id::text,
    jsonb_build_object(
      'environment_id', p_environment_id,
      'fixture_id', v_fixture.id,
      'fixture_key', v_fixture_key,
      'idempotency_key', v_key,
      'internal_reason', v_reason
    )
  );

  return jsonb_build_object(
    'id', v_fixture.id,
    'environment_id', v_fixture.environment_id,
    'fixture_key', v_fixture.fixture_key,
    'page_path', v_fixture.page_path,
    'locale', v_fixture.locale,
    'status', v_fixture.status,
    'created', true,
    'idempotent_replay', false
  );
end;
$$;

revoke all on function public.create_website_staging_fixture(uuid, text, text, text, boolean, text)
  from public, anon;
grant execute on function public.create_website_staging_fixture(uuid, text, text, text, boolean, text)
  to authenticated;

create or replace function public.archive_website_staging_fixture(
  p_fixture_id uuid,
  p_confirmation boolean,
  p_internal_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reason text := nullif(btrim(coalesce(p_internal_reason, '')), '');
  v_fixture public.website_staging_fixtures;
  v_active_run_exists boolean := false;
begin
  perform public._website_staging_require_super_admin();

  if coalesce(p_confirmation, false) is not true then
    raise exception 'CONFIRMATION_REQUIRED' using errcode = 'P0001';
  end if;
  if not public._website_cms_reason_ok(v_reason) then
    raise exception 'INVALID_INTERNAL_REASON' using errcode = 'P0001';
  end if;

  select * into v_fixture from public.website_staging_fixtures where id = p_fixture_id for update;
  if v_fixture.id is null then
    raise exception 'FIXTURE_NOT_FOUND' using errcode = 'P0001';
  end if;

  if v_fixture.status = 'archived' then
    return jsonb_build_object('id', v_fixture.id, 'status', v_fixture.status, 'idempotent_replay', true);
  end if;

  select exists (
    select 1 from public.website_release_verification_runs r
    where r.fixture_id = v_fixture.id and r.status in ('pending', 'running')
  ) into v_active_run_exists;

  if v_active_run_exists then
    raise exception 'ACTIVE_RUN_BLOCKING' using errcode = 'P0001';
  end if;

  update public.website_staging_fixtures
  set status = 'archived', archived_at = now(), updated_at = now()
  where id = v_fixture.id
  returning * into v_fixture;

  perform public.record_platform_admin_audit_event(
    'platform_website_staging_fixture_archive',
    'website_staging_fixture',
    v_fixture.id::text,
    jsonb_build_object('fixture_id', v_fixture.id, 'internal_reason', v_reason)
  );

  return jsonb_build_object('id', v_fixture.id, 'status', v_fixture.status, 'idempotent_replay', false);
end;
$$;

revoke all on function public.archive_website_staging_fixture(uuid, boolean, text) from public, anon;
grant execute on function public.archive_website_staging_fixture(uuid, boolean, text) to authenticated;

create or replace function public.start_website_release_verification_run(
  p_environment_id uuid,
  p_fixture_id uuid,
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
  v_reason text := nullif(btrim(coalesce(p_internal_reason, '')), '');
  v_key text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_env public.website_staging_environments;
  v_fixture public.website_staging_fixtures;
  v_existing public.website_release_verification_runs;
  v_active_run_exists boolean := false;
  v_run public.website_release_verification_runs;
  v_user uuid;
begin
  perform public._website_staging_require_super_admin();

  if not public._website_cms_reason_ok(v_reason) then
    raise exception 'INVALID_INTERNAL_REASON' using errcode = 'P0001';
  end if;
  if coalesce(p_confirmation, false) is not true then
    raise exception 'CONFIRMATION_REQUIRED' using errcode = 'P0001';
  end if;
  if not public._website_staging_key_ok(v_key) then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;

  select * into v_env from public.website_staging_environments where id = p_environment_id;
  if v_env.id is null or v_env.status = 'archived' then
    raise exception 'ENVIRONMENT_NOT_AVAILABLE' using errcode = 'P0001';
  end if;

  select * into v_fixture from public.website_staging_fixtures where id = p_fixture_id;
  if v_fixture.id is null or v_fixture.environment_id <> v_env.id or v_fixture.status = 'archived' then
    raise exception 'FIXTURE_NOT_AVAILABLE' using errcode = 'P0001';
  end if;

  select * into v_existing
  from public.website_release_verification_runs
  where organization_id = v_env.organization_id and idempotency_key = v_key;

  if v_existing.id is not null then
    return public._website_staging_run_snapshot(v_existing) || jsonb_build_object('idempotent_replay', true);
  end if;

  select exists (
    select 1 from public.website_release_verification_runs r
    where r.fixture_id = v_fixture.id and r.status in ('pending', 'running')
  ) into v_active_run_exists;

  if v_active_run_exists then
    raise exception 'RUN_ALREADY_ACTIVE' using errcode = 'P0001';
  end if;

  select u.id into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;

  insert into public.website_release_verification_runs (
    environment_id, organization_id, website_id, fixture_id, status, current_phase,
    started_by, started_at, idempotency_key
  ) values (
    v_env.id, v_env.organization_id, v_env.website_id, v_fixture.id, 'pending', 'initialized',
    v_user, now(), v_key
  )
  returning * into v_run;

  perform public.record_platform_admin_audit_event(
    'platform_website_release_verification_run_start',
    'website_release_verification_run',
    v_run.id::text,
    jsonb_build_object(
      'run_id', v_run.id,
      'environment_id', v_env.id,
      'fixture_id', v_fixture.id,
      'idempotency_key', v_key,
      'internal_reason', v_reason
    )
  );

  return public._website_staging_run_snapshot(v_run) || jsonb_build_object('idempotent_replay', false);
end;
$$;

revoke all on function public.start_website_release_verification_run(uuid, uuid, text, boolean, text)
  from public, anon;
grant execute on function public.start_website_release_verification_run(uuid, uuid, text, boolean, text)
  to authenticated;

create or replace function public.get_website_release_verification_run(p_run_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_run public.website_release_verification_runs;
begin
  perform public._website_staging_require_super_admin();

  select * into v_run from public.website_release_verification_runs where id = p_run_id;
  if v_run.id is null then
    raise exception 'RUN_NOT_FOUND' using errcode = 'P0001';
  end if;

  return public._website_staging_run_snapshot(v_run);
end;
$$;

revoke all on function public.get_website_release_verification_run(uuid) from public, anon;
grant execute on function public.get_website_release_verification_run(uuid) to authenticated;

-- Advances the run state machine by exactly one phase per call:
-- draft+candidate -> preview -> publish -> verify -> second revision+candidate
-- -> preview -> publish -> verify -> rollback -> verify -> completed.
-- Idempotent no-op once status is terminal (passed/failed/blocked).
create or replace function public.resume_website_release_verification_run(p_run_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_run public.website_release_verification_runs;
  v_env public.website_staging_environments;
  v_website public.customer_websites;
  v_fixture public.website_staging_fixtures;
  v_user uuid;
  v_candidate public.customer_website_versions;
  v_publish jsonb;
  v_verify jsonb;
begin
  perform public._website_staging_require_super_admin();

  select * into v_run from public.website_release_verification_runs where id = p_run_id for update;
  if v_run.id is null then
    raise exception 'RUN_NOT_FOUND' using errcode = 'P0001';
  end if;

  if v_run.status in ('passed', 'failed', 'blocked') then
    return public._website_staging_run_snapshot(v_run);
  end if;

  select u.id into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;

  select * into v_env from public.website_staging_environments where id = v_run.environment_id;
  if v_env.id is null or v_env.status = 'archived' then
    update public.website_release_verification_runs
    set status = 'blocked', safe_error_code = 'environment_unavailable', completed_at = now(), updated_at = now()
    where id = v_run.id
    returning * into v_run;
    return public._website_staging_run_snapshot(v_run);
  end if;

  select * into v_website from public.customer_websites where id = v_run.website_id for update;
  if v_website.id is null then
    update public.website_release_verification_runs
    set status = 'blocked', safe_error_code = 'website_unavailable', completed_at = now(), updated_at = now()
    where id = v_run.id
    returning * into v_run;
    return public._website_staging_run_snapshot(v_run);
  end if;

  select * into v_fixture from public.website_staging_fixtures where id = v_run.fixture_id;
  if v_fixture.id is null or v_fixture.status = 'archived' then
    update public.website_release_verification_runs
    set status = 'blocked', safe_error_code = 'fixture_unavailable', completed_at = now(), updated_at = now()
    where id = v_run.id
    returning * into v_run;
    return public._website_staging_run_snapshot(v_run);
  end if;

  update public.website_release_verification_runs
  set status = 'running', updated_at = now()
  where id = v_run.id
  returning * into v_run;

  case v_run.current_phase

  when 'initialized' then
    v_candidate := public._website_staging_build_candidate(
      v_website, v_fixture, v_run.id, 1, 'first candidate', v_user
    );
    update public.website_release_verification_runs
    set
      baseline_version_id = v_website.current_version_id,
      first_candidate_id = v_candidate.id,
      current_phase = 'first_candidate_built',
      expected_checksums = expected_checksums || jsonb_build_object('first_candidate', v_candidate.manifest_checksum),
      updated_at = now()
    where id = v_run.id
    returning * into v_run;

  when 'first_candidate_built' then
    perform public._website_staging_auto_preview(v_run.first_candidate_id, v_fixture.locale, v_user);
    update public.website_release_verification_runs
    set current_phase = 'first_preview_created', updated_at = now()
    where id = v_run.id
    returning * into v_run;

  when 'first_preview_created' then
    v_publish := public._website_staging_publish_version(
      v_website.id, v_run.first_candidate_id, 'first publish', v_run.idempotency_key || ':publish1', v_user
    );
    update public.website_release_verification_runs
    set
      first_publish_operation_id = (v_publish ->> 'operation_id')::uuid,
      current_phase = 'first_published',
      actual_checksums = actual_checksums || jsonb_build_object('first_publish', v_publish -> 'verification'),
      updated_at = now()
    where id = v_run.id
    returning * into v_run;
    if not coalesce((v_publish -> 'verification' ->> 'verified')::boolean, false) then
      update public.website_release_verification_runs
      set status = 'failed',
          safe_error_code = coalesce(v_publish -> 'verification' ->> 'reason', 'first_publish_not_verified'),
          completed_at = now(), updated_at = now()
      where id = v_run.id
      returning * into v_run;
    end if;

  when 'first_published' then
    v_verify := public._website_staging_verify_current(v_website.id, v_run.first_candidate_id);
    update public.website_release_verification_runs
    set
      current_phase = 'first_verified',
      actual_checksums = actual_checksums || jsonb_build_object('first_verify', v_verify),
      updated_at = now()
    where id = v_run.id
    returning * into v_run;
    if not coalesce((v_verify ->> 'verified')::boolean, false) then
      update public.website_release_verification_runs
      set status = 'failed', safe_error_code = coalesce(v_verify ->> 'reason', 'first_not_verified'),
          completed_at = now(), updated_at = now()
      where id = v_run.id
      returning * into v_run;
    end if;

  when 'first_verified' then
    v_candidate := public._website_staging_build_candidate(
      v_website, v_fixture, v_run.id, 2, 'second candidate', v_user
    );
    update public.website_release_verification_runs
    set
      second_candidate_id = v_candidate.id,
      current_phase = 'second_candidate_built',
      expected_checksums = expected_checksums || jsonb_build_object('second_candidate', v_candidate.manifest_checksum),
      updated_at = now()
    where id = v_run.id
    returning * into v_run;

  when 'second_candidate_built' then
    perform public._website_staging_auto_preview(v_run.second_candidate_id, v_fixture.locale, v_user);
    update public.website_release_verification_runs
    set current_phase = 'second_preview_created', updated_at = now()
    where id = v_run.id
    returning * into v_run;

  when 'second_preview_created' then
    v_publish := public._website_staging_publish_version(
      v_website.id, v_run.second_candidate_id, 'second publish', v_run.idempotency_key || ':publish2', v_user
    );
    update public.website_release_verification_runs
    set
      second_publish_operation_id = (v_publish ->> 'operation_id')::uuid,
      current_phase = 'second_published',
      actual_checksums = actual_checksums || jsonb_build_object('second_publish', v_publish -> 'verification'),
      updated_at = now()
    where id = v_run.id
    returning * into v_run;
    if not coalesce((v_publish -> 'verification' ->> 'verified')::boolean, false) then
      update public.website_release_verification_runs
      set status = 'failed',
          safe_error_code = coalesce(v_publish -> 'verification' ->> 'reason', 'second_publish_not_verified'),
          completed_at = now(), updated_at = now()
      where id = v_run.id
      returning * into v_run;
    end if;

  when 'second_published' then
    v_verify := public._website_staging_verify_current(v_website.id, v_run.second_candidate_id);
    update public.website_release_verification_runs
    set
      current_phase = 'second_verified',
      actual_checksums = actual_checksums || jsonb_build_object('second_verify', v_verify),
      updated_at = now()
    where id = v_run.id
    returning * into v_run;
    if not coalesce((v_verify ->> 'verified')::boolean, false) then
      update public.website_release_verification_runs
      set status = 'failed', safe_error_code = coalesce(v_verify ->> 'reason', 'second_not_verified'),
          completed_at = now(), updated_at = now()
      where id = v_run.id
      returning * into v_run;
    end if;

  when 'second_verified' then
    v_publish := public._website_staging_rollback_version(
      v_website.id, v_run.first_candidate_id, 'rollback to baseline first candidate',
      v_run.idempotency_key || ':rollback', v_user
    );
    update public.website_release_verification_runs
    set
      rollback_operation_id = (v_publish ->> 'operation_id')::uuid,
      current_phase = 'rolled_back',
      actual_checksums = actual_checksums || jsonb_build_object('rollback', v_publish -> 'verification'),
      updated_at = now()
    where id = v_run.id
    returning * into v_run;
    if not coalesce((v_publish -> 'verification' ->> 'verified')::boolean, false) then
      update public.website_release_verification_runs
      set status = 'failed',
          safe_error_code = coalesce(v_publish -> 'verification' ->> 'reason', 'rollback_not_verified'),
          completed_at = now(), updated_at = now()
      where id = v_run.id
      returning * into v_run;
    end if;

  when 'rolled_back' then
    v_verify := public._website_staging_verify_current(v_website.id, v_run.first_candidate_id);
    update public.website_release_verification_runs
    set
      current_phase = 'rollback_verified',
      actual_checksums = actual_checksums || jsonb_build_object('rollback_verify', v_verify),
      updated_at = now()
    where id = v_run.id
    returning * into v_run;
    if not coalesce((v_verify ->> 'verified')::boolean, false) then
      update public.website_release_verification_runs
      set status = 'failed', safe_error_code = coalesce(v_verify ->> 'reason', 'rollback_not_verified'),
          completed_at = now(), updated_at = now()
      where id = v_run.id
      returning * into v_run;
    end if;

  when 'rollback_verified' then
    update public.website_release_verification_runs
    set current_phase = 'completed', status = 'passed', completed_at = now(), updated_at = now()
    where id = v_run.id
    returning * into v_run;

    perform public.record_platform_admin_audit_event(
      'platform_website_release_verification_run_complete',
      'website_release_verification_run',
      v_run.id::text,
      jsonb_build_object('run_id', v_run.id, 'status', v_run.status)
    );

  when 'completed' then
    null;

  else
    raise exception 'INVALID_PHASE' using errcode = 'P0001';
  end case;

  if v_run.status = 'failed' then
    perform public.record_platform_admin_audit_event(
      'platform_website_release_verification_run_complete',
      'website_release_verification_run',
      v_run.id::text,
      jsonb_build_object('run_id', v_run.id, 'status', v_run.status, 'safe_error_code', v_run.safe_error_code)
    );
  end if;

  return public._website_staging_run_snapshot(v_run);
end;
$$;

revoke all on function public.resume_website_release_verification_run(uuid) from public, anon;
grant execute on function public.resume_website_release_verification_run(uuid) to authenticated;

create or replace function public.verify_website_staging_runtime(p_run_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_run public.website_release_verification_runs;
  v_website public.customer_websites;
  v_verification jsonb;
begin
  perform public._website_staging_require_super_admin();

  select * into v_run from public.website_release_verification_runs where id = p_run_id for update;
  if v_run.id is null then
    raise exception 'RUN_NOT_FOUND' using errcode = 'P0001';
  end if;

  select * into v_website from public.customer_websites where id = v_run.website_id;
  if v_website.id is null or v_website.current_version_id is null then
    v_verification := jsonb_build_object('verified', false, 'reason', 'no_active_version', 'checked_at', now());
  else
    v_verification := public._website_staging_verify_current(v_website.id, v_website.current_version_id);
  end if;

  update public.website_release_verification_runs
  set
    actual_checksums = actual_checksums || jsonb_build_object('manual_reverify', v_verification),
    updated_at = now()
  where id = v_run.id
  returning * into v_run;

  return public._website_staging_run_snapshot(v_run) || jsonb_build_object('runtime_verification', v_verification);
end;
$$;

revoke all on function public.verify_website_staging_runtime(uuid) from public, anon;
grant execute on function public.verify_website_staging_runtime(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Public path-token resolve (no secrets, no install tokens, always noindex)
-- ---------------------------------------------------------------------------

create or replace function public.resolve_website_staging_access_token(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_token text := nullif(btrim(coalesce(p_token, '')), '');
  v_token_hash text;
  v_access public.website_staging_access_tokens;
  v_env public.website_staging_environments;
  v_website public.customer_websites;
  v_version public.customer_website_versions;
begin
  if v_token is null then
    return jsonb_build_object('ok', false, 'reason', 'token_required');
  end if;

  v_token_hash := public.hash_installation_token(v_token);

  select * into v_access
  from public.website_staging_access_tokens
  where token_hash = v_token_hash
    and revoked_at is null
    and expires_at > now();

  if v_access.id is null then
    return jsonb_build_object('ok', false, 'reason', 'invalid_or_expired');
  end if;

  select * into v_env from public.website_staging_environments where id = v_access.environment_id;
  if v_env.id is null or v_env.status = 'archived' then
    return jsonb_build_object('ok', false, 'reason', 'environment_unavailable');
  end if;

  select * into v_website from public.customer_websites where id = v_env.website_id;
  if v_website.id is null or v_website.current_version_id is null then
    return jsonb_build_object('ok', false, 'reason', 'website_not_published');
  end if;

  select * into v_version
  from public.customer_website_versions
  where id = v_website.current_version_id and status = 'published';

  if v_version.id is null then
    return jsonb_build_object('ok', false, 'reason', 'version_not_published');
  end if;

  return jsonb_build_object(
    'ok', true,
    'environment_id', v_env.id,
    'website_id', v_website.id,
    'version_id', v_version.id,
    'version_number', v_version.version_number,
    'default_locale', v_website.default_locale,
    'active_locales', to_jsonb(v_website.active_locales),
    'manifest', v_version.manifest,
    'content_checksum', v_version.content_checksum,
    'manifest_checksum', v_version.manifest_checksum,
    'published_at', v_version.created_at,
    'noindex', true
  );
end;
$$;

revoke all on function public.resolve_website_staging_access_token(text) from public;
grant execute on function public.resolve_website_staging_access_token(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 5. Exclude staging identities from ordinary commercial customer registry

create or replace function public.get_platform_portal_customers()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_customers jsonb := '[]'::jsonb;
  v_total integer := 0;
  v_active integer := 0;
  v_new_30d integer := 0;
  v_requires_attention integer := 0;
begin
  perform public._ppsf258_require_platform_access();

  with scoped as (
    select
      o.id as organization_id,
      cu.id as customer_id,
      co.id as company_id,
      nullif(btrim(co.name), '') as company_name,
      nullif(btrim(cu.company_name), '') as customer_company_name,
      nullif(btrim(o.name), '') as organization_name,
      cu.organization_number,
      o.slug as organization_slug,
      cu.status as customer_status,
      cu.created_at,
      nullif(btrim(cu.full_name), '') as primary_contact_name,
      o.attributed_growth_partner_profile_id,
      nullif(btrim(o.attributed_growth_partner_public_id), '') as attributed_growth_partner_public_id
    from public.organizations o
    join public.customers cu on cu.id = o.id
    join public.companies co on co.id = cu.company_id
    where coalesce(co.is_platform, false) = false
      -- Staging / internal harness identities are never ordinary commercial customers.
      and coalesce(cu.environment_type, 'production') not in ('staging', 'internal')
      and coalesce(cu.organization_number, '') not like 'INT-STAGING-%'
  ),
  primary_subscription as (
    select distinct on (s.customer_id)
      s.customer_id,
      s.status,
      s.plan_key,
      s.plan_type,
      s.plan_name,
      s.billing_cycle,
      s.license_service_status,
      s.payment_overdue_since,
      s.created_at,
      s.updated_at
    from public.subscriptions s
    join scoped sc on sc.customer_id = s.customer_id
    order by
      s.customer_id,
      case lower(coalesce(s.status, ''))
        when 'active' then 1
        when 'trialing' then 2
        when 'past_due' then 3
        when 'unpaid' then 4
        when 'paused' then 5
        else 6
      end,
      s.updated_at desc nulls last,
      s.created_at desc nulls last,
      s.id asc
  ),
  member_stats as (
    select
      sc.company_id,
      count(distinct u.id)::integer as member_count,
      max(u.last_login_at) as last_activity_at
    from scoped sc
    left join public.users u on u.company_id = sc.company_id
    group by sc.company_id
  ),
  support_stats as (
    select
      sc.customer_id,
      count(*)::integer as open_support_count
    from scoped sc
    join public.support_cases scase on scase.tenant_id = sc.customer_id
    where lower(coalesce(scase.status, '')) in ('open', 'in_progress', 'escalated')
    group by sc.customer_id
  ),
  rows as (
    select
      sc.organization_id,
      sc.customer_id,
      sc.company_id,
      coalesce(sc.company_name, sc.customer_company_name, sc.organization_name) as legal_name,
      sc.organization_number,
      sc.organization_slug,
      sc.customer_status,
      sc.created_at,
      ps.status as subscription_status,
      ps.plan_key as subscription_plan_key,
      ps.plan_type as subscription_plan_type,
      ps.plan_name as subscription_plan_name,
      ps.billing_cycle as subscription_billing_cycle,
      ps.created_at as subscription_created_at,
      ps.updated_at as subscription_updated_at,
      (
        lower(coalesce(ps.plan_key, '')) = 'lifetime'
        or lower(coalesce(ps.plan_type, '')) = 'lifetime'
        or lower(coalesce(ps.billing_cycle, '')) = 'lifetime'
      ) as is_lifetime,
      sc.primary_contact_name,
      coalesce(ms.member_count, 0) as member_count,
      ps.license_service_status,
      ps.payment_overdue_since,
      (
        sc.attributed_growth_partner_profile_id is not null
        or sc.attributed_growth_partner_public_id is not null
      ) as is_partner_attributed,
      sc.attributed_growth_partner_profile_id::text as growth_partner_profile_id,
      sc.attributed_growth_partner_public_id as growth_partner_public_id,
      coalesce(ss.open_support_count, 0) as open_support_count,
      ms.last_activity_at,
      (
        ps.customer_id is null
        or lower(coalesce(ps.status, '')) not in ('active', 'trialing')
        or lower(coalesce(ps.status, '')) in ('past_due', 'unpaid', 'paused')
        or lower(coalesce(ps.license_service_status, '')) = 'paused'
      ) as requires_attention
    from scoped sc
    left join primary_subscription ps on ps.customer_id = sc.customer_id
    left join member_stats ms on ms.company_id = sc.company_id
    left join support_stats ss on ss.customer_id = sc.customer_id
  )
  select
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'organization_id', r.organization_id,
          'customer_id', r.customer_id,
          'company_id', r.company_id,
          'legal_name', r.legal_name,
          'organization_number', r.organization_number,
          'organization_slug', r.organization_slug,
          'customer_status', r.customer_status,
          'created_at', r.created_at,
          'subscription_status', r.subscription_status,
          'subscription_plan_key', r.subscription_plan_key,
          'subscription_plan_type', r.subscription_plan_type,
          'subscription_plan_name', r.subscription_plan_name,
          'subscription_billing_cycle', r.subscription_billing_cycle,
          'subscription_created_at', r.subscription_created_at,
          'subscription_updated_at', r.subscription_updated_at,
          'is_lifetime', r.is_lifetime,
          'primary_contact_name', r.primary_contact_name,
          'member_count', r.member_count,
          'license_service_status', r.license_service_status,
          'payment_overdue_since', r.payment_overdue_since,
          'is_partner_attributed', r.is_partner_attributed,
          'growth_partner_profile_id', r.growth_partner_profile_id,
          'growth_partner_public_id', r.growth_partner_public_id,
          'open_support_count', r.open_support_count,
          'last_activity_at', r.last_activity_at,
          'requires_attention', r.requires_attention
        )
        order by
          r.requires_attention desc,
          r.legal_name asc nulls last,
          r.organization_id asc
      ),
      '[]'::jsonb
    ),
    count(*)::integer,
    count(*) filter (
      where lower(coalesce(r.subscription_status, '')) in ('active', 'trialing')
    )::integer,
    count(*) filter (
      where r.created_at >= now() - interval '30 days'
    )::integer,
    count(*) filter (
      where r.requires_attention
    )::integer
  into
    v_customers,
    v_total,
    v_active,
    v_new_30d,
    v_requires_attention
  from rows r;

  return jsonb_build_object(
    'summary', jsonb_build_object(
      'total', coalesce(v_total, 0),
      'active', coalesce(v_active, 0),
      'new_30d', coalesce(v_new_30d, 0),
      'requires_attention', coalesce(v_requires_attention, 0)
    ),
    'customers', coalesce(v_customers, '[]'::jsonb)
  );
end;
$$;

revoke all on function public.get_platform_portal_customers() from public, anon;
grant execute on function public.get_platform_portal_customers() to authenticated;

-- ---------------------------------------------------------------------------
-- 6. Aggregate release-chain readiness (no staging internals for APP consumers)
-- ---------------------------------------------------------------------------

create or replace function public.get_website_release_chain_readiness()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_run public.website_release_verification_runs;
  v_status text := 'code_ready';
begin
  -- Readable by authenticated sessions; never returns tokens, hosts, or fixture paths.
  if auth.uid() is null then
    raise exception 'UNAUTHORIZED' using errcode = 'P0001';
  end if;

  select * into v_run
  from public.website_release_verification_runs
  order by
    case status
      when 'passed' then 1
      when 'running' then 2
      when 'partial' then 3
      when 'failed' then 4
      when 'blocked' then 5
      else 6
    end,
    completed_at desc nulls last,
    created_at desc
  limit 1;

  if v_run.id is null then
    v_status := 'code_ready';
  elsif v_run.status = 'passed'
        and v_run.current_phase = 'completed'
        and v_run.first_publish_operation_id is not null
        and v_run.second_publish_operation_id is not null
        and v_run.rollback_operation_id is not null then
    v_status := 'verified';
  elsif v_run.status = 'running' then
    v_status := 'running';
  elsif v_run.status in ('failed', 'blocked', 'partial') then
    v_status := case when v_run.status = 'blocked' then 'blocked' else 'attention' end;
  else
    v_status := 'code_ready';
  end if;

  return jsonb_build_object(
    'status', v_status,
    'last_completed_at', v_run.completed_at,
    'has_verification_history', v_run.id is not null
  );
end;
$$;

revoke all on function public.get_website_release_chain_readiness() from public, anon;
grant execute on function public.get_website_release_chain_readiness() to authenticated;
