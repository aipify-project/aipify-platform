-- Implementation Blueprint Phase 23 — Learning & Adaptation Engine
-- Spec alignment extending Learning Engine (Phase 65 + Phase 29). No new tables.

create or replace function public._laebp_blueprint_learning_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'feedback_collection', 'label', 'Feedback collection', 'description', 'Capture outcomes, approvals, and user feedback as metadata — never raw customer content'),
    jsonb_build_object('key', 'recommendation_refinement', 'label', 'Recommendation refinement', 'description', 'Improve suggestions from observed patterns with explainable confidence adjustments'),
    jsonb_build_object('key', 'workflow_improvement', 'label', 'Workflow improvement', 'description', 'Identify bottlenecks and task completion trends to suggest operational improvements'),
    jsonb_build_object('key', 'knowledge_enhancement', 'label', 'Knowledge enhancement', 'description', 'Surface article usefulness, knowledge gaps, and search effectiveness from metadata'),
    jsonb_build_object('key', 'support_optimization', 'label', 'Support optimization', 'description', 'Learn resolution effectiveness, satisfaction signals, and escalation outcomes — with human review'),
    jsonb_build_object('key', 'organizational_learning', 'label', 'Organizational learning', 'description', 'Accelerate org wisdom through visible, practical, continuous improvement loops')
  );
$$;

create or replace function public._laebp_blueprint_learning_sources()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Metadata-only learning sources — patterns and outcomes, never raw customer records or PII.',
    'categories', jsonb_build_array(
      jsonb_build_object(
        'domain', 'support',
        'label', 'Support learning',
        'signals', jsonb_build_array(
          'Resolution effectiveness and time-to-close trends',
          'Customer satisfaction and helpfulness feedback',
          'Escalation outcomes and false-positive reduction',
          'Draft acceptance and template effectiveness'
        )
      ),
      jsonb_build_object(
        'domain', 'knowledge',
        'label', 'Knowledge learning',
        'signals', jsonb_build_array(
          'Article usefulness and gap detection',
          'Search effectiveness and missing-topic patterns',
          'Knowledge approval and review outcomes',
          'Employee knowledge Q&A confidence trends'
        )
      ),
      jsonb_build_object(
        'domain', 'operational',
        'label', 'Operational learning',
        'signals', jsonb_build_array(
          'Task completion trends and bottlenecks',
          'Automation success and failure patterns',
          'Notification noise and briefing engagement',
          'Team observations from approved workflows'
        )
      ),
      jsonb_build_object(
        'domain', 'companion',
        'label', 'Companion learning',
        'signals', jsonb_build_array(
          'Communication style preferences',
          'Recognition and celebration timing',
          'Humor and playful moment preferences',
          'Bell moment engagement and quiet-hour respect'
        )
      )
    )
  );
$$;

create or replace function public._laebp_blueprint_adaptation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Learning is intentional; adaptation is transparent; improvement never compromises trust.',
    'should', jsonb_build_array(
      'Recommend improvements with reasoning and confidence',
      'Learn from outcomes and user feedback metadata',
      'Identify recurring opportunities across modules',
      'Preserve organizational context and governance boundaries',
      'Require human approval before material behavior changes',
      'Make learning visible, practical, and continuous'
    ),
    'should_not', jsonb_build_array(
      'Auto-change critical settings without explicit approval',
      'Override governance, licensing, or approval policies',
      'Remove human oversight from sensitive operations',
      'Store raw conversations, emails, orders, or PII',
      'Learn FROM the customer — Aipify learns WITH the customer'
    )
  );
$$;

create or replace function public._laebp_blueprint_companion_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'patterns_suggest_improvement',
      'scenario', 'Patterns suggest improvement — thoughtful observation',
      'example', '🦉 Support resolution times improved 18% after morning triage — Aipify suggests prioritizing similar workflows for your team review.'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'feedback_helped_support',
      'scenario', 'Feedback helped support the organization',
      'example', '🌹 Your feedback on draft templates helped Aipify refine support suggestions — the organization benefits from lessons captured together.'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'positive_trend',
      'scenario', 'Positive trend surfaced',
      'example', '🔔 Automation success rate has risen for three consecutive weeks — a positive trend worth celebrating and building on.'
    ),
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'process_stronger',
      'scenario', 'Process stronger than three months ago',
      'example', '🦉 Your approval workflow is stronger than three months ago — fewer false positives and faster resolution patterns suggest steady organizational learning.'
    )
  );
