-- Implementation Blueprint Phase 85 — Adaptive Strategic Intelligence Engine
-- Extends Strategic Intelligence Foundation Engine Phase A.31 (Phase 17 _sif_*, Phase 79 _sibp79_*). No new tables.
-- Distinct from Outcomes ROI & Success Validation repo Phase 85 at /app/outcomes (phase number collision).
-- Distinct from Impact Engine Phase A.85 at /app/impact-engine (engine phase number collision).

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._asibp85_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 85 — Adaptive Strategic Intelligence Engine at /app/strategic-intelligence-foundation-engine. Extends Strategic Intelligence Foundation Engine Phase A.31 (Phase 17 via _sif_*, Phase 79 via _sibp79_*). Distinct from Outcomes ROI & Success Validation repo Phase 85 at /app/outcomes (phase number collision). Distinct from Impact Engine Phase A.85 at /app/impact-engine (engine phase number collision). Distinct from Autonomous Operations Center repo Phase 79 at /app/operations. Distinct from Legacy Strategic Intelligence & Opportunity repo Phase 81 at /app/strategy. Distinct from Executive Insights A.35 / Blueprint Phase 82 at /app/executive-insights-engine. Distinct from Predictive Insights A.66 / Blueprint Phase 74 at /app/predictive-insights-engine. Distinct from Strategic Alignment A.55 / Blueprint Phase 68 at /app/strategic-alignment-engine. Distinct from Curiosity & Discovery A.87 / Blueprint Phase 80 at /app/curiosity-discovery-engine. Distinct from Organizational Resilience A.50 / Blueprint Phase 81 at /app/organizational-resilience-engine. Helpers: _sif_* (Phase 17), _sibp79_* (Phase 79) — Blueprint Phase 85 uses _asibp85_* only. Adaptation is strength not failure — humans decide strategy.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._asibp85_mission()
returns text language sql immutable as $$
  select 'Continuously integrate learning, reflection and emerging intelligence into future planning.';
$$;

create or replace function public._asibp85_philosophy()
returns text language sql immutable as $$
  select 'Strategies should not remain static — adaptation is strength not failure; thoughtful evolution supports enduring vision.';
$$;

create or replace function public._asibp85_abos_principle()
returns text language sql immutable as $$
  select 'Adaptive strategic intelligence emerges when organizations integrate learning into planning — Aipify informs and prepares; humans decide whether to maintain, adjust, or transform direction.';
$$;

create or replace function public._asibp85_vision()
returns text language sql immutable as $$
  select 'We are not abandoning our vision. We are learning how to pursue it more wisely.';
$$;

create or replace function public._asibp85_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'learning_integration', 'label', 'Learning integration', 'description', 'Continuously integrate learning, reflection, and emerging intelligence into future planning'),
    jsonb_build_object('key', 'continuous_strategic_review', 'label', 'Continuous strategic review', 'description', 'Regular review of priorities, outcomes, capabilities, opportunities, risks, and ecosystem context'),
    jsonb_build_object('key', 'strategic_flexibility', 'label', 'Strategic flexibility', 'description', 'Maintain, adjust, or transform direction — intentional adaptation, not reactive drift'),
    jsonb_build_object('key', 'leadership_preparedness', 'label', 'Leadership preparedness', 'description', 'Leadership insights that support adaptive decisions with transparency and humility'),
    jsonb_build_object('key', 'learning_organization', 'label', 'Learning organization connection', 'description', 'Connect strategic adaptation to execution, predictive ops, meetings, knowledge fabric, risk, and opportunity exploration'),
    jsonb_build_object('key', 'vision_stewardship', 'label', 'Vision stewardship', 'description', 'Pursue long-term vision more wisely — adaptation strengthens rather than abandons direction')
  );
$$;

create or replace function public._asibp85_adaptive_strategic_questions()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Adaptive strategic questions — encourage reflection on strategy evolution, not urgency or trend-chasing.',
    'questions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'emerging_patterns', 'question', '🦉 What emerging patterns suggest our strategy may benefit from thoughtful review — without abandoning our core vision?', 'description', 'Wisdom-driven reflection on strategic signals from metadata — not predictions.'),
      jsonb_build_object('emoji', '🌹', 'key', 'strengths_to_preserve', 'question', '🌹 What strengths should we preserve while adapting — with confidence and humility?', 'description', 'Self Love connection — adaptation builds on existing capability, not wholesale replacement.'),
      jsonb_build_object('emoji', '❤️', 'key', 'compassionate_adaptation', 'question', '❤️ What would compassionate adaptation look like — honoring our values while responding to new intelligence?', 'description', 'Values-aligned adaptation — thoughtful evolution, not reaction.'),
      jsonb_build_object('emoji', '🔔', 'key', 'assumptions_review', 'question', '🔔 Which strategic assumptions deserve review — without urgency framing or trend-chasing?', 'description', 'Bell moments for assumption review — calm, intentional leadership attention.')
    ),
    'reflection_note', 'Questions prepare dialogue — not conclusions, urgency, or autonomous strategic changes.'
  );
