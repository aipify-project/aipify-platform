-- Companion queue self-healing: dismiss, cancel processing, timed_out, conversation delete safety
-- Feature owner: CUSTOMER APP

alter table public.companion_message_queue
  add column if not exists dismissed_at timestamptz,
  add column if not exists cancel_requested_at timestamptz;

alter table public.companion_message_queue
  drop constraint if exists companion_message_queue_status_check;

alter table public.companion_message_queue
  add constraint companion_message_queue_status_check
  check (status in ('waiting', 'processing', 'completed', 'failed', 'cancelled', 'timed_out'));

create or replace function public.companion_queue_is_cancel_requested(p_queue_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.companion_message_queue q
    where q.id = p_queue_id
      and (
        q.cancel_requested_at is not null
        or q.status = 'cancelled'
      )
  );
$$;

create or replace function public.cancel_companion_queue_item(p_queue_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx record;
  v_status text;
begin
  select * into v_ctx from public._companion_chat_context() limit 1;
  if v_ctx.tenant_id is null or v_ctx.user_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_tenant');
  end if;

  select q.status into v_status
  from public.companion_message_queue q
  where q.id = p_queue_id
    and q.tenant_id = v_ctx.tenant_id
    and q.user_id = v_ctx.user_id
    and q.dismissed_at is null;

  if v_status is null then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;

  if v_status = 'waiting' then
    update public.companion_message_queue q
    set status = 'cancelled',
        cancel_requested_at = coalesce(q.cancel_requested_at, now()),
        completed_at = now(),
        dismissed_at = now(),
        updated_at = now()
    where q.id = p_queue_id;
    return jsonb_build_object('ok', true, 'mode', 'cancelled');
  end if;

  if v_status = 'processing' then
    update public.companion_message_queue q
    set cancel_requested_at = now(),
        updated_at = now()
    where q.id = p_queue_id;
    return jsonb_build_object('ok', true, 'mode', 'cancel_requested');
  end if;

  return jsonb_build_object('ok', false, 'error', 'not_cancellable');
end;
$$;

create or replace function public.companion_queue_worker_cancel_ack(
  p_queue_id uuid,
  p_worker_id text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.companion_message_queue%rowtype;
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

  update public.companion_message_queue q
  set status = 'cancelled',
      lease_owner = null,
      lease_expires_at = null,
      last_heartbeat_at = null,
      completed_at = now(),
      dismissed_at = now(),
      error_code = 'cancelled',
      error_message = 'cancelled',
      updated_at = now()
  where q.id = p_queue_id;

  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.dismiss_companion_queue_item(p_queue_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx record;
begin
  select * into v_ctx from public._companion_chat_context() limit 1;
  if v_ctx.tenant_id is null or v_ctx.user_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_tenant');
  end if;

  update public.companion_message_queue q
  set dismissed_at = now(),
      updated_at = now()
  where q.id = p_queue_id
    and q.tenant_id = v_ctx.tenant_id
    and q.user_id = v_ctx.user_id
    and q.status in ('failed', 'timed_out', 'cancelled', 'completed')
    and q.dismissed_at is null;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_dismissable');
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.dismiss_companion_queue_finished(p_conversation_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx record;
  v_count integer;
begin
  select * into v_ctx from public._companion_chat_context() limit 1;
  if v_ctx.tenant_id is null or v_ctx.user_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_tenant');
  end if;

  update public.companion_message_queue q
  set dismissed_at = now(),
      updated_at = now()
  where q.conversation_id = left(p_conversation_id, 120)
    and q.tenant_id = v_ctx.tenant_id
    and q.user_id = v_ctx.user_id
    and q.status in ('failed', 'timed_out', 'cancelled', 'completed')
    and q.dismissed_at is null;

  get diagnostics v_count = row_count;
  return jsonb_build_object('ok', true, 'dismissed_count', v_count);
end;
$$;

create or replace function public.retry_companion_queue_item(p_queue_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx record;
  v_position integer;
begin
  select * into v_ctx from public._companion_chat_context() limit 1;
  if v_ctx.tenant_id is null or v_ctx.user_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_tenant');
  end if;

  select coalesce(max(q.queue_position), 0) + 1 into v_position
  from public.companion_message_queue q
  join public.companion_message_queue target on target.conversation_id = q.conversation_id
  where target.id = p_queue_id
    and q.status in ('waiting', 'processing');

  update public.companion_message_queue q
  set status = 'waiting',
      queue_position = v_position,
      error_message = null,
      error_code = null,
      started_at = null,
      completed_at = null,
      dismissed_at = null,
      cancel_requested_at = null,
      lease_owner = null,
      lease_expires_at = null,
      last_heartbeat_at = null,
      updated_at = now()
  where q.id = p_queue_id
    and q.tenant_id = v_ctx.tenant_id
    and q.user_id = v_ctx.user_id
    and q.status in ('failed', 'timed_out');

  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_retryable');
  end if;

  return jsonb_build_object('ok', true);
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
  v_final_status text;
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

  v_final_status := case
    when nullif(left(coalesce(p_error_code, ''), 64), '') in ('turn_timeout', 'timed_out')
      then 'timed_out'
    else 'failed'
  end;

  update public.companion_message_queue q
  set status = v_final_status,
      attempt_count = v_next_attempt,
      lease_owner = null,
      lease_expires_at = null,
      error_code = nullif(left(coalesce(p_error_code, ''), 64), ''),
      error_message = nullif(left(coalesce(p_error_message, ''), 500), ''),
      completed_at = now(),
      updated_at = now()
  where q.id = p_queue_id;

  return jsonb_build_object('ok', true, 'retried', false, 'attempt_count', v_next_attempt, 'status', v_final_status);
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

  if v_row.cancel_requested_at is not null then
    update public.companion_message_queue q
    set status = 'cancelled',
        lease_owner = null,
        lease_expires_at = null,
        completed_at = now(),
        dismissed_at = now(),
        error_code = 'cancelled',
        error_message = 'cancelled',
        updated_at = now()
    where q.id = p_queue_id;
    return jsonb_build_object('ok', false, 'error', 'cancelled');
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
      dismissed_at = now(),
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

create or replace function public.get_companion_chat_state(p_conversation_id text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx record;
begin
  select * into v_ctx from public._companion_chat_context() limit 1;
  if v_ctx.tenant_id is null or v_ctx.user_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_tenant');
  end if;

  if not exists (
    select 1
    from public.companion_conversations c
    where c.id = left(p_conversation_id, 120)
      and c.tenant_id = v_ctx.tenant_id
      and c.user_id = v_ctx.user_id
      and c.deleted_at is null
  ) then
    return jsonb_build_object('ok', false, 'error', 'not_found', 'messages', '[]'::jsonb, 'queue', '[]'::jsonb);
  end if;

  return jsonb_build_object(
    'ok', true,
    'conversation', (
      select jsonb_build_object(
        'id', c.id,
        'title', c.title,
        'locale', c.locale,
        'pathname', c.pathname,
        'unread_count', c.unread_count,
        'updated_at', c.updated_at,
        'archived_at', c.archived_at
      )
      from public.companion_conversations c
      where c.id = p_conversation_id
        and c.tenant_id = v_ctx.tenant_id
        and c.user_id = v_ctx.user_id
        and c.deleted_at is null
      limit 1
    ),
    'messages', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', coalesce(m.client_message_id, m.id::text),
            'server_id', m.id,
            'role', m.role,
            'content', m.content,
            'payload', m.payload,
            'sequence_no', m.sequence_no,
            'timestamp', extract(epoch from m.created_at) * 1000,
            'feedback_type', (
              select f.feedback_type
              from public.companion_answer_feedback f
              where f.tenant_id = v_ctx.tenant_id
                and f.user_id = v_ctx.user_id
                and f.message_id = coalesce(m.client_message_id, m.id::text)
              order by f.created_at desc
              limit 1
            )
          ) order by m.sequence_no asc
        )
        from public.companion_chat_messages m
        where m.conversation_id = p_conversation_id
          and m.tenant_id = v_ctx.tenant_id
          and m.user_id = v_ctx.user_id
      ),
      '[]'::jsonb
    ),
    'queue', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', q.id,
            'status', q.status,
            'question_text', q.question_text,
            'queue_position', q.queue_position,
            'error_message', q.error_message,
            'error_code', q.error_code,
            'created_at', q.created_at,
            'started_at', q.started_at,
            'completed_at', q.completed_at,
            'cancel_requested', q.cancel_requested_at is not null
          ) order by q.queue_position asc, q.created_at asc
        )
        from public.companion_message_queue q
        where q.conversation_id = p_conversation_id
          and q.tenant_id = v_ctx.tenant_id
          and q.user_id = v_ctx.user_id
          and q.dismissed_at is null
          and q.status in ('waiting', 'processing', 'failed', 'timed_out')
      ),
      '[]'::jsonb
    )
  );
