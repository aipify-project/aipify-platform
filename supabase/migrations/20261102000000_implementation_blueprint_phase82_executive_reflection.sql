-- Implementation Blueprint Phase 82 — Executive Reflection Engine
-- Extends Executive Insights Engine (Phase A.35 + ABOS Phase 13 + Phase 59 + Phase 66). No new tables.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._erbp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 82 — Executive Reflection Engine at /app/executive-insights-engine. Extends Executive Insights Engine Phase A.35, Blueprint Phase 13, Phase 59 Strategic Thinking, and Phase 66 Executive Companion. Distinct from Experience, Adoption & Human Success repo Phase 82 at /app/human-success (repo phase number collision). Distinct from Purpose & Values Engine A.82 at /app/purpose-values-engine (Blueprint Phase 64 — organizational values reflection, not executive leadership reflection). Distinct from Self Love Engine A.76 at /app/self-love-engine (personal wellbeing). Distinct from Wisdom Engine A.93 at /app/wisdom-engine (synthesis). Distinct from Legacy Engine A.86 at /app/legacy-engine. Distinct from Gratitude & Recognition A.89 (recognition connection cross-link). Phase 66 companion preparation preserved — Phase 82 deepens intentional leadership reflection practice. Helpers: _eie_* (A.35), _stbp_* (Phase 59), _ecbp_* (Phase 66) — Blueprint Phase 82 uses _erbp_* only. Privacy: reflections private unless intentionally shared — growth not evaluation.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._erbp_mission()
returns text language sql immutable as $$
  select 'Strengthen self-awareness, decision quality, and long-term effectiveness through guided reflection and thoughtful executive practices.';
$$;

create or replace function public._erbp_philosophy()
returns text language sql immutable as $$
  select 'The strongest leaders pause to learn from experience — reflection transforms experience into wisdom; sustainable leadership is not about being the fastest mover.';
$$;

create or replace function public._erbp_abos_principle()
returns text language sql immutable as $$
  select 'Leadership development emerges when people reflect upon experience thoughtfully and consistently — growth, not evaluation.';
$$;

create or replace function public._erbp_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'leadership_reflection', 'label', 'Leadership reflection', 'description', 'Guided prompts for intentional leadership learning — private by default'),
    jsonb_build_object('key', 'perspective_building', 'label', 'Perspective building', 'description', 'Separate urgent noise from long-term leadership signals and lessons'),
    jsonb_build_object('key', 'decision_learning', 'label', 'Decision learning', 'description', 'Assumptions, unexpected outcomes, and lessons for future decisions'),
    jsonb_build_object('key', 'personal_growth', 'label', 'Personal growth', 'description', 'Communication, delegation, relationships, strategic thinking, team development'),
    jsonb_build_object('key', 'executive_wellbeing', 'label', 'Executive wellbeing', 'description', 'Sustainable expectations and self-compassion in leadership practice'),
    jsonb_build_object('key', 'sustainable_leadership', 'label', 'Sustainable leadership practices', 'description', 'Consistent reflection habits — lifelong journey, not performance review')
  );
$$;

create or replace function public._erbp_reflection_prompts()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'owl_positive_impact',
      'scenario', 'Positive impact decisions',
      'question', '🦉 Which decisions this period had the most positive impact — and what does that teach you about your leadership?'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'rose_challenges_lessons',
      'scenario', 'Challenges that taught lessons',
      'question', '🌹 What challenges taught you something important — even when outcomes were imperfect?'
    ),
    jsonb_build_object(
      'emoji', '❤️',
      'key', 'heart_approach_differently',
      'scenario', 'Approach differently next time',
      'question', '❤️ If you could revisit one leadership moment — what would you approach differently, with compassion?'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'bell_accomplishments',
      'scenario', 'Accomplishments deserve recognition',
      'question', '🔔 What accomplishments deserve recognition — for your team and for your own leadership growth?'
    )
  );
$$;

create or replace function public._erbp_decision_learning()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Decision learning scaffolds review of assumptions and outcomes — metadata prompts only; no stored reflection journal content.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'accurate_assumptions', 'label', 'Accurate assumptions', 'description', 'Which assumptions held true — and what informed them?'),
      jsonb_build_object('key', 'incomplete_assumptions', 'label', 'Incomplete assumptions', 'description', 'What information was missing — and how might you gather it earlier next time?'),
      jsonb_build_object('key', 'unexpected_outcomes', 'label', 'Unexpected outcomes', 'description', 'What surprised you — and what does that reveal about complexity?'),
      jsonb_build_object('key', 'future_lessons', 'label', 'Lessons for future decisions', 'description', 'What would you carry forward — without self-judgment?')
    ),
    'personal_dse_route', '/app/assistant/decisions',
    'boundary_note', 'Distinct from personal DSE Phase 38 — executive reflection prompts prepare learning; humans decide and retain private notes.'
  );