$$;

create or replace function public._asibp85_continuous_strategic_review()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Continuous strategic review — regular reflection across six dimensions; metadata scaffolds only.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'priorities', 'label', 'Priorities', 'description', 'Are current strategic priorities still aligned with emerging intelligence and organizational learning?'),
      jsonb_build_object('key', 'outcomes', 'label', 'Outcomes', 'description', 'What outcomes are materializing — and what do they teach about strategic assumptions?'),
      jsonb_build_object('key', 'capabilities', 'label', 'Capabilities', 'description', 'Which capabilities are strengthening or need investment to support adapted direction?'),
      jsonb_build_object('key', 'opportunities', 'label', 'Opportunities', 'description', 'What opportunities deserve exploration — cross-link Opportunity Exploration Phase 80'),
      jsonb_build_object('key', 'risks', 'label', 'Risks', 'description', 'What risks warrant navigation — cross-link Risk Navigation Phase 81'),
      jsonb_build_object('key', 'ecosystem', 'label', 'Ecosystem', 'description', 'How is the partner and market ecosystem evolving — cross-link Industry Intelligence A.44 and Simulation Lab')
    ),
    'cadence_note', 'Review cadence is organizational choice — Aipify prepares context; humans decide timing and scope.'
  );
$$;

create or replace function public._asibp85_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion guidance — thoughtful evolution not reaction; curiosity over urgency.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'learning_integration', 'prompt', '🦉 New intelligence has emerged since your last strategic review — would exploring what it suggests help inform your next planning conversation?', 'consideration', 'Learning integration — not urgency or trend-chasing.'),
      jsonb_build_object('emoji', '🌹', 'key', 'adaptation_strength', 'prompt', '🌹 Adaptation can strengthen your vision — would a summary of what to maintain versus what to adjust help?', 'consideration', 'Strategic flexibility — maintain, adjust, or transform with intention.'),
      jsonb_build_object('emoji', '🔔', 'key', 'assumption_review', 'prompt', '🔔 Several strategic assumptions may benefit from calm review — shall I prepare a context summary for leadership reflection?', 'consideration', 'Humans decide — Aipify prepares context only.')
    )
  );
$$;

create or replace function public._asibp85_learning_organization_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Learning organization connection — adaptive strategy integrates with execution, prediction, collaboration, knowledge, risk, and exploration surfaces.',
    'connections', jsonb_build_array(
      jsonb_build_object('key', 'strategic_execution', 'label', 'Strategic Execution (Blueprint Phase 69 / Goals OKR A.65)', 'route', '/app/goals-okr-engine', 'description', 'Initiative tracking and execution cascade — adapt plans into measurable progress'),
      jsonb_build_object('key', 'predictive_operations', 'label', 'Predictive Operations (A.66 / Blueprint Phase 74)', 'route', '/app/predictive-insights-engine', 'description', 'Operational patterns and preparedness — informs adaptation, not autonomous direction changes'),
      jsonb_build_object('key', 'meeting_companion', 'label', 'Meeting Companion (A.61)', 'route', '/app/meeting-collaboration-intelligence-engine', 'description', 'Meeting insights feed strategic review and assumption dialogue'),
      jsonb_build_object('key', 'knowledge_fabric', 'label', 'Enterprise Knowledge Fabric (Blueprint Phase 71 / KC A.5)', 'route', '/app/knowledge-center-engine', 'description', 'Organizational knowledge informs what to maintain and what to evolve'),
      jsonb_build_object('key', 'risk_navigation', 'label', 'Risk Navigation (Blueprint Phase 81 / Resilience A.50)', 'route', '/app/organizational-resilience-engine', 'description', 'Risk awareness supports thoughtful adaptation — not fear-driven pivots'),
      jsonb_build_object('key', 'opportunity_exploration', 'label', 'Opportunity Exploration (Blueprint Phase 80 / Curiosity A.87)', 'route', '/app/curiosity-discovery-engine', 'description', 'Exploration prompts support adaptive opportunity consideration'),
      jsonb_build_object('key', 'learning_engine', 'label', 'Learning Engine', 'route', '/app/learning', 'description', 'Approved organizational learning metadata — cross-link only, no duplicate learning storage')
    ),
    'boundary_note', 'Cross-link related engines — extend surfaces, do not duplicate strategic insight or learning storage.'
  );
