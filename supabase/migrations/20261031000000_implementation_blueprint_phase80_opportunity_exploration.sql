-- Implementation Blueprint Phase 80 — Opportunity Exploration Engine
-- Extends Curiosity & Discovery Engine Phase A.87 (_cde_*). No new tables.
-- Distinct from Continuity repo Phase 80 at /app/continuity (Blueprint Phase 73 — phase number collision).

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._oebp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 80 — Opportunity Exploration Engine at /app/curiosity-discovery-engine. Extends Curiosity & Discovery Engine Phase A.87 (20260936000000_curiosity_discovery_engine_phase_a87.sql via _cde_*). Distinct from Continuity, Resilience & Crisis repo Phase 80 at /app/continuity (Blueprint Phase 73 organizational continuity — phase number collision). Distinct from Legacy Strategic Intelligence & Opportunity repo Phase 81 at /app/strategy. Distinct from Growth & Evolution A.81 at /app/growth-evolution-engine (emerging_opportunity signals — cross-link). Distinct from Innovation Lab Phase 96 / Blueprint Phase 38 at /app/innovation-lab (controlled experiments — cross-link). Distinct from Simulation Decision Lab Phase 78 at /app/simulations. Distinct from Strategic Intelligence A.31 / Blueprint Phase 79 at /app/strategic-intelligence-foundation-engine. Distinct from Wonder Engine A.88 and Wisdom A.93. Engine helpers use _cde_* — Blueprint Phase 80 uses _oebp_* only. Not FOMO — exploration not urgency, no guarantees.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._oebp_mission()
returns text language sql immutable as $$
  select 'Cultivate curiosity and strategic awareness by identifying opportunities worthy of exploration and thoughtful consideration.';
$$;

create or replace function public._oebp_philosophy()
returns text language sql immutable as $$
  select 'Opportunity rarely announces itself — it emerges through observation, experimentation, and willingness to explore. The objective is to recognize the right opportunities, not chase every one.';
$$;

create or replace function public._oebp_abos_principle()
returns text language sql immutable as $$
  select 'Open to possibility while grounded in purpose and values — curiosity guided by wisdom. Aipify informs and prepares; humans decide what to pursue.';
$$;

create or replace function public._oebp_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'opportunity_identification', 'label', 'Opportunity identification', 'description', 'Surface possibilities from multiple perspectives — metadata patterns, not raw customer content'),
    jsonb_build_object('key', 'prioritization', 'label', 'Prioritization', 'description', 'Thoughtful evaluation before pursuit — strategic alignment and readiness over urgency'),
    jsonb_build_object('key', 'capability_alignment', 'label', 'Capability alignment', 'description', 'Match opportunities to organizational strengths and readiness'),
    jsonb_build_object('key', 'cross_functional_exploration', 'label', 'Cross-functional exploration', 'description', 'Teams contribute perspectives — disciplined curiosity across functions'),
    jsonb_build_object('key', 'strategic_experimentation', 'label', 'Strategic experimentation', 'description', 'Small experiments and learning-oriented initiatives — cross-link Innovation Lab Phase 96'),
    jsonb_build_object('key', 'responsible_innovation', 'label', 'Responsible innovation', 'description', 'Intentional innovation with limitation principles — exploration not urgency')
  );
$$;

create or replace function public._oebp_opportunity_sources()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Opportunity sources — multiple perspectives, metadata only.',
    'sources', jsonb_build_array(
      jsonb_build_object('key', 'customer_feedback', 'label', 'Customer feedback', 'description', 'Aggregate feedback themes — counts and categories only, no raw messages'),
      jsonb_build_object('key', 'market_developments', 'label', 'Market developments', 'description', 'External market and industry context — perspective objective'),
      jsonb_build_object('key', 'organizational_strengths', 'label', 'Organizational strengths', 'description', 'Capability and execution strength patterns from operational metadata'),
      jsonb_build_object('key', 'emerging_technologies', 'label', 'Emerging technologies', 'description', 'Technology observatory signals — future approved, metadata only'),
      jsonb_build_object('key', 'cross_functional_insights', 'label', 'Cross-functional insights', 'description', 'Patterns visible across teams and workflows'),
      jsonb_build_object('key', 'sales_observations', 'label', 'Sales observations', 'description', 'Sales Expert and pipeline metadata — cross-link Sales Expert A.79', 'route', '/app/sales-expert-engine'),
      jsonb_build_object('key', 'community_experiences', 'label', 'Community experiences', 'description', 'Community and partner ecosystem observations — metadata only')
    ),
    'knowledge_center_route', '/app/knowledge-center-engine',
    'privacy_note', 'Metadata and summary themes only — no raw customer email, chat, orders, or PII.'
  );
