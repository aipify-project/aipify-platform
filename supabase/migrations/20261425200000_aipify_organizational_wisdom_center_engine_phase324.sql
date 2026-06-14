-- Phase 324 — Organizational Wisdom Center Engine
-- Feature owner: Customer App — /app/executive/organizational-wisdom
-- Helpers: _owc_* (engine), _owcbp324_* (blueprint)
-- Cross-links executive/knowledge centers — does NOT modify their RPCs

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
    'aipify_status_institutional_memory_engine', 'enterprise_readiness_engine',
    'learning_training_engine', 'organizational_memory_engine',
    'enterprise_deployment_device_rollout_engine',
    'innovation_impact_engine', 'compliance_regulatory_readiness_engine',
    'strategic_intelligence_foundation_engine', 'trust_center_foundation_engine',
    'continuous_improvement_engine', 'mentorship_engine',
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
    'audience_targeting_checkpoints_engine',
    'risk_center',
    'capability_maturity_engine',
    'organizational_benchmarking_engine',
    'document_output_engine',
    'records_retention_management_engine',
    'meeting_collaboration_intelligence_engine',
    'unified_task_follow_up_engine',
    'human_approval_gates_engine',
    'capacity_workload_management_engine',
    'goals_okr_engine',
    'predictive_insights_engine',
    'personal_productivity_engine',
    'companion_presence_indicator_engine',
    'cross_tenant_intelligence_engine',
    'partner_success_engine',
    'relationship_intelligence_engine',
    'ethical_evolution_guardianship_engine',
    'ai_cost_governance_engine',
    'organization_workspace_engine',
    'proactive_companion_engine',
    'priority_focus_engine',
    'growth_evolution_engine',
    'purpose_values_engine',
    'inclusion_mentorship_engine',
    'companion_identity_engine',
    'impact_engine',
    'guardianship_engine',
    'curiosity_discovery_engine',
    'wonder_engine',
    'presence_comfort_protocol',
    'dedication_engine',
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
    'proactive_organization',
    'collective_decision_council',
    'human_potential_augmented_work',
    'augmented_organization',
    'global_knowledge_exchange',
    'global_ecosystem_marketplace',
    'future_leaders_engine',
    'organizational_sensemaking_engine',
    'living_enterprise_engine',
    'civic_collaboration_engine',
    'cross_sector_intelligence_engine',
    'civilizational_memory_engine',
    'legacy_engine',
    'civilizational_foresight_engine',
    'civilizational_coordination_engine',
    'shared_prosperity_engine',
    'constructive_dialogue_engine',
    'humanity_shared_compassion_reciprocal_care_engine',
    'humanity_shared_courage_responsible_action_engine',
    'humanity_shared_gratitude_appreciative_stewardship_engine',
    'humanity_shared_humility_continuous_renewal_engine',
    'humanity_shared_legacy_flourishing_engine',
    'human_hope_possibility_engine',
    'human_wonder_exploration_engine',
    'human_legacy_eternal_stewardship_engine',
    'universal_stewardship_shared_futures_engine',
    'humanity_collective_wisdom_shared_learning_engine',
    'humanity_shared_purpose_contribution_engine',
    'humanity_shared_resilience_adaptive_capacity_engine',
    'humanity_shared_trust_cooperative_intelligence_engine',
    'human_flourishing_engine',
    'multi_generational_futures_engine',
    'intergenerational_guardianship_engine',
    'human_identity_meaning_engine',
    'human_creativity_imagination_engine',
    'human_wisdom_augmented_judgment_engine',
    'human_agency_responsible_autonomy_engine',
    'human_dignity_humility_engine',
    'aipify_constitution_perpetual_principles_engine',
    'aipify_ethical_evolution_responsible_innovation_engine',
    'aipify_guardianship_succession_engine',
    'aipify_legacy_preservation_knowledge_continuity_engine',
    'aipify_values_transmission_cultural_continuity_engine',
    'aipify_principles_enforcement_engine',
    'aipify_decision_transparency_engine',
    'aipify_organizational_health_early_warning_engine',
    'aipify_audience_targeting_checkpoints_prioritization_engine',
    'aipify_digital_headquarters_engine',
    'aipify_knowledge_discovery_intelligent_search_engine',
    'aipify_risk_center_execution_engine',
    'aipify_decision_center_governance_engine',
    'aipify_operations_orchestration_engine',
    'aipify_resource_capacity_workload_balance_engine',
    'aipify_enterprise_organizational_consciousness_engine',
    'aipify_enterprise_printing_document_output_engine',
    'universal_action_access_framework',
    'aipify_enterprise_packaging_upgrade_instant_access_engine',
    'pilot_learning_customer_zero_engine',
    'aipify_install_business_discovery_engine',
    'aipify_first_day_experience_engine',
    'aipify_trust_acceleration_adoption_engine',
    'aipify_companion_marketplace_action_ecosystem_engine',
    'aipify_life_events_proactive_care_engine',
    'aipify_companion_identity_relationship_engine',
    'aipify_companion_presence_continuity_engine',
    'aipify_companion_action_marketplace_engine',
    'aipify_companion_action_memory_engine',
    'aipify_companion_approval_profiles_engine',
    'aipify_companion_financial_guardrails_engine',
    'aipify_companion_orchestration_engine',
    'aipify_automation_control_center_engine',
    'aipify_approval_human_oversight_center_engine',
    'aipify_permission_access_governance_engine',
    'aipify_trust_transparency_center_engine',
    'aipify_executive_decision_support_engine',
    'aipify_executive_strategic_intelligence_engine',
    'aipify_organizational_memory_center_engine',
    'aipify_continuous_improvement_center_engine',
    'aipify_organizational_resilience_center_engine',
    'aipify_opportunity_discovery_center_engine',
    'aipify_organizational_health_center_engine',
    'aipify_database_governance_migration_engine',
    'aipify_deployment_governance_engine',
    'aipify_platform_observability_engine',
    'aipify_incident_command_recovery_engine',
    'aipify_change_management_center_engine',
    'aipify_organizational_digital_twin_center_engine',
    'aipify_organizational_learning_center_engine',
    'aipify_knowledge_evolution_center_engine',
    'aipify_capability_maturity_center_engine',
    'aipify_execution_excellence_center_engine',
    'aipify_organizational_alignment_center_engine',
    'aipify_organizational_focus_center_engine',
    'aipify_organizational_energy_center_engine',
    'aipify_organizational_adaptability_center_engine',
    'aipify_organizational_wisdom_center_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_owc_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  review_cadence text not null default 'monthly' check (
    review_cadence in ('monthly', 'quarterly', 'annual')
  ),
  metadata jsonb not null default '{"metadata_only":true,"no_artificial_certainty":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_owc_center_settings enable row level security;
