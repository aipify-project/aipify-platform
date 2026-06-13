-- Phase 294 — Companion Action Memory Engine
-- Feature owner: Customer App — /app/companion/action-memory
-- Helpers: _came_* (engine), _camebp294_* (blueprint)
-- DISTINCT from PAME assistant memory — action preferences only
-- Cross-links Phase 293 action marketplace metadata only — does NOT modify Phase 293 RPCs or tables

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
    'aipify_companion_identity_relationship_engine',
    'aipify_companion_presence_continuity_engine',
    'aipify_companion_action_marketplace_engine',
    'aipify_companion_action_memory_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables (RLS revoke pattern)
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_companion_action_memory_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  memory_enabled boolean not null default true,
  enabled_categories jsonb not null default '[
    "transportation", "flowers_gifts", "food_catering", "travel", "business_actions"
  ]'::jsonb,
  disabled_categories jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_companion_action_memory_settings enable row level security;
revoke all on public.aipify_companion_action_memory_settings from authenticated, anon;

create table if not exists public.aipify_companion_action_memory_registry (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  memory_key text not null,
  category text not null check (category in (
    'transportation', 'flowers_gifts', 'food_catering', 'travel', 'business_actions'
  )),
  description text not null,
  origin_event text,
  last_used_at timestamptz,
  confidence_level text not null default 'learned_once' check (
    confidence_level in ('learned_once', 'emerging', 'established', 'strong')
  ),
  user_confirmed boolean not null default false,
  status text not null default 'active' check (
    status in ('active', 'disabled', 'deleted')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, memory_key)
);
create index if not exists aipify_companion_action_memory_registry_tenant_idx
  on public.aipify_companion_action_memory_registry (tenant_id, category, status);
alter table public.aipify_companion_action_memory_registry enable row level security;
revoke all on public.aipify_companion_action_memory_registry from authenticated, anon;

create table if not exists public.aipify_companion_action_memory_suggestions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  suggestion_key text not null,
  memory_key text,
  message text not null,
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'rejected', 'dismissed')
  ),
  based_on_pattern boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, suggestion_key)
);
create index if not exists aipify_companion_action_memory_suggestions_tenant_idx
  on public.aipify_companion_action_memory_suggestions (tenant_id, status, created_at desc);
alter table public.aipify_companion_action_memory_suggestions enable row level security;
revoke all on public.aipify_companion_action_memory_suggestions from authenticated, anon;

create table if not exists public.aipify_companion_action_memory_validations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  validation_key text not null,
  message text not null,
  trigger_type text not null check (
    trigger_type in ('inactivity', 'rejection', 'context_change', 'feedback')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'reviewed', 'dismissed')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, validation_key)
);
create index if not exists aipify_companion_action_memory_validations_tenant_idx
  on public.aipify_companion_action_memory_validations (tenant_id, status, created_at desc);
alter table public.aipify_companion_action_memory_validations enable row level security;
revoke all on public.aipify_companion_action_memory_validations from authenticated, anon;

create table if not exists public.aipify_companion_action_memory_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'preference_created', 'preference_updated', 'preference_deleted',
    'suggestion_accepted', 'suggestion_rejected', 'memory_reset', 'category_disabled'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_companion_action_memory_audit_logs_tenant_idx
  on public.aipify_companion_action_memory_audit_logs (tenant_id, event_type, created_at desc);
alter table public.aipify_companion_action_memory_audit_logs enable row level security;
revoke all on public.aipify_companion_action_memory_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_companion_action_memory_engine', v.description
from (values
  (
    'companion_action_memory.view',
    'View Companion Action Memory',
    'Browse remembered action preferences, suggestions, validations, and confidence indicators'
  ),
  (
    'companion_action_memory.manage',
    'Manage Companion Action Memory',
    'Update memory settings, dismiss validations, and disable categories'
  ),
  (
    'companion_action_memory.record',
    'Record Companion Action Memory Events',
    'Create, update, and confirm action preferences from observed patterns'
  ),
  (
    'companion_action_memory.delete',
    'Delete Companion Action Memory',
    'Delete or reset remembered action preferences — distinct from PAME assistant memory'
  )
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'companion_action_memory.view'),
  ('owner', 'companion_action_memory.manage'),
  ('owner', 'companion_action_memory.record'),
  ('owner', 'companion_action_memory.delete'),
  ('administrator', 'companion_action_memory.view'),
  ('administrator', 'companion_action_memory.manage'),
  ('administrator', 'companion_action_memory.record'),
  ('administrator', 'companion_action_memory.delete'),
  ('manager', 'companion_action_memory.view'),
  ('manager', 'companion_action_memory.manage'),
  ('manager', 'companion_action_memory.record'),
  ('manager', 'companion_action_memory.delete'),
  ('employee', 'companion_action_memory.view'),
  ('employee', 'companion_action_memory.record'),
  ('support_agent', 'companion_action_memory.view'),
  ('moderator', 'companion_action_memory.view'),
  ('viewer', 'companion_action_memory.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_companion_action_memory_engine"]'::jsonb,
    updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_companion_action_memory_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint helpers — _camebp294_*
-- ---------------------------------------------------------------------------
create or replace function public._camebp294_distinction_note() returns text language sql immutable as $$
  select 'ABOS Phase 294 — Companion Action Memory Engine at /app/companion/action-memory. Remembers action preferences only — distinct from PAME assistant memory at /app/assistant/memory. Cross-links Phase 293 marketplace metadata only. Helpers _camebp294_*.';
$$;

create or replace function public._camebp294_core_principle() returns text language sql immutable as $$
  select 'Your Companion remembers how you prefer real-world actions handled — you confirm every preference, and you can change or delete them anytime.';
$$;

create or replace function public._camebp294_memory_philosophy() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Action memory supports preparation — never replaces human decisions.',
    'rules', jsonb_build_array(
      'Remember action preferences only — not personal life memories (PAME owns those)',
      'Patterns emerge from observed actions — confidence grows with confirmation',
      'User confirmation required before strong confidence influences suggestions',
      'Every preference is editable, disableable, and deletable',
      'No silent preference creation — record events require explicit human approval',
      'Cross-link Phase 293 marketplace for execution — memory informs, marketplace executes'
    ),
    'pame_distinction', 'PAME at /app/assistant/memory stores people, events, tasks, habits, goals — Action Memory stores transportation, gifts, catering, travel, and business action preferences only.'
  );
