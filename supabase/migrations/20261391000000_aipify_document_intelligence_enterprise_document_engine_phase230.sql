-- Phase 230 — Document Intelligence & Enterprise Document Engine
-- Documents Era (221–230).
-- Helpers: _adiede_* (engine), _adiedebp230_* (blueprint)

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
    'ethical_evolution_guardianship_engine',
    'presence_comfort_protocol',
    'dedication_engine',
    'ethical_evolution_guardianship_engine',
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
    'aipify_document_intelligence_enterprise_document_engine'
  )
);

create table if not exists public.aipify_document_intelligence_enterprise_document_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  document_governance_level int not null default 1 check (document_governance_level between 1 and 5),
  document_intelligence_mode text not null default 'guided' check (document_intelligence_mode in ('guided', 'governance_led', 'executive_sponsored')),
  agency_reflection_enabled boolean not null default true,
  participation_reflection_enabled boolean not null default true,
  autonomy_strengthening_enabled boolean not null default true,
  empowerment_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  governance_visibility text not null default 'executive' check (governance_visibility in ('leadership', 'executive', 'governance_council')),
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"approval_required":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_document_intelligence_enterprise_document_settings enable row level security;
revoke all on public.aipify_document_intelligence_enterprise_document_settings from authenticated, anon;

create table if not exists public.aipify_document_intelligence_enterprise_document_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in ('agency_stewardship', 'leadership_accountability', 'autonomy_reflection', 'decision_ownership', 'responsible_automation')),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (status in ('draft', 'in_review', 'completed', 'archived')),
  readiness_signal text not null default 'stable' check (readiness_signal in ('emerging', 'stable', 'strong', 'needs_attention')),
  metadata jsonb not null default '{"metadata_only":true,"aggregate_only":true}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);
create index if not exists aipify_document_intelligence_enterprise_document_reviews_tenant_idx on public.aipify_document_intelligence_enterprise_document_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_document_intelligence_enterprise_document_reviews enable row level security;
revoke all on public.aipify_document_intelligence_enterprise_document_reviews from authenticated, anon;

create table if not exists public.aipify_document_intelligence_enterprise_document_reflections (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  reflection_key text not null,
  reflection_type text not null check (reflection_type in ('meaningful_choice', 'responsibility_reflection', 'autonomy_strengthening', 'automation_agency', 'ownership_themes', 'governance_participation', 'knowledge_empowerment', 'leadership_preparation')),
  title text not null,
  reflection_summary text not null check (char_length(reflection_summary) <= 500),
  status text not null default 'draft' check (status in ('draft', 'review', 'completed', 'archived')),
  metadata jsonb not null default '{"metadata_only":true,"aggregate_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, reflection_key)
);
create index if not exists aipify_document_intelligence_enterprise_document_reflections_tenant_idx on public.aipify_document_intelligence_enterprise_document_reflections (tenant_id, reflection_type, status);
alter table public.aipify_document_intelligence_enterprise_document_reflections enable row level security;
revoke all on public.aipify_document_intelligence_enterprise_document_reflections from authenticated, anon;

create table if not exists public.aipify_document_intelligence_enterprise_document_document_intelligence_notes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  note_key text not null,
  note_type text not null check (note_type in ('human_oversight', 'approval_checkpoints', 'escalation_readiness', 'decision_ownership', 'governance_participation', 'role_based_controls', 'companion_transparency', 'empowerment_access')),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (status in ('draft', 'review', 'active', 'archived')),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, note_key)
);
create index if not exists aipify_document_intelligence_enterprise_document_document_intelligence_notes_tenant_idx on public.aipify_document_intelligence_enterprise_document_document_intelligence_notes (tenant_id, note_type, status);
alter table public.aipify_document_intelligence_enterprise_document_document_intelligence_notes enable row level security;
revoke all on public.aipify_document_intelligence_enterprise_document_document_intelligence_notes from authenticated, anon;

