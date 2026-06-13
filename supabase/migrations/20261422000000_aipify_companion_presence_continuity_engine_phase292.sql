-- Phase 292 — Companion Presence & Continuity Engine
-- Feature owner: Customer App — /app/companion/presence-continuity
-- Helpers: _cpce_* (engine), _cpcebp292_* (blueprint)
-- EXTENDS presence concepts — does NOT modify get_command_center_bundle, get_command_center_bundle_for_tenant, or get_companion_presence_bundle
-- Cross-links Command Center, Trust Acceleration Phase 288, Identity Relationship Phase 291, Attention Guardian Phase 37 (metadata only)

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
    'aipify_companion_presence_continuity_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables (tenant-scoped via customers.id)
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_presence_continuity_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  presence_state text not null default 'available' check (
    presence_state in ('offline', 'available', 'focused', 'active_companion')
  ),
  greeting_style text not null default 'warm' check (
    greeting_style in ('warm', 'professional', 'brief')
  ),
  briefing_frequency text not null default 'on_return' check (
    briefing_frequency in ('on_return', 'daily', 'weekly')
  ),
  presence_level text not null default 'standard' check (
    presence_level in ('minimal', 'standard', 'active')
  ),
  focus_mode_behavior text not null default 'reduce_interruptions' check (
    focus_mode_behavior in ('reduce_interruptions', 'high_priority_only', 'silent')
  ),
  notification_channels jsonb not null default '{
    "levels": ["informational", "recommended", "important", "immediate_attention"],
    "metadata_only": true
  }'::jsonb,
  since_last_session_detail text not null default 'standard' check (
    since_last_session_detail in ('brief', 'standard', 'executive')
  ),
  focus_protection jsonb not null default '{
    "enabled": true,
    "respect_quiet_hours": true,
    "batch_non_essential": true,
    "metadata_only": true
  }'::jsonb,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_presence_continuity_settings enable row level security;
revoke all on public.aipify_presence_continuity_settings from authenticated, anon;

create table if not exists public.aipify_presence_continuity_context (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  context_key text not null,
  context_type text not null check (
    context_type in (
      'conversation', 'approval', 'commitment', 'initiative', 'workflow', 'draft'
    )
  ),
  title text not null,
  status text not null default 'active' check (
    status in ('active', 'paused', 'completed')
  ),
  last_activity_at timestamptz not null default now(),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, context_key)
);
create index if not exists aipify_presence_continuity_context_tenant_idx
  on public.aipify_presence_continuity_context (tenant_id, context_type, status, last_activity_at desc);
alter table public.aipify_presence_continuity_context enable row level security;
revoke all on public.aipify_presence_continuity_context from authenticated, anon;

create table if not exists public.aipify_presence_since_last_session (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  session_key text not null,
  summary_items jsonb not null default '[]'::jsonb,
  display_mode text not null default 'standard' check (
    display_mode in ('brief', 'standard', 'executive')
  ),
  completed_actions int not null default 0,
  pending_approvals int not null default 0,
  emerging_risks int not null default 0,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, session_key)
);
create index if not exists aipify_presence_since_last_session_tenant_idx
  on public.aipify_presence_since_last_session (tenant_id, delivered_at desc nulls last);
alter table public.aipify_presence_since_last_session enable row level security;
revoke all on public.aipify_presence_since_last_session from authenticated, anon;

create table if not exists public.aipify_presence_continuity_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  insight_type text not null check (
    insight_type in ('pattern', 'observation', 'focus')
  ),
  status text not null default 'active' check (
    status in ('active', 'dismissed')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, insight_key)
);
create index if not exists aipify_presence_continuity_insights_tenant_idx
  on public.aipify_presence_continuity_insights (tenant_id, insight_type, status);
alter table public.aipify_presence_continuity_insights enable row level security;
revoke all on public.aipify_presence_continuity_insights from authenticated, anon;

create table if not exists public.aipify_presence_continuity_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'presence_state_changed', 'continuity_summary_delivered', 'notification_action',
      'focus_mode_activated', 'session_resumed'
    )
  ),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_presence_continuity_audit_logs_tenant_idx
  on public.aipify_presence_continuity_audit_logs (tenant_id, event_type, created_at desc);
