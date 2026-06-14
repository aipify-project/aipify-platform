-- Phase 148 — Global Ecosystem Marketplace & Solution Exchange Engine
-- Global Intelligence & Interorganizational Era (141–150).
-- Distinct from Skills Marketplace Phase 69/112 (/app/marketplace — do NOT duplicate _mkp_*, _sembp112_*).
-- Helpers: _gseme_* (engine), _gsembp148_* (blueprint — never collide with _mkp_*, _cmpm_*, _mgq_*)

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
    'global_knowledge_exchange',
    'global_ecosystem_marketplace'
  )
);

-- ---------------------------------------------------------------------------
-- 1. global_ecosystem_marketplace_settings
-- ---------------------------------------------------------------------------
create table if not exists public.global_ecosystem_marketplace_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default false,
  participation_status text not null default 'disabled' check (
    participation_status in ('disabled', 'viewer', 'publisher')
  ),
  procurement_preferences jsonb not null default '{}'::jsonb,
  approval_required boolean not null default true,
  executive_approval_required boolean not null default true,
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.global_ecosystem_marketplace_settings enable row level security;
revoke all on public.global_ecosystem_marketplace_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. global_solution_listings
-- ---------------------------------------------------------------------------
create table if not exists public.global_solution_listings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  listing_key text not null,
  solution_key text not null,
  category text not null check (
    category in (
      'executive_playbooks', 'support_frameworks', 'commerce_packages', 'companion_skills',
      'knowledge_libraries', 'transformation_programs', 'governance_templates',
      'workflow_automations', 'industry_packs', 'gp_service_offerings'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  industry_tags text[] not null default '{}',
  publisher_org_key text,
  validation_status text not null default 'pending' check (
    validation_status in ('pending', 'in_review', 'approved', 'rejected', 'archived')
  ),
  procurement_metadata jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now(),
  unique (tenant_id, listing_key)
);

create index if not exists global_solution_listings_tenant_idx
  on public.global_solution_listings (tenant_id, validation_status, submitted_at desc);

alter table public.global_solution_listings enable row level security;
revoke all on public.global_solution_listings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. global_solution_validations
-- ---------------------------------------------------------------------------
create table if not exists public.global_solution_validations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  listing_id uuid not null references public.global_solution_listings (id) on delete cascade,
  validation_key text not null,
  documentation_quality_score numeric,
  governance_alignment_score numeric,
  security_checklist_score numeric,
  knowledge_completeness_score numeric,
  customer_value_score numeric,
  reviewer_notes text check (char_length(reviewer_notes) <= 500),
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'needs_revision')
  ),
  metadata jsonb not null default '{}'::jsonb,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (tenant_id, validation_key)
);

create index if not exists global_solution_validations_tenant_idx
  on public.global_solution_validations (tenant_id, status, created_at desc);

alter table public.global_solution_validations enable row level security;
revoke all on public.global_solution_validations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. global_solution_contributions
-- ---------------------------------------------------------------------------
create table if not exists public.global_solution_contributions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  contribution_key text not null,
  contribution_type text not null check (
    contribution_type in (
      'template', 'playbook', 'framework', 'knowledge_asset', 'methodology',
      'companion_skill', 'transformation_resource', 'workflow_template', 'industry_pack'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  industry_tag text,
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected')
  ),
  metadata jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  unique (tenant_id, contribution_key)
);

create index if not exists global_solution_contributions_tenant_idx
  on public.global_solution_contributions (tenant_id, status, submitted_at desc);