$$;

create or replace function public._asibp85_strategic_flexibility()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Strategic flexibility — maintain, adjust, or transform direction through intentional adaptation.',
    'modes', jsonb_build_array(
      jsonb_build_object('key', 'maintain', 'label', 'Maintain direction', 'description', 'Continue current strategic direction with confidence — emerging intelligence confirms alignment'),
      jsonb_build_object('key', 'adjust', 'label', 'Adjust approach', 'description', 'Refine tactics and priorities while preserving core vision — thoughtful course correction'),
      jsonb_build_object('key', 'transform', 'label', 'Transform direction', 'description', 'Intentional strategic transformation when sustained evidence and leadership judgment warrant — not reactive trend-chasing')
    ),
    'adaptation_note', 'Adaptation is strength not failure — humans decide which mode applies; Aipify prepares context and learning integration.'
  );
$$;

create or replace function public._asibp85_leadership_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership insights — support adaptive decisions with transparency, not urgency or certainty.',
    'insights', jsonb_build_array(
      jsonb_build_object('emoji', '📈', 'key', 'learning_summary', 'label', 'Learning integration summary', 'description', 'What organizational learning suggests for future planning — metadata themes only'),
      jsonb_build_object('emoji', '🦉', 'key', 'assumption_signals', 'label', 'Assumption review signals', 'description', 'Strategic assumptions that may benefit from calm leadership review'),
      jsonb_build_object('emoji', '🌹', 'key', 'strengths_to_maintain', 'label', 'Strengths to maintain', 'description', 'Capabilities and momentum worth preserving during adaptation'),
      jsonb_build_object('emoji', '🔔', 'key', 'adaptation_context', 'label', 'Adaptation context', 'description', 'Context for maintain / adjust / transform dialogue — humans retain authority')
    ),
    'clarity_note', 'Insights prepare leadership dialogue — cross-link Executive Insights A.35 / Blueprint Phase 82 for executive reflection.'
  );
$$;

create or replace function public._asibp85_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — adaptation with confidence, humility, and compassion; not self-criticism for evolving strategy.',
    'practices', jsonb_build_array(
      'Confidence — adaptation can strengthen vision rather than signal failure',
      'Humility — new intelligence invites review, not certainty or shame',
      'Compassion — pursue vision more wisely, not perfectly',
      'Continuous learning — strategic evolution is organizational growth, not abandonment'
    ),
    'journey_phrase', 'We are not abandoning our vision. We are learning how to pursue it more wisely.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports thoughtful strategic adaptation — principle only; Adaptive Strategic Intelligence stores metadata, not personal wellbeing content.'
  );
$$;

create or replace function public._asibp85_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparency about learning sources, adaptation rationale scaffolds, limitations, and the distinction between intelligence and strategic decisions.',
    'leaders_should_know', jsonb_build_array(
      'Which metadata and learning sources contributed to adaptive strategic context',
      'Strategic flexibility modes (maintain / adjust / transform) are human decisions — not Aipify recommendations executed autonomously',
      'Limitation principles block urgency framing, trend-chasing, and constant instability',
      'Adaptation scaffolds are possibilities for reflection — not conclusions or mandates'
    ),
    'organizations_should_understand', jsonb_build_array(
      'Adaptive strategic intelligence integrates learning into planning — metadata only, no raw customer records',
      'Distinct from Outcomes Phase 85 (/app/outcomes), Impact Engine A.85 (/app/impact-engine), and legacy /app/strategy Phase 81',
      'Thoughtful evolution not reaction — avoid constant instability and trend-chasing',
      'Humans decide strategy — Aipify informs, prepares, and recommends context for adaptation'
    ),
    'audit_note', 'Strategic review context and insight workflows logged via _sif_log — metadata only.'
  );
$$;

create or replace function public._asibp85_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Limitation principles — thoughtful evolution not reaction; avoid constant instability, chasing trends, and urgency framing.',
    'forbidden', jsonb_build_array(
      'Constant strategic instability or perpetual pivot messaging',
      'Trend-chasing without evidence or leadership judgment',
      'Urgency framing that pressures rapid strategic changes',
      'Autonomous strategic direction changes without human approval',
      'Adaptation presented as failure or abandonment of vision'
    ),
    'required', jsonb_build_array(
      'Maintain / adjust / transform framed as intentional human choices',
      'Transparent learning source attribution and confidence metadata',
      'Calm, reflective copy — adaptation is strength not failure',
      'Vision stewardship — pursue direction more wisely, not reactively',
      'Human leadership retains strategic authority'
    ),
    'boundary_note', 'Aipify integrates learning into planning — humans decide whether and how to adapt.'
  );
