-- Phase 321 — Organizational Focus Center Engine
-- Feature owner: Customer App — /app/executive/organizational-focus
-- Helpers: _ofc_* (engine), _ofcbp321_* (blueprint)
-- Cross-links executive centers — does NOT modify their RPCs

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
    'aipify_organizational_focus_center_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_ofc_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  review_cadence text not null default 'monthly' check (
    review_cadence in ('weekly', 'monthly', 'quarterly', 'annual')
  ),
  metadata jsonb not null default '{"metadata_only":true,"focus_not_productivity_obsession":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_ofc_center_settings enable row level security;
revoke all on public.aipify_ofc_center_settings from authenticated, anon;

create table if not exists public.aipify_ofc_center_initiatives (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  initiative_key text not null,
  domain text not null check (domain in (
    'strategic', 'operational', 'team', 'customer', 'leadership'
  )),
  title text not null,
  owner_label text not null default '',
  summary text not null default '',
  focus_score int not null default 70 check (focus_score between 0 and 100),
  status text not null default 'active' check (status in ('active', 'completed', 'archived')),
  unique (tenant_id, initiative_key)
);
alter table public.aipify_ofc_center_initiatives enable row level security;
revoke all on public.aipify_ofc_center_initiatives from authenticated, anon;

create table if not exists public.aipify_ofc_center_overloads (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  overload_key text not null,
  overload_type text not null check (overload_type in (
    'excessive_initiatives', 'competing_priorities', 'resource_fragmentation',
    'meeting_overload', 'review_fatigue'
  )),
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'discussed', 'dismissed')),
  unique (tenant_id, overload_key)
);
alter table public.aipify_ofc_center_overloads enable row level security;
revoke all on public.aipify_ofc_center_overloads from authenticated, anon;

create table if not exists public.aipify_ofc_center_priorities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  priority_key text not null,
  domain text not null check (domain in (
    'strategic', 'operational', 'team', 'customer', 'leadership'
  )),
  label text not null,
  weight_pct int not null default 20 check (weight_pct between 0 and 100),
  unique (tenant_id, priority_key)
);
alter table public.aipify_ofc_center_priorities enable row level security;
revoke all on public.aipify_ofc_center_priorities from authenticated, anon;

create table if not exists public.aipify_ofc_center_timeline (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  timeline_key text not null,
  event_type text not null check (event_type in (
    'priority_shift', 'initiative_added', 'initiative_completed',
    'focus_improvement', 'executive_intervention'
  )),
  label text not null,
  summary text not null default '',
  recorded_at timestamptz not null default now(),
  unique (tenant_id, timeline_key)
);
alter table public.aipify_ofc_center_timeline enable row level security;
revoke all on public.aipify_ofc_center_timeline from authenticated, anon;

create table if not exists public.aipify_ofc_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  unique (tenant_id, insight_key)
);
alter table public.aipify_ofc_center_insights enable row level security;
revoke all on public.aipify_ofc_center_insights from authenticated, anon;

create table if not exists public.aipify_ofc_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_ofc_center_recommendations enable row level security;
revoke all on public.aipify_ofc_center_recommendations from authenticated, anon;

create table if not exists public.aipify_ofc_center_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in (
    'weekly', 'monthly', 'quarterly', 'annual'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, review_key)
);
alter table public.aipify_ofc_center_reviews enable row level security;
revoke all on public.aipify_ofc_center_reviews from authenticated, anon;

create table if not exists public.aipify_ofc_center_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  snapshot_key text not null,
  initiative_label text not null default 'Initiative portfolio',
  focus_score int not null default 0,
  summary text not null default '',
  captured_at timestamptz not null default now(),
  unique (tenant_id, snapshot_key)
);
alter table public.aipify_ofc_center_snapshots enable row level security;
revoke all on public.aipify_ofc_center_snapshots from authenticated, anon;

create table if not exists public.aipify_ofc_center_prioritization (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  factor_key text not null,
  label text not null,
  guidance text not null default '',
  sort_order int not null default 0,
  unique (tenant_id, factor_key)
);
alter table public.aipify_ofc_center_prioritization enable row level security;
revoke all on public.aipify_ofc_center_prioritization from authenticated, anon;

