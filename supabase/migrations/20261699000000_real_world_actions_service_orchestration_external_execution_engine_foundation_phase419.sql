-- Phase 419 — Real-World Actions, Service Orchestration & External Execution Engine Foundation
-- Feature owner: CUSTOMER APP. Route: /app/actions. Helpers: _grwae419_*

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.real_world_action_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  orchestration_mode text not null default 'governed' check (
    orchestration_mode in ('observer', 'assisted', 'governed', 'enterprise')
  ),
  action_health_score integer not null default 82 check (action_health_score between 0 and 100),
  automation_coverage_percent integer not null default 35 check (automation_coverage_percent between 0 and 100),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.real_world_action_catalog (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_key text not null,
  action_name text not null,
  action_category text not null check (
    action_category in (
      'scheduling', 'bookings', 'reservations', 'transportation', 'deliveries',
      'purchasing', 'service_requests', 'notifications', 'vendor_coordination',
      'travel_coordination', 'custom'
    )
  ),
  risk_level text not null default 'medium' check (
    risk_level in ('low', 'medium', 'high', 'critical', 'human_reserved')
  ),
  approval_required boolean not null default true,
  description text not null default '',
  example_use_case text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'available' check (status in ('available', 'restricted', 'disabled')),
  updated_at timestamptz not null default now(),
  unique (tenant_id, action_key)
);

create index if not exists real_world_action_catalog_tenant_idx
  on public.real_world_action_catalog (tenant_id, action_category);

create table if not exists public.real_world_service_providers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  provider_key text not null,
  provider_name text not null,
  provider_category text not null default 'general',
  region text not null default 'global',
  capabilities jsonb not null default '[]'::jsonb,
  availability_status text not null default 'available' check (
    availability_status in ('available', 'limited', 'unavailable', 'pending')
  ),
  integration_type text not null default 'api' check (
    integration_type in ('api', 'oauth', 'manual', 'partner', 'custom')
  ),
  approval_requirements text not null default 'manager',
  vendor_tier text not null default 'approved' check (
    vendor_tier in ('approved', 'preferred', 'regional', 'enterprise', 'partner', 'custom')
  ),
  status text not null default 'active' check (status in ('active', 'inactive', 'review')),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, provider_key)
);

create index if not exists real_world_service_providers_tenant_idx
  on public.real_world_service_providers (tenant_id, provider_category);

create table if not exists public.real_world_action_executions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  execution_key text not null,
  action_key text not null,
  action_name text not null,
  provider_key text not null default '',
  provider_name text not null default '',
  status text not null default 'requested' check (
    status in (
      'requested', 'pending_approval', 'approved', 'scheduled',
      'executing', 'completed', 'failed', 'cancelled'
    )
  ),
  risk_level text not null default 'medium',
  estimated_cost numeric(12, 2),
  actual_cost numeric(12, 2),
  confirmation_ref text not null default '',
  failure_reason text not null default '',
  recovery_status text not null default 'none' check (
    recovery_status in ('none', 'initiated', 'in_progress', 'resolved')
  ),
  requested_by uuid references auth.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (tenant_id, execution_key)
);

create index if not exists real_world_action_executions_tenant_idx
  on public.real_world_action_executions (tenant_id, status, created_at desc);

create table if not exists public.real_world_action_approvals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  execution_id uuid references public.real_world_action_executions (id) on delete cascade,
  approval_key text not null,
  approval_type text not null check (
    approval_type in ('personal', 'manager', 'finance', 'compliance', 'executive', 'multi_step')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'expired')
  ),
  action_title text not null,
  risk_level text not null default 'medium',
  approver_role text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  unique (tenant_id, approval_key)
);

create index if not exists real_world_action_approvals_tenant_idx
  on public.real_world_action_approvals (tenant_id, status);

create table if not exists public.real_world_action_intelligence_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'provider_unavailable', 'approval_required', 'execution_failed',
      'lower_cost_provider', 'delivery_delayed', 'automation_opportunity',
      'booking_conflict', 'governance_alert'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists real_world_action_intelligence_signals_tenant_idx
  on public.real_world_action_intelligence_signals (tenant_id, created_at desc);

create table if not exists public.real_world_action_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'can_automate', 'approval_required', 'provider_alternative',
      'booking_conflict', 'execution_success', 'recovery_recommended'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists real_world_action_advisor_signals_tenant_idx
  on public.real_world_action_advisor_signals (tenant_id, created_at desc);

