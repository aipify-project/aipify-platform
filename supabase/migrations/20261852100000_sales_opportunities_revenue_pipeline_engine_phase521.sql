-- Phase 521 — Sales, Opportunities & Revenue Pipeline Engine
-- Leads are possibilities. Opportunities are potential revenue. Relationships create customers.
-- Integrates: CRM (517), Cases (518), Finance (519), Projects (520), Domains (505A), Tasks (506)

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_sales_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  default_currency text not null default 'NOK',
  default_pipeline_key text not null default 'sales',
  enable_quote_approvals boolean not null default true,
  companion_sales_context_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_sales_settings enable row level security;
revoke all on public.organization_sales_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Pipelines
-- ---------------------------------------------------------------------------
create table if not exists public.organization_sales_pipelines (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pipeline_key text not null,
  name text not null,
  pipeline_type text not null default 'sales' check (
    pipeline_type in (
      'sales', 'partner', 'enterprise', 'renewal', 'customer_expansion', 'custom'
    )
  ),
  department_id uuid references public.organization_departments (id) on delete set null,
  is_default boolean not null default false,
  is_active boolean not null default true,
  stages jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, pipeline_key)
);

create index if not exists organization_sales_pipelines_org_idx
  on public.organization_sales_pipelines (organization_id, is_active);

alter table public.organization_sales_pipelines enable row level security;
revoke all on public.organization_sales_pipelines from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Opportunities
-- ---------------------------------------------------------------------------
create table if not exists public.organization_sales_opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  opportunity_number text,
  name text not null,
  customer_id uuid references public.organization_crm_customers (id) on delete set null,
  customer_name text not null default '',
  contact_name text not null default '',
  contact_email text,
  owner_user_id uuid references public.users (id) on delete set null,
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  pipeline_id uuid references public.organization_sales_pipelines (id) on delete set null,
  lead_id uuid references public.organization_crm_leads (id) on delete set null,
  value_amount numeric(14, 2) not null default 0,
  currency text not null default 'NOK',
  expected_close_date date,
  stage text not null default 'new' check (
    stage in (
      'new', 'qualified', 'discovery', 'proposal', 'negotiation',
      'verbal_agreement', 'contract_sent', 'won', 'lost', 'custom'
    )
  ),
  probability integer not null default 10 check (probability between 0 and 100),
  health_status text not null default 'stable' check (
    health_status in ('healthy', 'stable', 'attention', 'at_risk')
  ),
  business_pack_key text,
  scope_type text not null default 'organization' check (
    scope_type in ('organization', 'domain', 'department', 'business_pack')
  ),
  lost_reason text,
  notes text not null default '',
  documents jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  last_activity_at timestamptz,
  won_at timestamptz,
  lost_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, opportunity_number)
);

create index if not exists organization_sales_opportunities_org_stage_idx
  on public.organization_sales_opportunities (organization_id, stage, expected_close_date);

create index if not exists organization_sales_opportunities_owner_idx
  on public.organization_sales_opportunities (organization_id, owner_user_id, stage);

alter table public.organization_sales_opportunities enable row level security;
revoke all on public.organization_sales_opportunities from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Quotes
-- ---------------------------------------------------------------------------
create table if not exists public.organization_sales_quotes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  quote_number text,
  opportunity_id uuid references public.organization_sales_opportunities (id) on delete set null,
  customer_id uuid references public.organization_crm_customers (id) on delete set null,
  customer_name text not null default '',
  title text not null default '',
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(14, 2) not null default 0,
  discount_amount numeric(14, 2) not null default 0,
  tax_amount numeric(14, 2) not null default 0,
  total_amount numeric(14, 2) not null default 0,
  currency text not null default 'NOK',
  terms text not null default '',
  status text not null default 'draft' check (
    status in (
      'draft', 'pending_approval', 'approved', 'sent', 'accepted', 'rejected', 'expired', 'converted'
    )
  ),
  revision_number integer not null default 1,
  valid_until date,
  owner_user_id uuid references public.users (id) on delete set null,
  documents jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, quote_number)
);

create index if not exists organization_sales_quotes_org_status_idx
  on public.organization_sales_quotes (organization_id, status, updated_at desc);

alter table public.organization_sales_quotes enable row level security;
revoke all on public.organization_sales_quotes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Activities & playbooks
-- ---------------------------------------------------------------------------
create table if not exists public.organization_sales_activities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  opportunity_id uuid not null references public.organization_sales_opportunities (id) on delete cascade,
  activity_type text not null check (
    activity_type in (
      'call', 'meeting', 'email', 'task', 'note', 'demo', 'presentation',
      'customer_visit', 'quote', 'follow_up', 'custom'
    )
  ),
  title text not null,
  summary text not null default '',
  scheduled_at timestamptz,
  completed_at timestamptz,
  owner_user_id uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_sales_activities_opp_idx
  on public.organization_sales_activities (opportunity_id, created_at desc);

