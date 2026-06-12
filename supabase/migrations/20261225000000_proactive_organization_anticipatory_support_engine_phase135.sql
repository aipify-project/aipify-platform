-- Phase 135 — Proactive Organization & Anticipatory Support Engine
-- Autonomous Organization Era (131–140). Organization-level early awareness — NOT individual nudges (A.79).
-- Helpers: _porg_* (engine), _porgbp135_* (blueprint — never collide with _pce_*, _paebp_*, _pcobp56_*)

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
    'multi_store_orchestration', 'supplier_intelligence', 'global_commerce_expansion',
    'commerce_companion', 'aipify_core_platform', 'multi_tenant_architecture',
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
    'learning_training_engine', 'organizational_memory_engine',
    'enterprise_deployment_device_rollout_engine',
    'innovation_impact_engine', 'compliance_regulatory_readiness_engine',
    'strategic_intelligence_foundation_engine', 'operations_center_foundation_engine',
    'continuous_improvement_engine', 'human_oversight_engine',
    'workflow_orchestration_engine', 'business_packs_foundation_engine',
    'industry_intelligence_foundation_engine',
    'marketplace_partner_ecosystem_foundation_engine',
    'ai_ethics_responsible_use_engine',
    'change_management_engine',
    'value_realization_engine',
    'organizational_resilience_engine',
    'incident_response_coordination_engine',
    'service_level_commitment_engine',
    'stakeholder_communication_engine',
    'organizational_decision_support_engine',
    'strategic_alignment_engine',
    'organizational_health_engine',
    'capability_maturity_engine',
    'organizational_benchmarking_engine',
    'document_output_engine',
    'records_retention_management_engine',
    'meeting_collaboration_intelligence_engine',
    'unified_task_follow_up_engine',
    'resource_planning_engine',
    'capacity_workload_management_engine',
    'goals_okr_engine',
    'predictive_insights_engine',
    'personal_productivity_engine',
    'companion_presence_indicator_engine',
    'cross_tenant_intelligence_engine',
    'partner_success_engine',
    'relationship_intelligence_engine',
    'trust_reputation_engine',
    'ai_cost_governance_engine',
    'organization_workspace_engine',
    'proactive_companion_engine',
    'priority_focus_engine',
    'growth_evolution_engine',
    'purpose_values_engine',
    'inclusion_humanity_engine',
    'companion_identity_engine',
    'impact_engine',
    'legacy_engine',
    'curiosity_discovery_engine',
    'wonder_engine',
    'gratitude_recognition_engine',
    'presence_comfort_protocol',
    'dedication_engine',
    'hope_engine',
    'wisdom_engine',
    'wisdom_intervention_protocol',
    'sales_expert_engine',
    'security_trust_engine',
    'api_platform_engine',
    'companion_device_ecosystem_engine',
    'companion_marketplace',
    'growth_partner_operations',
    'aipify_university',
    'social_impact_purpose',
    'ecosystem_governance',
    'ecosystem_orchestration',
    'executive_intelligence',
    'strategic_foresight_engine',
    'decision_intelligence_engine',
    'organizational_wisdom_engine',
    'companion_workforce',
    'proactive_organization'
  )
);

-- ---------------------------------------------------------------------------
-- 1. proactive_organization_settings
-- ---------------------------------------------------------------------------
create table if not exists public.proactive_organization_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  proactive_center_enabled boolean not null default true,
  anticipatory_support_enabled boolean not null default true,
  pulse_monitoring_enabled boolean not null default true,
  companion_alerts_enabled boolean not null default true,
  human_governance_required boolean not null default true,
  care_not_surveillance_mode boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.proactive_organization_settings enable row level security;
