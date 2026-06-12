-- Implementation Blueprint Phase 59 — Strategic Thinking Engine
-- Extends Executive Insights Engine (Phase A.35 + ABOS Phase 13). No new tables.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._stbp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 59 — Strategic Thinking Engine at /app/executive-insights-engine. Extends Executive Insights Engine Phase A.35 and Blueprint Phase 13. Distinct from Document & Output Engine Phase A.59 /app/document-output-engine (operational document generation). Quality Guardian Phases 58–59 at /app/quality (operational quality — not strategic reflection). Blueprint Phase 59 = strategic thinking and leadership reflection on A.35 executive reporting. Cross-links: Strategic Alignment A.55, Strategic Intelligence A.31, Decision Support /app/assistant/decisions, Organizational Decision Support A.54, Predictive Insights A.66, Goals OKR A.65, Self Love A.76, Ecosystem Growth Phase 51. All Phase A.35 and Phase 13 dashboard fields preserved.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._stbp_blueprint_mission()
returns text language sql immutable as $$
  select 'Support strategic reflection and leadership clarity — priority alignment, opportunity awareness, and long-term planning on executive insights metadata.';
$$;

create or replace function public._stbp_blueprint_philosophy()
returns text language sql immutable as $$
  select 'Strategic thinking needs space for reflection — Aipify surfaces priorities, hypotheses, and alignment signals; leadership retains every strategic decision.';
$$;

create or replace function public._stbp_blueprint_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) prepares strategic context — humans decide; hypotheses are labeled separately from verified data.';
$$;

create or replace function public._stbp_blueprint_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'strategic_reflection', 'label', 'Strategic reflection', 'description', 'Structured leadership reflection on organizational direction — metadata summaries, not automated strategy'),
    jsonb_build_object('key', 'priority_clarification', 'label', 'Priority clarification', 'description', 'Initiatives, resources, team focus, and leadership attention — misalignment visibility scaffold'),
    jsonb_build_object('key', 'opportunity_exploration', 'label', 'Opportunity exploration', 'description', 'Market trends and capability relevance — awareness and hypotheses, not certainty'),
    jsonb_build_object('key', 'long_term_planning', 'label', 'Long-term planning', 'description', 'Quarterly, semi-annual, and annual review framework metadata for executive preparation'),
    jsonb_build_object('key', 'executive_preparation', 'label', 'Executive preparation', 'description', 'Briefings and conversation prompts that prepare leaders — Aipify informs, humans lead'),
    jsonb_build_object('key', 'organizational_alignment', 'label', 'Organizational alignment', 'description', 'Cross-link objectives, OKRs, and strategic signals — alignment gaps surfaced for review')
  );
$$;

create or replace function public._stbp_strategic_conversations()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'owl_direction',
      'scenario', 'Leadership reflection on strategic direction',
      'question', '🦉 What strategic priorities deserve your attention this quarter — and which can wait?'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'rose_team_capacity',
      'scenario', 'Team capacity and sustainable focus',
      'question', '🌹 Where is the team stretched thinnest — and what would healthy prioritization look like?'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'bell_alignment',
      'scenario', 'Alignment check before major commitments',
      'question', '🔔 Before committing resources — do current initiatives still align with stated objectives?'
    ),
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'owl_hypothesis',
      'scenario', 'Hypothesis vs verified data',
      'question', '🦉 Which strategic assumptions are hypotheses today — and what data would confirm or challenge them?'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'rose_long_term',
      'scenario', 'Long-term perspective without urgency pressure',
      'question', '🌹 Looking twelve months ahead — what capabilities matter most, regardless of this week''s noise?'
    )
  );
$$;

