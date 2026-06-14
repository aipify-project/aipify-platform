-- Phase 284 — Enterprise Packaging, Upgrade & Instant Access Engine
-- Feature owner: Customer App — Settings → Billing → Packages (/app/settings/billing/packages)
-- Helpers: _apuiae_* (engine), _apuiaebp284_* (blueprint)
-- Extends Commercial Packages Phase 42 — does NOT modify get_customer_billing_center

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
    'aipify_enterprise_packaging_upgrade_instant_access_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_package_features (
  id uuid primary key default gen_random_uuid(),
  feature_key text not null unique,
  feature_label text not null,
  required_package text not null check (
    required_package in ('starter', 'professional', 'business', 'enterprise')
  ),
  permission_key text,
  usage_limit_monthly int,
  upgrade_message_en text not null default '',
  upgrade_message_no text not null default '',
  is_gold_nugget boolean not null default false,
  action_capability boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_package_features enable row level security;
revoke all on public.aipify_package_features from authenticated, anon;

create table if not exists public.aipify_package_usage_limits (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  feature_key text not null references public.aipify_package_features (feature_key) on delete cascade,
  period_month date not null,
  usage_count int not null default 0,
  limit_value int not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, feature_key, period_month)
);
create index if not exists aipify_package_usage_limits_tenant_idx
  on public.aipify_package_usage_limits (tenant_id, period_month desc);
alter table public.aipify_package_usage_limits enable row level security;
revoke all on public.aipify_package_usage_limits from authenticated, anon;

create table if not exists public.aipify_upgrade_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  from_package text not null check (
    from_package in ('starter', 'professional', 'business', 'enterprise')
  ),
  to_package text not null check (
    to_package in ('starter', 'professional', 'business', 'enterprise')
  ),
  status text not null default 'started' check (
    status in ('started', 'payment_pending', 'completed', 'failed', 'cancelled')
  ),
  payment_reference text,
  instant_activation boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists aipify_upgrade_events_tenant_idx
  on public.aipify_upgrade_events (tenant_id, created_at desc);
alter table public.aipify_upgrade_events enable row level security;
revoke all on public.aipify_upgrade_events from authenticated, anon;

create table if not exists public.aipify_billing_access_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  event_type text not null check (
    event_type in (
      'package_selected', 'upgrade_started', 'payment_completed', 'access_activated',
      'downgrade_requested', 'permission_changed', 'feature_unlocked', 'feature_denied'
    )
  ),
  feature_key text,
  package_key text,
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_billing_access_events_tenant_idx
  on public.aipify_billing_access_events (tenant_id, created_at desc);
alter table public.aipify_billing_access_events enable row level security;
revoke all on public.aipify_billing_access_events from authenticated, anon;

