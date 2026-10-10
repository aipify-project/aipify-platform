-- PROPOSAL ONLY — NOT APPLIED. NOT PART OF #98 MERGE.
-- Task: AIPIFY.KOMPIS.PUBLIC.COST.SQL.REVIEW.05
-- Review version: v2 (corrects proven gaps in V1 proposal SHA 1cc93f0f…)
-- Purpose: Public Website Kompis AI cost reservation without operator auth.uid().
-- Caller: server service_role only after verified install/domain trust.
-- Do not grant to anon/authenticated for write. No client budget writes.
--
-- v2 delta vs V1:
-- 1) Idempotent replay of a finalized/non-reserved row returns allowed=false
--    (must not re-authorize a paid provider call).
-- 2) Idempotent replay requires matching install_id + domain; else denied.
-- 3) Finalize meters into the reservation's created_at hour window (not now()),
--    and ensures that window row exists before updating call_count/token_units.
-- Intentionally unchanged: reserved_count is not decremented on release/error
-- (rate slot consumed; prevents free retry storms). Still rate-limit, not $ budget.

begin;

create table if not exists public.website_kompis_public_ai_reservations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  install_id uuid not null,
  domain text not null,
  idempotency_key text null,
  model_profile text not null default 'kompis_result_summary_v1',
  status text not null default 'reserved'
    check (status in ('reserved', 'success', 'provider_error', 'timeout', 'fallback', 'skipped', 'released')),
  input_units int null,
  output_units int null,
  total_units int null,
  latency_ms int null,
  safe_error_code text null,
  created_at timestamptz not null default now(),
  finalized_at timestamptz null
);

create unique index if not exists website_kompis_public_ai_reservations_idem_uidx
  on public.website_kompis_public_ai_reservations (tenant_id, idempotency_key)
  where idempotency_key is not null;

create index if not exists website_kompis_public_ai_reservations_tenant_created_idx
  on public.website_kompis_public_ai_reservations (tenant_id, created_at desc);

create table if not exists public.website_kompis_public_ai_budget_windows (
  tenant_id uuid not null,
  window_start timestamptz not null,
  window_seconds int not null default 3600,
  call_count int not null default 0,
  reserved_count int not null default 0,
  token_units bigint not null default 0,
  updated_at timestamptz not null default now(),
  primary key (tenant_id, window_start)
);

alter table public.website_kompis_public_ai_reservations enable row level security;
alter table public.website_kompis_public_ai_budget_windows enable row level security;
revoke all on table public.website_kompis_public_ai_reservations from public, anon, authenticated;
revoke all on table public.website_kompis_public_ai_budget_windows from public, anon, authenticated;
grant all on table public.website_kompis_public_ai_reservations to service_role;
grant all on table public.website_kompis_public_ai_budget_windows to service_role;

