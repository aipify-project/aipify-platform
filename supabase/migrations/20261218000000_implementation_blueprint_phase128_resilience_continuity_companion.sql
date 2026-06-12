-- Implementation Blueprint Phase 128 — Resilience & Continuity Companion Engine
-- Enterprise Intelligence Era (121–130). Extends Organizational Resilience Engine A.50 + Phase 81 + Phase 91.
-- Helpers: _rccbp128_* (never collide with _rnbp_*, _orrbp91_*, _ore_*).
-- Cross-links Continuity Phase 80, Digital Twin 124, Org Memory 126, Simulations — do NOT duplicate.

-- ---------------------------------------------------------------------------
-- 1. Distinction note (vs Phase 80 Continuity)
-- ---------------------------------------------------------------------------
create or replace function public._rccbp128_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Enterprise Intelligence Phase 128 — Resilience & Continuity Companion Engine at /app/organizational-resilience-engine. Layers on Organizational Resilience Engine A.50 (_ore_*), Blueprint Phase 81 Risk Navigation (_rnbp_*), and Blueprint Phase 91 Organizational Resilience & Recovery (_orrbp91_*). Phase 128 deepens continuity companion support, business continuity orchestration, dependency protection, recovery coordination, and resilience exercises — Phase 81 = navigation/preparedness; Phase 91 = recovery/adversity learning; Phase 128 = continuity companion and intentional resilience (prepare/adapt/recover together). **Distinct from Continuity, Resilience & Crisis Phase 80** at /app/continuity — backup ownership, incident mode, readiness score, crisis briefings (crisis continuity distinct layer). **Distinct from Organizational Continuity Blueprint 73** — cross-link only. Cross-links Digital Twin Phase 124 /app/digital-twin (dependency visibility), Organizational Memory Phase 126 /app/organizational-memory-engine (leadership continuity knowledge), Simulations /app/simulations (exercise cross-link), Transformation Phase 127 /app/change-management-engine, Executive Intelligence Phase 121 /app/executive-intelligence, Decision Intelligence Phase 125 /app/decision-intelligence-engine, Self Love A.76 /app/self-love-engine, Incident Response A.51 /app/incident-response-coordination-engine. Helpers _rccbp128_* only. Prepare/adapt/recover — no panic framing; readiness NOT command; metadata only.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata
-- ---------------------------------------------------------------------------
create or replace function public._rccbp128_mission()
returns text language sql immutable as $$
  select 'Help organizations prepare for, adapt through, and recover from disruption — with continuity planning, dependency awareness, and coordinated recovery that puts people first.';
$$;

create or replace function public._rccbp128_philosophy()
returns text language sql immutable as $$
  select 'Disruption is inevitable — the goal is not to eliminate uncertainty but to prepare, adapt, and recover together. Wisdom before speed. People First. Resilience is intentional, not reactive.';
$$;

create or replace function public._rccbp128_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Resilience & Continuity Companion informs, prepares, and supports continuity readiness; humans lead decisions and emergency response. Readiness not command.';
$$;

create or replace function public._rccbp128_vision()
returns text language sql immutable as $$
  select 'When disruption arrives, the organization is prepared — dependencies visible, roles clear, recovery coordinated, and people supported through adaptation and recovery together.';
$$;

create or replace function public._rccbp128_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'continuity_planning', 'label', 'Continuity planning', 'emoji', '🔔', 'description', 'Structured continuity plans with human approval — metadata via resilience plans'),
    jsonb_build_object('key', 'preparedness', 'label', 'Preparedness', 'emoji', '🦉', 'description', 'Disruption preparedness without panic — complements Phase 81 risk navigation'),
    jsonb_build_object('key', 'reduce_vulnerability', 'label', 'Reduce vulnerability', 'emoji', '🔔', 'description', 'Dependency protection and vulnerability tracking — cross-link Digital Twin 124'),
    jsonb_build_object('key', 'protect_knowledge', 'label', 'Protect knowledge', 'emoji', '🦉', 'description', 'Knowledge protection and continuity library — cross-link Org Memory 126'),
    jsonb_build_object('key', 'coordinated_responses', 'label', 'Coordinated responses', 'emoji', '🔔', 'description', 'Recovery orchestration with communication coordination — humans lead'),
    jsonb_build_object('key', 'adaptability', 'label', 'Adaptability', 'emoji', '🌹', 'description', 'Operational flexibility and alternative workflows during disruption'),
    jsonb_build_object('key', 'recovery_capabilities', 'label', 'Recovery capabilities', 'emoji', '❤️', 'description', 'Recovery checklists, status monitoring, leadership briefings — people not only systems'),
    jsonb_build_object('key', 'long_term_resilience', 'label', 'Long-term resilience', 'emoji', '🦉', 'description', 'Resilience assessment, exercises, and review cycles — intentional not reactive')
  );
$$;

create or replace function public._rccbp128_resilience_center()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'continuity_planning', 'label', 'Continuity planning', 'description', 'Scenario-based continuity plans with review cycles — A.50 resilience plans'),
    jsonb_build_object('key', 'disruption_preparedness', 'label', 'Disruption preparedness', 'description', 'Preparedness resources and readiness scaffolds — no panic framing'),
    jsonb_build_object('key', 'dependency_visibility', 'label', 'Dependency visibility', 'description', 'Critical dependencies and SPOF awareness — cross-link Digital Twin Phase 124'),
    jsonb_build_object('key', 'recovery_coordination', 'label', 'Recovery coordination', 'description', 'Recovery orchestration with priority sequencing and action tracking'),
    jsonb_build_object('key', 'leadership_continuity', 'label', 'Leadership continuity', 'description', 'Succession preparedness and decision continuity — cross-link Org Memory 126'),
    jsonb_build_object('key', 'knowledge_protection', 'label', 'Knowledge protection', 'description', 'Protect critical knowledge from isolation and loss — metadata signals only'),
    jsonb_build_object('key', 'companion_recovery_planning', 'label', 'Companion recovery planning', 'description', 'Companion scaffolds recovery planning for human review — readiness not command'),
    jsonb_build_object('key', 'scenario_exercises', 'label', 'Scenario exercises', 'description', 'Resilience exercise framework — cross-link /app/simulations'),
    jsonb_build_object('key', 'resilience_dashboards', 'label', 'Resilience dashboards', 'description', 'Aggregate resilience indicators — plans, vulnerabilities, simulations, reviews')
  );
$$;

