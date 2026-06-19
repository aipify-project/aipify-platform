-- Phase 531 — Customer Relationship & Account Management Engine
-- Extends Phase 517. Customer intelligence layer — opportunities, contracts, renewals, health.

-- ---------------------------------------------------------------------------
-- 1. Extend customers
-- ---------------------------------------------------------------------------
alter table public.organization_crm_customers add column if not exists industry text;
alter table public.organization_crm_customers add column if not exists lifecycle_stage text not null default 'prospect';
alter table public.organization_crm_customers add column if not exists organization_number text;
alter table public.organization_crm_customers add column if not exists employee_count integer;
alter table public.organization_crm_customers add column if not exists health_score integer;
alter table public.organization_crm_customers add column if not exists health_status text not null default 'healthy' check (
  health_status in ('healthy', 'needs_attention', 'at_risk')
);

alter table public.organization_crm_customers drop constraint if exists organization_crm_customers_status_check;
alter table public.organization_crm_customers add constraint organization_crm_customers_status_check check (
  status in (
    'active', 'prospect', 'requires_attention', 'at_risk', 'restricted',
    'renewed', 'lost', 'inactive'
  )
);

alter table public.organization_crm_customers drop constraint if exists organization_crm_customers_customer_type_check;
alter table public.organization_crm_customers add constraint organization_crm_customers_customer_type_check check (
  customer_type in (
    'individual', 'business', 'enterprise', 'partner', 'supplier', 'vendor', 'contractor',
    'lead', 'prospect', 'customer', 'former_customer', 'custom'
  )
);

alter table public.organization_crm_contacts add column if not exists department text;
alter table public.organization_crm_contacts add column if not exists preferred_language text default 'en';
alter table public.organization_crm_contacts add column if not exists relationship_status text not null default 'active';

-- ---------------------------------------------------------------------------
-- 2. Opportunities, contracts, renewals
-- ---------------------------------------------------------------------------
create table if not exists public.organization_crm_opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  opportunity_number text,
  customer_id uuid not null references public.organization_crm_customers (id) on delete cascade,
  contact_id uuid references public.organization_crm_contacts (id) on delete set null,
  name text not null,
  stage text not null default 'lead' check (
    stage in ('lead', 'qualified', 'proposal', 'negotiation', 'decision', 'won', 'lost', 'custom')
  ),
  value numeric(14, 2),
  probability integer not null default 10 check (probability >= 0 and probability <= 100),
  expected_close_date date,
  owner_user_id uuid references public.users (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  partner_owned boolean not null default false,
  status text not null default 'open' check (status in ('open', 'won', 'lost', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, opportunity_number)
);

create index if not exists organization_crm_opportunities_org_stage_idx
  on public.organization_crm_opportunities (organization_id, stage, status);

alter table public.organization_crm_opportunities enable row level security;
revoke all on public.organization_crm_opportunities from authenticated, anon;

create table if not exists public.organization_crm_contracts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  contract_number text,
  customer_id uuid not null references public.organization_crm_customers (id) on delete cascade,
  title text not null,
  value numeric(14, 2),
  currency text not null default 'NOK',
  starts_at date,
  ends_at date,
  renewal_terms text not null default '',
  status text not null default 'active' check (
    status in ('draft', 'active', 'expiring', 'renewed', 'expired', 'cancelled')
  ),
  attachments jsonb not null default '[]'::jsonb,
  approval_history jsonb not null default '[]'::jsonb,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, contract_number)
);

create index if not exists organization_crm_contracts_org_status_idx
  on public.organization_crm_contracts (organization_id, status, ends_at);

alter table public.organization_crm_contracts enable row level security;
revoke all on public.organization_crm_contracts from authenticated, anon;

create table if not exists public.organization_crm_renewals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  renewal_number text,
  customer_id uuid not null references public.organization_crm_customers (id) on delete cascade,
  contract_id uuid references public.organization_crm_contracts (id) on delete set null,
  renewal_type text not null default 'contract' check (
    renewal_type in ('subscription', 'contract', 'license', 'domain', 'business_pack', 'custom')
  ),
  due_date date not null,
  status text not null default 'pending' check (
    status in ('pending', 'in_progress', 'completed', 'overdue', 'cancelled')
  ),
  owner_user_id uuid references public.users (id) on delete set null,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, renewal_number)
);

create index if not exists organization_crm_renewals_org_due_idx
  on public.organization_crm_renewals (organization_id, due_date, status);

alter table public.organization_crm_renewals enable row level security;
revoke all on public.organization_crm_renewals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._crm531_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_require_organization();
$$;

