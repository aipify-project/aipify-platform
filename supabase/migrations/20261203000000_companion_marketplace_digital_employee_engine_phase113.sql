-- Phase 113 — Companion Marketplace & Digital Employee Engine
-- Distinct from Skills Marketplace Blueprint 112 (/app/marketplace), Skill Store 63, Commerce Companion 110.
-- Companions are trusted digital coworkers — NOT chatbots. Humans remain accountable.
-- Helpers: _cmpm_* (engine), _cmbp113_* (blueprint — never collide with _mkp_*, _sembp112_*, _ccom_*).

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
    'multi_store_orchestration', 'aipify_core_platform', 'multi_tenant_architecture',
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
    'supplier_intelligence', 'global_commerce_expansion', 'commerce_companion',
    'companion_marketplace'
  )
);

-- ---------------------------------------------------------------------------
-- 1. companion_marketplace_settings
-- ---------------------------------------------------------------------------
create table if not exists public.companion_marketplace_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  marketplace_enabled boolean not null default true,
  default_governance_level int not null default 2 check (default_governance_level between 1 and 5),
  enterprise_center_enabled boolean not null default false,
  human_approval_required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.companion_marketplace_settings enable row level security;
revoke all on public.companion_marketplace_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. companion_marketplace_catalog (global + tenant custom — metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.companion_marketplace_catalog (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete cascade,
  catalog_key text not null,
  category text not null check (category in (
    'executive', 'support', 'sales', 'growth_partner', 'commerce', 'knowledge',
    'hr', 'compliance', 'operations', 'industry', 'custom_enterprise'
  )),
  name text not null,
  role_title text not null,
  description text not null,
  primary_capabilities jsonb not null default '[]'::jsonb,
  supported_languages jsonb not null default '["en"]'::jsonb,
  department_assignment text,
  version text not null default '1.0.0',
  creator_info jsonb not null default '{}'::jsonb,
  knowledge_requirements jsonb not null default '[]'::jsonb,
  required_integrations jsonb not null default '[]'::jsonb,
  risk_classification text not null default 'moderate' check (
    risk_classification in ('low', 'moderate', 'high', 'critical')
  ),
  recommended_org_size text,
  maturity_level text not null default 'pilot' check (
    maturity_level in ('draft', 'testing', 'pilot', 'approved', 'active', 'under_review', 'deprecated', 'retired', 'historical_archive')
  ),
  customer_rating numeric(3,2),
  usage_statistics jsonb not null default '{}'::jsonb,
  release_notes text,
  governance_status text not null default 'pending_review',
  audit_status text not null default 'not_audited',
  approval_status text not null default 'pending',
  profile_metadata jsonb not null default '{}'::jsonb,
  is_global boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, catalog_key)
);

create index if not exists companion_marketplace_catalog_category_idx
  on public.companion_marketplace_catalog (category, is_global);

alter table public.companion_marketplace_catalog enable row level security;
revoke all on public.companion_marketplace_catalog from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. companion_marketplace_deployments
-- ---------------------------------------------------------------------------
create table if not exists public.companion_marketplace_deployments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  catalog_id uuid not null references public.companion_marketplace_catalog (id) on delete restrict,
  companion_name text not null,
  assigned_team text,
  status text not null default 'draft' check (status in (
    'draft', 'testing', 'pilot', 'approved', 'active', 'under_review',
    'deprecated', 'retired', 'historical_archive'
  )),
  governance_level int not null default 2 check (governance_level between 1 and 5),
  owner_user_id uuid references public.users (id) on delete set null,
  employee_type text check (employee_type in (
    'assistant', 'advisor', 'analyst', 'coordinator', 'knowledge',
    'support', 'executive', 'growth_employee'
  )),
  usage_frequency text,
  satisfaction_score numeric(4,2),
  escalation_rate numeric(5,2),
  security_status text not null default 'pending_review',
  version_status text not null default 'current',
  deployment_metadata jsonb not null default '{}'::jsonb,
  activated_at timestamptz,
  deactivated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists companion_marketplace_deployments_tenant_idx
  on public.companion_marketplace_deployments (tenant_id, status);

alter table public.companion_marketplace_deployments enable row level security;
revoke all on public.companion_marketplace_deployments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. companion_marketplace_health_snapshots
-- ---------------------------------------------------------------------------
create table if not exists public.companion_marketplace_health_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_quality numeric(5,2),
  escalation_frequency numeric(5,2),
  response_accuracy numeric(5,2),
  user_satisfaction numeric(5,2),
  adoption_rate numeric(5,2),
  support_reduction numeric(5,2),
  workflow_efficiency numeric(5,2),
  knowledge_utilization numeric(5,2),
  policy_compliance numeric(5,2),
  error_recovery_success numeric(5,2),
  aggregate_score numeric(5,2),
  metrics_metadata jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now()
);