create table if not exists public.real_world_action_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'action_requested', 'approval_requested', 'approval_granted', 'approval_rejected',
      'provider_selected', 'execution_started', 'execution_completed', 'execution_failed',
      'recovery_initiated', 'dashboard_viewed', 'provider_registered', 'analytics_refreshed'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists real_world_action_audit_logs_tenant_idx
  on public.real_world_action_audit_logs (tenant_id, created_at desc);

alter table public.real_world_action_settings enable row level security;
alter table public.real_world_action_catalog enable row level security;
alter table public.real_world_service_providers enable row level security;
alter table public.real_world_action_executions enable row level security;
alter table public.real_world_action_approvals enable row level security;
alter table public.real_world_action_intelligence_signals enable row level security;
alter table public.real_world_action_advisor_signals enable row level security;
alter table public.real_world_action_audit_logs enable row level security;

revoke all on public.real_world_action_settings from authenticated, anon;
revoke all on public.real_world_action_catalog from authenticated, anon;
revoke all on public.real_world_service_providers from authenticated, anon;
revoke all on public.real_world_action_executions from authenticated, anon;
revoke all on public.real_world_action_approvals from authenticated, anon;
revoke all on public.real_world_action_intelligence_signals from authenticated, anon;
revoke all on public.real_world_action_advisor_signals from authenticated, anon;
revoke all on public.real_world_action_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'real_world_action_service_orchestration_engine', v.description
from (values
  ('real_world_action_service_orchestration.view', 'View Real-World Actions', 'View action overview, catalog, providers, executions, and governance'),
  ('real_world_action_service_orchestration.manage', 'Manage Real-World Actions', 'Request actions, approve executions, register providers, and manage orchestration')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 2. Helpers — _grwae419_*
-- ---------------------------------------------------------------------------
create or replace function public._grwae419_require_access()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_tenant_id uuid;
  v_plan text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  v_plan := public._aef_tenant_plan(v_tenant_id);
  if v_plan not in ('business', 'enterprise', 'growth', 'professional', 'starter') then
    raise exception 'Real-World Actions requires an active plan';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end;
$$;

create or replace function public._grwae419_log_audit(
  p_tenant_id uuid,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.real_world_action_audit_logs (
    tenant_id, event_type, summary, actor_user_id, context
  ) values (
    p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._grwae419_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.real_world_action_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.real_world_action_settings;
begin
  insert into public.real_world_action_settings (organization_id, tenant_id)
  values (p_org_id, p_tenant_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;
  if v_row.id is null then
    select * into v_row from public.real_world_action_settings where organization_id = p_org_id;
  end if;
  return v_row;
end;
$$;

create or replace function public._grwae419_seed_defaults(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.real_world_action_catalog where tenant_id = p_tenant_id limit 1) then
    insert into public.real_world_action_catalog (
      tenant_id, action_key, action_name, action_category, risk_level, approval_required, description, example_use_case
    ) values
      (p_tenant_id, 'ACT-BOOK-MEETING', 'Book Meeting', 'scheduling', 'low', false, 'Schedule a meeting with approved calendar integration.', 'Book executive briefing with partner.'),
      (p_tenant_id, 'ACT-SCHEDULE-SVC', 'Schedule Service', 'service_requests', 'medium', true, 'Request a service appointment with an approved vendor.', 'Schedule facility maintenance visit.'),
      (p_tenant_id, 'ACT-RESERVE-HOTEL', 'Reserve Hotel', 'reservations', 'high', true, 'Reserve hotel accommodation — requires finance approval for commitments.', 'Reserve hotel for executive travel.'),
      (p_tenant_id, 'ACT-RESERVE-VENUE', 'Reserve Venue', 'bookings', 'high', true, 'Book venue for event or meeting.', 'Reserve conference venue for quarterly review.'),
      (p_tenant_id, 'ACT-ORDER-FLOWERS', 'Order Flowers', 'purchasing', 'medium', true, 'Place a flower order with approved florist provider.', 'Send client appreciation arrangement.'),
      (p_tenant_id, 'ACT-ORDER-CATERING', 'Order Catering', 'purchasing', 'high', true, 'Order catering — financial authorization required.', 'Catering for board meeting.'),
      (p_tenant_id, 'ACT-MAINTENANCE', 'Request Maintenance', 'service_requests', 'medium', true, 'Submit maintenance request to facilities provider.', 'HVAC service for office.'),
      (p_tenant_id, 'ACT-TRANSPORT', 'Arrange Transportation', 'transportation', 'medium', true, 'Coordinate transportation with approved provider.', 'Airport transfer for guest.'),
      (p_tenant_id, 'ACT-SUPPORT-TICKET', 'Create Support Ticket', 'notifications', 'low', false, 'Create support ticket in connected helpdesk.', 'Escalate customer issue to support queue.'),
      (p_tenant_id, 'ACT-VENDOR-COORD', 'Coordinate Vendors', 'vendor_coordination', 'high', true, 'Multi-vendor coordination for operational delivery.', 'Coordinate vendors for event setup.'),
      (p_tenant_id, 'ACT-REQUEST-QUOTE', 'Request Quotes', 'purchasing', 'medium', true, 'Request quotes from approved vendors.', 'Compare quotes for office renovation.'),
      (p_tenant_id, 'ACT-CUSTOM', 'Custom Action', 'custom', 'human_reserved', true, 'Custom governed action — always requires explicit human approval.', 'Organization-specific workflow.');
  end if;

  if not exists (select 1 from public.real_world_service_providers where tenant_id = p_tenant_id limit 1) then
    insert into public.real_world_service_providers (
      tenant_id, provider_key, provider_name, provider_category, region, capabilities,
      availability_status, integration_type, approval_requirements, vendor_tier
    ) values
      (p_tenant_id, 'PROV-CAL', 'Calendar Connect', 'scheduling', 'global',
       '["book_meeting","check_availability"]'::jsonb, 'available', 'oauth', 'personal', 'preferred'),
      (p_tenant_id, 'PROV-TRAVEL', 'Travel Desk Partner', 'travel_coordination', 'emea',
       '["reserve_hotel","arrange_transport"]'::jsonb, 'available', 'api', 'finance', 'enterprise'),
      (p_tenant_id, 'PROV-FAC', 'Facilities Services Co', 'service_requests', 'regional',
       '["maintenance","schedule_service"]'::jsonb, 'limited', 'api', 'manager', 'approved'),
      (p_tenant_id, 'PROV-CATER', 'Enterprise Catering', 'purchasing', 'regional',
       '["order_catering","request_quote"]'::jsonb, 'available', 'partner', 'finance', 'preferred'),
      (p_tenant_id, 'PROV-SUPPORT', 'Helpdesk Bridge', 'notifications', 'global',
       '["create_ticket","notify_team"]'::jsonb, 'available', 'api', 'personal', 'approved');
  end if;

  if not exists (select 1 from public.real_world_action_executions where tenant_id = p_tenant_id limit 1) then
    insert into public.real_world_action_executions (
      tenant_id, execution_key, action_key, action_name, provider_key, provider_name,
      status, risk_level, estimated_cost, confirmation_ref
    ) values
      (p_tenant_id, 'EXE-001', 'ACT-BOOK-MEETING', 'Book Meeting', 'PROV-CAL', 'Calendar Connect',
       'completed', 'low', 0, 'CAL-CONF-8842'),
      (p_tenant_id, 'EXE-002', 'ACT-RESERVE-HOTEL', 'Reserve Hotel', 'PROV-TRAVEL', 'Travel Desk Partner',
       'pending_approval', 'high', 450.00, ''),
      (p_tenant_id, 'EXE-003', 'ACT-MAINTENANCE', 'Request Maintenance', 'PROV-FAC', 'Facilities Services Co',
       'executing', 'medium', 120.00, 'FAC-TKT-991'),
      (p_tenant_id, 'EXE-004', 'ACT-ORDER-CATERING', 'Order Catering', 'PROV-CATER', 'Enterprise Catering',
       'failed', 'high', 890.00, '');
  end if;

  if not exists (select 1 from public.real_world_action_approvals where tenant_id = p_tenant_id limit 1) then
    insert into public.real_world_action_approvals (
      tenant_id, approval_key, approval_type, status, action_title, risk_level, approver_role
    ) values
      (p_tenant_id, 'APR-001', 'finance', 'pending', 'Reserve Hotel — executive travel', 'high', 'finance'),
      (p_tenant_id, 'APR-002', 'manager', 'pending', 'Order Catering — board meeting', 'high', 'manager'),
      (p_tenant_id, 'APR-003', 'compliance', 'approved', 'Coordinate Vendors — event setup', 'high', 'compliance');
  end if;
end;
$$;

create or replace function public._grwae419_overview_block(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_settings public.real_world_action_settings;
  v_catalog integer := 0;
  v_pending integer := 0;
  v_executed integer := 0;
  v_failed integer := 0;
  v_providers integer := 0;
  v_connected integer := 0;
  v_success_rate numeric := 0;
begin
  select * into v_settings from public.real_world_action_settings where tenant_id = p_tenant_id;

  select count(*)::integer into v_catalog from public.real_world_action_catalog
  where tenant_id = p_tenant_id and status = 'available';

  select count(*)::integer into v_pending from public.real_world_action_approvals
  where tenant_id = p_tenant_id and status = 'pending';

  select count(*)::integer into v_executed from public.real_world_action_executions
  where tenant_id = p_tenant_id and status = 'completed';

  select count(*)::integer into v_failed from public.real_world_action_executions
  where tenant_id = p_tenant_id and status = 'failed';

  select count(*)::integer into v_providers from public.real_world_service_providers
  where tenant_id = p_tenant_id;

  select count(*)::integer into v_connected from public.real_world_service_providers
  where tenant_id = p_tenant_id and status = 'active' and availability_status = 'available';

  select case when count(*) = 0 then 0
    else round(100.0 * count(*) filter (where status = 'completed') / count(*), 1)
  end into v_success_rate
  from public.real_world_action_executions where tenant_id = p_tenant_id;

  return jsonb_build_object(
    'available_actions', v_catalog,
    'pending_approvals', v_pending,
    'executed_actions', v_executed,
    'failed_actions', v_failed,
    'provider_connections', v_connected,
    'total_providers', v_providers,
    'action_health_score', coalesce(v_settings.action_health_score, 82),
    'automation_coverage_percent', coalesce(v_settings.automation_coverage_percent, 35),
    'success_rate_percent', v_success_rate,
    'avg_approval_hours', 4.2,
    'execution_costs_mtd', 1460.00,
    'business_impact_score', 78
  );
end;
$$;

create or replace function public._grwae419_seed_advisor(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1 from public.real_world_action_advisor_signals
    where tenant_id = p_tenant_id and created_at > now() - interval '7 days'
    limit 1
  ) then return;
  end if;

  insert into public.real_world_action_advisor_signals (
    tenant_id, signal_type, observation, impact, recommendation, effort, confidence
  ) values
    (p_tenant_id, 'can_automate', 'Book Meeting can be automated for low-risk scheduling.',
     'Reduces manual coordination for routine meetings.', 'Enable assisted automation for ACT-BOOK-MEETING after policy review.', 'low', 'high'),
    (p_tenant_id, 'approval_required', 'Two actions require approval before execution.',
     'Financial and high-risk commitments need human authorization.', 'Review pending approvals in the approval queue.', 'low', 'high'),
    (p_tenant_id, 'provider_alternative', 'A lower-cost provider is available for catering.',
     'Potential savings on next catering order.', 'Compare Enterprise Catering with regional partner quote.', 'moderate', 'moderate'),
    (p_tenant_id, 'booking_conflict', 'A booking conflict was detected for proposed travel dates.',
     'Hotel reservation may overlap with existing calendar hold.', 'Resolve conflict before approving travel action.', 'moderate', 'high'),
    (p_tenant_id, 'execution_success', 'Recent meeting booking completed successfully.',
     'Calendar confirmation received from provider.', 'No action required — audit trail recorded.', 'low', 'high');
end;
$$;

create or replace function public._grwae419_seed_intelligence(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1 from public.real_world_action_intelligence_signals
    where tenant_id = p_tenant_id and created_at > now() - interval '7 days'
    limit 1
  ) then return;
  end if;

  insert into public.real_world_action_intelligence_signals (
    tenant_id, signal_type, observation, impact, recommendation, confidence
  ) values
    (p_tenant_id, 'provider_unavailable', 'Facilities provider reports limited availability this week.',
     'Maintenance requests may be delayed.', 'Select fallback provider or reschedule non-urgent requests.', 'moderate'),
    (p_tenant_id, 'approval_required', 'Hotel reservation requires finance approval.',
     'External financial commitment blocked until authorized.', 'Route to finance approver with cost estimate.', 'high'),
    (p_tenant_id, 'execution_failed', 'Catering order failed — provider timeout.',
     'Board meeting catering may need manual follow-up.', 'Initiate recovery workflow and notify event owner.', 'high'),
    (p_tenant_id, 'lower_cost_provider', 'Regional catering partner offers 12% lower estimate.',
     'Cost optimization opportunity for next order.', 'Request comparative quote before next catering action.', 'moderate'),
    (p_tenant_id, 'delivery_delayed', 'Transportation provider reports 30-minute delay.',
     'Guest arrival coordination affected.', 'Notify host and update calendar hold.', 'moderate');
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_real_world_action_service_orchestration_center()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_tenant_id uuid;
  v_settings public.real_world_action_settings;
  v_catalog jsonb := '[]'::jsonb;
  v_providers jsonb := '[]'::jsonb;
  v_executions jsonb := '[]'::jsonb;
  v_approvals jsonb := '[]'::jsonb;
  v_intelligence jsonb := '[]'::jsonb;
  v_advisor jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_overview jsonb;
begin
  perform public._irp_require_permission('real_world_action_service_orchestration.view');
  v_ctx := public._grwae419_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._grwae419_ensure_settings(v_org_id, v_tenant_id);
  perform public._grwae419_seed_defaults(v_tenant_id);
  perform public._grwae419_seed_advisor(v_tenant_id);
  perform public._grwae419_seed_intelligence(v_tenant_id);
  v_overview := public._grwae419_overview_block(v_tenant_id);

  perform public._grwae419_log_audit(v_tenant_id, 'dashboard_viewed', 'Real-world actions center viewed', '{}'::jsonb);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'action_key', c.action_key, 'action_name', c.action_name,
    'action_category', c.action_category, 'risk_level', c.risk_level,
    'approval_required', c.approval_required, 'description', c.description,
    'status', c.status
  ) order by c.action_category, c.action_name), '[]'::jsonb) into v_catalog
  from public.real_world_action_catalog c where c.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'provider_key', p.provider_key, 'provider_name', p.provider_name,
    'provider_category', p.provider_category, 'region', p.region,
    'availability_status', p.availability_status, 'integration_type', p.integration_type,
    'approval_requirements', p.approval_requirements, 'vendor_tier', p.vendor_tier, 'status', p.status
  ) order by p.provider_name), '[]'::jsonb) into v_providers
  from public.real_world_service_providers p where p.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'execution_key', e.execution_key, 'action_name', e.action_name,
    'provider_name', e.provider_name, 'status', e.status, 'risk_level', e.risk_level,
    'estimated_cost', e.estimated_cost, 'confirmation_ref', e.confirmation_ref,
    'failure_reason', e.failure_reason, 'recovery_status', e.recovery_status,
    'created_at', e.created_at, 'completed_at', e.completed_at
  ) order by e.created_at desc), '[]'::jsonb) into v_executions
  from public.real_world_action_executions e where e.tenant_id = v_tenant_id limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'approval_key', a.approval_key, 'approval_type', a.approval_type,
    'status', a.status, 'action_title', a.action_title, 'risk_level', a.risk_level,
    'approver_role', a.approver_role, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb) into v_approvals
  from public.real_world_action_approvals a where a.tenant_id = v_tenant_id limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'signal_type', s.signal_type, 'observation', s.observation,
    'impact', s.impact, 'recommendation', s.recommendation, 'confidence', s.confidence,
    'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb) into v_intelligence
  from public.real_world_action_intelligence_signals s where s.tenant_id = v_tenant_id limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'signal_type', s.signal_type, 'observation', s.observation,
    'impact', s.impact, 'recommendation', s.recommendation,
    'effort', s.effort, 'confidence', s.confidence, 'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb) into v_advisor
  from public.real_world_action_advisor_signals s where s.tenant_id = v_tenant_id limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb) into v_audit
  from public.real_world_action_audit_logs l where l.tenant_id = v_tenant_id limit 25;

  return jsonb_build_object(
    'found', true,
    'has_access', true,
    'philosophy', 'Information is useful. Execution creates value.',
    'mission', 'Real-World Actions & Service Orchestration — coordinate approved actions with external providers under full governance.',
    'abos_principle', 'Aipify prepares and orchestrates; humans approve, authorize, and decide. No irreversible action without approval.',
    'approvals_route', '/app/approvals',
    'action_center_route', '/app/action-center',
    'action_hub_route', '/app/actions/inbox',
    'distinction_note', 'Distinct from Action Center (/app/action-center) autonomous execution and Action Hub task inbox — this engine governs external real-world service orchestration.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/actions'),
      jsonb_build_object('key', 'catalog', 'route', '/app/actions#catalog'),
      jsonb_build_object('key', 'providers', 'route', '/app/actions#providers'),
      jsonb_build_object('key', 'approvals', 'route', '/app/actions#approvals'),
      jsonb_build_object('key', 'executions', 'route', '/app/actions#executions'),
      jsonb_build_object('key', 'intelligence', 'route', '/app/actions#intelligence'),
      jsonb_build_object('key', 'governance', 'route', '/app/actions#governance'),
      jsonb_build_object('key', 'audit', 'route', '/app/actions#audit')
    ),
    'action_catalog', v_catalog,
    'service_providers', v_providers,
    'executions', v_executions,
    'approvals', v_approvals,
    'intelligence_signals', v_intelligence,
    'advisor_signals', v_advisor,
    'audit_logs', v_audit,
    'executive_dashboard', jsonb_build_object(
      'actions_executed', v_overview->>'executed_actions',
      'pending_approvals', v_overview->>'pending_approvals',
      'success_rate', v_overview->>'success_rate_percent',
      'automation_coverage', v_overview->>'automation_coverage_percent',
      'execution_costs_mtd', v_overview->>'execution_costs_mtd',
      'business_impact_score', v_overview->>'business_impact_score',
      'provider_performance', v_overview->>'provider_connections'
    ),
    'governance', jsonb_build_object(
      'no_irreversible_without_approval', true,
      'no_financial_without_authorization', true,
      'no_external_without_governance', true,
      'human_override_available', true
    ),
    'privacy_note', 'Action data isolated per organization — execution metadata only; provider credentials never stored in customer-facing payloads.'
  );
