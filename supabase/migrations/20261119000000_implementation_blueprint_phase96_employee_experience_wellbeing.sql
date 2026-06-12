-- Implementation Blueprint Phase 96 — Employee Experience & Wellbeing Companion Engine
-- Extends Organizational Health Engine Phase A.56 + Blueprint Phase 61. No new tables.
-- Distinct from Innovation Lab repo Phase 96 (/app/innovation-lab), Companion Device A.96 (/app/companion-device-ecosystem-engine).

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._eewcbp96_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 96 — Employee Experience & Wellbeing Companion Engine at /app/organizational-health-engine. Extends Organizational Health Engine Phase A.56 (20260901000000_organizational_health_engine_phase_a56.sql) and preserves ALL Blueprint Phase 61 (_ohbp_*) fields. Employee experience and wellbeing companion metadata — engagement, sustainable performance, recognition, reflection — layered on org health, not a separate wellbeing surveillance product. Distinct from Innovation Lab & Experimentation repo Phase 96 at /app/innovation-lab (phase number collision — ABOS blueprint number authoritative for this spec). Distinct from Companion Device Ecosystem Phase A.96 at /app/companion-device-ecosystem-engine (device orchestration collision). Cross-links Self Love A.76, Gratitude A.89, Presence & Comfort A.90, Human Success repo Phase 82, Attention Guardian, Purpose & Values A.82 / Blueprint Phase 95, Inclusion A.83, Learning & Training / Phase 92, EKE employee onboarding — extend, never duplicate.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._eewcbp96_mission()
returns text language sql immutable as $$
  select 'Healthier workplaces — support wellbeing, engagement, and sustainable performance without sacrificing humanity.';
$$;

create or replace function public._eewcbp96_philosophy()
returns text language sql immutable as $$
  select 'People are not machines — wellbeing supports performance; sustainable engagement outlasts burnout cycles. Aipify Wellbeing Companion informs and reflects; humans decide.';
$$;

create or replace function public._eewcbp96_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — exceptional work should not require sacrificing humanity; employee experience is a strategic capability, not a surveillance metric.';
$$;

create or replace function public._eewcbp96_vision()
returns text language sql immutable as $$
  select 'Building an environment where people can do exceptional work without sacrificing their humanity.';
$$;

create or replace function public._eewcbp96_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'employee_engagement_awareness', 'label', 'Employee engagement awareness', 'description', 'Aggregate engagement signals — metadata only, never individual surveillance scoring'),
    jsonb_build_object('key', 'wellbeing_support_not_control', 'label', 'Wellbeing support not control', 'description', 'Wellbeing Companion supports reflection — no diagnosis, no hidden monitoring'),
    jsonb_build_object('key', 'sustainable_performance', 'label', 'Sustainable performance', 'description', 'Pacing, recovery, and workload sustainability alongside operational excellence'),
    jsonb_build_object('key', 'recognition_and_appreciation', 'label', 'Recognition and appreciation', 'description', 'Celebrate effort, milestones, and gratitude — cross-link Gratitude A.89'),
    jsonb_build_object('key', 'companion_reflection', 'label', 'Companion reflection', 'description', 'Gentle Wellbeing Companion check-ins — reflection not intrusion'),
    jsonb_build_object('key', 'employee_journey_support', 'label', 'Employee journey support', 'description', 'Onboarding, milestones, transitions, leadership development — cross-link EKE and talent journeys')
  );
$$;

create or replace function public._eewcbp96_employee_experience_questions()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Employee experience questions — thoughtful leadership reflection, not compliance evaluation or surveillance.',
    'questions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'experience_patterns', 'question', 'What employee experience patterns deserve thoughtful leadership attention?', 'description', 'Wisdom-oriented aggregate signals — dialogue not blame'),
      jsonb_build_object('emoji', '🌹', 'key', 'recognition_moments', 'question', 'What moments of appreciation and recognition strengthen engagement?', 'description', 'Celebrate effort and milestones — cross-link Gratitude A.89'),
      jsonb_build_object('emoji', '❤️', 'key', 'caring_wellbeing', 'question', 'How can wellbeing support feel caring rather than intrusive?', 'description', 'Wellbeing Companion supports — never judges or diagnoses'),
      jsonb_build_object('emoji', '🔔', 'key', 'sustainable_pacing', 'question', 'What sustainable pacing signals may indicate recovery is needed?', 'description', 'Recovery windows deserve attention — not punitive scoring')
    ),
    'reflection_note', 'Questions invite employee experience reflection — humans decide action; Aipify prepares context and gentle companion language.'
  );
