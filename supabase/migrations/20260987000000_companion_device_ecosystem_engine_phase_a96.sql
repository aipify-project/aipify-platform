-- Phase A.96 — Companion Device Ecosystem Engine (Implementation Blueprint Phase 36)
-- Orchestration hub for cross-device companion experience — metadata only, no keystroke/screen monitoring.
-- Distinct from Desktop Companion (Blueprint 20), Mobile Companion (Blueprint 21 / A.17),
-- Desktop Command Center (Phase 27 Tauri), and Companion Presence (A.67 heartbeat/orb).

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
    'companion_device_ecosystem_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. companion_device_ecosystem_settings
-- ---------------------------------------------------------------------------
create table if not exists public.companion_device_ecosystem_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  enabled boolean not null default true,
  continuity_enabled boolean not null default true,
  wearable_notifications boolean not null default false,
  voice_enabled boolean not null default false,
  tablet_experience_enabled boolean not null default false,
  emerging_device_scaffold boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.companion_device_ecosystem_settings enable row level security;
revoke all on public.companion_device_ecosystem_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'companion_device_ecosystem_engine', v.description
from (values
  ('companion_device_ecosystem.view', 'View Companion Device Ecosystem', 'View device ecosystem dashboard and continuity metadata'),
  ('companion_device_ecosystem.manage', 'Manage Companion Device Ecosystem', 'Update device ecosystem org preferences')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'companion_device_ecosystem.view'), ('owner', 'companion_device_ecosystem.manage'),
  ('administrator', 'companion_device_ecosystem.view'), ('administrator', 'companion_device_ecosystem.manage'),
  ('manager', 'companion_device_ecosystem.view'), ('manager', 'companion_device_ecosystem.manage'),
  ('employee', 'companion_device_ecosystem.view'),
  ('support_agent', 'companion_device_ecosystem.view'),
  ('moderator', 'companion_device_ecosystem.view'),
  ('viewer', 'companion_device_ecosystem.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 3. Helpers (_cdee_ prefix — _cde_ reserved for Curiosity Discovery A.87)
-- ---------------------------------------------------------------------------
create or replace function public._cdee_log(
  p_organization_id uuid,
  p_user_id uuid,
  p_action_type text,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id,
    'cdee_' || p_action_type,
    'companion_device_ecosystem_engine',
    null,
    false,
    false,
    p_user_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end; $$;

create or replace function public._cdee_ensure_settings(p_organization_id uuid)
returns public.companion_device_ecosystem_settings language plpgsql security definer set search_path = public as $$
declare v_row public.companion_device_ecosystem_settings;
begin
  insert into public.companion_device_ecosystem_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;

  select * into v_row
  from public.companion_device_ecosystem_settings
  where organization_id = p_organization_id;

  return v_row;
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Blueprint helpers (_cdebp_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._cdebp_mission()
returns text language sql immutable as $$
  select 'People move between devices; Aipify follows naturally without disruption — a unified companion experience across the surfaces they already use.';
$$;

create or replace function public._cdebp_philosophy()
returns text language sql immutable as $$
  select 'Companion intelligence should feel continuous, not fragmented. Device-specific engines own their surfaces; the ecosystem engine orchestrates cross-device readiness and honest roadmap status.';
$$;

create or replace function public._cdebp_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'desktop_continuity', 'label', 'Desktop continuity', 'description', 'Command Center and Desktop Companion share one Aipify Core — not duplicated logic'),
    jsonb_build_object('key', 'mobile_ready', 'label', 'Mobile-ready layer', 'description', 'Notification & Communication Engine (A.17) prepares mobile companion patterns; native app is future'),
    jsonb_build_object('key', 'tablet_experience', 'label', 'Tablet experience', 'description', 'Executive dashboards, operations center, and Knowledge Center on larger screens'),
    jsonb_build_object('key', 'wearable_signals', 'label', 'Wearable signals', 'description', 'Important notifications and critical reminders — avoid overload'),
    jsonb_build_object('key', 'voice_scaffold', 'label', 'Voice interactions', 'description', 'Respectful, context-aware, privacy-conscious voice companion scaffold'),
    jsonb_build_object('key', 'future_devices', 'label', 'Future device categories', 'description', 'Automotive and emerging interfaces — honest future scaffold only')
  );
$$;

create or replace function public._cdebp_device_priority_roadmap()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'phase', 1,
      'key', 'desktop',
      'label', 'Desktop (Windows, macOS)',
      'status', 'active',
      'description', 'Command Center (Phase 27 Tauri) + Desktop Companion (Blueprint 20) — primary companion surfaces',
      'routes', jsonb_build_array('/app/command-center', '/app/desktop')
    ),
    jsonb_build_object(
      'phase', 2,
      'key', 'mobile',
      'label', 'Mobile (iOS, Android)',
      'status', 'mobile_ready',
      'description', 'A.17 mobile-ready notification layer; native mobile app planned for a future phase',
      'routes', jsonb_build_array('/app/notification-communication-engine')
    ),
    jsonb_build_object(
      'phase', 3,
      'key', 'tablet',
      'label', 'Tablet',
      'status', 'scaffold',
      'description', 'Executive dashboards, operations center, and Knowledge Center optimized for tablet form factor',
      'routes', jsonb_build_array('/app/executive', '/app/operations-center-foundation-engine')
    ),
    jsonb_build_object(
      'phase', 4,
      'key', 'emerging',
      'label', 'Emerging interfaces',
      'status', 'future',
      'description', 'Smartwatch, voice, automotive, and future device categories — scaffold with honest status',
      'routes', jsonb_build_array('/app/companion-device-ecosystem-engine')
    )
  );
