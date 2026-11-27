-- SQL CANDIDATE — NOT APPLIED
-- Task: AIPIFY_CUSTOMER_360_CORE_PROFILE_PRODUCT_TRUTH_COMPLETE_V1_20261127
-- Purpose: Authorized Platform Admin update of customers.full_name / customers.phone
--          with audit (before/after, actor, reason, optional support ticket ref).
-- Does NOT change: email, legal name, organization number, billing identity, auth users.
-- Gate: exact owner YES for Staging, then Production. Compute SHA256 at apply time.

create or replace function public.update_platform_portal_customer_primary_contact(
  p_customer_id uuid,
  p_full_name text default null,
  p_phone text default null,
  p_update_full_name boolean default false,
  p_update_phone boolean default false,
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
  v_prev_name text;
  v_prev_phone text;
  v_next_name text;
  v_next_phone text;
  v_audit_id uuid;
  v_reason text := nullif(btrim(coalesce(p_internal_reason, '')), '');
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

  if not coalesce(p_update_full_name, false) and not coalesce(p_update_phone, false) then
    raise exception 'nothing_to_update';
  end if;

  select c.full_name, c.phone
    into v_prev_name, v_prev_phone
  from public.customers c
  where c.id = p_customer_id
  for update;

  if not found then
    raise exception 'customer_not_found';
  end if;

  v_next_name := v_prev_name;
  v_next_phone := v_prev_phone;

  if coalesce(p_update_full_name, false) then
    if p_full_name is null or char_length(btrim(p_full_name)) < 1 or char_length(btrim(p_full_name)) > 120 then
      raise exception 'invalid_full_name';
    end if;
    v_next_name := btrim(p_full_name);
  end if;

  if coalesce(p_update_phone, false) then
    if p_phone is not null and btrim(p_phone) <> '' and btrim(p_phone) !~ '^\+[1-9][0-9]{6,14}$' then
      raise exception 'invalid_phone';
    end if;
    v_next_phone := nullif(btrim(coalesce(p_phone, '')), '');
  end if;

  update public.customers
  set
    full_name = v_next_name,
    phone = v_next_phone,
    updated_at = now()
  where id = p_customer_id;

  v_audit_id := public.record_platform_admin_audit_event(
    p_action_type := 'customer_primary_contact_update',
    p_target_type := 'customer',
    p_target_id := p_customer_id::text,
    p_metadata := jsonb_build_object(
      'before', jsonb_build_object('full_name', v_prev_name, 'phone', v_prev_phone),
      'after', jsonb_build_object('full_name', v_next_name, 'phone', v_next_phone),
      'reason', v_reason,
      'support_ticket_reference', nullif(btrim(coalesce(p_support_ticket_reference, '')), '')
    )
  );

  return jsonb_build_object(
    'ok', true,
    'customer_id', p_customer_id,
    'previous', jsonb_build_object('full_name', v_prev_name, 'phone', v_prev_phone),
    'next', jsonb_build_object('full_name', v_next_name, 'phone', v_next_phone),
    'audit_id', v_audit_id
  );
end;
$$;

revoke all on function public.update_platform_portal_customer_primary_contact(
  uuid, text, text, boolean, boolean, boolean, text, text
) from public, anon;

grant execute on function public.update_platform_portal_customer_primary_contact(
  uuid, text, text, boolean, boolean, boolean, text, text
) to authenticated, service_role;

-- ROLLBACK: drop function public.update_platform_portal_customer_primary_contact(...);
