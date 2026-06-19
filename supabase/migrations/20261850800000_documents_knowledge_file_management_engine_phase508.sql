-- Phase 508 — Documents, Knowledge & File Management Engine
-- Universal document and knowledge engine for all APP organizations and Business Packs
-- Extends Phase A.5 knowledge_articles; new organization_documents layer

-- ---------------------------------------------------------------------------
-- 1. organization_documents
-- ---------------------------------------------------------------------------
create table if not exists public.organization_documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  document_number text,
  title text not null,
  description text not null default '',
  category text not null default 'operations' check (
    category in (
      'policies', 'procedures', 'guides', 'training', 'templates', 'legal', 'hr',
      'finance', 'operations', 'support', 'commerce', 'warehouse', 'hosts', 'contracts', 'reports', 'custom'
    )
  ),
  status text not null default 'draft' check (
    status in ('draft', 'under_review', 'requires_update', 'published', 'restricted', 'archived')
  ),
  file_type text not null default 'pdf' check (
    file_type in ('pdf', 'docx', 'xlsx', 'csv', 'pptx', 'txt', 'image', 'video', 'audio', 'zip', 'other')
  ),
  file_url text,
  file_name text,
  file_size_bytes bigint,
  version int not null default 1,
  owner_user_id uuid references public.users (id) on delete set null,
  created_by uuid references public.users (id) on delete set null,
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  related_module_key text,
  tags jsonb not null default '[]'::jsonb,
  permissions jsonb not null default '{"view":"authorized","edit":"owner","share":"manager"}'::jsonb,
  expires_at timestamptz,
  search_vector tsvector,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  archived_at timestamptz
);

create index if not exists organization_documents_org_status_idx
  on public.organization_documents (organization_id, status, category);

create index if not exists organization_documents_org_domain_idx
  on public.organization_documents (organization_id, domain_id, status);

create index if not exists organization_documents_search_idx
  on public.organization_documents using gin (search_vector);

-- ---------------------------------------------------------------------------
-- 2. Versions, approvals, templates, audit, notifications
-- ---------------------------------------------------------------------------
create table if not exists public.organization_document_versions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  document_id uuid not null references public.organization_documents (id) on delete cascade,
  version_number int not null,
  title text not null,
  description text not null default '',
  file_url text,
  file_name text,
  change_note text,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (document_id, version_number)
);

create table if not exists public.organization_document_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  document_id uuid not null references public.organization_documents (id) on delete cascade,
  submitted_by uuid references public.users (id) on delete set null,
  reviewed_by uuid references public.users (id) on delete set null,
  approval_status text not null default 'pending' check (approval_status in ('pending', 'approved', 'rejected')),
  review_note text,
  history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.organization_document_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id) on delete cascade,
  template_key text not null,
  name text not null,
  description text not null default '',
  category text not null default 'templates',
  file_type text not null default 'docx',
  business_pack_key text,
  is_system boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, template_key)
);

