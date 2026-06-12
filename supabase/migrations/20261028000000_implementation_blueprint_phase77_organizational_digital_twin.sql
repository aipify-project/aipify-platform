-- Implementation Blueprint Phase 77 — Organizational Digital Twin Engine
-- Extends Digital Twin & Organizational Model Engine Phase 77. No new tables.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._odtbp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 77 — Organizational Digital Twin Engine at /app/digital-twin. Phase numbers align: repo Phase 77 = ABOS Blueprint Phase 77 (20260616800000_digital_twin_organizational_model_phase77.sql). Blueprint adds ABOS spec scaffolding on the existing engine — not a duplicate route. Distinct from Operational Intelligence Layer Phase 51 (OIL — different tables/prefix at /app/insights). Distinct from Cross-Tenant Intelligence A.71 at /app/cross-tenant-intelligence-engine. Distinct from Simulation Decision Lab Phase 78 / Blueprint Phase 22 at /app/simulations (Twin provides read-only context for simulations — cross-link). Distinct from Scenario Simulation Blueprint Phase 76 at /app/simulations. Distinct from Predictive Operations Blueprint Phase 74 at /app/predictive-insights-engine. Distinct from Cross-Functional Intelligence Phase 70 on OCF A.32 at /app/operations-center-foundation-engine (operational events vs organizational model). Engine helpers use _dtw_* — blueprint Phase 77 MUST use _odtbp_* only. Twin models responsibilities NOT people — no surveillance, no individual scoring.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._odtbp_mission()
returns text language sql immutable as $$
  select 'Strengthen strategic thinking and preparedness through a continuously evolving digital representation of structures, workflows, and relationships.';
$$;

create or replace function public._odtbp_philosophy()
returns text language sql immutable as $$
  select 'Purpose is understanding NOT surveillance — organizations function through relationships, dependencies, and shared responsibilities.';
$$;

create or replace function public._odtbp_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Living systems of people, processes, and relationships. Understanding supports wiser support. Aipify informs and prepares; humans decide.';
$$;

create or replace function public._odtbp_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'organizational_visualization', 'label', 'Organizational visualization', 'description', 'Teams, departments, reporting structures, and strategic initiatives as evolving metadata maps'),
    jsonb_build_object('key', 'systems_understanding', 'label', 'Systems understanding', 'description', 'Workflow dependencies, meeting patterns, and cross-functional relationships — awareness not judgment'),
    jsonb_build_object('key', 'scenario_exploration', 'label', 'Scenario exploration', 'description', 'Read-only organizational context for Simulation Lab — cross-link /app/simulations'),
    jsonb_build_object('key', 'dependency_awareness', 'label', 'Dependency awareness', 'description', 'Key-person dependencies, bottlenecks, and operational concentration — system signals only'),
    jsonb_build_object('key', 'strategic_preparedness', 'label', 'Strategic preparedness', 'description', 'Leadership visibility into resilience, collaboration, and exploration areas'),
    jsonb_build_object('key', 'continuous_learning', 'label', 'Continuous organizational learning', 'description', 'Twin evolves via Meeting Companion, Knowledge Center, initiatives, and approved operational signals')
  );
$$;

create or replace function public._odtbp_digital_twin_definition()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'A Digital Twin represents how the organization works — evolving with the organization.',
    'components', jsonb_build_array(
      jsonb_build_object('key', 'teams_departments', 'label', 'Teams and departments', 'description', 'Structure Twin — organization units and reporting context'),
      jsonb_build_object('key', 'reporting_structures', 'label', 'Reporting structures', 'description', 'Responsibility roles and escalation authority — not individual surveillance'),
      jsonb_build_object('key', 'strategic_initiatives', 'label', 'Strategic initiatives', 'description', 'Initiative and process models linked to organizational goals'),
      jsonb_build_object('key', 'workflow_dependencies', 'label', 'Workflow dependencies', 'description', 'Process steps, escalation paths, and knowledge routing'),
      jsonb_build_object('key', 'meeting_patterns', 'label', 'Meeting patterns', 'description', 'Collaboration metadata from Meeting Companion A.61 — cross-link only'),
      jsonb_build_object('key', 'cross_functional_relationships', 'label', 'Cross-functional relationships', 'description', 'Communication Twin — escalation and notification paths'),
      jsonb_build_object('key', 'operational_bottlenecks', 'label', 'Operational bottlenecks', 'description', 'Twin insights for bottleneck and ownership gap awareness')
    ),
    'boundary_note', 'Twin models responsibilities — never employee scoring, ranking, or hidden monitoring.'
  );