$$;

create or replace function public._oebp_opportunity_questions()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Opportunity questions — curiosity creates possibility; not urgency or guarantees.',
    'questions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'insufficient_attention', 'question', 'Which opportunities may deserve more attention than they currently receive?', 'description', 'Reflective scan — not FOMO or missed-opportunity pressure.'),
      jsonb_build_object('emoji', '🌹', 'key', 'strengths_supporting_growth', 'question', 'Which organizational strengths could support a new direction?', 'description', 'Capability alignment — celebrate readiness before pursuit.'),
      jsonb_build_object('emoji', '🔔', 'key', 'unmet_customer_needs', 'question', 'What unmet customer needs might open a thoughtful exploration path?', 'description', 'Customer need patterns from metadata — humans validate specifics.')
    ),
    'curiosity_note', 'Curiosity creates possibility — questions invite exploration, not immediate action.'
  );
$$;

create or replace function public._oebp_opportunity_evaluation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Opportunity evaluation — thoughtful consideration before pursuit.',
    'criteria', jsonb_build_array(
      jsonb_build_object('key', 'strategic_alignment', 'label', 'Strategic alignment', 'description', 'Fit with purpose, values, and strategic direction'),
      jsonb_build_object('key', 'organizational_readiness', 'label', 'Organizational readiness', 'description', 'Team capacity, capability maturity, and operational stability'),
      jsonb_build_object('key', 'resource_implications', 'label', 'Resource implications', 'description', 'Time, attention, and capability investment — sustainable ambition'),
      jsonb_build_object('key', 'potential_impact', 'label', 'Potential impact', 'description', 'Possible value if pursued — possibilities, not guarantees'),
      jsonb_build_object('key', 'risks_uncertainties', 'label', 'Risks and uncertainties', 'description', 'Transparent limitations — exploration acknowledges unknowns')
    ),
    'evaluation_note', 'Evaluation prepares informed human decisions — Aipify never auto-pursues opportunities.'
  );
$$;

create or replace function public._oebp_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion guidance — disciplined curiosity; capability alignment and additional exploration clarify value.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'capability_alignment', 'prompt', 'This opportunity may align with existing strengths — would mapping capability patterns help your review?', 'consideration', 'Alignment observation — not a recommendation to pursue.'),
      jsonb_build_object('emoji', '🌹', 'key', 'team_perspectives', 'prompt', 'Several teams could contribute perspectives on this exploration — would a cross-functional summary help?', 'consideration', 'Cross-functional curiosity — humans decide scope.'),
      jsonb_build_object('emoji', '🔔', 'key', 'additional_exploration', 'prompt', 'Additional exploration may clarify whether this opportunity deserves deeper consideration — shall I prepare a metadata summary?', 'consideration', 'Exploration not urgency — no guarantees implied.')
    )
  );
$$;

create or replace function public._oebp_innovation_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Innovation connection — small experiments, pilot programs, controlled testing, learning-oriented initiatives.',
    'connections', jsonb_build_array(
      jsonb_build_object('key', 'small_experiments', 'label', 'Small experiments', 'description', 'Low-risk trials that clarify value before larger commitment'),
      jsonb_build_object('key', 'pilot_programs', 'label', 'Pilot programs', 'description', 'Scoped pilots with clear learning objectives'),
      jsonb_build_object('key', 'controlled_testing', 'label', 'Controlled testing', 'description', 'Governed experimentation with approval workflows'),
      jsonb_build_object('key', 'learning_initiatives', 'label', 'Learning-oriented initiatives', 'description', 'Intentional innovation focused on learning, not hype')
    ),
    'innovation_lab_route', '/app/innovation-lab',
    'innovation_lab_note', 'Cross-link Innovation Lab Phase 96 / Blueprint Phase 38 — controlled experiments distinct from curiosity prompts.',
    'boundary_note', 'Opportunity exploration suggests — Innovation Lab governs formal experiment execution.'
  );
