-- Phase 314 — Change Management Engine
-- Feature owner: Customer App — /app/executive/change-management
-- Helpers: _cmg_* (engine), _cmgbp314_* (blueprint)
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
    'aipify_change_management_center_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_cmg_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  notification_preferences jsonb not null default '{"feedback_participation":true,"training_reminders":true}'::jsonb,
  governance_preferences jsonb not null default '{"executive_visibility":true}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_cmg_center_settings enable row level security;
revoke all on public.aipify_cmg_center_settings from authenticated, anon;

create table if not exists public.aipify_cmg_center_initiatives (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  initiative_key text not null,
  title text not null,
  summary text not null,
  category text not null check (category in (
    'technology', 'process', 'organizational', 'cultural', 'strategic'
  )),
  workflow_stage text not null default 'identified' check (workflow_stage in (
    'identified', 'business_case', 'stakeholders_mapped', 'communication_planned',
    'training_coordinated', 'implementation_executed', 'adoption_measured', 'lessons_captured'
  )),
  status text not null default 'active' check (status in ('active', 'monitoring', 'completed', 'archived')),
  readiness_band text not null default 'mostly_ready' check (readiness_band in (
    'ready', 'mostly_ready', 'attention_needed', 'not_ready'
  )),
  readiness_score numeric(5,2) not null default 75,
  adoption_pct numeric(5,2) not null default 0,
  sponsor text not null default '',
  owner text not null default 'Change Lead',
  created_at timestamptz not null default now(),
  unique (tenant_id, initiative_key)
);
alter table public.aipify_cmg_center_initiatives enable row level security;
revoke all on public.aipify_cmg_center_initiatives from authenticated, anon;

create table if not exists public.aipify_cmg_center_stakeholders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  stakeholder_key text not null,
  initiative_key text not null,
  role_type text not null check (role_type in (
    'sponsor', 'leader', 'champion', 'impacted_employee', 'external'
  )),
  label text not null,
  engagement_level text not null default 'moderate' check (engagement_level in (
    'high', 'moderate', 'low', 'unknown'
  )),
  unique (tenant_id, stakeholder_key)
);
alter table public.aipify_cmg_center_stakeholders enable row level security;
revoke all on public.aipify_cmg_center_stakeholders from authenticated, anon;

create table if not exists public.aipify_cmg_center_communications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  communication_key text not null,
  initiative_key text not null,
  audience text not null check (audience in (
    'executive', 'team', 'faq', 'progress', 'reinforcement'
  )),
  title text not null,
  content text not null,
  status text not null default 'draft' check (status in ('draft', 'sent', 'archived')),
  created_at timestamptz not null default now(),
  unique (tenant_id, communication_key)
);
alter table public.aipify_cmg_center_communications enable row level security;
revoke all on public.aipify_cmg_center_communications from authenticated, anon;

create table if not exists public.aipify_cmg_center_training (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  training_key text not null,
  initiative_key text not null,
  label text not null,
  role_target text not null default 'all',
  completion_pct numeric(5,2) not null default 0,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed')),
  unique (tenant_id, training_key)
);
alter table public.aipify_cmg_center_training enable row level security;
revoke all on public.aipify_cmg_center_training from authenticated, anon;

create table if not exists public.aipify_cmg_center_adoption_metrics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  metric_key text not null,
  initiative_key text not null,
  label text not null,
  value_label text not null,
  trend text not null default 'stable' check (trend in ('up', 'down', 'stable')),
  unique (tenant_id, metric_key)
);
alter table public.aipify_cmg_center_adoption_metrics enable row level security;
revoke all on public.aipify_cmg_center_adoption_metrics from authenticated, anon;

create table if not exists public.aipify_cmg_center_feedback (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  feedback_key text not null,
  initiative_key text,
  feedback_type text not null check (feedback_type in (
    'concern', 'suggestion', 'barrier', 'positive', 'lesson'
  )),
  message text not null,
  status text not null default 'open' check (status in ('open', 'reviewed', 'archived')),
  created_at timestamptz not null default now(),
  unique (tenant_id, feedback_key)
);
alter table public.aipify_cmg_center_feedback enable row level security;
revoke all on public.aipify_cmg_center_feedback from authenticated, anon;

