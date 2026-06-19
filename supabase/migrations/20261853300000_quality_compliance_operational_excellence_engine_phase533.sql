-- Phase 533 — Quality, Compliance & Operational Excellence Engine
-- What is not measured cannot be improved.
-- Extends organizational operations layer. Coexists with Quality Guardian (/app/quality).

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_quality_operations_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  companion_quality_context_enabled boolean not null default true,
  knowledge_integration_enabled boolean not null default true,
  people_training_integration_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_quality_operations_settings enable row level security;
revoke all on public.organization_quality_operations_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Standards
-- ---------------------------------------------------------------------------
create table if not exists public.organization_quality_operations_standards (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  standard_number text,
  title text not null,
  description text not null default '',
  department_id uuid references public.organization_departments (id) on delete set null,
  owner_user_id uuid references public.users (id) on delete set null,
  version_number integer not null default 1,
  status text not null default 'draft' check (
    status in ('draft', 'active', 'review_required', 'retired')
  ),
  review_date date,
  business_pack_key text,
  domain_id uuid references public.organization_domains (id) on delete set null,
  related_documents jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, standard_number)
);

create index if not exists organization_quality_operations_standards_org_idx
  on public.organization_quality_operations_standards (organization_id, status);

alter table public.organization_quality_operations_standards enable row level security;
revoke all on public.organization_quality_operations_standards from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Compliance items
-- ---------------------------------------------------------------------------
create table if not exists public.organization_quality_operations_compliance_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  item_number text,
  title text not null,
  description text not null default '',
  compliance_type text not null default 'policy' check (
    compliance_type in (
      'policy', 'requirement', 'certification', 'regulation',
      'internal_rule', 'external_rule'
    )
  ),
  status text not null default 'compliant' check (
    status in ('compliant', 'needs_review', 'non_compliant', 'restricted')
  ),
  department_id uuid references public.organization_departments (id) on delete set null,
  owner_user_id uuid references public.users (id) on delete set null,
  business_pack_key text,
  domain_id uuid references public.organization_domains (id) on delete set null,
  knowledge_ref_id uuid,
  review_date date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, item_number)
);

create index if not exists organization_quality_operations_compliance_org_idx
  on public.organization_quality_operations_compliance_items (organization_id, status);

alter table public.organization_quality_operations_compliance_items enable row level security;
revoke all on public.organization_quality_operations_compliance_items from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Audits & findings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_quality_operations_audits (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  audit_number text,
  title text not null,
  audit_type text not null default 'internal' check (
    audit_type in (
      'internal', 'external', 'department', 'business_pack',
      'operational', 'security', 'financial'
    )
  ),
  status text not null default 'scheduled' check (
    status in ('scheduled', 'in_progress', 'findings_recorded', 'verification', 'closed', 'cancelled')
  ),
  department_id uuid references public.organization_departments (id) on delete set null,
  owner_user_id uuid references public.users (id) on delete set null,
  business_pack_key text,
  domain_id uuid references public.organization_domains (id) on delete set null,
  scheduled_date date,
  completed_at timestamptz,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, audit_number)
);

create index if not exists organization_quality_operations_audits_org_idx
  on public.organization_quality_operations_audits (organization_id, status);

alter table public.organization_quality_operations_audits enable row level security;
revoke all on public.organization_quality_operations_audits from authenticated, anon;

create table if not exists public.organization_quality_operations_audit_findings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  audit_id uuid not null references public.organization_quality_operations_audits (id) on delete cascade,
  finding_number text,
  severity text not null default 'medium' check (
    severity in ('low', 'medium', 'high', 'critical')
  ),
  title text not null,
  description text not null default '',
  root_cause text not null default '',
  department_id uuid references public.organization_departments (id) on delete set null,
  owner_user_id uuid references public.users (id) on delete set null,
  due_date date,
  status text not null default 'open' check (
    status in ('open', 'in_progress', 'resolved', 'verified', 'closed')
  ),
  evidence jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_quality_operations_findings_audit_idx
  on public.organization_quality_operations_audit_findings (audit_id, status);

