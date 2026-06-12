-- Implementation Blueprint Phase 78 — Simulation & Decision Lab Engine
-- ABOS Blueprint Phase 78 aligns with repo Phase 78 at /app/simulations.
-- Layered with Blueprint Phase 22 (_sdlbp_*) and Blueprint Phase 76 (_ssbp_*). No new tables.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._sdl78bp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 78 — Simulation & Decision Lab Engine at /app/simulations. Phase numbers align: repo Phase 78 = ABOS Blueprint Phase 78 — blueprint adds ABOS Decision Lab spec scaffolding via _sdl78bp_* helpers. Layered with Blueprint Phase 22 (_sdlbp_*) and Blueprint Phase 76 (_ssbp_*). Distinct from Decision Support Engine Phase 38 / Blueprint Phase 60 at /app/assistant/decisions (reflection scaffolding — not quantitative simulation). Distinct from Organizational Decision Support A.54 at /app/organizational-decision-support-engine. Distinct from Innovation Lab Phase 96 at /app/innovation-lab (controlled experiments). Distinct from Organizational Resilience A.50 at /app/organizational-resilience-engine (crisis scenario planning — cross-link). Engine helpers use _sim_*; Phase 22 _sdlbp_*; Phase 76 _ssbp_*; Blueprint Phase 78 _sdl78bp_* only. Simulation predicts. Simulation never acts. Production isolated.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._sdl78bp_mission()
returns text language sql immutable as $$
  select 'Evaluate significant decisions through collaborative exploration, structured simulations, and thoughtful reflection.';
$$;

create or replace function public._sdl78bp_philosophy()
returns text language sql immutable as $$
  select 'Strongest decisions emerge through exploration, dialogue, and multiple perspectives — objective is wiser decision-making, NOT certainty.';
$$;

create or replace function public._sdl78bp_abos_principle()
returns text language sql immutable as $$
  select 'Simulation improves understanding before action — wisdom emerges through exploration.';
$$;

create or replace function public._sdl78bp_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'strategic_experimentation', 'label', 'Strategic experimentation', 'description', 'Explore major strategic choices in safe structured environments before commitment'),
    jsonb_build_object('key', 'decision_preparation', 'label', 'Decision preparation', 'description', 'Prepare leadership teams with visible assumptions, scenarios, and consequence awareness'),
    jsonb_build_object('key', 'cross_functional_exploration', 'label', 'Cross-functional exploration', 'description', 'Surface dependencies and perspectives across departments through collaborative simulation'),
    jsonb_build_object('key', 'scenario_comparison', 'label', 'Scenario comparison', 'description', 'Compare maintain, accelerate, and delay paths thoughtfully — humans decide'),
    jsonb_build_object('key', 'consequence_awareness', 'label', 'Consequence awareness', 'description', 'Unintended consequences and trade-offs deserve discussion before acting'),
    jsonb_build_object('key', 'leadership_learning', 'label', 'Leadership learning', 'description', 'Reflection after simulation strengthens organizational decision capability')
  );
$$;

create or replace function public._sdl78bp_decision_lab_environment()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Decision Lab — safe space for strategic exploration; encourage curiosity, not pressure.',
    'environments', jsonb_build_array(
      jsonb_build_object(
        'key', 'international_expansion',
        'label', 'International expansion',
        'description', 'Explore market entry, governance, localization, and resource requirements before commitment',
        'encouragement', 'Curiosity about unfamiliar markets strengthens preparedness'
      ),
      jsonb_build_object(
        'key', 'new_product_line',
        'label', 'New product line',
        'description', 'Model adoption curves, support load, and operational readiness in isolation',
        'encouragement', 'Test product assumptions without production risk'
      ),
      jsonb_build_object(
        'key', 'department_restructure',
        'label', 'Department restructure',
        'description', 'Compare approval paths, continuity implications, and workload redistribution',
        'encouragement', 'Explore organizational change before announcing'
      ),
      jsonb_build_object(
        'key', 'strategic_investment',
        'label', 'Additional strategic investment',
        'description', 'Evaluate ROI assumptions, dependencies, and governance impact across scenarios',
        'encouragement', 'Investment decisions benefit from structured exploration'
      )
    ),
    'boundary_note', 'Decision Lab prepares — humans commit. Simulation never acts.'
  );
