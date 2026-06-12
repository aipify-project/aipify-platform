-- Phase 121 — Executive Intelligence & Leadership Companion Engine
-- Enterprise Intelligence Era (121–130) opener — unified Executive Intelligence Center.
-- Distinct from Executive Insights A.35 (/app/executive-insights-engine) and legacy /app/executive.
-- Helpers: _exin_* (engine), _exibp121_* (blueprint — never collide with _eie_*, _ecbp_*, _eoce_*).

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
    'executive_intelligence'
  )
);

-- ---------------------------------------------------------------------------
-- 1. executive_intelligence_settings
-- ---------------------------------------------------------------------------
create table if not exists public.executive_intelligence_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  intelligence_center_enabled boolean not null default true,
  companion_enabled boolean not null default true,
  daily_briefing_enabled boolean not null default true,
  weekly_review_enabled boolean not null default true,
  overload_aware_mode boolean not null default true,
  human_decision_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.executive_intelligence_settings enable row level security;
revoke all on public.executive_intelligence_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. executive_intelligence_briefings
-- ---------------------------------------------------------------------------
create table if not exists public.executive_intelligence_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  briefing_key text not null,
  briefing_type text not null check (
    briefing_type in (
      'daily_executive', 'weekly_leadership', 'monthly_strategic',
      'quarterly_business', 'annual_reflection'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  relevance_note text,
  actionability_note text,
  transparency_note text,
  status text not null default 'draft' check (status in ('draft', 'ready', 'delivered', 'archived')),
  generated_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, briefing_key)
);

create index if not exists executive_intelligence_briefings_tenant_idx
  on public.executive_intelligence_briefings (tenant_id, briefing_type, status);

alter table public.executive_intelligence_briefings enable row level security;
revoke all on public.executive_intelligence_briefings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. executive_intelligence_memory_entries
-- ---------------------------------------------------------------------------
create table if not exists public.executive_intelligence_memory_entries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  memory_key text not null,
  memory_type text not null check (
    memory_type in (
      'past_decision', 'strategic_commitment', 'leadership_priority',
      'lesson_learned', 'meeting_outcome', 'key_discussion',
      'follow_up_obligation', 'important_milestone'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  occurred_at timestamptz,
  status text not null default 'active' check (status in ('active', 'review', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, memory_key)
);

create index if not exists executive_intelligence_memory_entries_tenant_idx
  on public.executive_intelligence_memory_entries (tenant_id, memory_type, status);

alter table public.executive_intelligence_memory_entries enable row level security;
revoke all on public.executive_intelligence_memory_entries from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. executive_intelligence_priority_items
-- ---------------------------------------------------------------------------
create table if not exists public.executive_intelligence_priority_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  priority_key text not null,
  track_type text not null check (
    track_type in (
      'strategic_initiative', 'leadership_commitment', 'cross_dept_dependency',
      'decision_ownership', 'timeline_alignment', 'progress_indicator'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  owner_label text,
  progress_pct numeric(5,2) check (progress_pct between 0 and 100),
  alignment_signal text check (alignment_signal in ('on_track', 'at_risk', 'needs_review', 'blocked')),
  target_date date,
  status text not null default 'active' check (status in ('active', 'paused', 'completed', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, priority_key)
);

create index if not exists executive_intelligence_priority_items_tenant_idx
  on public.executive_intelligence_priority_items (tenant_id, track_type, status);

alter table public.executive_intelligence_priority_items enable row level security;
revoke all on public.executive_intelligence_priority_items from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. executive_intelligence_risk_signals
-- ---------------------------------------------------------------------------
create table if not exists public.executive_intelligence_risk_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  signal_category text not null check (
    signal_category in ('risk', 'opportunity')
  ),
  signal_type text not null check (
    signal_type in (
      'operational_bottleneck', 'governance_concern', 'knowledge_dependency',
      'adoption_challenge', 'customer_retention', 'resource_constraint',
      'leadership_overload', 'growth_opportunity', 'efficiency_gain',
      'partnership_potential', 'innovation_signal', 'market_shift'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  severity text not null default 'moderate' check (
    severity in ('emerging', 'moderate', 'important', 'critical')
  ),
  confidence text not null default 'moderate' check (
    confidence in ('low', 'moderate', 'high')
  ),
  status text not null default 'active' check (status in ('active', 'monitoring', 'resolved', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, signal_key)
);

create index if not exists executive_intelligence_risk_signals_tenant_idx
  on public.executive_intelligence_risk_signals (tenant_id, signal_category, status);

alter table public.executive_intelligence_risk_signals enable row level security;
revoke all on public.executive_intelligence_risk_signals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. executive_intelligence_health_snapshots
-- ---------------------------------------------------------------------------
create table if not exists public.executive_intelligence_health_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  indicator_key text not null,
  indicator_type text not null check (
    indicator_type in (
      'employee_engagement', 'learning_activity', 'customer_satisfaction',
      'companion_utilization', 'knowledge_sharing', 'governance_health',
      'community_participation', 'gp_outcomes'
    )
  ),
  summary text not null check (char_length(summary) <= 500),
  signal_strength text not null default 'moderate' check (
    signal_strength in ('emerging', 'moderate', 'strong', 'needs_attention')
  ),
  trend_pct numeric(6,2),
  value_numeric numeric(8,2),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  snapshot_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, indicator_key)
);

create index if not exists executive_intelligence_health_snapshots_tenant_idx
  on public.executive_intelligence_health_snapshots (tenant_id, indicator_type);

alter table public.executive_intelligence_health_snapshots enable row level security;
revoke all on public.executive_intelligence_health_snapshots from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. executive_intelligence_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.executive_intelligence_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.executive_intelligence_audit_logs enable row level security;
revoke all on public.executive_intelligence_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'executive_intelligence_engine', v.description
from (values
  ('executive_intelligence.view', 'View Executive Intelligence Center', 'View leadership companion dashboard, briefings, and aggregate executive signals'),
  ('executive_intelligence.manage', 'Manage Executive Intelligence Center', 'Configure executive intelligence settings and briefing preferences')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'executive_intelligence.view'), ('owner', 'executive_intelligence.manage'),
  ('administrator', 'executive_intelligence.view'), ('administrator', 'executive_intelligence.manage'),
  ('manager', 'executive_intelligence.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 9. Engine helpers (_exin_*)
-- ---------------------------------------------------------------------------
create or replace function public._exin_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._exin_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._exin_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._exin_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.executive_intelligence_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._exin_ensure_settings(p_tenant_id uuid)
returns public.executive_intelligence_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.executive_intelligence_settings;
begin
  insert into public.executive_intelligence_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.executive_intelligence_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._exin_briefing_type_scaffolds()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'daily_executive', 'label', 'Daily executive brief', 'cadence', 'daily'),
    jsonb_build_object('key', 'weekly_leadership', 'label', 'Weekly leadership review', 'cadence', 'weekly'),
    jsonb_build_object('key', 'monthly_strategic', 'label', 'Monthly strategic review', 'cadence', 'monthly'),
    jsonb_build_object('key', 'quarterly_business', 'label', 'Quarterly business summary', 'cadence', 'quarterly'),
    jsonb_build_object('key', 'annual_reflection', 'label', 'Annual reflection report', 'cadence', 'annual')
  );
$$;

create or replace function public._exin_dashboard_section_scaffolds()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'strategic_objectives', 'label', 'Strategic objectives'),
    jsonb_build_object('key', 'operational_performance', 'label', 'Operational performance'),
    jsonb_build_object('key', 'customer_health', 'label', 'Customer health'),
    jsonb_build_object('key', 'employee_signals', 'label', 'Employee signals'),
    jsonb_build_object('key', 'gp_status', 'label', 'Growth Partner status'),
    jsonb_build_object('key', 'companion_adoption', 'label', 'Companion adoption'),
    jsonb_build_object('key', 'knowledge_trends', 'label', 'Knowledge trends'),
    jsonb_build_object('key', 'governance_indicators', 'label', 'Governance indicators'),
    jsonb_build_object('key', 'emerging_risks', 'label', 'Emerging risks'),
    jsonb_build_object('key', 'emerging_opportunities', 'label', 'Emerging opportunities')
  );
$$;

create or replace function public._exin_companion_limitation_rules()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'override_authority', 'label', 'Never override authority', 'description', 'Executive Companion never overrides human authority'),
    jsonb_build_object('key', 'binding_directives', 'label', 'Never issue binding directives', 'description', 'Companions inform and prepare — humans decide'),
    jsonb_build_object('key', 'hide_uncertainty', 'label', 'Never hide uncertainty', 'description', 'Low confidence always disclosed with escalation guidance'),
    jsonb_build_object('key', 'suppress_dissent', 'label', 'Never suppress dissent', 'description', 'Alternative perspectives encouraged — not silenced'),
    jsonb_build_object('key', 'replace_judgment', 'label', 'Never replace human judgment', 'description', 'Leadership accountability remains with people')
  );
