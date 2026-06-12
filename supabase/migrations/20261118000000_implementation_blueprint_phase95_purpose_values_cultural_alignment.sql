-- Implementation Blueprint Phase 95 — Purpose, Values & Cultural Alignment Engine
-- Extends Purpose & Values Engine Phase A.82 + Blueprint Phase 64. No new tables.
-- Distinct from Sales Expert Operating System A.95 at /app/sales-expert-engine (phase number collision).

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._pvcaebp95_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 95 — Purpose, Values & Cultural Alignment Engine at /app/purpose-values-engine. Extends Purpose & Values Engine Phase A.82 and preserves Blueprint Phase 64 (_pvbp_*) metadata. Phase 95 = cultural alignment framing — align everyday actions with values and purpose; strengthen belonging. Distinct from Sales Expert Operating System A.95 at /app/sales-expert-engine (phase number collision only). Helpers use _pvcaebp95_* — never collide with _pve_* or _pvbp_*. All A.82 and Phase 64 dashboard fields preserved.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._pvcaebp95_mission()
returns text language sql immutable as $$
  select 'Align everyday actions with values and purpose; strengthen belonging.';
$$;

create or replace function public._pvcaebp95_philosophy()
returns text language sql immutable as $$
  select 'Culture is daily experience; purpose provides direction in uncertainty. Alignment not control — values guide choices through everyday practice, not surveillance.';
$$;

create or replace function public._pvcaebp95_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — alignment not control. Purpose and values guide everyday choices; culture is practiced through actions, not scored in secret. Aipify informs and prepares; humans decide.';
$$;

create or replace function public._pvcaebp95_vision()
returns text language sql immutable as $$
  select 'We know who we are, why we exist and how we aspire to treat one another.';
$$;

create or replace function public._pvcaebp95_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'daily_values_alignment', 'label', 'Daily values alignment', 'description', 'Connect everyday work to stated values and organizational purpose'),
    jsonb_build_object('key', 'belonging_strengthening', 'label', 'Belonging strengthening', 'description', 'Strengthen belonging through shared purpose and respectful cultural awareness'),
    jsonb_build_object('key', 'purpose_direction', 'label', 'Purpose direction', 'description', 'Provide purpose-driven direction when priorities or context are uncertain'),
    jsonb_build_object('key', 'cultural_awareness', 'label', 'Cultural awareness', 'description', 'Observe cultural patterns with awareness — never judgment or hidden scoring'),
    jsonb_build_object('key', 'onboarding_integration', 'label', 'Onboarding integration', 'description', 'Connect purpose and values to install onboarding and employee knowledge paths'),
    jsonb_build_object('key', 'recognition_reinforcement', 'label', 'Recognition reinforcement', 'description', 'Reinforce value-aligned recognition, service, collaboration, and stewardship')
  );
$$;

create or replace function public._pvcaebp95_purpose_questions()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Purpose questions — direction in uncertainty, not compliance evaluation.',
    'questions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'work_beyond_outcomes', 'question', 'Why does this work matter beyond immediate outcomes?', 'description', 'Connect daily tasks to organizational purpose — meaningful progress, not mere efficiency'),
      jsonb_build_object('emoji', '🌹', 'key', 'purpose_in_uncertainty', 'question', 'How does our purpose guide us when the path is uncertain?', 'description', 'Purpose provides direction when priorities shift or context is unclear'),
      jsonb_build_object('emoji', '❤️', 'key', 'culture_fade', 'question', 'What would teammates miss if our culture faded?', 'description', 'Belonging and shared identity — connection to something larger than tasks'),
      jsonb_build_object('emoji', '🔔', 'key', 'reconnect_values', 'question', 'When should we pause to reconnect with our stated values?', 'description', 'Gentle reminder — reflection prompts are optional; humans decide')
    ),
    'reflection_note', 'Questions invite purpose reflection — humans decide what to pursue; Aipify scaffolds alignment context only.'
  );
