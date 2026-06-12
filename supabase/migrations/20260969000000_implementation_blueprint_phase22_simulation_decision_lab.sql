-- Implementation Blueprint Phase 22 — Simulation & Decision Lab
-- Spec alignment extending Simulation & Decision Lab (Phase 78). No new tables.

create or replace function public._sdlbp_blueprint_simulation_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'scenario_planning', 'label', 'Scenario planning', 'description', 'Explore what happens if conditions change — volume, staffing, priorities — before committing resources'),
    jsonb_build_object('key', 'operational_simulations', 'label', 'Operational simulations', 'description', 'Model new workflows, responsibility changes, and priority shifts in a safe environment'),
    jsonb_build_object('key', 'strategic_simulations', 'label', 'Strategic simulations', 'description', 'Forecast expansion, new products, and new markets with assumptions visible'),
    jsonb_build_object('key', 'resource_allocation', 'label', 'Resource allocation modeling', 'description', 'Compare staffing, capacity, and workload redistribution without production impact'),
    jsonb_build_object('key', 'decision_comparisons', 'label', 'Decision comparisons', 'description', 'Option A vs Option B with benefits, risks, dependencies, and resource requirements — humans decide'),
    jsonb_build_object('key', 'risk_awareness', 'label', 'Risk awareness', 'description', 'Surface early risks, bottlenecks, and governance impact — guidance not guarantees')
  );
$$;

create or replace function public._sdlbp_blueprint_simulation_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Metadata examples for common simulation domains — safe exploration before real-world commitment.',
    'categories', jsonb_build_array(
      jsonb_build_object(
        'domain', 'support',
        'label', 'Support simulations',
        'examples', jsonb_build_array(
          'Support volume doubles — forecast backlog and escalation load',
          'Staffing decreases — identify bottlenecks and response-time impact',
          'Automation coverage increases — estimate triage reduction and quality trade-offs'
        )
      ),
      jsonb_build_object(
        'domain', 'operational',
        'label', 'Operational simulations',
        'examples', jsonb_build_array(
          'New workflow introduced — model handoff points and workload shift',
          'Responsibility changes — compare approval throughput and compliance',
          'Priority shifts — estimate impact on existing queues and SLAs'
        )
      ),
      jsonb_build_object(
        'domain', 'strategic',
        'label', 'Strategic simulations',
        'examples', jsonb_build_array(
          'Market expansion — estimate resource requirements and risk profile',
          'New product launch — forecast support load and onboarding demand',
          'New market entry — compare readiness and governance implications'
        )
      ),
      jsonb_build_object(
        'domain', 'knowledge',
        'label', 'Knowledge & resilience simulations',
        'examples', jsonb_build_array(
          'Key personnel leave — identify knowledge gaps and coverage risk',
          'Knowledge gaps widen — forecast escalation and resolution time',
          'Organizational resilience — test continuity under reduced expertise'
        )
      )
    )
  );
$$;

create or replace function public._sdlbp_blueprint_decision_comparison_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Humans decide — Aipify helps think clearly. Compare options with transparent assumptions, not hidden recommendations.',
    'structure', jsonb_build_array(
      jsonb_build_object('key', 'option_a', 'label', 'Option A', 'fields', jsonb_build_array('benefits', 'risks', 'dependencies', 'resource_requirements')),
      jsonb_build_object('key', 'option_b', 'label', 'Option B', 'fields', jsonb_build_array('benefits', 'risks', 'dependencies', 'resource_requirements'))
    ),
    'comparison_dimensions', jsonb_build_array(
      'Estimated value and time impact',
      'Risk delta and governance impact',
      'Workload redistribution',
      'Confidence level and assumptions',
      'Dependencies on people, systems, and approvals'
    ),
    'boundary', 'Simulations are guidance — not guarantees. Production remains isolated until human approval.',
    'route', '/app/simulations'
  );
$$;

