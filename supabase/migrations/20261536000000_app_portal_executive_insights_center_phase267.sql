-- Phase 267 (APP) — Executive Insights Center

create or replace function public._apei267_require_executive_access()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_role text;
begin
  v_access := public._apsf260_require_app_access();
  v_role := v_access->>'organization_role';

  if v_role not in ('organization_owner', 'organization_admin', 'organization_manager') then
    raise exception 'Executive Insights access denied';
  end if;

  return v_access;
end;
$$;

create or replace function public._apei267_health_band(p_score integer)
returns text
language sql
immutable
as $$
  select case
    when p_score >= 75 then 'healthy'
    when p_score >= 50 then 'warning'
    else 'critical'
  end;
$$;

create or replace function public.get_app_portal_executive_insights()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_health integer := 82;
  v_trend text := 'stable';
  v_pending_approvals integer := 0;
  v_critical_support integer := 0;
  v_blocked_actions integer := 0;
  v_unread_notifications integer := 0;
  v_billing_issue boolean := false;
  v_sub_status text := 'active';
  v_team_new integer := 0;
  v_integrations integer := 0;
  v_packs_installed integer := 0;
  v_tasks_completed integer := 0;
  v_priorities jsonb := '[]'::jsonb;
  v_opportunities jsonb := '[]'::jsonb;
  v_risks jsonb := '[]'::jsonb;
  v_recommendations jsonb := '[]'::jsonb;
  v_since_last_login jsonb := '{}'::jsonb;
  v_factors jsonb := '[]'::jsonb;
  v_priority_count integer := 0;