alter table public.companion_marketplace_health_snapshots enable row level security;
revoke all on public.companion_marketplace_health_snapshots from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. companion_marketplace_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.companion_marketplace_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.companion_marketplace_audit_logs enable row level security;
revoke all on public.companion_marketplace_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Engine helpers (_cmpm_)
-- ---------------------------------------------------------------------------
create or replace function public._cmpm_tenant_for_auth()
returns uuid language plpgsql security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._cmpm_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._cmpm_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._cmpm_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.companion_marketplace_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._cmpm_ensure_settings(p_tenant_id uuid)
returns public.companion_marketplace_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.companion_marketplace_settings;
begin
  insert into public.companion_marketplace_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.companion_marketplace_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._cmpm_seed_global_catalog()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_marketplace_catalog (
    tenant_id, catalog_key, category, name, role_title, description,
    primary_capabilities, supported_languages, department_assignment, version,
    creator_info, knowledge_requirements, required_integrations, risk_classification,
    recommended_org_size, maturity_level, governance_status, audit_status, approval_status, is_global
  )
  select null, v.key, v.cat, v.name, v.role, v.item_description,
    v.caps, v.langs, v.dept, v.ver, v.creator, v.knowledge, v.integrations,
    v.risk, v.org_size, v.maturity, v.gov, v.audit, v.approval, true
  from (values
    ('cmpm.executive_briefing', 'executive', 'Executive Briefing Companion', 'Executive Advisor',
      'Trusted executive Companion for briefings, priorities, and leadership visibility — humans decide.',
      '["morning_briefings","priority_synthesis","executive_visibility"]'::jsonb, '["en","no","sv","da"]'::jsonb,
      'Executive', '1.0.0', '{"creator":"Aipify","type":"official"}'::jsonb,
      '["approved_business_context"]'::jsonb, '["command_center"]'::jsonb, 'moderate', '50+', 'approved', 'approved', 'audited', 'approved'),
    ('cmpm.support_companion', 'support', 'Support Operations Companion', 'Support Coordinator',
      'Digital coworker for support triage, knowledge lookup, and escalation preparation — never auto-replies without governance.',
      '["triage_assist","knowledge_lookup","escalation_prep"]'::jsonb, '["en","no"]'::jsonb,
      'Support', '1.0.0', '{"creator":"Aipify","type":"official"}'::jsonb,
      '["support_knowledge_items","business_dna"]'::jsonb, '["support_ai_engine"]'::jsonb, 'moderate', '10+', 'approved', 'approved', 'audited', 'approved'),
    ('cmpm.sales_companion', 'sales', 'Sales Expert Companion', 'Sales Advisor',
      'Prepares pipeline context, follow-up drafts, and meeting prep — humans send every customer communication.',
      '["pipeline_context","follow_up_prep","meeting_prep"]'::jsonb, '["en"]'::jsonb,
      'Sales', '1.0.0', '{"creator":"Aipify","type":"official"}'::jsonb,
      '["crm_metadata"]'::jsonb, '["sales_expert_engine"]'::jsonb, 'moderate', '5+', 'pilot', 'pending_review', 'not_audited', 'pending'),
    ('cmpm.growth_partner', 'growth_partner', 'Growth Partner Companion', 'Growth Employee',
      'Partner program alignment, certification context, and expansion recommendations — Growth Partner Phase 107 cross-link.',
      '["partner_alignment","expansion_recommendations"]'::jsonb, '["en","no","sv","da"]'::jsonb,
      'Growth', '1.0.0', '{"creator":"Aipify","type":"official"}'::jsonb,
      '["partner_catalog_metadata"]'::jsonb, '["growth_partner"]'::jsonb, 'low', 'any', 'approved', 'approved', 'audited', 'approved'),
    ('cmpm.commerce_companion', 'commerce', 'Commerce Stewardship Companion', 'Commerce Advisor',
      'Holistic commerce visibility Companion — cross-link Commerce Companion Phase 110; domain modules remain authoritative.',
      '["portfolio_visibility","stewardship_briefings"]'::jsonb, '["en"]'::jsonb,
      'Commerce', '1.0.0', '{"creator":"Aipify","type":"official"}'::jsonb,
      '["commerce_metadata"]'::jsonb, '["commerce_companion"]'::jsonb, 'moderate', 'any', 'active', 'approved', 'audited', 'approved'),
    ('cmpm.knowledge_companion', 'knowledge', 'Knowledge Center Companion', 'Knowledge Coordinator',
      'Internal knowledge navigation, onboarding paths, and gap detection — Employee Knowledge Engine cross-link.',
      '["knowledge_navigation","onboarding_paths","gap_detection"]'::jsonb, '["en","no","sv","da"]'::jsonb,
      'Knowledge', '1.0.0', '{"creator":"Aipify","type":"official"}'::jsonb,
      '["employee_knowledge_items","knowledge_center"]'::jsonb, '["knowledge_center_engine"]'::jsonb, 'low', '10+', 'approved', 'approved', 'audited', 'approved'),
    ('cmpm.hr_companion', 'hr', 'HR Onboarding Companion', 'HR Coordinator',
      'Onboarding checklists, policy guidance, and role-based knowledge — metadata only, no PII storage.',
      '["onboarding_checklists","policy_guidance"]'::jsonb, '["en"]'::jsonb,
      'Human Resources', '1.0.0', '{"creator":"Aipify","type":"official"}'::jsonb,
      '["employee_knowledge","onboarding_paths"]'::jsonb, '["employee_knowledge_engine"]'::jsonb, 'moderate', '25+', 'pilot', 'pending_review', 'not_audited', 'pending'),
    ('cmpm.compliance_companion', 'compliance', 'Compliance Steward Companion', 'Compliance Advisor',
      'Policy compliance monitoring, audit preparation, and governance alerts — Trust & Action Phase 30 cross-link.',
      '["policy_monitoring","audit_prep","governance_alerts"]'::jsonb, '["en"]'::jsonb,
      'Compliance', '1.0.0', '{"creator":"Aipify","type":"official"}'::jsonb,
      '["governance_policies"]'::jsonb, '["approvals","marketplace_governance"]'::jsonb, 'high', '50+', 'testing', 'pending_review', 'not_audited', 'pending'),
    ('cmpm.operations_companion', 'operations', 'Operations Coordinator Companion', 'Operations Coordinator',
      'Workflow awareness, task follow-up, and operational handoffs — Workflow Orchestration A.42 cross-link.',
      '["workflow_awareness","task_followup","operational_handoffs"]'::jsonb, '["en"]'::jsonb,
      'Operations', '1.0.0', '{"creator":"Aipify","type":"official"}'::jsonb,
      '["workflow_templates"]'::jsonb, '["workflow_orchestration_engine"]'::jsonb, 'moderate', '10+', 'approved', 'approved', 'audited', 'approved'),
    ('cmpm.industry_companion', 'industry', 'Industry Pack Companion', 'Industry Advisor',
      'Industry-specific Companion experience — Industry Packs Blueprint Phase 111 cross-link.',
      '["industry_context","vertical_playbooks"]'::jsonb, '["en","no","sv","da"]'::jsonb,
      'Industry', '1.0.0', '{"creator":"Aipify","type":"official"}'::jsonb,
      '["industry_pack_metadata"]'::jsonb, '["business_packs_foundation_engine"]'::jsonb, 'moderate', 'any', 'pilot', 'pending_review', 'not_audited', 'pending'),
    ('cmpm.custom_enterprise', 'custom_enterprise', 'Custom Enterprise Companion', 'Enterprise Digital Employee',
      'Tenant-configured enterprise Companion — Enterprise Digital Employee Center provisioning with enhanced controls.',
      '["custom_workflows","enterprise_governance","executive_visibility"]'::jsonb, '["en"]'::jsonb,
      'Enterprise', '1.0.0', '{"creator":"Tenant","type":"custom"}'::jsonb,
      '["approved_enterprise_sources"]'::jsonb, '["integration_engine","api_platform_engine"]'::jsonb, 'high', '100+', 'draft', 'restricted', 'not_audited', 'pending')
  ) as v(key, cat, name, role, item_description, caps, langs, dept, ver, creator, knowledge, integrations, risk, org_size, maturity, gov, audit, approval)
  on conflict (tenant_id, catalog_key) do nothing;
end; $$;