alter table public.aipify_presence_continuity_audit_logs enable row level security;
revoke all on public.aipify_presence_continuity_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_companion_presence_continuity_engine', v.description
from (values
  (
    'presence_continuity.view',
    'View Companion Presence & Continuity',
    'View presence state, continuity context, since-last-session summaries, and presence insights'
  ),
  (
    'presence_continuity.manage',
    'Manage Companion Presence & Continuity',
    'Update presence settings, greeting style, briefing frequency, focus protection, and notification preferences'
  ),
  (
    'presence_continuity.record',
    'Record Companion Presence & Continuity',
    'Resume sessions, record presence events, and dismiss or acknowledge continuity insights'
  )
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'presence_continuity.view'),
  ('owner', 'presence_continuity.manage'),
  ('owner', 'presence_continuity.record'),
  ('administrator', 'presence_continuity.view'),
  ('administrator', 'presence_continuity.manage'),
  ('administrator', 'presence_continuity.record'),
  ('manager', 'presence_continuity.view'),
  ('manager', 'presence_continuity.manage'),
  ('manager', 'presence_continuity.record'),
  ('employee', 'presence_continuity.view'),
  ('employee', 'presence_continuity.record'),
  ('support_agent', 'presence_continuity.view'),
  ('moderator', 'presence_continuity.view'),
  ('viewer', 'presence_continuity.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_companion_presence_continuity_engine"]'::jsonb,
    updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_companion_presence_continuity_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint helpers — _cpcebp292_*
-- ---------------------------------------------------------------------------
create or replace function public._cpcebp292_distinction_note() returns text language sql immutable as $$
  select 'ABOS Phase 292 — Companion Presence & Continuity Engine at /app/companion/presence-continuity. Aipify feels consistently available — continuity across sessions and devices without starting over. Extends presence concepts without modifying Command Center or legacy presence bundle RPCs. Helpers _cpcebp292_*.';
$$;

create or replace function public._cpcebp292_core_principle() returns text language sql immutable as $$
  select 'Aipify should not feel like an application that users repeatedly reopen — Aipify should feel like a companion that is consistently available when needed';
$$;

create or replace function public._cpcebp292_presence_philosophy() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'traditional_software', 'You start over each time.',
    'aipify', 'We continue where we left off.',
    'principle', 'Presence is continuity — not intrusion. Aipify remembers context metadata, not private content.'
  );
$$;

create or replace function public._cpcebp292_presence_states() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'offline',
      'label', 'Offline',
      'description', 'Aipify is not actively presenting — user-initiated access only'
    ),
    jsonb_build_object(
      'key', 'available',
      'label', 'Available',
      'description', 'Default — ready to continue, calm presence without pressure'
    ),
    jsonb_build_object(
      'key', 'focused',
      'label', 'Focused',
      'description', 'User is in focus mode — interruptions reduced per focus_mode_behavior'
    ),
    jsonb_build_object(
      'key', 'active_companion',
      'label', 'Active Companion',
      'description', 'Engaged operational companion — proactive continuity within approval boundaries'
    )
  );
$$;

create or replace function public._cpcebp292_continuity_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Continuity preserves operational context across sessions — approvals, drafts, initiatives, and workflows resume where they paused.',
    'context_types', jsonb_build_array(
      jsonb_build_object('key', 'conversation', 'label', 'Recent conversation context'),
      jsonb_build_object('key', 'approval', 'label', 'Pending approvals'),
      jsonb_build_object('key', 'commitment', 'label', 'Open commitments'),
      jsonb_build_object('key', 'initiative', 'label', 'Active initiatives'),
      jsonb_build_object('key', 'workflow', 'label', 'In-progress workflows'),
      jsonb_build_object('key', 'draft', 'label', 'Unfinished drafts')
    ),
    'never', jsonb_build_array(
      'Store raw chat transcripts or email content in continuity tables',
      'Auto-execute actions on session resume',
      'Pressure users to return or create guilt for absence'
    )
  );
$$;

create or replace function public._cpcebp292_resume_experience() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Returning users see a calm resume experience — what changed, what needs attention, what can wait.',
    'components', jsonb_build_array(
      jsonb_build_object('key', 'greeting', 'label', 'Context-aware greeting — warm, professional, or brief'),
      jsonb_build_object('key', 'since_last_session', 'label', 'Since-last-session summary'),
      jsonb_build_object('key', 'pending_priorities', 'label', 'Items requiring attention now'),
      jsonb_build_object('key', 'active_initiatives', 'label', 'Initiatives in progress'),
      jsonb_build_object('key', 'executive_widgets', 'label', 'Executive dashboard continuity widgets')
    ),
    'detail_modes', jsonb_build_array('brief', 'standard', 'executive')
  );
$$;

