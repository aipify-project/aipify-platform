-- =============================================================================
-- PREPARED_ONLY — Staging synthetic interest-registration fixtures
-- Target intended: aipify-core-staging (auedugihkduoaikfusqe) only.
-- DO NOT APPLY without a separate named owner APPLY YES citing this path + SHA-256.
-- Production qbcqoixhrvhnuwphefvw must not be targeted.
-- Do not open the public interest form. This file does not grant registration
-- to anonymous or signed-in clients and does not send email.
--
-- Creates one disposable company, customer, and organization; two certified
-- sellers who can read only their own interest list; one suspended seller;
-- and one platform reader. The only permission row is growth_partner.view
-- for role growth_partner on the disposable organization.
-- No leads, commissions, payments, or messages are inserted.
-- A second run fails while these ids exist.
-- =============================================================================

do $$
declare
  v_company uuid := 'b22ce000-0000-4000-8000-0000000000c1';
  v_org uuid := 'b22ce000-0000-4000-8000-0000000000a1';
  v_auth_a uuid := 'b22ce000-0000-4000-8000-0000000000a2';
  v_auth_b uuid := 'b22ce000-0000-4000-8000-0000000000b2';
  v_auth_suspended uuid := 'b22ce000-0000-4000-8000-0000000000c2';
  v_auth_platform uuid := 'b22ce000-0000-4000-8000-0000000000d2';
  v_user_a uuid := 'b22ce000-0000-4000-8000-0000000000a3';
  v_user_b uuid := 'b22ce000-0000-4000-8000-0000000000b3';
  v_profile_a uuid := 'b22ce000-0000-4000-8000-0000000000a4';
  v_profile_b uuid := 'b22ce000-0000-4000-8000-0000000000b4';
  v_profile_suspended uuid := 'b22ce000-0000-4000-8000-0000000000c4';
  v_profiles uuid[] := array[v_profile_a, v_profile_b, v_profile_suspended];
  v_orgs_before bigint;
  v_leads_before bigint;
  v_role_perms_before bigint;
  v_platform_before bigint;
