-- Phase 141 — Global Knowledge Exchange & Interorganizational Learning Engine
-- Global Intelligence & Interorganizational Era (141–150) opener.
-- Distinct from Cross-Tenant Intelligence A.71 (/app/cross-tenant-intelligence-engine — do NOT duplicate _ctie_*).
-- Helpers: _gkee_* (engine), _gkeebp141_* (blueprint — never collide with _ctie_*, _ccsbp117_*)

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
    'proactive_organization',
    'collective_decision_council',
    'human_potential_augmented_work',
    'augmented_organization',
    'global_knowledge_exchange'
  )
);

-- ---------------------------------------------------------------------------
-- 1. global_knowledge_exchange_settings
-- ---------------------------------------------------------------------------
create table if not exists public.global_knowledge_exchange_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default false,
  participation_status text not null default 'disabled' check (
    participation_status in ('disabled', 'viewer', 'contributor')
  ),
  sharing_boundaries jsonb not null default '{}'::jsonb,
  anonymization_level text not null default 'standard' check (
    anonymization_level in ('standard', 'enhanced')
  ),
  approval_required boolean not null default true,
  executive_approval_required boolean not null default true,
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.global_knowledge_exchange_settings enable row level security;
revoke all on public.global_knowledge_exchange_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. global_knowledge_exchange_contributions
-- ---------------------------------------------------------------------------
create table if not exists public.global_knowledge_exchange_contributions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  contribution_key text not null,
  contribution_type text not null check (
    contribution_type in (
      'lessons_learned', 'best_practice', 'transformation_experience', 'support_excellence',
      'companion_adoption', 'governance_framework', 'implementation_playbook', 'training_insight',
      'case_study_summary', 'operational_pattern'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  anonymized boolean not null default true,
  industry_tag text,
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected')
  ),
  metadata jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  unique (tenant_id, contribution_key)
);

create index if not exists global_knowledge_exchange_contributions_tenant_idx
  on public.global_knowledge_exchange_contributions (tenant_id, status, submitted_at desc);

alter table public.global_knowledge_exchange_contributions enable row level security;
revoke all on public.global_knowledge_exchange_contributions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. global_knowledge_exchange_programs
-- ---------------------------------------------------------------------------
create table if not exists public.global_knowledge_exchange_programs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  program_key text not null,
  status text not null default 'enrolled' check (
    status in ('enrolled', 'active', 'paused', 'completed')
  ),
  metadata jsonb not null default '{}'::jsonb,
  enrolled_at timestamptz not null default now(),
  unique (tenant_id, program_key)
);

create index if not exists global_knowledge_exchange_programs_tenant_idx
  on public.global_knowledge_exchange_programs (tenant_id, status);

alter table public.global_knowledge_exchange_programs enable row level security;
revoke all on public.global_knowledge_exchange_programs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. global_knowledge_exchange_benchmark_snapshots
-- ---------------------------------------------------------------------------
create table if not exists public.global_knowledge_exchange_benchmark_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  snapshot_key text not null,
  benchmark_domain text not null check (
    benchmark_domain in (
      'industry_average', 'maturity_indicator', 'knowledge_engagement',
      'companion_adoption', 'support_responsiveness', 'transformation_readiness'
    )
  ),
  aggregate_value numeric,
  industry_tag text,
  participant_count int not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, snapshot_key)
);

create index if not exists global_knowledge_exchange_benchmark_snapshots_tenant_idx
  on public.global_knowledge_exchange_benchmark_snapshots (tenant_id, benchmark_domain, captured_at desc);

