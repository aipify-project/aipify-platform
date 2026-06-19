-- Phase 517 — Customer, Contact & Relationship Management Engine
-- Organizations serve customers. Relationships create trust. Trust creates growth.
-- Integrates: Employees (516), Domains (505A), Tasks (506), Calendar (507), Documents (508), Communications (509)

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_crm_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  default_customer_type text not null default 'business',
  enable_lead_management boolean not null default true,
  auto_create_follow_up_tasks boolean not null default true,
  companion_customer_context_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_crm_settings enable row level security;
revoke all on public.organization_crm_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Customers, contacts, leads, ownership
-- ---------------------------------------------------------------------------
create table if not exists public.organization_crm_customers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_number text,
  customer_type text not null default 'business' check (
    customer_type in (
      'individual', 'business', 'enterprise', 'partner', 'supplier', 'vendor', 'contractor', 'custom'
    )
  ),
  name text not null,
  company_name text,
  email text,
  phone text,
  address text,
  country text,
  language text not null default 'en',
  website text,
  status text not null default 'prospect' check (
    status in ('active', 'prospect', 'requires_attention', 'restricted', 'inactive')
  ),
  owner_user_id uuid references public.users (id) on delete set null,
  assigned_employee_profile_id uuid references public.organization_employee_profiles (id) on delete set null,
  assigned_department_id uuid references public.organization_departments (id) on delete set null,
  parent_customer_id uuid references public.organization_crm_customers (id) on delete set null,
  tags jsonb not null default '[]'::jsonb,
  custom_fields jsonb not null default '{}'::jsonb,
  internal_notes text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, customer_number)
);

create index if not exists organization_crm_customers_org_status_idx
  on public.organization_crm_customers (organization_id, status, customer_type);

alter table public.organization_crm_customers enable row level security;
revoke all on public.organization_crm_customers from authenticated, anon;

create table if not exists public.organization_crm_contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid not null references public.organization_crm_customers (id) on delete cascade,
  contact_role text not null default 'general' check (
    contact_role in (
      'ceo', 'manager', 'purchasing', 'support', 'accounting', 'technical', 'general', 'custom'
    )
  ),
  full_name text not null,
  email text,
  phone text,
  title text,
  is_primary boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_crm_contacts_customer_idx
  on public.organization_crm_contacts (customer_id, is_primary desc);

alter table public.organization_crm_contacts enable row level security;
revoke all on public.organization_crm_contacts from authenticated, anon;

create table if not exists public.organization_crm_leads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  lead_number text,
  company_name text not null,
  contact_name text,
  email text,
  phone text,
  lead_source text not null default 'direct',
  status text not null default 'new' check (
    status in ('new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'won', 'lost')
  ),
  owner_user_id uuid references public.users (id) on delete set null,
  assigned_employee_profile_id uuid references public.organization_employee_profiles (id) on delete set null,
  expected_value numeric(14, 2),
  currency text not null default 'NOK',
  follow_up_date date,
  notes text not null default '',
  converted_customer_id uuid references public.organization_crm_customers (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, lead_number)
);

create index if not exists organization_crm_leads_org_status_idx
  on public.organization_crm_leads (organization_id, status, follow_up_date);

alter table public.organization_crm_leads enable row level security;
revoke all on public.organization_crm_leads from authenticated, anon;

create table if not exists public.organization_crm_ownership (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid not null references public.organization_crm_customers (id) on delete cascade,
  ownership_type text not null default 'employee' check (
    ownership_type in ('employee', 'department', 'shared')
  ),
  owner_user_id uuid references public.users (id) on delete set null,
  employee_profile_id uuid references public.organization_employee_profiles (id) on delete set null,
  department_id uuid references public.organization_departments (id) on delete set null,
  ownership_label text not null default '',
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique (customer_id, ownership_type, owner_user_id, department_id)
);

alter table public.organization_crm_ownership enable row level security;
revoke all on public.organization_crm_ownership from authenticated, anon;

create table if not exists public.organization_crm_domain_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid not null references public.organization_crm_customers (id) on delete cascade,
  domain_id uuid not null references public.organization_domains (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (customer_id, domain_id)
);

alter table public.organization_crm_domain_assignments enable row level security;
revoke all on public.organization_crm_domain_assignments from authenticated, anon;

create table if not exists public.organization_crm_pack_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid not null references public.organization_crm_customers (id) on delete cascade,
  business_pack_key text not null,
  created_at timestamptz not null default now(),
  unique (customer_id, business_pack_key)
);

