-- Organization Registration & Onboarding Redesign
-- Self-service workspace provisioning from /register wizard (SHARED: auth + platform + customer)

-- ---------------------------------------------------------------------------
-- 1. organization_registration_profiles
-- ---------------------------------------------------------------------------
create table if not exists public.organization_registration_profiles (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null unique references public.customers (id) on delete cascade,
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  owner_full_name text not null,
  business_email text not null,
  owner_phone text,
  owner_country text not null default 'NO',
  company_name text not null,
  organization_number text,
  business_address text not null,
  postal_code text not null,
  city text not null,
  organization_country text not null default 'NO',
  website text,
  logo_url text,
  industry text not null,
  employee_range text not null check (
    employee_range in ('1-5', '6-25', '26-100', '101-250', '251-1000', '1000+')
  ),
  primary_use_cases text[] not null default '{}',
  organization_type text not null check (
    organization_type in (
      'company', 'growth_partner', 'consultant', 'freelancer', 'internal_team_pilot'
    )
  ),
  growth_partner_eligible boolean not null default false,
  enterprise_candidate boolean not null default false,
  verification_status text not null default 'pending' check (
    verification_status in ('pending', 'verified', 'rejected')
  ),
  product_updates_opt_in boolean not null default false,
  registration_2fa_skipped boolean not null default true,
  registration_2fa_enabled boolean not null default false,
  workspace_metadata jsonb not null default '{}'::jsonb,
  registration_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_registration_profiles_org_idx
  on public.organization_registration_profiles (organization_id);

create index if not exists organization_registration_profiles_verification_idx
  on public.organization_registration_profiles (verification_status);

create index if not exists organization_registration_profiles_org_type_idx
  on public.organization_registration_profiles (organization_type);

alter table public.organization_registration_profiles enable row level security;
revoke all on public.organization_registration_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Helpers (_awr_ prefix — Aipify Workspace Registration)
-- ---------------------------------------------------------------------------
create or replace function public._awr_free_email_domains()
returns text[] language sql immutable as $$
  select array[
    'gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'live.com',
    'yahoo.com', 'icloud.com', 'me.com', 'protonmail.com', 'proton.me',
    'aol.com', 'mail.com', 'gmx.com', 'yandex.com', 'zoho.com'
  ];
$$;

create or replace function public._awr_is_business_email(p_email text)
returns boolean language plpgsql immutable as $$
declare
  v_domain text;
  v_free text;
begin
  if coalesce(p_email, '') = '' or position('@' in p_email) = 0 then
    return false;
  end if;
  v_domain := lower(split_part(p_email, '@', 2));
  if v_domain = '' then return false; end if;
  foreach v_free in array public._awr_free_email_domains() loop
    if v_domain = v_free then return false; end if;
  end loop;
  return true;
end; $$;

create or replace function public._awr_unique_slug(p_base_slug text)
returns text language plpgsql security definer set search_path = public as $$
declare
  v_slug text := coalesce(nullif(trim(p_base_slug), ''), 'company');
  v_suffix int := 0;
begin
  while exists (
    select 1 from public.companies where slug = v_slug
    union all
    select 1 from public.aipify_tenant_profiles where slug = v_slug
  ) loop
    v_suffix := v_suffix + 1;
    v_slug := p_base_slug || '-' || v_suffix;
  end loop;
  return v_slug;
end; $$;

create or replace function public._awr_user_has_completed_registration()
returns boolean language plpgsql security definer set search_path = public as $$
begin
  return exists (
    select 1
    from public.users u
    join public.customers c on c.company_id = u.company_id
    join public.organization_registration_profiles orp on orp.customer_id = c.id
    where u.auth_user_id = auth.uid()
      and orp.registration_completed_at is not null
  );
end; $$;

create or replace function public._awr_enterprise_from_range(p_range text)
returns boolean language sql immutable as $$
  select p_range in ('251-1000', '1000+');
$$;

create or replace function public._awr_growth_partner_from_type(p_type text)
returns boolean language sql immutable as $$
  select p_type = 'growth_partner';
$$;

create or replace function public._awr_build_tenant_metadata(
  p_payload jsonb,
  p_enterprise boolean,
  p_growth_partner boolean
)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'registration_source', 'self_service_wizard',
    'organization_type', p_payload->>'organization_type',
    'employee_range', p_payload->>'employee_range',
    'primary_use_cases', coalesce(p_payload->'primary_use_cases', '[]'::jsonb),
    'enterprise_candidate', p_enterprise,
    'growth_partner_eligible', p_growth_partner,
    'product_updates_opt_in', coalesce((p_payload->>'product_updates_opt_in')::boolean, false),
    'registration_2fa_skipped', coalesce((p_payload->>'registration_2fa_skipped')::boolean, true),
    'registration_2fa_enabled', coalesce((p_payload->>'registration_2fa_enabled')::boolean, false)
  )
  || case when p_growth_partner then jsonb_build_object(
    'growth_partner_onboarding', jsonb_build_object(
      'operations_center', true,
      'university', true,
      'marketplace', true,
      'status', 'pending_review'
    )
  ) else '{}'::jsonb end;
