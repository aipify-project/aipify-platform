-- Phase 229 — Aipify Studio & Creative Intelligence Engine
-- Studio & Creative Era (221–230).
-- Helpers: _ascie_* (engine), _asciebp229_* (blueprint)

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
    'aipify_studio_creative_intelligence_engine'
  )
);

create table if not exists public.aipify_studio_creative_intelligence_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  creative_maturity_level int not null default 1 check (creative_maturity_level between 1 and 5),
  creative_intelligence_mode text not null default 'guided' check (creative_intelligence_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_studio_creative_intelligence_settings enable row level security;
revoke all on public.aipify_studio_creative_intelligence_settings from authenticated, anon;

create table if not exists public.aipify_studio_creative_intelligence_reviews (
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
create index if not exists aipify_studio_creative_intelligence_reviews_tenant_idx on public.aipify_studio_creative_intelligence_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_studio_creative_intelligence_reviews enable row level security;
revoke all on public.aipify_studio_creative_intelligence_reviews from authenticated, anon;

create table if not exists public.aipify_studio_creative_intelligence_reflections (
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
create index if not exists aipify_studio_creative_intelligence_reflections_tenant_idx on public.aipify_studio_creative_intelligence_reflections (tenant_id, reflection_type, status);
alter table public.aipify_studio_creative_intelligence_reflections enable row level security;
revoke all on public.aipify_studio_creative_intelligence_reflections from authenticated, anon;

create table if not exists public.aipify_studio_creative_intelligence_creative_intelligence_notes (
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
create index if not exists aipify_studio_creative_intelligence_creative_intelligence_notes_tenant_idx on public.aipify_studio_creative_intelligence_creative_intelligence_notes (tenant_id, note_type, status);
alter table public.aipify_studio_creative_intelligence_creative_intelligence_notes enable row level security;
revoke all on public.aipify_studio_creative_intelligence_creative_intelligence_notes from authenticated, anon;

create table if not exists public.aipify_studio_creative_intelligence_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_studio_creative_intelligence_audit_logs enable row level security;
revoke all on public.aipify_studio_creative_intelligence_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_studio_creative_intelligence_engine', v.description
from (values
  ('aipify_studio_creative_intelligence.view', 'View Studio Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_studio_creative_intelligence.manage', 'Manage Studio Center', 'Update settings and governance preferences'),
  ('aipify_studio_creative_intelligence.steward', 'Steward Studio Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_studio_creative_intelligence.view'), ('owner', 'aipify_studio_creative_intelligence.manage'), ('owner', 'aipify_studio_creative_intelligence.steward'),
  ('administrator', 'aipify_studio_creative_intelligence.view'), ('administrator', 'aipify_studio_creative_intelligence.manage'), ('administrator', 'aipify_studio_creative_intelligence.steward'),
  ('manager', 'aipify_studio_creative_intelligence.view'), ('manager', 'aipify_studio_creative_intelligence.steward'),
  ('employee', 'aipify_studio_creative_intelligence.view'), ('support_agent', 'aipify_studio_creative_intelligence.view'),
  ('moderator', 'aipify_studio_creative_intelligence.view'), ('viewer', 'aipify_studio_creative_intelligence.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._ascie_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._ascie_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._ascie_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._ascie_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_studio_creative_intelligence_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._ascie_ensure_settings(p_tenant_id uuid) returns public.aipify_studio_creative_intelligence_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_studio_creative_intelligence_settings; begin
  insert into public.aipify_studio_creative_intelligence_settings (tenant_id, enabled, creative_intelligence_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_studio_creative_intelligence_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._ascie_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_studio_creative_intelligence_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_studio_creative_intelligence_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Studio Companion supports, never replaces.', 'draft');
  insert into public.aipify_studio_creative_intelligence_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Studio Companion supports, never replaces.', 'draft');
  insert into public.aipify_studio_creative_intelligence_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Studio Companion supports, never replaces.', 'draft');
  insert into public.aipify_studio_creative_intelligence_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Studio Companion supports, never replaces.', 'draft');
  insert into public.aipify_studio_creative_intelligence_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Studio Companion supports, never replaces.', 'draft');
  insert into public.aipify_studio_creative_intelligence_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Studio Companion supports, never replaces.', 'draft');
  insert into public.aipify_studio_creative_intelligence_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Studio Companion supports, never replaces.', 'draft');
  insert into public.aipify_studio_creative_intelligence_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Studio Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._ascie_seed_creative_intelligence_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_studio_creative_intelligence_creative_intelligence_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_studio_creative_intelligence_creative_intelligence_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_studio_creative_intelligence_creative_intelligence_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_studio_creative_intelligence_creative_intelligence_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_studio_creative_intelligence_creative_intelligence_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_studio_creative_intelligence_creative_intelligence_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_studio_creative_intelligence_creative_intelligence_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_studio_creative_intelligence_creative_intelligence_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_studio_creative_intelligence_creative_intelligence_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._asciebp229_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 229 — Studio Center. Studio Companion supports studio and creative intelligence — NOT bypassing usage limits, exposing encrypted provider credentials, or replacing human creative approval workflows. Helpers _asciebp229_*.'; $$;
create or replace function public._asciebp229_mission() returns text language sql immutable as $$ select 'Enable organizations to create, enhance and manage visual assets directly within Aipify while maintaining enterprise-grade governance, cost control and flexibility — Studio Companion prepares, humans decide.'; $$;
create or replace function public._asciebp229_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._asciebp229_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Studio Center within Creative Intelligence Era (229–233). Human-stewarded creative governance; RBAC-protected creative intelligence scaffolds; included open-source models first; Studio Companion informs and supports.'; $$;
create or replace function public._asciebp229_vision() returns text language sql immutable as $$ select 'Aipify orchestrates creative platforms — organizations use included capabilities, connect existing subscriptions, and purchase additional capacity when needed. Employees solve everyday creative needs without complexity.'; $$;
create or replace function public._asciebp229_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Studio Center programs', 'emoji', '✅', 'description', 'Ten studio modules with governance'),
    jsonb_build_object('key', 'image_generation_center', 'label', 'Image generation center', 'emoji', '🎨', 'description', 'Icon, illustration, and marketing graphics generation'),
    jsonb_build_object('key', 'image_editing_center', 'label', 'Image editing center', 'emoji', '✂️', 'description', 'Enhancement, restoration, and object removal workflows'),
    jsonb_build_object('key', 'icon_studio', 'label', 'Icon studio', 'emoji', '🔷', 'description', 'SVG and PNG icon proposals with customization'),
    jsonb_build_object('key', 'companion', 'label', 'Studio Companion', 'emoji', '✨', 'description', 'Supports — does not replace designers or bypass usage limits'),
    jsonb_build_object('key', 'byol_integration_center', 'label', 'BYOL integration center', 'emoji', '🔗', 'description', 'Adobe Firefly, OpenAI Images, Google Imagen, Canva — customer-owned licenses'),
    jsonb_build_object('key', 'creative_governance_dashboard', 'label', 'Creative governance dashboard', 'emoji', '📊', 'description', 'Usage limits, cost governance, and audit visibility'),
    jsonb_build_object('key', 'open_source_stack', 'label', 'Open-source creative stack', 'emoji', '🌱', 'description', 'FLUX, Stable Diffusion, ComfyUI, Real-ESRGAN, rembg — included default')
  ); $$;
create or replace function public._asciebp229_creative_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Studio Center — ten modules. Creativity before complexity.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'creative_dashboard', 'label', 'Creative Dashboard — active workflows and requests requiring attention'),
    jsonb_build_object('key', 'image_generation_center', 'label', 'Image Generation Center — icons, illustrations, and marketing graphics'),
    jsonb_build_object('key', 'image_editing_center', 'label', 'Image Editing Center — enhancement, restoration, and object removal'),
    jsonb_build_object('key', 'icon_studio', 'label', 'Icon Studio — SVG, PNG, and customization proposals'),
    jsonb_build_object('key', 'presentation_asset_generator', 'label', 'Presentation Asset Generator — internal presentation and department visuals'),
    jsonb_build_object('key', 'background_removal_engine', 'label', 'Background Removal Engine — transparent PNG workflows'),
    jsonb_build_object('key', 'image_enhancement_engine', 'label', 'Image Enhancement Engine — lighting, sharpness, and restoration'),
    jsonb_build_object('key', 'image_upscaling_engine', 'label', 'Image Upscaling Engine — Real-ESRGAN and approved upscaling models'),
    jsonb_build_object('key', 'creative_history_center', 'label', 'Creative History Center — generated and edited asset history'),
    jsonb_build_object('key', 'creative_governance_dashboard', 'label', 'Creative Governance Dashboard — usage limits, approvals, and audit visibility')
  )); $$;
create or replace function public._asciebp229_image_generation_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Image generation center — included models first, premium last.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'included_first', 'label', 'Are included open-source models prioritized before premium providers?'),
    jsonb_build_object('key', 'usage_limits', 'label', 'Do usage limits align with role-based allowances?'),
    jsonb_build_object('key', 'output_format', 'label', 'Would SVG, PNG, or further customization best serve this request?'),
    jsonb_build_object('key', 'governance', 'label', 'Does this request require creative approval before execution?'),
    jsonb_build_object('key', 'cost_stewardship', 'label', 'How does cost governance encourage responsible creative consumption?')
  )); $$;