$$;

create or replace function public._pvcaebp95_values_reflection_questions()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Values reflection questions — close the gap between intention and behavior.',
    'questions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'actions_reflect_values', 'question', 'Do our daily actions reflect what we claim to value?', 'description', 'Honest reflection — awareness not judgment'),
      jsonb_build_object('emoji', '🌹', 'key', 'intentional_practice', 'question', 'Which value deserves more intentional practice this week?', 'description', 'Focus one value at a time — practical, not decorative'),
      jsonb_build_object('emoji', '❤️', 'key', 'strengthen_belonging', 'question', 'How can we treat one another in ways that strengthen belonging?', 'description', 'Cross-link Inclusion & Humanity A.83 Human Values Charter'),
      jsonb_build_object('emoji', '🔔', 'key', 'intention_behavior_gap', 'question', 'What small habit would close the gap between intention and behavior?', 'description', 'Sustainable pacing — Self Love A.76 cross-link')
    ),
    'reflection_note', 'Values reflection encourages dialogue — never surveillance or compliance scoring.'
  );
$$;

create or replace function public._pvcaebp95_cultural_observations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Cultural observations — awareness not judgment. Metadata patterns only; never individual scoring or public ranking.',
    'observations', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'key', 'value_aligned_wins', 'label', 'Value-aligned wins', 'description', 'Celebration patterns and alignment signal summaries — metadata only'),
      jsonb_build_object('emoji', '❤️', 'key', 'belonging_signals', 'label', 'Belonging signals', 'description', 'Inclusion and belonging patterns in team interactions — cross-link Inclusion A.83'),
      jsonb_build_object('emoji', '🦉', 'key', 'purpose_in_decisions', 'label', 'Purpose in decisions', 'description', 'Purpose references in decisions and communications — aggregate metadata'),
      jsonb_build_object('emoji', '🔔', 'key', 'reflection_engagement', 'label', 'Reflection engagement', 'description', 'Reflection prompts acknowledged or deferred — human choice respected always')
    ),
    'boundary_note', 'Observations encourage conversation — never surveillance framing, hidden cultural scores, or behavioral metrics.'
  );
$$;

create or replace function public._pvcaebp95_onboarding_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Onboarding connection — purpose and values articulated during install onboarding and employee knowledge paths.',
    'practices', jsonb_build_array(
      'Install onboarding (A.22) introduces organizational purpose during setup — cross-link only',
      'Employee Knowledge Engine onboarding paths reference stated values and purpose',
      'Purpose statement visible during tenant onboarding wizard — metadata only',
      'New team members connect daily work to organizational purpose through EKE paths'
    ),
    'install_route', '/app/install',
    'eke_route', '/app/settings/employee-knowledge',
    'boundary_note', 'Onboarding scaffolds purpose articulation — humans define values; Aipify prepares context.'
  );
$$;

create or replace function public._pvcaebp95_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion guidance — scaffold purpose and values reflection; never enforce compliance or hidden cultural scoring.',
    'companion_name', 'Companion',
    'not_label', 'culture enforcer',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'purpose_context', 'prompt', 'Before this decision, would reflecting on your stated purpose feel helpful?', 'consideration', 'Purpose provides direction in uncertainty — humans decide'),
      jsonb_build_object('emoji', '🌹', 'key', 'values_practice', 'prompt', 'Your team named compassion as a core value — would a brief check-in on how that shows up this week feel supportive?', 'consideration', 'Awareness not judgment — optional reflection'),
      jsonb_build_object('emoji', '❤️', 'key', 'belonging_strengthen', 'prompt', 'A recent value-aligned win may strengthen belonging — shall I highlight it for recognition?', 'consideration', 'Cross-link Gratitude & Recognition A.89 — celebrate, do not rank')
    ),
    'boundary_note', 'Companion scaffolds alignment context — never assigns cultural scores or mandatory values compliance.'
  );
