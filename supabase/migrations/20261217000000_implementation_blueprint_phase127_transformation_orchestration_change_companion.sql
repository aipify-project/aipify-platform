-- Implementation Blueprint Phase 127 — Transformation Orchestration & Change Companion Engine
-- Enterprise Intelligence Era (121–130). Extends Change Management Engine Phase A.47 + Blueprint Phase 62.
-- Helpers: _tcobp127_* (never collide with _cme_*, _cmbp_*).

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._tcobp127_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 127 — Transformation Orchestration & Change Companion Engine at /app/change-management-engine. Enterprise Intelligence Era (121–130). Layers on Change Management Engine Phase A.47 (20260823000000_change_management_engine_phase_a47.sql) and ABOS Implementation Blueprint Phase 62 (_cmbp_* — 20261012000000_implementation_blueprint_phase62_change_management.sql). Phase 127 deepens transformation orchestration, change companion support, adoption intelligence, and transformation memory — Phase 62 established people-centered change framing; Phase 127 is the Enterprise Intelligence orchestration layer. Distinct from Evolution Governance repo Phase 84 at /app/evolution (Aipify software evolution proposals — NOT org transformation). Cross-link Stakeholder Communication A.53, Organizational Memory Phase 126, Executive Intelligence Phase 121, Decision Intelligence Phase 125, Digital Twin Phase 124, Aipify University Phase 115, Self Love A.76, Learning & Training A.36. Helpers _tcobp127_* only — never _cme_* or _cmbp_*. All A.47 and Phase 62 dashboard fields preserved.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata
-- ---------------------------------------------------------------------------
create or replace function public._tcobp127_mission()
returns text language sql immutable as $$
  select 'Orchestrate organizational transformation with clarity, empathy, and responsibility — change with people, not to people.';
$$;

create or replace function public._tcobp127_philosophy()
returns text language sql immutable as $$
  select 'Change is hard — orchestrate with clarity, empathy, and responsibility, not force or reckless speed. Wisdom before speed. People First.';
$$;

create or replace function public._tcobp127_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Transformation Orchestration & Change Companion supports people through transition. Metadata only — adoption metrics aggregate and support, never employee surveillance.';
$$;

create or replace function public._tcobp127_vision()
returns text language sql immutable as $$
  select 'Transformation handled thoughtfully — leaders see clearly, employees feel supported, knowledge is preserved, and resilience grows through dialogue not pressure.';
$$;

create or replace function public._tcobp127_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'transformation_success', 'emoji', '🎯', 'label', 'Transformation success', 'description', 'Structured roadmaps, milestones, and outcome reviews — humans define success'),
    jsonb_build_object('key', 'reduce_fatigue', 'emoji', '🌿', 'label', 'Reduce change fatigue', 'description', 'Healthy pacing, reflection, and fatigue-aware sequencing — no urgency traps'),
    jsonb_build_object('key', 'strengthen_communication', 'emoji', '💬', 'label', 'Strengthen communication', 'description', 'Leadership updates, briefings, FAQs, and milestone announcements — transparent not performative'),
    jsonb_build_object('key', 'alignment', 'emoji', '🔗', 'label', 'Alignment', 'description', 'Stakeholder mapping, readiness, and sponsor visibility across departments'),
    jsonb_build_object('key', 'support_employees', 'emoji', '🌹', 'label', 'Support employees', 'description', 'Change Companion answers questions and reduces uncertainty — never imposes change'),
    jsonb_build_object('key', 'preserve_knowledge', 'emoji', '📚', 'label', 'Preserve knowledge', 'description', 'Transformation memory and knowledge library — cross-link Org Memory Phase 126'),
    jsonb_build_object('key', 'leadership_visibility', 'emoji', '🦉', 'label', 'Leadership visibility', 'description', 'Executive oversight scaffolds — informed leaders, not surveillance dashboards'),
    jsonb_build_object('key', 'transformation_resilience', 'emoji', '✨', 'label', 'Transformation resilience', 'description', 'Risk monitoring, adoption intelligence, and lessons learned — organizational resilience grows')
  );
$$;

create or replace function public._tcobp127_orchestration_center()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'roadmaps', 'label', 'Transformation roadmaps', 'description', 'Vision, outcomes, milestones, and dependencies — metadata scaffolds'),
    jsonb_build_object('key', 'initiative_portfolios', 'label', 'Initiative portfolios', 'description', 'Linked change initiatives from A.47 — portfolio view without duplicating RPCs'),
    jsonb_build_object('key', 'stakeholder_mapping', 'label', 'Stakeholder mapping', 'description', 'Eight stakeholder categories — who is affected and how to support'),
    jsonb_build_object('key', 'readiness_assessments', 'label', 'Readiness assessments', 'description', 'Eight readiness areas — leadership, knowledge, learning, communication, governance'),
    jsonb_build_object('key', 'communication_planning', 'label', 'Communication planning', 'description', 'Six orchestration types — cross-link Stakeholder Communication A.53'),
    jsonb_build_object('key', 'risk_monitoring', 'label', 'Risk monitoring', 'description', 'Seven transformation risk signals — empathy-first response framing'),
    jsonb_build_object('key', 'adoption_tracking', 'label', 'Adoption tracking', 'description', 'Seven adoption indicators — support not surveillance'),
    jsonb_build_object('key', 'knowledge_preservation', 'label', 'Knowledge preservation', 'description', 'Transformation memory captures — cross-link Org Memory Phase 126'),
    jsonb_build_object('key', 'executive_oversight', 'label', 'Executive oversight', 'description', 'Leadership visibility scaffolds — cross-link Executive Intelligence Phase 121')
  );
