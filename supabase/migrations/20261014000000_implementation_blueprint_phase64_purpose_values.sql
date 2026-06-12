-- Implementation Blueprint Phase 64 — Purpose & Values Engine
-- Extends Purpose & Values Engine Phase A.82. No new tables.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._pvbp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 64 — Purpose & Values Engine at /app/purpose-values-engine. Extends Purpose & Values Engine Phase A.82 (20260928000000_purpose_values_engine_phase_a82.sql). Distinct from Brand Identity & Personhood Standard (Aipify product naming). Distinct from Business DNA Engine at /app/settings/business-dna. Distinct from Strategic Alignment Engine A.55 at /app/strategic-alignment-engine. Distinct from AI Ethics & Responsible Use A.46 at /app/ai-ethics-responsible-use-engine. Distinct from Inclusion & Humanity A.83 — Human Values Charter vs tenant purpose/values at /app/inclusion-humanity-engine. Distinct from Impact Engine A.85 at /app/impact-engine and Growth & Evolution A.81 at /app/growth-evolution-engine. Engine helpers use _pve_* — blueprint helpers use _pvbp_* (do not collide). All A.82 dashboard fields preserved.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._pvbp_mission()
returns text language sql immutable as $$
  select 'Clarify, preserve, and actively live purpose and values in daily operations and strategic decisions.';
$$;

create or replace function public._pvbp_philosophy()
returns text language sql immutable as $$
  select 'Values are meaningful only when they influence behavior; purpose guides priorities; culture is practiced intentionally — practical, not decorative.';
$$;

create or replace function public._pvbp_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — purpose provides direction; values provide boundaries; together they shape choices over time. Aipify informs and prepares; humans decide.';
$$;

create or replace function public._pvbp_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'purpose_clarification', 'label', 'Purpose clarification', 'description', 'Articulate why the organization exists beyond financial outcomes'),
    jsonb_build_object('key', 'values_alignment', 'label', 'Values alignment', 'description', 'Connect stated values to daily operations and decisions'),
    jsonb_build_object('key', 'cultural_reinforcement', 'label', 'Cultural reinforcement', 'description', 'Celebrate value-aligned wins and reinforce expected behaviors'),
    jsonb_build_object('key', 'leadership_reflection', 'label', 'Leadership reflection', 'description', 'Purpose reflection prompts and cultural strength observations for leaders'),
    jsonb_build_object('key', 'organizational_storytelling', 'label', 'Organizational storytelling', 'description', 'Resilience moments, customer success, team achievements — stories shape culture'),
    jsonb_build_object('key', 'decision_alignment', 'label', 'Decision alignment', 'description', 'Values-aware decision support — does this choice align with stated principles?')
  );
$$;

create or replace function public._pvbp_purpose_discovery()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Purpose discovery — why the organization exists beyond financial outcomes and what positive impact it seeks.',
    'questions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'why_exist', 'question', 'Why do we exist beyond financial outcomes?', 'description', 'The fundamental reason the organization matters — problems solved and impact aspired.'),
      jsonb_build_object('emoji', '🌹', 'key', 'positive_impact', 'question', 'What positive impact do we seek to create?', 'description', 'Meaningful change for customers, communities, and stakeholders.'),
      jsonb_build_object('emoji', '❤️', 'key', 'customer_miss', 'question', 'What would customers miss if we disappeared?', 'description', 'The unique value only this organization provides — connection to something larger.')
    )
  );
$$;

create or replace function public._pvbp_values_exploration()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Values exploration — core values, expected behaviors, leadership commitments, and cultural aspirations. Practical, not decorative.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'core_values', 'label', 'Core values', 'description', 'Integrity, compassion, excellence, curiosity, responsibility — stated and lived'),
      jsonb_build_object('key', 'expected_behaviors', 'label', 'Expected behaviors', 'description', 'Operational hints that translate values into daily actions'),
      jsonb_build_object('key', 'leadership_commitments', 'label', 'Leadership commitments', 'description', 'How leaders model and reinforce stated values'),
      jsonb_build_object('key', 'cultural_aspirations', 'label', 'Cultural aspirations', 'description', 'The culture the organization intentionally builds over time')
    ),
    'example_values', jsonb_build_array('integrity', 'compassion', 'excellence', 'curiosity', 'responsibility')
  );
$$;

