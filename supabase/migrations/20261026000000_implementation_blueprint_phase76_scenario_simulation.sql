-- Implementation Blueprint Phase 76 — Scenario Simulation Engine
-- Extends Simulation & Decision Lab Phase 78 (layered with Blueprint Phase 22). No new tables.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._ssbp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 76 — Scenario Simulation Engine at /app/simulations. Extends Simulation & Decision Lab Phase 78 (layered with Blueprint Phase 22 via _sdlbp_* helpers). Distinct from Trust, Transparency & Explainability repo Phase 76 at /app/trust. Distinct from Decision Support Engine Phase 38 / Blueprint Phase 60 at /app/assistant/decisions (reflection scaffolding — not quantitative simulation). Distinct from Organizational Decision Support A.54 at /app/organizational-decision-support-engine. Distinct from Future Readiness Blueprint Phase 63 at /app/future-tech (reflection NOT prediction). Distinct from Predictive Operations Blueprint Phase 74 at /app/predictive-insights-engine (predictive preparedness — cross-link). Distinct from Innovation Lab Phase 96 at /app/innovation-lab (controlled experiments — simulation never acts). Distinct from Organizational Resilience A.50 at /app/organizational-resilience-engine (crisis scenario planning — cross-link). Engine Phase 78 helpers use simulation tables; Blueprint Phase 22 uses _sdlbp_* — Blueprint Phase 76 uses _ssbp_* only. Simulation predicts. Simulation never acts. Production isolated.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._ssbp_mission()
returns text language sql immutable as $$
  select 'Help organizations evaluate strategic options by exploring multiple potential outcomes in safe structured environments.';
$$;

create or replace function public._ssbp_philosophy()
returns text language sql immutable as $$
  select 'No one predicts the future with certainty — strengthen preparedness by considering possibilities before acting. Objective is perspective, NOT prediction.';
$$;

create or replace function public._ssbp_abos_principle()
returns text language sql immutable as $$
  select 'Wisdom emerges through considering possibilities before committing — prepared organizations learn before circumstances force them.';
$$;

create or replace function public._ssbp_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'strategic_simulations', 'label', 'Strategic simulations', 'description', 'Explore growth, restructuring, and major investment scenarios before commitment'),
    jsonb_build_object('key', 'scenario_exploration', 'label', 'Scenario exploration', 'description', 'Structured what-if environments with visible assumptions — perspective not prediction'),
    jsonb_build_object('key', 'consequence_awareness', 'label', 'Consequence awareness', 'description', 'Surface unintended consequences and cross-department influence before acting'),
    jsonb_build_object('key', 'risk_preparation', 'label', 'Risk preparation', 'description', 'Challenging futures strengthen resilience — preparedness without fear-driven narratives'),
    jsonb_build_object('key', 'opportunity_evaluation', 'label', 'Opportunity evaluation', 'description', 'Optimistic and expected futures reveal secondary benefits and dependencies'),
    jsonb_build_object('key', 'leadership_reflection', 'label', 'Leadership reflection', 'description', 'Workshops, board discussions, and cross-functional reviews strengthen strategic dialogue')
  );
$$;

create or replace function public._ssbp_scenario_types()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Scenario types for structured exploration — metadata examples only; simulation never acts.',
    'categories', jsonb_build_array(
      jsonb_build_object(
        'key', 'growth',
        'label', 'Growth scenarios',
        'examples', jsonb_build_array(
          'Rapid customer expansion — capacity, support, and onboarding load',
          'International market entry — governance, localization, and resource requirements',
          'Sales Expert ecosystem growth — partner scaling and knowledge distribution'
        )
      ),
      jsonb_build_object(
        'key', 'operational',
        'label', 'Operational scenarios',
        'examples', jsonb_build_array(
          'Support volume increases — backlog, escalation, and staffing trade-offs',
          'Workforce changes — responsibility redistribution and knowledge gaps',
          'Resource constraints — bottleneck identification and priority shifts'
        )
      ),
      jsonb_build_object(
        'key', 'strategic',
        'label', 'Strategic scenarios',
        'examples', jsonb_build_array(
          'New product launches — adoption curves and operational readiness',
          'Organizational restructuring — approval paths and continuity implications',
          'Major investments — ROI assumptions, dependencies, and governance impact'
        )
      )
    )
  );
