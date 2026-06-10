-- Phase 28 — Customer App 1.0 Foundation

-- ---------------------------------------------------------------------------
-- 1. Health score (tenant-scoped business health)
-- ---------------------------------------------------------------------------
create or replace function public._compute_customer_health_score(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_install_score integer := 90;
  v_skill_score integer := 90;
  v_approval_penalty integer := 0;
  v_critical_penalty integer := 0;
  v_score integer;
  v_label text;
begin
  select coalesce(ihs.score, i.health_score, 90) into v_install_score
  from public.installations i
  left join lateral (
    select ihs2.score
    from public.installation_health_scans ihs2
    where ihs2.installation_id = i.id
    order by ihs2.created_at desc
    limit 1
  ) ihs on true
  where i.customer_id = p_tenant_id
  order by i.updated_at desc nulls last
  limit 1;

  select coalesce(
    round(avg(
      case ts.status
        when 'active' then 95
        when 'installed' then 85
        when 'warning' then 65
        when 'paused' then 75
        when 'failed' then 40
        else 70
      end
    ))::integer,
    90
  ) into v_skill_score
  from public.tenant_skills ts
  where ts.tenant_id = p_tenant_id
    and ts.status not in ('disabled');

  select least(20, count(*) * 5) into v_approval_penalty
  from public.intelligence_patterns ip
  where ip.approval_status = 'pending';

  select least(30, count(*) * 10) into v_critical_penalty
  from public.presence_notifications n
  where n.tenant_id = p_tenant_id
    and n.level = 'critical'
    and n.status in ('pending', 'delivered');

  v_score := greatest(
    0,
    least(
      100,
      round(
        (coalesce(v_install_score, 90) * 0.35
          + coalesce(v_skill_score, 90) * 0.25
          + 90 * 0.4)::numeric
        - v_approval_penalty
        - v_critical_penalty
      )
    )
  );

  v_label := case
    when v_score >= 95 then 'excellent'
    when v_score >= 80 then 'healthy'
    when v_score >= 60 then 'needs_attention'
    else 'action_recommended'
  end;

  return jsonb_build_object('score', v_score, 'label', v_label);
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. Customer App home bundle
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_app_home_bundle()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_name text;
  v_company_name text;
  v_bundle jsonb;
  v_health jsonb;
  v_onboarding jsonb;
  v_hour integer;
  v_greeting text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  select u.full_name, coalesce(c.company_name, c.full_name, 'Your company')
  into v_user_name, v_company_name
  from public.users u
  join public.customers c on c.company_id = u.company_id
  where u.auth_user_id = auth.uid() and c.id = v_tenant_id
  limit 1;

  v_bundle := public.get_command_center_bundle_for_tenant(v_tenant_id);
  v_health := public._compute_customer_health_score(v_tenant_id);
  v_onboarding := public.get_customer_onboarding_progress();
  v_hour := extract(hour from now() at time zone 'Europe/Oslo');

  v_greeting := case
    when v_hour < 12 then 'Good morning'
    when v_hour < 18 then 'Good afternoon'
    else 'Good evening'
  end;

  return jsonb_build_object(
    'has_customer', true,
    'welcome_message', v_greeting || coalesce(', ' || v_user_name, '') || '.',
    'company_name', v_company_name,
    'user_name', v_user_name,
    'health_score', v_health,
    'executive_overview', case
      when (v_health ->> 'label') = 'action_recommended'
        then 'Aipify detected issues that need your attention.'
      when (v_health ->> 'label') = 'needs_attention'
        then 'Aipify has been monitoring your business. Some areas need review.'
      else 'Aipify has been monitoring your business. No critical issues detected.'
    end,
    'recent_activity', coalesce(v_bundle -> 'recent_activity', '[]'::jsonb),
    'recommendations_preview', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', r.id,
        'title', coalesce(r.title, left(r.recommendation, 80)),
        'message', r.recommendation
      ) order by r.created_at desc)
      from public.ai_recommendations r
      where r.tenant_id = v_tenant_id and r.status = 'active'
      limit 3),
      '[]'::jsonb
    ),
    'pending_approvals_count', coalesce((v_bundle ->> 'pending_approvals')::integer, 0),
    'recommendations_count', coalesce((
      select count(*)::integer
      from public.ai_recommendations r
      where r.tenant_id = v_tenant_id and r.status = 'active'
    ), 0),
    'active_skills', coalesce((v_bundle ->> 'active_skills')::integer, 0),
    'quick_actions', jsonb_build_array(
      jsonb_build_object('id', 'open_executive_summary', 'label', 'View executive summary', 'href', '/app/executive'),
      jsonb_build_object('id', 'approve_recommendation', 'label', 'Review recommendation', 'href', '/app/recommendations'),
      jsonb_build_object('id', 'view_installation_health', 'label', 'Run installation check', 'href', '/app/installations'),
      jsonb_build_object('id', 'open_web_dashboard', 'label', 'Open presence feed', 'href', '/app/presence')
    ),
    'onboarding_complete', coalesce((v_onboarding -> 'onboarding' ->> 'score')::integer, 0) >= 100
  );