create table if not exists public.aipify_organization_subscription_access (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  current_package text not null default 'starter' check (
    current_package in ('starter', 'professional', 'business', 'enterprise')
  ),
  subscription_status text not null default 'active' check (
    subscription_status in ('active', 'trial', 'past_due', 'paused', 'cancelled')
  ),
  trial_ends_at timestamptz,
  renewal_at timestamptz,
  seat_count int not null default 1,
  instant_access_enabled boolean not null default true,
  last_upgrade_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_organization_subscription_access enable row level security;
revoke all on public.aipify_organization_subscription_access from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Seed package features
-- ---------------------------------------------------------------------------
insert into public.aipify_package_features (
  feature_key, feature_label, required_package, permission_key, usage_limit_monthly,
  upgrade_message_en, upgrade_message_no, is_gold_nugget, action_capability, metadata
)
values
  ('basic_companion', 'Basic Companion', 'starter', null, null,
    'Included in Starter — your Companion is ready to assist.', 'Inkludert i Starter — Companionen din er klar til å hjelpe.', false, false, '{}'::jsonb),
  ('notes', 'Notes', 'starter', null, null,
    'Included in Starter — capture notes and reminders.', 'Inkludert i Starter — ta notater og påminnelser.', false, false, '{}'::jsonb),
  ('tasks', 'Tasks', 'starter', null, null,
    'Included in Starter — manage tasks and follow-ups.', 'Inkludert i Starter — administrer oppgaver og oppfølging.', false, false, '{}'::jsonb),
  ('calendar_support', 'Calendar Support', 'starter', null, null,
    'Included in Starter — calendar awareness and scheduling support.', 'Inkludert i Starter — kalenderstøtte og planlegging.', false, false, '{}'::jsonb),
  ('email_drafts', 'Email Drafts', 'starter', null, 50,
    'Included in Starter — draft emails with Companion assistance.', 'Inkludert i Starter — utkast til e-post med Companion-hjelp.', false, false, '{}'::jsonb),
  ('printer_support', 'Printer Support', 'starter', null, null,
    'Included in Starter — print documents through approved devices.', 'Inkludert i Starter — skriv ut dokumenter via godkjente enheter.', false, false, '{}'::jsonb),
  ('basic_summaries', 'Basic Summaries', 'starter', null, 100,
    'Included in Starter — concise summaries for daily work.', 'Inkludert i Starter — korte sammendrag for daglig arbeid.', false, false, '{}'::jsonb),
  ('team_collaboration', 'Team Collaboration', 'professional', null, null,
    'Upgrade to Professional to unlock team collaboration.', 'Oppgrader til Professional for team-samarbeid.', false, false, '{}'::jsonb),
  ('support_ai', 'Support AI', 'professional', null, null,
    'Upgrade to Professional for Support AI and autonomous triage.', 'Oppgrader til Professional for Support AI og triage.', false, false, '{}'::jsonb),
  ('workflow_automation', 'Workflow Automation', 'professional', null, null,
    'Upgrade to Professional for workflow automation.', 'Oppgrader til Professional for arbeidsflyt-automatisering.', false, false, '{}'::jsonb),
  ('email_sending', 'Email Sending', 'professional', null, 200,
    'Upgrade to Professional to send emails from approved templates.', 'Oppgrader til Professional for å sende e-post fra godkjente maler.', false, false, '{}'::jsonb),
  ('calendar_booking', 'Calendar Booking', 'professional', null, null,
    'Upgrade to Professional for calendar booking and scheduling.', 'Oppgrader til Professional for kalenderbooking.', false, false, '{}'::jsonb),
  ('approval_workflows', 'Approval Workflows', 'professional', null, null,
    'Upgrade to Professional for approval workflows.', 'Oppgrader til Professional for godkjenningsarbeidsflyter.', false, false, '{}'::jsonb),
  ('taxi_ordering', 'Taxi Ordering', 'business', 'uaaf.execute', 20,
    'Upgrade to Business to order taxis with Companion approval.', 'Oppgrader til Business for taxi-bestilling med Companion-godkjenning.', true, true, '{"category":"personal_action"}'::jsonb),
  ('flower_ordering', 'Flower Ordering', 'business', 'uaaf.execute', 20,
    'Upgrade to Business to order flowers and gifts with approval.', 'Oppgrader til Business for blomster- og gavebestilling.', true, true, '{"category":"personal_action"}'::jsonb),
  ('food_ordering', 'Food Ordering', 'business', 'uaaf.execute', 30,
    'Upgrade to Business to order food with Companion approval.', 'Oppgrader til Business for matbestilling med godkjenning.', true, true, '{"category":"personal_action"}'::jsonb),
  ('executive_dashboards', 'Executive Dashboards', 'business', null, null,
    'Upgrade to Business for executive dashboards and operational visibility.', 'Oppgrader til Business for lederdashbord.', true, false, '{}'::jsonb),
  ('digital_employees', 'Digital Employees', 'business', null, null,
    'Upgrade to Business for digital employee workflows.', 'Oppgrader til Business for digitale medarbeider-arbeidsflyter.', true, false, '{}'::jsonb),
  ('advanced_companion_actions', 'Advanced Companion Actions', 'business', 'uaaf.execute', null,
    'Upgrade to Business for advanced Companion actions.', 'Oppgrader til Business for avanserte Companion-handlinger.', true, true, '{}'::jsonb),
  ('customer_follow_up_automation', 'Customer Follow-Up Automation', 'business', null, null,
    'Upgrade to Business for customer follow-up automation.', 'Oppgrader til Business for kundeoppfølgingsautomatisering.', true, false, '{}'::jsonb),
  ('travel_booking', 'Travel Booking', 'enterprise', 'uaaf.execute', 10,
    'Upgrade to Enterprise for travel booking with governance.', 'Oppgrader til Enterprise for reisebooking med styring.', true, true, '{"category":"enterprise_action"}'::jsonb),
  ('procurement_coordination', 'Procurement Coordination', 'enterprise', null, null,
    'Upgrade to Enterprise for procurement coordination.', 'Oppgrader til Enterprise for innkjøpskoordinering.', true, true, '{}'::jsonb),
  ('enterprise_action_orchestration', 'Enterprise Action Orchestration', 'enterprise', 'uaaf.execute', null,
    'Upgrade to Enterprise for enterprise-wide action orchestration.', 'Oppgrader til Enterprise for handlingsorkestrering.', true, true, '{}'::jsonb),
  ('sso', 'Single Sign-On', 'enterprise', null, null,
    'Upgrade to Enterprise for SSO and identity federation.', 'Oppgrader til Enterprise for SSO og identitetsføderering.', true, false, '{}'::jsonb),
  ('advanced_audit', 'Advanced Audit', 'enterprise', null, null,
    'Upgrade to Enterprise for advanced audit and compliance trails.', 'Oppgrader til Enterprise for avansert revisjon.', true, false, '{}'::jsonb),
  ('custom_integrations', 'Custom Integrations', 'enterprise', null, null,
    'Upgrade to Enterprise for custom integrations and dedicated support.', 'Oppgrader til Enterprise for tilpassede integrasjoner.', true, false, '{}'::jsonb)
on conflict (feature_key) do update set
  feature_label = excluded.feature_label,
  required_package = excluded.required_package,
  permission_key = excluded.permission_key,
  usage_limit_monthly = excluded.usage_limit_monthly,
  upgrade_message_en = excluded.upgrade_message_en,
  upgrade_message_no = excluded.upgrade_message_no,
  is_gold_nugget = excluded.is_gold_nugget,
  action_capability = excluded.action_capability,
  metadata = excluded.metadata,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- 3. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_enterprise_packaging_upgrade_instant_access_engine', v.description
from (values
  ('package_access.view', 'View Package Access', 'View package tiers, feature access, and usage limits'),
  ('package_access.manage', 'Manage Package Access', 'Manage organization subscription access settings'),
  ('package_access.upgrade', 'Upgrade Package', 'Start and complete package upgrades with instant access'),
  ('package_access.billing', 'Package Billing', 'View billing access events and payment-related package changes')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'package_access.view'), ('owner', 'package_access.manage'),
  ('owner', 'package_access.upgrade'), ('owner', 'package_access.billing'),
  ('administrator', 'package_access.view'), ('administrator', 'package_access.manage'),
  ('administrator', 'package_access.upgrade'), ('administrator', 'package_access.billing'),
  ('manager', 'package_access.view'),
  ('employee', 'package_access.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 4. Blueprint helpers — _apuiaebp284_*
-- ---------------------------------------------------------------------------
create or replace function public._apuiaebp284_distinction_note() returns text language sql immutable as $$
  select 'ABOS Phase 284 — Enterprise Packaging, Upgrade & Instant Access Engine. Paid access now — upgrade and unlock features instantly. Helpers _apuiaebp284_*.';
$$;

create or replace function public._apuiaebp284_paid_access_now() returns text language sql immutable as $$
  select 'Paid access now — when payment completes, features activate immediately without waiting for manual provisioning.';
$$;

create or replace function public._apuiaebp284_core_principles() returns jsonb language sql immutable as $$
  select jsonb_build_object('principles', jsonb_build_array(
    jsonb_build_object(
      'key', 'paid_access_now',
      'label', 'Paid Access Now',
      'description', public._apuiaebp284_paid_access_now()
    ),
    jsonb_build_object(
      'key', 'transparent_packaging',
      'label', 'Transparent Packaging',
      'description', 'Every feature maps to a clear package tier — no hidden gates or surprise limits.'
    ),
    jsonb_build_object(
      'key', 'people_first_upgrades',
      'label', 'People First Upgrades',
      'description', 'Upgrade when your organization is ready — calm guidance, no pressure or fake urgency.'
    )
  ));
$$;

create or replace function public._apuiaebp284_package_structure() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'starter', jsonb_build_object(
      'key', 'starter', 'label', 'Starter',
      'description', 'Essential Companion — notes, tasks, calendar, email drafts, printing, and basic summaries.',
      'sort_order', 1
    ),
    'professional', jsonb_build_object(
      'key', 'professional', 'label', 'Professional',
      'description', 'Growing teams — collaboration, Support AI, workflow automation, email sending, and approvals.',
      'sort_order', 2
    ),
    'business', jsonb_build_object(
      'key', 'business', 'label', 'Business',
      'description', 'Gold nugget actions — taxi, flowers, food ordering, executive dashboards, and digital employees.',
      'sort_order', 3
    ),
    'enterprise', jsonb_build_object(
      'key', 'enterprise', 'label', 'Enterprise',
      'description', 'Enterprise governance — travel, procurement, SSO, advanced audit, and custom integrations.',
      'sort_order', 4
    )
  );
$$;

create or replace function public._apuiaebp284_instant_activation_flow() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'steps', jsonb_build_array(
      jsonb_build_object('step', 1, 'key', 'select_package', 'label', 'Select target package and review feature unlocks'),
      jsonb_build_object('step', 2, 'key', 'confirm_upgrade', 'label', 'Confirm upgrade — payment or billing authorization'),
      jsonb_build_object('step', 3, 'key', 'instant_activation', 'label', 'Instant activation — sync modules and unlock features immediately'),
      jsonb_build_object('step', 4, 'key', 'audit_trail', 'label', 'Audit trail — billing access events recorded for transparency')
    ),
    'principle', public._apuiaebp284_paid_access_now()
  );
