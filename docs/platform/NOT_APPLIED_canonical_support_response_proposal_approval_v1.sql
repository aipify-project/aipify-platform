-- NOT APPLIED. Do not copy this file into supabase/migrations.
-- Identifier: canonical_support_response_proposal_approval_v1
--
-- Ledger at authoring (origin/main 7ff4441c6147875a662f80f6da0114407fdbbeef):
--   highest filename 20261939000000_kompis_bedrift_product_entitlement_register_v1.sql
-- Do not reuse the legacy July proposal-approval migration. That slot precedes later ledger files.
-- When a later job applies this candidate, copy it to a new migration whose version is
-- greater than the ledger head at that moment. If 20261939100000 is still free, use it.
-- Re-check the ledger immediately before any apply. This file is not approval to apply.
--
-- Approval records a human decision on the current canonical proposal. It does not send
-- a reply, write an outbound message, or change case status.
-- propose_organization_support_case_response is intentionally not replaced. A later
-- proposal refresh keeps its own row. An approval stays valid only while its hashes
-- still match that row, so a changed proposal is not treated as approved.

-- ---------------------------------------------------------------------------
-- 1. Composite key so an approval cannot point at another organization
-- ---------------------------------------------------------------------------
create unique index if not exists organization_support_case_response_proposals_id_org_case_uidx
  on public.organization_support_case_response_proposals (id, organization_id, case_id);

-- ---------------------------------------------------------------------------
-- 2. Append-only approval ledger
-- ---------------------------------------------------------------------------
create table if not exists public.organization_support_case_response_proposal_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  case_id uuid not null,
  proposal_id uuid not null,
  approved_by_user_id uuid not null references public.users (id) on delete restrict,
  approved_at timestamptz not null,
  proposal_input_hash text not null,
  proposed_body_hash text not null,
  created_at timestamptz not null default now(),
  constraint organization_support_case_response_proposal_approvals_case_org_fkey
    foreign key (case_id, organization_id)
    references public.organization_support_cases (id, organization_id)
    on delete cascade,
  constraint organization_support_case_response_proposal_approvals_proposal_fkey
    foreign key (proposal_id, organization_id, case_id)
    references public.organization_support_case_response_proposals (id, organization_id, case_id)
    on delete cascade,
  constraint organization_support_case_response_proposal_approvals_hash_key
    unique (organization_id, case_id, proposal_id, proposal_input_hash, proposed_body_hash),
  constraint organization_support_case_response_proposal_approvals_input_hash_check check (
    proposal_input_hash ~ '^[a-f0-9]{64}$'
  ),
  constraint organization_support_case_response_proposal_approvals_body_hash_check check (
    proposed_body_hash ~ '^[a-f0-9]{64}$'
  )
);

create index if not exists organization_support_case_response_proposal_approvals_org_case_idx
  on public.organization_support_case_response_proposal_approvals (organization_id, case_id, approved_at desc);

