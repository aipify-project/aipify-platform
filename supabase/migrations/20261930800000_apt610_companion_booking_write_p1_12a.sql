-- P1.12A1/A2 — APT610 Companion booking write RPC (local only — not activated in runtime).
-- Feature owner: CUSTOMER APP. Governed execution against Phase 610 booking engine.
-- Supports booking.create | booking.update | booking.cancel via approved companion_action_requests.

-- ---------------------------------------------------------------------------
-- 1. Idempotency ledger
-- ---------------------------------------------------------------------------
create table if not exists public.organization_apt610_companion_write_idempotency (
  organization_id uuid not null references public.organizations (id) on delete cascade,
  idempotency_key text not null check (char_length(idempotency_key) between 8 and 128),
  action text not null check (action in ('booking.create', 'booking.update', 'booking.cancel')),
  payload_hash text not null check (payload_hash ~ '^[a-f0-9]{64}$'),
  appointment_id uuid references public.organization_apt610_appointments (id) on delete set null,
  result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  primary key (organization_id, idempotency_key)
);

alter table public.organization_apt610_companion_write_idempotency enable row level security;
revoke all on public.organization_apt610_companion_write_idempotency from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Slot hold time window + stable employee identity on appointments
-- ---------------------------------------------------------------------------
alter table public.organization_apt610_slot_holds
  add column if not exists starts_at timestamptz,
  add column if not exists ends_at timestamptz;

alter table public.organization_apt610_appointments
  add column if not exists employee_key text;

update public.organization_apt610_appointments a
set employee_key = uniq.employee_key
from (
  select
    a2.id as appointment_id,
    min(e.employee_key) as employee_key
  from public.organization_apt610_appointments a2
  inner join public.organization_apt610_employees e
    on e.organization_id = a2.organization_id
   and e.employee_label = a2.employee_label
  where a2.employee_key is null
    and nullif(trim(a2.employee_label), '') is not null
  group by a2.id
  having count(*) = 1
) uniq
where a.id = uniq.appointment_id;

create index if not exists organization_apt610_appointments_org_employee_time_idx
  on public.organization_apt610_appointments (organization_id, employee_key, starts_at)
  where employee_key is not null and starts_at is not null;

