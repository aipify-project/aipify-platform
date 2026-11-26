-- PREPARED_ONLY. Additive replace of csp_sales_email_ingest_reply.
-- This file does not replace csp_sales_email_crm_v1.sql.
-- Do not apply it without a separate owner approval that names this file and its SHA256.
--
-- Effect: a human reply can be resolved from the stored token hash when the
-- address carries only the 256-bit secret. Partner, tenant, and expiry come
-- from that row. A client-supplied partner id that disagrees is still rejected.
-- The client cannot extend the stored expiry.
-- No table privileges change. No commission rows are written.

create or replace function public.csp_sales_email_ingest_reply(p_event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event_id text := nullif(btrim(coalesce(p_event->>'provider_event_id', '')), '');
  v_class text := nullif(btrim(coalesce(p_event->>'event_class', '')), '');
  v_send_id uuid;
  v_claim uuid;
  v_exp timestamptz;
  v_hash text := nullif(lower(btrim(coalesce(p_event->>'token_hash', ''))), '');
  v_sender text := lower(btrim(coalesce(p_event->>'sender_email', '')));
  v_body text := left(btrim(coalesce(p_event->>'body_text', '')), 8000);
  v_tenant text := btrim(coalesce(p_event->>'tenant_id', ''));
  v_provider text := nullif(btrim(coalesce(p_event->>'provider_message_id', '')), '');
  v_send public.csp_sales_email_sends%rowtype;
  v_partner_status text;
  v_lead_id uuid;
  v_inserted boolean := false;
  v_reason text;
begin
  if v_event_id is null or v_class is null
     or v_class not in ('human', 'auto_reply', 'bounce', 'spam', 'out_of_office', 'loop', 'delivered') then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'invalid_payload');
  end if;

  if exists (
    select 1 from public.csp_sales_email_provider_events where provider_event_id = v_event_id
  ) then
    return jsonb_build_object('ready', true, 'ok', true, 'outcome', 'duplicate', 'lead_id', null, 'creates_commission', false);
  end if;

  begin
    v_send_id := nullif(p_event->>'send_id', '')::uuid;
    v_claim := nullif(p_event->>'partner_id_claim', '')::uuid;
    v_exp := nullif(p_event->>'token_expires_at', '')::timestamptz;
  exception when others then
    return jsonb_build_object('ready', true, 'ok', false, 'code', 'invalid_payload');
  end;

  if v_send_id is not null then
    select * into v_send from public.csp_sales_email_sends where id = v_send_id;
  elsif v_hash is not null then
    select * into v_send from public.csp_sales_email_sends where token_hash = v_hash;
  elsif v_provider is not null then
    select * into v_send from public.csp_sales_email_sends where provider_message_id = v_provider;
  end if;

  if v_send.id is null then
    insert into public.csp_sales_email_provider_events (
      provider_event_id, tenant_id, event_class, disposition, quarantine_reason
    ) values (
      v_event_id, 'aipify_internal', v_class, 'quarantine_manual_review', 'unknown_send'
    );
    return jsonb_build_object('ready', true, 'ok', true, 'outcome', 'quarantine', 'reason', 'unknown_send', 'lead_id', null, 'creates_commission', false);
  end if;

  if v_class = 'human' then
    v_reason := null;
    if v_hash is null or v_hash is distinct from v_send.token_hash then
      v_reason := 'invalid_token';
    elsif v_send.token_expires_at < now() or (v_exp is not null and (v_exp < now() or v_exp > v_send.token_expires_at)) then
      v_reason := 'expired_token';
    elsif v_tenant is distinct from 'aipify_internal' or v_send.tenant_id is distinct from 'aipify_internal' then
      v_reason := 'wrong_tenant';
    elsif v_claim is not null and v_claim is distinct from v_send.partner_id then
      v_reason := 'spoofed_partner';
    else
      select status into v_partner_status from public.csp_partner_profiles where id = v_send.partner_id;
      if v_partner_status is null or v_partner_status not in ('approved', 'active', 'certified', 'in_academy') then
        v_reason := 'suspended_partner';
      elsif v_sender is distinct from v_send.recipient_email then
        v_reason := 'sender_mismatch';
      elsif length(v_body) < 1 then
        v_reason := 'invalid_payload';
      end if;
    end if;

    if v_reason is not null then
      insert into public.csp_sales_email_provider_events (
        provider_event_id, send_id, partner_id, tenant_id, event_class, disposition, quarantine_reason
      ) values (
        v_event_id, v_send.id, v_send.partner_id, 'aipify_internal', v_class, 'quarantine_manual_review', v_reason
      );
      perform public._csp_sales_email_audit(
        'system', 'quarantine_reply', 'csp_sales_email_provider_events', v_send.id,
        jsonb_build_object('reason', v_reason)
      );
      return jsonb_build_object('ready', true, 'ok', true, 'outcome', 'quarantine', 'reason', v_reason, 'lead_id', null, 'creates_commission', false);
    end if;

    select id into v_lead_id
    from public.csp_sales_email_leads
    where tenant_id = 'aipify_internal'
      and partner_id = v_send.partner_id
      and product_key = v_send.product_key
      and recipient_email = v_send.recipient_email;

    if v_lead_id is null then
      insert into public.csp_sales_email_leads (
        tenant_id, partner_id, product_key, recipient_email, send_id, status, last_inbound_at
      ) values (
        'aipify_internal', v_send.partner_id, v_send.product_key, v_send.recipient_email, v_send.id, 'new_inquiry', now()
      )
      returning id into v_lead_id;
      v_inserted := true;
    else
      update public.csp_sales_email_leads
      set updated_at = now(), last_inbound_at = now()
      where id = v_lead_id;
      v_inserted := false;
    end if;

    insert into public.csp_sales_email_messages (lead_id, send_id, direction, body_text)
    values (v_lead_id, v_send.id, 'inbound', v_body);

    insert into public.csp_sales_email_notifications (tenant_id, partner_id, lead_id)
    values ('aipify_internal', v_send.partner_id, v_lead_id)
    on conflict (lead_id) where read_at is null do nothing;

    insert into public.csp_sales_email_provider_events (
      provider_event_id, send_id, partner_id, tenant_id, event_class, disposition
    ) values (
      v_event_id, v_send.id, v_send.partner_id, 'aipify_internal', 'human', 'create_or_attach_lead'
    );

    perform public._csp_sales_email_audit(
      'system', 'ingest_human_reply', 'csp_sales_email_leads', v_lead_id,
      jsonb_build_object('product_key', v_send.product_key, 'inserted', v_inserted)
    );

    return jsonb_build_object(
      'ready', true,
      'ok', true,
      'outcome', case when v_inserted then 'lead_created' else 'lead_updated' end,
      'lead_id', v_lead_id,
      'partner_id', v_send.partner_id,
      'creates_sale', false,
      'creates_commission', false
    );
  end if;

  insert into public.csp_sales_email_provider_events (
    provider_event_id, send_id, partner_id, tenant_id, event_class, disposition
  ) values (
    v_event_id, v_send.id, v_send.partner_id, 'aipify_internal', v_class, 'transport_event_only'
  );

  if v_class in ('bounce', 'spam') then
    insert into public.csp_sales_email_suppressions (tenant_id, email, reason)
    values ('aipify_internal', v_send.recipient_email, v_class)
    on conflict (tenant_id, email) do nothing;
  end if;

  if v_class = 'bounce' then
    update public.csp_sales_email_sends
    set delivery_status = 'bounced', updated_at = now()
    where id = v_send.id and delivery_status in ('queued', 'accepted_by_provider', 'delivered');
  elsif v_class = 'delivered' then
    update public.csp_sales_email_sends
    set delivery_status = 'delivered', updated_at = now()
    where id = v_send.id and delivery_status = 'accepted_by_provider';
  end if;

  perform public._csp_sales_email_audit(
    'system', 'ingest_transport', 'csp_sales_email_sends', v_send.id,
    jsonb_build_object('event_class', v_class)
  );

  return jsonb_build_object(
    'ready', true, 'ok', true, 'outcome', 'transport_event', 'lead_id', null,
    'creates_sale', false, 'creates_commission', false
  );
exception
  when unique_violation then
    return jsonb_build_object('ready', true, 'ok', true, 'outcome', 'duplicate', 'lead_id', null, 'creates_commission', false);
end;
$$;

revoke all on function public.csp_sales_email_ingest_reply(jsonb) from public, anon, authenticated;
grant execute on function public.csp_sales_email_ingest_reply(jsonb) to service_role;