create or replace function public._asciebp229_image_editing_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Image editing center — stewardship before excess with human approval.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'lighting', 'label', 'Lighting improvement'),
    jsonb_build_object('key', 'sharpness', 'label', 'Sharpness enhancement'),
    jsonb_build_object('key', 'background', 'label', 'Background adjustment and removal'),
    jsonb_build_object('key', 'restoration', 'label', 'Photograph restoration'),
    jsonb_build_object('key', 'object_removal', 'label', 'Object removal'),
    jsonb_build_object('key', 'sensitive_images', 'label', 'Sensitive images — RBAC and retention policies enforced'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for premium edits')
  )); $$;
create or replace function public._asciebp229_image_enhancement_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Image enhancement and upscaling — professionalism before novelty.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'enhancement', 'label', 'Lighting, sharpness, and restoration options'),
    jsonb_build_object('key', 'upscaling', 'label', 'Real-ESRGAN and approved upscaling models'),
    jsonb_build_object('key', 'included_models', 'label', 'Included open-source stack prioritized'),
    jsonb_build_object('key', 'retention', 'label', 'Organization-controlled storage and retention'),
    jsonb_build_object('key', 'stewardship', 'label', 'Stewardship before excess prompts')
  )); $$;
create or replace function public._asciebp229_studio_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Studio Companion — supports creative workflows and never bypasses usage limits or exposes encrypted provider credentials.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'creative_workflow_summaries', 'label', 'Creative workflow summaries'),
    jsonb_build_object('key', 'generation_proposals', 'label', 'Icon and illustration proposals — SVG, PNG, customization'),
    jsonb_build_object('key', 'editing_guidance', 'label', 'Image editing guidance — lighting, sharpness, background, restoration'),
    jsonb_build_object('key', 'creative_request_prompts', 'label', 'Creative request prompts'),
    jsonb_build_object('key', 'byol_orchestration', 'label', 'BYOL provider orchestration highlights'),
    jsonb_build_object('key', 'usage_guardrails', 'label', 'Usage limits and creative access RBAC — Trust Architecture enforced')
  )); $$;