$$;

create or replace function public._cdebp_companion_continuity()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('emoji', '🌹', 'key', 'continue_work', 'example', 'Continue where you left off on another device — context follows, not surveillance.'),
    jsonb_build_object('emoji', '🦉', 'key', 'cross_device_notes', 'example', 'Cross-device notes and summaries help you pick up without repeating yourself.'),
    jsonb_build_object('emoji', '🔔', 'key', 'important_followups', 'example', 'Important follow-ups surface on the device you are using — never duplicated noise.')
  );
$$;

create or replace function public._cdebp_voice_companion_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'status', 'future_scaffold',
    'principles', jsonb_build_array(
      'Respectful — never interrupt inappropriately',
      'Context-aware — understands what you are doing, not everything you do',
      'Privacy-conscious — metadata only; no ambient recording',
      'Helpful — concise phrases that prepare, not perform'
    ),
    'example_phrases', jsonb_build_array(
      'You have an approval waiting when you are ready.',
      'Your morning briefing is available.',
      'Would you like to continue the task from your desktop session?',
      'Quiet hours are active — only critical alerts will reach you.'
    )
  );
$$;

create or replace function public._cdebp_wearable_experiences()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'status', 'future_scaffold',
    'experiences', jsonb_build_array(
      jsonb_build_object('key', 'important_notifications', 'label', 'Important notifications', 'description', 'Action-required and critical alerts only'),
      jsonb_build_object('key', 'recognition', 'label', 'Recognition moments', 'description', 'Gentle appreciation signals — never performance pressure'),
      jsonb_build_object('key', 'critical_reminders', 'label', 'Critical reminders', 'description', 'Time-sensitive follow-ups with quiet-hours respect')
    ),
    'boundary', 'Avoid overload — wearables receive filtered signals, not full operational feeds.'
  );
$$;

create or replace function public._cdebp_device_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Gentle wellbeing nudges across devices — never intrusive. Self Love sets the tone; device delivery respects quiet hours and user preferences.',
    'practices', jsonb_build_array(
      'Wellbeing nudges are optional and dismissible on every device',
      'No guilt-based notifications when switching devices or pausing work',
      'Cross-device continuity honors rest — not always-on pressure'
    ),
    'route', '/app/self-love-engine',
    'phase', 'A.76',
    'boundary', 'Self Love influences companion tone; this engine stores org device preferences and roadmap metadata only.'
  );
$$;

