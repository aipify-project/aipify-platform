-- Phase 290 — Life Events & Proactive Care Engine
-- Feature owner: Customer App — /app/companion/life-events
-- Helpers: _lepc_* (engine), _lepcbp290_* (blueprint)
-- Cross-links Trust Acceleration Phase 288 and Marketplace flower_delivery Phase 289 (metadata only)

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
    'aipify_life_events_proactive_care_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables (tenant-scoped via customers.id)
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_life_events_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled_categories jsonb not null default '["personal_events","professional_events","health_wellbeing_events"]'::jsonb,
  proactivity_level text not null default 'moderate' check (
    proactivity_level in ('low', 'moderate', 'high')
  ),
  suggest_actions_allowed boolean not null default true,
  execute_actions_allowed boolean not null default false,
  reminder_timing_default text not null default '3_days_before',
  opt_out_all boolean not null default false,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_life_events_settings enable row level security;
revoke all on public.aipify_life_events_settings from authenticated, anon;

create table if not exists public.aipify_life_events_registry (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_key text not null,
  title text not null,
  category text not null check (
    category in ('personal_events', 'professional_events', 'health_wellbeing_events')
  ),
  event_date date not null,
  importance_level text not null default 'important' check (
    importance_level in ('optional', 'important', 'very_important', 'never_forget')
  ),
  reminder_preferences jsonb not null default '{"timing":"3_days_before"}'::jsonb,
  suggested_actions jsonb not null default '[]'::jsonb,
  approved_actions jsonb not null default '[]'::jsonb,
  status text not null default 'upcoming' check (
    status in ('upcoming', 'completed', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, event_key)
);
create index if not exists aipify_life_events_registry_tenant_idx
  on public.aipify_life_events_registry (tenant_id, status, event_date);
alter table public.aipify_life_events_registry enable row level security;
revoke all on public.aipify_life_events_registry from authenticated, anon;

create table if not exists public.aipify_life_events_reminders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_key text not null,
  reminder_key text not null,
  message text not null,
  timing_option text not null,
  scheduled_for timestamptz not null,
  status text not null default 'pending' check (
    status in ('pending', 'sent', 'dismissed', 'snoozed')
  ),
  care_tone text not null default 'supportive' check (
    care_tone in ('supportive', 'gentle', 'informational')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, event_key, reminder_key)
);
create index if not exists aipify_life_events_reminders_tenant_idx
  on public.aipify_life_events_reminders (tenant_id, status, scheduled_for);
alter table public.aipify_life_events_reminders enable row level security;
revoke all on public.aipify_life_events_reminders from authenticated, anon;

create table if not exists public.aipify_life_events_suggested_actions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_key text not null,
  action_key text not null,
  action_type text not null check (
    action_type in (
      'order_flowers', 'draft_emails', 'schedule_meetings', 'book_transportation',
      'create_reminders', 'coordinate_gifts', 'prepare_greeting_cards', 'print_event_agendas'
    )
  ),
  message text not null,
  status text not null default 'suggested' check (
    status in ('suggested', 'approved', 'completed', 'declined')
  ),
  requires_approval boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, event_key, action_key)
);
create index if not exists aipify_life_events_suggested_actions_tenant_idx
  on public.aipify_life_events_suggested_actions (tenant_id, status, event_key);
alter table public.aipify_life_events_suggested_actions enable row level security;
revoke all on public.aipify_life_events_suggested_actions from authenticated, anon;

create table if not exists public.aipify_life_events_care_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  insight_type text not null check (
    insight_type in ('relationship', 'pattern', 'preference')
  ),
  status text not null default 'active' check (
    status in ('active', 'dismissed')
  ),
  based_on_observed_value boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, insight_key)
);
create index if not exists aipify_life_events_care_insights_tenant_idx
  on public.aipify_life_events_care_insights (tenant_id, status, insight_type);
alter table public.aipify_life_events_care_insights enable row level security;
revoke all on public.aipify_life_events_care_insights from authenticated, anon;

create table if not exists public.aipify_life_events_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'action_suggested', 'action_approved', 'action_completed',
      'reminder_preference_changed', 'permissions_changed',
      'event_created', 'event_completed', 'center_viewed',
      'insight_dismissed', 'reminder_snoozed', 'preferences_updated'
    )
  ),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_life_events_audit_logs_tenant_idx
  on public.aipify_life_events_audit_logs (tenant_id, event_type, created_at desc);
