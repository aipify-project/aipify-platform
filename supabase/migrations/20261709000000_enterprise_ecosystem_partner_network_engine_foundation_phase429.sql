-- Phase 429 — Enterprise Ecosystem, Partner Network & Global Business Platform Engine Foundation
-- Feature owner: CUSTOMER APP. Route: /app/ecosystem. Helpers: _geepng429_*

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.enterprise_ecosystem_partner_network_engine_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  ecosystem_health_score integer not null default 82 check (ecosystem_health_score between 0 and 100),
  partner_growth_score integer not null default 76 check (partner_growth_score between 0 and 100),
  marketplace_activity_score integer not null default 74 check (marketplace_activity_score between 0 and 100),
  global_reach_score integer not null default 68 check (global_reach_score between 0 and 100),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enterprise_ecosystem_partner_network_engine_partners (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  partner_key text not null,
  company_name text not null,
  partner_type text not null check (
    partner_type in (
      'technology', 'integration', 'consulting', 'implementation',
      'strategic', 'regional', 'industry'
    )
  ),
  partnership_status text not null default 'active' check (
    partnership_status in ('pending', 'active', 'suspended', 'archived')
  ),
  regions text not null default '',
  industries text not null default '',
  certifications text not null default '',
  rating integer not null default 85 check (rating between 0 and 100),
  performance_score integer not null default 80 check (performance_score between 0 and 100),
  services_summary text not null default '',
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, partner_key)
);

create index if not exists enterprise_ecosystem_partner_network_engine_partners_tenant_idx
  on public.enterprise_ecosystem_partner_network_engine_partners (tenant_id, partner_type);

create table if not exists public.enterprise_ecosystem_partner_network_engine_growth_partners (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  growth_partner_key text not null,
  partner_name text not null,
  certification_level text not null default 'certified' check (
    certification_level in (
      'certified', 'advanced', 'professional', 'expert', 'enterprise', 'industry_specialist', 'master_partner'
    )
  ),
  status text not null default 'active' check (status in ('pending', 'active', 'review', 'suspended')),
  commission_rate_percent numeric(5,2) not null default 15.00,
  sales_activity_score integer not null default 78 check (sales_activity_score between 0 and 100),
  partner_health_score integer not null default 82 check (partner_health_score between 0 and 100),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, growth_partner_key)
);

create index if not exists enterprise_ecosystem_partner_network_engine_growth_partners_tenant_idx
  on public.enterprise_ecosystem_partner_network_engine_growth_partners (tenant_id, certification_level);

create table if not exists public.enterprise_ecosystem_partner_network_engine_service_providers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  provider_key text not null,
  provider_name text not null,
  provider_type text not null check (
    provider_type in (
      'consultant', 'agency', 'developer', 'designer', 'implementer', 'industry_specialist', 'support_provider'
    )
  ),
  regions text not null default '',
  availability text not null default 'available' check (availability in ('available', 'limited', 'unavailable')),
  rating integer not null default 84 check (rating between 0 and 100),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, provider_key)
);

create index if not exists enterprise_ecosystem_partner_network_engine_service_providers_tenant_idx
  on public.enterprise_ecosystem_partner_network_engine_service_providers (tenant_id, provider_type);

create table if not exists public.enterprise_ecosystem_partner_network_engine_industry_experts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  expert_key text not null,
  expert_name text not null,
  expertise text not null default '',
  industries text not null default '',
  certifications text not null default '',
  projects_count integer not null default 0,
  customer_rating integer not null default 88 check (customer_rating between 0 and 100),
  regions text not null default '',
  availability text not null default 'available' check (availability in ('available', 'limited', 'unavailable')),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, expert_key)
);

create index if not exists enterprise_ecosystem_partner_network_engine_industry_experts_tenant_idx
  on public.enterprise_ecosystem_partner_network_engine_industry_experts (tenant_id, industries);

create table if not exists public.enterprise_ecosystem_partner_network_engine_developer_assets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  asset_key text not null,
  asset_title text not null,
  asset_type text not null check (
    asset_type in (
      'extension', 'skill', 'app', 'api_integration', 'custom_module', 'partner_solution'
    )
  ),
  status text not null default 'published' check (status in ('draft', 'published', 'deprecated')),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, asset_key)
);