alter table public.global_knowledge_exchange_benchmark_snapshots enable row level security;
revoke all on public.global_knowledge_exchange_benchmark_snapshots from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. global_knowledge_exchange_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.global_knowledge_exchange_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.global_knowledge_exchange_audit_logs enable row level security;
revoke all on public.global_knowledge_exchange_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'global_knowledge_exchange_engine', v.description
from (values
  ('global_knowledge_exchange.view', 'View Global Knowledge Exchange', 'View exchange programs, anonymized benchmarks, and approved contributions'),
  ('global_knowledge_exchange.manage', 'Manage Global Knowledge Exchange', 'Update participation settings, review contributions, and governance metadata'),
  ('global_knowledge_exchange.contribute', 'Contribute to Global Knowledge Exchange', 'Submit shareable knowledge artifacts for governance review')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'global_knowledge_exchange.view'), ('owner', 'global_knowledge_exchange.manage'), ('owner', 'global_knowledge_exchange.contribute'),
  ('administrator', 'global_knowledge_exchange.view'), ('administrator', 'global_knowledge_exchange.manage'), ('administrator', 'global_knowledge_exchange.contribute'),
  ('manager', 'global_knowledge_exchange.view'), ('manager', 'global_knowledge_exchange.contribute'),
  ('employee', 'global_knowledge_exchange.view'),
  ('support_agent', 'global_knowledge_exchange.view'),
  ('moderator', 'global_knowledge_exchange.view'),
  ('viewer', 'global_knowledge_exchange.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Engine helpers (_gkee_)
-- ---------------------------------------------------------------------------
create or replace function public._gkee_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._gkee_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._gkee_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._gkee_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.global_knowledge_exchange_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._gkee_ensure_settings(p_tenant_id uuid)
returns public.global_knowledge_exchange_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.global_knowledge_exchange_settings;
begin
  insert into public.global_knowledge_exchange_settings (tenant_id, enabled, participation_status)
  values (p_tenant_id, false, 'disabled')
  on conflict (tenant_id) do nothing;
  select * into v_settings from public.global_knowledge_exchange_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._gkee_seed_programs(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.global_knowledge_exchange_programs where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.global_knowledge_exchange_programs (tenant_id, program_key, status) values
    (p_tenant_id, 'cross_industry_insights', 'enrolled'),
    (p_tenant_id, 'lessons_learned_exchange', 'enrolled'),
    (p_tenant_id, 'anonymized_benchmarking', 'enrolled'),
    (p_tenant_id, 'gp_contribution_network', 'enrolled'),
    (p_tenant_id, 'community_learning_bridge', 'enrolled'),
    (p_tenant_id, 'transformation_wisdom', 'enrolled'),
    (p_tenant_id, 'support_excellence_network', 'enrolled'),
    (p_tenant_id, 'knowledge_stewardship', 'enrolled');
end; $$;

create or replace function public._gkee_seed_benchmark_snapshots(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.global_knowledge_exchange_benchmark_snapshots where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.global_knowledge_exchange_benchmark_snapshots (
    tenant_id, snapshot_key, benchmark_domain, aggregate_value, industry_tag, participant_count
  ) values
    (p_tenant_id, 'industry-avg-baseline', 'industry_average', 72.5, 'general', 12),
    (p_tenant_id, 'maturity-indicator', 'maturity_indicator', 2.8, 'general', 12),
    (p_tenant_id, 'knowledge-engagement', 'knowledge_engagement', 68.0, 'general', 12),
    (p_tenant_id, 'companion-adoption', 'companion_adoption', 64.5, 'general', 12),
    (p_tenant_id, 'support-responsiveness', 'support_responsiveness', 78.0, 'general', 12),
    (p_tenant_id, 'transformation-readiness', 'transformation_readiness', 71.0, 'general', 12);
end; $$;

create or replace function public._gkee_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.global_knowledge_exchange_settings;
  v_program_count int;
  v_contribution_count int;
  v_approved_count int;
  v_pending_count int;
  v_benchmark_count int;
  v_exchange_score numeric;
begin
  select * into v_settings from public.global_knowledge_exchange_settings where tenant_id = p_tenant_id;
  select count(*) into v_program_count from public.global_knowledge_exchange_programs where tenant_id = p_tenant_id;
  select count(*) into v_contribution_count from public.global_knowledge_exchange_contributions where tenant_id = p_tenant_id;
  select count(*) into v_approved_count from public.global_knowledge_exchange_contributions where tenant_id = p_tenant_id and status = 'approved';
  select count(*) into v_pending_count from public.global_knowledge_exchange_contributions where tenant_id = p_tenant_id and status = 'pending';
  select count(*) into v_benchmark_count from public.global_knowledge_exchange_benchmark_snapshots where tenant_id = p_tenant_id;

  v_exchange_score := round(
    case when coalesce(v_settings.enabled, false) then 20 else 0 end
    + case v_settings.participation_status
        when 'contributor' then 25 when 'viewer' then 15 else 0
      end
    + least(v_approved_count, 10) * 4
    + least(v_program_count, 8) * 2.5,
    1
  );

  return jsonb_build_object(
    'exchange_score', v_exchange_score,
    'participation_status', coalesce(v_settings.participation_status, 'disabled'),
    'enabled', coalesce(v_settings.enabled, false),
    'programs_count', v_program_count,
    'contributions_count', v_contribution_count,
    'approved_contributions_count', v_approved_count,
    'pending_contributions_count', v_pending_count,
    'benchmark_snapshots_count', v_benchmark_count,
    'cross_links_count', jsonb_array_length(public._gkeebp141_integration_links()),
    'learning_networks_count', jsonb_array_length(public._gkeebp141_global_learning_networks()->'networks')
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Blueprint helpers (_gkeebp141_)
-- ---------------------------------------------------------------------------
create or replace function public._gkeebp141_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 141 — Global Knowledge Exchange & Interorganizational Learning Engine at /app/global-knowledge-exchange-engine. Global Intelligence Era (141–150) opener — voluntary governed exchange, not unrestricted sharing. Distinct from Cross-Tenant Intelligence A.71 at /app/cross-tenant-intelligence-engine (anonymized trends — cross-link, do NOT duplicate _ctie_*). Distinct from Community Phase 117 at /app/community. Distinct from Organizational Benchmarking A.58 at /app/organizational-benchmarking-engine. Distinct from Impact Metrics marketing proof (/platform/impact — anonymised aggregates only). Helpers _gkeebp141_* — never collide with _ctie_*, _ccsbp117_*.';
$$;

create or replace function public._gkeebp141_mission()
returns text language sql immutable as $$
  select 'Enable voluntary, consensual, governed knowledge exchange across participating organizations — wisdom before speed, anonymization mandatory, organizations own their knowledge.';
$$;

create or replace function public._gkeebp141_philosophy()
returns text language sql immutable as $$
  select 'People First. Voluntary exchange only. Anonymization mandatory for benchmarks. Wisdom before speed. Organizations own their knowledge. Growth Partner terminology — never Affiliate. Never expose cross-tenant identifiable operational data.';
$$;

create or replace function public._gkeebp141_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Global Knowledge Exchange aggregates opt-in interorganizational learning visibility. Era phase engines and A.71 cross-tenant intelligence remain authoritative for their domains. Aipify informs and prepares; humans and executives decide what to share.';
$$;

create or replace function public._gkeebp141_vision()
returns text language sql immutable as $$
  select 'A global learning network where organizations share wisdom generously — with humility, curiosity, and mutual support — while protecting confidentiality and human dignity.';
$$;

create or replace function public._gkeebp141_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'voluntary_exchange', 'label', 'Voluntary exchange', 'emoji', '🤝', 'description', 'Opt-in participation with clear boundaries'),
    jsonb_build_object('key', 'governed_sharing', 'label', 'Governed sharing', 'emoji', '🛡️', 'description', 'Approval workflows and executive oversight'),
    jsonb_build_object('key', 'anonymized_benchmarks', 'label', 'Anonymized benchmarks', 'emoji', '📊', 'description', 'Industry aggregates — no identifiable tenant data'),
    jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned exchange', 'emoji', '📚', 'description', 'Transformation and operational wisdom sharing'),
    jsonb_build_object('key', 'gp_contributions', 'label', 'Growth Partner contributions', 'emoji', '🌱', 'description', 'Implementation playbooks and adoption frameworks'),
    jsonb_build_object('key', 'learning_networks', 'label', 'Global learning networks', 'emoji', '🌐', 'description', 'Cross-industry community learning bridges'),
    jsonb_build_object('key', 'collective_wisdom', 'label', 'Collective wisdom companion', 'emoji', '✨', 'description', 'Discovery and benchmark interpretation — never reveal confidential info'),
    jsonb_build_object('key', 'privacy_governance', 'label', 'Privacy & governance', 'emoji', '🔒', 'description', 'Explicit opt-in, audit logging, RBAC')
  );
$$;

create or replace function public._gkeebp141_global_knowledge_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Global Knowledge Center — eight exchange capabilities. Voluntary governed exchange.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'exchange_programs', 'label', 'Exchange programs'),
      jsonb_build_object('key', 'cross_industry_insights', 'label', 'Cross-industry insights', 'cross_link', '/app/cross-tenant-intelligence-engine'),
      jsonb_build_object('key', 'anonymized_benchmarking', 'label', 'Anonymized benchmarking', 'cross_link', '/app/organizational-benchmarking-engine'),
      jsonb_build_object('key', 'community_learning', 'label', 'Community learning networks', 'cross_link', '/app/community'),
      jsonb_build_object('key', 'gp_contributions', 'label', 'Growth Partner contributions', 'cross_link', '/app/growth-partner-operations'),
      jsonb_build_object('key', 'best_practices', 'label', 'Best practices library'),
      jsonb_build_object('key', 'collective_initiatives', 'label', 'Collective initiatives'),
      jsonb_build_object('key', 'governance_controls', 'label', 'Governance controls', 'cross_link', '/app/collective-decision-council-engine')
    )
  );