create or replace function public._pvbp_values_in_action()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'value_key', 'respect',
      'label', 'Respect',
      'behaviors', jsonb_build_array('Active listening in meetings and decisions', 'Constructive feedback without judgment', 'Supporting colleagues during demanding periods')
    ),
    jsonb_build_object(
      'value_key', 'innovation',
      'label', 'Innovation',
      'behaviors', jsonb_build_array('Thoughtful experimentation with clear purpose', 'Sharing ideas across teams', 'Learning from outcomes — success and setback')
    ),
    jsonb_build_object(
      'value_key', 'integrity',
      'label', 'Integrity',
      'behaviors', jsonb_build_array('Honest commitments and ethical consistency', 'Explain trade-offs openly', 'Escalate ethical concerns without delay')
    ),
    jsonb_build_object(
      'value_key', 'compassion',
      'label', 'Compassion',
      'behaviors', jsonb_build_array('Recognize effort during demanding periods', 'Sustainable pacing over urgency pressure', 'Include diverse perspectives in decisions')
    )
  );
$$;

create or replace function public._pvbp_decision_alignment()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Decision alignment — does this decision align with stated values; which principles should influence the discussion?',
    'prompts', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'prompt', 'Does this decision align with your stated values?', 'consideration', 'Review integrity, transparency, and customer care implications before proceeding.'),
      jsonb_build_object('emoji', '🌹', 'prompt', 'Which principles should influence this discussion?', 'consideration', 'Name the values that matter most for this choice — meaningful progress may require deferring efficiency-only shortcuts.'),
      jsonb_build_object('emoji', '🦉', 'prompt', 'What trade-offs matter most here?', 'consideration', 'How does trust factor into this choice — ethical consistency strengthens long-term relationships.')
    )
  );
$$;

create or replace function public._pvbp_organizational_storytelling()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizational storytelling — stories shape culture; celebrate resilience, customer success, team achievements, compassion, and innovation milestones.',
    'story_types', jsonb_build_array(
      jsonb_build_object('key', 'resilience_moments', 'label', 'Resilience moments', 'description', 'How the organization navigated challenges with integrity'),
      jsonb_build_object('key', 'customer_success', 'label', 'Customer success', 'description', 'Value-aligned wins that demonstrate purpose in action'),
      jsonb_build_object('key', 'team_achievements', 'label', 'Team achievements', 'description', 'Collaborative accomplishments that reinforce culture'),
      jsonb_build_object('key', 'compassion_milestones', 'label', 'Compassion milestones', 'description', 'Moments where care for people shaped outcomes'),
      jsonb_build_object('key', 'innovation_milestones', 'label', 'Innovation milestones', 'description', 'Thoughtful experimentation that served purpose')
    ),
    'metadata_note', 'Stories stored as metadata summaries only — no raw customer content or PII.'
  );
$$;

create or replace function public._pvbp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — reflection, appreciation, recognition of contribution, and connection to something larger.',
    'practices', jsonb_build_array(
      'Reflection on how daily work connects to organizational purpose',
      'Appreciation of steady progress — not only outcomes',
      'Recognition of individual and team contribution to stated values',
      'Connection to something larger — the work you do contributes to the purpose your organization has chosen'
    ),
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports sustainable rhythms — principle only; Purpose & Values stores organizational metadata, not personal wellbeing content.'
  );
$$;

create or replace function public._pvbp_leadership_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership insights — values engagement summaries, purpose reflection prompts, and cultural strength observations encourage dialogue.',
    'insight_types', jsonb_build_array(
      jsonb_build_object('key', 'values_engagement', 'label', 'Values engagement summaries', 'description', 'Aggregate alignment signals and stated values activity — metadata only'),
      jsonb_build_object('key', 'purpose_reflection', 'label', 'Purpose reflection prompts', 'description', 'Leadership prompts before strategic and operational decisions'),
      jsonb_build_object('key', 'cultural_strength', 'label', 'Cultural strength observations', 'description', 'Value-aligned wins and celebration patterns — never surveillance framing')
    ),
    'dialogue_note', 'Observations encourage conversation — humans decide; Aipify prepares context only.'
  );
$$;