alter table public.organization_quality_operations_audit_findings enable row level security;
revoke all on public.organization_quality_operations_audit_findings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Incidents & corrective actions
-- ---------------------------------------------------------------------------
create table if not exists public.organization_quality_operations_incidents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  incident_number text,
  category text not null default 'process_failure' check (
    category in (
      'customer_complaint', 'service_failure', 'inventory_issue', 'security_breach',
      'process_failure', 'compliance_violation', 'other'
    )
  ),
  title text not null,
  description text not null default '',
  reported_by uuid references public.users (id) on delete set null,
  department_id uuid references public.organization_departments (id) on delete set null,
  impact text not null default 'medium' check (impact in ('low', 'medium', 'high', 'critical')),
  root_cause text not null default '',
  resolution text not null default '',
  status text not null default 'reported' check (
    status in ('reported', 'investigating', 'resolved', 'closed')
  ),
  business_pack_key text,
  domain_id uuid references public.organization_domains (id) on delete set null,
  attachments jsonb not null default '[]'::jsonb,
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, incident_number)
);

create index if not exists organization_quality_operations_incidents_org_idx
  on public.organization_quality_operations_incidents (organization_id, status);

alter table public.organization_quality_operations_incidents enable row level security;
revoke all on public.organization_quality_operations_incidents from authenticated, anon;

create table if not exists public.organization_quality_operations_corrective_actions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  action_number text,
  title text not null,
  description text not null default '',
  incident_id uuid references public.organization_quality_operations_incidents (id) on delete set null,
  audit_finding_id uuid references public.organization_quality_operations_audit_findings (id) on delete set null,
  owner_user_id uuid references public.users (id) on delete set null,
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  due_date date,
  status text not null default 'open' check (
    status in ('open', 'in_progress', 'implemented', 'verified', 'closed')
  ),
  verification_notes text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, action_number)
);

create index if not exists organization_quality_operations_corrective_org_idx
  on public.organization_quality_operations_corrective_actions (organization_id, status);

alter table public.organization_quality_operations_corrective_actions enable row level security;
revoke all on public.organization_quality_operations_corrective_actions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Continuous improvements
-- ---------------------------------------------------------------------------
create table if not exists public.organization_quality_operations_improvements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  improvement_number text,
  title text not null,
  description text not null default '',
  category text not null default 'process_improvement' check (
    category in (
      'cost_savings', 'process_improvement', 'automation', 'customer_experience',
      'operational_efficiency', 'companion_suggestion'
    )
  ),
  submitted_by uuid references public.users (id) on delete set null,
  department_id uuid references public.organization_departments (id) on delete set null,
  status text not null default 'submitted' check (
    status in ('submitted', 'review', 'approved', 'implementation', 'measurement', 'completed', 'rejected')
  ),
  business_pack_key text,
  expected_value text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, improvement_number)
);

create index if not exists organization_quality_operations_improvements_org_idx
  on public.organization_quality_operations_improvements (organization_id, status);