create table if not exists public.organization_document_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  document_id uuid references public.organization_documents (id) on delete set null,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.organization_document_notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  document_id uuid references public.organization_documents (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  notification_type text not null check (
    notification_type in ('approved', 'updated', 'published', 'policy_changed', 'review_required', 'expiring')
  ),
  summary text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.organization_documents enable row level security;
alter table public.organization_document_versions enable row level security;
alter table public.organization_document_approvals enable row level security;
alter table public.organization_document_templates enable row level security;
alter table public.organization_document_audit_logs enable row level security;
alter table public.organization_document_notifications enable row level security;

revoke all on public.organization_documents from authenticated, anon;
revoke all on public.organization_document_versions from authenticated, anon;
revoke all on public.organization_document_approvals from authenticated, anon;
revoke all on public.organization_document_templates from authenticated, anon;
revoke all on public.organization_document_audit_logs from authenticated, anon;
revoke all on public.organization_document_notifications from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Extend knowledge_articles (Phase A.5)
-- ---------------------------------------------------------------------------
alter table public.knowledge_articles
  add column if not exists department_id uuid references public.organization_departments (id) on delete set null,
  add column if not exists domain_id uuid references public.organization_domains (id) on delete set null,
  add column if not exists business_pack_key text,
  add column if not exists owner_user_id uuid references public.users (id) on delete set null,
  add column if not exists tags jsonb not null default '[]'::jsonb,
  add column if not exists knowledge_category text;

do $$ begin
  alter table public.knowledge_articles drop constraint if exists knowledge_articles_status_check;
exception when others then null;
end $$;

alter table public.knowledge_articles
  add constraint knowledge_articles_status_check check (
    status in ('draft', 'review', 'published', 'archived', 'requires_update', 'restricted')
  );

-- ---------------------------------------------------------------------------
-- Permissions registration
-- ---------------------------------------------------------------------------
do $$ begin
  if exists (select 1 from pg_proc where proname = '_rpm504_register_module_permissions') then
    perform public._rpm504_register_module_permissions('documents');
    perform public._rpm504_register_module_permissions('knowledge_center');
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public._dk508_doc_search_vector()
returns trigger language plpgsql as $$
begin
  new.search_vector := to_tsvector(
    'simple',
    coalesce(new.title, '') || ' ' || coalesce(new.description, '') || ' ' || coalesce(new.file_name, '')
  );
  new.updated_at := now();
  return new;
end; $$;

drop trigger if exists organization_documents_search_vector on public.organization_documents;
create trigger organization_documents_search_vector
  before insert or update of title, description, file_name on public.organization_documents
  for each row execute function public._dk508_doc_search_vector();

create or replace function public._dk508_log(
  p_org_id uuid, p_doc_id uuid, p_action text, p_summary text, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_document_audit_logs (
    organization_id, document_id, actor_user_id, action, summary, payload
  ) values (
    p_org_id, p_doc_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._dk508_next_document_number(p_org_id uuid)
returns text language plpgsql security definer set search_path = public as $$
declare v_seq int;
begin
  select count(*) + 1 into v_seq from public.organization_documents where organization_id = p_org_id;
  return 'DOC-' || lpad(v_seq::text, 6, '0');
end; $$;

create or replace function public._dk508_notify(
  p_org_id uuid, p_doc_id uuid, p_user_id uuid, p_type text, p_summary text
)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_user_id is null then return; end if;
  insert into public.organization_document_notifications (
    organization_id, document_id, user_id, notification_type, summary
  ) values (p_org_id, p_doc_id, p_user_id, p_type, p_summary);
end; $$;

create or replace function public._dk508_document_json(p_doc public.organization_documents)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_doc.id,
    'document_number', p_doc.document_number,
    'title', p_doc.title,
    'description', p_doc.description,
    'category', p_doc.category,
    'status', p_doc.status,
    'file_type', p_doc.file_type,
    'file_name', p_doc.file_name,
    'file_url', p_doc.file_url,
    'version', p_doc.version,
    'owner_user_id', p_doc.owner_user_id,
    'department_id', p_doc.department_id,
    'domain_id', p_doc.domain_id,
    'business_pack_key', p_doc.business_pack_key,
    'tags', p_doc.tags,
    'created_at', p_doc.created_at,
    'updated_at', p_doc.updated_at,
    'published_at', p_doc.published_at
  );
end; $$;

create or replace function public._dk508_seed_templates(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_document_templates (
    organization_id, template_key, name, description, category, file_type, is_system
  ) values
    (p_org_id, 'contract', 'Contract Template', 'Standard contract document template.', 'legal', 'docx', true),
    (p_org_id, 'policy', 'Policy Template', 'Company policy document template.', 'policies', 'docx', true),
    (p_org_id, 'employee_document', 'Employee Document', 'Onboarding and HR employee document template.', 'hr', 'docx', true),
    (p_org_id, 'checklist', 'Checklist Template', 'Operational checklist template.', 'operations', 'docx', true),
    (p_org_id, 'report', 'Report Template', 'Business report template.', 'reports', 'xlsx', true),
    (p_org_id, 'form', 'Form Template', 'Custom form template.', 'templates', 'pdf', true)
  on conflict (organization_id, template_key) do nothing;
end; $$;

create or replace function public._dk508_seed_knowledge_categories(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from pg_proc where proname = '_kce_seed_categories') then
    perform public._kce_seed_categories(p_org_id);
  end if;
  insert into public.knowledge_categories (organization_id, slug, name, description, sort_order)
  select p_org_id, v.slug, v.name, v.description, v.ord
  from (values
    ('policies', 'Policies', 'Company policies', 1),
    ('procedures', 'Procedures', 'Operational procedures', 2),
    ('guides', 'Guides', 'How-to guides', 3),
    ('training', 'Training', 'Training materials', 4),
    ('support', 'Support', 'Support knowledge', 5),
    ('warehouse', 'Warehouse', 'Warehouse documentation', 6),
    ('hosts', 'Hosts', 'Property guides', 7)
  ) as v(slug, name, description, ord)
  on conflict (organization_id, slug) do nothing;
end; $$;

-- Business Pack document entry point
create or replace function public.create_business_pack_document(
  p_pack_key text,
  p_title text,
  p_description text default null,
  p_category text default 'operations',
  p_file_type text default 'pdf',
  p_domain_id uuid default null,
  p_department_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_row public.organization_documents;
begin
  perform public._irp_require_permission('documents.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  insert into public.organization_documents (
    organization_id, document_number, title, description, category, status,
    file_type, owner_user_id, created_by, domain_id, department_id,
    business_pack_key, related_module_key, metadata
  ) values (
    v_org_id, public._dk508_next_document_number(v_org_id), left(trim(p_title), 200),
    left(coalesce(p_description, ''), 1000), coalesce(p_category, 'operations'), 'draft',
    coalesce(p_file_type, 'pdf'), v_user_id, v_user_id, p_domain_id, p_department_id,
    p_pack_key, p_pack_key, coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('pack_document', true)
  ) returning * into v_row;

  perform public._dk508_log(v_org_id, v_row.id, 'document_created', 'Business Pack document created', jsonb_build_object('pack_key', p_pack_key));
  return jsonb_build_object('ok', true, 'document', public._dk508_document_json(v_row));
end; $$;

-- Document Management Center
create or replace function public.get_document_management_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  perform public._irp_require_permission('documents.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._dk508_seed_templates(v_org_id);

  return jsonb_build_object(
    'found', true,
    'principle', 'Knowledge should not disappear when employees leave. Documents should be easy to find.',
    'structure', 'PLATFORM → APP → KNOWLEDGE & DOCUMENT ENGINE → EMPLOYEES',
    'statuses', jsonb_build_array('draft', 'under_review', 'requires_update', 'published', 'restricted', 'archived'),
    'file_types', jsonb_build_array('pdf', 'docx', 'xlsx', 'csv', 'pptx', 'txt', 'image', 'video', 'audio', 'zip'),
    'categories', jsonb_build_array(
      'policies', 'procedures', 'guides', 'training', 'templates', 'legal', 'hr',
      'finance', 'operations', 'support', 'commerce', 'warehouse', 'hosts', 'contracts', 'reports'
    ),
    'overview', jsonb_build_object(
      'total', (select count(*) from public.organization_documents where organization_id = v_org_id and status <> 'archived'),
      'published', (select count(*) from public.organization_documents where organization_id = v_org_id and status = 'published'),
      'pending_review', (select count(*) from public.organization_documents where organization_id = v_org_id and status = 'under_review'),
      'requires_update', (select count(*) from public.organization_documents where organization_id = v_org_id and status = 'requires_update')
    ),
    'recent_documents', coalesce((
      select jsonb_agg(public._dk508_document_json(d) order by d.updated_at desc)
      from (select * from public.organization_documents where organization_id = v_org_id and status <> 'archived' order by updated_at desc limit 30) d
    ), '[]'::jsonb),
    'shared_documents', coalesce((
      select jsonb_agg(public._dk508_document_json(d) order by d.published_at desc nulls last)
      from (select * from public.organization_documents where organization_id = v_org_id and status = 'published' order by published_at desc limit 30) d
    ), '[]'::jsonb),
    'departments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'department_id', dep.id, 'department_name', dep.name,
        'document_count', (select count(*) from public.organization_documents doc where doc.organization_id = v_org_id and doc.department_id = dep.id and doc.status <> 'archived')
      ) order by dep.name)
      from public.organization_departments dep where dep.organization_id = v_org_id and dep.is_active = true
    ), '[]'::jsonb),
    'templates', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id, 'template_key', t.template_key, 'name', t.name,
        'description', t.description, 'category', t.category, 'file_type', t.file_type
      ) order by t.name)
      from public.organization_document_templates t
      where t.organization_id = v_org_id or t.is_system = true
    ), '[]'::jsonb),
    'policies', coalesce((
      select jsonb_agg(public._dk508_document_json(d) order by d.updated_at desc)
      from (select * from public.organization_documents where organization_id = v_org_id and category = 'policies' and status <> 'archived' limit 20) d
    ), '[]'::jsonb),
    'contracts', coalesce((
      select jsonb_agg(public._dk508_document_json(d) order by d.updated_at desc)
      from (select * from public.organization_documents where organization_id = v_org_id and category = 'contracts' and status <> 'archived' limit 20) d
    ), '[]'::jsonb),
    'reports_section', coalesce((
      select jsonb_agg(public._dk508_document_json(d) order by d.updated_at desc)
      from (select * from public.organization_documents where organization_id = v_org_id and category = 'reports' and status <> 'archived' limit 20) d
    ), '[]'::jsonb),
    'archives', coalesce((
      select jsonb_agg(public._dk508_document_json(d) order by d.archived_at desc nulls last)
      from (select * from public.organization_documents where organization_id = v_org_id and status = 'archived' order by archived_at desc limit 20) d
    ), '[]'::jsonb),
    'pending_approvals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'approval_id', a.id, 'document_id', a.document_id, 'document_title', d.title,
        'approval_status', a.approval_status, 'created_at', a.created_at
      ) order by a.created_at desc)
      from public.organization_document_approvals a
      join public.organization_documents d on d.id = a.document_id
      where a.organization_id = v_org_id and a.approval_status = 'pending'
    ), '[]'::jsonb),
    'usage_reports', jsonb_build_object(
      'most_recent', (select count(*) from public.organization_documents where organization_id = v_org_id and updated_at >= now() - interval '30 days'),
      'by_category', coalesce((
        select jsonb_agg(jsonb_build_object('category', category, 'count', cnt))
        from (select category, count(*) cnt from public.organization_documents where organization_id = v_org_id group by category) s
      ), '[]'::jsonb),
      'approval_pending', (select count(*) from public.organization_document_approvals where organization_id = v_org_id and approval_status = 'pending')
    ),
    'knowledge_route', '/app/knowledge',
    'search_route', '/api/app/knowledge/search'
  );