create table if not exists public.aipify_document_intelligence_enterprise_document_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_document_intelligence_enterprise_document_audit_logs enable row level security;
revoke all on public.aipify_document_intelligence_enterprise_document_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_document_intelligence_enterprise_document_engine', v.description
from (values
  ('aipify_document_intelligence_enterprise_document.view', 'View Document Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_document_intelligence_enterprise_document.manage', 'Manage Document Center', 'Update settings and governance preferences'),
  ('aipify_document_intelligence_enterprise_document.steward', 'Steward Document Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_document_intelligence_enterprise_document.view'), ('owner', 'aipify_document_intelligence_enterprise_document.manage'), ('owner', 'aipify_document_intelligence_enterprise_document.steward'),
  ('administrator', 'aipify_document_intelligence_enterprise_document.view'), ('administrator', 'aipify_document_intelligence_enterprise_document.manage'), ('administrator', 'aipify_document_intelligence_enterprise_document.steward'),
  ('manager', 'aipify_document_intelligence_enterprise_document.view'), ('manager', 'aipify_document_intelligence_enterprise_document.steward'),
  ('employee', 'aipify_document_intelligence_enterprise_document.view'), ('support_agent', 'aipify_document_intelligence_enterprise_document.view'),
  ('moderator', 'aipify_document_intelligence_enterprise_document.view'), ('viewer', 'aipify_document_intelligence_enterprise_document.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._adiede_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._adiede_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._adiede_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._adiede_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_document_intelligence_enterprise_document_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._adiede_ensure_settings(p_tenant_id uuid) returns public.aipify_document_intelligence_enterprise_document_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_document_intelligence_enterprise_document_settings; begin
  insert into public.aipify_document_intelligence_enterprise_document_settings (tenant_id, enabled, document_intelligence_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_document_intelligence_enterprise_document_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._adiede_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_document_intelligence_enterprise_document_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_document_intelligence_enterprise_document_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Document Companion supports, never replaces.', 'draft');
  insert into public.aipify_document_intelligence_enterprise_document_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Document Companion supports, never replaces.', 'draft');
  insert into public.aipify_document_intelligence_enterprise_document_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Document Companion supports, never replaces.', 'draft');
  insert into public.aipify_document_intelligence_enterprise_document_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Document Companion supports, never replaces.', 'draft');
  insert into public.aipify_document_intelligence_enterprise_document_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Document Companion supports, never replaces.', 'draft');
  insert into public.aipify_document_intelligence_enterprise_document_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Document Companion supports, never replaces.', 'draft');
  insert into public.aipify_document_intelligence_enterprise_document_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Document Companion supports, never replaces.', 'draft');
  insert into public.aipify_document_intelligence_enterprise_document_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Document Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._adiede_seed_document_intelligence_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_document_intelligence_enterprise_document_document_intelligence_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_document_intelligence_enterprise_document_document_intelligence_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_document_intelligence_enterprise_document_document_intelligence_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_document_intelligence_enterprise_document_document_intelligence_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_document_intelligence_enterprise_document_document_intelligence_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_document_intelligence_enterprise_document_document_intelligence_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_document_intelligence_enterprise_document_document_intelligence_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_document_intelligence_enterprise_document_document_intelligence_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_document_intelligence_enterprise_document_document_intelligence_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._adiedebp230_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 230 — Document Center. Document Companion supports document intelligence — NOT bypassing document RBAC, skipping approval workflows, or replacing human document stewardship. Helpers _adiedebp230_*.'; $$;
create or replace function public._adiedebp230_mission() returns text language sql immutable as $$ select 'Enable employees to create, summarize, transform and govern documents within Aipify — Document Companion prepares, humans decide.'; $$;
create or replace function public._adiedebp230_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._adiedebp230_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Document Center within Creative Intelligence Era (229–233). Human-stewarded document governance; RBAC-protected document intelligence scaffolds; configurable retention policies; Document Companion informs and supports.'; $$;
create or replace function public._adiedebp230_vision() returns text language sql immutable as $$ select 'Organizations reduce document administration, accelerate report creation, and improve knowledge reuse — employees work with clarity before complexity.'; $$;
create or replace function public._adiedebp230_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Document Center programs', 'emoji', '✅', 'description', 'Ten document modules with governance'),
    jsonb_build_object('key', 'document_generation_center', 'label', 'Document generation center', 'emoji', '📄', 'description', 'Generate documents from templates and prompts'),
    jsonb_build_object('key', 'document_transformation_center', 'label', 'Document transformation center', 'emoji', '✏️', 'description', 'Summarize, rewrite, and translate documents'),
    jsonb_build_object('key', 'presentation_generator', 'label', 'Presentation generator', 'emoji', '📊', 'description', 'Generate presentations from text'),
    jsonb_build_object('key', 'companion', 'label', 'Document Companion', 'emoji', '✨', 'description', 'Supports — does not replace human document stewardship'),
    jsonb_build_object('key', 'knowledge_center_converter', 'label', 'Knowledge Center converter', 'emoji', '📚', 'description', 'Convert documents into Knowledge Center articles'),
    jsonb_build_object('key', 'document_governance_dashboard', 'label', 'Document governance dashboard', 'emoji', '🛡️', 'description', 'Templates, version history, approvals, and retention'),
    jsonb_build_object('key', 'supported_formats', 'label', 'Supported file formats', 'emoji', '📁', 'description', 'DOCX, PDF, PPTX, XLSX, TXT, MD')
  ); $$;
create or replace function public._adiedebp230_document_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Document Center — ten capabilities. Clarity before complexity.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'document_dashboard', 'label', 'Document Dashboard — active workflows and documents requiring attention'),
    jsonb_build_object('key', 'document_generation_center', 'label', 'Document Generation Center — generate documents from templates'),
    jsonb_build_object('key', 'document_transformation_center', 'label', 'Document Transformation Center — summarize, rewrite, translate'),
    jsonb_build_object('key', 'presentation_generator', 'label', 'Presentation Generator — generate PPTX from text'),
    jsonb_build_object('key', 'action_item_extractor', 'label', 'Action Item Extractor — extract action items from documents'),
    jsonb_build_object('key', 'executive_summary_engine', 'label', 'Executive Summary Engine — generate executive summaries'),
    jsonb_build_object('key', 'knowledge_center_converter', 'label', 'Knowledge Center Converter — convert documents to KC articles'),
    jsonb_build_object('key', 'document_templates', 'label', 'Document Templates — organizational template library'),
    jsonb_build_object('key', 'version_history_approvals', 'label', 'Version History & Approval Workflows — document lifecycle governance'),
    jsonb_build_object('key', 'document_governance_dashboard', 'label', 'Document Governance Dashboard — retention policies and audit visibility')
  )); $$;
