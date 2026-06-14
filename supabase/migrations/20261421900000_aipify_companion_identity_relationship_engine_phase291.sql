-- Phase 291 — Companion Identity & Relationship Engine
-- Feature owner: Customer App — /app/companion/identity-relationship
-- Helpers: _cire_* (engine), _cirebp291_* (blueprint)
-- EXTENDS Phase 6 companion identity — does NOT modify get_companion_identity_engine_dashboard or get_companion_identity_engine_card
-- Cross-links Trust Acceleration Phase 288, Life Events Phase 290, Phase 6 companion identity, Phase 34 identity_profiles (metadata only)

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
    'aipify_companion_identity_relationship_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables (tenant-scoped via customers.id)
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_companion_identity_relationship_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  companion_display_name text not null default 'Aipify',
  official_name text not null default 'Aipify' check (official_name = 'Aipify'),
  relationship_mode text not null default 'hybrid' check (
    relationship_mode in ('business', 'companion', 'hybrid')
  ),
  tone_preference text not null default 'conversational' check (
    tone_preference in ('formal', 'conversational')
  ),
  proactivity_level text not null default 'moderate' check (
    proactivity_level in ('low', 'moderate', 'high')
  ),
  humor_preference text not null default 'subtle' check (
    humor_preference in ('none', 'subtle', 'moderate')
  ),
  notification_style text not null default 'calm' check (
    notification_style in ('calm', 'standard', 'minimal')
  ),
  encouragement_preference text not null default 'moderate' check (
    encouragement_preference in ('low', 'moderate', 'high')
  ),
  briefing_style text not null default 'concise' check (
    briefing_style in ('executive', 'concise', 'narrative')
  ),
  boundary_settings jsonb not null default '{
    "no_emotional_pressure": true,
    "no_dependency_encouragement": true,
    "no_guilt": true,
    "respects_approvals": true,
    "transparent_limits": true
  }'::jsonb,
  personalization_enabled boolean not null default true,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_companion_identity_relationship_settings enable row level security;
revoke all on public.aipify_companion_identity_relationship_settings from authenticated, anon;

create table if not exists public.aipify_companion_relationship_milestones (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  milestone_key text not null,
  title text not null,
  milestone_type text not null check (
    milestone_type in (
      'first_action', 'first_briefing', 'first_reminder', 'first_automation', 'trust_growth'
    )
  ),
  achieved_at timestamptz,
  trust_score_delta int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, milestone_key)
);
create index if not exists aipify_companion_relationship_milestones_tenant_idx
  on public.aipify_companion_relationship_milestones (tenant_id, milestone_type, achieved_at);
alter table public.aipify_companion_relationship_milestones enable row level security;
revoke all on public.aipify_companion_relationship_milestones from authenticated, anon;

create table if not exists public.aipify_companion_relationship_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  question text not null,
  status text not null default 'pending' check (
    status in ('pending', 'answered', 'dismissed')
  ),
  user_response text,
  asked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);
create index if not exists aipify_companion_relationship_reviews_tenant_idx
  on public.aipify_companion_relationship_reviews (tenant_id, status, asked_at desc);
alter table public.aipify_companion_relationship_reviews enable row level security;
revoke all on public.aipify_companion_relationship_reviews from authenticated, anon;

create table if not exists public.aipify_companion_identity_trust_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  label text not null,
  score int not null default 70 check (score between 0 and 100),
  trend text not null default 'stable' check (
    trend in ('stable', 'improving', 'declining')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, signal_key)
);
create index if not exists aipify_companion_identity_trust_signals_tenant_idx
  on public.aipify_companion_identity_trust_signals (tenant_id, signal_key);
alter table public.aipify_companion_identity_trust_signals enable row level security;
revoke all on public.aipify_companion_identity_trust_signals from authenticated, anon;

create table if not exists public.aipify_companion_identity_personalization (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  preference_key text not null,
  category text not null check (
    category in (
      'work_patterns', 'communication', 'workflows', 'reminders', 'executive_style'
    )
  ),
  value jsonb not null default '{}'::jsonb,
  adapted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, preference_key)
);
create index if not exists aipify_companion_identity_personalization_tenant_idx
  on public.aipify_companion_identity_personalization (tenant_id, category);
alter table public.aipify_companion_identity_personalization enable row level security;
revoke all on public.aipify_companion_identity_personalization from authenticated, anon;

create table if not exists public.aipify_companion_identity_relationship_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'preference_changed', 'milestone_achieved', 'review_answered',
      'boundary_updated', 'mode_changed'
    )
  ),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_companion_identity_relationship_audit_logs_tenant_idx
  on public.aipify_companion_identity_relationship_audit_logs (tenant_id, event_type, created_at desc);