end; $$;

-- Knowledge Management Center
create or replace function public.get_knowledge_management_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_dashboard jsonb;
begin
  perform public._irp_require_permission('knowledge.view');
  v_org_id := public._mta_require_organization();
  perform public._dk508_seed_knowledge_categories(v_org_id);

  if exists (select 1 from pg_proc where proname = 'get_knowledge_center_engine_dashboard') then
    v_dashboard := public.get_knowledge_center_engine_dashboard();
  else
    v_dashboard := '{}'::jsonb;
  end if;

  return jsonb_build_object(
    'found', true,
    'principle', 'Company memory — searchable knowledge that Companion understands.',
    'philosophy', coalesce(v_dashboard->>'philosophy', 'Trusted, tenant-owned knowledge powers every Aipify response.'),
    'overview', jsonb_build_object(
      'published_articles', coalesce((v_dashboard->>'published_articles')::int, 0),
      'drafts_awaiting_review', coalesce((v_dashboard->>'drafts_awaiting_review')::int, 0),
      'faq_count', coalesce((v_dashboard->>'faq_count')::int, 0),
      'knowledge_gaps', coalesce((
        select count(*) from public.employee_knowledge_gaps g
        where g.tenant_id = v_org_id and g.status = 'open'
      ), 0)
    ),
    'categories', coalesce(v_dashboard->'categories', '[]'::jsonb),
    'published_list', coalesce(v_dashboard->'published_list', '[]'::jsonb),
    'awaiting_review', coalesce(v_dashboard->'awaiting_review', '[]'::jsonb),
    'outdated_alerts', coalesce(v_dashboard->'outdated_alerts', '[]'::jsonb),
    'most_viewed', coalesce(v_dashboard->'most_viewed', '[]'::jsonb),
    'articles_with_domain', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title, 'domain_id', a.domain_id, 'business_pack_key', a.business_pack_key,
        'status', a.status, 'view_count', a.view_count
      ) order by a.view_count desc)
      from public.knowledge_articles a
      where a.organization_id = v_org_id and a.status = 'published'
      limit 20
    ), '[]'::jsonb),
    'documents_route', '/app/documents'
  );
