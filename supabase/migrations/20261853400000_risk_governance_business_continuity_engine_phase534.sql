-- Phase 534 — Risk, Governance & Business Continuity Engine
-- Extends Phase 515 (Governance). Problems discovered before they become crises.

-- ---------------------------------------------------------------------------
-- 1. Extend governance risks (Phase 515)
-- ---------------------------------------------------------------------------
alter table public.organization_governance_risks add column if not exists risk_score integer;
alter table public.organization_governance_risks add column if not exists risk_control_status text not null default 'monitored' check (
  risk_control_status in ('controlled', 'monitored', 'elevated', 'critical', 'uncontrolled')
);
alter table public.organization_governance_risks add column if not exists review_date date;
alter table public.organization_governance_risks add column if not exists assessment_type text not null default 'organization';

alter table public.organization_governance_risks drop constraint if exists organization_governance_risks_category_check;
alter table public.organization_governance_risks add constraint organization_governance_risks_category_check check (
  category in (
    'operational', 'security', 'compliance', 'process', 'resource', 'financial',
    'technology', 'cyber', 'vendor', 'legal', 'reputation', 'personnel', 'partner', 'custom'
  )
);

-- ---------------------------------------------------------------------------
-- 2. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_risk_operations_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  companion_risk_context_enabled boolean not null default true,
  heat_map_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_risk_operations_settings enable row level security;
revoke all on public.organization_risk_operations_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Assessments
-- ---------------------------------------------------------------------------
create table if not exists public.organization_risk_operations_assessments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  assessment_number text,
  title text not null,
  assessment_type text not null default 'organization' check (
    assessment_type in ('department', 'project', 'vendor', 'business_pack', 'organization')
  ),
  status text not null default 'identify' check (
    status in ('identify', 'assess', 'score', 'mitigate', 'monitor', 'review', 'completed')
  ),
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  owner_user_id uuid references public.users (id) on delete set null,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, assessment_number)
);

alter table public.organization_risk_operations_assessments enable row level security;
revoke all on public.organization_risk_operations_assessments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Mitigation plans
-- ---------------------------------------------------------------------------
create table if not exists public.organization_risk_operations_mitigation_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  plan_number text,
  risk_id uuid references public.organization_governance_risks (id) on delete set null,
  title text not null,
  description text not null default '',
  owner_user_id uuid references public.users (id) on delete set null,
  due_date date,
  status text not null default 'open' check (
    status in ('open', 'in_progress', 'implemented', 'verified', 'overdue', 'closed')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, plan_number)
);

alter table public.organization_risk_operations_mitigation_plans enable row level security;
revoke all on public.organization_risk_operations_mitigation_plans from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Business continuity
-- ---------------------------------------------------------------------------
create table if not exists public.organization_risk_operations_continuity_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  plan_number text,
  title text not null,
  description text not null default '',
  status text not null default 'draft' check (
    status in ('draft', 'active', 'review_required', 'expired')
  ),
  recovery_time_objective text not null default '',
  emergency_contacts jsonb not null default '[]'::jsonb,
  business_pack_key text,
  domain_id uuid references public.organization_domains (id) on delete set null,
  owner_user_id uuid references public.users (id) on delete set null,
  review_date date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, plan_number)
);

alter table public.organization_risk_operations_continuity_plans enable row level security;
revoke all on public.organization_risk_operations_continuity_plans from authenticated, anon;

create table if not exists public.organization_risk_operations_continuity_processes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  plan_id uuid references public.organization_risk_operations_continuity_plans (id) on delete cascade,
  process_name text not null,
  criticality text not null default 'high' check (criticality in ('low', 'medium', 'high', 'critical')),
  recovery_procedure text not null default '',
  backup_procedure text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_risk_operations_continuity_processes enable row level security;
revoke all on public.organization_risk_operations_continuity_processes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Vendor dependencies & dependency mapping
-- ---------------------------------------------------------------------------
create table if not exists public.organization_risk_operations_vendor_dependencies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  vendor_name text not null,
  dependency_level text not null default 'medium' check (
    dependency_level in ('low', 'medium', 'high', 'critical')
  ),
  replacement_available boolean not null default false,
  contract_status text not null default 'active',
  risk_score integer,
  business_impact text not null default 'medium' check (
    business_impact in ('low', 'medium', 'high', 'critical')
  ),
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organization_risk_operations_vendor_dependencies enable row level security;
revoke all on public.organization_risk_operations_vendor_dependencies from authenticated, anon;

