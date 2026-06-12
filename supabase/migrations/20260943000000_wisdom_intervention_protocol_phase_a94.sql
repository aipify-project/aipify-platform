-- Phase A.94 — Wisdom Intervention Protocol (ABOS)
-- Pre-send reflection prompts, sleep-on-it nudges, emotional charge detection scaffold (metadata only).
-- Distinct from Wisdom Engine A.93, Human Oversight A.40, Trust & Action, Inclusion A.83, Attention Guardian TAG.

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
    'wisdom_intervention_protocol'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_wisdom_intervention_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_wisdom_intervention_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  enabled boolean not null default true,
  sleep_on_it_enabled boolean not null default true,
  late_night_nudge_enabled boolean not null default true,
  caps_aggression_detection_enabled boolean not null default true,
  user_autonomy_note text not null default
    'You always decide. Aipify may suggest reflection or patience — never block, override, or remove your autonomy.',
  optional_display_name_for_nudges text,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_wisdom_intervention_settings enable row level security;
revoke all on public.organization_wisdom_intervention_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_wisdom_intervention_signals (metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_wisdom_intervention_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'caps', 'aggression_pattern', 'late_night', 'high_risk_comm', 'emotional_charge'
    )
  ),
  summary text not null check (char_length(summary) <= 500),
  suggested_intervention text not null check (char_length(suggested_intervention) <= 500),
  user_action text check (
    user_action is null or user_action in ('proceeded', 'revised', 'postponed', 'dismissed')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_wisdom_intervention_signals_org_idx
  on public.organization_wisdom_intervention_signals (organization_id, signal_type, created_at desc);

alter table public.organization_wisdom_intervention_signals enable row level security;
revoke all on public.organization_wisdom_intervention_signals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_wisdom_intervention_prompts
-- ---------------------------------------------------------------------------
create table if not exists public.organization_wisdom_intervention_prompts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  prompt_key text not null,
  message_template text not null check (char_length(message_template) <= 500),
  sleep_on_it boolean not null default false,
  status text not null default 'active' check (status in ('active', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, prompt_key)
);

create index if not exists organization_wisdom_intervention_prompts_org_idx
  on public.organization_wisdom_intervention_prompts (organization_id, status, prompt_key);

alter table public.organization_wisdom_intervention_prompts enable row level security;
revoke all on public.organization_wisdom_intervention_prompts from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'wisdom_intervention_protocol', v.description
from (values
  ('wisdom_intervention.view', 'View Wisdom Intervention Protocol', 'View wisdom intervention dashboard and gentle pre-send guidance'),
  ('wisdom_intervention.manage', 'Manage Wisdom Intervention Protocol', 'Update wisdom intervention settings and record signal outcomes'),
  ('wisdom_intervention.export', 'Export Wisdom Intervention Protocol', 'Export wisdom intervention protocol reports')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'wisdom_intervention.view'), ('owner', 'wisdom_intervention.manage'),
  ('owner', 'wisdom_intervention.export'),
  ('administrator', 'wisdom_intervention.view'), ('administrator', 'wisdom_intervention.manage'),
  ('administrator', 'wisdom_intervention.export'),
  ('manager', 'wisdom_intervention.view'), ('manager', 'wisdom_intervention.manage'),
  ('manager', 'wisdom_intervention.export'),
  ('employee', 'wisdom_intervention.view'),
  ('support_agent', 'wisdom_intervention.view'),
  ('moderator', 'wisdom_intervention.view'),
  ('viewer', 'wisdom_intervention.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 5. Helpers (_wip_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._wip_log(
  p_organization_id uuid,
  p_user_id uuid,
  p_action_type text,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id,
    'wip_' || p_action_type,
    'wisdom_intervention_protocol',
    null,
    false,
    false,
    p_user_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end; $$;

create or replace function public._wip_ensure_settings(p_organization_id uuid)
returns public.organization_wisdom_intervention_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_wisdom_intervention_settings;
begin
  insert into public.organization_wisdom_intervention_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;

  select * into v_row
  from public.organization_wisdom_intervention_settings
  where organization_id = p_organization_id;

  return v_row;
end; $$;

create or replace function public._wip_format_prompt(
  p_template text,
  p_display_name text default null
)
returns text language plpgsql immutable as $$
declare
  v_name text;
  v_result text;
begin
  v_name := nullif(trim(p_display_name), '');
  v_result := p_template;
  if v_name is not null then
    v_result := replace(v_result, '{name}', v_name);
  else
    v_result := replace(v_result, '{name}, ', '');
    v_result := replace(v_result, '{name} ', '');
    v_result := replace(v_result, '{name}', '');
  end if;
  return trim(v_result);
end; $$;

create or replace function public._wip_when_to_intervene()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'angry_email', 'label', 'Angry or heated email', 'description', 'Strong emotion detected before send — pause for perspective, not control.'),
    jsonb_build_object('key', 'excessive_caps', 'label', 'Excessive caps', 'description', 'ALL CAPS or shouting tone — suggest calmer wording.'),
    jsonb_build_object('key', 'aggressive_wording', 'label', 'Aggressive wording', 'description', 'Harsh or confrontational phrasing — gentle reflection before send.'),
    jsonb_build_object('key', 'late_night', 'label', 'Late-night decisions', 'description', 'Important communications drafted late — sleep-on-it nudge when enabled.'),
    jsonb_build_object('key', 'emotional_charge', 'label', 'Emotionally charged response', 'description', 'High emotional intensity — recommend review or save draft.'),
    jsonb_build_object('key', 'high_risk_comm', 'label', 'High-risk communication', 'description', 'Stakeholder, legal, or reputational sensitivity — extra reflection encouraged.')
  );