$$;

create or replace function public._tcobp127_roadmap_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'vision', 'label', 'Vision', 'description', 'Why transformation matters — clear rationale without pressure'),
    jsonb_build_object('key', 'outcomes', 'label', 'Outcomes', 'description', 'Expected results and success indicators — measurable and qualitative'),
    jsonb_build_object('key', 'milestones', 'label', 'Milestones', 'description', 'Phased milestones linked to A.47 change_milestones — metadata only'),
    jsonb_build_object('key', 'dependencies', 'label', 'Dependencies', 'description', 'Cross-initiative and cross-system dependencies — planning scaffolds'),
    jsonb_build_object('key', 'timeline', 'label', 'Timeline', 'description', 'Realistic pacing — wisdom before speed, healthy sequencing'),
    jsonb_build_object('key', 'sponsors', 'label', 'Sponsors', 'description', 'Executive and initiative sponsors — accountability without blame'),
    jsonb_build_object('key', 'department_participation', 'label', 'Department participation', 'description', 'Teams and roles involved — metadata only, no PII'),
    jsonb_build_object('key', 'success_indicators', 'label', 'Success indicators', 'description', 'Adoption and outcome indicators — aggregate support metrics')
  );
$$;

create or replace function public._tcobp127_readiness_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'leadership_alignment', 'label', 'Leadership alignment', 'description', 'Sponsors and executives aligned on why and how — dialogue not mandates'),
    jsonb_build_object('key', 'knowledge_availability', 'label', 'Knowledge availability', 'description', 'Approved guides, playbooks, and KC references — metadata only'),
    jsonb_build_object('key', 'learning_capacity', 'label', 'Learning capacity', 'description', 'Training paths and university resources — cross-link A.36 and Phase 115'),
    jsonb_build_object('key', 'communication_effectiveness', 'label', 'Communication effectiveness', 'description', 'Plans released, FAQs updated, concerns addressed — not message volume'),
    jsonb_build_object('key', 'governance_maturity', 'label', 'Governance maturity', 'description', 'Approvals, policies, and oversight patterns respected during change'),
    jsonb_build_object('key', 'companion_readiness', 'label', 'Companion readiness', 'description', 'Change Companion available to answer questions — optional not forced'),
    jsonb_build_object('key', 'community_engagement', 'label', 'Community engagement', 'description', 'Community and peer support channels — cross-link Community Phase 117'),
    jsonb_build_object('key', 'transformation_history', 'label', 'Transformation history', 'description', 'Prior change lessons — cross-link Org Memory Phase 126')
  );
$$;

create or replace function public._tcobp127_stakeholder_engagement()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'employees', 'label', 'Employees', 'description', 'Primary affected groups — support and clarity, not surveillance'),
    jsonb_build_object('key', 'customers', 'label', 'Customers', 'description', 'External impact awareness — communication when customer-facing change'),
    jsonb_build_object('key', 'growth_partners', 'label', 'Growth Partners', 'description', 'GP ecosystem alignment — cross-link GP Operations Phase 114'),
    jsonb_build_object('key', 'executives', 'label', 'Executives', 'description', 'Leadership sponsors and decision makers — visibility scaffolds'),
    jsonb_build_object('key', 'boards', 'label', 'Boards', 'description', 'Board oversight when material — cross-link Phase 123 governance'),
    jsonb_build_object('key', 'communities', 'label', 'Communities', 'description', 'Internal and external communities — engagement not manipulation'),
    jsonb_build_object('key', 'support_teams', 'label', 'Support teams', 'description', 'Operations and support readiness — training and escalation paths'),
    jsonb_build_object('key', 'knowledge_leaders', 'label', 'Knowledge leaders', 'description', 'Subject matter experts and knowledge stewards — preservation focus')
  );
$$;

create or replace function public._tcobp127_change_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'answer_questions', 'label', 'Answer questions', 'description', 'Honest answers about what is changing and why — reduce uncertainty'),
    jsonb_build_object('key', 'context', 'label', 'Provide context', 'description', 'Initiative scope, timeline, and support available — metadata summaries'),
    jsonb_build_object('key', 'learning_resources', 'label', 'Learning resources', 'description', 'Training and university links — cross-link A.36 and Phase 115'),
    jsonb_build_object('key', 'reflection', 'label', 'Support reflection', 'description', 'Gentle reflection prompts — never guilt or pressure'),
    jsonb_build_object('key', 'progress_summaries', 'label', 'Progress summaries', 'description', 'Milestone and adoption progress — aggregate counts only'),
    jsonb_build_object('key', 'highlight_concerns', 'label', 'Highlight concerns', 'description', 'Surface common concerns for leaders — empathy-first, not blame'),
    jsonb_build_object('key', 'adoption_support', 'label', 'Adoption support', 'description', 'Guidance during transition — support NOT impose change')
  );