create or replace function public._asciebp229_icon_studio() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Icon studio — creativity before complexity.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'icon_generation', 'label', 'Icon generation for initiatives and departments'),
    jsonb_build_object('key', 'format_choice', 'label', 'SVG, PNG, or further customization options'),
    jsonb_build_object('key', 'internal_illustrations', 'label', 'Internal illustration generation'),
    jsonb_build_object('key', 'included_models', 'label', 'Open-source models preferred — FLUX, Stable Diffusion, ComfyUI'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only audit — no sensitive image content in logs'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for premium icon requests')
  )); $$;
create or replace function public._asciebp229_presentation_asset_generator() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Presentation asset generator — professional internal visuals.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'presentation_assets', 'label', 'Internal presentation assets'),
    jsonb_build_object('key', 'marketing_graphics', 'label', 'Basic marketing graphics'),
    jsonb_build_object('key', 'department_visuals', 'label', 'Department visuals and HR communication assets'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Marketing, HR, and design team permission tiers'),
    jsonb_build_object('key', 'usage_limits', 'label', 'Configurable monthly generation limits'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for premium assets')
  )); $$;
create or replace function public._asciebp229_background_removal_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Background removal engine — rembg and approved open-source models.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'background_removal', 'label', 'Background removal workflows'),
    jsonb_build_object('key', 'transparent_png', 'label', 'Transparent PNG output'),
    jsonb_build_object('key', 'included_stack', 'label', 'Included rembg and open-source stack'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Background removed — audit event logging'),
    jsonb_build_object('key', 'sensitive_images', 'label', 'Sensitive images protected — RBAC enforced'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for premium provider removal')
  )); $$;
