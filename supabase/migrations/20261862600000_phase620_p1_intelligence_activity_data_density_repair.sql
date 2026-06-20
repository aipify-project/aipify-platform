-- Phase 620 P1 — Intelligence, Activity, Recommendations & Support data-density repair.
-- Root causes: GET provisioning INSERTs, legacy company_id on tenant_modules/action_requests/presence_notifications,
-- missing _aore298_compute_scores(jsonb,jsonb,boolean) overload, Customer Health GREATEST type mismatch,
-- since-last-login legacy engine audit INSERT on read.

-- ---------------------------------------------------------------------------
-- 1. Shared tenant resolver
-- ---------------------------------------------------------------------------
create or replace function public._ap620_customer_id_for_company(p_company_id uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select c.id from public.customers c where c.company_id = p_company_id limit 1;
$$;

-- ---------------------------------------------------------------------------
-- 2. Legacy tm.company_id — Business Pack recommendation org context
-- ---------------------------------------------------------------------------
create or replace function public._abpre302_org_context(p_company_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_team_count integer := 0;
  v_packs integer := 0;
  v_installed jsonb := '[]'::jsonb;
  v_integrations integer := 0;
  v_operations integer := 0;
  v_maturity integer := 40;
  v_customer_id uuid;
begin
  v_customer_id := public._ap620_customer_id_for_company(p_company_id);

  select count(*)::int into v_team_count from public.users u where u.company_id = p_company_id;

  if to_regclass('public.tenant_modules') is not null and v_customer_id is not null then
    select count(*)::int,
           coalesce(jsonb_agg(tm.module_key), '[]'::jsonb)
    into v_packs, v_installed
    from public.tenant_modules tm
    where tm.tenant_id = v_customer_id and tm.status in ('enabled', 'trial', 'beta');
  end if;

  if to_regclass('public.app_portal_integration_connections') is not null then
    select count(*) filter (where ic.status = 'connected')::int into v_integrations
    from public.app_portal_integration_connections ic where ic.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_commitments') is not null then
    v_operations := v_operations + (select count(*)::int from public.app_portal_commitments where company_id = p_company_id);
  end if;

  v_maturity := least(100, 20 + v_packs * 12 + v_team_count * 3 + v_integrations * 8 + v_operations);

  return jsonb_build_object(
    'team_count', v_team_count,
    'packs_installed', v_packs,
    'installed_keys', v_installed,
    'integrations', v_integrations,
    'maturity_score', v_maturity
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Legacy tm.company_id / ar.company_id — Success Center
create or replace function public.get_app_portal_success_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_customer_id uuid;
  v_org_name text;
  v_team_count integer := 0;
  v_active_users integer := 0;
  v_packs integer := 0;
  v_integrations integer := 0;
  v_open_support integer := 0;
  v_pending_approvals integer := 0;
  v_open_follow_ups integer := 0;
  v_health integer := 65;
  v_adoption integer := 60;
  v_engagement integer := 55;
  v_utilization integer := 50;
  v_open_issues integer := 0;
  v_recommendations jsonb;
  v_timeline jsonb := '[]'::jsonb;
  v_growth jsonb := '[]'::jsonb;
  v_adoption_insights jsonb := '[]'::jsonb;
  v_factors jsonb := '[]'::jsonb;
  v_has_activity boolean := false;
  v_org_created timestamptz;
begin
  if not public.has_organization_permission('success.view') then
    raise exception 'Permission denied: success.view';
  end if;

  v_access := public._apsc273_require_success_access();
  v_company_id := (v_access->>'company_id')::uuid;
  v_customer_id := public._ap620_customer_id_for_company(v_company_id);
  select c.name, c.created_at into v_org_name, v_org_created from public.companies c where c.id = v_company_id;

  select count(*)::int,
         count(*) filter (
           where u.last_login_at is not null
             and u.last_login_at > now() - interval '14 days'
         )::int
  into v_team_count, v_active_users
  from public.users u
  where u.company_id = v_company_id;

  if to_regclass('public.tenant_modules') is not null and v_customer_id is not null then
    select count(*)::int into v_packs
    from public.tenant_modules tm
    where tm.tenant_id = v_customer_id and tm.status in ('enabled', 'trial', 'beta');
  end if;

  if to_regclass('public.app_portal_integration_connections') is not null then
    select count(*)::int into v_integrations
    from public.app_portal_integration_connections ic
    where ic.company_id = v_company_id and ic.status = 'connected';
  end if;

  if to_regclass('public.app_portal_support_requests') is not null then
    select count(*)::int into v_open_support
    from public.app_portal_support_requests sr
    where sr.company_id = v_company_id and sr.status not in ('resolved', 'closed');
  end if;

  if to_regclass('public.action_requests') is not null and v_customer_id is not null then
    select count(*)::int into v_pending_approvals
    from public.action_requests ar
    where ar.tenant_id = v_customer_id and ar.status = 'pending';
  end if;

  if to_regclass('public.app_portal_follow_ups') is not null then
    select count(*)::int into v_open_follow_ups
    from public.app_portal_follow_ups f
    where f.company_id = v_company_id and f.status not in ('completed', 'cancelled');
  end if;

  v_open_issues := v_open_support + v_pending_approvals + v_open_follow_ups;

  v_adoption := least(100, greatest(20, 30 + v_packs * 12 + v_integrations * 10 + case when v_team_count > 1 then 15 else 0 end));
  v_engagement := least(100, greatest(15, 25 + v_active_users * 8 + case when v_team_count >= 3 then 20 else v_team_count * 5 end));
  v_utilization := least(100, greatest(10, 20 + v_packs * 10 + v_integrations * 8 + case when v_open_follow_ups = 0 then 15 else 0 end));
  v_health := least(100, greatest(0, round((v_adoption + v_engagement + v_utilization) / 3.0)::integer
    - v_open_support * 3 - v_pending_approvals * 2 - greatest(0, v_open_follow_ups - 2) * 2));

  v_has_activity := v_team_count > 1 or v_packs > 0 or v_integrations > 0 or v_active_users > 0;

  v_factors := jsonb_build_array(
    jsonb_build_object('key', 'active_users', 'value', v_active_users, 'weight', 'high'),
    jsonb_build_object('key', 'team_size', 'value', v_team_count, 'weight', 'medium'),
    jsonb_build_object('key', 'business_packs', 'value', v_packs, 'weight', 'high'),
    jsonb_build_object('key', 'integrations', 'value', v_integrations, 'weight', 'medium'),
    jsonb_build_object('key', 'open_support', 'value', v_open_support, 'weight', 'medium'),
    jsonb_build_object('key', 'pending_approvals', 'value', v_pending_approvals, 'weight', 'low'),
    jsonb_build_object('key', 'open_follow_ups', 'value', v_open_follow_ups, 'weight', 'low')
  );

  v_recommendations := public._apsc273_build_recommendations(
    v_team_count, v_packs, v_integrations, v_open_support, v_pending_approvals, v_open_follow_ups
  );

  v_timeline := jsonb_build_array(jsonb_build_object(
    'id', 'org-created', 'type', 'organization_created', 'title', 'Organization created',
    'description', coalesce(v_org_name, 'Organization'), 'occurred_at', v_org_created
  ));

  if v_team_count > 1 then
    v_timeline := v_timeline || jsonb_build_object(
      'id', 'team-growth', 'type', 'team_growth', 'title', 'Team growth',
      'description', format('%s team members active', v_team_count), 'occurred_at', now()
    );
  end if;

  if v_packs > 0 then
    v_timeline := v_timeline || jsonb_build_object(
      'id', 'packs-installed', 'type', 'business_pack_installed', 'title', 'Business Packs installed',
      'description', format('%s Business Pack(s) active', v_packs), 'occurred_at', now()
    );
  end if;

  if v_integrations > 0 then
    v_timeline := v_timeline || jsonb_build_object(
      'id', 'integrations-connected', 'type', 'integration_connected', 'title', 'Integrations connected',
      'description', format('%s integration(s) connected', v_integrations), 'occurred_at', now()
    );
  end if;

  v_timeline := v_timeline || jsonb_build_object(
    'id', 'health-snapshot', 'type', 'health_score_change', 'title', 'Health score snapshot',
    'description', format('Current health score: %s', v_health), 'occurred_at', now()
  );

  v_growth := jsonb_build_array(
    jsonb_build_object('key', 'team_expansion', 'available', v_team_count < 5),
    jsonb_build_object('key', 'business_packs', 'available', v_packs < 3),
    jsonb_build_object('key', 'integrations', 'available', v_integrations < 2),
    jsonb_build_object('key', 'plan_upgrade', 'available', v_health >= 70 and v_packs >= 1)
  );

  v_adoption_insights := jsonb_build_array(
    jsonb_build_object('key', 'active_users', 'label_key', 'activeUsers', 'value', v_active_users),
    jsonb_build_object('key', 'packs_used', 'label_key', 'packsUsed', 'value', v_packs),
    jsonb_build_object('key', 'integrations_used', 'label_key', 'integrationsUsed', 'value', v_integrations),
    jsonb_build_object('key', 'unused_capabilities', 'label_key', 'unusedCapabilities', 'value', greatest(0, 3 - v_packs))
  );

  return jsonb_build_object(
    'found', true,
    'has_activity', v_has_activity,
    'organization_name', coalesce(v_org_name, 'Organization'),
    'overview', jsonb_build_object(
      'customer_health_score', v_health,
      'adoption_score', v_adoption,
      'team_engagement_score', v_engagement,
      'feature_utilization_score', v_utilization,
      'health_status', public._apsc273_health_status(v_health),
      'risk_level', public._apsc273_risk_level(v_health, v_open_issues)
    ),
    'health_factors', v_factors,
    'recommendations', v_recommendations,
    'timeline', v_timeline,
    'growth_opportunities', v_growth,
    'adoption_insights', v_adoption_insights,
    'principle', 'Aipify provides advisory success insights to help your organization grow — final decisions always remain with people.'
  );
end;
$$;


-- 4. Legacy ar.company_id — responsibility owner detail
-- ---------------------------------------------------------------------------
create or replace function public.get_app_portal_responsibility_owner(p_user_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_customer_id uuid;
  v_owned jsonb := '[]'::jsonb;
  v_backup jsonb := '[]'::jsonb;
  v_follow_ups jsonb := '[]'::jsonb;
  v_goals jsonb := '[]'::jsonb;
  v_approvals integer := 0;
  v_support integer := 0;
  v_total integer := 0;
  v_workload text := 'balanced';
begin
  v_ctx := public._apresp277_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_customer_id := public._ap620_customer_id_for_company(v_company_id);

  if p_user_id is null then
    raise exception 'User not found';
  end if;

  if coalesce(v_ctx->>'can_manage', 'false') <> 'true'
     and (v_ctx->>'user_id')::uuid <> p_user_id
  then
    raise exception 'Owner detail access denied';
  end if;

  select coalesce(jsonb_agg(public._apresp277_row(r)), '[]'::jsonb) into v_owned
  from public.app_portal_responsibilities r
  where r.company_id = v_company_id and r.primary_owner_id = p_user_id;

  select coalesce(jsonb_agg(public._apresp277_row(r)), '[]'::jsonb) into v_backup
  from public.app_portal_responsibilities r
  where r.company_id = v_company_id and r.backup_owner_id = p_user_id;

  if to_regclass('public.app_portal_follow_ups') is not null then
    select coalesce(jsonb_agg(jsonb_build_object('id', f.id, 'title', f.title, 'status', f.status)), '[]'::jsonb)
    into v_follow_ups
    from public.app_portal_follow_ups f
    where f.company_id = v_company_id and f.assigned_owner_id = p_user_id
      and f.status not in ('completed', 'cancelled');
  end if;

  if to_regclass('public.app_portal_goals') is not null then
    select coalesce(jsonb_agg(jsonb_build_object('id', g.id, 'title', g.title, 'status', g.status)), '[]'::jsonb)
    into v_goals
    from public.app_portal_goals g
    where g.company_id = v_company_id and g.owner_id = p_user_id
      and g.status not in ('achieved', 'cancelled');
  end if;

  if to_regclass('public.action_requests') is not null and v_customer_id is not null then
    select count(*)::int into v_approvals
    from public.action_requests ar
    where ar.tenant_id = v_customer_id and ar.status = 'pending';
  end if;

  if to_regclass('public.app_portal_support_requests') is not null then
    select count(*)::int into v_support
    from public.app_portal_support_requests sr
    where sr.company_id = v_company_id and sr.created_by = p_user_id
      and sr.status not in ('resolved', 'closed');
  end if;

  v_total := jsonb_array_length(v_owned) + jsonb_array_length(v_backup) + jsonb_array_length(v_follow_ups) + jsonb_array_length(v_goals) + v_approvals + v_support;
  if v_total >= 8 then v_workload := 'high';
  elsif v_total >= 4 then v_workload := 'moderate';
  end if;

  return jsonb_build_object(
    'found', true,
    'user_id', p_user_id,
    'user_name', public._apresp277_user_name(p_user_id),
    'owned_responsibilities', v_owned,
    'backup_responsibilities', v_backup,
    'assigned_follow_ups', v_follow_ups,
    'assigned_goals', v_goals,
    'pending_approvals', v_approvals,
    'open_support_requests', v_support,
    'workload_indicator', v_workload,
    'workload_total', v_total
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. Legacy pn.company_id — Executive Insights (presence_notifications.tenant_id)
-- ---------------------------------------------------------------------------
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
  v_customer_id uuid;
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
  v_customer_id := public._ap620_customer_id_for_company(v_company_id);

  if to_regclass('public.action_requests') is not null and v_customer_id is not null then
    select count(*)::int into v_pending_approvals
    from public.action_requests ar
    where ar.tenant_id = v_customer_id and ar.status = 'pending';
  end if;

  if to_regclass('public.support_cases') is not null and v_customer_id is not null then
    select count(*)::int into v_critical_support
    from public.support_cases sc
    where sc.tenant_id = v_customer_id
      and sc.status not in ('resolved', 'closed')
      and sc.risk_level in ('high', 'critical');
  end if;

  if to_regclass('public.aipify_actions') is not null and v_customer_id is not null then
    select count(*)::int into v_blocked_actions
    from public.aipify_actions a
    where a.tenant_id = v_customer_id and a.status = 'blocked';
  end if;

  if to_regclass('public.presence_notifications') is not null and v_customer_id is not null then
    select count(*)::int into v_unread_notifications
    from public.presence_notifications pn
    where pn.tenant_id = v_customer_id and pn.read_at is null;
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

  if to_regclass('public.tenant_modules') is not null and v_customer_id is not null then
    select count(*)::int into v_packs_installed
    from public.tenant_modules tm
    where tm.tenant_id = v_customer_id and tm.status in ('enabled', 'trial', 'beta');
  end if;

  if to_regclass('public.aipify_actions') is not null and v_customer_id is not null then
    select count(*)::int into v_tasks_completed
    from public.aipify_actions a
    where a.tenant_id = v_customer_id
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

  -- Read-only GET: do not call get_since_last_login_engine (writes generation audit rows).

  return jsonb_build_object(
    'found', true,
    'has_access', true,
    'health_score', v_health,
    'health_trend', v_trend,
    'health_factors', v_factors,
    'priorities', v_priorities,
    'opportunities', v_opportunities,
    'risks', v_risks,
    'recommendations', v_recommendations,
    'since_last_login', v_since_last_login,
    'principle', 'Executive insights prepare awareness — leaders remain accountable for decisions.'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. Customer Health — GREATEST integer/text mismatch
-- ---------------------------------------------------------------------------
create or replace function public.list_app_portal_customer_health(
  p_category text default null,
  p_period_from date default null,
  p_department text default null,
  p_priority text default null,
  p_trend text default null,
  p_recommendation_status text default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_started timestamptz;
  v_prior_overall integer;
  v_metrics jsonb;
  v_scores jsonb;
  v_overall integer;
  v_status text;
  v_trend text;
  v_recs jsonb;
  v_open_recs integer;
  v_indicators jsonb;
  v_engagement jsonb;
  v_support jsonb;
  v_personal jsonb := '[]'::jsonb;
  v_team_count integer := 0;
begin
  v_ctx := public._achrc296_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  select hs.review_started_at, hs.last_overall_score
  into v_started, v_prior_overall
  from public.app_portal_customer_health_state hs where hs.company_id = v_company_id;

  v_metrics := public._achrc296_org_metrics(v_company_id);
  v_team_count := coalesce((v_metrics->>'team_count')::int, 0);
  v_scores := public._achrc296_compute_scores(v_metrics, v_started is not null);
  v_overall := (v_scores->>'overall_health_score')::int;
  v_status := public._achrc296_health_status(v_overall);
  v_trend := public._achrc296_trend(v_overall, v_prior_overall, v_started is not null);

  if p_trend is not null and v_trend <> p_trend then
    return jsonb_build_object('found', true, 'filtered_out', true, 'review_started', v_started is not null);
  end if;

  v_recs := public._achrc296_build_recommendations(v_metrics);
  if p_priority is not null or p_category is not null or (p_search is not null and trim(p_search) <> '') then
    select coalesce(jsonb_agg(r), '[]'::jsonb) into v_recs from (
      select r from jsonb_array_elements(v_recs) r
      where (p_priority is null or r->>'priority' = p_priority)
        and (p_category is null or r->>'category' = p_category)
        and (p_search is null or trim(p_search) = '' or r->>'key' ilike '%' || trim(p_search) || '%')
    ) sub;
  end if;
  v_open_recs := jsonb_array_length(v_recs);

  v_indicators := jsonb_build_object(
    'platform_engagement', (v_scores->>'engagement_score')::int,
    'training_participation', least(100, round(((v_metrics->>'academy_completions')::numeric / greatest(1, v_team_count)) * 20)::int),
    'support_interactions', (v_metrics->>'support_open')::int + (v_metrics->>'support_resolved')::int,
    'adoption_progress', (v_scores->>'adoption_score')::int,
    'security_completion', case when v_team_count > 0
      then round(((v_metrics->>'two_fa_count')::numeric / v_team_count) * 100)::int else 0 end,
    'integration_activity', (v_metrics->>'connected_integrations')::int,
    'recommendation_completion', 0
  );

  v_engagement := jsonb_build_object(
    'active_teams', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select 'Operations' as x where (v_metrics->>'operations_records')::int > 0
        union all select 'Learning' where (v_metrics->>'academy_completions')::int > 0
        union all select 'Support' where (v_metrics->>'support_resolved')::int > 0
      ) s
    ),
    'departments_requiring_support', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select 'Security adoption' as x where (v_metrics->>'two_fa_count')::int < v_team_count
        union all select 'Training completion' where (v_metrics->>'academy_assignments_open')::int > 0
      ) s
    ),
    'underutilized_capabilities', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select 'Business Packs' as x where (v_metrics->>'packs')::int = 0
        union all select 'Integrations' where (v_metrics->>'connected_integrations')::int = 0
        union all select 'Knowledge Center self-service' where (v_metrics->>'assistant_sessions')::int = 0
      ) s
    ),
    'positive_momentum', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select 'Certifications earned' as x where (v_metrics->>'academy_certifications')::int > 0
        union all select 'Support requests resolved' where (v_metrics->>'support_resolved')::int > 0
      ) s
    ),
    'declining_activity', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select 'Open support backlog' as x where (v_metrics->>'support_open')::int > 2
      ) s
    )
  );

  v_support := jsonb_build_object(
    'open_requests', (v_metrics->>'support_open')::int,
    'resolved_requests', (v_metrics->>'support_resolved')::int,
    'resolution_trend', case when (v_metrics->>'support_resolved')::int > (v_metrics->>'support_open')::int then 'improving' else 'stable' end,
    'satisfaction_indicator', (v_scores->>'support_satisfaction_score')::int,
    'self_service_sessions', (v_metrics->>'assistant_sessions')::int,
    'knowledge_engagement', (v_metrics->>'academy_completions')::int
  );

  if to_regclass('public.app_portal_academy_assignments') is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', a.id, 'title', a.course_title, 'status', a.status, 'due_date', a.due_date
    )), '[]'::jsonb) into v_personal
    from public.app_portal_academy_assignments a
    where a.company_id = v_company_id and a.assignee_user_id = v_user_id and a.status <> 'completed';
  end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_admin', coalesce(v_ctx->>'can_admin', 'false') = 'true',
    'review_started', v_started is not null,
    'overall_health_score', v_overall,
    'engagement_score', (v_scores->>'engagement_score')::int,
    'support_satisfaction_score', (v_scores->>'support_satisfaction_score')::int,
    'adoption_score', (v_scores->>'adoption_score')::int,
    'learning_completion_score', (v_scores->>'learning_completion_score')::int,
    'health_status', v_status,
    'relationship_trend', v_trend,
    'open_recommendations_count', v_open_recs,
    'health_indicators', v_indicators,
    'engagement_insights', v_engagement,
    'support_insights', v_support,
    'recommendations', v_recs,
    'personal_recommendations', v_personal,
    'department_reporting', case when coalesce(v_ctx->>'can_manage', 'false') = 'true' then jsonb_build_object(
      'department', coalesce(nullif(trim(p_department), ''), 'organization'),
      'engagement_score', (v_scores->>'engagement_score')::int,
      'learning_participation', (v_indicators->>'training_participation')::int
    ) else null end,
    'principle', 'Health indicators provide guidance — they are not judgments. Aipify remains a trusted long-term companion.'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. Missing _aore298_compute_scores(jsonb, jsonb, boolean) compatibility wrapper
