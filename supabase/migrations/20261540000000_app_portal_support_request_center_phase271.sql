-- Phase 271 (APP) — Customer Support Request Center

create table if not exists public.app_portal_support_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  description text not null default '',
  category text not null default 'general' check (category in (
    'technical', 'billing', 'integrations', 'business_packs', 'account', 'security', 'general'
  )),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  status text not null default 'open' check (status in (
    'open', 'in_review', 'waiting_for_customer', 'waiting_for_aipify', 'resolved', 'closed'
  )),
  created_by uuid references public.users (id) on delete set null,
  assigned_support_owner_id uuid references public.users (id) on delete set null,
  related_module text,
  attachments jsonb not null default '[]'::jsonb,
  internal_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_portal_support_requests_company_idx
  on public.app_portal_support_requests (company_id, status, updated_at desc);

create table if not exists public.app_portal_support_request_audit_logs (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.app_portal_support_requests (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_support_request_audit_idx
  on public.app_portal_support_request_audit_logs (request_id, created_at desc);

alter table public.app_portal_support_requests enable row level security;
alter table public.app_portal_support_request_audit_logs enable row level security;
revoke all on public.app_portal_support_requests from authenticated, anon;
revoke all on public.app_portal_support_request_audit_logs from authenticated, anon;

create or replace function public._apsr271_access_context()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_user public.users;
begin
  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_manage', (v_access->>'organization_role') in ('organization_owner', 'organization_admin', 'organization_manager')
  );
end;
$$;

create or replace function public._apsr271_can_view_request(
  p_company_id uuid,
  p_created_by uuid,
  p_ctx jsonb
)
returns boolean
language sql
immutable
as $$
  select (p_ctx->>'company_id')::uuid = p_company_id
    and (
      coalesce(p_ctx->>'can_manage', 'false') = 'true'
      or (p_ctx->>'user_id')::uuid = p_created_by
    );
$$;

create or replace function public._apsr271_request_row(r public.app_portal_support_requests)
returns jsonb
language plpgsql
stable
as $$
declare
  v_creator text;
  v_assignee text;
begin
  select coalesce(u.full_name, 'Unknown') into v_creator from public.users u where u.id = r.created_by;
  select coalesce(u.full_name, 'Unassigned') into v_assignee from public.users u where u.id = r.assigned_support_owner_id;
  return jsonb_build_object(
    'id', r.id,
    'title', r.title,
    'description', left(r.description, 500),
    'category', r.category,
    'priority', r.priority,
    'status', r.status,
    'created_by_id', r.created_by,
    'created_by', coalesce(v_creator, 'Unknown'),
    'assigned_support_owner_id', r.assigned_support_owner_id,
    'assigned_support_owner', coalesce(v_assignee, 'Unassigned'),
    'related_module', r.related_module,
    'attachments', r.attachments,
    'internal_notes', case when r.internal_notes = '' then null else left(r.internal_notes, 200) end,
    'created_at', r.created_at,
    'updated_at', r.updated_at
  );
end;
$$;

create or replace function public._apsr271_log_event(
  p_request_id uuid,
  p_company_id uuid,
  p_event_type text,
  p_description text,
  p_performed_by uuid,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare v_id uuid;
begin
  insert into public.app_portal_support_request_audit_logs (
    request_id, company_id, event_type, description, performed_by, metadata
  ) values (
    p_request_id, p_company_id, p_event_type, left(coalesce(p_description, ''), 500),
    p_performed_by, coalesce(p_metadata, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.list_app_portal_support_requests(
  p_category text default null,
  p_status text default null,
  p_priority text default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_items jsonb := '[]'::jsonb;
begin
  v_ctx := public._apsr271_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(public._apsr271_request_row(r) order by r.updated_at desc), '[]'::jsonb)
  into v_items
  from public.app_portal_support_requests r
  where r.company_id = v_company_id
    and public._apsr271_can_view_request(r.company_id, r.created_by, v_ctx)
    and (p_category is null or r.category = p_category)
    and (p_status is null or r.status = p_status)
    and (p_priority is null or r.priority = p_priority)
    and (
      p_search is null or trim(p_search) = ''
      or r.title ilike '%' || trim(p_search) || '%'
      or r.description ilike '%' || trim(p_search) || '%'
    );

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'items', v_items,
    'principle', 'Aipify Support keeps your organization requests organized with clear status, priority and accountability.'
  );
end;
$$;

create or replace function public.get_app_portal_support_request(p_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_r public.app_portal_support_requests;
  v_timeline jsonb;
  v_status_history jsonb;
  v_related_activity jsonb := '[]'::jsonb;
begin
  v_ctx := public._apsr271_access_context();
  select * into v_r from public.app_portal_support_requests where id = p_id;
  if v_r.id is null then return jsonb_build_object('found', false); end if;
  if not public._apsr271_can_view_request(v_r.company_id, v_r.created_by, v_ctx) then
    raise exception 'Support request access denied';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description,
    'created_at', l.created_at, 'performed_by', coalesce(u.full_name, 'System')
  ) order by l.created_at desc), '[]'::jsonb)
  into v_timeline
  from public.app_portal_support_request_audit_logs l
  left join public.users u on u.id = l.performed_by
  where l.request_id = p_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'status', coalesce(l.metadata->>'status', l.event_type),
    'at', l.created_at,
    'description', l.description
  ) order by l.created_at asc), '[]'::jsonb)
  into v_status_history
  from public.app_portal_support_request_audit_logs l
  where l.request_id = p_id and l.event_type in ('created', 'status_changed');

  if to_regclass('public.app_portal_support_request_audit_logs') is not null then
    v_related_activity := v_timeline;
  end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'request', public._apsr271_request_row(v_r) || jsonb_build_object(
      'description_full', v_r.description,
      'internal_notes_full', v_r.internal_notes,
      'attachments', v_r.attachments
    ),
    'status_history', v_status_history,
    'timeline', v_timeline,
    'audit_history', v_timeline,
    'related_activity', v_related_activity,
    'comments_placeholder', true,
    'internal_notes_placeholder', true,
    'attachments_placeholder', jsonb_array_length(v_r.attachments) = 0
  );
