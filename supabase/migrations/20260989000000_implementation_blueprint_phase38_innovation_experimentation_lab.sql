-- Implementation Blueprint Phase 38 — Innovation & Experimentation Lab Engine
-- Extends Innovation Lab & Experimentation Engine (Phase 96). No new tables.

create or replace function public._ielbp_mission()
returns text language sql immutable as $$
  select 'Structured experimentation — curiosity not recklessness. Innovation as a repeatable organizational capability.';
$$;

create or replace function public._ielbp_philosophy()
returns text language sql immutable as $$
  select 'Innovation without chaos — responsible creativity with accountability, visibility, and learning from every outcome.';
$$;

create or replace function public._ielbp_abos_principle()
returns text language sql immutable as $$
  select 'Curiosity with structure — experiments teach the organization; failure defines learning, not people.';
$$;

create or replace function public._ielbp_blueprint_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'idea_generation', 'label', 'Idea generation', 'description', 'Capture improvement opportunities from support, operations, leadership, partners, and analytics — metadata only'),
    jsonb_build_object('key', 'experiment_tracking', 'label', 'Experiment tracking', 'description', 'Hypothesis through recommendation with visible stages, progress, and accountable stakeholders'),
    jsonb_build_object('key', 'pilot_programs', 'label', 'Pilot programs', 'description', 'Controlled participant cohorts with success criteria before broad rollout'),
    jsonb_build_object('key', 'controlled_testing', 'label', 'Controlled testing', 'description', 'Sandbox isolation, feature flags, and exposure limits — experimental vs production clearly separated'),
    jsonb_build_object('key', 'learning_documentation', 'label', 'Learning documentation', 'description', 'Lessons learned, pivots, and reusable insights routed toward organizational memory'),
    jsonb_build_object('key', 'innovation_recognition', 'label', 'Innovation recognition', 'description', 'Celebrate effort and learning — not only successful outcomes')
  );
$$;

create or replace function public._ielbp_blueprint_idea_management()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Ideas move through transparent stages — submit, categorize, prioritize, collaborate, and monitor status with human approval gates.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'submit', 'label', 'Submit', 'description', 'Structured intake with problem statement, proposed solution, and expected outcomes'),
      jsonb_build_object('key', 'categorize', 'label', 'Categorize', 'description', 'Source, target audience, risk level, and estimated effort for prioritization'),
      jsonb_build_object('key', 'prioritize', 'label', 'Prioritize', 'description', 'Customer value, strategic alignment, and feasibility scores — humans decide ranking'),
      jsonb_build_object('key', 'collaborate', 'label', 'Collaborate', 'description', 'Reviews, co-creation channels, and cross-functional visibility'),
      jsonb_build_object('key', 'monitor', 'label', 'Monitor status', 'description', 'Pipeline visibility from submitted through implemented or archived')
    ),
    'example_domains', jsonb_build_array(
      jsonb_build_object('domain', 'support_workflows', 'label', 'Support workflow innovations', 'examples', jsonb_build_array('Triage automation experiments', 'Escalation path improvements', 'Knowledge gap closure pilots')),
      jsonb_build_object('domain', 'knowledge_center', 'label', 'Knowledge Center improvements', 'examples', jsonb_build_array('Article structure experiments', 'Search discoverability tests', 'Localized guidance pilots')),
      jsonb_build_object('domain', 'customer_experience', 'label', 'Customer experience enhancements', 'examples', jsonb_build_array('Assistant tone pilots', 'Notification timing tests', 'Onboarding flow experiments')),
      jsonb_build_object('domain', 'process_innovation', 'label', 'Process innovations', 'examples', jsonb_build_array('Approval workflow simplification', 'Cross-team handoff improvements', 'Automation discovery pilots'))
    ),
    'route', '/app/innovation-lab'
  );
$$;

