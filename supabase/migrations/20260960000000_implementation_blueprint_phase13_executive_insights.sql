-- Implementation Blueprint Phase 13 — Executive Insights Engine Foundation
-- Spec alignment extending Executive Insights Engine (Phase A.35). No new tables.

create or replace function public._eie_since_last_time_summary(p_organization_id uuid, p_user_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_since timestamptz;
  v_auth_user_id uuid;
  v_support_resolved int := 0;
  v_kc_updated int := 0;
  v_tasks_completed int := 0;
  v_bottlenecks int := 0;
  v_bell_moments int := 0;
  v_source text := 'seven_day_fallback';
begin
  select previous_login_at into v_since
  from public.admin_assistant_sessions
  where organization_id = p_organization_id and user_id = p_user_id;

  if v_since is not null then
    v_source := 'admin_assistant_sessions.previous_login_at';
  else
    select u.auth_user_id into v_auth_user_id
    from public.users u where u.id = p_user_id;

    if v_auth_user_id is not null then
      select au.last_sign_in_at into v_since
      from auth.users au where au.id = v_auth_user_id;
      if v_since is not null then
        v_source := 'auth.users.last_sign_in_at';
      end if;
    end if;
  end if;

  if v_since is null and to_regclass('public.presence_engagement_events') is not null then
    select max(e.created_at) into v_since
    from public.presence_engagement_events e
    where e.tenant_id = p_organization_id;
    if v_since is not null then
      v_source := 'presence_engagement_events.last_activity';
    end if;
  end if;

  v_since := coalesce(v_since, now() - interval '7 days');
  if v_source = 'seven_day_fallback' and v_since = now() - interval '7 days' then
    v_source := 'seven_day_fallback';
  end if;

  if to_regclass('public.organization_support_cases') is not null then
    select count(*) into v_support_resolved
    from public.organization_support_cases c
    where c.organization_id = p_organization_id
      and c.status in ('resolved', 'closed')
      and coalesce(c.resolved_at, c.updated_at) > v_since;
  end if;

  if to_regclass('public.knowledge_articles') is not null then
    select count(*) into v_kc_updated
    from public.knowledge_articles a
    where a.organization_id = p_organization_id
      and (a.updated_at > v_since or coalesce(a.published_at, a.created_at) > v_since);
  end if;

  if to_regclass('public.organization_tasks') is not null then
    select count(*) into v_tasks_completed
    from public.organization_tasks t
    where t.organization_id = p_organization_id
      and t.status = 'completed'
      and t.priority in ('critical', 'high')
      and t.updated_at > v_since;
  end if;

  if to_regclass('public.organization_quality_checks') is not null then
    select count(*) into v_bottlenecks
    from public.organization_quality_checks q
    where q.organization_id = p_organization_id
      and q.status in ('open', 'investigating');
  end if;

  if to_regclass('public.organization_tasks') is not null then
    v_bottlenecks := v_bottlenecks + coalesce((
      select count(*)::int from public.organization_tasks t
      where t.organization_id = p_organization_id and t.status = 'overdue'
    ), 0);
  end if;

  if to_regclass('public.organization_support_cases') is not null then
    v_bottlenecks := v_bottlenecks + coalesce((
      select count(*)::int from public.organization_support_cases c
      where c.organization_id = p_organization_id
        and c.escalated_at is not null
        and c.status not in ('resolved', 'closed')
    ), 0);
  end if;

  if to_regclass('public.presence_engagement_events') is not null then
    select count(*) into v_bell_moments
    from public.presence_engagement_events e
    where e.tenant_id = p_organization_id
      and e.created_at > v_since
      and (
        e.event_type in ('celebration', 'milestone', 'bell_moment', 'engagement')
        or e.metadata ? 'bell_moment'
        or e.action_type in ('celebrate', 'milestone_acknowledged')
      );
  end if;

  return jsonb_build_object(
    'since', v_since,
    'since_source', v_source,
    'assumption_note', 'Window starts at previous login (admin_assistant_sessions), auth.users.last_sign_in_at, last presence engagement, or 7-day fallback — counts and trends only, no PII.',
    'support_cases_resolved', v_support_resolved,
    'kc_articles_updated', v_kc_updated,
    'high_priority_tasks_completed', v_tasks_completed,
    'bottlenecks_open', v_bottlenecks,
    'bell_moments', v_bell_moments,
    'trend_summary', format(
      'Since %s: %s support cases resolved, %s KC articles updated, %s high-priority tasks completed, %s open bottlenecks, %s bell moments.',
      to_char(v_since, 'YYYY-MM-DD'),
      v_support_resolved, v_kc_updated, v_tasks_completed, v_bottlenecks, v_bell_moments
    )
  );
end; $$;

create or replace function public._eie_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_reports int := 0;
  v_health int;
  v_risks int := 0;
  v_opps int := 0;
  v_since jsonb;
  v_schedules_enabled int := 0;
  v_user_id uuid;
begin
  perform public._eie_seed_org_content(p_organization_id);
  v_health := public._eie_compute_health_score(p_organization_id);
  v_risks := jsonb_array_length(public._eie_aggregate_risks(p_organization_id));
  v_opps := jsonb_array_length(public._eie_aggregate_opportunities(p_organization_id));

  select count(*) into v_reports
  from public.executive_reports where organization_id = p_organization_id;

  select count(*) into v_schedules_enabled
  from public.executive_report_schedules
  where organization_id = p_organization_id and enabled = true;

  begin
    v_user_id := public._mta_app_user_id();
  exception when others then
    v_user_id := null;
  end;

  if v_user_id is not null then
    v_since := public._eie_since_last_time_summary(p_organization_id, v_user_id);
  else
    v_since := jsonb_build_object('since', now() - interval '7 days', 'since_source', 'seven_day_fallback');
  end if;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'reports_generated',
      'label', 'Executive reports generated with explainable summaries',
      'met', v_reports > 0,
      'note', case when v_reports = 0 then 'Generate a weekly or monthly report to validate reporting workflows.' else null end
    ),
    jsonb_build_object(
      'key', 'health_score_computed',
      'label', 'Organization health score computed from operational metadata',
      'met', v_health > 0,
      'note', null
    ),
    jsonb_build_object(
      'key', 'risks_surfaced',
      'label', 'Operational risks surfaced with severity and source modules',
      'met', v_risks >= 0,
      'note', case when v_risks = 0 then 'No active risks — healthy baseline or seed operational signals to validate risk aggregation.' else null end
    ),
    jsonb_build_object(
      'key', 'opportunities_surfaced',
      'label', 'Growth opportunities and strategic signals surfaced for leadership',
      'met', v_opps >= 0,
      'note', case when v_opps = 0 then 'No open opportunities — routine review still recommended.' else null end
    ),
    jsonb_build_object(
      'key', 'since_last_time_populated',
      'label', 'Since Last Time block populated with metadata counts',
      'met', v_since ? 'since' and (
        coalesce((v_since->>'support_cases_resolved')::int, 0) >= 0
        or coalesce((v_since->>'kc_articles_updated')::int, 0) >= 0
      ),
      'note', case
        when v_since is null then 'Since Last Time requires an authenticated user session.'
        else 'Counts only — support resolutions, KC updates, tasks, bottlenecks, bell moments.'
      end
    ),
    jsonb_build_object(
      'key', 'schedules_available',
      'label', 'Report schedules configured for daily, weekly, or monthly delivery',
      'met', v_schedules_enabled > 0 or exists (
        select 1 from public.executive_report_schedules where organization_id = p_organization_id
      ),
      'note', case
        when v_schedules_enabled = 0 then 'Enable weekly or monthly schedules to validate delivery scaffolding.'
        else null
      end
    ),
    jsonb_build_object(
      'key', 'action_recommendations',
      'label', 'Action-oriented recommendations with rationale and urgency',
      'met', jsonb_array_length(public._eie_build_recommended_actions(p_organization_id)) > 0,
      'note', null
    ),
    jsonb_build_object(
      'key', 'metadata_only_privacy',
      'label', 'Summaries use metadata only — no email, chat, orders, or PII',
      'met', true,
      'note', 'Trust boundary enforced by RPC aggregation — panels are thin clients.'
    )
  );