create or replace function public._rccbp128_business_continuity_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'critical_process_id', 'label', 'Critical process identification', 'description', 'Identify critical processes and recovery priorities — metadata in plan continuity_requirements'),
    jsonb_build_object('key', 'recovery_prioritization', 'label', 'Recovery prioritization', 'description', 'Priority sequencing for recovery actions — people and systems balanced'),
    jsonb_build_object('key', 'continuity_plans', 'label', 'Continuity plans', 'description', 'Approved continuity plans with human review workflow'),
    jsonb_build_object('key', 'alternative_workflows', 'label', 'Alternative workflows', 'description', 'Fallback procedures and workflow adaptation scaffolds'),
    jsonb_build_object('key', 'communication_protocols', 'label', 'Communication protocols', 'description', 'Stakeholder communication templates — cross-link Stakeholder Communication A.53'),
    jsonb_build_object('key', 'role_assignments', 'label', 'Role assignments', 'description', 'Clear role assignments and backup coverage — cross-link Digital Twin 124'),
    jsonb_build_object('key', 'escalation_paths', 'label', 'Escalation paths', 'description', 'Structured escalation paths — cross-link Incident Response A.51'),
    jsonb_build_object('key', 'review_cycles', 'label', 'Review cycles', 'description', 'Periodic plan review and exercise outcomes — resilience reviews metadata')
  );
$$;

create or replace function public._rccbp128_resilience_assessment()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'operational_flexibility', 'label', 'Operational flexibility', 'description', 'Ability to adapt workflows during disruption — assessment metadata only'),
    jsonb_build_object('key', 'knowledge_redundancy', 'label', 'Knowledge redundancy', 'description', 'Critical knowledge documented and shared — cross-link Org Memory 126'),
    jsonb_build_object('key', 'leadership_continuity', 'label', 'Leadership continuity', 'description', 'Decision continuity and succession preparedness signals'),
    jsonb_build_object('key', 'companion_dependence', 'label', 'Companion dependence', 'description', 'Awareness of companion overdependence — cross-link Marketplace 113'),
    jsonb_build_object('key', 'governance_strength', 'label', 'Governance strength', 'description', 'Governance frameworks and policy resilience — cross-link Governance A.14'),
    jsonb_build_object('key', 'gp_diversity', 'label', 'GP diversity', 'description', 'Growth Partner ecosystem diversity — cross-link GP Operations 114'),
    jsonb_build_object('key', 'learning_capacity', 'label', 'Learning capacity', 'description', 'Organizational learning from exercises and reviews — cross-link Aipify University 115'),
    jsonb_build_object('key', 'community_support', 'label', 'Community support networks', 'description', 'Community collective success patterns — cross-link Phase 117')
  );
$$;

create or replace function public._rccbp128_dependency_protection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Dependency protection — surface systemic vulnerabilities without punitive individual scoring.',
    'digital_twin_route', '/app/digital-twin',
    'examples', jsonb_build_array(
      jsonb_build_object('key', 'spof', 'label', 'Single points of failure', 'description', 'Critical dependencies with no fallback — cross-link Digital Twin 124 dependency model'),
      jsonb_build_object('key', 'undocumented_responsibilities', 'label', 'Undocumented responsibilities', 'description', 'Role knowledge held only in experience — documentation gap awareness'),
      jsonb_build_object('key', 'companion_overdependence', 'label', 'Companion overdependence', 'description', 'Operational reliance on companion coverage without human backup'),
      jsonb_build_object('key', 'leadership_bottlenecks', 'label', 'Leadership bottlenecks', 'description', 'Decision authority concentration — leadership continuity risk'),
      jsonb_build_object('key', 'critical_vendor_dependence', 'label', 'Critical vendor dependence', 'description', 'Third-party and integration dependencies — metadata signals only'),
      jsonb_build_object('key', 'knowledge_isolation', 'label', 'Knowledge isolation', 'description', 'Critical knowledge siloed in teams or individuals — cross-link Org Memory 126')
    ),
    'boundary_note', 'Protection signals aggregate patterns — never employee surveillance or individual blame.'
  );
$$;

create or replace function public._rccbp128_recovery_orchestration()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'action_tracking', 'label', 'Action tracking', 'description', 'Track recovery actions and ownership — metadata via plan and review workflows'),
    jsonb_build_object('key', 'priority_sequencing', 'label', 'Priority sequencing', 'description', 'Sequence recovery priorities — people first, not systems only'),
    jsonb_build_object('key', 'communication_coordination', 'label', 'Communication coordination', 'description', 'Coordinate stakeholder updates — cross-link Stakeholder Communication A.53'),
    jsonb_build_object('key', 'resource_visibility', 'label', 'Resource visibility', 'description', 'Resource and capacity visibility during recovery — aggregate metadata'),
    jsonb_build_object('key', 'recovery_checklists', 'label', 'Recovery checklists', 'description', 'Structured recovery checklists for human-led execution'),
    jsonb_build_object('key', 'status_monitoring', 'label', 'Status monitoring', 'description', 'Recovery status monitoring — dashboard aggregates only'),
    jsonb_build_object('key', 'leadership_briefings', 'label', 'Leadership briefings', 'description', 'Executive recovery briefings — cross-link Executive Intelligence 121')
  );
$$;

create or replace function public._rccbp128_resilience_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'continuity_guidance', 'label', 'Continuity guidance', 'description', 'Guide continuity planning and review — readiness not command'),
    jsonb_build_object('key', 'preparedness_resources', 'label', 'Preparedness resources', 'description', 'Surface approved preparedness guides from continuity knowledge library'),
    jsonb_build_object('key', 'response_procedure_summaries', 'label', 'Response procedure summaries', 'description', 'Summarize approved response procedures — metadata only'),
    jsonb_build_object('key', 'critical_dependencies', 'label', 'Critical dependencies', 'description', 'Highlight dependency risks for review — cross-link Digital Twin 124'),
    jsonb_build_object('key', 'learning_exercises', 'label', 'Learning exercises', 'description', 'Suggest resilience exercises — cross-link /app/simulations'),
    jsonb_build_object('key', 'recovery_communication', 'label', 'Recovery communication', 'description', 'Scaffold recovery communication templates for human approval')
  );
$$;

create or replace function public._rccbp128_leadership_continuity()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership continuity — succession preparedness and strategic memory retention without replacing human judgment.',
    'org_memory_route', '/app/organizational-memory-engine',
    'supports', jsonb_build_array(
      jsonb_build_object('key', 'succession_preparedness', 'label', 'Succession preparedness', 'description', 'Role transition planning scaffolds — cross-link Org Memory Phase 126'),
      jsonb_build_object('key', 'decision_continuity', 'label', 'Decision continuity', 'description', 'Preserve decision context metadata for leadership handoffs'),
      jsonb_build_object('key', 'executive_knowledge_preservation', 'label', 'Executive knowledge preservation', 'description', 'Executive knowledge protection — metadata summaries only'),
      jsonb_build_object('key', 'governance_alignment', 'label', 'Governance alignment', 'description', 'Align continuity with governance frameworks — cross-link Phase 123'),
      jsonb_build_object('key', 'role_transition_planning', 'label', 'Role transition planning', 'description', 'Structured role transition prep — humans lead handoffs'),
      jsonb_build_object('key', 'strategic_memory_retention', 'label', 'Strategic memory retention', 'description', 'Strategic memory cross-link Org Memory 126 — never duplicate OME RPCs')
    ),
    'boundary_note', 'Leadership continuity scaffolds preparation — emergency leadership retains authority.'
  );