create or replace function public._cmpm_seed_tenant_deployments(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.companion_marketplace_deployments where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  perform public._cmpm_seed_global_catalog();

  insert into public.companion_marketplace_deployments (
    tenant_id, catalog_id, companion_name, assigned_team, status, governance_level,
    employee_type, usage_frequency, satisfaction_score, escalation_rate, security_status, version_status
  )
  select p_tenant_id, c.id, c.name, c.department_assignment,
    case c.catalog_key
      when 'cmpm.executive_briefing' then 'active'
      when 'cmpm.support_companion' then 'pilot'
      when 'cmpm.knowledge_companion' then 'approved'
      else 'testing'
    end,
    case c.risk_classification when 'high' then 3 when 'critical' then 5 else 2 end,
    case c.category
      when 'executive' then 'executive'
      when 'support' then 'support'
      when 'sales' then 'advisor'
      when 'growth_partner' then 'growth_employee'
      when 'commerce' then 'advisor'
      when 'knowledge' then 'knowledge'
      when 'hr' then 'coordinator'
      when 'compliance' then 'advisor'
      when 'operations' then 'coordinator'
      when 'industry' then 'analyst'
      when 'custom_enterprise' then 'assistant'
      else 'assistant'
    end,
    'weekly', 4.2, 0.08, 'reviewed', 'current'
  from public.companion_marketplace_catalog c
  where c.is_global = true
    and c.catalog_key in ('cmpm.executive_briefing', 'cmpm.support_companion', 'cmpm.knowledge_companion');
end; $$;

create or replace function public._cmpm_seed_health_snapshot(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.companion_marketplace_health_snapshots where tenant_id = p_tenant_id) then
    return;
  end if;

  insert into public.companion_marketplace_health_snapshots (
    tenant_id, recommendation_quality, escalation_frequency, response_accuracy,
    user_satisfaction, adoption_rate, support_reduction, workflow_efficiency,
    knowledge_utilization, policy_compliance, error_recovery_success, aggregate_score,
    metrics_metadata
  ) values (
    p_tenant_id, 82.5, 12.0, 88.0, 4.3, 65.0, 18.0, 74.0, 71.0, 95.0, 89.0, 78.5,
    '{"privacy_note":"Aggregate metadata only — no raw chat or PII","source":"companion_marketplace_health_snapshots"}'::jsonb
  );
end; $$;

create or replace function public._cmpm_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_deployments int;
  v_active int;
  v_catalog int;
  v_health public.companion_marketplace_health_snapshots;
  v_score numeric;
begin
  select count(*) into v_deployments from public.companion_marketplace_deployments where tenant_id = p_tenant_id;
  select count(*) into v_active from public.companion_marketplace_deployments
  where tenant_id = p_tenant_id and status in ('active', 'approved', 'pilot');
  select count(*) into v_catalog from public.companion_marketplace_catalog
  where is_global = true or tenant_id = p_tenant_id;

  select * into v_health from public.companion_marketplace_health_snapshots
  where tenant_id = p_tenant_id order by captured_at desc limit 1;

  v_score := coalesce(v_health.aggregate_score, least(100, round(60 + v_active * 5 + v_catalog * 0.5, 1)));

  return jsonb_build_object(
    'marketplace_score', v_score,
    'deployments_count', v_deployments,
    'active_deployments_count', v_active,
    'catalog_items_count', v_catalog,
    'recommendation_quality', coalesce(v_health.recommendation_quality, 0),
    'escalation_frequency', coalesce(v_health.escalation_frequency, 0),
    'user_satisfaction', coalesce(v_health.user_satisfaction, 0),
    'adoption_rate', coalesce(v_health.adoption_rate, 0),
    'policy_compliance', coalesce(v_health.policy_compliance, 0)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Blueprint helpers (_cmbp113_)
-- ---------------------------------------------------------------------------
create or replace function public._cmbp113_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 113 — Companion Marketplace & Digital Employee Engine at /app/companion-marketplace. Unified surface: Companion Marketplace + Digital Employee Engine + Enterprise Digital Employee Center. Distinct from Skills Marketplace Blueprint 112 /app/marketplace (_mkp_*, _sembp112_*); Skill Store Phase 63 /app/skills; Commerce Companion Phase 110 /app/commerce-companion (_ccom_*); Companion Identity A.84 /app/companion-identity-engine; Industry Packs Blueprint 111 /app/business-packs-foundation-engine; Marketplace Governance Phase 90 /app/marketplace-governance; Trust & Action Phase 30 /app/approvals; Proactive Companion A.79 /app/proactive-companion-engine. Helpers use _cmbp113_* — never collide with _mkp_*, _sembp112_*, _ccom_*.';
$$;

create or replace function public._cmbp113_mission()
returns text language sql immutable as $$
  select 'Trusted Companion Marketplace and Digital Employee provisioning — digital coworkers that augment teams, never replace human accountability.';
$$;

create or replace function public._cmbp113_philosophy()
returns text language sql immutable as $$
  select 'People First. Technology Second. Companionship before replacement. Companions are trusted digital coworkers — NOT chatbots. Humans remain accountable.';
$$;

create or replace function public._cmbp113_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Companion Marketplace deploys governed digital employees with explicit permissions, escalation paths, and audit. Aipify informs and prepares; humans approve activation.';
$$;

create or replace function public._cmbp113_vision()
returns text language sql immutable as $$
  select 'Every team has trusted digital coworkers — and humans remain in charge.';
$$;

create or replace function public._cmbp113_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'trusted_companions', 'label', 'Trusted Companions', 'emoji', '🌹', 'description', 'Browse governed Companion profiles — metadata transparent, not generic AI bots'),
    jsonb_build_object('key', 'digital_employees', 'label', 'Digital Employees', 'emoji', '🦉', 'description', 'Role identity, permissions, escalation — never autonomous decision-makers'),
    jsonb_build_object('key', 'governed_deployment', 'label', 'Governed deployment', 'emoji', '🔔', 'description', 'Ten-step flow with human approval gates — no auto-deploy high-risk Companions'),
    jsonb_build_object('key', 'enterprise_center', 'label', 'Enterprise Digital Employee Center', 'emoji', '🦉', 'description', 'Provision, audit, 2FA enforcement, governance alerts — executive visibility'),
    jsonb_build_object('key', 'health_monitoring', 'label', 'Health monitoring', 'emoji', '🌹', 'description', 'Recommendation quality, adoption, policy compliance — aggregate metadata only'),
    jsonb_build_object('key', 'collaboration_rules', 'label', 'Collaboration rules', 'emoji', '🔔', 'description', 'Support+Knowledge, Executive+Analytics — explicit governance approval required')
  );
$$;

create or replace function public._cmbp113_categories()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion Marketplace categories — metadata scaffolds for discovery and deployment.',
    'categories', jsonb_build_array(
      jsonb_build_object('key', 'executive', 'label', 'Executive', 'description', 'Briefings, priorities, leadership visibility'),
      jsonb_build_object('key', 'support', 'label', 'Support', 'description', 'Triage assist, knowledge lookup, escalation prep'),
      jsonb_build_object('key', 'sales', 'label', 'Sales', 'description', 'Pipeline context, follow-up prep — humans send communications'),
      jsonb_build_object('key', 'growth_partner', 'label', 'Growth Partner', 'description', 'Partner alignment — Phase 107 cross-link'),
      jsonb_build_object('key', 'commerce', 'label', 'Commerce', 'description', 'Commerce stewardship — Phase 110 cross-link'),
      jsonb_build_object('key', 'knowledge', 'label', 'Knowledge', 'description', 'Knowledge navigation — EKE and KC cross-links'),
      jsonb_build_object('key', 'hr', 'label', 'HR', 'description', 'Onboarding and policy guidance — metadata only'),
      jsonb_build_object('key', 'compliance', 'label', 'Compliance', 'description', 'Policy monitoring — Trust & Action cross-link'),
      jsonb_build_object('key', 'operations', 'label', 'Operations', 'description', 'Workflow awareness — A.42 cross-link'),
      jsonb_build_object('key', 'industry', 'label', 'Industry', 'description', 'Vertical specialization — Phase 111 cross-link'),
      jsonb_build_object('key', 'custom_enterprise', 'label', 'Custom Enterprise Companions', 'description', 'Tenant-configured enterprise digital employees')
    )
  );