end; $$;

create or replace function public._eie_executive_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'what', 'label', 'What changed', 'description', 'Surface operational, support, and strategic shifts since the last executive review'),
    jsonb_build_object('key', 'why', 'label', 'Why it matters', 'description', 'Explainable rationale connecting signals to business impact — humans decide'),
    jsonb_build_object('key', 'attention', 'label', 'What needs attention', 'description', 'Risks, bottlenecks, and high-urgency actions requiring leadership awareness'),
    jsonb_build_object('key', 'improving', 'label', 'What is improving', 'description', 'Health trajectories, resolved cases, completed priorities, and positive trends'),
    jsonb_build_object('key', 'actions', 'label', 'Recommended actions', 'description', 'Action-oriented summaries with urgency, expected outcome, and estimated effort')
  );
$$;

create or replace function public._eie_overview_capabilities()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'daily_summary', 'label', 'Daily summary', 'description', 'Short operational pulse for leadership — metadata counts and priority shifts'),
    jsonb_build_object('key', 'weekly_summary', 'label', 'Weekly summary', 'description', 'Organization health, risks, opportunities, and recommended actions'),
    jsonb_build_object('key', 'monthly_summary', 'label', 'Monthly summary', 'description', 'Strategic trends, customer success trajectory, and executive action register'),
    jsonb_build_object('key', 'risk_notifications', 'label', 'Risk notifications', 'description', 'Quality, security, support escalation, and renewal risk signals — severity metadata only'),
    jsonb_build_object('key', 'growth_opportunities', 'label', 'Growth opportunities', 'description', 'Strategic opportunities, customer success playbooks, and operations center recommendations'),
    jsonb_build_object('key', 'priority_recommendations', 'label', 'Priority recommendations', 'description', 'Explainable leadership actions with rationale — approval required for execution')
  );