$$;

create or replace function public._rccbp128_resilience_exercise_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Resilience exercise framework — practice readiness without panic; cross-link Simulation Lab.',
    'simulations_route', '/app/simulations',
    'exercise_types', jsonb_build_array(
      jsonb_build_object('key', 'scenario_reviews', 'label', 'Scenario reviews', 'description', 'Structured scenario review exercises — A.50 resilience simulations metadata'),
      jsonb_build_object('key', 'recovery_simulations', 'label', 'Recovery simulations', 'description', 'Recovery path simulations — tabletop and walkthrough records'),
      jsonb_build_object('key', 'communication_drills', 'label', 'Communication drills', 'description', 'Stakeholder communication drill scaffolds'),
      jsonb_build_object('key', 'leadership_tabletop', 'label', 'Leadership tabletop', 'description', 'Executive tabletop exercises — cross-link Executive Intelligence 121'),
      jsonb_build_object('key', 'knowledge_continuity_reviews', 'label', 'Knowledge continuity reviews', 'description', 'Review critical knowledge coverage — cross-link Org Memory 126'),
      jsonb_build_object('key', 'governance_stress_tests', 'label', 'Governance stress tests', 'description', 'Governance framework stress tests — cross-link Governance A.14')
    ),
    'exercise_note', 'Exercises build readiness — A.50 simulation RPCs preserved; Phase 128 adds exercise framework scaffolding only.'
  );
$$;

create or replace function public._rccbp128_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'no_panic', 'label', 'No panic framing', 'description', 'Never create alarm or panic — preparedness with calm transparency'),
    jsonb_build_object('key', 'no_guaranteed_outcomes', 'label', 'No guaranteed outcomes', 'description', 'Never promise recovery timelines or guaranteed results'),
    jsonb_build_object('key', 'no_overriding_leadership', 'label', 'No overriding emergency leadership', 'description', 'Never override designated emergency leadership or crisis command'),
    jsonb_build_object('key', 'no_replacing_professionals', 'label', 'No replacing crisis professionals', 'description', 'Never replace crisis professionals, legal counsel, or emergency services'),
    jsonb_build_object('key', 'no_suppressing_uncertainty', 'label', 'No suppressing uncertainty', 'description', 'Never suppress legitimate uncertainty — honest acknowledgment required')
  );
$$;

create or replace function public._rccbp128_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love in resilience — empathy, psychological safety, healthy recovery pace, supportive leadership, recognition of effort, collective care.',
    'practices', jsonb_build_array(
      jsonb_build_object('key', 'empathy', 'label', 'Empathy', 'description', 'Compassionate acknowledgment during disruption and recovery'),
      jsonb_build_object('key', 'psychological_safety', 'label', 'Psychological safety', 'description', 'Safe environment for honest recovery reflection'),
      jsonb_build_object('key', 'healthy_recovery_pace', 'label', 'Healthy recovery pace', 'description', 'Sustainable pace — no pressure to recover before teams are ready'),
      jsonb_build_object('key', 'supportive_leadership', 'label', 'Supportive leadership', 'description', 'Leadership models care and sustainable workload'),
      jsonb_build_object('key', 'recognition_of_effort', 'label', 'Recognition of effort', 'description', 'Recognize collective effort during disruption — not performative scoring'),
      jsonb_build_object('key', 'collective_care', 'label', 'Collective care', 'description', 'Collective care practices — cross-link Self Love A.76')
    ),
    'route', '/app/self-love-engine',
    'phase', 'A.76',
    'journey_phrase', 'Prepare together, adapt with care, recover at a human pace — resilience is collective.'
  );
$$;

create or replace function public._rccbp128_continuity_knowledge_library()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'continuity_plans', 'label', 'Continuity plans', 'description', 'Approved continuity plan metadata — A.50 resilience plans'),
    jsonb_build_object('key', 'preparedness_guides', 'label', 'Preparedness guides', 'description', 'Preparedness resource scaffolds for review'),
    jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned', 'description', 'Post-exercise and post-event lessons — metadata via resilience reviews'),
    jsonb_build_object('key', 'recovery_playbooks', 'label', 'Recovery playbooks', 'description', 'Recovery playbook scaffolds — human-approved only'),
    jsonb_build_object('key', 'communication_templates', 'label', 'Communication templates', 'description', 'Stakeholder communication templates for disruption'),
    jsonb_build_object('key', 'exercise_outcomes', 'label', 'Exercise outcomes', 'description', 'Resilience exercise outcome metadata — simulation records'),
    jsonb_build_object('key', 'governance_frameworks', 'label', 'Governance frameworks', 'description', 'Continuity governance framework references — cross-link Governance A.14')
  );
$$;

create or replace function public._rccbp128_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'transformation_127', 'label', 'Transformation Orchestration Phase 127', 'route', '/app/change-management-engine', 'note', 'Organizational transformation during recovery — cross-link only'),
    jsonb_build_object('key', 'executive_intelligence_121', 'label', 'Executive Intelligence Phase 121', 'route', '/app/executive-intelligence', 'note', 'Leadership briefings and executive continuity'),
    jsonb_build_object('key', 'decision_intelligence_125', 'label', 'Decision Intelligence Phase 125', 'route', '/app/decision-intelligence-engine', 'note', 'Decision support during disruption — cross-link only'),
    jsonb_build_object('key', 'continuity_phase80', 'label', 'Continuity Phase 80', 'route', '/app/continuity', 'note', 'Crisis continuity distinct layer — backup ownership, incident mode'),
    jsonb_build_object('key', 'continuity_blueprint_73', 'label', 'Organizational Continuity Blueprint 73', 'route', '/app/continuity', 'note', 'Succession and continuity planning cross-link'),
    jsonb_build_object('key', 'digital_twin_124', 'label', 'Digital Twin Phase 124', 'route', '/app/digital-twin', 'note', 'Dependency visibility and responsibility model'),
    jsonb_build_object('key', 'org_memory_126', 'label', 'Organizational Memory Phase 126', 'route', '/app/organizational-memory-engine', 'note', 'Leadership continuity and knowledge protection'),
    jsonb_build_object('key', 'simulations', 'label', 'Simulation Lab', 'route', '/app/simulations', 'note', 'Resilience exercise cross-link — do not duplicate simulation RPCs'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Empathy, psychological safety, collective care'),
    jsonb_build_object('key', 'incident_response', 'label', 'Incident Response A.51', 'route', '/app/incident-response-coordination-engine', 'note', 'Coordinated incident response — distinct from continuity companion'),
    jsonb_build_object('key', 'risk_navigation_81', 'label', 'Risk Navigation Phase 81', 'route', '/app/organizational-resilience-engine', 'note', 'Navigation/preparedness — preserved on same route'),
    jsonb_build_object('key', 'recovery_91', 'label', 'Recovery Blueprint Phase 91', 'route', '/app/organizational-resilience-engine', 'note', 'Recovery/adversity learning — preserved on same route'),
    jsonb_build_object('key', 'resilience_abos', 'label', 'ABOS Resilience Engine / RESILIENCE_ENGINE.md', 'route', '/app/organizational-resilience-engine', 'note', 'A.50 baseline — plans, simulations, vulnerabilities, reviews')
  );