$$;

create or replace function public._tcobp127_communication_orchestration()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Communication orchestration helps leaders explain transformation with clarity — templates and guidance, not automated messaging without approval.',
    'types', jsonb_build_array(
      jsonb_build_object('key', 'leadership_updates', 'label', 'Leadership updates', 'description', 'Executive messages on direction and support'),
      jsonb_build_object('key', 'transformation_briefings', 'label', 'Transformation briefings', 'description', 'Structured briefings for teams and stakeholders'),
      jsonb_build_object('key', 'town_hall_prep', 'label', 'Town hall preparation', 'description', 'Agenda scaffolds and anticipated questions — humans deliver'),
      jsonb_build_object('key', 'faq_generation', 'label', 'FAQ generation', 'description', 'Anticipated questions with honest answers — KC cross-link'),
      jsonb_build_object('key', 'milestone_announcements', 'label', 'Milestone announcements', 'description', 'Progress and completion updates — recognize effort'),
      jsonb_build_object('key', 'knowledge_distribution', 'label', 'Knowledge distribution', 'description', 'Approved guides and playbooks — metadata references only')
    ),
    'stakeholder_communication_route', '/app/stakeholder-communication-engine',
    'boundary_note', 'Stakeholder Communication A.53 handles multi-channel delivery — Change Management owns initiative-scoped plans; cross-link, do not duplicate.'
  );
$$;

create or replace function public._tcobp127_transformation_risk_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'resistance_signals', 'label', 'Resistance signals', 'description', 'Constructive concerns — respond with empathy not blame'),
    jsonb_build_object('key', 'learning_gaps', 'label', 'Learning gaps', 'description', 'Training completion below target — more preparation time'),
    jsonb_build_object('key', 'knowledge_loss', 'label', 'Knowledge loss', 'description', 'Documentation and expert departure risks — preservation focus'),
    jsonb_build_object('key', 'leadership_misalignment', 'label', 'Leadership misalignment', 'description', 'Sponsor or executive messaging inconsistency — dialogue needed'),
    jsonb_build_object('key', 'governance_weaknesses', 'label', 'Governance weaknesses', 'description', 'Approval or policy gaps during high-impact change'),
    jsonb_build_object('key', 'companion_adoption_challenges', 'label', 'Companion adoption challenges', 'description', 'Optional companion usage low — support not mandate'),
    jsonb_build_object('key', 'communication_breakdowns', 'label', 'Communication breakdowns', 'description', 'Missing updates or unclear expectations — additional communication may help')
  );
$$;

create or replace function public._tcobp127_adoption_intelligence()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Adoption intelligence supports people through transition — aggregate metrics for leaders, never employee surveillance or ranking.',
    'indicators', jsonb_build_array(
      jsonb_build_object('key', 'training_participation', 'label', 'Training participation', 'description', 'Aggregate completion rates — cross-link A.36'),
      jsonb_build_object('key', 'companion_usage', 'label', 'Companion usage', 'description', 'Optional companion engagement counts — not individual tracking'),
      jsonb_build_object('key', 'process_adoption', 'label', 'Process adoption', 'description', 'Workflow utilization trends — metadata only'),
      jsonb_build_object('key', 'knowledge_access', 'label', 'Knowledge access', 'description', 'Guide and playbook usage patterns — aggregate'),
      jsonb_build_object('key', 'feedback_participation', 'label', 'Feedback participation', 'description', 'Voluntary feedback channels — never forced'),
      jsonb_build_object('key', 'milestone_completion', 'label', 'Milestone completion', 'description', 'Initiative milestone progress from A.47 tables'),
      jsonb_build_object('key', 'employee_confidence', 'label', 'Employee confidence', 'description', 'Qualitative confidence indicators — survey metadata only, no PII')
    ),
    'privacy_note', 'Aggregate support metrics only — no individual surveillance, ranking, or punitive framing.'
  );
$$;

create or replace function public._tcobp127_transformation_memory_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Transformation memory captures how change unfolded — success factors, challenges, and lessons for future initiatives.',
    'captures', jsonb_build_array(
      jsonb_build_object('key', 'success_factors', 'label', 'Success factors', 'description', 'What worked and why — metadata summaries'),
      jsonb_build_object('key', 'challenges', 'label', 'Challenges', 'description', 'Obstacles encountered — learning not blame'),
      jsonb_build_object('key', 'communication_approaches', 'label', 'Communication approaches', 'description', 'Effective messaging patterns — templates for reuse'),
      jsonb_build_object('key', 'leadership_decisions', 'label', 'Leadership decisions', 'description', 'Key decisions and rationale — audit metadata only'),
      jsonb_build_object('key', 'knowledge_assets', 'label', 'Knowledge assets', 'description', 'Guides and playbooks created during transformation'),
      jsonb_build_object('key', 'outcome_reviews', 'label', 'Outcome reviews', 'description', 'Post-initiative reviews — cross-link Org Memory Phase 126')
    ),
    'org_memory_route', '/app/organizational-memory-engine',
    'boundary_note', 'Organizational Memory Phase 126 owns institutional memory — Phase 127 links transformation-specific captures; do not duplicate OME RPCs.'
  );
