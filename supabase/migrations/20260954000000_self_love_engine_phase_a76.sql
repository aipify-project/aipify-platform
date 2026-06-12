-- Phase A.76 — Self Love Engine (ABOS)
-- Unifies wellbeing principles across user, team, organization, and system health with explainable recommendations.
-- Distinct from Attention Guardian (personal focus), LifeOS, Companion Identity A.84, Presence & Comfort A.90,
-- Quality Guardian A.13 (partial overlap — aggregate signals only), Observability A.19 (partial overlap — counts only).

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
    'self_love_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_self_love_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_self_love_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  enabled boolean not null default true,
  reminder_frequency text not null default 'normal' check (
    reminder_frequency in ('low', 'normal', 'high')
  ),
  quiet_hours jsonb not null default '{"enabled": false, "start": "22:00", "end": "07:00", "timezone": "UTC"}'::jsonb,
  reminder_tone text not null default 'warm' check (
    reminder_tone in ('warm', 'balanced', 'minimal')
  ),
  dashboard_insights_enabled boolean not null default true,
  workspace_settings jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_self_love_settings enable row level security;
revoke all on public.organization_self_love_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. user_self_love_preferences
-- ---------------------------------------------------------------------------
create table if not exists public.user_self_love_preferences (
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  reminder_prefs jsonb not null default '{"frequency": "normal", "max_per_day": 6}'::jsonb,
  tone text not null default 'warm' check (
    tone in ('warm', 'balanced', 'minimal')
  ),
  channels jsonb not null default '["in_app","command_center"]'::jsonb,
  pause_suggestions_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

alter table public.user_self_love_preferences enable row level security;
revoke all on public.user_self_love_preferences from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_self_love_recommendations (metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_self_love_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete cascade,
  category text not null check (
    category in ('user_wellbeing', 'team_health', 'organization_health', 'system_health')
  ),
  title text not null check (char_length(title) <= 200),
  explanation text not null check (char_length(explanation) <= 500),
  confidence text not null default 'moderate' check (
    confidence in ('low', 'moderate', 'high')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'acknowledged', 'dismissed')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_self_love_recommendations_org_idx
  on public.organization_self_love_recommendations (organization_id, user_id, status, category, created_at desc);

alter table public.organization_self_love_recommendations enable row level security;
revoke all on public.organization_self_love_recommendations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'self_love_engine', v.description
from (values
  ('self_love.view', 'View Self Love Engine', 'View Self Love dashboard and recommendations'),
  ('self_love.manage', 'Manage Self Love Engine', 'Configure organization Self Love workspace settings'),
  ('self_love.preferences.manage', 'Manage Self Love Preferences', 'Manage personal Self Love reminder preferences'),
  ('self_love.export', 'Export Self Love Summary', 'Export Self Love configuration summary')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'self_love.view'), ('owner', 'self_love.manage'),
  ('owner', 'self_love.preferences.manage'), ('owner', 'self_love.export'),
  ('administrator', 'self_love.view'), ('administrator', 'self_love.manage'),
  ('administrator', 'self_love.preferences.manage'), ('administrator', 'self_love.export'),
  ('manager', 'self_love.view'), ('manager', 'self_love.preferences.manage'),
  ('employee', 'self_love.view'), ('employee', 'self_love.preferences.manage'),
  ('support_agent', 'self_love.view'), ('support_agent', 'self_love.preferences.manage'),
  ('moderator', 'self_love.view'), ('moderator', 'self_love.preferences.manage'),
  ('viewer', 'self_love.view'), ('viewer', 'self_love.preferences.manage')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 5. Helpers (_sle_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._sle_ensure_settings(p_organization_id uuid)
returns public.organization_self_love_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_self_love_settings;
begin
  insert into public.organization_self_love_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;

  select * into v_row
  from public.organization_self_love_settings
  where organization_id = p_organization_id;

  return v_row;
end; $$;

create or replace function public._sle_ensure_user_prefs(
  p_organization_id uuid,
  p_user_id uuid
)
returns public.user_self_love_preferences language plpgsql security definer set search_path = public as $$
declare v_row public.user_self_love_preferences;
declare v_settings public.organization_self_love_settings;
begin
  v_settings := public._sle_ensure_settings(p_organization_id);

  insert into public.user_self_love_preferences (
    organization_id, user_id, tone, channels, pause_suggestions_enabled,
    reminder_prefs
  ) values (
    p_organization_id,
    p_user_id,
    v_settings.reminder_tone,
    '["in_app","command_center"]'::jsonb,
    true,
    jsonb_build_object('frequency', v_settings.reminder_frequency, 'max_per_day', 6)
  )
  on conflict (organization_id, user_id) do nothing;

  select * into v_row
  from public.user_self_love_preferences
  where organization_id = p_organization_id and user_id = p_user_id;

  return v_row;
end; $$;

create or replace function public._sle_application_areas()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'user_wellbeing',
      'label', 'User Wellbeing',
      'description', 'Sustainable pacing, reflection prompts, recovery breaks, and capacity awareness — never surveillance.',
      'examples', jsonb_build_array(
        'Short break suggestion after extended focus sessions',
        'Gentle reminder to step away before late-night overwork',
        'Celebrate progress without glorifying exhaustion'
      )
    ),
    jsonb_build_object(
      'key', 'team_health',
      'label', 'Team Health',
      'description', 'Coordination cues, shared milestone awareness, and workload balance signals — metadata only, never colleague monitoring.',
      'examples', jsonb_build_array(
        'Handoff reminders before shared deadlines',
        'Support queue pressure awareness for team leads',
        'Encourage recovery after intense delivery periods'
      )
    ),
    jsonb_build_object(
      'key', 'organization_health',
      'label', 'Organization Health',
      'description', 'Operational rhythm, approval backlogs, knowledge freshness, and adoption patterns — explainable organizational wellbeing.',
      'examples', jsonb_build_array(
        'Knowledge Center cleanup windows',
        'Workflow simplification opportunities',
        'Admin workload balance for pilot operations'
      )
    ),
    jsonb_build_object(
      'key', 'system_health',
      'label', 'System Health',
      'description', 'Aggregate platform and quality signals — Aipify caring for itself so it can care for others.',
      'examples', jsonb_build_array(
        'Quality check trends from Quality Guardian',
        'Platform health event counts from Observability',
        'Maintenance and recovery guidance without alarmism'
      )
    )
  );
$$;

create or replace function public._sle_communication_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phrase', 'Remember some Self Love today.', 'emoji', '🌹'),
    jsonb_build_object('phrase', 'A little Self Love can go a long way.', 'emoji', '🌹'),
    jsonb_build_object('phrase', 'Self Love recommends taking a short break.', 'emoji', '💚'),
    jsonb_build_object('phrase', 'Perhaps this workflow needs a little Self Love.', 'emoji', '🌹'),
    jsonb_build_object('phrase', 'Self Love encourages reflection before action.', 'emoji', '💚'),
    jsonb_build_object('phrase', 'Being kind to your future self sometimes means waiting until tomorrow.', 'emoji', '🌹')
  );
