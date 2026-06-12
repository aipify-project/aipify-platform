-- Implementation Blueprint Phase 84 — Ecosystem Scenario Planning Engine
-- Extends Simulation & Decision Lab Phase 78 at /app/simulations. No new tables.
-- Distinct from Evolution Governance & Change Management repo Phase 84 at /app/evolution (phase number collision).

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._espe84bp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 84 — Ecosystem Scenario Planning Engine at /app/simulations. Extends Simulation & Decision Lab Phase 78 (layered with Blueprint Phases 22 _sdlbp_*, 76 _ssbp_*, 78 _sdl78bp_*). Distinct from Evolution Governance & Change Management repo Phase 84 at /app/evolution (20260617600000_evolution_governance_change_management_phase84.sql — tenant evolution proposals, approval matrix — cross-link only, phase number collision). Distinct from Ecosystem Intelligence & External Relationship repo Phase 88 at /app/ecosystem (relationship maps — cross-link). Distinct from Organizational Resilience A.50 at /app/organizational-resilience-engine (crisis scenario planning — cross-link). Distinct from Curiosity & Discovery A.87 at /app/curiosity-discovery-engine (opportunity exploration — cross-link). Distinct from Strategic Intelligence A.31 at /app/strategic-intelligence-foundation-engine (strategic awareness — cross-link). Distinct from Integration Engine A.8 at /app/integration-engine (connector orchestration — cross-link). Distinct from Risk Navigation Blueprint Phase 81 at /app/organizational-resilience-engine (risk preparedness — cross-link). Engine helpers use _sim_* — Blueprint Phase 84 MUST use _espe84bp_* only. Preparedness not prediction — limitation principles mandatory.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._espe84bp_mission()
returns text language sql immutable as $$
  select 'Help organizations strengthen resilience and strategic preparedness by exploring how ecosystem changes influence future outcomes.';
$$;

create or replace function public._espe84bp_philosophy()
returns text language sql immutable as $$
  select 'Organizations exist within interconnected ecosystems — customers, suppliers, communities, tech partners. Understanding ecosystem dynamics strengthens preparedness without overstating predictive capability.';
$$;

create or replace function public._espe84bp_abos_principle()
returns text language sql immutable as $$
  select 'Ecosystem awareness strengthens strategic preparedness — Aipify informs and prepares; humans decide. We are part of something larger.';
$$;

create or replace function public._espe84bp_vision()
returns text language sql immutable as $$
  select 'We are not navigating the future alone. We are part of something larger.';
$$;

create or replace function public._espe84bp_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'ecosystem_awareness', 'label', 'Ecosystem awareness', 'description', 'Surface how customers, partners, suppliers, and communities shape organizational outcomes — metadata only'),
    jsonb_build_object('key', 'external_dependency_mapping', 'label', 'External dependency mapping', 'description', 'Document critical external dependencies and concentration risks — awareness not alarm'),
    jsonb_build_object('key', 'scenario_preparedness', 'label', 'Scenario preparedness', 'description', 'Explore how ecosystem shifts influence strategic choices — simulation never acts'),
    jsonb_build_object('key', 'partnership_resilience', 'label', 'Partnership resilience', 'description', 'Strengthen alliance and partner relationship preparedness through structured exploration'),
    jsonb_build_object('key', 'strategic_adaptability', 'label', 'Strategic adaptability', 'description', 'Support leadership adaptability when ecosystem conditions evolve — humans decide timing'),
    jsonb_build_object('key', 'opportunity_exploration', 'label', 'Opportunity exploration', 'description', 'Connect ecosystem shifts to emerging opportunities — cross-link Curiosity & Discovery A.87')
  );
$$;