$$;

create or replace function public._sdl78bp_simulation_inputs()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Quality of reflection depends on quality of assumptions — document inputs transparently.',
    'input_categories', jsonb_build_array(
      jsonb_build_object('key', 'strategic_priorities', 'label', 'Strategic priorities', 'description', 'Current goals and initiatives that frame the decision context'),
      jsonb_build_object('key', 'org_structures', 'label', 'Organizational structures', 'description', 'Teams, roles, and approval paths influencing outcomes'),
      jsonb_build_object('key', 'resource_assumptions', 'label', 'Resource assumptions', 'description', 'Staffing, capacity, budget, and timeline estimates — visible not hidden'),
      jsonb_build_object('key', 'market_conditions', 'label', 'Market conditions', 'description', 'Demand, competition, and external factors documented with confidence'),
      jsonb_build_object('key', 'operational_constraints', 'label', 'Operational constraints', 'description', 'Bottlenecks, compliance requirements, and system dependencies'),
      jsonb_build_object('key', 'organizational_knowledge', 'label', 'Organizational knowledge', 'description', 'Approved knowledge and Digital Twin read-only context — metadata only')
    ),
    'assumption_note', 'Every simulation run records assumptions with source and confidence.'
  );
$$;

create or replace function public._sdl78bp_scenario_comparison()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Compare scenarios thoughtfully — exploration not certainty; humans decide after reflection.',
    'scenarios', jsonb_build_array(
      jsonb_build_object(
        'key', 'scenario_a',
        'label', 'Scenario A — Maintain current direction',
        'description', 'Continue existing strategy — baseline for comparison with visible assumptions',
        'consideration', 'Stability has value — compare opportunity cost of inaction'
      ),
      jsonb_build_object(
        'key', 'scenario_b',
        'label', 'Scenario B — Accelerate investment',
        'description', 'Increase commitment, resources, or pace — model capacity and dependency impact',
        'consideration', 'Acceleration may reveal bottlenecks and cross-functional load'
      ),
      jsonb_build_object(
        'key', 'scenario_c',
        'label', 'Scenario C — Delay implementation',
        'description', 'Postpone or phase the initiative — explore interim risks and lost opportunities',
        'consideration', 'Delay may reduce risk but carries its own consequences'
      )
    ),
    'comparison_note', 'Use dashboard scenario comparison — Option A vs B with benefits, risks, dependencies. No simple scores replace human judgment.'
  );
$$;

create or replace function public._sdl78bp_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion guidance strengthens reflection — assumptions deserve examination, scenarios strengthen resilience, unintended consequences require discussion.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'assumptions_examination', 'prompt', 'The assumptions behind this decision deserve examination — shall I summarize what influences the simulation?', 'consideration', 'Transparent assumptions strengthen confidence without overstating certainty.'),
      jsonb_build_object('emoji', '🌹', 'key', 'resilience_through_scenario', 'prompt', 'Exploring this scenario may strengthen resilience — worth discussing with leadership before committing.', 'consideration', 'Multiple perspectives reduce blind spots in significant decisions.'),
      jsonb_build_object('emoji', '🔔', 'key', 'unintended_consequences', 'prompt', 'Unintended consequences in this scenario deserve discussion — would a cross-functional review help?', 'consideration', 'Gentle preparedness — surface risks humans may address before action.')
    )
  );
$$;

