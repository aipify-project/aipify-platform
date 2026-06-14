-- Phase 313 — Incident Command & Recovery Engine
-- Feature owner: Customer App — /app/operations/incident-command
-- Helpers: _icr_* (engine), _icrbp313_* (blueprint)
-- Cross-links observability and deployment — does NOT modify their RPCs

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
    'aipify_incident_command_recovery_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_icr_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  notification_preferences jsonb not null default '{"executive_alerts":true,"team_updates":true}'::jsonb,
  escalation_pathways jsonb not null default '{"sev1":["executive","operations"],"sev2":["operations","leadership"]}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_icr_center_settings enable row level security;
revoke all on public.aipify_icr_center_settings from authenticated, anon;

create table if not exists public.aipify_icr_center_incidents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  incident_key text not null,
  title text not null,
  summary text not null,
  category text not null check (category in (
    'technical', 'customer', 'security', 'operational', 'executive'
  )),
  severity text not null default 'sev3' check (severity in (
    'sev1', 'sev2', 'sev3', 'sev4', 'sev5'
  )),
  status text not null default 'investigating' check (status in (
    'investigating', 'identified', 'mitigating', 'monitoring', 'resolved', 'closed'
  )),
  workflow_stage text not null default 'detected' check (workflow_stage in (
    'detected', 'classified', 'owner_assigned', 'investigation_started',
    'recovery_executed', 'communication_updated', 'validation_completed', 'review_conducted'
  )),
  owner text not null default 'Unassigned',
  impact_summary text not null default '',
  systems_involved text[] not null default '{}',
  stakeholders_affected text[] not null default '{}',
  detected_at timestamptz not null default now(),
  resolved_at timestamptz,
  unique (tenant_id, incident_key)
);
alter table public.aipify_icr_center_incidents enable row level security;
revoke all on public.aipify_icr_center_incidents from authenticated, anon;

create table if not exists public.aipify_icr_center_timeline (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  timeline_key text not null,
  incident_key text not null,
  event_label text not null,
  event_summary text not null,
  occurred_at timestamptz not null default now(),
  unique (tenant_id, timeline_key)
);
alter table public.aipify_icr_center_timeline enable row level security;
revoke all on public.aipify_icr_center_timeline from authenticated, anon;

create table if not exists public.aipify_icr_center_communications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  communication_key text not null,
  incident_key text not null,
  audience text not null check (audience in (
    'internal', 'executive', 'customer', 'team'
  )),
  title text not null,
  content text not null,
  status text not null default 'draft' check (status in ('draft', 'sent', 'archived')),
  created_at timestamptz not null default now(),
  unique (tenant_id, communication_key)
);
alter table public.aipify_icr_center_communications enable row level security;
revoke all on public.aipify_icr_center_communications from authenticated, anon;

create table if not exists public.aipify_icr_center_recovery_actions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_key text not null,
  incident_key text not null,
  label text not null,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'failed')),
  unique (tenant_id, action_key)
);
alter table public.aipify_icr_center_recovery_actions enable row level security;
revoke all on public.aipify_icr_center_recovery_actions from authenticated, anon;

create table if not exists public.aipify_icr_center_self_healing (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  healing_key text not null,
  incident_key text,
  message text not null,
  outcome text not null check (outcome in ('success', 'failed', 'escalated')),
  created_at timestamptz not null default now(),
  unique (tenant_id, healing_key)
);
alter table public.aipify_icr_center_self_healing enable row level security;
revoke all on public.aipify_icr_center_self_healing from authenticated, anon;

create table if not exists public.aipify_icr_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  unique (tenant_id, insight_key)
);
alter table public.aipify_icr_center_insights enable row level security;
revoke all on public.aipify_icr_center_insights from authenticated, anon;

create table if not exists public.aipify_icr_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_icr_center_recommendations enable row level security;
revoke all on public.aipify_icr_center_recommendations from authenticated, anon;

create table if not exists public.aipify_icr_center_post_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  incident_key text not null,
  what_happened text not null,
  root_causes text not null,
  recovery_effectiveness text not null,
  lessons_learned text not null,
  improvements_required text not null,
  status text not null default 'pending' check (status in ('pending', 'completed')),
  unique (tenant_id, review_key)
);
alter table public.aipify_icr_center_post_reviews enable row level security;
revoke all on public.aipify_icr_center_post_reviews from authenticated, anon;