create or replace function public._cpcebp292_since_last_session() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Since-last-session summaries use metadata counts and labels — never raw operational records.',
    'example_items', jsonb_build_array(
      '4 support cases resolved',
      '2 approvals require attention',
      'Executive briefing ready',
      'Report draft unfinished'
    ),
    'display_modes', jsonb_build_array(
      jsonb_build_object('key', 'brief', 'label', 'Brief', 'description', 'Essential counts only'),
      jsonb_build_object('key', 'standard', 'label', 'Standard', 'description', 'Balanced summary — default'),
      jsonb_build_object('key', 'executive', 'label', 'Executive', 'description', 'Structured executive continuity view')
    )
  );
$$;

create or replace function public._cpcebp292_multi_device() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'One Aipify — continuity follows the user across web, desktop Command Center, and future clients.',
    'rules', jsonb_build_array(
      'All clients consume the same Core continuity RPCs — no duplicated business logic',
      'Session resume is tenant-scoped and metadata-first',
      'Desktop Command Center cross-links at /app/command-center — does not replace this engine',
      'Presence state syncs through Core — clients are thin windows'
    ),
    'command_center_route', '/app/command-center'
  );
$$;

create or replace function public._cpcebp292_notification_intelligence() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Notifications respect presence state and focus protection — calm by default, urgent only when warranted.',
    'levels', jsonb_build_array(
      jsonb_build_object(
        'key', 'informational',
        'label', 'Informational',
        'description', 'Background awareness — no action required'
      ),
      jsonb_build_object(
        'key', 'recommended',
        'label', 'Recommended',
        'description', 'Suggested next step — user decides'
      ),
      jsonb_build_object(
        'key', 'important',
        'label', 'Important',
        'description', 'Requires attention soon — respects focus mode behavior'
      ),
      jsonb_build_object(
        'key', 'immediate_attention',
        'label', 'Immediate attention',
        'description', 'Critical operational signal — may bypass non-essential batching'
      )
    ),
    'focus_aware', true,
    'approvals_route', '/app/approvals'
  );
$$;

create or replace function public._cpcebp292_focus_protection() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Focus protection honors attention — Aipify reduces noise, never adds pressure.',
    'behaviors', jsonb_build_array(
      jsonb_build_object(
        'key', 'reduce_interruptions',
        'label', 'Reduce interruptions',
        'description', 'Batch non-essential notifications — default'
      ),
      jsonb_build_object(
        'key', 'high_priority_only',
        'label', 'High priority only',
        'description', 'Only important and immediate_attention levels surface'
      ),
      jsonb_build_object(
        'key', 'silent',
        'label', 'Silent',
        'description', 'No proactive notifications — user-initiated access only'
      )
    ),
    'attention_guardian_route', '/app/assistant/attention',
    'integrates_with', 'Time & Attention Guardian Phase 37 — metadata cross-link only'
  );
$$;

create or replace function public._cpcebp292_vision() returns text language sql immutable as $$
  select 'Aipify should never make users feel like they are starting over — Aipify should simply be ready to continue helping.';
$$;

create or replace function public._cpcebp292_privacy_note() returns text language sql immutable as $$
  select 'Companion Presence & Continuity stores presence preferences, continuity context metadata, summary counts, and insight patterns only — no raw chat, email content, or undeclared behavioral surveillance.';
$$;