create table if not exists public.aipify_ofc_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'review_completed', 'prioritization_decision', 'recommendation_generated',
    'executive_action', 'initiative_adjustment', 'governance_override', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_ofc_center_audit_logs enable row level security;
revoke all on public.aipify_ofc_center_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_organizational_focus_center_engine', v.description
from (values
  ('org_focus.view', 'View Focus Center', 'Review organizational focus scores and priority clarity'),
  ('org_focus.manage', 'Manage Focus Center', 'Schedule reviews, generate reports, and coordinate prioritization'),
  ('org_focus.contribute', 'Contribute Focus Observations', 'Submit focus observations and priority notes')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'org_focus.view'), ('owner', 'org_focus.manage'), ('owner', 'org_focus.contribute'),
  ('administrator', 'org_focus.view'), ('administrator', 'org_focus.manage'), ('administrator', 'org_focus.contribute'),
  ('manager', 'org_focus.view'), ('manager', 'org_focus.manage'),
  ('employee', 'org_focus.view'),
  ('support_agent', 'org_focus.view'), ('moderator', 'org_focus.view'), ('viewer', 'org_focus.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_organizational_focus_center_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_organizational_focus_center_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _ofcbp321_*
-- ---------------------------------------------------------------------------
create or replace function public._ofcbp321_core_principle() returns text language sql immutable as $$
  select 'Organizations struggle because they pursue too many initiatives at the same time. Aipify should help organizations focus on what matters most.';
$$;

create or replace function public._ofcbp321_philosophy() returns text language sql immutable as $$
  select 'Focus is not about doing less — it is about doing the right things exceptionally well with priority clarity and intentional decision-making.';
$$;

create or replace function public._ofcbp321_vision() returns text language sql immutable as $$
  select 'Help leaders strengthen clarity, reduce fragmentation, and direct energy toward meaningful outcomes.';
$$;

create or replace function public._ofcbp321_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'strategic', 'label', 'Strategic focus'),
    jsonb_build_object('key', 'operational', 'label', 'Operational focus'),
    jsonb_build_object('key', 'team', 'label', 'Team focus'),
    jsonb_build_object('key', 'customer', 'label', 'Customer focus'),
    jsonb_build_object('key', 'leadership', 'label', 'Leadership focus')
  );
$$;