$$;

create or replace function public._eie_insight_categories()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'operational',
      'label', 'Operational',
      'description', 'Health scores, quality findings, operations alerts, and workflow bottlenecks',
      'examples', jsonb_build_array(
        'Organization health score at 82 — healthy with two quality findings open',
        'Operations Center recommends reviewing pending AI action approvals',
        'Three overdue organizational tasks flagged for executive attention'
      ),
      'source_modules', jsonb_build_array('analytics_insights_engine', 'operations_dashboard_engine', 'quality_guardian_engine', 'operations_center')
    ),
    jsonb_build_object(
      'key', 'support',
      'label', 'Support',
      'description', 'Case resolution trends, escalation patterns, and support AI metrics',
      'examples', jsonb_build_array(
        '12 support cases resolved since last login — steady resolution velocity',
        'Two escalated cases awaiting leadership review',
        'Support AI draft queue within normal thresholds'
      ),
      'source_modules', jsonb_build_array('support_ai_engine', 'customer_success_engine')
    ),
    jsonb_build_object(
      'key', 'knowledge',
      'label', 'Knowledge',
      'description', 'KC article updates, knowledge gaps, and procedure coverage signals',
      'examples', jsonb_build_array(
        'Four Knowledge Center articles updated this week',
        'Support knowledge gap detected for recurring billing FAQ',
        'Procedure coverage improved after onboarding playbook publish'
      ),
      'source_modules', jsonb_build_array('knowledge_center_engine', 'support_ai_engine')
    ),
    jsonb_build_object(
      'key', 'companion',
      'label', 'Companion',
      'description', 'Proactive guidance, bell moments, gratitude, and sustainable pacing',
      'examples', jsonb_build_array(
        '🔔 Team completed weekly priorities — steady progress worth noting',
        '🌹 Three teammates finished high-priority tasks — recognition opportunity',
        '🦉 Before the quarterly review — here is what changed in operations health'
      ),
      'source_modules', jsonb_build_array('proactive_companion_engine', 'gratitude_recognition_engine', 'self_love_engine', 'companion_identity_engine')
    ),
    jsonb_build_object(
      'key', 'strategic',
      'label', 'Strategic',
      'description', 'Strategic opportunities, alignment signals, and predictive insights',
      'examples', jsonb_build_array(
        'Two strategic opportunities open for leadership review',
        'Renewal risk elevated — customer success intervention recommended',
        'Predictive insight suggests capacity planning review next month'
      ),
      'source_modules', jsonb_build_array('strategic_intelligence', 'strategic_alignment_engine', 'predictive_insights_engine', 'customer_success_engine')
    )
  );