$$;

create or replace function public._oebp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — patience, perspective, sustainable ambition, incremental progress.',
    'practices', jsonb_build_array(
      'Patience — not every opportunity must be pursued immediately',
      'Perspective — exploration widens awareness without demanding action',
      'Sustainable ambition — incremental progress over frantic pursuit',
      'Grounded curiosity — open to possibility while anchored in values'
    ),
    'journey_phrase', 'Not every opportunity must be pursued immediately.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports pacing and perspective — principle only; Opportunity Exploration stores metadata, not wellbeing content.'
  );
$$;

create or replace function public._oebp_leadership_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership insights — emerging opportunity summaries, capability alignment observations, positive experimentation examples.',
    'insight_types', jsonb_build_array(
      jsonb_build_object('emoji', '📈', 'key', 'emerging_opportunity_summaries', 'label', 'Emerging opportunity summaries', 'description', 'Consolidated opportunity metadata for leadership dialogue — not urgency copy'),
      jsonb_build_object('emoji', '🦉', 'key', 'capability_alignment_observations', 'label', 'Capability alignment observations', 'description', 'Strength patterns that may support exploration'),
      jsonb_build_object('emoji', '🌹', 'key', 'positive_experimentation', 'label', 'Positive experimentation examples', 'description', 'Healthy experimentation wins — celebrate learning, not hype')
    ),
    'clarity_note', 'Insights prepare context — leadership retains authority over pursuit decisions.'
  );
$$;

create or replace function public._oebp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparency about information sources, evaluation assumptions, and optional recommendations.',
    'leaders_should_know', jsonb_build_array(
      'Which metadata sources contributed to each opportunity signal',
      'Evaluation assumptions are visible — not hidden scoring',
      'Recommendations are optional — humans decide pursuit',
      'Limitation principles block FOMO, urgency, and guarantee language'
    ),
    'organizations_should_understand', jsonb_build_array(
      'Opportunity exploration is metadata-only — no raw customer conversations',
      'Distinct from Strategy Phase 81, Strategic Intelligence Phase 79, Simulation Phase 78, and Innovation Lab Phase 96',
      'Exploration not urgency — possibilities are not promises',
      'Curiosity guided by wisdom — open to possibility, grounded in purpose'
    ),
    'audit_note', 'Prompt explore/dismiss and settings events logged via _cde_log — metadata only.'
  );
$$;

create or replace function public._oebp_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Limitation principles — exploration not urgency; no FOMO, no excessive chasing, no possibilities as guarantees.',
    'forbidden', jsonb_build_array(
      'FOMO-driven copy or missed-opportunity pressure',
      'Excessive chasing of every emerging signal',
      'Presenting possibilities as guarantees or promised outcomes',
      'Urgency framing that bypasses human evaluation'
    ),
    'required', jsonb_build_array(
      'Exploration framed as thoughtful consideration — not urgency',
      'Transparent sources and evaluation assumptions',
      'Human authority over pursuit decisions',
      'Disciplined curiosity — recognize right opportunities, not every one'
    ),
    'boundary_note', 'Aipify cultivates awareness — humans decide what to pursue.'
  );
$$;

create or replace function public._oebp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates opportunity exploration patterns internally before customer rollout.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — ecosystem expansion, product innovation, Sales Expert evolution, organizational development',
      'focus', jsonb_build_array(
        'Ecosystem expansion opportunity patterns',
        'Product innovation and module exploration cues',
        'Sales Expert evolution and marketplace growth observations',
        'Organizational development and capability alignment signals'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce opportunity exploration',
      'focus', jsonb_build_array(
        'Customer need patterns from support metadata',
        'Commerce expansion opportunities',
        'Operational simplification exploration prompts'
      )
    )
  );
$$;

create or replace function public._oebp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'This opportunity was already within reach. We simply needed to recognize it.',
    'Awareness of overlooked possibilities — curiosity guided by wisdom.',
    'Recognize the right opportunities — not chase every one.',
    'Exploration not urgency — thoughtful consideration before pursuit.',
    'Open to possibility while grounded in purpose and values.',
    'Humans decide what to pursue — Aipify informs and prepares.'
  );