$$;

create or replace function public._pvcaebp95_recognition_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Recognition connection — value-aligned celebration of service, collaboration, and stewardship.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'key', 'values', 'label', 'Values', 'description', 'Celebrate actions that embody stated organizational values'),
      jsonb_build_object('key', 'service', 'label', 'Service', 'description', 'Recognize customer-care and service excellence aligned with purpose'),
      jsonb_build_object('key', 'collaboration', 'label', 'Collaboration', 'description', 'Team achievements that reinforce cultural aspirations'),
      jsonb_build_object('key', 'stewardship', 'label', 'Stewardship', 'description', 'Long-term care for people, purpose, and organizational identity')
    ),
    'gratitude_route', '/app/gratitude-recognition-engine',
    'boundary_note', 'Recognition reinforces culture — metadata summaries only; cross-link Gratitude A.89, no public ranking.'
  );
$$;

create or replace function public._pvcaebp95_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — sustainable pacing and reflection on how daily work connects to purpose.',
    'practices', jsonb_build_array(
      'Reflection on how daily work connects to organizational purpose',
      'Sustainable pacing — never sacrifice values under pressure',
      'Appreciation of steady progress toward stated purpose',
      'Connection to something larger without perfection pressure'
    ),
    'journey_phrase', 'The work you do contributes to the purpose your organization has chosen — at a human pace.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports sustainable rhythms — principle only; Cultural Alignment Blueprint stores organizational metadata, not wellbeing content.'
  );
$$;

create or replace function public._pvcaebp95_leadership_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership connection — consistency, purpose reflection, and cultural dialogue. Aggregate metadata only.',
    'practices', jsonb_build_array(
      'Leadership models stated values in daily decisions — consistency over slogans',
      'Purpose reflection prompts before strategic and operational choices',
      'Cultural strength observations encourage dialogue — never surveillance',
      'Cross-link Strategic Alignment A.55 and Blueprint Phase 68 organizational alignment'
    ),
    'strategic_alignment_route', '/app/strategic-alignment-engine',
    'boundary_note', 'Leadership sees aggregate alignment signals — no hidden individual cultural scores.'
  );
$$;

create or replace function public._pvcaebp95_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparent cultural alignment — alignment not control.',
    'users_should_see', jsonb_build_array(
      'How cultural observations are derived — metadata patterns only, awareness not judgment',
      'Optional reflection prompts — leaders and team members control enablement',
      'How purpose statements shape values-aware companion framing — explainability included',
      'Human control — acknowledge or dismiss reflection prompts; no silent value enforcement'
    ),
    'operators_should_understand', jsonb_build_array(
      'Cultural alignment is scaffolding — not automated policy enforcement or compliance tracking',
      'Observations are illustrative metadata — not performance surveillance or hidden scoring',
      'Cross-links Trust & Reputation Engine — ethical consistency reinforces stated values',
      'Cross-links AI Ethics A.46 — companion governance distinct from tenant purpose/values'
    ),
    'audit_note', 'Settings changes, value updates, and reflection actions are audited — metadata only.'
  );
$$;

create or replace function public._pvcaebp95_privacy_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Privacy principles — alignment not control in cultural alignment.',
    'forbidden', jsonb_build_array(
      'Hidden cultural scoring or individual behavior metrics',
      'Public ranking, leaderboards, or values-as-compliance framing',
      'Surveillance-based cultural evaluation or mandatory participation tracking',
      'Punishment framing for misalignment, incomplete reflection, or slow adoption'
    ),
    'required', jsonb_build_array(
      'Voluntary reflection prompts — human consent for material behavior changes',
      'Transparent cultural observation sources — explainable metadata only',
      'Aggregate leadership insights — no individual surveillance',
      'Companion alignment tone — supportive, not compliance-driven'
    ),
    'boundary_note', 'Aipify scaffolds cultural alignment — individuals and organizations retain agency.'
  );
