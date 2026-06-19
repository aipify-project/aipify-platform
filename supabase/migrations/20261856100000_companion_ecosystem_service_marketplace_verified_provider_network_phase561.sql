-- Phase 561 — Companion Ecosystem, Service Marketplace & Verified Provider Network
-- Feature owner: CUSTOMER APP + PLATFORM ADMIN
-- Routes: /app/companion/ecosystem, /app/companion/services, /platform/providers
-- Helpers: _cmes561_* (customer), _pprov561_* (platform)

-- ===========================================================================
-- PLATFORM — Verified Provider Registry
-- ===========================================================================

create table if not exists public.platform_verified_provider_settings (
  id uuid primary key default gen_random_uuid(),
  registry_enabled boolean not null default true,
  verification_required boolean not null default true,
  ratings_enabled boolean not null default true,
  growth_partner_integration_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.platform_verified_provider_settings (id)
select gen_random_uuid() where not exists (
  select 1 from public.platform_verified_provider_settings limit 1
);

alter table public.platform_verified_provider_settings enable row level security;
revoke all on public.platform_verified_provider_settings from authenticated, anon;

create table if not exists public.platform_verified_providers (
  id uuid primary key default gen_random_uuid(),
  provider_key text not null unique,
  company_name text not null,
  country text not null default 'Norway',
  industry text not null default '',
  provider_category text not null check (
    provider_category in (
      'consulting', 'accounting', 'legal', 'marketing', 'it_services',
      'security', 'property_services', 'training', 'recruitment', 'custom'
    )
  ),
  verification_status text not null default 'pending' check (
    verification_status in ('pending', 'verified', 'review_required', 'suspended')
  ),
  overall_rating numeric(3,2) not null default 0 check (overall_rating between 0 and 5),
  services_count integer not null default 0,
  projects_completed integer not null default 0,
  response_time_hours numeric(8,2) not null default 24,
  performance_label text not null default 'healthy' check (
    performance_label in ('excellent', 'healthy', 'review_required')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_verified_providers enable row level security;
revoke all on public.platform_verified_providers from authenticated, anon;

create table if not exists public.platform_verified_provider_services (
  id uuid primary key default gen_random_uuid(),
  provider_key text not null references public.platform_verified_providers (provider_key) on delete cascade,
  service_key text not null,
  service_title text not null,
  marketplace_category text not null check (
    marketplace_category in (
      'professional_services', 'operational_services', 'compliance_services',
      'technology_services', 'growth_services', 'training_services',
      'property_services', 'custom'
    )
  ),
  domain_scope text not null default 'organization_wide' check (
    domain_scope in ('firma.no', 'butikk.no', 'support.no', 'organization_wide', 'custom')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  is_active boolean not null default true,
  unique (provider_key, service_key)
);

alter table public.platform_verified_provider_services enable row level security;
revoke all on public.platform_verified_provider_services from authenticated, anon;

create table if not exists public.platform_verified_provider_verifications (
  id uuid primary key default gen_random_uuid(),
  provider_key text not null references public.platform_verified_providers (provider_key) on delete cascade,
  verification_type text not null check (
    verification_type in ('identity', 'business', 'insurance', 'certification', 'compliance', 'contract')
  ),
  verification_status text not null default 'pending' check (
    verification_status in ('pending', 'verified', 'failed', 'expired')
  ),
  verified_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (provider_key, verification_type)
);

alter table public.platform_verified_provider_verifications enable row level security;
revoke all on public.platform_verified_provider_verifications from authenticated, anon;

create table if not exists public.platform_verified_provider_contracts (
  id uuid primary key default gen_random_uuid(),
  provider_key text not null references public.platform_verified_providers (provider_key) on delete cascade,
  contract_key text not null,
  contract_title text not null,
  contract_status text not null default 'active' check (
    contract_status in ('draft', 'active', 'renewal_due', 'expired', 'terminated')
  ),
  expires_at timestamptz,
  sla_summary text not null default '' check (char_length(sla_summary) <= 500),
  unique (provider_key, contract_key)
);

alter table public.platform_verified_provider_contracts enable row level security;
revoke all on public.platform_verified_provider_contracts from authenticated, anon;

create table if not exists public.platform_verified_provider_audit_logs (
  id uuid primary key default gen_random_uuid(),
  provider_key text,
  event_type text not null,
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists platform_verified_provider_audit_logs_created_idx
  on public.platform_verified_provider_audit_logs (created_at desc);

alter table public.platform_verified_provider_audit_logs enable row level security;
revoke all on public.platform_verified_provider_audit_logs from authenticated, anon;

-- ===========================================================================
-- CUSTOMER — Companion Ecosystem
-- ===========================================================================

create table if not exists public.organization_companion_ecosystem_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  ecosystem_enabled boolean not null default true,
  marketplace_enabled boolean not null default true,
  verified_providers_only boolean not null default true,
  human_approval_required boolean not null default true,
  ratings_enabled boolean not null default true,
  growth_partner_referrals_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_companion_ecosystem_settings enable row level security;
revoke all on public.organization_companion_ecosystem_settings from authenticated, anon;

create table if not exists public.organization_companion_ecosystem_service_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  request_key text not null,
  service_title text not null,
  provider_key text not null,
  provider_name text not null default '',
  request_status text not null default 'pending_approval' check (
    request_status in (
      'draft', 'pending_approval', 'approved', 'provider_responded',
      'in_progress', 'completed', 'cancelled', 'rejected'
    )
  ),
  domain_scope text not null default 'organization_wide' check (
    domain_scope in ('firma.no', 'butikk.no', 'support.no', 'organization_wide', 'custom')
  ),
  business_pack_key text,
  summary text not null default '' check (char_length(summary) <= 500),
  recorded_at timestamptz not null default now(),
  unique (organization_id, request_key)
);

alter table public.organization_companion_ecosystem_service_requests enable row level security;
revoke all on public.organization_companion_ecosystem_service_requests from authenticated, anon;

create table if not exists public.organization_companion_ecosystem_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  approval_key text not null,
  request_key text not null,
  approval_title text not null,
  approval_status text not null default 'pending' check (
    approval_status in ('pending', 'approved', 'denied', 'escalated')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, approval_key)
);

alter table public.organization_companion_ecosystem_approvals enable row level security;
revoke all on public.organization_companion_ecosystem_approvals from authenticated, anon;

create table if not exists public.organization_companion_ecosystem_ratings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  rating_key text not null,
  provider_key text not null,
  provider_name text not null default '',
  service_quality_score integer not null default 4 check (service_quality_score between 1 and 5),
  response_time_score integer not null default 4 check (response_time_score between 1 and 5),
  satisfaction_score integer not null default 4 check (satisfaction_score between 1 and 5),
  overall_rating numeric(3,2) not null default 4.0,
  review_summary text not null default '' check (char_length(review_summary) <= 500),
  is_auditable boolean not null default true,
  recorded_at timestamptz not null default now(),
  unique (organization_id, rating_key)
);

alter table public.organization_companion_ecosystem_ratings enable row level security;
revoke all on public.organization_companion_ecosystem_ratings from authenticated, anon;

create table if not exists public.organization_companion_ecosystem_contracts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  contract_key text not null,
  provider_key text not null,
  contract_title text not null,
  contract_status text not null default 'active' check (
    contract_status in ('draft', 'active', 'renewal_due', 'expired', 'terminated')
  ),
  expires_at timestamptz,
  sla_summary text not null default '' check (char_length(sla_summary) <= 500),
  unique (organization_id, contract_key)
);

alter table public.organization_companion_ecosystem_contracts enable row level security;
revoke all on public.organization_companion_ecosystem_contracts from authenticated, anon;

create table if not exists public.organization_companion_ecosystem_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  recommendation_key text not null,
  recommendation_title text not null,
  recommendation_type text not null default 'provider' check (
    recommendation_type in ('provider', 'service', 'regional', 'business_pack')
  ),
  provider_keys jsonb not null default '[]'::jsonb,
  reason_summary text not null default '' check (char_length(reason_summary) <= 500),
  confidence_level text not null default 'high' check (
    confidence_level in ('high', 'moderate', 'limited')
  ),
  unique (organization_id, recommendation_key)
);

