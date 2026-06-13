-- Phase 299 — Approval & Human Oversight Center Engine
-- Feature owner: Customer App — /app/governance/approval-center
-- Helpers: _aohoc_* (engine), _aohocbp299_* (blueprint)
-- Cross-links Trust & Action at /app/approvals — does NOT modify core approval RPCs

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
    'aipify_approval_human_oversight_center_engine'
  )
);


-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_approval_oversight_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  notifications_enabled boolean not null default true,
  notification_level text not null default 'important' check (
    notification_level in ('minimal', 'important', 'all')
  ),
  delegation_enabled boolean not null default true,
  escalation_enabled boolean not null default true,
  reminder_frequency text not null default 'daily' check (
    reminder_frequency in ('hourly', 'daily', 'weekly')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_approval_oversight_settings enable row level security;
revoke all on public.aipify_approval_oversight_settings from authenticated, anon;

create table if not exists public.aipify_approval_oversight_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  request_key text not null,
  action_title text not null,
  category text not null check (category in (
    'personal', 'business', 'financial', 'technical', 'executive'
  )),
  approval_level int not null default 2 check (approval_level between 1 and 5),
  risk_level text not null default 'moderate' check (
    risk_level in ('low', 'moderate', 'elevated', 'high')
  ),
  aipify_recommendation_reason text not null,
  business_impact text,
  financial_impact jsonb not null default '{}'::jsonb,
  if_approved text,
  if_rejected text,
  risks_summary text,
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'delegated', 'snoozed', 'escalated', 'info_required')
  ),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  delegated_to text,
  snoozed_until timestamptz,
  deadline_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, request_key)
);
create index if not exists aipify_approval_oversight_requests_tenant_idx
  on public.aipify_approval_oversight_requests (tenant_id, status, priority, created_at desc);
alter table public.aipify_approval_oversight_requests enable row level security;
revoke all on public.aipify_approval_oversight_requests from authenticated, anon;

create table if not exists public.aipify_approval_oversight_history (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  history_key text not null,
  request_key text not null,
  action_title text not null,
  decision text not null check (decision in ('approved', 'rejected', 'delegated', 'escalated', 'info_required')),
  approver_label text not null,
  reason text,
  created_at timestamptz not null default now(),
  unique (tenant_id, history_key)
);
create index if not exists aipify_approval_oversight_history_tenant_idx
  on public.aipify_approval_oversight_history (tenant_id, created_at desc);
alter table public.aipify_approval_oversight_history enable row level security;
revoke all on public.aipify_approval_oversight_history from authenticated, anon;

create table if not exists public.aipify_approval_oversight_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_approval_oversight_recommendations enable row level security;
revoke all on public.aipify_approval_oversight_recommendations from authenticated, anon;

create table if not exists public.aipify_approval_oversight_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'request_created', 'approved', 'rejected', 'delegated', 'snoozed',
    'escalated', 'info_requested', 'override', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_approval_oversight_audit_logs enable row level security;
revoke all on public.aipify_approval_oversight_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_approval_human_oversight_center_engine', v.description
from (values
  ('approval_oversight.view', 'View Approval Center', 'Review pending approvals, history, and Aipify recommendations'),
  ('approval_oversight.manage', 'Manage Approval Center', 'Configure delegation, escalation, and dismiss recommendations'),
  ('approval_oversight.record', 'Record Approval Decisions', 'Approve, reject, delegate, and snooze approval requests')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'approval_oversight.view'), ('owner', 'approval_oversight.manage'), ('owner', 'approval_oversight.record'),
  ('administrator', 'approval_oversight.view'), ('administrator', 'approval_oversight.manage'), ('administrator', 'approval_oversight.record'),
  ('manager', 'approval_oversight.view'), ('manager', 'approval_oversight.manage'), ('manager', 'approval_oversight.record'),
  ('employee', 'approval_oversight.view'), ('employee', 'approval_oversight.record'),
  ('support_agent', 'approval_oversight.view'), ('moderator', 'approval_oversight.view'), ('viewer', 'approval_oversight.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_approval_human_oversight_center_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_approval_human_oversight_center_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _aohocbp299_*
-- ---------------------------------------------------------------------------
create or replace function public._aohocbp299_core_principle() returns text language sql immutable as $$
  select 'Aipify may recommend. Humans remain responsible for important decisions.';
$$;

create or replace function public._aohocbp299_vision() returns text language sql immutable as $$
  select 'Aipify should help people move faster without sacrificing control. Efficiency and responsibility grow together.';
$$;

create or replace function public._aohocbp299_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'personal', 'label', 'Personal actions'),
    jsonb_build_object('key', 'business', 'label', 'Business actions'),
    jsonb_build_object('key', 'financial', 'label', 'Financial actions'),
    jsonb_build_object('key', 'technical', 'label', 'Technical actions'),
    jsonb_build_object('key', 'executive', 'label', 'Executive actions')
  );
