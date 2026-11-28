-- PREPARED_ONLY — do not apply until exact owner Staging approval, then separate Production approval.
-- AIPIFY — Sales Partner license snapshot read RPC V1
--
-- PURPOSE
--   Thin security-definer read of tenant commercial program license snapshot.
--   Complements sales_partner_commercial_license_foundation_v1 tables/RPCs.
--
-- EFFECTS (when applied)
--   + public.get_sales_partner_program_license_snapshot(uuid)
--   revoke all execute from public/anon/authenticated (grants deferred)
--
-- NON-EFFECTS
--   Does NOT grant EXECUTE to authenticated
--   Does NOT enable purchase UI or Stripe
--   Does NOT seed license rows
--
-- DEPENDS ON
--   sales_partner_commercial_license_foundation_v1 (tables)
--
-- OWNER GATES
--   1) Staging YES
--   2) Separate Production YES
--   APPLY_BLOCKED_UNTIL_OWNER_YES

begin;

create or replace function public.get_sales_partner_program_license_snapshot(
  p_owner_tenant_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_program public.sales_partner_programs%rowtype;
  v_license public.sales_partner_program_licenses%rowtype;
  v_active integer := 0;
begin
  if p_owner_tenant_id is null then
    return jsonb_build_object('ok', false, 'error', 'tenant_required');
  end if;

  select * into v_program
  from public.sales_partner_programs
  where owner_tenant_id = p_owner_tenant_id
    and kind = 'tenant_commercial'
    and active = true
  order by created_at asc
  limit 1;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'program_not_found');
  end if;

  if v_program.license_id is null then
    return jsonb_build_object(
      'ok', true,
      'program_id', v_program.id,
      'owner_tenant_id', v_program.owner_tenant_id,
      'program_kind', v_program.kind,
      'status', 'missing',
      'source', 'none',
      'license_level_key', null,
      'max_active_sellers', null,
      'active_seller_count', 0,
      'expires_at', null
    );
  end if;

  select * into v_license
  from public.sales_partner_program_licenses
  where id = v_program.license_id;

  if not found or v_license.owner_tenant_id is distinct from p_owner_tenant_id then
    return jsonb_build_object('ok', false, 'error', 'license_missing');
  end if;

  select count(*)::integer into v_active
  from public.sales_partner_program_memberships
  where program_id = v_program.id
    and status = 'active';

  return jsonb_build_object(
    'ok', true,
    'program_id', v_program.id,
    'owner_tenant_id', v_program.owner_tenant_id,
    'program_kind', v_program.kind,
    'status', v_license.status,
    'source', v_license.source,
    'license_level_key', v_license.license_level_key,
    'max_active_sellers', v_license.max_active_sellers,
    'active_seller_count', v_active,
    'expires_at', v_license.expires_at
  );
end;
$$;

revoke all on function public.get_sales_partner_program_license_snapshot(uuid)
  from public, anon, authenticated;

comment on function public.get_sales_partner_program_license_snapshot(uuid) is
  'PREPARED_ONLY tenant commercial Sales Partner license snapshot — no purchase UI.';

commit;
