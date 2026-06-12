-- Phase 119 — Ecosystem Governance & Certification Engine
-- Ecosystem Governance Center spanning GP, Companion, training, audit, certification ecosystem-wide.
-- Distinct from Marketplace Governance repo Phase 90 (/app/marketplace-governance) and Partner Certification Phase 91 (/app/partners).
-- Helpers: _egce_* (engine), _egcbp119_* (blueprint — never collide with _mgq_*, _pce_*, _gpoc_*).

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
    'ecosystem_governance'
  )
);

-- ---------------------------------------------------------------------------
-- 1. ecosystem_governance_settings
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_governance_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  governance_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  voluntary_alignment_enabled boolean not null default true,
  certification_oversight_enabled boolean not null default true,
  audit_programs_enabled boolean not null default true,
  mandatory_2fa_for_governance_roles boolean not null default true,
  policy_acknowledgement_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ecosystem_governance_settings enable row level security;
revoke all on public.ecosystem_governance_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. ecosystem_governance_certification_programs
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_governance_certification_programs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  program_key text not null,
  title text not null,
  description text,
  program_type text not null check (
    program_type in (
      'growth_partners', 'companion_publishers', 'training_providers',
      'implementation_specialists', 'governance_advisors', 'executive_advisors',
      'commerce_specialists', 'knowledge_leaders', 'support_specialists',
      'community_facilitators'
    )
  ),
  cross_link_route text,
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  sort_order int not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, program_key)
);

create index if not exists ecosystem_governance_certification_programs_tenant_idx
  on public.ecosystem_governance_certification_programs (tenant_id, program_type, status);

alter table public.ecosystem_governance_certification_programs enable row level security;
revoke all on public.ecosystem_governance_certification_programs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. ecosystem_governance_certification_records
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_governance_certification_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  program_id uuid references public.ecosystem_governance_certification_programs (id) on delete set null,
  participant_key text not null,
  participant_type text not null check (
    participant_type in (
      'growth_partner', 'companion_publisher', 'training_provider',
      'implementation_specialist', 'governance_advisor', 'executive_advisor',
      'commerce_specialist', 'knowledge_leader', 'support_specialist',
      'community_facilitator', 'internal_team'
    )
  ),
  certification_level text,
  certification_level_label text,
  status text not null default 'in_review' check (
    status in ('not_started', 'in_review', 'certified', 'maintenance', 'review_triggered', 'expired')
  ),
  progress_pct numeric(5, 2) not null default 0 check (progress_pct between 0 and 100),
  last_assessment_at timestamptz,
  next_review_at timestamptz,
  maintenance_requirements_met int not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, participant_key, program_id)
);

create index if not exists ecosystem_governance_certification_records_tenant_idx
  on public.ecosystem_governance_certification_records (tenant_id, status, participant_type);

alter table public.ecosystem_governance_certification_records enable row level security;
revoke all on public.ecosystem_governance_certification_records from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. ecosystem_governance_audit_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_governance_audit_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_type text not null check (
    review_type in (
      'governance', 'companion', 'implementation', 'knowledge', 'security', 'operational'
    )
  ),
  title text not null,
  summary text not null,
  status text not null default 'scheduled' check (
    status in ('scheduled', 'in_progress', 'completed', 'follow_up', 'cancelled')
  ),
  priority text not null default 'moderate' check (
    priority in ('informational', 'moderate', 'important', 'critical')
  ),
  scheduled_at timestamptz,
  completed_at timestamptz,
  findings_count int not null default 0,
  support_not_punishment_note text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ecosystem_governance_audit_reviews_tenant_idx
  on public.ecosystem_governance_audit_reviews (tenant_id, review_type, status);

alter table public.ecosystem_governance_audit_reviews enable row level security;
revoke all on public.ecosystem_governance_audit_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. ecosystem_governance_policy_entries
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_governance_policy_entries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  policy_key text not null,
  title text not null,
  summary text not null,
  topic text not null check (
    topic in (
      'companion_governance', 'knowledge_management', 'security_practices',
      'gp_expectations', 'certification_standards', 'marketplace_conduct',
      'community_participation', 'responsible_innovation'
    )
  ),
  acknowledgement_required boolean not null default false,
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  sort_order int not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, policy_key)
);

create index if not exists ecosystem_governance_policy_entries_tenant_idx
  on public.ecosystem_governance_policy_entries (tenant_id, topic, status);

alter table public.ecosystem_governance_policy_entries enable row level security;
revoke all on public.ecosystem_governance_policy_entries from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. ecosystem_governance_trust_badges
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_governance_trust_badges (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  badge_key text not null,
  badge_type text not null check (
    badge_type in (
      'certified_gp', 'certified_companion', 'governance_steward',
      'knowledge_leader', 'executive_advisor', 'support_excellence'
    )
  ),
  title text not null,
  summary text not null,
  granted_to_key text not null,
  granted_at timestamptz not null default now(),
  expires_at timestamptz,
  status text not null default 'active' check (status in ('active', 'expired', 'revoked', 'pending')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, badge_key, granted_to_key)
);

create index if not exists ecosystem_governance_trust_badges_tenant_idx
  on public.ecosystem_governance_trust_badges (tenant_id, badge_type, status);

