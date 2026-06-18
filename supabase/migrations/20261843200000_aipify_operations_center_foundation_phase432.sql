-- Phase 432 — Aipify Operations Center Foundation (Customer App)
-- Route: /app/operations · Feature owner: CUSTOMER APP

create table if not exists public.aoc_ops_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.aoc_ops_center_visits (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  last_visit_at timestamptz not null default now(),
  previous_visit_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create index if not exists aoc_ops_center_visits_tenant_idx
  on public.aoc_ops_center_visits (tenant_id, last_visit_at desc);

create table if not exists public.aoc_ops_center_tasks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  task_scope text not null check (task_scope in ('my', 'team', 'automation')),
  status_key text not null default 'waiting' check (
    status_key in ('completed', 'requires_attention', 'waiting', 'information')
  ),
  title text not null,
  description text not null default '',
  assigned_to uuid references public.users (id) on delete set null,
  source_module text not null default 'operations_center',
  route_path text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aoc_ops_center_tasks_tenant_idx
  on public.aoc_ops_center_tasks (tenant_id, task_scope, status_key, updated_at desc);

create table if not exists public.aoc_ops_center_alerts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  alert_type text not null check (
    alert_type in (
      'failed_integration', 'expiring_subscription', 'payment_issue',
      'security_event', 'approval_request', 'blocked_workflow', 'other'
    )
  ),
  status_key text not null default 'requires_attention' check (
    status_key in ('completed', 'requires_attention', 'waiting', 'information')
  ),
  title text not null,
  summary text not null default '',
  source_module text not null default 'operations_center',
  route_path text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aoc_ops_center_alerts_tenant_idx
  on public.aoc_ops_center_alerts (tenant_id, status_key, created_at desc);

create table if not exists public.aoc_ops_center_timeline (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  actor_type text not null default 'system' check (actor_type in ('user', 'system', 'aipify')),
  actor_label text not null default 'Aipify',
  action_label text not null,
  system_label text not null default 'Aipify Operations Center',
  result_label text not null default '',
  source_module text not null default 'operations_center',
  business_pack_key text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index if not exists aoc_ops_center_timeline_tenant_idx
  on public.aoc_ops_center_timeline (tenant_id, occurred_at desc);

create table if not exists public.aoc_ops_center_business_pack_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  pack_key text not null check (
    pack_key in ('hosts', 'commerce', 'support', 'finance', 'growth_partners', 'other')
  ),
  status_key text not null default 'information' check (
    status_key in ('completed', 'requires_attention', 'waiting', 'information')
  ),
  title text not null,
  summary text not null default '',
  route_path text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists aoc_ops_center_business_pack_events_tenant_idx
  on public.aoc_ops_center_business_pack_events (tenant_id, pack_key, created_at desc);

alter table public.aoc_ops_center_settings enable row level security;
alter table public.aoc_ops_center_visits enable row level security;
alter table public.aoc_ops_center_tasks enable row level security;
alter table public.aoc_ops_center_alerts enable row level security;
alter table public.aoc_ops_center_timeline enable row level security;
alter table public.aoc_ops_center_business_pack_events enable row level security;

revoke all on public.aoc_ops_center_settings from authenticated, anon;
revoke all on public.aoc_ops_center_visits from authenticated, anon;
revoke all on public.aoc_ops_center_tasks from authenticated, anon;
revoke all on public.aoc_ops_center_alerts from authenticated, anon;
revoke all on public.aoc_ops_center_timeline from authenticated, anon;
revoke all on public.aoc_ops_center_business_pack_events from authenticated, anon;

create or replace function public._aoc432_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._aoc432_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._aoc432_ensure_settings(p_tenant_id uuid)
returns public.aoc_ops_center_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aoc_ops_center_settings;
begin
  select * into v_row from public.aoc_ops_center_settings where tenant_id = p_tenant_id;
  if v_row.id is null then
    insert into public.aoc_ops_center_settings (tenant_id) values (p_tenant_id) returning * into v_row;
  end if;
  return v_row;
end; $$;

create or replace function public._aoc432_period_bucket(p_at timestamptz)
returns text language sql immutable as $$
  select case
    when p_at >= date_trunc('day', now()) then 'today'
    when p_at >= date_trunc('day', now()) - interval '1 day' then 'yesterday'
    when p_at >= date_trunc('week', now()) then 'this_week'
    else 'earlier'
  end;
$$;

create or replace function public._aoc432_sync_operational_signals(p_tenant_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_pending_approvals int := 0;
  v_open_support int := 0;
  v_failed_integrations int := 0;
  v_open_events int := 0;
begin
  perform public._aoc432_ensure_settings(p_tenant_id);

  select count(*) into v_pending_approvals
  from public.aoc_recommendations
  where tenant_id = p_tenant_id and status = 'pending';

  if v_pending_approvals > 0 and not exists (
    select 1 from public.aoc_ops_center_alerts
    where tenant_id = p_tenant_id and alert_type = 'approval_request'
      and status_key <> 'completed' and created_at > now() - interval '12 hours'
  ) then
    insert into public.aoc_ops_center_alerts (
      tenant_id, alert_type, status_key, title, summary, source_module, route_path
    ) values (
      p_tenant_id, 'approval_request', 'requires_attention',
      format('%s recommendation(s) awaiting review', v_pending_approvals),
      'Aipify has prepared recommendations that require your approval before action.',
      'recommendations', '/app/approvals'
    );
  end if;

  select count(*) into v_open_support
  from public.aoc_watcher_findings
  where tenant_id = p_tenant_id and watcher_type = 'support' and status = 'open';

  if v_open_support > 0 and not exists (
    select 1 from public.aoc_ops_center_tasks
    where tenant_id = p_tenant_id and task_scope = 'team' and source_module = 'support'
      and status_key <> 'completed' and created_at > now() - interval '12 hours'
  ) then
    insert into public.aoc_ops_center_tasks (
      tenant_id, task_scope, status_key, title, description, assigned_to, source_module, route_path
    ) values (
      p_tenant_id, 'team', 'requires_attention',
      'Review open support signals',
      format('%s support watcher finding(s) need attention.', v_open_support),
      p_user_id, 'support', '/app/support'
    );
  end if;

  begin
    select count(*) into v_failed_integrations
    from public.organization_integrations
    where organization_id = p_tenant_id and status = 'failed';
  exception when others then
    v_failed_integrations := 0;
  end;

  if v_failed_integrations > 0 and not exists (
    select 1 from public.aoc_ops_center_alerts
    where tenant_id = p_tenant_id and alert_type = 'failed_integration'
      and status_key <> 'completed' and created_at > now() - interval '24 hours'
  ) then
    insert into public.aoc_ops_center_alerts (
      tenant_id, alert_type, status_key, title, summary, source_module, route_path
    ) values (
      p_tenant_id, 'failed_integration', 'requires_attention',
      'Integration connection failed',
      format('%s integration(s) require attention before workflows can continue.', v_failed_integrations),
      'integrations', '/app/install'
    );
  end if;

  select count(*) into v_open_events
  from public.operations_events
  where organization_id = p_tenant_id and status not in ('completed', 'dismissed');

  if v_open_events > 0 then
    insert into public.aoc_ops_center_business_pack_events (
      tenant_id, pack_key, status_key, title, summary, route_path
    )
    select p_tenant_id, 'support', 'requires_attention',
      'Operational events need review',
      format('%s cross-module event(s) are open.', v_open_events),
      '/app/operations-center-foundation-engine'
    where not exists (
      select 1 from public.aoc_ops_center_business_pack_events
      where tenant_id = p_tenant_id and pack_key = 'support'
        and created_at > now() - interval '12 hours'
    );
  end if;

  insert into public.aoc_ops_center_business_pack_events (
    tenant_id, pack_key, status_key, title, summary, route_path
  )
  select p_tenant_id, 'hosts', 'information',
    'Hosts operations feed ready',
    'Property and guest operational signals surface here when Aipify Hosts is active.',
    '/app/aipify-hosts/operations'
  where not exists (
    select 1 from public.aoc_ops_center_business_pack_events
    where tenant_id = p_tenant_id and pack_key = 'hosts'
  );

  insert into public.aoc_ops_center_business_pack_events (
    tenant_id, pack_key, status_key, title, summary, route_path
  )
  select p_tenant_id, 'commerce', 'information',
    'Commerce pulse connected',
    'Order, inventory, and revenue signals appear in the unified operational feed.',
    '/app/commerce'
  where not exists (
    select 1 from public.aoc_ops_center_business_pack_events
    where tenant_id = p_tenant_id and pack_key = 'commerce'
  );

  insert into public.aoc_ops_center_business_pack_events (
    tenant_id, pack_key, status_key, title, summary, route_path
  )
  select p_tenant_id, 'finance', 'information',
    'Finance signals connected',
    'Subscription, invoice, and payment operational signals surface in the unified feed.',
    '/app/settings/billing'
  where not exists (
    select 1 from public.aoc_ops_center_business_pack_events
    where tenant_id = p_tenant_id and pack_key = 'finance'
  );

  insert into public.aoc_ops_center_tasks (
    tenant_id, task_scope, status_key, title, description, assigned_to, source_module, route_path
  )
  select p_tenant_id, 'my', 'waiting',
    'Review today''s operational priorities',
    'Aipify prepared a concise view of what changed since your last visit.',
    p_user_id, 'operations_center', '/app/operations'
  where not exists (
    select 1 from public.aoc_ops_center_tasks
    where tenant_id = p_tenant_id and task_scope = 'my' and source_module = 'operations_center'
  );

  insert into public.aoc_ops_center_tasks (
    tenant_id, task_scope, status_key, title, description, source_module, route_path
  )
  select p_tenant_id, 'automation', 'waiting',
    'Review scheduled automation queue',
    'Automation tasks waiting for approval or execution appear here.',
    'automation', '/app/operations/automation-control'
  where not exists (
    select 1 from public.aoc_ops_center_tasks
    where tenant_id = p_tenant_id and task_scope = 'automation'
  );
end; $$;

create or replace function public.record_aipify_operations_center_visit()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_prev timestamptz;
begin
  v_tenant_id := public._aoc432_require_tenant();
  v_user_id := public._aoc432_auth_user_id();

  if v_user_id is null then
    return jsonb_build_object('ok', false, 'reason', 'user_not_found');
  end if;

  select last_visit_at into v_prev
  from public.aoc_ops_center_visits
  where tenant_id = v_tenant_id and user_id = v_user_id;

  insert into public.aoc_ops_center_visits (tenant_id, user_id, last_visit_at, previous_visit_at)
  values (v_tenant_id, v_user_id, now(), v_prev)
  on conflict (tenant_id, user_id) do update set
    previous_visit_at = public.aoc_ops_center_visits.last_visit_at,
    last_visit_at = now(),
    updated_at = now();

  perform public._aoc432_sync_operational_signals(v_tenant_id, v_user_id);

  insert into public.aoc_ops_center_timeline (
    tenant_id, actor_type, actor_label, action_label, system_label, result_label, source_module, occurred_at
  ) values (
    v_tenant_id, 'user', coalesce((select full_name from public.users where id = v_user_id), 'User'),
    'Opened Operations Center', 'Aipify Operations Center', 'Operational awareness refreshed', 'operations_center', now()
  );

  return jsonb_build_object('ok', true, 'previous_visit_at', v_prev);
end; $$;

create or replace function public.get_aipify_operations_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_since timestamptz;
  v_prev timestamptz;
  v_brief jsonb;
  v_revenue_delta text := 'stable';
  v_support_open int := 0;
  v_new_team int := 0;
  v_integration_attention int := 0;
  v_exec_bullets jsonb := '[]'::jsonb;
begin
  v_tenant_id := public._aoc432_require_tenant();
  v_user_id := public._aoc432_auth_user_id();
  perform public._aoc432_ensure_settings(v_tenant_id);
  if v_user_id is not null then
    perform public._aoc432_sync_operational_signals(v_tenant_id, v_user_id);
  end if;

  select coalesce(previous_visit_at, last_visit_at, now() - interval '7 days')
  into v_since
  from public.aoc_ops_center_visits
  where tenant_id = v_tenant_id and user_id = v_user_id;

  v_since := coalesce(v_since, now() - interval '7 days');

  select previous_visit_at into v_prev
  from public.aoc_ops_center_visits
  where tenant_id = v_tenant_id and user_id = v_user_id;

  begin
    v_brief := public.get_briefing_since_last_login();
  exception when others then
    v_brief := '{}'::jsonb;
  end;

  select count(*) into v_support_open
  from public.aoc_watcher_findings
  where tenant_id = v_tenant_id and watcher_type = 'support' and status = 'open';

  select count(*) into v_integration_attention
  from public.aoc_ops_center_alerts
  where tenant_id = v_tenant_id and alert_type = 'failed_integration' and status_key <> 'completed';

  begin
    select count(*) into v_new_team
    from public.users u
    where u.company_id in (select company_id from public.customers where id = v_tenant_id)
      and u.created_at >= v_since;
  exception when others then
    v_new_team := 0;
  end;

  v_exec_bullets := jsonb_build_array(
    coalesce(v_brief->>'summary', 'Aipify reviewed operational activity since your last visit.'),
    case when v_support_open > 0 then format('%s support case(s) remain unresolved.', v_support_open)
         else 'Support queue is stable.' end,
    case when v_new_team > 0 then format('%s new team member(s) joined.', v_new_team)
         else 'No new team members since your last visit.' end,
    case when v_integration_attention > 0 then format('%s integration(s) require attention.', v_integration_attention)
         else 'Integrations are healthy.' end
  );

  return jsonb_build_object(
    'has_customer', true,
    'philosophy', 'Aipify observes, prioritizes, and recommends — humans decide.',
    'human_oversight_required', true,
    'last_login_at', v_prev,
    'period_start', v_since,
    'sections', jsonb_build_object(
      'completed', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', t.id, 'title', t.title, 'summary', t.description, 'status_key', t.status_key,
          'source_module', t.source_module, 'route_path', t.route_path, 'updated_at', t.updated_at
        ) order by t.updated_at desc)
        from public.aoc_ops_center_tasks t
        where t.tenant_id = v_tenant_id and t.status_key = 'completed' limit 12
      ), '[]'::jsonb),
      'requires_attention', coalesce(
        (select jsonb_agg(jsonb_build_object(
          'id', a.id, 'title', a.title, 'summary', a.summary, 'status_key', a.status_key,
          'kind', 'alert', 'alert_type', a.alert_type, 'source_module', a.source_module,
          'route_path', a.route_path, 'updated_at', a.updated_at
        ) order by a.updated_at desc)
        from public.aoc_ops_center_alerts a
        where a.tenant_id = v_tenant_id and a.status_key = 'requires_attention' limit 10),
        '[]'::jsonb
      ) || coalesce(
        (select jsonb_agg(jsonb_build_object(
          'id', t.id, 'title', t.title, 'summary', t.description, 'status_key', t.status_key,
          'kind', 'task', 'source_module', t.source_module, 'route_path', t.route_path,
          'updated_at', t.updated_at
        ) order by t.updated_at desc)
        from public.aoc_ops_center_tasks t
        where t.tenant_id = v_tenant_id and t.status_key = 'requires_attention' limit 10),
        '[]'::jsonb
      ),
      'waiting', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', t.id, 'title', t.title, 'summary', t.description, 'status_key', t.status_key,
          'source_module', t.source_module, 'route_path', t.route_path, 'updated_at', t.updated_at
        ) order by t.updated_at desc)
        from public.aoc_ops_center_tasks t
        where t.tenant_id = v_tenant_id and t.status_key = 'waiting' limit 15
      ), '[]'::jsonb),
      'information', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', e.id, 'title', e.title, 'summary', e.summary, 'status_key', e.status_key,
          'pack_key', e.pack_key, 'route_path', e.route_path, 'updated_at', e.created_at
        ) order by e.created_at desc)
        from public.aoc_ops_center_business_pack_events e
        where e.tenant_id = v_tenant_id and e.status_key = 'information' limit 15
      ), '[]'::jsonb)
    ),
    'since_last_login', jsonb_build_object(
      'period_start', v_since,
      'groups', jsonb_build_object(
        'today', coalesce((
          select jsonb_agg(jsonb_build_object(
            'id', tl.id, 'category', tl.source_module, 'title', tl.action_label,
            'summary', tl.result_label, 'occurred_at', tl.occurred_at
          ) order by tl.occurred_at desc)
          from public.aoc_ops_center_timeline tl
          where tl.tenant_id = v_tenant_id
            and tl.occurred_at >= v_since
            and public._aoc432_period_bucket(tl.occurred_at) = 'today'
          limit 20
        ), '[]'::jsonb),
        'yesterday', coalesce((
          select jsonb_agg(jsonb_build_object(
            'id', tl.id, 'category', tl.source_module, 'title', tl.action_label,
            'summary', tl.result_label, 'occurred_at', tl.occurred_at
          ) order by tl.occurred_at desc)
          from public.aoc_ops_center_timeline tl
          where tl.tenant_id = v_tenant_id
            and tl.occurred_at >= v_since
            and public._aoc432_period_bucket(tl.occurred_at) = 'yesterday'
          limit 20
        ), '[]'::jsonb),
        'this_week', coalesce((
          select jsonb_agg(jsonb_build_object(
            'id', tl.id, 'category', tl.source_module, 'title', tl.action_label,
            'summary', tl.result_label, 'occurred_at', tl.occurred_at
          ) order by tl.occurred_at desc)
          from public.aoc_ops_center_timeline tl
          where tl.tenant_id = v_tenant_id
            and tl.occurred_at >= v_since
            and public._aoc432_period_bucket(tl.occurred_at) = 'this_week'
          limit 20
        ), '[]'::jsonb)
      ),
      'activity_counts', jsonb_build_object(
        'activities', coalesce((select count(*) from public.aoc_ops_center_timeline where tenant_id = v_tenant_id and occurred_at >= v_since), 0),
        'alerts', coalesce((select count(*) from public.aoc_ops_center_alerts where tenant_id = v_tenant_id and created_at >= v_since), 0),
        'recommendations', coalesce((select count(*) from public.aoc_recommendations where tenant_id = v_tenant_id and created_at >= v_since), 0),
        'support_signals', v_support_open
      )
    ),
    'executive_summary', jsonb_build_object(
      'headline', 'What changed since your last login',
      'bullets', v_exec_bullets,
      'revenue_trend', v_revenue_delta
    ),
    'tasks', jsonb_build_object(
      'my_tasks', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', t.id, 'title', t.title, 'summary', t.description, 'status_key', t.status_key,
          'source_module', t.source_module, 'route_path', t.route_path, 'updated_at', t.updated_at
        ) order by t.updated_at desc)
        from public.aoc_ops_center_tasks t
        where t.tenant_id = v_tenant_id and t.task_scope = 'my' and t.status_key <> 'completed' limit 12
      ), '[]'::jsonb),
      'team_tasks', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', t.id, 'title', t.title, 'summary', t.description, 'status_key', t.status_key,
          'source_module', t.source_module, 'route_path', t.route_path, 'updated_at', t.updated_at
        ) order by t.updated_at desc)
        from public.aoc_ops_center_tasks t
        where t.tenant_id = v_tenant_id and t.task_scope = 'team' and t.status_key <> 'completed' limit 12
      ), '[]'::jsonb),
      'automation_tasks', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', t.id, 'title', t.title, 'summary', t.description, 'status_key', t.status_key,
          'source_module', t.source_module, 'route_path', t.route_path, 'updated_at', t.updated_at
        ) order by t.updated_at desc)
        from public.aoc_ops_center_tasks t
        where t.tenant_id = v_tenant_id and t.task_scope = 'automation' and t.status_key <> 'completed' limit 12
      ), '[]'::jsonb)
    ),
    'alerts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'alert_type', a.alert_type, 'status_key', a.status_key,
        'title', a.title, 'summary', a.summary, 'source_module', a.source_module,
        'route_path', a.route_path, 'created_at', a.created_at
      ) order by a.created_at desc)
      from public.aoc_ops_center_alerts a
      where a.tenant_id = v_tenant_id and a.status_key <> 'completed' limit 20
    ), '[]'::jsonb),
    'recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'category', r.category, 'title', r.title,
        'why', r.explanation, 'expected_benefit', r.expected_benefit,
        'confidence_level', r.confidence_level, 'risk_level', r.risk_level,
        'status', r.status, 'created_at', r.created_at
      ) order by r.created_at desc)
      from public.aoc_recommendations r
      where r.tenant_id = v_tenant_id and r.status in ('pending', 'reviewed') limit 12
    ), '[]'::jsonb),
    'timeline', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', tl.id, 'actor_type', tl.actor_type, 'actor_label', tl.actor_label,
        'action_label', tl.action_label, 'system_label', tl.system_label,
        'result_label', tl.result_label, 'source_module', tl.source_module,
        'business_pack_key', tl.business_pack_key, 'occurred_at', tl.occurred_at
      ) order by tl.occurred_at desc)
      from public.aoc_ops_center_timeline tl
      where tl.tenant_id = v_tenant_id limit 40
    ), '[]'::jsonb),
    'business_pack_events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'pack_key', e.pack_key, 'status_key', e.status_key,
        'title', e.title, 'summary', e.summary, 'route_path', e.route_path,
        'created_at', e.created_at
      ) order by e.created_at desc)
      from public.aoc_ops_center_business_pack_events e
      where e.tenant_id = v_tenant_id limit 24
    ), '[]'::jsonb),
    'statistics', jsonb_build_object(
      'requires_attention', coalesce((select count(*) from public.aoc_ops_center_alerts where tenant_id = v_tenant_id and status_key = 'requires_attention'), 0)
        + coalesce((select count(*) from public.aoc_ops_center_tasks where tenant_id = v_tenant_id and status_key = 'requires_attention'), 0),
      'waiting', coalesce((select count(*) from public.aoc_ops_center_tasks where tenant_id = v_tenant_id and status_key = 'waiting'), 0),
      'completed', coalesce((select count(*) from public.aoc_ops_center_tasks where tenant_id = v_tenant_id and status_key = 'completed'), 0),
      'open_recommendations', coalesce((select count(*) from public.aoc_recommendations where tenant_id = v_tenant_id and status = 'pending'), 0)
    ),
    'privacy_note', 'Operations Center summarizes verified operational signals — humans remain accountable for every decision.'
  );
exception when others then
  return jsonb_build_object('has_customer', false, 'error', SQLERRM);
end; $$;

grant execute on function public.get_aipify_operations_center() to authenticated;
grant execute on function public.record_aipify_operations_center_visit() to authenticated;