$$;

create or replace function public._camebp294_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'transportation', 'label', 'Transportation', 'description', 'Taxi providers, airport timing, transfer preferences'),
    jsonb_build_object('key', 'flowers_gifts', 'label', 'Flowers & Gifts', 'description', 'Floral preferences, florist choices, gift patterns'),
    jsonb_build_object('key', 'food_catering', 'label', 'Food & Catering', 'description', 'Team catering habits, dietary considerations, office meal patterns'),
    jsonb_build_object('key', 'travel', 'label', 'Travel', 'description', 'Preferred airlines, hotel preferences, travel booking patterns'),
    jsonb_build_object('key', 'business_actions', 'label', 'Business Actions', 'description', 'Printing preferences, approval patterns, business service habits')
  );
$$;

create or replace function public._camebp294_confidence_levels() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'learned_once', 'label', 'Learned once', 'description', 'Observed a single time — suggestion only, not applied automatically'),
    jsonb_build_object('key', 'emerging', 'label', 'Emerging', 'description', 'Pattern forming — Companion may suggest, user confirms'),
    jsonb_build_object('key', 'established', 'label', 'Established', 'description', 'Repeated pattern with user confirmation — informs preparation'),
    jsonb_build_object('key', 'strong', 'label', 'Strong', 'description', 'User-confirmed preference — highest confidence for preparation, still requires approval for execution')
  );
$$;

create or replace function public._camebp294_user_control() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'You own your action preferences — Aipify prepares, you decide.',
    'controls', jsonb_build_array(
      jsonb_build_object('key', 'memory_enabled', 'label', 'Memory enabled', 'description', 'Pause all action memory learning and suggestions'),
      jsonb_build_object('key', 'enabled_categories', 'label', 'Enabled categories', 'description', 'Choose which action categories may be remembered'),
      jsonb_build_object('key', 'disabled_categories', 'label', 'Disabled categories', 'description', 'Explicitly excluded categories — never learned or suggested'),
      jsonb_build_object('key', 'confirm_preference', 'label', 'Confirm preference', 'description', 'confirm_action_memory_preference — user confirms observed patterns'),
      jsonb_build_object('key', 'delete_preference', 'label', 'Delete preference', 'description', 'Remove individual memories or reset entire category'),
      jsonb_build_object('key', 'dismiss_suggestion', 'label', 'Dismiss suggestion', 'description', 'Reject or dismiss suggestions without guilt or pressure'),
      jsonb_build_object('key', 'review_validation', 'label', 'Review validation', 'description', 'Respond when Companion notices preferences may have changed')
    )
  );
$$;

create or replace function public._camebp294_memory_validation() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Preferences evolve — Companion asks before assuming they still apply.',
    'trigger_types', jsonb_build_array(
      jsonb_build_object('key', 'inactivity', 'label', 'Inactivity', 'description', 'Preference unused for extended period'),
      jsonb_build_object('key', 'rejection', 'label', 'Rejection', 'description', 'User rejected a suggestion based on this preference'),
      jsonb_build_object('key', 'context_change', 'label', 'Context change', 'description', 'Observed behavior diverges from stored preference'),
      jsonb_build_object('key', 'feedback', 'label', 'Feedback', 'description', 'User provided explicit feedback that preferences may have changed')
    ),
    'validation_message_example', 'I noticed your preferences may have changed. Would you like to review them?'
  );
$$;