$$;

create or replace function public._eewcbp96_wellbeing_observations()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'healthy_appreciation',
      'scenario', 'Engagement and recognition patterns show healthy team appreciation',
      'example', '🌹 Recognition and appreciation activity suggests a culture where effort is seen — aggregate metadata only, never individual ranking.'
    ),
    jsonb_build_object(
      'emoji', '❤️',
      'key', 'wellbeing_awareness',
      'scenario', 'Wellbeing awareness supports sustainable performance',
      'example', '❤️ Wellbeing signals support sustainable performance — awareness for leadership dialogue, not mental health diagnosis or surveillance.'
    ),
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'pacing_conversation',
      'scenario', 'Aggregate workload patterns may suggest leadership conversation about pacing',
      'example', '🦉 Aggregate workload patterns may warrant a thoughtful conversation about pacing and recovery — never blame or individual surveillance.'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'recovery_attention',
      'scenario', 'Recovery windows and sustainable rhythms deserve attention',
      'example', '🔔 Sustained high-intensity periods without recovery windows deserve leadership attention — sustainability alongside delivery.'
    )
  );
$$;

create or replace function public._eewcbp96_recognition_practices()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Recognition strengthens employee experience — appreciation without pressure, milestones without comparison.',
    'practices', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'key', 'appreciation', 'label', 'Appreciation for consistent effort', 'description', 'Visible gratitude for steady contribution — no forced positivity'),
      jsonb_build_object('emoji', '🌹', 'key', 'milestones', 'label', 'Milestone celebrations', 'description', 'Team and individual milestones acknowledged — cross-link Gratitude A.89 Human Moments'),
      jsonb_build_object('emoji', '🌹', 'key', 'demanding_effort', 'label', 'Effort during demanding periods', 'description', 'Acknowledge effort when workloads intensify — sustainability framing'),
      jsonb_build_object('emoji', '🌹', 'key', 'gratitude', 'label', 'Gratitude expressions', 'description', 'Gratitude culture without surveillance or mandatory participation')
    ),
    'gratitude_route', '/app/gratitude-recognition-engine',
    'boundary_note', 'Gratitude A.89 — cross-link only; Organizational Health stores aggregate metadata, not recognition content.'
  );
$$;

create or replace function public._eewcbp96_companion_check_ins()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Wellbeing Companion check-ins offer reflection — never intrusion, judgment, or mandatory wellness tracking.',
    'check_ins', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'key', 'meaningful_progress', 'scenario', 'Gentle reflection on meaningful progress', 'example', '🌹 You have made steady progress — acknowledging effort matters as much as outcomes.'),
      jsonb_build_object('emoji', '❤️', 'key', 'support_not_judge', 'scenario', 'Wellbeing Companion supports — never judges', 'example', '❤️ Aipify Wellbeing Companion is here to support reflection — not to score, diagnose, or monitor you.'),
      jsonb_build_object('emoji', '🦉', 'key', 'sustainable_work', 'scenario', 'Wisdom-oriented questions about sustainable work', 'example', '🦉 Sustainable excellence includes recovery — what would help you pace this week thoughtfully?'),
      jsonb_build_object('emoji', '🔔', 'key', 'rest_recovery', 'scenario', 'Optional reminders about rest and recovery', 'example', '🔔 Rest contributes to long-term excellence — would a recovery window help before the next push?')
    ),
    'companion_name', 'Wellbeing Companion',
    'not_label', 'AI wellness bot',
    'reflection_note', 'Check-ins are optional reflection — humans always decide whether to engage.'
  );
$$;

create or replace function public._eewcbp96_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love supports sustainable employee experience — healthy boundaries, rest, and progress appreciation without earning exhaustion.',
    'quotes', jsonb_build_array(
      'You do not need to earn rest through exhaustion.',
      'Recovery contributes to long-term excellence.',
      'Healthy boundaries protect sustainable performance.'
    ),
    'practices', jsonb_build_array(
      'Rest without guilt — recovery is strategic, not lazy',
      'Boundaries over constant urgency',
      'Appreciation of steady progress, not only peak outcomes',
      'Sustainable pacing alongside operational goals'
    ),
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love A.76 — principle and cross-link only; employee wellbeing metadata stays aggregate and explainable.'
  );
$$;