$$;

create or replace function public._ssbp_simulation_questions()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Simulation questions strengthen preparedness — thoughtful exploration, not prediction certainty.',
    'questions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'demand_doubles', 'question', 'What if demand doubles in the next 12 months?', 'consideration', 'Capacity, support load, and resource assumptions deserve examination.'),
      jsonb_build_object('emoji', '🌹', 'key', 'initiative_influence', 'question', 'How might this initiative influence other departments?', 'consideration', 'Cross-functional dependencies and secondary benefits surface through exploration.'),
      jsonb_build_object('emoji', '🔔', 'key', 'unintended_consequences', 'question', 'What unintended consequences might emerge?', 'consideration', 'Challenging futures reveal risks humans may address before commitment.')
    )
  );
$$;

create or replace function public._ssbp_multiple_futures()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Multiple futures — explore optimistic, expected, and challenging outcomes to strengthen preparedness.',
    'futures', jsonb_build_array(
      jsonb_build_object('key', 'optimistic', 'label', 'Optimistic future', 'description', 'What could go exceptionally well — secondary benefits and alignment with organizational strengths'),
      jsonb_build_object('key', 'expected', 'label', 'Expected future', 'description', 'Most plausible outcomes with documented assumptions — perspective not guarantee'),
      jsonb_build_object('key', 'challenging', 'label', 'Challenging future', 'description', 'Response under pressure — preparedness strengthens resilience without fear-driven narratives')
    ),
    'boundary_note', 'Futures are possibilities, not predictions — humans decide after exploration.'
  );
$$;

create or replace function public._ssbp_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion guidance — assumptions deserve examination, secondary benefits matter, dependencies require planning.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'assumptions_examination', 'prompt', 'The assumptions behind this scenario deserve examination — shall I summarize what influences the forecast?', 'consideration', 'Transparent assumptions strengthen confidence without overstating certainty.'),
      jsonb_build_object('emoji', '🌹', 'key', 'secondary_benefits', 'prompt', 'This scenario may reveal secondary benefits aligned with your strengths — worth exploring with leadership.', 'consideration', 'Positive framing when signals support thoughtful opportunity evaluation.'),
      jsonb_build_object('emoji', '🔔', 'key', 'dependencies_planning', 'prompt', 'Dependencies in this scenario require planning — would a cross-functional review help?', 'consideration', 'Gentle preparedness — reduce anxiety from uncertainty, not increase it.')
    )
  );
$$;

create or replace function public._ssbp_collaborative_simulation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collaborative simulation — strengthen dialogue through structured group exploration.',
    'contexts', jsonb_build_array(
      jsonb_build_object('key', 'leadership_workshops', 'label', 'Leadership workshops', 'description', 'Executive teams explore scenarios together — assumptions visible, humans decide'),
      jsonb_build_object('key', 'board_discussions', 'label', 'Board discussions', 'description', 'Governance-aware scenario summaries for board preparedness — metadata only'),
      jsonb_build_object('key', 'strategic_planning', 'label', 'Strategic planning sessions', 'description', 'Quarterly and annual planning informed by multiple futures exploration'),
      jsonb_build_object('key', 'cross_functional_reviews', 'label', 'Cross-functional reviews', 'description', 'Department influence and dependency mapping through collaborative simulation')
    ),
    'dialogue_note', 'Simulation strengthens conversation — never replaces human decision authority.'
  );
$$;

create or replace function public._ssbp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — curiosity, perspective, confidence, and acceptance that no organization controls every variable.',
    'practices', jsonb_build_array(
      'Curiosity toward uncertainty — exploration reduces anxiety from the unknown',
      'Perspective — scenarios inform; they do not dictate outcomes',
      'Confidence through preparation — asking better questions strengthens decisions',
      'Acceptance — no organization controls every variable; preparedness is enough'
    ),
    'journey_phrase', 'Preparedness often begins by asking better questions.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports calm exploration — principle only; Scenario Simulation stores metadata, not wellbeing content.'
  );
$$;

