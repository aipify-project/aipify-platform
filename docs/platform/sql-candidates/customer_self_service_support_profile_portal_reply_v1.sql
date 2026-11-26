-- PREPARED_ONLY — do not apply without explicit owner approval.
-- Package: AIPIFY_CUSTOMER_SELF_SERVICE_SUPPORT_PROFILE_SUBSCRIPTION_V1
-- Target: Production Core qbcqoixhrvhnuwphefvw (after Staging verification if required)
-- Purpose: Customer-visible portal messages on APP support requests + personal profile write RPC.
-- Email remains OFF. Internal notes stay internal. Align with Support Center #400 contracts.
--
-- APPROVAL TEXT (copy for owner):
-- "Approve apply of docs/platform/sql-candidates/customer_self_service_support_profile_portal_reply_v1.sql
--  to Production Core qbcqoixhrvhnuwphefvw for customer portal reply + personal profile update RPCs.
--  No email activation. No Staging foundation bootstrap."

begin;

-- ---------------------------------------------------------------------------
-- 1) Customer-visible portal messages (not email, not internal notes)
-- ---------------------------------------------------------------------------
create table if not exists public.app_portal_support_request_messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.app_portal_support_requests(id) on delete cascade,
  company_id uuid not null,
  author_user_id uuid not null,
  author_role text not null check (author_role in ('customer', 'support')),
  visibility text not null default 'customer_visible'
    check (visibility = 'customer_visible'),
  body text not null check (char_length(body) between 1 and 5000),
  email_status text not null default 'not_sent'
    check (email_status in ('not_sent', 'not_applicable')),
  created_at timestamptz not null default now()
);

create index if not exists app_portal_support_request_messages_request_created_idx
  on public.app_portal_support_request_messages (request_id, created_at);

alter table public.app_portal_support_request_messages enable row level security;
revoke all on public.app_portal_support_request_messages from public, anon, authenticated;

-- Customer posts a portal reply on a request they can view (own or manager scope via existing helper).
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

-- Platform/support intentionally publishes a customer-visible portal message (email still OFF).
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
    'message_id', v_msg_id,
    'email_status', 'not_sent',
    'visibility', 'customer_visible'
  );
end;
$$;

revoke all on function public.publish_app_portal_support_request_message(uuid, text, text) from public, anon;
grant execute on function public.publish_app_portal_support_request_message(uuid, text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 2) Personal profile write (name) — tenant-scoped to auth.uid()
-- ---------------------------------------------------------------------------
create or replace function public.update_app_customer_personal_profile(
  p_full_name text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_auth uuid := auth.uid();
  v_name text := left(trim(coalesce(p_full_name, '')), 120);
begin
  if v_auth is null then
    raise exception 'not_authenticated';
  end if;
  if char_length(v_name) < 1 then
    raise exception 'full_name_required';
  end if;

  update public.users
  set full_name = v_name
  where auth_user_id = v_auth;

  if not found then
    raise exception 'profile_not_found';
  end if;

  return jsonb_build_object('ok', true, 'full_name', v_name);
end;
$$;

revoke all on function public.update_app_customer_personal_profile(text) from public, anon;
grant execute on function public.update_app_customer_personal_profile(text) to authenticated;

commit;