create or replace function public._pvbp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparency about how values experiences are generated, optional elements, and how purpose statements influence companion behavior.',
    'users_should_see', jsonb_build_array(
      'How stated values and alignment signals are derived — metadata patterns only',
      'Optional reflection prompts — leaders control enablement',
      'How purpose statements shape values-aware assistance — explainability included',
      'Human control — acknowledge or dismiss reflection prompts; no silent value enforcement'
    ),
    'operators_should_understand', jsonb_build_array(
      'Purpose statements influence companion framing — not automated policy enforcement',
      'Alignment signals are illustrative metadata — not performance surveillance',
      'Cross-links Trust & Reputation Engine — ethical consistency reinforces stated values',
      'Cross-links AI Ethics A.46 — governance distinct from tenant purpose/values'
    ),
    'audit_note', 'Settings changes, value updates, and reflection actions are audited — metadata only.'
  );
$$;

create or replace function public._pvbp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates purpose and values patterns internally — companion philosophy, Sales Expert culture, leadership practices, and community experiences.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — companion philosophy, Sales Expert culture, leadership practices, community experiences',
      'focus', jsonb_build_array(
        'Companion philosophy — augment people, humans decide',
        'Sales Expert culture — customer care and ethical consistency in sales operations',
        'Leadership practices — purpose reflection before strategic decisions',
        'Community experiences — value-aligned wins celebrated in metadata summaries'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce purpose and customer obsession values',
      'focus', jsonb_build_array(
        'Customer obsession as stated value in commerce operations',
        'Transparency in support and operational decision alignment',
        'Value-aligned celebration of service wins — metadata only',
        'Purpose statement connected to commerce operational priorities'
      )
    )
  );
$$;

create or replace function public._pvbp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Preserve humanity as organizations grow — we remember why we started.',
    'Purpose provides direction; values provide boundaries — together they shape choices over time.',
    'Values influence behavior — culture practiced intentionally, not decoratively.',
    'The work you do contributes to the purpose your organization has chosen.',
    'Technology strengthens identity — it does not replace it. Humans decide; Aipify informs and prepares.'
  );
$$;

create or replace function public._pvbp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Business DNA Engine', 'route', '/app/settings/business-dna', 'note', 'Tenant products, tone, templates — distinct from organizational purpose/values'),
    jsonb_build_object('label', 'Strategic Alignment (A.55)', 'route', '/app/strategic-alignment-engine', 'note', 'Strategic objective alignment — cross-link only'),
    jsonb_build_object('label', 'AI Ethics & Responsible Use (A.46)', 'route', '/app/ai-ethics-responsible-use-engine', 'note', 'Companion governance — distinct from tenant values'),
    jsonb_build_object('label', 'Inclusion & Humanity (A.83)', 'route', '/app/inclusion-humanity-engine', 'note', 'Human Values Charter vs tenant purpose/values'),
    jsonb_build_object('label', 'Growth & Evolution (A.81)', 'route', '/app/growth-evolution-engine', 'note', 'Evolve without compromising identity — cross-link'),
    jsonb_build_object('label', 'Impact Engine (A.85)', 'route', '/app/impact-engine', 'note', 'Outcome measurement — distinct from purpose articulation'),
    jsonb_build_object('label', 'Trust & Reputation Engine', 'route', '/app/trust-reputation-engine', 'note', 'Ethical consistency reinforces stated values'),
    jsonb_build_object('label', 'Organizational Decision Support', 'route', '/app/organizational-decision-support-engine', 'note', 'Values-aware decision context'),
    jsonb_build_object('label', 'Organizational Health (A.56)', 'route', '/app/organizational-health-engine', 'note', 'Culture and wellbeing — cross-link only'),
    jsonb_build_object('label', 'Gratitude & Recognition (A.89)', 'route', '/app/gratitude-recognition-engine', 'note', 'Value-aligned celebration — cross-link only'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Reflection and sustainable pacing — principle only'),
    jsonb_build_object('label', 'Change Management (A.47)', 'route', '/app/change-management-engine', 'note', 'Values-aware change adoption')
  );
$$;

create or replace function public._pvbp_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_active_values int := 0;
  v_recent_signals int := 0;
  v_pending_reflections int := 0;
  v_has_purpose boolean := false;
