-- Operational activity events: interim dependency-free metadata stub.
-- Canonical provider metadata (showcase registry + fail-closed certification) is installed
-- after Phase 620 prerequisites in 20261862510000_phase620_app_showcase_seed_function_fix.sql.

create or replace function public._aact538_operational_event_metadata(
  p_org_id uuid,
  p_event_id uuid
)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'data_classification', 'live',
    'source_verified', true,
    'readiness', 'ready',
    'freshness', 'fresh',
    'source_reference', 'organization_activity_operations_events'
  );
$$;

grant execute on function public._aact538_operational_event_metadata(uuid, uuid) to authenticated;