$$;

create or replace function public._exin_communication_support_types()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'leadership_updates', 'label', 'Leadership updates'),
    jsonb_build_object('key', 'strategic_summaries', 'label', 'Strategic summaries'),
    jsonb_build_object('key', 'town_hall_prep', 'label', 'Town hall preparation'),
    jsonb_build_object('key', 'stakeholder_messaging', 'label', 'Stakeholder messaging'),
    jsonb_build_object('key', 'board_briefings', 'label', 'Board briefings'),
    jsonb_build_object('key', 'change_communications', 'label', 'Change communications')
  );
$$;

create or replace function public._exin_seed_briefings(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.executive_intelligence_briefings where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.executive_intelligence_briefings (
    tenant_id, briefing_key, briefing_type, title, summary, relevance_note,
    actionability_note, transparency_note, status, generated_at
  ) values
    (p_tenant_id, 'daily-today', 'daily_executive', 'Daily executive brief',
     'Aggregate operational and strategic metadata summary — clarity not noise. Cross-link Command Center for presence items.',
     'Prioritized for today''s leadership focus.', 'Suggested review actions — humans decide.', 'Sources and confidence disclosed.', 'ready', now()),
    (p_tenant_id, 'weekly-review', 'weekly_leadership', 'Weekly leadership review',
     'Leadership priorities, alignment signals, and follow-up obligations from executive memory metadata.',
     'Weekly cadence for leadership reflection.', 'Review commitments and dependencies.', 'No raw meeting transcripts stored.', 'draft', null),
    (p_tenant_id, 'monthly-strategic', 'monthly_strategic', 'Monthly strategic review',
     'Strategic initiative progress and organizational health aggregate trends — early awareness not surveillance.',
     'Monthly strategic visibility.', 'Alignment review prompts.', 'Aggregate trends only.', 'draft', null),
    (p_tenant_id, 'quarterly-business', 'quarterly_business', 'Quarterly business summary',
     'Quarterly performance metadata across customer health, GP outcomes, and governance indicators.',
     'Quarterly business rhythm.', 'Board-ready summary scaffolds.', 'Metadata summaries only.', 'draft', null),
    (p_tenant_id, 'annual-reflection', 'annual_reflection', 'Annual reflection report',
     'Annual leadership reflection scaffold — lessons learned and milestones from executive memory metadata.',
     'Annual reflection cadence.', 'Intentional decision-making prompts.', 'Growth not evaluation.', 'draft', null);
end; $$;

create or replace function public._exin_seed_memory_entries(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.executive_intelligence_memory_entries where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.executive_intelligence_memory_entries (
    tenant_id, memory_key, memory_type, title, summary, occurred_at, status
  ) values
    (p_tenant_id, 'decision-q1-priority', 'past_decision', 'Q1 strategic priority decision',
     'Leadership chose to prioritize customer retention initiatives — metadata summary, no raw discussion content.', now() - interval '45 days', 'active'),
    (p_tenant_id, 'commitment-gp-expansion', 'strategic_commitment', 'Growth Partner expansion commitment',
     'Commitment to expand GP program with governance alignment — cross-link /app/partners.', now() - interval '30 days', 'active'),
    (p_tenant_id, 'priority-customer-health', 'leadership_priority', 'Customer health visibility priority',
     'Executive priority to improve customer health signal visibility — aggregate trends only.', now() - interval '14 days', 'active'),
    (p_tenant_id, 'lesson-change-adoption', 'lesson_learned', 'Change adoption pacing lesson',
     'Slower rollout reduced overload — lesson captured as metadata for continuity.', now() - interval '60 days', 'active'),
    (p_tenant_id, 'meeting-leadership-sync', 'meeting_outcome', 'Leadership sync outcomes',
     'Three follow-up obligations identified — outcomes metadata only, no transcript.', now() - interval '7 days', 'review'),
    (p_tenant_id, 'discussion-ecosystem', 'key_discussion', 'Ecosystem orchestration discussion',
     'Discussion on ecosystem visibility — cross-link Phase 120 /app/ecosystem-orchestration.', now() - interval '10 days', 'active'),
    (p_tenant_id, 'followup-governance', 'follow_up_obligation', 'Governance review follow-up',
     'Follow-up on governance indicator review — human-owned obligation.', now() - interval '3 days', 'active'),
    (p_tenant_id, 'milestone-university', 'important_milestone', 'Aipify University launch milestone',
     'University continuous learning hub activated — cross-link /app/aipify-university.', now() - interval '20 days', 'active');
end; $$;

create or replace function public._exin_seed_priority_items(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.executive_intelligence_priority_items where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.executive_intelligence_priority_items (
    tenant_id, priority_key, track_type, title, summary, owner_label, progress_pct, alignment_signal, target_date, status
  ) values
    (p_tenant_id, 'init-customer-retention', 'strategic_initiative', 'Customer retention initiative',
     'Strategic initiative tracked for executive visibility — cross-link Customer Success surfaces.', 'Executive sponsor', 62.0, 'on_track', current_date + interval '90 days', 'active'),
    (p_tenant_id, 'commit-leadership-visibility', 'leadership_commitment', 'Leadership visibility commitment',
     'Commitment to weekly leadership review cadence — companion supports, humans accountable.', 'Leadership team', 75.0, 'on_track', null, 'active'),
    (p_tenant_id, 'dep-ops-analytics', 'cross_dept_dependency', 'Operations–Analytics dependency',
     'Cross-department dependency on shared operational metadata — alignment signal only.', 'Ops + Analytics leads', 48.0, 'needs_review', current_date + interval '45 days', 'active'),
    (p_tenant_id, 'owner-governance-review', 'decision_ownership', 'Governance review ownership',
     'Decision ownership for quarterly governance review — cross-link /app/ecosystem-governance.', 'Governance steward', 55.0, 'on_track', current_date + interval '30 days', 'active'),
    (p_tenant_id, 'timeline-q2-goals', 'timeline_alignment', 'Q2 goals timeline alignment',
     'Timeline alignment for Q2 strategic goals — cross-link Strategic Alignment A.55.', 'Strategy lead', 40.0, 'at_risk', current_date + interval '60 days', 'active'),
    (p_tenant_id, 'progress-companion-adoption', 'progress_indicator', 'Companion adoption progress',
     'Companion adoption aggregate indicator — not individual surveillance.', 'Digital workplace lead', 68.0, 'on_track', null, 'active');
end; $$;

create or replace function public._exin_seed_risk_signals(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.executive_intelligence_risk_signals where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.executive_intelligence_risk_signals (
    tenant_id, signal_key, signal_category, signal_type, title, summary, severity, confidence, status
  ) values
    (p_tenant_id, 'risk-ops-bottleneck', 'risk', 'operational_bottleneck', 'Operational workflow bottleneck',
     'Aggregate signal of workflow delays in operations metadata — preparation not fear.', 'moderate', 'moderate', 'active'),
    (p_tenant_id, 'risk-governance-gap', 'risk', 'governance_concern', 'Governance alignment gap',
     'Governance indicator trending below target — cross-link ecosystem governance.', 'important', 'moderate', 'monitoring'),
    (p_tenant_id, 'risk-knowledge-dep', 'risk', 'knowledge_dependency', 'Knowledge dependency concentration',
     'Critical knowledge concentrated in few areas — continuity awareness.', 'moderate', 'high', 'active'),
    (p_tenant_id, 'risk-adoption', 'risk', 'adoption_challenge', 'Companion adoption unevenness',
     'Adoption variance across teams — support not surveillance.', 'emerging', 'moderate', 'active'),
    (p_tenant_id, 'risk-retention', 'risk', 'customer_retention', 'Customer retention signal',
     'Early customer health trend requiring leadership awareness — aggregate only.', 'important', 'moderate', 'monitoring'),
    (p_tenant_id, 'risk-resources', 'risk', 'resource_constraint', 'Resource constraint indicator',
     'Capacity metadata suggests resource attention needed — cross-link capacity engine.', 'moderate', 'low', 'active'),
    (p_tenant_id, 'risk-overload', 'risk', 'leadership_overload', 'Leadership overload awareness',
     'Overload-aware mode active — Self Love cross-link for sustainable leadership.', 'important', 'high', 'active'),
    (p_tenant_id, 'opp-efficiency', 'opportunity', 'efficiency_gain', 'Workflow efficiency opportunity',
     'Aggregate efficiency improvement potential identified — humans evaluate trade-offs.', 'moderate', 'moderate', 'active'),
    (p_tenant_id, 'opp-partnership', 'opportunity', 'partnership_potential', 'Partnership expansion opportunity',
     'GP ecosystem signals suggest partnership potential — cross-link /app/partners.', 'emerging', 'moderate', 'active');
end; $$;

create or replace function public._exin_seed_health_snapshots(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.executive_intelligence_health_snapshots where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.executive_intelligence_health_snapshots (
    tenant_id, indicator_key, indicator_type, summary, signal_strength, trend_pct, value_numeric, confidence
  ) values
    (p_tenant_id, 'engagement-aggregate', 'employee_engagement', 'Employee engagement aggregate trend — early awareness not surveillance.', 'moderate', 2.5, 74.0, 'moderate'),
    (p_tenant_id, 'learning-activity', 'learning_activity', 'Learning activity across Aipify University and training paths — metadata counts.', 'strong', 8.0, 82.0, 'high'),
    (p_tenant_id, 'customer-satisfaction', 'customer_satisfaction', 'Customer satisfaction aggregate signal — no individual customer PII.', 'moderate', 1.2, 78.0, 'moderate'),
    (p_tenant_id, 'companion-util', 'companion_utilization', 'Companion utilization trends — adoption support not ranking.', 'strong', 5.5, 68.0, 'moderate'),
    (p_tenant_id, 'knowledge-sharing', 'knowledge_sharing', 'Knowledge sharing activity from approved sources — cross-link KC.', 'moderate', 4.0, 56.0, 'moderate'),
    (p_tenant_id, 'governance-health', 'governance_health', 'Governance health indicators — cross-link ecosystem governance.', 'moderate', 0.5, 71.0, 'moderate'),
    (p_tenant_id, 'community-participation', 'community_participation', 'Community participation aggregate — cross-link /app/community.', 'emerging', 12.0, 45.0, 'moderate'),
    (p_tenant_id, 'gp-outcomes', 'gp_outcomes', 'Growth Partner outcome metadata — cross-link partner operations.', 'strong', 3.8, 85.0, 'high');
end; $$;

create or replace function public._exin_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_briefings_ready int;
  v_memory_active int;
  v_priorities_active int;
  v_risks_active int;
  v_opportunities_active int;
  v_health_indicators int;
  v_avg_alignment numeric;
  v_intelligence_score numeric;
begin
  select count(*) into v_briefings_ready from public.executive_intelligence_briefings
  where tenant_id = p_tenant_id and status in ('ready', 'delivered');
  select count(*) into v_memory_active from public.executive_intelligence_memory_entries
  where tenant_id = p_tenant_id and status = 'active';
  select count(*) into v_priorities_active from public.executive_intelligence_priority_items
  where tenant_id = p_tenant_id and status = 'active';
  select count(*) into v_risks_active from public.executive_intelligence_risk_signals
  where tenant_id = p_tenant_id and signal_category = 'risk' and status in ('active', 'monitoring');
  select count(*) into v_opportunities_active from public.executive_intelligence_risk_signals
  where tenant_id = p_tenant_id and signal_category = 'opportunity' and status = 'active';
  select count(*) into v_health_indicators from public.executive_intelligence_health_snapshots
  where tenant_id = p_tenant_id;
  select coalesce(avg(progress_pct), 0) into v_avg_alignment
  from public.executive_intelligence_priority_items where tenant_id = p_tenant_id and status = 'active';

  v_intelligence_score := least(100, greatest(0,
    (v_briefings_ready * 8) + (v_memory_active * 4) + (v_priorities_active * 5)
    + (v_health_indicators * 6) + (v_avg_alignment * 0.3) + 15
  ));

  return jsonb_build_object(
    'intelligence_score', round(v_intelligence_score, 1),
    'briefings_ready', v_briefings_ready,
    'memory_entries_active', v_memory_active,
    'priorities_active', v_priorities_active,
    'risks_active', v_risks_active,
    'opportunities_active', v_opportunities_active,
    'health_indicators', v_health_indicators,
    'avg_priority_progress', round(v_avg_alignment, 1),
    'briefing_types_count', jsonb_array_length(public._exin_briefing_type_scaffolds()),
    'dashboard_sections_count', jsonb_array_length(public._exin_dashboard_section_scaffolds()),
    'companion_limitations_count', jsonb_array_length(public._exin_companion_limitation_rules()),
    'communication_types_count', jsonb_array_length(public._exin_communication_support_types())
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Blueprint helpers (_exibp121_*)
-- ---------------------------------------------------------------------------
create or replace function public._exibp121_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 121 — Executive Intelligence & Leadership Companion Engine at /app/executive-intelligence. Unified Executive Intelligence Center — Leadership Companion hub for Enterprise Intelligence Era (121–130). Distinct from Executive Insights A.35 + Blueprints 13/59/66/82 at /app/executive-insights-engine (executive summaries/briefings — cross-link, do NOT duplicate RPCs). Distinct from legacy Executive Dashboard at /app/executive (legacy KPIs — cross-link). Helpers _exibp121_* — never duplicate _eie_*, _ecbp_*, _stbp_* RPCs.';
$$;

create or replace function public._exibp121_mission()
returns text language sql immutable as $$
  select 'Support leadership with clarity, context, perspective, and trusted Executive Companion guidance — wisdom before speed, people first, leadership supported not isolated.';
$$;

create or replace function public._exibp121_philosophy()
returns text language sql immutable as $$
  select 'Leadership is increasingly complex — overload, change, and competing priorities are normal. Aipify is a trusted Executive Companion, not a decision-maker or replacement. Clarity over noise. Humans accountable. Metadata only — no surveillance.';
$$;

create or replace function public._exibp121_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Executive Intelligence Center unifies strategic visibility for leaders. Companions inform, prepare, and challenge respectfully; humans decide. Aggregate trends only — never employee surveillance.';
$$;

create or replace function public._exibp121_vision()
returns text language sql immutable as $$
  select 'Leaders lead with confidence — supported by clarity, continuity, and a trusted Executive Companion that strengthens judgment without replacing it.';
$$;

create or replace function public._exibp121_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'strategic_visibility', 'emoji', '🎯', 'label', 'Strategic visibility', 'description', 'Unified strategic dashboard for leadership clarity'),
    jsonb_build_object('key', 'decision_quality', 'emoji', '⚖️', 'label', 'Decision quality', 'description', 'Context, trade-offs, and historical insights — humans decide'),
    jsonb_build_object('key', 'reduce_overload', 'emoji', '🌿', 'label', 'Reduce overload', 'description', 'Overload-aware briefings and priority filtering'),
    jsonb_build_object('key', 'identify_risks', 'emoji', '🔍', 'label', 'Identify risks', 'description', 'Early risk visibility — preparation not fear'),
    jsonb_build_object('key', 'recognize_opportunities', 'emoji', '✨', 'label', 'Recognize opportunities', 'description', 'Opportunity intelligence from aggregate signals'),
    jsonb_build_object('key', 'organizational_alignment', 'emoji', '🔗', 'label', 'Organizational alignment', 'description', 'Priority alignment across initiatives and commitments'),
    jsonb_build_object('key', 'improve_communication', 'emoji', '💬', 'label', 'Improve communication', 'description', 'Executive communication support — trust not confusion'),
    jsonb_build_object('key', 'lead_with_confidence', 'emoji', '🦉', 'label', 'Lead with confidence', 'description', 'Executive Companion strengthens confidence — never replaces judgment')
  );
$$;

create or replace function public._exibp121_intelligence_center()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'strategic_dashboard', 'label', 'Strategic dashboard'),
    jsonb_build_object('key', 'executive_briefings', 'label', 'Executive briefings'),
    jsonb_build_object('key', 'decision_support', 'label', 'Decision support'),
    jsonb_build_object('key', 'priority_alignment', 'label', 'Priority alignment'),
    jsonb_build_object('key', 'risk_visibility', 'label', 'Risk visibility'),
    jsonb_build_object('key', 'opportunity_intelligence', 'label', 'Opportunity intelligence'),
    jsonb_build_object('key', 'org_health_insights', 'label', 'Organizational health insights'),
    jsonb_build_object('key', 'executive_memory', 'label', 'Executive memory'),
    jsonb_build_object('key', 'leadership_recommendations', 'label', 'Leadership recommendations'),
    jsonb_build_object('key', 'companion_conversations', 'label', 'Companion conversations')
  );
$$;

create or replace function public._exibp121_decision_support()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'relevant_context', 'label', 'Relevant context'),
    jsonb_build_object('key', 'alternative_perspectives', 'label', 'Alternative perspectives'),
    jsonb_build_object('key', 'trade_offs', 'label', 'Trade-offs'),
    jsonb_build_object('key', 'historical_insights', 'label', 'Historical insights'),
    jsonb_build_object('key', 'risk_considerations', 'label', 'Risk considerations'),
    jsonb_build_object('key', 'knowledge_references', 'label', 'Knowledge references'),
    jsonb_build_object('key', 'questions_worth_exploring', 'label', 'Questions worth exploring')
  );
