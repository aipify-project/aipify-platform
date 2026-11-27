-- =============================================================================
-- PREPARED_ONLY — Staging synthetic seller attribution fixtures
-- Target intended: aipify-core-staging (auedugihkduoaikfusqe) only.
-- DO NOT APPLY without a separate named owner APPLY YES citing this path + SHA-256.
-- Production qbcqoixhrvhnuwphefvw must not be targeted.
-- Do not run this on aipify.ai. The public site reads Production Core.
--
-- Inserts one disposable customer, one disposable organization, and three
-- Growth Partner profiles with active links:
--   staging-synthetic-certified
--   staging-synthetic-suspended
--   staging-synthetic-unpublished
-- No auth user, email send, commission, sale, payment, touch, or attribution row.
-- Existing organizations and profiles are not updated.
-- A second run fails while these ids exist. Remove them with the paired cleanup.
-- =============================================================================

do $$
declare
  v_org uuid := 'a11ce000-0000-4000-8000-000000000001';
  v_profiles uuid[] := array[
    'a11ce000-0000-4000-8000-000000000011',
    'a11ce000-0000-4000-8000-000000000012',
    'a11ce000-0000-4000-8000-000000000013'
  ]::uuid[];
  v_slugs text[] := array[
    'staging-synthetic-certified',
    'staging-synthetic-suspended',
    'staging-synthetic-unpublished'
  ];
  v_profiles_before bigint;
  v_orgs_before bigint;
  v_customers_before bigint;
  v_attributed_before bigint;