$$;

create or replace function public._asibp85_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates adaptive strategic intelligence patterns internally before customer rollout.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — ecosystem development, product roadmap adaptation, Sales Expert ecosystem evolution, companion philosophy',
      'focus', jsonb_build_array(
        'Ecosystem development and partner ecosystem strategic adaptation signals',
        'Product roadmap learning integration and intentional course adjustments',
        'Sales Expert ecosystem growth and marketplace evolution patterns',
        'Companion philosophy evolution — maintain, adjust, transform product direction wisely'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce strategic adaptation',
      'focus', jsonb_build_array(
        'Commerce adoption learning integration into strategic planning',
        'Support and customer success themes informing adaptive priorities',
        'Capability strengthening patterns during market evolution',
        'Opportunity and risk signals for leadership review cadence'
      )
    )
  );
$$;

create or replace function public._asibp85_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We are not abandoning our vision. We are learning how to pursue it more wisely.',
    'Adaptation is strength not failure.',
    'Strategies should not remain static — thoughtful evolution supports enduring direction.',
    'Maintain, adjust, or transform — intentional adaptation, not reactive drift.',
    'Thoughtful evolution not reaction — avoid constant instability and trend-chasing.',
    'Humans decide strategy — Aipify integrates learning and prepares context.'
  );
$$;

create or replace function public._asibp85_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Strategic Alignment (A.55 / Blueprint 68)', 'route', '/app/strategic-alignment-engine', 'note', 'Objectives alignment — informs maintain/adjust/transform dialogue'),
    jsonb_build_object('label', 'Executive Insights (A.35 / Blueprint 82)', 'route', '/app/executive-insights-engine', 'note', 'Executive reflection and leadership insights — cross-link only'),
    jsonb_build_object('label', 'Predictive Operations (A.66 / Blueprint 74)', 'route', '/app/predictive-insights-engine', 'note', 'Operational patterns — informs adaptation, not autonomous direction'),
    jsonb_build_object('label', 'Opportunity Exploration (A.87 / Blueprint 80)', 'route', '/app/curiosity-discovery-engine', 'note', 'Exploration prompts for adaptive opportunity consideration'),
    jsonb_build_object('label', 'Risk Navigation (A.50 / Blueprint 81)', 'route', '/app/organizational-resilience-engine', 'note', 'Risk awareness — thoughtful adaptation, not fear-driven pivots'),
    jsonb_build_object('label', 'Strategic Execution (Blueprint 69 / A.65)', 'route', '/app/goals-okr-engine', 'note', 'Execution cascade — adapt plans into measurable progress'),
    jsonb_build_object('label', 'Enterprise Knowledge Fabric (Blueprint 71 / KC A.5)', 'route', '/app/knowledge-center-engine', 'note', 'Organizational knowledge — what to maintain and evolve'),
    jsonb_build_object('label', 'Meeting Companion (A.61)', 'route', '/app/meeting-collaboration-intelligence-engine', 'note', 'Meeting insights feed strategic review'),
    jsonb_build_object('label', 'Learning Engine', 'route', '/app/learning', 'note', 'Approved organizational learning — cross-link only'),
    jsonb_build_object('label', 'Simulation Lab (Phase 78 / Blueprint 22)', 'route', '/app/simulations', 'note', 'Scenario modeling for ecosystem and strategic adaptation context'),
    jsonb_build_object('label', 'Strategic Intelligence Phase 79', 'route', '/app/strategic-intelligence-foundation-engine', 'note', 'Phase 79 strategic awareness — layered beneath Phase 85 adaptation'),
    jsonb_build_object('label', 'Outcomes ROI (Repo Phase 85)', 'route', '/app/outcomes', 'note', 'Outcome validation — distinct ABOS blueprint surface (phase number collision)'),
    jsonb_build_object('label', 'Impact Engine (A.85)', 'route', '/app/impact-engine', 'note', 'Impact orchestration — distinct engine phase (A.85 collision)'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Confidence and compassion in adaptation — principle only')
  );
$$;

create or replace function public._asibp85_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_sibp79 jsonb;
  v_total int := 0;
  v_completed int := 0;