create or replace function public._ielbp_blueprint_experimentation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Every experiment documents objectives, success criteria, timeframes, risks, evaluation methods, and responsible stakeholders — experiments remain visible.',
    'required_elements', jsonb_build_array(
      jsonb_build_object('key', 'objectives', 'label', 'Objectives', 'description', 'Clear hypothesis and intended outcome — what are we testing and why?'),
      jsonb_build_object('key', 'success_criteria', 'label', 'Success criteria', 'description', 'Measurable signals before execution begins — agreed with stakeholders'),
      jsonb_build_object('key', 'timeframes', 'label', 'Timeframes', 'description', 'Bounded execution windows — experiments do not run indefinitely without review'),
      jsonb_build_object('key', 'risks', 'label', 'Risks', 'description', 'Risk level, sandbox isolation, and rollback plan documented upfront'),
      jsonb_build_object('key', 'evaluation_methods', 'label', 'Evaluation methods', 'description', 'Measurement plan, participant feedback, and scorecard metrics'),
      jsonb_build_object('key', 'stakeholders', 'label', 'Responsible stakeholders', 'description', 'Executive approval, governance review, and audit visibility when required')
    ),
    'visibility_note', 'Experiment status, stage, and progress remain visible on the Innovation Lab dashboard — no hidden trials.',
    'boundary', 'Experiments validate ideas in controlled conditions — distinct from Simulation Lab forecasting at /app/simulations.'
  );
$$;

create or replace function public._ielbp_blueprint_companion_innovation_support()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'aligned_with_priorities',
      'scenario', 'Aligned with priorities — thoughtful innovation pacing',
      'example', '🦉 Your governance workflow experiment aligns with this quarter''s operational priorities — worth advancing to pilot with executive approval.'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'collaboration_opportunity',
      'scenario', 'Collaboration opportunity — cross-team co-creation',
      'example', '🌹 Support and operations teams both submitted related workflow ideas — a joint experiment could reduce duplicate effort and strengthen adoption.'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'experiment_milestone',
      'scenario', 'Experiment milestone — visible progress',
      'example', '🔔 The messaging tone experiment reached analysis stage — participant feedback is ready for your review before a recommendation.'
    ),
    jsonb_build_object(
      'emoji', '❤️',
      'key', 'learning_from_unsuccessful',
      'scenario', 'Learning from unsuccessful experiments — psychological safety',
      'example', '❤️ The automation discovery experiment did not meet success criteria — the lesson learned is documented and reusable; the effort still moved the organization forward.'
    )
  );
$$;

create or replace function public._ielbp_blueprint_learning_capture()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Every experiment contributes organizational knowledge — what worked, what did not, unexpected observations, next steps, and reusable insights.',
    'capture_fields', jsonb_build_array(
      jsonb_build_object('key', 'what_worked', 'label', 'What worked', 'description', 'Validated hypotheses and positive signals worth repeating'),
      jsonb_build_object('key', 'what_did_not', 'label', 'What did not work', 'description', 'Invalidated assumptions — learning, not blame'),
      jsonb_build_object('key', 'unexpected', 'label', 'Unexpected observations', 'description', 'Surprises that inform future experiments and operations'),
      jsonb_build_object('key', 'next_steps', 'label', 'Next steps', 'description', 'Pivot, scale, archive, or follow-up experiment recommendations'),
      jsonb_build_object('key', 'reusable_insights', 'label', 'Reusable insights', 'description', 'Patterns transferable to other teams or domains')
    ),
    'organizational_memory_route', '/app/organizational-memory-engine',
    'cross_link_note', 'Innovation Lab lessons feed Organizational Memory A.34 — metadata only, no PII in RPC payloads.',
    'failure_framing', 'Unsuccessful experiments define learning — failure does not define people.'
  );
$$;

create or replace function public._ielbp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Psychological safety for innovation — healthy curiosity, celebrate learning, compassion toward imperfection.',
    'practices', jsonb_build_array(
      'Experiments are safe to try — unsuccessful outcomes are learning opportunities',
      'Celebrate effort and insight — not only winning experiments',
      'Compassion toward imperfection — iteration is expected, not shameful',
      'Healthy curiosity — explore ideas without recklessness or production risk'
    ),
    'self_love_route', '/app/self-love-engine',
    'naming_doc', 'SELF_LOVE_NAMING_STANDARD.md',
    'boundary_note', 'Self Love is a principle — Innovation Lab stores experiment metadata, not wellbeing content.'
  );
$$;