begin
  v_access := public._apei267_require_executive_access();
  v_company_id := (v_access->>'company_id')::uuid;

  if to_regclass('public.action_requests') is not null then
    select count(*)::int into v_pending_approvals
    from public.action_requests ar
    where ar.company_id = v_company_id and ar.status = 'pending';
  end if;

  if to_regclass('public.support_cases') is not null then
    select count(*)::int into v_critical_support
    from public.support_cases sc
    where sc.tenant_id = v_company_id
      and sc.status not in ('resolved', 'closed')
      and sc.risk_level in ('high', 'critical');
  end if;

  if to_regclass('public.aipify_actions') is not null then
    select count(*)::int into v_blocked_actions
    from public.aipify_actions a
    where a.tenant_id = v_company_id and a.status = 'blocked';
  end if;

  if to_regclass('public.presence_notifications') is not null then
    select count(*)::int into v_unread_notifications
    from public.presence_notifications pn
    where pn.company_id = v_company_id and pn.read_at is null;
  end if;

  if exists (select 1 from pg_proc where proname = 'get_customer_license_center') then
    begin
      v_sub_status := coalesce(public.get_customer_license_center()->'subscription'->>'status', 'active');
      v_billing_issue := v_sub_status in ('past_due', 'paused', 'canceled');
    exception when others then null;
    end;
  end if;

  select count(*)::int into v_team_new
  from public.users u
  where u.company_id = v_company_id
    and u.created_at > now() - interval '30 days';

  if to_regclass('public.app_portal_integration_connections') is not null then
    select count(*)::int into v_integrations
    from public.app_portal_integration_connections c
    where c.company_id = v_company_id and c.status = 'connected';
  elsif to_regclass('public.calendar_connections') is not null then
    select count(*)::int into v_integrations
    from public.calendar_connections cc
    where cc.company_id = v_company_id and cc.status = 'connected';
  end if;

  if to_regclass('public.tenant_modules') is not null then
    select count(*)::int into v_packs_installed
    from public.tenant_modules tm
    where tm.company_id = v_company_id and tm.status in ('enabled', 'trial', 'beta');
  end if;

  if to_regclass('public.aipify_actions') is not null then
    select count(*)::int into v_tasks_completed
    from public.aipify_actions a
    where a.tenant_id = v_company_id
      and a.status = 'executed'
      and a.executed_at > now() - interval '7 days';
  end if;

  v_health := greatest(25, least(98,
    100
    - v_pending_approvals * 4
    - v_critical_support * 8
    - v_blocked_actions * 6
    - case when v_billing_issue then 15 else 0 end
    - case when v_unread_notifications > 10 then 5 else 0 end
  ));

  v_trend := case
    when v_pending_approvals + v_critical_support + v_blocked_actions = 0 then 'improving'
    when v_pending_approvals + v_critical_support > 3 then 'declining'
    else 'stable'
  end;

  v_factors := jsonb_build_array(
    jsonb_build_object('key', 'support_backlog', 'label', 'Support backlog', 'value', v_critical_support, 'status', case when v_critical_support > 0 then 'warning' else 'healthy' end),
    jsonb_build_object('key', 'pending_approvals', 'label', 'Pending approvals', 'value', v_pending_approvals, 'status', case when v_pending_approvals > 3 then 'warning' when v_pending_approvals > 0 then 'monitor' else 'healthy' end),
    jsonb_build_object('key', 'operational_delays', 'label', 'Operational delays', 'value', v_blocked_actions, 'status', case when v_blocked_actions > 0 then 'warning' else 'healthy' end),
    jsonb_build_object('key', 'billing', 'label', 'Billing status', 'value', v_sub_status, 'status', case when v_billing_issue then 'critical' else 'healthy' end),
    jsonb_build_object('key', 'notifications', 'label', 'Unread notifications', 'value', v_unread_notifications, 'status', case when v_unread_notifications > 10 then 'warning' else 'healthy' end)
  );

  if v_pending_approvals > 0 then
    v_priorities := v_priorities || jsonb_build_object(
      'id', 'review-approvals',
      'title', format('Review %s pending approval%s', v_pending_approvals, case when v_pending_approvals = 1 then '' else 's' end),
      'href', '/app/approvals',
      'kind', 'approval'
    );
    v_priority_count := v_priority_count + 1;
  end if;

  if v_critical_support > 0 and v_priority_count < 5 then
    v_priorities := v_priorities || jsonb_build_object(
      'id', 'resolve-support',
      'title', format('Resolve %s critical support case%s', v_critical_support, case when v_critical_support = 1 then '' else 's' end),
      'href', '/app/support',
      'kind', 'support'
    );
    v_priority_count := v_priority_count + 1;
  end if;

  if v_integrations = 0 and v_priority_count < 5 then
    v_priorities := v_priorities || jsonb_build_object(
      'id', 'connect-integration',
      'title', 'Complete integration setup',
      'href', '/app/platform/integrations/connect',
      'kind', 'integration'
    );
    v_priority_count := v_priority_count + 1;
  end if;

  if v_blocked_actions > 0 and v_priority_count < 5 then
    v_priorities := v_priorities || jsonb_build_object(
      'id', 'unblock-actions',
      'title', format('Assign owner to %s blocked task%s', v_blocked_actions, case when v_blocked_actions = 1 then '' else 's' end),
      'href', '/app/action-center',
      'kind', 'task'
    );
    v_priority_count := v_priority_count + 1;
  end if;

  if v_billing_issue and v_priority_count < 5 then
    v_priorities := v_priorities || jsonb_build_object(
      'id', 'billing-review',
      'title', 'Review billing and subscription status',
      'href', '/app/billing/subscription',
      'kind', 'billing'
    );
    v_priority_count := v_priority_count + 1;
  end if;

  if exists (select 1 from pg_proc where proname = 'get_since_last_login_engine') then
    begin
      v_since_last_login := public.get_since_last_login_engine('customer', false);
    exception when others then
      v_since_last_login := jsonb_build_object(
        'new_team_members', v_team_new,
        'integrations_connected', v_integrations,
        'business_packs_installed', v_packs_installed,
        'tasks_completed', v_tasks_completed,
        'major_events', '[]'::jsonb,
        'billing_events', case when v_billing_issue then jsonb_build_array('Subscription requires attention') else '[]'::jsonb end
      );
    end;
  else
    v_since_last_login := jsonb_build_object(
      'new_team_members', v_team_new,
      'integrations_connected', v_integrations,
      'business_packs_installed', v_packs_installed,
      'tasks_completed', v_tasks_completed,
      'major_events', '[]'::jsonb,
      'billing_events', case when v_billing_issue then jsonb_build_array('Subscription requires attention') else '[]'::jsonb end
    );
  end if;

  if v_tasks_completed > 0 then
    v_opportunities := v_opportunities || jsonb_build_object(
      'id', 'tasks-completed',
      'title', format('%s task%s completed this week', v_tasks_completed, case when v_tasks_completed = 1 then '' else 's' end),
      'detail', 'Operational momentum is positive',
      'severity', 'low'
    );
  end if;

  if v_integrations > 0 then
    v_opportunities := v_opportunities || jsonb_build_object(
      'id', 'integrations-active',
      'title', format('%s integration%s connected', v_integrations, case when v_integrations = 1 then '' else 's' end),
      'detail', 'Systems are connected and operational',
      'severity', 'low'
    );
  end if;

  if v_health >= 75 and v_trend in ('stable', 'improving') then
    v_opportunities := v_opportunities || jsonb_build_object(
      'id', 'org-health',
      'title', 'Organization health is strong',
      'detail', 'Continue current operational practices',
      'severity', 'low'
    );
  end if;

  if v_pending_approvals > 2 then
    v_risks := v_risks || jsonb_build_object(
      'id', 'approval-backlog',
      'title', 'Approvals accumulating',
      'detail', format('%s decisions awaiting review', v_pending_approvals),
      'severity', case when v_pending_approvals > 5 then 'high' when v_pending_approvals > 3 then 'medium' else 'low' end
    );
  end if;

  if v_billing_issue then
    v_risks := v_risks || jsonb_build_object(
      'id', 'billing-risk',
      'title', 'Billing requires attention',
      'detail', format('Subscription status: %s', v_sub_status),
      'severity', 'high'
    );
  end if;

  if v_blocked_actions > 0 then
    v_risks := v_risks || jsonb_build_object(
      'id', 'blocked-operations',
      'title', 'Operational delays detected',
      'detail', format('%s blocked execution item%s', v_blocked_actions, case when v_blocked_actions = 1 then '' else 's' end),
      'severity', case when v_blocked_actions > 2 then 'high' else 'medium' end
    );
  end if;

  if v_critical_support > 0 then
    v_risks := v_risks || jsonb_build_object(
      'id', 'support-critical',
      'title', 'Critical support cases open',
      'detail', format('%s case%s need executive awareness', v_critical_support, case when v_critical_support = 1 then '' else 's' end),
      'severity', 'high'
    );
  end if;

  v_recommendations := jsonb_build_array(
    jsonb_build_object(
      'id', 'team-review',
      'title', 'Schedule a team review',
      'why', 'Align on priorities and unblock decisions',
      'expected_impact', 'Faster resolution of pending items',
      'action', 'Open Command Center',
      'href', '/app/command-center'
    ),
    jsonb_build_object(
      'id', 'approval-delegation',
      'title', 'Enable approval delegation',
      'why', 'Reduce approval bottlenecks for routine decisions',
      'expected_impact', 'Lower pending approval count',
      'action', 'Review approval policies',
      'href', '/app/approvals'
    )
  );

  if v_packs_installed = 0 then
    v_recommendations := v_recommendations || jsonb_build_object(
      'id', 'install-pack',
      'title', 'Install Support Business Pack',
      'why', 'Expand operational capabilities for your team',
      'expected_impact', 'Improved support and workflow coverage',
      'action', 'Explore Business Packs',
      'href', '/app/business-packs/available'
    );
  end if;

  return jsonb_build_object(
    'found', true,
    'has_access', true,
    'principle', 'Executive Insights supports decision-making. Final decisions remain under human control.',
    'sparse_data', (v_pending_approvals + v_critical_support + v_blocked_actions + v_packs_installed + v_integrations) = 0,
    'health', jsonb_build_object(
      'score', v_health,
      'trend', v_trend,
      'status', public._apei267_health_band(v_health),
      'status_label', initcap(replace(public._apei267_health_band(v_health), '_', ' ')),
      'factors', v_factors
    ),
    'priorities', v_priorities,
    'since_last_login', v_since_last_login,
    'opportunities', v_opportunities,
    'risks', v_risks,
    'recommendations', v_recommendations
  );
exception when others then
  return jsonb_build_object(
    'found', false,
    'has_access', false,
    'error', sqlerrm
  );
end;
$$;

revoke all on function public._apei267_require_executive_access() from public, anon;
revoke all on function public.get_app_portal_executive_insights() from public, anon;
grant execute on function public.get_app_portal_executive_insights() to authenticated;