create or replace function public._cpcebp292_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 292 — Companion Presence & Continuity Engine',
    'title', 'Companion Presence & Continuity Engine',
    'route', '/app/companion/presence-continuity',
    'distinction_note', public._cpcebp292_distinction_note(),
    'core_principle', public._cpcebp292_core_principle(),
    'presence_philosophy', public._cpcebp292_presence_philosophy(),
    'presence_states', public._cpcebp292_presence_states(),
    'continuity_engine', public._cpcebp292_continuity_engine(),
    'resume_experience', public._cpcebp292_resume_experience(),
    'since_last_session', public._cpcebp292_since_last_session(),
    'multi_device', public._cpcebp292_multi_device(),
    'notification_intelligence', public._cpcebp292_notification_intelligence(),
    'focus_protection', public._cpcebp292_focus_protection(),
    'vision', public._cpcebp292_vision(),
    'privacy_note', public._cpcebp292_privacy_note(),
    'cross_links', jsonb_build_array(
      jsonb_build_object('key', 'command_center', 'label', 'Command Center', 'route', '/app/command-center'),
      jsonb_build_object('key', 'trust_adoption_288', 'label', 'Trust Acceleration Phase 288', 'route', '/app/companion/trust-adoption'),
      jsonb_build_object('key', 'identity_relationship_291', 'label', 'Identity & Relationship Phase 291', 'route', '/app/companion/identity-relationship'),
      jsonb_build_object('key', 'attention_guardian_37', 'label', 'Attention Guardian Phase 37', 'route', '/app/assistant/attention')
    )
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine helpers — _cpce_*
-- ---------------------------------------------------------------------------
create or replace function public._cpce_tenant_for_auth() returns uuid
language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._cpce_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._cpce_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._cpce_log_event(
  p_tenant_id uuid,
  p_event_type text,
  p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_presence_continuity_audit_logs (
    tenant_id, event_type, summary, context
  ) values (
    p_tenant_id, p_event_type, left(p_summary, 500), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end; $$;

create or replace function public._cpce_ensure_settings(p_tenant_id uuid)
returns public.aipify_presence_continuity_settings
language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_presence_continuity_settings;
begin
  insert into public.aipify_presence_continuity_settings (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;

  select * into v_row
  from public.aipify_presence_continuity_settings
  where tenant_id = p_tenant_id;

  return v_row;
end; $$;

create or replace function public._cpce_settings_to_json(p_row public.aipify_presence_continuity_settings)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'presence_state', p_row.presence_state,
    'greeting_style', p_row.greeting_style,
    'briefing_frequency', p_row.briefing_frequency,
    'presence_level', p_row.presence_level,
    'focus_mode_behavior', p_row.focus_mode_behavior,
    'notification_channels', p_row.notification_channels,
    'since_last_session_detail', p_row.since_last_session_detail,
    'focus_protection', p_row.focus_protection,
    'metadata', p_row.metadata,
    'updated_at', p_row.updated_at
  );
$$;

create or replace function public._cpce_seed_continuity_data(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_context_seeded int := 0;
  v_session_seeded int := 0;
  v_insights_seeded int := 0;
begin
  if exists (
    select 1 from public.aipify_presence_continuity_context
    where tenant_id = p_tenant_id limit 1
  ) then
    return jsonb_build_object('seeded', false, 'reason', 'already_populated');
  end if;

  perform public._cpce_ensure_settings(p_tenant_id);

  insert into public.aipify_presence_continuity_context (
    tenant_id, context_key, context_type, title, status, last_activity_at, metadata
  ) values
    (
      p_tenant_id,
      'pending_approvals',
      'approval',
      'Pending approvals',
      'active',
      now() - interval '2 hours',
      '{"count":2,"metadata_only":true,"route":"/app/approvals"}'::jsonb
    ),
    (
      p_tenant_id,
      'unfinished_report_draft',
      'draft',
      'Report draft unfinished',
      'active',
      now() - interval '1 day',
      '{"draft_type":"executive_report","metadata_only":true}'::jsonb
    ),
    (
      p_tenant_id,
      'active_initiative_q2',
      'initiative',
      'Active initiative — Q2 operational focus',
      'active',
      now() - interval '3 hours',
      '{"initiative_key":"q2_operational_focus","metadata_only":true}'::jsonb
    ),
    (
      p_tenant_id,
      'recent_conversation',
      'conversation',
      'Recent conversation context',
      'active',
      now() - interval '30 minutes',
      '{"topic":"operational_priorities","metadata_only":true,"no_raw_content":true}'::jsonb
    );
  get diagnostics v_context_seeded = row_count;

  insert into public.aipify_presence_since_last_session (
    tenant_id,
    session_key,
    summary_items,
    display_mode,
    completed_actions,
    pending_approvals,
    emerging_risks,
    delivered_at
  ) values (
    p_tenant_id,
    'default_session',
    jsonb_build_array(
      jsonb_build_object('label', '4 support cases resolved', 'value', 4),
      jsonb_build_object('label', '2 approvals require attention', 'value', 2),
      jsonb_build_object('label', 'Executive briefing ready', 'value', 1),
      jsonb_build_object('label', 'Report draft unfinished', 'value', 1)
    ),
    'standard',
    4,
    2,
    0,
    now() - interval '1 hour'
  );
  get diagnostics v_session_seeded = row_count;

  insert into public.aipify_presence_continuity_insights (
    tenant_id, insight_key, message, insight_type, status
  ) values
    (
      p_tenant_id,
      'priority_tasks_complete',
      'Priority tasks are typically completed before midday — continuity preserved across sessions.',
      'pattern',
      'active'
    ),
    (
      p_tenant_id,
      'briefing_before_0900',
      'Executive briefings are often reviewed before 09:00 — Aipify can prepare continuity summaries accordingly.',
      'pattern',
      'active'
    ),
    (
      p_tenant_id,
      'focus_period_observation',
      'Focus periods reduce interruption sensitivity — presence respects your attention preferences.',
      'focus',
      'active'
    );
  get diagnostics v_insights_seeded = row_count;

  return jsonb_build_object(
    'seeded', true,
    'context_seeded', v_context_seeded,
    'session_seeded', v_session_seeded,
    'insights_seeded', v_insights_seeded
  );
end; $$;

create or replace function public._cpce_build_since_last_session(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_row public.aipify_presence_since_last_session;
  v_settings public.aipify_presence_continuity_settings;
  v_greeting text;
begin
  select * into v_row
  from public.aipify_presence_since_last_session
  where tenant_id = p_tenant_id
  order by delivered_at desc nulls last, updated_at desc
  limit 1;

  if not found then return null; end if;

  select * into v_settings
  from public.aipify_presence_continuity_settings
  where tenant_id = p_tenant_id;

  v_greeting := case coalesce(v_settings.greeting_style, 'warm')
    when 'professional' then 'Welcome back — here is your operational continuity summary.'
    when 'brief' then 'Continuity summary ready.'
    else 'Welcome back — Aipify is ready to continue where we left off.'
  end;

  return jsonb_build_object(
    'session_key', v_row.session_key,
    'display_mode', coalesce(v_settings.since_last_session_detail, v_row.display_mode),
    'summary_items', v_row.summary_items,
    'completed_actions', v_row.completed_actions,
    'pending_approvals', v_row.pending_approvals,
    'emerging_risks', v_row.emerging_risks,
    'delivered_at', v_row.delivered_at,
    'greeting', v_greeting,
    'metadata_only', true
  );
end; $$;

create or replace function public._cpce_build_resume_experience(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_since jsonb;
  v_settings public.aipify_presence_continuity_settings;
begin
  v_since := public._cpce_build_since_last_session(p_tenant_id);

  select * into v_settings
  from public.aipify_presence_continuity_settings
  where tenant_id = p_tenant_id;

  return jsonb_build_object(
    'session_key', coalesce(v_since->>'session_key', 'default_session'),
    'display_mode', coalesce(v_since->>'display_mode', coalesce(v_settings.since_last_session_detail, 'standard')),
    'summary_items', coalesce(v_since->'summary_items', '[]'::jsonb),
    'completed_actions', coalesce((v_since->>'completed_actions')::int, 0),
    'pending_approvals', coalesce((v_since->>'pending_approvals')::int, 0),
    'emerging_risks', coalesce((v_since->>'emerging_risks')::int, 0),
    'greeting', coalesce(v_since->>'greeting', 'Welcome back — Aipify is ready to continue.'),
    'presence_state', coalesce(v_settings.presence_state, 'available'),
    'briefing_frequency', coalesce(v_settings.briefing_frequency, 'on_return'),
    'metadata_only', true
  );
end; $$;

create or replace function public._cpce_build_continuity_context(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_agg(jsonb_build_object(
      'context_key', c.context_key,
      'context_type', c.context_type,
      'title', c.title,
      'status', c.status,
      'last_activity_at', c.last_activity_at,
      'metadata', c.metadata
    ) order by c.last_activity_at desc)
    from public.aipify_presence_continuity_context c
    where c.tenant_id = p_tenant_id and c.status in ('active', 'paused')
  ), '[]'::jsonb);
$$;

create or replace function public._cpce_build_pending_priorities(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_agg(jsonb_build_object(
      'key', c.context_key,
      'title', c.title,
      'urgency', case c.context_type
        when 'approval' then 'high'
        when 'commitment' then 'high'
        when 'draft' then 'standard'
        else 'standard'
      end,
      'context_type', c.context_type,
      'last_activity_at', c.last_activity_at
    ) order by
      case c.context_type when 'approval' then 1 when 'commitment' then 2 else 3 end,
      c.last_activity_at desc)
    from public.aipify_presence_continuity_context c
    where c.tenant_id = p_tenant_id
      and c.status = 'active'
      and c.context_type in ('approval', 'commitment', 'draft', 'workflow')
  ), '[]'::jsonb);
$$;

create or replace function public._cpce_build_active_initiatives(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_agg(jsonb_build_object(
      'context_key', c.context_key,
      'context_type', c.context_type,
      'title', c.title,
      'status', c.status,
      'last_activity_at', c.last_activity_at
    ) order by c.last_activity_at desc)
    from public.aipify_presence_continuity_context c
    where c.tenant_id = p_tenant_id
      and c.status = 'active'
      and c.context_type in ('initiative', 'workflow')
  ), '[]'::jsonb);
$$;

create or replace function public._cpce_build_presence_insights(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key,
      'message', i.message,
      'insight_type', i.insight_type,
      'status', i.status
    ) order by i.insight_type, i.insight_key)
    from public.aipify_presence_continuity_insights i
    where i.tenant_id = p_tenant_id and i.status = 'active'
  ), '[]'::jsonb);