create or replace function public._ielbp_blueprint_recognition_experiences()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Recognition celebrates effort and learning — not only successful outcomes.',
    'experiences', jsonb_build_array(
      jsonb_build_object('emoji', '🔔', 'key', 'innovation_contributor', 'label', 'Innovation Contributor', 'description', 'Submitted or advanced an idea through review — contribution matters'),
      jsonb_build_object('emoji', '🌹', 'key', 'collaboration_champion', 'label', 'Collaboration Champion', 'description', 'Enabled cross-team co-creation on experiments or pilots'),
      jsonb_build_object('emoji', '🦉', 'key', 'insight_discovery', 'label', 'Insight Discovery', 'description', 'Captured a reusable lesson — success, pivot, or learning outcome')
    ),
    'gratitude_route', '/app/gratitude-recognition-engine',
    'cross_link_note', 'Extends Gratitude & Recognition A.89 — cross-link recognition experiences; do not duplicate gratitude tables.'
  );
$$;

create or replace function public._ielbp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Experimental vs production separation, documented risks, transparent evaluation, and clear approval ownership.',
    'users_should_know', jsonb_build_array(
      'Sandbox and pilot environments are isolated from production by default',
      'Executive approval may be required before experiments advance — settings visible on dashboard',
      'Risk levels and governance controls apply to every experiment',
      'Innovation scorecard and audit logs use metadata — no customer PII in payloads'
    ),
    'operators_should_understand', jsonb_build_array(
      'Innovation Lab validates ideas — Simulation Lab at /app/simulations predicts without acting',
      'Feature flags control exposure percentage — rollout requires explicit stages',
      'Lessons learned and failure outcomes are logged for organizational learning',
      'Governance A.14 owns experiment approvals — cross-link, do not duplicate approval workflows'
    ),
    'governance_route', '/app/governance',
    'audit_note', 'Innovation audit events logged — metadata only, no experiment participant PII.'
  );
$$;

create or replace function public._ielbp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates Innovation Lab internally; Unonight is the early external experimentation environment.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal validation — platform feature pilots, governance UX experiments, and ABOS capability testing',
      'focus', jsonb_build_array('Governance workflow simplification pilots', 'Assistant messaging tone experiments', 'Feature flag rollout framework', 'Innovation scorecard methodology')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce and support innovation experiments',
      'focus', jsonb_build_array('Support workflow improvement pilots', 'Customer advisory board co-creation', 'Partner-led market feedback experiments', 'Controlled feature pilots before GA')
    )
  );
$$;

create or replace function public._ielbp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Innovation becomes a repeatable capability — not a one-off gamble.',
    'Curiosity with structure — experiments teach; failure defines learning, not people.',
    'Every team can propose improvements — visibility and governance keep innovation responsible.',
    'Pilots and sandboxes protect production while ideas earn their place.',
    'The organization grows smarter with every experiment — wins, pivots, and honest lessons alike.'
  );
$$;

create or replace function public._ielbp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'innovation_impact', 'label', 'Innovation & Impact Engine (A.28)', 'route', '/app/innovation-impact-engine', 'note', 'Impact measurement and innovation outcomes — cross-link, do not duplicate'),
    jsonb_build_object('key', 'curiosity_discovery', 'label', 'Curiosity & Discovery (A.87)', 'route', '/app/curiosity-discovery-engine', 'note', 'Exploration and discovery cues — distinct from structured experiment pipeline'),
    jsonb_build_object('key', 'organizational_memory', 'label', 'Organizational Memory (A.34)', 'route', '/app/organizational-memory-engine', 'note', 'Learning capture and reusable insights from experiments'),
    jsonb_build_object('key', 'gratitude_recognition', 'label', 'Gratitude & Recognition (A.89)', 'route', '/app/gratitude-recognition-engine', 'note', 'Innovation contributor and collaboration recognition experiences'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Psychological safety and compassion toward imperfection'),
    jsonb_build_object('key', 'governance', 'label', 'Governance (A.14)', 'route', '/app/governance', 'note', 'Experiment approvals and risk assessments'),
    jsonb_build_object('key', 'continuous_improvement', 'label', 'Continuous Improvement (A.33)', 'route', '/app/continuous-improvement-engine', 'note', 'Operational improvement cycles — experiments may feed CI initiatives'),
    jsonb_build_object('key', 'growth_evolution', 'label', 'Growth & Evolution (A.81)', 'route', '/app/growth-evolution-engine', 'note', 'Organizational evolution — distinct from experiment validation'),
    jsonb_build_object('key', 'simulation_lab', 'label', 'Simulation & Decision Lab (Phase 78 / Blueprint 22)', 'route', '/app/simulations', 'note', 'Simulation predicts — never acts. Innovation Lab validates controlled experiments.')
  );