$$;

create or replace function public._laebp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love celebrates progress, normalizes learning, encourages experimentation, and reduces fear of mistakes.',
    'practices', jsonb_build_array(
      'Celebrate progress — acknowledge improvement without pressure',
      'Normalize learning — mistakes are data for better outcomes, not failures',
      'Encourage experimentation — try improvements in assisted mode first',
      'Reduce fear of mistakes — learning is reversible and auditable'
    ),
    'self_love_route', '/app/self-love-engine',
    'naming_doc', 'SELF_LOVE_NAMING_STANDARD.md',
    'boundary_note', 'Self Love is a principle — not a feature toggle. Learning Engine stores metadata, not wellbeing content.'
  );
$$;

create or replace function public._laebp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'What Aipify learns, why recommendations evolve, and how feedback influences outcomes — metadata only, human approval required.',
    'users_should_know', jsonb_build_array(
      'Aipify learns WITH you — not FROM you; you remain in control',
      'Every learned pattern includes an explanation and confidence level',
      'Feedback influences scores and rules — visible in audit and review center',
      'Governance protections prevent bypassing approvals or licensing',
      'Recommendations are guidance — not guarantees; humans decide'
    ),
    'operators_should_understand', jsonb_build_array(
      'Phase 29 Review Center at /app/learning/review — assisted and adaptive modes',
      'Phase 65 feedback loop — events, scores, rules, and audit trail',
      'Distinct from Learning & Training Engine A.36 — user education, not operational learning',
      'Distinct from Knowledge Evolution Blueprint Phase 14 — article lifecycle, not behavior scores',
      'Platform governance at /platform/intelligence/learning-queue — aggregates only'
    ),
    'audit_note', 'Learning events, feedback, scores, and audit logs — metadata only, no PII.'
  );
$$;

create or replace function public._laebp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates Learning & Adaptation internally; Unonight is the first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — product improvement, support quality, knowledge evolution, companion refinement',
      'focus', jsonb_build_array('Platform support template learning', 'Knowledge gap detection from internal ops', 'Companion style calibration from team feedback', 'Governance-safe rule promotion workflows')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce and support operational learning',
      'focus', jsonb_build_array('Support draft acceptance patterns', 'Verification workflow prioritization', 'Marketplace false-positive reduction', 'Morning briefing engagement learning')
    )
  );
$$;

create or replace function public._laebp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Learning Review Center (Phase 29)', 'route', '/app/learning/review', 'note', 'Assisted and adaptive learning modes — get_customer_learning_center()'),
    jsonb_build_object('label', 'Learning & Training Engine (A.36)', 'route', '/app/learning-training-engine', 'note', 'User education paths — distinct from operational learning'),
    jsonb_build_object('label', 'Knowledge Evolution (Phase 14)', 'route', '/app/knowledge-center-engine', 'note', 'Article lifecycle and knowledge evolution — cross-link, do not duplicate'),
    jsonb_build_object('label', 'Growth & Evolution Engine (A.81)', 'route', '/app/growth-evolution-engine', 'note', 'Sustainable growth cycles — distinct from feedback scores'),
    jsonb_build_object('label', 'Platform learning governance', 'route', '/platform/intelligence/learning-queue', 'note', 'Platform Admin — global learning approval queue'),
    jsonb_build_object('label', 'Support AI (A.7)', 'route', '/app/settings/support-operations', 'note', 'Support learning signals and triage outcomes'),
    jsonb_build_object('label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine', 'note', 'Knowledge usefulness and gap signals'),
    jsonb_build_object('label', 'Unified Tasks (A.62)', 'route', '/app/unified-tasks-engine', 'note', 'Task completion and bottleneck trends'),
    jsonb_build_object('label', 'Personality Engine', 'route', '/app/personality', 'note', 'Companion communication and style preferences'),
    jsonb_build_object('label', 'Gratitude Engine (A.89)', 'route', '/app/gratitude-engine', 'note', 'Recognition and celebration learning signals'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Celebrate progress and normalize learning — principle only')
  );
$$;

