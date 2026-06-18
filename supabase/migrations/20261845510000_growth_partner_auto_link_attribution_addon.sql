-- Phase 455 Addon — Growth Partner Auto-Link & Marketing Attribution System
-- Auto-generates partner tracking links on signup; injects links into marketing templates.

alter table public.growth_partner_app_profiles
  add column if not exists partner_public_id text unique,
  add column if not exists primary_link_slug text;

create unique index if not exists growth_partner_app_profiles_primary_slug_idx
  on public.growth_partner_app_profiles (primary_link_slug)
  where primary_link_slug is not null;

create table if not exists public.growth_partner_tracking_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  partner_public_id text not null,
  slug text not null,
  link_status text not null default 'active' check (link_status in ('active', 'disabled')),
  is_primary boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug)
);

create index if not exists growth_partner_tracking_links_profile_idx
  on public.growth_partner_tracking_links (profile_id, is_primary desc);

alter table public.growth_partner_tracking_links enable row level security;
revoke all on public.growth_partner_tracking_links from authenticated, anon;

create table if not exists public.growth_partner_tracking_link_aliases (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  alias_slug text not null unique,
  target_link_id uuid not null references public.growth_partner_tracking_links (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.growth_partner_tracking_link_aliases enable row level security;
revoke all on public.growth_partner_tracking_link_aliases from authenticated, anon;

create table if not exists public.growth_partner_attribution_touches (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  partner_public_id text not null,
  partner_slug text not null,
  session_key text not null default '',
  campaign_id text not null default '',
  utm_source text not null default '',
  utm_medium text not null default '',
  utm_campaign text not null default '',
  landing_page text not null default '',
  referrer text not null default '',
  destination_key text not null default 'home',
  first_touch_at timestamptz not null default now(),
  last_touch_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists growth_partner_attribution_touches_profile_idx
  on public.growth_partner_attribution_touches (profile_id, last_touch_at desc);

create index if not exists growth_partner_attribution_touches_session_idx
  on public.growth_partner_attribution_touches (session_key, last_touch_at desc);

alter table public.growth_partner_attribution_touches enable row level security;
revoke all on public.growth_partner_attribution_touches from authenticated, anon;

create table if not exists public.growth_partner_attributed_customers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  partner_public_id text not null,
  organization_id uuid references public.organizations (id) on delete set null,
  customer_name text not null default '',
  plan_label text not null default '',
  attribution_status text not null default 'lead_captured' check (
    attribution_status in (
      'lead_captured', 'demo_booked', 'customer_activated', 'subscription_active',
      'commission_pending', 'commission_approved', 'commission_paid', 'not_eligible'
    )
  ),
  status_key text not null default 'waiting',
  first_touch_at timestamptz,
  activated_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, organization_id)
);

create index if not exists growth_partner_attributed_customers_profile_idx
  on public.growth_partner_attributed_customers (profile_id, attribution_status);

alter table public.growth_partner_attributed_customers enable row level security;
revoke all on public.growth_partner_attributed_customers from authenticated, anon;

alter table public.organizations
  add column if not exists attributed_growth_partner_profile_id uuid references public.growth_partner_app_profiles (id) on delete set null,
  add column if not exists attributed_growth_partner_public_id text;

create table if not exists public.growth_partner_marketing_template_defs (
  id uuid primary key default gen_random_uuid(),
  template_key text not null unique,
  template_name text not null,
  template_category text not null check (
    template_category in (
      'email', 'linkedin', 'facebook', 'banner', 'landing_button',
      'brochure', 'qr', 'campaign', 'demo', 'pricing', 'business_pack'
    )
  ),
  subject_line text not null default '',
  body_template text not null,
  sort_order int not null default 0,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.growth_partner_marketing_template_defs enable row level security;
revoke all on public.growth_partner_marketing_template_defs from authenticated, anon;

create table if not exists public.growth_partner_link_audit (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.growth_partner_app_profiles (id) on delete set null,
  event_type text not null,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  actor_auth_user_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists growth_partner_link_audit_profile_idx
  on public.growth_partner_link_audit (profile_id, created_at desc);

alter table public.growth_partner_link_audit enable row level security;
revoke all on public.growth_partner_link_audit from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public._gp455a_slugify_partner_slug(p_name text)
returns text language plpgsql immutable set search_path = public as $$
declare v_slug text;
begin
  v_slug := lower(trim(coalesce(p_name, '')));
  v_slug := regexp_replace(v_slug, '[^a-z0-9]+', '-', 'g');
  v_slug := trim(both '-' from v_slug);
  if v_slug = '' then v_slug := 'partner'; end if;
  return left(v_slug, 80);
end; $$;

create or replace function public._gp455a_generate_partner_public_id()
returns text language plpgsql volatile set search_path = public as $$
declare v_id text;
begin
  loop
    v_id := 'partner_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 6);
    exit when not exists (select 1 from public.growth_partner_app_profiles p where p.partner_public_id = v_id);
  end loop;
  return v_id;
end; $$;

create or replace function public._gp455a_base_url()
returns text language sql stable as $$
  select coalesce(nullif(current_setting('app.growth_partner_base_url', true), ''), 'https://aipify.ai');
$$;

create or replace function public._gp455a_build_partner_url(p_slug text, p_to text default null, p_pack text default null)
returns text language plpgsql immutable set search_path = public as $$
declare v_url text;
begin
  v_url := public._gp455a_base_url() || '/p/' || p_slug;
  if coalesce(p_to, '') <> '' then
    v_url := v_url || '?to=' || p_to;
    if coalesce(p_pack, '') <> '' then
      v_url := v_url || '&pack=' || p_pack;
    end if;
  elsif coalesce(p_pack, '') <> '' then
    v_url := v_url || '?pack=' || p_pack;
  end if;
  return v_url;
end; $$;

create or replace function public._gp455a_render_template(p_body text, p_vars jsonb)
returns text language plpgsql immutable set search_path = public as $$
declare v_result text := coalesce(p_body, '');
  v_key text;
  v_val text;
begin
  for v_key, v_val in select * from jsonb_each_text(coalesce(p_vars, '{}'::jsonb))
  loop
    v_result := replace(v_result, '{{' || v_key || '}}', coalesce(v_val, ''));
  end loop;
  return v_result;
end; $$;

create or replace function public._gp455a_partner_template_vars(p_profile_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_profile public.growth_partner_app_profiles;
  v_slug text;
  v_partner_id text;
begin
  select * into v_profile from public.growth_partner_app_profiles where id = p_profile_id;
  if v_profile.id is null then return '{}'::jsonb; end if;
  v_slug := coalesce(v_profile.primary_link_slug, '');
  v_partner_id := coalesce(v_profile.partner_public_id, '');
  return jsonb_build_object(
    'partner_name', v_profile.full_name,
    'partner_company', v_profile.company_name,
    'partner_link', public._gp455a_build_partner_url(v_slug),
    'partner_qr_code', public._gp455a_build_partner_url(v_slug),
    'book_demo_link', public._gp455a_build_partner_url(v_slug, 'book-demo'),
    'pricing_link', public._gp455a_build_partner_url(v_slug, 'pricing'),
    'business_packs_link', public._gp455a_build_partner_url(v_slug, 'business-packs'),
    'commerce_pack_link', public._gp455a_build_partner_url(v_slug, 'business-packs', 'commerce'),
    'support_pack_link', public._gp455a_build_partner_url(v_slug, 'business-packs', 'support'),
    'hosts_pack_link', public._gp455a_build_partner_url(v_slug, 'business-packs', 'hosts')
  );
end; $$;

create or replace function public._gp455a_log_link(
  p_profile_id uuid, p_event_type text, p_summary text, p_metadata jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_link_audit (profile_id, event_type, summary, metadata, actor_auth_user_id)
  values (p_profile_id, p_event_type, left(p_summary, 500), coalesce(p_metadata, '{}'::jsonb), auth.uid());
end; $$;

create or replace function public._gp455a_resolve_slug(p_slug text)
returns table (
  profile_id uuid,
  partner_public_id text,
  slug text,
  link_id uuid,
  link_status text,
  full_name text,
  company_name text
) language plpgsql stable security definer set search_path = public as $$
declare
  v_slug text := lower(trim(coalesce(p_slug, '')));
  v_rec record;
begin
  if v_slug = '' then return; end if;

  select l.profile_id, l.partner_public_id, l.slug, l.id as link_id, l.link_status, p.full_name, p.company_name
  into v_rec
  from public.growth_partner_tracking_links l
  join public.growth_partner_app_profiles p on p.id = l.profile_id
  where l.slug = v_slug
  limit 1;

  if v_rec.profile_id is not null then
    return query select v_rec.profile_id, v_rec.partner_public_id, v_rec.slug, v_rec.link_id, v_rec.link_status, v_rec.full_name, v_rec.company_name;
    return;
  end if;

  return query
  select l.profile_id, l.partner_public_id, l.slug, l.id, l.link_status, p.full_name, p.company_name
  from public.growth_partner_tracking_link_aliases a
  join public.growth_partner_tracking_links l on l.id = a.target_link_id
  join public.growth_partner_app_profiles p on p.id = l.profile_id
  where a.alias_slug = v_slug
  limit 1;
end; $$;

create or replace function public.provision_growth_partner_tracking_link(p_profile_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_profile public.growth_partner_app_profiles;
  v_partner_id text;
  v_slug text;
  v_suffix text;
  v_link_id uuid;
  v_url text;
begin
  select * into v_profile from public.growth_partner_app_profiles where id = p_profile_id;
  if v_profile.id is null then raise exception 'Growth Partner profile not found'; end if;

  if v_profile.partner_public_id is not null and v_profile.primary_link_slug is not null then
    select id into v_link_id from public.growth_partner_tracking_links
    where profile_id = p_profile_id and is_primary = true limit 1;
    v_url := public._gp455a_build_partner_url(v_profile.primary_link_slug);
    return jsonb_build_object(
      'ok', true, 'profile_id', p_profile_id, 'partner_public_id', v_profile.partner_public_id,
      'slug', v_profile.primary_link_slug, 'link_id', v_link_id, 'partner_url', v_url
    );
  end if;

  v_partner_id := public._gp455a_generate_partner_public_id();
  v_slug := public._gp455a_slugify_partner_slug(v_profile.full_name);
  v_suffix := substr(replace(v_partner_id, 'partner_', ''), 1, 4);

  if exists (select 1 from public.growth_partner_tracking_links where slug = v_slug) then
    v_slug := v_slug || '-' || v_suffix;
  end if;

  update public.growth_partner_app_profiles
  set partner_public_id = v_partner_id, primary_link_slug = v_slug, updated_at = now()
  where id = p_profile_id;

  insert into public.growth_partner_tracking_links (profile_id, partner_public_id, slug, link_status, is_primary)
  values (p_profile_id, v_partner_id, v_slug, 'active', true)
  returning id into v_link_id;

  v_url := public._gp455a_build_partner_url(v_slug);

  perform public._gp455a_log_link(
    p_profile_id, 'link_provisioned',
    'Growth Partner tracking link provisioned automatically.',
    jsonb_build_object('partner_public_id', v_partner_id, 'slug', v_slug, 'partner_url', v_url)
  );

  return jsonb_build_object(
    'ok', true, 'profile_id', p_profile_id, 'partner_public_id', v_partner_id,
    'slug', v_slug, 'link_id', v_link_id, 'partner_url', v_url
  );
end; $$;

-- Seed marketing templates (platform-wide; variables replaced per partner at read time)
insert into public.growth_partner_marketing_template_defs
  (template_key, template_name, template_category, subject_line, body_template, sort_order)
select v.key, v.name, v.cat, v.subject, v.body, v.ord
from (values
  ('email_intro', 'Introduction email', 'email', 'Introducing Aipify for your organization',
   E'Hi,\n\nI wanted to introduce you to Aipify, a Business Operating System that helps organizations improve operations, knowledge, workflows, and customer support.\n\nYou can learn more here:\n{{partner_link}}\n\nBook a demo here:\n{{book_demo_link}}\n\nBest regards,\n{{partner_name}}\n{{partner_company}}', 1),
  ('linkedin_post', 'LinkedIn post', 'linkedin', '',
   E'Organizations are looking for operational clarity — not another disconnected tool.\n\nAipify brings Companion guidance, Business Packs, and governance into one Business Operating System.\n\nLearn more: {{partner_link}}\nPricing: {{pricing_link}}', 2),
  ('facebook_post', 'Facebook post', 'facebook', '',
   E'Aipify helps teams improve support, workflows, and operational knowledge — with human approval at every sensitive step.\n\nExplore: {{partner_link}}', 3),
  ('website_banner', 'Website banner CTA', 'banner', '',
   E'Request a guided Aipify overview → {{partner_link}}', 4),
  ('demo_booking', 'Demo booking CTA', 'demo', 'Book your Aipify demo',
   E'Schedule a calm, structured demo with {{partner_name}}:\n{{book_demo_link}}', 5),
  ('pricing_cta', 'Pricing CTA', 'pricing', '',
   E'Review Aipify plans with your partner link:\n{{pricing_link}}', 6),
  ('commerce_pack', 'Commerce Pack outreach', 'business_pack', '',
   E'Commerce operators are adopting the Commerce Pack through Aipify.\n\nLearn more: {{commerce_pack_link}}', 7),
  ('support_pack', 'Support Pack outreach', 'business_pack', '',
   E'Support leaders use the Support Pack to improve triage and knowledge workflows.\n\n{{support_pack_link}}', 8),
  ('hosts_pack', 'Aipify Hosts outreach', 'business_pack', '',
   E'Hospitality teams use Aipify Hosts for guest operations intelligence.\n\n{{hosts_pack_link}}', 9)
) as v(key, name, cat, subject, body, ord)
where not exists (select 1 from public.growth_partner_marketing_template_defs t where t.template_key = v.key);

-- Backfill links for existing profiles
do $$
declare r record;
begin
  for r in select id from public.growth_partner_app_profiles where partner_public_id is null
  loop
    perform public.provision_growth_partner_tracking_link(r.id);
  end loop;
end $$;

-- Update signup: optional business registration + auto link
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
  v_link jsonb;
  v_reg_number text;
begin
  v_auth_id := auth.uid();
  if v_auth_id is null then raise exception 'Authentication required'; end if;

  if exists (select 1 from public.growth_partner_app_profiles where auth_user_id = v_auth_id) then
    select id, organization_id into v_profile_id, v_org_id
    from public.growth_partner_app_profiles where auth_user_id = v_auth_id limit 1;
    v_link := public.provision_growth_partner_tracking_link(v_profile_id);
    return jsonb_build_object(
      'ok', true, 'profile_id', v_profile_id, 'organization_id', v_org_id,
      'redirect_path', '/app/growth-partner', 'partner_status', 'certification_required',
      'partner_link', v_link
    );
  end if;

  if coalesce(p_payload->>'full_name', '') = '' then raise exception 'full_name is required'; end if;
  if coalesce(p_payload->>'company_name', '') = '' then raise exception 'company_name is required'; end if;
  if coalesce(p_payload->>'country', '') = '' then raise exception 'country is required'; end if;
  if coalesce(p_payload->>'address', '') = '' then raise exception 'address is required'; end if;
  if coalesce(p_payload->>'phone_number', '') = '' then raise exception 'phone_number is required'; end if;
  if coalesce(p_payload->>'email', '') = '' then raise exception 'email is required'; end if;
  v_reg_number := coalesce(nullif(trim(p_payload->>'business_registration_number'), ''), 'pending');
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
      v_company_id, 'company', p_payload->>'company_name', v_reg_number,
      p_payload->>'full_name', p_payload->>'email',
      coalesce(p_payload->>'phone_country_code', '+47') || ' ' || p_payload->>'phone_number',
      p_payload->>'country', 'en', 'active'
    ) returning id into v_customer_id;
  else
    update public.customers set
      company_name = p_payload->>'company_name',
      organization_number = v_reg_number,
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
    name = excluded.name, slug = excluded.slug, tenant_type = 'growth_partner',
    metadata = aipify_tenant_profiles.metadata || excluded.metadata, updated_at = now();

  v_org_id := v_customer_id;
  perform public._mta_sync_organization_from_customer(v_customer_id);
  update public.organizations set
    name = p_payload->>'company_name', slug = v_slug, status = 'active',
    subscription_plan = 'growth_partner', updated_at = now()
  where id = v_org_id;

  perform public._mta_seed_organization_modules(v_org_id);
  perform public._mta_seed_organization_settings(v_org_id);
  perform public._gp455_seed_role_permissions(v_org_id);

  insert into public.organization_users (organization_id, user_id, role, status, joined_at)
  values (v_org_id, v_user_id, 'growth_partner', 'active', now())
  on conflict (organization_id, user_id) do update set role = 'growth_partner', status = 'active', updated_at = now();

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
    p_payload->>'company_name', v_reg_number,
    p_payload->>'address', '0000', 'Pending', p_payload->>'country',
    'growth_partner', '1-5', 'growth_partner',
    true, 'pending', now()
  )
  on conflict (customer_id) do update set
    organization_type = 'growth_partner', growth_partner_eligible = true,
    registration_completed_at = now(), updated_at = now();

  insert into public.growth_partner_app_profiles (
    auth_user_id, organization_id, user_id,
    full_name, company_name, business_registration_number, country, address,
    phone_country_code, phone_number, email,
    partner_status, certification_status, training_progress_pct
  ) values (
    v_auth_id, v_org_id, v_user_id,
    p_payload->>'full_name', p_payload->>'company_name', v_reg_number,
    p_payload->>'country', p_payload->>'address',
    coalesce(p_payload->>'phone_country_code', '+47'), p_payload->>'phone_number', p_payload->>'email',
    'certification_required', 'pending', 0
  ) returning id into v_profile_id;

  perform public._gp455_seed_training(v_profile_id);
  v_link := public.provision_growth_partner_tracking_link(v_profile_id);
  perform public._gp455_log(v_profile_id, v_org_id, 'signup_completed', 'Growth Partner public signup completed with auto tracking link', p_payload);
  perform public._gp455a_log_link(v_profile_id, 'signup_link_created', 'Partner tracking link created on registration.', v_link);

  return jsonb_build_object(
    'ok', true, 'profile_id', v_profile_id, 'organization_id', v_org_id,
    'redirect_path', '/app/growth-partner', 'partner_status', 'certification_required',
    'partner_link', v_link
  );
end; $$;

-- Public: resolve partner link (anon)
create or replace function public.resolve_growth_partner_public_link(p_slug text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_row record;
begin
  select * into v_row from public._gp455a_resolve_slug(p_slug) limit 1;
  if v_row.profile_id is null then
    return jsonb_build_object('found', false, 'error', 'Partner link not found');
  end if;
  if v_row.link_status <> 'active' then
    return jsonb_build_object('found', false, 'error', 'Partner link disabled');
  end if;
  return jsonb_build_object(
    'found', true,
    'profile_id', v_row.profile_id,
    'partner_public_id', v_row.partner_public_id,
    'slug', v_row.slug,
    'partner_name', v_row.full_name,
    'partner_company', v_row.company_name,
    'partner_url', public._gp455a_build_partner_url(v_row.slug)
  );
end; $$;

grant execute on function public.resolve_growth_partner_public_link(text) to anon, authenticated;

-- Public: capture attribution touch (anon)
create or replace function public.capture_growth_partner_attribution(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_slug text := lower(trim(coalesce(p_payload->>'partner_slug', '')));
  v_row record;
  v_session text := coalesce(p_payload->>'session_key', gen_random_uuid()::text);
  v_touch_id uuid;
begin
  select * into v_row from public._gp455a_resolve_slug(v_slug) limit 1;
  if v_row.profile_id is null then
    return jsonb_build_object('ok', false, 'error', 'Invalid partner link');
  end if;
  if v_row.link_status <> 'active' then
    return jsonb_build_object('ok', false, 'error', 'Partner link disabled');
  end if;

  insert into public.growth_partner_attribution_touches (
    profile_id, partner_public_id, partner_slug, session_key,
    campaign_id, utm_source, utm_medium, utm_campaign,
    landing_page, referrer, destination_key, metadata
  ) values (
    v_row.profile_id, v_row.partner_public_id, v_row.slug, v_session,
    coalesce(p_payload->>'campaign_id', ''),
    coalesce(p_payload->>'utm_source', ''), coalesce(p_payload->>'utm_medium', ''),
    coalesce(p_payload->>'utm_campaign', ''),
    coalesce(p_payload->>'landing_page', ''), coalesce(p_payload->>'referrer', ''),
    coalesce(p_payload->>'destination_key', 'home'),
    coalesce(p_payload->'metadata', '{}'::jsonb)
  ) returning id into v_touch_id;

  perform public._gp455a_log_link(
    v_row.profile_id, 'attribution_touch',
    'Visitor attribution captured.',
    jsonb_build_object('touch_id', v_touch_id, 'session_key', v_session, 'destination', p_payload->>'destination_key')
  );

  return jsonb_build_object(
    'ok', true,
    'touch_id', v_touch_id,
    'session_key', v_session,
    'partner_public_id', v_row.partner_public_id,
    'partner_slug', v_row.slug,
    'profile_id', v_row.profile_id
  );
end; $$;

grant execute on function public.capture_growth_partner_attribution(jsonb) to anon, authenticated;

-- Attach attribution when customer org is created
create or replace function public.apply_growth_partner_attribution_to_organization(
  p_organization_id uuid,
  p_partner_public_id text,
  p_partner_slug text default null,
  p_session_key text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_profile_id uuid;
begin
  if coalesce(p_partner_public_id, '') = '' then
    return jsonb_build_object('ok', false, 'error', 'No partner attribution');
  end if;

  select id into v_profile_id from public.growth_partner_app_profiles
  where partner_public_id = p_partner_public_id limit 1;

  if v_profile_id is null then
    return jsonb_build_object('ok', false, 'error', 'Partner not found');
  end if;

  update public.organizations set
    attributed_growth_partner_profile_id = v_profile_id,
    attributed_growth_partner_public_id = p_partner_public_id,
    updated_at = now()
  where id = p_organization_id;

  insert into public.growth_partner_attributed_customers (
    profile_id, partner_public_id, organization_id, customer_name, attribution_status, status_key, first_touch_at
  )
  select v_profile_id, p_partner_public_id, p_organization_id, o.name, 'customer_activated', 'verified', now()
  from public.organizations o where o.id = p_organization_id
  on conflict (profile_id, organization_id) do update set
    attribution_status = excluded.attribution_status,
    status_key = excluded.status_key,
    updated_at = now();

  perform public._gp455a_log_link(
    v_profile_id, 'customer_attributed',
    'Customer organization attributed to Growth Partner.',
    jsonb_build_object('organization_id', p_organization_id, 'session_key', p_session_key, 'slug', p_partner_slug)
  );

  return jsonb_build_object('ok', true, 'profile_id', v_profile_id, 'organization_id', p_organization_id);
end; $$;

grant execute on function public.apply_growth_partner_attribution_to_organization(uuid, text, text, text) to authenticated;

-- Partner marketing center with rendered templates
create or replace function public.get_growth_partner_marketing_attribution_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_profile public.growth_partner_app_profiles;
  v_vars jsonb;
  v_templates jsonb;
  v_campaigns jsonb;
  v_attribution jsonb;
begin
  v_profile := public._gp455_profile_for_auth();
  if v_profile.id is null then
    return jsonb_build_object('found', false, 'error', 'Growth Partner profile not found');
  end if;

  perform public.provision_growth_partner_tracking_link(v_profile.id);
  select * into v_profile from public.growth_partner_app_profiles where id = v_profile.id;

  v_vars := public._gp455a_partner_template_vars(v_profile.id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'template_key', t.template_key,
    'template_name', t.template_name,
    'template_category', t.template_category,
    'subject_line', public._gp455a_render_template(t.subject_line, v_vars),
    'body_rendered', public._gp455a_render_template(t.body_template, v_vars),
    'body_template', t.body_template,
    'sort_order', t.sort_order
  ) order by t.sort_order), '[]'::jsonb)
  into v_templates
  from public.growth_partner_marketing_template_defs t
  where t.status = 'published';

  select coalesce(jsonb_agg(jsonb_build_object(
    'campaign_key', c.key,
    'title', c.title,
    'partner_url', public._gp455a_build_partner_url(v_profile.primary_link_slug, c.dest, c.pack)
  ) order by c.ord), '[]'::jsonb)
  into v_campaigns
  from (values
    ('home', 'Home landing', 'home', null, 1),
    ('pricing', 'Pricing page', 'pricing', null, 2),
    ('book_demo', 'Book demo', 'book-demo', null, 3),
    ('business_packs', 'Business Packs', 'business-packs', null, 4),
    ('commerce_pack', 'Commerce Pack', 'business-packs', 'commerce', 5),
    ('support_pack', 'Support Pack', 'business-packs', 'support', 6),
    ('hosts_pack', 'Aipify Hosts', 'business-packs', 'hosts', 7)
  ) as c(key, title, dest, pack, ord);

  select coalesce(jsonb_agg(jsonb_build_object(
    'attribution_status', a.attribution_status, 'customer_name', a.customer_name,
    'plan_label', a.plan_label, 'status_key', a.status_key, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_attribution
  from (
    select * from public.growth_partner_attributed_customers
    where profile_id = v_profile.id order by created_at desc limit 20
  ) a;

  return jsonb_build_object(
    'found', true,
    'partner_public_id', v_profile.partner_public_id,
    'partner_slug', v_profile.primary_link_slug,
    'partner_url', public._gp455a_build_partner_url(v_profile.primary_link_slug),
    'partner_name', v_profile.full_name,
    'partner_company', v_profile.company_name,
    'template_variables', v_vars,
    'marketing_templates', v_templates,
    'campaign_links', v_campaigns,
    'attributed_customers', v_attribution,
    'privacy_note', 'Growth Partners see attribution and commission data only — never customer internal APP systems.',
    'principle', 'Aipify prepares marketing material with your tracking link already included. You never edit links manually.'
  );
end; $$;

grant execute on function public.get_growth_partner_marketing_attribution_center() to authenticated;

-- Extend operations center with partner link block
create or replace function public.get_growth_partner_operations_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb;
  v_profile_id uuid;
  v_partner_status text;
  v_cert_key text;
  v_cert_label text;
  v_dashboard jsonb := '[]'::jsonb;
  v_leads jsonb := '[]'::jsonb;
  v_opportunities jsonb := '[]'::jsonb;
  v_customers jsonb := '[]'::jsonb;
  v_commissions jsonb := '[]'::jsonb;
  v_payouts jsonb := '[]'::jsonb;
  v_resources jsonb := '[]'::jsonb;
  v_training jsonb := '[]'::jsonb;
  v_performance jsonb := '[]'::jsonb;
  v_recommendations jsonb := '[]'::jsonb;
  v_activity jsonb := '[]'::jsonb;
  v_completed int;
  v_total int;
  v_profile public.growth_partner_app_profiles;
  v_link jsonb;
begin
  v_ctx := public._gpo456_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then return v_ctx; end if;

  v_profile_id := (v_ctx->>'profile_id')::uuid;
  v_partner_status := coalesce(v_ctx->>'partner_status', 'certification_required');
  perform public._gpo456_seed(v_profile_id);
  v_link := public.provision_growth_partner_tracking_link(v_profile_id);
  select * into v_profile from public.growth_partner_app_profiles where id = v_profile_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'metric_key', d.metric_key, 'metric_value', d.metric_value,
    'trend_label', d.trend_label, 'status_key', d.status_key, 'item_type', 'dashboard_metric'
  ) order by d.metric_key), '[]'::jsonb)
  into v_dashboard from public.growth_partner_ops_dashboard_metrics d where d.profile_id = v_profile_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'lead_key', l.lead_key, 'company_name', l.company_name, 'contact_name', l.contact_name,
    'lead_status', l.lead_status, 'lead_source', l.lead_source, 'partner_notes', l.partner_notes,
    'follow_up_task', l.follow_up_task, 'status_key', l.status_key, 'item_type', 'lead'
  ) order by l.updated_at desc), '[]'::jsonb)
  into v_leads from public.growth_partner_ops_leads l where l.profile_id = v_profile_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id, 'opportunity_key', o.opportunity_key, 'title', o.title, 'stage', o.stage,
    'forecast_value_label', o.forecast_value_label, 'expected_close_date', o.expected_close_date,
    'status_key', o.status_key, 'item_type', 'opportunity'
  ) order by o.updated_at desc), '[]'::jsonb)
  into v_opportunities from public.growth_partner_ops_opportunities o where o.profile_id = v_profile_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'customer_key', c.customer_key, 'customer_name', c.customer_name,
    'plan_label', c.plan_label, 'monthly_revenue_label', c.monthly_revenue_label,
    'commission_value_label', c.commission_value_label, 'renewal_status', c.renewal_status,
    'health_label', c.health_label, 'support_status', c.support_status,
    'status_key', c.status_key, 'item_type', 'customer'
  ) order by c.customer_name), '[]'::jsonb)
  into v_customers from public.growth_partner_ops_customers c where c.profile_id = v_profile_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'period_key', c.period_key, 'period_label', c.period_label,
    'amount_label', c.amount_label, 'commission_type', c.commission_type,
    'rules_summary', c.rules_summary, 'status_key', c.status_key, 'item_type', 'commission'
  ) order by case c.commission_type
    when 'current_month' then 1 when 'previous_month' then 2 when 'quarter' then 3
    when 'year' then 4 when 'lifetime' then 5 else 6 end), '[]'::jsonb)
  into v_commissions from public.growth_partner_ops_commissions c where c.profile_id = v_profile_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'payout_key', p.payout_key, 'amount_label', p.amount_label,
    'payout_status', p.payout_status, 'bank_verification_label', p.bank_verification_label,
    'settlement_date_label', p.settlement_date_label, 'status_key', p.status_key, 'item_type', 'payout'
  ) order by p.updated_at desc), '[]'::jsonb)
  into v_payouts from public.growth_partner_ops_payouts p where p.profile_id = v_profile_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'resource_type', r.resource_type, 'title', r.title, 'summary', r.summary,
    'status_key', r.status_key, 'item_type', 'resource'
  ) order by r.title), '[]'::jsonb)
  into v_resources from public.growth_partner_ops_resources r where r.profile_id = v_profile_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'metric_key', m.metric_key, 'metric_value', m.metric_value,
    'trend_label', m.trend_label, 'status_key', m.status_key, 'item_type', 'performance'
  ) order by m.metric_key), '[]'::jsonb)
  into v_performance from public.growth_partner_ops_performance m where m.profile_id = v_profile_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'recommendation_type', r.recommendation_type, 'title', r.title,
    'insight', r.insight, 'status_key', r.status_key, 'item_type', 'recommendation'
  ) order by r.updated_at desc), '[]'::jsonb)
  into v_recommendations from public.growth_partner_ops_recommendations r where r.profile_id = v_profile_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'activity_key', a.activity_key, 'title', a.title, 'summary', a.summary,
    'date_label', a.date_label, 'audit_ref', a.audit_ref, 'status_key', a.status_key, 'item_type', 'activity'
  ) order by a.created_at desc), '[]'::jsonb)
  into v_activity from public.growth_partner_ops_activity a where a.profile_id = v_profile_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'module_key', m.module_key, 'module_title', m.module_title,
    'status', coalesce(tp.status, 'not_started'), 'sort_order', m.sort_order, 'item_type', 'training_module'
  ) order by m.sort_order), '[]'::jsonb)
  into v_training
  from public.growth_partner_training_modules m
  left join public.growth_partner_training_progress tp
    on tp.module_key = m.module_key and tp.profile_id = v_profile_id;

  select count(*) filter (where tp.status = 'completed'), count(*)
  into v_completed, v_total
  from public.growth_partner_training_progress tp where tp.profile_id = v_profile_id;

  if v_partner_status = 'certified' then
    v_cert_key := 'verified'; v_cert_label := 'Verified — Certified Growth Partner';
  else
    v_cert_key := 'waiting'; v_cert_label := 'Waiting — Certification Required';
  end if;

  return jsonb_build_object(
    'found', true,
    'partner_status', v_partner_status,
    'certification_status', coalesce(v_ctx->>'certification_status', 'pending'),
    'certification_status_key', v_cert_key,
    'certification_status_label', v_cert_label,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'governance_note', 'Every sales action includes audit log, partner attribution, commission traceability, payout traceability, and approval history. Growth Partners see only their own data.',
    'privacy_note', 'No access to Platform Admin, Super Admin, other partner data, or customer internal systems.',
    'training_progress_pct', case when v_total > 0 then round((v_completed::numeric / v_total) * 100)::int else 0 end,
    'training_completed_count', v_completed,
    'training_total_count', v_total,
    'partner_link', jsonb_build_object(
      'partner_public_id', v_profile.partner_public_id,
      'slug', v_profile.primary_link_slug,
      'partner_url', public._gp455a_build_partner_url(v_profile.primary_link_slug),
      'link_status', 'active',
      'marketing_route', '/app/growth-partner/marketing'
    ),
    'dashboard_metrics', v_dashboard,
    'lead_management', v_leads,
    'opportunity_pipeline', v_opportunities,
    'customer_portfolio', v_customers,
    'commission_center', v_commissions,
    'payout_center', v_payouts,
    'marketing_resources', v_resources,
    'training_center', v_training,
    'performance_center', v_performance,
    'growth_recommendations', v_recommendations,
    'recent_activity', v_activity,
    'statistics', jsonb_build_object(
      'lead_count', jsonb_array_length(v_leads),
      'opportunity_count', jsonb_array_length(v_opportunities),
      'customer_count', jsonb_array_length(v_customers),
      'resource_count', jsonb_array_length(v_resources)
    )
  );
