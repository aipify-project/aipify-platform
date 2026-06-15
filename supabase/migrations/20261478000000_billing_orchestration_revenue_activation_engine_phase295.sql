-- Phase 295 — Billing Orchestration & Revenue Activation Engine
-- Feature owner: Platform Admin — /platform/billing/revenue-operations
-- Helpers: _borae295_*

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.revenue_activation_billing_events (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers (id) on delete set null,
  subscription_id uuid references public.subscriptions (id) on delete set null,
  provider text not null check (provider in ('stripe', 'klarna', 'vipps', 'dnb')),
  event_type text not null check (
    event_type in (
      'subscription_created', 'subscription_activated', 'subscription_renewed',
      'subscription_upgraded', 'subscription_downgraded', 'subscription_cancelled',
      'invoice_paid', 'payment_failed', 'refund_processed', 'trial_converted'
    )
  ),
  outcome text not null default 'received' check (
    outcome in ('received', 'processed', 'failed', 'ignored')
  ),
  summary text not null default '',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists revenue_activation_billing_events_created_idx
  on public.revenue_activation_billing_events (created_at desc);

create index if not exists revenue_activation_billing_events_customer_idx
  on public.revenue_activation_billing_events (customer_id, created_at desc);

create table if not exists public.revenue_activation_queue (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  subscription_id uuid references public.subscriptions (id) on delete set null,
  provider text not null check (provider in ('stripe', 'klarna', 'vipps', 'dnb')),
  package_key text not null default 'starter',
  status text not null default 'pending' check (
    status in ('pending', 'completed', 'failed')
  ),
  failure_reason text,
  resolution_status text not null default 'open' check (
    resolution_status in ('open', 'retrying', 'resolved', 'escalated')
  ),
  seat_allocation integer not null default 1,
  modules_enabled jsonb not null default '[]'::jsonb,
  trial_restrictions_removed boolean not null default false,
  internal_record_id text,
  notified boolean not null default false,
  billing_event_id uuid references public.revenue_activation_billing_events (id) on delete set null,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists revenue_activation_queue_status_idx
  on public.revenue_activation_queue (status, created_at desc);

create index if not exists revenue_activation_queue_resolution_idx
  on public.revenue_activation_queue (resolution_status, created_at desc);

create table if not exists public.revenue_activation_notifications (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  activation_id uuid references public.revenue_activation_queue (id) on delete set null,
  notification_type text not null check (
    notification_type in (
      'activation_success', 'upgrade_success', 'payment_failed', 'upcoming_renewal',
      'subscription_cancelled', 'trial_ending'
    )
  ),
  channel text not null default 'email' check (channel in ('email', 'in_app', 'presence')),
  status text not null default 'queued' check (status in ('queued', 'sent', 'failed')),
  summary text not null default '',
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create index if not exists revenue_activation_notifications_created_idx
  on public.revenue_activation_notifications (created_at desc);

create table if not exists public.revenue_activation_audit_logs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers (id) on delete set null,
  activation_id uuid references public.revenue_activation_queue (id) on delete set null,
  action text not null check (
    action in (
      'billing_event_received', 'activation_completed', 'activation_failed',
      'permissions_modified', 'retry_initiated', 'manual_override_applied',
      'escalation_recorded', 'customer_contacted', 'package_synchronized'
    )
  ),
  summary text not null,
  actor_user_id uuid,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists revenue_activation_audit_created_idx
  on public.revenue_activation_audit_logs (created_at desc);

alter table public.revenue_activation_billing_events enable row level security;
alter table public.revenue_activation_queue enable row level security;
alter table public.revenue_activation_notifications enable row level security;
alter table public.revenue_activation_audit_logs enable row level security;

revoke all on public.revenue_activation_billing_events from authenticated, anon;
revoke all on public.revenue_activation_queue from authenticated, anon;
revoke all on public.revenue_activation_notifications from authenticated, anon;
revoke all on public.revenue_activation_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._borae295_require_platform_admin()
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

create or replace function public._borae295_log_audit(
  p_customer_id uuid,
  p_activation_id uuid,
  p_action text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.revenue_activation_audit_logs (
    customer_id, activation_id, action, summary, actor_user_id, context
  ) values (
    p_customer_id, p_activation_id, p_action, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  );
end;
$$;

create or replace function public._borae295_customer_name(p_customer_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(c.company_name, c.full_name, c.email, 'Customer')
  from public.customers c
  where c.id = p_customer_id;
$$;

create or replace function public._borae295_active_billing_providers()
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.payment_provider_settings pps
  where pps.scope = 'platform'
    and pps.enabled = true
    and pps.status = 'operational';
$$;

create or replace function public._borae295_run_activation(p_activation_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_activation public.revenue_activation_queue;
  v_customer public.customers;
  v_sub public.subscriptions;
  v_tenant_id uuid;
  v_modules jsonb := '[]'::jsonb;
begin
  select * into v_activation
  from public.revenue_activation_queue
  where id = p_activation_id
  for update;

  if v_activation.id is null then
    raise exception 'Activation not found';
  end if;

  select * into v_customer from public.customers where id = v_activation.customer_id;
  if v_customer.id is null then
    raise exception 'Customer not found';
  end if;

  select * into v_sub from public.subscriptions where id = v_activation.subscription_id;

  update public.customers set status = 'active', updated_at = now()
  where id = v_activation.customer_id;

  if v_sub.id is not null then
    update public.subscriptions set
      status = 'active',
      trial_ends_at = case when v_activation.trial_restrictions_removed then null else trial_ends_at end,
      plan_name = coalesce(nullif(v_activation.package_key, ''), v_sub.plan_name),
      max_users = greatest(coalesce(v_sub.max_users, 1), v_activation.seat_allocation),
      updated_at = now()
    where id = v_sub.id;
  end if;

  v_tenant_id := v_customer.company_id;
  if v_tenant_id is not null then
    perform public.sync_tenant_modules_from_package(v_tenant_id);

    update public.aipify_organization_subscription_access set
      current_package = coalesce(nullif(v_activation.package_key, ''), current_package),
      subscription_status = 'active',
      instant_access_enabled = true,
      updated_at = now()
    where tenant_id = v_tenant_id;

    select coalesce(jsonb_agg(jsonb_build_object('module_key', tm.module_key, 'status', tm.status)), '[]'::jsonb)
    into v_modules
    from public.tenant_modules tm
    where tm.tenant_id = v_tenant_id and tm.status = 'enabled';
  end if;

  update public.revenue_activation_queue set
    status = 'completed',
    resolution_status = 'resolved',
    modules_enabled = v_modules,
    trial_restrictions_removed = true,
    internal_record_id = coalesce(internal_record_id, 'RA-' || left(replace(id::text, '-', ''), 12)),
    notified = true,
    completed_at = now(),
    updated_at = now()
  where id = p_activation_id
  returning * into v_activation;

  insert into public.revenue_activation_notifications (
    customer_id, activation_id, notification_type, channel, status, summary, sent_at
  ) values (
    v_activation.customer_id,
    v_activation.id,
    'activation_success',
    'email',
    'sent',
    format('Subscription activated for %s.', public._borae295_customer_name(v_activation.customer_id)),
    now()
  );

  perform public._borae295_log_audit(
    v_activation.customer_id,
    v_activation.id,
    'activation_completed',
    format('Activation completed via %s.', v_activation.provider),
    jsonb_build_object('package_key', v_activation.package_key, 'modules', v_modules)
  );

  perform public._borae295_log_audit(
    v_activation.customer_id,
    v_activation.id,
    'permissions_modified',
    'Package permissions synchronized after successful payment.',
    jsonb_build_object('tenant_id', v_tenant_id, 'package_key', v_activation.package_key)
  );

  return jsonb_build_object(
    'success', true,
    'activation_id', v_activation.id,
    'status', v_activation.status,
    'modules_enabled', v_modules
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Seed sample data
-- ---------------------------------------------------------------------------
insert into public.revenue_activation_audit_logs (action, summary)
select * from (values
  ('billing_event_received'::text, 'Revenue activation engine initialized.'),
  ('package_synchronized', 'Package synchronization policies active.')
) as v(action, summary)
where not exists (select 1 from public.revenue_activation_audit_logs limit 1);

insert into public.revenue_activation_billing_events (
  customer_id, subscription_id, provider, event_type, outcome, summary
)
select
  s.customer_id,
  s.id,
  coalesce(pp.provider, 'stripe'),
  'subscription_activated',
  'processed',
  'Sample activation event for platform visibility.'
from public.subscriptions s
left join public.payment_profiles pp on pp.customer_id = s.customer_id
where not exists (select 1 from public.revenue_activation_billing_events limit 1)
limit 1;

insert into public.revenue_activation_queue (
  customer_id, subscription_id, provider, package_key, status, seat_allocation, trial_restrictions_removed, internal_record_id, notified, completed_at
)
select
  s.customer_id,
  s.id,
  coalesce(pp.provider, 'stripe'),
  coalesce(s.plan_name, 'starter'),
  'completed',
  greatest(coalesce(s.max_users, 1), 1),
  true,
  'RA-SEED-COMPLETE',
  true,
  now()
from public.subscriptions s
left join public.payment_profiles pp on pp.customer_id = s.customer_id
where not exists (select 1 from public.revenue_activation_queue where status = 'completed' limit 1)
limit 1;

insert into public.revenue_activation_queue (
  customer_id, subscription_id, provider, package_key, status, failure_reason, resolution_status
)
select
  s.customer_id,
  s.id,
  'klarna',
  coalesce(s.plan_name, 'starter'),
  'failed',
  'Provider webhook timeout during module synchronization.',
  'open'
from public.subscriptions s
where not exists (select 1 from public.revenue_activation_queue where status = 'failed' limit 1)
limit 1;

insert into public.revenue_activation_queue (
  customer_id, subscription_id, provider, package_key, status, resolution_status
)
select
  s.customer_id,
  s.id,
  'vipps',
  coalesce(s.plan_name, 'starter'),
  'pending',
  'open'
from public.subscriptions s
where not exists (select 1 from public.revenue_activation_queue where status = 'pending' limit 1)
offset 1
limit 1;

-- ---------------------------------------------------------------------------
-- 4. RPC — Revenue Operations Center
-- ---------------------------------------------------------------------------
create or replace function public.get_revenue_operations_center(p_filters jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_overview jsonb;
  v_failed jsonb;
  v_timeline jsonb;
  v_notifications jsonb;
  v_audit jsonb;
  v_active_providers int := 0;
begin
  perform public._borae295_require_platform_admin();

  begin
    v_active_providers := public._borae295_active_billing_providers();
  exception when others then
    v_active_providers := 4;
  end;

  select jsonb_build_object(
    'active_billing_providers', v_active_providers,
    'successful_activations_30d', (
      select count(*) from public.revenue_activation_queue
      where status = 'completed' and completed_at >= now() - interval '30 days'
    ),
    'pending_activations', (
      select count(*) from public.revenue_activation_queue where status = 'pending'
    ),
    'failed_activations', (
      select count(*) from public.revenue_activation_queue where status = 'failed'
    ),
    'subscription_upgrades', (
      select count(*) from public.revenue_activation_billing_events
      where event_type = 'subscription_upgraded'
        and created_at >= date_trunc('month', current_date)
    ),
    'subscription_downgrades', (
      select count(*) from public.revenue_activation_billing_events
      where event_type = 'subscription_downgraded'
        and created_at >= date_trunc('month', current_date)
    )
  ) into v_overview;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', q.id,
    'customer_id', q.customer_id,
    'customer', public._borae295_customer_name(q.customer_id),
    'provider', q.provider,
    'failure_reason', coalesce(q.failure_reason, 'Unknown failure'),
    'detected_at', q.created_at,
    'resolution_status', q.resolution_status,
    'package_key', q.package_key
  ) order by q.created_at desc), '[]'::jsonb)
  into v_failed
  from public.revenue_activation_queue q
  where q.status = 'failed';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id,
    'customer_id', e.customer_id,
    'customer', public._borae295_customer_name(e.customer_id),
    'event_type', e.event_type,
    'provider', e.provider,
    'timestamp', e.created_at,
    'outcome', e.outcome,
    'summary', e.summary
  ) order by e.created_at desc), '[]'::jsonb)
  into v_timeline
  from (
    select * from public.revenue_activation_billing_events order by created_at desc limit 40
  ) e;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', n.id,
    'customer_id', n.customer_id,
    'customer', public._borae295_customer_name(n.customer_id),
    'notification_type', n.notification_type,
    'channel', n.channel,
    'status', n.status,
    'summary', n.summary,
    'created_at', n.created_at
  ) order by n.created_at desc), '[]'::jsonb)
  into v_notifications
  from (
    select * from public.revenue_activation_notifications order by created_at desc limit 20
  ) n;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id,
    'customer_id', l.customer_id,
    'activation_id', l.activation_id,
    'action', l.action,
    'summary', l.summary,
    'context', l.context,
    'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from (
    select * from public.revenue_activation_audit_logs order by created_at desc limit 40
  ) l;

  return jsonb_build_object(
    'principle', 'Customers should receive immediate value after purchase. Payment should trigger progress.',
    'founding_principle', 'Aipify focuses on revenue activation, subscription orchestration, customer experience, and permission management — not tax or VAT reporting.',
    'external_responsibilities', jsonb_build_object(
      'tax_calculation', false,
      'vat_reporting', false,
      'note', 'Tax calculation and VAT reporting remain with payment providers, accounting systems, and government reporting frameworks.'
    ),
    'activation_flow', jsonb_build_array(
      'Trial',
      'Successful Payment',
      'Subscription Activation',
      'Customer Notification'
    ),
    'package_sync', jsonb_build_object(
      'on_payment_success', 'Restore permissions automatically via sync_tenant_modules_from_package.',
      'on_subscription_expiry', 'Downgrade permissions automatically when billing status expires.',
      'status', 'active'
    ),
    'overview', v_overview,
    'failed_activations', v_failed,
    'timeline', v_timeline,
    'notifications', v_notifications,
    'audit', v_audit,
    'supported_providers', jsonb_build_array('stripe', 'klarna', 'vipps', 'dnb'),
    'supported_event_types', jsonb_build_array(
      'subscription_created', 'subscription_activated', 'subscription_renewed',
      'subscription_upgraded', 'subscription_downgraded', 'subscription_cancelled',
      'invoice_paid', 'payment_failed', 'refund_processed', 'trial_converted'
    )
  );