alter table public.organization_support_case_response_proposal_approvals enable row level security;
revoke all on public.organization_support_case_response_proposal_approvals from public, authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. approve_organization_support_case_response_proposal
-- ---------------------------------------------------------------------------
create or replace function public.approve_organization_support_case_response_proposal(
  p_case_id uuid,
  p_expected_proposal_input_hash text,
  p_expected_proposed_body_hash text
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
  v_existing public.organization_support_case_response_proposal_approvals;
  v_context jsonb;
  v_current_hash text;
  v_primary_language text;
  v_fallback_language text;
  v_catalog_hash text;
  v_knowledge_sources jsonb;
  v_live_input_hash text;
  v_body_hash text;
  v_normalized_body text;
  v_engine_key text := 'canonical_support_response_proposal_rules';
  v_engine_version text := 'rules-v1';
  v_now timestamptz := now();
  v_source_count integer := 0;
  v_created boolean := false;
begin
  perform public._irp_require_permission('support.reply');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if v_user_id is null then
    raise exception 'Unauthorized';
  end if;

  if p_expected_proposal_input_hash is null
     or p_expected_proposed_body_hash is null
     or p_expected_proposal_input_hash !~ '^[a-f0-9]{64}$'
     or p_expected_proposed_body_hash !~ '^[a-f0-9]{64}$' then
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

  if v_case.status not in ('new', 'open', 'waiting_for_customer', 'waiting_for_internal') then
    raise exception 'support_proposal_approval_case_not_open';
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

  v_normalized_body := public._sai_proposal_normalize_body(v_proposal.proposed_body);
  if v_normalized_body is null then
    raise exception 'support_proposal_approval_not_approvable';
  end if;

  v_body_hash := encode(
    extensions.digest(convert_to(v_normalized_body, 'UTF8'), 'sha256'),
    'hex'
  );

  if v_proposal.proposal_input_hash is distinct from v_live_input_hash
     or v_proposal.engine_key is distinct from v_engine_key
     or v_proposal.engine_version is distinct from v_engine_version then
    raise exception 'support_proposal_knowledge_stale';
  end if;

  if v_proposal.proposal_input_hash is distinct from p_expected_proposal_input_hash
     or v_live_input_hash is distinct from p_expected_proposal_input_hash
     or v_body_hash is distinct from p_expected_proposed_body_hash then
    raise exception 'support_proposal_approval_hash_mismatch';
  end if;

  select * into v_existing
  from public.organization_support_case_response_proposal_approvals a
  where a.organization_id = v_org_id
    and a.case_id = p_case_id
    and a.proposal_id = v_proposal.id
    and a.proposal_input_hash = v_proposal.proposal_input_hash
    and a.proposed_body_hash = v_body_hash;

  if v_existing.id is not null then
    return jsonb_build_object(
      'approval_id', v_existing.id,
      'proposal_id', v_proposal.id,
      'case_id', p_case_id,
      'approval_status', 'approved',
      'approved_at', v_existing.approved_at,
      'approved_by_user_id', v_existing.approved_by_user_id,
      'proposal_input_hash', v_existing.proposal_input_hash,
      'proposed_body_hash', v_existing.proposed_body_hash,
      'created', false
    );
  end if;

  insert into public.organization_support_case_response_proposal_approvals (
    organization_id,
    case_id,
    proposal_id,
    approved_by_user_id,
    approved_at,
    proposal_input_hash,
    proposed_body_hash
  ) values (
    v_org_id,
    p_case_id,
    v_proposal.id,
    v_user_id,
    v_now,
    v_proposal.proposal_input_hash,
    v_body_hash
  )
  on conflict (organization_id, case_id, proposal_id, proposal_input_hash, proposed_body_hash)
  do nothing
  returning * into v_existing;

  if v_existing.id is null then
    select * into v_existing
    from public.organization_support_case_response_proposal_approvals a
    where a.organization_id = v_org_id
      and a.case_id = p_case_id
      and a.proposal_id = v_proposal.id
      and a.proposal_input_hash = v_proposal.proposal_input_hash
      and a.proposed_body_hash = v_body_hash;

    if v_existing.id is null then
      raise exception 'support_proposal_approval_rejected';
    end if;

    return jsonb_build_object(
      'approval_id', v_existing.id,
      'proposal_id', v_proposal.id,
      'case_id', p_case_id,
      'approval_status', 'approved',
      'approved_at', v_existing.approved_at,
      'approved_by_user_id', v_existing.approved_by_user_id,
      'proposal_input_hash', v_existing.proposal_input_hash,
      'proposed_body_hash', v_existing.proposed_body_hash,
      'created', false
    );
  end if;

  v_created := true;
  v_source_count := jsonb_array_length(coalesce(v_proposal.sources, '[]'::jsonb));

  perform public._sai_log(
    v_org_id,
    'support_case_response_proposal_approved',
    'support_case',
    p_case_id,
    jsonb_build_object(
      'proposal_id', v_proposal.id,
      'approval_status', 'approved',
      'proposal_input_hash', v_proposal.proposal_input_hash,
      'proposed_body_hash', v_body_hash,
      'language', v_proposal.language,
      'source_count', v_source_count,
      'engine_key', v_proposal.engine_key,
      'engine_version', v_proposal.engine_version,
      'case_status', v_case.status
    ),
    true
  );

  return jsonb_build_object(
    'approval_id', v_existing.id,
    'proposal_id', v_proposal.id,
    'case_id', p_case_id,
    'approval_status', 'approved',
    'approved_at', v_existing.approved_at,
    'approved_by_user_id', v_existing.approved_by_user_id,
    'proposal_input_hash', v_existing.proposal_input_hash,
    'proposed_body_hash', v_existing.proposed_body_hash,
    'created', v_created
  );
end;
$$;

revoke all on function public.approve_organization_support_case_response_proposal(uuid, text, text) from public, anon;
grant execute on function public.approve_organization_support_case_response_proposal(uuid, text, text) to authenticated;