$$;

create or replace function public._odtbp_organizational_mapping()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizational mapping — understand how work flows across functions.',
    'example_chain', jsonb_build_array(
      'Leadership',
      'Sales',
      'Customer Success',
      'Support',
      'Knowledge Center',
      'Product Development'
    ),
    'flow_note', 'Example chain illustrates cross-functional work flow — tenants customize roles, processes, and units in their Twin.',
    'mapping_dimensions', jsonb_build_array(
      jsonb_build_object('key', 'structure', 'label', 'Structure mapping', 'description', 'Departments, teams, and organization units'),
      jsonb_build_object('key', 'responsibility', 'label', 'Responsibility mapping', 'description', 'Process owners, approvers, reviewers, and SMEs'),
      jsonb_build_object('key', 'communication', 'label', 'Communication mapping', 'description', 'Escalation routes and cross-functional collaboration paths'),
      jsonb_build_object('key', 'process', 'label', 'Process mapping', 'description', 'Approval chains, onboarding flows, and incident processes')
    )
  );
$$;

create or replace function public._odtbp_companion_observations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion observations — awareness not judgment. Strengthen collaboration and resilience.',
    'observations', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'key_person_dependencies', 'signal', 'Key-person dependencies may benefit from shared coverage — would a responsibility review help?', 'description', 'Dependency awareness from role and process metadata — not individual evaluation'),
      jsonb_build_object('emoji', '🌹', 'key', 'strengthened_collaboration', 'signal', 'Cross-functional collaboration appears strengthened in this area — shall I summarize connection patterns?', 'description', 'Positive collaboration observations — celebrate collective effort'),
      jsonb_build_object('emoji', '🔔', 'key', 'workflow_resilience', 'signal', 'Workflow resilience may benefit from adjustment — would dependency context help?', 'description', 'Resilience adjustments suggested for human review — never auto-execute')
    ),
    'awareness_note', 'Companion observations encourage exploration — never punitive interpretation.'
  );
$$;

create or replace function public._odtbp_simulation_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Simulation connection — Twin provides read-only organizational context for scenario exploration.',
    'simulation_route', '/app/simulations',
    'example_scenarios', jsonb_build_array(
      jsonb_build_object('key', 'support_demand_doubles', 'label', 'Support demand doubles', 'description', 'Model escalation and knowledge routing under increased load'),
      jsonb_build_object('key', 'international_expansion', 'label', 'International expansion', 'description', 'Explore structure and process changes for new regions'),
      jsonb_build_object('key', 'key_personnel_transitions', 'label', 'Key personnel transitions', 'description', 'Responsibility continuity and handoff context — cross-link Continuity Phase 73'),
      jsonb_build_object('key', 'initiative_resource_changes', 'label', 'Initiative resource changes', 'description', 'Strategic initiative resource allocation scenarios')
    ),
    'boundary_note', 'Simulations never modify production data — Twin context is read-only input for Decision Lab.'
  );
$$;

create or replace function public._odtbp_learning_organization_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Learning organization connection — Twin evolves through approved organizational signals.',
    'evolution_sources', jsonb_build_array(
      jsonb_build_object('key', 'meeting_companion', 'label', 'Meeting Companion A.61', 'description', 'Meeting patterns and collaboration metadata — cross-link /app/meeting-collaboration-intelligence-engine', 'route', '/app/meeting-collaboration-intelligence-engine'),
      jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center A.5', 'description', 'Knowledge ownership and SME routing updates', 'route', '/app/knowledge-center-engine'),
      jsonb_build_object('key', 'strategic_initiatives', 'label', 'Strategic initiatives', 'description', 'Goals and OKR alignment — cross-link Strategic Execution Phase 69', 'route', '/app/goals-okr-engine'),
      jsonb_build_object('key', 'org_changes', 'label', 'Organizational changes', 'description', 'Structure and role updates from approved admin changes'),
      jsonb_build_object('key', 'operational_signals', 'label', 'Approved operational signals', 'description', 'Orchestration and cross-functional events — metadata only')
    ),
    'learning_note', 'Twin learning uses approved metadata only — no raw conversations or PII.'
  );
$$;

create or replace function public._odtbp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — appreciation for collective effort, hidden contributions, sustainable design, and human limitations.',
    'practices', jsonb_build_array(
      'Appreciation for collective effort — teams succeed together',
      'Recognition of hidden contributions — shared responsibilities matter',
      'Sustainable design — distribute load across roles and backup chains',
      'Human limitations — no organization thrives when a few individuals carry everything alone'
    ),
    'journey_phrase', 'No organization thrives when a few individuals carry everything alone.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports sustainable collaboration — principle only; Digital Twin stores organizational metadata, not wellbeing content.'
  );