end;
$$;

grant execute on function public.get_customer_app_home_bundle() to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Executive dashboard (tenant-scoped)
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_executive_dashboard()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_bundle jsonb;
  v_health jsonb;
  v_install_total integer := 0;
  v_install_healthy integer := 0;
  v_install_attention integer := 0;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_bundle := public.get_command_center_bundle_for_tenant(v_tenant_id);
  v_health := public._compute_customer_health_score(v_tenant_id);

  select
    count(*)::integer,
    count(*) filter (where coalesce(i.health_score, 90) >= 80)::integer,
    count(*) filter (where coalesce(i.health_score, 90) < 80)::integer
  into v_install_total, v_install_healthy, v_install_attention
  from public.installations i
  where i.customer_id = v_tenant_id;

  return jsonb_build_object(
    'has_customer', true,
    'health_score', v_health,
    'executive_summary', coalesce(v_bundle ->> 'executive_summary', 'Operational overview ready.'),
    'recent_activity', coalesce(v_bundle -> 'recent_activity', '[]'::jsonb),
    'recommendations', coalesce(v_bundle -> 'recommendations', '[]'::jsonb),
    'pending_approvals', coalesce((v_bundle ->> 'pending_approvals')::integer, 0),
    'active_skills', coalesce((v_bundle ->> 'active_skills')::integer, 0),
    'installation_status', jsonb_build_object(
      'total', v_install_total,
      'healthy', v_install_healthy,
      'attention', v_install_attention
    ),
    'quick_actions', coalesce(v_bundle -> 'quick_actions', '[]'::jsonb)
  );
end;
$$;

grant execute on function public.get_customer_executive_dashboard() to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Presence center
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_presence_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_bundle jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_bundle := public.get_command_center_bundle_for_tenant(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'activity_timeline', coalesce(v_bundle -> 'activity_timeline', '[]'::jsonb),
    'executive_feed', coalesce(v_bundle -> 'executive_feed', '[]'::jsonb),
    'morning_briefing', v_bundle -> 'morning_briefing',
    'presence_status', v_bundle -> 'presence_status'
  );
end;
$$;

grant execute on function public.get_customer_presence_center() to authenticated;

-- ---------------------------------------------------------------------------
-- 5. Recommendations center
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_recommendations_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  return jsonb_build_object(
    'has_customer', true,
    'recommendations', coalesce(
      (
        select jsonb_agg(row order by row ->> 'created_at' desc)
        from (
          select jsonb_build_object(
            'id', cr.id,
            'source', 'customer',
            'title', cr.recommendation_key,
            'description', cr.message,
            'reason', 'Based on your operational patterns.',
            'expected_impact', 'Improved efficiency and reduced manual work.',
            'risk_level', cr.priority,
            'suggested_action', cr.recommended_action,
            'confidence', cr.confidence,
            'status', case when cr.dismissed_at is null then 'active' else 'dismissed' end,
            'created_at', cr.created_at
          ) as row
          from public.customer_recommendations cr
          where cr.customer_id = v_tenant_id and cr.dismissed_at is null
          union all
          select jsonb_build_object(
            'id', ar.id,
            'source', 'ai',
            'title', ar.title,
            'description', ar.recommendation,
            'reason', ar.reason,
            'expected_impact', 'Operational improvement based on intelligence signals.',
            'risk_level', ar.priority,
            'suggested_action', 'Review and approve',
            'confidence', ar.confidence_score,
            'status', ar.status,
            'created_at', ar.created_at
          )
          from public.ai_recommendations ar
          where ar.tenant_id = v_tenant_id and ar.status = 'active'
        ) combined
      ),
      '[]'::jsonb
    )
  );
