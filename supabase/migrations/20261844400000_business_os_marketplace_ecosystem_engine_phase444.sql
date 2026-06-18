-- Phase 444 — Business Operating System Marketplace & Ecosystem Engine (Customer App)
-- Route: /app/ecosystem

create table if not exists public.business_os_ecosystem_marketplace_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  marketplace_enabled boolean not null default true,
  review_required boolean not null default true,
  revenue_sharing_enabled boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.business_os_ecosystem_marketplace_section_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  section_key text not null check (section_key in (
    'marketplace', 'business_packs', 'skills', 'integrations',
    'growth_partners', 'solution_providers', 'certifications', 'revenue_sharing'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  metric_label text not null default '',
  metric_value text not null default '',
  status_key text not null default 'information' check (status_key in (
    'completed', 'requires_attention', 'waiting', 'information', 'restricted', 'verified', 'not_allowed'
  )),
  updated_at timestamptz not null default now()
);

create index if not exists business_os_ecosystem_marketplace_sections_org_idx
  on public.business_os_ecosystem_marketplace_section_items (organization_id, section_key);

create table if not exists public.business_os_ecosystem_marketplace_listings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  listing_name text not null,
  listing_category text not null check (listing_category in (
    'hosts', 'commerce', 'healthcare', 'legal', 'accounting',
    'property_management', 'construction', 'hospitality', 'general'
  )),
  vendor_name text not null default '',
  rating_label text not null default '',
  downloads_label text not null default '',
  version_label text not null default '',
  price_label text not null default '',
  listing_type text not null default 'business_pack' check (listing_type in (
    'business_pack', 'skill', 'template', 'workflow', 'knowledge_pack', 'industry_pack', 'automation_pack'
  )),
  status_key text not null default 'verified',
  updated_at timestamptz not null default now()
);

create index if not exists business_os_ecosystem_marketplace_listings_org_idx
  on public.business_os_ecosystem_marketplace_listings (organization_id, listing_category, listing_type);

create table if not exists public.business_os_ecosystem_marketplace_integrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  integration_name text not null,
  integration_type text not null check (integration_type in (
    'crm', 'accounting', 'support', 'commerce', 'communication', 'industry_specific'
  )),
  provider_name text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  status_key text not null default 'verified',
  updated_at timestamptz not null default now()
);

create index if not exists business_os_ecosystem_marketplace_integrations_org_idx
  on public.business_os_ecosystem_marketplace_integrations (organization_id, integration_type);

create table if not exists public.business_os_ecosystem_marketplace_providers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  provider_name text not null,
  provider_type text not null check (provider_type in (
    'consultant', 'agency', 'developer', 'implementation_partner'
  )),
  certification_label text not null default '',
  rating_label text not null default '',
  regions_label text not null default '',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now()
);

create index if not exists business_os_ecosystem_marketplace_providers_org_idx
  on public.business_os_ecosystem_marketplace_providers (organization_id, provider_type);

create table if not exists public.business_os_ecosystem_marketplace_certifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  certification_key text not null,
  certification_name text not null,
  certification_type text not null check (certification_type in (
    'growth_partner', 'implementation_specialist', 'business_pack_developer',
    'solution_architect', 'support_specialist'
  )),
  holder_count integer not null default 0,
  status_key text not null default 'verified',
  updated_at timestamptz not null default now(),
  unique (organization_id, certification_key)
);

create table if not exists public.business_os_ecosystem_marketplace_revenue (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  revenue_type text not null check (revenue_type in (
    'marketplace', 'partner', 'developer', 'referral', 'enterprise'
  )),
  revenue_label text not null default '',
  amount_label text not null default '',
  period_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now()
);

create index if not exists business_os_ecosystem_marketplace_revenue_org_idx
  on public.business_os_ecosystem_marketplace_revenue (organization_id, revenue_type);

create table if not exists public.business_os_ecosystem_marketplace_growth_partners (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  partner_name text not null,
  partner_tier text not null default 'certified' check (partner_tier in (
    'certified', 'advanced', 'professional', 'expert', 'enterprise', 'master_partner'
  )),
  leads_label text not null default '',
  revenue_label text not null default '',
  commission_label text not null default '',
  certifications_label text not null default '',
  performance_label text not null default '',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now()
);