create or replace function public._asciebp229_creative_governance_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Creative governance and history — stewardship through responsibility.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'creative_history', 'label', 'Creative History Center — asset history and audit trail'),
    jsonb_build_object('key', 'usage_limits', 'label', 'Role-based usage limits — employees, managers, design teams'),
    jsonb_build_object('key', 'cost_governance', 'label', 'Included models first, BYOL second, premium last'),
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center cross-link', 'cross_link', '/platform/trust'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200 cross-link', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Creative audit visibility respects role permissions')
  )); $$;
create or replace function public._asciebp229_byol_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'BYOL integration center — customers choose the engine; Aipify orchestrates.', 'providers', jsonb_build_array(
    jsonb_build_object('key', 'adobe_firefly', 'label', 'Adobe Firefly — customer Creative Cloud license'),
    jsonb_build_object('key', 'openai_images', 'label', 'OpenAI Images — customer-owned account'),
    jsonb_build_object('key', 'google_imagen', 'label', 'Google Imagen — Workspace integration'),
    jsonb_build_object('key', 'canva', 'label', 'Canva Pro — connected subscription'),
    jsonb_build_object('key', 'credential_encryption', 'label', 'Connected provider credentials encrypted'),
    jsonb_build_object('key', 'subscription_validation', 'label', 'Subscription validation and provider status visibility'),
    jsonb_build_object('key', 'premium_approval', 'label', 'Premium provider requests require approval')
  )); $$;
create or replace function public._asciebp229_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing usage limits',
      'Exposing encrypted provider credentials',
      'Replacing human creative approval workflows',
      'Prioritizing premium providers over included models without approval',
      'Storing sensitive images beyond retention policy',
      'Modifying creative audit trails',
      'Excess before stewardship',
      'Override human judgment'), 'principle', 'Studio Companion supports — humans steward creative decisions and usage accountability.'); $$;
create or replace function public._asciebp229_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm creative support without pressure or novelty-for-novelty.', 'values', jsonb_build_array('creativity_before_complexity','stewardship_before_excess','professionalism_before_novelty','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._asciebp229_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Creative intelligence audit logs via aipify_studio_creative_intelligence_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_studio_creative_intelligence permissions — creative access RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'RBAC-protected creative intelligence scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'credential_encryption', 'label', 'Connected provider credentials encrypted at rest'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._asciebp229_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 228, 'key', 'vendor_third_party_relationship', 'label', 'Vendors & Partners Phase 228', 'route', '/app/aipify-vendor-third-party-relationship-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 229, 'key', 'studio_creative_intelligence', 'label', 'Studio & Creative Phase 229', 'route', '/app/aipify-studio-creative-intelligence-engine', 'description', 'Human-stewarded studio and creative intelligence')
  ); $$;
create or replace function public._asciebp229_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center', 'route', '/platform/trust', 'relationship', 'Trust center integration — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive cockpit integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Creativity before complexity — cross-link only')
  ); $$;
create or replace function public._asciebp229_integration_links() returns jsonb language sql stable as $$ select public._asciebp229_era_opener_summary() || public._asciebp229_extended_cross_links(); $$;
create or replace function public._asciebp229_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Studio Center internally with RBAC-protected creative intelligence scaffolds and human approval gates. Growth Partner terminology. Studio Companion supports — never bypasses usage limits or exposes encrypted provider credentials.'; $$;
create or replace function public._asciebp229_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans steward creative decisions and usage accountability.', 'Studio Companion informs and supports.', 'Creativity before complexity — stewardship before excess.', 'Growth Partner — never Affiliate.', 'Creative Intelligence Era — 229–233.'); $$;
create or replace function public._asciebp229_privacy_note() returns text language sql immutable as $$
  select 'Studio Center metadata only — creative workflow signals max ~500 chars. No raw sensitive image content, encrypted provider credentials, or PII beyond RBAC and retention policy.'; $$;

