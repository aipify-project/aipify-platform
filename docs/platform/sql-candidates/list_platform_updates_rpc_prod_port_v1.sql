-- CANDIDATE ONLY — DO NOT APPLY without explicit owner approval naming this package.
-- Package: list_platform_updates_rpc_prod_port_v1
-- Target: Production Core (and Staging if parity required)
-- Goal: Expose authenticated Platform Admin read of platform_updates for Drift → Publiseringer.
-- Source migration excerpt: supabase/migrations/20260610500000_update_engine_phase18.sql
-- Dependencies:
--   - public.is_platform_admin()
--   - public.platform_updates
--   - public.platform_update_targets
-- Consequence: Creates/replaces list_platform_updates(); grants execute to authenticated.
-- Not applied by ops functional repair V3 code path.
-- Approval text: "Approve apply of list_platform_updates_rpc_prod_port_v1 to Production Core"

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

grant execute on function public.list_platform_updates() to authenticated;