$$;

create or replace function public._apuiaebp284_upgrade_confirmation_message() returns text language sql immutable as $$
  select 'Upgrade complete. Business features are now active.';
$$;

create or replace function public._apuiaebp284_privacy_note() returns text language sql immutable as $$
  select 'Package Access metadata only — event summaries max ~500 chars. No payment card data or raw customer content stored.';
$$;

create or replace function public._apuiaebp284_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 284 — Enterprise Packaging, Upgrade & Instant Access Engine',
    'title', 'Enterprise Packaging, Upgrade & Instant Access Engine',
    'route', '/app/settings/billing/packages',
    'distinction_note', public._apuiaebp284_distinction_note(),
    'core_principles', public._apuiaebp284_core_principles(),
    'package_structure', public._apuiaebp284_package_structure(),
    'instant_activation_flow', public._apuiaebp284_instant_activation_flow(),
    'upgrade_confirmation_message', public._apuiaebp284_upgrade_confirmation_message(),
    'paid_access_now', public._apuiaebp284_paid_access_now(),
    'privacy_note', public._apuiaebp284_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. Engine helpers — _apuiae_*
-- ---------------------------------------------------------------------------
create or replace function public._apuiae_tenant_for_auth() returns uuid
language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._apuiae_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._apuiae_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._apuiae_package_rank(p_package text) returns int
language sql immutable as $$
  select case p_package
    when 'starter' then 1
    when 'professional' then 2
    when 'business' then 3
    when 'enterprise' then 4
    else 0
  end;