create index if not exists business_os_ecosystem_marketplace_growth_partners_org_idx
  on public.business_os_ecosystem_marketplace_growth_partners (organization_id, partner_tier);

create table if not exists public.business_os_ecosystem_marketplace_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null check (metric_key in (
    'installs', 'revenue', 'retention', 'usage', 'ratings', 'support_requests'
  )),
  metric_value text not null default '',
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, metric_key)
);

create table if not exists public.business_os_ecosystem_marketplace_companion (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  recommendation_type text not null check (recommendation_type in (
    'business_pack', 'integration', 'partner', 'consultant', 'skill', 'template'
  )),
  recommendation text not null,
  reason text not null default '' check (char_length(reason) <= 500),
  status text not null default 'open' check (status in ('open', 'acknowledged', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists business_os_ecosystem_marketplace_companion_org_idx
  on public.business_os_ecosystem_marketplace_companion (organization_id, status);

create table if not exists public.business_os_ecosystem_marketplace_audit (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  item_type text not null,
  item_id uuid,
  action text not null,
  description text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists business_os_ecosystem_marketplace_audit_org_idx
  on public.business_os_ecosystem_marketplace_audit (organization_id, created_at desc);

alter table public.business_os_ecosystem_marketplace_settings enable row level security;
alter table public.business_os_ecosystem_marketplace_section_items enable row level security;
alter table public.business_os_ecosystem_marketplace_listings enable row level security;
alter table public.business_os_ecosystem_marketplace_integrations enable row level security;
alter table public.business_os_ecosystem_marketplace_providers enable row level security;
alter table public.business_os_ecosystem_marketplace_certifications enable row level security;
alter table public.business_os_ecosystem_marketplace_revenue enable row level security;
alter table public.business_os_ecosystem_marketplace_growth_partners enable row level security;
alter table public.business_os_ecosystem_marketplace_analytics enable row level security;
alter table public.business_os_ecosystem_marketplace_companion enable row level security;
alter table public.business_os_ecosystem_marketplace_audit enable row level security;
revoke all on public.business_os_ecosystem_marketplace_settings from authenticated, anon;
revoke all on public.business_os_ecosystem_marketplace_section_items from authenticated, anon;
revoke all on public.business_os_ecosystem_marketplace_listings from authenticated, anon;
revoke all on public.business_os_ecosystem_marketplace_integrations from authenticated, anon;
revoke all on public.business_os_ecosystem_marketplace_providers from authenticated, anon;
revoke all on public.business_os_ecosystem_marketplace_certifications from authenticated, anon;
revoke all on public.business_os_ecosystem_marketplace_revenue from authenticated, anon;
revoke all on public.business_os_ecosystem_marketplace_growth_partners from authenticated, anon;
revoke all on public.business_os_ecosystem_marketplace_analytics from authenticated, anon;
revoke all on public.business_os_ecosystem_marketplace_companion from authenticated, anon;
revoke all on public.business_os_ecosystem_marketplace_audit from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'business_os_ecosystem_marketplace_center', v.description
from (values
  ('business_os_ecosystem_marketplace.view', 'View ABOS Ecosystem Marketplace', 'View marketplace, Business Packs, integrations, partners, and ecosystem analytics'),
  ('business_os_ecosystem_marketplace.manage', 'Manage ABOS Ecosystem Marketplace', 'Manage ecosystem listings, certifications, and marketplace recommendations')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'business_os_ecosystem_marketplace.view'), ('owner', 'business_os_ecosystem_marketplace.manage'),
  ('administrator', 'business_os_ecosystem_marketplace.view'), ('administrator', 'business_os_ecosystem_marketplace.manage'),
  ('manager', 'business_os_ecosystem_marketplace.view'), ('manager', 'business_os_ecosystem_marketplace.manage'),
  ('employee', 'business_os_ecosystem_marketplace.view'),
  ('support_agent', 'business_os_ecosystem_marketplace.view'),
  ('moderator', 'business_os_ecosystem_marketplace.view'),
  ('viewer', 'business_os_ecosystem_marketplace.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._boec444_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'user_id', v_user_id,
    'can_executive', public._irp_has_permission('business_os_ecosystem_marketplace.manage', v_org_id),
    'can_manage', public._irp_has_permission('business_os_ecosystem_marketplace.manage', v_org_id),
    'can_view', public._irp_has_permission('business_os_ecosystem_marketplace.view', v_org_id)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', 'Access denied');
end; $$;

create or replace function public._boec444_log(
  p_org_id uuid, p_user_id uuid, p_item_type text, p_item_id uuid, p_action text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.business_os_ecosystem_marketplace_audit
    (organization_id, user_id, item_type, item_id, action, description)
  values (p_org_id, p_user_id, p_item_type, p_item_id, p_action, left(p_desc, 500));
end; $$;

create or replace function public._boec444_section_json(s public.business_os_ecosystem_marketplace_section_items)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', s.id, 'title', s.title, 'summary', s.summary,
    'metric_label', s.metric_label, 'metric_value', s.metric_value,
    'status_key', s.status_key, 'section_key', s.section_key, 'item_type', 'section'
  );
$$;

create or replace function public._boec444_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.business_os_ecosystem_marketplace_settings (organization_id)
  values (p_org_id) on conflict do nothing;

  if exists (select 1 from public.business_os_ecosystem_marketplace_listings where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.business_os_ecosystem_marketplace_section_items
    (organization_id, section_key, title, summary, metric_label, metric_value, status_key)
  values
    (p_org_id, 'marketplace', 'Marketplace', 'Distribute Business Packs, Skills, templates, workflows, and knowledge packs.', 'Listings', '48', 'verified'),
    (p_org_id, 'business_packs', 'Business Packs', 'Industry and operational packs for Hosts, Commerce, Healthcare, Legal, and more.', 'Packs', '12', 'verified'),
    (p_org_id, 'skills', 'Skills', 'Operational Skills registered and available through the ecosystem.', 'Skills', '24', 'information'),
    (p_org_id, 'integrations', 'Integrations', 'CRM, accounting, support, commerce, and communication integrations.', 'Integrations', '18', 'verified'),
    (p_org_id, 'growth_partners', 'Growth Partners', 'Certified Growth Partner network with leads, revenue, and commissions.', 'Partners', '36', 'verified'),
    (p_org_id, 'solution_providers', 'Solution Providers', 'Certified consultants, agencies, developers, and implementation partners.', 'Providers', '22', 'verified'),
    (p_org_id, 'certifications', 'Certifications', 'Growth Partner, implementation, developer, architect, and support certifications.', 'Programs', '5', 'verified'),
    (p_org_id, 'revenue_sharing', 'Revenue Sharing', 'Marketplace, partner, developer, referral, and enterprise revenue streams.', 'Revenue', 'NOK 2.4M', 'completed');

  insert into public.business_os_ecosystem_marketplace_listings
    (organization_id, listing_name, listing_category, vendor_name, rating_label, downloads_label, version_label, price_label, listing_type, status_key)
  values
    (p_org_id, 'Aipify Hosts', 'hosts', 'Aipify Group AS', '4.9', '1,240', 'v2.4', 'Enterprise', 'business_pack', 'verified'),
    (p_org_id, 'Commerce Operations Pack', 'commerce', 'Aipify Group AS', '4.8', '890', 'v1.8', 'Business', 'business_pack', 'verified'),
    (p_org_id, 'Healthcare Compliance Pack', 'healthcare', 'Nordic Health Partners', '4.7', '320', 'v1.2', 'Enterprise', 'industry_pack', 'verified'),
    (p_org_id, 'Legal Practice Pack', 'legal', 'LegalTech Nordic', '4.6', '210', 'v1.0', 'Professional', 'industry_pack', 'information'),
    (p_org_id, 'Accounting Automation Pack', 'accounting', 'FinanceFlow AS', '4.8', '540', 'v2.1', 'Business', 'automation_pack', 'verified'),
    (p_org_id, 'Property Management Pack', 'property_management', 'PropTech Solutions', '4.5', '180', 'v1.3', 'Professional', 'business_pack', 'verified'),
    (p_org_id, 'Construction Operations Pack', 'construction', 'BuildOps Nordic', '4.4', '95', 'v1.0', 'Professional', 'industry_pack', 'waiting'),
    (p_org_id, 'Hospitality Guest Pack', 'hospitality', 'Aipify Group AS', '4.9', '670', 'v3.0', 'Business', 'business_pack', 'verified'),
    (p_org_id, 'Customer Onboarding Workflow', 'general', 'Aipify Group AS', '4.8', '420', 'v1.5', 'Included', 'workflow', 'verified'),
    (p_org_id, 'Support Triage Skill', 'general', 'Aipify Group AS', '4.7', '780', 'v2.0', 'Included', 'skill', 'verified');

  insert into public.business_os_ecosystem_marketplace_integrations
    (organization_id, integration_name, integration_type, provider_name, summary, status_key)
  values
    (p_org_id, 'Salesforce CRM', 'crm', 'Salesforce', 'Customer relationship management sync and workflow triggers.', 'verified'),
    (p_org_id, 'HubSpot CRM', 'crm', 'HubSpot', 'Marketing and sales pipeline integration.', 'verified'),
    (p_org_id, 'Tripletex Accounting', 'accounting', 'Tripletex', 'Norwegian accounting and invoicing integration.', 'verified'),
    (p_org_id, 'Xero Accounting', 'accounting', 'Xero', 'Cloud accounting for SMB and enterprise.', 'verified'),
    (p_org_id, 'Zendesk Support', 'support', 'Zendesk', 'Support ticket sync and triage automation.', 'verified'),
    (p_org_id, 'Shopify Commerce', 'commerce', 'Shopify', 'Order, inventory, and customer commerce sync.', 'verified'),
    (p_org_id, 'Microsoft Teams', 'communication', 'Microsoft', 'Team communication and notification delivery.', 'verified'),
    (p_org_id, 'Healthcare HL7 FHIR', 'industry_specific', 'HealthConnect', 'Healthcare data exchange for clinical workflows.', 'requires_attention');

  insert into public.business_os_ecosystem_marketplace_providers
    (organization_id, provider_name, provider_type, certification_label, rating_label, regions_label, status_key)
  values
    (p_org_id, 'Nordic Implementation Group', 'implementation_partner', 'Certified Implementation Partner', '4.9', 'NO · SE · DK', 'verified'),
    (p_org_id, 'Bergen Digital Agency', 'agency', 'Certified Agency', '4.7', 'NO · Global remote', 'verified'),
    (p_org_id, 'Oslo Business Consultants', 'consultant', 'Certified Consultant', '4.8', 'NO · EU', 'verified'),
    (p_org_id, 'Aipify Developer Network', 'developer', 'Certified Developer', '4.6', 'Global', 'verified'),
    (p_org_id, 'Enterprise Solutions AS', 'implementation_partner', 'Expert Implementation Partner', '4.9', 'Nordics · DACH', 'verified');

  insert into public.business_os_ecosystem_marketplace_certifications
    (organization_id, certification_key, certification_name, certification_type, holder_count, status_key)
  values
    (p_org_id, 'growth_partner', 'Growth Partner Certification', 'growth_partner', 36, 'verified'),
    (p_org_id, 'implementation', 'Implementation Specialist', 'implementation_specialist', 18, 'verified'),
    (p_org_id, 'pack_developer', 'Business Pack Developer', 'business_pack_developer', 12, 'verified'),
    (p_org_id, 'solution_architect', 'Solution Architect', 'solution_architect', 8, 'verified'),
    (p_org_id, 'support_specialist', 'Support Specialist', 'support_specialist', 24, 'verified');

  insert into public.business_os_ecosystem_marketplace_revenue
    (organization_id, revenue_type, revenue_label, amount_label, period_label, status_key)
  values
    (p_org_id, 'marketplace', 'Marketplace Revenue', 'NOK 840K', 'Q2 2026', 'completed'),
    (p_org_id, 'partner', 'Partner Revenue', 'NOK 620K', 'Q2 2026', 'verified'),
    (p_org_id, 'developer', 'Developer Revenue', 'NOK 380K', 'Q2 2026', 'verified'),
    (p_org_id, 'referral', 'Referral Revenue', 'NOK 290K', 'Q2 2026', 'information'),
    (p_org_id, 'enterprise', 'Enterprise Revenue', 'NOK 270K', 'Q2 2026', 'verified');

  insert into public.business_os_ecosystem_marketplace_growth_partners
    (organization_id, partner_name, partner_tier, leads_label, revenue_label, commission_label, certifications_label, performance_label, status_key)
  values
    (p_org_id, 'Unonight Pilot Partner', 'master_partner', '24 leads', 'NOK 420K', '18%', 'Master Partner · Solution Architect', 'Top performer', 'verified'),
    (p_org_id, 'Nordic SaaS Partners', 'enterprise', '18 leads', 'NOK 280K', '15%', 'Enterprise · Implementation', 'Strong growth', 'verified'),
    (p_org_id, 'Bergen Tech Alliance', 'professional', '12 leads', 'NOK 140K', '12%', 'Professional · Growth Partner', 'On track', 'verified'),
    (p_org_id, 'Oslo Business Network', 'certified', '8 leads', 'NOK 95K', '10%', 'Certified Growth Partner', 'Building pipeline', 'waiting');

  insert into public.business_os_ecosystem_marketplace_analytics
    (organization_id, metric_key, metric_value, trend_label, status_key)
  values
    (p_org_id, 'installs', '2,840', '+12% this quarter', 'verified'),
    (p_org_id, 'revenue', 'NOK 2.4M', '+8% vs prior quarter', 'completed'),
    (p_org_id, 'retention', '94%', 'Stable enterprise retention', 'verified'),
    (p_org_id, 'usage', '78%', 'Active pack utilization', 'information'),
    (p_org_id, 'ratings', '4.7 avg', '892 reviews', 'verified'),
    (p_org_id, 'support_requests', '42', '3 require attention', 'requires_attention');

  insert into public.business_os_ecosystem_marketplace_companion
    (organization_id, recommendation_type, recommendation, reason)
  values
    (p_org_id, 'business_pack', 'Install Hospitality Guest Pack', 'Your organization profile matches hospitality operations — guest intelligence and Hosts workflows available.'),
    (p_org_id, 'integration', 'Connect Tripletex Accounting', 'Finance workflows would benefit from automated invoice and payment sync.'),
    (p_org_id, 'partner', 'Engage Nordic Implementation Group', 'Certified implementation partner available in your region with 4.9 rating.'),
    (p_org_id, 'consultant', 'Consult Oslo Business Consultants', 'Enterprise rollout may benefit from certified consultant support.'),
    (p_org_id, 'skill', 'Enable Support Triage Skill', 'Support volume increased — triage Skill reduces response time.'),
    (p_org_id, 'template', 'Deploy Customer Onboarding Workflow', 'New customer volume suggests onboarding workflow template.');

end; $$;

create or replace function public.get_business_os_ecosystem_marketplace_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_settings jsonb;
  v_marketplace_s jsonb; v_packs_s jsonb; v_skills_s jsonb; v_integrations_s jsonb;
  v_growth_s jsonb; v_providers_s jsonb; v_certs_s jsonb; v_revenue_s jsonb;
  v_listings jsonb; v_integrations jsonb; v_providers jsonb; v_certifications jsonb;
  v_revenue jsonb; v_growth jsonb; v_analytics jsonb; v_companion jsonb;
begin
  perform public._irp_require_permission('business_os_ecosystem_marketplace.view');
  v_ctx := public._boec444_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', coalesce(v_ctx->>'error', 'Access denied'));
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  perform public._boec444_seed(v_org_id);

  select jsonb_build_object(
    'marketplace_enabled', s.marketplace_enabled,
    'review_required', s.review_required,
    'revenue_sharing_enabled', s.revenue_sharing_enabled
  ) into v_settings
  from public.business_os_ecosystem_marketplace_settings s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(public._boec444_section_json(s)), '[]'::jsonb) into v_marketplace_s
  from public.business_os_ecosystem_marketplace_section_items s where s.organization_id = v_org_id and s.section_key = 'marketplace';
  select coalesce(jsonb_agg(public._boec444_section_json(s)), '[]'::jsonb) into v_packs_s
  from public.business_os_ecosystem_marketplace_section_items s where s.organization_id = v_org_id and s.section_key = 'business_packs';
  select coalesce(jsonb_agg(public._boec444_section_json(s)), '[]'::jsonb) into v_skills_s
  from public.business_os_ecosystem_marketplace_section_items s where s.organization_id = v_org_id and s.section_key = 'skills';
  select coalesce(jsonb_agg(public._boec444_section_json(s)), '[]'::jsonb) into v_integrations_s
  from public.business_os_ecosystem_marketplace_section_items s where s.organization_id = v_org_id and s.section_key = 'integrations';
  select coalesce(jsonb_agg(public._boec444_section_json(s)), '[]'::jsonb) into v_growth_s
  from public.business_os_ecosystem_marketplace_section_items s where s.organization_id = v_org_id and s.section_key = 'growth_partners';
  select coalesce(jsonb_agg(public._boec444_section_json(s)), '[]'::jsonb) into v_providers_s
  from public.business_os_ecosystem_marketplace_section_items s where s.organization_id = v_org_id and s.section_key = 'solution_providers';
  select coalesce(jsonb_agg(public._boec444_section_json(s)), '[]'::jsonb) into v_certs_s
  from public.business_os_ecosystem_marketplace_section_items s where s.organization_id = v_org_id and s.section_key = 'certifications';
  select coalesce(jsonb_agg(public._boec444_section_json(s)), '[]'::jsonb) into v_revenue_s
  from public.business_os_ecosystem_marketplace_section_items s where s.organization_id = v_org_id and s.section_key = 'revenue_sharing';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'listing_name', l.listing_name, 'listing_category', l.listing_category,
    'vendor_name', l.vendor_name, 'rating_label', l.rating_label, 'downloads_label', l.downloads_label,
    'version_label', l.version_label, 'price_label', l.price_label, 'listing_type', l.listing_type,
    'status_key', l.status_key, 'item_type', 'listing'
  ) order by l.downloads_label desc), '[]'::jsonb)
  into v_listings from public.business_os_ecosystem_marketplace_listings l where l.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'integration_name', i.integration_name, 'integration_type', i.integration_type,
    'provider_name', i.provider_name, 'summary', i.summary, 'status_key', i.status_key, 'item_type', 'integration'
  ) order by i.integration_name), '[]'::jsonb)
  into v_integrations from public.business_os_ecosystem_marketplace_integrations i where i.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'provider_name', p.provider_name, 'provider_type', p.provider_type,
    'certification_label', p.certification_label, 'rating_label', p.rating_label,
    'regions_label', p.regions_label, 'status_key', p.status_key, 'item_type', 'provider'
  ) order by p.rating_label desc), '[]'::jsonb)
  into v_providers from public.business_os_ecosystem_marketplace_providers p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'certification_key', c.certification_key, 'certification_name', c.certification_name,
    'certification_type', c.certification_type, 'holder_count', c.holder_count,
    'status_key', c.status_key, 'item_type', 'certification'
  ) order by c.certification_name), '[]'::jsonb)
  into v_certifications from public.business_os_ecosystem_marketplace_certifications c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'revenue_type', r.revenue_type, 'revenue_label', r.revenue_label,
    'amount_label', r.amount_label, 'period_label', r.period_label,
    'status_key', r.status_key, 'item_type', 'revenue'
  ) order by r.amount_label desc), '[]'::jsonb)
  into v_revenue from public.business_os_ecosystem_marketplace_revenue r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', g.id, 'partner_name', g.partner_name, 'partner_tier', g.partner_tier,
    'leads_label', g.leads_label, 'revenue_label', g.revenue_label, 'commission_label', g.commission_label,
    'certifications_label', g.certifications_label, 'performance_label', g.performance_label,
    'status_key', g.status_key, 'item_type', 'growth_partner'
  ) order by g.revenue_label desc), '[]'::jsonb)
  into v_growth from public.business_os_ecosystem_marketplace_growth_partners g where g.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'metric_key', a.metric_key, 'metric_value', a.metric_value,
    'trend_label', a.trend_label, 'status_key', a.status_key, 'item_type', 'analytics'
  ) order by case a.metric_key
    when 'installs' then 1 when 'revenue' then 2 when 'retention' then 3
    when 'usage' then 4 when 'ratings' then 5 else 6 end), '[]'::jsonb)
  into v_analytics from public.business_os_ecosystem_marketplace_analytics a where a.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'recommendation_type', c.recommendation_type, 'recommendation', c.recommendation,
    'reason', c.reason, 'status', c.status, 'item_type', 'companion'
  ) order by c.created_at desc), '[]'::jsonb)
  into v_companion from public.business_os_ecosystem_marketplace_companion c
  where c.organization_id = v_org_id and c.status = 'open';

  return jsonb_build_object(
    'found', true,
    'philosophy', 'The most successful platforms become ecosystems. Aipify evolves from a product into a platform where businesses build, operate, and grow.',
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'governance_note', 'All ecosystem assets require review, approval, version control, audit logging, and security validation.',
    'marketplace_settings', coalesce(v_settings, '{}'::jsonb),
    'business_pack_store', (select coalesce(jsonb_agg(x), '[]'::jsonb) from jsonb_array_elements(v_listings) x where x->>'listing_type' in ('business_pack', 'industry_pack')),
    'marketplace_listings', v_listings,
    'integration_marketplace', v_integrations,
    'solution_provider_directory', v_providers,
    'certification_framework', v_certifications,
    'revenue_sharing_engine', v_revenue,
    'growth_partner_ecosystem', v_growth,
    'ecosystem_analytics', v_analytics,
    'companion_advisor', v_companion,
    'sections', jsonb_build_object(
      'marketplace', v_marketplace_s,
      'business_packs', v_packs_s,
      'skills', v_skills_s,
      'integrations', v_integrations_s,
      'growth_partners', v_growth_s,
      'solution_providers', v_providers_s,
      'certifications', v_certs_s,
      'revenue_sharing', v_revenue_s
    ),
    'statistics', jsonb_build_object(
      'listing_count', jsonb_array_length(v_listings),
      'integration_count', jsonb_array_length(v_integrations),
      'provider_count', jsonb_array_length(v_providers),
      'certification_count', jsonb_array_length(v_certifications),
      'growth_partner_count', jsonb_array_length(v_growth),
      'companion_count', jsonb_array_length(v_companion)
    ),
    'privacy_note', 'Ecosystem metadata and aggregate metrics only — no partner PII or customer business records in marketplace listings.'
  );
