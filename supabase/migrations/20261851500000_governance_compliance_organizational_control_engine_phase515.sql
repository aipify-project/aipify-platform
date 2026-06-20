-- Phase 515 — Governance, Compliance & Organizational Control Engine
-- Operations create activity. Governance creates trust.
-- Integrates: Organization (511), Analytics (514), Tasks, Permissions, Business Packs, Domains

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_governance_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  require_policy_acknowledgement boolean not null default true,
  access_review_cadence_days integer not null default 90,
  companion_respects_controls boolean not null default true,
  domain_governance_enabled boolean not null default true,
  business_pack_governance_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_governance_settings enable row level security;
revoke all on public.organization_governance_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Policies, versions, acknowledgements
-- ---------------------------------------------------------------------------
create table if not exists public.organization_governance_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  policy_number text not null,
  title text not null,
  description text not null default '',
  category text not null default 'operational' check (
    category in (
      'internal', 'security', 'hr', 'operational', 'financial', 'department', 'custom'
    )
  ),
  owner_user_id uuid references public.users (id) on delete set null,
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  effective_date date,
  review_date date,
  status text not null default 'draft' check (
    status in ('draft', 'review_required', 'active', 'expiring', 'retired')
  ),
  requires_acknowledgement boolean not null default false,
  attachments jsonb not null default '[]'::jsonb,
  version_number integer not null default 1,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, policy_number)
);

create index if not exists organization_governance_policies_org_status_idx
  on public.organization_governance_policies (organization_id, status, category);

alter table public.organization_governance_policies enable row level security;
revoke all on public.organization_governance_policies from authenticated, anon;

create table if not exists public.organization_governance_policy_versions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  policy_id uuid not null references public.organization_governance_policies (id) on delete cascade,
  version_number integer not null,
  title text not null,
  description text not null default '',
  changed_by uuid references public.users (id) on delete set null,
  change_summary text not null default '',
  created_at timestamptz not null default now(),
  unique (policy_id, version_number)
);

alter table public.organization_governance_policy_versions enable row level security;
revoke all on public.organization_governance_policy_versions from authenticated, anon;

create table if not exists public.organization_governance_policy_acknowledgements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  policy_id uuid not null references public.organization_governance_policies (id) on delete cascade,
  employee_profile_id uuid references public.organization_employee_profiles (id) on delete set null,
  user_id uuid references public.users (id) on delete set null,
  response text not null check (response in ('accepted', 'declined', 'clarification_requested')),
  notes text not null default '',
  acknowledged_at timestamptz not null default now(),
  unique (organization_id, policy_id, user_id)
);

alter table public.organization_governance_policy_acknowledgements enable row level security;
revoke all on public.organization_governance_policy_acknowledgements from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Access reviews
-- ---------------------------------------------------------------------------
create table if not exists public.organization_governance_access_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  review_key text not null,
  title text not null,
  status text not null default 'scheduled' check (
    status in ('scheduled', 'in_progress', 'completed', 'overdue', 'cancelled')
  ),
  department_id uuid references public.organization_departments (id) on delete set null,
  due_date date,
  reviewer_user_id uuid references public.users (id) on delete set null,
  summary text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, review_key)
);

alter table public.organization_governance_access_reviews enable row level security;
revoke all on public.organization_governance_access_reviews from authenticated, anon;

create table if not exists public.organization_governance_access_review_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  review_id uuid not null references public.organization_governance_access_reviews (id) on delete cascade,
  employee_profile_id uuid references public.organization_employee_profiles (id) on delete set null,
  access_type text not null check (
    access_type in ('role', 'permission', 'domain', 'business_pack', 'department')
  ),
  access_label text not null,
  access_ref_id uuid,
  decision text check (decision in ('retain', 'revoke', 'modify', 'pending')),
  notes text not null default '',
  created_at timestamptz not null default now()
);

alter table public.organization_governance_access_review_items enable row level security;
revoke all on public.organization_governance_access_review_items from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Compliance, risks, controls, approvals, audit
-- ---------------------------------------------------------------------------
create table if not exists public.organization_governance_compliance_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  compliance_type text not null check (
    compliance_type in (
      'policy', 'training', 'document', 'access', 'approval', 'audit_readiness'
    )
  ),
  status text not null default 'compliant' check (
    status in ('compliant', 'requires_attention', 'high_risk', 'critical_risk')
  ),
  title text not null,
  summary text not null default '',
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  due_date date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organization_governance_compliance_records enable row level security;
revoke all on public.organization_governance_compliance_records from authenticated, anon;

