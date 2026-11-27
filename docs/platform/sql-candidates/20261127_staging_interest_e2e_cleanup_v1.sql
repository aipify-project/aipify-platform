-- =============================================================================
-- PREPARED_ONLY — remove Staging synthetic interest-registration fixtures
-- Target intended: aipify-core-staging (auedugihkduoaikfusqe) only.
-- DO NOT APPLY without a separate named owner APPLY YES citing this path + SHA-256.
-- Production qbcqoixhrvhnuwphefvw must not be targeted.
--
-- Deletes the disposable company, organization, users, seller links, and any
-- interest rows created for those exact profiles during the Staging test.
-- Refuses a reserved id whose marker, slug, or platform role does not match.
-- Safe to run when the fixtures are already gone.
-- =============================================================================

do $$
declare
  v_company uuid := 'b22ce000-0000-4000-8000-0000000000c1';
  v_org uuid := 'b22ce000-0000-4000-8000-0000000000a1';
  v_auth uuid[] := array[
    'b22ce000-0000-4000-8000-0000000000a2',
    'b22ce000-0000-4000-8000-0000000000b2',
    'b22ce000-0000-4000-8000-0000000000c2',
    'b22ce000-0000-4000-8000-0000000000d2'
  ]::uuid[];
  v_users uuid[] := array[
    'b22ce000-0000-4000-8000-0000000000a3',
    'b22ce000-0000-4000-8000-0000000000b3'
  ]::uuid[];
  v_profiles uuid[] := array[
    'b22ce000-0000-4000-8000-0000000000a4',
    'b22ce000-0000-4000-8000-0000000000b4',
    'b22ce000-0000-4000-8000-0000000000c4'
  ]::uuid[];
  v_platform uuid := 'b22ce000-0000-4000-8000-0000000000d2';
begin
  if to_regclass('public.growth_partner_app_profiles') is null
     or to_regclass('public.organizations') is null
     or to_regclass('public.companies') is null then
    raise exception 'prerequisite missing for synthetic interest cleanup';
  end if;

  if exists (
    select 1 from public.growth_partner_app_profiles
    where id = any (v_profiles)
      and signup_source is distinct from 'staging_interest_e2e'
  ) then
    raise exception 'refusing cleanup: a reserved profile id is not synthetic';
  end if;

  if exists (
    select 1 from public.organizations
    where id = v_org and slug is distinct from 'staging-interest-e2e-org'
  ) then
    raise exception 'refusing cleanup: reserved organization id has another slug';
  end if;

  if exists (
    select 1 from public.companies
    where id = v_company and slug is distinct from 'staging-interest-e2e'
  ) then
    raise exception 'refusing cleanup: reserved company id has another slug';
  end if;

  if exists (
    select 1 from public.platform_admins
    where auth_user_id = v_platform
      and role is distinct from 'platform_support'
  ) then
    raise exception 'refusing cleanup: reserved platform reader is not the synthetic support role';
  end if;

  if to_regclass('public.growth_partner_ops_leads') is not null then
    delete from public.growth_partner_ops_leads where profile_id = any (v_profiles);
  end if;
  if to_regclass('public.growth_partner_app_audit') is not null then
    delete from public.growth_partner_app_audit where profile_id = any (v_profiles);
  end if;
  if to_regclass('public.growth_partner_attribution_touches') is not null then
    delete from public.growth_partner_attribution_touches where profile_id = any (v_profiles);
  end if;
  if to_regclass('public.growth_partner_attributed_customers') is not null then
    delete from public.growth_partner_attributed_customers where profile_id = any (v_profiles);
  end if;
  if to_regclass('public.growth_partner_link_audit') is not null then
    delete from public.growth_partner_link_audit where profile_id = any (v_profiles);
  end if;
  if to_regclass('public.growth_partner_tracking_link_aliases') is not null then
    delete from public.growth_partner_tracking_link_aliases where profile_id = any (v_profiles);
  end if;
  if to_regclass('public.growth_partner_tracking_links') is not null then
    delete from public.growth_partner_tracking_links where profile_id = any (v_profiles);
  end if;

  update public.organizations
  set attributed_growth_partner_profile_id = null,
      attributed_growth_partner_public_id = null
  where attributed_growth_partner_profile_id = any (v_profiles);

  if to_regclass('public.organization_role_permissions') is not null then
    delete from public.organization_role_permissions
    where organization_id = v_org
      and role = 'growth_partner'
      and permission_key = 'growth_partner.view';
  end if;
  if to_regclass('public.organization_users') is not null then
    delete from public.organization_users where user_id = any (v_users);
  end if;

  delete from public.growth_partner_app_profiles
  where id = any (v_profiles)
    and signup_source = 'staging_interest_e2e';

  if to_regclass('public.platform_admins') is not null then
    delete from public.platform_admins
    where auth_user_id = v_platform
      and role = 'platform_support';
  end if;
  if to_regclass('public.users') is not null then
    delete from public.users where id = any (v_users);
  end if;
  if to_regclass('auth.users') is not null then
    delete from auth.users
    where id = any (v_auth)
      and email in (
        'synthetic-interest-a@example.com',
        'synthetic-interest-b@example.com',
        'synthetic-interest-suspended@example.com',
        'synthetic-interest-platform@example.com'
      );
  end if;

  delete from public.organizations
  where id = v_org and slug = 'staging-interest-e2e-org';
  delete from public.customers where id = v_org;
  delete from public.companies
  where id = v_company and slug = 'staging-interest-e2e';

  if exists (select 1 from public.companies where id = v_company)
     or exists (select 1 from public.customers where id = v_org)
     or exists (select 1 from public.organizations where id = v_org)
     or exists (select 1 from public.growth_partner_app_profiles where id = any (v_profiles) or signup_source = 'staging_interest_e2e')
     or exists (select 1 from public.platform_admins where auth_user_id = v_platform)
     or exists (select 1 from auth.users where id = any (v_auth)) then
    raise exception 'synthetic interest cleanup left fixtures behind';
  end if;
end
$$;
