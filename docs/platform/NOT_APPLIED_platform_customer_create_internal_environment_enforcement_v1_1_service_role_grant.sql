-- =============================================================================
-- NOT_APPLIED — EXECUTABLE DRAFT — DO NOT AUTO-DEPLOY — DO NOT EXECUTE WITHOUT
-- A SEPARATE NAMED OWNER APPLY YES THAT CITES THIS FILE PATH AND SHA-256.
-- =============================================================================
-- Contract: platform_customer_create_internal_environment_enforcement_v1_1
-- Job: AIPIFY_KOMPIS_BEDRIFT_D2J_SERVICE_ROLE_GRANT_COMPATIBILITY_REPAIR_V1
--
-- SUPERSEDES (do NOT apply the older SHA):
--   docs/platform/NOT_APPLIED_platform_customer_create_internal_environment_enforcement_v1.sql
--   SHA-256 83056fb8fbf9c80293da68237ef8a4045ddfae96257669c8de7e5a4b6890733b
--   Reason (D2I RO): Production ACL is authenticated + service_role EXECUTE.
--   D2G v1 granted authenticated only after DROP/CREATE of the 5-arg overload.
--
-- LOCATION RULE:
--   This file lives under docs/platform/ and MUST NOT be copied into
--   supabase/migrations/ or applied by CI/automatic migration runners until
--   an owner-named apply job explicitly relocates/applies it.
--
-- Prior history:
--   Comment-only sketch:
--     docs/platform/NOT_APPLIED_platform_customer_create_environment_type_contract_v1.sql
--     SHA-256 91eb68b5511c5d940abd6d00d949831a1ab295ca6d6277cea198b622e36f7c5f
--   D2G executable v1 (superseded for apply):
--     docs/platform/NOT_APPLIED_platform_customer_create_internal_environment_enforcement_v1.sql
--     SHA-256 83056fb8fbf9c80293da68237ef8a4045ddfae96257669c8de7e5a4b6890733b
--
-- Baseline (verified from repo migrations + D2I Production RO):
--   create_platform_portal_customer(text×5) hardcodes environment_type='production'
--     (20261934400000_platform_portal_customer_creation_global_identity.sql)
--   Production ACL today: authenticated=X, service_role=X (anon/public revoked)
--   customers.environment_type check allows
--     internal|pilot|customer|enterprise|production|staging
--     (20261935700000_platform_website_staging_verification_v2.sql)
--   Platform portal access = super_admin OR platform_support
--     (_ppsf258_require_platform_access)
--
-- Overload handling:
--   DROP the live 5-arg overload first, then CREATE the 6-arg form with
--   p_environment_type default 'production'. No dual-overload window intended.
--
-- EXPLICIT NON-GOALS OF APPLYING THIS FILE:
--   ZERO sandbox / tenant seed inserts (no legal names, orgnr, emails, slugs)
--   ZERO auth user / invite / membership writes
--   ZERO Bedrift / license grants
--   ZERO legal acceptance fabrication
--   ZERO flip of Platform execute flags
--   ZERO mutation of existing customers.environment_type values
--   ZERO EXECUTE grant to anon / PUBLIC
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) Active Platform super_admin probe (fail-closed when auth.uid() absent)
-- ---------------------------------------------------------------------------
create or replace function public._platform_portal_is_active_super_admin()
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
      and pa.role = 'super_admin'
      and coalesce(pa.status, 'active') = 'active'
  );
$$;

revoke all on function public._platform_portal_is_active_super_admin() from public, anon;
grant execute on function public._platform_portal_is_active_super_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- 2) Fail-closed internal-create allow gate (always false until a later job)
-- ---------------------------------------------------------------------------
create or replace function public._platform_portal_internal_customer_create_authorized()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  -- Fail closed. A separate named owner job must replace this body or add an
  -- allowlist before any internal create can succeed — even for super_admin.
  select false;
$$;

revoke all on function public._platform_portal_internal_customer_create_authorized()
  from public, anon;
grant execute on function public._platform_portal_internal_customer_create_authorized()
  to authenticated;