end;
$$;

create or replace function public.delete_companion_conversation(p_conversation_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx record;
begin
  select * into v_ctx from public._companion_chat_context() limit 1;
  if v_ctx.tenant_id is null or v_ctx.user_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_tenant');
  end if;

  update public.companion_message_queue q
  set status = case
        when q.status = 'processing' then q.status
        else 'cancelled'
      end,
      cancel_requested_at = case
        when q.status = 'processing' then coalesce(q.cancel_requested_at, now())
        else q.cancel_requested_at
      end,
      dismissed_at = case
        when q.status in ('waiting', 'failed', 'timed_out', 'cancelled', 'completed') then now()
        else q.dismissed_at
      end,
      completed_at = case
        when q.status in ('waiting', 'failed', 'timed_out') then now()
        else q.completed_at
      end,
      updated_at = now()
  where q.conversation_id = left(p_conversation_id, 120)
    and q.tenant_id = v_ctx.tenant_id
    and q.user_id = v_ctx.user_id
    and q.dismissed_at is null
    and q.status in ('waiting', 'processing', 'failed', 'timed_out');

  update public.companion_conversations c
  set deleted_at = now(),
      archived_at = coalesce(c.archived_at, now()),
      updated_at = now()
  where c.id = left(p_conversation_id, 120)
    and c.tenant_id = v_ctx.tenant_id
    and c.user_id = v_ctx.user_id
    and c.deleted_at is null;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;

  insert into public.companion_conversation_audit_logs (
    conversation_id, tenant_id, user_id, action
  ) values (
    left(p_conversation_id, 120), v_ctx.tenant_id, v_ctx.user_id, 'delete'
  );

  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function public.companion_queue_is_cancel_requested(uuid) to service_role;
grant execute on function public.companion_queue_worker_cancel_ack(uuid, text) to service_role;
grant execute on function public.dismiss_companion_queue_item(uuid) to authenticated;
grant execute on function public.dismiss_companion_queue_finished(text) to authenticated;