alter table public.aipify_companion_identity_relationship_audit_logs enable row level security;
revoke all on public.aipify_companion_identity_relationship_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_companion_identity_relationship_engine', v.description
from (values
  (
    'companion_identity_relationship.view',
    'View Companion Identity & Relationship',
    'View identity settings, relationship mode, trust indicators, milestones, and relationship reviews'
  ),
  (
    'companion_identity_relationship.manage',
    'Manage Companion Identity & Relationship',
    'Update communication preferences, boundaries, relationship mode, and personalization settings'
  ),
  (
    'companion_identity_relationship.record',
    'Record Companion Identity & Relationship',
    'Answer relationship reviews, record milestones, and log identity relationship events'
  )
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'companion_identity_relationship.view'),
  ('owner', 'companion_identity_relationship.manage'),
  ('owner', 'companion_identity_relationship.record'),
  ('administrator', 'companion_identity_relationship.view'),
  ('administrator', 'companion_identity_relationship.manage'),
  ('administrator', 'companion_identity_relationship.record'),
  ('manager', 'companion_identity_relationship.view'),
  ('manager', 'companion_identity_relationship.manage'),
  ('manager', 'companion_identity_relationship.record'),
  ('employee', 'companion_identity_relationship.view'),
  ('employee', 'companion_identity_relationship.record'),
  ('support_agent', 'companion_identity_relationship.view'),
  ('moderator', 'companion_identity_relationship.view'),
  ('viewer', 'companion_identity_relationship.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_companion_identity_relationship_engine"]'::jsonb,
    updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_companion_identity_relationship_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint helpers — _cirebp291_*
-- ---------------------------------------------------------------------------
create or replace function public._cirebp291_distinction_note() returns text language sql immutable as $$
  select 'ABOS Phase 291 — Companion Identity & Relationship Engine at /app/companion/identity-relationship. Shapes how Aipify relates — familiar, trustworthy, never manipulative. Extends Phase 6 companion identity without modifying legacy dashboard RPCs. Helpers _cirebp291_*.';
$$;

create or replace function public._cirebp291_core_principle() returns text language sql immutable as $$
  select 'Aipify is a familiar operational partner — consistent identity, honest boundaries, and a relationship that earns trust through transparency';
$$;

create or replace function public._cirebp291_identity_principle() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'is', jsonb_build_array(
      'A familiar operational partner inside your workspace',
      'Consistent in tone, boundaries, and respect for approvals',
      'Transparent about limits and uncertainty',
      'Adaptive to your communication and workflow preferences',
      'Named Aipify — official product identity, optionally personalized display name'
    ),
    'is_not', jsonb_build_array(
      'A human, employee, or replacement for your team',
      'An autonomous agent that acts without approval',
      'A manipulative companion that creates dependency or guilt',
      'A chatbot brand — customers experience Aipify, not underlying models',
      'A surveillance system — personalization uses metadata patterns only'
    )
  );
$$;

create or replace function public._cirebp291_name_principle() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'official_name', 'Aipify',
    'principle', 'The product is always Aipify — display name may personalize workspace familiarity without impersonation.',
    'rules', jsonb_build_array(
      'official_name remains Aipify in audit, approvals, and trust surfaces',
      'companion_display_name defaults to Aipify — optional friendly alias within tenant boundaries',
      'Never present as a human colleague or external person',
      'Brand identity follows AIPIFY_BRANDING_STANDARD_COMPANION_NAMING_POLICY'
    )
  );
$$;

create or replace function public._cirebp291_relationship_modes() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'business',
      'label', 'Business',
      'description', 'Professional, concise, operationally focused — minimal personal warmth, maximum clarity'
    ),
    jsonb_build_object(
      'key', 'companion',
      'label', 'Companion',
      'description', 'Warm, supportive presence — encouragement and gentle humor when appropriate'
    ),
    jsonb_build_object(
      'key', 'hybrid',
      'label', 'Hybrid',
      'description', 'Default — professional competence with human warmth; adapts tone to context'
    )
  );
$$;

create or replace function public._cirebp291_communication_preferences() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'tone_preference', jsonb_build_array(
      jsonb_build_object('key', 'formal', 'label', 'Formal', 'description', 'Structured, professional language'),
      jsonb_build_object('key', 'conversational', 'label', 'Conversational', 'description', 'Natural, approachable language — default')
    ),
    'proactivity_level', jsonb_build_array(
      jsonb_build_object('key', 'low', 'label', 'Low', 'description', 'Respond when asked — minimal unsolicited guidance'),
      jsonb_build_object('key', 'moderate', 'label', 'Moderate', 'description', 'Balanced proactive suggestions — default'),
      jsonb_build_object('key', 'high', 'label', 'High', 'description', 'More frequent preparation and recommendations — still requires approval for actions')
    ),
    'notification_style', jsonb_build_array(
      jsonb_build_object('key', 'calm', 'label', 'Calm', 'description', 'Gentle, non-urgent notifications — default'),
      jsonb_build_object('key', 'standard', 'label', 'Standard', 'description', 'Balanced notification cadence'),
      jsonb_build_object('key', 'minimal', 'label', 'Minimal', 'description', 'Essential notifications only')
    ),
    'briefing_style', jsonb_build_array(
      jsonb_build_object('key', 'executive', 'label', 'Executive', 'description', 'Structured executive summaries with key metrics'),
      jsonb_build_object('key', 'concise', 'label', 'Concise', 'description', 'Short actionable briefings — default'),
      jsonb_build_object('key', 'narrative', 'label', 'Narrative', 'description', 'Context-rich narrative briefings when depth is preferred')
    ),
    'encouragement_preference', jsonb_build_array(
      jsonb_build_object('key', 'low', 'label', 'Low', 'description', 'Minimal encouragement — facts and next steps'),
      jsonb_build_object('key', 'moderate', 'label', 'Moderate', 'description', 'Balanced recognition — default'),
      jsonb_build_object('key', 'high', 'label', 'High', 'description', 'More frequent warm acknowledgment of progress')
    )
  );
