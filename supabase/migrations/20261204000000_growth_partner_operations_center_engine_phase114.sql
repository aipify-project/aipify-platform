-- Phase 114 — Growth Partner Operations Center Engine
-- Distinct operational workspace for Growth Partners — NOT an extension of /app/partners certification RPCs.
-- Cross-links: Phase 91/107 /app/partners, A.73 /app/partner-success-engine, Phase 113 /app/companion-marketplace (scaffold).

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
    'growth_partner_operations'
  )
);

-- Phase 91 alias — _pce_* renamed to _partner_eco_* in Blueprint Phase 33
create or replace function public._pce_tier_label(p_tier text)
returns text language sql immutable as $$
  select public._mpfe_tier_label(p_tier);
$$;

-- ---------------------------------------------------------------------------
-- 1. growth_partner_operations_settings
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_operations_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  operations_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  portfolio_segmentation_enabled boolean not null default true,
  mandatory_2fa_for_sensitive_roles boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.growth_partner_operations_settings enable row level security;
revoke all on public.growth_partner_operations_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. growth_partner_operations_customers (portfolio — metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_operations_customers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  customer_org_key text not null,
  org_profile_summary text not null,
  industry_classification text not null,
  companions_deployed_count int not null default 0,
  implementation_status text not null default 'discovery' check (
    implementation_status in (
      'discovery', 'planning', 'configuration', 'companion_setup',
      'knowledge_preparation', 'pilot_deployment', 'user_training',
      'go_live', 'optimization', 'continuous_success'
    )
  ),
  stakeholder_mapping jsonb not null default '{}'::jsonb,
  communication_history_count int not null default 0,
  training_progress_pct numeric(5, 2) not null default 0 check (training_progress_pct between 0 and 100),
  renewal_date date,
  health_score int not null default 50 check (health_score between 0 and 100),
  growth_opportunities_count int not null default 0,
  risk_signals_count int not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, customer_org_key)
);

create index if not exists growth_partner_operations_customers_tenant_idx
  on public.growth_partner_operations_customers (tenant_id, implementation_status, health_score desc);

alter table public.growth_partner_operations_customers enable row level security;
revoke all on public.growth_partner_operations_customers from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. growth_partner_operations_implementations
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_operations_implementations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  customer_id uuid references public.growth_partner_operations_customers (id) on delete cascade,
  current_stage text not null default 'discovery' check (
    current_stage in (
      'discovery', 'planning', 'configuration', 'companion_setup',
      'knowledge_preparation', 'pilot_deployment', 'user_training',
      'go_live', 'optimization', 'continuous_success'
    )
  ),
  progress_pct numeric(5, 2) not null default 0 check (progress_pct between 0 and 100),
  milestones jsonb not null default '[]'::jsonb,
  tasks jsonb not null default '[]'::jsonb,
  owners jsonb not null default '[]'::jsonb,
  templates jsonb not null default '[]'::jsonb,
  checklists jsonb not null default '[]'::jsonb,
  escalation_procedures jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists growth_partner_operations_implementations_tenant_idx
  on public.growth_partner_operations_implementations (tenant_id, current_stage);

alter table public.growth_partner_operations_implementations enable row level security;
revoke all on public.growth_partner_operations_implementations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. growth_partner_operations_renewals
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_operations_renewals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  customer_id uuid references public.growth_partner_operations_customers (id) on delete cascade,
  renewal_type text not null check (
    renewal_type in (
      'contract_renewal', 'expansion_opportunity', 'health_deterioration',
      'companion_adoption_decline', 'training_gap', 'support_trend',
      'executive_engagement', 'risk_alert', 'recommended_intervention'
    )
  ),
  title text not null,
  summary text not null,
  due_date date,
  priority text not null default 'moderate' check (
    priority in ('informational', 'moderate', 'important', 'critical')
  ),
  status text not null default 'open' check (status in ('open', 'in_review', 'resolved', 'escalated')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists growth_partner_operations_renewals_tenant_idx
  on public.growth_partner_operations_renewals (tenant_id, status, due_date);

alter table public.growth_partner_operations_renewals enable row level security;
revoke all on public.growth_partner_operations_renewals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. growth_partner_operations_health_snapshots
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_operations_health_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  partner_health_score numeric(5, 2) not null default 50 check (partner_health_score between 0 and 100),
  customer_retention_score numeric(5, 2) not null default 50,
  implementation_success_score numeric(5, 2) not null default 50,
  training_effectiveness_score numeric(5, 2) not null default 50,
  support_quality_score numeric(5, 2) not null default 50,
  customer_satisfaction_score numeric(5, 2) not null default 50,
  governance_compliance_score numeric(5, 2) not null default 50,
  revenue_stability_score numeric(5, 2) not null default 50,
  community_contributions_score numeric(5, 2) not null default 50,
  knowledge_sharing_score numeric(5, 2) not null default 50,
  partner_growth_score numeric(5, 2) not null default 50,
  summary text not null,
  captured_at timestamptz not null default now()
);

create index if not exists growth_partner_operations_health_snapshots_tenant_idx
  on public.growth_partner_operations_health_snapshots (tenant_id, captured_at desc);

alter table public.growth_partner_operations_health_snapshots enable row level security;
revoke all on public.growth_partner_operations_health_snapshots from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. growth_partner_operations_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_operations_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.growth_partner_operations_audit_logs enable row level security;
revoke all on public.growth_partner_operations_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Baseline helpers (_gpoc_)
-- ---------------------------------------------------------------------------
create or replace function public._gpoc_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._gpoc_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._gpoc_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._gpoc_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.growth_partner_operations_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._gpoc_ensure_settings(p_tenant_id uuid)
returns public.growth_partner_operations_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.growth_partner_operations_settings;
begin
  insert into public.growth_partner_operations_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.growth_partner_operations_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._gpoc_implementation_stage_templates()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'discovery', 'label', 'Discovery', 'order', 1, 'description', 'Understand customer context, goals, and readiness'),
    jsonb_build_object('key', 'planning', 'label', 'Planning', 'order', 2, 'description', 'Define scope, stakeholders, timeline, and success criteria'),
    jsonb_build_object('key', 'configuration', 'label', 'Configuration', 'order', 3, 'description', 'Configure Aipify modules, governance, and tenant settings'),
    jsonb_build_object('key', 'companion_setup', 'label', 'Companion Setup', 'order', 4, 'description', 'Select, configure, and permission Companions — cross-link Phase 113 marketplace'),
    jsonb_build_object('key', 'knowledge_preparation', 'label', 'Knowledge Preparation', 'order', 5, 'description', 'Prepare KC assets, templates, and approved knowledge'),
    jsonb_build_object('key', 'pilot_deployment', 'label', 'Pilot Deployment', 'order', 6, 'description', 'Limited rollout with feedback loops and human approval'),
    jsonb_build_object('key', 'user_training', 'label', 'User Training', 'order', 7, 'description', 'Training Academy programs and adoption coaching'),
    jsonb_build_object('key', 'go_live', 'label', 'Go Live', 'order', 8, 'description', 'Production launch with governance checkpoints'),
    jsonb_build_object('key', 'optimization', 'label', 'Optimization', 'order', 9, 'description', 'Post-launch tuning, workflows, and companion engagement'),
    jsonb_build_object('key', 'continuous_success', 'label', 'Continuous Success', 'order', 10, 'description', 'Ongoing health monitoring, renewals, and expansion stewardship')
  );