$$;

create or replace function public._sle_boundaries()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Never intrusive — no excessive reminders or notification flooding',
    'Never infantilizing — warm and respectful, not patronizing',
    'Never blocking work — suggestions only; users retain full autonomy',
    'Never replacing professional help — not therapy or medical advice',
    'Never pretending perfect emotional understanding — honest about limits',
    'Metadata only — no raw chat, emotions, or PII in recommendations',
    'Self Love is a principle — settings control how reminders appear, not whether wellbeing matters'
  );
$$;

create or replace function public._sle_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'aipify_group', jsonb_build_object(
      'label', 'Aipify Group internal',
      'focus', jsonb_build_array(
        'Internal admin workload balance',
        'Knowledge Center maintenance rhythm',
        'Platform health self-care signals'
      )
    ),
    'unonight_pilot', jsonb_build_object(
      'label', 'Unonight pilot',
      'focus', jsonb_build_array(
        'Admin workload awareness',
        'Support pressure signals',
        'KC cleanup and workflow simplification',
        'System health connected to operational quality'
      )
    )
  );
$$;

create or replace function public._sle_system_health_signals(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_quality_open int := 0;
  v_quality_critical int := 0;
  v_health_degraded int := 0;
  v_health_unavailable int := 0;
  v_incidents_open int := 0;
begin
  if to_regclass('public.organization_quality_checks') is not null then
    select count(*), count(*) filter (where severity in ('high', 'critical'))
    into v_quality_open, v_quality_critical
    from public.organization_quality_checks
    where organization_id = p_organization_id and status = 'open';
  end if;

  if to_regclass('public.platform_health_events') is not null then
    select
      count(*) filter (where status = 'degraded'),
      count(*) filter (where status = 'unavailable')
    into v_health_degraded, v_health_unavailable
    from public.platform_health_events
    where organization_id = p_organization_id and resolved_at is null;
  end if;

  if to_regclass('public.platform_incidents') is not null then
    select count(*) into v_incidents_open
    from public.platform_incidents
    where organization_id = p_organization_id and status != 'resolved';
  end if;

  return jsonb_build_object(
    'metadata_only', true,
    'quality_guardian', jsonb_build_object(
      'open_checks', v_quality_open,
      'critical_checks', v_quality_critical,
      'source', 'organization_quality_checks'
    ),
    'observability', jsonb_build_object(
      'degraded_components', v_health_degraded,
      'unavailable_components', v_health_unavailable,
      'open_incidents', v_incidents_open,
      'source', 'platform_health_events'
    ),
    'note', 'Aggregate counts only — Self Love reads Quality Guardian and Observability signals; does not duplicate their engines.'
  );
end; $$;

create or replace function public._sle_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_settings public.organization_self_love_settings;
  v_user_prefs int := 0;
  v_recommendations int := 0;
  v_pending int := 0;
  v_system jsonb;
begin
  v_settings := public._sle_ensure_settings(p_organization_id);
  v_system := public._sle_system_health_signals(p_organization_id);

  select count(*) into v_user_prefs
  from public.user_self_love_preferences
  where organization_id = p_organization_id;

  select count(*), count(*) filter (where status = 'pending')
  into v_recommendations, v_pending
  from public.organization_self_love_recommendations
  where organization_id = p_organization_id;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'natural_companion_interactions',
      'label', 'Natural companion interactions with Self Love language',
      'met', v_settings.enabled,
      'note', 'ILM vocabulary and communication examples enforce warm, non-intrusive tone.'
    ),
    jsonb_build_object(
      'key', 'user_config',
      'label', 'Users can configure personal Self Love preferences',
      'met', v_user_prefs > 0,
      'note', case when v_user_prefs = 0 then 'User preferences seed on first dashboard visit.' else null end
    ),
    jsonb_build_object(
      'key', 'org_workspace_settings',
      'label', 'Organization workspace settings configurable',
      'met', v_settings.enabled,
      'note', 'Reminder frequency, quiet hours, tone, and dashboard insights available to admins.'
    ),
    jsonb_build_object(
      'key', 'explainable_recommendations',
      'label', 'Explainable recommendations with reason strings',
      'met', v_recommendations > 0,
      'note', case when v_recommendations = 0 then 'Demo recommendations seed on first visit.' else null end
    ),
    jsonb_build_object(
      'key', 'system_health_connected',
      'label', 'System health connected via aggregate signals',
      'met', (v_system->'quality_guardian'->>'open_checks')::int >= 0,
      'note', 'Reads Quality Guardian and Observability counts — metadata only.'
    ),
    jsonb_build_object(
      'key', 'clarity_without_annoyance',
      'label', 'Clarity without annoyance — boundaries respected',
      'met', v_settings.enabled and v_pending <= 8,
      'note', case when v_pending > 8 then 'Many pending recommendations — review frequency settings.' else null end
    )
  );