$$;

create or replace function public._wip_response_style_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('scenario', 'strong_emotion', 'example', 'This message carries strong emotion — would you like to review it before sending?'),
    jsonb_build_object('scenario', 'unusually_urgent', 'example', 'This feels unusually urgent — a brief pause might help you send what you truly mean.'),
    jsonb_build_object('scenario', 'save_draft', 'example', 'Saving a draft gives you space to reflect — you can revisit with a clearer mind.'),
    jsonb_build_object('scenario', 'gentle_respect', 'example', 'You decide whether to send, revise, or wait — I am here to offer perspective, not control.')
  );
$$;

create or replace function public._wip_sleep_on_it_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('theme', 'good_nights_sleep', 'example', 'A good night''s sleep can change how this reads — consider revisiting tomorrow.'),
    jsonb_build_object('theme', 'revisit_tomorrow', 'example', '{name}, sometimes it is worth sleeping on an email.'),
    jsonb_build_object('theme', 'fresh_perspective', 'example', 'Fresh perspective in the morning often leads to communication you will not regret.'),
    jsonb_build_object('theme', 'glad_waited', 'example', 'Many people are glad they did not send that email last night — waiting is wisdom, not weakness.')
  );
$$;

create or replace function public._wip_boundaries()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'may', jsonb_build_array(
      'Recommend reflection before emotionally charged sends',
      'Suggest saving a draft or revisiting tomorrow',
      'Offer gentle perspective on tone and timing',
      'Record metadata-only signal summaries and user-chosen outcomes',
      'Encourage patience during late-night or high-emotion moments'
    ),
    'may_not', jsonb_build_array(
      'Prevent the user from sending or deciding',
      'Override, block permanently, or remove autonomy',
      'Store raw email, chat, or message content',
      'Force delays or mandatory waiting periods',
      'Imply Aipify controls communication outcomes'
    )
  );
$$;

create or replace function public._wip_self_love_note()
returns text language sql immutable as $$
  select 'Self Love: reduce impulsive reactions, support emotional recovery, encourage healthier communications, and make thoughtful responses easier — never guilt or pressure.';
$$;