$$;

create or replace function public._pvcaebp95_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates purpose, values, and cultural alignment patterns internally before customer rollout.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — companion philosophy, Self Love rhythms, Sales Expert stewardship, leadership consistency, community belonging',
      'focus', jsonb_build_array(
        'Companion philosophy — augment people, humans decide',
        'Self Love sustainable pacing in daily operations',
        'Sales Expert stewardship — ethical consistency and customer care in sales culture',
        'Leadership consistency — purpose reflection before strategic decisions',
        'Community belonging — value-aligned wins celebrated in metadata summaries'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce purpose values and customer-care culture',
      'focus', jsonb_build_array(
        'Customer obsession as stated value in commerce operations',
        'Purpose statement connected to commerce operational priorities',
        'Value-aligned celebration of service wins — metadata only',
        'Belonging through shared commerce purpose and team collaboration'
      )
    )
  );
$$;

create or replace function public._pvcaebp95_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We know who we are, why we exist and how we aspire to treat one another.',
    'Culture is daily experience — purpose provides direction in uncertainty.',
    'Alignment not control — values guide choices through everyday practice.',
    'The work you do contributes to the purpose your organization has chosen.',
    'Awareness not judgment — cultural observations encourage dialogue, never surveillance.',
    'Technology strengthens identity — it does not replace it. Humans decide; Aipify informs and prepares.'
  );
$$;

create or replace function public._pvcaebp95_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'blueprint_phase64', 'label', 'Purpose & Values (Blueprint Phase 64)', 'route', '/app/purpose-values-engine', 'note', 'Preserved — Phase 95 layers cultural alignment on A.82 + Phase 64'),
    jsonb_build_object('key', 'strategic_alignment_a55', 'label', 'Strategic Alignment Engine (A.55)', 'route', '/app/strategic-alignment-engine', 'note', 'Strategic objectives — cross-link Blueprint Phase 68 organizational alignment'),
    jsonb_build_object('key', 'inclusion_humanity_a83', 'label', 'Inclusion & Humanity (A.83)', 'route', '/app/inclusion-humanity-engine', 'note', 'Human Values Charter vs tenant purpose/values'),
    jsonb_build_object('key', 'companion_identity_a84', 'label', 'Companion Identity (A.84)', 'route', '/app/companion-identity-engine', 'note', 'Unified companion identity and behavioral standards'),
    jsonb_build_object('key', 'business_dna_a46', 'label', 'Business DNA Engine (A.46)', 'route', '/app/settings/business-dna', 'note', 'Operational tone and templates — distinct from purpose/values'),
    jsonb_build_object('key', 'install_onboarding_a22', 'label', 'Install Onboarding (A.22)', 'route', '/app/install', 'note', 'Install-first onboarding — purpose articulation during setup'),
    jsonb_build_object('key', 'employee_knowledge_eke', 'label', 'Employee Knowledge Engine (EKE)', 'route', '/app/settings/employee-knowledge', 'note', 'Employee onboarding paths and internal knowledge'),
    jsonb_build_object('key', 'organizational_memory_a34', 'label', 'Organizational Memory (A.34 / Blueprint 94)', 'route', '/app/organizational-memory-engine', 'note', 'Legacy, lessons learned — cross-link only'),
    jsonb_build_object('key', 'ai_ethics_a46', 'label', 'AI Ethics & Responsible Use (A.46)', 'route', '/app/ai-ethics-responsible-use-engine', 'note', 'Companion governance — distinct from tenant values'),
    jsonb_build_object('key', 'gratitude_recognition_a89', 'label', 'Gratitude & Recognition (A.89)', 'route', '/app/gratitude-recognition-engine', 'note', 'Value-aligned celebration — cross-link only'),
    jsonb_build_object('key', 'self_love_a76', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Reflection and sustainable pacing — principle only'),
    jsonb_build_object('key', 'sales_expert_a95', 'label', 'Sales Expert Operating System (A.95)', 'route', '/app/sales-expert-engine', 'note', 'Sales culture stewardship — phase number collision only'),
    jsonb_build_object('key', 'trust_reputation', 'label', 'Trust & Reputation Engine', 'route', '/app/trust-reputation-engine', 'note', 'Ethical consistency reinforces stated values'),
    jsonb_build_object('key', 'organizational_health_a56', 'label', 'Organizational Health (A.56)', 'route', '/app/organizational-health-engine', 'note', 'Culture and wellbeing — cross-link only')
  );