create table if not exists public.organization_governance_risks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  risk_number text not null,
  category text not null check (
    category in ('operational', 'security', 'compliance', 'process', 'resource', 'financial')
  ),
  title text not null,
  description text not null default '',
  impact text not null default 'medium' check (impact in ('low', 'medium', 'high', 'critical')),
  likelihood text not null default 'medium' check (likelihood in ('low', 'medium', 'high', 'critical')),
  owner_user_id uuid references public.users (id) on delete set null,
  mitigation_plan text not null default '',
  status text not null default 'open' check (
    status in ('open', 'mitigating', 'monitoring', 'closed', 'accepted')
  ),
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, risk_number)
);

alter table public.organization_governance_risks enable row level security;
revoke all on public.organization_governance_risks from authenticated, anon;

create table if not exists public.organization_governance_controls (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  control_key text not null,
  title text not null,
  description text not null default '',
  control_type text not null default 'approval_required' check (
    control_type in ('approval_required', 'blocked', 'audit_only', 'notification')
  ),
  trigger_action text not null,
  is_active boolean not null default true,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, control_key)
);

alter table public.organization_governance_controls enable row level security;
revoke all on public.organization_governance_controls from authenticated, anon;

create table if not exists public.organization_governance_approval_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  request_type text not null check (
    request_type in (
      'access_request', 'permission_escalation', 'business_pack_change', 'policy_change',
      'financial_approval', 'domain_change', 'workflow_action', 'asset_action', 'manager_change'
    )
  ),
  title text not null,
  summary text not null default '',
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'cancelled', 'escalated')
  ),
  requested_by uuid references public.users (id) on delete set null,
  decided_by uuid references public.users (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  department_id uuid references public.organization_departments (id) on delete set null,
  companion_suggested boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organization_governance_approval_requests enable row level security;
revoke all on public.organization_governance_approval_requests from authenticated, anon;

create table if not exists public.organization_governance_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  event_category text not null default 'governance' check (
    event_category in (
      'employee', 'permission', 'task', 'workflow', 'document', 'business_pack',
      'domain', 'companion', 'approval', 'policy', 'control', 'risk', 'compliance'
    )
  ),
  summary text not null,
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  entity_type text,
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_governance_audit_logs_org_idx
  on public.organization_governance_audit_logs (organization_id, created_at desc);

create index if not exists organization_governance_audit_logs_search_idx
  on public.organization_governance_audit_logs (organization_id, event_category, event_type);

alter table public.organization_governance_audit_logs enable row level security;
revoke all on public.organization_governance_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._ogv515_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._ogv515_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_category text default 'governance', p_entity_type text default null,
  p_entity_id uuid default null, p_payload jsonb default '{}'::jsonb,
  p_department_id uuid default null, p_domain_id uuid default null, p_pack_key text default null
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_governance_audit_logs (
    organization_id, actor_user_id, event_type, event_category, summary,
    department_id, domain_id, business_pack_key, entity_type, entity_id, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'governance'), p_summary,
    p_department_id, p_domain_id, p_pack_key, p_entity_type, p_entity_id,
    coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._ogv515_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_governance_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._ogv515_next_policy_number(p_org_id uuid)
returns text language plpgsql security definer set search_path = public as $$
declare v_seq int;
begin
  select count(*) + 1 into v_seq from public.organization_governance_policies where organization_id = p_org_id;
  return 'POL-' || lpad(v_seq::text, 5, '0');
end; $$;

create or replace function public._ogv515_next_risk_number(p_org_id uuid)
returns text language plpgsql security definer set search_path = public as $$
declare v_seq int;
begin
  select count(*) + 1 into v_seq from public.organization_governance_risks where organization_id = p_org_id;
  return 'RSK-' || lpad(v_seq::text, 5, '0');
end; $$;

create or replace function public._ogv515_health_score(p_org_id uuid)
returns int language plpgsql stable security definer set search_path = public as $$
declare
  v_score numeric := 100;
  v_open_risks int;
  v_critical int;
  v_pending_ack int;
begin
  select count(*) filter (where status in ('open', 'mitigating')),
         count(*) filter (where status = 'open' and impact in ('high', 'critical'))
  into v_open_risks, v_critical
  from public.organization_governance_risks where organization_id = p_org_id;

  select count(*) into v_pending_ack
  from public.organization_governance_policies p
  where p.organization_id = p_org_id and p.status = 'active' and p.requires_acknowledgement
    and not exists (
      select 1 from public.organization_governance_policy_acknowledgements a
      where a.policy_id = p.id and a.response = 'accepted'
    );

  v_score := v_score - least(30, v_open_risks * 3) - least(25, v_critical * 8) - least(20, v_pending_ack * 2);
  return greatest(0, least(100, round(v_score)));
exception when others then
  return 80;
end; $$;

create or replace function public._ogv515_seed_controls(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_governance_controls (organization_id, control_key, title, description, trigger_action)
  values
    (p_org_id, 'finance_access', 'Require approval before granting Finance access', 'Governance control for financial permissions.', 'grant_finance_access'),
    (p_org_id, 'delete_assets', 'Require approval before deleting assets', 'Protect organizational assets from unapproved deletion.', 'delete_asset'),
    (p_org_id, 'install_business_pack', 'Require approval before installing Business Packs', 'Pack installation requires governance approval.', 'install_business_pack'),
    (p_org_id, 'change_manager', 'Require approval before changing managers', 'Manager changes require human oversight.', 'change_department_manager')
  on conflict (organization_id, control_key) do nothing;
end; $$;

create or replace function public._ogv515_policy_json(p_row public.organization_governance_policies)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_row.id, 'policy_number', p_row.policy_number, 'title', p_row.title,
    'description', p_row.description, 'category', p_row.category, 'status', p_row.status,
    'owner_user_id', p_row.owner_user_id, 'department_id', p_row.department_id,
    'domain_id', p_row.domain_id, 'business_pack_key', p_row.business_pack_key,
    'effective_date', p_row.effective_date, 'review_date', p_row.review_date,
    'requires_acknowledgement', p_row.requires_acknowledgement,
    'version_number', p_row.version_number, 'created_at', p_row.created_at
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Governance Management Center
-- ---------------------------------------------------------------------------
create or replace function public.get_governance_management_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_scope jsonb;
  v_overview jsonb;
  v_policies jsonb;
  v_approvals jsonb;
  v_access_reviews jsonb;
  v_compliance jsonb;
  v_risks jsonb;
  v_controls jsonb;
  v_audit jsonb;
  v_reports jsonb;
begin
  if not public.has_organization_permission('governance.view')
     and not public.has_organization_permission('governance.manage') then
    raise exception 'Permission denied: governance.view';
  end if;
  v_org_id := public._ogv515_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  begin v_user_id := public._mta_app_user_id(); exception when others then
    v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);
  end;

  begin
    v_scope := public._rae514_actor_scope(v_org_id);
  exception when others then
    v_scope := jsonb_build_object('scope', 'organization');
  end;

  select jsonb_build_object(
    'governance_health', public._ogv515_health_score(v_org_id),
    'open_risks', (select count(*) from public.organization_governance_risks where organization_id = v_org_id and status in ('open', 'mitigating')),
    'pending_approvals', (select count(*) from public.organization_governance_approval_requests where organization_id = v_org_id and status = 'pending'),
    'pending_access_reviews', (select count(*) from public.organization_governance_access_reviews where organization_id = v_org_id and status in ('scheduled', 'in_progress', 'overdue')),
    'active_policies', (select count(*) from public.organization_governance_policies where organization_id = v_org_id and status = 'active'),
    'expiring_policies', (select count(*) from public.organization_governance_policies where organization_id = v_org_id and status = 'expiring'),
    'pending_acknowledgements', (
      select count(*) from public.organization_governance_policies p
      where p.organization_id = v_org_id and p.status = 'active' and p.requires_acknowledgement
        and not exists (
          select 1 from public.organization_governance_policy_acknowledgements a
          where a.policy_id = p.id and a.user_id = v_user_id and a.response = 'accepted'
        )
    ),
    'compliance_attention', (select count(*) from public.organization_governance_compliance_records where organization_id = v_org_id and status in ('requires_attention', 'high_risk', 'critical_risk')),
    'control_violations_30d', (
      select count(*) from public.organization_governance_audit_logs
      where organization_id = v_org_id and event_type = 'control_violation' and created_at >= now() - interval '30 days'
    )
  ) into v_overview;

  select coalesce(jsonb_agg(public._ogv515_policy_json(p) order by p.updated_at desc), '[]'::jsonb)
  into v_policies
  from (
    select * from public.organization_governance_policies
    where organization_id = v_org_id and status <> 'retired'
    order by updated_at desc limit 50
  ) p;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'request_type', r.request_type, 'title', r.title, 'summary', r.summary,
    'status', r.status, 'companion_suggested', r.companion_suggested, 'created_at', r.created_at
  ) order by r.created_at desc), '[]'::jsonb)
  into v_approvals
  from public.organization_governance_approval_requests r
  where r.organization_id = v_org_id and r.status = 'pending'
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'review_key', r.review_key, 'title', r.title, 'status', r.status,
    'due_date', r.due_date,
    'item_count', (select count(*) from public.organization_governance_access_review_items i where i.review_id = r.id)
  ) order by r.due_date nulls last), '[]'::jsonb)
  into v_access_reviews
  from public.organization_governance_access_reviews r
  where r.organization_id = v_org_id and r.status <> 'cancelled'
  limit 30;

  select jsonb_build_object(
    'compliant', (select count(*) from public.organization_governance_compliance_records where organization_id = v_org_id and status = 'compliant'),
    'requires_attention', (select count(*) from public.organization_governance_compliance_records where organization_id = v_org_id and status = 'requires_attention'),
    'high_risk', (select count(*) from public.organization_governance_compliance_records where organization_id = v_org_id and status = 'high_risk'),
    'critical_risk', (select count(*) from public.organization_governance_compliance_records where organization_id = v_org_id and status = 'critical_risk'),
    'records', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'compliance_type', c.compliance_type, 'status', c.status,
        'title', c.title, 'summary', c.summary, 'due_date', c.due_date
      ) order by c.updated_at desc)
      from (select * from public.organization_governance_compliance_records where organization_id = v_org_id order by updated_at desc limit 20) c
    ), '[]'::jsonb)
  ) into v_compliance;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'risk_number', r.risk_number, 'category', r.category, 'title', r.title,
    'impact', r.impact, 'likelihood', r.likelihood, 'status', r.status, 'mitigation_plan', r.mitigation_plan
  ) order by case r.impact when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end), '[]'::jsonb)
  into v_risks
  from public.organization_governance_risks r
  where r.organization_id = v_org_id and r.status <> 'closed'
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'control_key', c.control_key, 'title', c.title, 'control_type', c.control_type,
    'trigger_action', c.trigger_action, 'is_active', c.is_active
  ) order by c.title), '[]'::jsonb)
  into v_controls
  from public.organization_governance_controls c
  where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'event_type', a.event_type, 'event_category', a.event_category,
    'summary', a.summary, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit
  from (select * from public.organization_governance_audit_logs where organization_id = v_org_id order by created_at desc limit 25) a;

  select jsonb_build_object(
    'policy_compliance', (select count(*) from public.organization_governance_policies where organization_id = v_org_id and status = 'active'),
    'access_reviews_open', (select count(*) from public.organization_governance_access_reviews where organization_id = v_org_id and status in ('scheduled', 'in_progress', 'overdue')),
    'audit_events_30d', (select count(*) from public.organization_governance_audit_logs where organization_id = v_org_id and created_at >= now() - interval '30 days'),
    'approval_stats', jsonb_build_object(
      'pending', (select count(*) from public.organization_governance_approval_requests where organization_id = v_org_id and status = 'pending'),
      'approved_30d', (select count(*) from public.organization_governance_approval_requests where organization_id = v_org_id and status = 'approved' and updated_at >= now() - interval '30 days')
    ),
    'control_violations', (select count(*) from public.organization_governance_audit_logs where organization_id = v_org_id and event_type = 'control_violation')
  ) into v_reports;

  return jsonb_build_object(
    'found', true,
    'principle', 'Aipify helps organizations operate efficiently. Governance ensures they operate responsibly.',
    'companion_note', 'Companion may recommend actions. Companion may not bypass governance.',
    'structure', 'PLATFORM → APP → GOVERNANCE ENGINE → DEPARTMENTS → EMPLOYEES',
    'visibility', v_scope,
    'overview', v_overview,
    'policies', v_policies,
    'approvals', v_approvals,
    'access_reviews', v_access_reviews,
    'compliance', v_compliance,
    'risks', v_risks,
    'controls', v_controls,
    'audit_recent', v_audit,
    'reports', v_reports,
    'routes', jsonb_build_object(
      'policies', '/app/governance/policies',
      'access_reviews', '/app/governance/access-reviews',
      'compliance', '/app/governance/compliance',
      'risk', '/app/governance/risk',
      'audit', '/app/governance/audit',
      'controls', '/app/governance/controls',
      'approval_center', '/app/governance/approval-center',
      'permissions', '/app/governance/permissions-access',
      'trust', '/app/governance/trust-transparency',
      'tacc', '/app/governance/trust'
    ),
    'sections', jsonb_build_array(
      'overview', 'policies', 'approvals', 'access_reviews', 'compliance',
      'audit', 'risk', 'controls', 'reports'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_governance_management_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_policy_id uuid;
  v_risk_id uuid;
  v_review_id uuid;
  v_approval_id uuid;
  v_control_id uuid;
  v_row public.organization_governance_policies;
begin
  perform public._irp_require_permission('governance.manage');
  v_org_id := public._ogv515_org();
  if v_org_id is null then return jsonb_build_object('ok', false, 'error', 'organization_not_found'); end if;

  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);

  if p_action_type = 'create_policy' then
    insert into public.organization_governance_policies (
      organization_id, policy_number, title, description, category, status,
      department_id, domain_id, business_pack_key, effective_date, review_date,
      requires_acknowledgement, owner_user_id
    ) values (
      v_org_id, public._ogv515_next_policy_number(v_org_id),
      coalesce(nullif(p_payload->>'title', ''), 'New Policy'),
      coalesce(p_payload->>'description', ''),
      coalesce(nullif(p_payload->>'category', ''), 'operational'),
      coalesce(nullif(p_payload->>'status', ''), 'draft'),
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      nullif(p_payload->>'business_pack_key', ''),
      nullif(p_payload->>'effective_date', '')::date,
      nullif(p_payload->>'review_date', '')::date,
      coalesce((p_payload->>'requires_acknowledgement')::boolean, false),
      v_user_id
    ) returning id into v_policy_id;

    insert into public.organization_governance_policy_versions (
      organization_id, policy_id, version_number, title, description, changed_by, change_summary
    ) select organization_id, id, 1, title, description, v_user_id, 'Initial version'
    from public.organization_governance_policies where id = v_policy_id;

    perform public._ogv515_log(v_org_id, 'policy_created', 'Policy created', 'policy', 'policy', v_policy_id, p_payload);
    return jsonb_build_object('ok', true, 'policy_id', v_policy_id);

  elsif p_action_type = 'activate_policy' then
    v_policy_id := (p_payload->>'policy_id')::uuid;
    update public.organization_governance_policies set status = 'active', updated_at = now()
    where id = v_policy_id and organization_id = v_org_id;
    perform public._ogv515_log(v_org_id, 'policy_activated', 'Policy activated', 'policy', 'policy', v_policy_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'acknowledge_policy' then
    perform public._irp_require_permission('governance.view');
    v_policy_id := (p_payload->>'policy_id')::uuid;
    insert into public.organization_governance_policy_acknowledgements (
      organization_id, policy_id, user_id, response, notes
    ) values (
      v_org_id, v_policy_id, v_user_id,
      coalesce(nullif(p_payload->>'response', ''), 'accepted'),
      coalesce(p_payload->>'notes', '')
    )
    on conflict (organization_id, policy_id, user_id) do update set
      response = excluded.response, notes = excluded.notes, acknowledged_at = now();

    perform public._ogv515_log(v_org_id, 'policy_acknowledged', 'Policy acknowledgement recorded', 'policy', 'acknowledgement', v_policy_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_access_review' then
    insert into public.organization_governance_access_reviews (
      organization_id, review_key, title, status, department_id, due_date, reviewer_user_id
    ) values (
      v_org_id, 'AR-' || substr(gen_random_uuid()::text, 1, 8),
      coalesce(nullif(p_payload->>'title', ''), 'Access Review'),
      'scheduled',
      nullif(p_payload->>'department_id', '')::uuid,
      coalesce(nullif(p_payload->>'due_date', '')::date, current_date + 14),
      v_user_id
    ) returning id into v_review_id;

    perform public._ogv515_log(v_org_id, 'access_review_created', 'Access review scheduled', 'compliance', 'access_review', v_review_id, p_payload);
    return jsonb_build_object('ok', true, 'review_id', v_review_id);

  elsif p_action_type = 'create_risk' then
    insert into public.organization_governance_risks (
      organization_id, risk_number, category, title, description, impact, likelihood,
      owner_user_id, mitigation_plan, department_id, domain_id, business_pack_key
    ) values (
      v_org_id, public._ogv515_next_risk_number(v_org_id),
      coalesce(nullif(p_payload->>'category', ''), 'operational'),
      coalesce(nullif(p_payload->>'title', ''), 'New Risk'),
      coalesce(p_payload->>'description', ''),
      coalesce(nullif(p_payload->>'impact', ''), 'medium'),
      coalesce(nullif(p_payload->>'likelihood', ''), 'medium'),
      v_user_id, coalesce(p_payload->>'mitigation_plan', ''),
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      nullif(p_payload->>'business_pack_key', '')
    ) returning id into v_risk_id;

    perform public._ogv515_log(v_org_id, 'risk_created', 'Risk registered', 'risk', 'risk', v_risk_id, p_payload);
    return jsonb_build_object('ok', true, 'risk_id', v_risk_id);

  elsif p_action_type = 'create_approval_request' then
    insert into public.organization_governance_approval_requests (
      organization_id, request_type, title, summary, requested_by,
      domain_id, business_pack_key, department_id, companion_suggested
    ) values (
      v_org_id,
      coalesce(nullif(p_payload->>'request_type', ''), 'access_request'),
      coalesce(nullif(p_payload->>'title', ''), 'Governance approval request'),
      coalesce(p_payload->>'summary', ''),
      v_user_id,
      nullif(p_payload->>'domain_id', '')::uuid,
      nullif(p_payload->>'business_pack_key', ''),
      nullif(p_payload->>'department_id', '')::uuid,
      coalesce((p_payload->>'companion_suggested')::boolean, false)
    ) returning id into v_approval_id;

    perform public._ogv515_log(v_org_id, 'approval_requested', 'Governance approval requested', 'approval', 'approval_request', v_approval_id, p_payload);
    return jsonb_build_object('ok', true, 'approval_id', v_approval_id);

  elsif p_action_type = 'decide_approval' then
    v_approval_id := (p_payload->>'approval_id')::uuid;
    update public.organization_governance_approval_requests set
      status = coalesce(nullif(p_payload->>'decision', ''), 'approved'),
      decided_by = v_user_id, updated_at = now()
    where id = v_approval_id and organization_id = v_org_id;

    perform public._ogv515_log(v_org_id, 'approval_decided', 'Governance approval decided', 'approval', 'approval_request', v_approval_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'toggle_control' then
    v_control_id := (p_payload->>'control_id')::uuid;
    update public.organization_governance_controls set
      is_active = coalesce((p_payload->>'is_active')::boolean, is_active),
      updated_at = now()
    where id = v_control_id and organization_id = v_org_id;

    perform public._ogv515_log(v_org_id, 'control_updated', 'Governance control updated', 'control', 'control', v_control_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'seed_compliance' then
    insert into public.organization_governance_compliance_records (organization_id, compliance_type, status, title, summary)
    select v_org_id, t.compliance_type, t.status, t.title, t.summary
    from (values
      ('policy', 'compliant', 'Policy compliance baseline', 'Active policies reviewed and acknowledged where required.'),
      ('access', 'requires_attention', 'Quarterly access review', 'Scheduled access review pending completion.'),
      ('audit_readiness', 'compliant', 'Audit readiness', 'Governance audit trail active and searchable.')
    ) as t(compliance_type, status, title, summary)
    where not exists (
      select 1 from public.organization_governance_compliance_records c
      where c.organization_id = v_org_id and c.title = t.title
    );

    perform public._ogv515_log(v_org_id, 'compliance_seeded', 'Compliance records initialized', 'compliance');
    return jsonb_build_object('ok', true);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Audit search, companion, mobile
-- ---------------------------------------------------------------------------
create or replace function public.search_governance_audit(
  p_user_id uuid default null,
  p_department_id uuid default null,
  p_business_pack_key text default null,
  p_domain_id uuid default null,
  p_event_category text default null,
  p_event_type text default null,
  p_from timestamptz default null,
  p_to timestamptz default null,
  p_limit int default 50
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_items jsonb;
begin
  perform public._irp_require_permission('governance.view');
  v_org_id := public._ogv515_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'event_type', a.event_type, 'event_category', a.event_category,
    'summary', a.summary, 'business_pack_key', a.business_pack_key,
    'department_id', a.department_id, 'domain_id', a.domain_id,
    'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_items
  from public.organization_governance_audit_logs a
  where a.organization_id = v_org_id
    and (p_user_id is null or a.actor_user_id = p_user_id)
    and (p_department_id is null or a.department_id = p_department_id)
    and (p_business_pack_key is null or a.business_pack_key = p_business_pack_key)
    and (p_domain_id is null or a.domain_id = p_domain_id)
    and (p_event_category is null or a.event_category = p_event_category)
    and (p_event_type is null or a.event_type = p_event_type)
    and (p_from is null or a.created_at >= p_from)
    and (p_to is null or a.created_at <= p_to)
  limit greatest(1, least(p_limit, 200));

  return jsonb_build_object('found', true, 'events', coalesce(v_items, '[]'::jsonb));
end; $$;

create or replace function public.get_companion_governance_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._ogv515_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion may recommend. Companion may not bypass governance.',
    'governance_health', public._ogv515_health_score(v_org_id),
    'companion_states', jsonb_build_array('suggested', 'allowed', 'approved', 'executed'),
    'pending_approvals', (select count(*) from public.organization_governance_approval_requests where organization_id = v_org_id and status = 'pending'),
    'active_controls', (select count(*) from public.organization_governance_controls where organization_id = v_org_id and is_active),
    'open_risks', (select count(*) from public.organization_governance_risks where organization_id = v_org_id and status in ('open', 'mitigating')),
    'companion_prompts', jsonb_build_array(
      'What policies require my acknowledgement?',
      'Show pending governance approvals.',
      'What are our open compliance risks?',
      'Summarize governance health.'
    ),
    'governance_route', '/app/governance'
  );
end; $$;

create or replace function public.get_my_governance_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_pending_policies jsonb;
begin
  perform public._irp_require_permission('governance.view');
  v_org_id := public._ogv515_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);

  select coalesce(jsonb_agg(public._ogv515_policy_json(p)), '[]'::jsonb)
  into v_pending_policies
  from public.organization_governance_policies p
  where p.organization_id = v_org_id and p.status = 'active' and p.requires_acknowledgement
    and not exists (
      select 1 from public.organization_governance_policy_acknowledgements a
      where a.policy_id = p.id and a.user_id = v_user_id and a.response = 'accepted'
    );

  return jsonb_build_object(
    'found', true,
    'pending_policy_acknowledgements', coalesce(v_pending_policies, '[]'::jsonb),
    'pending_approvals_for_me', (
      select count(*) from public.organization_governance_approval_requests
      where organization_id = v_org_id and status = 'pending'
    ),
    'can_review_policies', true,
    'can_approve_requests', true,
    'can_review_risks', true,
    'can_access_audit', true,
    'routes', jsonb_build_object(
      'governance', '/app/governance',
      'policies', '/app/governance/policies',
      'audit', '/app/governance/audit'
    )
  );
end; $$;

-- Module registry
do $$ begin
  perform public._mre501_seed_module(
    'governance_control', 'Governance', 'governance-control', 'governance',
    'Governance, compliance, and organizational control for the organization.',
    'business', null, 'governance', '/app/governance', 'licensed', 10
  );
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('governance_control', 'governance.view', 'view', 'Governance — view policies and compliance'),
    ('governance_control', 'governance.manage', 'manage', 'Governance — manage policies, risks, and controls'),
    ('governance_control', 'governance.approve', 'custom', 'Governance — approve requests')
  on conflict (permission_key) do nothing;
exception when others then
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('governance_control', 'governance.view', 'view', 'Governance — view policies and compliance'),
    ('governance_control', 'governance.manage', 'manage', 'Governance — manage policies, risks, and controls'),
    ('governance_control', 'governance.approve', 'custom', 'Governance — approve requests')
  on conflict (permission_key) do nothing;
end $$;

grant execute on function public.get_governance_management_center(text) to authenticated;
grant execute on function public.perform_governance_management_action(text, jsonb) to authenticated;
grant execute on function public.search_governance_audit(uuid, uuid, text, uuid, text, text, timestamptz, timestamptz, int) to authenticated;
grant execute on function public.get_companion_governance_context() to authenticated;
grant execute on function public.get_my_governance_summary() to authenticated;