alter table public.organization_sales_activities enable row level security;
revoke all on public.organization_sales_activities from authenticated, anon;

create table if not exists public.organization_sales_playbooks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  playbook_key text not null,
  title text not null,
  playbook_type text not null check (
    playbook_type in (
      'discovery', 'qualification', 'demo', 'closing', 'renewal', 'partner', 'custom'
    )
  ),
  description text not null default '',
  steps jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, playbook_key)
);

alter table public.organization_sales_playbooks enable row level security;
revoke all on public.organization_sales_playbooks from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Forecasts & audit
-- ---------------------------------------------------------------------------
create table if not exists public.organization_sales_forecasts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  forecast_type text not null default 'quarterly' check (
    forecast_type in ('monthly', 'quarterly', 'annual', 'custom')
  ),
  period_label text not null,
  period_start date,
  period_end date,
  expected_revenue numeric(14, 2) not null default 0,
  weighted_revenue numeric(14, 2) not null default 0,
  closed_revenue numeric(14, 2) not null default 0,
  lost_revenue numeric(14, 2) not null default 0,
  forecast_confidence text not null default 'moderate' check (
    forecast_confidence in ('low', 'moderate', 'high')
  ),
  pipeline_id uuid references public.organization_sales_pipelines (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  generated_at timestamptz not null default now()
);

alter table public.organization_sales_forecasts enable row level security;
revoke all on public.organization_sales_forecasts from authenticated, anon;