alter table public.global_solution_contributions enable row level security;
revoke all on public.global_solution_contributions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. global_ecosystem_marketplace_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.global_ecosystem_marketplace_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.global_ecosystem_marketplace_audit_logs enable row level security;
revoke all on public.global_ecosystem_marketplace_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'global_ecosystem_marketplace_engine', v.description
from (values
  ('global_ecosystem_marketplace.view', 'View Global Solution Marketplace', 'View solution listings, validations, and procurement metadata'),
  ('global_ecosystem_marketplace.manage', 'Manage Global Solution Marketplace', 'Update participation settings, review validations, and governance metadata'),
  ('global_ecosystem_marketplace.contribute', 'Contribute to Global Solution Marketplace', 'Submit solution listings and contribution metadata for governance review')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'global_ecosystem_marketplace.view'), ('owner', 'global_ecosystem_marketplace.manage'), ('owner', 'global_ecosystem_marketplace.contribute'),
  ('administrator', 'global_ecosystem_marketplace.view'), ('administrator', 'global_ecosystem_marketplace.manage'), ('administrator', 'global_ecosystem_marketplace.contribute'),
  ('manager', 'global_ecosystem_marketplace.view'), ('manager', 'global_ecosystem_marketplace.contribute'),
  ('employee', 'global_ecosystem_marketplace.view'),
  ('support_agent', 'global_ecosystem_marketplace.view'),
  ('moderator', 'global_ecosystem_marketplace.view'),
  ('viewer', 'global_ecosystem_marketplace.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Engine helpers (_gseme_)
-- ---------------------------------------------------------------------------
create or replace function public._gseme_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._gseme_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._gseme_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._gseme_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.global_ecosystem_marketplace_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._gseme_ensure_settings(p_tenant_id uuid)
returns public.global_ecosystem_marketplace_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.global_ecosystem_marketplace_settings;
begin
  insert into public.global_ecosystem_marketplace_settings (tenant_id, enabled, participation_status)
  values (p_tenant_id, false, 'disabled')
  on conflict (tenant_id) do nothing;
  select * into v_settings from public.global_ecosystem_marketplace_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._gseme_seed_catalog_listings(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.global_solution_listings where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.global_solution_listings (
    tenant_id, listing_key, solution_key, category, title, summary, industry_tags,
    publisher_org_key, validation_status, procurement_metadata
  ) values
    (p_tenant_id, 'exec-playbook-onboarding', 'exec-playbook-onboarding', 'executive_playbooks',
     'Executive onboarding playbook scaffold', 'Metadata scaffold for executive onboarding solution exchange — no raw customer content.',
     array['professional_services'], 'platform-catalog', 'approved',
     jsonb_build_object('creator_identity', 'verified_publisher', 'gp_involvement', 'optional')),
    (p_tenant_id, 'support-framework-escalation', 'support-framework-escalation', 'support_frameworks',
     'Support escalation framework scaffold', 'Governed support escalation framework metadata for professional exchange.',
     array['technology', 'retail'], 'platform-catalog', 'approved',
     jsonb_build_object('required_capabilities', jsonb_build_array('support_operations'))),
    (p_tenant_id, 'governance-template-stewardship', 'governance-template-stewardship', 'governance_templates',
     'Governance stewardship template scaffold', 'Governance framework marketplace metadata — cross-link marketplace governance.',
     array['financial_services'], 'platform-catalog', 'in_review',
     jsonb_build_object('implementation_considerations', 'Executive approval recommended'));
end; $$;

create or replace function public._gseme_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.global_ecosystem_marketplace_settings;
  v_listing_count int;
  v_approved_listings int;
  v_pending_listings int;
  v_validation_count int;
  v_contribution_count int;
  v_approved_contributions int;
  v_marketplace_score numeric;
begin
  select * into v_settings from public.global_ecosystem_marketplace_settings where tenant_id = p_tenant_id;
  select count(*) into v_listing_count from public.global_solution_listings where tenant_id = p_tenant_id;
  select count(*) into v_approved_listings from public.global_solution_listings where tenant_id = p_tenant_id and validation_status = 'approved';
  select count(*) into v_pending_listings from public.global_solution_listings where tenant_id = p_tenant_id and validation_status in ('pending', 'in_review');
  select count(*) into v_validation_count from public.global_solution_validations where tenant_id = p_tenant_id;
  select count(*) into v_contribution_count from public.global_solution_contributions where tenant_id = p_tenant_id;
  select count(*) into v_approved_contributions from public.global_solution_contributions where tenant_id = p_tenant_id and status = 'approved';

  v_marketplace_score := round(
    case when coalesce(v_settings.enabled, false) then 20 else 0 end
    + case v_settings.participation_status
        when 'publisher' then 25 when 'viewer' then 15 else 0
      end
    + least(v_approved_listings, 10) * 4
    + least(v_approved_contributions, 8) * 3,
    1
  );

  return jsonb_build_object(
    'marketplace_score', v_marketplace_score,
    'participation_status', coalesce(v_settings.participation_status, 'disabled'),
    'enabled', coalesce(v_settings.enabled, false),
    'listings_count', v_listing_count,
    'approved_listings_count', v_approved_listings,
    'pending_listings_count', v_pending_listings,
    'validations_count', v_validation_count,
    'contributions_count', v_contribution_count,
    'approved_contributions_count', v_approved_contributions,
    'cross_links_count', jsonb_array_length(public._gsembp148_integration_links()),
    'marketplace_categories_count', jsonb_array_length(public._gsembp148_marketplace_categories()->'categories'),
    'industry_packs_count', jsonb_array_length(public._gsembp148_industry_solution_pack_engine()->'industries')
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Blueprint helpers (_gsembp148_)
-- ---------------------------------------------------------------------------
create or replace function public._gsembp148_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 148 — Global Ecosystem Marketplace & Solution Exchange Engine at /app/global-ecosystem-marketplace-engine. Global Intelligence Era (141–150) — professional enterprise solution exchange, NOT a consumer app store or uncontrolled marketplace. Distinct from Skills Marketplace Phase 69/112 at /app/marketplace (skills & extensions — cross-link, do NOT duplicate _mkp_*, _sembp112_*). Distinct from Companion Marketplace Phase 113 at /app/companion-marketplace. Distinct from Marketplace Governance Phase 90 at /app/marketplace-governance. Helpers _gsembp148_* — never collide with _mkp_*, _cmpm_*, _mgq_*.';
$$;

create or replace function public._gsembp148_mission()
returns text language sql immutable as $$
  select 'Enable professional enterprise solution exchange — governed discovery of playbooks, frameworks, templates, and Growth Partner offerings. Metadata only — organizations retain procurement judgment.';
$$;

create or replace function public._gsembp148_philosophy()
returns text language sql immutable as $$
  select 'People First. Professional exchange for enterprise organizations — share wisdom responsibly, not consumer app store dynamics. Growth Partner terminology — never Affiliate. Procurement remains human-led. No raw customer content in listings.';
$$;

create or replace function public._gsembp148_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Global Solution Marketplace aggregates governed solution discovery visibility. Skills, companion, and module marketplaces remain authoritative for their catalogs. Aipify informs and prepares; procurement teams decide.';
$$;

create or replace function public._gsembp148_vision()
returns text language sql immutable as $$
  select 'A global professional solution exchange where organizations discover governed playbooks, frameworks, and Growth Partner offerings — with humility, transparency, and mutual support.';
$$;

create or replace function public._gsembp148_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'professional_exchange', 'label', 'Professional exchange', 'emoji', '🏢', 'description', 'Enterprise solution exchange — not consumer app store'),
    jsonb_build_object('key', 'governed_discovery', 'label', 'Governed discovery', 'emoji', '🔍', 'description', 'Validation workflows and procurement metadata'),
    jsonb_build_object('key', 'industry_packs', 'label', 'Industry solution packs', 'emoji', '📦', 'description', 'Ten industry scaffolds for governed packs'),
    jsonb_build_object('key', 'gp_marketplace', 'label', 'Growth Partner marketplace', 'emoji', '🌱', 'description', 'GP service offerings — never Affiliate'),
    jsonb_build_object('key', 'solution_validation', 'label', 'Solution validation', 'emoji', '✅', 'description', 'Documentation, governance, security checklists'),
    jsonb_build_object('key', 'procurement_readiness', 'label', 'Procurement readiness', 'emoji', '📋', 'description', 'Creator identity, capabilities, implementation considerations'),
    jsonb_build_object('key', 'marketplace_companion', 'label', 'Marketplace companion', 'emoji', '✨', 'description', 'Discovery support — does not override procurement'),
    jsonb_build_object('key', 'contribution_engine', 'label', 'Solution contributions', 'emoji', '📚', 'description', 'Templates, playbooks, frameworks — metadata counts')
  );
$$;

create or replace function public._gsembp148_global_solution_marketplace_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Global Solution Marketplace Center — eight professional exchange capabilities.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'companion_skills_cross_link', 'label', 'Companion skills marketplace cross-link', 'cross_link', '/app/marketplace'),
      jsonb_build_object('key', 'industry_playbook_exchange', 'label', 'Industry playbook exchange'),
      jsonb_build_object('key', 'gp_solution_marketplace', 'label', 'Growth Partner solution marketplace', 'cross_link', '/app/growth-partner-operations'),
      jsonb_build_object('key', 'workflow_template_exchange', 'label', 'Workflow template exchange'),
      jsonb_build_object('key', 'knowledge_asset_libraries', 'label', 'Knowledge asset libraries', 'cross_link', '/app/global-knowledge-exchange-engine'),
      jsonb_build_object('key', 'governance_framework_marketplace', 'label', 'Governance framework marketplace', 'cross_link', '/app/ecosystem-governance'),
      jsonb_build_object('key', 'executive_toolkit_exchange', 'label', 'Executive toolkit exchange'),
      jsonb_build_object('key', 'professional_services_discovery', 'label', 'Professional services discovery', 'cross_link', '/app/global-talent-expert-network-engine')
    )
  );