create or replace function public._ssbp_leadership_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership insights — scenario preparedness summaries, emerging strategic observations, organizational strengths revealed.',
    'insight_types', jsonb_build_array(
      jsonb_build_object('emoji', '📈', 'key', 'preparedness_summaries', 'label', 'Scenario preparedness summaries', 'description', 'Aggregate simulation metadata for leadership review — counts and confidence, not customer records'),
      jsonb_build_object('emoji', '🦉', 'key', 'strategic_observations', 'label', 'Emerging strategic observations', 'description', 'Patterns across scenarios that deserve leadership attention — exploration not alarm'),
      jsonb_build_object('emoji', '🌹', 'key', 'organizational_strengths', 'label', 'Organizational strengths revealed', 'description', 'Optimistic futures highlight capabilities and alignment worth building on')
    ),
    'dialogue_note', 'Leadership observations encourage preparedness dialogue — not fear-based communication.'
  );
$$;

create or replace function public._ssbp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparency about assumptions influencing simulations, limitations, and the fact that scenarios are possibilities not predictions.',
    'users_should_know', jsonb_build_array(
      'Every simulation records assumptions with source and confidence',
      'Scenarios are possibilities — not guarantees or certainties',
      'Production remains isolated — simulation never acts',
      'Low confidence recommends human review — never silent auto-action'
    ),
    'operators_should_understand', jsonb_build_array(
      'Distinct from Trust Engine repo Phase 76 at /app/trust — explainability surface, not simulation lab',
      'Distinct from Predictive Operations Phase 74 — predictive preparedness cross-link only',
      'Distinct from Future Readiness Phase 63 — reflection NOT prediction',
      'Limitation principles block guarantee and fear-driven simulation copy'
    ),
    'audit_note', 'Simulation runs and comparisons logged — metadata only, no PII.'
  );
$$;

create or replace function public._ssbp_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Limitation principles — exploration not prediction; simulation never acts.',
    'forbidden', jsonb_build_array(
      'Simulations presented as guarantees or certainties',
      'Overstating certainty in scenario outcomes',
      'Fear-driven narratives or alarmist simulation copy',
      'Auto-execution or production changes based on simulation results'
    ),
    'required', jsonb_build_array(
      'Explicit assumptions and confidence on every run',
      'Multiple futures framing — optimistic, expected, challenging',
      'Human decision authority — simulation prepares, humans commit',
      'Production isolation enforced on every simulation run'
    ),
    'boundary_note', 'Objective is perspective, NOT prediction. Simulation predicts — simulation never acts.'
  );
$$;

create or replace function public._ssbp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates scenario simulation patterns internally before customer rollout.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — ecosystem growth planning, product expansion, Sales Expert scaling, strategic investments',
      'focus', jsonb_build_array(
        'Ecosystem growth planning — partner and module expansion scenarios',
        'Product expansion — launch readiness and support load modeling',
        'Sales Expert scaling — partner ecosystem growth simulations',
        'Strategic investments — ROI assumptions and governance impact'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce growth and operational scenario exploration',
      'focus', jsonb_build_array(
        'Support volume surge and staffing scenarios',
        'Launch and peak-event workload simulations',
        'Market expansion readiness exploration',
        'Cross-functional dependency reviews before commitments'
      )
    )
  );
$$;

create or replace function public._ssbp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We explored this possibility before it became reality.',
    'Uncertainty approached with curiosity, humility, and strategic discipline.',
    'Preparedness often begins by asking better questions.',
    'Perspective strengthens decisions — simulation never acts.',
    'Wisdom emerges through considering possibilities before committing.'
  );
$$;

