-- Phase A.86 — Legacy Engine (ABOS)
-- Preserve, celebrate, and pass forward organizational wisdom — storytelling and milestone recognition.
-- Distinct from Organizational Memory A.34, OME Phase 50, and Impact Engine A.85 (integrates).

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
    'legacy_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_legacy_engine_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_legacy_engine_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  enabled boolean not null default true,
  celebrate_milestones boolean not null default true,
  preserve_stories boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_legacy_engine_settings enable row level security;
revoke all on public.organization_legacy_engine_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_legacy_stories
-- ---------------------------------------------------------------------------
create table if not exists public.organization_legacy_stories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  dimension text not null check (
    dimension in ('knowledge', 'people', 'customer', 'innovation')
  ),
  title text not null check (char_length(title) <= 200),
  summary text not null check (char_length(summary) <= 1000),
  timeline_ref text check (char_length(timeline_ref) <= 200),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_legacy_stories_org_dim_idx
  on public.organization_legacy_stories (organization_id, dimension, created_at desc);

alter table public.organization_legacy_stories enable row level security;
revoke all on public.organization_legacy_stories from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_legacy_milestones
-- ---------------------------------------------------------------------------
create table if not exists public.organization_legacy_milestones (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  milestone_key text not null,
  summary text not null check (char_length(summary) <= 500),
  achieved_at timestamptz not null default now(),
  celebrated boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_legacy_milestones_org_idx
  on public.organization_legacy_milestones (organization_id, achieved_at desc);

alter table public.organization_legacy_milestones enable row level security;
revoke all on public.organization_legacy_milestones from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'legacy_engine', v.description
from (values
  ('legacy_engine.view', 'View Legacy Engine', 'View legacy dashboard and organizational stories'),
  ('legacy_engine.manage', 'Manage Legacy Engine', 'Update legacy settings and story preferences'),
  ('legacy_engine.export', 'Export Legacy Engine', 'Export legacy stories and milestone summaries'),
  ('legacy_engine.milestones.acknowledge', 'Acknowledge Legacy Milestones', 'Celebrate and acknowledge organizational milestones')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'legacy_engine.view'), ('owner', 'legacy_engine.manage'),
  ('owner', 'legacy_engine.export'), ('owner', 'legacy_engine.milestones.acknowledge'),
  ('administrator', 'legacy_engine.view'), ('administrator', 'legacy_engine.manage'),
  ('administrator', 'legacy_engine.export'), ('administrator', 'legacy_engine.milestones.acknowledge'),
  ('manager', 'legacy_engine.view'), ('manager', 'legacy_engine.manage'),
  ('manager', 'legacy_engine.export'), ('manager', 'legacy_engine.milestones.acknowledge'),
  ('employee', 'legacy_engine.view'), ('employee', 'legacy_engine.export'),
  ('support_agent', 'legacy_engine.view'),
  ('moderator', 'legacy_engine.view'),
  ('viewer', 'legacy_engine.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 5. Helpers (_leg_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._leg_log(
  p_organization_id uuid,
  p_user_id uuid,
  p_action_type text,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id,
    'leg_' || p_action_type,
    'legacy_engine',
    null,
    false,
    false,
    p_user_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end; $$;

create or replace function public._leg_ensure_settings(p_organization_id uuid)
returns public.organization_legacy_engine_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_legacy_engine_settings;
begin
  insert into public.organization_legacy_engine_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;

  select * into v_row
  from public.organization_legacy_engine_settings
  where organization_id = p_organization_id;

  return v_row;
end; $$;

create or replace function public._leg_legacy_dimensions()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'knowledge',
      'label', 'Knowledge legacy',
      'bullets', jsonb_build_array(
        'Processes evolved and lessons captured for future teams',
        'Knowledge Center origins and articles that changed how work gets done',
        'Approved learning that improved quality over time'
      )
    ),
    jsonb_build_object(
      'key', 'people',
      'label', 'People legacy',
      'bullets', jsonb_build_array(
        'Teams who built sustainable rhythms and supported each other',
        'Leaders who modeled curiosity, humility, and human-centered decisions',
        'Collaboration patterns worth passing to new employees'
      )
    ),
    jsonb_build_object(
      'key', 'customer',
      'label', 'Customer legacy',
      'bullets', jsonb_build_array(
        'Customer feedback that improved products and support quality',
        'Relationships strengthened through honest, helpful communication',
        'Support improvements that customers still benefit from today'
      )
    ),
    jsonb_build_object(
      'key', 'innovation',
      'label', 'Innovation legacy',
      'bullets', jsonb_build_array(
        'Experiments that led to better ways of working',
        'Innovations adopted because they solved real problems',
        'Bold questions that opened new possibilities'
      )
    )
  );