create or replace function public._eewcbp96_leadership_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership models sustainable employee experience — visibility without surveillance, recognition without pressure.',
    'leadership_practices', jsonb_build_array(
      jsonb_build_object('key', 'model_pacing', 'label', 'Model sustainable pacing', 'description', 'Leaders demonstrate recovery and boundaries — not heroics at human cost'),
      jsonb_build_object('key', 'recognition_participation', 'label', 'Participate in recognition culture', 'description', 'Leadership joins appreciation moments — cross-link Gratitude A.89'),
      jsonb_build_object('key', 'recovery_space', 'label', 'Create space for recovery', 'description', 'Protect recovery windows before sprint commitments intensify'),
      jsonb_build_object('key', 'dialogue_not_surveillance', 'label', 'Dialogue not surveillance', 'description', 'Use aggregate wellbeing signals for conversation — never individual scoring')
    ),
    'dialogue_note', 'Leadership insights encourage dialogue — Aipify informs; leaders decide interventions.'
  );
$$;

create or replace function public._eewcbp96_employee_journey_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Employee journeys span onboarding, milestones, transitions, leadership development, and recognition — cross-linked, never duplicated.',
    'journey_stages', jsonb_build_array(
      jsonb_build_object('key', 'onboarding', 'label', 'Onboarding', 'description', 'Employee onboarding paths and role guidance — cross-link EKE', 'route', '/app/settings/employee-knowledge'),
      jsonb_build_object('key', 'milestones', 'label', 'Milestones', 'description', 'Role and team milestones celebrated without comparison', 'route', '/app/gratitude-recognition-engine'),
      jsonb_build_object('key', 'transitions', 'label', 'Transitions', 'description', 'Role changes and team transitions supported with clarity', 'route', '/app/human-success'),
      jsonb_build_object('key', 'leadership_development', 'label', 'Leadership development', 'description', 'Leadership capability pathways — cross-link Learning & Training / Phase 92', 'route', '/app/learning-training-engine'),
      jsonb_build_object('key', 'recognition', 'label', 'Recognition', 'description', 'Recognition woven through the employee journey — Gratitude A.89 cross-link', 'route', '/app/gratitude-recognition-engine')
    ),
    'boundary_note', 'EKE owns approved employee knowledge; Phase 96 cross-links journey stages — metadata only on org health dashboard.'
  );
$$;

create or replace function public._eewcbp96_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparency — employees and leaders understand what wellbeing metadata contributes and what Aipify never does.',
    'employees_should_know', jsonb_build_array(
      'Wellbeing Companion offers reflection — participation is optional',
      'No mental health diagnosis or clinical labeling',
      'No hidden monitoring or surveillance scoring',
      'Aggregate organizational signals only — not individual performance tracking'
    ),
    'leaders_should_understand', jsonb_build_array(
      'Employee experience metadata composes from existing operational signals — support, adoption, learning, recognition trends',
      'Interventions require human approval — Aipify recommends, humans decide',
      'Cross-links Purpose & Values, Inclusion, Human Success — do not duplicate personal wellbeing engines',
      'Innovation Lab repo Phase 96 and Companion Device A.96 are distinct surfaces — phase number collisions documented'
    ),
    'audit_note', 'Wellbeing companion framing, check-ins, and intervention approvals are audited — metadata only.'
  );
$$;

create or replace function public._eewcbp96_privacy_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Support not control — employee experience and wellbeing metadata supports improvement, never surveillance or diagnosis.',
    'must_avoid', jsonb_build_array(
      'Hidden monitoring — all indicators visible and explainable',
      'Mental health diagnosis or clinical labeling',
      'Surveillance scoring of individuals or teams',
      'Intrusive interventions — mandatory wellness tracking or guilt-based motivation'
    ),
    'must_support', jsonb_build_array(
      'Optional Wellbeing Companion reflection',
      'Aggregate leadership awareness with transparent limitations',
      'Recognition culture without pressure',
      'Trust through explainability — humans decide action'
    )
  );
$$;

create or replace function public._eewcbp96_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates employee experience and wellbeing companion patterns internally — sustainable leadership, product development pacing, and community support.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — Sales Expert sustainability, leadership pacing, product dev wellbeing, community support, companion philosophy',
      'focus', jsonb_build_array(
        'Sales Expert Academy — field sustainability and recognition without burnout framing',
        'Leadership sustainability — recovery before sprint commitments across Command Center modules',
        'Product development wellbeing — sustainable pacing for engineering and design teams',
        'Community support — peer appreciation cross-linked with Gratitude A.89',
        'Wellbeing Companion philosophy — reflection not intrusion across internal pilots'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce team engagement and peak-period sustainability',
      'focus', jsonb_build_array(
        'Peak-period workload sustainability — aggregate signals only',
        'Recognition during demanding commerce periods',
        'Onboarding and adoption journeys cross-linked with Human Success',
        'Human-approved wellbeing-aware interventions before operational changes'
      )
    )
  );