create table if not exists public.aipify_icr_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'incident_created', 'ownership_assigned', 'recovery_action',
    'communication_issued', 'self_healing_activity', 'post_review', 'governance_override', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_icr_center_audit_logs enable row level security;
revoke all on public.aipify_icr_center_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_incident_command_recovery_engine', v.description
from (values
  ('incident_command.view', 'View Incident Command Center', 'Review active incidents, recovery progress, and communications'),
  ('incident_command.manage', 'Manage Incident Command Center', 'Coordinate incidents, assign owners, and issue communications'),
  ('incident_command.contribute', 'Contribute Incident Updates', 'Submit timeline notes and recovery observations')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'incident_command.view'), ('owner', 'incident_command.manage'), ('owner', 'incident_command.contribute'),
  ('administrator', 'incident_command.view'), ('administrator', 'incident_command.manage'), ('administrator', 'incident_command.contribute'),
  ('manager', 'incident_command.view'), ('manager', 'incident_command.manage'),
  ('employee', 'incident_command.view'),
  ('support_agent', 'incident_command.view'), ('support_agent', 'incident_command.contribute'),
  ('moderator', 'incident_command.view'), ('viewer', 'incident_command.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_incident_command_recovery_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_incident_command_recovery_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _icrbp313_*
-- ---------------------------------------------------------------------------
create or replace function public._icrbp313_core_principle() returns text language sql immutable as $$
  select 'Incidents are inevitable. Chaos is optional. Aipify should help organizations respond with clarity, speed, and confidence.';
$$;

create or replace function public._icrbp313_philosophy() returns text language sql immutable as $$
  select 'Detect quickly, coordinate effectively, recover efficiently, and learn continuously.';
$$;

create or replace function public._icrbp313_vision() returns text language sql immutable as $$
  select 'Help organizations navigate disruptions with professionalism, transparency, and a relentless focus on learning and improvement.';
$$;

create or replace function public._icrbp313_severity_levels() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'sev1', 'label', 'SEV-1 Critical'),
    jsonb_build_object('key', 'sev2', 'label', 'SEV-2 High'),
    jsonb_build_object('key', 'sev3', 'label', 'SEV-3 Moderate'),
    jsonb_build_object('key', 'sev4', 'label', 'SEV-4 Low'),
    jsonb_build_object('key', 'sev5', 'label', 'SEV-5 Informational')
  );
$$;

create or replace function public._icrbp313_workflow() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('stage', 'detected', 'label', 'Incident detected'),
    jsonb_build_object('stage', 'classified', 'label', 'Incident classified'),
    jsonb_build_object('stage', 'owner_assigned', 'label', 'Owner assigned'),
    jsonb_build_object('stage', 'investigation_started', 'label', 'Investigation started'),
    jsonb_build_object('stage', 'recovery_executed', 'label', 'Recovery actions executed'),
    jsonb_build_object('stage', 'communication_updated', 'label', 'Communication updated'),
    jsonb_build_object('stage', 'validation_completed', 'label', 'Validation completed'),
    jsonb_build_object('stage', 'review_conducted', 'label', 'Post-incident review conducted')
  );
$$;

create or replace function public._icrbp313_privacy_note() returns text language sql immutable as $$
  select 'Incident Command Center stores incident metadata, recovery summaries, and governance events only — never customer content or PII.';
$$;

create or replace function public._icrbp313_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 313 — Incident Command & Recovery Engine',
    'route', '/app/operations/incident-command',
    'core_principle', public._icrbp313_core_principle(),
    'philosophy', public._icrbp313_philosophy(),
    'vision', public._icrbp313_vision(),
    'severity_levels', public._icrbp313_severity_levels(),
    'workflow', public._icrbp313_workflow(),
    'privacy_note', public._icrbp313_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _icr_*
