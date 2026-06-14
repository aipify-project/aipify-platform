-- Implementation Blueprint Phase 10 — Wisdom & Reflection Interventions Foundation
-- Spec alignment extending Wisdom Intervention Protocol (Phase A.94). No new tables.
-- Distinct from Wisdom Engine A.93 (experience synthesis) — cross-link only.

create or replace function public._wip_blueprint_intervention_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Encourage reflection before emotionally charged actions',
    'Surface trade-offs and long-term consequences',
    'Offer lessons from patterns — never preach',
    'Support long-term thinking over reactive urgency',
    'Preserve autonomy — final decision belongs to people'
  );
$$;

create or replace function public._wip_blueprint_intervention_scenarios()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'communication', jsonb_build_object(
      'label', 'Communication',
      'triggers', jsonb_build_array(
        'Excessive caps or shouting tone',
        'Aggressive or confrontational wording',
        'Emotionally charged response',
        'Late-night important emails'
      ),
      'examples', jsonb_build_array(
        'Pre-send reflection prompt before heated message',
        'Suggest save draft instead of immediate send',
        'Sleep-on-it nudge for late-night communications'
      )
    ),
    'decision', jsonb_build_object(
      'label', 'Decision',
      'triggers', jsonb_build_array(
        'High-risk approvals',
        'Organizational changes',
        'Governance and policy decisions',
        'Escalation before reflection'
      ),
      'examples', jsonb_build_array(
        'Pause before approving sensitive action',
        'Recommend second opinion on high-stakes decision',
        'Suggest revisiting org change tomorrow with clearer perspective'
      )
    ),
    'operational', jsonb_build_object(
      'label', 'Operational',
      'triggers', jsonb_build_array(
        'Repeated failed processes',
        'Burnout indicators and unsustainable pace',
        'Unsustainable operational practices',
        'Documentation neglect under pressure'
      ),
      'examples', jsonb_build_array(
        'Encourage sustainable pacing before pushing harder',
        'Suggest process review after repeated failures',
        'Gentle reminder that recovery supports long-term outcomes'
      )
    )
  );
$$;

create or replace function public._wip_blueprint_communication_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🌹',
      'category', 'self_love',
      'example', 'You have the right to feel strongly — a pause may help you respond in a way you will respect later.'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'category', 'self_love',
      'example', 'Being kind to your future self sometimes means waiting until tomorrow.'
    ),
    jsonb_build_object(
      'emoji', '🦉',
      'category', 'wisdom',
      'example', 'This message carries strong emotion — would you like to review it before sending?'
    ),
    jsonb_build_object(
      'emoji', '🦉',
      'category', 'wisdom',
      'example', 'Sometimes wisdom means sleeping on an email — clarity tomorrow, not delay today.'
    ),
    jsonb_build_object(
      'emoji', '🦉',
      'category', 'wisdom',
      'example', 'There is strength in a thoughtful response — you decide whether to send, revise, or wait.'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'category', 'self_love',
      'example', 'Tomorrow often brings clarity — sleeping on it is wisdom, not weakness.'
    )
  );
$$;

create or replace function public._wip_blueprint_sleep_on_it_principle()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Clarity, not delay — a brief pause prevents regret.',
    'practices', jsonb_build_array(
      'Save draft — do not send immediately',
      'Revisit tomorrow with fresh perspective',
      'Seek a second opinion when stakes are high',
      'Pause before escalation — clarity over urgency'
    ),
    'note', 'Sleeping on an email is wisdom, not weakness. Many people are glad they did not send that message last night.'
  );
$$;

create or replace function public._wip_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love supports patience, recovery, sustainable decisions, and self-compassion — never guilt or pressure.',
    'examples', jsonb_build_array(
      'Being kind to your future self sometimes means waiting until tomorrow',
      'Recovery and pacing matter — burnout is not a badge of honor',
      'Thoughtful responses are an act of self-respect',
      'Reduce impulsive reactions and support emotional recovery'
    ),
    'route', '/app/self-love-engine',
    'phase', 'A.76',
    'boundary', 'Self Love is a principle influencing intervention tone — Wisdom Intervention does not store wellbeing content.'
  );
$$;

create or replace function public._wip_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Interventions must be transparent, respectful, explainable, and optional — users always understand why.',
    'qualities', jsonb_build_array(
      'Transparent — users see why a nudge appeared',
      'Respectful — no judgment, no character assumptions',
      'Explainable — suggested intervention labels, not hidden logic',
      'Optional — dismiss, proceed, revise, or postpone freely'
    ),
    'metadata_only', true,
    'autonomy_note', 'You always decide. Aipify may suggest reflection or patience — never block, override, or remove your autonomy.'
  );