create or replace function public._adiedebp230_document_generation_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Document generation center — templates and RBAC first.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'template_fit', 'label', 'Does an approved template best serve this document request?'),
    jsonb_build_object('key', 'rbac_access', 'label', 'Does document access follow role-based permissions?'),
    jsonb_build_object('key', 'output_format', 'label', 'Which format — DOCX, PDF, PPTX, XLSX, TXT, or MD — is appropriate?'),
    jsonb_build_object('key', 'approval_required', 'label', 'Does this generation require approval before distribution?'),
    jsonb_build_object('key', 'retention_policy', 'label', 'How does retention policy apply to this document?')
  )); $$;
create or replace function public._adiedebp230_document_transformation_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Document transformation center — governance before convenience with human approval.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'summarize', 'label', 'Summarize documents'),
    jsonb_build_object('key', 'rewrite', 'label', 'Rewrite documents'),
    jsonb_build_object('key', 'translate', 'label', 'Translate documents'),
    jsonb_build_object('key', 'supported_formats', 'label', 'DOCX, PDF, PPTX, XLSX, TXT, MD support'),
    jsonb_build_object('key', 'document_rbac', 'label', 'Document access — RBAC enforced'),
    jsonb_build_object('key', 'retention_policies', 'label', 'Configurable retention policies'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for sensitive transformations')
  )); $$;
create or replace function public._adiedebp230_executive_summary_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive summary engine — stewardship before speed.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'executive_summaries', 'label', 'Generate executive summaries'),
    jsonb_build_object('key', 'reporting_capabilities', 'label', 'Executive reporting capabilities — RBAC protected'),
    jsonb_build_object('key', 'cockpit_integration', 'label', 'Executive Cockpit Phase 200 cross-link'),
    jsonb_build_object('key', 'retention', 'label', 'Organization-controlled retention policies'),
    jsonb_build_object('key', 'stewardship', 'label', 'Stewardship before speed prompts')
  )); $$;