$$;

create or replace function public._cpce_build_executive_widgets(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_session public.aipify_presence_since_last_session;
begin
  select * into v_session
  from public.aipify_presence_since_last_session
  where tenant_id = p_tenant_id
  order by delivered_at desc nulls last
  limit 1;

  return jsonb_build_object(
    'completed_actions', coalesce(v_session.completed_actions, 0),
    'pending_approvals', coalesce(v_session.pending_approvals, 0),
    'emerging_risks', coalesce(v_session.emerging_risks, 0),
    'executive_briefing_ready', exists (
      select 1 from public.aipify_presence_continuity_context c
      where c.tenant_id = p_tenant_id
        and c.context_key = 'recent_conversation'
        and c.status = 'active'
    ),
    'report_draft_open', exists (
      select 1 from public.aipify_presence_continuity_context c
      where c.tenant_id = p_tenant_id
        and c.context_type = 'draft'
        and c.status = 'active'
    ),
    'metadata_only', true
  );
end; $$;

create or replace function public._cpce_trust_adoption_metadata(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_build_object(
      'companion_reliability_score', s.companion_reliability_score,
      'adoption_state', s.adoption_state,
      'reliability_level', s.reliability_level,
      'trust_trend', s.trust_trend,
      'metadata_only', true
    )
    from public.aipify_trust_adoption_settings s
    where s.tenant_id = p_tenant_id
  ), jsonb_build_object(
    'note', 'Trust adoption settings not yet initialized — Phase 288 cross-link',
    'metadata_only', true
  ));