alter table public.organization_crm_pack_assignments enable row level security;
revoke all on public.organization_crm_pack_assignments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Timeline, communications, documents, tasks
-- ---------------------------------------------------------------------------
create table if not exists public.organization_crm_timeline_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid not null references public.organization_crm_customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'call', 'email', 'meeting', 'task', 'document', 'approval', 'order',
      'support_case', 'companion', 'note', 'lead', 'relationship', 'workflow', 'custom'
    )
  ),
  title text not null,
  summary text not null default '',
  occurred_at timestamptz not null default now(),
  source_ref text,
  actor_user_id uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_crm_timeline_events_customer_idx
  on public.organization_crm_timeline_events (customer_id, occurred_at desc);

alter table public.organization_crm_timeline_events enable row level security;
revoke all on public.organization_crm_timeline_events from authenticated, anon;

create table if not exists public.organization_crm_communications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid not null references public.organization_crm_customers (id) on delete cascade,
  contact_id uuid references public.organization_crm_contacts (id) on delete set null,
  channel text not null default 'note' check (
    channel in ('meeting', 'call', 'email', 'message', 'note', 'support', 'future')
  ),
  subject text not null default '',
  summary text not null default '',
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_crm_communications enable row level security;
revoke all on public.organization_crm_communications from authenticated, anon;

create table if not exists public.organization_crm_documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid not null references public.organization_crm_customers (id) on delete cascade,
  document_type text not null default 'file' check (
    document_type in ('contract', 'agreement', 'invoice', 'quote', 'report', 'policy', 'file', 'custom')
  ),
  title text not null,
  file_ref text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organization_crm_documents enable row level security;
revoke all on public.organization_crm_documents from authenticated, anon;

create table if not exists public.organization_crm_customer_tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid not null references public.organization_crm_customers (id) on delete cascade,
  task_type text not null default 'follow_up' check (
    task_type in ('follow_up', 'meeting', 'approval', 'renewal', 'request', 'escalation', 'custom')
  ),
  title text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'completed', 'cancelled')),
  due_date date,
  assigned_employee_profile_id uuid references public.organization_employee_profiles (id) on delete set null,
  external_task_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organization_crm_customer_tasks enable row level security;
revoke all on public.organization_crm_customer_tasks from authenticated, anon;

create table if not exists public.organization_crm_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid references public.organization_crm_customers (id) on delete set null,
  lead_id uuid references public.organization_crm_leads (id) on delete set null,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_crm_audit_logs_org_idx
  on public.organization_crm_audit_logs (organization_id, created_at desc);