$$;

create or replace function public._eie_companion_communication_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'bell_progress',
      'scenario', 'Positive operational progress since last visit',
      'example', '🔔 Your team resolved 12 support cases since your last visit — steady progress worth celebrating.'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'rose_recognition',
      'scenario', 'High-priority completions deserve team recognition',
      'example', '🌹 Three teammates completed high-priority tasks this week — would you like to send recognition?'
    ),
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'owl_reflection',
      'scenario', 'Executive review or quarterly planning moment',
      'example', '🦉 Before the quarterly review, here is what changed in operations health — take a moment to reflect.'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'bell_health',
      'scenario', 'Organization health improved',
      'example', '🔔 Organization health moved to healthy this week — risks down and opportunities up.'
    ),
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'owl_sustainable',
      'scenario', 'Sustainable pacing reminder for leadership',
      'example', '🦉 Several critical items surfaced — would it help to review priorities together before committing?'
    )
  );
$$;

create or replace function public._eie_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love helps executives maintain perspective, make sustainable decisions, recognize team effort, and prioritize healthily.',
    'executive_patterns', jsonb_build_array(
      'Perspective — surface what matters without alarmist dashboards',
      'Sustainable decisions — flag when critical items pile up before burnout patterns emerge',
      'Team recognition — connect completions and resolutions to gratitude moments',
      'Healthy prioritization — recommend routine review over constant urgency'
    ),
    'self_love_route', '/app/self-love-engine',
    'naming_doc', 'SELF_LOVE_NAMING_STANDARD.md',
    'boundary_note', 'Self Love is a principle — not a feature toggle. No ™ in product copy.'
  );
$$;

create or replace function public._eie_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive insights must explain data sources, assumptions, and contributing systems — metadata only.',
    'executives_should_know', jsonb_build_array(
      'Which modules contributed each risk, opportunity, and recommendation',
      'Health score factors and confidence metadata — not raw customer records',
      'Since Last Time window source (login, presence, or 7-day fallback)',
      'That reports, exports, and schedules are fully audited'
    ),
    'organizations_should_understand', jsonb_build_array(
      'Aggregates metadata from Analytics, Operations, Support, KC, Tasks, and Strategic modules',
      'Action recommendations require human leadership approval — Aipify informs and prepares',
      'Distinct from Platform Admin /platform/executive and customer /app/executive briefings',
      'No customer email, chat, order content, or PII in executive summaries'
    ),
    'audit_note', 'Report generation, exports, and schedule changes logged via _eie_log — metadata only.'
  );
$$;

create or replace function public._eie_data_sources()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Metadata aggregation across operational modules — counts, scores, and trends only.',
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'analytics_insights_engine', 'label', 'Analytics & Insights (A.16)', 'route', '/app/analytics-insights-engine'),
      jsonb_build_object('key', 'operations_dashboard_engine', 'label', 'Operations Dashboard (A.9)', 'route', '/app/operations-dashboard-engine'),
      jsonb_build_object('key', 'operations_center', 'label', 'Operations Center (A.32)', 'route', '/app/operations'),
      jsonb_build_object('key', 'support_ai_engine', 'label', 'Support AI (A.7)', 'route', '/app/support-ai-engine'),
      jsonb_build_object('key', 'knowledge_center_engine', 'label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine'),
      jsonb_build_object('key', 'unified_task_follow_up_engine', 'label', 'Tasks & Follow-Up (A.62)', 'route', '/app/unified-task-follow-up-engine'),
      jsonb_build_object('key', 'predictive_insights_engine', 'label', 'Predictive Insights (A.66)', 'route', '/app/predictive-insights-engine'),
      jsonb_build_object('key', 'strategic_alignment_engine', 'label', 'Strategic Alignment (A.55)', 'route', '/app/strategic-alignment-engine'),
      jsonb_build_object('key', 'customer_success_engine', 'label', 'Customer Success (A.26)', 'route', '/app/customer-success-engine'),
      jsonb_build_object('key', 'quality_guardian_engine', 'label', 'Quality Guardian (A.13)', 'route', '/app/quality-guardian-engine'),
      jsonb_build_object('key', 'self_love_engine', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine'),
      jsonb_build_object('key', 'gratitude_recognition_engine', 'label', 'Gratitude & Recognition (A.89)', 'route', '/app/gratitude-recognition-engine')
    ),
    'privacy_note', 'Metadata and summary scores only — no customer email, chat, order content, or PII.'
  );
