-- Never expose raw worker diagnostics in customer chat state; finalize max-attempt jobs as timed_out.
-- Feature owner: CUSTOMER APP

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
  v_error_code text;
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

  v_error_code := nullif(left(coalesce(p_error_code, ''), 64), '');
  v_next_attempt := v_row.attempt_count + 1;

  if p_retryable and v_next_attempt < v_row.max_attempts then
    update public.companion_message_queue q
    set status = 'waiting',
        attempt_count = v_next_attempt,
        lease_owner = null,
        lease_expires_at = null,
        last_heartbeat_at = null,
        processing_deadline_at = null,
        started_at = null,
        error_code = v_error_code,
        error_message = v_error_code,
        updated_at = now()
    where q.id = p_queue_id;

    return jsonb_build_object('ok', true, 'retried', true, 'attempt_count', v_next_attempt);
  end if;

  v_final_status := case
    when v_error_code in (
      'turn_timeout',
      'timed_out',
      'worker_heartbeat_stale_max_attempts',
      'lease_expired_max_attempts',
      'orphaned_processing_max_attempts'
    ) then 'timed_out'
    else 'failed'
  end;

  update public.companion_message_queue q
  set status = v_final_status,
      attempt_count = v_next_attempt,
      lease_owner = null,
      lease_expires_at = null,
      last_heartbeat_at = null,
      processing_deadline_at = null,
      error_code = v_error_code,
      error_message = v_error_code,
      completed_at = now(),
      updated_at = now()
  where q.id = p_queue_id;

  return jsonb_build_object('ok', true, 'retried', false, 'attempt_count', v_next_attempt, 'status', v_final_status);
end;
$$;

-- Backfill legacy English diagnostics and stuck max-attempt rows.
update public.companion_message_queue q
set
  status = case
    when q.status = 'processing' and q.attempt_count >= q.max_attempts then 'timed_out'
    when q.status = 'failed'
      and q.error_code in (
        'worker_heartbeat_stale_max_attempts',
        'lease_expired_max_attempts',
        'orphaned_processing_max_attempts',
        'turn_timeout',
        'timed_out'
      ) then 'timed_out'
    else q.status
  end,
  error_code = coalesce(
    q.error_code,
    case
      when q.error_message ilike '%worker_heartbeat_stale%' then 'worker_heartbeat_stale_max_attempts'
      when q.error_message ilike '%lease expired%maximum%' then 'lease_expired_max_attempts'
      when q.error_message ilike '%orphaned%maximum%' then 'orphaned_processing_max_attempts'
      when q.error_message ilike '%maximum attempts reached%' then 'worker_heartbeat_stale_max_attempts'
      else null
    end
  ),
  error_message = coalesce(
    q.error_code,
    case
      when q.error_message ilike '%worker_heartbeat_stale%' then 'worker_heartbeat_stale_max_attempts'
      when q.error_message ilike '%lease expired%maximum%' then 'lease_expired_max_attempts'
      when q.error_message ilike '%orphaned%maximum%' then 'orphaned_processing_max_attempts'
      when q.error_message ilike '%maximum attempts reached%' then 'worker_heartbeat_stale_max_attempts'
      else q.error_code
    end
  ),
  lease_owner = null,
  lease_expires_at = null,
  last_heartbeat_at = null,
  processing_deadline_at = null,
  completed_at = coalesce(q.completed_at, now()),
  updated_at = now()
where q.error_message ilike '%Worker stopped%'
   or q.error_message ilike '%maximum attempts reached%'
   or q.error_message ilike '%Worker lease expired%'
   or q.error_message ilike '%Orphaned processing%'
   or (q.status = 'processing' and q.attempt_count >= q.max_attempts);

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
  v_orphan_requeued integer := 0;
  v_orphan_failed integer := 0;
  v_heartbeat_requeued integer := 0;
  v_heartbeat_failed integer := 0;
  v_deadline_failed integer := 0;
  v_heartbeat_stale_seconds integer := greatest(45, least(coalesce(p_lease_seconds, 300) / 2, 90));