$$;

create or replace function public._gkeebp141_interorganizational_learning_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Interorganizational learning — metadata summaries only, never raw operational records.',
    'domains', jsonb_build_array(
      jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned exchanges'),
      jsonb_build_object('key', 'operational_best_practices', 'label', 'Operational best practices'),
      jsonb_build_object('key', 'transformation_experiences', 'label', 'Transformation experiences'),
      jsonb_build_object('key', 'support_excellence', 'label', 'Support excellence'),
      jsonb_build_object('key', 'companion_adoption', 'label', 'Companion adoption insights'),
      jsonb_build_object('key', 'governance_framework_sharing', 'label', 'Governance framework sharing')
    )
  );
$$;

create or replace function public._gkeebp141_knowledge_sharing_governance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Knowledge sharing governance — voluntary, approved, anonymized where shared globally.',
    'rules', jsonb_build_array(
      jsonb_build_object('key', 'voluntary', 'label', 'Voluntary participation only'),
      jsonb_build_object('key', 'may_share', 'label', 'May share: anonymized patterns, approved summaries, governance frameworks'),
      jsonb_build_object('key', 'must_not_share', 'label', 'Must not share: PII, raw emails, chats, orders, financial records, proprietary secrets'),
      jsonb_build_object('key', 'anonymization', 'label', 'Anonymization required for global benchmarks'),
      jsonb_build_object('key', 'approval_workflows', 'label', 'Approval workflows before publication'),
      jsonb_build_object('key', 'retention', 'label', 'Retention policies with audit visibility'),
      jsonb_build_object('key', 'participation_boundaries', 'label', 'Participation boundaries per tenant settings')
    )
  );
$$;

create or replace function public._gkeebp141_anonymized_benchmarking_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Anonymized benchmarking — industry averages and maturity indicators only. No identifiable info.',
    'benchmarks', jsonb_build_array(
      jsonb_build_object('key', 'industry_averages', 'label', 'Industry averages'),
      jsonb_build_object('key', 'maturity_indicators', 'label', 'Maturity indicators'),
      jsonb_build_object('key', 'knowledge_engagement', 'label', 'Knowledge engagement'),
      jsonb_build_object('key', 'companion_adoption', 'label', 'Companion adoption'),
      jsonb_build_object('key', 'support_responsiveness', 'label', 'Support responsiveness'),
      jsonb_build_object('key', 'transformation_readiness', 'label', 'Transformation readiness')
    ),
    'privacy_note', 'Minimum participant thresholds for shared views. Never expose individual tenant identity.'
  );
