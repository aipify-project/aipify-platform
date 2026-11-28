-- PREPARED_ONLY — do not apply until exact owner Staging approval, then separate Production approval.
-- AIPIFY — Sales Partner commercial license foundation V1
--
-- PURPOSE
--   Additive Core storage for paid (or internal-system) Sales Partner programs owned by a
--   customer organization. Distinct from free Aipify Partner (csp_partner_profiles).
--   Configurable seat capacity per license level — no hardcoded prices or seat defaults.
--
-- EFFECTS (when applied)
--   + public.sales_partner_license_levels
--   + public.sales_partner_program_licenses
--   + public.sales_partner_programs
--   + public.sales_partner_program_memberships
--   + public.assert_sales_partner_seller_capacity(uuid)
--   + public.activate_sales_partner_seller_seat(uuid, uuid, text)
--   RLS: revoke all from public/anon/authenticated; security definer RPCs only
--
-- NON-EFFECTS
--   Does NOT create Stripe products/prices or checkout sessions
--   Does NOT change csp_* partner approvals, memberships, commissions, or settlement
--   Does NOT seed demo tenants, programs, or seat counts
--   Does NOT rename /app/sales-partner or retire /partners
--   Does NOT enable purchase UI
--
-- SECURITY
--   Tenant isolation via organization_id / owner_tenant_id.
--   Fail-closed when license missing, expired, suspended, or capacity unconfigured.
--   Atomic seat activation: compare active_count + 1 against max under row lock.
--
-- ROLLBACK
--   DROP FUNCTION public.activate_sales_partner_seller_seat(uuid, uuid, text);
--   DROP FUNCTION public.assert_sales_partner_seller_capacity(uuid);
--   DROP TABLE public.sales_partner_program_memberships;
--   DROP TABLE public.sales_partner_programs;
--   DROP TABLE public.sales_partner_program_licenses;
--   DROP TABLE public.sales_partner_license_levels;
--
-- OWNER GATES
--   1) Staging apply + QA
--   2) Separate Production apply approval
--   APPLY_BLOCKED_UNTIL_OWNER_YES

begin;