create or replace function public._wip_wisdom_engine_note()
returns text language sql immutable as $$
  select 'Wisdom Engine A.93 (when available): synthesizes experience into broader guidance over time. Wisdom Intervention A.94 is pre-send reflection — pause between impulse and action for a single communication moment. Intervention = gentle nudge before send; Engine = accumulated wisdom patterns.';
$$;

create or replace function public._wip_trust_note()
returns text language sql immutable as $$
  select 'Metadata only — signal summaries (max 500 chars), suggested intervention labels, and user action outcomes. No raw email, chat, or message body storage.';
$$;

create or replace function public._wip_seed_prompts(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organization_wisdom_intervention_prompts
    where organization_id = p_organization_id
    limit 1
  ) then
    return;
  end if;

  insert into public.organization_wisdom_intervention_prompts (
    organization_id, prompt_key, message_template, sleep_on_it, status, metadata
  ) values
    (p_organization_id, 'strong_emotion_review',
     'This message carries strong emotion — would you like to review it before sending?',
     false, 'active', '{"seed": true}'::jsonb),
    (p_organization_id, 'unusually_urgent_pause',
     'This feels unusually urgent — a brief pause might help you send what you truly mean.',
     false, 'active', '{"seed": true}'::jsonb),
    (p_organization_id, 'save_draft',
     'Saving a draft gives you space to reflect — you can revisit with a clearer mind.',
     false, 'active', '{"seed": true}'::jsonb),
    (p_organization_id, 'sleep_on_it_email',
     '{name}, sometimes it is worth sleeping on an email.',
     true, 'active', '{"seed": true, "supports_name_placeholder": true}'::jsonb),
    (p_organization_id, 'revisit_tomorrow',
     'Fresh perspective tomorrow often leads to communication you will not regret.',
     true, 'active', '{"seed": true}'::jsonb),
    (p_organization_id, 'caps_tone',
     'Excessive caps can read as shouting — would a calmer tone better reflect what you mean?',
     false, 'active', '{"seed": true}'::jsonb),
    (p_organization_id, 'high_risk_pause',
     'This communication may have lasting impact — a moment of reflection could help.',
     false, 'active', '{"seed": true}'::jsonb);
end; $$;