revoke all on public.aipify_owc_center_settings from authenticated, anon;

create table if not exists public.aipify_owc_center_lessons (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  lesson_key text not null,
  domain text not null check (domain in (
    'strategic', 'operational', 'leadership', 'customer', 'organizational'
  )),
  title text not null,
  summary text not null default '',
  integrated_at timestamptz not null default now(),
  status text not null default 'integrated' check (status in ('integrated', 'archived')),
  unique (tenant_id, lesson_key)
);
alter table public.aipify_owc_center_lessons enable row level security;
revoke all on public.aipify_owc_center_lessons from authenticated, anon;

create table if not exists public.aipify_owc_center_reflections (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  reflection_key text not null,
  prompt text not null,
  domain text not null default 'leadership' check (domain in (
    'strategic', 'operational', 'leadership', 'customer', 'organizational'
  )),
  sort_order int not null default 0,
  unique (tenant_id, reflection_key)
);
alter table public.aipify_owc_center_reflections enable row level security;
revoke all on public.aipify_owc_center_reflections from authenticated, anon;

create table if not exists public.aipify_owc_center_values (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  value_key text not null,
  label text not null,
  guidance text not null default '',
  sort_order int not null default 0,
  unique (tenant_id, value_key)
);
alter table public.aipify_owc_center_values enable row level security;
revoke all on public.aipify_owc_center_values from authenticated, anon;