$$;

create or replace function public._apuiae_log_access_event(
  p_tenant_id uuid,
  p_event_type text,
  p_summary text default null,
  p_context jsonb default '{}'::jsonb,
  p_user_id uuid default null,
  p_feature_key text default null,
  p_package_key text default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_billing_access_events (
    tenant_id, user_id, event_type, feature_key, package_key, summary, context
  ) values (
    p_tenant_id, coalesce(p_user_id, public._mta_app_user_id()), p_event_type,
    p_feature_key, p_package_key, left(p_summary, 500), p_context
  ) returning id into v_id;
  return v_id;
end; $$;

create or replace function public._apuiae_ensure_subscription_access(p_tenant_id uuid)
returns public.aipify_organization_subscription_access
language plpgsql security definer set search_path = public as $$
declare
  v_row public.aipify_organization_subscription_access;
  v_package text;
  v_status text;
  v_trial_ends timestamptz;
  v_renewal timestamptz;
begin
  v_package := public._cpa_resolve_package_key(p_tenant_id);

  select coalesce(os.status, s.status, 'active'), os.trial_ends_at, s.next_billing_date
  into v_status, v_trial_ends, v_renewal
  from public.customers c
  left join public.organization_subscriptions os on os.organization_id = c.id
  left join public.subscriptions s on s.customer_id = c.id
  where c.id = p_tenant_id
  limit 1;

  insert into public.aipify_organization_subscription_access (
    tenant_id, current_package, subscription_status, trial_ends_at, renewal_at, instant_access_enabled
  ) values (
    p_tenant_id,
    v_package,
    case
      when v_status in ('trial', 'active', 'past_due', 'paused', 'cancelled') then v_status
      when v_status in ('expired') then 'cancelled'
      else 'active'
    end,
    v_trial_ends,
    v_renewal,
    true
  ) on conflict (tenant_id) do nothing;

  select * into v_row
  from public.aipify_organization_subscription_access
  where tenant_id = p_tenant_id;

  return v_row;
end; $$;

create or replace function public._apuiae_subscription_access_to_json(p_row public.aipify_organization_subscription_access)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'current_package', p_row.current_package,
    'subscription_status', p_row.subscription_status,
    'trial_ends_at', p_row.trial_ends_at,
    'renewal_at', p_row.renewal_at,
    'seat_count', p_row.seat_count,
    'instant_access_enabled', p_row.instant_access_enabled,
    'last_upgrade_at', p_row.last_upgrade_at
  );
