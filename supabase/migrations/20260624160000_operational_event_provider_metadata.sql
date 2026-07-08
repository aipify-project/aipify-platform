-- Operational activity events: explicit provider metadata for generic Core classification.
-- Showcase/demo rows are classified via app_showcase_data_registry — not runtime heuristics.

create or replace function public._aact538_operational_event_metadata(
  p_org_id uuid,
  p_event_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_is_showcase boolean := false;
begin
  if to_regclass('public.app_showcase_data_registry') is not null then
    execute $sql$
      select exists (
        select 1
        from public.app_showcase_data_registry r
        where r.organization_id = $1
          and r.table_name = 'organization_activity_operations_events'
          and r.record_id = $2
      )
    $sql$
    into v_is_showcase
    using p_org_id, p_event_id;
  end if;

  if v_is_showcase then
    return jsonb_build_object(
      'data_classification', 'seed',
      'source_verified', false,
      'readiness', 'ready',
      'freshness', 'unknown',
      'source_reference', 'app_showcase_data_registry:organization_activity_operations_events'
    );
  end if;

  return jsonb_build_object(
    'data_classification', 'live',
    'source_verified', true,
    'readiness', 'ready',
    'freshness', 'fresh',
    'source_reference', 'organization_activity_operations_events'
  );
end;
$$;

-- Event row serializer depends on organization_activity_operations_events (phase 538).
do $guard$
begin
  if to_regclass('public.organization_activity_operations_events') is not null then
    execute $create$
      create or replace function public._aact538_event_json(r public.organization_activity_operations_events)
      returns jsonb
      language sql
      stable
      security definer
      set search_path = public
      as $func$
        select jsonb_build_object(
          'id', r.id,
          'event_number', r.event_number,
          'scope', r.scope,
          'category', r.category,
          'priority', r.priority,
          'title', r.title,
          'summary', r.summary,
          'actor_user_id', r.actor_user_id,
          'department_id', r.department_id,
          'domain_id', r.domain_id,
          'business_pack_key', r.business_pack_key,
          'entity_type', r.entity_type,
          'entity_id', r.entity_id,
          'record_href', r.record_href,
          'impact_note', r.impact_note,
          'recommendation', r.recommendation,
          'occurred_at', r.occurred_at
        ) || public._aact538_operational_event_metadata(r.organization_id, r.id);
      $func$;
    $create$;

    grant execute on function public._aact538_event_json(public.organization_activity_operations_events) to authenticated;
  end if;
end;
$guard$;

grant execute on function public._aact538_operational_event_metadata(uuid, uuid) to authenticated;