$$;

create or replace function public._wip_blueprint_boundaries()
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
      'Imply Aipify controls communication outcomes',
      'Assume malicious intent or judge character'
    )
  );
$$;

create or replace function public._wip_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🦉',
      'phrase', 'Communicate reflecting values, not temporary frustration — glad I did not send that email last night.'
    ),
    jsonb_build_object(
      'emoji', '🦉',
      'phrase', 'Wisdom lives between impulse and action — a short pause prevents regret.'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'phrase', 'One message can strengthen or damage trust — wisdom lives in the pause.'
    )
  );
$$;

create or replace function public._wip_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify validates reflection interventions internally first; lessons improve customer guidance.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal validation',
      'focus', jsonb_build_array(
        'Pre-send reflection on support communications',
        'Executive email sleep-on-it nudges',
        'Late-night decision pauses'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot',
      'focus', jsonb_build_array(
        'Late-night nudges in operational workflows',
        'High-risk communication reflection',
        'Caps and aggression detection in support replies'
      )
    )
  );
$$;

create or replace function public._wip_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'wisdom_engine', '/app/wisdom-engine',
    'human_oversight', '/app/human-oversight',
    'approvals', '/app/approvals',
    'self_love_engine', '/app/self-love-engine',
    'attention_guardian', '/app/assistant/attention',
    'inclusion_humanity', '/app/inclusion-humanity-engine',
    'presence_comfort_protocol', '/app/presence-comfort-protocol',
    'purpose_values', '/app/purpose-values-engine'
  );
$$;

create or replace function public._wip_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_settings public.organization_wisdom_intervention_settings;
  v_prompts int := 0;
  v_signals int := 0;
  v_outcomes int := 0;
  v_postponed int := 0;
begin
  v_settings := public._wip_ensure_settings(p_organization_id);

  select count(*) into v_prompts
  from public.organization_wisdom_intervention_prompts
  where organization_id = p_organization_id and status = 'active';

  select count(*) into v_signals
  from public.organization_wisdom_intervention_signals
  where organization_id = p_organization_id;

  select count(*) into v_outcomes
  from public.organization_wisdom_intervention_signals
  where organization_id = p_organization_id and user_action is not null;

  select count(*) into v_postponed
  from public.organization_wisdom_intervention_signals
  where organization_id = p_organization_id and user_action in ('postponed', 'revised');

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'protocol_enabled',
      'label', 'Wisdom intervention protocol is enabled for the organization',
      'met', v_settings.enabled,
      'note', case when not v_settings.enabled then 'Enable the protocol in settings.' else null end
    ),
    jsonb_build_object(
      'key', 'active_prompts',
      'label', 'Active reflection prompts are configured',
      'met', v_prompts > 0,
      'note', case when v_prompts = 0 then 'Prompt templates seed on first dashboard load.' else null end
    ),
    jsonb_build_object(
      'key', 'signals_recorded',
      'label', 'Intervention signals are recorded (metadata only)',
      'met', v_signals > 0,
      'note', case when v_signals = 0 then 'Signals appear when intervention triggers fire — metadata summaries only.' else null end
    ),
    jsonb_build_object(
      'key', 'outcomes_tracked',
      'label', 'User outcomes are tracked (postponed, revised, proceeded, dismissed)',
      'met', v_outcomes > 0,
      'note', case when v_outcomes = 0 then 'Outcomes recorded when users respond to intervention nudges.' else null end
    ),
    jsonb_build_object(
      'key', 'sleep_on_it_available',
      'label', 'Sleep-on-it and late-night nudges available when enabled',
      'met', v_settings.sleep_on_it_enabled and v_settings.late_night_nudge_enabled,
      'note', case
        when not v_settings.sleep_on_it_enabled then 'Enable sleep-on-it nudges in protocol settings.'
        when not v_settings.late_night_nudge_enabled then 'Enable late-night nudges in protocol settings.'
        else null
      end
    ),
    jsonb_build_object(
      'key', 'transparency_autonomy',
      'label', 'Transparency and autonomy messaging present in settings',
      'met', v_settings.user_autonomy_note is not null and length(trim(v_settings.user_autonomy_note)) > 0,
      'note', 'User autonomy note explains optional, explainable interventions.'
    ),
    jsonb_build_object(
      'key', 'reflection_outcomes',
      'label', 'Users benefit from reflection (postponed or revised signals)',
      'met', v_postponed > 0 or v_signals = 0,
      'note', case
        when v_signals > 0 and v_postponed = 0 then 'No postponed or revised outcomes yet — reflection may still be valuable.'
        else null
      end
    )
  );
