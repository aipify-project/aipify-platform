-- PREPARED_ONLY — do not apply until exact owner Staging/Production approval.
-- AIPIFY CSP V6: public click capture + first-wins customer attribution.
-- Preserves historical clicks/sales. Honors deactivated links and suspended partners.
-- Additive: optional billing_interval on paid-period events (annual earns on period 1).

-- ---------------------------------------------------------------------------
-- Session-scoped click dedupe (opaque hash only — no PII)
-- ---------------------------------------------------------------------------
create table if not exists public.csp_attribution_click_dedupe (
  link_id uuid not null references public.csp_attribution_links (id) on delete restrict,
  session_hash text not null check (char_length(session_hash) between 16 and 128),
  product_key text not null check (char_length(btrim(product_key)) > 0),
  first_seen_at timestamptz not null default now(),
  primary key (link_id, session_hash, product_key)
);

alter table public.csp_attribution_click_dedupe enable row level security;
alter table public.csp_attribution_click_dedupe force row level security;
revoke all on table public.csp_attribution_click_dedupe from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Public click capture (SECURITY DEFINER; no table grants to anon)
-- ---------------------------------------------------------------------------
create or replace function public.csp_capture_public_attribution_click(p_payload jsonb)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_code text := lower(btrim(coalesce(p_payload ->> 'code', p_payload ->> 'link_code', '')));
  v_product text := lower(btrim(coalesce(p_payload ->> 'productKey', p_payload ->> 'product_key', '')));
  v_session text := btrim(coalesce(p_payload ->> 'sessionHash', p_payload ->> 'session_hash', ''));
  v_link public.csp_attribution_links%rowtype;
  v_partner public.csp_partner_profiles%rowtype;
  v_prod public.csp_sales_products%rowtype;
  v_event_id uuid;
  v_inserted boolean := false;
begin
  if jsonb_typeof(p_payload) is distinct from 'object' then
    return jsonb_build_object('found', false, 'recorded', false, 'error', 'invalid_payload');
  end if;
  if v_code = '' or v_code !~ '^csp-[a-z0-9]{12}$' then
    return jsonb_build_object('found', false, 'recorded', false, 'error', 'invalid_link_code');
  end if;
  if v_product = '' then
    return jsonb_build_object('found', false, 'recorded', false, 'error', 'product_key_required');
  end if;
  if v_session = '' or char_length(v_session) < 16 or char_length(v_session) > 128 then
    return jsonb_build_object('found', false, 'recorded', false, 'error', 'session_hash_required');
  end if;

  select * into v_link from public.csp_attribution_links where code = v_code;
  if not found then
    return jsonb_build_object('found', false, 'recorded', false, 'error', 'link_not_found');
  end if;
  if not v_link.active then
    return jsonb_build_object('found', true, 'recorded', false, 'error', 'link_inactive', 'link_id', v_link.id);
  end if;

  select * into v_partner from public.csp_partner_profiles where id = v_link.partner_id;
  if not found then
    return jsonb_build_object('found', false, 'recorded', false, 'error', 'partner_not_found');
  end if;
  if v_partner.status not in ('approved', 'active', 'certified') then
    return jsonb_build_object('found', true, 'recorded', false, 'error', 'partner_not_active', 'link_id', v_link.id);
  end if;

  select * into v_prod from public.csp_sales_products where product_key = v_product;
  if not found or not v_prod.published then
    return jsonb_build_object('found', true, 'recorded', false, 'error', 'product_not_available', 'link_id', v_link.id);
  end if;

  if not exists (
    select 1 from public.csp_product_certifications c
    where c.partner_id = v_partner.id and c.product_id = v_prod.id and c.status = 'passed'
  ) then
    return jsonb_build_object('found', true, 'recorded', false, 'error', 'certification_required', 'link_id', v_link.id);
  end if;

  begin
    insert into public.csp_attribution_click_dedupe (link_id, session_hash, product_key)
    values (v_link.id, v_session, v_product);
    v_inserted := true;
  exception when unique_violation then
    return jsonb_build_object(
      'found', true, 'recorded', false, 'duplicate', true,
      'link_id', v_link.id, 'product_key', v_product
    );
  end;

  insert into public.csp_attribution_events (link_id, event_type)
  values (v_link.id, 'click')
  returning id into v_event_id;

  perform public._csp_audit(
    null, 'system', 'attribution_click_captured', 'csp_attribution_events', v_event_id,
    jsonb_build_object('link_id', v_link.id, 'product_key', v_product, 'duplicate', false)
  );

  return jsonb_build_object(
    'found', true, 'recorded', true, 'duplicate', false,
    'link_id', v_link.id, 'event_id', v_event_id, 'product_key', v_product
  );