$$;

create or replace function public._ielbp_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Simulation & Decision Lab Phase 78 / Blueprint Phase 22 at /app/simulations — simulation predicts outcomes without acting; Innovation Lab validates ideas through controlled experiments, pilots, and feature flags with governance approval. Cross-link related engines — do not duplicate Organizational Memory, Gratitude & Recognition, or Governance workflows.';
$$;

create or replace function public._ielbp_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ideas_total int := 0;
  v_ideas_approved int := 0;
  v_ideas_in_experiment int := 0;
  v_experiments_total int := 0;
  v_experiments_active int := 0;
  v_experiments_completed int := 0;
  v_pilots_active int := 0;
  v_pilots_total int := 0;
  v_flags_pilot_or_rollout int := 0;
  v_lessons_total int := 0;
  v_lessons_learning int := 0;
begin
  select count(*),
         count(*) filter (where status = 'approved'),
         count(*) filter (where status = 'in_experiment')
    into v_ideas_total, v_ideas_approved, v_ideas_in_experiment
  from public.innovation_ideas
  where tenant_id = p_tenant_id;

  select count(*),
         count(*) filter (where status = 'active'),
         count(*) filter (where status = 'completed')
    into v_experiments_total, v_experiments_active, v_experiments_completed
  from public.innovation_experiments
  where tenant_id = p_tenant_id;

  select count(*),
         count(*) filter (where status = 'active')
    into v_pilots_total, v_pilots_active
  from public.innovation_pilot_programs
  where tenant_id = p_tenant_id;

  select count(*) into v_flags_pilot_or_rollout
  from public.innovation_feature_flags
  where tenant_id = p_tenant_id and status in ('pilot', 'rollout', 'sandbox');

  select count(*),
         count(*) filter (where outcome_type in ('learning', 'failure', 'pivot'))
    into v_lessons_total, v_lessons_learning
  from public.innovation_lessons_learned
  where tenant_id = p_tenant_id;

  return jsonb_build_object(
    'ideas_total', v_ideas_total,
    'ideas_approved', v_ideas_approved,
    'ideas_in_experiment', v_ideas_in_experiment,
    'experiments_total', v_experiments_total,
    'experiments_active', v_experiments_active,
    'experiments_completed', v_experiments_completed,
    'pilots_total', v_pilots_total,
    'pilots_active', v_pilots_active,
    'feature_flags_controlled', v_flags_pilot_or_rollout,
    'lessons_total', v_lessons_total,
    'lessons_learning_or_pivot', v_lessons_learning,
    'sandbox_isolated', true,
    'privacy_note', 'Counts from tenant-scoped innovation tables only — no idea content or PII in summary.'
  );
end; $$;

create or replace function public._ielbp_blueprint_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_ideas int := 0;
  v_experiments int := 0;
  v_pilots int := 0;
  v_lessons int := 0;
  v_completed int := 0;
