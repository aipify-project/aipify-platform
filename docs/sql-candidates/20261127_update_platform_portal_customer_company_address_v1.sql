-- SQL CANDIDATE — NOT APPLIED
-- Task: AIPIFY_CUSTOMER360_ADMIN_COMPANY_BILLING_ADDRESS_EDIT_V1_20261127
-- Purpose: Authorized Platform Admin update of ordinary company + invoice address fields.
-- Sources:
--   organization_registration_profiles (website, owner_phone, business_address, postal_code, city, organization_country)
--   customers.name (display name only)
--   payment_profiles (billing_address, postal_code, city, country)
-- Does NOT change: legal company_name, organization_number, email, auth, invoices, licenses,
--                  Stripe/payment status, KID, price, or primary-contact RPC fields.
-- Gate: exact owner YES for Staging, then Production. Compute SHA256 at apply time.
-- Rollback: DROP FUNCTION public.update_platform_portal_customer_company_address(...);

create or replace function public.update_platform_portal_customer_company_address(
  p_customer_id uuid,
  p_display_name text default null,
  p_website text default null,
  p_company_phone text default null,
  p_street text default null,
  p_postal_code text default null,
  p_city text default null,
  p_country text default null,
  p_update_company boolean default false,
  p_invoice_street text default null,
  p_invoice_postal_code text default null,
  p_invoice_city text default null,
  p_invoice_country text default null,
  p_update_invoice boolean default false,
  p_copy_company_to_invoice boolean default false,
  p_confirmation boolean default false,
  p_internal_reason text default null,
  p_support_ticket_reference text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reason text := nullif(btrim(coalesce(p_internal_reason, '')), '');
  v_audit_id uuid;
  v_before jsonb;
  v_after jsonb;
  v_reg public.organization_registration_profiles%rowtype;
  v_pay public.payment_profiles%rowtype;
  v_display text;
  v_billing_email text;
  v_inv_street text;
  v_inv_postal text;
  v_inv_city text;
  v_inv_country text;
  v_pay_exists boolean := false;
begin
  if not public.is_platform_admin() then
    raise exception 'forbidden: platform_admin required';
  end if;

  if coalesce(p_confirmation, false) is not true then
    raise exception 'confirmation_required';
  end if;

  if v_reason is null or char_length(v_reason) < 3 or char_length(v_reason) > 500 then
    raise exception 'invalid_internal_reason';
  end if;

  if not coalesce(p_update_company, false) and not coalesce(p_update_invoice, false) then
    raise exception 'nothing_to_update';
  end if;

  select c.name, c.email
    into v_display, v_billing_email
  from public.customers c
  where c.id = p_customer_id
  for update;

  if not found then
    raise exception 'customer_not_found';
  end if;

  select *
    into v_reg
  from public.organization_registration_profiles
  where customer_id = p_customer_id
  for update;

  if not found then
    raise exception 'registration_profile_missing';
  end if;

  select *
    into v_pay
  from public.payment_profiles
  where customer_id = p_customer_id
  for update;
  v_pay_exists := found;

  v_before := jsonb_build_object(
    'display_name', v_display,
    'website', v_reg.website,
    'company_phone', v_reg.owner_phone,
    'street', v_reg.business_address,
    'postal_code', v_reg.postal_code,
    'city', v_reg.city,
    'country', v_reg.organization_country,
    'invoice_street', case when v_pay_exists then v_pay.billing_address else null end,
    'invoice_postal_code', case when v_pay_exists then v_pay.postal_code else null end,
    'invoice_city', case when v_pay_exists then v_pay.city else null end,
    'invoice_country', case when v_pay_exists then v_pay.country else null end
  );

  if coalesce(p_update_company, false) then
    if p_display_name is not null then
      if char_length(btrim(p_display_name)) < 1 or char_length(btrim(p_display_name)) > 200 then
        raise exception 'invalid_display_name';
      end if;
      v_display := btrim(p_display_name);
      update public.customers
      set name = v_display, updated_at = now()
      where id = p_customer_id;
    end if;

    if p_website is not null then
      if btrim(p_website) <> '' and (
        lower(btrim(p_website)) like 'javascript:%'
        or lower(btrim(p_website)) like 'data:%'
        or char_length(btrim(p_website)) > 500
      ) then
        raise exception 'invalid_website';
      end if;
      v_reg.website := nullif(btrim(p_website), '');
    end if;

    if p_company_phone is not null then
      if btrim(p_company_phone) <> '' and btrim(p_company_phone) !~ '^\+[1-9][0-9]{6,14}$' then
        raise exception 'invalid_company_phone';
      end if;
      v_reg.owner_phone := nullif(btrim(p_company_phone), '');
    end if;

    if p_street is not null then
      if char_length(btrim(p_street)) < 1 or char_length(btrim(p_street)) > 300 then
        raise exception 'invalid_street';
      end if;
      v_reg.business_address := btrim(p_street);
    end if;

    if p_postal_code is not null then
      if char_length(btrim(p_postal_code)) < 1 or char_length(btrim(p_postal_code)) > 32 then
        raise exception 'invalid_postal_code';
      end if;
      if btrim(p_postal_code) = '0000' then
        raise exception 'invalid_postal_code_placeholder';
      end if;
      v_reg.postal_code := btrim(p_postal_code);
    end if;

    if p_city is not null then
      if char_length(btrim(p_city)) < 1 or char_length(btrim(p_city)) > 120 then
        raise exception 'invalid_city';
      end if;
      v_reg.city := btrim(p_city);
    end if;

    if p_country is not null then
      if btrim(p_country) !~ '^[A-Za-z]{2}$' then
        raise exception 'invalid_country';
      end if;
      v_reg.organization_country := upper(btrim(p_country));
    end if;

    update public.organization_registration_profiles
    set
      website = v_reg.website,
      owner_phone = v_reg.owner_phone,
      business_address = v_reg.business_address,
      postal_code = v_reg.postal_code,
      city = v_reg.city,
      organization_country = v_reg.organization_country,
      updated_at = now()
    where customer_id = p_customer_id;
  end if;

  if coalesce(p_update_invoice, false) then
    if coalesce(p_copy_company_to_invoice, false) then
      v_inv_street := v_reg.business_address;
      v_inv_postal := v_reg.postal_code;
      v_inv_city := v_reg.city;
      v_inv_country := v_reg.organization_country;
    else
      v_inv_street := case when v_pay_exists then v_pay.billing_address else null end;
      v_inv_postal := case when v_pay_exists then v_pay.postal_code else null end;
      v_inv_city := case when v_pay_exists then v_pay.city else null end;
      v_inv_country := case when v_pay_exists then v_pay.country else null end;

      if p_invoice_street is not null then
        if char_length(btrim(p_invoice_street)) < 1 or char_length(btrim(p_invoice_street)) > 300 then
          raise exception 'invalid_invoice_street';
        end if;
        if lower(btrim(p_invoice_street)) like '%billing address pending%' then
          raise exception 'invalid_invoice_street_placeholder';
        end if;
        v_inv_street := btrim(p_invoice_street);
      end if;

      if p_invoice_postal_code is not null then
        if char_length(btrim(p_invoice_postal_code)) < 1 or char_length(btrim(p_invoice_postal_code)) > 32 then
          raise exception 'invalid_invoice_postal_code';
        end if;
        if btrim(p_invoice_postal_code) = '0000' then
          raise exception 'invalid_invoice_postal_placeholder';
        end if;
        v_inv_postal := btrim(p_invoice_postal_code);
      end if;

      if p_invoice_city is not null then
        if char_length(btrim(p_invoice_city)) < 1 or char_length(btrim(p_invoice_city)) > 120 then
          raise exception 'invalid_invoice_city';
        end if;
        v_inv_city := btrim(p_invoice_city);
      end if;

      if p_invoice_country is not null then
        if btrim(p_invoice_country) !~ '^[A-Za-z]{2}$' then
          raise exception 'invalid_invoice_country';
        end if;
        v_inv_country := upper(btrim(p_invoice_country));
      end if;
    end if;

    if v_inv_street is null or v_inv_postal is null or v_inv_city is null or v_inv_country is null then
      raise exception 'incomplete_invoice_address';
    end if;

    if v_pay_exists then
      update public.payment_profiles
      set
        billing_address = v_inv_street,
        postal_code = v_inv_postal,
        city = v_inv_city,
        country = v_inv_country,
        updated_at = now()
      where customer_id = p_customer_id;
    else
      if v_billing_email is null or btrim(v_billing_email) = '' then
        raise exception 'billing_email_required';
      end if;
      insert into public.payment_profiles (
        customer_id,
        provider,
        payment_status,
        billing_email,
        billing_address,
        postal_code,
        city,
        country
      ) values (
        p_customer_id,
        'invoice',
        'pending_setup',
        btrim(v_billing_email),
        v_inv_street,
        v_inv_postal,
        v_inv_city,
        v_inv_country
      );
    end if;
  end if;

  select *
    into v_reg
  from public.organization_registration_profiles
  where customer_id = p_customer_id;

  select *
    into v_pay
  from public.payment_profiles
  where customer_id = p_customer_id;

  select c.name into v_display from public.customers c where c.id = p_customer_id;

  v_after := jsonb_build_object(
    'display_name', v_display,
    'website', v_reg.website,
    'company_phone', v_reg.owner_phone,
    'street', v_reg.business_address,
    'postal_code', v_reg.postal_code,
    'city', v_reg.city,
    'country', v_reg.organization_country,
    'invoice_street', v_pay.billing_address,
    'invoice_postal_code', v_pay.postal_code,
    'invoice_city', v_pay.city,
    'invoice_country', v_pay.country
  );

  v_audit_id := public.record_platform_admin_audit_event(
    p_action_type := 'customer_company_address_update',
    p_target_type := 'customer',
    p_target_id := p_customer_id::text,
    p_metadata := jsonb_build_object(
      'before', v_before,
      'after', v_after,
      'reason', v_reason,
      'copied_company_to_invoice', coalesce(p_copy_company_to_invoice, false),
      'support_ticket_reference', nullif(btrim(coalesce(p_support_ticket_reference, '')), '')
    )
  );

  return jsonb_build_object(
    'ok', true,
    'customer_id', p_customer_id,
    'previous', v_before,
    'next', v_after,
    'audit_id', v_audit_id
  );
end;
$$;

revoke all on function public.update_platform_portal_customer_company_address(
  uuid, text, text, text, text, text, text, text, boolean,
  text, text, text, text, boolean, boolean, boolean, text, text
) from public, anon;

grant execute on function public.update_platform_portal_customer_company_address(
  uuid, text, text, text, text, text, text, text, boolean,
  text, text, text, text, boolean, boolean, boolean, text, text
) to authenticated, service_role;

-- ROLLBACK:
-- drop function public.update_platform_portal_customer_company_address(
--   uuid, text, text, text, text, text, text, text, boolean,
--   text, text, text, text, boolean, boolean, boolean, text, text
-- );