$$;

create or replace function public._exibp121_companion_supports()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'reflection', 'label', 'Reflection'),
    jsonb_build_object('key', 'preparation', 'label', 'Preparation'),
    jsonb_build_object('key', 'strategic_questioning', 'label', 'Strategic questioning'),
    jsonb_build_object('key', 'knowledge_retrieval', 'label', 'Knowledge retrieval'),
    jsonb_build_object('key', 'communication_support', 'label', 'Communication support'),
    jsonb_build_object('key', 'briefing_generation', 'label', 'Briefing generation'),
    jsonb_build_object('key', 'priority_reminders', 'label', 'Priority reminders'),
    jsonb_build_object('key', 'decision_context', 'label', 'Decision context')
  );
$$;

create or replace function public._exibp121_self_love_leadership()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'reflection', 'label', 'Reflection'),
    jsonb_build_object('key', 'recovery', 'label', 'Recovery'),
    jsonb_build_object('key', 'perspective', 'label', 'Perspective'),
    jsonb_build_object('key', 'boundary_awareness', 'label', 'Boundary awareness'),
    jsonb_build_object('key', 'progress_recognition', 'label', 'Progress recognition'),
    jsonb_build_object('key', 'intentional_decisions', 'label', 'Intentional decision-making')
  );
$$;