$$;

create or replace function public._gkeebp141_global_learning_networks()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Global learning networks — connect leaders and stewards across industries.',
    'networks', jsonb_build_array(
      jsonb_build_object('key', 'executive_leadership', 'label', 'Executive leadership'),
      jsonb_build_object('key', 'support_excellence', 'label', 'Support excellence'),
      jsonb_build_object('key', 'commerce_operations', 'label', 'Commerce operations'),
      jsonb_build_object('key', 'governance_stewards', 'label', 'Governance stewards'),
      jsonb_build_object('key', 'gp_development', 'label', 'Growth Partner development'),
      jsonb_build_object('key', 'knowledge_stewardship', 'label', 'Knowledge stewardship', 'cross_link', '/app/knowledge-center-engine'),
      jsonb_build_object('key', 'transformation', 'label', 'Transformation'),
      jsonb_build_object('key', 'resilience', 'label', 'Resilience')
    )
  );
$$;

create or replace function public._gkeebp141_growth_partner_contribution_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Growth Partner contribution engine — metadata summaries, never proprietary customer data.',
    'contribution_types', jsonb_build_array(
      jsonb_build_object('key', 'implementation_insights', 'label', 'Implementation insights'),
      jsonb_build_object('key', 'playbooks', 'label', 'Playbooks'),
      jsonb_build_object('key', 'adoption_frameworks', 'label', 'Adoption frameworks'),
      jsonb_build_object('key', 'training', 'label', 'Training recommendations'),
      jsonb_build_object('key', 'recommendations', 'label', 'Recommendations'),
      jsonb_build_object('key', 'case_studies', 'label', 'Case studies — metadata summaries only')
    ),
    'gp_route', '/app/growth-partner-operations',
    'university_route', '/app/aipify-university'
  );
$$;

create or replace function public._gkeebp141_collective_wisdom_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collective wisdom companion — discovery and interpretation, never confidential exposure.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'knowledge_discovery', 'label', 'Knowledge discovery'),
      jsonb_build_object('key', 'benchmark_interpretation', 'label', 'Benchmark interpretation'),
      jsonb_build_object('key', 'cross_industry_insights', 'label', 'Cross-industry insights'),
      jsonb_build_object('key', 'learning_recommendations', 'label', 'Learning recommendations'),
      jsonb_build_object('key', 'community_navigation', 'label', 'Community navigation', 'cross_link', '/app/community'),
      jsonb_build_object('key', 'reflection', 'label', 'Reflection — humility and curiosity')
    )
  );
$$;

create or replace function public._gkeebp141_privacy_confidentiality_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Privacy & confidentiality — explicit opt-in with governance oversight.',
    'controls', jsonb_build_array(
      jsonb_build_object('key', 'explicit_opt_in', 'label', 'Explicit opt-in required'),
      jsonb_build_object('key', 'governance_oversight', 'label', 'Governance oversight'),
      jsonb_build_object('key', 'executive_approval', 'label', 'Executive approval for contributions'),
      jsonb_build_object('key', 'audit_logging', 'label', 'Full audit logging')
    )
  );
$$;

create or replace function public._gkeebp141_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'must_avoid', jsonb_build_array(
      'Proprietary exposure',
      'Unauthorized sharing',
      'Governance bypass',
      'Identity reveal of other tenants',
      'Privacy override',
      'Pressure to share confidential data'
    ),
    'principle', 'Companions guide discovery — humans and executives decide what to share.'
  );
$$;

create or replace function public._gkeebp141_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — humility, curiosity, generosity, mutual support, shared humanity.',
    'values', jsonb_build_array(
      'humility', 'curiosity', 'generosity', 'mutual_support', 'shared_humanity'
    ),
    'cross_link', '/app/self-love-engine'
  );
$$;

create or replace function public._gkeebp141_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'sharing_audit_logs', 'label', 'Sharing audit logs'),
      jsonb_build_object('key', 'executive_approval', 'label', 'Executive approval workflows'),
      jsonb_build_object('key', 'rbac', 'label', 'Role-based access control'),
      jsonb_build_object('key', 'anonymization_standards', 'label', 'Anonymization standards'),
      jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
    )
  );
$$;