create or replace function public._ascie_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_studio_creative_intelligence_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_studio_creative_intelligence_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_studio_creative_intelligence_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_studio_creative_intelligence_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_studio_creative_intelligence_creative_intelligence_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_studio_creative_intelligence_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.creative_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_studio_creative_intelligence_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'creative_intelligence_mode', coalesce(v_settings.creative_intelligence_mode, 'guided'),
    'creative_maturity_level', coalesce(v_settings.creative_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'creative_intelligence_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._asciebp229_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._asciebp229_integration_links()));
end; $$;

create or replace function public._asciebp229_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._ascie_ensure_settings(p_org_id); perform public._ascie_seed_reflections(p_org_id); perform public._ascie_seed_creative_intelligence_notes(p_org_id);
  v_metrics := public._ascie_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_studio_creative_intelligence_score', coalesce((v_metrics->>'aipify_studio_creative_intelligence_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'creative_intelligence_mode', coalesce(v_metrics->>'creative_intelligence_mode', 'guided'), 'creative_maturity_level', coalesce((v_metrics->>'creative_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'creative_intelligence_notes_count', coalesce((v_metrics->>'creative_intelligence_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._asciebp229_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._asciebp229_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._ascie_ensure_settings(p_org_id); perform public._ascie_seed_reflections(p_org_id); perform public._ascie_seed_creative_intelligence_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Studio Center — ten capabilities', 'met', jsonb_array_length(public._asciebp229_creative_dashboard()->'capabilities') = 10, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Image generation center — five reflection questions', 'met', jsonb_array_length(public._asciebp229_image_generation_center()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._asciebp229_image_editing_center()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Studio Companion capabilities', 'met', jsonb_array_length(public._asciebp229_studio_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_studio_creative_intelligence_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_studio_creative_intelligence_creative_intelligence_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._asciebp229_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 229–233 documented', 'met', jsonb_array_length(public._asciebp229_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 229 baseline tables', 'met', to_regclass('public.aipify_studio_creative_intelligence_settings') is not null, 'note', '_ascie_* helpers intact')
  );
end; $$;

create or replace function public._asciebp229_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 229 — Aipify Studio & Creative Intelligence Engine', 'title', 'Aipify Studio & Creative Intelligence Engine (Studio & Creative Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE229_AIPIFY_STUDIO_CREATIVE_INTELLIGENCE_ENGINE.md', 'engine_phase', 'Repo Phase 229', 'route', '/app/aipify-studio-creative-intelligence-engine'),
    'distinction_note', public._asciebp229_distinction_note(), 'mission', public._asciebp229_mission(), 'philosophy', public._asciebp229_philosophy(),
    'abos_principle', public._asciebp229_abos_principle(), 'vision', public._asciebp229_vision(), 'objectives', public._asciebp229_objectives(),
    'creative_dashboard', public._asciebp229_creative_dashboard(), 'image_generation_center', public._asciebp229_image_generation_center(),
    'image_editing_center', public._asciebp229_image_editing_center(), 'image_enhancement_engine', public._asciebp229_image_enhancement_engine(),
    'studio_companion', public._asciebp229_studio_companion(), 'icon_studio', public._asciebp229_icon_studio(),
    'background_removal_engine', public._asciebp229_background_removal_engine(), 'creative_governance_dashboard', public._asciebp229_creative_governance_dashboard(),
    'companion_limitations', public._asciebp229_companion_limitations(), 'self_love_connection', public._asciebp229_self_love_connection(),
    'security_requirements', public._asciebp229_security_requirements(), 'era_opener_summary', public._asciebp229_era_opener_summary(),
    'integration_links', public._asciebp229_integration_links(), 'dogfooding', public._asciebp229_dogfooding(),
    'success_criteria', public._asciebp229_success_criteria(p_org_id), 'engagement_summary', public._asciebp229_engagement_summary(p_org_id),
    'vision_phrases', public._asciebp229_vision_phrases(), 'privacy_note', public._asciebp229_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._ascie_require_tenant()); perform public._ascie_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_studio_creative_intelligence_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._ascie_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._ascie_require_tenant()); perform public._ascie_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_studio_creative_intelligence_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._ascie_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_studio_creative_intelligence_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_studio_creative_intelligence_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._ascie_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._ascie_ensure_settings(v_tenant_id); perform public._ascie_seed_reflections(v_tenant_id); perform public._ascie_seed_creative_intelligence_notes(v_tenant_id);
  v_metrics := public._ascie_refresh_metrics(v_tenant_id); v_engagement := public._asciebp229_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_studio_creative_intelligence_score', v_metrics->'aipify_studio_creative_intelligence_score', 'enabled', v_settings.enabled, 'creative_intelligence_mode', v_settings.creative_intelligence_mode,
    'creative_maturity_level', v_settings.creative_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._asciebp229_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 229 — Aipify Studio & Creative Intelligence Engine', 'title', 'Aipify Studio & Creative Intelligence Engine (Studio & Creative Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE229_AIPIFY_STUDIO_CREATIVE_INTELLIGENCE_ENGINE.md', 'route', '/app/aipify-studio-creative-intelligence-engine'),
    'aipify_studio_creative_intelligence_mission', public._asciebp229_mission(), 'aipify_studio_creative_intelligence_abos_principle', public._asciebp229_abos_principle(),
    'aipify_studio_creative_intelligence_engagement_summary', v_engagement, 'aipify_studio_creative_intelligence_note', public._asciebp229_distinction_note(), 'aipify_studio_creative_intelligence_vision_note', public._asciebp229_vision());
end; $$;

create or replace function public.get_aipify_studio_creative_intelligence_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_studio_creative_intelligence_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._ascie_require_tenant()); v_settings := public._ascie_ensure_settings(v_tenant_id);
  perform public._ascie_seed_reflections(v_tenant_id); perform public._ascie_seed_creative_intelligence_notes(v_tenant_id); v_metrics := public._ascie_refresh_metrics(v_tenant_id);
  perform public._ascie_log_audit(v_tenant_id, 'dashboard_view', 'Studio Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_studio_creative_intelligence_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'creative_intelligence_mode', v_settings.creative_intelligence_mode, 'creative_maturity_level', v_settings.creative_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._asciebp229_philosophy(),
    'safety_note', 'Studio Center — metadata scaffolds only. Studio Companion supports — never replaces human responsibility.',
    'distinction_note', public._asciebp229_distinction_note(), 'aipify_studio_creative_intelligence_score', v_metrics->'aipify_studio_creative_intelligence_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'creative_intelligence_notes_count', v_metrics->'creative_intelligence_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_studio_creative_intelligence_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_studio_creative_intelligence_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_studio_creative_intelligence_creative_intelligence_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._asciebp229_integration_links(), 'era_opener_summary', public._asciebp229_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 229 — Aipify Studio & Creative Intelligence Engine', 'title', 'Aipify Studio & Creative Intelligence Engine (Studio & Creative Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE229_AIPIFY_STUDIO_CREATIVE_INTELLIGENCE_ENGINE.md', 'route', '/app/aipify-studio-creative-intelligence-engine'),
    'aipify_studio_creative_intelligence_blueprint', public._asciebp229_blueprint_block(v_tenant_id), 'aipify_studio_creative_intelligence_mission', public._asciebp229_mission(), 'aipify_studio_creative_intelligence_philosophy', public._asciebp229_philosophy(),
    'aipify_studio_creative_intelligence_abos_principle', public._asciebp229_abos_principle(), 'aipify_studio_creative_intelligence_objectives', public._asciebp229_objectives(),
    'center_meta', public._asciebp229_creative_dashboard(), 'engine_meta', public._asciebp229_image_generation_center(), 'framework_meta', public._asciebp229_image_editing_center(),
    'executive_reviews_meta', public._asciebp229_image_enhancement_engine(), 'companion_meta', public._asciebp229_studio_companion(), 'sub_engine_meta', public._asciebp229_icon_studio(), 'background_removal_engine_meta', public._asciebp229_background_removal_engine(), 'creative_governance_dashboard_meta', public._asciebp229_creative_governance_dashboard(),
    'companion_limitations_meta', public._asciebp229_companion_limitations(), 'self_love_connection_meta', public._asciebp229_self_love_connection(),
    'security_requirements_meta', public._asciebp229_security_requirements(), 'asciebp229_integration_links', public._asciebp229_integration_links(),
    'asciebp229_era_opener_summary', public._asciebp229_era_opener_summary(), 'aipify_studio_creative_intelligence_engagement_summary', public._asciebp229_engagement_summary(v_tenant_id),
    'aipify_studio_creative_intelligence_success_criteria', public._asciebp229_success_criteria(v_tenant_id), 'aipify_studio_creative_intelligence_vision', public._asciebp229_vision(), 'aipify_studio_creative_intelligence_vision_phrases', public._asciebp229_vision_phrases(),
    'aipify_studio_creative_intelligence_privacy_note', public._asciebp229_privacy_note(), 'aipify_studio_creative_intelligence_dogfooding', public._asciebp229_dogfooding(), 'aipify_studio_creative_intelligence_engine_note', 'Phase 229 Aipify Studio & Creative Intelligence Engine — RBAC-protected studio and creative intelligence guidance within Creative Intelligence Era; cross-link only for Trust Center and Executive Cockpit Phase 200.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-studio-creative-intelligence-engine', 'Aipify Studio & Creative Intelligence Engine', 'Studio Center — Studio & Creative Era (221–230). People First.', 'authenticated', 217
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-studio-creative-intelligence-engine' and tenant_id is null);

grant execute on function public.get_aipify_studio_creative_intelligence_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_studio_creative_intelligence_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