alter table public.organization_quality_operations_improvements enable row level security;
revoke all on public.organization_quality_operations_improvements from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.organization_quality_operations_audit_logs (
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

create index if not exists organization_quality_operations_audit_logs_org_idx
  on public.organization_quality_operations_audit_logs (organization_id, created_at desc);

alter table public.organization_quality_operations_audit_logs enable row level security;
revoke all on public.organization_quality_operations_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Helpers (permissions: quality.view / quality.manage from Quality Guardian A.13)
-- ---------------------------------------------------------------------------
create or replace function public._qops533_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_require_organization();
$$;

create or replace function public._qops533_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_quality_operations_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._qops533_log(
  p_org_id uuid, p_action text, p_summary text,
  p_entity_type text default null, p_entity_id uuid default null, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_quality_operations_audit_logs (
    organization_id, actor_user_id, action, summary, entity_type, entity_id, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, p_entity_type, p_entity_id, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._qops533_next_number(p_org_id uuid, p_prefix text, p_table regclass)
returns text language plpgsql security definer set search_path = public as $$
declare v_seq int;
begin
  execute format('select count(*) + 1 from %s where organization_id = $1', p_table) into v_seq using p_org_id;
  return p_prefix || '-' || lpad(v_seq::text, 5, '0');
end; $$;

create or replace function public._qops533_compute_quality_score(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_score int := 100;
  v_status text := 'excellent';
  v_open_audits int;
  v_critical_findings int;
  v_non_compliant int;
  v_open_incidents int;
  v_overdue_actions int;
begin
  select count(*) into v_open_audits
  from public.organization_quality_operations_audits
  where organization_id = p_org_id and status not in ('closed', 'cancelled');

  select count(*) into v_critical_findings
  from public.organization_quality_operations_audit_findings f
  join public.organization_quality_operations_audits a on a.id = f.audit_id
  where f.organization_id = p_org_id and f.severity = 'critical' and f.status not in ('closed', 'verified');

  select count(*) into v_non_compliant
  from public.organization_quality_operations_compliance_items
  where organization_id = p_org_id and status in ('non_compliant', 'restricted');

  select count(*) into v_open_incidents
  from public.organization_quality_operations_incidents
  where organization_id = p_org_id and status not in ('closed', 'resolved');

  select count(*) into v_overdue_actions
  from public.organization_quality_operations_corrective_actions
  where organization_id = p_org_id and status not in ('closed', 'verified')
    and due_date is not null and due_date < current_date;

  v_score := v_score
    - least(15, v_open_audits * 2)
    - least(25, v_critical_findings * 8)
    - least(20, v_non_compliant * 5)
    - least(15, v_open_incidents * 3)
    - least(15, v_overdue_actions * 4);

  v_score := greatest(0, least(100, v_score));
  v_status := case
    when v_score >= 80 then 'excellent'
    when v_score >= 55 then 'needs_attention'
    else 'high_risk'
  end;

  return jsonb_build_object(
    'quality_score', v_score,
    'quality_status', v_status,
    'open_audits', v_open_audits,
    'critical_findings', v_critical_findings,
    'non_compliant_items', v_non_compliant,
    'open_incidents', v_open_incidents,
    'overdue_corrective_actions', v_overdue_actions
  );
exception when others then
  return jsonb_build_object('quality_score', 75, 'quality_status', 'needs_attention');
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Quality Operations Center
-- ---------------------------------------------------------------------------
create or replace function public.get_quality_operations_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('quality.view');
  v_org_id := public._qops533_org();
  perform public._qops533_ensure_settings(v_org_id);
  perform public._qops533_log(v_org_id, 'center_view', 'Quality Center viewed', null, null,
    jsonb_build_object('section', p_section));

  return jsonb_build_object(
    'found', true,
    'principle', 'What is not measured cannot be improved. Quality is an organizational responsibility.',
    'philosophy', 'Quality creates trust. Compliance creates stability. Improvement creates growth.',
    'quality_score', public._qops533_compute_quality_score(v_org_id),
    'overview', jsonb_build_object(
      'quality_score', (public._qops533_compute_quality_score(v_org_id)->>'quality_score')::int,
      'quality_status', public._qops533_compute_quality_score(v_org_id)->>'quality_status',
      'active_standards', (select count(*) from public.organization_quality_operations_standards where organization_id = v_org_id and status = 'active'),
      'standards_review_due', (select count(*) from public.organization_quality_operations_standards where organization_id = v_org_id and status = 'review_required'),
      'open_audits', (select count(*) from public.organization_quality_operations_audits where organization_id = v_org_id and status not in ('closed', 'cancelled')),
      'compliance_risks', (select count(*) from public.organization_quality_operations_compliance_items where organization_id = v_org_id and status in ('needs_review', 'non_compliant', 'restricted')),
      'open_incidents', (select count(*) from public.organization_quality_operations_incidents where organization_id = v_org_id and status not in ('closed', 'resolved')),
      'critical_findings', (select count(*) from public.organization_quality_operations_audit_findings where organization_id = v_org_id and severity = 'critical' and status not in ('closed', 'verified')),
      'open_corrective_actions', (select count(*) from public.organization_quality_operations_corrective_actions where organization_id = v_org_id and status not in ('closed', 'verified')),
      'overdue_corrective_actions', (select count(*) from public.organization_quality_operations_corrective_actions where organization_id = v_org_id and status not in ('closed', 'verified') and due_date < current_date),
      'improvement_pipeline', (select count(*) from public.organization_quality_operations_improvements where organization_id = v_org_id and status not in ('completed', 'rejected'))
    ),
    'standards', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'standard_number', s.standard_number, 'title', s.title,
        'description', s.description, 'status', s.status, 'version_number', s.version_number,
        'review_date', s.review_date, 'business_pack_key', s.business_pack_key
      ) order by s.updated_at desc)
      from (select * from public.organization_quality_operations_standards where organization_id = v_org_id order by updated_at desc limit 50) s
    ), '[]'::jsonb),
    'compliance_items', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'item_number', c.item_number, 'title', c.title,
        'compliance_type', c.compliance_type, 'status', c.status, 'review_date', c.review_date
      ) order by c.updated_at desc)
      from (select * from public.organization_quality_operations_compliance_items where organization_id = v_org_id order by updated_at desc limit 50) c
    ), '[]'::jsonb),
    'audits', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'audit_number', a.audit_number, 'title', a.title,
        'audit_type', a.audit_type, 'status', a.status, 'scheduled_date', a.scheduled_date,
        'findings_count', (select count(*) from public.organization_quality_operations_audit_findings f where f.audit_id = a.id)
      ) order by a.updated_at desc)
      from (select * from public.organization_quality_operations_audits where organization_id = v_org_id order by updated_at desc limit 40) a
    ), '[]'::jsonb),
    'findings', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', f.id, 'finding_number', f.finding_number, 'title', f.title,
        'severity', f.severity, 'status', f.status, 'due_date', f.due_date, 'audit_id', f.audit_id
      ) order by f.updated_at desc)
      from (select * from public.organization_quality_operations_audit_findings where organization_id = v_org_id order by updated_at desc limit 40) f
    ), '[]'::jsonb),
    'incidents', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'incident_number', i.incident_number, 'title', i.title,
        'category', i.category, 'impact', i.impact, 'status', i.status, 'occurred_at', i.occurred_at
      ) order by i.updated_at desc)
      from (select * from public.organization_quality_operations_incidents where organization_id = v_org_id order by updated_at desc limit 40) i
    ), '[]'::jsonb),
    'corrective_actions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', ca.id, 'action_number', ca.action_number, 'title', ca.title,
        'priority', ca.priority, 'status', ca.status, 'due_date', ca.due_date,
        'incident_id', ca.incident_id, 'audit_finding_id', ca.audit_finding_id
      ) order by ca.updated_at desc)
      from (select * from public.organization_quality_operations_corrective_actions where organization_id = v_org_id order by updated_at desc limit 40) ca
    ), '[]'::jsonb),
    'improvements', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', im.id, 'improvement_number', im.improvement_number, 'title', im.title,
        'category', im.category, 'status', im.status, 'expected_value', im.expected_value
      ) order by im.updated_at desc)
      from (select * from public.organization_quality_operations_improvements where organization_id = v_org_id order by updated_at desc limit 40) im
    ), '[]'::jsonb),
    'reports', jsonb_build_object(
      'audit_completion_rate', coalesce((
        select round(
          (count(*) filter (where status = 'closed')::numeric / greatest(count(*), 1)) * 100, 1
        ) from public.organization_quality_operations_audits where organization_id = v_org_id
      ), 0),
      'incident_trend_open', (select count(*) from public.organization_quality_operations_incidents where organization_id = v_org_id and status not in ('closed')),
      'improvements_completed', (select count(*) from public.organization_quality_operations_improvements where organization_id = v_org_id and status = 'completed'),
      'department_risk_note', 'Department quality scores derive from audits, incidents, and compliance by department.'
    ),
    'integrations', jsonb_build_object(
      'knowledge_center', '/app/knowledge',
      'people_engine', '/app/people',
      'governance', '/app/governance',
      'training_note', 'Compliance gaps can trigger training assignments via People Engine.'
    ),
    'companion_insights', jsonb_build_object(
      'open_audits', coalesce((
        select jsonb_agg(jsonb_build_object('title', title, 'status', status))
        from (select title, status from public.organization_quality_operations_audits where organization_id = v_org_id and status not in ('closed', 'cancelled') limit 5) x
      ), '[]'::jsonb),
      'compliance_risks', coalesce((
        select jsonb_agg(jsonb_build_object('title', title, 'status', status))
        from (select title, status from public.organization_quality_operations_compliance_items where organization_id = v_org_id and status in ('needs_review', 'non_compliant') limit 5) x
      ), '[]'::jsonb),
      'overdue_corrective_actions', coalesce((
        select jsonb_agg(jsonb_build_object('title', title, 'due_date', due_date))
        from (select title, due_date from public.organization_quality_operations_corrective_actions where organization_id = v_org_id and status not in ('closed', 'verified') and due_date < current_date limit 5) x
      ), '[]'::jsonb),
      'improvement_opportunities', coalesce((
        select jsonb_agg(jsonb_build_object('title', title, 'category', category))
        from (select title, category from public.organization_quality_operations_improvements where organization_id = v_org_id and status in ('submitted', 'review') limit 5) x
      ), '[]'::jsonb)
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('action', a.action, 'summary', a.summary, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_quality_operations_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'sections', jsonb_build_array(
      'overview', 'standards', 'audits', 'compliance', 'incidents',
      'corrective_actions', 'improvements', 'reports'
    ),
    'routes', jsonb_build_object(
      'quality', '/app/quality-operations',
      'standards', '/app/quality-operations/standards',
      'compliance', '/app/quality-operations/compliance',
      'audits', '/app/quality-operations/audits',
      'incidents', '/app/quality-operations/incidents',
      'improvements', '/app/quality-operations/improvements',
      'quality_guardian', '/app/quality',
      'knowledge', '/app/knowledge',
      'people', '/app/people'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_quality_operations_action(
  p_action_type text, p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_id uuid;
  v_row record;
begin
  v_org_id := public._qops533_org();
  perform public._qops533_ensure_settings(v_org_id);
  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);

  if p_action_type in (
    'create_standard', 'activate_standard', 'create_compliance_item', 'update_compliance_status',
    'create_audit', 'start_audit', 'record_finding', 'close_audit',
    'report_incident', 'resolve_incident',
    'create_corrective_action', 'complete_corrective_action', 'verify_corrective_action',
    'submit_improvement', 'approve_improvement', 'refresh_quality_score'
  ) then
    perform public._irp_require_permission('quality.manage');
  else
    perform public._irp_require_permission('quality.view');
  end if;

  if p_action_type = 'create_standard' then
    insert into public.organization_quality_operations_standards (
      organization_id, standard_number, title, description, owner_user_id, status
    ) values (
      v_org_id,
      public._qops533_next_number(v_org_id, 'STD', 'public.organization_quality_operations_standards'::regclass),
      coalesce(p_payload->>'title', 'Untitled standard'),
      coalesce(p_payload->>'description', ''),
      v_user_id,
      'draft'
    ) returning id into v_id;
    perform public._qops533_log(v_org_id, 'standard_created', 'Standard created: ' || coalesce(p_payload->>'title', ''), 'standard', v_id);
    return jsonb_build_object('ok', true, 'standard_id', v_id);

  elsif p_action_type = 'activate_standard' then
    update public.organization_quality_operations_standards
    set status = 'active', updated_at = now()
    where id = (p_payload->>'standard_id')::uuid and organization_id = v_org_id
    returning id into v_id;
    perform public._qops533_log(v_org_id, 'standard_activated', 'Standard activated', 'standard', v_id);
    return jsonb_build_object('ok', v_id is not null);

  elsif p_action_type = 'create_compliance_item' then
    insert into public.organization_quality_operations_compliance_items (
      organization_id, item_number, title, compliance_type, status, owner_user_id
    ) values (
      v_org_id,
      public._qops533_next_number(v_org_id, 'CMP', 'public.organization_quality_operations_compliance_items'::regclass),
      coalesce(p_payload->>'title', 'Compliance item'),
      coalesce(p_payload->>'compliance_type', 'policy'),
      coalesce(p_payload->>'status', 'compliant'),
      v_user_id
    ) returning id into v_id;
    perform public._qops533_log(v_org_id, 'compliance_updated', 'Compliance item created', 'compliance', v_id);
    return jsonb_build_object('ok', true, 'compliance_id', v_id);

  elsif p_action_type = 'update_compliance_status' then
    update public.organization_quality_operations_compliance_items
    set status = coalesce(p_payload->>'status', status), updated_at = now()
    where id = (p_payload->>'compliance_id')::uuid and organization_id = v_org_id
    returning id into v_id;
    perform public._qops533_log(v_org_id, 'compliance_updated', 'Compliance status updated', 'compliance', v_id);
    return jsonb_build_object('ok', v_id is not null);

  elsif p_action_type = 'create_audit' then
    insert into public.organization_quality_operations_audits (
      organization_id, audit_number, title, audit_type, status, owner_user_id, scheduled_date
    ) values (
      v_org_id,
      public._qops533_next_number(v_org_id, 'AUD', 'public.organization_quality_operations_audits'::regclass),
      coalesce(p_payload->>'title', 'Audit'),
      coalesce(p_payload->>'audit_type', 'internal'),
      'scheduled',
      v_user_id,
      (p_payload->>'scheduled_date')::date
    ) returning id into v_id;
    perform public._qops533_log(v_org_id, 'audit_started', 'Audit created', 'audit', v_id);
    return jsonb_build_object('ok', true, 'audit_id', v_id);

  elsif p_action_type = 'start_audit' then
    update public.organization_quality_operations_audits
    set status = 'in_progress', updated_at = now()
    where id = (p_payload->>'audit_id')::uuid and organization_id = v_org_id
    returning id into v_id;
    perform public._qops533_log(v_org_id, 'audit_started', 'Audit started', 'audit', v_id);
    return jsonb_build_object('ok', v_id is not null);

  elsif p_action_type = 'record_finding' then
    insert into public.organization_quality_operations_audit_findings (
      organization_id, audit_id, finding_number, title, description, severity, owner_user_id, due_date
    ) values (
      v_org_id,
      (p_payload->>'audit_id')::uuid,
      public._qops533_next_number(v_org_id, 'FND', 'public.organization_quality_operations_audit_findings'::regclass),
      coalesce(p_payload->>'title', 'Finding'),
      coalesce(p_payload->>'description', ''),
      coalesce(p_payload->>'severity', 'medium'),
      v_user_id,
      (p_payload->>'due_date')::date
    ) returning id into v_id;
    update public.organization_quality_operations_audits
    set status = 'findings_recorded', updated_at = now()
    where id = (p_payload->>'audit_id')::uuid and organization_id = v_org_id;
    perform public._qops533_log(v_org_id, 'finding_recorded', 'Audit finding recorded', 'finding', v_id);
    return jsonb_build_object('ok', true, 'finding_id', v_id);

  elsif p_action_type = 'close_audit' then
    update public.organization_quality_operations_audits
    set status = 'closed', completed_at = now(), updated_at = now()
    where id = (p_payload->>'audit_id')::uuid and organization_id = v_org_id
    returning id into v_id;
    perform public._qops533_log(v_org_id, 'audit_completed', 'Audit closed', 'audit', v_id);
    return jsonb_build_object('ok', v_id is not null);

  elsif p_action_type = 'report_incident' then
    insert into public.organization_quality_operations_incidents (
      organization_id, incident_number, title, description, category, impact, reported_by, status
    ) values (
      v_org_id,
      public._qops533_next_number(v_org_id, 'INC', 'public.organization_quality_operations_incidents'::regclass),
      coalesce(p_payload->>'title', 'Incident'),
      coalesce(p_payload->>'description', ''),
      coalesce(p_payload->>'category', 'process_failure'),
      coalesce(p_payload->>'impact', 'medium'),
      v_user_id,
      'reported'
    ) returning id into v_id;
    perform public._qops533_log(v_org_id, 'incident_reported', 'Incident reported', 'incident', v_id);
    return jsonb_build_object('ok', true, 'incident_id', v_id);

  elsif p_action_type = 'resolve_incident' then
    update public.organization_quality_operations_incidents
    set status = 'resolved',
        resolution = coalesce(p_payload->>'resolution', resolution),
        root_cause = coalesce(p_payload->>'root_cause', root_cause),
        updated_at = now()
    where id = (p_payload->>'incident_id')::uuid and organization_id = v_org_id
    returning id into v_id;
    perform public._qops533_log(v_org_id, 'incident_resolved', 'Incident resolved', 'incident', v_id);
    return jsonb_build_object('ok', v_id is not null);

  elsif p_action_type = 'create_corrective_action' then
    insert into public.organization_quality_operations_corrective_actions (
      organization_id, action_number, title, description, incident_id, audit_finding_id, owner_user_id, priority, due_date
    ) values (
      v_org_id,
      public._qops533_next_number(v_org_id, 'CA', 'public.organization_quality_operations_corrective_actions'::regclass),
      coalesce(p_payload->>'title', 'Corrective action'),
      coalesce(p_payload->>'description', ''),
      (p_payload->>'incident_id')::uuid,
      (p_payload->>'audit_finding_id')::uuid,
      v_user_id,
      coalesce(p_payload->>'priority', 'normal'),
      (p_payload->>'due_date')::date
    ) returning id into v_id;
    perform public._qops533_log(v_org_id, 'corrective_action_created', 'Corrective action created', 'corrective_action', v_id);
    return jsonb_build_object('ok', true, 'action_id', v_id);

  elsif p_action_type = 'complete_corrective_action' then
    update public.organization_quality_operations_corrective_actions
    set status = 'implemented', updated_at = now()
    where id = (p_payload->>'action_id')::uuid and organization_id = v_org_id
    returning id into v_id;
    perform public._qops533_log(v_org_id, 'corrective_action_updated', 'Corrective action implemented', 'corrective_action', v_id);
    return jsonb_build_object('ok', v_id is not null);

  elsif p_action_type = 'verify_corrective_action' then
    update public.organization_quality_operations_corrective_actions
    set status = 'verified',
        verification_notes = coalesce(p_payload->>'verification_notes', verification_notes),
        updated_at = now()
    where id = (p_payload->>'action_id')::uuid and organization_id = v_org_id
    returning id into v_id;
    perform public._qops533_log(v_org_id, 'corrective_action_verified', 'Corrective action verified', 'corrective_action', v_id);
    return jsonb_build_object('ok', v_id is not null);

  elsif p_action_type = 'submit_improvement' then
    insert into public.organization_quality_operations_improvements (
      organization_id, improvement_number, title, description, category, submitted_by, status
    ) values (
      v_org_id,
      public._qops533_next_number(v_org_id, 'IMP', 'public.organization_quality_operations_improvements'::regclass),
      coalesce(p_payload->>'title', 'Improvement idea'),
      coalesce(p_payload->>'description', ''),
      coalesce(p_payload->>'category', 'process_improvement'),
      v_user_id,
      'submitted'
    ) returning id into v_id;
    perform public._qops533_log(v_org_id, 'improvement_submitted', 'Improvement submitted', 'improvement', v_id);
    return jsonb_build_object('ok', true, 'improvement_id', v_id);

  elsif p_action_type = 'approve_improvement' then
    update public.organization_quality_operations_improvements
    set status = 'approved', updated_at = now()
    where id = (p_payload->>'improvement_id')::uuid and organization_id = v_org_id
    returning id into v_id;
    perform public._qops533_log(v_org_id, 'improvement_approved', 'Improvement approved', 'improvement', v_id);
    return jsonb_build_object('ok', v_id is not null);

  elsif p_action_type = 'refresh_quality_score' then
    return jsonb_build_object('ok', true, 'quality_score', public._qops533_compute_quality_score(v_org_id));

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_quality_operations_context(p_query text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('quality.view');
  v_org_id := public._qops533_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  return jsonb_build_object(
    'found', true,
    'principle', 'Quality creates trust. Compliance creates stability. Improvement creates growth.',
    'query', p_query,
    'quality_score', public._qops533_compute_quality_score(v_org_id),
    'open_audits', (select count(*) from public.organization_quality_operations_audits where organization_id = v_org_id and status not in ('closed', 'cancelled')),
    'compliance_risks', coalesce((
      select jsonb_agg(jsonb_build_object('title', title, 'status', status))
      from (select title, status from public.organization_quality_operations_compliance_items where organization_id = v_org_id and status in ('needs_review', 'non_compliant') limit 10) x
    ), '[]'::jsonb),
    'overdue_corrective_actions', coalesce((
      select jsonb_agg(jsonb_build_object('title', title, 'due_date', due_date))
      from (select title, due_date from public.organization_quality_operations_corrective_actions where organization_id = v_org_id and status not in ('closed', 'verified') and due_date < current_date limit 10) x
    ), '[]'::jsonb),
    'companion_prompts', jsonb_build_array(
      'Show open audits.',
      'Which departments have compliance risks?',
      'Show overdue corrective actions.',
      'Generate quality report.',
      'Show improvement opportunities.'
    ),
    'routes', jsonb_build_object(
      'quality', '/app/quality-operations',
      'standards', '/app/quality-operations/standards',
      'audits', '/app/quality-operations/audits',
      'incidents', '/app/quality-operations/incidents',
      'improvements', '/app/quality-operations/improvements'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

create or replace function public.get_my_quality_operations_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('quality.view');
  v_org_id := public._qops533_org();

  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('quality.manage', v_org_id),
    'quality_score', (public._qops533_compute_quality_score(v_org_id)->>'quality_score')::int,
    'open_audits', (select count(*) from public.organization_quality_operations_audits where organization_id = v_org_id and status not in ('closed', 'cancelled')),
    'open_incidents', (select count(*) from public.organization_quality_operations_incidents where organization_id = v_org_id and status not in ('closed', 'resolved')),
    'pending_improvements', (select count(*) from public.organization_quality_operations_improvements where organization_id = v_org_id and status in ('submitted', 'review')),
    'routes', jsonb_build_object(
      'quality', '/app/quality-operations',
      'standards', '/app/quality-operations/standards',
      'audits', '/app/quality-operations/audits',
      'incidents', '/app/quality-operations/incidents',
      'improvements', '/app/quality-operations/improvements',
      'mobile_ready', true
    )
  );
exception when others then
  return jsonb_build_object('found', true, 'routes', jsonb_build_object('quality', '/app/quality-operations'));
end; $$;

do $$ begin
  perform public._mre501_seed_module(
    'quality_operations', 'Quality & Compliance Operations', 'quality', 'operations',
    'Quality center — standards, audits, compliance, incidents, corrective actions, and continuous improvement.',
    'business', null, 'operations', '/app/quality-operations', 'licensed', 10
  );
exception when others then null;
end $$;

grant execute on function public._qops533_compute_quality_score(uuid) to authenticated;
grant execute on function public.get_quality_operations_center(text) to authenticated;
grant execute on function public.perform_quality_operations_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_quality_operations_context(text) to authenticated;
grant execute on function public.get_my_quality_operations_summary() to authenticated;