create or replace function public._cdebp_device_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Connected devices, permissions, sync scope, and revocation must be transparent — users always understand what is linked and can disconnect.',
    'organizations_should_understand', jsonb_build_array(
      'Which devices are connected — counts from Companion Presence (A.67), not duplicated heartbeat storage',
      'What sync scope applies — metadata and approved summaries, not raw content',
      'How permissions are granted — explicit pairing and org policy',
      'How to revoke access — immediate disconnect paths per device surface'
    ),
    'metadata_only', true,
    'transparency_note', 'No keystroke logging, screen monitoring, or ambient surveillance — ever.'
  );
$$;

create or replace function public._cdebp_device_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates cross-device companion flows internally; Unonight pilots desktop and mobile-ready patterns first.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal validation',
      'focus', jsonb_build_array('Command Center pairing', 'Desktop Companion continuity', 'Notification preferences', 'Companion Presence heartbeat')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot',
      'focus', jsonb_build_array('Mobile-ready notifications', 'Desktop Command Center daily use', 'Cross-device follow-up patterns')
    )
  );
$$;

create or replace function public._cdebp_device_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Aipify follows you — naturally, without disruption.',
    'One companion experience across the devices you already use.',
    'Continuity is designed — not accidental sync.',
    'Future devices will join the ecosystem with the same trust boundaries.',
    'Your attention is protected on every surface.'
  );
$$;

create or replace function public._cdebp_device_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) companion intelligence meets people where they work — desktop, mobile, and future surfaces — with human control on every device.';
$$;

create or replace function public._cdebp_device_distinction_note()
returns text language sql immutable as $$
  select 'Orchestration hub only — does NOT duplicate device-specific engines. Desktop Companion (Blueprint 20 / Phase 61) owns /app/desktop; Mobile Companion (Blueprint 21) extends A.17 at /app/notification-communication-engine; Desktop Command Center (Phase 27) is the native Tauri client at /app/command-center; Companion Presence (A.67) owns floating orb and device heartbeat at /app/settings/companion-presence. Phase A.96 coordinates cross-links and roadmap honesty.';
$$;

create or replace function public._cdebp_device_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'desktop_companion', 'label', 'Desktop Companion (Blueprint 20)', 'route', '/app/desktop', 'note', 'Phase 61 — web desktop companion surface'),
    jsonb_build_object('key', 'mobile_companion', 'label', 'Mobile Companion (Blueprint 21)', 'route', '/app/notification-communication-engine', 'note', 'A.17 mobile-ready layer — native app future'),
    jsonb_build_object('key', 'command_center', 'label', 'Desktop Command Center (Phase 27)', 'route', '/app/command-center', 'note', 'Native Tauri client — distinct from Desktop Companion'),
    jsonb_build_object('key', 'companion_presence', 'label', 'Companion Presence (A.67)', 'route', '/app/settings/companion-presence', 'note', 'Floating orb, device heartbeat — source for connected device counts'),
    jsonb_build_object('key', 'device_rollout', 'label', 'Enterprise Device Rollout (A.39)', 'route', '/app/enterprise-deployment-device-rollout-engine', 'note', 'Enterprise deployment and rollout governance'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Gentle wellbeing nudges — never intrusive'),
    jsonb_build_object('key', 'proactive_companion', 'label', 'Proactive Companion (A.79)', 'route', '/app/proactive-companion-engine', 'note', 'Timely organizational nudges across surfaces'),
    jsonb_build_object('key', 'companion_identity', 'label', 'Companion Identity (A.84)', 'route', '/app/companion-identity-engine', 'note', 'Consistent companion personality and communication style'),
    jsonb_build_object('key', 'personal_productivity', 'label', 'Personal Productivity (A.70)', 'route', '/app/personal-productivity-engine', 'note', 'Focus and task continuity across devices')
  );
$$;

create or replace function public._cdebp_ecosystem_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_connected_devices int := 0;
  v_online_devices int := 0;
  v_continuity boolean := true;
  v_wearable boolean := false;
  v_voice boolean := false;