$$;

create or replace function public._cpce_identity_relationship_metadata(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_build_object(
      'relationship_mode', s.relationship_mode,
      'tone_preference', s.tone_preference,
      'notification_style', s.notification_style,
      'proactivity_level', s.proactivity_level,
      'metadata_only', true
    )
    from public.aipify_companion_identity_relationship_settings s
    where s.tenant_id = p_tenant_id
  ), jsonb_build_object(
    'note', 'Identity relationship settings not yet initialized — Phase 291 cross-link',
    'metadata_only', true
  ));
$$;

create or replace function public._cpce_attention_guardian_metadata(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_user_id uuid;
begin
  v_user_id := public._mta_app_user_id();

  return coalesce((
    select jsonb_build_object(
      'focus_protection_enabled', ts.focus_protection_enabled,
      'proactivity_level', ts.proactivity_level,
      'interruption_handling', ts.interruption_handling,
      'attention_tracking_enabled', ts.attention_tracking_enabled,
      'preferred_focus_period', ts.preferred_focus_period,
      'metadata_only', true
    )
    from public.tag_settings ts
    where ts.tenant_id = p_tenant_id and ts.user_id = v_user_id
  ), jsonb_build_object(
    'note', 'Attention Guardian settings not yet initialized — Phase 37 cross-link at /app/assistant/attention',
    'metadata_only', true
  ));
end; $$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_presence_continuity_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_presence_continuity_settings;
  v_seed jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._cpce_require_tenant());
  perform public._irp_require_permission('presence_continuity.view', v_tenant_id);

  v_settings := public._cpce_ensure_settings(v_tenant_id);

  if not exists (
    select 1 from public.aipify_presence_continuity_context
    where tenant_id = v_tenant_id limit 1
  ) then
    v_seed := public._cpce_seed_continuity_data(v_tenant_id);
  end if;

  select * into v_settings
  from public.aipify_presence_continuity_settings
  where tenant_id = v_tenant_id;

  return jsonb_build_object(
    'tenant_id', v_tenant_id,
    'route', '/app/companion/presence-continuity',
    'presence_status', v_settings.presence_state,
    'settings', public._cpce_settings_to_json(v_settings),
    'continuity_context', public._cpce_build_continuity_context(v_tenant_id),
    'resume_experience', public._cpce_build_resume_experience(v_tenant_id),
    'since_last_session', public._cpce_build_since_last_session(v_tenant_id),
    'pending_priorities', public._cpce_build_pending_priorities(v_tenant_id),
    'active_initiatives', public._cpce_build_active_initiatives(v_tenant_id),
    'presence_insights', public._cpce_build_presence_insights(v_tenant_id),
    'executive_widgets', public._cpce_build_executive_widgets(v_tenant_id),
    'blueprint', public._cpcebp292_blueprint_summary(),
    'links', jsonb_build_object(
      'presence_continuity', '/app/companion/presence-continuity',
      'command_center', '/app/command-center',
      'trust_adoption', '/app/companion/trust-adoption',
      'identity_relationship', '/app/companion/identity-relationship',
      'attention', '/app/assistant/attention',
      'approvals', '/app/approvals',
      'trust_adoption_metadata', public._cpce_trust_adoption_metadata(v_tenant_id),
      'identity_relationship_metadata', public._cpce_identity_relationship_metadata(v_tenant_id),
      'attention_guardian_metadata', public._cpce_attention_guardian_metadata(v_tenant_id),
      'command_center_note', 'Command Center consumes separate bundle RPC — cross-link metadata only'
    ),
    'seed', v_seed,
    'privacy_note', public._cpcebp292_privacy_note(),
    'can_manage', public._irp_has_permission('presence_continuity.manage', v_tenant_id),
    'can_record', public._irp_has_permission('presence_continuity.record', v_tenant_id)
  );