end;
$$;

create or replace function public.create_app_portal_support_request(
  p_title text,
  p_description text default '',
  p_category text default 'general',
  p_priority text default 'medium',
  p_related_module text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_id uuid;
  v_r public.app_portal_support_requests;
begin
  v_ctx := public._apsr271_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.app_portal_support_requests (
    company_id, title, description, category, priority, status, created_by, related_module
  ) values (
    v_company_id,
    left(trim(p_title), 200),
    left(coalesce(p_description, ''), 5000),
    coalesce(nullif(trim(p_category), ''), 'general'),
    coalesce(nullif(trim(p_priority), ''), 'medium'),
    'open',
    v_user_id,
    nullif(trim(p_related_module), '')
  ) returning id into v_id;

  perform public._apsr271_log_event(v_id, v_company_id, 'created', 'Support request created', v_user_id, jsonb_build_object('status', 'open'));

  select * into v_r from public.app_portal_support_requests where id = v_id;
  return jsonb_build_object('created', true, 'request', public._apsr271_request_row(v_r));
end;
$$;

create or replace function public.update_app_portal_support_request(
  p_id uuid,
  p_title text default null,
  p_description text default null,
  p_category text default null,
  p_priority text default null,
  p_status text default null,
  p_related_module text default null,
  p_internal_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_r public.app_portal_support_requests;
  v_user_id uuid;
  v_new_status text;
begin
  v_ctx := public._apsr271_access_context();
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_r from public.app_portal_support_requests where id = p_id;
  if v_r.id is null then raise exception 'Support request not found'; end if;
  if not public._apsr271_can_view_request(v_r.company_id, v_r.created_by, v_ctx) then
    raise exception 'Support request access denied';
  end if;

  v_new_status := coalesce(nullif(trim(p_status), ''), v_r.status);

  update public.app_portal_support_requests set
    title = coalesce(nullif(trim(p_title), ''), title),
    description = case when p_description is not null then left(p_description, 5000) else description end,
    category = coalesce(nullif(trim(p_category), ''), category),
    priority = coalesce(nullif(trim(p_priority), ''), priority),
    status = v_new_status,
    related_module = case when p_related_module is not null then nullif(trim(p_related_module), '') else related_module end,
    internal_notes = case
      when p_internal_notes is not null and coalesce(v_ctx->>'can_manage', 'false') = 'true'
      then left(p_internal_notes, 2000) else internal_notes
    end,
    updated_at = now()
  where id = p_id;

  if p_status is not null and v_new_status <> v_r.status then
    perform public._apsr271_log_event(p_id, v_r.company_id, 'status_changed', format('Status updated to %s', v_new_status), v_user_id, jsonb_build_object('status', v_new_status));
  else
    perform public._apsr271_log_event(p_id, v_r.company_id, 'updated', 'Support request updated', v_user_id, '{}'::jsonb);
  end if;

  select * into v_r from public.app_portal_support_requests where id = p_id;
  return jsonb_build_object('updated', true, 'request', public._apsr271_request_row(v_r));
end;
$$;

grant execute on function public.list_app_portal_support_requests(text, text, text, text) to authenticated;
grant execute on function public.get_app_portal_support_request(uuid) to authenticated;
grant execute on function public.create_app_portal_support_request(text, text, text, text, text) to authenticated;
grant execute on function public.update_app_portal_support_request(uuid, text, text, text, text, text, text, text) to authenticated;