$$;

create or replace function public._cmbp113_profile_fields()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'fields', jsonb_build_array(
      'name', 'role', 'description', 'primary_capabilities', 'supported_languages',
      'department_assignment', 'version', 'creator_info', 'knowledge_requirements',
      'required_integrations', 'risk_classification', 'recommended_org_size',
      'maturity_level', 'customer_rating', 'usage_statistics', 'release_notes',
      'governance_status', 'audit_status', 'approval_status'
    ),
    'boundary_note', 'Profile metadata only — no PII, no raw chat transcripts.'
  );
$$;

create or replace function public._cmbp113_digital_employee_model()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Digital Employee model — augment teams; never autonomous decision-makers.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'role_identity', 'label', 'Role Identity', 'description', 'Named role with clear scope — not impersonation'),
      jsonb_build_object('key', 'organizational_context', 'label', 'Organizational Context', 'description', 'Team, department, and governance level assignment'),
      jsonb_build_object('key', 'responsibilities', 'label', 'Responsibilities', 'description', 'Declared capabilities — bounded by permissions'),
      jsonb_build_object('key', 'permission_boundaries', 'label', 'Permission Boundaries', 'description', 'Least privilege — Trust & Action Phase 30 cross-link'),
      jsonb_build_object('key', 'escalation_paths', 'label', 'Escalation Paths', 'description', 'Human escalation when confidence low or risk high'),
      jsonb_build_object('key', 'performance_indicators', 'label', 'Performance Indicators', 'description', 'Aggregate health metrics — metadata only'),
      jsonb_build_object('key', 'audit_trail', 'label', 'Audit Trail', 'description', 'Immutable companion_marketplace_audit_logs'),
      jsonb_build_object('key', 'learning_restrictions', 'label', 'Learning Restrictions', 'description', 'Approved sources only — Learning Engine assisted mode'),
      jsonb_build_object('key', 'governance_controls', 'label', 'Governance Controls', 'description', 'Governance layers 1–5 — human approval gates')
    )
  );
$$;

create or replace function public._cmbp113_employee_types()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'types', jsonb_build_array(
      jsonb_build_object('key', 'assistant', 'label', 'Assistant', 'description', 'Task support and preparation — human executes'),
      jsonb_build_object('key', 'advisor', 'label', 'Advisor', 'description', 'Recommendations with reasoning — human decides'),
      jsonb_build_object('key', 'analyst', 'label', 'Analyst', 'description', 'Pattern and metric synthesis — metadata only'),
      jsonb_build_object('key', 'coordinator', 'label', 'Coordinator', 'description', 'Handoffs and workflow awareness'),
      jsonb_build_object('key', 'knowledge', 'label', 'Knowledge', 'description', 'Knowledge navigation and gap detection'),
      jsonb_build_object('key', 'support', 'label', 'Support', 'description', 'Support triage assist — ASO cross-link'),
      jsonb_build_object('key', 'executive', 'label', 'Executive', 'description', 'Executive visibility and briefing prep'),
      jsonb_build_object('key', 'growth_employee', 'label', 'Growth Employee', 'description', 'Partner and expansion alignment — Phase 107')
    )
  );
$$;

create or replace function public._cmbp113_deployment_flow()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Deployment flow — humans approve activation; no auto-deploy high-risk Companions.',
    'steps', jsonb_build_array(
      jsonb_build_object('order', 1, 'key', 'browse', 'label', 'Browse', 'description', 'Companion Marketplace categories and catalog'),
      jsonb_build_object('order', 2, 'key', 'review_profile', 'label', 'Review profile', 'description', 'Capabilities, risk, maturity, creator info'),
      jsonb_build_object('order', 3, 'key', 'review_permissions', 'label', 'Review permissions', 'description', 'Required integrations and permission boundaries'),
      jsonb_build_object('order', 4, 'key', 'review_governance', 'label', 'Review governance', 'description', 'Governance layer assignment — layers 1–5'),
      jsonb_build_object('order', 5, 'key', 'assign_scope', 'label', 'Assign scope', 'description', 'Team, department, owner assignment'),
      jsonb_build_object('order', 6, 'key', 'configure_integrations', 'label', 'Configure integrations', 'description', 'Connect required modules — read-only first'),
      jsonb_build_object('order', 7, 'key', 'define_escalation', 'label', 'Define escalation', 'description', 'Escalation paths and human contacts'),
      jsonb_build_object('order', 8, 'key', 'activate', 'label', 'Activate', 'description', 'Human approval required — activate_companion_marketplace_deployment'),
      jsonb_build_object('order', 9, 'key', 'monitor', 'label', 'Monitor', 'description', 'Health metrics and directory status'),
      jsonb_build_object('order', 10, 'key', 'optimize', 'label', 'Optimize', 'description', 'Review recommendations — governance alerts')
    ),
    'approvals_route', '/app/approvals'
  );
$$;

create or replace function public._cmbp113_governance_layers()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'layers', jsonb_build_array(
      jsonb_build_object('level', 1, 'key', 'observation', 'label', 'Observation', 'description', 'Read-only — metadata visibility, no actions'),
      jsonb_build_object('level', 2, 'key', 'recommendation', 'label', 'Recommendation', 'description', 'Human approval for every recommendation'),
      jsonb_build_object('level', 3, 'key', 'assisted_action', 'label', 'Assisted Action', 'description', 'Human confirmation before reversible actions'),
      jsonb_build_object('level', 4, 'key', 'operational_automation', 'label', 'Operational Automation', 'description', 'Pre-approved low-risk automation only'),
      jsonb_build_object('level', 5, 'key', 'enterprise_restricted', 'label', 'Enterprise Restricted', 'description', 'Enhanced controls, mandatory logging, executive visibility')
    ),
    'default_level', 2
  );
$$;

create or replace function public._cmbp113_directory_fields()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'fields', jsonb_build_array(
      'name', 'assigned_team', 'status', 'usage_frequency', 'recent_activities',
      'satisfaction_score', 'escalation_rate', 'governance_level', 'owner',
      'version_status', 'security_status'
    ),
    'boundary_note', 'Directory shows deployment metadata — recent activities are summaries only, no raw chat.'
  );