create or replace function public._espe84bp_ecosystem_components()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Ecosystem components — interconnected relationships that shape organizational outcomes.',
    'components', jsonb_build_array(
      jsonb_build_object('key', 'customers', 'label', 'Customers', 'description', 'Demand patterns, loyalty dynamics, and evolving expectations — aggregate signals only'),
      jsonb_build_object('key', 'tech_partners', 'label', 'Technology partners', 'description', 'Platform providers, integration partners, and technology alliances — dependency awareness'),
      jsonb_build_object('key', 'suppliers', 'label', 'Suppliers', 'description', 'Supply chain dependencies, capacity constraints, and vendor concentration — preparedness framing'),
      jsonb_build_object('key', 'sales_experts', 'label', 'Sales Expert networks', 'description', 'Certified Sales Representatives and Sales Experts — partner ecosystem growth and channel resilience'),
      jsonb_build_object('key', 'alliances', 'label', 'Strategic alliances', 'description', 'Co-marketing, distribution, and joint venture relationships — partnership resilience'),
      jsonb_build_object('key', 'regulatory', 'label', 'Regulatory bodies', 'description', 'Compliance landscapes, policy shifts, and governance requirements — cross-link Compliance A.29'),
      jsonb_build_object('key', 'communities', 'label', 'Communities', 'description', 'Industry communities, user groups, and ecosystem forums — relationship intelligence'),
      jsonb_build_object('key', 'service_providers', 'label', 'Service providers', 'description', 'Managed services, consultants, and operational support partners — continuity awareness')
    ),
    'metadata_note', 'Ecosystem mapping uses approved metadata — never customer PII or private partner communications.'
  );
$$;

create or replace function public._espe84bp_scenario_questions()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Ecosystem scenario questions — encourage thoughtful preparedness, not fear or false certainty.',
    'questions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'ecosystem_shift_impact', 'question', 'How might shifts in our ecosystem partners influence our strategic options?', 'consideration', 'Surface dependencies for leadership review — exploration not prediction'),
      jsonb_build_object('emoji', '🌹', 'key', 'partnership_strength', 'question', 'Which partnerships strengthen our resilience — and which deserve renewed attention?', 'consideration', 'Celebrate alliance strengths while identifying preparedness gaps'),
      jsonb_build_object('emoji', '🔔', 'key', 'external_dependency_preparedness', 'question', 'If a key external dependency changed, what preparedness would reduce disruption?', 'consideration', 'Contingency framing — preparation reduces anxiety from the unknown')
    ),
    'reflection_note', 'Questions invite ecosystem exploration — not catastrophic prediction or inevitability.'
  );
$$;

create or replace function public._espe84bp_external_dependency_awareness()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'External dependency awareness — understand concentration and interconnection without alarm.',
    'dependency_types', jsonb_build_array(
      jsonb_build_object('key', 'technology_platforms', 'label', 'Technology platforms', 'description', 'Microsoft, Shopify, Stripe, and core infrastructure providers — resilience through diversification awareness'),
      jsonb_build_object('key', 'financial_services', 'label', 'Financial services', 'description', 'Payment processors, accounting platforms like Fiken — operational continuity considerations'),
      jsonb_build_object('key', 'distribution_channels', 'label', 'Distribution channels', 'description', 'Sales Expert networks, marketplace partners — channel concentration awareness'),
      jsonb_build_object('key', 'knowledge_ecosystem', 'label', 'Knowledge ecosystem', 'description', 'Approved knowledge sources, partner documentation — cross-link Integration Engine A.8')
    ),
    'awareness_note', 'Dependency mapping supports preparedness dialogue — never punitive vendor evaluation.'
  );
$$;

create or replace function public._espe84bp_partnership_resilience()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Partnership resilience — alliances strengthen when preparedness is shared and transparent.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'alliance_review', 'scenario', 'Key alliance review', 'example', 'Explore how a strategic alliance shift might influence product roadmap and go-to-market timing — humans decide'),
      jsonb_build_object('emoji', '🌹', 'key', 'partner_growth', 'scenario', 'Partner ecosystem growth', 'example', 'Model Sales Expert network expansion scenarios — channel capacity and support readiness'),
      jsonb_build_object('emoji', '🔔', 'key', 'vendor_continuity', 'scenario', 'Technology provider continuity', 'example', 'If a core technology provider changed terms, what operational adjustments deserve discussion?')
    ),
    'resilience_note', 'Partnership exploration strengthens relationships — Aipify prepares; humans govern partnerships.'
  );
$$;