$$;

create or replace function public._tcobp127_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'no_forcing_participation', 'label', 'Never force participation'),
    jsonb_build_object('key', 'no_manipulating_emotions', 'label', 'Never manipulate emotions'),
    jsonb_build_object('key', 'no_suppressing_concerns', 'label', 'Never suppress concerns'),
    jsonb_build_object('key', 'no_replacing_accountability', 'label', 'Never replace human accountability'),
    jsonb_build_object('key', 'no_guaranteeing_success', 'label', 'Never guarantee transformation success')
  );
$$;

create or replace function public._tcobp127_self_love_transformation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love in transformation — psychological safety, healthy pacing, reflection, compassion, recognition, and support structures.',
    'patterns', jsonb_build_array(
      jsonb_build_object('key', 'psychological_safety', 'label', 'Psychological safety'),
      jsonb_build_object('key', 'healthy_pacing', 'label', 'Healthy pacing'),
      jsonb_build_object('key', 'reflection', 'label', 'Reflection'),
      jsonb_build_object('key', 'compassion', 'label', 'Compassion'),
      jsonb_build_object('key', 'recognition', 'label', 'Recognition'),
      jsonb_build_object('key', 'support_structures', 'label', 'Support structures')
    ),
    'transformation_phrase', 'Change with people, not to people — adjustment often requires time.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love is a principle — Change Management stores initiative metadata, not wellbeing content.'
  );
$$;

create or replace function public._tcobp127_knowledge_library()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'playbooks', 'label', 'Playbooks', 'description', 'Step-by-step transformation guides — approved sources only'),
    jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned', 'description', 'Prior initiative outcomes — metadata summaries'),
    jsonb_build_object('key', 'communication_templates', 'label', 'Communication templates', 'description', 'Leadership updates, briefings, and announcements'),
    jsonb_build_object('key', 'readiness_frameworks', 'label', 'Readiness frameworks', 'description', 'Eight-area readiness assessment scaffolds'),
    jsonb_build_object('key', 'faq_collections', 'label', 'FAQ collections', 'description', 'Anticipated questions with honest answers'),
    jsonb_build_object('key', 'case_studies', 'label', 'Case studies', 'description', 'Anonymized transformation patterns — metadata only'),
    jsonb_build_object('key', 'adoption_strategies', 'label', 'Adoption strategies', 'description', 'Nurtured adoption approaches — support not surveillance')
  );
$$;

create or replace function public._tcobp127_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'change_management', 'label', 'Change Management A.47 + Phase 62', 'route', '/app/change-management-engine', 'note', 'Primary engine — Phase 127 extends A.47 + Phase 62 on same route'),
    jsonb_build_object('key', 'executive_intelligence', 'label', 'Executive Intelligence Phase 121', 'route', '/app/executive-intelligence', 'note', 'Executive oversight and leadership context — cross-link'),
    jsonb_build_object('key', 'decision_intelligence', 'label', 'Decision Intelligence Phase 125', 'route', '/app/decision-intelligence-engine', 'note', 'Transformation decisions — structure and wisdom, humans decide'),
    jsonb_build_object('key', 'digital_twin', 'label', 'Organizational Digital Twin Phase 124', 'route', '/app/digital-twin', 'note', 'Organizational visibility scaffolds — metadata only'),
    jsonb_build_object('key', 'org_memory', 'label', 'Organizational Memory Phase 126', 'route', '/app/organizational-memory-engine', 'note', 'Transformation memory cross-link — do not duplicate OME RPCs'),
    jsonb_build_object('key', 'aipify_university', 'label', 'Aipify University Phase 115', 'route', '/app/aipify-university', 'note', 'Continuous learning during transformation'),
    jsonb_build_object('key', 'learning_training', 'label', 'Learning & Training A.36', 'route', '/app/learning-training-engine', 'note', 'Training paths — assign_change_training() metadata hook'),
    jsonb_build_object('key', 'stakeholder_communication', 'label', 'Stakeholder Communication A.53', 'route', '/app/stakeholder-communication-engine', 'note', 'Multi-channel delivery — communication orchestration cross-link'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Psychological safety and healthy pacing — principle only'),
    jsonb_build_object('key', 'evolution', 'label', 'Evolution Governance Phase 84', 'route', '/app/evolution', 'note', 'Aipify software evolution — NOT org transformation'),
    jsonb_build_object('key', 'blueprint_phase62', 'label', 'Blueprint Phase 62', 'route', '/app/change-management-engine', 'note', 'Prior change framing — _cmbp_* scaffolds preserved')
  );