alter table public.organization_crm_audit_logs enable row level security;
revoke all on public.organization_crm_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._crm517_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._crm517_log(
  p_org_id uuid, p_action text, p_summary text,
  p_customer_id uuid default null, p_lead_id uuid default null, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_crm_audit_logs (
    organization_id, customer_id, lead_id, actor_user_id, action, summary, payload
  ) values (
    p_org_id, p_customer_id, p_lead_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._crm517_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_crm_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._crm517_next_customer_number(p_org_id uuid)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_n bigint;
begin
  select count(*) + 1 into v_n from public.organization_crm_customers where organization_id = p_org_id;
  return 'C-' || lpad(v_n::text, 5, '0');
end; $$;

create or replace function public._crm517_next_lead_number(p_org_id uuid)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_n bigint;
begin
  select count(*) + 1 into v_n from public.organization_crm_leads where organization_id = p_org_id;
  return 'L-' || lpad(v_n::text, 5, '0');
end; $$;

create or replace function public._crm517_customer_json(p_row public.organization_crm_customers)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_row.id,
    'customer_number', p_row.customer_number,
    'customer_type', p_row.customer_type,
    'name', p_row.name,
    'company_name', p_row.company_name,
    'email', p_row.email,
    'phone', p_row.phone,
    'address', p_row.address,
    'country', p_row.country,
    'language', p_row.language,
    'website', p_row.website,
    'status', p_row.status,
    'owner_user_id', p_row.owner_user_id,
    'assigned_employee_profile_id', p_row.assigned_employee_profile_id,
    'assigned_department_id', p_row.assigned_department_id,
    'department_name', (select name from public.organization_departments where id = p_row.assigned_department_id),
    'assigned_employee_name', (
      select full_name from public.organization_employee_profiles where id = p_row.assigned_employee_profile_id
    ),
    'tags', p_row.tags,
    'custom_fields', p_row.custom_fields,
    'parent_customer_id', p_row.parent_customer_id,
    'created_at', p_row.created_at,
    'updated_at', p_row.updated_at
  );
end; $$;

create or replace function public._crm517_add_timeline(
  p_org_id uuid, p_customer_id uuid, p_event_type text, p_title text,
  p_summary text default '', p_payload jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.organization_crm_timeline_events (
    organization_id, customer_id, event_type, title, summary,
    actor_user_id, metadata
  ) values (
    p_org_id, p_customer_id, p_event_type, p_title, p_summary,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    coalesce(p_payload, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Customer Relationship Center
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_relationship_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_overview jsonb;
  v_customers jsonb;
  v_contacts jsonb;
  v_organizations jsonb;
  v_leads jsonb;
  v_timeline jsonb;
  v_communications jsonb;
  v_documents jsonb;
  v_reports jsonb;
  v_audit jsonb;
  v_insights jsonb;
begin
  perform public._irp_require_permission('customers.view');
  v_org_id := public._crm517_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._crm517_ensure_settings(v_org_id);
  perform public._crm517_log(v_org_id, 'center_view', 'Customer Center viewed', null, null,
    jsonb_build_object('section', p_section));

  select jsonb_build_object(
    'total_customers', (select count(*) from public.organization_crm_customers where organization_id = v_org_id),
    'active', (select count(*) from public.organization_crm_customers where organization_id = v_org_id and status = 'active'),
    'prospects', (select count(*) from public.organization_crm_customers where organization_id = v_org_id and status = 'prospect'),
    'requires_attention', (select count(*) from public.organization_crm_customers where organization_id = v_org_id and status = 'requires_attention'),
    'open_leads', (select count(*) from public.organization_crm_leads where organization_id = v_org_id and status not in ('won', 'lost')),
    'contacts', (select count(*) from public.organization_crm_contacts where organization_id = v_org_id),
    'follow_ups_due', (
      select count(*) from public.organization_crm_leads
      where organization_id = v_org_id and follow_up_date <= current_date and status not in ('won', 'lost')
    )
  ) into v_overview;

  select coalesce(jsonb_agg(public._crm517_customer_json(c) order by c.updated_at desc), '[]'::jsonb)
  into v_customers
  from (select * from public.organization_crm_customers where organization_id = v_org_id order by updated_at desc limit 100) c;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', ct.id, 'customer_id', ct.customer_id,
    'customer_name', (select coalesce(company_name, name) from public.organization_crm_customers where id = ct.customer_id),
    'contact_role', ct.contact_role, 'full_name', ct.full_name,
    'email', ct.email, 'phone', ct.phone, 'is_primary', ct.is_primary
  ) order by ct.full_name), '[]'::jsonb)
  into v_contacts
  from public.organization_crm_contacts ct where ct.organization_id = v_org_id limit 80;

  select coalesce(jsonb_agg(public._crm517_customer_json(c) order by c.company_name), '[]'::jsonb)
  into v_organizations
  from (
    select * from public.organization_crm_customers
    where organization_id = v_org_id and customer_type in ('business', 'enterprise', 'partner')
    order by company_name nulls last limit 50
  ) c;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'lead_number', l.lead_number, 'company_name', l.company_name,
    'contact_name', l.contact_name, 'email', l.email, 'status', l.status,
    'lead_source', l.lead_source, 'expected_value', l.expected_value,
    'follow_up_date', l.follow_up_date, 'owner_user_id', l.owner_user_id
  ) order by l.created_at desc), '[]'::jsonb)
  into v_leads
  from public.organization_crm_leads l where l.organization_id = v_org_id and l.status not in ('won', 'lost')
  limit 50;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'customer_id', e.customer_id,
    'customer_name', (select coalesce(company_name, name) from public.organization_crm_customers where id = e.customer_id),
    'event_type', e.event_type, 'title', e.title, 'summary', e.summary, 'occurred_at', e.occurred_at
  ) order by e.occurred_at desc), '[]'::jsonb)
  into v_timeline
  from public.organization_crm_timeline_events e where e.organization_id = v_org_id limit 40;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', cm.id, 'customer_id', cm.customer_id,
    'customer_name', (select coalesce(company_name, name) from public.organization_crm_customers where id = cm.customer_id),
    'channel', cm.channel, 'subject', cm.subject, 'summary', cm.summary, 'occurred_at', cm.occurred_at
  ) order by cm.occurred_at desc), '[]'::jsonb)
  into v_communications
  from public.organization_crm_communications cm where cm.organization_id = v_org_id limit 40;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'customer_id', d.customer_id,
    'customer_name', (select coalesce(company_name, name) from public.organization_crm_customers where id = d.customer_id),
    'document_type', d.document_type, 'title', d.title, 'created_at', d.created_at
  ) order by d.created_at desc), '[]'::jsonb)
  into v_documents
  from public.organization_crm_documents d where d.organization_id = v_org_id limit 40;

  select jsonb_build_object(
    'customer_growth', (select count(*) from public.organization_crm_customers where organization_id = v_org_id and created_at >= now() - interval '30 days'),
    'lead_conversion_rate', case
      when (select count(*) from public.organization_crm_leads where organization_id = v_org_id) = 0 then 0
      else round(
        100.0 * (select count(*) from public.organization_crm_leads where organization_id = v_org_id and status = 'won')::numeric
        / greatest((select count(*) from public.organization_crm_leads where organization_id = v_org_id), 1)::numeric, 1
      )
    end,
    'relationship_activity_30d', (select count(*) from public.organization_crm_timeline_events where organization_id = v_org_id and occurred_at >= now() - interval '30 days'),
    'by_department', coalesce((
      select jsonb_agg(jsonb_build_object('department', d.name, 'customers', cnt))
      from (
        select assigned_department_id, count(*) cnt
        from public.organization_crm_customers where organization_id = v_org_id
        group by assigned_department_id
      ) x
      left join public.organization_departments d on d.id = x.assigned_department_id
    ), '[]'::jsonb),
    'by_domain', coalesce((
      select jsonb_agg(jsonb_build_object('domain', od.domain, 'customers', count(*)))
      from public.organization_crm_domain_assignments da
      join public.organization_domains od on od.id = da.domain_id
      where da.organization_id = v_org_id
      group by od.domain
    ), '[]'::jsonb)
  ) into v_reports;

  select jsonb_build_object(
    'follow_up_required', coalesce((
      select jsonb_agg(jsonb_build_object('name', coalesce(company_name, contact_name), 'follow_up_date', follow_up_date))
      from public.organization_crm_leads
      where organization_id = v_org_id and follow_up_date <= current_date + interval '7 days' and status not in ('won', 'lost')
      limit 10
    ), '[]'::jsonb),
    'at_risk', coalesce((
      select jsonb_agg(jsonb_build_object('name', coalesce(company_name, name), 'status', status))
      from public.organization_crm_customers
      where organization_id = v_org_id and status in ('requires_attention', 'inactive')
      limit 10
    ), '[]'::jsonb),
    'inactive_relationships', (
      select count(*) from public.organization_crm_customers c
      where c.organization_id = v_org_id
        and not exists (
          select 1 from public.organization_crm_timeline_events e
          where e.customer_id = c.id and e.occurred_at >= now() - interval '90 days'
        )
    )
  ) into v_insights;

  select coalesce(jsonb_agg(jsonb_build_object(
    'action', a.action, 'summary', a.summary, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit
  from public.organization_crm_audit_logs a where a.organization_id = v_org_id limit 20;

  return jsonb_build_object(
    'found', true,
    'principle', 'Organizations serve customers. Aipify helps organize, understand, and serve them better.',
    'overview', v_overview,
    'customers', v_customers,
    'contacts', v_contacts,
    'organizations', v_organizations,
    'leads', v_leads,
    'timeline', v_timeline,
    'communications', v_communications,
    'documents', v_documents,
    'reports', v_reports,
    'companion_insights', v_insights,
    'audit_recent', v_audit,
    'customer_types', jsonb_build_array(
      'individual', 'business', 'enterprise', 'partner', 'supplier', 'vendor', 'contractor', 'custom'
    ),
    'customer_statuses', jsonb_build_array(
      'active', 'prospect', 'requires_attention', 'restricted', 'inactive'
    ),
    'sections', jsonb_build_array(
      'overview', 'customers', 'contacts', 'organizations', 'leads', 'relationships',
      'communication', 'documents', 'reports'
    ),
    'routes', jsonb_build_object(
      'customers', '/app/customers',
      'leads', '/app/leads',
      'employees', '/app/employees',
      'tasks', '/app/tasks',
      'calendar', '/app/calendar',
      'documents', '/app/documents',
      'communications', '/app/communications'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Lead Management Center
-- ---------------------------------------------------------------------------
create or replace function public.get_lead_management_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_leads jsonb;
  v_pipeline jsonb;
begin
  perform public._irp_require_permission('customers.view');
  v_org_id := public._crm517_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._crm517_ensure_settings(v_org_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'lead_number', l.lead_number, 'company_name', l.company_name,
    'contact_name', l.contact_name, 'email', l.email, 'phone', l.phone,
    'lead_source', l.lead_source, 'status', l.status,
    'expected_value', l.expected_value, 'currency', l.currency,
    'follow_up_date', l.follow_up_date, 'notes', l.notes,
    'converted_customer_id', l.converted_customer_id, 'created_at', l.created_at
  ) order by l.updated_at desc), '[]'::jsonb)
  into v_leads
  from public.organization_crm_leads l where l.organization_id = v_org_id limit 100;

  select jsonb_build_object(
    'new', (select count(*) from public.organization_crm_leads where organization_id = v_org_id and status = 'new'),
    'contacted', (select count(*) from public.organization_crm_leads where organization_id = v_org_id and status = 'contacted'),
    'qualified', (select count(*) from public.organization_crm_leads where organization_id = v_org_id and status = 'qualified'),
    'proposal_sent', (select count(*) from public.organization_crm_leads where organization_id = v_org_id and status = 'proposal_sent'),
    'negotiation', (select count(*) from public.organization_crm_leads where organization_id = v_org_id and status = 'negotiation'),
    'won', (select count(*) from public.organization_crm_leads where organization_id = v_org_id and status = 'won'),
    'lost', (select count(*) from public.organization_crm_leads where organization_id = v_org_id and status = 'lost')
  ) into v_pipeline;

  return jsonb_build_object(
    'found', true,
    'principle', 'Leads become relationships. Relationships create growth.',
    'leads', v_leads,
    'pipeline', v_pipeline,
    'lead_statuses', jsonb_build_array(
      'new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'won', 'lost'
    ),
    'routes', jsonb_build_object('customers', '/app/customers', 'leads', '/app/leads')
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Actions & search
-- ---------------------------------------------------------------------------
create or replace function public.perform_customer_relationship_action(
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
  if v_org_id is null then return jsonb_build_object('ok', false, 'error', 'organization_not_found'); end if;

  if p_action_type in (
    'create_customer', 'update_customer', 'create_contact', 'create_lead', 'update_lead',
    'convert_lead', 'assign_owner', 'add_note', 'add_communication', 'add_document', 'create_follow_up_task'
  ) then
    perform public._irp_require_permission('customers.manage');
  else
    perform public._irp_require_permission('customers.view');
  end if;

  if p_action_type = 'create_customer' then
    insert into public.organization_crm_customers (
      organization_id, customer_number, customer_type, name, company_name,
      email, phone, address, country, language, website, status,
      assigned_employee_profile_id, assigned_department_id, tags
    ) values (
      v_org_id,
      coalesce(p_payload->>'customer_number', public._crm517_next_customer_number(v_org_id)),
      coalesce(p_payload->>'customer_type', 'business'),
      coalesce(p_payload->>'name', 'New customer'),
      p_payload->>'company_name',
      p_payload->>'email', p_payload->>'phone', p_payload->>'address',
      p_payload->>'country', coalesce(p_payload->>'language', 'en'), p_payload->>'website',
      coalesce(p_payload->>'status', 'prospect'),
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
      phone = coalesce(p_payload->>'phone', phone),
      status = coalesce(p_payload->>'status', status),
      customer_type = coalesce(p_payload->>'customer_type', customer_type),
      assigned_employee_profile_id = coalesce(nullif(p_payload->>'assigned_employee_profile_id', '')::uuid, assigned_employee_profile_id),
      assigned_department_id = coalesce(nullif(p_payload->>'assigned_department_id', '')::uuid, assigned_department_id),
      updated_at = now()
    where id = v_customer_id and organization_id = v_org_id;

    perform public._crm517_add_timeline(v_org_id, v_customer_id, 'relationship', 'Customer updated', 'Profile updated');
    perform public._crm517_log(v_org_id, 'customer_updated', 'Customer updated', v_customer_id, null, p_payload);
    return jsonb_build_object('ok', true, 'customer_id', v_customer_id);

  elsif p_action_type = 'create_contact' then
    v_customer_id := (p_payload->>'customer_id')::uuid;
    insert into public.organization_crm_contacts (
      organization_id, customer_id, contact_role, full_name, email, phone, title, is_primary
    ) values (
      v_org_id, v_customer_id,
      coalesce(p_payload->>'contact_role', 'general'),
      coalesce(p_payload->>'full_name', 'Contact'),
      p_payload->>'email', p_payload->>'phone', p_payload->>'title',
      coalesce((p_payload->>'is_primary')::boolean, false)
    ) returning id into v_contact_id;

    perform public._crm517_add_timeline(v_org_id, v_customer_id, 'relationship', 'Contact added', coalesce(p_payload->>'full_name', 'Contact'));
    perform public._crm517_log(v_org_id, 'contact_added', 'Contact added', v_customer_id, null, p_payload);
    return jsonb_build_object('ok', true, 'contact_id', v_contact_id);

  elsif p_action_type = 'create_lead' then
    insert into public.organization_crm_leads (
      organization_id, lead_number, company_name, contact_name, email, phone,
      lead_source, status, expected_value, follow_up_date, notes,
      assigned_employee_profile_id
    ) values (
      v_org_id,
      coalesce(p_payload->>'lead_number', public._crm517_next_lead_number(v_org_id)),
      coalesce(p_payload->>'company_name', 'New lead'),
      p_payload->>'contact_name', p_payload->>'email', p_payload->>'phone',
      coalesce(p_payload->>'lead_source', 'direct'),
      coalesce(p_payload->>'status', 'new'),
      nullif(p_payload->>'expected_value', '')::numeric,
      nullif(p_payload->>'follow_up_date', '')::date,
      coalesce(p_payload->>'notes', ''),
      nullif(p_payload->>'assigned_employee_profile_id', '')::uuid
    ) returning id into v_lead_id;

    perform public._crm517_log(v_org_id, 'lead_created', 'Lead created', null, v_lead_id, p_payload);
    return jsonb_build_object('ok', true, 'lead_id', v_lead_id);

  elsif p_action_type = 'update_lead' then
    v_lead_id := (p_payload->>'lead_id')::uuid;
    v_new_status := p_payload->>'status';
    update public.organization_crm_leads set
      status = coalesce(v_new_status, status),
      follow_up_date = coalesce(nullif(p_payload->>'follow_up_date', '')::date, follow_up_date),
      notes = coalesce(p_payload->>'notes', notes),
      expected_value = coalesce(nullif(p_payload->>'expected_value', '')::numeric, expected_value),
      updated_at = now()
    where id = v_lead_id and organization_id = v_org_id;

    if v_new_status = 'won' then
      perform public._crm517_log(v_org_id, 'lead_won', 'Lead won', null, v_lead_id, p_payload);
    elsif v_new_status = 'lost' then
      perform public._crm517_log(v_org_id, 'lead_lost', 'Lead lost', null, v_lead_id, p_payload);
    else
      perform public._crm517_log(v_org_id, 'lead_updated', 'Lead updated', null, v_lead_id, p_payload);
    end if;
    return jsonb_build_object('ok', true, 'lead_id', v_lead_id);

  elsif p_action_type = 'convert_lead' then
    v_lead_id := (p_payload->>'lead_id')::uuid;
    insert into public.organization_crm_customers (
      organization_id, customer_number, customer_type, name, company_name,
      email, phone, status, assigned_employee_profile_id
    )
    select
      v_org_id, public._crm517_next_customer_number(v_org_id), 'business',
      coalesce(l.contact_name, l.company_name), l.company_name,
      l.email, l.phone, 'active', l.assigned_employee_profile_id
    from public.organization_crm_leads l
    where l.id = v_lead_id and l.organization_id = v_org_id
    returning id into v_customer_id;

    update public.organization_crm_leads set
      status = 'won', converted_customer_id = v_customer_id, updated_at = now()
    where id = v_lead_id;

    perform public._crm517_add_timeline(v_org_id, v_customer_id, 'lead', 'Lead converted', 'Lead won and converted to customer');
    perform public._crm517_log(v_org_id, 'lead_won', 'Lead converted to customer', v_customer_id, v_lead_id, p_payload);
    return jsonb_build_object('ok', true, 'customer_id', v_customer_id, 'lead_id', v_lead_id);

  elsif p_action_type = 'assign_owner' then
    v_customer_id := (p_payload->>'customer_id')::uuid;
    update public.organization_crm_customers set
      owner_user_id = nullif(p_payload->>'owner_user_id', '')::uuid,
      assigned_employee_profile_id = nullif(p_payload->>'assigned_employee_profile_id', '')::uuid,
      assigned_department_id = nullif(p_payload->>'assigned_department_id', '')::uuid,
      updated_at = now()
    where id = v_customer_id and organization_id = v_org_id;

    insert into public.organization_crm_ownership (
      organization_id, customer_id, ownership_type, owner_user_id,
      employee_profile_id, department_id, ownership_label, is_primary
    ) values (
      v_org_id, v_customer_id,
      coalesce(p_payload->>'ownership_type', 'employee'),
      nullif(p_payload->>'owner_user_id', '')::uuid,
      nullif(p_payload->>'assigned_employee_profile_id', '')::uuid,
      nullif(p_payload->>'assigned_department_id', '')::uuid,
      coalesce(p_payload->>'ownership_label', ''),
      true
    ) on conflict do nothing;

    perform public._crm517_log(v_org_id, 'customer_assigned', 'Customer ownership assigned', v_customer_id, null, p_payload);
    return jsonb_build_object('ok', true, 'customer_id', v_customer_id);

  elsif p_action_type = 'add_note' then
    v_customer_id := (p_payload->>'customer_id')::uuid;
    perform public._crm517_add_timeline(
      v_org_id, v_customer_id, 'note',
      coalesce(p_payload->>'title', 'Note'),
      coalesce(p_payload->>'summary', '')
    );
    insert into public.organization_crm_communications (
      organization_id, customer_id, channel, subject, summary
    ) values (
      v_org_id, v_customer_id, 'note',
      coalesce(p_payload->>'title', 'Note'),
      coalesce(p_payload->>'summary', '')
    );
    perform public._crm517_log(v_org_id, 'relationship_updated', 'Note added', v_customer_id, null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'add_communication' then
    v_customer_id := (p_payload->>'customer_id')::uuid;
    insert into public.organization_crm_communications (
      organization_id, customer_id, channel, subject, summary, occurred_at
    ) values (
      v_org_id, v_customer_id,
      coalesce(p_payload->>'channel', 'note'),
      coalesce(p_payload->>'subject', 'Communication'),
      coalesce(p_payload->>'summary', ''),
      coalesce((p_payload->>'occurred_at')::timestamptz, now())
    );
    perform public._crm517_add_timeline(
      v_org_id, v_customer_id,
      coalesce(p_payload->>'channel', 'note'),
      coalesce(p_payload->>'subject', 'Communication'),
      coalesce(p_payload->>'summary', '')
    );
    perform public._crm517_log(v_org_id, 'relationship_updated', 'Communication recorded', v_customer_id, null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'add_document' then
    v_customer_id := (p_payload->>'customer_id')::uuid;
    insert into public.organization_crm_documents (
      organization_id, customer_id, document_type, title, file_ref
    ) values (
      v_org_id, v_customer_id,
      coalesce(p_payload->>'document_type', 'file'),
      coalesce(p_payload->>'title', 'Document'),
      p_payload->>'file_ref'
    ) returning id into v_doc_id;

    perform public._crm517_add_timeline(v_org_id, v_customer_id, 'document', coalesce(p_payload->>'title', 'Document'), 'Document added');
    perform public._crm517_log(v_org_id, 'document_added', 'Document added', v_customer_id, null, p_payload);
    return jsonb_build_object('ok', true, 'document_id', v_doc_id);

  elsif p_action_type = 'create_follow_up_task' then
    v_customer_id := (p_payload->>'customer_id')::uuid;
    insert into public.organization_crm_customer_tasks (
      organization_id, customer_id, task_type, title, due_date, assigned_employee_profile_id
    ) values (
      v_org_id, v_customer_id, 'follow_up',
      coalesce(p_payload->>'title', 'Follow up with customer'),
      coalesce(nullif(p_payload->>'due_date', '')::date, current_date + 3),
      nullif(p_payload->>'assigned_employee_profile_id', '')::uuid
    ) returning id into v_task_id;

    perform public._crm517_add_timeline(v_org_id, v_customer_id, 'task', coalesce(p_payload->>'title', 'Follow-up task'), 'Follow-up task created');
    perform public._crm517_log(v_org_id, 'relationship_updated', 'Follow-up task created', v_customer_id, null, p_payload);
    return jsonb_build_object('ok', true, 'task_id', v_task_id);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

create or replace function public.search_customer_relationship_records(p_query text default '')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_q text := trim(coalesce(p_query, ''));
  v_customers jsonb;
  v_contacts jsonb;
  v_leads jsonb;
begin
  perform public._irp_require_permission('customers.view');
  v_org_id := public._crm517_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  if v_q = '' then return jsonb_build_object('found', true, 'customers', '[]'::jsonb, 'contacts', '[]'::jsonb, 'leads', '[]'::jsonb); end if;

  select coalesce(jsonb_agg(public._crm517_customer_json(c)), '[]'::jsonb)
  into v_customers
  from public.organization_crm_customers c
  where c.organization_id = v_org_id
    and (
      c.name ilike '%' || v_q || '%'
      or coalesce(c.company_name, '') ilike '%' || v_q || '%'
      or coalesce(c.email, '') ilike '%' || v_q || '%'
      or coalesce(c.customer_number, '') ilike '%' || v_q || '%'
    )
  limit 25;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', ct.id, 'full_name', ct.full_name, 'email', ct.email,
    'customer_name', (select coalesce(company_name, name) from public.organization_crm_customers where id = ct.customer_id)
  )), '[]'::jsonb)
  into v_contacts
  from public.organization_crm_contacts ct
  where ct.organization_id = v_org_id
    and (ct.full_name ilike '%' || v_q || '%' or coalesce(ct.email, '') ilike '%' || v_q || '%')
  limit 25;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'company_name', l.company_name, 'contact_name', l.contact_name, 'status', l.status
  )), '[]'::jsonb)
  into v_leads
  from public.organization_crm_leads l
  where l.organization_id = v_org_id
    and (
      l.company_name ilike '%' || v_q || '%'
      or coalesce(l.contact_name, '') ilike '%' || v_q || '%'
      or coalesce(l.email, '') ilike '%' || v_q || '%'
    )
  limit 25;

  return jsonb_build_object('found', true, 'query', v_q, 'customers', v_customers, 'contacts', v_contacts, 'leads', v_leads);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_customer_relationship_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
begin
  perform public._irp_require_permission('customers.view');
  v_org_id := public._crm517_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion helps maintain customer relationships — never replaces human accountability.',
    'active_customers', (select count(*) from public.organization_crm_customers where organization_id = v_org_id and status = 'active'),
    'requires_attention', (select count(*) from public.organization_crm_customers where organization_id = v_org_id and status = 'requires_attention'),
    'open_leads', (select count(*) from public.organization_crm_leads where organization_id = v_org_id and status not in ('won', 'lost')),
    'follow_ups_due', (
      select count(*) from public.organization_crm_leads
      where organization_id = v_org_id and follow_up_date <= current_date and status not in ('won', 'lost')
    ),
    'companion_prompts', jsonb_build_array(
      'Show all information about a customer.',
      'Who owns this customer?',
      'What happened last month?',
      'Create follow-up task.',
      'Show open opportunities.',
      'Show customers requiring follow-up.',
      'Show customers at risk.'
    ),
    'customers_route', '/app/customers',
    'leads_route', '/app/leads'
  );
end; $$;

create or replace function public.get_my_customer_relationship_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_profile_id uuid;
begin
  perform public._irp_require_permission('customers.view');
  v_org_id := public._crm517_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);
  select p.id into v_profile_id
  from public.organization_employee_profiles p
  join public.organization_users ou on ou.id = p.organization_user_id
  where p.organization_id = v_org_id and ou.user_id = v_user_id limit 1;

  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('customers.manage', v_org_id),
    'my_customers', (
      select count(*) from public.organization_crm_customers
      where organization_id = v_org_id and assigned_employee_profile_id = v_profile_id
    ),
    'my_leads', (
      select count(*) from public.organization_crm_leads
      where organization_id = v_org_id and assigned_employee_profile_id = v_profile_id and status not in ('won', 'lost')
    ),
    'follow_ups_due', (
      select count(*) from public.organization_crm_leads
      where organization_id = v_org_id and assigned_employee_profile_id = v_profile_id
        and follow_up_date <= current_date and status not in ('won', 'lost')
    ),
    'routes', jsonb_build_object('customers', '/app/customers', 'leads', '/app/leads')
  );