revoke all on public.proactive_organization_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. proactive_organization_signals
-- ---------------------------------------------------------------------------
create table if not exists public.proactive_organization_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  signal_type text not null check (
    signal_type in (
      'support_volume', 'knowledge_access', 'workflow_bottleneck',
      'transformation_fatigue', 'companion_adoption', 'learning_participation',
      'csat_change', 'leadership_overload'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  severity text not null default 'moderate' check (
    severity in ('emerging', 'moderate', 'important', 'critical')
  ),
  trend_direction text not null default 'stable' check (
    trend_direction in ('improving', 'stable', 'declining', 'volatile')
  ),
  status text not null default 'active' check (
    status in ('active', 'monitoring', 'resolved', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, signal_key)
);

create index if not exists proactive_organization_signals_tenant_idx
  on public.proactive_organization_signals (tenant_id, signal_type, status);

alter table public.proactive_organization_signals enable row level security;
revoke all on public.proactive_organization_signals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. proactive_organization_support_opportunities
-- ---------------------------------------------------------------------------
create table if not exists public.proactive_organization_support_opportunities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  opportunity_key text not null,
  opportunity_type text not null check (
    opportunity_type in (
      'growth_department', 'transformation_team', 'leadership', 'customer_success',
      'growth_partner', 'new_employee', 'knowledge_gap', 'workflow_review'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  target_audience text,
  priority text not null default 'moderate' check (
    priority in ('low', 'moderate', 'high', 'urgent')
  ),
  status text not null default 'open' check (
    status in ('open', 'in_progress', 'addressed', 'deferred', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, opportunity_key)
);

create index if not exists proactive_organization_support_opportunities_tenant_idx
  on public.proactive_organization_support_opportunities (tenant_id, opportunity_type, status);

alter table public.proactive_organization_support_opportunities enable row level security;
revoke all on public.proactive_organization_support_opportunities from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. proactive_organization_pulse_snapshots
-- ---------------------------------------------------------------------------
create table if not exists public.proactive_organization_pulse_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  snapshot_key text not null,
  pulse_dimension text not null check (
    pulse_dimension in (
      'learning_health', 'companion_engagement', 'knowledge_utilization',
      'transformation_momentum', 'community_participation', 'support_trends',
      'governance_health', 'gp_relationships'
    )
  ),
  summary text not null check (char_length(summary) <= 500),
  signal_strength text not null default 'moderate' check (
    signal_strength in ('emerging', 'moderate', 'strong', 'needs_attention')
  ),
  trend_pct numeric(6,2),
  value_numeric numeric(8,2),
  snapshot_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, snapshot_key)
);

create index if not exists proactive_organization_pulse_snapshots_tenant_idx
  on public.proactive_organization_pulse_snapshots (tenant_id, pulse_dimension);

alter table public.proactive_organization_pulse_snapshots enable row level security;
revoke all on public.proactive_organization_pulse_snapshots from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. proactive_organization_recommendations
-- ---------------------------------------------------------------------------
create table if not exists public.proactive_organization_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  recommendation_type text not null check (
    recommendation_type in (
      'knowledge_recommendation', 'training_suggestion', 'workflow_review',
      'executive_briefing', 'communication_guidance', 'governance_reminder',
      'resource_allocation', 'preventative_support'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'pending' check (
    status in ('pending', 'acknowledged', 'dismissed', 'archived')
  ),
  priority text not null default 'moderate' check (
    priority in ('low', 'moderate', 'high')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, recommendation_key)
);

create index if not exists proactive_organization_recommendations_tenant_idx
  on public.proactive_organization_recommendations (tenant_id, status, priority);

alter table public.proactive_organization_recommendations enable row level security;
revoke all on public.proactive_organization_recommendations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. proactive_organization_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.proactive_organization_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.proactive_organization_audit_logs enable row level security;
revoke all on public.proactive_organization_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'proactive_organization_engine', v.description
from (values
  ('proactive_organization.view', 'View Proactive Organization Center', 'View org-level early signals, pulse metrics, and preventative recommendations'),
  ('proactive_organization.manage', 'Manage Proactive Organization Center', 'Configure proactive organization settings and acknowledge recommendations')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'proactive_organization.view'), ('owner', 'proactive_organization.manage'),
  ('administrator', 'proactive_organization.view'), ('administrator', 'proactive_organization.manage'),
  ('manager', 'proactive_organization.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 8. Engine helpers (_porg_*)
-- ---------------------------------------------------------------------------
create or replace function public._porg_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._porg_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._porg_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._porg_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.proactive_organization_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._porg_ensure_settings(p_tenant_id uuid)
returns public.proactive_organization_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.proactive_organization_settings;
begin
  insert into public.proactive_organization_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.proactive_organization_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._porg_signal_type_scaffolds()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'support_volume', 'label', 'Support volume trends', 'description', 'Aggregate support demand patterns — not individual cases'),
    jsonb_build_object('key', 'knowledge_access', 'label', 'Knowledge access patterns', 'description', 'Approved knowledge utilization trends'),
    jsonb_build_object('key', 'workflow_bottleneck', 'label', 'Workflow bottlenecks', 'description', 'Operational flow delays in aggregate metadata'),
    jsonb_build_object('key', 'transformation_fatigue', 'label', 'Transformation fatigue', 'description', 'Change pace awareness — cross-link Phase 134 continuous improvement'),
    jsonb_build_object('key', 'companion_adoption', 'label', 'Companion adoption', 'description', 'Org-wide companion engagement — not individual ranking'),
    jsonb_build_object('key', 'learning_participation', 'label', 'Learning participation', 'description', 'Training and university participation aggregates'),
    jsonb_build_object('key', 'csat_change', 'label', 'CSAT changes', 'description', 'Customer satisfaction trend metadata — no PII'),
    jsonb_build_object('key', 'leadership_overload', 'label', 'Leadership overload', 'description', 'Leadership capacity signals — Self Love cross-link')
  );
$$;

create or replace function public._porg_companion_limitation_rules()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'unnecessary_anxiety', 'label', 'No unnecessary anxiety', 'description', 'Early awareness without alarmist framing'),
    jsonb_build_object('key', 'false_certainty', 'label', 'No false certainty', 'description', 'Trends disclosed with confidence levels — never pretend to know'),
    jsonb_build_object('key', 'governance_override', 'label', 'No governance override', 'description', 'Automated intervention requires approved governance'),
    jsonb_build_object('key', 'opaque_action', 'label', 'No opaque action', 'description', 'Every recommendation explainable and auditable'),
    jsonb_build_object('key', 'replace_relationships', 'label', 'No replacing human relationships', 'description', 'Companions support awareness — humans connect')
  );
$$;