create or replace function public._sdl78bp_collaborative_decision_making()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collaborative decision-making — diverse perspectives strengthen wiser outcomes; simulation supports dialogue.',
    'stakeholders', jsonb_build_array(
      jsonb_build_object('key', 'leadership_teams', 'label', 'Leadership teams', 'description', 'Executive groups explore scenarios together — assumptions visible, humans decide'),
      jsonb_build_object('key', 'board_representatives', 'label', 'Board representatives', 'description', 'Governance-aware summaries for board preparedness — metadata only'),
      jsonb_build_object('key', 'subject_matter_experts', 'label', 'Subject matter experts', 'description', 'SMEs validate assumptions and surface domain-specific consequences'),
      jsonb_build_object('key', 'cross_functional_stakeholders', 'label', 'Cross-functional stakeholders', 'description', 'Department influence and dependency mapping through collaborative exploration')
    ),
    'dialogue_note', 'Simulation strengthens conversation — never replaces human decision authority.'
  );
$$;

create or replace function public._sdl78bp_learning_through_simulation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Learning through simulation — reflection after exploration strengthens organizational capability.',
    'reflection_prompts', jsonb_build_array(
      'What worked in this exploration?',
      'Which assumptions proved most valuable?',
      'What concerns emerged that deserve follow-up?',
      'What opportunities became visible through comparison?'
    ),
    'learning_dimensions', jsonb_build_array(
      jsonb_build_object('key', 'assumption_quality', 'label', 'Assumption quality', 'description', 'Which inputs most influenced outcomes — improve future simulations'),
      jsonb_build_object('key', 'collaboration_patterns', 'label', 'Collaboration patterns', 'description', 'How diverse perspectives changed the discussion'),
      jsonb_build_object('key', 'decision_readiness', 'label', 'Decision readiness', 'description', 'Whether exploration increased preparedness without false certainty')
    ),
    'boundary_note', 'Learning metadata only — no raw meeting content or PII stored.'
  );
$$;

create or replace function public._sdl78bp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — patience, perspective, intellectual humility; uncertainty is natural.',
    'practices', jsonb_build_array(
      'Patience — significant decisions deserve time for exploration',
      'Perspective — scenarios inform; they do not dictate outcomes',
      'Intellectual humility — no organization controls every variable',
      'Uncertainty is natural — exploration reduces anxiety from the unknown'
    ),
    'journey_phrase', 'Thoughtful leaders explore before committing.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports calm exploration — principle only; Decision Lab stores metadata, not wellbeing content.'
  );
$$;

create or replace function public._sdl78bp_leadership_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership insights — decision readiness summaries, emerging strategic observations, collaborative thinking examples.',
    'insight_types', jsonb_build_array(
      jsonb_build_object('emoji', '📈', 'key', 'decision_readiness', 'label', 'Decision readiness summaries', 'description', 'Aggregate simulation metadata for leadership review — counts and confidence, not customer records'),
      jsonb_build_object('emoji', '🦉', 'key', 'strategic_observations', 'label', 'Emerging strategic observations', 'description', 'Patterns across simulations that deserve leadership attention — exploration not alarm'),
      jsonb_build_object('emoji', '🌹', 'key', 'collaborative_thinking', 'label', 'Collaborative thinking examples', 'description', 'How diverse stakeholders strengthened decision dialogue — metadata only')
    ),
    'dialogue_note', 'Leadership observations encourage preparedness dialogue — not fear-based communication.'
  );
$$;

create or replace function public._sdl78bp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparency about assumptions influencing simulations, limitations, and the fact that simulations support — not replace — human judgment.',
    'users_should_know', jsonb_build_array(
      'Every simulation records assumptions with source and confidence',
      'Simulations are exploration — not guarantees or simple scores',
      'Production remains isolated — simulation never acts',
      'Low confidence recommends human review — never silent auto-action'
    ),
    'operators_should_understand', jsonb_build_array(
      'Distinct from Decision Support Engine Phase 60 — reflection scaffolding at /app/assistant/decisions',
      'Distinct from Organizational Decision Support A.54 — org-level decision workflows',
      'Distinct from Innovation Lab Phase 96 — controlled experiments, not forecasting',
      'Limitation principles block guarantee copy and oversimplified decision scores'
    ),
    'audit_note', 'Simulation runs and comparisons logged — metadata only, no PII.'
  );