create table if not exists public.aipify_cmg_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  unique (tenant_id, insight_key)
);
alter table public.aipify_cmg_center_insights enable row level security;
revoke all on public.aipify_cmg_center_insights from authenticated, anon;

create table if not exists public.aipify_cmg_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_cmg_center_recommendations enable row level security;
revoke all on public.aipify_cmg_center_recommendations from authenticated, anon;

create table if not exists public.aipify_cmg_center_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  initiative_key text,
  review_type text not null check (review_type in (
    'executive', 'adoption', 'lessons_learned', 'stakeholder_sentiment'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, review_key)
);
alter table public.aipify_cmg_center_reviews enable row level security;
revoke all on public.aipify_cmg_center_reviews from authenticated, anon;

create table if not exists public.aipify_cmg_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'initiative_launched', 'communication_issued', 'training_completed',
    'adoption_recorded', 'executive_review', 'lessons_captured', 'governance_override', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_cmg_center_audit_logs enable row level security;
revoke all on public.aipify_cmg_center_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_change_management_center_engine', v.description
from (values
  ('change_management.view', 'View Change Management Center', 'Review change initiatives, adoption, and stakeholder engagement'),
  ('change_management.manage', 'Manage Change Management Center', 'Coordinate initiatives, communications, and training'),
  ('change_management.contribute', 'Contribute Change Feedback', 'Submit feedback, concerns, and adoption observations')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'change_management.view'), ('owner', 'change_management.manage'), ('owner', 'change_management.contribute'),
  ('administrator', 'change_management.view'), ('administrator', 'change_management.manage'), ('administrator', 'change_management.contribute'),
  ('manager', 'change_management.view'), ('manager', 'change_management.manage'), ('manager', 'change_management.contribute'),
  ('employee', 'change_management.view'), ('employee', 'change_management.contribute'),
  ('support_agent', 'change_management.view'), ('moderator', 'change_management.view'), ('viewer', 'change_management.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_change_management_center_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_change_management_center_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _cmgbp314_*
-- ---------------------------------------------------------------------------
create or replace function public._cmgbp314_core_principle() returns text language sql immutable as $$
  select 'Technology changes quickly. People adapt gradually. Aipify should help organizations manage both.';
$$;

create or replace function public._cmgbp314_philosophy() returns text language sql immutable as $$
  select 'The success of change is measured by adoption — through understanding, communication, preparation, reinforcement, and continuous learning.';
$$;

create or replace function public._cmgbp314_vision() returns text language sql immutable as $$
  select 'Help organizations navigate change with empathy, clarity, and operational excellence.';
$$;

create or replace function public._cmgbp314_readiness_bands() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'ready', 'label', 'Ready'),
    jsonb_build_object('key', 'mostly_ready', 'label', 'Mostly ready'),
    jsonb_build_object('key', 'attention_needed', 'label', 'Attention needed'),
    jsonb_build_object('key', 'not_ready', 'label', 'Not ready')
  );
$$;

create or replace function public._cmgbp314_workflow() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('stage', 'identified', 'label', 'Change identified'),
    jsonb_build_object('stage', 'business_case', 'label', 'Business case developed'),
    jsonb_build_object('stage', 'stakeholders_mapped', 'label', 'Stakeholders mapped'),
    jsonb_build_object('stage', 'communication_planned', 'label', 'Communication planned'),
    jsonb_build_object('stage', 'training_coordinated', 'label', 'Training coordinated'),
    jsonb_build_object('stage', 'implementation_executed', 'label', 'Implementation executed'),
    jsonb_build_object('stage', 'adoption_measured', 'label', 'Adoption measured'),
    jsonb_build_object('stage', 'lessons_captured', 'label', 'Lessons learned captured')
  );
$$;

create or replace function public._cmgbp314_privacy_note() returns text language sql immutable as $$
  select 'Change Management Center stores initiative metadata, adoption summaries, and feedback patterns only — never manipulative engagement data or private employee content.';
$$;

