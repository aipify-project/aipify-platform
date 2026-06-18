-- Phase 445 — Global Business Network Engine (Customer App)
-- Route: /app/network

create table if not exists public.global_business_network_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  network_enabled boolean not null default true,
  public_profile_enabled boolean not null default true,
  connection_requests_enabled boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.global_business_network_section_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  section_key text not null check (section_key in (
    'organizations', 'partners', 'vendors', 'service_providers',
    'growth_partners', 'opportunities', 'introductions', 'collaboration'
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

create index if not exists global_business_network_sections_org_idx
  on public.global_business_network_section_items (organization_id, section_key);

create table if not exists public.global_business_network_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  company_name text not null,
  industry text not null default '',
  country text not null default '',
  languages_label text not null default '',
  services_label text not null default '',
  products_label text not null default '',
  business_packs_label text not null default '',
  verification_status text not null default 'pending' check (verification_status in (
    'verified', 'pending', 'failed'
  )),
  status_key text not null default 'waiting',
  updated_at timestamptz not null default now()
);

create index if not exists global_business_network_profiles_org_idx
  on public.global_business_network_profiles (organization_id, verification_status);

create table if not exists public.global_business_network_opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  opportunity_type text not null check (opportunity_type in (
    'project', 'partnership_request', 'vendor_request', 'consulting_request', 'service_request'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  industry text not null default '',
  location_label text not null default '',
  status_key text not null default 'information',
  created_at timestamptz not null default now()
);

create index if not exists global_business_network_opportunities_org_idx
  on public.global_business_network_opportunities (organization_id, opportunity_type);

create table if not exists public.global_business_network_matches (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  match_type text not null check (match_type in (
    'partner', 'consultant', 'vendor', 'service_provider', 'growth_partner'
  )),
  match_name text not null,
  match_reason text not null default '' check (char_length(match_reason) <= 500),
  industry text not null default '',
  location_label text not null default '',
  confidence_label text not null default 'moderate',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now()
);

create index if not exists global_business_network_matches_org_idx
  on public.global_business_network_matches (organization_id, match_type);

create table if not exists public.global_business_network_vendors (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  vendor_name text not null,
  industry text not null default '',
  country text not null default '',
  verification_status text not null default 'verified',
  rating_label text not null default '',
  specialties_label text not null default '',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now()
);

create index if not exists global_business_network_vendors_org_idx
  on public.global_business_network_vendors (organization_id, industry);

create table if not exists public.global_business_network_growth_partners (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  partner_name text not null,
  territory_label text not null default '',
  prospects_label text not null default '',
  team_label text not null default '',
  opportunities_label text not null default '',
  performance_label text not null default '',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now()
);

create index if not exists global_business_network_growth_partners_org_idx
  on public.global_business_network_growth_partners (organization_id);

create table if not exists public.global_business_network_collaborations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  collaboration_type text not null check (collaboration_type in (
    'connection', 'message', 'share_request', 'joint_project', 'external_invite'
  )),
  title text not null,
  partner_name text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  status_key text not null default 'waiting',
  created_at timestamptz not null default now()
);

create index if not exists global_business_network_collaborations_org_idx
  on public.global_business_network_collaborations (organization_id, collaboration_type);

create table if not exists public.global_business_network_executive_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null check (metric_key in (
    'new_opportunities', 'recommended_partners', 'potential_customers',
    'vendor_opportunities', 'partnership_activity'
  )),
  metric_value text not null default '',
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, metric_key)
);