begin
  v_sibp79 := public._sibp79_engagement_summary(p_organization_id);
  v_total := coalesce((v_sibp79->>'total_insights')::int, 0);
  v_completed := coalesce((v_sibp79->>'completed_insights')::int, 0);

  return jsonb_build_object(
    'total_insights', v_total,
    'completed_insights', v_completed,
    'adaptive_questions', jsonb_array_length(public._asibp85_adaptive_strategic_questions()->'questions'),
    'review_dimensions', jsonb_array_length(public._asibp85_continuous_strategic_review()->'dimensions'),
    'flexibility_modes', jsonb_array_length(public._asibp85_strategic_flexibility()->'modes'),
    'learning_connections', jsonb_array_length(public._asibp85_learning_organization_connection()->'connections'),
    'companion_examples', jsonb_array_length(public._asibp85_companion_guidance()->'examples'),
    'leadership_insight_types', jsonb_array_length(public._asibp85_leadership_insights()->'insights'),
    'integration_links', jsonb_array_length(public._asibp85_integration_links()),
    'privacy_note', 'Metadata only — insight counts, review scaffolds, and adaptation context. No raw customer content or PII.'
  );
end; $$;

create or replace function public._asibp85_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_total int := 0;
begin
  v_engagement := public._asibp85_engagement_summary(p_organization_id);
  v_total := coalesce((v_engagement->>'total_insights')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'learning_integration',
      'label', 'Learning integration — adaptive strategic questions documented',
      'met', jsonb_array_length(public._asibp85_adaptive_strategic_questions()->'questions') >= 4,
      'note', '🦉🌹❤️🔔 reflection questions — not urgency or conclusions.'
    ),
    jsonb_build_object(
      'key', 'continuous_review',
      'label', 'Continuous strategic review — six dimensions documented',
      'met', jsonb_array_length(public._asibp85_continuous_strategic_review()->'dimensions') >= 6,
      'note', 'Priorities, outcomes, capabilities, opportunities, risks, ecosystem.'
    ),
    jsonb_build_object(
      'key', 'strategic_flexibility',
      'label', 'Strategic flexibility — maintain / adjust / transform modes documented',
      'met', jsonb_array_length(public._asibp85_strategic_flexibility()->'modes') >= 3,
      'note', 'Intentional adaptation — not reactive drift or trend-chasing.'
    ),
    jsonb_build_object(
      'key', 'learning_organization',
      'label', 'Learning organization connection — cross-links documented',
      'met', jsonb_array_length(public._asibp85_learning_organization_connection()->'connections') >= 7,
      'note', 'Strategic Execution, Predictive Ops, Meeting, Knowledge Fabric, Risk, Opportunity, Learning Engine.'
    ),
    jsonb_build_object(
      'key', 'leadership_insights',
      'label', 'Leadership insights — adaptive decision support documented',
      'met', jsonb_array_length(public._asibp85_leadership_insights()->'insights') >= 4,
      'note', 'Learning summary, assumption signals, strengths to maintain, adaptation context.'
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Companion guidance — thoughtful evolution not reaction',
      'met', jsonb_array_length(public._asibp85_companion_guidance()->'examples') >= 3,
      'note', 'Learning integration, adaptation strength, assumption review.'
    ),
    jsonb_build_object(
      'key', 'limitation_principles',
      'label', 'Limitation principles — no constant instability, trend-chasing, or urgency framing',
      'met', jsonb_array_length(public._asibp85_limitation_principles()->'forbidden') >= 5,
      'note', 'Thoughtful evolution not reaction — humans decide strategy.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — sources, flexibility modes, and limitations documented',
      'met', jsonb_array_length(public._asibp85_trust_connection()->'leaders_should_know') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — adaptation with confidence and compassion',
      'met', (public._asibp85_self_love_connection()->>'journey_phrase') is not null,
      'note', 'We are not abandoning our vision. We are learning how to pursue it more wisely.'
    ),
    jsonb_build_object(
      'key', 'objectives',
      'label', 'Six adaptive strategic objectives documented',
      'met', jsonb_array_length(public._asibp85_objectives()) >= 6,
      'note', 'Learning integration, continuous review, flexibility, leadership, learning org, vision stewardship.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links Alignment 68, Executive 82, Predictive 74, Curiosity 80, Resilience 81, Simulation Lab',
      'met', jsonb_array_length(public._asibp85_integration_links()) >= 12,
      'note', 'Extend related engines — do not duplicate strategic insight storage.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Aipify Group ecosystem, product roadmap, Sales Expert, companion philosophy',
      'met', (public._asibp85_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    ),
    jsonb_build_object(
      'key', 'strategic_awareness',
      'label', 'Strategic awareness baseline — insights from Phase 79 layer',
      'met', v_total >= 0,
      'note', case when v_total = 0 then 'Run a strategic intelligence scan to validate adaptive context baseline.' else null end
    ),
    jsonb_build_object(
      'key', 'vision',
      'label', 'Vision stewardship phrase documented',
      'met', (public._asibp85_vision()) is not null,
      'note', 'We are not abandoning our vision. We are learning how to pursue it more wisely.'
    )
  );
end; $$;

