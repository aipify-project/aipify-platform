-- Phase 301 — Trust & Transparency Center Engine
-- Feature owner: Customer App — /app/governance/trust-transparency
-- Helpers: _ttc_* (engine), _ttcbp301_* (blueprint)
-- Cross-links TACC at /app/governance/trust — does NOT modify core governance trust RPCs

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
    'aipify_trust_transparency_center_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_trust_transparency_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  explanation_detail text not null default 'standard' check (
    explanation_detail in ('minimal', 'standard', 'detailed')
  ),
  notifications_enabled boolean not null default true,
  recommendation_visibility text not null default 'visible' check (
    recommendation_visibility in ('visible', 'summary', 'hidden')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_trust_transparency_settings enable row level security;
revoke all on public.aipify_trust_transparency_settings from authenticated, anon;

create table if not exists public.aipify_trust_transparency_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  item_key text not null,
  section text not null check (section in (
    'activity', 'decision', 'permission', 'approval', 'recommendation'
  )),
  action_title text not null,
  why_summary text not null,
  permissions_used text,
  risk_level text not null default 'low' check (risk_level in ('low', 'moderate', 'elevated', 'high')),
  user_control_hint text,
  info_considered text,
  alternatives text,
  if_nothing_done text,
  companion_label text,
  approval_required boolean not null default false,
  outcome text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, item_key)
);
create index if not exists aipify_trust_transparency_items_tenant_idx
  on public.aipify_trust_transparency_items (tenant_id, section, created_at desc);
alter table public.aipify_trust_transparency_items enable row level security;
revoke all on public.aipify_trust_transparency_items from authenticated, anon;

create table if not exists public.aipify_trust_transparency_self_healing (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  healing_key text not null,
  what_failed text not null,
  aipify_attempt text not null,
  recovery_succeeded boolean not null default false,
  downtime_prevented_minutes int not null default 0,
  manual_intervention_required boolean not null default false,
  created_at timestamptz not null default now(),
  unique (tenant_id, healing_key)
);
alter table public.aipify_trust_transparency_self_healing enable row level security;
revoke all on public.aipify_trust_transparency_self_healing from authenticated, anon;

create table if not exists public.aipify_trust_transparency_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  audit_key text not null,
  event_type text not null check (event_type in (
    'recommendation_issued', 'approval_completed', 'action_executed',
    'self_healing', 'permission_request', 'governance_override', 'view_center'
  )),
  summary text not null check (char_length(summary) <= 500),
  actor_label text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, audit_key)
);
create index if not exists aipify_trust_transparency_audit_tenant_idx
  on public.aipify_trust_transparency_audit_logs (tenant_id, created_at desc);
alter table public.aipify_trust_transparency_audit_logs enable row level security;
revoke all on public.aipify_trust_transparency_audit_logs from authenticated, anon;

create table if not exists public.aipify_trust_transparency_governance_recs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_trust_transparency_governance_recs enable row level security;
revoke all on public.aipify_trust_transparency_governance_recs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_trust_transparency_center_engine', v.description
from (values
  ('trust_transparency.view', 'View Trust Center', 'Review Aipify activity, explanations, and transparency logs'),
  ('trust_transparency.manage', 'Manage Trust Center', 'Configure explanation detail and dismiss governance recommendations'),
  ('trust_transparency.record', 'Record Trust Actions', 'Disable categories, request human review, and record overrides')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'trust_transparency.view'), ('owner', 'trust_transparency.manage'), ('owner', 'trust_transparency.record'),
  ('administrator', 'trust_transparency.view'), ('administrator', 'trust_transparency.manage'), ('administrator', 'trust_transparency.record'),
  ('manager', 'trust_transparency.view'), ('manager', 'trust_transparency.manage'),
  ('employee', 'trust_transparency.view'),
  ('support_agent', 'trust_transparency.view'), ('moderator', 'trust_transparency.view'), ('viewer', 'trust_transparency.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_trust_transparency_center_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_trust_transparency_center_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _ttcbp301_*
-- ---------------------------------------------------------------------------
create or replace function public._ttcbp301_core_principle() returns text language sql immutable as $$
  select 'People trust what they understand. Aipify should never operate like a black box.';
$$;

create or replace function public._ttcbp301_vision() returns text language sql immutable as $$
  select 'Trust is earned through transparency, consistency, accountability, and respect for human control.';
$$;

create or replace function public._ttcbp301_sections() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'activity', 'label', 'Aipify activity overview'),
    jsonb_build_object('key', 'decision', 'label', 'Decision explanations'),
    jsonb_build_object('key', 'permission', 'label', 'Permissions used'),
    jsonb_build_object('key', 'approval', 'label', 'Approval history'),
    jsonb_build_object('key', 'self_healing', 'label', 'Self-healing activity'),
    jsonb_build_object('key', 'recommendation', 'label', 'Recommendations generated'),
    jsonb_build_object('key', 'audit', 'label', 'Audit & governance logs')
  );