$$;

create or replace function public._erbp_leadership_growth()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership growth is a lifelong journey — reflection scaffolds communication, delegation, relationships, strategic thinking, and team development.',
    'growth_areas', jsonb_build_array(
      jsonb_build_object('key', 'communication', 'label', 'Communication', 'description', 'Clarity, listening, and alignment in executive conversations'),
      jsonb_build_object('key', 'delegation', 'label', 'Delegation', 'description', 'Trust, empowerment, and appropriate ownership'),
      jsonb_build_object('key', 'relationships', 'label', 'Relationships', 'description', 'Stakeholder trust, team connection, and intentional presence'),
      jsonb_build_object('key', 'strategic_thinking', 'label', 'Strategic thinking', 'description', 'Long-term perspective beyond operational urgency'),
      jsonb_build_object('key', 'team_development', 'label', 'Team development', 'description', 'Coaching, recognition, and sustainable team growth')
    ),
    'journey_note', 'Extraordinary leaders are rarely perfect. They remain willing to learn.',
    'boundary_note', 'Growth scaffolds inform practice — Aipify never evaluates or scores leadership performance.'
  );
$$;

create or replace function public._erbp_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'owl_quarter_reflection',
      'scenario', 'Quarter experiences deserve reflection',
      'prompt', '🦉 Your quarter held meaningful experiences — would a gentle reflection summary help you notice what they are teaching you?'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'rose_growth_recognition',
      'scenario', 'Meaningful growth recognition',
      'prompt', '🌹 Meaningful growth often happens quietly — what progress deserves recognition in your leadership journey?'
    ),
    jsonb_build_object(
      'emoji', '❤️',
      'key', 'heart_imperfect_learning',
      'scenario', 'Learning through imperfect circumstances',
      'prompt', '❤️ Leadership learning often happens through imperfect circumstances — what compassion would you offer yourself from this period?'
    )
  );
$$;

create or replace function public._erbp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love supports self-compassion, perspective, progress recognition, and sustainable expectations in executive reflection.',
    'reflection_patterns', jsonb_build_array(
      'Self-compassion — imperfect leadership moments are learning opportunities, not failures',
      'Perspective — separate urgent operational noise from long-term leadership signals',
      'Progress recognition — celebrate growth without pressure to always accelerate',
      'Sustainable expectations — leadership endurance matters; reflection supports wellbeing'
    ),
    'learning_phrase', 'Extraordinary leaders are rarely perfect. They remain willing to learn.',
    'self_love_route', '/app/self-love-engine',
    'naming_doc', 'SELF_LOVE_NAMING_STANDARD.md',
    'boundary_note', 'Self Love is a principle — Executive Reflection stores metadata scaffolds, not wellbeing journal content.'
  );
$$;

create or replace function public._erbp_recognition_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Recognition and gratitude belong in reflection — celebrating milestones, recognizing resilience, appreciating collective achievements.',
    'recognition_patterns', jsonb_build_array(
      '🌹 Celebrating milestones — individual and team accomplishments in leadership reflection',
      'Recognizing resilience — progress through difficulty deserves acknowledgment',
      'Appreciating collective achievements — gratitude for team contribution in executive practice',
      'Gratitude in reflection — connect recognition trends without storing private appreciation content'
    ),
    'gratitude_route', '/app/gratitude-recognition-engine',
    'boundary_note', 'Cross-link Gratitude & Recognition A.89 — metadata trends only; reflection content stays private.'
  );
$$;

create or replace function public._erbp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive reflection must explain what experiences contribute to prompts, what remains private, and that insights are always optional.',
    'what_contributes', jsonb_build_array(
      'Aggregated organization health and executive report metadata — not private reflection content',
      'Since Last Time operational counts — trends only, no PII',
      'Strategic engagement counts from objectives and open decisions — context for reflection timing',
      'Companion scaffolds from Phase 66 — preparation patterns, not evaluation scores'
    ),
    'what_remains_private', jsonb_build_array(
      'Personal reflection responses and journal content — never stored in new Phase 82 tables',
      'Leadership self-assessment notes — private unless leader intentionally shares',
      'Decision learning details — optional human notes outside Aipify storage'
    ),
    'optional_insights', jsonb_build_array(
      'Reflection prompts are invitations — leaders choose whether and when to reflect',
      'Decision learning scaffolds prepare review — no automated leadership scoring',
      'Recognition connection suggests gratitude patterns — not mandatory recognition actions'
    ),
    'uncertainty_note', 'Reflection supports learning — leadership validates insights before organizational action.',
    'audit_note', 'Report generation and schedule metadata logged via _eie_log — reflection content not audited in Core.'
  );