begin
  select count(*) into v_active_values
  from public.organization_stated_values
  where organization_id = p_org_id and active = true;

  select count(*) into v_recent_signals
  from public.organization_values_alignment_signals
  where organization_id = p_org_id
    and created_at > now() - interval '30 days';

  select count(*) into v_pending_reflections
  from public.organization_values_reflections
  where organization_id = p_org_id and status = 'pending';

  select purpose_statement is not null into v_has_purpose
  from public.organization_purpose_values_settings
  where organization_id = p_org_id;

  return jsonb_build_object(
    'active_stated_values', coalesce(v_active_values, 0),
    'recent_alignment_signals', coalesce(v_recent_signals, 0),
    'pending_reflections', coalesce(v_pending_reflections, 0),
    'has_purpose_statement', coalesce(v_has_purpose, false),
    'purpose_discovery_questions', jsonb_array_length(public._pvbp_purpose_discovery()->'questions'),
    'values_in_action_examples', jsonb_array_length(public._pvbp_values_in_action()),
    'privacy_note', 'Metadata only — stated values counts, alignment signal summaries, and reflection prompt status. No PII or raw operational content.'
  );
end; $$;

create or replace function public._pvbp_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_active_values int := 0;
  v_has_purpose boolean := false;
begin
  v_engagement := public._pvbp_engagement_summary(p_org_id);
  v_active_values := coalesce((v_engagement->>'active_stated_values')::int, 0);
  v_has_purpose := coalesce((v_engagement->>'has_purpose_statement')::boolean, false);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'purpose_articulation',
      'label', 'Clearer purpose articulation — purpose statement and discovery questions documented',
      'met', v_has_purpose,
      'note', case when not v_has_purpose then 'Define an organizational purpose statement in settings.' else null end
    ),
    jsonb_build_object(
      'key', 'values_influence_behavior',
      'label', 'Values influence behavior — stated values with operational hints and values-in-action examples',
      'met', v_active_values >= 3,
      'note', case when v_active_values < 3 then format('%s active stated values — seed or add values with operational hints.', v_active_values) else null end
    ),
    jsonb_build_object(
      'key', 'cultural_consistency',
      'label', 'Cultural consistency — alignment signals and celebration patterns tracked',
      'met', coalesce((v_engagement->>'recent_alignment_signals')::int, 0) >= 0,
      'note', 'Alignment signals are metadata summaries — celebrate value-aligned wins.'
    ),
    jsonb_build_object(
      'key', 'employee_meaning',
      'label', 'Employee meaning — Self Love connection and purpose discovery documented',
      'met', jsonb_array_length(public._pvbp_purpose_discovery()->'questions') >= 3,
      'note', 'The work you do contributes to the purpose your organization has chosen.'
    ),
    jsonb_build_object(
      'key', 'leadership_alignment',
      'label', 'Leadership alignment — reflection prompts and leadership insights documented',
      'met', jsonb_array_length(public._pvbp_leadership_insights()->'insight_types') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'decision_alignment',
      'label', 'Decision alignment — values-aware decision prompts with companion examples',
      'met', jsonb_array_length(public._pvbp_decision_alignment()->'prompts') >= 3,
      'note', '🦉🌹 companion examples — humans decide; Aipify prepares context.'
    ),
    jsonb_build_object(
      'key', 'organizational_storytelling',
      'label', 'Organizational storytelling — story types documented for culture reinforcement',
      'met', jsonb_array_length(public._pvbp_organizational_storytelling()->'story_types') >= 5,
      'note', 'Stories shape culture — metadata summaries only.'
    ),
    jsonb_build_object(
      'key', 'objectives_documented',
      'label', 'Blueprint objectives — purpose, values, culture, leadership, storytelling, decisions',
      'met', jsonb_array_length(public._pvbp_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — transparent values experience generation documented',
      'met', jsonb_array_length(public._pvbp_trust_connection()->'users_should_see') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from Brand Identity, Business DNA, Strategic Alignment, Ethics, Inclusion, Impact, Growth',
      'met', jsonb_array_length(public._pvbp_integration_links()) >= 10,
      'note', 'Extend related engines — do not duplicate tenant DNA or governance logic.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Aipify Group companion philosophy, Sales Expert culture, leadership practices',
      'met', (public._pvbp_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS principle — purpose provides direction; values provide boundaries',
      'met', true,
      'note', 'Together they shape choices over time — humans decide.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL A.82 fields; append Phase 64
-- ---------------------------------------------------------------------------
create or replace function public.get_purpose_values_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_purpose_values_settings;
begin
  perform public._irp_require_permission('purpose_values.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._pve_ensure_settings(v_org_id);
  perform public._pve_seed_values(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Actions align with values — bridge intention and execution; meaningful progress matters as much as efficiency.',
    'mission', 'Keep organizations connected to purpose and values during daily operations, growth, and change.',
    'abos_principle', 'How you succeed matters as much as whether — purpose provides meaning, values provide direction. Aipify informs and prepares; humans decide.',
    'vision', 'The companion understands why the organization exists — technology strengthens identity, it does not replace it.',
    'distinction_note', 'Distinct from Brand Identity & Personhood Standard (Aipify product naming), Business DNA Engine (/app/settings/business-dna), Strategic Alignment Engine A.55, and AI Ethics & Responsible Use governance. This engine holds tenant organizational purpose and values for decision alignment and culture support.',
    'purpose_framework', public._pve_purpose_framework(),
    'example_values', public._pve_example_values(),
    'values_aware_assistance_examples', public._pve_values_aware_assistance_examples(),
    'decision_support_examples', public._pve_decision_support_examples(),
    'culture_support_areas', public._pve_culture_support_areas(),
    'self_love_note', 'Self Love (A.76 planned) monitors alignment overload, ambition vs wellbeing, and sustainable rhythms — never sacrifice values under pressure.',
    'trust_engine_note', 'Trust Engine integration: transparency, ethical consistency, honest communication, and responsible governance reinforce stated values.',
    'growth_evolution_note', 'Growth & Evolution (A.81 planned): evolve without compromising identity — progress without purpose equals drift.',
    'settings', row_to_json(v_settings)::jsonb,
    'stated_values', public.list_organization_stated_values(true),
    'recent_signals', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'value_key', s.value_key,
          'signal_type', s.signal_type,
          'summary', s.summary,
          'alignment_score', s.alignment_score,
          'metadata', s.metadata,
          'created_at', s.created_at
        ) order by s.created_at desc
      )
      from (
        select * from public.organization_values_alignment_signals
        where organization_id = v_org_id
        order by created_at desc
        limit 10
      ) s
    ), '[]'::jsonb),
    'pending_reflections', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', r.id,
          'prompt', r.prompt,
          'context_summary', r.context_summary,
          'suggested_considerations', r.suggested_considerations,
          'status', r.status,
          'metadata', r.metadata,
          'created_at', r.created_at,
          'updated_at', r.updated_at
        ) order by r.created_at desc
      )
      from public.organization_values_reflections r
      where r.organization_id = v_org_id and r.status = 'pending'
    ), '[]'::jsonb),
    'summary', jsonb_build_object(
      'active_values', coalesce((
        select count(*) from public.organization_stated_values
        where organization_id = v_org_id and active = true
      ), 0),
      'pending_reflections', coalesce((
        select count(*) from public.organization_values_reflections
        where organization_id = v_org_id and status = 'pending'
      ), 0),
      'recent_signals', coalesce((
        select count(*) from public.organization_values_alignment_signals
        where organization_id = v_org_id
          and created_at > now() - interval '30 days'
      ), 0),
      'has_purpose_statement', v_settings.purpose_statement is not null
    ),
    'integration_links', jsonb_build_object(
      'business_dna', '/app/settings/business-dna',
      'strategic_alignment', '/app/strategic-alignment-engine',
      'organizational_decision_support', '/app/organizational-decision-support-engine',
      'trust_reputation', '/app/trust-reputation-engine',
      'organizational_health', '/app/organizational-health-engine',
      'change_management', '/app/change-management-engine',
      'goals_okr', '/app/goals-okr-engine'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('purpose_values.manage'),
      'can_edit_values', public._irp_has_permission('purpose_values.values.edit'),
      'can_export', public._irp_has_permission('purpose_values.export')
    ),
    'implementation_blueprint_phase64', jsonb_build_object(
      'phase', 'Phase 64 — Purpose & Values Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE64_PURPOSE_VALUES.md',
      'engine_phase', 'Phase A.82 Purpose & Values Engine',
      'route', '/app/purpose-values-engine',
      'mapping_note', 'ABOS Blueprint Phase 64 extends A.82 with purpose discovery, values in action, decision alignment, organizational storytelling, leadership insights, and live success criteria.'
    ),
    'purpose_values_note', 'Purpose & Values Engine (ABOS Phase 64) — extends Phase A.82 with values-in-action framing, purpose discovery questions, organizational storytelling, and leadership reflection prompts.',
    'blueprint_distinction_note', public._pvbp_distinction_note(),
    'blueprint_mission', public._pvbp_mission(),
    'blueprint_philosophy', public._pvbp_philosophy(),
    'blueprint_abos_principle', public._pvbp_abos_principle(),
    'blueprint_objectives', public._pvbp_objectives(),
    'purpose_discovery', public._pvbp_purpose_discovery(),
    'values_exploration', public._pvbp_values_exploration(),
    'values_in_action', public._pvbp_values_in_action(),
    'decision_alignment', public._pvbp_decision_alignment(),
    'organizational_storytelling', public._pvbp_organizational_storytelling(),
    'self_love_connection', public._pvbp_self_love_connection(),
    'leadership_insights', public._pvbp_leadership_insights(),
    'trust_connection', public._pvbp_trust_connection(),
    'dogfooding', public._pvbp_dogfooding(),
    'blueprint_integration_links', public._pvbp_integration_links(),
    'engagement_summary', public._pvbp_engagement_summary(v_org_id),
    'success_criteria', public._pvbp_success_criteria(v_org_id),
    'vision_phrases', public._pvbp_vision_phrases(),
    'privacy_note', 'Purpose and values data is metadata only — stated values, alignment signal summaries, and reflection prompts. No raw customer content, chat, or PII. Humans decide; Aipify informs and prepares.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve A.82 fields; append Phase 64 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_purpose_values_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_active_values int := 0;
  v_pending int := 0;
  v_engagement jsonb;