alter table public.ecosystem_governance_trust_badges enable row level security;
revoke all on public.ecosystem_governance_trust_badges from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. ecosystem_governance_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_governance_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.ecosystem_governance_audit_logs enable row level security;
revoke all on public.ecosystem_governance_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'ecosystem_governance_engine', v.description
from (values
  ('ecosystem_governance.view', 'View Ecosystem Governance', 'View governance center, certification oversight, and policy library'),
  ('ecosystem_governance.manage', 'Manage Ecosystem Governance', 'Configure governance settings, audit programs, and certification oversight')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 9. Engine helpers (_egce_*)
-- ---------------------------------------------------------------------------
create or replace function public._egce_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._egce_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._egce_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._egce_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.ecosystem_governance_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._egce_ensure_settings(p_tenant_id uuid)
returns public.ecosystem_governance_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.ecosystem_governance_settings;
begin
  insert into public.ecosystem_governance_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.ecosystem_governance_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._egce_certification_program_scaffolds()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'growth_partners', 'label', 'Growth Partners', 'route', '/app/partners'),
    jsonb_build_object('key', 'companion_publishers', 'label', 'Companion Publishers', 'route', '/app/companion-marketplace'),
    jsonb_build_object('key', 'training_providers', 'label', 'Training Providers', 'route', '/app/aipify-university'),
    jsonb_build_object('key', 'implementation_specialists', 'label', 'Implementation Specialists', 'route', '/app/growth-partner-operations'),
    jsonb_build_object('key', 'governance_advisors', 'label', 'Governance Advisors', 'route', '/app/ecosystem-governance'),
    jsonb_build_object('key', 'executive_advisors', 'label', 'Executive Advisors', 'route', '/app/executive-insights-engine'),
    jsonb_build_object('key', 'commerce_specialists', 'label', 'Commerce Specialists', 'route', '/app/commerce-intelligence'),
    jsonb_build_object('key', 'knowledge_leaders', 'label', 'Knowledge Leaders', 'route', '/app/knowledge-center-engine'),
    jsonb_build_object('key', 'support_specialists', 'label', 'Support Specialists', 'route', '/app/support-ai-engine'),
    jsonb_build_object('key', 'community_facilitators', 'label', 'Community Facilitators', 'route', '/app/community')
  );
$$;

create or replace function public._egce_gp_certification_level_mappings()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'registered', 'label', 'Registered', 'maps_to_tier', 'registered', 'maps_to_tier_label', public._pce_tier_label('registered')),
    jsonb_build_object('key', 'certified', 'label', 'Certified', 'maps_to_tier', 'certified', 'maps_to_tier_label', public._pce_tier_label('certified')),
    jsonb_build_object('key', 'advanced', 'label', 'Advanced', 'maps_to_tier', 'advanced', 'maps_to_tier_label', public._pce_tier_label('advanced')),
    jsonb_build_object('key', 'strategic', 'label', 'Strategic', 'maps_to_tier', 'strategic', 'maps_to_tier_label', public._pce_tier_label('strategic')),
    jsonb_build_object('key', 'enterprise', 'label', 'Enterprise', 'maps_to_tier', 'premier', 'maps_to_tier_label', public._pce_tier_label('premier')),
    jsonb_build_object('key', 'global', 'label', 'Global', 'maps_to_tier', 'expert', 'maps_to_tier_label', public._pce_tier_label('expert'))
  );
$$;

create or replace function public._egce_companion_assessment_areas()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'safety_controls', 'label', 'Safety controls'),
    jsonb_build_object('key', 'governance_alignment', 'label', 'Governance alignment'),
    jsonb_build_object('key', 'documentation_quality', 'label', 'Documentation quality'),
    jsonb_build_object('key', 'ux', 'label', 'User experience'),
    jsonb_build_object('key', 'permission_transparency', 'label', 'Permission transparency'),
    jsonb_build_object('key', 'knowledge_accuracy', 'label', 'Knowledge accuracy'),
    jsonb_build_object('key', 'operational_reliability', 'label', 'Operational reliability'),
    jsonb_build_object('key', 'escalation_frameworks', 'label', 'Escalation frameworks')
  );
$$;

create or replace function public._egce_certification_maintenance_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'continuing_education', 'label', 'Continuing education'),
    jsonb_build_object('key', 'updated_governance_training', 'label', 'Updated governance training'),
    jsonb_build_object('key', 'periodic_assessments', 'label', 'Periodic assessments'),
    jsonb_build_object('key', 'customer_outcome_reviews', 'label', 'Customer outcome reviews'),
    jsonb_build_object('key', 'knowledge_contributions', 'label', 'Knowledge contributions'),
    jsonb_build_object('key', 'operational_reviews', 'label', 'Operational reviews')
  );
$$;

create or replace function public._egce_audit_review_types()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'governance', 'label', 'Governance assessments'),
    jsonb_build_object('key', 'companion', 'label', 'Companion reviews'),
    jsonb_build_object('key', 'implementation', 'label', 'Implementation assessments'),
    jsonb_build_object('key', 'knowledge', 'label', 'Knowledge reviews'),
    jsonb_build_object('key', 'security', 'label', 'Security assessments'),
    jsonb_build_object('key', 'operational', 'label', 'Operational assessments')
  );
$$;

create or replace function public._egce_policy_topic_scaffolds()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'companion_governance', 'label', 'Companion governance'),
    jsonb_build_object('key', 'knowledge_management', 'label', 'Knowledge management'),
    jsonb_build_object('key', 'security_practices', 'label', 'Security practices'),
    jsonb_build_object('key', 'gp_expectations', 'label', 'Growth Partner expectations'),
    jsonb_build_object('key', 'certification_standards', 'label', 'Certification standards'),
    jsonb_build_object('key', 'marketplace_conduct', 'label', 'Marketplace conduct'),
    jsonb_build_object('key', 'community_participation', 'label', 'Community participation'),
    jsonb_build_object('key', 'responsible_innovation', 'label', 'Responsible innovation')
  );
$$;

create or replace function public._egce_trust_badge_scaffolds()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'certified_gp', 'label', 'Certified Growth Partner'),
    jsonb_build_object('key', 'certified_companion', 'label', 'Certified Companion'),
    jsonb_build_object('key', 'governance_steward', 'label', 'Governance Steward'),
    jsonb_build_object('key', 'knowledge_leader', 'label', 'Knowledge Leader'),
    jsonb_build_object('key', 'executive_advisor', 'label', 'Executive Advisor'),
    jsonb_build_object('key', 'support_excellence', 'label', 'Support Excellence')
  );
$$;

create or replace function public._egce_governance_center_functions()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'framework_management', 'label', 'Governance framework management'),
    jsonb_build_object('key', 'policy_libraries', 'label', 'Policy libraries'),
    jsonb_build_object('key', 'certification_oversight', 'label', 'Certification oversight'),
    jsonb_build_object('key', 'audit_programs', 'label', 'Audit programs'),
    jsonb_build_object('key', 'compliance_monitoring', 'label', 'Compliance monitoring'),
    jsonb_build_object('key', 'risk_visibility', 'label', 'Risk visibility'),
    jsonb_build_object('key', 'partner_governance_reviews', 'label', 'Partner governance reviews'),
    jsonb_build_object('key', 'companion_governance_reviews', 'label', 'Companion governance reviews'),
    jsonb_build_object('key', 'continuous_improvement_programs', 'label', 'Continuous improvement programs')
  );
