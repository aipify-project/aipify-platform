-- Implementation Blueprint Phase 66 — Executive Companion Engine
-- Extends Executive Insights Engine (Phase A.35 + ABOS Phase 13 + Phase 59). No new tables.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._ecbp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 66 — Executive Companion Engine at /app/executive-insights-engine. Extends Executive Insights Engine Phase A.35, Blueprint Phase 13, and Phase 59 Strategic Thinking. Distinct from Predictive Insights Engine Phase A.66 at /app/predictive-insights-engine (repo phase number collision with ABOS blueprint 66). Distinct from Command Center /app/command-center and Briefing /app/briefing (cross-links for daily briefings). Distinct from Assistant DSE Phase 38 /app/assistant/decisions (personal decision support). Distinct from Organizational Decision Support A.54. Distinct from Platform Admin /platform/executive. Helpers: _eie_* (A.35), _stbp_* (Phase 59), Phase 13 helpers — Blueprint Phase 66 uses _ecbp_* only. All Phase A.35, Phase 13, and Phase 59 dashboard fields preserved.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._ecbp_mission()
returns text language sql immutable as $$
  select 'Trusted executive companion — clarity, preparation, strategic awareness; preserve human judgment.';
$$;

create or replace function public._ecbp_philosophy()
returns text language sql immutable as $$
  select 'Leadership creates direction, enables people, and decides under uncertainty — Aipify strengthens leaders, does not replace them.';
$$;

create or replace function public._ecbp_abos_principle()
returns text language sql immutable as $$
  select 'Leadership means better questions, listening, and environments where people succeed — not having all the answers.';
$$;

create or replace function public._ecbp_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'executive_preparation', 'label', 'Executive preparation', 'description', 'Meeting prep, board discussion support, executive briefing summaries, strategic conversation prompts'),
    jsonb_build_object('key', 'leadership_reflection', 'label', 'Leadership reflection', 'description', 'Long-term priorities attention, achievements recognition, team support needs — 🦉🌹❤️ companion patterns'),
    jsonb_build_object('key', 'strategic_awareness', 'label', 'Strategic awareness', 'description', 'Emerging opportunities, milestones, positive developments — metadata summaries only'),
    jsonb_build_object('key', 'priority_clarification', 'label', 'Priority clarification', 'description', 'Strategic initiatives, operational responsibilities, team commitments, leadership focus — intentional leadership'),
    jsonb_build_object('key', 'organizational_visibility', 'label', 'Organizational visibility', 'description', 'Cross-functional summaries, emerging concerns, recognition trends, progress against strategic initiatives'),
    jsonb_build_object('key', 'decision_readiness', 'label', 'Decision readiness', 'description', 'Factors to consider, priority alignment, risks warranting discussion — humans decide outcomes')
  );
$$;

create or replace function public._ecbp_daily_briefings()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '📈',
      'key', 'chart_strategic_priorities',
      'scenario', 'Strategic priorities for executive daily briefing',
      'example', '📈 Here are your strategic priorities and emerging opportunities for today — prepared when you are ready.'
    ),
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'owl_milestones',
      'scenario', 'Milestone awareness without urgency pressure',
      'example', '🦉 Three milestones progressed this week — would you like a summary before your leadership session?'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'bell_positive_developments',
      'scenario', 'Positive developments worth leadership attention',
      'example', '🔔 Several positive developments surfaced across teams — available for your briefing when convenient.'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'rose_sustainable_pace',
      'scenario', 'Sustainable executive pacing',
      'example', '🌹 Your briefing includes progress recognition — leadership is a journey rather than a destination.'
    )
  );
$$;

