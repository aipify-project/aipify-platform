-- Companion queue durable background worker: leases, retries, service-role worker RPCs
-- Feature owner: CUSTOMER APP (Companion chat queue)

alter table public.companion_message_queue
  add column if not exists attempt_count integer not null default 0 check (attempt_count >= 0),
  add column if not exists max_attempts integer not null default 3 check (max_attempts > 0),
  add column if not exists lease_owner text check (lease_owner is null or char_length(lease_owner) <= 120),
  add column if not exists lease_expires_at timestamptz,
  add column if not exists last_heartbeat_at timestamptz,
  add column if not exists companion_active_at_enqueue boolean not null default false,
  add column if not exists notified_at timestamptz;

create index if not exists companion_message_queue_lease_expires_idx
  on public.companion_message_queue (lease_expires_at asc)
  where status = 'processing';

create index if not exists companion_message_queue_waiting_created_idx
  on public.companion_message_queue (created_at asc)
  where status = 'waiting';

create table if not exists public.companion_queue_worker_audit (
  id uuid primary key default gen_random_uuid(),
  queue_id uuid references public.companion_message_queue (id) on delete set null,
  tenant_id uuid references public.customers (id) on delete set null,
  worker_id text not null check (char_length(worker_id) <= 120),
  event text not null check (char_length(event) <= 64),
  error_code text check (error_code is null or char_length(error_code) <= 64),
  duration_ms integer check (duration_ms is null or duration_ms >= 0),
  attempt_count integer,
  created_at timestamptz not null default now()
);

create index if not exists companion_queue_worker_audit_created_idx
  on public.companion_queue_worker_audit (created_at desc);

alter table public.companion_queue_worker_audit enable row level security;
revoke all on public.companion_queue_worker_audit from authenticated, anon;

create or replace function public._companion_assert_service_role()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(auth.jwt() ->> 'role', auth.role()) <> 'service_role' then
    raise exception 'service_role required';
  end if;
end;
$$;