alter table public.organization_companion_ecosystem_recommendations enable row level security;
revoke all on public.organization_companion_ecosystem_recommendations from authenticated, anon;

create table if not exists public.organization_companion_ecosystem_business_pack_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  provider_category text not null default '',
  recommended_provider_keys jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_companion_ecosystem_business_pack_links enable row level security;
revoke all on public.organization_companion_ecosystem_business_pack_links from authenticated, anon;

create table if not exists public.organization_companion_ecosystem_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'ecosystem' check (
    audit_category in ('provider', 'service', 'request', 'approval', 'rating', 'contract', 'growth_partner')
  ),
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_companion_ecosystem_audit_logs_org_idx
  on public.organization_companion_ecosystem_audit_logs (organization_id, created_at desc);

alter table public.organization_companion_ecosystem_audit_logs enable row level security;
revoke all on public.organization_companion_ecosystem_audit_logs from authenticated, anon;

-- ===========================================================================
-- Helpers — Platform
-- ===========================================================================

create or replace function public._pprov561_require_platform_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;
end; $$;

create or replace function public._pprov561_log(
  p_provider_key text, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.platform_verified_provider_audit_logs (provider_key, event_type, summary, context)
  values (p_provider_key, p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end; $$;

create or replace function public._pprov561_seed()
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.platform_verified_providers limit 1) then
    return;
  end if;

  insert into public.platform_verified_providers (
    provider_key, company_name, country, industry, provider_category,
    verification_status, overall_rating, services_count, projects_completed,
    response_time_hours, performance_label, summary
  ) values
    ('prov_nordic_accounting', 'Nordic Accounting AS', 'Norway', 'Accounting', 'accounting',
     'verified', 4.8, 3, 42, 4.5, 'excellent', 'Verified accountant for Norwegian organizations.'),
    ('prov_bergen_legal', 'Bergen Legal Partners', 'Norway', 'Legal', 'legal',
     'verified', 4.7, 2, 28, 8.0, 'excellent', 'Verified lawyer for contracts and compliance.'),
    ('prov_nordic_marketing', 'Nordic Growth Marketing', 'Norway', 'Marketing', 'marketing',
     'verified', 4.6, 4, 56, 6.0, 'healthy', 'Verified marketing agency for campaign setup.'),
    ('prov_secure_it', 'Secure IT Consulting', 'Norway', 'Technology', 'it_services',
     'verified', 4.9, 3, 35, 3.0, 'excellent', 'Verified IT consultant and security audits.'),
    ('prov_property_nord', 'Property Nord Services', 'Norway', 'Property', 'property_services',
     'review_required', 4.2, 2, 18, 12.0, 'review_required', 'Property maintenance — review in progress.'),
    ('prov_talent_norge', 'Talent Norge Recruitment', 'Norway', 'Recruitment', 'recruitment',
     'verified', 4.5, 2, 22, 10.0, 'healthy', 'Verified recruiter for professional roles.');

  insert into public.platform_verified_provider_services (
    provider_key, service_key, service_title, marketplace_category, domain_scope, summary
  ) values
    ('prov_nordic_accounting', 'svc_accounting', 'Accounting Assistance', 'professional_services', 'firma.no', 'Monthly accounting and reporting support.'),
    ('prov_bergen_legal', 'svc_legal_review', 'Legal Review', 'compliance_services', 'organization_wide', 'Contract and policy legal review.'),
    ('prov_nordic_marketing', 'svc_campaign', 'Marketing Campaign Setup', 'growth_services', 'butikk.no', 'Campaign planning and launch support.'),
    ('prov_secure_it', 'svc_security_audit', 'Security Audit', 'technology_services', 'organization_wide', 'Security assessment and recommendations.'),
    ('prov_secure_it', 'svc_it_consulting', 'Business Consulting', 'technology_services', 'support.no', 'IT strategy and implementation guidance.'),
    ('prov_property_nord', 'svc_maintenance', 'Property Maintenance', 'property_services', 'organization_wide', 'Cleaning and property maintenance coordination.'),
    ('prov_talent_norge', 'svc_recruitment', 'Recruitment Assistance', 'professional_services', 'organization_wide', 'Candidate sourcing and screening support.');

  insert into public.platform_verified_provider_verifications (
    provider_key, verification_type, verification_status, verified_at, summary
  )
  select p.provider_key, v.vtype, v.vstatus, now(), v.vsummary
  from public.platform_verified_providers p
  cross join (values
    ('identity', 'verified', 'Identity verified'),
    ('business', 'verified', 'Business registration verified'),
    ('insurance', 'verified', 'Professional insurance confirmed'),
    ('certification', 'verified', 'Industry certifications on file'),
    ('compliance', 'verified', 'Compliance review passed'),
    ('contract', 'verified', 'Platform provider agreement accepted')
  ) as v(vtype, vstatus, vsummary)
  where p.verification_status = 'verified';

  insert into public.platform_verified_provider_contracts (
    provider_key, contract_key, contract_title, contract_status, expires_at, sla_summary
  ) values
    ('prov_nordic_accounting', 'ctr_platform_2026', 'Platform Provider Agreement', 'active',
     now() + interval '1 year', 'Response within 24 hours on business days.'),
    ('prov_bergen_legal', 'ctr_platform_2026', 'Platform Provider Agreement', 'active',
     now() + interval '1 year', 'Legal review SLA: 5 business days.');

  perform public._pprov561_log(null, 'provider_registry_seeded', 'Verified provider network seeded for Phase 561', '{}'::jsonb);
end; $$;

-- ===========================================================================
-- Helpers — Customer
-- ===========================================================================

create or replace function public._cmes561_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cmes561_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'ecosystem'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_ecosystem_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'ecosystem'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cmes561_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_ecosystem_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cmes561_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._pprov561_seed();

  if exists (
    select 1 from public.organization_companion_ecosystem_service_requests
    where organization_id = p_org_id limit 1
  ) then
    return;
  end if;

  insert into public.organization_companion_ecosystem_service_requests (
    organization_id, request_key, service_title, provider_key, provider_name,
    request_status, domain_scope, summary
  ) values
    (p_org_id, 'req_accounting_q2', 'Accounting Assistance', 'prov_nordic_accounting', 'Nordic Accounting AS',
     'pending_approval', 'firma.no', 'Q2 accounting support — awaiting organizational approval.'),
    (p_org_id, 'req_security_audit', 'Security Audit', 'prov_secure_it', 'Secure IT Consulting',
     'in_progress', 'organization_wide', 'Annual security audit in progress.'),
    (p_org_id, 'req_marketing_launch', 'Marketing Campaign Setup', 'prov_nordic_marketing', 'Nordic Growth Marketing',
     'completed', 'butikk.no', 'Spring campaign completed successfully.');

  insert into public.organization_companion_ecosystem_approvals (
    organization_id, approval_key, request_key, approval_title, approval_status, summary
  ) values
    (p_org_id, 'appr_accounting_q2', 'req_accounting_q2', 'Accounting Request Approval', 'pending',
     'Review terms before provider contact is approved.');

  insert into public.organization_companion_ecosystem_ratings (
    organization_id, rating_key, provider_key, provider_name,
    service_quality_score, response_time_score, satisfaction_score, overall_rating, review_summary
  ) values
    (p_org_id, 'rate_marketing_spring', 'prov_nordic_marketing', 'Nordic Growth Marketing',
     5, 4, 5, 4.7, 'Excellent campaign setup — responsive and professional.');

  insert into public.organization_companion_ecosystem_contracts (
    organization_id, contract_key, provider_key, contract_title, contract_status, expires_at, sla_summary
  ) values
    (p_org_id, 'org_ctr_it_2026', 'prov_secure_it', 'IT Services Agreement', 'active',
     now() + interval '6 months', 'Security audit SLA: 10 business days.');

  insert into public.organization_companion_ecosystem_recommendations (
    organization_id, recommendation_key, recommendation_title, recommendation_type,
    provider_keys, reason_summary, confidence_level
  ) values
    (p_org_id, 'rec_norway_accountants', 'Top Providers in Norway', 'regional',
     '["prov_nordic_accounting"]'::jsonb, 'Highest-rated verified accounting firms in Norway.', 'high'),
    (p_org_id, 'rec_marketing_fast', 'Fastest Marketing Response', 'provider',
     '["prov_nordic_marketing"]'::jsonb, 'Providers with fastest response times for campaign setup.', 'high'),
    (p_org_id, 'rec_find_lawyer', 'Find a Lawyer', 'service',
     '["prov_bergen_legal"]'::jsonb, 'Companion matched verified legal providers for contract review.', 'high');

  insert into public.organization_companion_ecosystem_business_pack_links (
    organization_id, pack_key, pack_title, provider_category, recommended_provider_keys, summary
  ) values
    (p_org_id, 'pack_hosts', 'Hosts Pack', 'property_services', '["prov_property_nord"]'::jsonb,
     'Cleaning and property maintenance providers for Hosts Pack.'),
    (p_org_id, 'pack_finance', 'Finance Pack', 'accounting', '["prov_nordic_accounting"]'::jsonb,
     'Accounting providers for Finance Pack.'),
    (p_org_id, 'pack_support', 'Support Pack', 'consulting', '["prov_secure_it"]'::jsonb,
     'Customer service consultants for Support Pack.'),
    (p_org_id, 'pack_warehouse', 'Warehouse Pack', 'operational_services', '[]'::jsonb,
     'Logistics providers — browse marketplace for verified options.');
end; $$;

-- ===========================================================================
-- RPC — Platform Provider Registry
-- ===========================================================================

create or replace function public.get_platform_verified_provider_registry(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_overview jsonb;
  v_providers jsonb;
  v_services jsonb;
  v_verifications jsonb;
  v_contracts jsonb;
  v_performance jsonb;
  v_audit jsonb;
begin
  if not public.is_platform_admin() then
    return jsonb_build_object('found', false, 'error', 'Platform admin required');
  end if;

  perform public._pprov561_seed();

  select jsonb_build_object(
    'verified_providers', (select count(*) from public.platform_verified_providers where verification_status = 'verified'),
    'pending_providers', (select count(*) from public.platform_verified_providers where verification_status = 'pending'),
    'review_required', (select count(*) from public.platform_verified_providers where verification_status = 'review_required'),
    'suspended_providers', (select count(*) from public.platform_verified_providers where verification_status = 'suspended'),
    'total_services', (select count(*) from public.platform_verified_provider_services where is_active),
    'active_contracts', (select count(*) from public.platform_verified_provider_contracts where contract_status = 'active')
  ) into v_overview;

  select coalesce(jsonb_agg(jsonb_build_object(
    'provider_key', p.provider_key, 'company_name', p.company_name,
    'country', p.country, 'industry', p.industry, 'provider_category', p.provider_category,
    'verification_status', p.verification_status, 'overall_rating', p.overall_rating,
    'services_count', p.services_count, 'projects_completed', p.projects_completed,
    'response_time_hours', p.response_time_hours, 'performance_label', p.performance_label,
    'summary', p.summary
  ) order by p.company_name), '[]'::jsonb)
  into v_providers from public.platform_verified_providers p;

  select coalesce(jsonb_agg(jsonb_build_object(
    'provider_key', s.provider_key, 'service_key', s.service_key,
    'service_title', s.service_title, 'marketplace_category', s.marketplace_category,
    'domain_scope', s.domain_scope, 'summary', s.summary
  ) order by s.service_title), '[]'::jsonb)
  into v_services from public.platform_verified_provider_services s where s.is_active;

  select coalesce(jsonb_agg(jsonb_build_object(
    'provider_key', v.provider_key, 'verification_type', v.verification_type,
    'verification_status', v.verification_status, 'verified_at', v.verified_at, 'summary', v.summary
  ) order by v.provider_key, v.verification_type), '[]'::jsonb)
  into v_verifications from public.platform_verified_provider_verifications v;

  select coalesce(jsonb_agg(jsonb_build_object(
    'provider_key', c.provider_key, 'contract_key', c.contract_key,
    'contract_title', c.contract_title, 'contract_status', c.contract_status,
    'expires_at', c.expires_at, 'sla_summary', c.sla_summary
  ) order by c.contract_title), '[]'::jsonb)
  into v_contracts from public.platform_verified_provider_contracts c;

  select coalesce(jsonb_agg(jsonb_build_object(
    'provider_key', p.provider_key, 'company_name', p.company_name,
    'performance_label', p.performance_label, 'overall_rating', p.overall_rating,
    'projects_completed', p.projects_completed, 'response_time_hours', p.response_time_hours
  ) order by p.overall_rating desc), '[]'::jsonb)
  into v_performance from public.platform_verified_providers p;

  select coalesce((
    select jsonb_agg(jsonb_build_object(
      'provider_key', a.provider_key, 'event_type', a.event_type,
      'summary', a.summary, 'created_at', a.created_at
    ) order by a.created_at desc)
    from (
      select * from public.platform_verified_provider_audit_logs
      order by created_at desc limit 10
    ) a
  ), '[]'::jsonb) into v_audit;

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion coordinates trusted services — verified providers only receive trusted status.',
    'section', coalesce(p_section, 'overview'),
    'overview', v_overview,
    'providers', v_providers,
    'services', v_services,
    'verifications', v_verifications,
    'contracts', v_contracts,
    'performance', v_performance,
    'audit_recent', v_audit,
    'provider_categories', jsonb_build_array(
      'consulting', 'accounting', 'legal', 'marketing', 'it_services',
      'security', 'property_services', 'training', 'recruitment', 'custom'
    ),
    'verification_statuses', jsonb_build_object(
      'pending', 'Pending', 'verified', 'Verified',
      'review_required', 'Review Required', 'suspended', 'Suspended'
    ),
    'routes', jsonb_build_object(
      'ecosystem_center', '/app/companion/ecosystem',
      'service_marketplace', '/app/companion/services'
    ),
    'mobile_access', jsonb_build_object('enabled', true)
  );
end; $$;

create or replace function public.perform_platform_verified_provider_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_action text := coalesce(p_payload->>'action_type', p_payload->>'action', '');
  v_provider_key text := coalesce(p_payload->>'provider_key', '');
begin
  perform public._pprov561_require_platform_admin();

  if v_action = 'verify_provider' and v_provider_key <> '' then
    update public.platform_verified_providers
    set verification_status = 'verified', performance_label = 'healthy', updated_at = now()
    where provider_key = v_provider_key;
    perform public._pprov561_log(v_provider_key, 'provider_verified', 'Provider verified by platform admin', p_payload);
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'suspend_provider' and v_provider_key <> '' then
    update public.platform_verified_providers
    set verification_status = 'suspended', updated_at = now()
    where provider_key = v_provider_key;
    perform public._pprov561_log(v_provider_key, 'provider_suspended', 'Provider suspended by platform admin', p_payload);
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'refresh_performance' then
    perform public._pprov561_log(null, 'performance_refreshed', 'Provider performance metrics refreshed', p_payload);
    return jsonb_build_object('ok', true, 'action', v_action);
  end if;

  raise exception 'Unknown action: %', v_action;
end; $$;

create or replace function public.get_platform_verified_provider_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return (public.get_platform_verified_provider_registry('overview')->'overview')
    || jsonb_build_object('found', public.is_platform_admin());
end; $$;

-- ===========================================================================
-- RPC — Customer Companion Ecosystem Center
-- ===========================================================================

create or replace function public.get_organization_companion_ecosystem_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_org jsonb;
  v_overview jsonb;
  v_providers jsonb;
  v_services jsonb;
  v_marketplace jsonb;
  v_requests jsonb;
  v_approvals jsonb;
  v_ratings jsonb;
  v_reports jsonb;
  v_executive jsonb;
  v_integrations jsonb;
  v_audit jsonb;
begin
  v_org_id := public._cmes561_org();
  if v_org_id is null then
    return jsonb_build_object('found', false, 'error', 'Organization not found');
  end if;

  perform public._cmes561_ensure_settings(v_org_id);
  perform public._cmes561_seed(v_org_id);

  select jsonb_build_object('id', o.id, 'name', o.name)
  into v_org from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'verified_providers', (select count(*) from public.platform_verified_providers where verification_status = 'verified'),
    'marketplace_services', (select count(*) from public.platform_verified_provider_services where is_active),
    'active_requests', (select count(*) from public.organization_companion_ecosystem_service_requests where organization_id = v_org_id and request_status in ('pending_approval', 'approved', 'provider_responded', 'in_progress')),
    'pending_approvals', (select count(*) from public.organization_companion_ecosystem_approvals where organization_id = v_org_id and approval_status = 'pending'),
    'completed_requests', (select count(*) from public.organization_companion_ecosystem_service_requests where organization_id = v_org_id and request_status = 'completed'),
    'average_rating', coalesce((select round(avg(overall_rating)::numeric, 1) from public.organization_companion_ecosystem_ratings where organization_id = v_org_id), 4.5),
    'active_contracts', (select count(*) from public.organization_companion_ecosystem_contracts where organization_id = v_org_id and contract_status = 'active')
  ) into v_overview;

  select coalesce(jsonb_agg(jsonb_build_object(
    'provider_key', p.provider_key, 'company_name', p.company_name,
    'country', p.country, 'provider_category', p.provider_category,
    'verification_status', p.verification_status, 'overall_rating', p.overall_rating,
    'performance_label', p.performance_label, 'summary', p.summary
  ) order by p.overall_rating desc), '[]'::jsonb)
  into v_providers
  from public.platform_verified_providers p
  where p.verification_status in ('verified', 'review_required');

  select coalesce(jsonb_agg(jsonb_build_object(
    'service_key', s.service_key, 'service_title', s.service_title,
    'provider_key', s.provider_key, 'provider_name', p.company_name,
    'marketplace_category', s.marketplace_category, 'domain_scope', s.domain_scope,
    'verification_status', p.verification_status, 'overall_rating', p.overall_rating,
    'summary', s.summary
  ) order by s.service_title), '[]'::jsonb)
  into v_services
  from public.platform_verified_provider_services s
  join public.platform_verified_providers p on p.provider_key = s.provider_key
  where s.is_active and p.verification_status = 'verified';

  select jsonb_build_object(
    'categories', jsonb_build_array(
      'professional_services', 'operational_services', 'compliance_services',
      'technology_services', 'growth_services', 'training_services', 'property_services', 'custom'
    ),
    'domain_awareness', jsonb_build_array('firma.no', 'butikk.no', 'support.no', 'organization_wide'),
    'services', v_services,
    'service_advisor_prompts', jsonb_build_array(
      'Find accountant.', 'Recommend marketing partner.', 'Find security consultant.',
      'Find approved cleaning vendor.', 'Recommend training provider.'
    )
  ) into v_marketplace;

  select coalesce(jsonb_agg(jsonb_build_object(
    'request_key', r.request_key, 'service_title', r.service_title,
    'provider_key', r.provider_key, 'provider_name', r.provider_name,
    'request_status', r.request_status, 'domain_scope', r.domain_scope,
    'business_pack_key', r.business_pack_key, 'summary', r.summary, 'recorded_at', r.recorded_at
  ) order by r.recorded_at desc), '[]'::jsonb)
  into v_requests
  from public.organization_companion_ecosystem_service_requests r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'approval_key', a.approval_key, 'request_key', a.request_key,
    'approval_title', a.approval_title, 'approval_status', a.approval_status, 'summary', a.summary
  ) order by a.approval_title), '[]'::jsonb)
  into v_approvals
  from public.organization_companion_ecosystem_approvals a where a.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'rating_key', rt.rating_key, 'provider_key', rt.provider_key,
    'provider_name', rt.provider_name, 'overall_rating', rt.overall_rating,
    'service_quality_score', rt.service_quality_score, 'response_time_score', rt.response_time_score,
    'satisfaction_score', rt.satisfaction_score, 'review_summary', rt.review_summary
  ) order by rt.recorded_at desc), '[]'::jsonb)
  into v_ratings
  from public.organization_companion_ecosystem_ratings rt where rt.organization_id = v_org_id;

  select jsonb_build_object(
    'provider_performance', coalesce((
      select jsonb_agg(jsonb_build_object(
        'provider_key', p.provider_key, 'company_name', p.company_name,
        'performance_label', p.performance_label, 'overall_rating', p.overall_rating,
        'projects_completed', p.projects_completed
      ) order by p.overall_rating desc)
      from public.platform_verified_providers p where p.verification_status = 'verified'
    ), '[]'::jsonb),
    'service_usage', jsonb_build_object(
      'total_requests', (select count(*) from public.organization_companion_ecosystem_service_requests where organization_id = v_org_id),
      'completed', (select count(*) from public.organization_companion_ecosystem_service_requests where organization_id = v_org_id and request_status = 'completed')
    ),
    'customer_satisfaction', coalesce((select round(avg(overall_rating)::numeric, 1) from public.organization_companion_ecosystem_ratings where organization_id = v_org_id), 4.5),
    'marketplace_growth', jsonb_build_object('verified_providers', (select count(*) from public.platform_verified_providers where verification_status = 'verified')),
    'regional_activity', jsonb_build_object('norway_providers', (select count(*) from public.platform_verified_providers where country = 'Norway')),
    'companion_recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'recommendation_key', rec.recommendation_key, 'recommendation_title', rec.recommendation_title,
        'recommendation_type', rec.recommendation_type, 'provider_keys', rec.provider_keys,
        'reason_summary', rec.reason_summary, 'confidence_level', rec.confidence_level
      ) order by rec.recommendation_title)
      from public.organization_companion_ecosystem_recommendations rec where rec.organization_id = v_org_id
    ), '[]'::jsonb)
  ) into v_reports;

  select jsonb_build_object(
    'provider_activity', (select count(*) from public.organization_companion_ecosystem_service_requests where organization_id = v_org_id),
    'service_requests', (select count(*) from public.organization_companion_ecosystem_service_requests where organization_id = v_org_id),
    'provider_ratings', coalesce((select round(avg(overall_rating)::numeric, 1) from public.organization_companion_ecosystem_ratings where organization_id = v_org_id), 4.5),
    'marketplace_health', (select count(*) from public.platform_verified_providers where verification_status = 'verified'),
    'service_performance', (select count(*) from public.organization_companion_ecosystem_service_requests where organization_id = v_org_id and request_status = 'completed'),
    'companion_recommendations', (select count(*) from public.organization_companion_ecosystem_recommendations where organization_id = v_org_id)
  ) into v_executive;

  select jsonb_build_object(
    'growth_partner_integration', jsonb_build_object(
      'enabled', true,
      'note', 'Growth Partners may recommend services and refer providers — platform governance remains intact.',
      'route', '/app/growth-partner-operations'
    ),
    'business_pack_links', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_key', bp.pack_key, 'pack_title', bp.pack_title,
        'provider_category', bp.provider_category,
        'recommended_provider_keys', bp.recommended_provider_keys, 'summary', bp.summary
      ) order by bp.pack_title)
      from public.organization_companion_ecosystem_business_pack_links bp where bp.organization_id = v_org_id
    ), '[]'::jsonb),
    'service_workflow', jsonb_build_array(
      'Select Service', 'Select Provider', 'Review Terms', 'Approval',
      'Request Created', 'Provider Responds', 'Work Begins', 'Completion'
    ),
    'governance_integration', jsonb_build_object('phase', '560', 'route', '/app/companion/governance')
  ) into v_integrations;

  select coalesce((
    select jsonb_agg(jsonb_build_object(
      'event_type', al.event_type, 'audit_category', al.audit_category,
      'summary', al.summary, 'created_at', al.created_at
    ) order by al.created_at desc)
    from (
      select * from public.organization_companion_ecosystem_audit_logs
      where organization_id = v_org_id order by created_at desc limit 10
    ) al
  ), '[]'::jsonb) into v_audit;

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion should not do everything itself — Companion coordinates trusted services.',
    'philosophy', 'Companion becomes the bridge between organizations and approved providers. Humans decide.',
    'section', coalesce(p_section, 'overview'),
    'organization', v_org,
    'overview', v_overview,
    'providers', v_providers,
    'services', v_services,
    'marketplace', v_marketplace,
    'requests', v_requests,
    'approvals', v_approvals,
    'ratings', v_ratings,
    'reports', v_reports,
    'executive_dashboard', v_executive,
    'integrations', v_integrations,
    'audit_recent', v_audit,
    'routes', jsonb_build_object(
      'ecosystem', '/app/companion/ecosystem',
      'services', '/app/companion/services',
      'provider_registry', '/platform/providers',
      'governance', '/app/companion/governance'
    ),
    'notifications', jsonb_build_object(
      'provider_approved', true, 'provider_suspended', true,
      'service_request_created', true, 'service_completed', true,
      'review_requested', true, 'contract_expiring', true
    ),
    'mobile_access', jsonb_build_object(
      'browse_providers', true, 'request_services', true,
      'review_ratings', true, 'manage_requests', true, 'review_contracts', true
    )
  );