begin
  perform public._irp_require_permission('purpose_values.view');
  v_org_id := public._mta_require_organization();
  perform public._pve_ensure_settings(v_org_id);
  perform public._pve_seed_values(v_org_id);
  v_engagement := public._pvbp_engagement_summary(v_org_id);

  select count(*) into v_active_values
  from public.organization_stated_values
  where organization_id = v_org_id and active = true;

  select count(*) into v_pending
  from public.organization_values_reflections
  where organization_id = v_org_id and status = 'pending';

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Actions align with values — bridge intention and execution for meaningful progress.',
    'active_values', v_active_values,
    'pending_reflections', v_pending,
    'enabled', (select enabled from public.organization_purpose_values_settings where organization_id = v_org_id),
    'implementation_blueprint_phase64', jsonb_build_object(
      'phase', 'Phase 64 — Purpose & Values Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE64_PURPOSE_VALUES.md',
      'engine_phase', 'Phase A.82 Purpose & Values Engine',
      'route', '/app/purpose-values-engine'
    ),
    'mission', public._pvbp_mission(),
    'abos_principle', public._pvbp_abos_principle(),
    'engagement_summary', v_engagement,
    'blueprint_note', 'Purpose & Values Engine (ABOS Phase 64) — extends A.82 with purpose discovery, values in action, and live success criteria.',
    'values_note', 'Purpose provides direction; values provide boundaries — culture practiced intentionally, not decoratively.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._pvbp_distinction_note() to authenticated;