$$;

create or replace function public._odtbp_leadership_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership insights — resilience summaries, dependency observations, collaboration improvements, and areas for exploration.',
    'insight_types', jsonb_build_array(
      jsonb_build_object('emoji', '📈', 'key', 'resilience_summaries', 'label', 'Resilience summaries', 'description', 'Twin Health Score, process coverage, and ownership completeness aggregates'),
      jsonb_build_object('emoji', '🦉', 'key', 'dependency_observations', 'label', 'Dependency observations', 'description', 'Bottleneck and ownership gap insights — system signals only'),
      jsonb_build_object('emoji', '🌹', 'key', 'collaboration_improvements', 'label', 'Collaboration improvements', 'description', 'Positive cross-functional connection patterns'),
      jsonb_build_object('emoji', '🔔', 'key', 'exploration_areas', 'label', 'Areas for exploration', 'description', 'Knowledge gaps and routing suggestions for human review')
    ),
    'dialogue_note', 'Leadership insights encourage curiosity and preparedness — never surveillance dashboards.'
  );
$$;

create or replace function public._odtbp_privacy_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Privacy principles — strengthen systems, not evaluate personal worth.',
    'forbidden', jsonb_build_array(
      'Employee surveillance or secret monitoring',
      'Individual scoring, ranking, or performance evaluation',
      'Punitive interpretations of dependency patterns',
      'Hidden profiling or behavioral surveillance',
      'Automatic disciplinary recommendations'
    ),
    'required', jsonb_build_array(
      'Twin models responsibilities — not people',
      'Metadata-only organizational signals',
      'Human review before structural changes',
      'Transparent information sources and limitations',
      'Understanding supports wiser support — humans decide'
    ),
    'boundary_note', 'NO employee surveillance. NO individual scoring. Purpose is understanding NOT surveillance.'
  );
$$;

create or replace function public._odtbp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparency about information sources, optional simulations, limitations, and organizational privacy protection.',
    'users_should_see', jsonb_build_array(
      'Which metadata sources feed Twin roles, processes, and insights',
      'Confidence levels on knowledge routing and role assignments',
      'Optional simulation connections — read-only context only',
      'Remaining limitations — Twin is illustrative, not exhaustive',
      'Organizational privacy protection — no individual surveillance'
    ),
    'operators_should_understand', jsonb_build_array(
      'Twin data is metadata only — no raw employee communications',
      'Blueprint scaffolds use _odtbp_* helpers — engine uses _dtw_*',
      'Cross-links Simulation Lab, Meeting Companion, KC, Continuity — distinct storage',
      'Audit trail via digital_twin_audit_log and TACC integration'
    ),
    'audit_note', 'Twin routing, health score calculation, and dashboard access are audited — metadata only.'
  );
$$;

create or replace function public._odtbp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates organizational digital twin patterns internally before customer rollout.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — product ecosystem, Sales Expert operations, leadership structures, organizational growth',
      'focus', jsonb_build_array(
        'Product ecosystem responsibility mapping',
        'Sales Expert operations and escalation paths',
        'Leadership structures and knowledge routing',
        'Organizational growth and process coverage'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce organizational model',
      'focus', jsonb_build_array(
        'Support escalation and knowledge ownership',
        'Cross-functional workflow dependencies',
        'Twin Health and bottleneck awareness',
        'Human-reviewed insight dismissal and acceptance'
      )
    )
  );
$$;

create or replace function public._odtbp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We understand ourselves better than we ever have before.',
    'Explore complexity with curiosity, humility, and discipline.',
    'Understanding supports wiser support.',
    'Living systems of people, processes, and relationships.',
    'Purpose is understanding — not surveillance.'
  );
$$;