-- ---------------------------------------------------------------------------
-- 3. Helpers (internal only — no authenticated/service_role execute)
-- ---------------------------------------------------------------------------
create or replace function public._apt610_log_returning(
  p_org_id uuid,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb,
  p_category text default 'booking'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_audit_id uuid;
begin
  insert into public.organization_apt610_audit_logs (
    organization_id,
    actor_user_id,
    event_type,
    audit_category,
    summary,
    context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type,
    coalesce(p_category, 'booking'),
    left(coalesce(p_summary, ''), 500),
    coalesce(p_context, '{}'::jsonb)
  )
  returning id into v_audit_id;

  return v_audit_id;
end;
$$;

create or replace function public._apt610_companion_block_range(
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_prep_minutes integer,
  p_cleanup_minutes integer,
  p_buffer_minutes integer
)
returns tstzrange
language sql
immutable
set search_path = public
as $$
  select tstzrange(
    p_starts_at - make_interval(mins => greatest(coalesce(p_prep_minutes, 0), 0)),
    p_ends_at + make_interval(mins => greatest(coalesce(p_cleanup_minutes, 0) + coalesce(p_buffer_minutes, 0), 0)),
    '[)'
  );
$$;

create or replace function public._apt610_companion_write_result(
  p_success boolean,
  p_outcome_code text,
  p_appointment_id uuid default null,
  p_appointment_key text default null,
  p_previous_status text default null,
  p_current_status text default null,
  p_starts_at timestamptz default null,
  p_ends_at timestamptz default null,
  p_audit_id uuid default null,
  p_idempotent_replay boolean default false,
  p_channel_key text default 'companion'
)
returns jsonb
language sql
immutable
set search_path = public
as $$
  select jsonb_build_object(
    'success', p_success,
    'outcome_code', p_outcome_code,
    'appointment_id', p_appointment_id,
    'appointment_key', p_appointment_key,
    'previous_status', p_previous_status,
    'current_status', p_current_status,
    'starts_at', p_starts_at,
    'ends_at', p_ends_at,
    'audit_id', p_audit_id,
    'idempotent_replay', coalesce(p_idempotent_replay, false),
    'channel_key', coalesce(nullif(trim(p_channel_key), ''), 'companion')
  );
$$;

create or replace function public._apt610_companion_overlap_lock_key(
  p_org_id uuid,
  p_employee_key text
)
returns bigint
language sql
immutable
set search_path = public
as $$
  select hashtextextended(
    'apt610_overlap:' || coalesce(p_org_id::text, '') || ':' ||
    coalesce(nullif(trim(p_employee_key), ''), '_'),
    0
  );
$$;

create or replace function public._apt610_companion_idempotency_lock_key(
  p_org_id uuid,
  p_idempotency_key text
)
returns bigint
language sql
immutable
set search_path = public
as $$
  select hashtextextended(
    'apt610_write_idem:' || coalesce(p_org_id::text, '') || ':' || coalesce(p_idempotency_key, ''),
    0
  );
$$;

create or replace function public._apt610_companion_consume_action_request(
  p_org_id uuid,
  p_user_id uuid,
  p_req public.companion_action_requests,
  p_outcome_code text,
  p_appointment_id uuid,
  p_appointment_key text,
  p_apt610_audit_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.companion_action_requests
  set
    lifecycle_status = 'completed',
    execution_status = 'completed',
    metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
      'consumed_at', to_jsonb(now()),
      'outcome_code', p_outcome_code,
      'appointment_id', p_appointment_id::text,
      'appointment_key', coalesce(p_appointment_key, ''),
      'apt610_audit_id', p_apt610_audit_id::text
    ),
    updated_at = now()
  where id = p_req.id
    and organization_id = p_org_id;

  update public.companion_action_queue
  set
    queue_status = 'completed',
    completed_at = coalesce(completed_at, now())
  where action_request_id = p_req.id
    and organization_id = p_org_id;

  insert into public.companion_action_receipts (
    organization_id,
    action_request_id,
    result_summary,
    duration_ms,
    approver_id,
    audit_reference
  ) values (
    p_org_id,
    p_req.id,
    'Companion booking write completed.',
    0,
    p_user_id,
    'AUD-' || left(p_req.id::text, 8)
  )
  on conflict (action_request_id) do nothing;

  perform public._caae346_log_audit(
    p_org_id,
    p_user_id,
    'booking_approval_consumed',
    'Governed booking approval consumed',
    p_req.id,
    jsonb_build_object(
      'outcome_code', p_outcome_code,
      'appointment_id', p_appointment_id::text,
      'appointment_key', coalesce(p_appointment_key, ''),
      'apt610_audit_id', p_apt610_audit_id::text
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Main RPC — execute_apt610_companion_booking_write
-- ---------------------------------------------------------------------------
create or replace function public.execute_apt610_companion_booking_write(
  p_action_request_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_req public.companion_action_requests;
  v_settings public.organization_apt610_settings;
  v_payload jsonb;
  v_action text;
  v_payload_hash text;
  v_idempotency_key text;
  v_idem_row public.organization_apt610_companion_write_idempotency;
  v_service public.organization_apt610_services;
  v_employee public.organization_apt610_employees;
  v_customer public.organization_apt610_customers;
  v_resource public.organization_apt610_resources;
  v_appointment public.organization_apt610_appointments;
  v_appointment_id uuid;
  v_appointment_key text;
  v_previous_status text;
  v_current_status text;
  v_starts_at timestamptz;
  v_ends_at timestamptz;
  v_computed_ends_at timestamptz;
  v_payload_end_at timestamptz;
  v_block_range tstzrange;
  v_overlap_count integer;
  v_hold_conflict_count integer;
  v_audit_id uuid;
  v_result jsonb;
  v_outcome_code text;
  v_service_key text;
  v_resource_id text;
  v_customer_ref text;
  v_booking_ref text;
  v_employee_key text;
  v_employee_label text := '';
  v_customer_label text := '';
  v_expected_action text;
  v_terminal_statuses text[] := array['cancelled', 'completed', 'no_show', 'rescheduled'];
  v_blocking_statuses text[] := array['pending', 'confirmed', 'checked_in', 'in_progress'];
begin
  -- Gate 1: authenticated user
  if auth.uid() is null then
    return public._apt610_companion_write_result(false, 'NOT_FOUND');
  end if;

  v_user_id := public._mta_app_user_id();
  if v_user_id is null then
    return public._apt610_companion_write_result(false, 'NOT_FOUND');
  end if;

  -- Gate 2: organization via APT610 resolver
  v_org_id := public._apt610_org();
  if v_org_id is null then
    return public._apt610_companion_write_result(false, 'NOT_FOUND');
  end if;

  -- Gate 3: permission
  begin
    perform public._irp_require_permission('appointments.manage', v_org_id);
  exception
    when others then
      return public._apt610_companion_write_result(false, 'NOT_FOUND');
  end;

  if p_action_request_id is null then
    return public._apt610_companion_write_result(false, 'NOT_FOUND');
  end if;

  -- Gate 4: lock and read companion_action_requests
  select * into v_req
  from public.companion_action_requests r
  where r.id = p_action_request_id
    and r.organization_id = v_org_id
  for update;

  if not found then
    return public._apt610_companion_write_result(false, 'NOT_FOUND');
  end if;

  v_action := v_req.action_key;
  v_payload := coalesce(v_req.metadata->'payload', '{}'::jsonb);
  v_payload_hash := coalesce(v_req.metadata->>'payload_hash', '');
  v_idempotency_key := coalesce(v_req.metadata->>'idempotency_key', '');

  -- Gate 5: booking action metadata verification
  if v_action not in ('booking.create', 'booking.update', 'booking.cancel') then
    return public._apt610_companion_write_result(false, 'APPROVAL_INVALID');
  end if;

  if coalesce(v_req.metadata->>'domain', '') <> 'booking_write'
     or coalesce(v_req.metadata->>'schema_version', '') <> 'booking_write_v1'
     or coalesce(v_req.metadata->>'provider_key', '') <> 'appointment_booking' then
    return public._apt610_companion_write_result(false, 'APPROVAL_INVALID');
  end if;

  v_expected_action := case v_action
    when 'booking.create' then 'create'
    when 'booking.update' then 'update'
    when 'booking.cancel' then 'cancel'
  end;

  if coalesce(v_req.metadata->>'capability_key', '') <> v_action
     or coalesce(v_req.metadata->>'requested_action', '') <> v_expected_action then
    return public._apt610_companion_write_result(false, 'APPROVAL_INVALID');
  end if;

  if v_payload_hash !~ '^[a-f0-9]{64}$'
     or char_length(v_idempotency_key) < 8
     or char_length(v_idempotency_key) > 128 then
    return public._apt610_companion_write_result(false, 'APPROVAL_INVALID');
  end if;

  if v_req.expires_at is not null and v_req.expires_at <= now() then
    return public._apt610_companion_write_result(false, 'APPROVAL_EXPIRED');
  end if;

  -- Gate 6: APT610 settings
  perform public._apt610_ensure_settings(v_org_id);

  select * into v_settings
  from public.organization_apt610_settings s
  where s.organization_id = v_org_id;

  if not coalesce(v_settings.appointment_center_enabled, false)
     or not coalesce(v_settings.companion_booking_enabled, false) then
    return public._apt610_companion_write_result(false, 'SETTINGS_DISABLED');
  end if;

  -- Idempotency ledger (race-safe advisory lock before lookup)
  perform pg_advisory_xact_lock(public._apt610_companion_idempotency_lock_key(v_org_id, v_idempotency_key));

  select * into v_idem_row
  from public.organization_apt610_companion_write_idempotency i
  where i.organization_id = v_org_id
    and i.idempotency_key = v_idempotency_key;

  if found then
    if v_idem_row.action = v_action and v_idem_row.payload_hash = v_payload_hash then
      -- Defensive inconsistency recovery only: ledger without consume should not occur atomically.
      if v_req.lifecycle_status <> 'completed'
         and v_req.execution_status <> 'completed'
         and nullif(trim(v_req.metadata->>'consumed_at'), '') is null then
        perform public._apt610_companion_consume_action_request(
          v_org_id,
          v_user_id,
          v_req,
          coalesce(v_idem_row.result->>'outcome_code', 'BOOKING_WRITE_REPLAY'),
          (v_idem_row.result->>'appointment_id')::uuid,
          coalesce(v_idem_row.result->>'appointment_key', ''),
          (v_idem_row.result->>'audit_id')::uuid
        );
      end if;

      return coalesce(v_idem_row.result, '{}'::jsonb)
        || jsonb_build_object('idempotent_replay', true, 'success', true);
    end if;

    return public._apt610_companion_write_result(false, 'IDEMPOTENCY_CONFLICT');
  end if;

  -- Gate 7: Phase 346 approved pre-execution state (new writes only)
  if v_req.approval_status <> 'approved'
     or v_req.lifecycle_status <> 'approved'
     or v_req.execution_status <> 'queued' then
    return public._apt610_companion_write_result(false, 'APPROVAL_INVALID');
  end if;

  if v_req.lifecycle_status = 'completed'
     or v_req.execution_status = 'completed'
     or nullif(trim(v_req.metadata->>'consumed_at'), '') is not null then
    return public._apt610_companion_write_result(false, 'ALREADY_CONSUMED');
  end if;

  -- Parse canonical hash-bound payload fields only
  v_service_key := nullif(trim(v_payload->>'service_id'), '');
  v_resource_id := nullif(trim(v_payload->>'resource_id'), '');
  v_customer_ref := nullif(trim(v_payload->>'customer_reference'), '');
  v_booking_ref := nullif(trim(v_payload->>'booking_id'), '');

  if nullif(trim(v_payload->>'start_at'), '') is not null then
    begin
      v_starts_at := (v_payload->>'start_at')::timestamptz;
    exception
      when others then
        return public._apt610_companion_write_result(false, 'WRITE_FAILED');
    end;
  end if;

  if nullif(trim(v_payload->>'end_at'), '') is not null then
    begin
      v_payload_end_at := (v_payload->>'end_at')::timestamptz;
    exception
      when others then
        return public._apt610_companion_write_result(false, 'APPROVAL_INVALID');
    end;
  end if;

  -- -------------------------------------------------------------------------
  -- booking.create
  -- -------------------------------------------------------------------------
  if v_action = 'booking.create' then
    if v_service_key is null or v_starts_at is null then
      return public._apt610_companion_write_result(false, 'WRITE_FAILED');
    end if;

    select * into v_service
    from public.organization_apt610_services s
    where s.organization_id = v_org_id
      and s.service_key = v_service_key;

    if not found then
      return public._apt610_companion_write_result(false, 'WRITE_FAILED');
    end if;

    v_computed_ends_at := v_starts_at + make_interval(mins => greatest(v_service.duration_minutes, 1));
    if v_payload_end_at is not null and v_payload_end_at <> v_computed_ends_at then
      return public._apt610_companion_write_result(false, 'APPROVAL_INVALID');
    end if;

    v_ends_at := v_computed_ends_at;

    if v_resource_id is not null then
      select * into v_employee
      from public.organization_apt610_employees e
      where e.organization_id = v_org_id
        and e.employee_key = v_resource_id;

      if found then
        v_employee_key := v_employee.employee_key;
        v_employee_label := v_employee.employee_label;
      else
        select * into v_resource
        from public.organization_apt610_resources r
        where r.organization_id = v_org_id
          and r.resource_key = v_resource_id;

        if found then
          return public._apt610_companion_write_result(false, 'UNSUPPORTED_RESOURCE_ONLY_BOOKING');
        end if;

        return public._apt610_companion_write_result(false, 'WRITE_FAILED');
      end if;
    end if;

    if v_customer_ref is not null then
      select * into v_customer
      from public.organization_apt610_customers c
      where c.organization_id = v_org_id
        and c.customer_key = v_customer_ref;

      if not found then
        return public._apt610_companion_write_result(false, 'WRITE_FAILED');
      end if;

      v_customer_label := v_customer.customer_label;
    end if;

    if v_employee_key is not null then
      perform pg_advisory_xact_lock(
        public._apt610_companion_overlap_lock_key(v_org_id, v_employee_key)
      );
    end if;

    v_block_range := public._apt610_companion_block_range(
      v_starts_at,
      v_ends_at,
      v_service.prep_minutes,
      v_service.cleanup_minutes,
      v_service.buffer_minutes
    );

    if v_employee_key is not null
       and coalesce(v_settings.prevent_double_booking, true)
       and not coalesce(v_settings.overbooking_allowed, false) then
      select count(*) into v_overlap_count
      from public.organization_apt610_appointments a
      inner join public.organization_apt610_services s
        on s.organization_id = a.organization_id
       and s.service_key = a.service_key
      where a.organization_id = v_org_id
        and a.status_key = any (v_blocking_statuses)
        and a.starts_at is not null
        and a.ends_at is not null
        and (
          (a.employee_key is not null and a.employee_key = v_employee_key)
          or (
            a.employee_key is null
            and v_employee_key is not null
            and nullif(trim(a.employee_label), '') = nullif(trim(v_employee_label), '')
          )
        )
        and public._apt610_companion_block_range(
              a.starts_at,
              a.ends_at,
              s.prep_minutes,
              s.cleanup_minutes,
              s.buffer_minutes
            ) && v_block_range;

      if v_overlap_count > 0 then
        if coalesce(v_settings.audit_logging_required, true) then
          perform public._apt610_log_returning(
            v_org_id,
            'booking_create_failed',
            'Companion booking create blocked by overlap policy',
            jsonb_build_object('outcome_code', 'OVERLAP_CONFLICT', 'action_request_id', p_action_request_id::text),
            'booking'
          );
        end if;
        return public._apt610_companion_write_result(false, 'OVERLAP_CONFLICT');
      end if;
    end if;

    if v_employee_key is not null then
      select count(*) into v_hold_conflict_count
      from public.organization_apt610_slot_holds h
      where h.organization_id = v_org_id
        and h.hold_status = 'active'
        and h.expires_at > now()
        and h.starts_at is not null
        and h.ends_at is not null
        and tstzrange(h.starts_at, h.ends_at, '[)') && v_block_range
        and h.employee_ref = v_employee_key;

      if v_hold_conflict_count > 0 then
        if coalesce(v_settings.audit_logging_required, true) then
          perform public._apt610_log_returning(
            v_org_id,
            'booking_create_failed',
            'Companion booking create blocked by active slot hold',
            jsonb_build_object('outcome_code', 'SLOT_HOLD_CONFLICT', 'action_request_id', p_action_request_id::text),
            'booking'
          );
        end if;
        return public._apt610_companion_write_result(false, 'SLOT_HOLD_CONFLICT');
      end if;
    end if;

    v_appointment_key := 'apt_' || lower(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12));
    v_current_status := 'confirmed';

    insert into public.organization_apt610_appointments (
      organization_id,
      appointment_key,
      appointment_title,
      service_key,
      customer_label,
      employee_key,
      employee_label,
      location_label,
      channel_key,
      status_key,
      starts_at,
      ends_at,
      revenue_amount,
      summary
    ) values (
      v_org_id,
      v_appointment_key,
      left(v_service.service_title || ' — Companion', 500),
      v_service.service_key,
      coalesce(v_customer_label, ''),
      v_employee_key,
      coalesce(v_employee_label, ''),
      '',
      'companion',
      v_current_status,
      v_starts_at,
      v_ends_at,
      coalesce(v_service.price_amount, 0),
      'Companion-assisted booking — governed write.'
    )
    returning id into v_appointment_id;

    v_outcome_code := 'BOOKING_CREATED';

    v_audit_id := public._apt610_log_returning(
      v_org_id,
      'booking_created',
      'Companion booking created',
      jsonb_build_object(
        'appointment_id', v_appointment_id::text,
        'appointment_key', v_appointment_key,
        'action_request_id', p_action_request_id::text,
        'channel_key', 'companion'
      ),
      'booking'
    );

  -- -------------------------------------------------------------------------
  -- booking.update
  -- -------------------------------------------------------------------------
  elsif v_action = 'booking.update' then
    if v_booking_ref is null then
      return public._apt610_companion_write_result(false, 'APPOINTMENT_NOT_FOUND');
    end if;

    select * into v_appointment
    from public.organization_apt610_appointments a
    where a.organization_id = v_org_id
      and a.appointment_key = v_booking_ref
    for update;

    if not found then
      return public._apt610_companion_write_result(false, 'APPOINTMENT_NOT_FOUND');
    end if;

    v_appointment_id := v_appointment.id;
    v_appointment_key := v_appointment.appointment_key;
    v_previous_status := v_appointment.status_key;

    if v_previous_status = any (v_terminal_statuses) then
      return public._apt610_companion_write_result(false, 'TERMINAL_STATUS');
    end if;

    v_service_key := coalesce(v_service_key, v_appointment.service_key);

    select * into v_service
    from public.organization_apt610_services s
    where s.organization_id = v_org_id
      and s.service_key = v_service_key;

    if not found then
      return public._apt610_companion_write_result(false, 'WRITE_FAILED');
    end if;

    v_starts_at := coalesce(v_starts_at, v_appointment.starts_at);
    if v_starts_at is null then
      return public._apt610_companion_write_result(false, 'WRITE_FAILED');
    end if;

    v_computed_ends_at := v_starts_at + make_interval(mins => greatest(v_service.duration_minutes, 1));
    if v_payload_end_at is not null and v_payload_end_at <> v_computed_ends_at then
      return public._apt610_companion_write_result(false, 'APPROVAL_INVALID');
    end if;

    v_ends_at := v_computed_ends_at;

    if v_resource_id is not null then
      select * into v_employee
      from public.organization_apt610_employees e
      where e.organization_id = v_org_id
        and e.employee_key = v_resource_id;

      if found then
        v_employee_key := v_employee.employee_key;
        v_employee_label := v_employee.employee_label;
      else
        select * into v_resource
        from public.organization_apt610_resources r
        where r.organization_id = v_org_id
          and r.resource_key = v_resource_id;

        if found then
          return public._apt610_companion_write_result(false, 'UNSUPPORTED_RESOURCE_ONLY_BOOKING');
        end if;

        return public._apt610_companion_write_result(false, 'WRITE_FAILED');
      end if;
    else
      v_employee_key := v_appointment.employee_key;
      v_employee_label := v_appointment.employee_label;
    end if;

    if v_customer_ref is not null then
      select * into v_customer
      from public.organization_apt610_customers c
      where c.organization_id = v_org_id
        and c.customer_key = v_customer_ref;

      if not found then
        return public._apt610_companion_write_result(false, 'WRITE_FAILED');
      end if;

      v_customer_label := v_customer.customer_label;
    else
      v_customer_label := v_appointment.customer_label;
    end if;

    if v_employee_key is not null then
      perform pg_advisory_xact_lock(
        public._apt610_companion_overlap_lock_key(v_org_id, v_employee_key)
      );
    end if;

    v_block_range := public._apt610_companion_block_range(
      v_starts_at,
      v_ends_at,
      v_service.prep_minutes,
      v_service.cleanup_minutes,
      v_service.buffer_minutes
    );

    if v_employee_key is not null
       and coalesce(v_settings.prevent_double_booking, true)
       and not coalesce(v_settings.overbooking_allowed, false) then
      select count(*) into v_overlap_count
      from public.organization_apt610_appointments a
      inner join public.organization_apt610_services s
        on s.organization_id = a.organization_id
       and s.service_key = a.service_key
      where a.organization_id = v_org_id
        and a.id <> v_appointment_id
        and a.status_key = any (v_blocking_statuses)
        and a.starts_at is not null
        and a.ends_at is not null
        and (
          (a.employee_key is not null and a.employee_key = v_employee_key)
          or (
            a.employee_key is null
            and v_employee_key is not null
            and nullif(trim(a.employee_label), '') = nullif(trim(v_employee_label), '')
          )
        )
        and public._apt610_companion_block_range(
              a.starts_at,
              a.ends_at,
              s.prep_minutes,
              s.cleanup_minutes,
              s.buffer_minutes
            ) && v_block_range;

      if v_overlap_count > 0 then
        if coalesce(v_settings.audit_logging_required, true) then
          perform public._apt610_log_returning(
            v_org_id,
            'booking_update_failed',
            'Companion booking update blocked by overlap policy',
            jsonb_build_object(
              'outcome_code', 'OVERLAP_CONFLICT',
              'action_request_id', p_action_request_id::text,
              'appointment_id', v_appointment_id::text
            ),
            'booking'
          );
        end if;
        return public._apt610_companion_write_result(false, 'OVERLAP_CONFLICT');
      end if;
    end if;

    update public.organization_apt610_appointments a
    set
      service_key = v_service.service_key,
      customer_label = coalesce(v_customer_label, a.customer_label),
      employee_key = coalesce(v_employee_key, a.employee_key),
      employee_label = coalesce(v_employee_label, a.employee_label),
      starts_at = v_starts_at,
      ends_at = v_ends_at,
      revenue_amount = coalesce(v_service.price_amount, a.revenue_amount),
      summary = left(
        coalesce(a.summary, '') ||
        case when coalesce(a.summary, '') = '' then '' else ' ' end ||
        'Updated via companion governed write.',
        500
      )
    where a.id = v_appointment_id
    returning status_key into v_current_status;

    v_outcome_code := 'BOOKING_UPDATED';

    v_audit_id := public._apt610_log_returning(
      v_org_id,
      'booking_updated',
      'Companion booking updated',
      jsonb_build_object(
        'appointment_id', v_appointment_id::text,
        'appointment_key', v_appointment_key,
        'action_request_id', p_action_request_id::text,
        'previous_status', v_previous_status,
        'channel_key', 'companion'
      ),
      'booking'
    );

  -- -------------------------------------------------------------------------
  -- booking.cancel
  -- -------------------------------------------------------------------------
  elsif v_action = 'booking.cancel' then
    if v_booking_ref is null then
      return public._apt610_companion_write_result(false, 'APPOINTMENT_NOT_FOUND');
    end if;

    select * into v_appointment
    from public.organization_apt610_appointments a
    where a.organization_id = v_org_id
      and a.appointment_key = v_booking_ref
    for update;

    if not found then
      return public._apt610_companion_write_result(false, 'APPOINTMENT_NOT_FOUND');
    end if;

    v_appointment_id := v_appointment.id;
    v_appointment_key := v_appointment.appointment_key;
    v_previous_status := v_appointment.status_key;
    v_starts_at := v_appointment.starts_at;
    v_ends_at := v_appointment.ends_at;

    if v_previous_status = 'cancelled' then
      v_current_status := 'cancelled';
      v_outcome_code := 'BOOKING_CANCELLED';
      v_audit_id := public._apt610_log_returning(
        v_org_id,
        'booking_cancelled',
        'Companion booking cancel replay — already cancelled',
        jsonb_build_object(
          'appointment_id', v_appointment_id::text,
          'appointment_key', v_appointment_key,
          'action_request_id', p_action_request_id::text,
          'idempotent_replay', true,
          'channel_key', 'companion'
        ),
        'booking'
      );
    else
      if v_previous_status = any (v_terminal_statuses) and v_previous_status <> 'cancelled' then
        return public._apt610_companion_write_result(
          false,
          'TERMINAL_STATUS',
          v_appointment_id,
          v_appointment_key,
          v_previous_status,
          v_previous_status,
          v_starts_at,
          v_ends_at,
          null,
          false,
          'companion'
        );
      end if;

      update public.organization_apt610_appointments a
      set
        status_key = 'cancelled',
        summary = left(
          coalesce(a.summary, '') ||
          case when coalesce(a.summary, '') = '' then '' else ' ' end ||
          'Cancelled via companion governed write.',
          500
        )
      where a.id = v_appointment_id
      returning status_key into v_current_status;

      v_outcome_code := 'BOOKING_CANCELLED';

      v_audit_id := public._apt610_log_returning(
        v_org_id,
        'booking_cancelled',
        'Companion booking cancelled',
        jsonb_build_object(
          'appointment_id', v_appointment_id::text,
          'appointment_key', v_appointment_key,
          'action_request_id', p_action_request_id::text,
          'previous_status', v_previous_status,
          'channel_key', 'companion'
        ),
        'booking'
      );
    end if;
  end if;

  -- Consume governed approval in the same transaction
  perform public._apt610_companion_consume_action_request(
    v_org_id,
    v_user_id,
    v_req,
    v_outcome_code,
    v_appointment_id,
    v_appointment_key,
    v_audit_id
  );

  v_result := public._apt610_companion_write_result(
    true,
    v_outcome_code,
    v_appointment_id,
    v_appointment_key,
    v_previous_status,
    v_current_status,
    v_starts_at,
    v_ends_at,
    v_audit_id,
    false,
    'companion'
  );

  insert into public.organization_apt610_companion_write_idempotency (
    organization_id,
    idempotency_key,
    action,
    payload_hash,
    appointment_id,
    result
  ) values (
    v_org_id,
    v_idempotency_key,
    v_action,
    v_payload_hash,
    v_appointment_id,
    v_result
  );

  return v_result;
exception
  when others then
    return public._apt610_companion_write_result(false, 'WRITE_FAILED');
end;
$$;

revoke all on function public.execute_apt610_companion_booking_write(uuid) from public, anon, service_role;
grant execute on function public.execute_apt610_companion_booking_write(uuid) to authenticated;

revoke all on function public._apt610_log_returning(uuid, text, text, jsonb, text) from public, anon, authenticated, service_role;
revoke all on function public._apt610_companion_block_range(timestamptz, timestamptz, integer, integer, integer) from public, anon, authenticated, service_role;
revoke all on function public._apt610_companion_write_result(boolean, text, uuid, text, text, text, timestamptz, timestamptz, uuid, boolean, text) from public, anon, authenticated, service_role;
revoke all on function public._apt610_companion_overlap_lock_key(uuid, text) from public, anon, authenticated, service_role;
revoke all on function public._apt610_companion_idempotency_lock_key(uuid, text) from public, anon, authenticated, service_role;
revoke all on function public._apt610_companion_consume_action_request(uuid, uuid, public.companion_action_requests, text, uuid, text, uuid) from public, anon, authenticated, service_role;
