-- Implementation Blueprint Phase 79 — Strategic Intelligence Engine
-- Extends Strategic Intelligence Foundation Engine Phase A.31 (Phase 17 via _sif_*). No new tables.
-- Distinct from Autonomous Operations Center repo Phase 79 at /app/operations (phase number collision).

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._sibp79_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 79 — Strategic Intelligence Engine at /app/strategic-intelligence-foundation-engine. Extends Strategic Intelligence Foundation Engine Phase A.31 (Phase 17 via _sif_* in 20260964000000_implementation_blueprint_phase17_strategic_intelligence.sql). Distinct from Autonomous Operations Center repo Phase 79 at /app/operations (phase number collision). Distinct from Legacy Strategic Intelligence & Opportunity repo Phase 81 at /app/strategy. Distinct from Executive Insights A.35 at /app/executive-insights-engine. Distinct from Predictive Insights A.66 / Blueprint Phase 74 at /app/predictive-insights-engine (forecasts — cross-link). Distinct from Strategic Alignment A.55 / Blueprint Phase 68 at /app/strategic-alignment-engine. Distinct from Wisdom Engine A.93 at /app/wisdom-engine. Distinct from Industry Intelligence A.44 and Cross-Functional Intelligence Phase 70 on OCF A.32. Engine helpers use _sif_* (Phase 17) and A.31 _sif_generate_insights — Blueprint Phase 79 uses _sibp79_* only. Humans decide strategy — understanding not prediction or certainty.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._sibp79_mission()
returns text language sql immutable as $$
  select 'Cultivate deeper strategic awareness by connecting operational insights, organizational knowledge, and external developments into meaningful perspectives.';
$$;

create or replace function public._sibp79_philosophy()
returns text language sql immutable as $$
  select 'Information alone rarely changes outcomes — understanding creates insight, insight supports wisdom; strategic intelligence emerges when organizations connect dots thoughtfully.';
$$;

create or replace function public._sibp79_abos_principle()
returns text language sql immutable as $$
  select 'Strategic intelligence emerges through connecting information meaningfully — wisdom resides in relationships between ideas. Aipify informs and prepares; humans decide strategy.';
$$;

create or replace function public._sibp79_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'pattern_recognition', 'label', 'Pattern recognition', 'description', 'Recurring operational challenges, emerging opportunities, strengthening capabilities, strategic momentum shifts — patterns reveal what isolated events cannot'),
    jsonb_build_object('key', 'strategic_awareness', 'label', 'Strategic awareness', 'description', 'Connect operational insights, organizational knowledge, and external developments into meaningful perspectives'),
    jsonb_build_object('key', 'opportunity_identification', 'label', 'Opportunity identification', 'description', 'Adjacent market expansion, internal knowledge service opportunities, recurring customer needs — adaptability'),
    jsonb_build_object('key', 'leadership_preparedness', 'label', 'Leadership preparedness', 'description', 'Strategic opportunity summaries, emerging observations, positive momentum, areas for consideration — clarity'),
    jsonb_build_object('key', 'cross_functional_understanding', 'label', 'Cross-functional understanding', 'description', 'Collaborative execution strength, cross-functional collaboration opportunities — cross-link OCF Phase 70'),
    jsonb_build_object('key', 'long_term_perspective', 'label', 'Long-term perspective', 'description', 'Sustained reflection over immediate certainty — intentional long-term thinking')
  );
$$;