create table if not exists public.sales_partner_license_levels (
  license_level_key text primary key,
  label text not null,
  -- null = unset (commercial activation must fail closed); 0 = explicit zero seats
  max_active_sellers integer
    check (max_active_sellers is null or max_active_sellers >= 0),
  currency text,
  -- Optional catalog hint only — never invent Stripe amounts from this column
  price_amount_major numeric,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.sales_partner_program_licenses (
  id uuid primary key default gen_random_uuid(),
  owner_tenant_id uuid not null,
  license_level_key text references public.sales_partner_license_levels (license_level_key),
  status text not null
    check (status in ('active', 'grace_period', 'expired', 'missing', 'suspended', 'internal_system')),
  source text not null
    check (source in ('paid_subscription', 'internal_system', 'none')),
  max_active_sellers integer
    check (max_active_sellers is null or max_active_sellers >= 0),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sales_partner_program_licenses_tenant_idx
  on public.sales_partner_program_licenses (owner_tenant_id);

create table if not exists public.sales_partner_programs (
  id uuid primary key default gen_random_uuid(),
  owner_tenant_id uuid not null,
  program_key text not null,
  kind text not null
    check (kind in ('aipify_certified_free', 'tenant_commercial')),
  license_id uuid references public.sales_partner_program_licenses (id),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (owner_tenant_id, program_key)
);

create table if not exists public.sales_partner_program_memberships (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.sales_partner_programs (id),
  seller_user_id uuid not null,
  role text not null
    check (role in ('program_owner', 'program_admin', 'seller', 'read_only')),
  status text not null
    check (status in ('active', 'inactive', 'invited', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (program_id, seller_user_id)
);

create index if not exists sales_partner_program_memberships_active_idx
  on public.sales_partner_program_memberships (program_id)
  where status = 'active';

revoke all on table public.sales_partner_license_levels from public, anon, authenticated;
revoke all on table public.sales_partner_program_licenses from public, anon, authenticated;
revoke all on table public.sales_partner_programs from public, anon, authenticated;
revoke all on table public.sales_partner_program_memberships from public, anon, authenticated;

create or replace function public.assert_sales_partner_seller_capacity(
  p_program_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_program public.sales_partner_programs%rowtype;
  v_license public.sales_partner_program_licenses%rowtype;
  v_active integer;
  v_max integer;
begin
  select * into v_program
  from public.sales_partner_programs
  where id = p_program_id
  for share;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'program_not_found');
  end if;

  if v_program.kind is distinct from 'tenant_commercial' then
    return jsonb_build_object('ok', false, 'error', 'program_kind_mismatch');
  end if;

  if v_program.license_id is null then
    return jsonb_build_object('ok', false, 'error', 'license_missing');
  end if;

  select * into v_license
  from public.sales_partner_program_licenses
  where id = v_program.license_id
  for share;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'license_missing');
  end if;

  if v_license.owner_tenant_id is distinct from v_program.owner_tenant_id then
    return jsonb_build_object('ok', false, 'error', 'cross_tenant_forbidden');
  end if;

  if v_license.status in ('missing', 'expired', 'suspended') then
    return jsonb_build_object('ok', false, 'error', 'license_' || v_license.status);
  end if;

  if v_license.status = 'grace_period' then
    return jsonb_build_object('ok', false, 'error', 'license_paused_grace_blocks_activation');
  end if;

  if v_license.status is distinct from 'active' and v_license.status is distinct from 'internal_system' then
    return jsonb_build_object('ok', false, 'error', 'license_not_operational');
  end if;

  v_max := v_license.max_active_sellers;
  if v_max is null then
    return jsonb_build_object('ok', false, 'error', 'capacity_not_configured');
  end if;

  select count(*)::integer into v_active
  from public.sales_partner_program_memberships
  where program_id = p_program_id
    and status = 'active';

  if v_active >= v_max then
    return jsonb_build_object(
      'ok', false,
      'error', 'capacity_exhausted',
      'active_seller_count', v_active,
      'max_active_sellers', v_max,
      'capacity_limit_reached', true,
      'notification_delivery_implemented', false
    );
  end if;

  return jsonb_build_object(
    'ok', true,
    'active_seller_count', v_active,
    'max_active_sellers', v_max,
    'seats_remaining', v_max - v_active
  );
end;
$$;

create or replace function public.activate_sales_partner_seller_seat(
  p_program_id uuid,
  p_seller_user_id uuid,
  p_role text default 'seller'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cap jsonb;
  v_membership public.sales_partner_program_memberships%rowtype;
  v_role text := coalesce(nullif(btrim(p_role), ''), 'seller');
  v_active integer;
  v_max integer;
begin
  if p_seller_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'seller_user_id_required');
  end if;

  if v_role not in ('program_owner', 'program_admin', 'seller', 'read_only') then
    return jsonb_build_object('ok', false, 'error', 'invalid_role');
  end if;

  -- Lock memberships for this program before capacity check (atomic activation).
  perform 1
  from public.sales_partner_program_memberships
  where program_id = p_program_id
  for update;

  select * into v_membership
  from public.sales_partner_program_memberships
  where program_id = p_program_id
    and seller_user_id = p_seller_user_id
  for update;

  if found and v_membership.status = 'active' then
    return jsonb_build_object('ok', false, 'error', 'seller_already_active');
  end if;

  v_cap := public.assert_sales_partner_seller_capacity(p_program_id);
  if coalesce((v_cap ->> 'ok')::boolean, false) is not true then
    return v_cap;
  end if;

  if found then
    update public.sales_partner_program_memberships
    set status = 'active',
        role = v_role,
        updated_at = now()
    where id = v_membership.id
    returning * into v_membership;
  else
    insert into public.sales_partner_program_memberships (
      program_id, seller_user_id, role, status
    ) values (
      p_program_id, p_seller_user_id, v_role, 'active'
    )
    returning * into v_membership;
  end if;

  select count(*)::integer into v_active
  from public.sales_partner_program_memberships
  where program_id = p_program_id
    and status = 'active';

  v_max := (v_cap ->> 'max_active_sellers')::integer;

  return jsonb_build_object(
    'ok', true,
    'membership_id', v_membership.id,
    'program_id', p_program_id,
    'seller_user_id', p_seller_user_id,
    'active_seller_count', v_active,
    'max_active_sellers', v_max,
    'capacity_reached_after', v_active >= v_max,
    'notification_delivery_implemented', false,
    'settlement_activated', false
  );
end;
$$;

revoke all on function public.assert_sales_partner_seller_capacity(uuid) from public, anon, authenticated;
revoke all on function public.activate_sales_partner_seller_seat(uuid, uuid, text) from public, anon, authenticated;
-- EXECUTE grants intentionally omitted until owner Staging apply + role matrix review.

comment on table public.sales_partner_program_licenses is
  'PREPARED_ONLY commercial Sales Partner licenses — tenant-owned; distinct from csp_partner_profiles.';

commit;

select 'sales_partner_commercial_license_foundation_v1_candidate_not_applied' as status;
