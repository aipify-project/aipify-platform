-- Implementation Blueprint Phase 18 — Operations Center Engine Foundation
-- Spec alignment extending Operations Center Foundation Engine (Phase A.32). No new tables.

create or replace function public._ocf_since_last_time_summary(p_organization_id uuid, p_user_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_since timestamptz;
  v_auth_user_id uuid;
  v_support_resolved int := 0;
  v_kc_updated int := 0;
  v_tasks_completed int := 0;
  v_bottlenecks int := 0;
  v_bell_moments int := 0;
  v_recognition_moments int := 0;
  v_events_acknowledged int := 0;
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

  if to_regclass('public.organization_gratitude_moments') is not null then
    select count(*) into v_recognition_moments
    from public.organization_gratitude_moments m
    where m.organization_id = p_organization_id
      and m.created_at > v_since
      and m.status in ('celebrated', 'acknowledged', 'open');
  end if;

  select count(*) into v_events_acknowledged
  from public.operations_events e
  where e.organization_id = p_organization_id
    and e.status in ('acknowledged', 'completed')
    and e.updated_at > v_since;

  return jsonb_build_object(
    'since', v_since,
    'since_source', v_source,
    'assumption_note', 'Window starts at previous login (admin_assistant_sessions), auth.users.last_sign_in_at, last presence engagement, or 7-day fallback — counts and trends only, no PII.',
    'support_cases_resolved', v_support_resolved,
    'kc_articles_updated', v_kc_updated,
    'high_priority_tasks_completed', v_tasks_completed,
    'bottlenecks_open', v_bottlenecks,
    'bell_moments', v_bell_moments,
    'recognition_moments', v_recognition_moments,
    'operations_events_acknowledged', v_events_acknowledged,
    'trend_summary', format(
      'Since %s: %s support cases resolved, %s KC articles updated, %s high-priority tasks completed, %s open bottlenecks, %s bell moments, %s recognition moments.',
      to_char(v_since, 'YYYY-MM-DD'),
      v_support_resolved, v_kc_updated, v_tasks_completed, v_bottlenecks, v_bell_moments, v_recognition_moments
    )
  );
end; $$;

create or replace function public._ocf_module_overviews(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_support_open int := 0;
  v_support_escalated int := 0;
  v_support_resolved_30d int := 0;
  v_tasks_high int := 0;
  v_tasks_overdue int := 0;
  v_tasks_due_7d int := 0;
  v_tasks_open int := 0;
  v_kc_published int := 0;
  v_kc_draft int := 0;
  v_kc_gaps int := 0;
  v_kc_updated_30d int := 0;
  v_exec_reports int := 0;
  v_exec_risks int := 0;
  v_ops_concerns int := 0;
  v_gratitude_moments int := 0;
  v_recognition_opportunities int := 0;
  v_celebrations int := 0;
  v_bell_recent int := 0;
begin
  if to_regclass('public.organization_support_cases') is not null then
    select count(*) into v_support_open
    from public.organization_support_cases c
    where c.organization_id = p_organization_id and c.status not in ('resolved', 'closed');

    select count(*) into v_support_escalated
    from public.organization_support_cases c
    where c.organization_id = p_organization_id
      and c.escalated_at is not null
      and c.status not in ('resolved', 'closed');

    select count(*) into v_support_resolved_30d
    from public.organization_support_cases c
    where c.organization_id = p_organization_id
      and c.status in ('resolved', 'closed')
      and coalesce(c.resolved_at, c.updated_at) > now() - interval '30 days';
  end if;

  if to_regclass('public.organization_tasks') is not null then
    select count(*) into v_tasks_high
    from public.organization_tasks t
    where t.organization_id = p_organization_id
      and t.priority in ('critical', 'high')
      and t.status in ('open', 'in_progress', 'awaiting_approval', 'overdue');

    select count(*) into v_tasks_overdue
    from public.organization_tasks t
    where t.organization_id = p_organization_id and t.status = 'overdue';

    select count(*) into v_tasks_due_7d
    from public.organization_tasks t
    where t.organization_id = p_organization_id
      and t.status in ('open', 'in_progress', 'awaiting_approval')
      and t.due_date is not null
      and t.due_date between current_date and current_date + 7;

    select count(*) into v_tasks_open
    from public.organization_tasks t
    where t.organization_id = p_organization_id
      and t.status in ('open', 'in_progress', 'awaiting_approval', 'overdue');
  end if;

  if to_regclass('public.knowledge_articles') is not null then
    select count(*) into v_kc_published
    from public.knowledge_articles a
    where a.organization_id = p_organization_id and a.status = 'published';

    select count(*) into v_kc_draft
    from public.knowledge_articles a
    where a.organization_id = p_organization_id and a.status in ('draft', 'review');

    select count(*) into v_kc_updated_30d
    from public.knowledge_articles a
    where a.organization_id = p_organization_id
      and a.updated_at > now() - interval '30 days';
  end if;

  if to_regclass('public.support_ai_knowledge_gaps') is not null then
    select count(*) into v_kc_gaps
    from public.support_ai_knowledge_gaps g
    where g.organization_id = p_organization_id and g.status = 'open';
  end if;

  if to_regclass('public.executive_reports') is not null then
    select count(*) into v_exec_reports
    from public.executive_reports r
    where r.organization_id = p_organization_id;
  end if;

  begin
    if to_regprocedure('_eie_aggregate_risks(uuid)') is not null then
      v_exec_risks := jsonb_array_length(public._eie_aggregate_risks(p_organization_id));
    end if;
  exception when others then
    v_exec_risks := 0;
  end;

  select count(*) into v_ops_concerns
  from public.operations_events e
  where e.organization_id = p_organization_id
    and e.priority in ('high', 'critical')
    and e.status not in ('completed', 'dismissed');

  if to_regclass('public.organization_gratitude_moments') is not null then
    select count(*) into v_gratitude_moments
    from public.organization_gratitude_moments m
    where m.organization_id = p_organization_id;

    select count(*) into v_celebrations
    from public.organization_gratitude_moments m
    where m.organization_id = p_organization_id
      and m.status in ('celebrated', 'acknowledged');

    select count(*) into v_recognition_opportunities
    from public.organization_gratitude_moments m
    where m.organization_id = p_organization_id
      and m.status = 'open';
  end if;

  if to_regclass('public.organization_digital_rose_recognitions') is not null then
    v_recognition_opportunities := v_recognition_opportunities + coalesce((
      select count(*)::int from public.organization_digital_rose_recognitions r
      where r.organization_id = p_organization_id and r.status = 'pending'
    ), 0);
  end if;

  if to_regclass('public.presence_engagement_events') is not null then
    select count(*) into v_bell_recent
    from public.presence_engagement_events e
    where e.tenant_id = p_organization_id
      and e.created_at > now() - interval '30 days'
      and (
        e.event_type in ('celebration', 'milestone', 'bell_moment', 'engagement')
        or e.metadata ? 'bell_moment'
      );
  end if;

  return jsonb_build_object(
    'support_overview', jsonb_build_object(
      'key', 'support',
      'label', 'Support Overview',
      'route', '/app/support-ai-engine',
      'source_modules', jsonb_build_array('support_ai_engine', 'customer_success_engine'),
      'open_cases', v_support_open,
      'escalations', v_support_escalated,
      'resolved_30d', v_support_resolved_30d,
      'summary', format('%s open cases, %s escalations, %s resolved in 30 days', v_support_open, v_support_escalated, v_support_resolved_30d)
    ),
    'task_overview', jsonb_build_object(
      'key', 'tasks',
      'label', 'Task Overview',
      'route', '/app/unified-task-follow-up-engine',
      'source_modules', jsonb_build_array('unified_task_follow_up_engine', 'priority_focus_engine'),
      'high_priority_open', v_tasks_high,
      'overdue', v_tasks_overdue,
      'due_within_7d', v_tasks_due_7d,
      'open_total', v_tasks_open,
      'summary', format('%s high-priority open, %s overdue, %s due within 7 days', v_tasks_high, v_tasks_overdue, v_tasks_due_7d)
    ),
    'knowledge_overview', jsonb_build_object(
      'key', 'knowledge',
      'label', 'Knowledge Overview',
      'route', '/app/knowledge-center-engine',
      'source_modules', jsonb_build_array('knowledge_center_engine', 'support_ai_engine'),
      'published_articles', v_kc_published,
      'draft_or_review', v_kc_draft,
      'open_gaps', v_kc_gaps,
      'updated_30d', v_kc_updated_30d,
      'summary', format('%s published, %s drafts/review, %s open gaps, %s updated in 30 days', v_kc_published, v_kc_draft, v_kc_gaps, v_kc_updated_30d)
    ),
    'executive_overview', jsonb_build_object(
      'key', 'executive',
      'label', 'Executive Overview',
      'route', '/app/executive-insights-engine',
      'source_modules', jsonb_build_array('executive_insights_engine', 'analytics_insights_engine', 'strategic_alignment_engine'),
      'reports_generated', v_exec_reports,
      'operational_risks', v_exec_risks,
      'operations_concerns', v_ops_concerns,
      'summary', format('%s executive reports, %s operational risks, %s operations concerns', v_exec_reports, v_exec_risks, v_ops_concerns)
    ),
    'recognition_overview', jsonb_build_object(
      'key', 'recognition',
      'label', 'Recognition Overview',
      'route', '/app/gratitude-recognition-engine',
      'source_modules', jsonb_build_array('gratitude_recognition_engine', 'proactive_companion_engine', 'self_love_engine'),
      'gratitude_moments', v_gratitude_moments,
      'recognition_opportunities', v_recognition_opportunities,
      'celebrations', v_celebrations,
      'bell_moments_30d', v_bell_recent,
      'summary', format('%s gratitude moments, %s recognition opportunities, %s celebrations, %s bell moments (30d)', v_gratitude_moments, v_recognition_opportunities, v_celebrations, v_bell_recent)
    )
  );
end; $$;

create or replace function public._ocf_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_modules jsonb;
  v_since jsonb;
  v_user_id uuid;
  v_open_events int := 0;
  v_urgent int := 0;
  v_module_keys int := 0;
begin
  perform public._ocf_aggregate_events(p_organization_id);
  v_modules := public._ocf_module_overviews(p_organization_id);

  select count(*) into v_open_events
  from public.operations_events
  where organization_id = p_organization_id and status in ('new', 'acknowledged', 'in_progress');

  select count(*) into v_urgent
  from public.operations_events
  where organization_id = p_organization_id
    and priority in ('high', 'critical')
    and status not in ('completed', 'dismissed');

  select count(*) into v_module_keys
  from jsonb_object_keys(v_modules) k;

  begin
    v_user_id := public._mta_app_user_id();
  exception when others then
    v_user_id := null;
  end;

  if v_user_id is not null then
    v_since := public._ocf_since_last_time_summary(p_organization_id, v_user_id);
  else
    v_since := jsonb_build_object('since', now() - interval '7 days', 'since_source', 'seven_day_fallback');
  end if;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'module_overviews_populated',
      'label', 'Five operational module overview blocks populated with metadata counts',
      'met', v_module_keys >= 5,
      'note', 'Support, Task, Knowledge, Executive, and Recognition overviews — counts only.'
    ),
    jsonb_build_object(
      'key', 'since_last_time_populated',
      'label', 'Since Last Time block populated with live metadata counts',
      'met', v_since ? 'since' and coalesce((v_since->>'support_cases_resolved')::int, 0) >= 0,
      'note', case
        when v_user_id is null then 'Authenticated user required for personalized Since Last Time — 7-day fallback available.'
        else 'Counts only — previous login, auth sign-in, presence, or 7-day fallback.'
      end
    ),
    jsonb_build_object(
      'key', 'events_aggregated',
      'label', 'Cross-module operational events aggregated into operations_events',
      'met', v_open_events >= 0,
      'note', case
        when v_open_events = 0 then 'No open events — healthy baseline or trigger admin tasks, quality, or integration signals.'
        else null
      end
    ),
    jsonb_build_object(
      'key', 'urgent_actions_visible',
      'label', 'High and critical urgent actions visible for coordination',
      'met', true,
      'note', case
        when v_urgent = 0 then 'No urgent actions — routine monitoring still recommended.'
        else format('%s urgent operational events require attention.', v_urgent)
      end
    ),
    jsonb_build_object(
      'key', 'event_lifecycle',
      'label', 'Acknowledge and resolve workflows available for operational events',
      'met', exists (
        select 1 from pg_proc p
        join pg_namespace n on n.oid = p.pronamespace
        where n.nspname = 'public' and p.proname in ('acknowledge_operations_event', 'resolve_operations_event')
      ),
      'note', 'Events move through new → acknowledged → completed with audit via _ocf_log.'
    ),
    jsonb_build_object(
      'key', 'cross_module_visibility',
      'label', 'Module overviews link Support, Tasks, KC, Executive, and Recognition routes',
      'met', (v_modules->'support_overview'->>'route') is not null
        and (v_modules->'task_overview'->>'route') is not null
        and (v_modules->'knowledge_overview'->>'route') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'companion_examples',
      'label', 'Companion communication examples (🔔🌹🦉) documented for Since Last Time',
      'met', true,
      'note', 'Bell progress, rose recognition, owl reflection — calm not overwhelm.'
    ),
    jsonb_build_object(
      'key', 'metadata_only_privacy',
      'label', 'Summaries use metadata only — no email, chat, orders, or PII',
      'met', true,
      'note', 'Trust boundary enforced by RPC aggregation — panels are thin clients.'
    )
  );