end;
$$;

grant execute on function public.get_customer_recommendations_center() to authenticated;

create or replace function public.perform_customer_recommendation_action(
  p_recommendation_id uuid,
  p_source text,
  p_action text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  if p_action not in ('approve', 'dismiss') then
    raise exception 'Invalid action';
  end if;

  if p_source = 'customer' then
    if p_action = 'dismiss' then
      update public.customer_recommendations
      set dismissed_at = now()
      where id = p_recommendation_id and customer_id = v_tenant_id;
    end if;
  elsif p_source = 'ai' then
    update public.ai_recommendations
    set status = case when p_action = 'approve' then 'executed' else 'dismissed' end,
        dismissed_at = case when p_action = 'dismiss' then now() else dismissed_at end
    where id = p_recommendation_id and tenant_id = v_tenant_id;
  else
    raise exception 'Invalid source';
  end if;

  perform public.record_presence_engagement(
    'recommendation_action', p_action, null, 'web',
    jsonb_build_object('recommendation_id', p_recommendation_id, 'source', p_source)
  );

  return jsonb_build_object('ok', true, 'action', p_action);
end;
$$;

grant execute on function public.perform_customer_recommendation_action(uuid, text, text)
  to authenticated;

-- ---------------------------------------------------------------------------
-- 6. Approvals center
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_approvals_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  return jsonb_build_object(
    'has_customer', true,
    'approvals', coalesce(
      (
        select jsonb_agg(row order by row ->> 'created_at' desc)
        from (
          select jsonb_build_object(
            'id', n.id,
            'title', n.title,
            'description', coalesce(n.body, ''),
            'category', 'notification',
            'status', case n.status
              when 'acted' then 'approved'
              when 'dismissed' then 'rejected'
              else 'pending'
            end,
            'risk_level', n.level,
            'created_at', n.created_at
          ) as row
          from public.presence_notifications n
          where n.tenant_id = v_tenant_id
            and n.level in ('action_required', 'important', 'critical')
          union all
          select jsonb_build_object(
            'id', ip.id,
            'title', ip.pattern_title,
            'description', coalesce(ip.suggested_action, 'Recommended action awaiting approval.'),
            'category', 'recommendation',
            'status', case ip.approval_status
              when 'approved' then 'approved'
              when 'rejected' then 'rejected'
              else 'pending'
            end,
            'risk_level', coalesce(ip.potential_impact, 'medium'),
            'created_at', ip.created_at
          )
          from public.intelligence_patterns ip
          where ip.approval_status in ('pending', 'approved', 'rejected')
            and (ip.tenant_id = v_tenant_id or ip.tenant_id is null)
        ) combined
      ),
      '[]'::jsonb
    )
  );
end;
$$;

grant execute on function public.get_customer_approvals_center() to authenticated;

-- ---------------------------------------------------------------------------
-- 7. Team center
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_team_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_company_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  select c.company_id into v_company_id
  from public.customers c
  where c.id = v_tenant_id;

  return jsonb_build_object(
    'has_customer', true,
    'members', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', u.id,
        'name', u.full_name,
        'email', coalesce(au.email, ''),
        'role', u.role,
        'status', 'active'
      ) order by u.created_at)
      from public.users u
      left join auth.users au on au.id = u.auth_user_id
      where u.company_id = v_company_id),
      '[]'::jsonb
    ),
    'invitations', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', ti.id,
        'email', ti.email,
        'role', ti.role,
        'status', ti.status,
        'created_at', ti.created_at
      ) order by ti.created_at desc)
      from public.team_invitations ti
      where ti.customer_id = v_tenant_id),
      '[]'::jsonb
    )
  );