$$;

create or replace function public._gpoc_training_program_scaffolds()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'aipify_fundamentals', 'label', 'Aipify Fundamentals'),
    jsonb_build_object('key', 'companion_strategy', 'label', 'Companion Strategy'),
    jsonb_build_object('key', 'implementation_excellence', 'label', 'Implementation Excellence'),
    jsonb_build_object('key', 'governance_best_practices', 'label', 'Governance Best Practices'),
    jsonb_build_object('key', 'commerce_excellence', 'label', 'Commerce Excellence'),
    jsonb_build_object('key', 'executive_advisory_skills', 'label', 'Executive Advisory Skills'),
    jsonb_build_object('key', 'knowledge_management', 'label', 'Knowledge Management'),
    jsonb_build_object('key', 'security_principles', 'label', 'Security Principles'),
    jsonb_build_object('key', 'customer_success_methodologies', 'label', 'Customer Success Methodologies'),
    jsonb_build_object('key', 'industry_specializations', 'label', 'Industry Specializations')
  );
$$;

create or replace function public._gpoc_certification_level_mappings()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'registered', 'label', 'Registered', 'maps_to_tier', 'registered', 'maps_to_tier_label', public._pce_tier_label('registered')),
    jsonb_build_object('key', 'certified', 'label', 'Certified', 'maps_to_tier', 'certified', 'maps_to_tier_label', public._pce_tier_label('certified')),
    jsonb_build_object('key', 'advanced', 'label', 'Advanced', 'maps_to_tier', 'advanced', 'maps_to_tier_label', public._pce_tier_label('advanced')),
    jsonb_build_object('key', 'strategic', 'label', 'Strategic', 'maps_to_tier', 'strategic', 'maps_to_tier_label', public._pce_tier_label('strategic')),
    jsonb_build_object('key', 'enterprise', 'label', 'Enterprise', 'maps_to_tier', 'premier', 'maps_to_tier_label', public._pce_tier_label('premier')),
    jsonb_build_object('key', 'global_growth_partner', 'label', 'Global Growth Partner', 'maps_to_tier', 'expert', 'maps_to_tier_label', public._pce_tier_label('expert'))
  );
$$;