create or replace function public._espe84bp_opportunity_exploration()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Opportunity exploration — ecosystem shifts may reveal adjacent opportunities worth thoughtful review.',
    'signals', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'adjacent_markets', 'signal', 'Ecosystem changes may reveal adjacent market opportunities — would a curiosity summary help?', 'description', 'Cross-link Curiosity & Discovery A.87 at /app/curiosity-discovery-engine'),
      jsonb_build_object('emoji', '🌹', 'key', 'partner_innovation', 'signal', 'Partner innovation may open collaboration paths — worth exploring with leadership', 'description', 'Alliance-driven opportunity — humans decide pursuit timing'),
      jsonb_build_object('emoji', '🔔', 'key', 'community_trends', 'signal', 'Community and industry trends may inform strategic positioning — shall I prepare context?', 'description', 'External awareness supports preparedness — not urgency pressure')
    ),
    'balance_note', 'Opportunity exploration balances caution with ambition — cross-link Risk Navigation Blueprint Phase 81.'
  );
$$;

create or replace function public._espe84bp_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion guidance — ecosystem awareness strengthens preparedness; Aipify Companion explores with humans, never replaces judgment.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'ecosystem_connections', 'prompt', 'Several ecosystem connections may influence this scenario — shall I summarize dependency patterns for review?', 'consideration', 'Transparent mapping strengthens confidence without overstating certainty'),
      jsonb_build_object('emoji', '🌹', 'key', 'partnership_preparedness', 'prompt', 'Exploring partnership resilience may strengthen strategic preparedness — worth discussing with leadership.', 'consideration', 'Alliance strength deserves celebration alongside preparedness gaps'),
      jsonb_build_object('emoji', '🔔', 'key', 'external_shift_preparedness', 'prompt', 'If external conditions shifted, preparedness planning often reduces disruption — would a scenario outline help?', 'consideration', 'Gentle preparedness — surface considerations humans may address before action')
    )
  );
$$;

create or replace function public._espe84bp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — perspective, patience, and intellectual humility when navigating ecosystem uncertainty.',
    'practices', jsonb_build_array(
      'Perspective — ecosystem dynamics are complex; exploration reduces anxiety from the unknown',
      'Patience — significant ecosystem shifts deserve time for thoughtful review',
      'Intellectual humility — no organization controls every external variable',
      'Confidence in preparation — preparedness often reduces fear more effectively than avoidance'
    ),
    'journey_phrase', 'We are not navigating the future alone.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports calm exploration — principle only; ecosystem scenarios store metadata, not wellbeing content.'
  );
$$;

create or replace function public._espe84bp_leadership_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership insights — ecosystem preparedness summaries, partnership observations, and strategic adaptability indicators.',
    'insight_types', jsonb_build_array(
      jsonb_build_object('emoji', '📈', 'key', 'ecosystem_preparedness', 'label', 'Ecosystem preparedness summaries', 'description', 'Aggregate simulation metadata for leadership review — counts and confidence, not partner communications'),
      jsonb_build_object('emoji', '🦉', 'key', 'dependency_observations', 'label', 'Dependency observations', 'description', 'External concentration patterns that deserve leadership attention — exploration not alarm'),
      jsonb_build_object('emoji', '🌹', 'key', 'partnership_strength_indicators', 'label', 'Partnership strength indicators', 'description', 'Alliance resilience signals that strengthen strategic dialogue — metadata only')
    ),
    'dialogue_note', 'Leadership observations encourage preparedness dialogue — not fear-based communication.'
  );
$$;

create or replace function public._espe84bp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparency about ecosystem assumptions, limitations, and the fact that scenarios support — not replace — human judgment.',
    'users_should_know', jsonb_build_array(
      'Ecosystem scenarios record assumptions with source and confidence',
      'Exploration strengthens preparedness — scenarios are not predictions',
      'External dependency mapping uses approved metadata only',
      'Partnership and vendor relationships remain under human governance',
      'Simulation never acts — production isolated on every run'
    ),
    'operators_should_understand', jsonb_build_array(
      'No customer PII or private partner communications in scenario metadata',
      'Cross-links to related engines — extend, do not duplicate',
      'Limitation principles mandatory — no certainty, no fear-driven framing'
    ),
    'audit_note', 'Ecosystem scenario exploration logged via simulation audit — metadata only.'
  );
$$;

create or replace function public._espe84bp_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Preparedness not prediction — ecosystem scenarios inform; they do not dictate outcomes.',
    'forbidden', jsonb_build_array(
      'Certainty about ecosystem futures',
      'Fear-driven interpretations of dependency risks',
      'Overstating predictive capability',
      'Catastrophic framing of external shifts',
      'Replacing human partnership governance with automated conclusions'
    ),
    'required', jsonb_build_array(
      'Transparent assumptions with confidence levels',
      'Exploration before commitment — humans decide',
      'Production isolation on every simulation run',
      'Cross-functional dialogue encouraged'
    ),
    'boundary_note', 'Ecosystem scenario planning prepares — it does not predict.'
  );
