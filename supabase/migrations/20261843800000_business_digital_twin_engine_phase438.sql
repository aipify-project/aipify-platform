-- Phase 438 — Business Digital Twin Engine (Customer App)
-- Route: /app/intelligence/digital-twin

create table if not exists public.business_digital_twin_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  simulation_enabled boolean not null default true,
  dependency_mapping_enabled boolean not null default true,
  scenario_planning_enabled boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.business_digital_twin_entities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  section_key text not null check (section_key in (
    'organization_model', 'teams', 'customers', 'vendors', 'projects',
    'systems', 'workflows', 'dependencies', 'simulations'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  owner_label text not null default '',
  dependencies text not null default '',
  criticality text not null default 'medium' check (criticality in ('low', 'medium', 'high', 'critical')),
  status_key text not null default 'information' check (status_key in (
    'completed', 'requires_attention', 'waiting', 'information', 'restricted', 'verified', 'not_allowed'
  )),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_digital_twin_entities_org_idx
  on public.business_digital_twin_entities (organization_id, section_key, updated_at desc);

create table if not exists public.business_digital_twin_processes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workflow_type text not null check (workflow_type in (
    'support', 'sales', 'finance', 'approval', 'customer_journey'
  )),
  title text not null,
  start_label text not null default '',
  actions_label text not null default '',
  approvals_label text not null default '',
  outcomes_label text not null default '',
  status_key text not null default 'verified',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_digital_twin_processes_org_idx
  on public.business_digital_twin_processes (organization_id, workflow_type);

create table if not exists public.business_digital_twin_dependency_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  dependency_type text not null check (dependency_type in (
    'system', 'vendor', 'employee', 'project'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  status_key text not null default 'requires_attention',
  suggested_action text not null default '',
  resolved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_digital_twin_dependency_items_org_idx
  on public.business_digital_twin_dependency_items (organization_id, resolved, created_at desc);

create table if not exists public.business_digital_twin_simulations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  scenario_type text not null check (scenario_type in (
    'employee_departure', 'vendor_failure', 'revenue_drop', 'support_surge', 'market_expansion'
  )),
  title text not null,
  prompt text not null default '' check (char_length(prompt) <= 500),
  impact_summary text not null default '',
  status_key text not null default 'information',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_digital_twin_simulations_org_idx
  on public.business_digital_twin_simulations (organization_id, scenario_type);

create table if not exists public.business_digital_twin_capacity (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  team_label text not null,
  workload_pct numeric(5,2) not null default 0,
  available_resources text not null default '',
  bottleneck_label text not null default '',
  days_to_capacity integer,
  status_key text not null default 'requires_attention',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_digital_twin_capacity_org_idx
  on public.business_digital_twin_capacity (organization_id, updated_at desc);

create table if not exists public.business_digital_twin_impacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  change_title text not null,
  impact_summary text not null default '',
  risk_summary text not null default '',
  affected_teams text not null default '',
  affected_systems text not null default '',
  status_key text not null default 'information',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_digital_twin_impacts_org_idx
  on public.business_digital_twin_impacts (organization_id, created_at desc);

create table if not exists public.business_digital_twin_scenarios (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  scenario_name text not null,
  case_type text not null check (case_type in ('best', 'expected', 'worst')),
  expected_revenue text not null default '',
  expected_support_load text not null default '',
  expected_staffing text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  status_key text not null default 'information',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_digital_twin_scenarios_org_idx
  on public.business_digital_twin_scenarios (organization_id, scenario_name, case_type);

create table if not exists public.business_digital_twin_insights (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  insight_type text not null check (insight_type in (
    'increase_staffing', 'reduce_dependency', 'improve_workflow',
    'document_knowledge', 'diversify_vendors'
  )),
  recommendation text not null,
  reason text not null default '' check (char_length(reason) <= 500),
  status text not null default 'open' check (status in ('open', 'acknowledged', 'dismissed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_digital_twin_insights_org_idx
  on public.business_digital_twin_insights (organization_id, status, created_at desc);

create table if not exists public.business_digital_twin_audit (
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

create index if not exists business_digital_twin_audit_org_idx
  on public.business_digital_twin_audit (organization_id, created_at desc);

alter table public.business_digital_twin_settings enable row level security;
alter table public.business_digital_twin_entities enable row level security;
alter table public.business_digital_twin_processes enable row level security;
alter table public.business_digital_twin_dependency_items enable row level security;
alter table public.business_digital_twin_simulations enable row level security;
alter table public.business_digital_twin_capacity enable row level security;
alter table public.business_digital_twin_impacts enable row level security;
alter table public.business_digital_twin_scenarios enable row level security;
alter table public.business_digital_twin_insights enable row level security;
alter table public.business_digital_twin_audit enable row level security;
revoke all on public.business_digital_twin_settings from authenticated, anon;
revoke all on public.business_digital_twin_entities from authenticated, anon;
revoke all on public.business_digital_twin_processes from authenticated, anon;
revoke all on public.business_digital_twin_dependency_items from authenticated, anon;
revoke all on public.business_digital_twin_simulations from authenticated, anon;
revoke all on public.business_digital_twin_capacity from authenticated, anon;
revoke all on public.business_digital_twin_impacts from authenticated, anon;
revoke all on public.business_digital_twin_scenarios from authenticated, anon;
revoke all on public.business_digital_twin_insights from authenticated, anon;
revoke all on public.business_digital_twin_audit from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'business_digital_twin_center', v.description
from (values
  ('business_digital_twin.view', 'View Business Digital Twin Center', 'View organizational model, dependencies, simulations, and twin intelligence'),
  ('business_digital_twin.manage', 'Manage Business Digital Twin Center', 'Acknowledge insights, resolve dependencies, and manage twin scenarios')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'business_digital_twin.view'), ('owner', 'business_digital_twin.manage'),
  ('administrator', 'business_digital_twin.view'), ('administrator', 'business_digital_twin.manage'),
  ('manager', 'business_digital_twin.view'), ('manager', 'business_digital_twin.manage'),
  ('employee', 'business_digital_twin.view'),
  ('support_agent', 'business_digital_twin.view'),
  ('moderator', 'business_digital_twin.view'),
  ('viewer', 'business_digital_twin.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._bdt438_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'user_id', v_user_id,
    'can_executive', public._irp_has_permission('business_digital_twin.manage', v_org_id),
    'can_manage', public._irp_has_permission('business_digital_twin.manage', v_org_id),
    'can_view', public._irp_has_permission('business_digital_twin.view', v_org_id)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', 'Access denied');
end; $$;

create or replace function public._bdt438_log(
  p_org_id uuid, p_user_id uuid, p_item_type text, p_item_id uuid, p_action text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.business_digital_twin_audit
    (organization_id, user_id, item_type, item_id, action, description)
  values (p_org_id, p_user_id, p_item_type, p_item_id, p_action, left(p_desc, 500));
end; $$;

create or replace function public._bdt438_entity_json(e public.business_digital_twin_entities)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', e.id, 'title', e.title, 'summary', e.summary, 'owner', e.owner_label,
    'dependencies', e.dependencies, 'criticality', e.criticality, 'status_key', e.status_key,
    'section_key', e.section_key, 'item_type', 'entity'
  );
$$;

create or replace function public._bdt438_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.business_digital_twin_settings (organization_id)
  values (p_org_id) on conflict do nothing;

  if exists (select 1 from public.business_digital_twin_entities where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.business_digital_twin_entities
    (organization_id, section_key, title, summary, owner_label, dependencies, criticality, status_key)
  values
    (p_org_id, 'organization_model', 'Executive Operations Model', 'Cross-functional operating model spanning support, sales, finance, and product.', 'COO', 'Support · Sales · Finance · Product', 'high', 'verified'),
    (p_org_id, 'teams', 'Support Team', 'Front-line support handling customer requests and escalations.', 'Support Lead', 'Ticketing · Knowledge Base · Approvals', 'high', 'requires_attention'),
    (p_org_id, 'teams', 'Finance Operations', 'Billing, payroll coordination, and vendor payments.', 'CFO', 'Payroll vendor · ERP · Approvals', 'critical', 'verified'),
    (p_org_id, 'customers', 'Enterprise Customer Segment', 'Top accounts with dedicated success coverage.', 'Customer Success', 'CRM · Support · Billing', 'high', 'information'),
    (p_org_id, 'vendors', 'Payroll Provider', 'External payroll processing vendor.', 'Finance Lead', 'Finance team · Employee records', 'critical', 'requires_attention'),
    (p_org_id, 'projects', 'Business Pack Launch', 'Launch initiative for new Business Pack module.', 'Product Lead', 'Support · Sales · Engineering', 'high', 'waiting'),
    (p_org_id, 'systems', 'Support Platform', 'Primary customer support ticketing system.', 'Support Lead', 'CRM · Knowledge Base', 'high', 'verified'),
    (p_org_id, 'workflows', 'Approval Chain — Procurement', 'Multi-step approval for vendor purchases.', 'Operations', 'Finance · Legal · Procurement', 'medium', 'requires_attention'),
    (p_org_id, 'dependencies', 'Payroll vendor dependency', 'Payroll depends on a single external vendor.', 'CFO', 'All employees · Finance', 'critical', 'requires_attention'),
    (p_org_id, 'simulations', 'Support surge simulation', 'Model impact when support requests double.', 'COO', 'Support · Capacity · Vendors', 'high', 'information');

  insert into public.business_digital_twin_processes
    (organization_id, workflow_type, title, start_label, actions_label, approvals_label, outcomes_label, status_key)
  values
    (p_org_id, 'support', 'Support ticket workflow', 'Customer submits request', 'Triage · Assign · Resolve', 'Manager escalation when SLA at risk', 'Resolved · Escalated · Closed', 'verified'),
    (p_org_id, 'sales', 'Sales opportunity workflow', 'Lead qualified', 'Discovery · Proposal · Negotiation', 'Discount approval above threshold', 'Won · Lost · Nurture', 'verified'),
    (p_org_id, 'finance', 'Invoice approval workflow', 'Invoice received', 'Validate · Code · Schedule payment', 'CFO approval above limit', 'Paid · Rejected · Deferred', 'verified'),
    (p_org_id, 'approval', 'Procurement approval chain', 'Purchase request submitted', 'Budget check · Vendor review', 'Finance · Legal · Procurement sign-off', 'Approved · Rejected · Returned', 'requires_attention'),
    (p_org_id, 'customer_journey', 'Onboarding journey', 'Account activated', 'Welcome · Setup · Training', 'Success manager checkpoint', 'Active · At risk · Churned', 'information');

  insert into public.business_digital_twin_dependency_items
    (organization_id, dependency_type, title, summary, status_key, suggested_action)
  values
    (p_org_id, 'vendor', 'Payroll depends on a single external vendor', 'Payroll processing has no secondary vendor failover.', 'requires_attention', 'Evaluate backup payroll provider.'),
    (p_org_id, 'employee', 'Critical approval depends on one employee', 'Procurement approvals bottleneck on one approver.', 'requires_attention', 'Document backup approver and cross-train.'),
    (p_org_id, 'system', 'Support platform integration dependency', 'CRM sync failure blocks customer context in tickets.', 'waiting', 'Review integration health monitoring.'),
    (p_org_id, 'project', 'Business Pack launch blocked by vendor API', 'Platform migration dependency affects launch timeline.', 'waiting', 'Resolve vendor API upgrade before launch.');

  insert into public.business_digital_twin_simulations
    (organization_id, scenario_type, title, prompt, impact_summary, status_key)
  values
    (p_org_id, 'support_surge', 'Support requests double', 'What happens if support requests double?', 'SLA breach risk within 10 days; backlog grows 2× without staffing change.', 'requires_attention'),
    (p_org_id, 'market_expansion', 'Customer volume increases 50%', 'What happens if customer volume increases 50%?', 'Support and onboarding capacity require +2 FTE within one quarter.', 'information'),
    (p_org_id, 'vendor_failure', 'Vendor becomes unavailable', 'What happens if payroll vendor becomes unavailable?', 'Payroll processing halted; finance escalation required immediately.', 'not_allowed'),
    (p_org_id, 'employee_departure', 'Key approver departure', 'What happens if critical approver departs?', 'Procurement approvals delay 5–7 days until backup assigned.', 'requires_attention'),
    (p_org_id, 'revenue_drop', 'Revenue drop scenario', 'What happens if revenue drops 15%?', 'Staffing plan review triggered; discretionary projects paused.', 'information');

  insert into public.business_digital_twin_capacity
    (organization_id, team_label, workload_pct, available_resources, bottleneck_label, days_to_capacity, status_key)
  values
    (p_org_id, 'Support Team', 86.00, '1 open headcount · 2 part-time contractors', 'Ticket triage queue', 14, 'requires_attention'),
    (p_org_id, 'Finance Operations', 62.00, 'Full team · seasonal buffer', 'Month-end close', null, 'verified'),
    (p_org_id, 'Customer Success', 74.00, 'Dedicated CSMs for top accounts', 'Onboarding backlog', 21, 'requires_attention');

  insert into public.business_digital_twin_impacts
    (organization_id, change_title, impact_summary, risk_summary, affected_teams, affected_systems, status_key)
  values
    (p_org_id, 'Changing approval process', 'Adds legal review step to procurement approvals.', 'Approval cycle extends 2–3 days.', 'Finance · Legal · Procurement', 'ERP · Approval workflow', 'requires_attention'),
    (p_org_id, 'CRM integration upgrade', 'Improves customer data sync reliability.', 'Brief sync downtime during migration window.', 'Support · Sales · Customer Success', 'CRM · Support Platform', 'waiting');

  insert into public.business_digital_twin_scenarios
    (organization_id, scenario_name, case_type, expected_revenue, expected_support_load, expected_staffing, summary, status_key)
  values
    (p_org_id, 'New Business Pack Launch', 'best', '+22% revenue uplift', '+15% support volume', '+2 support FTE', 'Strong adoption with manageable support impact.', 'verified'),
    (p_org_id, 'New Business Pack Launch', 'expected', '+12% revenue uplift', '+28% support volume', '+1 support FTE · 1 contractor', 'Planned launch with staged onboarding support.', 'information'),
    (p_org_id, 'New Business Pack Launch', 'worst', '+4% revenue uplift', '+55% support volume', '+3 support FTE · overtime', 'Support surge exceeds capacity without early hiring.', 'requires_attention');

  insert into public.business_digital_twin_insights
    (organization_id, insight_type, recommendation, reason)
  values
    (p_org_id, 'increase_staffing', 'Increase support staffing before Business Pack launch', 'Support team reaches capacity in approximately 14 days at current growth.'),
    (p_org_id, 'reduce_dependency', 'Reduce single-vendor payroll dependency', 'Payroll depends on one external vendor with no documented failover.'),
    (p_org_id, 'improve_workflow', 'Improve procurement approval workflow', 'Critical approval depends on one employee — bottleneck detected.'),
    (p_org_id, 'document_knowledge', 'Document critical approval knowledge', 'Backup approver procedures not documented for procurement chain.'),
    (p_org_id, 'diversify_vendors', 'Diversify critical vendor relationships', 'Payroll and hosting vendors enter renewal windows this quarter.');
end; $$;

create or replace function public.get_business_digital_twin_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid;
  v_org jsonb; v_teams jsonb; v_customers jsonb; v_vendors jsonb; v_projects jsonb;
  v_systems jsonb; v_workflows jsonb; v_deps_section jsonb; v_sims_section jsonb;
  v_processes jsonb; v_dependencies jsonb; v_simulations jsonb; v_capacity jsonb;
  v_impacts jsonb; v_scenarios jsonb; v_insights jsonb;
begin
  perform public._irp_require_permission('business_digital_twin.view');
  v_ctx := public._bdt438_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', coalesce(v_ctx->>'error', 'Access denied'));
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  perform public._bdt438_seed(v_org_id);

  select coalesce(jsonb_agg(public._bdt438_entity_json(e) order by e.updated_at desc), '[]'::jsonb)
  into v_org from public.business_digital_twin_entities e
  where e.organization_id = v_org_id and e.section_key = 'organization_model';

  select coalesce(jsonb_agg(public._bdt438_entity_json(e) order by e.title), '[]'::jsonb)
  into v_teams from public.business_digital_twin_entities e
  where e.organization_id = v_org_id and e.section_key = 'teams';

  select coalesce(jsonb_agg(public._bdt438_entity_json(e) order by e.title), '[]'::jsonb)
  into v_customers from public.business_digital_twin_entities e
  where e.organization_id = v_org_id and e.section_key = 'customers';

  select coalesce(jsonb_agg(public._bdt438_entity_json(e) order by e.title), '[]'::jsonb)
  into v_vendors from public.business_digital_twin_entities e
  where e.organization_id = v_org_id and e.section_key = 'vendors';

  select coalesce(jsonb_agg(public._bdt438_entity_json(e) order by e.title), '[]'::jsonb)
  into v_projects from public.business_digital_twin_entities e
  where e.organization_id = v_org_id and e.section_key = 'projects';

  select coalesce(jsonb_agg(public._bdt438_entity_json(e) order by e.title), '[]'::jsonb)
  into v_systems from public.business_digital_twin_entities e
  where e.organization_id = v_org_id and e.section_key = 'systems';

  select coalesce(jsonb_agg(public._bdt438_entity_json(e) order by e.title), '[]'::jsonb)
  into v_workflows from public.business_digital_twin_entities e
  where e.organization_id = v_org_id and e.section_key = 'workflows';

  select coalesce(jsonb_agg(public._bdt438_entity_json(e) order by e.title), '[]'::jsonb)
  into v_deps_section from public.business_digital_twin_entities e
  where e.organization_id = v_org_id and e.section_key = 'dependencies';

  select coalesce(jsonb_agg(public._bdt438_entity_json(e) order by e.title), '[]'::jsonb)
  into v_sims_section from public.business_digital_twin_entities e
  where e.organization_id = v_org_id and e.section_key = 'simulations';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'workflow_type', p.workflow_type, 'title', p.title,
    'start_label', p.start_label, 'actions_label', p.actions_label,
    'approvals_label', p.approvals_label, 'outcomes_label', p.outcomes_label,
    'status_key', p.status_key, 'item_type', 'process'
  ) order by p.workflow_type), '[]'::jsonb)
  into v_processes from public.business_digital_twin_processes p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'dependency_type', d.dependency_type, 'title', d.title, 'summary', d.summary,
    'status_key', d.status_key, 'suggested_action', d.suggested_action, 'item_type', 'dependency'
  ) order by d.created_at desc), '[]'::jsonb)
  into v_dependencies from public.business_digital_twin_dependency_items d
  where d.organization_id = v_org_id and not d.resolved;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'scenario_type', s.scenario_type, 'title', s.title, 'prompt', s.prompt,
    'impact_summary', s.impact_summary, 'status_key', s.status_key, 'item_type', 'simulation'
  ) order by s.created_at desc), '[]'::jsonb)
  into v_simulations from public.business_digital_twin_simulations s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'team_label', c.team_label, 'workload_pct', c.workload_pct,
    'available_resources', c.available_resources, 'bottleneck_label', c.bottleneck_label,
    'days_to_capacity', c.days_to_capacity, 'status_key', c.status_key, 'item_type', 'capacity'
  ) order by c.workload_pct desc), '[]'::jsonb)
  into v_capacity from public.business_digital_twin_capacity c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'change_title', i.change_title, 'impact_summary', i.impact_summary,
    'risk_summary', i.risk_summary, 'affected_teams', i.affected_teams,
    'affected_systems', i.affected_systems, 'status_key', i.status_key, 'item_type', 'impact'
  ) order by i.created_at desc), '[]'::jsonb)
  into v_impacts from public.business_digital_twin_impacts i where i.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', sc.id, 'scenario_name', sc.scenario_name, 'case_type', sc.case_type,
    'expected_revenue', sc.expected_revenue, 'expected_support_load', sc.expected_support_load,
    'expected_staffing', sc.expected_staffing, 'summary', sc.summary,
    'status_key', sc.status_key, 'item_type', 'scenario'
  ) order by sc.scenario_name, case sc.case_type when 'best' then 1 when 'expected' then 2 else 3 end), '[]'::jsonb)
  into v_scenarios from public.business_digital_twin_scenarios sc where sc.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', ins.id, 'insight_type', ins.insight_type, 'recommendation', ins.recommendation,
    'reason', ins.reason, 'status', ins.status, 'item_type', 'insight'
  ) order by ins.created_at desc), '[]'::jsonb)
  into v_insights from public.business_digital_twin_insights ins
  where ins.organization_id = v_org_id and ins.status = 'open';

  return jsonb_build_object(
    'found', true,
    'philosophy', 'Aipify should not merely store information — it should understand how the organization actually operates. The Digital Twin is the operational model of the business.',
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'governance_note', 'All Digital Twin data is role-controlled, auditable, and explainable — no hidden assumptions.',
    'executive_dashboard', jsonb_build_object(
      'organization_overview', 'Living model across teams, systems, vendors, and workflows.',
      'operational_health', 'Support capacity at 86% — bottleneck within 14 days.',
      'dependency_count', jsonb_array_length(v_dependencies),
      'simulation_count', jsonb_array_length(v_simulations),
      'strategic_risk_count', (select count(*) from public.business_digital_twin_dependency_items where organization_id = v_org_id and not resolved and status_key in ('requires_attention', 'not_allowed'))
    ),
    'sections', jsonb_build_object(
      'organization_model', v_org,
      'teams', v_teams,
      'customers', v_customers,
      'vendors', v_vendors,
      'projects', v_projects,
      'systems', v_systems,
      'workflows', v_workflows,
      'dependencies', v_deps_section,
      'simulations', v_sims_section
    ),
    'process_mapping', v_processes,
    'dependency_intelligence', v_dependencies,
    'workflow_simulations', v_simulations,
    'capacity_intelligence', v_capacity,
    'operational_impacts', v_impacts,
    'scenario_planning', v_scenarios,
    'companion_insights', v_insights,
    'statistics', jsonb_build_object(
      'entity_count', (select count(*) from public.business_digital_twin_entities where organization_id = v_org_id),
      'process_count', jsonb_array_length(v_processes),
      'dependency_count', jsonb_array_length(v_dependencies),
      'simulation_count', jsonb_array_length(v_simulations),
      'capacity_count', jsonb_array_length(v_capacity),
      'scenario_count', jsonb_array_length(v_scenarios),
      'insight_count', jsonb_array_length(v_insights)
    ),
    'privacy_note', 'Organizational metadata and operational patterns only — no individual surveillance or personal scoring.'
  );
end; $$;

create or replace function public.manage_business_digital_twin_item(
  p_item_type text,
  p_item_id uuid,
  p_action text
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid;
begin
  v_ctx := public._bdt438_access();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Not authorized';
  end if;
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if p_action not in ('acknowledge', 'dismiss', 'resolve', 'complete') then
    raise exception 'Invalid action';
  end if;

  if p_item_type = 'insight' then
    update public.business_digital_twin_insights set
      status = case p_action
        when 'acknowledge' then 'acknowledged'
        when 'dismiss' then 'dismissed'
        else status end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'dependency' then
    update public.business_digital_twin_dependency_items set
      resolved = p_action in ('resolve', 'dismiss', 'complete'),
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  end if;

  perform public._bdt438_log(v_org_id, v_user_id, p_item_type, p_item_id, p_action, 'Business digital twin item updated');
  return jsonb_build_object('ok', true, 'action', p_action);
end; $$;

grant execute on function public.get_business_digital_twin_center() to authenticated;
grant execute on function public.manage_business_digital_twin_item(text, uuid, text) to authenticated;