$$;

create or replace function public._cmbp113_health_metrics()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'metrics', jsonb_build_array(
      jsonb_build_object('key', 'recommendation_quality', 'label', 'Recommendation Quality'),
      jsonb_build_object('key', 'escalation_frequency', 'label', 'Escalation Frequency'),
      jsonb_build_object('key', 'response_accuracy', 'label', 'Response Accuracy'),
      jsonb_build_object('key', 'user_satisfaction', 'label', 'User Satisfaction'),
      jsonb_build_object('key', 'adoption', 'label', 'Adoption'),
      jsonb_build_object('key', 'support_reduction', 'label', 'Support Reduction'),
      jsonb_build_object('key', 'workflow_efficiency', 'label', 'Workflow Efficiency'),
      jsonb_build_object('key', 'knowledge_utilization', 'label', 'Knowledge Utilization'),
      jsonb_build_object('key', 'policy_compliance', 'label', 'Policy Compliance'),
      jsonb_build_object('key', 'error_recovery_success', 'label', 'Error Recovery Success')
    ),
    'privacy_note', 'Aggregate metadata only — no PII, no raw chat.'
  );
$$;

create or replace function public._cmbp113_collaboration_rules()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion collaboration requires explicit governance approval, interaction rules, audit, and human visibility.',
    'examples', jsonb_build_array(
      jsonb_build_object('key', 'support_knowledge', 'label', 'Support + Knowledge', 'description', 'Support Companion with Knowledge Companion — shared escalation, distinct permissions', 'requires_approval', true),
      jsonb_build_object('key', 'executive_analytics', 'label', 'Executive + Analytics', 'description', 'Executive briefing with analytics metadata — executive visibility required', 'requires_approval', true),
      jsonb_build_object('key', 'commerce_growth', 'label', 'Commerce + Growth', 'description', 'Commerce stewardship with Growth Partner alignment — Phase 107 cross-link', 'requires_approval', true)
    ),
    'approvals_route', '/app/approvals'
  );
$$;

create or replace function public._cmbp113_lifecycle_states()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'states', jsonb_build_array(
      'draft', 'testing', 'pilot', 'approved', 'active', 'under_review', 'deprecated', 'retired', 'historical_archive'
    )
  );
$$;

create or replace function public._cmbp113_enterprise_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Enterprise Digital Employee Center — admin capabilities for governed Companion fleets.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'provision', 'label', 'Provision', 'description', 'Create and assign digital employees'),
      jsonb_build_object('key', 'deactivate', 'label', 'Deactivate', 'description', 'Safe deactivation with audit trail'),
      jsonb_build_object('key', 'review_permissions', 'label', 'Review permissions', 'description', 'Permission boundary review — Trust & Action cross-link'),
      jsonb_build_object('key', 'audit_logs', 'label', 'Audit logs', 'description', 'Immutable companion_marketplace_audit_logs'),
      jsonb_build_object('key', 'monitor_effectiveness', 'label', 'Monitor effectiveness', 'description', 'Health snapshots and directory metrics'),
      jsonb_build_object('key', 'review_recommendations', 'label', 'Review recommendations', 'description', 'Human review of Companion recommendations'),
      jsonb_build_object('key', 'approve_upgrades', 'label', 'Approve upgrades', 'description', 'Version upgrades require human approval'),
      jsonb_build_object('key', 'security_requirements', 'label', 'Security requirements', 'description', '2FA and security cross-links'),
      jsonb_build_object('key', 'two_fa_enforcement', 'label', '2FA enforcement', 'description', 'Mandatory 2FA for privileged roles — /app/settings/two-factor'),
      jsonb_build_object('key', 'governance_alerts', 'label', 'Governance alerts', 'description', 'Alerts when governance thresholds exceeded')
    ),
    'route', '/app/companion-marketplace'
  );
$$;

create or replace function public._cmbp113_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Security cross-links — 2FA mandatory for privileged Companion roles.',
    'two_factor_route', '/app/settings/two-factor',
    'verify_route', '/verify-2fa',
    'migration', '20261202000000_two_factor_authentication_system.sql',
    'mandatory_2fa_roles', jsonb_build_array(
      'Super Admin', 'Executive', 'Security Administrator',
      'Marketplace Publisher', 'Companion Developers'
    ),
    'boundary_note', '2FA enforcement scaffolds — user_two_factor_settings authoritative.'
  );
$$;

create or replace function public._cmbp113_success_metrics()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'outcomes', jsonb_build_array(
      jsonb_build_object('key', 'reduced_overload', 'label', 'Reduced overload', 'description', 'Teams delegate preparation — humans decide'),
      jsonb_build_object('key', 'higher_consistency', 'label', 'Higher consistency', 'description', 'Governed Companion behavior across teams'),
      jsonb_build_object('key', 'improved_cx', 'label', 'Improved CX', 'description', 'Faster informed responses — not auto-replies without governance'),
      jsonb_build_object('key', 'faster_onboarding', 'label', 'Faster onboarding', 'description', 'Digital employees accelerate knowledge access'),
      jsonb_build_object('key', 'knowledge_retention', 'label', 'Knowledge retention', 'description', 'Institutional knowledge via Companion directory'),
      jsonb_build_object('key', 'employee_satisfaction', 'label', 'Employee satisfaction', 'description', 'Augmentation not replacement'),
      jsonb_build_object('key', 'governance_outcomes', 'label', 'Governance outcomes', 'description', 'Policy compliance and audit visibility'),
      jsonb_build_object('key', 'organizational_resilience', 'label', 'Organizational resilience', 'description', 'Continuity via governed digital coworkers'),
      jsonb_build_object('key', 'healthy_collaboration', 'label', 'Healthier human-Aipify collaboration', 'description', 'People First — Technology Second')
    )
  );
$$;

create or replace function public._cmbp113_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'skills_marketplace_112', 'label', 'Skills Marketplace Blueprint 112', 'route', '/app/marketplace'),
    jsonb_build_object('key', 'skill_store_63', 'label', 'Skill Store Phase 63', 'route', '/app/skills'),
    jsonb_build_object('key', 'commerce_companion_110', 'label', 'Commerce Companion Phase 110', 'route', '/app/commerce-companion'),
    jsonb_build_object('key', 'companion_identity_a84', 'label', 'Companion Identity A.84', 'route', '/app/companion-identity-engine'),
    jsonb_build_object('key', 'industry_packs_111', 'label', 'Industry Packs Blueprint 111', 'route', '/app/business-packs-foundation-engine'),
    jsonb_build_object('key', 'marketplace_governance_90', 'label', 'Marketplace Governance Phase 90', 'route', '/app/marketplace-governance'),
    jsonb_build_object('key', 'trust_action_30', 'label', 'Trust & Action Phase 30', 'route', '/app/approvals'),
    jsonb_build_object('key', 'proactive_companion_a79', 'label', 'Proactive Companion A.79', 'route', '/app/proactive-companion-engine'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-Factor Authentication', 'route', '/app/settings/two-factor'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center A.5', 'route', '/app/knowledge-center-engine')
  );