create or replace function public._sibp79_intelligence_sources()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Intelligence sources (future approved) — perspective objective, metadata only.',
    'sources', jsonb_build_array(
      jsonb_build_object('key', 'organizational_knowledge', 'label', 'Organizational knowledge', 'description', 'Approved organizational knowledge and memory — cross-link Organizational Memory A.34'),
      jsonb_build_object('key', 'strategic_initiatives', 'label', 'Strategic initiatives', 'description', 'Active strategic initiatives and alignment metadata — cross-link Strategic Alignment A.55'),
      jsonb_build_object('key', 'meeting_companion', 'label', 'Meeting Companion A.61 insights', 'description', 'Meeting collaboration intelligence — cross-link Meeting Companion A.61', 'route', '/app/meeting-collaboration-intelligence-engine'),
      jsonb_build_object('key', 'operational_observations', 'label', 'Operational observations', 'description', 'Support, quality, adoption, and customer success metadata from _sif_generate_insights'),
      jsonb_build_object('key', 'cross_functional_intelligence', 'label', 'Cross-functional intelligence Phase 70', 'description', 'Cross-functional observations on OCF A.32', 'route', '/app/operations-center-foundation-engine'),
      jsonb_build_object('key', 'customer_feedback', 'label', 'Customer feedback', 'description', 'Aggregate customer feedback themes — metadata counts only, no raw content'),
      jsonb_build_object('key', 'external_market', 'label', 'External market developments', 'description', 'External market and industry context — perspective objective, cross-link Industry Intelligence A.44', 'route', '/app/industry-intelligence-foundation-engine')
    ),
    'knowledge_center_route', '/app/knowledge-center-engine',
    'privacy_note', 'Metadata and summary themes only — no raw customer email, chat, orders, or PII.'
  );
$$;

create or replace function public._sibp79_strategic_observations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Strategic observations — encourage reflection, not conclusions.',
    'observations', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'customer_interest_themes', 'signal', 'Emerging customer interest themes appear across recent interactions — would a thematic summary help reflection?', 'description', 'Aggregate interest themes from metadata — not individual customer records.'),
      jsonb_build_object('emoji', '🌹', 'key', 'collaborative_execution', 'signal', 'Collaborative execution strength is visible across teams — would celebrating this momentum support strategic planning?', 'description', 'Cross-functional collaboration patterns — cross-link Phase 70.'),
      jsonb_build_object('emoji', '🔔', 'key', 'leadership_attention_trends', 'signal', 'Leadership attention on evolving trends may deserve a consolidated observation — shall I prepare a briefing context?', 'description', 'Emerging trend metadata for leadership review — humans decide priorities.')
    ),
    'reflection_note', 'Observations are possibilities for reflection — not strategic conclusions or predictions.'
  );
$$;

create or replace function public._sibp79_pattern_recognition()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Pattern recognition — recurring operational challenges, emerging opportunities, strengthening capabilities, strategic momentum shifts — patterns reveal what isolated events cannot.',
    'patterns', jsonb_build_array(
      jsonb_build_object('key', 'recurring_operational_challenges', 'label', 'Recurring operational challenges', 'description', 'Repeated support, quality, or workflow strain signals across operational metadata'),
      jsonb_build_object('key', 'emerging_opportunities', 'label', 'Emerging opportunities', 'description', 'Adoption gaps, expansion signals, and customer success uplift patterns'),
      jsonb_build_object('key', 'strengthening_capabilities', 'label', 'Strengthening capabilities', 'description', 'Teams or modules showing sustained improvement and capability growth'),
      jsonb_build_object('key', 'strategic_momentum_shifts', 'label', 'Strategic momentum shifts', 'description', 'Changes in strategic momentum visible across multiple metadata sources')
    ),
    'metadata_note', 'Patterns aggregate metadata counts and trends — isolated events alone cannot reveal these connections.'
  );
$$;

create or replace function public._sibp79_opportunity_identification()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Opportunity identification — adaptability through thoughtful observation, not autonomous pursuit.',
    'opportunities', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'adjacent_market_expansion', 'signal', 'Adjacent market expansion may deserve exploration — would a context summary support informed discussion?', 'description', 'Market adjacency signals from industry and adoption metadata — cross-link Industry Intelligence A.44.'),
      jsonb_build_object('emoji', '🌹', 'key', 'internal_knowledge_service', 'signal', 'Internal knowledge may support a service opportunity — would mapping approved knowledge sources help?', 'description', 'Knowledge Center A.5 and Employee Knowledge patterns — cross-link KC A.5.'),
      jsonb_build_object('emoji', '🔔', 'key', 'recurring_customer_needs', 'signal', 'Recurring customer needs appear in support themes — would a strategic needs summary help leadership review?', 'description', 'Recurring support theme metadata — counts and categories only, no raw content.')
    ),
    'adaptability_note', 'Opportunities are possibilities for human evaluation — Aipify never auto-pursues strategic actions.'
  );