alter table public.aipify_life_events_audit_logs enable row level security;
revoke all on public.aipify_life_events_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_life_events_proactive_care_engine', v.description
from (values
  ('life_events.view', 'View Life Events', 'View life events center, upcoming occasions, reminders, and care insights'),
  ('life_events.manage', 'Manage Life Events', 'Update preferences, dismiss insights, and configure proactive care settings'),
  ('life_events.record', 'Record Life Events', 'Create events, approve or complete suggested actions, and snooze reminders')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'life_events.view'), ('owner', 'life_events.manage'), ('owner', 'life_events.record'),
  ('administrator', 'life_events.view'), ('administrator', 'life_events.manage'), ('administrator', 'life_events.record'),
  ('manager', 'life_events.view'), ('manager', 'life_events.manage'), ('manager', 'life_events.record'),
  ('employee', 'life_events.view'), ('employee', 'life_events.record'),
  ('support_agent', 'life_events.view'),
  ('moderator', 'life_events.view'),
  ('viewer', 'life_events.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_life_events_proactive_care_engine"]'::jsonb,
    updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_life_events_proactive_care_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint helpers — _lepcbp290_*
-- ---------------------------------------------------------------------------
create or replace function public._lepcbp290_distinction_note() returns text language sql immutable as $$
  select 'ABOS Phase 290 — Life Events & Proactive Care Engine at /app/companion/life-events. Companion remembers what matters — supportive care, never intrusive pressure. Distinct from Gratitude Phase 53 human moments and PAME important people. Helpers _lepcbp290_*.';
$$;

create or replace function public._lepcbp290_core_principle() returns text language sql immutable as $$
  select 'Companion remembers what matters — proactive care that supports, never pressures';
$$;

create or replace function public._lepcbp290_user_control_principle() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Users control every category, reminder, and action — Aipify prepares, humans decide.',
    'controls', jsonb_build_array(
      jsonb_build_object('key', 'enabled_categories', 'label', 'Event categories', 'description', 'Enable or disable personal, professional, and health & wellbeing events independently'),
      jsonb_build_object('key', 'proactivity_level', 'label', 'Proactivity level', 'description', 'Low, moderate, or high — never exceeds user-selected boundary'),
      jsonb_build_object('key', 'suggest_actions_allowed', 'label', 'Action suggestions', 'description', 'Companion may suggest prepared actions — all require approval by default'),
      jsonb_build_object('key', 'execute_actions_allowed', 'label', 'Action execution', 'description', 'Disabled by default — explicit opt-in required for any automated execution'),
      jsonb_build_object('key', 'opt_out_all', 'label', 'Opt out entirely', 'description', 'Pause all proactive care — settings and history retained')
    ),
    'never', jsonb_build_array(
      'Guilt-based reminders or shame for missed occasions',
      'Hidden action execution without approval',
      'Surveillance of personal relationships beyond user-declared events'
    )
  );
$$;

create or replace function public._lepcbp290_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'personal_events', 'label', 'Personal Events', 'description', 'Birthdays, anniversaries, family milestones — consent-based, user-declared metadata only'),
    jsonb_build_object('key', 'professional_events', 'label', 'Professional Events', 'description', 'Contract renewals, client milestones, team celebrations — business context without raw CRM content'),
    jsonb_build_object('key', 'health_wellbeing_events', 'label', 'Health & Wellbeing Events', 'description', 'Checkups, wellness reminders — supportive tone, never medical advice or diagnosis')
  );
$$;

create or replace function public._lepcbp290_importance_levels() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'optional', 'label', 'Optional', 'description', 'Gentle awareness — informational reminders only'),
    jsonb_build_object('key', 'important', 'label', 'Important', 'description', 'Standard proactive care with prepared action suggestions'),
    jsonb_build_object('key', 'very_important', 'label', 'Very Important', 'description', 'Elevated preparation window — multiple supportive reminders'),
    jsonb_build_object('key', 'never_forget', 'label', 'Never Forget', 'description', 'Highest care priority — extended preparation timeline, never guilt-based')
  );
$$;

create or replace function public._lepcbp290_reminder_timing_options() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', '1_week_before', 'label', '1 week before', 'description', 'Early preparation window for complex occasions'),
    jsonb_build_object('key', '3_days_before', 'label', '3 days before', 'description', 'Default — balanced preparation time'),
    jsonb_build_object('key', '1_day_before', 'label', '1 day before', 'description', 'Final preparation reminder — supportive, not urgent'),
    jsonb_build_object('key', 'day_of', 'label', 'Day of event', 'description', 'Morning-of gentle reminder — never alarmist'),
    jsonb_build_object('key', 'custom', 'label', 'Custom', 'description', 'User-defined timing stored in reminder_preferences metadata')
  );
$$;

create or replace function public._lepcbp290_action_suggestions() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'order_flowers', 'label', 'Order Flowers', 'description', 'Prepare flower delivery order — Marketplace flower_delivery Phase 289 cross-link, human approves'),
    jsonb_build_object('key', 'draft_emails', 'label', 'Draft Emails', 'description', 'Prepare greeting or follow-up email drafts — human sends every message'),
    jsonb_build_object('key', 'schedule_meetings', 'label', 'Schedule Meetings', 'description', 'Propose calendar slots from Context Engine — human confirms'),
    jsonb_build_object('key', 'book_transportation', 'label', 'Book Transportation', 'description', 'Prepare transport booking request — approval before dispatch'),
    jsonb_build_object('key', 'create_reminders', 'label', 'Create Reminders', 'description', 'Suggest follow-up reminders — user confirms before creation'),
    jsonb_build_object('key', 'coordinate_gifts', 'label', 'Coordinate Gifts', 'description', 'Prepare gift recommendations — approval before purchase'),
    jsonb_build_object('key', 'prepare_greeting_cards', 'label', 'Prepare Greeting Cards', 'description', 'Draft card messages for human review — never auto-send'),
    jsonb_build_object('key', 'print_event_agendas', 'label', 'Print Event Agendas', 'description', 'Prepare agenda documents — Document Output Engine cross-link')
  );