create or replace function public._porg_seed_signals(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.proactive_organization_signals where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.proactive_organization_signals (
    tenant_id, signal_key, signal_type, title, summary, severity, trend_direction, status
  ) values
    (p_tenant_id, 'sig-support-volume', 'support_volume', 'Support volume elevation',
     'Aggregate support ticket volume trending above baseline — anticipatory awareness, not blame.', 'moderate', 'declining', 'active'),
    (p_tenant_id, 'sig-knowledge-access', 'knowledge_access', 'Knowledge access concentration',
     'Critical procedures accessed repeatedly from few knowledge areas — continuity opportunity.', 'emerging', 'stable', 'monitoring'),
    (p_tenant_id, 'sig-bottleneck', 'workflow_bottleneck', 'Workflow bottleneck signal',
     'Operations metadata suggests handoff delays — cross-link workflow orchestration Phase 133.', 'moderate', 'declining', 'active'),
    (p_tenant_id, 'sig-transform-fatigue', 'transformation_fatigue', 'Transformation fatigue indicator',
     'Change initiative pace may exceed comfortable adoption — cross-link Phase 134 continuous improvement.', 'important', 'declining', 'monitoring'),
    (p_tenant_id, 'sig-companion-adopt', 'companion_adoption', 'Companion adoption variance',
     'Companion utilization uneven across teams — support opportunity, not surveillance ranking.', 'moderate', 'improving', 'active'),
    (p_tenant_id, 'sig-learning', 'learning_participation', 'Learning participation dip',
     'University and training path participation below target — gentle reinforcement suggested.', 'emerging', 'declining', 'active'),
    (p_tenant_id, 'sig-csat', 'csat_change', 'CSAT trend shift',
     'Customer satisfaction aggregate trending down — early awareness for leadership review.', 'important', 'declining', 'monitoring'),
    (p_tenant_id, 'sig-leadership-load', 'leadership_overload', 'Leadership capacity signal',
     'Leadership workload indicators elevated — Self Love and sustainable pace cross-link.', 'important', 'volatile', 'active');
end; $$;

create or replace function public._porg_seed_support_opportunities(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.proactive_organization_support_opportunities where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.proactive_organization_support_opportunities (
    tenant_id, opportunity_key, opportunity_type, title, summary, target_audience, priority, status
  ) values
    (p_tenant_id, 'opp-growth-dept', 'growth_department', 'Growth department enablement',
     'Sales and growth teams may benefit from refreshed playbook knowledge — role-based delivery.', 'Growth departments', 'moderate', 'open'),
    (p_tenant_id, 'opp-transform', 'transformation_team', 'Transformation team support',
     'Change champions may need workflow review scaffolds — cross-link change management.', 'Transformation teams', 'high', 'open'),
    (p_tenant_id, 'opp-leaders', 'leadership', 'Leadership briefing opportunity',
     'Executive anticipation dashboard suggests leadership sync on emerging signals.', 'Leaders', 'high', 'in_progress'),
    (p_tenant_id, 'opp-customers', 'customer_success', 'Customer success reinforcement',
     'CSAT signal suggests proactive customer success check-in guidance — aggregate only.', 'Customer success', 'moderate', 'open'),
    (p_tenant_id, 'opp-gp', 'growth_partner', 'Growth Partner relationship pulse',
     'GP relationship metadata suggests partnership health review — never Affiliate terminology.', 'Growth Partners', 'moderate', 'open'),
    (p_tenant_id, 'opp-new-hires', 'new_employee', 'New employee onboarding reinforcement',
     'Onboarding path completion below target — contextual knowledge delivery opportunity.', 'New employees', 'moderate', 'open');
end; $$;

create or replace function public._porg_seed_pulse_snapshots(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.proactive_organization_pulse_snapshots where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.proactive_organization_pulse_snapshots (
    tenant_id, snapshot_key, pulse_dimension, summary, signal_strength, trend_pct, value_numeric
  ) values
    (p_tenant_id, 'pulse-learning', 'learning_health', 'Learning health across training and university paths — metadata counts only.', 'moderate', 3.5, 72.0),
    (p_tenant_id, 'pulse-companion', 'companion_engagement', 'Companion engagement aggregate — cross-link Proactive Companion A.79 for individual nudges.', 'strong', 6.0, 68.0),
    (p_tenant_id, 'pulse-knowledge', 'knowledge_utilization', 'Approved knowledge utilization trends from KC — not content surveillance.', 'moderate', 2.0, 58.0),
    (p_tenant_id, 'pulse-transform', 'transformation_momentum', 'Transformation initiative momentum — cross-link Phase 134 adaptive organization.', 'emerging', -1.5, 45.0),
    (p_tenant_id, 'pulse-community', 'community_participation', 'Community participation aggregate — cross-link /app/community.', 'moderate', 8.0, 52.0),
    (p_tenant_id, 'pulse-support', 'support_trends', 'Support trend metadata — volume and resolution patterns, no case content.', 'moderate', -4.0, 64.0),
    (p_tenant_id, 'pulse-governance', 'governance_health', 'Governance indicator health — cross-link human oversight A.40.', 'strong', 1.0, 76.0),
    (p_tenant_id, 'pulse-gp', 'gp_relationships', 'Growth Partner relationship outcomes — aggregate metadata only.', 'moderate', 2.5, 81.0);
end; $$;

create or replace function public._porg_seed_recommendations(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.proactive_organization_recommendations where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.proactive_organization_recommendations (
    tenant_id, recommendation_key, recommendation_type, title, summary, status, priority
  ) values
    (p_tenant_id, 'rec-knowledge-refresh', 'knowledge_recommendation', 'Refresh critical procedure knowledge',
     'Knowledge access signal suggests targeted KC article reinforcement for operations teams.', 'pending', 'moderate'),
    (p_tenant_id, 'rec-training-path', 'training_suggestion', 'Suggest learning path completion',
     'Learning participation dip — recommend Aipify University module refresh for affected roles.', 'pending', 'moderate'),
    (p_tenant_id, 'rec-workflow-review', 'workflow_review', 'Workflow handoff review',
     'Bottleneck signal — suggest workflow orchestration review with human oversight checkpoint.', 'pending', 'high'),
    (p_tenant_id, 'rec-exec-brief', 'executive_briefing', 'Executive anticipation briefing',
     'Emerging signals warrant leadership visibility — draft aggregate briefing scaffold only.', 'pending', 'high'),
    (p_tenant_id, 'rec-comm-guidance', 'communication_guidance', 'Stakeholder communication guidance',
     'Transformation fatigue — suggest compassionate change communication — cross-link stakeholder comms.', 'acknowledged', 'moderate'),
    (p_tenant_id, 'rec-governance', 'governance_reminder', 'Governance review reminder',
     'Periodic governance alignment check — no automated policy changes without approval.', 'pending', 'moderate'),
    (p_tenant_id, 'rec-resource', 'resource_allocation', 'Resource allocation awareness',
     'Support volume elevation may warrant capacity review — humans decide allocation.', 'pending', 'moderate');
end; $$;

create or replace function public._porg_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_signals_active int;
  v_opportunities_open int;
  v_recommendations_pending int;
  v_pulse_indicators int;
  v_avg_pulse numeric;
  v_proactive_score numeric;
begin
  select count(*) into v_signals_active from public.proactive_organization_signals
  where tenant_id = p_tenant_id and status in ('active', 'monitoring');
  select count(*) into v_opportunities_open from public.proactive_organization_support_opportunities
  where tenant_id = p_tenant_id and status in ('open', 'in_progress');
  select count(*) into v_recommendations_pending from public.proactive_organization_recommendations
  where tenant_id = p_tenant_id and status = 'pending';
  select count(*) into v_pulse_indicators from public.proactive_organization_pulse_snapshots
  where tenant_id = p_tenant_id;
  select coalesce(avg(value_numeric), 0) into v_avg_pulse
  from public.proactive_organization_pulse_snapshots where tenant_id = p_tenant_id;

  v_proactive_score := least(100, greatest(0,
    (v_pulse_indicators * 5) + (v_signals_active * 4) + (v_opportunities_open * 3)
    + (v_recommendations_pending * 2) + (v_avg_pulse * 0.25) + 10
  ));

  return jsonb_build_object(
    'proactive_score', round(v_proactive_score, 1),
    'signals_active', v_signals_active,
    'support_opportunities_open', v_opportunities_open,
    'recommendations_pending', v_recommendations_pending,
    'pulse_indicators', v_pulse_indicators,
    'avg_pulse_value', round(v_avg_pulse, 1),
    'signal_types_count', jsonb_array_length(public._porg_signal_type_scaffolds()),
    'companion_limitations_count', jsonb_array_length(public._porg_companion_limitation_rules())
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Blueprint helpers (_porgbp135_*)
-- ---------------------------------------------------------------------------
create or replace function public._porgbp135_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 135 — Proactive Organization & Anticipatory Support Engine at /app/proactive-organization-engine. Organization-level early awareness, anticipatory support, and org pulse — Autonomous Organization Era (131–140). Distinct from Proactive Companion Engine A.79 at /app/proactive-companion-engine (individual nudges/presence — cross-link, do NOT duplicate nudge delivery). Distinct from Organizational Health A.56 at /app/organizational-health-engine (health indicators — cross-link). Helpers _porgbp135_* — never collide with _pce_*, _paebp_*, _pcobp56_*.';
$$;

create or replace function public._porgbp135_mission()
returns text language sql immutable as $$
  select 'Help organizations notice emerging patterns early, anticipate support needs compassionately, and strengthen preventative care — care not control, wisdom before speed.';
$$;

create or replace function public._porgbp135_philosophy()
returns text language sql immutable as $$
  select 'Organizational patterns only — never individual employee monitoring. People First. Companions support awareness without unnecessary urgency. Humans responsible; approved governance for any automated intervention.';
$$;

create or replace function public._porgbp135_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Proactive Organization Center surfaces aggregate early signals and preventative recommendations. Companions highlight trends and encourage reflection; humans decide and connect.';
$$;

create or replace function public._porgbp135_vision()
returns text language sql immutable as $$
  select 'Organizations stay ahead with compassionate early awareness — supported by anticipatory companions that prepare teams without surveillance or false certainty.';
$$;

create or replace function public._porgbp135_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'early_awareness', 'emoji', '🔍', 'label', 'Early awareness', 'description', 'Notice emerging organizational patterns before they become crises'),
    jsonb_build_object('key', 'anticipatory_support', 'emoji', '🤝', 'label', 'Anticipatory support', 'description', 'Identify where teams may need support — compassion not control'),
    jsonb_build_object('key', 'preventative_action', 'emoji', '🛡️', 'label', 'Preventative action', 'description', 'Recommendations humans can acknowledge — no auto-intervention'),
    jsonb_build_object('key', 'org_pulse', 'emoji', '💓', 'label', 'Organizational pulse', 'description', 'Aggregate pulse metrics over time — metadata only'),
    jsonb_build_object('key', 'knowledge_delivery', 'emoji', '📚', 'label', 'Proactive knowledge', 'description', 'Contextual, role-based learning reinforcement'),
    jsonb_build_object('key', 'executive_anticipation', 'emoji', '🦉', 'label', 'Executive anticipation', 'description', 'Leadership visibility into emerging risks and opportunities'),
    jsonb_build_object('key', 'companion_coordination', 'emoji', '🔗', 'label', 'Companion coordination', 'description', 'Org-level companion role — cross-link A.79 individual delivery'),
    jsonb_build_object('key', 'care_not_surveillance', 'emoji', '🌿', 'label', 'Care not surveillance', 'description', 'Organizational patterns — NOT employee monitoring')
  );
$$;

create or replace function public._porgbp135_proactive_organization_center()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'emerging_signals', 'label', 'Emerging signals'),
    jsonb_build_object('key', 'support_opportunities', 'label', 'Support opportunities'),
    jsonb_build_object('key', 'preventative_recommendations', 'label', 'Preventative recommendations'),
    jsonb_build_object('key', 'pulse_monitoring', 'label', 'Pulse monitoring'),
    jsonb_build_object('key', 'companion_alerts', 'label', 'Companion alerts'),
    jsonb_build_object('key', 'knowledge_gaps', 'label', 'Knowledge gaps'),
    jsonb_build_object('key', 'executive_notifications', 'label', 'Executive notifications'),
    jsonb_build_object('key', 'anticipation_dashboards', 'label', 'Anticipation dashboards')
  );
$$;

create or replace function public._porgbp135_early_signal_engine()
returns jsonb language sql immutable as $$
  select public._porg_signal_type_scaffolds();
$$;

create or replace function public._porgbp135_preventative_support_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'knowledge_recs', 'label', 'Knowledge recommendations'),
    jsonb_build_object('key', 'training', 'label', 'Training suggestions'),
    jsonb_build_object('key', 'workflow_reviews', 'label', 'Workflow reviews'),
    jsonb_build_object('key', 'executive_briefings', 'label', 'Executive briefings'),
    jsonb_build_object('key', 'communication_guidance', 'label', 'Communication guidance'),
    jsonb_build_object('key', 'governance_reminders', 'label', 'Governance reminders'),
    jsonb_build_object('key', 'resource_allocation', 'label', 'Resource allocation awareness')
  );