$$;

create or replace function public._egce_seed_programs(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_program jsonb;
begin
  if exists (select 1 from public.ecosystem_governance_certification_programs where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  for v_program in select * from jsonb_array_elements(public._egce_certification_program_scaffolds())
  loop
    insert into public.ecosystem_governance_certification_programs (
      tenant_id, program_key, title, program_type, cross_link_route, sort_order
    ) values (
      p_tenant_id,
      v_program->>'key',
      v_program->>'label',
      v_program->>'key',
      v_program->>'route',
      coalesce((v_program->>'order')::int, 0)
    );
  end loop;
end; $$;

create or replace function public._egce_seed_certification_records(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_program_id uuid;
begin
  if exists (select 1 from public.ecosystem_governance_certification_records where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  select id into v_program_id from public.ecosystem_governance_certification_programs
  where tenant_id = p_tenant_id and program_key = 'growth_partners' limit 1;

  insert into public.ecosystem_governance_certification_records (
    tenant_id, program_id, participant_key, participant_type,
    certification_level, certification_level_label, status, progress_pct, maintenance_requirements_met
  ) values
    (p_tenant_id, v_program_id, 'gp-nordic-steward', 'growth_partner', 'advanced', public._pce_tier_label('advanced'), 'certified', 92, 5),
    (p_tenant_id, v_program_id, 'gp-emea-advisory', 'growth_partner', 'strategic', public._pce_tier_label('strategic'), 'maintenance', 88, 4);

  select id into v_program_id from public.ecosystem_governance_certification_programs
  where tenant_id = p_tenant_id and program_key = 'companion_publishers' limit 1;

  insert into public.ecosystem_governance_certification_records (
    tenant_id, program_id, participant_key, participant_type, status, progress_pct
  ) values
    (p_tenant_id, v_program_id, 'companion-support-pro', 'companion_publisher', 'in_review', 76);
end; $$;

create or replace function public._egce_seed_audit_reviews(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.ecosystem_governance_audit_reviews where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.ecosystem_governance_audit_reviews (
    tenant_id, review_type, title, summary, status, priority, scheduled_at, findings_count,
    support_not_punishment_note
  ) values
    (p_tenant_id, 'governance', 'Quarterly governance stewardship review', 'Voluntary governance alignment check — support not punishment.', 'scheduled', 'moderate', now() + interval '14 days', 0, 'Reviews support improvement — failure triggers review, not automatic punishment.'),
    (p_tenant_id, 'companion', 'Companion safety controls assessment', 'Cross-link Phase 113 companion certification areas — trust not gatekeeping.', 'in_progress', 'important', now(), 2, 'Assessment supports safer deployments — humans decide outcomes.'),
    (p_tenant_id, 'security', 'Security practices acknowledgement audit', 'RBAC, 2FA, audit logging, and evidence preservation metadata review.', 'scheduled', 'important', now() + interval '30 days', 0, 'Security requirements protect ecosystem trust — voluntary org alignment.');
end; $$;

create or replace function public._egce_seed_policy_entries(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_policy jsonb;
begin
  if exists (select 1 from public.ecosystem_governance_policy_entries where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  for v_policy in select * from jsonb_array_elements(public._egce_policy_topic_scaffolds())
  loop
    insert into public.ecosystem_governance_policy_entries (
      tenant_id, policy_key, title, summary, topic, acknowledgement_required, sort_order
    ) values (
      p_tenant_id,
      v_policy->>'key',
      v_policy->>'label',
      'Practical framework for ' || lower(v_policy->>'label') || ' — governance guides, not controls.',
      v_policy->>'key',
      v_policy->>'key' in ('security_practices', 'gp_expectations', 'certification_standards'),
      coalesce((v_policy->>'order')::int, 0)
    );
  end loop;
end; $$;

create or replace function public._egce_seed_trust_badges(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.ecosystem_governance_trust_badges where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.ecosystem_governance_trust_badges (
    tenant_id, badge_key, badge_type, title, summary, granted_to_key, status
  ) values
    (p_tenant_id, 'certified_gp_nordic', 'certified_gp', 'Certified Growth Partner', 'Commitment to customer success and governance alignment — not superiority.', 'gp-nordic-steward', 'active'),
    (p_tenant_id, 'governance_steward_2026', 'governance_steward', 'Governance Steward', 'Stewardship through responsibility — voluntary governance participation.', 'tenant-governance-lead', 'active'),
    (p_tenant_id, 'knowledge_leader_kc', 'knowledge_leader', 'Knowledge Leader', 'Recognized knowledge contributions to the ecosystem.', 'kc-contributor-alpha', 'active');
end; $$;

create or replace function public._egce_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_certified_count int;
  v_in_review_count int;
  v_active_badges int;
  v_open_reviews int;
  v_policy_count int;
  v_governance_maturity numeric;
begin
  select count(*) into v_certified_count from public.ecosystem_governance_certification_records
  where tenant_id = p_tenant_id and status in ('certified', 'maintenance');
  select count(*) into v_in_review_count from public.ecosystem_governance_certification_records
  where tenant_id = p_tenant_id and status in ('in_review', 'review_triggered');
  select count(*) into v_active_badges from public.ecosystem_governance_trust_badges
  where tenant_id = p_tenant_id and status = 'active';
  select count(*) into v_open_reviews from public.ecosystem_governance_audit_reviews
  where tenant_id = p_tenant_id and status in ('scheduled', 'in_progress', 'follow_up');
  select count(*) into v_policy_count from public.ecosystem_governance_policy_entries
  where tenant_id = p_tenant_id and status = 'active';

  v_governance_maturity := least(100, greatest(0,
    (v_certified_count * 12) + (v_active_badges * 8) + (v_policy_count * 5) + 20
  ));

  return jsonb_build_object(
    'governance_maturity_score', v_governance_maturity,
    'certified_participants', v_certified_count,
    'certifications_in_review', v_in_review_count,
    'active_trust_badges', v_active_badges,
    'open_audit_reviews', v_open_reviews,
    'active_policies', v_policy_count,
    'certification_programs_count', jsonb_array_length(public._egce_certification_program_scaffolds()),
    'gp_levels_count', jsonb_array_length(public._egce_gp_certification_level_mappings()),
    'companion_assessment_areas_count', jsonb_array_length(public._egce_companion_assessment_areas()),
    'policy_topics_count', jsonb_array_length(public._egce_policy_topic_scaffolds()),
    'trust_badge_types_count', jsonb_array_length(public._egce_trust_badge_scaffolds()),
    'governance_functions_count', jsonb_array_length(public._egce_governance_center_functions())
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Blueprint helpers (_egcbp119_*)
-- ---------------------------------------------------------------------------
create or replace function public._egcbp119_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 119 — Ecosystem Governance & Certification Engine at /app/ecosystem-governance. Ecosystem-wide governance center spanning GP, Companion, training, audit, and certification — distinct from Marketplace Governance repo Phase 90 at /app/marketplace-governance (marketplace QA, fraud, policy subset). Blueprint Phase 90 = Continuous Improvement organizational evolution at /app/continuous-improvement-engine — different phase number, different surface. Cross-links: Partner Certification Phase 91 + Blueprint 107 /app/partners (_pce_tier_label() presentation); Growth Partner Ops Phase 114 /app/growth-partner-operations; Companion Marketplace Phase 113 /app/companion-marketplace; Certification & Achievement A.37 /app/certification-achievement-engine (internal team certs); Aipify University Phase 115 /app/aipify-university; Continuous Improvement A.33/A.49 + Blueprint 90 /app/continuous-improvement-engine; Trust Phase 116 /app/trust-reputation-engine; Trust & Action Phase 30 /app/approvals; AI Ethics Blueprint 98 /app/ai-ethics-responsible-use-engine; Self Love A.76 /app/self-love-engine; 2FA /app/settings/two-factor. Helpers _egcbp119_* — never duplicate _mgq_*, _pce_*, _gpoc_* RPCs. Growth Partner terminology only — never Affiliate.';
$$;

create or replace function public._egcbp119_mission()
returns text language sql immutable as $$
  select 'Steward ecosystem trust through standards, certification oversight, and responsible governance — guides growth, protects customers, and recognizes excellence across Growth Partners, Companions, and training providers.';
$$;

create or replace function public._egcbp119_philosophy()
returns text language sql immutable as $$
  select 'As ecosystems grow, consistency is essential. Trust requires standards. Innovation requires responsibility. Growth requires stewardship. Governance guides — not controls. People First. Stewardship through responsibility. Standards build confidence — not bureaucracy.';
$$;

create or replace function public._egcbp119_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Ecosystem Governance Center orchestrates certification oversight, audit programs, and policy libraries ecosystem-wide. Domain-specific RPCs at /app/partners, /app/marketplace-governance, and /app/companion-marketplace remain authoritative. Voluntary participation — org retains autonomy.';
$$;

create or replace function public._egcbp119_vision()
returns text language sql immutable as $$
  select 'Our ecosystem operates with trusted standards, responsible practices, and recognized excellence — customers confident, partners supported, innovation sustainable.';
$$;

create or replace function public._egcbp119_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'trusted_standards', 'label', 'Trusted standards', 'emoji', '🦉', 'description', 'Consistent governance frameworks across the ecosystem'),
    jsonb_build_object('key', 'responsible_practices', 'label', 'Responsible practices', 'emoji', '🌹', 'description', 'Innovation with accountability — cross-link AI Ethics Blueprint 98'),
    jsonb_build_object('key', 'recognize_excellence', 'label', 'Recognize excellence', 'emoji', '🔔', 'description', 'Trust badges and certification — commitment not superiority'),
    jsonb_build_object('key', 'protect_customers', 'label', 'Protect customers', 'emoji', '🦉', 'description', 'Governance reviews support safer deployments'),
    jsonb_build_object('key', 'continuous_improvement', 'label', 'Continuous improvement', 'emoji', '🌹', 'description', 'Lessons learned and governance refinement — cross-link CI engine'),
    jsonb_build_object('key', 'strengthen_gp_quality', 'label', 'Strengthen GP quality', 'emoji', '🔔', 'description', 'Growth Partner certification mapped to _pce_tier_label()'),
    jsonb_build_object('key', 'companion_reliability', 'label', 'Improve Companion reliability', 'emoji', '🦉', 'description', 'Eight assessment areas — trust not gatekeeping'),
    jsonb_build_object('key', 'sustainable_expansion', 'label', 'Sustainable expansion', 'emoji', '🌹', 'description', 'Long-term ecosystem health and stewardship')
  );
$$;

create or replace function public._egcbp119_governance_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Ecosystem Governance Center — nine stewardship functions.',
    'functions', public._egce_governance_center_functions(),
    'route', '/app/ecosystem-governance'
  );
$$;

create or replace function public._egcbp119_certification_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Certification framework — ten program types. Demonstrated capability, not marketing claims.',
    'program_types', public._egce_certification_program_scaffolds(),
    'gp_levels', public._egce_gp_certification_level_mappings(),
    'gp_level_criteria', jsonb_build_array(
      'customer_success', 'governance_alignment', 'training_completion',
      'implementation_excellence', 'knowledge_contributions', 'long_term_relationship_quality'
    ),
    'companion_assessment_areas', public._egce_companion_assessment_areas(),
    'companion_marketplace_route', '/app/companion-marketplace',
    'partner_certification_route', '/app/partners',
    'maintenance_requirements', public._egce_certification_maintenance_requirements(),
    'maintenance_note', 'Failure triggers review — not automatic punishment.',
    'boundary_note', 'Phase 91/107 partner certification RPCs remain authoritative — cross-link NOT duplicate.'
  );
$$;

create or replace function public._egcbp119_audit_programs()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Audit & review programs — support not punishment.',
    'review_types', public._egce_audit_review_types(),
    'approvals_route', '/app/approvals',
    'boundary_note', 'Governance gates via Trust & Action Phase 30 — humans approve significant outcomes.'
  );
$$;

create or replace function public._egcbp119_policy_library()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Ecosystem policy library — practical frameworks, not bureaucracy.',
    'topics', public._egce_policy_topic_scaffolds(),
    'acknowledgement_note', 'Policy acknowledgements tracked as metadata — org retains autonomy.'
  );
$$;

create or replace function public._egcbp119_trust_badging()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust badging system — commitment not superiority.',
    'badge_types', public._egce_trust_badge_scaffolds(),
    'trust_reputation_route', '/app/trust-reputation-engine',
    'boundary_note', 'Cross-link Trust Phase 116 for reputation badging — ecosystem badges are metadata grants.'
  );
$$;

create or replace function public._egcbp119_continuous_improvement()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Continuous improvement engine — governance refinement with compassion.',
    'activities', jsonb_build_array(
      'lessons_learned', 'review_findings', 'best_practice_updates',
      'governance_refinement', 'certification_enhancements', 'knowledge_expansion',
      'community_feedback_integration'
    ),
    'continuous_improvement_route', '/app/continuous-improvement-engine',
    'distinction_note', 'Blueprint Phase 90 CI at /app/continuous-improvement-engine — org improvement. Repo Phase 90 Marketplace Governance at /app/marketplace-governance — different surface.'
  );
$$;

create or replace function public._egcbp119_enterprise_integration()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Enterprise governance integration — voluntary alignment, org retains autonomy.',
    'alignments', jsonb_build_array(
      'aipify_governance_standards', 'companion_safety_frameworks', 'gp_expectations',
      'knowledge_management_principles', 'certification_programs', 'security_practices'
    )
  );