create or replace function public._adiedebp230_document_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Document Companion — supports document workflows and never bypasses document RBAC or skips approval workflows.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'document_workflow_summaries', 'label', 'Document workflow summaries'),
    jsonb_build_object('key', 'generation_guidance', 'label', 'Document generation guidance — templates and formats'),
    jsonb_build_object('key', 'transformation_guidance', 'label', 'Summarize, rewrite, and translate guidance'),
    jsonb_build_object('key', 'document_workflow_prompts', 'label', 'Document workflow prompts'),
    jsonb_build_object('key', 'action_item_highlights', 'label', 'Action item extraction highlights'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Document access RBAC and retention — Trust Architecture enforced')
  )); $$;
create or replace function public._adiedebp230_presentation_generator() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Presentation generator — generate PPTX from text.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'pptx_generation', 'label', 'Generate presentations from text'),
    jsonb_build_object('key', 'template_support', 'label', 'Presentation template support'),
    jsonb_build_object('key', 'department_capabilities', 'label', 'Manager and department permission tiers'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only audit — no raw document content in logs'),
    jsonb_build_object('key', 'approval_workflows', 'label', 'Approval workflows before distribution'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for executive presentations')
  )); $$;
create or replace function public._adiedebp230_action_item_extractor() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Action item extractor — prepare for Action Center integration.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'action_extraction', 'label', 'Extract action items from documents'),
    jsonb_build_object('key', 'action_center_link', 'label', 'Action Center cross-link — approval required'),
    jsonb_build_object('key', 'human_review', 'label', 'Human review before action execution'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Action items extracted — audit event logging'),
    jsonb_build_object('key', 'document_rbac', 'label', 'Source document RBAC enforced'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for action creation')
  )); $$;
create or replace function public._adiedebp230_knowledge_center_converter() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Knowledge Center converter — improve knowledge reuse.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'kc_conversion', 'label', 'Convert documents into Knowledge Center articles'),
    jsonb_build_object('key', 'knowledge_center_link', 'label', 'Knowledge Center cross-link'),
    jsonb_build_object('key', 'approval_required', 'label', 'Approval before publishing to Knowledge Center'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only conversion tracking'),
    jsonb_build_object('key', 'retention_alignment', 'label', 'Retention policies aligned with KC governance'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for KC publication')
  )); $$;
create or replace function public._adiedebp230_document_governance_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Document governance — stewardship through responsibility.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'document_templates', 'label', 'Document template library'),
    jsonb_build_object('key', 'version_history', 'label', 'Version history tracking'),
    jsonb_build_object('key', 'approval_workflows', 'label', 'Approval workflow configuration'),
    jsonb_build_object('key', 'retention_policies', 'label', 'Configurable retention policies'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Executive, Manager, Employee tiers'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Document audit visibility respects role permissions')
  )); $$;
create or replace function public._adiedebp230_document_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Document integration center — cross-links only; Aipify orchestrates.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'cross_link', '/app/knowledge-center'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'cross_link', '/app/action-center'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'language_center', 'label', 'Language Center', 'cross_link', '/platform/language-center'),
    jsonb_build_object('key', 'cross_link_only', 'label', 'Cross-links only — never duplicate integration RPCs'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Integration events logged in document audit trail'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for cross-surface actions')
  )); $$;
create or replace function public._adiedebp230_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing document RBAC',
      'Skipping approval workflows',
      'Replacing human document stewardship',
      'Storing document content beyond retention policy',
      'Modifying document audit trails',
      'Executing actions without approval',
      'Complexity before clarity',
      'Override human judgment'), 'principle', 'Document Companion supports — humans steward document decisions and governance accountability.'); $$;