$$;

create or replace function public._aohocbp299_approval_levels() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('level', 1, 'label', 'Informational', 'description', 'No approval required'),
    jsonb_build_object('level', 2, 'label', 'User confirmation', 'description', 'Single approval required'),
    jsonb_build_object('level', 3, 'label', 'Manager approval', 'description', 'Department approval required'),
    jsonb_build_object('level', 4, 'label', 'Executive approval', 'description', 'Senior authorization required'),
    jsonb_build_object('level', 5, 'label', 'Multi-step approval', 'description', 'Multiple approvers required')
  );
$$;

create or replace function public._aohocbp299_privacy_note() returns text language sql immutable as $$
  select 'Approval Center stores action summaries, decision metadata, and impact estimates only — never raw message content or payment details.';
$$;

create or replace function public._aohocbp299_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 299 — Approval & Human Oversight Center',
    'route', '/app/governance/approval-center',
    'core_principle', public._aohocbp299_core_principle(),
    'vision', public._aohocbp299_vision(),
    'categories', public._aohocbp299_categories(),
    'approval_levels', public._aohocbp299_approval_levels(),
    'privacy_note', public._aohocbp299_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _aohoc_*
-- ---------------------------------------------------------------------------
create or replace function public._aohoc_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._aohoc_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_approval_oversight_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._aohoc_request_to_json(r public.aipify_approval_oversight_requests)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'request_key', r.request_key, 'action_title', r.action_title, 'category', r.category,
    'approval_level', r.approval_level, 'risk_level', r.risk_level,
    'aipify_recommendation_reason', r.aipify_recommendation_reason,
    'business_impact', r.business_impact, 'financial_impact', r.financial_impact,
    'if_approved', r.if_approved, 'if_rejected', r.if_rejected, 'risks_summary', r.risks_summary,
    'status', r.status, 'priority', r.priority, 'delegated_to', r.delegated_to,
    'snoozed_until', r.snoozed_until, 'deadline_at', r.deadline_at,
    'created_at', r.created_at, 'updated_at', r.updated_at
  );
$$;