$$;

create or replace function public._pvcaebp95_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_pvbp jsonb;
begin
  v_pvbp := public._pvbp_engagement_summary(p_org_id);

  return jsonb_build_object(
    'purpose_questions', jsonb_array_length(public._pvcaebp95_purpose_questions()->'questions'),
    'values_reflection_questions', jsonb_array_length(public._pvcaebp95_values_reflection_questions()->'questions'),
    'cultural_observations', jsonb_array_length(public._pvcaebp95_cultural_observations()->'observations'),
    'companion_guidance_examples', jsonb_array_length(public._pvcaebp95_companion_guidance()->'examples'),
    'recognition_dimensions', jsonb_array_length(public._pvcaebp95_recognition_connection()->'dimensions'),
    'privacy_forbidden_count', jsonb_array_length(public._pvcaebp95_privacy_principles()->'forbidden'),
    'integration_links', jsonb_array_length(public._pvcaebp95_integration_links()),
    'phase64_engagement', v_pvbp,
    'privacy_note', 'Metadata only — purpose/values counts, cultural observation scaffolds, and Phase 64 engagement. No hidden cultural scoring, no individual behavior metrics, no PII.'
  );
end; $$;

create or replace function public._pvcaebp95_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_active_values int := 0;
  v_has_purpose boolean := false;
