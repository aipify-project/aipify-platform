-- Phase 19 — Trust Architecture & Data Ownership Foundation

-- ---------------------------------------------------------------------------
-- 1. Immutable trust audit log (sensitive operations)
-- ---------------------------------------------------------------------------
create table if not exists public.trust_audit_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  installation_id uuid references public.installations (id) on delete set null,
  user_id uuid references auth.users (id) on delete set null,
  skill_id text,
  action text not null,
  reason text,
  approval_source text,
  outcome text not null default 'pending',
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.trust_audit_events
  drop constraint if exists trust_audit_events_outcome_check;

alter table public.trust_audit_events
  add constraint trust_audit_events_outcome_check check (
    outcome in ('success', 'failure', 'blocked', 'pending')
  );

alter table public.trust_audit_events enable row level security;
revoke all on public.trust_audit_events from authenticated, anon;

create index if not exists trust_audit_events_tenant_id_idx
  on public.trust_audit_events (tenant_id, created_at desc);

-- Prevent updates/deletes — immutable audit trail
create or replace function public._trust_audit_immutable()
returns trigger
language plpgsql
as $$
begin
  raise exception 'Trust audit events are immutable';
end;
$$;

drop trigger if exists trust_audit_events_immutable on public.trust_audit_events;
create trigger trust_audit_events_immutable
  before update or delete on public.trust_audit_events
  for each row execute function public._trust_audit_immutable();

-- ---------------------------------------------------------------------------
-- 2. Record trust audit event
-- ---------------------------------------------------------------------------
create or replace function public.record_trust_audit_event(
  p_tenant_id uuid,
  p_action text,
  p_outcome text default 'pending',
  p_skill_id text default null,
  p_reason text default null,
  p_approval_source text default null,
  p_installation_id uuid default null,
  p_details jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if p_outcome not in ('success', 'failure', 'blocked', 'pending') then
    raise exception 'Invalid audit outcome';
  end if;

  insert into public.trust_audit_events (
    tenant_id,
    installation_id,
    user_id,
    skill_id,
    action,
    reason,
    approval_source,
    outcome,
    details
  )
  values (
    p_tenant_id,
    p_installation_id,
    auth.uid(),
    p_skill_id,
    p_action,
    p_reason,
    p_approval_source,
    p_outcome,
    coalesce(p_details, '{}'::jsonb)
  )
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.record_trust_audit_event(uuid, text, text, text, text, text, uuid, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Customer security dashboard overview
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_security_overview()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_company_id uuid;
  v_systems jsonb;
  v_domains jsonb;
  v_actions jsonb;
  v_token_health text := 'healthy';
  v_installation_count int;
  v_warning_count int;
begin
  select c.id, c.company_id
  into v_customer_id, v_company_id
  from public.customers c
  join public.company_users cu on cu.company_id = c.company_id
  where cu.auth_user_id = auth.uid()
  limit 1;

  if v_customer_id is null then
    raise exception 'Customer not found';
  end if;

  select coalesce(jsonb_agg(row_to_json(s)::jsonb), '[]'::jsonb) into v_systems
  from (
    select distinct
      ii.integration_key as key,
      ii.status,
      'read'::text as permission
    from public.installation_integrations ii
    join public.installations i on i.id = ii.installation_id
    where i.customer_id = v_customer_id
      and i.status not in ('archived')
  ) s;

  select coalesce(jsonb_agg(cd.domain), '[]'::jsonb) into v_domains
  from public.customer_domains cd
  where cd.customer_id = v_customer_id
    and cd.status = 'active';

  select coalesce(jsonb_agg(row_to_json(a)::jsonb order by a.created_at desc), '[]'::jsonb)
  into v_actions
  from (
    select id, action, skill_id, outcome, reason, approval_source, created_at
    from public.trust_audit_events
    where tenant_id = v_customer_id
    order by created_at desc
    limit 25
  ) a;

  select count(*)::int, count(*) filter (where status in ('warning', 'failed'))::int
  into v_installation_count, v_warning_count
  from public.installations i
  where i.customer_id = v_customer_id
    and i.status not in ('archived');

  if v_warning_count > 0 then
    v_token_health := 'warning';
  elsif v_installation_count = 0 then
    v_token_health := 'critical';
  end if;

  return jsonb_build_object(
    'connected_systems', v_systems,
    'registered_domains', v_domains,
    'permission_scope', 'metadata',
    'recent_actions', v_actions,
    'token_health', v_token_health,
    'principles', jsonb_build_array(
      'Your operational data remains under your control.',
      'Aipify stores intelligence, not ownership of your business.',
      'Permissions are transparent and revocable.',
      'Sensitive actions require approval.'
    )
  );
end;
$$;

grant execute on function public.get_customer_security_overview() to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Platform trust governance summary (no customer operational data)
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_trust_governance()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_audit_count int;
  v_tenant_count int;
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  select count(*)::int into v_audit_count from public.trust_audit_events;
  select count(distinct tenant_id)::int into v_tenant_count from public.trust_audit_events;

  return jsonb_build_object(
    'audit_event_count', v_audit_count,
    'tenants_with_audit_events', v_tenant_count,
    'default_access_level', 'metadata',
    'platform_responsibility',
    'Platform Admin manages installation status, subscription validity, skill availability, and update schedules — never browses customer operational data unnecessarily.'
  );
end;
$$;

grant execute on function public.get_platform_trust_governance() to authenticated;