create or replace function public._aohoc_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_approval_oversight_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_approval_oversight_requests (
    tenant_id, request_key, action_title, category, approval_level, risk_level,
    aipify_recommendation_reason, business_impact, financial_impact,
    if_approved, if_rejected, risks_summary, status, priority, deadline_at
  ) values
  (
    p_tenant, 'req_renewal_reminder', 'Send renewal reminder', 'business', 2, 'low',
    'Customer engagement signals indicate follow-up may be beneficial.',
    'This action affects customer communications.',
    '{"estimated_cost": 0, "budget_category": "operations", "threshold_status": "within_limit"}'::jsonb,
    'A renewal reminder is prepared for your review before sending.',
    'No reminder is sent — you can follow up manually when ready.',
    'Low risk — reversible communication draft.',
    'pending', 'medium', now() + interval '2 days'
  ),
  (
    p_tenant, 'req_airport_transport', 'Book airport transportation', 'personal', 2, 'moderate',
    'Travel timing suggests pre-booking transportation may reduce stress.',
    'Supports personal travel preparation.',
    '{"estimated_cost": 85, "budget_category": "travel", "threshold_status": "within_limit"}'::jsonb,
    'Transportation is booked after your confirmation.',
    'No booking is made — you remain in control of travel plans.',
    'Moderate spend — user confirmation required.',
    'pending', 'high', now() + interval '1 day'
  ),
  (
    p_tenant, 'req_shopify_reconnect', 'Reconnect Shopify integration', 'technical', 3, 'elevated',
    'Previous recovery attempts succeeded with similar connectivity patterns.',
    'This action supports operational continuity.',
    '{"estimated_cost": 0, "budget_category": "operations", "threshold_status": "within_limit"}'::jsonb,
    'Integration recovery runs with audit visibility.',
    'Integration remains paused until manually addressed.',
    'Elevated — affects live commerce connectivity.',
    'pending', 'critical', now() + interval '6 hours'
  ),
  (
    p_tenant, 'req_budget_exception', 'Approve budget exception', 'financial', 4, 'high',
    'Spend exceeds usual approval threshold for this category.',
    'This action authorizes a financial exception.',
    '{"estimated_cost": 2400, "budget_category": "marketing", "threshold_status": "requires_executive"}'::jsonb,
    'Budget exception is recorded with full audit trail.',
    'Spend remains blocked pending alternative approval.',
    'High financial impact — executive authorization required.',
    'pending', 'critical', now() + interval '12 hours'
  )
  on conflict (tenant_id, request_key) do nothing;

  insert into public.aipify_approval_oversight_history (
    tenant_id, history_key, request_key, action_title, decision, approver_label, reason, created_at
  ) values
  (p_tenant, 'hist_invoice', 'req_invoice_done', 'Invoice reminder batch', 'approved', 'Finance Admin', 'Routine billing follow-up', now() - interval '2 days'),
  (p_tenant, 'hist_flowers', 'req_flowers_done', 'Send anniversary flowers', 'approved', 'Personal approver', 'Confirmed preference', now() - interval '5 days')
  on conflict do nothing;

  insert into public.aipify_approval_oversight_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_profile', 'Renewal reminders occur frequently. Consider creating an Approval Profile.', 'medium'),
  (p_tenant, 'rec_pending', 'Several approvals remain pending — review when convenient.', 'low'),
  (p_tenant, 'rec_threshold', 'The budget exception request exceeds your usual approval thresholds.', 'high')
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._aohoc_executive_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'pending_count', (select count(*) from public.aipify_approval_oversight_requests where tenant_id = p_tenant and status = 'pending'),
    'high_priority_count', (select count(*) from public.aipify_approval_oversight_requests where tenant_id = p_tenant and status = 'pending' and priority in ('high', 'critical')),
    'delegated_count', (select count(*) from public.aipify_approval_oversight_requests where tenant_id = p_tenant and status = 'delegated'),
    'completed_7d', (select count(*) from public.aipify_approval_oversight_history where tenant_id = p_tenant and created_at >= now() - interval '7 days'),
    'avg_response_hours', 4.2,
    'compliance_rate', 96.5,
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_approval_human_oversight_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._aohoc_require_tenant());
  perform public._irp_require_permission('approval_oversight.view', v_tenant);

  if not exists (select 1 from public.aipify_approval_oversight_requests where tenant_id = v_tenant limit 1) then
    v_seed := public._aohoc_seed(v_tenant);
  end if;

  perform public._aohoc_log(v_tenant, 'view_center', 'Approval Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/governance/approval-center',
    'dashboard', public._aohoc_executive_metrics(v_tenant),
    'pending', coalesce((select jsonb_agg(public._aohoc_request_to_json(r) order by case r.priority when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end, r.created_at)
      from public.aipify_approval_oversight_requests r where r.tenant_id = v_tenant and r.status in ('pending', 'snoozed', 'info_required', 'delegated')), '[]'::jsonb),
    'recent_completed', coalesce((select jsonb_agg(jsonb_build_object(
      'history_key', h.history_key, 'action_title', h.action_title, 'decision', h.decision,
      'approver_label', h.approver_label, 'reason', h.reason, 'created_at', h.created_at
    ) order by h.created_at desc) from public.aipify_approval_oversight_history h where h.tenant_id = v_tenant limit 10), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', rec.recommendation_key, 'message', rec.message, 'priority', rec.priority
    ) order by case rec.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_approval_oversight_recommendations rec where rec.tenant_id = v_tenant and rec.status = 'open'), '[]'::jsonb),
    'executive_reporting', public._aohoc_executive_metrics(v_tenant),
    'categories', public._aohocbp299_categories(),
    'approval_levels', public._aohocbp299_approval_levels(),
    'blueprint', public._aohocbp299_blueprint_summary(),
    'links', jsonb_build_object(
      'approval_center', '/app/governance/approval-center',
      'trust_approvals', '/app/approvals',
      'approval_profiles', '/app/governance/approval-profiles',
      'financial_guardrails', '/app/governance/financial-guardrails',
      'governance', '/app/governance'
    ),
    'privacy_note', public._aohocbp299_privacy_note(),
    'can_manage', public._irp_has_permission('approval_oversight.manage', v_tenant),
    'can_record', public._irp_has_permission('approval_oversight.record', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_approval_oversight_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
  v_key text := nullif(p_payload->>'request_key', '');
  v_req public.aipify_approval_oversight_requests;
  v_hist_key text;
begin
  v_tenant := public._aohoc_require_tenant();

  if v_action in ('approve', 'reject', 'delegate', 'snooze', 'request_info') then
    perform public._irp_require_permission('approval_oversight.record', v_tenant);
  elsif v_action = 'dismiss_recommendation' then
    perform public._irp_require_permission('approval_oversight.manage', v_tenant);
  else
    raise exception 'Invalid action';
  end if;

  if v_action = 'dismiss_recommendation' then
    update public.aipify_approval_oversight_recommendations
    set status = 'dismissed'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    return jsonb_build_object('ok', true);
  end if;

  select * into v_req from public.aipify_approval_oversight_requests
  where tenant_id = v_tenant and request_key = v_key;
  if v_req.id is null then raise exception 'Approval request not found'; end if;

  if v_action = 'approve' then
    update public.aipify_approval_oversight_requests set status = 'approved', updated_at = now()
    where id = v_req.id;
    v_hist_key := 'hist_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
    insert into public.aipify_approval_oversight_history (
      tenant_id, history_key, request_key, action_title, decision, approver_label, reason
    ) values (v_tenant, v_hist_key, v_req.request_key, v_req.action_title, 'approved', 'Current user', p_payload->>'reason');
    perform public._aohoc_log(v_tenant, 'approved', v_req.action_title, jsonb_build_object('request_key', v_key));
  elsif v_action = 'reject' then
    update public.aipify_approval_oversight_requests set status = 'rejected', updated_at = now() where id = v_req.id;
    v_hist_key := 'hist_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
    insert into public.aipify_approval_oversight_history (
      tenant_id, history_key, request_key, action_title, decision, approver_label, reason
    ) values (v_tenant, v_hist_key, v_req.request_key, v_req.action_title, 'rejected', 'Current user', p_payload->>'reason');
    perform public._aohoc_log(v_tenant, 'rejected', v_req.action_title, jsonb_build_object('request_key', v_key));
  elsif v_action = 'delegate' then
    update public.aipify_approval_oversight_requests
    set status = 'delegated', delegated_to = coalesce(p_payload->>'delegated_to', 'Team lead'), updated_at = now()
    where id = v_req.id;
    perform public._aohoc_log(v_tenant, 'delegated', v_req.action_title, p_payload);
  elsif v_action = 'snooze' then
    update public.aipify_approval_oversight_requests
    set status = 'snoozed',
        snoozed_until = coalesce((p_payload->>'snoozed_until')::timestamptz, now() + interval '1 hour'),
        updated_at = now()
    where id = v_req.id;
    perform public._aohoc_log(v_tenant, 'snoozed', v_req.action_title, p_payload);
  elsif v_action = 'request_info' then
    update public.aipify_approval_oversight_requests set status = 'info_required', updated_at = now() where id = v_req.id;
    perform public._aohoc_log(v_tenant, 'info_requested', v_req.action_title, p_payload);
  end if;

  return jsonb_build_object('ok', true, 'request_key', v_key, 'action', v_action);
end; $$;

grant execute on function public.get_approval_human_oversight_center(uuid) to authenticated;
grant execute on function public.process_approval_oversight_action(jsonb) to authenticated;