$$;

create or replace function public._egcbp119_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Security requirements — audit logging, RBAC, 2FA, evidence preservation.',
    'requirements', jsonb_build_array(
      'audit_logging', 'evidence_preservation', 'rbac', 'review_histories',
      '2fa_enforcement', 'recovery_procedures', 'governance_documentation',
      'policy_acknowledgements', 'super_admin_protections'
    ),
    'two_factor_route', '/app/settings/two-factor',
    'boundary_note', 'Metadata only — no customer operational content in governance tables.'
  );
$$;

create or replace function public._egcbp119_self_love_in_governance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love in governance — help people succeed, not create fear.',
    'practices', jsonb_build_array(
      'reflection', 'education', 'coaching', 'continuous_improvement',
      'accountability_with_compassion'
    ),
    'route', '/app/self-love-engine',
    'boundary_note', 'Reviews support improvement — accountability with compassion, never punitive framing.'
  );
$$;

create or replace function public._egcbp119_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'marketplace_governance', 'label', 'Marketplace Governance repo Phase 90', 'route', '/app/marketplace-governance', 'relationship', 'Marketplace QA subset — do NOT duplicate'),
    jsonb_build_object('key', 'partner_certification', 'label', 'Partner Certification Phase 91 + Blueprint 107', 'route', '/app/partners', 'relationship', '_pce_tier_label() cross-link'),
    jsonb_build_object('key', 'growth_partner_operations', 'label', 'Growth Partner Ops Phase 114', 'route', '/app/growth-partner-operations', 'relationship', 'Partner quality operations'),
    jsonb_build_object('key', 'companion_marketplace', 'label', 'Companion Marketplace Phase 113', 'route', '/app/companion-marketplace', 'relationship', 'Companion certification cross-link'),
    jsonb_build_object('key', 'certification_achievement', 'label', 'Certification & Achievement A.37', 'route', '/app/certification-achievement-engine', 'relationship', 'Internal team certs — distinct'),
    jsonb_build_object('key', 'aipify_university', 'label', 'Aipify University Phase 115', 'route', '/app/aipify-university', 'relationship', 'Training provider programs'),
    jsonb_build_object('key', 'continuous_improvement', 'label', 'Continuous Improvement A.33/A.49 + Blueprint 90', 'route', '/app/continuous-improvement-engine', 'relationship', 'Org improvement — cross-link CI section'),
    jsonb_build_object('key', 'trust_reputation', 'label', 'Trust Phase 116', 'route', '/app/trust-reputation-engine', 'relationship', 'Trust badging cross-link'),
    jsonb_build_object('key', 'approvals', 'label', 'Trust & Action Phase 30', 'route', '/app/approvals', 'relationship', 'Governance gates'),
    jsonb_build_object('key', 'ai_ethics', 'label', 'AI Ethics Blueprint 98', 'route', '/app/ai-ethics-responsible-use-engine', 'relationship', 'Responsible innovation'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'relationship', 'Accountability with compassion'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-Factor Authentication', 'route', '/app/settings/two-factor', 'relationship', 'Security requirements')
  );
