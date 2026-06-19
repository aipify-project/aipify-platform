-- Phase 524 — Forms, Data Collection & Digital Workflow Engine
-- Forms collect information. Workflows create action. Approvals create accountability.
-- Integrates: Tasks (506), Approvals (30), Domains (505A), Business Packs, Procurement (522)

-- ---------------------------------------------------------------------------
-- 1. Settings & templates
-- ---------------------------------------------------------------------------
create table if not exists public.organization_forms_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  enable_public_forms boolean not null default false,
  enable_offline_collection boolean not null default true,
  enable_qr_barcode boolean not null default true,
  enable_digital_signatures boolean not null default true,
  companion_forms_context_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_forms_settings enable row level security;
revoke all on public.organization_forms_settings from authenticated, anon;

create table if not exists public.organization_form_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  template_key text not null,
  name text not null,
  description text not null default '',
  template_type text not null default 'general' check (
    template_type in (
      'approval', 'inspection', 'customer', 'survey', 'checklist', 'general'
    )
  ),
  business_pack_key text,
  fields_schema jsonb not null default '[]'::jsonb,
  workflow_config jsonb not null default '{}'::jsonb,
  is_system boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, template_key)
);

alter table public.organization_form_templates enable row level security;
revoke all on public.organization_form_templates from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Forms
-- ---------------------------------------------------------------------------
create table if not exists public.organization_forms (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  form_number text,
  name text not null,
  description text not null default '',
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  owner_user_id uuid references public.users (id) on delete set null,
  template_id uuid references public.organization_form_templates (id) on delete set null,
  form_type text not null default 'general' check (
    form_type in ('approval', 'inspection', 'customer', 'survey', 'checklist', 'general')
  ),
  status text not null default 'draft' check (
    status in ('draft', 'active', 'review_required', 'restricted', 'archived')
  ),
  version int not null default 1,
  is_public boolean not null default false,
  business_pack_key text,
  fields_schema jsonb not null default '[]'::jsonb,
  workflow_config jsonb not null default '{}'::jsonb,
  permissions jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, form_number)
);

create index if not exists organization_forms_org_idx
  on public.organization_forms (organization_id, status, updated_at desc);

alter table public.organization_forms enable row level security;
revoke all on public.organization_forms from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Submissions, approvals, signatures, media
-- ---------------------------------------------------------------------------
create table if not exists public.organization_form_submissions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  submission_number text,
  form_id uuid not null references public.organization_forms (id) on delete cascade,
  submitter_user_id uuid references public.users (id) on delete set null,
  department_id uuid references public.organization_departments (id) on delete set null,
  submission_data jsonb not null default '{}'::jsonb,
  location_data jsonb,
  approval_status text not null default 'none' check (
    approval_status in (
      'none', 'pending', 'pending_manager', 'pending_finance',
      'approved', 'rejected', 'completed'
    )
  ),
  status text not null default 'submitted' check (
    status in ('draft', 'submitted', 'in_review', 'approved', 'rejected', 'completed')
  ),
  scan_reference text,
  metadata jsonb not null default '{}'::jsonb,
  submitted_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, submission_number)
);

create index if not exists organization_form_submissions_org_idx
  on public.organization_form_submissions (organization_id, status, updated_at desc);

alter table public.organization_form_submissions enable row level security;
revoke all on public.organization_form_submissions from authenticated, anon;

create table if not exists public.organization_form_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  submission_id uuid not null references public.organization_form_submissions (id) on delete cascade,
  approval_level text not null check (
    approval_level in ('manager', 'finance', 'executive', 'customer', 'compliance')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'skipped')
  ),
  approver_user_id uuid references public.users (id) on delete set null,
  notes text not null default '',
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists organization_form_approvals_sub_idx
  on public.organization_form_approvals (submission_id, approval_level);

alter table public.organization_form_approvals enable row level security;
revoke all on public.organization_form_approvals from authenticated, anon;