end; $$;

-- Document actions
create or replace function public.perform_document_management_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid; v_user_id uuid; v_doc_id uuid; v_row public.organization_documents;
  v_prev_version int;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_doc_id := nullif(p_payload->>'document_id', '')::uuid;

  if p_action_type = 'create_document' then
    perform public._irp_require_permission('documents.manage');
    insert into public.organization_documents (
      organization_id, document_number, title, description, category, status,
      file_type, file_url, file_name, owner_user_id, created_by,
      department_id, domain_id, business_pack_key, tags, metadata
    ) values (
      v_org_id, public._dk508_next_document_number(v_org_id),
      left(trim(p_payload->>'title'), 200),
      left(coalesce(p_payload->>'description', ''), 1000),
      coalesce(p_payload->>'category', 'operations'), 'draft',
      coalesce(p_payload->>'file_type', 'pdf'),
      p_payload->>'file_url', p_payload->>'file_name',
      coalesce(nullif(p_payload->>'owner_user_id', '')::uuid, v_user_id), v_user_id,
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      p_payload->>'business_pack_key',
      coalesce(p_payload->'tags', '[]'::jsonb),
      coalesce(p_payload->'metadata', '{}'::jsonb)
    ) returning * into v_row;
    perform public._dk508_log(v_org_id, v_row.id, 'document_created', 'Document created', p_payload);
    return jsonb_build_object('ok', true, 'document', public._dk508_document_json(v_row));

  elsif p_action_type = 'update_document' then
    perform public._irp_require_permission('documents.manage');
    select version into v_prev_version from public.organization_documents where id = v_doc_id and organization_id = v_org_id;
    insert into public.organization_document_versions (
      organization_id, document_id, version_number, title, description, file_url, file_name, change_note, created_by
    )
    select v_org_id, id, version, title, description, file_url, file_name, p_payload->>'change_note', v_user_id
    from public.organization_documents where id = v_doc_id and organization_id = v_org_id;

    update public.organization_documents set
      title = coalesce(nullif(p_payload->>'title', ''), title),
      description = coalesce(p_payload->>'description', description),
      category = coalesce(p_payload->>'category', category),
      file_url = coalesce(p_payload->>'file_url', file_url),
      file_name = coalesce(p_payload->>'file_name', file_name),
      tags = coalesce(p_payload->'tags', tags),
      version = version + 1,
      updated_at = now()
    where id = v_doc_id and organization_id = v_org_id returning * into v_row;
    perform public._dk508_log(v_org_id, v_doc_id, 'document_updated', 'Document updated', p_payload);
    return jsonb_build_object('ok', true, 'document', public._dk508_document_json(v_row));

  elsif p_action_type = 'submit_for_review' then
    perform public._irp_require_permission('documents.manage');
    update public.organization_documents set status = 'under_review', updated_at = now()
    where id = v_doc_id and organization_id = v_org_id returning * into v_row;
    insert into public.organization_document_approvals (organization_id, document_id, submitted_by)
    values (v_org_id, v_doc_id, v_user_id);
    perform public._dk508_log(v_org_id, v_doc_id, 'review_requested', 'Document submitted for review', p_payload);
    return jsonb_build_object('ok', true, 'document', public._dk508_document_json(v_row));

  elsif p_action_type = 'approve_document' then
    perform public._irp_require_permission('documents.approve');
    update public.organization_documents set status = 'published', published_at = now(), updated_at = now()
    where id = v_doc_id and organization_id = v_org_id returning * into v_row;
    update public.organization_document_approvals set approval_status = 'approved', reviewed_by = v_user_id, reviewed_at = now(),
      history = history || jsonb_build_array(jsonb_build_object('action', 'approved', 'at', now()))
    where document_id = v_doc_id and organization_id = v_org_id and approval_status = 'pending';
    perform public._dk508_notify(v_org_id, v_doc_id, v_row.created_by, 'approved', 'Document approved: ' || v_row.title);
    perform public._dk508_log(v_org_id, v_doc_id, 'document_approved', 'Document approved and published', p_payload);
    return jsonb_build_object('ok', true, 'document', public._dk508_document_json(v_row));

  elsif p_action_type = 'reject_document' then
    perform public._irp_require_permission('documents.approve');
    update public.organization_documents set status = 'draft', updated_at = now()
    where id = v_doc_id and organization_id = v_org_id returning * into v_row;
    update public.organization_document_approvals set approval_status = 'rejected', reviewed_by = v_user_id, reviewed_at = now(),
      review_note = p_payload->>'review_note',
      history = history || jsonb_build_array(jsonb_build_object('action', 'rejected', 'at', now()))
    where document_id = v_doc_id and organization_id = v_org_id and approval_status = 'pending';
    perform public._dk508_log(v_org_id, v_doc_id, 'document_rejected', 'Document rejected', p_payload);
    return jsonb_build_object('ok', true, 'document', public._dk508_document_json(v_row));

  elsif p_action_type = 'archive_document' then
    perform public._irp_require_permission('documents.manage');
    update public.organization_documents set status = 'archived', archived_at = now(), updated_at = now()
    where id = v_doc_id and organization_id = v_org_id returning * into v_row;
    perform public._dk508_log(v_org_id, v_doc_id, 'document_archived', 'Document archived', p_payload);
    return jsonb_build_object('ok', true, 'document', public._dk508_document_json(v_row));

  elsif p_action_type = 'rollback_version' then
    perform public._irp_require_permission('documents.manage');
    update public.organization_documents d set
      title = v.title, description = v.description, file_url = v.file_url, file_name = v.file_name,
      version = d.version + 1, updated_at = now()
    from public.organization_document_versions v
    where d.id = v_doc_id and d.organization_id = v_org_id
      and v.document_id = v_doc_id and v.version_number = (p_payload->>'version_number')::int
    returning d.* into v_row;
    perform public._dk508_log(v_org_id, v_doc_id, 'version_rollback', 'Document rolled back', p_payload);
    return jsonb_build_object('ok', true, 'document', public._dk508_document_json(v_row));

  elsif p_action_type = 'create_from_template' then
    perform public._irp_require_permission('documents.manage');
    return public.perform_document_management_action('create_document', (
      select jsonb_build_object(
        'title', t.name, 'description', t.description, 'category', t.category,
        'file_type', t.file_type, 'business_pack_key', t.business_pack_key
      )
      from public.organization_document_templates t
      where t.template_key = p_payload->>'template_key'
        and (t.organization_id = v_org_id or t.is_system = true)
      limit 1
    ) || p_payload);
  end if;

  return jsonb_build_object('ok', false, 'error', 'Unknown action');