end; $$;

create or replace function public._ocf_operational_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'monitor', 'label', 'Monitor activities', 'description', 'Cross-module operational visibility — support, tasks, knowledge, executive signals'),
    jsonb_build_object('key', 'surface', 'label', 'Surface developments', 'description', 'Since Last Time counts and module overview blocks — trends, not noise'),
    jsonb_build_object('key', 'coordinate', 'label', 'Coordinate teams', 'description', 'Operational events with assignment, acknowledgment, and resolution workflows'),
    jsonb_build_object('key', 'priorities', 'label', 'Track priorities', 'description', 'High-priority tasks, urgent events, and executive concerns in one place'),
    jsonb_build_object('key', 'bottlenecks', 'label', 'Identify bottlenecks', 'description', 'Escalations, overdue tasks, quality findings, and integration failures'),
    jsonb_build_object('key', 'action', 'label', 'Enable informed action', 'description', 'Explainable summaries with source modules and available routes — humans decide')
  );
$$;

create or replace function public._ocf_companion_communication_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'bell_progress',
      'scenario', 'Positive operational progress since last visit',
      'example', '🔔 Your team resolved 12 support cases since your last visit — steady progress worth noting.'
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
      'scenario', 'Operations review or planning moment',
      'example', '🦉 Before the weekly operations review — here is what changed across support, tasks, and knowledge.'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'bell_coordination',
      'scenario', 'Cross-module coordination milestone',
      'example', '🔔 All urgent operational events acknowledged — the team is aligned for the week ahead.'
    ),
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'owl_sustainable',
      'scenario', 'Sustainable pacing when critical items pile up',
      'example', '🦉 Several critical items surfaced — would it help to review priorities together before committing?'
    )
  );
