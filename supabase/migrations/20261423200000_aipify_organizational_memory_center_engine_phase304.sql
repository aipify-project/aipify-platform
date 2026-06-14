-- Phase 304 — Organizational Memory Center Engine
-- Feature owner: Customer App — /app/knowledge-center/organizational-memory
-- Helpers: _omc_* (engine), _omcbp304_* (blueprint)
-- Cross-links OME / organizational-memory-engine — does NOT modify core memory RPCs

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
    'aipify_organizational_memory_center_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_org_memory_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  review_schedule text not null default 'quarterly' check (
    review_schedule in ('monthly', 'quarterly', 'annual')
  ),
  contribution_enabled boolean not null default true,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_org_memory_center_settings enable row level security;
revoke all on public.aipify_org_memory_center_settings from authenticated, anon;

create table if not exists public.aipify_org_memory_center_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  item_key text not null,
  title text not null,
  category text not null check (category in (
    'operational', 'customer', 'executive', 'technical', 'cultural'
  )),
  summary text not null,
  validation_status text not null default 'published' check (validation_status in (
    'draft', 'review', 'approved', 'published', 'periodic_review'
  )),
  health_level text not null default 'healthy' check (
    health_level in ('excellent', 'healthy', 'needs_attention', 'critical')
  ),
  usage_count int not null default 0,
  owner_label text,
  last_reviewed_at timestamptz,
  source_type text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, item_key)
);
create index if not exists aipify_org_memory_center_items_tenant_idx
  on public.aipify_org_memory_center_items (tenant_id, category, validation_status, health_level);
alter table public.aipify_org_memory_center_items enable row level security;
revoke all on public.aipify_org_memory_center_items from authenticated, anon;

create table if not exists public.aipify_org_memory_center_gaps (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  gap_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'addressed', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (tenant_id, gap_key)
);
alter table public.aipify_org_memory_center_gaps enable row level security;
revoke all on public.aipify_org_memory_center_gaps from authenticated, anon;

create table if not exists public.aipify_org_memory_center_retention_risks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  risk_key text not null,
  message text not null,
  risk_type text not null default 'single_point' check (
    risk_type in ('single_point', 'retirement', 'dependency', 'succession')
  ),
  status text not null default 'open' check (status in ('open', 'mitigated', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (tenant_id, risk_key)
);
alter table public.aipify_org_memory_center_retention_risks enable row level security;
revoke all on public.aipify_org_memory_center_retention_risks from authenticated, anon;

create table if not exists public.aipify_org_memory_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (tenant_id, insight_key)
);
alter table public.aipify_org_memory_center_insights enable row level security;
revoke all on public.aipify_org_memory_center_insights from authenticated, anon;

create table if not exists public.aipify_org_memory_center_contributions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  contribution_key text not null,
  contributor_label text not null,
  title text not null,
  content text not null check (char_length(content) <= 1000),
  category text not null check (category in (
    'operational', 'customer', 'executive', 'technical', 'cultural'
  )),
  status text not null default 'draft' check (status in ('draft', 'review', 'approved', 'published')),
  created_at timestamptz not null default now(),
  unique (tenant_id, contribution_key)
);
alter table public.aipify_org_memory_center_contributions enable row level security;
revoke all on public.aipify_org_memory_center_contributions from authenticated, anon;

create table if not exists public.aipify_org_memory_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'knowledge_created', 'knowledge_updated', 'review_completed', 'validation_event',
    'contribution_submitted', 'archived', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_org_memory_center_audit_logs enable row level security;