create or replace function public._gpoc_seed_customers(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.growth_partner_operations_customers where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.growth_partner_operations_customers (
    tenant_id, customer_org_key, org_profile_summary, industry_classification,
    companions_deployed_count, implementation_status, training_progress_pct,
    renewal_date, health_score, growth_opportunities_count, risk_signals_count
  ) values
    (p_tenant_id, 'nordic-retail-co', 'Nordic retail customer — multi-store commerce adoption', 'retail_commerce', 3, 'optimization', 78, current_date + interval '90 days', 82, 2, 0),
    (p_tenant_id, 'professional-services-as', 'Professional services firm — executive and support Companions', 'professional_services', 2, 'user_training', 62, current_date + interval '120 days', 71, 1, 1),
    (p_tenant_id, 'healthcare-clinic-group', 'Healthcare clinic group — governance-first rollout', 'healthcare', 1, 'pilot_deployment', 45, current_date + interval '180 days', 65, 1, 2);
end; $$;

create or replace function public._gpoc_seed_implementations(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_customer_id uuid;
begin
  if exists (select 1 from public.growth_partner_operations_implementations where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  select id into v_customer_id from public.growth_partner_operations_customers
  where tenant_id = p_tenant_id and customer_org_key = 'nordic-retail-co' limit 1;

  insert into public.growth_partner_operations_implementations (
    tenant_id, customer_id, current_stage, progress_pct, milestones, tasks, owners
  ) values (
    p_tenant_id, v_customer_id, 'optimization', 85,
    jsonb_build_array(
      jsonb_build_object('key', 'discovery_complete', 'label', 'Discovery complete', 'met', true),
      jsonb_build_object('key', 'go_live_complete', 'label', 'Go live complete', 'met', true),
      jsonb_build_object('key', 'optimization_review', 'label', 'Optimization review scheduled', 'met', false)
    ),
    jsonb_build_array(
      jsonb_build_object('key', 'companion_engagement_review', 'label', 'Review Companion engagement metrics', 'owner', 'partner_cs_lead'),
      jsonb_build_object('key', 'renewal_prep', 'label', 'Prepare renewal stewardship summary', 'owner', 'partner_account_lead')
    ),
    jsonb_build_array(
      jsonb_build_object('role', 'implementation_lead', 'label', 'Implementation Lead'),
      jsonb_build_object('role', 'customer_success', 'label', 'Customer Success Steward')
    )
  );
end; $$;

create or replace function public._gpoc_seed_renewals(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_customer_id uuid;
begin
  if exists (select 1 from public.growth_partner_operations_renewals where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  select id into v_customer_id from public.growth_partner_operations_customers
  where tenant_id = p_tenant_id and customer_org_key = 'professional-services-as' limit 1;

  insert into public.growth_partner_operations_renewals (tenant_id, customer_id, renewal_type, title, summary, due_date, priority)
  values
    (p_tenant_id, v_customer_id, 'training_gap', 'Training completion gap', 'Training progress below target — Training Academy cross-link recommended.', current_date + interval '30 days', 'moderate'),
    (p_tenant_id, null, 'expansion_opportunity', 'Commerce expansion opportunity', 'Nordic retail customer shows expansion readiness metadata — human review before proposal.', current_date + interval '60 days', 'informational'),
    (p_tenant_id, null, 'risk_alert', 'Governance review stewardship', 'Healthcare pilot requires governance checkpoint — cross-link Trust & Security.', current_date + interval '14 days', 'important');
end; $$;

create or replace function public._gpoc_seed_health_snapshots(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.growth_partner_operations_health_snapshots where tenant_id = p_tenant_id) then
    return;
  end if;

  insert into public.growth_partner_operations_health_snapshots (
    tenant_id, partner_health_score, customer_retention_score, implementation_success_score,
    training_effectiveness_score, support_quality_score, customer_satisfaction_score,
    governance_compliance_score, revenue_stability_score, community_contributions_score,
    knowledge_sharing_score, partner_growth_score, summary
  ) values (
    p_tenant_id, 78, 82, 80, 74, 76, 79, 85, 72, 68, 71, 75,
    'Growth Partner portfolio health stable — implementation success strong, training gaps under stewardship review. Metadata only — no customer PII.'
  );
end; $$;

create or replace function public._gpoc_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_health public.growth_partner_operations_health_snapshots;
  v_active_customers int;
  v_upcoming_renewals int;
  v_implementations_in_progress int;
  v_open_renewals int;
  v_risk_signals int;
begin
  select * into v_health from public.growth_partner_operations_health_snapshots
  where tenant_id = p_tenant_id order by captured_at desc limit 1;

  select count(*) into v_active_customers from public.growth_partner_operations_customers where tenant_id = p_tenant_id;
  select count(*) into v_upcoming_renewals from public.growth_partner_operations_customers
  where tenant_id = p_tenant_id and renewal_date is not null and renewal_date <= current_date + interval '90 days';
  select count(*) into v_implementations_in_progress from public.growth_partner_operations_implementations
  where tenant_id = p_tenant_id and current_stage not in ('continuous_success', 'optimization');
  select count(*) into v_open_renewals from public.growth_partner_operations_renewals
  where tenant_id = p_tenant_id and status in ('open', 'in_review');
  select coalesce(sum(risk_signals_count), 0) into v_risk_signals from public.growth_partner_operations_customers where tenant_id = p_tenant_id;

  return jsonb_build_object(
    'partner_health_score', coalesce(v_health.partner_health_score, 50),
    'active_customers', v_active_customers,
    'upcoming_renewals', v_upcoming_renewals,
    'implementations_in_progress', v_implementations_in_progress,
    'open_renewal_items', v_open_renewals,
    'risk_signals_count', v_risk_signals,
    'training_programs_count', jsonb_array_length(public._gpoc_training_program_scaffolds()),
    'implementation_stages_count', jsonb_array_length(public._gpoc_implementation_stage_templates()),
    'certification_levels_count', jsonb_array_length(public._gpoc_certification_level_mappings())
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Blueprint helpers (_gpocbp114_)
-- ---------------------------------------------------------------------------
create or replace function public._gpocbp114_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 114 — Growth Partner Operations Center Engine at /app/growth-partner-operations. Distinct operational workspace for Growth Partners — NOT an extension of /app/partners certification RPCs (_pce_*, _gpebp107_*). Cross-links: Partner Certification Phase 91 + Blueprint 107 /app/partners (certification & ecosystem — do NOT duplicate); Partner Success A.73 /app/partner-success-engine (portfolio health for customer orgs — complementary); Companion Marketplace Phase 113 /app/companion-marketplace (companion deployment — scaffold if not yet shipped); Marketplace Blueprint 112 /app/marketplace; Marketplace Partner Ecosystem A.45 /app/marketplace-partner-ecosystem-foundation-engine; Customer Lifecycle Phase 86 / Blueprint 108 /app/customer-lifecycle; Certification & Achievement A.37 /app/certification-achievement-engine (internal certs distinct); Learning & Training A.36 /app/learning-training-engine; Sales Expert OS A.79 /app/sales-expert-engine (Sales Expert as Growth Partner type); 2FA /app/settings/two-factor. Helpers use _gpocbp114_* — never collide with _pce_*, _gpebp107_*, _pse_*. Growth Partner terminology only — never Affiliate.';
$$;

create or replace function public._gpocbp114_mission()
returns text language sql immutable as $$
  select 'Empower Growth Partners to deliver transformation — manage customers, implementations, training, renewals, and outcomes at sustainable scale.';
$$;

create or replace function public._gpocbp114_philosophy()
returns text language sql immutable as $$
  select 'Growth Partners are independent businesses — not affiliates. Strategy, implementation, training, change management, customer success, advisory. Growth through support. People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Stewardship through responsibility.';
$$;

create or replace function public._gpocbp114_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Growth Partner Operations Center orchestrates partner delivery workflows; certification at /app/partners and customer lifecycle engines remain authoritative. Aipify informs and prepares; humans approve significant partner actions.';
$$;

create or replace function public._gpocbp114_vision()
returns text language sql immutable as $$
  select 'We gained a trusted Growth Partner who helped our organization succeed — not just software we purchased alone.';
$$;

create or replace function public._gpocbp114_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'manage_customers', 'label', 'Manage customers', 'emoji', '🌹', 'description', 'Customer portfolio with metadata-only stewardship — no PII content'),
    jsonb_build_object('key', 'track_implementations', 'label', 'Track implementations', 'emoji', '🦉', 'description', 'Ten-stage implementation center with tasks, milestones, and escalation'),
    jsonb_build_object('key', 'deliver_onboarding', 'label', 'Deliver onboarding', 'emoji', '🔔', 'description', 'Structured onboarding and Training Academy programs'),
    jsonb_build_object('key', 'monitor_health', 'label', 'Monitor health', 'emoji', '🦉', 'description', 'Partner and customer health scores — complementary to Partner Success A.73'),
    jsonb_build_object('key', 'coordinate_projects', 'label', 'Coordinate projects', 'emoji', '🌹', 'description', 'Project ownership, checklists, and human-governed milestones'),
    jsonb_build_object('key', 'measure_outcomes', 'label', 'Measure outcomes', 'emoji', '🔔', 'description', 'Customer success metrics and partner insights — metadata only'),
    jsonb_build_object('key', 'recurring_revenue', 'label', 'Generate recurring revenue', 'emoji', '🦉', 'description', 'Ethical renewal and expansion stewardship — transparent engagements'),
    jsonb_build_object('key', 'scale_responsibly', 'label', 'Scale responsibly', 'emoji', '🌹', 'description', 'Sustainable partner businesses — Self Love and limitation principles')
  );
$$;

create or replace function public._gpocbp114_operations_center_modules()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'partner_dashboard', 'label', 'Partner Dashboard', 'route', '/app/growth-partner-operations'),
    jsonb_build_object('key', 'customer_portfolio', 'label', 'Customer Portfolio', 'route', '/app/growth-partner-operations'),
    jsonb_build_object('key', 'implementation_center', 'label', 'Implementation Center', 'route', '/app/growth-partner-operations'),
    jsonb_build_object('key', 'companion_deployment_center', 'label', 'Companion Deployment Center', 'route', '/app/growth-partner-operations'),
    jsonb_build_object('key', 'training_academy', 'label', 'Training Academy', 'route', '/app/growth-partner-operations'),
    jsonb_build_object('key', 'renewal_center', 'label', 'Renewal Center', 'route', '/app/growth-partner-operations'),
    jsonb_build_object('key', 'success_monitoring', 'label', 'Success Monitoring', 'route', '/app/growth-partner-operations'),
    jsonb_build_object('key', 'knowledge_distribution', 'label', 'Knowledge Distribution', 'route', '/app/growth-partner-operations'),
    jsonb_build_object('key', 'revenue_intelligence', 'label', 'Revenue Intelligence', 'route', '/app/growth-partner-operations'),
    jsonb_build_object('key', 'partner_insights', 'label', 'Partner Insights', 'route', '/app/growth-partner-operations')
  );
$$;

create or replace function public._gpocbp114_partner_dashboard()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Partner Dashboard — holistic operational visibility for Growth Partner stewards.',
    'fields', jsonb_build_array(
      'active_customers', 'upcoming_renewals', 'implementation_progress', 'companion_adoption',
      'training_completion', 'customer_satisfaction', 'growth_opportunities', 'revenue_performance',
      'risk_indicators', 'recommended_actions'
    ),
    'boundary_note', 'Dashboard aggregates metadata — domain certification RPCs at /app/partners remain authoritative.'
  );
$$;

create or replace function public._gpocbp114_customer_portfolio()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Customer Portfolio — metadata-only org profiles for partner-managed customers.',
    'fields', jsonb_build_array(
      'org_profile', 'industry_classification', 'companions_deployed', 'implementation_status',
      'stakeholder_mapping', 'communication_history', 'training_progress', 'renewal_dates',
      'health_score', 'growth_opportunities', 'risk_signals'
    ),
    'privacy_note', 'Communication history is metadata counts only — no email, chat, or PII content stored.'
  );
