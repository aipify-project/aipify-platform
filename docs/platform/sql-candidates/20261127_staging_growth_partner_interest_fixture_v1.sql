-- DO NOT APPLY with the interest reconciliation.
-- Separate owner YES, after the reconciliation, on auedugihkduoaikfusqe only.
-- Creates one synthetic customer, organization, certified profile, and active link.
-- Does not create an auth user, a membership, a role grant, or a lead.
-- Does not attach the fixture to an existing organization.
-- Seller-list and admin-list checks stay blocked until a later authenticated session exists.
-- Cleanup, after the SQL checks: select public.staging_interest_fixture_cleanup();

create or replace function public.staging_interest_fixture_apply()
returns jsonb
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_customer uuid := '01960000-0000-7000-8000-000000000001';
  v_profile uuid := '01960000-0000-7000-8000-000000000002';
  v_auth uuid := '01960000-0000-7000-8000-000000000003';
  v_link uuid := '01960000-0000-7000-8000-000000000004';
  v_slug text := 'staging-interest-fixture';
  v_org_slug text := 'staging-interest-fixture-org';
begin
  if to_regprocedure('public.register_personal_sales_page_interest(text,text,text,text,text,text,boolean,text)') is null then
    raise exception 'interest register is not installed';
  end if;
  if exists (
    select 1 from pg_proc p
     join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'register_personal_sales_page_interest'
      and (
        p.proacl::text ilike '%anon=%'
        or p.proacl::text ilike '%authenticated=%'
        or p.proacl::text ilike '%service_role=%'
      )
  ) then
    raise exception 'refusing fixture while the register is client-executable';
  end if;
  if exists (
    select 1 from public.growth_partner_tracking_links
     where slug = v_slug
       and profile_id is distinct from v_profile
  ) or exists (
    select 1 from public.organizations
     where slug = v_org_slug
       and id is distinct from v_customer
  ) or exists (
    select 1 from public.growth_partner_app_profiles
     where id = v_profile
       and coalesce(profile_metadata->>'fixture', '') is distinct from 'staging_interest_e2e_v1'
  ) then
    raise exception 'fixture slug or organization is already used';
  end if;

  insert into public.customers (id)
  values (v_customer)
  on conflict (id) do nothing;

  insert into public.organizations (id, name, slug, status, subscription_plan)
  values (v_customer, 'Staging Interest Fixture', v_org_slug, 'active', 'starter')
  on conflict (id) do nothing;

  insert into public.growth_partner_app_profiles (
    id, auth_user_id, organization_id, full_name, company_name,
    business_registration_number, country, address, phone_number, email,
    partner_status, certification_status, partner_public_id, primary_link_slug,
    signup_source, profile_metadata
  ) values (
    v_profile, v_auth, v_customer, 'Staging Interest Fixture', 'Staging Interest Fixture',
    'FIXTURE', 'NO', 'Fixture', '00000000', 'fixture-interest@example.com',
    'certified', 'passed', v_slug, v_slug,
    'staging_interest_fixture', jsonb_build_object('fixture', 'staging_interest_e2e_v1')
  )
  on conflict (id) do nothing;

  insert into public.growth_partner_tracking_links (
    id, profile_id, partner_public_id, slug, link_status, is_primary
  ) values (
    v_link, v_profile, v_slug, v_slug, 'active', true
  )
  on conflict (id) do nothing;

  return jsonb_build_object('ok', true, 'slug', v_slug);
end;
$fn$;

create or replace function public.staging_interest_fixture_cleanup()
returns jsonb
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_customer uuid := '01960000-0000-7000-8000-000000000001';
  v_profile uuid := '01960000-0000-7000-8000-000000000002';
  v_removed integer := 0;
begin
  if exists (
    select 1 from public.growth_partner_app_profiles
     where organization_id = v_customer
       and id is distinct from v_profile
  ) then
    raise exception 'fixture organization has another profile';
  end if;

  delete from public.growth_partner_ops_leads where profile_id = v_profile;
  delete from public.growth_partner_tracking_links where profile_id = v_profile;
  delete from public.growth_partner_app_profiles
   where id = v_profile
     and profile_metadata->>'fixture' = 'staging_interest_e2e_v1';
  get diagnostics v_removed = row_count;

  delete from public.organizations
   where id = v_customer
     and slug = 'staging-interest-fixture-org'
     and not exists (
       select 1 from public.growth_partner_app_profiles where organization_id = v_customer
     );
  delete from public.customers c
   where c.id = v_customer
     and not exists (select 1 from public.organizations o where o.id = v_customer);

  return jsonb_build_object('ok', true, 'profiles_removed', v_removed);
end;
$fn$;

revoke all on function public.staging_interest_fixture_apply() from public, anon, authenticated, service_role;
revoke all on function public.staging_interest_fixture_cleanup() from public, anon, authenticated, service_role;
grant execute on function public.staging_interest_fixture_apply() to postgres;
grant execute on function public.staging_interest_fixture_cleanup() to postgres;

do $fixture$
declare
  v_leads integer;
  v_users integer;
  v_grants integer;
  v_memberships integer;
begin
  select count(*) into v_leads from public.growth_partner_ops_leads;
  select count(*) into v_users from public.users;
  select count(*) into v_memberships from public.organization_users;
  select count(*) into v_grants
    from public.organization_role_permissions
   where permission_key like 'growth_partner.%';

  perform public.staging_interest_fixture_apply();

  if (select count(*) from public.growth_partner_ops_leads) <> v_leads
     or (select count(*) from public.users) <> v_users
     or (select count(*) from public.organization_users) <> v_memberships
     or (select count(*) from public.organization_role_permissions where permission_key like 'growth_partner.%') <> v_grants
  then
    raise exception 'fixture changed leads, users, memberships, or grants';
  end if;
  if (select count(*) from public.growth_partner_app_profiles
       where profile_metadata->>'fixture' = 'staging_interest_e2e_v1') <> 1
     or (select count(*) from public.growth_partner_tracking_links
          where slug = 'staging-interest-fixture' and link_status = 'active') <> 1
  then
    raise exception 'fixture profile or link was not created';
  end if;
end;
$fixture$;