create or replace function public._adiedebp230_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm document support without administrative pressure.', 'values', jsonb_build_array('clarity_before_complexity','governance_before_convenience','stewardship_before_speed','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._adiedebp230_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Document intelligence audit logs via aipify_document_intelligence_enterprise_document_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_document_intelligence_enterprise_document permissions — document access RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'RBAC-protected document intelligence scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'retention_policies', 'label', 'Configurable retention policies — organization controlled'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._adiedebp230_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 229, 'key', 'studio_creative_intelligence', 'label', 'Studio & Creative Phase 229', 'route', '/app/aipify-studio-creative-intelligence-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 230, 'key', 'document_intelligence_enterprise_document', 'label', 'Documents Phase 230', 'route', '/app/aipify-document-intelligence-enterprise-document-engine', 'description', 'Human-stewarded document intelligence and enterprise document management')
  ); $$;
create or replace function public._adiedebp230_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'route', '/app/knowledge-center', 'relationship', 'Knowledge Center integration — cross-link only'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'route', '/app/action-center', 'relationship', 'Action Center integration — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'language_center', 'label', 'Language Center', 'route', '/platform/language-center', 'relationship', 'Language Center integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Clarity before complexity — cross-link only')
  ); $$;
create or replace function public._adiedebp230_integration_links() returns jsonb language sql stable as $$ select public._adiedebp230_era_opener_summary() || public._adiedebp230_extended_cross_links(); $$;
create or replace function public._adiedebp230_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Document Center internally with RBAC-protected document intelligence scaffolds and human approval gates. Growth Partner terminology. Document Companion supports — never bypasses document RBAC or skips approval workflows.'; $$;
create or replace function public._adiedebp230_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans steward document decisions and governance accountability.', 'Document Companion informs and supports.', 'Clarity before complexity — governance before convenience.', 'Growth Partner — never Affiliate.', 'Creative Intelligence Era — 229–233.'); $$;
create or replace function public._adiedebp230_privacy_note() returns text language sql immutable as $$
  select 'Document Center metadata only — document workflow signals max ~500 chars. No raw document content beyond RBAC, retention policy, or PII in audit logs.'; $$;

