-- Fix STABLE activity operations RPCs: resolve org without INSERT in read-only transactions.

-- Activity operations read-only org resolver (STABLE RPC safe — no INSERT/backfill).
create or replace function public._aact538_org_readonly()
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_org_id uuid;
  v_membership public.organization_users;
begin
  v_user_id := public._mta_app_user_id();
  if v_user_id is null then
    raise exception 'Unauthorized';
  end if;

  select ouc.organization_id into v_org_id
  from public.organization_user_context ouc
  where ouc.user_id = v_user_id;

  if v_org_id is null then
    select ou.organization_id into v_org_id
    from public.organization_users ou
    where ou.user_id = v_user_id and ou.status = 'active'
    order by ou.joined_at nulls last, ou.created_at
    limit 1;
  end if;

  if v_org_id is null then
    select c.id into v_org_id
    from public.customers c
    join public.users u on u.company_id = c.company_id
    where u.id = v_user_id
    limit 1;
  end if;

  if v_org_id is null then
    raise exception 'Organization context required';
  end if;

  v_membership := public._mta_membership_active(v_org_id, v_user_id);
  if v_membership is null then
    raise exception 'Access denied for organization';
  end if;

  return v_org_id;
end;
$$;

grant execute on function public._aact538_org_readonly() to authenticated;