$$;

create or replace function public._gpocbp114_implementation_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Implementation Center — ten stages from Discovery through Continuous Success.',
    'stages', public._gpoc_implementation_stage_templates(),
    'includes', jsonb_build_array('tasks', 'milestones', 'owners', 'templates', 'checklists', 'escalation_procedures'),
    'boundary_note', 'Humans approve stage transitions and escalations — no silent auto-progression.'
  );
$$;

create or replace function public._gpocbp114_companion_deployment_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion Deployment Management — selection, configuration, governance, and rollout stewardship.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'companion_selection', 'label', 'Companion selection'),
      jsonb_build_object('key', 'configuration', 'label', 'Configuration'),
      jsonb_build_object('key', 'permissions', 'label', 'Permissions'),
      jsonb_build_object('key', 'governance', 'label', 'Governance'),
      jsonb_build_object('key', 'department_assignments', 'label', 'Department assignments'),
      jsonb_build_object('key', 'knowledge_prep', 'label', 'Knowledge preparation'),
      jsonb_build_object('key', 'rollout', 'label', 'Rollout'),
      jsonb_build_object('key', 'post_launch_optimization', 'label', 'Post-launch optimization')
    ),
    'companion_marketplace_route', '/app/companion-marketplace',
    'companion_marketplace_note', 'Phase 113 Companion Marketplace — cross-link for companion deployment catalog (scaffold if not yet shipped).',
    'boundary_note', 'Deployment requires human approval — Companions augment people, never replace accountability.'
  );
$$;

create or replace function public._gpocbp114_customer_success_metrics()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Customer Success Engine metrics — outcome stewardship metadata.',
    'metrics', jsonb_build_array(
      'adoption_rate', 'user_satisfaction', 'support_reduction', 'knowledge_usage',
      'companion_engagement', 'renewal_likelihood', 'operational_efficiency',
      'business_value', 'customer_advocacy', 'expansion_potential'
    ),
    'cross_link', '/app/customer-lifecycle'
  );
$$;

create or replace function public._gpocbp114_partner_health_scores()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Partner Health Scores — ten stewardship dimensions.',
    'areas', jsonb_build_array(
      'customer_retention', 'implementation_success', 'training_effectiveness', 'support_quality',
      'customer_satisfaction', 'governance_compliance', 'revenue_stability',
      'community_contributions', 'knowledge_sharing', 'partner_growth'
    )
  );
$$;

create or replace function public._gpocbp114_training_academy()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Training Academy — ten programs for Growth Partner competence.',
    'programs', public._gpoc_training_program_scaffolds(),
    'cross_links', jsonb_build_array(
      jsonb_build_object('key', 'certification_achievement', 'label', 'Certification & Achievement A.37', 'route', '/app/certification-achievement-engine', 'note', 'Internal team certs — distinct from partner certification'),
      jsonb_build_object('key', 'learning_training', 'label', 'Learning & Training A.36', 'route', '/app/learning-training-engine', 'note', 'Training delivery cross-link')
    )
  );
$$;

create or replace function public._gpocbp114_certification_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Certification Framework — six levels mapped to _pce_tier_label() without renaming DB seeds.',
    'levels', public._gpoc_certification_level_mappings(),
    'requirements', jsonb_build_array('training', 'experience', 'governance_understanding', 'customer_outcomes', 'ongoing_education'),
    'partner_certification_route', '/app/partners',
    'boundary_note', 'Phase 91 certification RPCs remain authoritative — cross-link NOT duplicate.'
  );
$$;

create or replace function public._gpocbp114_knowledge_distribution()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Knowledge Distribution — approved assets for partner delivery.',
    'assets', jsonb_build_array(
      'templates', 'playbooks', 'implementation_guides', 'executive_briefings',
      'industry_frameworks', 'kc_assets', 'companion_best_practices',
      'security_guidance', 'governance_models', 'success_stories'
    ),
    'knowledge_center_route', '/app/knowledge-center-engine'
  );
