-- P1.13CQ — Canonical support response proposal (proposal-only, no send/ASO)

-- ---------------------------------------------------------------------------
-- 1. organization_support_case_response_proposals
-- ---------------------------------------------------------------------------
create table if not exists public.organization_support_case_response_proposals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  case_id uuid not null,
  status text not null,
  proposed_body text,
  language text not null,
  sources jsonb not null default '[]'::jsonb,
  understanding_message_set_hash text not null,
  knowledge_catalog_hash text not null,
  proposal_input_hash text not null,
  engine_key text not null,
  engine_version text not null,
  proposed_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organization_support_case_response_proposals_case_org_fkey
    foreign key (case_id, organization_id)
    references public.organization_support_cases (id, organization_id)
    on delete cascade,
  constraint organization_support_case_response_proposals_org_case_key
    unique (organization_id, case_id),
  constraint organization_support_case_response_proposals_sources_array check (
    jsonb_typeof(sources) = 'array'
  ),
  constraint organization_support_case_response_proposals_status_check check (
    status in ('proposed', 'needs_human_review')
  ),
  constraint organization_support_case_response_proposals_body_len check (
    proposed_body is null or char_length(proposed_body) between 1 and 8000
  )
);

create index if not exists organization_support_case_response_proposals_org_case_idx
  on public.organization_support_case_response_proposals (organization_id, case_id);

alter table public.organization_support_case_response_proposals enable row level security;
revoke all on public.organization_support_case_response_proposals from public, authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Internal helpers (RPC-only)
-- ---------------------------------------------------------------------------
create or replace function public._sai_proposal_lock_key(
  p_organization_id uuid,
  p_case_id uuid
)
returns bigint
language sql
immutable
set search_path = public
as $$
  select hashtextextended(
    'support_response_proposal:' || coalesce(p_organization_id::text, '') || ':' || coalesce(p_case_id::text, ''),
    0
  );
$$;

create or replace function public._sai_proposal_normalize_body(p_text text)
returns text
language sql
immutable
set search_path = public
as $$
  select case
    when p_text is null or btrim(p_text) = '' then null
    else left(
      btrim(
        regexp_replace(
          regexp_replace(btrim(p_text), E'[\\t\\r\\n]+', ' ', 'g'),
          E' +',
          ' ',
          'g'
        )
      ),
      8000
    )
  end;
$$;

create or replace function public._sai_proposal_input_hash(
  p_message_set_hash text,
  p_catalog_hash text,
  p_knowledge_sources jsonb,
  p_engine_key text,
  p_engine_version text
)
returns text
language sql
immutable
set search_path = public
as $$
  select encode(
    extensions.digest(
      convert_to(
        coalesce(p_message_set_hash, '') || '|' ||
        coalesce(p_catalog_hash, '') || '|' ||
        coalesce(p_knowledge_sources::text, '[]') || '|' ||
        coalesce(p_engine_key, '') || '|' ||
        coalesce(p_engine_version, ''),
        'UTF8'
      ),
      'sha256'
    ),
    'hex'
  );
$$;

create or replace function public._sai_proposal_sources_equal(
  p_left jsonb,
  p_right jsonb
)
returns boolean
language sql
immutable
set search_path = public
as $$
  select coalesce(p_left, '[]'::jsonb) = coalesce(p_right, '[]'::jsonb);
$$;

create or replace function public._sai_proposal_source_metadata(p_elem jsonb)
returns jsonb
language sql
immutable
set search_path = public
as $$
  select jsonb_build_object(
    'source_id', p_elem ->> 'source_id',
    'source_type', p_elem ->> 'source_type',
    'language', p_elem ->> 'language',
    'version', (p_elem ->> 'version')::int,
    'relevance_score', (p_elem ->> 'relevance_score')::numeric,
    'relevance_reason', p_elem ->> 'relevance_reason_code'
  );
$$;

create or replace function public._sai_proposal_fetch_validated_body(
  p_organization_id uuid,
  p_elem jsonb
)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_source_id uuid;
  v_source_type text;
  v_version int;
  v_body text;