create or replace function public._asibp85_adaptive_strategic_intelligence_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'implementation_blueprint_phase85', jsonb_build_object(
      'phase', 'Phase 85 — Adaptive Strategic Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE85_ADAPTIVE_STRATEGIC_INTELLIGENCE.md',
      'engine_phase', 'A.31 Strategic Intelligence Foundation Engine',
      'route', '/app/strategic-intelligence-foundation-engine',
      'mapping_note', 'ABOS Blueprint Phase 85 extends A.31 + Phase 17 + Phase 79 with adaptive strategic intelligence — learning integration, continuous review, strategic flexibility, and leadership insights. Distinct from Outcomes repo Phase 85 at /app/outcomes and Impact Engine A.85 at /app/impact-engine.'
    ),
    'adaptive_strategic_intelligence_note', 'Adaptive Strategic Intelligence Engine (ABOS Phase 85) — continuously integrate learning, reflection, and emerging intelligence into future planning.',
    'distinction_note', public._asibp85_distinction_note(),
    'mission', public._asibp85_mission(),
    'philosophy', public._asibp85_philosophy(),
    'abos_principle', public._asibp85_abos_principle(),
    'vision', public._asibp85_vision(),
    'objectives', public._asibp85_objectives(),
    'adaptive_strategic_questions', public._asibp85_adaptive_strategic_questions(),
    'continuous_strategic_review', public._asibp85_continuous_strategic_review(),
    'companion_guidance', public._asibp85_companion_guidance(),
    'learning_organization_connection', public._asibp85_learning_organization_connection(),
    'strategic_flexibility', public._asibp85_strategic_flexibility(),
    'self_love_connection', public._asibp85_self_love_connection(),
    'leadership_insights', public._asibp85_leadership_insights(),
    'trust_connection', public._asibp85_trust_connection(),
    'limitation_principles', public._asibp85_limitation_principles(),
    'dogfooding', public._asibp85_dogfooding(),
    'success_criteria', public._asibp85_success_criteria(p_organization_id),
    'vision_phrases', public._asibp85_vision_phrases(),
    'integration_links', public._asibp85_integration_links(),
    'engagement_summary', public._asibp85_engagement_summary(p_organization_id),
    'privacy_note', 'Adaptive strategic intelligence is metadata only — review scaffolds, flexibility modes, and learning integration context. No raw customer content, chat, or PII. Humans decide whether to maintain, adjust, or transform direction.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL A.31 + Phase 17 + Phase 79 fields; append Phase 85 block