$$;

create or replace function public._cmbp113_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Limitation principles — Companions augment; humans accountable.',
    'must_avoid', jsonb_build_array(
      'Autonomous decision-making without human approval',
      'Impersonation of humans in customer or employee communications',
      'Replacement framing — Companions are coworkers not substitutes',
      'High-risk Companion auto-deployment bypassing governance',
      'Raw chat or PII in health, audit, or directory metadata'
    ),
    'required', jsonb_build_array(
      'human_approval_required default true',
      'Governance layers 1–5 with explicit assignment',
      'Escalation paths for low confidence and high risk',
      'Immutable audit via companion_marketplace_audit_logs',
      'Aipify-first language — Companion not generic AI'
    ),
    'boundary_note', 'Digital employees inform and prepare — humans decide and execute.'
  );
$$;

create or replace function public._cmbp113_companion_adaptation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion adaptation — wisdom guides which digital coworkers fit your organization.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'permissions_first', 'prompt', 'This Support Companion requires Knowledge Engine access — shall we review permissions before pilot?', 'consideration', 'Context before activation'),
      jsonb_build_object('emoji', '🌹', 'key', 'gradual_adoption', 'prompt', 'Your team could start with one Knowledge Companion — gradual adoption protects focus.', 'consideration', 'People First pacing'),
      jsonb_build_object('emoji', '🔔', 'key', 'governance_ready', 'prompt', 'Governance layer 2 fits this role — ready to assign scope and define escalation?', 'consideration', 'Human approval before activate')
    ),
    'boundary_note', 'Companion scaffolds discovery — never auto-deploys without governance.'
  );
$$;

create or replace function public._cmbp113_integration_links()
returns jsonb language sql immutable as $$
  select public._cmbp113_cross_links();
$$;

create or replace function public._cmbp113_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._cmpm_ensure_settings(p_tenant_id);
  perform public._cmpm_seed_global_catalog();
  perform public._cmpm_seed_tenant_deployments(p_tenant_id);
  perform public._cmpm_seed_health_snapshot(p_tenant_id);
  v_metrics := public._cmpm_refresh_metrics(p_tenant_id);

  return jsonb_build_object(
    'marketplace_score', coalesce((v_metrics->>'marketplace_score')::numeric, 0),
    'deployments_count', coalesce((v_metrics->>'deployments_count')::int, 0),
    'active_deployments_count', coalesce((v_metrics->>'active_deployments_count')::int, 0),
    'catalog_items_count', coalesce((v_metrics->>'catalog_items_count')::int, 0),
    'categories_documented', jsonb_array_length(public._cmbp113_categories()->'categories'),
    'deployment_steps', jsonb_array_length(public._cmbp113_deployment_flow()->'steps'),
    'governance_layers', jsonb_array_length(public._cmbp113_governance_layers()->'layers'),
    'health_metrics', jsonb_array_length(public._cmbp113_health_metrics()->'metrics'),
    'employee_types', jsonb_array_length(public._cmbp113_employee_types()->'types'),
    'integration_links', jsonb_array_length(public._cmbp113_cross_links()),
    'privacy_note', 'Aggregate Companion Marketplace counts and blueprint scaffolds only — metadata, no PII.'
  );
end; $$;

create or replace function public._cmbp113_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._cmpm_ensure_settings(p_tenant_id);
  perform public._cmpm_seed_global_catalog();
  perform public._cmpm_seed_tenant_deployments(p_tenant_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'catalog_categories', 'label', 'Catalog categories — all eleven documented', 'met', jsonb_array_length(public._cmbp113_categories()->'categories') >= 11, 'note', null),
    jsonb_build_object('key', 'deployment_flow', 'label', 'Deployment flow — ten steps with human approval', 'met', jsonb_array_length(public._cmbp113_deployment_flow()->'steps') >= 10, 'note', null),
    jsonb_build_object('key', 'governance_layers', 'label', 'Governance layers 1–5 documented', 'met', jsonb_array_length(public._cmbp113_governance_layers()->'layers') >= 5, 'note', null),
    jsonb_build_object('key', 'digital_employee_model', 'label', 'Digital Employee model — nine dimensions', 'met', jsonb_array_length(public._cmbp113_digital_employee_model()->'dimensions') >= 9, 'note', 'Never autonomous decision-makers'),
    jsonb_build_object('key', 'employee_types', 'label', 'Digital employee types — eight documented', 'met', jsonb_array_length(public._cmbp113_employee_types()->'types') >= 8, 'note', null),
    jsonb_build_object('key', 'health_metrics', 'label', 'Health monitoring — ten metrics', 'met', jsonb_array_length(public._cmbp113_health_metrics()->'metrics') >= 10, 'note', null),
    jsonb_build_object('key', 'collaboration_rules', 'label', 'Collaboration rules — explicit approval required', 'met', jsonb_array_length(public._cmbp113_collaboration_rules()->'examples') >= 3, 'note', null),
    jsonb_build_object('key', 'enterprise_center', 'label', 'Enterprise Digital Employee Center capabilities', 'met', jsonb_array_length(public._cmbp113_enterprise_center()->'capabilities') >= 10, 'note', null),
    jsonb_build_object('key', 'security_2fa', 'label', 'Security — 2FA cross-link for privileged roles', 'met', (public._cmbp113_security_requirements()->>'two_factor_route') = '/app/settings/two-factor', 'note', 'Migration 20261202000000'),
    jsonb_build_object('key', 'cross_links', 'label', 'Distinction cross-links — Phase 112, 63, 110, 111, 90, 30, A.79', 'met', jsonb_array_length(public._cmbp113_cross_links()) >= 8, 'note', null),
    jsonb_build_object('key', 'companion_adaptation', 'label', 'Companion adaptation — 🦉🌹🔔 examples', 'met', jsonb_array_length(public._cmbp113_companion_adaptation()->'examples') >= 3, 'note', null),
    jsonb_build_object('key', 'global_catalog', 'label', 'Global catalog seeded per category', 'met', (select count(*) from public.companion_marketplace_catalog where is_global = true) >= 11, 'note', null),
    jsonb_build_object('key', 'human_approval', 'label', 'human_approval_required default true', 'met', exists (select 1 from public.companion_marketplace_settings s where s.tenant_id = p_tenant_id and s.human_approval_required = true), 'note', null),
    jsonb_build_object('key', 'abos_principle', 'label', 'ABOS principle — humans decide', 'met', true, 'note', 'Aipify informs and prepares')
  );
end; $$;