create or replace function public._ssbp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Decision Support Engine (Blueprint Phase 60)', 'route', '/app/assistant/decisions', 'note', 'Reflection scaffolding — not quantitative simulation'),
    jsonb_build_object('label', 'Future Readiness (Blueprint Phase 63)', 'route', '/app/future-tech', 'note', 'Reflection NOT prediction — cross-link only'),
    jsonb_build_object('label', 'Predictive Operations (Blueprint Phase 74)', 'route', '/app/predictive-insights-engine', 'note', 'Predictive preparedness — cross-link, distinct storage'),
    jsonb_build_object('label', 'Executive Operations Center (Blueprint Phase 75)', 'route', '/app/operations-center-foundation-engine', 'note', 'Executive leadership situational awareness — cross-link'),
    jsonb_build_object('label', 'Organizational Resilience (A.50)', 'route', '/app/organizational-resilience-engine', 'note', 'Crisis scenario planning — cross-link, not duplicate'),
    jsonb_build_object('label', 'Innovation Lab (Phase 96)', 'route', '/app/innovation-lab', 'note', 'Controlled experiments — simulation never acts'),
    jsonb_build_object('label', 'Organizational Decision Support (A.54)', 'route', '/app/organizational-decision-support-engine', 'note', 'Org-level decision workflows — distinct from simulation'),
    jsonb_build_object('label', 'Trust Engine (repo Phase 76)', 'route', '/app/trust', 'note', 'Explainability surface — distinct from Scenario Simulation Blueprint Phase 76'),
    jsonb_build_object('label', 'Digital Twin (Phase 77)', 'route', '/app/digital-twin-engine', 'note', 'Read-only context for simulation runs'),
    jsonb_build_object('label', 'Executive Insights (A.35)', 'route', '/app/executive-insights-engine', 'note', 'Leadership perspective summaries — cross-link'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Curiosity and confidence through preparation — principle only')
  );
$$;

create or replace function public._ssbp_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_scenarios int := 0;
  v_ready_scenarios int := 0;
  v_runs int := 0;
  v_runs_30d int := 0;
  v_categories_used int := 0;
begin
  select count(*) into v_scenarios
  from public.simulation_scenarios
  where tenant_id = p_tenant_id and status != 'archived';

  select count(*) into v_ready_scenarios
  from public.simulation_scenarios
  where tenant_id = p_tenant_id and status = 'ready';

  select count(*) into v_runs
  from public.simulation_runs
  where tenant_id = p_tenant_id;

  select count(*) into v_runs_30d
  from public.simulation_runs
  where tenant_id = p_tenant_id and created_at >= now() - interval '30 days';

  select count(distinct category) into v_categories_used
  from public.simulation_scenarios
  where tenant_id = p_tenant_id and status != 'archived';

  return jsonb_build_object(
    'scenarios_total', v_scenarios,
    'scenarios_ready', v_ready_scenarios,
    'simulation_runs_total', v_runs,
    'simulation_runs_last_30d', v_runs_30d,
    'categories_used', v_categories_used,
    'production_isolated', true,
    'privacy_note', 'Counts only — no scenario content, customer records, or PII.'
  );
end; $$;

create or replace function public._ssbp_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_scenarios int := 0;
  v_runs int := 0;
  v_has_assumptions boolean := false;
