-- PREPARED_ONLY — do not apply without explicit owner approval.
-- Package: AIPIFY_APP_CUSTOMER_SERVICE_INBOX_TICKET_DESIGN_V3
-- Target: Production Core qbcqoixhrvhnuwphefvw
-- Purpose: Attach customer-visible portal messages to APP get_app_portal_support_request
--          and a last-message excerpt on list rows — never internal notes or drafts.
--
-- DEPENDS ON (already on Production as of 2026-11-26):
--   app_portal_support_request_messages
--   reply_app_portal_support_request / publish_app_portal_support_request_message
--   app_portal_support_hide_internal_notes_from_customers_v1 (SHA 6d2732c5…)
--
-- RULES:
--   - Only visibility = 'customer_visible'
--   - Newest messages first in detail.messages
--   - Never return internal_notes / internal_notes_full
--   - Email stays OFF (no send)
--
-- APPROVAL TEXT:
-- "Approve apply of docs/platform/sql-candidates/app_portal_support_customer_visible_messages_in_get_v1.sql
--  to Production Core qbcqoixhrvhnuwphefvw so APP get/list expose customer_visible portal messages
--  only; no internal notes; no email activation."

begin;

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
  v_messages jsonb;
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

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id,
    'body', m.body,
    'author_role', m.author_role,
    'author_name', coalesce(u.full_name, case
      when m.author_role in ('platform_agent', 'support', 'aipify') then 'Aipify'
      else 'Customer'
    end),
    'visibility', m.visibility,
    'created_at', m.created_at
  ) order by m.created_at desc), '[]'::jsonb)
  into v_messages
  from public.app_portal_support_request_messages m
  left join public.users u on u.id = m.author_user_id
  where m.request_id = p_id
    and m.visibility = 'customer_visible';

  v_request := public._apsr271_request_row(v_r) || jsonb_build_object(
    'description_full', v_r.description,
    'attachments', v_r.attachments
  );

  return jsonb_build_object(
    'found', true,
    'can_manage', v_can_manage,
    'request', v_request,
    'messages', v_messages,
    'status_history', v_status_history,
    'timeline', v_timeline,
    'audit_history', v_timeline,
    'related_activity', v_related_activity,
    'attachments_placeholder', jsonb_array_length(v_r.attachments) = 0
  );
end;
$$;

-- List helper: optional last customer-visible excerpt on each row.
create or replace function public._apsr271_request_row(r public.app_portal_support_requests)
returns jsonb
language plpgsql
stable
as $$
declare
  v_creator text;
  v_assignee text;
  v_excerpt text;
  v_author text;
begin
  select coalesce(u.full_name, 'Unknown') into v_creator from public.users u where u.id = r.created_by;
  select coalesce(u.full_name, 'Unassigned') into v_assignee from public.users u where u.id = r.assigned_support_owner_id;

  select left(m.body, 180), coalesce(u.full_name, m.author_role)
  into v_excerpt, v_author
  from public.app_portal_support_request_messages m
  left join public.users u on u.id = m.author_user_id
  where m.request_id = r.id
    and m.visibility = 'customer_visible'
  order by m.created_at desc
  limit 1;

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
    'last_message_excerpt', coalesce(v_excerpt, left(r.description, 180)),
    'last_message_author', v_author,
    'created_at', r.created_at,
    'updated_at', r.updated_at,
    'resolved_at', r.resolved_at
  );
end;
$$;

commit;