-- ---------------------------------------------------------------------------
-- 3) Reject commercial / public exposure for environment_type = internal
-- ---------------------------------------------------------------------------
create or replace function public._platform_portal_reject_internal_customer_external_exposure()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_env text;
begin
  if tg_table_name = 'subscriptions' then
    v_customer_id := new.customer_id;
  elsif tg_table_name = 'aipify_billing_license_links' then
    v_customer_id := new.organization_id;
  elsif tg_table_name = 'organization_domains' then
    v_customer_id := new.organization_id;
  elsif tg_table_name = 'customer_domains' then
    v_customer_id := new.customer_id;
  elsif tg_table_name = 'installations' then
    v_customer_id := new.customer_id;
  else
    return new;
  end if;

  if v_customer_id is null then
    return new;
  end if;

  select lower(coalesce(cu.environment_type, 'production'))
  into v_env
  from public.customers cu
  where cu.id = v_customer_id;

  if v_env = 'internal' then
    raise exception 'INTERNAL_CUSTOMER_EXTERNAL_EXPOSURE_FORBIDDEN'
      using errcode = 'P0001',
            hint = format('%s.%s', tg_table_name, tg_op);
  end if;

  return new;
end;
$$;

revoke all on function public._platform_portal_reject_internal_customer_external_exposure()
  from public, anon, authenticated;

drop trigger if exists trg_block_internal_customer_subscriptions
  on public.subscriptions;
create trigger trg_block_internal_customer_subscriptions
  before insert or update on public.subscriptions
  for each row
  execute function public._platform_portal_reject_internal_customer_external_exposure();

drop trigger if exists trg_block_internal_customer_license_links
  on public.aipify_billing_license_links;
create trigger trg_block_internal_customer_license_links
  before insert or update on public.aipify_billing_license_links
  for each row
  execute function public._platform_portal_reject_internal_customer_external_exposure();

drop trigger if exists trg_block_internal_customer_organization_domains
  on public.organization_domains;
create trigger trg_block_internal_customer_organization_domains
  before insert or update on public.organization_domains
  for each row
  execute function public._platform_portal_reject_internal_customer_external_exposure();

drop trigger if exists trg_block_internal_customer_customer_domains
  on public.customer_domains;
create trigger trg_block_internal_customer_customer_domains
  before insert or update on public.customer_domains
  for each row
  execute function public._platform_portal_reject_internal_customer_external_exposure();

drop trigger if exists trg_block_internal_customer_installations
  on public.installations;
create trigger trg_block_internal_customer_installations
  before insert or update on public.installations
  for each row
  execute function public._platform_portal_reject_internal_customer_external_exposure();

-- ---------------------------------------------------------------------------
-- 4) environment_type immutable after insert (no silent escalate/downgrade)
-- ---------------------------------------------------------------------------
create or replace function public._platform_portal_customers_environment_type_immutable()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.environment_type is distinct from old.environment_type then
    raise exception 'ENVIRONMENT_TYPE_IMMUTABLE'
      using errcode = 'P0001';
  end if;
  return new;
end;
$$;

revoke all on function public._platform_portal_customers_environment_type_immutable()
  from public, anon, authenticated;

drop trigger if exists trg_customers_environment_type_immutable
  on public.customers;
create trigger trg_customers_environment_type_immutable
  before update on public.customers
  for each row
  execute function public._platform_portal_customers_environment_type_immutable();

-- ---------------------------------------------------------------------------
-- 5) create_platform_portal_customer — add p_environment_type (default production)
--    Drop prior 5-arg overload so callers resolve the 6-arg defaulted signature.
-- ---------------------------------------------------------------------------
drop function if exists public.create_platform_portal_customer(text, text, text, text, text);