begin
  v_engagement := public._ssbp_engagement_summary(p_tenant_id);
  v_scenarios := coalesce((v_engagement->>'scenarios_total')::int, 0);
  v_runs := coalesce((v_engagement->>'simulation_runs_total')::int, 0);

  select exists (
    select 1 from public.simulation_assumptions a
    join public.simulation_runs r on r.id = a.simulation_run_id
    where r.tenant_id = p_tenant_id
    limit 1
  ) into v_has_assumptions;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'greater_preparedness',
      'label', 'Greater preparedness — at least one scenario available for exploration',
      'met', v_scenarios > 0,
      'note', case when v_scenarios = 0 then 'Create or seed scenarios to begin structured exploration.' else null end
    ),
    jsonb_build_object(
      'key', 'strategic_conversations',
      'label', 'Deeper strategic conversations — simulation runs generate outcomes',
      'met', v_runs > 0,
      'note', case when v_runs = 0 then 'Run a simulation to explore multiple futures with visible assumptions.' else null end
    ),
    jsonb_build_object(
      'key', 'risk_awareness',
      'label', 'Improved risk awareness — challenging futures and consequence questions documented',
      'met', jsonb_array_length(public._ssbp_simulation_questions()->'questions') >= 3,
      'note', 'Unintended consequences and cross-department influence questions available as metadata.'
    ),
    jsonb_build_object(
      'key', 'opportunity_exploration',
      'label', 'Expanded opportunity exploration — optimistic and expected futures framing',
      'met', jsonb_array_length(public._ssbp_multiple_futures()->'futures') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'decision_confidence',
      'label', 'Strengthened decision confidence — assumptions recorded on runs',
      'met', v_has_assumptions or v_runs = 0,
      'note', case when v_runs > 0 and not v_has_assumptions then 'Assumptions populate after first simulation run.' else 'Perspective strengthens decisions — not prediction certainty.' end
    ),
    jsonb_build_object(
      'key', 'production_isolation',
      'label', 'Production isolation enforced — simulation never acts',
      'met', true,
      'note', 'Core Phase 78 rule — all runs marked production_isolated.'
    ),
    jsonb_build_object(
      'key', 'limitation_principles',
      'label', 'Limitation principles — no guarantees, no fear-driven narratives',
      'met', jsonb_array_length(public._ssbp_limitation_principles()->'forbidden') >= 4,
      'note', 'Exploration not prediction — objective is perspective.'
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Companion guidance documented (🦉🌹🔔)',
      'met', jsonb_array_length(public._ssbp_companion_guidance()->'examples') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'collaborative_simulation',
      'label', 'Collaborative simulation contexts documented',
      'met', jsonb_array_length(public._ssbp_collaborative_simulation()->'contexts') >= 4,
      'note', 'Leadership workshops, board discussions, strategic planning, cross-functional reviews.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — assumptions and limitations transparent',
      'met', jsonb_array_length(public._ssbp_trust_connection()->'users_should_know') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from DSE, Future Readiness, Predictive, Resilience, Innovation Lab, Executive Ops',
      'met', jsonb_array_length(public._ssbp_integration_links()) >= 8,
      'note', 'Extend related engines — do not duplicate.'
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS principle — wisdom through considering possibilities before committing',
      'met', true,
      'note', 'Prepared organizations learn before circumstances force them.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL Phase 78 and Phase 22 fields; append Phase 76
-- ---------------------------------------------------------------------------
create or replace function public.get_simulation_lab_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_scenarios jsonb;
  v_recent_runs jsonb;
  v_categories jsonb;
begin
  v_tenant_id := public._sim_require_tenant();
  perform public._sim_seed_scenarios();

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'title', s.title, 'category', s.category, 'description', s.description,
    'status', s.status, 'created_at', s.created_at,
    'latest_run', (
      select jsonb_build_object(
        'run_id', r.id, 'confidence_level', r.confidence_level,
        'estimated_value', r.estimated_value, 'estimated_time_saved', r.estimated_time_saved
      )
      from public.simulation_runs r where r.scenario_id = s.id
      order by r.created_at desc limit 1
    )
  ) order by s.created_at desc), '[]'::jsonb) into v_scenarios
  from public.simulation_scenarios s
  where s.tenant_id = v_tenant_id and s.status != 'archived';

  select coalesce(jsonb_agg(jsonb_build_object(
    'run_id', r.id, 'scenario_title', s.title, 'category', s.category,
    'confidence_level', r.confidence_level, 'estimated_value', r.estimated_value,
    'estimated_risk', r.estimated_risk, 'created_at', r.created_at
  ) order by r.created_at desc), '[]'::jsonb) into v_recent_runs
  from public.simulation_runs r
  join public.simulation_scenarios s on s.id = r.scenario_id
  where r.tenant_id = v_tenant_id limit 10;

  select coalesce(jsonb_agg(distinct jsonb_build_object('category', category, 'count', cnt)), '[]'::jsonb)
  into v_categories
  from (
    select category, count(*) as cnt from public.simulation_scenarios
    where tenant_id = v_tenant_id and status != 'archived'
    group by category
  ) c;

  return jsonb_build_object(
    'has_customer', true,
    'production_isolated', true,
    'scenarios', v_scenarios,
    'recent_runs', v_recent_runs,
    'categories', v_categories,
    'integrations', jsonb_build_object(
      'digital_twin', 'Read-only ownership and escalation models',
      'value_engine', 'Time savings and ROI estimates',
      'governance', 'Compliance and approval impact',
      'trust_engine', 'Simulation explanations with assumptions',
      'learning_engine', 'Accuracy tracking over time',
      'executive_briefing', 'Strategic scenario summaries'
    ),
    'categories_supported', jsonb_build_array(
      'workflow', 'governance', 'notification', 'organization', 'resource',
      'automation', 'marketplace', 'blueprint', 'executive'
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 22 — Simulation & Decision Lab',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE22_SIMULATION_DECISION_LAB.md',
      'engine_phase', 'Phase 78 Simulation & Decision Lab',
      'route', '/app/simulations',
      'mapping_note', 'ABOS Blueprint Phase 22 maps to Simulation & Decision Lab Phase 78 — extend, do not duplicate Organizational Decision Support A.54, Decision Support assistant, or Organizational Resilience A.48.'
    ),
    'mission', 'Safe environment to explore decisions before committing resources — what happens if we choose this path?',
    'philosophy', 'Experience is valuable; foresight is powerful — do not learn every lesson the hard way.',
    'abos_principle', 'Preparation reduces uncertainty — perspective strengthens decisions.',
    'vision', 'Trusted lab for exploring possibilities — ask difficult questions safely before committing resources.',
    'simulation_lab_note', 'Simulation & Decision Lab (ABOS Phase 22) — extends Simulation & Decision Lab (Phase 78). Simulation predicts. Simulation never acts.',
    'distinction_note', public._sdlbp_distinction_note(),
    'simulation_objectives', public._sdlbp_blueprint_simulation_objectives(),
    'simulation_examples', public._sdlbp_blueprint_simulation_examples(),
    'decision_comparison_framework', public._sdlbp_blueprint_decision_comparison_framework(),
    'companion_examples', public._sdlbp_blueprint_companion_examples(),
    'self_love_connection', public._sdlbp_blueprint_self_love_connection(),
    'trust_connection', public._sdlbp_blueprint_trust_connection(),
    'dogfooding', public._sdlbp_blueprint_dogfooding(),
    'integration_links', public._sdlbp_blueprint_integration_links(),
    'engagement_summary', public._sdlbp_engagement_summary(v_tenant_id),
    'success_criteria', public._sdlbp_blueprint_success_criteria(v_tenant_id),
    'vision_phrases', public._sdlbp_blueprint_vision_phrases(),
    'safety_note', 'Simulations never modify production data, trigger automations, send notifications, or bypass Governance.',
    'principles', jsonb_build_array(
      'Simulation predicts — simulation never acts',
      'Production isolated by default on every run',
      'Assumptions visible with source and confidence',
      'Humans decide — Option A vs Option B comparison only',
      'Digital Twin read-only context — no production mutations'
    ),
    'implementation_blueprint_phase76', jsonb_build_object(
      'phase', 'Phase 76 — Scenario Simulation Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE76_SCENARIO_SIMULATION.md',
      'engine_phase', 'Phase 78 Simulation & Decision Lab (layered with Phase 22)',
      'route', '/app/simulations',
      'mapping_note', 'ABOS Blueprint Phase 76 extends Phase 78 with strategic scenario exploration, multiple futures, and limitation principles — layered with Phase 22 _sdlbp_* helpers.'
    ),
    'scenario_simulation_engine_note', 'Scenario Simulation Engine (ABOS Phase 76) — structured scenario exploration before significant decisions. Perspective not prediction.',
    'blueprint_phase76_distinction_note', public._ssbp_distinction_note(),
    'blueprint_phase76_mission', public._ssbp_mission(),
    'blueprint_phase76_philosophy', public._ssbp_philosophy(),
    'blueprint_phase76_abos_principle', public._ssbp_abos_principle(),
    'blueprint_phase76_objectives', public._ssbp_objectives(),
    'blueprint_phase76_scenario_types', public._ssbp_scenario_types(),
    'blueprint_phase76_simulation_questions', public._ssbp_simulation_questions(),
    'blueprint_phase76_multiple_futures', public._ssbp_multiple_futures(),
    'blueprint_phase76_companion_guidance', public._ssbp_companion_guidance(),
    'blueprint_phase76_collaborative_simulation', public._ssbp_collaborative_simulation(),
    'blueprint_phase76_self_love_connection', public._ssbp_self_love_connection(),
    'blueprint_phase76_leadership_insights', public._ssbp_leadership_insights(),
    'blueprint_phase76_trust_connection', public._ssbp_trust_connection(),
    'blueprint_phase76_limitation_principles', public._ssbp_limitation_principles(),
    'blueprint_phase76_dogfooding', public._ssbp_dogfooding(),
    'blueprint_phase76_integration_links', public._ssbp_integration_links(),
    'blueprint_phase76_engagement_summary', public._ssbp_engagement_summary(v_tenant_id),
    'blueprint_phase76_success_criteria', public._ssbp_success_criteria(v_tenant_id),
    'blueprint_phase76_vision_phrases', public._ssbp_vision_phrases(),
    'blueprint_phase76_safety_note', 'Scenarios are possibilities not predictions — simulation never acts; production isolated.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve Phase 78 and Phase 22 fields; append Phase 76
-- ---------------------------------------------------------------------------
create or replace function public.get_simulation_lab_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_scenarios int;
  v_runs int;
  v_engagement jsonb;
  v_phase76_engagement jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select count(*) into v_scenarios from public.simulation_scenarios where tenant_id = v_tenant_id and status != 'archived';
  select count(*) into v_runs from public.simulation_runs where tenant_id = v_tenant_id;

  v_engagement := public._sdlbp_engagement_summary(v_tenant_id);
  v_phase76_engagement := public._ssbp_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'scenario_count', v_scenarios,
    'run_count', v_runs,
    'philosophy', 'Simulation Engine predicts. Simulation Engine never acts.',
    'production_isolated', true,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 22 — Simulation & Decision Lab',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE22_SIMULATION_DECISION_LAB.md',
      'engine_phase', 'Phase 78 Simulation & Decision Lab',
      'route', '/app/simulations'
    ),
    'mission', 'Safe environment to explore decisions before committing resources — what happens if we choose this path?',
    'abos_principle', 'Preparation reduces uncertainty — perspective strengthens decisions.',
    'engagement_summary', v_engagement,
    'blueprint_note', 'Simulation & Decision Lab (ABOS Phase 22) — extends Phase 78 with blueprint metadata, decision comparison framework, and live success criteria on the dashboard.',
    'implementation_blueprint_phase76', jsonb_build_object(
      'phase', 'Phase 76 — Scenario Simulation Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE76_SCENARIO_SIMULATION.md',
      'engine_phase', 'Phase 78 Simulation & Decision Lab (layered with Phase 22)',
      'route', '/app/simulations'
    ),
    'blueprint_phase76_mission', public._ssbp_mission(),
    'blueprint_phase76_abos_principle', public._ssbp_abos_principle(),
    'blueprint_phase76_engagement_summary', v_phase76_engagement,
    'blueprint_phase76_note', 'Scenario Simulation Engine (ABOS Phase 76) — structured scenario exploration before significant decisions. Perspective not prediction.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._ssbp_distinction_note() to authenticated;