begin
  v_engagement := public._pvcaebp95_engagement_summary(p_org_id);
  v_active_values := coalesce((v_engagement->'phase64_engagement'->>'active_stated_values')::int, 0);
  v_has_purpose := coalesce((v_engagement->'phase64_engagement'->>'has_purpose_statement')::boolean, false);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'daily_values_alignment',
      'label', 'Daily values alignment — purpose questions and values reflection documented',
      'met', jsonb_array_length(public._pvcaebp95_purpose_questions()->'questions') >= 4
        and jsonb_array_length(public._pvcaebp95_values_reflection_questions()->'questions') >= 4,
      'note', '🦉🌹❤️🔔 purpose and values reflection questions — awareness not judgment.'
    ),
    jsonb_build_object(
      'key', 'belonging_strengthening',
      'label', 'Belonging strengthening — cultural observations and recognition connection',
      'met', jsonb_array_length(public._pvcaebp95_cultural_observations()->'observations') >= 4
        and jsonb_array_length(public._pvcaebp95_recognition_connection()->'dimensions') >= 4,
      'note', 'Cross-link Gratitude A.89 and Inclusion A.83 — no public ranking.'
    ),
    jsonb_build_object(
      'key', 'purpose_direction',
      'label', 'Purpose direction — purpose statement or discovery questions active',
      'met', v_has_purpose or jsonb_array_length(public._pvcaebp95_purpose_questions()->'questions') >= 4,
      'note', case when not v_has_purpose then 'Define an organizational purpose statement in settings.' else null end
    ),
    jsonb_build_object(
      'key', 'cultural_awareness',
      'label', 'Cultural awareness — observations scaffolded without judgment framing',
      'met', jsonb_array_length(public._pvcaebp95_cultural_observations()->'observations') >= 4,
      'note', 'Awareness not judgment — metadata patterns only.'
    ),
    jsonb_build_object(
      'key', 'onboarding_integration',
      'label', 'Onboarding integration — install and EKE cross-links documented',
      'met', (public._pvcaebp95_onboarding_connection()->>'principle') is not null,
      'note', 'Install A.22 and EKE employee onboarding — cross-link only.'
    ),
    jsonb_build_object(
      'key', 'recognition_reinforcement',
      'label', 'Recognition reinforcement — values, service, collaboration, stewardship',
      'met', jsonb_array_length(public._pvcaebp95_recognition_connection()->'dimensions') >= 4,
      'note', 'Celebrate value-aligned wins — metadata summaries only.'
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Companion guidance — alignment not control',
      'met', jsonb_array_length(public._pvcaebp95_companion_guidance()->'examples') >= 3,
      'note', 'Companion scaffolds reflection — never cultural scoring or compliance enforcement.'
    ),
    jsonb_build_object(
      'key', 'leadership_connection',
      'label', 'Leadership connection — consistency and purpose reflection documented',
      'met', jsonb_array_length(public._pvcaebp95_leadership_connection()->'practices') >= 4,
      'note', 'Aggregate metadata only — cross-link Strategic Alignment A.55.'
    ),
    jsonb_build_object(
      'key', 'privacy_principles',
      'label', 'Privacy principles — no hidden scoring, public ranking, or values-as-compliance',
      'met', jsonb_array_length(public._pvcaebp95_privacy_principles()->'forbidden') >= 4,
      'note', 'Alignment not control.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — transparent cultural alignment experience',
      'met', jsonb_array_length(public._pvcaebp95_trust_connection()->'users_should_see') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — sustainable pacing and purpose reflection',
      'met', (public._pvcaebp95_self_love_connection()->>'journey_phrase') is not null,
      'note', 'The work you do contributes to purpose — at a human pace.'
    ),
    jsonb_build_object(
      'key', 'phase64_preserved',
      'label', 'Blueprint Phase 64 purpose & values preserved',
      'met', jsonb_array_length(public._pvbp_objectives()) >= 6,
      'note', 'Phase 64 metadata intact alongside Phase 95 cultural alignment.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links Strategic Alignment, Inclusion, Companion Identity, Business DNA, Org Memory, Ethics, Gratitude, Self Love, Sales Expert',
      'met', jsonb_array_length(public._pvcaebp95_integration_links()) >= 12,
      'note', 'Extend related engines — do not duplicate tenant DNA or governance logic.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — companion philosophy, Self Love, Sales Expert stewardship, leadership, community',
      'met', (public._pvcaebp95_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS principle — alignment not control',
      'met', true,
      'note', 'Purpose and values guide everyday choices — humans decide.'
    )
  );
end; $$;