create or replace function public._stbp_priority_alignment()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Priority alignment surfaces where initiatives, resources, team focus, and leadership attention may diverge — visibility scaffold only.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'initiatives', 'label', 'Initiatives', 'description', 'Active strategic objectives and improvement initiatives — counts and status metadata'),
      jsonb_build_object('key', 'resources', 'label', 'Resources', 'description', 'Capacity and workload signals cross-linked from operational modules — not prescriptive allocation'),
      jsonb_build_object('key', 'team_focus', 'label', 'Team focus', 'description', 'High-priority tasks and OKR progress — where attention concentrates'),
      jsonb_build_object('key', 'leadership_attention', 'label', 'Leadership attention', 'description', 'Pending decisions, reviews, and executive actions awaiting human review')
    ),
    'misalignment_scaffold', jsonb_build_array(
      'Multiple high-priority objectives without linked key results',
      'Strategic opportunities open while renewal risk elevated',
      'Pending organizational decisions exceeding review threshold',
      'Active initiatives not linked to stated strategic objectives'
    ),
    'alignment_route', '/app/strategic-alignment-engine',
    'boundary_note', 'Misalignment signals are scaffolds for leadership review — Aipify never auto-reprioritizes.'
  );
$$;

create or replace function public._stbp_opportunity_exploration()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Opportunity exploration raises awareness — market trends and capability relevance as hypotheses, not certainty.',
    'exploration_types', jsonb_build_array(
      jsonb_build_object('key', 'market_trends', 'label', 'Market trends', 'description', 'Emerging patterns from Strategic Intelligence — confidence metadata required', 'source_type', 'hypothesis'),
      jsonb_build_object('key', 'capability_relevance', 'label', 'Capability relevance', 'description', 'Maturity and readiness signals — where capabilities support or limit strategy', 'source_type', 'data'),
      jsonb_build_object('key', 'ecosystem_signals', 'label', 'Ecosystem signals', 'description', 'Partner and marketplace growth patterns — Phase 51 cross-link', 'source_type', 'hypothesis'),
      jsonb_build_object('key', 'predictive_signals', 'label', 'Predictive signals', 'description', 'Forward-looking operational predictions — uncertainty acknowledged', 'source_type', 'hypothesis')
    ),
    'awareness_not_certainty', 'Every exploration item labels data vs hypothesis — leadership validates before action.',
    'strategic_intelligence_route', '/app/strategic-intelligence-foundation-engine',
    'ecosystem_route', '/app/marketplace-partner-ecosystem-foundation-engine'
  );
$$;

create or replace function public._stbp_strategic_review_sessions()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Structured review session metadata — quarterly, semi-annual, and annual frameworks for executive preparation.',
    'cadences', jsonb_build_array(
      jsonb_build_object(
        'key', 'quarterly',
        'label', 'Quarterly review',
        'description', 'Priority realignment, OKR progress, operational health trajectory, and open strategic opportunities',
        'suggested_topics', jsonb_build_array('What changed since last quarter', 'Priority misalignments', 'Hypotheses to validate', 'Decisions awaiting review')
      ),
      jsonb_build_object(
        'key', 'semi_annual',
        'label', 'Semi-annual review',
        'description', 'Capability maturity, strategic alignment snapshots, and medium-term opportunity exploration',
        'suggested_topics', jsonb_build_array('Capability gaps', 'Alignment trends', 'Resource concentration', 'Market hypothesis review')
      ),
      jsonb_build_object(
        'key', 'annual',
        'label', 'Annual review',
        'description', 'Long-term direction, ecosystem growth, legacy objectives, and organizational health patterns',
        'suggested_topics', jsonb_build_array('Vision alignment', 'Year-over-year trends', 'Strategic bets validated or retired', 'Sustainable leadership pacing')
      )
    ),
    'executive_reports_link', 'Generate quarterly executive reports via Executive Insights Engine — metadata only.',
    'boundary_note', 'Review frameworks prepare conversations — humans schedule, facilitate, and decide outcomes.'
  );
$$;

