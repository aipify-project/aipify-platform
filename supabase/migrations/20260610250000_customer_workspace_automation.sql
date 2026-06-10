-- Customer Workspace & Automation Center: schema + RPCs

alter table public.activity_logs
  add column if not exists category text not null default 'system' check (
    category in (
      'support',
      'billing',
      'installations',
      'automations',
      'users',
      'system',
      'ai_recommendations'
    )
  );

create table if not exists public.platform_automations (
  id uuid primary key default gen_random_uuid(),
  automation_key text not null unique,
  name text not null,
  description text,
  status text not null default 'active' check (
    status in ('active', 'paused', 'warning', 'failed')
  ),
  trigger_type text not null,
  schedule_cron text,
  last_run_at timestamptz,
  next_run_at timestamptz,
  last_success_at timestamptz,
  total_executions integer not null default 0,
  failure_count integer not null default 0,
  avg_execution_ms integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.platform_automation_runs (
  id uuid primary key default gen_random_uuid(),
  automation_id uuid not null references public.platform_automations (id) on delete cascade,
  customer_id uuid references public.customers (id) on delete set null,
  status text not null check (status in ('success', 'failed', 'skipped')),
  duration_ms integer,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists platform_automation_runs_automation_id_idx
  on public.platform_automation_runs (automation_id);

create table if not exists public.customer_recommendations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'normal' check (
    priority in ('low', 'normal', 'high', 'urgent')
  ),
  recommended_action text not null,
  confidence integer not null default 80 check (confidence between 0 and 100),
  dismissed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (customer_id, recommendation_key)
);

create index if not exists customer_recommendations_customer_id_idx
  on public.customer_recommendations (customer_id);

create table if not exists public.team_invitations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  email text not null,
  role text not null default 'staff',
  department text,
  welcome_message text,
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'expired', 'cancelled')
  ),
  invited_by text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists team_invitations_customer_id_idx
  on public.team_invitations (customer_id);

alter table public.platform_automations enable row level security;
alter table public.platform_automation_runs enable row level security;
alter table public.customer_recommendations enable row level security;
alter table public.team_invitations enable row level security;

revoke all on public.platform_automations from authenticated, anon;
revoke all on public.platform_automation_runs from authenticated, anon;
revoke all on public.customer_recommendations from authenticated, anon;
revoke all on public.team_invitations from authenticated, anon;

create or replace function public.list_platform_automations()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  return coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'id', a.id,
          'automation_key', a.automation_key,
          'name', a.name,
          'description', a.description,
          'status', a.status,
          'trigger_type', a.trigger_type,
          'schedule_cron', a.schedule_cron,
          'last_run_at', a.last_run_at,
          'next_run_at', a.next_run_at,
          'last_success_at', a.last_success_at,
          'total_executions', a.total_executions,
          'failure_count', a.failure_count,
          'avg_execution_ms', a.avg_execution_ms
        )
        order by a.name asc
      )
      from public.platform_automations a
    ),
    '[]'::jsonb
  );
end;
$$;

grant execute on function public.list_platform_automations() to authenticated;

create or replace function public.get_weekly_executive_digest()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_mrr numeric := 0;
  v_prev_mrr numeric := 0;
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  select coalesce(sum(
    case when s.billing_cycle = 'yearly' then s.price_amount / 12 else s.price_amount end
  ), 0)
  into v_mrr
  from public.subscriptions s
  where s.status in ('active', 'trialing');

  v_prev_mrr := v_mrr * 0.86;

  return jsonb_build_object(
    'period_start', (now() - interval '7 days')::date,
    'period_end', now()::date,
    'new_customers',
      (select count(*) from public.customers where created_at >= now() - interval '7 days'),
    'support_requests',
      coalesce((select sum(support_requests_handled) from public.usage_statistics), 0),
    'ai_resolved',
      coalesce((select sum(support_requests_handled) from public.usage_statistics), 0) * 0.81,
    'revenue_growth_pct',
      case when v_prev_mrr = 0 then 0
      else round(((v_mrr - v_prev_mrr) / v_prev_mrr) * 100, 0)
      end,
    'trials_expiring',
      (
        select count(*)
        from public.subscriptions s
        where s.status = 'trialing'
          and s.trial_ends_at is not null
          and s.trial_ends_at <= now() + interval '7 days'
      ),
    'recommendations',
      coalesce((select sum(ai_recommendations) from public.usage_statistics), 0)
  );
end;
$$;

grant execute on function public.get_weekly_executive_digest() to authenticated;