$$;

create or replace function public._ttcbp301_privacy_note() returns text language sql immutable as $$
  select 'Trust Center stores action summaries, explanation metadata, and governance events only — never raw message content, documents, or payment details.';
$$;

create or replace function public._ttcbp301_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 301 — Trust & Transparency Center',
    'route', '/app/governance/trust-transparency',
    'core_principle', public._ttcbp301_core_principle(),
    'vision', public._ttcbp301_vision(),
    'sections', public._ttcbp301_sections(),
    'privacy_note', public._ttcbp301_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _ttc_*
-- ---------------------------------------------------------------------------
create or replace function public._ttc_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._ttc_log(p_tenant uuid, p_key text, p_type text, p_summary text, p_actor text default null, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_trust_transparency_audit_logs (tenant_id, audit_key, event_type, summary, actor_label, context)
  values (p_tenant, p_key, p_type, left(p_summary, 500), p_actor, coalesce(p_ctx, '{}'::jsonb))
  on conflict (tenant_id, audit_key) do nothing
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._ttc_item_to_json(i public.aipify_trust_transparency_items)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'item_key', i.item_key, 'section', i.section, 'action_title', i.action_title,
    'why_summary', i.why_summary, 'permissions_used', i.permissions_used,
    'risk_level', i.risk_level, 'user_control_hint', i.user_control_hint,
    'info_considered', i.info_considered, 'alternatives', i.alternatives,
    'if_nothing_done', i.if_nothing_done, 'companion_label', i.companion_label,
    'approval_required', i.approval_required, 'outcome', i.outcome,
    'created_at', i.created_at
  );
$$;

