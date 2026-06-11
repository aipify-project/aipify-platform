-- Phase 52 — Predictive Intelligence Engine (PIE)

-- ---------------------------------------------------------------------------
-- 1. aipify_prediction_models
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_prediction_models (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  model_key text not null,
  description text,
  category text not null default 'operations' check (
    category in ('support', 'sales', 'operations', 'growth', 'sla', 'workload')
  ),
  enabled boolean not null default true,
  thresholds jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, model_key)
);

create index if not exists aipify_prediction_models_tenant_idx
  on public.aipify_prediction_models (tenant_id, enabled);

alter table public.aipify_prediction_models enable row level security;
revoke all on public.aipify_prediction_models from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. aipify_predictive_alerts
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_predictive_alerts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  model_id uuid references public.aipify_prediction_models (id) on delete set null,
  alert_type text not null check (
    alert_type in (
      'future_bottleneck', 'churn_risk', 'workload_risk',
      'growth_opportunity', 'followup_risk', 'sla_risk'
    )
  ),
  severity text not null default 'medium' check (
    severity in ('info', 'low', 'medium', 'high', 'critical')
  ),
  title text not null,
  summary text not null,
  evidence jsonb not null default '{}'::jsonb,
  recommendation text,
  confidence_score numeric(4, 2) not null default 0.7,
  predicted_date date,
  status text not null default 'open' check (
    status in ('open', 'acknowledged', 'dismissed', 'resolved', 'snoozed')
  ),
  acknowledged_at timestamptz,
  resolved_at timestamptz,
  snoozed_until timestamptz,
  generated_by text not null default 'aipify',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aipify_predictive_alerts_tenant_status_idx
  on public.aipify_predictive_alerts (tenant_id, status, alert_type);

create index if not exists aipify_predictive_alerts_predicted_idx
  on public.aipify_predictive_alerts (tenant_id, predicted_date);

alter table public.aipify_predictive_alerts enable row level security;
revoke all on public.aipify_predictive_alerts from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. aipify_prediction_settings
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_prediction_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default false,
  allow_bottleneck_predictions boolean not null default true,
  allow_churn_predictions boolean not null default true,
  allow_workload_predictions boolean not null default false,
  allow_growth_predictions boolean not null default true,
  allow_followup_predictions boolean not null default true,
  allow_sla_predictions boolean not null default true,
  require_admin_approval_for_actions boolean not null default true,
  prediction_horizon_days int not null default 14,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.aipify_prediction_settings enable row level security;
revoke all on public.aipify_prediction_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. aipify_prediction_audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_prediction_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  actor_type text not null check (actor_type in ('user', 'aipify', 'system')),
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  target_type text,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists aipify_prediction_audit_log_tenant_idx
  on public.aipify_prediction_audit_log (tenant_id, created_at desc);

alter table public.aipify_prediction_audit_log enable row level security;
revoke all on public.aipify_prediction_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._pie_tenant_plan(p_tenant_id uuid)
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