$$;

create or replace function public._gsembp148_marketplace_categories()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Marketplace categories — ten professional solution types.',
    'categories', jsonb_build_array(
      jsonb_build_object('key', 'executive_playbooks', 'label', 'Executive playbooks'),
      jsonb_build_object('key', 'support_frameworks', 'label', 'Support frameworks'),
      jsonb_build_object('key', 'commerce_packages', 'label', 'Commerce packages'),
      jsonb_build_object('key', 'companion_skills', 'label', 'Companion skills', 'cross_link', '/app/marketplace'),
      jsonb_build_object('key', 'knowledge_libraries', 'label', 'Knowledge libraries', 'cross_link', '/app/global-knowledge-exchange-engine'),
      jsonb_build_object('key', 'transformation_programs', 'label', 'Transformation programs'),
      jsonb_build_object('key', 'governance_templates', 'label', 'Governance templates', 'cross_link', '/app/marketplace-governance'),
      jsonb_build_object('key', 'workflow_automations', 'label', 'Workflow automations'),
      jsonb_build_object('key', 'industry_packs', 'label', 'Industry packs'),
      jsonb_build_object('key', 'gp_service_offerings', 'label', 'GP service offerings', 'cross_link', '/app/partners')
    )
  );
$$;

create or replace function public._gsembp148_industry_solution_pack_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Industry solution pack engine — ten industry scaffolds for governed packs.',
    'industries', jsonb_build_array(
      jsonb_build_object('key', 'healthcare', 'label', 'Healthcare'),
      jsonb_build_object('key', 'financial_services', 'label', 'Financial services'),
      jsonb_build_object('key', 'retail', 'label', 'Retail'),
      jsonb_build_object('key', 'manufacturing', 'label', 'Manufacturing'),
      jsonb_build_object('key', 'technology', 'label', 'Technology'),
      jsonb_build_object('key', 'education', 'label', 'Education'),
      jsonb_build_object('key', 'professional_services', 'label', 'Professional services'),
      jsonb_build_object('key', 'government', 'label', 'Government'),
      jsonb_build_object('key', 'hospitality', 'label', 'Hospitality'),
      jsonb_build_object('key', 'non_profit', 'label', 'Non-profit')
    )
  );