create table if not exists public.organization_risk_operations_dependencies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  dependency_type text not null check (
    dependency_type in ('system', 'vendor', 'employee', 'process', 'integration')
  ),
  dependency_name text not null,
  criticality text not null default 'high' check (criticality in ('low', 'medium', 'high', 'critical')),
  failure_impact text not null default '',
  department_id uuid references public.organization_departments (id) on delete set null,
  business_pack_key text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_risk_operations_dependencies enable row level security;
revoke all on public.organization_risk_operations_dependencies from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Incident escalation
-- ---------------------------------------------------------------------------
create table if not exists public.organization_risk_operations_incidents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  incident_number text,
  title text not null,
  incident_type text not null default 'operational' check (
    incident_type in (
      'major_outage', 'security_incident', 'vendor_failure', 'data_loss',
      'legal_issue', 'compliance_failure', 'operational'
    )
  ),
  severity text not null default 'high' check (severity in ('low', 'medium', 'high', 'critical')),
  status text not null default 'declared' check (
    status in ('declared', 'assessment', 'response', 'recovery', 'review', 'closed')
  ),
  lessons_learned text not null default '',
  owner_user_id uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, incident_number)
);

alter table public.organization_risk_operations_incidents enable row level security;
revoke all on public.organization_risk_operations_incidents from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.organization_risk_operations_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  entity_type text,
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_risk_operations_audit_logs_org_idx
  on public.organization_risk_operations_audit_logs (organization_id, created_at desc);

alter table public.organization_risk_operations_audit_logs enable row level security;
revoke all on public.organization_risk_operations_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._risk534_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_require_organization();
$$;