$$;

-- ---------------------------------------------------------------------------
-- 3. complete_aipify_workspace_registration
-- ---------------------------------------------------------------------------
create or replace function public.complete_aipify_workspace_registration(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
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
  v_enterprise boolean;
  v_growth_partner boolean;
  v_gp_eligible boolean;
  v_metadata jsonb;
  v_redirect text := '/app/install?onboarding=welcome';
  v_modules jsonb := jsonb_build_array(
    jsonb_build_object('module_key', 'admin_assistant', 'enabled', true),
    jsonb_build_object('module_key', 'support_ai', 'enabled', true),
    jsonb_build_object('module_key', 'knowledge_center', 'enabled', true),
    jsonb_build_object('module_key', 'audit_log', 'enabled', true),
    jsonb_build_object('module_key', 'integrations', 'enabled', true)
  );
  v_item jsonb;
  v_module_key text;
begin
  v_auth_id := auth.uid();
  if v_auth_id is null then
    raise exception 'Authentication required';
  end if;

  if public._awr_user_has_completed_registration() then
    raise exception 'Workspace registration already completed';
  end if;

  -- Required field validation
  if coalesce(p_payload->>'owner_full_name', '') = '' then
    raise exception 'owner_full_name is required';
  end if;
  if coalesce(p_payload->>'business_email', '') = '' then
    raise exception 'business_email is required';
  end if;
  if not public._awr_is_business_email(p_payload->>'business_email') then
    raise exception 'business_email must use a business domain';
  end if;
  if coalesce(p_payload->>'company_name', '') = '' then
    raise exception 'company_name is required';
  end if;
  if coalesce(p_payload->>'business_address', '') = '' then
    raise exception 'business_address is required';
  end if;
  if coalesce(p_payload->>'postal_code', '') = '' then
    raise exception 'postal_code is required';
  end if;
  if coalesce(p_payload->>'city', '') = '' then
    raise exception 'city is required';
  end if;
  if coalesce(p_payload->>'industry', '') = '' then
    raise exception 'industry is required';
  end if;
  if coalesce(p_payload->>'employee_range', '') = '' then
    raise exception 'employee_range is required';
  end if;
  if coalesce(p_payload->>'organization_type', '') = '' then
    raise exception 'organization_type is required';
  end if;
  if not (p_payload->>'employee_range') = any (array['1-5','6-25','26-100','101-250','251-1000','1000+']) then
    raise exception 'Invalid employee_range';
  end if;
  if not (p_payload->>'organization_type') = any (
    array['company','growth_partner','consultant','freelancer','internal_team_pilot']
  ) then
    raise exception 'Invalid organization_type';
  end if;
  if coalesce((p_payload->>'terms_accepted')::boolean, false) is not true then
    raise exception 'terms_accepted is required';
  end if;
  if coalesce((p_payload->>'authority_accepted')::boolean, false) is not true then
    raise exception 'authority_accepted is required';
  end if;

  select email into v_auth_email from auth.users where id = v_auth_id;
  if lower(coalesce(v_auth_email, '')) <> lower(p_payload->>'business_email') then
    raise exception 'business_email must match authenticated account';
  end if;

  v_enterprise := public._awr_enterprise_from_range(p_payload->>'employee_range');
  v_growth_partner := public._awr_growth_partner_from_type(p_payload->>'organization_type');
  v_gp_eligible := v_growth_partner
    or coalesce((p_payload->>'growth_partner_eligible')::boolean, false);
  v_metadata := public._awr_build_tenant_metadata(p_payload, v_enterprise, v_gp_eligible);

  -- Resolve app user + company (created by handle_new_auth_user on sign-up)
  select u.id, u.company_id into v_user_id, v_company_id
  from public.users u
  where u.auth_user_id = v_auth_id
  limit 1;

  v_base_slug := public.slugify_company_name(p_payload->>'company_name');
  v_slug := public._awr_unique_slug(v_base_slug);

  if v_company_id is null then
    insert into public.companies (name, slug, is_platform)
    values (p_payload->>'company_name', v_slug, false)
    returning id into v_company_id;

    insert into public.users (auth_user_id, company_id, full_name, role)
    values (v_auth_id, v_company_id, p_payload->>'owner_full_name', 'owner')
    returning id into v_user_id;
  else
    update public.companies set
      name = p_payload->>'company_name',
      slug = v_slug,
      updated_at = now()
    where id = v_company_id;

    update public.users set
      full_name = p_payload->>'owner_full_name',
      role = 'owner'
    where id = v_user_id;
  end if;

  -- Customer record
  select c.id into v_customer_id
  from public.customers c
  where c.company_id = v_company_id
  limit 1;

  if v_customer_id is null then
    v_customer_seq := nextval('public.customer_number_seq');
    insert into public.customers (
      customer_number, company_id, customer_type, company_name, organization_number,
      full_name, email, phone, country, language, status
    ) values (
      public.format_customer_number(v_customer_seq),
      v_company_id,
      'company',
      p_payload->>'company_name',
      nullif(p_payload->>'organization_number', ''),
      p_payload->>'owner_full_name',
      p_payload->>'business_email',
      nullif(p_payload->>'owner_phone', ''),
      coalesce(p_payload->>'organization_country', p_payload->>'owner_country', 'NO'),
      coalesce(p_payload->>'default_language', 'en'),
      'trial'
    ) returning id into v_customer_id;
  else
    update public.customers set
      company_name = p_payload->>'company_name',
      organization_number = nullif(p_payload->>'organization_number', ''),
      full_name = p_payload->>'owner_full_name',
      email = p_payload->>'business_email',
      phone = nullif(p_payload->>'owner_phone', ''),
      country = coalesce(p_payload->>'organization_country', p_payload->>'owner_country', 'NO'),
      status = 'trial',
      updated_at = now()
    where id = v_customer_id;
  end if;

  -- Payment profile (billing)
  insert into public.payment_profiles (
    customer_id, provider, payment_status, billing_email,
    billing_address, postal_code, city, country, vat_number
  ) values (
    v_customer_id,
    'invoice',
    'pending_setup',
    p_payload->>'business_email',
    p_payload->>'business_address',
    p_payload->>'postal_code',
    p_payload->>'city',
    coalesce(p_payload->>'organization_country', p_payload->>'owner_country', 'NO'),
    nullif(p_payload->>'organization_number', '')
  )
  on conflict (customer_id) do update set
    billing_email = excluded.billing_email,
    billing_address = excluded.billing_address,
    postal_code = excluded.postal_code,
    city = excluded.city,
    country = excluded.country,
    vat_number = excluded.vat_number,
    updated_at = now();

  -- Trial subscription
  insert into public.subscriptions (
    customer_id, plan_name, plan_type, status,
    trial_starts_at, trial_ends_at, billing_cycle,
    price_amount, currency, max_users, max_installations
  ) values (
    v_customer_id,
    'Starter Trial',
    'starter',
    'trialing',
    now(),
    now() + interval '14 days',
    'monthly',
    0,
    'EUR',
    5,
    1
  )
  on conflict (customer_id) do update set
    plan_name = excluded.plan_name,
    plan_type = excluded.plan_type,
    status = 'trialing',
    trial_starts_at = coalesce(subscriptions.trial_starts_at, excluded.trial_starts_at),
    trial_ends_at = excluded.trial_ends_at,
    updated_at = now();

  -- Tenant profile
  insert into public.aipify_tenant_profiles (
    tenant_id, name, slug, tenant_type, industry, region,
    default_language, supported_languages, timezone, pilot_status, pilot_stage, metadata
  ) values (
    v_customer_id,
    p_payload->>'company_name',
    v_slug,
    case when p_payload->>'organization_type' = 'internal_team_pilot' then 'internal' else 'pilot_customer' end,
    p_payload->>'industry',
    coalesce(p_payload->>'organization_country', p_payload->>'owner_country', 'NO'),
    coalesce(p_payload->>'default_language', 'en'),
    array[coalesce(p_payload->>'default_language', 'en')],
    coalesce(p_payload->>'timezone', 'Europe/Oslo'),
    'setup',
    1,
    v_metadata
  )
  on conflict (tenant_id) do update set
    name = excluded.name,
    slug = excluded.slug,
    industry = excluded.industry,
    region = excluded.region,
    metadata = aipify_tenant_profiles.metadata || excluded.metadata,
    updated_at = now();

  -- Starter modules
  for v_item in select * from jsonb_array_elements(v_modules)
  loop
    v_module_key := v_item->>'module_key';
    insert into public.tenant_modules (
      tenant_id, module_key, enabled, licensed, status, mode, settings, enabled_at
    ) values (
      v_customer_id,
      v_module_key,
      coalesce((v_item->>'enabled')::boolean, true),
      true,
      'enabled',
      'safe',
      '{}'::jsonb,
      now()
    )
    on conflict (tenant_id, module_key) do update set
      enabled = excluded.enabled,
      licensed = true,
      status = 'enabled',
      updated_at = now();
  end loop;

  -- Organization sync + seeds
  v_org_id := v_customer_id;
  perform public._mta_sync_organization_from_customer(v_customer_id);
  update public.organizations set
    name = p_payload->>'company_name',
    slug = v_slug,
    status = 'trial',
    subscription_plan = 'starter',
    updated_at = now()
  where id = v_org_id;

  perform public._mta_seed_organization_modules(v_org_id);
  perform public._mta_seed_organization_settings(v_org_id);
  perform public._mta_seed_organization_integrations(v_org_id, v_slug);
  perform public._mta_backfill_memberships(v_org_id);

  -- Registration profile (Day One metadata)
  insert into public.organization_registration_profiles (
    customer_id, organization_id,
    owner_full_name, business_email, owner_phone, owner_country,
    company_name, organization_number, business_address, postal_code, city, organization_country,
    website, logo_url, industry, employee_range, primary_use_cases, organization_type,
    growth_partner_eligible, enterprise_candidate, verification_status,
    product_updates_opt_in, registration_2fa_skipped, registration_2fa_enabled,
    workspace_metadata, registration_completed_at
  ) values (
    v_customer_id, v_org_id,
    p_payload->>'owner_full_name',
    p_payload->>'business_email',
    nullif(p_payload->>'owner_phone', ''),
    coalesce(p_payload->>'owner_country', 'NO'),
    p_payload->>'company_name',
    nullif(p_payload->>'organization_number', ''),
    p_payload->>'business_address',
    p_payload->>'postal_code',
    p_payload->>'city',
    coalesce(p_payload->>'organization_country', p_payload->>'owner_country', 'NO'),
    nullif(p_payload->>'website', ''),
    nullif(p_payload->>'logo_url', ''),
    p_payload->>'industry',
    p_payload->>'employee_range',
    coalesce(
      array(select jsonb_array_elements_text(coalesce(p_payload->'primary_use_cases', '[]'::jsonb))),
      '{}'::text[]
    ),
    p_payload->>'organization_type',
    v_gp_eligible,
    v_enterprise,
    'pending',
    coalesce((p_payload->>'product_updates_opt_in')::boolean, false),
    coalesce((p_payload->>'registration_2fa_skipped')::boolean, true),
    coalesce((p_payload->>'registration_2fa_enabled')::boolean, false),
    coalesce(p_payload->'workspace_metadata', '{}'::jsonb),
    now()
  )
  on conflict (customer_id) do update set
    owner_full_name = excluded.owner_full_name,
    business_email = excluded.business_email,
    owner_phone = excluded.owner_phone,
    owner_country = excluded.owner_country,
    company_name = excluded.company_name,
    organization_number = excluded.organization_number,
    business_address = excluded.business_address,
    postal_code = excluded.postal_code,
    city = excluded.city,
    organization_country = excluded.organization_country,
    website = excluded.website,
    logo_url = excluded.logo_url,
    industry = excluded.industry,
    employee_range = excluded.employee_range,
    primary_use_cases = excluded.primary_use_cases,
    organization_type = excluded.organization_type,
    growth_partner_eligible = excluded.growth_partner_eligible,
    enterprise_candidate = excluded.enterprise_candidate,
    product_updates_opt_in = excluded.product_updates_opt_in,
    registration_2fa_skipped = excluded.registration_2fa_skipped,
    registration_2fa_enabled = excluded.registration_2fa_enabled,
    workspace_metadata = excluded.workspace_metadata,
    registration_completed_at = excluded.registration_completed_at,
    updated_at = now();

  -- Post-signup customer onboarding (A.10) — welcome step
  perform public._cob_ensure_onboarding(v_org_id);

  -- Redirect to 2FA settings when user chose enable after workspace
  if coalesce((p_payload->>'registration_2fa_enabled')::boolean, false) then
    v_redirect := '/app/settings/two-factor?return=%2Fapp%2Finstall%3Fonboarding%3Dwelcome';
  end if;

  return jsonb_build_object(
    'organization_id', v_org_id,
    'customer_id', v_customer_id,
    'slug', v_slug,
    'redirect_path', v_redirect
  );
end;
$$;

grant execute on function public.complete_aipify_workspace_registration(jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Extend list_platform_customer_records with registration enrichment
-- ---------------------------------------------------------------------------
drop function if exists public.list_platform_customer_records();

create or replace function public.list_platform_customer_records()
returns table (
  id uuid,
  customer_number text,
  customer_type text,
  display_name text,
  email text,
  country text,
  language text,
  status text,
  company_id uuid,
  installation_count bigint,
  user_count bigint,
  plan_name text,
  plan_type text,
  trial_days_remaining integer,
  created_at timestamptz,
  owner_name text,
  phone text,
  organization_number text,
  industry text,
  workspace_type text,
  verification_status text,
  two_factor_status text,
  growth_partner_status text,
  employee_size text,
  website text,
  enterprise_candidate boolean
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Insufficient permissions';
  end if;

  return query
  select
    c.id,
    c.customer_number,
    c.customer_type,
    coalesce(c.company_name, c.full_name, 'Customer') as display_name,
    c.email,
    c.country,
    c.language,
    c.status,
    c.company_id,
    count(distinct i.id) as installation_count,
    count(distinct u.id) as user_count,
    s.plan_name,
    s.plan_type,
    case
      when s.trial_ends_at is not null and s.status = 'trialing'
        then greatest(0, ceil(extract(epoch from (s.trial_ends_at - now())) / 86400)::integer)
      else null
    end as trial_days_remaining,
    c.created_at,
    coalesce(orp.owner_full_name, c.full_name) as owner_name,
    coalesce(orp.owner_phone, c.phone) as phone,
    coalesce(orp.organization_number, c.organization_number) as organization_number,
    orp.industry,
    orp.organization_type as workspace_type,
    coalesce(orp.verification_status, 'pending') as verification_status,
    case
      when exists (
        select 1 from public.users ou
        join public.user_two_factor_settings tfs on tfs.user_id = ou.id
        where ou.company_id = c.company_id and tfs.enabled = true
      ) then 'enabled'
      when orp.registration_2fa_skipped then 'skipped'
      else 'not_enabled'
    end as two_factor_status,
    case
      when orp.growth_partner_eligible or orp.organization_type = 'growth_partner' then 'eligible'
      else 'standard'
    end as growth_partner_status,
    orp.employee_range as employee_size,
    orp.website,
    coalesce(orp.enterprise_candidate, false) as enterprise_candidate
  from public.customers c
  left join public.installations i on i.company_id = c.company_id
  left join public.users u on u.company_id = c.company_id
  left join public.subscriptions s on s.customer_id = c.id
  left join public.organization_registration_profiles orp on orp.customer_id = c.id
  group by
    c.id, s.plan_name, s.plan_type, s.trial_ends_at, s.status,
    orp.owner_full_name, orp.owner_phone, orp.organization_number, orp.industry,
    orp.organization_type, orp.verification_status, orp.registration_2fa_skipped,
    orp.growth_partner_eligible, orp.employee_range, orp.website, orp.enterprise_candidate
  order by c.customer_number asc;
end;
$$;

grant execute on function public.list_platform_customer_records() to authenticated;
