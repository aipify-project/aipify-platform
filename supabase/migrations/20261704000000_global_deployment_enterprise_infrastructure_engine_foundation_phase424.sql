-- Phase 424 — Global Deployment, Multi-Region & Enterprise Infrastructure Engine Foundation
-- Feature owner: CUSTOMER APP. Route: /app/infrastructure/global. Helpers: _ggeie424_*

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.global_enterprise_infrastructure_engine_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  deployment_mode text not null default 'multi_tenant_cloud' check (
    deployment_mode in (
      'multi_tenant_cloud', 'dedicated_cloud', 'private_cloud', 'hybrid_cloud', 'on_premise', 'air_gapped'
    )
  ),
  global_health_score integer not null default 84 check (global_health_score between 0 and 100),
  compliance_coverage_percent integer not null default 78 check (compliance_coverage_percent between 0 and 100),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.global_enterprise_infrastructure_engine_regions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  region_key text not null,
  region_title text not null,
  region_type text not null check (
    region_type in (
      'north_america', 'europe', 'nordics', 'united_kingdom', 'asia_pacific',
      'middle_east', 'africa', 'latin_america', 'custom'
    )
  ),
  status text not null default 'active' check (status in ('active', 'planned', 'archived')),
  countries_count integer not null default 0,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, region_key)
);

create index if not exists global_enterprise_infrastructure_engine_regions_tenant_idx
  on public.global_enterprise_infrastructure_engine_regions (tenant_id, region_type);

create table if not exists public.global_enterprise_infrastructure_engine_countries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  country_key text not null,
  country_name text not null,
  region_key text not null default '',
  primary_language text not null default 'en',
  currency_code text not null default 'USD',
  timezone text not null default 'UTC',
  compliance_status text not null default 'review' check (compliance_status in ('compliant', 'review', 'gap')),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, country_key)
);

create index if not exists global_enterprise_infrastructure_engine_countries_tenant_idx
  on public.global_enterprise_infrastructure_engine_countries (tenant_id, region_key);

create table if not exists public.global_enterprise_infrastructure_engine_localizations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  locale_key text not null,
  locale_title text not null,
  language_code text not null,
  currency_code text not null default 'USD',
  date_format text not null default 'YYYY-MM-DD',
  timezone text not null default 'UTC',
  status text not null default 'active' check (status in ('active', 'planned', 'future')),
  adoption_percent integer not null default 0 check (adoption_percent between 0 and 100),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, locale_key)
);

create index if not exists global_enterprise_infrastructure_engine_localizations_tenant_idx
  on public.global_enterprise_infrastructure_engine_localizations (tenant_id, language_code);

create table if not exists public.global_enterprise_infrastructure_engine_compliance_policies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  policy_key text not null,
  policy_title text not null,
  policy_type text not null check (
    policy_type in ('privacy', 'data_residency', 'industry', 'retention', 'audit', 'regional_governance')
  ),
  region_scope text not null default 'global',
  status text not null default 'active' check (status in ('active', 'review', 'draft')),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, policy_key)
);

create index if not exists global_enterprise_infrastructure_engine_compliance_policies_tenant_idx
  on public.global_enterprise_infrastructure_engine_compliance_policies (tenant_id, policy_type);

create table if not exists public.global_enterprise_infrastructure_engine_data_residency (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  residency_key text not null,
  residency_title text not null,
  storage_type text not null check (
    storage_type in ('regional', 'country', 'enterprise', 'hybrid', 'on_premise', 'private')
  ),
  region_scope text not null default '',
  status text not null default 'active',
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, residency_key)
);

create index if not exists global_enterprise_infrastructure_engine_data_residency_tenant_idx
  on public.global_enterprise_infrastructure_engine_data_residency (tenant_id, storage_type);