create or replace function public._risk534_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_risk_operations_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._risk534_log(
  p_org_id uuid, p_action text, p_summary text,
  p_entity_type text default null, p_entity_id uuid default null, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_risk_operations_audit_logs (
    organization_id, actor_user_id, action, summary, entity_type, entity_id, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, p_entity_type, p_entity_id, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._risk534_level_value(p_level text)
returns int language sql immutable as $$
  select case lower(coalesce(p_level, 'medium'))
    when 'low' then 1 when 'medium' then 2 when 'high' then 3 when 'critical' then 4 else 2 end;
$$;

create or replace function public._risk534_compute_score(p_likelihood text, p_impact text)
returns jsonb language sql immutable as $$
  with raw as (
    select public._risk534_level_value(p_likelihood) * public._risk534_level_value(p_impact) as score
  )
  select jsonb_build_object(
    'risk_score', score,
    'risk_level', case
      when score <= 4 then 'low'
      when score <= 8 then 'moderate'
      when score <= 12 then 'high'
      else 'critical'
    end,
    'risk_control_status', case
      when score <= 4 then 'controlled'
      when score <= 8 then 'monitored'
      when score <= 12 then 'elevated'
      when score <= 15 then 'critical'
      else 'uncontrolled'
    end
  ) from raw;
$$;

create or replace function public._risk534_risk_json(p_row public.organization_governance_risks)
returns jsonb language plpgsql stable as $$
declare v_score jsonb;
begin
  v_score := public._risk534_compute_score(p_row.likelihood, p_row.impact);
  return jsonb_build_object(
    'id', p_row.id,
    'risk_number', p_row.risk_number,
    'title', p_row.title,
    'description', p_row.description,
    'category', p_row.category,
    'likelihood', p_row.likelihood,
    'impact', p_row.impact,
    'risk_score', coalesce(p_row.risk_score, (v_score->>'risk_score')::int),
    'risk_level', v_score->>'risk_level',
    'risk_control_status', coalesce(p_row.risk_control_status, v_score->>'risk_control_status'),
    'status', p_row.status,
    'mitigation_plan', p_row.mitigation_plan,
    'review_date', p_row.review_date,
    'department_id', p_row.department_id,
    'domain_id', p_row.domain_id,
    'business_pack_key', p_row.business_pack_key
  );
end; $$;

create or replace function public._risk534_overall_score(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_avg numeric;
  v_critical int;
  v_uncontrolled int;
begin
  select avg(coalesce(risk_score, public._risk534_level_value(likelihood) * public._risk534_level_value(impact))),
         count(*) filter (where risk_control_status = 'critical' or (likelihood = 'critical' or impact = 'critical')),
         count(*) filter (where risk_control_status = 'uncontrolled')
  into v_avg, v_critical, v_uncontrolled
  from public.organization_governance_risks
  where organization_id = p_org_id and status not in ('closed', 'accepted');

  return jsonb_build_object(
    'overall_risk_score', coalesce(round(100 - least(100, coalesce(v_avg, 0) * 6))::int, 75),
    'critical_risks', coalesce(v_critical, 0),
    'uncontrolled_risks', coalesce(v_uncontrolled, 0)
  );
exception when others then
  return jsonb_build_object('overall_risk_score', 75, 'critical_risks', 0, 'uncontrolled_risks', 0);
end; $$;

create or replace function public._risk534_heat_map(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'title', title,
      'likelihood', likelihood,
      'impact', impact,
      'risk_score', coalesce(risk_score, public._risk534_level_value(likelihood) * public._risk534_level_value(impact)),
      'category', category
    ))
    from public.organization_governance_risks
    where organization_id = p_org_id and status not in ('closed', 'accepted')
    limit 50
  ), '[]'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Risk Operations Center
-- ---------------------------------------------------------------------------
create or replace function public.get_risk_operations_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('risk.view');
  v_org_id := public._risk534_org();
  perform public._risk534_ensure_settings(v_org_id);
  perform public._risk534_log(v_org_id, 'center_view', 'Risk Center viewed', null, null,
    jsonb_build_object('section', p_section));

  return jsonb_build_object(
    'found', true,
    'principle', 'Problems should be discovered before they become crises. Organizations should not rely on luck.',
    'philosophy', 'Risk ignored becomes crisis. Governance creates control. Preparation creates resilience.',
    'overall_risk', public._risk534_overall_score(v_org_id),
    'overview', jsonb_build_object(
      'overall_risk_score', (public._risk534_overall_score(v_org_id)->>'overall_risk_score')::int,
      'open_risks', (select count(*) from public.organization_governance_risks where organization_id = v_org_id and status not in ('closed', 'accepted')),
      'critical_risks', (select count(*) from public.organization_governance_risks where organization_id = v_org_id and risk_control_status in ('critical', 'uncontrolled')),
      'elevated_risks', (select count(*) from public.organization_governance_risks where organization_id = v_org_id and risk_control_status = 'elevated'),
      'open_assessments', (select count(*) from public.organization_risk_operations_assessments where organization_id = v_org_id and status <> 'completed'),
      'open_mitigations', (select count(*) from public.organization_risk_operations_mitigation_plans where organization_id = v_org_id and status not in ('closed', 'verified')),
      'overdue_mitigations', (select count(*) from public.organization_risk_operations_mitigation_plans where organization_id = v_org_id and status not in ('closed', 'verified') and due_date < current_date),
      'active_continuity_plans', (select count(*) from public.organization_risk_operations_continuity_plans where organization_id = v_org_id and status = 'active'),
      'continuity_review_due', (select count(*) from public.organization_risk_operations_continuity_plans where organization_id = v_org_id and review_date <= current_date + 30),
      'critical_dependencies', (select count(*) from public.organization_risk_operations_dependencies where organization_id = v_org_id and criticality in ('high', 'critical')),
      'high_vendor_risk', (select count(*) from public.organization_risk_operations_vendor_dependencies where organization_id = v_org_id and dependency_level in ('high', 'critical')),
      'open_incidents', (select count(*) from public.organization_risk_operations_incidents where organization_id = v_org_id and status <> 'closed'),
      'governance_health', (select public._ogv515_health_score(v_org_id))
    ),
    'risk_register', coalesce((
      select jsonb_agg(public._risk534_risk_json(r) order by coalesce(r.risk_score, 0) desc)
      from (select * from public.organization_governance_risks where organization_id = v_org_id and status not in ('closed', 'accepted') order by updated_at desc limit 50) r
    ), '[]'::jsonb),
    'assessments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'assessment_number', a.assessment_number, 'title', a.title,
        'assessment_type', a.assessment_type, 'status', a.status
      ) order by a.updated_at desc)
      from (select * from public.organization_risk_operations_assessments where organization_id = v_org_id order by updated_at desc limit 40) a
    ), '[]'::jsonb),
    'mitigation_plans', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'plan_number', m.plan_number, 'title', m.title,
        'status', m.status, 'due_date', m.due_date, 'risk_id', m.risk_id
      ) order by m.due_date nulls last)
      from (select * from public.organization_risk_operations_mitigation_plans where organization_id = v_org_id order by updated_at desc limit 40) m
    ), '[]'::jsonb),
    'continuity_plans', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'plan_number', c.plan_number, 'title', c.title,
        'status', c.status, 'recovery_time_objective', c.recovery_time_objective,
        'review_date', c.review_date,
        'process_count', (select count(*) from public.organization_risk_operations_continuity_processes p where p.plan_id = c.id)
      ) order by c.updated_at desc)
      from (select * from public.organization_risk_operations_continuity_plans where organization_id = v_org_id order by updated_at desc limit 30) c
    ), '[]'::jsonb),
    'vendor_dependencies', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', v.id, 'vendor_name', v.vendor_name, 'dependency_level', v.dependency_level,
        'replacement_available', v.replacement_available, 'contract_status', v.contract_status,
        'risk_score', v.risk_score, 'business_impact', v.business_impact
      ) order by v.updated_at desc)
      from (select * from public.organization_risk_operations_vendor_dependencies where organization_id = v_org_id order by updated_at desc limit 40) v
    ), '[]'::jsonb),
    'dependencies', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id, 'dependency_type', d.dependency_type, 'dependency_name', d.dependency_name,
        'criticality', d.criticality, 'failure_impact', d.failure_impact
      ) order by d.created_at desc)
      from (select * from public.organization_risk_operations_dependencies where organization_id = v_org_id order by created_at desc limit 40) d
    ), '[]'::jsonb),
    'incidents', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'incident_number', i.incident_number, 'title', i.title,
        'incident_type', i.incident_type, 'severity', i.severity, 'status', i.status
      ) order by i.updated_at desc)
      from (select * from public.organization_risk_operations_incidents where organization_id = v_org_id order by updated_at desc limit 30) i
    ), '[]'::jsonb),
    'heat_map', public._risk534_heat_map(v_org_id),
    'executive_risk', jsonb_build_object(
      'top_risks', coalesce((
        select jsonb_agg(public._risk534_risk_json(r))
        from (select * from public.organization_governance_risks where organization_id = v_org_id and status not in ('closed', 'accepted') order by coalesce(risk_score, 0) desc limit 5) r
      ), '[]'::jsonb),
      'emerging_risks', coalesce((
        select jsonb_agg(public._risk534_risk_json(r))
        from (select * from public.organization_governance_risks where organization_id = v_org_id and created_at >= now() - interval '30 days' and status not in ('closed', 'accepted') order by created_at desc limit 5) r
      ), '[]'::jsonb),
      'uncontrolled_risks', coalesce((
        select jsonb_agg(public._risk534_risk_json(r))
        from (select * from public.organization_governance_risks where organization_id = v_org_id and risk_control_status in ('critical', 'uncontrolled') limit 10) r
      ), '[]'::jsonb)
    ),
    'governance_link', jsonb_build_object(
      'governance_center', '/app/governance',
      'policies', '/app/governance/policies',
      'controls', '/app/governance/controls',
      'compliance', '/app/governance/compliance'
    ),
    'reports', jsonb_build_object(
      'risk_distribution', coalesce((
        select jsonb_object_agg(risk_control_status, cnt)
        from (
          select coalesce(risk_control_status, 'monitored') as risk_control_status, count(*) as cnt
          from public.organization_governance_risks where organization_id = v_org_id and status not in ('closed', 'accepted')
          group by risk_control_status
        ) x
      ), '{}'::jsonb),
      'vendor_exposure', (select count(*) from public.organization_risk_operations_vendor_dependencies where organization_id = v_org_id and dependency_level in ('high', 'critical')),
      'continuity_readiness', coalesce((
        select round((count(*) filter (where status = 'active')::numeric / greatest(count(*), 1)) * 100, 1)
        from public.organization_risk_operations_continuity_plans where organization_id = v_org_id
      ), 0)
    ),
    'companion_insights', jsonb_build_object(
      'critical_risks', coalesce((
        select jsonb_agg(jsonb_build_object('title', title, 'risk_control_status', risk_control_status))
        from (select title, risk_control_status from public.organization_governance_risks where organization_id = v_org_id and risk_control_status in ('critical', 'uncontrolled') limit 5) x
      ), '[]'::jsonb),
      'top_vendor_risks', coalesce((
        select jsonb_agg(jsonb_build_object('vendor_name', vendor_name, 'dependency_level', dependency_level))
        from (select vendor_name, dependency_level from public.organization_risk_operations_vendor_dependencies where organization_id = v_org_id and dependency_level in ('high', 'critical') limit 5) x
      ), '[]'::jsonb),
      'continuity_gaps', coalesce((
        select jsonb_agg(jsonb_build_object('title', title, 'status', status))
        from (select title, status from public.organization_risk_operations_continuity_plans where organization_id = v_org_id and status in ('draft', 'review_required') limit 5) x
      ), '[]'::jsonb)
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('action', a.action, 'summary', a.summary, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_risk_operations_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'sections', jsonb_build_array(
      'overview', 'risk_register', 'assessments', 'mitigation_plans',
      'business_continuity', 'incidents', 'dependencies', 'reports', 'executive_risk'
    ),
    'routes', jsonb_build_object(
      'risk', '/app/risk',
      'register', '/app/risk/register',
      'business_continuity', '/app/risk/business-continuity',
      'governance', '/app/governance'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_risk_operations_action(
  p_action_type text, p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_id uuid;
  v_score jsonb;
  v_likelihood text;
  v_impact text;
begin
  v_org_id := public._risk534_org();
  perform public._risk534_ensure_settings(v_org_id);
  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);

  if p_action_type in (
    'create_risk', 'update_risk_score', 'escalate_risk',
    'create_assessment', 'advance_assessment',
    'create_mitigation_plan', 'complete_mitigation',
    'create_continuity_plan', 'activate_continuity_plan',
    'add_vendor_dependency', 'add_dependency',
    'declare_incident', 'advance_incident', 'close_incident'
  ) then
    perform public._irp_require_permission('risk.manage');
  else
    perform public._irp_require_permission('risk.view');
  end if;

  if p_action_type = 'create_risk' then
    v_likelihood := coalesce(p_payload->>'likelihood', 'medium');
    v_impact := coalesce(p_payload->>'impact', 'medium');
    v_score := public._risk534_compute_score(v_likelihood, v_impact);
    insert into public.organization_governance_risks (
      organization_id, risk_number, category, title, description,
      impact, likelihood, risk_score, risk_control_status, mitigation_plan,
      owner_user_id, department_id, domain_id, business_pack_key, review_date, status
    ) values (
      v_org_id,
      public._ogv515_next_risk_number(v_org_id),
      coalesce(p_payload->>'category', 'operational'),
      coalesce(p_payload->>'title', 'Risk'),
      coalesce(p_payload->>'description', ''),
      v_impact, v_likelihood,
      (v_score->>'risk_score')::int,
      v_score->>'risk_control_status',
      coalesce(p_payload->>'mitigation_plan', ''),
      v_user_id,
      (p_payload->>'department_id')::uuid,
      (p_payload->>'domain_id')::uuid,
      p_payload->>'business_pack_key',
      (p_payload->>'review_date')::date,
      'open'
    ) returning id into v_id;
    perform public._risk534_log(v_org_id, 'risk_created', 'Risk created', 'risk', v_id);
    perform public._ogv515_log(v_org_id, 'risk_created', 'Risk registered in risk center', 'risk', 'risk', v_id);
    return jsonb_build_object('ok', true, 'risk_id', v_id);

  elsif p_action_type = 'escalate_risk' then
    update public.organization_governance_risks
    set risk_control_status = 'critical', status = 'open', updated_at = now()
    where id = (p_payload->>'risk_id')::uuid and organization_id = v_org_id
    returning id into v_id;
    perform public._risk534_log(v_org_id, 'risk_escalated', 'Risk escalated', 'risk', v_id);
    return jsonb_build_object('ok', v_id is not null);

  elsif p_action_type = 'update_risk_score' then
    v_likelihood := coalesce(p_payload->>'likelihood', 'medium');
    v_impact := coalesce(p_payload->>'impact', 'medium');
    v_score := public._risk534_compute_score(v_likelihood, v_impact);
    update public.organization_governance_risks
    set likelihood = v_likelihood, impact = v_impact,
        risk_score = (v_score->>'risk_score')::int,
        risk_control_status = v_score->>'risk_control_status',
        updated_at = now()
    where id = (p_payload->>'risk_id')::uuid and organization_id = v_org_id
    returning id into v_id;
    perform public._risk534_log(v_org_id, 'risk_updated', 'Risk score updated', 'risk', v_id);
    return jsonb_build_object('ok', v_id is not null, 'score', v_score);

  elsif p_action_type = 'create_assessment' then
    insert into public.organization_risk_operations_assessments (
      organization_id, assessment_number, title, assessment_type, owner_user_id, status
    ) values (
      v_org_id,
      'ASM-' || lpad((select count(*) + 1 from public.organization_risk_operations_assessments where organization_id = v_org_id)::text, 5, '0'),
      coalesce(p_payload->>'title', 'Assessment'),
      coalesce(p_payload->>'assessment_type', 'organization'),
      v_user_id,
      'identify'
    ) returning id into v_id;
    perform public._risk534_log(v_org_id, 'assessment_completed', 'Assessment created', 'assessment', v_id);
    return jsonb_build_object('ok', true, 'assessment_id', v_id);

  elsif p_action_type = 'advance_assessment' then
    update public.organization_risk_operations_assessments
    set status = coalesce(p_payload->>'status', 'assess'), updated_at = now()
    where id = (p_payload->>'assessment_id')::uuid and organization_id = v_org_id
    returning id into v_id;
    perform public._risk534_log(v_org_id, 'assessment_completed', 'Assessment advanced', 'assessment', v_id);
    return jsonb_build_object('ok', v_id is not null);

  elsif p_action_type = 'create_mitigation_plan' then
    insert into public.organization_risk_operations_mitigation_plans (
      organization_id, plan_number, risk_id, title, description, owner_user_id, due_date
    ) values (
      v_org_id,
      'MIT-' || lpad((select count(*) + 1 from public.organization_risk_operations_mitigation_plans where organization_id = v_org_id)::text, 5, '0'),
      (p_payload->>'risk_id')::uuid,
      coalesce(p_payload->>'title', 'Mitigation plan'),
      coalesce(p_payload->>'description', ''),
      v_user_id,
      (p_payload->>'due_date')::date
    ) returning id into v_id;
    perform public._risk534_log(v_org_id, 'mitigation_added', 'Mitigation plan created', 'mitigation', v_id);
    return jsonb_build_object('ok', true, 'plan_id', v_id);

  elsif p_action_type = 'complete_mitigation' then
    update public.organization_risk_operations_mitigation_plans
    set status = 'verified', updated_at = now()
    where id = (p_payload->>'plan_id')::uuid and organization_id = v_org_id
    returning id into v_id;
    perform public._risk534_log(v_org_id, 'mitigation_added', 'Mitigation verified', 'mitigation', v_id);
    return jsonb_build_object('ok', v_id is not null);

  elsif p_action_type = 'create_continuity_plan' then
    insert into public.organization_risk_operations_continuity_plans (
      organization_id, plan_number, title, description, recovery_time_objective, owner_user_id
    ) values (
      v_org_id,
      'BCP-' || lpad((select count(*) + 1 from public.organization_risk_operations_continuity_plans where organization_id = v_org_id)::text, 5, '0'),
      coalesce(p_payload->>'title', 'Continuity plan'),
      coalesce(p_payload->>'description', ''),
      coalesce(p_payload->>'recovery_time_objective', ''),
      v_user_id
    ) returning id into v_id;
    perform public._risk534_log(v_org_id, 'continuity_plan_updated', 'Continuity plan created', 'continuity', v_id);
    return jsonb_build_object('ok', true, 'plan_id', v_id);

  elsif p_action_type = 'activate_continuity_plan' then
    update public.organization_risk_operations_continuity_plans
    set status = 'active', updated_at = now()
    where id = (p_payload->>'plan_id')::uuid and organization_id = v_org_id
    returning id into v_id;
    perform public._risk534_log(v_org_id, 'continuity_plan_updated', 'Continuity plan activated', 'continuity', v_id);
    return jsonb_build_object('ok', v_id is not null);

  elsif p_action_type = 'add_vendor_dependency' then
    insert into public.organization_risk_operations_vendor_dependencies (
      organization_id, vendor_name, dependency_level, replacement_available, business_impact,
      contract_status, risk_score
    ) values (
      v_org_id,
      coalesce(p_payload->>'vendor_name', 'Vendor'),
      coalesce(p_payload->>'dependency_level', 'medium'),
      coalesce((p_payload->>'replacement_available')::boolean, false),
      coalesce(p_payload->>'business_impact', 'medium'),
      coalesce(p_payload->>'contract_status', 'active'),
      public._risk534_level_value(coalesce(p_payload->>'dependency_level', 'medium')) * public._risk534_level_value(coalesce(p_payload->>'business_impact', 'medium'))
    ) returning id into v_id;
    perform public._risk534_log(v_org_id, 'dependency_detected', 'Vendor dependency added', 'vendor_dependency', v_id);
    return jsonb_build_object('ok', true, 'dependency_id', v_id);

  elsif p_action_type = 'add_dependency' then
    insert into public.organization_risk_operations_dependencies (
      organization_id, dependency_type, dependency_name, criticality, failure_impact, business_pack_key
    ) values (
      v_org_id,
      coalesce(p_payload->>'dependency_type', 'system'),
      coalesce(p_payload->>'dependency_name', 'Dependency'),
      coalesce(p_payload->>'criticality', 'high'),
      coalesce(p_payload->>'failure_impact', ''),
      p_payload->>'business_pack_key'
    ) returning id into v_id;
    perform public._risk534_log(v_org_id, 'dependency_detected', 'Critical dependency mapped', 'dependency', v_id);
    return jsonb_build_object('ok', true, 'dependency_id', v_id);

  elsif p_action_type = 'declare_incident' then
    insert into public.organization_risk_operations_incidents (
      organization_id, incident_number, title, incident_type, severity, owner_user_id, status
    ) values (
      v_org_id,
      'RIN-' || lpad((select count(*) + 1 from public.organization_risk_operations_incidents where organization_id = v_org_id)::text, 5, '0'),
      coalesce(p_payload->>'title', 'Incident'),
      coalesce(p_payload->>'incident_type', 'operational'),
      coalesce(p_payload->>'severity', 'high'),
      v_user_id,
      'declared'
    ) returning id into v_id;
    perform public._risk534_log(v_org_id, 'incident_declared', 'Incident declared', 'incident', v_id);
    return jsonb_build_object('ok', true, 'incident_id', v_id);

  elsif p_action_type = 'advance_incident' then
    update public.organization_risk_operations_incidents
    set status = coalesce(p_payload->>'status', 'response'), updated_at = now()
    where id = (p_payload->>'incident_id')::uuid and organization_id = v_org_id
    returning id into v_id;
    perform public._risk534_log(v_org_id, 'incident_declared', 'Incident advanced', 'incident', v_id);
    return jsonb_build_object('ok', v_id is not null);

  elsif p_action_type = 'close_incident' then
    update public.organization_risk_operations_incidents
    set status = 'closed',
        lessons_learned = coalesce(p_payload->>'lessons_learned', lessons_learned),
        updated_at = now()
    where id = (p_payload->>'incident_id')::uuid and organization_id = v_org_id
    returning id into v_id;
    perform public._risk534_log(v_org_id, 'incident_declared', 'Incident closed with lessons learned', 'incident', v_id);
    return jsonb_build_object('ok', v_id is not null);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_risk_operations_context(p_query text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('risk.view');
  v_org_id := public._risk534_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  return jsonb_build_object(
    'found', true,
    'principle', 'Aipify helps leaders see risks before they become expensive.',
    'query', p_query,
    'overall_risk', public._risk534_overall_score(v_org_id),
    'critical_risks', coalesce((
      select jsonb_agg(jsonb_build_object('title', title, 'risk_control_status', risk_control_status))
      from (select title, risk_control_status from public.organization_governance_risks where organization_id = v_org_id and risk_control_status in ('critical', 'uncontrolled') limit 10) x
    ), '[]'::jsonb),
    'top_vendor_risks', coalesce((
      select jsonb_agg(jsonb_build_object('vendor_name', vendor_name, 'dependency_level', dependency_level))
      from (select vendor_name, dependency_level from public.organization_risk_operations_vendor_dependencies where organization_id = v_org_id order by risk_score desc nulls last limit 10) x
    ), '[]'::jsonb),
    'continuity_gaps', coalesce((
      select jsonb_agg(jsonb_build_object('title', title))
      from (select title from public.organization_risk_operations_continuity_plans where organization_id = v_org_id and status <> 'active' limit 10) x
    ), '[]'::jsonb),
    'companion_prompts', jsonb_build_array(
      'Show critical risks.',
      'Which vendors represent the largest risk?',
      'Show continuity gaps.',
      'What would happen if Vendor X fails?',
      'Generate executive risk report.',
      'Show risk trends.'
    ),
    'routes', jsonb_build_object(
      'risk', '/app/risk',
      'register', '/app/risk/register',
      'business_continuity', '/app/risk/business-continuity',
      'governance', '/app/governance'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

create or replace function public.get_my_risk_operations_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('risk.view');
  v_org_id := public._risk534_org();

  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('risk.manage', v_org_id),
    'overall_risk_score', (public._risk534_overall_score(v_org_id)->>'overall_risk_score')::int,
    'critical_risks', (select count(*) from public.organization_governance_risks where organization_id = v_org_id and risk_control_status in ('critical', 'uncontrolled')),
    'open_incidents', (select count(*) from public.organization_risk_operations_incidents where organization_id = v_org_id and status <> 'closed'),
    'overdue_mitigations', (select count(*) from public.organization_risk_operations_mitigation_plans where organization_id = v_org_id and due_date < current_date and status not in ('closed', 'verified')),
    'routes', jsonb_build_object(
      'risk', '/app/risk',
      'register', '/app/risk/register',
      'business_continuity', '/app/risk/business-continuity',
      'mobile_ready', true
    )
  );
exception when others then
  return jsonb_build_object('found', true, 'routes', jsonb_build_object('risk', '/app/risk'));
end; $$;

do $$ begin
  perform public._mre501_seed_module(
    'risk_operations', 'Risk & Business Continuity', 'risk', 'operations',
    'Risk center — register, assessments, mitigation, continuity, dependencies, and executive risk.',
    'business', null, 'operations', '/app/risk', 'licensed', 11
  );
exception when others then null;
end $$;

insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
values
  ('risk_operations', 'risk.view', 'view', 'Risk — view register, assessments, continuity, and dependencies'),
  ('risk_operations', 'risk.manage', 'manage', 'Risk — manage risks, mitigations, and continuity plans')
on conflict do nothing;

grant execute on function public._risk534_compute_score(text, text) to authenticated;
grant execute on function public._risk534_risk_json(public.organization_governance_risks) to authenticated;
grant execute on function public.get_risk_operations_center(text) to authenticated;
grant execute on function public.perform_risk_operations_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_risk_operations_context(text) to authenticated;
grant execute on function public.get_my_risk_operations_summary() to authenticated;