$$;

create or replace function public._sdl78bp_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Limitation principles — exploration not certainty; simulation never acts.',
    'forbidden', jsonb_build_array(
      'Simulations presented as guarantees or certainties',
      'Overstating confidence in scenario outcomes',
      'Reducing complex decisions to simple scores',
      'Auto-execution or production changes based on simulation results'
    ),
    'required', jsonb_build_array(
      'Explicit assumptions and confidence on every run',
      'Scenario comparison with thoughtful reflection — A, B, C framing',
      'Human decision authority — simulation prepares, humans commit',
      'Production isolation enforced on every simulation run'
    ),
    'boundary_note', 'Objective is wiser decision-making, NOT certainty. Simulation predicts — simulation never acts.'
  );
$$;

create or replace function public._sdl78bp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates Decision Lab patterns internally before customer rollout.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — product ecosystem planning, strategic investments, organizational growth, Sales Expert expansion',
      'focus', jsonb_build_array(
        'Product ecosystem planning — module and partner expansion scenarios',
        'Strategic investments — ROI assumptions and governance impact',
        'Organizational growth — hiring, structure, and capacity simulations',
        'Sales Expert expansion — partner scaling and knowledge distribution'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce growth and strategic decision exploration',
      'focus', jsonb_build_array(
        'Launch and peak-event decision preparedness',
        'Market expansion readiness exploration',
        'Support capacity and staffing trade-off simulations',
        'Cross-functional dependency reviews before commitments'
      )
    )
  );
$$;

create or replace function public._sdl78bp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We explored this thoroughly before moving forward.',
    'Thoughtful, disciplined, human-centered decision-making.',
    'Wisdom emerges through exploration — simulation never acts.',
    'Thoughtful leaders explore before committing.',
    'Simulation improves understanding before action.'
  );
$$;

create or replace function public._sdl78bp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Digital Twin (Blueprint Phase 77)', 'route', '/app/digital-twin-engine', 'note', 'Read-only organizational context for simulation runs'),
    jsonb_build_object('label', 'Decision Support Engine (Blueprint Phase 60)', 'route', '/app/assistant/decisions', 'note', 'Reflection scaffolding — not quantitative simulation'),
    jsonb_build_object('label', 'Executive Operations Center (Blueprint Phase 75)', 'route', '/app/operations-center-foundation-engine', 'note', 'Executive leadership situational awareness — cross-link'),
    jsonb_build_object('label', 'Organizational Decision Support (A.54)', 'route', '/app/organizational-decision-support-engine', 'note', 'Org-level decision workflows — distinct from simulation lab'),
    jsonb_build_object('label', 'Innovation Lab (Phase 96)', 'route', '/app/innovation-lab', 'note', 'Controlled experiments — simulation never acts'),
    jsonb_build_object('label', 'Organizational Resilience (A.50)', 'route', '/app/organizational-resilience-engine', 'note', 'Crisis scenario planning — cross-link, not duplicate'),
    jsonb_build_object('label', 'Blueprint Phase 22 — Decision Lab foundation', 'route', '/app/simulations', 'note', 'Decision comparison framework — _sdlbp_* layered'),
    jsonb_build_object('label', 'Blueprint Phase 76 — Scenario Simulation', 'route', '/app/simulations', 'note', 'Multiple futures and scenario types — _ssbp_* layered'),
    jsonb_build_object('label', 'Predictive Operations (Blueprint Phase 74)', 'route', '/app/predictive-insights-engine', 'note', 'Predictive preparedness — cross-link, distinct storage'),
    jsonb_build_object('label', 'Executive Insights (A.35)', 'route', '/app/executive-insights-engine', 'note', 'Leadership perspective summaries — cross-link'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Patience and intellectual humility — principle only')
  );
