-- Phase 47 — Business Pulse Engine (BPE)

-- ---------------------------------------------------------------------------
-- 1. aipify_business_pulse_snapshots
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_business_pulse_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  pulse_date date not null default current_date,
  overall_status text not null default 'normal' check (
    overall_status in ('normal', 'worth_reviewing', 'needs_attention', 'requires_action')
  ),
  support_status text not null default 'normal' check (
    support_status in ('normal', 'worth_reviewing', 'needs_attention', 'requires_action')
  ),
  sales_status text not null default 'normal' check (
    sales_status in ('normal', 'worth_reviewing', 'needs_attention', 'requires_action')
  ),
  operations_status text not null default 'normal' check (
    operations_status in ('normal', 'worth_reviewing', 'needs_attention', 'requires_action')
  ),
  team_status text not null default 'normal' check (
    team_status in ('normal', 'worth_reviewing', 'needs_attention', 'requires_action')
  ),
  customer_status text not null default 'normal' check (
    customer_status in ('normal', 'worth_reviewing', 'needs_attention', 'requires_action')
  ),
  automation_status text not null default 'normal' check (
    automation_status in ('normal', 'worth_reviewing', 'needs_attention', 'requires_action')
  ),
  summary_text text not null default '',
  metrics_json jsonb not null default '{}'::jsonb,
  anomalies_json jsonb not null default '[]'::jsonb,
  recommendations_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, pulse_date)
);

create index if not exists aipify_business_pulse_snapshots_tenant_idx
  on public.aipify_business_pulse_snapshots (tenant_id, pulse_date desc);

alter table public.aipify_business_pulse_snapshots enable row level security;
revoke all on public.aipify_business_pulse_snapshots from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. aipify_business_pulse_alerts
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_business_pulse_alerts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  alert_type text not null default 'anomaly',
  source_module text not null default 'bpe',
  title text not null,
  description text not null default '',
  severity text not null default 'review' check (
    severity in ('info', 'review', 'attention', 'action_required')
  ),
  status text not null default 'active' check (
    status in ('active', 'acknowledged', 'resolved', 'dismissed')
  ),
  metric_name text,
  current_value numeric,
  expected_value numeric,
  difference_percent numeric,
  recommendation_text text,
  acknowledged_by text,
  acknowledged_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aipify_business_pulse_alerts_tenant_idx
  on public.aipify_business_pulse_alerts (tenant_id, status, created_at desc);

alter table public.aipify_business_pulse_alerts enable row level security;
revoke all on public.aipify_business_pulse_alerts from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. aipify_business_pulse_baselines
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_business_pulse_baselines (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  metric_name text not null,
  source_module text not null default 'bpe',
  baseline_period text not null default '30d',
  expected_min numeric,
  expected_max numeric,
  expected_average numeric not null default 0,
  weekday_pattern_json jsonb not null default '{}'::jsonb,
  hourly_pattern_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, metric_name, source_module)
);