$$;

create or replace function public._lepcbp290_care_recommendations() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Supportive care recommendations — never intrusive.',
    'tone_rules', jsonb_build_array(
      'Use warm, professional language — no fake urgency or guilt',
      'Frame suggestions as preparation, not obligation',
      'Acknowledge user preferences from observed patterns — based_on_observed_value default true',
      'Respect opt_out_all and category toggles immediately',
      'Health events use supportive language — never diagnose or prescribe'
    ),
    'examples', jsonb_build_array(
      'You usually celebrate this occasion with flowers — would you like me to prepare an order?',
      'Your customer contract renewal is approaching — I can draft a check-in email for your review.',
      'Annual checkup season — a gentle reminder to schedule when you are ready.'
    )
  );
$$;

create or replace function public._lepcbp290_safety_principles() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Proactive care operates within Trust & Action governance — humans approve every sensitive action.',
    'rules', jsonb_build_array(
      jsonb_build_object('key', 'approval_default', 'label', 'Approval default', 'description', 'requires_approval true for all suggested actions — execute_actions_allowed false by default'),
      jsonb_build_object('key', 'metadata_only', 'label', 'Metadata only', 'description', 'Event registry stores titles and dates — no raw contact content or medical records'),
      jsonb_build_object('key', 'audit_trail', 'label', 'Audit trail', 'description', 'Every preference change, action approval, and event creation logged immutably'),
      jsonb_build_object('key', 'trust_cross_link', 'label', 'Trust adoption', 'description', 'Trust Acceleration Phase 288 — care builds on earned reliability, not manipulation'),
      jsonb_build_object('key', 'marketplace_cross_link', 'label', 'Marketplace actions', 'description', 'flower_delivery and gift capabilities via Phase 289 — prepared orders require human approval')
    ),
    'approvals_route', '/app/approvals'
  );
$$;

create or replace function public._lepcbp290_vision_statement() returns text language sql immutable as $$
  select 'Aipify Companion remembers what matters in work and life — preparing thoughtful support so humans can show up for the people and commitments they care about.';
$$;

create or replace function public._lepcbp290_privacy_note() returns text language sql immutable as $$
  select 'Life Events stores event metadata, reminder preferences, and care insight summaries only — no raw email, chat, medical records, or undeclared relationship surveillance.';
$$;

