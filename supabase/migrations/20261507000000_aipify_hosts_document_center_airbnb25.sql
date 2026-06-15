-- Phase Airbnb 25 — Aipify Hosts Document Center Foundation
-- Feature owner: CUSTOMER APP. Helpers: _ahostdoc_* (engine), _ahostbp387_* (blueprint)

create table if not exists public.aipify_hosts_document_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  default_section text not null default 'property_documents' check (
    default_section in (
      'property_documents', 'safety_documents', 'vendor_documents',
      'financial_documents', 'templates', 'archive'
    )
  ),
  metadata jsonb not null default '{"metadata_only":true,"role_governed":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_document_center_settings enable row level security;
revoke all on public.aipify_hosts_document_center_settings from authenticated, anon;

create table if not exists public.aipify_hosts_documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  document_key text not null,
  document_name text not null,
  category text not null check (
    category in (
      'house_rules', 'emergency_procedures', 'property_manuals', 'inspection_reports',
      'maintenance_records', 'vendor_agreements', 'insurance_documents', 'compliance_documents',
      'property_photos', 'inventory_lists'
    )
  ),
  uploaded_by text,
  upload_date date not null default current_date,
  expiration_date date,
  is_archived boolean not null default false,
  current_version integer not null default 1 check (current_version >= 1),
  file_label text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, document_key)
);
create index if not exists aipify_hosts_documents_tenant_idx
  on public.aipify_hosts_documents (tenant_id, category, is_archived);
create index if not exists aipify_hosts_documents_property_idx
  on public.aipify_hosts_documents (property_id, expiration_date);
alter table public.aipify_hosts_documents enable row level security;
revoke all on public.aipify_hosts_documents from authenticated, anon;

create table if not exists public.aipify_hosts_document_versions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  document_id uuid not null references public.aipify_hosts_documents (id) on delete cascade,
  version_number integer not null check (version_number >= 1),
  updated_by text,
  change_notes text,
  file_label text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (document_id, version_number)
);
create index if not exists aipify_hosts_document_versions_doc_idx
  on public.aipify_hosts_document_versions (document_id, version_number desc);
alter table public.aipify_hosts_document_versions enable row level security;
revoke all on public.aipify_hosts_document_versions from authenticated, anon;

create table if not exists public.aipify_hosts_document_templates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  template_key text not null,
  template_name text not null,
  template_type text not null check (
    template_type in (
      'property_inspection_forms', 'incident_reports', 'vendor_agreements', 'safety_checklists'
    )
  ),
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, template_key)
);
alter table public.aipify_hosts_document_templates enable row level security;
revoke all on public.aipify_hosts_document_templates from authenticated, anon;

create table if not exists public.aipify_hosts_document_center_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_document_center_events_tenant_idx
  on public.aipify_hosts_document_center_events (tenant_id, created_at desc);
alter table public.aipify_hosts_document_center_events enable row level security;
revoke all on public.aipify_hosts_document_center_events from authenticated, anon;

create or replace function public._ahostdoc_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_document_center_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_document_center_settings;
begin
  insert into public.aipify_hosts_document_center_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_document_center_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahostdoc_uploader_name()
returns text language sql stable security definer set search_path = public as $$
  select coalesce(
    (select raw_user_meta_data ->> 'full_name' from auth.users where id = auth.uid()),
    (select raw_user_meta_data ->> 'name' from auth.users where id = auth.uid()),
    'Team member'
  ); $$;

