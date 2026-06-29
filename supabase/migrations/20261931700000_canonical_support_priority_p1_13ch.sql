-- P1.13CH — Canonical support priority (provenance on case row, rules-v1, manual override)

-- ---------------------------------------------------------------------------
-- 1. Priority provenance columns on organization_support_cases
-- ---------------------------------------------------------------------------
alter table public.organization_support_cases
  add column if not exists priority_source text,
  add column if not exists priority_reason_code text,
  add column if not exists priority_confidence numeric(4, 3),
  add column if not exists priority_assessed_at timestamptz,
  add column if not exists priority_engine_key text,
  add column if not exists priority_engine_version text,
  add column if not exists priority_understanding_message_set_hash text,
  add column if not exists priority_manual_set_at timestamptz;

update public.organization_support_cases
set priority_source = 'legacy'
where priority_source is null;

alter table public.organization_support_cases
  alter column priority_source set default 'legacy',
  alter column priority_source set not null;

alter table public.organization_support_cases
  drop constraint if exists organization_support_cases_priority_source_check;

alter table public.organization_support_cases
  add constraint organization_support_cases_priority_source_check check (
    priority_source in ('legacy', 'default', 'automatic', 'manual', 'escalation')
  );

alter table public.organization_support_cases
  drop constraint if exists organization_support_cases_priority_confidence_range;

alter table public.organization_support_cases
  add constraint organization_support_cases_priority_confidence_range check (
    priority_confidence is null
    or (priority_confidence >= 0 and priority_confidence <= 1)
  );

alter table public.organization_support_cases
  drop constraint if exists organization_support_cases_priority_automatic_metadata_check;

alter table public.organization_support_cases
  add constraint organization_support_cases_priority_automatic_metadata_check check (
    priority_source <> 'automatic'
    or (
      priority_reason_code is not null
      and priority_confidence is not null
      and priority_assessed_at is not null
      and priority_engine_key is not null
      and priority_engine_version is not null
      and priority_understanding_message_set_hash is not null
    )
  );

alter table public.organization_support_cases
  drop constraint if exists organization_support_cases_priority_manual_metadata_check;

alter table public.organization_support_cases
  add constraint organization_support_cases_priority_manual_metadata_check check (
    priority_source <> 'manual'
    or priority_manual_set_at is not null
  );

-- ---------------------------------------------------------------------------
-- 2. Internal priority helpers (RPC-only)
-- ---------------------------------------------------------------------------
create or replace function public._sai_priority_assess_lock_key(
  p_organization_id uuid,
  p_case_id uuid
)
returns bigint
language sql
immutable
set search_path = public
as $$
  select hashtextextended(
    'support_priority_assess:' || coalesce(p_organization_id::text, '') || ':' || coalesce(p_case_id::text, ''),
    0
  );
$$;

create or replace function public._sai_priority_rank(p_priority text)
returns integer
language sql
immutable
set search_path = public
as $$
  select case coalesce(p_priority, '')
    when 'urgent' then 4
    when 'high' then 3
    when 'medium' then 2
    when 'low' then 1
    else 0
  end;
$$;

create or replace function public._sai_priority_severe_risk_signal(
  p_subject text,
  p_content text default ''
)
returns boolean
language plpgsql
immutable
set search_path = public
as $$
declare
  v_text text := lower(coalesce(p_subject, '') || ' ' || coalesce(p_content, ''));
begin
  if v_text ~ '(security breach|data leak)' then return true; end if;
  if v_text ~ '(threat|regulator|fraud)' then return true; end if;
  if v_text ~ '(gdpr|lawsuit)' then return true; end if;
  if v_text ~ 'account suspension' then return true; end if;
  return false;
end;
$$;

create or replace function public._sai_priority_broad_risk_signal(
  p_subject text,
  p_content text default ''
)
returns boolean
language plpgsql
immutable
set search_path = public
as $$
declare
  v_text text := lower(coalesce(p_subject, '') || ' ' || coalesce(p_content, ''));
begin
  if public._sai_priority_severe_risk_signal(p_subject, p_content) then
    return false;
  end if;
  if v_text ~ '(chargeback|billing dispute|refund dispute)' then return true; end if;
  if v_text ~ '(billing|refund|chargeback)' then return true; end if;
  if v_text ~ 'privacy' and v_text !~ '(security breach|data leak|gdpr)' then return true; end if;
  if v_text ~ '(legal|lawyer)' and v_text !~ 'lawsuit' then return true; end if;
  return false;
end;
$$;