$$;

create or replace function public._gpocbp114_renewal_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Renewal Center — contract stewardship and intervention metadata.',
    'tracking', jsonb_build_array(
      'contract_renewals', 'expansion_opportunities', 'health_deterioration',
      'companion_adoption_declines', 'training_gaps', 'support_trends',
      'executive_engagement', 'risk_alerts', 'recommended_interventions'
    ),
    'boundary_note', 'Renewal recommendations require human approval — no automated contract changes.'
  );
$$;

create or replace function public._gpocbp114_partner_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Partner Insights — questions that guide responsible scaling.',
    'questions', jsonb_build_array(
      'Which industries perform best?',
      'Which Companions deliver highest value?',
      'Which customers need intervention?',
      'Where are expansion opportunities?',
      'Which training programs improve outcomes?',
      'How is governance evolving across the portfolio?'
    ),
    'boundary_note', 'Insights are illustrative metadata — humans decide interventions.'
  );
$$;

create or replace function public._gpocbp114_marketplace_integration()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Marketplace integration — partner service offerings cross-linked to marketplace surfaces.',
    'offerings', jsonb_build_array(
      'implementation_packages', 'training_programs', 'industry_specializations',
      'governance_assessments', 'executive_advisory', 'optimization_programs',
      'companion_deployment_services', 'customer_success_packages'
    ),
    'cross_links', jsonb_build_array(
      jsonb_build_object('key', 'marketplace_phase112', 'label', 'Marketplace Blueprint 112', 'route', '/app/marketplace'),
      jsonb_build_object('key', 'marketplace_partner_ecosystem', 'label', 'Marketplace Partner Ecosystem A.45', 'route', '/app/marketplace-partner-ecosystem-foundation-engine')
    )
  );
$$;

create or replace function public._gpocbp114_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Security requirements — RBAC, segmentation, audit, and mandatory 2FA for sensitive partner roles.',
    'requirements', jsonb_build_array(
      'rbac', 'customer_access_segmentation', 'audit_logging', 'activity_monitoring',
      'data_isolation', 'mandatory_2fa_sensitive_roles', 'qr_enrollment',
      'recovery_codes', 'session_visibility'
    ),
    'two_factor_route', '/app/settings/two-factor',
    'migration_note', 'Cross-link migration 20261202000000_two_factor_authentication_system.sql',
    'boundary_note', 'Partner ops stores metadata only — no customer email, chat, or PII.'
  );
$$;

create or replace function public._gpocbp114_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'partner_certification', 'label', 'Partner Certification Phase 91 + Blueprint 107', 'route', '/app/partners', 'relationship', 'Certification & ecosystem — cross-link NOT duplicate'),
    jsonb_build_object('key', 'partner_success', 'label', 'Partner Success A.73', 'route', '/app/partner-success-engine', 'relationship', 'Portfolio health for customer orgs — complementary'),
    jsonb_build_object('key', 'companion_marketplace', 'label', 'Companion Marketplace Phase 113', 'route', '/app/companion-marketplace', 'relationship', 'Companion deployment cross-link — scaffold if not shipped'),
    jsonb_build_object('key', 'marketplace', 'label', 'Marketplace Blueprint 112', 'route', '/app/marketplace', 'relationship', 'Partner offerings'),
    jsonb_build_object('key', 'marketplace_partner_ecosystem', 'label', 'Marketplace Partner Ecosystem A.45', 'route', '/app/marketplace-partner-ecosystem-foundation-engine', 'relationship', 'Ecosystem foundation'),
    jsonb_build_object('key', 'customer_lifecycle', 'label', 'Customer Lifecycle Phase 86 / Blueprint 108', 'route', '/app/customer-lifecycle', 'relationship', 'Customer journey'),
    jsonb_build_object('key', 'certification_achievement', 'label', 'Certification & Achievement A.37', 'route', '/app/certification-achievement-engine', 'relationship', 'Internal certs distinct'),
    jsonb_build_object('key', 'learning_training', 'label', 'Learning & Training A.36', 'route', '/app/learning-training-engine', 'relationship', 'Training cross-link'),
    jsonb_build_object('key', 'sales_expert', 'label', 'Sales Expert OS A.79', 'route', '/app/sales-expert-engine', 'relationship', 'Sales Expert as Growth Partner type'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-Factor Authentication', 'route', '/app/settings/two-factor', 'relationship', 'Mandatory 2FA for sensitive partner roles')
  );
$$;

create or replace function public._gpocbp114_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Limitation principles — wisdom before speed; stewardship through responsibility.',
    'must_avoid', jsonb_build_array(
      'Affiliate or extraction framing — Growth Partner terminology only',
      'Silent auto-progression of implementations or renewals',
      'Storing customer email, chat, or PII in partner operations tables',
      'Duplicating Phase 91/107 partner certification RPCs or directory logic',
      'Pressure-based partner growth targets that bypass human governance'
    ),
    'required', jsonb_build_array(
      'human_oversight_required default true',
      'Metadata-only portfolio and communication history',
      'Cross-link authoritative surfaces — certification, marketplace, customer lifecycle',
      'Mandatory 2FA for sensitive partner roles when enabled in settings',
      'Audit logging for significant partner operational events'
    ),
    'boundary_note', 'Growth Partner Operations Center orchestrates delivery — humans approve significant actions.'
  );
$$;

create or replace function public._gpocbp114_companion_adaptation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Growth Partner Operations Companion — warm, professional stewardship. Companionship before replacement.',
    'companion_name', 'Growth Partner Operations Companion',
    'not_label', 'AI partner management bot',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'implementation_review', 'prompt', 'Two customers approach renewal windows — shall Aipify prepare a calm portfolio summary for your review?', 'consideration', 'Wisdom before speed — humans decide interventions'),
      jsonb_build_object('emoji', '🌹', 'key', 'training_stewardship', 'prompt', 'Training completion metadata is improving — would celebrating one milestone before taking on new implementations feel wise?', 'consideration', 'Self Love — sustainable partner businesses'),
      jsonb_build_object('emoji', '🔔', 'key', 'companion_deployment', 'prompt', 'A pilot deployment is ready for governance review — Companion Marketplace cross-link available when you are.', 'consideration', 'Humans approve companion rollouts')
    ),
    'boundary_note', 'Companion adapts tone — never impersonates the partner or customer.'
  );
$$;