create or replace function public._cmbp113_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 113 — Companion Marketplace & Digital Employee Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE113_COMPANION_MARKETPLACE_DIGITAL_EMPLOYEE.md',
    'engine_phase', 'Repo Phase 113 Companion Marketplace & Digital Employee Engine',
    'route', '/app/companion-marketplace',
    'mapping_note', 'Unified Companion Marketplace + Digital Employee Engine + Enterprise Digital Employee Center.',
    'distinction_note', public._cmbp113_distinction_note(),
    'mission', public._cmbp113_mission(),
    'philosophy', public._cmbp113_philosophy(),
    'abos_principle', public._cmbp113_abos_principle(),
    'objectives', public._cmbp113_objectives(),
    'categories', public._cmbp113_categories(),
    'profile_fields', public._cmbp113_profile_fields(),
    'digital_employee_model', public._cmbp113_digital_employee_model(),
    'employee_types', public._cmbp113_employee_types(),
    'deployment_flow', public._cmbp113_deployment_flow(),
    'governance_layers', public._cmbp113_governance_layers(),
    'directory_fields', public._cmbp113_directory_fields(),
    'health_metrics', public._cmbp113_health_metrics(),
    'collaboration_rules', public._cmbp113_collaboration_rules(),
    'lifecycle_states', public._cmbp113_lifecycle_states(),
    'enterprise_center', public._cmbp113_enterprise_center(),
    'security_requirements', public._cmbp113_security_requirements(),
    'success_metrics', public._cmbp113_success_metrics(),
    'cross_links', public._cmbp113_cross_links(),
    'limitation_principles', public._cmbp113_limitation_principles(),
    'companion_adaptation', public._cmbp113_companion_adaptation(),
    'success_criteria', public._cmbp113_success_criteria(p_tenant_id),
    'vision', public._cmbp113_vision(),
    'integration_links', public._cmbp113_integration_links(),
    'engagement_summary', public._cmbp113_engagement_summary(p_tenant_id),
    'privacy_note', 'Companion Marketplace blueprint data is metadata only — no PII, no raw chat. Humans approve activation.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 8. Action RPCs — activate/deactivate with human-approval gates