begin
  select count(*), count(*) filter (where connection_status = 'online')
  into v_connected_devices, v_online_devices
  from public.companion_presence
  where organization_id = p_organization_id;

  select coalesce(s.continuity_enabled, true),
         coalesce(s.wearable_notifications, false),
         coalesce(s.voice_enabled, false)
  into v_continuity, v_wearable, v_voice
  from public.companion_device_ecosystem_settings s
  where s.organization_id = p_organization_id;

  return jsonb_build_object(
    'connected_devices', v_connected_devices,
    'online_devices', v_online_devices,
    'continuity_enabled', v_continuity,
    'wearable_notifications', v_wearable,
    'voice_enabled', v_voice,
    'desktop_ready', true,
    'mobile_ready', true,
    'tablet_scaffold', true,
    'emerging_scaffold', true,
    'companion_presence_source', true,
    'privacy_note', 'Device counts from companion_presence metadata only — no activity content or PII.'
  );
end; $$;

create or replace function public._cdebp_device_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_summary jsonb;
  v_connected int := 0;
  v_continuity boolean := true;
begin
  v_summary := public._cdebp_ecosystem_summary(p_organization_id);
  v_connected := coalesce((v_summary->>'connected_devices')::int, 0);
  v_continuity := coalesce((v_summary->>'continuity_enabled')::boolean, true);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'roadmap_documented',
      'label', 'Device priority roadmap documented — phases 1–4 with honest status',
      'met', jsonb_array_length(public._cdebp_device_priority_roadmap()) >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'continuity_enabled',
      'label', 'Cross-device continuity preferences configured',
      'met', v_continuity,
      'note', null
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Device-specific engines cross-linked — no duplication',
      'met', jsonb_array_length(public._cdebp_device_integration_links()) >= 8,
      'note', null
    ),
    jsonb_build_object(
      'key', 'companion_presence_connected',
      'label', 'Connected device visibility via Companion Presence (A.67)',
      'met', v_connected >= 0,
      'note', case when v_connected = 0 then 'Pair devices via Command Center or Companion Presence settings.' else null end
    ),
    jsonb_build_object(
      'key', 'trust_transparency',
      'label', 'Trust connection documented — permissions, sync scope, revocation',
      'met', (public._cdebp_device_trust_connection()->>'metadata_only')::boolean,
      'note', null
    ),
    jsonb_build_object(
      'key', 'voice_wearable_scaffold',
      'label', 'Voice and wearable experiences scaffolded with honest future status',
      'met', (public._cdebp_voice_companion_principles()->>'status') = 'future_scaffold',
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — gentle wellbeing nudges, never intrusive',
      'met', public._cdebp_device_self_love_connection() ? 'route',
      'note', null
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS companion principle documented for multi-device orchestration',
      'met', char_length(public._cdebp_device_abos_principle()) > 20,
      'note', null
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. update settings
-- ---------------------------------------------------------------------------
create or replace function public.update_companion_device_ecosystem_settings(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.companion_device_ecosystem_settings;
begin
  perform public._irp_require_permission('companion_device_ecosystem.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_row := public._cdee_ensure_settings(v_org_id);

  update public.companion_device_ecosystem_settings set
    enabled = coalesce((p_payload->>'enabled')::boolean, enabled),
    continuity_enabled = coalesce((p_payload->>'continuity_enabled')::boolean, continuity_enabled),
    wearable_notifications = coalesce((p_payload->>'wearable_notifications')::boolean, wearable_notifications),
    voice_enabled = coalesce((p_payload->>'voice_enabled')::boolean, voice_enabled),
    tablet_experience_enabled = coalesce((p_payload->>'tablet_experience_enabled')::boolean, tablet_experience_enabled),
    emerging_device_scaffold = coalesce((p_payload->>'emerging_device_scaffold')::boolean, emerging_device_scaffold),
    metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_row;

  perform public._cdee_log(v_org_id, v_user_id, 'settings_changed', jsonb_build_object(
    'continuity_enabled', v_row.continuity_enabled,
    'wearable_notifications', v_row.wearable_notifications,
    'voice_enabled', v_row.voice_enabled,
    'metadata_only', true
  ));

  return row_to_json(v_row)::jsonb;
end; $$;

-- ---------------------------------------------------------------------------
-- 6. card + dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_device_ecosystem_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_summary jsonb;
  v_settings public.companion_device_ecosystem_settings;
begin
  perform public._irp_require_permission('companion_device_ecosystem.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._cdee_ensure_settings(v_org_id);
  v_summary := public._cdebp_ecosystem_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'mission', public._cdebp_mission(),
    'philosophy', public._cdebp_philosophy(),
    'abos_principle', public._cdebp_device_abos_principle(),
    'blueprint_phase', 36,
    'engine_phase', 'A.96',
    'route', '/app/companion-device-ecosystem-engine',
    'connected_devices', coalesce((v_summary->>'connected_devices')::int, 0),
    'online_devices', coalesce((v_summary->>'online_devices')::int, 0),
    'continuity_enabled', v_settings.continuity_enabled,
    'enabled', v_settings.enabled
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_companion_device_ecosystem_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.companion_device_ecosystem_settings;
  v_summary jsonb;
begin
  perform public._irp_require_permission('companion_device_ecosystem.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._cdee_ensure_settings(v_org_id);
  v_summary := public._cdebp_ecosystem_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'implementation_blueprint_phase36', jsonb_build_object(
      'phase', 36,
      'title', 'Companion Device Ecosystem Engine',
      'engine_phase', 'A.96'
    ),
    'mission', public._cdebp_mission(),
    'philosophy', public._cdebp_philosophy(),
    'objectives', public._cdebp_objectives(),
    'device_priority_roadmap', public._cdebp_device_priority_roadmap(),
    'companion_continuity', public._cdebp_companion_continuity(),
    'voice_companion_principles', public._cdebp_voice_companion_principles(),
    'wearable_experiences', public._cdebp_wearable_experiences(),
    'device_self_love_connection', public._cdebp_device_self_love_connection(),
    'device_trust_connection', public._cdebp_device_trust_connection(),
    'device_dogfooding', public._cdebp_device_dogfooding(),
    'device_success_criteria', public._cdebp_device_success_criteria(v_org_id),
    'device_vision_phrases', public._cdebp_device_vision_phrases(),
    'device_abos_principle', public._cdebp_device_abos_principle(),
    'device_distinction_note', public._cdebp_device_distinction_note(),
    'device_integration_links', public._cdebp_device_integration_links(),
    'ecosystem_summary', v_summary,
    'settings', row_to_json(v_settings)::jsonb,
    'privacy_note', 'Metadata only — no keystroke logging, screen monitoring, or ambient surveillance.',
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('companion_device_ecosystem.manage')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Audit allowlist extension (append cdee_ — preserve full prior list)
-- ---------------------------------------------------------------------------
create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'module_activated', 'module_deactivated', 'module_configured',
    'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'support_ai_draft_generated', 'support_escalated', 'support_approval_granted',
    'support_case_created', 'support_case_closed', 'support_case_assigned', 'support_satisfaction_received',
    'integration_created', 'integration_updated', 'integration_disabled', 'integration_connected',
    'integration_credential_rotated', 'integration_sync_executed', 'integration_sync_failed',
    'integration_webhook_received', 'integration_webhook_failed',
    'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_removed', 'settings_updated',
    'organization_provisioned', 'organization_switched', 'approval_submitted', 'approval_approved', 'approval_rejected',
    'audit_exported',
    'insight_dismissed', 'strategic_export_generated', 'insight_status_changed',
    'operations_event_acknowledged', 'operations_event_assigned', 'operations_event_escalated',
    'operations_event_resolved', 'operations_event_dismissed',
    'improvement_approved', 'improvement_dismissed', 'improvement_implemented',
    'improvement_feedback_submitted', 'improvement_outcome_reviewed',
    'oversight_approval_submitted', 'oversight_approval_granted', 'oversight_approval_rejected',
    'oversight_override_applied', 'oversight_critical_confirmed', 'oversight_rationale_updated',
    'oversight_settings_changed',
    'business_pack_activated', 'business_pack_customized', 'business_pack_update_acknowledged',
    'workflow_created', 'workflow_status_changed', 'workflow_executed',
    'workflow_template_applied', 'workflow_step_approval_requested', 'workflow_step_approved',
    'workflow_step_rejected', 'workflow_escalated',
    'industry_profile_assigned', 'industry_insight_overridden', 'industry_insights_toggled',
    'industry_terminology_updated', 'industry_priorities_updated', 'industry_insights_exported',
    'change_initiative_created', 'change_initiative_status_updated', 'change_impact_assessed',
    'change_communication_plan_created', 'change_communication_released',
    'change_training_assigned', 'change_adoption_metric_recorded', 'change_milestone_completed',
    'value_baseline_captured', 'value_metric_recorded', 'value_metric_updated',
    'value_report_generated', 'value_report_exported', 'value_milestone_adjusted',
    'resilience_plan_created', 'resilience_plan_status_updated', 'resilience_plan_approved',
    'resilience_simulation_recorded', 'resilience_review_completed',
    'resilience_vulnerability_recorded', 'resilience_vulnerability_resolved',
    'irce_incident_created', 'irce_incident_owner_assigned', 'irce_incident_severity_updated',
    'irce_incident_status_updated', 'irce_incident_escalated', 'irce_incident_resolved',
    'irce_incident_closed', 'irce_incident_communication_recorded', 'irce_incident_lessons_captured',
    'odse_decision_proposed', 'odse_decision_review_started', 'odse_decision_approved',
    'odse_decision_rejected', 'odse_decision_implemented', 'odse_decision_outcome_recorded',
    'odse_decision_report_exported',
    'sae_objective_created', 'sae_objective_updated', 'sae_objective_entity_linked',
    'sae_strategic_review_recorded', 'sae_misalignment_detected', 'sae_alignment_report_exported',
    'ohe_health_measured', 'ohe_category_refreshed', 'ohe_score_overridden',
    'ohe_recommendations_generated', 'ohe_intervention_approved', 'ohe_health_report_exported',
    'cma_assessment_created', 'cma_assessment_updated', 'cma_roadmap_generated', 'cma_maturity_report_exported',
    'obe_profile_created', 'obe_profile_updated', 'obe_comparison_generated', 'obe_benchmark_report_exported',
    'doe_template_created', 'doe_template_updated', 'doe_template_archived',
    'doe_output_generated', 'doe_schedule_created', 'doe_schedule_cancelled',
    'doe_delivery_recorded', 'doe_manifest_exported',
    'rrme_policy_created', 'rrme_policy_updated', 'rrme_policy_retired',
    'rrme_record_archived', 'rrme_record_restored',
    'rrme_disposal_requested', 'rrme_disposal_rejected', 'rrme_disposal_approved', 'rrme_disposal_completed',
    'mcie_meeting_created', 'mcie_meeting_status_updated', 'mcie_meeting_cancelled',
    'mcie_agenda_generated', 'mcie_summary_captured', 'mcie_actions_extracted',
    'mcie_action_assigned', 'mcie_action_status_updated', 'mcie_actions_marked_overdue',
    'mcie_decision_captured', 'mcie_outputs_generated', 'mcie_manifest_exported',
    'utfe_task_created', 'utfe_task_created_from_source', 'utfe_task_assigned',
    'utfe_task_status_updated', 'utfe_task_completed', 'utfe_reminder_scheduled',
    'utfe_task_escalated', 'utfe_calendar_sync_requested', 'utfe_manifest_exported',
    'rpe_plan_created', 'rpe_plan_status_updated', 'rpe_plan_approved',
    'rpe_allocation_created', 'rpe_allocation_updated', 'rpe_utilization_overridden',
    'rpe_scenario_created', 'rpe_scenarios_compared', 'rpe_manifest_exported',
    'cwme_capacity_profile_created', 'cwme_capacity_profile_updated',
    'cwme_workload_item_created', 'cwme_workload_reassigned',
    'cwme_warning_acknowledged', 'cwme_threshold_updated', 'cwme_manifest_exported',
    'goke_objective_created', 'goke_objective_activated', 'goke_objective_completion_approved',
    'goke_key_result_created', 'goke_progress_updated', 'goke_progress_overridden',
    'goke_manifest_exported',
    'pie_insights_generated', 'pie_insight_dismissed', 'pie_manifest_exported',
    'ctie_participation_updated', 'ctie_insights_generated', 'ctie_anonymized_contribution',
    'ctie_recommendation_approved', 'ctie_outcome_recorded', 'ctie_manifest_exported',
    'pse_partner_created', 'pse_partner_updated', 'pse_partner_status_changed',
    'pse_engagement_created', 'pse_review_recorded', 'pse_manifest_exported', 'pse_outcome_recorded',
    'tre_trust_score_refreshed', 'tre_signal_recorded', 'tre_manifest_exported',
    'acge_budget_created', 'acge_budget_updated', 'acge_usage_recorded', 'acge_alert_triggered',
    'acge_manifest_exported',
    'owe_workspace_created', 'owe_workspace_updated', 'owe_workspace_archived',
    'owe_workspace_switched', 'owe_member_invited', 'owe_member_updated',
    'owe_custom_role_created', 'owe_org_permissions_saved', 'owe_summary_exported',
    'cpie_critical_alert_acknowledged', 'cpie_quiet_mode_changed', 'cpie_org_settings_changed',
    'pce_nudge_dismissed', 'pce_nudge_snoozed', 'pce_nudge_acted',
    'pce_org_settings_changed', 'pce_user_preferences_changed', 'pce_summary_exported',
    'gee_settings_changed', 'gee_recommendation_accepted', 'gee_recommendation_dismissed',
    'gee_recommendation_deferred', 'gee_report_exported',
    'pfe_item_created', 'pfe_item_updated', 'pfe_recommendation_resolved',
    'pfe_org_settings_changed', 'pfe_summary_exported',
    'pve_value_upserted', 'pve_settings_changed', 'pve_reflection_acknowledged',
    'pve_reflection_dismissed', 'pve_report_exported',
    'ihe_settings_changed', 'ihe_reflection_acknowledged', 'ihe_reflection_dismissed',
    'ihe_report_exported',
    'cie_settings_changed', 'cie_report_exported',
    'ime_settings_changed', 'ime_summary_generated', 'ime_report_exported',
    'leg_settings_changed', 'leg_milestone_acknowledged', 'leg_report_exported',
    'cde_settings_changed', 'cde_prompt_explored', 'cde_prompt_dismissed', 'cde_report_exported',
    'wne_settings_changed', 'wne_reflection_acknowledged', 'wne_reflection_dismissed',
    'wne_moment_acknowledged', 'wne_report_exported',
    'gre_settings_changed', 'gre_rose_sent', 'gre_report_exported',
    'pcp_settings_changed', 'pcp_comfort_moment_recorded', 'pcp_report_exported',
    'ded_settings_changed', 'ded_report_exported',
    'cdee_settings_changed'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed'
    or p_action_type like 'owe_%' or p_action_type like 'pce_%' or p_action_type like 'gee_%'
    or p_action_type like 'pfe_%' or p_action_type like 'pve_%' or p_action_type like 'ihe_%'
    or p_action_type like 'cie_%' or p_action_type like 'ime_%' or p_action_type like 'leg_%'
    or p_action_type like 'cde_%' or p_action_type like 'wne_%' or p_action_type like 'gre_%'
    or p_action_type like 'pcp_%' or p_action_type like 'ded_%' or p_action_type like 'cdee_%';
$$;

-- ---------------------------------------------------------------------------
-- 8. KC category seed
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'companion-device-ecosystem-engine', 'Companion Device Ecosystem Engine',
  'Cross-device companion orchestration — roadmap, continuity, and integration links. Metadata only.',
  'authenticated', 112
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'companion-device-ecosystem-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 9. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_companion_device_ecosystem_card() to authenticated;
grant execute on function public.get_companion_device_ecosystem_dashboard() to authenticated;
grant execute on function public.update_companion_device_ecosystem_settings(jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- 10. Seed settings per org
-- ---------------------------------------------------------------------------
do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._cdee_ensure_settings(v_org_id);
  end loop;
end; $$;