create or replace function public.create_platform_portal_customer(
  p_organization_number text,
  p_legal_name text,
  p_display_name text,
  p_slug text,
  p_country text default null,
  p_environment_type text default 'production'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_number text;
  v_legal_name text;
  v_display_name text;
  v_slug text;
  v_country text;
  v_environment_type text;
  v_company_id uuid;
  v_customer_id uuid;
  v_customer_number text;
  v_placeholder_email text;
  v_created_at timestamptz;
  v_status text;
  v_existing_id uuid;
  v_timezone text;
  v_is_super_admin boolean;
  v_internal_authorized boolean;
begin
  perform public._ppsf258_require_platform_access();

  v_environment_type := lower(nullif(btrim(coalesce(p_environment_type, '')), ''));
  if v_environment_type is null then
    v_environment_type := 'production';
  end if;

  if v_environment_type not in ('production', 'internal') then
    raise exception 'INVALID_ENVIRONMENT_TYPE' using errcode = 'P0001';
  end if;

  if v_environment_type = 'internal' then
    v_is_super_admin := public._platform_portal_is_active_super_admin();
    v_internal_authorized := public._platform_portal_internal_customer_create_authorized();

    if not v_is_super_admin then
      raise exception 'INTERNAL_ENVIRONMENT_SUPER_ADMIN_REQUIRED' using errcode = 'P0001';
    end if;

    if not v_internal_authorized then
      raise exception 'INTERNAL_ENVIRONMENT_NOT_AUTHORIZED' using errcode = 'P0001';
    end if;
  end if;

  v_country := upper(nullif(btrim(coalesce(p_country, '')), ''));
  if v_country is null or length(v_country) <> 2 or v_country !~ '^[A-Z]{2}$' then
    raise exception 'INVALID_COUNTRY' using errcode = 'P0001';
  end if;

  if v_country = 'NO' then
    v_org_number := regexp_replace(coalesce(p_organization_number, ''), '\D', '', 'g');
    if length(v_org_number) <> 9 then
      raise exception 'INVALID_ORGANIZATION_NUMBER' using errcode = 'P0001';
    end if;
  else
    v_org_number := nullif(btrim(coalesce(p_organization_number, '')), '');
    if v_org_number is null
       or char_length(v_org_number) < 2
       or char_length(v_org_number) > 64 then
      raise exception 'INVALID_ORGANIZATION_NUMBER' using errcode = 'P0001';
    end if;
  end if;

  v_legal_name := nullif(btrim(coalesce(p_legal_name, '')), '');
  v_display_name := nullif(btrim(coalesce(p_display_name, '')), '');
  if v_legal_name is null then
    raise exception 'INVALID_LEGAL_NAME' using errcode = 'P0001';
  end if;
  if v_display_name is null then
    v_display_name := v_legal_name;
  end if;

  v_slug := lower(btrim(coalesce(p_slug, '')));
  v_slug := regexp_replace(v_slug, '[^a-z0-9]+', '-', 'g');
  v_slug := regexp_replace(v_slug, '-+', '-', 'g');
  v_slug := trim(both '-' from v_slug);
  if v_slug is null or v_slug = '' or length(v_slug) < 2 or length(v_slug) > 64 then
    raise exception 'INVALID_SLUG' using errcode = 'P0001';
  end if;

  if v_slug in (
    'platform', 'app', 'admin', 'super', 'api', 'login', 'auth',
    'my-company-1', 'aipify', 'aipify-group', 'aipify-internal'
  ) then
    raise exception 'RESERVED_SLUG' using errcode = 'P0001';
  end if;

  if v_slug = 'unonight' and exists (
    select 1
    from public.organizations o
    where lower(o.slug) = 'unonight'
  ) then
    raise exception 'RESERVED_SLUG' using errcode = 'P0001';
  end if;

  -- Country-aware duplicate protection on ordinary customers only.
  select cu.id
  into v_existing_id
  from public.customers cu
  join public.companies co on co.id = cu.company_id
  where upper(coalesce(nullif(btrim(cu.country), ''), '')) = v_country
    and (
      case
        when v_country = 'NO' then
          regexp_replace(coalesce(cu.organization_number, ''), '\D', '', 'g') = v_org_number
        else
          lower(btrim(coalesce(cu.organization_number, ''))) = lower(v_org_number)
      end
    )
    and coalesce(co.is_platform, false) = false
    and co.id <> '2697c432-d03d-44f6-839c-66200fd20b55'::uuid
    and cu.id <> '97a4bbcd-a223-47bd-9a3e-eadab02aaf1c'::uuid
    and co.id <> '9a2a6eab-e47d-4473-9fd5-baee226d4db7'::uuid
  limit 1;

  if v_existing_id is not null then
    raise exception 'DUPLICATE_ORGANIZATION_NUMBER' using errcode = 'P0001';
  end if;

  if exists (
    select 1 from public.companies c where lower(c.slug) = v_slug
  ) or exists (
    select 1 from public.organizations o where lower(o.slug) = v_slug
  ) or exists (
    select 1 from public.customers cu where lower(coalesce(cu.slug, '')) = v_slug
  ) then
    raise exception 'DUPLICATE_SLUG' using errcode = 'P0001';
  end if;

  insert into public.companies (name, slug, is_platform)
  values (v_display_name, v_slug, false)
  returning id into v_company_id;

  if v_company_id in (
    '2697c432-d03d-44f6-839c-66200fd20b55'::uuid,
    '9a2a6eab-e47d-4473-9fd5-baee226d4db7'::uuid
  ) then
    raise exception 'EXCLUDED_IDENTITY' using errcode = 'P0001';
  end if;

  v_customer_number := public.format_customer_number(nextval('public.customer_number_seq'));
  -- Schema requires email NOT NULL; store a non-contact system placeholder only.
  -- Never return this value from Platform Portal APIs.
  v_placeholder_email := 'platform-provisioned+' || v_slug || '@noreply.aipify.internal';
  v_timezone := case when v_country = 'NO' then 'Europe/Oslo' else 'UTC' end;

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
    v_customer_number,
    v_company_id,
    'company',
    v_legal_name,
    v_org_number,
    v_placeholder_email,
    v_country,
    'en',
    'active',
    v_environment_type,
    v_slug,
    v_timezone
  )
  returning id, status, created_at into v_customer_id, v_status, v_created_at;

  if v_customer_id = '97a4bbcd-a223-47bd-9a3e-eadab02aaf1c'::uuid then
    raise exception 'EXCLUDED_IDENTITY' using errcode = 'P0001';
  end if;

  perform public._mta_sync_organization_from_customer(v_customer_id);

  if not exists (
    select 1 from public.organizations o where o.id = v_customer_id
  ) then
    raise exception 'ORGANIZATION_SYNC_FAILED' using errcode = 'P0001';
  end if;

  begin
    perform public.record_platform_admin_audit_event(
      'platform_customer_created',
      'organization',
      v_customer_id::text,
      jsonb_build_object(
        'company_id', v_company_id,
        'slug', v_slug,
        'organization_number', v_org_number,
        'country', v_country,
        'environment_type', v_environment_type,
        'actor_is_super_admin', public._platform_portal_is_active_super_admin(),
        'internal_create_authorized',
          case
            when v_environment_type = 'internal' then true
            else null
          end
      )
    );
  exception
    when others then
      -- Audit must not block identity creation after successful writes.
      null;
  end;

  return jsonb_build_object(
    'customer', jsonb_build_object(
      'id', v_customer_id,
      'company_id', v_company_id,
      'name', v_display_name,
      'legal_name', v_legal_name,
      'slug', v_slug,
      'organization_number', v_org_number,
      'status', v_status,
      'environment_type', v_environment_type,
      'created_at', v_created_at
    ),
    'created', jsonb_build_object(
      'company', true,
      'organization', true,
      'customer', true,
      'registration_profile', false,
      'payment_profile', false,
      'license', false,
      'domain', false,
      'installation', false
    )
  );