create or replace function public._lepcbp290_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 290 — Life Events & Proactive Care Engine',
    'title', 'Life Events & Proactive Care Engine',
    'route', '/app/companion/life-events',
    'distinction_note', public._lepcbp290_distinction_note(),
    'core_principle', public._lepcbp290_core_principle(),
    'user_control_principle', public._lepcbp290_user_control_principle(),
    'categories', public._lepcbp290_categories(),
    'importance_levels', public._lepcbp290_importance_levels(),
    'reminder_timing_options', public._lepcbp290_reminder_timing_options(),
    'action_suggestions', public._lepcbp290_action_suggestions(),
    'care_recommendations', public._lepcbp290_care_recommendations(),
    'safety_principles', public._lepcbp290_safety_principles(),
    'vision_statement', public._lepcbp290_vision_statement(),
    'privacy_note', public._lepcbp290_privacy_note(),
    'cross_links', jsonb_build_array(
      jsonb_build_object('key', 'trust_adoption_288', 'label', 'Trust Acceleration Phase 288', 'route', '/app/companion/trust-adoption'),
      jsonb_build_object('key', 'marketplace_flower_delivery_289', 'label', 'Flower Delivery Phase 289', 'route', '/app/companion-marketplace', 'capability_key', 'flower_delivery'),
      jsonb_build_object('key', 'approvals_30', 'label', 'Trust & Action Phase 30', 'route', '/app/approvals')
    )
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine helpers — _lepc_*
-- ---------------------------------------------------------------------------
create or replace function public._lepc_tenant_for_auth() returns uuid
language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._lepc_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._lepc_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._lepc_log_event(
  p_tenant_id uuid,
  p_event_type text,
  p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_life_events_audit_logs (
    tenant_id, event_type, summary, context
  ) values (
    p_tenant_id, p_event_type, left(p_summary, 500), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end; $$;

create or replace function public._lepc_ensure_settings(p_tenant_id uuid)
returns public.aipify_life_events_settings
language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_life_events_settings;
begin
  insert into public.aipify_life_events_settings (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;

  select * into v_row
  from public.aipify_life_events_settings
  where tenant_id = p_tenant_id;

  return v_row;
end; $$;

create or replace function public._lepc_settings_to_json(p_row public.aipify_life_events_settings)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'enabled_categories', p_row.enabled_categories,
    'proactivity_level', p_row.proactivity_level,
    'suggest_actions_allowed', p_row.suggest_actions_allowed,
    'execute_actions_allowed', p_row.execute_actions_allowed,
    'reminder_timing_default', p_row.reminder_timing_default,
    'opt_out_all', p_row.opt_out_all,
    'metadata', p_row.metadata,
    'updated_at', p_row.updated_at
  );
$$;

create or replace function public._lepc_event_to_json(
  p_event public.aipify_life_events_registry,
  p_include_actions boolean default true
)
returns jsonb language plpgsql stable as $$
declare
  v_actions jsonb := '[]'::jsonb;
  v_reminders jsonb := '[]'::jsonb;
begin
  if p_include_actions then
    select coalesce(jsonb_agg(jsonb_build_object(
      'action_key', a.action_key,
      'action_type', a.action_type,
      'message', a.message,
      'status', a.status,
      'requires_approval', a.requires_approval
    ) order by a.action_key), '[]'::jsonb)
    into v_actions
    from public.aipify_life_events_suggested_actions a
    where a.tenant_id = p_event.tenant_id and a.event_key = p_event.event_key;

    select coalesce(jsonb_agg(jsonb_build_object(
      'reminder_key', r.reminder_key,
      'message', r.message,
      'timing_option', r.timing_option,
      'scheduled_for', r.scheduled_for,
      'status', r.status,
      'care_tone', r.care_tone
    ) order by r.scheduled_for), '[]'::jsonb)
    into v_reminders
    from public.aipify_life_events_reminders r
    where r.tenant_id = p_event.tenant_id and r.event_key = p_event.event_key;
  end if;

  return jsonb_build_object(
    'event_key', p_event.event_key,
    'title', p_event.title,
    'category', p_event.category,
    'event_date', p_event.event_date,
    'importance_level', p_event.importance_level,
    'reminder_preferences', p_event.reminder_preferences,
    'suggested_actions', p_event.suggested_actions,
    'approved_actions', p_event.approved_actions,
    'status', p_event.status,
    'metadata', p_event.metadata,
    'days_until', (p_event.event_date - current_date),
    'actions', v_actions,
    'reminders', v_reminders,
    'updated_at', p_event.updated_at
  );
end; $$;

create or replace function public._lepc_seed_demo_events(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_birthday_date date;
  v_contract_date date;
  v_checkup_date date;
  v_events_seeded int := 0;
  v_reminders_seeded int := 0;
  v_actions_seeded int := 0;
  v_insights_seeded int := 0;
begin
  if exists (
    select 1 from public.aipify_life_events_registry where tenant_id = p_tenant_id limit 1
  ) then
    return jsonb_build_object('seeded', false, 'reason', 'already_populated');
  end if;

  perform public._lepc_ensure_settings(p_tenant_id);

  v_birthday_date := current_date + interval '18 days';
  v_contract_date := current_date + interval '28 days';
  v_checkup_date := current_date + interval '42 days';

  insert into public.aipify_life_events_registry (
    tenant_id, event_key, title, category, event_date, importance_level,
    reminder_preferences, status, metadata
  ) values
    (
      p_tenant_id,
      'wifes_birthday',
      'Wife''s Birthday',
      'personal_events',
      v_birthday_date,
      'very_important',
      '{"timing":"3_days_before","care_tone":"supportive"}'::jsonb,
      'upcoming',
      '{"demo":true,"relationship":"partner"}'::jsonb
    ),
    (
      p_tenant_id,
      'customer_contract_renewal',
      'Customer Contract Renewal',
      'professional_events',
      v_contract_date,
      'important',
      '{"timing":"1_week_before","care_tone":"supportive"}'::jsonb,
      'upcoming',
      '{"demo":true,"account_type":"key_customer"}'::jsonb
    ),
    (
      p_tenant_id,
      'annual_checkup',
      'Annual Checkup',
      'health_wellbeing_events',
      v_checkup_date,
      'optional',
      '{"timing":"1_week_before","care_tone":"gentle"}'::jsonb,
      'upcoming',
      '{"demo":true,"wellness_type":"preventive"}'::jsonb
    );
  get diagnostics v_events_seeded = row_count;

  insert into public.aipify_life_events_reminders (
    tenant_id, event_key, reminder_key, message, timing_option, scheduled_for, status, care_tone
  ) values
    (
      p_tenant_id,
      'wifes_birthday',
      'birthday_3_days',
      'Your wife''s birthday is in three days — would you like help preparing something special?',
      '3_days_before',
      (v_birthday_date - interval '3 days')::timestamptz + time '09:00',
      'pending',
      'supportive'
    ),
    (
      p_tenant_id,
      'wifes_birthday',
      'birthday_day_of',
      'Today is your wife''s birthday — I can help prepare flowers or a greeting if you would like.',
      'day_of',
      v_birthday_date::timestamptz + time '08:00',
      'pending',
      'supportive'
    ),
    (
      p_tenant_id,
      'customer_contract_renewal',
      'contract_1_week',
      'Your customer contract renewal is one week away — I can draft a check-in email for your review.',
      '1_week_before',
      (v_contract_date - interval '7 days')::timestamptz + time '09:00',
      'pending',
      'supportive'
    ),
    (
      p_tenant_id,
      'annual_checkup',
      'checkup_gentle',
      'Annual checkup season — a gentle reminder to schedule when you are ready. No pressure.',
      '1_week_before',
      (v_checkup_date - interval '7 days')::timestamptz + time '10:00',
      'pending',
      'gentle'
    );
  get diagnostics v_reminders_seeded = row_count;

  insert into public.aipify_life_events_suggested_actions (
    tenant_id, event_key, action_key, action_type, message, status, requires_approval
  ) values
    (
      p_tenant_id,
      'wifes_birthday',
      'order_flowers_birthday',
      'order_flowers',
      'Prepare a flower delivery order — Marketplace flower_delivery capability, human approves before dispatch.',
      'suggested',
      true
    ),
    (
      p_tenant_id,
      'wifes_birthday',
      'prepare_greeting_card',
      'prepare_greeting_cards',
      'Draft a birthday greeting card message for your review — never auto-send.',
      'suggested',
      true
    ),
    (
      p_tenant_id,
      'customer_contract_renewal',
      'draft_renewal_email',
      'draft_emails',
      'Draft a contract renewal check-in email — you review and send every message.',
      'suggested',
      true
    ),
    (
      p_tenant_id,
      'customer_contract_renewal',
      'schedule_renewal_meeting',
      'schedule_meetings',
      'Propose calendar slots for a renewal discussion — human confirms before booking.',
      'suggested',
      true
    ),
    (
      p_tenant_id,
      'annual_checkup',
      'create_checkup_reminder',
      'create_reminders',
      'Suggest a wellness reminder for when you are ready to schedule — user confirms first.',
      'suggested',
      true
    );
  get diagnostics v_actions_seeded = row_count;

  insert into public.aipify_life_events_care_insights (
    tenant_id, insight_key, message, insight_type, status, based_on_observed_value
  ) values
    (
      p_tenant_id,
      'flowers_celebration_pattern',
      'You usually celebrate this occasion with flowers — would you like me to prepare an order?',
      'pattern',
      'active',
      true
    ),
    (
      p_tenant_id,
      'customer_contact_gap',
      'You haven''t contacted this important customer recently — a gentle check-in may strengthen the relationship.',
      'relationship',
      'active',
      true
    ),
    (
      p_tenant_id,
      'wellness_scheduling_preference',
      'You tend to schedule wellness appointments in the morning — I can suggest slots when you are ready.',
      'preference',
      'active',
      true
    );
  get diagnostics v_insights_seeded = row_count;

  perform public._lepc_log_event(
    p_tenant_id,
    'event_created',
    'Demo life events seeded for proactive care center',
    jsonb_build_object(
      'events_seeded', v_events_seeded,
      'reminders_seeded', v_reminders_seeded,
      'actions_seeded', v_actions_seeded,
      'insights_seeded', v_insights_seeded
    )
  );

  return jsonb_build_object(
    'seeded', true,
    'events_seeded', v_events_seeded,
    'reminders_seeded', v_reminders_seeded,
    'actions_seeded', v_actions_seeded,
    'insights_seeded', v_insights_seeded
  );
end; $$;

create or replace function public._lepc_build_upcoming_events(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_life_events_settings;
begin
  select * into v_settings from public.aipify_life_events_settings where tenant_id = p_tenant_id;

  return coalesce((
    select jsonb_agg(public._lepc_event_to_json(e, true) order by e.event_date, e.title)
    from public.aipify_life_events_registry e
    where e.tenant_id = p_tenant_id
      and e.status = 'upcoming'
      and e.event_date >= current_date
      and coalesce(v_settings.opt_out_all, false) = false
      and (
        v_settings.enabled_categories is null
        or v_settings.enabled_categories @> to_jsonb(e.category)
      )
  ), '[]'::jsonb);
end; $$;

create or replace function public._lepc_build_care_insights(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_life_events_settings;
begin
  select * into v_settings from public.aipify_life_events_settings where tenant_id = p_tenant_id;

  if coalesce(v_settings.opt_out_all, false) then
    return '[]'::jsonb;
  end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key,
      'message', i.message,
      'insight_type', i.insight_type,
      'status', i.status,
      'based_on_observed_value', i.based_on_observed_value,
      'created_at', i.created_at
    ) order by i.created_at)
    from public.aipify_life_events_care_insights i
    where i.tenant_id = p_tenant_id and i.status = 'active'
  ), '[]'::jsonb);
end; $$;

create or replace function public._lepc_build_preparation_needed(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_life_events_settings;
begin
  select * into v_settings from public.aipify_life_events_settings where tenant_id = p_tenant_id;

  return coalesce((
    select jsonb_agg(public._lepc_event_to_json(e, true) order by e.event_date)
    from public.aipify_life_events_registry e
    where e.tenant_id = p_tenant_id
      and e.status = 'upcoming'
      and e.event_date >= current_date
      and e.event_date <= current_date + interval '14 days'
      and coalesce(v_settings.opt_out_all, false) = false
      and (
        v_settings.enabled_categories is null
        or v_settings.enabled_categories @> to_jsonb(e.category)
      )
      and exists (
        select 1 from public.aipify_life_events_reminders r
        where r.tenant_id = e.tenant_id
          and r.event_key = e.event_key
          and r.status in ('pending', 'sent')
          and r.scheduled_for <= now() + interval '7 days'
      )
  ), '[]'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_life_events_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_life_events_settings;
  v_seed jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._lepc_require_tenant());
  perform public._irp_require_permission('life_events.view', v_tenant_id);

  v_settings := public._lepc_ensure_settings(v_tenant_id);

  if not exists (
    select 1 from public.aipify_life_events_registry where tenant_id = v_tenant_id limit 1
  ) then
    v_seed := public._lepc_seed_demo_events(v_tenant_id);
  end if;

  select * into v_settings from public.aipify_life_events_settings where tenant_id = v_tenant_id;

  perform public._lepc_log_event(
    v_tenant_id,
    'center_viewed',
    'Life Events & Proactive Care center accessed',
    jsonb_build_object('seed', v_seed, 'opt_out_all', v_settings.opt_out_all)
  );

  return jsonb_build_object(
    'tenant_id', v_tenant_id,
    'route', '/app/companion/life-events',
    'settings', public._lepc_settings_to_json(v_settings),
    'upcoming', public._lepc_build_upcoming_events(v_tenant_id),
    'suggested_actions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'event_key', a.event_key,
        'action_key', a.action_key,
        'action_type', a.action_type,
        'message', a.message,
        'status', a.status,
        'requires_approval', a.requires_approval,
        'event_title', e.title,
        'event_date', e.event_date
      ) order by e.event_date, a.action_key)
      from public.aipify_life_events_suggested_actions a
      join public.aipify_life_events_registry e
        on e.tenant_id = a.tenant_id and e.event_key = a.event_key
      where a.tenant_id = v_tenant_id
        and a.status in ('suggested', 'approved')
        and e.status = 'upcoming'
        and coalesce(v_settings.opt_out_all, false) = false
    ), '[]'::jsonb),
    'preparation_needed', public._lepc_build_preparation_needed(v_tenant_id),
    'recently_completed', coalesce((
      select jsonb_agg(public._lepc_event_to_json(e, false) order by e.updated_at desc)
      from public.aipify_life_events_registry e
      where e.tenant_id = v_tenant_id and e.status = 'completed'
      limit 10
    ), '[]'::jsonb),
    'care_insights', public._lepc_build_care_insights(v_tenant_id),
    'reminders', coalesce((
      select jsonb_agg(jsonb_build_object(
        'event_key', r.event_key,
        'reminder_key', r.reminder_key,
        'message', r.message,
        'timing_option', r.timing_option,
        'scheduled_for', r.scheduled_for,
        'status', r.status,
        'care_tone', r.care_tone,
        'event_title', e.title,
        'event_date', e.event_date
      ) order by r.scheduled_for)
      from public.aipify_life_events_reminders r
      join public.aipify_life_events_registry e
        on e.tenant_id = r.tenant_id and e.event_key = r.event_key
      where r.tenant_id = v_tenant_id
        and r.status in ('pending', 'sent', 'snoozed')
        and e.status = 'upcoming'
        and coalesce(v_settings.opt_out_all, false) = false
    ), '[]'::jsonb),
    'blueprint', public._lepcbp290_blueprint_summary(),
    'links', jsonb_build_object(
      'life_events', '/app/companion/life-events',
      'trust_adoption', '/app/companion/trust-adoption',
      'approvals', '/app/approvals',
      'companion_marketplace', '/app/companion-marketplace',
      'marketplace_flower_delivery', jsonb_build_object(
        'route', '/app/companion-marketplace',
        'capability_key', 'flower_delivery',
        'phase', 289,
        'note', 'Order flowers action cross-link — human approval required'
      ),
      'trust_adoption_metadata', coalesce((
        select jsonb_build_object(
          'companion_reliability_score', s.companion_reliability_score,
          'adoption_state', s.adoption_state,
          'reliability_level', s.reliability_level
        )
        from public.aipify_trust_adoption_settings s
        where s.tenant_id = v_tenant_id
      ), jsonb_build_object('note', 'Trust adoption settings not yet initialized — Phase 288 cross-link'))
    ),
    'privacy_note', public._lepcbp290_privacy_note(),
    'can_manage', public._irp_has_permission('life_events.manage', v_tenant_id),
    'can_record', public._irp_has_permission('life_events.record', v_tenant_id)
  );
