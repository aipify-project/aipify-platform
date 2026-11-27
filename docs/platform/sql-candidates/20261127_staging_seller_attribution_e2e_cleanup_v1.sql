-- =============================================================================
-- PREPARED_ONLY — remove Staging synthetic seller attribution fixtures
-- Target intended: aipify-core-staging (auedugihkduoaikfusqe) only.
-- DO NOT APPLY without a separate named owner APPLY YES citing this path + SHA-256.
-- Production qbcqoixhrvhnuwphefvw must not be targeted.
--
-- Deletes only the disposable customer, organization, profiles, links, and any
-- touches or attribution rows created for those exact synthetic ids.
-- Refuses to delete a profile id whose signup_source is not the synthetic marker.
-- Safe to run when the fixtures are already gone.
-- =============================================================================

do $$
declare
  v_org uuid := 'a11ce000-0000-4000-8000-000000000001';
  v_profiles uuid[] := array[
    'a11ce000-0000-4000-8000-000000000011',
    'a11ce000-0000-4000-8000-000000000012',
    'a11ce000-0000-4000-8000-000000000013'
  ]::uuid[];
begin
  if to_regclass('public.customers') is null
     or to_regclass('public.organizations') is null
     or to_regclass('public.growth_partner_app_profiles') is null
     or to_regclass('public.growth_partner_tracking_links') is null then
    raise exception 'prerequisite missing for synthetic seller attribution cleanup';
  end if;

  if exists (
    select 1
    from public.growth_partner_app_profiles
    where id = any (v_profiles)
      and signup_source is distinct from 'staging_synthetic_attribution_e2e'
  ) then
    raise exception 'refusing cleanup: a reserved profile id is not synthetic';
  end if;

  if exists (
    select 1
    from public.organizations
    where id = v_org
      and slug is distinct from 'staging-synthetic-attribution-e2e'
  ) then
    raise exception 'refusing cleanup: reserved organization id has another slug';
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

  delete from public.growth_partner_tracking_links where profile_id = any (v_profiles);

  update public.organizations
  set attributed_growth_partner_profile_id = null,
      attributed_growth_partner_public_id = null
  where attributed_growth_partner_profile_id = any (v_profiles);

  delete from public.growth_partner_app_profiles
  where id = any (v_profiles)
    and signup_source = 'staging_synthetic_attribution_e2e';

  delete from public.organizations
  where id = v_org
    and slug = 'staging-synthetic-attribution-e2e';

  delete from public.customers where id = v_org;

  if exists (select 1 from public.customers where id = v_org)
     or exists (select 1 from public.organizations where id = v_org)
     or exists (select 1 from public.growth_partner_app_profiles where id = any (v_profiles))
     or exists (select 1 from public.growth_partner_tracking_links where profile_id = any (v_profiles))
     or exists (
       select 1 from public.growth_partner_app_profiles
       where signup_source = 'staging_synthetic_attribution_e2e'
     ) then
    raise exception 'synthetic seller attribution cleanup left fixtures behind';
  end if;
end
$$;