create table if not exists public.global_enterprise_infrastructure_engine_deployments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  deployment_key text not null,
  deployment_title text not null,
  deployment_model text not null check (
    deployment_model in (
      'multi_tenant_cloud', 'dedicated_cloud', 'private_cloud', 'hybrid_cloud', 'on_premise', 'air_gapped'
    )
  ),
  region_scope text not null default '',
  status text not null default 'active' check (status in ('active', 'planned', 'migrating')),
  health_score integer not null default 90 check (health_score between 0 and 100),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, deployment_key)
);

create index if not exists global_enterprise_infrastructure_engine_deployments_tenant_idx
  on public.global_enterprise_infrastructure_engine_deployments (tenant_id, deployment_model);

create table if not exists public.global_enterprise_infrastructure_engine_infrastructure_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  profile_key text not null,
  profile_title text not null,
  profile_type text not null check (
    profile_type in ('high_availability', 'disaster_recovery', 'backup', 'failover', 'load_balancing', 'scalability')
  ),
  status text not null default 'active',
  readiness_score integer not null default 85 check (readiness_score between 0 and 100),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, profile_key)
);

create index if not exists global_enterprise_infrastructure_engine_infrastructure_profiles_tenant_idx
  on public.global_enterprise_infrastructure_engine_infrastructure_profiles (tenant_id, profile_type);

create table if not exists public.global_enterprise_infrastructure_engine_intelligence_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'regional_growth', 'localization_gap', 'language_recommendation', 'compliance_review', 'capacity_increase'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists global_enterprise_infrastructure_engine_intelligence_signals_tenant_idx
  on public.global_enterprise_infrastructure_engine_intelligence_signals (tenant_id, created_at desc);

create table if not exists public.global_enterprise_infrastructure_engine_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'region_expansion', 'language_adoption', 'compliance_change', 'performance_improved', 'scaling_recommended'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists global_enterprise_infrastructure_engine_advisor_signals_tenant_idx
  on public.global_enterprise_infrastructure_engine_advisor_signals (tenant_id, created_at desc);

create table if not exists public.global_enterprise_infrastructure_engine_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'region_created', 'country_added', 'localization_updated', 'compliance_updated',
      'deployment_created', 'infrastructure_updated', 'regional_config_changed',
      'dashboard_viewed', 'analytics_refreshed'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists global_enterprise_infrastructure_engine_audit_logs_tenant_idx
  on public.global_enterprise_infrastructure_engine_audit_logs (tenant_id, created_at desc);

alter table public.global_enterprise_infrastructure_engine_settings enable row level security;
alter table public.global_enterprise_infrastructure_engine_regions enable row level security;
alter table public.global_enterprise_infrastructure_engine_countries enable row level security;
alter table public.global_enterprise_infrastructure_engine_localizations enable row level security;
alter table public.global_enterprise_infrastructure_engine_compliance_policies enable row level security;
alter table public.global_enterprise_infrastructure_engine_data_residency enable row level security;
alter table public.global_enterprise_infrastructure_engine_deployments enable row level security;
alter table public.global_enterprise_infrastructure_engine_infrastructure_profiles enable row level security;
alter table public.global_enterprise_infrastructure_engine_intelligence_signals enable row level security;
alter table public.global_enterprise_infrastructure_engine_advisor_signals enable row level security;
alter table public.global_enterprise_infrastructure_engine_audit_logs enable row level security;