create or replace function public._exibp121_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'executive_insights', 'label', 'Executive Insights A.35', 'route', '/app/executive-insights-engine', 'note', 'Executive summaries and briefings — cross-link only'),
    jsonb_build_object('key', 'executive_legacy', 'label', 'Executive Dashboard (legacy)', 'route', '/app/executive', 'note', 'Legacy executive KPIs'),
    jsonb_build_object('key', 'command_center', 'label', 'Command Center Phase 26', 'route', '/app/command-center', 'note', 'Presence and notifications'),
    jsonb_build_object('key', 'operations_center', 'label', 'Executive Ops Blueprint 75', 'route', '/app/operations-center-foundation-engine', 'note', 'Executive operations lens'),
    jsonb_build_object('key', 'odse', 'label', 'Organizational Decision Support A.54', 'route', '/app/organizational-decision-support-engine', 'note', 'Org decision register'),
    jsonb_build_object('key', 'dse', 'label', 'Decision Support (assistant)', 'route', '/app/assistant/decisions', 'note', 'Personal decision guidance'),
    jsonb_build_object('key', 'org_health', 'label', 'Organizational Health A.56', 'route', '/app/organizational-health-engine', 'note', 'Health signals cross-link'),
    jsonb_build_object('key', 'strategic_alignment', 'label', 'Strategic Alignment A.55', 'route', '/app/strategic-alignment-engine', 'note', 'Priority alignment cross-link'),
    jsonb_build_object('key', 'briefing', 'label', 'Briefing System', 'route', '/app/briefing', 'note', 'Briefings cross-link'),
    jsonb_build_object('key', 'ecosystem_orchestration', 'label', 'Ecosystem Orchestration Phase 120', 'route', '/app/ecosystem-orchestration', 'note', 'Ecosystem visibility — Era 111–120 capstone'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Leadership wellbeing'),
    jsonb_build_object('key', 'companion_identity', 'label', 'Companion Identity A.84', 'route', '/app/companion-identity-engine', 'note', 'Executive Companion tone')
  );