create table if not exists public.global_business_network_companion (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  recommendation_type text not null check (recommendation_type in (
    'partner', 'vendor', 'consultant', 'growth_partner'
  )),
  recommendation text not null,
  reason text not null default '' check (char_length(reason) <= 500),
  status text not null default 'open' check (status in ('open', 'acknowledged', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists global_business_network_companion_org_idx
  on public.global_business_network_companion (organization_id, status);

create table if not exists public.global_business_network_audit (
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

create index if not exists global_business_network_audit_org_idx
  on public.global_business_network_audit (organization_id, created_at desc);

alter table public.global_business_network_settings enable row level security;
alter table public.global_business_network_section_items enable row level security;
alter table public.global_business_network_profiles enable row level security;
alter table public.global_business_network_opportunities enable row level security;
alter table public.global_business_network_matches enable row level security;
alter table public.global_business_network_vendors enable row level security;
alter table public.global_business_network_growth_partners enable row level security;
alter table public.global_business_network_collaborations enable row level security;
alter table public.global_business_network_executive_metrics enable row level security;
alter table public.global_business_network_companion enable row level security;
alter table public.global_business_network_audit enable row level security;
revoke all on public.global_business_network_settings from authenticated, anon;
revoke all on public.global_business_network_section_items from authenticated, anon;
revoke all on public.global_business_network_profiles from authenticated, anon;
revoke all on public.global_business_network_opportunities from authenticated, anon;
revoke all on public.global_business_network_matches from authenticated, anon;
revoke all on public.global_business_network_vendors from authenticated, anon;
revoke all on public.global_business_network_growth_partners from authenticated, anon;
revoke all on public.global_business_network_collaborations from authenticated, anon;
revoke all on public.global_business_network_executive_metrics from authenticated, anon;
revoke all on public.global_business_network_companion from authenticated, anon;
revoke all on public.global_business_network_audit from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'global_business_network_center', v.description
from (values
  ('global_business_network.view', 'View Global Business Network', 'View network profiles, opportunities, matching, and collaboration'),
  ('global_business_network.manage', 'Manage Global Business Network', 'Manage network visibility, connections, and collaboration requests')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'global_business_network.view'), ('owner', 'global_business_network.manage'),
  ('administrator', 'global_business_network.view'), ('administrator', 'global_business_network.manage'),
  ('manager', 'global_business_network.view'), ('manager', 'global_business_network.manage'),
  ('employee', 'global_business_network.view'),
  ('support_agent', 'global_business_network.view'),
  ('moderator', 'global_business_network.view'),
  ('viewer', 'global_business_network.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._gbn445_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'user_id', v_user_id,
    'can_executive', public._irp_has_permission('global_business_network.manage', v_org_id),
    'can_manage', public._irp_has_permission('global_business_network.manage', v_org_id),
    'can_view', public._irp_has_permission('global_business_network.view', v_org_id)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', 'Access denied');
end; $$;

create or replace function public._gbn445_log(
  p_org_id uuid, p_user_id uuid, p_item_type text, p_item_id uuid, p_action text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.global_business_network_audit
    (organization_id, user_id, item_type, item_id, action, description)
  values (p_org_id, p_user_id, p_item_type, p_item_id, p_action, left(p_desc, 500));
end; $$;

create or replace function public._gbn445_section_json(s public.global_business_network_section_items)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', s.id, 'title', s.title, 'summary', s.summary,
    'metric_label', s.metric_label, 'metric_value', s.metric_value,
    'status_key', s.status_key, 'section_key', s.section_key, 'item_type', 'section'
  );
$$;

create or replace function public._gbn445_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.global_business_network_settings (organization_id)
  values (p_org_id) on conflict do nothing;

  if exists (select 1 from public.global_business_network_profiles where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.global_business_network_section_items
    (organization_id, section_key, title, summary, metric_label, metric_value, status_key)
  values
    (p_org_id, 'organizations', 'Organizations', 'Verified companies participating in the global business network.', 'Organizations', '128', 'verified'),
    (p_org_id, 'partners', 'Partners', 'Technology, strategic, and regional partners available for collaboration.', 'Partners', '42', 'verified'),
    (p_org_id, 'vendors', 'Vendors', 'Trusted vendors across industries and regions.', 'Vendors', '56', 'verified'),
    (p_org_id, 'service_providers', 'Service Providers', 'Consultants, agencies, and implementation specialists.', 'Providers', '38', 'verified'),
    (p_org_id, 'growth_partners', 'Growth Partners', 'Certified Growth Partners building territories and teams.', 'Growth Partners', '24', 'verified'),
    (p_org_id, 'opportunities', 'Opportunities', 'Projects, partnership requests, and vendor opportunities.', 'Open', '18', 'information'),
    (p_org_id, 'introductions', 'Introductions', 'Warm introductions and connection requests between organizations.', 'Pending', '7', 'waiting'),
    (p_org_id, 'collaboration', 'Collaboration', 'Active connections, joint projects, and shared requests.', 'Active', '14', 'verified');

  insert into public.global_business_network_profiles
    (organization_id, company_name, industry, country, languages_label, services_label, products_label, business_packs_label, verification_status, status_key)
  values
    (p_org_id, 'Unonight AS', 'Hospitality', 'Norway', 'NO · EN', 'Guest operations · Event management', 'Nightlife venues', 'Hosts · Commerce', 'verified', 'verified'),
    (p_org_id, 'Nordic SaaS Partners', 'Technology', 'Norway', 'NO · EN · SV', 'SaaS implementation · Integration', 'ABOS deployments', 'Commerce · Support', 'verified', 'verified'),
    (p_org_id, 'Bergen Property Group', 'Property Management', 'Norway', 'NO · EN', 'Property management · Facility services', 'Residential · Commercial', 'Property Management Pack', 'pending', 'waiting'),
    (p_org_id, 'Oslo Accounting Partners', 'Accounting', 'Norway', 'NO · EN', 'Accounting · Payroll · Compliance', 'Financial services', 'Accounting Pack', 'verified', 'verified');

  insert into public.global_business_network_opportunities
    (organization_id, opportunity_type, title, summary, industry, location_label, status_key)
  values
    (p_org_id, 'consulting_request', 'Looking for Shopify Specialist', 'E-commerce rollout requires certified Shopify implementation partner.', 'Commerce', 'Norway · Remote', 'information'),
    (p_org_id, 'consulting_request', 'Looking for Property Management Consultant', 'Multi-site property portfolio needs operational consultant.', 'Property Management', 'Bergen, Norway', 'waiting'),
    (p_org_id, 'partnership_request', 'Looking for Accounting Partner', 'Enterprise customer seeking Nordic accounting integration partner.', 'Accounting', 'Nordics', 'verified'),
    (p_org_id, 'vendor_request', 'Cloud Infrastructure Vendor', 'Seeking verified cloud vendor for enterprise deployment.', 'Technology', 'EU', 'information'),
    (p_org_id, 'project', 'Hospitality Digital Transformation', 'Joint project for guest intelligence and operations automation.', 'Hospitality', 'Norway', 'verified'),
    (p_org_id, 'service_request', 'Legal Compliance Review', 'GDPR and enterprise compliance review for ABOS deployment.', 'Legal', 'Remote', 'requires_attention');

  insert into public.global_business_network_matches
    (organization_id, match_type, match_name, match_reason, industry, location_label, confidence_label, status_key)
  values
    (p_org_id, 'partner', 'Nordic Implementation Group', 'Industry match — hospitality operations and ABOS Hosts pack usage.', 'Hospitality', 'Norway', 'high', 'verified'),
    (p_org_id, 'consultant', 'Oslo Business Consultants', 'Consulting request match — property management expertise in Bergen region.', 'Property Management', 'Norway', 'moderate', 'verified'),
    (p_org_id, 'vendor', 'CloudSecure Nordic', 'Vendor request match — verified enterprise cloud provider.', 'Technology', 'Nordics', 'high', 'verified'),
    (p_org_id, 'service_provider', 'LegalTech Nordic', 'Service request match — GDPR compliance specialization.', 'Legal', 'EU', 'moderate', 'requires_attention'),
    (p_org_id, 'growth_partner', 'Bergen Tech Alliance', 'Growth Partner territory overlap — hospitality prospects in western Norway.', 'Hospitality', 'Norway', 'moderate', 'verified');

  insert into public.global_business_network_vendors
    (organization_id, vendor_name, industry, country, verification_status, rating_label, specialties_label, status_key)
  values
    (p_org_id, 'CloudSecure Nordic', 'Technology', 'Norway', 'verified', '4.9', 'Cloud · Security · Enterprise', 'verified'),
    (p_org_id, 'Nordic Print & Logistics', 'Operations', 'Sweden', 'verified', '4.6', 'Logistics · Fulfillment', 'verified'),
    (p_org_id, 'FinanceFlow AS', 'Accounting', 'Norway', 'verified', '4.8', 'Accounting · Invoicing · Payroll', 'verified'),
    (p_org_id, 'PropTech Solutions', 'Property Management', 'Norway', 'pending', '4.5', 'Property tech · IoT', 'waiting'),
    (p_org_id, 'Shopify Partner Nordic', 'Commerce', 'Denmark', 'verified', '4.7', 'Shopify · E-commerce', 'verified');

  insert into public.global_business_network_growth_partners
    (organization_id, partner_name, territory_label, prospects_label, team_label, opportunities_label, performance_label, status_key)
  values
    (p_org_id, 'Unonight Pilot Partner', 'Western Norway', '12 prospects', 'Team of 4', '6 open opportunities', 'Top performer', 'verified'),
    (p_org_id, 'Nordic SaaS Partners', 'Nordics', '18 prospects', 'Team of 8', '4 open opportunities', 'Strong pipeline', 'verified'),
    (p_org_id, 'Bergen Tech Alliance', 'Bergen region', '8 prospects', 'Team of 3', '2 open opportunities', 'Building', 'waiting');

  insert into public.global_business_network_collaborations
    (organization_id, collaboration_type, title, partner_name, summary, status_key)
  values
    (p_org_id, 'connection', 'Connection with Nordic Implementation Group', 'Nordic Implementation Group', 'Partnership connection approved — hospitality rollout collaboration.', 'verified'),
    (p_org_id, 'joint_project', 'Hospitality Digital Transformation', 'Unonight AS · Nordic SaaS Partners', 'Joint project for guest intelligence deployment.', 'verified'),
    (p_org_id, 'share_request', 'Vendor evaluation shared', 'FinanceFlow AS', 'Accounting vendor evaluation shared with finance team.', 'information'),
    (p_org_id, 'external_invite', 'Invite external legal consultant', 'LegalTech Nordic', 'External partner invited for compliance review.', 'waiting'),
    (p_org_id, 'message', 'Introduction request pending', 'Oslo Business Consultants', 'Warm introduction requested for property management consulting.', 'waiting');

  insert into public.global_business_network_executive_metrics
    (organization_id, metric_key, metric_value, trend_label, status_key)
  values
    (p_org_id, 'new_opportunities', '18', '6 this month', 'information'),
    (p_org_id, 'recommended_partners', '5', '2 high confidence', 'verified'),
    (p_org_id, 'potential_customers', '12', 'Hospitality segment', 'verified'),
    (p_org_id, 'vendor_opportunities', '8', '3 verified vendors', 'verified'),
    (p_org_id, 'partnership_activity', '14', '4 active collaborations', 'completed');

  insert into public.global_business_network_companion
    (organization_id, recommendation_type, recommendation, reason)
  values
    (p_org_id, 'partner', 'Connect with Nordic Implementation Group', 'Strong industry and location match for hospitality ABOS deployment.'),
    (p_org_id, 'vendor', 'Evaluate Shopify Partner Nordic', 'Your open Shopify specialist request matches this verified vendor.'),
    (p_org_id, 'consultant', 'Introduce Oslo Business Consultants', 'Property management consulting request aligns with their Bergen expertise.'),
    (p_org_id, 'growth_partner', 'Collaborate with Bergen Tech Alliance', 'Territory overlap in western Norway — shared hospitality prospects.');

end; $$;

create or replace function public.get_global_business_network_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_settings jsonb;
  v_orgs_s jsonb; v_partners_s jsonb; v_vendors_s jsonb; v_providers_s jsonb;
  v_growth_s jsonb; v_opps_s jsonb; v_intros_s jsonb; v_collab_s jsonb;
  v_profiles jsonb; v_opportunities jsonb; v_matches jsonb; v_vendors jsonb;
  v_growth jsonb; v_collaborations jsonb; v_exec jsonb; v_companion jsonb;
begin
  perform public._irp_require_permission('global_business_network.view');
  v_ctx := public._gbn445_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', coalesce(v_ctx->>'error', 'Access denied'));
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  perform public._gbn445_seed(v_org_id);

  select jsonb_build_object(
    'network_enabled', s.network_enabled,
    'public_profile_enabled', s.public_profile_enabled,
    'connection_requests_enabled', s.connection_requests_enabled
  ) into v_settings
  from public.global_business_network_settings s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(public._gbn445_section_json(s)), '[]'::jsonb) into v_orgs_s
  from public.global_business_network_section_items s where s.organization_id = v_org_id and s.section_key = 'organizations';
  select coalesce(jsonb_agg(public._gbn445_section_json(s)), '[]'::jsonb) into v_partners_s
  from public.global_business_network_section_items s where s.organization_id = v_org_id and s.section_key = 'partners';
  select coalesce(jsonb_agg(public._gbn445_section_json(s)), '[]'::jsonb) into v_vendors_s
  from public.global_business_network_section_items s where s.organization_id = v_org_id and s.section_key = 'vendors';
  select coalesce(jsonb_agg(public._gbn445_section_json(s)), '[]'::jsonb) into v_providers_s
  from public.global_business_network_section_items s where s.organization_id = v_org_id and s.section_key = 'service_providers';
  select coalesce(jsonb_agg(public._gbn445_section_json(s)), '[]'::jsonb) into v_growth_s
  from public.global_business_network_section_items s where s.organization_id = v_org_id and s.section_key = 'growth_partners';
  select coalesce(jsonb_agg(public._gbn445_section_json(s)), '[]'::jsonb) into v_opps_s
  from public.global_business_network_section_items s where s.organization_id = v_org_id and s.section_key = 'opportunities';
  select coalesce(jsonb_agg(public._gbn445_section_json(s)), '[]'::jsonb) into v_intros_s
  from public.global_business_network_section_items s where s.organization_id = v_org_id and s.section_key = 'introductions';
  select coalesce(jsonb_agg(public._gbn445_section_json(s)), '[]'::jsonb) into v_collab_s
  from public.global_business_network_section_items s where s.organization_id = v_org_id and s.section_key = 'collaboration';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'company_name', p.company_name, 'industry', p.industry, 'country', p.country,
    'languages_label', p.languages_label, 'services_label', p.services_label,
    'products_label', p.products_label, 'business_packs_label', p.business_packs_label,
    'verification_status', p.verification_status, 'status_key', p.status_key, 'item_type', 'profile'
  ) order by case p.verification_status when 'verified' then 1 when 'pending' then 2 else 3 end), '[]'::jsonb)
  into v_profiles from public.global_business_network_profiles p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id, 'opportunity_type', o.opportunity_type, 'title', o.title, 'summary', o.summary,
    'industry', o.industry, 'location_label', o.location_label,
    'status_key', o.status_key, 'item_type', 'opportunity'
  ) order by o.created_at desc), '[]'::jsonb)
  into v_opportunities from public.global_business_network_opportunities o where o.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'match_type', m.match_type, 'match_name', m.match_name, 'match_reason', m.match_reason,
    'industry', m.industry, 'location_label', m.location_label, 'confidence_label', m.confidence_label,
    'status_key', m.status_key, 'item_type', 'match'
  ) order by case m.confidence_label when 'high' then 1 when 'moderate' then 2 else 3 end), '[]'::jsonb)
  into v_matches from public.global_business_network_matches m where m.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', v.id, 'vendor_name', v.vendor_name, 'industry', v.industry, 'country', v.country,
    'verification_status', v.verification_status, 'rating_label', v.rating_label,
    'specialties_label', v.specialties_label, 'status_key', v.status_key, 'item_type', 'vendor'
  ) order by v.rating_label desc), '[]'::jsonb)
  into v_vendors from public.global_business_network_vendors v where v.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', g.id, 'partner_name', g.partner_name, 'territory_label', g.territory_label,
    'prospects_label', g.prospects_label, 'team_label', g.team_label,
    'opportunities_label', g.opportunities_label, 'performance_label', g.performance_label,
    'status_key', g.status_key, 'item_type', 'growth_partner'
  ) order by g.updated_at desc), '[]'::jsonb)
  into v_growth from public.global_business_network_growth_partners g where g.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'collaboration_type', c.collaboration_type, 'title', c.title,
    'partner_name', c.partner_name, 'summary', c.summary,
    'status_key', c.status_key, 'item_type', 'collaboration'
  ) order by c.created_at desc), '[]'::jsonb)
  into v_collaborations from public.global_business_network_collaborations c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'metric_key', e.metric_key, 'metric_value', e.metric_value,
    'trend_label', e.trend_label, 'status_key', e.status_key, 'item_type', 'executive'
  ) order by case e.metric_key
    when 'new_opportunities' then 1 when 'recommended_partners' then 2 when 'potential_customers' then 3
    when 'vendor_opportunities' then 4 else 5 end), '[]'::jsonb)
  into v_exec from public.global_business_network_executive_metrics e where e.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'recommendation_type', c.recommendation_type, 'recommendation', c.recommendation,
    'reason', c.reason, 'status', c.status, 'item_type', 'companion'
  ) order by c.created_at desc), '[]'::jsonb)
  into v_companion from public.global_business_network_companion c
  where c.organization_id = v_org_id and c.status = 'open';

  return jsonb_build_object(
    'found', true,
    'philosophy', 'Most businesses operate in isolation. Aipify helps organizations find opportunities, partnerships, expertise, customers, suppliers, and growth through a trusted global network.',
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'governance_note', 'Organizations control visibility, public profile, connection requests, and network permissions. All interactions are logged.',
    'network_settings', coalesce(v_settings, '{}'::jsonb),
    'organization_profiles', v_profiles,
    'opportunity_marketplace', v_opportunities,
    'smart_matching', v_matches,
    'trusted_vendor_directory', v_vendors,
    'growth_partner_network', v_growth,
    'collaboration_center', v_collaborations,
    'executive_dashboard', v_exec,
    'companion_advisor', v_companion,
    'sections', jsonb_build_object(
      'organizations', v_orgs_s,
      'partners', v_partners_s,
      'vendors', v_vendors_s,
      'service_providers', v_providers_s,
      'growth_partners', v_growth_s,
      'opportunities', v_opps_s,
      'introductions', v_intros_s,
      'collaboration', v_collab_s
    ),
    'statistics', jsonb_build_object(
      'profile_count', jsonb_array_length(v_profiles),
      'opportunity_count', jsonb_array_length(v_opportunities),
      'match_count', jsonb_array_length(v_matches),
      'vendor_count', jsonb_array_length(v_vendors),
      'growth_partner_count', jsonb_array_length(v_growth),
      'collaboration_count', jsonb_array_length(v_collaborations),
      'companion_count', jsonb_array_length(v_companion)
    ),
    'privacy_note', 'Network metadata and aggregate signals only — no private messages, payment details, or unapproved PII in network profiles.'
  );