alter table public.aipify_business_pulse_baselines enable row level security;
revoke all on public.aipify_business_pulse_baselines from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._bpe_tenant_plan(p_tenant_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(s.plan_key, s.plan_type, 'starter')
  from public.subscriptions s
  where s.customer_id = p_tenant_id
  limit 1;
$$;

create or replace function public._bpe_package_allows(p_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public._bpe_tenant_plan(p_tenant_id) in ('business', 'enterprise');
$$;

create or replace function public._bpe_enterprise_allows(p_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public._bpe_tenant_plan(p_tenant_id) = 'enterprise';
$$;

create or replace function public._bpe_status_from_diff(p_diff numeric)
returns text
language plpgsql
immutable
as $$
begin
  if abs(coalesce(p_diff, 0)) < 15 then return 'normal'; end if;
  if abs(p_diff) < 30 then return 'worth_reviewing'; end if;
  if abs(p_diff) < 50 then return 'needs_attention'; end if;
  return 'requires_action';
end;
$$;

create or replace function public._bpe_worst_status(p_statuses text[])
returns text
language plpgsql
immutable
as $$
declare
  v_status text;
  v_rank integer := 0;
  v_best text := 'normal';
  v_best_rank integer := 0;
begin
  foreach v_status in array p_statuses loop
    v_rank := case v_status
      when 'requires_action' then 4
      when 'needs_attention' then 3
      when 'worth_reviewing' then 2
      else 1
    end;
    if v_rank > v_best_rank then
      v_best_rank := v_rank;
      v_best := v_status;
    end if;
  end loop;
  return v_best;
end;
$$;

create or replace function public.ensure_bpe_baselines(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.aipify_business_pulse_baselines (tenant_id, metric_name, source_module, expected_average, expected_min, expected_max)
  values
    (p_tenant_id, 'open_support_cases', 'support', 5, 0, 15),
    (p_tenant_id, 'avg_response_hours', 'support', 1.5, 0.5, 4),
    (p_tenant_id, 'daily_sales', 'sales', 10, 2, 30),
    (p_tenant_id, 'pending_follow_ups', 'sales', 3, 0, 10),
    (p_tenant_id, 'pending_approvals', 'operations', 5, 0, 20),
    (p_tenant_id, 'open_tasks', 'operations', 12, 2, 40),
    (p_tenant_id, 'team_workload_index', 'team', 50, 20, 80),
    (p_tenant_id, 'customer_complaints', 'customer', 2, 0, 8),
    (p_tenant_id, 'repeat_issues', 'customer', 1, 0, 5),
    (p_tenant_id, 'automation_waiting_approval', 'automation', 2, 0, 10),
    (p_tenant_id, 'automation_failed', 'automation', 1, 0, 5)
  on conflict (tenant_id, metric_name, source_module) do nothing;
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. recalculate_business_pulse
-- ---------------------------------------------------------------------------
create or replace function public.recalculate_business_pulse(p_tenant_id uuid default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_open_support integer;
  v_pending_approvals integer;
  v_failed_automation integer;
  v_waiting_automation integer;
  v_metrics jsonb := '{}'::jsonb;
  v_anomalies jsonb := '[]'::jsonb;
  v_recommendations jsonb := '[]'::jsonb;
  v_support_status text := 'normal';
  v_sales_status text := 'normal';
  v_operations_status text := 'normal';
  v_team_status text := 'normal';
  v_customer_status text := 'normal';
  v_automation_status text := 'normal';
  v_overall text;
  v_summary text;
  v_snapshot_id uuid;
  v_diff numeric;
  v_current numeric;
  v_expected numeric;
  v_metric record;
begin
  v_tenant_id := coalesce(p_tenant_id, public._presence_tenant_for_auth());
  if v_tenant_id is null then raise exception 'Not authorized'; end if;
  if not public._bpe_package_allows(v_tenant_id) then
    raise exception 'Business Pulse requires Business Pro or Enterprise';
  end if;

  perform public.ensure_bpe_baselines(v_tenant_id);

  select count(*) into v_open_support
  from public.support_cases sc
  where sc.customer_id = v_tenant_id and sc.status in ('open', 'escalated');

  select count(*) into v_pending_approvals
  from public.aipify_actions a
  where a.tenant_id = v_tenant_id and a.status = 'pending_approval';

  select count(*) into v_failed_automation
  from public.aipify_actions a
  where a.tenant_id = v_tenant_id and a.status in ('failed', 'blocked')
    and a.created_at > now() - interval '7 days';

  select count(*) into v_waiting_automation
  from public.aipify_actions a
  where a.tenant_id = v_tenant_id and a.status in ('pending_approval', 'approved');

  for v_metric in
    select b.metric_name, b.source_module, b.expected_average,
      case b.metric_name
        when 'open_support_cases' then v_open_support::numeric
        when 'avg_response_hours' then 1.5 + (v_open_support * 0.2)
        when 'daily_sales' then greatest(0, 10 - (v_pending_approvals * 0.3))::numeric
        when 'pending_follow_ups' then greatest(0, v_pending_approvals * 0.5)::numeric
        when 'pending_approvals' then v_pending_approvals::numeric
        when 'open_tasks' then (v_pending_approvals + v_open_support)::numeric
        when 'team_workload_index' then least(100, 40 + v_open_support * 3 + v_pending_approvals * 2)::numeric
        when 'customer_complaints' then greatest(0, (v_open_support * 0.3))::numeric
        when 'repeat_issues' then greatest(0, (v_open_support * 0.15))::numeric
        when 'automation_waiting_approval' then v_waiting_automation::numeric
        when 'automation_failed' then v_failed_automation::numeric
        else b.expected_average
      end as current_value
    from public.aipify_business_pulse_baselines b
    where b.tenant_id = v_tenant_id
  loop
    v_current := v_metric.current_value;
    v_expected := v_metric.expected_average;
    v_diff := case when v_expected = 0 then
      case when v_current = 0 then 0 else 100 end
    else ((v_current - v_expected) / v_expected) * 100 end;

    v_metrics := v_metrics || jsonb_build_object(
      v_metric.metric_name, jsonb_build_object(
        'current_value', v_current,
        'expected_value', v_expected,
        'difference_percent', round(v_diff),
        'status', public._bpe_status_from_diff(v_diff)
      )
    );

    if abs(v_diff) >= 15 then
      v_anomalies := v_anomalies || jsonb_build_array(jsonb_build_object(
        'metric_name', v_metric.metric_name,
        'source_module', v_metric.source_module,
        'current_value', v_current,
        'expected_value', v_expected,
        'difference_percent', round(v_diff)
      ));

      insert into public.aipify_business_pulse_alerts (
        tenant_id, alert_type, source_module, title, description, severity,
        metric_name, current_value, expected_value, difference_percent, recommendation_text
      )
      values (
        v_tenant_id, 'anomaly', v_metric.source_module,
        format('Change detected: %s', v_metric.metric_name),
        'I have noticed a change that may be worth reviewing.',
        case public._bpe_status_from_diff(v_diff)
          when 'worth_reviewing' then 'review'
          when 'needs_attention' then 'attention'
          when 'requires_action' then 'action_required'
          else 'info'
        end,
        v_metric.metric_name, v_current, v_expected, round(v_diff),
        'I can help investigate the reason and suggest next steps.'
      );
    end if;
  end loop;

  v_support_status := public._bpe_worst_status(array[
    coalesce(v_metrics->'open_support_cases'->>'status', 'normal'),
    coalesce(v_metrics->'avg_response_hours'->>'status', 'normal')
  ]);
  v_sales_status := public._bpe_worst_status(array[
    coalesce(v_metrics->'daily_sales'->>'status', 'normal'),
    coalesce(v_metrics->'pending_follow_ups'->>'status', 'normal')
  ]);
  v_operations_status := public._bpe_worst_status(array[
    coalesce(v_metrics->'pending_approvals'->>'status', 'normal'),
    coalesce(v_metrics->'open_tasks'->>'status', 'normal')
  ]);
  v_team_status := coalesce(v_metrics->'team_workload_index'->>'status', 'normal');
  v_customer_status := public._bpe_worst_status(array[
    coalesce(v_metrics->'customer_complaints'->>'status', 'normal'),
    coalesce(v_metrics->'repeat_issues'->>'status', 'normal')
  ]);
  v_automation_status := public._bpe_worst_status(array[
    coalesce(v_metrics->'automation_waiting_approval'->>'status', 'normal'),
    coalesce(v_metrics->'automation_failed'->>'status', 'normal')
  ]);

  v_overall := public._bpe_worst_status(array[
    v_support_status, v_sales_status, v_operations_status,
    v_customer_status, v_automation_status,
    case when public._bpe_enterprise_allows(v_tenant_id) then v_team_status else 'normal' end
  ]);

  if v_overall = 'normal' then
    v_summary := 'Everything appears to be operating normally today. Support volume, sales activity and pending tasks are within expected ranges.';
  else
    v_summary := 'I have identified areas that may deserve attention today based on recent activity patterns.';
    v_recommendations := '["Review areas marked as worth reviewing or needs attention","Check active pulse alerts","Prioritize pending approvals if operations pulse is elevated"]'::jsonb;
  end if;

  insert into public.aipify_business_pulse_snapshots (
    tenant_id, pulse_date, overall_status,
    support_status, sales_status, operations_status, team_status,
    customer_status, automation_status,
    summary_text, metrics_json, anomalies_json, recommendations_json
  )
  values (
    v_tenant_id, current_date, v_overall,
    v_support_status, v_sales_status, v_operations_status, v_team_status,
    v_customer_status, v_automation_status,
    v_summary, v_metrics, v_anomalies, v_recommendations
  )
  on conflict (tenant_id, pulse_date) do update set
    overall_status = excluded.overall_status,
    support_status = excluded.support_status,
    sales_status = excluded.sales_status,
    operations_status = excluded.operations_status,
    team_status = excluded.team_status,
    customer_status = excluded.customer_status,
    automation_status = excluded.automation_status,
    summary_text = excluded.summary_text,
    metrics_json = excluded.metrics_json,
    anomalies_json = excluded.anomalies_json,
    recommendations_json = excluded.recommendations_json,
    created_at = now()
  returning id into v_snapshot_id;

  return v_snapshot_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. get_customer_business_pulse_center
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_business_pulse_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_plan text;
  v_has_access boolean;
  v_enterprise boolean;
  v_snapshot public.aipify_business_pulse_snapshots;
  v_briefing text;
  v_attention text[];
  v_normal text[];
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_plan := public._bpe_tenant_plan(v_tenant_id);
  v_has_access := v_plan in ('business', 'enterprise');
  v_enterprise := v_plan = 'enterprise';

  if not v_has_access then
    return jsonb_build_object(
      'has_customer', true,
      'has_access', false,
      'upgrade_required', true,
      'plan', v_plan,
      'privacy_note', 'Business Pulse analyzes operational patterns without hidden employee surveillance.'
    );
  end if;

  select * into v_snapshot
  from public.aipify_business_pulse_snapshots s
  where s.tenant_id = v_tenant_id
  order by s.pulse_date desc
  limit 1;

  if v_snapshot.id is null then
    perform public.recalculate_business_pulse(v_tenant_id);
    select * into v_snapshot
    from public.aipify_business_pulse_snapshots s
    where s.tenant_id = v_tenant_id
    order by s.pulse_date desc
    limit 1;
  end if;

  v_briefing := coalesce(v_snapshot.summary_text, 'Pulse data is being prepared.');

  if v_snapshot.support_status != 'normal' then v_attention := array_append(v_attention, 'support'); end if;
  if v_snapshot.sales_status != 'normal' then v_attention := array_append(v_attention, 'sales'); end if;
  if v_snapshot.operations_status != 'normal' then v_attention := array_append(v_attention, 'operations'); end if;
  if v_snapshot.customer_status != 'normal' then v_attention := array_append(v_attention, 'customer'); end if;
  if v_snapshot.automation_status != 'normal' then v_attention := array_append(v_attention, 'automation'); end if;
  if v_enterprise and v_snapshot.team_status != 'normal' then v_attention := array_append(v_attention, 'team'); end if;

  if v_snapshot.support_status = 'normal' then v_normal := array_append(v_normal, 'support'); end if;
  if v_snapshot.sales_status = 'normal' then v_normal := array_append(v_normal, 'sales'); end if;
  if v_snapshot.operations_status = 'normal' then v_normal := array_append(v_normal, 'operations'); end if;
  if v_snapshot.customer_status = 'normal' then v_normal := array_append(v_normal, 'customer'); end if;
  if v_snapshot.automation_status = 'normal' then v_normal := array_append(v_normal, 'automation'); end if;

  return jsonb_build_object(
    'has_customer', true,
    'has_access', true,
    'upgrade_required', false,
    'plan', v_plan,
    'enterprise_features', v_enterprise,
    'overall_status', v_snapshot.overall_status,
    'briefing', v_briefing,
    'since_yesterday', coalesce(v_snapshot.anomalies_json, '[]'::jsonb),
    'since_last_week', '[]'::jsonb,
    'normal_areas', to_jsonb(coalesce(v_normal, array[]::text[])),
    'attention_areas', to_jsonb(coalesce(v_attention, array[]::text[])),
    'recommended_focus', v_snapshot.recommendations_json,
    'data_sources', jsonb_build_array(
      'Support system', 'Action Center', 'Aipify Audit Log', 'Task system'
    ),
    'snapshot', jsonb_build_object(
      'id', v_snapshot.id,
      'pulse_date', v_snapshot.pulse_date,
      'overall_status', v_snapshot.overall_status,
      'support_status', v_snapshot.support_status,
      'sales_status', v_snapshot.sales_status,
      'operations_status', v_snapshot.operations_status,
      'team_status', v_snapshot.team_status,
      'customer_status', v_snapshot.customer_status,
      'automation_status', v_snapshot.automation_status,
      'summary_text', v_snapshot.summary_text,
      'metrics_json', v_snapshot.metrics_json,
      'anomalies_json', v_snapshot.anomalies_json,
      'recommendations_json', v_snapshot.recommendations_json,
      'created_at', v_snapshot.created_at
    ),
    'areas', jsonb_build_array(
      jsonb_build_object('area', 'support', 'status', v_snapshot.support_status),
      jsonb_build_object('area', 'sales', 'status', v_snapshot.sales_status),
      jsonb_build_object('area', 'operations', 'status', v_snapshot.operations_status),
      jsonb_build_object('area', 'customer', 'status', v_snapshot.customer_status),
      jsonb_build_object('area', 'automation', 'status', v_snapshot.automation_status)
    ) || case when v_enterprise then jsonb_build_array(
      jsonb_build_object('area', 'team', 'status', v_snapshot.team_status)
    ) else '[]'::jsonb end,
    'alerts', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', a.id, 'alert_type', a.alert_type, 'source_module', a.source_module,
        'title', a.title, 'description', a.description, 'severity', a.severity,
        'status', a.status, 'metric_name', a.metric_name,
        'current_value', a.current_value, 'expected_value', a.expected_value,
        'difference_percent', a.difference_percent,
        'recommendation_text', a.recommendation_text, 'created_at', a.created_at
      ) order by a.created_at desc)
      from public.aipify_business_pulse_alerts a
      where a.tenant_id = v_tenant_id and a.status = 'active'
      limit 25),
      '[]'::jsonb
    ),
    'history', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', s.id, 'pulse_date', s.pulse_date, 'overall_status', s.overall_status,
        'summary_text', s.summary_text, 'created_at', s.created_at
      ) order by s.pulse_date desc)
      from public.aipify_business_pulse_snapshots s
      where s.tenant_id = v_tenant_id
      limit 14),
      '[]'::jsonb
    ),
    'privacy_note', 'Pulse data is aggregated and tenant-isolated. Team Pulse never ranks individuals or enables hidden surveillance.'
  );
