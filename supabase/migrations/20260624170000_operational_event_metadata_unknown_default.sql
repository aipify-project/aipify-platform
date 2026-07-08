-- Trust gate: unknown operational metadata defaults to uncertified — never implicit live.

create or replace function public._aact538_ensure_operational_event_certifications_table()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if to_regclass('public.organization_operational_event_certifications') is not null then
    return;
  end if;

  if to_regclass('public.organizations') is null
     or to_regclass('public.organization_activity_operations_events') is null then
    return;
  end if;

  execute $sql$
    create table public.organization_operational_event_certifications (
      organization_id uuid not null references public.organizations (id) on delete cascade,
      event_id uuid not null references public.organization_activity_operations_events (id) on delete cascade,
      data_classification text not null default 'live',
      source_verified boolean not null default true,
      readiness text not null default 'ready',
      freshness text not null default 'fresh',
      source_reference text not null,
      certified_at timestamptz not null default now(),
      primary key (organization_id, event_id),
      constraint organization_operational_event_certifications_classification_chk
        check (data_classification in ('live')),
      constraint organization_operational_event_certifications_readiness_chk
        check (readiness in ('ready')),
      constraint organization_operational_event_certifications_freshness_chk
        check (freshness in ('fresh', 'stale', 'unknown'))
    )
  $sql$;

  execute $sql$
    create index organization_operational_event_certifications_org_idx
      on public.organization_operational_event_certifications (organization_id, certified_at desc)
  $sql$;

  execute $sql$
    alter table public.organization_operational_event_certifications enable row level security
  $sql$;

  execute $sql$
    revoke all on public.organization_operational_event_certifications from authenticated, anon
  $sql$;
end;
$$;

do $bootstrap$
begin
  perform public._aact538_ensure_operational_event_certifications_table();
end;
$bootstrap$;

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
  v_cert_found boolean := false;
  v_data_classification text;
  v_source_verified boolean;
  v_readiness text;
  v_freshness text;
  v_source_reference text;
begin
  perform public._aact538_ensure_operational_event_certifications_table();

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

    if v_is_showcase then
      return jsonb_build_object(
        'data_classification', 'seed',
        'source_verified', false,
        'readiness', 'ready',
        'freshness', 'unknown',
        'source_reference', 'app_showcase_data_registry:organization_activity_operations_events'
      );
    end if;
  end if;

  if to_regclass('public.organization_operational_event_certifications') is not null then
    execute $sql$
      select
        c.data_classification,
        c.source_verified,
        c.readiness,
        c.freshness,
        c.source_reference
      from public.organization_operational_event_certifications c
      where c.organization_id = $1
        and c.event_id = $2
      limit 1
    $sql$
    into
      v_data_classification,
      v_source_verified,
      v_readiness,
      v_freshness,
      v_source_reference
    using p_org_id, p_event_id;

    v_cert_found := found;

    if v_cert_found then
      return jsonb_build_object(
        'data_classification', v_data_classification,
        'source_verified', v_source_verified,
        'readiness', v_readiness,
        'freshness', v_freshness,
        'source_reference', v_source_reference
      );
    end if;
  end if;

  return jsonb_build_object(
    'data_classification', 'unknown',
    'source_verified', false,
    'readiness', 'uncertified',
    'freshness', 'unknown',
    'source_reference', 'organization_activity_operations_events:uncertified'
  );
end;
$$;

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
