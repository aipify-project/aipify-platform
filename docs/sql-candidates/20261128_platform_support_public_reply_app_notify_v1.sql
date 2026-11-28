-- SQL CANDIDATE — NOT APPLIED
-- Task: AIPIFY_PUBLIC_GROWTH_SUPPORT_ANALYTICS_COMPLETE_MASTER_V2 (Agent 3)
-- Target: Staging auedugihkduoaikfusqe first, then Production qbcqoixhrvhnuwphefvw (separate YES)
-- Purpose: After platform_support_send_public_reply persists a customer_visible message,
--          create a tenant-scoped in-APP presence notification (unread) for customer tenants.
--
-- Rules:
--   - No email. No PII / reply body in notification title/body/metadata.
--   - Skip platform company (is_platform = true) — public web guests have no APP inbox users.
--   - Soft-fail: notify errors must not roll back the public reply.
--   - Dedupe by (tenant_id, event_type, message_id) via presence metadata + unique index.
-- Depends on: platform_support_send_public_reply (already LIVE), record_presence_notification,
--             companies.is_platform, presence_notifications
-- Gate: exact owner YES. Compute SHA256 at apply time (see companion .sha256.txt).

-- Dedupe helper: one unread notify per outbound APP message id.
create unique index if not exists presence_notifications_support_reply_msg_uidx
  on public.presence_notifications (
    tenant_id,
    ((metadata ->> 'app_message_id'))
  )
  where event_type = 'support_public_reply'
    and metadata ? 'app_message_id';

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
  v_is_platform boolean := false;
  v_notification_id uuid := null;
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

  -- In-APP unread notify for customer tenants only (never platform web-guest company).
  begin
    select coalesce(c.is_platform, false) into v_is_platform
    from public.companies c
    where c.id = v_ticket.company_id;

    if coalesce(v_is_platform, false) = false then
      v_notification_id := public.record_presence_notification(
        v_ticket.company_id,
        'support_public_reply',
        'important',
        'New reply from Aipify Support',
        'Open Kundeservice to read the latest reply.',
        '["in_app"]'::jsonb,
        '[]'::jsonb,
        '/app/support/requests/' || v_ticket.id::text,
        jsonb_build_object(
          'ticket_id', v_ticket.id,
          'app_message_id', v_app_msg_id,
          'platform_message_id', v_plat_msg_id,
          'source', 'platform_support_send_public_reply'
        )
      );
    end if;
  exception when others then
    v_notification_id := null;
  end;

  return jsonb_build_object(
    'ok', true,
    'idempotent', false,
    'id', v_app_msg_id,
    'app_message_id', v_app_msg_id,
    'platform_message_id', v_plat_msg_id,
    'direction', 'outbound',
    'delivery_status', 'inbox_persisted',
    'email_status', 'not_sent',
    'notification_id', v_notification_id
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
--   drop index if exists public.presence_notifications_support_reply_msg_uidx;
--   -- restore prior platform_support_send_public_reply body from docs/sql-candidates/
--   --   20261127_platform_support_send_public_reply_v1.sql (without notify block)