-- Tunables (existing budget amounts must not be increased without owner approval).
-- Default: 60 calls / calendar hour / tenant for public grounded asks.
create or replace function public.reserve_website_kompis_public_ai_call(
  p_install_id uuid,
  p_domain text,
  p_tenant_id uuid,
  p_idempotency_key text default null,
  p_model_profile text default 'kompis_result_summary_v1'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_domain text := lower(btrim(coalesce(p_domain, '')));
  v_idem text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_window_start timestamptz := date_trunc('hour', now());
  v_limit int := 60;
  v_row public.website_kompis_public_ai_budget_windows;
  v_reservation_id uuid;
  v_existing public.website_kompis_public_ai_reservations;
begin
  if p_install_id is null or p_tenant_id is null or v_domain = '' then
    return jsonb_build_object('allowed', false, 'status', 'denied', 'reason', 'untrusted_binding');
  end if;

  -- Replay idempotent reservation (same tenant + key only).
  if v_idem is not null then
    select * into v_existing
    from public.website_kompis_public_ai_reservations
    where tenant_id = p_tenant_id
      and idempotency_key = v_idem
    limit 1;
    if found then
      if v_existing.install_id is distinct from p_install_id
         or lower(btrim(v_existing.domain)) is distinct from v_domain then
        return jsonb_build_object(
          'allowed', false,
          'status', 'denied',
          'reason', 'binding_mismatch',
          'reservation_id', v_existing.id
        );
      end if;

      -- Only an in-flight reserved row may replay as allowed.
      -- Finalized/released rows must not re-authorize a paid provider call.
      if v_existing.status = 'reserved' and v_existing.finalized_at is null then
        return jsonb_build_object(
          'allowed', true,
          'status', 'allowed',
          'reason', 'idempotent_replay',
          'reservation_id', v_existing.id
        );
      end if;

      return jsonb_build_object(
        'allowed', false,
        'status', 'denied',
        'reason', 'already_finalized',
        'reservation_id', v_existing.id,
        'prior_status', v_existing.status
      );
    end if;
  end if;

  insert into public.website_kompis_public_ai_budget_windows as w (
    tenant_id, window_start, window_seconds, call_count, reserved_count, token_units
  ) values (p_tenant_id, v_window_start, 3600, 0, 0, 0)
  on conflict (tenant_id, window_start) do nothing;

  select * into v_row
  from public.website_kompis_public_ai_budget_windows
  where tenant_id = p_tenant_id
    and window_start = v_window_start
  for update;

  if v_row.reserved_count >= v_limit then
    return jsonb_build_object(
      'allowed', false,
      'status', 'budget_exhausted',
      'reason', 'budget_exhausted',
      'limit', v_limit,
      'reserved_count', v_row.reserved_count
    );
  end if;

  update public.website_kompis_public_ai_budget_windows
  set reserved_count = reserved_count + 1,
      updated_at = now()
  where tenant_id = p_tenant_id
    and window_start = v_window_start;

  insert into public.website_kompis_public_ai_reservations (
    tenant_id, install_id, domain, idempotency_key, model_profile, status
  ) values (
    p_tenant_id, p_install_id, v_domain, v_idem,
    coalesce(nullif(btrim(p_model_profile), ''), 'kompis_result_summary_v1'),
    'reserved'
  )
  returning id into v_reservation_id;

  return jsonb_build_object(
    'allowed', true,
    'status', 'allowed',
    'reservation_id', v_reservation_id,
    'limit', v_limit,
    'reserved_count', v_row.reserved_count + 1
  );
end;
$$;

create or replace function public.finalize_website_kompis_public_ai_call(
  p_reservation_id uuid,
  p_tenant_id uuid,
  p_install_id uuid,
  p_result text,
  p_safe_error_code text default null,
  p_input_units int default null,
  p_output_units int default null,
  p_total_units int default null,
  p_latency_ms int default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_result text := coalesce(nullif(btrim(p_result), ''), 'provider_error');
  v_row public.website_kompis_public_ai_reservations;
  v_window_start timestamptz;
begin
  if v_result not in ('success', 'provider_error', 'timeout', 'fallback', 'skipped', 'released') then
    raise exception 'INVALID_PUBLIC_AI_RESULT' using errcode = 'P0001';
  end if;

  select * into v_row
  from public.website_kompis_public_ai_reservations
  where id = p_reservation_id
    and tenant_id = p_tenant_id
    and install_id = p_install_id
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'reason', 'reservation_not_found');
  end if;

  if v_row.finalized_at is not null then
    return jsonb_build_object('ok', true, 'reason', 'already_finalized', 'reservation_id', v_row.id);
  end if;

  -- Meter into the hour the reservation was created (not finalize wall-clock).
  v_window_start := date_trunc('hour', v_row.created_at);

  update public.website_kompis_public_ai_reservations
  set status = v_result,
      input_units = p_input_units,
      output_units = p_output_units,
      total_units = p_total_units,
      latency_ms = p_latency_ms,
      safe_error_code = left(p_safe_error_code, 80),
      finalized_at = now()
  where id = v_row.id;

  insert into public.website_kompis_public_ai_budget_windows as w (
    tenant_id, window_start, window_seconds, call_count, reserved_count, token_units
  ) values (p_tenant_id, v_window_start, 3600, 0, 0, 0)
  on conflict (tenant_id, window_start) do nothing;

  update public.website_kompis_public_ai_budget_windows
  set call_count = call_count + case when v_result = 'success' then 1 else 0 end,
      token_units = token_units + coalesce(p_total_units, 0),
      updated_at = now()
  where tenant_id = p_tenant_id
    and window_start = v_window_start;

  return jsonb_build_object('ok', true, 'reservation_id', v_row.id, 'status', v_result);
end;
$$;

revoke all on function public.reserve_website_kompis_public_ai_call(uuid, text, uuid, text, text)
  from public, anon, authenticated;
revoke all on function public.finalize_website_kompis_public_ai_call(uuid, uuid, uuid, text, text, int, int, int, int)
  from public, anon, authenticated;
grant execute on function public.reserve_website_kompis_public_ai_call(uuid, text, uuid, text, text)
  to service_role;
grant execute on function public.finalize_website_kompis_public_ai_call(uuid, uuid, uuid, text, text, int, int, int, int)
  to service_role;

commit;
