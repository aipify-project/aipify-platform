-- PREPARED_ONLY — NO_SQL_APPLY without exact owner YES.
-- Package: AIPIFY_SUPPORT_APP_CORE_FOUNDATION_STAGING_V1
-- Target: Staging Core auedugihkduoaikfusqe ONLY
-- Purpose: Minimal customer portal reply + support publish RPCs ONLY.
--          Extracted from customer_self_service_support_profile_portal_reply_v1.sql
--          WITHOUT update_app_customer_personal_profile / profile writes.
-- Depends on: app_portal_support_request_messages (already on Staging),
--             _apsr271_access_context / _apsr271_can_view_request / _apsr271_log_event
--             (Phase 271).
-- Email remains OFF (email_status = not_sent). Idempotent customer reply within 2 minutes.
--
-- APPROVAL TEXT:
-- "JA STAGING APPLY …/20261127_staging_app_portal_support_customer_reply_only_v1.sql
--  SHA256 <see .sha256 sidecar / preflight report> on auedugihkduoaikfusqe only.
--  No email. No Production. No profile RPC. No #459. No #383."

begin;

create or replace function public.reply_app_portal_support_request(
  p_id uuid,
  p_body text,
  p_idempotency_key text default null
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
  v_body text := left(trim(coalesce(p_body, '')), 5000);
  v_msg_id uuid;
  v_existing uuid;
begin
  if char_length(v_body) < 1 then
    raise exception 'empty_body';
  end if;

  v_ctx := public._apsr271_access_context();
  v_user_id := (v_ctx->>'user_id')::uuid;

  select * into v_r from public.app_portal_support_requests where id = p_id;
  if v_r.id is null then raise exception 'Support request not found'; end if;
  if not public._apsr271_can_view_request(v_r.company_id, v_r.created_by, v_ctx) then
    raise exception 'Support request access denied';
  end if;

  if p_idempotency_key is not null and length(trim(p_idempotency_key)) > 0 then
    select m.id into v_existing
    from public.app_portal_support_request_messages m
    where m.request_id = p_id
      and m.author_user_id = v_user_id
      and m.body = v_body
      and m.created_at > now() - interval '2 minutes'
    order by m.created_at desc
    limit 1;
    if v_existing is not null then
      return jsonb_build_object(
        'ok', true,
        'idempotent', true,
        'message_id', v_existing,
        'email_status', 'not_sent'
      );
    end if;
  end if;

  -- Also dedupe identical body+author within 2 minutes when key omitted.
  select m.id into v_existing
  from public.app_portal_support_request_messages m
  where m.request_id = p_id
    and m.author_user_id = v_user_id
    and m.body = v_body
    and m.created_at > now() - interval '2 minutes'
  order by m.created_at desc
  limit 1;
  if v_existing is not null then
    return jsonb_build_object(
      'ok', true,
      'idempotent', true,
      'message_id', v_existing,
      'email_status', 'not_sent'
    );
  end if;

  insert into public.app_portal_support_request_messages (
    request_id, company_id, author_user_id, author_role, visibility, body, email_status
  ) values (
    p_id, v_r.company_id, v_user_id, 'customer', 'customer_visible', v_body, 'not_sent'
  ) returning id into v_msg_id;

  update public.app_portal_support_requests
  set status = case
        when status in ('waiting_for_customer', 'resolved', 'closed') then 'waiting_for_aipify'
        else status
      end,
      updated_at = now()
  where id = p_id;

  perform public._apsr271_log_event(
    p_id,
    v_r.company_id,
    'customer_portal_reply',
    'Customer posted a portal message',
    v_user_id,
    jsonb_build_object('message_id', v_msg_id, 'email_status', 'not_sent')
  );

  return jsonb_build_object(
    'ok', true,
    'idempotent', false,
    'message_id', v_msg_id,
    'email_status', 'not_sent'
  );
end;
$$;

revoke all on function public.reply_app_portal_support_request(uuid, text, text) from public, anon;
grant execute on function public.reply_app_portal_support_request(uuid, text, text) to authenticated;

create or replace function public.publish_app_portal_support_request_message(
  p_id uuid,
  p_body text,
  p_idempotency_key text default null
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
  v_body text := left(trim(coalesce(p_body, '')), 5000);
  v_msg_id uuid;
  v_existing uuid;
begin
  if char_length(v_body) < 1 then
    raise exception 'empty_body';
  end if;

  v_ctx := public._apsr271_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Support request access denied';
  end if;
  v_user_id := (v_ctx->>'user_id')::uuid;

  select * into v_r from public.app_portal_support_requests where id = p_id;
  if v_r.id is null then raise exception 'Support request not found'; end if;
  if not public._apsr271_can_view_request(v_r.company_id, v_r.created_by, v_ctx) then
    raise exception 'Support request access denied';
  end if;

  if p_idempotency_key is not null and length(trim(p_idempotency_key)) > 0 then
    select m.id into v_existing
    from public.app_portal_support_request_messages m
    where m.request_id = p_id
      and m.author_user_id = v_user_id
      and m.body = v_body
      and m.author_role = 'support'
      and m.created_at > now() - interval '2 minutes'
    order by m.created_at desc
    limit 1;
    if v_existing is not null then
      return jsonb_build_object(
        'ok', true,
        'idempotent', true,
        'message_id', v_existing,
        'email_status', 'not_sent',
        'visibility', 'customer_visible'
      );
    end if;
  end if;

  insert into public.app_portal_support_request_messages (
    request_id, company_id, author_user_id, author_role, visibility, body, email_status
  ) values (
    p_id, v_r.company_id, v_user_id, 'support', 'customer_visible', v_body, 'not_sent'
  ) returning id into v_msg_id;

  update public.app_portal_support_requests
  set status = case when status = 'waiting_for_aipify' then 'waiting_for_customer' else status end,
      updated_at = now()
  where id = p_id;

  perform public._apsr271_log_event(
    p_id,
    v_r.company_id,
    'support_portal_publish',
    'Support published a customer-visible portal message',
    v_user_id,
    jsonb_build_object('message_id', v_msg_id, 'email_status', 'not_sent')
  );

  return jsonb_build_object(
    'ok', true,
    'idempotent', false,
    'message_id', v_msg_id,
    'email_status', 'not_sent',
    'visibility', 'customer_visible'
  );
end;
$$;

revoke all on function public.publish_app_portal_support_request_message(uuid, text, text) from public, anon;
grant execute on function public.publish_app_portal_support_request_message(uuid, text, text) to authenticated;

commit;
