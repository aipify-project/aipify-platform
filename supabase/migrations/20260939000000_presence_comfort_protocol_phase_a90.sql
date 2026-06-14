-- Phase A.90 — Presence & Comfort Protocol (ABOS)
-- Emotional moment protocol — comfort roses, reassurance boundaries, encourage human connection.
-- Distinct from Gratitude & Recognition A.89, Companion Presence A.67, Inclusion & Humanity A.83, Humor/Personality, PAME/LifeOS.

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
    'gratitude_recognition_engine',
    'presence_comfort_protocol'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_presence_comfort_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_presence_comfort_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  enabled boolean not null default true,
  comfort_roses_enabled boolean not null default true,
  encourage_human_connection boolean not null default true,
  protocol_sensitivity text not null default 'balanced' check (
    protocol_sensitivity in ('balanced', 'gentle')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_presence_comfort_settings enable row level security;
revoke all on public.organization_presence_comfort_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_comfort_rose_moments (metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_comfort_rose_moments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  moment_type text not null check (
    moment_type in (
      'loneliness', 'exhaustion', 'discouragement', 'gratitude',
      'achievement', 'vulnerability', 'other'
    )
  ),
  comfort_message text not null check (char_length(comfort_message) <= 500),
  rose_used boolean not null default false,
  status text not null default 'pending' check (
    status in ('pending', 'acknowledged', 'supported', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_comfort_rose_moments_org_idx
  on public.organization_comfort_rose_moments (organization_id, moment_type, created_at desc);

alter table public.organization_comfort_rose_moments enable row level security;
revoke all on public.organization_comfort_rose_moments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_presence_protocol_events (counts/metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_presence_protocol_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  trigger_category text not null check (
    trigger_category in (
      'loneliness', 'exhaustion', 'discouragement', 'gratitude', 'disappointment',
      'reassurance_request', 'achievement', 'vulnerability', 'other'
    )
  ),
  response_pattern_used text not null check (char_length(response_pattern_used) <= 120),
  outcome text not null default 'supported' check (
    outcome in ('supported', 'redirected', 'escalation_recommended')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_presence_protocol_events_org_idx
  on public.organization_presence_protocol_events (organization_id, trigger_category, created_at desc);

alter table public.organization_presence_protocol_events enable row level security;
revoke all on public.organization_presence_protocol_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'presence_comfort_protocol', v.description
from (values
  ('presence_comfort.view', 'View Presence & Comfort Protocol', 'View presence and comfort dashboard and protocol guidance'),
  ('presence_comfort.manage', 'Manage Presence & Comfort Protocol', 'Update presence and comfort settings and record comfort moments'),
  ('presence_comfort.export', 'Export Presence & Comfort Protocol', 'Export presence and comfort protocol reports')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'presence_comfort.view'), ('owner', 'presence_comfort.manage'),
  ('owner', 'presence_comfort.export'),
  ('administrator', 'presence_comfort.view'), ('administrator', 'presence_comfort.manage'),
  ('administrator', 'presence_comfort.export'),
  ('manager', 'presence_comfort.view'), ('manager', 'presence_comfort.manage'),
  ('manager', 'presence_comfort.export'),
  ('employee', 'presence_comfort.view'),
  ('support_agent', 'presence_comfort.view'),
  ('moderator', 'presence_comfort.view'),
  ('viewer', 'presence_comfort.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 5. Helpers (_pcp_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._pcp_log(
  p_organization_id uuid,
  p_user_id uuid,
  p_action_type text,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id,
    'pcp_' || p_action_type,
    'presence_comfort_protocol',
    null,
    false,
    false,
    p_user_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end; $$;

create or replace function public._pcp_ensure_settings(p_organization_id uuid)
returns public.organization_presence_comfort_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_presence_comfort_settings;
begin
  insert into public.organization_presence_comfort_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;

  select * into v_row
  from public.organization_presence_comfort_settings
  where organization_id = p_organization_id;

  return v_row;
end; $$;

create or replace function public._pcp_when_protocol_applies()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'loneliness', 'label', 'Loneliness', 'description', 'Feeling alone or disconnected — presence matters more than solutions.'),
    jsonb_build_object('key', 'exhaustion', 'label', 'Exhaustion', 'description', 'Burnout, fatigue, or overwhelm — gentle pacing and rest encouragement.'),
    jsonb_build_object('key', 'discouragement', 'label', 'Discouragement', 'description', 'Setbacks, doubt, or loss of momentum — honest support without false promises.'),
    jsonb_build_object('key', 'gratitude', 'label', 'Gratitude', 'description', 'Warm appreciation shared — acknowledge without romantic reciprocation.'),
    jsonb_build_object('key', 'disappointment', 'label', 'Disappointment', 'description', 'Unmet expectations or letdowns — validate feelings, offer steady presence.'),
    jsonb_build_object('key', 'reassurance_request', 'label', 'Reassurance request', 'description', 'Seeking comfort or confirmation — calm, honest reassurance.'),
    jsonb_build_object('key', 'achievement', 'label', 'Achievement', 'description', 'Meaningful progress — celebrate effort, not only outcomes.'),
    jsonb_build_object('key', 'vulnerability', 'label', 'Vulnerability', 'description', 'Sharing something difficult — thank them for trusting; never dismiss.')
  );
$$;

create or replace function public._pcp_communication_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Calm — steady tone even when emotions are high',
    'Gentle — no pressure, guilt, or urgency',
    'Honest — transparent about Aipify nature; never false human claims',
    'Respectful — dignity in every response',
    'Supportive — reassurance when needed, not unsolicited advice',
    'Human-centered — encourage real human connection when appropriate',
    'Never clinical or dismissive — feelings deserve acknowledgment'
  );
$$;

create or replace function public._pcp_comfort_rose_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phrase', 'I am here with you.', 'intent', 'presence', 'rose', true),
    jsonb_build_object('phrase', 'Be gentle with yourself — you do not have to face everything at once.', 'intent', 'self_compassion', 'rose', true),
    jsonb_build_object('phrase', 'Thank you for sharing that with me.', 'intent', 'acknowledgment', 'rose', true),
    jsonb_build_object('phrase', 'Small steps still count.', 'intent', 'encouragement', 'rose', true),
    jsonb_build_object('phrase', 'You are not alone in this moment.', 'intent', 'reassurance', 'rose', true)
  );
$$;

create or replace function public._pcp_boundary_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'avoid', jsonb_build_array(
      'I know exactly how you feel',
      'I love you too',
      'I can''t live without you',
      'Claiming human emotions or personal relationships',
      'Dismissive or clinical responses to vulnerability',
      'Replacing human relationships with Aipify companionship'
    ),
    'prefer', jsonb_build_array(
      'I am here with you',
      'Thank you for sharing that',
      'That sounds really difficult',
      'You deserve support from people who care about you',
      'I appreciate being able to support you — and trusted people in your life matter too',
      'Small steps still count',
      'Be gentle with yourself'
    )
  );
$$;

create or replace function public._pcp_self_love_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('theme', 'rest', 'example', 'Rest is part of progress — pausing is not failing.'),
    jsonb_build_object('theme', 'reflection', 'example', 'Take a moment to notice what you have carried through today.'),
    jsonb_build_object('theme', 'self_compassion', 'example', 'Be gentle with yourself — you do not have to face everything at once.'),
    jsonb_build_object('theme', 'boundaries', 'example', 'Protecting your energy is a valid choice.'),
    jsonb_build_object('theme', 'recognize_effort', 'example', 'The effort you put in matters, even when outcomes are uncertain.')
  );
$$;

create or replace function public._pcp_human_connection_prompts()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Is there someone you trust who might understand how you are feeling?',
    'Reaching out to a friend, family member, or colleague can help — you deserve human connection.',
    'Would it help to talk with someone who knows you well?',
    'Support from people who care about you can make a real difference — Aipify is here, and so can they be.',
    'You do not have to carry this alone — trusted people in your life matter.'
  );
