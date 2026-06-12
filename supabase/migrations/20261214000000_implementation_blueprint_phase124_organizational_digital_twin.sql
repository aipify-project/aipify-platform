-- Implementation Blueprint Phase 124 — Organizational Digital Twin Engine
-- Enterprise Intelligence Era (121–130). Extends Digital Twin Phase 77 + Blueprint Phase 77.
-- Helpers: _odtbp124_* (never collide with _dtw_*, _odtbp_*).

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._odtbp124_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Enterprise Intelligence Phase 124 — Organizational Digital Twin Engine at /app/digital-twin. Layers on repo Phase 77 Digital Twin & Organizational Model Engine (20260616800000_digital_twin_organizational_model_phase77.sql) and ABOS Blueprint Phase 77 (_odtbp_* — 20261028000000_implementation_blueprint_phase77_organizational_digital_twin.sql). Phase 124 deepens Enterprise Intelligence era scaffolding — system relationships, dependency intelligence, simulation workspaces, transformation impact, knowledge networks, resilience visualization, and Executive Digital Twin Companion — Phase 77 established responsibility-centric organizational model; Phase 124 is the Enterprise Intelligence layer, not a duplicate route. Distinct from Operational Intelligence Layer Phase 51 at /app/insights. Distinct from Cross-Tenant Intelligence A.71. Helpers _odtbp124_* only — never _dtw_* or _odtbp_*. Twin models responsibilities NOT people — no surveillance, no individual scoring. Cross-link Executive Intelligence Phase 121, Strategic Foresight Phase 122, Board Governance Phase 123, Simulation Lab Phase 78, Org Memory A.34, Ecosystem 88/120, Self Love A.76.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata
-- ---------------------------------------------------------------------------
create or replace function public._odtbp124_mission()
returns text language sql immutable as $$
  select 'Help organizations understand complex living systems — visibility, simulation, and institutional understanding that strengthen decision quality and resilience without prediction or surveillance.';
$$;

create or replace function public._odtbp124_philosophy()
returns text language sql immutable as $$
  select 'Complex living systems deserve visibility and simulation — understanding NOT prediction. The Twin is a mirror, not a replacement. Wisdom before speed. People First.';
$$;

create or replace function public._odtbp124_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Organizational Digital Twin reflects how work flows through people, processes, companions, and governance. Aipify informs and prepares; humans decide.';
$$;

create or replace function public._odtbp124_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'system_relationships', 'label', 'System relationships', 'description', 'Map how departments, companions, governance, and knowledge interconnect — metadata only'),
    jsonb_build_object('key', 'visualize_dynamics', 'label', 'Visualize dynamics', 'description', 'Relationship visualization and dependency analysis for operational awareness'),
    jsonb_build_object('key', 'explore_consequences', 'label', 'Explore consequences', 'description', 'Simulation workspaces for reflection — cross-link /app/simulations, not certainty'),
    jsonb_build_object('key', 'decision_quality', 'label', 'Decision quality', 'description', 'Dependency summaries and transformation context for wiser human decisions'),
    jsonb_build_object('key', 'resilience_planning', 'label', 'Resilience planning', 'description', 'Resilience modeling — knowledge redundancy, leadership continuity, companion coverage'),
    jsonb_build_object('key', 'reduce_unintended_outcomes', 'label', 'Reduce unintended outcomes', 'description', 'Dependency intelligence surfaces single points of failure for human review'),
    jsonb_build_object('key', 'organizational_learning', 'label', 'Organizational learning', 'description', 'Twin memory captures transformation milestones and lessons learned — cross-link Org Memory A.34'),
    jsonb_build_object('key', 'institutional_understanding', 'label', 'Institutional understanding', 'description', 'Continuously evolving organizational map — institutional knowledge, not individual surveillance')
  );
$$;

create or replace function public._odtbp124_organizational_digital_twin()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizational Digital Twin reflects how the organization works — evolves continuously. Models responsibilities NOT people.',
    'reflects', jsonb_build_array(
      jsonb_build_object('key', 'people', 'label', 'People', 'description', 'Responsibility roles and assignments — never individual scoring'),
      jsonb_build_object('key', 'departments', 'label', 'Departments', 'description', 'Organization units and cross-functional structures'),
      jsonb_build_object('key', 'processes', 'label', 'Processes', 'description', 'Process models, steps, and escalation paths'),
      jsonb_build_object('key', 'companions', 'label', 'Companions', 'description', 'Companion assignments and coverage — cross-link Companion Marketplace Phase 113'),
      jsonb_build_object('key', 'knowledge', 'label', 'Knowledge', 'description', 'SME routing and knowledge network connections — cross-link KC A.5'),
      jsonb_build_object('key', 'governance', 'label', 'Governance', 'description', 'Governance connections and policy dependencies — cross-link Phase 123'),
      jsonb_build_object('key', 'customers', 'label', 'Customers', 'description', 'Customer touchpoints and experience dependencies — metadata only'),
      jsonb_build_object('key', 'growth_partners', 'label', 'Growth Partners', 'description', 'GP engagement and ecosystem relationships — cross-link GP Operations Phase 114'),
      jsonb_build_object('key', 'communities', 'label', 'Communities', 'description', 'Community support and collective success — cross-link Phase 117'),
      jsonb_build_object('key', 'technology', 'label', 'Technology', 'description', 'Technology dependencies and integration touchpoints — metadata only')
    ),
    'boundary_note', 'Twin models responsibilities — never employee surveillance, ranking, or hidden monitoring.'
  );
