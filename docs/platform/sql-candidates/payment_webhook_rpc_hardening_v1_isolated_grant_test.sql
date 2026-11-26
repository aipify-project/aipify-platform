-- Isolated grant-matrix test for Payment Webhook RPC Hardening V1.
-- Mirrors Production signatures + pre-fix PUBLIC/anon EXECUTE leakage.
-- Does NOT mutate real Production data. Safe to run in disposable Postgres.

create schema if not exists public;

-- Minimal stubs with Production identity arguments (bodies record only; no subscription mutation).
create table if not exists public._payment_security_test_calls (
  id bigserial primary key,
  fn text not null,
  caller_role text not null,
  noted_at timestamptz not null default now()
);

create or replace function public.handle_payment_webhook_event(
  p_provider text,
  p_event_type text,
  p_payload jsonb default '{}'::jsonb,
  p_customer_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public._payment_security_test_calls(fn, caller_role)
  values (
    'handle_payment_webhook_event',
    coalesce(current_setting('request.jwt.claim.role', true), current_user)
  );
  return jsonb_build_object('processed', true, 'stub', true, 'customer_id', p_customer_id);
end;
$$;

create or replace function public.register_trial_payment_method(
  p_stripe_customer_id text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid text := coalesce(current_setting('request.jwt.claim.sub', true), '');
begin
  -- Representative tenant gate: authenticated must have a sub; refuse empty/cross-tenant spoof.
  if coalesce(current_setting('request.jwt.claim.role', true), '') = 'authenticated' then
    if v_uid = '' then
      raise exception 'No tenant context';
    end if;
    -- Simulate "only own tenant": reject a reserved foreign marker.
    if p_stripe_customer_id = 'FOREIGN_TENANT_ATTACK' then
      raise exception 'No tenant context';
    end if;
  end if;
  insert into public._payment_security_test_calls(fn, caller_role)
  values (
    'register_trial_payment_method',
    coalesce(current_setting('request.jwt.claim.role', true), current_user)
  );
  return jsonb_build_object('status', 'trial_active', 'stub', true);
end;
$$;

-- Production-like leaky grants (pre-fix).
grant execute on function public.handle_payment_webhook_event(text, text, jsonb, uuid) to public, anon, authenticated, service_role;
grant execute on function public.register_trial_payment_method(text) to public, anon, authenticated, service_role;