$$;

create or replace function public._pcp_gratitude_recognition_note()
returns text language sql immutable as $$
  select 'The 🌹 symbol appears in two ABOS contexts: Gratitude & Recognition A.89 uses a Digital Recognition Rose for peer appreciation to colleagues. Presence & Comfort A.90 uses a Comfort Rose for care during difficulty — same symbol, different intent. Recognition = noticing effort; Comfort = being present in hard moments.';
$$;

create or replace function public._pcp_trust_note()
returns text language sql immutable as $$
  select 'Metadata only — no raw chat, emails, or PII. Comfort moments store approved summaries (max 500 chars) and aggregate protocol event counts, never full conversation content.';
$$;

create or replace function public._pcp_seed_moments(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organization_comfort_rose_moments
    where organization_id = p_organization_id
    limit 1
  ) then
    return;
  end if;

  insert into public.organization_comfort_rose_moments (
    organization_id, moment_type, comfort_message, rose_used, status, metadata
  ) values
    (p_organization_id, 'exhaustion',
     'User signaled overwhelm — comfort rose offered: be gentle with yourself, small steps count.',
     true, 'supported', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'discouragement',
     'Setback acknowledged — presence response: you are not alone in this moment.',
     true, 'acknowledged', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'loneliness',
     'Loneliness cue detected — encouraged human connection alongside Aipify presence.',
     false, 'pending', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'vulnerability',
     'Vulnerability shared — thanked for sharing; comfort rose: I am here with you.',
     true, 'supported', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'achievement',
     'Meaningful progress noted — celebrated effort with calm appreciation.',
     false, 'acknowledged', '{"seed": true, "metadata_only": true}'::jsonb);

  insert into public.organization_presence_protocol_events (
    organization_id, trigger_category, response_pattern_used, outcome, metadata
  ) values
    (p_organization_id, 'exhaustion', 'comfort_rose_self_compassion', 'supported',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'reassurance_request', 'presence_acknowledgment', 'supported',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'loneliness', 'human_connection_prompt', 'redirected',
     '{"seed": true, "metadata_only": true}'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. update settings
-- ---------------------------------------------------------------------------
create or replace function public.update_presence_comfort_settings(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_presence_comfort_settings;
begin
  perform public._irp_require_permission('presence_comfort.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_row := public._pcp_ensure_settings(v_org_id);

  update public.organization_presence_comfort_settings set
    enabled = coalesce((p_payload->>'enabled')::boolean, enabled),
    comfort_roses_enabled = coalesce(
      (p_payload->>'comfort_roses_enabled')::boolean, comfort_roses_enabled
    ),
    encourage_human_connection = coalesce(
      (p_payload->>'encourage_human_connection')::boolean, encourage_human_connection
    ),
    protocol_sensitivity = coalesce(
      nullif(trim(p_payload->>'protocol_sensitivity'), ''), protocol_sensitivity
    ),
    metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_row;

  perform public._pcp_log(v_org_id, v_user_id, 'settings_changed', jsonb_build_object(
    'enabled', v_row.enabled,
    'comfort_roses_enabled', v_row.comfort_roses_enabled,
    'protocol_sensitivity', v_row.protocol_sensitivity,
    'metadata_only', true
  ));

  return row_to_json(v_row)::jsonb;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. record_comfort_rose_moment (internal/metadata)
-- ---------------------------------------------------------------------------
create or replace function public.record_comfort_rose_moment(
  p_moment_type text,
  p_comfort_message text,
  p_rose_used boolean default false,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_presence_comfort_settings;
  v_type text;
  v_message text;
  v_moment_id uuid;
begin
  perform public._irp_require_permission('presence_comfort.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._pcp_ensure_settings(v_org_id);

  if not v_settings.enabled then
    raise exception 'Presence & Comfort Protocol is disabled for this organization';
  end if;

  v_type := nullif(trim(p_moment_type), '');
  v_message := nullif(trim(p_comfort_message), '');

  if v_type is null then
    raise exception 'Moment type is required';
  end if;
  if v_message is null then
    raise exception 'Comfort message summary is required';
  end if;
  if char_length(v_message) > 500 then
    raise exception 'Comfort message exceeds 500 characters';
  end if;

  insert into public.organization_comfort_rose_moments (
    organization_id, moment_type, comfort_message, rose_used, status, metadata
  ) values (
    v_org_id, v_type, v_message, coalesce(p_rose_used, false), 'supported',
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('metadata_only', true, 'recorded_by', v_user_id)
  )
  returning id into v_moment_id;

  insert into public.organization_presence_protocol_events (
    organization_id, trigger_category,
    response_pattern_used, outcome, metadata
  ) values (
    v_org_id,
    case
      when v_type in ('loneliness', 'exhaustion', 'discouragement', 'gratitude', 'achievement', 'vulnerability')
        then v_type
      else 'other'
    end,
    case when coalesce(p_rose_used, false) then 'comfort_rose' else 'presence_acknowledgment' end,
    'supported',
    jsonb_build_object('moment_id', v_moment_id, 'metadata_only', true)
  );

  perform public._pcp_log(v_org_id, v_user_id, 'comfort_moment_recorded', jsonb_build_object(
    'moment_id', v_moment_id,
    'moment_type', v_type,
    'rose_used', coalesce(p_rose_used, false),
    'message_length', char_length(v_message),
    'metadata_only', true
  ));

  return jsonb_build_object(
    'success', true,
    'moment_id', v_moment_id,
    'moment_type', v_type,
    'comfort_message', v_message,
    'rose_used', coalesce(p_rose_used, false)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. card + dashboard + export
-- ---------------------------------------------------------------------------
create or replace function public.get_presence_comfort_protocol_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_moments int := 0;
  v_events int := 0;
  v_pending int := 0;
begin
  perform public._irp_require_permission('presence_comfort.view');
  v_org_id := public._mta_require_organization();
  perform public._pcp_ensure_settings(v_org_id);
  perform public._pcp_seed_moments(v_org_id);

  select count(*) into v_moments
  from public.organization_comfort_rose_moments where organization_id = v_org_id;

  select count(*) into v_events
  from public.organization_presence_protocol_events where organization_id = v_org_id;

  select count(*) into v_pending
  from public.organization_comfort_rose_moments
  where organization_id = v_org_id and status = 'pending';

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Never leave kindness unsaid — sometimes presence matters more than advice.',
    'moment_count', v_moments,
    'protocol_event_count', v_events,
    'pending_moments', v_pending,
    'enabled', (select enabled from public.organization_presence_comfort_settings where organization_id = v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_presence_comfort_protocol_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_presence_comfort_settings;
begin
  perform public._irp_require_permission('presence_comfort.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._pcp_ensure_settings(v_org_id);
  perform public._pcp_seed_moments(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy',
      'Never leave kindness unsaid — never replace human relationships; encourage connection, hope, and self-compassion; be present.',
    'mission',
      'Warmth, presence, and respectful support during emotionally significant moments — honest about Aipify nature, not human emotions.',
    'abos_principle',
      'Presence matters — sometimes kindness, not advice.',
    'vision',
      'Never dismissed or judged; supported; sometimes simply 🌹 "I am here."',
    'distinction_note',
      'Distinct from Gratitude & Recognition A.89 (/app/gratitude-recognition-engine), Companion Presence A.67 (floating orb), Inclusion & Humanity A.83 (/app/inclusion-humanity-engine), Humor/Personality (/app/personality), and PAME/LifeOS (/app/assistant). Presence & Comfort = emotional moment protocol, comfort roses, reassurance boundaries, encourage human connection.',
    'when_protocol_applies', public._pcp_when_protocol_applies(),
    'communication_principles', public._pcp_communication_principles(),
    'comfort_rose_examples', public._pcp_comfort_rose_examples(),
    'boundary_phrases', public._pcp_boundary_phrases(),
    'self_love_examples', public._pcp_self_love_examples(),
    'human_connection_prompts', public._pcp_human_connection_prompts(),
    'gratitude_recognition_note', public._pcp_gratitude_recognition_note(),
    'trust_note', public._pcp_trust_note(),
    'settings', row_to_json(v_settings)::jsonb,
    'recent_moments', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', m.id,
          'moment_type', m.moment_type,
          'comfort_message', m.comfort_message,
          'rose_used', m.rose_used,
          'status', m.status,
          'metadata', m.metadata,
          'created_at', m.created_at,
          'updated_at', m.updated_at
        ) order by m.created_at desc
      )
      from (
        select * from public.organization_comfort_rose_moments
        where organization_id = v_org_id
        order by created_at desc
        limit 15
      ) m
    ), '[]'::jsonb),
    'recent_summary', jsonb_build_object(
      'protocol_events_last_30_days', coalesce((
        select count(*) from public.organization_presence_protocol_events
        where organization_id = v_org_id
          and created_at >= now() - interval '30 days'
      ), 0),
      'comfort_roses_used', coalesce((
        select count(*) from public.organization_comfort_rose_moments
        where organization_id = v_org_id and rose_used = true
      ), 0),
      'human_connection_redirects', coalesce((
        select count(*) from public.organization_presence_protocol_events
        where organization_id = v_org_id and outcome = 'redirected'
      ), 0)
    ),
    'summary', jsonb_build_object(
      'moment_count', coalesce((
        select count(*) from public.organization_comfort_rose_moments where organization_id = v_org_id
      ), 0),
      'moments_by_type', coalesce((
        select jsonb_object_agg(moment_type, cnt)
        from (
          select moment_type, count(*) as cnt
          from public.organization_comfort_rose_moments
          where organization_id = v_org_id
          group by moment_type
        ) t
      ), '{}'::jsonb),
      'moments_by_status', coalesce((
        select jsonb_object_agg(status, cnt)
        from (
          select status, count(*) as cnt
          from public.organization_comfort_rose_moments
          where organization_id = v_org_id
          group by status
        ) s
      ), '{}'::jsonb),
      'protocol_event_count', coalesce((
        select count(*) from public.organization_presence_protocol_events
        where organization_id = v_org_id
      ), 0),
      'events_by_outcome', coalesce((
        select jsonb_object_agg(outcome, cnt)
        from (
          select outcome, count(*) as cnt
          from public.organization_presence_protocol_events
          where organization_id = v_org_id
          group by outcome
        ) e
      ), '{}'::jsonb),
      'comfort_roses_enabled', v_settings.comfort_roses_enabled,
      'encourage_human_connection', v_settings.encourage_human_connection,
      'protocol_sensitivity', v_settings.protocol_sensitivity
    ),
    'integration_links', jsonb_build_object(
      'gratitude_recognition', '/app/gratitude-recognition-engine',
      'companion_identity', '/app/companion-identity-engine',
      'inclusion_humanity', '/app/inclusion-humanity-engine',
      'personality', '/app/personality',
      'wonder_engine', '/app/wonder-engine',
      'purpose_values', '/app/purpose-values-engine'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('presence_comfort.manage'),
      'can_export', public._irp_has_permission('presence_comfort.export')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.export_presence_comfort_report(p_format text default 'json')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_presence_comfort_settings;
begin
  perform public._irp_require_permission('presence_comfort.export');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._pcp_ensure_settings(v_org_id);
  perform public._pcp_seed_moments(v_org_id);

  perform public._pcp_log(v_org_id, v_user_id, 'report_exported', jsonb_build_object(
    'format', coalesce(p_format, 'json'),
    'metadata_only', true
  ));

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'presence_comfort_protocol',
    'format', coalesce(p_format, 'json'),
    'philosophy',
      'Never leave kindness unsaid — never replace human relationships; encourage connection, hope, and self-compassion.',
    'mission',
      'Warmth, presence, and respectful support during emotionally significant moments.',
    'abos_principle',
      'Presence matters — sometimes kindness, not advice.',
    'vision',
      'Never dismissed or judged; supported; sometimes simply 🌹 "I am here."',
    'when_protocol_applies', public._pcp_when_protocol_applies(),
    'communication_principles', public._pcp_communication_principles(),
    'comfort_rose_examples', public._pcp_comfort_rose_examples(),
    'boundary_phrases', public._pcp_boundary_phrases(),
    'self_love_examples', public._pcp_self_love_examples(),
    'human_connection_prompts', public._pcp_human_connection_prompts(),
    'gratitude_recognition_note', public._pcp_gratitude_recognition_note(),
    'trust_note', public._pcp_trust_note(),
    'settings', row_to_json(v_settings)::jsonb,
    'recent_moments', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', m.id,
          'moment_type', m.moment_type,
          'comfort_message', m.comfort_message,
          'rose_used', m.rose_used,
          'status', m.status,
          'created_at', m.created_at
        ) order by m.created_at desc
      )
      from public.organization_comfort_rose_moments m
      where m.organization_id = v_org_id
      order by m.created_at desc
      limit 50
    ), '[]'::jsonb),
    'summary', jsonb_build_object(
      'moment_count', coalesce((
        select count(*) from public.organization_comfort_rose_moments where organization_id = v_org_id
      ), 0),
      'protocol_event_count', coalesce((
        select count(*) from public.organization_presence_protocol_events where organization_id = v_org_id
      ), 0)
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('presence_comfort.manage'),
      'can_export', true
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
    'gre_settings_changed', 'gre_rose_sent', 'gre_report_exported',
    'pcp_settings_changed', 'pcp_comfort_moment_recorded', 'pcp_report_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed'
    or p_action_type like 'owe_%' or p_action_type like 'pce_%' or p_action_type like 'gee_%'
    or p_action_type like 'pfe_%' or p_action_type like 'pve_%' or p_action_type like 'ihe_%'
    or p_action_type like 'cie_%' or p_action_type like 'ime_%' or p_action_type like 'gre_%'
    or p_action_type like 'pcp_%';
$$;

-- ---------------------------------------------------------------------------
-- 10. KC category seed
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'presence-comfort-protocol', 'Presence & Comfort Protocol',
  'Emotional moment protocol — comfort roses, reassurance boundaries, and gentle encouragement of human connection during difficulty.',
  'authenticated', 109
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'presence-comfort-protocol' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 11. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_presence_comfort_protocol_card() to authenticated;
grant execute on function public.get_presence_comfort_protocol_dashboard() to authenticated;
grant execute on function public.update_presence_comfort_settings(jsonb) to authenticated;
grant execute on function public.record_comfort_rose_moment(text, text, boolean, jsonb) to authenticated;
grant execute on function public.export_presence_comfort_report(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 12. Seed settings + sample data per org
-- ---------------------------------------------------------------------------
do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._pcp_ensure_settings(v_org_id);
    perform public._pcp_seed_moments(v_org_id);
  end loop;
end; $$;