$$;

create or replace function public._porgbp135_organizational_pulse_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'learning_health', 'label', 'Learning health'),
    jsonb_build_object('key', 'companion_engagement', 'label', 'Companion engagement'),
    jsonb_build_object('key', 'knowledge_utilization', 'label', 'Knowledge utilization'),
    jsonb_build_object('key', 'transformation_momentum', 'label', 'Transformation momentum'),
    jsonb_build_object('key', 'community', 'label', 'Community participation'),
    jsonb_build_object('key', 'support_trends', 'label', 'Support trends'),
    jsonb_build_object('key', 'governance', 'label', 'Governance health'),
    jsonb_build_object('key', 'gp_relationships', 'label', 'Growth Partner relationships')
  );
$$;

create or replace function public._porgbp135_proactive_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Org-level companion highlights trends, encourages reflection, suggests preventative actions — individual nudge delivery remains at /app/proactive-companion-engine',
    'supports', jsonb_build_array(
      jsonb_build_object('key', 'highlight_trends', 'label', 'Highlight aggregate trends'),
      jsonb_build_object('key', 'encourage_reflection', 'label', 'Encourage thoughtful reflection'),
      jsonb_build_object('key', 'suggest_preventative', 'label', 'Suggest preventative actions'),
      jsonb_build_object('key', 'cross_link_a79', 'label', 'Cross-link Proactive Companion A.79', 'route', '/app/proactive-companion-engine')
    ),
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🔔', 'prompt', 'Aipify noticed support volume trending up — shall we review whether teams need additional resources?', 'consideration', 'Anticipatory not alarmist'),
      jsonb_build_object('emoji', '🌿', 'prompt', 'Transformation pace may be creating fatigue — would a lighter change cadence help?', 'consideration', 'Self Love cross-link — patience and recovery'),
      jsonb_build_object('emoji', '📚', 'prompt', 'Knowledge access patterns suggest a refresh opportunity — shall Aipify prepare role-based reinforcement?', 'consideration', 'Proactive knowledge delivery')
    )
  );