revoke all on public.aipify_org_memory_center_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_organizational_memory_center_engine', v.description
from (values
  ('org_memory_center.view', 'View Organizational Memory Center', 'Review institutional knowledge, gaps, and health scores'),
  ('org_memory_center.manage', 'Manage Organizational Memory Center', 'Approve knowledge, configure reviews, and dismiss gaps'),
  ('org_memory_center.contribute', 'Contribute Organizational Memory', 'Submit knowledge updates, lessons learned, and process improvements')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'org_memory_center.view'), ('owner', 'org_memory_center.manage'), ('owner', 'org_memory_center.contribute'),
  ('administrator', 'org_memory_center.view'), ('administrator', 'org_memory_center.manage'), ('administrator', 'org_memory_center.contribute'),
  ('manager', 'org_memory_center.view'), ('manager', 'org_memory_center.manage'), ('manager', 'org_memory_center.contribute'),
  ('employee', 'org_memory_center.view'), ('employee', 'org_memory_center.contribute'),
  ('support_agent', 'org_memory_center.view'), ('support_agent', 'org_memory_center.contribute'),
  ('moderator', 'org_memory_center.view'), ('viewer', 'org_memory_center.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_organizational_memory_center_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_organizational_memory_center_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _omcbp304_*
-- ---------------------------------------------------------------------------
create or replace function public._omcbp304_core_principle() returns text language sql immutable as $$
  select 'Organizations should not lose critical knowledge when employees leave. Knowledge should become an organizational asset.';
$$;

create or replace function public._omcbp304_philosophy() returns text language sql immutable as $$
  select 'People create knowledge. Aipify helps preserve it. Aipify should never replace expertise — it should ensure expertise is not lost.';
$$;

create or replace function public._omcbp304_vision() returns text language sql immutable as $$
  select 'Transform individual expertise into shared organizational capability that strengthens resilience, continuity, and long-term success.';
$$;

create or replace function public._omcbp304_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'operational', 'label', 'Operational memory'),
    jsonb_build_object('key', 'customer', 'label', 'Customer memory'),
    jsonb_build_object('key', 'executive', 'label', 'Executive memory'),
    jsonb_build_object('key', 'technical', 'label', 'Technical memory'),
    jsonb_build_object('key', 'cultural', 'label', 'Cultural memory')
  );
$$;

create or replace function public._omcbp304_health_levels() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'excellent', 'label', 'Excellent'),
    jsonb_build_object('key', 'healthy', 'label', 'Healthy'),
    jsonb_build_object('key', 'needs_attention', 'label', 'Needs attention'),
    jsonb_build_object('key', 'critical', 'label', 'Critical')
  );
$$;

create or replace function public._omcbp304_privacy_note() returns text language sql immutable as $$
  select 'Organizational Memory Center stores knowledge summaries, process metadata, and governance events only — never raw support transcripts, emails, or confidential records.';
$$;

create or replace function public._omcbp304_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 304 — Organizational Memory Center',
    'route', '/app/knowledge-center/organizational-memory',
    'core_principle', public._omcbp304_core_principle(),
    'philosophy', public._omcbp304_philosophy(),
    'vision', public._omcbp304_vision(),
    'categories', public._omcbp304_categories(),
    'health_levels', public._omcbp304_health_levels(),
    'privacy_note', public._omcbp304_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _omc_*
-- ---------------------------------------------------------------------------
create or replace function public._omc_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._omc_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_org_memory_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._omc_item_to_json(i public.aipify_org_memory_center_items)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'item_key', i.item_key, 'title', i.title, 'category', i.category, 'summary', i.summary,
    'validation_status', i.validation_status, 'health_level', i.health_level,
    'usage_count', i.usage_count, 'owner_label', i.owner_label,
    'last_reviewed_at', i.last_reviewed_at, 'source_type', i.source_type,
    'created_at', i.created_at, 'updated_at', i.updated_at
  );
$$;