end; $$;

create or replace function public.update_life_events_preferences(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_life_events_settings;
  v_changes jsonb := '{}'::jsonb;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._lepc_require_tenant());
  perform public._irp_require_permission('life_events.manage', v_tenant_id);

  v_settings := public._lepc_ensure_settings(v_tenant_id);

  update public.aipify_life_events_settings set
    enabled_categories = case
      when p_payload ? 'enabled_categories' then p_payload->'enabled_categories'
      else enabled_categories
    end,
    proactivity_level = coalesce(nullif(p_payload->>'proactivity_level', ''), proactivity_level),
    suggest_actions_allowed = case
      when p_payload ? 'suggest_actions_allowed' then (p_payload->>'suggest_actions_allowed')::boolean
      else suggest_actions_allowed
    end,
    execute_actions_allowed = case
      when p_payload ? 'execute_actions_allowed' then (p_payload->>'execute_actions_allowed')::boolean
      else execute_actions_allowed
    end,
    reminder_timing_default = coalesce(nullif(p_payload->>'reminder_timing_default', ''), reminder_timing_default),
    opt_out_all = case
      when p_payload ? 'opt_out_all' then (p_payload->>'opt_out_all')::boolean
      else opt_out_all
    end,
    metadata = case
      when p_payload ? 'metadata' then metadata || coalesce(p_payload->'metadata', '{}'::jsonb)
      else metadata
    end,
    updated_at = now()
  where tenant_id = v_tenant_id
  returning * into v_settings;

  if p_payload ? 'enabled_categories' then
    v_changes := v_changes || jsonb_build_object('enabled_categories', v_settings.enabled_categories);
  end if;
  if p_payload ? 'proactivity_level' then
    v_changes := v_changes || jsonb_build_object('proactivity_level', v_settings.proactivity_level);
  end if;
  if p_payload ? 'suggest_actions_allowed' then
    v_changes := v_changes || jsonb_build_object('suggest_actions_allowed', v_settings.suggest_actions_allowed);
  end if;
  if p_payload ? 'execute_actions_allowed' then
    v_changes := v_changes || jsonb_build_object('execute_actions_allowed', v_settings.execute_actions_allowed);
  end if;
  if p_payload ? 'opt_out_all' then
    v_changes := v_changes || jsonb_build_object('opt_out_all', v_settings.opt_out_all);
  end if;

  perform public._lepc_log_event(
    v_tenant_id,
    case when p_payload ? 'execute_actions_allowed' or p_payload ? 'suggest_actions_allowed'
      then 'permissions_changed' else 'reminder_preference_changed' end,
    'Life events preferences updated',
    v_changes
  );

  return jsonb_build_object(
    'updated', true,
    'settings', public._lepc_settings_to_json(v_settings)
  );