$$;

create or replace function public._porgbp135_support_opportunity_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'growth_departments', 'label', 'Growth departments'),
    jsonb_build_object('key', 'transformation_teams', 'label', 'Transformation teams'),
    jsonb_build_object('key', 'leaders', 'label', 'Leaders'),
    jsonb_build_object('key', 'customers', 'label', 'Customer success teams'),
    jsonb_build_object('key', 'gp', 'label', 'Growth Partners'),
    jsonb_build_object('key', 'new_employees', 'label', 'New employees')
  );
$$;

create or replace function public._porgbp135_proactive_knowledge_delivery()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'contextual', 'label', 'Contextual delivery'),
    jsonb_build_object('key', 'role_based', 'label', 'Role-based reinforcement'),
    jsonb_build_object('key', 'learning_reinforcement', 'label', 'Learning reinforcement'),
    jsonb_build_object('key', 'governance_reminders', 'label', 'Governance reminders'),
    jsonb_build_object('key', 'companion_best_practices', 'label', 'Companion best practices'),
    jsonb_build_object('key', 'refreshers', 'label', 'Knowledge refreshers')
  );
$$;

create or replace function public._porgbp135_executive_anticipation_dashboard()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'emerging_risks', 'label', 'Emerging risks'),
    jsonb_build_object('key', 'emerging_opportunities', 'label', 'Emerging opportunities'),
    jsonb_build_object('key', 'support_demands', 'label', 'Support demands'),
    jsonb_build_object('key', 'learning_trends', 'label', 'Learning trends'),
    jsonb_build_object('key', 'transformation_indicators', 'label', 'Transformation indicators'),
    jsonb_build_object('key', 'companion_utilization', 'label', 'Companion utilization'),
    jsonb_build_object('key', 'org_capacity', 'label', 'Organizational capacity')
  );
$$;

create or replace function public._porgbp135_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'empathy', 'label', 'Empathy in early signals'),
    jsonb_build_object('key', 'patience', 'label', 'Patience with change pace'),
    jsonb_build_object('key', 'encouragement', 'label', 'Encouragement not pressure'),
    jsonb_build_object('key', 'balanced_workloads', 'label', 'Balanced workloads awareness'),
    jsonb_build_object('key', 'early_conversations', 'label', 'Early supportive conversations'),
    jsonb_build_object('key', 'compassionate_leadership', 'label', 'Compassionate leadership prompts')
  );