create or replace function public._ecbp_leadership_preparation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership preparation scaffolds meeting prep, board discussion support, executive briefing summaries, and strategic conversation prompts — Aipify prepares, humans lead.',
    'preparation_types', jsonb_build_array(
      jsonb_build_object('key', 'meeting_prep', 'label', 'Meeting preparation', 'description', 'Agenda context, open decisions, and cross-functional signals — metadata only'),
      jsonb_build_object('key', 'board_discussion', 'label', 'Board discussion support', 'description', 'Strategic health trajectory, risk summaries, and milestone progress for board-ready briefings'),
      jsonb_build_object('key', 'executive_briefing', 'label', 'Executive briefing summaries', 'description', 'Since Last Time counts, organization health, and recommended actions — distinct from /app/briefing daily flow'),
      jsonb_build_object('key', 'strategic_conversation', 'label', 'Strategic conversation prompts', 'description', 'Reflection questions and alignment checks — companion patterns, not automated strategy')
    ),
    'command_center_route', '/app/command-center',
    'briefing_route', '/app/briefing',
    'boundary_note', 'Preparation scaffolds inform conversations — leadership retains every decision and facilitation outcome.'
  );
$$;

create or replace function public._ecbp_executive_reflection()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'owl_long_term_priorities',
      'scenario', 'Long-term priorities attention',
      'question', '🦉 Which long-term priorities deserve your attention this month — and which can wait without guilt?'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'rose_achievements',
      'scenario', 'Achievements recognition',
      'question', '🌹 What progress deserves recognition — for your team and for your own leadership journey?'
    ),
    jsonb_build_object(
      'emoji', '❤️',
      'key', 'heart_team_support',
      'scenario', 'Team support needs',
      'question', '❤️ Where does your team need support most — and what would intentional leadership look like there?'
    ),
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'owl_perspective',
      'scenario', 'Perspective under complexity',
      'question', '🦉 Looking beyond this week''s noise — what matters most for sustainable leadership?'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'rose_recovery',
      'scenario', 'Recovery and pacing',
      'question', '🌹 Leadership is a journey — what would healthy pacing look like before your next major commitment?'
    )
  );
$$;

create or replace function public._ecbp_priority_alignment()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Priority alignment connects strategic initiatives, operational responsibilities, team commitments, and leadership focus — intentional leadership visibility scaffold only.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'strategic_initiatives', 'label', 'Strategic initiatives', 'description', 'Active objectives and improvement initiatives — status metadata from Strategic Alignment'),
      jsonb_build_object('key', 'operational_responsibilities', 'label', 'Operational responsibilities', 'description', 'High-priority tasks, risks, and operational health signals — cross-linked from Operations modules'),
      jsonb_build_object('key', 'team_commitments', 'label', 'Team commitments', 'description', 'OKR progress, capacity signals, and recognition trends — where teams concentrate effort'),
      jsonb_build_object('key', 'leadership_focus', 'label', 'Leadership focus', 'description', 'Pending organizational decisions, reviews, and executive actions awaiting human review')
    ),
    'intentional_leadership_note', 'Alignment visibility helps leaders choose focus — Aipify never auto-reprioritizes or dictates leadership attention.',
    'alignment_route', '/app/strategic-alignment-engine',
    'boundary_note', 'Distinct from Phase 59 _stbp_priority_alignment — companion framing emphasizes intentional leadership and sustainable pacing.'
  );
$$;

create or replace function public._ecbp_organizational_visibility()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizational visibility surfaces cross-functional summaries, emerging concerns, recognition trends, and progress against strategic initiatives — metadata only.',
    'visibility_areas', jsonb_build_array(
      jsonb_build_object('key', 'cross_functional', 'label', 'Cross-functional summaries', 'description', 'Health, operations, customer success, and strategic signals in one executive view'),
      jsonb_build_object('key', 'emerging_concerns', 'label', 'Emerging concerns', 'description', 'Operational risks and bottlenecks flagged for leadership awareness — not alarmist dashboards'),
      jsonb_build_object('key', 'recognition_trends', 'label', 'Recognition trends', 'description', 'Gratitude and recognition patterns — cross-link Gratitude Engine Phase 53 metadata'),
      jsonb_build_object('key', 'strategic_progress', 'label', 'Strategic initiative progress', 'description', 'Progress against stated objectives and OKRs — alignment gaps surfaced for review')
    ),
    'gratitude_route', '/app/gratitude-recognition-engine',
    'org_health_route', '/app/organizational-health-engine',
    'boundary_note', 'Visibility scaffolds inform leadership — humans interpret context and decide responses.'
  );