$$;

create or replace function public._leg_storytelling_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'process_evolution',
      'label', 'Process evolution',
      'example', 'How our support triage evolved — from reactive queues to clearer ownership and faster first responses.'
    ),
    jsonb_build_object(
      'key', 'kc_origin',
      'label', 'Knowledge Center origin',
      'example', 'Why we built the Knowledge Center — repeat questions became articles that help customers and teams today.'
    ),
    jsonb_build_object(
      'key', 'customer_feedback',
      'label', 'Customer feedback improvement',
      'example', 'Customer feedback led to clearer communication templates — fewer repeat contacts, better experience.'
    )
  );
$$;

create or replace function public._leg_milestone_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'one_year_improvement', 'bell_text', 'One year of meaningful improvement — worth remembering why it mattered.'),
    jsonb_build_object('key', 'ten_k_interactions', 'bell_text', '10,000 thoughtful interactions — a quiet bell for sustained care.'),
    jsonb_build_object('key', 'knowledge_doubled', 'bell_text', 'Knowledge doubled — future teams inherit what we learned.'),
    jsonb_build_object('key', 'goal_achieved', 'bell_text', 'Goal achieved — pause to recognize progress, challenges, and gratitude.')
  );
$$;

create or replace function public._leg_trust_note()
returns text language sql immutable as $$
  select 'Legacy stories are truthful and authentic — no exaggeration or manufactured nostalgia. Metadata only; no raw customer conversations, emails, or PII. Impact Engine A.85 measures what changed; Legacy Engine remembers why it mattered.';
$$;

create or replace function public._leg_self_love_note()
returns text language sql immutable as $$
  select 'Self Love: pause to recognize progress, challenges, lessons, and gratitude. Celebrating milestones honors human effort — not output-only pressure.';
$$;

create or replace function public._leg_seed_stories(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organization_legacy_stories
    where organization_id = p_organization_id
    limit 1
  ) then
    return;
  end if;

  insert into public.organization_legacy_stories (
    organization_id, dimension, title, summary, timeline_ref, metadata
  ) values
    (p_organization_id, 'knowledge', 'Knowledge Center origins',
     'Repeat support questions became approved articles — self-service improved and teams gained time for harder problems.',
     'Year one adoption',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'people', 'Sustainable support rhythms',
     'Teams established clearer handoffs and recovery-friendly schedules — progress without burnout.',
     'Operational maturity',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'customer', 'Feedback-driven communication',
     'Customer feedback shaped clearer response templates — fewer repeat contacts, more trust.',
     'Customer experience milestone',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'innovation', 'Experiment that stuck',
     'A small workflow experiment became standard practice because it reduced friction for everyone.',
     'Innovation adoption',
     '{"seed": true, "metadata_only": true}'::jsonb);
end; $$;