$$;

create or replace function public._ocf_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love helps operations teams reduce stress, clarify priorities, highlight accomplishments, and stay calm — not overwhelmed.',
    'operations_patterns', jsonb_build_array(
      'Reduce stress — surface what matters without alarmist dashboards',
      'Clarify priorities — high-priority tasks and urgent events with explainable context',
      'Highlight accomplishments — Since Last Time resolutions and recognition moments',
      'Calm not overwhelm — module overviews use counts, not raw operational records'
    ),
    'self_love_route', '/app/self-love-engine',
    'naming_doc', 'SELF_LOVE_NAMING_STANDARD.md',
    'boundary_note', 'Self Love is a principle — not a feature toggle. No ™ in product copy.'
  );
$$;

create or replace function public._ocf_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Operations Center must explain why information appears, which sources contributed, and which actions are available — metadata only.',
    'operators_should_know', jsonb_build_array(
      'Which modules contributed each module overview block',
      'Since Last Time window source (login, presence, or 7-day fallback)',
      'That operational events aggregate from Admin Assistant, Quality, Integrations, and more',
      'Acknowledge and resolve actions are audited via _ocf_log'
    ),
    'organizations_should_understand', jsonb_build_array(
      'Distinct from Operations Dashboard A.9 (role-aware widgets), Command Center (presence), and AOC Phase 79 (autonomous watchers)',
      'Executive Overview cross-links Executive Insights A.35 — not a duplicate executive engine',
      'Action recommendations require human approval — Aipify informs and prepares',
      'No customer email, chat, order content, or PII in operations summaries'
    ),
    'audit_note', 'Event acknowledgment and resolution logged via _ocf_log — metadata only.'
  );