$$;

create or replace function public._gsembp148_growth_partner_marketplace_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Growth Partner marketplace engine — implementation packages and transformation services. Never Affiliate.',
    'offerings', jsonb_build_array(
      jsonb_build_object('key', 'implementation_packages', 'label', 'Implementation packages', 'cross_link', '/app/partners'),
      jsonb_build_object('key', 'training_programs', 'label', 'Training programs'),
      jsonb_build_object('key', 'operational_frameworks', 'label', 'Operational frameworks'),
      jsonb_build_object('key', 'industry_accelerators', 'label', 'Industry accelerators'),
      jsonb_build_object('key', 'companion_configurations', 'label', 'Companion configurations', 'cross_link', '/app/companion-marketplace'),
      jsonb_build_object('key', 'transformation_services', 'label', 'Transformation services'),
      jsonb_build_object('key', 'knowledge_assets', 'label', 'Knowledge assets', 'cross_link', '/app/growth-partner-operations')
    ),
    'gp_route', '/app/growth-partner-operations',
    'partners_route', '/app/partners'
  );
$$;

create or replace function public._gsembp148_solution_validation_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Solution validation framework — governance-aligned review metadata.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'documentation_quality', 'label', 'Documentation quality'),
      jsonb_build_object('key', 'professional_standards', 'label', 'Professional standards'),
      jsonb_build_object('key', 'governance_alignment', 'label', 'Governance alignment', 'cross_link', '/app/marketplace-governance'),
      jsonb_build_object('key', 'security_checklist', 'label', 'Security checklist'),
      jsonb_build_object('key', 'knowledge_completeness', 'label', 'Knowledge completeness'),
      jsonb_build_object('key', 'customer_value', 'label', 'Customer value')
    ),
    'governance_route', '/app/marketplace-governance'
  );
$$;

create or replace function public._gsembp148_procurement_readiness_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Procurement readiness engine — metadata for informed procurement decisions.',
    'fields', jsonb_build_array(
      jsonb_build_object('key', 'creator_identity', 'label', 'Creator identity verification'),
      jsonb_build_object('key', 'applicable_industries', 'label', 'Applicable industries'),
      jsonb_build_object('key', 'required_capabilities', 'label', 'Required capabilities'),
      jsonb_build_object('key', 'implementation_considerations', 'label', 'Implementation considerations'),
      jsonb_build_object('key', 'gp_involvement', 'label', 'Growth Partner involvement'),
      jsonb_build_object('key', 'support_pathways', 'label', 'Support pathways')
    )
  );
$$;

create or replace function public._gsembp148_marketplace_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Marketplace companion — solution discovery and implementation preparation. Does NOT replace procurement judgment.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'solution_discovery', 'label', 'Solution discovery'),
      jsonb_build_object('key', 'recommendations', 'label', 'Recommendations — explainable, not guaranteed outcomes'),
      jsonb_build_object('key', 'industry_matching', 'label', 'Industry matching'),
      jsonb_build_object('key', 'knowledge_navigation', 'label', 'Knowledge navigation', 'cross_link', '/app/global-knowledge-exchange-engine'),
      jsonb_build_object('key', 'gp_identification', 'label', 'Growth Partner identification', 'cross_link', '/app/partners'),
      jsonb_build_object('key', 'implementation_preparation', 'label', 'Implementation preparation')
    )
  );
$$;

create or replace function public._gsembp148_solution_contribution_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Solution contribution engine — metadata counts for templates, playbooks, and frameworks.',
    'contribution_types', jsonb_build_array(
      jsonb_build_object('key', 'templates', 'label', 'Templates'),
      jsonb_build_object('key', 'frameworks', 'label', 'Frameworks'),
      jsonb_build_object('key', 'playbooks', 'label', 'Playbooks'),
      jsonb_build_object('key', 'knowledge_assets', 'label', 'Knowledge assets'),
      jsonb_build_object('key', 'methodologies', 'label', 'Methodologies'),
      jsonb_build_object('key', 'companion_skills', 'label', 'Companion skills', 'cross_link', '/app/marketplace'),
      jsonb_build_object('key', 'transformation_resources', 'label', 'Transformation resources')
    )
  );
$$;

create or replace function public._gsembp148_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'must_avoid', jsonb_build_array(
      'Guarantee outcomes',
      'Unfair prioritization',
      'Manipulate visibility',
      'Suppress competing approaches',
      'Override procurement judgment',
      'Consumer app store dynamics'
    ),
    'principle', 'Marketplace companion supports evaluation — humans and procurement teams decide.'
  );
$$;

create or replace function public._gsembp148_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — generosity, curiosity, recognition, mutual support, professional humility, celebration of contributions.',
    'values', jsonb_build_array(
      'generosity', 'curiosity', 'recognition', 'mutual_support', 'professional_humility', 'celebration_of_contributions'
    ),
    'cross_link', '/app/self-love-engine'
  );
$$;