-- ---------------------------------------------------------------------------
create or replace function public.get_strategic_intelligence_foundation_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('intelligence.view');
  v_org_id := public._mta_require_organization();
  perform public._sif_generate_insights(v_org_id);
  return jsonb_build_object(
    'has_organization', true,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 17 — Strategic Intelligence Engine Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE17_STRATEGIC_INTELLIGENCE_FOUNDATION.md',
      'engine_phase', 'A.31 Strategic Intelligence Foundation Engine',
      'route', '/app/strategic-intelligence-foundation-engine',
      'mapping_note', 'ABOS Blueprint Phase 17 maps to Strategic Intelligence Foundation Engine A.31 — extend, do not duplicate. Distinct from legacy /app/strategy (Phase 81).'
    ),
    'mission', 'Surface emerging trends, opportunities, risks, and strategic considerations from operational metadata — humans decide strategy.',
    'philosophy', 'Operations run today; strategy helps evolve — Aipify supports both with proactive signal detection and explainable metadata.',
    'abos_principle', 'Strategy evolves from operations — explainable signals help leaders plan ahead without noise.',
    'vision', 'Leaders see emerging trends, opportunities, and risks with transparent sources — sustainable strategy that supports both today''s operations and tomorrow''s direction.',
    'strategic_intelligence_foundation_note', 'Strategic Intelligence Engine Foundation (ABOS Phase 17) — extends Strategic Intelligence Foundation Engine (Phase A.31).',
    'distinction_note', 'Canonical ABOS Strategic Intelligence at A.31. Distinct from legacy /app/strategy (Phase 81 scorecard), Executive Insights A.35 (summaries), Predictive A.66 (forecasts), Strategic Alignment A.55 (objectives), Wisdom A.93 (synthesis), and Organizational Decision Support A.54 (decisions).',
    'strategic_objectives', public._sif_strategic_objectives(),
    'insight_categories', public._sif_insight_categories(),
    'companion_communication_examples', public._sif_companion_communication_examples(),
    'self_love_connection', public._sif_self_love_connection(),
    'self_love_note', 'Self Love (A.76) supports sustainable strategy and thoughtful pacing — principle only; Strategic Intelligence stores metadata, not wellbeing content.',
    'trust_connection', public._sif_trust_connection(),
    'data_sources', public._sif_data_sources(),
    'dogfooding', public._sif_blueprint_dogfooding(),
    'success_criteria', public._sif_blueprint_success_criteria(v_org_id),
    'vision_phrases', public._sif_vision_phrases(),
    'integration_links', public._sif_integration_links(),
    'safety_note', 'Metadata and summary scores only — no customer email, chat, order content, or PII.',
    'principles', jsonb_build_array(
      'Explainable recommendations with confidence and impact metadata',
      'Human-centered decision support — leadership retains strategic authority',
      'Data-driven insights from support, quality, and customer success signals',
      'Opportunity and risk detection without autonomous strategic execution',
      'Metadata only — no customer email, chat, orders, or PII',
      'Sustainable strategy — Self Love pacing influences tone, not stored content'
    ),
    'summary', jsonb_build_object(
      'new_insights', coalesce((select count(*) from public.strategic_insights where organization_id = v_org_id and status = 'new'), 0),
      'high_impact', coalesce((select count(*) from public.strategic_insights where organization_id = v_org_id and impact_level in ('high', 'critical') and status not in ('dismissed', 'completed')), 0),
      'completed', coalesce((select count(*) from public.strategic_insights where organization_id = v_org_id and status = 'completed'), 0)
    ),
    'insights', coalesce((
      select jsonb_agg(row_to_json(i) order by
        case i.impact_level when 'critical' then 0 when 'high' then 1 when 'medium' then 2 else 3 end, i.created_at desc)
      from public.strategic_insights i where i.organization_id = v_org_id and i.status != 'dismissed'
    ), '[]'::jsonb),
    'priorities', coalesce((
      select jsonb_agg(row_to_json(i) order by i.confidence_score desc)
      from public.strategic_insights i where i.organization_id = v_org_id and i.status in ('new', 'acknowledged', 'planned') limit 5
    ), '[]'::jsonb),
    'implementation_blueprint_phase79', jsonb_build_object(
      'phase', 'Phase 79 — Strategic Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE79_STRATEGIC_INTELLIGENCE.md',
      'engine_phase', 'A.31 Strategic Intelligence Foundation Engine',
      'route', '/app/strategic-intelligence-foundation-engine',
      'mapping_note', 'ABOS Blueprint Phase 79 extends A.31 + Phase 17 with strategic awareness, pattern recognition, opportunity identification, leadership briefings, companion guidance, limitation principles, and live success criteria. Distinct from Autonomous Operations Center repo Phase 79 at /app/operations.'
    ),
    'strategic_intelligence_engine_note', 'Strategic Intelligence Engine (ABOS Phase 79) — cultivates deeper strategic awareness by connecting operational insights, organizational knowledge, and external developments into meaningful perspectives.',
    'blueprint_distinction_note', public._sibp79_distinction_note(),
    'blueprint_mission', public._sibp79_mission(),
    'blueprint_philosophy', public._sibp79_philosophy(),
    'blueprint_abos_principle', public._sibp79_abos_principle(),
    'blueprint_objectives', public._sibp79_objectives(),
    'intelligence_sources', public._sibp79_intelligence_sources(),
    'strategic_observations', public._sibp79_strategic_observations(),
    'pattern_recognition', public._sibp79_pattern_recognition(),
    'opportunity_identification', public._sibp79_opportunity_identification(),
    'leadership_intelligence_briefings', public._sibp79_leadership_intelligence_briefings(),
    'companion_guidance', public._sibp79_companion_guidance(),
    'blueprint_self_love_connection', public._sibp79_self_love_connection(),
    'blueprint_trust_connection', public._sibp79_trust_connection(),
    'limitation_principles', public._sibp79_limitation_principles(),
    'blueprint_dogfooding', public._sibp79_dogfooding(),
    'blueprint_integration_links', public._sibp79_integration_links(),
    'engagement_summary', public._sibp79_engagement_summary(v_org_id),
    'blueprint_success_criteria', public._sibp79_success_criteria(v_org_id),
    'blueprint_vision_phrases', public._sibp79_vision_phrases(),
    'blueprint_privacy_note', 'Strategic intelligence and Phase 79 blueprint data is metadata only — insight counts, pattern signals, and observation themes. No raw customer content, chat, or PII. Humans decide strategy; insights are possibilities not conclusions.',
    'adaptive_strategic_intelligence', public._asibp85_adaptive_strategic_intelligence_block(v_org_id)
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve Phase 17 + Phase 79 fields; append Phase 85 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_strategic_intelligence_foundation_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
  v_engagement jsonb;
  v_adaptive jsonb;