$$;

create or replace function public._rccbp128_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Resilience & Continuity Companion — readiness not command; prepare/adapt/recover without panic or crisis override.',
    'must_never', public._rccbp128_companion_limitations(),
    'forbidden', jsonb_build_array(
      'Panic framing or alarmist disruption messaging',
      'Guaranteed recovery outcomes or predictable timelines',
      'Overriding designated emergency leadership or crisis command',
      'Replacing crisis professionals, legal counsel, or emergency services',
      'Suppressing legitimate uncertainty or minimizing disruption impact',
      'Duplicating Continuity Phase 80 incident mode or crisis briefings',
      'Duplicating A.50 plan/simulation RPCs — extend metadata scaffolding only'
    ),
    'required', jsonb_build_array(
      'Metadata summaries only in dashboard RPC payloads',
      'Human approval for continuity plans and recovery actions',
      'Transparent dependency signals — explain why context appears',
      'People-first recovery coordination — not systems-only focus',
      'Preserve all A.50 + Phase 81 + Phase 91 dashboard fields',
      'Cross-link Digital Twin, Org Memory, Simulations — never duplicate storage'
    ),
    'boundary_note', 'Wisdom before speed. People First. Resilience intentional not reactive — humans decide; Aipify informs and prepares.'
  );
$$;

create or replace function public._rccbp128_companion_adaptation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Resilience Companion — continuity guidance, preparedness resources, response summaries, critical dependencies, learning exercises, recovery communication. Readiness NOT command.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'continuity_review', 'prompt', 'Your continuity plan is due for review — shall Aipify prepare a summary of dependencies and open vulnerabilities for leadership?', 'consideration', 'Preparedness not panic — metadata summary only'),
      jsonb_build_object('emoji', '🔔', 'key', 'dependency_awareness', 'prompt', 'A critical dependency may need attention — would reviewing the Digital Twin summary help continuity planning?', 'consideration', 'Cross-link Digital Twin 124 — systemic signals only'),
      jsonb_build_object('emoji', '🌹', 'key', 'exercise_suggestion', 'prompt', 'A tabletop exercise could strengthen readiness — shall Aipify outline exercise options for review?', 'consideration', 'Cross-link Simulations — humans schedule exercises'),
      jsonb_build_object('emoji', '❤️', 'key', 'recovery_coordination', 'prompt', 'Recovery actions may benefit from priority sequencing — would a recovery checklist scaffold help the team?', 'consideration', 'People first — humans lead recovery pace')
    ),
    'boundary_note', 'Companion supports readiness — never commands, never overrides emergency leadership, never guarantees outcomes.'
  );
$$;

create or replace function public._rccbp128_success_metrics()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'continuity_readiness', 'label', 'Continuity readiness'),
    jsonb_build_object('key', 'preparedness_maturity', 'label', 'Preparedness maturity'),
    jsonb_build_object('key', 'vulnerability_reduction', 'label', 'Vulnerability reduction'),
    jsonb_build_object('key', 'knowledge_protection', 'label', 'Knowledge protection coverage'),
    jsonb_build_object('key', 'coordinated_response', 'label', 'Coordinated response capability'),
    jsonb_build_object('key', 'adaptability_index', 'label', 'Adaptability index'),
    jsonb_build_object('key', 'recovery_capability', 'label', 'Recovery capability'),
    jsonb_build_object('key', 'long_term_resilience', 'label', 'Long-term resilience strength')
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Engagement summary + success criteria
-- ---------------------------------------------------------------------------
create or replace function public._rccbp128_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_phase91 jsonb;
  v_active_plans int := 0;
  v_open_vulnerabilities int := 0;
  v_completed_simulations int := 0;
  v_completed_reviews int := 0;
begin
  v_phase91 := public._orrbp91_engagement_summary(p_organization_id);

  select count(*) into v_active_plans
  from public.resilience_plans
  where organization_id = p_organization_id and status = 'active';

  select count(*) into v_open_vulnerabilities
  from public.resilience_vulnerabilities
  where organization_id = p_organization_id and status in ('open', 'mitigating');

  select count(*) into v_completed_simulations
  from public.resilience_simulations
  where organization_id = p_organization_id and status = 'completed';

  select count(*) into v_completed_reviews
  from public.resilience_reviews where organization_id = p_organization_id;

  return v_phase91 || jsonb_build_object(
    'objectives_count', jsonb_array_length(public._rccbp128_objectives()),
    'resilience_center_capabilities', jsonb_array_length(public._rccbp128_resilience_center()),
    'business_continuity_includes', jsonb_array_length(public._rccbp128_business_continuity_engine()),
    'resilience_assessment_areas', jsonb_array_length(public._rccbp128_resilience_assessment()),
    'dependency_protection_examples', jsonb_array_length(public._rccbp128_dependency_protection()->'examples'),
    'recovery_orchestration_capabilities', jsonb_array_length(public._rccbp128_recovery_orchestration()),
    'resilience_companion_supports', jsonb_array_length(public._rccbp128_resilience_companion()),
    'leadership_continuity_supports', jsonb_array_length(public._rccbp128_leadership_continuity()->'supports'),
    'resilience_exercise_types', jsonb_array_length(public._rccbp128_resilience_exercise_framework()->'exercise_types'),
    'companion_limitations_count', jsonb_array_length(public._rccbp128_companion_limitations()),
    'continuity_library_assets', jsonb_array_length(public._rccbp128_continuity_knowledge_library()),
    'cross_links_count', jsonb_array_length(public._rccbp128_cross_links()),
    'success_metrics_count', jsonb_array_length(public._rccbp128_success_metrics()),
    'phase128_active_plans', v_active_plans,
    'phase128_open_vulnerabilities', v_open_vulnerabilities,
    'phase128_completed_simulations', v_completed_simulations,
    'phase128_completed_reviews', v_completed_reviews,
    'privacy_note', 'Enterprise Intelligence Phase 128 — aggregate counts only. No PII, no panic framing, no crisis command. Humans lead; Aipify prepares.'
  );