$$;

create or replace function public._oebp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Innovation Lab (Phase 96 / Blueprint 38)', 'route', '/app/innovation-lab', 'note', 'Controlled experiments — cross-link for innovation connection'),
    jsonb_build_object('label', 'Growth & Evolution (A.81)', 'route', '/app/growth-evolution-engine', 'note', 'Emerging_opportunity signals — cross-link only'),
    jsonb_build_object('label', 'Strategic Intelligence (A.31 / Blueprint 79)', 'route', '/app/strategic-intelligence-foundation-engine', 'note', 'Strategic awareness — distinct from opportunity exploration'),
    jsonb_build_object('label', 'Sales Expert (A.79)', 'route', '/app/sales-expert-engine', 'note', 'Sales observations and pipeline metadata — cross-link'),
    jsonb_build_object('label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine', 'note', 'Organizational knowledge source — cross-link KC A.5'),
    jsonb_build_object('label', 'Innovation & Impact (A.28)', 'route', '/app/innovation-impact-engine', 'note', 'Impact baselines — integrates with curiosity prompts'),
    jsonb_build_object('label', 'Learning Engine', 'route', '/app/learning', 'note', 'Customer learning memory — distinct from exploration prompts'),
    jsonb_build_object('label', 'Legacy Strategic Scorecard (Phase 81)', 'route', '/app/strategy', 'note', 'Legacy strategic intelligence — cross-link only'),
    jsonb_build_object('label', 'Continuity (Blueprint Phase 73 / Repo Phase 80)', 'route', '/app/continuity', 'note', 'Organizational continuity — phase number collision with Blueprint 80'),
    jsonb_build_object('label', 'Simulation Decision Lab (Phase 78)', 'route', '/app/simulations', 'note', 'Simulation predicts — distinct from opportunity exploration'),
    jsonb_build_object('label', 'Wonder Engine (A.88)', 'route', '/app/wonder-engine', 'note', 'Amazement and possibility — distinct surface'),
    jsonb_build_object('label', 'Wisdom Engine (A.93)', 'route', '/app/wisdom-engine', 'note', 'Experience synthesis — distinct from opportunity identification'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Patience and sustainable ambition — principle only')
  );
$$;

create or replace function public._oebp_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_prompts int := 0;
  v_pending int := 0;
  v_explored int := 0;
  v_dismissed int := 0;
  v_signals int := 0;
  v_categories int := 0;
begin
  select count(*) into v_prompts
  from public.organization_discovery_prompts where organization_id = p_organization_id;

  select count(*) into v_pending
  from public.organization_discovery_prompts
  where organization_id = p_organization_id and status = 'pending';

  select count(*) into v_explored
  from public.organization_discovery_prompts
  where organization_id = p_organization_id and status = 'explored';

  select count(*) into v_dismissed
  from public.organization_discovery_prompts
  where organization_id = p_organization_id and status = 'dismissed';

  select count(*) into v_signals
  from public.organization_discovery_signals where organization_id = p_organization_id;

  select count(distinct category) into v_categories
  from public.organization_discovery_prompts
  where organization_id = p_organization_id;

  return jsonb_build_object(
    'prompt_count', coalesce(v_prompts, 0),
    'pending_prompts', coalesce(v_pending, 0),
    'explored_prompts', coalesce(v_explored, 0),
    'dismissed_prompts', coalesce(v_dismissed, 0),
    'signal_count', coalesce(v_signals, 0),
    'prompt_categories', coalesce(v_categories, 0),
    'opportunity_questions', jsonb_array_length(public._oebp_opportunity_questions()->'questions'),
    'opportunity_sources', jsonb_array_length(public._oebp_opportunity_sources()->'sources'),
    'companion_examples', jsonb_array_length(public._oebp_companion_guidance()->'examples'),
    'privacy_note', 'Metadata only — prompt and signal counts, categories. No raw customer content or PII.'
  );
end; $$;

create or replace function public._oebp_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_explored int := 0;
  v_signals int := 0;