create table if not exists public.aipify_owc_center_patterns (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  pattern_key text not null,
  domain text not null check (domain in (
    'strategic', 'operational', 'leadership', 'customer', 'organizational'
  )),
  label text not null,
  summary text not null default '',
  unique (tenant_id, pattern_key)
);
alter table public.aipify_owc_center_patterns enable row level security;
revoke all on public.aipify_owc_center_patterns from authenticated, anon;

create table if not exists public.aipify_owc_center_synthesis (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  source_key text not null,
  source_label text not null,
  route_path text not null default '',
  summary text not null default '',
  unique (tenant_id, source_key)
);
alter table public.aipify_owc_center_synthesis enable row level security;
revoke all on public.aipify_owc_center_synthesis from authenticated, anon;

create table if not exists public.aipify_owc_center_timeline (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  timeline_key text not null,
  event_type text not null check (event_type in (
    'major_lesson', 'significant_decision', 'cultural_milestone',
    'strategic_turning_point', 'leadership_reflection'
  )),
  label text not null,
  summary text not null default '',
  recorded_at timestamptz not null default now(),
  unique (tenant_id, timeline_key)
);
alter table public.aipify_owc_center_timeline enable row level security;
revoke all on public.aipify_owc_center_timeline from authenticated, anon;

create table if not exists public.aipify_owc_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  domain text not null default 'organizational' check (domain in (
    'strategic', 'operational', 'leadership', 'customer', 'organizational'
  )),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  unique (tenant_id, insight_key)
);
alter table public.aipify_owc_center_insights enable row level security;
revoke all on public.aipify_owc_center_insights from authenticated, anon;

create table if not exists public.aipify_owc_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_owc_center_recommendations enable row level security;
revoke all on public.aipify_owc_center_recommendations from authenticated, anon;

create table if not exists public.aipify_owc_center_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in (
    'monthly', 'quarterly', 'annual', 'executive_learning'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, review_key)
);
alter table public.aipify_owc_center_reviews enable row level security;
revoke all on public.aipify_owc_center_reviews from authenticated, anon;

create table if not exists public.aipify_owc_center_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  snapshot_key text not null,
  period_label text not null default 'Current period',
  wisdom_score int not null default 0,
  summary text not null default '',
  captured_at timestamptz not null default now(),
  unique (tenant_id, snapshot_key)
);
alter table public.aipify_owc_center_snapshots enable row level security;
revoke all on public.aipify_owc_center_snapshots from authenticated, anon;

create table if not exists public.aipify_owc_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'reflection_completed', 'wisdom_report_generated', 'historical_insight_referenced',
    'leadership_discussion', 'recommendation_surfaced', 'milestone_archived',
    'governance_override', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_owc_center_audit_logs enable row level security;
revoke all on public.aipify_owc_center_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_organizational_wisdom_center_engine', v.description
from (values
  ('org_wisdom.view', 'View Wisdom Center', 'Review organizational wisdom insights and reflection guidance'),
  ('org_wisdom.manage', 'Manage Wisdom Center', 'Schedule reviews, generate reports, and coordinate discussions'),
  ('org_wisdom.contribute', 'Contribute Wisdom Observations', 'Submit lessons learned and reflection notes')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'org_wisdom.view'), ('owner', 'org_wisdom.manage'), ('owner', 'org_wisdom.contribute'),
  ('administrator', 'org_wisdom.view'), ('administrator', 'org_wisdom.manage'), ('administrator', 'org_wisdom.contribute'),
  ('manager', 'org_wisdom.view'), ('manager', 'org_wisdom.manage'),
  ('employee', 'org_wisdom.view'),
  ('support_agent', 'org_wisdom.view'), ('moderator', 'org_wisdom.view'), ('viewer', 'org_wisdom.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_organizational_wisdom_center_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_organizational_wisdom_center_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _owcbp324_*
-- ---------------------------------------------------------------------------
create or replace function public._owcbp324_core_principle() returns text language sql immutable as $$
  select 'Knowledge explains what happened. Wisdom helps determine what should be considered next. Aipify should help organizations mature in judgment, not merely accumulate information.';
$$;

create or replace function public._owcbp324_philosophy() returns text language sql immutable as $$
  select 'Wisdom emerges from experience, reflection, learning, context, values, and humility — Aipify supports thoughtful leadership without pretending certainty.';
$$;

create or replace function public._owcbp324_vision() returns text language sql immutable as $$
  select 'Help leaders draw upon experience, values, and learning so decisions are guided by thoughtful consideration of what matters most.';
$$;

create or replace function public._owcbp324_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'strategic', 'label', 'Strategic wisdom'),
    jsonb_build_object('key', 'operational', 'label', 'Operational wisdom'),
    jsonb_build_object('key', 'leadership', 'label', 'Leadership wisdom'),
    jsonb_build_object('key', 'customer', 'label', 'Customer wisdom'),
    jsonb_build_object('key', 'organizational', 'label', 'Organizational wisdom')
  );