$$;

create or replace function public._odtbp124_digital_twin_center()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'organizational_mapping', 'label', 'Organizational mapping'),
    jsonb_build_object('key', 'relationship_visualization', 'label', 'Relationship visualization'),
    jsonb_build_object('key', 'dependency_analysis', 'label', 'Dependency analysis'),
    jsonb_build_object('key', 'simulation_workspaces', 'label', 'Simulation workspaces'),
    jsonb_build_object('key', 'knowledge_connections', 'label', 'Knowledge connections'),
    jsonb_build_object('key', 'transformation_monitoring', 'label', 'Transformation monitoring'),
    jsonb_build_object('key', 'operational_awareness', 'label', 'Operational awareness'),
    jsonb_build_object('key', 'resilience_modeling', 'label', 'Resilience modeling'),
    jsonb_build_object('key', 'leadership_dashboards', 'label', 'Leadership dashboards')
  );
$$;

create or replace function public._odtbp124_organizational_map_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'dept_structures', 'label', 'Department structures', 'description', 'Teams, units, and reporting context — structure mapping'),
    jsonb_build_object('key', 'cross_functional_dependencies', 'label', 'Cross-functional dependencies', 'description', 'How work flows across functions — awareness not judgment'),
    jsonb_build_object('key', 'leadership_relationships', 'label', 'Leadership relationships', 'description', 'Escalation authority and decision paths — roles not individuals'),
    jsonb_build_object('key', 'knowledge_networks', 'label', 'Knowledge networks', 'description', 'SME connections and documentation pathways'),
    jsonb_build_object('key', 'companion_assignments', 'label', 'Companion assignments', 'description', 'Which companions support which responsibilities'),
    jsonb_build_object('key', 'governance_connections', 'label', 'Governance connections', 'description', 'Policy, approval, and oversight dependencies'),
    jsonb_build_object('key', 'customer_touchpoints', 'label', 'Customer touchpoints', 'description', 'Customer experience flow across roles — metadata only'),
    jsonb_build_object('key', 'gp_engagement', 'label', 'GP engagement', 'description', 'Growth Partner and ecosystem relationship mapping')
  );
$$;

create or replace function public._odtbp124_dependency_intelligence()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'single_points_of_failure', 'label', 'Single points of failure', 'description', 'Concentrated responsibility or process gaps — system signals only'),
    jsonb_build_object('key', 'knowledge_bottlenecks', 'label', 'Knowledge bottlenecks', 'description', 'SME concentration and documentation gaps'),
    jsonb_build_object('key', 'leadership_concentration', 'label', 'Leadership concentration', 'description', 'Decision authority concentration — continuity awareness, not evaluation'),
    jsonb_build_object('key', 'companion_reliance', 'label', 'Companion reliance', 'description', 'Operational dependency on companion coverage'),
    jsonb_build_object('key', 'governance_dependencies', 'label', 'Governance dependencies', 'description', 'Policy and approval chain interdependencies'),
    jsonb_build_object('key', 'operational_constraints', 'label', 'Operational constraints', 'description', 'Process deadlines, escalation overload, and capacity signals')
  );
$$;

create or replace function public._odtbp124_simulation_workspace()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Simulation workspace — reflection not certainty. Cross-link /app/simulations.',
    'simulation_route', '/app/simulations',
    'scenarios', jsonb_build_array(
      jsonb_build_object('key', 'growth', 'label', 'Growth scenarios', 'description', 'Explore organizational capacity under expansion'),
      jsonb_build_object('key', 'restructuring', 'label', 'Restructuring', 'description', 'Model responsibility redistribution and handoffs'),
      jsonb_build_object('key', 'knowledge_transfer', 'label', 'Knowledge transfer', 'description', 'SME continuity and documentation coverage scenarios'),
      jsonb_build_object('key', 'companion_expansion', 'label', 'Companion expansion', 'description', 'Companion coverage and assignment changes'),
      jsonb_build_object('key', 'governance_changes', 'label', 'Governance changes', 'description', 'Policy and approval path adjustments'),
      jsonb_build_object('key', 'customer_growth', 'label', 'Customer growth', 'description', 'Customer touchpoint load and experience dependencies'),
      jsonb_build_object('key', 'workforce_transition', 'label', 'Workforce transition', 'description', 'Role continuity and responsibility handoff context — not individual tracking')
    ),
    'boundary_note', 'Simulations explore possibilities — never modify production data or predict with certainty.'
  );