create or replace function public._ahostdoc_log_event(
  p_tenant_id uuid, p_event_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_document_center_events (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, p_context) returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'document_' || p_event_type, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostdoc_push_notification(
  p_tenant_id uuid, p_key text, p_priority text, p_title text, p_message text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_hosts_notifications (
    tenant_id, notification_key, category, priority, notification_status, title, message, requires_attention
  ) values (
    p_tenant_id, p_key, 'team_events', p_priority, 'unread', p_title, p_message, p_priority in ('high', 'critical')
  ) on conflict (tenant_id, notification_key) do update set
    priority = excluded.priority, title = excluded.title, message = excluded.message,
    requires_attention = excluded.requires_attention, notification_status = 'unread', updated_at = now();
exception when undefined_table then null;
end; $$;

create or replace function public._ahostdoc_doc_status(p_expiry date, p_archived boolean)
returns text language sql stable as $$
  select case
    when p_archived then 'archived'
    when p_expiry is null then 'active'
    when p_expiry < current_date then 'expired'
    when p_expiry <= current_date + 30 then 'expiring_soon'
    else 'active'
  end; $$;

create or replace function public._ahostdoc_section_categories(p_section text)
returns text[] language sql immutable as $$
  select case p_section
    when 'property_documents' then array['house_rules','property_manuals','property_photos','inventory_lists']
    when 'safety_documents' then array['emergency_procedures','inspection_reports']
    when 'vendor_documents' then array['vendor_agreements','maintenance_records']
    when 'financial_documents' then array['insurance_documents','compliance_documents']
    else array[]::text[]
  end; $$;

create or replace function public._ahostbp387_positioning() returns text language sql immutable as $$
  select 'Store and organize critical property documentation — property vaults, expiration tracking, templates, and version control in one Document Center.'; $$;

create or replace function public._ahostbp387_sections() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'property_documents', 'label', 'Property Documents'),
    jsonb_build_object('key', 'safety_documents', 'label', 'Safety Documents'),
    jsonb_build_object('key', 'vendor_documents', 'label', 'Vendor Documents'),
    jsonb_build_object('key', 'financial_documents', 'label', 'Financial Documents'),
    jsonb_build_object('key', 'templates', 'label', 'Templates'),
    jsonb_build_object('key', 'archive', 'label', 'Archive')
  ); $$;

create or replace function public._ahostbp387_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'house_rules', 'emergency_procedures', 'property_manuals', 'inspection_reports',
    'maintenance_records', 'vendor_agreements', 'insurance_documents', 'compliance_documents',
    'property_photos', 'inventory_lists'
  ); $$;

create or replace function public._ahostdoc_document_row(p_d public.aipify_hosts_documents, p_property text)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_d.id,
    'document_key', p_d.document_key,
    'document_name', p_d.document_name,
    'category', p_d.category,
    'property_id', p_d.property_id,
    'property', coalesce(p_property, 'All properties'),
    'uploaded_by', coalesce(p_d.uploaded_by, '—'),
    'upload_date', p_d.upload_date::text,
    'expiration_date', p_d.expiration_date::text,
    'status', public._ahostdoc_doc_status(p_d.expiration_date, p_d.is_archived),
    'current_version', p_d.current_version,
    'file_label', coalesce(p_d.file_label, p_d.document_name),
    'updated_at', to_char(p_d.updated_at, 'YYYY-MM-DD HH24:MI')
  ); $$;

create or replace function public._ahostdoc_version_row(p_v public.aipify_hosts_document_versions)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_v.id,
    'document_id', p_v.document_id,
    'version_number', p_v.version_number,
    'updated_by', coalesce(p_v.updated_by, '—'),
    'updated_date', to_char(p_v.created_at, 'YYYY-MM-DD'),
    'change_notes', coalesce(p_v.change_notes, '—'),
    'file_label', coalesce(p_v.file_label, '—')
  ); $$;

create or replace function public._ahostdoc_seed_templates(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.aipify_hosts_document_templates where tenant_id = p_tenant_id limit 1) then
    return;
  end if;
  insert into public.aipify_hosts_document_templates (tenant_id, template_key, template_name, template_type, description) values
    (p_tenant_id, 'tpl_insp', 'Property Inspection Form', 'property_inspection_forms',
      'Standard turnover and maintenance inspection checklist.'),
    (p_tenant_id, 'tpl_inc', 'Incident Report', 'incident_reports',
      'Structured incident documentation for guest and property events.'),
    (p_tenant_id, 'tpl_vnd', 'Vendor Agreement', 'vendor_agreements',
      'Service scope, renewal terms, and escalation paths.'),
    (p_tenant_id, 'tpl_safe', 'Safety Checklist', 'safety_checklists',
      'Smoke detectors, exits, emergency contacts, and safety equipment.');
end; $$;