create or replace function public._adiede_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_document_intelligence_enterprise_document_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_document_intelligence_enterprise_document_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_document_intelligence_enterprise_document_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_document_intelligence_enterprise_document_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_document_intelligence_enterprise_document_document_intelligence_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_document_intelligence_enterprise_document_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.document_governance_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_document_intelligence_enterprise_document_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'document_intelligence_mode', coalesce(v_settings.document_intelligence_mode, 'guided'),
    'document_governance_level', coalesce(v_settings.document_governance_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'document_intelligence_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._adiedebp230_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._adiedebp230_integration_links()));
end; $$;

create or replace function public._adiedebp230_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._adiede_ensure_settings(p_org_id); perform public._adiede_seed_reflections(p_org_id); perform public._adiede_seed_document_intelligence_notes(p_org_id);
  v_metrics := public._adiede_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_document_intelligence_enterprise_document_score', coalesce((v_metrics->>'aipify_document_intelligence_enterprise_document_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'document_intelligence_mode', coalesce(v_metrics->>'document_intelligence_mode', 'guided'), 'document_governance_level', coalesce((v_metrics->>'document_governance_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'document_intelligence_notes_count', coalesce((v_metrics->>'document_intelligence_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._adiedebp230_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._adiedebp230_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._adiede_ensure_settings(p_org_id); perform public._adiede_seed_reflections(p_org_id); perform public._adiede_seed_document_intelligence_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Document Center — ten capabilities', 'met', jsonb_array_length(public._adiedebp230_document_dashboard()->'capabilities') = 10, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Document generation center — five reflection questions', 'met', jsonb_array_length(public._adiedebp230_document_generation_center()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._adiedebp230_document_transformation_center()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Document Companion capabilities', 'met', jsonb_array_length(public._adiedebp230_document_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_document_intelligence_enterprise_document_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_document_intelligence_enterprise_document_document_intelligence_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._adiedebp230_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 229–233 documented', 'met', jsonb_array_length(public._adiedebp230_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 230 baseline tables', 'met', to_regclass('public.aipify_document_intelligence_enterprise_document_settings') is not null, 'note', '_adiede_* helpers intact')
  );
end; $$;

create or replace function public._adiedebp230_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 230 — Document Intelligence & Enterprise Document Engine', 'title', 'Document Intelligence & Enterprise Document Engine (Documents Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE230_AIPIFY_DOCUMENT_INTELLIGENCE_ENTERPRISE_DOCUMENT_ENGINE.md', 'engine_phase', 'Repo Phase 230', 'route', '/app/aipify-document-intelligence-enterprise-document-engine'),
    'distinction_note', public._adiedebp230_distinction_note(), 'mission', public._adiedebp230_mission(), 'philosophy', public._adiedebp230_philosophy(),
    'abos_principle', public._adiedebp230_abos_principle(), 'vision', public._adiedebp230_vision(), 'objectives', public._adiedebp230_objectives(),
    'document_dashboard', public._adiedebp230_document_dashboard(), 'document_generation_center', public._adiedebp230_document_generation_center(),
    'document_transformation_center', public._adiedebp230_document_transformation_center(), 'knowledge_center_converter', public._adiedebp230_knowledge_center_converter(),
    'document_companion', public._adiedebp230_document_companion(), 'presentation_generator', public._adiedebp230_presentation_generator(),
    'executive_summary_engine', public._adiedebp230_executive_summary_engine(), 'document_governance_dashboard', public._adiedebp230_document_governance_dashboard(),
    'companion_limitations', public._adiedebp230_companion_limitations(), 'self_love_connection', public._adiedebp230_self_love_connection(),
    'security_requirements', public._adiedebp230_security_requirements(), 'era_opener_summary', public._adiedebp230_era_opener_summary(),
    'integration_links', public._adiedebp230_integration_links(), 'dogfooding', public._adiedebp230_dogfooding(),
    'success_criteria', public._adiedebp230_success_criteria(p_org_id), 'engagement_summary', public._adiedebp230_engagement_summary(p_org_id),
    'vision_phrases', public._adiedebp230_vision_phrases(), 'privacy_note', public._adiedebp230_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._adiede_require_tenant()); perform public._adiede_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_document_intelligence_enterprise_document_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._adiede_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._adiede_require_tenant()); perform public._adiede_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_document_intelligence_enterprise_document_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._adiede_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_document_intelligence_enterprise_document_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_document_intelligence_enterprise_document_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._adiede_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._adiede_ensure_settings(v_tenant_id); perform public._adiede_seed_reflections(v_tenant_id); perform public._adiede_seed_document_intelligence_notes(v_tenant_id);
  v_metrics := public._adiede_refresh_metrics(v_tenant_id); v_engagement := public._adiedebp230_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_document_intelligence_enterprise_document_score', v_metrics->'aipify_document_intelligence_enterprise_document_score', 'enabled', v_settings.enabled, 'document_intelligence_mode', v_settings.document_intelligence_mode,
    'document_governance_level', v_settings.document_governance_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._adiedebp230_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 230 — Document Intelligence & Enterprise Document Engine', 'title', 'Document Intelligence & Enterprise Document Engine (Documents Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE230_AIPIFY_DOCUMENT_INTELLIGENCE_ENTERPRISE_DOCUMENT_ENGINE.md', 'route', '/app/aipify-document-intelligence-enterprise-document-engine'),
    'aipify_document_intelligence_enterprise_document_mission', public._adiedebp230_mission(), 'aipify_document_intelligence_enterprise_document_abos_principle', public._adiedebp230_abos_principle(),
    'aipify_document_intelligence_enterprise_document_engagement_summary', v_engagement, 'aipify_document_intelligence_enterprise_document_note', public._adiedebp230_distinction_note(), 'aipify_document_intelligence_enterprise_document_vision_note', public._adiedebp230_vision());
end; $$;

create or replace function public.get_aipify_document_intelligence_enterprise_document_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_document_intelligence_enterprise_document_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._adiede_require_tenant()); v_settings := public._adiede_ensure_settings(v_tenant_id);
  perform public._adiede_seed_reflections(v_tenant_id); perform public._adiede_seed_document_intelligence_notes(v_tenant_id); v_metrics := public._adiede_refresh_metrics(v_tenant_id);
  perform public._adiede_log_audit(v_tenant_id, 'dashboard_view', 'Document Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_document_intelligence_enterprise_document_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'document_intelligence_mode', v_settings.document_intelligence_mode, 'document_governance_level', v_settings.document_governance_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._adiedebp230_philosophy(),
    'safety_note', 'Document Center — metadata scaffolds only. Document Companion supports — never replaces human responsibility.',
    'distinction_note', public._adiedebp230_distinction_note(), 'aipify_document_intelligence_enterprise_document_score', v_metrics->'aipify_document_intelligence_enterprise_document_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'document_intelligence_notes_count', v_metrics->'document_intelligence_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_document_intelligence_enterprise_document_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_document_intelligence_enterprise_document_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_document_intelligence_enterprise_document_document_intelligence_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._adiedebp230_integration_links(), 'era_opener_summary', public._adiedebp230_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 230 — Document Intelligence & Enterprise Document Engine', 'title', 'Document Intelligence & Enterprise Document Engine (Documents Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE230_AIPIFY_DOCUMENT_INTELLIGENCE_ENTERPRISE_DOCUMENT_ENGINE.md', 'route', '/app/aipify-document-intelligence-enterprise-document-engine'),
    'aipify_document_intelligence_enterprise_document_blueprint', public._adiedebp230_blueprint_block(v_tenant_id), 'aipify_document_intelligence_enterprise_document_mission', public._adiedebp230_mission(), 'aipify_document_intelligence_enterprise_document_philosophy', public._adiedebp230_philosophy(),
    'aipify_document_intelligence_enterprise_document_abos_principle', public._adiedebp230_abos_principle(), 'aipify_document_intelligence_enterprise_document_objectives', public._adiedebp230_objectives(),
    'center_meta', public._adiedebp230_document_dashboard(), 'engine_meta', public._adiedebp230_document_generation_center(), 'framework_meta', public._adiedebp230_document_transformation_center(),
    'executive_reviews_meta', public._adiedebp230_knowledge_center_converter(), 'companion_meta', public._adiedebp230_document_companion(), 'sub_engine_meta', public._adiedebp230_presentation_generator(), 'executive_summary_engine_meta', public._adiedebp230_executive_summary_engine(), 'document_governance_dashboard_meta', public._adiedebp230_document_governance_dashboard(),
    'companion_limitations_meta', public._adiedebp230_companion_limitations(), 'self_love_connection_meta', public._adiedebp230_self_love_connection(),
    'security_requirements_meta', public._adiedebp230_security_requirements(), 'adiedebp230_integration_links', public._adiedebp230_integration_links(),
    'adiedebp230_era_opener_summary', public._adiedebp230_era_opener_summary(), 'aipify_document_intelligence_enterprise_document_engagement_summary', public._adiedebp230_engagement_summary(v_tenant_id),
    'aipify_document_intelligence_enterprise_document_success_criteria', public._adiedebp230_success_criteria(v_tenant_id), 'aipify_document_intelligence_enterprise_document_vision', public._adiedebp230_vision(), 'aipify_document_intelligence_enterprise_document_vision_phrases', public._adiedebp230_vision_phrases(),
    'aipify_document_intelligence_enterprise_document_privacy_note', public._adiedebp230_privacy_note(), 'aipify_document_intelligence_enterprise_document_dogfooding', public._adiedebp230_dogfooding(), 'aipify_document_intelligence_enterprise_document_engine_note', 'Phase 230 Document Intelligence & Enterprise Document Engine — RBAC-protected document intelligence and enterprise document management guidance within Creative Intelligence Era; cross-link only for Knowledge Center, Action Center, Executive Cockpit Phase 200, and Language Center.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-document-intelligence-enterprise-document-engine', 'Document Intelligence & Enterprise Document Engine', 'Document Center — Documents Era (221–230). People First.', 'authenticated', 217
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-document-intelligence-enterprise-document-engine' and tenant_id is null);

grant execute on function public.get_aipify_document_intelligence_enterprise_document_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_document_intelligence_enterprise_document_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
