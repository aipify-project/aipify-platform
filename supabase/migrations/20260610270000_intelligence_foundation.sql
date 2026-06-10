-- Intelligence Foundation: timeline memory, AI structures, automatic logging
-- tenant_id references public.customers(id) — each customer is a platform tenant

-- ---------------------------------------------------------------------------
-- 1. customer_timeline
-- ---------------------------------------------------------------------------
create table if not exists public.customer_timeline (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  category text not null check (
    category in (
      'support',
      'billing',
      'automation',
      'installation',
      'user',
      'system',
      'ai_recommendation',
      'subscription'
    )
  ),
  title text not null,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  event_date timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists customer_timeline_tenant_id_idx
  on public.customer_timeline (tenant_id);
create index if not exists customer_timeline_event_date_idx
  on public.customer_timeline (tenant_id, event_date desc);
create index if not exists customer_timeline_category_idx
  on public.customer_timeline (tenant_id, category);

-- ---------------------------------------------------------------------------
-- 2. ai_recommendations (foundation table — distinct from customer_recommendations)
-- ---------------------------------------------------------------------------
create table if not exists public.ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  title text not null,
  reason text not null,
  recommendation text not null,
  priority text not null default 'medium' check (
    priority in ('low', 'medium', 'high', 'critical')
  ),
  confidence_score integer not null default 80 check (confidence_score between 0 and 100),
  status text not null default 'active' check (
    status in ('active', 'dismissed', 'executed')
  ),
  dismissed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists ai_recommendations_tenant_id_idx
  on public.ai_recommendations (tenant_id);
create index if not exists ai_recommendations_status_idx
  on public.ai_recommendations (tenant_id, status);

-- ---------------------------------------------------------------------------
-- 3. customer_success_scores
-- ---------------------------------------------------------------------------
create table if not exists public.customer_success_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  score integer not null default 50 check (score between 0 and 100),
  login_score integer not null default 50 check (login_score between 0 and 100),
  feature_adoption_score integer not null default 50 check (feature_adoption_score between 0 and 100),
  support_score integer not null default 50 check (support_score between 0 and 100),
  automation_score integer not null default 50 check (automation_score between 0 and 100),
  ai_interaction_score integer not null default 50 check (ai_interaction_score between 0 and 100),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 4. installation_health (per-tenant aggregate snapshot)
-- ---------------------------------------------------------------------------
create table if not exists public.installation_health (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  health_score integer not null default 85 check (health_score between 0 and 100),
  api_health integer not null default 90 check (api_health between 0 and 100),
  webhook_health integer not null default 90 check (webhook_health between 0 and 100),
  integration_health integer not null default 90 check (integration_health between 0 and 100),
  last_scan_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 5. automation_runs (tenant-scoped execution history)
-- ---------------------------------------------------------------------------
create table if not exists public.automation_runs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  automation_name text not null,
  status text not null check (status in ('success', 'warning', 'failed')),
  execution_time_ms integer,
  error_message text,
  executed_at timestamptz not null default now()
);

create index if not exists automation_runs_tenant_id_idx
  on public.automation_runs (tenant_id);
create index if not exists automation_runs_executed_at_idx
  on public.automation_runs (tenant_id, executed_at desc);

-- ---------------------------------------------------------------------------
-- 6. opportunity_signals
-- ---------------------------------------------------------------------------
create table if not exists public.opportunity_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  type text not null check (
    type in (
      'upgrade_opportunity',
      'retention_risk',
      'low_engagement',
      'expansion_opportunity',
      'customer_advocate'
    )
  ),
  severity text not null default 'medium' check (
    severity in ('low', 'medium', 'high')
  ),
  status text not null default 'active' check (
    status in ('active', 'resolved', 'dismissed')
  ),
  detected_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists opportunity_signals_tenant_id_idx
  on public.opportunity_signals (tenant_id);

-- ---------------------------------------------------------------------------
-- 7. executive_metric_snapshots (data collection for future dashboards)
-- ---------------------------------------------------------------------------
create table if not exists public.executive_metric_snapshots (
  id uuid primary key default gen_random_uuid(),
  recorded_at timestamptz not null default now(),
  mrr numeric not null default 0,
  support_activity integer not null default 0,
  automation_executions integer not null default 0,
  installation_count integer not null default 0,
  recommendation_count integer not null default 0,
  customer_growth integer not null default 0,
  metadata jsonb not null default '{}'::jsonb
);

-- RLS: platform admin RPCs only
alter table public.customer_timeline enable row level security;
alter table public.ai_recommendations enable row level security;
alter table public.customer_success_scores enable row level security;
alter table public.installation_health enable row level security;
alter table public.automation_runs enable row level security;
alter table public.opportunity_signals enable row level security;
alter table public.executive_metric_snapshots enable row level security;

revoke all on public.customer_timeline from authenticated, anon;
revoke all on public.ai_recommendations from authenticated, anon;
revoke all on public.customer_success_scores from authenticated, anon;
revoke all on public.installation_health from authenticated, anon;
revoke all on public.automation_runs from authenticated, anon;
revoke all on public.opportunity_signals from authenticated, anon;
revoke all on public.executive_metric_snapshots from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Core logging function
-- ---------------------------------------------------------------------------
create or replace function public.record_customer_timeline_event(
  p_tenant_id uuid,
  p_category text,
  p_title text,
  p_description text default null,
  p_metadata jsonb default '{}'::jsonb,
  p_event_date timestamptz default now()
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.customer_timeline (
    tenant_id, category, title, description, metadata, event_date
  )
  values (
    p_tenant_id, p_category, p_title, p_description, p_metadata, p_event_date
  )
  returning id into v_id;
  return v_id;
end;
$$;

grant execute on function public.record_customer_timeline_event(uuid, text, text, text, jsonb, timestamptz) to authenticated;

-- ---------------------------------------------------------------------------
-- Placeholder score refresh (Stage 1 visibility — real AI later)
-- ---------------------------------------------------------------------------
create or replace function public.refresh_customer_intelligence_scores(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_login integer := 50;
  v_feature integer := 50;
  v_support integer := 70;
  v_automation integer := 50;
  v_ai integer := 60;
  v_total integer;
  v_health integer := 85;
  v_api integer := 90;
  v_webhook integer := 88;
  v_integration integer := 85;
begin
  select least(100, 40 + coalesce(count(*) filter (where u.last_login_at > now() - interval '30 days'), 0) * 15)
  into v_login
  from public.users u
  join public.customers c on c.company_id = u.company_id
  where c.id = p_tenant_id;

  select
    least(100, 30 + coalesce((select jsonb_array_length(us.most_used_modules) from public.usage_statistics us where us.customer_id = p_tenant_id), 0) * 20),
    greatest(0, 100 - (select count(*) from public.support_cases sc where sc.customer_id = p_tenant_id and sc.status in ('open', 'escalated')) * 10),
    least(100, coalesce((select us.automated_actions / 2 from public.usage_statistics us where us.customer_id = p_tenant_id), 25)),
    least(100, coalesce((select us.ai_recommendations * 3 from public.usage_statistics us where us.customer_id = p_tenant_id), 30))
  into v_feature, v_support, v_automation, v_ai;

  v_total := round((v_login + v_feature + v_support + v_automation + v_ai) / 5.0);

  insert into public.customer_success_scores (
    tenant_id, score, login_score, feature_adoption_score,
    support_score, automation_score, ai_interaction_score, updated_at
  )
  values (p_tenant_id, v_total, v_login, v_feature, v_support, v_automation, v_ai, now())
  on conflict (tenant_id) do update set
    score = excluded.score,
    login_score = excluded.login_score,
    feature_adoption_score = excluded.feature_adoption_score,
    support_score = excluded.support_score,
    automation_score = excluded.automation_score,
    ai_interaction_score = excluded.ai_interaction_score,
    updated_at = now();

  select
    greatest(0, 100 - (select count(*) from public.installations i join public.customers c on c.company_id = i.company_id where c.id = p_tenant_id and i.status in ('paused', 'revoked')) * 20),
    92,
    88,
    greatest(0, 100 - (select count(*) from public.installation_integrations ii join public.installations i on i.id = ii.installation_id join public.customers c on c.company_id = i.company_id where c.id = p_tenant_id and ii.status = 'error') * 15)
  into v_health, v_api, v_webhook, v_integration;

  insert into public.installation_health (
    tenant_id, health_score, api_health, webhook_health, integration_health, last_scan_at, updated_at
  )
  values (p_tenant_id, v_health, v_api, v_webhook, v_integration, now(), now())
  on conflict (tenant_id) do update set
    health_score = excluded.health_score,
    api_health = excluded.api_health,
    webhook_health = excluded.webhook_health,
    integration_health = excluded.integration_health,
    last_scan_at = now(),
    updated_at = now();
end;
$$;

grant execute on function public.refresh_customer_intelligence_scores(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Executive snapshot collector
-- ---------------------------------------------------------------------------
create or replace function public.record_executive_metric_snapshot()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_mrr numeric := 0;
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

  insert into public.executive_metric_snapshots (
    mrr, support_activity, automation_executions, installation_count,
    recommendation_count, customer_growth, metadata
  )
  values (
    v_mrr,
    coalesce((select sum(support_requests_handled) from public.usage_statistics), 0),
    coalesce((select sum(total_executions) from public.platform_automations), 0),
    (select count(*) from public.installations),
    coalesce((select count(*) from public.ai_recommendations where status = 'active'), 0),
    (select count(*) from public.customers where created_at >= now() - interval '30 days'),
    jsonb_build_object('collected_by', 'intelligence_foundation', 'version', 1)
  )
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.record_executive_metric_snapshot() to authenticated;

-- ---------------------------------------------------------------------------
-- Intelligence bundle RPC (customer workspace)
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_intelligence_foundation(p_tenant_id uuid)
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

  perform public.refresh_customer_intelligence_scores(p_tenant_id);

  return jsonb_build_object(
    'timeline', coalesce(
      (select jsonb_agg(row_to_json(ct.*) order by ct.event_date desc)
       from public.customer_timeline ct
       where ct.tenant_id = p_tenant_id
       limit 100),
      '[]'::jsonb
    ),
    'ai_recommendations', coalesce(
      (select jsonb_agg(row_to_json(ar.*) order by ar.created_at desc)
       from public.ai_recommendations ar
       where ar.tenant_id = p_tenant_id and ar.status = 'active'),
      '[]'::jsonb
    ),
    'success_score', (
      select row_to_json(css.*)
      from public.customer_success_scores css
      where css.tenant_id = p_tenant_id
    ),
    'installation_health', (
      select row_to_json(ih.*)
      from public.installation_health ih
      where ih.tenant_id = p_tenant_id
    ),
    'automation_runs', coalesce(
      (select jsonb_agg(row_to_json(ar.*) order by ar.executed_at desc)
       from public.automation_runs ar
       where ar.tenant_id = p_tenant_id
       limit 50),
      '[]'::jsonb
    ),
    'opportunity_signals', coalesce(
      (select jsonb_agg(row_to_json(os.*) order by os.detected_at desc)
       from public.opportunity_signals os
       where os.tenant_id = p_tenant_id and os.status = 'active'),
      '[]'::jsonb
    )
  );
end;
$$;

grant execute on function public.get_customer_intelligence_foundation(uuid) to authenticated;

create or replace function public.dismiss_ai_recommendation(p_recommendation_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  update public.ai_recommendations
  set status = 'dismissed', dismissed_at = now()
  where id = p_recommendation_id;
end;
$$;

grant execute on function public.dismiss_ai_recommendation(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Automatic timeline triggers
-- ---------------------------------------------------------------------------
create or replace function public.trg_timeline_subscription()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'trialing' and (tg_op = 'INSERT' or old.status is distinct from 'trialing') then
    perform public.record_customer_timeline_event(
      new.customer_id, 'subscription', 'Trial started',
      'Customer trial period began.',
      jsonb_build_object('plan', new.plan_name), coalesce(new.trial_starts_at, now())
    );
  end if;
  if new.status = 'active' and old.status = 'trialing' then
    perform public.record_customer_timeline_event(
      new.customer_id, 'subscription', 'Subscription upgraded',
      'Trial converted to active subscription.',
      jsonb_build_object('plan', new.plan_name), now()
    );
  end if;
  return new;
end;
$$;

drop trigger if exists timeline_subscription on public.subscriptions;
create trigger timeline_subscription
  after insert or update on public.subscriptions
  for each row execute function public.trg_timeline_subscription();

create or replace function public.trg_timeline_invoice()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    perform public.record_customer_timeline_event(
      new.customer_id, 'billing', 'Invoice generated',
      'Invoice ' || new.invoice_number || ' was created.',
      jsonb_build_object('invoice_number', new.invoice_number, 'amount', new.amount),
      new.issued_at
    );
  elsif tg_op = 'UPDATE' and new.status = 'paid' and old.status is distinct from 'paid' then
    perform public.record_customer_timeline_event(
      new.customer_id, 'billing', 'Invoice paid',
      'Invoice ' || new.invoice_number || ' was marked paid.',
      jsonb_build_object('invoice_number', new.invoice_number),
      coalesce(new.paid_at, now())
    );
  end if;
  return new;
end;
$$;

drop trigger if exists timeline_invoice on public.invoices;
create trigger timeline_invoice
  after insert or update on public.invoices
  for each row execute function public.trg_timeline_invoice();

create or replace function public.trg_timeline_support()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    perform public.record_customer_timeline_event(
      new.customer_id, 'support', 'Support case opened',
      new.subject,
      jsonb_build_object('case_id', new.id, 'category', new.category),
      new.opened_at
    );
  elsif new.status = 'escalated' and old.status is distinct from 'escalated' then
    perform public.record_customer_timeline_event(
      new.customer_id, 'support', 'Support escalation created',
      new.subject,
      jsonb_build_object('case_id', new.id, 'reason', new.ai_escalation_reason),
      now()
    );
  elsif new.status = 'closed' and old.status is distinct from 'closed' then
    perform public.record_customer_timeline_event(
      new.customer_id, 'support', 'Support AI resolved ticket',
      new.subject,
      jsonb_build_object('case_id', new.id),
      coalesce(new.closed_at, now())
    );
  end if;
  return new;
end;
$$;

drop trigger if exists timeline_support on public.support_cases;
create trigger timeline_support
  after insert or update on public.support_cases
  for each row execute function public.trg_timeline_support();

create or replace function public.trg_timeline_invitation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform public.record_customer_timeline_event(
    new.customer_id, 'user', 'User invited',
    'Invitation sent to ' || new.email,
    jsonb_build_object('email', new.email, 'role', new.role),
    new.created_at
  );
  return new;
end;
$$;

drop trigger if exists timeline_invitation on public.team_invitations;
create trigger timeline_invitation
  after insert on public.team_invitations
  for each row execute function public.trg_timeline_invitation();

create or replace function public.trg_timeline_ai_recommendation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform public.record_customer_timeline_event(
    new.tenant_id, 'ai_recommendation', 'AI recommendation generated',
    new.title,
    jsonb_build_object('recommendation_id', new.id, 'confidence', new.confidence_score),
    new.created_at
  );
  return new;
end;
$$;

drop trigger if exists timeline_ai_recommendation on public.ai_recommendations;
create trigger timeline_ai_recommendation
  after insert on public.ai_recommendations
  for each row execute function public.trg_timeline_ai_recommendation();

-- ---------------------------------------------------------------------------
-- Backfill activity_logs → customer_timeline
-- ---------------------------------------------------------------------------
insert into public.customer_timeline (tenant_id, category, title, description, metadata, event_date, created_at)
select
  al.customer_id,
  case al.category
    when 'installations' then 'installation'
    when 'automations' then 'automation'
    when 'users' then 'user'
    when 'ai_recommendations' then 'ai_recommendation'
    else al.category
  end,
  al.title,
  coalesce(al.details ->> 'description', al.event_type),
  al.details,
  al.created_at,
  al.created_at
from public.activity_logs al
where not exists (
  select 1 from public.customer_timeline ct
  where ct.tenant_id = al.customer_id
    and ct.title = al.title
    and ct.event_date = al.created_at
);

-- ---------------------------------------------------------------------------
-- Seed pilot tenant intelligence data
-- ---------------------------------------------------------------------------
do $$
declare
  v_tenant_id uuid;
begin
  select id into v_tenant_id from public.customers where customer_number = 'AIP-000001' limit 1;
  if v_tenant_id is null then return; end if;

  perform public.refresh_customer_intelligence_scores(v_tenant_id);

  insert into public.ai_recommendations (tenant_id, title, reason, recommendation, priority, confidence_score, status)
  select v_tenant_id, 'Customer inactivity detected', 'No owner login in 21 days.', 'Send re-engagement email', 'high', 96, 'active'
  where not exists (select 1 from public.ai_recommendations where tenant_id = v_tenant_id and title = 'Customer inactivity detected');
  insert into public.ai_recommendations (tenant_id, title, reason, recommendation, priority, confidence_score, status)
  select v_tenant_id, 'Trial ending soon', 'Trial expires within 7 days.', 'Schedule onboarding call', 'critical', 92, 'active'
  where not exists (select 1 from public.ai_recommendations where tenant_id = v_tenant_id and title = 'Trial ending soon');
  insert into public.ai_recommendations (tenant_id, title, reason, recommendation, priority, confidence_score, status)
  select v_tenant_id, 'Integration incomplete', 'Stripe connection pending verification.', 'Guide integration setup', 'medium', 72, 'active'
  where not exists (select 1 from public.ai_recommendations where tenant_id = v_tenant_id and title = 'Integration incomplete');

  insert into public.opportunity_signals (tenant_id, type, severity, status)
  select v_tenant_id, 'upgrade_opportunity', 'medium', 'active'
  where not exists (select 1 from public.opportunity_signals where tenant_id = v_tenant_id and type = 'upgrade_opportunity');

  insert into public.automation_runs (tenant_id, automation_name, status, execution_time_ms, executed_at)
  select v_tenant_id, 'Support Auto Reply', 'success', 420, now() - interval '2 hours'
  where not exists (select 1 from public.automation_runs where tenant_id = v_tenant_id limit 1);

  insert into public.automation_runs (tenant_id, automation_name, status, execution_time_ms, error_message, executed_at)
  values (v_tenant_id, 'Health Monitoring', 'warning', 890, 'Sync latency above threshold', now() - interval '1 day');

  perform public.record_customer_timeline_event(
    v_tenant_id, 'installation', 'Installation completed',
    'Aipify installation connected successfully.',
    '{"source":"pilot"}'::jsonb, now() - interval '10 days'
  );
  perform public.record_customer_timeline_event(
    v_tenant_id, 'billing', 'Welcome email delivered',
    'Onboarding welcome email sent to customer owner.',
    '{}'::jsonb, now() - interval '9 days'
  );
  perform public.record_customer_timeline_event(
    v_tenant_id, 'automation', 'Automation executed successfully',
    'Weekly health scan completed.',
    '{"automation":"installation_health_monitoring"}'::jsonb, now() - interval '4 hours'
  );
end;
$$;