$$;

create or replace function public._exibp121_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive Companion informs — humans decide and remain accountable',
    'must_never', public._exin_companion_limitation_rules(),
    'required', jsonb_build_array(
      'Disclose uncertainty and confidence levels',
      'Encourage alternative perspectives',
      'Metadata only in memory and briefings',
      'Aggregate org health trends — not individual surveillance',
      'Cross-link specialized engines — never duplicate RPCs'
    ),
    'boundary_note', 'Wisdom before speed. People First. Leadership supported not isolated.'
  );
$$;

create or replace function public._exibp121_companion_adaptation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Challenge respectfully, encourage reflection, promote responsibility, strengthen confidence',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'strategic_review', 'prompt', 'Aipify noticed several priorities competing this week — shall we review what matters most before you decide?', 'consideration', 'Strategic questioning without pressure'),
      jsonb_build_object('emoji', '🌹', 'key', 'overload_aware', 'prompt', 'Leadership overload signals are elevated — would a lighter briefing focus help today?', 'consideration', 'Self Love cross-link — recovery and boundaries'),
      jsonb_build_object('emoji', '🔔', 'key', 'decision_context', 'prompt', 'A past decision on this topic may offer context — shall Aipify summarize the executive memory entry?', 'consideration', 'Historical insights — humans decide'),
      jsonb_build_object('emoji', '❤️', 'key', 'communication_prep', 'prompt', 'Before your stakeholder update — would a draft summary scaffold help you prepare your message?', 'consideration', 'Communication support — trust not confusion')
    )
  );
