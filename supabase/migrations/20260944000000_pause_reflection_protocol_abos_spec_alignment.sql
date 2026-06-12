-- Phase A.94 extension — Pause & Reflection Protocol integrated into Wisdom Intervention Protocol
-- Adds companion pause/reflection dashboard fields to existing get_wisdom_intervention_* RPCs only.

create or replace function public._wip_pause_reflection_philosophy()
returns text language sql immutable as $$
  select 'People deserve grace — one moment should not define a relationship, career, or decision. Reflection without removing autonomy; space between emotion and action.';
$$;

create or replace function public._wip_human_moment_note()
returns text language sql immutable as $$
  select 'The human moment: emotions are human — anger does not make someone a bad person; hurt does not make someone weak. The goal is to be proud of the response later, not to suppress feeling strongly.';
$$;

create or replace function public._wip_pause_communication_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('scenario', 'frustrating_situation_review', 'example', 'This looks like a frustrating situation — would you like to review the message before sending?'),
    jsonb_build_object('scenario', 'save_draft', 'example', 'Saving a draft gives you space to reflect — you can revisit with a clearer mind.'),
    jsonb_build_object('scenario', 'important_comm_pause', 'example', 'This is an important communication — a brief pause may help you send what you truly mean.'),
    jsonb_build_object('scenario', 'strength_in_thoughtful_response', 'example', 'There is strength in a thoughtful response — you decide whether to send, revise, or wait.')
  );
$$;

create or replace function public._wip_self_love_rose_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phrase', 'You have the right to feel strongly — a pause may help you respond in a way you will respect later.', 'rose', true),
    jsonb_build_object('phrase', 'Being kind to your future self sometimes means waiting until tomorrow.', 'rose', true),
    jsonb_build_object('phrase', 'Tomorrow often brings clarity — sleeping on it is wisdom, not weakness.', 'rose', true)
  );
$$;

create or replace function public._wip_pause_abos_principle()
returns text language sql immutable as $$
  select 'One message can strengthen or damage trust — wisdom lives in the pause.';
$$;

create or replace function public._wip_combined_protocol_note()
returns text language sql immutable as $$
  select 'Pause & Reflection Protocol is implemented via Wisdom Intervention Protocol (A.94) — one surface at /app/wisdom-intervention-protocol. Pre-send reflection, sleep-on-it nudges, and emotional charge detection share the same gentle boundaries: suggest only, never block permanently.';
$$;

create or replace function public._wip_when_to_intervene()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'angry_email', 'label', 'Angry or heated email', 'description', 'Strong emotion detected before send — pause for perspective, not control.'),
    jsonb_build_object('key', 'excessive_caps', 'label', 'Excessive caps', 'description', 'ALL CAPS or shouting tone — suggest calmer wording.'),
    jsonb_build_object('key', 'aggressive_wording', 'label', 'Aggressive wording', 'description', 'Harsh or confrontational phrasing — gentle reflection before send.'),
    jsonb_build_object('key', 'late_night', 'label', 'Late-night decisions', 'description', 'Important communications drafted late — sleep-on-it nudge when enabled.'),
    jsonb_build_object('key', 'emotional_charge', 'label', 'Emotionally charged response', 'description', 'High emotional intensity — recommend review or save draft.'),
    jsonb_build_object('key', 'high_risk_comm', 'label', 'High-risk communication', 'description', 'Stakeholder, legal, or reputational sensitivity — extra reflection encouraged.'),
    jsonb_build_object('key', 'repeated_send_attempts', 'label', 'Repeated send attempts', 'description', 'Multiple rapid send attempts under stress — suggest pause before proceeding.')
  );
$$;

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
    'pause_reflection_philosophy', public._wip_pause_reflection_philosophy(),
    'human_moment_note', public._wip_human_moment_note(),
    'pause_communication_examples', public._wip_pause_communication_examples(),
    'self_love_rose_phrases', public._wip_self_love_rose_phrases(),
    'pause_abos_principle', public._wip_pause_abos_principle(),
    'combined_protocol_note', public._wip_combined_protocol_note(),
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
    'pause_reflection_philosophy', public._wip_pause_reflection_philosophy(),
    'human_moment_note', public._wip_human_moment_note(),
    'pause_communication_examples', public._wip_pause_communication_examples(),
    'self_love_rose_phrases', public._wip_self_love_rose_phrases(),
    'pause_abos_principle', public._wip_pause_abos_principle(),
    'combined_protocol_note', public._wip_combined_protocol_note(),
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