create or replace function public.get_activity_operations_center(p_section text default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_activity_operations_settings;
  v_since jsonb;
  v_event_count int;
begin
  if not public.has_organization_permission('activity_history.view')
     and not public.has_organization_permission('activity_history.manage') then
    raise exception 'Permission denied: activity_history.view';
  end if;

  v_org_id := public._aact538_org_readonly();
  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);

  select * into v_settings
  from public.organization_activity_operations_settings
  where organization_id = v_org_id;

  v_since := public._aact538_build_since_last_login(v_org_id, v_user_id, false);
  select count(*) into v_event_count
  from public.organization_activity_operations_events
  where organization_id = v_org_id;

  return jsonb_build_object(
    'found', true,
    'principle', 'Users should never need to search for what changed. Aipify should tell them.',
    'philosophy', 'One timeline. One activity engine. One organizational memory.',
    'overview', jsonb_build_object(
      'total_events', v_event_count,
      'events_since_login', (v_since->'stats'->>'events_since')::int,
      'pending_approvals', (v_since->'stats'->>'pending_approvals')::int,
      'critical_items', (v_since->'stats'->>'critical_items')::int,
      'highlights_today', (
        select count(*)
        from public.organization_activity_operations_highlights
        where organization_id = v_org_id and highlight_date = current_date
      )
    ),
    'since_last_login', v_since,
    'personal_timeline', coalesce((
      select jsonb_agg(public._aact538_event_json(e) order by e.occurred_at desc)
      from (
        select * from public.organization_activity_operations_events
        where organization_id = v_org_id and (scope = 'personal' or actor_user_id = v_user_id)
        order by occurred_at desc limit 40
      ) e
    ), '[]'::jsonb),
    'organization_timeline', coalesce((
      select jsonb_agg(public._aact538_event_json(e) order by e.occurred_at desc)
      from (
        select * from public.organization_activity_operations_events
        where organization_id = v_org_id and scope = 'organization'
        order by occurred_at desc limit 50
      ) e
    ), '[]'::jsonb),
    'team_timeline', coalesce((
      select jsonb_agg(public._aact538_event_json(e) order by e.occurred_at desc)
      from (
        select * from public.organization_activity_operations_events
        where organization_id = v_org_id and scope = 'team'
        order by occurred_at desc limit 40
      ) e
    ), '[]'::jsonb),
    'categories', jsonb_build_array(
      jsonb_build_object('key', 'customer_activity', 'label', 'Customer Activity'),
      jsonb_build_object('key', 'financial_activity', 'label', 'Financial Activity'),
      jsonb_build_object('key', 'employee_activity', 'label', 'Employee Activity'),
      jsonb_build_object('key', 'operational_activity', 'label', 'Operational Activity'),
      jsonb_build_object('key', 'partner_activity', 'label', 'Partner Activity'),
      jsonb_build_object('key', 'security_activity', 'label', 'Security Activity'),
      jsonb_build_object('key', 'compliance_activity', 'label', 'Compliance Activity'),
      jsonb_build_object('key', 'inventory_activity', 'label', 'Inventory Activity'),
      jsonb_build_object('key', 'project_activity', 'label', 'Project Activity'),
      jsonb_build_object('key', 'automation_activity', 'label', 'Automation Activity'),
      jsonb_build_object('key', 'companion_activity', 'label', 'Companion Activity')
    ),
    'priorities', jsonb_build_array(
      jsonb_build_object('key', 'information', 'label', 'Information', 'icon', 'ℹ️'),
      jsonb_build_object('key', 'attention_required', 'label', 'Attention Required', 'icon', '⚠️'),
      jsonb_build_object('key', 'critical', 'label', 'Critical', 'icon', '🚨'),
      jsonb_build_object('key', 'security', 'label', 'Security', 'icon', '🛡'),
      jsonb_build_object('key', 'completed', 'label', 'Completed', 'icon', '✅'),
      jsonb_build_object('key', 'pending', 'label', 'Pending', 'icon', '⏳')
    ),
    'timeline_ranges', jsonb_build_array('yesterday', 'last_week', 'last_month', 'custom'),
    'approval_feed', coalesce((
      select jsonb_agg(public._aact538_event_json(e) order by e.occurred_at desc)
      from (
        select * from public.organization_activity_operations_events
        where organization_id = v_org_id and category = 'approval_activity'
        order by occurred_at desc limit 30
      ) e
    ), '[]'::jsonb),
    'business_pack_activity', coalesce((
      select jsonb_agg(public._aact538_event_json(e) order by e.occurred_at desc)
      from (
        select * from public.organization_activity_operations_events
        where organization_id = v_org_id and category = 'business_pack_activity'
        order by occurred_at desc limit 30
      ) e
    ), '[]'::jsonb),
    'domain_activity', coalesce((
      select jsonb_agg(public._aact538_event_json(e) order by e.occurred_at desc)
      from (
        select * from public.organization_activity_operations_events
        where organization_id = v_org_id and category = 'domain_activity'
        order by occurred_at desc limit 30
      ) e
    ), '[]'::jsonb),
    'companion_highlights', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', h.id, 'highlight_type', h.highlight_type, 'title', h.title,
        'summary', h.summary, 'priority', h.priority, 'record_href', h.record_href
      ) order by h.created_at desc)
      from public.organization_activity_operations_highlights h
      where h.organization_id = v_org_id and (h.user_id = v_user_id or h.user_id is null)
        and h.highlight_date = current_date
    ), '[]'::jsonb),
    'activity_intelligence', public._aact538_intelligence(v_org_id),
    'executive_briefing', jsonb_build_object(
      'since_last_login', v_since,
      'top_changes', v_since->'top_changes',
      'top_risks', v_since->'top_risks',
      'top_opportunities', v_since->'top_opportunities',
      'recommended_actions', v_since->'recommended_actions',
      'companion_summary', v_since->'companion_summary',
      'intelligence_route', '/app/intelligence/briefing'
    ),
    'notifications_integration', jsonb_build_object(
      'daily_digest', coalesce(v_settings.digest_enabled, true),
      'weekly_summary', true,
      'executive_briefing', coalesce(v_settings.executive_briefing_integration, true),
      'channels', jsonb_build_array('notification_center', 'companion', 'email_digest', 'desktop', 'mobile')
    ),
    'search_integration', jsonb_build_object(
      'universal_search_route', '/app/search',
      'activity_search_enabled', true,
      'supports', jsonb_build_array('activity', 'timeline', 'events', 'approvals', 'changes')
    ),
    'reports', jsonb_build_object(
      'activity_volume', v_event_count,
      'events_7d', (
        select count(*)
        from public.organization_activity_operations_events
        where organization_id = v_org_id and occurred_at >= now() - interval '7 days'
      ),
      'approval_trends', jsonb_build_object(
        'pending', (
          select count(*)
          from public.organization_activity_operations_events
          where organization_id = v_org_id and category = 'approval_activity' and priority = 'pending'
        ),
        'completed', (
          select count(*)
          from public.organization_activity_operations_events
          where organization_id = v_org_id and category = 'approval_activity' and priority = 'completed'
        )
      ),
      'companion_usage_7d', (
        select count(*)
        from public.organization_activity_operations_audit_logs
        where organization_id = v_org_id
          and action = 'companion_summary_generated'
          and created_at >= now() - interval '7 days'
      ),
      'business_pack_events', (
        select count(*)
        from public.organization_activity_operations_events
        where organization_id = v_org_id and category = 'business_pack_activity'
      )
    ),
    'companion_integration', jsonb_build_object(
      'prompts', jsonb_build_array(
        'What changed since I was away?',
        'Show important events.',
        'Show only critical events.',
        'What should I focus on today?',
        'Generate executive summary.'
      ),
      'understands', jsonb_build_array('activities', 'trends', 'approvals', 'tasks', 'customers', 'projects', 'operations')
    ),
    'mobile_access', jsonb_build_object(
      'timeline', true,
      'since_last_login', true,
      'approvals', true,
      'filters', true,
      'mobile_ready', true
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object(
        'action', a.action, 'summary', a.summary, 'section', a.section, 'created_at', a.created_at
      ) order by a.created_at desc)
      from public.organization_activity_operations_audit_logs a
      where a.organization_id = v_org_id
      limit 20
    ), '[]'::jsonb),
    'sections', jsonb_build_array(
      'overview', 'since_last_login', 'organization', 'my_activity', 'team', 'approvals',
      'business_packs', 'domains', 'companion_insights', 'reports'
    ),
    'routes', jsonb_build_object(
      'activity', '/app/activity',
      'since_last_login', '/app/since-last-login',
      'approvals', '/app/approvals',
      'search', '/app/search',
      'intelligence_briefing', '/app/intelligence/briefing',
      'notifications', '/app/notifications'
    )
  );
end;
$$;

create or replace function public.search_activity_operations(
  p_query text, p_limit int default 30
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
begin
  if not public.has_organization_permission('activity_history.view')
     and not public.has_organization_permission('activity_history.manage') then
    raise exception 'Permission denied: activity_history.view';
  end if;

  v_org_id := public._aact538_org_readonly();
  if v_org_id is null then
    return jsonb_build_object('found', true, 'query', p_query, 'results', '[]'::jsonb);
  end if;

  return jsonb_build_object(
    'found', true,
    'query', p_query,
    'results', coalesce((
      select jsonb_agg(public._aact538_event_json(e) order by e.occurred_at desc)
      from (
        select * from public.organization_activity_operations_events
        where organization_id = v_org_id
          and (
            p_query is null or trim(p_query) = ''
            or title ilike '%' || p_query || '%'
            or summary ilike '%' || p_query || '%'
            or category ilike '%' || p_query || '%'
          )
        order by occurred_at desc
        limit greatest(p_limit, 1)
      ) e
    ), '[]'::jsonb)
  );
end;
$$;

grant execute on function public.get_activity_operations_center(text) to authenticated;
grant execute on function public.search_activity_operations(text, int) to authenticated;
notify pgrst, 'reload schema';
