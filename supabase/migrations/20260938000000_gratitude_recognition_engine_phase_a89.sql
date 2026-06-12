-- Phase A.89 — Gratitude & Recognition Engine (ABOS)
-- Peer appreciation, digital rose gestures, gratitude moments — boundary-safe warmth.
-- Distinct from Human Success Phase 82, Wonder Engine A.88, Legacy A.86, Humor & Personal Connection, RSI A.78.

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
    'gratitude_recognition_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_gratitude_recognition_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_gratitude_recognition_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  enabled boolean not null default true,
  digital_rose_enabled boolean not null default true,
  gratitude_moments_enabled boolean not null default true,
  redirect_romantic_language boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_gratitude_recognition_settings enable row level security;
revoke all on public.organization_gratitude_recognition_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_gratitude_moments (metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_gratitude_moments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  moment_type text not null check (
    moment_type in (
      'exceptional_support', 'milestone', 'customer_appreciation',
      'consistent_helper', 'above_and_beyond'
    )
  ),
  summary text not null check (char_length(summary) <= 500),
  recognition_target_role text not null default 'colleague' check (
    recognition_target_role in ('colleague', 'team', 'customer', 'self')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'acknowledged', 'celebrated', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_gratitude_moments_org_idx
  on public.organization_gratitude_moments (organization_id, moment_type, created_at desc);

alter table public.organization_gratitude_moments enable row level security;
revoke all on public.organization_gratitude_moments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_digital_rose_recognitions (metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_digital_rose_recognitions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  sender_user_id uuid not null,
  recipient_display_label text not null check (char_length(recipient_display_label) <= 120),
  message_summary text not null check (char_length(message_summary) <= 500),
  rose_sent_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists organization_digital_rose_recognitions_org_idx
  on public.organization_digital_rose_recognitions (organization_id, rose_sent_at desc);

alter table public.organization_digital_rose_recognitions enable row level security;
revoke all on public.organization_digital_rose_recognitions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'gratitude_recognition_engine', v.description
from (values
  ('gratitude_recognition.view', 'View Gratitude & Recognition', 'View gratitude dashboard and moments'),
  ('gratitude_recognition.manage', 'Manage Gratitude & Recognition', 'Update gratitude settings and acknowledge moments'),
  ('gratitude_recognition.rose.send', 'Send Digital Rose', 'Send digital recognition roses to colleagues'),
  ('gratitude_recognition.export', 'Export Gratitude & Recognition', 'Export gratitude and recognition reports')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'gratitude_recognition.view'), ('owner', 'gratitude_recognition.manage'),
  ('owner', 'gratitude_recognition.rose.send'), ('owner', 'gratitude_recognition.export'),
  ('administrator', 'gratitude_recognition.view'), ('administrator', 'gratitude_recognition.manage'),
  ('administrator', 'gratitude_recognition.rose.send'), ('administrator', 'gratitude_recognition.export'),
  ('manager', 'gratitude_recognition.view'), ('manager', 'gratitude_recognition.manage'),
  ('manager', 'gratitude_recognition.rose.send'), ('manager', 'gratitude_recognition.export'),
  ('employee', 'gratitude_recognition.view'), ('employee', 'gratitude_recognition.rose.send'),
  ('support_agent', 'gratitude_recognition.view'), ('support_agent', 'gratitude_recognition.rose.send'),
  ('moderator', 'gratitude_recognition.view'),
  ('viewer', 'gratitude_recognition.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 5. Helpers (_gre_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._gre_log(
  p_organization_id uuid,
  p_user_id uuid,
  p_action_type text,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id,
    'gre_' || p_action_type,
    'gratitude_recognition_engine',
    null,
    false,
    false,
    p_user_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end; $$;

create or replace function public._gre_ensure_settings(p_organization_id uuid)
returns public.organization_gratitude_recognition_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_gratitude_recognition_settings;
begin
  insert into public.organization_gratitude_recognition_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;

  select * into v_row
  from public.organization_gratitude_recognition_settings
  where organization_id = p_organization_id;

  return v_row;
end; $$;

create or replace function public._gre_gratitude_moment_types()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'exceptional_support',
      'label', 'Exceptional support',
      'description', 'Someone went above expectations to help a colleague or customer.'
    ),
    jsonb_build_object(
      'key', 'milestone',
      'label', 'Milestone',
      'description', 'A meaningful achievement or progress worth celebrating together.'
    ),
    jsonb_build_object(
      'key', 'customer_appreciation',
      'label', 'Customer appreciation',
      'description', 'Positive customer feedback or gratitude toward the team.'
    ),
    jsonb_build_object(
      'key', 'consistent_helper',
      'label', 'Consistent helper',
      'description', 'Reliable, steady support that makes everyday work easier.'
    ),
    jsonb_build_object(
      'key', 'above_and_beyond',
      'label', 'Above and beyond',
      'description', 'Extra effort that strengthened the team or organization.'
    )
  );
$$;

create or replace function public._gre_red_rose_moment()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'trigger_phrase', 'I love you Aipify',
    'example_exchange', jsonb_build_array(
      jsonb_build_object('role', 'user', 'text', 'I love you Aipify'),
      jsonb_build_object(
        'role', 'aipify',
        'text',
        'I appreciate being able to support you. That warmth matters — and the people around you deserve it too. Would you like to send a Digital Recognition Rose to someone who helped you today?'
      )
    ),
    'feature_description',
      'The Red Rose Moment is symbolic appreciation — not romance. When someone expresses affection toward Aipify, respond with warm trust language and gently redirect gratitude toward recognizing colleagues, teams, or customers.',
    'digital_rose_symbol',
      'A Digital Recognition Rose (🌹) signals that someone noticed effort or kindness — appreciation in everyday work, not romantic intent.'
  );
$$;

create or replace function public._gre_boundary_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'avoid', jsonb_build_array(
      'I love you too',
      'Romantic or intimate reciprocation',
      'Flirtatious or dating language',
      'Implying a personal relationship with Aipify',
      'Encouraging romantic gestures between colleagues'
    ),
    'prefer', jsonb_build_array(
      'I appreciate being able to support you',
      'That warmth matters — recognition strengthens people',
      'Would you like to recognize someone who helped you?',
      'A Digital Recognition Rose is appreciation, not romance',
      'Small gestures create lasting memories in everyday work'
    )
  );