$$;

create or replace function public._ecbp_executive_decision_support()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive decision support prepares factors to consider, priority alignment checks, and risks warranting discussion — distinct from personal DSE and Organizational Decision Support A.54.',
    'support_patterns', jsonb_build_array(
      jsonb_build_object(
        'emoji', '🦉',
        'key', 'owl_factors',
        'scenario', 'Factors to consider',
        'prompt', '🦉 Before this decision — what factors, trade-offs, and alignment signals deserve your review?'
      ),
      jsonb_build_object(
        'emoji', '🌹',
        'key', 'rose_priority_alignment',
        'scenario', 'Priority alignment check',
        'prompt', '🌹 Does this decision align with your stated strategic priorities and team commitments?'
      ),
      jsonb_build_object(
        'emoji', '🔔',
        'key', 'bell_risks',
        'scenario', 'Risks warranting discussion',
        'prompt', '🔔 These risks may warrant leadership discussion — prepared when you want to review, no urgency implied.'
      )
    ),
    'personal_dse_route', '/app/assistant/decisions',
    'org_decision_route', '/app/organizational-decision-support-engine',
    'boundary_note', 'Aipify advises and prepares — leadership retains every executive decision; no auto-execution.'
  );
$$;

create or replace function public._ecbp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love supports sustainable pacing, perspective, recovery, and progress recognition — Leadership is a journey rather than a destination.',
    'companion_patterns', jsonb_build_array(
      'Sustainable pacing — recommend recovery and perspective over reactive leadership shifts',
      'Progress recognition — celebrate achievements without pressure to always accelerate',
      'Perspective — separate urgent operational noise from long-term leadership signals',
      'Recovery — leadership endurance matters; not every item requires immediate action'
    ),
    'journey_phrase', 'Leadership is a journey rather than a destination.',
    'self_love_route', '/app/self-love-engine',
    'naming_doc', 'SELF_LOVE_NAMING_STANDARD.md',
    'boundary_note', 'Self Love is a principle — Executive Companion stores metadata scaffolds, not wellbeing content.'
  );
$$;

create or replace function public._ecbp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive companion observations must explain what informs them, label optional recommendations, and acknowledge uncertainty areas.',
    'what_informs_observations', jsonb_build_array(
      'Aggregated organization health scores from operational modules',
      'Since Last Time operational counts with documented window source',
      'Executive report generation and schedule configuration metadata',
      'Strategic engagement counts from objectives, OKRs, and open decisions'
    ),
    'optional_recommendations', jsonb_build_array(
      'Recommended actions include rationale, urgency, and estimated effort — always optional',
      'Briefing examples and reflection prompts are companion patterns — not directives',
      'Decision support scaffolds prepare review — leadership chooses whether to act'
    ),
    'uncertainty_areas', jsonb_build_array(
      'Predictive and strategic intelligence signals marked as hypotheses',
      'Misalignment scaffolds — patterns suggesting review, not confirmed gaps',
      'Forward-looking opportunity items with confidence metadata required'
    ),
    'uncertainty_note', 'Uncertainty is acknowledged — leadership validates before executive action.',
    'audit_note', 'Report generation, exports, and schedule changes logged via _eie_log — metadata only.'
  );
$$;

create or replace function public._ecbp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group leadership validates executive companion patterns internally; Unonight is the first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — strategic planning, ecosystem stewardship, organizational prioritization, leadership development',
      'focus', jsonb_build_array(
        'Strategic planning — quarterly executive briefings and board discussion preparation',
        'Ecosystem stewardship — Phase 51 marketplace and partner intelligence cross-links',
        'Organizational prioritization — alignment between Aipify Group objectives and operational health',
        'Leadership development — reflection prompts and sustainable pacing for executive team'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce executive companion and leadership preparation',
      'focus', jsonb_build_array(
        'Executive daily briefing preparation with progress recognition',
        'Customer success and operational visibility for leadership sessions',
        'Decision readiness scaffolds with hypothesis labeling',
        'Sustainable leadership pacing in executive reflection prompts'
      )
    )
  );