create or replace function public._camebp294_privacy_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Action memory stores preference metadata only — never raw operational records.',
    'requirements', jsonb_build_array(
      'No raw payment data, full addresses, or provider payloads in memory tables',
      'Descriptions are preference summaries — max metadata, no conversation transcripts',
      'Audit logs store event types and summaries only — context is structured metadata',
      'Tenant isolation mandatory — no cross-tenant pattern sharing',
      'Distinct from PAME — assistant memory and action memory remain separate stores',
      'Phase 293 marketplace cross-link is metadata only — separate RPC boundary'
    ),
    'audit_table', 'aipify_companion_action_memory_audit_logs'
  );
$$;

create or replace function public._camebp294_never_assume_intent() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Remembered preferences inform preparation — never assume intent or auto-execute.',
    'rules', jsonb_build_array(
      'Strong confidence does not bypass Approval Center for sensitive actions',
      'Suggestions are offers — pending until accepted, rejected, or dismissed',
      'Context change triggers validation — never silently overwrite preferences',
      'Category disabled means no new learning — existing memories remain until deleted',
      'Memory reset requires explicit human action — never automatic',
      'Execution always flows through Phase 293 marketplace with human approval gates'
    ),
    'approvals_route', '/app/approvals',
    'marketplace_route', '/app/marketplace/companion-actions'
  );
$$;

create or replace function public._camebp294_vision() returns text language sql immutable as $$
  select 'Aipify should remember how you like things done — quietly, respectfully, and only when it genuinely helps prepare the next action.';
$$;

create or replace function public._camebp294_privacy_note() returns text language sql immutable as $$
  select 'Companion Action Memory stores preference metadata, confidence levels, and pattern summaries only — distinct from PAME assistant memory. No raw payment data, addresses, or conversation content.';
$$;