-- ---------------------------------------------------------------------------
create or replace function public._aore298_compute_scores(
  p_metrics jsonb,
  p_areas jsonb,
  p_review_started boolean
)
returns jsonb
language plpgsql
immutable
as $$
begin
  return public._aore298_compute_scores(p_metrics, p_review_started);
end;
$$;

-- ---------------------------------------------------------------------------
-- 8. Since Last Login — remove legacy engine write path from read builder
-- ---------------------------------------------------------------------------
create or replace function public._aact538_build_since_last_login(
  p_org_id uuid, p_user_id uuid, p_touch_login boolean default true
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_since timestamptz;
  v_lines jsonb := '[]'::jsonb;
  v_changes jsonb := '[]'::jsonb;
  v_risks jsonb := '[]'::jsonb;
  v_opportunities jsonb := '[]'::jsonb;
  v_actions jsonb := '[]'::jsonb;
  v_new_customers int := 0;
  v_tasks_completed int := 0;
  v_pending_approvals int := 0;
  v_critical int := 0;
  v_events_since int := 0;
  v_headline text;
  v_companion text;
begin
  v_since := public._aact538_since_boundary(p_org_id, p_user_id);

  select count(*) into v_events_since
  from public.organization_activity_operations_events
  where organization_id = p_org_id and occurred_at >= v_since;

  select count(*) into v_new_customers
  from public.organization_activity_operations_events
  where organization_id = p_org_id and category = 'customer_activity' and occurred_at >= v_since;

  select count(*) into v_tasks_completed
  from public.organization_activity_operations_events
  where organization_id = p_org_id and category = 'project_activity' and priority = 'completed' and occurred_at >= v_since;

  select count(*) into v_pending_approvals
  from public.organization_activity_operations_events
  where organization_id = p_org_id and category = 'approval_activity' and priority = 'pending';

  select count(*) into v_critical
  from public.organization_activity_operations_events
  where organization_id = p_org_id and priority in ('critical', 'security') and occurred_at >= v_since;

  v_lines := jsonb_build_array(
    jsonb_build_object('text', v_new_customers || ' new customer records since your last visit', 'priority', 'information'),
    jsonb_build_object('text', v_tasks_completed || ' tasks completed', 'priority', 'completed'),
    jsonb_build_object('text', v_pending_approvals || ' approvals waiting', 'priority', case when v_pending_approvals > 0 then 'attention_required' else 'information' end),
    jsonb_build_object('text', v_events_since || ' organization events recorded', 'priority', 'information'),
    jsonb_build_object('text', case when v_critical = 0 then 'No critical incidents detected' else v_critical || ' critical items require attention' end,
      'priority', case when v_critical > 0 then 'critical' else 'completed' end)
  );

  v_changes := coalesce((
    select jsonb_agg(public._aact538_event_json(e) order by e.occurred_at desc)
    from (
      select * from public.organization_activity_operations_events
      where organization_id = p_org_id and occurred_at >= v_since
      order by occurred_at desc limit 6
    ) e
  ), '[]'::jsonb);

  v_risks := coalesce((
    select jsonb_agg(public._aact538_event_json(e) order by e.occurred_at desc)
    from (
      select * from public.organization_activity_operations_events
      where organization_id = p_org_id and priority in ('critical', 'attention_required', 'security')
      order by occurred_at desc limit 5
    ) e
  ), '[]'::jsonb);

  v_opportunities := coalesce((
    select jsonb_agg(public._aact538_event_json(e) order by e.occurred_at desc)
    from (
      select * from public.organization_activity_operations_events
      where organization_id = p_org_id and recommendation is not null and recommendation <> ''
      order by occurred_at desc limit 5
    ) e
  ), '[]'::jsonb);

  v_actions := coalesce((
    select jsonb_agg(jsonb_build_object('title', recommendation, 'href', record_href))
    from (
      select recommendation, record_href from public.organization_activity_operations_events
      where organization_id = p_org_id and recommendation is not null and recommendation <> ''
      order by occurred_at desc limit 4
    ) x
  ), '[]'::jsonb);

  v_headline := case
    when v_critical > 0 then v_critical || ' critical items need your attention since your last visit.'
    when v_pending_approvals > 0 then v_pending_approvals || ' approvals waiting — ' || v_events_since || ' events since your last visit.'
    else v_events_since || ' organization events since your last visit.'
  end;

  v_companion := 'Since your last visit: ' || v_headline;

  return jsonb_build_object(
    'since', v_since,
    'headline', v_headline,
    'summary_lines', v_lines,
    'top_changes', v_changes,
    'top_risks', v_risks,
    'top_opportunities', v_opportunities,
    'recommended_actions', v_actions,
    'companion_summary', v_companion,
    'stats', jsonb_build_object(
      'new_customers', v_new_customers,
      'tasks_completed', v_tasks_completed,
      'pending_approvals', v_pending_approvals,
      'events_since', v_events_since,
      'critical_items', v_critical
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 9. Activity Operations GET — read-only (no ensure/seed/log writes)
-- ---------------------------------------------------------------------------
-- _aebmi311_sync_dimensions
create or replace function public._aebmi311_sync_dimensions(p_company_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_dim jsonb;
  v_score integer;
  v_level integer;
begin
  if coalesce(current_setting('ap620.skip_intelligence_provisioning', true), '0') = '1' then
    return;
  end if;

  insert into public.app_portal_enterprise_benchmarking_state (company_id, updated_by)
  values (p_company_id, p_user_id)
  on conflict (company_id) do update set updated_at = now(), updated_by = p_user_id;

  for v_dim in select * from jsonb_array_elements(public._aebmi311_dimension_catalog())
  loop
    v_score := public._aebmi311_infer_dimension_score(p_company_id, v_dim->>'key');
    v_level := public._aebmi311_score_to_level(v_score);

    insert into public.app_portal_enterprise_benchmarking_dimensions (
      company_id, dimension_key, dimension_name, organizational_area, maturity_level, maturity_score,
      strengths, improvement_opportunities, recommended_actions, related_capabilities, learning_resources
    ) values (
      p_company_id, v_dim->>'key', v_dim->>'name', v_dim->>'area', v_level, v_score,
      case when v_score >= 60 then jsonb_build_array('Consistent practices observed') else '[]'::jsonb end,
      case when v_score < 60 then jsonb_build_array('Structured improvement pathway recommended') else '[]'::jsonb end,
      jsonb_build_array('Review maturity indicators periodically'),
      jsonb_build_array(v_dim->>'name'),
      jsonb_build_array('Knowledge Center maturity guidance')
    )
    on conflict (company_id, dimension_key) do update set
      dimension_name = excluded.dimension_name,
      organizational_area = excluded.organizational_area,
      maturity_score = public._aebmi311_infer_dimension_score(p_company_id, excluded.dimension_key),
      maturity_level = public._aebmi311_score_to_level(public._aebmi311_infer_dimension_score(p_company_id, excluded.dimension_key)),
      updated_at = now();
  end loop;
end;
$$;

-- _apoi312_sync_predictions
create or replace function public._apoi312_sync_predictions(p_company_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_item jsonb;
begin
  if coalesce(current_setting('ap620.skip_intelligence_provisioning', true), '0') = '1' then
    return;
  end if;

  for v_item in select jsonb_array_elements(public._apoi312_prediction_catalog())
  loop
    insert into public.app_portal_predictive_intelligence_predictions (
      company_id, prediction_key, title, category, summary, confidence_level, time_horizon,
      potential_impact, organizational_area, recommended_actions, related_areas
    ) values (
      p_company_id,
      v_item->>'key',
      v_item->>'title',
      v_item->>'category',
      v_item->>'summary',
      v_item->>'confidence',
      v_item->>'horizon',
      v_item->>'impact',
      v_item->>'area',
      jsonb_build_array('Review relevant indicators', 'Prepare leadership briefing', 'Monitor trend signals'),
      jsonb_build_array(v_item->>'area')
    )
    on conflict (company_id, prediction_key) do update set
      title = excluded.title,
      summary = excluded.summary,
      updated_at = now();
  end loop;

  insert into public.app_portal_predictive_intelligence_early_warnings (
    company_id, warning_key, title, signal_type, description, severity, organizational_area
  ) values
    (p_company_id, 'risk_signals', 'Risk signals detected', 'risk', 'Emerging risk indicators warrant proactive review.', 'moderate', 'risk'),
    (p_company_id, 'declining_engagement', 'Declining engagement trends', 'engagement', 'Participation patterns may indicate softening engagement.', 'moderate', 'learning'),
    (p_company_id, 'capacity_pressure', 'Capacity pressure indicators', 'capacity', 'Workload signals suggest potential capacity constraints.', 'high', 'operations'),
    (p_company_id, 'delayed_initiatives', 'Delayed initiative patterns', 'initiative', 'Initiative timelines may benefit from executive follow-up.', 'moderate', 'strategy'),
    (p_company_id, 'governance_backlog', 'Governance review backlogs', 'governance', 'Governance review cadence may require attention.', 'high', 'governance'),
    (p_company_id, 'operational_bottlenecks', 'Operational bottlenecks', 'operations', 'Process indicators suggest potential friction points.', 'moderate', 'operations')
  on conflict (company_id, warning_key) do nothing;

  if not exists (
    select 1 from public.app_portal_predictive_intelligence_timeline t
    where t.company_id = p_company_id and t.event_type = 'predictions_generated'
  ) then
    insert into public.app_portal_predictive_intelligence_timeline (
      company_id, event_type, description, performed_by
    ) values (
      p_company_id, 'predictions_generated', 'Predictive insights generated', p_user_id
    );
  end if;
end;
$$;

-- _aspsc313_sync_scenarios
create or replace function public._aspsc313_sync_scenarios(p_company_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_item jsonb;
begin
  if coalesce(current_setting('ap620.skip_intelligence_provisioning', true), '0') = '1' then
    return;
  end if;

  insert into public.app_portal_scenario_planning_state (company_id, updated_by)
  values (p_company_id, p_user_id)
  on conflict (company_id) do update set updated_at = now(), updated_by = p_user_id;

  for v_item in select jsonb_array_elements(public._aspsc313_scenario_catalog())
  loop
    insert into public.app_portal_scenario_planning_scenarios (
      company_id, scenario_key, title, category, scenario_type, summary,
      organizational_area, time_horizon, assumptions, variables, projected_outcomes
    ) values (
      p_company_id,
      v_item->>'key',
      v_item->>'title',
      v_item->>'category',
      v_item->>'type',
      v_item->>'summary',
      v_item->>'area',
      v_item->>'horizon',
      jsonb_build_array('Leadership retains decision authority', 'Inputs reflect current organizational context'),
      jsonb_build_array('Demand', 'Capacity', 'Strategic priorities', 'External conditions'),
      jsonb_build_array('Operational readiness', 'Resource implications', 'Risk exposure', 'Opportunity window')
    )
    on conflict (company_id, scenario_key) do update set
      title = excluded.title,
      summary = excluded.summary,
      updated_at = now();
  end loop;

  if not exists (
    select 1 from public.app_portal_scenario_planning_timeline t
    where t.company_id = p_company_id and t.event_type = 'scenarios_initialized'
  ) then
    insert into public.app_portal_scenario_planning_timeline (
      company_id, event_type, description, performed_by
    ) values (
      p_company_id, 'scenarios_initialized', 'Scenario planning workspace initialized', p_user_id
    );
  end if;
end;
$$;

-- _aefc314_sync_observations
create or replace function public._aefc314_sync_observations(p_company_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_item jsonb;
begin
  if coalesce(current_setting('ap620.skip_intelligence_provisioning', true), '0') = '1' then
    return;
  end if;

  insert into public.app_portal_executive_foresight_state (company_id, updated_by)
  values (p_company_id, p_user_id)
  on conflict (company_id) do update set updated_at = now(), updated_by = p_user_id;

  for v_item in select jsonb_array_elements(public._aefc314_observation_catalog())
  loop
    insert into public.app_portal_executive_foresight_observations (
      company_id, observation_key, title, category, insight_type, summary,
      strategic_priority, time_horizon, organizational_area, executive_owner, momentum_direction
    ) values (
      p_company_id,
      v_item->>'key',
      v_item->>'title',
      v_item->>'category',
      v_item->>'type',
      v_item->>'summary',
      v_item->>'priority',
      v_item->>'horizon',
      v_item->>'area',
      v_item->>'owner',
      v_item->>'momentum'
    )
    on conflict (company_id, observation_key) do update set
      title = excluded.title,
      summary = excluded.summary,
      updated_at = now();
  end loop;

  if not exists (
    select 1 from public.app_portal_executive_foresight_timeline t
    where t.company_id = p_company_id and t.event_type = 'foresight_initialized'
  ) then
    insert into public.app_portal_executive_foresight_timeline (
      company_id, event_type, description, performed_by
    ) values (
      p_company_id, 'foresight_initialized', 'Executive foresight workspace initialized', p_user_id
    );
  end if;
end;
$$;

-- _asoi315_sync_opportunities
create or replace function public._asoi315_sync_opportunities(p_company_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_item jsonb;
begin
  if coalesce(current_setting('ap620.skip_intelligence_provisioning', true), '0') = '1' then
    return;
  end if;

  insert into public.app_portal_strategic_opportunities_state (company_id, updated_by)
  values (p_company_id, p_user_id)
  on conflict (company_id) do update set updated_at = now(), updated_by = p_user_id;

  for v_item in select jsonb_array_elements(public._asoi315_opportunity_catalog()) loop
    insert into public.app_portal_strategic_opportunities (
      company_id, opportunity_key, title, description, category, strategic_priority,
      estimated_impact, estimated_complexity, organizational_readiness,
      recommended_review_priority, leadership_owner, potential_value,
      estimated_effort, time_horizon,
      related_departments, suggested_next_steps, supporting_observations
    ) values (
      p_company_id,
      v_item->>'key', v_item->>'title', v_item->>'summary',
      v_item->>'category', v_item->>'priority',
      v_item->>'impact', v_item->>'complexity', v_item->>'readiness',
      'normal', v_item->>'owner', v_item->>'value', v_item->>'effort',
      v_item->>'horizon',
      jsonb_build_array('Leadership','Operations','Finance'),
      jsonb_build_array(
        'Schedule exploratory workshop',
        'Assign executive sponsor',
        'Gather supporting data'),
      jsonb_build_array()
    )
    on conflict (company_id, opportunity_key) do update set
      title = excluded.title, description = excluded.description,
      updated_at = now();
  end loop;

  if not exists (
    select 1 from public.app_portal_strategic_opportunity_timeline t
    where t.company_id = p_company_id and t.event_type = 'opportunities_initialized') then
    insert into public.app_portal_strategic_opportunity_timeline
      (company_id, event_type, description, performed_by)
    values (p_company_id, 'opportunities_initialized',
            'Strategic opportunities workspace initialized', p_user_id);
  end if;
end; $$;

-- _aofc316_sync_forecasts
create or replace function public._aofc316_sync_forecasts(p_company_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_item jsonb;
begin
  if coalesce(current_setting('ap620.skip_intelligence_provisioning', true), '0') = '1' then
    return;
  end if;

  insert into public.app_portal_org_forecasting_state (company_id, updated_by)
  values (p_company_id, p_user_id)
  on conflict (company_id) do update set updated_at = now(), updated_by = p_user_id;

  for v_item in select jsonb_array_elements(public._aofc316_forecast_catalog()) loop
    insert into public.app_portal_org_forecasts (
      company_id, forecast_key, title, description, category, forecast_area,
      current_state, projected_state_conservative, projected_state_expected,
      projected_state_optimistic, confidence_level, time_horizon,
      trend_direction, leadership_owner, recommended_action
    ) values (
      p_company_id,
      v_item->>'key', v_item->>'title', v_item->>'title',
      v_item->>'category', v_item->>'area',
      v_item->>'current',
      v_item->>'conservative',
      v_item->>'expected',
      v_item->>'optimistic',
      v_item->>'confidence',
      v_item->>'horizon',
      v_item->>'trend',
      v_item->>'owner',
      v_item->>'action'
    )
    on conflict (company_id, forecast_key) do update set
      title = excluded.title,
      updated_at = now();
  end loop;

  -- capacity snapshot
  insert into public.app_portal_org_forecasting_capacity
    (company_id, capacity_key, area, current_capacity, estimated_future_capacity,
     potential_bottlenecks, operational_constraints, requires_attention)
  values
    (p_company_id,'cap_people','Workforce',
     'Operating within current headcount targets.',
     'Moderate growth will require incremental headcount planning.',
     jsonb_build_array('Hiring timeline lag','Onboarding capacity'),
     jsonb_build_array('Recruitment lead time','Manager bandwidth'),
     true),
    (p_company_id,'cap_operations','Operations',
     'Processes running at moderate utilization.',
     'Growing volume will increase process complexity.',
     jsonb_build_array('Manual workflows','Cross-team handoffs'),
     jsonb_build_array('Tool limitations','Documentation gaps'),
     true),
    (p_company_id,'cap_support','Support',
     'Support team handling current ticket volumes.',
     'Customer growth will increase ticket volume.',
     jsonb_build_array('Agent capacity','Knowledge base coverage'),
     jsonb_build_array('Escalation paths','Response time SLAs'),
     true)
  on conflict (company_id, capacity_key) do nothing;

  if not exists (
    select 1 from public.app_portal_org_forecasting_timeline t
    where t.company_id = p_company_id and t.event_type = 'forecasting_initialized') then
    insert into public.app_portal_org_forecasting_timeline
      (company_id, event_type, description, performed_by)
    values (p_company_id,'forecasting_initialized',
            'Organizational forecasting workspace initialized', p_user_id);
  end if;
end; $$;

-- _aerc317_sync_assessments
create or replace function public._aerc317_sync_assessments(p_company_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_item jsonb; v_level text;
begin
  if coalesce(current_setting('ap620.skip_intelligence_provisioning', true), '0') = '1' then
    return;
  end if;

  insert into public.app_portal_enterprise_readiness_state (company_id, updated_by)
  values (p_company_id, p_user_id)
  on conflict (company_id) do update set updated_at = now(), updated_by = p_user_id;

  for v_item in select jsonb_array_elements(public._aerc317_assessment_catalog()) loop
    v_level := public._aerc317_score_to_level((v_item->>'score')::integer);
    insert into public.app_portal_enterprise_readiness_assessments (
      company_id, assessment_key, title, description, category,
      readiness_level, current_score, target_score, trend, priority,
      leadership_owner, department, recommended_action
    ) values (
      p_company_id,
      v_item->>'key', v_item->>'title', v_item->>'title',
      v_item->>'category', v_level,
      (v_item->>'score')::integer, (v_item->>'target')::integer,
      v_item->>'trend', v_item->>'priority',
      v_item->>'owner', v_item->>'dept', v_item->>'action'
    )
    on conflict (company_id, assessment_key) do update set
      title = excluded.title, updated_at = now();
  end loop;

  -- seed gaps for critical/high items
  insert into public.app_portal_enterprise_readiness_gaps
    (company_id, gap_key, title, description, impact_level, recommended_action, suggested_owner, review_timeline)
  values
    (p_company_id,'gap_security_controls','Security controls gap',
     'Security controls may require strengthening before scaling operations.',
     'critical','Conduct security controls review and remediate findings.','CTO','Within 90 days'),
    (p_company_id,'gap_governance_docs','Governance documentation gap',
     'Governance policies and procedures may not be fully documented.',
     'high','Document governance framework and review processes.','General Counsel','Within 6 months'),
    (p_company_id,'gap_knowledge_capture','Knowledge capture gap',
     'Critical knowledge may be concentrated in individuals rather than documented systems.',
     'moderate','Implement structured knowledge capture and documentation programme.','CHRO','Within 12 months'),
    (p_company_id,'gap_continuity_plans','Business continuity planning gap',
     'Business continuity plans may require development or testing.',
     'high','Develop, document and test business continuity plans.','COO','Within 6 months')
  on conflict (company_id, gap_key) do nothing;

  if not exists (
    select 1 from public.app_portal_enterprise_readiness_timeline t
    where t.company_id = p_company_id and t.event_type = 'readiness_initialized') then
    insert into public.app_portal_enterprise_readiness_timeline
      (company_id, event_type, description, performed_by)
    values (p_company_id,'readiness_initialized',
            'Enterprise readiness workspace initialized', p_user_id);
  end if;
end; $$;

-- _acfi318_sync_data
create or replace function public._acfi318_sync_data(p_company_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if coalesce(current_setting('ap620.skip_intelligence_provisioning', true), '0') = '1' then
    return;
  end if;

  insert into public.app_portal_cfi_state (company_id, updated_by)
  values (p_company_id, p_user_id)
  on conflict (company_id) do update set updated_at = now(), updated_by = p_user_id;

  -- dependencies
  insert into public.app_portal_cfi_dependencies
    (company_id, dependency_key, from_department, to_department, dependency_type,
     dependency_strength, risk_level, leadership_owner, description, recommended_review)
  values
    (p_company_id,'dep_sales_support','Sales','Support','operational','high','moderate',
     'CCO','Sales processes depend on Support team capacity for escalation handling and customer resolution.',
     'Review support capacity before scaling sales activity.'),
    (p_company_id,'dep_support_knowledge','Support','Knowledge Center','informational','high','moderate',
     'COO','Support quality depends on the completeness and accuracy of the Knowledge Center.',
     'Review knowledge coverage gaps before support volume increases.'),
    (p_company_id,'dep_ops_technology','Operations','Technology','resource','high','high',
     'COO','Core operational workflows depend on technology infrastructure and system availability.',
     'Ensure technology scaling plans align with operational growth expectations.'),
    (p_company_id,'dep_leadership_workforce','Leadership','Workforce','approval','moderate','moderate',
     'CHRO','Strategic decisions depend on workforce capacity and talent availability.',
     'Align leadership planning with workforce development roadmaps.'),
    (p_company_id,'dep_product_customer','Product','Customer Success','knowledge','moderate','low',
     'CTO','Product development benefits from structured customer feedback and success insights.',
     'Strengthen feedback loop between Customer Success and Product teams.'),
    (p_company_id,'dep_finance_ops','Finance','Operations','resource','high','moderate',
     'CFO','Operational plans are constrained by financial approval processes and budget cycles.',
     'Align operational planning with financial review cadence.')
  on conflict (company_id, dependency_key) do nothing;

  -- collaboration
  insert into public.app_portal_cfi_collaboration
    (company_id, collaboration_key, department_a, department_b, category,
     collaboration_type, health_status, description, improvement_opportunity,
     priority, leadership_owner)
  values
    (p_company_id,'col_ops_support','Operations','Support','operations_alignment',
     'strong','healthy','Operations and Support share structured processes and communication channels.',
     'Maintain regular cross-functional reviews to sustain alignment.','low','COO'),
    (p_company_id,'col_sales_product','Sales','Product','customer_journey_alignment',
     'emerging','stable','Collaboration between Sales and Product is developing but may lack formal structure.',
     'Introduce structured feedback sessions to improve product-market alignment.','moderate','CTO'),
    (p_company_id,'col_hr_leadership','Workforce','Leadership','leadership_collaboration',
     'strong','healthy','HR and Leadership maintain regular communication on workforce planning.',
     'Expand strategic workforce planning to include succession discussions.','low','CHRO'),
    (p_company_id,'col_knowledge_all','Knowledge Center','All Departments','knowledge_sharing',
     'weak','needs_attention','Knowledge sharing across departments may be inconsistent.',
     'Establish cross-departmental knowledge review routines.','high','COO'),
    (p_company_id,'col_finance_ops','Finance','Operations','process_coordination',
     'emerging','stable','Financial and operational planning cycles may not always be synchronized.',
     'Align budget and operational planning reviews for greater efficiency.','moderate','CFO'),
    (p_company_id,'col_support_sales','Support','Sales','sales_support_alignment',
     'emerging','stable','Customer escalation paths between Sales and Support may benefit from clearer structure.',
     'Define escalation ownership and communication protocols.','moderate','CCO')
  on conflict (company_id, collaboration_key) do nothing;

  -- friction
  insert into public.app_portal_cfi_friction
    (company_id, friction_key, title, friction_type, description,
     affected_departments, severity, recommended_action)
  values
    (p_company_id,'fr_knowledge_silos','Knowledge siloed in teams','knowledge_silo',
     'Critical knowledge is concentrated in individual teams and may not be consistently shared across the organization.',
     jsonb_build_array('Operations','Support','Product'),'high',
     'Implement structured knowledge capture and cross-team sharing routines.'),
    (p_company_id,'fr_escalation_overlap','Overlapping escalation paths','repeated_escalation',
     'Customer and operational escalations may travel through multiple teams before reaching the correct owner.',
     jsonb_build_array('Sales','Support','Operations'),'moderate',
     'Define clear escalation ownership and communication channels.'),
    (p_company_id,'fr_process_duplication','Duplicate process steps','duplicate_effort',
     'Similar processes may be running independently in multiple departments.',
     jsonb_build_array('Operations','Finance','Technology'),'moderate',
     'Audit cross-departmental processes to identify duplication and consolidation opportunities.'),
    (p_company_id,'fr_coordination_delay','Cross-team coordination delays','coordination_challenge',
     'Projects requiring input from multiple departments may experience delays due to unclear ownership or handoff processes.',
     jsonb_build_array('Leadership','Operations','Technology'),'high',
     'Introduce cross-functional project coordination protocols and ownership definitions.')
  on conflict (company_id, friction_key) do nothing;

  if not exists (
    select 1 from public.app_portal_cfi_timeline t
    where t.company_id = p_company_id and t.event_type = 'cfi_initialized') then
    insert into public.app_portal_cfi_timeline
      (company_id, event_type, description, performed_by)
    values (p_company_id,'cfi_initialized',
            'Cross-functional intelligence workspace initialized', p_user_id);
  end if;
end; $$;

-- _aeicc319_sync_priorities
create or replace function public._aeicc319_sync_priorities(p_company_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if coalesce(current_setting('ap620.skip_intelligence_provisioning', true), '0') = '1' then
    return;
  end if;

  insert into public.app_portal_eicc_state (company_id, updated_by)
  values (p_company_id, p_user_id)
  on conflict (company_id) do update set updated_at = now(), updated_by = p_user_id;

  -- from Predictive Intelligence
  if to_regclass('public.app_portal_predictive_intelligence_predictions') is not null then
    insert into public.app_portal_eicc_priorities
      (company_id, priority_key, title, source_module, priority_level, category,
       time_horizon, recommended_action)
    select
      p_company_id,
      'pred-'||p.prediction_key,
      p.title,
      'predictive_intelligence',
      case p.potential_impact when 'critical' then 'critical' when 'high' then 'high'
                              when 'moderate' then 'medium' else 'low' end,
      p.category,
      p.time_horizon,
      coalesce((p.recommended_actions->>0), 'Review this prediction with leadership.')
    from public.app_portal_predictive_intelligence_predictions p
    where p.company_id = p_company_id
      and p.potential_impact in ('high','critical')
      and p.review_status = 'pending'
    on conflict (company_id, priority_key) do nothing;
  end if;

  -- from Readiness Gaps
  if to_regclass('public.app_portal_enterprise_readiness_gaps') is not null then
    insert into public.app_portal_eicc_priorities
      (company_id, priority_key, title, source_module, priority_level, category,
       time_horizon, recommended_action)
    select
      p_company_id,
      'gap-'||g.gap_key,
      g.title,
      'enterprise_readiness',
      case g.impact_level when 'critical' then 'critical' when 'high' then 'high'
                          when 'moderate' then 'medium' else 'low' end,
      'readiness',
      '90_days',
      g.recommended_action
    from public.app_portal_enterprise_readiness_gaps g
    where g.company_id = p_company_id and g.status = 'identified'
    on conflict (company_id, priority_key) do nothing;
  end if;

  -- from CFI Friction
  if to_regclass('public.app_portal_cfi_friction') is not null then
    insert into public.app_portal_eicc_priorities
      (company_id, priority_key, title, source_module, priority_level, category,
       time_horizon, recommended_action)
    select
      p_company_id,
      'fr-'||f.friction_key,
      f.title,
      'cross_functional_intelligence',
      case f.severity when 'critical' then 'critical' when 'high' then 'high'
                      when 'moderate' then 'medium' else 'low' end,
      'cross_functional',
      '90_days',
      f.recommended_action
    from public.app_portal_cfi_friction f
    where f.company_id = p_company_id and f.status = 'identified'
    on conflict (company_id, priority_key) do nothing;
  end if;

  -- from Strategic Opportunities
  if to_regclass('public.app_portal_strategic_opportunities') is not null then
    insert into public.app_portal_eicc_priorities
      (company_id, priority_key, title, source_module, priority_level, category,
       time_horizon, recommended_action)
    select
      p_company_id,
      'opp-'||o.opportunity_key,
      o.title,
      'strategic_opportunities',
      case o.strategic_priority when 'strategic' then 'high' when 'high' then 'high'
                                when 'moderate' then 'medium' else 'low' end,
      o.category,
      o.time_horizon,
      coalesce((o.suggested_next_steps->>0), 'Schedule exploratory session.')
    from public.app_portal_strategic_opportunities o
    where o.company_id = p_company_id and o.status = 'identified'
      and o.strategic_priority in ('strategic','high')
    on conflict (company_id, priority_key) do nothing;
  end if;

  if not exists (
    select 1 from public.app_portal_eicc_timeline t
    where t.company_id = p_company_id and t.event_type = 'eicc_initialized') then
    insert into public.app_portal_eicc_timeline
      (company_id, event_type, source_module, description, performed_by)
    values (p_company_id,'eicc_initialized','command_center',
            'Intelligence Command Center initialized', p_user_id);
  end if;
end; $$;

-- _afs320_sync_plans
create or replace function public._afs320_sync_plans(p_company_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_item jsonb; v_plan_id uuid;
begin
  if coalesce(current_setting('ap620.skip_intelligence_provisioning', true), '0') = '1' then
    return;
  end if;

  insert into public.app_portal_future_state_state (company_id)
  values (p_company_id) on conflict (company_id) do nothing;

  for v_item in select * from jsonb_array_elements(public._afs320_plan_catalog()) loop
    insert into public.app_portal_future_state_plans (
      company_id, plan_key, title, description, category, status, time_horizon,
      current_state, desired_future_state, vision_statement,
      desired_outcomes, strategic_priorities, executive_sponsors, departments_involved,
      estimated_timeline, progress_score, alignment_score, completeness_score,
      executive_owner, department, strategic_priority
    ) values (
      p_company_id,
      v_item->>'key',
      v_item->>'title',
      'Aipify-assisted future-state plan — leadership defines direction and priorities.',
      v_item->>'category',
      'active',
      v_item->>'horizon',
      v_item->>'current',
      v_item->>'future',
      v_item->>'vision',
      v_item->'outcomes',
      v_item->'priorities',
      v_item->'sponsors',
      v_item->'departments',
      v_item->>'timeline',
      (v_item->>'progress')::integer,
      (v_item->>'alignment')::integer,
      (v_item->>'completeness')::integer,
      v_item->>'owner',
      v_item->>'dept',
      v_item->>'priority'
    ) on conflict (company_id, plan_key) do nothing
    returning id into v_plan_id;

    if v_plan_id is not null then
      insert into public.app_portal_future_state_milestones
        (company_id, plan_id, milestone_key, title, status, success_indicator, owner)
      values
        (p_company_id, v_plan_id, v_item->>'key'||'_m1', 'Vision alignment workshop', 'completed', 'Leadership consensus documented', v_item->>'owner'),
        (p_company_id, v_plan_id, v_item->>'key'||'_m2', 'Strategic objectives defined', 'upcoming', 'Objectives approved by sponsors', v_item->>'owner'),
        (p_company_id, v_plan_id, v_item->>'key'||'_m3', 'Initiative launch readiness', 'planned', 'Initiatives resourced and scheduled', v_item->>'owner')
      on conflict (company_id, plan_id, milestone_key) do nothing;

      insert into public.app_portal_future_state_alignment
        (company_id, plan_id, department, current_alignment, target_alignment, progress, owner)
      select p_company_id, v_plan_id, dept, 55, 85, 40, v_item->>'owner'
      from jsonb_array_elements_text(v_item->'departments') as dept
      on conflict (company_id, plan_id, department) do nothing;
    end if;
  end loop;

  if not exists (
    select 1 from public.app_portal_future_state_timeline t
    where t.company_id = p_company_id and t.event_type = 'workspace_initialized') then
    insert into public.app_portal_future_state_timeline
      (company_id, event_type, description, performed_by)
    values (p_company_id, 'workspace_initialized',
            'Future-state planning workspace initialized', p_user_id);
  end if;
end; $$;

-- readonly GET: list_app_portal_enterprise_benchmarking
create or replace function public.list_app_portal_enterprise_benchmarking(
  p_dimension_key text default null,
  p_maturity_level integer default null,
  p_organizational_area text default null,
  p_priority_level text default null,
  p_period_from date default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_dims jsonb := '[]'::jsonb; v_row record; v_total integer := 0;
  v_overall integer; v_operational integer; v_governance integer; v_learning integer;
  v_executive integer; v_business_pack integer; v_focus jsonb := '[]'::jsonb;
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._aebmi311_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._aebmi311_sync_dimensions(v_company_id, v_user_id);

  for v_row in
    select d.* from public.app_portal_enterprise_benchmarking_dimensions d
    where d.company_id = v_company_id
      and (p_dimension_key is null or d.dimension_key = p_dimension_key)
      and (p_maturity_level is null or d.maturity_level = p_maturity_level)
      and (p_organizational_area is null or d.organizational_area = p_organizational_area)
      and (p_priority_level is null or d.priority_level = p_priority_level)
      and (p_period_from is null or d.updated_at::date >= p_period_from)
      and (p_search is null or trim(p_search) = '' or d.dimension_name ilike '%' || trim(p_search) || '%')
    order by d.maturity_score desc
  loop
    v_dims := v_dims || public._aebmi311_dimension_card(v_row);
    v_total := v_total + 1;
    if v_row.maturity_level <= 2 then
      v_focus := v_focus || jsonb_build_object('dimension_key', v_row.dimension_key, 'name', v_row.dimension_name);
    end if;
  end loop;

  v_operational := public._aebmi311_avg_score(v_company_id, array['operational_excellence', 'automation_readiness']);
  v_governance := public._aebmi311_avg_score(v_company_id, array['governance_compliance', 'risk_resilience']);
  v_learning := public._aebmi311_avg_score(v_company_id, array['learning_development']);
  v_executive := public._aebmi311_avg_score(v_company_id, array['leadership_decision_making', 'organizational_intelligence']);
  v_business_pack := public._aebmi311_avg_score(v_company_id, array['business_pack_adoption', 'customer_success']);
  v_overall := round((v_operational + v_governance + v_learning + v_executive + v_business_pack) / 5.0);

  insert into public.app_portal_enterprise_benchmarking_snapshots (
    company_id, overall_maturity_score, operational_maturity_score, governance_maturity_score,
    learning_maturity_score, executive_intelligence_score, business_pack_maturity_score
  ) values (v_company_id, v_overall, v_operational, v_governance, v_learning, v_executive, v_business_pack)
  on conflict (company_id, snapshot_date) do update set
    overall_maturity_score = excluded.overall_maturity_score,
    operational_maturity_score = excluded.operational_maturity_score,
    governance_maturity_score = excluded.governance_maturity_score,
    learning_maturity_score = excluded.learning_maturity_score,
    executive_intelligence_score = excluded.executive_intelligence_score,
    business_pack_maturity_score = excluded.business_pack_maturity_score;

  return jsonb_build_object(
    'found', true,
    'can_full', coalesce(v_ctx->>'can_full', 'false') = 'true',
    'can_view', coalesce(v_ctx->>'can_view', 'false') = 'true',
    'can_assess', coalesce(v_ctx->>'can_assess', 'false') = 'true',
    'has_maturity_data', v_total > 0,
    'overall_maturity_score', v_overall,
    'operational_maturity_score', v_operational,
    'governance_maturity_score', v_governance,
    'learning_maturity_score', v_learning,
    'executive_intelligence_score', v_executive,
    'business_pack_maturity_score', v_business_pack,
    'recommended_focus_areas', v_focus,
    'executive_summary', case
      when v_total = 0 then 'No maturity insights are available yet.'
      when v_governance >= 70 then 'Your organization demonstrates strong governance maturity.'
      when v_learning < 45 then 'Learning maturity presents significant opportunities for advancement.'
      when v_operational >= 65 then 'Strategic execution capabilities continue to improve.'
      when public._aebmi311_avg_score(v_company_id, array['automation_readiness']) >= 55 then 'Automation readiness has increased substantially.'
      else 'Your organization continues advancing operational maturity across the Business Operating System.'
    end,
    'dimensions', v_dims,
    'insights', public._aebmi311_build_insights(v_company_id),
    'recommendations', public._aebmi311_build_recommendations(v_company_id),
    'anonymized_benchmark_note', 'Benchmarking insights are aggregated and anonymized — no customer-specific data is exposed across organizations.',
    'principle', 'Maturity insights provide guidance for improvement — organizations define their own strategic objectives.'
  );
end;
$$;



-- readonly GET: get_app_portal_enterprise_benchmarking_dimension
create or replace function public.get_app_portal_enterprise_benchmarking_dimension(p_dimension_key text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_ctx jsonb; v_company_id uuid; v_user_id uuid; v_row record; v_assessments jsonb;
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._aebmi311_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._aebmi311_sync_dimensions(v_company_id, v_user_id);

  select d.* into v_row from public.app_portal_enterprise_benchmarking_dimensions d
  where d.company_id = v_company_id and d.dimension_key = p_dimension_key;
  if not found then return jsonb_build_object('found', false); end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'maturity_level', a.maturity_level, 'assessor_name', a.assessor_name,
    'assessment_notes', a.assessment_notes, 'assessed_at', a.assessed_at
  ) order by a.assessed_at desc), '[]'::jsonb)
  into v_assessments
  from public.app_portal_enterprise_benchmarking_assessments a
  where a.company_id = v_company_id and a.dimension_key = p_dimension_key;

  return public._aebmi311_dimension_card(v_row) || jsonb_build_object(
    'found', true, 'assessment_history', v_assessments, 'can_assess', coalesce(v_ctx->>'can_assess', 'false') = 'true',
    'recommendations', (
      select coalesce(jsonb_agg(r), '[]'::jsonb) from (
        select r from jsonb_array_elements(public._aebmi311_build_recommendations(v_company_id)) r
        where r->>'dimension_key' = p_dimension_key or r->>'dimension_key' is null
      ) sub
    )
  );
end;
$$;



-- readonly GET: get_app_portal_enterprise_benchmarking_recommendations
create or replace function public.get_app_portal_enterprise_benchmarking_recommendations()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_ctx jsonb; v_company_id uuid; v_user_id uuid;
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._aebmi311_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._aebmi311_sync_dimensions(v_company_id, v_user_id);
  return jsonb_build_object('found', true, 'recommendations', public._aebmi311_build_recommendations(v_company_id));
end;
$$;



-- readonly GET: get_app_portal_enterprise_benchmarking_timeline
create or replace function public.get_app_portal_enterprise_benchmarking_timeline(
  p_dimension_key text default null,
  p_period_from date default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_ctx jsonb; v_company_id uuid; v_user_id uuid; v_events jsonb;
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._aebmi311_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._aebmi311_sync_dimensions(v_company_id, v_user_id);

  select coalesce(jsonb_agg(row order by row->>'created_at' desc), '[]'::jsonb) into v_events
  from (
    select jsonb_build_object('id', t.id, 'dimension_key', t.dimension_key, 'event_type', t.event_type, 'description', t.description, 'created_at', t.created_at) as row
    from public.app_portal_enterprise_benchmarking_timeline t
    where t.company_id = v_company_id
      and (p_dimension_key is null or t.dimension_key = p_dimension_key)
      and (p_period_from is null or t.created_at::date >= p_period_from)
    order by t.created_at desc limit 20
  ) sub;

  if jsonb_array_length(v_events) = 0 then
    select coalesce(jsonb_agg(row order by row->>'created_at' desc), '[]'::jsonb) into v_events
    from (
      select jsonb_build_object('id', d.id, 'dimension_key', d.dimension_key, 'event_type', 'maturity_baseline', 'description', d.dimension_name, 'created_at', d.created_at) as row
      from public.app_portal_enterprise_benchmarking_dimensions d
      where d.company_id = v_company_id and (p_dimension_key is null or d.dimension_key = p_dimension_key)
      order by d.created_at desc limit 15
    ) sub;
  end if;

  return jsonb_build_object('found', true, 'events', v_events);
end;
$$;



-- readonly GET: list_app_portal_predictive_intelligence
create or replace function public.list_app_portal_predictive_intelligence(
  p_category text default null,
  p_confidence_level text default null,
  p_time_horizon text default null,
  p_organizational_area text default null,
  p_potential_impact text default null,
  p_review_status text default null,
  p_period_from date default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_preds jsonb := '[]'::jsonb; v_warnings jsonb := '[]'::jsonb;
  v_row record; v_total integer := 0;
  v_opportunities jsonb := '[]'::jsonb; v_risks jsonb := '[]'::jsonb; v_attention jsonb := '[]'::jsonb;
  v_can_full boolean; v_manager_cats text[];
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._apoi312_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_can_full := coalesce(v_ctx->>'can_full', 'false') = 'true';
  v_manager_cats := public._apoi312_manager_categories();
  perform public._apoi312_sync_predictions(v_company_id, v_user_id);

  for v_row in
    select p.* from public.app_portal_predictive_intelligence_predictions p
    where p.company_id = v_company_id
      and (v_can_full or p.category = any(v_manager_cats))
      and (p_category is null or p.category = p_category)
      and (p_confidence_level is null or p.confidence_level = p_confidence_level)
      and (p_time_horizon is null or p.time_horizon = p_time_horizon)
      and (p_organizational_area is null or p.organizational_area = p_organizational_area)
      and (p_potential_impact is null or p.potential_impact = p_potential_impact)
      and (p_review_status is null or p.review_status = p_review_status)
      and (p_period_from is null or p.generated_at::date >= p_period_from)
      and (p_search is null or trim(p_search) = '' or p.title ilike '%' || trim(p_search) || '%' or p.summary ilike '%' || trim(p_search) || '%')
    order by case p.potential_impact when 'critical' then 1 when 'high' then 2 when 'moderate' then 3 else 4 end, p.generated_at desc
  loop
    v_preds := v_preds || public._apoi312_prediction_card(v_row);
    v_total := v_total + 1;
    if v_row.category in ('strategic', 'business_pack', 'customer_success') and v_row.potential_impact in ('moderate', 'high') then
      v_opportunities := v_opportunities || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
    if v_row.category in ('risk', 'capacity', 'governance') or v_row.potential_impact in ('high', 'critical') then
      v_risks := v_risks || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
    if v_row.review_status = 'pending' and v_row.potential_impact in ('high', 'critical') then
      v_attention := v_attention || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
  end loop;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', w.id, 'warning_key', w.warning_key, 'title', w.title,
    'signal_type', w.signal_type, 'description', w.description,
    'severity', w.severity, 'organizational_area', w.organizational_area
  )), '[]'::jsonb)
  into v_warnings
  from public.app_portal_predictive_intelligence_early_warnings w
  where w.company_id = v_company_id;

  return jsonb_build_object(
    'found', true,
    'can_full', v_can_full,
    'can_view', coalesce(v_ctx->>'can_view', 'false') = 'true',
    'can_generate', coalesce(v_ctx->>'can_generate', 'false') = 'true',
    'can_review', coalesce(v_ctx->>'can_review', 'false') = 'true',
    'has_predictive_data', v_total > 0,
    'forecast_summary', case
      when v_total = 0 then 'No predictive insights are available yet.'
      when jsonb_array_length(v_risks) > jsonb_array_length(v_opportunities) then 'Several indicators suggest areas requiring proactive attention.'
      else 'Current indicators suggest stable organizational performance with emerging opportunities.'
    end,
    'executive_summary', case
      when v_total = 0 then 'No predictive insights are available yet.'
      when exists (select 1 from public.app_portal_predictive_intelligence_predictions p where p.company_id = v_company_id and p.category = 'capacity') then 'Capacity planning should be reviewed within the next quarter.'
      when jsonb_array_length(v_opportunities) >= 2 then 'Several emerging opportunities may warrant executive attention.'
      when jsonb_array_length(v_risks) = 0 then 'Operational momentum remains positive.'
      else 'Current indicators suggest stable organizational performance.'
    end,
    'emerging_opportunities', v_opportunities,
    'emerging_risks', v_risks,
    'areas_requiring_attention', v_attention,
    'predictive_confidence_note', 'All predictions are probability-based insights — Aipify never claims certainty about future events.',
    'predictions', v_preds,
    'early_warnings', v_warnings,
    'recommendations', public._apoi312_build_recommendations(v_company_id),
    'principle', 'Predictive insights support preparedness — organizations retain full decision authority.'
  );
end;
$$;



-- readonly GET: get_app_portal_predictive_intelligence_prediction
create or replace function public.get_app_portal_predictive_intelligence_prediction(p_prediction_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb; v_company_id uuid; v_row record; v_reviews jsonb;
  v_can_full boolean; v_manager_cats text[];
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._apoi312_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_can_full := coalesce(v_ctx->>'can_full', 'false') = 'true';
  v_manager_cats := public._apoi312_manager_categories();
  perform public._apoi312_sync_predictions(v_company_id, (v_ctx->>'user_id')::uuid);

  select p.* into v_row from public.app_portal_predictive_intelligence_predictions p
  where p.company_id = v_company_id and p.id = p_prediction_id;
  if not found then return jsonb_build_object('found', false); end if;
  if not v_can_full and not (v_row.category = any(v_manager_cats)) then
    raise exception 'This prediction is outside your authorized scope';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'outcome', r.outcome, 'review_notes', r.review_notes, 'reviewed_at', r.reviewed_at
  ) order by r.reviewed_at desc), '[]'::jsonb)
  into v_reviews
  from public.app_portal_predictive_intelligence_outcome_reviews r
  where r.company_id = v_company_id and r.prediction_id = p_prediction_id;

  return public._apoi312_prediction_card(v_row) || jsonb_build_object(
    'found', true,
    'can_review', coalesce(v_ctx->>'can_review', 'false') = 'true',
    'outcome_reviews', v_reviews,
    'probability_note', 'This insight is probability-based — not a certainty about future events.'
  );
end;
$$;



-- readonly GET: get_app_portal_predictive_intelligence_recommendations
create or replace function public.get_app_portal_predictive_intelligence_recommendations()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_ctx jsonb; v_company_id uuid;
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._apoi312_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  perform public._apoi312_sync_predictions(v_company_id, (v_ctx->>'user_id')::uuid);
  return jsonb_build_object('found', true, 'recommendations', public._apoi312_build_recommendations(v_company_id));
end;
$$;



-- readonly GET: get_app_portal_predictive_intelligence_timeline
create or replace function public.get_app_portal_predictive_intelligence_timeline(
  p_prediction_id uuid default null,
  p_period_from date default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_ctx jsonb; v_company_id uuid; v_events jsonb;
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._apoi312_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  perform public._apoi312_sync_predictions(v_company_id, (v_ctx->>'user_id')::uuid);

  select coalesce(jsonb_agg(row order by row->>'created_at' desc), '[]'::jsonb) into v_events
  from (
    select jsonb_build_object(
      'id', t.id, 'prediction_id', t.prediction_id, 'event_type', t.event_type,
      'description', t.description, 'created_at', t.created_at
    ) as row
    from public.app_portal_predictive_intelligence_timeline t
    where t.company_id = v_company_id
      and (p_prediction_id is null or t.prediction_id = p_prediction_id)
      and (p_period_from is null or t.created_at::date >= p_period_from)
    order by t.created_at desc limit 25
  ) sub;

  return jsonb_build_object('found', true, 'events', v_events);
end;
$$;



-- readonly GET: list_app_portal_scenario_planning
create or replace function public.list_app_portal_scenario_planning(
  p_category text default null,
  p_scenario_type text default null,
  p_planning_status text default null,
  p_time_horizon text default null,
  p_organizational_area text default null,
  p_period_from date default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_scenarios jsonb := '[]'::jsonb; v_comparisons jsonb := '[]'::jsonb;
  v_row record; v_total integer := 0;
  v_priorities jsonb := '[]'::jsonb; v_risks jsonb := '[]'::jsonb;
  v_can_full boolean; v_manager_cats text[];
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._aspsc313_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_can_full := coalesce(v_ctx->>'can_full', 'false') = 'true';
  v_manager_cats := public._aspsc313_manager_categories();
  perform public._aspsc313_sync_scenarios(v_company_id, v_user_id);

  for v_row in
    select s.* from public.app_portal_scenario_planning_scenarios s
    where s.company_id = v_company_id
      and (v_can_full or s.category = any(v_manager_cats))
      and (p_category is null or s.category = p_category)
      and (p_scenario_type is null or s.scenario_type = p_scenario_type)
      and (p_planning_status is null or s.planning_status = p_planning_status)
      and (p_time_horizon is null or s.time_horizon = p_time_horizon)
      and (p_organizational_area is null or s.organizational_area = p_organizational_area)
      and (p_period_from is null or s.updated_at::date >= p_period_from)
      and (p_search is null or trim(p_search) = '' or s.title ilike '%' || trim(p_search) || '%' or s.summary ilike '%' || trim(p_search) || '%')
    order by case s.scenario_type when 'challenging' then 1 when 'expected' then 2 when 'best_case' then 3 else 4 end, s.updated_at desc
  loop
    v_scenarios := v_scenarios || public._aspsc313_scenario_card(v_row);
    v_total := v_total + 1;
    if v_row.scenario_type in ('best_case', 'expected') and v_row.category in ('strategic', 'market') then
      v_priorities := v_priorities || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
    if v_row.scenario_type = 'challenging' or v_row.category = 'risk' then
      v_risks := v_risks || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
  end loop;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'comparison_key', c.comparison_key, 'title', c.title,
    'comparison_summary', c.comparison_summary, 'scenario_ids', c.scenario_ids
  )), '[]'::jsonb)
  into v_comparisons
  from public.app_portal_scenario_planning_comparisons c
  where c.company_id = v_company_id and v_can_full;

  return jsonb_build_object(
    'found', true,
    'can_full', v_can_full,
    'can_view', coalesce(v_ctx->>'can_view', 'false') = 'true',
    'can_simulate', coalesce(v_ctx->>'can_simulate', 'false') = 'true',
    'can_compare', coalesce(v_ctx->>'can_compare', 'false') = 'true',
    'can_review', coalesce(v_ctx->>'can_review', 'false') = 'true',
    'has_scenario_data', v_total > 0,
    'planning_summary', case
      when v_total = 0 then 'No scenarios are available yet.'
      when jsonb_array_length(v_risks) > 0 then 'Several scenarios suggest areas worth executive rehearsal.'
      else 'Scenario portfolio supports proactive leadership planning.'
    end,
    'executive_summary', case
      when v_total = 0 then 'No scenarios are available yet.'
      when exists (select 1 from public.app_portal_scenario_planning_scenarios s where s.company_id = v_company_id and s.planning_status = 'simulated') then
        'Recent simulations provide leadership with comparative preparedness insights.'
      else 'Leadership can explore best, expected, and challenging futures before committing resources.'
    end,
    'strategic_priorities', v_priorities,
    'risk_scenarios', v_risks,
    'simulation_isolation_note', 'Simulations are isolated planning exercises — they do not change production systems or execute actions.',
    'simulation_lab_route', '/app/simulations',
    'scenarios', v_scenarios,
    'comparisons', v_comparisons,
    'recommendations', public._aspsc313_build_recommendations(v_company_id),
    'principle', 'Scenario planning supports thinking ahead — organizations retain full decision authority.'
  );
end;
$$;



-- readonly GET: get_app_portal_scenario_planning_scenario
create or replace function public.get_app_portal_scenario_planning_scenario(p_scenario_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb; v_company_id uuid; v_row record; v_sims jsonb;
  v_can_full boolean; v_manager_cats text[];
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._aspsc313_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_can_full := coalesce(v_ctx->>'can_full', 'false') = 'true';
  v_manager_cats := public._aspsc313_manager_categories();
  perform public._aspsc313_sync_scenarios(v_company_id, (v_ctx->>'user_id')::uuid);

  select s.* into v_row from public.app_portal_scenario_planning_scenarios s
  where s.company_id = v_company_id and s.id = p_scenario_id;
  if not found then return jsonb_build_object('found', false); end if;
  if not v_can_full and not (v_row.category = any(v_manager_cats)) then
    raise exception 'This scenario is outside your authorized scope';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', sim.id, 'simulation_key', sim.simulation_key, 'title', sim.title,
    'summary', sim.summary, 'outcome_summary', sim.outcome_summary,
    'risk_notes', sim.risk_notes, 'opportunity_notes', sim.opportunity_notes,
    'simulated_at', sim.simulated_at
  ) order by sim.simulated_at desc), '[]'::jsonb)
  into v_sims
  from public.app_portal_scenario_planning_simulations sim
  where sim.company_id = v_company_id and sim.scenario_id = p_scenario_id;

  return public._aspsc313_scenario_card(v_row) || jsonb_build_object(
    'found', true,
    'can_simulate', coalesce(v_ctx->>'can_simulate', 'false') = 'true',
    'can_review', coalesce(v_ctx->>'can_review', 'false') = 'true',
    'simulations', v_sims,
    'isolation_note', 'Simulation results are illustrative — humans decide whether and how to act.'
  );
end;
$$;



-- readonly GET: get_app_portal_scenario_planning_timeline
create or replace function public.get_app_portal_scenario_planning_timeline(
  p_scenario_id uuid default null,
  p_period_from date default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_ctx jsonb; v_company_id uuid; v_events jsonb;
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._aspsc313_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  perform public._aspsc313_sync_scenarios(v_company_id, (v_ctx->>'user_id')::uuid);

  select coalesce(jsonb_agg(row order by row->>'created_at' desc), '[]'::jsonb) into v_events
  from (
    select jsonb_build_object(
      'id', t.id, 'scenario_id', t.scenario_id, 'event_type', t.event_type,
      'description', t.description, 'created_at', t.created_at
    ) as row
    from public.app_portal_scenario_planning_timeline t
    where t.company_id = v_company_id
      and (p_scenario_id is null or t.scenario_id = p_scenario_id)
      and (p_period_from is null or t.created_at::date >= p_period_from)
    order by t.created_at desc limit 25
  ) sub;

  return jsonb_build_object('found', true, 'events', v_events);
end;
$$;



-- readonly GET: list_app_portal_executive_foresight
create or replace function public.list_app_portal_executive_foresight(
  p_category text default null,
  p_time_horizon text default null,
  p_strategic_priority text default null,
  p_organizational_area text default null,
  p_executive_owner text default null,
  p_review_status text default null,
  p_period_from date default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_obs jsonb := '[]'::jsonb; v_row record; v_total integer := 0;
  v_opportunities jsonb := '[]'::jsonb; v_risks jsonb := '[]'::jsonb;
  v_attention jsonb := '[]'::jsonb; v_focus jsonb := '[]'::jsonb;
  v_gaining jsonb := '[]'::jsonb; v_losing jsonb := '[]'::jsonb;
  v_can_full boolean; v_manager_cats text[];
  v_score integer;
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._aefc314_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_can_full := coalesce(v_ctx->>'can_full', 'false') = 'true';
  v_manager_cats := public._aefc314_manager_categories();
  perform public._aefc314_sync_observations(v_company_id, v_user_id);
  v_score := public._aefc314_outlook_score(v_company_id);

  for v_row in
    select o.* from public.app_portal_executive_foresight_observations o
    where o.company_id = v_company_id
      and (v_can_full or o.category = any(v_manager_cats))
      and (p_category is null or o.category = p_category)
      and (p_time_horizon is null or o.time_horizon = p_time_horizon)
      and (p_strategic_priority is null or o.strategic_priority = p_strategic_priority)
      and (p_organizational_area is null or o.organizational_area = p_organizational_area)
      and (p_executive_owner is null or o.executive_owner ilike '%' || trim(p_executive_owner) || '%')
      and (p_review_status is null or o.review_status = p_review_status)
      and (p_period_from is null or o.updated_at::date >= p_period_from)
      and (p_search is null or trim(p_search) = '' or o.title ilike '%' || trim(p_search) || '%' or o.summary ilike '%' || trim(p_search) || '%')
    order by case o.strategic_priority when 'strategic' then 1 when 'high' then 2 when 'moderate' then 3 else 4 end, o.updated_at desc
  loop
    v_obs := v_obs || public._aefc314_observation_card(v_row);
    v_total := v_total + 1;
    if v_row.insight_type in ('opportunity', 'momentum_gain') then
      v_opportunities := v_opportunities || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
    if v_row.insight_type in ('blind_spot', 'dependency') or v_row.momentum_direction = 'losing' then
      v_risks := v_risks || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
    if v_row.review_status in ('pending', 'needs_follow_up') and v_row.strategic_priority in ('high', 'strategic') then
      v_attention := v_attention || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
    if v_row.strategic_priority = 'strategic' then
      v_focus := v_focus || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
    if v_row.momentum_direction = 'gaining' then
      v_gaining := v_gaining || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    elsif v_row.momentum_direction = 'losing' then
      v_losing := v_losing || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
  end loop;

  return jsonb_build_object(
    'found', true,
    'can_full', v_can_full,
    'can_view', coalesce(v_ctx->>'can_view', 'false') = 'true',
    'can_review', coalesce(v_ctx->>'can_review', 'false') = 'true',
    'can_note', coalesce(v_ctx->>'can_note', 'false') = 'true',
    'has_foresight_data', v_total > 0,
    'executive_outlook_score', v_score,
    'executive_summary', case
      when v_total = 0 then 'No executive foresight insights are available yet.'
      when v_score >= 70 and jsonb_array_length(v_opportunities) >= 2 then 'Several strategic opportunities may warrant exploration.'
      when v_score >= 65 then 'Current indicators suggest strong organizational stability.'
      when exists (select 1 from public.app_portal_executive_foresight_observations o where o.company_id = v_company_id and o.category = 'leadership_development') then
        'Leadership capacity planning should be reviewed.'
      when jsonb_array_length(v_opportunities) > 0 then 'Market conditions may create future opportunities.'
      else 'Current indicators suggest balanced long-term preparedness.'
    end,
    'emerging_opportunities', v_opportunities,
    'emerging_risks', v_risks,
    'strategic_topics_requiring_attention', v_attention,
    'long_term_focus_areas', v_focus,
    'areas_gaining_momentum', v_gaining,
    'areas_losing_momentum', v_losing,
    'recommended_conversations', public._aefc314_recommended_conversations(v_company_id),
    'executive_questions', public._aefc314_executive_questions(),
    'foresight_advisory_note', 'All foresight insights are advisory — Aipify never claims certainty regarding future outcomes.',
    'observations', v_obs,
    'recommendations', public._aefc314_build_recommendations(v_company_id),
    'principle', 'Executive foresight encourages long-term thinking — final strategic decisions remain with leadership.'
  );
end;
$$;



-- readonly GET: get_app_portal_executive_foresight_observation
create or replace function public.get_app_portal_executive_foresight_observation(p_observation_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb; v_company_id uuid; v_row record;
  v_reviews jsonb; v_notes jsonb;
  v_can_full boolean; v_manager_cats text[];
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._aefc314_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_can_full := coalesce(v_ctx->>'can_full', 'false') = 'true';
  v_manager_cats := public._aefc314_manager_categories();
  perform public._aefc314_sync_observations(v_company_id, (v_ctx->>'user_id')::uuid);

  select o.* into v_row from public.app_portal_executive_foresight_observations o
  where o.company_id = v_company_id and o.id = p_observation_id;
  if not found then return jsonb_build_object('found', false); end if;
  if not v_can_full and not (v_row.category = any(v_manager_cats)) then
    raise exception 'This foresight observation is outside your authorized scope';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'review_type', r.review_type, 'review_notes', r.review_notes, 'reviewed_at', r.reviewed_at
  ) order by r.reviewed_at desc), '[]'::jsonb)
  into v_reviews
  from public.app_portal_executive_foresight_reviews r
  where r.company_id = v_company_id and r.observation_id = p_observation_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', n.id, 'note_text', n.note_text, 'created_at', n.created_at
  ) order by n.created_at desc), '[]'::jsonb)
  into v_notes
  from public.app_portal_executive_foresight_notes n
  where n.company_id = v_company_id and n.observation_id = p_observation_id;

  return public._aefc314_observation_card(v_row) || jsonb_build_object(
    'found', true,
    'can_review', coalesce(v_ctx->>'can_review', 'false') = 'true',
    'can_note', coalesce(v_ctx->>'can_note', 'false') = 'true',
    'reviews', v_reviews,
    'notes', v_notes,
    'advisory_note', 'Foresight insights support preparedness — not certainty about future outcomes.'
  );
end;
$$;



-- readonly GET: get_app_portal_executive_foresight_recommendations
create or replace function public.get_app_portal_executive_foresight_recommendations()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_ctx jsonb; v_company_id uuid;
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._aefc314_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  perform public._aefc314_sync_observations(v_company_id, (v_ctx->>'user_id')::uuid);
  return jsonb_build_object('found', true, 'recommendations', public._aefc314_build_recommendations(v_company_id));
end;
$$;



-- readonly GET: get_app_portal_executive_foresight_timeline
create or replace function public.get_app_portal_executive_foresight_timeline(
  p_observation_id uuid default null,
  p_period_from date default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_ctx jsonb; v_company_id uuid; v_events jsonb;
begin
  perform set_config('ap620.skip_intelligence_provisioning', '1', true);

  v_ctx := public._aefc314_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  perform public._aefc314_sync_observations(v_company_id, (v_ctx->>'user_id')::uuid);

  select coalesce(jsonb_agg(row order by row->>'created_at' desc), '[]'::jsonb) into v_events
  from (
    select jsonb_build_object(
      'id', t.id, 'observation_id', t.observation_id, 'event_type', t.event_type,
      'description', t.description, 'created_at', t.created_at
    ) as row
    from public.app_portal_executive_foresight_timeline t
    where t.company_id = v_company_id
      and (p_observation_id is null or t.observation_id = p_observation_id)
      and (p_period_from is null or t.created_at::date >= p_period_from)
    order by t.created_at desc limit 25
  ) sub;

  return jsonb_build_object('found', true, 'events', v_events);
end;
$$;



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

  v_org_id := public._aact538_org();
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

  v_org_id := public._aact538_org();
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