create or replace function public._crm531_user()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_app_user_id();
$$;

create or replace function public._crm531_next_number(p_org_id uuid, p_prefix text, p_table text)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_n bigint;
begin
  execute format('select count(*) + 1 from public.%I where organization_id = $1', p_table)
  into v_n using p_org_id;
  return p_prefix || '-' || lpad(v_n::text, 5, '0');
end; $$;

create or replace function public._crm531_compute_health(p_org_id uuid, p_customer_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_score int := 70;
  v_status text := 'healthy';
  v_days_since_activity int;
begin
  select coalesce(extract(day from now() - max(occurred_at))::int, 999)
  into v_days_since_activity
  from public.organization_crm_timeline_events
  where organization_id = p_org_id and customer_id = p_customer_id;

  if v_days_since_activity > 90 then v_score := v_score - 25;
  elsif v_days_since_activity > 45 then v_score := v_score - 10;
  end if;

  if exists (
    select 1 from public.organization_crm_renewals
    where customer_id = p_customer_id and status in ('pending', 'overdue') and due_date <= current_date + 30
  ) then v_score := v_score - 15; end if;

  if exists (
    select 1 from public.organization_crm_customers
    where id = p_customer_id and status in ('requires_attention', 'at_risk', 'inactive')
  ) then v_score := v_score - 20; end if;

  v_score := greatest(0, least(100, v_score));
  v_status := case
    when v_score >= 75 then 'healthy'
    when v_score >= 50 then 'needs_attention'
    else 'at_risk'
  end;

  return jsonb_build_object('health_score', v_score, 'health_status', v_status);
end; $$;

create or replace function public._crm531_customer_json(p_row public.organization_crm_customers)
returns jsonb language plpgsql stable as $$
begin
  return public._crm517_customer_json(p_row) || jsonb_build_object(
    'industry', p_row.industry,
    'lifecycle_stage', p_row.lifecycle_stage,
    'organization_number', p_row.organization_number,
    'employee_count', p_row.employee_count,
    'health_score', p_row.health_score,
    'health_status', p_row.health_status
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Customer Relationship Center (Phase 531 upgrade)
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_relationship_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('customers.view');
  v_org_id := public._crm531_org();
  perform public._crm517_ensure_settings(v_org_id);
  perform public._crm517_log(v_org_id, 'center_view', 'Customer Center viewed', null, null,
    jsonb_build_object('section', p_section));

  return jsonb_build_object(
    'found', true,
    'principle', 'Customers are the reason organizations exist. Every customer interaction should be organized, searchable, measurable, and actionable.',
    'philosophy', 'Customers create revenue. Relationships create trust. Trust creates growth.',
    'overview', jsonb_build_object(
      'total_customers', (select count(*) from public.organization_crm_customers where organization_id = v_org_id),
      'active', (select count(*) from public.organization_crm_customers where organization_id = v_org_id and status = 'active'),
      'prospects', (select count(*) from public.organization_crm_customers where organization_id = v_org_id and status = 'prospect'),
      'at_risk', (select count(*) from public.organization_crm_customers where organization_id = v_org_id and status in ('at_risk', 'requires_attention')),
      'requires_attention', (select count(*) from public.organization_crm_customers where organization_id = v_org_id and status in ('requires_attention', 'at_risk')),
      'open_leads', (select count(*) from public.organization_crm_leads where organization_id = v_org_id and status not in ('won', 'lost')),
      'open_opportunities', (select count(*) from public.organization_crm_opportunities where organization_id = v_org_id and status = 'open'),
      'pipeline_value', coalesce((select sum(value) from public.organization_crm_opportunities where organization_id = v_org_id and status = 'open'), 0),
      'renewals_due_90d', (select count(*) from public.organization_crm_renewals where organization_id = v_org_id and due_date <= current_date + 90 and status in ('pending', 'in_progress', 'overdue')),
      'contracts_expiring_90d', (select count(*) from public.organization_crm_contracts where organization_id = v_org_id and ends_at between current_date and current_date + 90 and status in ('active', 'expiring')),
      'healthy_customers', (select count(*) from public.organization_crm_customers where organization_id = v_org_id and health_status = 'healthy'),
      'contacts', (select count(*) from public.organization_crm_contacts where organization_id = v_org_id),
      'follow_ups_due', (
        select count(*) from public.organization_crm_leads
        where organization_id = v_org_id and follow_up_date <= current_date and status not in ('won', 'lost')
      ),
      'new_customers_30d', (
        select count(*) from public.organization_crm_customers
        where organization_id = v_org_id and created_at >= now() - interval '30 days'
      )
    ),
    'customers', coalesce((
      select jsonb_agg(public._crm531_customer_json(c) order by c.updated_at desc)
      from (select * from public.organization_crm_customers where organization_id = v_org_id order by updated_at desc limit 100) c
    ), '[]'::jsonb),
    'prospects', coalesce((
      select jsonb_agg(public._crm531_customer_json(c) order by c.updated_at desc)
      from public.organization_crm_customers c
      where c.organization_id = v_org_id and c.status = 'prospect'
      limit 50
    ), '[]'::jsonb),
    'contacts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', ct.id, 'customer_id', ct.customer_id,
        'customer_name', (select coalesce(company_name, name) from public.organization_crm_customers where id = ct.customer_id),
        'contact_role', ct.contact_role, 'full_name', ct.full_name,
        'email', ct.email, 'phone', ct.phone, 'department', ct.department,
        'preferred_language', ct.preferred_language, 'is_primary', ct.is_primary,
        'relationship_status', ct.relationship_status
      ) order by ct.full_name)
      from public.organization_crm_contacts ct where ct.organization_id = v_org_id limit 80
    ), '[]'::jsonb),
    'organizations', coalesce((
      select jsonb_agg(public._crm531_customer_json(c) order by c.company_name)
      from public.organization_crm_customers c
      where c.organization_id = v_org_id and c.customer_type in ('business', 'enterprise', 'partner', 'customer')
      limit 50
    ), '[]'::jsonb),
    'leads', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'lead_number', l.lead_number, 'company_name', l.company_name,
        'contact_name', l.contact_name, 'email', l.email, 'status', l.status,
        'lead_source', l.lead_source, 'expected_value', l.expected_value,
        'follow_up_date', l.follow_up_date
      ) order by l.created_at desc)
      from public.organization_crm_leads l where l.organization_id = v_org_id and l.status not in ('won', 'lost')
      limit 50
    ), '[]'::jsonb),
    'opportunities', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id, 'opportunity_number', o.opportunity_number, 'name', o.name,
        'customer_id', o.customer_id,
        'customer_name', (select coalesce(company_name, name) from public.organization_crm_customers where id = o.customer_id),
        'stage', o.stage, 'value', o.value, 'probability', o.probability,
        'expected_close_date', o.expected_close_date, 'status', o.status,
        'partner_owned', o.partner_owned
      ) order by o.expected_close_date nulls last)
      from public.organization_crm_opportunities o
      where o.organization_id = v_org_id and o.status = 'open'
      limit 50
    ), '[]'::jsonb),
    'pipeline', jsonb_build_object(
      'lead', (select count(*) from public.organization_crm_opportunities where organization_id = v_org_id and stage = 'lead' and status = 'open'),
      'qualified', (select count(*) from public.organization_crm_opportunities where organization_id = v_org_id and stage = 'qualified' and status = 'open'),
      'proposal', (select count(*) from public.organization_crm_opportunities where organization_id = v_org_id and stage = 'proposal' and status = 'open'),
      'negotiation', (select count(*) from public.organization_crm_opportunities where organization_id = v_org_id and stage = 'negotiation' and status = 'open'),
      'decision', (select count(*) from public.organization_crm_opportunities where organization_id = v_org_id and stage = 'decision' and status = 'open'),
      'won', (select count(*) from public.organization_crm_opportunities where organization_id = v_org_id and status = 'won'),
      'lost', (select count(*) from public.organization_crm_opportunities where organization_id = v_org_id and status = 'lost')
    ),
    'timeline', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'customer_id', e.customer_id,
        'customer_name', (select coalesce(company_name, name) from public.organization_crm_customers where id = e.customer_id),
        'event_type', e.event_type, 'title', e.title, 'summary', e.summary, 'occurred_at', e.occurred_at
      ) order by e.occurred_at desc)
      from public.organization_crm_timeline_events e where e.organization_id = v_org_id limit 50
    ), '[]'::jsonb),
    'activities', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'customer_id', e.customer_id,
        'customer_name', (select coalesce(company_name, name) from public.organization_crm_customers where id = e.customer_id),
        'event_type', e.event_type, 'title', e.title, 'summary', e.summary, 'occurred_at', e.occurred_at
      ) order by e.occurred_at desc)
      from public.organization_crm_timeline_events e where e.organization_id = v_org_id limit 50
    ), '[]'::jsonb),
    'communications', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', cm.id, 'customer_id', cm.customer_id,
        'customer_name', (select coalesce(company_name, name) from public.organization_crm_customers where id = cm.customer_id),
        'channel', cm.channel, 'subject', cm.subject, 'summary', cm.summary, 'occurred_at', cm.occurred_at
      ) order by cm.occurred_at desc)
      from public.organization_crm_communications cm where cm.organization_id = v_org_id limit 40
    ), '[]'::jsonb),
    'contracts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'contract_number', c.contract_number, 'title', c.title,
        'customer_id', c.customer_id,
        'customer_name', (select coalesce(company_name, name) from public.organization_crm_customers where id = c.customer_id),
        'value', c.value, 'starts_at', c.starts_at, 'ends_at', c.ends_at,
        'renewal_terms', c.renewal_terms, 'status', c.status
      ) order by c.ends_at nulls last)
      from public.organization_crm_contracts c where c.organization_id = v_org_id limit 50
    ), '[]'::jsonb),
    'renewals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'renewal_number', r.renewal_number, 'renewal_type', r.renewal_type,
        'customer_id', r.customer_id,
        'customer_name', (select coalesce(company_name, name) from public.organization_crm_customers where id = r.customer_id),
        'due_date', r.due_date, 'status', r.status, 'summary', r.summary
      ) order by r.due_date)
      from public.organization_crm_renewals r
      where r.organization_id = v_org_id and r.status in ('pending', 'in_progress', 'overdue')
      limit 40
    ), '[]'::jsonb),
    'documents', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id, 'customer_id', d.customer_id,
        'customer_name', (select coalesce(company_name, name) from public.organization_crm_customers where id = d.customer_id),
        'document_type', d.document_type, 'title', d.title, 'created_at', d.created_at
      ) order by d.created_at desc)
      from public.organization_crm_documents d where d.organization_id = v_org_id limit 40
    ), '[]'::jsonb),
    'subscription_awareness', jsonb_build_object(
      'note', 'Integrates with Billing, License, and Domain engines for live subscription data.',
      'renewals_tracked', (select count(*) from public.organization_crm_renewals where organization_id = v_org_id)
    ),
    'reports', jsonb_build_object(
      'customer_growth_30d', (select count(*) from public.organization_crm_customers where organization_id = v_org_id and created_at >= now() - interval '30 days'),
      'retention_pct', least(100, greatest(0, coalesce((
        select (count(*) filter (where status = 'active')::numeric / greatest(count(*), 1)) * 100
        from public.organization_crm_customers where organization_id = v_org_id
      ), 0)::int)),
      'churn_lost', (select count(*) from public.organization_crm_customers where organization_id = v_org_id and status = 'lost'),
      'pipeline_value', coalesce((select sum(value) from public.organization_crm_opportunities where organization_id = v_org_id and status = 'open'), 0),
      'renewals_due_90d', (select count(*) from public.organization_crm_renewals where organization_id = v_org_id and due_date <= current_date + 90 and status in ('pending', 'overdue')),
      'revenue_forecast', coalesce((
        select sum(value * probability / 100.0) from public.organization_crm_opportunities
        where organization_id = v_org_id and status = 'open'
      ), 0)
    ),
    'companion_insights', jsonb_build_object(
      'at_risk', coalesce((
        select jsonb_agg(jsonb_build_object('name', coalesce(company_name, name), 'health_status', health_status))
        from public.organization_crm_customers
        where organization_id = v_org_id and health_status = 'at_risk'
        limit 10
      ), '[]'::jsonb),
      'contracts_expiring', coalesce((
        select jsonb_agg(jsonb_build_object('title', title, 'ends_at', ends_at))
        from public.organization_crm_contracts
        where organization_id = v_org_id and ends_at between current_date and current_date + 30
        limit 10
      ), '[]'::jsonb),
      'top_opportunities', coalesce((
        select jsonb_agg(t.obj)
        from (
          select jsonb_build_object('name', name, 'value', value, 'stage', stage) as obj
          from public.organization_crm_opportunities
          where organization_id = v_org_id and status = 'open'
          order by value desc nulls last limit 5
        ) t
      ), '[]'::jsonb)
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('action', a.action, 'summary', a.summary, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_crm_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'customer_types', jsonb_build_array('lead', 'prospect', 'customer', 'partner', 'vendor', 'former_customer', 'business', 'enterprise', 'custom'),
    'customer_statuses', jsonb_build_array('active', 'prospect', 'at_risk', 'restricted', 'renewed', 'lost'),
    'pipeline_stages', jsonb_build_array('lead', 'qualified', 'proposal', 'negotiation', 'decision', 'won', 'lost'),
    'sections', jsonb_build_array(
      'overview', 'prospects', 'customers', 'organizations', 'contacts', 'opportunities',
      'activities', 'renewals', 'reports'
    ),
    'routes', jsonb_build_object(
      'customers', '/app/customers',
      'opportunities', '/app/customers/opportunities',
      'contracts', '/app/customers/contracts',
      'leads', '/app/leads',
      'scheduling', '/app/scheduling',
      'communications', '/app/communications',
      'license', '/app/license'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Legacy action helper + extended actions
-- ---------------------------------------------------------------------------
create or replace function public._crm517_perform_legacy_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_customer_id uuid;
  v_lead_id uuid;
  v_contact_id uuid;
  v_doc_id uuid;
  v_task_id uuid;
  v_new_status text;
begin
  v_org_id := public._crm517_org();

  if p_action_type = 'create_customer' then
    insert into public.organization_crm_customers (
      organization_id, customer_number, customer_type, name, company_name,
      email, phone, country, language, website, status, industry, lifecycle_stage,
      assigned_employee_profile_id, assigned_department_id, tags
    ) values (
      v_org_id,
      coalesce(p_payload->>'customer_number', public._crm517_next_customer_number(v_org_id)),
      coalesce(p_payload->>'customer_type', 'business'),
      coalesce(p_payload->>'name', 'New customer'),
      p_payload->>'company_name',
      p_payload->>'email', p_payload->>'phone', p_payload->>'country',
      coalesce(p_payload->>'language', 'en'), p_payload->>'website',
      coalesce(p_payload->>'status', 'prospect'),
      p_payload->>'industry', coalesce(p_payload->>'lifecycle_stage', 'prospect'),
      nullif(p_payload->>'assigned_employee_profile_id', '')::uuid,
      nullif(p_payload->>'assigned_department_id', '')::uuid,
      coalesce(p_payload->'tags', '[]'::jsonb)
    ) returning id into v_customer_id;
    perform public._crm517_add_timeline(v_org_id, v_customer_id, 'relationship', 'Customer created', 'Customer profile created');
    perform public._crm517_log(v_org_id, 'customer_created', 'Customer created', v_customer_id, null, p_payload);
    return jsonb_build_object('ok', true, 'customer_id', v_customer_id);

  elsif p_action_type = 'update_customer' then
    v_customer_id := (p_payload->>'customer_id')::uuid;
    update public.organization_crm_customers set
      name = coalesce(p_payload->>'name', name),
      company_name = coalesce(p_payload->>'company_name', company_name),
      email = coalesce(p_payload->>'email', email),
      status = coalesce(p_payload->>'status', status),
      lifecycle_stage = coalesce(p_payload->>'lifecycle_stage', lifecycle_stage),
      industry = coalesce(p_payload->>'industry', industry),
      updated_at = now()
    where id = v_customer_id and organization_id = v_org_id;
    perform public._crm517_log(v_org_id, 'customer_updated', 'Customer updated', v_customer_id, null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_contact' then
    v_customer_id := (p_payload->>'customer_id')::uuid;
    insert into public.organization_crm_contacts (
      organization_id, customer_id, contact_role, full_name, email, phone, title, department, is_primary
    ) values (
      v_org_id, v_customer_id, coalesce(p_payload->>'contact_role', 'general'),
      coalesce(p_payload->>'full_name', 'Contact'),
      p_payload->>'email', p_payload->>'phone', p_payload->>'title',
      p_payload->>'department', coalesce((p_payload->>'is_primary')::boolean, false)
    ) returning id into v_contact_id;
    perform public._crm517_log(v_org_id, 'contact_added', 'Contact added', v_customer_id, null, p_payload);
    return jsonb_build_object('ok', true, 'contact_id', v_contact_id);

  elsif p_action_type = 'create_lead' then
    insert into public.organization_crm_leads (
      organization_id, lead_number, company_name, contact_name, email, phone,
      lead_source, status, expected_value, follow_up_date, notes
    ) values (
      v_org_id, coalesce(p_payload->>'lead_number', public._crm517_next_lead_number(v_org_id)),
      coalesce(p_payload->>'company_name', 'New lead'),
      p_payload->>'contact_name', p_payload->>'email', p_payload->>'phone',
      coalesce(p_payload->>'lead_source', 'direct'), coalesce(p_payload->>'status', 'new'),
      nullif(p_payload->>'expected_value', '')::numeric,
      nullif(p_payload->>'follow_up_date', '')::date,
      coalesce(p_payload->>'notes', '')
    ) returning id into v_lead_id;
    perform public._crm517_log(v_org_id, 'lead_created', 'Lead created', null, v_lead_id, p_payload);
    return jsonb_build_object('ok', true, 'lead_id', v_lead_id);

  elsif p_action_type = 'update_lead' then
    v_lead_id := (p_payload->>'lead_id')::uuid;
    v_new_status := p_payload->>'status';
    update public.organization_crm_leads set
      status = coalesce(v_new_status, status),
      follow_up_date = coalesce(nullif(p_payload->>'follow_up_date', '')::date, follow_up_date),
      updated_at = now()
    where id = v_lead_id and organization_id = v_org_id;
    perform public._crm517_log(v_org_id, 'lead_updated', 'Lead updated', null, v_lead_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'convert_lead' then
    v_lead_id := (p_payload->>'lead_id')::uuid;
    insert into public.organization_crm_customers (
      organization_id, customer_number, customer_type, name, company_name, email, phone, status
    )
    select v_org_id, public._crm517_next_customer_number(v_org_id), 'customer',
      coalesce(l.contact_name, l.company_name), l.company_name, l.email, l.phone, 'active'
    from public.organization_crm_leads l where l.id = v_lead_id and l.organization_id = v_org_id
    returning id into v_customer_id;
    update public.organization_crm_leads set status = 'won', converted_customer_id = v_customer_id, updated_at = now() where id = v_lead_id;
    perform public._crm517_log(v_org_id, 'lead_won', 'Lead converted', v_customer_id, v_lead_id, p_payload);
    return jsonb_build_object('ok', true, 'customer_id', v_customer_id);

  elsif p_action_type = 'assign_owner' then
    v_customer_id := (p_payload->>'customer_id')::uuid;
    update public.organization_crm_customers set
      owner_user_id = nullif(p_payload->>'owner_user_id', '')::uuid,
      assigned_employee_profile_id = nullif(p_payload->>'assigned_employee_profile_id', '')::uuid,
      updated_at = now()
    where id = v_customer_id and organization_id = v_org_id;
    perform public._crm517_log(v_org_id, 'customer_assigned', 'Customer assigned', v_customer_id, null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'add_note' then
    v_customer_id := (p_payload->>'customer_id')::uuid;
    perform public._crm517_add_timeline(v_org_id, v_customer_id, 'note', coalesce(p_payload->>'title', 'Note'), coalesce(p_payload->>'summary', ''));
    insert into public.organization_crm_communications (organization_id, customer_id, channel, subject, summary)
    values (v_org_id, v_customer_id, 'note', coalesce(p_payload->>'title', 'Note'), coalesce(p_payload->>'summary', ''));
    perform public._crm517_log(v_org_id, 'relationship_updated', 'Note added', v_customer_id, null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'add_communication' then
    v_customer_id := (p_payload->>'customer_id')::uuid;
    insert into public.organization_crm_communications (organization_id, customer_id, channel, subject, summary)
    values (v_org_id, v_customer_id, coalesce(p_payload->>'channel', 'note'), coalesce(p_payload->>'subject', 'Communication'), coalesce(p_payload->>'summary', ''));
    perform public._crm517_add_timeline(v_org_id, v_customer_id, coalesce(p_payload->>'channel', 'note'), coalesce(p_payload->>'subject', 'Communication'), coalesce(p_payload->>'summary', ''));
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'add_document' then
    v_customer_id := (p_payload->>'customer_id')::uuid;
    insert into public.organization_crm_documents (organization_id, customer_id, document_type, title, file_ref)
    values (v_org_id, v_customer_id, coalesce(p_payload->>'document_type', 'file'), coalesce(p_payload->>'title', 'Document'), p_payload->>'file_ref')
    returning id into v_doc_id;
    perform public._crm517_log(v_org_id, 'document_added', 'Document added', v_customer_id, null, p_payload);
    return jsonb_build_object('ok', true, 'document_id', v_doc_id);

  elsif p_action_type = 'create_follow_up_task' then
    v_customer_id := (p_payload->>'customer_id')::uuid;
    insert into public.organization_crm_customer_tasks (organization_id, customer_id, task_type, title, due_date)
    values (v_org_id, v_customer_id, 'follow_up', coalesce(p_payload->>'title', 'Follow up with customer'), coalesce(nullif(p_payload->>'due_date', '')::date, current_date + 3))
    returning id into v_task_id;
    perform public._crm517_add_timeline(v_org_id, v_customer_id, 'task', coalesce(p_payload->>'title', 'Follow-up task'), 'Follow-up task created');
    return jsonb_build_object('ok', true, 'task_id', v_task_id);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
end; $$;

-- Extended perform action (Phase 531)
create or replace function public.perform_customer_relationship_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_customer_id uuid;
  v_opp_id uuid;
  v_contract_id uuid;
  v_renewal_id uuid;
  v_health jsonb;
  v_legacy text[] := array[
    'create_customer', 'update_customer', 'create_contact', 'create_lead', 'update_lead',
    'convert_lead', 'assign_owner', 'add_note', 'add_communication', 'add_document', 'create_follow_up_task'
  ];
  v_manage text[] := array[
    'create_opportunity', 'update_opportunity', 'close_opportunity',
    'create_contract', 'update_contract', 'trigger_renewal', 'refresh_health_score'
  ];
begin
  v_org_id := public._crm531_org();

  if p_action_type = any(v_legacy) or p_action_type = any(v_manage) then
    perform public._irp_require_permission('customers.manage');
  else
    perform public._irp_require_permission('customers.view');
  end if;

  if p_action_type = any(v_legacy) then
    return public._crm517_perform_legacy_action(p_action_type, p_payload);
  end if;

  if p_action_type = 'create_opportunity' then
    v_customer_id := (p_payload->>'customer_id')::uuid;
    insert into public.organization_crm_opportunities (
      organization_id, opportunity_number, customer_id, name, stage, value, probability,
      expected_close_date, owner_user_id, partner_owned
    ) values (
      v_org_id, public._crm531_next_number(v_org_id, 'OPP', 'organization_crm_opportunities'),
      v_customer_id, coalesce(p_payload->>'name', 'Opportunity'),
      coalesce(p_payload->>'stage', 'lead'),
      nullif(p_payload->>'value', '')::numeric,
      coalesce((p_payload->>'probability')::int, 10),
      nullif(p_payload->>'expected_close_date', '')::date,
      public._crm531_user(), coalesce((p_payload->>'partner_owned')::boolean, false)
    ) returning id into v_opp_id;
    perform public._crm517_add_timeline(v_org_id, v_customer_id, 'workflow', 'Opportunity created', coalesce(p_payload->>'name', ''));
    perform public._crm517_log(v_org_id, 'opportunity_created', 'Opportunity created', v_customer_id, null, p_payload);
    return jsonb_build_object('ok', true, 'opportunity_id', v_opp_id);

  elsif p_action_type = 'update_opportunity' then
    v_opp_id := (p_payload->>'opportunity_id')::uuid;
    update public.organization_crm_opportunities set
      stage = coalesce(p_payload->>'stage', stage),
      value = coalesce(nullif(p_payload->>'value', '')::numeric, value),
      probability = coalesce((p_payload->>'probability')::int, probability),
      updated_at = now()
    where id = v_opp_id and organization_id = v_org_id;
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'close_opportunity' then
    v_opp_id := (p_payload->>'opportunity_id')::uuid;
    update public.organization_crm_opportunities set
      status = coalesce(p_payload->>'status', 'won'),
      stage = case when coalesce(p_payload->>'status', 'won') = 'won' then 'won' else 'lost' end,
      updated_at = now()
    where id = v_opp_id and organization_id = v_org_id;
    perform public._crm517_log(v_org_id, 'opportunity_closed', 'Opportunity closed', null, null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_contract' then
    v_customer_id := (p_payload->>'customer_id')::uuid;
    insert into public.organization_crm_contracts (
      organization_id, contract_number, customer_id, title, value, starts_at, ends_at, renewal_terms
    ) values (
      v_org_id, public._crm531_next_number(v_org_id, 'CON', 'organization_crm_contracts'),
      v_customer_id, coalesce(p_payload->>'title', 'Contract'),
      nullif(p_payload->>'value', '')::numeric,
      nullif(p_payload->>'starts_at', '')::date,
      nullif(p_payload->>'ends_at', '')::date,
      coalesce(p_payload->>'renewal_terms', '')
    ) returning id into v_contract_id;
    perform public._crm517_log(v_org_id, 'contract_added', 'Contract added', v_customer_id, null, p_payload);
    return jsonb_build_object('ok', true, 'contract_id', v_contract_id);

  elsif p_action_type = 'update_contract' then
    v_contract_id := (p_payload->>'contract_id')::uuid;
    update public.organization_crm_contracts set
      title = coalesce(p_payload->>'title', title),
      ends_at = coalesce(nullif(p_payload->>'ends_at', '')::date, ends_at),
      status = coalesce(p_payload->>'status', status),
      updated_at = now()
    where id = v_contract_id and organization_id = v_org_id;
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'trigger_renewal' then
    v_customer_id := (p_payload->>'customer_id')::uuid;
    insert into public.organization_crm_renewals (
      organization_id, renewal_number, customer_id, contract_id, renewal_type, due_date, owner_user_id, summary
    ) values (
      v_org_id, public._crm531_next_number(v_org_id, 'REN', 'organization_crm_renewals'),
      v_customer_id, nullif(p_payload->>'contract_id', '')::uuid,
      coalesce(p_payload->>'renewal_type', 'contract'),
      coalesce(nullif(p_payload->>'due_date', '')::date, current_date + 90),
      public._crm531_user(), coalesce(p_payload->>'summary', 'Renewal triggered')
    ) returning id into v_renewal_id;
    perform public._crm517_log(v_org_id, 'renewal_triggered', 'Renewal triggered', v_customer_id, null, p_payload);
    return jsonb_build_object('ok', true, 'renewal_id', v_renewal_id);

  elsif p_action_type = 'refresh_health_score' then
    v_customer_id := (p_payload->>'customer_id')::uuid;
    v_health := public._crm531_compute_health(v_org_id, v_customer_id);
    update public.organization_crm_customers set
      health_score = (v_health->>'health_score')::int,
      health_status = v_health->>'health_status',
      updated_at = now()
    where id = v_customer_id and organization_id = v_org_id;
    perform public._crm517_log(v_org_id, 'health_score_updated', 'Health score updated', v_customer_id, null, v_health);
    return jsonb_build_object('ok', true, 'health', v_health);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Companion & mobile
-- ---------------------------------------------------------------------------
drop function if exists public.get_companion_customer_relationship_context();

create or replace function public.get_companion_customer_relationship_context(p_query text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('customers.view');
  v_org_id := public._crm531_org();

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion helps organizations understand and care for their customers.',
    'query', p_query,
    'summary', jsonb_build_object(
      'active_customers', (select count(*) from public.organization_crm_customers where organization_id = v_org_id and status = 'active'),
      'at_risk', (select count(*) from public.organization_crm_customers where organization_id = v_org_id and health_status = 'at_risk'),
      'open_opportunities', (select count(*) from public.organization_crm_opportunities where organization_id = v_org_id and status = 'open'),
      'renewals_due_30d', (select count(*) from public.organization_crm_renewals where organization_id = v_org_id and due_date <= current_date + 30 and status in ('pending', 'overdue')),
      'contracts_expiring_30d', (select count(*) from public.organization_crm_contracts where organization_id = v_org_id and ends_at between current_date and current_date + 30)
    ),
    'companion_prompts', jsonb_build_array(
      'Show customers at risk.',
      'Which contracts expire next month?',
      'Who has not been contacted recently?',
      'Show largest opportunities.',
      'Generate customer summary.'
    ),
    'routes', jsonb_build_object(
      'customers', '/app/customers',
      'opportunities', '/app/customers/opportunities',
      'contracts', '/app/customers/contracts'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

create or replace function public.get_my_customer_relationship_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_profile_id uuid;
begin
  perform public._irp_require_permission('customers.view');
  v_org_id := public._crm531_org();

  select p.id into v_profile_id
  from public.organization_employee_profiles p
  join public.organization_users ou on ou.id = p.organization_user_id
  join public.users u on u.id = ou.user_id
  where p.organization_id = v_org_id and u.auth_user_id = auth.uid() limit 1;

  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('customers.manage', v_org_id),
    'my_customers', (select count(*) from public.organization_crm_customers where organization_id = v_org_id and assigned_employee_profile_id = v_profile_id),
    'my_opportunities', (select count(*) from public.organization_crm_opportunities where organization_id = v_org_id and owner_user_id = public._crm531_user() and status = 'open'),
    'renewals_due', (select count(*) from public.organization_crm_renewals where organization_id = v_org_id and status in ('pending', 'overdue')),
    'routes', jsonb_build_object(
      'customers', '/app/customers',
      'opportunities', '/app/customers/opportunities',
      'contracts', '/app/customers/contracts',
      'mobile_ready', true
    )
  );
exception when others then
  return jsonb_build_object('found', true, 'routes', jsonb_build_object('customers', '/app/customers'));
end; $$;

do $$ begin
  perform public._mre501_seed_module(
    'customers', 'Customer Relationship & Account Management', 'customers', 'operations',
    'Customer center — prospects, accounts, opportunities, contracts, renewals, and health.',
    'starter', null, 'operations', '/app/customers', 'licensed', 5
  );
exception when others then null;
end $$;

grant execute on function public.get_companion_customer_relationship_context(text) to authenticated;
grant execute on function public._crm517_perform_legacy_action(text, jsonb) to authenticated;
grant execute on function public._crm531_compute_health(uuid, uuid) to authenticated;