$$;

create or replace function public._espe84bp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates ecosystem scenario planning internally — technology provider resilience, partner networks, and strategic preparedness.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal validation — ecosystem development and technology provider resilience',
      'focus', jsonb_build_array(
        'Microsoft ecosystem and platform dependency awareness',
        'Shopify commerce integration resilience scenarios',
        'Fiken accounting platform continuity preparedness',
        'Stripe payment processing dependency mapping',
        'Sales Expert network growth and channel resilience',
        'Technology provider resilience and diversification review'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce ecosystem and partner dependency exploration',
      'focus', jsonb_build_array(
        'E-commerce platform and payment provider preparedness',
        'Peak-event ecosystem stress scenarios',
        'Supplier and fulfillment dependency mapping',
        'Sales channel and partner network resilience review'
      )
    )
  );
$$;

create or replace function public._espe84bp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We are not navigating the future alone. We are part of something larger.',
    'Ecosystem awareness strengthens strategic preparedness.',
    'Preparedness not prediction — exploration before commitment.',
    'Partnerships strengthen when preparedness is shared.',
    'Thoughtful leaders explore ecosystem dynamics before acting.'
  );
$$;

create or replace function public._espe84bp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Organizational Resilience (A.50)', 'route', '/app/organizational-resilience-engine', 'note', 'Crisis scenario planning and vulnerability tracking — cross-link, not duplicate'),
    jsonb_build_object('label', 'Curiosity & Discovery (A.87)', 'route', '/app/curiosity-discovery-engine', 'note', 'Opportunity Exploration Blueprint Phase 80 — ecosystem opportunity signals'),
    jsonb_build_object('label', 'Integration Engine (A.8)', 'route', '/app/integration-engine', 'note', 'Connector orchestration and external system dependencies'),
    jsonb_build_object('label', 'Strategic Intelligence (A.31)', 'route', '/app/strategic-intelligence-foundation-engine', 'note', 'Strategic awareness — Blueprint Phase 79 layered'),
    jsonb_build_object('label', 'Risk Navigation (Blueprint Phase 81)', 'route', '/app/organizational-resilience-engine', 'note', 'Risk preparedness and balanced decision-making — extends A.50'),
    jsonb_build_object('label', 'Evolution Governance (Repo Phase 84)', 'route', '/app/evolution', 'note', 'Tenant evolution proposals — distinct ABOS blueprint surface (phase number collision)'),
    jsonb_build_object('label', 'Ecosystem Intelligence (Phase 88)', 'route', '/app/ecosystem', 'note', 'Relationship maps and dependency analysis — cross-link'),
    jsonb_build_object('label', 'Simulation Lab Phase 78', 'route', '/app/simulations', 'note', 'Decision Lab foundation — _sdl78bp_* layered'),
    jsonb_build_object('label', 'Blueprint Phase 22 — Decision Lab', 'route', '/app/simulations', 'note', 'Decision comparison framework — _sdlbp_* layered'),
    jsonb_build_object('label', 'Blueprint Phase 76 — Scenario Simulation', 'route', '/app/simulations', 'note', 'Multiple futures — _ssbp_* layered'),
    jsonb_build_object('label', 'Partner Certification (Phase 91)', 'route', '/app/partners', 'note', 'Sales Expert networks and certified partner ecosystem'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Perspective and intellectual humility — principle only')
  );
$$;

create or replace function public._espe84bp_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return public._sdl78bp_engagement_summary(p_tenant_id);
end; $$;

create or replace function public._espe84bp_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_scenarios int := 0;
  v_runs int := 0;