end; $$;

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
    'philosophy', 'Intelligence = options; wisdom = perspective. A short pause prevents regret.',
    'mission', 'Pause, reflect, consider consequences — preserve human autonomy.',
    'abos_principle', 'Wisdom = thoughtful difficult conversations; sometimes waiting until tomorrow.',
    'signal_count', v_signals,
    'postponed_count', v_postponed,
    'enabled', (select enabled from public.organization_wisdom_intervention_settings where organization_id = v_org_id),
    'implementation_blueprint', jsonb_build_object(
      'phase', 10,
      'title', 'Wisdom & Reflection Interventions Foundation',
      'extends', 'Wisdom Intervention Protocol (Phase A.94)',
      'distinct_from', 'Wisdom Engine A.93 — experience synthesis; cross-link only'
    ),
    'wisdom_intervention_note', 'Wisdom & Reflection Interventions (ABOS Phase 10) — extends Wisdom Intervention Protocol (A.94). One surface at /app/wisdom-intervention-protocol.'
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
      'Intelligence = options; wisdom = perspective. A short pause prevents regret. Emotions influence communication — wisdom lives between impulse and action. Perspective, not control; human autonomy preserved.',
    'mission',
      'Pause, reflect, consider consequences — preserve human autonomy. Gently encourage reflection before emotionally charged actions.',
    'abos_principle',
      'Wisdom = thoughtful difficult conversations; sometimes waiting until tomorrow.',
    'vision',
      'Communicate reflecting values, not temporary frustration — glad I did not send that email last night.',
    'distinction_note',
      'Distinct from Wisdom Engine A.93 (experience synthesis over time), Human Oversight A.40 (approval tiers), Trust & Action Engine (sensitive policies), Inclusion & Humanity A.83 (de-escalation), and Attention Guardian TAG (focus mode). Wisdom Intervention = pre-send reflection prompts, sleep-on-it nudges, emotional charge detection scaffold (metadata signals only).',
    'implementation_blueprint', jsonb_build_object(
      'phase', 10,
      'title', 'Wisdom & Reflection Interventions Foundation',
      'extends', 'Wisdom Intervention Protocol (Phase A.94)',
      'includes', 'Pause & Reflection Protocol — one surface',
      'distinct_from', 'Wisdom Engine A.93 — experience synthesis; cross-link only',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE10_WISDOM_REFLECTION_INTERVENTIONS_FOUNDATION.md'
    ),
    'wisdom_intervention_note',
      'Wisdom & Reflection Interventions (ABOS Phase 10) — extends Wisdom Intervention Protocol (A.94). NOT Wisdom Engine A.93.',
    'intervention_principles', public._wip_blueprint_intervention_principles(),
    'intervention_scenarios', public._wip_blueprint_intervention_scenarios(),
    'communication_examples', public._wip_blueprint_communication_examples(),
    'sleep_on_it_principle', public._wip_blueprint_sleep_on_it_principle(),
    'self_love_connection', public._wip_blueprint_self_love_connection(),
    'trust_connection', public._wip_blueprint_trust_connection(),
    'vision_phrases', public._wip_blueprint_vision_phrases(),
    'dogfooding', public._wip_blueprint_dogfooding(),
    'success_criteria', public._wip_blueprint_success_criteria(v_org_id),
    'when_to_intervene', public._wip_when_to_intervene(),
    'response_style_examples', public._wip_response_style_examples(),
    'sleep_on_it_examples', public._wip_sleep_on_it_examples(),
    'self_love_note', public._wip_self_love_note(),
    'wisdom_engine_note', public._wip_wisdom_engine_note(),
    'boundaries', public._wip_blueprint_boundaries(),
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
    'integration_links', public._wip_blueprint_integration_links(),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('wisdom_intervention.manage'),
      'can_export', public._irp_has_permission('wisdom_intervention.export')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._wip_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'wisdom-intervention-protocol', 'Wisdom Intervention Protocol', 'Pre-send reflection and Pause & Reflection guidance', 'authenticated', 194
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'wisdom-intervention-protocol' and tenant_id is null);