end; $$;

-- Platform admin: list partner links
create or replace function public.get_platform_growth_partner_links_overview()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_links jsonb;
begin
  if not public.is_platform_admin() then
    return jsonb_build_object('found', false, 'error', 'Platform admin required');
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'profile_id', p.id,
    'partner_public_id', p.partner_public_id,
    'slug', p.primary_link_slug,
    'partner_url', public._gp455a_build_partner_url(p.primary_link_slug),
    'full_name', p.full_name,
    'company_name', p.company_name,
    'email', p.email,
    'partner_status', p.partner_status,
    'link_status', coalesce(l.link_status, 'unknown'),
    'created_at', p.created_at
  ) order by p.created_at desc), '[]'::jsonb)
  into v_links
  from public.growth_partner_app_profiles p
  left join public.growth_partner_tracking_links l on l.profile_id = p.id and l.is_primary = true;

  return jsonb_build_object('found', true, 'links', v_links, 'privacy_note', 'Platform sees link metadata only — not customer internal data.');
end; $$;

grant execute on function public.get_platform_growth_partner_links_overview() to authenticated;

create or replace function public.admin_regenerate_growth_partner_link(p_profile_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_profile public.growth_partner_app_profiles;
  v_old_slug text;
  v_new_slug text;
  v_partner_id text;
  v_link_id uuid;
  v_suffix text;
begin
  if not public.is_platform_admin() then raise exception 'Platform admin required'; end if;

  select * into v_profile from public.growth_partner_app_profiles where id = p_profile_id;
  if v_profile.id is null then raise exception 'Profile not found'; end if;

  v_old_slug := v_profile.primary_link_slug;
  v_partner_id := coalesce(v_profile.partner_public_id, public._gp455a_generate_partner_public_id());
  v_suffix := substr(replace(v_partner_id, 'partner_', ''), 1, 4);
  v_new_slug := public._gp455a_slugify_partner_slug(v_profile.full_name) || '-' || v_suffix;

  if v_old_slug is not null then
    insert into public.growth_partner_tracking_link_aliases (profile_id, alias_slug, target_link_id)
    select p_profile_id, v_old_slug, l.id from public.growth_partner_tracking_links l
    where l.profile_id = p_profile_id and l.is_primary = true
    on conflict (alias_slug) do nothing;
  end if;

  update public.growth_partner_tracking_links set is_primary = false where profile_id = p_profile_id;

  insert into public.growth_partner_tracking_links (profile_id, partner_public_id, slug, link_status, is_primary)
  values (p_profile_id, v_partner_id, v_new_slug, 'active', true)
  returning id into v_link_id;

  update public.growth_partner_app_profiles
  set partner_public_id = v_partner_id, primary_link_slug = v_new_slug, updated_at = now()
  where id = p_profile_id;

  perform public._gp455a_log_link(
    p_profile_id, 'link_regenerated',
    'Platform admin regenerated partner link. Previous slug preserved as alias.',
    jsonb_build_object('old_slug', v_old_slug, 'new_slug', v_new_slug)
  );

  return jsonb_build_object(
    'ok', true, 'profile_id', p_profile_id, 'old_slug', v_old_slug,
    'slug', v_new_slug, 'partner_url', public._gp455a_build_partner_url(v_new_slug)
  );
end; $$;

grant execute on function public.admin_regenerate_growth_partner_link(uuid) to authenticated;

create or replace function public.admin_set_growth_partner_link_status(p_profile_id uuid, p_active boolean)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_status text := case when p_active then 'active' else 'disabled' end;
begin
  if not public.is_platform_admin() then raise exception 'Platform admin required'; end if;

  update public.growth_partner_tracking_links
  set link_status = v_status, updated_at = now()
  where profile_id = p_profile_id and is_primary = true;

  perform public._gp455a_log_link(
    p_profile_id, case when p_active then 'link_enabled' else 'link_disabled' end,
    'Platform admin changed partner link status.',
    jsonb_build_object('link_status', v_status)
  );

  return jsonb_build_object('ok', true, 'profile_id', p_profile_id, 'link_status', v_status);
end; $$;

grant execute on function public.admin_set_growth_partner_link_status(uuid, boolean) to authenticated;

grant execute on function public.provision_growth_partner_tracking_link(uuid) to authenticated;