create or replace function public._camebp294_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 294 — Companion Action Memory Engine',
    'title', 'Companion Action Memory Engine',
    'route', '/app/companion/action-memory',
    'distinction_note', public._camebp294_distinction_note(),
    'core_principle', public._camebp294_core_principle(),
    'memory_philosophy', public._camebp294_memory_philosophy(),
    'categories', public._camebp294_categories(),
    'confidence_levels', public._camebp294_confidence_levels(),
    'user_control', public._camebp294_user_control(),
    'memory_validation', public._camebp294_memory_validation(),
    'privacy_requirements', public._camebp294_privacy_requirements(),
    'never_assume_intent', public._camebp294_never_assume_intent(),
    'vision', public._camebp294_vision(),
    'privacy_note', public._camebp294_privacy_note(),
    'cross_links', jsonb_build_array(
      jsonb_build_object('key', 'companion_actions_293', 'label', 'Companion Action Marketplace Phase 293', 'route', '/app/marketplace/companion-actions'),
      jsonb_build_object('key', 'approvals_30', 'label', 'Trust & Action Phase 30', 'route', '/app/approvals'),
      jsonb_build_object('key', 'pame_distinct', 'label', 'PAME Assistant Memory (distinct)', 'route', '/app/assistant/memory'),
      jsonb_build_object('key', 'action_memory_center', 'label', 'Action Memory Center', 'route', '/app/companion/action-memory')
    )
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine helpers — _came_*
-- ---------------------------------------------------------------------------
create or replace function public._came_tenant_for_auth() returns uuid
language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._came_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._came_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._came_log_event(
  p_tenant_id uuid,
  p_event_type text,
  p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_companion_action_memory_audit_logs (
    tenant_id, event_type, summary, context
  ) values (
    p_tenant_id, p_event_type, left(p_summary, 500), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end; $$;

create or replace function public._came_ensure_settings(p_tenant_id uuid)
returns public.aipify_companion_action_memory_settings
language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_companion_action_memory_settings;
begin
  insert into public.aipify_companion_action_memory_settings (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row
  from public.aipify_companion_action_memory_settings
  where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._came_memory_to_json(p_row public.aipify_companion_action_memory_registry)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'memory_key', p_row.memory_key,
    'category', p_row.category,
    'description', p_row.description,
    'origin_event', p_row.origin_event,
    'last_used_at', p_row.last_used_at,
    'confidence_level', p_row.confidence_level,
    'user_confirmed', p_row.user_confirmed,
    'status', p_row.status,
    'created_at', p_row.created_at,
    'updated_at', p_row.updated_at
  );
$$;

create or replace function public._came_settings_to_json(p_row public.aipify_companion_action_memory_settings)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'memory_enabled', p_row.memory_enabled,
    'enabled_categories', p_row.enabled_categories,
    'disabled_categories', p_row.disabled_categories,
    'metadata', p_row.metadata,
    'updated_at', p_row.updated_at
  );
$$;

create or replace function public._came_seed_memory_data(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_seeded boolean := false;
  v_memories int := 0;
  v_suggestions int := 0;
begin
  perform public._came_ensure_settings(p_tenant_id);

  if exists (
    select 1 from public.aipify_companion_action_memory_registry
    where tenant_id = p_tenant_id limit 1
  ) then
    return jsonb_build_object('seeded', false, 'reason', 'already_populated');
  end if;

  insert into public.aipify_companion_action_memory_registry (
    tenant_id, memory_key, category, description, origin_event,
    last_used_at, confidence_level, user_confirmed, status
  ) values
    (
      p_tenant_id, 'preferred_taxi_provider', 'transportation',
      'Preferred taxi provider for business meetings — local partner network.',
      'taxi_meeting_downtown',
      now() - interval '3 days', 'established', true, 'active'
    ),
    (
      p_tenant_id, 'airport_departure_buffer', 'transportation',
      'Allow 90 minutes before airport departure for transfers.',
      'airport_transfer_pattern',
      now() - interval '14 days', 'strong', true, 'active'
    ),
    (
      p_tenant_id, 'red_roses_preference', 'flowers_gifts',
      'Red roses preferred for colleague and client gift occasions.',
      'flowers_birthday_colleague',
      now() - interval '7 days', 'established', true, 'active'
    ),
    (
      p_tenant_id, 'preferred_florist', 'flowers_gifts',
      'Preferred florist network for reliable national delivery.',
      'flower_delivery_completed',
      now() - interval '21 days', 'emerging', false, 'active'
    ),
    (
      p_tenant_id, 'team_catering_habits', 'food_catering',
      'Team lunch catering on Fridays — office catering partner preferred.',
      'catering_team_lunch',
      now() - interval '1 day', 'established', true, 'active'
    ),
    (
      p_tenant_id, 'dietary_considerations', 'food_catering',
      'Vegetarian and gluten-free options included in team catering orders.',
      'catering_dietary_feedback',
      now() - interval '10 days', 'emerging', false, 'active'
    ),
    (
      p_tenant_id, 'preferred_airline', 'travel',
      'Preferred airline for Nordic business travel — loyalty metadata only.',
      'flight_booking_pattern',
      now() - interval '30 days', 'learned_once', false, 'active'
    ),
    (
      p_tenant_id, 'hotel_preferences', 'travel',
      'Business hotels near city center — quiet room and early check-in when available.',
      'hotel_reservation_pattern',
      now() - interval '45 days', 'emerging', false, 'active'
    ),
    (
      p_tenant_id, 'print_black_white', 'business_actions',
      'Print reports in black and white unless color is explicitly requested.',
      'printing_services_request',
      now() - interval '5 days', 'strong', true, 'active'
    ),
    (
      p_tenant_id, 'approval_preferences', 'business_actions',
      'Review quotes in Approval Center before business service execution.',
      'approval_workflow_pattern',
      now() - interval '2 days', 'established', true, 'active'
    );

  get diagnostics v_memories = row_count;

  insert into public.aipify_companion_action_memory_suggestions (
    tenant_id, suggestion_key, memory_key, message, status, based_on_pattern
  ) values
    (
      p_tenant_id, 'taxi_provider_prep', 'preferred_taxi_provider',
      'Based on your taxi preference, I can pre-select your preferred provider when you request transportation.',
      'pending', true
    ),
    (
      p_tenant_id, 'airport_buffer_apply', 'airport_departure_buffer',
      'You usually allow 90 minutes before airport departures — should I apply this buffer to your next travel day?',
      'pending', true
    ),
    (
      p_tenant_id, 'red_roses_ready', 'red_roses_preference',
      'Red roses have been your gift preference — I can prepare a flower order when an occasion arises.',
      'pending', true
    ),
    (
      p_tenant_id, 'florist_confirm', 'preferred_florist',
      'A preferred florist pattern is emerging — confirm if you would like this saved as a strong preference.',
      'pending', true
    ),
    (
      p_tenant_id, 'friday_catering', 'team_catering_habits',
      'Friday team catering is a recurring pattern — I can prepare a quote when you are ready.',
      'pending', true
    ),
    (
      p_tenant_id, 'dietary_options', 'dietary_considerations',
      'Dietary considerations noted for team orders — include vegetarian and gluten-free options by default?',
      'pending', true
    ),
    (
      p_tenant_id, 'travel_airline', 'preferred_airline',
      'A preferred airline was observed once — confirm if you would like this remembered for future travel preparation.',
      'pending', true
    ),
    (
      p_tenant_id, 'hotel_prep', 'hotel_preferences',
      'Hotel preferences are forming — confirm quiet room and city-center proximity for business trips.',
      'pending', false
    ),
    (
      p_tenant_id, 'print_bw_default', 'print_black_white',
      'Black and white printing is your confirmed default — I can apply this to new print requests.',
      'pending', true
    ),
    (
      p_tenant_id, 'approval_gate', 'approval_preferences',
      'You prefer Approval Center review before business actions — I will prepare quotes accordingly.',
      'pending', true
    )
  on conflict (tenant_id, suggestion_key) do nothing;

  get diagnostics v_suggestions = row_count;

  insert into public.aipify_companion_action_memory_validations (
    tenant_id, validation_key, message, trigger_type, status
  ) values (
    p_tenant_id,
    'preferences_review_prompt',
    'I noticed your preferences may have changed. Would you like to review them?',
    'context_change',
    'pending'
  )
  on conflict (tenant_id, validation_key) do nothing;

  v_seeded := true;

  perform public._came_log_event(
    p_tenant_id,
    'preference_created',
    'Companion Action Memory sample preferences seeded',
    jsonb_build_object('seeded', true, 'memories', v_memories, 'metadata_only', true)
  );

  return jsonb_build_object(
    'seeded', v_seeded,
    'memories', v_memories,
    'suggestions', v_suggestions,
    'validations', 1
  );
end; $$;

create or replace function public._came_build_suggestions(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_agg(jsonb_build_object(
      'suggestion_key', s.suggestion_key,
      'memory_key', s.memory_key,
      'message', s.message,
      'status', s.status,
      'based_on_pattern', s.based_on_pattern,
      'category', m.category,
      'confidence_level', m.confidence_level,
      'created_at', s.created_at
    ) order by case s.status when 'pending' then 1 when 'accepted' then 2 else 3 end, s.created_at)
    from public.aipify_companion_action_memory_suggestions s
    left join public.aipify_companion_action_memory_registry m
      on m.tenant_id = s.tenant_id and m.memory_key = s.memory_key
    where s.tenant_id = p_tenant_id and s.status = 'pending'
  ), '[]'::jsonb);
$$;

create or replace function public._came_build_remembered_preferences(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_agg(public._came_memory_to_json(m) order by m.category, m.memory_key)
    from public.aipify_companion_action_memory_registry m
    where m.tenant_id = p_tenant_id and m.status = 'active'
  ), '[]'::jsonb);