create or replace function public._companion_worker_append_message(
  p_conversation_id text,
  p_tenant_id uuid,
  p_user_id uuid,
  p_role text,
  p_content text,
  p_payload jsonb default '{}'::jsonb,
  p_client_message_id text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_seq integer;
  v_id uuid;
begin
  if p_client_message_id is not null then
    select m.id into v_id
    from public.companion_chat_messages m
    where m.conversation_id = p_conversation_id
      and m.client_message_id = p_client_message_id
    limit 1;
    if v_id is not null then
      return v_id;
    end if;
  end if;

  select coalesce(max(m.sequence_no), 0) + 1 into v_seq
  from public.companion_chat_messages m
  where m.conversation_id = p_conversation_id;

  insert into public.companion_chat_messages (
    conversation_id,
    tenant_id,
    user_id,
    client_message_id,
    role,
    content,
    payload,
    sequence_no
  ) values (
    left(p_conversation_id, 120),
    p_tenant_id,
    p_user_id,
    nullif(left(coalesce(p_client_message_id, ''), 120), ''),
    left(p_role, 16),
    left(coalesce(p_content, ''), 8000),
    coalesce(p_payload, '{}'::jsonb),
    v_seq
  )
  returning id into v_id;

  update public.companion_conversations c
  set updated_at = now(),
      unread_count = case when p_role = 'assistant' then c.unread_count + 1 else c.unread_count end
  where c.id = p_conversation_id
    and c.tenant_id = p_tenant_id
    and c.user_id = p_user_id;

  return v_id;
end;
$$;

create or replace function public.companion_queue_worker_audit_event(
  p_queue_id uuid,
  p_tenant_id uuid,
  p_worker_id text,
  p_event text,
  p_error_code text default null,
  p_duration_ms integer default null,
  p_attempt_count integer default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public._companion_assert_service_role();

  insert into public.companion_queue_worker_audit (
    queue_id,
    tenant_id,
    worker_id,
    event,
    error_code,
    duration_ms,
    attempt_count
  ) values (
    p_queue_id,
    p_tenant_id,
    left(p_worker_id, 120),
    left(p_event, 64),
    nullif(left(coalesce(p_error_code, ''), 64), ''),
    p_duration_ms,
    p_attempt_count
  );
end;
$$;

create or replace function public.companion_queue_worker_recover_stale(
  p_lease_seconds integer default 300
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_requeued integer := 0;
  v_failed integer := 0;
begin
  perform public._companion_assert_service_role();

  with expired as (
    select q.id
    from public.companion_message_queue q
    where q.status = 'processing'
      and q.lease_expires_at is not null
      and q.lease_expires_at < now()
    for update skip locked
  ),
  requeue as (
    update public.companion_message_queue q
    set status = 'waiting',
        lease_owner = null,
        lease_expires_at = null,
        last_heartbeat_at = null,
        attempt_count = q.attempt_count + 1,
        error_code = 'lease_expired',
        error_message = 'Worker lease expired — job requeued',
        updated_at = now()
    from expired e
    where q.id = e.id
      and q.attempt_count + 1 < q.max_attempts
    returning q.id
  ),
  fail_permanent as (
    update public.companion_message_queue q
    set status = 'failed',
        lease_owner = null,
        lease_expires_at = null,
        last_heartbeat_at = null,
        attempt_count = q.attempt_count + 1,
        error_code = 'lease_expired_max_attempts',
        error_message = 'Worker lease expired — maximum attempts reached',
        completed_at = now(),
        updated_at = now()
    from expired e
    where q.id = e.id
      and q.attempt_count + 1 >= q.max_attempts
      and q.id not in (select id from requeue)
    returning q.id
  )
  select
    (select count(*)::integer from requeue),
    (select count(*)::integer from fail_permanent)
  into v_requeued, v_failed;

  return jsonb_build_object('ok', true, 'requeued', v_requeued, 'failed', v_failed);
end;
$$;

create or replace function public.companion_queue_worker_claim_batch(
  p_worker_id text,
  p_batch_size integer default 5,
  p_lease_seconds integer default 300
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_limit integer;
  v_claimed jsonb;
begin
  perform public._companion_assert_service_role();
  perform public.companion_queue_worker_recover_stale(p_lease_seconds);

  v_limit := greatest(1, least(coalesce(p_batch_size, 5), 20));

  with candidates as (
    select q.id
    from public.companion_message_queue q
    where q.status = 'waiting'
      and not exists (
        select 1
        from public.companion_message_queue active
        where active.conversation_id = q.conversation_id
          and active.status = 'processing'
          and active.lease_expires_at is not null
          and active.lease_expires_at > now()
      )
    order by q.created_at asc, q.queue_position asc
    limit v_limit
    for update skip locked
  ),
  claimed as (
    update public.companion_message_queue q
    set status = 'processing',
        lease_owner = left(p_worker_id, 120),
        lease_expires_at = now() + make_interval(secs => p_lease_seconds),
        last_heartbeat_at = now(),
        started_at = coalesce(q.started_at, now()),
        updated_at = now()
    from candidates c
    where q.id = c.id
    returning q.*
  )
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', c.id,
        'conversation_id', c.conversation_id,
        'tenant_id', c.tenant_id,
        'user_id', c.user_id,
        'question_text', c.question_text,
        'attachment_ids', c.attachment_ids,
        'active_artifact_id', c.active_artifact_id,
        'attachment_summaries', c.attachment_summaries,
        'locale', c.locale,
        'pathname', c.pathname,
        'platform_active_modules', c.platform_active_modules,
        'queue_position', c.queue_position,
        'attempt_count', c.attempt_count,
        'max_attempts', c.max_attempts,
        'companion_active_at_enqueue', c.companion_active_at_enqueue
      ) order by c.created_at asc
    ),
    '[]'::jsonb
  )
  into v_claimed
  from claimed c;

  return jsonb_build_object('ok', true, 'jobs', v_claimed);
end;
$$;

create or replace function public.companion_queue_worker_heartbeat(
  p_queue_id uuid,
  p_worker_id text,
  p_lease_seconds integer default 300
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public._companion_assert_service_role();

  update public.companion_message_queue q
  set lease_expires_at = now() + make_interval(secs => p_lease_seconds),
      last_heartbeat_at = now(),
      updated_at = now()
  where q.id = p_queue_id
    and q.status = 'processing'
    and q.lease_owner = left(p_worker_id, 120);

  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_processing');
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.companion_queue_worker_complete(
  p_queue_id uuid,
  p_worker_id text,
  p_assistant_content text,
  p_assistant_payload jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.companion_message_queue%rowtype;
  v_msg_id uuid;
begin
  perform public._companion_assert_service_role();

  select q.* into v_row
  from public.companion_message_queue q
  where q.id = p_queue_id
    and q.status = 'processing'
    and q.lease_owner = left(p_worker_id, 120)
  for update;

  if v_row.id is null then
    return jsonb_build_object('ok', false, 'error', 'not_processing');
  end if;

  if v_row.result_message_id is not null then
    return jsonb_build_object('ok', true, 'deduplicated', true, 'message_id', v_row.result_message_id);
  end if;

  v_msg_id := public._companion_worker_append_message(
    v_row.conversation_id,
    v_row.tenant_id,
    v_row.user_id,
    'assistant',
    p_assistant_content,
    p_assistant_payload,
    'assistant-' || p_queue_id::text
  );

  update public.companion_message_queue q
  set status = 'completed',
      result_message_id = v_msg_id,
      lease_owner = null,
      lease_expires_at = null,
      completed_at = now(),
      updated_at = now(),
      error_message = null,
      error_code = null
  where q.id = p_queue_id;

  return jsonb_build_object(
    'ok', true,
    'message_id', v_msg_id,
    'conversation_id', v_row.conversation_id,
    'tenant_id', v_row.tenant_id,
    'user_id', v_row.user_id,
    'should_notify', v_row.companion_active_at_enqueue = false,
    'locale', v_row.locale
  );
end;
$$;

create or replace function public.companion_queue_worker_fail(
  p_queue_id uuid,
  p_worker_id text,
  p_error_code text default null,
  p_error_message text default null,
  p_retryable boolean default true
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.companion_message_queue%rowtype;
  v_next_attempt integer;
begin
  perform public._companion_assert_service_role();

  select q.* into v_row
  from public.companion_message_queue q
  where q.id = p_queue_id
    and q.status = 'processing'
    and q.lease_owner = left(p_worker_id, 120)
  for update;

  if v_row.id is null then
    return jsonb_build_object('ok', false, 'error', 'not_processing');
  end if;

  v_next_attempt := v_row.attempt_count + 1;

  if p_retryable and v_next_attempt < v_row.max_attempts then
    update public.companion_message_queue q
    set status = 'waiting',
        attempt_count = v_next_attempt,
        lease_owner = null,
        lease_expires_at = null,
        last_heartbeat_at = null,
        error_code = nullif(left(coalesce(p_error_code, ''), 64), ''),
        error_message = nullif(left(coalesce(p_error_message, ''), 500), ''),
        updated_at = now()
    where q.id = p_queue_id;

    return jsonb_build_object('ok', true, 'retried', true, 'attempt_count', v_next_attempt);
  end if;

  update public.companion_message_queue q
  set status = 'failed',
      attempt_count = v_next_attempt,
      lease_owner = null,
      lease_expires_at = null,
      error_code = nullif(left(coalesce(p_error_code, ''), 64), ''),
      error_message = nullif(left(coalesce(p_error_message, ''), 500), ''),
      completed_at = now(),
      updated_at = now()
  where q.id = p_queue_id;

  return jsonb_build_object('ok', true, 'retried', false, 'attempt_count', v_next_attempt);
end;
$$;

create or replace function public.companion_queue_worker_notify_reply_ready(
  p_queue_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.companion_message_queue%rowtype;
  v_notification_id uuid;
begin
  perform public._companion_assert_service_role();

  select q.* into v_row
  from public.companion_message_queue q
  where q.id = p_queue_id
    and q.status = 'completed'
    and q.notified_at is null
    and q.companion_active_at_enqueue = false
  for update;

  if v_row.id is null then
    return jsonb_build_object('ok', false, 'error', 'skip');
  end if;

  v_notification_id := public.record_presence_notification(
    v_row.tenant_id,
    'companion_reply_ready',
    'informational',
    'Aipify has a reply ready',
    left(v_row.question_text, 120),
    '["in_app"]'::jsonb,
    '[]'::jsonb,
    '/app/companion?conversation=' || v_row.conversation_id,
    jsonb_build_object(
      'conversation_id', v_row.conversation_id,
      'queue_id', v_row.id,
      'source', 'companion_queue_worker'
    )
  );

  update public.companion_message_queue q
  set notified_at = now(),
      updated_at = q.updated_at
  where q.id = p_queue_id;

  return jsonb_build_object('ok', true, 'notification_id', v_notification_id);
end;
$$;

-- Extend enqueue to record companion panel state at enqueue time
create or replace function public.enqueue_companion_chat_message(
  p_conversation_id text,
  p_idempotency_key text,
  p_question_text text,
  p_attachment_ids jsonb default '[]'::jsonb,
  p_active_artifact_id text default null,
  p_attachment_summaries jsonb default '[]'::jsonb,
  p_locale text default null,
  p_pathname text default null,
  p_platform_active_modules text default null,
  p_user_client_message_id text default null,
  p_title text default null,
  p_companion_active boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx record;
  v_existing uuid;
  v_position integer;
  v_id uuid;
  v_user_msg jsonb;
begin
  select * into v_ctx from public._companion_chat_context() limit 1;
  if v_ctx.tenant_id is null or v_ctx.user_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_tenant');
  end if;

  perform public.upsert_companion_conversation(
    p_conversation_id,
    p_title,
    p_locale,
    p_pathname
  );

  select q.id into v_existing
  from public.companion_message_queue q
  where q.conversation_id = p_conversation_id
    and q.idempotency_key = left(p_idempotency_key, 160)
  limit 1;

  if v_existing is not null then
    return jsonb_build_object('ok', true, 'queue_id', v_existing, 'deduplicated', true);
  end if;

  v_user_msg := public.append_companion_chat_message(
    p_conversation_id,
    'user',
    p_question_text,
    jsonb_build_object(
      'attachments', coalesce(p_attachment_summaries, '[]'::jsonb),
      'activeArtifactId', p_active_artifact_id
    ),
    p_user_client_message_id
  );

  select coalesce(max(q.queue_position), 0) + 1 into v_position
  from public.companion_message_queue q
  where q.conversation_id = p_conversation_id
    and q.status in ('waiting', 'processing');

  insert into public.companion_message_queue (
    conversation_id,
    tenant_id,
    user_id,
    idempotency_key,
    question_text,
    attachment_ids,
    active_artifact_id,
    attachment_summaries,
    locale,
    pathname,
    platform_active_modules,
    queue_position,
    user_client_message_id,
    companion_active_at_enqueue
  ) values (
    left(p_conversation_id, 120),
    v_ctx.tenant_id,
    v_ctx.user_id,
    left(p_idempotency_key, 160),
    left(coalesce(p_question_text, ''), 4000),
    coalesce(p_attachment_ids, '[]'::jsonb),
    nullif(left(coalesce(p_active_artifact_id, ''), 120), ''),
    coalesce(p_attachment_summaries, '[]'::jsonb),
    nullif(left(coalesce(p_locale, ''), 12), ''),
    nullif(left(coalesce(p_pathname, ''), 240), ''),
    nullif(left(coalesce(p_platform_active_modules, ''), 500), ''),
    v_position,
    nullif(left(coalesce(p_user_client_message_id, ''), 120), ''),
    coalesce(p_companion_active, false)
  )
  returning id into v_id;

  return jsonb_build_object(
    'ok', true,
    'queue_id', v_id,
    'queue_position', v_position,
    'user_message_id', v_user_msg -> 'message_id'
  );
end;
$$;

grant execute on function public.companion_queue_worker_recover_stale(integer) to service_role;
grant execute on function public.companion_queue_worker_claim_batch(text, integer, integer) to service_role;
grant execute on function public.companion_queue_worker_heartbeat(uuid, text, integer) to service_role;
grant execute on function public.companion_queue_worker_complete(uuid, text, text, jsonb) to service_role;
grant execute on function public.companion_queue_worker_fail(uuid, text, text, text, boolean) to service_role;
grant execute on function public.companion_queue_worker_notify_reply_ready(uuid) to service_role;
grant execute on function public.companion_queue_worker_audit_event(uuid, uuid, text, text, text, integer, integer) to service_role;