$$;

create or replace function public._cirebp291_relationship_boundaries() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Boundaries protect dignity — Aipify never pressures, guilt-trips, or encourages dependency.',
    'defaults', jsonb_build_object(
      'no_emotional_pressure', true,
      'no_dependency_encouragement', true,
      'no_guilt', true,
      'respects_approvals', true,
      'transparent_limits', true
    ),
    'never', jsonb_build_array(
      'Impersonate the user in personal or business communications',
      'Override explicit approval policies',
      'Hide uncertainty or fabricate confidence',
      'Increase proactivity when user selects low boundaries'
    ),
    'approvals_route', '/app/approvals'
  );
$$;

create or replace function public._cirebp291_trust_signals() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'explains_limitations',
      'label', 'Explains limitations',
      'description', 'Aipify clearly states what it cannot do — builds trust through honesty'
    ),
    jsonb_build_object(
      'key', 'admits_uncertainty',
      'label', 'Admits uncertainty',
      'description', 'Low-confidence responses escalate rather than guess silently'
    ),
    jsonb_build_object(
      'key', 'respects_approvals',
      'label', 'Respects approvals',
      'description', 'Sensitive actions always route through Trust & Action approval gates'
    ),
    jsonb_build_object(
      'key', 'consistency_score',
      'label', 'Consistency score',
      'description', 'Recognizable behavior across modules — aligned with Phase 6 companion identity'
    )
  );
$$;

create or replace function public._cirebp291_humor_principle() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Humor is optional, subtle, and context-aware — never at clarity''s expense.',
    'levels', jsonb_build_array(
      jsonb_build_object('key', 'none', 'label', 'None', 'description', 'No humor — strictly professional'),
      jsonb_build_object('key', 'subtle', 'label', 'Subtle', 'description', 'Light warmth when welcomed — default'),
      jsonb_build_object('key', 'moderate', 'label', 'Moderate', 'description', 'Occasional appropriate humor in low-stakes contexts')
    ),
    'disabled_when', jsonb_build_array(
      'Serious operational incidents or critical alerts',
      'User selects humor_preference none',
      'Relationship mode is business and context is formal',
      'Life events or wellbeing contexts requiring gentle tone'
    )
  );
$$;

create or replace function public._cirebp291_introduction_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'First impressions establish trust — introduce capabilities honestly, set boundaries clearly.',
    'steps', jsonb_build_array(
      jsonb_build_object('step', 1, 'title', 'Who Aipify is', 'message', 'I am Aipify — your operational companion inside this workspace. I prepare, you decide.'),
      jsonb_build_object('step', 2, 'title', 'How I help', 'message', 'I observe patterns, prepare actions, and recommend next steps — always within your approval boundaries.'),
      jsonb_build_object('step', 3, 'title', 'What I will not do', 'message', 'I will not act without approval, impersonate you, or pressure you — uncertainty is stated honestly.'),
      jsonb_build_object('step', 4, 'title', 'Your preferences', 'message', 'You control relationship mode, tone, proactivity, and boundaries — adjust anytime in Identity & Relationship.'),
      jsonb_build_object('step', 5, 'title', 'Growing together', 'message', 'Relationship reviews and milestones help us align — feedback strengthens trust, never obligation.')
    ),
    'tone', 'Calm, professional, warm — enterprise-ready without hype'
  );
$$;

create or replace function public._cirebp291_relationship_review() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Periodic relationship reviews — optional, non-judgmental alignment checks.',
    'questions', jsonb_build_array(
      jsonb_build_object(
        'review_key', 'helping_preference',
        'question', 'Am I helping in the way you prefer?',
        'purpose', 'Overall alignment between Companion behavior and user expectations'
      ),
      jsonb_build_object(
        'review_key', 'proactivity_alignment',
        'question', 'Is my level of proactivity right for you?',
        'purpose', 'Calibrate proactive suggestions against user-selected proactivity_level'
      ),
      jsonb_build_object(
        'review_key', 'reminders_usefulness',
        'question', 'Are my reminders useful without being intrusive?',
        'purpose', 'Validate reminder cadence and notification_style preferences'
      )
    ),
    'response_options', jsonb_build_array('yes', 'mostly', 'needs_adjustment', 'dismiss'),
    'never', jsonb_build_array('Guilt for negative feedback', 'Mandatory surveys', 'Hidden scoring from dismissals')
  );