begin
  perform public._companion_assert_service_role();

  with deadline_exceeded as (
    select q.id
    from public.companion_message_queue q
    where q.status = 'processing'
      and q.processing_deadline_at is not null
      and q.processing_deadline_at < now()
    for update skip locked
  ),
  deadline_fail as (
    update public.companion_message_queue q
    set status = 'timed_out',
        lease_owner = null,
        lease_expires_at = null,
        last_heartbeat_at = null,
        processing_deadline_at = null,
        attempt_count = q.attempt_count + 1,
        error_code = 'turn_timeout',
        error_message = 'turn_timeout',
        completed_at = now(),
        updated_at = now()
    from deadline_exceeded d
    where q.id = d.id
    returning q.id
  )
  select count(*)::integer into v_deadline_failed from deadline_fail;

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
        processing_deadline_at = null,
        started_at = null,
        attempt_count = q.attempt_count + 1,
        error_code = 'lease_expired',
        error_message = 'lease_expired',
        updated_at = now()
    from expired e
    where q.id = e.id
      and q.attempt_count + 1 < q.max_attempts
    returning q.id
  ),
  fail_permanent as (
    update public.companion_message_queue q
    set status = 'timed_out',
        lease_owner = null,
        lease_expires_at = null,
        last_heartbeat_at = null,
        processing_deadline_at = null,
        attempt_count = q.attempt_count + 1,
        error_code = 'lease_expired_max_attempts',
        error_message = 'lease_expired_max_attempts',
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

  with heartbeat_stale as (
    select q.id
    from public.companion_message_queue q
    where q.status = 'processing'
      and q.last_heartbeat_at is not null
      and q.last_heartbeat_at < now() - make_interval(secs => v_heartbeat_stale_seconds)
    for update skip locked
  ),
  heartbeat_requeue as (
    update public.companion_message_queue q
    set status = 'waiting',
        lease_owner = null,
        lease_expires_at = null,
        last_heartbeat_at = null,
        processing_deadline_at = null,
        started_at = null,
        attempt_count = q.attempt_count + 1,
        error_code = 'worker_heartbeat_stale',
        error_message = 'worker_heartbeat_stale',
        updated_at = now()
    from heartbeat_stale h
    where q.id = h.id
      and q.attempt_count + 1 < q.max_attempts
    returning q.id
  ),
  heartbeat_fail as (
    update public.companion_message_queue q
    set status = 'timed_out',
        lease_owner = null,
        lease_expires_at = null,
        last_heartbeat_at = null,
        processing_deadline_at = null,
        attempt_count = q.attempt_count + 1,
        error_code = 'worker_heartbeat_stale_max_attempts',
        error_message = 'worker_heartbeat_stale_max_attempts',
        completed_at = now(),
        updated_at = now()
    from heartbeat_stale h
    where q.id = h.id
      and q.attempt_count + 1 >= q.max_attempts
      and q.id not in (select id from heartbeat_requeue)
    returning q.id
  )
  select
    (select count(*)::integer from heartbeat_requeue),
    (select count(*)::integer from heartbeat_fail)
  into v_heartbeat_requeued, v_heartbeat_failed;

  with orphaned as (
    select q.id
    from public.companion_message_queue q
    where q.status = 'processing'
      and q.lease_expires_at is null
      and coalesce(q.started_at, q.created_at) < now() - make_interval(secs => greatest(60, coalesce(p_lease_seconds, 300)))
    for update skip locked
  ),
  orphan_requeue as (
    update public.companion_message_queue q
    set status = 'waiting',
        lease_owner = null,
        lease_expires_at = null,
        last_heartbeat_at = null,
        processing_deadline_at = null,
        started_at = null,
        attempt_count = q.attempt_count + 1,
        error_code = 'orphaned_processing',
        error_message = 'orphaned_processing',
        updated_at = now()
    from orphaned o
    where q.id = o.id
      and q.attempt_count + 1 < q.max_attempts
    returning q.id
  ),
  orphan_fail as (
    update public.companion_message_queue q
    set status = 'timed_out',
        lease_owner = null,
        lease_expires_at = null,
        last_heartbeat_at = null,
        processing_deadline_at = null,
        attempt_count = q.attempt_count + 1,
        error_code = 'orphaned_processing_max_attempts',
        error_message = 'orphaned_processing_max_attempts',
        completed_at = now(),
        updated_at = now()
    from orphaned o
    where q.id = o.id
      and q.attempt_count + 1 >= q.max_attempts
      and q.id not in (select id from orphan_requeue)
    returning q.id
  )
  select
    (select count(*)::integer from orphan_requeue),
    (select count(*)::integer from orphan_fail)
  into v_orphan_requeued, v_orphan_failed;

  return jsonb_build_object(
    'ok', true,
    'requeued', v_requeued,
    'failed', v_failed + v_heartbeat_failed + v_orphan_failed + v_deadline_failed,
    'heartbeat_requeued', v_heartbeat_requeued,
    'heartbeat_failed', v_heartbeat_failed,
    'orphan_requeued', v_orphan_requeued,
    'orphan_failed', v_orphan_failed,
    'deadline_failed', v_deadline_failed
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
            'error_code', q.error_code,
            'route_type', q.route_type,
            'created_at', q.created_at,
            'started_at', q.started_at,
            'completed_at', q.completed_at,
            'processing_deadline_at', q.processing_deadline_at,
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