end; $$;

create or replace function public.manage_business_os_ecosystem_marketplace_item(
  p_item_type text,
  p_item_id uuid default null,
  p_action text default 'acknowledge',
  p_payload jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid;
begin
  v_ctx := public._boec444_access();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Not authorized';
  end if;
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if p_action not in ('acknowledge', 'dismiss', 'approve', 'escalate') then
    raise exception 'Invalid action';
  end if;

  if p_item_type = 'companion' and p_item_id is not null then
    update public.business_os_ecosystem_marketplace_companion set
      status = case p_action when 'acknowledge' then 'acknowledged' when 'dismiss' then 'dismissed' else status end
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'listing' and p_item_id is not null then
    update public.business_os_ecosystem_marketplace_listings set
      status_key = case p_action when 'approve' then 'verified' when 'escalate' then 'requires_attention' else status_key end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  end if;

  perform public._boec444_log(v_org_id, v_user_id, p_item_type, p_item_id, p_action, 'Ecosystem marketplace item updated');
  return jsonb_build_object('ok', true, 'action', p_action);
end; $$;

grant execute on function public.get_business_os_ecosystem_marketplace_center() to authenticated;
grant execute on function public.manage_business_os_ecosystem_marketplace_item(text, uuid, text, jsonb) to authenticated;