create or replace function public._laebp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Organizations become wiser through experience — Aipify grows alongside them responsibly, one lesson at a time.',
    'Strongest organizations keep learning — make learning visible, practical, and continuous.',
    'Aipify learns WITH the customer — not FROM the customer. Humans decide; Aipify informs and prepares.',
    'Learning is intentional; adaptation is transparent; improvement never compromises trust.',
    'Feedback loops work when outcomes are visible, explainable, auditable, and reversible.'
  );
$$;

create or replace function public._laebp_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_events int := 0;
  v_events_30d int := 0;
  v_feedback int := 0;
  v_positive_feedback int := 0;
  v_negative_feedback int := 0;
  v_scores int := 0;
  v_improved_scores int := 0;
  v_memory int := 0;
  v_active_rules int := 0;
  v_modules_used int := 0;
begin
  select count(*) into v_events
  from public.learning_events where tenant_id = p_tenant_id;

  select count(*) into v_events_30d
  from public.learning_events
  where tenant_id = p_tenant_id and created_at >= now() - interval '30 days';

  select count(*) into v_feedback
  from public.learning_feedback where tenant_id = p_tenant_id;

  select count(*) into v_positive_feedback
  from public.learning_feedback
  where tenant_id = p_tenant_id and feedback_type in ('helpful', 'approved');

  select count(*) into v_negative_feedback
  from public.learning_feedback
  where tenant_id = p_tenant_id and feedback_type in ('not_helpful', 'false_positive', 'too_noisy', 'rejected');

  select count(*) into v_scores
  from public.learning_scores where tenant_id = p_tenant_id;

  select count(*) into v_improved_scores
  from public.learning_scores
  where tenant_id = p_tenant_id and current_score > 55;

  select count(*) into v_memory
  from public.customer_learning_memory
  where tenant_id = p_tenant_id and status = 'active';

  select count(*) into v_active_rules
  from public.learning_rules
  where tenant_id = p_tenant_id and is_active = true;

  select count(distinct source_module) into v_modules_used
  from public.learning_events where tenant_id = p_tenant_id;

  return jsonb_build_object(
    'learning_events_total', v_events,
    'learning_events_last_30d', v_events_30d,
    'feedback_total', v_feedback,
    'positive_feedback', v_positive_feedback,
    'negative_feedback', v_negative_feedback,
    'learning_scores_total', v_scores,
    'improved_scores', v_improved_scores,
    'active_learning_memory', v_memory,
    'active_learned_rules', v_active_rules,
    'source_modules_used', v_modules_used,
    'privacy_note', 'Counts only — no event content, customer records, or PII.'
  );
end; $$;

create or replace function public._laebp_blueprint_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_events int := 0;
  v_feedback int := 0;
  v_scores int := 0;
  v_memory int := 0;
  v_enabled boolean := false;