$$;

create or replace function public._odtbp124_transformation_impact_model()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'learning_requirements', 'label', 'Learning requirements', 'description', 'Training and knowledge gaps from structural change'),
    jsonb_build_object('key', 'communication_needs', 'label', 'Communication needs', 'description', 'Stakeholder communication and alignment requirements'),
    jsonb_build_object('key', 'resource_adjustments', 'label', 'Resource adjustments', 'description', 'Capacity and workload redistribution signals'),
    jsonb_build_object('key', 'companion_changes', 'label', 'Companion changes', 'description', 'Companion assignment and coverage adjustments'),
    jsonb_build_object('key', 'governance_updates', 'label', 'Governance updates', 'description', 'Policy and approval path updates needed'),
    jsonb_build_object('key', 'knowledge_gaps', 'label', 'Knowledge gaps', 'description', 'Documentation and SME coverage gaps'),
    jsonb_build_object('key', 'relationship_effects', 'label', 'Relationship effects', 'description', 'Cross-functional relationship changes from transformation')
  );
$$;

create or replace function public._odtbp124_knowledge_network_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'smes', 'label', 'Subject matter experts', 'description', 'Knowledge ownership and SME routing — roles not individuals'),
    jsonb_build_object('key', 'silos', 'label', 'Knowledge silos', 'description', 'Isolation patterns worth exploring — system lens only'),
    jsonb_build_object('key', 'learning_opportunities', 'label', 'Learning opportunities', 'description', 'Cross-training and documentation improvement areas'),
    jsonb_build_object('key', 'documentation_gaps', 'label', 'Documentation gaps', 'description', 'Topics lacking adequate knowledge coverage'),
    jsonb_build_object('key', 'dependencies', 'label', 'Knowledge dependencies', 'description', 'Critical knowledge concentration and handoff risks'),
    jsonb_build_object('key', 'collaboration_pathways', 'label', 'Collaboration pathways', 'description', 'How knowledge flows across teams and functions')
  );
$$;

create or replace function public._odtbp124_resilience_visualization()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'operational_flexibility', 'label', 'Operational flexibility', 'description', 'Process adaptability and backup coverage'),
    jsonb_build_object('key', 'knowledge_redundancy', 'label', 'Knowledge redundancy', 'description', 'Shared coverage beyond single SME dependencies'),
    jsonb_build_object('key', 'leadership_continuity', 'label', 'Leadership continuity', 'description', 'Decision authority backup chains — role continuity'),
    jsonb_build_object('key', 'gp_diversity', 'label', 'GP diversity', 'description', 'Growth Partner network breadth and resilience'),
    jsonb_build_object('key', 'community_support', 'label', 'Community support', 'description', 'Community engagement as organizational resilience factor'),
    jsonb_build_object('key', 'companion_coverage', 'label', 'Companion coverage', 'description', 'Companion assignment breadth across responsibilities'),
    jsonb_build_object('key', 'governance_stability', 'label', 'Governance stability', 'description', 'Policy review cadence and approval path health')
  );
$$;

create or replace function public._odtbp124_executive_digital_twin_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'system_explanations', 'label', 'System explanations', 'description', 'Explain how organizational systems connect — understanding not outcomes'),
    jsonb_build_object('key', 'dependency_summaries', 'label', 'Dependency summaries', 'description', 'Summarize dependency patterns for leadership review'),
    jsonb_build_object('key', 'simulation_guidance', 'label', 'Simulation guidance', 'description', 'Guide scenario exploration — cross-link /app/simulations'),
    jsonb_build_object('key', 'knowledge_connections', 'label', 'Knowledge connections', 'description', 'Connect knowledge gaps to SME routing and KC'),
    jsonb_build_object('key', 'transformation_preparation', 'label', 'Transformation preparation', 'description', 'Prepare transformation impact context for human review'),
    jsonb_build_object('key', 'question_generation', 'label', 'Question generation', 'description', 'Generate questions worth exploring — strengthens understanding, not directives')
  );
$$;

create or replace function public._odtbp124_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'no_predictive_certainty', 'label', 'No predictive certainty', 'description', 'Simulations and Twin insights are exploratory — never presented as forecasts'),
    jsonb_build_object('key', 'no_context_free_recommendations', 'label', 'No context-free recommendations', 'description', 'Recommendations require organizational context and human judgment'),
    jsonb_build_object('key', 'no_replacing_judgment', 'label', 'No replacing judgment', 'description', 'Executive Digital Twin Companion informs — humans decide'),
    jsonb_build_object('key', 'no_ignoring_human_considerations', 'label', 'No ignoring human considerations', 'description', 'Self Love, change fatigue, and capacity matter — People First'),
    jsonb_build_object('key', 'no_concealed_uncertainty', 'label', 'No concealed uncertainty', 'description', 'Confidence levels and limitations always disclosed')
  );
$$;