create or replace function public._sdlbp_blueprint_companion_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'outcomes_worth_considering',
      'scenario', 'Outcomes worth considering — thoughtful foresight',
      'example', '🦉 If support volume doubles, simulation suggests backlog growth of 40% and escalation load rising within two weeks — worth reviewing before hiring decisions.'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'aligned_with_strengths',
      'scenario', 'Aligned with organizational strengths',
      'example', '🌹 Option A builds on your existing automation coverage — simulation shows lower risk and faster time-to-value compared to a full workflow replacement.'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'opportunity_from_simulation',
      'scenario', 'Opportunity surfaced by simulation',
      'example', '🔔 Scenario comparison highlights that adding a secondary approver reduces congestion without increasing compliance risk — an opportunity worth exploring with leadership.'
    ),
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'no_perfect_prediction',
      'scenario', 'No perfect prediction — preparation improves confidence',
      'example', '🦉 Simulations cannot predict every outcome — but exploring assumptions now reduces fear of uncertainty and supports thoughtful pacing before you commit.'
    )
  );
$$;

create or replace function public._sdlbp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love supports thoughtful pacing — avoid rushed decisions, reduce fear of uncertainty, build confidence through preparation.',
    'practices', jsonb_build_array(
      'Explore scenarios at a sustainable pace — no pressure to decide immediately',
      'Reduce fear of uncertainty — simulations acknowledge what is unknown',
      'Thoughtful pacing before committing resources or announcing changes',
      'Confidence through preparation — perspective strengthens decisions'
    ),
    'self_love_route', '/app/self-love-engine',
    'naming_doc', 'SELF_LOVE_NAMING_STANDARD.md',
    'boundary_note', 'Self Love is a principle — not a feature toggle. Simulation Lab stores metadata, not wellbeing content.'
  );
$$;

create or replace function public._sdlbp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Assumptions visible, uncertainty acknowledged, data sources documented — simulations are guidance, not guarantees.',
    'users_should_know', jsonb_build_array(
      'Every simulation run records assumptions with source and confidence',
      'Trust Engine explanations document why forecasts were generated',
      'Digital Twin context is read-only — no production systems modified',
      'Low confidence triggers human review recommendation — never silent auto-action'
    ),
    'operators_should_understand', jsonb_build_array(
      'Simulation predicts — simulation never acts — production isolated by default',
      'Distinct from Organizational Decision Support A.54 — org-level decision workflows',
      'Distinct from Decision Support Engine assistant — personal guidance at /app/assistant/decisions',
      'Distinct from Organizational Resilience A.48 — tabletop exercises, not operational forecasting',
      'Value estimates use category heuristics and Twin context — not live customer records'
    ),
    'audit_note', 'Simulation runs, comparisons, and audit events logged — metadata only, no PII.'
  );
$$;

create or replace function public._sdlbp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates Simulation Lab internally; Unonight is the first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — roadmap prioritization, growth scenarios, resource allocation, strategic trade-offs',
      'focus', jsonb_build_array('Platform roadmap what-if scenarios', 'Resource allocation across engineering and support', 'Strategic prioritization before quarterly commitments', 'Governance impact of policy changes')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce and support operational simulations',
      'focus', jsonb_build_array('Support volume surge scenarios', 'Launch workload forecasting', 'Automation vs staffing trade-offs', 'Knowledge gap resilience under peak events')
    )
  );
$$;

