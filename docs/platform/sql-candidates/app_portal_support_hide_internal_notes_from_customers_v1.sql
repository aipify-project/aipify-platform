-- PREPARED_ONLY — do not apply without explicit owner approval.
-- Package: AIPIFY_CUSTOMER_SELF_SERVICE_SUPPORT_PROFILE_SUBSCRIPTION_V1 (follow-up)
-- Target: Production Core qbcqoixhrvhnuwphefvw
-- Purpose: Customer APP support RPCs must NEVER return or accept internal notes.
--
-- BOUNDARY EVIDENCE (Production _apsr271_access_context):
--   can_manage = organization_role IN
--     ('organization_owner', 'organization_admin', 'organization_manager')
--   That is a CUSTOMER org role gate — NOT Aipify platform support.
--   Therefore APP list/detail/history/create/update must strip notes for
--   owner, admin, manager, AND staff alike.
--
-- Aipify saksbehandlere use Platform RPCs:
--   platform_support_post_internal_note → platform_support_ticket_messages
--     (direction = 'internal_note', author_role = 'platform_agent')
--   Platform detail is gated by _ppsf258_require_platform_access().
--
-- Published customer-visible portal replies
--   (reply_app_portal_support_request / publish_app_portal_support_request_message)
-- remain unchanged and do not touch internal_notes.
--
-- No email activation. No Staging foundation bootstrap.
--
-- APPROVAL TEXT (copy for owner):
-- "Approve apply of docs/platform/sql-candidates/app_portal_support_hide_internal_notes_from_customers_v1.sql
--  to Production Core qbcqoixhrvhnuwphefvw so customer APP support list/detail/history/create/update
--  never return or write internal_notes; Aipify agents keep notes via Platform RPCs only.
--  No email activation."

begin;

-- Shared row: never includes internal_notes / internal_notes_full.
-- Used by list, history, create, update, and get (via merge).
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
    'channel', coalesce(r.channel, 'app_portal'),
    'created_by_id', r.created_by,
    'created_by', coalesce(v_creator, 'Unknown'),
    'assigned_support_owner_id', r.assigned_support_owner_id,
    'assigned_support_owner', coalesce(v_assignee, 'Unassigned'),
    'related_module', r.related_module,
    'attachments', r.attachments,
    'created_at', r.created_at,
    'updated_at', r.updated_at,
    'resolved_at', r.resolved_at
  );
end;
$$;

-- Drop the mistaken manager-only helper if a prior candidate draft created it.
drop function if exists public._apsr271_internal_notes_fields(public.app_portal_support_requests);

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
  v_can_manage boolean := false;
  v_request jsonb;
begin
  v_ctx := public._apsr271_access_context();
  v_can_manage := coalesce(v_ctx->>'can_manage', 'false') = 'true';
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

  -- Customer-safe request object: description/attachments only — never notes.
  v_request := public._apsr271_request_row(v_r) || jsonb_build_object(
    'description_full', v_r.description,
    'attachments', v_r.attachments
  );

  return jsonb_build_object(
    'found', true,
    'can_manage', v_can_manage,
    'request', v_request,
    'status_history', v_status_history,
    'timeline', v_timeline,
    'audit_history', v_timeline,
    'related_activity', v_related_activity,
    'comments_placeholder', true,
    -- Notes are Platform-only; APP always shows the placeholder (no notes body).
    'internal_notes_placeholder', true,
    'attachments_placeholder', jsonb_array_length(v_r.attachments) = 0
  );
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
  v_can_manage boolean := false;
begin
  v_ctx := public._apsr271_access_context();
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_can_manage := coalesce(v_ctx->>'can_manage', 'false') = 'true';
  select * into v_r from public.app_portal_support_requests where id = p_id;
  if v_r.id is null then raise exception 'Support request not found'; end if;
  if not public._apsr271_can_view_request(v_r.company_id, v_r.created_by, v_ctx) then
    raise exception 'Support request access denied';
  end if;

  -- p_internal_notes is intentionally ignored on the APP portal path.
  -- Aipify agents write internal notes via platform_support_post_internal_note.
  if p_internal_notes is not null then
    null;
  end if;

  v_new_status := coalesce(nullif(trim(p_status), ''), v_r.status);

  update public.app_portal_support_requests set
    title = coalesce(nullif(trim(p_title), ''), title),
    description = case when p_description is not null then left(p_description, 5000) else description end,
    category = coalesce(nullif(trim(p_category), ''), category),
    priority = coalesce(nullif(trim(p_priority), ''), priority),
    status = v_new_status,
    related_module = case when p_related_module is not null then nullif(trim(p_related_module), '') else related_module end,
    -- Do not mutate internal_notes from APP callers (any customer role).
    updated_at = now()
  where id = p_id;

  if p_status is not null and v_new_status <> v_r.status then
    perform public._apsr271_log_event(p_id, v_r.company_id, 'status_changed', format('Status updated to %s', v_new_status), v_user_id, jsonb_build_object('status', v_new_status));
  else
    perform public._apsr271_log_event(p_id, v_r.company_id, 'updated', 'Support request updated', v_user_id, '{}'::jsonb);
  end if;

  select * into v_r from public.app_portal_support_requests where id = p_id;

  return jsonb_build_object(
    'updated', true,
    'can_manage', v_can_manage,
    'request', public._apsr271_request_row(v_r)
  );
end;
$$;

-- list_app_portal_support_requests / get_app_portal_support_history / create_app_portal_support_request
-- inherit the safe row helper (no notes) without body changes.
--
-- reply_app_portal_support_request / publish_app_portal_support_request_message
-- are customer-visible portal messages only; they never read/write internal_notes.

commit;