$$;

create or replace function public._owcbp324_health_label(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'exceptional'
    when p_score >= 75 then 'strong'
    when p_score >= 60 then 'maturing'
    when p_score >= 40 then 'developing'
    else 'emerging'
  end;
$$;

create or replace function public._owcbp324_privacy_note() returns text language sql immutable as $$
  select 'Wisdom Center stores organizational metadata and lesson summaries only — never artificial certainty, opinions as facts, or replacement of executive judgment.';
$$;

create or replace function public._owcbp324_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 324 — Organizational Wisdom Center Engine',
    'route', '/app/executive/organizational-wisdom',
    'core_principle', public._owcbp324_core_principle(),
    'philosophy', public._owcbp324_philosophy(),
    'vision', public._owcbp324_vision(),
    'domains', public._owcbp324_domains(),
    'privacy_note', public._owcbp324_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _owc_*
-- ---------------------------------------------------------------------------
create or replace function public._owc_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._owc_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_owc_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._owc_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_owc_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_owc_center_lessons (
    tenant_id, lesson_key, domain, title, summary
  ) values
  (p_tenant, 'les_1', 'strategic', 'Phased implementation improves adoption', 'Past initiatives suggest that phased implementation improves adoption.', now() - interval '90 days'),
  (p_tenant, 'les_2', 'operational', 'Early stakeholder involvement', 'Historical reviews emphasize the importance of early stakeholder involvement.', now() - interval '60 days'),
  (p_tenant, 'les_3', 'leadership', 'Values-aligned decisions succeed', 'Several successful decisions demonstrated strong alignment with organizational values.', now() - interval '30 days')
  on conflict do nothing;

  insert into public.aipify_owc_center_reflections (
    tenant_id, reflection_key, prompt, domain, sort_order
  ) values
  (p_tenant, 'ref_1', 'What have we learned from similar situations?', 'strategic', 1),
  (p_tenant, 'ref_2', 'Which values should guide this decision?', 'leadership', 2),
  (p_tenant, 'ref_3', 'What unintended consequences should be considered?', 'operational', 3),
  (p_tenant, 'ref_4', 'How might this affect the organization long term?', 'strategic', 4),
  (p_tenant, 'ref_5', 'What historical lessons remain relevant?', 'organizational', 5)
  on conflict do nothing;

  insert into public.aipify_owc_center_values (
    tenant_id, value_key, label, guidance, sort_order
  ) values
  (p_tenant, 'val_purpose', 'Organizational purpose', 'Consider alignment with long-term purpose and mission.', 1),
  (p_tenant, 'val_culture', 'Cultural principles', 'Evaluate decisions against established cultural principles.', 2),
  (p_tenant, 'val_customer', 'Customer commitments', 'Honor customer commitments and trust expectations.', 3),
  (p_tenant, 'val_longterm', 'Long-term implications', 'Weigh long-term organizational implications.', 4)
  on conflict do nothing;

  insert into public.aipify_owc_center_patterns (
    tenant_id, pattern_key, domain, label, summary
  ) values
  (p_tenant, 'pat_1', 'strategic', 'Stakeholder involvement pattern', 'Decisions with early stakeholder involvement tend to achieve stronger outcomes.'),
  (p_tenant, 'pat_2', 'operational', 'Phased rollout pattern', 'Phased implementation consistently improves adoption and sustainability.'),
  (p_tenant, 'pat_3', 'organizational', 'Values alignment pattern', 'Values-aligned decisions demonstrate higher leadership confidence.')
  on conflict do nothing;

  insert into public.aipify_owc_center_synthesis (
    tenant_id, source_key, source_label, route_path, summary
  ) values
  (p_tenant, 'src_memory', 'Organizational Memory', '/app/executive/organizational-memory', 'Institutional memory and historical context.'),
  (p_tenant, 'src_learning', 'Organizational Learning', '/app/knowledge-center/organizational-learning', 'Learning outcomes and development patterns.'),
  (p_tenant, 'src_evolution', 'Knowledge Evolution', '/app/knowledge-center/knowledge-evolution', 'Knowledge maturity and evolution trends.'),
  (p_tenant, 'src_intel', 'Strategic Intelligence', '/app/executive/strategic-intelligence', 'Strategic intelligence and foresight context.'),
  (p_tenant, 'src_decisions', 'Decision Support', '/app/executive/decision-support', 'Decision review metadata and reasoning patterns.')
  on conflict do nothing;

  insert into public.aipify_owc_center_timeline (
    tenant_id, timeline_key, event_type, label, summary, recorded_at
  ) values
  (p_tenant, 'tl_1', 'major_lesson', 'Phased rollout lesson integrated', 'Organization integrated phased implementation lesson from prior initiative.', now() - interval '90 days'),
  (p_tenant, 'tl_2', 'significant_decision', 'Strategic pivot with stakeholder alignment', 'Major decision guided by historical stakeholder involvement pattern.', now() - interval '45 days'),
  (p_tenant, 'tl_3', 'leadership_reflection', 'Quarterly wisdom session', 'Leadership reflection strengthened institutional maturity.', now() - interval '14 days')
  on conflict do nothing;

  insert into public.aipify_owc_center_insights (tenant_id, insight_key, message, domain, priority) values
  (p_tenant, 'ins_1', 'Past initiatives suggest that phased implementation improves adoption.', 'strategic', 'high'),
  (p_tenant, 'ins_2', 'Historical reviews emphasize the importance of early stakeholder involvement.', 'operational', 'medium'),
  (p_tenant, 'ins_3', 'Several successful decisions demonstrated strong alignment with organizational values.', 'leadership', 'medium')
  on conflict do nothing;

  insert into public.aipify_owc_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_1', 'This decision resembles previous situations where stakeholder involvement improved outcomes.', 'medium'),
  (p_tenant, 'rec_2', 'Several historical lessons may provide valuable context.', 'high'),
  (p_tenant, 'rec_3', 'Reflection practices continue to strengthen leadership maturity.', 'low')
  on conflict do nothing;

  insert into public.aipify_owc_center_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev_m', 'monthly', 'Monthly leadership reflection — lessons, values, and perspective.', 'pending'),
  (p_tenant, 'rev_q', 'quarterly', 'Quarterly wisdom session — institutional maturity and learning.', 'pending'),
  (p_tenant, 'rev_exec', 'executive_learning', 'Executive learning discussion — wisdom and judgment.', 'pending')
  on conflict (tenant_id, review_key) do nothing;

  insert into public.aipify_owc_center_snapshots (
    tenant_id, snapshot_key, period_label, wisdom_score, summary, captured_at
  ) values
  (p_tenant, 'snap_q', 'Current quarter', 79, 'Organizational wisdom snapshot for current quarter.', now()),
  (p_tenant, 'snap_prev', 'Previous quarter', 75, 'Previous quarter wisdom snapshot.', now() - interval '90 days')
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._owc_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with les as (
    select count(*) filter (where status = 'integrated') as integrated_count,
      count(*) as total_count
    from public.aipify_owc_center_lessons where tenant_id = p_tenant
  ),
  rev as (
    select count(*) filter (where status = 'completed') as completed_count
    from public.aipify_owc_center_reviews where tenant_id = p_tenant
  ),
  ins as (
    select count(*) as insight_count
    from public.aipify_owc_center_insights where tenant_id = p_tenant and status = 'open'
  )
  select jsonb_build_object(
    'wisdom_score', least(100, coalesce((select integrated_count from les), 0) * 15 + coalesce((select completed_count from rev), 0) * 10 + 40),
    'wisdom_health_label', public._owcbp324_health_label(least(100, coalesce((select integrated_count from les), 0) * 15 + coalesce((select completed_count from rev), 0) * 10 + 40)::int),
    'insights_generated', coalesce((select insight_count from ins), 0),
    'lessons_integrated', coalesce((select integrated_count from les), 0),
    'reflection_participation_pct', 68,
    'historical_patterns', coalesce((select count(*) from public.aipify_owc_center_patterns where tenant_id = p_tenant), 0),
    'executive_learning_trend_pct', 74,
    'decision_quality_satisfaction', 4.4,
    'leadership_confidence', 4.3,
    'companion_usefulness_rating', 4.4,
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_wisdom_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._owc_require_tenant());
  perform public._irp_require_permission('org_wisdom.view', v_tenant);

  if not exists (select 1 from public.aipify_owc_center_lessons where tenant_id = v_tenant limit 1) then
    v_seed := public._owc_seed(v_tenant);
  end if;

  perform public._owc_log(v_tenant, 'view_center', 'Wisdom Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/organizational-wisdom',
    'dashboard', public._owc_dashboard_metrics(v_tenant),
    'lessons', coalesce((select jsonb_agg(jsonb_build_object(
      'lesson_key', l.lesson_key, 'domain', l.domain, 'title', l.title,
      'summary', l.summary, 'integrated_at', l.integrated_at
    ) order by l.integrated_at desc) from public.aipify_owc_center_lessons l
      where l.tenant_id = v_tenant and l.status = 'integrated'), '[]'::jsonb),
    'reflection_prompts', coalesce((select jsonb_agg(jsonb_build_object(
      'reflection_key', r.reflection_key, 'prompt', r.prompt, 'domain', r.domain
    ) order by r.sort_order) from public.aipify_owc_center_reflections r where r.tenant_id = v_tenant), '[]'::jsonb),
    'values_alignment', coalesce((select jsonb_agg(jsonb_build_object(
      'value_key', v.value_key, 'label', v.label, 'guidance', v.guidance
    ) order by v.sort_order) from public.aipify_owc_center_values v where v.tenant_id = v_tenant), '[]'::jsonb),
    'historical_patterns', coalesce((select jsonb_agg(jsonb_build_object(
      'pattern_key', p.pattern_key, 'domain', p.domain, 'label', p.label, 'summary', p.summary
    ) order by p.domain) from public.aipify_owc_center_patterns p where p.tenant_id = v_tenant), '[]'::jsonb),
    'wisdom_synthesis', coalesce((select jsonb_agg(jsonb_build_object(
      'source_key', s.source_key, 'source_label', s.source_label,
      'route_path', s.route_path, 'summary', s.summary
    ) order by s.source_key) from public.aipify_owc_center_synthesis s where s.tenant_id = v_tenant), '[]'::jsonb),
    'timeline', coalesce((select jsonb_agg(jsonb_build_object(
      'timeline_key', t.timeline_key, 'event_type', t.event_type,
      'label', t.label, 'summary', t.summary, 'recorded_at', t.recorded_at
    ) order by t.recorded_at desc) from public.aipify_owc_center_timeline t where t.tenant_id = v_tenant), '[]'::jsonb),
    'snapshots', coalesce((select jsonb_agg(jsonb_build_object(
      'snapshot_key', s.snapshot_key, 'period_label', s.period_label,
      'wisdom_score', s.wisdom_score, 'summary', s.summary, 'captured_at', s.captured_at
    ) order by s.captured_at desc) from public.aipify_owc_center_snapshots s where s.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'domain', i.domain, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_owc_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_owc_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'wisdom_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', gr.review_key, 'review_type', gr.review_type, 'prompt', gr.prompt,
      'status', gr.status, 'completed_at', gr.completed_at
    ) order by gr.review_key) from public.aipify_owc_center_reviews gr where gr.tenant_id = v_tenant), '[]'::jsonb),
    'executive_view', jsonb_build_object(
      'emerging_themes', 'Emerging themes include values-aligned decision-making and phased implementation wisdom.',
      'learning_patterns', 'Leadership learning patterns show increasing reflection participation and historical context use.',
      'lessons_revisited', 'Historical lessons on stakeholder involvement and values alignment remain frequently referenced.',
      'wisdom_indicators', 'Organizational wisdom indicators demonstrate maturing institutional judgment.'
    ),
    'wisdom_domains', public._owcbp324_domains(),
    'blueprint', public._owcbp324_blueprint_summary(),
    'links', jsonb_build_object(
      'wisdom_center', '/app/executive/organizational-wisdom',
      'executive', '/app/executive',
      'organizational_memory', '/app/executive/organizational-memory',
      'organizational_learning', '/app/knowledge-center/organizational-learning',
      'knowledge_evolution', '/app/knowledge-center/knowledge-evolution',
      'strategic_intelligence', '/app/executive/strategic-intelligence',
      'decision_support', '/app/executive/decision-support',
      'purpose_values', '/app/purpose-values-engine'
    ),
    'privacy_note', public._owcbp324_privacy_note(),
    'can_manage', public._irp_has_permission('org_wisdom.manage', v_tenant),
    'can_contribute', public._irp_has_permission('org_wisdom.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_organizational_wisdom_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
begin
  v_tenant := public._owc_require_tenant();

  if v_action in (
    'complete_review', 'schedule_wisdom_review', 'dismiss_insight', 'dismiss_recommendation',
    'export_historical_insights', 'archive_wisdom_milestone',
    'generate_reflection_report', 'generate_executive_summary',
    'coordinate_leadership_discussion'
  ) then
    perform public._irp_require_permission('org_wisdom.manage', v_tenant);

    if v_action = 'complete_review' then
      update public.aipify_owc_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._owc_log(v_tenant, 'reflection_completed', 'Wisdom review completed', p_payload);
    elsif v_action = 'schedule_wisdom_review' then
      perform public._owc_log(v_tenant, 'leadership_discussion', 'Wisdom review scheduled', p_payload);
    elsif v_action = 'dismiss_insight' then
      update public.aipify_owc_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_owc_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'export_historical_insights' then
      insert into public.aipify_owc_center_snapshots (
        tenant_id, snapshot_key, period_label, wisdom_score, summary
      ) values (
        v_tenant,
        'snap_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        left(coalesce(p_payload->>'period_label', 'Current period'), 120),
        coalesce((p_payload->>'wisdom_score')::int, (public._owc_dashboard_metrics(v_tenant)->>'wisdom_score')::int),
        left(coalesce(p_payload->>'summary', 'Historical wisdom insights exported.'), 500)
      );
      perform public._owc_log(v_tenant, 'historical_insight_referenced', 'Historical insights exported', p_payload);
    elsif v_action = 'archive_wisdom_milestone' then
      perform public._owc_log(v_tenant, 'milestone_archived', 'Wisdom milestone archived', p_payload);
    elsif v_action = 'generate_reflection_report' then
      perform public._owc_log(v_tenant, 'wisdom_report_generated', 'Reflection report generated', p_payload);
    elsif v_action = 'generate_executive_summary' then
      perform public._owc_log(v_tenant, 'wisdom_report_generated', 'Executive wisdom summary generated', p_payload);
    elsif v_action = 'coordinate_leadership_discussion' then
      perform public._owc_log(v_tenant, 'leadership_discussion', 'Leadership discussion coordinated', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('org_wisdom.manage', v_tenant);
    update public.aipify_owc_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    perform public._owc_log(v_tenant, 'recommendation_surfaced', 'Recommendation accepted', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_observation' then
    perform public._irp_require_permission('org_wisdom.contribute', v_tenant);
    perform public._owc_log(v_tenant, 'historical_insight_referenced', 'Wisdom observation contributed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_organizational_wisdom_center(uuid) to authenticated;
grant execute on function public.process_organizational_wisdom_action(jsonb) to authenticated;
