-- Phase 51 — Organizational Intelligence Layer (OIL)

-- ---------------------------------------------------------------------------
-- 1. aipify_organizations
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_organizations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  name text not null,
  industry text,
  company_size text,
  default_language text not null default 'en',
  timezone text not null default 'Europe/Oslo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.aipify_organizations enable row level security;
revoke all on public.aipify_organizations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. aipify_organization_units
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_organization_units (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  organization_id uuid not null references public.aipify_organizations (id) on delete cascade,
  parent_unit_id uuid references public.aipify_organization_units (id) on delete set null,
  name text not null,
  unit_type text not null default 'department' check (
    unit_type in ('company', 'department', 'team', 'function', 'project')
  ),
  description text,
  manager_user_id uuid references public.users (id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aipify_organization_units_tenant_idx
  on public.aipify_organization_units (tenant_id, active);

alter table public.aipify_organization_units enable row level security;
revoke all on public.aipify_organization_units from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. aipify_responsibility_map
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_responsibility_map (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  organization_unit_id uuid references public.aipify_organization_units (id) on delete set null,
  user_id uuid references public.users (id) on delete set null,
  role_name text not null,
  responsibility_type text not null check (
    responsibility_type in (
      'approval', 'support_escalation', 'customer_followup', 'finance',
      'content_moderation', 'integration_owner', 'workflow_owner'
    )
  ),
  description text,
  priority int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aipify_responsibility_map_tenant_idx
  on public.aipify_responsibility_map (tenant_id, active);

alter table public.aipify_responsibility_map enable row level security;
revoke all on public.aipify_responsibility_map from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. aipify_workflow_definitions
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_workflow_definitions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  name text not null,
  workflow_key text not null,
  description text,
  category text not null default 'internal' check (
    category in (
      'support', 'sales', 'onboarding', 'moderation', 'ecommerce',
      'finance', 'marketing', 'internal'
    )
  ),
  expected_response_time_minutes int,
  expected_completion_time_minutes int,
  owner_unit_id uuid references public.aipify_organization_units (id) on delete set null,
  owner_user_id uuid references public.users (id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, workflow_key)
);

create index if not exists aipify_workflow_definitions_tenant_idx
  on public.aipify_workflow_definitions (tenant_id, active);

alter table public.aipify_workflow_definitions enable row level security;
revoke all on public.aipify_workflow_definitions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. aipify_workflow_events
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_workflow_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  workflow_id uuid references public.aipify_workflow_definitions (id) on delete set null,
  source_type text not null default 'system' check (
    source_type in (
      'email', 'chat', 'support_ticket', 'calendar', 'admin_action',
      'shopify', 'manual', 'api', 'system'
    )
  ),
  source_id text,
  actor_user_id uuid references public.users (id) on delete set null,
  related_customer_id uuid,
  related_case_id uuid,
  event_type text not null check (
    event_type in (
      'created', 'assigned', 'replied', 'escalated', 'delayed',
      'completed', 'reopened', 'ignored', 'reminder_sent', 'followup_promised'
    )
  ),
  event_payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists aipify_workflow_events_tenant_idx
  on public.aipify_workflow_events (tenant_id, occurred_at desc);

create index if not exists aipify_workflow_events_workflow_idx
  on public.aipify_workflow_events (tenant_id, workflow_id, event_type);

alter table public.aipify_workflow_events enable row level security;
revoke all on public.aipify_workflow_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. aipify_business_entities
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_business_entities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  entity_type text not null check (
    entity_type in (
      'customer', 'supplier', 'partner', 'project', 'vendor',
      'internal_team', 'lead'
    )
  ),
  name text not null,
  external_ref text,
  email text,
  phone text,
  website text,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aipify_business_entities_tenant_idx
  on public.aipify_business_entities (tenant_id, entity_type);

alter table public.aipify_business_entities enable row level security;
revoke all on public.aipify_business_entities from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. aipify_relationship_memory
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_relationship_memory (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  entity_id uuid not null references public.aipify_business_entities (id) on delete cascade,
  memory_type text not null check (
    memory_type in (
      'preference', 'issue', 'promise', 'risk', 'agreement',
      'followup', 'context', 'decision'
    )
  ),
  title text not null,
  summary text not null,
  confidence_score numeric(4, 2) not null default 0.7,
  source_type text,
  source_id text,
  visibility text not null default 'admin' check (
    visibility in ('private', 'assigned_team', 'managers', 'admins', 'all_staff')
  ),
  expires_at timestamptz,
  created_by text not null default 'aipify',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aipify_relationship_memory_tenant_idx
  on public.aipify_relationship_memory (tenant_id, entity_id);

alter table public.aipify_relationship_memory enable row level security;
revoke all on public.aipify_relationship_memory from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. aipify_insight_items
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_insight_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_type text not null check (
    insight_type in (
      'bottleneck', 'forgotten_task', 'risk', 'opportunity', 'trend',
      'workload', 'customer_followup', 'automation_suggestion', 'health_score',
      'relationship_memory'
    )
  ),
  severity text not null default 'info' check (
    severity in ('info', 'low', 'medium', 'high', 'critical')
  ),
  title text not null,
  summary text not null,
  evidence jsonb not null default '{}'::jsonb,
  recommended_action text,
  status text not null default 'open' check (
    status in ('open', 'acknowledged', 'dismissed', 'resolved', 'snoozed')
  ),
  assigned_user_id uuid references public.users (id) on delete set null,
  assigned_unit_id uuid references public.aipify_organization_units (id) on delete set null,
  confidence_score numeric(4, 2) not null default 0.7,
  generated_by text not null default 'aipify',
  generated_at timestamptz not null default now(),
  resolved_at timestamptz,
  snoozed_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aipify_insight_items_tenant_status_idx
  on public.aipify_insight_items (tenant_id, status, severity);

alter table public.aipify_insight_items enable row level security;
revoke all on public.aipify_insight_items from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. aipify_insight_actions
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_insight_actions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_id uuid not null references public.aipify_insight_items (id) on delete cascade,
  action_type text not null check (
    action_type in (
      'create_task', 'draft_email', 'assign_owner', 'send_reminder',
      'open_support_case', 'dismiss', 'resolve', 'snooze', 'acknowledge'
    )
  ),
  action_payload jsonb not null default '{}'::jsonb,
  performed_by_user_id uuid references public.users (id) on delete set null,
  performed_by_ai boolean not null default false,
  requires_confirmation boolean not null default true,
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists aipify_insight_actions_insight_idx
  on public.aipify_insight_actions (tenant_id, insight_id);

alter table public.aipify_insight_actions enable row level security;
revoke all on public.aipify_insight_actions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 10. aipify_intelligence_health_snapshots
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_intelligence_health_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  snapshot_date date not null,
  health_score int not null check (health_score between 0 and 100),
  support_score int check (support_score between 0 and 100),
  sales_score int check (sales_score between 0 and 100),
  operations_score int check (operations_score between 0 and 100),
  followup_score int check (followup_score between 0 and 100),
  risk_score int check (risk_score between 0 and 100),
  summary text,
  metrics jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, snapshot_date)
);

create index if not exists aipify_intelligence_health_snapshots_tenant_idx
  on public.aipify_intelligence_health_snapshots (tenant_id, snapshot_date desc);

alter table public.aipify_intelligence_health_snapshots enable row level security;
revoke all on public.aipify_intelligence_health_snapshots from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 11. aipify_intelligence_settings
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_intelligence_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default false,
  allow_email_analysis boolean not null default false,
  allow_calendar_analysis boolean not null default false,
  allow_support_analysis boolean not null default true,
  allow_customer_memory boolean not null default true,
  allow_staff_workload_insights boolean not null default false,
  allow_cross_department_insights boolean not null default false,
  require_admin_approval_for_actions boolean not null default true,
  default_retention_days int not null default 365,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.aipify_intelligence_settings enable row level security;
revoke all on public.aipify_intelligence_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 12. aipify_intelligence_audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_intelligence_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  actor_type text not null check (actor_type in ('user', 'aipify', 'system')),
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  target_type text,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists aipify_intelligence_audit_log_tenant_idx
  on public.aipify_intelligence_audit_log (tenant_id, created_at desc);

alter table public.aipify_intelligence_audit_log enable row level security;
revoke all on public.aipify_intelligence_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 13. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._oil_tenant_plan(p_tenant_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(s.plan_key, s.plan_type, 'starter')
  from public.subscriptions s
  where s.customer_id = p_tenant_id
  limit 1;
$$;

create or replace function public._oil_package_allows(p_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public._oil_tenant_plan(p_tenant_id) in ('business', 'enterprise');
$$;

create or replace function public._oil_user_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select u.id from public.users u where u.auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._oil_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(u.role, 'staff')
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;
$$;

create or replace function public._oil_require_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if public._oil_user_role() not in ('owner', 'admin') then
    raise exception 'Admin access required';
  end if;
end;
$$;

create or replace function public._oil_log_audit(
  p_tenant_id uuid,
  p_actor_type text,
  p_action text,
  p_target_type text default null,
  p_target_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.aipify_intelligence_audit_log (
    tenant_id, actor_type, actor_user_id, action, target_type, target_id, metadata
  )
  values (
    p_tenant_id,
    p_actor_type,
    case when p_actor_type = 'user' then public._oil_user_id() else null end,
    p_action,
    p_target_type,
    p_target_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end;
$$;

create or replace function public._oil_can_view_insight(
  p_insight public.aipify_insight_items,
  p_settings public.aipify_intelligence_settings
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_role text;
  v_user_id uuid;
begin
  v_role := public._oil_user_role();
  v_user_id := public._oil_user_id();

  if v_role in ('owner', 'admin') then
    return true;
  end if;

  if p_insight.insight_type = 'workload'
    and not p_settings.allow_staff_workload_insights then
    return false;
  end if;

  if v_role = 'support' then
    return p_insight.insight_type in (
      'bottleneck', 'customer_followup', 'forgotten_task', 'risk', 'automation_suggestion'
    );
  end if;

  if v_role = 'staff' then
    return p_insight.assigned_user_id = v_user_id;
  end if;

  return v_role in ('owner', 'admin');
end;
$$;

create or replace function public._oil_insight_json(i public.aipify_insight_items)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', i.id,
    'insight_type', i.insight_type,
    'severity', i.severity,
    'title', i.title,
    'summary', i.summary,
    'evidence', i.evidence,
    'recommended_action', i.recommended_action,
    'status', i.status,
    'assigned_user_id', i.assigned_user_id,
    'assigned_unit_id', i.assigned_unit_id,
    'confidence_score', i.confidence_score,
    'generated_by', i.generated_by,
    'generated_at', i.generated_at,
    'resolved_at', i.resolved_at,
    'snoozed_until', i.snoozed_until,
    'created_at', i.created_at,
    'updated_at', i.updated_at
  );
$$;

create or replace function public._oil_calculate_health_score(p_tenant_id uuid)
returns int
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_score int := 100;
  v_critical int;
  v_high int;
  v_medium int;
  v_low int;
  v_overdue int;
  v_support_penalty int := 0;
begin
  select
    count(*) filter (where severity = 'critical' and status = 'open'),
    count(*) filter (where severity = 'high' and status = 'open'),
    count(*) filter (where severity = 'medium' and status = 'open'),
    count(*) filter (where severity = 'low' and status = 'open')
  into v_critical, v_high, v_medium, v_low
  from public.aipify_insight_items
  where tenant_id = p_tenant_id
    and status in ('open', 'acknowledged');

  v_score := v_score - coalesce(v_critical, 0) * 20;
  v_score := v_score - coalesce(v_high, 0) * 10;
  v_score := v_score - coalesce(v_medium, 0) * 5;
  v_score := v_score - coalesce(v_low, 0) * 1;

  select count(*) into v_overdue
  from public.aipify_workflow_events e
  join public.aipify_workflow_definitions w on w.id = e.workflow_id
  where e.tenant_id = p_tenant_id
    and e.event_type in ('delayed', 'escalated')
    and e.occurred_at > now() - interval '7 days'
    and not exists (
      select 1 from public.aipify_workflow_events c
      where c.tenant_id = e.tenant_id
        and c.source_id = e.source_id
        and c.event_type = 'completed'
        and c.occurred_at > e.occurred_at
    );

  v_score := v_score - least(20, coalesce(v_overdue, 0) * 2);

  if exists (
    select 1 from public.support_cases sc
    where sc.tenant_id = p_tenant_id
      and sc.status in ('escalated', 'pending_approval')
      and sc.created_at < now() - interval '24 hours'
  ) then
    v_support_penalty := 10;
  end if;

  v_score := v_score - least(15, v_support_penalty);

  return greatest(0, least(100, v_score));
end;
$$;

create or replace function public.ensure_oil_intelligence_settings(p_tenant_id uuid)
returns public.aipify_intelligence_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.aipify_intelligence_settings;
begin
  insert into public.aipify_intelligence_settings (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;

  select * into v_row
  from public.aipify_intelligence_settings
  where tenant_id = p_tenant_id;

  return v_row;
end;
$$;

create or replace function public.ensure_oil_organization(p_tenant_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_name text;
begin
  select id into v_org_id
  from public.aipify_organizations
  where tenant_id = p_tenant_id;

  if v_org_id is not null then
    return v_org_id;
  end if;

  select coalesce(c.name, 'Organization') into v_name
  from public.customers c
  where c.id = p_tenant_id;

  insert into public.aipify_organizations (tenant_id, name)
  values (p_tenant_id, v_name)
  returning id into v_org_id;

  return v_org_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- 14. Settings RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_intelligence_settings()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_intelligence_settings;
  v_plan text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_plan := public._oil_tenant_plan(v_tenant_id);

  if not public._oil_package_allows(v_tenant_id) then
    return jsonb_build_object(
      'has_customer', true,
      'has_access', false,
      'upgrade_required', true,
      'plan', v_plan
    );
  end if;

  perform public._oil_require_admin();
  v_settings := public.ensure_oil_intelligence_settings(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'has_access', true,
    'upgrade_required', false,
    'plan', v_plan,
    'settings', jsonb_build_object(
      'enabled', v_settings.enabled,
      'allow_email_analysis', v_settings.allow_email_analysis,
      'allow_calendar_analysis', v_settings.allow_calendar_analysis,
      'allow_support_analysis', v_settings.allow_support_analysis,
      'allow_customer_memory', v_settings.allow_customer_memory,
      'allow_staff_workload_insights', v_settings.allow_staff_workload_insights,
      'allow_cross_department_insights', v_settings.allow_cross_department_insights,
      'require_admin_approval_for_actions', v_settings.require_admin_approval_for_actions,
      'default_retention_days', v_settings.default_retention_days
    )
  );
end;
$$;

create or replace function public.update_intelligence_settings(p_patch jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_intelligence_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;
  if not public._oil_package_allows(v_tenant_id) then raise exception 'Upgrade required'; end if;

  perform public._oil_require_admin();
  v_settings := public.ensure_oil_intelligence_settings(v_tenant_id);

  update public.aipify_intelligence_settings s
  set
    enabled = coalesce((p_patch->>'enabled')::boolean, s.enabled),
    allow_email_analysis = coalesce((p_patch->>'allow_email_analysis')::boolean, s.allow_email_analysis),
    allow_calendar_analysis = coalesce((p_patch->>'allow_calendar_analysis')::boolean, s.allow_calendar_analysis),
    allow_support_analysis = coalesce((p_patch->>'allow_support_analysis')::boolean, s.allow_support_analysis),
    allow_customer_memory = coalesce((p_patch->>'allow_customer_memory')::boolean, s.allow_customer_memory),
    allow_staff_workload_insights = coalesce((p_patch->>'allow_staff_workload_insights')::boolean, s.allow_staff_workload_insights),
    allow_cross_department_insights = coalesce((p_patch->>'allow_cross_department_insights')::boolean, s.allow_cross_department_insights),
    require_admin_approval_for_actions = coalesce((p_patch->>'require_admin_approval_for_actions')::boolean, s.require_admin_approval_for_actions),
    default_retention_days = coalesce((p_patch->>'default_retention_days')::int, s.default_retention_days),
    updated_at = now()
  where s.tenant_id = v_tenant_id
  returning * into v_settings;

  perform public._oil_log_audit(
    v_tenant_id, 'user', 'update_intelligence_settings', 'intelligence_settings', v_settings.id, p_patch
  );

  return public.get_intelligence_settings();
end;
$$;

-- ---------------------------------------------------------------------------
-- 15. Workflow event recorder
-- ---------------------------------------------------------------------------
create or replace function public.record_workflow_event(
  p_workflow_key text,
  p_source_type text,
  p_source_id text default null,
  p_event_type text default 'created',
  p_payload jsonb default '{}'::jsonb,
  p_actor_user_id uuid default null,
  p_related_customer_id uuid default null,
  p_related_case_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_workflow_id uuid;
  v_event_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;
  if not public._oil_package_allows(v_tenant_id) then raise exception 'Upgrade required'; end if;

  select w.id into v_workflow_id
  from public.aipify_workflow_definitions w
  where w.tenant_id = v_tenant_id and w.workflow_key = p_workflow_key and w.active
  limit 1;

  insert into public.aipify_workflow_events (
    tenant_id, workflow_id, source_type, source_id, actor_user_id,
    related_customer_id, related_case_id, event_type, event_payload
  )
  values (
    v_tenant_id, v_workflow_id, p_source_type, p_source_id,
    coalesce(p_actor_user_id, public._oil_user_id()),
    p_related_customer_id, p_related_case_id, p_event_type, coalesce(p_payload, '{}'::jsonb)
  )
  returning id into v_event_id;

  perform public._oil_log_audit(
    v_tenant_id, 'user', 'record_workflow_event', 'workflow_event', v_event_id,
    jsonb_build_object('workflow_key', p_workflow_key, 'event_type', p_event_type)
  );

  return jsonb_build_object('id', v_event_id, 'workflow_id', v_workflow_id);
end;
$$;

-- ---------------------------------------------------------------------------
-- 16. Detection jobs
-- ---------------------------------------------------------------------------
create or replace function public.detect_oil_bottlenecks_for_tenant(p_tenant_id uuid)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int := 0;
  v_total int;
  v_top_user uuid;
  v_top_count int;
  v_pct numeric;
  v_avg_age interval;
  v_expected int;
begin
  if not exists (
    select 1 from public.aipify_intelligence_settings s
    where s.tenant_id = p_tenant_id and s.enabled
  ) then
    return 0;
  end if;

  select count(*) into v_total
  from public.aipify_workflow_events e
  where e.tenant_id = p_tenant_id
    and e.event_type = 'escalated'
    and e.occurred_at > now() - interval '7 days'
    and not exists (
      select 1 from public.aipify_workflow_events c
      where c.tenant_id = e.tenant_id
        and c.source_id = e.source_id
        and c.event_type = 'completed'
        and c.occurred_at > e.occurred_at
    );

  if v_total > 5 then
    select e.actor_user_id, count(*) into v_top_user, v_top_count
    from public.aipify_workflow_events e
    where e.tenant_id = p_tenant_id
      and e.event_type = 'escalated'
      and e.occurred_at > now() - interval '7 days'
      and e.actor_user_id is not null
      and not exists (
        select 1 from public.aipify_workflow_events c
        where c.tenant_id = e.tenant_id
          and c.source_id = e.source_id
          and c.event_type = 'completed'
          and c.occurred_at > e.occurred_at
      )
    group by e.actor_user_id
    order by count(*) desc
    limit 1;

    v_pct := (v_top_count::numeric / v_total::numeric) * 100;

    select avg(now() - e.occurred_at) into v_avg_age
    from public.aipify_workflow_events e
    where e.tenant_id = p_tenant_id
      and e.event_type = 'escalated'
      and e.occurred_at > now() - interval '7 days';

    select coalesce(w.expected_response_time_minutes, 60) into v_expected
    from public.aipify_workflow_definitions w
    where w.tenant_id = p_tenant_id and w.category = 'support'
    order by w.created_at
    limit 1;

    if v_pct > 60 and extract(epoch from v_avg_age) / 60 > v_expected then
      if not exists (
        select 1 from public.aipify_insight_items i
        where i.tenant_id = p_tenant_id
          and i.insight_type = 'bottleneck'
          and i.status in ('open', 'acknowledged')
          and i.title = 'Escalations are concentrated on one person'
          and i.created_at > now() - interval '24 hours'
      ) then
        insert into public.aipify_insight_items (
          tenant_id, insight_type, severity, title, summary, evidence, recommended_action
        )
        values (
          p_tenant_id, 'bottleneck', 'high',
          'Escalations are concentrated on one person',
          format(
            '%s%% of unresolved escalations in the last 7 days are assigned to one owner. This may slow response time.',
            round(v_pct)
          ),
          jsonb_build_object(
            'total_open', v_total,
            'top_owner_count', v_top_count,
            'percentage', round(v_pct),
            'avg_age_minutes', round(extract(epoch from v_avg_age) / 60)
          ),
          'Assign a backup owner or distribute open cases across the support team.'
        );
        v_count := v_count + 1;
      end if;
    end if;
  end if;

  if exists (
    select 1 from public.aipify_intelligence_settings s
    where s.tenant_id = p_tenant_id and s.allow_support_analysis
  ) then
    if (
      select count(*) from public.support_cases sc
      where sc.tenant_id = p_tenant_id
        and sc.status in ('escalated', 'pending_approval', 'received')
        and sc.created_at < now() - interval '24 hours'
    ) >= 3 then
      if not exists (
        select 1 from public.aipify_insight_items i
        where i.tenant_id = p_tenant_id
          and i.insight_type = 'bottleneck'
          and i.status in ('open', 'acknowledged')
          and i.title = 'Support response time is increasing'
          and i.created_at > now() - interval '24 hours'
      ) then
        insert into public.aipify_insight_items (
          tenant_id, insight_type, severity, title, summary, evidence, recommended_action
        )
        values (
          p_tenant_id, 'bottleneck', 'medium',
          'Support response time is increasing',
          'Several support cases have been waiting longer than expected. Review open conversations and assign overflow cases.',
          jsonb_build_object('source', 'support_cases', 'window_hours', 24),
          'Review open support conversations and assign overflow cases.'
        );
        v_count := v_count + 1;
      end if;
    end if;
  end if;

  return v_count;
end;
$$;

create or replace function public.detect_oil_forgotten_followups_for_tenant(p_tenant_id uuid)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int := 0;
  r record;
  v_expected_at timestamptz;
  v_hours int;
begin
  if not exists (
    select 1 from public.aipify_intelligence_settings s
    where s.tenant_id = p_tenant_id and s.enabled
  ) then
    return 0;
  end if;

  for r in
    select e.*
    from public.aipify_workflow_events e
    where e.tenant_id = p_tenant_id
      and e.event_type in ('followup_promised', 'reminder_sent')
      and e.occurred_at > now() - interval '30 days'
  loop
    v_hours := coalesce((r.event_payload->>'expected_hours')::int, 48);
    v_expected_at := r.occurred_at + (v_hours || ' hours')::interval;

    if v_expected_at < now()
      and not exists (
        select 1 from public.aipify_workflow_events c
        where c.tenant_id = r.tenant_id
          and c.source_id = r.source_id
          and c.event_type in ('completed', 'replied')
          and c.occurred_at > r.occurred_at
      )
    then
      if not exists (
        select 1 from public.aipify_insight_items i
        where i.tenant_id = p_tenant_id
          and i.insight_type in ('forgotten_task', 'customer_followup')
          and i.status in ('open', 'acknowledged')
          and i.evidence->>'source_event_id' = r.id::text
      ) then
        insert into public.aipify_insight_items (
          tenant_id, insight_type, severity, title, summary, evidence, recommended_action
        )
        values (
          p_tenant_id,
          case when r.related_customer_id is not null then 'customer_followup' else 'forgotten_task' end,
          'medium',
          'Follow-up may be missing',
          'Aipify found a promised follow-up but no matching activity after the expected time.',
          jsonb_build_object(
            'source_event_id', r.id,
            'source_id', r.source_id,
            'expected_at', v_expected_at,
            'workflow_id', r.workflow_id
          ),
          'Create a reminder or draft a follow-up message.'
        );
        v_count := v_count + 1;
      end if;
    end if;
  end loop;

  return v_count;
end;
$$;

create or replace function public.generate_oil_daily_health_snapshot_for_tenant(p_tenant_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_health int;
  v_followup int;
  v_support int;
  v_risk int;
  v_snapshot_id uuid;
  v_open_followups int;
  v_open_risks int;
begin
  if not exists (
    select 1 from public.aipify_intelligence_settings s
    where s.tenant_id = p_tenant_id and s.enabled
  ) then
    return null;
  end if;

  v_health := public._oil_calculate_health_score(p_tenant_id);

  select count(*) into v_open_followups
  from public.aipify_insight_items
  where tenant_id = p_tenant_id
    and insight_type in ('forgotten_task', 'customer_followup')
    and status in ('open', 'acknowledged');

  v_followup := greatest(0, 100 - v_open_followups * 8);

  select count(*) into v_open_risks
  from public.aipify_insight_items
  where tenant_id = p_tenant_id
    and insight_type = 'risk'
    and status in ('open', 'acknowledged');

  v_risk := least(100, v_open_risks * 15);

  if exists (
    select 1 from public.aipify_intelligence_settings s
    where s.tenant_id = p_tenant_id and s.allow_support_analysis
  ) then
    v_support := case
      when exists (
        select 1 from public.support_cases sc
        where sc.tenant_id = p_tenant_id
          and sc.status in ('escalated', 'pending_approval')
      ) then 75
      else 95
    end;
  end if;

  insert into public.aipify_intelligence_health_snapshots (
    tenant_id, snapshot_date, health_score, support_score, followup_score, risk_score, summary, metrics
  )
  values (
    p_tenant_id,
    current_date,
    v_health,
    v_support,
    v_followup,
    v_risk,
    case
      when v_health >= 90 then 'Operations appear healthy with minor areas to watch.'
      when v_health >= 75 then 'Good overall health, but some areas need attention.'
      when v_health >= 50 then 'Several operational signals suggest follow-up is needed.'
      else 'Critical operational risks may require immediate review.'
    end,
    jsonb_build_object(
      'open_insights', (
        select count(*) from public.aipify_insight_items
        where tenant_id = p_tenant_id and status in ('open', 'acknowledged')
      )
    )
  )
  on conflict (tenant_id, snapshot_date) do update
  set
    health_score = excluded.health_score,
    support_score = excluded.support_score,
    followup_score = excluded.followup_score,
    risk_score = excluded.risk_score,
    summary = excluded.summary,
    metrics = excluded.metrics
  returning id into v_snapshot_id;

  if v_health < 75 and not exists (
    select 1 from public.aipify_insight_items i
    where i.tenant_id = p_tenant_id
      and i.insight_type = 'health_score'
      and i.created_at::date = current_date
  ) then
    insert into public.aipify_insight_items (
      tenant_id, insight_type, severity, title, summary, evidence, recommended_action, status
    )
    values (
      p_tenant_id, 'health_score',
      case when v_health < 50 then 'high' when v_health < 75 then 'medium' else 'low' end,
      'Business health needs attention',
      format('Current business health score is %s. Review open insights and recommended actions.', v_health),
      jsonb_build_object('health_score', v_health, 'snapshot_id', v_snapshot_id),
      'Review the insights dashboard and prioritize open operational items.',
      'open'
    );
  end if;

  return v_snapshot_id;
end;
$$;

create or replace function public.run_oil_detection_jobs(p_tenant_id uuid default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_bottlenecks int;
  v_followups int;
  v_snapshot uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._presence_tenant_for_auth());
  if v_tenant_id is null then raise exception 'No tenant'; end if;
  if not public._oil_package_allows(v_tenant_id) then raise exception 'Upgrade required'; end if;

  perform public.ensure_oil_intelligence_settings(v_tenant_id);

  v_bottlenecks := public.detect_oil_bottlenecks_for_tenant(v_tenant_id);
  v_followups := public.detect_oil_forgotten_followups_for_tenant(v_tenant_id);
  v_snapshot := public.generate_oil_daily_health_snapshot_for_tenant(v_tenant_id);

  perform public._oil_log_audit(
    v_tenant_id, 'system', 'run_detection_jobs', null, null,
    jsonb_build_object(
      'bottlenecks', v_bottlenecks,
      'followups', v_followups,
      'snapshot_id', v_snapshot
    )
  );

  return jsonb_build_object(
    'bottlenecks_created', v_bottlenecks,
    'followups_created', v_followups,
    'snapshot_id', v_snapshot
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 17. Insight actions
-- ---------------------------------------------------------------------------
create or replace function public.update_insight_status(
  p_insight_id uuid,
  p_status text,
  p_snooze_until timestamptz default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_insight public.aipify_insight_items;
  v_settings public.aipify_intelligence_settings;
  v_action_type text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;

  select * into v_insight
  from public.aipify_insight_items
  where id = p_insight_id and tenant_id = v_tenant_id;

  if not found then raise exception 'Insight not found'; end if;

  v_settings := public.ensure_oil_intelligence_settings(v_tenant_id);

  if not public._oil_can_view_insight(v_insight, v_settings) then
    raise exception 'Access denied';
  end if;

  if p_status in ('dismissed', 'resolved', 'snoozed') then
    perform public._oil_require_admin();
  end if;

  update public.aipify_insight_items
  set
    status = p_status,
    snoozed_until = case when p_status = 'snoozed' then p_snooze_until else snoozed_until end,
    resolved_at = case when p_status in ('resolved', 'dismissed') then now() else resolved_at end,
    updated_at = now()
  where id = p_insight_id
  returning * into v_insight;

  v_action_type := case p_status
    when 'acknowledged' then 'acknowledge'
    when 'dismissed' then 'dismiss'
    when 'resolved' then 'resolve'
    when 'snoozed' then 'snooze'
    else 'acknowledge'
  end;

  insert into public.aipify_insight_actions (
    tenant_id, insight_id, action_type, performed_by_user_id, requires_confirmation, confirmed_at
  )
  values (
    v_tenant_id, p_insight_id, v_action_type, public._oil_user_id(), false, now()
  );

  perform public._oil_log_audit(
    v_tenant_id, 'user', 'update_insight_status', 'insight', p_insight_id,
    jsonb_build_object('status', p_status)
  );

  return public._oil_insight_json(v_insight);
end;
$$;

-- ---------------------------------------------------------------------------
-- 18. Intelligence center
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_intelligence_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_plan text;
  v_settings public.aipify_intelligence_settings;
  v_health int := 100;
  v_snapshot public.aipify_intelligence_health_snapshots;
  v_insights jsonb;
  v_strongest text := 'Operations';
  v_weakest text := 'Follow-up';
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_plan := public._oil_tenant_plan(v_tenant_id);

  if not public._oil_package_allows(v_tenant_id) then
    return jsonb_build_object(
      'has_customer', true,
      'has_access', false,
      'upgrade_required', true,
      'plan', v_plan,
      'privacy_note', 'Organizational Intelligence analyzes approved business activity — not hidden employee surveillance.'
    );
  end if;

  v_settings := public.ensure_oil_intelligence_settings(v_tenant_id);

  if not v_settings.enabled then
    return jsonb_build_object(
      'has_customer', true,
      'has_access', true,
      'enabled', false,
      'upgrade_required', false,
      'plan', v_plan,
      'privacy_note', 'Enable Organizational Intelligence in settings to begin operational insights.',
      'settings_url', '/app/settings/intelligence'
    );
  end if;

  if not exists (
    select 1 from public.aipify_intelligence_health_snapshots s
    where s.tenant_id = v_tenant_id and s.snapshot_date = current_date
  ) then
    perform public.run_oil_detection_jobs(v_tenant_id);
  end if;

  select * into v_snapshot
  from public.aipify_intelligence_health_snapshots
  where tenant_id = v_tenant_id
  order by snapshot_date desc
  limit 1;

  v_health := coalesce(v_snapshot.health_score, public._oil_calculate_health_score(v_tenant_id));

  if v_snapshot.support_score is not null and v_snapshot.followup_score is not null then
    if v_snapshot.support_score >= coalesce(v_snapshot.operations_score, v_snapshot.support_score)
      and v_snapshot.support_score >= v_snapshot.followup_score then
      v_strongest := 'Customer Support';
    elsif v_snapshot.followup_score >= v_snapshot.support_score then
      v_strongest := 'Follow-up';
    end if;

    if v_snapshot.followup_score <= coalesce(v_snapshot.support_score, 100) then
      v_weakest := 'Follow-up';
    elsif v_snapshot.support_score < v_snapshot.followup_score then
      v_weakest := 'Customer Support';
    end if;
  end if;

  v_insights := coalesce(
    (
      select jsonb_agg(public._oil_insight_json(i) order by
        case i.severity
          when 'critical' then 1 when 'high' then 2 when 'medium' then 3 when 'low' then 4 else 5
        end,
        i.generated_at desc
      )
      from public.aipify_insight_items i
      where i.tenant_id = v_tenant_id
        and i.status in ('open', 'acknowledged')
        and public._oil_can_view_insight(i, v_settings)
        and (i.snoozed_until is null or i.snoozed_until < now())
    ),
    '[]'::jsonb
  );

  perform public._oil_log_audit(v_tenant_id, 'user', 'view_intelligence_center', null, null, '{}'::jsonb);

  return jsonb_build_object(
    'has_customer', true,
    'has_access', true,
    'enabled', true,
    'upgrade_required', false,
    'plan', v_plan,
    'privacy_note', 'Aipify only analyzes data sources you enable. Sensitive actions require approval and are logged.',
    'health_score', v_health,
    'health_band', case
      when v_health >= 90 then 'healthy'
      when v_health >= 75 then 'good'
      when v_health >= 50 then 'needs_attention'
      when v_health >= 25 then 'risky'
      else 'critical'
    end,
    'strongest_area', v_strongest,
    'weakest_area', v_weakest,
    'snapshot', case when v_snapshot.id is not null then jsonb_build_object(
      'support_score', v_snapshot.support_score,
      'followup_score', v_snapshot.followup_score,
      'risk_score', v_snapshot.risk_score,
      'summary', v_snapshot.summary,
      'snapshot_date', v_snapshot.snapshot_date
    ) else null end,
    'insights', v_insights,
    'open_risks', (
      select count(*) from public.aipify_insight_items
      where tenant_id = v_tenant_id
        and insight_type in ('risk', 'bottleneck')
        and status in ('open', 'acknowledged')
    ),
    'resolved_recent', coalesce(
      (
        select jsonb_agg(public._oil_insight_json(i) order by i.resolved_at desc)
        from public.aipify_insight_items i
        where i.tenant_id = v_tenant_id
          and i.status in ('resolved', 'dismissed')
          and i.resolved_at > now() - interval '7 days'
        limit 5
      ),
      '[]'::jsonb
    )
  );
end;
$$;

create or replace function public.get_intelligence_health_history()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return '[]'::jsonb; end if;
  if not public._oil_package_allows(v_tenant_id) then return '[]'::jsonb; end if;

  return coalesce(
    (
      select jsonb_agg(jsonb_build_object(
        'snapshot_date', s.snapshot_date,
        'health_score', s.health_score,
        'support_score', s.support_score,
        'followup_score', s.followup_score,
        'risk_score', s.risk_score
      ) order by s.snapshot_date desc)
      from public.aipify_intelligence_health_snapshots s
      where s.tenant_id = v_tenant_id
        and s.snapshot_date >= current_date - 30
    ),
    '[]'::jsonb
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 19. Organization + workflow CRUD (admin)
-- ---------------------------------------------------------------------------
create or replace function public.get_organization_units()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_org_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return '[]'::jsonb; end if;
  if not public._oil_package_allows(v_tenant_id) then return '[]'::jsonb; end if;

  perform public._oil_require_admin();
  v_org_id := public.ensure_oil_organization(v_tenant_id);

  return coalesce(
    (
      select jsonb_agg(jsonb_build_object(
        'id', u.id,
        'name', u.name,
        'unit_type', u.unit_type,
        'description', u.description,
        'parent_unit_id', u.parent_unit_id,
        'manager_user_id', u.manager_user_id,
        'active', u.active
      ) order by u.name)
      from public.aipify_organization_units u
      where u.tenant_id = v_tenant_id and u.organization_id = v_org_id
    ),
    '[]'::jsonb
  );
end;
$$;

create or replace function public.upsert_organization_unit(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_org_id uuid;
  v_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;
  if not public._oil_package_allows(v_tenant_id) then raise exception 'Upgrade required'; end if;
  perform public._oil_require_admin();

  v_org_id := public.ensure_oil_organization(v_tenant_id);
  v_id := nullif(p_payload->>'id', '')::uuid;

  if v_id is not null then
    update public.aipify_organization_units
    set
      name = coalesce(p_payload->>'name', name),
      unit_type = coalesce(p_payload->>'unit_type', unit_type),
      description = coalesce(p_payload->>'description', description),
      parent_unit_id = coalesce(nullif(p_payload->>'parent_unit_id', '')::uuid, parent_unit_id),
      manager_user_id = coalesce(nullif(p_payload->>'manager_user_id', '')::uuid, manager_user_id),
      active = coalesce((p_payload->>'active')::boolean, active),
      updated_at = now()
    where id = v_id and tenant_id = v_tenant_id;
  else
    insert into public.aipify_organization_units (
      tenant_id, organization_id, name, unit_type, description, parent_unit_id, manager_user_id
    )
    values (
      v_tenant_id, v_org_id,
      p_payload->>'name',
      coalesce(p_payload->>'unit_type', 'department'),
      p_payload->>'description',
      nullif(p_payload->>'parent_unit_id', '')::uuid,
      nullif(p_payload->>'manager_user_id', '')::uuid
    )
    returning id into v_id;
  end if;

  perform public._oil_log_audit(v_tenant_id, 'user', 'upsert_organization_unit', 'organization_unit', v_id, p_payload);
  return public.get_organization_units();
end;
$$;

create or replace function public.get_workflow_definitions()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return '[]'::jsonb; end if;
  if not public._oil_package_allows(v_tenant_id) then return '[]'::jsonb; end if;

  return coalesce(
    (
      select jsonb_agg(jsonb_build_object(
        'id', w.id,
        'name', w.name,
        'workflow_key', w.workflow_key,
        'description', w.description,
        'category', w.category,
        'expected_response_time_minutes', w.expected_response_time_minutes,
        'expected_completion_time_minutes', w.expected_completion_time_minutes,
        'owner_unit_id', w.owner_unit_id,
        'owner_user_id', w.owner_user_id,
        'active', w.active,
        'open_events', (
          select count(*) from public.aipify_workflow_events e
          where e.workflow_id = w.id
            and e.event_type not in ('completed')
            and e.occurred_at > now() - interval '30 days'
        )
      ) order by w.name)
      from public.aipify_workflow_definitions w
      where w.tenant_id = v_tenant_id
    ),
    '[]'::jsonb
  );
end;
$$;

create or replace function public.upsert_workflow_definition(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;
  if not public._oil_package_allows(v_tenant_id) then raise exception 'Upgrade required'; end if;
  perform public._oil_require_admin();

  v_id := nullif(p_payload->>'id', '')::uuid;

  if v_id is not null then
    update public.aipify_workflow_definitions
    set
      name = coalesce(p_payload->>'name', name),
      workflow_key = coalesce(p_payload->>'workflow_key', workflow_key),
      description = coalesce(p_payload->>'description', description),
      category = coalesce(p_payload->>'category', category),
      expected_response_time_minutes = coalesce((p_payload->>'expected_response_time_minutes')::int, expected_response_time_minutes),
      expected_completion_time_minutes = coalesce((p_payload->>'expected_completion_time_minutes')::int, expected_completion_time_minutes),
      owner_unit_id = coalesce(nullif(p_payload->>'owner_unit_id', '')::uuid, owner_unit_id),
      owner_user_id = coalesce(nullif(p_payload->>'owner_user_id', '')::uuid, owner_user_id),
      active = coalesce((p_payload->>'active')::boolean, active),
      updated_at = now()
    where id = v_id and tenant_id = v_tenant_id;
  else
    insert into public.aipify_workflow_definitions (
      tenant_id, name, workflow_key, description, category,
      expected_response_time_minutes, expected_completion_time_minutes,
      owner_unit_id, owner_user_id
    )
    values (
      v_tenant_id,
      p_payload->>'name',
      p_payload->>'workflow_key',
      p_payload->>'description',
      coalesce(p_payload->>'category', 'internal'),
      nullif(p_payload->>'expected_response_time_minutes', '')::int,
      nullif(p_payload->>'expected_completion_time_minutes', '')::int,
      nullif(p_payload->>'owner_unit_id', '')::uuid,
      nullif(p_payload->>'owner_user_id', '')::uuid
    )
    returning id into v_id;
  end if;

  perform public._oil_log_audit(v_tenant_id, 'user', 'upsert_workflow_definition', 'workflow_definition', v_id, p_payload);
  return public.get_workflow_definitions();
end;
$$;

create or replace function public.get_responsibility_map()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return '[]'::jsonb; end if;
  if not public._oil_package_allows(v_tenant_id) then return '[]'::jsonb; end if;
  perform public._oil_require_admin();

  return coalesce(
    (
      select jsonb_agg(jsonb_build_object(
        'id', r.id,
        'role_name', r.role_name,
        'responsibility_type', r.responsibility_type,
        'description', r.description,
        'organization_unit_id', r.organization_unit_id,
        'user_id', r.user_id,
        'priority', r.priority,
        'active', r.active
      ) order by r.priority desc, r.role_name)
      from public.aipify_responsibility_map r
      where r.tenant_id = v_tenant_id and r.active
    ),
    '[]'::jsonb
  );
end;
$$;

create or replace function public.upsert_responsibility(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;
  if not public._oil_package_allows(v_tenant_id) then raise exception 'Upgrade required'; end if;
  perform public._oil_require_admin();

  v_id := nullif(p_payload->>'id', '')::uuid;

  if v_id is not null then
    update public.aipify_responsibility_map
    set
      role_name = coalesce(p_payload->>'role_name', role_name),
      responsibility_type = coalesce(p_payload->>'responsibility_type', responsibility_type),
      description = coalesce(p_payload->>'description', description),
      organization_unit_id = coalesce(nullif(p_payload->>'organization_unit_id', '')::uuid, organization_unit_id),
      user_id = coalesce(nullif(p_payload->>'user_id', '')::uuid, user_id),
      priority = coalesce((p_payload->>'priority')::int, priority),
      active = coalesce((p_payload->>'active')::boolean, active),
      updated_at = now()
    where id = v_id and tenant_id = v_tenant_id;
  else
    insert into public.aipify_responsibility_map (
      tenant_id, role_name, responsibility_type, description,
      organization_unit_id, user_id, priority
    )
    values (
      v_tenant_id,
      p_payload->>'role_name',
      p_payload->>'responsibility_type',
      p_payload->>'description',
      nullif(p_payload->>'organization_unit_id', '')::uuid,
      nullif(p_payload->>'user_id', '')::uuid,
      coalesce((p_payload->>'priority')::int, 0)
    )
    returning id into v_id;
  end if;

  perform public._oil_log_audit(v_tenant_id, 'user', 'upsert_responsibility', 'responsibility', v_id, p_payload);
  return public.get_responsibility_map();
end;
$$;

-- ---------------------------------------------------------------------------
-- 20. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_customer_intelligence_center() to authenticated;
grant execute on function public.get_intelligence_settings() to authenticated;
grant execute on function public.update_intelligence_settings(jsonb) to authenticated;
grant execute on function public.get_intelligence_health_history() to authenticated;
grant execute on function public.record_workflow_event(text, text, text, text, jsonb, uuid, uuid, uuid) to authenticated;
grant execute on function public.run_oil_detection_jobs(uuid) to authenticated;
grant execute on function public.update_insight_status(uuid, text, timestamptz) to authenticated;
grant execute on function public.get_organization_units() to authenticated;
grant execute on function public.upsert_organization_unit(jsonb) to authenticated;
grant execute on function public.get_workflow_definitions() to authenticated;
grant execute on function public.upsert_workflow_definition(jsonb) to authenticated;
grant execute on function public.get_responsibility_map() to authenticated;
grant execute on function public.upsert_responsibility(jsonb) to authenticated;
