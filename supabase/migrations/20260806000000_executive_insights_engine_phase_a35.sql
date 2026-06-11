-- Phase A.35 — Executive Insights Engine
-- Tenant-aware executive reporting — metadata only, explainable insights, action-oriented summaries.

alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community',
    'marketplace_governance', 'partner_certification', 'enterprise_deployment',
    'billing_commercial', 'academy_learning', 'global_localization',
    'innovation_experimentation', 'future_technologies', 'aipify_constitution',
    'aipify_manifesto', 'platform_install', 'commerce_intelligence',
    'product_automation', 'dropshipping_operations', 'commerce_performance',
    'multi_store_orchestration', 'aipify_core_platform', 'multi_tenant_architecture',
    'identity_permissions', 'secure_ai_action', 'audit_accountability',
    'knowledge_center_engine', 'admin_assistant_engine', 'support_ai_engine',
    'integration_engine', 'operations_dashboard_engine', 'customer_onboarding_engine',
    'subscription_plan_management_engine', 'aipify_self_support_engine',
    'quality_guardian_engine', 'notification_communication_engine',
    'governance_policy_engine', 'unonight_pilot_operations_engine',
    'analytics_insights_engine', 'deployment_environment_management_engine',
    'observability_platform_health_engine', 'aipify_install_engine',
    'module_marketplace_foundation_engine', 'aipify_internal_operations_engine',
    'launch_readiness_engine', 'customer_success_engine',
    'aipify_status_transparency_engine', 'enterprise_readiness_engine',
    'executive_insights_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. executive_reports
-- ---------------------------------------------------------------------------
create table if not exists public.executive_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  reporting_period text not null check (
    reporting_period in ('daily', 'weekly', 'monthly', 'quarterly')
  ),
  summary text not null,
  key_highlights jsonb not null default '[]'::jsonb,
  risks jsonb not null default '[]'::jsonb,
  opportunities jsonb not null default '[]'::jsonb,
  recommended_actions jsonb not null default '[]'::jsonb,
  source_modules jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists executive_reports_org_idx
  on public.executive_reports (organization_id, reporting_period, created_at desc);

alter table public.executive_reports enable row level security;
revoke all on public.executive_reports from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. executive_report_schedules
-- ---------------------------------------------------------------------------
create table if not exists public.executive_report_schedules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  reporting_period text not null check (
    reporting_period in ('daily', 'weekly', 'monthly', 'quarterly')
  ),
  enabled boolean not null default false,
  delivery_channels jsonb not null default '["dashboard"]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, reporting_period)
);