$$;

create or replace function public._came_build_recent_patterns(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_agg(s.row_data order by s.last_used_at desc nulls last)
    from (
      select public._came_memory_to_json(m) as row_data, m.last_used_at
      from public.aipify_companion_action_memory_registry m
      where m.tenant_id = p_tenant_id and m.status = 'active'
      order by m.last_used_at desc nulls last
      limit 8
    ) s
  ), '[]'::jsonb);
$$;

create or replace function public._came_build_confidence_indicators(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'by_level', coalesce((
      select jsonb_object_agg(confidence_level, cnt)
      from (
        select confidence_level, count(*) as cnt
        from public.aipify_companion_action_memory_registry
        where tenant_id = p_tenant_id and status = 'active'
        group by confidence_level
      ) s
    ), '{}'::jsonb),
    'by_category', coalesce((
      select jsonb_object_agg(category, cnt)
      from (
        select category, count(*) as cnt
        from public.aipify_companion_action_memory_registry
        where tenant_id = p_tenant_id and status = 'active'
        group by category
      ) s
    ), '{}'::jsonb),
    'user_confirmed_count', (
      select count(*) from public.aipify_companion_action_memory_registry
      where tenant_id = p_tenant_id and status = 'active' and user_confirmed = true
    ),
    'pending_confirmation_count', (
      select count(*) from public.aipify_companion_action_memory_registry
      where tenant_id = p_tenant_id and status = 'active' and user_confirmed = false
    ),
    'metadata_only', true
  );
$$;

create or replace function public._came_build_validations(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_agg(jsonb_build_object(
      'validation_key', v.validation_key,
      'message', v.message,
      'trigger_type', v.trigger_type,
      'status', v.status,
      'created_at', v.created_at
    ) order by case v.status when 'pending' then 1 when 'reviewed' then 2 else 3 end, v.created_at desc)
    from public.aipify_companion_action_memory_validations v
    where v.tenant_id = p_tenant_id and v.status = 'pending'
  ), '[]'::jsonb);
$$;