$$;

create or replace function public._ecbp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Command Center', 'route', '/app/command-center', 'note', 'Daily executive presence and quick actions — cross-link for operational briefings'),
    jsonb_build_object('label', 'Briefing', 'route', '/app/briefing', 'note', 'Daily briefing flow — distinct from companion preparation scaffolds'),
    jsonb_build_object('label', 'Executive Dashboard', 'route', '/app/executive', 'note', 'Customer executive briefings — cross-link for daily summaries'),
    jsonb_build_object('label', 'Decision Support Engine (DSE Phase 38)', 'route', '/app/assistant/decisions', 'note', 'Personal decision guidance — distinct from executive companion decision readiness'),
    jsonb_build_object('label', 'Organizational Decision Support (A.54)', 'route', '/app/organizational-decision-support-engine', 'note', 'Structured org decisions awaiting leadership review'),
    jsonb_build_object('label', 'Predictive Insights (A.66)', 'route', '/app/predictive-insights-engine', 'note', 'Forward-looking predictions — distinct ABOS blueprint phase number collision with Phase 66'),
    jsonb_build_object('label', 'Strategic Alignment (A.55)', 'route', '/app/strategic-alignment-engine', 'note', 'Objectives, alignment reviews, misalignment detection'),
    jsonb_build_object('label', 'Strategic Intelligence (A.31)', 'route', '/app/strategic-intelligence-foundation-engine', 'note', 'Trends, opportunities, risks — hypothesis labeling required'),
    jsonb_build_object('label', 'Goals & OKR (A.65)', 'route', '/app/goals-okr-engine', 'note', 'Organizational objectives and key results'),
    jsonb_build_object('label', 'Organizational Health (A.56)', 'route', '/app/organizational-health-engine', 'note', 'Aggregate health indicators for executive visibility'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Sustainable pacing and perspective — principle only'),
    jsonb_build_object('label', 'Gratitude & Recognition (Phase 53)', 'route', '/app/gratitude-recognition-engine', 'note', 'Recognition trends for organizational visibility'),
    jsonb_build_object('label', 'Executive Insights (A.35)', 'route', '/app/executive-insights-engine', 'note', 'Primary engine — Phase 13, 59, and 66 layered on A.35')
  );
$$;

create or replace function public._ecbp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Navigate complexity with wisdom, humility, and confidence.',
    'Aipify helped me become a better leader.',
    'Leadership creates direction — Aipify strengthens, never replaces.',
    'Better questions and listening beat having all the answers.',
    'Leadership is a journey rather than a destination.'
  );
$$;

create or replace function public._ecbp_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_health int := 0;
  v_reports int := 0;
  v_risks int := 0;
  v_actions int := 0;
  v_st jsonb;
begin
  v_health := public._eie_compute_health_score(p_org_id);

  select count(*) into v_reports
  from public.executive_reports where organization_id = p_org_id;

  select jsonb_array_length(public._eie_aggregate_risks(p_org_id)),
         jsonb_array_length(public._eie_build_recommended_actions(p_org_id))
  into v_risks, v_actions;

  v_st := public._stbp_engagement_summary(p_org_id);

  return jsonb_build_object(
    'organization_health_score', v_health,
    'health_status', public._eie_health_status(v_health),
    'executive_reports_total', v_reports,
    'operational_risks_count', v_risks,
    'recommended_actions_count', v_actions,
    'strategic_objectives_active', coalesce((v_st->>'strategic_objectives_active')::int, 0),
    'active_okr_objectives', coalesce((v_st->>'active_okr_objectives')::int, 0),
    'pending_org_decisions', coalesce((v_st->>'pending_org_decisions')::int, 0),
    'summary_note', 'Executive companion engagement counts only — metadata summaries; leadership retains all decisions.'
  );