end; $$;

create or replace function public.record_life_event_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_action text;
  v_event_key text;
  v_action_key text;
  v_insight_key text;
  v_reminder_key text;
  v_row public.aipify_life_events_suggested_actions;
  v_audit_type text;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._lepc_require_tenant());
  perform public._irp_require_permission('life_events.record', v_tenant_id);
  perform public._lepc_ensure_settings(v_tenant_id);

  v_action := coalesce(p_payload->>'action', '');
  v_event_key := nullif(p_payload->>'event_key', '');
  v_action_key := nullif(p_payload->>'action_key', '');
  v_insight_key := nullif(p_payload->>'insight_key', '');
  v_reminder_key := nullif(p_payload->>'reminder_key', '');

  if v_action in ('approve_action', 'decline_action', 'complete_action') then
    if v_event_key is null or v_action_key is null then
      raise exception 'event_key and action_key required for action operations';
    end if;

    update public.aipify_life_events_suggested_actions set
      status = case v_action
        when 'approve_action' then 'approved'
        when 'decline_action' then 'declined'
        when 'complete_action' then 'completed'
      end,
      updated_at = now()
    where tenant_id = v_tenant_id and event_key = v_event_key and action_key = v_action_key
    returning * into v_row;

    if not found then raise exception 'Suggested action not found'; end if;

    v_audit_type := case v_action
      when 'approve_action' then 'action_approved'
      when 'complete_action' then 'action_completed'
      else 'action_suggested'
    end;

    perform public._lepc_log_event(
      v_tenant_id,
      v_audit_type,
      format('Life event action %s: %s / %s', v_row.status, v_event_key, v_action_key),
      jsonb_build_object(
        'event_key', v_event_key,
        'action_key', v_action_key,
        'action_type', v_row.action_type,
        'status', v_row.status
      )
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'event_key', v_event_key,
      'action_key', v_action_key,
      'status', v_row.status,
      'requires_approval', v_row.requires_approval
    );

  elsif v_action = 'dismiss_insight' then
    if v_insight_key is null then raise exception 'insight_key required'; end if;

    update public.aipify_life_events_care_insights set
      status = 'dismissed',
      updated_at = now()
    where tenant_id = v_tenant_id and insight_key = v_insight_key;

    if not found then raise exception 'Care insight not found'; end if;

    perform public._lepc_log_event(
      v_tenant_id,
      'insight_dismissed',
      format('Care insight dismissed: %s', v_insight_key),
      jsonb_build_object('insight_key', v_insight_key)
    );

    return jsonb_build_object('recorded', true, 'action', v_action, 'insight_key', v_insight_key);

  elsif v_action = 'snooze_reminder' then
    if v_event_key is null or v_reminder_key is null then
      raise exception 'event_key and reminder_key required for snooze';
    end if;

    update public.aipify_life_events_reminders set
      status = 'snoozed',
      scheduled_for = coalesce(
        nullif(p_payload->>'snooze_until', '')::timestamptz,
        now() + interval '1 day'
      ),
      updated_at = now()
    where tenant_id = v_tenant_id and event_key = v_event_key and reminder_key = v_reminder_key;

    if not found then raise exception 'Reminder not found'; end if;

    perform public._lepc_log_event(
      v_tenant_id,
      'reminder_snoozed',
      format('Reminder snoozed: %s / %s', v_event_key, v_reminder_key),
      jsonb_build_object(
        'event_key', v_event_key,
        'reminder_key', v_reminder_key,
        'snooze_until', coalesce(p_payload->>'snooze_until', (now() + interval '1 day')::text)
      )
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'event_key', v_event_key,
      'reminder_key', v_reminder_key
    );

  else
    raise exception 'Invalid action — use approve_action, decline_action, complete_action, dismiss_insight, or snooze_reminder';
  end if;