create or replace function public._gpocbp114_success_metrics()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'higher_retention', 'label', 'Higher retention'),
    jsonb_build_object('key', 'improved_implementations', 'label', 'Improved implementations'),
    jsonb_build_object('key', 'greater_satisfaction', 'label', 'Greater satisfaction'),
    jsonb_build_object('key', 'expanded_ecosystem', 'label', 'Expanded ecosystem'),
    jsonb_build_object('key', 'increased_adoption', 'label', 'Increased adoption'),
    jsonb_build_object('key', 'stronger_governance', 'label', 'Stronger governance'),
    jsonb_build_object('key', 'healthier_relationships', 'label', 'Healthier relationships'),
    jsonb_build_object('key', 'sustainable_partner_businesses', 'label', 'Sustainable partner businesses'),
    jsonb_build_object('key', 'improved_transformation_outcomes', 'label', 'Improved transformation outcomes')
  );
$$;

create or replace function public._gpocbp114_integration_links()
returns jsonb language sql immutable as $$
  select public._gpocbp114_cross_links();
$$;

create or replace function public._gpocbp114_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._gpoc_ensure_settings(p_tenant_id);
  perform public._gpoc_seed_customers(p_tenant_id);
  perform public._gpoc_seed_implementations(p_tenant_id);
  perform public._gpoc_seed_renewals(p_tenant_id);
  perform public._gpoc_seed_health_snapshots(p_tenant_id);
  v_metrics := public._gpoc_refresh_metrics(p_tenant_id);

  return jsonb_build_object(
    'partner_health_score', coalesce((v_metrics->>'partner_health_score')::numeric, 0),
    'active_customers', coalesce((v_metrics->>'active_customers')::int, 0),
    'upcoming_renewals', coalesce((v_metrics->>'upcoming_renewals')::int, 0),
    'open_renewal_items', coalesce((v_metrics->>'open_renewal_items')::int, 0),
    'operations_modules_count', jsonb_array_length(public._gpocbp114_operations_center_modules()),
    'training_programs_count', coalesce((v_metrics->>'training_programs_count')::int, 0),
    'implementation_stages_count', coalesce((v_metrics->>'implementation_stages_count')::int, 0),
    'certification_levels_count', coalesce((v_metrics->>'certification_levels_count')::int, 0),
    'cross_links_count', jsonb_array_length(public._gpocbp114_cross_links()),
    'privacy_note', 'Aggregate partner operations counts and blueprint scaffolds only — metadata, no customer PII.'
  );
end; $$;

create or replace function public._gpocbp114_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._gpoc_ensure_settings(p_tenant_id);
  perform public._gpoc_seed_customers(p_tenant_id);
  perform public._gpoc_seed_implementations(p_tenant_id);
  perform public._gpoc_seed_renewals(p_tenant_id);
  perform public._gpoc_seed_health_snapshots(p_tenant_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'operations_modules', 'label', 'Operations Center modules — eleven documented', 'met', jsonb_array_length(public._gpocbp114_operations_center_modules()) >= 10, 'note', null),
    jsonb_build_object('key', 'implementation_stages', 'label', 'Implementation Center — ten stages', 'met', jsonb_array_length(public._gpoc_implementation_stage_templates()) = 10, 'note', null),
    jsonb_build_object('key', 'training_programs', 'label', 'Training Academy — ten programs', 'met', jsonb_array_length(public._gpoc_training_program_scaffolds()) = 10, 'note', null),
    jsonb_build_object('key', 'certification_levels', 'label', 'Certification framework — six levels mapped to _pce_tier_label()', 'met', jsonb_array_length(public._gpoc_certification_level_mappings()) = 6, 'note', null),
    jsonb_build_object('key', 'partner_health_areas', 'label', 'Partner health scores — ten areas', 'met', jsonb_array_length(public._gpocbp114_partner_health_scores()->'areas') = 10, 'note', null),
    jsonb_build_object('key', 'cross_links', 'label', 'Mandatory distinction cross-links documented', 'met', jsonb_array_length(public._gpocbp114_cross_links()) >= 10, 'note', null),
    jsonb_build_object('key', 'companion_marketplace_scaffold', 'label', 'Companion Marketplace Phase 113 cross-link scaffold', 'met', (public._gpocbp114_companion_deployment_center()->>'companion_marketplace_route') = '/app/companion-marketplace', 'note', null),
    jsonb_build_object('key', 'security_2fa_cross_link', 'label', 'Security — 2FA cross-link to /app/settings/two-factor', 'met', (public._gpocbp114_security_requirements()->>'two_factor_route') = '/app/settings/two-factor', 'note', null),
    jsonb_build_object('key', 'limitation_principles', 'label', 'Limitation principles — no Affiliate terminology', 'met', jsonb_array_length(public._gpocbp114_limitation_principles()->'must_avoid') >= 4, 'note', null),
    jsonb_build_object('key', 'human_oversight', 'label', 'human_oversight_required default true', 'met', exists (select 1 from public.growth_partner_operations_settings s where s.tenant_id = p_tenant_id and s.human_oversight_required = true), 'note', null),
    jsonb_build_object('key', 'metadata_only', 'label', 'Portfolio metadata only — no PII content fields', 'met', true, 'note', 'Communication history is counts only'),
    jsonb_build_object('key', 'success_metrics', 'label', 'Success metrics — nine documented', 'met', jsonb_array_length(public._gpocbp114_success_metrics()) = 9, 'note', null),
    jsonb_build_object('key', 'companion_adaptation', 'label', 'Companion adaptation — 🦉🌹🔔 examples', 'met', jsonb_array_length(public._gpocbp114_companion_adaptation()->'examples') >= 3, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 114 baseline tables and RPCs', 'met', to_regclass('public.growth_partner_operations_settings') is not null, 'note', '_gpoc_* helpers intact')
  );
end; $$;