end; $$;

create or replace function public.perform_organization_companion_ecosystem_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_action text := coalesce(p_payload->>'action_type', p_payload->>'action', '');
  v_request_key text := coalesce(p_payload->>'request_key', '');
  v_approval_key text := coalesce(p_payload->>'approval_key', '');
begin
  v_org_id := public._cmes561_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;
  perform public._bde_require_admin();

  if v_action = 'approve_request' and v_approval_key <> '' then
    update public.organization_companion_ecosystem_approvals
    set approval_status = 'approved'
    where organization_id = v_org_id and approval_key = v_approval_key;
    update public.organization_companion_ecosystem_service_requests
    set request_status = 'approved'
    where organization_id = v_org_id
      and request_key = (select request_key from public.organization_companion_ecosystem_approvals where approval_key = v_approval_key and organization_id = v_org_id limit 1);
    perform public._cmes561_log(v_org_id, 'approval_granted', 'Service request approval granted', p_payload, 'approval');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'deny_request' and v_approval_key <> '' then
    update public.organization_companion_ecosystem_approvals
    set approval_status = 'denied'
    where organization_id = v_org_id and approval_key = v_approval_key;
    perform public._cmes561_log(v_org_id, 'approval_denied', 'Service request approval denied', p_payload, 'approval');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'create_service_request' then
    insert into public.organization_companion_ecosystem_service_requests (
      organization_id, request_key, service_title, provider_key, provider_name, request_status, summary
    ) values (
      v_org_id,
      'req_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
      coalesce(p_payload->>'service_title', 'New Service Request'),
      coalesce(p_payload->>'provider_key', 'prov_nordic_accounting'),
      coalesce(p_payload->>'provider_name', 'Verified Provider'),
      'pending_approval',
      coalesce(p_payload->>'summary', 'Service request created — awaiting approval.')
    );
    perform public._cmes561_log(v_org_id, 'service_requested', 'Service request created', p_payload, 'request');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'submit_review' then
    perform public._cmes561_log(v_org_id, 'review_submitted', 'Provider review submitted', p_payload, 'rating');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'refresh_marketplace_health' then
    perform public._cmes561_log(v_org_id, 'marketplace_health_refreshed', 'Marketplace health refreshed', p_payload, 'ecosystem');
    return jsonb_build_object('ok', true, 'action', v_action);
  end if;

  raise exception 'Unknown action: %', v_action;