begin
  v_engagement := public._oebp_engagement_summary(p_organization_id);
  v_explored := coalesce((v_engagement->>'explored_prompts')::int, 0);
  v_signals := coalesce((v_engagement->>'signal_count')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'meaningful_attention',
      'label', 'Meaningful opportunities receive attention — exploration prompts documented',
      'met', coalesce((v_engagement->>'prompt_count')::int, 0) > 0,
      'note', case when coalesce((v_engagement->>'prompt_count')::int, 0) = 0 then 'Seed or generate discovery prompts to validate opportunity attention.' else null end
    ),
    jsonb_build_object(
      'key', 'strategic_curiosity',
      'label', 'Strategic curiosity increases — opportunity questions and sources documented',
      'met', jsonb_array_length(public._oebp_opportunity_questions()->'questions') >= 3
        and jsonb_array_length(public._oebp_opportunity_sources()->'sources') >= 7,
      'note', 'Insufficient attention, strengths supporting growth, unmet customer needs — curiosity creates possibility.'
    ),
    jsonb_build_object(
      'key', 'disciplined_innovation',
      'label', 'Disciplined innovation — innovation connection and limitation principles documented',
      'met', jsonb_array_length(public._oebp_innovation_connection()->'connections') >= 4
        and jsonb_array_length(public._oebp_limitation_principles()->'forbidden') >= 4,
      'note', 'Cross-link Innovation Lab Phase 96 — exploration not urgency.'
    ),
    jsonb_build_object(
      'key', 'intentional_pursuit',
      'label', 'Intentional pursuit — evaluation criteria and companion guidance documented',
      'met', jsonb_array_length(public._oebp_opportunity_evaluation()->'criteria') >= 5
        and jsonb_array_length(public._oebp_companion_guidance()->'examples') >= 3,
      'note', 'Thoughtful evaluation before pursuit — humans decide.'
    ),
    jsonb_build_object(
      'key', 'long_term_adaptability',
      'label', 'Long-term adaptability — objectives and vision phrases documented',
      'met', jsonb_array_length(public._oebp_objectives()) >= 6
        and jsonb_array_length(public._oebp_vision_phrases()) >= 4,
      'note', 'Open to possibility while grounded in purpose and values.'
    ),
    jsonb_build_object(
      'key', 'exploration_workflow',
      'label', 'Exploration workflow — prompts explored or signals present',
      'met', v_explored > 0 or v_signals > 0,
      'note', case when v_explored = 0 and v_signals = 0 then 'Explore prompts or accumulate signals to validate workflow.' else null end
    ),
    jsonb_build_object(
      'key', 'leadership_insights',
      'label', 'Leadership insights — emerging summaries and alignment observations documented',
      'met', jsonb_array_length(public._oebp_leadership_insights()->'insight_types') >= 3,
      'note', 'Emerging opportunity summaries, capability alignment, positive experimentation.'
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — patience and sustainable ambition documented',
      'met', (public._oebp_self_love_connection()->>'journey_phrase') is not null,
      'note', 'Not every opportunity must be pursued immediately.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — sources, assumptions, optional recommendations documented',
      'met', jsonb_array_length(public._oebp_trust_connection()->'leaders_should_know') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links Innovation Lab 96, Growth A.81, Strategic Intelligence 79, Sales Expert, KC A.5',
      'met', jsonb_array_length(public._oebp_integration_links()) >= 10,
      'note', 'Extend related engines — do not duplicate opportunity storage.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Aipify Group ecosystem expansion, product innovation, Sales Expert evolution',
      'met', (public._oebp_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL A.87 fields; append Phase 80
-- ---------------------------------------------------------------------------
create or replace function public.get_curiosity_discovery_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_curiosity_discovery_engine_settings;
begin
  perform public._irp_require_permission('curiosity_discovery.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._cde_ensure_settings(v_org_id);
  perform public._cde_seed_prompts(v_org_id);
  perform public._cde_seed_signals(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'The future belongs to curious organizations — questions matter more than immediate answers.',
    'mission', 'Discover better ways of working, learning, and creating value.',
    'abos_principle', 'Answers solve today; curiosity creates tomorrow.',
    'vision', 'What if?',
    'distinction_note',
      'Distinct from Learning Engine (/app/learning), Innovation & Impact A.28 (/app/innovation-impact-engine), Innovation Experimentation phases, and Growth & Evolution A.81 (/app/growth-evolution-engine). Curiosity = exploration prompts, discovery categories, question-led culture.',
    'discovery_categories', public._cde_discovery_categories(),
    'question_examples', public._cde_question_examples(),
    'self_love_note', public._cde_self_love_note(),
    'trust_note', public._cde_trust_note(),
    'settings', row_to_json(v_settings)::jsonb,
    'recent_prompts', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'category', p.category,
          'prompt', p.prompt,
          'context_summary', p.context_summary,
          'status', p.status,
          'metadata', p.metadata,
          'created_at', p.created_at,
          'updated_at', p.updated_at
        ) order by p.created_at desc
      )
      from (
        select * from public.organization_discovery_prompts
        where organization_id = v_org_id
        order by created_at desc
        limit 15
      ) p
    ), '[]'::jsonb),
    'recent_signals', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'category', s.category,
          'summary', s.summary,
          'confidence', s.confidence,
          'metadata', s.metadata,
          'created_at', s.created_at,
          'updated_at', s.updated_at
        ) order by s.created_at desc
      )
      from (
        select * from public.organization_discovery_signals
        where organization_id = v_org_id
        order by created_at desc
        limit 15
      ) s
    ), '[]'::jsonb),
    'summary', jsonb_build_object(
      'prompt_count', coalesce((
        select count(*) from public.organization_discovery_prompts where organization_id = v_org_id
      ), 0),
      'pending_prompts', coalesce((
        select count(*) from public.organization_discovery_prompts
        where organization_id = v_org_id and status = 'pending'
      ), 0),
      'explored_prompts', coalesce((
        select count(*) from public.organization_discovery_prompts
        where organization_id = v_org_id and status = 'explored'
      ), 0),
      'prompts_by_category', coalesce((
        select jsonb_object_agg(category, cnt)
        from (
          select category, count(*) as cnt
          from public.organization_discovery_prompts
          where organization_id = v_org_id
          group by category
        ) d
      ), '{}'::jsonb),
      'signal_count', coalesce((
        select count(*) from public.organization_discovery_signals where organization_id = v_org_id
      ), 0),
      'encourage_experimentation', v_settings.encourage_experimentation,
      'prompt_cadence', v_settings.prompt_cadence
    ),
    'integration_links', jsonb_build_object(
      'learning_engine', '/app/learning',
      'innovation_impact', '/app/innovation-impact-engine',
      'growth_evolution', '/app/growth-evolution-engine',
      'continuous_improvement', '/app/continuous-improvement-engine',
      'legacy_engine', '/app/legacy-engine'
    ),
    'implementation_blueprint_phase80', jsonb_build_object(
      'phase', 'Phase 80 — Opportunity Exploration Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE80_OPPORTUNITY_EXPLORATION.md',
      'engine_phase', 'A.87 Curiosity & Discovery Engine',
      'route', '/app/curiosity-discovery-engine',
      'mapping_note', 'ABOS Blueprint Phase 80 extends Curiosity & Discovery A.87 with opportunity identification, evaluation, innovation connection, limitation principles, and live success criteria. Distinct from Continuity repo Phase 80 at /app/continuity.'
    ),
    'opportunity_exploration_note', 'Opportunity Exploration Engine (ABOS Phase 80) — cultivate curiosity and strategic awareness by identifying opportunities worthy of exploration and thoughtful consideration.',
    'blueprint_distinction_note', public._oebp_distinction_note(),
    'blueprint_mission', public._oebp_mission(),
    'blueprint_philosophy', public._oebp_philosophy(),
    'blueprint_abos_principle', public._oebp_abos_principle(),
    'blueprint_objectives', public._oebp_objectives(),
    'opportunity_sources', public._oebp_opportunity_sources(),
    'opportunity_questions', public._oebp_opportunity_questions(),
    'opportunity_evaluation', public._oebp_opportunity_evaluation(),
    'companion_guidance', public._oebp_companion_guidance(),
    'innovation_connection', public._oebp_innovation_connection(),
    'blueprint_self_love_connection', public._oebp_self_love_connection(),
    'leadership_insights', public._oebp_leadership_insights(),
    'blueprint_trust_connection', public._oebp_trust_connection(),
    'limitation_principles', public._oebp_limitation_principles(),
    'blueprint_dogfooding', public._oebp_dogfooding(),
    'blueprint_integration_links', public._oebp_integration_links(),
    'engagement_summary', public._oebp_engagement_summary(v_org_id),
    'blueprint_success_criteria', public._oebp_success_criteria(v_org_id),
    'blueprint_vision_phrases', public._oebp_vision_phrases(),
    'blueprint_privacy_note', 'Opportunity exploration and Phase 80 blueprint data is metadata only — prompt counts, signal summaries, and evaluation themes. No raw customer content, chat, or PII. Exploration not urgency — possibilities are not guarantees.',
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('curiosity_discovery.manage'),
      'can_export', public._irp_has_permission('curiosity_discovery.export'),
      'can_explore_prompts', public._irp_has_permission('curiosity_discovery.prompts.explore')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve A.87 fields; append Phase 80 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_curiosity_discovery_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_prompts int := 0;
  v_pending int := 0;
  v_signals int := 0;
  v_engagement jsonb;