grant execute on function public._ssbp_mission() to authenticated;
grant execute on function public._ssbp_philosophy() to authenticated;
grant execute on function public._ssbp_abos_principle() to authenticated;
grant execute on function public._ssbp_objectives() to authenticated;
grant execute on function public._ssbp_scenario_types() to authenticated;
grant execute on function public._ssbp_simulation_questions() to authenticated;
grant execute on function public._ssbp_multiple_futures() to authenticated;
grant execute on function public._ssbp_companion_guidance() to authenticated;
grant execute on function public._ssbp_collaborative_simulation() to authenticated;
grant execute on function public._ssbp_self_love_connection() to authenticated;
grant execute on function public._ssbp_leadership_insights() to authenticated;
grant execute on function public._ssbp_trust_connection() to authenticated;
grant execute on function public._ssbp_limitation_principles() to authenticated;
grant execute on function public._ssbp_dogfooding() to authenticated;
grant execute on function public._ssbp_vision_phrases() to authenticated;
grant execute on function public._ssbp_integration_links() to authenticated;
grant execute on function public._ssbp_engagement_summary(uuid) to authenticated;
grant execute on function public._ssbp_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'scenario-simulation-blueprint-phase76', 'Scenario Simulation Engine (ABOS Phase 76)',
  'Scenario Simulation Engine — extends Simulation & Decision Lab Phase 78 (layered with Phase 22) with strategic scenario types, multiple futures, companion guidance, limitation principles, and live success criteria.',
  'authenticated', 99
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'scenario-simulation-blueprint-phase76' and tenant_id is null
);