end; $$;

create or replace function public.update_presence_continuity_settings(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_presence_continuity_settings;
  v_prev_state text;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._cpce_require_tenant());
  perform public._irp_require_permission('presence_continuity.manage', v_tenant_id);

  v_settings := public._cpce_ensure_settings(v_tenant_id);
  v_prev_state := v_settings.presence_state;

  update public.aipify_presence_continuity_settings set
    presence_state = coalesce(
      nullif(p_payload->>'presence_state', ''), presence_state
    ),
    greeting_style = coalesce(
      nullif(p_payload->>'greeting_style', ''), greeting_style
    ),
    briefing_frequency = coalesce(
      nullif(p_payload->>'briefing_frequency', ''), briefing_frequency
    ),
    presence_level = coalesce(
      nullif(p_payload->>'presence_level', ''), presence_level
    ),
    focus_mode_behavior = coalesce(
      nullif(p_payload->>'focus_mode_behavior', ''), focus_mode_behavior
    ),
    since_last_session_detail = coalesce(
      nullif(p_payload->>'since_last_session_detail', ''), since_last_session_detail
    ),
    notification_channels = case
      when p_payload ? 'notification_channels'
        then notification_channels || coalesce(p_payload->'notification_channels', '{}'::jsonb)
      else notification_channels
    end,
    focus_protection = case
      when p_payload ? 'focus_protection'
        then focus_protection || coalesce(p_payload->'focus_protection', '{}'::jsonb)
      else focus_protection
    end,
    metadata = case
      when p_payload ? 'metadata'
        then metadata || coalesce(p_payload->'metadata', '{}'::jsonb)
      else metadata
    end,
    updated_at = now()
  where tenant_id = v_tenant_id
  returning * into v_settings;

  if v_prev_state is distinct from v_settings.presence_state then
    perform public._cpce_log_event(
      v_tenant_id,
      'presence_state_changed',
      format('Presence state changed from %s to %s', v_prev_state, v_settings.presence_state),
      jsonb_build_object(
        'previous_state', v_prev_state,
        'presence_state', v_settings.presence_state
      )
    );
  end if;

  if v_settings.presence_state = 'focused' then
    perform public._cpce_log_event(
      v_tenant_id,
      'focus_mode_activated',
      'Focus mode behavior updated via presence continuity settings',
      jsonb_build_object(
        'focus_mode_behavior', v_settings.focus_mode_behavior,
        'focus_protection', v_settings.focus_protection
      )
    );
  end if;

  return jsonb_build_object(
    'updated', true,
    'settings', public._cpce_settings_to_json(v_settings)
  );
end; $$;