$$;

create or replace function public._exibp121_success_metrics()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'leadership_clarity', 'label', 'Leadership clarity'),
    jsonb_build_object('key', 'strategic_alignment', 'label', 'Strategic alignment'),
    jsonb_build_object('key', 'reduced_overload', 'label', 'Reduced overload'),
    jsonb_build_object('key', 'decision_confidence', 'label', 'Decision confidence'),
    jsonb_build_object('key', 'communication_quality', 'label', 'Communication quality'),
    jsonb_build_object('key', 'earlier_risk_identification', 'label', 'Earlier risk identification'),
    jsonb_build_object('key', 'organizational_resilience', 'label', 'Organizational resilience'),
    jsonb_build_object('key', 'healthier_leadership', 'label', 'Healthier leadership practices'),
    jsonb_build_object('key', 'long_term_success', 'label', 'Long-term success')
  );
$$;

create or replace function public._exibp121_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  v_metrics := public._exin_refresh_metrics(p_tenant_id);
  return v_metrics || jsonb_build_object(
    'objectives_count', jsonb_array_length(public._exibp121_objectives()),
    'intelligence_center_capabilities', jsonb_array_length(public._exibp121_intelligence_center()),
    'decision_support_provides', jsonb_array_length(public._exibp121_decision_support()),
    'companion_supports_count', jsonb_array_length(public._exibp121_companion_supports()),
    'cross_links_count', jsonb_array_length(public._exibp121_cross_links()),
    'success_metrics_count', jsonb_array_length(public._exibp121_success_metrics()),
    'privacy_note', 'Metadata only — no raw chat, email, meeting transcripts, or employee surveillance.'
  );
end; $$;