create or replace function public._came_build_categories_enabled(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_settings public.aipify_companion_action_memory_settings;
  v_all jsonb;
begin
  select * into v_settings
  from public.aipify_companion_action_memory_settings
  where tenant_id = p_tenant_id;

  v_all := public._camebp294_categories();

  return jsonb_build_object(
    'memory_enabled', coalesce(v_settings.memory_enabled, true),
    'enabled_categories', coalesce(v_settings.enabled_categories, '[]'::jsonb),
    'disabled_categories', coalesce(v_settings.disabled_categories, '[]'::jsonb),
    'catalog', v_all
  );
end; $$;

create or replace function public._came_marketplace_metadata(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_build_object(
      'installed_providers', (
        select count(*) from public.aipify_companion_action_tenant_providers
        where tenant_id = p_tenant_id and status = 'installed'
      ),
      'completed_actions_30d', (
        select count(*) from public.aipify_companion_action_history
        where tenant_id = p_tenant_id and status = 'completed'
          and created_at >= now() - interval '30 days'
      ),
      'route', '/app/marketplace/companion-actions',
      'note', 'Phase 293 Companion Action Marketplace cross-link — metadata only, separate RPC',
      'metadata_only', true
    )
  ), jsonb_build_object(
    'note', 'Companion Action Marketplace not yet initialized — Phase 293 cross-link',
    'route', '/app/marketplace/companion-actions',
    'metadata_only', true
  ));
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_action_memory_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_companion_action_memory_settings;
  v_seed jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._came_require_tenant());
  perform public._irp_require_permission('companion_action_memory.view', v_tenant_id);

  v_settings := public._came_ensure_settings(v_tenant_id);

  if not exists (
    select 1 from public.aipify_companion_action_memory_registry
    where tenant_id = v_tenant_id limit 1
  ) then
    v_seed := public._came_seed_memory_data(v_tenant_id);
  end if;

  select * into v_settings
  from public.aipify_companion_action_memory_settings
  where tenant_id = v_tenant_id;

  return jsonb_build_object(
    'tenant_id', v_tenant_id,
    'route', '/app/companion/action-memory',
    'settings', public._came_settings_to_json(v_settings),
    'remembered_preferences', public._came_build_remembered_preferences(v_tenant_id),
    'recent_patterns', public._came_build_recent_patterns(v_tenant_id),
    'confidence_indicators', public._came_build_confidence_indicators(v_tenant_id),
    'categories_enabled', public._came_build_categories_enabled(v_tenant_id),
    'suggestions', public._came_build_suggestions(v_tenant_id),
    'validations', public._came_build_validations(v_tenant_id),
    'blueprint', public._camebp294_blueprint_summary(),
    'links', jsonb_build_object(
      'action_memory', '/app/companion/action-memory',
      'companion_actions_293', '/app/marketplace/companion-actions',
      'approvals', '/app/approvals',
      'assistant_memory_pame', '/app/assistant/memory',
      'pame_distinction_note', 'PAME assistant memory is distinct — people, events, tasks, habits, goals. Action Memory stores action preferences only.',
      'marketplace_metadata', public._came_marketplace_metadata(v_tenant_id)
    ),
    'seed', v_seed,
    'privacy_note', public._camebp294_privacy_note(),
    'can_manage', public._irp_has_permission('companion_action_memory.manage', v_tenant_id),
    'can_record', public._irp_has_permission('companion_action_memory.record', v_tenant_id),
    'can_delete', public._irp_has_permission('companion_action_memory.delete', v_tenant_id)
  );
end; $$;

create or replace function public.update_companion_action_memory_settings(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_companion_action_memory_settings;
  v_prev_enabled boolean;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._came_require_tenant());
  perform public._irp_require_permission('companion_action_memory.manage', v_tenant_id);

  v_settings := public._came_ensure_settings(v_tenant_id);
  v_prev_enabled := v_settings.memory_enabled;

  update public.aipify_companion_action_memory_settings set
    memory_enabled = coalesce((p_payload->>'memory_enabled')::boolean, memory_enabled),
    enabled_categories = case
      when p_payload ? 'enabled_categories'
        then p_payload->'enabled_categories'
      else enabled_categories
    end,
    disabled_categories = case
      when p_payload ? 'disabled_categories'
        then p_payload->'disabled_categories'
      else disabled_categories
    end,
    metadata = case
      when p_payload ? 'metadata'
        then metadata || coalesce(p_payload->'metadata', '{}'::jsonb)
      else metadata
    end,
    updated_at = now()
  where tenant_id = v_tenant_id
  returning * into v_settings;

  if v_prev_enabled is distinct from v_settings.memory_enabled then
    perform public._came_log_event(
      v_tenant_id,
      'preference_updated',
      format('Action memory %s', case when v_settings.memory_enabled then 'enabled' else 'paused' end),
      jsonb_build_object('memory_enabled', v_settings.memory_enabled)
    );
  end if;

  return jsonb_build_object(
    'updated', true,
    'settings', public._came_settings_to_json(v_settings),
    'categories_enabled', public._came_build_categories_enabled(v_tenant_id)
  );
end; $$;

