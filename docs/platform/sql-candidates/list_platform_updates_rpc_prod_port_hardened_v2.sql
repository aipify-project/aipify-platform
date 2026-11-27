-- CANDIDATE ONLY — DO NOT APPLY without explicit owner approval naming this package.
-- Package: list_platform_updates_rpc_prod_port_hardened_v2
-- Target: Production Core ONLY for this gate (Staging lacks platform_updates tables — separate parity work).
-- Goal: Read-only Platform Admin list of platform_updates for Drift → Publiseringer.
-- Supersedes apply readiness of: list_platform_updates_rpc_prod_port_v1
--   (v1 GRANT authenticated without REVOKE leaves default PUBLIC EXECUTE).
-- Dependencies (verified present on Production qbcqoixhrvhnuwphefvw 2026-11-27):
--   - public.is_platform_admin()
--   - public.platform_updates (RLS on; no anon/authenticated table grants)
--   - public.platform_update_targets (RLS on; no anon/authenticated table grants)
-- Response shape: unchanged vs phase18 / v1 (jsonb array of update rows).
-- Consequence:
--   CREATE OR REPLACE list_platform_updates();
--   REVOKE ALL FROM PUBLIC + anon;
--   GRANT EXECUTE TO authenticated (+ service_role for ops tooling).
-- Authorization: body requires is_platform_admin(); non-admins raise 'Not authorized'.
-- Read-only: SELECT only; no publish/update/insert/delete of customer or update rows.
-- Approval text:
--   "Approve apply of list_platform_updates_rpc_prod_port_hardened_v2 to Production Core qbcqoixhrvhnuwphefvw only (single apply)"

create or replace function public.list_platform_updates()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rows jsonb;
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  select coalesce(jsonb_agg(row_to_json(t)::jsonb order by t.scheduled_at desc nulls last, t.created_at desc), '[]'::jsonb)
  into v_rows
  from (
    select
      u.id,
      u.version,
      u.title,
      u.description,
      u.scheduled_at,
      u.expected_duration_minutes,
      u.status,
      u.update_type,
      u.update_channel,
      u.rollback_available,
      u.created_at,
      (select count(*)::int from public.platform_update_targets t where t.update_id = u.id) as affected_installations
    from public.platform_updates u
  ) t;

  return v_rows;
end;
$$;

revoke all on function public.list_platform_updates() from public;
revoke all on function public.list_platform_updates() from anon;
grant execute on function public.list_platform_updates() to authenticated;
grant execute on function public.list_platform_updates() to service_role;