begin
  v_engagement := public._ielbp_engagement_summary(p_tenant_id);
  v_ideas := coalesce((v_engagement->>'ideas_total')::int, 0);
  v_experiments := coalesce((v_engagement->>'experiments_total')::int, 0);
  v_pilots := coalesce((v_engagement->>'pilots_total')::int, 0);
  v_lessons := coalesce((v_engagement->>'lessons_total')::int, 0);
  v_completed := coalesce((v_engagement->>'experiments_completed')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'idea_pipeline',
      'label', 'Idea pipeline active — ideas submitted and visible',
      'met', v_ideas > 0,
      'note', case when v_ideas = 0 then 'Seed or submit ideas to begin structured innovation.' else null end
    ),
    jsonb_build_object(
      'key', 'experiment_tracking',
      'label', 'Experiment tracking — at least one experiment documented',
      'met', v_experiments > 0,
      'note', case when v_experiments = 0 then 'Advance approved ideas into the experiment pipeline.' else null end
    ),
    jsonb_build_object(
      'key', 'pilot_programs',
      'label', 'Pilot programs — controlled participant testing available',
      'met', v_pilots > 0,
      'note', case when v_pilots = 0 then 'Create pilot programs linked to active experiments.' else null end
    ),
    jsonb_build_object(
      'key', 'learning_documentation',
      'label', 'Learning documentation — lessons captured from experiments',
      'met', v_lessons > 0 or v_completed > 0,
      'note', case when v_lessons = 0 and v_completed = 0 then 'Complete experiments and record lessons learned.' else 'Failure defines learning — not people.' end
    ),
    jsonb_build_object(
      'key', 'objectives_documented',
      'label', 'Innovation objectives and idea management principles documented',
      'met', jsonb_array_length(public._ielbp_blueprint_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'experimentation_framework',
      'label', 'Experimentation principles — objectives, criteria, risks, stakeholders visible',
      'met', jsonb_array_length((public._ielbp_blueprint_experimentation_principles()->'required_elements')) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'companion_support',
      'label', 'Companion innovation support examples documented (🦉🌹🔔❤️)',
      'met', jsonb_array_length(public._ielbp_blueprint_companion_innovation_support()) >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'psychological_safety',
      'label', 'Self Love connection — psychological safety and learning from unsuccessful experiments',
      'met', (public._ielbp_blueprint_self_love_connection()->>'principle') is not null,
      'note', 'Celebrate effort and learning — compassion toward imperfection.'
    ),
    jsonb_build_object(
      'key', 'recognition_experiences',
      'label', 'Recognition experiences — effort and learning, not only outcomes',
      'met', jsonb_array_length((public._ielbp_blueprint_recognition_experiences()->'experiences')) >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'trust_transparency',
      'label', 'Trust — experimental vs production, risks, and approval ownership documented',
      'met', jsonb_array_length((public._ielbp_blueprint_trust_connection()->'users_should_know')) >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'simulation_distinction',
      'label', 'Honest distinction from Simulation Lab — validates vs predicts',
      'met', length(public._ielbp_distinction_note()) > 50,
      'note', 'Simulation Lab at /app/simulations — simulation predicts, never acts.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links to Innovation Impact, Curiosity, Organizational Memory, Governance',
      'met', jsonb_array_length(public._ielbp_blueprint_integration_links()) >= 8,
      'note', 'Extend related engines — do not duplicate experiment or approval workflows.'
    )
  );
end; $$;

-- Extend dashboard — preserve ALL Phase 96 fields; append Phase 38 blueprint
create or replace function public.get_innovation_lab_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.innovation_lab_settings;
  v_metrics jsonb;
  v_base jsonb;