create or replace function public._omc_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_org_memory_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_org_memory_center_items (
    tenant_id, item_key, title, category, summary, validation_status, health_level,
    usage_count, owner_label, last_reviewed_at, source_type
  ) values
  (
    p_tenant, 'mem_sop_escalation', 'Support escalation paths', 'operational',
    'Standard escalation paths from tier 1 through executive review.',
    'published', 'healthy', 142, 'Operations Lead', now() - interval '14 days', 'SOP'
  ),
  (
    p_tenant, 'mem_faq_billing', 'Billing FAQ resolutions', 'customer',
    'Frequently asked billing questions and approved resolution patterns.',
    'published', 'excellent', 318, 'Support Team', now() - interval '7 days', 'Support interactions'
  ),
  (
    p_tenant, 'mem_exec_priorities', 'Q2 strategic priorities', 'executive',
    'Leadership priorities and board recommendations for current quarter.',
    'periodic_review', 'needs_attention', 45, 'CEO Office', now() - interval '90 days', 'Executive decisions'
  ),
  (
    p_tenant, 'mem_deploy_recovery', 'Deployment recovery procedures', 'technical',
    'System architecture notes and recovery procedures for production deployments.',
    'published', 'healthy', 67, 'Platform Team', now() - interval '21 days', 'Technical documentation'
  ),
  (
    p_tenant, 'mem_values_onboarding', 'Onboarding values guide', 'cultural',
    'Organizational values and internal language for new team members.',
    'published', 'excellent', 89, 'People Ops', now() - interval '30 days', 'Employee contributions'
  ),
  (
    p_tenant, 'mem_workflow_undoc', 'Critical workflow knowledge', 'operational',
    'Workflow steps known to senior staff but not yet fully documented.',
    'draft', 'critical', 12, 'Operations Lead', now() - interval '120 days', 'Process improvement'
  )
  on conflict (tenant_id, item_key) do nothing;

  insert into public.aipify_org_memory_center_gaps (tenant_id, gap_key, message, priority) values
  (p_tenant, 'gap_workflow', 'This critical workflow depends heavily on undocumented knowledge.', 'high'),
  (p_tenant, 'gap_support', 'Several support resolutions have not been formalized.', 'medium'),
  (p_tenant, 'gap_exec', 'Executive processes lack written guidance.', 'medium')
  on conflict do nothing;

  insert into public.aipify_org_memory_center_retention_risks (tenant_id, risk_key, message, risk_type) values
  (p_tenant, 'risk_single', 'One employee holds critical undocumented expertise.', 'single_point'),
  (p_tenant, 'risk_team', 'Support tier 2 depends on a small group for complex resolutions.', 'dependency')
  on conflict do nothing;

  insert into public.aipify_org_memory_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_support', 'Support teams repeatedly solve this issue. Consider formalizing the process.', 'high'),
  (p_tenant, 'ins_onboarding', 'Knowledge related to onboarding has significantly improved.', 'low'),
  (p_tenant, 'ins_review', 'Several important documents require review.', 'medium')
  on conflict do nothing;

  insert into public.aipify_org_memory_center_contributions (
    tenant_id, contribution_key, contributor_label, title, content, category, status
  ) values
  (
    p_tenant, 'contrib_lesson', 'Support Lead', 'Service recovery lesson learned',
    'Documented approach for high-value customer recovery after billing errors.',
    'customer', 'review'
  )
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._omc_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'knowledge_health_score', 82,
    'health_label', 'healthy',
    'recent_added_count', (select count(*) from public.aipify_org_memory_center_items where tenant_id = p_tenant and created_at >= now() - interval '30 days'),
    'gaps_open_count', (select count(*) from public.aipify_org_memory_center_gaps where tenant_id = p_tenant and status = 'open'),
    'usage_total', (select coalesce(sum(usage_count), 0) from public.aipify_org_memory_center_items where tenant_id = p_tenant),
    'critical_risks_count', (select count(*) from public.aipify_org_memory_center_items where tenant_id = p_tenant and health_level = 'critical'),
    'retention_risks_count', (select count(*) from public.aipify_org_memory_center_retention_risks where tenant_id = p_tenant and status = 'open'),
    'contributions_pending', (select count(*) from public.aipify_org_memory_center_contributions where tenant_id = p_tenant and status in ('draft', 'review')),
    'reuse_rate', 74.5,
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_memory_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._omc_require_tenant());
  perform public._irp_require_permission('org_memory_center.view', v_tenant);

  if not exists (select 1 from public.aipify_org_memory_center_items where tenant_id = v_tenant limit 1) then
    v_seed := public._omc_seed(v_tenant);
  end if;

  perform public._omc_log(v_tenant, 'view_center', 'Organizational Memory Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/knowledge-center/organizational-memory',
    'dashboard', public._omc_dashboard_metrics(v_tenant),
    'recent_knowledge', coalesce((select jsonb_agg(public._omc_item_to_json(i) order by i.created_at desc)
      from public.aipify_org_memory_center_items i where i.tenant_id = v_tenant limit 10), '[]'::jsonb),
    'knowledge_items', coalesce((select jsonb_agg(public._omc_item_to_json(i) order by
      case i.health_level when 'critical' then 1 when 'needs_attention' then 2 when 'healthy' then 3 else 4 end, i.usage_count desc)
      from public.aipify_org_memory_center_items i where i.tenant_id = v_tenant), '[]'::jsonb),
    'knowledge_gaps', coalesce((select jsonb_agg(jsonb_build_object(
      'gap_key', g.gap_key, 'message', g.message, 'priority', g.priority, 'status', g.status
    ) order by case g.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_org_memory_center_gaps g where g.tenant_id = v_tenant and g.status = 'open'), '[]'::jsonb),
    'retention_risks', coalesce((select jsonb_agg(jsonb_build_object(
      'risk_key', r.risk_key, 'message', r.message, 'risk_type', r.risk_type, 'status', r.status
    ) order by r.created_at desc) from public.aipify_org_memory_center_retention_risks r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', ins.insight_key, 'message', ins.message, 'priority', ins.priority
    ) order by case ins.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_org_memory_center_insights ins where ins.tenant_id = v_tenant and ins.status = 'open'), '[]'::jsonb),
    'contributions', coalesce((select jsonb_agg(jsonb_build_object(
      'contribution_key', c.contribution_key, 'contributor_label', c.contributor_label,
      'title', c.title, 'content', c.content, 'category', c.category, 'status', c.status, 'created_at', c.created_at
    ) order by c.created_at desc) from public.aipify_org_memory_center_contributions c where c.tenant_id = v_tenant), '[]'::jsonb),
    'validation_workflow', jsonb_build_array(
      jsonb_build_object('stage', 'draft', 'label', 'Draft'),
      jsonb_build_object('stage', 'review', 'label', 'Review'),
      jsonb_build_object('stage', 'approved', 'label', 'Approved'),
      jsonb_build_object('stage', 'published', 'label', 'Published'),
      jsonb_build_object('stage', 'periodic_review', 'label', 'Periodic review')
    ),
    'categories', public._omcbp304_categories(),
    'health_levels', public._omcbp304_health_levels(),
    'blueprint', public._omcbp304_blueprint_summary(),
    'links', jsonb_build_object(
      'memory_center', '/app/knowledge-center/organizational-memory',
      'knowledge_center', '/app/knowledge-center',
      'organizational_memory_engine', '/app/organizational-memory-engine',
      'enterprise_memory', '/app/aipify-enterprise-organizational-memory-engine',
      'employee_knowledge', '/app/settings/employee-knowledge'
    ),
    'privacy_note', public._omcbp304_privacy_note(),
    'can_manage', public._irp_has_permission('org_memory_center.manage', v_tenant),
    'can_contribute', public._irp_has_permission('org_memory_center.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_organizational_memory_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
  v_key text;
begin
  v_tenant := public._omc_require_tenant();

  if v_action in ('dismiss_gap', 'dismiss_insight', 'dismiss_risk', 'approve_contribution', 'mark_reviewed') then
    perform public._irp_require_permission('org_memory_center.manage', v_tenant);
    if v_action = 'dismiss_gap' then
      update public.aipify_org_memory_center_gaps set status = 'dismissed' where tenant_id = v_tenant and gap_key = nullif(p_payload->>'gap_key', '');
    elsif v_action = 'dismiss_insight' then
      update public.aipify_org_memory_center_insights set status = 'dismissed' where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_risk' then
      update public.aipify_org_memory_center_retention_risks set status = 'dismissed' where tenant_id = v_tenant and risk_key = nullif(p_payload->>'risk_key', '');
    elsif v_action = 'approve_contribution' then
      update public.aipify_org_memory_center_contributions set status = 'approved' where tenant_id = v_tenant and contribution_key = nullif(p_payload->>'contribution_key', '');
      perform public._omc_log(v_tenant, 'validation_event', 'Contribution approved', p_payload);
    elsif v_action = 'mark_reviewed' then
      update public.aipify_org_memory_center_items set last_reviewed_at = now(), validation_status = 'published', updated_at = now()
      where tenant_id = v_tenant and item_key = nullif(p_payload->>'item_key', '');
      perform public._omc_log(v_tenant, 'review_completed', 'Knowledge review completed', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'submit_contribution' then
    perform public._irp_require_permission('org_memory_center.contribute', v_tenant);
    v_key := 'contrib_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
    insert into public.aipify_org_memory_center_contributions (
      tenant_id, contribution_key, contributor_label, title, content, category, status
    ) values (
      v_tenant, v_key, coalesce(p_payload->>'contributor_label', 'Current user'),
      left(coalesce(p_payload->>'title', 'Knowledge contribution'), 200),
      left(coalesce(p_payload->>'content', ''), 1000),
      coalesce(nullif(p_payload->>'category', ''), 'operational'),
      'draft'
    );
    perform public._omc_log(v_tenant, 'contribution_submitted', 'Knowledge contribution submitted', p_payload);
    return jsonb_build_object('ok', true, 'contribution_key', v_key);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_organizational_memory_center(uuid) to authenticated;
grant execute on function public.process_organizational_memory_action(jsonb) to authenticated;