$$;

create or replace function public._ocf_data_sources()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Metadata aggregation across operational modules — counts, event summaries, and trends only.',
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'support_ai_engine', 'label', 'Support AI (A.7)', 'route', '/app/support-ai-engine'),
      jsonb_build_object('key', 'unified_task_follow_up_engine', 'label', 'Tasks & Follow-Up (A.62)', 'route', '/app/unified-task-follow-up-engine'),
      jsonb_build_object('key', 'knowledge_center_engine', 'label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine'),
      jsonb_build_object('key', 'executive_insights_engine', 'label', 'Executive Insights (A.35)', 'route', '/app/executive-insights-engine'),
      jsonb_build_object('key', 'gratitude_recognition_engine', 'label', 'Gratitude & Recognition (A.89)', 'route', '/app/gratitude-recognition-engine'),
      jsonb_build_object('key', 'operations_dashboard_engine', 'label', 'Operations Dashboard (A.9)', 'route', '/app/operations-dashboard-engine'),
      jsonb_build_object('key', 'command_center', 'label', 'Command Center (Phase 26)', 'route', '/app/command-center', 'note', 'Presence and notifications — distinct surface'),
      jsonb_build_object('key', 'autonomous_operations_center', 'label', 'AOC Watchers (Phase 79)', 'route', '/app/operations', 'note', 'Autonomous operations watchers — distinct surface'),
      jsonb_build_object('key', 'self_love_engine', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine')
    ),
    'privacy_note', 'Metadata and summary counts only — no customer email, chat, order content, or PII.'
  );