end; $$;

-- Global search (documents + knowledge + templates)
create or replace function public.search_global_knowledge_documents(
  p_query text default '',
  p_filters jsonb default '{}'::jsonb
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_q text := trim(coalesce(p_query, ''));
  v_tsquery tsquery;
  v_knowledge jsonb;
  v_limit int := coalesce((p_filters->>'limit')::int, 25);
begin
  if not (public._irp_has_permission('documents.view') or public._irp_has_permission('knowledge.view')) then
    raise exception 'Permission denied: documents.view or knowledge.view required';
  end if;
  v_org_id := public._mta_require_organization();
  if length(v_q) > 0 then v_tsquery := plainto_tsquery('simple', v_q); end if;

  if exists (select 1 from pg_proc where proname = 'search_organization_knowledge') then
    v_knowledge := public.search_organization_knowledge(jsonb_build_object(
      'query', v_q, 'status', coalesce(p_filters->>'knowledge_status', 'published'), 'limit', v_limit
    ));
  else
    v_knowledge := '[]'::jsonb;
  end if;

  return jsonb_build_object(
    'found', true,
    'query', v_q,
    'documents', coalesce((
      select jsonb_agg(public._dk508_document_json(d) order by ts_rank(d.search_vector, v_tsquery) desc nulls last)
      from public.organization_documents d
      where d.organization_id = v_org_id
        and d.status not in ('archived')
        and (p_filters->>'category' is null or d.category = p_filters->>'category')
        and (p_filters->>'domain_id' is null or d.domain_id = (p_filters->>'domain_id')::uuid)
        and (length(v_q) = 0 or d.search_vector @@ v_tsquery or d.title ilike '%' || v_q || '%')
      limit v_limit
    ), '[]'::jsonb),
    'knowledge_articles', coalesce(v_knowledge, '[]'::jsonb),
    'templates', coalesce((
      select jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name, 'template_key', t.template_key, 'category', t.category))
      from public.organization_document_templates t
      where (t.organization_id = v_org_id or t.is_system = true)
        and (length(v_q) = 0 or t.name ilike '%' || v_q || '%' or t.description ilike '%' || v_q || '%')
      limit 10
    ), '[]'::jsonb),
    'search_scope', jsonb_build_array('documents', 'knowledge_articles', 'policies', 'templates', 'tags', 'departments')
  );