create or replace function public.record_companion_action_memory_event(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_action text;
  v_memory_key text;
  v_suggestion_key text;
  v_category text;
  v_row public.aipify_companion_action_memory_registry;
  v_settings public.aipify_companion_action_memory_settings;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._came_require_tenant());
  v_action := coalesce(p_payload->>'action', '');

  if v_action in ('delete', 'reset') then
    perform public._irp_require_permission('companion_action_memory.delete', v_tenant_id);
  elsif v_action in ('disable_category') then
    perform public._irp_require_permission('companion_action_memory.manage', v_tenant_id);
  else
    perform public._irp_require_permission('companion_action_memory.record', v_tenant_id);
  end if;

  v_settings := public._came_ensure_settings(v_tenant_id);
  v_memory_key := nullif(p_payload->>'memory_key', '');
  v_suggestion_key := nullif(p_payload->>'suggestion_key', '');
  v_category := nullif(p_payload->>'category', '');

  if v_action = 'create' then
    if v_memory_key is null then raise exception 'memory_key required'; end if;
    if v_category is null then raise exception 'category required'; end if;
    if nullif(p_payload->>'description', '') is null then raise exception 'description required'; end if;

    if v_settings.disabled_categories @> to_jsonb(v_category) then
      return jsonb_build_object(
        'error', 'category_disabled',
        'message', format('Category %s is disabled — enable before creating preferences.', v_category)
      );
    end if;

    insert into public.aipify_companion_action_memory_registry (
      tenant_id, memory_key, category, description, origin_event,
      last_used_at, confidence_level, user_confirmed, status
    ) values (
      v_tenant_id,
      v_memory_key,
      v_category,
      left(p_payload->>'description', 500),
      left(p_payload->>'origin_event', 500),
      coalesce(nullif(p_payload->>'last_used_at', '')::timestamptz, now()),
      coalesce(nullif(p_payload->>'confidence_level', ''), 'learned_once'),
      coalesce((p_payload->>'user_confirmed')::boolean, false),
      'active'
    )
    on conflict (tenant_id, memory_key) do update set
      category = excluded.category,
      description = excluded.description,
      origin_event = excluded.origin_event,
      last_used_at = excluded.last_used_at,
      confidence_level = excluded.confidence_level,
      user_confirmed = excluded.user_confirmed,
      status = 'active',
      updated_at = now()
    returning * into v_row;

    perform public._came_log_event(
      v_tenant_id, 'preference_created',
      format('Action preference created: %s', v_memory_key),
      jsonb_build_object('memory_key', v_memory_key, 'category', v_category)
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'memory', public._came_memory_to_json(v_row)
    );

  elsif v_action = 'update' then
    if v_memory_key is null then raise exception 'memory_key required'; end if;

    update public.aipify_companion_action_memory_registry set
      description = coalesce(left(p_payload->>'description', 500), description),
      origin_event = coalesce(left(p_payload->>'origin_event', 500), origin_event),
      last_used_at = coalesce(nullif(p_payload->>'last_used_at', '')::timestamptz, last_used_at),
      confidence_level = coalesce(nullif(p_payload->>'confidence_level', ''), confidence_level),
      user_confirmed = coalesce((p_payload->>'user_confirmed')::boolean, user_confirmed),
      status = coalesce(nullif(p_payload->>'status', ''), status),
      updated_at = now()
    where tenant_id = v_tenant_id and memory_key = v_memory_key and status <> 'deleted'
    returning * into v_row;

    if not found then raise exception 'Memory preference not found'; end if;

    perform public._came_log_event(
      v_tenant_id, 'preference_updated',
      format('Action preference updated: %s', v_memory_key),
      jsonb_build_object('memory_key', v_memory_key)
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'memory', public._came_memory_to_json(v_row)
    );

  elsif v_action = 'delete' then
    if v_memory_key is null then raise exception 'memory_key required'; end if;

    update public.aipify_companion_action_memory_registry set
      status = 'deleted',
      updated_at = now()
    where tenant_id = v_tenant_id and memory_key = v_memory_key and status <> 'deleted'
    returning * into v_row;

    if not found then raise exception 'Memory preference not found'; end if;

    update public.aipify_companion_action_memory_suggestions set
      status = 'dismissed',
      updated_at = now()
    where tenant_id = v_tenant_id and memory_key = v_memory_key and status = 'pending';

    perform public._came_log_event(
      v_tenant_id, 'preference_deleted',
      format('Action preference deleted: %s', v_memory_key),
      jsonb_build_object('memory_key', v_memory_key)
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'remembered_preferences', public._came_build_remembered_preferences(v_tenant_id)
    );

  elsif v_action = 'accept' then
    if v_suggestion_key is null then raise exception 'suggestion_key required'; end if;

    update public.aipify_companion_action_memory_suggestions set
      status = 'accepted',
      updated_at = now()
    where tenant_id = v_tenant_id and suggestion_key = v_suggestion_key and status = 'pending';

    if not found then raise exception 'Suggestion not found or not pending'; end if;

    select memory_key into v_memory_key
    from public.aipify_companion_action_memory_suggestions
    where tenant_id = v_tenant_id and suggestion_key = v_suggestion_key;

    if v_memory_key is not null then
      update public.aipify_companion_action_memory_registry set
        user_confirmed = true,
        confidence_level = case confidence_level
          when 'learned_once' then 'emerging'
          when 'emerging' then 'established'
          else confidence_level
        end,
        last_used_at = now(),
        updated_at = now()
      where tenant_id = v_tenant_id and memory_key = v_memory_key and status = 'active';
    end if;

    perform public._came_log_event(
      v_tenant_id, 'suggestion_accepted',
      format('Suggestion accepted: %s', v_suggestion_key),
      jsonb_build_object('suggestion_key', v_suggestion_key, 'memory_key', v_memory_key)
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'suggestions', public._came_build_suggestions(v_tenant_id)
    );

  elsif v_action = 'reject' then
    if v_suggestion_key is null then raise exception 'suggestion_key required'; end if;

    update public.aipify_companion_action_memory_suggestions set
      status = 'rejected',
      updated_at = now()
    where tenant_id = v_tenant_id and suggestion_key = v_suggestion_key and status = 'pending';

    if not found then raise exception 'Suggestion not found or not pending'; end if;

    perform public._came_log_event(
      v_tenant_id, 'suggestion_rejected',
      format('Suggestion rejected: %s', v_suggestion_key),
      jsonb_build_object('suggestion_key', v_suggestion_key)
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'suggestions', public._came_build_suggestions(v_tenant_id)
    );

  elsif v_action = 'reset' then
    update public.aipify_companion_action_memory_registry set
      status = 'deleted',
      updated_at = now()
    where tenant_id = v_tenant_id and status = 'active';

    update public.aipify_companion_action_memory_suggestions set
      status = 'dismissed',
      updated_at = now()
    where tenant_id = v_tenant_id and status = 'pending';

    update public.aipify_companion_action_memory_validations set
      status = 'dismissed',
      updated_at = now()
    where tenant_id = v_tenant_id and status = 'pending';

    perform public._came_log_event(
      v_tenant_id, 'memory_reset',
      'All companion action memory preferences reset by user',
      jsonb_build_object('metadata_only', true)
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'remembered_preferences', public._came_build_remembered_preferences(v_tenant_id),
      'suggestions', public._came_build_suggestions(v_tenant_id)
    );

  elsif v_action = 'disable_category' then
    if v_category is null then raise exception 'category required'; end if;

    update public.aipify_companion_action_memory_settings set
      disabled_categories = case
        when disabled_categories @> to_jsonb(v_category) then disabled_categories
        else disabled_categories || to_jsonb(v_category)
      end,
      enabled_categories = (
        select coalesce(jsonb_agg(elem), '[]'::jsonb)
        from jsonb_array_elements_text(enabled_categories) elem
        where elem <> v_category
      ),
      updated_at = now()
    where tenant_id = v_tenant_id
    returning * into v_settings;

    update public.aipify_companion_action_memory_registry set
      status = 'disabled',
      updated_at = now()
    where tenant_id = v_tenant_id and category = v_category and status = 'active';

    update public.aipify_companion_action_memory_suggestions set
      status = 'dismissed',
      updated_at = now()
    where tenant_id = v_tenant_id and status = 'pending'
      and memory_key in (
        select memory_key from public.aipify_companion_action_memory_registry
        where tenant_id = v_tenant_id and category = v_category
      );

    perform public._came_log_event(
      v_tenant_id, 'category_disabled',
      format('Action memory category disabled: %s', v_category),
      jsonb_build_object('category', v_category)
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'settings', public._came_settings_to_json(v_settings),
      'categories_enabled', public._came_build_categories_enabled(v_tenant_id)
    );

  else
    raise exception 'Unsupported action: %', v_action;
  end if;