create or replace function public._ahostdoc_seed_documents(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_prop uuid; v_doc1 uuid; v_doc2 uuid; v_doc3 uuid; v_doc4 uuid;
begin
  if exists (select 1 from public.aipify_hosts_documents where tenant_id = p_tenant_id limit 1) then
    return;
  end if;
  select id into v_prop from public.aipify_hosts_properties
  where tenant_id = p_tenant_id and status <> 'archived' limit 1;

  insert into public.aipify_hosts_documents (
    tenant_id, property_id, document_key, document_name, category, uploaded_by,
    upload_date, expiration_date, file_label
  ) values (
    p_tenant_id, v_prop, 'doc_house_rules', 'House Rules & Guest Guide', 'house_rules',
    'Operations Lead', current_date - 120, null, 'house-rules-v2.pdf'
  ) returning id into v_doc1;

  insert into public.aipify_hosts_documents (
    tenant_id, property_id, document_key, document_name, category, uploaded_by,
    upload_date, expiration_date, file_label
  ) values (
    p_tenant_id, v_prop, 'doc_emergency', 'Emergency Procedures', 'emergency_procedures',
    'Safety Coordinator', current_date - 90, current_date + 275, 'emergency-procedures.pdf'
  ) returning id into v_doc2;

  insert into public.aipify_hosts_documents (
    tenant_id, property_id, document_key, document_name, category, uploaded_by,
    upload_date, expiration_date, file_label
  ) values (
    p_tenant_id, v_prop, 'doc_insurance', 'Property Insurance Policy', 'insurance_documents',
    'Finance Admin', current_date - 200, current_date + 18, 'insurance-policy.pdf'
  ) returning id into v_doc3;

  insert into public.aipify_hosts_documents (
    tenant_id, property_id, document_key, document_name, category, uploaded_by,
    upload_date, expiration_date, file_label, is_archived
  ) values (
    p_tenant_id, v_prop, 'doc_vendor_old', 'Legacy Cleaning Agreement', 'vendor_agreements',
    'Operations Lead', current_date - 400, current_date - 30, 'cleaning-agreement-2024.pdf', true
  ) returning id into v_doc4;

  insert into public.aipify_hosts_document_versions (
    tenant_id, document_id, version_number, updated_by, change_notes, file_label
  ) values
    (p_tenant_id, v_doc1, 1, 'Operations Lead', 'Initial upload', 'house-rules-v1.pdf'),
    (p_tenant_id, v_doc1, 2, 'Operations Lead', 'Updated guest checkout section', 'house-rules-v2.pdf'),
    (p_tenant_id, v_doc2, 1, 'Safety Coordinator', 'Annual safety review', 'emergency-procedures.pdf'),
    (p_tenant_id, v_doc3, 1, 'Finance Admin', 'Policy renewal documentation', 'insurance-policy.pdf');
end; $$;

create or replace function public._ahostdoc_dashboard_stats(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'total_documents', (select count(*)::int from public.aipify_hosts_documents
      where tenant_id = p_tenant_id and is_archived = false),
    'expiring_documents', (select count(*)::int from public.aipify_hosts_documents
      where tenant_id = p_tenant_id and is_archived = false
        and public._ahostdoc_doc_status(expiration_date, is_archived) = 'expiring_soon'),
    'archived_documents', (select count(*)::int from public.aipify_hosts_documents
      where tenant_id = p_tenant_id and is_archived = true),
    'template_count', (select count(*)::int from public.aipify_hosts_document_templates
      where tenant_id = p_tenant_id),
    'property_vaults', (select count(distinct property_id)::int from public.aipify_hosts_documents
      where tenant_id = p_tenant_id and property_id is not null)
  ); $$;

create or replace function public._ahostdoc_property_vaults(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select coalesce(jsonb_agg(v order by v ->> 'property_name'), '[]'::jsonb)
  from (
    select jsonb_build_object(
      'property_id', p.id,
      'property_name', p.display_name,
      'document_count', (select count(*)::int from public.aipify_hosts_documents d
        where d.property_id = p.id and d.tenant_id = p_tenant_id and d.is_archived = false),
      'expiring_documents', (select count(*)::int from public.aipify_hosts_documents d
        where d.property_id = p.id and d.tenant_id = p_tenant_id and d.is_archived = false
          and public._ahostdoc_doc_status(d.expiration_date, d.is_archived) = 'expiring_soon'),
      'recently_updated', (select coalesce(jsonb_agg(sub.doc order by sub.updated_at desc), '[]'::jsonb)
        from (
          select jsonb_build_object(
            'id', d.id, 'document_name', d.document_name,
            'updated_at', to_char(d.updated_at, 'YYYY-MM-DD HH24:MI')
          ) as doc, d.updated_at
          from public.aipify_hosts_documents d
          where d.property_id = p.id and d.tenant_id = p_tenant_id and d.is_archived = false
          order by d.updated_at desc limit 3
        ) sub)
    ) as v
    from public.aipify_hosts_properties p
    where p.tenant_id = p_tenant_id and p.status <> 'archived'
  ) q; $$;

create or replace function public._ahostdoc_check_notifications(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare r record; v_prop uuid; v_missing text[];
begin
  for r in
    select d.id, d.document_name, d.expiration_date from public.aipify_hosts_documents d
    where d.tenant_id = p_tenant_id and d.is_archived = false
      and public._ahostdoc_doc_status(d.expiration_date, d.is_archived) = 'expiring_soon'
  loop
    perform public._ahostdoc_push_notification(p_tenant_id, 'doc_exp_' || r.id::text, 'important',
      'Document expiring within 30 days', r.document_name || ' expires ' || r.expiration_date::text);
  end loop;

  for v_prop in
    select p.id from public.aipify_hosts_properties p
    where p.tenant_id = p_tenant_id and p.status <> 'archived'
  loop
    v_missing := array[]::text[];
    if not exists (
      select 1 from public.aipify_hosts_documents d
      where d.tenant_id = p_tenant_id and d.property_id = v_prop
        and d.category = 'insurance_documents' and d.is_archived = false
    ) then v_missing := array_append(v_missing, 'insurance_documents'); end if;
    if not exists (
      select 1 from public.aipify_hosts_documents d
      where d.tenant_id = p_tenant_id and d.property_id = v_prop
        and d.category = 'emergency_procedures' and d.is_archived = false
    ) then v_missing := array_append(v_missing, 'emergency_procedures'); end if;
    if array_length(v_missing, 1) > 0 then
      perform public._ahostdoc_push_notification(p_tenant_id, 'doc_miss_' || v_prop::text, 'high',
        'Required document missing', 'Property vault is missing required documentation');
    end if;
  end loop;
end; $$;

create or replace function public.get_aipify_hosts_document_center_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_dc public.aipify_hosts_document_center_settings; v_hosts public.aipify_hosts_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_dc := public._ahostdoc_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_dc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'positioning', public._ahostbp387_positioning(),
    'route', '/app/aipify-hosts/documents',
    'stats', public._ahostdoc_dashboard_stats(v_tenant_id)
  );
end; $$;

create or replace function public.get_aipify_hosts_document_center_dashboard(
  p_section text default 'property_documents',
  p_search text default null,
  p_property_id uuid default null,
  p_category text default null,
  p_status text default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_dc public.aipify_hosts_document_center_settings; v_hosts public.aipify_hosts_settings;
  v_section text; v_docs jsonb; v_versions jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_dc := public._ahostdoc_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_section := coalesce(nullif(trim(p_section), ''), v_dc.default_section, 'property_documents');
  perform public._ahostdoc_seed_templates(v_tenant_id);
  perform public._ahostdoc_seed_documents(v_tenant_id);
  perform public._ahostdoc_check_notifications(v_tenant_id);
  perform public._ahostdoc_log_event(v_tenant_id, 'dashboard_view', 'Document Center viewed',
    jsonb_build_object('section', v_section));

  if v_section = 'templates' then
    v_docs := '[]'::jsonb;
  elsif v_section = 'archive' then
    select coalesce(jsonb_agg(public._ahostdoc_document_row(d, p.display_name) order by d.updated_at desc), '[]'::jsonb)
    into v_docs
    from public.aipify_hosts_documents d
    left join public.aipify_hosts_properties p on p.id = d.property_id
    where d.tenant_id = v_tenant_id and d.is_archived = true
      and (p_search is null or d.document_name ilike '%' || p_search || '%')
      and (p_property_id is null or d.property_id = p_property_id)
      and (p_category is null or d.category = p_category);
  else
    select coalesce(jsonb_agg(public._ahostdoc_document_row(d, prop.display_name) order by d.updated_at desc), '[]'::jsonb)
    into v_docs
    from public.aipify_hosts_documents d
    left join public.aipify_hosts_properties prop on prop.id = d.property_id
    where d.tenant_id = v_tenant_id and d.is_archived = false
      and d.category = any(public._ahostdoc_section_categories(v_section))
      and (p_search is null or d.document_name ilike '%' || p_search || '%')
      and (p_property_id is null or d.property_id = p_property_id)
      and (p_category is null or d.category = p_category)
      and (p_status is null or public._ahostdoc_doc_status(d.expiration_date, d.is_archived) = p_status);
  end if;

  select coalesce(jsonb_agg(public._ahostdoc_version_row(v) order by v.version_number desc), '[]'::jsonb)
  into v_versions
  from public.aipify_hosts_document_versions v
  where v.tenant_id = v_tenant_id
    and v.document_id in (
      select (doc ->> 'id')::uuid from jsonb_array_elements(v_docs) doc where doc ? 'id'
    );

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_dc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'active_section', v_section,
    'positioning', public._ahostbp387_positioning(),
    'governance', jsonb_build_object(
      'audit_uploads', true,
      'audit_downloads', true,
      'audit_deletions', true,
      'audit_replacements', true,
      'role_permissions', true
    ),
    'sections', public._ahostbp387_sections(),
    'document_categories', public._ahostbp387_categories(),
    'document_statuses', jsonb_build_array('active', 'expiring_soon', 'expired', 'archived'),
    'template_types', jsonb_build_array(
      'property_inspection_forms', 'incident_reports', 'vendor_agreements', 'safety_checklists'
    ),
    'stats', public._ahostdoc_dashboard_stats(v_tenant_id),
    'property_vaults', public._ahostdoc_property_vaults(v_tenant_id),
    'properties', (
      select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'display_name', p.display_name) order by p.display_name), '[]'::jsonb)
      from public.aipify_hosts_properties p
      where p.tenant_id = v_tenant_id and p.status <> 'archived'
    ),
    'documents', v_docs,
    'document_versions', v_versions,
    'templates', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', t.id, 'template_key', t.template_key, 'template_name', t.template_name,
        'template_type', t.template_type, 'description', coalesce(t.description, '—')
      ) order by t.template_name), '[]'::jsonb)
      from public.aipify_hosts_document_templates t where t.tenant_id = v_tenant_id
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 25 — Document Center Foundation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_25_DOCUMENT_CENTER.text',
      'route', '/app/aipify-hosts/documents'
    )
  );