begin
  v_tenant_id := public._ile_require_tenant();
  v_settings := public._ile_ensure_settings(v_tenant_id);
  perform public._ile_seed_ideas(v_tenant_id);
  perform public._ile_seed_experiments(v_tenant_id);
  perform public._ile_seed_pilots(v_tenant_id);
  perform public._ile_seed_feature_flags(v_tenant_id);
  perform public._ile_seed_lessons(v_tenant_id);
  v_metrics := public._ile_refresh_scorecard(v_tenant_id);
  perform public._ile_trust_explanation(v_tenant_id, (v_metrics->>'innovation_score')::numeric);

  v_base := jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'philosophy', 'Innovation without chaos.',
    'safety_note', 'Responsible innovation balances creativity with accountability and operational discipline.',
    'lab_enabled', v_settings.lab_enabled,
    'sandbox_enabled', v_settings.sandbox_enabled,
    'customer_cocreation_enabled', v_settings.customer_cocreation_enabled,
    'feature_flags_enabled', v_settings.feature_flags_enabled,
    'executive_approval_required', v_settings.executive_approval_required,
    'failure_learning_enabled', v_settings.failure_learning_enabled,
    'innovation_score', v_metrics->'innovation_score',
    'experiment_completion_pct', v_metrics->'experiment_completion_pct',
    'active_experiments', v_metrics->'active_experiments',
    'ideas_in_pipeline', v_metrics->'ideas_in_pipeline',
    'return_on_innovation', v_metrics->'return_on_innovation',
    'lab_structure', jsonb_build_array(
      jsonb_build_object('area', 'idea_management', 'label', 'Idea Management'),
      jsonb_build_object('area', 'experimentation', 'label', 'Experimentation Management'),
      jsonb_build_object('area', 'pilots', 'label', 'Pilot Programs'),
      jsonb_build_object('area', 'validation', 'label', 'Validation Frameworks'),
      jsonb_build_object('area', 'governance', 'label', 'Innovation Governance')
    ),
    'experiment_stages', jsonb_build_array(
      'Hypothesis creation', 'Experiment design', 'Participant selection',
      'Measurement planning', 'Controlled execution', 'Result analysis', 'Recommendation generation'
    ),
    'sandbox_capabilities', jsonb_build_array(
      'Isolated testing', 'Controlled access', 'Feature toggles', 'Data separation', 'Rollback capabilities'
    ),
    'ideas', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'idea_key', i.idea_key, 'title', i.title,
        'problem_statement', i.problem_statement, 'proposed_solution', i.proposed_solution,
        'expected_outcomes', i.expected_outcomes, 'target_audience', i.target_audience,
        'source', i.source, 'status', i.status,
        'customer_value_score', i.customer_value_score,
        'strategic_alignment_score', i.strategic_alignment_score,
        'feasibility_score', i.feasibility_score,
        'risk_level', i.risk_level, 'estimated_effort', i.estimated_effort
      ) order by i.customer_value_score desc)
      from public.innovation_ideas i where i.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'experiments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'experiment_key', e.experiment_key, 'title', e.title,
        'description', e.description, 'experiment_type', e.experiment_type,
        'status', e.status, 'stage', e.stage, 'progress_pct', e.progress_pct,
        'participant_count', e.participant_count
      ) order by e.progress_pct desc)
      from public.innovation_experiments e where e.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'pilot_programs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'program_key', p.program_key, 'title', p.title,
        'description', p.description, 'status', p.status,
        'max_participants', p.max_participants, 'current_participants', p.current_participants,
        'success_criteria', p.success_criteria
      ))
      from public.innovation_pilot_programs p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'feature_flags', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', f.id, 'flag_key', f.flag_key, 'title', f.title,
        'description', f.description, 'status', f.status,
        'target_segment', f.target_segment, 'exposure_pct', f.exposure_pct
      ))
      from public.innovation_feature_flags f where f.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'scorecard', coalesce((
      select jsonb_build_object(
        'period_label', s.period_label,
        'experiment_completion_pct', s.experiment_completion_pct,
        'customer_satisfaction_impact', s.customer_satisfaction_impact,
        'adoption_potential_pct', s.adoption_potential_pct,
        'business_value_score', s.business_value_score,
        'return_on_innovation', s.return_on_innovation
      )
      from public.innovation_scorecards s where s.tenant_id = v_tenant_id limit 1
    ), '{}'::jsonb),
    'lessons_learned', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'title', l.title, 'summary', l.summary, 'outcome_type', l.outcome_type
      ))
      from public.innovation_lessons_learned l where l.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'governance_controls', jsonb_build_array(
      'Executive approvals', 'Risk assessments', 'Documentation standards',
      'Compliance reviews', 'Ethical evaluations'
    ),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'summary', b.summary, 'created_at', b.created_at)
        order by b.created_at desc)
      from public.innovation_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'governance', 'Approval workflows and risk assessments',
      'marketplace_governance', 'Quality gates for marketplace innovations',
      'academy', 'Innovation methodology training',
      'partners', 'Partner innovation workshops and pilots',
      'simulation_lab', 'Distinct from Decision Lab at /app/simulations'
    )
  );

  return v_base || jsonb_build_object(
    'implementation_blueprint_phase38', jsonb_build_object(
      'phase', 38,
      'title', 'Innovation & Experimentation Lab Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE38_INNOVATION_EXPERIMENTATION_LAB.md',
      'engine_phase', 'Phase 96 — Innovation Lab & Experimentation Engine',
      'route', '/app/innovation-lab',
      'mapping_note', 'ABOS Blueprint Phase 38 extends Phase 96 — distinct from Simulation Lab Phase 78 / Blueprint 22.'
    ),
    'innovation_lab_mission', public._ielbp_mission(),
    'innovation_lab_philosophy', public._ielbp_philosophy(),
    'innovation_objectives', public._ielbp_blueprint_objectives(),
    'idea_management', public._ielbp_blueprint_idea_management(),
    'experimentation_principles', public._ielbp_blueprint_experimentation_principles(),
    'companion_innovation_support', public._ielbp_blueprint_companion_innovation_support(),
    'learning_capture', public._ielbp_blueprint_learning_capture(),
    'innovation_self_love_connection', public._ielbp_blueprint_self_love_connection(),
    'innovation_recognition_experiences', public._ielbp_blueprint_recognition_experiences(),
    'innovation_trust_connection', public._ielbp_blueprint_trust_connection(),
    'innovation_dogfooding', public._ielbp_blueprint_dogfooding(),
    'innovation_success_criteria', public._ielbp_blueprint_success_criteria(v_tenant_id),
    'innovation_vision_phrases', public._ielbp_blueprint_vision_phrases(),
    'innovation_abos_principle', public._ielbp_abos_principle(),
    'innovation_distinction_note', public._ielbp_distinction_note(),
    'innovation_integration_links', public._ielbp_blueprint_integration_links(),
    'innovation_engagement_summary', public._ielbp_engagement_summary(v_tenant_id)
  );