create or replace function public._odtbp124_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love in organizational design — sustainable pacing, psychological safety, and human capacity.',
    'considerations', jsonb_build_array(
      jsonb_build_object('key', 'human_capacity', 'label', 'Human capacity', 'description', 'Respect workload limits and sustainable design'),
      jsonb_build_object('key', 'psychological_safety', 'label', 'Psychological safety', 'description', 'Twin supports understanding — never punitive interpretation'),
      jsonb_build_object('key', 'change_fatigue', 'label', 'Change fatigue', 'description', 'Transformation pacing respects human limits'),
      jsonb_build_object('key', 'learning_requirements', 'label', 'Learning requirements', 'description', 'Adequate time and support for organizational learning'),
      jsonb_build_object('key', 'support_structures', 'label', 'Support structures', 'description', 'Backup chains and shared responsibilities reduce overload'),
      jsonb_build_object('key', 'sustainable_pacing', 'label', 'Sustainable pacing', 'description', 'Wisdom before speed — thoughtful transformation')
    ),
    'journey_phrase', 'No organization thrives when a few individuals carry everything alone.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love is a principle — Digital Twin stores organizational metadata, not wellbeing content.'
  );
$$;

create or replace function public._odtbp124_memory_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Digital Twin memory engine — captures organizational evolution for institutional understanding.',
    'org_memory_route', '/app/organizational-memory-engine',
    'captures', jsonb_build_array(
      jsonb_build_object('key', 'transformation_milestones', 'label', 'Transformation milestones'),
      jsonb_build_object('key', 'structural_changes', 'label', 'Structural changes'),
      jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned'),
      jsonb_build_object('key', 'governance_adaptations', 'label', 'Governance adaptations'),
      jsonb_build_object('key', 'knowledge_growth', 'label', 'Knowledge growth'),
      jsonb_build_object('key', 'companion_expansion_histories', 'label', 'Companion expansion histories')
    ),
    'boundary_note', 'Metadata only — cross-link Organizational Memory A.34; no raw conversations or PII.'
  );
$$;

create or replace function public._odtbp124_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'digital_twin_phase77', 'label', 'Digital Twin Phase 77', 'route', '/app/digital-twin', 'note', 'Primary engine — Phase 124 extends Phase 77 + Blueprint 77'),
    jsonb_build_object('key', 'executive_intelligence', 'label', 'Executive Intelligence Phase 121', 'route', '/app/executive-intelligence', 'note', 'Leadership context and executive briefings — cross-link'),
    jsonb_build_object('key', 'strategic_foresight', 'label', 'Strategic Foresight Phase 122', 'route', '/app/strategic-foresight-engine', 'note', 'Foresight and preparedness — understanding not prediction'),
    jsonb_build_object('key', 'board_governance', 'label', 'Board Governance Phase 123', 'route', '/app/governance-policy-engine', 'note', 'Governance connections and oversight context'),
    jsonb_build_object('key', 'simulation_lab', 'label', 'Simulation Lab Phase 78', 'route', '/app/simulations', 'note', 'Simulation workspaces — read-only Twin context input'),
    jsonb_build_object('key', 'org_memory', 'label', 'Organizational Memory A.34', 'route', '/app/organizational-memory-engine', 'note', 'Twin memory cross-link — historical organizational context'),
    jsonb_build_object('key', 'ecosystem_intelligence', 'label', 'Ecosystem Intelligence Phase 88', 'route', '/app/ecosystem', 'note', 'External relationship context — cross-link only'),
    jsonb_build_object('key', 'ecosystem_orchestration', 'label', 'Ecosystem Orchestration Phase 120', 'route', '/app/ecosystem-orchestration', 'note', 'Collective evolution and ecosystem health'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Sustainable pacing and human capacity — principle only'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center A.5', 'route', '/app/knowledge-center-engine', 'note', 'Knowledge network and SME routing'),
    jsonb_build_object('key', 'companion_marketplace', 'label', 'Companion Marketplace Phase 113', 'route', '/app/companion-marketplace', 'note', 'Companion assignments and coverage'),
    jsonb_build_object('key', 'blueprint_phase77', 'label', 'Blueprint Phase 77', 'route', '/app/digital-twin', 'note', 'Prior organizational twin layer — _odtbp_* scaffolds preserved')
  );
$$;

create or replace function public._odtbp124_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizational Digital Twin informs and prepares — never employee surveillance, individual scoring, or hidden monitoring.',
    'must_never', public._odtbp124_companion_limitations(),
    'forbidden', jsonb_build_array(
      'Employee surveillance or secret monitoring',
      'Individual scoring, ranking, or performance evaluation',
      'Predictive certainty or concealed uncertainty',
      'Punitive interpretations of dependency patterns',
      'Context-free recommendations without human judgment'
    ),
    'required', jsonb_build_array(
      'Twin models responsibilities — not people',
      'Metadata-only organizational signals',
      'Simulations are exploration — not certainty',
      'Human review before structural changes',
      'Transparent information sources and limitations',
      'Preserve Phase 77 _odtbp_* fields in dashboard and card RPCs'
    ),
    'boundary_note', 'People First. Wisdom before speed. Understanding supports wiser support — humans decide.'
  );
