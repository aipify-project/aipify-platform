-- Phase 443 — Real-World Actions & Execution Engine (Customer App)
-- Route: /app/actions

create table if not exists public.real_world_actions_execution_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  actions_enabled boolean not null default true,
  restricted_categories jsonb not null default '[]'::jsonb,
  restricted_providers jsonb not null default '[]'::jsonb,
  multi_level_approvals_required boolean not null default false,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.real_world_actions_execution_section_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  section_key text not null check (section_key in (
    'available_actions', 'pending_actions', 'approved_actions',
    'completed_actions', 'failed_actions', 'action_history'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  metric_label text not null default '',
  metric_value text not null default '',
  status_key text not null default 'information' check (status_key in (
    'completed', 'requires_attention', 'waiting', 'information', 'restricted', 'verified', 'not_allowed'
  )),
  updated_at timestamptz not null default now()
);

create index if not exists real_world_actions_execution_sections_org_idx
  on public.real_world_actions_execution_section_items (organization_id, section_key);

create table if not exists public.real_world_actions_execution_registry (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  action_name text not null,
  action_category text not null check (action_category in (
    'personal', 'business', 'customer', 'operations', 'travel', 'commerce', 'support', 'administrative'
  )),
  provider_name text not null default '',
  risk_level text not null default 'medium' check (risk_level in ('low', 'medium', 'high')),
  approval_required boolean not null default true,
  status_key text not null default 'verified',
  updated_at timestamptz not null default now()
);

create index if not exists real_world_actions_execution_registry_org_idx
  on public.real_world_actions_execution_registry (organization_id, action_category, risk_level);

create table if not exists public.real_world_actions_execution_instances (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  action_name text not null,
  action_category text not null default 'business',
  provider_name text not null default '',
  risk_level text not null default 'medium',
  execution_stage text not null default 'request' check (execution_stage in (
    'request', 'validation', 'approval', 'execution', 'confirmation', 'completed', 'failed'
  )),
  owner_name text not null default '',
  cost_label text not null default '',
  result_label text not null default '',
  status_key text not null default 'waiting',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists real_world_actions_execution_instances_org_idx
  on public.real_world_actions_execution_instances (organization_id, execution_stage, status_key);

create table if not exists public.real_world_actions_execution_providers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  provider_key text not null,
  provider_name text not null,
  provider_type text not null check (provider_type in (
    'taxi', 'food', 'flower', 'travel', 'commerce', 'business_service', 'general'
  )),
  health_label text not null default 'Healthy',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now(),
  unique (organization_id, provider_key)
);

create index if not exists real_world_actions_execution_providers_org_idx
  on public.real_world_actions_execution_providers (organization_id, provider_type);

create table if not exists public.real_world_actions_execution_companion (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  request_type text not null check (request_type in (
    'order_flowers', 'book_taxi', 'schedule_meeting', 'send_proposal', 'place_order', 'travel_booking'
  )),
  request_text text not null,
  explanation text not null default '' check (char_length(explanation) <= 500),
  cost_label text not null default '',
  risk_level text not null default 'medium',
  approval_required boolean not null default true,
  status text not null default 'open' check (status in ('open', 'acknowledged', 'dismissed', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists real_world_actions_execution_companion_org_idx
  on public.real_world_actions_execution_companion (organization_id, status);

create table if not exists public.real_world_actions_execution_history (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  action_name text not null,
  user_name text not null default '',
  executed_at_label text not null default '',
  result_label text not null default '',
  status_key text not null default 'completed',
  created_at timestamptz not null default now()
);

create index if not exists real_world_actions_execution_history_org_idx
  on public.real_world_actions_execution_history (organization_id, created_at desc);

create table if not exists public.real_world_actions_execution_executive_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null check (metric_key in (
    'actions_completed', 'actions_pending', 'approvals_waiting', 'execution_success_rate', 'provider_health'
  )),
  metric_value text not null default '',
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, metric_key)
);

create table if not exists public.real_world_actions_execution_audit (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  item_type text not null,
  item_id uuid,
  action text not null,
  description text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists real_world_actions_execution_audit_org_idx
  on public.real_world_actions_execution_audit (organization_id, created_at desc);

alter table public.real_world_actions_execution_settings enable row level security;
alter table public.real_world_actions_execution_section_items enable row level security;
alter table public.real_world_actions_execution_registry enable row level security;
alter table public.real_world_actions_execution_instances enable row level security;
alter table public.real_world_actions_execution_providers enable row level security;
alter table public.real_world_actions_execution_companion enable row level security;
alter table public.real_world_actions_execution_history enable row level security;
alter table public.real_world_actions_execution_executive_metrics enable row level security;
alter table public.real_world_actions_execution_audit enable row level security;
revoke all on public.real_world_actions_execution_settings from authenticated, anon;
revoke all on public.real_world_actions_execution_section_items from authenticated, anon;
revoke all on public.real_world_actions_execution_registry from authenticated, anon;
revoke all on public.real_world_actions_execution_instances from authenticated, anon;
revoke all on public.real_world_actions_execution_providers from authenticated, anon;
revoke all on public.real_world_actions_execution_companion from authenticated, anon;
revoke all on public.real_world_actions_execution_history from authenticated, anon;
revoke all on public.real_world_actions_execution_executive_metrics from authenticated, anon;
revoke all on public.real_world_actions_execution_audit from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'real_world_actions_execution_center', v.description
from (values
  ('real_world_actions_execution.view', 'View Real-World Actions Center', 'View action registry, execution workflow, approvals, and action history'),
  ('real_world_actions_execution.manage', 'Manage Real-World Actions Center', 'Approve, reject, and manage real-world action requests')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'real_world_actions_execution.view'), ('owner', 'real_world_actions_execution.manage'),
  ('administrator', 'real_world_actions_execution.view'), ('administrator', 'real_world_actions_execution.manage'),
  ('manager', 'real_world_actions_execution.view'), ('manager', 'real_world_actions_execution.manage'),
  ('employee', 'real_world_actions_execution.view'),
  ('support_agent', 'real_world_actions_execution.view'),
  ('moderator', 'real_world_actions_execution.view'),
  ('viewer', 'real_world_actions_execution.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._rwe443_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'user_id', v_user_id,
    'can_executive', public._irp_has_permission('real_world_actions_execution.manage', v_org_id),
    'can_manage', public._irp_has_permission('real_world_actions_execution.manage', v_org_id),
    'can_view', public._irp_has_permission('real_world_actions_execution.view', v_org_id)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', 'Access denied');
end; $$;

create or replace function public._rwe443_log(
  p_org_id uuid, p_user_id uuid, p_item_type text, p_item_id uuid, p_action text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.real_world_actions_execution_audit
    (organization_id, user_id, item_type, item_id, action, description)
  values (p_org_id, p_user_id, p_item_type, p_item_id, p_action, left(p_desc, 500));
end; $$;

create or replace function public._rwe443_section_json(s public.real_world_actions_execution_section_items)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', s.id, 'title', s.title, 'summary', s.summary,
    'metric_label', s.metric_label, 'metric_value', s.metric_value,
    'status_key', s.status_key, 'section_key', s.section_key, 'item_type', 'section'
  );
$$;

create or replace function public._rwe443_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.real_world_actions_execution_settings (organization_id)
  values (p_org_id) on conflict do nothing;

  if exists (select 1 from public.real_world_actions_execution_registry where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.real_world_actions_execution_section_items
    (organization_id, section_key, title, summary, metric_label, metric_value, status_key)
  values
    (p_org_id, 'available_actions', 'Available actions', 'Approved real-world actions ready to request through integrations and providers.', 'Catalog', '14', 'verified'),
    (p_org_id, 'pending_actions', 'Pending actions', 'Actions awaiting validation or approval before execution.', 'Pending', '5', 'waiting'),
    (p_org_id, 'approved_actions', 'Approved actions', 'Actions approved and queued for execution.', 'Approved', '3', 'verified'),
    (p_org_id, 'completed_actions', 'Completed actions', 'Successfully executed actions with confirmation records.', 'Completed', '28', 'completed'),
    (p_org_id, 'failed_actions', 'Failed actions', 'Actions that failed execution or were declined.', 'Failed', '2', 'not_allowed'),
    (p_org_id, 'action_history', 'Action history', 'Full audit trail of real-world actions with owner, timestamp, and result.', 'History', '33', 'information');

  insert into public.real_world_actions_execution_registry
    (organization_id, action_name, action_category, provider_name, risk_level, approval_required, status_key)
  values
    (p_org_id, 'Taxi Booking', 'travel', 'Regional Taxi Network', 'low', false, 'verified'),
    (p_org_id, 'Flower Delivery', 'customer', 'Local Florist Partner', 'medium', true, 'verified'),
    (p_org_id, 'Food Ordering', 'personal', 'Food Delivery Partner', 'medium', true, 'verified'),
    (p_org_id, 'Meeting Scheduling', 'business', 'Calendar Integration', 'low', false, 'verified'),
    (p_org_id, 'Travel Booking', 'travel', 'Travel Provider', 'high', true, 'verified'),
    (p_org_id, 'Vendor Request', 'operations', 'Business Service Provider', 'medium', true, 'verified'),
    (p_org_id, 'Customer Follow-Up', 'customer', 'CRM Integration', 'low', false, 'verified'),
    (p_org_id, 'Send Customer Proposal', 'commerce', 'Document Service', 'medium', true, 'verified'),
    (p_org_id, 'Place Order', 'commerce', 'Commerce Provider', 'high', true, 'requires_attention'),
    (p_org_id, 'Execute Payment', 'administrative', 'Finance Integration', 'high', true, 'restricted'),
    (p_org_id, 'Sign Agreement', 'administrative', 'Contract Service', 'high', true, 'restricted');

  insert into public.real_world_actions_execution_instances
    (organization_id, action_name, action_category, provider_name, risk_level, execution_stage, owner_name, cost_label, result_label, status_key)
  values
    (p_org_id, 'Flower Delivery — Acme Corp', 'customer', 'Local Florist Partner', 'medium', 'approval', 'Account Manager', 'NOK 890', '', 'waiting'),
    (p_org_id, 'Taxi to Airport — Executive', 'travel', 'Regional Taxi Network', 'low', 'execution', 'Operations', 'NOK 450', '', 'verified'),
    (p_org_id, 'Send Approved Proposal', 'commerce', 'Document Service', 'medium', 'approved', 'Sales Lead', '—', '', 'verified'),
    (p_org_id, 'Vendor Maintenance Request', 'operations', 'Business Service Provider', 'medium', 'validation', 'Facilities', 'NOK 2,400', '', 'waiting'),
    (p_org_id, 'Travel Booking — Conference', 'travel', 'Travel Provider', 'high', 'approval', 'Finance', 'NOK 12,500', '', 'requires_attention'),
    (p_org_id, 'Customer Follow-Up Email', 'customer', 'CRM Integration', 'low', 'completed', 'Success Team', '—', 'Delivered', 'completed'),
    (p_org_id, 'Food Order — Team Lunch', 'personal', 'Food Delivery Partner', 'medium', 'failed', 'Office Manager', 'NOK 1,200', 'Provider unavailable', 'not_allowed'),
    (p_org_id, 'Execute Payment — Vendor', 'administrative', 'Finance Integration', 'high', 'failed', 'Finance', 'NOK 45,000', 'Payment declined', 'not_allowed');

  insert into public.real_world_actions_execution_providers
    (organization_id, provider_key, provider_name, provider_type, health_label, status_key)
  values
    (p_org_id, 'taxi_regional', 'Regional Taxi Network', 'taxi', 'Healthy — 98% availability', 'verified'),
    (p_org_id, 'food_delivery', 'Food Delivery Partner', 'food', 'Limited — peak hours', 'requires_attention'),
    (p_org_id, 'florist_local', 'Local Florist Partner', 'flower', 'Healthy — same-day delivery', 'verified'),
    (p_org_id, 'travel_global', 'Travel Provider', 'travel', 'Healthy — enterprise tier', 'verified'),
    (p_org_id, 'commerce_pack', 'Commerce Provider', 'commerce', 'Healthy — API connected', 'verified'),
    (p_org_id, 'business_services', 'Business Service Provider', 'business_service', 'Healthy — SLA met', 'verified');

  insert into public.real_world_actions_execution_companion
    (organization_id, request_type, request_text, explanation, cost_label, risk_level, approval_required)
  values
    (p_org_id, 'order_flowers', 'Order flowers for the customer.', 'Acme Corp onboarding milestone — thoughtful follow-up strengthens relationship.', 'NOK 890', 'medium', true),
    (p_org_id, 'book_taxi', 'Book a taxi to the airport.', 'Executive departure in 3 hours — pre-approved travel policy applies.', 'NOK 450', 'low', false),
    (p_org_id, 'schedule_meeting', 'Schedule a review meeting.', 'Success review due after onboarding completion — calendar slots available tomorrow.', '—', 'low', false),
    (p_org_id, 'send_proposal', 'Send the approved proposal.', 'Proposal approved by finance — ready for customer delivery.', '—', 'medium', true),
    (p_org_id, 'travel_booking', 'Book conference travel.', 'High-value travel requires finance approval before execution.', 'NOK 12,500', 'high', true);

  insert into public.real_world_actions_execution_history
    (organization_id, action_name, user_name, executed_at_label, result_label, status_key)
  values
    (p_org_id, 'Taxi booked', 'Operations Lead', 'Today 08:15', 'Confirmation #TX-4821', 'completed'),
    (p_org_id, 'Flowers delivered', 'Account Manager', 'Yesterday 14:30', 'Delivered to Acme Corp', 'completed'),
    (p_org_id, 'Meeting scheduled', 'Success Team', 'Yesterday 11:00', 'Review meeting booked', 'completed'),
    (p_org_id, 'Provider unavailable', 'Office Manager', '2 days ago', 'Food provider offline during peak', 'requires_attention'),
    (p_org_id, 'Payment declined', 'Finance', '3 days ago', 'Insufficient approval limit', 'not_allowed'),
    (p_org_id, 'Proposal sent', 'Sales Lead', '4 days ago', 'Delivered via secure link', 'completed');

  insert into public.real_world_actions_execution_executive_metrics
    (organization_id, metric_key, metric_value, trend_label, status_key)
  values
    (p_org_id, 'actions_completed', '28', '6 this week', 'completed'),
    (p_org_id, 'actions_pending', '5', '2 high risk', 'waiting'),
    (p_org_id, 'approvals_waiting', '4', '1 overdue', 'requires_attention'),
    (p_org_id, 'execution_success_rate', '93%', 'Down 2% — provider issues', 'requires_attention'),
    (p_org_id, 'provider_health', '5/6 healthy', 'Food delivery limited', 'verified');
end; $$;

create or replace function public.get_real_world_actions_execution_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_settings jsonb;
  v_available_s jsonb; v_pending_s jsonb; v_approved_s jsonb;
  v_completed_s jsonb; v_failed_s jsonb; v_history_s jsonb;
  v_registry jsonb; v_pending jsonb; v_approved jsonb; v_completed jsonb; v_failed jsonb;
  v_providers jsonb; v_history jsonb; v_companion jsonb; v_exec jsonb;
begin
  perform public._irp_require_permission('real_world_actions_execution.view');
  v_ctx := public._rwe443_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', coalesce(v_ctx->>'error', 'Access denied'));
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  perform public._rwe443_seed(v_org_id);

  select jsonb_build_object(
    'actions_enabled', s.actions_enabled,
    'multi_level_approvals_required', s.multi_level_approvals_required,
    'restricted_categories', s.restricted_categories,
    'restricted_providers', s.restricted_providers
  ) into v_settings
  from public.real_world_actions_execution_settings s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(public._rwe443_section_json(s)), '[]'::jsonb) into v_available_s
  from public.real_world_actions_execution_section_items s where s.organization_id = v_org_id and s.section_key = 'available_actions';
  select coalesce(jsonb_agg(public._rwe443_section_json(s)), '[]'::jsonb) into v_pending_s
  from public.real_world_actions_execution_section_items s where s.organization_id = v_org_id and s.section_key = 'pending_actions';
  select coalesce(jsonb_agg(public._rwe443_section_json(s)), '[]'::jsonb) into v_approved_s
  from public.real_world_actions_execution_section_items s where s.organization_id = v_org_id and s.section_key = 'approved_actions';
  select coalesce(jsonb_agg(public._rwe443_section_json(s)), '[]'::jsonb) into v_completed_s
  from public.real_world_actions_execution_section_items s where s.organization_id = v_org_id and s.section_key = 'completed_actions';
  select coalesce(jsonb_agg(public._rwe443_section_json(s)), '[]'::jsonb) into v_failed_s
  from public.real_world_actions_execution_section_items s where s.organization_id = v_org_id and s.section_key = 'failed_actions';
  select coalesce(jsonb_agg(public._rwe443_section_json(s)), '[]'::jsonb) into v_history_s
  from public.real_world_actions_execution_section_items s where s.organization_id = v_org_id and s.section_key = 'action_history';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'action_name', r.action_name, 'action_category', r.action_category,
    'provider_name', r.provider_name, 'risk_level', r.risk_level,
    'approval_required', r.approval_required, 'status_key', r.status_key, 'item_type', 'registry'
  ) order by case r.risk_level when 'high' then 1 when 'medium' then 2 else 3 end), '[]'::jsonb)
  into v_registry from public.real_world_actions_execution_registry r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'action_name', i.action_name, 'action_category', i.action_category,
    'provider_name', i.provider_name, 'risk_level', i.risk_level, 'execution_stage', i.execution_stage,
    'owner_name', i.owner_name, 'cost_label', i.cost_label, 'result_label', i.result_label,
    'status_key', i.status_key, 'item_type', 'instance'
  ) order by i.updated_at desc), '[]'::jsonb)
  into v_pending from public.real_world_actions_execution_instances i
  where i.organization_id = v_org_id and i.execution_stage in ('request', 'validation', 'approval');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'action_name', i.action_name, 'action_category', i.action_category,
    'provider_name', i.provider_name, 'risk_level', i.risk_level, 'execution_stage', i.execution_stage,
    'owner_name', i.owner_name, 'cost_label', i.cost_label, 'result_label', i.result_label,
    'status_key', i.status_key, 'item_type', 'instance'
  ) order by i.updated_at desc), '[]'::jsonb)
  into v_approved from public.real_world_actions_execution_instances i
  where i.organization_id = v_org_id and i.execution_stage = 'approved';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'action_name', i.action_name, 'action_category', i.action_category,
    'provider_name', i.provider_name, 'risk_level', i.risk_level, 'execution_stage', i.execution_stage,
    'owner_name', i.owner_name, 'cost_label', i.cost_label, 'result_label', i.result_label,
    'status_key', i.status_key, 'item_type', 'instance'
  ) order by i.updated_at desc), '[]'::jsonb)
  into v_completed from public.real_world_actions_execution_instances i
  where i.organization_id = v_org_id and i.execution_stage = 'completed';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'action_name', i.action_name, 'action_category', i.action_category,
    'provider_name', i.provider_name, 'risk_level', i.risk_level, 'execution_stage', i.execution_stage,
    'owner_name', i.owner_name, 'cost_label', i.cost_label, 'result_label', i.result_label,
    'status_key', i.status_key, 'item_type', 'instance'
  ) order by i.updated_at desc), '[]'::jsonb)
  into v_failed from public.real_world_actions_execution_instances i
  where i.organization_id = v_org_id and i.execution_stage = 'failed';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'provider_key', p.provider_key, 'provider_name', p.provider_name,
    'provider_type', p.provider_type, 'health_label', p.health_label,
    'status_key', p.status_key, 'item_type', 'provider'
  ) order by p.provider_name), '[]'::jsonb)
  into v_providers from public.real_world_actions_execution_providers p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', h.id, 'action_name', h.action_name, 'user_name', h.user_name,
    'executed_at_label', h.executed_at_label, 'result_label', h.result_label,
    'status_key', h.status_key, 'item_type', 'history'
  ) order by h.created_at desc), '[]'::jsonb)
  into v_history from public.real_world_actions_execution_history h where h.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'request_type', c.request_type, 'request_text', c.request_text,
    'explanation', c.explanation, 'cost_label', c.cost_label, 'risk_level', c.risk_level,
    'approval_required', c.approval_required, 'status', c.status, 'item_type', 'companion'
  ) order by c.created_at desc), '[]'::jsonb)
  into v_companion from public.real_world_actions_execution_companion c
  where c.organization_id = v_org_id and c.status = 'open';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'metric_key', e.metric_key, 'metric_value', e.metric_value,
    'trend_label', e.trend_label, 'status_key', e.status_key, 'item_type', 'executive'
  ) order by case e.metric_key
    when 'actions_completed' then 1 when 'actions_pending' then 2 when 'approvals_waiting' then 3
    when 'execution_success_rate' then 4 else 5 end), '[]'::jsonb)
  into v_exec from public.real_world_actions_execution_executive_metrics e where e.organization_id = v_org_id;

  return jsonb_build_object(
    'found', true,
    'philosophy', 'Understanding is valuable. Execution creates results. Aipify coordinates approved real-world actions through integrations, workflows, approvals, and governance.',
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'governance_note', 'Every action requires audit log, owner, timestamp, approval record, and execution result. Sensitive actions require explicit approval.',
    'execution_workflow', 'Request → Validation → Approval → Execution → Confirmation → Audit Logging',
    'enterprise_controls', coalesce(v_settings, '{}'::jsonb),
    'executive_dashboard', v_exec,
    'action_registry', v_registry,
    'pending_actions', v_pending,
    'approved_actions', v_approved,
    'completed_actions', v_completed,
    'failed_actions', v_failed,
    'action_providers', v_providers,
    'action_history', v_history,
    'companion_requests', v_companion,
    'sections', jsonb_build_object(
      'available_actions', v_available_s,
      'pending_actions', v_pending_s,
      'approved_actions', v_approved_s,
      'completed_actions', v_completed_s,
      'failed_actions', v_failed_s,
      'action_history', v_history_s
    ),
    'statistics', jsonb_build_object(
      'registry_count', jsonb_array_length(v_registry),
      'pending_count', jsonb_array_length(v_pending),
      'approved_count', jsonb_array_length(v_approved),
      'completed_count', jsonb_array_length(v_completed),
      'failed_count', jsonb_array_length(v_failed),
      'provider_count', jsonb_array_length(v_providers),
      'companion_count', jsonb_array_length(v_companion)
    ),
    'privacy_note', 'Action metadata and outcomes only — no raw payment details, personal messages, or provider credentials stored in Actions Center.'
  );
