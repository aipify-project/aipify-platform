-- Trust gate: unknown operational metadata defaults to uncertified — never implicit live.

create table if not exists public.organization_operational_event_certifications (
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
);

create index if not exists organization_operational_event_certifications_org_idx
  on public.organization_operational_event_certifications (organization_id, certified_at desc);

alter table public.organization_operational_event_certifications enable row level security;
revoke all on public.organization_operational_event_certifications from authenticated, anon;

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
  v_cert public.organization_operational_event_certifications;
begin
  if exists (
    select 1
    from public.app_showcase_data_registry r
    where r.organization_id = p_org_id
      and r.table_name = 'organization_activity_operations_events'
      and r.record_id = p_event_id
  ) then
    return jsonb_build_object(
      'data_classification', 'seed',
      'source_verified', false,
      'readiness', 'ready',
      'freshness', 'unknown',
      'source_reference', 'app_showcase_data_registry:organization_activity_operations_events'
    );
  end if;

  select *
  into v_cert
  from public.organization_operational_event_certifications c
  where c.organization_id = p_org_id
    and c.event_id = p_event_id;

  if found then
    return jsonb_build_object(
      'data_classification', v_cert.data_classification,
      'source_verified', v_cert.source_verified,
      'readiness', v_cert.readiness,
      'freshness', v_cert.freshness,
      'source_reference', v_cert.source_reference
    );
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

create or replace function public._aact538_event_json(r public.organization_activity_operations_events)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
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
$$;

grant execute on function public._aact538_operational_event_metadata(uuid, uuid) to authenticated;