end; $$;

create or replace function public._ecbp_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
begin
  v_engagement := public._ecbp_engagement_summary(p_org_id);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'executive_clarity',
      'label', 'Executive clarity — daily briefings and preparation scaffolds documented',
      'met', jsonb_array_length(public._ecbp_daily_briefings()) >= 4,
      'note', '📈🦉🔔🌹 companion briefing patterns for leadership preparation.'
    ),
    jsonb_build_object(
      'key', 'leadership_reflection',
      'label', 'Leadership reflection — long-term priorities, achievements, team support prompts',
      'met', jsonb_array_length(public._ecbp_executive_reflection()) >= 4,
      'note', '🦉🌹❤️ reflection questions — humans decide responses.'
    ),
    jsonb_build_object(
      'key', 'strategic_awareness',
      'label', 'Strategic awareness — objectives and visibility scaffolds present',
      'met', jsonb_array_length(public._ecbp_objectives()) >= 6,
      'note', 'Emerging opportunities and milestones — metadata only.'
    ),
    jsonb_build_object(
      'key', 'priority_alignment',
      'label', 'Priority alignment — strategic initiatives, operations, team, leadership focus',
      'met', jsonb_array_length(public._ecbp_priority_alignment()->'dimensions') >= 4,
      'note', 'Intentional leadership visibility — no auto-reprioritization.'
    ),
    jsonb_build_object(
      'key', 'organizational_visibility',
      'label', 'Organizational visibility — cross-functional summaries and recognition trends',
      'met', jsonb_array_length(public._ecbp_organizational_visibility()->'visibility_areas') >= 4,
      'note', 'Emerging concerns surfaced for leadership awareness — not alarmist.'
    ),
    jsonb_build_object(
      'key', 'decision_readiness',
      'label', 'Executive decision support — factors, alignment, risks warranting discussion',
      'met', jsonb_array_length(public._ecbp_executive_decision_support()->'support_patterns') >= 3,
      'note', '🦉🌹🔔 distinct from personal DSE and Organizational Decision Support A.54.'
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — sustainable pacing, perspective, recovery, progress recognition',
      'met', (public._ecbp_self_love_connection()->>'journey_phrase') is not null,
      'note', 'Leadership is a journey rather than a destination.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust — what informs observations, optional recommendations, uncertainty areas',
      'met', (public._ecbp_trust_connection()->'uncertainty_areas') is not null,
      'note', 'Uncertainty acknowledged — leadership validates before action.'
    ),
    jsonb_build_object(
      'key', 'companion_engagement',
      'label', 'Live executive companion engagement summary',
      'met', v_engagement ? 'organization_health_score',
      'note', format(
        'Health %s, %s reports, %s risks, %s actions, %s active objectives.',
        coalesce((v_engagement->>'organization_health_score')::int, 0),
        coalesce((v_engagement->>'executive_reports_total')::int, 0),
        coalesce((v_engagement->>'operational_risks_count')::int, 0),
        coalesce((v_engagement->>'recommended_actions_count')::int, 0),
        coalesce((v_engagement->>'strategic_objectives_active')::int, 0)
      )
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from Predictive A.66, Command Center, Briefing, DSE, Platform Admin',
      'met', jsonb_array_length(public._ecbp_integration_links()) >= 12,
      'note', 'Extend existing engines — do not duplicate routes.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — strategic planning, ecosystem stewardship, leadership development',
      'met', (public._ecbp_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    ),
    jsonb_build_object(
      'key', 'no_auto_leadership_execution',
      'label', 'Aipify strengthens leaders — humans decide; no automated leadership execution',
      'met', true,
      'note', 'Metadata scaffolds only — leadership retains executive authority.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL A.35 + Phase 13 + Phase 59; append Phase 66
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
    'mission', 'Clear executive guidance from organizational data — healthier decisions, stronger operations, sustainable growth.',
    'philosophy', 'Executives need clarity, not more dashboards — surface what matters with explainable metadata summaries.',
    'abos_principle', 'Clarity beats noise — explainable executive insights help leaders decide with confidence.',
    'vision', 'Leaders see what changed, why it matters, and what to do next — with transparent sources and sustainable pacing.',
    'executive_insights_engine_note', 'Executive Insights Engine Foundation (ABOS Phase 13) — extends Executive Insights Engine (Phase A.35).',
    'strategic_thinking_note', 'Strategic Thinking Engine (ABOS Phase 59) — strategic reflection, priority alignment, opportunity exploration, and review session frameworks on A.35 executive reporting.',
    'executive_companion_note', 'Executive Companion Engine (ABOS Phase 66) — trusted executive companion for clarity, preparation, strategic awareness, and leadership reflection on A.35 executive reporting.',
    'distinction_note', 'Distinct from Platform Admin /platform/executive (global governance) and customer /app/executive (daily briefings) — this engine provides tenant-scoped executive reporting and strategic summaries.',
    'blueprint_distinction_note', public._stbp_distinction_note(),
    'companion_blueprint_distinction_note', public._ecbp_distinction_note(),
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
      'Executive companion scaffolds — preparation and reflection; leadership retains authority'
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
    'companion_vision_phrases', public._ecbp_vision_phrases()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve Phase 13 + Phase 59 + append Phase 66 framing
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
begin
  v_org_id := public._mta_require_organization();
  perform public._eie_seed_org_content(v_org_id);
  v_health := public._eie_compute_health_score(v_org_id);
  v_engagement := public._stbp_engagement_summary(v_org_id);
  v_companion := public._ecbp_engagement_summary(v_org_id);

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
    'executive_insights_engine_note', 'Executive Insights Engine Foundation (ABOS Phase 13) — extends Executive Insights Engine (Phase A.35).',
    'strategic_thinking_note', 'Strategic Thinking Engine (ABOS Phase 59) — strategic reflection and leadership preparation on executive insights metadata.',
    'executive_companion_note', 'Executive Companion Engine (ABOS Phase 66) — trusted executive companion for clarity, preparation, and strategic awareness.',
    'blueprint_note', 'Strategic thinking and executive companion scaffolds — hypotheses labeled separately from verified data; humans decide.',
    'since_last_time', v_since,
    'strategic_engagement_summary', v_engagement,
    'companion_engagement_summary', v_companion
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants
-- ---------------------------------------------------------------------------
grant execute on function public._ecbp_distinction_note() to authenticated;
grant execute on function public._ecbp_mission() to authenticated;
grant execute on function public._ecbp_philosophy() to authenticated;
grant execute on function public._ecbp_abos_principle() to authenticated;
grant execute on function public._ecbp_objectives() to authenticated;
grant execute on function public._ecbp_daily_briefings() to authenticated;
grant execute on function public._ecbp_leadership_preparation() to authenticated;
grant execute on function public._ecbp_executive_reflection() to authenticated;
grant execute on function public._ecbp_priority_alignment() to authenticated;
grant execute on function public._ecbp_organizational_visibility() to authenticated;
grant execute on function public._ecbp_executive_decision_support() to authenticated;
grant execute on function public._ecbp_self_love_connection() to authenticated;
grant execute on function public._ecbp_trust_connection() to authenticated;
grant execute on function public._ecbp_dogfooding() to authenticated;
grant execute on function public._ecbp_integration_links() to authenticated;
grant execute on function public._ecbp_vision_phrases() to authenticated;
grant execute on function public._ecbp_engagement_summary(uuid) to authenticated;
grant execute on function public._ecbp_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'executive-companion-blueprint', 'Executive Companion Engine (ABOS Phase 66)',
  'Executive Companion Engine — extends Executive Insights Engine A.35 with leadership preparation, reflection, organizational visibility, and decision readiness scaffolds.',
  'authenticated', 107
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'executive-companion-blueprint' and tenant_id is null
);