exception when others then
  return jsonb_build_object('found', true, 'can_manage', false, 'routes', jsonb_build_object('customers', '/app/customers'));
end; $$;

-- Module registry & permissions
do $$ begin
  perform public._mre501_seed_module(
    'customers', 'Customers', 'customers', 'operations',
    'Customer, contact, and relationship management for the organization.',
    'starter', null, 'operations', '/app/customers', 'licensed', 5
  );
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('customers', 'customers.view', 'view', 'Customers — view profiles, contacts, and relationships'),
    ('customers', 'customers.manage', 'manage', 'Customers — create, update, assign, and manage leads')
  on conflict (permission_key) do nothing;
exception when others then
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('customers', 'customers.view', 'view', 'Customers — view profiles, contacts, and relationships'),
    ('customers', 'customers.manage', 'manage', 'Customers — create, update, assign, and manage leads')
  on conflict (permission_key) do nothing;
end $$;

grant execute on function public.get_customer_relationship_center(text) to authenticated;
grant execute on function public.get_lead_management_center() to authenticated;
grant execute on function public.perform_customer_relationship_action(text, jsonb) to authenticated;
grant execute on function public.search_customer_relationship_records(text) to authenticated;
grant execute on function public.get_companion_customer_relationship_context() to authenticated;
grant execute on function public.get_my_customer_relationship_summary() to authenticated;
