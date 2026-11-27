-- PREPARED_ONLY — NO_SQL_APPLY without exact owner YES.
-- Package: AIPIFY_SUPPORT_APP_CORE_FOUNDATION_STAGING_V1
-- Target: Staging Core auedugihkduoaikfusqe ONLY
-- Purpose: Minimal helpers required BEFORE
--          supabase/migrations/20261933500000_app_customer_tenant_access_boundary.sql
-- Helpers: _apsf260_map_org_role, _apsf260_subscription_status, resolve_license_service_status
--
-- STAGING NOTE (intentional, documented):
--   Production resolve_license_service_status returns 'paused' when no subscription row.
--   Staging currently has no public.subscriptions table. Installing that Production body
--   would hard-deny all APP access. This candidate returns NULL when subscriptions is
--   absent so _apsf260_require_app_access (202619335) can coalesce to 'active' for
--   schema/security verification only. Replace with Production license-center SQL once
--   subscriptions exist on Staging.
--
-- Does NOT: create subscriptions/invoices, seed tenants, send email, touch Platform Support.
--
-- APPROVAL TEXT:
-- "JA STAGING APPLY …/20261127_staging_app_apsf260_access_helpers_v1.sql
--  SHA256 <see .sha256 sidecar / preflight report> on auedugihkduoaikfusqe only.
--  No email. No Production. No #459. No #383."

begin;

create or replace function public._apsf260_map_org_role(p_role text)
returns text
language sql
immutable
as $$
  select case p_role
    when 'owner' then 'organization_owner'
    when 'admin' then 'organization_admin'
    when 'administrator' then 'organization_admin'
    when 'manager' then 'organization_manager'
    when 'support' then 'organization_manager'
    when 'support_agent' then 'organization_manager'
    when 'staff' then 'organization_member'
    when 'viewer' then 'organization_member'
    when 'read_only' then 'organization_member'
    when 'employee' then 'organization_member'
    else 'organization_member'
  end;
$$;

create or replace function public._apsf260_subscription_status(p_company_id uuid)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_sub_status text;
begin
  if p_company_id is null then
    return null;
  end if;

  if to_regclass('public.subscriptions') is null then
    return null;
  end if;

  select s.status
  into v_sub_status
  from public.subscriptions s
  join public.customers c on c.id = s.customer_id
  where c.company_id = p_company_id
  order by s.created_at desc
  limit 1;

  return v_sub_status;
end;
$$;

revoke all on function public._apsf260_subscription_status(uuid) from public, anon;
-- Keep callable from other security definer APP gates only via owner/definer path.

create or replace function public.resolve_license_service_status(p_customer_id uuid)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_status text;
  v_payment_overdue_since timestamptz;
  v_updated_at timestamptz;
  v_overdue_since timestamptz;
  v_days_overdue integer;
  v_found boolean := false;
begin
  if p_customer_id is null then
    return null;
  end if;

  -- Staging soft-open until License Center tables exist.
  if to_regclass('public.subscriptions') is null then
    return null;
  end if;

  select s.status, s.payment_overdue_since, s.updated_at
  into v_status, v_payment_overdue_since, v_updated_at
  from public.subscriptions s
  where s.customer_id = p_customer_id
  limit 1;

  v_found := found;

  if not v_found then
    return 'paused';
  end if;

  if v_status in ('active', 'trialing') then
    return 'active';
  end if;

  v_overdue_since := null;
  if to_regclass('public.invoices') is not null then
    select min(inv.due_date)::timestamptz
    into v_overdue_since
    from public.invoices inv
    where inv.customer_id = p_customer_id
      and inv.status = 'overdue';
  end if;

  v_overdue_since := coalesce(v_overdue_since, v_payment_overdue_since, v_updated_at);

  if v_status = 'past_due' or v_overdue_since is not null then
    v_days_overdue := greatest(
      0,
      floor(extract(epoch from (now() - coalesce(v_overdue_since, now()))) / 86400)::integer
    );
    if v_days_overdue <= 3 then
      return 'grace_period';
    end if;
    return 'paused';
  end if;

  if v_status in ('paused', 'cancelled') then
    return 'paused';
  end if;

  return 'active';
end;
$$;

revoke all on function public.resolve_license_service_status(uuid) from public, anon;

commit;