begin
  v_engagement := public._laebp_engagement_summary(p_tenant_id);
  v_events := coalesce((v_engagement->>'learning_events_total')::int, 0);
  v_feedback := coalesce((v_engagement->>'feedback_total')::int, 0);
  v_scores := coalesce((v_engagement->>'learning_scores_total')::int, 0);
  v_memory := coalesce((v_engagement->>'active_learning_memory')::int, 0);

  select coalesce(enabled, false) into v_enabled
  from public.learning_settings where tenant_id = p_tenant_id;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'feedback_loops_work',
      'label', 'Feedback loops work — learning events and feedback captured',
      'met', v_events > 0 or v_feedback > 0,
      'note', case when v_events = 0 and v_feedback = 0 then 'Collect signals or record feedback to begin the learning loop.' else null end
    ),
    jsonb_build_object(
      'key', 'recommendations_improve',
      'label', 'Recommendations improve — scores and patterns tracked',
      'met', v_scores > 0 or v_memory > 0,
      'note', case when v_scores = 0 and v_memory = 0 then 'Approved learnings and score adjustments appear after feedback cycles.' else null end
    ),
    jsonb_build_object(
      'key', 'org_learning_accelerates',
      'label', 'Organizational learning accelerates — active memory and rules',
      'met', v_memory > 0 or coalesce((v_engagement->>'active_learned_rules')::int, 0) > 0,
      'note', case when v_memory = 0 and coalesce((v_engagement->>'active_learned_rules')::int, 0) = 0 then 'Review center approvals and learned rules build org wisdom over time.' else null end
    ),
    jsonb_build_object(
      'key', 'companion_feels_relevant',
      'label', 'Companion feels relevant — companion learning sources documented',
      'met', jsonb_array_length(public._laebp_blueprint_learning_sources()->'categories') >= 4,
      'note', 'Communication, recognition, humor, and bell moment preferences as metadata signals.'
    ),
    jsonb_build_object(
      'key', 'trust_remains_strong',
      'label', 'Trust remains strong — metadata only, human approval, governance intact',
      'met', (public._laebp_blueprint_trust_connection()->>'principle') is not null,
      'note', 'Learning does not bypass approvals. Recommendations are guidance — humans decide.'
    ),
    jsonb_build_object(
      'key', 'learning_objectives',
      'label', 'Learning objectives documented — feedback, refinement, workflow, knowledge, support, org learning',
      'met', jsonb_array_length(public._laebp_blueprint_learning_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'adaptation_principles',
      'label', 'Adaptation principles — should recommend, should not auto-change critical settings',
      'met', jsonb_array_length(public._laebp_blueprint_adaptation_principles()->'should') >= 5,
      'note', 'Transparent adaptation with human oversight preserved.'
    ),
    jsonb_build_object(
      'key', 'companion_examples',
      'label', 'Companion examples documented (🦉🌹🔔) — patterns, feedback, trends, progress',
      'met', jsonb_array_length(public._laebp_blueprint_companion_examples()) >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — celebrate progress, normalize learning, reduce fear of mistakes',
      'met', true,
      'note', 'Self Love is a principle — encourage experimentation in assisted mode.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from Learning & Training A.36, Knowledge Evolution, and Growth A.81',
      'met', jsonb_array_length(public._laebp_blueprint_integration_links()) >= 8,
      'note', 'Extend related engines — do not duplicate user education or knowledge lifecycle.'
    ),
    jsonb_build_object(
      'key', 'engine_enabled',
      'label', 'Learning Engine enabled for tenant',
      'met', v_enabled,
      'note', case when not v_enabled then 'Enable Learning Engine in settings to activate feedback loops.' else null end
    )
  );
end; $$;

create or replace function public._laebp_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Learning & Training Engine A.36 /app/learning-training-engine (user education), Knowledge Evolution Blueprint Phase 14 /app/knowledge-center-engine (article lifecycle), Growth & Evolution Engine A.81 /app/growth-evolution-engine (growth cycles), and Phase 29 Review Center /app/learning/review (assisted/adaptive modes). Phase 65 feedback loop extends Phase 29 with events, scores, rules, and audit.';
$$;