end; $$;

create or replace function public.confirm_action_memory_preference(
  p_memory_key text,
  p_confirmed boolean default true,
  p_org_id uuid default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_row public.aipify_companion_action_memory_registry;
begin
  v_tenant_id := coalesce(p_org_id, public._came_require_tenant());
  perform public._irp_require_permission('companion_action_memory.record', v_tenant_id);

  if p_memory_key is null or btrim(p_memory_key) = '' then
    raise exception 'memory_key required';
  end if;

  update public.aipify_companion_action_memory_registry set
    user_confirmed = p_confirmed,
    confidence_level = case
      when p_confirmed and confidence_level = 'learned_once' then 'emerging'
      when p_confirmed and confidence_level = 'emerging' then 'established'
      when p_confirmed and confidence_level = 'established' then 'strong'
      when not p_confirmed then 'learned_once'
      else confidence_level
    end,
    last_used_at = now(),
    updated_at = now()
  where tenant_id = v_tenant_id
    and memory_key = p_memory_key
    and status in ('active', 'disabled')
  returning * into v_row;

  if not found then raise exception 'Memory preference not found'; end if;

  perform public._came_log_event(
    v_tenant_id,
    'preference_updated',
    format('Preference %s %s', p_memory_key, case when p_confirmed then 'confirmed' else 'unconfirmed' end),
    jsonb_build_object(
      'memory_key', p_memory_key,
      'user_confirmed', p_confirmed,
      'confidence_level', v_row.confidence_level
    )
  );

  return jsonb_build_object(
    'confirmed', p_confirmed,
    'memory', public._came_memory_to_json(v_row),
    'confidence_indicators', public._came_build_confidence_indicators(v_tenant_id)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Knowledge category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select
  'aipify-companion-action-memory-engine',
  'Companion Action Memory Engine',
  'Remembers action preferences for transportation, gifts, catering, travel, and business actions — distinct from PAME. Customer App at /app/companion/action-memory.',
  'authenticated',
  294
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'aipify-companion-action-memory-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 7. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_companion_action_memory_center(uuid) to authenticated;
grant execute on function public.update_companion_action_memory_settings(jsonb) to authenticated;
grant execute on function public.record_companion_action_memory_event(jsonb) to authenticated;
grant execute on function public.confirm_action_memory_preference(text, boolean, uuid) to authenticated;