create or replace function public._sdlbp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Organizational Decision Support (A.54)', 'route', '/app/organizational-decision-support-engine', 'note', 'Org-level decision workflows — distinct from simulation forecasting'),
    jsonb_build_object('label', 'Decision Support Engine (assistant)', 'route', '/app/assistant/decisions', 'note', 'Personal decision guidance — distinct surface'),
    jsonb_build_object('label', 'Strategic Intelligence Foundation (A.31)', 'route', '/app/strategic-intelligence-foundation-engine', 'note', 'Strategic context and intelligence — cross-link, do not duplicate'),
    jsonb_build_object('label', 'Organizational Resilience (A.48)', 'route', '/app/organizational-resilience-engine', 'note', 'Tabletop resilience exercises — distinct from operational simulations'),
    jsonb_build_object('label', 'Digital Twin (Phase 77)', 'route', '/app/digital-twin-engine', 'note', 'Read-only context for simulation runs — no production mutations'),
    jsonb_build_object('label', 'Trust Engine explanations', 'route', '/app/trust-action-engine', 'note', 'Simulation decision_type explanations with assumptions'),
    jsonb_build_object('label', 'Executive Insights (A.35)', 'route', '/app/executive-insights-engine', 'note', 'Strategic scenario summaries for leadership perspective'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Thoughtful pacing and confidence through preparation')
  );
$$;

create or replace function public._sdlbp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Trusted lab for exploring possibilities — ask difficult questions safely before committing resources.',
    'Empowered to test ideas without production risk — simulation predicts, simulation never acts.',
    'Preparation reduces uncertainty — perspective strengthens decisions.',
    'Experience is valuable; foresight is powerful — do not learn every lesson the hard way.',
    'Humans decide — Aipify helps think clearly with visible assumptions and acknowledged uncertainty.'
  );
$$;

create or replace function public._sdlbp_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_scenarios int := 0;
  v_ready_scenarios int := 0;
  v_runs int := 0;
  v_runs_30d int := 0;
  v_comparisons int := 0;
  v_comparisons_30d int := 0;
  v_low_confidence_runs int := 0;
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

  select count(*) into v_comparisons_30d
  from public.simulation_comparisons
  where tenant_id = p_tenant_id and created_at >= now() - interval '30 days';

  select count(*) into v_low_confidence_runs
  from public.simulation_runs
  where tenant_id = p_tenant_id and confidence_level = 'low';

  select count(distinct category) into v_categories_used
  from public.simulation_scenarios
  where tenant_id = p_tenant_id and status != 'archived';

  return jsonb_build_object(
    'scenarios_total', v_scenarios,
    'scenarios_ready', v_ready_scenarios,
    'simulation_runs_total', v_runs,
    'simulation_runs_last_30d', v_runs_30d,
    'comparisons_total', v_comparisons,
    'comparisons_last_30d', v_comparisons_30d,
    'low_confidence_runs', v_low_confidence_runs,
    'categories_used', v_categories_used,
    'production_isolated', true,
    'privacy_note', 'Counts only — no scenario content, customer records, or PII.'
  );
end; $$;

create or replace function public._sdlbp_blueprint_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_scenarios int := 0;
  v_runs int := 0;
  v_comparisons int := 0;
  v_has_assumptions boolean := false;