end; $$;

-- Companion knowledge context
create or replace function public.get_companion_knowledge_context(p_query text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_search jsonb; v_ai jsonb;
begin
  v_org_id := public._mta_require_organization();

  if p_query is not null and length(trim(p_query)) > 0 then
    v_search := public.search_global_knowledge_documents(trim(p_query), '{"limit": 5}'::jsonb);
    if exists (select 1 from pg_proc where proname = 'retrieve_knowledge_for_ai') then
      v_ai := public.retrieve_knowledge_for_ai(trim(p_query));
    end if;
  end if;

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion searches company knowledge first — documents store information, knowledge stores experience.',
    'search_results', coalesce(v_search, '{}'::jsonb),
    'ai_retrieval', coalesce(v_ai, '{}'::jsonb),
    'documents_route', '/app/documents',
    'knowledge_route', '/app/knowledge',
    'supported_intents', jsonb_build_array(
      'search_knowledge', 'find_policy', 'find_procedure', 'locate_template', 'refund_procedure', 'onboarding_guide'
    ),
    'example_queries', jsonb_build_array(
      'How do we process customer refunds?',
      'Show onboarding procedure',
      'Find warehouse safety guidelines'
    )
  );
exception when others then
  return jsonb_build_object('found', false);
end; $$;