begin
  if to_regclass('public.companies') is null
     or to_regclass('public.customers') is null
     or to_regclass('public.organizations') is null
     or to_regclass('public.users') is null
     or to_regclass('public.organization_users') is null
     or to_regclass('public.organization_role_permissions') is null
     or to_regclass('public.platform_admins') is null
     or to_regclass('auth.users') is null
     or to_regclass('public.growth_partner_app_profiles') is null
     or to_regclass('public.growth_partner_tracking_links') is null
     or to_regclass('public.growth_partner_ops_leads') is null
     or to_regprocedure('public.register_personal_sales_page_interest(text,text,text,text,text,text,boolean,text)') is null
     or to_regprocedure('public.list_own_personal_sales_page_interests()') is null
     or to_regprocedure('public.list_platform_personal_sales_page_interests()') is null then
    raise exception 'prerequisite missing for synthetic interest fixtures';
  end if;

  if not exists (
    select 1 from public.aipify_permissions where permission_key = 'growth_partner.view'
  ) then
    raise exception 'growth_partner.view is missing from the permission catalog';
  end if;

  if (
    select count(*) from information_schema.columns
    where table_schema = 'public' and table_name = 'growth_partner_ops_leads'
      and column_name in ('contact_email','product_key','locale','follow_up_acknowledged','registered_at','idempotency_key')
  ) <> 6 then
    raise exception 'interest contact fields are incomplete';
  end if;

  if exists (select 1 from public.companies where id = v_company or slug = 'staging-interest-e2e')
     or exists (select 1 from public.customers where id = v_org)
     or exists (select 1 from public.organizations where id = v_org or slug = 'staging-interest-e2e-org')
     or exists (select 1 from auth.users where id in (v_auth_a, v_auth_b, v_auth_suspended, v_auth_platform))
     or exists (select 1 from public.users where id in (v_user_a, v_user_b))
     or exists (select 1 from public.growth_partner_app_profiles where id = any (v_profiles))
     or exists (select 1 from public.growth_partner_tracking_links where slug in ('staging-interest-certified-a','staging-interest-certified-b','staging-interest-suspended'))
     or exists (select 1 from public.growth_partner_app_profiles where signup_source = 'staging_interest_e2e')
     or exists (select 1 from public.platform_admins where auth_user_id = v_auth_platform) then
    raise exception 'synthetic interest fixtures already exist';
  end if;

  select count(*) into v_orgs_before from public.organizations;
  select count(*) into v_leads_before from public.growth_partner_ops_leads;
  select count(*) into v_role_perms_before
    from public.organization_role_permissions where organization_id <> v_org;
  select count(*) into v_platform_before
    from public.platform_admins where auth_user_id <> v_auth_platform;

  insert into public.companies (id, name, slug)
  values (v_company, 'Synthetic Interest Studio', 'staging-interest-e2e');

  insert into public.customers (id) values (v_org);

  insert into public.organizations (
    id, name, slug, status, subscription_plan, default_language, fallback_language, timezone
  ) values (
    v_org, 'Synthetic Interest Studio', 'staging-interest-e2e-org', 'active', 'starter', 'en', 'en', 'UTC'
  );

  insert into auth.users (id, email) values
    (v_auth_a, 'synthetic-interest-a@example.com'),
    (v_auth_b, 'synthetic-interest-b@example.com'),
    (v_auth_suspended, 'synthetic-interest-suspended@example.com'),
    (v_auth_platform, 'synthetic-interest-platform@example.com');

  insert into public.users (id, auth_user_id, company_id, full_name, role, account_status)
  values
    (v_user_a, v_auth_a, v_company, 'Staging Interest Seller A', 'staff', 'active'),
    (v_user_b, v_auth_b, v_company, 'Staging Interest Seller B', 'staff', 'active');

  insert into public.organization_users (organization_id, user_id, role, status)
  values
    (v_org, v_user_a, 'growth_partner', 'active'),
    (v_org, v_user_b, 'growth_partner', 'active');

  insert into public.organization_role_permissions (organization_id, role, permission_key)
  values (v_org, 'growth_partner', 'growth_partner.view');

  insert into public.platform_admins (auth_user_id, role, status)
  values (v_auth_platform, 'platform_support', 'active');

  insert into public.growth_partner_app_profiles (
    id, auth_user_id, organization_id, user_id,
    full_name, company_name, business_registration_number, country, address,
    phone_country_code, phone_number, email,
    partner_status, certification_status, training_progress_pct,
    profile_metadata, signup_source, partner_public_id, primary_link_slug
  ) values
    (
      v_profile_a, v_auth_a, v_org, v_user_a,
      'Staging Interest Advisor A', 'Synthetic Interest Studio', 'SYNTHETIC-INTEREST-A', 'SE', 'Synthetic test address',
      '+46', '00000011', 'synthetic-interest-a@example.com',
      'certified', 'passed', 0,
      '{"synthetic":"interest_e2e_v1"}'::jsonb, 'staging_interest_e2e',
      'partner_stgint01', 'staging-interest-certified-a'
    ),
    (
      v_profile_b, v_auth_b, v_org, v_user_b,
      'Staging Interest Advisor B', 'Synthetic Interest Studio', 'SYNTHETIC-INTEREST-B', 'SE', 'Synthetic test address',
      '+46', '00000012', 'synthetic-interest-b@example.com',
      'certified', 'passed', 0,
      '{"synthetic":"interest_e2e_v1"}'::jsonb, 'staging_interest_e2e',
      'partner_stgint02', 'staging-interest-certified-b'
    ),
    (
      v_profile_suspended, v_auth_suspended, v_org, null,
      'Staging Interest Suspended', 'Synthetic Interest Studio', 'SYNTHETIC-INTEREST-C', 'SE', 'Synthetic test address',
      '+46', '00000013', 'synthetic-interest-suspended@example.com',
      'suspended', 'passed', 0,
      '{"synthetic":"interest_e2e_v1"}'::jsonb, 'staging_interest_e2e',
      'partner_stgint03', 'staging-interest-suspended'
    );

  insert into public.growth_partner_tracking_links (
    id, profile_id, partner_public_id, slug, link_status, is_primary
  ) values
    ('b22ce000-0000-4000-8000-0000000000a5', v_profile_a, 'partner_stgint01', 'staging-interest-certified-a', 'active', true),
    ('b22ce000-0000-4000-8000-0000000000b5', v_profile_b, 'partner_stgint02', 'staging-interest-certified-b', 'active', true),
    ('b22ce000-0000-4000-8000-0000000000c5', v_profile_suspended, 'partner_stgint03', 'staging-interest-suspended', 'active', true);

  if (select count(*) from public.organizations) <> v_orgs_before + 1
     or (select count(*) from public.growth_partner_ops_leads) <> v_leads_before
     or (select count(*) from public.organization_role_permissions where organization_id <> v_org) <> v_role_perms_before
     or (select count(*) from public.platform_admins where auth_user_id <> v_auth_platform) <> v_platform_before
     or (select count(*) from public.organization_role_permissions where organization_id = v_org) <> 1
     or exists (
       select 1 from public.organization_role_permissions
       where organization_id = v_org and permission_key <> 'growth_partner.view'
     )
     or exists (
       select 1 from public.organization_user_permissions
       where organization_id = v_org
     )
     or (select role from public.platform_admins where auth_user_id = v_auth_platform) <> 'platform_support'
     or (select count(*) from public.organization_users where organization_id = v_org and role = 'growth_partner' and status = 'active') <> 2
     or (select count(*) from public.growth_partner_app_profiles where signup_source = 'staging_interest_e2e' and partner_status = 'certified') <> 2
     or (select count(*) from public.growth_partner_tracking_links where slug = 'staging-interest-suspended' and link_status = 'active') <> 1 then
    raise exception 'synthetic interest fixtures failed verification';
  end if;
end
$$;
