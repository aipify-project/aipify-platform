-- Phase 428 — Enterprise Innovation, R&D & Future Technologies Engine Foundation
-- Feature owner: CUSTOMER APP. Route: /app/innovation. Helpers: _geirft428_*

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.enterprise_innovation_rd_future_engine_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  innovation_health_score integer not null default 78 check (innovation_health_score between 0 and 100),
  innovation_velocity integer not null default 72 check (innovation_velocity between 0 and 100),
  validation_rate_percent numeric(5,2) not null default 64.00 check (validation_rate_percent between 0 and 100),
  innovation_score integer not null default 76 check (innovation_score between 0 and 100),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enterprise_innovation_rd_future_engine_ideas (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  idea_key text not null,
  idea_title text not null,
  source_type text not null check (
    source_type in (
      'employee', 'customer', 'partner', 'executive', 'companion',
      'market_opportunity', 'innovation_request'
    )
  ),
  lifecycle_stage text not null default 'submitted' check (
    lifecycle_stage in (
      'submitted', 'review', 'research', 'experiment', 'validation',
      'approval', 'implementation', 'measurement'
    )
  ),
  business_value integer not null default 70 check (business_value between 0 and 100),
  strategic_alignment integer not null default 75 check (strategic_alignment between 0 and 100),
  implementation_complexity integer not null default 55 check (implementation_complexity between 0 and 100),
  customer_impact integer not null default 68 check (customer_impact between 0 and 100),
  revenue_potential integer not null default 62 check (revenue_potential between 0 and 100),
  risk_level text not null default 'moderate' check (risk_level in ('low', 'moderate', 'high', 'critical')),
  innovation_score integer not null default 72 check (innovation_score between 0 and 100),
  owner_name text not null default '',
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, idea_key)
);

create index if not exists enterprise_innovation_rd_future_engine_ideas_tenant_idx
  on public.enterprise_innovation_rd_future_engine_ideas (tenant_id, lifecycle_stage);

create table if not exists public.enterprise_innovation_rd_future_engine_research_projects (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  project_key text not null,
  project_title text not null,
  project_type text not null check (
    project_type in (
      'research_project', 'technology_review', 'future_capability',
      'industry_research', 'competitive_research', 'innovation_program'
    )
  ),
  status text not null default 'active' check (status in ('planned', 'active', 'paused', 'completed', 'archived')),
  pipeline_stage text not null default 'research' check (
    pipeline_stage in ('discovery', 'research', 'validation', 'pilot', 'launch', 'growth', 'scale')
  ),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, project_key)
);

create index if not exists enterprise_innovation_rd_future_engine_research_tenant_idx
  on public.enterprise_innovation_rd_future_engine_research_projects (tenant_id, project_type);

create table if not exists public.enterprise_innovation_rd_future_engine_experiments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  experiment_key text not null,
  experiment_title text not null,
  experiment_type text not null check (
    experiment_type in (
      'product', 'workflow', 'feature', 'pricing', 'customer', 'operational'
    )
  ),
  status text not null default 'planned' check (
    status in ('planned', 'approved', 'running', 'paused', 'completed', 'validated', 'rejected', 'archived')
  ),
  pipeline_stage text not null default 'validation' check (
    pipeline_stage in ('discovery', 'research', 'validation', 'pilot', 'launch', 'growth', 'scale')
  ),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, experiment_key)
);

create index if not exists enterprise_innovation_rd_future_engine_experiments_tenant_idx
  on public.enterprise_innovation_rd_future_engine_experiments (tenant_id, status);

create table if not exists public.enterprise_innovation_rd_future_engine_technology_radar (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  radar_key text not null,
  radar_title text not null,
  radar_category text not null check (
    radar_category in (
      'emerging_technology', 'ai_development', 'industry_trend',
      'infrastructure_trend', 'security_trend', 'platform_opportunity'
    )
  ),
  maturity text not null default 'assess' check (maturity in ('adopt', 'trial', 'assess', 'hold')),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, radar_key)
);