$$;

create or replace function public._sdl78bp_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_scenarios int := 0;
  v_ready_scenarios int := 0;
  v_runs int := 0;
  v_runs_30d int := 0;
  v_comparisons int := 0;
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

  select count(*) into v_comparisons
  from public.simulation_comparisons
  where tenant_id = p_tenant_id;

  select count(distinct category) into v_categories_used
  from public.simulation_scenarios
  where tenant_id = p_tenant_id and status != 'archived';

  return jsonb_build_object(
    'scenarios_total', v_scenarios,
    'scenarios_ready', v_ready_scenarios,
    'simulation_runs_total', v_runs,
    'simulation_runs_last_30d', v_runs_30d,
    'comparisons_total', v_comparisons,
    'categories_used', v_categories_used,
    'production_isolated', true,
    'privacy_note', 'Counts only — no scenario content, customer records, or PII.'
  );
end; $$;

create or replace function public._sdl78bp_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_scenarios int := 0;
  v_runs int := 0;
  v_comparisons int := 0;
  v_has_assumptions boolean := false;
begin
  v_engagement := public._sdl78bp_engagement_summary(p_tenant_id);
  v_scenarios := coalesce((v_engagement->>'scenarios_total')::int, 0);
  v_runs := coalesce((v_engagement->>'simulation_runs_total')::int, 0);
  v_comparisons := coalesce((v_engagement->>'comparisons_total')::int, 0);

  select exists (
    select 1 from public.simulation_assumptions a
    join public.simulation_runs r on r.id = a.simulation_run_id
    where r.tenant_id = p_tenant_id
    limit 1
  ) into v_has_assumptions;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'deeper_strategic_discussions',
      'label', 'Deeper strategic discussions — simulation runs generate exploration outcomes',
      'met', v_runs > 0,
      'note', case when v_runs = 0 then 'Run a simulation to begin structured decision exploration.' else null end
    ),
    jsonb_build_object(
      'key', 'decision_preparedness',
      'label', 'Improved decision preparedness — at least one scenario available',
      'met', v_scenarios > 0,
      'note', case when v_scenarios = 0 then 'Create or seed scenarios to begin Decision Lab exploration.' else null end
    ),
    jsonb_build_object(
      'key', 'stronger_collaboration',
      'label', 'Stronger collaboration — collaborative decision-making contexts documented',
      'met', jsonb_array_length(public._sdl78bp_collaborative_decision_making()->'stakeholders') >= 4,
      'note', 'Leadership teams, board representatives, SMEs, cross-functional stakeholders.'
    ),
    jsonb_build_object(
      'key', 'intentional_reflection',
      'label', 'More intentional reflection — learning through simulation prompts documented',
      'met', jsonb_array_length(public._sdl78bp_learning_through_simulation()->'reflection_prompts') >= 4,
      'note', 'What worked, valuable assumptions, concerns, opportunities — reflection strengthens capability.'
    ),
    jsonb_build_object(
      'key', 'leader_confidence',
      'label', 'Greater leader confidence — assumptions recorded on runs without false certainty',
      'met', v_has_assumptions or v_runs = 0,
      'note', case when v_runs > 0 and not v_has_assumptions then 'Assumptions populate after first simulation run.' else 'Exploration strengthens confidence — not prediction certainty.' end
    ),
    jsonb_build_object(
      'key', 'scenario_comparison',
      'label', 'Scenario comparison — A maintain, B accelerate, C delay framing available',
      'met', jsonb_array_length(public._sdl78bp_scenario_comparison()->'scenarios') >= 3,
      'note', 'Compare thoughtfully — humans decide after reflection.'
    ),
    jsonb_build_object(
      'key', 'decision_lab_environment',
      'label', 'Decision Lab environment — safe spaces for strategic exploration documented',
      'met', jsonb_array_length(public._sdl78bp_decision_lab_environment()->'environments') >= 4,
      'note', 'International expansion, new product line, restructure, strategic investment.'
    ),
    jsonb_build_object(
      'key', 'production_isolation',
      'label', 'Production isolation enforced — simulation never acts',
      'met', true,
      'note', 'Core Phase 78 rule — all runs marked production_isolated.'
    ),
    jsonb_build_object(
      'key', 'limitation_principles',
      'label', 'Limitation principles — no guarantees, no simple scores',
      'met', jsonb_array_length(public._sdl78bp_limitation_principles()->'forbidden') >= 4,
      'note', 'Exploration not certainty — objective is wiser decision-making.'
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Companion guidance documented (🦉🌹🔔)',
      'met', jsonb_array_length(public._sdl78bp_companion_guidance()->'examples') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — assumptions and limitations transparent',
      'met', jsonb_array_length(public._sdl78bp_trust_connection()->'users_should_know') >= 4,
      'note', 'Simulations support — not replace — human judgment.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from DSE Phase 60, Executive Ops Phase 75, Digital Twin Phase 77, Innovation Lab Phase 96, Org Decision A.54',
      'met', jsonb_array_length(public._sdl78bp_integration_links()) >= 8,
      'note', 'Extend related engines — do not duplicate.'
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS principle — wisdom emerges through exploration before action',
      'met', true,
      'note', 'Simulation improves understanding before action.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL Phase 78 runtime, Phase 22, and Phase 76; append Phase 78 blueprint
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
    'blueprint_phase76_safety_note', 'Scenarios are possibilities not predictions — simulation never acts; production isolated.',
    'implementation_blueprint_phase78', jsonb_build_object(
      'phase', 'Phase 78 — Simulation & Decision Lab Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE78_SIMULATION_DECISION_LAB.md',
      'engine_phase', 'Phase 78 Simulation & Decision Lab (aligned — layered with Phases 22 and 76)',
      'route', '/app/simulations',
      'mapping_note', 'ABOS Blueprint Phase 78 aligns with repo Phase 78 — adds Decision Lab spec scaffolding via _sdl78bp_* helpers layered with Phase 22 _sdlbp_* and Phase 76 _ssbp_*.'
    ),
    'decision_lab_engine_note', 'Simulation & Decision Lab Engine (ABOS Phase 78) — collaborative exploration and thoughtful reflection before significant decisions. Exploration not certainty.',
    'blueprint_phase78_distinction_note', public._sdl78bp_distinction_note(),
    'blueprint_phase78_mission', public._sdl78bp_mission(),
    'blueprint_phase78_philosophy', public._sdl78bp_philosophy(),
    'blueprint_phase78_abos_principle', public._sdl78bp_abos_principle(),
    'blueprint_phase78_objectives', public._sdl78bp_objectives(),
    'blueprint_phase78_decision_lab_environment', public._sdl78bp_decision_lab_environment(),
    'blueprint_phase78_simulation_inputs', public._sdl78bp_simulation_inputs(),
    'blueprint_phase78_scenario_comparison', public._sdl78bp_scenario_comparison(),
    'blueprint_phase78_companion_guidance', public._sdl78bp_companion_guidance(),
    'blueprint_phase78_collaborative_decision_making', public._sdl78bp_collaborative_decision_making(),
    'blueprint_phase78_learning_through_simulation', public._sdl78bp_learning_through_simulation(),
    'blueprint_phase78_self_love_connection', public._sdl78bp_self_love_connection(),
    'blueprint_phase78_leadership_insights', public._sdl78bp_leadership_insights(),
    'blueprint_phase78_trust_connection', public._sdl78bp_trust_connection(),
    'blueprint_phase78_limitation_principles', public._sdl78bp_limitation_principles(),
    'blueprint_phase78_dogfooding', public._sdl78bp_dogfooding(),
    'blueprint_phase78_integration_links', public._sdl78bp_integration_links(),
    'blueprint_phase78_engagement_summary', public._sdl78bp_engagement_summary(v_tenant_id),
    'blueprint_phase78_success_criteria', public._sdl78bp_success_criteria(v_tenant_id),
    'blueprint_phase78_vision_phrases', public._sdl78bp_vision_phrases(),
    'blueprint_phase78_safety_note', 'Exploration not certainty — simulation never acts; production isolated; no simple scores replace human judgment.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve Phase 78 runtime, Phase 22, and Phase 76; append Phase 78 blueprint
-- ---------------------------------------------------------------------------
create or replace function public.get_simulation_lab_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_scenarios int;
  v_runs int;
  v_engagement jsonb;
  v_phase76_engagement jsonb;
  v_phase78_engagement jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select count(*) into v_scenarios from public.simulation_scenarios where tenant_id = v_tenant_id and status != 'archived';
  select count(*) into v_runs from public.simulation_runs where tenant_id = v_tenant_id;

  v_engagement := public._sdlbp_engagement_summary(v_tenant_id);
  v_phase76_engagement := public._ssbp_engagement_summary(v_tenant_id);
  v_phase78_engagement := public._sdl78bp_engagement_summary(v_tenant_id);

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
    'blueprint_phase76_note', 'Scenario Simulation Engine (ABOS Phase 76) — structured scenario exploration before significant decisions. Perspective not prediction.',
    'implementation_blueprint_phase78', jsonb_build_object(
      'phase', 'Phase 78 — Simulation & Decision Lab Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE78_SIMULATION_DECISION_LAB.md',
      'engine_phase', 'Phase 78 Simulation & Decision Lab (aligned — layered with Phases 22 and 76)',
      'route', '/app/simulations'
    ),
    'blueprint_phase78_mission', public._sdl78bp_mission(),
    'blueprint_phase78_abos_principle', public._sdl78bp_abos_principle(),
    'blueprint_phase78_engagement_summary', v_phase78_engagement,
    'blueprint_phase78_note', 'Simulation & Decision Lab Engine (ABOS Phase 78) — collaborative exploration and thoughtful reflection. Exploration not certainty.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._sdl78bp_distinction_note() to authenticated;
grant execute on function public._sdl78bp_mission() to authenticated;
grant execute on function public._sdl78bp_philosophy() to authenticated;
grant execute on function public._sdl78bp_abos_principle() to authenticated;
grant execute on function public._sdl78bp_objectives() to authenticated;
grant execute on function public._sdl78bp_decision_lab_environment() to authenticated;
grant execute on function public._sdl78bp_simulation_inputs() to authenticated;
grant execute on function public._sdl78bp_scenario_comparison() to authenticated;
grant execute on function public._sdl78bp_companion_guidance() to authenticated;
grant execute on function public._sdl78bp_collaborative_decision_making() to authenticated;
grant execute on function public._sdl78bp_learning_through_simulation() to authenticated;
grant execute on function public._sdl78bp_self_love_connection() to authenticated;
grant execute on function public._sdl78bp_leadership_insights() to authenticated;
grant execute on function public._sdl78bp_trust_connection() to authenticated;
grant execute on function public._sdl78bp_limitation_principles() to authenticated;
grant execute on function public._sdl78bp_dogfooding() to authenticated;
grant execute on function public._sdl78bp_vision_phrases() to authenticated;
grant execute on function public._sdl78bp_integration_links() to authenticated;
grant execute on function public._sdl78bp_engagement_summary(uuid) to authenticated;
grant execute on function public._sdl78bp_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'simulation-decision-lab-blueprint-phase78', 'Simulation & Decision Lab Engine (ABOS Phase 78)',
  'Simulation & Decision Lab Engine — ABOS Blueprint Phase 78 aligns with repo Phase 78; Decision Lab environment, simulation inputs, scenario comparison, collaborative decision-making, learning through simulation, limitation principles, and live success criteria.',
  'authenticated', 100
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'simulation-decision-lab-blueprint-phase78' and tenant_id is null
);