end; $$;

create or replace function public.upload_aipify_hosts_document(
  p_document_name text,
  p_category text,
  p_property_id uuid default null,
  p_expiration_date date default null,
  p_file_label text default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid; v_key text; v_uploader text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if coalesce(trim(p_document_name), '') = '' then raise exception 'Document name required'; end if;
  v_uploader := public._ahostdoc_uploader_name();
  v_key := 'doc_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
  insert into public.aipify_hosts_documents (
    tenant_id, property_id, document_key, document_name, category, uploaded_by,
    upload_date, expiration_date, file_label
  ) values (
    v_tenant_id, p_property_id, v_key, trim(p_document_name), p_category,
    v_uploader, current_date, p_expiration_date, coalesce(p_file_label, trim(p_document_name))
  ) returning id into v_id;
  insert into public.aipify_hosts_document_versions (
    tenant_id, document_id, version_number, updated_by, change_notes, file_label
  ) values (
    v_tenant_id, v_id, 1, v_uploader, 'Initial upload', coalesce(p_file_label, trim(p_document_name))
  );
  perform public._ahostdoc_log_event(v_tenant_id, 'upload', 'Document uploaded',
    jsonb_build_object('document_id', v_id, 'document_name', trim(p_document_name)));
  perform public._ahostdoc_push_notification(v_tenant_id, 'doc_new_' || v_id::text, 'informational',
    'New document uploaded', trim(p_document_name) || ' was added to the document vault');
  return jsonb_build_object('success', true, 'document_id', v_id);
end; $$;

create or replace function public.perform_aipify_hosts_document_action(
  p_document_id uuid,
  p_action_type text,
  p_change_notes text default null,
  p_file_label text default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_doc public.aipify_hosts_documents; v_uploader text; v_summary text; v_new_ver integer;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  select * into v_doc from public.aipify_hosts_documents where id = p_document_id and tenant_id = v_tenant_id;
  if v_doc.id is null then raise exception 'Document not found'; end if;
  v_uploader := public._ahostdoc_uploader_name();

  if p_action_type = 'download' then
    perform public._ahostdoc_log_event(v_tenant_id, 'download', 'Document downloaded',
      jsonb_build_object('document_id', p_document_id, 'document_name', v_doc.document_name));
    v_summary := 'Download recorded';
  elsif p_action_type = 'replace_version' then
    v_new_ver := v_doc.current_version + 1;
    update public.aipify_hosts_documents set
      current_version = v_new_ver,
      file_label = coalesce(p_file_label, v_doc.file_label),
      updated_at = now()
    where id = p_document_id;
    insert into public.aipify_hosts_document_versions (
      tenant_id, document_id, version_number, updated_by, change_notes, file_label
    ) values (
      v_tenant_id, p_document_id, v_new_ver, v_uploader,
      coalesce(p_change_notes, 'Version updated'), coalesce(p_file_label, v_doc.file_label)
    );
    perform public._ahostdoc_push_notification(v_tenant_id, 'doc_rep_' || p_document_id::text, 'informational',
      'Document replaced', v_doc.document_name || ' was updated to version ' || v_new_ver);
    perform public._ahostdoc_log_event(v_tenant_id, 'replace', 'Document version replaced',
      jsonb_build_object('document_id', p_document_id, 'version', v_new_ver));
    v_summary := 'Version ' || v_new_ver || ' recorded';
  elsif p_action_type = 'archive' then
    update public.aipify_hosts_documents set is_archived = true, updated_at = now() where id = p_document_id;
    perform public._ahostdoc_log_event(v_tenant_id, 'archive', 'Document archived',
      jsonb_build_object('document_id', p_document_id));
    v_summary := 'Document archived';
  elsif p_action_type = 'share_internally' then
    perform public._ahostdoc_push_notification(v_tenant_id, 'doc_share_' || p_document_id::text, 'informational',
      'Document shared internally', v_doc.document_name || ' was shared with your team');
    perform public._ahostdoc_log_event(v_tenant_id, 'share', 'Document shared internally',
      jsonb_build_object('document_id', p_document_id));
    v_summary := 'Document shared internally';
  else
    raise exception 'Invalid action type';
  end if;

  return jsonb_build_object('success', true, 'document_id', p_document_id, 'action_type', p_action_type, 'summary', v_summary);
end; $$;

create or replace function public.seed_aipify_hosts_document_center_knowledge_airbnb25()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ahostkc_ensure_category(
    'aipify-hosts-documents', 'Hosts Document Center',
    'Retention standards, property documentation, insurance, and compliance guidance.', 321
  );
  perform public._ahostkc_seed_article('aipify-hosts-documents', 'document-retention-standards', 'Document retention standards',
    'Define how long operational, financial, and compliance documents must be retained and when to archive.');
  perform public._ahostkc_seed_article('aipify-hosts-documents', 'property-documentation-best-practices', 'Property documentation best practices',
    'Keep house rules, manuals, and inspection records organized per property vault for fast retrieval.');
  perform public._ahostkc_seed_article('aipify-hosts-documents', 'insurance-documentation-guidance', 'Insurance documentation guidance',
    'Track policy renewals, expiration dates, and required coverage documentation for every property.');
  perform public._ahostkc_seed_article('aipify-hosts-documents', 'compliance-documentation-procedures', 'Compliance documentation procedures',
    'Maintain licenses, safety inspections, and regulatory documents with verified expiration tracking.');
end; $$;

select public.seed_aipify_hosts_document_center_knowledge_airbnb25();

grant execute on function public.get_aipify_hosts_document_center_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_document_center_dashboard(text, text, uuid, text, text, uuid) to authenticated;
grant execute on function public.upload_aipify_hosts_document(text, text, uuid, date, text, uuid) to authenticated;
grant execute on function public.perform_aipify_hosts_document_action(uuid, text, text, text, uuid) to authenticated;
grant execute on function public.seed_aipify_hosts_document_center_knowledge_airbnb25() to authenticated;