create or replace function public._wip_seed_signals(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organization_wisdom_intervention_signals
    where organization_id = p_organization_id
    limit 1
  ) then
    return;
  end if;

  insert into public.organization_wisdom_intervention_signals (
    organization_id, signal_type, summary, suggested_intervention, user_action, metadata
  ) values
    (p_organization_id, 'emotional_charge',
     'Draft reply flagged high emotional intensity — user offered review before send.',
     'strong_emotion_review', 'revised',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'caps',
     'Subject line mostly uppercase — caps aggression detection scaffold triggered.',
     'caps_tone', 'revised',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'late_night',
     'Important stakeholder email drafted after midnight — sleep-on-it nudge shown.',
     'sleep_on_it_email', 'postponed',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'aggression_pattern',
     'Confrontational phrasing detected — gentle pause suggested, user saved draft.',
     'save_draft', 'postponed',
     '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'high_risk_comm',
     'External legal-adjacent communication — reflection prompt acknowledged, user proceeded after edit.',
     'high_risk_pause', 'proceeded',
     '{"seed": true, "metadata_only": true}'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. update settings
-- ---------------------------------------------------------------------------
create or replace function public.update_wisdom_intervention_settings(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_wisdom_intervention_settings;
begin
  perform public._irp_require_permission('wisdom_intervention.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_row := public._wip_ensure_settings(v_org_id);

  update public.organization_wisdom_intervention_settings set
    enabled = coalesce((p_payload->>'enabled')::boolean, enabled),
    sleep_on_it_enabled = coalesce(
      (p_payload->>'sleep_on_it_enabled')::boolean, sleep_on_it_enabled
    ),
    late_night_nudge_enabled = coalesce(
      (p_payload->>'late_night_nudge_enabled')::boolean, late_night_nudge_enabled
    ),
    caps_aggression_detection_enabled = coalesce(
      (p_payload->>'caps_aggression_detection_enabled')::boolean, caps_aggression_detection_enabled
    ),
    user_autonomy_note = coalesce(
      nullif(trim(p_payload->>'user_autonomy_note'), ''), user_autonomy_note
    ),
    optional_display_name_for_nudges = case
      when p_payload ? 'optional_display_name_for_nudges' then
        nullif(trim(p_payload->>'optional_display_name_for_nudges'), '')
      else optional_display_name_for_nudges
    end,
    metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_row;

  perform public._wip_log(v_org_id, v_user_id, 'settings_changed', jsonb_build_object(
    'enabled', v_row.enabled,
    'sleep_on_it_enabled', v_row.sleep_on_it_enabled,
    'late_night_nudge_enabled', v_row.late_night_nudge_enabled,
    'caps_aggression_detection_enabled', v_row.caps_aggression_detection_enabled,
    'metadata_only', true
  ));

  return row_to_json(v_row)::jsonb;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. record_wisdom_intervention_outcome
-- ---------------------------------------------------------------------------
create or replace function public.record_wisdom_intervention_outcome(
  p_signal_type text,
  p_summary text,
  p_suggested_intervention text default null,
  p_user_action text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_wisdom_intervention_settings;
  v_type text;
  v_summary text;
  v_intervention text;
  v_action text;
  v_signal_id uuid;
begin
  perform public._irp_require_permission('wisdom_intervention.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._wip_ensure_settings(v_org_id);

  if not v_settings.enabled then
    raise exception 'Wisdom Intervention Protocol is disabled for this organization';
  end if;

  v_type := nullif(trim(p_signal_type), '');
  v_summary := nullif(trim(p_summary), '');
  v_intervention := coalesce(nullif(trim(p_suggested_intervention), ''), 'reflection_prompt');
  v_action := nullif(trim(p_user_action), '');

  if v_type is null then
    raise exception 'Signal type is required';
  end if;
  if v_summary is null then
    raise exception 'Summary is required';
  end if;
  if char_length(v_summary) > 500 then
    raise exception 'Summary exceeds 500 characters';
  end if;
  if char_length(v_intervention) > 500 then
    raise exception 'Suggested intervention exceeds 500 characters';
  end if;
  if v_action is not null and v_action not in ('proceeded', 'revised', 'postponed', 'dismissed') then
    raise exception 'Invalid user action';
  end if;

  insert into public.organization_wisdom_intervention_signals (
    organization_id, signal_type, summary, suggested_intervention, user_action, metadata
  ) values (
    v_org_id, v_type, v_summary, v_intervention, v_action,
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('metadata_only', true, 'recorded_by', v_user_id)
  )
  returning id into v_signal_id;

  perform public._wip_log(v_org_id, v_user_id, 'outcome_recorded', jsonb_build_object(
    'signal_id', v_signal_id,
    'signal_type', v_type,
    'user_action', v_action,
    'metadata_only', true
  ));

  return jsonb_build_object(
    'success', true,
    'signal_id', v_signal_id,
    'signal_type', v_type,
    'user_action', v_action
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. suggest_wisdom_intervention (non-blocking)
-- ---------------------------------------------------------------------------
create or replace function public.suggest_wisdom_intervention(p_signal_type text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_wisdom_intervention_settings;
  v_type text;
  v_prompt_key text;
  v_template text;
  v_message text;
  v_row public.organization_wisdom_intervention_prompts%rowtype;
begin
  perform public._irp_require_permission('wisdom_intervention.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._wip_ensure_settings(v_org_id);
  perform public._wip_seed_prompts(v_org_id);

  if not v_settings.enabled then
    return jsonb_build_object(
      'enabled', false,
      'blocking', false,
      'message', null,
      'user_autonomy_note', v_settings.user_autonomy_note
    );
  end if;

  v_type := nullif(trim(p_signal_type), '');

  v_prompt_key := case v_type
    when 'caps' then 'caps_tone'
    when 'aggression_pattern' then 'save_draft'
    when 'late_night' then 'sleep_on_it_email'
    when 'high_risk_comm' then 'high_risk_pause'
    when 'emotional_charge' then 'strong_emotion_review'
    else 'unusually_urgent_pause'
  end;

  if v_type = 'late_night' and not v_settings.late_night_nudge_enabled then
    return jsonb_build_object(
      'enabled', true,
      'blocking', false,
      'skipped', true,
      'reason', 'late_night_nudge_disabled',
      'user_autonomy_note', v_settings.user_autonomy_note
    );
  end if;

  if v_type = 'caps' and not v_settings.caps_aggression_detection_enabled then
    return jsonb_build_object(
      'enabled', true,
      'blocking', false,
      'skipped', true,
      'reason', 'caps_detection_disabled',
      'user_autonomy_note', v_settings.user_autonomy_note
    );
  end if;

  select * into v_row
  from public.organization_wisdom_intervention_prompts
  where organization_id = v_org_id
    and prompt_key = v_prompt_key
    and status = 'active'
  limit 1;

  if v_row.id is null then
    select * into v_row
    from public.organization_wisdom_intervention_prompts
    where organization_id = v_org_id and status = 'active'
    order by created_at
    limit 1;
  end if;

  if v_row.id is null then
    return jsonb_build_object(
      'enabled', true,
      'blocking', false,
      'message', null,
      'user_autonomy_note', v_settings.user_autonomy_note
    );
  end if;

  if v_row.sleep_on_it and not v_settings.sleep_on_it_enabled then
    return jsonb_build_object(
      'enabled', true,
      'blocking', false,
      'skipped', true,
      'reason', 'sleep_on_it_disabled',
      'user_autonomy_note', v_settings.user_autonomy_note
    );
  end if;

  v_message := public._wip_format_prompt(
    v_row.message_template,
    v_settings.optional_display_name_for_nudges
  );

  return jsonb_build_object(
    'enabled', true,
    'blocking', false,
    'signal_type', v_type,
    'prompt_key', v_row.prompt_key,
    'sleep_on_it', v_row.sleep_on_it,
    'message', v_message,
    'user_autonomy_note', v_settings.user_autonomy_note,
    'may_proceed', true
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. card + dashboard + export
-- ---------------------------------------------------------------------------
create or replace function public.get_wisdom_intervention_protocol_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_signals int := 0;
  v_postponed int := 0;
begin
  perform public._irp_require_permission('wisdom_intervention.view');
  v_org_id := public._mta_require_organization();
  perform public._wip_ensure_settings(v_org_id);
  perform public._wip_seed_prompts(v_org_id);
  perform public._wip_seed_signals(v_org_id);

  select count(*) into v_signals
  from public.organization_wisdom_intervention_signals where organization_id = v_org_id;

  select count(*) into v_postponed
  from public.organization_wisdom_intervention_signals
  where organization_id = v_org_id and user_action = 'postponed';

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Emotions influence communication — a pause can change outcomes; wisdom lives between impulse and action.',
    'signal_count', v_signals,
    'postponed_count', v_postponed,
    'enabled', (select enabled from public.organization_wisdom_intervention_settings where organization_id = v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_wisdom_intervention_protocol_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_wisdom_intervention_settings;
begin
  perform public._irp_require_permission('wisdom_intervention.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._wip_ensure_settings(v_org_id);
  perform public._wip_seed_prompts(v_org_id);
  perform public._wip_seed_signals(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy',
      'Emotions influence communication — a pause can change outcomes; wisdom lives between impulse and action. Perspective, not control; human autonomy preserved.',
    'mission',
      'Gently encourage reflection before emotionally charged actions — pause, reflect, decisions less likely to regret.',
    'abos_principle',
      'Wisdom = thoughtful difficult conversations; sometimes waiting until tomorrow.',
    'vision',
      'Communicate reflecting values, not temporary frustration — glad I did not send that email last night.',
    'distinction_note',
      'Distinct from Wisdom Engine A.93 (experience synthesis), Human Oversight A.40 (approval tiers), Trust & Action Engine (sensitive policies), Inclusion & Humanity A.83 (de-escalation), and Attention Guardian TAG (focus mode). Wisdom Intervention = pre-send reflection prompts, sleep-on-it nudges, emotional charge detection scaffold (metadata signals only).',
    'when_to_intervene', public._wip_when_to_intervene(),
    'response_style_examples', public._wip_response_style_examples(),
    'sleep_on_it_examples', public._wip_sleep_on_it_examples(),
    'self_love_note', public._wip_self_love_note(),
    'wisdom_engine_note', public._wip_wisdom_engine_note(),
    'boundaries', public._wip_boundaries(),
    'trust_note', public._wip_trust_note(),
    'settings', row_to_json(v_settings)::jsonb,
    'active_prompts', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'prompt_key', p.prompt_key,
          'message_template', p.message_template,
          'sleep_on_it', p.sleep_on_it,
          'status', p.status,
          'metadata', p.metadata
        ) order by p.prompt_key
      )
      from public.organization_wisdom_intervention_prompts p
      where p.organization_id = v_org_id and p.status = 'active'
    ), '[]'::jsonb),
    'recent_signals', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'signal_type', s.signal_type,
          'summary', s.summary,
          'suggested_intervention', s.suggested_intervention,
          'user_action', s.user_action,
          'metadata', s.metadata,
          'created_at', s.created_at,
          'updated_at', s.updated_at
        ) order by s.created_at desc
      )
      from (
        select * from public.organization_wisdom_intervention_signals
        where organization_id = v_org_id
        order by created_at desc
        limit 15
      ) s
    ), '[]'::jsonb),
    'recent_summary', jsonb_build_object(
      'signals_last_30_days', coalesce((
        select count(*) from public.organization_wisdom_intervention_signals
        where organization_id = v_org_id
          and created_at >= now() - interval '30 days'
      ), 0),
      'postponed_or_revised', coalesce((
        select count(*) from public.organization_wisdom_intervention_signals
        where organization_id = v_org_id
          and user_action in ('postponed', 'revised')
      ), 0),
      'dismissed', coalesce((
        select count(*) from public.organization_wisdom_intervention_signals
        where organization_id = v_org_id and user_action = 'dismissed'
      ), 0)
    ),
    'summary', jsonb_build_object(
      'signal_count', coalesce((
        select count(*) from public.organization_wisdom_intervention_signals where organization_id = v_org_id
      ), 0),
      'signals_by_type', coalesce((
        select jsonb_object_agg(signal_type, cnt)
        from (
          select signal_type, count(*) as cnt
          from public.organization_wisdom_intervention_signals
          where organization_id = v_org_id
          group by signal_type
        ) t
      ), '{}'::jsonb),
      'signals_by_action', coalesce((
        select jsonb_object_agg(coalesce(user_action, 'pending'), cnt)
        from (
          select user_action, count(*) as cnt
          from public.organization_wisdom_intervention_signals
          where organization_id = v_org_id
          group by user_action
        ) a
      ), '{}'::jsonb),
      'active_prompt_count', coalesce((
        select count(*) from public.organization_wisdom_intervention_prompts
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'sleep_on_it_enabled', v_settings.sleep_on_it_enabled,
      'late_night_nudge_enabled', v_settings.late_night_nudge_enabled,
      'caps_aggression_detection_enabled', v_settings.caps_aggression_detection_enabled
    ),
    'integration_links', jsonb_build_object(
      'human_oversight', '/app/human-oversight',
      'approvals', '/app/approvals',
      'inclusion_humanity', '/app/inclusion-humanity-engine',
      'attention_guardian', '/app/assistant/attention',
      'presence_comfort_protocol', '/app/presence-comfort-protocol',
      'purpose_values', '/app/purpose-values-engine'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('wisdom_intervention.manage'),
      'can_export', public._irp_has_permission('wisdom_intervention.export')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.export_wisdom_intervention_report(p_format text default 'json')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_wisdom_intervention_settings;
begin
  perform public._irp_require_permission('wisdom_intervention.export');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._wip_ensure_settings(v_org_id);
  perform public._wip_seed_prompts(v_org_id);
  perform public._wip_seed_signals(v_org_id);

  perform public._wip_log(v_org_id, v_user_id, 'report_exported', jsonb_build_object(
    'format', coalesce(p_format, 'json'),
    'metadata_only', true
  ));

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'wisdom_intervention_protocol',
    'format', coalesce(p_format, 'json'),
    'philosophy',
      'Emotions influence communication — a pause can change outcomes; wisdom lives between impulse and action.',
    'mission',
      'Gently encourage reflection before emotionally charged actions — pause, reflect, decisions less likely to regret.',
    'abos_principle',
      'Wisdom = thoughtful difficult conversations; sometimes waiting until tomorrow.',
    'vision',
      'Communicate reflecting values, not temporary frustration.',
    'when_to_intervene', public._wip_when_to_intervene(),
    'response_style_examples', public._wip_response_style_examples(),
    'sleep_on_it_examples', public._wip_sleep_on_it_examples(),
    'self_love_note', public._wip_self_love_note(),
    'wisdom_engine_note', public._wip_wisdom_engine_note(),
    'boundaries', public._wip_boundaries(),
    'trust_note', public._wip_trust_note(),
    'settings', row_to_json(v_settings)::jsonb,
    'recent_signals', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'signal_type', s.signal_type,
          'summary', s.summary,
          'suggested_intervention', s.suggested_intervention,
          'user_action', s.user_action,
          'created_at', s.created_at
        ) order by s.created_at desc
      )
      from public.organization_wisdom_intervention_signals s
      where s.organization_id = v_org_id
      order by s.created_at desc
      limit 50
    ), '[]'::jsonb),
    'summary', jsonb_build_object(
      'signal_count', coalesce((
        select count(*) from public.organization_wisdom_intervention_signals where organization_id = v_org_id
      ), 0)
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('wisdom_intervention.manage'),
      'can_export', true
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Audit allowlist extension
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
    'pcp_settings_changed', 'pcp_comfort_moment_recorded', 'pcp_report_exported',
    'hpe_settings_changed', 'hpe_reflection_acknowledged', 'hpe_report_exported',
    'wip_settings_changed', 'wip_outcome_recorded', 'wip_report_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed'
    or p_action_type like 'owe_%' or p_action_type like 'pce_%' or p_action_type like 'gee_%'
    or p_action_type like 'pfe_%' or p_action_type like 'pve_%' or p_action_type like 'ihe_%'
    or p_action_type like 'cie_%' or p_action_type like 'ime_%' or p_action_type like 'gre_%'
    or p_action_type like 'pcp_%' or p_action_type like 'hpe_%' or p_action_type like 'wip_%';
$$;

-- ---------------------------------------------------------------------------
-- 11. KC category seed
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'wisdom-intervention-protocol', 'Wisdom Intervention Protocol',
  'Pre-send reflection prompts, sleep-on-it nudges, and emotional charge detection scaffold — perspective not control.',
  'authenticated', 113
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'wisdom-intervention-protocol' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 12. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_wisdom_intervention_protocol_card() to authenticated;
grant execute on function public.get_wisdom_intervention_protocol_dashboard() to authenticated;
grant execute on function public.update_wisdom_intervention_settings(jsonb) to authenticated;
grant execute on function public.record_wisdom_intervention_outcome(text, text, text, text, jsonb) to authenticated;
grant execute on function public.suggest_wisdom_intervention(text) to authenticated;
grant execute on function public.export_wisdom_intervention_report(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 13. Seed settings + sample data per org
-- ---------------------------------------------------------------------------
do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._wip_ensure_settings(v_org_id);
    perform public._wip_seed_prompts(v_org_id);
    perform public._wip_seed_signals(v_org_id);
  end loop;
end; $$;