$$;

create or replace function public._egcbp119_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Governance guides not controls — reviews support not punish.',
    'must_avoid', jsonb_build_array(
      'Affiliate terminology — Growth Partner only',
      'Duplicating marketplace-governance or partner certification RPCs',
      'Automatic punishment for certification maintenance gaps',
      'Storing customer email, chat, or PII in governance tables',
      'Mandatory org alignment without voluntary participation framing',
      'Gatekeeping framing — trust badges are commitment not superiority'
    ),
    'required', jsonb_build_array(
      'human_oversight_required default true',
      'Voluntary participation for enterprise governance integration',
      'Metadata-only certification and audit records',
      'Cross-link authoritative domain surfaces',
      'Failure triggers review — not automatic punishment',
      'Audit logging for significant governance events'
    ),
    'boundary_note', 'Ecosystem Governance Center orchestrates oversight — domain RPCs remain authoritative.'
  );
$$;

create or replace function public._egcbp119_companion_adaptation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Ecosystem Governance Companion — calm stewardship. Help people succeed.',
    'companion_name', 'Ecosystem Governance Companion',
    'not_label', 'AI compliance bot',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'certification_review', 'prompt', 'Two certification maintenance reviews are due — shall Aipify prepare a supportive summary for your stewardship review?', 'consideration', 'Reviews support improvement — not punishment'),
      jsonb_build_object('emoji', '🌹', 'key', 'policy_acknowledgement', 'prompt', 'Updated governance training is available — would a gentle refresher before the next audit feel wise?', 'consideration', 'Self Love — education before evaluation'),
      jsonb_build_object('emoji', '🔔', 'key', 'trust_badge', 'prompt', 'A Growth Partner earned a trust badge metadata grant — would celebrating this milestone feel appropriate?', 'consideration', 'Recognition — commitment not superiority')
    ),
    'boundary_note', 'Companion adapts tone — never impersonates auditors or partners.'
  );