begin
  perform public._irp_require_permission('curiosity_discovery.view');
  v_org_id := public._mta_require_organization();
  perform public._cde_ensure_settings(v_org_id);
  perform public._cde_seed_prompts(v_org_id);
  perform public._cde_seed_signals(v_org_id);
  v_engagement := public._oebp_engagement_summary(v_org_id);

  select count(*) into v_prompts
  from public.organization_discovery_prompts where organization_id = v_org_id;

  select count(*) into v_pending
  from public.organization_discovery_prompts
  where organization_id = v_org_id and status = 'pending';

  select count(*) into v_signals
  from public.organization_discovery_signals where organization_id = v_org_id;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Answers solve today; curiosity creates tomorrow.',
    'prompt_count', v_prompts,
    'pending_prompts', v_pending,
    'signal_count', v_signals,
    'enabled', (select enabled from public.organization_curiosity_discovery_engine_settings where organization_id = v_org_id),
    'implementation_blueprint_phase80', jsonb_build_object(
      'phase', 'Phase 80 — Opportunity Exploration Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE80_OPPORTUNITY_EXPLORATION.md',
      'engine_phase', 'A.87 Curiosity & Discovery Engine',
      'route', '/app/curiosity-discovery-engine'
    ),
    'blueprint_mission', public._oebp_mission(),
    'blueprint_abos_principle', public._oebp_abos_principle(),
    'engagement_summary', v_engagement,
    'blueprint_note', 'Opportunity Exploration Engine (ABOS Phase 80) — disciplined curiosity for opportunities worthy of exploration.',
    'exploration_note', 'Exploration not urgency — possibilities are not guarantees.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._oebp_distinction_note() to authenticated;