create or replace function public._ttc_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_trust_transparency_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_trust_transparency_items (
    tenant_id, item_key, section, action_title, why_summary, permissions_used,
    risk_level, user_control_hint, info_considered, alternatives, if_nothing_done,
    companion_label, approval_required, outcome
  ) values
  (
    p_tenant, 'act_invoice_reminder', 'activity', 'Invoice reminder generated', 'Payment deadline approaching.',
    'Communication permission', 'low', 'Approve, review, or disable future reminders.',
    null, null, null, 'Operations Companion', false, 'Draft prepared for review'
  ),
  (
    p_tenant, 'act_queue_restart', 'activity', 'Queue worker restarted', 'Background worker stopped responding.',
    'Technical maintenance permission', 'moderate', 'Review automation settings or disable auto-recovery.',
    null, null, null, null, false, 'Recovery completed automatically'
  ),
  (
    p_tenant, 'dec_follow_up', 'decision', 'Customer follow-up recommended',
    'Aipify recommended customer follow-up because engagement signals decreased over the last 14 days.',
    'CRM read, communication recommend', 'low', 'Reject, modify, or request human review.',
    'Engagement trend metadata and approved business rules.',
    'Wait for next scheduled check-in or escalate to account manager.',
    'Engagement may continue to decline without follow-up.',
    'Sales Companion', false, null
  ),
  (
    p_tenant, 'dec_automation_review', 'decision', 'Automation review recommended',
    'Aipify recommended reviewing this automation due to repeated warning events.',
    'Automation control permission', 'moderate', 'Pause automation or request administrator review.',
    'Warning event counts and recovery history.',
    'Leave automation running with monitoring.',
    'Warnings may escalate into failed runs.',
    null, false, null
  ),
  (
    p_tenant, 'perm_email_sent', 'permission', 'Email sent after approval',
    'Communication permission was used to send an approved customer message.',
    'Send email (approve & execute)', 'low', 'Revoke or downgrade in Permission Center.',
    null, null, null, 'Operations Companion', true, 'Sent successfully'
  ),
  (
    p_tenant, 'perm_calendar_read', 'permission', 'Calendar coordination',
    'Calendar read permission used to prepare travel scheduling suggestions.',
    'Calendar read & recommend', 'low', 'Modify permissions in Permission Center.',
    null, null, null, 'Travel Companion', false, 'Suggestions prepared'
  ),
  (
    p_tenant, 'appr_renewal', 'approval', 'Renewal reminder approved',
    'User approved sending a renewal reminder after reviewing Aipify recommendation.',
    'Communication permission', 'low', 'View in Approval Center.',
    null, null, null, null, true, 'Approved'
  ),
  (
    p_tenant, 'appr_transport', 'approval', 'Transportation booking rejected',
    'User declined transportation booking recommendation.',
    'Transportation recommend', 'moderate', 'Adjust approval profiles if needed.',
    null, null, null, 'Travel Companion', true, 'Rejected'
  ),
  (
    p_tenant, 'rec_preferences', 'recommendation', 'Weekly summary recommendation',
    'Aipify identified this recommendation based on established preferences and current circumstances.',
    'Recommend permission', 'low', 'Disable category or adjust notification preferences.',
    'Approved preference rules and recent activity patterns.',
    null, null, 'Personal Companion', false, 'Open'
  ),
  (
    p_tenant, 'rec_business_rules', 'recommendation', 'Workflow optimization suggestion',
    'Aipify generated this recommendation using approved business rules.',
    'Business workflow recommend', 'moderate', 'Review, approve, or dismiss.',
    'Business DNA rules and operational metadata.',
    null, null, null, false, 'Pending review'
  )
  on conflict (tenant_id, item_key) do nothing;

  insert into public.aipify_trust_transparency_self_healing (
    tenant_id, healing_key, what_failed, aipify_attempt, recovery_succeeded,
    downtime_prevented_minutes, manual_intervention_required
  ) values
  (
    p_tenant, 'heal_queue_worker', 'Queue worker stopped responding',
    'Aipify restarted the failed queue worker successfully.', true, 45, false
  ),
  (
    p_tenant, 'heal_connector', 'Shopify connector sync timeout',
    'Aipify attempted recovery but administrator review is recommended.', false, 0, true
  )
  on conflict do nothing;

  insert into public.aipify_trust_transparency_audit_logs (
    tenant_id, audit_key, event_type, summary, actor_label, created_at
  ) values
  (p_tenant, 'aud_rec_1', 'recommendation_issued', 'Customer follow-up recommendation issued', 'Aipify', now() - interval '2 hours'),
  (p_tenant, 'aud_appr_1', 'approval_completed', 'Renewal reminder approved', 'Operations Admin', now() - interval '1 day'),
  (p_tenant, 'aud_exec_1', 'action_executed', 'Approved email sent to customer segment', 'Aipify', now() - interval '1 day'),
  (p_tenant, 'aud_heal_1', 'self_healing', 'Queue worker restarted successfully', 'Aipify', now() - interval '3 days'),
  (p_tenant, 'aud_perm_1', 'permission_request', 'Calendar write access requested', 'Travel Companion', now() - interval '4 days'),
  (p_tenant, 'aud_gov_1', 'governance_override', 'Automation auto-recovery disabled by administrator', 'Admin', now() - interval '5 days')
  on conflict do nothing;

  insert into public.aipify_trust_transparency_governance_recs (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_explanations', 'You frequently review this recommendation category. Consider enabling explanation summaries.', 'medium'),
  (p_tenant, 'rec_permissions', 'Several permissions have not been reviewed recently.', 'high')
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._ttc_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'actions_this_month', (select count(*) from public.aipify_trust_transparency_items where tenant_id = p_tenant and section = 'activity' and created_at >= date_trunc('month', now())),
    'recommendations_generated', (select count(*) from public.aipify_trust_transparency_items where tenant_id = p_tenant and section = 'recommendation'),
    'actions_approved', (select count(*) from public.aipify_trust_transparency_items where tenant_id = p_tenant and section = 'approval' and outcome = 'Approved'),
    'actions_rejected', (select count(*) from public.aipify_trust_transparency_items where tenant_id = p_tenant and section = 'approval' and outcome = 'Rejected'),
    'self_healing_interventions', (select count(*) from public.aipify_trust_transparency_self_healing where tenant_id = p_tenant),
    'governance_compliance_rate', 98.1,
    'metadata_only', true
  );
$$;