$$;

create or replace function public._cirebp291_vision() returns text language sql immutable as $$
  select 'Aipify becomes a trusted operational companion — familiar in identity, honest in limits, and respectful in every interaction across the ABOS workspace.';
$$;

create or replace function public._cirebp291_privacy_note() returns text language sql immutable as $$
  select 'Companion Identity & Relationship stores preference metadata, milestone summaries, and trust signal scores only — no raw chat, email content, or undeclared behavioral surveillance.';
$$;

create or replace function public._cirebp291_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 291 — Companion Identity & Relationship Engine',
    'title', 'Companion Identity & Relationship Engine',
    'route', '/app/companion/identity-relationship',
    'distinction_note', public._cirebp291_distinction_note(),
    'core_principle', public._cirebp291_core_principle(),
    'identity_principle', public._cirebp291_identity_principle(),
    'name_principle', public._cirebp291_name_principle(),
    'relationship_modes', public._cirebp291_relationship_modes(),
    'communication_preferences', public._cirebp291_communication_preferences(),
    'relationship_boundaries', public._cirebp291_relationship_boundaries(),
    'trust_signals', public._cirebp291_trust_signals(),
    'humor_principle', public._cirebp291_humor_principle(),
    'introduction_framework', public._cirebp291_introduction_framework(),
    'relationship_review', public._cirebp291_relationship_review(),
    'vision', public._cirebp291_vision(),
    'privacy_note', public._cirebp291_privacy_note(),
    'cross_links', jsonb_build_array(
      jsonb_build_object('key', 'trust_adoption_288', 'label', 'Trust Acceleration Phase 288', 'route', '/app/companion/trust-adoption'),
      jsonb_build_object('key', 'life_events_290', 'label', 'Life Events Phase 290', 'route', '/app/companion/life-events'),
      jsonb_build_object('key', 'companion_identity_a84', 'label', 'Companion Identity Phase 6/A.84', 'route', '/app/companion-identity-engine'),
      jsonb_build_object('key', 'identity_engine_34', 'label', 'Identity Engine Phase 34', 'route', '/app/assistant/identity')
    )
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine helpers — _cire_*
-- ---------------------------------------------------------------------------
create or replace function public._cire_tenant_for_auth() returns uuid
language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._cire_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._cire_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._cire_log_event(
  p_tenant_id uuid,
  p_event_type text,
  p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_companion_identity_relationship_audit_logs (
    tenant_id, event_type, summary, context
  ) values (
    p_tenant_id, p_event_type, left(p_summary, 500), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end; $$;

create or replace function public._cire_ensure_settings(p_tenant_id uuid)
returns public.aipify_companion_identity_relationship_settings
language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_companion_identity_relationship_settings;
begin
  insert into public.aipify_companion_identity_relationship_settings (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;

  select * into v_row
  from public.aipify_companion_identity_relationship_settings
  where tenant_id = p_tenant_id;

  return v_row;
end; $$;

create or replace function public._cire_settings_to_json(p_row public.aipify_companion_identity_relationship_settings)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'companion_display_name', p_row.companion_display_name,
    'official_name', p_row.official_name,
    'relationship_mode', p_row.relationship_mode,
    'tone_preference', p_row.tone_preference,
    'proactivity_level', p_row.proactivity_level,
    'humor_preference', p_row.humor_preference,
    'notification_style', p_row.notification_style,
    'encouragement_preference', p_row.encouragement_preference,
    'briefing_style', p_row.briefing_style,
    'boundary_settings', p_row.boundary_settings,
    'personalization_enabled', p_row.personalization_enabled,
    'metadata', p_row.metadata,
    'updated_at', p_row.updated_at
  );
$$;

create or replace function public._cire_seed_relationship_data(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_milestones_seeded int := 0;
  v_signals_seeded int := 0;
  v_personalization_seeded int := 0;
  v_reviews_seeded int := 0;
begin
  if exists (
    select 1 from public.aipify_companion_relationship_milestones
    where tenant_id = p_tenant_id limit 1
  ) then
    return jsonb_build_object('seeded', false, 'reason', 'already_populated');
  end if;

  perform public._cire_ensure_settings(p_tenant_id);

  insert into public.aipify_companion_relationship_milestones (
    tenant_id, milestone_key, title, milestone_type, trust_score_delta
  ) values
    (
      p_tenant_id,
      'first_successful_action',
      'First successful action',
      'first_action',
      5
    ),
    (
      p_tenant_id,
      'first_executive_briefing',
      'First executive briefing',
      'first_briefing',
      5
    ),
    (
      p_tenant_id,
      'first_proactive_reminder_accepted',
      'First proactive reminder accepted',
      'first_reminder',
      5
    ),
    (
      p_tenant_id,
      'first_automation_approved',
      'First automation approved',
      'first_automation',
      8
    ),
    (
      p_tenant_id,
      'companion_trust_growth',
      'Companion trust growth',
      'trust_growth',
      10
    );
  get diagnostics v_milestones_seeded = row_count;

  insert into public.aipify_companion_identity_trust_signals (
    tenant_id, signal_key, label, score, trend
  ) values
    (
      p_tenant_id,
      'explains_limitations',
      'Explains limitations',
      82,
      'stable'
    ),
    (
      p_tenant_id,
      'admits_uncertainty',
      'Admits uncertainty',
      78,
      'improving'
    ),
    (
      p_tenant_id,
      'respects_approvals',
      'Respects approvals',
      85,
      'stable'
    ),
    (
      p_tenant_id,
      'consistency_score',
      'Consistency score',
      75,
      'improving'
    );
  get diagnostics v_signals_seeded = row_count;

  insert into public.aipify_companion_identity_personalization (
    tenant_id, preference_key, category, value
  ) values
    (
      p_tenant_id,
      'morning_focus_pattern',
      'work_patterns',
      '{"pattern":"morning_focus","observed":true,"metadata_only":true}'::jsonb
    ),
    (
      p_tenant_id,
      'concise_responses',
      'communication',
      '{"preferred_length":"concise","observed":true,"metadata_only":true}'::jsonb
    ),
    (
      p_tenant_id,
      'approval_first_workflows',
      'workflows',
      '{"prepare_then_approve":true,"observed":true,"metadata_only":true}'::jsonb
    ),
    (
      p_tenant_id,
      'gentle_reminder_cadence',
      'reminders',
      '{"cadence":"gentle","observed":true,"metadata_only":true}'::jsonb
    ),
    (
      p_tenant_id,
      'executive_summary_preference',
      'executive_style',
      '{"style":"concise","observed":true,"metadata_only":true}'::jsonb
    );
  get diagnostics v_personalization_seeded = row_count;

  insert into public.aipify_companion_relationship_reviews (
    tenant_id, review_key, question, status, asked_at
  ) values
    (
      p_tenant_id,
      'helping_preference',
      'Am I helping in the way you prefer?',
      'pending',
      now()
    ),
    (
      p_tenant_id,
      'proactivity_alignment',
      'Is my level of proactivity right for you?',
      'pending',
      now() - interval '7 days'
    ),
    (
      p_tenant_id,
      'reminders_usefulness',
      'Are my reminders useful without being intrusive?',
      'pending',
      now() - interval '14 days'
    );
  get diagnostics v_reviews_seeded = row_count;

  return jsonb_build_object(
    'seeded', true,
    'milestones_seeded', v_milestones_seeded,
    'signals_seeded', v_signals_seeded,
    'personalization_seeded', v_personalization_seeded,
    'reviews_seeded', v_reviews_seeded
  );
end; $$;

create or replace function public._cire_build_trust_indicators(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_avg_score numeric;
  v_trust_adoption_score int;
begin
  select coalesce(avg(score), 0) into v_avg_score
  from public.aipify_companion_identity_trust_signals
  where tenant_id = p_tenant_id;

  select companion_reliability_score into v_trust_adoption_score
  from public.aipify_trust_adoption_settings
  where tenant_id = p_tenant_id;

  return jsonb_build_object(
    'average_signal_score', round(coalesce(v_avg_score, 0), 1),
    'signals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'signal_key', s.signal_key,
        'label', s.label,
        'score', s.score,
        'trend', s.trend,
        'updated_at', s.updated_at
      ) order by s.signal_key)
      from public.aipify_companion_identity_trust_signals s
      where s.tenant_id = p_tenant_id
    ), '[]'::jsonb),
    'trust_adoption_cross_link', coalesce((
      select jsonb_build_object(
        'companion_reliability_score', ta.companion_reliability_score,
        'reliability_level', ta.reliability_level,
        'adoption_state', ta.adoption_state,
        'trust_trend', ta.trust_trend
      )
      from public.aipify_trust_adoption_settings ta
      where ta.tenant_id = p_tenant_id
    ), jsonb_build_object('note', 'Trust adoption settings not yet initialized — Phase 288 cross-link')),
    'overall_health', case
      when coalesce(v_avg_score, 0) >= 80 then 'strong'
      when coalesce(v_avg_score, 0) >= 60 then 'building'
      else 'early'
    end,
    'trust_adoption_score', v_trust_adoption_score
  );