create or replace function public._exibp121_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  v_metrics := public._exin_refresh_metrics(p_tenant_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'intelligence_center', 'label', 'Executive Intelligence Center — ten capabilities documented', 'met', jsonb_array_length(public._exibp121_intelligence_center()) = 10, 'note', null),
    jsonb_build_object('key', 'briefing_types', 'label', 'Executive briefings — five types seeded', 'met', (v_metrics->>'briefing_types_count')::int = 5, 'note', null),
    jsonb_build_object('key', 'memory_types', 'label', 'Executive memory — eight capture types', 'met', (v_metrics->>'memory_entries_active')::int >= 8, 'note', null),
    jsonb_build_object('key', 'decision_support', 'label', 'Decision support — seven provides documented', 'met', jsonb_array_length(public._exibp121_decision_support()) = 7, 'note', null),
    jsonb_build_object('key', 'org_health', 'label', 'Organizational health — eight signals seeded', 'met', (v_metrics->>'health_indicators')::int >= 8, 'note', null),
    jsonb_build_object('key', 'priority_alignment', 'label', 'Priority alignment — six track types seeded', 'met', (v_metrics->>'priorities_active')::int >= 6, 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — five never rules', 'met', (v_metrics->>'companion_limitations_count')::int = 5, 'note', null),
    jsonb_build_object('key', 'cross_links', 'label', 'Mandatory cross-links documented', 'met', jsonb_array_length(public._exibp121_cross_links()) >= 12, 'note', null),
    jsonb_build_object('key', 'success_metrics', 'label', 'Success metrics — nine documented', 'met', jsonb_array_length(public._exibp121_success_metrics()) = 9, 'note', null),
    jsonb_build_object('key', 'distinction', 'label', 'Distinction from Executive Insights A.35 documented', 'met', position('executive-insights-engine' in public._exibp121_distinction_note()) > 0, 'note', null)
  );
end; $$;

create or replace function public._exibp121_blueprint_block(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'phase', '121',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE121_EXECUTIVE_INTELLIGENCE_LEADERSHIP_COMPANION.md',
    'engine_phase', 'Repo Phase 121 — Executive Intelligence & Leadership Companion Engine',
    'route', '/app/executive-intelligence',
    'distinction_note', public._exibp121_distinction_note(),
    'mission', public._exibp121_mission(),
    'philosophy', public._exibp121_philosophy(),
    'abos_principle', public._exibp121_abos_principle(),
    'objectives', public._exibp121_objectives(),
    'intelligence_center', public._exibp121_intelligence_center(),
    'dashboard_sections', public._exin_dashboard_section_scaffolds(),
    'briefing_types', public._exin_briefing_type_scaffolds(),
    'decision_support', public._exibp121_decision_support(),
    'companion_supports', public._exibp121_companion_supports(),
    'companion_limitations', public._exin_companion_limitation_rules(),
    'communication_support_types', public._exin_communication_support_types(),
    'self_love_leadership', public._exibp121_self_love_leadership(),
    'cross_links', public._exibp121_cross_links(),
    'limitation_principles', public._exibp121_limitation_principles(),
    'companion_adaptation', public._exibp121_companion_adaptation(),
    'success_metrics', public._exibp121_success_metrics(),
    'success_criteria', public._exibp121_success_criteria(p_tenant_id),
    'vision', public._exibp121_vision(),
    'engagement_summary', public._exibp121_engagement_summary(p_tenant_id),
    'privacy_note', 'Metadata only — aggregate trends, no raw chat/email/PII, no employee surveillance.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_executive_intelligence_card(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.executive_intelligence_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._exin_tenant_for_auth());
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_settings := public._exin_ensure_settings(v_tenant_id);
  perform public._exin_seed_briefings(v_tenant_id);
  perform public._exin_seed_memory_entries(v_tenant_id);
  perform public._exin_seed_priority_items(v_tenant_id);
  perform public._exin_seed_risk_signals(v_tenant_id);
  perform public._exin_seed_health_snapshots(v_tenant_id);
  v_metrics := public._exin_refresh_metrics(v_tenant_id);
  v_engagement := public._exibp121_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'intelligence_score', v_metrics->>'intelligence_score',
    'briefings_ready', v_metrics->>'briefings_ready',
    'priorities_active', v_metrics->>'priorities_active',
    'risks_active', v_metrics->>'risks_active',
    'philosophy', public._exibp121_philosophy(),
    'human_decision_required', v_settings.human_decision_required,
    'companion_enabled', v_settings.companion_enabled,
    'overload_aware_mode', v_settings.overload_aware_mode,
    'implementation_blueprint', jsonb_build_object(
      'phase', '121',
      'title', 'Executive Intelligence & Leadership Companion',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE121_EXECUTIVE_INTELLIGENCE_LEADERSHIP_COMPANION.md',
      'engine_phase', 'Repo Phase 121',
      'route', '/app/executive-intelligence'
    ),
    'executive_intelligence_mission', public._exibp121_mission(),
    'executive_intelligence_abos_principle', public._exibp121_abos_principle(),
    'executive_intelligence_engagement_summary', v_engagement,
    'executive_intelligence_note', public._exibp121_distinction_note(),
    'executive_intelligence_vision_note', public._exibp121_vision()
  );
end; $$;