end; $$;

create or replace function public._sle_seed_recommendations(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organization_self_love_recommendations
    where organization_id = p_organization_id
    limit 1
  ) then
    return;
  end if;

  insert into public.organization_self_love_recommendations (
    organization_id, user_id, category, title, explanation, confidence, status, metadata
  ) values
    (p_organization_id, null, 'user_wellbeing',
     'Consider a short recovery break',
     'Extended focus patterns detected in metadata — a brief pause may support sustainable productivity.',
     'moderate', 'pending',
     '{"seed": true, "metadata_only": true, "reason": "capacity_signal"}'::jsonb),
    (p_organization_id, null, 'team_health',
     'Review shared milestone handoffs',
     'A coordinated deadline approaches — gentle handoff reminders support team health without individual surveillance.',
     'moderate', 'pending',
     '{"seed": true, "metadata_only": true, "reason": "milestone_coordination"}'::jsonb),
    (p_organization_id, null, 'organization_health',
     'Knowledge Center maintenance window',
     'Article freshness patterns suggest a calm cleanup session — Self Love for organizational clarity.',
     'low', 'pending',
     '{"seed": true, "metadata_only": true, "reason": "kc_freshness"}'::jsonb),
    (p_organization_id, null, 'organization_health',
     'Simplify a recurring workflow',
     'Repeated operational friction signals may benefit from workflow simplification — small Self Love for the organization.',
     'moderate', 'pending',
     '{"seed": true, "metadata_only": true, "reason": "workflow_friction"}'::jsonb),
    (p_organization_id, null, 'system_health',
     'Review platform health summary',
     'Aggregate quality and observability counts are available — systems that care for themselves support everyone.',
     'high', 'pending',
     '{"seed": true, "metadata_only": true, "reason": "system_health_aggregate"}'::jsonb);