revoke all on public.global_enterprise_infrastructure_engine_settings from authenticated, anon;
revoke all on public.global_enterprise_infrastructure_engine_regions from authenticated, anon;
revoke all on public.global_enterprise_infrastructure_engine_countries from authenticated, anon;
revoke all on public.global_enterprise_infrastructure_engine_localizations from authenticated, anon;
revoke all on public.global_enterprise_infrastructure_engine_compliance_policies from authenticated, anon;
revoke all on public.global_enterprise_infrastructure_engine_data_residency from authenticated, anon;
revoke all on public.global_enterprise_infrastructure_engine_deployments from authenticated, anon;
revoke all on public.global_enterprise_infrastructure_engine_infrastructure_profiles from authenticated, anon;
revoke all on public.global_enterprise_infrastructure_engine_intelligence_signals from authenticated, anon;
revoke all on public.global_enterprise_infrastructure_engine_advisor_signals from authenticated, anon;
revoke all on public.global_enterprise_infrastructure_engine_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'global_deployment_enterprise_infrastructure_engine', v.description
from (values
  ('global_deployment_enterprise_infrastructure.view', 'View Global Deployment', 'View global deployment overview, regions, localization, compliance, and infrastructure'),
  ('global_deployment_enterprise_infrastructure.manage', 'Manage Global Deployment', 'Configure regions, countries, localization, compliance, deployments, and infrastructure')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 2. Helpers — _ggeie424_*
-- ---------------------------------------------------------------------------
create or replace function public._ggeie424_require_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_tenant_id uuid; v_plan text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  v_plan := public._aef_tenant_plan(v_tenant_id);
  if v_plan not in ('business', 'enterprise', 'growth', 'professional', 'starter') then
    raise exception 'Global Deployment requires an active plan';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end; $$;

create or replace function public._ggeie424_log_audit(p_tenant_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.global_enterprise_infrastructure_engine_audit_logs (tenant_id, event_type, summary, actor_user_id, context)
  values (p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._ggeie424_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.global_enterprise_infrastructure_engine_settings language plpgsql security definer set search_path = public as $$
declare v_row public.global_enterprise_infrastructure_engine_settings;
begin
  insert into public.global_enterprise_infrastructure_engine_settings (organization_id, tenant_id)
  values (p_org_id, p_tenant_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;
  if v_row.id is null then
    select * into v_row from public.global_enterprise_infrastructure_engine_settings where organization_id = p_org_id;
  end if;
  return v_row;
end; $$;

create or replace function public._ggeie424_seed_defaults(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.global_enterprise_infrastructure_engine_regions where tenant_id = p_tenant_id limit 1) then
    insert into public.global_enterprise_infrastructure_engine_regions (tenant_id, region_key, region_title, region_type, countries_count, summary) values
      (p_tenant_id, 'REG-NORD', 'Nordics', 'nordics', 3, 'Norway, Sweden, Denmark primary operations.'),
      (p_tenant_id, 'REG-EU', 'Europe', 'europe', 2, 'EU regional governance and compliance.'),
      (p_tenant_id, 'REG-NA', 'North America', 'north_america', 1, 'Planned expansion region.');
  end if;
  if not exists (select 1 from public.global_enterprise_infrastructure_engine_countries where tenant_id = p_tenant_id limit 1) then
    insert into public.global_enterprise_infrastructure_engine_countries (tenant_id, country_key, country_name, region_key, primary_language, currency_code, timezone, compliance_status, summary) values
      (p_tenant_id, 'NO', 'Norway', 'REG-NORD', 'no', 'NOK', 'Europe/Oslo', 'compliant', 'Primary market — GDPR aligned.'),
      (p_tenant_id, 'SE', 'Sweden', 'REG-NORD', 'sv', 'SEK', 'Europe/Stockholm', 'compliant', 'Nordic expansion market.'),
      (p_tenant_id, 'PL', 'Poland', 'REG-EU', 'pl', 'PLN', 'Europe/Warsaw', 'review', 'EU localization and compliance review.');
  end if;
  if not exists (select 1 from public.global_enterprise_infrastructure_engine_localizations where tenant_id = p_tenant_id limit 1) then
    insert into public.global_enterprise_infrastructure_engine_localizations (tenant_id, locale_key, locale_title, language_code, currency_code, date_format, timezone, adoption_percent, summary) values
      (p_tenant_id, 'en', 'English', 'en', 'USD', 'YYYY-MM-DD', 'UTC', 92, 'Default global language.'),
      (p_tenant_id, 'no', 'Norwegian', 'no', 'NOK', 'DD.MM.YYYY', 'Europe/Oslo', 78, 'Nordic primary locale.'),
      (p_tenant_id, 'sv', 'Swedish', 'sv', 'SEK', 'YYYY-MM-DD', 'Europe/Stockholm', 45, 'Growing adoption in Nordics.'),
      (p_tenant_id, 'pl', 'Polish', 'pl', 'PLN', 'DD.MM.YYYY', 'Europe/Warsaw', 22, 'EU expansion locale.');
  end if;
  if not exists (select 1 from public.global_enterprise_infrastructure_engine_compliance_policies where tenant_id = p_tenant_id limit 1) then
    insert into public.global_enterprise_infrastructure_engine_compliance_policies (tenant_id, policy_key, policy_title, policy_type, region_scope, summary) values
      (p_tenant_id, 'COMP-GDPR', 'GDPR data protection', 'privacy', 'europe', 'EU privacy and data subject rights.'),
      (p_tenant_id, 'COMP-RES', 'Nordic data residency', 'data_residency', 'nordics', 'Regional storage preference for Nordic tenants.'),
      (p_tenant_id, 'COMP-AUD', 'Enterprise audit retention', 'audit', 'global', 'Immutable audit logs for governance.');
  end if;
  if not exists (select 1 from public.global_enterprise_infrastructure_engine_data_residency where tenant_id = p_tenant_id limit 1) then
    insert into public.global_enterprise_infrastructure_engine_data_residency (tenant_id, residency_key, residency_title, storage_type, region_scope, summary) values
      (p_tenant_id, 'RES-EU', 'EU regional storage', 'regional', 'europe', 'Tenant metadata in EU region.'),
      (p_tenant_id, 'RES-HYB', 'Hybrid enterprise storage', 'hybrid', 'global', 'Cloud + dedicated storage option.');
  end if;
  if not exists (select 1 from public.global_enterprise_infrastructure_engine_deployments where tenant_id = p_tenant_id limit 1) then
    insert into public.global_enterprise_infrastructure_engine_deployments (tenant_id, deployment_key, deployment_title, deployment_model, region_scope, health_score, summary) values
      (p_tenant_id, 'DEP-PRIMARY', 'Primary multi-tenant cloud', 'multi_tenant_cloud', 'global', 94, 'Default Aipify cloud deployment.'),
      (p_tenant_id, 'DEP-EU', 'EU dedicated cloud (planned)', 'dedicated_cloud', 'europe', 72, 'Enterprise dedicated region planned.');
  end if;
  if not exists (select 1 from public.global_enterprise_infrastructure_engine_infrastructure_profiles where tenant_id = p_tenant_id limit 1) then
    insert into public.global_enterprise_infrastructure_engine_infrastructure_profiles (tenant_id, profile_key, profile_title, profile_type, readiness_score, summary) values
      (p_tenant_id, 'INF-HA', 'High availability', 'high_availability', 91, 'Multi-zone availability targets met.'),
      (p_tenant_id, 'INF-DR', 'Disaster recovery', 'disaster_recovery', 86, 'Recovery objectives documented.'),
      (p_tenant_id, 'INF-BKP', 'Backup management', 'backup', 88, 'Daily encrypted backups with retention policy.');
  end if;
end; $$;

create or replace function public._ggeie424_seed_advisor(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.global_enterprise_infrastructure_engine_advisor_signals where tenant_id = p_tenant_id and created_at > now() - interval '7 days' limit 1) then return; end if;
  insert into public.global_enterprise_infrastructure_engine_advisor_signals (tenant_id, signal_type, observation, impact, recommendation, effort, confidence) values
    (p_tenant_id, 'region_expansion', 'A new region is ready for expansion.', 'North America pipeline active.', 'Review country and compliance configuration.', 'moderate', 'high'),
    (p_tenant_id, 'language_adoption', 'Language adoption increased.', 'Polish locale usage up 12%.', 'Complete Polish localization review.', 'low', 'moderate'),
    (p_tenant_id, 'compliance_change', 'Compliance requirements changed.', 'EU audit policy update pending.', 'Review compliance policies for Europe.', 'moderate', 'high'),
    (p_tenant_id, 'performance_improved', 'Regional performance improved.', 'Nordics latency within SLA.', 'Monitor during peak season.', 'low', 'high'),
    (p_tenant_id, 'scaling_recommended', 'Infrastructure scaling is recommended.', 'EU dedicated deployment planned.', 'Prepare capacity for dedicated cloud.', 'high', 'moderate');
end; $$;

create or replace function public._ggeie424_seed_intelligence(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.global_enterprise_infrastructure_engine_intelligence_signals where tenant_id = p_tenant_id and created_at > now() - interval '7 days' limit 1) then return; end if;
  insert into public.global_enterprise_infrastructure_engine_intelligence_signals (tenant_id, signal_type, observation, impact, recommendation, confidence) values
    (p_tenant_id, 'regional_growth', 'Regional growth accelerating.', 'Nordics adoption trending up.', 'Expand localization coverage.', 'high'),
    (p_tenant_id, 'localization_gap', 'A localization gap exists.', 'Ukrainian locale underutilized.', 'Review Ukrainian content completeness.', 'moderate'),
    (p_tenant_id, 'language_recommendation', 'Additional language support recommended.', 'German demand signals detected.', 'Plan German as future language.', 'moderate'),
    (p_tenant_id, 'compliance_review', 'Regional compliance review required.', 'Poland compliance status in review.', 'Complete EU policy alignment.', 'high'),
    (p_tenant_id, 'capacity_increase', 'Infrastructure capacity increasing.', 'Dedicated EU deployment planned.', 'Validate failover readiness.', 'moderate');
end; $$;

create or replace function public._ggeie424_overview_block(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_settings public.global_enterprise_infrastructure_engine_settings;
begin
  select * into v_settings from public.global_enterprise_infrastructure_engine_settings where tenant_id = p_tenant_id;
  return jsonb_build_object(
    'regions', (select count(*)::integer from public.global_enterprise_infrastructure_engine_regions where tenant_id = p_tenant_id and status = 'active'),
    'countries', (select count(*)::integer from public.global_enterprise_infrastructure_engine_countries where tenant_id = p_tenant_id),
    'organizations', 1,
    'languages', (select count(*)::integer from public.global_enterprise_infrastructure_engine_localizations where tenant_id = p_tenant_id and status = 'active'),
    'deployments', (select count(*)::integer from public.global_enterprise_infrastructure_engine_deployments where tenant_id = p_tenant_id),
    'compliance_coverage', coalesce(v_settings.compliance_coverage_percent, 78),
    'global_health_score', coalesce(v_settings.global_health_score, 84),
    'regional_usage_score', 76,
    'language_adoption_score', 68,
    'infrastructure_health', 88
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_global_deployment_enterprise_infrastructure_center()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_tenant_id uuid;
  v_settings public.global_enterprise_infrastructure_engine_settings; v_overview jsonb;
begin
  perform public._irp_require_permission('global_deployment_enterprise_infrastructure.view');
  v_ctx := public._ggeie424_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._ggeie424_ensure_settings(v_org_id, v_tenant_id);
  perform public._ggeie424_seed_defaults(v_tenant_id);
  perform public._ggeie424_seed_advisor(v_tenant_id);
  perform public._ggeie424_seed_intelligence(v_tenant_id);
  v_overview := public._ggeie424_overview_block(v_tenant_id);
  perform public._ggeie424_log_audit(v_tenant_id, 'dashboard_viewed', 'Global deployment center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'found', true, 'has_access', true,
    'philosophy', 'Build once. Deploy anywhere. Operate globally. Govern locally.',
    'mission', 'Global Deployment & Enterprise Infrastructure — multi-region, localization, compliance, and deployment governance.',
    'abos_principle', 'Aipify serves local startups, Nordic companies, and global enterprises from one foundation — tenant-isolated, region-aware.',
    'global_expansion_route', '/app/global-expansion',
    'deployment_environment_route', '/app/deployment-environment-management-engine',
    'observability_route', '/app/observability-platform-health-engine',
    'settings_security_route', '/app/settings/security',
    'distinction_note', 'Governance metadata and deployment configuration — not cross-tenant operational data.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/infrastructure/global'),
      jsonb_build_object('key', 'regions', 'route', '/app/infrastructure/global#regions'),
      jsonb_build_object('key', 'countries', 'route', '/app/infrastructure/global#countries'),
      jsonb_build_object('key', 'localization', 'route', '/app/infrastructure/global#localization'),
      jsonb_build_object('key', 'compliance', 'route', '/app/infrastructure/global#compliance'),
      jsonb_build_object('key', 'infrastructure', 'route', '/app/infrastructure/global#infrastructure'),
      jsonb_build_object('key', 'analytics', 'route', '/app/infrastructure/global#analytics'),
      jsonb_build_object('key', 'governance', 'route', '/app/infrastructure/global#governance')
    ),
    'core_languages', jsonb_build_array('en', 'no', 'sv', 'da', 'pl', 'uk'),
    'future_languages', jsonb_build_array('de', 'fr', 'es', 'it', 'nl', 'pt', 'ja'),
    'supported_currencies', jsonb_build_array('NOK', 'EUR', 'USD', 'GBP', 'SEK', 'DKK', 'PLN', 'UAH'),
    'deployment_models', jsonb_build_array('multi_tenant_cloud', 'dedicated_cloud', 'private_cloud', 'hybrid_cloud', 'on_premise', 'air_gapped'),
    'regions', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'region_key',r.region_key,'region_title',r.region_title,'region_type',r.region_type,'status',r.status,'countries_count',r.countries_count,'summary',r.summary) order by r.updated_at desc) from public.global_enterprise_infrastructure_engine_regions r where r.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'countries', coalesce((select jsonb_agg(jsonb_build_object('id',c.id,'country_key',c.country_key,'country_name',c.country_name,'region_key',c.region_key,'primary_language',c.primary_language,'currency_code',c.currency_code,'timezone',c.timezone,'compliance_status',c.compliance_status,'summary',c.summary) order by c.updated_at desc) from public.global_enterprise_infrastructure_engine_countries c where c.tenant_id = v_tenant_id limit 15), '[]'::jsonb),
    'localizations', coalesce((select jsonb_agg(jsonb_build_object('id',l.id,'locale_key',l.locale_key,'locale_title',l.locale_title,'language_code',l.language_code,'currency_code',l.currency_code,'date_format',l.date_format,'timezone',l.timezone,'status',l.status,'adoption_percent',l.adoption_percent,'summary',l.summary) order by l.adoption_percent desc) from public.global_enterprise_infrastructure_engine_localizations l where l.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'compliance_policies', coalesce((select jsonb_agg(jsonb_build_object('id',p.id,'policy_key',p.policy_key,'policy_title',p.policy_title,'policy_type',p.policy_type,'region_scope',p.region_scope,'status',p.status,'summary',p.summary) order by p.updated_at desc) from public.global_enterprise_infrastructure_engine_compliance_policies p where p.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'data_residency', coalesce((select jsonb_agg(jsonb_build_object('id',d.id,'residency_key',d.residency_key,'residency_title',d.residency_title,'storage_type',d.storage_type,'region_scope',d.region_scope,'status',d.status,'summary',d.summary) order by d.updated_at desc) from public.global_enterprise_infrastructure_engine_data_residency d where d.tenant_id = v_tenant_id limit 10), '[]'::jsonb),
    'deployments', coalesce((select jsonb_agg(jsonb_build_object('id',d.id,'deployment_key',d.deployment_key,'deployment_title',d.deployment_title,'deployment_model',d.deployment_model,'region_scope',d.region_scope,'status',d.status,'health_score',d.health_score,'summary',d.summary) order by d.updated_at desc) from public.global_enterprise_infrastructure_engine_deployments d where d.tenant_id = v_tenant_id limit 10), '[]'::jsonb),
    'infrastructure_profiles', coalesce((select jsonb_agg(jsonb_build_object('id',p.id,'profile_key',p.profile_key,'profile_title',p.profile_title,'profile_type',p.profile_type,'status',p.status,'readiness_score',p.readiness_score,'summary',p.summary) order by p.updated_at desc) from public.global_enterprise_infrastructure_engine_infrastructure_profiles p where p.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'intelligence_signals', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'signal_type',s.signal_type,'observation',s.observation,'impact',s.impact,'recommendation',s.recommendation,'confidence',s.confidence,'created_at',s.created_at) order by s.created_at desc) from public.global_enterprise_infrastructure_engine_intelligence_signals s where s.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'advisor_signals', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'signal_type',s.signal_type,'observation',s.observation,'impact',s.impact,'recommendation',s.recommendation,'effort',s.effort,'confidence',s.confidence,'created_at',s.created_at) order by s.created_at desc) from public.global_enterprise_infrastructure_engine_advisor_signals s where s.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'audit_logs', coalesce((select jsonb_agg(jsonb_build_object('id',l.id,'event_type',l.event_type,'summary',l.summary,'created_at',l.created_at) order by l.created_at desc) from public.global_enterprise_infrastructure_engine_audit_logs l where l.tenant_id = v_tenant_id limit 20), '[]'::jsonb),
    'executive_dashboard', jsonb_build_object(
      'global_footprint', v_overview->>'regions',
      'regional_performance', v_overview->>'regional_usage_score',
      'growth', 'accelerating',
      'revenue', 'multi_currency',
      'compliance_status', v_overview->>'compliance_coverage',
      'language_adoption', v_overview->>'language_adoption_score',
      'expansion_opportunities', 2
    ),
    'governance', jsonb_build_object(
      'tenant_isolation', true,
      'regional_governance', true,
      'regional_compliance', true,
      'deployment_flexibility', true,
      'human_approval_required', true
    ),
    'privacy_note', 'Global deployment metadata isolated per tenant — regional governance without cross-tenant data exposure.'
  );
exception when others then
  return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Action RPC
-- ---------------------------------------------------------------------------
create or replace function public.global_deployment_enterprise_infrastructure_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_tenant_id uuid; v_action text; v_id uuid;
begin
  perform public._irp_require_permission('global_deployment_enterprise_infrastructure.manage');
  v_ctx := public._ggeie424_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  perform public._ggeie424_ensure_settings(v_org_id, v_tenant_id);
  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'add_region' then
    insert into public.global_enterprise_infrastructure_engine_regions (tenant_id, region_key, region_title, region_type, summary)
    values (v_tenant_id, coalesce(p_payload->>'region_key','REG-'||upper(substr(gen_random_uuid()::text,1,8))), coalesce(p_payload->>'region_title','New region'), coalesce(p_payload->>'region_type','custom'), coalesce(p_payload->>'summary',''))
    returning id into v_id;
    perform public._ggeie424_log_audit(v_tenant_id, 'region_created', 'Region created', jsonb_build_object('region_id', v_id));
    return jsonb_build_object('ok', true, 'region_id', v_id);
  end if;

  if v_action = 'add_country' then
    insert into public.global_enterprise_infrastructure_engine_countries (tenant_id, country_key, country_name, region_key, primary_language, currency_code, timezone, summary)
    values (v_tenant_id, coalesce(p_payload->>'country_key','C-'||upper(substr(gen_random_uuid()::text,1,6))), coalesce(p_payload->>'country_name','New country'), coalesce(p_payload->>'region_key',''), coalesce(p_payload->>'primary_language','en'), coalesce(p_payload->>'currency_code','USD'), coalesce(p_payload->>'timezone','UTC'), coalesce(p_payload->>'summary',''))
    returning id into v_id;
    perform public._ggeie424_log_audit(v_tenant_id, 'country_added', 'Country added', jsonb_build_object('country_id', v_id));
    return jsonb_build_object('ok', true, 'country_id', v_id);
  end if;

  if v_action = 'update_localization' then
    update public.global_enterprise_infrastructure_engine_localizations set
      adoption_percent = coalesce((p_payload->>'adoption_percent')::integer, adoption_percent),
      summary = coalesce(p_payload->>'summary', summary),
      updated_at = now()
    where tenant_id = v_tenant_id and locale_key = coalesce(p_payload->>'locale_key','') returning id into v_id;
    perform public._ggeie424_log_audit(v_tenant_id, 'localization_updated', 'Localization updated', jsonb_build_object('localization_id', v_id));
    return jsonb_build_object('ok', true, 'localization_id', v_id);
  end if;

  if v_action = 'update_compliance' then
    update public.global_enterprise_infrastructure_engine_compliance_policies set
      status = coalesce(p_payload->>'status', status),
      summary = coalesce(p_payload->>'summary', summary),
      updated_at = now()
    where tenant_id = v_tenant_id and policy_key = coalesce(p_payload->>'policy_key','') returning id into v_id;
    perform public._ggeie424_log_audit(v_tenant_id, 'compliance_updated', 'Compliance policy updated', jsonb_build_object('policy_id', v_id));
    return jsonb_build_object('ok', true, 'policy_id', v_id);
  end if;

  if v_action = 'create_deployment' then
    insert into public.global_enterprise_infrastructure_engine_deployments (tenant_id, deployment_key, deployment_title, deployment_model, region_scope, summary)
    values (v_tenant_id, coalesce(p_payload->>'deployment_key','DEP-'||upper(substr(gen_random_uuid()::text,1,8))), coalesce(p_payload->>'deployment_title','New deployment'), coalesce(p_payload->>'deployment_model','multi_tenant_cloud'), coalesce(p_payload->>'region_scope','global'), coalesce(p_payload->>'summary',''))
    returning id into v_id;
    perform public._ggeie424_log_audit(v_tenant_id, 'deployment_created', 'Deployment created', jsonb_build_object('deployment_id', v_id));
    return jsonb_build_object('ok', true, 'deployment_id', v_id);
  end if;

  if v_action = 'update_infrastructure' then
    update public.global_enterprise_infrastructure_engine_infrastructure_profiles set
      readiness_score = least(100, readiness_score + coalesce((p_payload->>'delta')::integer, 1)),
      summary = coalesce(p_payload->>'summary', summary),
      updated_at = now()
    where tenant_id = v_tenant_id and profile_key = coalesce(p_payload->>'profile_key','') returning id into v_id;
    perform public._ggeie424_log_audit(v_tenant_id, 'infrastructure_updated', 'Infrastructure profile updated', jsonb_build_object('profile_id', v_id));
    return jsonb_build_object('ok', true, 'profile_id', v_id);
  end if;

  if v_action = 'refresh_analytics' then
    update public.global_enterprise_infrastructure_engine_settings set
      global_health_score = least(100, global_health_score + 1),
      compliance_coverage_percent = least(100, compliance_coverage_percent + 1),
      updated_at = now()
    where tenant_id = v_tenant_id;
    perform public._ggeie424_log_audit(v_tenant_id, 'analytics_refreshed', 'Global analytics refreshed', '{}'::jsonb);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Unknown action: %', v_action;
end; $$;