create index if not exists enterprise_ecosystem_partner_network_engine_developer_assets_tenant_idx
  on public.enterprise_ecosystem_partner_network_engine_developer_assets (tenant_id, asset_type);

create table if not exists public.enterprise_ecosystem_partner_network_engine_marketplace_listings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  listing_key text not null,
  listing_title text not null,
  listing_type text not null check (
    listing_type in (
      'business_pack', 'industry_pack', 'integration', 'skill', 'template', 'workflow', 'partner_service'
    )
  ),
  status text not null default 'active' check (status in ('draft', 'active', 'paused', 'archived')),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, listing_key)
);

create index if not exists enterprise_ecosystem_partner_network_engine_marketplace_listings_tenant_idx
  on public.enterprise_ecosystem_partner_network_engine_marketplace_listings (tenant_id, listing_type);

create table if not exists public.enterprise_ecosystem_partner_network_engine_partner_success (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  success_key text not null,
  partner_name text not null,
  revenue_index integer not null default 75 check (revenue_index between 0 and 100),
  satisfaction_score integer not null default 86 check (satisfaction_score between 0 and 100),
  implementation_success integer not null default 82 check (implementation_success between 0 and 100),
  retention_score integer not null default 80 check (retention_score between 0 and 100),
  growth_score integer not null default 77 check (growth_score between 0 and 100),
  partner_health integer not null default 83 check (partner_health between 0 and 100),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, success_key)
);

create index if not exists enterprise_ecosystem_partner_network_engine_partner_success_tenant_idx
  on public.enterprise_ecosystem_partner_network_engine_partner_success (tenant_id, partner_health desc);

create table if not exists public.enterprise_ecosystem_partner_network_engine_intelligence_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'partner_opportunity', 'regional_expansion', 'certification_achieved',
      'partner_support_needed', 'ecosystem_opportunity'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists enterprise_ecosystem_partner_network_engine_intelligence_tenant_idx
  on public.enterprise_ecosystem_partner_network_engine_intelligence_signals (tenant_id, created_at desc);

create table if not exists public.enterprise_ecosystem_partner_network_engine_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'partner_opportunity', 'regional_expansion', 'certification_due',
      'partner_excellence', 'ecosystem_opportunity'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists enterprise_ecosystem_partner_network_engine_advisor_tenant_idx
  on public.enterprise_ecosystem_partner_network_engine_advisor_signals (tenant_id, created_at desc);

create table if not exists public.enterprise_ecosystem_partner_network_engine_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'partner_created', 'certification_granted', 'certification_revoked',
      'partner_approved', 'partner_suspended', 'marketplace_listing_created',
      'commission_paid', 'partner_status_changed', 'dashboard_viewed', 'analytics_refreshed'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists enterprise_ecosystem_partner_network_engine_audit_logs_tenant_idx
  on public.enterprise_ecosystem_partner_network_engine_audit_logs (tenant_id, created_at desc);

alter table public.enterprise_ecosystem_partner_network_engine_settings enable row level security;
alter table public.enterprise_ecosystem_partner_network_engine_partners enable row level security;
alter table public.enterprise_ecosystem_partner_network_engine_growth_partners enable row level security;
alter table public.enterprise_ecosystem_partner_network_engine_service_providers enable row level security;
alter table public.enterprise_ecosystem_partner_network_engine_industry_experts enable row level security;
alter table public.enterprise_ecosystem_partner_network_engine_developer_assets enable row level security;
alter table public.enterprise_ecosystem_partner_network_engine_marketplace_listings enable row level security;
alter table public.enterprise_ecosystem_partner_network_engine_partner_success enable row level security;
alter table public.enterprise_ecosystem_partner_network_engine_intelligence_signals enable row level security;
alter table public.enterprise_ecosystem_partner_network_engine_advisor_signals enable row level security;
alter table public.enterprise_ecosystem_partner_network_engine_audit_logs enable row level security;