create index if not exists enterprise_innovation_rd_future_engine_radar_tenant_idx
  on public.enterprise_innovation_rd_future_engine_technology_radar (tenant_id, radar_category);

create table if not exists public.enterprise_innovation_rd_future_engine_opportunities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  opportunity_key text not null,
  opportunity_title text not null,
  opportunity_type text not null check (
    opportunity_type in (
      'new_market', 'business_pack', 'industry_pack', 'integration',
      'new_product', 'revenue_stream', 'strategic_opportunity'
    )
  ),
  priority text not null default 'moderate' check (priority in ('low', 'moderate', 'high', 'critical')),
  pipeline_stage text not null default 'discovery' check (
    pipeline_stage in ('discovery', 'research', 'validation', 'pilot', 'launch', 'growth', 'scale')
  ),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, opportunity_key)
);

create index if not exists enterprise_innovation_rd_future_engine_opportunities_tenant_idx
  on public.enterprise_innovation_rd_future_engine_opportunities (tenant_id, opportunity_type);

create table if not exists public.enterprise_innovation_rd_future_engine_competitive_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  signal_title text not null,
  signal_type text not null check (
    signal_type in (
      'industry_leader', 'market_movement', 'technology_shift',
      'platform_trend', 'customer_expectation', 'competitive_signal'
    )
  ),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, signal_key)
);

create index if not exists enterprise_innovation_rd_future_engine_competitive_tenant_idx
  on public.enterprise_innovation_rd_future_engine_competitive_signals (tenant_id, signal_type);

create table if not exists public.enterprise_innovation_rd_future_engine_intelligence_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'market_opportunity', 'technology_trend', 'customer_feature_request',
      'business_pack_opportunity', 'experiment_success'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists enterprise_innovation_rd_future_engine_intelligence_tenant_idx
  on public.enterprise_innovation_rd_future_engine_intelligence_signals (tenant_id, created_at desc);

create table if not exists public.enterprise_innovation_rd_future_engine_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'idea_review', 'technology_trend', 'experiment_expand',
      'market_opportunity', 'initiative_success'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists enterprise_innovation_rd_future_engine_advisor_tenant_idx
  on public.enterprise_innovation_rd_future_engine_advisor_signals (tenant_id, created_at desc);

create table if not exists public.enterprise_innovation_rd_future_engine_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'idea_submitted', 'idea_approved', 'research_project_created',
      'experiment_started', 'experiment_completed', 'technology_reviewed',
      'opportunity_added', 'innovation_initiative_approved',
      'dashboard_viewed', 'analytics_refreshed'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists enterprise_innovation_rd_future_engine_audit_logs_tenant_idx
  on public.enterprise_innovation_rd_future_engine_audit_logs (tenant_id, created_at desc);

alter table public.enterprise_innovation_rd_future_engine_settings enable row level security;
alter table public.enterprise_innovation_rd_future_engine_ideas enable row level security;
alter table public.enterprise_innovation_rd_future_engine_research_projects enable row level security;
alter table public.enterprise_innovation_rd_future_engine_experiments enable row level security;
alter table public.enterprise_innovation_rd_future_engine_technology_radar enable row level security;
alter table public.enterprise_innovation_rd_future_engine_opportunities enable row level security;
alter table public.enterprise_innovation_rd_future_engine_competitive_signals enable row level security;
alter table public.enterprise_innovation_rd_future_engine_intelligence_signals enable row level security;
alter table public.enterprise_innovation_rd_future_engine_advisor_signals enable row level security;
alter table public.enterprise_innovation_rd_future_engine_audit_logs enable row level security;