end; $$;

create or replace function public._sle_preference_summary(
  p_organization_id uuid,
  p_user_id uuid
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_prefs public.user_self_love_preferences;
declare v_settings public.organization_self_love_settings;
begin
  v_settings := public._sle_ensure_settings(p_organization_id);
  v_prefs := public._sle_ensure_user_prefs(p_organization_id, p_user_id);

  return jsonb_build_object(
    'tone', v_prefs.tone,
    'channels', v_prefs.channels,
    'pause_suggestions_enabled', v_prefs.pause_suggestions_enabled,
    'reminder_prefs', v_prefs.reminder_prefs,
    'org_defaults', jsonb_build_object(
      'enabled', v_settings.enabled,
      'reminder_frequency', v_settings.reminder_frequency,
      'reminder_tone', v_settings.reminder_tone,
      'dashboard_insights_enabled', v_settings.dashboard_insights_enabled,
      'quiet_hours', v_settings.quiet_hours
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_self_love_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_pending int := 0;
begin
  perform public._irp_require_permission('self_love.view');
  v_org_id := public._mta_require_organization();
  perform public._sle_seed_recommendations(v_org_id);

  select count(*) into v_pending
  from public.organization_self_love_recommendations
  where organization_id = v_org_id
    and status = 'pending';

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Self Love supports healthier, sustainable ways of working — care, reflection, recovery, and balance.',
    'pending_recommendations', v_pending,
    'enabled', (select enabled from public.organization_self_love_settings where organization_id = v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_self_love_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_self_love_settings;
  v_prefs public.user_self_love_preferences;
begin
  perform public._irp_require_permission('self_love.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._sle_ensure_settings(v_org_id);
  v_prefs := public._sle_ensure_user_prefs(v_org_id, v_user_id);
  perform public._sle_seed_recommendations(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'mission', 'Turn Self Love from philosophy into functional behavior — healthier, sustainable ways of working across user, team, organization, and system health.',
    'philosophy', 'Self Love is a value — care, reflection, recovery, and balance. Support hard work without glorifying exhaustion.',
    'abos_principle', 'Systems that care for themselves are better equipped to care for others. Self Love augments people — Aipify informs and prepares; humans decide.',
    'vision', 'Self Love should be a recognizable expression of care through experience — natural, warm, human, and approachable.',
    'distinction_note', 'Distinct from Attention Guardian (personal focus), LifeOS, Companion Identity A.84 (orchestration), Presence & Comfort A.90, Quality Guardian A.13 and Observability A.19 (aggregate signals only).',
    'application_areas', public._sle_application_areas(),
    'communication_examples', public._sle_communication_examples(),
    'boundaries', public._sle_boundaries(),
    'org_settings', row_to_json(v_settings)::jsonb,
    'user_preferences', row_to_json(v_prefs)::jsonb,
    'preference_summary', public._sle_preference_summary(v_org_id, v_user_id),
    'recent_recommendations', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', r.id,
          'category', r.category,
          'title', r.title,
          'explanation', r.explanation,
          'confidence', r.confidence,
          'status', r.status,
          'metadata', r.metadata,
          'created_at', r.created_at,
          'updated_at', r.updated_at
        ) order by r.created_at desc
      )
      from public.organization_self_love_recommendations r
      where r.organization_id = v_org_id
        and (r.user_id is null or r.user_id = v_user_id)
      limit 12
    ), '[]'::jsonb),
    'system_health_signals', public._sle_system_health_signals(v_org_id),
    'success_criteria', public._sle_blueprint_success_criteria(v_org_id),
    'dogfooding', public._sle_dogfooding(),
    'summary', jsonb_build_object(
      'pending_recommendations', coalesce((
        select count(*) from public.organization_self_love_recommendations
        where organization_id = v_org_id
          and (user_id is null or user_id = v_user_id)
          and status = 'pending'
      ), 0),
      'acknowledged_count', coalesce((
        select count(*) from public.organization_self_love_recommendations
        where organization_id = v_org_id
          and (user_id is null or user_id = v_user_id)
          and status = 'acknowledged'
      ), 0)
    ),
    'integration_links', jsonb_build_object(
      'companion_identity', '/app/companion-identity-engine',
      'quality_guardian', '/app/quality-guardian-engine',
      'observability', '/app/observability-platform-health-engine',
      'attention_guardian', '/app/assistant/attention',
      'proactive_companion', '/app/proactive-companion-engine',
      'knowledge_center', '/app/knowledge-center-engine',
      'naming_standard', 'SELF_LOVE_NAMING_STANDARD.md'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('self_love.manage'),
      'can_manage_preferences', public._irp_has_permission('self_love.preferences.manage'),
      'can_export', public._irp_has_permission('self_love.export')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.update_organization_self_love_settings(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_self_love_settings;
begin
  perform public._irp_require_permission('self_love.manage');
  v_org_id := public._mta_require_organization();
  v_settings := public._sle_ensure_settings(v_org_id);

  update public.organization_self_love_settings set
    enabled = coalesce((p_payload->>'enabled')::boolean, enabled),
    reminder_frequency = coalesce(nullif(trim(p_payload->>'reminder_frequency'), ''), reminder_frequency),
    quiet_hours = coalesce(p_payload->'quiet_hours', quiet_hours),
    reminder_tone = coalesce(nullif(trim(p_payload->>'reminder_tone'), ''), reminder_tone),
    dashboard_insights_enabled = coalesce((p_payload->>'dashboard_insights_enabled')::boolean, dashboard_insights_enabled),
    workspace_settings = coalesce(p_payload->'workspace_settings', workspace_settings),
    metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_settings;

  return row_to_json(v_settings)::jsonb;
end; $$;

create or replace function public.update_user_self_love_preferences(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_prefs public.user_self_love_preferences;
begin
  perform public._irp_require_permission('self_love.preferences.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_prefs := public._sle_ensure_user_prefs(v_org_id, v_user_id);

  update public.user_self_love_preferences set
    reminder_prefs = coalesce(p_payload->'reminder_prefs', reminder_prefs),
    tone = coalesce(nullif(trim(p_payload->>'tone'), ''), tone),
    channels = coalesce(p_payload->'channels', channels),
    pause_suggestions_enabled = coalesce((p_payload->>'pause_suggestions_enabled')::boolean, pause_suggestions_enabled),
    metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
    updated_at = now()
  where organization_id = v_org_id and user_id = v_user_id
  returning * into v_prefs;

  return row_to_json(v_prefs)::jsonb;
end; $$;

create or replace function public.acknowledge_self_love_recommendation(p_recommendation_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_self_love_recommendations%rowtype;
begin
  perform public._irp_require_permission('self_love.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.organization_self_love_recommendations set
    status = 'acknowledged',
    updated_at = now()
  where id = p_recommendation_id
    and organization_id = v_org_id
    and (user_id is null or user_id = v_user_id)
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Recommendation not found or not accessible';
  end if;

  return jsonb_build_object(
    'acknowledged', true,
    'recommendation_id', v_row.id,
    'category', v_row.category,
    'metadata_only', true
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. KC category seed
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'self-love-engine', 'Self Love Engine',
  'Wellbeing principles across user, team, organization, and system health — explainable recommendations with Self Love language. ABOS Assistance pillar.',
  'authenticated', 102
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'self-love-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 8. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_self_love_engine_card() to authenticated;
grant execute on function public.get_self_love_engine_dashboard() to authenticated;
grant execute on function public.update_organization_self_love_settings(jsonb) to authenticated;
grant execute on function public.update_user_self_love_preferences(jsonb) to authenticated;
grant execute on function public.acknowledge_self_love_recommendation(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 9. Seed settings + demo recommendations per org
-- ---------------------------------------------------------------------------
do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._sle_ensure_settings(v_org_id);
    perform public._sle_seed_recommendations(v_org_id);
  end loop;
end; $$;