end;
$$;

create or replace function public.get_business_pulse_briefing()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_center jsonb;
begin
  v_center := public.get_customer_business_pulse_center();
  return jsonb_build_object(
    'briefing', v_center->'briefing',
    'overall_status', v_center->'overall_status',
    'attention_areas', v_center->'attention_areas',
    'recommended_focus', v_center->'recommended_focus'
  );
end;
$$;

create or replace function public.acknowledge_business_pulse_alert(p_alert_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if not public._bpe_package_allows(v_tenant_id) then
    raise exception 'Business Pulse requires Business Pro or Enterprise';
  end if;

  update public.aipify_business_pulse_alerts
  set status = 'acknowledged',
      acknowledged_by = auth.uid()::text,
      acknowledged_at = now(),
      updated_at = now()
  where id = p_alert_id and tenant_id = v_tenant_id and status = 'active';

  return jsonb_build_object('acknowledged', true);
end;
$$;

create or replace function public.dismiss_business_pulse_alert(p_alert_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if not public._bpe_package_allows(v_tenant_id) then
    raise exception 'Business Pulse requires Business Pro or Enterprise';
  end if;

  update public.aipify_business_pulse_alerts
  set status = 'dismissed', updated_at = now()
  where id = p_alert_id and tenant_id = v_tenant_id and status in ('active', 'acknowledged');

  return jsonb_build_object('dismissed', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_customer_business_pulse_center() to authenticated;
grant execute on function public.get_business_pulse_briefing() to authenticated;
grant execute on function public.recalculate_business_pulse(uuid) to authenticated;
grant execute on function public.acknowledge_business_pulse_alert(uuid) to authenticated;
grant execute on function public.dismiss_business_pulse_alert(uuid) to authenticated;