create or replace function public._gpocbp114_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 114 — Growth Partner Operations Center Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE114_GROWTH_PARTNER_OPERATIONS_CENTER.md',
    'engine_phase', 'Repo Phase 114 Growth Partner Operations Center Engine',
    'route', '/app/growth-partner-operations',
    'mapping_note', 'Distinct Growth Partner operational workspace — certification at /app/partners remains authoritative.',
    'distinction_note', public._gpocbp114_distinction_note(),
    'mission', public._gpocbp114_mission(),
    'philosophy', public._gpocbp114_philosophy(),
    'abos_principle', public._gpocbp114_abos_principle(),
    'objectives', public._gpocbp114_objectives(),
    'operations_center_modules', public._gpocbp114_operations_center_modules(),
    'partner_dashboard', public._gpocbp114_partner_dashboard(),
    'customer_portfolio', public._gpocbp114_customer_portfolio(),
    'implementation_center', public._gpocbp114_implementation_center(),
    'companion_deployment_center', public._gpocbp114_companion_deployment_center(),
    'customer_success_metrics', public._gpocbp114_customer_success_metrics(),
    'partner_health_scores', public._gpocbp114_partner_health_scores(),
    'training_academy', public._gpocbp114_training_academy(),
    'certification_framework', public._gpocbp114_certification_framework(),
    'knowledge_distribution', public._gpocbp114_knowledge_distribution(),
    'renewal_center', public._gpocbp114_renewal_center(),
    'partner_insights', public._gpocbp114_partner_insights(),
    'marketplace_integration', public._gpocbp114_marketplace_integration(),
    'security_requirements', public._gpocbp114_security_requirements(),
    'cross_links', public._gpocbp114_cross_links(),
    'limitation_principles', public._gpocbp114_limitation_principles(),
    'companion_adaptation', public._gpocbp114_companion_adaptation(),
    'success_metrics', public._gpocbp114_success_metrics(),
    'success_criteria', public._gpocbp114_success_criteria(p_tenant_id),
    'vision', public._gpocbp114_vision(),
    'integration_links', public._gpocbp114_integration_links(),
    'engagement_summary', public._gpocbp114_engagement_summary(p_tenant_id),
    'privacy_note', 'Growth Partner Operations blueprint data is metadata only — portfolio summaries and cross-links. Humans approve significant partner actions.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 9. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_growth_partner_operations_card(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.growth_partner_operations_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._gpoc_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._gpoc_ensure_settings(v_tenant_id);
  perform public._gpoc_seed_customers(v_tenant_id);
  perform public._gpoc_seed_implementations(v_tenant_id);
  perform public._gpoc_seed_renewals(v_tenant_id);
  perform public._gpoc_seed_health_snapshots(v_tenant_id);
  v_metrics := public._gpoc_refresh_metrics(v_tenant_id);
  v_engagement := public._gpocbp114_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'partner_health_score', v_metrics->'partner_health_score',
    'active_customers', v_metrics->'active_customers',
    'upcoming_renewals', v_metrics->'upcoming_renewals',
    'philosophy', public._gpocbp114_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint_phase114', jsonb_build_object(
      'phase', 'Phase 114 — Growth Partner Operations Center Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE114_GROWTH_PARTNER_OPERATIONS_CENTER.md',
      'engine_phase', 'Repo Phase 114 Growth Partner Operations Center Engine',
      'route', '/app/growth-partner-operations',
      'mapping_note', 'Distinct operational workspace — /app/partners certification remains authoritative.'
    ),
    'growth_partner_operations_mission', public._gpocbp114_mission(),
    'growth_partner_operations_abos_principle', public._gpocbp114_abos_principle(),
    'growth_partner_operations_engagement_summary', v_engagement,
    'growth_partner_operations_note', 'Growth Partner Operations Center — People First. Technology Second. Stewardship through responsibility.',
    'growth_partner_operations_vision_note', public._gpocbp114_vision()
  );
end; $$;