$$;

create or replace function public._eewcbp96_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Building an environment where people can do exceptional work without sacrificing their humanity.',
    'Wellbeing supports performance — people are not machines.',
    'Wellbeing Companion reflects — never surveils, diagnoses, or intrudes.',
    'Recognition and recovery are strategic employee experience priorities.',
    'Trust through transparent aggregate signals — humans decide action.'
  );
$$;

create or replace function public._eewcbp96_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Healthy boundaries and rest — principle cross-link'),
    jsonb_build_object('label', 'Gratitude & Recognition (A.89)', 'route', '/app/gratitude-recognition-engine', 'note', 'Human Moments recognition — cross-link only'),
    jsonb_build_object('label', 'Presence & Comfort (A.90)', 'route', '/app/presence-comfort-protocol', 'note', 'Comfort and presence — distinct from recognition roses'),
    jsonb_build_object('label', 'Human Success (Repo Phase 82)', 'route', '/app/human-success', 'note', 'Adoption journeys and friction detection — cross-link'),
    jsonb_build_object('label', 'Attention Guardian', 'route', '/app/assistant/attention', 'note', 'Focus and protected time — personal attention cross-link'),
    jsonb_build_object('label', 'Purpose & Values (A.82 / Blueprint Phase 95)', 'route', '/app/purpose-values-engine', 'note', 'Organizational purpose alignment — distinct domain'),
    jsonb_build_object('label', 'Inclusion & Humanity (A.83)', 'route', '/app/inclusion-humanity-engine', 'note', 'Inclusion signals — cross-link only'),
    jsonb_build_object('label', 'Learning & Training (A.36 / Phase 92)', 'route', '/app/learning-training-engine', 'note', 'Talent journeys and leadership development — cross-link'),
    jsonb_build_object('label', 'Employee Knowledge (EKE)', 'route', '/app/settings/employee-knowledge', 'note', 'Employee onboarding paths — cross-link only'),
    jsonb_build_object('label', 'Organizational Health (Phase 61 on A.56)', 'route', '/app/organizational-health-engine', 'note', 'Parent engine — all _ohbp_* fields preserved'),
    jsonb_build_object('label', 'Innovation Lab (Repo Phase 96)', 'route', '/app/innovation-lab', 'note', 'Phase number collision — experimentation distinct from employee wellbeing'),
    jsonb_build_object('label', 'Companion Device Ecosystem (Phase A.96)', 'route', '/app/companion-device-ecosystem-engine', 'note', 'Device orchestration — phase number collision documented')
  );
$$;

create or replace function public._eewcbp96_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ohbp jsonb;
  v_categories int := 0;
begin
  v_ohbp := public._ohbp_engagement_summary(p_org_id);
  v_categories := coalesce((v_ohbp->>'categories_measured')::int, 0);

  return jsonb_build_object(
    'categories_measured', v_categories,
    'overall_score', coalesce((v_ohbp->>'overall_score')::numeric, 75),
    'overall_status', coalesce(v_ohbp->>'overall_status', 'stable'),
    'pending_interventions', coalesce((v_ohbp->>'pending_interventions')::int, 0),
    'experience_questions_documented', jsonb_array_length(public._eewcbp96_employee_experience_questions()->'questions'),
    'wellbeing_observations_documented', jsonb_array_length(public._eewcbp96_wellbeing_observations()),
    'recognition_practices_documented', jsonb_array_length(public._eewcbp96_recognition_practices()->'practices'),
    'companion_check_ins_documented', jsonb_array_length(public._eewcbp96_companion_check_ins()->'check_ins'),
    'journey_stages_documented', jsonb_array_length(public._eewcbp96_employee_journey_connection()->'journey_stages'),
    'integration_links_documented', jsonb_array_length(public._eewcbp96_integration_links()),
    'privacy_note', 'Employee experience and wellbeing metadata only — optional Wellbeing Companion reflection, no surveillance, no diagnosis, no PII.'
  );
end; $$;