$$;

create or replace function public._odtbp124_companion_adaptation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive Digital Twin Companion — explain systems, summarize dependencies, guide simulations — understanding not outcomes.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'dependency_context', 'prompt', 'Several responsibilities share a single escalation path — shall Aipify summarize dependency context for review when leadership is ready?', 'consideration', 'Dependency awareness without urgency'),
      jsonb_build_object('emoji', '🌹', 'key', 'knowledge_growth', 'prompt', 'Knowledge coverage expanded in this area since the last review — recognition of collective documentation effort.', 'consideration', 'Positive organizational learning — not individual evaluation'),
      jsonb_build_object('emoji', '🔔', 'key', 'transformation_readiness', 'prompt', 'A planned transformation may affect three cross-functional dependencies — would impact context help preparation?', 'consideration', 'Transformation preparation — humans decide timing'),
      jsonb_build_object('emoji', '📈', 'key', 'resilience_summary', 'prompt', 'Resilience indicators suggest companion coverage gaps in one process area — metadata summary prepared for review.', 'consideration', 'Resilience modeling — system signals only')
    )
  );
$$;

create or replace function public._odtbp124_success_metrics()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'organizational_visibility', 'label', 'Organizational visibility'),
    jsonb_build_object('key', 'dependency_awareness', 'label', 'Dependency awareness'),
    jsonb_build_object('key', 'simulation_preparedness', 'label', 'Simulation preparedness'),
    jsonb_build_object('key', 'transformation_readiness', 'label', 'Transformation readiness'),
    jsonb_build_object('key', 'knowledge_network_health', 'label', 'Knowledge network health'),
    jsonb_build_object('key', 'resilience_indicators', 'label', 'Resilience indicators'),
    jsonb_build_object('key', 'institutional_learning', 'label', 'Institutional learning'),
    jsonb_build_object('key', 'decision_quality_support', 'label', 'Decision quality support')
  );
$$;

create or replace function public._odtbp124_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_base jsonb;
begin
  v_base := public._odtbp_engagement_summary(p_tenant_id);
  return v_base || jsonb_build_object(
    'objectives_count', jsonb_array_length(public._odtbp124_objectives()),
    'twin_center_capabilities', jsonb_array_length(public._odtbp124_digital_twin_center()),
    'map_engine_examples', jsonb_array_length(public._odtbp124_organizational_map_engine()),
    'dependency_signals', jsonb_array_length(public._odtbp124_dependency_intelligence()),
    'simulation_scenarios', jsonb_array_length(public._odtbp124_simulation_workspace()->'scenarios'),
    'transformation_impacts', jsonb_array_length(public._odtbp124_transformation_impact_model()),
    'knowledge_highlights', jsonb_array_length(public._odtbp124_knowledge_network_engine()),
    'resilience_displays', jsonb_array_length(public._odtbp124_resilience_visualization()),
    'executive_companion_supports', jsonb_array_length(public._odtbp124_executive_digital_twin_companion()),
    'cross_links_count', jsonb_array_length(public._odtbp124_cross_links()),
    'success_metrics_count', jsonb_array_length(public._odtbp124_success_metrics()),
    'companion_limitations_count', jsonb_array_length(public._odtbp124_companion_limitations()),
    'memory_captures', jsonb_array_length(public._odtbp124_memory_engine()->'captures'),
    'privacy_note', 'Metadata only — role, process, insight counts. No individual employee data, surveillance, or PII.'
  );
end; $$;

create or replace function public._odtbp124_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_roles int := 0;
  v_processes int := 0;
  v_health numeric := 0;
