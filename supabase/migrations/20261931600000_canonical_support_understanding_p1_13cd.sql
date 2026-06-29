-- P1.13CD — Canonical support case understanding (V1 rules engine, idempotent)

-- ---------------------------------------------------------------------------
-- 1. organization_support_case_understandings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_support_case_understandings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  case_id uuid not null,
  summary text not null,
  intent text not null,
  category text not null,
  language text not null,
  confidence numeric(4, 3) not null,
  status text not null,
  message_set_hash text not null,
  message_count integer not null,
  engine_key text not null,
  engine_version text not null,
  analyzed_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organization_support_case_understandings_case_org_fkey
    foreign key (case_id, organization_id)
    references public.organization_support_cases (id, organization_id)
    on delete cascade,
  constraint organization_support_case_understandings_org_case_key
    unique (organization_id, case_id),
  constraint organization_support_case_understandings_summary_len check (
    char_length(summary) between 1 and 500
  ),
  constraint organization_support_case_understandings_intent_len check (
    char_length(intent) between 1 and 160
  ),
  constraint organization_support_case_understandings_confidence_range check (
    confidence >= 0 and confidence <= 1
  ),
  constraint organization_support_case_understandings_message_count_min check (
    message_count >= 1
  ),
  constraint organization_support_case_understandings_status_check check (
    status in ('complete', 'low_confidence', 'failed')
  ),
  constraint organization_support_case_understandings_category_check check (
    category in (
      'delivery',
      'refund',
      'account',
      'payment',
      'subscription',
      'booking',
      'verification',
      'complaint',
      'technical',
      'general'
    )
  )
);

create index if not exists organization_support_case_understandings_org_case_idx
  on public.organization_support_case_understandings (organization_id, case_id);

alter table public.organization_support_case_understandings enable row level security;
revoke all on public.organization_support_case_understandings from public, authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Internal helpers (RPC-only — not client executable)
-- ---------------------------------------------------------------------------
create or replace function public._sai_understanding_lock_key(
  p_organization_id uuid,
  p_case_id uuid
)
returns bigint
language sql
immutable
set search_path = public
as $$
  select hashtextextended(
    'support_understanding:' || coalesce(p_organization_id::text, '') || ':' || coalesce(p_case_id::text, ''),
    0
  );
$$;