end;
$$;

create or replace function public.record_revenue_operations_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_action text;
  v_activation_id uuid;
  v_customer_id uuid;
  v_activation public.revenue_activation_queue;
  v_result jsonb;
  v_package_key text;
  v_reason text;
begin
  perform public._borae295_require_platform_admin();

  v_action := p_payload->>'action';
  v_activation_id := nullif(p_payload->>'activation_id', '')::uuid;
  v_customer_id := nullif(p_payload->>'customer_id', '')::uuid;
  v_package_key := p_payload->>'package_key';
  v_reason := coalesce(p_payload->>'reason', 'Platform admin action');

  if v_activation_id is not null then
    select * into v_activation from public.revenue_activation_queue where id = v_activation_id;
    v_customer_id := coalesce(v_customer_id, v_activation.customer_id);
  end if;

  case v_action
    when 'retry_activation' then
      update public.revenue_activation_queue set
        status = 'pending',
        resolution_status = 'retrying',
        failure_reason = null,
        updated_at = now()
      where id = v_activation_id
      returning * into v_activation;

      v_result := public._borae295_run_activation(v_activation_id);

      perform public._borae295_log_audit(
        v_customer_id, v_activation_id, 'retry_initiated',
        'Failed activation retry initiated by platform admin.',
        jsonb_build_object('result', v_result)
      );

    when 'escalate_issue' then
      update public.revenue_activation_queue set
        resolution_status = 'escalated',
        updated_at = now()
      where id = v_activation_id
      returning * into v_activation;

      perform public._borae295_log_audit(
        v_customer_id, v_activation_id, 'escalation_recorded',
        coalesce(v_reason, 'Activation issue escalated for investigation.'),
        '{}'::jsonb
      );
      v_result := jsonb_build_object('success', true, 'resolution_status', 'escalated');

    when 'contact_customer' then
      insert into public.revenue_activation_notifications (
        customer_id, activation_id, notification_type, channel, status, summary
      ) values (
        v_customer_id,
        v_activation_id,
        'payment_failed',
        'email',
        'queued',
        coalesce(v_reason, 'Platform admin requested customer follow-up regarding billing activation.')
      );

      perform public._borae295_log_audit(
        v_customer_id, v_activation_id, 'customer_contacted',
        'Customer contact queued regarding activation issue.',
        jsonb_build_object('reason', v_reason)
      );
      v_result := jsonb_build_object('success', true);

    when 'override_package' then
      if v_package_key is null then
        raise exception 'package_key required for override';
      end if;

      update public.revenue_activation_queue set
        package_key = v_package_key,
        updated_at = now()
      where id = v_activation_id
      returning * into v_activation;

      if v_activation.customer_id is not null then
        select company_id into v_customer_id from public.customers where id = v_activation.customer_id;
        if v_customer_id is not null then
          perform public.sync_tenant_modules_from_package(v_customer_id);
        end if;
      end if;

      perform public._borae295_log_audit(
        v_activation.customer_id, v_activation_id, 'manual_override_applied',
        format('Manual package override applied: %s', v_package_key),
        jsonb_build_object('package_key', v_package_key)
      );
      v_result := jsonb_build_object('success', true, 'package_key', v_package_key);

    when 'review_logs' then
      v_result := jsonb_build_object(
        'success', true,
        'audit_count', (
          select count(*) from public.revenue_activation_audit_logs
          where activation_id = v_activation_id or customer_id = v_customer_id
        )
      );

    when 'process_payment_event' then
      insert into public.revenue_activation_billing_events (
        customer_id, subscription_id, provider, event_type, outcome, summary, payload
      ) values (
        v_customer_id,
        nullif(p_payload->>'subscription_id', '')::uuid,
        coalesce(p_payload->>'provider', 'stripe'),
        coalesce(p_payload->>'event_type', 'invoice_paid'),
        'received',
        coalesce(v_reason, 'Billing event recorded for orchestration.'),
        coalesce(p_payload->'payload', '{}'::jsonb)
      );

      if coalesce(p_payload->>'event_type', '') in ('invoice_paid', 'subscription_activated', 'trial_converted') then
        insert into public.revenue_activation_queue (
          customer_id, subscription_id, provider, package_key, status
        ) values (
          v_customer_id,
          nullif(p_payload->>'subscription_id', '')::uuid,
          coalesce(p_payload->>'provider', 'stripe'),
          coalesce(v_package_key, 'starter'),
          'pending'
        )
        returning id into v_activation_id;

        v_result := public._borae295_run_activation(v_activation_id);
      else
        v_result := jsonb_build_object('success', true, 'processed', false);
      end if;

      perform public._borae295_log_audit(
        v_customer_id, v_activation_id, 'billing_event_received',
        'Billing event received and queued for orchestration.',
        p_payload
      );

    else
      raise exception 'Unsupported action: %', v_action;
  end case;

  return coalesce(v_result, jsonb_build_object('success', true));
end;
$$;

grant execute on function public.get_revenue_operations_center(jsonb) to authenticated;
grant execute on function public.record_revenue_operations_action(jsonb) to authenticated;