end; $$;

create or replace function public.manage_global_business_network_item(
  p_item_type text,
  p_item_id uuid default null,
  p_action text default 'acknowledge',
  p_payload jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid;
begin
  v_ctx := public._gbn445_access();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Not authorized';
  end if;
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if p_action not in ('acknowledge', 'dismiss', 'connect', 'escalate') then
    raise exception 'Invalid action';
  end if;

  if p_item_type = 'companion' and p_item_id is not null then
    update public.global_business_network_companion set
      status = case p_action when 'acknowledge' then 'acknowledged' when 'dismiss' then 'dismissed' else status end
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'collaboration' and p_item_id is not null then
    update public.global_business_network_collaborations set
      status_key = case p_action
        when 'connect' then 'verified'
        when 'escalate' then 'requires_attention'
        else status_key
      end
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'opportunity' and p_item_id is not null then
    update public.global_business_network_opportunities set
      status_key = case p_action when 'acknowledge' then 'verified' when 'escalate' then 'requires_attention' else status_key end
    where id = p_item_id and organization_id = v_org_id;
  end if;

  perform public._gbn445_log(v_org_id, v_user_id, p_item_type, p_item_id, p_action, 'Global business network item updated');
  return jsonb_build_object('ok', true, 'action', p_action);
end; $$;

grant execute on function public.get_global_business_network_center() to authenticated;
grant execute on function public.manage_global_business_network_item(text, uuid, text, jsonb) to authenticated;