create table if not exists public.organization_sales_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  opportunity_id uuid references public.organization_sales_opportunities (id) on delete set null,
  quote_id uuid references public.organization_sales_quotes (id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_sales_audit_logs_org_idx
  on public.organization_sales_audit_logs (organization_id, created_at desc);

alter table public.organization_sales_audit_logs enable row level security;
revoke all on public.organization_sales_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._sal521_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._sal521_log(
  p_org_id uuid,
  p_action text,
  p_summary text,
  p_opportunity_id uuid default null,
  p_quote_id uuid default null,
  p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_sales_audit_logs (
    organization_id, actor_user_id, action, summary, opportunity_id, quote_id, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, p_opportunity_id, p_quote_id, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._sal521_next_number(p_org_id uuid, p_prefix text, p_table text)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_n bigint;
begin
  execute format('select count(*) + 1 from public.%I where organization_id = $1', p_table)
  into v_n using p_org_id;
  return p_prefix || '-' || lpad(v_n::text, 5, '0');
end; $$;

create or replace function public._sal521_stage_probability(p_stage text)
returns integer language sql immutable as $$
  select case p_stage
    when 'new' then 10
    when 'qualified' then 25
    when 'discovery' then 40
    when 'proposal' then 50
    when 'negotiation' then 65
    when 'verbal_agreement' then 80
    when 'contract_sent' then 90
    when 'won' then 100
    when 'lost' then 0
    else 30
  end;
$$;

create or replace function public._sal521_compute_health(p_opp public.organization_sales_opportunities)
returns text language plpgsql stable as $$
declare
  v_days_since_activity integer;
  v_age_days integer;
begin
  if p_opp.stage in ('won', 'lost') then return 'stable'; end if;

  v_days_since_activity := coalesce(
    extract(day from now() - coalesce(p_opp.last_activity_at, p_opp.created_at))::integer, 0
  );
  v_age_days := extract(day from now() - p_opp.created_at)::integer;

  if p_opp.stage in ('negotiation', 'verbal_agreement', 'contract_sent') and v_days_since_activity > 14 then
    return 'at_risk';
  end if;
  if v_days_since_activity > 21 or (v_age_days > 90 and p_opp.stage in ('new', 'qualified')) then
    return 'at_risk';
  end if;
  if v_days_since_activity > 10 or p_opp.probability < 25 then
    return 'attention';
  end if;
  if v_days_since_activity <= 7 and p_opp.probability >= 50 then
    return 'healthy';
  end if;
  return 'stable';
end; $$;

create or replace function public._sal521_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_sales_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;

  insert into public.organization_sales_pipelines (organization_id, pipeline_key, name, pipeline_type, is_default, stages)
  values
    (p_org_id, 'sales', 'Sales Pipeline', 'sales', true, '["new","qualified","discovery","proposal","negotiation","verbal_agreement","contract_sent","won","lost"]'::jsonb),
    (p_org_id, 'partner', 'Partner Pipeline', 'partner', false, '["new","qualified","discovery","proposal","negotiation","won","lost"]'::jsonb),
    (p_org_id, 'enterprise', 'Enterprise Pipeline', 'enterprise', false, '["new","qualified","discovery","proposal","negotiation","verbal_agreement","contract_sent","won","lost"]'::jsonb),
    (p_org_id, 'renewal', 'Renewal Pipeline', 'renewal', false, '["new","qualified","proposal","negotiation","won","lost"]'::jsonb),
    (p_org_id, 'customer_expansion', 'Customer Expansion Pipeline', 'customer_expansion', false, '["new","discovery","proposal","won","lost"]'::jsonb)
  on conflict (organization_id, pipeline_key) do nothing;

  insert into public.organization_sales_playbooks (organization_id, playbook_key, title, playbook_type, description, steps)
  values
    (p_org_id, 'enterprise_sales', 'Enterprise Sales Process', 'discovery', 'Structured enterprise discovery and closing process.', '[]'::jsonb),
    (p_org_id, 'growth_partner_sales', 'Growth Partner Sales Process', 'partner', 'Partner-led sales and certification workflow.', '[]'::jsonb),
    (p_org_id, 'commerce_sales', 'Commerce Sales Process', 'closing', 'Commerce pack expansion and store growth opportunities.', '[]'::jsonb),
    (p_org_id, 'renewal_playbook', 'Renewal Playbook', 'renewal', 'Renewal qualification and negotiation guidance.', '[]'::jsonb)
  on conflict (organization_id, playbook_key) do nothing;
end; $$;

create or replace function public._sal521_opportunity_json(p_row public.organization_sales_opportunities)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_row.id,
    'opportunity_number', p_row.opportunity_number,
    'name', p_row.name,
    'customer_id', p_row.customer_id,
    'customer_name', p_row.customer_name,
    'contact_name', p_row.contact_name,
    'contact_email', p_row.contact_email,
    'owner_name', (select coalesce(u.full_name, u.email) from public.users u where u.id = p_row.owner_user_id),
    'department_name', (select name from public.organization_departments where id = p_row.department_id),
    'domain_name', (select domain from public.organization_domains where id = p_row.domain_id),
    'pipeline_key', (select pipeline_key from public.organization_sales_pipelines where id = p_row.pipeline_id),
    'value_amount', p_row.value_amount,
    'currency', p_row.currency,
    'expected_close_date', p_row.expected_close_date,
    'stage', p_row.stage,
    'probability', p_row.probability,
    'weighted_value', round(p_row.value_amount * p_row.probability / 100.0, 2),
    'health_status', p_row.health_status,
    'business_pack_key', p_row.business_pack_key,
    'scope_type', p_row.scope_type,
    'lost_reason', p_row.lost_reason,
    'last_activity_at', p_row.last_activity_at,
    'won_at', p_row.won_at,
    'lost_at', p_row.lost_at,
    'updated_at', p_row.updated_at
  );
end; $$;

create or replace function public._sal521_quote_json(p_row public.organization_sales_quotes)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_row.id,
    'quote_number', p_row.quote_number,
    'opportunity_id', p_row.opportunity_id,
    'customer_name', p_row.customer_name,
    'title', p_row.title,
    'total_amount', p_row.total_amount,
    'currency', p_row.currency,
    'status', p_row.status,
    'revision_number', p_row.revision_number,
    'valid_until', p_row.valid_until,
    'updated_at', p_row.updated_at
  );
end; $$;

create or replace function public._sal521_refresh_forecast(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_expected numeric(14, 2);
  v_weighted numeric(14, 2);
  v_closed numeric(14, 2);
  v_lost numeric(14, 2);
  v_label text;
begin
  select
    coalesce(sum(value_amount) filter (where stage not in ('won', 'lost')), 0),
    coalesce(sum(value_amount * probability / 100.0) filter (where stage not in ('won', 'lost')), 0),
    coalesce(sum(value_amount) filter (where stage = 'won' and won_at >= date_trunc('quarter', now())), 0),
    coalesce(sum(value_amount) filter (where stage = 'lost' and lost_at >= date_trunc('quarter', now())), 0)
  into v_expected, v_weighted, v_closed, v_lost
  from public.organization_sales_opportunities
  where organization_id = p_org_id;

  v_label := 'Q' || extract(quarter from now())::text || ' ' || extract(year from now())::text;

  insert into public.organization_sales_forecasts (
    organization_id, forecast_type, period_label, period_start, period_end,
    expected_revenue, weighted_revenue, closed_revenue, lost_revenue, forecast_confidence
  ) values (
    p_org_id, 'quarterly', v_label,
    date_trunc('quarter', now())::date,
    (date_trunc('quarter', now()) + interval '3 months' - interval '1 day')::date,
    v_expected, v_weighted, v_closed, v_lost,
    case when v_weighted > 0 then 'moderate' else 'low' end
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Sales Revenue Pipeline Center
-- ---------------------------------------------------------------------------
create or replace function public.get_sales_revenue_pipeline_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_open_count bigint;
  v_pipeline_value numeric(14, 2);
  v_weighted numeric(14, 2);
  v_closed_q numeric(14, 2);
  v_won_count bigint;
  v_lost_count bigint;
begin
  perform public._irp_require_permission('sales.view');
  v_org_id := public._sal521_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._sal521_ensure_settings(v_org_id);
  perform public._sal521_log(v_org_id, 'center_view', 'Sales Center viewed', null, null,
    jsonb_build_object('section', p_section));

  select
    count(*) filter (where stage not in ('won', 'lost')),
    coalesce(sum(value_amount) filter (where stage not in ('won', 'lost')), 0),
    coalesce(sum(value_amount * probability / 100.0) filter (where stage not in ('won', 'lost')), 0),
    coalesce(sum(value_amount) filter (where stage = 'won' and won_at >= date_trunc('quarter', now())), 0),
    count(*) filter (where stage = 'won' and won_at >= date_trunc('quarter', now())),
    count(*) filter (where stage = 'lost' and lost_at >= date_trunc('quarter', now()))
  into v_open_count, v_pipeline_value, v_weighted, v_closed_q, v_won_count, v_lost_count
  from public.organization_sales_opportunities
  where organization_id = v_org_id;

  return jsonb_build_object(
    'found', true,
    'principle', 'Leads are possibilities. Opportunities are potential revenue. Relationships create customers.',
    'overview', jsonb_build_object(
      'open_opportunities', v_open_count,
      'pipeline_value', v_pipeline_value,
      'expected_revenue', v_pipeline_value,
      'weighted_forecast', round(v_weighted, 2),
      'closed_revenue_quarter', v_closed_q,
      'conversion_rate', case when (v_won_count + v_lost_count) > 0
        then round(v_won_count::numeric / (v_won_count + v_lost_count) * 100, 1) else 0 end,
      'win_rate', case when (v_won_count + v_lost_count) > 0
        then round(v_won_count::numeric / (v_won_count + v_lost_count) * 100, 1) else 0 end,
      'at_risk_count', (
        select count(*) from public.organization_sales_opportunities
        where organization_id = v_org_id and health_status = 'at_risk' and stage not in ('won', 'lost')
      ),
      'upcoming_follow_ups', (
        select count(*) from public.organization_sales_activities a
        join public.organization_sales_opportunities o on o.id = a.opportunity_id
        where a.organization_id = v_org_id
          and a.scheduled_at between now() and now() + interval '7 days'
          and a.completed_at is null
      ),
      'quotes_pending', (
        select count(*) from public.organization_sales_quotes
        where organization_id = v_org_id and status in ('draft', 'pending_approval', 'sent')
      ),
      'forecast_accuracy', coalesce((
        select round(
          case when expected_revenue > 0 then closed_revenue / expected_revenue * 100 else 0 end, 1
        )
        from public.organization_sales_forecasts
        where organization_id = v_org_id
        order by generated_at desc limit 1
      ), 0)
    ),
    'pipelines', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'pipeline_key', p.pipeline_key, 'name', p.name,
        'pipeline_type', p.pipeline_type, 'is_default', p.is_default,
        'opportunity_count', (
          select count(*) from public.organization_sales_opportunities o
          where o.pipeline_id = p.id and o.stage not in ('won', 'lost')
        ),
        'pipeline_value', coalesce((
          select sum(value_amount) from public.organization_sales_opportunities o
          where o.pipeline_id = p.id and o.stage not in ('won', 'lost')
        ), 0)
      ) order by p.is_default desc, p.name)
      from public.organization_sales_pipelines p where p.organization_id = v_org_id and p.is_active
    ), '[]'::jsonb),
    'opportunities', coalesce((
      select jsonb_agg(public._sal521_opportunity_json(o) order by o.value_amount desc)
      from (
        select * from public.organization_sales_opportunities
        where organization_id = v_org_id and stage not in ('won', 'lost')
        order by value_amount desc limit 50
      ) o
    ), '[]'::jsonb),
    'top_opportunities', coalesce((
      select jsonb_agg(public._sal521_opportunity_json(o) order by o.value_amount desc)
      from (
        select * from public.organization_sales_opportunities
        where organization_id = v_org_id and stage not in ('won', 'lost')
        order by value_amount desc limit 5
      ) o
    ), '[]'::jsonb),
    'at_risk_opportunities', coalesce((
      select jsonb_agg(public._sal521_opportunity_json(o) order by o.expected_close_date nulls last)
      from (
        select * from public.organization_sales_opportunities
        where organization_id = v_org_id and health_status = 'at_risk' and stage not in ('won', 'lost')
        limit 20
      ) o
    ), '[]'::jsonb),
    'quotes', coalesce((
      select jsonb_agg(public._sal521_quote_json(q) order by q.updated_at desc)
      from (
        select * from public.organization_sales_quotes where organization_id = v_org_id
        order by updated_at desc limit 40
      ) q
    ), '[]'::jsonb),
    'activities', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'opportunity_id', a.opportunity_id,
        'opportunity_name', (select name from public.organization_sales_opportunities where id = a.opportunity_id),
        'activity_type', a.activity_type, 'title', a.title, 'summary', a.summary,
        'scheduled_at', a.scheduled_at, 'completed_at', a.completed_at, 'created_at', a.created_at
      ) order by coalesce(a.scheduled_at, a.created_at) desc)
      from public.organization_sales_activities a
      where a.organization_id = v_org_id limit 40
    ), '[]'::jsonb),
    'playbooks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', pb.id, 'playbook_key', pb.playbook_key, 'title', pb.title,
        'playbook_type', pb.playbook_type, 'description', pb.description, 'is_active', pb.is_active
      ) order by pb.title)
      from public.organization_sales_playbooks pb where pb.organization_id = v_org_id and pb.is_active
    ), '[]'::jsonb),
    'forecasting', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', f.id, 'forecast_type', f.forecast_type, 'period_label', f.period_label,
        'expected_revenue', f.expected_revenue, 'weighted_revenue', f.weighted_revenue,
        'closed_revenue', f.closed_revenue, 'lost_revenue', f.lost_revenue,
        'forecast_confidence', f.forecast_confidence, 'generated_at', f.generated_at
      ) order by f.generated_at desc)
      from public.organization_sales_forecasts f where f.organization_id = v_org_id limit 12
    ), '[]'::jsonb),
    'customers', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'customer_number', c.customer_number, 'name', c.name,
        'company_name', c.company_name, 'status', c.status,
        'open_opportunities', (
          select count(*) from public.organization_sales_opportunities o
          where o.customer_id = c.id and o.stage not in ('won', 'lost')
        )
      ) order by c.company_name nulls last, c.name)
      from (
        select distinct on (c.id) c.*
        from public.organization_crm_customers c
        join public.organization_sales_opportunities o on o.customer_id = c.id
        where c.organization_id = v_org_id
        limit 30
      ) c
    ), '[]'::jsonb),
    'reports', jsonb_build_object(
      'pipeline_value', v_pipeline_value,
      'weighted_forecast', round(v_weighted, 2),
      'win_rate', case when (v_won_count + v_lost_count) > 0
        then round(v_won_count::numeric / (v_won_count + v_lost_count) * 100, 1) else 0 end,
      'lost_reasons', coalesce((
        select jsonb_agg(jsonb_build_object('reason', lost_reason, 'count', cnt))
        from (
          select lost_reason, count(*) as cnt
          from public.organization_sales_opportunities
          where organization_id = v_org_id and stage = 'lost' and lost_reason is not null and lost_reason <> ''
          group by lost_reason order by cnt desc limit 10
        ) x
      ), '[]'::jsonb),
      'department_performance', coalesce((
        select jsonb_agg(jsonb_build_object(
          'department_name', d.name,
          'pipeline_value', coalesce(sum(o.value_amount) filter (where o.stage not in ('won', 'lost')), 0),
          'closed_revenue', coalesce(sum(o.value_amount) filter (where o.stage = 'won'), 0)
        ))
        from public.organization_departments d
        left join public.organization_sales_opportunities o
          on o.department_id = d.id and o.organization_id = v_org_id
        where d.organization_id = v_org_id
        group by d.id, d.name
        having count(o.id) > 0
        limit 20
      ), '[]'::jsonb)
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object(
        'action', a.action, 'summary', a.summary, 'created_at', a.created_at
      ) order by a.created_at desc)
      from public.organization_sales_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'stages', jsonb_build_array(
      'new', 'qualified', 'discovery', 'proposal', 'negotiation',
      'verbal_agreement', 'contract_sent', 'won', 'lost', 'custom'
    ),
    'health_statuses', jsonb_build_array('healthy', 'stable', 'attention', 'at_risk'),
    'sections', jsonb_build_array(
      'overview', 'pipeline', 'opportunities', 'quotes', 'forecasting',
      'activities', 'customers', 'reports', 'playbooks'
    ),
    'routes', jsonb_build_object(
      'sales', '/app/sales',
      'quotes', '/app/sales/quotes',
      'playbooks', '/app/sales/playbooks',
      'customers', '/app/customers',
      'leads', '/app/leads',
      'finance', '/app/finance',
      'projects', '/app/projects'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_sales_revenue_pipeline_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_id uuid;
  v_opp public.organization_sales_opportunities;
  v_quote public.organization_sales_quotes;
  v_stage text;
  v_amount numeric(14, 2);
  v_pipeline_id uuid;
begin
  v_org_id := public._sal521_org();
  if v_org_id is null then return jsonb_build_object('ok', false, 'error', 'organization_not_found'); end if;

  if p_action_type in (
    'create_opportunity', 'update_opportunity', 'update_opportunity_stage',
    'mark_won', 'mark_lost', 'create_quote', 'submit_quote', 'approve_quote',
    'accept_quote', 'reject_quote', 'convert_quote', 'create_activity',
    'create_playbook', 'refresh_forecast'
  ) then
    perform public._irp_require_permission('sales.manage');
  else
    perform public._irp_require_permission('sales.view');
  end if;

  perform public._sal521_ensure_settings(v_org_id);

  if p_action_type = 'create_opportunity' then
    select id into v_pipeline_id
    from public.organization_sales_pipelines
    where organization_id = v_org_id
      and pipeline_key = coalesce(p_payload->>'pipeline_key', 'sales')
    limit 1;

    v_stage := coalesce(p_payload->>'stage', 'new');
    v_amount := coalesce((p_payload->>'value_amount')::numeric, 0);

    insert into public.organization_sales_opportunities (
      organization_id, opportunity_number, name, customer_id, customer_name,
      contact_name, contact_email, owner_user_id, department_id, domain_id,
      pipeline_id, lead_id, value_amount, currency, expected_close_date,
      stage, probability, business_pack_key, scope_type, notes, last_activity_at
    ) values (
      v_org_id,
      coalesce(p_payload->>'opportunity_number', public._sal521_next_number(v_org_id, 'OPP', 'organization_sales_opportunities')),
      coalesce(p_payload->>'name', 'Untitled opportunity'),
      nullif(p_payload->>'customer_id', '')::uuid,
      coalesce(p_payload->>'customer_name', ''),
      coalesce(p_payload->>'contact_name', ''),
      p_payload->>'contact_email',
      coalesce(nullif(p_payload->>'owner_user_id', '')::uuid, (select id from public.users where auth_user_id = auth.uid() limit 1)),
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      v_pipeline_id,
      nullif(p_payload->>'lead_id', '')::uuid,
      v_amount,
      coalesce(p_payload->>'currency', 'NOK'),
      nullif(p_payload->>'expected_close_date', '')::date,
      v_stage,
      coalesce((p_payload->>'probability')::integer, public._sal521_stage_probability(v_stage)),
      p_payload->>'business_pack_key',
      coalesce(p_payload->>'scope_type', 'organization'),
      coalesce(p_payload->>'notes', ''),
      now()
    ) returning id into v_id;

    select * into v_opp from public.organization_sales_opportunities where id = v_id;
    update public.organization_sales_opportunities
    set health_status = public._sal521_compute_health(v_opp)
    where id = v_id;

    perform public._sal521_log(v_org_id, 'opportunity_created', 'Opportunity created', v_id, null, p_payload);
    return jsonb_build_object('ok', true, 'opportunity_id', v_id);

  elsif p_action_type = 'update_opportunity_stage' then
    v_id := (p_payload->>'opportunity_id')::uuid;
    v_stage := coalesce(p_payload->>'stage', 'new');

    update public.organization_sales_opportunities set
      stage = v_stage,
      probability = coalesce((p_payload->>'probability')::integer, public._sal521_stage_probability(v_stage)),
      updated_at = now(),
      won_at = case when v_stage = 'won' then now() else won_at end,
      lost_at = case when v_stage = 'lost' then now() else lost_at end,
      lost_reason = case when v_stage = 'lost' then coalesce(p_payload->>'lost_reason', lost_reason) else lost_reason end
    where id = v_id and organization_id = v_org_id
    returning * into v_opp;

    update public.organization_sales_opportunities
    set health_status = public._sal521_compute_health(v_opp)
    where id = v_id;

    perform public._sal521_log(v_org_id, 'stage_changed', 'Opportunity stage changed to ' || v_stage, v_id, null, p_payload);
    return jsonb_build_object('ok', true, 'opportunity_id', v_id);

  elsif p_action_type = 'mark_won' then
    v_id := (p_payload->>'opportunity_id')::uuid;
    update public.organization_sales_opportunities set
      stage = 'won', probability = 100, won_at = now(), updated_at = now(), health_status = 'stable'
    where id = v_id and organization_id = v_org_id;
    perform public._sal521_log(v_org_id, 'deal_won', 'Deal won', v_id, null, p_payload);
    perform public._sal521_refresh_forecast(v_org_id);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'mark_lost' then
    v_id := (p_payload->>'opportunity_id')::uuid;
    update public.organization_sales_opportunities set
      stage = 'lost', probability = 0, lost_at = now(),
      lost_reason = coalesce(p_payload->>'lost_reason', ''),
      updated_at = now(), health_status = 'stable'
    where id = v_id and organization_id = v_org_id;
    perform public._sal521_log(v_org_id, 'deal_lost', 'Deal lost', v_id, null, p_payload);
    perform public._sal521_refresh_forecast(v_org_id);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_quote' then
    v_amount := coalesce((p_payload->>'total_amount')::numeric, 0);
    insert into public.organization_sales_quotes (
      organization_id, quote_number, opportunity_id, customer_id, customer_name,
      title, items, subtotal, discount_amount, tax_amount, total_amount,
      currency, terms, status, valid_until, owner_user_id
    ) values (
      v_org_id,
      coalesce(p_payload->>'quote_number', public._sal521_next_number(v_org_id, 'QUO', 'organization_sales_quotes')),
      nullif(p_payload->>'opportunity_id', '')::uuid,
      nullif(p_payload->>'customer_id', '')::uuid,
      coalesce(p_payload->>'customer_name', ''),
      coalesce(p_payload->>'title', 'Quote'),
      coalesce(p_payload->'items', '[]'::jsonb),
      v_amount, 0, 0, v_amount,
      coalesce(p_payload->>'currency', 'NOK'),
      coalesce(p_payload->>'terms', ''),
      'draft',
      nullif(p_payload->>'valid_until', '')::date,
      (select id from public.users where auth_user_id = auth.uid() limit 1)
    ) returning id into v_id;

    perform public._sal521_log(v_org_id, 'quote_created', 'Quote created', null, v_id, p_payload);
    return jsonb_build_object('ok', true, 'quote_id', v_id);

  elsif p_action_type = 'submit_quote' then
    v_id := (p_payload->>'quote_id')::uuid;
    update public.organization_sales_quotes set status = 'pending_approval', updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._sal521_log(v_org_id, 'quote_submitted', 'Quote submitted for approval', null, v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'approve_quote' then
    v_id := (p_payload->>'quote_id')::uuid;
    update public.organization_sales_quotes set status = 'approved', updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._sal521_log(v_org_id, 'quote_approved', 'Quote approved', null, v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'accept_quote' then
    v_id := (p_payload->>'quote_id')::uuid;
    update public.organization_sales_quotes set status = 'accepted', updated_at = now()
    where id = v_id and organization_id = v_org_id returning * into v_quote;
    perform public._sal521_log(v_org_id, 'quote_accepted', 'Quote accepted', v_quote.opportunity_id, v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'reject_quote' then
    v_id := (p_payload->>'quote_id')::uuid;
    update public.organization_sales_quotes set status = 'rejected', updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._sal521_log(v_org_id, 'quote_rejected', 'Quote rejected', null, v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'convert_quote' then
    v_id := (p_payload->>'quote_id')::uuid;
    update public.organization_sales_quotes set status = 'converted', updated_at = now()
    where id = v_id and organization_id = v_org_id returning * into v_quote;
    perform public._sal521_log(v_org_id, 'quote_converted', 'Quote converted', v_quote.opportunity_id, v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_activity' then
    v_id := (p_payload->>'opportunity_id')::uuid;
    insert into public.organization_sales_activities (
      organization_id, opportunity_id, activity_type, title, summary,
      scheduled_at, completed_at, owner_user_id
    ) values (
      v_org_id, v_id,
      coalesce(p_payload->>'activity_type', 'note'),
      coalesce(p_payload->>'title', 'Activity'),
      coalesce(p_payload->>'summary', ''),
      nullif(p_payload->>'scheduled_at', '')::timestamptz,
      nullif(p_payload->>'completed_at', '')::timestamptz,
      (select id from public.users where auth_user_id = auth.uid() limit 1)
    ) returning id into v_id;

    update public.organization_sales_opportunities
    set last_activity_at = now(), updated_at = now()
    where id = (p_payload->>'opportunity_id')::uuid and organization_id = v_org_id;

    perform public._sal521_log(v_org_id, 'activity_created', 'Sales activity recorded',
      (p_payload->>'opportunity_id')::uuid, null, p_payload);
    return jsonb_build_object('ok', true, 'activity_id', v_id);

  elsif p_action_type = 'create_playbook' then
    insert into public.organization_sales_playbooks (
      organization_id, playbook_key, title, playbook_type, description, steps
    ) values (
      v_org_id,
      coalesce(p_payload->>'playbook_key', 'custom_' || substr(gen_random_uuid()::text, 1, 8)),
      coalesce(p_payload->>'title', 'Custom playbook'),
      coalesce(p_payload->>'playbook_type', 'custom'),
      coalesce(p_payload->>'description', ''),
      coalesce(p_payload->'steps', '[]'::jsonb)
    ) returning id into v_id;
    perform public._sal521_log(v_org_id, 'playbook_created', 'Sales playbook created', null, null, p_payload);
    return jsonb_build_object('ok', true, 'playbook_id', v_id);

  elsif p_action_type = 'refresh_forecast' then
    perform public._sal521_refresh_forecast(v_org_id);
    perform public._sal521_log(v_org_id, 'forecast_updated', 'Revenue forecast refreshed', null, null, p_payload);
    return jsonb_build_object('ok', true);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Companion & mobile summary
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_sales_revenue_pipeline_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
begin
  perform public._irp_require_permission('sales.view');
  v_org_id := public._sal521_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._sal521_ensure_settings(v_org_id);

  return jsonb_build_object(
    'found', true,
    'principle', 'Relationships create opportunities. Opportunities create revenue.',
    'open_opportunities', (
      select count(*) from public.organization_sales_opportunities
      where organization_id = v_org_id and stage not in ('won', 'lost')
    ),
    'pipeline_value', coalesce((
      select sum(value_amount) from public.organization_sales_opportunities
      where organization_id = v_org_id and stage not in ('won', 'lost')
    ), 0),
    'weighted_forecast', coalesce((
      select sum(value_amount * probability / 100.0) from public.organization_sales_opportunities
      where organization_id = v_org_id and stage not in ('won', 'lost')
    ), 0),
    'largest_opportunities', coalesce((
      select jsonb_agg(jsonb_build_object(
        'name', name, 'value_amount', value_amount, 'currency', currency,
        'stage', stage, 'health_status', health_status
      ) order by value_amount desc)
      from (
        select name, value_amount, currency, stage, health_status
        from public.organization_sales_opportunities
        where organization_id = v_org_id and stage not in ('won', 'lost')
        order by value_amount desc limit 5
      ) x
    ), '[]'::jsonb),
    'at_risk_opportunities', coalesce((
      select jsonb_agg(jsonb_build_object('name', name, 'stage', stage, 'expected_close_date', expected_close_date))
      from (
        select name, stage, expected_close_date from public.organization_sales_opportunities
        where organization_id = v_org_id and health_status = 'at_risk' and stage not in ('won', 'lost')
        limit 10
      ) x
    ), '[]'::jsonb),
    'no_activity_opportunities', coalesce((
      select jsonb_agg(jsonb_build_object('name', name, 'last_activity_at', last_activity_at))
      from (
        select name, last_activity_at from public.organization_sales_opportunities
        where organization_id = v_org_id and stage not in ('won', 'lost')
          and coalesce(last_activity_at, created_at) < now() - interval '14 days'
        limit 10
      ) x
    ), '[]'::jsonb),
    'next_quarter_forecast', coalesce((
      select jsonb_build_object(
        'period_label', period_label,
        'weighted_revenue', weighted_revenue,
        'forecast_confidence', forecast_confidence
      )
      from public.organization_sales_forecasts
      where organization_id = v_org_id
      order by generated_at desc limit 1
    ), '{}'::jsonb),
    'companion_prompts', jsonb_build_array(
      'Show largest opportunities.',
      'Which deals are at risk?',
      'Create follow-up task for stalled opportunities.',
      'Show forecast for next quarter.',
      'Which opportunities have no recent activity?'
    ),
    'routes', jsonb_build_object(
      'sales', '/app/sales',
      'quotes', '/app/sales/quotes',
      'playbooks', '/app/sales/playbooks',
      'customers', '/app/customers'
    )
  );
end; $$;

create or replace function public.get_my_sales_revenue_pipeline_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
begin
  perform public._irp_require_permission('sales.view');
  v_org_id := public._sal521_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);

  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('sales.manage', v_org_id),
    'my_open_opportunities', (
      select count(*) from public.organization_sales_opportunities
      where organization_id = v_org_id and owner_user_id = v_user_id and stage not in ('won', 'lost')
    ),
    'my_pipeline_value', coalesce((
      select sum(value_amount) from public.organization_sales_opportunities
      where organization_id = v_org_id and owner_user_id = v_user_id and stage not in ('won', 'lost')
    ), 0),
    'upcoming_activities', (
      select count(*) from public.organization_sales_activities a
      join public.organization_sales_opportunities o on o.id = a.opportunity_id
      where a.organization_id = v_org_id and o.owner_user_id = v_user_id
        and a.scheduled_at between now() and now() + interval '7 days'
        and a.completed_at is null
    ),
    'routes', jsonb_build_object(
      'sales', '/app/sales',
      'quotes', '/app/sales/quotes',
      'mobile_ready', true
    )
  );
exception when others then
  return jsonb_build_object('found', true, 'can_manage', false, 'routes', jsonb_build_object('sales', '/app/sales'));
end; $$;

-- Module registry & permissions
do $$ begin
  perform public._mre501_seed_module(
    'sales', 'Sales', 'sales', 'operations',
    'Opportunities, pipelines, quotes, forecasting, and revenue growth.',
    'starter', null, 'operations', '/app/sales', 'licensed', 8
  );
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('sales', 'sales.view', 'view', 'Sales — view pipeline, opportunities, quotes, and forecasts'),
    ('sales', 'sales.manage', 'manage', 'Sales — create, update, approve quotes, and manage deals')
  on conflict (permission_key) do nothing;
exception when others then
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('sales', 'sales.view', 'view', 'Sales — view pipeline, opportunities, quotes, and forecasts'),
    ('sales', 'sales.manage', 'manage', 'Sales — create, update, approve quotes, and manage deals')
  on conflict (permission_key) do nothing;
end $$;

grant execute on function public.get_sales_revenue_pipeline_center(text) to authenticated;
grant execute on function public.perform_sales_revenue_pipeline_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_sales_revenue_pipeline_context() to authenticated;
grant execute on function public.get_my_sales_revenue_pipeline_summary() to authenticated;