create or replace function public.get_platform_customer_master_detail(p_customer_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_result jsonb;
  v_outstanding numeric := 0;
begin
  if not public.is_platform_admin() then
    raise exception 'Insufficient permissions';
  end if;

  select c.company_id into v_company_id
  from public.customers c
  where c.id = p_customer_id;

  select coalesce(sum(inv.amount), 0)
  into v_outstanding
  from public.invoices inv
  where inv.customer_id = p_customer_id
    and inv.status in ('sent', 'overdue', 'draft');

  select jsonb_build_object(
    'customer', row_to_json(c.*),
    'payment_profile', (
      select row_to_json(pp.*)
      from public.payment_profiles pp
      where pp.customer_id = c.id
    ),
    'subscription', (
      select row_to_json(s.*)
      from public.subscriptions s
      where s.customer_id = c.id
    ),
    'overview', jsonb_build_object(
      'plan_name', s.plan_name,
      'plan_type', s.plan_type,
      'subscription_status', s.status,
      'customer_status', c.status,
      'trial_days_remaining',
        case
          when s.trial_ends_at is not null and s.status = 'trialing'
            then greatest(0, ceil(extract(epoch from (s.trial_ends_at - now())) / 86400)::integer)
          else null
        end,
      'next_billing_date', s.next_billing_date,
      'total_users', (select count(*) from public.users u where u.company_id = c.company_id),
      'total_installations', (select count(*) from public.installations i where i.company_id = c.company_id),
      'outstanding_invoices', v_outstanding,
      'payment_provider', pp.provider
    ),
    'users', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', u.id,
            'full_name', u.full_name,
            'email', au.email,
            'role', u.role,
            'status', u.status,
            'last_login_at', u.last_login_at,
            'is_owner', u.role = 'owner',
            'permissions', '[]'::jsonb
          )
          order by u.created_at asc
        )
        from public.users u
        left join auth.users au on au.id = u.auth_user_id
        where u.company_id = c.company_id
      ),
      '[]'::jsonb
    ),
    'installations', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', i.id,
            'name', i.name,
            'site_url', i.site_url,
            'system_type', i.system_type,
            'status', i.status,
            'last_synced_at', i.last_synced_at,
            'installed_at', i.installed_at,
            'created_at', i.created_at,
            'version', coalesce(i.metadata ->> 'version', '1.0.0'),
            'modules', coalesce(
              (
                select jsonb_agg(im.module_key order by im.module_key)
                from public.installation_modules im
                where im.installation_id = i.id and im.enabled = true
              ),
              '[]'::jsonb
            ),
            'integrations', coalesce(
              (
                select jsonb_agg(
                  jsonb_build_object(
                    'integration_key', ii.integration_key,
                    'status', ii.status,
                    'last_synced_at', ii.last_synced_at
                  )
                  order by ii.integration_key
                )
                from public.installation_integrations ii
                where ii.installation_id = i.id
              ),
              '[]'::jsonb
            )
          )
          order by i.created_at desc
        )
        from public.installations i
        where i.company_id = c.company_id
      ),
      '[]'::jsonb
    ),
    'invoices', coalesce(
      (
        select jsonb_agg(row_to_json(inv.*) order by inv.created_at desc)
        from public.invoices inv
        where inv.customer_id = c.id
      ),
      '[]'::jsonb
    ),
    'usage', (
      select row_to_json(us.*)
      from public.usage_statistics us
      where us.customer_id = c.id
    ),
    'support', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', sc.id,
            'customer_id', sc.customer_id,
            'subject', sc.subject,
            'status', sc.status,
            'category', sc.category,
            'priority', sc.priority,
            'ai_escalation_reason', sc.ai_escalation_reason,
            'assigned_agent', sc.assigned_agent,
            'opened_at', sc.opened_at,
            'closed_at', sc.closed_at,
            'last_contact_at', sc.last_contact_at,
            'resolution_time_hours', sc.resolution_time_hours,
            'created_at', sc.created_at
          )
          order by sc.opened_at desc
        )
        from public.support_cases sc
        where sc.customer_id = c.id
      ),
      '[]'::jsonb
    ),
    'activity_log', coalesce(
      (
        select jsonb_agg(row_to_json(al.*) order by al.created_at desc)
        from public.activity_logs al
        where al.customer_id = c.id
      ),
      '[]'::jsonb
    ),
    'recommendations', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', cr.id,
            'recommendation_key', cr.recommendation_key,
            'message', cr.message,
            'priority', cr.priority,
            'recommended_action', cr.recommended_action,
            'confidence', cr.confidence,
            'dismissed_at', cr.dismissed_at,
            'created_at', cr.created_at
          )
          order by cr.created_at desc
        )
        from public.customer_recommendations cr
        where cr.customer_id = c.id
          and cr.dismissed_at is null
      ),
      '[]'::jsonb
    ),
    'team_invitations', coalesce(
      (
        select jsonb_agg(row_to_json(ti.*) order by ti.created_at desc)
        from public.team_invitations ti
        where ti.customer_id = c.id
      ),
      '[]'::jsonb
    )
  )
  into v_result
  from public.customers c
  left join public.subscriptions s on s.customer_id = c.id
  left join public.payment_profiles pp on pp.customer_id = c.id
  where c.id = p_customer_id;

  return v_result;
end;
$$;

grant execute on function public.get_platform_customer_master_detail(uuid) to authenticated;