$$;

create or replace function public._sibp79_leadership_intelligence_briefings()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership intelligence briefings — clarity through strategic opportunity summaries, emerging observations, positive momentum, and areas for consideration.',
    'briefing_types', jsonb_build_array(
      jsonb_build_object('emoji', '📈', 'key', 'strategic_opportunity_summaries', 'label', 'Strategic opportunity summaries', 'description', 'Consolidated opportunity metadata for leadership dialogue'),
      jsonb_build_object('emoji', '🦉', 'key', 'emerging_observations', 'label', 'Emerging observations', 'description', 'Emerging themes and pattern signals worth reflective review'),
      jsonb_build_object('emoji', '🌹', 'key', 'positive_momentum', 'label', 'Positive momentum', 'description', 'Capability strengthening and collaborative execution highlights'),
      jsonb_build_object('emoji', '🔔', 'key', 'areas_for_consideration', 'label', 'Areas for consideration', 'description', 'Operational and knowledge risks surfaced for thoughtful leadership attention')
    ),
    'clarity_note', 'Briefings prepare context — leadership retains strategic authority. Cross-link Executive Insights A.35 for executive summaries.'
  );
$$;

create or replace function public._sibp79_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion guidance — curiosity over certainty; encourage informed decisions through exploration.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'relevant_trends', 'prompt', 'Several trends appear increasingly relevant — would exploring their connections help inform your next strategic conversation?', 'consideration', 'Curiosity-driven exploration — not prediction or urgency.'),
      jsonb_build_object('emoji', '🌹', 'key', 'cross_functional_collaboration', 'prompt', 'Cross-functional collaboration opportunities may strengthen execution — would a connection summary help?', 'consideration', 'Cross-link Cross-Functional Intelligence Phase 70 on OCF A.32.'),
      jsonb_build_object('emoji', '🔔', 'key', 'further_exploration', 'prompt', 'Further exploration may support an informed decision — shall I prepare a strategic context summary?', 'consideration', 'Humans decide — Aipify prepares context only.')
    )
  );
$$;

create or replace function public._sibp79_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — perspective, confidence, humility, and continuous learning.',
    'practices', jsonb_build_array(
      'Perspective — strategic intelligence informs, it does not dictate outcomes',
      'Confidence — understanding builds preparedness for leadership conversations',
      'Humility — insights are possibilities, not conclusions',
      'Continuous learning — wisdom often emerges through sustained reflection rather than immediate certainty'
    ),
    'journey_phrase', 'Wisdom often emerges through sustained reflection rather than immediate certainty.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports thoughtful strategic reflection — principle only; Strategic Intelligence stores metadata, not personal wellbeing content.'
  );
$$;

create or replace function public._sibp79_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparency about sources contributing to observations, limitations, and the distinction between insights and conclusions.',
    'leaders_should_know', jsonb_build_array(
      'Which metadata sources contributed to each strategic observation',
      'Limitation principles — insights are possibilities, not conclusions or predictions',
      'Confidence scores and impact levels on generated strategic insights',
      'That dismiss and complete workflows are fully audited — metadata only'
    ),
    'organizations_should_understand', jsonb_build_array(
      'Strategic intelligence connects operational metadata meaningfully — no raw customer records',
      'Distinct from legacy /app/strategy Phase 81, Executive Insights A.35, Predictive Phase 74, and Wisdom A.93',
      'Understanding not prediction — limitation principles block certainty language',
      'Humans decide strategy — Aipify informs, prepares, and recommends'
    ),
    'audit_note', 'Insight generation, scan, and dismiss events logged via _sif_log — metadata only.'
  );
$$;

create or replace function public._sibp79_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Limitation principles — understanding not prediction; humans decide strategy.',
    'forbidden', jsonb_build_array(
      'Intelligence presented as certainty or guaranteed outcomes',
      'Fear-driven interpretations or alarmist strategic copy',
      'Oversimplification of complex strategic contexts',
      'Autonomous strategic execution without human approval'
    ),
    'required', jsonb_build_array(
      'Insights framed as possibilities for reflection — not conclusions',
      'Transparent source attribution and confidence metadata',
      'Human leadership retains strategic authority',
      'Understanding over prediction — sustained reflection over immediate certainty'
    ),
    'boundary_note', 'Aipify cultivates strategic awareness — humans decide strategy.'
  );
