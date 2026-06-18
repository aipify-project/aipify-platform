-- Phase 455 — Public Growth Partner Signup (Customer App)
-- Route: /growth-partners → /app/growth-partner

-- Extend organization_users role for Growth Partners
alter table public.organization_users drop constraint if exists organization_users_role_check;
alter table public.organization_users add constraint organization_users_role_check check (
  role in (
    'owner', 'administrator', 'manager', 'support_agent', 'viewer',
    'employee', 'moderator', 'staff', 'read_only', 'growth_partner'
  )
);

-- Extend organization_role_permissions role check
alter table public.organization_role_permissions drop constraint if exists organization_role_permissions_role_check;
alter table public.organization_role_permissions add constraint organization_role_permissions_role_check check (
  role in (
    'owner', 'administrator', 'manager', 'support_agent', 'viewer',
    'employee', 'moderator', 'staff', 'read_only', 'growth_partner'
  )
);

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'growth_partner_app', v.description
from (values
  ('growth_partner.view', 'View Growth Partner dashboard', 'Access own Growth Partner workspace'),
  ('growth_partner.profile', 'Manage Growth Partner profile', 'Update own profile and business details'),
  ('growth_partner.training', 'Access Growth Partner training', 'View and complete training modules'),
  ('growth_partner.certification', 'Growth Partner certification', 'Take certification assessment'),
  ('growth_partner.leads', 'Manage own leads', 'View and manage own lead pipeline'),
  ('growth_partner.customers', 'Manage own customers', 'View own referred customers'),
  ('growth_partner.commissions', 'View own commissions', 'View commission overview for own portfolio'),
  ('growth_partner.payouts', 'Manage payout profile', 'Configure payout details after certification'),
  ('growth_partner.marketing', 'Access marketing resources', 'View approved marketing materials')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

create table if not exists public.growth_partner_app_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  full_name text not null,
  company_name text not null,
  business_registration_number text not null,
  country text not null,
  address text not null,
  phone_country_code text not null default '+47',
  phone_number text not null,
  email text not null,
  partner_status text not null default 'certification_required' check (
    partner_status in ('certification_required', 'certified', 'suspended', 'inactive')
  ),
  certification_status text not null default 'pending' check (
    certification_status in ('pending', 'in_progress', 'passed', 'failed')
  ),
  training_progress_pct int not null default 0 check (training_progress_pct between 0 and 100),
  profile_metadata jsonb not null default '{}'::jsonb,
  signup_source text not null default 'public_growth_partners',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists growth_partner_app_profiles_org_idx
  on public.growth_partner_app_profiles (organization_id);

alter table public.growth_partner_app_profiles enable row level security;
revoke all on public.growth_partner_app_profiles from authenticated, anon;

create table if not exists public.growth_partner_training_modules (
  id uuid primary key default gen_random_uuid(),
  module_key text not null unique,
  module_title text not null,
  sort_order int not null default 0,
  is_required boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.growth_partner_training_modules enable row level security;
revoke all on public.growth_partner_training_modules from authenticated, anon;

create table if not exists public.growth_partner_training_progress (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  module_key text not null references public.growth_partner_training_modules (module_key) on delete cascade,
  status text not null default 'not_started' check (
    status in ('not_started', 'in_progress', 'completed')
  ),
  completed_at timestamptz,
  unique (profile_id, module_key)
);

alter table public.growth_partner_training_progress enable row level security;
revoke all on public.growth_partner_training_progress from authenticated, anon;

create table if not exists public.growth_partner_app_audit (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.growth_partner_app_profiles (id) on delete set null,
  organization_id uuid references public.organizations (id) on delete set null,
  auth_user_id uuid,
  event_type text not null,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists growth_partner_app_audit_profile_idx
  on public.growth_partner_app_audit (profile_id, created_at desc);

alter table public.growth_partner_app_audit enable row level security;
revoke all on public.growth_partner_app_audit from authenticated, anon;

insert into public.growth_partner_training_modules (module_key, module_title, sort_order)
select v.key, v.title, v.ord
from (values
  ('product_basics', 'Aipify Product Basics', 1),
  ('abos_overview', 'Business Operating System Overview', 2),
  ('companion_governance', 'Companion and Governance', 3),
  ('business_packs', 'Business Packs', 4),
  ('customer_discovery', 'Customer Discovery', 5),
  ('sales_process', 'Sales Process', 6),
  ('demo_training', 'Demo Training', 7),
  ('objection_handling', 'Objection Handling', 8),
  ('compliance_brand', 'Compliance and Brand Rules', 9),
  ('certification_test', 'Certification Test', 10)
) as v(key, title, ord)
where not exists (select 1 from public.growth_partner_training_modules m where m.module_key = v.key);

create or replace function public._gp455_app_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select u.id from public.users u where u.auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._gp455_profile_for_auth()
returns public.growth_partner_app_profiles language plpgsql stable security definer set search_path = public as $$
declare v_row public.growth_partner_app_profiles;
begin
  select * into v_row from public.growth_partner_app_profiles p where p.auth_user_id = auth.uid() limit 1;
  return v_row;
end; $$;

create or replace function public._gp455_log(
  p_profile_id uuid, p_org_id uuid, p_event_type text, p_summary text, p_metadata jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_app_audit (profile_id, organization_id, auth_user_id, event_type, summary, metadata)
  values (p_profile_id, p_org_id, auth.uid(), p_event_type, p_summary, coalesce(p_metadata, '{}'::jsonb));
end; $$;

create or replace function public._gp455_seed_training(p_profile_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_training_progress (profile_id, module_key, status)
  select p_profile_id, m.module_key, 'not_started'
  from public.growth_partner_training_modules m
  on conflict (profile_id, module_key) do nothing;
end; $$;

create or replace function public._gp455_seed_role_permissions(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_role_permissions (organization_id, role, permission_key)
  select p_org_id, 'growth_partner', p.permission_key
  from public.aipify_permissions p
  where p.permission_key like 'growth_partner.%'
  on conflict (organization_id, role, permission_key) do nothing;
end; $$;

create or replace function public.complete_growth_partner_public_signup(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public, auth as $$
declare
  v_auth_id uuid;
  v_auth_email text;
  v_user_id uuid;
  v_company_id uuid;
  v_customer_id uuid;
  v_org_id uuid;
  v_slug text;
  v_base_slug text;
  v_customer_seq bigint;
  v_profile_id uuid;
  v_existing uuid;
begin
  v_auth_id := auth.uid();
  if v_auth_id is null then raise exception 'Authentication required'; end if;

  if exists (select 1 from public.growth_partner_app_profiles where auth_user_id = v_auth_id) then
    select id, organization_id into v_profile_id, v_org_id
    from public.growth_partner_app_profiles where auth_user_id = v_auth_id limit 1;
    return jsonb_build_object('ok', true, 'profile_id', v_profile_id, 'organization_id', v_org_id, 'redirect_path', '/app/growth-partner');
  end if;

  if coalesce(p_payload->>'full_name', '') = '' then raise exception 'full_name is required'; end if;
  if coalesce(p_payload->>'company_name', '') = '' then raise exception 'company_name is required'; end if;
  if coalesce(p_payload->>'business_registration_number', '') = '' then raise exception 'business_registration_number is required'; end if;
  if coalesce(p_payload->>'country', '') = '' then raise exception 'country is required'; end if;
  if coalesce(p_payload->>'address', '') = '' then raise exception 'address is required'; end if;
  if coalesce(p_payload->>'phone_number', '') = '' then raise exception 'phone_number is required'; end if;
  if coalesce(p_payload->>'email', '') = '' then raise exception 'email is required'; end if;
  if coalesce((p_payload->>'registered_business_confirmed')::boolean, false) is not true then
    raise exception 'registered_business_confirmed is required';
  end if;
  if coalesce((p_payload->>'certification_understood')::boolean, false) is not true then
    raise exception 'certification_understood is required';
  end if;
  if coalesce((p_payload->>'independent_partner_confirmed')::boolean, false) is not true then
    raise exception 'independent_partner_confirmed is required';
  end if;

  select email into v_auth_email from auth.users where id = v_auth_id;
  if lower(coalesce(v_auth_email, '')) <> lower(p_payload->>'email') then
    raise exception 'email must match authenticated account';
  end if;

  v_base_slug := public.slugify_company_name(p_payload->>'company_name');
  v_slug := public._awr_unique_slug(v_base_slug || '-gp');

  select u.id, u.company_id into v_user_id, v_company_id from public.users u where u.auth_user_id = v_auth_id limit 1;

  if v_company_id is null then
    insert into public.companies (name, slug, is_platform)
    values (p_payload->>'company_name', v_slug, false)
    returning id into v_company_id;

    insert into public.users (auth_user_id, company_id, full_name, role)
    values (v_auth_id, v_company_id, p_payload->>'full_name', 'owner')
    returning id into v_user_id;
  else
    update public.companies set name = p_payload->>'company_name', slug = v_slug, updated_at = now() where id = v_company_id;
    update public.users set full_name = p_payload->>'full_name' where id = v_user_id;
  end if;

  select c.id into v_customer_id from public.customers c where c.company_id = v_company_id limit 1;
  if v_customer_id is null then
    v_customer_seq := nextval('public.customer_number_seq');
    insert into public.customers (
      customer_number, company_id, customer_type, company_name, organization_number,
      full_name, email, phone, country, language, status
    ) values (
      public.format_customer_number(v_customer_seq),
      v_company_id, 'company', p_payload->>'company_name',
      p_payload->>'business_registration_number',
      p_payload->>'full_name', p_payload->>'email',
      coalesce(p_payload->>'phone_country_code', '+47') || ' ' || p_payload->>'phone_number',
      p_payload->>'country', 'en', 'active'
    ) returning id into v_customer_id;
  else
    update public.customers set
      company_name = p_payload->>'company_name',
      organization_number = p_payload->>'business_registration_number',
      full_name = p_payload->>'full_name',
      email = p_payload->>'email',
      phone = coalesce(p_payload->>'phone_country_code', '+47') || ' ' || p_payload->>'phone_number',
      country = p_payload->>'country',
      updated_at = now()
    where id = v_customer_id;
  end if;

  insert into public.aipify_tenant_profiles (
    tenant_id, name, slug, tenant_type, industry, region,
    default_language, supported_languages, timezone, pilot_status, pilot_stage, metadata
  ) values (
    v_customer_id, p_payload->>'company_name', v_slug, 'growth_partner',
    'growth_partner', p_payload->>'country', 'en', array['en'],
    'Europe/Oslo', 'setup', 1,
    jsonb_build_object(
      'registration_source', 'growth_partners_public_signup',
      'organization_type', 'growth_partner',
      'growth_partner_status', 'certification_required'
    )
  )
  on conflict (tenant_id) do update set
    name = excluded.name,
    slug = excluded.slug,
    tenant_type = 'growth_partner',
    metadata = aipify_tenant_profiles.metadata || excluded.metadata,
    updated_at = now();

  v_org_id := v_customer_id;
  perform public._mta_sync_organization_from_customer(v_customer_id);
  update public.organizations set
    name = p_payload->>'company_name',
    slug = v_slug,
    status = 'active',
    subscription_plan = 'growth_partner',
    updated_at = now()
  where id = v_org_id;

  perform public._mta_seed_organization_modules(v_org_id);
  perform public._mta_seed_organization_settings(v_org_id);
  perform public._gp455_seed_role_permissions(v_org_id);

  insert into public.organization_users (organization_id, user_id, role, status, joined_at)
  values (v_org_id, v_user_id, 'growth_partner', 'active', now())
  on conflict (organization_id, user_id) do update set
    role = 'growth_partner',
    status = 'active',
    updated_at = now();

  insert into public.organization_registration_profiles (
    customer_id, organization_id,
    owner_full_name, business_email, owner_phone, owner_country,
    company_name, organization_number, business_address, postal_code, city, organization_country,
    industry, employee_range, organization_type,
    growth_partner_eligible, verification_status, registration_completed_at
  ) values (
    v_customer_id, v_org_id,
    p_payload->>'full_name', p_payload->>'email',
    coalesce(p_payload->>'phone_country_code', '+47') || ' ' || p_payload->>'phone_number',
    p_payload->>'country',
    p_payload->>'company_name', p_payload->>'business_registration_number',
    p_payload->>'address', '0000', 'Pending', p_payload->>'country',
    'growth_partner', '1-5', 'growth_partner',
    true, 'pending', now()
  )
  on conflict (customer_id) do update set
    organization_type = 'growth_partner',
    growth_partner_eligible = true,
    registration_completed_at = now(),
    updated_at = now();

  insert into public.growth_partner_app_profiles (
    auth_user_id, organization_id, user_id,
    full_name, company_name, business_registration_number, country, address,
    phone_country_code, phone_number, email,
    partner_status, certification_status, training_progress_pct
  ) values (
    v_auth_id, v_org_id, v_user_id,
    p_payload->>'full_name', p_payload->>'company_name', p_payload->>'business_registration_number',
    p_payload->>'country', p_payload->>'address',
    coalesce(p_payload->>'phone_country_code', '+47'), p_payload->>'phone_number', p_payload->>'email',
    'certification_required', 'pending', 0
  ) returning id into v_profile_id;

  perform public._gp455_seed_training(v_profile_id);
  perform public._gp455_log(v_profile_id, v_org_id, 'signup_completed', 'Growth Partner public signup completed', p_payload);

  return jsonb_build_object(
    'ok', true,
    'profile_id', v_profile_id,
    'organization_id', v_org_id,
    'redirect_path', '/app/growth-partner',
    'partner_status', 'certification_required'
  );
end; $$;

create or replace function public.get_growth_partner_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_profile public.growth_partner_app_profiles;
  v_training jsonb;
  v_completed int;
  v_total int;
  v_status_key text;
  v_status_label text;
begin
  v_profile := public._gp455_profile_for_auth();
  if v_profile.id is null then
    return jsonb_build_object('found', false, 'error', 'Growth Partner profile not found');
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'module_key', m.module_key,
    'module_title', m.module_title,
    'status', coalesce(tp.status, 'not_started'),
    'sort_order', m.sort_order
  ) order by m.sort_order), '[]'::jsonb)
  into v_training
  from public.growth_partner_training_modules m
  left join public.growth_partner_training_progress tp
    on tp.module_key = m.module_key and tp.profile_id = v_profile.id;

  select count(*) filter (where tp.status = 'completed'), count(*)
  into v_completed, v_total
  from public.growth_partner_training_progress tp
  where tp.profile_id = v_profile.id;

  if v_profile.partner_status = 'certified' then
    v_status_key := 'verified';
    v_status_label := 'Verified — Certified Growth Partner';
  else
    v_status_key := 'waiting';
    v_status_label := 'Waiting — Certification Required';
  end if;

  return jsonb_build_object(
    'found', true,
    'full_name', v_profile.full_name,
    'company_name', v_profile.company_name,
    'email', v_profile.email,
    'partner_status', v_profile.partner_status,
    'certification_status', v_profile.certification_status,
    'status_key', v_status_key,
    'status_label', v_status_label,
    'training_progress_pct', case when v_total > 0 then round((v_completed::numeric / v_total) * 100)::int else 0 end,
    'training_modules', v_training,
    'commission_overview', jsonb_build_object(
      'note', 'Commission rules are visible inside the Growth Partner dashboard after certification.',
      'active_customers', 0,
      'pending_commissions', 0,
      'currency', 'EUR'
    ),
    'leads_count', 0,
    'customers_count', 0,
    'next_steps', jsonb_build_array(
      'Complete your profile',
      'Start training',
      'Pass certification',
      'Activate Growth Partner account'
    ),
    'academy_route', '/app/growth-partner/academy',
    'operations_route', '/app/growth-partner-operations',
    'privacy_note', 'Growth Partners access only their own portfolio data — never platform admin or other partner records.'
  );
end; $$;

grant execute on function public.complete_growth_partner_public_signup(jsonb) to authenticated;
grant execute on function public.get_growth_partner_dashboard() to authenticated;
