-- Recover processing jobs whose worker stopped heartbeating (e.g. serverless timeout).
-- Feature owner: CUSTOMER APP (Companion chat queue)

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
  v_heartbeat_stale_seconds integer := greatest(45, least(coalesce(p_lease_seconds, 300) / 2, 90));
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
        started_at = null,
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
        started_at = null,
        attempt_count = q.attempt_count + 1,
        error_code = 'worker_heartbeat_stale',
        error_message = 'Worker stopped responding — job requeued',
        updated_at = now()
    from heartbeat_stale h
    where q.id = h.id
      and q.attempt_count + 1 < q.max_attempts
    returning q.id
  ),
  heartbeat_fail as (
    update public.companion_message_queue q
    set status = 'failed',
        lease_owner = null,
        lease_expires_at = null,
        last_heartbeat_at = null,
        attempt_count = q.attempt_count + 1,
        error_code = 'worker_heartbeat_stale_max_attempts',
        error_message = 'Worker stopped responding — maximum attempts reached',
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
        started_at = null,
        attempt_count = q.attempt_count + 1,
        error_code = 'orphaned_processing',
        error_message = 'Recovered orphaned processing job — requeued',
        updated_at = now()
    from orphaned o
    where q.id = o.id
      and q.attempt_count + 1 < q.max_attempts
    returning q.id
  ),
  orphan_fail as (
    update public.companion_message_queue q
    set status = 'failed',
        lease_owner = null,
        lease_expires_at = null,
        last_heartbeat_at = null,
        attempt_count = q.attempt_count + 1,
        error_code = 'orphaned_processing_max_attempts',
        error_message = 'Orphaned processing job — maximum attempts reached',
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
    'requeued', v_requeued + v_orphan_requeued + v_heartbeat_requeued,
    'failed', v_failed + v_orphan_failed + v_heartbeat_failed,
    'orphan_requeued', v_orphan_requeued,
    'orphan_failed', v_orphan_failed,
    'heartbeat_requeued', v_heartbeat_requeued,
    'heartbeat_failed', v_heartbeat_failed
  );
end;
$$;

grant execute on function public.companion_queue_worker_recover_stale(integer) to service_role;