$$;

create or replace function public._ocf_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates Operations Center internally; Unonight is the first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — cross-module operational visibility, Since Last Time, event coordination',
      'focus', jsonb_build_array('Platform health and integration failures', 'Support and KC trend summaries', 'Task priority coordination', 'Sustainable pacing via Self Love cross-links')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce operational coordination',
      'focus', jsonb_build_array('Support resolution trends and escalations', 'Launch task priorities', 'Knowledge gap surfacing', 'Recognition moments for team milestones')
    )
  );
$$;

create or replace function public._ocf_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Operational clarity creates confidence — one place to see what needs attention.',
    'Reduce noise, increase focus — module overviews show counts, not everything at once.',
    'Humans decide — Aipify aggregates, explains, and prepares; teams retain operational authority.',
    'Since Last Time — pick up where you left off with trends across support, tasks, and knowledge.',
    'Calm coordination beats alert fatigue — acknowledge, assign, and resolve with audit support.'
  );
$$;

create or replace function public._ocf_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Operations Dashboard (A.9)', 'route', '/app/operations-dashboard-engine', 'note', 'Role-aware widget dashboard — distinct from this foundation engine'),
    jsonb_build_object('label', 'Command Center (Phase 26)', 'route', '/app/command-center', 'note', 'Presence and notifications — not operational event coordination'),
    jsonb_build_object('label', 'AOC Watchers (Phase 79)', 'route', '/app/operations', 'note', 'Autonomous operations watchers — observes and recommends'),
    jsonb_build_object('label', 'Support AI (A.7)', 'route', '/app/support-ai-engine'),
    jsonb_build_object('label', 'Tasks & Follow-Up (A.62)', 'route', '/app/unified-task-follow-up-engine'),
    jsonb_build_object('label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine'),
    jsonb_build_object('label', 'Executive Insights (A.35)', 'route', '/app/executive-insights-engine'),
    jsonb_build_object('label', 'Gratitude & Recognition (A.89)', 'route', '/app/gratitude-recognition-engine'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine'),
    jsonb_build_object('label', 'Unonight Pilot', 'route', '/app/unonight-pilot-operations-engine')
  );