begin
  if to_regclass('public.customers') is null
     or to_regclass('public.organizations') is null
     or to_regclass('public.growth_partner_app_profiles') is null
     or to_regclass('public.growth_partner_tracking_links') is null
     or to_regclass('public.growth_partner_attribution_touches') is null
     or to_regclass('public.growth_partner_attributed_customers') is null
     or to_regprocedure('public.resolve_growth_partner_public_link(text)') is null
     or to_regprocedure('public.capture_growth_partner_attribution(jsonb)') is null
     or to_regprocedure('public.apply_growth_partner_attribution_to_organization(uuid,text,text,text)') is null
     or to_regprocedure('public._gp455a_resolve_slug(text)') is null then
    raise exception 'prerequisite missing for synthetic seller attribution fixtures';
  end if;

  if not exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'resolve_growth_partner_public_link'
      and position('certified' in p.prosrc) > 0
  ) then
    raise exception 'Staging public resolver is missing the certified gate';
  end if;

  if exists (select 1 from public.customers where id = v_org)
     or exists (select 1 from public.organizations where id = v_org or slug = 'staging-synthetic-attribution-e2e')
     or exists (select 1 from public.growth_partner_app_profiles where id = any (v_profiles))
     or exists (select 1 from public.growth_partner_tracking_links where slug = any (v_slugs))
     or exists (
       select 1 from public.growth_partner_app_profiles
       where signup_source = 'staging_synthetic_attribution_e2e'
     ) then
    raise exception 'synthetic seller attribution fixtures already exist';
  end if;

  select count(*) into v_profiles_before from public.growth_partner_app_profiles;
  select count(*) into v_orgs_before from public.organizations;
  select count(*) into v_customers_before from public.customers;
  select count(*) into v_attributed_before
  from public.organizations
  where attributed_growth_partner_profile_id is not null;

  insert into public.customers (id) values (v_org);

  insert into public.organizations (
    id, name, slug, status, subscription_plan, default_language, fallback_language, timezone
  ) values (
    v_org,
    'Synthetic Attribution Studio',
    'staging-synthetic-attribution-e2e',
    'active',
    'starter',
    'en',
    'en',
    'UTC'
  );

  insert into public.growth_partner_app_profiles (
    id, auth_user_id, organization_id, user_id,
    full_name, company_name, business_registration_number, country, address,
    phone_country_code, phone_number, email,
    partner_status, certification_status, training_progress_pct,
    profile_metadata, signup_source, partner_public_id, primary_link_slug
  ) values
    (
      'a11ce000-0000-4000-8000-000000000011',
      'a11ce000-0000-4000-8000-000000000021',
      v_org, null,
      'Staging Synthetic Advisor', 'Synthetic Attribution Studio', 'SYNTHETIC-E2E-CERT', 'SE', 'Synthetic test address',
      '+46', '00000001', 'synthetic-certified@example.com',
      'certified', 'passed', 0,
      '{"synthetic":"seller_attribution_e2e_v1"}'::jsonb, 'staging_synthetic_attribution_e2e',
      'partner_stgsyn01', 'staging-synthetic-certified'
    ),
    (
      'a11ce000-0000-4000-8000-000000000012',
      'a11ce000-0000-4000-8000-000000000022',
      v_org, null,
      'Staging Synthetic Suspended', 'Synthetic Attribution Studio', 'SYNTHETIC-E2E-SUSP', 'SE', 'Synthetic test address',
      '+46', '00000002', 'synthetic-suspended@example.com',
      'suspended', 'passed', 0,
      '{"synthetic":"seller_attribution_e2e_v1"}'::jsonb, 'staging_synthetic_attribution_e2e',
      'partner_stgsyn02', 'staging-synthetic-suspended'
    ),
    (
      'a11ce000-0000-4000-8000-000000000013',
      'a11ce000-0000-4000-8000-000000000023',
      v_org, null,
      'Staging Synthetic Unpublished', 'Synthetic Attribution Studio', 'SYNTHETIC-E2E-UNPUB', 'SE', 'Synthetic test address',
      '+46', '00000003', 'synthetic-unpublished@example.com',
      'certification_required', 'pending', 0,
      '{"synthetic":"seller_attribution_e2e_v1"}'::jsonb, 'staging_synthetic_attribution_e2e',
      'partner_stgsyn03', 'staging-synthetic-unpublished'
    );

  insert into public.growth_partner_tracking_links (
    id, profile_id, partner_public_id, slug, link_status, is_primary
  ) values
    (
      'a11ce000-0000-4000-8000-000000000031',
      'a11ce000-0000-4000-8000-000000000011',
      'partner_stgsyn01', 'staging-synthetic-certified', 'active', true
    ),
    (
      'a11ce000-0000-4000-8000-000000000032',
      'a11ce000-0000-4000-8000-000000000012',
      'partner_stgsyn02', 'staging-synthetic-suspended', 'active', true
    ),
    (
      'a11ce000-0000-4000-8000-000000000033',
      'a11ce000-0000-4000-8000-000000000013',
      'partner_stgsyn03', 'staging-synthetic-unpublished', 'active', true
    );

  if (select count(*) from public.growth_partner_app_profiles) <> v_profiles_before + 3
     or (select count(*) from public.organizations) <> v_orgs_before + 1
     or (select count(*) from public.customers) <> v_customers_before + 1
     or (select count(*) from public.organizations where attributed_growth_partner_profile_id is not null) <> v_attributed_before
     or (select count(*) from public.growth_partner_app_profiles where signup_source = 'staging_synthetic_attribution_e2e') <> 3
     or (select count(*) from public.growth_partner_tracking_links where slug = any (v_slugs)) <> 3
     or (select count(*) from public.growth_partner_attribution_touches where profile_id = any (v_profiles)) <> 0
     or (select count(*) from public.growth_partner_attributed_customers where profile_id = any (v_profiles)) <> 0
     or exists (
       select 1 from public.growth_partner_app_profiles
       where id = 'a11ce000-0000-4000-8000-000000000011'
         and (partner_status <> 'certified' or full_name <> 'Staging Synthetic Advisor')
     ) then
    raise exception 'synthetic seller attribution fixtures failed verification';
  end if;
end
$$;