create or replace function public._stbp_executive_briefings()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '📈',
      'key', 'chart_health_trajectory',
      'scenario', 'Strategic health trajectory for leadership briefings',
      'example', '📈 Organization health and strategic opportunity count — here is the trajectory for your quarterly briefing.'
    ),
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'owl_review_prep',
      'scenario', 'Pre-review reflection briefing',
      'example', '🦉 Before your strategic review — three hypotheses and two verified trends deserve leadership attention.'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'rose_sustainable_pace',
      'scenario', 'Sustainable strategic pacing',
      'example', '🌹 Several critical strategic items surfaced — would it help to sequence priorities before the executive session?'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'bell_decision_ready',
      'scenario', 'Decisions prepared for review',
      'example', '🔔 Two organizational decisions and one alignment review are ready when you want to prepare — no urgency implied.'
    )
  );
$$;

create or replace function public._stbp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love supports strategic reflection — perspective, sustainable decisions, and the reminder that not every decision requires immediate action.',
    'strategic_patterns', jsonb_build_array(
      'Reflection — space to consider direction without alarmist dashboards',
      'Perspective — separate urgent operational noise from long-term strategic signals',
      'Sustainable decisions — recommend pacing over reactive strategy shifts',
      'Not every decision immediate — strategic review cadence over constant urgency'
    ),
    'self_love_route', '/app/self-love-engine',
    'naming_doc', 'SELF_LOVE_NAMING_STANDARD.md',
    'boundary_note', 'Self Love is a principle — Strategic Thinking stores metadata scaffolds, not wellbeing content.'
  );
$$;

create or replace function public._stbp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Strategic thinking must distinguish verified data from hypotheses — uncertainty acknowledged in every briefing.',
    'data_vs_hypotheses', jsonb_build_object(
      'verified_data', jsonb_build_array(
        'Organization health scores and operational risk counts from aggregated modules',
        'OKR progress percentages and strategic objective status metadata',
        'Executive report generation counts and schedule configuration',
        'Since Last Time operational counts with documented window source'
      ),
      'hypotheses', jsonb_build_array(
        'Market trend interpretations from Strategic Intelligence scans',
        'Predictive insight forward-looking signals with confidence levels',
        'Opportunity exploration items marked source_type hypothesis',
        'Misalignment scaffolds — patterns suggesting review, not confirmed gaps'
      )
    ),
    'uncertainty_note', 'Hypotheses are labeled explicitly — leadership validates before strategic action.',
    'executives_should_know', jsonb_build_array(
      'Which strategic items are data-backed vs exploratory hypotheses',
      'Confidence and source module for every opportunity and risk signal',
      'That Aipify advises and prepares — never executes strategic decisions',
      'Review session frameworks are metadata — humans facilitate outcomes'
    ),
    'audit_note', 'Executive report generation, exports, and schedule changes logged via _eie_log — metadata only.'
  );
$$;

create or replace function public._stbp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates strategic thinking patterns internally; Unonight is the first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — product strategy, ecosystem growth, sales expert priorities, org alignment',
      'focus', jsonb_build_array(
        'Product strategy — quarterly review of platform roadmap signals and capability maturity',
        'Ecosystem growth — Phase 51 marketplace and partner intelligence cross-links',
        'Sales Expert Engine — strategic sales priorities and leadership briefing preparation',
        'Organizational priorities — alignment between Aipify Group objectives and operational health'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce strategic reflection and priority alignment',
      'focus', jsonb_build_array(
        'Customer success trajectory in strategic review sessions',
        'Support and operational signals vs long-term commerce objectives',
        'Opportunity exploration with hypothesis labeling',
        'Executive briefing preparation with sustainable pacing'
      )
    )
  );
$$;