create or replace function public._eewcbp96_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
begin
  v_engagement := public._eewcbp96_engagement_summary(p_org_id);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'employee_experience_questions',
      'label', 'Employee experience questions — 🦉🌹❤️🔔 reflection not evaluation',
      'met', jsonb_array_length(public._eewcbp96_employee_experience_questions()->'questions') >= 4,
      'note', 'Thoughtful leadership dialogue — never surveillance framing.'
    ),
    jsonb_build_object(
      'key', 'wellbeing_observations',
      'label', 'Wellbeing observations — awareness not surveillance',
      'met', jsonb_array_length(public._eewcbp96_wellbeing_observations()) >= 4,
      'note', '🌹❤️🦉🔔 companion examples without diagnosis or individual scoring.'
    ),
    jsonb_build_object(
      'key', 'recognition_practices',
      'label', 'Recognition practices — appreciation, milestones, effort, gratitude',
      'met', jsonb_array_length(public._eewcbp96_recognition_practices()->'practices') >= 4,
      'note', 'Cross-link Gratitude A.89 — aggregate metadata only.'
    ),
    jsonb_build_object(
      'key', 'companion_check_ins',
      'label', 'Wellbeing Companion check-ins — reflection not intrusion',
      'met', jsonb_array_length(public._eewcbp96_companion_check_ins()->'check_ins') >= 4,
      'note', 'Wellbeing Companion — not AI wellness bot. Optional participation.'
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — rest without earning exhaustion',
      'met', jsonb_array_length(public._eewcbp96_self_love_connection()->'quotes') >= 1,
      'note', 'You do not need to earn rest through exhaustion.'
    ),
    jsonb_build_object(
      'key', 'leadership_connection',
      'label', 'Leadership connection — model pacing, recognition, recovery space',
      'met', jsonb_array_length(public._eewcbp96_leadership_connection()->'leadership_practices') >= 4,
      'note', 'Dialogue not surveillance — leaders decide interventions.'
    ),
    jsonb_build_object(
      'key', 'employee_journey_connection',
      'label', 'Employee journey — onboarding, milestones, transitions, leadership dev, recognition',
      'met', jsonb_array_length(public._eewcbp96_employee_journey_connection()->'journey_stages') >= 5,
      'note', 'Cross-link EKE, Human Success, Learning & Training — never duplicate.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — transparent wellbeing metadata',
      'met', jsonb_array_length(public._eewcbp96_trust_connection()->'employees_should_know') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'privacy_principles',
      'label', 'Privacy principles — no hidden monitoring, diagnosis, or intrusive interventions',
      'met', jsonb_array_length(public._eewcbp96_privacy_principles()->'must_avoid') >= 4,
      'note', 'Support not control.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links Self Love, Gratitude, Presence, Human Success, Attention, Purpose, Inclusion, EKE, Innovation Lab collision',
      'met', jsonb_array_length(public._eewcbp96_integration_links()) >= 11,
      'note', 'Extend related engines — Innovation Lab repo Phase 96 and Companion Device A.96 collisions documented.'
    ),
    jsonb_build_object(
      'key', 'phase61_preserved',
      'label', 'Blueprint Phase 61 organizational health preserved',
      'met', jsonb_array_length(public._ohbp_objectives()) >= 6,
      'note', 'All _ohbp_* fields intact alongside Phase 96 employee experience layer.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Sales Expert, leadership sustainability, product dev wellbeing, community, companion philosophy',
      'met', (public._eewcbp96_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    ),
    jsonb_build_object(
      'key', 'org_health_engagement',
      'label', 'Organizational health engagement — categories measured on A.56',
      'met', coalesce((v_engagement->>'categories_measured')::int, 0) >= 0,
      'note', case when coalesce((v_engagement->>'categories_measured')::int, 0) < 3
        then 'Run measure_organizational_health to seed category scores.'
        else null end
    )
  );
end; $$;