grant execute on function public._pvbp_mission() to authenticated;
grant execute on function public._pvbp_philosophy() to authenticated;
grant execute on function public._pvbp_abos_principle() to authenticated;
grant execute on function public._pvbp_objectives() to authenticated;
grant execute on function public._pvbp_purpose_discovery() to authenticated;
grant execute on function public._pvbp_values_exploration() to authenticated;
grant execute on function public._pvbp_values_in_action() to authenticated;
grant execute on function public._pvbp_decision_alignment() to authenticated;
grant execute on function public._pvbp_organizational_storytelling() to authenticated;
grant execute on function public._pvbp_self_love_connection() to authenticated;
grant execute on function public._pvbp_leadership_insights() to authenticated;
grant execute on function public._pvbp_trust_connection() to authenticated;
grant execute on function public._pvbp_dogfooding() to authenticated;
grant execute on function public._pvbp_vision_phrases() to authenticated;
grant execute on function public._pvbp_integration_links() to authenticated;
grant execute on function public._pvbp_engagement_summary(uuid) to authenticated;
grant execute on function public._pvbp_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'purpose-values-blueprint-phase64', 'Purpose & Values Engine (ABOS Phase 64)',
  'Purpose & Values Engine — extends Phase A.82 with purpose discovery, values in action, decision alignment, organizational storytelling, leadership insights, and live success criteria.',
  'authenticated', 106
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'purpose-values-blueprint-phase64' and tenant_id is null
);