begin
  v_org_id := public._mta_require_organization();
  v_engagement := public._sibp79_engagement_summary(v_org_id);
  v_adaptive := public._asibp85_engagement_summary(v_org_id);
  return jsonb_build_object(
    'has_organization', true,
    'new_insights', coalesce((select count(*) from public.strategic_insights where organization_id = v_org_id and status = 'new'), 0),
    'philosophy', 'Operations run today; strategy helps evolve — proactive signal detection with explainable metadata.',
    'mission', 'Surface emerging trends, opportunities, risks, and strategic considerations — humans decide strategy.',
    'abos_principle', 'Strategy evolves from operations — explainable signals help leaders plan ahead without noise.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 17 — Strategic Intelligence Engine Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE17_STRATEGIC_INTELLIGENCE_FOUNDATION.md',
      'engine_phase', 'A.31 Strategic Intelligence Foundation Engine',
      'route', '/app/strategic-intelligence-foundation-engine',
      'mapping_note', 'ABOS Blueprint Phase 17 maps to Strategic Intelligence Foundation Engine A.31 — extend, do not duplicate. Distinct from legacy /app/strategy (Phase 81).'
    ),
    'strategic_intelligence_foundation_note', 'Strategic Intelligence Engine Foundation (ABOS Phase 17) — extends Strategic Intelligence Foundation Engine (Phase A.31).',
    'implementation_blueprint_phase79', jsonb_build_object(
      'phase', 'Phase 79 — Strategic Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE79_STRATEGIC_INTELLIGENCE.md',
      'engine_phase', 'A.31 Strategic Intelligence Foundation Engine',
      'route', '/app/strategic-intelligence-foundation-engine'
    ),
    'blueprint_mission', public._sibp79_mission(),
    'blueprint_abos_principle', public._sibp79_abos_principle(),
    'engagement_summary', v_engagement,
    'blueprint_note', 'Strategic Intelligence Engine (ABOS Phase 79) — cultivates strategic awareness through pattern recognition, opportunity identification, and leadership briefings.',
    'understanding_note', 'Understanding not prediction — insights are possibilities, not conclusions.',
    'implementation_blueprint_phase85', jsonb_build_object(
      'phase', 'Phase 85 — Adaptive Strategic Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE85_ADAPTIVE_STRATEGIC_INTELLIGENCE.md',
      'engine_phase', 'A.31 Strategic Intelligence Foundation Engine',
      'route', '/app/strategic-intelligence-foundation-engine'
    ),
    'adaptive_mission', public._asibp85_mission(),
    'adaptive_abos_principle', public._asibp85_abos_principle(),
    'adaptive_engagement_summary', v_adaptive,
    'adaptation_note', 'Adaptive Strategic Intelligence (ABOS Phase 85) — integrate learning into planning; maintain, adjust, or transform direction with intention.'
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._asibp85_distinction_note() to authenticated;
grant execute on function public._asibp85_mission() to authenticated;
grant execute on function public._asibp85_philosophy() to authenticated;
grant execute on function public._asibp85_abos_principle() to authenticated;
grant execute on function public._asibp85_vision() to authenticated;
grant execute on function public._asibp85_objectives() to authenticated;
grant execute on function public._asibp85_adaptive_strategic_questions() to authenticated;
grant execute on function public._asibp85_continuous_strategic_review() to authenticated;
grant execute on function public._asibp85_companion_guidance() to authenticated;
grant execute on function public._asibp85_learning_organization_connection() to authenticated;
grant execute on function public._asibp85_strategic_flexibility() to authenticated;
grant execute on function public._asibp85_leadership_insights() to authenticated;
grant execute on function public._asibp85_self_love_connection() to authenticated;
grant execute on function public._asibp85_trust_connection() to authenticated;
grant execute on function public._asibp85_limitation_principles() to authenticated;
grant execute on function public._asibp85_dogfooding() to authenticated;
grant execute on function public._asibp85_vision_phrases() to authenticated;
grant execute on function public._asibp85_integration_links() to authenticated;
grant execute on function public._asibp85_engagement_summary(uuid) to authenticated;
grant execute on function public._asibp85_success_criteria(uuid) to authenticated;
grant execute on function public._asibp85_adaptive_strategic_intelligence_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'strategic-intelligence-blueprint-phase85', 'Adaptive Strategic Intelligence Engine (ABOS Phase 85)',
  'Adaptive Strategic Intelligence — extends A.31 + Phase 17 + Phase 79 with learning integration, continuous strategic review, strategic flexibility (maintain/adjust/transform), leadership insights, and live success criteria.',
  'authenticated', 120
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'strategic-intelligence-blueprint-phase85' and tenant_id is null
);