end;
$$;

revoke all on function public.csp_capture_public_attribution_click(jsonb) from public, anon, authenticated, service_role;
grant execute on function public.csp_capture_public_attribution_click(jsonb) to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- First-wins registration attribution (server / authenticated; partner from link)
-- ---------------------------------------------------------------------------
create or replace function public.csp_attribute_customer_registration(p_payload jsonb)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_service boolean := public._csp_is_service_role();
  v_code text := lower(btrim(coalesce(p_payload ->> 'code', p_payload ->> 'link_code', '')));
  v_org uuid;
  v_customer_auth uuid;
  v_link public.csp_attribution_links%rowtype;
  v_partner public.csp_partner_profiles%rowtype;
  v_existing public.csp_attributed_registrations%rowtype;
  v_attributed_at timestamptz;
  v_registered_at timestamptz := now();
  v_window_days integer := 90;
  v_id uuid;
begin
  if not v_service and v_uid is null then
    return jsonb_build_object('found', false, 'error', 'unauthorized');
  end if;
  if jsonb_typeof(p_payload) is distinct from 'object' then
    return jsonb_build_object('found', false, 'error', 'invalid_payload');
  end if;
  if v_code = '' or v_code !~ '^csp-[a-z0-9]{12}$' then
    return jsonb_build_object('found', false, 'error', 'invalid_link_code');
  end if;

  begin
    v_org := coalesce(p_payload ->> 'customerOrgId', p_payload ->> 'customer_org_id')::uuid;
  exception when others then
    return jsonb_build_object('found', false, 'error', 'invalid_customer_org_id');
  end;
  if v_org is null then
    return jsonb_build_object('found', false, 'error', 'invalid_customer_org_id');
  end if;

  begin
    v_customer_auth := nullif(coalesce(p_payload ->> 'customerAuthUserId', p_payload ->> 'customer_auth_user_id', ''), '')::uuid;
  exception when others then
    v_customer_auth := null;
  end;

  select * into v_link from public.csp_attribution_links where code = v_code;
  if not found then
    return jsonb_build_object('found', false, 'error', 'link_not_found');
  end if;
  if not v_link.active then
    return jsonb_build_object('found', true, 'attributed', false, 'error', 'link_inactive');
  end if;

  select * into v_partner from public.csp_partner_profiles where id = v_link.partner_id;
  if not found or v_partner.status not in ('approved', 'active', 'certified') then
    return jsonb_build_object('found', true, 'attributed', false, 'error', 'partner_not_active');
  end if;

  -- Self-referral: partner auth user cannot attribute their own customer org signup.
  if v_customer_auth is not null and v_partner.auth_user_id = v_customer_auth then
    return jsonb_build_object('found', true, 'attributed', false, 'error', 'self_referral');
  end if;

  select * into v_existing from public.csp_attributed_registrations where customer_org_id = v_org;
  if found then
    return jsonb_build_object(
      'found', true, 'attributed', false, 'error', 'already_attributed',
      'partner_id', v_existing.partner_id, 'registration_id', v_existing.id
    );
  end if;

  select coalesce(min(e.occurred_at), now()) into v_attributed_at
  from public.csp_attribution_events e
  where e.link_id = v_link.id and e.event_type = 'click';

  if v_registered_at < v_attributed_at then
    v_registered_at := v_attributed_at;
  end if;
  if v_registered_at > v_attributed_at + make_interval(days => v_window_days) then
    return jsonb_build_object('found', true, 'attributed', false, 'error', 'attribution_window_expired');
  end if;

  insert into public.csp_attribution_events (link_id, event_type)
  values (v_link.id, 'registration_completed');

  insert into public.csp_attributed_registrations (
    link_id, partner_id, customer_org_id, attributed_at, registered_at, window_expires_at
  ) values (
    v_link.id, v_partner.id, v_org, v_attributed_at, v_registered_at,
    v_attributed_at + make_interval(days => v_window_days)
  )
  returning id into v_id;

  perform public._csp_audit(
    coalesce(v_uid, v_customer_auth), case when v_service then 'system' else 'partner' end,
    'customer_registration_attributed', 'csp_attributed_registrations', v_id,
    jsonb_build_object('link_id', v_link.id, 'partner_id', v_partner.id, 'customer_org_id', v_org)
  );

  return jsonb_build_object(
    'found', true, 'attributed', true,
    'registration_id', v_id, 'partner_id', v_partner.id, 'link_id', v_link.id
  );
exception when unique_violation then
  select * into v_existing from public.csp_attributed_registrations where customer_org_id = v_org;
  return jsonb_build_object(
    'found', true, 'attributed', false, 'error', 'already_attributed',
    'partner_id', v_existing.partner_id, 'registration_id', v_existing.id
  );
