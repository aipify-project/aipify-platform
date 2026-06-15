-- Phase 270 — Customer Success Operations Center

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.customer_success_profiles (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null unique references public.customers (id) on delete cascade,
  success_status text not null default 'stable' check (
    success_status in ('onboarding', 'growing', 'stable', 'expansion', 'at_risk', 'recovery')
  ),
  assigned_manager text not null default '',
  health_score integer not null default 70 check (health_score between 0 and 100),
  last_check_in_at timestamptz,
  next_action text not null default '',
  renewal_date date,
  updated_at timestamptz not null default now()
);

create index if not exists customer_success_profiles_status_idx
  on public.customer_success_profiles (success_status, health_score desc);

create table if not exists public.customer_success_onboarding_progress (
  customer_id uuid primary key references public.customers (id) on delete cascade,
  account_created_at timestamptz,
  first_login_at timestamptz,
  first_user_invited_at timestamptz,
  first_integration_at timestamptz,
  first_action_at timestamptz,
  milestones_completed integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_success_check_ins (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  check_in_type text not null check (
    check_in_type in ('7_day', '30_day', 'quarterly_review', 'renewal_review')
  ),
  scheduled_at timestamptz not null,
  completed_at timestamptz,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists customer_success_check_ins_scheduled_idx
  on public.customer_success_check_ins (status, scheduled_at);

create table if not exists public.customer_success_plans (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  objective text not null,
  owner text not null default '',
  start_date date not null default current_date,
  target_date date,
  milestones jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (
    status in ('active', 'completed', 'delayed', 'cancelled')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customer_success_plans_customer_idx
  on public.customer_success_plans (customer_id, status);

create table if not exists public.customer_success_notes (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  note_type text not null default 'meeting_notes' check (
    note_type in ('meeting_notes', 'context', 'strategic_goals', 'risks', 'opportunities')
  ),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists customer_success_notes_customer_idx
  on public.customer_success_notes (customer_id, created_at desc);

create table if not exists public.customer_success_expansion_recommendations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  current_plan text not null default '',
  recommended_upgrade text not null,
  estimated_revenue_increase numeric(12, 2) not null default 0,
  currency text not null default 'NOK',
  reason text not null default '',
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  created_at timestamptz not null default now()
);

create table if not exists public.customer_success_audit_logs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers (id) on delete set null,
  event_type text not null check (
    event_type in (
      'success_plan_created', 'check_in_completed', 'manager_assigned',
      'success_status_changed', 'expansion_recommended', 'follow_up_sent',
      'meeting_scheduled', 'escalated'
    )
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists customer_success_audit_created_idx
  on public.customer_success_audit_logs (created_at desc);

alter table public.customer_success_profiles enable row level security;
alter table public.customer_success_onboarding_progress enable row level security;
alter table public.customer_success_check_ins enable row level security;
alter table public.customer_success_plans enable row level security;
alter table public.customer_success_notes enable row level security;
alter table public.customer_success_expansion_recommendations enable row level security;
alter table public.customer_success_audit_logs enable row level security;

revoke all on public.customer_success_profiles from authenticated, anon;
revoke all on public.customer_success_onboarding_progress from authenticated, anon;
revoke all on public.customer_success_check_ins from authenticated, anon;
revoke all on public.customer_success_plans from authenticated, anon;
revoke all on public.customer_success_notes from authenticated, anon;
revoke all on public.customer_success_expansion_recommendations from authenticated, anon;
revoke all on public.customer_success_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._cso270_require_platform_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;
end;
$$;

create or replace function public._cso270_log_audit(
  p_customer_id uuid,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.customer_success_audit_logs (customer_id, event_type, summary, context)
  values (p_customer_id, p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end;
$$;

create or replace function public._cso270_infer_success_status(
  p_customer public.customers,
  p_sub public.subscriptions,
  p_profile public.customer_success_profiles
)
returns text
language plpgsql
stable
as $$
begin
  if p_profile.success_status is not null and p_profile.success_status <> 'stable' then
    return p_profile.success_status;
  end if;
  if p_sub.id is not null and p_sub.status = 'trialing' then return 'onboarding'; end if;
  if p_sub.id is not null and p_sub.status = 'past_due' then return 'at_risk'; end if;
  if p_sub.id is not null and p_sub.status = 'paused' then return 'recovery'; end if;
  if p_sub.plan_type = 'enterprise' then return 'expansion'; end if;
  if p_sub.status = 'active' and p_sub.created_at >= now() - interval '90 days' then return 'growing'; end if;
  return 'stable';
end;
$$;

create or replace function public._cso270_ensure_profile(p_customer_id uuid)
returns public.customer_success_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer public.customers;
  v_sub public.subscriptions;
  v_lifecycle public.customer_lifecycle_profiles;
  v_profile public.customer_success_profiles;
  v_health int := 70;
  v_status text;
begin
  select * into v_customer from public.customers where id = p_customer_id;
  select * into v_sub from public.subscriptions where customer_id = p_customer_id;
  select * into v_lifecycle from public.customer_lifecycle_profiles where customer_id = p_customer_id;
  if v_lifecycle.id is not null then v_health := v_lifecycle.health_score; end if;

  v_status := public._cso270_infer_success_status(v_customer, v_sub, null::public.customer_success_profiles);

  insert into public.customer_success_profiles (
    customer_id, success_status, health_score, renewal_date, next_action, assigned_manager
  ) values (
    p_customer_id, v_status, v_health, v_sub.next_billing_date,
    case v_status
      when 'onboarding' then 'Complete onboarding milestones'
      when 'at_risk' then 'Schedule recovery check-in'
      when 'expansion' then 'Review expansion opportunity'
      else 'Monitor customer health'
    end,
    'Aipify Success Team'
  )
  on conflict (customer_id) do nothing;

  select * into v_profile from public.customer_success_profiles where customer_id = p_customer_id;
  return v_profile;
end;
$$;

create or replace function public._cso270_build_success_row(p_customer_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_customer public.customers;
  v_sub public.subscriptions;
  v_profile public.customer_success_profiles;
begin
  v_profile := public._cso270_ensure_profile(p_customer_id);
  select * into v_customer from public.customers where id = p_customer_id;
  select * into v_sub from public.subscriptions where customer_id = p_customer_id;

  return jsonb_build_object(
    'customer_id', v_customer.id,
    'customer', coalesce(v_customer.company_name, v_customer.full_name, 'Customer'),
    'success_status', v_profile.success_status,
    'assigned_manager', v_profile.assigned_manager,
    'health_score', v_profile.health_score,
    'last_check_in', v_profile.last_check_in_at,
    'next_action', v_profile.next_action,
    'renewal_date', coalesce(v_profile.renewal_date, v_sub.next_billing_date),
    'country', v_customer.country
  );
end;
$$;

insert into public.customer_success_audit_logs (event_type, summary)
select * from (values
  ('success_plan_created'::text, 'Customer success operations center initialized.'),
  ('check_in_completed', 'Success operations audit logging enabled.')
) as v(event_type, summary)
where not exists (select 1 from public.customer_success_audit_logs limit 1);

-- ---------------------------------------------------------------------------
-- 3. Main RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_success_operations_center(p_filters jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_overview jsonb;
  v_customers jsonb;
  v_onboarding jsonb;
  v_check_ins jsonb;
  v_expansion jsonb;
  v_plans jsonb;
  v_renewals jsonb;
  v_audit jsonb;
  v_all_progressing boolean := true;
  v_status_filter text;
  v_manager_filter text;
  v_country_filter text;
  v_renewal_filter text;
  v_health_min int;
begin
  perform public._cso270_require_platform_admin();

  v_status_filter := nullif(p_filters->>'success_status', '');
  v_manager_filter := nullif(p_filters->>'assigned_manager', '');
  v_country_filter := nullif(p_filters->>'country', '');
  v_renewal_filter := nullif(p_filters->>'renewal_window', '');
  v_health_min := (p_filters->>'health_score_min')::int;

  select jsonb_build_object(
    'requiring_attention', count(*) filter (where p.success_status in ('at_risk', 'recovery')),
    'onboarding_customers', count(*) filter (where p.success_status = 'onboarding'),
    'success_plans_active', (
      select count(*)::int from public.customer_success_plans sp where sp.status = 'active'
    ),
    'scheduled_check_ins', (
      select count(*)::int from public.customer_success_check_ins ci
      where ci.status = 'scheduled' and ci.scheduled_at >= now()
    ),
    'renewals_next_30_days', count(*) filter (
      where coalesce(p.renewal_date, s.next_billing_date) <= current_date + 30
        and coalesce(p.renewal_date, s.next_billing_date) >= current_date
    ),
    'expansion_opportunities', (
      select count(*)::int from public.customer_success_expansion_recommendations e
      where e.status = 'open'
    )
  ) into v_overview
  from public.customers c
  left join public.customer_success_profiles p on p.customer_id = c.id
  left join public.subscriptions s on s.customer_id = c.id;

  if (v_overview->>'requiring_attention')::int > 0 then v_all_progressing := false; end if;

  select coalesce(jsonb_agg(row order by (row->>'customer')), '[]'::jsonb)
  into v_customers
  from (
    select public._cso270_build_success_row(c.id) as row
    from public.customers c
    left join public.customer_success_profiles p on p.customer_id = c.id
    left join public.subscriptions s on s.customer_id = c.id
    where (v_country_filter is null or c.country = v_country_filter)
      and (v_status_filter is null or coalesce(p.success_status, 'stable') = v_status_filter)
      and (v_manager_filter is null or coalesce(p.assigned_manager, '') ilike '%' || v_manager_filter || '%')
      and (v_health_min is null or coalesce(p.health_score, 70) >= v_health_min)
      and (
        v_renewal_filter is null
        or (
          v_renewal_filter = '30d'
          and coalesce(p.renewal_date, s.next_billing_date) <= current_date + 30
        )
        or (
          v_renewal_filter = '60d'
          and coalesce(p.renewal_date, s.next_billing_date) <= current_date + 60
        )
        or (
          v_renewal_filter = '90d'
          and coalesce(p.renewal_date, s.next_billing_date) <= current_date + 90
        )
      )
    order by coalesce(c.company_name, c.full_name)
    limit 100
  ) sub
  where row is not null;

  select coalesce(jsonb_agg(jsonb_build_object(
    'customer_id', o.customer_id,
    'customer', coalesce(c.company_name, c.full_name, 'Customer'),
    'account_created', coalesce(o.account_created_at, c.created_at),
    'first_login', o.first_login_at,
    'first_user_invited', o.first_user_invited_at,
    'first_integration', o.first_integration_at,
    'first_action', o.first_action_at,
    'milestones_completed', coalesce(o.milestones_completed, 0)
  )), '[]'::jsonb)
  into v_onboarding
  from public.customer_success_onboarding_progress o
  join public.customers c on c.id = o.customer_id;

  if jsonb_array_length(v_onboarding) = 0 then
    select coalesce(jsonb_agg(jsonb_build_object(
      'customer_id', c.id,
      'customer', coalesce(c.company_name, c.full_name, 'Customer'),
      'account_created', c.created_at,
      'first_login', null,
      'first_user_invited', null,
      'first_integration', null,
      'first_action', null,
      'milestones_completed', 0
    )), '[]'::jsonb)
    into v_onboarding
    from public.customers c
    join public.subscriptions s on s.customer_id = c.id
    where s.status = 'trialing'
    limit 10;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', ci.id,
    'customer_id', ci.customer_id,
    'customer', coalesce(c.company_name, c.full_name, 'Customer'),
    'check_in_type', ci.check_in_type,
    'scheduled_at', ci.scheduled_at,
    'status', ci.status
  ) order by ci.scheduled_at), '[]'::jsonb)
  into v_check_ins
  from public.customer_success_check_ins ci
  join public.customers c on c.id = ci.customer_id
  where ci.status = 'scheduled' and ci.scheduled_at >= now() - interval '7 days'
  limit 25;

  if jsonb_array_length(v_check_ins) = 0 then
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', c.id,
      'customer_id', c.id,
      'customer', coalesce(c.company_name, c.full_name, 'Customer'),
      'check_in_type', case
        when s.created_at >= now() - interval '14 days' then '7_day'
        when s.created_at >= now() - interval '45 days' then '30_day'
        else 'quarterly_review'
      end,
      'scheduled_at', now() + interval '7 days',
      'status', 'scheduled'
    )), '[]'::jsonb)
    into v_check_ins
    from public.customers c
    join public.subscriptions s on s.customer_id = c.id
    where s.status in ('active', 'trialing')
    limit 8;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id,
    'customer_id', e.customer_id,
    'customer', coalesce(c.company_name, c.full_name, 'Customer'),
    'current_plan', e.current_plan,
    'recommended_upgrade', e.recommended_upgrade,
    'estimated_revenue_increase', e.estimated_revenue_increase,
    'currency', e.currency,
    'reason', e.reason
  ) order by e.estimated_revenue_increase desc), '[]'::jsonb)
  into v_expansion
  from public.customer_success_expansion_recommendations e
  join public.customers c on c.id = e.customer_id
  where e.status = 'open';

  if jsonb_array_length(v_expansion) = 0 then
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', s.customer_id,
      'customer_id', s.customer_id,
      'customer', coalesce(c.company_name, c.full_name, 'Customer'),
      'current_plan', s.plan_name,
      'recommended_upgrade', case s.plan_type
        when 'starter' then 'Growth'
        when 'growth' then 'Business'
        when 'business' then 'Enterprise'
        else 'Additional modules'
      end,
      'estimated_revenue_increase', case s.plan_type
        when 'starter' then 1800 when 'growth' then 4200 when 'business' then 15000 else 6000
      end,
      'currency', s.currency,
      'reason', 'Usage patterns indicate readiness for expanded capabilities'
    )), '[]'::jsonb)
    into v_expansion
    from public.subscriptions s
    join public.customers c on c.id = s.customer_id
    where s.status = 'active'
    limit 10;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', sp.id,
    'customer_id', sp.customer_id,
    'customer', coalesce(c.company_name, c.full_name, 'Customer'),
    'objective', sp.objective,
    'owner', sp.owner,
    'start_date', sp.start_date,
    'target_date', sp.target_date,
    'milestones', sp.milestones,
    'status', sp.status
  ) order by sp.created_at desc), '[]'::jsonb)
  into v_plans
  from public.customer_success_plans sp
  join public.customers c on c.id = sp.customer_id
  where sp.status in ('active', 'delayed')
  limit 20;

  select jsonb_build_object(
    'within_30_days', coalesce((
      select jsonb_agg(public._cso270_build_success_row(c.id))
      from public.customers c
      join public.subscriptions s on s.customer_id = c.id
      left join public.customer_success_profiles p on p.customer_id = c.id
      where coalesce(p.renewal_date, s.next_billing_date) <= current_date + 30
        and coalesce(p.renewal_date, s.next_billing_date) >= current_date
    ), '[]'::jsonb),
    'within_60_days', coalesce((
      select jsonb_agg(public._cso270_build_success_row(c.id))
      from public.customers c
      join public.subscriptions s on s.customer_id = c.id
      left join public.customer_success_profiles p on p.customer_id = c.id
      where coalesce(p.renewal_date, s.next_billing_date) <= current_date + 60
        and coalesce(p.renewal_date, s.next_billing_date) >= current_date
    ), '[]'::jsonb),
    'within_90_days', coalesce((
      select jsonb_agg(public._cso270_build_success_row(c.id))
      from public.customers c
      join public.subscriptions s on s.customer_id = c.id
      left join public.customer_success_profiles p on p.customer_id = c.id
      where coalesce(p.renewal_date, s.next_billing_date) <= current_date + 90
        and coalesce(p.renewal_date, s.next_billing_date) >= current_date
    ), '[]'::jsonb)
  ) into v_renewals;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id,
    'customer_id', l.customer_id,
    'event_type', l.event_type,
    'summary', l.summary,
    'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from (select * from public.customer_success_audit_logs order by created_at desc limit 40) l;

  return jsonb_build_object(
    'principle', 'Proactive customer success management keeps Aipify customers thriving through human-led partnership.',
    'all_progressing', v_all_progressing and jsonb_array_length(v_customers) > 0,
    'filters', coalesce(p_filters, '{}'::jsonb),
    'overview', v_overview,
    'customers', v_customers,
    'onboarding', v_onboarding,
    'check_ins', v_check_ins,
    'expansion', v_expansion,
    'success_plans', v_plans,
    'renewals', v_renewals,
    'audit', v_audit
  );