create or replace function public._gsembp148_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'solution_approval_workflows', 'label', 'Solution approval workflows'),
      jsonb_build_object('key', 'publisher_verification', 'label', 'Publisher verification'),
      jsonb_build_object('key', 'audit_logging', 'label', 'Audit logging'),
      jsonb_build_object('key', 'rbac', 'label', 'Role-based access control'),
      jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
    )
  );
$$;

create or replace function public._gsembp148_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'skills_marketplace', 'label', 'Skills Marketplace Phase 69/112', 'route', '/app/marketplace', 'relationship', 'Skills & extensions — do NOT duplicate _mkp_*, _sembp112_*'),
    jsonb_build_object('key', 'companion_marketplace', 'label', 'Companion Marketplace Phase 113', 'route', '/app/companion-marketplace', 'relationship', 'Digital employee catalog — cross-link only'),
    jsonb_build_object('key', 'marketplace_governance', 'label', 'Marketplace Governance Phase 90', 'route', '/app/marketplace-governance', 'relationship', 'QA and validation workflows'),
    jsonb_build_object('key', 'module_marketplace', 'label', 'Module Marketplace A.23', 'route', '/app/module-marketplace-foundation-engine', 'relationship', 'Module foundation — cross-link only'),
    jsonb_build_object('key', 'ecosystem_governance', 'label', 'Ecosystem Governance Phase 119/146', 'route', '/app/ecosystem-governance', 'relationship', 'Ecosystem certification and governance'),
    jsonb_build_object('key', 'global_talent', 'label', 'Global Talent & Expert Network Phase 147', 'route', '/app/global-talent-expert-network-engine', 'relationship', 'Professional services discovery'),
    jsonb_build_object('key', 'growth_partner_ops', 'label', 'Growth Partner Operations Phase 114', 'route', '/app/growth-partner-operations', 'relationship', 'GP solution marketplace'),
    jsonb_build_object('key', 'partner_certification', 'label', 'Partner Certification Phase 91', 'route', '/app/partners', 'relationship', 'Growth Partner certification'),
    jsonb_build_object('key', 'global_knowledge_exchange', 'label', 'Global Knowledge Exchange Phase 141', 'route', '/app/global-knowledge-exchange-engine', 'relationship', 'Knowledge asset libraries')
  );
$$;

create or replace function public._gsembp148_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses Global Solution Marketplace internally with metadata-only listing scaffolds and governed validation workflows. Growth Partner terminology throughout. No raw customer content in listings.';
$$;

create or replace function public._gsembp148_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Professional exchange — not consumer app store dynamics.',
    'Growth Partner — never Affiliate.',
    'Procurement judgment remains human-led.',
    'Generosity, curiosity, mutual support.',
    'People First — celebrate contributions with humility.'
  );
$$;

create or replace function public._gsembp148_privacy_note()
returns text language sql immutable as $$
  select 'Global Solution Marketplace metadata only — solution keys, categories, validation status, and procurement metadata. No raw customer content. No cross-tenant PII. Opt-in required.';
$$;

create or replace function public._gsembp148_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._gseme_ensure_settings(p_org_id);
  perform public._gseme_seed_catalog_listings(p_org_id);
  v_metrics := public._gseme_refresh_metrics(p_org_id);

  return jsonb_build_object(
    'marketplace_score', coalesce((v_metrics->>'marketplace_score')::numeric, 0),
    'participation_status', coalesce(v_metrics->>'participation_status', 'disabled'),
    'enabled', coalesce((v_metrics->>'enabled')::boolean, false),
    'listings_count', coalesce((v_metrics->>'listings_count')::int, 0),
    'approved_listings_count', coalesce((v_metrics->>'approved_listings_count')::int, 0),
    'pending_listings_count', coalesce((v_metrics->>'pending_listings_count')::int, 0),
    'validations_count', coalesce((v_metrics->>'validations_count')::int, 0),
    'contributions_count', coalesce((v_metrics->>'contributions_count')::int, 0),
    'approved_contributions_count', coalesce((v_metrics->>'approved_contributions_count')::int, 0),
    'cross_links_count', jsonb_array_length(public._gsembp148_integration_links()),
    'marketplace_categories_count', 10,
    'industry_packs_count', 10,
    'privacy_note', public._gsembp148_privacy_note(),
    'opt_in_required', true
  );
end; $$;