create or replace function public._sai_canonical_priority_rules(
  p_category text,
  p_understanding_status text,
  p_subject text,
  p_analysis_text text
)
returns table (
  priority text,
  reason_code text,
  confidence numeric
)
language plpgsql
immutable
set search_path = public
as $$
declare
  v_category text := coalesce(nullif(btrim(p_category), ''), 'general');
  v_status text := coalesce(nullif(btrim(p_understanding_status), ''), 'complete');
  v_category_priority text;
  v_category_reason text;
  v_category_confidence numeric(4, 3);
  v_final_priority text;
  v_final_reason text;
  v_final_confidence numeric(4, 3);
begin
  if public._sai_priority_severe_risk_signal(p_subject, p_analysis_text) then
    return query select 'urgent'::text, 'severe_risk_signal'::text, 0.950::numeric;
    return;
  end if;

  v_category_priority := case v_category
    when 'refund' then 'high'
    when 'payment' then 'high'
    when 'complaint' then 'high'
    when 'account' then 'high'
    when 'technical' then 'high'
    when 'subscription' then 'medium'
    when 'booking' then 'medium'
    when 'verification' then 'medium'
    when 'delivery' then 'medium'
    when 'general' then
      case
        when v_status = 'low_confidence' then 'medium'
        else 'low'
      end
    else 'medium'
  end;

  v_category_reason := case v_category
    when 'refund' then 'category_refund'
    when 'payment' then 'category_payment'
    when 'complaint' then 'category_complaint'
    when 'account' then 'category_account'
    when 'technical' then 'category_technical'
    when 'subscription' then 'category_subscription'
    when 'booking' then 'category_booking'
    when 'verification' then 'category_verification'
    when 'delivery' then 'category_delivery'
    when 'general' then
      case
        when v_status = 'low_confidence' then 'understanding_low_confidence_review'
        else 'category_general_clear'
      end
    else 'category_delivery'
  end;

  v_category_confidence := case v_category_priority
    when 'high' then 0.750
    when 'medium' then
      case
        when v_category_reason = 'understanding_low_confidence_review' then 0.600
        else 0.650
      end
    else 0.550
  end;

  v_final_priority := v_category_priority;
  v_final_reason := v_category_reason;
  v_final_confidence := v_category_confidence;

  if public._sai_priority_broad_risk_signal(p_subject, p_analysis_text)
    and public._sai_priority_rank('high') > public._sai_priority_rank(v_final_priority) then
    v_final_priority := 'high';
    v_final_reason := 'high_risk_signal';
    v_final_confidence := 0.850;
  end if;

  return query select v_final_priority, v_final_reason, v_final_confidence;
end;
$$;

revoke all on function public._sai_priority_assess_lock_key(uuid, uuid) from public, anon, authenticated, service_role;
revoke all on function public._sai_priority_rank(text) from public, anon, authenticated, service_role;
revoke all on function public._sai_priority_severe_risk_signal(text, text) from public, anon, authenticated, service_role;
revoke all on function public._sai_priority_broad_risk_signal(text, text) from public, anon, authenticated, service_role;
revoke all on function public._sai_canonical_priority_rules(text, text, text, text) from public, anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 3. Replace create_organization_support_case (drop 6-arg, create single 7-arg)
-- ---------------------------------------------------------------------------
do $$
declare
  v_count int;
begin
  select count(*) into v_count
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = 'create_organization_support_case'
    and p.prokind = 'f';

  if v_count > 1 then
    raise exception 'create_organization_support_case overload conflict detected: %', v_count;
  end if;
end $$;

drop function if exists public.create_organization_support_case(text, text, text, text, text, text);