$$;

create or replace function public._apuiae_feature_access(
  p_tenant_id uuid,
  p_feature_key text,
  p_locale text default 'en'
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_feature public.aipify_package_features;
  v_access public.aipify_organization_subscription_access;
  v_current_package text;
  v_allowed boolean;
  v_status text;
  v_upgrade_message text;
begin
  select * into v_feature from public.aipify_package_features where feature_key = p_feature_key;
  if v_feature.feature_key is null then
    return jsonb_build_object(
      'allowed', false, 'required_package', null, 'upgrade_message', 'Unknown feature',
      'access_status', 'unknown'
    );
  end if;

  select * into v_access from public.aipify_organization_subscription_access where tenant_id = p_tenant_id;
  v_current_package := coalesce(v_access.current_package, public._cpa_resolve_package_key(p_tenant_id));
  v_allowed := public._apuiae_package_rank(v_current_package) >= public._apuiae_package_rank(v_feature.required_package);

  v_upgrade_message := case when p_locale = 'no' then v_feature.upgrade_message_no else v_feature.upgrade_message_en end;

  if v_allowed then
    v_status := case coalesce(v_access.subscription_status, 'active')
      when 'past_due' then 'past_due_allowed'
      when 'paused' then 'paused'
      when 'cancelled' then 'cancelled'
      else 'allowed'
    end;
  else
    v_status := 'locked';
  end if;

  return jsonb_build_object(
    'allowed', v_allowed and coalesce(v_access.subscription_status, 'active') not in ('paused', 'cancelled'),
    'required_package', v_feature.required_package,
    'upgrade_message', v_upgrade_message,
    'access_status', v_status,
    'feature_key', v_feature.feature_key,
    'feature_label', v_feature.feature_label,
    'is_gold_nugget', v_feature.is_gold_nugget,
    'action_capability', v_feature.action_capability,
    'usage_limit_monthly', v_feature.usage_limit_monthly
  );
end; $$;

create or replace function public._apuiae_packages_comparison(p_current_package text)
returns jsonb language sql stable as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'package_key', sp.package_key,
    'package_name', sp.package_name,
    'description', sp.description,
    'package_type', sp.package_type,
    'sort_order', sp.sort_order,
    'is_current', sp.package_key = p_current_package,
    'is_upgrade', sp.sort_order > coalesce((
      select sort_order from public.subscription_packages where package_key = p_current_package
    ), 0)
  ) order by sp.sort_order), '[]'::jsonb)
  from public.subscription_packages sp
  where sp.active and sp.package_type in ('core', 'suite', 'enterprise');
$$;