grant execute on function public._oebp_mission() to authenticated;
grant execute on function public._oebp_philosophy() to authenticated;
grant execute on function public._oebp_abos_principle() to authenticated;
grant execute on function public._oebp_objectives() to authenticated;
grant execute on function public._oebp_opportunity_sources() to authenticated;
grant execute on function public._oebp_opportunity_questions() to authenticated;
grant execute on function public._oebp_opportunity_evaluation() to authenticated;
grant execute on function public._oebp_companion_guidance() to authenticated;
grant execute on function public._oebp_innovation_connection() to authenticated;
grant execute on function public._oebp_self_love_connection() to authenticated;
grant execute on function public._oebp_leadership_insights() to authenticated;
grant execute on function public._oebp_trust_connection() to authenticated;
grant execute on function public._oebp_limitation_principles() to authenticated;
grant execute on function public._oebp_dogfooding() to authenticated;
grant execute on function public._oebp_vision_phrases() to authenticated;
grant execute on function public._oebp_integration_links() to authenticated;
grant execute on function public._oebp_engagement_summary(uuid) to authenticated;
grant execute on function public._oebp_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'curiosity-discovery-blueprint-phase80', 'Opportunity Exploration Engine (ABOS Phase 80)',
  'Opportunity Exploration Engine — extends Curiosity & Discovery A.87 with opportunity identification, evaluation, innovation connection, limitation principles, and live success criteria.',
  'authenticated', 120
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'curiosity-discovery-blueprint-phase80' and tenant_id is null
);