end;
$$;

revoke all on function public.csp_attribute_customer_registration(jsonb) from public, anon, authenticated, service_role;
grant execute on function public.csp_attribute_customer_registration(jsonb) to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Additive: annual billing earns on first paid period (monthly unchanged)
-- Replaces csp_apply_paid_period_event body with billing_interval support.
-- ---------------------------------------------------------------------------
create or replace function public.csp_apply_paid_period_event(p_payload jsonb)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_service boolean := public._csp_is_service_role();
  v_kind text;
  v_event_id text;
  v_type text;
  v_org uuid;
  v_key text;
  v_ord integer;
  v_raw text;
  v_interval text;
  v_earn_at integer := 2;
  v_attr public.csp_attributed_registrations%rowtype;
  v_prod public.csp_sales_products%rowtype;
  v_sale public.csp_qualified_sales%rowtype;
  v_rate public.csp_commission_rate_versions%rowtype;
  v_new_count integer;
  v_outcome text;
  v_prev_status text;
  v_clawback boolean := false;
  v_review boolean := false;
begin
  if not v_service and not (v_uid is not null and coalesce(public.is_platform_admin(), false)) then
    return jsonb_build_object('found', false, 'error', 'forbidden');
  end if;
  v_kind := case when v_service then 'system' else 'platform_admin' end;

  if jsonb_typeof(p_payload) is distinct from 'object' then
    return jsonb_build_object('found', false, 'error', 'invalid_payload');
  end if;

  v_event_id := btrim(coalesce(p_payload ->> 'eventId', p_payload ->> 'event_id', ''));
  if length(v_event_id) < 1 or length(v_event_id) > 200 then
    return jsonb_build_object('found', false, 'error', 'event_id_required');
  end if;

  v_type := lower(btrim(coalesce(p_payload ->> 'eventType', p_payload ->> 'event_type', '')));
  if v_type not in ('paid_period','refund','chargeback') then
    return jsonb_build_object('found', false, 'error', 'invalid_event_type');
  end if;

  begin
    v_org := coalesce(p_payload ->> 'customerOrgId', p_payload ->> 'customer_org_id')::uuid;
  exception when others then
    return jsonb_build_object('found', false, 'error', 'invalid_customer_org_id');
  end;
  if v_org is null then
    return jsonb_build_object('found', false, 'error', 'invalid_customer_org_id');
  end if;

  v_key := lower(btrim(coalesce(p_payload ->> 'productKey', p_payload ->> 'product_key', '')));
  if v_key = '' then
    return jsonb_build_object('found', false, 'error', 'product_key_required');
  end if;

  v_interval := lower(btrim(coalesce(p_payload ->> 'billingInterval', p_payload ->> 'billing_interval', 'monthly')));
  if v_interval in ('annual', 'year', 'yearly') then
    v_earn_at := 1;
    v_interval := 'annual';
  else
    v_earn_at := 2;
    v_interval := 'monthly';
  end if;

  v_raw := coalesce(p_payload ->> 'periodOrdinal', p_payload ->> 'period_ordinal');
  if v_raw is not null then
    if v_raw !~ '^[0-9]{1,3}$' then
      return jsonb_build_object('found', false, 'error', 'invalid_period_ordinal');
    end if;
    v_ord := v_raw::integer;
  end if;
  if v_type = 'paid_period' and (v_ord is null or v_ord < 1) then
    return jsonb_build_object('found', false, 'error', 'invalid_period_ordinal');
  end if;

  perform pg_advisory_xact_lock(hashtextextended('csp_paid_event:' || v_event_id, 0));
  if exists (
    select 1 from public.csp_audit_events
    where action = 'paid_period_event_applied' and detail ->> 'event_id' = v_event_id
  ) then
    return jsonb_build_object('found', true, 'outcome', 'duplicate_event', 'idempotent', true);
  end if;

  select * into v_attr from public.csp_attributed_registrations where customer_org_id = v_org;
  if not found then
    return jsonb_build_object('found', false, 'error', 'no_attribution');
  end if;

  select * into v_prod from public.csp_sales_products where product_key = v_key;
  if not found then
    return jsonb_build_object('found', false, 'error', 'product_not_found');
  end if;

  select * into v_sale
  from public.csp_qualified_sales
  where partner_id = v_attr.partner_id and customer_org_id = v_org and product_id = v_prod.id
  for update;

  if v_type = 'paid_period' then
    if not found then
      if exists (
        select 1 from public.csp_qualified_sales
        where customer_org_id = v_org and product_id = v_prod.id
          and partner_id <> v_attr.partner_id
          and status not in ('rejected','reversed')
      ) then
        return jsonb_build_object('found', false, 'error', 'conflicting_claim');
      end if;
      insert into public.csp_qualified_sales (partner_id, customer_org_id, product_id, attributed_at)
      values (v_attr.partner_id, v_org, v_prod.id, v_attr.attributed_at)
      returning * into v_sale;
    end if;

    if v_sale.status in ('reversed','rejected') then
      v_outcome := 'sale_closed_no_commission';
    else
      if v_sale.snapshot_amount is null then
        select * into v_rate
        from public.csp_commission_rate_versions
        where product_id = v_prod.id and effective_from <= now()
        order by effective_from desc
        limit 1;
        if not found then
          return jsonb_build_object('found', false, 'error', 'no_commission_rate');
        end if;
        update public.csp_qualified_sales
        set snapshot_amount = v_rate.amount,
            snapshot_currency = v_rate.currency,
            snapshot_rate_version_id = v_rate.id,
            first_confirmed_at = now()
        where id = v_sale.id
        returning * into v_sale;
      end if;

      v_new_count := greatest(v_sale.paid_periods_count, v_ord);
      v_prev_status := v_sale.status;

      if v_new_count >= v_earn_at
         and v_sale.status in ('registered_awaiting_second_payment','pending_possible') then
        update public.csp_qualified_sales
        set paid_periods_count = v_new_count, status = 'earned'
        where id = v_sale.id
        returning * into v_sale;

        insert into public.csp_commission_ledger
          (partner_id, qualified_sale_id, entry_type, amount, currency, idempotency_key)
        values
          (v_sale.partner_id, v_sale.id, 'earned', v_sale.snapshot_amount, v_sale.snapshot_currency,
           'csp:earned:' || v_sale.id::text)
        on conflict (idempotency_key) do nothing;
        v_outcome := 'earned';
      else
        update public.csp_qualified_sales
        set paid_periods_count = v_new_count
        where id = v_sale.id
        returning * into v_sale;
        v_outcome := case
          when v_sale.status in ('registered_awaiting_second_payment','pending_possible')
            then 'awaiting_second_payment'
          else 'renewal_no_commission'
        end;
      end if;
    end if;

  else
    if not found then
      v_outcome := 'no_qualified_sale';
    elsif v_ord is not null and v_ord > v_earn_at then
      v_outcome := 'renewal_period_no_reversal';
    elsif v_sale.status in ('reversed','rejected') then
      v_outcome := 'already_reversed';
    else
      v_prev_status := v_sale.status;
      if v_sale.status in ('earned','approved_for_payout','queued_for_payout','paid')
         and v_sale.snapshot_amount is not null then
        insert into public.csp_commission_ledger
          (partner_id, qualified_sale_id, entry_type, amount, currency, idempotency_key)
        values
          (v_sale.partner_id, v_sale.id, 'reversal', -v_sale.snapshot_amount, v_sale.snapshot_currency,
           'csp:reversal:' || v_sale.id::text)
        on conflict (idempotency_key) do nothing;
      end if;
      v_clawback := v_prev_status in ('queued_for_payout','paid');
      v_review := v_prev_status in ('approved_for_payout','queued_for_payout','paid');
      update public.csp_qualified_sales set status = 'reversed' where id = v_sale.id returning * into v_sale;
      v_outcome := 'reversed';
    end if;
  end if;

  perform public._csp_audit(v_uid, v_kind, 'paid_period_event_applied',
    'csp_qualified_sales', v_sale.id,
    jsonb_build_object(
      'event_id', v_event_id, 'event_type', v_type, 'period_ordinal', v_ord,
      'billing_interval', v_interval, 'earn_at', v_earn_at,
      'outcome', v_outcome, 'product_key', v_key,
      'clawback_required', v_clawback, 'settlement_review_required', v_review));

  return jsonb_build_object(
    'found', true,
    'outcome', v_outcome,
    'sale_id', v_sale.id,
    'status', v_sale.status,
    'paid_periods_count', v_sale.paid_periods_count,
    'billing_interval', v_interval
  );
end;
$$;

revoke all on function public.csp_apply_paid_period_event(jsonb) from public, anon, authenticated, service_role;
grant execute on function public.csp_apply_paid_period_event(jsonb) to authenticated, service_role;

comment on function public.csp_capture_public_attribution_click(jsonb) is
  'CSP V6 public click capture — active link + published product + certification; session dedupe; no PII.';
comment on function public.csp_attribute_customer_registration(jsonb) is
  'CSP V6 first-wins org attribution from link code; blocks self-referral and inactive partners.';