begin
  if p_elem is null or jsonb_typeof(p_elem) <> 'object' then
    return null;
  end if;

  v_source_type := nullif(btrim(p_elem ->> 'source_type'), '');
  begin
    v_source_id := (p_elem ->> 'source_id')::uuid;
  exception
    when others then
      return null;
  end;

  if v_source_id is null or v_source_type is null then
    return null;
  end if;

  v_version := coalesce((p_elem ->> 'version')::int, 1);

  if v_source_type = 'faq' then
    select f.answer into v_body
    from public.knowledge_faq_items f
    where f.id = v_source_id
      and f.organization_id = p_organization_id
      and f.status = 'published'
      and f.visibility in ('customer', 'public')
      and v_version = 1;

    return public._sai_proposal_normalize_body(v_body);
  end if;

  if v_source_type = 'article' then
    select a.content into v_body
    from public.knowledge_articles a
    where a.id = v_source_id
      and a.organization_id = p_organization_id
      and a.status = 'published'
      and a.visibility in ('customer', 'public')
      and a.version = v_version;

    return public._sai_proposal_normalize_body(v_body);
  end if;

  return null;
end;
$$;

create or replace function public._sai_proposal_select_from_sources(
  p_organization_id uuid,
  p_sources jsonb
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_elem jsonb;
  v_body text;
  v_selected jsonb;
  v_language text;
begin
  if p_sources is null or jsonb_typeof(p_sources) <> 'array' then
    return jsonb_build_object('proposed_body', null, 'selected', null, 'language', null);
  end if;

  for v_elem in
    select elem
    from jsonb_array_elements(p_sources) elem
    order by
      (elem ->> 'relevance_score')::numeric desc nulls last,
      (elem ->> 'version')::int desc nulls last,
      elem ->> 'source_id' asc
  loop
    v_body := public._sai_proposal_fetch_validated_body(p_organization_id, v_elem);
    if v_body is not null then
      v_selected := public._sai_proposal_source_metadata(v_elem);
      v_language := nullif(btrim(v_elem ->> 'language'), '');
      return jsonb_build_object(
        'proposed_body', v_body,
        'selected', v_selected,
        'language', v_language
      );
    end if;
  end loop;

  return jsonb_build_object('proposed_body', null, 'selected', null, 'language', null);
end;
$$;

revoke all on function public._sai_proposal_lock_key(uuid, uuid) from public, anon, authenticated, service_role;
revoke all on function public._sai_proposal_normalize_body(text) from public, anon, authenticated, service_role;
revoke all on function public._sai_proposal_input_hash(text, text, jsonb, text, text) from public, anon, authenticated, service_role;
revoke all on function public._sai_proposal_sources_equal(jsonb, jsonb) from public, anon, authenticated, service_role;
revoke all on function public._sai_proposal_source_metadata(jsonb) from public, anon, authenticated, service_role;
revoke all on function public._sai_proposal_fetch_validated_body(uuid, jsonb) from public, anon, authenticated, service_role;
revoke all on function public._sai_proposal_select_from_sources(uuid, jsonb) from public, anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 3. propose_organization_support_case_response
-- ---------------------------------------------------------------------------
create or replace function public.propose_organization_support_case_response(p_case_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_case public.organization_support_cases;
  v_understanding public.organization_support_case_understandings;
  v_knowledge public.organization_support_case_knowledge_contexts;
  v_existing public.organization_support_case_response_proposals;
  v_context jsonb;
  v_current_hash text;
  v_primary_language text;
  v_fallback_language text;
  v_catalog_hash text;
  v_knowledge_sources jsonb;
  v_selection jsonb;
  v_proposed_body text;
  v_selected jsonb;
  v_language text;
  v_result_sources jsonb := '[]'::jsonb;
  v_status text;
  v_input_hash text;
  v_now timestamptz := now();
  v_engine_key text := 'canonical_support_response_proposal_rules';
  v_engine_version text := 'rules-v1';
  v_created boolean := false;
  v_output_unchanged boolean := false;
  v_source_count integer := 0;
  v_proposed_at timestamptz;
begin
  perform public._irp_require_permission('support.view');
  v_org_id := public._mta_require_organization();

  perform pg_advisory_xact_lock(public._sai_proposal_lock_key(v_org_id, p_case_id));

  select * into v_case
  from public.organization_support_cases c
  where c.id = p_case_id
    and c.organization_id = v_org_id;

  if v_case.id is null then
    raise exception 'Case not found';
  end if;

  select * into v_understanding
  from public.organization_support_case_understandings u
  where u.organization_id = v_org_id
    and u.case_id = p_case_id;

  if v_understanding.id is null then
    raise exception 'support_proposal_understanding_required';
  end if;

  v_context := public._sai_inbound_message_set_context(v_org_id, p_case_id);
  v_current_hash := v_context ->> 'message_set_hash';

  if v_understanding.message_set_hash is distinct from v_current_hash then
    raise exception 'support_proposal_understanding_stale';
  end if;

  select * into v_knowledge
  from public.organization_support_case_knowledge_contexts k
  where k.organization_id = v_org_id
    and k.case_id = p_case_id;

  if v_knowledge.id is null then
    raise exception 'support_proposal_knowledge_required';
  end if;

  if v_knowledge.understanding_message_set_hash is distinct from v_current_hash then
    raise exception 'support_proposal_knowledge_stale';
  end if;

  select l.primary_language, l.fallback_language
  into v_primary_language, v_fallback_language
  from public._sai_knowledge_resolve_search_languages(v_org_id, v_understanding.language) l;

  v_catalog_hash := public._sai_knowledge_catalog_hash(v_org_id, v_primary_language, v_fallback_language);

  if v_knowledge.knowledge_catalog_hash is distinct from v_catalog_hash then
    raise exception 'support_proposal_knowledge_stale';
  end if;

  v_knowledge_sources := coalesce(v_knowledge.sources, '[]'::jsonb);

  v_selection := public._sai_proposal_select_from_sources(v_org_id, v_knowledge_sources);

  v_proposed_body := case
    when v_selection -> 'proposed_body' is null or jsonb_typeof(v_selection -> 'proposed_body') = 'null' then null
    else v_selection ->> 'proposed_body'
  end;

  v_selected := case
    when v_selection -> 'selected' is null or jsonb_typeof(v_selection -> 'selected') = 'null' then null
    else v_selection -> 'selected'
  end;

  v_language := nullif(btrim(v_selection ->> 'language'), '');

  if v_language is null or btrim(v_language) = '' then
    v_language := coalesce(
      nullif(btrim(v_understanding.language), ''),
      v_primary_language,
      'en'
    );
  end if;

  if v_selected is not null then
    v_result_sources := jsonb_build_array(v_selected);
  end if;

  v_status := case
    when v_proposed_body is not null then 'proposed'
    else 'needs_human_review'
  end;

  v_source_count := jsonb_array_length(v_result_sources);

  v_input_hash := public._sai_proposal_input_hash(
    v_current_hash,
    v_catalog_hash,
    v_knowledge_sources,
    v_engine_key,
    v_engine_version
  );

  select * into v_existing
  from public.organization_support_case_response_proposals p
  where p.organization_id = v_org_id
    and p.case_id = p_case_id;

  v_output_unchanged := found
    and v_existing.proposed_body is not distinct from v_proposed_body
    and v_existing.status = v_status
    and v_existing.language = v_language
    and public._sai_proposal_sources_equal(v_existing.sources, v_result_sources);

  if found
    and v_existing.proposal_input_hash = v_input_hash
    and v_existing.engine_key = v_engine_key
    and v_existing.engine_version = v_engine_version
    and v_output_unchanged then
    return jsonb_build_object(
      'case_id', p_case_id,
      'created', false,
      'status', v_existing.status,
      'proposed_body', v_existing.proposed_body,
      'language', v_existing.language,
      'sources', coalesce(v_existing.sources, '[]'::jsonb),
      'source_count', jsonb_array_length(coalesce(v_existing.sources, '[]'::jsonb)),
      'engine_key', v_existing.engine_key,
      'engine_version', v_existing.engine_version,
      'proposed_at', v_existing.proposed_at,
      'priority', v_case.priority,
      'priority_source', v_case.priority_source,
      'assigned_to', v_case.assigned_to
    );
  end if;

  if v_output_unchanged
    and v_existing.proposal_input_hash is distinct from v_input_hash then
    update public.organization_support_case_response_proposals
    set
      proposal_input_hash = v_input_hash,
      understanding_message_set_hash = v_current_hash,
      knowledge_catalog_hash = v_catalog_hash,
      updated_at = v_now
    where organization_id = v_org_id
      and case_id = p_case_id;

    return jsonb_build_object(
      'case_id', p_case_id,
      'created', false,
      'status', v_existing.status,
      'proposed_body', v_existing.proposed_body,
      'language', v_existing.language,
      'sources', coalesce(v_existing.sources, '[]'::jsonb),
      'source_count', jsonb_array_length(coalesce(v_existing.sources, '[]'::jsonb)),
      'engine_key', v_existing.engine_key,
      'engine_version', v_existing.engine_version,
      'proposed_at', v_existing.proposed_at,
      'priority', v_case.priority,
      'priority_source', v_case.priority_source,
      'assigned_to', v_case.assigned_to
    );
  end if;

  v_created := not found or not v_output_unchanged;
  v_proposed_at := case when v_created then v_now else coalesce(v_existing.proposed_at, v_now) end;

  insert into public.organization_support_case_response_proposals (
    organization_id,
    case_id,
    status,
    proposed_body,
    language,
    sources,
    understanding_message_set_hash,
    knowledge_catalog_hash,
    proposal_input_hash,
    engine_key,
    engine_version,
    proposed_at,
    updated_at
  ) values (
    v_org_id,
    p_case_id,
    v_status,
    v_proposed_body,
    v_language,
    v_result_sources,
    v_current_hash,
    v_catalog_hash,
    v_input_hash,
    v_engine_key,
    v_engine_version,
    v_proposed_at,
    v_now
  )
  on conflict (organization_id, case_id) do update set
    status = excluded.status,
    proposed_body = excluded.proposed_body,
    language = excluded.language,
    sources = excluded.sources,
    understanding_message_set_hash = excluded.understanding_message_set_hash,
    knowledge_catalog_hash = excluded.knowledge_catalog_hash,
    proposal_input_hash = excluded.proposal_input_hash,
    engine_key = excluded.engine_key,
    engine_version = excluded.engine_version,
    proposed_at = case when v_created then excluded.proposed_at else organization_support_case_response_proposals.proposed_at end,
    updated_at = excluded.updated_at;

  if v_created then
    perform public._sai_log(
      v_org_id,
      'support_case_response_proposed',
      'support_case',
      p_case_id,
      jsonb_build_object(
        'status', v_status,
        'language', v_language,
        'source_count', v_source_count,
        'source_types', (
          select coalesce(jsonb_agg(distinct elem ->> 'source_type'), '[]'::jsonb)
          from jsonb_array_elements(v_result_sources) elem
        ),
        'engine_key', v_engine_key,
        'engine_version', v_engine_version
      ),
      true
    );
  end if;

  return jsonb_build_object(
    'case_id', p_case_id,
    'created', v_created,
    'status', v_status,
    'proposed_body', v_proposed_body,
    'language', v_language,
    'sources', v_result_sources,
    'source_count', v_source_count,
    'engine_key', v_engine_key,
    'engine_version', v_engine_version,
    'proposed_at', v_proposed_at,
    'priority', v_case.priority,
    'priority_source', v_case.priority_source,
    'assigned_to', v_case.assigned_to
  );
end;
$$;

revoke all on function public.propose_organization_support_case_response(uuid) from public, anon;
grant execute on function public.propose_organization_support_case_response(uuid) to authenticated;