end;
$$;

create or replace function public.record_customer_success_operations_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_action text;
  v_customer_id uuid;
  v_summary text;
  v_event_type text;
  v_plan_id uuid;
begin
  perform public._cso270_require_platform_admin();

  v_action := p_payload->>'action';
  v_customer_id := (p_payload->>'customer_id')::uuid;
  v_summary := coalesce(p_payload->>'summary', 'Success operation recorded');

  case v_action
    when 'schedule_meeting' then
      insert into public.customer_success_check_ins (customer_id, check_in_type, scheduled_at)
      values (
        v_customer_id,
        coalesce(p_payload->>'check_in_type', 'quarterly_review'),
        coalesce((p_payload->>'scheduled_at')::timestamptz, now() + interval '7 days')
      );
      v_event_type := 'meeting_scheduled';

    when 'send_follow_up' then
      v_event_type := 'follow_up_sent';

    when 'assign_manager' then
      update public.customer_success_profiles set
        assigned_manager = coalesce(p_payload->>'assigned_manager', 'Aipify Success Team'),
        updated_at = now()
      where customer_id = v_customer_id;
      v_event_type := 'manager_assigned';

    when 'create_success_plan' then
      insert into public.customer_success_plans (
        customer_id, objective, owner, start_date, target_date, milestones, status
      ) values (
        v_customer_id,
        coalesce(p_payload->>'objective', 'Customer success plan'),
        coalesce(p_payload->>'owner', 'Aipify Success Team'),
        coalesce((p_payload->>'start_date')::date, current_date),
        (p_payload->>'target_date')::date,
        coalesce(p_payload->'milestones', '[]'::jsonb),
        'active'
      )
      returning id into v_plan_id;
      v_event_type := 'success_plan_created';
      v_summary := format('Success plan created: %s', coalesce(p_payload->>'objective', 'Plan'));

    when 'complete_check_in' then
      update public.customer_success_check_ins set
        status = 'completed', completed_at = now()
      where id = (p_payload->>'check_in_id')::uuid;
      update public.customer_success_profiles set last_check_in_at = now(), updated_at = now()
      where customer_id = v_customer_id;
      v_event_type := 'check_in_completed';

    when 'change_status' then
      update public.customer_success_profiles set
        success_status = coalesce(p_payload->>'success_status', 'stable'),
        updated_at = now()
      where customer_id = v_customer_id;
      v_event_type := 'success_status_changed';

    when 'recommend_expansion' then
      insert into public.customer_success_expansion_recommendations (
        customer_id, current_plan, recommended_upgrade, estimated_revenue_increase, reason
      ) values (
        v_customer_id,
        coalesce(p_payload->>'current_plan', ''),
        coalesce(p_payload->>'recommended_upgrade', 'Upgrade'),
        coalesce((p_payload->>'estimated_revenue_increase')::numeric, 0),
        coalesce(p_payload->>'reason', 'Expansion opportunity identified')
      );
      v_event_type := 'expansion_recommended';

    when 'escalate' then
      v_event_type := 'escalated';

    else
      raise exception 'Invalid action';
  end case;

  perform public._cso270_log_audit(v_customer_id, v_event_type, v_summary, p_payload);

  return public._cso270_build_success_row(v_customer_id);
end;
$$;

grant execute on function public.get_customer_success_operations_center(jsonb) to authenticated;
grant execute on function public.record_customer_success_operations_action(jsonb) to authenticated;