create table if not exists public.organization_form_signatures (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  submission_id uuid not null references public.organization_form_submissions (id) on delete cascade,
  signer_user_id uuid references public.users (id) on delete set null,
  signer_role text not null default 'employee' check (
    signer_role in ('employee', 'manager', 'customer', 'witness')
  ),
  signature_type text not null default 'drawn' check (
    signature_type in ('drawn', 'typed', 'verified')
  ),
  signature_data text not null default '',
  verified boolean not null default false,
  signed_at timestamptz not null default now()
);

create index if not exists organization_form_signatures_sub_idx
  on public.organization_form_signatures (submission_id);

alter table public.organization_form_signatures enable row level security;
revoke all on public.organization_form_signatures from authenticated, anon;

create table if not exists public.organization_form_media (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  submission_id uuid not null references public.organization_form_submissions (id) on delete cascade,
  media_type text not null check (
    media_type in ('photo', 'video', 'document', 'attachment')
  ),
  file_name text not null default '',
  file_url text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  uploaded_by_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists organization_form_media_sub_idx
  on public.organization_form_media (submission_id);

alter table public.organization_form_media enable row level security;
revoke all on public.organization_form_media from authenticated, anon;

create table if not exists public.organization_form_workflow_triggers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  submission_id uuid not null references public.organization_form_submissions (id) on delete cascade,
  trigger_type text not null check (
    trigger_type in ('task', 'approval', 'notification', 'record_update', 'report')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'executed', 'failed', 'skipped')
  ),
  payload jsonb not null default '{}'::jsonb,
  executed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists organization_form_workflow_triggers_sub_idx
  on public.organization_form_workflow_triggers (submission_id);

alter table public.organization_form_workflow_triggers enable row level security;
revoke all on public.organization_form_workflow_triggers from authenticated, anon;