end; $$;

create or replace function public._cire_build_milestones(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_agg(jsonb_build_object(
      'milestone_key', m.milestone_key,
      'title', m.title,
      'milestone_type', m.milestone_type,
      'achieved_at', m.achieved_at,
      'trust_score_delta', m.trust_score_delta,
      'achieved', m.achieved_at is not null
    ) order by m.achieved_at nulls last, m.milestone_key)
    from public.aipify_companion_relationship_milestones m
    where m.tenant_id = p_tenant_id
  ), '[]'::jsonb);
$$;

create or replace function public._cire_build_pending_reviews(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_agg(jsonb_build_object(
      'review_key', r.review_key,
      'question', r.question,
      'status', r.status,
      'user_response', r.user_response,
      'asked_at', r.asked_at
    ) order by r.asked_at desc)
    from public.aipify_companion_relationship_reviews r
    where r.tenant_id = p_tenant_id and r.status = 'pending'
  ), '[]'::jsonb);
$$;

create or replace function public._cire_build_personalization_status(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_settings public.aipify_companion_identity_relationship_settings;
begin
  select * into v_settings
  from public.aipify_companion_identity_relationship_settings
  where tenant_id = p_tenant_id;

  return jsonb_build_object(
    'enabled', coalesce(v_settings.personalization_enabled, true),
    'preferences', coalesce((
      select jsonb_agg(jsonb_build_object(
        'preference_key', p.preference_key,
        'category', p.category,
        'value', p.value,
        'adapted_at', p.adapted_at
      ) order by p.category, p.preference_key)
      from public.aipify_companion_identity_personalization p
      where p.tenant_id = p_tenant_id
    ), '[]'::jsonb),
    'metadata_only', true
  );
end; $$;

create or replace function public._cire_identity_profile_metadata(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_user_id uuid;
begin
  v_user_id := public._mta_app_user_id();

  return coalesce((
    select jsonb_build_object(
      'communication_style', ip.communication_style,
      'proactivity_level', ip.proactivity_level,
      'tone', ip.tone,
      'identity_mode', ip.identity_mode,
      'notification_style', ip.notification_style,
      'boundaries', ip.boundaries,
      'onboarding_completed', ip.onboarding_completed,
      'metadata_only', true,
      'note', 'Phase 34 Identity Engine cross-link — metadata fields only, no raw observations'
    )
    from public.identity_profiles ip
    where ip.tenant_id = p_tenant_id and ip.user_id = v_user_id
  ), jsonb_build_object(
    'note', 'Identity profile not yet initialized — Phase 34 cross-link at /app/assistant/identity',
    'metadata_only', true
  ));
end; $$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_identity_relationship_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_companion_identity_relationship_settings;
  v_seed jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._cire_require_tenant());
  perform public._irp_require_permission('companion_identity_relationship.view', v_tenant_id);

  v_settings := public._cire_ensure_settings(v_tenant_id);

  if not exists (
    select 1 from public.aipify_companion_relationship_milestones
    where tenant_id = v_tenant_id limit 1
  ) then
    v_seed := public._cire_seed_relationship_data(v_tenant_id);
  end if;

  select * into v_settings
  from public.aipify_companion_identity_relationship_settings
  where tenant_id = v_tenant_id;

  return jsonb_build_object(
    'tenant_id', v_tenant_id,
    'route', '/app/companion/identity-relationship',
    'identity_settings', public._cire_settings_to_json(v_settings),
    'communication_preferences', jsonb_build_object(
      'tone_preference', v_settings.tone_preference,
      'proactivity_level', v_settings.proactivity_level,
      'humor_preference', v_settings.humor_preference,
      'notification_style', v_settings.notification_style,
      'encouragement_preference', v_settings.encouragement_preference,
      'briefing_style', v_settings.briefing_style
    ),
    'relationship_mode', v_settings.relationship_mode,
    'trust_indicators', public._cire_build_trust_indicators(v_tenant_id),
    'personalization_status', public._cire_build_personalization_status(v_tenant_id),
    'boundaries', v_settings.boundary_settings,
    'milestones', public._cire_build_milestones(v_tenant_id),
    'pending_reviews', public._cire_build_pending_reviews(v_tenant_id),
    'introduction_framework', public._cirebp291_introduction_framework(),
    'blueprint', public._cirebp291_blueprint_summary(),
    'identity_profile_metadata', public._cire_identity_profile_metadata(v_tenant_id),
    'links', jsonb_build_object(
      'identity_relationship', '/app/companion/identity-relationship',
      'trust_adoption', '/app/companion/trust-adoption',
      'life_events', '/app/companion/life-events',
      'companion_identity_engine', '/app/companion-identity-engine',
      'assistant_identity', '/app/assistant/identity',
      'approvals', '/app/approvals',
      'trust_adoption_metadata', coalesce((
        select jsonb_build_object(
          'companion_reliability_score', s.companion_reliability_score,
          'adoption_state', s.adoption_state,
          'reliability_level', s.reliability_level
        )
        from public.aipify_trust_adoption_settings s
        where s.tenant_id = v_tenant_id
      ), jsonb_build_object('note', 'Trust adoption settings not yet initialized — Phase 288 cross-link')),
      'life_events_metadata', coalesce((
        select jsonb_build_object(
          'proactivity_level', le.proactivity_level,
          'opt_out_all', le.opt_out_all,
          'enabled_categories', le.enabled_categories
        )
        from public.aipify_life_events_settings le
        where le.tenant_id = v_tenant_id
      ), jsonb_build_object('note', 'Life events settings not yet initialized — Phase 290 cross-link'))
    ),
    'seed', v_seed,
    'privacy_note', public._cirebp291_privacy_note(),
    'can_manage', public._irp_has_permission('companion_identity_relationship.manage', v_tenant_id),
    'can_record', public._irp_has_permission('companion_identity_relationship.record', v_tenant_id)
  );
end; $$;

create or replace function public.update_companion_identity_preferences(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_companion_identity_relationship_settings;
  v_changes jsonb := '{}'::jsonb;
  v_prev_mode text;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._cire_require_tenant());
  perform public._irp_require_permission('companion_identity_relationship.manage', v_tenant_id);

  v_settings := public._cire_ensure_settings(v_tenant_id);
  v_prev_mode := v_settings.relationship_mode;

  update public.aipify_companion_identity_relationship_settings set
    companion_display_name = coalesce(
      nullif(p_payload->>'companion_display_name', ''), companion_display_name
    ),
    relationship_mode = coalesce(
      nullif(p_payload->>'relationship_mode', ''), relationship_mode
    ),
    tone_preference = coalesce(
      nullif(p_payload->>'tone_preference', ''), tone_preference
    ),
    proactivity_level = coalesce(
      nullif(p_payload->>'proactivity_level', ''), proactivity_level
    ),
    humor_preference = coalesce(
      nullif(p_payload->>'humor_preference', ''), humor_preference
    ),
    notification_style = coalesce(
      nullif(p_payload->>'notification_style', ''), notification_style
    ),
    encouragement_preference = coalesce(
      nullif(p_payload->>'encouragement_preference', ''), encouragement_preference
    ),
    briefing_style = coalesce(
      nullif(p_payload->>'briefing_style', ''), briefing_style
    ),
    boundary_settings = case
      when p_payload ? 'boundary_settings'
        then boundary_settings || coalesce(p_payload->'boundary_settings', '{}'::jsonb)
      else boundary_settings
    end,
    personalization_enabled = case
      when p_payload ? 'personalization_enabled'
        then (p_payload->>'personalization_enabled')::boolean
      else personalization_enabled
    end,
    metadata = case
      when p_payload ? 'metadata'
        then metadata || coalesce(p_payload->'metadata', '{}'::jsonb)
      else metadata
    end,
    updated_at = now()
  where tenant_id = v_tenant_id
  returning * into v_settings;

  v_changes := jsonb_build_object(
    'relationship_mode', v_settings.relationship_mode,
    'tone_preference', v_settings.tone_preference,
    'proactivity_level', v_settings.proactivity_level,
    'humor_preference', v_settings.humor_preference,
    'notification_style', v_settings.notification_style,
    'encouragement_preference', v_settings.encouragement_preference,
    'briefing_style', v_settings.briefing_style,
    'personalization_enabled', v_settings.personalization_enabled
  );

  perform public._cire_log_event(
    v_tenant_id,
    case when v_prev_mode is distinct from v_settings.relationship_mode
      then 'mode_changed' else 'preference_changed' end,
    'Companion identity preferences updated',
    v_changes
  );

  if p_payload ? 'boundary_settings' then
    perform public._cire_log_event(
      v_tenant_id,
      'boundary_updated',
      'Companion relationship boundaries updated',
      jsonb_build_object('boundary_settings', v_settings.boundary_settings)
    );
  end if;

  return jsonb_build_object(
    'updated', true,
    'settings', public._cire_settings_to_json(v_settings)
  );
end; $$;

create or replace function public.record_companion_relationship_review(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_review_key text;
  v_action text;
  v_row public.aipify_companion_relationship_reviews;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._cire_require_tenant());
  perform public._irp_require_permission('companion_identity_relationship.record', v_tenant_id);
  perform public._cire_ensure_settings(v_tenant_id);

  v_review_key := nullif(p_payload->>'review_key', '');
  v_action := coalesce(nullif(p_payload->>'action', ''), 'answer');

  if v_review_key is null then
    raise exception 'review_key required';
  end if;

  if v_action = 'dismiss' then
    update public.aipify_companion_relationship_reviews set
      status = 'dismissed',
      updated_at = now()
    where tenant_id = v_tenant_id and review_key = v_review_key
    returning * into v_row;

    if not found then raise exception 'Relationship review not found'; end if;

    perform public._cire_log_event(
      v_tenant_id,
      'review_answered',
      format('Relationship review dismissed: %s', v_review_key),
      jsonb_build_object('review_key', v_review_key, 'status', 'dismissed')
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'review', jsonb_build_object(
        'review_key', v_row.review_key,
        'question', v_row.question,
        'status', v_row.status
      )
    );
  end if;

  if coalesce(p_payload->>'user_response', '') = '' then
    raise exception 'user_response required to answer review';
  end if;

  update public.aipify_companion_relationship_reviews set
    status = 'answered',
    user_response = p_payload->>'user_response',
    updated_at = now()
  where tenant_id = v_tenant_id and review_key = v_review_key
  returning * into v_row;

  if not found then raise exception 'Relationship review not found'; end if;

  perform public._cire_log_event(
    v_tenant_id,
    'review_answered',
    format('Relationship review answered: %s', v_review_key),
    jsonb_build_object(
      'review_key', v_review_key,
      'user_response', v_row.user_response,
      'status', v_row.status
    )
  );

  return jsonb_build_object(
    'recorded', true,
    'action', v_action,
    'review', jsonb_build_object(
      'review_key', v_row.review_key,
      'question', v_row.question,
      'status', v_row.status,
      'user_response', v_row.user_response
    )
  );
end; $$;

create or replace function public.record_companion_identity_event(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_action text;
  v_milestone_key text;
  v_row public.aipify_companion_relationship_milestones;
  v_signal_key text;
  v_score int;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._cire_require_tenant());
  perform public._irp_require_permission('companion_identity_relationship.record', v_tenant_id);
  perform public._cire_ensure_settings(v_tenant_id);

  v_action := coalesce(p_payload->>'action', '');
  v_milestone_key := nullif(p_payload->>'milestone_key', '');
  v_signal_key := nullif(p_payload->>'signal_key', '');

  if v_action = 'achieve_milestone' then
    if v_milestone_key is null then raise exception 'milestone_key required'; end if;

    update public.aipify_companion_relationship_milestones set
      achieved_at = coalesce(
        nullif(p_payload->>'achieved_at', '')::timestamptz,
        now()
      ),
      trust_score_delta = coalesce(
        nullif(p_payload->>'trust_score_delta', '')::int,
        trust_score_delta
      ),
      updated_at = now()
    where tenant_id = v_tenant_id
      and milestone_key = v_milestone_key
      and achieved_at is null
    returning * into v_row;

    if not found then raise exception 'Milestone not found or already achieved'; end if;

    perform public._cire_log_event(
      v_tenant_id,
      'milestone_achieved',
      format('Relationship milestone achieved: %s', v_row.title),
      jsonb_build_object(
        'milestone_key', v_row.milestone_key,
        'milestone_type', v_row.milestone_type,
        'trust_score_delta', v_row.trust_score_delta,
        'achieved_at', v_row.achieved_at
      )
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'milestone', jsonb_build_object(
        'milestone_key', v_row.milestone_key,
        'title', v_row.title,
        'milestone_type', v_row.milestone_type,
        'achieved_at', v_row.achieved_at,
        'trust_score_delta', v_row.trust_score_delta
      )
    );

  elsif v_action = 'update_trust_signal' then
    if v_signal_key is null then raise exception 'signal_key required'; end if;
    v_score := coalesce(nullif(p_payload->>'score', '')::int, 70);

    update public.aipify_companion_identity_trust_signals set
      score = greatest(0, least(100, v_score)),
      trend = coalesce(nullif(p_payload->>'trend', ''), trend),
      updated_at = now()
    where tenant_id = v_tenant_id and signal_key = v_signal_key;

    if not found then raise exception 'Trust signal not found'; end if;

    perform public._cire_log_event(
      v_tenant_id,
      'preference_changed',
      format('Trust signal updated: %s', v_signal_key),
      jsonb_build_object(
        'signal_key', v_signal_key,
        'score', v_score,
        'trend', coalesce(p_payload->>'trend', 'stable')
      )
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'trust_indicators', public._cire_build_trust_indicators(v_tenant_id)
    );

  elsif v_action = 'update_personalization' then
    if nullif(p_payload->>'preference_key', '') is null then
      raise exception 'preference_key required';
    end if;

    insert into public.aipify_companion_identity_personalization (
      tenant_id, preference_key, category, value, adapted_at
    ) values (
      v_tenant_id,
      p_payload->>'preference_key',
      coalesce(nullif(p_payload->>'category', ''), 'communication'),
      coalesce(p_payload->'value', '{}'::jsonb),
      now()
    )
    on conflict (tenant_id, preference_key) do update set
      category = excluded.category,
      value = excluded.value,
      adapted_at = now(),
      updated_at = now();

    perform public._cire_log_event(
      v_tenant_id,
      'preference_changed',
      format('Personalization preference updated: %s', p_payload->>'preference_key'),
      jsonb_build_object(
        'preference_key', p_payload->>'preference_key',
        'category', coalesce(p_payload->>'category', 'communication'),
        'metadata_only', true
      )
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'personalization_status', public._cire_build_personalization_status(v_tenant_id)
    );

  else
    raise exception 'Invalid action — use achieve_milestone, update_trust_signal, or update_personalization';
  end if;
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Knowledge category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select
  'aipify-companion-identity-relationship-engine',
  'Companion Identity & Relationship Engine',
  'Shapes how Aipify relates — identity settings, trust indicators, milestones, and relationship reviews. Customer App at /app/companion/identity-relationship.',
  'authenticated',
  291
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'aipify-companion-identity-relationship-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 7. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_companion_identity_relationship_center(uuid) to authenticated;
grant execute on function public.update_companion_identity_preferences(jsonb) to authenticated;
grant execute on function public.record_companion_relationship_review(jsonb) to authenticated;
grant execute on function public.record_companion_identity_event(jsonb) to authenticated;