create or replace function public._sai_inbound_message_set_context(
  p_organization_id uuid,
  p_case_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_hash_input text;
  v_hash text;
  v_count integer := 0;
  v_subject text;
  v_analysis_text text;
begin
  select count(*)::int,
    coalesce(
      string_agg(
        m.id::text || '|' || m.created_at::text || '|' || m.body,
        E'\n'
        order by m.created_at asc, m.id asc
      ),
      ''
    ),
    coalesce(
      string_agg(m.body, E'\n\n' order by m.created_at asc, m.id asc),
      ''
    )
  into v_count, v_hash_input, v_analysis_text
  from public.organization_support_case_messages m
  where m.organization_id = p_organization_id
    and m.case_id = p_case_id
    and m.direction = 'inbound';

  v_hash := encode(
    extensions.digest(convert_to(coalesce(v_hash_input, ''), 'UTF8'), 'sha256'),
    'hex'
  );

  select c.subject into v_subject
  from public.organization_support_cases c
  where c.id = p_case_id
    and c.organization_id = p_organization_id;

  return jsonb_build_object(
    'message_set_hash', v_hash,
    'message_count', coalesce(v_count, 0),
    'subject', coalesce(v_subject, ''),
    'analysis_text', coalesce(v_analysis_text, '')
  );
end;
$$;

create or replace function public._sai_canonical_intent_from_category(p_category text)
returns text
language sql
immutable
set search_path = public
as $$
  select case coalesce(p_category, 'general')
    when 'delivery' then 'Customer inquiry about delivery or shipping status'
    when 'refund' then 'Customer requests a refund or return'
    when 'account' then 'Customer needs account or login assistance'
    when 'payment' then 'Customer inquiry about payment or billing'
    when 'subscription' then 'Customer inquiry about subscription or plan'
    when 'booking' then 'Customer inquiry about booking or appointment'
    when 'verification' then 'Customer needs verification or approval help'
    when 'complaint' then 'Customer complaint requiring attention'
    when 'technical' then 'Customer reports a technical issue'
    else 'General customer support inquiry'
  end;
$$;

create or replace function public._sai_canonical_understanding_confidence(p_category text)
returns numeric
language sql
immutable
set search_path = public
as $$
  select case
    when coalesce(p_category, 'general') = 'general' then 0.350
    else 0.750
  end;
$$;

create or replace function public._sai_canonical_understanding_summary(
  p_subject text,
  p_analysis_text text
)
returns text
language plpgsql
immutable
set search_path = public
as $$
declare
  v_subject text := btrim(coalesce(p_subject, ''));
  v_body text := btrim(coalesce(p_analysis_text, ''));
  v_first_sentence text;
  v_summary text;
begin
  if v_body <> '' then
    v_first_sentence := btrim(
      coalesce(
        nullif(
          substring(v_body from '^[^.!?\n]+'),
          ''
        ),
        left(v_body, 200)
      )
    );
  else
    v_first_sentence := '';
  end if;

  if v_subject <> '' and v_first_sentence <> '' then
    v_summary := v_subject || ': ' || v_first_sentence;
  elsif v_subject <> '' then
    v_summary := v_subject;
  elsif v_first_sentence <> '' then
    v_summary := v_first_sentence;
  else
    v_summary := 'Support inquiry';
  end if;

  return left(v_summary, 500);
end;
$$;

revoke all on function public._sai_understanding_lock_key(uuid, uuid) from public, anon, authenticated, service_role;
revoke all on function public._sai_inbound_message_set_context(uuid, uuid) from public, anon, authenticated, service_role;
revoke all on function public._sai_canonical_intent_from_category(text) from public, anon, authenticated, service_role;
revoke all on function public._sai_canonical_understanding_confidence(text) from public, anon, authenticated, service_role;
revoke all on function public._sai_canonical_understanding_summary(text, text) from public, anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 3. understand_organization_support_case
-- ---------------------------------------------------------------------------
create or replace function public.understand_organization_support_case(p_case_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_case public.organization_support_cases;
  v_context jsonb;
  v_hash text;
  v_count integer;
  v_subject text;
  v_analysis_text text;
  v_existing public.organization_support_case_understandings;
  v_category text;
  v_intent text;
  v_language text := 'unknown';
  v_confidence numeric(4, 3);
  v_status text;
  v_summary text;
  v_now timestamptz := now();
  v_confidence_threshold numeric(4, 3) := 0.500;
begin
  perform public._irp_require_permission('support.view');
  v_org_id := public._mta_require_organization();

  perform pg_advisory_xact_lock(public._sai_understanding_lock_key(v_org_id, p_case_id));

  select * into v_case
  from public.organization_support_cases c
  where c.id = p_case_id
    and c.organization_id = v_org_id;

  if v_case.id is null then
    raise exception 'Case not found';
  end if;

  v_context := public._sai_inbound_message_set_context(v_org_id, p_case_id);
  v_hash := v_context ->> 'message_set_hash';
  v_count := coalesce((v_context ->> 'message_count')::integer, 0);
  v_subject := coalesce(v_context ->> 'subject', '');
  v_analysis_text := coalesce(v_context ->> 'analysis_text', '');

  if v_count < 1 then
    raise exception 'support_understanding_no_inbound';
  end if;

  select * into v_existing
  from public.organization_support_case_understandings u
  where u.organization_id = v_org_id
    and u.case_id = p_case_id
    and u.message_set_hash = v_hash;

  if found then
    return jsonb_build_object(
      'case_id', p_case_id,
      'created', false,
      'summary', v_existing.summary,
      'intent', v_existing.intent,
      'category', v_existing.category,
      'language', v_existing.language,
      'confidence', v_existing.confidence,
      'status', v_existing.status,
      'message_count', v_existing.message_count,
      'engine_key', v_existing.engine_key,
      'engine_version', v_existing.engine_version,
      'analyzed_at', v_existing.analyzed_at
    );
  end if;

  v_category := public.classify_support_email_intent(v_subject, v_analysis_text);
  v_intent := public._sai_canonical_intent_from_category(v_category);
  v_confidence := public._sai_canonical_understanding_confidence(v_category);
  v_status := case
    when v_confidence < v_confidence_threshold then 'low_confidence'
    else 'complete'
  end;
  v_summary := public._sai_canonical_understanding_summary(v_subject, v_analysis_text);

  insert into public.organization_support_case_understandings (
    organization_id,
    case_id,
    summary,
    intent,
    category,
    language,
    confidence,
    status,
    message_set_hash,
    message_count,
    engine_key,
    engine_version,
    analyzed_at,
    updated_at
  ) values (
    v_org_id,
    p_case_id,
    v_summary,
    v_intent,
    v_category,
    v_language,
    v_confidence,
    v_status,
    v_hash,
    v_count,
    'canonical_support_rules',
    'rules-v1',
    v_now,
    v_now
  )
  on conflict (organization_id, case_id) do update set
    summary = excluded.summary,
    intent = excluded.intent,
    category = excluded.category,
    language = excluded.language,
    confidence = excluded.confidence,
    status = excluded.status,
    message_set_hash = excluded.message_set_hash,
    message_count = excluded.message_count,
    engine_key = excluded.engine_key,
    engine_version = excluded.engine_version,
    analyzed_at = excluded.analyzed_at,
    updated_at = excluded.updated_at;

  perform public._sai_log(
    v_org_id,
    'support_case_understood',
    'support_case',
    p_case_id,
    jsonb_build_object(
      'category', v_category,
      'language', v_language,
      'confidence', v_confidence,
      'message_count', v_count,
      'engine_key', 'canonical_support_rules',
      'engine_version', 'rules-v1',
      'status', v_status
    ),
    true
  );

  return jsonb_build_object(
    'case_id', p_case_id,
    'created', true,
    'summary', v_summary,
    'intent', v_intent,
    'category', v_category,
    'language', v_language,
    'confidence', v_confidence,
    'status', v_status,
    'message_count', v_count,
    'engine_key', 'canonical_support_rules',
    'engine_version', 'rules-v1',
    'analyzed_at', v_now
  );
end;
$$;

revoke all on function public.understand_organization_support_case(uuid) from public, anon;
grant execute on function public.understand_organization_support_case(uuid) to authenticated;