create or replace function public.get_learning_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._lrn_require_tenant();
  perform public._lrn_ensure_settings(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'metrics', jsonb_build_object(
      'total_events', (select count(*) from public.learning_events where tenant_id = v_tenant_id),
      'positive_feedback', (select count(*) from public.learning_feedback where tenant_id = v_tenant_id and feedback_type in ('helpful', 'approved')),
      'negative_feedback', (select count(*) from public.learning_feedback where tenant_id = v_tenant_id and feedback_type in ('not_helpful', 'false_positive', 'too_noisy', 'rejected')),
      'false_positives_reduced', (select count(*) from public.learning_events where tenant_id = v_tenant_id and event_type = 'incident_false_positive'),
      'suggestions_improved', (select count(*) from public.learning_scores where tenant_id = v_tenant_id and current_score > 55),
      'automations_improved', (select count(*) from public.learning_events where tenant_id = v_tenant_id and event_type = 'automation_success'),
      'noisy_notifications_reduced', (select count(*) from public.learning_events where tenant_id = v_tenant_id and event_type = 'notification_muted')
    ),
    'top_patterns', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pattern_key', ls.pattern_key, 'source_module', ls.source_module,
        'current_score', ls.current_score, 'positive_count', ls.positive_count,
        'negative_count', ls.negative_count, 'explanation', ls.explanation
      ) order by ls.current_score desc)
      from public.learning_scores ls where ls.tenant_id = v_tenant_id limit 10
    ), '[]'::jsonb),
    'recent_priority_adjustments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', le.id, 'event_type', le.event_type, 'source_module', le.source_module,
        'explanation', le.explanation, 'confidence_before', le.confidence_before,
        'confidence_after', le.confidence_after, 'created_at', le.created_at
      ) order by le.created_at desc)
      from public.learning_events le where le.tenant_id = v_tenant_id
        and le.confidence_after is not null limit 10
    ), '[]'::jsonb),
    'recent_events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', le.id, 'event_type', le.event_type, 'source_module', le.source_module,
        'user_decision', le.user_decision, 'outcome', le.outcome, 'explanation', le.explanation,
        'created_at', le.created_at
      ) order by le.created_at desc)
      from public.learning_events le where le.tenant_id = v_tenant_id limit 15
    ), '[]'::jsonb),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 23 — Learning & Adaptation Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE23_LEARNING_ADAPTATION.md',
      'engine_phase', 'Phase 65 Learning Engine (extends Phase 29)',
      'route', '/app/learning',
      'mapping_note', 'ABOS Blueprint Phase 23 maps to Learning Engine Phase 65 — extend, do not duplicate Learning & Training A.36, Knowledge Evolution Phase 14, or Growth & Evolution A.81.'
    ),
    'mission', 'Continuous improvement through observation, feedback, and experience — preserving trust, governance, and human oversight.',
    'philosophy', 'Learning is intentional; adaptation is transparent; improvement never compromises trust.',
    'abos_principle', 'Strongest organizations keep learning — make learning visible, practical, and continuous.',
    'core_principle', 'Aipify learns WITH the customer — not FROM the customer.',
    'vision', 'Organizations become wiser through experience; Aipify grows alongside them responsibly, one lesson at a time.',
    'learning_engine_note', 'Learning & Adaptation Engine (ABOS Phase 23) — extends Learning Engine Phase 65 and Phase 29 Review Center.',
    'distinction_note', public._laebp_distinction_note(),
    'learning_objectives', public._laebp_blueprint_learning_objectives(),
    'learning_sources', public._laebp_blueprint_learning_sources(),
    'adaptation_principles', public._laebp_blueprint_adaptation_principles(),
    'companion_examples', public._laebp_blueprint_companion_examples(),
    'self_love_connection', public._laebp_blueprint_self_love_connection(),
    'trust_connection', public._laebp_blueprint_trust_connection(),
    'dogfooding', public._laebp_blueprint_dogfooding(),
    'integration_links', public._laebp_blueprint_integration_links(),
    'engagement_summary', public._laebp_engagement_summary(v_tenant_id),
    'success_criteria', public._laebp_blueprint_success_criteria(v_tenant_id),
    'vision_phrases', public._laebp_blueprint_vision_phrases(),
    'privacy_note', 'Learning is tenant-isolated, explainable, auditable, and reversible. Metadata only — no raw customer content.',
    'principles', jsonb_build_array(
      'Observe → Suggest → User decides → Outcome → Feedback → Learning updated',
      'Aipify learns WITH the customer — not FROM the customer',
      'Metadata only — human approval before material behavior changes',
      'Every pattern explainable, auditable, and reversible',
      'Recommendations are guidance — humans decide'
    )
  );
end; $$;

create or replace function public.get_learning_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_engagement jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._lrn_ensure_settings(v_tenant_id);

  v_engagement := public._laebp_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'enabled', (select enabled from public.learning_settings where tenant_id = v_tenant_id),
    'total_events', (select count(*) from public.learning_events where tenant_id = v_tenant_id),
    'positive_feedback', (select count(*) from public.learning_feedback where tenant_id = v_tenant_id and feedback_type in ('helpful', 'approved')),
    'negative_feedback', (select count(*) from public.learning_feedback where tenant_id = v_tenant_id and feedback_type in ('not_helpful', 'false_positive', 'too_noisy', 'rejected')),
    'philosophy', 'Observe → Suggest → User decides → Outcome → Feedback → Learning updated',
    'privacy_note', 'Learning is tenant-isolated, explainable, auditable, and reversible.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 23 — Learning & Adaptation Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE23_LEARNING_ADAPTATION.md',
      'engine_phase', 'Phase 65 Learning Engine (extends Phase 29)',
      'route', '/app/learning'
    ),
    'mission', 'Continuous improvement through observation, feedback, and experience — preserving trust and human oversight.',
    'abos_principle', 'Strongest organizations keep learning — make learning visible, practical, and continuous.',
    'core_principle', 'Aipify learns WITH the customer — not FROM the customer.',
    'engagement_summary', v_engagement,
    'blueprint_note', 'Learning & Adaptation Engine (ABOS Phase 23) — extends Phase 65 with blueprint metadata, learning sources, adaptation principles, and live success criteria.'
  );