create or replace function public._leg_seed_milestones(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organization_legacy_milestones
    where organization_id = p_organization_id
    limit 1
  ) then
    return;
  end if;

  insert into public.organization_legacy_milestones (
    organization_id, milestone_key, summary, achieved_at, celebrated, metadata
  ) values
    (p_organization_id, 'one_year_improvement',
     'One year of sustained operational improvement — meaningful progress worth remembering.',
     now() - interval '30 days', false,
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'knowledge_doubled',
     'Approved knowledge articles doubled — future teams inherit clearer guidance.',
     now() - interval '14 days', false,
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'goal_achieved',
     'Strategic goal achieved — pause to recognize progress, challenges, and gratitude.',
     now() - interval '7 days', true,
     '{"seed": true, "metadata_only": true, "celebrated": true}'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. update settings
-- ---------------------------------------------------------------------------
create or replace function public.update_legacy_engine_settings(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_legacy_engine_settings;
begin
  perform public._irp_require_permission('legacy_engine.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_row := public._leg_ensure_settings(v_org_id);

  update public.organization_legacy_engine_settings set
    enabled = coalesce((p_payload->>'enabled')::boolean, enabled),
    celebrate_milestones = coalesce((p_payload->>'celebrate_milestones')::boolean, celebrate_milestones),
    preserve_stories = coalesce((p_payload->>'preserve_stories')::boolean, preserve_stories),
    metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_row;

  perform public._leg_log(v_org_id, v_user_id, 'settings_changed', jsonb_build_object(
    'enabled', v_row.enabled,
    'celebrate_milestones', v_row.celebrate_milestones,
    'metadata_only', true
  ));

  return row_to_json(v_row)::jsonb;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. acknowledge milestone
-- ---------------------------------------------------------------------------
create or replace function public.acknowledge_legacy_milestone(p_milestone_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_legacy_milestones;
begin
  perform public._irp_require_permission('legacy_engine.milestones.acknowledge');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.organization_legacy_milestones set
    celebrated = true,
    updated_at = now()
  where id = p_milestone_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Milestone not found';
  end if;

  perform public._leg_log(v_org_id, v_user_id, 'milestone_acknowledged', jsonb_build_object(
    'milestone_id', v_row.id,
    'milestone_key', v_row.milestone_key,
    'metadata_only', true
  ));

  return jsonb_build_object(
    'success', true,
    'milestone_id', v_row.id,
    'milestone_key', v_row.milestone_key,
    'celebrated', v_row.celebrated
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. card + dashboard + export
-- ---------------------------------------------------------------------------
create or replace function public.get_legacy_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_stories int := 0;
  v_milestones int := 0;
  v_uncelebrated int := 0;
begin
  perform public._irp_require_permission('legacy_engine.view');
  v_org_id := public._mta_require_organization();
  perform public._leg_ensure_settings(v_org_id);
  perform public._leg_seed_stories(v_org_id);
  perform public._leg_seed_milestones(v_org_id);

  select count(*) into v_stories
  from public.organization_legacy_stories where organization_id = v_org_id;

  select count(*) into v_milestones
  from public.organization_legacy_milestones where organization_id = v_org_id;

  select count(*) into v_uncelebrated
  from public.organization_legacy_milestones
  where organization_id = v_org_id and celebrated = false;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Organizations are stories — preserve wisdom for future employees, customers, and leaders.',
    'story_count', v_stories,
    'milestone_count', v_milestones,
    'uncelebrated_milestones', v_uncelebrated,
    'enabled', (select enabled from public.organization_legacy_engine_settings where organization_id = v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_legacy_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_legacy_engine_settings;
begin
  perform public._irp_require_permission('legacy_engine.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._leg_ensure_settings(v_org_id);
  perform public._leg_seed_stories(v_org_id);
  perform public._leg_seed_milestones(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Organizations are stories — lessons, challenges, innovations, and support form legacy.',
    'mission', 'Protect organizational wisdom for future employees, customers, and leaders.',
    'abos_principle', 'Remembering why progress mattered.',
    'vision', 'We built something meaningful.',
    'distinction_note',
      'Distinct from Organizational Memory A.34 (/app/organizational-memory-engine), OME Phase 50 (/app/memory), and Impact Engine A.85 (/app/impact-engine). Legacy = storytelling, milestone recognition, wisdom preservation.',
    'legacy_dimensions', public._leg_legacy_dimensions(),
    'storytelling_examples', public._leg_storytelling_examples(),
    'milestone_examples', public._leg_milestone_examples(),
    'self_love_note', public._leg_self_love_note(),
    'trust_note', public._leg_trust_note(),
    'settings', row_to_json(v_settings)::jsonb,
    'recent_stories', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'dimension', s.dimension,
          'title', s.title,
          'summary', s.summary,
          'timeline_ref', s.timeline_ref,
          'metadata', s.metadata,
          'created_at', s.created_at,
          'updated_at', s.updated_at
        ) order by s.created_at desc
      )
      from (
        select * from public.organization_legacy_stories
        where organization_id = v_org_id
        order by created_at desc
        limit 15
      ) s
    ), '[]'::jsonb),
    'recent_milestones', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', m.id,
          'milestone_key', m.milestone_key,
          'summary', m.summary,
          'achieved_at', m.achieved_at,
          'celebrated', m.celebrated,
          'metadata', m.metadata,
          'created_at', m.created_at,
          'updated_at', m.updated_at
        ) order by m.achieved_at desc
      )
      from (
        select * from public.organization_legacy_milestones
        where organization_id = v_org_id
        order by achieved_at desc
        limit 15
      ) m
    ), '[]'::jsonb),
    'summary', jsonb_build_object(
      'story_count', coalesce((
        select count(*) from public.organization_legacy_stories where organization_id = v_org_id
      ), 0),
      'stories_by_dimension', coalesce((
        select jsonb_object_agg(dimension, cnt)
        from (
          select dimension, count(*) as cnt
          from public.organization_legacy_stories
          where organization_id = v_org_id
          group by dimension
        ) d
      ), '{}'::jsonb),
      'milestone_count', coalesce((
        select count(*) from public.organization_legacy_milestones where organization_id = v_org_id
      ), 0),
      'uncelebrated_milestones', coalesce((
        select count(*) from public.organization_legacy_milestones
        where organization_id = v_org_id and celebrated = false
      ), 0),
      'celebrate_milestones', v_settings.celebrate_milestones,
      'preserve_stories', v_settings.preserve_stories
    ),
    'integration_links', jsonb_build_object(
      'impact_engine', '/app/impact-engine',
      'organizational_memory', '/app/organizational-memory-engine',
      'organizational_memory_timeline', '/app/memory',
      'purpose_values', '/app/purpose-values-engine',
      'growth_evolution', '/app/growth-evolution-engine'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('legacy_engine.manage'),
      'can_export', public._irp_has_permission('legacy_engine.export'),
      'can_acknowledge_milestones', public._irp_has_permission('legacy_engine.milestones.acknowledge')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.export_legacy_engine_report(p_format text default 'json')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_legacy_engine_settings;
begin
  perform public._irp_require_permission('legacy_engine.export');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._leg_ensure_settings(v_org_id);
  perform public._leg_seed_stories(v_org_id);
  perform public._leg_seed_milestones(v_org_id);

  perform public._leg_log(v_org_id, v_user_id, 'report_exported', jsonb_build_object(
    'format', coalesce(p_format, 'json'),
    'metadata_only', true
  ));

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'legacy_engine',
    'format', coalesce(p_format, 'json'),
    'philosophy', 'Organizations are stories — preserve wisdom for future employees, customers, and leaders.',
    'mission', 'Protect organizational wisdom for future employees, customers, and leaders.',
    'abos_principle', 'Remembering why progress mattered.',
    'vision', 'We built something meaningful.',
    'legacy_dimensions', public._leg_legacy_dimensions(),
    'storytelling_examples', public._leg_storytelling_examples(),
    'milestone_examples', public._leg_milestone_examples(),
    'trust_note', public._leg_trust_note(),
    'self_love_note', public._leg_self_love_note(),
    'settings', row_to_json(v_settings)::jsonb,
    'recent_stories', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'dimension', s.dimension,
          'title', s.title,
          'summary', s.summary,
          'timeline_ref', s.timeline_ref,
          'created_at', s.created_at
        ) order by s.created_at desc
      )
      from public.organization_legacy_stories s
      where s.organization_id = v_org_id
      order by s.created_at desc
      limit 50
    ), '[]'::jsonb),
    'recent_milestones', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', m.id,
          'milestone_key', m.milestone_key,
          'summary', m.summary,
          'achieved_at', m.achieved_at,
          'celebrated', m.celebrated
        ) order by m.achieved_at desc
      )
      from public.organization_legacy_milestones m
      where m.organization_id = v_org_id
      order by m.achieved_at desc
      limit 50
    ), '[]'::jsonb),
    'summary', jsonb_build_object(
      'story_count', coalesce((
        select count(*) from public.organization_legacy_stories where organization_id = v_org_id
      ), 0),
      'milestone_count', coalesce((
        select count(*) from public.organization_legacy_milestones where organization_id = v_org_id
      ), 0)
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('legacy_engine.manage'),
      'can_export', true,
      'can_acknowledge_milestones', public._irp_has_permission('legacy_engine.milestones.acknowledge')
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Audit allowlist extension
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
    'leg_settings_changed', 'leg_milestone_acknowledged', 'leg_report_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed'
    or p_action_type like 'owe_%' or p_action_type like 'pce_%' or p_action_type like 'gee_%'
    or p_action_type like 'pfe_%' or p_action_type like 'pve_%' or p_action_type like 'ihe_%'
    or p_action_type like 'cie_%' or p_action_type like 'ime_%' or p_action_type like 'leg_%';
$$;

-- ---------------------------------------------------------------------------
-- 10. KC category seed
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'legacy-engine', 'Legacy Engine',
  'Preserve, celebrate, and pass forward organizational wisdom — storytelling, milestone recognition, and authentic reflection.',
  'authenticated', 108
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'legacy-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 11. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_legacy_engine_card() to authenticated;
grant execute on function public.get_legacy_engine_dashboard() to authenticated;
grant execute on function public.update_legacy_engine_settings(jsonb) to authenticated;
grant execute on function public.acknowledge_legacy_milestone(uuid) to authenticated;
grant execute on function public.export_legacy_engine_report(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 12. Seed settings + sample data per org
-- ---------------------------------------------------------------------------
do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._leg_ensure_settings(v_org_id);
    perform public._leg_seed_stories(v_org_id);
    perform public._leg_seed_milestones(v_org_id);
  end loop;
end; $$;