$$;

create or replace function public._egcbp119_success_metrics()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'ecosystem_trust', 'label', 'Higher ecosystem trust'),
    jsonb_build_object('key', 'customer_confidence', 'label', 'Improved customer confidence'),
    jsonb_build_object('key', 'gp_quality', 'label', 'Stronger GP quality'),
    jsonb_build_object('key', 'companion_safety', 'label', 'Safer companion deployments'),
    jsonb_build_object('key', 'knowledge_sharing', 'label', 'Increased knowledge sharing'),
    jsonb_build_object('key', 'consistent_implementations', 'label', 'Consistent implementations'),
    jsonb_build_object('key', 'governance_maturity', 'label', 'Healthier governance maturity'),
    jsonb_build_object('key', 'long_term_sustainability', 'label', 'Long-term sustainability')
  );
$$;

create or replace function public._egcbp119_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._egce_ensure_settings(p_tenant_id);
  perform public._egce_seed_programs(p_tenant_id);
  perform public._egce_seed_certification_records(p_tenant_id);
  perform public._egce_seed_audit_reviews(p_tenant_id);
  perform public._egce_seed_policy_entries(p_tenant_id);
  perform public._egce_seed_trust_badges(p_tenant_id);
  v_metrics := public._egce_refresh_metrics(p_tenant_id);

  return jsonb_build_object(
    'governance_maturity_score', coalesce((v_metrics->>'governance_maturity_score')::numeric, 0),
    'certified_participants', coalesce((v_metrics->>'certified_participants')::int, 0),
    'certifications_in_review', coalesce((v_metrics->>'certifications_in_review')::int, 0),
    'active_trust_badges', coalesce((v_metrics->>'active_trust_badges')::int, 0),
    'open_audit_reviews', coalesce((v_metrics->>'open_audit_reviews')::int, 0),
    'active_policies', coalesce((v_metrics->>'active_policies')::int, 0),
    'certification_programs_count', coalesce((v_metrics->>'certification_programs_count')::int, 0),
    'governance_functions_count', coalesce((v_metrics->>'governance_functions_count')::int, 0),
    'cross_links_count', jsonb_array_length(public._egcbp119_cross_links()),
    'privacy_note', 'Aggregate ecosystem governance counts and blueprint scaffolds only — metadata, no PII.'
  );
end; $$;

create or replace function public._egcbp119_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._egce_ensure_settings(p_tenant_id);
  perform public._egce_seed_programs(p_tenant_id);
  perform public._egce_seed_certification_records(p_tenant_id);
  perform public._egce_seed_audit_reviews(p_tenant_id);
  perform public._egce_seed_policy_entries(p_tenant_id);
  perform public._egce_seed_trust_badges(p_tenant_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'governance_functions', 'label', 'Governance Center — nine functions documented', 'met', jsonb_array_length(public._egce_governance_center_functions()) = 9, 'note', null),
    jsonb_build_object('key', 'certification_programs', 'label', 'Certification framework — ten program types', 'met', jsonb_array_length(public._egce_certification_program_scaffolds()) = 10, 'note', null),
    jsonb_build_object('key', 'gp_levels', 'label', 'GP certification — six levels mapped to _pce_tier_label()', 'met', jsonb_array_length(public._egce_gp_certification_level_mappings()) = 6, 'note', null),
    jsonb_build_object('key', 'companion_areas', 'label', 'Companion certification — eight assessment areas', 'met', jsonb_array_length(public._egce_companion_assessment_areas()) = 8, 'note', null),
    jsonb_build_object('key', 'maintenance_requirements', 'label', 'Certification maintenance — six requirements', 'met', jsonb_array_length(public._egce_certification_maintenance_requirements()) = 6, 'note', null),
    jsonb_build_object('key', 'audit_programs', 'label', 'Audit programs — six review types', 'met', jsonb_array_length(public._egce_audit_review_types()) = 6, 'note', null),
    jsonb_build_object('key', 'policy_topics', 'label', 'Policy library — eight topics', 'met', jsonb_array_length(public._egce_policy_topic_scaffolds()) = 8, 'note', null),
    jsonb_build_object('key', 'trust_badges', 'label', 'Trust badging — six badge types', 'met', jsonb_array_length(public._egce_trust_badge_scaffolds()) = 6, 'note', null),
    jsonb_build_object('key', 'cross_links', 'label', 'Mandatory distinction cross-links documented', 'met', jsonb_array_length(public._egcbp119_cross_links()) >= 12, 'note', null),
    jsonb_build_object('key', 'phase90_collision', 'label', 'Phase 90 collision documented — marketplace-governance vs continuous-improvement', 'met', position('marketplace-governance' in public._egcbp119_distinction_note()) > 0, 'note', null),
    jsonb_build_object('key', 'security_2fa', 'label', 'Security — 2FA cross-link documented', 'met', (public._egcbp119_security_requirements()->>'two_factor_route') = '/app/settings/two-factor', 'note', null),
    jsonb_build_object('key', 'human_oversight', 'label', 'human_oversight_required default true', 'met', exists (select 1 from public.ecosystem_governance_settings s where s.tenant_id = p_tenant_id and s.human_oversight_required = true), 'note', null),
    jsonb_build_object('key', 'voluntary_alignment', 'label', 'Voluntary enterprise governance alignment', 'met', exists (select 1 from public.ecosystem_governance_settings s where s.tenant_id = p_tenant_id and s.voluntary_alignment_enabled = true), 'note', null),
    jsonb_build_object('key', 'success_metrics', 'label', 'Success metrics — eight documented', 'met', jsonb_array_length(public._egcbp119_success_metrics()) = 8, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 119 baseline tables and RPCs', 'met', to_regclass('public.ecosystem_governance_settings') is not null, 'note', '_egce_* helpers intact')
  );