$$;

create or replace function public._tcobp127_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Change Companion informs and supports — leaders and employees remain accountable; no forcing, manipulating, or guaranteeing outcomes.',
    'must_never', public._tcobp127_companion_limitations(),
    'required', jsonb_build_array(
      'Change with people not to people — no manipulation',
      'Adoption metrics aggregate and support — not employee surveillance',
      'Metadata only — no raw customer content or PII',
      'Cross-link specialized engines — never duplicate A.47 initiative RPCs',
      'Preserve Phase 62 _cmbp_* and A.47 _cme_* fields in dashboard and card RPCs'
    ),
    'boundary_note', 'Wisdom before speed. People First. Humans lead; Aipify prepares and informs.'
  );
$$;

create or replace function public._tcobp127_companion_adaptation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Reduce uncertainty, provide context, encourage dialogue — never impose change or manipulate emotions.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'communication_gap', 'prompt', 'Several teams may benefit from another briefing before the next milestone — shall Aipify prepare a communication scaffold when leaders are ready?', 'consideration', 'Additional communication may help reduce uncertainty'),
      jsonb_build_object('emoji', '🌹', 'key', 'preparation_time', 'prompt', 'Training completion is below target — stakeholders may need more preparation time; healthy pacing over reckless speed.', 'consideration', 'Self Love cross-link — compassion not pressure'),
      jsonb_build_object('emoji', '🔔', 'key', 'milestone_recognition', 'prompt', 'Impact assessment milestone completed — consider a progress update to recognize effort and reinforce momentum.', 'consideration', 'Celebration without urgency traps'),
      jsonb_build_object('emoji', '📚', 'key', 'knowledge_preservation', 'prompt', 'Key knowledge from this initiative deserves capture — shall Aipify suggest a transformation memory summary for Org Memory review?', 'consideration', 'Cross-link Org Memory Phase 126')
    )
  );
$$;

create or replace function public._tcobp127_success_metrics()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'transformation_success', 'label', 'Transformation success'),
    jsonb_build_object('key', 'change_fatigue_reduction', 'label', 'Change fatigue reduction'),
    jsonb_build_object('key', 'communication_effectiveness', 'label', 'Communication effectiveness'),
    jsonb_build_object('key', 'stakeholder_alignment', 'label', 'Stakeholder alignment'),
    jsonb_build_object('key', 'employee_support', 'label', 'Employee support'),
    jsonb_build_object('key', 'knowledge_preservation', 'label', 'Knowledge preservation'),
    jsonb_build_object('key', 'leadership_visibility', 'label', 'Leadership visibility'),
    jsonb_build_object('key', 'transformation_resilience', 'label', 'Transformation resilience')
  );
$$;

create or replace function public._tcobp127_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_base jsonb;
begin
  v_base := public._cmbp_engagement_summary(p_org_id);
  return v_base || jsonb_build_object(
    'objectives_count', jsonb_array_length(public._tcobp127_objectives()),
    'orchestration_capabilities', jsonb_array_length(public._tcobp127_orchestration_center()),
    'roadmap_includes_count', jsonb_array_length(public._tcobp127_roadmap_engine()),
    'readiness_areas_count', jsonb_array_length(public._tcobp127_readiness_engine()),
    'stakeholder_categories_count', jsonb_array_length(public._tcobp127_stakeholder_engagement()),
    'companion_supports_count', jsonb_array_length(public._tcobp127_change_companion()),
    'communication_types_count', jsonb_array_length(public._tcobp127_communication_orchestration()->'types'),
    'risk_signals_count', jsonb_array_length(public._tcobp127_transformation_risk_engine()),
    'adoption_indicators_count', jsonb_array_length(public._tcobp127_adoption_intelligence()->'indicators'),
    'memory_captures_count', jsonb_array_length(public._tcobp127_transformation_memory_engine()->'captures'),
    'cross_links_count', jsonb_array_length(public._tcobp127_cross_links()),
    'success_metrics_count', jsonb_array_length(public._tcobp127_success_metrics()),
    'companion_limitations_count', jsonb_array_length(public._tcobp127_companion_limitations()),
    'knowledge_library_count', jsonb_array_length(public._tcobp127_knowledge_library()),
    'privacy_note', 'Aggregate engagement counts only — metadata, no PII, no employee surveillance.'
  );
end; $$;

create or replace function public._tcobp127_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_total int := 0;
  v_active int := 0;