create or replace function public.create_organization_support_case(
  p_subject text,
  p_customer_identifier text default null,
  p_channel text default 'admin_inbox',
  p_priority text default 'medium',
  p_initial_message text default null,
  p_idempotency_key text default null,
  p_priority_explicit boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_subject text;
  v_message text;
  v_customer text;
  v_channel text;
  v_priority text;
  v_key text;
  v_hash text;
  v_existing public.organization_support_cases;
  v_id uuid;
  v_num text;
  v_message_id uuid;
  v_now timestamptz := now();
begin
  perform public._irp_require_permission('support.view');
  v_org_id := public._mta_require_organization();

  v_subject := btrim(coalesce(p_subject, ''));
  if v_subject = '' or char_length(v_subject) > 500 then
    raise exception 'invalid_subject';
  end if;

  v_message := nullif(btrim(coalesce(p_initial_message, '')), '');
  if v_message is not null and char_length(v_message) > 8000 then
    raise exception 'invalid_message';
  end if;

  v_customer := nullif(btrim(coalesce(p_customer_identifier, '')), '');
  v_channel := coalesce(nullif(btrim(coalesce(p_channel, '')), ''), 'admin_inbox');
  v_priority := coalesce(nullif(btrim(coalesce(p_priority, '')), ''), 'medium');
  v_key := nullif(btrim(coalesce(p_idempotency_key, '')), '');

  if v_key is not null then
    if char_length(v_key) > 128 then
      raise exception 'invalid_idempotency_key';
    end if;
    if v_message is null then
      raise exception 'idempotency_requires_message';
    end if;
  end if;

  if v_channel not in (
    'support_widget', 'admin_inbox', 'email_support', 'live_chat', 'social_media', 'messaging'
  ) then
    raise exception 'invalid_channel';
  end if;

  if v_priority not in ('low', 'medium', 'high', 'urgent') then
    raise exception 'invalid_priority';
  end if;

  v_hash := case
    when v_key is not null then public._sai_intake_payload_hash(
      v_subject, v_message, v_customer, v_channel, v_priority
    )
    else null
  end;

  if v_key is not null then
    perform pg_advisory_xact_lock(public._sai_intake_lock_key(v_org_id, v_key));

    select * into v_existing
    from public.organization_support_cases c
    where c.organization_id = v_org_id
      and c.intake_idempotency_key = v_key;

    if found then
      if v_existing.intake_payload_hash is distinct from v_hash then
        raise exception 'support_intake_idempotency_conflict';
      end if;

      select m.id into v_message_id
      from public.organization_support_case_messages m
      where m.organization_id = v_org_id
        and m.case_id = v_existing.id
        and m.direction = 'inbound'
        and m.author_kind = 'customer'
      order by m.created_at asc
      limit 1;

      return jsonb_build_object(
        'id', v_existing.id,
        'case_number', v_existing.case_number,
        'status', v_existing.status,
        'created', false,
        'message_id', v_message_id
      );
    end if;
  end if;

  v_num := public._sai_next_case_number(v_org_id);

  begin
    insert into public.organization_support_cases (
      organization_id,
      case_number,
      subject,
      customer_identifier,
      channel,
      status,
      priority,
      priority_source,
      priority_reason_code,
      priority_manual_set_at,
      intake_idempotency_key,
      intake_payload_hash
    ) values (
      v_org_id,
      v_num,
      v_subject,
      v_customer,
      v_channel,
      'new',
      v_priority,
      case when coalesce(p_priority_explicit, false) then 'manual' else 'default' end,
      case when coalesce(p_priority_explicit, false) then 'intake_manual' else null end,
      case when coalesce(p_priority_explicit, false) then v_now else null end,
      v_key,
      v_hash
    ) returning id into v_id;
  exception
    when unique_violation then
      if v_key is null then
        raise;
      end if;

      select * into v_existing
      from public.organization_support_cases c
      where c.organization_id = v_org_id
        and c.intake_idempotency_key = v_key;

      if not found then
        raise;
      end if;

      if v_existing.intake_payload_hash is distinct from v_hash then
        raise exception 'support_intake_idempotency_conflict';
      end if;

      select m.id into v_message_id
      from public.organization_support_case_messages m
      where m.organization_id = v_org_id
        and m.case_id = v_existing.id
        and m.direction = 'inbound'
        and m.author_kind = 'customer'
      order by m.created_at asc
      limit 1;

      return jsonb_build_object(
        'id', v_existing.id,
        'case_number', v_existing.case_number,
        'status', v_existing.status,
        'created', false,
        'message_id', v_message_id
      );
  end;

  v_message_id := null;
  if v_message is not null then
    insert into public.organization_support_case_messages (
      organization_id,
      case_id,
      direction,
      author_kind,
      body
    ) values (
      v_org_id,
      v_id,
      'inbound',
      'customer',
      v_message
    ) returning id into v_message_id;
  end if;

  perform public._sai_log(
    v_org_id,
    'support_case_created',
    'support_case',
    v_id,
    jsonb_build_object('case_number', v_num, 'subject', v_subject)
  );

  return jsonb_build_object(
    'id', v_id,
    'case_number', v_num,
    'status', 'new',
    'created', true,
    'message_id', v_message_id
  );
end;
$$;

revoke all on function public.create_organization_support_case(text, text, text, text, text, text, boolean) from public, anon;
grant execute on function public.create_organization_support_case(text, text, text, text, text, text, boolean) to authenticated;

-- ---------------------------------------------------------------------------
-- 4. assess_organization_support_case_priority
-- ---------------------------------------------------------------------------
create or replace function public.assess_organization_support_case_priority(p_case_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_case public.organization_support_cases;
  v_understanding public.organization_support_case_understandings;
  v_context jsonb;
  v_current_hash text;
  v_subject text;
  v_analysis_text text;
  v_priority_result text;
  v_reason_result text;
  v_confidence_result numeric(4, 3);
  v_now timestamptz := now();
  v_engine_key text := 'canonical_support_priority_rules';
  v_engine_version text := 'rules-v1';
  v_old_priority text;
begin
  perform public._irp_require_permission('support.view');
  v_org_id := public._mta_require_organization();

  perform pg_advisory_xact_lock(public._sai_priority_assess_lock_key(v_org_id, p_case_id));

  select * into v_case
  from public.organization_support_cases c
  where c.id = p_case_id
    and c.organization_id = v_org_id;

  if v_case.id is null then
    raise exception 'Case not found';
  end if;

  if v_case.priority_source in ('manual', 'escalation', 'legacy') then
    return jsonb_build_object(
      'case_id', p_case_id,
      'priority', v_case.priority,
      'priority_source', v_case.priority_source,
      'reason_code', v_case.priority_reason_code,
      'confidence', v_case.priority_confidence,
      'created', false,
      'protected', true,
      'engine_key', v_case.priority_engine_key,
      'engine_version', v_case.priority_engine_version,
      'assessed_at', v_case.priority_assessed_at
    );
  end if;

  select * into v_understanding
  from public.organization_support_case_understandings u
  where u.organization_id = v_org_id
    and u.case_id = p_case_id;

  if v_understanding.id is null then
    raise exception 'support_priority_understanding_required';
  end if;

  v_context := public._sai_inbound_message_set_context(v_org_id, p_case_id);
  v_current_hash := v_context ->> 'message_set_hash';
  v_subject := coalesce(v_context ->> 'subject', '');
  v_analysis_text := coalesce(v_context ->> 'analysis_text', '');

  if v_understanding.message_set_hash is distinct from v_current_hash then
    raise exception 'support_priority_understanding_stale';
  end if;

  if v_case.priority_source = 'automatic'
    and v_case.priority_understanding_message_set_hash = v_current_hash
    and v_case.priority_engine_key = v_engine_key
    and v_case.priority_engine_version = v_engine_version then
    return jsonb_build_object(
      'case_id', p_case_id,
      'priority', v_case.priority,
      'priority_source', v_case.priority_source,
      'reason_code', v_case.priority_reason_code,
      'confidence', v_case.priority_confidence,
      'created', false,
      'protected', false,
      'engine_key', v_case.priority_engine_key,
      'engine_version', v_case.priority_engine_version,
      'assessed_at', v_case.priority_assessed_at
    );
  end if;

  select r.priority, r.reason_code, r.confidence
  into v_priority_result, v_reason_result, v_confidence_result
  from public._sai_canonical_priority_rules(
    v_understanding.category,
    v_understanding.status,
    v_subject,
    v_analysis_text
  ) r;

  v_old_priority := v_case.priority;

  update public.organization_support_cases
  set
    priority = v_priority_result,
    priority_source = 'automatic',
    priority_reason_code = v_reason_result,
    priority_confidence = v_confidence_result,
    priority_assessed_at = v_now,
    priority_engine_key = v_engine_key,
    priority_engine_version = v_engine_version,
    priority_understanding_message_set_hash = v_current_hash,
    priority_manual_set_at = null,
    updated_at = v_now
  where id = p_case_id
    and organization_id = v_org_id;

  perform public._sai_log(
    v_org_id,
    'support_case_priority_assessed',
    'support_case',
    p_case_id,
    jsonb_build_object(
      'old_priority', v_old_priority,
      'new_priority', v_priority_result,
      'priority_source', 'automatic',
      'reason_code', v_reason_result,
      'confidence', v_confidence_result,
      'understanding_status', v_understanding.status,
      'engine_key', v_engine_key,
      'engine_version', v_engine_version
    ),
    true
  );

  return jsonb_build_object(
    'case_id', p_case_id,
    'priority', v_priority_result,
    'priority_source', 'automatic',
    'reason_code', v_reason_result,
    'confidence', v_confidence_result,
    'created', true,
    'protected', false,
    'engine_key', v_engine_key,
    'engine_version', v_engine_version,
    'assessed_at', v_now
  );
end;
$$;

revoke all on function public.assess_organization_support_case_priority(uuid) from public, anon;
grant execute on function public.assess_organization_support_case_priority(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 5. Manual override RPCs
-- ---------------------------------------------------------------------------
create or replace function public.set_organization_support_case_priority_manual(
  p_case_id uuid,
  p_priority text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_case public.organization_support_cases;
  v_priority text;
  v_now timestamptz := now();
begin
  perform public._irp_require_permission('support.escalate');
  v_org_id := public._mta_require_organization();

  v_priority := coalesce(nullif(btrim(coalesce(p_priority, '')), ''), '');
  if v_priority not in ('low', 'medium', 'high', 'urgent') then
    raise exception 'invalid_priority';
  end if;

  select * into v_case
  from public.organization_support_cases c
  where c.id = p_case_id
    and c.organization_id = v_org_id;

  if v_case.id is null then
    raise exception 'Case not found';
  end if;

  update public.organization_support_cases
  set
    priority = v_priority,
    priority_source = 'manual',
    priority_reason_code = 'manual_override',
    priority_confidence = null,
    priority_assessed_at = null,
    priority_engine_key = null,
    priority_engine_version = null,
    priority_understanding_message_set_hash = null,
    priority_manual_set_at = v_now,
    updated_at = v_now
  where id = p_case_id
    and organization_id = v_org_id;

  perform public._sai_log(
    v_org_id,
    'support_case_priority_manual_set',
    'support_case',
    p_case_id,
    jsonb_build_object(
      'old_priority', v_case.priority,
      'new_priority', v_priority,
      'priority_source', 'manual',
      'reason_code', 'manual_override'
    ),
    false
  );

  return jsonb_build_object(
    'case_id', p_case_id,
    'priority', v_priority,
    'priority_source', 'manual',
    'reason_code', 'manual_override',
    'created', true,
    'protected', false,
    'manual_set_at', v_now
  );
end;
$$;

create or replace function public.clear_organization_support_case_priority_override(p_case_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_case public.organization_support_cases;
begin
  perform public._irp_require_permission('support.escalate');
  v_org_id := public._mta_require_organization();

  select * into v_case
  from public.organization_support_cases c
  where c.id = p_case_id
    and c.organization_id = v_org_id;

  if v_case.id is null then
    raise exception 'Case not found';
  end if;

  if v_case.priority_source <> 'manual' then
    raise exception 'support_priority_manual_clear_not_manual';
  end if;

  update public.organization_support_cases
  set
    priority_source = 'default',
    priority_reason_code = null,
    priority_confidence = null,
    priority_assessed_at = null,
    priority_engine_key = null,
    priority_engine_version = null,
    priority_understanding_message_set_hash = null,
    priority_manual_set_at = null,
    updated_at = now()
  where id = p_case_id
    and organization_id = v_org_id;

  perform public._sai_log(
    v_org_id,
    'support_case_priority_manual_cleared',
    'support_case',
    p_case_id,
    jsonb_build_object(
      'old_priority', v_case.priority,
      'new_priority', v_case.priority,
      'priority_source', 'default',
      'reason_code', null
    ),
    false
  );

  return jsonb_build_object(
    'case_id', p_case_id,
    'priority', v_case.priority,
    'priority_source', 'default',
    'created', true,
    'protected', false
  );
end;
$$;

revoke all on function public.set_organization_support_case_priority_manual(uuid, text) from public, anon;
grant execute on function public.set_organization_support_case_priority_manual(uuid, text) to authenticated;

revoke all on function public.clear_organization_support_case_priority_override(uuid) from public, anon;
grant execute on function public.clear_organization_support_case_priority_override(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 6. Update escalate_support_case provenance
-- ---------------------------------------------------------------------------
create or replace function public.escalate_support_case(
  p_case_id uuid,
  p_reason text default 'Low confidence or customer request'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
begin
  perform public._irp_require_permission('support.escalate');
  v_org_id := public._mta_require_organization();

  update public.organization_support_cases set
    status = 'waiting_for_internal',
    priority = 'high',
    priority_source = 'escalation',
    priority_reason_code = 'escalated',
    priority_confidence = null,
    priority_assessed_at = null,
    priority_engine_key = null,
    priority_engine_version = null,
    priority_understanding_message_set_hash = null,
    priority_manual_set_at = null,
    escalated_at = now(),
    escalation_reason = p_reason,
    updated_at = now()
  where id = p_case_id and organization_id = v_org_id;

  update public.support_ai_responses set status = 'escalated'
  where case_id = p_case_id and organization_id = v_org_id and status = 'pending';

  perform public._sai_log(v_org_id, 'support_escalated', 'support_case', p_case_id,
    jsonb_build_object('reason', p_reason), true);

  return jsonb_build_object('case_id', p_case_id, 'status', 'waiting_for_internal');
end;
$$;

revoke all on function public.escalate_support_case(uuid, text) from public, anon;
grant execute on function public.escalate_support_case(uuid, text) to authenticated;