end;
$$;

grant execute on function public.get_customer_team_center() to authenticated;

-- ---------------------------------------------------------------------------
-- 8. Update quick action hrefs for Customer App routes
-- ---------------------------------------------------------------------------
create or replace function public.perform_presence_quick_action(
  p_action_id text,
  p_notification_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_href text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  v_href := case p_action_id
    when 'approve_recommendation' then '/app/recommendations'
    when 'review_support_escalation' then '/app/approvals'
    when 'open_executive_summary' then '/app/executive'
    when 'view_installation_health' then '/app/installations'
    when 'open_web_dashboard' then '/app'
    else null
  end;

  if p_action_id = 'dismiss_notification' and p_notification_id is not null then
    perform public.perform_presence_notification_action(p_notification_id, 'dismiss');
  elsif p_action_id = 'mark_as_reviewed' and p_notification_id is not null then
    perform public.perform_presence_notification_action(p_notification_id, 'mark_as_reviewed');
  elsif p_action_id = 'pause_notifications' then
    update public.presence_notification_preferences
    set quiet_hours_mode = 'do_not_disturb', updated_at = now()
    where tenant_id = v_tenant_id;
  end if;

  perform public.record_presence_engagement(
    'quick_action',
    p_action_id,
    p_notification_id,
    'web',
    jsonb_build_object('href', v_href)
  );

  return jsonb_build_object('action', p_action_id, 'href', v_href);
end;
$$;

-- ---------------------------------------------------------------------------
-- 9. Extended Unonight pilot — Customer App metrics
-- ---------------------------------------------------------------------------
create or replace function public.get_presence_pilot_metrics()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_pilot_id uuid;
  v_sent integer;
  v_acted integer;
  v_dismissed integer;
  v_feed integer;
  v_engagement integer;
  v_total integer;
  v_approval_rate integer;
  v_recommendations integer;
  v_home_visits integer;
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  select c.id into v_pilot_id
  from public.customers c
  where c.slug = 'unonight'
  limit 1;

  if v_pilot_id is null then
    return jsonb_build_object('has_pilot', false);
  end if;

  select count(*) into v_sent
  from public.presence_notifications
  where tenant_id = v_pilot_id and created_at >= now() - interval '7 days';

  select count(*) into v_acted
  from public.presence_notifications
  where tenant_id = v_pilot_id and status = 'acted'
    and created_at >= now() - interval '7 days';

  select count(*) into v_dismissed
  from public.presence_notifications
  where tenant_id = v_pilot_id and status = 'dismissed'
    and created_at >= now() - interval '7 days';

  select count(*) into v_feed
  from public.presence_executive_feed
  where tenant_id = v_pilot_id;

  select count(*) into v_engagement
  from public.presence_engagement_events
  where tenant_id = v_pilot_id and created_at >= now() - interval '7 days';

  select count(*) into v_recommendations
  from public.ai_recommendations
  where tenant_id = v_pilot_id and status = 'active';

  select count(*) into v_home_visits
  from public.presence_engagement_events
  where tenant_id = v_pilot_id
    and event_type in ('quick_action', 'recommendation_action')
    and created_at >= now() - interval '7 days';

  v_total := greatest(v_sent, 1);
  v_approval_rate := round((v_acted::numeric / v_total) * 100);

  return jsonb_build_object(
    'has_pilot', true,
    'tenant_slug', 'unonight',
    'notifications_sent_7d', v_sent,
    'actions_completed_7d', v_acted,
    'dismiss_rate_pct', round((v_dismissed::numeric / v_total) * 100),
    'usefulness_score', greatest(0, least(100, 100 - round((v_dismissed::numeric / v_total) * 40))),
    'executive_feed_entries', v_feed,
    'engagement_events_7d', v_engagement,
    'approval_completion_rate_pct', v_approval_rate,
    'feed_quality_score', least(100, v_feed * 20),
    'active_recommendations', v_recommendations,
    'customer_app_engagement_7d', v_home_visits,
    'simplicity_score', greatest(0, least(100, 100 - round((v_dismissed::numeric / v_total) * 25)))
  );
end;
$$;