begin
  v_engagement := public._tcobp127_engagement_summary(p_org_id);
  v_total := coalesce((v_engagement->>'total_initiatives')::int, 0);
  v_active := coalesce((v_engagement->>'active_initiatives')::int, 0);

  return jsonb_build_array(
    jsonb_build_object('key', 'objectives', 'label', 'Eight transformation objectives documented', 'met', jsonb_array_length(public._tcobp127_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'orchestration_center', 'label', 'Transformation Orchestration Center — nine capabilities', 'met', jsonb_array_length(public._tcobp127_orchestration_center()) = 9, 'note', null),
    jsonb_build_object('key', 'roadmap_engine', 'label', 'Transformation roadmap engine — eight includes', 'met', jsonb_array_length(public._tcobp127_roadmap_engine()) = 8, 'note', null),
    jsonb_build_object('key', 'readiness_engine', 'label', 'Change readiness engine — eight areas', 'met', jsonb_array_length(public._tcobp127_readiness_engine()) = 8, 'note', null),
    jsonb_build_object('key', 'stakeholder_engagement', 'label', 'Stakeholder engagement — eight categories', 'met', jsonb_array_length(public._tcobp127_stakeholder_engagement()) = 8, 'note', null),
    jsonb_build_object('key', 'change_companion', 'label', 'Change Companion — seven supports, no imposition', 'met', jsonb_array_length(public._tcobp127_change_companion()) = 7, 'note', 'Reduce uncertainty — never impose change.'),
    jsonb_build_object('key', 'communication_orchestration', 'label', 'Communication orchestration — six types', 'met', jsonb_array_length(public._tcobp127_communication_orchestration()->'types') = 6, 'note', 'Cross-link Stakeholder Communication A.53.'),
    jsonb_build_object('key', 'transformation_risks', 'label', 'Transformation risk engine — seven signals', 'met', jsonb_array_length(public._tcobp127_transformation_risk_engine()) = 7, 'note', 'Empathy-first response framing.'),
    jsonb_build_object('key', 'adoption_intelligence', 'label', 'Adoption intelligence — seven indicators', 'met', jsonb_array_length(public._tcobp127_adoption_intelligence()->'indicators') = 7, 'note', 'Support not surveillance.'),
    jsonb_build_object('key', 'transformation_memory', 'label', 'Transformation memory — six captures', 'met', jsonb_array_length(public._tcobp127_transformation_memory_engine()->'captures') = 6, 'note', 'Cross-link Org Memory Phase 126.'),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — five never rules', 'met', jsonb_array_length(public._tcobp127_companion_limitations()) = 5, 'note', 'No forcing, manipulating, or guaranteeing success.'),
    jsonb_build_object('key', 'knowledge_library', 'label', 'Transformation knowledge library documented', 'met', jsonb_array_length(public._tcobp127_knowledge_library()) >= 6, 'note', null),
    jsonb_build_object('key', 'cross_links', 'label', 'Mandatory cross-links documented', 'met', jsonb_array_length(public._tcobp127_cross_links()) >= 10, 'note', null),
    jsonb_build_object('key', 'success_metrics', 'label', 'Success metrics — eight documented', 'met', jsonb_array_length(public._tcobp127_success_metrics()) = 8, 'note', null),
    jsonb_build_object('key', 'phase62_preserved', 'label', 'Phase 62 _cmbp_* scaffolds preserved', 'met', jsonb_array_length(public._cmbp_objectives()) >= 6, 'note', 'Phase 127 layers on Phase 62 — does not replace.'),
    jsonb_build_object('key', 'live_initiatives', 'label', 'Live A.47 change initiatives', 'met', v_total > 0 or v_active >= 0, 'note', case when v_total = 0 then 'Create a change initiative to begin orchestration.' else format('%s initiative(s), %s active.', v_total, v_active) end),
    jsonb_build_object('key', 'distinction', 'label', 'Phase 127 vs Evolution Phase 84 distinction documented', 'met', position('Phase 84' in public._tcobp127_distinction_note()) > 0, 'note', public._tcobp127_distinction_note())
  );
end; $$;

create or replace function public._tcobp127_blueprint_block(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'phase', '127',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE127_TRANSFORMATION_ORCHESTRATION_CHANGE_COMPANION.md',
    'spec_doc', 'TRANSFORMATION_ORCHESTRATION_CHANGE_COMPANION_ENGINE_PHASE127.md',
    'engine_phase', 'Phase A.47 Change Management Engine',
    'era', 'Enterprise Intelligence Era (121–130)',
    'route', '/app/change-management-engine',
    'distinction_note', public._tcobp127_distinction_note(),
    'mission', public._tcobp127_mission(),
    'philosophy', public._tcobp127_philosophy(),
    'abos_principle', public._tcobp127_abos_principle(),
    'vision', public._tcobp127_vision(),
    'objectives', public._tcobp127_objectives(),
    'orchestration_center', public._tcobp127_orchestration_center(),
    'roadmap_engine', public._tcobp127_roadmap_engine(),
    'readiness_engine', public._tcobp127_readiness_engine(),
    'stakeholder_engagement', public._tcobp127_stakeholder_engagement(),
    'change_companion', public._tcobp127_change_companion(),
    'communication_orchestration', public._tcobp127_communication_orchestration(),
    'transformation_risk_engine', public._tcobp127_transformation_risk_engine(),
    'adoption_intelligence', public._tcobp127_adoption_intelligence(),
    'transformation_memory_engine', public._tcobp127_transformation_memory_engine(),
    'companion_limitations', public._tcobp127_companion_limitations(),
    'self_love_transformation', public._tcobp127_self_love_transformation(),
    'knowledge_library', public._tcobp127_knowledge_library(),
    'cross_links', public._tcobp127_cross_links(),
    'limitation_principles', public._tcobp127_limitation_principles(),
    'companion_adaptation', public._tcobp127_companion_adaptation(),
    'success_metrics', public._tcobp127_success_metrics(),
    'success_criteria', public._tcobp127_success_criteria(p_org_id),
    'engagement_summary', public._tcobp127_engagement_summary(p_org_id),
    'privacy_note', 'Metadata only — adoption metrics aggregate and support, never employee surveillance or PII.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL A.47 + Phase 62 fields; append Phase 127
-- ---------------------------------------------------------------------------
create or replace function public.get_change_management_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('changes.view');
  v_org_id := public._mta_require_organization();
  perform public._cme_seed_initiatives(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Human-centered adoption — transparent communication, structured implementation, measurable outcomes.',
    'principles', jsonb_build_array(
      'Human-centered adoption',
      'Transparent communication',
      'Structured implementation',
      'Measurable outcomes',
      'Audit-supported accountability'
    ),
    'summary', jsonb_build_object(
      'total_initiatives', coalesce((
        select count(*) from public.change_initiatives where organization_id = v_org_id
      ), 0),
      'active', coalesce((
        select count(*) from public.change_initiatives
        where organization_id = v_org_id and status in ('planning', 'in_progress')
      ), 0),
      'completed', coalesce((
        select count(*) from public.change_initiatives
        where organization_id = v_org_id and status = 'completed'
      ), 0),
      'pending_communications', coalesce((
        select count(*) from public.change_communication_plans
        where organization_id = v_org_id and status in ('draft', 'scheduled')
      ), 0),
      'pending_milestones', coalesce((
        select count(*) from public.change_milestones
        where organization_id = v_org_id and status = 'pending'
      ), 0)
    ),
    'initiatives', coalesce((
      select jsonb_agg(row_to_json(ci) order by ci.created_at desc)
      from public.change_initiatives ci where ci.organization_id = v_org_id
    ), '[]'::jsonb),
    'impact_assessments', coalesce((
      select jsonb_agg(row_to_json(ia) order by ia.created_at desc)
      from public.change_impact_assessments ia where ia.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'communication_plans', coalesce((
      select jsonb_agg(row_to_json(cp) order by cp.created_at desc)
      from public.change_communication_plans cp where cp.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'adoption_metrics', coalesce((
      select jsonb_agg(row_to_json(am) order by am.recorded_at desc)
      from public.change_adoption_metrics am where am.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'milestones', coalesce((
      select jsonb_agg(row_to_json(m) order by m.initiative_id, m.milestone_order)
      from public.change_milestones m where m.organization_id = v_org_id
    ), '[]'::jsonb),
    'integration_notes', jsonb_build_object(
      'deployment_environment', 'Extends Deployment & Environment Management (A.20)',
      'customer_success', 'Aligns adoption metrics with Customer Success (A.26)',
      'learning_training', 'Training assignments hook to Learning & Training (A.36) — metadata only',
      'human_oversight', 'High-impact changes respect Human Oversight (A.40) approval patterns'
    ),
    'integration_summaries', jsonb_build_object(
      'learning', public._cme_learning_summary(v_org_id),
      'deployment', public._cme_deployment_summary(v_org_id),
      'customer_success', public._cme_customer_success_summary(v_org_id)
    ),
    'implementation_blueprint_phase62', jsonb_build_object(
      'phase', 'Phase 62 — Change Management Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE62_CHANGE_MANAGEMENT.md',
      'engine_phase', 'Phase A.47 Change Management Engine',
      'route', '/app/change-management-engine',
      'mapping_note', 'ABOS Blueprint Phase 62 extends A.47 with human-centered change framing — communication, adoption support, resistance awareness, and leadership insights.'
    ),
    'change_management_note', 'Change Management Engine (ABOS Phase 62) — extends Phase A.47 with people-centered change adoption, readiness assessment, companion guidance, and live engagement summary.',
    'blueprint_distinction_note', public._cmbp_distinction_note(),
    'blueprint_mission', public._cmbp_mission(),
    'blueprint_philosophy', public._cmbp_philosophy(),
    'blueprint_abos_principle', public._cmbp_abos_principle(),
    'vision', 'Transformation without losing people — leaders supported, employees included; this change was handled thoughtfully.',
    'blueprint_objectives', public._cmbp_objectives(),
    'blueprint_change_types', public._cmbp_change_types(),
    'readiness_assessment', public._cmbp_readiness_assessment(),
    'companion_guidance', public._cmbp_companion_guidance(),
    'communication_support', public._cmbp_communication_support(),
    'adoption_support', public._cmbp_adoption_support(),
    'resistance_awareness', public._cmbp_resistance_awareness(),
    'self_love_connection', public._cmbp_self_love_connection(),
    'leadership_insights', public._cmbp_leadership_insights(),
    'trust_connection', public._cmbp_trust_connection(),
    'dogfooding', public._cmbp_dogfooding(),
    'blueprint_integration_links', public._cmbp_integration_links(),
    'engagement_summary', public._cmbp_engagement_summary(v_org_id),
    'success_criteria', public._cmbp_success_criteria(v_org_id),
    'vision_phrases', public._cmbp_vision_phrases(),
    'privacy_note', 'Change management data is organization-scoped, explainable, and auditable. Metadata only — no PII.',
    'implementation_blueprint_phase127', public._tcobp127_blueprint_block(v_org_id),
    'transformation_orchestration_phase127_note', 'Enterprise Intelligence Phase 127 — Transformation Orchestration & Change Companion deepens orchestration, adoption intelligence, and transformation memory on Phase 62 scaffolds. Change with people not to people — humans lead; Aipify prepares and informs.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve A.47 + Phase 62 fields; append Phase 127
-- ---------------------------------------------------------------------------
create or replace function public.get_change_management_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_engagement jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._cme_seed_initiatives(v_org_id);
  v_engagement := public._cmbp_engagement_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Structured change adoption with transparent communication and measurable outcomes.',
    'active_initiatives', coalesce((
      select count(*) from public.change_initiatives
      where organization_id = v_org_id and status in ('planning', 'in_progress')
    ), 0),
    'pending_milestones', coalesce((
      select count(*) from public.change_milestones
      where organization_id = v_org_id and status = 'pending'
    ), 0),
    'implementation_blueprint_phase62', jsonb_build_object(
      'phase', 'Phase 62 — Change Management Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE62_CHANGE_MANAGEMENT.md',
      'engine_phase', 'Phase A.47 Change Management Engine',
      'route', '/app/change-management-engine'
    ),
    'mission', public._cmbp_mission(),
    'abos_principle', public._cmbp_abos_principle(),
    'engagement_summary', v_engagement,
    'blueprint_note', 'Change Management Engine (ABOS Phase 62) — extends Phase A.47 with people-centered adoption, communication support, and live success criteria.',
    'change_note', 'Help people move confidently from one reality to another — humans lead; Aipify prepares and informs.',
    'implementation_blueprint_phase127', jsonb_build_object(
      'phase', 'Phase 127 — Transformation Orchestration & Change Companion',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE127_TRANSFORMATION_ORCHESTRATION_CHANGE_COMPANION.md',
      'spec_doc', 'TRANSFORMATION_ORCHESTRATION_CHANGE_COMPANION_ENGINE_PHASE127.md',
      'engine_phase', 'Phase A.47 Change Management Engine',
      'era', 'Enterprise Intelligence Era (121–130)',
      'route', '/app/change-management-engine'
    ),
    'phase127_mission', public._tcobp127_mission(),
    'phase127_abos_principle', public._tcobp127_abos_principle(),
    'phase127_engagement_summary', public._tcobp127_engagement_summary(v_org_id),
    'phase127_note', 'Enterprise Intelligence Phase 127 orchestrates transformation with clarity and empathy — metadata only, no employee surveillance.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._tcobp127_distinction_note() to authenticated;
grant execute on function public._tcobp127_mission() to authenticated;
grant execute on function public._tcobp127_philosophy() to authenticated;
grant execute on function public._tcobp127_abos_principle() to authenticated;
grant execute on function public._tcobp127_vision() to authenticated;
grant execute on function public._tcobp127_objectives() to authenticated;
grant execute on function public._tcobp127_orchestration_center() to authenticated;
grant execute on function public._tcobp127_roadmap_engine() to authenticated;
grant execute on function public._tcobp127_readiness_engine() to authenticated;
grant execute on function public._tcobp127_stakeholder_engagement() to authenticated;
grant execute on function public._tcobp127_change_companion() to authenticated;
grant execute on function public._tcobp127_communication_orchestration() to authenticated;
grant execute on function public._tcobp127_transformation_risk_engine() to authenticated;
grant execute on function public._tcobp127_adoption_intelligence() to authenticated;
grant execute on function public._tcobp127_transformation_memory_engine() to authenticated;
grant execute on function public._tcobp127_companion_limitations() to authenticated;
grant execute on function public._tcobp127_self_love_transformation() to authenticated;
grant execute on function public._tcobp127_knowledge_library() to authenticated;
grant execute on function public._tcobp127_cross_links() to authenticated;
grant execute on function public._tcobp127_limitation_principles() to authenticated;
grant execute on function public._tcobp127_companion_adaptation() to authenticated;
grant execute on function public._tcobp127_success_metrics() to authenticated;
grant execute on function public._tcobp127_engagement_summary(uuid) to authenticated;
grant execute on function public._tcobp127_success_criteria(uuid) to authenticated;
grant execute on function public._tcobp127_blueprint_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'transformation-orchestration-phase127', 'Transformation Orchestration & Change Companion (Enterprise Phase 127)',
  'Enterprise Intelligence Phase 127 — Transformation Orchestration & Change Companion extends A.47 + Blueprint Phase 62 with orchestration center, change companion, adoption intelligence, and transformation memory.',
  'authenticated', 110
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'transformation-orchestration-phase127' and tenant_id is null
);
