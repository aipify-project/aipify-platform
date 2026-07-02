-- P1.13CV — Canonical support response proposal approval (approval-only, no send)

-- ---------------------------------------------------------------------------
-- 1. Extend organization_support_case_response_proposals
-- ---------------------------------------------------------------------------
alter table public.organization_support_case_response_proposals
  add column if not exists approval_status text not null default 'pending',
  add column if not exists approved_by_user_id uuid references public.users (id) on delete set null,
  add column if not exists approved_at timestamptz,
  add column if not exists approved_proposal_input_hash text;

alter table public.organization_support_case_response_proposals
  drop constraint if exists organization_support_case_response_proposals_approval_status_check;

alter table public.organization_support_case_response_proposals
  add constraint organization_support_case_response_proposals_approval_status_check check (
    approval_status in ('pending', 'approved')
  );

alter table public.organization_support_case_response_proposals
  drop constraint if exists organization_support_case_response_proposals_approval_fields_check;

alter table public.organization_support_case_response_proposals
  add constraint organization_support_case_response_proposals_approval_fields_check check (
    (
      approval_status = 'pending'
      and approved_by_user_id is null
      and approved_at is null
      and approved_proposal_input_hash is null
    )
    or (
      approval_status = 'approved'
      and approved_by_user_id is not null
      and approved_at is not null
      and approved_proposal_input_hash is not null
    )
  );

-- ---------------------------------------------------------------------------
-- 2. Reset approval on proposal refresh (version control)
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
      approval_status = 'pending',
      approved_by_user_id = null,
      approved_at = null,
      approved_proposal_input_hash = null,
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
    approval_status = 'pending',
    approved_by_user_id = null,
    approved_at = null,
    approved_proposal_input_hash = null,
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

-- ---------------------------------------------------------------------------
-- 3. approve_organization_support_case_response_proposal
-- ---------------------------------------------------------------------------
create or replace function public.approve_organization_support_case_response_proposal(
  p_case_id uuid,
  p_expected_proposal_input_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_case public.organization_support_cases;
  v_understanding public.organization_support_case_understandings;
  v_knowledge public.organization_support_case_knowledge_contexts;
  v_proposal public.organization_support_case_response_proposals;
  v_context jsonb;
  v_current_hash text;
  v_primary_language text;
  v_fallback_language text;
  v_catalog_hash text;
  v_knowledge_sources jsonb;
  v_live_input_hash text;
  v_engine_key text := 'canonical_support_response_proposal_rules';
  v_engine_version text := 'rules-v1';
  v_now timestamptz := now();
  v_created boolean := false;
  v_source_count integer := 0;
begin
  perform public._irp_require_permission('support.reply');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if v_user_id is null then
    raise exception 'Unauthorized';
  end if;

  if p_expected_proposal_input_hash is null
     or btrim(p_expected_proposal_input_hash) = ''
     or p_expected_proposal_input_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'support_proposal_approval_expected_hash_invalid';
  end if;

  perform pg_advisory_xact_lock(public._sai_proposal_lock_key(v_org_id, p_case_id));

  select * into v_case
  from public.organization_support_cases c
  where c.id = p_case_id
    and c.organization_id = v_org_id;

  if v_case.id is null then
    raise exception 'Case not found';
  end if;

  select * into v_proposal
  from public.organization_support_case_response_proposals p
  where p.organization_id = v_org_id
    and p.case_id = p_case_id;

  if v_proposal.id is null then
    raise exception 'support_proposal_approval_required';
  end if;

  if v_proposal.status <> 'proposed' or v_proposal.proposed_body is null then
    raise exception 'support_proposal_approval_not_approvable';
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

  v_live_input_hash := public._sai_proposal_input_hash(
    v_current_hash,
    v_catalog_hash,
    v_knowledge_sources,
    v_engine_key,
    v_engine_version
  );

  if v_proposal.proposal_input_hash is distinct from v_live_input_hash then
    raise exception 'support_proposal_knowledge_stale';
  end if;

  if v_proposal.proposal_input_hash is distinct from p_expected_proposal_input_hash
     or v_live_input_hash is distinct from p_expected_proposal_input_hash then
    raise exception 'support_proposal_approval_hash_mismatch';
  end if;

  v_source_count := jsonb_array_length(coalesce(v_proposal.sources, '[]'::jsonb));

  if v_proposal.approval_status = 'approved'
     and v_proposal.approved_proposal_input_hash = v_proposal.proposal_input_hash then
    return jsonb_build_object(
      'proposal_id', v_proposal.id,
      'case_id', p_case_id,
      'approval_status', v_proposal.approval_status,
      'approved_at', v_proposal.approved_at,
      'created', false
    );
  end if;

  update public.organization_support_case_response_proposals
  set
    approval_status = 'approved',
    approved_by_user_id = v_user_id,
    approved_at = v_now,
    approved_proposal_input_hash = v_proposal.proposal_input_hash,
    updated_at = v_now
  where organization_id = v_org_id
    and case_id = p_case_id
  returning * into v_proposal;

  v_created := true;

  perform public._sai_log(
    v_org_id,
    'support_case_response_proposal_approved',
    'support_case',
    p_case_id,
    jsonb_build_object(
      'status', v_proposal.status,
      'language', v_proposal.language,
      'source_count', v_source_count,
      'source_types', (
        select coalesce(jsonb_agg(distinct elem ->> 'source_type'), '[]'::jsonb)
        from jsonb_array_elements(coalesce(v_proposal.sources, '[]'::jsonb)) elem
      ),
      'engine_key', v_proposal.engine_key,
      'engine_version', v_proposal.engine_version
    ),
    true
  );

  return jsonb_build_object(
    'proposal_id', v_proposal.id,
    'case_id', p_case_id,
    'approval_status', v_proposal.approval_status,
    'approved_at', v_proposal.approved_at,
    'created', v_created
  );
end;
$$;

revoke all on function public.approve_organization_support_case_response_proposal(uuid, text) from public, anon;
grant execute on function public.approve_organization_support_case_response_proposal(uuid, text) to authenticated;