-- ---------------------------------------------------------------------------
-- 6. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.recommend_package_for_tenant(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_current_package text;
  v_locked_gold int;
  v_locked_action int;
  v_usage_high boolean;
  v_best_fit text;
  v_reason text;
begin
  v_tenant_id := coalesce(p_org_id, public._apuiae_tenant_for_auth());
  if v_tenant_id is null then
    return jsonb_build_object('best_fit', 'starter', 'reason', 'Establish your workspace with Starter essentials.');
  end if;

  v_current_package := coalesce(
    (select current_package from public.aipify_organization_subscription_access where tenant_id = v_tenant_id),
    public._cpa_resolve_package_key(v_tenant_id)
  );

  select count(*) into v_locked_gold
  from public.aipify_package_features f
  where f.is_gold_nugget
    and public._apuiae_package_rank(f.required_package) > public._apuiae_package_rank(v_current_package);

  select count(*) into v_locked_action
  from public.aipify_package_features f
  where f.action_capability
    and public._apuiae_package_rank(f.required_package) > public._apuiae_package_rank(v_current_package);

  select exists (
    select 1 from public.tenant_usage_metrics tum
    where tum.tenant_id = v_tenant_id
      and tum.period_month >= date_trunc('month', now())::date - interval '1 month'
      and (tum.support_cases_handled > 50 or tum.employee_interactions > 100 or tum.ai_usage_volume > 500)
  ) into v_usage_high;

  if v_current_package = 'enterprise' then
    v_best_fit := 'enterprise';
    v_reason := 'Your organization has Enterprise access — all tiers and governance features are available.';
  elsif v_locked_action > 0 or v_locked_gold >= 3 then
    v_best_fit := case when v_locked_action > 2 then 'enterprise' else 'business' end;
    v_reason := case v_best_fit
      when 'enterprise' then 'Unlock enterprise action orchestration, travel booking, and advanced governance.'
      else 'Unlock gold nugget actions — taxi, flowers, food ordering, and executive dashboards.'
    end;
  elsif v_usage_high and v_current_package in ('starter', 'professional') then
    v_best_fit := case v_current_package when 'starter' then 'professional' else 'business' end;
    v_reason := 'Your usage patterns suggest upgrading for team collaboration, Support AI, and automation.';
  elsif v_current_package = 'starter' then
    v_best_fit := 'professional';
    v_reason := 'Professional adds team collaboration, Support AI, workflow automation, and approval workflows.';
  elsif v_current_package = 'professional' then
    v_best_fit := 'business';
    v_reason := 'Business unlocks gold nugget Companion actions and executive operational visibility.';
  else
    v_best_fit := 'enterprise';
    v_reason := 'Enterprise adds SSO, advanced audit, travel booking, and custom integrations.';
  end if;

  if public._apuiae_package_rank(v_best_fit) <= public._apuiae_package_rank(v_current_package) then
    v_best_fit := v_current_package;
    v_reason := format('Your current %s package matches your operational profile.', v_current_package);
  end if;

  return jsonb_build_object(
    'best_fit', v_best_fit,
    'reason', v_reason,
    'current_package', v_current_package,
    'locked_gold_nuggets', v_locked_gold,
    'locked_action_capabilities', v_locked_action
  );
end; $$;

create or replace function public.get_package_access_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_access public.aipify_organization_subscription_access;
  v_current_package text;
  v_recommendation jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._apuiae_require_tenant());
  perform public._irp_require_permission('package_access.view', v_tenant_id);

  v_access := public._apuiae_ensure_subscription_access(v_tenant_id);
  v_current_package := coalesce(v_access.current_package, public._cpa_resolve_package_key(v_tenant_id));
  v_recommendation := public.recommend_package_for_tenant(v_tenant_id);

  perform public._apuiae_log_access_event(
    v_tenant_id, 'package_selected', 'Package Access Center viewed',
    jsonb_build_object('current_package', v_current_package), null, null, v_current_package
  );

  return jsonb_build_object(
    'has_customer', true,
    'current_package', jsonb_build_object(
      'package_key', v_current_package,
      'resolved_from', public._cpa_resolve_package_key(v_tenant_id)
    ),
    'subscription_access', public._apuiae_subscription_access_to_json(v_access),
    'packages_comparison', public._apuiae_packages_comparison(v_current_package),
    'feature_access_map', coalesce((
      select jsonb_object_agg(
        f.feature_key,
        public._apuiae_feature_access(v_tenant_id, f.feature_key, 'en')
      )
      from public.aipify_package_features f
    ), '{}'::jsonb),
    'locked_features', coalesce((
      select jsonb_agg(jsonb_build_object(
        'feature_key', f.feature_key,
        'feature_label', f.feature_label,
        'required_package', f.required_package,
        'upgrade_message_en', f.upgrade_message_en,
        'upgrade_message_no', f.upgrade_message_no,
        'is_gold_nugget', f.is_gold_nugget,
        'action_capability', f.action_capability
      ) order by public._apuiae_package_rank(f.required_package), f.feature_label)
      from public.aipify_package_features f
      where public._apuiae_package_rank(f.required_package) > public._apuiae_package_rank(v_current_package)
    ), '[]'::jsonb),
    'usage_limits', coalesce((
      select jsonb_agg(jsonb_build_object(
        'feature_key', ul.feature_key,
        'period_month', ul.period_month,
        'usage_count', ul.usage_count,
        'limit_value', ul.limit_value
      ) order by ul.period_month desc, ul.feature_key)
      from public.aipify_package_usage_limits ul
      where ul.tenant_id = v_tenant_id
        and ul.period_month = date_trunc('month', now())::date
    ), '[]'::jsonb),
    'recent_billing_events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'event_type', e.event_type, 'feature_key', e.feature_key,
        'package_key', e.package_key, 'summary', e.summary, 'created_at', e.created_at
      ) order by e.created_at desc)
      from (
        select * from public.aipify_billing_access_events
        where tenant_id = v_tenant_id
        order by created_at desc
        limit 15
      ) e
    ), '[]'::jsonb),
    'blueprint', public._apuiaebp284_blueprint_summary(),
    'recommendation', v_recommendation,
    'privacy_note', public._apuiaebp284_privacy_note(),
    'can_manage', public._irp_has_permission('package_access.manage', v_tenant_id),
    'can_upgrade', public._irp_has_permission('package_access.upgrade', v_tenant_id),
    'can_view_billing', public._irp_has_permission('package_access.billing', v_tenant_id)
  );