revoke all on public.enterprise_ecosystem_partner_network_engine_settings from authenticated, anon;
revoke all on public.enterprise_ecosystem_partner_network_engine_partners from authenticated, anon;
revoke all on public.enterprise_ecosystem_partner_network_engine_growth_partners from authenticated, anon;
revoke all on public.enterprise_ecosystem_partner_network_engine_service_providers from authenticated, anon;
revoke all on public.enterprise_ecosystem_partner_network_engine_industry_experts from authenticated, anon;
revoke all on public.enterprise_ecosystem_partner_network_engine_developer_assets from authenticated, anon;
revoke all on public.enterprise_ecosystem_partner_network_engine_marketplace_listings from authenticated, anon;
revoke all on public.enterprise_ecosystem_partner_network_engine_partner_success from authenticated, anon;
revoke all on public.enterprise_ecosystem_partner_network_engine_intelligence_signals from authenticated, anon;
revoke all on public.enterprise_ecosystem_partner_network_engine_advisor_signals from authenticated, anon;
revoke all on public.enterprise_ecosystem_partner_network_engine_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'enterprise_ecosystem_partner_network_engine', v.description
from (values
  ('enterprise_ecosystem_partner_network.view', 'View Ecosystem Center', 'View partner network, Growth Partners, marketplace, and ecosystem analytics'),
  ('enterprise_ecosystem_partner_network.manage', 'Manage Ecosystem Center', 'Approve partners, grant certifications, manage marketplace listings and payouts')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 2. Helpers — _geepng429_*
-- ---------------------------------------------------------------------------
create or replace function public._geepng429_require_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_tenant_id uuid; v_plan text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  v_plan := public._aef_tenant_plan(v_tenant_id);
  if v_plan not in ('business', 'enterprise', 'growth', 'professional', 'starter') then
    raise exception 'Ecosystem Center requires an active plan';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end; $$;

create or replace function public._geepng429_log_audit(p_tenant_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.enterprise_ecosystem_partner_network_engine_audit_logs (tenant_id, event_type, summary, actor_user_id, context)
  values (p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._geepng429_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.enterprise_ecosystem_partner_network_engine_settings language plpgsql security definer set search_path = public as $$
declare v_row public.enterprise_ecosystem_partner_network_engine_settings;
begin
  insert into public.enterprise_ecosystem_partner_network_engine_settings (organization_id, tenant_id)
  values (p_org_id, p_tenant_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;
  if v_row.id is null then
    select * into v_row from public.enterprise_ecosystem_partner_network_engine_settings where organization_id = p_org_id;
  end if;
  return v_row;
end; $$;

create or replace function public._geepng429_seed_defaults(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.enterprise_ecosystem_partner_network_engine_partners where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_ecosystem_partner_network_engine_partners (tenant_id, partner_key, company_name, partner_type, partnership_status, regions, industries, certifications, rating, performance_score, services_summary, summary) values
      (p_tenant_id, 'PTR-001', 'Nordic Integration Partners AS', 'integration', 'active', 'NO, SE, DK', 'Hospitality, Retail', 'Certified, Professional', 88, 85, 'Install and integration services', 'Strong regional integration partner.'),
      (p_tenant_id, 'PTR-002', 'Enterprise Consulting Group', 'consulting', 'active', 'EU, UK', 'Enterprise, Professional Services', 'Expert, Enterprise', 90, 88, 'Implementation and advisory', 'Strategic consulting partner.'),
      (p_tenant_id, 'PTR-003', 'Global Tech Alliance', 'technology', 'active', 'Global', 'Multi-industry', 'Master Partner', 92, 90, 'Platform technology alignment', 'Technology strategic partner.');
  end if;
  if not exists (select 1 from public.enterprise_ecosystem_partner_network_engine_growth_partners where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_ecosystem_partner_network_engine_growth_partners (tenant_id, growth_partner_key, partner_name, certification_level, status, commission_rate_percent, sales_activity_score, partner_health_score, summary) values
      (p_tenant_id, 'GP-001', 'Baltic Growth Partners', 'professional', 'active', 18.00, 82, 86, 'Active Growth Partner with strong pipeline.'),
      (p_tenant_id, 'GP-002', 'DACH Enterprise Alliance', 'expert', 'active', 20.00, 88, 90, 'Expert-tier partner with enterprise focus.');
  end if;
  if not exists (select 1 from public.enterprise_ecosystem_partner_network_engine_service_providers where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_ecosystem_partner_network_engine_service_providers (tenant_id, provider_key, provider_name, provider_type, regions, availability, rating, summary) values
      (p_tenant_id, 'SP-001', 'Oslo Digital Agency', 'agency', 'NO', 'available', 87, 'Design and implementation agency.'),
      (p_tenant_id, 'SP-002', 'Cloud Implementers Ltd', 'implementer', 'EU', 'limited', 85, 'Enterprise deployment specialists.');
  end if;
  if not exists (select 1 from public.enterprise_ecosystem_partner_network_engine_industry_experts where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_ecosystem_partner_network_engine_industry_experts (tenant_id, expert_key, expert_name, expertise, industries, certifications, projects_count, customer_rating, regions, summary) values
      (p_tenant_id, 'EXP-001', 'Dr. Anna Berg', 'Hospitality operations', 'Hospitality, Tourism', 'Industry Specialist', 24, 91, 'Nordics', 'Hospitality industry expert.'),
      (p_tenant_id, 'EXP-002', 'Marcus Chen', 'Healthcare compliance', 'Healthcare', 'Expert', 18, 89, 'EU', 'Healthcare regulatory specialist.');
  end if;
  if not exists (select 1 from public.enterprise_ecosystem_partner_network_engine_developer_assets where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_ecosystem_partner_network_engine_developer_assets (tenant_id, asset_key, asset_title, asset_type, status, summary) values
      (p_tenant_id, 'DEV-001', 'Shopify Order Sync Skill', 'skill', 'published', 'Commerce integration skill for Shopify.'),
      (p_tenant_id, 'DEV-002', 'Executive Briefing Extension', 'extension', 'published', 'Enhanced executive briefing module.');
  end if;
  if not exists (select 1 from public.enterprise_ecosystem_partner_network_engine_marketplace_listings where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_ecosystem_partner_network_engine_marketplace_listings (tenant_id, listing_key, listing_title, listing_type, status, summary) values
      (p_tenant_id, 'MKT-001', 'Aipify Hosts Business Pack', 'business_pack', 'active', 'Hospitality operations pack.'),
      (p_tenant_id, 'MKT-002', 'Healthcare Industry Pack', 'industry_pack', 'active', 'Healthcare vertical pack.'),
      (p_tenant_id, 'MKT-003', 'Partner Onboarding Workflow', 'workflow', 'active', 'Certified partner onboarding template.');
  end if;
  if not exists (select 1 from public.enterprise_ecosystem_partner_network_engine_partner_success where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_ecosystem_partner_network_engine_partner_success (tenant_id, success_key, partner_name, revenue_index, satisfaction_score, implementation_success, retention_score, growth_score, partner_health, summary) values
      (p_tenant_id, 'PS-001', 'Nordic Integration Partners AS', 82, 88, 86, 84, 80, 87, 'Strong partner success metrics.'),
      (p_tenant_id, 'PS-002', 'Baltic Growth Partners', 78, 90, 88, 86, 85, 89, 'Growth Partner exceeding targets.');
  end if;
end; $$;

create or replace function public._geepng429_seed_advisor(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.enterprise_ecosystem_partner_network_engine_advisor_signals where tenant_id = p_tenant_id and created_at > now() - interval '7 days' limit 1) then return; end if;
  insert into public.enterprise_ecosystem_partner_network_engine_advisor_signals (tenant_id, signal_type, observation, impact, recommendation, effort, confidence) values
    (p_tenant_id, 'partner_opportunity', 'A new partner opportunity exists.', 'DACH region shows partner demand gap.', 'Review partner recruitment for DACH.', 'moderate', 'high'),
    (p_tenant_id, 'regional_expansion', 'Regional coverage can be expanded.', 'Nordic partner network strong; Baltic underserved.', 'Initiate Baltic partner outreach.', 'moderate', 'high'),
    (p_tenant_id, 'certification_due', 'A certification should be completed.', 'Two Growth Partners due for recertification.', 'Schedule certification review.', 'low', 'high'),
    (p_tenant_id, 'partner_excellence', 'A partner is performing exceptionally well.', 'Baltic Growth Partners health score 89.', 'Highlight in executive ecosystem briefing.', 'low', 'high'),
    (p_tenant_id, 'ecosystem_opportunity', 'A new ecosystem opportunity emerged.', 'Healthcare pack partner demand increasing.', 'Align marketplace listing with partner network.', 'moderate', 'moderate');
end; $$;

create or replace function public._geepng429_seed_intelligence(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.enterprise_ecosystem_partner_network_engine_intelligence_signals where tenant_id = p_tenant_id and created_at > now() - interval '7 days' limit 1) then return; end if;
  insert into public.enterprise_ecosystem_partner_network_engine_intelligence_signals (tenant_id, signal_type, observation, impact, recommendation, confidence) values
    (p_tenant_id, 'partner_opportunity', 'A new partner opportunity was identified.', 'Integration partner gap in Baltic region.', 'Expand partner recruitment.', 'high'),
    (p_tenant_id, 'regional_expansion', 'Regional coverage should be expanded.', 'Global reach score below target.', 'Prioritize regional partner onboarding.', 'moderate'),
    (p_tenant_id, 'certification_achieved', 'A service provider achieved certification.', 'Oslo Digital Agency reached Professional tier.', 'Update partner directory.', 'high'),
    (p_tenant_id, 'partner_support_needed', 'A partner requires support.', 'Cloud Implementers capacity limited.', 'Assign partner success review.', 'moderate'),
    (p_tenant_id, 'ecosystem_opportunity', 'A new ecosystem opportunity emerged.', 'Healthcare vertical pack demand rising.', 'Connect experts with Growth Partners.', 'high');
end; $$;

create or replace function public._geepng429_overview_block(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_settings public.enterprise_ecosystem_partner_network_engine_settings;
begin
  select * into v_settings from public.enterprise_ecosystem_partner_network_engine_settings where tenant_id = p_tenant_id;
  return jsonb_build_object(
    'organizations_count', 1,
    'partners_count', (select count(*)::integer from public.enterprise_ecosystem_partner_network_engine_partners where tenant_id = p_tenant_id),
    'growth_partners_count', (select count(*)::integer from public.enterprise_ecosystem_partner_network_engine_growth_partners where tenant_id = p_tenant_id),
    'developers_count', (select count(*)::integer from public.enterprise_ecosystem_partner_network_engine_developer_assets where tenant_id = p_tenant_id),
    'industry_experts_count', (select count(*)::integer from public.enterprise_ecosystem_partner_network_engine_industry_experts where tenant_id = p_tenant_id),
    'service_providers_count', (select count(*)::integer from public.enterprise_ecosystem_partner_network_engine_service_providers where tenant_id = p_tenant_id),
    'marketplace_listings_count', (select count(*)::integer from public.enterprise_ecosystem_partner_network_engine_marketplace_listings where tenant_id = p_tenant_id),
    'ecosystem_health_score', coalesce(v_settings.ecosystem_health_score, 82),
    'partner_growth_score', coalesce(v_settings.partner_growth_score, 76),
    'marketplace_activity_score', coalesce(v_settings.marketplace_activity_score, 74),
    'global_reach_score', coalesce(v_settings.global_reach_score, 68)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_enterprise_ecosystem_partner_network_center()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_tenant_id uuid;
  v_settings public.enterprise_ecosystem_partner_network_engine_settings; v_overview jsonb;
begin
  perform public._irp_require_permission('enterprise_ecosystem_partner_network.view');
  v_ctx := public._geepng429_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._geepng429_ensure_settings(v_org_id, v_tenant_id);
  perform public._geepng429_seed_defaults(v_tenant_id);
  perform public._geepng429_seed_advisor(v_tenant_id);
  perform public._geepng429_seed_intelligence(v_tenant_id);
  v_overview := public._geepng429_overview_block(v_tenant_id);
  perform public._geepng429_log_audit(v_tenant_id, 'dashboard_viewed', 'Ecosystem center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'found', true, 'has_access', true,
    'philosophy', 'A platform creates value. An ecosystem multiplies value.',
    'mission', 'Enterprise Ecosystem & Partner Network Engine — global partner network, Growth Partners, developers, experts, and marketplace collaboration.',
    'abos_principle', 'The future of Aipify is bigger than software — a global ecosystem of organizations, partners, experts, and digital workers building value together.',
    'growth_partner_portal_route', '/app/growth-partner/resource-center',
    'ecosystem_governance_route', '/app/ecosystem-governance',
    'ecosystem_intelligence_route', '/app/ecosystem-intelligence',
    'marketplace_route', '/app/marketplace-governance',
    'distinction_note', 'Ecosystem metadata and partner signals — tenant-scoped visibility with governed marketplace permissions.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/ecosystem'),
      jsonb_build_object('key', 'partners', 'route', '/app/ecosystem#partners'),
      jsonb_build_object('key', 'growth_partners', 'route', '/app/ecosystem#growth-partners'),
      jsonb_build_object('key', 'service_providers', 'route', '/app/ecosystem#service-providers'),
      jsonb_build_object('key', 'developers', 'route', '/app/ecosystem#developers'),
      jsonb_build_object('key', 'marketplace', 'route', '/app/ecosystem#marketplace'),
      jsonb_build_object('key', 'analytics', 'route', '/app/ecosystem#analytics'),
      jsonb_build_object('key', 'governance', 'route', '/app/ecosystem#governance')
    ),
    'core_languages', jsonb_build_array('en', 'no', 'sv', 'da', 'pl', 'uk'),
    'partners', coalesce((select jsonb_agg(jsonb_build_object('id',p.id,'partner_key',p.partner_key,'company_name',p.company_name,'partner_type',p.partner_type,'partnership_status',p.partnership_status,'regions',p.regions,'industries',p.industries,'certifications',p.certifications,'rating',p.rating,'performance_score',p.performance_score,'services_summary',p.services_summary,'summary',p.summary) order by p.performance_score desc) from public.enterprise_ecosystem_partner_network_engine_partners p where p.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'growth_partners', coalesce((select jsonb_agg(jsonb_build_object('id',g.id,'growth_partner_key',g.growth_partner_key,'partner_name',g.partner_name,'certification_level',g.certification_level,'status',g.status,'commission_rate_percent',g.commission_rate_percent,'sales_activity_score',g.sales_activity_score,'partner_health_score',g.partner_health_score,'summary',g.summary) order by g.partner_health_score desc) from public.enterprise_ecosystem_partner_network_engine_growth_partners g where g.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'service_providers', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'provider_key',s.provider_key,'provider_name',s.provider_name,'provider_type',s.provider_type,'regions',s.regions,'availability',s.availability,'rating',s.rating,'summary',s.summary) order by s.rating desc) from public.enterprise_ecosystem_partner_network_engine_service_providers s where s.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'industry_experts', coalesce((select jsonb_agg(jsonb_build_object('id',e.id,'expert_key',e.expert_key,'expert_name',e.expert_name,'expertise',e.expertise,'industries',e.industries,'certifications',e.certifications,'projects_count',e.projects_count,'customer_rating',e.customer_rating,'regions',e.regions,'availability',e.availability,'summary',e.summary) order by e.customer_rating desc) from public.enterprise_ecosystem_partner_network_engine_industry_experts e where e.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'developer_assets', coalesce((select jsonb_agg(jsonb_build_object('id',d.id,'asset_key',d.asset_key,'asset_title',d.asset_title,'asset_type',d.asset_type,'status',d.status,'summary',d.summary) order by d.updated_at desc) from public.enterprise_ecosystem_partner_network_engine_developer_assets d where d.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'marketplace_listings', coalesce((select jsonb_agg(jsonb_build_object('id',m.id,'listing_key',m.listing_key,'listing_title',m.listing_title,'listing_type',m.listing_type,'status',m.status,'summary',m.summary) order by m.updated_at desc) from public.enterprise_ecosystem_partner_network_engine_marketplace_listings m where m.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'partner_success', coalesce((select jsonb_agg(jsonb_build_object('id',ps.id,'success_key',ps.success_key,'partner_name',ps.partner_name,'revenue_index',ps.revenue_index,'satisfaction_score',ps.satisfaction_score,'implementation_success',ps.implementation_success,'retention_score',ps.retention_score,'growth_score',ps.growth_score,'partner_health',ps.partner_health,'summary',ps.summary) order by ps.partner_health desc) from public.enterprise_ecosystem_partner_network_engine_partner_success ps where ps.tenant_id = v_tenant_id limit 10), '[]'::jsonb),
    'intelligence_signals', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'signal_type',s.signal_type,'observation',s.observation,'impact',s.impact,'recommendation',s.recommendation,'confidence',s.confidence,'created_at',s.created_at) order by s.created_at desc) from public.enterprise_ecosystem_partner_network_engine_intelligence_signals s where s.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'advisor_signals', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'signal_type',s.signal_type,'observation',s.observation,'impact',s.impact,'recommendation',s.recommendation,'effort',s.effort,'confidence',s.confidence,'created_at',s.created_at) order by s.created_at desc) from public.enterprise_ecosystem_partner_network_engine_advisor_signals s where s.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'audit_logs', coalesce((select jsonb_agg(jsonb_build_object('id',l.id,'event_type',l.event_type,'summary',l.summary,'created_at',l.created_at) order by l.created_at desc) from public.enterprise_ecosystem_partner_network_engine_audit_logs l where l.tenant_id = v_tenant_id limit 20), '[]'::jsonb),
    'executive_dashboard', jsonb_build_object(
      'partner_network', v_overview->>'partners_count',
      'global_reach', v_overview->>'global_reach_score',
      'partner_revenue_index', 82,
      'marketplace_activity', v_overview->>'marketplace_listings_count',
      'partner_health', v_overview->>'ecosystem_health_score',
      'expansion_opportunities', 4,
      'strategic_partnerships', v_overview->>'partners_count'
    ),
    'governance', jsonb_build_object(
      'partner_verification', true,
      'certification_governance', true,
      'payout_governance', true,
      'marketplace_governance', true,
      'audit_trail', true,
      'tenant_isolation', true
    ),
    'privacy_note', 'Organizations remain isolated — partner visibility governed; marketplace permissions controlled per tenant.'
  );
exception when others then
  return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Action RPC
-- ---------------------------------------------------------------------------
create or replace function public.enterprise_ecosystem_partner_network_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_tenant_id uuid; v_action text; v_id uuid;
begin
  perform public._irp_require_permission('enterprise_ecosystem_partner_network.manage');
  v_ctx := public._geepng429_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  perform public._geepng429_ensure_settings(v_org_id, v_tenant_id);
  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'create_partner' then
    insert into public.enterprise_ecosystem_partner_network_engine_partners (tenant_id, partner_key, company_name, partner_type, partnership_status, regions, summary)
    values (v_tenant_id, coalesce(p_payload->>'partner_key','PTR-'||upper(substr(gen_random_uuid()::text,1,8))), coalesce(p_payload->>'company_name','Partner organization'), coalesce(p_payload->>'partner_type','technology'), 'pending', coalesce(p_payload->>'regions',''), coalesce(p_payload->>'summary',''))
    returning id into v_id;
    perform public._geepng429_log_audit(v_tenant_id, 'partner_created', 'Partner created', jsonb_build_object('partner_id', v_id));
    return jsonb_build_object('ok', true, 'partner_id', v_id);
  end if;

  if v_action = 'approve_partner' then
    update public.enterprise_ecosystem_partner_network_engine_partners set partnership_status = 'active', updated_at = now()
    where tenant_id = v_tenant_id and partner_key = coalesce(p_payload->>'partner_key', 'PTR-001') returning id into v_id;
    update public.enterprise_ecosystem_partner_network_engine_settings set partner_growth_score = least(100, partner_growth_score + 1), ecosystem_health_score = least(100, ecosystem_health_score + 1), updated_at = now() where tenant_id = v_tenant_id;
    perform public._geepng429_log_audit(v_tenant_id, 'partner_approved', 'Partner approved', jsonb_build_object('partner_id', v_id));
    return jsonb_build_object('ok', true, 'partner_id', v_id);
  end if;

  if v_action = 'grant_certification' then
    update public.enterprise_ecosystem_partner_network_engine_growth_partners set
      certification_level = coalesce(p_payload->>'certification_level', 'professional'),
      updated_at = now()
    where tenant_id = v_tenant_id and growth_partner_key = coalesce(p_payload->>'growth_partner_key', 'GP-001') returning id into v_id;
    perform public._geepng429_log_audit(v_tenant_id, 'certification_granted', 'Certification granted', jsonb_build_object('growth_partner_id', v_id));
    return jsonb_build_object('ok', true, 'growth_partner_id', v_id);
  end if;

  if v_action = 'revoke_certification' then
    update public.enterprise_ecosystem_partner_network_engine_growth_partners set certification_level = 'certified', updated_at = now()
    where tenant_id = v_tenant_id and growth_partner_key = coalesce(p_payload->>'growth_partner_key', '') returning id into v_id;
    perform public._geepng429_log_audit(v_tenant_id, 'certification_revoked', 'Certification revoked', jsonb_build_object('growth_partner_id', v_id));
    return jsonb_build_object('ok', true, 'growth_partner_id', v_id);
  end if;

  if v_action = 'suspend_partner' then
    update public.enterprise_ecosystem_partner_network_engine_partners set partnership_status = 'suspended', updated_at = now()
    where tenant_id = v_tenant_id and partner_key = coalesce(p_payload->>'partner_key', '') returning id into v_id;
    perform public._geepng429_log_audit(v_tenant_id, 'partner_suspended', 'Partner suspended', jsonb_build_object('partner_id', v_id));
    return jsonb_build_object('ok', true, 'partner_id', v_id);
  end if;

  if v_action = 'create_marketplace_listing' then
    insert into public.enterprise_ecosystem_partner_network_engine_marketplace_listings (tenant_id, listing_key, listing_title, listing_type, status, summary)
    values (v_tenant_id, coalesce(p_payload->>'listing_key','MKT-'||upper(substr(gen_random_uuid()::text,1,8))), coalesce(p_payload->>'listing_title','Marketplace listing'), coalesce(p_payload->>'listing_type','partner_service'), 'active', coalesce(p_payload->>'summary',''))
    returning id into v_id;
    update public.enterprise_ecosystem_partner_network_engine_settings set marketplace_activity_score = least(100, marketplace_activity_score + 1), updated_at = now() where tenant_id = v_tenant_id;
    perform public._geepng429_log_audit(v_tenant_id, 'marketplace_listing_created', 'Marketplace listing created', jsonb_build_object('listing_id', v_id));
    return jsonb_build_object('ok', true, 'listing_id', v_id);
  end if;

  if v_action = 'record_commission_paid' then
    perform public._geepng429_log_audit(v_tenant_id, 'commission_paid', 'Commission paid', jsonb_build_object('growth_partner_key', p_payload->>'growth_partner_key', 'amount', p_payload->>'amount'));
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'change_partner_status' then
    update public.enterprise_ecosystem_partner_network_engine_partners set
      partnership_status = coalesce(p_payload->>'partnership_status', partnership_status),
      updated_at = now()
    where tenant_id = v_tenant_id and partner_key = coalesce(p_payload->>'partner_key', '') returning id into v_id;
    perform public._geepng429_log_audit(v_tenant_id, 'partner_status_changed', 'Partner status changed', jsonb_build_object('partner_id', v_id));
    return jsonb_build_object('ok', true, 'partner_id', v_id);
  end if;

  if v_action = 'refresh_analytics' then
    update public.enterprise_ecosystem_partner_network_engine_settings set
      ecosystem_health_score = least(100, ecosystem_health_score + 1),
      partner_growth_score = least(100, partner_growth_score + 1),
      global_reach_score = least(100, global_reach_score + 1),
      updated_at = now()
    where tenant_id = v_tenant_id;
    perform public._geepng429_log_audit(v_tenant_id, 'analytics_refreshed', 'Ecosystem analytics refreshed', '{}'::jsonb);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Unknown action: %', v_action;
end; $$;