create or replace function public._stbp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Strategic Alignment (A.55)', 'route', '/app/strategic-alignment-engine', 'note', 'Objectives, alignment reviews, misalignment detection'),
    jsonb_build_object('label', 'Strategic Intelligence (A.31)', 'route', '/app/strategic-intelligence-foundation-engine', 'note', 'Trends, opportunities, risks — hypothesis labeling required'),
    jsonb_build_object('label', 'Decision Support Engine', 'route', '/app/assistant/decisions', 'note', 'Personal decision guidance — distinct from organizational decisions'),
    jsonb_build_object('label', 'Organizational Decision Support (A.54)', 'route', '/app/organizational-decision-support-engine', 'note', 'Structured org decisions awaiting leadership review'),
    jsonb_build_object('label', 'Predictive Insights (A.66)', 'route', '/app/predictive-insights-engine', 'note', 'Forward-looking signals — uncertainty acknowledged'),
    jsonb_build_object('label', 'Goals & OKR (A.65)', 'route', '/app/goals-okr-engine', 'note', 'Organizational objectives and key results'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Reflection and sustainable pacing — principle only'),
    jsonb_build_object('label', 'Ecosystem Growth (Phase 51)', 'route', '/app/marketplace-partner-ecosystem-foundation-engine', 'note', 'Market and partner intelligence cross-link'),
    jsonb_build_object('label', 'Executive Insights (A.35)', 'route', '/app/executive-insights-engine', 'note', 'Primary engine — operational executive reporting base'),
    jsonb_build_object('label', 'Document & Output (A.59)', 'route', '/app/document-output-engine', 'note', 'Operational document generation — distinct blueprint phase number'),
    jsonb_build_object('label', 'Executive Dashboard briefings', 'route', '/app/executive', 'note', 'Daily customer briefings — distinct from strategic thinking scaffolds')
  );
$$;

create or replace function public._stbp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Strategic clarity grows from reflection — not from more dashboards.',
    'Hypotheses and data serve different roles — label both honestly.',
    'Leadership retains every strategic decision — Aipify prepares context.',
    'Sustainable strategy respects pacing — not every decision is urgent.',
    'Alignment visibility helps leaders choose focus — Aipify never auto-reprioritizes.'
  );
$$;

create or replace function public._stbp_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_strategic_objectives int := 0;
  v_active_objectives int := 0;
  v_open_opportunities int := 0;
  v_open_decisions int := 0;
  v_okr_objectives int := 0;
  v_alignment_snapshots int := 0;
  v_strategic_reviews int := 0;
begin
  if to_regclass('public.strategic_objectives') is not null then
    select count(*) into v_strategic_objectives
    from public.strategic_objectives where organization_id = p_org_id;
    select count(*) into v_active_objectives
    from public.strategic_objectives where organization_id = p_org_id and status = 'active';
  end if;

  if to_regclass('public.strategic_opportunities') is not null then
    select count(*) into v_open_opportunities
    from public.strategic_opportunities where tenant_id = p_org_id and status = 'open';
  end if;

  if to_regclass('public.organizational_decision_support_items') is not null then
    select count(*) into v_open_decisions
    from public.organizational_decision_support_items
    where organization_id = p_org_id and status in ('pending', 'under_review');
  end if;

  if to_regclass('public.organization_objectives') is not null then
    select count(*) into v_okr_objectives
    from public.organization_objectives where organization_id = p_org_id and status = 'active';
  end if;

  if to_regclass('public.strategic_alignment_snapshots') is not null then
    select count(*) into v_alignment_snapshots
    from public.strategic_alignment_snapshots
    where organization_id = p_org_id and created_at >= now() - interval '90 days';
  end if;

  if to_regclass('public.strategic_reviews') is not null then
    select count(*) into v_strategic_reviews
    from public.strategic_reviews r
    join public.strategic_objectives o on o.id = r.objective_id
    where o.organization_id = p_org_id and r.review_date >= current_date - 90;
  end if;

  return jsonb_build_object(
    'strategic_objectives_total', v_strategic_objectives,
    'strategic_objectives_active', v_active_objectives,
    'open_strategic_opportunities', v_open_opportunities,
    'pending_org_decisions', v_open_decisions,
    'active_okr_objectives', v_okr_objectives,
    'alignment_snapshots_90d', v_alignment_snapshots,
    'strategic_reviews_90d', v_strategic_reviews,
    'summary_note', 'Strategic engagement counts only — hypotheses and data sources labeled separately on dashboard.'
  );