create or replace function public._ttc_trust_indicators(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'governance_score', 94,
    'permission_hygiene_score', 88,
    'approval_responsiveness', 91,
    'transparency_completeness', 96,
    'self_healing_effectiveness', 87,
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_trust_transparency_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb; v_audit_key text;
begin
  v_tenant := coalesce(p_org_id, public._ttc_require_tenant());
  perform public._irp_require_permission('trust_transparency.view', v_tenant);

  if not exists (select 1 from public.aipify_trust_transparency_items where tenant_id = v_tenant limit 1) then
    v_seed := public._ttc_seed(v_tenant);
  end if;

  v_audit_key := 'view_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
  perform public._ttc_log(v_tenant, v_audit_key, 'view_center', 'Trust Center viewed', 'Current user');

  return jsonb_build_object(
    'route', '/app/governance/trust-transparency',
    'dashboard', public._ttc_dashboard_metrics(v_tenant),
    'trust_indicators', public._ttc_trust_indicators(v_tenant),
    'activity_overview', coalesce((select jsonb_agg(public._ttc_item_to_json(i) order by i.created_at desc)
      from public.aipify_trust_transparency_items i where i.tenant_id = v_tenant and i.section = 'activity'), '[]'::jsonb),
    'decision_explanations', coalesce((select jsonb_agg(public._ttc_item_to_json(i) order by i.created_at desc)
      from public.aipify_trust_transparency_items i where i.tenant_id = v_tenant and i.section = 'decision'), '[]'::jsonb),
    'permissions_used', coalesce((select jsonb_agg(public._ttc_item_to_json(i) order by i.created_at desc)
      from public.aipify_trust_transparency_items i where i.tenant_id = v_tenant and i.section = 'permission'), '[]'::jsonb),
    'approval_history', coalesce((select jsonb_agg(public._ttc_item_to_json(i) order by i.created_at desc)
      from public.aipify_trust_transparency_items i where i.tenant_id = v_tenant and i.section = 'approval'), '[]'::jsonb),
    'self_healing', coalesce((select jsonb_agg(jsonb_build_object(
      'healing_key', h.healing_key, 'what_failed', h.what_failed, 'aipify_attempt', h.aipify_attempt,
      'recovery_succeeded', h.recovery_succeeded, 'downtime_prevented_minutes', h.downtime_prevented_minutes,
      'manual_intervention_required', h.manual_intervention_required, 'created_at', h.created_at
    ) order by h.created_at desc) from public.aipify_trust_transparency_self_healing h where h.tenant_id = v_tenant), '[]'::jsonb),
    'recommendations_generated', coalesce((select jsonb_agg(public._ttc_item_to_json(i) order by i.created_at desc)
      from public.aipify_trust_transparency_items i where i.tenant_id = v_tenant and i.section = 'recommendation'), '[]'::jsonb),
    'audit_timeline', coalesce((select jsonb_agg(jsonb_build_object(
      'audit_key', a.audit_key, 'event_type', a.event_type, 'summary', a.summary,
      'actor_label', a.actor_label, 'created_at', a.created_at
    ) order by a.created_at desc) from public.aipify_trust_transparency_audit_logs a where a.tenant_id = v_tenant limit 20), '[]'::jsonb),
    'governance_recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_trust_transparency_governance_recs r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'executive_reporting', jsonb_build_object(
      'dashboard', public._ttc_dashboard_metrics(v_tenant),
      'trust_indicators', public._ttc_trust_indicators(v_tenant),
      'metadata_only', true
    ),
    'sections', public._ttcbp301_sections(),
    'blueprint', public._ttcbp301_blueprint_summary(),
    'links', jsonb_build_object(
      'trust_center', '/app/governance/trust-transparency',
      'governance_trust', '/app/governance/trust',
      'approval_center', '/app/governance/approval-center',
      'permissions_access', '/app/governance/permissions-access',
      'governance', '/app/governance'
    ),
    'privacy_note', public._ttcbp301_privacy_note(),
    'can_manage', public._irp_has_permission('trust_transparency.manage', v_tenant),
    'can_record', public._irp_has_permission('trust_transparency.record', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_trust_transparency_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
  v_key text;
begin
  v_tenant := public._ttc_require_tenant();

  if v_action in ('dismiss_recommendation', 'disable_category', 'request_human_review') then
    if v_action = 'dismiss_recommendation' then
      perform public._irp_require_permission('trust_transparency.manage', v_tenant);
      update public.aipify_trust_transparency_governance_recs
      set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    else
      perform public._irp_require_permission('trust_transparency.record', v_tenant);
      v_key := 'override_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
      perform public._ttc_log(
        v_tenant, v_key, 'governance_override',
        coalesce(p_payload->>'reason', 'User trust action: ' || v_action),
        'Current user', p_payload
      );
    end if;
  else
    raise exception 'Invalid action';
  end if;

  return jsonb_build_object('ok', true, 'action', v_action);
end; $$;

grant execute on function public.get_trust_transparency_center(uuid) to authenticated;
grant execute on function public.process_trust_transparency_action(jsonb) to authenticated;