create or replace function public._cmgbp314_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 314 — Change Management Engine',
    'route', '/app/executive/change-management',
    'core_principle', public._cmgbp314_core_principle(),
    'philosophy', public._cmgbp314_philosophy(),
    'vision', public._cmgbp314_vision(),
    'readiness_bands', public._cmgbp314_readiness_bands(),
    'workflow', public._cmgbp314_workflow(),
    'privacy_note', public._cmgbp314_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _cmg_*
-- ---------------------------------------------------------------------------
create or replace function public._cmg_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._cmg_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_cmg_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._cmg_initiative_to_json(i public.aipify_cmg_center_initiatives)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'initiative_key', i.initiative_key, 'title', i.title, 'summary', i.summary,
    'category', i.category, 'workflow_stage', i.workflow_stage, 'status', i.status,
    'readiness_band', i.readiness_band, 'readiness_score', i.readiness_score,
    'adoption_pct', i.adoption_pct, 'sponsor', i.sponsor, 'owner', i.owner,
    'created_at', i.created_at
  );
$$;

create or replace function public._cmg_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_cmg_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_cmg_center_initiatives (
    tenant_id, initiative_key, title, summary, category, workflow_stage, status,
    readiness_band, readiness_score, adoption_pct, sponsor, owner
  ) values
  (
    p_tenant, 'chg_companion_rollout', 'Companion workflow adoption program',
    'Enterprise rollout of Companion-assisted workflows across operations teams.',
    'technology', 'implementation_executed', 'active', 'mostly_ready', 78, 62,
    'Chief Operating Officer', 'Change Lead — Operations'
  ),
  (
    p_tenant, 'chg_approval_refresh', 'Approval structure refresh',
    'Updated approval pathways and human oversight model for sensitive actions.',
    'process', 'training_coordinated', 'active', 'attention_needed', 68, 41,
    'Chief People Officer', 'Change Lead — Governance'
  ),
  (
    p_tenant, 'chg_customer_centric', 'Customer-centric culture initiative',
    'Cross-functional program to reinforce customer-first decision making.',
    'cultural', 'communication_planned', 'active', 'ready', 84, 28,
    'Chief Executive Officer', 'Change Lead — Customer Success'
  )
  on conflict do nothing;

  insert into public.aipify_cmg_center_stakeholders (
    tenant_id, stakeholder_key, initiative_key, role_type, label, engagement_level
  ) values
  (p_tenant, 'st_sponsor', 'chg_companion_rollout', 'sponsor', 'Executive Sponsor — COO', 'high'),
  (p_tenant, 'st_champ_ops', 'chg_companion_rollout', 'champion', 'Operations Change Champion', 'high'),
  (p_tenant, 'st_impacted', 'chg_companion_rollout', 'impacted_employee', 'Operations team members', 'moderate'),
  (p_tenant, 'st_leader_gov', 'chg_approval_refresh', 'leader', 'Governance Lead', 'moderate')
  on conflict do nothing;

  insert into public.aipify_cmg_center_communications (
    tenant_id, communication_key, initiative_key, audience, title, content, status
  ) values
  (
    p_tenant, 'com_exec', 'chg_companion_rollout', 'executive',
    'Executive announcement — Companion adoption',
    'Leadership confirms support for Companion-assisted workflows. Purpose, timeline, and support resources shared.',
    'sent'
  ),
  (
    p_tenant, 'com_faq', 'chg_companion_rollout', 'faq',
    'FAQ — Companion workflow adoption',
    'Common questions about training, support channels, and how adoption will be measured.',
    'sent'
  ),
  (
    p_tenant, 'com_progress', 'chg_approval_refresh', 'progress',
    'Progress summary — Approval structure refresh',
    'Training coordination underway. Several teams may benefit from additional communication.',
    'draft'
  )
  on conflict do nothing;

  insert into public.aipify_cmg_center_training (
    tenant_id, training_key, initiative_key, label, role_target, completion_pct, status
  ) values
  (p_tenant, 'tr_ops', 'chg_companion_rollout', 'Companion workflow fundamentals', 'operations', 71, 'in_progress'),
  (p_tenant, 'tr_gov', 'chg_approval_refresh', 'Updated approval pathways', 'governance', 38, 'in_progress'),
  (p_tenant, 'tr_cs', 'chg_customer_centric', 'Customer-first decision framework', 'all', 15, 'pending')
  on conflict do nothing;

  insert into public.aipify_cmg_center_adoption_metrics (
    tenant_id, metric_key, initiative_key, label, value_label, trend
  ) values
  (p_tenant, 'ad_participation', 'chg_companion_rollout', 'Participation rate', '68%', 'up'),
  (p_tenant, 'ad_training', 'chg_companion_rollout', 'Training completion', '71%', 'up'),
  (p_tenant, 'ad_workflow', 'chg_companion_rollout', 'Workflow adoption', '62%', 'stable'),
  (p_tenant, 'ad_engagement', 'chg_approval_refresh', 'User engagement', '41%', 'down')
  on conflict do nothing;

  insert into public.aipify_cmg_center_feedback (
    tenant_id, feedback_key, initiative_key, feedback_type, message, status
  ) values
  (
    p_tenant, 'fb_concern', 'chg_approval_refresh', 'concern',
    'Some teams need clearer guidance on when new approval rules apply.', 'open'
  ),
  (
    p_tenant, 'fb_positive', 'chg_companion_rollout', 'positive',
    'Operations champions report strong momentum in pilot teams.', 'open'
  ),
  (
    p_tenant, 'fb_lesson', 'chg_customer_centric', 'lesson',
    'Early executive sponsorship helped reduce uncertainty during kickoff.', 'reviewed'
  )
  on conflict do nothing;

  insert into public.aipify_cmg_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_comm', 'Several teams may benefit from additional communication.', 'high'),
  (p_tenant, 'ins_sponsor', 'Leadership sponsorship appears strong.', 'low'),
  (p_tenant, 'ins_training', 'Training participation remains below expectations.', 'medium')
  on conflict do nothing;

  insert into public.aipify_cmg_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_champions', 'This initiative may benefit from additional change champions.', 'medium'),
  (p_tenant, 'rec_frequency', 'Communication frequency appears insufficient.', 'high'),
  (p_tenant, 'rec_momentum', 'Several teams demonstrate strong adoption momentum.', 'low')
  on conflict do nothing;

  insert into public.aipify_cmg_center_reviews (
    tenant_id, review_key, initiative_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev_exec', 'chg_companion_rollout', 'executive', 'Executive change review — adoption confidence and leadership actions.', 'pending'),
  (p_tenant, 'rev_adopt', 'chg_approval_refresh', 'adoption', 'Adoption review — training completion and workflow uptake.', 'pending'),
  (p_tenant, 'rev_sentiment', null, 'stakeholder_sentiment', 'Stakeholder sentiment trends across active initiatives.', 'pending')
  on conflict (tenant_id, review_key) do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._cmg_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with init as (
    select
      count(*) filter (where status = 'active') as active_count,
      round(avg(adoption_pct), 1) as avg_adoption,
      round(avg(readiness_score), 1) as avg_readiness,
      count(*) filter (where readiness_band in ('attention_needed', 'not_ready')) as needs_attention
    from public.aipify_cmg_center_initiatives
    where tenant_id = p_tenant and status != 'archived'
  ),
  train as (
    select round(avg(completion_pct), 1) as avg_training
    from public.aipify_cmg_center_training where tenant_id = p_tenant
  ),
  comm as (
    select count(*) filter (where status = 'sent') as sent_count
    from public.aipify_cmg_center_communications where tenant_id = p_tenant
  )
  select jsonb_build_object(
    'active_initiatives', coalesce((select active_count from init), 0),
    'average_adoption_pct', coalesce((select avg_adoption from init), 0),
    'average_readiness_score', coalesce((select avg_readiness from init), 0),
    'initiatives_needing_attention', coalesce((select needs_attention from init), 0),
    'training_completion_pct', coalesce((select avg_training from train), 0),
    'communications_sent', coalesce((select sent_count from comm), 0),
    'communication_effectiveness', 4.1,
    'stakeholder_engagement_score', 4.0,
    'employee_confidence_score', 3.9,
    'leadership_satisfaction', 4.3,
    'initiative_success_rate', 82,
    'companion_usefulness_rating', 4.4,
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_change_management_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._cmg_require_tenant());
  perform public._irp_require_permission('change_management.view', v_tenant);

  if not exists (select 1 from public.aipify_cmg_center_initiatives where tenant_id = v_tenant limit 1) then
    v_seed := public._cmg_seed(v_tenant);
  end if;

  perform public._cmg_log(v_tenant, 'view_center', 'Change Management Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/change-management',
    'dashboard', public._cmg_dashboard_metrics(v_tenant),
    'initiatives', coalesce((select jsonb_agg(public._cmg_initiative_to_json(i) order by i.adoption_pct desc, i.created_at desc)
      from public.aipify_cmg_center_initiatives i where i.tenant_id = v_tenant and i.status != 'archived'), '[]'::jsonb),
    'stakeholders', coalesce((select jsonb_agg(jsonb_build_object(
      'stakeholder_key', s.stakeholder_key, 'initiative_key', s.initiative_key,
      'role_type', s.role_type, 'label', s.label, 'engagement_level', s.engagement_level
    ) order by s.role_type) from public.aipify_cmg_center_stakeholders s where s.tenant_id = v_tenant), '[]'::jsonb),
    'communications', coalesce((select jsonb_agg(jsonb_build_object(
      'communication_key', c.communication_key, 'initiative_key', c.initiative_key,
      'audience', c.audience, 'title', c.title, 'content', c.content,
      'status', c.status, 'created_at', c.created_at
    ) order by c.created_at desc) from public.aipify_cmg_center_communications c where c.tenant_id = v_tenant), '[]'::jsonb),
    'training', coalesce((select jsonb_agg(jsonb_build_object(
      'training_key', t.training_key, 'initiative_key', t.initiative_key,
      'label', t.label, 'role_target', t.role_target,
      'completion_pct', t.completion_pct, 'status', t.status
    ) order by t.completion_pct desc) from public.aipify_cmg_center_training t where t.tenant_id = v_tenant), '[]'::jsonb),
    'adoption_metrics', coalesce((select jsonb_agg(jsonb_build_object(
      'metric_key', m.metric_key, 'initiative_key', m.initiative_key,
      'label', m.label, 'value_label', m.value_label, 'trend', m.trend
    ) order by m.label) from public.aipify_cmg_center_adoption_metrics m where m.tenant_id = v_tenant), '[]'::jsonb),
    'feedback', coalesce((select jsonb_agg(jsonb_build_object(
      'feedback_key', f.feedback_key, 'initiative_key', f.initiative_key,
      'feedback_type', f.feedback_type, 'message', f.message, 'status', f.status,
      'created_at', f.created_at
    ) order by f.created_at desc) from public.aipify_cmg_center_feedback f where f.tenant_id = v_tenant and f.status != 'archived'), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_cmg_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_cmg_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'governance_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', gr.review_key, 'initiative_key', gr.initiative_key,
      'review_type', gr.review_type, 'prompt', gr.prompt,
      'status', gr.status, 'completed_at', gr.completed_at
    ) order by gr.review_key) from public.aipify_cmg_center_reviews gr where gr.tenant_id = v_tenant), '[]'::jsonb),
    'executive_view', jsonb_build_object(
      'strategic_initiatives', coalesce((select count(*) from public.aipify_cmg_center_initiatives where tenant_id = v_tenant and status = 'active' and category = 'strategic'), 0),
      'adoption_confidence', 'Moderate-to-strong adoption momentum in technology initiatives; process changes need reinforcement.',
      'stakeholder_sentiment', 'Leadership sponsorship strong; some teams request clearer communication.',
      'leadership_actions', 'Review training completion for approval refresh; expand change champion network.'
    ),
    'readiness_bands', public._cmgbp314_readiness_bands(),
    'change_workflow', public._cmgbp314_workflow(),
    'blueprint', public._cmgbp314_blueprint_summary(),
    'links', jsonb_build_object(
      'change_management', '/app/executive/change-management',
      'executive', '/app/executive',
      'organizational_health', '/app/executive/organizational-health',
      'continuous_improvement', '/app/executive/continuous-improvement',
      'organizational_resilience', '/app/executive/organizational-resilience',
      'decision_support', '/app/executive/decision-support'
    ),
    'privacy_note', public._cmgbp314_privacy_note(),
    'can_manage', public._irp_has_permission('change_management.manage', v_tenant),
    'can_contribute', public._irp_has_permission('change_management.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_change_management_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
  v_next_stage text;
begin
  v_tenant := public._cmg_require_tenant();

  if v_action in (
    'advance_workflow', 'send_communication', 'complete_training', 'review_feedback',
    'dismiss_insight', 'dismiss_recommendation', 'complete_review',
    'generate_communication_plan', 'generate_adoption_report', 'archive_initiative'
  ) then
    perform public._irp_require_permission('change_management.manage', v_tenant);

    if v_action = 'advance_workflow' then
      select case workflow_stage
        when 'identified' then 'business_case'
        when 'business_case' then 'stakeholders_mapped'
        when 'stakeholders_mapped' then 'communication_planned'
        when 'communication_planned' then 'training_coordinated'
        when 'training_coordinated' then 'implementation_executed'
        when 'implementation_executed' then 'adoption_measured'
        when 'adoption_measured' then 'lessons_captured'
        else workflow_stage
      end into v_next_stage
      from public.aipify_cmg_center_initiatives
      where tenant_id = v_tenant and initiative_key = nullif(p_payload->>'initiative_key', '');
      update public.aipify_cmg_center_initiatives set workflow_stage = v_next_stage
      where tenant_id = v_tenant and initiative_key = nullif(p_payload->>'initiative_key', '');
      perform public._cmg_log(v_tenant, 'initiative_launched', 'Workflow advanced', p_payload);
    elsif v_action = 'send_communication' then
      update public.aipify_cmg_center_communications set status = 'sent'
      where tenant_id = v_tenant and communication_key = nullif(p_payload->>'communication_key', '');
      perform public._cmg_log(v_tenant, 'communication_issued', 'Communication sent', p_payload);
    elsif v_action = 'complete_training' then
      update public.aipify_cmg_center_training
      set status = 'completed', completion_pct = 100
      where tenant_id = v_tenant and training_key = nullif(p_payload->>'training_key', '');
      perform public._cmg_log(v_tenant, 'training_completed', 'Training marked complete', p_payload);
    elsif v_action = 'review_feedback' then
      update public.aipify_cmg_center_feedback set status = 'reviewed'
      where tenant_id = v_tenant and feedback_key = nullif(p_payload->>'feedback_key', '');
    elsif v_action = 'dismiss_insight' then
      update public.aipify_cmg_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_cmg_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'complete_review' then
      update public.aipify_cmg_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._cmg_log(v_tenant, 'executive_review', 'Change review completed', p_payload);
    elsif v_action = 'archive_initiative' then
      update public.aipify_cmg_center_initiatives set status = 'archived'
      where tenant_id = v_tenant and initiative_key = nullif(p_payload->>'initiative_key', '');
      perform public._cmg_log(v_tenant, 'lessons_captured', 'Initiative archived', p_payload);
    elsif v_action = 'generate_communication_plan' then
      perform public._cmg_log(v_tenant, 'communication_issued', 'Communication plan generated', p_payload);
    elsif v_action = 'generate_adoption_report' then
      perform public._cmg_log(v_tenant, 'adoption_recorded', 'Adoption report generated', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('change_management.manage', v_tenant);
    update public.aipify_cmg_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_feedback' then
    perform public._irp_require_permission('change_management.contribute', v_tenant);
    insert into public.aipify_cmg_center_feedback (
      tenant_id, feedback_key, initiative_key, feedback_type, message
    ) values (
      v_tenant,
      'fb_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
      nullif(p_payload->>'initiative_key', ''),
      coalesce(nullif(p_payload->>'feedback_type', ''), 'suggestion'),
      left(coalesce(p_payload->>'message', 'Feedback contributed.'), 500)
    );
    perform public._cmg_log(v_tenant, 'lessons_captured', 'Feedback contributed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_change_management_center(uuid) to authenticated;
grant execute on function public.process_change_management_action(jsonb) to authenticated;