create table if not exists public.organization_forms_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  form_id uuid references public.organization_forms (id) on delete set null,
  submission_id uuid references public.organization_form_submissions (id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_forms_audit_logs_org_idx
  on public.organization_forms_audit_logs (organization_id, created_at desc);

alter table public.organization_forms_audit_logs enable row level security;
revoke all on public.organization_forms_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._frm524_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._frm524_log(
  p_org_id uuid,
  p_action text,
  p_summary text,
  p_form_id uuid default null,
  p_submission_id uuid default null,
  p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_forms_audit_logs (
    organization_id, actor_user_id, action, summary, form_id, submission_id, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, p_form_id, p_submission_id,
    coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._frm524_next_number(p_org_id uuid, p_prefix text, p_table text)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_n bigint;
begin
  execute format('select count(*) + 1 from public.%I where organization_id = $1', p_table)
  into v_n using p_org_id;
  return p_prefix || '-' || lpad(v_n::text, 5, '0');
end; $$;

create or replace function public._frm524_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_forms_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;

  insert into public.organization_form_templates (
    organization_id, template_key, name, description, template_type, is_system, fields_schema
  ) values
    (p_org_id, 'vacation_request', 'Vacation Request', 'Employee vacation approval form', 'approval', true,
      '[{"type":"date","key":"start_date","label":"Start Date"},{"type":"date","key":"end_date","label":"End Date"},{"type":"textarea","key":"reason","label":"Reason"}]'::jsonb),
    (p_org_id, 'expense_claim', 'Expense Claim', 'Expense reimbursement request', 'approval', true,
      '[{"type":"currency","key":"amount","label":"Amount"},{"type":"textarea","key":"description","label":"Description"},{"type":"file_upload","key":"receipt","label":"Receipt"}]'::jsonb),
    (p_org_id, 'equipment_request', 'Equipment Request', 'Request equipment or supplies', 'approval', true,
      '[{"type":"text","key":"item","label":"Item"},{"type":"number","key":"quantity","label":"Quantity"}]'::jsonb),
    (p_org_id, 'warehouse_inspection', 'Warehouse Inspection', 'Warehouse safety and compliance inspection', 'inspection', true,
      '[{"type":"checkbox","key":"safety_ok","label":"Safety compliant"},{"type":"photo_upload","key":"photos","label":"Photos"},{"type":"signature","key":"inspector_sign","label":"Inspector Signature"}]'::jsonb),
    (p_org_id, 'property_inspection', 'Property Inspection', 'Property condition inspection checklist', 'inspection', true,
      '[{"type":"photo_upload","key":"photos","label":"Photos"},{"type":"textarea","key":"notes","label":"Notes"},{"type":"location","key":"location","label":"Location"}]'::jsonb),
    (p_org_id, 'vehicle_inspection', 'Vehicle Inspection', 'Vehicle safety inspection form', 'inspection', true,
      '[{"type":"text","key":"vehicle_id","label":"Vehicle"},{"type":"qr_scan","key":"vehicle_qr","label":"Scan Vehicle"},{"type":"photo_upload","key":"photos","label":"Photos"}]'::jsonb),
    (p_org_id, 'incident_report', 'Incident Report', 'Workplace incident documentation', 'approval', true,
      '[{"type":"textarea","key":"description","label":"Description"},{"type":"photo_upload","key":"evidence","label":"Evidence"},{"type":"date","key":"incident_date","label":"Date"}]'::jsonb),
    (p_org_id, 'contact_form', 'Contact Form', 'Public customer contact form', 'customer', true,
      '[{"type":"text","key":"name","label":"Name"},{"type":"text","key":"email","label":"Email"},{"type":"textarea","key":"message","label":"Message"}]'::jsonb),
    (p_org_id, 'customer_satisfaction', 'Customer Satisfaction Survey', 'Customer feedback survey', 'survey', true,
      '[{"type":"radio","key":"rating","label":"Rating"},{"type":"textarea","key":"feedback","label":"Feedback"}]'::jsonb)
  on conflict (organization_id, template_key) do nothing;
end; $$;

create or replace function public._frm524_form_json(p_row public.organization_forms)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_row.id,
    'form_number', p_row.form_number,
    'name', p_row.name,
    'description', p_row.description,
    'form_type', p_row.form_type,
    'status', p_row.status,
    'version', p_row.version,
    'is_public', p_row.is_public,
    'business_pack_key', p_row.business_pack_key,
    'department_name', (select name from public.organization_departments where id = p_row.department_id),
    'domain_name', (select domain from public.organization_domains where id = p_row.domain_id),
    'owner_name', (select coalesce(u.full_name, u.email) from public.users u where u.id = p_row.owner_user_id),
    'field_count', jsonb_array_length(coalesce(p_row.fields_schema, '[]'::jsonb)),
    'submission_count', (select count(*) from public.organization_form_submissions where form_id = p_row.id),
    'updated_at', p_row.updated_at
  );
end; $$;

create or replace function public._frm524_submission_json(p_row public.organization_form_submissions)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_row.id,
    'submission_number', p_row.submission_number,
    'form_id', p_row.form_id,
    'form_name', (select name from public.organization_forms where id = p_row.form_id),
    'submitter_name', (select coalesce(u.full_name, u.email) from public.users u where u.id = p_row.submitter_user_id),
    'department_name', (select name from public.organization_departments where id = p_row.department_id),
    'status', p_row.status,
    'approval_status', p_row.approval_status,
    'scan_reference', p_row.scan_reference,
    'submitted_at', p_row.submitted_at,
    'updated_at', p_row.updated_at
  );
end; $$;

create or replace function public._frm524_seed_approvals(p_org_id uuid, p_submission_id uuid, p_form_type text)
returns void language plpgsql security definer set search_path = public as $$
begin
  delete from public.organization_form_approvals where submission_id = p_submission_id;

  if p_form_type in ('approval', 'inspection') then
    insert into public.organization_form_approvals (organization_id, submission_id, approval_level, status)
    values (p_org_id, p_submission_id, 'manager', 'pending');

    if p_form_type = 'approval' then
      insert into public.organization_form_approvals (organization_id, submission_id, approval_level, status)
      values (p_org_id, p_submission_id, 'finance', 'pending');
    end if;
  end if;
end; $$;

create or replace function public._frm524_seed_workflow(p_org_id uuid, p_submission_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_form_workflow_triggers (organization_id, submission_id, trigger_type, status)
  values
    (p_org_id, p_submission_id, 'task', 'pending'),
    (p_org_id, p_submission_id, 'approval', 'pending'),
    (p_org_id, p_submission_id, 'notification', 'pending');
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Forms Data Collection Center
-- ---------------------------------------------------------------------------
create or replace function public.get_forms_data_collection_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('forms.view');
  v_org_id := public._frm524_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._frm524_ensure_settings(v_org_id);
  perform public._frm524_log(v_org_id, 'center_view', 'Forms Center viewed', null, null,
    jsonb_build_object('section', p_section));

  return jsonb_build_object(
    'found', true,
    'principle', 'Employees should never need paper forms if a digital workflow can do the job better.',
    'overview', jsonb_build_object(
      'total_forms', (select count(*) from public.organization_forms where organization_id = v_org_id and status <> 'archived'),
      'active_forms', (select count(*) from public.organization_forms where organization_id = v_org_id and status = 'active'),
      'total_submissions', (select count(*) from public.organization_form_submissions where organization_id = v_org_id),
      'pending_approvals', (
        select count(*) from public.organization_form_submissions
        where organization_id = v_org_id and approval_status like 'pending%'
      ),
      'incomplete_submissions', (
        select count(*) from public.organization_form_submissions
        where organization_id = v_org_id and status in ('draft', 'in_review')
      ),
      'submissions_today', (
        select count(*) from public.organization_form_submissions
        where organization_id = v_org_id and submitted_at >= current_date
      ),
      'templates_available', (select count(*) from public.organization_form_templates where organization_id = v_org_id and is_active)
    ),
    'forms', coalesce((
      select jsonb_agg(public._frm524_form_json(f) order by f.updated_at desc)
      from (select * from public.organization_forms where organization_id = v_org_id order by updated_at desc limit 50) f
    ), '[]'::jsonb),
    'submissions', coalesce((
      select jsonb_agg(public._frm524_submission_json(s) order by s.updated_at desc)
      from (select * from public.organization_form_submissions where organization_id = v_org_id order by updated_at desc limit 50) s
    ), '[]'::jsonb),
    'pending_approvals', coalesce((
      select jsonb_agg(public._frm524_submission_json(s) order by s.updated_at desc)
      from (
        select * from public.organization_form_submissions
        where organization_id = v_org_id and approval_status like 'pending%'
        order by updated_at desc limit 30
      ) s
    ), '[]'::jsonb),
    'templates', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id, 'template_key', t.template_key, 'name', t.name,
        'description', t.description, 'template_type', t.template_type,
        'business_pack_key', t.business_pack_key, 'field_count', jsonb_array_length(coalesce(t.fields_schema, '[]'::jsonb))
      ) order by t.name)
      from public.organization_form_templates t
      where t.organization_id = v_org_id and t.is_active
    ), '[]'::jsonb),
    'automation', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', w.id, 'trigger_type', w.trigger_type, 'status', w.status,
        'submission_number', (select submission_number from public.organization_form_submissions where id = w.submission_id),
        'created_at', w.created_at, 'executed_at', w.executed_at
      ) order by w.created_at desc)
      from public.organization_form_workflow_triggers w
      where w.organization_id = v_org_id limit 30
    ), '[]'::jsonb),
    'reports', jsonb_build_object(
      'submission_volume_month', (
        select count(*) from public.organization_form_submissions
        where organization_id = v_org_id and created_at >= date_trunc('month', now())
      ),
      'avg_approval_days', coalesce((
        select round(avg(extract(epoch from (completed_at - submitted_at)) / 86400)::numeric, 1)
        from public.organization_form_submissions
        where organization_id = v_org_id and completed_at is not null and submitted_at is not null
      ), 0),
      'completion_rate', coalesce((
        select round(
          100.0 * count(*) filter (where status = 'completed') / nullif(count(*), 0), 1
        )
        from public.organization_form_submissions where organization_id = v_org_id
      ), 0),
      'most_used_forms', coalesce((
        select jsonb_agg(jsonb_build_object('form_name', name, 'submission_count', cnt))
        from (
          select f.name, count(s.id) as cnt
          from public.organization_forms f
          left join public.organization_form_submissions s on s.form_id = f.id
          where f.organization_id = v_org_id
          group by f.id, f.name order by cnt desc limit 5
        ) x
      ), '[]'::jsonb)
    ),
    'field_types', jsonb_build_array(
      'text', 'textarea', 'number', 'currency', 'date', 'time', 'dropdown',
      'multi_select', 'checkbox', 'radio', 'file_upload', 'signature',
      'photo_upload', 'location', 'qr_scan', 'barcode_scan', 'custom'
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('action', a.action, 'summary', a.summary, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_forms_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'sections', jsonb_build_array(
      'overview', 'forms', 'submissions', 'templates', 'approvals', 'automation', 'reports'
    ),
    'routes', jsonb_build_object('forms', '/app/forms', 'submissions', '/app/forms/submissions')
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_forms_data_collection_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_id uuid;
  v_form public.organization_forms;
  v_sub public.organization_form_submissions;
  v_next_level text;
begin
  v_org_id := public._frm524_org();
  if v_org_id is null then return jsonb_build_object('ok', false, 'error', 'organization_not_found'); end if;

  if p_action_type in (
    'create_form', 'create_from_template', 'update_form_status', 'publish_form', 'archive_form',
    'create_submission', 'submit_submission', 'approve_submission', 'reject_submission',
    'add_signature', 'add_media', 'execute_workflow'
  ) then
    perform public._irp_require_permission('forms.manage');
  else
    perform public._irp_require_permission('forms.view');
  end if;

  perform public._frm524_ensure_settings(v_org_id);

  if p_action_type = 'create_form' then
    insert into public.organization_forms (
      organization_id, form_number, name, description, form_type, status,
      owner_user_id, business_pack_key, fields_schema, is_public
    ) values (
      v_org_id,
      coalesce(p_payload->>'form_number', public._frm524_next_number(v_org_id, 'FRM', 'organization_forms')),
      coalesce(p_payload->>'name', 'New Form'),
      coalesce(p_payload->>'description', ''),
      coalesce(p_payload->>'form_type', 'general'),
      'draft',
      (select id from public.users where auth_user_id = auth.uid() limit 1),
      p_payload->>'business_pack_key',
      coalesce(p_payload->'fields_schema', '[]'::jsonb),
      coalesce((p_payload->>'is_public')::boolean, false)
    ) returning id into v_id;
    perform public._frm524_log(v_org_id, 'form_created', 'Form created', v_id, null, p_payload);
    return jsonb_build_object('ok', true, 'form_id', v_id);

  elsif p_action_type = 'create_from_template' then
    insert into public.organization_forms (
      organization_id, form_number, name, description, form_type, status,
      template_id, owner_user_id, business_pack_key, fields_schema, workflow_config
    )
    select
      v_org_id,
      public._frm524_next_number(v_org_id, 'FRM', 'organization_forms'),
      t.name, t.description, t.template_type, 'draft',
      t.id,
      (select id from public.users where auth_user_id = auth.uid() limit 1),
      coalesce(p_payload->>'business_pack_key', t.business_pack_key),
      t.fields_schema, t.workflow_config
    from public.organization_form_templates t
    where t.id = (p_payload->>'template_id')::uuid and t.organization_id = v_org_id
    returning id into v_id;

    perform public._frm524_log(v_org_id, 'form_created', 'Form created from template', v_id, null, p_payload);
    return jsonb_build_object('ok', true, 'form_id', v_id);

  elsif p_action_type = 'publish_form' then
    v_id := (p_payload->>'form_id')::uuid;
    update public.organization_forms set status = 'active', version = version + 1, updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._frm524_log(v_org_id, 'form_updated', 'Form published', v_id, null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'archive_form' then
    v_id := (p_payload->>'form_id')::uuid;
    update public.organization_forms set status = 'archived', updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._frm524_log(v_org_id, 'form_updated', 'Form archived', v_id, null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'update_form_status' then
    v_id := (p_payload->>'form_id')::uuid;
    update public.organization_forms set
      status = coalesce(p_payload->>'status', status),
      updated_at = now()
    where id = v_id and organization_id = v_org_id;
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_submission' then
    select * into v_form from public.organization_forms
    where id = (p_payload->>'form_id')::uuid and organization_id = v_org_id;

    insert into public.organization_form_submissions (
      organization_id, submission_number, form_id, submitter_user_id,
      department_id, submission_data, location_data, status, scan_reference
    ) values (
      v_org_id,
      coalesce(p_payload->>'submission_number', public._frm524_next_number(v_org_id, 'SUB', 'organization_form_submissions')),
      v_form.id,
      (select id from public.users where auth_user_id = auth.uid() limit 1),
      nullif(p_payload->>'department_id', '')::uuid,
      coalesce(p_payload->'submission_data', '{}'::jsonb),
      p_payload->'location_data',
      coalesce(p_payload->>'status', 'draft'),
      p_payload->>'scan_reference'
    ) returning id into v_id;

    perform public._frm524_log(v_org_id, 'submission_created', 'Submission created', v_form.id, v_id, p_payload);
    return jsonb_build_object('ok', true, 'submission_id', v_id);

  elsif p_action_type = 'submit_submission' then
    v_id := (p_payload->>'submission_id')::uuid;
    select * into v_sub from public.organization_form_submissions
    where id = v_id and organization_id = v_org_id;
    select * into v_form from public.organization_forms where id = v_sub.form_id;

    perform public._frm524_seed_approvals(v_org_id, v_id, v_form.form_type);
    perform public._frm524_seed_workflow(v_org_id, v_id);

    update public.organization_form_submissions set
      status = 'in_review',
      approval_status = case when v_form.form_type in ('approval', 'inspection') then 'pending_manager' else 'none' end,
      submitted_at = now(),
      updated_at = now()
    where id = v_id;

    perform public._frm524_log(v_org_id, 'submission_created', 'Submission submitted', v_sub.form_id, v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'approve_submission' then
    v_id := (p_payload->>'submission_id')::uuid;

    update public.organization_form_approvals set
      status = 'approved',
      approver_user_id = (select id from public.users where auth_user_id = auth.uid() limit 1),
      decided_at = now()
    where id = (
      select id from public.organization_form_approvals
      where submission_id = v_id and status = 'pending'
      order by case approval_level when 'manager' then 1 when 'finance' then 2 when 'executive' then 3 else 4 end
      limit 1
    );

    if exists (select 1 from public.organization_form_approvals where submission_id = v_id and status = 'pending') then
      select approval_level into v_next_level
      from public.organization_form_approvals
      where submission_id = v_id and status = 'pending'
      order by case approval_level when 'manager' then 1 when 'finance' then 2 when 'executive' then 3 else 4 end
      limit 1;

      update public.organization_form_submissions set
        approval_status = 'pending_' || v_next_level,
        status = 'in_review',
        updated_at = now()
      where id = v_id;
    else
      update public.organization_form_submissions set
        status = 'approved',
        approval_status = 'approved',
        completed_at = now(),
        updated_at = now()
      where id = v_id;
    end if;

    perform public._frm524_log(v_org_id, 'approval_granted', 'Approval granted', null, v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'reject_submission' then
    v_id := (p_payload->>'submission_id')::uuid;
    update public.organization_form_submissions set
      status = 'rejected', approval_status = 'rejected', updated_at = now()
    where id = v_id and organization_id = v_org_id;
    update public.organization_form_approvals set status = 'rejected', decided_at = now()
    where submission_id = v_id and status = 'pending';
    perform public._frm524_log(v_org_id, 'approval_rejected', 'Submission rejected', null, v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'add_signature' then
    insert into public.organization_form_signatures (
      organization_id, submission_id, signer_user_id, signer_role, signature_type, signature_data, verified
    ) values (
      v_org_id,
      (p_payload->>'submission_id')::uuid,
      (select id from public.users where auth_user_id = auth.uid() limit 1),
      coalesce(p_payload->>'signer_role', 'employee'),
      coalesce(p_payload->>'signature_type', 'drawn'),
      coalesce(p_payload->>'signature_data', 'signed'),
      coalesce((p_payload->>'verified')::boolean, false)
    ) returning id into v_id;
    perform public._frm524_log(v_org_id, 'signature_added', 'Signature added', null, (p_payload->>'submission_id')::uuid, p_payload);
    return jsonb_build_object('ok', true, 'signature_id', v_id);

  elsif p_action_type = 'add_media' then
    insert into public.organization_form_media (
      organization_id, submission_id, media_type, file_name, file_url, uploaded_by_user_id
    ) values (
      v_org_id,
      (p_payload->>'submission_id')::uuid,
      coalesce(p_payload->>'media_type', 'photo'),
      coalesce(p_payload->>'file_name', 'attachment'),
      coalesce(p_payload->>'file_url', ''),
      (select id from public.users where auth_user_id = auth.uid() limit 1)
    ) returning id into v_id;
    perform public._frm524_log(v_org_id, 'file_uploaded', 'File uploaded', null, (p_payload->>'submission_id')::uuid, p_payload);
    return jsonb_build_object('ok', true, 'media_id', v_id);

  elsif p_action_type = 'execute_workflow' then
    v_id := (p_payload->>'workflow_id')::uuid;
    update public.organization_form_workflow_triggers set
      status = 'executed', executed_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._frm524_log(v_org_id, 'workflow_triggered', 'Workflow executed', null, null, p_payload);
    return jsonb_build_object('ok', true);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_forms_data_collection_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('forms.view');
  v_org_id := public._frm524_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._frm524_ensure_settings(v_org_id);

  return jsonb_build_object(
    'found', true,
    'principle', 'Forms collect information. Workflows create action.',
    'pending_approvals', (
      select count(*) from public.organization_form_submissions
      where organization_id = v_org_id and approval_status like 'pending%'
    ),
    'incomplete_submissions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'form_name', (select name from public.organization_forms where id = s.form_id),
        'status', s.status
      ))
      from (
        select * from public.organization_form_submissions
        where organization_id = v_org_id and status in ('draft', 'in_review')
        order by updated_at desc limit 10
      ) s
    ), '[]'::jsonb),
    'most_used_forms', coalesce((
      select jsonb_agg(jsonb_build_object('form_name', name, 'submission_count', cnt))
      from (
        select f.name, count(s.id) as cnt
        from public.organization_forms f
        left join public.organization_form_submissions s on s.form_id = f.id
        where f.organization_id = v_org_id
        group by f.id, f.name order by cnt desc limit 5
      ) x
    ), '[]'::jsonb),
    'companion_prompts', jsonb_build_array(
      'Create a new inspection form.',
      'Show pending approvals.',
      'Generate warehouse checklist.',
      'Show incomplete submissions.',
      'Which forms are most used?'
    ),
    'routes', jsonb_build_object('forms', '/app/forms', 'submissions', '/app/forms/submissions')
  );
end; $$;

create or replace function public.get_my_forms_data_collection_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  perform public._irp_require_permission('forms.view');
  v_org_id := public._frm524_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);

  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('forms.manage', v_org_id),
    'my_submissions', (
      select count(*) from public.organization_form_submissions
      where organization_id = v_org_id and submitter_user_id = v_user_id
        and status not in ('completed', 'rejected')
    ),
    'pending_my_approval', (
      select count(*) from public.organization_form_submissions
      where organization_id = v_org_id and approval_status like 'pending%'
    ),
    'routes', jsonb_build_object(
      'forms', '/app/forms',
      'submissions', '/app/forms/submissions',
      'mobile_ready', true
    )
  );
exception when others then
  return jsonb_build_object('found', true, 'routes', jsonb_build_object('forms', '/app/forms'));
end; $$;

-- Module registry
do $$ begin
  perform public._mre501_seed_module(
    'forms', 'Forms', 'forms', 'operations',
    'Digital forms, data collection, submissions, approvals, and workflow automation.',
    'starter', null, 'operations', '/app/forms', 'licensed', 11
  );
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('forms', 'forms.view', 'view', 'Forms — view forms, submissions, and templates'),
    ('forms', 'forms.manage', 'manage', 'Forms — create forms, submit, approve, and manage workflows')
  on conflict (permission_key) do nothing;
exception when others then
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('forms', 'forms.view', 'view', 'Forms — view forms, submissions, and templates'),
    ('forms', 'forms.manage', 'manage', 'Forms — create forms, submit, approve, and manage workflows')
  on conflict (permission_key) do nothing;
end $$;

grant execute on function public.get_forms_data_collection_center(text) to authenticated;
grant execute on function public.perform_forms_data_collection_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_forms_data_collection_context() to authenticated;
grant execute on function public.get_my_forms_data_collection_summary() to authenticated;