create or replace function public._ofcbp321_health_label(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'exceptional'
    when p_score >= 75 then 'strong'
    when p_score >= 60 then 'stable'
    when p_score >= 40 then 'attention_required'
    else 'fragmented'
  end;
$$;

create or replace function public._ofcbp321_privacy_note() returns text language sql immutable as $$
  select 'Focus Center stores organizational metadata and priority summaries only — never initiative shaming, guilt-based messaging, or individual surveillance.';
$$;

create or replace function public._ofcbp321_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 321 — Organizational Focus Center Engine',
    'route', '/app/executive/organizational-focus',
    'core_principle', public._ofcbp321_core_principle(),
    'philosophy', public._ofcbp321_philosophy(),
    'vision', public._ofcbp321_vision(),
    'domains', public._ofcbp321_domains(),
    'privacy_note', public._ofcbp321_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _ofc_*
-- ---------------------------------------------------------------------------
create or replace function public._ofc_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._ofc_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_ofc_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._ofc_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_ofc_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_ofc_center_initiatives (
    tenant_id, initiative_key, domain, title, owner_label, summary, focus_score
  ) values
  (p_tenant, 'ini_strat', 'strategic', 'Q2 growth priorities', 'CEO', 'Executive priorities and long-term strategic commitments.', 85),
  (p_tenant, 'ini_ops', 'operational', 'Operational excellence program', 'COO', 'Critical workflows and high-value activities.', 78),
  (p_tenant, 'ini_team', 'team', 'Cross-functional product launch', 'Product Director', 'Clear responsibilities with reduced context switching.', 72),
  (p_tenant, 'ini_cust', 'customer', 'Customer experience excellence', 'VP Customer', 'Service excellence and customer satisfaction initiatives.', 80),
  (p_tenant, 'ini_lead', 'leadership', 'Executive decision cadence', 'Chief of Staff', 'Decision prioritization and review effectiveness.', 74)
  on conflict do nothing;

  insert into public.aipify_ofc_center_overloads (
    tenant_id, overload_key, overload_type, message, priority
  ) values
  (p_tenant, 'ov_1', 'competing_priorities', 'Several initiatives compete for the same leadership attention.', 'high'),
  (p_tenant, 'ov_2', 'excessive_initiatives', 'Cross-functional focus may be diluted across concurrent initiatives.', 'medium'),
  (p_tenant, 'ov_3', 'meeting_overload', 'Meeting load may reduce capacity for strategic focus.', 'low')
  on conflict do nothing;

  insert into public.aipify_ofc_center_priorities (
    tenant_id, priority_key, domain, label, weight_pct
  ) values
  (p_tenant, 'pri_strat', 'strategic', 'Strategic growth', 30),
  (p_tenant, 'pri_ops', 'operational', 'Operational excellence', 25),
  (p_tenant, 'pri_team', 'team', 'Team effectiveness', 20),
  (p_tenant, 'pri_cust', 'customer', 'Customer experience', 15),
  (p_tenant, 'pri_lead', 'leadership', 'Leadership capacity', 10)
  on conflict do nothing;

  insert into public.aipify_ofc_center_timeline (
    tenant_id, timeline_key, event_type, label, summary, recorded_at
  ) values
  (p_tenant, 'tl_1', 'focus_improvement', 'Initiative consolidation improved focus', 'Organizational focus strengthened through priority consolidation.', now() - interval '45 days'),
  (p_tenant, 'tl_2', 'priority_shift', 'Executive priorities refined', 'Leadership attention concentrated on strategic priorities.', now() - interval '21 days'),
  (p_tenant, 'tl_3', 'initiative_completed', 'Pilot initiative completed', 'Completed initiative freed capacity for strategic work.', now() - interval '7 days')
  on conflict do nothing;

  insert into public.aipify_ofc_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_1', 'Organizational focus has improved through initiative consolidation.', 'high'),
  (p_tenant, 'ins_2', 'Leadership attention appears concentrated on strategic priorities.', 'medium'),
  (p_tenant, 'ins_3', 'Several initiatives may benefit from sequencing rather than simultaneous execution.', 'medium')
  on conflict do nothing;

  insert into public.aipify_ofc_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_1', 'Several initiatives may benefit from phased implementation.', 'medium'),
  (p_tenant, 'rec_2', 'Focus discipline has improved significantly this quarter.', 'low'),
  (p_tenant, 'rec_3', 'Leadership review capacity should remain protected.', 'high')
  on conflict do nothing;

  insert into public.aipify_ofc_center_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev_w', 'weekly', 'Weekly leadership review — protect attention and confirm priorities.', 'pending'),
  (p_tenant, 'rev_m', 'monthly', 'Monthly focus assessment — initiative concentration and priority clarity.', 'pending'),
  (p_tenant, 'rev_q', 'quarterly', 'Quarterly strategic focus review.', 'pending')
  on conflict (tenant_id, review_key) do nothing;

  insert into public.aipify_ofc_center_snapshots (
    tenant_id, snapshot_key, initiative_label, focus_score, summary, captured_at
  ) values
  (p_tenant, 'snap_portfolio', 'Initiative portfolio', 76, 'Current organizational focus snapshot.', now()),
  (p_tenant, 'snap_strat', 'Strategic initiatives', 82, 'Strategic initiative focus snapshot.', now() - interval '30 days')
  on conflict do nothing;

  insert into public.aipify_ofc_center_prioritization (
    tenant_id, factor_key, label, guidance, sort_order
  ) values
  (p_tenant, 'fac_strat', 'Strategic importance', 'Evaluate alignment with long-term organizational objectives.', 1),
  (p_tenant, 'fac_cust', 'Customer impact', 'Consider effect on customer promise and experience.', 2),
  (p_tenant, 'fac_ready', 'Organizational readiness', 'Assess capacity and readiness before committing resources.', 3),
  (p_tenant, 'fac_res', 'Resource availability', 'Review whether resources are available without fragmentation.', 4),
  (p_tenant, 'fac_value', 'Long-term value', 'Weigh sustained value against short-term activity.', 5)
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._ofc_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with ini as (
    select round(avg(focus_score)) as avg_score,
      count(*) filter (where status = 'active') as active_count,
      count(*) filter (where focus_score >= 75 and status = 'active') as strong_count,
      count(*) filter (where focus_score < 60 and status = 'active') as risk_count
    from public.aipify_ofc_center_initiatives where tenant_id = p_tenant
  ),
  ov as (
    select count(*) as open_count
    from public.aipify_ofc_center_overloads where tenant_id = p_tenant and status = 'open'
  )
  select jsonb_build_object(
    'focus_score', coalesce((select avg_score from ini), 0),
    'focus_health_label', public._ofcbp321_health_label(coalesce((select avg_score from ini), 0)::int),
    'active_initiatives', coalesce((select active_count from ini), 0),
    'strong_focus_count', coalesce((select strong_count from ini), 0),
    'focus_risks', coalesce((select risk_count from ini), 0) + coalesce((select open_count from ov), 0),
    'overload_open', coalesce((select open_count from ov), 0),
    'initiative_concentration_pct', 68,
    'priority_clarity_pct', 81,
    'review_discipline_pct', 74,
    'leadership_confidence', 4.4,
    'companion_usefulness_rating', 4.3,
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_focus_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._ofc_require_tenant());
  perform public._irp_require_permission('org_focus.view', v_tenant);

  if not exists (select 1 from public.aipify_ofc_center_initiatives where tenant_id = v_tenant limit 1) then
    v_seed := public._ofc_seed(v_tenant);
  end if;

  perform public._ofc_log(v_tenant, 'view_center', 'Focus Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/organizational-focus',
    'dashboard', public._ofc_dashboard_metrics(v_tenant),
    'initiatives', coalesce((select jsonb_agg(jsonb_build_object(
      'initiative_key', i.initiative_key, 'domain', i.domain, 'title', i.title,
      'owner_label', i.owner_label, 'summary', i.summary, 'focus_score', i.focus_score,
      'status', i.status
    ) order by i.focus_score desc) from public.aipify_ofc_center_initiatives i
      where i.tenant_id = v_tenant and i.status = 'active'), '[]'::jsonb),
    'priority_distribution', coalesce((select jsonb_agg(jsonb_build_object(
      'priority_key', p.priority_key, 'domain', p.domain, 'label', p.label, 'weight_pct', p.weight_pct
    ) order by p.weight_pct desc) from public.aipify_ofc_center_priorities p where p.tenant_id = v_tenant), '[]'::jsonb),
    'overloads', coalesce((select jsonb_agg(jsonb_build_object(
      'overload_key', o.overload_key, 'overload_type', o.overload_type,
      'message', o.message, 'priority', o.priority, 'status', o.status
    ) order by case o.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_ofc_center_overloads o where o.tenant_id = v_tenant and o.status = 'open'), '[]'::jsonb),
    'timeline', coalesce((select jsonb_agg(jsonb_build_object(
      'timeline_key', t.timeline_key, 'event_type', t.event_type,
      'label', t.label, 'summary', t.summary, 'recorded_at', t.recorded_at
    ) order by t.recorded_at desc) from public.aipify_ofc_center_timeline t where t.tenant_id = v_tenant), '[]'::jsonb),
    'snapshots', coalesce((select jsonb_agg(jsonb_build_object(
      'snapshot_key', s.snapshot_key, 'initiative_label', s.initiative_label,
      'focus_score', s.focus_score, 'summary', s.summary, 'captured_at', s.captured_at
    ) order by s.captured_at desc) from public.aipify_ofc_center_snapshots s where s.tenant_id = v_tenant), '[]'::jsonb),
    'prioritization_factors', coalesce((select jsonb_agg(jsonb_build_object(
      'factor_key', f.factor_key, 'label', f.label, 'guidance', f.guidance
    ) order by f.sort_order) from public.aipify_ofc_center_prioritization f where f.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_ofc_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_ofc_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'focus_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', gr.review_key, 'review_type', gr.review_type, 'prompt', gr.prompt,
      'status', gr.status, 'completed_at', gr.completed_at
    ) order by gr.review_key) from public.aipify_ofc_center_reviews gr where gr.tenant_id = v_tenant), '[]'::jsonb),
    'executive_view', jsonb_build_object(
      'attention_trends', 'Leadership attention trending toward strategic priorities with improved concentration.',
      'strategic_concentration', 'Initiative concentration improving — fewer competing priorities at executive level.',
      'overload_risks', 'Some initiative overload risks remain — sequencing may strengthen focus.',
      'priority_alignment', 'Priority alignment measures show good consistency across departments.'
    ),
    'focus_domains', public._ofcbp321_domains(),
    'blueprint', public._ofcbp321_blueprint_summary(),
    'links', jsonb_build_object(
      'focus_center', '/app/executive/organizational-focus',
      'executive', '/app/executive',
      'organizational_alignment', '/app/executive/organizational-alignment',
      'execution_excellence', '/app/executive/execution-excellence',
      'organizational_health', '/app/executive/organizational-health',
      'attention_guardian', '/app/assistant/attention'
    ),
    'privacy_note', public._ofcbp321_privacy_note(),
    'can_manage', public._irp_has_permission('org_focus.manage', v_tenant),
    'can_contribute', public._irp_has_permission('org_focus.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_organizational_focus_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
begin
  v_tenant := public._ofc_require_tenant();

  if v_action in (
    'complete_review', 'schedule_prioritization_workshop', 'discuss_overload', 'dismiss_overload',
    'dismiss_insight', 'dismiss_recommendation', 'export_initiative_snapshot',
    'archive_completed_priority', 'generate_focus_summary', 'generate_executive_report',
    'coordinate_leadership_review'
  ) then
    perform public._irp_require_permission('org_focus.manage', v_tenant);

    if v_action = 'complete_review' then
      update public.aipify_ofc_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._ofc_log(v_tenant, 'review_completed', 'Focus review completed', p_payload);
    elsif v_action = 'schedule_prioritization_workshop' then
      perform public._ofc_log(v_tenant, 'executive_action', 'Prioritization workshop scheduled', p_payload);
    elsif v_action = 'discuss_overload' then
      update public.aipify_ofc_center_overloads set status = 'discussed'
      where tenant_id = v_tenant and overload_key = nullif(p_payload->>'overload_key', '');
      perform public._ofc_log(v_tenant, 'prioritization_decision', 'Focus overload marked for discussion', p_payload);
    elsif v_action = 'dismiss_overload' then
      update public.aipify_ofc_center_overloads set status = 'dismissed'
      where tenant_id = v_tenant and overload_key = nullif(p_payload->>'overload_key', '');
    elsif v_action = 'dismiss_insight' then
      update public.aipify_ofc_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_ofc_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'export_initiative_snapshot' then
      insert into public.aipify_ofc_center_snapshots (
        tenant_id, snapshot_key, initiative_label, focus_score, summary
      ) values (
        v_tenant,
        'snap_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        left(coalesce(p_payload->>'initiative_label', 'Initiative portfolio'), 120),
        coalesce((p_payload->>'focus_score')::int, (public._ofc_dashboard_metrics(v_tenant)->>'focus_score')::int),
        left(coalesce(p_payload->>'summary', 'Initiative focus snapshot exported.'), 500)
      );
      perform public._ofc_log(v_tenant, 'initiative_adjustment', 'Initiative snapshot exported', p_payload);
    elsif v_action = 'archive_completed_priority' then
      update public.aipify_ofc_center_initiatives set status = 'archived'
      where tenant_id = v_tenant and initiative_key = nullif(p_payload->>'initiative_key', '');
      perform public._ofc_log(v_tenant, 'initiative_adjustment', 'Priority archived as completed', p_payload);
    elsif v_action = 'generate_focus_summary' then
      perform public._ofc_log(v_tenant, 'recommendation_generated', 'Focus summary generated', p_payload);
    elsif v_action = 'generate_executive_report' then
      perform public._ofc_log(v_tenant, 'recommendation_generated', 'Executive focus report generated', p_payload);
    elsif v_action = 'coordinate_leadership_review' then
      perform public._ofc_log(v_tenant, 'review_completed', 'Leadership review coordinated', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('org_focus.manage', v_tenant);
    update public.aipify_ofc_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    perform public._ofc_log(v_tenant, 'recommendation_generated', 'Recommendation accepted', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_observation' then
    perform public._irp_require_permission('org_focus.contribute', v_tenant);
    perform public._ofc_log(v_tenant, 'prioritization_decision', 'Focus observation contributed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_organizational_focus_center(uuid) to authenticated;
grant execute on function public.process_organizational_focus_action(jsonb) to authenticated;