end; $$;

create or replace function public.get_organization_companion_ecosystem_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmes561_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return (public.get_organization_companion_ecosystem_center('overview')->'overview')
    || jsonb_build_object('found', true, 'route', '/app/companion/ecosystem');
end; $$;

create or replace function public.get_assistant_companion_ecosystem_advisor_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmes561_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return jsonb_build_object(
    'found', true,
    'principle', 'Companion acts as service advisor — recommend verified providers; humans approve contact.',
    'advisor_prompts', jsonb_build_array(
      'Find accountant.', 'Recommend marketing partner.', 'Find security consultant.',
      'Find approved cleaning vendor.', 'Recommend training provider.'
    ),
    'verified_providers_count', (select count(*) from public.platform_verified_providers where verification_status = 'verified'),
    'pending_requests', (select count(*) from public.organization_companion_ecosystem_service_requests where organization_id = v_org_id and request_status = 'pending_approval'),
    'route', '/app/companion/ecosystem'
  );
end; $$;

grant execute on function public.get_platform_verified_provider_registry(text) to authenticated;
grant execute on function public.perform_platform_verified_provider_action(jsonb) to authenticated;
grant execute on function public.get_platform_verified_provider_mobile_summary() to authenticated;
grant execute on function public.get_organization_companion_ecosystem_center(text) to authenticated;
grant execute on function public.perform_organization_companion_ecosystem_action(jsonb) to authenticated;
grant execute on function public.get_organization_companion_ecosystem_mobile_summary() to authenticated;
grant execute on function public.get_assistant_companion_ecosystem_advisor_context() to authenticated;