end; $$;

create or replace function public.manage_real_world_actions_execution_item(
  p_item_type text,
  p_item_id uuid default null,
  p_action text default 'acknowledge',
  p_payload jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid;
begin
  v_ctx := public._rwe443_access();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Not authorized';
  end if;
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if p_action not in ('acknowledge', 'dismiss', 'approve', 'reject', 'escalate') then
    raise exception 'Invalid action';
  end if;

  if p_item_type = 'companion' and p_item_id is not null then
    update public.real_world_actions_execution_companion set
      status = case p_action
        when 'acknowledge' then 'acknowledged'
        when 'dismiss' then 'dismissed'
        when 'approve' then 'approved'
        when 'reject' then 'rejected'
        else status
      end
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'instance' and p_item_id is not null then
    update public.real_world_actions_execution_instances set
      execution_stage = case p_action
        when 'approve' then 'approved'
        when 'reject' then 'failed'
        when 'escalate' then 'approval'
        else execution_stage
      end,
      status_key = case p_action
        when 'approve' then 'verified'
        when 'reject' then 'not_allowed'
        when 'escalate' then 'requires_attention'
        else status_key
      end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  end if;

  perform public._rwe443_log(v_org_id, v_user_id, p_item_type, p_item_id, p_action, 'Real-world action item updated');
  return jsonb_build_object('ok', true, 'action', p_action);
end; $$;

grant execute on function public.get_real_world_actions_execution_center() to authenticated;
grant execute on function public.manage_real_world_actions_execution_item(text, uuid, text, jsonb) to authenticated;