end; $$;

create or replace function public.create_life_event(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_event_key text;
  v_row public.aipify_life_events_registry;
  v_settings public.aipify_life_events_settings;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._lepc_require_tenant());
  perform public._irp_require_permission('life_events.record', v_tenant_id);

  v_settings := public._lepc_ensure_settings(v_tenant_id);
  if coalesce(v_settings.opt_out_all, false) then
    raise exception 'Proactive care is opted out — re-enable in preferences first';
  end if;

  v_event_key := coalesce(nullif(p_payload->>'event_key', ''), 'event_' || left(gen_random_uuid()::text, 8));

  if coalesce(p_payload->>'title', '') = '' then
    raise exception 'title required';
  end if;
  if nullif(p_payload->>'event_date', '') is null then
    raise exception 'event_date required';
  end if;

  insert into public.aipify_life_events_registry (
    tenant_id, event_key, title, category, event_date, importance_level,
    reminder_preferences, suggested_actions, approved_actions, status, metadata
  ) values (
    v_tenant_id,
    v_event_key,
    p_payload->>'title',
    coalesce(nullif(p_payload->>'category', ''), 'personal_events'),
    (p_payload->>'event_date')::date,
    coalesce(nullif(p_payload->>'importance_level', ''), 'important'),
    coalesce(
      p_payload->'reminder_preferences',
      jsonb_build_object('timing', coalesce(v_settings.reminder_timing_default, '3_days_before'))
    ),
    coalesce(p_payload->'suggested_actions', '[]'::jsonb),
    coalesce(p_payload->'approved_actions', '[]'::jsonb),
    coalesce(nullif(p_payload->>'status', ''), 'upcoming'),
    coalesce(p_payload->'metadata', '{}'::jsonb)
  )
  on conflict (tenant_id, event_key) do update set
    title = excluded.title,
    category = excluded.category,
    event_date = excluded.event_date,
    importance_level = excluded.importance_level,
    reminder_preferences = excluded.reminder_preferences,
    metadata = excluded.metadata,
    updated_at = now()
  returning * into v_row;

  perform public._lepc_log_event(
    v_tenant_id,
    'event_created',
    format('Life event created: %s', v_row.title),
    jsonb_build_object(
      'event_key', v_row.event_key,
      'category', v_row.category,
      'event_date', v_row.event_date,
      'importance_level', v_row.importance_level
    )
  );

  return jsonb_build_object(
    'created', true,
    'event', public._lepc_event_to_json(v_row, true)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Knowledge category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select
  'aipify-life-events-proactive-care-engine',
  'Life Events & Proactive Care Engine',
  'Companion remembers what matters — proactive care for personal, professional, and wellbeing events. Customer App at /app/companion/life-events.',
  'authenticated',
  290
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'aipify-life-events-proactive-care-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 7. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_life_events_center(uuid) to authenticated;
grant execute on function public.update_life_events_preferences(jsonb) to authenticated;
grant execute on function public.record_life_event_action(jsonb) to authenticated;
grant execute on function public.create_life_event(jsonb) to authenticated;