alter table public.executive_report_schedules enable row level security;
revoke all on public.executive_report_schedules from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. executive_insights_settings
-- ---------------------------------------------------------------------------
create table if not exists public.executive_insights_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  enabled_sources jsonb not null default '[
    "analytics","operations","customer_success","strategic_intelligence",
    "quality_guardian","governance","security","support_ai"
  ]'::jsonb,
  focus_areas jsonb not null default '["health","risks","opportunities","customer_trends"]'::jsonb,
  email_delivery_scaffold boolean not null default false,
  proactivity_level text not null default 'balanced' check (
    proactivity_level in ('conservative', 'balanced', 'proactive')
  ),
  presentation_style text not null default 'executive_summary' check (
    presentation_style in ('executive_summary', 'detailed', 'action_first')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.executive_insights_settings enable row level security;
revoke all on public.executive_insights_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'executive_insights', v.description
from (values
  ('executive.view', 'View Executive Insights', 'Access executive insights dashboards and reports'),
  ('executive.export', 'Export Executive Reports', 'Export metadata-only executive summary reports'),
  ('executive.schedule', 'Schedule Executive Reports', 'Configure executive report delivery schedules')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'executive.view'), ('owner', 'executive.export'), ('owner', 'executive.schedule'),
  ('administrator', 'executive.view'), ('administrator', 'executive.export'), ('administrator', 'executive.schedule'),
  ('manager', 'executive.view'), ('manager', 'executive.export'),
  ('viewer', 'executive.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 5. Helpers (_eie_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._eie_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'executive_insights',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._eie_health_status(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'excellent'
    when p_score >= 75 then 'healthy'
    when p_score >= 55 then 'needs_attention'
    else 'action_recommended'
  end;
$$;

create or replace function public._eie_ensure_settings(p_organization_id uuid)
returns public.executive_insights_settings language plpgsql security definer set search_path = public as $$
declare v_row public.executive_insights_settings;
begin
  insert into public.executive_insights_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;

  select * into v_row from public.executive_insights_settings where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._eie_seed_schedules(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.executive_report_schedules (organization_id, reporting_period, enabled, delivery_channels)
  select p_organization_id, v.period, v.enabled, v.channels::jsonb
  from (values
    ('daily', false, '["dashboard"]'),
    ('weekly', true, '["dashboard"]'),
    ('monthly', true, '["dashboard","email_scaffold"]'),
    ('quarterly', false, '["dashboard","email_scaffold"]')
  ) as v(period, enabled, channels)
  on conflict (organization_id, reporting_period) do nothing;
end; $$;

create or replace function public._eie_seed_org_content(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._eie_ensure_settings(p_organization_id);
  perform public._eie_seed_schedules(p_organization_id);
end; $$;

create or replace function public._eie_compute_health_score(p_organization_id uuid)
returns int language plpgsql stable security definer set search_path = public as $$
declare
  v_score int := 75;
  v_analytics int;
  v_success int;
  v_quality int;
  v_security int;
  v_open_alerts int;
begin
  select coalesce(round(avg(score))::int, 75) into v_analytics
  from (
    select case
      when metric_key like '%.score' then metric_value::int
      when metric_key = 'onboarding.completion_pct' then metric_value::int
      else null
    end as score
    from public.organization_analytics_metrics
    where organization_id = p_organization_id
      and period_date >= current_date - 7
  ) s where score is not null;

  select coalesce(health_score, 75) into v_success
  from public.organization_customer_success
  where organization_id = p_organization_id;

  select coalesce(100 - count(*) * 5, 75) into v_quality
  from public.organization_quality_checks
  where organization_id = p_organization_id and status in ('open', 'investigating')
    and severity in ('high', 'critical');

  select coalesce(100 - count(*) * 8, 80) into v_security
  from public.security_compliance_checks
  where organization_id = p_organization_id and passed = false;

  select count(*) into v_open_alerts
  from public.operations_alerts
  where organization_id = p_organization_id and dismissed_at is null
    and severity in ('high', 'critical');

  v_score := round((
    coalesce(v_analytics, 75) * 0.25 +
    coalesce(v_success, 75) * 0.25 +
    coalesce(v_quality, 75) * 0.2 +
    coalesce(v_security, 80) * 0.2 +
    greatest(50, 100 - v_open_alerts * 10) * 0.1
  ))::int;

  return greatest(0, least(100, v_score));
end; $$;

create or replace function public._eie_aggregate_risks(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_risks jsonb := '[]'::jsonb;
begin
  -- Analytics (A.16)
  v_risks := v_risks || coalesce((
    select jsonb_agg(jsonb_build_object(
      'source', 'analytics_insights_engine',
      'source_label', 'Analytics & Insights (A.16)',
      'title', i.title,
      'severity', i.severity,
      'confidence', i.confidence,
      'summary', left(coalesce(i.description, ''), 200)
    ) order by case i.severity when 'critical' then 1 when 'high' then 2 else 3 end)
    from public.analytics_insights i
    where i.organization_id = p_organization_id and i.status = 'active'
      and i.severity in ('high', 'critical')
    limit 5
  ), '[]'::jsonb);

  -- Operations Dashboard (A.9) + Operations Center signals
  v_risks := v_risks || coalesce((
    select jsonb_agg(jsonb_build_object(
      'source', 'operations_dashboard_engine',
      'source_label', 'Operations Dashboard (A.9)',
      'title', a.title,
      'severity', a.severity,
      'summary', left(coalesce(a.message, ''), 200)
    ) order by case a.severity when 'critical' then 1 when 'high' then 2 else 3 end)
    from public.operations_alerts a
    where a.organization_id = p_organization_id and a.dismissed_at is null
      and a.severity in ('high', 'critical')
    limit 5
  ), '[]'::jsonb);

  -- Customer Success (A.26)
  v_risks := v_risks || coalesce((
    select jsonb_build_array(jsonb_build_object(
      'source', 'customer_success_engine',
      'source_label', 'Customer Success (A.26)',
      'title', 'Renewal risk elevated',
      'severity', case p.renewal_risk when 'critical' then 'critical' when 'high' then 'high' else 'moderate' end,
      'summary', format('Health %s · adoption %s · satisfaction %s', p.health_score, p.adoption_score, p.satisfaction_score)
    ))
    from public.organization_customer_success p
    where p.organization_id = p_organization_id and p.renewal_risk in ('high', 'critical')
  ), '[]'::jsonb);

  -- Strategic Intelligence (A.31 / Phase 81)
  v_risks := v_risks || coalesce((
    select jsonb_agg(jsonb_build_object(
      'source', 'strategic_intelligence',
      'source_label', 'Strategic Intelligence (A.31)',
      'title', r.title,
      'severity', case r.impact_level when 'critical' then 'critical' when 'high' then 'high' when 'medium' then 'moderate' else 'informational' end,
      'summary', left(r.description, 200)
    ))
    from public.strategic_risks r
    where r.tenant_id = p_organization_id and r.status = 'open'
    limit 5
  ), '[]'::jsonb);

  -- Quality Guardian (A.13)
  v_risks := v_risks || coalesce((
    select jsonb_agg(jsonb_build_object(
      'source', 'quality_guardian_engine',
      'source_label', 'Quality Guardian (A.13)',
      'title', q.title,
      'severity', q.severity,
      'summary', left(coalesce(q.description, ''), 200)
    ))
    from public.organization_quality_checks q
    where q.organization_id = p_organization_id and q.status in ('open', 'investigating')
      and q.severity in ('high', 'critical')
    limit 5
  ), '[]'::jsonb);

  -- Governance (A.14)
  v_risks := v_risks || coalesce((
    select jsonb_agg(jsonb_build_object(
      'source', 'governance_policy_engine',
      'source_label', 'Governance & Policy (A.14)',
      'title', v.violation_type,
      'severity', v.severity,
      'summary', left(coalesce(v.description, ''), 200)
    ))
    from public.policy_violations v
    where v.organization_id = p_organization_id and v.status = 'open'
    limit 5
  ), '[]'::jsonb);

  -- Security & Trust (A.18)
  v_risks := v_risks || coalesce((
    select jsonb_agg(jsonb_build_object(
      'source', 'security_trust_engine',
      'source_label', 'Security & Trust (A.18)',
      'title', c.check_name,
      'severity', 'high',
      'summary', left(coalesce(c.notes, c.check_key), 200)
    ))
    from public.security_compliance_checks c
    where c.organization_id = p_organization_id and c.passed = false
    limit 5
  ), '[]'::jsonb);

  -- Support AI (A.7)
  v_risks := v_risks || coalesce((
    select case when cnt > 10 then jsonb_build_array(jsonb_build_object(
      'source', 'support_ai_engine',
      'source_label', 'Support AI (A.7)',
      'title', 'Elevated open support volume',
      'severity', case when cnt > 25 then 'high' else 'moderate' end,
      'summary', format('%s open support cases requiring attention.', cnt)
    )) else '[]'::jsonb end
    from (select count(*)::int as cnt from public.organization_support_cases
      where organization_id = p_organization_id
        and status in ('new', 'open', 'waiting_for_customer', 'waiting_for_internal')) s
  ), '[]'::jsonb);

  return v_risks;
end; $$;

create or replace function public._eie_aggregate_opportunities(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_opps jsonb := '[]'::jsonb;
begin
  -- Analytics improvement opportunities
  v_opps := v_opps || coalesce((
    select jsonb_agg(jsonb_build_object(
      'source', 'analytics_insights_engine',
      'source_label', 'Analytics & Insights (A.16)',
      'title', i.title,
      'confidence', i.confidence,
      'summary', left(coalesce(i.suggested_action, i.description, ''), 200)
    ))
    from public.analytics_insights i
    where i.organization_id = p_organization_id and i.status = 'active'
      and i.severity in ('informational', 'moderate')
    limit 5
  ), '[]'::jsonb);

  -- Strategic opportunities (A.31)
  v_opps := v_opps || coalesce((
    select jsonb_agg(jsonb_build_object(
      'source', 'strategic_intelligence',
      'source_label', 'Strategic Intelligence (A.31)',
      'title', o.title,
      'confidence', o.confidence_level,
      'summary', left(coalesce(o.expected_value, o.description), 200)
    ))
    from public.strategic_opportunities o
    where o.tenant_id = p_organization_id and o.status = 'open'
    limit 5
  ), '[]'::jsonb);

  -- Customer Success playbooks (A.26)
  v_opps := v_opps || coalesce((
    select jsonb_agg(jsonb_build_object(
      'source', 'customer_success_engine',
      'source_label', 'Customer Success (A.26)',
      'title', sp.playbook_title,
      'confidence', 'high',
      'summary', left(sp.trigger_condition, 200)
    ))
    from public.success_playbooks sp
    where sp.status = 'active'
    limit 3
  ), '[]'::jsonb);

  -- AOC recommendations (Operations Center)
  v_opps := v_opps || coalesce((
    select jsonb_agg(jsonb_build_object(
      'source', 'operations_center',
      'source_label', 'Operations Center (A.32)',
      'title', r.title,
      'confidence', r.confidence_level,
      'summary', left(coalesce(r.expected_benefit, r.explanation), 200)
    ))
    from public.aoc_recommendations r
    where r.tenant_id = p_organization_id and r.status = 'pending'
    limit 5
  ), '[]'::jsonb);

  return v_opps;
end; $$;

create or replace function public._eie_build_recommended_actions(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_actions jsonb := '[]'::jsonb;
begin
  v_actions := v_actions || coalesce((
    select jsonb_agg(jsonb_build_object(
      'action_key', 'review_pending_approvals',
      'title', 'Review pending AI action approvals',
      'rationale', format('%s actions await human approval before execution.', cnt),
      'urgency', case when cnt > 10 then 'high' when cnt > 5 then 'medium' else 'low' end,
      'expected_outcome', 'Reduced approval bottlenecks and faster low-risk automation.',
      'estimated_effort', 'low',
      'source', 'secure_ai_action_engine',
      'route', '/app/secure-ai-actions'
    ))
    from (select count(*)::int as cnt from public.ai_action_requests
      where organization_id = p_organization_id and status = 'pending') s
    where cnt > 0
  ), '[]'::jsonb);

  v_actions := v_actions || coalesce((
    select jsonb_agg(jsonb_build_object(
      'action_key', 'address_quality_findings',
      'title', 'Resolve operational quality findings',
      'rationale', format('%s open quality checks may affect customer experience.', cnt),
      'urgency', case when cnt > 5 then 'high' else 'medium' end,
      'expected_outcome', 'Improved operational quality scores and fewer escalations.',
      'estimated_effort', 'medium',
      'source', 'quality_guardian_engine',
      'route', '/app/quality-guardian-engine'
    ))
    from (select count(*)::int as cnt from public.organization_quality_checks
      where organization_id = p_organization_id and status in ('open', 'investigating')) s
    where cnt > 0
  ), '[]'::jsonb);

  v_actions := v_actions || coalesce((
    select jsonb_agg(jsonb_build_object(
      'action_key', 'customer_success_intervention',
      'title', 'Review customer success interventions',
      'rationale', format('%s interventions pending for adoption or renewal risk.', cnt),
      'urgency', 'high',
      'expected_outcome', 'Stabilized health score and reduced renewal risk.',
      'estimated_effort', 'medium',
      'source', 'customer_success_engine',
      'route', '/app/customer-success-engine'
    ))
    from (select count(*)::int as cnt from public.success_interventions
      where organization_id = p_organization_id and status in ('pending', 'in_progress')) s
    where cnt > 0
  ), '[]'::jsonb);

  v_actions := v_actions || coalesce((
    select jsonb_agg(jsonb_build_object(
      'action_key', 'strategic_review',
      'title', 'Review strategic opportunities',
      'rationale', format('%s strategic opportunities identified for leadership review.', cnt),
      'urgency', 'medium',
      'expected_outcome', 'Prioritized strategic initiatives with human leadership approval.',
      'estimated_effort', 'low',
      'source', 'strategic_intelligence',
      'route', '/app/strategy'
    ))
    from (select count(*)::int as cnt from public.strategic_opportunities
      where tenant_id = p_organization_id and status = 'open') s
    where cnt > 0
  ), '[]'::jsonb);

  if jsonb_array_length(v_actions) = 0 then
    v_actions := jsonb_build_array(jsonb_build_object(
      'action_key', 'routine_executive_review',
      'title', 'Complete routine executive review',
      'rationale', 'No critical items require immediate attention. A routine review maintains operational awareness.',
      'urgency', 'low',
      'expected_outcome', 'Continued visibility into organization health and trends.',
      'estimated_effort', 'low',
      'source', 'executive_insights_engine',
      'route', '/app/executive-insights-engine'
    ));
  end if;

  return v_actions;
end; $$;

create or replace function public._eie_build_highlights(p_organization_id uuid, p_health_score int)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(h order by h->>'priority'), '[]'::jsonb)
  from (
    select jsonb_build_object(
      'priority', '1',
      'title', 'Organization health score',
      'summary', format('Overall health at %s with status %s.', p_health_score, public._eie_health_status(p_health_score))
    ) as h
    union all
    select jsonb_build_object(
      'priority', '2',
      'title', 'Customer success trajectory',
      'summary', format('Health %s · adoption %s · renewal risk %s',
        coalesce(p.health_score, 0), coalesce(p.adoption_score, 0), coalesce(p.renewal_risk, 'low'))
    )
    from public.organization_customer_success p
    where p.organization_id = p_organization_id
    union all
    select jsonb_build_object(
      'priority', '3',
      'title', 'Active operational insights',
      'summary', format('%s active analytics insights across operational modules.', cnt)
    )
    from (select count(*)::int as cnt from public.analytics_insights
      where organization_id = p_organization_id and status = 'active') s
  ) highlights;
$$;

create or replace function public._eie_generate_report_content(
  p_organization_id uuid,
  p_reporting_period text
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_health int;
  v_risks jsonb;
  v_opps jsonb;
  v_actions jsonb;
  v_highlights jsonb;
  v_summary text;
begin
  v_health := public._eie_compute_health_score(p_organization_id);
  v_risks := public._eie_aggregate_risks(p_organization_id);
  v_opps := public._eie_aggregate_opportunities(p_organization_id);
  v_actions := public._eie_build_recommended_actions(p_organization_id);
  v_highlights := public._eie_build_highlights(p_organization_id, v_health);

  v_summary := format(
    'Executive %s summary: organization health %s (%s). %s risks and %s opportunities identified. %s actions recommended for leadership review. Metadata only — no customer PII.',
    p_reporting_period,
    v_health,
    public._eie_health_status(v_health),
    jsonb_array_length(v_risks),
    jsonb_array_length(v_opps),
    jsonb_array_length(v_actions)
  );

  return jsonb_build_object(
    'summary', v_summary,
    'key_highlights', v_highlights,
    'risks', v_risks,
    'opportunities', v_opps,
    'recommended_actions', v_actions,
    'source_modules', jsonb_build_array(
      'analytics_insights_engine', 'operations_dashboard_engine', 'customer_success_engine',
      'strategic_intelligence', 'quality_guardian_engine', 'governance_policy_engine',
      'security_trust_engine', 'support_ai_engine', 'operations_center'
    ),
    'health_score', v_health,
    'health_status', public._eie_health_status(v_health)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.generate_executive_report(
  p_reporting_period text default 'weekly'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_content jsonb;
  v_row public.executive_reports;
begin
  perform public._irp_require_permission('executive.view');
  v_org_id := public._mta_require_organization();
  perform public._eie_seed_org_content(v_org_id);

  if p_reporting_period not in ('daily', 'weekly', 'monthly', 'quarterly') then
    raise exception 'Invalid reporting period';
  end if;

  v_content := public._eie_generate_report_content(v_org_id, p_reporting_period);

  insert into public.executive_reports (
    organization_id, reporting_period, summary, key_highlights, risks, opportunities,
    recommended_actions, source_modules
  ) values (
    v_org_id, p_reporting_period,
    v_content->>'summary',
    coalesce(v_content->'key_highlights', '[]'::jsonb),
    coalesce(v_content->'risks', '[]'::jsonb),
    coalesce(v_content->'opportunities', '[]'::jsonb),
    coalesce(v_content->'recommended_actions', '[]'::jsonb),
    coalesce(v_content->'source_modules', '[]'::jsonb)
  ) returning * into v_row;

  perform public._eie_log(v_org_id, 'executive_report_generated', 'executive_report', v_row.id,
    jsonb_build_object('reporting_period', p_reporting_period, 'health_score', v_content->'health_score'));

  return jsonb_build_object(
    'id', v_row.id,
    'reporting_period', v_row.reporting_period,
    'summary', v_row.summary,
    'key_highlights', v_row.key_highlights,
    'risks', v_row.risks,
    'opportunities', v_row.opportunities,
    'recommended_actions', v_row.recommended_actions,
    'source_modules', v_row.source_modules,
    'health_score', v_content->'health_score',
    'health_status', v_content->'health_status',
    'created_at', v_row.created_at,
    'privacy_note', 'Metadata and summary scores only — no PII.'
  );
end; $$;

create or replace function public.list_executive_reports(p_limit int default 20)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('executive.view');
  v_org_id := public._mta_require_organization();

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', r.id,
      'reporting_period', r.reporting_period,
      'summary', left(r.summary, 300),
      'risk_count', jsonb_array_length(r.risks),
      'opportunity_count', jsonb_array_length(r.opportunities),
      'action_count', jsonb_array_length(r.recommended_actions),
      'created_at', r.created_at
    ) order by r.created_at desc)
    from (select * from public.executive_reports where organization_id = v_org_id
      order by created_at desc limit greatest(1, least(p_limit, 50))) r
  ), '[]'::jsonb);
end; $$;

create or replace function public.export_executive_report(p_report_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.executive_reports;
begin
  perform public._irp_require_permission('executive.export');
  v_org_id := public._mta_require_organization();

  select * into v_row from public.executive_reports
  where id = p_report_id and organization_id = v_org_id;
  if not found then raise exception 'Report not found'; end if;

  perform public._eie_log(v_org_id, 'executive_report_exported', 'executive_report', v_row.id,
    jsonb_build_object('reporting_period', v_row.reporting_period));

  return jsonb_build_object(
    'export_format', 'json',
    'exported_at', now(),
    'privacy_note', 'Metadata and summary scores only — no PII.',
    'report', jsonb_build_object(
      'id', v_row.id,
      'reporting_period', v_row.reporting_period,
      'summary', v_row.summary,
      'key_highlights', v_row.key_highlights,
      'risks', v_row.risks,
      'opportunities', v_row.opportunities,
      'recommended_actions', v_row.recommended_actions,
      'source_modules', v_row.source_modules,
      'created_at', v_row.created_at
    )
  );
end; $$;

create or replace function public.save_executive_report_schedule(
  p_reporting_period text,
  p_enabled boolean default true,
  p_delivery_channels jsonb default '["dashboard"]'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.executive_report_schedules;
begin
  perform public._irp_require_permission('executive.schedule');
  v_org_id := public._mta_require_organization();
  perform public._eie_seed_org_content(v_org_id);

  insert into public.executive_report_schedules (
    organization_id, reporting_period, enabled, delivery_channels
  ) values (v_org_id, p_reporting_period, p_enabled, p_delivery_channels)
  on conflict (organization_id, reporting_period) do update set
    enabled = excluded.enabled,
    delivery_channels = excluded.delivery_channels,
    updated_at = now()
  returning * into v_row;

  perform public._eie_log(v_org_id, 'executive_schedule_changed', 'executive_schedule', v_row.id,
    jsonb_build_object('reporting_period', p_reporting_period, 'enabled', p_enabled));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.get_executive_report_schedules()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('executive.view');
  v_org_id := public._mta_require_organization();
  perform public._eie_seed_org_content(v_org_id);

  return coalesce((
    select jsonb_agg(row_to_json(s) order by
      case s.reporting_period when 'daily' then 1 when 'weekly' then 2 when 'monthly' then 3 else 4 end)
    from public.executive_report_schedules s where s.organization_id = v_org_id
  ), '[]'::jsonb);
end; $$;

create or replace function public.save_executive_insights_settings(
  p_settings jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.executive_insights_settings;
begin
  perform public._irp_require_permission('executive.schedule');
  v_org_id := public._mta_require_organization();
  perform public._eie_ensure_settings(v_org_id);

  update public.executive_insights_settings set
    enabled_sources = coalesce(p_settings->'enabled_sources', enabled_sources),
    focus_areas = coalesce(p_settings->'focus_areas', focus_areas),
    email_delivery_scaffold = coalesce((p_settings->>'email_delivery_scaffold')::boolean, email_delivery_scaffold),
    proactivity_level = coalesce(p_settings->>'proactivity_level', proactivity_level),
    presentation_style = coalesce(p_settings->>'presentation_style', presentation_style),
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_row;

  perform public._eie_log(v_org_id, 'executive_settings_changed', 'executive_insights_settings', v_row.id, '{}'::jsonb);

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.get_executive_insights_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.executive_insights_settings;
  v_health int;
  v_content jsonb;
begin
  perform public._irp_require_permission('executive.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._eie_ensure_settings(v_org_id);
  perform public._eie_seed_org_content(v_org_id);

  v_health := public._eie_compute_health_score(v_org_id);
  v_content := public._eie_generate_report_content(v_org_id, 'weekly');

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Executive insights through tenant-aware reporting — strategic focus, explainable summaries, and accountable recommendations. Metadata only.',
    'safety_note', 'Metadata and summary scores only — no customer email, chat, order content, or PII.',
    'principles', jsonb_build_array(
      'Tenant-aware reporting across Analytics, Operations, Customer Success, and Strategic Intelligence',
      'Explainable insights with confidence and severity metadata',
      'Action-oriented summaries with rationale, urgency, and estimated effort',
      'Human leadership retains all strategic and operational decisions',
      'Full audit via report generation, exports, and schedule changes'
    ),
    'summary', jsonb_build_object(
      'health_score', v_health,
      'health_status', public._eie_health_status(v_health),
      'risk_count', jsonb_array_length(coalesce(v_content->'risks', '[]'::jsonb)),
      'opportunity_count', jsonb_array_length(coalesce(v_content->'opportunities', '[]'::jsonb)),
      'action_count', jsonb_array_length(coalesce(v_content->'recommended_actions', '[]'::jsonb)),
      'reports_generated', coalesce((select count(*) from public.executive_reports where organization_id = v_org_id), 0)
    ),
    'organization_health', jsonb_build_object(
      'score', v_health,
      'status', public._eie_health_status(v_health),
      'factors', jsonb_build_object(
        'analytics', 'A.16 Analytics & Insights',
        'operations', 'A.9 Operations Dashboard / A.32 Operations Center',
        'customer_success', 'A.26 Customer Success',
        'quality', 'A.13 Quality Guardian',
        'governance', 'A.14 Governance & Policy',
        'security', 'A.18 Security & Trust',
        'support', 'A.7 Support AI'
      )
    ),
    'major_achievements', coalesce(v_content->'key_highlights', '[]'::jsonb),
    'operational_risks', coalesce(v_content->'risks', '[]'::jsonb),
    'strategic_opportunities', coalesce(v_content->'opportunities', '[]'::jsonb),
    'customer_trends', coalesce((
      select jsonb_build_array(
        jsonb_build_object(
          'metric', 'health_score',
          'value', coalesce(p.health_score, 0),
          'status', coalesce(p.health_status, 'healthy')
        ),
        jsonb_build_object(
          'metric', 'adoption_score',
          'value', coalesce(p.adoption_score, 0),
          'status', case when p.adoption_score >= 70 then 'healthy' else 'needs_attention' end
        ),
        jsonb_build_object(
          'metric', 'renewal_risk',
          'value', coalesce(p.renewal_risk, 'low'),
          'status', p.renewal_risk
        )
      )
      from public.organization_customer_success p where p.organization_id = v_org_id
    ), '[]'::jsonb),
    'ai_recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'action_key', a->>'action_key',
        'title', a->>'title',
        'rationale', a->>'rationale',
        'urgency', a->>'urgency',
        'expected_outcome', a->>'expected_outcome',
        'estimated_effort', a->>'estimated_effort',
        'route', a->>'route'
      ))
      from jsonb_array_elements(coalesce(v_content->'recommended_actions', '[]'::jsonb)) a
      where (a->>'urgency') in ('high', 'critical', 'medium')
    ), '[]'::jsonb),
    'recommended_actions', coalesce(v_content->'recommended_actions', '[]'::jsonb),
    'recent_reports', public.list_executive_reports(5),
    'schedules', public.get_executive_report_schedules(),
    'settings', row_to_json(v_settings),
    'source_modules', jsonb_build_array(
      jsonb_build_object('key', 'analytics_insights_engine', 'label', 'Analytics (A.16)', 'route', '/app/analytics-insights-engine'),
      jsonb_build_object('key', 'operations_dashboard_engine', 'label', 'Operations Dashboard (A.9)', 'route', '/app/operations-dashboard-engine'),
      jsonb_build_object('key', 'operations_center', 'label', 'Operations Center (A.32)', 'route', '/app/operations'),
      jsonb_build_object('key', 'customer_success_engine', 'label', 'Customer Success (A.26)', 'route', '/app/customer-success-engine'),
      jsonb_build_object('key', 'strategic_intelligence', 'label', 'Strategic Intelligence (A.31)', 'route', '/app/strategy'),
      jsonb_build_object('key', 'quality_guardian_engine', 'label', 'Quality Guardian (A.13)', 'route', '/app/quality-guardian-engine'),
      jsonb_build_object('key', 'governance_policy_engine', 'label', 'Governance (A.14)', 'route', '/app/governance-policy-engine'),
      jsonb_build_object('key', 'security_trust_engine', 'label', 'Security (A.18)', 'route', '/app/settings/security'),
      jsonb_build_object('key', 'support_ai_engine', 'label', 'Support AI (A.7)', 'route', '/app/support-ai-engine')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_executive_insights_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_health int; v_risks int; v_actions int;
begin
  v_org_id := public._mta_require_organization();
  perform public._eie_seed_org_content(v_org_id);
  v_health := public._eie_compute_health_score(v_org_id);

  select jsonb_array_length(public._eie_aggregate_risks(v_org_id)),
         jsonb_array_length(public._eie_build_recommended_actions(v_org_id))
  into v_risks, v_actions;

  return jsonb_build_object(
    'has_organization', true,
    'health_score', v_health,
    'health_status', public._eie_health_status(v_health),
    'risk_count', v_risks,
    'action_count', v_actions,
    'philosophy', 'Executive insights with explainable summaries — humans decide, Aipify informs.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Audit extension
-- ---------------------------------------------------------------------------
create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'module_activated', 'module_deactivated', 'module_configured',
    'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'support_ai_draft_generated', 'support_escalated', 'support_approval_granted',
    'support_case_created', 'support_case_closed', 'support_case_assigned', 'support_satisfaction_received',
    'integration_created', 'integration_updated', 'integration_disabled', 'integration_connected',
    'integration_credential_rotated', 'integration_sync_executed', 'integration_sync_failed',
    'integration_webhook_received', 'integration_webhook_failed',
    'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_removed', 'settings_updated',
    'organization_provisioned', 'organization_switched', 'approval_submitted', 'approval_approved', 'approval_rejected',
    'audit_exported',
    'assistant_task_created', 'assistant_task_assigned', 'assistant_task_updated',
    'assistant_recommendation_accepted', 'assistant_recommendation_rejected',
    'assistant_daily_briefing_generated', 'assistant_reminder_sent',
    'dashboard_preferences_saved', 'operations_alert_dismissed', 'critical_alert_acknowledged',
    'onboarding_started', 'onboarding_step_advanced', 'checklist_completed', 'onboarding_completed',
    'subscription_created', 'trial_started', 'plan_upgraded', 'plan_downgraded',
    'subscription_cancelled', 'subscription_reactivated',
    'self_support_response_sent', 'self_support_draft_generated', 'self_support_escalated',
    'self_support_conversation_closed', 'self_support_feedback_submitted',
    'self_support_knowledge_recommended', 'self_support_conversation_created',
    'quality_alert_created', 'quality_check_resolved', 'quality_finding_ignored',
    'quality_recommendation_accepted', 'quality_recommendation_rejected', 'quality_scan_executed',
    'notification_sent', 'notification_dismissed', 'notification_preferences_saved',
    'notification_digest_generated', 'critical_alert_sent', 'notification_delivery_failed',
    'deployment_scheduled', 'deployment_initiated', 'deployment_completed', 'deployment_failed',
    'deployment_rollback_executed', 'feature_flag_changed', 'rollout_adjusted',
    'health_check_recorded', 'incident_created', 'incident_updated', 'incident_resolved',
    'maintenance_scheduled', 'maintenance_started', 'maintenance_completed',
    'installation_started', 'installation_step_advanced', 'installation_discovery_executed',
    'installation_permissions_approved', 'installation_recommendations_accepted',
    'integrations_connected', 'installation_completed',
    'internal_validation_recorded', 'internal_feedback_submitted',
    'launch_checklist_updated', 'launch_review_submitted',
    'success_health_assessed', 'success_intervention_created',
    'status_event_recorded', 'incident_published', 'incident_updated', 'incident_resolved',
    'maintenance_announced', 'status_configuration_changed', 'status_override_applied',
    'enterprise_setting_changed', 'delegated_admin_assigned', 'approval_chain_updated',
    'approval_override_applied', 'readiness_assessment_recorded', 'enterprise_export_generated',
    'executive_report_generated', 'executive_report_exported', 'executive_schedule_changed',
    'executive_settings_changed'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'executive-insights-engine', 'Executive Insights Engine', 'Tenant executive reporting, strategic summaries, risks, opportunities, and action recommendations.', 'authenticated', 72
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'executive-insights-engine' and tenant_id is null);

grant execute on function public.generate_executive_report(text) to authenticated;
grant execute on function public.list_executive_reports(int) to authenticated;
grant execute on function public.export_executive_report(uuid) to authenticated;
grant execute on function public.save_executive_report_schedule(text, boolean, jsonb) to authenticated;
grant execute on function public.get_executive_report_schedules() to authenticated;
grant execute on function public.save_executive_insights_settings(jsonb) to authenticated;
grant execute on function public.get_executive_insights_engine_dashboard() to authenticated;
grant execute on function public.get_executive_insights_engine_card() to authenticated;

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._eie_seed_org_content(v_org_id);
  end loop;
end $$;