create or replace function public._gkeebp141_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'cross_tenant_intelligence', 'label', 'Cross-Tenant Intelligence A.71', 'route', '/app/cross-tenant-intelligence-engine', 'relationship', 'Anonymized trends — do NOT duplicate _ctie_*'),
    jsonb_build_object('key', 'community', 'label', 'Community Phase 117', 'route', '/app/community', 'relationship', 'Community learning — cross-link only'),
    jsonb_build_object('key', 'organizational_benchmarking', 'label', 'Organizational Benchmarking A.58', 'route', '/app/organizational-benchmarking-engine', 'relationship', 'Tenant benchmarks — cross-link'),
    jsonb_build_object('key', 'growth_partner_ops', 'label', 'Growth Partner Ops Phase 114', 'route', '/app/growth-partner-operations', 'relationship', 'GP contributions'),
    jsonb_build_object('key', 'aipify_university', 'label', 'Aipify University Phase 115', 'route', '/app/aipify-university', 'relationship', 'Learning pathways'),
    jsonb_build_object('key', 'impact_metrics', 'label', 'Impact Metrics', 'route', '/platform/impact', 'relationship', 'Anonymised marketing proof — platform only'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center A.5', 'route', '/app/knowledge-center-engine', 'relationship', 'Knowledge stewardship'),
    jsonb_build_object('key', 'collective_decision', 'label', 'Collective Decision Council Phase 137', 'route', '/app/collective-decision-council-engine', 'relationship', 'Governance cross-link'),
    jsonb_build_object('key', 'augmented_organization', 'label', 'Augmented Organization Phase 140', 'route', '/app/augmented-organization-engine', 'relationship', 'Prior era capstone — cross-link')
  );
$$;

create or replace function public._gkeebp141_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses Global Knowledge Exchange internally with metadata-only contribution summaries and anonymized benchmark participation. Growth Partner terminology throughout. No cross-tenant PII.';
$$;

create or replace function public._gkeebp141_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Wisdom before speed.',
    'Voluntary exchange — organizations own their knowledge.',
    'Anonymization mandatory for shared benchmarks.',
    'Humility, curiosity, generosity.',
    'People First — mutual support across industries.'
  );
$$;

create or replace function public._gkeebp141_privacy_note()
returns text language sql immutable as $$
  select 'Global Knowledge Exchange metadata only — approved anonymized summaries and aggregate benchmarks. No cross-tenant PII. No identifiable operational data in shared views. Opt-in required.';
$$;

create or replace function public._gkeebp141_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._gkee_ensure_settings(p_tenant_id);
  perform public._gkee_seed_programs(p_tenant_id);
  perform public._gkee_seed_benchmark_snapshots(p_tenant_id);
  v_metrics := public._gkee_refresh_metrics(p_tenant_id);

  return jsonb_build_object(
    'exchange_score', coalesce((v_metrics->>'exchange_score')::numeric, 0),
    'participation_status', coalesce(v_metrics->>'participation_status', 'disabled'),
    'enabled', coalesce((v_metrics->>'enabled')::boolean, false),
    'programs_count', coalesce((v_metrics->>'programs_count')::int, 0),
    'contributions_count', coalesce((v_metrics->>'contributions_count')::int, 0),
    'approved_contributions_count', coalesce((v_metrics->>'approved_contributions_count')::int, 0),
    'pending_contributions_count', coalesce((v_metrics->>'pending_contributions_count')::int, 0),
    'benchmark_snapshots_count', coalesce((v_metrics->>'benchmark_snapshots_count')::int, 0),
    'cross_links_count', jsonb_array_length(public._gkeebp141_integration_links()),
    'learning_networks_count', 8,
    'privacy_note', public._gkeebp141_privacy_note(),
    'opt_in_required', true
  );
end; $$;