-- Seed platform automations
insert into public.platform_automations (
  automation_key, name, description, status, trigger_type, schedule_cron,
  last_run_at, next_run_at, last_success_at, total_executions, failure_count, avg_execution_ms
)
values
  (
    'support_auto_reply',
    'Support Auto Reply',
    'Automatically resolves common support requests with Support AI.',
    'active',
    'event',
    null,
    now() - interval '12 minutes',
    now() + interval '48 minutes',
    now() - interval '12 minutes',
    1847,
    3,
    420
  ),
  (
    'trial_expiration_reminder',
    'Trial Expiration Reminder',
    'Notifies customers and admins before trial periods end.',
    'active',
    'schedule',
    '0 9 * * *',
    now() - interval '1 day',
    now() + interval '6 hours',
    now() - interval '1 day',
    312,
    0,
    180
  ),
  (
    'invoice_reminder',
    'Invoice Reminder',
    'Sends payment reminders for outstanding invoices.',
    'active',
    'schedule',
    '0 10 * * 1',
    now() - interval '3 days',
    now() + interval '4 days',
    now() - interval '3 days',
    89,
    1,
    250
  ),
  (
    'weekly_executive_summary',
    'Weekly Executive Summary',
    'Compiles platform KPIs and recommendations for administrators.',
    'active',
    'schedule',
    '0 8 * * 1',
    now() - interval '2 days',
    now() + interval '5 days',
    now() - interval '2 days',
    24,
    0,
    1200
  ),
  (
    'installation_health_monitoring',
    'Installation Health Monitoring',
    'Scans installations for sync failures and integration issues.',
    'active',
    'schedule',
    '*/15 * * * *',
    now() - interval '4 minutes',
    now() + interval '11 minutes',
    now() - interval '4 minutes',
    5620,
    7,
    890
  ),
  (
    'ai_customer_follow_up',
    'AI Customer Follow-Up',
    'Surfaces customers needing proactive outreach based on engagement signals.',
    'warning',
    'schedule',
    '0 7 * * *',
    now() - interval '18 hours',
    now() + interval '6 hours',
    now() - interval '20 hours',
    156,
    2,
    640
  )
on conflict (automation_key) do nothing;

-- Enrich pilot activity timeline
do $$
declare
  v_customer_id uuid;
begin
  select id into v_customer_id
  from public.customers
  where customer_number = 'AIP-000001'
  limit 1;

  if v_customer_id is null then
    return;
  end if;

  update public.activity_logs
  set category = case event_type
    when 'trial.started' then 'billing'
    when 'invoice.generated' then 'billing'
    when 'installation.created' then 'installations'
    when 'customer.created' then 'users'
    else 'system'
  end
  where customer_id = v_customer_id;

  insert into public.activity_logs (customer_id, event_type, title, category, details, created_at)
  select v_customer_id, 'support.ai_resolved', 'Support AI resolved 12 requests', 'support',
    jsonb_build_object('count', 12), now() - interval '5 days'
  where not exists (
    select 1 from public.activity_logs
    where customer_id = v_customer_id and event_type = 'support.ai_resolved'
  );

  insert into public.activity_logs (customer_id, event_type, title, category, details, created_at)
  select v_customer_id, 'integration.connected', 'Stripe integration connected', 'installations',
    jsonb_build_object('provider', 'stripe'), now() - interval '3 days'
  where not exists (
    select 1 from public.activity_logs
    where customer_id = v_customer_id and event_type = 'integration.connected'
  );

  insert into public.activity_logs (customer_id, event_type, title, category, details, created_at)
  select v_customer_id, 'ai.recommendation', 'AI recommended onboarding session', 'ai_recommendations',
    jsonb_build_object('action', 'schedule_onboarding'), now() - interval '1 day'
  where not exists (
    select 1 from public.activity_logs
    where customer_id = v_customer_id and event_type = 'ai.recommendation'
  );

  insert into public.customer_recommendations (
    customer_id, recommendation_key, message, priority, recommended_action, confidence
  )
  values
    (
      v_customer_id,
      'low_engagement',
      'Customer has not logged in for 21 days.',
      'high',
      'Send re-engagement email',
      96
    ),
    (
      v_customer_id,
      'support_volume',
      'Support volume increased 37%.',
      'normal',
      'Review recent support cases',
      81
    ),
    (
      v_customer_id,
      'trial_expiring',
      'Trial expires in 4 days.',
      'urgent',
      'Schedule onboarding meeting',
      92
    )
  on conflict (customer_id, recommendation_key) do nothing;

  insert into public.team_invitations (
    customer_id, email, role, department, welcome_message, status, invited_by, expires_at
  )
  select
    v_customer_id,
    'analyst@example.com',
    'analyst',
    'Operations',
    'Welcome to the Aipify workspace.',
    'pending',
    'Platform Admin',
    now() + interval '7 days'
  where not exists (
    select 1 from public.team_invitations
    where customer_id = v_customer_id and email = 'analyst@example.com'
  );
end;
$$;