$$;

create or replace function public._erbp_privacy_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive reflections are private unless intentionally shared — growth not evaluation.',
    'privacy_rules', jsonb_build_array(
      'No new tables for raw reflection journal content — privacy-first scaffold only',
      'Reflection prompts are metadata — responses stay with the leader unless explicitly shared',
      'No leadership performance scoring or comparative evaluation',
      'Growth framing — reflection transforms experience into wisdom, not employee-style review',
      'Optional sharing — any organizational insight from reflection requires intentional human choice'
    ),
    'growth_not_evaluation_note', 'Phase 82 deepens reflection practice — distinct from performance management or evaluation systems.'
  );
$$;

create or replace function public._erbp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group leadership validates executive reflection patterns internally; Unonight is the first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — strategic decisions, ecosystem development, leadership growth, organizational stewardship',
      'focus', jsonb_build_array(
        'Strategic decisions — quarterly reflection on ecosystem and product leadership choices',
        'Ecosystem development — lessons from partner and marketplace stewardship',
        'Leadership growth — communication, delegation, and team development reflection',
        'Organizational stewardship — sustainable pacing for executive team'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce leadership reflection and decision learning',
      'focus', jsonb_build_array(
        'Decision learning scaffolds after operational leadership choices',
        'Recognition connection in quarterly leadership reflection',
        'Self-compassion patterns for sustainable commerce leadership',
        'Private reflection practice — growth not evaluation'
      )
    )
  );
$$;

create or replace function public._erbp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Self-compassion, perspective, sustainable expectations — principle only'),
    jsonb_build_object('label', 'Gratitude & Recognition (A.89)', 'route', '/app/gratitude-recognition-engine', 'note', 'Celebrating milestones and resilience in reflection — cross-link only'),
    jsonb_build_object('label', 'Purpose & Values (A.82)', 'route', '/app/purpose-values-engine', 'note', 'Blueprint Phase 64 organizational values — distinct from executive leadership reflection'),
    jsonb_build_object('label', 'Wisdom Engine (A.93)', 'route', '/app/wisdom-engine', 'note', 'Experience synthesis over time — cross-link for long-term leadership wisdom'),
    jsonb_build_object('label', 'Decision Support Engine (DSE Phase 38)', 'route', '/app/assistant/decisions', 'note', 'Personal decision guidance — distinct from executive decision learning scaffolds'),
    jsonb_build_object('label', 'Legacy Engine (A.86)', 'route', '/app/legacy-engine', 'note', 'Long-term impact reflection — cross-link only'),
    jsonb_build_object('label', 'Human Success (repo Phase 82)', 'route', '/app/human-success', 'note', 'Experience, Adoption & Human Success — repo phase number collision with ABOS blueprint 82'),
    jsonb_build_object('label', 'Executive Companion (Phase 66)', 'route', '/app/executive-insights-engine', 'note', 'Phase 66 companion preparation preserved — Phase 82 deepens reflection'),
    jsonb_build_object('label', 'Strategic Thinking (Phase 59)', 'route', '/app/executive-insights-engine', 'note', 'Phase 59 _stbp_* strategic reflection — preserved on same route'),
    jsonb_build_object('label', 'Organizational Decision Support (A.54)', 'route', '/app/organizational-decision-support-engine', 'note', 'Structured org decisions awaiting leadership review'),
    jsonb_build_object('label', 'Executive Insights (A.35)', 'route', '/app/executive-insights-engine', 'note', 'Primary engine — Phases 13, 59, 66, and 82 layered on A.35')
  );
$$;

create or replace function public._erbp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'I am becoming a better leader because I take time to understand what my experiences are teaching me.',
    'Wiser, grounded, compassionate leaders.',
    'Reflection transforms experience into wisdom.',
    'Extraordinary leaders are rarely perfect. They remain willing to learn.',
    'Growth, not evaluation — executive reflections stay private unless intentionally shared.'
  );
$$;

create or replace function public._erbp_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_companion jsonb;
  v_reports int := 0;