$$;

create or replace function public._porgbp135_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'audit', 'label', 'Full audit trail'),
    jsonb_build_object('key', 'rbac', 'label', 'RBAC visibility gates'),
    jsonb_build_object('key', 'recommendation_history', 'label', 'Recommendation histories'),
    jsonb_build_object('key', 'two_factor', 'label', '2FA cross-link', 'route', '/app/settings/two-factor')
  );
$$;

create or replace function public._porgbp135_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'proactive_companion', 'label', 'Proactive Companion A.79', 'route', '/app/proactive-companion-engine', 'note', 'Individual nudges — cross-link only'),
    jsonb_build_object('key', 'org_health', 'label', 'Organizational Health A.56', 'route', '/app/organizational-health-engine', 'note', 'Health indicators cross-link'),
    jsonb_build_object('key', 'predictive_insights', 'label', 'Predictive Insights A.66', 'route', '/app/predictive-insights-engine', 'note', 'Forecasts cross-link — Phase 135 is anticipatory support'),
    jsonb_build_object('key', 'continuous_improvement', 'label', 'Continuous Improvement Phase 134', 'route', '/app/continuous-improvement-engine', 'note', 'Adaptive organization cross-link'),
    jsonb_build_object('key', 'workflow_orchestration', 'label', 'Workflow Orchestration Phase 133', 'route', '/app/workflow-orchestration-engine', 'note', 'Workflow bottlenecks cross-link'),
    jsonb_build_object('key', 'human_oversight', 'label', 'Human Oversight A.40', 'route', '/app/human-oversight-engine', 'note', 'Governance for automated intervention'),
    jsonb_build_object('key', 'companion_workforce', 'label', 'Companion Workforce Phase 132', 'route', '/app/companion-workforce-engine', 'note', 'Workforce coordination cross-link'),
    jsonb_build_object('key', 'aipify_university', 'label', 'Aipify University Phase 115', 'route', '/app/aipify-university', 'note', 'Learning reinforcement'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'route', '/app/knowledge-center-engine', 'note', 'Proactive knowledge delivery'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Empathy and sustainable pace')
  );
$$;

create or replace function public._porgbp135_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses proactive organization patterns internally — aggregate operational metadata, early signal reviews, and governance-respecting recommendations. No employee surveillance.';
$$;

create or replace function public._porgbp135_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  v_metrics := public._porg_refresh_metrics(p_tenant_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'proactive_center', 'label', 'Proactive Organization Center — eight capabilities', 'met', jsonb_array_length(public._porgbp135_proactive_organization_center()) = 8, 'note', null),
    jsonb_build_object('key', 'signal_types', 'label', 'Early signal engine — eight signal types seeded', 'met', (v_metrics->>'signal_types_count')::int = 8, 'note', null),
    jsonb_build_object('key', 'signals_active', 'label', 'Emerging signals seeded', 'met', (v_metrics->>'signals_active')::int >= 8, 'note', null),
    jsonb_build_object('key', 'support_opportunities', 'label', 'Support opportunities identified', 'met', (v_metrics->>'support_opportunities_open')::int >= 4, 'note', null),
    jsonb_build_object('key', 'pulse_indicators', 'label', 'Organizational pulse — eight dimensions', 'met', (v_metrics->>'pulse_indicators')::int >= 8, 'note', null),
    jsonb_build_object('key', 'recommendations', 'label', 'Preventative recommendations scaffolded', 'met', (v_metrics->>'recommendations_pending')::int >= 4, 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — five never rules', 'met', (v_metrics->>'companion_limitations_count')::int = 5, 'note', null),
    jsonb_build_object('key', 'cross_links', 'label', 'Mandatory integration links documented', 'met', jsonb_array_length(public._porgbp135_integration_links()) >= 10, 'note', null),
    jsonb_build_object('key', 'distinction', 'label', 'Distinction from Proactive Companion A.79 documented', 'met', position('proactive-companion-engine' in public._porgbp135_distinction_note()) > 0, 'note', null)
  );
end; $$;

create or replace function public._porgbp135_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  v_metrics := public._porg_refresh_metrics(p_tenant_id);
  return v_metrics || jsonb_build_object(
    'objectives_count', jsonb_array_length(public._porgbp135_objectives()),
    'center_capabilities', jsonb_array_length(public._porgbp135_proactive_organization_center()),
    'early_signal_types', jsonb_array_length(public._porgbp135_early_signal_engine()),
    'pulse_dimensions', jsonb_array_length(public._porgbp135_organizational_pulse_engine()),
    'integration_links_count', jsonb_array_length(public._porgbp135_integration_links()),
    'privacy_note', public._porgbp135_privacy_note()
  );
end; $$;

create or replace function public._porgbp135_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Care not surveillance',
    'Wisdom before speed',
    'Anticipate with compassion',
    'Humans decide — companions prepare',
    'Organizational patterns — not employee monitoring'
  );
$$;

create or replace function public._porgbp135_privacy_note()
returns text language sql immutable as $$
  select 'Organizational patterns and aggregate metadata only — NOT employee surveillance. No individual monitoring, ranking, or PII in signals or pulse metrics.';
$$;