create or replace function public._pie_package_allows(p_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public._pie_tenant_plan(p_tenant_id) in ('business', 'enterprise');
$$;

create or replace function public._pie_user_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select u.id from public.users u where u.auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._pie_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(u.role, 'staff')
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;
$$;

create or replace function public._pie_require_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if public._pie_user_role() not in ('owner', 'admin') then
    raise exception 'Admin access required';
  end if;
end;
$$;

create or replace function public._pie_log_audit(
  p_tenant_id uuid,
  p_actor_type text,
  p_action text,
  p_target_type text default null,
  p_target_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.aipify_prediction_audit_log (
    tenant_id, actor_type, actor_user_id, action, target_type, target_id, metadata
  )
  values (
    p_tenant_id,
    p_actor_type,
    case when p_actor_type = 'user' then public._pie_user_id() else null end,
    p_action,
    p_target_type,
    p_target_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end;
$$;

create or replace function public._pie_can_view_alert(
  p_alert public.aipify_predictive_alerts,
  p_settings public.aipify_prediction_settings
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  v_role := public._pie_user_role();

  if v_role in ('owner', 'admin') then
    return true;
  end if;

  if p_alert.alert_type = 'workload_risk'
    and not p_settings.allow_workload_predictions then
    return false;
  end if;

  if v_role = 'support' then
    return p_alert.alert_type in (
      'future_bottleneck', 'sla_risk', 'followup_risk', 'churn_risk'
    );
  end if;

  if v_role = 'staff' then
    return p_alert.alert_type in ('followup_risk', 'sla_risk');
  end if;

  return false;
end;
$$;

create or replace function public._pie_alert_json(a public.aipify_predictive_alerts)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', a.id,
    'alert_type', a.alert_type,
    'severity', a.severity,
    'title', a.title,
    'summary', a.summary,
    'evidence', a.evidence,
    'recommendation', a.recommendation,
    'confidence_score', a.confidence_score,
    'predicted_date', a.predicted_date,
    'status', a.status,
    'acknowledged_at', a.acknowledged_at,
    'resolved_at', a.resolved_at,
    'snoozed_until', a.snoozed_until,
    'generated_by', a.generated_by,
    'created_at', a.created_at,
    'updated_at', a.updated_at
  );
$$;

create or replace function public.ensure_pie_prediction_settings(p_tenant_id uuid)
returns public.aipify_prediction_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.aipify_prediction_settings;
begin
  insert into public.aipify_prediction_settings (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;

  select * into v_row
  from public.aipify_prediction_settings
  where tenant_id = p_tenant_id;

  return v_row;
end;
$$;

create or replace function public.seed_pie_prediction_models(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.aipify_prediction_models (tenant_id, model_key, description, category, thresholds)
  values
    (p_tenant_id, 'future_bottleneck', 'Predict workflow bottlenecks from escalation trends', 'operations',
      '{"growth_pct": 40, "min_events": 5}'::jsonb),
    (p_tenant_id, 'churn_risk', 'Detect customer or lead inactivity patterns', 'sales',
      '{"inactive_days": 14, "min_entities": 1}'::jsonb),
    (p_tenant_id, 'workload_risk', 'Predict team overload from event concentration', 'workload',
      '{"concentration_pct": 65, "min_open": 8}'::jsonb),
    (p_tenant_id, 'growth_opportunity', 'Identify positive trends and expansion signals', 'growth',
      '{"min_growth_pct": 25}'::jsonb),
    (p_tenant_id, 'followup_risk', 'Predict missed follow-ups from promise patterns', 'operations',
      '{"lookahead_days": 7}'::jsonb),
    (p_tenant_id, 'sla_risk', 'Predict SLA breaches from support queue trends', 'sla',
      '{"queue_growth_pct": 30, "pending_hours": 12}'::jsonb)
  on conflict (tenant_id, model_key) do nothing;
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. Settings RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_prediction_settings()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_prediction_settings;
  v_plan text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_plan := public._pie_tenant_plan(v_tenant_id);

  if not public._pie_package_allows(v_tenant_id) then
    return jsonb_build_object(
      'has_customer', true,
      'has_access', false,
      'upgrade_required', true,
      'plan', v_plan
    );
  end if;

  perform public._pie_require_admin();
  v_settings := public.ensure_pie_prediction_settings(v_tenant_id);
  perform public.seed_pie_prediction_models(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'has_access', true,
    'upgrade_required', false,
    'plan', v_plan,
    'settings', jsonb_build_object(
      'enabled', v_settings.enabled,
      'allow_bottleneck_predictions', v_settings.allow_bottleneck_predictions,
      'allow_churn_predictions', v_settings.allow_churn_predictions,
      'allow_workload_predictions', v_settings.allow_workload_predictions,
      'allow_growth_predictions', v_settings.allow_growth_predictions,
      'allow_followup_predictions', v_settings.allow_followup_predictions,
      'allow_sla_predictions', v_settings.allow_sla_predictions,
      'require_admin_approval_for_actions', v_settings.require_admin_approval_for_actions,
      'prediction_horizon_days', v_settings.prediction_horizon_days
    ),
    'models', coalesce(
      (
        select jsonb_agg(jsonb_build_object(
          'id', m.id,
          'model_key', m.model_key,
          'description', m.description,
          'category', m.category,
          'enabled', m.enabled,
          'thresholds', m.thresholds
        ) order by m.model_key)
        from public.aipify_prediction_models m
        where m.tenant_id = v_tenant_id
      ),
      '[]'::jsonb
    )
  );
end;
$$;

create or replace function public.update_prediction_settings(p_patch jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_prediction_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;
  if not public._pie_package_allows(v_tenant_id) then raise exception 'Upgrade required'; end if;

  perform public._pie_require_admin();
  v_settings := public.ensure_pie_prediction_settings(v_tenant_id);
  perform public.seed_pie_prediction_models(v_tenant_id);

  update public.aipify_prediction_settings s
  set
    enabled = coalesce((p_patch->>'enabled')::boolean, s.enabled),
    allow_bottleneck_predictions = coalesce((p_patch->>'allow_bottleneck_predictions')::boolean, s.allow_bottleneck_predictions),
    allow_churn_predictions = coalesce((p_patch->>'allow_churn_predictions')::boolean, s.allow_churn_predictions),
    allow_workload_predictions = coalesce((p_patch->>'allow_workload_predictions')::boolean, s.allow_workload_predictions),
    allow_growth_predictions = coalesce((p_patch->>'allow_growth_predictions')::boolean, s.allow_growth_predictions),
    allow_followup_predictions = coalesce((p_patch->>'allow_followup_predictions')::boolean, s.allow_followup_predictions),
    allow_sla_predictions = coalesce((p_patch->>'allow_sla_predictions')::boolean, s.allow_sla_predictions),
    require_admin_approval_for_actions = coalesce((p_patch->>'require_admin_approval_for_actions')::boolean, s.require_admin_approval_for_actions),
    prediction_horizon_days = coalesce((p_patch->>'prediction_horizon_days')::int, s.prediction_horizon_days),
    updated_at = now()
  where s.tenant_id = v_tenant_id
  returning * into v_settings;

  perform public._pie_log_audit(
    v_tenant_id, 'user', 'update_prediction_settings', 'prediction_settings', v_settings.id, p_patch
  );

  return public.get_prediction_settings();
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. Detection jobs (rule-based, no ML)
-- ---------------------------------------------------------------------------
create or replace function public._pie_model_id(p_tenant_id uuid, p_key text)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select m.id from public.aipify_prediction_models m
  where m.tenant_id = p_tenant_id and m.model_key = p_key and m.enabled
  limit 1;
$$;

create or replace function public.detect_pie_future_bottlenecks_for_tenant(p_tenant_id uuid)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int := 0;
  v_recent int;
  v_prior int;
  v_growth numeric;
  v_horizon int;
  v_model_id uuid;
begin
  if not exists (
    select 1 from public.aipify_prediction_settings s
    where s.tenant_id = p_tenant_id and s.enabled and s.allow_bottleneck_predictions
  ) then return 0; end if;

  select s.prediction_horizon_days into v_horizon
  from public.aipify_prediction_settings s where s.tenant_id = p_tenant_id;

  v_model_id := public._pie_model_id(p_tenant_id, 'future_bottleneck');

  select count(*) into v_recent
  from public.aipify_workflow_events e
  where e.tenant_id = p_tenant_id
    and e.event_type in ('escalated', 'delayed')
    and e.occurred_at > now() - interval '7 days';

  select count(*) into v_prior
  from public.aipify_workflow_events e
  where e.tenant_id = p_tenant_id
    and e.event_type in ('escalated', 'delayed')
    and e.occurred_at between now() - interval '14 days' and now() - interval '7 days';

  if v_prior > 0 then
    v_growth := ((v_recent::numeric - v_prior::numeric) / v_prior::numeric) * 100;
  elsif v_recent >= 5 then
    v_growth := 100;
  else
    v_growth := 0;
  end if;

  if v_recent >= 5 and v_growth >= 40 then
    if not exists (
      select 1 from public.aipify_predictive_alerts a
      where a.tenant_id = p_tenant_id
        and a.alert_type = 'future_bottleneck'
        and a.status in ('open', 'acknowledged')
        and a.created_at > now() - interval '24 hours'
    ) then
      insert into public.aipify_predictive_alerts (
        tenant_id, model_id, alert_type, severity, title, summary, evidence,
        recommendation, confidence_score, predicted_date
      )
      values (
        p_tenant_id, v_model_id, 'future_bottleneck',
        case when v_growth >= 80 then 'high' when v_growth >= 50 then 'medium' else 'low' end,
        'Workflow bottleneck may develop soon',
        format(
          'Escalation and delay events increased %s%% in the last 7 days compared with the prior week. A bottleneck may form within the next %s days.',
          round(v_growth), coalesce(v_horizon, 14)
        ),
        jsonb_build_object(
          'recent_events', v_recent,
          'prior_events', v_prior,
          'growth_pct', round(v_growth),
          'method', 'trend_analysis'
        ),
        'Review queue distribution and assign backup owners before volume peaks.',
        least(0.95, 0.55 + (v_growth / 200)),
        current_date + coalesce(v_horizon, 14)
      );
      v_count := v_count + 1;
    end if;
  end if;

  return v_count;
end;
$$;

create or replace function public.detect_pie_customer_inactivity_for_tenant(p_tenant_id uuid)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int := 0;
  v_inactive int;
  v_model_id uuid;
  v_horizon int;
begin
  if not exists (
    select 1 from public.aipify_prediction_settings s
    where s.tenant_id = p_tenant_id and s.enabled and s.allow_churn_predictions
  ) then return 0; end if;

  v_model_id := public._pie_model_id(p_tenant_id, 'churn_risk');
  select s.prediction_horizon_days into v_horizon
  from public.aipify_prediction_settings s where s.tenant_id = p_tenant_id;

  select count(*) into v_inactive
  from public.aipify_business_entities be
  where be.tenant_id = p_tenant_id
    and be.entity_type in ('customer', 'lead', 'partner')
    and be.updated_at < now() - interval '14 days'
    and not exists (
      select 1 from public.aipify_workflow_events e
      where e.tenant_id = p_tenant_id
        and e.related_customer_id = be.id
        and e.occurred_at > now() - interval '14 days'
    );

  if v_inactive >= 1 then
    if not exists (
      select 1 from public.aipify_predictive_alerts a
      where a.tenant_id = p_tenant_id
        and a.alert_type = 'churn_risk'
        and a.status in ('open', 'acknowledged')
        and a.created_at > now() - interval '48 hours'
    ) then
      insert into public.aipify_predictive_alerts (
        tenant_id, model_id, alert_type, severity, title, summary, evidence,
        recommendation, confidence_score, predicted_date
      )
      values (
        p_tenant_id, v_model_id, 'churn_risk',
        case when v_inactive >= 5 then 'high' when v_inactive >= 2 then 'medium' else 'low' end,
        'Customer or lead inactivity may increase churn risk',
        format(
          '%s customers or leads show no recent activity. Engagement may decline without follow-up within %s days.',
          v_inactive, coalesce(v_horizon, 14)
        ),
        jsonb_build_object('inactive_count', v_inactive, 'inactive_days', 14, 'method', 'inactivity_threshold'),
        'Schedule proactive follow-up or check-in before relationships go cold.',
        0.72,
        current_date + 7
      );
      v_count := 1;
    end if;
  end if;

  return v_count;
end;
$$;

create or replace function public.detect_pie_workload_risk_for_tenant(p_tenant_id uuid)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int := 0;
  v_total int;
  v_top_count int;
  v_pct numeric;
  v_model_id uuid;
begin
  if not exists (
    select 1 from public.aipify_prediction_settings s
    where s.tenant_id = p_tenant_id and s.enabled and s.allow_workload_predictions
  ) then return 0; end if;

  v_model_id := public._pie_model_id(p_tenant_id, 'workload_risk');

  select count(*) into v_total
  from public.aipify_workflow_events e
  where e.tenant_id = p_tenant_id
    and e.event_type in ('assigned', 'escalated')
    and e.occurred_at > now() - interval '7 days'
    and not exists (
      select 1 from public.aipify_workflow_events c
      where c.tenant_id = e.tenant_id and c.source_id = e.source_id
        and c.event_type = 'completed' and c.occurred_at > e.occurred_at
    );

  if v_total >= 8 then
    select count(*) into v_top_count
    from public.aipify_workflow_events e
    where e.tenant_id = p_tenant_id
      and e.actor_user_id = (
        select e2.actor_user_id
        from public.aipify_workflow_events e2
        where e2.tenant_id = p_tenant_id
          and e2.event_type in ('assigned', 'escalated')
          and e2.occurred_at > now() - interval '7 days'
          and e2.actor_user_id is not null
        group by e2.actor_user_id
        order by count(*) desc
        limit 1
      )
      and e.event_type in ('assigned', 'escalated')
      and e.occurred_at > now() - interval '7 days';

    v_pct := (v_top_count::numeric / v_total::numeric) * 100;

    if v_pct >= 65 and not exists (
      select 1 from public.aipify_predictive_alerts a
      where a.tenant_id = p_tenant_id
        and a.alert_type = 'workload_risk'
        and a.status in ('open', 'acknowledged')
        and a.created_at > now() - interval '24 hours'
    ) then
      insert into public.aipify_predictive_alerts (
        tenant_id, model_id, alert_type, severity, title, summary, evidence,
        recommendation, confidence_score, predicted_date
      )
      values (
        p_tenant_id, v_model_id, 'workload_risk', 'medium',
        'Workload concentration may cause delays',
        format(
          '%s%% of open workflow items are concentrated on one owner. Delays may increase within the next week.',
          round(v_pct)
        ),
        jsonb_build_object('total_open', v_total, 'top_pct', round(v_pct), 'method', 'concentration_analysis'),
        'Redistribute open items or assign backup coverage before backlog grows.',
        0.68,
        current_date + 7
      );
      v_count := 1;
    end if;
  end if;

  return v_count;
end;
$$;

create or replace function public.detect_pie_sla_risk_for_tenant(p_tenant_id uuid)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int := 0;
  v_pending int;
  v_recent int;
  v_prior int;
  v_growth numeric;
  v_model_id uuid;
begin
  if not exists (
    select 1 from public.aipify_prediction_settings s
    where s.tenant_id = p_tenant_id and s.enabled and s.allow_sla_predictions
  ) then return 0; end if;

  v_model_id := public._pie_model_id(p_tenant_id, 'sla_risk');

  select count(*) into v_pending
  from public.support_cases sc
  where sc.tenant_id = p_tenant_id
    and sc.status in ('received', 'triaged', 'pending_approval', 'escalated')
    and sc.created_at < now() - interval '12 hours';

  select count(*) into v_recent
  from public.support_cases sc
  where sc.tenant_id = p_tenant_id
    and sc.created_at > now() - interval '7 days';

  select count(*) into v_prior
  from public.support_cases sc
  where sc.tenant_id = p_tenant_id
    and sc.created_at between now() - interval '14 days' and now() - interval '7 days';

  if v_prior > 0 then
    v_growth := ((v_recent::numeric - v_prior::numeric) / v_prior::numeric) * 100;
  elsif v_recent >= 3 then
    v_growth := 50;
  else
    v_growth := 0;
  end if;

  if (v_pending >= 2 and v_growth >= 30) or v_pending >= 5 then
    if not exists (
      select 1 from public.aipify_predictive_alerts a
      where a.tenant_id = p_tenant_id
        and a.alert_type = 'sla_risk'
        and a.status in ('open', 'acknowledged')
        and a.created_at > now() - interval '24 hours'
    ) then
      insert into public.aipify_predictive_alerts (
        tenant_id, model_id, alert_type, severity, title, summary, evidence,
        recommendation, confidence_score, predicted_date
      )
      values (
        p_tenant_id, v_model_id, 'sla_risk',
        case when v_pending >= 5 then 'high' else 'medium' end,
        'Support SLA breach risk is increasing',
        format(
          '%s cases have been waiting over 12 hours and support volume grew %s%% week-over-week. Response times may miss SLA soon.',
          v_pending, round(v_growth)
        ),
        jsonb_build_object(
          'pending_over_12h', v_pending,
          'volume_growth_pct', round(v_growth),
          'method', 'sla_trend_analysis'
        ),
        'Prioritize oldest cases and assign overflow support before SLA deadlines.',
        0.75,
        current_date + 3
      );
      v_count := 1;
    end if;
  end if;

  return v_count;
end;
$$;

create or replace function public.detect_pie_growth_opportunities_for_tenant(p_tenant_id uuid)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int := 0;
  v_completed_recent int;
  v_completed_prior int;
  v_growth numeric;
  v_model_id uuid;
begin
  if not exists (
    select 1 from public.aipify_prediction_settings s
    where s.tenant_id = p_tenant_id and s.enabled and s.allow_growth_predictions
  ) then return 0; end if;

  v_model_id := public._pie_model_id(p_tenant_id, 'growth_opportunity');

  select count(*) into v_completed_recent
  from public.aipify_workflow_events e
  where e.tenant_id = p_tenant_id
    and e.event_type = 'completed'
    and e.occurred_at > now() - interval '7 days';

  select count(*) into v_completed_prior
  from public.aipify_workflow_events e
  where e.tenant_id = p_tenant_id
    and e.event_type = 'completed'
    and e.occurred_at between now() - interval '14 days' and now() - interval '7 days';

  if v_completed_prior > 0 then
    v_growth := ((v_completed_recent::numeric - v_completed_prior::numeric) / v_completed_prior::numeric) * 100;
  else
    v_growth := 0;
  end if;

  if v_completed_recent >= 10 and v_growth >= 25 then
    if not exists (
      select 1 from public.aipify_predictive_alerts a
      where a.tenant_id = p_tenant_id
        and a.alert_type = 'growth_opportunity'
        and a.status in ('open', 'acknowledged')
        and a.created_at > now() - interval '72 hours'
    ) then
      insert into public.aipify_predictive_alerts (
        tenant_id, model_id, alert_type, severity, title, summary, evidence,
        recommendation, confidence_score, predicted_date
      )
      values (
        p_tenant_id, v_model_id, 'growth_opportunity', 'low',
        'Positive workflow momentum detected',
        format(
          'Completed workflow volume grew %s%% week-over-week. This may indicate capacity for expansion or upsell follow-up.',
          round(v_growth)
        ),
        jsonb_build_object(
          'completed_recent', v_completed_recent,
          'growth_pct', round(v_growth),
          'method', 'positive_trend'
        ),
        'Consider proactive outreach to active customers or leads while momentum is strong.',
        0.65,
        current_date + 14
      );
      v_count := 1;
    end if;
  end if;

  return v_count;
end;
$$;

create or replace function public.detect_pie_followup_risk_for_tenant(p_tenant_id uuid)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int := 0;
  v_upcoming int;
  v_model_id uuid;
begin
  if not exists (
    select 1 from public.aipify_prediction_settings s
    where s.tenant_id = p_tenant_id and s.enabled and s.allow_followup_predictions
  ) then return 0; end if;

  v_model_id := public._pie_model_id(p_tenant_id, 'followup_risk');

  select count(*) into v_upcoming
  from public.aipify_workflow_events e
  where e.tenant_id = p_tenant_id
    and e.event_type in ('followup_promised', 'reminder_sent')
    and e.occurred_at > now() - interval '14 days'
    and (
      e.occurred_at + (coalesce((e.event_payload->>'expected_hours')::int, 48) || ' hours')::interval
    ) between now() and now() + interval '7 days'
    and not exists (
      select 1 from public.aipify_workflow_events c
      where c.tenant_id = e.tenant_id and c.source_id = e.source_id
        and c.event_type in ('completed', 'replied')
        and c.occurred_at > e.occurred_at
    );

  if v_upcoming >= 1 then
    if not exists (
      select 1 from public.aipify_predictive_alerts a
      where a.tenant_id = p_tenant_id
        and a.alert_type = 'followup_risk'
        and a.status in ('open', 'acknowledged')
        and a.created_at > now() - interval '24 hours'
    ) then
      insert into public.aipify_predictive_alerts (
        tenant_id, model_id, alert_type, severity, title, summary, evidence,
        recommendation, confidence_score, predicted_date
      )
      values (
        p_tenant_id, v_model_id, 'followup_risk', 'medium',
        'Follow-up commitments may be missed soon',
        format(
          '%s promised follow-ups are due within the next 7 days without matching activity yet.',
          v_upcoming
        ),
        jsonb_build_object('upcoming_count', v_upcoming, 'lookahead_days', 7, 'method', 'promise_schedule'),
        'Create reminders or draft follow-up messages before commitments expire.',
        0.7,
        current_date + 7
      );
      v_count := 1;
    end if;
  end if;

  return v_count;
end;
$$;

create or replace function public.run_pie_detection_jobs(p_tenant_id uuid default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_bottlenecks int;
  v_churn int;
  v_workload int;
  v_sla int;
  v_growth int;
  v_followup int;
begin
  v_tenant_id := coalesce(p_tenant_id, public._presence_tenant_for_auth());
  if v_tenant_id is null then raise exception 'No tenant'; end if;
  if not public._pie_package_allows(v_tenant_id) then raise exception 'Upgrade required'; end if;

  perform public.ensure_pie_prediction_settings(v_tenant_id);
  perform public.seed_pie_prediction_models(v_tenant_id);

  v_bottlenecks := public.detect_pie_future_bottlenecks_for_tenant(v_tenant_id);
  v_churn := public.detect_pie_customer_inactivity_for_tenant(v_tenant_id);
  v_workload := public.detect_pie_workload_risk_for_tenant(v_tenant_id);
  v_sla := public.detect_pie_sla_risk_for_tenant(v_tenant_id);
  v_growth := public.detect_pie_growth_opportunities_for_tenant(v_tenant_id);
  v_followup := public.detect_pie_followup_risk_for_tenant(v_tenant_id);

  perform public._pie_log_audit(
    v_tenant_id, 'system', 'run_detection_jobs', null, null,
    jsonb_build_object(
      'future_bottleneck', v_bottlenecks,
      'churn_risk', v_churn,
      'workload_risk', v_workload,
      'sla_risk', v_sla,
      'growth_opportunity', v_growth,
      'followup_risk', v_followup
    )
  );

  return jsonb_build_object(
    'future_bottleneck', v_bottlenecks,
    'churn_risk', v_churn,
    'workload_risk', v_workload,
    'sla_risk', v_sla,
    'growth_opportunity', v_growth,
    'followup_risk', v_followup
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 8. Alert status + center
-- ---------------------------------------------------------------------------
create or replace function public.update_predictive_alert_status(
  p_alert_id uuid,
  p_status text,
  p_snooze_until timestamptz default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_alert public.aipify_predictive_alerts;
  v_settings public.aipify_prediction_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;

  select * into v_alert
  from public.aipify_predictive_alerts
  where id = p_alert_id and tenant_id = v_tenant_id;

  if not found then raise exception 'Alert not found'; end if;

  v_settings := public.ensure_pie_prediction_settings(v_tenant_id);

  if not public._pie_can_view_alert(v_alert, v_settings) then
    raise exception 'Access denied';
  end if;

  if p_status in ('dismissed', 'resolved', 'snoozed') then
    perform public._pie_require_admin();
  end if;

  update public.aipify_predictive_alerts
  set
    status = p_status,
    acknowledged_at = case when p_status = 'acknowledged' then now() else acknowledged_at end,
    snoozed_until = case when p_status = 'snoozed' then p_snooze_until else snoozed_until end,
    resolved_at = case when p_status in ('resolved', 'dismissed') then now() else resolved_at end,
    updated_at = now()
  where id = p_alert_id
  returning * into v_alert;

  perform public._pie_log_audit(
    v_tenant_id, 'user', 'update_predictive_alert_status', 'predictive_alert', p_alert_id,
    jsonb_build_object('status', p_status)
  );

  return public._pie_alert_json(v_alert);
end;
$$;

create or replace function public.get_customer_predictions_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_plan text;
  v_settings public.aipify_prediction_settings;
  v_alerts jsonb;
  v_open int;
  v_upcoming int;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_plan := public._pie_tenant_plan(v_tenant_id);

  if not public._pie_package_allows(v_tenant_id) then
    return jsonb_build_object(
      'has_customer', true,
      'has_access', false,
      'upgrade_required', true,
      'plan', v_plan,
      'privacy_note', 'Predictive Intelligence forecasts workflow and process risks — not employee surveillance.'
    );
  end if;

  v_settings := public.ensure_pie_prediction_settings(v_tenant_id);
  perform public.seed_pie_prediction_models(v_tenant_id);

  if not v_settings.enabled then
    return jsonb_build_object(
      'has_customer', true,
      'has_access', true,
      'enabled', false,
      'upgrade_required', false,
      'plan', v_plan,
      'privacy_note', 'Enable Predictive Intelligence in settings to receive forward-looking alerts.',
      'settings_url', '/app/settings/predictions'
    );
  end if;

  if not exists (
    select 1 from public.aipify_predictive_alerts a
    where a.tenant_id = v_tenant_id
      and a.created_at::date = current_date
  ) then
    perform public.run_pie_detection_jobs(v_tenant_id);
  end if;

  v_alerts := coalesce(
    (
      select jsonb_agg(public._pie_alert_json(a) order by
        case a.severity
          when 'critical' then 1 when 'high' then 2 when 'medium' then 3 when 'low' then 4 else 5
        end,
        a.predicted_date nulls last,
        a.created_at desc
      )
      from public.aipify_predictive_alerts a
      where a.tenant_id = v_tenant_id
        and a.status in ('open', 'acknowledged')
        and public._pie_can_view_alert(a, v_settings)
        and (a.snoozed_until is null or a.snoozed_until < now())
    ),
    '[]'::jsonb
  );

  select count(*) into v_open
  from public.aipify_predictive_alerts a
  where a.tenant_id = v_tenant_id
    and a.status in ('open', 'acknowledged');

  select count(*) into v_upcoming
  from public.aipify_predictive_alerts a
  where a.tenant_id = v_tenant_id
    and a.status in ('open', 'acknowledged')
    and a.predicted_date between current_date and current_date + 7;

  perform public._pie_log_audit(v_tenant_id, 'user', 'view_predictions_center', null, null, '{}'::jsonb);

  return jsonb_build_object(
    'has_customer', true,
    'has_access', true,
    'enabled', true,
    'upgrade_required', false,
    'plan', v_plan,
    'privacy_note', 'Predictions are based on workflow trends and thresholds you enable. All alert actions are logged.',
    'open_alerts', v_open,
    'upcoming_week', v_upcoming,
    'prediction_horizon_days', v_settings.prediction_horizon_days,
    'alerts', v_alerts,
    'resolved_recent', coalesce(
      (
        select jsonb_agg(public._pie_alert_json(a) order by a.resolved_at desc)
        from public.aipify_predictive_alerts a
        where a.tenant_id = v_tenant_id
          and a.status in ('resolved', 'dismissed')
          and a.resolved_at > now() - interval '7 days'
        limit 5
      ),
      '[]'::jsonb
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 9. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_customer_predictions_center() to authenticated;
grant execute on function public.get_prediction_settings() to authenticated;
grant execute on function public.update_prediction_settings(jsonb) to authenticated;
grant execute on function public.run_pie_detection_jobs(uuid) to authenticated;
grant execute on function public.update_predictive_alert_status(uuid, text, timestamptz) to authenticated;