begin
  v_companion := public._ecbp_engagement_summary(p_org_id);

  select count(*) into v_reports
  from public.executive_reports where organization_id = p_org_id;

  return jsonb_build_object(
    'organization_health_score', coalesce((v_companion->>'organization_health_score')::int, 0),
    'health_status', v_companion->>'health_status',
    'executive_reports_total', v_reports,
    'operational_risks_count', coalesce((v_companion->>'operational_risks_count')::int, 0),
    'recommended_actions_count', coalesce((v_companion->>'recommended_actions_count')::int, 0),
    'strategic_objectives_active', coalesce((v_companion->>'strategic_objectives_active')::int, 0),
    'reflection_prompts_available', jsonb_array_length(public._erbp_reflection_prompts()),
    'summary_note', 'Executive reflection engagement — metadata counts only; reflection content stays private unless intentionally shared.'
  );
end; $$;

create or replace function public._erbp_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
begin
  v_engagement := public._erbp_engagement_summary(p_org_id);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'increased_self_awareness',
      'label', 'Increased self-awareness — reflection prompts and perspective building documented',
      'met', jsonb_array_length(public._erbp_reflection_prompts()) >= 4,
      'note', '🦉🌹❤️🔔 reflection prompts — private by default; growth not evaluation.'
    ),
    jsonb_build_object(
      'key', 'leadership_learning',
      'label', 'Strengthened leadership learning — decision learning scaffolds present',
      'met', jsonb_array_length(public._erbp_decision_learning()->'dimensions') >= 4,
      'note', 'Assumptions, outcomes, and future lessons — metadata prompts only.'
    ),
    jsonb_build_object(
      'key', 'sustainable_practices',
      'label', 'Improved sustainable practices — leadership growth and wellbeing objectives',
      'met', jsonb_array_length(public._erbp_objectives()) >= 6,
      'note', 'Communication, delegation, relationships, strategic thinking, team development.'
    ),
    jsonb_build_object(
      'key', 'intentional_reflection',
      'label', 'Intentional reflection — companion guidance for quarter review and compassion',
      'met', jsonb_array_length(public._erbp_companion_guidance()) >= 3,
      'note', '🦉🌹❤️ companion patterns — invitations, not directives.'
    ),
    jsonb_build_object(
      'key', 'greater_perspective',
      'label', 'Greater perspective — leadership growth areas and journey framing',
      'met', jsonb_array_length(public._erbp_leadership_growth()->'growth_areas') >= 5,
      'note', 'Lifelong journey — no leadership performance scoring.'
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — self-compassion and sustainable expectations',
      'met', (public._erbp_self_love_connection()->>'learning_phrase') is not null,
      'note', 'Extraordinary leaders are rarely perfect. They remain willing to learn.'
    ),
    jsonb_build_object(
      'key', 'recognition_connection',
      'label', 'Recognition connection — gratitude in reflection cross-link',
      'met', (public._erbp_recognition_connection()->'gratitude_route') is not null,
      'note', '🌹 Celebrating milestones and collective achievements — metadata only.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust — what contributes, what stays private, optional insights',
      'met', (public._erbp_trust_connection()->'what_remains_private') is not null,
      'note', 'Reflection content not stored in new Phase 82 tables.'
    ),
    jsonb_build_object(
      'key', 'privacy_principles',
      'label', 'Privacy — executive reflections private unless intentionally shared',
      'met', (public._erbp_privacy_principles()->>'growth_not_evaluation_note') is not null,
      'note', 'Growth not evaluation — no new reflection journal tables.'
    ),
    jsonb_build_object(
      'key', 'reflection_engagement',
      'label', 'Live executive reflection engagement summary',
      'met', v_engagement ? 'organization_health_score',
      'note', format(
        'Health %s, %s reports, %s reflection prompts, %s active objectives.',
        coalesce((v_engagement->>'organization_health_score')::int, 0),
        coalesce((v_engagement->>'executive_reports_total')::int, 0),
        coalesce((v_engagement->>'reflection_prompts_available')::int, 0),
        coalesce((v_engagement->>'strategic_objectives_active')::int, 0)
      )
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links Self Love A.76, Gratitude A.89, Purpose A.82, Wisdom A.93, DSE Phase 38',
      'met', jsonb_array_length(public._erbp_integration_links()) >= 10,
      'note', 'Distinct from Human Success repo Phase 82 and Purpose & Values A.82.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — strategic decisions, ecosystem development, leadership growth',
      'met', (public._erbp_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    ),
    jsonb_build_object(
      'key', 'no_reflection_evaluation',
      'label', 'Growth not evaluation — no leadership performance scoring or stored journal content',
      'met', true,
      'note', 'Metadata scaffolds only — reflection responses stay with the leader.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL A.35 + Phase 13 + Phase 59 + Phase 66; append Phase 82
-- ---------------------------------------------------------------------------
create or replace function public.get_executive_insights_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.executive_insights_settings;
  v_health int;
  v_content jsonb;
  v_since jsonb;
begin
  perform public._irp_require_permission('executive.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._eie_ensure_settings(v_org_id);
  perform public._eie_seed_org_content(v_org_id);

  v_health := public._eie_compute_health_score(v_org_id);
  v_content := public._eie_generate_report_content(v_org_id, 'weekly');

  begin
    v_user_id := public._mta_app_user_id();
    if v_user_id is not null then
      v_since := public._eie_since_last_time_summary(v_org_id, v_user_id);
    end if;
  exception when others then
    v_since := jsonb_build_object(
      'since', now() - interval '7 days',
      'since_source', 'seven_day_fallback',
      'assumption_note', 'Authenticated user required for personalized Since Last Time — using 7-day fallback.'
    );
  end;

  return jsonb_build_object(
    'has_organization', true,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 13 — Executive Insights Engine Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE13_EXECUTIVE_INSIGHTS_FOUNDATION.md',
      'engine_phase', 'A.35 Executive Insights Engine',
      'route', '/app/executive-insights-engine',
      'mapping_note', 'ABOS Blueprint Phase 13 maps to Executive Insights Engine A.35 — extend, do not duplicate. Distinct from Platform Admin /platform/executive and customer /app/executive briefings.'
    ),
    'implementation_blueprint_phase59', jsonb_build_object(
      'phase', 'Phase 59 — Strategic Thinking Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE59_STRATEGIC_THINKING.md',
      'engine_phase', 'A.35 Executive Insights Engine',
      'route', '/app/executive-insights-engine',
      'mapping_note', 'ABOS Blueprint Phase 59 maps to Executive Insights Engine A.35 — strategic thinking and leadership reflection on executive reporting metadata.'
    ),
    'implementation_blueprint_phase66', jsonb_build_object(
      'phase', 'Phase 66 — Executive Companion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE66_EXECUTIVE_COMPANION.md',
      'engine_phase', 'A.35 Executive Insights Engine',
      'route', '/app/executive-insights-engine',
      'mapping_note', 'ABOS Blueprint Phase 66 maps to Executive Insights Engine A.35 — trusted executive companion for clarity, preparation, and strategic awareness. Distinct from Predictive Insights A.66 at /app/predictive-insights-engine.'
    ),
    'implementation_blueprint_phase82', jsonb_build_object(
      'phase', 'Phase 82 — Executive Reflection Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE82_EXECUTIVE_REFLECTION.md',
      'engine_phase', 'A.35 Executive Insights Engine',
      'route', '/app/executive-insights-engine',
      'mapping_note', 'ABOS Blueprint Phase 82 maps to Executive Insights Engine A.35 — intentional leadership reflection and decision learning. Distinct from Human Success repo Phase 82 at /app/human-success and Purpose & Values A.82 at /app/purpose-values-engine.'
    ),
    'mission', 'Clear executive guidance from organizational data — healthier decisions, stronger operations, sustainable growth.',
    'philosophy', 'Executives need clarity, not more dashboards — surface what matters with explainable metadata summaries.',
    'abos_principle', 'Clarity beats noise — explainable executive insights help leaders decide with confidence.',
    'vision', 'Leaders see what changed, why it matters, and what to do next — with transparent sources and sustainable pacing.',
    'executive_insights_engine_note', 'Executive Insights Engine Foundation (ABOS Phase 13) — extends Executive Insights Engine (Phase A.35).',
    'strategic_thinking_note', 'Strategic Thinking Engine (ABOS Phase 59) — strategic reflection, priority alignment, opportunity exploration, and review session frameworks on A.35 executive reporting.',
    'executive_companion_note', 'Executive Companion Engine (ABOS Phase 66) — trusted executive companion for clarity, preparation, strategic awareness, and leadership reflection on A.35 executive reporting.',
    'executive_reflection_note', 'Executive Reflection Engine (ABOS Phase 82) — intentional leadership reflection, decision learning, and sustainable practices — private by default; growth not evaluation.',
    'distinction_note', 'Distinct from Platform Admin /platform/executive (global governance) and customer /app/executive (daily briefings) — this engine provides tenant-scoped executive reporting and strategic summaries.',
    'blueprint_distinction_note', public._stbp_distinction_note(),
    'companion_blueprint_distinction_note', public._ecbp_distinction_note(),
    'reflection_blueprint_distinction_note', public._erbp_distinction_note(),
    'executive_objectives', public._eie_executive_objectives(),
    'overview_capabilities', public._eie_overview_capabilities(),
    'insight_categories', public._eie_insight_categories(),
    'since_last_time', coalesce(v_since, jsonb_build_object('since', now() - interval '7 days', 'since_source', 'seven_day_fallback')),
    'companion_communication_examples', public._eie_companion_communication_examples(),
    'self_love_connection', public._eie_self_love_connection(),
    'self_love_note', 'Self Love (A.76) supports executive perspective and sustainable pacing — principle only; Executive Insights stores metadata, not wellbeing content.',
    'trust_connection', public._eie_trust_connection(),
    'data_sources', public._eie_data_sources(),
    'dogfooding', public._eie_blueprint_dogfooding(),
    'success_criteria', public._eie_blueprint_success_criteria(v_org_id),
    'vision_phrases', public._eie_vision_phrases(),
    'integration_links', public._eie_integration_links(),
    'safety_note', 'Metadata and summary scores only — no customer email, chat, order content, or PII.',
    'principles', jsonb_build_array(
      'Tenant-aware reporting across Analytics, Operations, Customer Success, and Strategic Intelligence',
      'Explainable insights with confidence and severity metadata',
      'Action-oriented summaries with rationale, urgency, and estimated effort',
      'Human leadership retains all strategic and operational decisions',
      'Full audit via report generation, exports, and schedule changes',
      'Since Last Time — counts and trends only, no PII',
      'Strategic thinking scaffolds — hypotheses labeled separately from verified data',
      'Executive companion scaffolds — preparation and reflection; leadership retains authority',
      'Executive reflection scaffolds — private by default; growth not evaluation; no stored journal content'
    ),
    'summary', jsonb_build_object(
      'health_score', v_health,
      'health_status', public._eie_health_status(v_health),
      'risk_count', jsonb_array_length(coalesce(v_content->'risks', '[]'::jsonb)),
      'opportunity_count', jsonb_array_length(coalesce(v_content->'opportunities', '[]'::jsonb)),
      'action_count', jsonb_array_length(coalesce(v_content->'recommended_actions', '[]'::jsonb)),
      'reports_generated', coalesce((select count(*) from public.executive_reports where organization_id = v_org_id), 0)
    ),
    'organization_health', jsonb_build_object(
      'score', v_health,
      'status', public._eie_health_status(v_health),
      'factors', jsonb_build_object(
        'analytics', 'A.16 Analytics & Insights',
        'operations', 'A.9 Operations Dashboard / A.32 Operations Center',
        'customer_success', 'A.26 Customer Success',
        'quality', 'A.13 Quality Guardian',
        'governance', 'A.14 Governance & Policy',
        'security', 'A.18 Security & Trust',
        'support', 'A.7 Support AI'
      )
    ),
    'major_achievements', coalesce(v_content->'key_highlights', '[]'::jsonb),
    'operational_risks', coalesce(v_content->'risks', '[]'::jsonb),
    'strategic_opportunities', coalesce(v_content->'opportunities', '[]'::jsonb),
    'customer_trends', coalesce((
      select jsonb_build_array(
        jsonb_build_object(
          'metric', 'health_score',
          'value', coalesce(p.health_score, 0),
          'status', coalesce(p.health_status, 'healthy')
        ),
        jsonb_build_object(
          'metric', 'adoption_score',
          'value', coalesce(p.adoption_score, 0),
          'status', case when p.adoption_score >= 70 then 'healthy' else 'needs_attention' end
        ),
        jsonb_build_object(
          'metric', 'renewal_risk',
          'value', coalesce(p.renewal_risk, 'low'),
          'status', p.renewal_risk
        )
      )
      from public.organization_customer_success p where p.organization_id = v_org_id
    ), '[]'::jsonb),
    'ai_recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'action_key', a->>'action_key',
        'title', a->>'title',
        'rationale', a->>'rationale',
        'urgency', a->>'urgency',
        'expected_outcome', a->>'expected_outcome',
        'estimated_effort', a->>'estimated_effort',
        'route', a->>'route'
      ))
      from jsonb_array_elements(coalesce(v_content->'recommended_actions', '[]'::jsonb)) a
      where (a->>'urgency') in ('high', 'critical', 'medium')
    ), '[]'::jsonb),
    'recommended_actions', coalesce(v_content->'recommended_actions', '[]'::jsonb),
    'recent_reports', public.list_executive_reports(5),
    'schedules', public.get_executive_report_schedules(),
    'settings', row_to_json(v_settings),
    'source_modules', jsonb_build_array(
      jsonb_build_object('key', 'analytics_insights_engine', 'label', 'Analytics (A.16)', 'route', '/app/analytics-insights-engine'),
      jsonb_build_object('key', 'operations_dashboard_engine', 'label', 'Operations Dashboard (A.9)', 'route', '/app/operations-dashboard-engine'),
      jsonb_build_object('key', 'operations_center', 'label', 'Operations Center (A.32)', 'route', '/app/operations'),
      jsonb_build_object('key', 'customer_success_engine', 'label', 'Customer Success (A.26)', 'route', '/app/customer-success-engine'),
      jsonb_build_object('key', 'strategic_intelligence', 'label', 'Strategic Intelligence (A.31)', 'route', '/app/strategy'),
      jsonb_build_object('key', 'quality_guardian_engine', 'label', 'Quality Guardian (A.13)', 'route', '/app/quality-guardian-engine'),
      jsonb_build_object('key', 'governance_policy_engine', 'label', 'Governance (A.14)', 'route', '/app/governance-policy-engine'),
      jsonb_build_object('key', 'security_trust_engine', 'label', 'Security (A.18)', 'route', '/app/settings/security'),
      jsonb_build_object('key', 'support_ai_engine', 'label', 'Support AI (A.7)', 'route', '/app/support-ai-engine')
    ),
    'blueprint_mission', public._stbp_blueprint_mission(),
    'blueprint_philosophy', public._stbp_blueprint_philosophy(),
    'blueprint_abos_principle', public._stbp_blueprint_abos_principle(),
    'strategic_thinking_objectives', public._stbp_blueprint_objectives(),
    'strategic_conversations', public._stbp_strategic_conversations(),
    'priority_alignment', public._stbp_priority_alignment(),
    'opportunity_exploration', public._stbp_opportunity_exploration(),
    'strategic_review_sessions', public._stbp_strategic_review_sessions(),
    'executive_briefings', public._stbp_executive_briefings(),
    'strategic_self_love', public._stbp_self_love_connection(),
    'strategic_trust', public._stbp_trust_connection(),
    'strategic_dogfooding', public._stbp_dogfooding(),
    'strategic_integration_links', public._stbp_integration_links(),
    'strategic_engagement_summary', public._stbp_engagement_summary(v_org_id),
    'strategic_success_criteria', public._stbp_blueprint_success_criteria(v_org_id),
    'strategic_vision_phrases', public._stbp_vision_phrases(),
    'companion_mission', public._ecbp_mission(),
    'companion_philosophy', public._ecbp_philosophy(),
    'companion_abos_principle', public._ecbp_abos_principle(),
    'executive_companion_objectives', public._ecbp_objectives(),
    'companion_daily_briefings', public._ecbp_daily_briefings(),
    'companion_leadership_preparation', public._ecbp_leadership_preparation(),
    'companion_executive_reflection', public._ecbp_executive_reflection(),
    'companion_priority_alignment', public._ecbp_priority_alignment(),
    'companion_organizational_visibility', public._ecbp_organizational_visibility(),
    'companion_executive_decision_support', public._ecbp_executive_decision_support(),
    'companion_self_love', public._ecbp_self_love_connection(),
    'companion_trust', public._ecbp_trust_connection(),
    'companion_dogfooding', public._ecbp_dogfooding(),
    'companion_integration_links', public._ecbp_integration_links(),
    'companion_engagement_summary', public._ecbp_engagement_summary(v_org_id),
    'companion_success_criteria', public._ecbp_success_criteria(v_org_id),
    'companion_vision_phrases', public._ecbp_vision_phrases(),
    'reflection_mission', public._erbp_mission(),
    'reflection_philosophy', public._erbp_philosophy(),
    'reflection_abos_principle', public._erbp_abos_principle(),
    'executive_reflection_objectives', public._erbp_objectives(),
    'reflection_prompts', public._erbp_reflection_prompts(),
    'reflection_decision_learning', public._erbp_decision_learning(),
    'reflection_leadership_growth', public._erbp_leadership_growth(),
    'reflection_companion_guidance', public._erbp_companion_guidance(),
    'reflection_self_love', public._erbp_self_love_connection(),
    'reflection_recognition_connection', public._erbp_recognition_connection(),
    'reflection_trust', public._erbp_trust_connection(),
    'reflection_privacy_principles', public._erbp_privacy_principles(),
    'reflection_dogfooding', public._erbp_dogfooding(),
    'reflection_integration_links', public._erbp_integration_links(),
    'reflection_engagement_summary', public._erbp_engagement_summary(v_org_id),
    'reflection_success_criteria', public._erbp_success_criteria(v_org_id),
    'reflection_vision_phrases', public._erbp_vision_phrases()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve Phase 13 + Phase 59 + Phase 66; append Phase 82 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_executive_insights_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_health int;
  v_risks int;
  v_actions int;
  v_since jsonb;
  v_engagement jsonb;
  v_companion jsonb;
  v_reflection jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._eie_seed_org_content(v_org_id);
  v_health := public._eie_compute_health_score(v_org_id);
  v_engagement := public._stbp_engagement_summary(v_org_id);
  v_companion := public._ecbp_engagement_summary(v_org_id);
  v_reflection := public._erbp_engagement_summary(v_org_id);

  select jsonb_array_length(public._eie_aggregate_risks(v_org_id)),
         jsonb_array_length(public._eie_build_recommended_actions(v_org_id))
  into v_risks, v_actions;

  begin
    v_user_id := public._mta_app_user_id();
    if v_user_id is not null then
      v_since := public._eie_since_last_time_summary(v_org_id, v_user_id);
    end if;
  exception when others then
    v_since := null;
  end;

  return jsonb_build_object(
    'has_organization', true,
    'health_score', v_health,
    'health_status', public._eie_health_status(v_health),
    'risk_count', v_risks,
    'action_count', v_actions,
    'philosophy', 'Executives need clarity, not more dashboards — surface what matters with explainable metadata.',
    'mission', 'Clear executive guidance from organizational data — healthier decisions, stronger operations, sustainable growth.',
    'abos_principle', 'Clarity beats noise — explainable executive insights help leaders decide with confidence.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 13 — Executive Insights Engine Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE13_EXECUTIVE_INSIGHTS_FOUNDATION.md',
      'engine_phase', 'A.35 Executive Insights Engine',
      'route', '/app/executive-insights-engine'
    ),
    'implementation_blueprint_phase59', jsonb_build_object(
      'phase', 'Phase 59 — Strategic Thinking Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE59_STRATEGIC_THINKING.md',
      'engine_phase', 'A.35 Executive Insights Engine',
      'route', '/app/executive-insights-engine'
    ),
    'implementation_blueprint_phase66', jsonb_build_object(
      'phase', 'Phase 66 — Executive Companion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE66_EXECUTIVE_COMPANION.md',
      'engine_phase', 'A.35 Executive Insights Engine',
      'route', '/app/executive-insights-engine'
    ),
    'implementation_blueprint_phase82', jsonb_build_object(
      'phase', 'Phase 82 — Executive Reflection Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE82_EXECUTIVE_REFLECTION.md',
      'engine_phase', 'A.35 Executive Insights Engine',
      'route', '/app/executive-insights-engine'
    ),
    'executive_insights_engine_note', 'Executive Insights Engine Foundation (ABOS Phase 13) — extends Executive Insights Engine (Phase A.35).',
    'strategic_thinking_note', 'Strategic Thinking Engine (ABOS Phase 59) — strategic reflection and leadership preparation on executive insights metadata.',
    'executive_companion_note', 'Executive Companion Engine (ABOS Phase 66) — trusted executive companion for clarity, preparation, and strategic awareness.',
    'executive_reflection_note', 'Executive Reflection Engine (ABOS Phase 82) — intentional leadership reflection and decision learning — private by default; growth not evaluation.',
    'blueprint_note', 'Strategic thinking, executive companion, and reflection scaffolds — hypotheses labeled separately from verified data; humans decide.',
    'since_last_time', v_since,
    'strategic_engagement_summary', v_engagement,
    'companion_engagement_summary', v_companion,
    'reflection_engagement_summary', v_reflection
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants
-- ---------------------------------------------------------------------------
grant execute on function public._erbp_distinction_note() to authenticated;
grant execute on function public._erbp_mission() to authenticated;
grant execute on function public._erbp_philosophy() to authenticated;
grant execute on function public._erbp_abos_principle() to authenticated;
grant execute on function public._erbp_objectives() to authenticated;
grant execute on function public._erbp_reflection_prompts() to authenticated;
grant execute on function public._erbp_decision_learning() to authenticated;
grant execute on function public._erbp_leadership_growth() to authenticated;
grant execute on function public._erbp_companion_guidance() to authenticated;
grant execute on function public._erbp_self_love_connection() to authenticated;
grant execute on function public._erbp_recognition_connection() to authenticated;
grant execute on function public._erbp_trust_connection() to authenticated;
grant execute on function public._erbp_privacy_principles() to authenticated;
grant execute on function public._erbp_dogfooding() to authenticated;
grant execute on function public._erbp_integration_links() to authenticated;
grant execute on function public._erbp_vision_phrases() to authenticated;
grant execute on function public._erbp_engagement_summary(uuid) to authenticated;
grant execute on function public._erbp_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'executive-reflection-blueprint', 'Executive Reflection Engine (ABOS Phase 82)',
  'Executive Reflection Engine — extends Executive Insights Engine A.35 with intentional leadership reflection, decision learning, privacy-first growth scaffolds, and sustainable leadership practices.',
  'authenticated', 108
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'executive-reflection-blueprint' and tenant_id is null
);