create or replace function public._odtbp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Simulation & Decision Lab (Phase 78 / Blueprint 22)', 'route', '/app/simulations', 'note', 'Twin provides read-only context for scenarios — cross-link only'),
    jsonb_build_object('label', 'Scenario Simulation (Blueprint Phase 76)', 'route', '/app/simulations', 'note', 'Scenario exploration — distinct from Twin storage'),
    jsonb_build_object('label', 'Meeting Companion (A.61)', 'route', '/app/meeting-collaboration-intelligence-engine', 'note', 'Meeting patterns feed Twin evolution — cross-link only'),
    jsonb_build_object('label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine', 'note', 'Knowledge ownership and SME routing'),
    jsonb_build_object('label', 'Organizational Memory (A.34)', 'route', '/app/organizational-memory-engine', 'note', 'Historical organizational context — cross-link only'),
    jsonb_build_object('label', 'Executive Operations Center (Phase 75)', 'route', '/app/operations-center-foundation-engine', 'note', 'Executive operational context — cross-link only'),
    jsonb_build_object('label', 'Organizational Continuity (Blueprint Phase 73)', 'route', '/app/continuity', 'note', 'Continuity and succession context — cross-link only'),
    jsonb_build_object('label', 'Predictive Operations (Blueprint Phase 74)', 'route', '/app/predictive-insights-engine', 'note', 'Predictive preparedness — distinct from organizational model'),
    jsonb_build_object('label', 'Cross-Functional Intelligence (Blueprint Phase 70)', 'route', '/app/operations-center-foundation-engine', 'note', 'Operational events vs organizational model — cross-link only'),
    jsonb_build_object('label', 'Operational Intelligence Layer (Phase 51 OIL)', 'route', '/app/insights', 'note', 'Different tables/prefix — distinct from Digital Twin Phase 77'),
    jsonb_build_object('label', 'Cross-Tenant Intelligence (A.71)', 'route', '/app/cross-tenant-intelligence-engine', 'note', 'Platform aggregate intelligence — never mixed with tenant Twin'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Sustainable collaboration — principle only')
  );
$$;

create or replace function public._odtbp_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_roles int := 0;
  v_processes int := 0;
  v_insights int := 0;
  v_open_insights int := 0;
  v_owners int := 0;
  v_metrics int := 0;
  v_health numeric;
begin
  select count(*) into v_roles from public.digital_twin_roles
  where tenant_id = p_tenant_id and status = 'active';

  select count(*) into v_processes from public.digital_twin_process_models
  where tenant_id = p_tenant_id and status = 'active';

  select count(*) into v_insights from public.digital_twin_insights
  where tenant_id = p_tenant_id;

  select count(*) into v_open_insights from public.digital_twin_insights
  where tenant_id = p_tenant_id and status = 'open';

  select count(*) into v_owners from public.digital_twin_knowledge_owners
  where tenant_id = p_tenant_id;

  select count(*) into v_metrics from public.digital_twin_metrics
  where tenant_id = p_tenant_id;

  select metric_value into v_health from public.digital_twin_metrics
  where tenant_id = p_tenant_id and metric_key = 'twin_health_score'
  order by recorded_at desc limit 1;

  return jsonb_build_object(
    'active_roles', coalesce(v_roles, 0),
    'active_processes', coalesce(v_processes, 0),
    'total_insights', coalesce(v_insights, 0),
    'open_insights', coalesce(v_open_insights, 0),
    'knowledge_owners', coalesce(v_owners, 0),
    'metric_records', coalesce(v_metrics, 0),
    'twin_health_score', coalesce(v_health, 0),
    'companion_observations', jsonb_array_length(public._odtbp_companion_observations()->'observations'),
    'objective_count', jsonb_array_length(public._odtbp_objectives()),
    'privacy_note', 'Metadata only — role, process, insight, and metric counts. No individual employee data or PII.'
  );
end; $$;

create or replace function public._odtbp_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_roles int := 0;
  v_processes int := 0;
  v_open_insights int := 0;
  v_health numeric := 0;