end; $$;

create or replace function public._rccbp128_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_active_plans int := 0;
  v_completed_simulations int := 0;
begin
  v_engagement := public._rccbp128_engagement_summary(p_organization_id);
  v_active_plans := coalesce((v_engagement->>'phase128_active_plans')::int, 0);
  v_completed_simulations := coalesce((v_engagement->>'phase128_completed_simulations')::int, 0);

  return jsonb_build_array(
    jsonb_build_object('key', 'objectives', 'label', 'Eight Enterprise Intelligence objectives documented', 'met', jsonb_array_length(public._rccbp128_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'resilience_center', 'label', 'Resilience Center — nine capabilities', 'met', jsonb_array_length(public._rccbp128_resilience_center()) = 9, 'note', null),
    jsonb_build_object('key', 'business_continuity', 'label', 'Business continuity engine — eight includes', 'met', jsonb_array_length(public._rccbp128_business_continuity_engine()) = 8, 'note', null),
    jsonb_build_object('key', 'resilience_assessment', 'label', 'Resilience assessment — eight areas', 'met', jsonb_array_length(public._rccbp128_resilience_assessment()) = 8, 'note', null),
    jsonb_build_object('key', 'dependency_protection', 'label', 'Dependency protection — six examples (Digital Twin 124 cross-link)', 'met', jsonb_array_length(public._rccbp128_dependency_protection()->'examples') = 6, 'note', 'Systemic signals — not individual scoring.'),
    jsonb_build_object('key', 'recovery_orchestration', 'label', 'Recovery orchestration — seven capabilities', 'met', jsonb_array_length(public._rccbp128_recovery_orchestration()) = 7, 'note', 'People first — not systems only.'),
    jsonb_build_object('key', 'resilience_companion', 'label', 'Resilience Companion — six supports (readiness not command)', 'met', jsonb_array_length(public._rccbp128_resilience_companion()) = 6, 'note', null),
    jsonb_build_object('key', 'leadership_continuity', 'label', 'Leadership continuity — six supports (Org Memory 126 cross-link)', 'met', jsonb_array_length(public._rccbp128_leadership_continuity()->'supports') = 6, 'note', null),
    jsonb_build_object('key', 'exercise_framework', 'label', 'Resilience exercise framework — six types (Simulations cross-link)', 'met', jsonb_array_length(public._rccbp128_resilience_exercise_framework()->'exercise_types') = 6, 'note', 'Do not duplicate A.50 simulation RPCs.'),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — five never rules', 'met', jsonb_array_length(public._rccbp128_companion_limitations()) = 5, 'note', 'No panic, no guaranteed outcomes, no overriding leadership.'),
    jsonb_build_object('key', 'continuity_library', 'label', 'Continuity knowledge library — seven assets', 'met', jsonb_array_length(public._rccbp128_continuity_knowledge_library()) = 7, 'note', null),
    jsonb_build_object('key', 'cross_links', 'label', 'Mandatory cross-links documented', 'met', jsonb_array_length(public._rccbp128_cross_links()) >= 12, 'note', null),
    jsonb_build_object('key', 'success_metrics', 'label', 'Success metrics — eight documented', 'met', jsonb_array_length(public._rccbp128_success_metrics()) = 8, 'note', null),
    jsonb_build_object('key', 'phase81_preserved', 'label', 'Blueprint Phase 81 _rnbp_* fields preserved', 'met', jsonb_array_length(public._rnbp_objectives()) >= 6, 'note', 'Phase 128 layers on Phase 81 — does not replace.'),
    jsonb_build_object('key', 'phase91_preserved', 'label', 'Blueprint Phase 91 _orrbp91_* fields preserved', 'met', jsonb_array_length(public._orrbp91_objectives()) >= 6, 'note', 'Phase 128 layers on Phase 91 — does not replace.'),
    jsonb_build_object('key', 'operational_continuity', 'label', 'Active continuity plans or completed exercises', 'met', v_active_plans >= 1 or v_completed_simulations >= 1, 'note', case when v_active_plans < 1 and v_completed_simulations < 1 then 'Approve resilience plans or record simulations to validate continuity workflow.' else null end),
    jsonb_build_object('key', 'distinction', 'label', 'Phase 128 vs Phase 80 Continuity distinction documented', 'met', position('Phase 80' in public._rccbp128_distinction_note()) > 0, 'note', public._rccbp128_distinction_note())
  );
end; $$;

create or replace function public._rccbp128_blueprint_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'phase', '128',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE128_RESILIENCE_CONTINUITY_COMPANION.md',
    'spec_doc', 'RESILIENCE_CONTINUITY_COMPANION_ENGINE_PHASE128.md',
    'engine_phase', 'A.50 Organizational Resilience Engine / ABOS Resilience Engine',
    'era', 'Enterprise Intelligence Era (121–130)',
    'route', '/app/organizational-resilience-engine',
    'distinction_note', public._rccbp128_distinction_note(),
    'mission', public._rccbp128_mission(),
    'philosophy', public._rccbp128_philosophy(),
    'abos_principle', public._rccbp128_abos_principle(),
    'vision', public._rccbp128_vision(),
    'objectives', public._rccbp128_objectives(),
    'resilience_center', public._rccbp128_resilience_center(),
    'business_continuity_engine', public._rccbp128_business_continuity_engine(),
    'resilience_assessment', public._rccbp128_resilience_assessment(),
    'dependency_protection', public._rccbp128_dependency_protection(),
    'recovery_orchestration', public._rccbp128_recovery_orchestration(),
    'resilience_companion', public._rccbp128_resilience_companion(),
    'leadership_continuity', public._rccbp128_leadership_continuity(),
    'resilience_exercise_framework', public._rccbp128_resilience_exercise_framework(),
    'companion_limitations', public._rccbp128_companion_limitations(),
    'self_love_connection', public._rccbp128_self_love_connection(),
    'continuity_knowledge_library', public._rccbp128_continuity_knowledge_library(),
    'cross_links', public._rccbp128_cross_links(),
    'limitation_principles', public._rccbp128_limitation_principles(),
    'companion_adaptation', public._rccbp128_companion_adaptation(),
    'success_metrics', public._rccbp128_success_metrics(),
    'success_criteria', public._rccbp128_success_criteria(p_organization_id),
    'engagement_summary', public._rccbp128_engagement_summary(p_organization_id),
    'privacy_note', 'Enterprise Intelligence Phase 128 — metadata only. Prepare/adapt/recover — no panic framing, no crisis command. Humans lead; Aipify prepares.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Dashboard RPC — preserve ALL A.50 + Phase 81 + Phase 91 fields; append Phase 128
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_resilience_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('resilience.view');
  v_org_id := public._mta_require_organization();
  perform public._ore_seed_plans(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'purpose', 'Help organizations remain stable, adaptive, and effective during disruption, uncertainty, and crisis.',
    'philosophy', 'Resilience means recovering, adapting, and growing through difficulty — not the absence of difficulty.',
    'mission', 'Strengthen resilience through preparation, response, recovery, and learning.',
    'abos_principle', 'Strength is revealed in difficult moments — navigate with confidence, compassion, and clarity.',
    'vision', 'A steady companion when circumstances are not — rising again, not never falling.',
    'principles', jsonb_build_array(
      'Preparedness',
      'Operational continuity',
      'Role clarity',
      'Structured recovery',
      'Continuous learning',
      'Audit accountability'
    ),
    'resilience_dimensions', jsonb_build_array(
      jsonb_build_object(
        'key', 'operational',
        'label', 'Operational',
        'examples', jsonb_build_array(
          'Critical process continuity and fallback procedures',
          'Service recovery priorities during disruption',
          'Integration and workflow redundancy'
        )
      ),
      jsonb_build_object(
        'key', 'knowledge',
        'label', 'Knowledge',
        'examples', jsonb_build_array(
          'Documented procedures and approved playbooks',
          'Role clarity and escalation paths',
          'Institutional memory capture after events'
        )
      ),
      jsonb_build_object(
        'key', 'human',
        'label', 'Human',
        'examples', jsonb_build_array(
          'Team capacity and backup role assignments',
          'Recovery periods after intense response',
          'Sustainable workload during prolonged disruption'
        )
      ),
      jsonb_build_object(
        'key', 'customer',
        'label', 'Customer',
        'examples', jsonb_build_array(
          'Communication during disruption',
          'Service expectations and status transparency',
          'Coordinated customer-facing updates'
        )
      ),
      jsonb_build_object(
        'key', 'strategic',
        'label', 'Strategic',
        'examples', jsonb_build_array(
          'Priority decisions during crisis',
          'Adaptation choices under uncertainty',
          'Long-term recovery and capability rebuilding'
        )
      )
    ),
    'crisis_support_guidance', 'During disruption, Aipify surfaces relevant information, approved procedures, and clear next steps — coordinating response while humans lead decisions.',
    'crisis_examples', jsonb_build_array(
      'Here is what we know and what we are doing next.',
      'These are the approved procedures for this scenario.',
      'Human leadership retains decision authority — Aipify coordinates and informs.',
      'Roles and escalation paths are visible — reducing confusion during uncertainty.'
    ),
    'self_love_note', 'Self Love (A.76) supports recovery periods, overload detection, post-event reflection, celebrating progress, and sustainable adjustments — never pressure or guilt during crisis recovery.',
    'growth_evolution_note', 'Growth & Evolution (A.81) integrates post-adversity lessons learned, improvements, capabilities strengthened, and wisdom from difficulty — at /app/growth-evolution-engine.',
    'trust_engine_note', 'Trust Engine (Phase 76) provides calm, transparent, honest communication during uncertainty — explainability at /app/trust.',
    'continuity_phase80_note', 'Continuity, Resilience & Crisis (Phase 80) at /app/continuity handles backup ownership, incident mode, readiness score, and crisis briefings — complements A.50 scenario planning.',
    'distinction_note', 'ABOS Resilience Engine maps to Organizational Resilience Engine A.50 at /app/organizational-resilience-engine — not a new route. Distinct from Phase 80 Continuity (/app/continuity), Organizational Health A.56 (/app/organizational-health-engine), and Growth & Evolution A.81 (/app/growth-evolution-engine).',
    'integration_links', jsonb_build_array(
      jsonb_build_object(
        'label', 'Continuity, Resilience & Crisis (Phase 80)',
        'route', '/app/continuity',
        'description', 'Backup ownership, incident mode, readiness score — complements scenario planning.'
      ),
      jsonb_build_object(
        'label', 'Growth & Evolution Engine (A.81)',
        'route', '/app/growth-evolution-engine',
        'description', 'Post-adversity learning cycles, lessons learned, and capability strengthening.'
      ),
      jsonb_build_object(
        'label', 'Trust Engine (Phase 76)',
        'route', '/app/trust',
        'description', 'Calm, transparent, honest communication during uncertainty.'
      ),
      jsonb_build_object(
        'label', 'Organizational Health (A.56)',
        'route', '/app/organizational-health-engine',
        'description', 'Aggregate health indicators — distinct from resilience planning.'
      ),
      jsonb_build_object(
        'label', 'Incident Response Coordination (A.51)',
        'route', '/app/incident-response-coordination-engine',
        'description', 'Coordinated incident response with ownership and escalation.'
      )
    ),
    'summary', jsonb_build_object(
      'total_plans', coalesce((
        select count(*) from public.resilience_plans where organization_id = v_org_id
      ), 0),
      'active_plans', coalesce((
        select count(*) from public.resilience_plans
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'draft_plans', coalesce((
        select count(*) from public.resilience_plans
        where organization_id = v_org_id and status = 'draft'
      ), 0),
      'open_vulnerabilities', coalesce((
        select count(*) from public.resilience_vulnerabilities
        where organization_id = v_org_id and status in ('open', 'mitigating')
      ), 0),
      'completed_simulations', coalesce((
        select count(*) from public.resilience_simulations
        where organization_id = v_org_id and status = 'completed'
      ), 0),
      'pending_reviews', coalesce((
        select count(*) from public.resilience_plans
        where organization_id = v_org_id and status = 'under_review'
      ), 0)
    ),
    'plans', coalesce((
      select jsonb_agg(row_to_json(rp) order by rp.created_at desc)
      from public.resilience_plans rp where rp.organization_id = v_org_id
    ), '[]'::jsonb),
    'simulations', coalesce((
      select jsonb_agg(row_to_json(rs) order by rs.created_at desc)
      from public.resilience_simulations rs where rs.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'vulnerabilities', coalesce((
      select jsonb_agg(row_to_json(rv) order by rv.created_at desc)
      from public.resilience_vulnerabilities rv where rv.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'reviews', coalesce((
      select jsonb_agg(row_to_json(rr) order by rr.review_date desc)
      from public.resilience_reviews rr where rr.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'executive_summary', public._ore_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'security_trust', 'Extends Security & Trust (A.18) with vulnerability tracking',
      'operations_center', 'Aligns with Operations Center Foundation (A.32) event context',
      'executive_insights', 'Executive summary via get_resilience_executive_summary() — A.35',
      'organizational_memory', 'Review completion may capture lessons learned — metadata only (A.34)',
      'continuous_improvement', 'Findings scaffold improvement workflow (A.33)'
    ),
    'integration_summaries', jsonb_build_object(
      'security', public._ore_security_summary(v_org_id),
      'operations', public._ore_operations_summary(v_org_id),
      'memory', public._ore_memory_summary(v_org_id),
      'improvement', public._ore_improvement_summary(v_org_id)
    ),
    'implementation_blueprint_phase81', jsonb_build_object(
      'phase', 'Phase 81 — Risk Navigation Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE81_RISK_NAVIGATION.md',
      'engine_phase', 'A.50 Organizational Resilience Engine / ABOS Resilience Engine',
      'route', '/app/organizational-resilience-engine',
      'mapping_note', 'ABOS Blueprint Phase 81 extends A.50 with risk awareness, preparedness planning, balanced decision-making, companion guidance, limitation principles, and live success criteria. Distinct from Strategic Intelligence repo Phase 81 at /app/strategy (phase number collision).'
    ),
    'risk_navigation_engine_note', 'Risk Navigation Engine (ABOS Phase 81) — navigate uncertainty with preparedness not alarm; strengthens resilience through balanced risk awareness and confident decision-making.',
    'blueprint_distinction_note', public._rnbp_distinction_note(),
    'blueprint_mission', public._rnbp_mission(),
    'blueprint_philosophy', public._rnbp_philosophy(),
    'blueprint_abos_principle', public._rnbp_abos_principle(),
    'blueprint_objectives', public._rnbp_objectives(),
    'risk_categories', public._rnbp_risk_categories(),
    'risk_questions', public._rnbp_risk_questions(),
    'companion_guidance', public._rnbp_companion_guidance(),
    'risk_preparedness', public._rnbp_risk_preparedness(),
    'risk_opportunity_balance', public._rnbp_risk_opportunity_balance(),
    'leadership_insights', public._rnbp_leadership_insights(),
    'blueprint_self_love_connection', public._rnbp_self_love_connection(),
    'blueprint_trust_connection', public._rnbp_trust_connection(),
    'limitation_principles', public._rnbp_limitation_principles(),
    'blueprint_dogfooding', public._rnbp_dogfooding(),
    'blueprint_integration_links', public._rnbp_integration_links(),
    'engagement_summary', public._rnbp_engagement_summary(v_org_id),
    'blueprint_success_criteria', public._rnbp_success_criteria(v_org_id),
    'blueprint_vision_phrases', public._rnbp_vision_phrases(),
    'blueprint_privacy_note', 'Risk navigation and Phase 81 blueprint data is metadata only — plan, vulnerability, and simulation counts. No fear-based copy, no PII, no punitive individual scoring. Humans decide; Aipify informs and prepares.',
    'implementation_blueprint_phase91', jsonb_build_object(
      'phase', 'Phase 91 — Organizational Resilience & Recovery Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE91_ORGANIZATIONAL_RESILIENCE_RECOVERY.md',
      'engine_phase', 'A.50 Organizational Resilience Engine / ABOS Resilience Engine',
      'route', '/app/organizational-resilience-engine',
      'mapping_note', 'ABOS Blueprint Phase 91 extends A.50 + Phase 81 with recovery focus, adversity learning, and hope-strengthening guidance. Distinct from Partner Certification repo Phase 91 and Dedication A.91.'
    ),
    'recovery_engine_note', 'Organizational Resilience & Recovery Engine (ABOS Phase 91) — prepare, respond, recover, and learn through adversity with hope-strengthening guidance — never toxic positivity.',
    'organizational_resilience_recovery_blueprint', public._orrbp91_recovery_blueprint_block(v_org_id),
    'recovery_distinction_note', public._orrbp91_distinction_note(),
    'recovery_mission', public._orrbp91_mission(),
    'recovery_philosophy', public._orrbp91_philosophy(),
    'recovery_abos_principle', public._orrbp91_abos_principle(),
    'recovery_objectives', public._orrbp91_objectives(),
    'recovery_resilience_questions', public._orrbp91_resilience_questions(),
    'recovery_resilience_domains', public._orrbp91_resilience_domains(),
    'recovery_companion_guidance', public._orrbp91_companion_guidance(),
    'recovery_reflection', public._orrbp91_recovery_reflection(),
    'recovery_learning_through_adversity', public._orrbp91_learning_through_adversity(),
    'recovery_leadership_insights', public._orrbp91_leadership_insights(),
    'recovery_self_love_connection', public._orrbp91_self_love_connection(),
    'recovery_trust_connection', public._orrbp91_trust_connection(),
    'recovery_limitation_principles', public._orrbp91_limitation_principles(),
    'recovery_dogfooding', public._orrbp91_dogfooding(),
    'recovery_integration_links', public._orrbp91_integration_links(),
    'recovery_engagement_summary', public._orrbp91_engagement_summary(v_org_id),
    'recovery_success_criteria', public._orrbp91_success_criteria(v_org_id),
    'recovery_vision', public._orrbp91_vision(),
    'recovery_vision_phrases', public._orrbp91_vision_phrases(),
    'recovery_privacy_note', 'Recovery blueprint data is metadata only — no toxic positivity, no PII, no wellbeing content. Humans decide pace; Aipify informs and supports.',
    'implementation_blueprint_phase128', jsonb_build_object(
      'phase', 'Phase 128 — Resilience & Continuity Companion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE128_RESILIENCE_CONTINUITY_COMPANION.md',
      'spec_doc', 'RESILIENCE_CONTINUITY_COMPANION_ENGINE_PHASE128.md',
      'engine_phase', 'A.50 Organizational Resilience Engine / ABOS Resilience Engine',
      'era', 'Enterprise Intelligence Era (121–130)',
      'route', '/app/organizational-resilience-engine',
      'mapping_note', 'Enterprise Intelligence Phase 128 extends A.50 + Phase 81 + Phase 91 with continuity companion, business continuity orchestration, dependency protection, and resilience exercises. Distinct from Continuity Phase 80 crisis layer.'
    ),
    'continuity_companion_engine_note', 'Resilience & Continuity Companion Engine (Enterprise Intelligence Phase 128) — prepare, adapt, and recover together with continuity planning, dependency visibility, and recovery orchestration — readiness not command.',
    'resilience_continuity_companion_blueprint', public._rccbp128_blueprint_block(v_org_id),
    'continuity_companion_distinction_note', public._rccbp128_distinction_note(),
    'continuity_companion_mission', public._rccbp128_mission(),
    'continuity_companion_philosophy', public._rccbp128_philosophy(),
    'continuity_companion_abos_principle', public._rccbp128_abos_principle(),
    'continuity_companion_vision', public._rccbp128_vision(),
    'continuity_companion_objectives', public._rccbp128_objectives(),
    'resilience_center', public._rccbp128_resilience_center(),
    'business_continuity_engine', public._rccbp128_business_continuity_engine(),
    'resilience_assessment', public._rccbp128_resilience_assessment(),
    'dependency_protection', public._rccbp128_dependency_protection(),
    'recovery_orchestration', public._rccbp128_recovery_orchestration(),
    'resilience_companion_supports', public._rccbp128_resilience_companion(),
    'leadership_continuity_supports', public._rccbp128_leadership_continuity(),
    'resilience_exercise_framework', public._rccbp128_resilience_exercise_framework(),
    'continuity_companion_limitations', public._rccbp128_companion_limitations(),
    'continuity_self_love_connection', public._rccbp128_self_love_connection(),
    'continuity_knowledge_library', public._rccbp128_continuity_knowledge_library(),
    'continuity_companion_cross_links', public._rccbp128_cross_links(),
    'continuity_companion_limitation_principles', public._rccbp128_limitation_principles(),
    'continuity_companion_adaptation', public._rccbp128_companion_adaptation(),
    'continuity_companion_engagement_summary', public._rccbp128_engagement_summary(v_org_id),
    'continuity_companion_success_criteria', public._rccbp128_success_criteria(v_org_id),
    'continuity_companion_success_metrics', public._rccbp128_success_metrics(),
    'continuity_companion_privacy_note', 'Continuity companion blueprint data is metadata only — no panic framing, no crisis command, no PII. Humans lead; Aipify prepares and supports readiness.'

  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Card RPC — preserve A.50 + Phase 81 + Phase 91 fields; append Phase 128
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_resilience_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
  v_engagement jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._ore_seed_plans(v_org_id);
  v_engagement := public._rnbp_engagement_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Resilience means recovering, adapting, and growing through difficulty — not the absence of difficulty.',
    'mission', 'Strengthen resilience through preparation, response, recovery, and learning.',
    'abos_principle', 'Strength is revealed in difficult moments — navigate with confidence, compassion, and clarity.',
    'vision', 'A steady companion when circumstances are not — rising again, not never falling.',
    'active_plans', coalesce((
      select count(*) from public.resilience_plans
      where organization_id = v_org_id and status = 'active'
    ), 0),
    'open_vulnerabilities', coalesce((
      select count(*) from public.resilience_vulnerabilities
      where organization_id = v_org_id and status in ('open', 'mitigating')
    ), 0),
    'implementation_blueprint_phase81', jsonb_build_object(
      'phase', 'Phase 81 — Risk Navigation Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE81_RISK_NAVIGATION.md',
      'engine_phase', 'A.50 Organizational Resilience Engine / ABOS Resilience Engine',
      'route', '/app/organizational-resilience-engine'
    ),
    'blueprint_mission', public._rnbp_mission(),
    'blueprint_abos_principle', public._rnbp_abos_principle(),
    'engagement_summary', v_engagement,
    'blueprint_note', 'Risk Navigation Engine (ABOS Phase 81) — risk awareness, preparedness planning, and balanced decision-making with preparedness not alarm.',
    'preparedness_note', 'Preparedness not alarm — uncertainty navigable with wisdom, courage, and preparation.',
    'implementation_blueprint_phase91', jsonb_build_object(
      'phase', 'Phase 91 — Organizational Resilience & Recovery Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE91_ORGANIZATIONAL_RESILIENCE_RECOVERY.md',
      'engine_phase', 'A.50 Organizational Resilience Engine / ABOS Resilience Engine',
      'route', '/app/organizational-resilience-engine'
    ),
    'recovery_mission', public._orrbp91_mission(),
    'recovery_abos_principle', public._orrbp91_abos_principle(),
    'recovery_engagement_summary', public._orrbp91_engagement_summary(v_org_id),
    'recovery_note', 'Organizational Resilience & Recovery Engine (ABOS Phase 91) — recovery, adversity learning, and hope-strengthening with honest acknowledgment.',
    'recovery_vision_note', 'We faced difficult circumstances, but we emerged wiser, stronger and more connected.',
    'implementation_blueprint_phase128', jsonb_build_object(
      'phase', 'Phase 128 — Resilience & Continuity Companion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE128_RESILIENCE_CONTINUITY_COMPANION.md',
      'spec_doc', 'RESILIENCE_CONTINUITY_COMPANION_ENGINE_PHASE128.md',
      'engine_phase', 'A.50 Organizational Resilience Engine / ABOS Resilience Engine',
      'era', 'Enterprise Intelligence Era (121–130)',
      'route', '/app/organizational-resilience-engine'
    ),
    'continuity_companion_mission', public._rccbp128_mission(),
    'continuity_companion_abos_principle', public._rccbp128_abos_principle(),
    'continuity_companion_engagement_summary', public._rccbp128_engagement_summary(v_org_id),
    'continuity_companion_note', 'Resilience & Continuity Companion Engine (Enterprise Intelligence Phase 128) — prepare, adapt, and recover together with readiness not command.',
    'continuity_companion_vision_note', 'When disruption arrives, the organization is prepared — dependencies visible, roles clear, recovery coordinated.'

  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._rccbp128_distinction_note() to authenticated;
grant execute on function public._rccbp128_mission() to authenticated;
grant execute on function public._rccbp128_philosophy() to authenticated;
grant execute on function public._rccbp128_abos_principle() to authenticated;
grant execute on function public._rccbp128_vision() to authenticated;
grant execute on function public._rccbp128_objectives() to authenticated;
grant execute on function public._rccbp128_resilience_center() to authenticated;
grant execute on function public._rccbp128_business_continuity_engine() to authenticated;
grant execute on function public._rccbp128_resilience_assessment() to authenticated;
grant execute on function public._rccbp128_dependency_protection() to authenticated;
grant execute on function public._rccbp128_recovery_orchestration() to authenticated;
grant execute on function public._rccbp128_resilience_companion() to authenticated;
grant execute on function public._rccbp128_leadership_continuity() to authenticated;
grant execute on function public._rccbp128_resilience_exercise_framework() to authenticated;
grant execute on function public._rccbp128_companion_limitations() to authenticated;
grant execute on function public._rccbp128_self_love_connection() to authenticated;
grant execute on function public._rccbp128_continuity_knowledge_library() to authenticated;
grant execute on function public._rccbp128_cross_links() to authenticated;
grant execute on function public._rccbp128_limitation_principles() to authenticated;
grant execute on function public._rccbp128_companion_adaptation() to authenticated;
grant execute on function public._rccbp128_success_metrics() to authenticated;
grant execute on function public._rccbp128_engagement_summary(uuid) to authenticated;
grant execute on function public._rccbp128_success_criteria(uuid) to authenticated;
grant execute on function public._rccbp128_blueprint_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'resilience-continuity-companion-blueprint-phase128', 'Resilience & Continuity Companion Engine (Enterprise Intelligence Phase 128)',
  'Resilience & Continuity Companion Engine — extends Organizational Resilience A.50 + Phase 81 + Phase 91 with continuity companion, business continuity orchestration, dependency protection, recovery coordination, and resilience exercises. Readiness not command.',
  'authenticated', 128
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'resilience-continuity-companion-blueprint-phase128' and tenant_id is null
);