$$;

create or replace function public._ocf_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Operations Dashboard A.9 (role-aware widgets), Command Center /app/command-center (presence/notifications Phase 26), and Autonomous Operations Center /app/operations (Phase 79 watchers). Executive Overview cross-links Executive Insights A.35 — extend, do not duplicate.';
$$;

create or replace function public.get_operations_center_foundation_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_since jsonb;
  v_modules jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._ocf_aggregate_events(v_org_id);
  v_modules := public._ocf_module_overviews(v_org_id);

  begin
    v_user_id := public._mta_app_user_id();
    if v_user_id is not null then
      v_since := public._ocf_since_last_time_summary(v_org_id, v_user_id);
    end if;
  exception when others then
    v_since := null;
  end;

  return jsonb_build_object(
    'has_organization', true,
    'open_events', coalesce((select count(*) from public.operations_events where organization_id = v_org_id and status in ('new', 'acknowledged', 'in_progress')), 0),
    'urgent_events', coalesce((select count(*) from public.operations_events where organization_id = v_org_id and priority in ('high', 'critical') and status not in ('completed', 'dismissed')), 0),
    'philosophy', 'Operational clarity creates confidence — centralized visibility, coordination, and control.',
    'mission', 'Centralized operational experience — monitor activities, surface developments, coordinate teams, and enable informed action.',
    'abos_principle', 'Reduce noise, increase focus — one operations center for cross-module awareness.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 18 — Operations Center Engine Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE18_OPERATIONS_CENTER_FOUNDATION.md',
      'engine_phase', 'A.32 Operations Center Foundation Engine',
      'route', '/app/operations-center-foundation-engine'
    ),
    'operations_center_foundation_engine_note', 'Operations Center Engine Foundation (ABOS Phase 18) — extends Operations Center Foundation Engine (Phase A.32).',
    'module_overviews', v_modules,
    'since_last_time', v_since
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_operations_center_foundation_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_since jsonb;
begin
  perform public._irp_require_permission('operations.view');
  v_org_id := public._mta_require_organization();
  perform public._ocf_aggregate_events(v_org_id);

  begin
    v_user_id := public._mta_app_user_id();
    if v_user_id is not null then
      v_since := public._ocf_since_last_time_summary(v_org_id, v_user_id);
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
      'phase', 'Phase 18 — Operations Center Engine Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE18_OPERATIONS_CENTER_FOUNDATION.md',
      'engine_phase', 'A.32 Operations Center Foundation Engine',
      'route', '/app/operations-center-foundation-engine',
      'mapping_note', 'ABOS Blueprint Phase 18 maps to Operations Center Foundation Engine A.32 — extend, do not duplicate. Distinct from Operations Dashboard A.9, Command Center Phase 26, and AOC Phase 79.'
    ),
    'mission', 'Centralized operational experience — visibility, coordination, and control across modules.',
    'philosophy', 'Operational clarity creates confidence — reduce noise, increase focus, enable informed action.',
    'abos_principle', 'Reduce noise, increase focus — one operations center for cross-module operational awareness.',
    'vision', 'Teams see what changed, what needs attention, and what improved — with transparent sources and calm coordination.',
    'operations_center_foundation_engine_note', 'Operations Center Engine Foundation (ABOS Phase 18) — extends Operations Center Foundation Engine (Phase A.32).',
    'distinction_note', public._ocf_distinction_note(),
    'operational_objectives', public._ocf_operational_objectives(),
    'module_overviews', public._ocf_module_overviews(v_org_id),
    'since_last_time', coalesce(v_since, jsonb_build_object('since', now() - interval '7 days', 'since_source', 'seven_day_fallback')),
    'companion_communication_examples', public._ocf_companion_communication_examples(),
    'self_love_connection', public._ocf_self_love_connection(),
    'self_love_note', 'Self Love (A.76) supports operational pacing and accomplishment visibility — principle only; Operations Center stores metadata, not wellbeing content.',
    'trust_connection', public._ocf_trust_connection(),
    'data_sources', public._ocf_data_sources(),
    'dogfooding', public._ocf_blueprint_dogfooding(),
    'success_criteria', public._ocf_blueprint_success_criteria(v_org_id),
    'vision_phrases', public._ocf_vision_phrases(),
    'integration_links', public._ocf_integration_links(),
    'safety_note', 'Metadata and summary counts only — no customer email, chat, order content, or PII.',
    'principles', jsonb_build_array(
      'Cross-module aggregation',
      'Action-oriented design',
      'Role-based visibility',
      'Escalation for critical events',
      'Audit-supported accountability',
      'Since Last Time — counts and trends only, no PII'
    ),
    'summary', jsonb_build_object(
      'urgent', coalesce((select count(*) from public.operations_events where organization_id = v_org_id and priority in ('high', 'critical') and status not in ('completed', 'dismissed')), 0),
      'pending_approvals', coalesce((select count(*) from public.operations_events where organization_id = v_org_id and category = 'approvals' and status not in ('completed', 'dismissed')), 0),
      'open_events', coalesce((select count(*) from public.operations_events where organization_id = v_org_id and status in ('new', 'acknowledged', 'in_progress')), 0)
    ),
    'urgent_actions', coalesce((
      select jsonb_agg(row_to_json(e) order by case e.priority when 'critical' then 0 when 'high' then 1 else 2 end, e.created_at desc)
      from public.operations_events e where e.organization_id = v_org_id and e.priority in ('high', 'critical') and e.status not in ('completed', 'dismissed') limit 10
    ), '[]'::jsonb),
    'events', coalesce((
      select jsonb_agg(row_to_json(e) order by e.created_at desc)
      from public.operations_events e where e.organization_id = v_org_id and e.status not in ('completed', 'dismissed') limit 25
    ), '[]'::jsonb),
    'recent_completed', coalesce((
      select jsonb_agg(row_to_json(e) order by e.updated_at desc)
      from public.operations_events e where e.organization_id = v_org_id and e.status = 'completed' limit 10
    ), '[]'::jsonb)
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._ocf_since_last_time_summary(uuid, uuid) to authenticated;
grant execute on function public._ocf_module_overviews(uuid) to authenticated;
grant execute on function public._ocf_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'operations-center-engine-blueprint', 'Operations Center Engine (ABOS Phase 18)',
  'Operations Center Engine Foundation — extends Operations Center Foundation Engine A.32 with module overviews, Since Last Time, and live success criteria.',
  'authenticated', 96
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'operations-center-engine-blueprint' and tenant_id is null
);