end;
$$;

-- Privilege contract must match Production today for the create RPC:
-- authenticated + service_role EXECUTE; anon/PUBLIC must not execute.
revoke all on function public.create_platform_portal_customer(
  text, text, text, text, text, text
) from public, anon;
grant execute on function public.create_platform_portal_customer(
  text, text, text, text, text, text
) to authenticated;
grant execute on function public.create_platform_portal_customer(
  text, text, text, text, text, text
) to service_role;

-- =============================================================================
-- ROLLBACK / RECOVERY (manual; not auto-run)
-- =============================================================================
-- 1) Drain any Platform callers that pass p_environment_type.
-- 2) DROP FUNCTION public.create_platform_portal_customer(text,text,text,text,text,text);
-- 3) Restore prior 5-arg body from
--    20261934400000_platform_portal_customer_creation_global_identity.sql
--    (hardcoded environment_type='production').
-- 4) Re-grant EXECUTE on the restored 5-arg function to authenticated and
--    service_role; revoke from public/anon.
-- 5) DROP TRIGGER trg_customers_environment_type_immutable ON public.customers;
-- 6) DROP TRIGGER trg_block_internal_customer_* on subscriptions / license_links /
--    organization_domains / customer_domains / installations;
-- 7) DROP FUNCTION helpers introduced above.
-- Caveat: CREATE OR REPLACE / DROP FUNCTION replaces live RPC behaviour; take a
-- pre-apply definition snapshot (pg_get_functiondef + ACL) before apply.
-- Existing customer rows are not modified by apply or by this rollback.
-- =============================================================================