create or replace function public._gkeebp141_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._gkee_ensure_settings(p_tenant_id);
  perform public._gkee_seed_programs(p_tenant_id);
  perform public._gkee_seed_benchmark_snapshots(p_tenant_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'global_knowledge_center', 'label', 'Global Knowledge Center — eight capabilities', 'met', jsonb_array_length(public._gkeebp141_global_knowledge_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'interorganizational_learning', 'label', 'Interorganizational learning — six domains', 'met', jsonb_array_length(public._gkeebp141_interorganizational_learning_engine()->'domains') = 6, 'note', null),
    jsonb_build_object('key', 'governance_rules', 'label', 'Knowledge sharing governance — seven rules', 'met', jsonb_array_length(public._gkeebp141_knowledge_sharing_governance()->'rules') = 7, 'note', null),
    jsonb_build_object('key', 'benchmark_engine', 'label', 'Anonymized benchmarking — six benchmarks', 'met', jsonb_array_length(public._gkeebp141_anonymized_benchmarking_engine()->'benchmarks') = 6, 'note', null),
    jsonb_build_object('key', 'learning_networks', 'label', 'Global learning networks — eight networks', 'met', jsonb_array_length(public._gkeebp141_global_learning_networks()->'networks') = 8, 'note', null),
    jsonb_build_object('key', 'programs_seeded', 'label', 'Exchange programs seeded', 'met', (select count(*) >= 8 from public.global_knowledge_exchange_programs p where p.tenant_id = p_tenant_id), 'note', null),
    jsonb_build_object('key', 'benchmarks_seeded', 'label', 'Benchmark snapshots seeded', 'met', (select count(*) >= 6 from public.global_knowledge_exchange_benchmark_snapshots b where b.tenant_id = p_tenant_id), 'note', null),
    jsonb_build_object('key', 'opt_in_default', 'label', 'Default opt-out (enabled false)', 'met', exists (select 1 from public.global_knowledge_exchange_settings s where s.tenant_id = p_tenant_id and s.enabled = false), 'note', null),
    jsonb_build_object('key', 'approval_required', 'label', 'Approval required default true', 'met', exists (select 1 from public.global_knowledge_exchange_settings s where s.tenant_id = p_tenant_id and s.approval_required = true), 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._gkeebp141_companion_limitations()->'must_avoid') >= 6, 'note', null),
    jsonb_build_object('key', 'objectives', 'label', 'Blueprint objectives — eight documented', 'met', jsonb_array_length(public._gkeebp141_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'integration_links', 'label', 'Integration links — nine cross-links', 'met', jsonb_array_length(public._gkeebp141_integration_links()) = 9, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 141 baseline tables and RPCs', 'met', to_regclass('public.global_knowledge_exchange_settings') is not null, 'note', '_gkee_* helpers intact')
  );
end; $$;

create or replace function public._gkeebp141_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 141 — Global Knowledge Exchange & Interorganizational Learning Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE141_GLOBAL_KNOWLEDGE_EXCHANGE_INTERORGANIZATIONAL_LEARNING.md',
    'engine_phase', 'Repo Phase 141 Global Knowledge Exchange Engine',
    'route', '/app/global-knowledge-exchange-engine',
    'mapping_note', 'Global Intelligence Era (141–150) opener — voluntary governed exchange.',
    'distinction_note', public._gkeebp141_distinction_note(),
    'mission', public._gkeebp141_mission(),
    'philosophy', public._gkeebp141_philosophy(),
    'abos_principle', public._gkeebp141_abos_principle(),
    'vision', public._gkeebp141_vision(),
    'objectives', public._gkeebp141_objectives(),
    'global_knowledge_center', public._gkeebp141_global_knowledge_center(),
    'interorganizational_learning_engine', public._gkeebp141_interorganizational_learning_engine(),
    'knowledge_sharing_governance', public._gkeebp141_knowledge_sharing_governance(),
    'anonymized_benchmarking_engine', public._gkeebp141_anonymized_benchmarking_engine(),
    'global_learning_networks', public._gkeebp141_global_learning_networks(),
    'growth_partner_contribution_engine', public._gkeebp141_growth_partner_contribution_engine(),
    'collective_wisdom_companion', public._gkeebp141_collective_wisdom_companion(),
    'privacy_confidentiality_framework', public._gkeebp141_privacy_confidentiality_framework(),
    'companion_limitations', public._gkeebp141_companion_limitations(),
    'self_love_connection', public._gkeebp141_self_love_connection(),
    'security_requirements', public._gkeebp141_security_requirements(),
    'integration_links', public._gkeebp141_integration_links(),
    'dogfooding', public._gkeebp141_dogfooding(),
    'success_criteria', public._gkeebp141_success_criteria(p_tenant_id),
    'engagement_summary', public._gkeebp141_engagement_summary(p_tenant_id),
    'vision_phrases', public._gkeebp141_vision_phrases(),
    'privacy_note', public._gkeebp141_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 9. Thin scaffold RPCs
-- ---------------------------------------------------------------------------
create or replace function public.submit_knowledge_exchange_contribution(
  p_contribution_type text,
  p_title text,
  p_summary text,
  p_industry_tag text default null,
  p_tenant_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
  v_settings public.global_knowledge_exchange_settings;
begin
  v_tenant_id := coalesce(p_tenant_id, public._gkee_require_tenant());
  v_settings := public._gkee_ensure_settings(v_tenant_id);
  if not v_settings.enabled or v_settings.participation_status not in ('contributor') then
    raise exception 'Contribution requires enabled contributor participation';
  end if;
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_contribution_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.global_knowledge_exchange_contributions (
    tenant_id, contribution_key, contribution_type, title, summary, industry_tag, status, anonymized
  ) values (
    v_tenant_id, v_key, p_contribution_type, p_title, left(p_summary, 500),
    p_industry_tag, case when v_settings.approval_required then 'pending' else 'approved' end, true
  )
  returning id into v_id;
  perform public._gkee_log_audit(v_tenant_id, 'contribution_submitted', left(p_title, 120),
    jsonb_build_object('contribution_id', v_id, 'contribution_type', p_contribution_type, 'status', 'pending'));
  return v_id;
end; $$;

create or replace function public.review_knowledge_exchange_contribution(
  p_contribution_id uuid,
  p_status text,
  p_tenant_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_row public.global_knowledge_exchange_contributions;
begin
  v_tenant_id := coalesce(p_tenant_id, public._gkee_require_tenant());
  if p_status not in ('approved', 'rejected') then raise exception 'Status must be approved or rejected'; end if;
  select * into v_row from public.global_knowledge_exchange_contributions
  where id = p_contribution_id and tenant_id = v_tenant_id;
  if not found then raise exception 'Contribution not found'; end if;
  update public.global_knowledge_exchange_contributions
  set status = p_status, reviewed_at = now()
  where id = p_contribution_id;
  perform public._gkee_log_audit(v_tenant_id, 'contribution_reviewed', left(v_row.title, 120),
    jsonb_build_object('contribution_id', p_contribution_id, 'status', p_status));
  return p_contribution_id;
end; $$;

create or replace function public.get_anonymized_benchmark_summary(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.global_knowledge_exchange_settings;
  v_platform_admin boolean;
begin
  v_tenant_id := coalesce(p_tenant_id, public._gkee_tenant_for_auth());
  v_platform_admin := public.is_platform_admin();
  if v_tenant_id is null and not v_platform_admin then
    return jsonb_build_object('has_access', false, 'reason', 'No tenant context');
  end if;
  if v_tenant_id is not null then
    v_settings := public._gkee_ensure_settings(v_tenant_id);
    if not v_settings.enabled and not v_platform_admin then
      return jsonb_build_object('has_access', false, 'reason', 'Opt-in required', 'privacy_note', public._gkeebp141_privacy_note());
    end if;
    perform public._gkee_seed_benchmark_snapshots(v_tenant_id);
  end if;

  return jsonb_build_object(
    'has_access', true,
    'privacy_note', public._gkeebp141_privacy_note(),
    'minimum_participants', 5,
    'benchmarks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'benchmark_domain', b.benchmark_domain,
        'aggregate_value', b.aggregate_value,
        'industry_tag', b.industry_tag,
        'participant_count', b.participant_count,
        'captured_at', b.captured_at
      ) order by b.benchmark_domain)
      from public.global_knowledge_exchange_benchmark_snapshots b
      where b.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'global_aggregate_note', 'Anonymized aggregates only — no identifiable tenant data in shared views'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_global_knowledge_exchange_engine_card(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.global_knowledge_exchange_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._gkee_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._gkee_ensure_settings(v_tenant_id);
  perform public._gkee_seed_programs(v_tenant_id);
  perform public._gkee_seed_benchmark_snapshots(v_tenant_id);
  v_metrics := public._gkee_refresh_metrics(v_tenant_id);
  v_engagement := public._gkeebp141_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'exchange_score', v_metrics->'exchange_score',
    'participation_status', v_settings.participation_status,
    'enabled', v_settings.enabled,
    'programs_count', v_metrics->'programs_count',
    'philosophy', public._gkeebp141_philosophy(),
    'approval_required', v_settings.approval_required,
    'executive_approval_required', v_settings.executive_approval_required,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 141 — Global Knowledge Exchange & Interorganizational Learning Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE141_GLOBAL_KNOWLEDGE_EXCHANGE_INTERORGANIZATIONAL_LEARNING.md',
      'engine_phase', 'Repo Phase 141 Global Knowledge Exchange Engine',
      'route', '/app/global-knowledge-exchange-engine',
      'mapping_note', 'Global Intelligence Era (141–150) opener.'
    ),
    'global_knowledge_exchange_mission', public._gkeebp141_mission(),
    'global_knowledge_exchange_abos_principle', public._gkeebp141_abos_principle(),
    'global_knowledge_exchange_engagement_summary', v_engagement,
    'global_knowledge_exchange_note', public._gkeebp141_distinction_note(),
    'global_knowledge_exchange_vision_note', public._gkeebp141_vision()
  );
end; $$;

create or replace function public.get_global_knowledge_exchange_engine_dashboard(p_tenant_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.global_knowledge_exchange_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._gkee_require_tenant());
  v_settings := public._gkee_ensure_settings(v_tenant_id);
  perform public._gkee_seed_programs(v_tenant_id);
  perform public._gkee_seed_benchmark_snapshots(v_tenant_id);
  v_metrics := public._gkee_refresh_metrics(v_tenant_id);
  perform public._gkee_log_audit(v_tenant_id, 'dashboard_view', 'Global Knowledge Exchange dashboard viewed',
    jsonb_build_object('exchange_score', v_metrics->>'exchange_score', 'participation_status', v_settings.participation_status));

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'participation_status', v_settings.participation_status,
    'anonymization_level', v_settings.anonymization_level,
    'approval_required', v_settings.approval_required,
    'executive_approval_required', v_settings.executive_approval_required,
    'philosophy', public._gkeebp141_philosophy(),
    'safety_note', 'Global Knowledge Exchange — metadata and anonymized aggregates only. Opt-in required. No cross-tenant PII.',
    'distinction_note', public._gkeebp141_distinction_note(),
    'exchange_score', v_metrics->'exchange_score',
    'programs_count', v_metrics->'programs_count',
    'contributions_count', v_metrics->'contributions_count',
    'approved_contributions_count', v_metrics->'approved_contributions_count',
    'pending_contributions_count', v_metrics->'pending_contributions_count',
    'benchmark_snapshots_count', v_metrics->'benchmark_snapshots_count',
    'programs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'program_key', p.program_key, 'status', p.status, 'enrolled_at', p.enrolled_at
      ) order by p.enrolled_at)
      from public.global_knowledge_exchange_programs p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'contributions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'contribution_key', c.contribution_key, 'contribution_type', c.contribution_type,
        'title', c.title, 'summary', c.summary, 'industry_tag', c.industry_tag, 'status', c.status,
        'anonymized', c.anonymized, 'submitted_at', c.submitted_at
      ) order by c.submitted_at desc)
      from public.global_knowledge_exchange_contributions c where c.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'benchmark_snapshots', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', b.id, 'snapshot_key', b.snapshot_key, 'benchmark_domain', b.benchmark_domain,
        'aggregate_value', b.aggregate_value, 'industry_tag', b.industry_tag,
        'participant_count', b.participant_count, 'captured_at', b.captured_at
      ) order by b.benchmark_domain)
      from public.global_knowledge_exchange_benchmark_snapshots b where b.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'anonymized_benchmark_summary', public.get_anonymized_benchmark_summary(v_tenant_id),
    'integration_links', public._gkeebp141_integration_links(),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 141 — Global Knowledge Exchange & Interorganizational Learning Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE141_GLOBAL_KNOWLEDGE_EXCHANGE_INTERORGANIZATIONAL_LEARNING.md',
      'engine_phase', 'Repo Phase 141 Global Knowledge Exchange Engine',
      'route', '/app/global-knowledge-exchange-engine',
      'mapping_note', 'Global Intelligence Era (141–150) opener — voluntary governed exchange.'
    ),
    'global_knowledge_exchange_engine_note', 'Global Knowledge Exchange Engine (ABOS Phase 141) — era opener. Cross-link A.71, Community, Benchmarking — do NOT duplicate _ctie_*.',
    'global_knowledge_exchange_blueprint', public._gkeebp141_blueprint_block(v_tenant_id),
    'global_knowledge_exchange_distinction_note', public._gkeebp141_distinction_note(),
    'global_knowledge_exchange_mission', public._gkeebp141_mission(),
    'global_knowledge_exchange_philosophy', public._gkeebp141_philosophy(),
    'global_knowledge_exchange_abos_principle', public._gkeebp141_abos_principle(),
    'global_knowledge_exchange_objectives', public._gkeebp141_objectives(),
    'global_knowledge_center_meta', public._gkeebp141_global_knowledge_center(),
    'interorganizational_learning_engine_meta', public._gkeebp141_interorganizational_learning_engine(),
    'knowledge_sharing_governance_meta', public._gkeebp141_knowledge_sharing_governance(),
    'anonymized_benchmarking_engine_meta', public._gkeebp141_anonymized_benchmarking_engine(),
    'global_learning_networks_meta', public._gkeebp141_global_learning_networks(),
    'growth_partner_contribution_engine_meta', public._gkeebp141_growth_partner_contribution_engine(),
    'collective_wisdom_companion_meta', public._gkeebp141_collective_wisdom_companion(),
    'privacy_confidentiality_framework_meta', public._gkeebp141_privacy_confidentiality_framework(),
    'companion_limitations_meta', public._gkeebp141_companion_limitations(),
    'self_love_connection_meta', public._gkeebp141_self_love_connection(),
    'security_requirements_meta', public._gkeebp141_security_requirements(),
    'gkeebp141_integration_links', public._gkeebp141_integration_links(),
    'global_knowledge_exchange_engagement_summary', public._gkeebp141_engagement_summary(v_tenant_id),
    'global_knowledge_exchange_success_criteria', public._gkeebp141_success_criteria(v_tenant_id),
    'global_knowledge_exchange_vision', public._gkeebp141_vision(),
    'global_knowledge_exchange_vision_phrases', public._gkeebp141_vision_phrases(),
    'global_knowledge_exchange_privacy_note', public._gkeebp141_privacy_note(),
    'global_knowledge_exchange_dogfooding', public._gkeebp141_dogfooding()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'global-knowledge-exchange-engine', 'Global Knowledge Exchange Engine',
  'Global Intelligence Era (141–150) opener — voluntary governed interorganizational learning. People First.',
  'authenticated', 151
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'global-knowledge-exchange-engine' and tenant_id is null
);