create or replace function public._gsembp148_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._gseme_ensure_settings(p_org_id);
  perform public._gseme_seed_catalog_listings(p_org_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'marketplace_center', 'label', 'Global Solution Marketplace Center — eight capabilities', 'met', jsonb_array_length(public._gsembp148_global_solution_marketplace_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'marketplace_categories', 'label', 'Marketplace categories — ten documented', 'met', jsonb_array_length(public._gsembp148_marketplace_categories()->'categories') = 10, 'note', null),
    jsonb_build_object('key', 'industry_packs', 'label', 'Industry solution packs — ten industries', 'met', jsonb_array_length(public._gsembp148_industry_solution_pack_engine()->'industries') = 10, 'note', null),
    jsonb_build_object('key', 'validation_framework', 'label', 'Solution validation framework — six dimensions', 'met', jsonb_array_length(public._gsembp148_solution_validation_framework()->'dimensions') = 6, 'note', null),
    jsonb_build_object('key', 'procurement_readiness', 'label', 'Procurement readiness — six fields', 'met', jsonb_array_length(public._gsembp148_procurement_readiness_engine()->'fields') = 6, 'note', null),
    jsonb_build_object('key', 'catalog_seeded', 'label', 'Catalog listings seeded', 'met', (select count(*) >= 3 from public.global_solution_listings l where l.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'opt_in_default', 'label', 'Default opt-out (enabled false)', 'met', exists (select 1 from public.global_ecosystem_marketplace_settings s where s.tenant_id = p_org_id and s.enabled = false), 'note', null),
    jsonb_build_object('key', 'approval_required', 'label', 'Approval required default true', 'met', exists (select 1 from public.global_ecosystem_marketplace_settings s where s.tenant_id = p_org_id and s.approval_required = true), 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._gsembp148_companion_limitations()->'must_avoid') >= 6, 'note', null),
    jsonb_build_object('key', 'objectives', 'label', 'Blueprint objectives — eight documented', 'met', jsonb_array_length(public._gsembp148_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'integration_links', 'label', 'Integration links — nine cross-links', 'met', jsonb_array_length(public._gsembp148_integration_links()) = 9, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 148 baseline tables and RPCs', 'met', to_regclass('public.global_solution_listings') is not null, 'note', '_gseme_* helpers intact')
  );
end; $$;

create or replace function public._gsembp148_blueprint_block(p_org_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 148 — Global Ecosystem Marketplace & Solution Exchange Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE148_GLOBAL_ECOSYSTEM_MARKETPLACE_SOLUTION_EXCHANGE.md',
    'engine_phase', 'Repo Phase 148 Global Ecosystem Marketplace Engine',
    'route', '/app/global-ecosystem-marketplace-engine',
    'mapping_note', 'Global Intelligence Era (141–150) — professional enterprise solution exchange.',
    'distinction_note', public._gsembp148_distinction_note(),
    'mission', public._gsembp148_mission(),
    'philosophy', public._gsembp148_philosophy(),
    'abos_principle', public._gsembp148_abos_principle(),
    'vision', public._gsembp148_vision(),
    'objectives', public._gsembp148_objectives(),
    'global_solution_marketplace_center', public._gsembp148_global_solution_marketplace_center(),
    'marketplace_categories', public._gsembp148_marketplace_categories(),
    'industry_solution_pack_engine', public._gsembp148_industry_solution_pack_engine(),
    'growth_partner_marketplace_engine', public._gsembp148_growth_partner_marketplace_engine(),
    'solution_validation_framework', public._gsembp148_solution_validation_framework(),
    'procurement_readiness_engine', public._gsembp148_procurement_readiness_engine(),
    'marketplace_companion', public._gsembp148_marketplace_companion(),
    'solution_contribution_engine', public._gsembp148_solution_contribution_engine(),
    'companion_limitations', public._gsembp148_companion_limitations(),
    'self_love_connection', public._gsembp148_self_love_connection(),
    'security_requirements', public._gsembp148_security_requirements(),
    'integration_links', public._gsembp148_integration_links(),
    'dogfooding', public._gsembp148_dogfooding(),
    'success_criteria', public._gsembp148_success_criteria(p_org_id),
    'engagement_summary', public._gsembp148_engagement_summary(p_org_id),
    'vision_phrases', public._gsembp148_vision_phrases(),
    'privacy_note', public._gsembp148_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 9. Thin scaffold RPCs
-- ---------------------------------------------------------------------------
create or replace function public.submit_global_solution_listing(
  p_category text,
  p_title text,
  p_summary text,
  p_solution_key text default null,
  p_industry_tags text[] default '{}',
  p_org_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
  v_settings public.global_ecosystem_marketplace_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._gseme_require_tenant());
  v_settings := public._gseme_ensure_settings(v_tenant_id);
  if not v_settings.enabled or v_settings.participation_status not in ('publisher') then
    raise exception 'Listing submission requires enabled publisher participation';
  end if;
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := coalesce(p_solution_key, p_category) || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.global_solution_listings (
    tenant_id, listing_key, solution_key, category, title, summary, industry_tags,
    validation_status, procurement_metadata
  ) values (
    v_tenant_id, v_key, coalesce(p_solution_key, v_key), p_category, p_title,
    left(p_summary, 500), coalesce(p_industry_tags, '{}'),
    case when v_settings.approval_required then 'pending' else 'approved' end,
    jsonb_build_object('submitted_via', 'submit_global_solution_listing')
  )
  returning id into v_id;
  perform public._gseme_log_audit(v_tenant_id, 'listing_submitted', left(p_title, 120),
    jsonb_build_object('listing_id', v_id, 'category', p_category, 'validation_status', 'pending'));
  return v_id;
end; $$;

create or replace function public.record_solution_validation_review(
  p_listing_id uuid,
  p_status text,
  p_reviewer_notes text default null,
  p_org_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_row public.global_solution_listings;
  v_validation_id uuid;
  v_key text;
begin
  v_tenant_id := coalesce(p_org_id, public._gseme_require_tenant());
  if p_status not in ('approved', 'rejected', 'needs_revision') then
    raise exception 'Status must be approved, rejected, or needs_revision';
  end if;
  select * into v_row from public.global_solution_listings
  where id = p_listing_id and tenant_id = v_tenant_id;
  if not found then raise exception 'Listing not found'; end if;
  v_key := 'validation-' || left(md5(p_listing_id::text || clock_timestamp()::text), 8);
  insert into public.global_solution_validations (
    tenant_id, listing_id, validation_key, reviewer_notes, status,
    documentation_quality_score, governance_alignment_score, security_checklist_score
  ) values (
    v_tenant_id, p_listing_id, v_key, left(p_reviewer_notes, 500), p_status,
    case when p_status = 'approved' then 85 else 60 end,
    case when p_status = 'approved' then 80 else 55 end,
    case when p_status = 'approved' then 90 else 65 end
  )
  returning id into v_validation_id;
  update public.global_solution_listings
  set validation_status = case p_status
    when 'approved' then 'approved'
    when 'rejected' then 'rejected'
    else 'in_review'
  end
  where id = p_listing_id;
  perform public._gseme_log_audit(v_tenant_id, 'validation_reviewed', left(v_row.title, 120),
    jsonb_build_object('listing_id', p_listing_id, 'validation_id', v_validation_id, 'status', p_status));
  return v_validation_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_global_ecosystem_marketplace_engine_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.global_ecosystem_marketplace_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._gseme_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._gseme_ensure_settings(v_tenant_id);
  perform public._gseme_seed_catalog_listings(v_tenant_id);
  v_metrics := public._gseme_refresh_metrics(v_tenant_id);
  v_engagement := public._gsembp148_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'marketplace_score', v_metrics->'marketplace_score',
    'participation_status', v_settings.participation_status,
    'enabled', v_settings.enabled,
    'listings_count', v_metrics->'listings_count',
    'philosophy', public._gsembp148_philosophy(),
    'approval_required', v_settings.approval_required,
    'executive_approval_required', v_settings.executive_approval_required,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 148 — Global Ecosystem Marketplace & Solution Exchange Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE148_GLOBAL_ECOSYSTEM_MARKETPLACE_SOLUTION_EXCHANGE.md',
      'engine_phase', 'Repo Phase 148 Global Ecosystem Marketplace Engine',
      'route', '/app/global-ecosystem-marketplace-engine',
      'mapping_note', 'Global Intelligence Era (141–150) — professional solution exchange.'
    ),
    'global_ecosystem_marketplace_mission', public._gsembp148_mission(),
    'global_ecosystem_marketplace_abos_principle', public._gsembp148_abos_principle(),
    'global_ecosystem_marketplace_engagement_summary', v_engagement,
    'global_ecosystem_marketplace_note', public._gsembp148_distinction_note(),
    'global_ecosystem_marketplace_vision_note', public._gsembp148_vision()
  );
end; $$;

create or replace function public.get_global_ecosystem_marketplace_engine_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.global_ecosystem_marketplace_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._gseme_require_tenant());
  v_settings := public._gseme_ensure_settings(v_tenant_id);
  perform public._gseme_seed_catalog_listings(v_tenant_id);
  v_metrics := public._gseme_refresh_metrics(v_tenant_id);
  perform public._gseme_log_audit(v_tenant_id, 'dashboard_view', 'Global Solution Marketplace dashboard viewed',
    jsonb_build_object('marketplace_score', v_metrics->>'marketplace_score', 'participation_status', v_settings.participation_status));

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'participation_status', v_settings.participation_status,
    'approval_required', v_settings.approval_required,
    'executive_approval_required', v_settings.executive_approval_required,
    'philosophy', public._gsembp148_philosophy(),
    'safety_note', 'Global Solution Marketplace — metadata and procurement scaffolds only. Opt-in required. No raw customer content.',
    'distinction_note', public._gsembp148_distinction_note(),
    'marketplace_score', v_metrics->'marketplace_score',
    'listings_count', v_metrics->'listings_count',
    'approved_listings_count', v_metrics->'approved_listings_count',
    'pending_listings_count', v_metrics->'pending_listings_count',
    'validations_count', v_metrics->'validations_count',
    'contributions_count', v_metrics->'contributions_count',
    'approved_contributions_count', v_metrics->'approved_contributions_count',
    'listings', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'listing_key', l.listing_key, 'solution_key', l.solution_key,
        'category', l.category, 'title', l.title, 'summary', l.summary,
        'industry_tags', l.industry_tags, 'validation_status', l.validation_status,
        'publisher_org_key', l.publisher_org_key, 'submitted_at', l.submitted_at
      ) order by l.submitted_at desc)
      from public.global_solution_listings l where l.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'validations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', v.id, 'listing_id', v.listing_id, 'validation_key', v.validation_key,
        'status', v.status, 'documentation_quality_score', v.documentation_quality_score,
        'governance_alignment_score', v.governance_alignment_score,
        'security_checklist_score', v.security_checklist_score, 'reviewed_at', v.reviewed_at
      ) order by v.created_at desc)
      from public.global_solution_validations v where v.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'contributions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'contribution_key', c.contribution_key, 'contribution_type', c.contribution_type,
        'title', c.title, 'summary', c.summary, 'industry_tag', c.industry_tag,
        'status', c.status, 'submitted_at', c.submitted_at
      ) order by c.submitted_at desc)
      from public.global_solution_contributions c where c.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'integration_links', public._gsembp148_integration_links(),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 148 — Global Ecosystem Marketplace & Solution Exchange Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE148_GLOBAL_ECOSYSTEM_MARKETPLACE_SOLUTION_EXCHANGE.md',
      'engine_phase', 'Repo Phase 148 Global Ecosystem Marketplace Engine',
      'route', '/app/global-ecosystem-marketplace-engine',
      'mapping_note', 'Global Intelligence Era (141–150) — professional enterprise solution exchange.'
    ),
    'global_ecosystem_marketplace_engine_note', 'Global Ecosystem Marketplace Engine (ABOS Phase 148) — professional solution exchange. Cross-link marketplace, companion marketplace, governance — do NOT duplicate _mkp_*.',
    'global_ecosystem_marketplace_blueprint', public._gsembp148_blueprint_block(v_tenant_id),
    'global_ecosystem_marketplace_distinction_note', public._gsembp148_distinction_note(),
    'global_ecosystem_marketplace_mission', public._gsembp148_mission(),
    'global_ecosystem_marketplace_philosophy', public._gsembp148_philosophy(),
    'global_ecosystem_marketplace_abos_principle', public._gsembp148_abos_principle(),
    'global_ecosystem_marketplace_objectives', public._gsembp148_objectives(),
    'global_solution_marketplace_center_meta', public._gsembp148_global_solution_marketplace_center(),
    'marketplace_categories_meta', public._gsembp148_marketplace_categories(),
    'industry_solution_pack_engine_meta', public._gsembp148_industry_solution_pack_engine(),
    'growth_partner_marketplace_engine_meta', public._gsembp148_growth_partner_marketplace_engine(),
    'solution_validation_framework_meta', public._gsembp148_solution_validation_framework(),
    'procurement_readiness_engine_meta', public._gsembp148_procurement_readiness_engine(),
    'marketplace_companion_meta', public._gsembp148_marketplace_companion(),
    'solution_contribution_engine_meta', public._gsembp148_solution_contribution_engine(),
    'companion_limitations_meta', public._gsembp148_companion_limitations(),
    'self_love_connection_meta', public._gsembp148_self_love_connection(),
    'security_requirements_meta', public._gsembp148_security_requirements(),
    'gsembp148_integration_links', public._gsembp148_integration_links(),
    'global_ecosystem_marketplace_engagement_summary', public._gsembp148_engagement_summary(v_tenant_id),
    'global_ecosystem_marketplace_success_criteria', public._gsembp148_success_criteria(v_tenant_id),
    'global_ecosystem_marketplace_vision', public._gsembp148_vision(),
    'global_ecosystem_marketplace_vision_phrases', public._gsembp148_vision_phrases(),
    'global_ecosystem_marketplace_privacy_note', public._gsembp148_privacy_note(),
    'global_ecosystem_marketplace_dogfooding', public._gsembp148_dogfooding()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'global-ecosystem-marketplace-engine', 'Global Ecosystem Marketplace Engine',
  'Global Intelligence Era (141–150) — professional enterprise solution exchange. People First.',
  'authenticated', 158
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'global-ecosystem-marketplace-engine' and tenant_id is null
);