end; $$;

create or replace function public._egcbp119_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 119 — Ecosystem Governance & Certification Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE119_ECOSYSTEM_GOVERNANCE_CERTIFICATION.md',
    'engine_phase', 'Repo Phase 119 Ecosystem Governance & Certification Engine',
    'route', '/app/ecosystem-governance',
    'mapping_note', 'Ecosystem-wide governance center — domain RPCs at /app/partners and /app/marketplace-governance remain authoritative.',
    'distinction_note', public._egcbp119_distinction_note(),
    'mission', public._egcbp119_mission(),
    'philosophy', public._egcbp119_philosophy(),
    'abos_principle', public._egcbp119_abos_principle(),
    'objectives', public._egcbp119_objectives(),
    'governance_center', public._egcbp119_governance_center(),
    'certification_framework', public._egcbp119_certification_framework(),
    'audit_programs', public._egcbp119_audit_programs(),
    'policy_library', public._egcbp119_policy_library(),
    'trust_badging', public._egcbp119_trust_badging(),
    'continuous_improvement', public._egcbp119_continuous_improvement(),
    'enterprise_integration', public._egcbp119_enterprise_integration(),
    'security_requirements', public._egcbp119_security_requirements(),
    'self_love_in_governance', public._egcbp119_self_love_in_governance(),
    'cross_links', public._egcbp119_cross_links(),
    'limitation_principles', public._egcbp119_limitation_principles(),
    'companion_adaptation', public._egcbp119_companion_adaptation(),
    'success_metrics', public._egcbp119_success_metrics(),
    'success_criteria', public._egcbp119_success_criteria(p_tenant_id),
    'vision', public._egcbp119_vision(),
    'engagement_summary', public._egcbp119_engagement_summary(p_tenant_id),
    'privacy_note', 'Ecosystem governance blueprint data is metadata only — certification status and cross-links. Humans approve significant governance outcomes.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 11. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_ecosystem_governance_card(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.ecosystem_governance_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._egce_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._egce_ensure_settings(v_tenant_id);
  perform public._egce_seed_programs(v_tenant_id);
  perform public._egce_seed_certification_records(v_tenant_id);
  perform public._egce_seed_audit_reviews(v_tenant_id);
  perform public._egce_seed_policy_entries(v_tenant_id);
  perform public._egce_seed_trust_badges(v_tenant_id);
  v_metrics := public._egce_refresh_metrics(v_tenant_id);
  v_engagement := public._egcbp119_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'governance_maturity_score', v_metrics->'governance_maturity_score',
    'certified_participants', v_metrics->'certified_participants',
    'active_trust_badges', v_metrics->'active_trust_badges',
    'philosophy', public._egcbp119_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'voluntary_alignment_enabled', v_settings.voluntary_alignment_enabled,
    'implementation_blueprint_phase119', jsonb_build_object(
      'phase', 'Phase 119 — Ecosystem Governance & Certification Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE119_ECOSYSTEM_GOVERNANCE_CERTIFICATION.md',
      'engine_phase', 'Repo Phase 119 Ecosystem Governance & Certification Engine',
      'route', '/app/ecosystem-governance',
      'mapping_note', 'Ecosystem-wide governance — domain RPCs remain authoritative.'
    ),
    'ecosystem_governance_mission', public._egcbp119_mission(),
    'ecosystem_governance_abos_principle', public._egcbp119_abos_principle(),
    'ecosystem_governance_engagement_summary', v_engagement,
    'ecosystem_governance_vision_note', public._egcbp119_vision()
  );
end; $$;