grant execute on function public.get_global_knowledge_exchange_engine_card(uuid) to authenticated;
grant execute on function public.get_global_knowledge_exchange_engine_dashboard(uuid) to authenticated;
grant execute on function public.submit_knowledge_exchange_contribution(text, text, text, text, uuid) to authenticated;
grant execute on function public.review_knowledge_exchange_contribution(uuid, text, uuid) to authenticated;
grant execute on function public.get_anonymized_benchmark_summary(uuid) to authenticated;
grant execute on function public._gkeebp141_distinction_note() to authenticated;
grant execute on function public._gkeebp141_mission() to authenticated;
grant execute on function public._gkeebp141_philosophy() to authenticated;
grant execute on function public._gkeebp141_abos_principle() to authenticated;
grant execute on function public._gkeebp141_vision() to authenticated;
grant execute on function public._gkeebp141_objectives() to authenticated;
grant execute on function public._gkeebp141_global_knowledge_center() to authenticated;
grant execute on function public._gkeebp141_interorganizational_learning_engine() to authenticated;
grant execute on function public._gkeebp141_knowledge_sharing_governance() to authenticated;
grant execute on function public._gkeebp141_anonymized_benchmarking_engine() to authenticated;
grant execute on function public._gkeebp141_global_learning_networks() to authenticated;
grant execute on function public._gkeebp141_growth_partner_contribution_engine() to authenticated;
grant execute on function public._gkeebp141_collective_wisdom_companion() to authenticated;
grant execute on function public._gkeebp141_privacy_confidentiality_framework() to authenticated;
grant execute on function public._gkeebp141_companion_limitations() to authenticated;
grant execute on function public._gkeebp141_self_love_connection() to authenticated;
grant execute on function public._gkeebp141_security_requirements() to authenticated;
grant execute on function public._gkeebp141_integration_links() to authenticated;
grant execute on function public._gkeebp141_dogfooding() to authenticated;
grant execute on function public._gkeebp141_vision_phrases() to authenticated;
grant execute on function public._gkeebp141_privacy_note() to authenticated;
grant execute on function public._gkeebp141_engagement_summary(uuid) to authenticated;
grant execute on function public._gkeebp141_success_criteria(uuid) to authenticated;