end; $$;

create or replace function public.get_innovation_lab_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb; v_engagement jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._ile_ensure_settings(v_tenant_id);
  perform public._ile_seed_ideas(v_tenant_id);
  v_metrics := public._ile_refresh_scorecard(v_tenant_id);
  v_engagement := public._ielbp_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'innovation_score', v_metrics->'innovation_score',
    'active_experiments', v_metrics->'active_experiments',
    'philosophy', 'Innovation without chaos.',
    'human_oversight_required', true,
    'implementation_blueprint_phase38', jsonb_build_object(
      'phase', 38,
      'title', 'Innovation & Experimentation Lab Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE38_INNOVATION_EXPERIMENTATION_LAB.md',
      'engine_phase', 'Phase 96',
      'route', '/app/innovation-lab'
    ),
    'innovation_lab_mission', public._ielbp_mission(),
    'innovation_abos_principle', public._ielbp_abos_principle(),
    'innovation_engagement_summary', v_engagement,
    'blueprint_note', 'Innovation & Experimentation Lab (ABOS Phase 38) — extends Phase 96 with blueprint metadata, idea management framework, learning capture, and live success criteria.'
  );
end; $$;

grant execute on function public._ielbp_mission() to authenticated;
grant execute on function public._ielbp_philosophy() to authenticated;
grant execute on function public._ielbp_abos_principle() to authenticated;
grant execute on function public._ielbp_blueprint_objectives() to authenticated;
grant execute on function public._ielbp_blueprint_idea_management() to authenticated;
grant execute on function public._ielbp_blueprint_experimentation_principles() to authenticated;
grant execute on function public._ielbp_blueprint_companion_innovation_support() to authenticated;
grant execute on function public._ielbp_blueprint_learning_capture() to authenticated;
grant execute on function public._ielbp_blueprint_self_love_connection() to authenticated;
grant execute on function public._ielbp_blueprint_recognition_experiences() to authenticated;
grant execute on function public._ielbp_blueprint_trust_connection() to authenticated;
grant execute on function public._ielbp_blueprint_dogfooding() to authenticated;
grant execute on function public._ielbp_blueprint_vision_phrases() to authenticated;
grant execute on function public._ielbp_blueprint_integration_links() to authenticated;
grant execute on function public._ielbp_distinction_note() to authenticated;
grant execute on function public._ielbp_engagement_summary(uuid) to authenticated;
grant execute on function public._ielbp_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'innovation-experimentation-blueprint', 'Innovation & Experimentation Lab (ABOS Phase 38)',
  'Innovation & Experimentation Lab — extends Phase 96 with blueprint metadata, idea management, experimentation principles, learning capture, and live success criteria.',
  'authenticated', 105
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'innovation-experimentation-blueprint' and tenant_id is null
);