-- ---------------------------------------------------------------------------
create or replace function public.activate_companion_marketplace_deployment(p_deployment_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.companion_marketplace_settings;
  v_deployment public.companion_marketplace_deployments;
  v_catalog public.companion_marketplace_catalog;
begin
  v_tenant_id := public._cmpm_require_tenant();
  v_settings := public._cmpm_ensure_settings(v_tenant_id);

  if not v_settings.human_approval_required then
    raise exception 'Human approval gate misconfigured';
  end if;

  select * into v_deployment from public.companion_marketplace_deployments
  where id = p_deployment_id and tenant_id = v_tenant_id;

  if not found then raise exception 'Deployment not found'; end if;

  select * into v_catalog from public.companion_marketplace_catalog where id = v_deployment.catalog_id;

  if v_catalog.risk_classification in ('high', 'critical') and v_deployment.governance_level < 3 then
    return jsonb_build_object(
      'error', 'high_risk_requires_governance',
      'message', 'High-risk Companions require governance level 3+ and explicit human approval via Approval Center.',
      'approvals_route', '/app/approvals',
      'requires_human_approval', true
    );
  end if;

  if v_deployment.status not in ('approved', 'pilot', 'testing') then
    return jsonb_build_object(
      'error', 'invalid_status',
      'message', 'Deployment must be approved, pilot, or testing before activation — humans decide.',
      'current_status', v_deployment.status,
      'requires_human_approval', true
    );
  end if;

  update public.companion_marketplace_deployments
  set status = 'active', activated_at = now(), updated_at = now()
  where id = p_deployment_id;

  perform public._cmpm_log_audit(v_tenant_id, 'deployment_activated',
    'Companion deployment activated — human approval gate passed',
    jsonb_build_object('deployment_id', p_deployment_id, 'companion_name', v_deployment.companion_name, 'governance_level', v_deployment.governance_level));

  return jsonb_build_object(
    'deployment_id', p_deployment_id,
    'status', 'active',
    'requires_human_approval', true,
    'message', 'Companion activated — monitor health metrics and governance alerts.'
  );
end; $$;

create or replace function public.deactivate_companion_marketplace_deployment(p_deployment_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_deployment public.companion_marketplace_deployments;
begin
  v_tenant_id := public._cmpm_require_tenant();

  select * into v_deployment from public.companion_marketplace_deployments
  where id = p_deployment_id and tenant_id = v_tenant_id;

  if not found then raise exception 'Deployment not found'; end if;

  update public.companion_marketplace_deployments
  set status = 'retired', deactivated_at = now(), updated_at = now()
  where id = p_deployment_id;

  perform public._cmpm_log_audit(v_tenant_id, 'deployment_deactivated',
    'Companion deployment deactivated — audit retained',
    jsonb_build_object('deployment_id', p_deployment_id, 'companion_name', v_deployment.companion_name));

  return jsonb_build_object('deployment_id', p_deployment_id, 'status', 'retired');
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Dashboard and card RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_marketplace_card(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.companion_marketplace_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._cmpm_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_settings := public._cmpm_ensure_settings(v_tenant_id);
  perform public._cmpm_seed_global_catalog();
  perform public._cmpm_seed_tenant_deployments(v_tenant_id);
  perform public._cmpm_seed_health_snapshot(v_tenant_id);
  v_metrics := public._cmpm_refresh_metrics(v_tenant_id);
  v_engagement := public._cmbp113_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'marketplace_score', v_metrics->'marketplace_score',
    'active_deployments_count', v_metrics->'active_deployments_count',
    'catalog_items_count', v_metrics->'catalog_items_count',
    'philosophy', public._cmbp113_philosophy(),
    'human_oversight_required', true,
    'human_approval_required', v_settings.human_approval_required,
    'default_governance_level', v_settings.default_governance_level,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 113 — Companion Marketplace & Digital Employee Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE113_COMPANION_MARKETPLACE_DIGITAL_EMPLOYEE.md',
      'engine_phase', 'Repo Phase 113',
      'route', '/app/companion-marketplace'
    ),
    'companion_marketplace_mission', public._cmbp113_mission(),
    'companion_marketplace_abos_principle', public._cmbp113_abos_principle(),
    'companion_marketplace_engagement_summary', v_engagement,
    'companion_marketplace_note', 'Companion Marketplace & Digital Employee Engine (ABOS Phase 113) — digital coworkers, not chatbots.',
    'companion_marketplace_vision_note', public._cmbp113_vision()
  );
end; $$;

create or replace function public.get_companion_marketplace_dashboard(p_tenant_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.companion_marketplace_settings;
  v_metrics jsonb;
  v_health public.companion_marketplace_health_snapshots;
begin
  v_tenant_id := coalesce(p_tenant_id, public._cmpm_require_tenant());
  v_settings := public._cmpm_ensure_settings(v_tenant_id);
  perform public._cmpm_seed_global_catalog();
  perform public._cmpm_seed_tenant_deployments(v_tenant_id);
  perform public._cmpm_seed_health_snapshot(v_tenant_id);
  v_metrics := public._cmpm_refresh_metrics(v_tenant_id);

  select * into v_health from public.companion_marketplace_health_snapshots
  where tenant_id = v_tenant_id order by captured_at desc limit 1;

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'human_approval_required', v_settings.human_approval_required,
    'marketplace_enabled', v_settings.marketplace_enabled,
    'default_governance_level', v_settings.default_governance_level,
    'enterprise_center_enabled', v_settings.enterprise_center_enabled,
    'philosophy', public._cmbp113_philosophy(),
    'safety_note', 'Companion Marketplace deploys governed digital coworkers — metadata only in health and audit. Humans approve activation; no auto-deploy high-risk Companions.',
    'marketplace_score', v_metrics->'marketplace_score',
    'deployments_count', v_metrics->'deployments_count',
    'active_deployments_count', v_metrics->'active_deployments_count',
    'catalog_items_count', v_metrics->'catalog_items_count',
    'recommendation_quality', v_metrics->'recommendation_quality',
    'escalation_frequency', v_metrics->'escalation_frequency',
    'user_satisfaction', v_metrics->'user_satisfaction',
    'adoption_rate', v_metrics->'adoption_rate',
    'policy_compliance', v_metrics->'policy_compliance',
    'catalog_by_category', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'catalog_key', c.catalog_key, 'category', c.category,
        'name', c.name, 'role_title', c.role_title, 'description', c.description,
        'risk_classification', c.risk_classification, 'maturity_level', c.maturity_level,
        'approval_status', c.approval_status, 'version', c.version
      ) order by c.category, c.name)
      from public.companion_marketplace_catalog c
      where c.is_global = true or c.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'companion_directory', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id, 'companion_name', d.companion_name, 'assigned_team', d.assigned_team,
        'status', d.status, 'governance_level', d.governance_level,
        'employee_type', d.employee_type, 'usage_frequency', d.usage_frequency,
        'satisfaction_score', d.satisfaction_score, 'escalation_rate', d.escalation_rate,
        'security_status', d.security_status, 'version_status', d.version_status,
        'category', cat.category, 'risk_classification', cat.risk_classification
      ) order by d.status, d.companion_name)
      from public.companion_marketplace_deployments d
      join public.companion_marketplace_catalog cat on cat.id = d.catalog_id
      where d.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'health_snapshot', case when v_health.id is not null then jsonb_build_object(
      'recommendation_quality', v_health.recommendation_quality,
      'escalation_frequency', v_health.escalation_frequency,
      'response_accuracy', v_health.response_accuracy,
      'user_satisfaction', v_health.user_satisfaction,
      'adoption_rate', v_health.adoption_rate,
      'support_reduction', v_health.support_reduction,
      'workflow_efficiency', v_health.workflow_efficiency,
      'knowledge_utilization', v_health.knowledge_utilization,
      'policy_compliance', v_health.policy_compliance,
      'error_recovery_success', v_health.error_recovery_success,
      'aggregate_score', v_health.aggregate_score
    ) else '{}'::jsonb end,
    'deployment_flow', public._cmbp113_deployment_flow(),
    'governance_layers', public._cmbp113_governance_layers(),
    'collaboration_rules', public._cmbp113_collaboration_rules(),
    'enterprise_center', public._cmbp113_enterprise_center(),
    'security_requirements', public._cmbp113_security_requirements(),
    'integration_links', public._cmbp113_cross_links(),
    'implementation_blueprint', public._cmbp113_blueprint_block(v_tenant_id),
    'companion_marketplace_engine_note', 'Companion Marketplace & Digital Employee Engine (ABOS Phase 113) — People First. Technology Second.',
    'companion_marketplace_blueprint', public._cmbp113_blueprint_block(v_tenant_id),
    'companion_marketplace_distinction_note', public._cmbp113_distinction_note(),
    'companion_marketplace_mission', public._cmbp113_mission(),
    'companion_marketplace_philosophy', public._cmbp113_philosophy(),
    'companion_marketplace_abos_principle', public._cmbp113_abos_principle(),
    'companion_marketplace_objectives', public._cmbp113_objectives(),
    'companion_marketplace_categories', public._cmbp113_categories(),
    'companion_marketplace_digital_employee_model', public._cmbp113_digital_employee_model(),
    'companion_marketplace_employee_types', public._cmbp113_employee_types(),
    'companion_marketplace_directory_fields', public._cmbp113_directory_fields(),
    'companion_marketplace_health_metrics', public._cmbp113_health_metrics(),
    'companion_marketplace_lifecycle_states', public._cmbp113_lifecycle_states(),
    'companion_marketplace_limitation_principles', public._cmbp113_limitation_principles(),
    'companion_marketplace_companion_adaptation', public._cmbp113_companion_adaptation(),
    'companion_marketplace_success_metrics', public._cmbp113_success_metrics(),
    'cmbp113_integration_links', public._cmbp113_cross_links(),
    'companion_marketplace_engagement_summary', public._cmbp113_engagement_summary(v_tenant_id),
    'companion_marketplace_success_criteria', public._cmbp113_success_criteria(v_tenant_id),
    'companion_marketplace_vision', public._cmbp113_vision(),
    'companion_marketplace_privacy_note', 'Companion Marketplace metadata only — catalog profiles, deployment directory, aggregate health. No PII, no raw chat. Humans approve activation.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Permissions, module seed, knowledge category, grants
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'companion_marketplace_engine', v.description
from (values
  ('companion_marketplace.view', 'View Companion Marketplace', 'Browse catalog, directory, and health metadata'),
  ('companion_marketplace.manage', 'Manage Companion Marketplace', 'Provision, activate, and deactivate digital employees')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

update public.subscription_packages
set module_keys = module_keys || '["companion_marketplace"]'::jsonb,
    updated_at = now()
where package_key in ('business', 'enterprise')
  and not module_keys @> '["companion_marketplace"]'::jsonb;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'companion-marketplace', 'Companion Marketplace & Digital Employee Engine',
  'Trusted Companion Marketplace and Digital Employee provisioning — governed digital coworkers, not chatbots.',
  'authenticated', 133
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'companion-marketplace' and tenant_id is null);

grant execute on function public.get_companion_marketplace_card(uuid) to authenticated;
grant execute on function public.get_companion_marketplace_dashboard(uuid) to authenticated;
grant execute on function public.activate_companion_marketplace_deployment(uuid) to authenticated;
grant execute on function public.deactivate_companion_marketplace_deployment(uuid) to authenticated;
grant execute on function public._cmbp113_distinction_note() to authenticated;
grant execute on function public._cmbp113_mission() to authenticated;
grant execute on function public._cmbp113_philosophy() to authenticated;
grant execute on function public._cmbp113_blueprint_block(uuid) to authenticated;

select public._cmpm_seed_global_catalog();