create or replace function public.get_growth_partner_operations_dashboard(p_tenant_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.growth_partner_operations_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._gpoc_require_tenant());
  v_settings := public._gpoc_ensure_settings(v_tenant_id);
  perform public._gpoc_seed_customers(v_tenant_id);
  perform public._gpoc_seed_implementations(v_tenant_id);
  perform public._gpoc_seed_renewals(v_tenant_id);
  perform public._gpoc_seed_health_snapshots(v_tenant_id);
  v_metrics := public._gpoc_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', v_settings.human_oversight_required,
    'operations_enabled', v_settings.operations_enabled,
    'portfolio_segmentation_enabled', v_settings.portfolio_segmentation_enabled,
    'mandatory_2fa_for_sensitive_roles', v_settings.mandatory_2fa_for_sensitive_roles,
    'philosophy', public._gpocbp114_philosophy(),
    'safety_note', 'Growth Partner Operations Center — metadata-only portfolio. Certification at /app/partners remains authoritative. Humans approve significant partner actions.',
    'partner_health_score', v_metrics->'partner_health_score',
    'active_customers', v_metrics->'active_customers',
    'upcoming_renewals', v_metrics->'upcoming_renewals',
    'implementations_in_progress', v_metrics->'implementations_in_progress',
    'open_renewal_items', v_metrics->'open_renewal_items',
    'risk_signals_count', v_metrics->'risk_signals_count',
    'training_programs_count', v_metrics->'training_programs_count',
    'implementation_stages_count', v_metrics->'implementation_stages_count',
    'certification_levels_count', v_metrics->'certification_levels_count',
    'portfolio_customers', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'customer_org_key', c.customer_org_key,
        'org_profile_summary', c.org_profile_summary,
        'industry_classification', c.industry_classification,
        'companions_deployed_count', c.companions_deployed_count,
        'implementation_status', c.implementation_status,
        'training_progress_pct', c.training_progress_pct,
        'renewal_date', c.renewal_date,
        'health_score', c.health_score,
        'growth_opportunities_count', c.growth_opportunities_count,
        'risk_signals_count', c.risk_signals_count
      ) order by c.health_score desc)
      from public.growth_partner_operations_customers c where c.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'implementations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'current_stage', i.current_stage, 'progress_pct', i.progress_pct,
        'milestones', i.milestones, 'tasks', i.tasks, 'owners', i.owners
      ) order by i.updated_at desc)
      from public.growth_partner_operations_implementations i where i.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'renewal_items', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'renewal_type', r.renewal_type, 'title', r.title,
        'summary', r.summary, 'due_date', r.due_date, 'priority', r.priority, 'status', r.status
      ) order by r.due_date nulls last)
      from public.growth_partner_operations_renewals r
      where r.tenant_id = v_tenant_id and r.status in ('open', 'in_review')
    ), '[]'::jsonb),
    'health_snapshot', coalesce((
      select jsonb_build_object(
        'partner_health_score', h.partner_health_score,
        'customer_retention_score', h.customer_retention_score,
        'implementation_success_score', h.implementation_success_score,
        'training_effectiveness_score', h.training_effectiveness_score,
        'support_quality_score', h.support_quality_score,
        'customer_satisfaction_score', h.customer_satisfaction_score,
        'governance_compliance_score', h.governance_compliance_score,
        'revenue_stability_score', h.revenue_stability_score,
        'community_contributions_score', h.community_contributions_score,
        'knowledge_sharing_score', h.knowledge_sharing_score,
        'partner_growth_score', h.partner_growth_score,
        'summary', h.summary,
        'captured_at', h.captured_at
      )
      from public.growth_partner_operations_health_snapshots h
      where h.tenant_id = v_tenant_id order by h.captured_at desc limit 1
    ), '{}'::jsonb),
    'implementation_stage_templates', public._gpoc_implementation_stage_templates(),
    'training_programs', public._gpoc_training_program_scaffolds(),
    'certification_levels', public._gpoc_certification_level_mappings(),
    'integration_links', public._gpocbp114_integration_links(),
    'implementation_blueprint_phase114', jsonb_build_object(
      'phase', 'Phase 114 — Growth Partner Operations Center Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE114_GROWTH_PARTNER_OPERATIONS_CENTER.md',
      'engine_phase', 'Repo Phase 114 Growth Partner Operations Center Engine',
      'route', '/app/growth-partner-operations',
      'mapping_note', 'Distinct operational workspace — certification at /app/partners remains authoritative.'
    ),
    'growth_partner_operations_engine_note', 'Growth Partner Operations Center Engine (ABOS Phase 114) — independent operational workspace for Growth Partners. Cross-link /app/partners — do NOT duplicate.',
    'growth_partner_operations_blueprint', public._gpocbp114_blueprint_block(v_tenant_id),
    'growth_partner_operations_distinction_note', public._gpocbp114_distinction_note(),
    'growth_partner_operations_mission', public._gpocbp114_mission(),
    'growth_partner_operations_philosophy', public._gpocbp114_philosophy(),
    'growth_partner_operations_abos_principle', public._gpocbp114_abos_principle(),
    'growth_partner_operations_objectives', public._gpocbp114_objectives(),
    'operations_center_modules', public._gpocbp114_operations_center_modules(),
    'partner_dashboard_meta', public._gpocbp114_partner_dashboard(),
    'customer_portfolio_meta', public._gpocbp114_customer_portfolio(),
    'implementation_center_meta', public._gpocbp114_implementation_center(),
    'companion_deployment_center_meta', public._gpocbp114_companion_deployment_center(),
    'customer_success_metrics_meta', public._gpocbp114_customer_success_metrics(),
    'partner_health_scores_meta', public._gpocbp114_partner_health_scores(),
    'training_academy_meta', public._gpocbp114_training_academy(),
    'certification_framework_meta', public._gpocbp114_certification_framework(),
    'knowledge_distribution_meta', public._gpocbp114_knowledge_distribution(),
    'renewal_center_meta', public._gpocbp114_renewal_center(),
    'partner_insights_meta', public._gpocbp114_partner_insights(),
    'marketplace_integration_meta', public._gpocbp114_marketplace_integration(),
    'security_requirements_meta', public._gpocbp114_security_requirements(),
    'gpocbp114_cross_links', public._gpocbp114_cross_links(),
    'growth_partner_operations_limitation_principles', public._gpocbp114_limitation_principles(),
    'growth_partner_operations_companion_adaptation', public._gpocbp114_companion_adaptation(),
    'gpocbp114_integration_links', public._gpocbp114_integration_links(),
    'growth_partner_operations_engagement_summary', public._gpocbp114_engagement_summary(v_tenant_id),
    'growth_partner_operations_success_criteria', public._gpocbp114_success_criteria(v_tenant_id),
    'growth_partner_operations_success_metrics', public._gpocbp114_success_metrics(),
    'growth_partner_operations_vision', public._gpocbp114_vision(),
    'growth_partner_operations_privacy_note', 'Growth Partner Operations metadata only — portfolio summaries and cross-links. No customer email, chat, or PII. Humans approve significant partner actions.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'growth-partner-operations', 'Growth Partner Operations Center',
  'Growth Partner operational workspace — customer portfolio, implementations, training, renewals, and partner health stewardship.',
  'authenticated', 135
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'growth-partner-operations' and tenant_id is null
);

grant execute on function public.get_growth_partner_operations_card(uuid) to authenticated;
grant execute on function public.get_growth_partner_operations_dashboard(uuid) to authenticated;
grant execute on function public._gpocbp114_distinction_note() to authenticated;
grant execute on function public._gpocbp114_mission() to authenticated;
grant execute on function public._gpocbp114_philosophy() to authenticated;
grant execute on function public._gpocbp114_abos_principle() to authenticated;
grant execute on function public._gpocbp114_vision() to authenticated;
grant execute on function public._gpocbp114_objectives() to authenticated;
grant execute on function public._gpocbp114_operations_center_modules() to authenticated;
grant execute on function public._gpocbp114_partner_dashboard() to authenticated;
grant execute on function public._gpocbp114_customer_portfolio() to authenticated;
grant execute on function public._gpocbp114_implementation_center() to authenticated;
grant execute on function public._gpocbp114_companion_deployment_center() to authenticated;
grant execute on function public._gpocbp114_customer_success_metrics() to authenticated;
grant execute on function public._gpocbp114_partner_health_scores() to authenticated;
grant execute on function public._gpocbp114_training_academy() to authenticated;
grant execute on function public._gpocbp114_certification_framework() to authenticated;
grant execute on function public._gpocbp114_knowledge_distribution() to authenticated;
grant execute on function public._gpocbp114_renewal_center() to authenticated;
grant execute on function public._gpocbp114_partner_insights() to authenticated;
grant execute on function public._gpocbp114_marketplace_integration() to authenticated;
grant execute on function public._gpocbp114_security_requirements() to authenticated;
grant execute on function public._gpocbp114_cross_links() to authenticated;
grant execute on function public._gpocbp114_limitation_principles() to authenticated;
grant execute on function public._gpocbp114_companion_adaptation() to authenticated;
grant execute on function public._gpocbp114_success_metrics() to authenticated;
grant execute on function public._gpocbp114_integration_links() to authenticated;
grant execute on function public._gpocbp114_engagement_summary(uuid) to authenticated;
grant execute on function public._gpocbp114_success_criteria(uuid) to authenticated;
grant execute on function public._gpocbp114_blueprint_block(uuid) to authenticated;