-- ---------------------------------------------------------------------------
create or replace function public._icr_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._icr_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_icr_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._icr_incident_to_json(i public.aipify_icr_center_incidents)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'incident_key', i.incident_key, 'title', i.title, 'summary', i.summary,
    'category', i.category, 'severity', i.severity, 'status', i.status,
    'workflow_stage', i.workflow_stage, 'owner', i.owner,
    'impact_summary', i.impact_summary, 'systems_involved', i.systems_involved,
    'stakeholders_affected', i.stakeholders_affected,
    'detected_at', i.detected_at, 'resolved_at', i.resolved_at
  );
$$;

create or replace function public._icr_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_icr_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_icr_center_incidents (
    tenant_id, incident_key, title, summary, category, severity, status,
    workflow_stage, owner, impact_summary, systems_involved, stakeholders_affected, detected_at
  ) values
  (
    p_tenant, 'inc_email_queue', 'Email queue processing delay',
    'Background email queue experienced elevated latency during peak hours.',
    'technical', 'sev3', 'mitigating', 'recovery_executed',
    'Operations Engineering',
    'Moderate impact on notification delivery — no data loss observed.',
    array['email', 'queues'], array['operations', 'customers'],
    now() - interval '2 hours'
  ),
  (
    p_tenant, 'inc_shopify_sync', 'Shopify integration sync interruption',
    'Brief Shopify sync failure detected — self-healing recovery initiated.',
    'technical', 'sev4', 'monitoring', 'validation_completed',
    'Integration Team',
    'Limited impact — sync restored within 12 minutes.',
    array['shopify', 'integrations'], array['commerce'],
    now() - interval '6 hours'
  ),
  (
    p_tenant, 'inc_support_esc', 'Major support escalation cluster',
    'Elevated support ticket volume following deployment update.',
    'customer', 'sev2', 'investigating', 'investigation_started',
    'Customer Success Lead',
    'Increased support load — response times elevated for priority customers.',
    array['support', 'deployments'], array['support', 'customers', 'leadership'],
    now() - interval '45 minutes'
  )
  on conflict do nothing;

  insert into public.aipify_icr_center_timeline (
    tenant_id, timeline_key, incident_key, event_label, event_summary, occurred_at
  ) values
  (p_tenant, 'tl_1', 'inc_email_queue', 'Incident detected', 'Queue latency threshold exceeded.', now() - interval '2 hours'),
  (p_tenant, 'tl_2', 'inc_email_queue', 'Owner assigned', 'Operations Engineering assigned as incident owner.', now() - interval '1 hour 50 minutes'),
  (p_tenant, 'tl_3', 'inc_email_queue', 'Recovery initiated', 'Queue worker scaling and retry policy applied.', now() - interval '1 hour 20 minutes'),
  (p_tenant, 'tl_4', 'inc_support_esc', 'Incident detected', 'Support escalation cluster identified by observability correlation.', now() - interval '45 minutes')
  on conflict do nothing;

  insert into public.aipify_icr_center_communications (
    tenant_id, communication_key, incident_key, audience, title, content, status
  ) values
  (
    p_tenant, 'com_int', 'inc_email_queue', 'internal',
    'Internal update — email queue mitigation',
    'Operations is mitigating email queue latency. Customer data unaffected. ETA for full recovery: 30 minutes.',
    'sent'
  ),
  (
    p_tenant, 'com_exec', 'inc_support_esc', 'executive',
    'Executive summary — support escalation cluster',
    'Elevated support volume following deployment. Customer Success coordinating response. No service outage.',
    'draft'
  )
  on conflict do nothing;

  insert into public.aipify_icr_center_recovery_actions (
    tenant_id, action_key, incident_key, label, status
  ) values
  (p_tenant, 'ra_scale', 'inc_email_queue', 'Scale queue workers', 'completed'),
  (p_tenant, 'ra_retry', 'inc_email_queue', 'Apply retry policy adjustment', 'in_progress'),
  (p_tenant, 'ra_sync', 'inc_shopify_sync', 'Restart Shopify sync connector', 'completed'),
  (p_tenant, 'ra_support', 'inc_support_esc', 'Deploy support triage playbook', 'pending')
  on conflict do nothing;

  insert into public.aipify_icr_center_self_healing (
    tenant_id, healing_key, incident_key, message, outcome
  ) values
  (
    p_tenant, 'sh_email', 'inc_email_queue',
    'Aipify restored email queue functionality automatically.', 'success'
  ),
  (
    p_tenant, 'sh_shopify', 'inc_shopify_sync',
    'Self-healing restarted Shopify sync connector successfully.', 'success'
  ),
  (
    p_tenant, 'sh_escalate', 'inc_support_esc',
    'Manual intervention is recommended for support escalation coordination.', 'escalated'
  )
  on conflict do nothing;

  insert into public.aipify_icr_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_recovery', 'Recovery actions are progressing effectively.', 'medium'),
  (p_tenant, 'ins_similar', 'This incident resembles previous events with known resolutions.', 'low'),
  (p_tenant, 'ins_coord', 'Cross-functional coordination may accelerate recovery.', 'high')
  on conflict do nothing;

  insert into public.aipify_icr_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_docs', 'This type of incident may benefit from updated recovery documentation.', 'medium'),
  (p_tenant, 'rec_prepared', 'Preparedness improvements have reduced recovery times.', 'low'),
  (p_tenant, 'rec_deps', 'Several recurring incidents share common dependencies.', 'medium')
  on conflict do nothing;

  insert into public.aipify_icr_center_post_reviews (
    tenant_id, review_key, incident_key, what_happened, root_causes,
    recovery_effectiveness, lessons_learned, improvements_required, status
  ) values
  (
    p_tenant, 'pir_shopify', 'inc_shopify_sync',
    'Shopify sync connector experienced a transient authentication timeout.',
    'Token refresh race condition during peak sync window.',
    'Self-healing recovery restored service within 12 minutes.',
    'Implement proactive token refresh before expiry window.',
    'Add connector health pre-check to deployment validation.',
    'pending'
  )
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._icr_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with inc as (
    select
      count(*) filter (where status not in ('resolved', 'closed')) as active_count,
      count(*) filter (where severity in ('sev1', 'sev2') and status not in ('resolved', 'closed')) as major_count,
      count(*) filter (where severity = 'sev1') as sev1_count,
      count(*) filter (where severity = 'sev2') as sev2_count,
      count(*) filter (where severity = 'sev3') as sev3_count,
      count(*) filter (where status = 'resolved') as resolved_count
    from public.aipify_icr_center_incidents where tenant_id = p_tenant
  ),
  healing as (
    select
      count(*) filter (where outcome = 'success') as success_count,
      count(*) filter (where outcome = 'failed') as failed_count,
      count(*) filter (where outcome = 'escalated') as escalated_count
    from public.aipify_icr_center_self_healing where tenant_id = p_tenant
  )
  select jsonb_build_object(
    'active_incidents', coalesce((select active_count from inc), 0),
    'major_incidents', coalesce((select major_count from inc), 0),
    'severity_distribution', jsonb_build_object(
      'sev1', coalesce((select sev1_count from inc), 0),
      'sev2', coalesce((select sev2_count from inc), 0),
      'sev3', coalesce((select sev3_count from inc), 0)
    ),
    'mean_time_to_recovery_minutes', 28,
    'mean_time_to_detection_minutes', 6,
    'mean_time_to_acknowledgment_minutes', 11,
    'self_healing_interventions', coalesce((select success_count + failed_count + escalated_count from healing), 0),
    'self_healing_success_rate', 85,
    'recovery_progress_pct', 72,
    'communication_responsiveness_score', 4.3,
    'executive_confidence', 4.4,
    'operational_resilience_score', 82,
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_incident_command_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._icr_require_tenant());
  perform public._irp_require_permission('incident_command.view', v_tenant);

  if not exists (select 1 from public.aipify_icr_center_incidents where tenant_id = v_tenant limit 1) then
    v_seed := public._icr_seed(v_tenant);
  end if;

  perform public._icr_log(v_tenant, 'view_center', 'Incident Command Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/operations/incident-command',
    'dashboard', public._icr_dashboard_metrics(v_tenant),
    'incidents', coalesce((select jsonb_agg(public._icr_incident_to_json(i) order by
      case i.severity when 'sev1' then 1 when 'sev2' then 2 when 'sev3' then 3 when 'sev4' then 4 else 5 end,
      case i.status when 'investigating' then 1 when 'identified' then 2 when 'mitigating' then 3 when 'monitoring' then 4 else 5 end,
      i.detected_at desc)
      from public.aipify_icr_center_incidents i where i.tenant_id = v_tenant and i.status != 'closed'), '[]'::jsonb),
    'timeline', coalesce((select jsonb_agg(jsonb_build_object(
      'timeline_key', t.timeline_key, 'incident_key', t.incident_key,
      'event_label', t.event_label, 'event_summary', t.event_summary, 'occurred_at', t.occurred_at
    ) order by t.occurred_at desc) from public.aipify_icr_center_timeline t where t.tenant_id = v_tenant), '[]'::jsonb),
    'communications', coalesce((select jsonb_agg(jsonb_build_object(
      'communication_key', c.communication_key, 'incident_key', c.incident_key,
      'audience', c.audience, 'title', c.title, 'content', c.content,
      'status', c.status, 'created_at', c.created_at
    ) order by c.created_at desc) from public.aipify_icr_center_communications c where c.tenant_id = v_tenant), '[]'::jsonb),
    'recovery_actions', coalesce((select jsonb_agg(jsonb_build_object(
      'action_key', a.action_key, 'incident_key', a.incident_key,
      'label', a.label, 'status', a.status
    ) order by a.action_key) from public.aipify_icr_center_recovery_actions a where a.tenant_id = v_tenant), '[]'::jsonb),
    'self_healing', coalesce((select jsonb_agg(jsonb_build_object(
      'healing_key', h.healing_key, 'incident_key', h.incident_key,
      'message', h.message, 'outcome', h.outcome, 'created_at', h.created_at
    ) order by h.created_at desc) from public.aipify_icr_center_self_healing h where h.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_icr_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_icr_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'post_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', pr.review_key, 'incident_key', pr.incident_key,
      'what_happened', pr.what_happened, 'root_causes', pr.root_causes,
      'recovery_effectiveness', pr.recovery_effectiveness,
      'lessons_learned', pr.lessons_learned, 'improvements_required', pr.improvements_required,
      'status', pr.status
    ) order by pr.review_key) from public.aipify_icr_center_post_reviews pr where pr.tenant_id = v_tenant), '[]'::jsonb),
    'executive_view', jsonb_build_object(
      'active_major_incidents', coalesce((select major_count from (
        select count(*) filter (where severity in ('sev1', 'sev2') and status not in ('resolved', 'closed')) as major_count
        from public.aipify_icr_center_incidents where tenant_id = v_tenant
      ) s), 0),
      'business_impact_summary', 'One moderate technical incident and one high-priority customer escalation under active coordination.',
      'recovery_confidence', 'Recovery actions progressing — self-healing effective for integration incidents.',
      'strategic_implication', 'Continued investment in incident preparedness strengthens operational resilience.'
    ),
    'severity_levels', public._icrbp313_severity_levels(),
    'incident_workflow', public._icrbp313_workflow(),
    'blueprint', public._icrbp313_blueprint_summary(),
    'links', jsonb_build_object(
      'incident_command', '/app/operations/incident-command',
      'operations', '/app/operations',
      'observability', '/app/operations/platform-observability',
      'deployments', '/app/operations/deployments',
      'automation_control', '/app/operations/automation-control',
      'executive', '/app/executive'
    ),
    'privacy_note', public._icrbp313_privacy_note(),
    'can_manage', public._irp_has_permission('incident_command.manage', v_tenant),
    'can_contribute', public._irp_has_permission('incident_command.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_incident_command_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
  v_next_status text;
  v_next_stage text;
begin
  v_tenant := public._icr_require_tenant();

  if v_action in (
    'assign_owner', 'advance_status', 'advance_workflow', 'complete_recovery_action',
    'send_communication', 'dismiss_insight', 'dismiss_recommendation', 'complete_post_review',
    'close_incident', 'generate_executive_summary', 'generate_incident_report'
  ) then
    perform public._irp_require_permission('incident_command.manage', v_tenant);

    if v_action = 'assign_owner' then
      update public.aipify_icr_center_incidents
      set owner = left(coalesce(p_payload->>'owner', 'Operations'), 120),
          workflow_stage = case when workflow_stage = 'detected' then 'owner_assigned' else workflow_stage end
      where tenant_id = v_tenant and incident_key = nullif(p_payload->>'incident_key', '');
      perform public._icr_log(v_tenant, 'ownership_assigned', 'Incident owner assigned', p_payload);
    elsif v_action = 'advance_status' then
      select case status
        when 'investigating' then 'identified'
        when 'identified' then 'mitigating'
        when 'mitigating' then 'monitoring'
        when 'monitoring' then 'resolved'
        when 'resolved' then 'closed'
        else status
      end into v_next_status
      from public.aipify_icr_center_incidents
      where tenant_id = v_tenant and incident_key = nullif(p_payload->>'incident_key', '');
      update public.aipify_icr_center_incidents
      set status = v_next_status,
          resolved_at = case when v_next_status = 'resolved' then now() else resolved_at end
      where tenant_id = v_tenant and incident_key = nullif(p_payload->>'incident_key', '');
      perform public._icr_log(v_tenant, 'recovery_action', 'Incident status advanced', p_payload);
    elsif v_action = 'advance_workflow' then
      select case workflow_stage
        when 'detected' then 'classified'
        when 'classified' then 'owner_assigned'
        when 'owner_assigned' then 'investigation_started'
        when 'investigation_started' then 'recovery_executed'
        when 'recovery_executed' then 'communication_updated'
        when 'communication_updated' then 'validation_completed'
        when 'validation_completed' then 'review_conducted'
        else workflow_stage
      end into v_next_stage
      from public.aipify_icr_center_incidents
      where tenant_id = v_tenant and incident_key = nullif(p_payload->>'incident_key', '');
      update public.aipify_icr_center_incidents set workflow_stage = v_next_stage
      where tenant_id = v_tenant and incident_key = nullif(p_payload->>'incident_key', '');
      perform public._icr_log(v_tenant, 'recovery_action', 'Workflow stage advanced', p_payload);
    elsif v_action = 'complete_recovery_action' then
      update public.aipify_icr_center_recovery_actions set status = 'completed'
      where tenant_id = v_tenant and action_key = nullif(p_payload->>'action_key', '');
      perform public._icr_log(v_tenant, 'recovery_action', 'Recovery action completed', p_payload);
    elsif v_action = 'send_communication' then
      update public.aipify_icr_center_communications set status = 'sent'
      where tenant_id = v_tenant and communication_key = nullif(p_payload->>'communication_key', '');
      perform public._icr_log(v_tenant, 'communication_issued', 'Communication sent', p_payload);
    elsif v_action = 'dismiss_insight' then
      update public.aipify_icr_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_icr_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'complete_post_review' then
      update public.aipify_icr_center_post_reviews set status = 'completed'
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._icr_log(v_tenant, 'post_review', 'Post-incident review completed', p_payload);
    elsif v_action = 'close_incident' then
      update public.aipify_icr_center_incidents
      set status = 'closed', resolved_at = coalesce(resolved_at, now())
      where tenant_id = v_tenant and incident_key = nullif(p_payload->>'incident_key', '');
      perform public._icr_log(v_tenant, 'incident_created', 'Incident closed', p_payload);
    elsif v_action = 'generate_executive_summary' then
      perform public._icr_log(v_tenant, 'communication_issued', 'Executive summary generated', p_payload);
    elsif v_action = 'generate_incident_report' then
      perform public._icr_log(v_tenant, 'governance_override', 'Incident report generated', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('incident_command.manage', v_tenant);
    update public.aipify_icr_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_timeline_note' then
    perform public._irp_require_permission('incident_command.contribute', v_tenant);
    insert into public.aipify_icr_center_timeline (
      tenant_id, timeline_key, incident_key, event_label, event_summary
    ) values (
      v_tenant,
      'tl_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
      nullif(p_payload->>'incident_key', ''),
      left(coalesce(p_payload->>'event_label', 'Update'), 120),
      left(coalesce(p_payload->>'event_summary', 'Timeline note contributed.'), 500)
    );
    perform public._icr_log(v_tenant, 'recovery_action', 'Timeline note contributed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_incident_command_center(uuid) to authenticated;
grant execute on function public.process_incident_command_action(jsonb) to authenticated;