create or replace function public.record_presence_continuity_event(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_action text;
  v_insight_key text;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._cpce_require_tenant());
  perform public._irp_require_permission('presence_continuity.record', v_tenant_id);
  perform public._cpce_ensure_settings(v_tenant_id);

  v_action := coalesce(p_payload->>'action', '');
  v_insight_key := nullif(p_payload->>'insight_key', '');

  if v_action = 'dismiss_insight' then
    if v_insight_key is null then raise exception 'insight_key required'; end if;

    update public.aipify_presence_continuity_insights set
      status = 'dismissed',
      updated_at = now()
    where tenant_id = v_tenant_id and insight_key = v_insight_key;

    if not found then raise exception 'Presence insight not found'; end if;

    perform public._cpce_log_event(
      v_tenant_id,
      'notification_action',
      format('Presence insight dismissed: %s', v_insight_key),
      jsonb_build_object('insight_key', v_insight_key, 'action', v_action)
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'presence_insights', public._cpce_build_presence_insights(v_tenant_id)
    );

  elsif v_action = 'update_context_status' then
    if nullif(p_payload->>'context_key', '') is null then
      raise exception 'context_key required';
    end if;

    update public.aipify_presence_continuity_context set
      status = coalesce(nullif(p_payload->>'status', ''), status),
      last_activity_at = now(),
      updated_at = now()
    where tenant_id = v_tenant_id
      and context_key = p_payload->>'context_key';

    if not found then raise exception 'Continuity context not found'; end if;

    perform public._cpce_log_event(
      v_tenant_id,
      'notification_action',
      format('Continuity context updated: %s', p_payload->>'context_key'),
      jsonb_build_object(
        'context_key', p_payload->>'context_key',
        'status', coalesce(p_payload->>'status', 'active')
      )
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'continuity_context', public._cpce_build_continuity_context(v_tenant_id)
    );

  elsif v_action = 'deliver_summary' then
    update public.aipify_presence_since_last_session set
      delivered_at = now(),
      updated_at = now()
    where tenant_id = v_tenant_id
      and session_key = coalesce(nullif(p_payload->>'session_key', ''), 'default_session');

    perform public._cpce_log_event(
      v_tenant_id,
      'continuity_summary_delivered',
      'Since-last-session continuity summary delivered',
      jsonb_build_object(
        'session_key', coalesce(p_payload->>'session_key', 'default_session'),
        'metadata_only', true
      )
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'since_last_session', public._cpce_build_since_last_session(v_tenant_id)
    );

  else
    raise exception 'Invalid action — use dismiss_insight, update_context_status, or deliver_summary';
  end if;
end; $$;

create or replace function public.resume_companion_session(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_presence_continuity_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._cpce_require_tenant());
  perform public._irp_require_permission('presence_continuity.record', v_tenant_id);

  v_settings := public._cpce_ensure_settings(v_tenant_id);

  if not exists (
    select 1 from public.aipify_presence_continuity_context
    where tenant_id = v_tenant_id limit 1
  ) then
    perform public._cpce_seed_continuity_data(v_tenant_id);
  end if;

  if v_settings.presence_state = 'offline' then
    update public.aipify_presence_continuity_settings set
      presence_state = 'available',
      updated_at = now()
    where tenant_id = v_tenant_id
    returning * into v_settings;
  end if;

  update public.aipify_presence_since_last_session set
    delivered_at = now(),
    updated_at = now()
  where tenant_id = v_tenant_id
    and session_key = 'default_session';

  perform public._cpce_log_event(
    v_tenant_id,
    'session_resumed',
    'Companion session resumed — continuity experience delivered',
    jsonb_build_object(
      'presence_state', v_settings.presence_state,
      'briefing_frequency', v_settings.briefing_frequency,
      'metadata_only', true
    )
  );

  perform public._cpce_log_event(
    v_tenant_id,
    'continuity_summary_delivered',
    'Since-last-session summary delivered on session resume',
    jsonb_build_object('session_key', 'default_session', 'metadata_only', true)
  );

  return jsonb_build_object(
    'resumed', true,
    'presence_status', v_settings.presence_state,
    'resume_experience', public._cpce_build_resume_experience(v_tenant_id),
    'since_last_session', public._cpce_build_since_last_session(v_tenant_id),
    'pending_priorities', public._cpce_build_pending_priorities(v_tenant_id),
    'active_initiatives', public._cpce_build_active_initiatives(v_tenant_id),
    'presence_insights', public._cpce_build_presence_insights(v_tenant_id)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Knowledge category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select
  'aipify-companion-presence-continuity-engine',
  'Companion Presence & Continuity Engine',
  'Presence state, session continuity, since-last-session summaries, and focus-aware notifications. Customer App at /app/companion/presence-continuity.',
  'authenticated',
  292
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'aipify-companion-presence-continuity-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 7. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_companion_presence_continuity_center(uuid) to authenticated;
grant execute on function public.update_presence_continuity_settings(jsonb) to authenticated;
grant execute on function public.record_presence_continuity_event(jsonb) to authenticated;
grant execute on function public.resume_companion_session(uuid) to authenticated;