create or replace function public._pvcaebp95_blueprint_block(p_org_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 95 — Purpose, Values & Cultural Alignment Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE95_PURPOSE_VALUES_CULTURAL_ALIGNMENT.md',
    'engine_phase', 'Phase A.82 Purpose & Values Engine (extends Blueprint Phase 64)',
    'route', '/app/purpose-values-engine',
    'mapping_note', 'ABOS Blueprint Phase 95 extends A.82 + Phase 64 with cultural alignment framing — align everyday actions with values and purpose; strengthen belonging. Distinct from Sales Expert A.95 (phase number collision).',
    'distinction_note', public._pvcaebp95_distinction_note(),
    'mission', public._pvcaebp95_mission(),
    'philosophy', public._pvcaebp95_philosophy(),
    'abos_principle', public._pvcaebp95_abos_principle(),
    'objectives', public._pvcaebp95_objectives(),
    'purpose_questions', public._pvcaebp95_purpose_questions(),
    'values_reflection_questions', public._pvcaebp95_values_reflection_questions(),
    'cultural_observations', public._pvcaebp95_cultural_observations(),
    'onboarding_connection', public._pvcaebp95_onboarding_connection(),
    'companion_guidance', public._pvcaebp95_companion_guidance(),
    'recognition_connection', public._pvcaebp95_recognition_connection(),
    'self_love_connection', public._pvcaebp95_self_love_connection(),
    'leadership_connection', public._pvcaebp95_leadership_connection(),
    'trust_connection', public._pvcaebp95_trust_connection(),
    'privacy_principles', public._pvcaebp95_privacy_principles(),
    'dogfooding', public._pvcaebp95_dogfooding(),
    'success_criteria', public._pvcaebp95_success_criteria(p_org_id),
    'vision', public._pvcaebp95_vision(),
    'vision_phrases', public._pvcaebp95_vision_phrases(),
    'integration_links', public._pvcaebp95_integration_links(),
    'engagement_summary', public._pvcaebp95_engagement_summary(p_org_id),
    'privacy_note', 'Cultural alignment blueprint data is metadata only — purpose/values counts, observation scaffolds, Phase 64 engagement. No hidden cultural scoring, no individual behavior metrics, no PII. Humans decide; Aipify informs and prepares.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL A.82 + Phase 64 fields; append Phase 95
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
    'privacy_note', 'Purpose and values data is metadata only — stated values, alignment signal summaries, and reflection prompts. No raw customer content, chat, or PII. Humans decide; Aipify informs and prepares.',
    'implementation_blueprint_phase95', jsonb_build_object(
      'phase', 'Phase 95 — Purpose, Values & Cultural Alignment Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE95_PURPOSE_VALUES_CULTURAL_ALIGNMENT.md',
      'engine_phase', 'Phase A.82 Purpose & Values Engine (extends Blueprint Phase 64)',
      'route', '/app/purpose-values-engine',
      'mapping_note', 'ABOS Blueprint Phase 95 extends A.82 + Phase 64 with cultural alignment framing. Distinct from Sales Expert A.95 at /app/sales-expert-engine (phase number collision).'
    ),
    'purpose_values_cultural_alignment_note', 'Purpose, Values & Cultural Alignment Engine (ABOS Phase 95) — align everyday actions with values and purpose; strengthen belonging — alignment not control.',
    'purpose_values_cultural_alignment_blueprint', public._pvcaebp95_blueprint_block(v_org_id),
    'cultural_alignment_distinction_note', public._pvcaebp95_distinction_note(),
    'cultural_alignment_mission', public._pvcaebp95_mission(),
    'cultural_alignment_philosophy', public._pvcaebp95_philosophy(),
    'cultural_alignment_abos_principle', public._pvcaebp95_abos_principle(),
    'cultural_alignment_objectives', public._pvcaebp95_objectives(),
    'cultural_alignment_purpose_questions', public._pvcaebp95_purpose_questions(),
    'cultural_alignment_values_reflection_questions', public._pvcaebp95_values_reflection_questions(),
    'cultural_alignment_cultural_observations', public._pvcaebp95_cultural_observations(),
    'cultural_alignment_onboarding_connection', public._pvcaebp95_onboarding_connection(),
    'cultural_alignment_companion_guidance', public._pvcaebp95_companion_guidance(),
    'cultural_alignment_recognition_connection', public._pvcaebp95_recognition_connection(),
    'cultural_alignment_self_love_connection', public._pvcaebp95_self_love_connection(),
    'cultural_alignment_leadership_connection', public._pvcaebp95_leadership_connection(),
    'cultural_alignment_trust_connection', public._pvcaebp95_trust_connection(),
    'cultural_alignment_privacy_principles', public._pvcaebp95_privacy_principles(),
    'cultural_alignment_dogfooding', public._pvcaebp95_dogfooding(),
    'cultural_alignment_integration_links', public._pvcaebp95_integration_links(),
    'cultural_alignment_engagement_summary', public._pvcaebp95_engagement_summary(v_org_id),
    'cultural_alignment_success_criteria', public._pvcaebp95_success_criteria(v_org_id),
    'cultural_alignment_vision', public._pvcaebp95_vision(),
    'cultural_alignment_vision_phrases', public._pvcaebp95_vision_phrases(),
    'cultural_alignment_privacy_note', 'Cultural alignment blueprint data is metadata only — no hidden cultural scoring, no individual behavior metrics, no PII. Humans decide; Aipify informs and prepares.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve A.82 + Phase 64 fields; append Phase 95 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_purpose_values_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_active_values int := 0;
  v_pending int := 0;
  v_engagement jsonb;
  v_cultural_engagement jsonb;
begin
  perform public._irp_require_permission('purpose_values.view');
  v_org_id := public._mta_require_organization();
  perform public._pve_ensure_settings(v_org_id);
  perform public._pve_seed_values(v_org_id);
  v_engagement := public._pvbp_engagement_summary(v_org_id);
  v_cultural_engagement := public._pvcaebp95_engagement_summary(v_org_id);

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
    'values_note', 'Purpose provides direction; values provide boundaries — culture practiced intentionally, not decoratively.',
    'implementation_blueprint_phase95', jsonb_build_object(
      'phase', 'Phase 95 — Purpose, Values & Cultural Alignment Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE95_PURPOSE_VALUES_CULTURAL_ALIGNMENT.md',
      'engine_phase', 'Phase A.82 Purpose & Values Engine (extends Blueprint Phase 64)',
      'route', '/app/purpose-values-engine'
    ),
    'cultural_alignment_mission', public._pvcaebp95_mission(),
    'cultural_alignment_abos_principle', public._pvcaebp95_abos_principle(),
    'cultural_alignment_engagement_summary', v_cultural_engagement,
    'cultural_alignment_note', 'Purpose, Values & Cultural Alignment Engine (ABOS Phase 95) — align everyday actions with values and purpose; strengthen belonging.',
    'cultural_alignment_vision_note', public._pvcaebp95_vision()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._pvcaebp95_distinction_note() to authenticated;
grant execute on function public._pvcaebp95_mission() to authenticated;
grant execute on function public._pvcaebp95_philosophy() to authenticated;
grant execute on function public._pvcaebp95_abos_principle() to authenticated;
grant execute on function public._pvcaebp95_vision() to authenticated;
grant execute on function public._pvcaebp95_objectives() to authenticated;
grant execute on function public._pvcaebp95_purpose_questions() to authenticated;
grant execute on function public._pvcaebp95_values_reflection_questions() to authenticated;
grant execute on function public._pvcaebp95_cultural_observations() to authenticated;
grant execute on function public._pvcaebp95_onboarding_connection() to authenticated;
grant execute on function public._pvcaebp95_companion_guidance() to authenticated;
grant execute on function public._pvcaebp95_recognition_connection() to authenticated;
grant execute on function public._pvcaebp95_self_love_connection() to authenticated;
grant execute on function public._pvcaebp95_leadership_connection() to authenticated;
grant execute on function public._pvcaebp95_trust_connection() to authenticated;
grant execute on function public._pvcaebp95_privacy_principles() to authenticated;
grant execute on function public._pvcaebp95_dogfooding() to authenticated;
grant execute on function public._pvcaebp95_vision_phrases() to authenticated;
grant execute on function public._pvcaebp95_integration_links() to authenticated;
grant execute on function public._pvcaebp95_engagement_summary(uuid) to authenticated;
grant execute on function public._pvcaebp95_success_criteria(uuid) to authenticated;
grant execute on function public._pvcaebp95_blueprint_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'purpose-values-cultural-alignment-blueprint-phase95', 'Purpose, Values & Cultural Alignment Engine (ABOS Phase 95)',
  'Purpose, Values & Cultural Alignment Engine — extends A.82 + Phase 64 with cultural alignment framing, purpose/values reflection questions, cultural observations, and alignment-not-control privacy. No hidden cultural scoring.',
  'authenticated', 126
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'purpose-values-cultural-alignment-blueprint-phase95' and tenant_id is null
);