create or replace function public.get_executive_intelligence_dashboard(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.executive_intelligence_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._exin_tenant_for_auth());
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_settings := public._exin_ensure_settings(v_tenant_id);
  perform public._exin_seed_briefings(v_tenant_id);
  perform public._exin_seed_memory_entries(v_tenant_id);
  perform public._exin_seed_priority_items(v_tenant_id);
  perform public._exin_seed_risk_signals(v_tenant_id);
  perform public._exin_seed_health_snapshots(v_tenant_id);
  v_metrics := public._exin_refresh_metrics(v_tenant_id);
  perform public._exin_log_audit(v_tenant_id, 'dashboard_view', 'Executive Intelligence dashboard viewed', jsonb_build_object('score', v_metrics->>'intelligence_score'));

  return jsonb_build_object(
    'has_customer', true,
    'intelligence_center_enabled', v_settings.intelligence_center_enabled,
    'companion_enabled', v_settings.companion_enabled,
    'daily_briefing_enabled', v_settings.daily_briefing_enabled,
    'weekly_review_enabled', v_settings.weekly_review_enabled,
    'overload_aware_mode', v_settings.overload_aware_mode,
    'human_decision_required', v_settings.human_decision_required,
    'philosophy', public._exibp121_philosophy(),
    'safety_note', 'Executive Companion informs — humans decide. Metadata only — no surveillance.',
    'distinction_note', public._exibp121_distinction_note(),
    'intelligence_score', (v_metrics->>'intelligence_score')::numeric,
    'briefings_ready', (v_metrics->>'briefings_ready')::int,
    'memory_entries_active', (v_metrics->>'memory_entries_active')::int,
    'priorities_active', (v_metrics->>'priorities_active')::int,
    'risks_active', (v_metrics->>'risks_active')::int,
    'opportunities_active', (v_metrics->>'opportunities_active')::int,
    'health_indicators', (v_metrics->>'health_indicators')::int,
    'avg_priority_progress', (v_metrics->>'avg_priority_progress')::numeric,
    'dashboard_sections', public._exin_dashboard_section_scaffolds(),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', b.id, 'briefing_key', b.briefing_key, 'briefing_type', b.briefing_type,
        'title', b.title, 'summary', b.summary, 'status', b.status,
        'relevance_note', b.relevance_note, 'actionability_note', b.actionability_note
      ) order by b.created_at)
      from public.executive_intelligence_briefings b where b.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'memory_entries', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'memory_key', m.memory_key, 'memory_type', m.memory_type,
        'title', m.title, 'summary', m.summary, 'status', m.status, 'occurred_at', m.occurred_at
      ) order by m.occurred_at desc nulls last)
      from public.executive_intelligence_memory_entries m where m.tenant_id = v_tenant_id and m.status != 'archived'
    ), '[]'::jsonb),
    'priority_items', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'priority_key', p.priority_key, 'track_type', p.track_type,
        'title', p.title, 'summary', p.summary, 'owner_label', p.owner_label,
        'progress_pct', p.progress_pct, 'alignment_signal', p.alignment_signal, 'status', p.status
      ) order by p.progress_pct desc nulls last)
      from public.executive_intelligence_priority_items p where p.tenant_id = v_tenant_id and p.status = 'active'
    ), '[]'::jsonb),
    'risk_signals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'signal_key', r.signal_key, 'signal_category', r.signal_category,
        'signal_type', r.signal_type, 'title', r.title, 'summary', r.summary,
        'severity', r.severity, 'confidence', r.confidence, 'status', r.status
      ) order by r.severity desc)
      from public.executive_intelligence_risk_signals r
      where r.tenant_id = v_tenant_id and r.signal_category = 'risk' and r.status in ('active', 'monitoring')
    ), '[]'::jsonb),
    'opportunity_signals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'signal_key', r.signal_key, 'signal_type', r.signal_type,
        'title', r.title, 'summary', r.summary, 'severity', r.severity, 'confidence', r.confidence
      ))
      from public.executive_intelligence_risk_signals r
      where r.tenant_id = v_tenant_id and r.signal_category = 'opportunity' and r.status = 'active'
    ), '[]'::jsonb),
    'health_snapshots', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', h.id, 'indicator_key', h.indicator_key, 'indicator_type', h.indicator_type,
        'summary', h.summary, 'signal_strength', h.signal_strength,
        'trend_pct', h.trend_pct, 'value_numeric', h.value_numeric, 'confidence', h.confidence
      ))
      from public.executive_intelligence_health_snapshots h where h.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'decision_support_meta', public._exibp121_decision_support(),
    'companion_supports', public._exibp121_companion_supports(),
    'companion_limitations', public._exin_companion_limitation_rules(),
    'communication_support_types', public._exin_communication_support_types(),
    'self_love_leadership', public._exibp121_self_love_leadership(),
    'integration_links', public._exibp121_cross_links(),
    'implementation_blueprint', public._exibp121_blueprint_block(v_tenant_id),
    'executive_intelligence_blueprint', public._exibp121_blueprint_block(v_tenant_id),
    'executive_intelligence_mission', public._exibp121_mission(),
    'executive_intelligence_philosophy', public._exibp121_philosophy(),
    'executive_intelligence_abos_principle', public._exibp121_abos_principle(),
    'executive_intelligence_objectives', public._exibp121_objectives(),
    'executive_intelligence_intelligence_center', public._exibp121_intelligence_center(),
    'executive_intelligence_limitation_principles', public._exibp121_limitation_principles(),
    'executive_intelligence_companion_adaptation', public._exibp121_companion_adaptation(),
    'executive_intelligence_engagement_summary', public._exibp121_engagement_summary(v_tenant_id),
    'executive_intelligence_success_criteria', public._exibp121_success_criteria(v_tenant_id),
    'executive_intelligence_success_metrics', public._exibp121_success_metrics(),
    'exibp121_cross_links', public._exibp121_cross_links(),
    'executive_intelligence_vision', public._exibp121_vision(),
    'executive_intelligence_privacy_note', 'Metadata only — aggregate trends, no raw chat/email/PII, no employee surveillance.',
    'executive_intelligence_engine_note', 'Enterprise Intelligence Era (121–130) — unified Executive Intelligence Center. Cross-link Executive Insights A.35 — do not duplicate RPCs.'
  );
end; $$;

grant execute on function public.get_executive_intelligence_dashboard(uuid) to authenticated;
grant execute on function public.get_executive_intelligence_card(uuid) to authenticated;
grant execute on function public._exibp121_distinction_note() to authenticated;
grant execute on function public._exibp121_mission() to authenticated;
grant execute on function public._exibp121_philosophy() to authenticated;
grant execute on function public._exibp121_abos_principle() to authenticated;
grant execute on function public._exibp121_vision() to authenticated;