-- Module registry routes
update public.aipify_module_registry
set route_href = '/app/documents', updated_at = now()
where module_key = 'documents';

update public.aipify_module_registry
set route_href = '/app/knowledge', updated_at = now()
where module_key = 'knowledge_center';

do $$ begin
  if exists (select 1 from pg_proc where proname = '_dmn505_upsert_nav') then
    perform public._dmn505_upsert_nav(
      'documents', 'Documents', 'knowledge', 'file-text', '/app/documents',
      'documents', 'documents.view', null, 'app', 6, false, false
    );
    perform public._dmn505_upsert_nav(
      'knowledge_center', 'Knowledge', 'knowledge', 'book-open', '/app/knowledge',
      'knowledge_center', 'knowledge.view', null, 'app', 7, false, false
    );
  end if;
end $$;

grant execute on function public.get_document_management_center() to authenticated;
grant execute on function public.get_knowledge_management_center() to authenticated;
grant execute on function public.perform_document_management_action(text, jsonb) to authenticated;
grant execute on function public.search_global_knowledge_documents(text, jsonb) to authenticated;
grant execute on function public.create_business_pack_document(text, text, text, text, text, uuid, uuid, jsonb) to authenticated;
grant execute on function public.get_companion_knowledge_context(text) to authenticated;