begin
  v_engagement := public._odtbp_engagement_summary(p_tenant_id);
  v_roles := coalesce((v_engagement->>'active_roles')::int, 0);
  v_processes := coalesce((v_engagement->>'active_processes')::int, 0);
  v_open_insights := coalesce((v_engagement->>'open_insights')::int, 0);
  v_health := coalesce((v_engagement->>'twin_health_score')::numeric, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'improved_visibility',
      'label', 'Improved visibility — active roles and processes mapped',
      'met', v_roles >= 1 and v_processes >= 1,
      'note', case when v_roles < 1 or v_processes < 1 then 'Seed or configure Twin roles and processes for organizational visibility.' else null end
    ),
    jsonb_build_object(
      'key', 'deeper_leadership_understanding',
      'label', 'Deeper leadership understanding — leadership insights documented',
      'met', jsonb_array_length(public._odtbp_leadership_insights()->'insight_types') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'clearer_dependency_risks',
      'label', 'Clearer dependency risks — companion observations and privacy principles',
      'met', jsonb_array_length(public._odtbp_companion_observations()->'observations') >= 3
        and jsonb_array_length(public._odtbp_privacy_principles()->'forbidden') >= 5,
      'note', 'Dependency awareness — system signals only, never individual scoring.'
    ),
    jsonb_build_object(
      'key', 'stronger_preparedness',
      'label', 'Stronger preparedness — simulation connection documented',
      'met', jsonb_array_length(public._odtbp_simulation_connection()->'example_scenarios') >= 4,
      'note', 'Cross-link /app/simulations for scenario exploration.'
    ),
    jsonb_build_object(
      'key', 'increased_resilience',
      'label', 'Increased resilience — Twin Health tracked',
      'met', v_health >= 50,
      'note', case when v_health < 50 then 'Calculate Twin Health Score to track organizational model completeness.' else null end
    ),
    jsonb_build_object(
      'key', 'organizational_visualization',
      'label', 'Organizational visualization — mapping and definition documented',
      'met', jsonb_array_length(public._odtbp_digital_twin_definition()->'components') >= 7
        and jsonb_array_length(public._odtbp_organizational_mapping()->'example_chain') >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'learning_organization',
      'label', 'Continuous learning — evolution sources cross-linked',
      'met', jsonb_array_length(public._odtbp_learning_organization_connection()->'evolution_sources') >= 5,
      'note', 'Meeting Companion, KC, initiatives, org changes, operational signals.'
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — sustainable collaboration principle',
      'met', (public._odtbp_self_love_connection()->>'journey_phrase') is not null,
      'note', 'No organization thrives when a few individuals carry everything alone.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — sources, limitations, privacy documented',
      'met', jsonb_array_length(public._odtbp_trust_connection()->'users_should_see') >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Integration links — distinct from OIL 51, Cross-Tenant A.71, Simulations',
      'met', jsonb_array_length(public._odtbp_integration_links()) >= 10,
      'note', 'Extend related engines — do not duplicate Twin storage.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Aipify Group product ecosystem and organizational growth',
      'met', (public._odtbp_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS principle — living systems; understanding supports wiser support',
      'met', true,
      'note', 'Humans decide — Twin informs and prepares only.'
    ),
    jsonb_build_object(
      'key', 'insight_awareness',
      'label', 'Insight awareness — open Twin insights surfaced for review',
      'met', v_open_insights >= 0,
      'note', case when v_open_insights >= 1 then 'Review open insights for bottleneck and ownership awareness.' else 'No open insights — Twin model may be healthy or awaiting detection run.' end
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL Phase 77 fields; append Phase 77 blueprint
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
    'blueprint_privacy_note', 'Organizational digital twin is metadata only — no employee surveillance, individual scoring, or hidden monitoring. Purpose is understanding NOT surveillance.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve Phase 77 fields; append Phase 77 blueprint framing
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
    'understanding_note', 'Purpose is understanding NOT surveillance — explore complexity with curiosity.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._odtbp_distinction_note() to authenticated;
grant execute on function public._odtbp_mission() to authenticated;
grant execute on function public._odtbp_philosophy() to authenticated;
grant execute on function public._odtbp_abos_principle() to authenticated;
grant execute on function public._odtbp_objectives() to authenticated;
grant execute on function public._odtbp_digital_twin_definition() to authenticated;
grant execute on function public._odtbp_organizational_mapping() to authenticated;
grant execute on function public._odtbp_companion_observations() to authenticated;
grant execute on function public._odtbp_simulation_connection() to authenticated;
grant execute on function public._odtbp_learning_organization_connection() to authenticated;
grant execute on function public._odtbp_self_love_connection() to authenticated;
grant execute on function public._odtbp_leadership_insights() to authenticated;
grant execute on function public._odtbp_privacy_principles() to authenticated;
grant execute on function public._odtbp_trust_connection() to authenticated;
grant execute on function public._odtbp_dogfooding() to authenticated;
grant execute on function public._odtbp_vision_phrases() to authenticated;
grant execute on function public._odtbp_integration_links() to authenticated;
grant execute on function public._odtbp_engagement_summary(uuid) to authenticated;
grant execute on function public._odtbp_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'digital-twin-blueprint-phase77', 'Organizational Digital Twin Engine (ABOS Phase 77)',
  'Organizational Digital Twin Engine — extends Digital Twin Phase 77 with organizational visualization, dependency awareness, simulation connection, learning organization evolution, companion observations, privacy principles, and live success criteria.',
  'authenticated', 115
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'digital-twin-blueprint-phase77' and tenant_id is null
);