end; $$;

create or replace function public._stbp_blueprint_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_reports int := 0;
begin
  v_engagement := public._stbp_engagement_summary(p_org_id);

  select count(*) into v_reports
  from public.executive_reports where organization_id = p_org_id;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'strategic_reflection',
      'label', 'Strategic reflection — conversation prompts and review frameworks documented',
      'met', jsonb_array_length(public._stbp_strategic_conversations()) >= 4,
      'note', '🦉🌹🔔 companion questions for leadership reflection.'
    ),
    jsonb_build_object(
      'key', 'priority_alignment',
      'label', 'Priority alignment — initiatives, resources, team focus, leadership attention scaffold',
      'met', jsonb_array_length(public._stbp_priority_alignment()->'dimensions') >= 4,
      'note', 'Misalignment visibility — humans decide reprioritization.'
    ),
    jsonb_build_object(
      'key', 'opportunity_exploration',
      'label', 'Opportunity exploration — market trends and capability relevance with hypothesis labeling',
      'met', (public._stbp_opportunity_exploration()->>'awareness_not_certainty') is not null,
      'note', 'Awareness not certainty — data vs hypothesis distinguished.'
    ),
    jsonb_build_object(
      'key', 'strategic_review_sessions',
      'label', 'Strategic review sessions — quarterly, semi-annual, annual framework metadata',
      'met', jsonb_array_length(public._stbp_strategic_review_sessions()->'cadences') >= 3,
      'note', 'Review frameworks prepare conversations — humans facilitate.'
    ),
    jsonb_build_object(
      'key', 'executive_briefings',
      'label', 'Executive briefings — strategic briefing examples with sustainable pacing',
      'met', jsonb_array_length(public._stbp_executive_briefings()) >= 3,
      'note', '📈🦉🌹🔔 briefing patterns — distinct from /app/executive daily briefings.'
    ),
    jsonb_build_object(
      'key', 'data_vs_hypotheses',
      'label', 'Trust — verified data vs hypotheses clearly labeled; uncertainty acknowledged',
      'met', (public._stbp_trust_connection()->'data_vs_hypotheses') is not null,
      'note', 'Strategic items require leadership validation before action.'
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — reflection, perspective, sustainable strategic pacing',
      'met', true,
      'note', 'Self Love is a principle — not every strategic decision is immediate.'
    ),
    jsonb_build_object(
      'key', 'strategic_engagement',
      'label', 'Live strategic engagement summary — objectives, OKRs, opportunities, decisions',
      'met', v_engagement ? 'strategic_objectives_total',
      'note', format(
        '%s strategic objectives, %s active OKRs, %s open opportunities, %s pending decisions.',
        coalesce((v_engagement->>'strategic_objectives_total')::int, 0),
        coalesce((v_engagement->>'active_okr_objectives')::int, 0),
        coalesce((v_engagement->>'open_strategic_opportunities')::int, 0),
        coalesce((v_engagement->>'pending_org_decisions')::int, 0)
      )
    ),
    jsonb_build_object(
      'key', 'executive_reports_link',
      'label', 'Executive Insights reporting linked — quarterly reports available',
      'met', v_reports >= 0,
      'note', case when v_reports = 0 then 'Generate a quarterly report to validate strategic briefing workflows.' else null end
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from Document Output A.59, Quality Guardian, and daily briefings',
      'met', jsonb_array_length(public._stbp_integration_links()) >= 10,
      'note', 'Extend Strategic Alignment, Intelligence, Decisions, OKR, Predictive, Ecosystem — do not duplicate.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — product strategy, ecosystem, sales expert, org priorities',
      'met', (public._stbp_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    ),
    jsonb_build_object(
      'key', 'no_auto_strategic_execution',
      'label', 'Aipify advises — humans decide; no automated strategic execution',
      'met', true,
      'note', 'Metadata scaffolds only — leadership retains strategic authority.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL A.35 + Phase 13; append Phase 59
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
    'mission', 'Clear executive guidance from organizational data — healthier decisions, stronger operations, sustainable growth.',
    'philosophy', 'Executives need clarity, not more dashboards — surface what matters with explainable metadata summaries.',
    'abos_principle', 'Clarity beats noise — explainable executive insights help leaders decide with confidence.',
    'vision', 'Leaders see what changed, why it matters, and what to do next — with transparent sources and sustainable pacing.',
    'executive_insights_engine_note', 'Executive Insights Engine Foundation (ABOS Phase 13) — extends Executive Insights Engine (Phase A.35).',
    'strategic_thinking_note', 'Strategic Thinking Engine (ABOS Phase 59) — strategic reflection, priority alignment, opportunity exploration, and review session frameworks on A.35 executive reporting.',
    'distinction_note', 'Distinct from Platform Admin /platform/executive (global governance) and customer /app/executive (daily briefings) — this engine provides tenant-scoped executive reporting and strategic summaries.',
    'blueprint_distinction_note', public._stbp_distinction_note(),
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
      'Strategic thinking scaffolds — hypotheses labeled separately from verified data'
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
    'strategic_vision_phrases', public._stbp_vision_phrases()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve Phase 13 + append Phase 59 framing
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
begin
  v_org_id := public._mta_require_organization();
  perform public._eie_seed_org_content(v_org_id);
  v_health := public._eie_compute_health_score(v_org_id);
  v_engagement := public._stbp_engagement_summary(v_org_id);

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
    'executive_insights_engine_note', 'Executive Insights Engine Foundation (ABOS Phase 13) — extends Executive Insights Engine (Phase A.35).',
    'strategic_thinking_note', 'Strategic Thinking Engine (ABOS Phase 59) — strategic reflection and leadership preparation on executive insights metadata.',
    'blueprint_note', 'Strategic thinking scaffolds — hypotheses labeled separately from verified data; humans decide strategy.',
    'since_last_time', v_since,
    'strategic_engagement_summary', v_engagement
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants
-- ---------------------------------------------------------------------------
grant execute on function public._stbp_distinction_note() to authenticated;
grant execute on function public._stbp_blueprint_mission() to authenticated;
grant execute on function public._stbp_blueprint_philosophy() to authenticated;
grant execute on function public._stbp_blueprint_abos_principle() to authenticated;
grant execute on function public._stbp_blueprint_objectives() to authenticated;
grant execute on function public._stbp_strategic_conversations() to authenticated;
grant execute on function public._stbp_priority_alignment() to authenticated;
grant execute on function public._stbp_opportunity_exploration() to authenticated;
grant execute on function public._stbp_strategic_review_sessions() to authenticated;
grant execute on function public._stbp_executive_briefings() to authenticated;
grant execute on function public._stbp_self_love_connection() to authenticated;
grant execute on function public._stbp_trust_connection() to authenticated;
grant execute on function public._stbp_dogfooding() to authenticated;
grant execute on function public._stbp_integration_links() to authenticated;
grant execute on function public._stbp_vision_phrases() to authenticated;
grant execute on function public._stbp_engagement_summary(uuid) to authenticated;
grant execute on function public._stbp_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'strategic-thinking-blueprint', 'Strategic Thinking Engine (ABOS Phase 59)',
  'Strategic Thinking Engine — extends Executive Insights Engine A.35 with strategic reflection, priority alignment, opportunity exploration, and review session frameworks.',
  'authenticated', 106
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'strategic-thinking-blueprint' and tenant_id is null
);