begin
  v_engagement := public._odtbp124_engagement_summary(p_tenant_id);
  v_roles := coalesce((v_engagement->>'active_roles')::int, 0);
  v_processes := coalesce((v_engagement->>'active_processes')::int, 0);
  v_health := coalesce((v_engagement->>'twin_health_score')::numeric, 0);

  return jsonb_build_array(
    jsonb_build_object('key', 'objectives', 'label', 'Eight Enterprise Intelligence objectives documented', 'met', jsonb_array_length(public._odtbp124_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'twin_center', 'label', 'Digital Twin Center — nine capabilities', 'met', jsonb_array_length(public._odtbp124_digital_twin_center()) = 9, 'note', null),
    jsonb_build_object('key', 'map_engine', 'label', 'Organizational map engine — eight examples', 'met', jsonb_array_length(public._odtbp124_organizational_map_engine()) = 8, 'note', null),
    jsonb_build_object('key', 'dependency_intelligence', 'label', 'Dependency intelligence — six signal types', 'met', jsonb_array_length(public._odtbp124_dependency_intelligence()) = 6, 'note', 'System signals only — never individual scoring.'),
    jsonb_build_object('key', 'simulation_workspace', 'label', 'Simulation workspace — seven scenarios', 'met', jsonb_array_length(public._odtbp124_simulation_workspace()->'scenarios') = 7, 'note', 'Cross-link /app/simulations — reflection not certainty.'),
    jsonb_build_object('key', 'transformation_impact', 'label', 'Transformation impact model — seven impacts', 'met', jsonb_array_length(public._odtbp124_transformation_impact_model()) = 7, 'note', null),
    jsonb_build_object('key', 'knowledge_network', 'label', 'Knowledge network engine — six highlights', 'met', jsonb_array_length(public._odtbp124_knowledge_network_engine()) = 6, 'note', null),
    jsonb_build_object('key', 'resilience_visualization', 'label', 'Resilience visualization — seven displays', 'met', jsonb_array_length(public._odtbp124_resilience_visualization()) = 7, 'note', null),
    jsonb_build_object('key', 'executive_companion', 'label', 'Executive Digital Twin Companion — six supports', 'met', jsonb_array_length(public._odtbp124_executive_digital_twin_companion()) = 6, 'note', 'Understanding not outcomes.'),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — five never rules', 'met', jsonb_array_length(public._odtbp124_companion_limitations()) = 5, 'note', 'No predictive certainty or concealed uncertainty.'),
    jsonb_build_object('key', 'memory_engine', 'label', 'Twin memory engine — six capture types', 'met', jsonb_array_length(public._odtbp124_memory_engine()->'captures') = 6, 'note', 'Cross-link Org Memory A.34.'),
    jsonb_build_object('key', 'cross_links', 'label', 'Mandatory cross-links documented', 'met', jsonb_array_length(public._odtbp124_cross_links()) >= 10, 'note', null),
    jsonb_build_object('key', 'success_metrics', 'label', 'Success metrics — eight documented', 'met', jsonb_array_length(public._odtbp124_success_metrics()) = 8, 'note', null),
    jsonb_build_object('key', 'phase77_preserved', 'label', 'Phase 77 _odtbp_* scaffolds preserved', 'met', jsonb_array_length(public._odtbp_objectives()) >= 6, 'note', 'Phase 124 layers on Phase 77 — does not replace.'),
    jsonb_build_object('key', 'twin_engagement', 'label', 'Live Twin engagement — roles and processes mapped', 'met', v_roles >= 1 and v_processes >= 1, 'note', case when v_roles < 1 or v_processes < 1 then 'Seed or configure Twin roles and processes.' else format('%s roles, %s processes, health %s.', v_roles, v_processes, v_health) end),
    jsonb_build_object('key', 'distinction', 'label', 'Phase 124 vs Phase 77 distinction documented', 'met', position('Phase 77' in public._odtbp124_distinction_note()) > 0, 'note', public._odtbp124_distinction_note())
  );
end; $$;

create or replace function public._odtbp124_blueprint_block(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'phase', '124',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE124_ORGANIZATIONAL_DIGITAL_TWIN.md',
    'spec_doc', 'ORGANIZATIONAL_DIGITAL_TWIN_ENGINE_PHASE124.md',
    'engine_phase', 'Phase 77 Digital Twin & Organizational Model Engine',
    'era', 'Enterprise Intelligence Era (121–130)',
    'route', '/app/digital-twin',
    'distinction_note', public._odtbp124_distinction_note(),
    'mission', public._odtbp124_mission(),
    'philosophy', public._odtbp124_philosophy(),
    'abos_principle', public._odtbp124_abos_principle(),
    'objectives', public._odtbp124_objectives(),
    'organizational_digital_twin', public._odtbp124_organizational_digital_twin(),
    'digital_twin_center', public._odtbp124_digital_twin_center(),
    'organizational_map_engine', public._odtbp124_organizational_map_engine(),
    'dependency_intelligence', public._odtbp124_dependency_intelligence(),
    'simulation_workspace', public._odtbp124_simulation_workspace(),
    'transformation_impact_model', public._odtbp124_transformation_impact_model(),
    'knowledge_network_engine', public._odtbp124_knowledge_network_engine(),
    'resilience_visualization', public._odtbp124_resilience_visualization(),
    'executive_digital_twin_companion', public._odtbp124_executive_digital_twin_companion(),
    'companion_limitations', public._odtbp124_companion_limitations(),
    'self_love_connection', public._odtbp124_self_love_connection(),
    'memory_engine', public._odtbp124_memory_engine(),
    'cross_links', public._odtbp124_cross_links(),
    'limitation_principles', public._odtbp124_limitation_principles(),
    'companion_adaptation', public._odtbp124_companion_adaptation(),
    'success_metrics', public._odtbp124_success_metrics(),
    'success_criteria', public._odtbp124_success_criteria(p_tenant_id),
    'engagement_summary', public._odtbp124_engagement_summary(p_tenant_id),
    'privacy_note', 'Metadata only — Twin models responsibilities NOT people. No employee surveillance, individual scoring, or hidden monitoring.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL Phase 77 fields; append Phase 124
-- ---------------------------------------------------------------------------
create or replace function public.get_digital_twin_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_health jsonb;
  v_roles jsonb;
  v_processes jsonb;
  v_owners jsonb;
  v_insights jsonb;
  v_units jsonb;
begin
  v_tenant_id := public._dtw_require_tenant();
  perform public._dtw_seed_twin();
  v_health := public.calculate_digital_twin_health_score();

  select coalesce(jsonb_agg(jsonb_build_object(
    'role_key', r.role_key, 'role_name', r.role_name, 'description', r.description,
    'responsibility_types', r.responsibility_types,
    'escalation_authority', r.escalation_authority, 'knowledge_ownership', r.knowledge_ownership
  ) order by r.role_name), '[]'::jsonb) into v_roles
  from public.digital_twin_roles r where r.tenant_id = v_tenant_id and r.status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'process_key', p.process_key, 'process_name', p.process_name, 'category', p.category,
    'owner_role_id', p.owner_role_id, 'deadline_hours', p.deadline_hours
  ) order by p.process_name), '[]'::jsonb) into v_processes
  from public.digital_twin_process_models p where p.tenant_id = v_tenant_id and p.status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'topic', k.topic, 'topic_key', k.topic_key, 'role_id', k.role_id,
    'confidence', k.confidence,
    'confidence_level', public._dtw_confidence_level(k.confidence),
    'requires_review', k.requires_review
  ) order by k.topic), '[]'::jsonb) into v_owners
  from public.digital_twin_knowledge_owners k where k.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'insight_type', i.insight_type, 'summary', i.summary,
    'confidence', i.confidence, 'status', i.status
  ) order by i.created_at desc), '[]'::jsonb) into v_insights
  from public.digital_twin_insights i where i.tenant_id = v_tenant_id limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', u.id, 'name', u.name, 'unit_type', u.unit_type
  ) order by u.name), '[]'::jsonb) into v_units
  from public.aipify_organization_units u where u.tenant_id = v_tenant_id and u.active limit 20;

  return jsonb_build_object(
    'has_customer', true,
    'twin_health_score', v_health->'twin_health_score',
    'process_coverage', v_health->'process_coverage',
    'knowledge_owners', v_health->'knowledge_owners',
    'low_confidence_count', v_health->'low_confidence_count',
    'roles', v_roles,
    'processes', v_processes,
    'knowledge_routing', v_owners,
    'insights', v_insights,
    'organization_units', v_units,
    'integrations', jsonb_build_object(
      'action_center', 'Task assignment and escalation routing',
      'desktop', 'Notification and reminder prioritization',
      'briefing', 'Department summaries and bottleneck reporting',
      'governance', 'Approver identification and separation of duties',
      'agents', 'Support/Knowledge/Governance agent routing'
    ),
    'implementation_blueprint_phase77', jsonb_build_object(
      'phase', 'Phase 77 — Organizational Digital Twin Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE77_ORGANIZATIONAL_DIGITAL_TWIN.md',
      'engine_phase', 'Phase 77 Digital Twin & Organizational Model Engine',
      'route', '/app/digital-twin',
      'mapping_note', 'ABOS Blueprint Phase 77 aligns with repo Phase 77 — blueprint adds ABOS spec scaffolding on existing engine. Phase numbers align positively.'
    ),
    'organizational_digital_twin_note', 'Organizational Digital Twin Engine (ABOS Phase 77) — extends Digital Twin Phase 77 with organizational visualization, dependency awareness, simulation connection, and live success criteria.',
    'blueprint_distinction_note', public._odtbp_distinction_note(),
    'blueprint_mission', public._odtbp_mission(),
    'blueprint_philosophy', public._odtbp_philosophy(),
    'blueprint_abos_principle', public._odtbp_abos_principle(),
    'blueprint_objectives', public._odtbp_objectives(),
    'digital_twin_definition', public._odtbp_digital_twin_definition(),
    'organizational_mapping', public._odtbp_organizational_mapping(),
    'companion_observations', public._odtbp_companion_observations(),
    'simulation_connection', public._odtbp_simulation_connection(),
    'learning_organization_connection', public._odtbp_learning_organization_connection(),
    'blueprint_self_love_connection', public._odtbp_self_love_connection(),
    'blueprint_leadership_insights', public._odtbp_leadership_insights(),
    'privacy_principles', public._odtbp_privacy_principles(),
    'blueprint_trust_connection', public._odtbp_trust_connection(),
    'blueprint_dogfooding', public._odtbp_dogfooding(),
    'blueprint_integration_links', public._odtbp_integration_links(),
    'engagement_summary', public._odtbp_engagement_summary(v_tenant_id),
    'blueprint_success_criteria', public._odtbp_success_criteria(v_tenant_id),
    'blueprint_vision_phrases', public._odtbp_vision_phrases(),
    'blueprint_privacy_note', 'Organizational digital twin is metadata only — no employee surveillance, individual scoring, or hidden monitoring. Purpose is understanding NOT surveillance.',
    'implementation_blueprint_phase124', public._odtbp124_blueprint_block(v_tenant_id),
    'organizational_digital_twin_phase124_note', 'Enterprise Intelligence Phase 124 — Organizational Digital Twin deepens system relationships, dependency intelligence, simulation workspaces, transformation impact, and Executive Digital Twin Companion on Phase 77 scaffolds. Twin is a mirror — humans decide.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve Phase 77 fields; append Phase 124 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_digital_twin_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_score numeric;
  v_insights int;
  v_engagement jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select metric_value into v_score from public.digital_twin_metrics
  where tenant_id = v_tenant_id and metric_key = 'twin_health_score'
  order by recorded_at desc limit 1;

  select count(*) into v_insights from public.digital_twin_insights
  where tenant_id = v_tenant_id and status = 'open';

  v_engagement := public._odtbp_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'twin_health_score', coalesce(v_score, 70),
    'open_insights', v_insights,
    'philosophy', 'The Twin models responsibilities — not people. Never surveillance.',
    'privacy_note', 'No employee scoring, ranking, or hidden monitoring.',
    'implementation_blueprint_phase77', jsonb_build_object(
      'phase', 'Phase 77 — Organizational Digital Twin Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE77_ORGANIZATIONAL_DIGITAL_TWIN.md',
      'engine_phase', 'Phase 77 Digital Twin & Organizational Model Engine',
      'route', '/app/digital-twin'
    ),
    'blueprint_mission', public._odtbp_mission(),
    'blueprint_abos_principle', public._odtbp_abos_principle(),
    'engagement_summary', v_engagement,
    'blueprint_note', 'Organizational Digital Twin Engine (ABOS Phase 77) — extends Digital Twin Phase 77 with organizational visualization, dependency awareness, and live success criteria.',
    'understanding_note', 'Purpose is understanding NOT surveillance — explore complexity with curiosity.',
    'implementation_blueprint_phase124', jsonb_build_object(
      'phase', 'Phase 124 — Organizational Digital Twin Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE124_ORGANIZATIONAL_DIGITAL_TWIN.md',
      'spec_doc', 'ORGANIZATIONAL_DIGITAL_TWIN_ENGINE_PHASE124.md',
      'engine_phase', 'Phase 77 Digital Twin & Organizational Model Engine',
      'era', 'Enterprise Intelligence Era (121–130)',
      'route', '/app/digital-twin'
    ),
    'phase124_mission', public._odtbp124_mission(),
    'phase124_abos_principle', public._odtbp124_abos_principle(),
    'phase124_engagement_summary', public._odtbp124_engagement_summary(v_tenant_id),
    'phase124_note', 'Enterprise Intelligence Phase 124 deepens organizational twin on Phase 77 — visibility and simulation, not prediction. Metadata only.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._odtbp124_distinction_note() to authenticated;
grant execute on function public._odtbp124_mission() to authenticated;
grant execute on function public._odtbp124_philosophy() to authenticated;
grant execute on function public._odtbp124_abos_principle() to authenticated;
grant execute on function public._odtbp124_objectives() to authenticated;
grant execute on function public._odtbp124_organizational_digital_twin() to authenticated;
grant execute on function public._odtbp124_digital_twin_center() to authenticated;
grant execute on function public._odtbp124_organizational_map_engine() to authenticated;
grant execute on function public._odtbp124_dependency_intelligence() to authenticated;
grant execute on function public._odtbp124_simulation_workspace() to authenticated;
grant execute on function public._odtbp124_transformation_impact_model() to authenticated;
grant execute on function public._odtbp124_knowledge_network_engine() to authenticated;
grant execute on function public._odtbp124_resilience_visualization() to authenticated;
grant execute on function public._odtbp124_executive_digital_twin_companion() to authenticated;
grant execute on function public._odtbp124_companion_limitations() to authenticated;
grant execute on function public._odtbp124_self_love_connection() to authenticated;
grant execute on function public._odtbp124_memory_engine() to authenticated;
grant execute on function public._odtbp124_cross_links() to authenticated;
grant execute on function public._odtbp124_limitation_principles() to authenticated;
grant execute on function public._odtbp124_companion_adaptation() to authenticated;
grant execute on function public._odtbp124_success_metrics() to authenticated;
grant execute on function public._odtbp124_engagement_summary(uuid) to authenticated;
grant execute on function public._odtbp124_success_criteria(uuid) to authenticated;
grant execute on function public._odtbp124_blueprint_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'digital-twin-blueprint-phase124', 'Organizational Digital Twin (Enterprise Phase 124)',
  'Enterprise Intelligence Phase 124 — Organizational Digital Twin deepens Phase 77 with system relationships, dependency intelligence, simulation workspaces, transformation impact, knowledge networks, resilience visualization, and Executive Digital Twin Companion.',
  'authenticated', 116
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'digital-twin-blueprint-phase124' and tenant_id is null
);