$$;

create or replace function public._sibp79_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates strategic intelligence patterns internally before customer rollout.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — ecosystem evolution, product strategy, Sales Expert growth, organizational development',
      'focus', jsonb_build_array(
        'Ecosystem evolution and partner ecosystem strategic signals',
        'Product strategy and roadmap scaling considerations',
        'Sales Expert growth and marketplace strategic observations',
        'Organizational development and capability strengthening patterns'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce strategic awareness',
      'focus', jsonb_build_array(
        'Commerce adoption and expansion opportunity patterns',
        'Support theme strategic observations for leadership review',
        'Customer success relationship insights and recurring needs',
        'Knowledge gap patterns in operational workflows'
      )
    )
  );
$$;

create or replace function public._sibp79_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We understand our environment more clearly than before.',
    'More curious, adaptive, and insightful organizations.',
    'Strategic intelligence emerges through connecting information meaningfully.',
    'Wisdom resides in relationships between ideas — not isolated data points.',
    'Understanding creates insight; insight supports wisdom.',
    'Humans decide strategy — Aipify informs, prepares, and recommends.'
  );
$$;

create or replace function public._sibp79_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Meeting Companion (A.61)', 'route', '/app/meeting-collaboration-intelligence-engine', 'note', 'Meeting insights feed strategic observations — cross-link only'),
    jsonb_build_object('label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine', 'note', 'Organizational knowledge source — cross-link only'),
    jsonb_build_object('label', 'Cross-Functional Intelligence (Blueprint 70 / OCF A.32)', 'route', '/app/operations-center-foundation-engine', 'note', 'Cross-functional observations — cross-link only'),
    jsonb_build_object('label', 'Predictive Insights (A.66 / Blueprint 74)', 'route', '/app/predictive-insights-engine', 'note', 'Forecasts and preparedness — distinct from strategic awareness'),
    jsonb_build_object('label', 'Executive Insights (A.35)', 'route', '/app/executive-insights-engine', 'note', 'Executive summaries — distinct from strategic signal scanning'),
    jsonb_build_object('label', 'Wisdom Engine (A.93)', 'route', '/app/wisdom-engine', 'note', 'Experience synthesis over time — distinct from signal detection'),
    jsonb_build_object('label', 'Strategic Alignment (A.55 / Blueprint 68)', 'route', '/app/strategic-alignment-engine', 'note', 'Objectives alignment — not opportunity/risk scanning'),
    jsonb_build_object('label', 'Industry Intelligence (A.44)', 'route', '/app/industry-intelligence-foundation-engine', 'note', 'Industry context for external market developments'),
    jsonb_build_object('label', 'Organizational Memory (A.34)', 'route', '/app/organizational-memory-engine', 'note', 'Organizational knowledge source'),
    jsonb_build_object('label', 'Legacy Strategic Scorecard (Phase 81)', 'route', '/app/strategy', 'note', 'Legacy strategic scorecard — A.31 is canonical ABOS Strategic Intelligence'),
    jsonb_build_object('label', 'Autonomous Operations Center (Repo Phase 79)', 'route', '/app/operations', 'note', 'Autonomous operations — distinct ABOS blueprint surface (phase number collision)'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Perspective and sustained reflection — principle only')
  );
$$;

create or replace function public._sibp79_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_total int := 0;
  v_new int := 0;
  v_high_impact int := 0;
  v_completed int := 0;
  v_dismissed int := 0;
  v_categories int := 0;