$$;

create or replace function public._gre_self_love_note()
returns text language sql immutable as $$
  select 'Self Love includes self-recognition, team appreciation, celebrating progress, and acknowledging perseverance — gratitude starts with noticing effort, including your own.';
$$;

create or replace function public._gre_trust_note()
returns text language sql immutable as $$
  select 'Metadata only — no raw messages, emails, or PII. Rose recognitions store display labels and approved summaries (max 500 chars), never full conversation content.';
$$;

create or replace function public._gre_seed_moments(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organization_gratitude_moments
    where organization_id = p_organization_id
    limit 1
  ) then
    return;
  end if;

  insert into public.organization_gratitude_moments (
    organization_id, moment_type, summary, recognition_target_role, status, metadata
  ) values
    (p_organization_id, 'exceptional_support',
     'Colleague resolved a complex support case with patience — exceptional support noted.',
     'colleague', 'pending', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'milestone',
     'Team completed a major onboarding milestone — progress worth celebrating.',
     'team', 'pending', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'customer_appreciation',
     'Customer expressed gratitude for clear, timely assistance — appreciation recorded.',
     'customer', 'acknowledged', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'consistent_helper',
     'Consistent helper kept handoffs smooth across the week — reliability recognized.',
     'colleague', 'pending', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'above_and_beyond',
     'Above-and-beyond effort during a busy period strengthened team morale.',
     'team', 'celebrated', '{"seed": true, "metadata_only": true}'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. update settings
-- ---------------------------------------------------------------------------
create or replace function public.update_gratitude_recognition_settings(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_gratitude_recognition_settings;
begin
  perform public._irp_require_permission('gratitude_recognition.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_row := public._gre_ensure_settings(v_org_id);

  update public.organization_gratitude_recognition_settings set
    enabled = coalesce((p_payload->>'enabled')::boolean, enabled),
    digital_rose_enabled = coalesce(
      (p_payload->>'digital_rose_enabled')::boolean, digital_rose_enabled
    ),
    gratitude_moments_enabled = coalesce(
      (p_payload->>'gratitude_moments_enabled')::boolean, gratitude_moments_enabled
    ),
    redirect_romantic_language = coalesce(
      (p_payload->>'redirect_romantic_language')::boolean, redirect_romantic_language
    ),
    metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_row;

  perform public._gre_log(v_org_id, v_user_id, 'settings_changed', jsonb_build_object(
    'enabled', v_row.enabled,
    'digital_rose_enabled', v_row.digital_rose_enabled,
    'metadata_only', true
  ));

  return row_to_json(v_row)::jsonb;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. send_digital_rose_recognition
-- ---------------------------------------------------------------------------
create or replace function public.send_digital_rose_recognition(
  p_recipient_label text,
  p_message_summary text
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_gratitude_recognition_settings;
  v_label text;
  v_summary text;
  v_rose_id uuid;
begin
  perform public._irp_require_permission('gratitude_recognition.rose.send');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._gre_ensure_settings(v_org_id);

  if not v_settings.enabled or not v_settings.digital_rose_enabled then
    raise exception 'Digital rose recognitions are disabled for this organization';
  end if;

  v_label := nullif(trim(p_recipient_label), '');
  v_summary := nullif(trim(p_message_summary), '');

  if v_label is null then
    raise exception 'Recipient display label is required';
  end if;
  if v_summary is null then
    raise exception 'Message summary is required';
  end if;
  if char_length(v_label) > 120 then
    raise exception 'Recipient display label exceeds 120 characters';
  end if;
  if char_length(v_summary) > 500 then
    raise exception 'Message summary exceeds 500 characters';
  end if;

  insert into public.organization_digital_rose_recognitions (
    organization_id, sender_user_id, recipient_display_label, message_summary, metadata
  ) values (
    v_org_id, v_user_id, v_label, v_summary,
    jsonb_build_object('metadata_only', true, 'rose_type', 'digital_recognition')
  )
  returning id into v_rose_id;

  perform public._gre_log(v_org_id, v_user_id, 'rose_sent', jsonb_build_object(
    'rose_id', v_rose_id,
    'recipient_label_length', char_length(v_label),
    'summary_length', char_length(v_summary),
    'metadata_only', true
  ));

  return jsonb_build_object(
    'success', true,
    'rose_id', v_rose_id,
    'recipient_display_label', v_label,
    'message_summary', v_summary,
    'rose_sent_at', now()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. card + dashboard + export
-- ---------------------------------------------------------------------------
create or replace function public.get_gratitude_recognition_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_moments int := 0;
  v_roses int := 0;
  v_pending int := 0;
begin
  perform public._irp_require_permission('gratitude_recognition.view');
  v_org_id := public._mta_require_organization();
  perform public._gre_ensure_settings(v_org_id);
  perform public._gre_seed_moments(v_org_id);

  select count(*) into v_moments
  from public.organization_gratitude_moments where organization_id = v_org_id;

  select count(*) into v_roses
  from public.organization_digital_rose_recognitions where organization_id = v_org_id;

  select count(*) into v_pending
  from public.organization_gratitude_moments
  where organization_id = v_org_id and status = 'pending';

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Sincere, human recognition strengthens relationships — help people express appreciation.',
    'moment_count', v_moments,
    'rose_count', v_roses,
    'pending_moments', v_pending,
    'enabled', (select enabled from public.organization_gratitude_recognition_settings where organization_id = v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_gratitude_recognition_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_gratitude_recognition_settings;
begin
  perform public._irp_require_permission('gratitude_recognition.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._gre_ensure_settings(v_org_id);
  perform public._gre_seed_moments(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy',
      'Sincere, human recognition strengthens relationships — help people express appreciation in everyday work.',
    'mission',
      'Cultures where appreciation, gratitude, and recognition are natural in everyday work.',
    'abos_principle',
      'Recognition strengthens people — small gestures create lasting memories.',
    'vision',
      'Digital rose as symbol someone noticed effort or kindness — technology strengthens human connection.',
    'distinction_note',
      'Distinct from Human Success Phase 82 (/app/human-success), Wonder Engine A.88, Legacy A.86, Humor & Personal Connection (/app/personality), and Relationship Intelligence A.78/RSI. Gratitude & Recognition = peer appreciation, digital rose gestures, gratitude moments, boundary-safe warmth.',
    'gratitude_moment_types', public._gre_gratitude_moment_types(),
    'red_rose_moment', public._gre_red_rose_moment(),
    'boundary_phrases', public._gre_boundary_phrases(),
    'self_love_note', public._gre_self_love_note(),
    'trust_note', public._gre_trust_note(),
    'settings', row_to_json(v_settings)::jsonb,
    'recent_moments', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', m.id,
          'moment_type', m.moment_type,
          'summary', m.summary,
          'recognition_target_role', m.recognition_target_role,
          'status', m.status,
          'metadata', m.metadata,
          'created_at', m.created_at,
          'updated_at', m.updated_at
        ) order by m.created_at desc
      )
      from (
        select * from public.organization_gratitude_moments
        where organization_id = v_org_id
        order by created_at desc
        limit 15
      ) m
    ), '[]'::jsonb),
    'recent_roses', jsonb_build_object(
      'count', coalesce((
        select count(*) from public.organization_digital_rose_recognitions
        where organization_id = v_org_id
      ), 0),
      'last_sent_at', (
        select max(rose_sent_at) from public.organization_digital_rose_recognitions
        where organization_id = v_org_id
      )
    ),
    'summary', jsonb_build_object(
      'moment_count', coalesce((
        select count(*) from public.organization_gratitude_moments where organization_id = v_org_id
      ), 0),
      'moments_by_type', coalesce((
        select jsonb_object_agg(moment_type, cnt)
        from (
          select moment_type, count(*) as cnt
          from public.organization_gratitude_moments
          where organization_id = v_org_id
          group by moment_type
        ) t
      ), '{}'::jsonb),
      'moments_by_status', coalesce((
        select jsonb_object_agg(status, cnt)
        from (
          select status, count(*) as cnt
          from public.organization_gratitude_moments
          where organization_id = v_org_id
          group by status
        ) s
      ), '{}'::jsonb),
      'rose_count', coalesce((
        select count(*) from public.organization_digital_rose_recognitions
        where organization_id = v_org_id
      ), 0),
      'digital_rose_enabled', v_settings.digital_rose_enabled,
      'gratitude_moments_enabled', v_settings.gratitude_moments_enabled
    ),
    'integration_links', jsonb_build_object(
      'human_success', '/app/human-success',
      'personality', '/app/personality',
      'relationship_intelligence', '/app/relationship-intelligence-engine',
      'inclusion_humanity', '/app/inclusion-humanity-engine',
      'impact_engine', '/app/impact-engine',
      'legacy_engine', '/app/legacy-engine',
      'wonder_engine', '/app/wonder-engine',
      'purpose_values', '/app/purpose-values-engine'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('gratitude_recognition.manage'),
      'can_export', public._irp_has_permission('gratitude_recognition.export'),
      'can_send_rose', public._irp_has_permission('gratitude_recognition.rose.send')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.export_gratitude_recognition_report(p_format text default 'json')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_gratitude_recognition_settings;
begin
  perform public._irp_require_permission('gratitude_recognition.export');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._gre_ensure_settings(v_org_id);
  perform public._gre_seed_moments(v_org_id);

  perform public._gre_log(v_org_id, v_user_id, 'report_exported', jsonb_build_object(
    'format', coalesce(p_format, 'json'),
    'metadata_only', true
  ));

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'gratitude_recognition_engine',
    'format', coalesce(p_format, 'json'),
    'philosophy',
      'Sincere, human recognition strengthens relationships — help people express appreciation.',
    'mission',
      'Cultures where appreciation, gratitude, and recognition are natural in everyday work.',
    'abos_principle',
      'Recognition strengthens people — small gestures create lasting memories.',
    'vision',
      'Digital rose as symbol someone noticed effort or kindness — technology strengthens human connection.',
    'gratitude_moment_types', public._gre_gratitude_moment_types(),
    'red_rose_moment', public._gre_red_rose_moment(),
    'boundary_phrases', public._gre_boundary_phrases(),
    'self_love_note', public._gre_self_love_note(),
    'trust_note', public._gre_trust_note(),
    'settings', row_to_json(v_settings)::jsonb,
    'recent_moments', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', m.id,
          'moment_type', m.moment_type,
          'summary', m.summary,
          'recognition_target_role', m.recognition_target_role,
          'status', m.status,
          'created_at', m.created_at
        ) order by m.created_at desc
      )
      from public.organization_gratitude_moments m
      where m.organization_id = v_org_id
      order by m.created_at desc
      limit 50
    ), '[]'::jsonb),
    'recent_roses', jsonb_build_object(
      'count', coalesce((
        select count(*) from public.organization_digital_rose_recognitions
        where organization_id = v_org_id
      ), 0)
    ),
    'summary', jsonb_build_object(
      'moment_count', coalesce((
        select count(*) from public.organization_gratitude_moments where organization_id = v_org_id
      ), 0),
      'rose_count', coalesce((
        select count(*) from public.organization_digital_rose_recognitions
        where organization_id = v_org_id
      ), 0)
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('gratitude_recognition.manage'),
      'can_export', true,
      'can_send_rose', public._irp_has_permission('gratitude_recognition.rose.send')
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
    'leg_settings_changed', 'leg_milestone_acknowledged', 'leg_report_exported',
    'cde_settings_changed', 'cde_prompt_explored', 'cde_prompt_dismissed', 'cde_report_exported',
    'wne_settings_changed', 'wne_reflection_acknowledged', 'wne_reflection_dismissed',
    'wne_moment_acknowledged', 'wne_report_exported',
    'gre_settings_changed', 'gre_rose_sent', 'gre_report_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed'
    or p_action_type like 'owe_%' or p_action_type like 'pce_%' or p_action_type like 'gee_%'
    or p_action_type like 'pfe_%' or p_action_type like 'pve_%' or p_action_type like 'ihe_%'
    or p_action_type like 'cie_%' or p_action_type like 'ime_%' or p_action_type like 'leg_%'
    or p_action_type like 'cde_%' or p_action_type like 'wne_%' or p_action_type like 'gre_%';
$$;

-- ---------------------------------------------------------------------------
-- 10. KC category seed
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'gratitude-recognition-engine', 'Gratitude & Recognition Engine',
  'Peer appreciation, digital rose gestures, and gratitude moments — boundary-safe warmth that strengthens human connection.',
  'authenticated', 109
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'gratitude-recognition-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 11. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_gratitude_recognition_engine_card() to authenticated;
grant execute on function public.get_gratitude_recognition_engine_dashboard() to authenticated;
grant execute on function public.update_gratitude_recognition_settings(jsonb) to authenticated;
grant execute on function public.send_digital_rose_recognition(text, text) to authenticated;
grant execute on function public.export_gratitude_recognition_report(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 12. Seed settings + sample data per org
-- ---------------------------------------------------------------------------
do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._gre_ensure_settings(v_org_id);
    perform public._gre_seed_moments(v_org_id);
  end loop;
end; $$;