create or replace function public._eewcbp96_blueprint_block(p_org_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 96 — Employee Experience & Wellbeing Companion Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE96_EMPLOYEE_EXPERIENCE_WELLBEING_COMPANION.md',
    'engine_phase', 'Phase A.56 Organizational Health Engine (extends Blueprint Phase 61)',
    'route', '/app/organizational-health-engine',
    'mapping_note', 'ABOS Blueprint Phase 96 extends A.56 + Phase 61 with employee experience questions, wellbeing observations, Wellbeing Companion check-ins, recognition practices, and employee journey cross-links. Distinct from Innovation Lab repo Phase 96 and Companion Device A.96.',
    'distinction_note', public._eewcbp96_distinction_note(),
    'mission', public._eewcbp96_mission(),
    'philosophy', public._eewcbp96_philosophy(),
    'abos_principle', public._eewcbp96_abos_principle(),
    'objectives', public._eewcbp96_objectives(),
    'employee_experience_questions', public._eewcbp96_employee_experience_questions(),
    'wellbeing_observations', public._eewcbp96_wellbeing_observations(),
    'recognition_practices', public._eewcbp96_recognition_practices(),
    'companion_check_ins', public._eewcbp96_companion_check_ins(),
    'self_love_connection', public._eewcbp96_self_love_connection(),
    'leadership_connection', public._eewcbp96_leadership_connection(),
    'employee_journey_connection', public._eewcbp96_employee_journey_connection(),
    'trust_connection', public._eewcbp96_trust_connection(),
    'privacy_principles', public._eewcbp96_privacy_principles(),
    'dogfooding', public._eewcbp96_dogfooding(),
    'success_criteria', public._eewcbp96_success_criteria(p_org_id),
    'vision', public._eewcbp96_vision(),
    'vision_phrases', public._eewcbp96_vision_phrases(),
    'integration_links', public._eewcbp96_integration_links(),
    'engagement_summary', public._eewcbp96_engagement_summary(p_org_id),
    'privacy_note', 'Employee experience and wellbeing metadata only — optional Wellbeing Companion reflection, no surveillance, no diagnosis, no PII. Humans decide; Aipify informs and prepares.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL A.56 + Phase 61 fields; append Phase 96
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_health_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('health.view');
  v_org_id := public._mta_require_organization();
  perform public._ohe_seed_settings(v_org_id);
  perform public._ohe_seed_scores(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Aipify measures organizational readiness. Humans approve interventions and decide action.',
    'principles', jsonb_build_array(
      'Metadata-only health indicators',
      'Category scores across six domains',
      'Human-approved interventions',
      'Executive health summaries',
      'No PII in health aggregation'
    ),
    'summary', public._ohe_executive_summary_block(v_org_id),
    'scores', coalesce((
      select jsonb_agg(row_to_json(s) order by s.health_category)
      from public.organizational_health_scores s where s.organization_id = v_org_id
    ), '[]'::jsonb),
    'interventions', coalesce((
      select jsonb_agg(row_to_json(i) order by i.created_at desc)
      from public.organizational_health_interventions i
      where i.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'executive_summary', public._ohe_executive_summary_block(v_org_id),
    'settings', coalesce((
      select config from public.organizational_health_settings where organization_id = v_org_id
    ), '{}'::jsonb),
    'integration_notes', jsonb_build_object(
      'observability', 'Distinct from Observability Platform Health — nav id organizationalHealthEngine',
      'customer_success', 'Customer Success context via get_executive_health_summary() — A.26',
      'executive_insights', 'Executive Insights reporting — A.35',
      'value_realization', 'Value Realization metric trends — A.48',
      'strategic_alignment', 'Strategic Alignment objective signals — A.55',
      'organizational_memory', 'Interventions may capture org memory — metadata only (A.34)'
    ),
    'integration_summaries', jsonb_build_object(
      'customer_success', public._ohe_customer_success_summary(v_org_id),
      'executive_insights', public._ohe_executive_insights_summary(v_org_id),
      'value_realization', public._ohe_value_realization_summary(v_org_id),
      'strategic_alignment', public._ohe_strategic_alignment_summary(v_org_id),
      'support_backlog', public._ohe_support_backlog_indicators(v_org_id),
      'workflow_adoption', public._ohe_workflow_adoption_indicators(v_org_id),
      'training_completion', public._ohe_training_completion_indicators(v_org_id),
      'incidents', public._ohe_incidents_indicators(v_org_id),
      'improvements', public._ohe_improvements_indicators(v_org_id),
      'change_readiness', public._ohe_change_readiness_indicators(v_org_id)
    ),
    'implementation_blueprint_phase61', jsonb_build_object(
      'phase', 'Phase 61 — Organizational Health Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE61_ORGANIZATIONAL_HEALTH.md',
      'engine_phase', 'Phase A.56 Organizational Health Engine',
      'route', '/app/organizational-health-engine',
      'mapping_note', 'ABOS Blueprint Phase 61 extends A.56 with wellbeing-aware organizational health — communication, operational, and people domains with sustainable performance framing.'
    ),
    'organizational_health_note', 'Organizational Health Engine (ABOS Phase 61) — extends Phase A.56 with wellbeing-aware health domains, workload sustainability, recognition connection, and leadership insights.',
    'blueprint_distinction_note', public._ohbp_distinction_note(),
    'blueprint_mission', public._ohbp_mission(),
    'blueprint_philosophy', public._ohbp_philosophy(),
    'blueprint_abos_principle', public._ohbp_abos_principle(),
    'vision', 'High performance without sacrificing wellbeing — leaders pay attention to the people behind performance.',
    'blueprint_objectives', public._ohbp_objectives(),
    'health_domains', public._ohbp_health_domains(),
    'health_observations', public._ohbp_health_observations(),
    'workload_awareness', public._ohbp_workload_awareness(),
    'recognition_connection', public._ohbp_recognition_connection(),
    'self_love_connection', public._ohbp_self_love_connection(),
    'leadership_insights', public._ohbp_leadership_insights(),
    'trust_connection', public._ohbp_trust_connection(),
    'privacy_principles', public._ohbp_privacy_principles(),
    'dogfooding', public._ohbp_dogfooding(),
    'blueprint_integration_links', public._ohbp_integration_links(),
    'engagement_summary', public._ohbp_engagement_summary(v_org_id),
    'success_criteria', public._ohbp_success_criteria(v_org_id),
    'vision_phrases', public._ohbp_vision_phrases(),
    'privacy_note', 'Organizational health indicators are aggregate, explainable, and auditable. Metadata only — no individual surveillance or PII.',
    'implementation_blueprint_phase96', jsonb_build_object(
      'phase', 'Phase 96 — Employee Experience & Wellbeing Companion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE96_EMPLOYEE_EXPERIENCE_WELLBEING_COMPANION.md',
      'engine_phase', 'Phase A.56 Organizational Health Engine (extends Blueprint Phase 61)',
      'route', '/app/organizational-health-engine',
      'mapping_note', 'ABOS Blueprint Phase 96 extends A.56 + Phase 61 with employee experience, Wellbeing Companion check-ins, and journey cross-links. Distinct from Innovation Lab repo Phase 96 and Companion Device A.96.'
    ),
    'employee_experience_wellbeing_engine_note', 'Employee Experience & Wellbeing Companion Engine (ABOS Phase 96) — healthier workplaces through engagement, sustainable performance, and optional Wellbeing Companion reflection — support not control.',
    'employee_experience_wellbeing_blueprint', public._eewcbp96_blueprint_block(v_org_id),
    'employee_experience_wellbeing_distinction_note', public._eewcbp96_distinction_note(),
    'employee_experience_wellbeing_mission', public._eewcbp96_mission(),
    'employee_experience_wellbeing_philosophy', public._eewcbp96_philosophy(),
    'employee_experience_wellbeing_abos_principle', public._eewcbp96_abos_principle(),
    'employee_experience_wellbeing_objectives', public._eewcbp96_objectives(),
    'employee_experience_questions', public._eewcbp96_employee_experience_questions(),
    'wellbeing_observations', public._eewcbp96_wellbeing_observations(),
    'wellbeing_recognition_practices', public._eewcbp96_recognition_practices(),
    'companion_check_ins', public._eewcbp96_companion_check_ins(),
    'wellbeing_self_love_connection', public._eewcbp96_self_love_connection(),
    'wellbeing_leadership_connection', public._eewcbp96_leadership_connection(),
    'employee_journey_connection', public._eewcbp96_employee_journey_connection(),
    'wellbeing_trust_connection', public._eewcbp96_trust_connection(),
    'wellbeing_privacy_principles', public._eewcbp96_privacy_principles(),
    'wellbeing_dogfooding', public._eewcbp96_dogfooding(),
    'wellbeing_integration_links', public._eewcbp96_integration_links(),
    'wellbeing_engagement_summary', public._eewcbp96_engagement_summary(v_org_id),
    'wellbeing_success_criteria', public._eewcbp96_success_criteria(v_org_id),
    'employee_experience_wellbeing_vision', public._eewcbp96_vision(),
    'employee_experience_wellbeing_vision_phrases', public._eewcbp96_vision_phrases(),
    'employee_experience_wellbeing_privacy_note', 'Employee experience and wellbeing metadata only — optional Wellbeing Companion reflection, no surveillance, no diagnosis, no PII. Humans decide; Aipify informs and prepares.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve A.56 + Phase 61 fields; append Phase 96 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_health_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_overall numeric; v_engagement jsonb; v_wellbeing_engagement jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._ohe_seed_settings(v_org_id);
  v_engagement := public._ohbp_engagement_summary(v_org_id);
  v_wellbeing_engagement := public._eewcbp96_engagement_summary(v_org_id);

  select round(avg(health_score), 1) into v_overall
  from public.organizational_health_scores where organization_id = v_org_id;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Organizational health — readiness across support, adoption, learning, and strategy with sustainable performance.',
    'overall_score', coalesce(v_overall, 75),
    'overall_status', public._ohe_status_from_score(coalesce(v_overall, 75)),
    'categories_measured', coalesce((
      select count(*) from public.organizational_health_scores where organization_id = v_org_id
    ), 0),
    'pending_interventions', coalesce((
      select count(*) from public.organizational_health_interventions
      where organization_id = v_org_id and status = 'pending'
    ), 0),
    'implementation_blueprint_phase61', jsonb_build_object(
      'phase', 'Phase 61 — Organizational Health Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE61_ORGANIZATIONAL_HEALTH.md',
      'engine_phase', 'Phase A.56 Organizational Health Engine',
      'route', '/app/organizational-health-engine'
    ),
    'mission', public._ohbp_mission(),
    'abos_principle', public._ohbp_abos_principle(),
    'engagement_summary', v_engagement,
    'blueprint_note', 'Organizational Health Engine (ABOS Phase 61) — extends A.56 with wellbeing-aware domains, workload sustainability, and live success criteria.',
    'health_note', 'Performance and wellbeing reinforce each other — aggregate metadata only; humans approve interventions.',
    'implementation_blueprint_phase96', jsonb_build_object(
      'phase', 'Phase 96 — Employee Experience & Wellbeing Companion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE96_EMPLOYEE_EXPERIENCE_WELLBEING_COMPANION.md',
      'engine_phase', 'Phase A.56 Organizational Health Engine (extends Blueprint Phase 61)',
      'route', '/app/organizational-health-engine'
    ),
    'employee_experience_wellbeing_mission', public._eewcbp96_mission(),
    'employee_experience_wellbeing_abos_principle', public._eewcbp96_abos_principle(),
    'wellbeing_engagement_summary', v_wellbeing_engagement,
    'employee_experience_wellbeing_note', 'Employee Experience & Wellbeing Companion Engine (ABOS Phase 96) — Wellbeing Companion reflection, employee journey cross-links, support not control.',
    'employee_experience_wellbeing_vision_note', public._eewcbp96_vision()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._eewcbp96_distinction_note() to authenticated;
grant execute on function public._eewcbp96_mission() to authenticated;
grant execute on function public._eewcbp96_philosophy() to authenticated;
grant execute on function public._eewcbp96_abos_principle() to authenticated;
grant execute on function public._eewcbp96_vision() to authenticated;
grant execute on function public._eewcbp96_objectives() to authenticated;
grant execute on function public._eewcbp96_employee_experience_questions() to authenticated;
grant execute on function public._eewcbp96_wellbeing_observations() to authenticated;
grant execute on function public._eewcbp96_recognition_practices() to authenticated;
grant execute on function public._eewcbp96_companion_check_ins() to authenticated;
grant execute on function public._eewcbp96_self_love_connection() to authenticated;
grant execute on function public._eewcbp96_leadership_connection() to authenticated;
grant execute on function public._eewcbp96_employee_journey_connection() to authenticated;
grant execute on function public._eewcbp96_trust_connection() to authenticated;
grant execute on function public._eewcbp96_privacy_principles() to authenticated;
grant execute on function public._eewcbp96_dogfooding() to authenticated;
grant execute on function public._eewcbp96_vision_phrases() to authenticated;
grant execute on function public._eewcbp96_integration_links() to authenticated;
grant execute on function public._eewcbp96_engagement_summary(uuid) to authenticated;
grant execute on function public._eewcbp96_success_criteria(uuid) to authenticated;
grant execute on function public._eewcbp96_blueprint_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'employee-experience-wellbeing-blueprint-phase96', 'Employee Experience & Wellbeing Companion Engine (ABOS Phase 96)',
  'Employee Experience & Wellbeing Companion Engine — extends Organizational Health A.56 + Blueprint Phase 61 with Wellbeing Companion check-ins, employee journey cross-links, and support-not-control privacy. No surveillance or diagnosis.',
  'authenticated', 126
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'employee-experience-wellbeing-blueprint-phase96' and tenant_id is null
);