begin
  select count(*) into v_total
  from public.strategic_insights where organization_id = p_organization_id;

  select count(*) into v_new
  from public.strategic_insights
  where organization_id = p_organization_id and status = 'new';

  select count(*) into v_high_impact
  from public.strategic_insights
  where organization_id = p_organization_id
    and impact_level in ('high', 'critical')
    and status not in ('dismissed', 'completed');

  select count(*) into v_completed
  from public.strategic_insights
  where organization_id = p_organization_id and status = 'completed';

  select count(*) into v_dismissed
  from public.strategic_insights
  where organization_id = p_organization_id and status = 'dismissed';

  select count(distinct category) into v_categories
  from public.strategic_insights
  where organization_id = p_organization_id and status != 'dismissed';

  return jsonb_build_object(
    'total_insights', coalesce(v_total, 0),
    'new_insights', coalesce(v_new, 0),
    'high_impact_insights', coalesce(v_high_impact, 0),
    'completed_insights', coalesce(v_completed, 0),
    'dismissed_insights', coalesce(v_dismissed, 0),
    'active_categories', coalesce(v_categories, 0),
    'strategic_observations', jsonb_array_length(public._sibp79_strategic_observations()->'observations'),
    'opportunity_signals', jsonb_array_length(public._sibp79_opportunity_identification()->'opportunities'),
    'companion_examples', jsonb_array_length(public._sibp79_companion_guidance()->'examples'),
    'privacy_note', 'Metadata only — insight counts, categories, and impact levels. No raw customer content or PII.'
  );
end; $$;

create or replace function public._sibp79_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_total int := 0;
  v_high_impact int := 0;
  v_completed int := 0;