create or replace function public._porgbp135_blueprint_block(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'phase', '135',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE135_PROACTIVE_ORGANIZATION_ANTICIPATORY_SUPPORT.md',
    'engine_phase', 'Repo Phase 135 — Proactive Organization & Anticipatory Support Engine',
    'route', '/app/proactive-organization-engine',
    'distinction_note', public._porgbp135_distinction_note(),
    'mission', public._porgbp135_mission(),
    'philosophy', public._porgbp135_philosophy(),
    'abos_principle', public._porgbp135_abos_principle(),
    'objectives', public._porgbp135_objectives(),
    'proactive_organization_center', public._porgbp135_proactive_organization_center(),
    'early_signal_engine', public._porgbp135_early_signal_engine(),
    'preventative_support_engine', public._porgbp135_preventative_support_engine(),
    'organizational_pulse_engine', public._porgbp135_organizational_pulse_engine(),
    'proactive_companion', public._porgbp135_proactive_companion(),
    'support_opportunity_engine', public._porgbp135_support_opportunity_engine(),
    'proactive_knowledge_delivery', public._porgbp135_proactive_knowledge_delivery(),
    'executive_anticipation_dashboard', public._porgbp135_executive_anticipation_dashboard(),
    'companion_limitations', public._porg_companion_limitation_rules(),
    'self_love_connection', public._porgbp135_self_love_connection(),
    'security_requirements', public._porgbp135_security_requirements(),
    'integration_links', public._porgbp135_integration_links(),
    'dogfooding', public._porgbp135_dogfooding(),
    'success_criteria', public._porgbp135_success_criteria(p_tenant_id),
    'engagement_summary', public._porgbp135_engagement_summary(p_tenant_id),
    'vision', public._porgbp135_vision(),
    'vision_phrases', public._porgbp135_vision_phrases(),
    'privacy_note', public._porgbp135_privacy_note()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Thin scaffold RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_proactive_organization_signal(
  p_signal_type text, p_title text, p_summary text,
  p_severity text default 'moderate', p_trend_direction text default 'stable',
  p_tenant_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._porg_require_tenant());
  v_key := lower(p_signal_type || '-' || left(md5(p_title), 8));
  insert into public.proactive_organization_signals (
    tenant_id, signal_key, signal_type, title, summary, severity, trend_direction
  ) values (v_tenant_id, v_key, p_signal_type, p_title, left(p_summary, 500), p_severity, p_trend_direction)
  on conflict (tenant_id, signal_key) do update set
    summary = excluded.summary, severity = excluded.severity,
    trend_direction = excluded.trend_direction, updated_at = now()
  returning id into v_id;
  perform public._porg_log_audit(v_tenant_id, 'signal_recorded', p_title, jsonb_build_object('signal_id', v_id));
  return v_id;
end; $$;

create or replace function public.acknowledge_proactive_recommendation(
  p_recommendation_key text, p_status text default 'acknowledged', p_tenant_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._porg_require_tenant());
  if p_status not in ('acknowledged', 'dismissed') then
    raise exception 'Invalid status — use acknowledged or dismissed';
  end if;
  update public.proactive_organization_recommendations
  set status = p_status, updated_at = now()
  where tenant_id = v_tenant_id and recommendation_key = p_recommendation_key
  returning id into v_id;
  if v_id is null then raise exception 'Recommendation not found'; end if;
  perform public._porg_log_audit(v_tenant_id, 'recommendation_' || p_status, p_recommendation_key,
    jsonb_build_object('recommendation_id', v_id, 'status', p_status));
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_proactive_organization_engine_card(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.proactive_organization_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._porg_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_settings := public._porg_ensure_settings(v_tenant_id);
  perform public._porg_seed_signals(v_tenant_id);
  perform public._porg_seed_support_opportunities(v_tenant_id);
  perform public._porg_seed_pulse_snapshots(v_tenant_id);
  perform public._porg_seed_recommendations(v_tenant_id);
  v_metrics := public._porg_refresh_metrics(v_tenant_id);
  v_engagement := public._porgbp135_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'proactive_score', v_metrics->>'proactive_score',
    'signals_active', v_metrics->>'signals_active',
    'support_opportunities_open', v_metrics->>'support_opportunities_open',
    'recommendations_pending', v_metrics->>'recommendations_pending',
    'philosophy', public._porgbp135_philosophy(),
    'human_governance_required', v_settings.human_governance_required,
    'care_not_surveillance_mode', v_settings.care_not_surveillance_mode,
    'proactive_center_enabled', v_settings.proactive_center_enabled,
    'implementation_blueprint', jsonb_build_object(
      'phase', '135',
      'title', 'Proactive Organization & Anticipatory Support',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE135_PROACTIVE_ORGANIZATION_ANTICIPATORY_SUPPORT.md',
      'engine_phase', 'Repo Phase 135',
      'route', '/app/proactive-organization-engine'
    ),
    'proactive_organization_mission', public._porgbp135_mission(),
    'proactive_organization_abos_principle', public._porgbp135_abos_principle(),
    'proactive_organization_engagement_summary', v_engagement,
    'proactive_organization_note', public._porgbp135_distinction_note(),
    'proactive_organization_vision_note', public._porgbp135_vision()
  );
end; $$;

create or replace function public.get_proactive_organization_engine_dashboard(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.proactive_organization_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._porg_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_settings := public._porg_ensure_settings(v_tenant_id);
  perform public._porg_seed_signals(v_tenant_id);
  perform public._porg_seed_support_opportunities(v_tenant_id);
  perform public._porg_seed_pulse_snapshots(v_tenant_id);
  perform public._porg_seed_recommendations(v_tenant_id);
  v_metrics := public._porg_refresh_metrics(v_tenant_id);
  perform public._porg_log_audit(v_tenant_id, 'dashboard_view', 'Proactive Organization dashboard viewed',
    jsonb_build_object('score', v_metrics->>'proactive_score'));

  return jsonb_build_object(
    'has_customer', true,
    'proactive_center_enabled', v_settings.proactive_center_enabled,
    'anticipatory_support_enabled', v_settings.anticipatory_support_enabled,
    'pulse_monitoring_enabled', v_settings.pulse_monitoring_enabled,
    'companion_alerts_enabled', v_settings.companion_alerts_enabled,
    'human_governance_required', v_settings.human_governance_required,
    'care_not_surveillance_mode', v_settings.care_not_surveillance_mode,
    'philosophy', public._porgbp135_philosophy(),
    'safety_note', 'Care not surveillance — organizational patterns only. Humans decide; governance required for automated intervention.',
    'distinction_note', public._porgbp135_distinction_note(),
    'proactive_score', (v_metrics->>'proactive_score')::numeric,
    'signals_active', (v_metrics->>'signals_active')::int,
    'support_opportunities_open', (v_metrics->>'support_opportunities_open')::int,
    'recommendations_pending', (v_metrics->>'recommendations_pending')::int,
    'pulse_indicators', (v_metrics->>'pulse_indicators')::int,
    'avg_pulse_value', (v_metrics->>'avg_pulse_value')::numeric,
    'early_signals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'signal_key', s.signal_key, 'signal_type', s.signal_type,
        'title', s.title, 'summary', s.summary, 'severity', s.severity,
        'trend_direction', s.trend_direction, 'status', s.status
      ) order by s.severity desc)
      from public.proactive_organization_signals s
      where s.tenant_id = v_tenant_id and s.status in ('active', 'monitoring')
    ), '[]'::jsonb),
    'support_opportunities', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id, 'opportunity_key', o.opportunity_key, 'opportunity_type', o.opportunity_type,
        'title', o.title, 'summary', o.summary, 'target_audience', o.target_audience,
        'priority', o.priority, 'status', o.status
      ) order by o.priority desc)
      from public.proactive_organization_support_opportunities o
      where o.tenant_id = v_tenant_id and o.status in ('open', 'in_progress')
    ), '[]'::jsonb),
    'pulse_snapshots', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'snapshot_key', p.snapshot_key, 'pulse_dimension', p.pulse_dimension,
        'summary', p.summary, 'signal_strength', p.signal_strength,
        'trend_pct', p.trend_pct, 'value_numeric', p.value_numeric
      ))
      from public.proactive_organization_pulse_snapshots p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'recommendation_key', r.recommendation_key, 'recommendation_type', r.recommendation_type,
        'title', r.title, 'summary', r.summary, 'status', r.status, 'priority', r.priority
      ) order by r.priority desc)
      from public.proactive_organization_recommendations r
      where r.tenant_id = v_tenant_id and r.status in ('pending', 'acknowledged')
    ), '[]'::jsonb),
    'proactive_organization_center', public._porgbp135_proactive_organization_center(),
    'early_signal_engine', public._porgbp135_early_signal_engine(),
    'preventative_support_engine', public._porgbp135_preventative_support_engine(),
    'organizational_pulse_engine', public._porgbp135_organizational_pulse_engine(),
    'proactive_companion', public._porgbp135_proactive_companion(),
    'support_opportunity_engine', public._porgbp135_support_opportunity_engine(),
    'proactive_knowledge_delivery', public._porgbp135_proactive_knowledge_delivery(),
    'executive_anticipation_dashboard', public._porgbp135_executive_anticipation_dashboard(),
    'companion_limitations', public._porg_companion_limitation_rules(),
    'self_love_connection', public._porgbp135_self_love_connection(),
    'security_requirements', public._porgbp135_security_requirements(),
    'integration_links', public._porgbp135_integration_links(),
    'implementation_blueprint', public._porgbp135_blueprint_block(v_tenant_id),
    'proactive_organization_blueprint', public._porgbp135_blueprint_block(v_tenant_id),
    'proactive_organization_mission', public._porgbp135_mission(),
    'proactive_organization_philosophy', public._porgbp135_philosophy(),
    'proactive_organization_abos_principle', public._porgbp135_abos_principle(),
    'proactive_organization_objectives', public._porgbp135_objectives(),
    'proactive_organization_engagement_summary', public._porgbp135_engagement_summary(v_tenant_id),
    'proactive_organization_success_criteria', public._porgbp135_success_criteria(v_tenant_id),
    'porgbp135_cross_links', public._porgbp135_integration_links(),
    'proactive_organization_vision', public._porgbp135_vision(),
    'proactive_organization_vision_phrases', public._porgbp135_vision_phrases(),
    'proactive_organization_privacy_note', public._porgbp135_privacy_note(),
    'proactive_organization_engine_note', 'Autonomous Organization Era (131–140) — organization-level anticipatory support. Cross-link Proactive Companion A.79 — do not duplicate nudge delivery.'
  );
end; $$;

grant execute on function public.get_proactive_organization_engine_dashboard(uuid) to authenticated;
grant execute on function public.get_proactive_organization_engine_card(uuid) to authenticated;
grant execute on function public.record_proactive_organization_signal(text, text, text, text, text, uuid) to authenticated;
grant execute on function public.acknowledge_proactive_recommendation(text, text, uuid) to authenticated;
grant execute on function public._porgbp135_distinction_note() to authenticated;
grant execute on function public._porgbp135_mission() to authenticated;
grant execute on function public._porgbp135_philosophy() to authenticated;
grant execute on function public._porgbp135_abos_principle() to authenticated;
grant execute on function public._porgbp135_vision() to authenticated;
grant execute on function public._porgbp135_privacy_note() to authenticated;
