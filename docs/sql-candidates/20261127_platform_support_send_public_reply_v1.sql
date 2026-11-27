-- SQL CANDIDATE — NOT APPLIED
-- Task: AIPIFY_UNIFIED_SUPPORT_APP_GROWTH_PARTNERS_COMPLETE_V1_20261127
-- Target: Staging auedugihkduoaikfusqe first, then Production qbcqoixhrvhnuwphefvw (separate YES)
-- Purpose: Authorized Platform public reply that is visible in APP inbox (customer_visible),
--          with audit + idempotency. Email remains OFF (email_status = not_sent).
--
-- Does NOT: send email, expose internal notes, grant anon, touch #383 sales CRM, #459 address SQL.
-- Depends on: app_portal_support_requests, app_portal_support_request_messages,
--             platform_support_ticket_messages, _ppsf258_require_platform_access(),
--             platform_support_ticket_admin_audit
-- Companion (separate YES if still missing on APP get): 
--   docs/platform/sql-candidates/app_portal_support_customer_visible_messages_in_get_v1.sql
--
-- Gate: exact owner YES. Compute SHA256 at apply time.

-- Allow in-app delivery state distinct from email send.
alter table public.platform_support_ticket_messages
  drop constraint if exists platform_support_ticket_messages_delivery_status_check;

alter table public.platform_support_ticket_messages
  add constraint platform_support_ticket_messages_delivery_status_check
  check (delivery_status = any (array[
    'not_applicable'::text,
    'draft'::text,
    'queued'::text,
    'sent'::text,
    'failed'::text,
    'blocked_unconfigured'::text,
    'inbox_persisted'::text
  ]));

create table if not exists public.platform_support_public_reply_idempotency (
  organization_scope text not null default 'platform',
  actor_user_id uuid not null,
  ticket_id uuid not null references public.app_portal_support_requests (id) on delete cascade,
  idempotency_key text not null,
  message_id uuid not null,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (actor_user_id, ticket_id, idempotency_key)
);

alter table public.platform_support_public_reply_idempotency enable row level security;
revoke all on public.platform_support_public_reply_idempotency from public, anon, authenticated;

create or replace function public.platform_support_send_public_reply(
  p_ticket_id uuid,
  p_body text,
  p_idempotency_key text default null,
  p_template_id text default null,
  p_template_version integer default null,
  p_include_signature boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_body text := left(btrim(coalesce(p_body, '')), 5000);
  v_ticket public.app_portal_support_requests%rowtype;
  v_app_msg_id uuid;
  v_plat_msg_id uuid;
  v_key text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_existing uuid;
begin
  perform public._ppsf258_require_platform_access();

  if p_ticket_id is null or char_length(v_body) < 1 then
    raise exception 'invalid argument';
  end if;

  select * into v_ticket
  from public.app_portal_support_requests
  where id = p_ticket_id
  for update;

  if v_ticket.id is null then
    raise exception 'not found';
  end if;

  if v_key is not null then
    select message_id into v_existing
    from public.platform_support_public_reply_idempotency
    where actor_user_id = v_uid
      and ticket_id = p_ticket_id
      and idempotency_key = v_key;
    if v_existing is not null then
      return jsonb_build_object(
        'ok', true,
        'idempotent', true,
        'id', v_existing,
        'app_message_id', v_existing,
        'direction', 'outbound',
        'delivery_status', 'inbox_persisted',
        'email_status', 'not_sent'
      );
    end if;
  end if;

  -- APP-visible thread (author_role must be customer|support per table check)
  insert into public.app_portal_support_request_messages (
    request_id, company_id, author_user_id, author_role, visibility, body, email_status
  ) values (
    v_ticket.id, v_ticket.company_id, v_uid, 'support', 'customer_visible', v_body, 'not_sent'
  ) returning id into v_app_msg_id;

  insert into public.platform_support_ticket_messages (
    ticket_id, direction, body_text, author_user_id, author_role, delivery_status,
    template_id, template_version, signature_version
  ) values (
    v_ticket.id, 'outbound', left(v_body, 20000), v_uid, 'platform_agent', 'inbox_persisted',
    nullif(btrim(coalesce(p_template_id, '')), ''), p_template_version, null
  ) returning id into v_plat_msg_id;

  update public.app_portal_support_requests
  set status = case
        when status in ('new', 'open', 'in_progress', 'waiting_for_aipify', 'reopened')
          then 'waiting_for_customer'
        else status
      end,
      updated_at = timezone('utc', now())
  where id = v_ticket.id;

  insert into public.platform_support_ticket_admin_audit (
    ticket_id, event_type, description, performed_by, metadata
  ) values (
    v_ticket.id,
    'public_reply_sent',
    'Public reply persisted to customer inbox (email not sent)',
    v_uid,
    jsonb_build_object(
      'app_message_id', v_app_msg_id,
      'platform_message_id', v_plat_msg_id,
      'delivery_status', 'inbox_persisted',
      'email_status', 'not_sent',
      'include_signature', coalesce(p_include_signature, false)
    )
  );

  if v_key is not null then
    insert into public.platform_support_public_reply_idempotency (
      actor_user_id, ticket_id, idempotency_key, message_id
    ) values (v_uid, v_ticket.id, v_key, v_app_msg_id)
    on conflict do nothing;
  end if;

  return jsonb_build_object(
    'ok', true,
    'idempotent', false,
    'id', v_app_msg_id,
    'app_message_id', v_app_msg_id,
    'platform_message_id', v_plat_msg_id,
    'direction', 'outbound',
    'delivery_status', 'inbox_persisted',
    'email_status', 'not_sent'
  );
end;
$$;

revoke all on function public.platform_support_send_public_reply(
  uuid, text, text, text, integer, boolean
) from public, anon;

grant execute on function public.platform_support_send_public_reply(
  uuid, text, text, text, integer, boolean
) to authenticated, service_role;

-- ROLLBACK (owner-only):
--   drop function if exists public.platform_support_send_public_reply(uuid, text, text, text, integer, boolean);
--   drop table if exists public.platform_support_public_reply_idempotency;
--   -- restore prior delivery_status check without inbox_persisted if required