grant execute on function public.get_global_ecosystem_marketplace_engine_card(uuid) to authenticated;
grant execute on function public.get_global_ecosystem_marketplace_engine_dashboard(uuid) to authenticated;
grant execute on function public.submit_global_solution_listing(text, text, text, text, text[], uuid) to authenticated;
grant execute on function public.record_solution_validation_review(uuid, text, text, uuid) to authenticated;
grant execute on function public._gsembp148_distinction_note() to authenticated;
grant execute on function public._gsembp148_mission() to authenticated;
grant execute on function public._gsembp148_philosophy() to authenticated;
grant execute on function public._gsembp148_abos_principle() to authenticated;
grant execute on function public._gsembp148_vision() to authenticated;
grant execute on function public._gsembp148_objectives() to authenticated;
grant execute on function public._gsembp148_global_solution_marketplace_center() to authenticated;
grant execute on function public._gsembp148_marketplace_categories() to authenticated;
grant execute on function public._gsembp148_industry_solution_pack_engine() to authenticated;
grant execute on function public._gsembp148_growth_partner_marketplace_engine() to authenticated;
grant execute on function public._gsembp148_solution_validation_framework() to authenticated;
grant execute on function public._gsembp148_procurement_readiness_engine() to authenticated;
grant execute on function public._gsembp148_marketplace_companion() to authenticated;
grant execute on function public._gsembp148_solution_contribution_engine() to authenticated;
grant execute on function public._gsembp148_companion_limitations() to authenticated;
grant execute on function public._gsembp148_self_love_connection() to authenticated;
grant execute on function public._gsembp148_security_requirements() to authenticated;
grant execute on function public._gsembp148_integration_links() to authenticated;
grant execute on function public._gsembp148_dogfooding() to authenticated;
grant execute on function public._gsembp148_vision_phrases() to authenticated;
grant execute on function public._gsembp148_privacy_note() to authenticated;
grant execute on function public._gsembp148_engagement_summary(uuid) to authenticated;
grant execute on function public._gsembp148_success_criteria(uuid) to authenticated;