end; $$;

create or replace function public.get_customer_learning_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.customer_learning_settings;
  v_plan text;
  v_env text;
  v_limits jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_settings := public.ensure_customer_learning_settings(v_tenant_id);
  v_limits := public.get_customer_license_limits(v_tenant_id);
  v_plan := coalesce(v_limits ->> 'plan', 'starter');

  select c.environment_type into v_env
  from public.customers c
  where c.id = v_tenant_id;

  return jsonb_build_object(
    'has_customer', true,
    'principle', 'Aipify learns WITH the customer — not FROM the customer. You remain in control.',
    'learning_mode', v_settings.learning_mode,
    'adaptive_consent', v_settings.adaptive_consent_at is not null,
    'adaptive_allowed', v_plan in ('business', 'enterprise') and v_env in ('pilot', 'enterprise', 'customer'),
    'recent_learnings', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', m.id,
        'pattern_type', m.pattern_type,
        'source_type', m.source_type,
        'approval_source', m.approval_source,
        'confidence_level', m.confidence_level,
        'confidence_score', m.confidence_score,
        'skill_key', m.skill_key,
        'explanation', m.explanation,
        'status', m.status,
        'learned_at', m.learned_at,
        'reviewed_at', m.reviewed_at
      ) order by m.learned_at desc)
      from public.customer_learning_memory m
      where m.tenant_id = v_tenant_id and m.status = 'active'
      limit 25),
      '[]'::jsonb
    ),
    'suggested_improvements', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', ar.id,
        'title', ar.title,
        'description', ar.recommendation,
        'confidence_level', public._confidence_level_from_score(ar.confidence_score),
        'confidence_score', ar.confidence_score
      ) order by ar.confidence_score desc)
      from public.ai_recommendations ar
      where ar.tenant_id = v_tenant_id and ar.status = 'active'
      limit 5),
      '[]'::jsonb
    ),
    'approval_history', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', r.id,
        'action_type', r.action_type,
        'created_at', r.created_at
      ) order by r.created_at desc)
      from public.customer_learning_reviews r
      where r.tenant_id = v_tenant_id
      limit 20),
      '[]'::jsonb
    ),
    'governance', jsonb_build_object(
      'rollout_stage', case v_env
        when 'internal' then 'Aipify Internal'
        when 'pilot' then 'Unonight Pilot'
        else 'General Availability'
      end,
      'environment_type', v_env
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 23 — Learning & Adaptation Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE23_LEARNING_ADAPTATION.md',
      'engine_phase', 'Phase 29 Review Center + Phase 65 Feedback Loop',
      'route', '/app/learning',
      'review_route', '/app/learning/review',
      'core_principle', 'Aipify learns WITH the customer — not FROM the customer.'
    )
  );
end;
$$;

grant execute on function public._laebp_blueprint_learning_objectives() to authenticated;
grant execute on function public._laebp_blueprint_learning_sources() to authenticated;
grant execute on function public._laebp_blueprint_adaptation_principles() to authenticated;
grant execute on function public._laebp_blueprint_companion_examples() to authenticated;
grant execute on function public._laebp_blueprint_self_love_connection() to authenticated;
grant execute on function public._laebp_blueprint_trust_connection() to authenticated;
grant execute on function public._laebp_blueprint_dogfooding() to authenticated;
grant execute on function public._laebp_blueprint_integration_links() to authenticated;
grant execute on function public._laebp_blueprint_vision_phrases() to authenticated;
grant execute on function public._laebp_engagement_summary(uuid) to authenticated;
grant execute on function public._laebp_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'learning-adaptation-blueprint', 'Learning & Adaptation Engine (ABOS Phase 23)',
  'Learning & Adaptation Engine — extends Phase 65 and Phase 29 with learning objectives, sources, adaptation principles, companion examples, and live engagement summary.',
  'authenticated', 99
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'learning-adaptation-blueprint' and tenant_id is null
);