begin
  v_engagement := public._espe84bp_engagement_summary(p_tenant_id);
  v_scenarios := coalesce((v_engagement->>'scenarios_total')::int, 0);
  v_runs := coalesce((v_engagement->>'simulation_runs_total')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'ecosystem_awareness',
      'label', 'Ecosystem awareness — eight ecosystem components documented',
      'met', jsonb_array_length(public._espe84bp_ecosystem_components()->'components') >= 8,
      'note', 'Customers, tech partners, suppliers, Sales Experts, alliances, regulatory, communities, service providers.'
    ),
    jsonb_build_object(
      'key', 'external_dependency_mapping',
      'label', 'External dependency mapping — technology, financial, distribution, knowledge types',
      'met', jsonb_array_length(public._espe84bp_external_dependency_awareness()->'dependency_types') >= 4,
      'note', 'Microsoft, Shopify, Fiken, Stripe, Sales Expert networks — dogfooding documented.'
    ),
    jsonb_build_object(
      'key', 'scenario_preparedness',
      'label', 'Scenario preparedness — ecosystem scenario questions available',
      'met', jsonb_array_length(public._espe84bp_scenario_questions()->'questions') >= 3,
      'note', '🦉🌹🔔 questions encourage exploration not prediction.'
    ),
    jsonb_build_object(
      'key', 'partnership_resilience',
      'label', 'Partnership resilience — companion scenario examples documented',
      'met', jsonb_array_length(public._espe84bp_partnership_resilience()->'examples') >= 3,
      'note', 'Alliance review, partner growth, vendor continuity scenarios.'
    ),
    jsonb_build_object(
      'key', 'simulation_engagement',
      'label', 'Simulation engagement — at least one ecosystem scenario explored',
      'met', v_runs > 0,
      'note', case when v_runs = 0 then 'Run a simulation to begin ecosystem scenario exploration.' else null end
    ),
    jsonb_build_object(
      'key', 'production_isolation',
      'label', 'Production isolation enforced — simulation never acts',
      'met', true,
      'note', 'Core Phase 78 rule — all runs marked production_isolated.'
    ),
    jsonb_build_object(
      'key', 'limitation_principles',
      'label', 'Limitation principles — no certainty, no fear-driven framing',
      'met', jsonb_array_length(public._espe84bp_limitation_principles()->'forbidden') >= 5,
      'note', 'Preparedness not prediction — objective is strategic preparedness.'
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Companion guidance documented (🦉🌹🔔)',
      'met', jsonb_array_length(public._espe84bp_companion_guidance()->'examples') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — assumptions and limitations transparent',
      'met', jsonb_array_length(public._espe84bp_trust_connection()->'users_should_know') >= 5,
      'note', 'Scenarios support — not replace — human judgment.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from Evolution repo Phase 84, Org Resilience A.50, Curiosity A.87, Integration A.8, Strategic Intelligence A.31',
      'met', jsonb_array_length(public._espe84bp_integration_links()) >= 10,
      'note', 'Extend related engines — do not duplicate.'
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS principle — ecosystem awareness strengthens strategic preparedness',
      'met', true,
      'note', 'We are not navigating the future alone.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL Phase 78/76/22/baseline; append ecosystem_scenario_planning
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
    'blueprint_phase78_safety_note', 'Exploration not certainty — simulation never acts; production isolated; no simple scores replace human judgment.',
    'ecosystem_scenario_planning', jsonb_build_object(
      'implementation_blueprint', jsonb_build_object(
        'phase', 'Phase 84 — Ecosystem Scenario Planning Engine',
        'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE84_ECOSYSTEM_SCENARIO_PLANNING.md',
        'engine_phase', 'Phase 78 Simulation & Decision Lab (layered with Phases 22, 76, 78)',
        'route', '/app/simulations',
        'mapping_note', 'ABOS Blueprint Phase 84 extends Simulation Lab with ecosystem scenario planning via _espe84bp_* helpers. Distinct from Evolution Governance repo Phase 84 at /app/evolution (phase number collision).'
      ),
      'ecosystem_scenario_planning_note', 'Ecosystem Scenario Planning Engine (ABOS Phase 84) — explore how ecosystem changes influence future outcomes. Preparedness not prediction.',
      'distinction_note', public._espe84bp_distinction_note(),
      'mission', public._espe84bp_mission(),
      'philosophy', public._espe84bp_philosophy(),
      'abos_principle', public._espe84bp_abos_principle(),
      'vision', public._espe84bp_vision(),
      'objectives', public._espe84bp_objectives(),
      'ecosystem_components', public._espe84bp_ecosystem_components(),
      'scenario_questions', public._espe84bp_scenario_questions(),
      'external_dependency_awareness', public._espe84bp_external_dependency_awareness(),
      'partnership_resilience', public._espe84bp_partnership_resilience(),
      'opportunity_exploration', public._espe84bp_opportunity_exploration(),
      'companion_guidance', public._espe84bp_companion_guidance(),
      'self_love_connection', public._espe84bp_self_love_connection(),
      'leadership_insights', public._espe84bp_leadership_insights(),
      'trust_connection', public._espe84bp_trust_connection(),
      'limitation_principles', public._espe84bp_limitation_principles(),
      'dogfooding', public._espe84bp_dogfooding(),
      'success_criteria', public._espe84bp_success_criteria(v_tenant_id),
      'integration_links', public._espe84bp_integration_links(),
      'engagement_summary', public._espe84bp_engagement_summary(v_tenant_id),
      'vision_phrases', public._espe84bp_vision_phrases(),
      'safety_note', 'Ecosystem scenarios are possibilities not predictions — simulation never acts; production isolated; humans govern partnerships.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve Phase 78/76/22; append Phase 84 blueprint
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
  v_phase84_engagement jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select count(*) into v_scenarios from public.simulation_scenarios where tenant_id = v_tenant_id and status != 'archived';
  select count(*) into v_runs from public.simulation_runs where tenant_id = v_tenant_id;

  v_engagement := public._sdlbp_engagement_summary(v_tenant_id);
  v_phase76_engagement := public._ssbp_engagement_summary(v_tenant_id);
  v_phase78_engagement := public._sdl78bp_engagement_summary(v_tenant_id);
  v_phase84_engagement := public._espe84bp_engagement_summary(v_tenant_id);

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
    'blueprint_phase78_note', 'Simulation & Decision Lab Engine (ABOS Phase 78) — collaborative exploration and thoughtful reflection. Exploration not certainty.',
    'implementation_blueprint_phase84', jsonb_build_object(
      'phase', 'Phase 84 — Ecosystem Scenario Planning Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE84_ECOSYSTEM_SCENARIO_PLANNING.md',
      'engine_phase', 'Phase 78 Simulation & Decision Lab (layered with Phases 22, 76, 78)',
      'route', '/app/simulations'
    ),
    'blueprint_phase84_mission', public._espe84bp_mission(),
    'blueprint_phase84_abos_principle', public._espe84bp_abos_principle(),
    'blueprint_phase84_engagement_summary', v_phase84_engagement,
    'blueprint_phase84_note', 'Ecosystem Scenario Planning Engine (ABOS Phase 84) — explore how ecosystem changes influence outcomes. Distinct from Evolution Governance repo Phase 84. Preparedness not prediction.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._espe84bp_distinction_note() to authenticated;
grant execute on function public._espe84bp_mission() to authenticated;
grant execute on function public._espe84bp_philosophy() to authenticated;
grant execute on function public._espe84bp_abos_principle() to authenticated;
grant execute on function public._espe84bp_vision() to authenticated;
grant execute on function public._espe84bp_objectives() to authenticated;
grant execute on function public._espe84bp_ecosystem_components() to authenticated;
grant execute on function public._espe84bp_scenario_questions() to authenticated;
grant execute on function public._espe84bp_external_dependency_awareness() to authenticated;
grant execute on function public._espe84bp_partnership_resilience() to authenticated;
grant execute on function public._espe84bp_opportunity_exploration() to authenticated;
grant execute on function public._espe84bp_companion_guidance() to authenticated;
grant execute on function public._espe84bp_self_love_connection() to authenticated;
grant execute on function public._espe84bp_leadership_insights() to authenticated;
grant execute on function public._espe84bp_trust_connection() to authenticated;
grant execute on function public._espe84bp_limitation_principles() to authenticated;
grant execute on function public._espe84bp_dogfooding() to authenticated;
grant execute on function public._espe84bp_vision_phrases() to authenticated;
grant execute on function public._espe84bp_integration_links() to authenticated;
grant execute on function public._espe84bp_engagement_summary(uuid) to authenticated;
grant execute on function public._espe84bp_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'simulation-decision-lab-blueprint-phase84', 'Ecosystem Scenario Planning Engine (ABOS Phase 84)',
  'Ecosystem Scenario Planning Engine — ABOS Blueprint Phase 84 extends Simulation Lab at /app/simulations; ecosystem components, external dependency awareness, partnership resilience, opportunity exploration, limitation principles. Distinct from Evolution Governance repo Phase 84.',
  'authenticated', 101
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'simulation-decision-lab-blueprint-phase84' and tenant_id is null
);