end; $$;

create or replace function public.check_package_feature_access(
  p_feature_key text,
  p_org_id uuid default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_result jsonb;
  v_allowed boolean;
begin
  v_tenant_id := coalesce(p_org_id, public._apuiae_require_tenant());
  perform public._irp_require_permission('package_access.view', v_tenant_id);
  perform public._apuiae_ensure_subscription_access(v_tenant_id);

  v_result := public._apuiae_feature_access(v_tenant_id, p_feature_key, 'en');
  v_allowed := coalesce((v_result->>'allowed')::boolean, false);

  if not v_allowed then
    perform public._apuiae_log_access_event(
      v_tenant_id, 'feature_denied', left('Feature denied: ' || p_feature_key, 500),
      v_result, null, p_feature_key, v_result->>'required_package'
    );
  end if;

  return v_result;
end; $$;

create or replace function public.start_package_upgrade(
  p_target_package text,
  p_org_id uuid default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_access public.aipify_organization_subscription_access;
  v_from_package text;
  v_event public.aipify_upgrade_events;
begin
  v_tenant_id := coalesce(p_org_id, public._apuiae_require_tenant());
  perform public._irp_require_permission('package_access.upgrade', v_tenant_id);

  if p_target_package not in ('starter', 'professional', 'business', 'enterprise') then
    raise exception 'Invalid target package';
  end if;

  v_access := public._apuiae_ensure_subscription_access(v_tenant_id);
  v_from_package := coalesce(v_access.current_package, public._cpa_resolve_package_key(v_tenant_id));

  if public._apuiae_package_rank(p_target_package) <= public._apuiae_package_rank(v_from_package) then
    raise exception 'Target package must be higher than current package';
  end if;

  insert into public.aipify_upgrade_events (
    tenant_id, user_id, from_package, to_package, status, instant_activation
  ) values (
    v_tenant_id, public._mta_app_user_id(), v_from_package, p_target_package, 'started', true
  ) returning * into v_event;

  perform public._apuiae_log_access_event(
    v_tenant_id, 'upgrade_started',
    format('Upgrade started from %s to %s', v_from_package, p_target_package),
    jsonb_build_object('upgrade_event_id', v_event.id),
    public._mta_app_user_id(), null, p_target_package
  );

  return jsonb_build_object(
    'upgrade_event_id', v_event.id,
    'from_package', v_from_package,
    'to_package', p_target_package,
    'status', v_event.status,
    'instant_activation', v_event.instant_activation,
    'message', 'Upgrade started. Complete payment to activate instantly.'
  );
end; $$;

create or replace function public.complete_package_upgrade_instant(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_target_package text;
  v_access public.aipify_organization_subscription_access;
  v_from_package text;
  v_event public.aipify_upgrade_events;
  v_upgrade_event_id uuid;
  v_payment_reference text;
  v_instant boolean;
  v_confirmation text;
begin
  v_tenant_id := public._apuiae_require_tenant();
  perform public._irp_require_permission('package_access.upgrade', v_tenant_id);

  v_target_package := coalesce(p_payload->>'target_package', p_payload->>'to_package');
  if v_target_package not in ('starter', 'professional', 'business', 'enterprise') then
    raise exception 'Invalid target package';
  end if;

  v_upgrade_event_id := nullif(p_payload->>'upgrade_event_id', '')::uuid;
  v_payment_reference := p_payload->>'payment_reference';
  v_instant := coalesce((p_payload->>'instant_activation')::boolean, true);
  v_confirmation := public._apuiaebp284_upgrade_confirmation_message();

  v_access := public._apuiae_ensure_subscription_access(v_tenant_id);
  v_from_package := coalesce(v_access.current_package, public._cpa_resolve_package_key(v_tenant_id));

  if v_upgrade_event_id is not null then
    update public.aipify_upgrade_events set
      status = 'completed',
      payment_reference = coalesce(v_payment_reference, payment_reference),
      instant_activation = v_instant,
      updated_at = now()
    where id = v_upgrade_event_id and tenant_id = v_tenant_id
    returning * into v_event;
  else
    insert into public.aipify_upgrade_events (
      tenant_id, user_id, from_package, to_package, status, payment_reference, instant_activation
    ) values (
      v_tenant_id, public._mta_app_user_id(), v_from_package, v_target_package,
      'completed', v_payment_reference, v_instant
    ) returning * into v_event;
  end if;

  update public.aipify_organization_subscription_access set
    current_package = v_target_package,
    subscription_status = 'active',
    instant_access_enabled = v_instant,
    last_upgrade_at = now(),
    updated_at = now()
  where tenant_id = v_tenant_id
  returning * into v_access;

  update public.organization_subscriptions set
    plan_key = v_target_package,
    status = case when status in ('expired', 'cancelled', 'trial') then 'active' else status end,
    updated_at = now()
  where organization_id = v_tenant_id;

  perform public.sync_tenant_modules_from_package(v_tenant_id);

  perform public._apuiae_log_access_event(
    v_tenant_id, 'payment_completed',
    format('Payment completed for upgrade to %s', v_target_package),
    jsonb_build_object('upgrade_event_id', v_event.id, 'payment_reference', v_payment_reference),
    public._mta_app_user_id(), null, v_target_package
  );

  perform public._apuiae_log_access_event(
    v_tenant_id, 'access_activated', v_confirmation,
    jsonb_build_object(
      'from_package', v_from_package,
      'to_package', v_target_package,
      'instant_activation', v_instant
    ),
    public._mta_app_user_id(), null, v_target_package
  );

  perform public._apuiae_log_access_event(
    v_tenant_id, 'feature_unlocked',
    format('Features unlocked for %s package', v_target_package),
    jsonb_build_object('package_key', v_target_package),
    public._mta_app_user_id(), null, v_target_package
  );

  return jsonb_build_object(
    'success', true,
    'instant_activation', v_instant,
    'from_package', v_from_package,
    'to_package', v_target_package,
    'current_package', v_access.current_package,
    'subscription_status', v_access.subscription_status,
    'upgrade_event_id', v_event.id,
    'confirmation', v_confirmation,
    'message', v_confirmation
  );
end; $$;

create or replace function public.record_package_access_event(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_event_id uuid;
  v_event_type text;
begin
  v_tenant_id := public._apuiae_require_tenant();
  perform public._irp_require_permission('package_access.manage', v_tenant_id);

  v_event_type := coalesce(p_payload->>'event_type', '');
  if v_event_type not in (
    'package_selected', 'upgrade_started', 'payment_completed', 'access_activated',
    'downgrade_requested', 'permission_changed', 'feature_unlocked', 'feature_denied'
  ) then
    raise exception 'Invalid event_type';
  end if;

  v_event_id := public._apuiae_log_access_event(
    v_tenant_id,
    v_event_type,
    p_payload->>'summary',
    coalesce(p_payload->'context', '{}'::jsonb),
    nullif(p_payload->>'user_id', '')::uuid,
    p_payload->>'feature_key',
    p_payload->>'package_key'
  );

  return jsonb_build_object('id', v_event_id, 'recorded', true);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Knowledge category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select
  'aipify-enterprise-packaging-upgrade-instant-access-engine',
  'Enterprise Packaging, Upgrade & Instant Access Engine',
  'Package Access Center — Organizational Wisdom Era (284). Paid access now — instant feature activation.',
  'authenticated',
  284
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'aipify-enterprise-packaging-upgrade-instant-access-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 8. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_package_access_center(uuid) to authenticated;
grant execute on function public.check_package_feature_access(text, uuid) to authenticated;
grant execute on function public.start_package_upgrade(text, uuid) to authenticated;
grant execute on function public.complete_package_upgrade_instant(jsonb) to authenticated;
grant execute on function public.record_package_access_event(jsonb) to authenticated;
grant execute on function public.recommend_package_for_tenant(uuid) to authenticated;