create or replace function public.get_ecosystem_governance_dashboard(p_tenant_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.ecosystem_governance_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._egce_require_tenant());
  v_settings := public._egce_ensure_settings(v_tenant_id);
  perform public._egce_seed_programs(v_tenant_id);
  perform public._egce_seed_certification_records(v_tenant_id);
  perform public._egce_seed_audit_reviews(v_tenant_id);
  perform public._egce_seed_policy_entries(v_tenant_id);
  perform public._egce_seed_trust_badges(v_tenant_id);
  v_metrics := public._egce_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', v_settings.human_oversight_required,
    'governance_enabled', v_settings.governance_enabled,
    'voluntary_alignment_enabled', v_settings.voluntary_alignment_enabled,
    'certification_oversight_enabled', v_settings.certification_oversight_enabled,
    'audit_programs_enabled', v_settings.audit_programs_enabled,
    'mandatory_2fa_for_governance_roles', v_settings.mandatory_2fa_for_governance_roles,
    'policy_acknowledgement_required', v_settings.policy_acknowledgement_required,
    'philosophy', public._egcbp119_philosophy(),
    'distinction_note', public._egcbp119_distinction_note(),
    'safety_note', 'Ecosystem Governance Center — metadata-only certification and audit records. Reviews support improvement — not punishment. Humans approve significant governance outcomes.',
    'governance_maturity_score', v_metrics->'governance_maturity_score',
    'certified_participants', v_metrics->'certified_participants',
    'certifications_in_review', v_metrics->'certifications_in_review',
    'active_trust_badges', v_metrics->'active_trust_badges',
    'open_audit_reviews', v_metrics->'open_audit_reviews',
    'active_policies', v_metrics->'active_policies',
    'certification_programs_count', v_metrics->'certification_programs_count',
    'gp_levels_count', v_metrics->'gp_levels_count',
    'companion_assessment_areas_count', v_metrics->'companion_assessment_areas_count',
    'policy_topics_count', v_metrics->'policy_topics_count',
    'trust_badge_types_count', v_metrics->'trust_badge_types_count',
    'governance_functions_count', v_metrics->'governance_functions_count',
    'certification_programs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'program_key', p.program_key, 'title', p.title,
        'program_type', p.program_type, 'cross_link_route', p.cross_link_route, 'status', p.status
      ) order by p.sort_order, p.title)
      from public.ecosystem_governance_certification_programs p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'certification_records', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'participant_key', r.participant_key, 'participant_type', r.participant_type,
        'certification_level', r.certification_level, 'certification_level_label', r.certification_level_label,
        'status', r.status, 'progress_pct', r.progress_pct,
        'maintenance_requirements_met', r.maintenance_requirements_met
      ) order by r.updated_at desc)
      from public.ecosystem_governance_certification_records r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'audit_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'review_type', a.review_type, 'title', a.title, 'summary', a.summary,
        'status', a.status, 'priority', a.priority, 'scheduled_at', a.scheduled_at,
        'findings_count', a.findings_count, 'support_not_punishment_note', a.support_not_punishment_note
      ) order by a.scheduled_at nulls last)
      from public.ecosystem_governance_audit_reviews a
      where a.tenant_id = v_tenant_id and a.status in ('scheduled', 'in_progress', 'follow_up')
    ), '[]'::jsonb),
    'policy_entries', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', pe.id, 'policy_key', pe.policy_key, 'title', pe.title, 'summary', pe.summary,
        'topic', pe.topic, 'acknowledgement_required', pe.acknowledgement_required, 'status', pe.status
      ) order by pe.sort_order, pe.title)
      from public.ecosystem_governance_policy_entries pe where pe.tenant_id = v_tenant_id and pe.status = 'active'
    ), '[]'::jsonb),
    'trust_badges', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', b.id, 'badge_key', b.badge_key, 'badge_type', b.badge_type, 'title', b.title,
        'summary', b.summary, 'granted_to_key', b.granted_to_key, 'status', b.status, 'granted_at', b.granted_at
      ) order by b.granted_at desc)
      from public.ecosystem_governance_trust_badges b
      where b.tenant_id = v_tenant_id and b.status = 'active'
    ), '[]'::jsonb),
    'gp_certification_levels', public._egce_gp_certification_level_mappings(),
    'companion_assessment_areas', public._egce_companion_assessment_areas(),
    'certification_maintenance_requirements', public._egce_certification_maintenance_requirements(),
    'audit_review_types', public._egce_audit_review_types(),
    'policy_topic_scaffolds', public._egce_policy_topic_scaffolds(),
    'trust_badge_scaffolds', public._egce_trust_badge_scaffolds(),
    'governance_center_functions', public._egce_governance_center_functions(),
    'integration_links', public._egcbp119_cross_links(),
    'implementation_blueprint_phase119', jsonb_build_object(
      'phase', 'Phase 119 — Ecosystem Governance & Certification Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE119_ECOSYSTEM_GOVERNANCE_CERTIFICATION.md',
      'engine_phase', 'Repo Phase 119 Ecosystem Governance & Certification Engine',
      'route', '/app/ecosystem-governance',
      'mapping_note', 'Ecosystem-wide governance center — domain RPCs remain authoritative.'
    ),
    'ecosystem_governance_blueprint', public._egcbp119_blueprint_block(v_tenant_id),
    'ecosystem_governance_mission', public._egcbp119_mission(),
    'ecosystem_governance_philosophy', public._egcbp119_philosophy(),
    'ecosystem_governance_abos_principle', public._egcbp119_abos_principle(),
    'ecosystem_governance_objectives', public._egcbp119_objectives(),
    'governance_center_meta', public._egcbp119_governance_center(),
    'certification_framework_meta', public._egcbp119_certification_framework(),
    'audit_programs_meta', public._egcbp119_audit_programs(),
    'policy_library_meta', public._egcbp119_policy_library(),
    'trust_badging_meta', public._egcbp119_trust_badging(),
    'continuous_improvement_meta', public._egcbp119_continuous_improvement(),
    'enterprise_integration_meta', public._egcbp119_enterprise_integration(),
    'security_requirements_meta', public._egcbp119_security_requirements(),
    'self_love_in_governance', public._egcbp119_self_love_in_governance(),
    'egcbp119_cross_links', public._egcbp119_cross_links(),
    'ecosystem_governance_limitation_principles', public._egcbp119_limitation_principles(),
    'ecosystem_governance_companion_adaptation', public._egcbp119_companion_adaptation(),
    'ecosystem_governance_engagement_summary', public._egcbp119_engagement_summary(v_tenant_id),
    'ecosystem_governance_success_criteria', public._egcbp119_success_criteria(v_tenant_id),
    'ecosystem_governance_success_metrics', public._egcbp119_success_metrics(),
    'ecosystem_governance_vision', public._egcbp119_vision(),
    'privacy_note', 'Ecosystem governance metadata only — certification status, audit schedules, and policy scaffolds. No customer email, chat, or PII. Humans approve significant governance outcomes.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'ecosystem-governance', 'Ecosystem Governance & Certification',
  'Ecosystem Governance Center — certification oversight, audit programs, policy library, and trust badging across Growth Partners, Companions, and training providers.',
  'authenticated', 139
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'ecosystem-governance' and tenant_id is null
);

grant execute on function public.get_ecosystem_governance_card(uuid) to authenticated;
grant execute on function public.get_ecosystem_governance_dashboard(uuid) to authenticated;
grant execute on function public._egcbp119_distinction_note() to authenticated;
grant execute on function public._egcbp119_mission() to authenticated;
grant execute on function public._egcbp119_philosophy() to authenticated;
grant execute on function public._egcbp119_abos_principle() to authenticated;
grant execute on function public._egcbp119_vision() to authenticated;
grant execute on function public._egcbp119_objectives() to authenticated;
grant execute on function public._egcbp119_governance_center() to authenticated;
grant execute on function public._egcbp119_certification_framework() to authenticated;
grant execute on function public._egcbp119_audit_programs() to authenticated;
grant execute on function public._egcbp119_policy_library() to authenticated;
grant execute on function public._egcbp119_trust_badging() to authenticated;
grant execute on function public._egcbp119_continuous_improvement() to authenticated;
grant execute on function public._egcbp119_enterprise_integration() to authenticated;
grant execute on function public._egcbp119_security_requirements() to authenticated;
grant execute on function public._egcbp119_self_love_in_governance() to authenticated;
grant execute on function public._egcbp119_cross_links() to authenticated;
grant execute on function public._egcbp119_limitation_principles() to authenticated;
grant execute on function public._egcbp119_companion_adaptation() to authenticated;
grant execute on function public._egcbp119_success_metrics() to authenticated;