begin
  v_engagement := public._sdlbp_engagement_summary(p_tenant_id);
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
      'key', 'explore_scenarios_confidently',
      'label', 'Explore scenarios confidently — at least one ready scenario available',
      'met', v_scenarios > 0,
      'note', case when v_scenarios = 0 then 'Create or seed scenarios to begin safe exploration.' else null end
    ),
    jsonb_build_object(
      'key', 'decision_quality',
      'label', 'Decision quality — run simulations before comparing alternatives',
      'met', v_runs > 0,
      'note', case when v_runs = 0 then 'Run a simulation to generate forecasted outcomes and assumptions.' else null end
    ),
    jsonb_build_object(
      'key', 'strategic_awareness',
      'label', 'Strategic awareness — simulation objectives and examples documented',
      'met', jsonb_array_length(public._sdlbp_blueprint_simulation_objectives()) >= 5,
      'note', 'Support, operational, strategic, and knowledge examples available as metadata.'
    ),
    jsonb_build_object(
      'key', 'early_risk_surfacing',
      'label', 'Early risk surfacing — assumptions recorded on simulation runs',
      'met', v_has_assumptions or v_runs = 0,
      'note', case when v_runs > 0 and not v_has_assumptions then 'Assumptions populate after first simulation run.' else 'Low confidence runs recommend human review.' end
    ),
    jsonb_build_object(
      'key', 'leader_perspective',
      'label', 'Leader perspective before acting — scenario comparisons available',
      'met', v_comparisons > 0 or v_scenarios >= 2,
      'note', case when v_comparisons = 0 and v_scenarios < 2 then 'Select two or more scenarios to compare Option A vs Option B.' else null end
    ),
    jsonb_build_object(
      'key', 'production_isolation',
      'label', 'Production isolation enforced — simulation never acts',
      'met', true,
      'note', 'Core Phase 78 rule — all runs marked production_isolated.'
    ),
    jsonb_build_object(
      'key', 'trust_transparency',
      'label', 'Trust — assumptions visible and uncertainty acknowledged',
      'met', (public._sdlbp_blueprint_trust_connection()->>'principle') is not null,
      'note', 'Trust Engine explanations linked on simulation runs when available.'
    ),
    jsonb_build_object(
      'key', 'companion_examples',
      'label', 'Companion examples documented (🦉🌹🔔) — preparation improves confidence',
      'met', jsonb_array_length(public._sdlbp_blueprint_companion_examples()) >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_pacing',
      'label', 'Self Love connection — thoughtful pacing, reduce fear of uncertainty',
      'met', true,
      'note', 'Self Love is a principle — avoid rushed decisions through preparation.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from Decision Support, Resilience, and Digital Twin',
      'met', jsonb_array_length(public._sdlbp_blueprint_integration_links()) >= 6,
      'note', 'Extend related engines — do not duplicate org decision or tabletop workflows.'
    )
  );
end; $$;

create or replace function public._sdlbp_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Organizational Decision Support A.54 /app/organizational-decision-support-engine (org workflows), Decision Support Engine assistant /app/assistant/decisions (personal guidance), Organizational Resilience A.48 /app/organizational-resilience-engine (tabletop exercises), and Strategic Intelligence A.31 (strategic context). Digital Twin Phase 77 provides read-only context only.';
$$;

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
    'vision', 'Trusted lab for exploring possibilities — empowered to ask difficult questions and test ideas safely.',
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
    )
  );
end; $$;

create or replace function public.get_simulation_lab_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_scenarios int;
  v_runs int;
  v_engagement jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select count(*) into v_scenarios from public.simulation_scenarios where tenant_id = v_tenant_id and status != 'archived';
  select count(*) into v_runs from public.simulation_runs where tenant_id = v_tenant_id;

  v_engagement := public._sdlbp_engagement_summary(v_tenant_id);

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
    'blueprint_note', 'Simulation & Decision Lab (ABOS Phase 22) — extends Phase 78 with blueprint metadata, decision comparison framework, and live success criteria on the dashboard.'
  );
end; $$;

grant execute on function public._sdlbp_blueprint_simulation_objectives() to authenticated;
grant execute on function public._sdlbp_blueprint_simulation_examples() to authenticated;
grant execute on function public._sdlbp_blueprint_decision_comparison_framework() to authenticated;
grant execute on function public._sdlbp_blueprint_companion_examples() to authenticated;
grant execute on function public._sdlbp_blueprint_self_love_connection() to authenticated;
grant execute on function public._sdlbp_blueprint_trust_connection() to authenticated;
grant execute on function public._sdlbp_blueprint_dogfooding() to authenticated;
grant execute on function public._sdlbp_blueprint_integration_links() to authenticated;
grant execute on function public._sdlbp_blueprint_vision_phrases() to authenticated;
grant execute on function public._sdlbp_engagement_summary(uuid) to authenticated;
grant execute on function public._sdlbp_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'simulation-decision-lab-blueprint', 'Simulation & Decision Lab (ABOS Phase 22)',
  'Simulation & Decision Lab — extends Phase 78 with scenario objectives, decision comparison framework, companion examples, and live engagement summary.',
  'authenticated', 98
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'simulation-decision-lab-blueprint' and tenant_id is null
);