revoke all on public.enterprise_innovation_rd_future_engine_settings from authenticated, anon;
revoke all on public.enterprise_innovation_rd_future_engine_ideas from authenticated, anon;
revoke all on public.enterprise_innovation_rd_future_engine_research_projects from authenticated, anon;
revoke all on public.enterprise_innovation_rd_future_engine_experiments from authenticated, anon;
revoke all on public.enterprise_innovation_rd_future_engine_technology_radar from authenticated, anon;
revoke all on public.enterprise_innovation_rd_future_engine_opportunities from authenticated, anon;
revoke all on public.enterprise_innovation_rd_future_engine_competitive_signals from authenticated, anon;
revoke all on public.enterprise_innovation_rd_future_engine_intelligence_signals from authenticated, anon;
revoke all on public.enterprise_innovation_rd_future_engine_advisor_signals from authenticated, anon;
revoke all on public.enterprise_innovation_rd_future_engine_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'enterprise_innovation_rd_future_engine', v.description
from (values
  ('enterprise_innovation_rd_future.view', 'View Innovation Center', 'View ideas, experiments, R&D, technology radar, and opportunity portfolio'),
  ('enterprise_innovation_rd_future.manage', 'Manage Innovation Center', 'Submit ideas, run experiments, review technologies, and approve innovation initiatives')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 2. Helpers — _geirft428_*
-- ---------------------------------------------------------------------------
create or replace function public._geirft428_require_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_tenant_id uuid; v_plan text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  v_plan := public._aef_tenant_plan(v_tenant_id);
  if v_plan not in ('business', 'enterprise', 'growth', 'professional', 'starter') then
    raise exception 'Innovation Center requires an active plan';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end; $$;

create or replace function public._geirft428_log_audit(p_tenant_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.enterprise_innovation_rd_future_engine_audit_logs (tenant_id, event_type, summary, actor_user_id, context)
  values (p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._geirft428_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.enterprise_innovation_rd_future_engine_settings language plpgsql security definer set search_path = public as $$
declare v_row public.enterprise_innovation_rd_future_engine_settings;
begin
  insert into public.enterprise_innovation_rd_future_engine_settings (organization_id, tenant_id)
  values (p_org_id, p_tenant_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;
  if v_row.id is null then
    select * into v_row from public.enterprise_innovation_rd_future_engine_settings where organization_id = p_org_id;
  end if;
  return v_row;
end; $$;

create or replace function public._geirft428_seed_defaults(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.enterprise_innovation_rd_future_engine_ideas where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_innovation_rd_future_engine_ideas (tenant_id, idea_key, idea_title, source_type, lifecycle_stage, business_value, strategic_alignment, innovation_score, owner_name, summary) values
      (p_tenant_id, 'IDEA-001', 'AI-assisted onboarding workflow', 'employee', 'review', 82, 88, 79, 'Product team', 'Reduce time-to-value for new customers through guided onboarding.'),
      (p_tenant_id, 'IDEA-002', 'Industry pack expansion — healthcare', 'executive', 'research', 90, 92, 86, 'Strategy', 'Healthcare vertical shows strong demand signals.'),
      (p_tenant_id, 'IDEA-003', 'Companion proactive briefing enhancement', 'companion', 'experiment', 75, 80, 74, 'Innovation lab', 'Test richer executive briefing formats.');
  end if;
  if not exists (select 1 from public.enterprise_innovation_rd_future_engine_research_projects where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_innovation_rd_future_engine_research_projects (tenant_id, project_key, project_title, project_type, status, pipeline_stage, summary) values
      (p_tenant_id, 'RD-001', 'Multi-agent orchestration patterns', 'future_capability', 'active', 'research', 'Evaluate orchestration for enterprise workflows.'),
      (p_tenant_id, 'RD-002', 'Competitive platform landscape Q2', 'competitive_research', 'active', 'discovery', 'Quarterly competitive intelligence review.'),
      (p_tenant_id, 'RD-003', 'Edge deployment feasibility study', 'technology_review', 'planned', 'research', 'Assess edge runtime for customer installs.');
  end if;
  if not exists (select 1 from public.enterprise_innovation_rd_future_engine_experiments where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_innovation_rd_future_engine_experiments (tenant_id, experiment_key, experiment_title, experiment_type, status, pipeline_stage, summary) values
      (p_tenant_id, 'EXP-001', 'Pricing tier simplification', 'pricing', 'running', 'validation', 'Test consolidated pricing presentation.'),
      (p_tenant_id, 'EXP-002', 'Workflow automation pilot', 'workflow', 'approved', 'pilot', 'Pilot automation in support operations.'),
      (p_tenant_id, 'EXP-003', 'Feature flag: executive insights v2', 'feature', 'completed', 'validation', 'Completed with positive validation signals.');
  end if;
  if not exists (select 1 from public.enterprise_innovation_rd_future_engine_technology_radar where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_innovation_rd_future_engine_technology_radar (tenant_id, radar_key, radar_title, radar_category, maturity, summary) values
      (p_tenant_id, 'RAD-AI', 'Agentic workflow platforms', 'ai_development', 'trial', 'Emerging agent frameworks for enterprise orchestration.'),
      (p_tenant_id, 'RAD-SEC', 'Post-quantum cryptography readiness', 'security_trend', 'assess', 'Evaluate long-term security posture requirements.'),
      (p_tenant_id, 'RAD-PLAT', 'Unified API gateway patterns', 'platform_opportunity', 'adopt', 'Consolidate integration surfaces for Business Packs.');
  end if;
  if not exists (select 1 from public.enterprise_innovation_rd_future_engine_opportunities where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_innovation_rd_future_engine_opportunities (tenant_id, opportunity_key, opportunity_title, opportunity_type, priority, pipeline_stage, summary) values
      (p_tenant_id, 'OPP-001', 'Nordic enterprise expansion', 'new_market', 'high', 'research', 'Enterprise demand in Nordic markets.'),
      (p_tenant_id, 'OPP-002', 'Hospitality Business Pack v2', 'business_pack', 'moderate', 'validation', 'Enhanced pack for accommodation operators.'),
      (p_tenant_id, 'OPP-003', 'Shopify deep integration', 'integration', 'high', 'pilot', 'Native commerce workflow integration.');
  end if;
  if not exists (select 1 from public.enterprise_innovation_rd_future_engine_competitive_signals where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_innovation_rd_future_engine_competitive_signals (tenant_id, signal_key, signal_title, signal_type, summary) values
      (p_tenant_id, 'COMP-001', 'Platform consolidation trend', 'platform_trend', 'Competitors bundling AI into existing suites.'),
      (p_tenant_id, 'COMP-002', 'Customer expectation: install-first', 'customer_expectation', 'Buyers prefer embedded operational AI over admin panels.'),
      (p_tenant_id, 'COMP-003', 'AI governance standards emerging', 'technology_shift', 'Enterprise procurement requiring explainability.');
  end if;
end; $$;

create or replace function public._geirft428_seed_advisor(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.enterprise_innovation_rd_future_engine_advisor_signals where tenant_id = p_tenant_id and created_at > now() - interval '7 days' limit 1) then return; end if;
  insert into public.enterprise_innovation_rd_future_engine_advisor_signals (tenant_id, signal_type, observation, impact, recommendation, effort, confidence) values
    (p_tenant_id, 'idea_review', 'A promising idea requires review.', 'Healthcare pack idea scored 86 on innovation index.', 'Schedule executive review this week.', 'low', 'high'),
    (p_tenant_id, 'technology_trend', 'A technology trend is emerging.', 'Agentic orchestration moving to trial on radar.', 'Assign R&D owner for evaluation sprint.', 'moderate', 'high'),
    (p_tenant_id, 'experiment_expand', 'An experiment should be expanded.', 'Pricing experiment showing positive validation.', 'Extend pilot to two additional segments.', 'moderate', 'moderate'),
    (p_tenant_id, 'market_opportunity', 'A market opportunity is available.', 'Nordic enterprise expansion flagged high priority.', 'Prepare opportunity brief for leadership.', 'low', 'high'),
    (p_tenant_id, 'initiative_success', 'An innovation initiative achieved success.', 'Feature experiment completed with strong outcomes.', 'Document learnings and scale decision.', 'low', 'high');
end; $$;

create or replace function public._geirft428_seed_intelligence(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.enterprise_innovation_rd_future_engine_intelligence_signals where tenant_id = p_tenant_id and created_at > now() - interval '7 days' limit 1) then return; end if;
  insert into public.enterprise_innovation_rd_future_engine_intelligence_signals (tenant_id, signal_type, observation, impact, recommendation, confidence) values
    (p_tenant_id, 'market_opportunity', 'A new market opportunity emerged.', 'Nordic enterprise segment showing demand.', 'Prioritize research sprint.', 'high'),
    (p_tenant_id, 'technology_trend', 'A technology trend requires evaluation.', 'Post-quantum readiness on radar.', 'Schedule security architecture review.', 'moderate'),
    (p_tenant_id, 'customer_feature_request', 'A customer request suggests a new feature.', 'Multiple requests for deeper Shopify sync.', 'Link to integration opportunity OPP-003.', 'high'),
    (p_tenant_id, 'business_pack_opportunity', 'A business pack opportunity was identified.', 'Hospitality pack v2 in validation.', 'Align with industry pack roadmap.', 'moderate'),
    (p_tenant_id, 'experiment_success', 'An experiment exceeded expectations.', 'Executive insights v2 validated positively.', 'Prepare scale recommendation.', 'high');
end; $$;

create or replace function public._geirft428_overview_block(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_settings public.enterprise_innovation_rd_future_engine_settings;
begin
  select * into v_settings from public.enterprise_innovation_rd_future_engine_settings where tenant_id = p_tenant_id;
  return jsonb_build_object(
    'ideas_count', (select count(*)::integer from public.enterprise_innovation_rd_future_engine_ideas where tenant_id = p_tenant_id),
    'experiments_count', (select count(*)::integer from public.enterprise_innovation_rd_future_engine_experiments where tenant_id = p_tenant_id),
    'research_projects_count', (select count(*)::integer from public.enterprise_innovation_rd_future_engine_research_projects where tenant_id = p_tenant_id),
    'technology_reviews_count', (select count(*)::integer from public.enterprise_innovation_rd_future_engine_technology_radar where tenant_id = p_tenant_id),
    'opportunities_count', (select count(*)::integer from public.enterprise_innovation_rd_future_engine_opportunities where tenant_id = p_tenant_id),
    'ideas_approved', (select count(*)::integer from public.enterprise_innovation_rd_future_engine_ideas where tenant_id = p_tenant_id and lifecycle_stage in ('approval', 'implementation', 'measurement')),
    'experiments_running', (select count(*)::integer from public.enterprise_innovation_rd_future_engine_experiments where tenant_id = p_tenant_id and status = 'running'),
    'innovation_health_score', coalesce(v_settings.innovation_health_score, 78),
    'innovation_velocity', coalesce(v_settings.innovation_velocity, 72),
    'validation_rate', coalesce(v_settings.validation_rate_percent, 64.00),
    'innovation_score', coalesce(v_settings.innovation_score, 76)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_enterprise_innovation_rd_future_center()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_tenant_id uuid;
  v_settings public.enterprise_innovation_rd_future_engine_settings; v_overview jsonb;
begin
  perform public._irp_require_permission('enterprise_innovation_rd_future.view');
  v_ctx := public._geirft428_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._geirft428_ensure_settings(v_org_id, v_tenant_id);
  perform public._geirft428_seed_defaults(v_tenant_id);
  perform public._geirft428_seed_advisor(v_tenant_id);
  perform public._geirft428_seed_intelligence(v_tenant_id);
  v_overview := public._geirft428_overview_block(v_tenant_id);
  perform public._geirft428_log_audit(v_tenant_id, 'dashboard_viewed', 'Innovation center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'found', true, 'has_access', true,
    'philosophy', 'Innovation should not depend on luck. Innovation should become a repeatable process.',
    'mission', 'Enterprise Innovation, R&D & Future Technologies Engine — ideas, experiments, research, technology radar, and strategic opportunity portfolios.',
    'abos_principle', 'The future belongs to organizations that continuously learn, improve, and innovate. Aipify helps make innovation systematic rather than accidental.',
    'innovation_lab_route', '/app/innovation-lab',
    'distinction_note', 'Innovation metadata and portfolio signals — tenant-scoped governance without cross-tenant pipeline exposure.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/innovation'),
      jsonb_build_object('key', 'ideas', 'route', '/app/innovation#ideas'),
      jsonb_build_object('key', 'research', 'route', '/app/innovation#research'),
      jsonb_build_object('key', 'experiments', 'route', '/app/innovation#experiments'),
      jsonb_build_object('key', 'technology_radar', 'route', '/app/innovation#technology-radar'),
      jsonb_build_object('key', 'opportunities', 'route', '/app/innovation#opportunities'),
      jsonb_build_object('key', 'analytics', 'route', '/app/innovation#analytics'),
      jsonb_build_object('key', 'governance', 'route', '/app/innovation#governance')
    ),
    'core_languages', jsonb_build_array('en', 'no', 'sv', 'da', 'pl', 'uk'),
    'ideas', coalesce((select jsonb_agg(jsonb_build_object('id',i.id,'idea_key',i.idea_key,'idea_title',i.idea_title,'source_type',i.source_type,'lifecycle_stage',i.lifecycle_stage,'business_value',i.business_value,'strategic_alignment',i.strategic_alignment,'implementation_complexity',i.implementation_complexity,'customer_impact',i.customer_impact,'revenue_potential',i.revenue_potential,'risk_level',i.risk_level,'innovation_score',i.innovation_score,'owner_name',i.owner_name,'summary',i.summary) order by i.innovation_score desc) from public.enterprise_innovation_rd_future_engine_ideas i where i.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'research_projects', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'project_key',r.project_key,'project_title',r.project_title,'project_type',r.project_type,'status',r.status,'pipeline_stage',r.pipeline_stage,'summary',r.summary) order by r.updated_at desc) from public.enterprise_innovation_rd_future_engine_research_projects r where r.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'experiments', coalesce((select jsonb_agg(jsonb_build_object('id',e.id,'experiment_key',e.experiment_key,'experiment_title',e.experiment_title,'experiment_type',e.experiment_type,'status',e.status,'pipeline_stage',e.pipeline_stage,'summary',e.summary) order by e.updated_at desc) from public.enterprise_innovation_rd_future_engine_experiments e where e.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'technology_radar', coalesce((select jsonb_agg(jsonb_build_object('id',t.id,'radar_key',t.radar_key,'radar_title',t.radar_title,'radar_category',t.radar_category,'maturity',t.maturity,'summary',t.summary) order by t.updated_at desc) from public.enterprise_innovation_rd_future_engine_technology_radar t where t.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'opportunities', coalesce((select jsonb_agg(jsonb_build_object('id',o.id,'opportunity_key',o.opportunity_key,'opportunity_title',o.opportunity_title,'opportunity_type',o.opportunity_type,'priority',o.priority,'pipeline_stage',o.pipeline_stage,'summary',o.summary) order by o.updated_at desc) from public.enterprise_innovation_rd_future_engine_opportunities o where o.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'competitive_signals', coalesce((select jsonb_agg(jsonb_build_object('id',c.id,'signal_key',c.signal_key,'signal_title',c.signal_title,'signal_type',c.signal_type,'summary',c.summary) order by c.updated_at desc) from public.enterprise_innovation_rd_future_engine_competitive_signals c where c.tenant_id = v_tenant_id limit 10), '[]'::jsonb),
    'intelligence_signals', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'signal_type',s.signal_type,'observation',s.observation,'impact',s.impact,'recommendation',s.recommendation,'confidence',s.confidence,'created_at',s.created_at) order by s.created_at desc) from public.enterprise_innovation_rd_future_engine_intelligence_signals s where s.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'advisor_signals', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'signal_type',s.signal_type,'observation',s.observation,'impact',s.impact,'recommendation',s.recommendation,'effort',s.effort,'confidence',s.confidence,'created_at',s.created_at) order by s.created_at desc) from public.enterprise_innovation_rd_future_engine_advisor_signals s where s.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'audit_logs', coalesce((select jsonb_agg(jsonb_build_object('id',l.id,'event_type',l.event_type,'summary',l.summary,'created_at',l.created_at) order by l.created_at desc) from public.enterprise_innovation_rd_future_engine_audit_logs l where l.tenant_id = v_tenant_id limit 20), '[]'::jsonb),
    'executive_dashboard', jsonb_build_object(
      'innovation_pipeline', v_overview->>'ideas_count',
      'future_opportunities', v_overview->>'opportunities_count',
      'research_programs', v_overview->>'research_projects_count',
      'technology_trends', v_overview->>'technology_reviews_count',
      'experiment_outcomes', v_overview->>'experiments_count',
      'innovation_roi', 142,
      'strategic_opportunities', v_overview->>'opportunities_count'
    ),
    'governance', jsonb_build_object(
      'ownership_required', true,
      'experiment_approval', true,
      'measurable_results', true,
      'strategic_alignment', true,
      'audit_trail', true,
      'tenant_isolation', true
    ),
    'privacy_note', 'Innovation portfolios isolated per organization — independent pipelines without cross-tenant exposure.'
  );
exception when others then
  return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Action RPC
-- ---------------------------------------------------------------------------
create or replace function public.enterprise_innovation_rd_future_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_tenant_id uuid; v_action text; v_id uuid;
begin
  perform public._irp_require_permission('enterprise_innovation_rd_future.manage');
  v_ctx := public._geirft428_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  perform public._geirft428_ensure_settings(v_org_id, v_tenant_id);
  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'submit_idea' then
    insert into public.enterprise_innovation_rd_future_engine_ideas (tenant_id, idea_key, idea_title, source_type, lifecycle_stage, owner_name, summary, innovation_score)
    values (v_tenant_id, coalesce(p_payload->>'idea_key','IDEA-'||upper(substr(gen_random_uuid()::text,1,8))), coalesce(p_payload->>'idea_title','New idea'), coalesce(p_payload->>'source_type','employee'), 'submitted', coalesce(p_payload->>'owner_name',''), coalesce(p_payload->>'summary',''), coalesce((p_payload->>'innovation_score')::integer, 70))
    returning id into v_id;
    update public.enterprise_innovation_rd_future_engine_settings set innovation_health_score = least(100, innovation_health_score + 1), updated_at = now() where tenant_id = v_tenant_id;
    perform public._geirft428_log_audit(v_tenant_id, 'idea_submitted', 'Idea submitted', jsonb_build_object('idea_id', v_id));
    return jsonb_build_object('ok', true, 'idea_id', v_id);
  end if;

  if v_action = 'approve_idea' then
    update public.enterprise_innovation_rd_future_engine_ideas set lifecycle_stage = 'approval', updated_at = now()
    where tenant_id = v_tenant_id and idea_key = coalesce(p_payload->>'idea_key', 'IDEA-001') returning id into v_id;
    perform public._geirft428_log_audit(v_tenant_id, 'idea_approved', 'Idea approved', jsonb_build_object('idea_id', v_id));
    return jsonb_build_object('ok', true, 'idea_id', v_id);
  end if;

  if v_action = 'create_research_project' then
    insert into public.enterprise_innovation_rd_future_engine_research_projects (tenant_id, project_key, project_title, project_type, status, pipeline_stage, summary)
    values (v_tenant_id, coalesce(p_payload->>'project_key','RD-'||upper(substr(gen_random_uuid()::text,1,8))), coalesce(p_payload->>'project_title','Research project'), coalesce(p_payload->>'project_type','research_project'), 'active', coalesce(p_payload->>'pipeline_stage','research'), coalesce(p_payload->>'summary',''))
    returning id into v_id;
    perform public._geirft428_log_audit(v_tenant_id, 'research_project_created', 'Research project created', jsonb_build_object('project_id', v_id));
    return jsonb_build_object('ok', true, 'project_id', v_id);
  end if;

  if v_action = 'start_experiment' then
    insert into public.enterprise_innovation_rd_future_engine_experiments (tenant_id, experiment_key, experiment_title, experiment_type, status, pipeline_stage, summary)
    values (v_tenant_id, coalesce(p_payload->>'experiment_key','EXP-'||upper(substr(gen_random_uuid()::text,1,8))), coalesce(p_payload->>'experiment_title','Experiment'), coalesce(p_payload->>'experiment_type','product'), 'running', coalesce(p_payload->>'pipeline_stage','validation'), coalesce(p_payload->>'summary',''))
    returning id into v_id;
    update public.enterprise_innovation_rd_future_engine_settings set innovation_velocity = least(100, innovation_velocity + 1), updated_at = now() where tenant_id = v_tenant_id;
    perform public._geirft428_log_audit(v_tenant_id, 'experiment_started', 'Experiment started', jsonb_build_object('experiment_id', v_id));
    return jsonb_build_object('ok', true, 'experiment_id', v_id);
  end if;

  if v_action = 'complete_experiment' then
    update public.enterprise_innovation_rd_future_engine_experiments set status = 'completed', updated_at = now()
    where tenant_id = v_tenant_id and experiment_key = coalesce(p_payload->>'experiment_key', 'EXP-003') returning id into v_id;
    perform public._geirft428_log_audit(v_tenant_id, 'experiment_completed', 'Experiment completed', jsonb_build_object('experiment_id', v_id));
    return jsonb_build_object('ok', true, 'experiment_id', v_id);
  end if;

  if v_action = 'review_technology' then
    insert into public.enterprise_innovation_rd_future_engine_technology_radar (tenant_id, radar_key, radar_title, radar_category, maturity, summary)
    values (v_tenant_id, coalesce(p_payload->>'radar_key','RAD-'||upper(substr(gen_random_uuid()::text,1,8))), coalesce(p_payload->>'radar_title','Technology review'), coalesce(p_payload->>'radar_category','emerging_technology'), coalesce(p_payload->>'maturity','assess'), coalesce(p_payload->>'summary',''))
    returning id into v_id;
    perform public._geirft428_log_audit(v_tenant_id, 'technology_reviewed', 'Technology reviewed', jsonb_build_object('radar_id', v_id));
    return jsonb_build_object('ok', true, 'radar_id', v_id);
  end if;

  if v_action = 'add_opportunity' then
    insert into public.enterprise_innovation_rd_future_engine_opportunities (tenant_id, opportunity_key, opportunity_title, opportunity_type, priority, pipeline_stage, summary)
    values (v_tenant_id, coalesce(p_payload->>'opportunity_key','OPP-'||upper(substr(gen_random_uuid()::text,1,8))), coalesce(p_payload->>'opportunity_title','Opportunity'), coalesce(p_payload->>'opportunity_type','strategic_opportunity'), coalesce(p_payload->>'priority','moderate'), coalesce(p_payload->>'pipeline_stage','discovery'), coalesce(p_payload->>'summary',''))
    returning id into v_id;
    perform public._geirft428_log_audit(v_tenant_id, 'opportunity_added', 'Opportunity added', jsonb_build_object('opportunity_id', v_id));
    return jsonb_build_object('ok', true, 'opportunity_id', v_id);
  end if;

  if v_action = 'approve_innovation_initiative' then
    perform public._geirft428_log_audit(v_tenant_id, 'innovation_initiative_approved', 'Innovation initiative approved', jsonb_build_object('initiative_key', p_payload->>'initiative_key'));
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'refresh_analytics' then
    update public.enterprise_innovation_rd_future_engine_settings set
      innovation_health_score = least(100, innovation_health_score + 1),
      innovation_velocity = least(100, innovation_velocity + 1),
      validation_rate_percent = least(100, validation_rate_percent + 1),
      innovation_score = least(100, innovation_score + 1),
      updated_at = now()
    where tenant_id = v_tenant_id;
    perform public._geirft428_log_audit(v_tenant_id, 'analytics_refreshed', 'Innovation analytics refreshed', '{}'::jsonb);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Unknown action: %', v_action;
end; $$;