$$;

create or replace function public._eie_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates executive insights internally; Unonight is the first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — weekly executive summaries, risk surfacing, Since Last Time blocks',
      'focus', jsonb_build_array('Platform health and operational risks', 'Support and KC trend summaries', 'Strategic opportunity review', 'Sustainable leadership pacing via Self Love cross-links')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce executive visibility',
      'focus', jsonb_build_array('Support resolution trends', 'Customer success health trajectory', 'Operational bottleneck surfacing', 'Action recommendations with human approval')
    )
  );
$$;

create or replace function public._eie_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Clarity beats more dashboards — executives need what matters, not everything at once.',
    'Explainable insights build trust — every signal shows its source and assumption.',
    'Humans decide — Aipify informs, prepares, and recommends; leadership retains strategic authority.',
    'Sustainable growth comes from healthy operations, supported teams, and transparent priorities.',
    'Since Last Time — pick up where you left off with counts and trends, not noise.'
  );
$$;

create or replace function public._eie_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Analytics & Insights (A.16)', 'route', '/app/analytics-insights-engine'),
    jsonb_build_object('label', 'Operations Dashboard (A.9)', 'route', '/app/operations-dashboard-engine'),
    jsonb_build_object('label', 'Operations Center (A.32)', 'route', '/app/operations'),
    jsonb_build_object('label', 'Support AI (A.7)', 'route', '/app/support-ai-engine'),
    jsonb_build_object('label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine'),
    jsonb_build_object('label', 'Tasks & Follow-Up (A.62)', 'route', '/app/unified-task-follow-up-engine'),
    jsonb_build_object('label', 'Predictive Insights (A.66)', 'route', '/app/predictive-insights-engine'),
    jsonb_build_object('label', 'Strategic Alignment (A.55)', 'route', '/app/strategic-alignment-engine'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine'),
    jsonb_build_object('label', 'Gratitude & Recognition (A.89)', 'route', '/app/gratitude-recognition-engine'),
    jsonb_build_object('label', 'Executive Dashboard', 'route', '/app/executive', 'note', 'Customer briefing route — distinct from this engine'),
    jsonb_build_object('label', 'Unonight Pilot', 'route', '/app/unonight-pilot-operations-engine')
  );
$$;

create or replace function public.get_executive_insights_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_health int;
  v_risks int;
  v_actions int;
  v_since jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._eie_seed_org_content(v_org_id);
  v_health := public._eie_compute_health_score(v_org_id);

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
    'executive_insights_engine_note', 'Executive Insights Engine Foundation (ABOS Phase 13) — extends Executive Insights Engine (Phase A.35).',
    'since_last_time', v_since
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

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
    'mission', 'Clear executive guidance from organizational data — healthier decisions, stronger operations, sustainable growth.',
    'philosophy', 'Executives need clarity, not more dashboards — surface what matters with explainable metadata summaries.',
    'abos_principle', 'Clarity beats noise — explainable executive insights help leaders decide with confidence.',
    'vision', 'Leaders see what changed, why it matters, and what to do next — with transparent sources and sustainable pacing.',
    'executive_insights_engine_note', 'Executive Insights Engine Foundation (ABOS Phase 13) — extends Executive Insights Engine (Phase A.35).',
    'distinction_note', 'Distinct from Platform Admin /platform/executive (global governance) and customer /app/executive (daily briefings) — this engine provides tenant-scoped executive reporting and strategic summaries.',
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
      'Since Last Time — counts and trends only, no PII'
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
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._eie_blueprint_success_criteria(uuid) to authenticated;
grant execute on function public._eie_since_last_time_summary(uuid, uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'executive-insights-engine-blueprint', 'Executive Insights Engine (ABOS Phase 13)',
  'Executive Insights Engine Foundation — extends Executive Insights Engine A.35 with Since Last Time, insight categories, and live success criteria.',
  'authenticated', 95
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'executive-insights-engine-blueprint' and tenant_id is null
);