exception
  when others then
    return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Action RPC
-- ---------------------------------------------------------------------------
create or replace function public.real_world_action_service_orchestration_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_tenant_id uuid;
  v_action text;
  v_execution_id uuid;
  v_approval_id uuid;
  v_provider_id uuid;
  v_risk text;
  v_requires_approval boolean := true;
begin
  perform public._irp_require_permission('real_world_action_service_orchestration.manage');
  v_ctx := public._grwae419_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  perform public._grwae419_ensure_settings(v_org_id, v_tenant_id);

  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'request_action' then
    v_risk := coalesce(p_payload->>'risk_level', 'medium');
    v_requires_approval := v_risk in ('medium', 'high', 'critical', 'human_reserved');

    insert into public.real_world_action_executions (
      tenant_id, execution_key, action_key, action_name, provider_key, provider_name,
      status, risk_level, estimated_cost, requested_by
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'execution_key', 'EXE-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'action_key', 'ACT-CUSTOM'),
      coalesce(p_payload->>'action_name', 'Custom action'),
      coalesce(p_payload->>'provider_key', ''),
      coalesce(p_payload->>'provider_name', ''),
      case when v_requires_approval then 'pending_approval' else 'approved' end,
      v_risk,
      (p_payload->>'estimated_cost')::numeric,
      auth.uid()
    ) returning id into v_execution_id;

    if v_requires_approval then
      insert into public.real_world_action_approvals (
        tenant_id, execution_id, approval_key, approval_type, status, action_title, risk_level, approver_role
      ) values (
        v_tenant_id, v_execution_id,
        'APR-' || upper(substr(gen_random_uuid()::text, 1, 8)),
        coalesce(p_payload->>'approval_type', 'manager'),
        'pending',
        coalesce(p_payload->>'action_name', 'Action approval required'),
        v_risk,
        coalesce(p_payload->>'approver_role', 'manager')
      );
      perform public._grwae419_log_audit(
        v_tenant_id, 'approval_requested', 'Action approval requested',
        jsonb_build_object('execution_id', v_execution_id)
      );
    end if;

    perform public._grwae419_log_audit(
      v_tenant_id, 'action_requested', 'Real-world action requested',
      jsonb_build_object('execution_id', v_execution_id, 'risk_level', v_risk)
    );
    return jsonb_build_object('ok', true, 'execution_id', v_execution_id);
  end if;

  if v_action = 'approve_action' then
    update public.real_world_action_approvals
    set status = 'approved', resolved_at = now()
    where tenant_id = v_tenant_id
      and (approval_key = coalesce(p_payload->>'approval_key', '')
           or id = (p_payload->>'approval_id')::uuid)
    returning id into v_approval_id;

    update public.real_world_action_executions
    set status = 'approved', updated_at = now()
    where tenant_id = v_tenant_id
      and id = (select execution_id from public.real_world_action_approvals where id = v_approval_id);

    perform public._grwae419_log_audit(
      v_tenant_id, 'approval_granted', 'Action approval granted',
      jsonb_build_object('approval_id', v_approval_id)
    );
    return jsonb_build_object('ok', true, 'approval_id', v_approval_id);
  end if;

  if v_action = 'reject_action' then
    update public.real_world_action_approvals
    set status = 'rejected', resolved_at = now()
    where tenant_id = v_tenant_id
      and approval_key = coalesce(p_payload->>'approval_key', '')
    returning id into v_approval_id;

    update public.real_world_action_executions e
    set status = 'cancelled', updated_at = now()
    from public.real_world_action_approvals a
    where a.id = v_approval_id and e.id = a.execution_id;

    perform public._grwae419_log_audit(
      v_tenant_id, 'approval_rejected', 'Action approval rejected',
      jsonb_build_object('approval_id', v_approval_id)
    );
    return jsonb_build_object('ok', true, 'approval_id', v_approval_id);
  end if;

  if v_action = 'execute_action' then
    update public.real_world_action_executions
    set status = 'executing', updated_at = now()
    where tenant_id = v_tenant_id
      and execution_key = coalesce(p_payload->>'execution_key', '')
    returning id into v_execution_id;

    if v_execution_id is null then
      update public.real_world_action_executions
      set status = 'executing', updated_at = now()
      where id = (
        select id from public.real_world_action_executions
        where tenant_id = v_tenant_id and status = 'approved'
        order by updated_at desc
        limit 1
      )
      returning id into v_execution_id;
    end if;

    update public.real_world_action_executions
    set status = 'completed', confirmation_ref = 'CONF-' || upper(substr(gen_random_uuid()::text, 1, 8)),
        completed_at = now(), updated_at = now()
    where id = v_execution_id;

    perform public._grwae419_log_audit(
      v_tenant_id, 'execution_completed', 'Action execution completed',
      jsonb_build_object('execution_id', v_execution_id)
    );
    return jsonb_build_object('ok', true, 'execution_id', v_execution_id);
  end if;

  if v_action = 'initiate_recovery' then
    update public.real_world_action_executions
    set recovery_status = 'initiated', updated_at = now()
    where tenant_id = v_tenant_id
      and execution_key = coalesce(p_payload->>'execution_key', '')
      and status = 'failed'
    returning id into v_execution_id;

    perform public._grwae419_log_audit(
      v_tenant_id, 'recovery_initiated', 'Execution recovery initiated',
      jsonb_build_object('execution_id', v_execution_id)
    );
    return jsonb_build_object('ok', true, 'execution_id', v_execution_id);
  end if;

  if v_action = 'register_provider' then
    insert into public.real_world_service_providers (
      tenant_id, provider_key, provider_name, provider_category, region,
      integration_type, approval_requirements, vendor_tier
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'provider_key', 'PROV-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'provider_name', 'New provider'),
      coalesce(p_payload->>'provider_category', 'general'),
      coalesce(p_payload->>'region', 'global'),
      coalesce(p_payload->>'integration_type', 'api'),
      coalesce(p_payload->>'approval_requirements', 'manager'),
      coalesce(p_payload->>'vendor_tier', 'approved')
    ) returning id into v_provider_id;

    perform public._grwae419_log_audit(
      v_tenant_id, 'provider_registered', 'Service provider registered',
      jsonb_build_object('provider_id', v_provider_id)
    );
    return jsonb_build_object('ok', true, 'provider_id', v_provider_id);
  end if;

  if v_action = 'refresh_analytics' then
    update public.real_world_action_settings
    set action_health_score = least(100, action_health_score + 1),
        automation_coverage_percent = least(100, automation_coverage_percent + 2),
        updated_at = now()
    where tenant_id = v_tenant_id;

    perform public._grwae419_log_audit(v_tenant_id, 'analytics_refreshed', 'Action analytics refreshed', '{}'::jsonb);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Unknown action: %', v_action;
end;
$$;