begin
  v_engagement := public._sibp79_engagement_summary(p_organization_id);
  v_total := coalesce((v_engagement->>'total_insights')::int, 0);
  v_high_impact := coalesce((v_engagement->>'high_impact_insights')::int, 0);
  v_completed := coalesce((v_engagement->>'completed_insights')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'strategic_awareness',
      'label', 'Improved strategic awareness — insights generated from operational metadata',
      'met', v_total > 0,
      'note', case when v_total = 0 then 'Run a strategic intelligence scan or seed operational signals to validate awareness.' else null end
    ),
    jsonb_build_object(
      'key', 'leadership_conversations',
      'label', 'Deeper leadership conversations — leadership briefings documented',
      'met', jsonb_array_length(public._sibp79_leadership_intelligence_briefings()->'briefing_types') >= 4,
      'note', 'Strategic opportunity summaries, emerging observations, positive momentum, areas for consideration.'
    ),
    jsonb_build_object(
      'key', 'opportunity_attention',
      'label', 'Greater opportunity attention — opportunity identification signals documented',
      'met', jsonb_array_length(public._sibp79_opportunity_identification()->'opportunities') >= 3,
      'note', 'Adjacent market, internal knowledge service, recurring customer needs — adaptability.'
    ),
    jsonb_build_object(
      'key', 'organizational_learning',
      'label', 'Strengthened organizational learning — pattern recognition documented',
      'met', jsonb_array_length(public._sibp79_pattern_recognition()->'patterns') >= 4,
      'note', 'Patterns reveal what isolated events cannot.'
    ),
    jsonb_build_object(
      'key', 'long_term_thinking',
      'label', 'More intentional long-term thinking — objectives and vision documented',
      'met', jsonb_array_length(public._sibp79_objectives()) >= 6
        and jsonb_array_length(public._sibp79_vision_phrases()) >= 4,
      'note', 'Sustained reflection over immediate certainty.'
    ),
    jsonb_build_object(
      'key', 'strategic_observations',
      'label', 'Strategic observations — reflection encouragement with companion emojis',
      'met', jsonb_array_length(public._sibp79_strategic_observations()->'observations') >= 3,
      'note', 'Emerging customer interest, collaborative execution, leadership attention on trends.'
    ),
    jsonb_build_object(
      'key', 'intelligence_sources',
      'label', 'Intelligence sources — approved source categories documented',
      'met', jsonb_array_length(public._sibp79_intelligence_sources()->'sources') >= 7,
      'note', 'Organizational knowledge, strategic initiatives, Meeting A.61, operational observations, cross-functional Phase 70, customer feedback, external market.'
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Companion guidance — curiosity-driven exploration documented',
      'met', jsonb_array_length(public._sibp79_companion_guidance()->'examples') >= 3,
      'note', 'Relevant trends, cross-functional collaboration, further exploration.'
    ),
    jsonb_build_object(
      'key', 'limitation_principles',
      'label', 'Limitation principles — no certainty, no fear-driven copy, no oversimplification',
      'met', jsonb_array_length(public._sibp79_limitation_principles()->'forbidden') >= 4,
      'note', 'Understanding not prediction — humans decide strategy.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — sources, limitations, and insight-as-possibility documented',
      'met', jsonb_array_length(public._sibp79_trust_connection()->'leaders_should_know') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — perspective, confidence, humility, continuous learning',
      'met', (public._sibp79_self_love_connection()->>'journey_phrase') is not null,
      'note', 'Wisdom often emerges through sustained reflection rather than immediate certainty.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links Meeting A.61, KC A.5, OCF Phase 70, Predictive Phase 74, Executive A.35, Wisdom A.93, Strategy Phase 81',
      'met', jsonb_array_length(public._sibp79_integration_links()) >= 10,
      'note', 'Extend related engines — do not duplicate strategic insight storage.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Aipify Group ecosystem evolution, product strategy, Sales Expert growth',
      'met', (public._sibp79_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    ),
    jsonb_build_object(
      'key', 'high_impact_review',
      'label', 'High-impact insights surfaced for leadership review',
      'met', v_high_impact >= 0,
      'note', case when v_total > 0 and v_high_impact = 0 then 'No active high-impact insights — healthy baseline or scan after signals accumulate.' else null end
    ),
    jsonb_build_object(
      'key', 'workflow_tracked',
      'label', 'Insight workflow tracked — completed or dismissed insights',
      'met', v_completed > 0 or v_total = 0,
      'note', case when v_total > 0 and v_completed = 0 then 'Complete insights to validate organizational learning workflow.' else null end
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL A.31 + Phase 17 fields; append Phase 79
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
    'blueprint_privacy_note', 'Strategic intelligence and Phase 79 blueprint data is metadata only — insight counts, pattern signals, and observation themes. No raw customer content, chat, or PII. Humans decide strategy; insights are possibilities not conclusions.'
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve Phase 17 fields; append Phase 79 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_strategic_intelligence_foundation_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
  v_engagement jsonb;
begin
  v_org_id := public._mta_require_organization();
  v_engagement := public._sibp79_engagement_summary(v_org_id);
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
    'understanding_note', 'Understanding not prediction — insights are possibilities, not conclusions.'
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._sibp79_distinction_note() to authenticated;
grant execute on function public._sibp79_mission() to authenticated;
grant execute on function public._sibp79_philosophy() to authenticated;
grant execute on function public._sibp79_abos_principle() to authenticated;
grant execute on function public._sibp79_objectives() to authenticated;
grant execute on function public._sibp79_intelligence_sources() to authenticated;
grant execute on function public._sibp79_strategic_observations() to authenticated;
grant execute on function public._sibp79_pattern_recognition() to authenticated;
grant execute on function public._sibp79_opportunity_identification() to authenticated;
grant execute on function public._sibp79_leadership_intelligence_briefings() to authenticated;
grant execute on function public._sibp79_companion_guidance() to authenticated;
grant execute on function public._sibp79_self_love_connection() to authenticated;
grant execute on function public._sibp79_trust_connection() to authenticated;
grant execute on function public._sibp79_limitation_principles() to authenticated;
grant execute on function public._sibp79_dogfooding() to authenticated;
grant execute on function public._sibp79_vision_phrases() to authenticated;
grant execute on function public._sibp79_integration_links() to authenticated;
grant execute on function public._sibp79_engagement_summary(uuid) to authenticated;
grant execute on function public._sibp79_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'strategic-intelligence-blueprint-phase79', 'Strategic Intelligence Engine (ABOS Phase 79)',
  'Strategic Intelligence Engine — extends A.31 + Phase 17 with strategic awareness, pattern recognition, opportunity identification, leadership briefings, companion guidance, limitation principles, and live success criteria.',
  'authenticated', 119
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'strategic-intelligence-blueprint-phase79' and tenant_id is null
);
