-- Phase 439 — Autonomous Business Improvement Engine (Customer App)
-- Route: /app/intelligence/improvements

create table if not exists public.business_improvement_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  opportunity_discovery_enabled boolean not null default true,
  revenue_intelligence_enabled boolean not null default true,
  cost_optimization_enabled boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.business_improvement_section_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  section_key text not null check (section_key in (
    'improvement_opportunities', 'recommended_actions', 'revenue_opportunities',
    'cost_savings', 'process_improvements', 'customer_experience_improvements',
    'completed_improvements'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  suggested_action text not null default '',
  impact_score text not null default 'medium' check (impact_score in ('low', 'medium', 'high', 'critical')),
  risk_score text not null default 'low' check (risk_score in ('low', 'medium', 'high', 'critical')),
  complexity_score text not null default 'medium' check (complexity_score in ('low', 'medium', 'high', 'critical')),
  priority_level text not null default 'medium' check (priority_level in ('low', 'medium', 'high', 'critical')),
  estimated_benefit text not null default '',
  status_key text not null default 'information' check (status_key in (
    'completed', 'requires_attention', 'waiting', 'information', 'restricted', 'verified', 'not_allowed'
  )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_improvement_section_items_org_idx
  on public.business_improvement_section_items (organization_id, section_key, priority_level, updated_at desc);

create table if not exists public.business_improvement_discovery_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  analysis_domain text not null check (analysis_domain in (
    'operations', 'support', 'sales', 'finance', 'projects', 'customers', 'knowledge', 'workflows'
  )),
  signal_type text not null check (signal_type in (
    'bottleneck', 'delay', 'redundant_work', 'underutilized_resource'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  status_key text not null default 'requires_attention',
  created_at timestamptz not null default now()
);

create index if not exists business_improvement_discovery_signals_org_idx
  on public.business_improvement_discovery_signals (organization_id, analysis_domain);

create table if not exists public.business_improvement_revenue_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  opportunity_type text not null check (opportunity_type in (
    'upsell', 'cross_sell', 'renewal', 'expansion'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  suggested_action text not null default '',
  customer_count integer not null default 0,
  status_key text not null default 'requires_attention',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_improvement_revenue_items_org_idx
  on public.business_improvement_revenue_items (organization_id, opportunity_type);

create table if not exists public.business_improvement_cost_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  cost_type text not null check (cost_type in (
    'unused_license', 'duplicate_tool', 'inefficient_process', 'vendor_cost_increase'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  potential_savings_label text not null default '',
  status_key text not null default 'requires_attention',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_improvement_cost_items_org_idx
  on public.business_improvement_cost_items (organization_id, cost_type);

create table if not exists public.business_improvement_process_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workflow_type text not null check (workflow_type in (
    'approval_chain', 'support', 'sales', 'employee'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  time_reduction_label text not null default '',
  status_key text not null default 'requires_attention',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_improvement_process_items_org_idx
  on public.business_improvement_process_items (organization_id, workflow_type);

create table if not exists public.business_improvement_cx_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_type text not null check (metric_type in (
    'response_time', 'resolution_time', 'customer_feedback', 'escalation_rate'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  benchmark_label text not null default '',
  status_key text not null default 'requires_attention',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_improvement_cx_items_org_idx
  on public.business_improvement_cx_items (organization_id, metric_type);

create table if not exists public.business_improvement_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  problem text not null,
  cause text not null default '' check (char_length(cause) <= 500),
  recommended_solution text not null default '',
  expected_outcome text not null default '',
  estimated_benefit text not null default '',
  impact_score text not null default 'medium',
  risk_score text not null default 'low',
  complexity_score text not null default 'medium',
  priority_level text not null default 'medium',
  status text not null default 'pending' check (status in ('pending', 'approved', 'dismissed', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_improvement_plans_org_idx
  on public.business_improvement_plans (organization_id, status, priority_level);

create table if not exists public.business_improvement_advisor (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  recommendation_type text not null check (recommendation_type in (
    'simplify_process', 'reduce_approvals', 'consolidate_vendors',
    'upgrade_customers', 'improve_onboarding', 'automate_tasks'
  )),
  recommendation text not null,
  reason text not null default '' check (char_length(reason) <= 500),
  status text not null default 'open' check (status in ('open', 'acknowledged', 'dismissed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_improvement_advisor_org_idx
  on public.business_improvement_advisor (organization_id, status, created_at desc);

create table if not exists public.business_improvement_audit (
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

create index if not exists business_improvement_audit_org_idx
  on public.business_improvement_audit (organization_id, created_at desc);

alter table public.business_improvement_settings enable row level security;
alter table public.business_improvement_section_items enable row level security;
alter table public.business_improvement_discovery_signals enable row level security;
alter table public.business_improvement_revenue_items enable row level security;
alter table public.business_improvement_cost_items enable row level security;
alter table public.business_improvement_process_items enable row level security;
alter table public.business_improvement_cx_items enable row level security;
alter table public.business_improvement_plans enable row level security;
alter table public.business_improvement_advisor enable row level security;
alter table public.business_improvement_audit enable row level security;
revoke all on public.business_improvement_settings from authenticated, anon;
revoke all on public.business_improvement_section_items from authenticated, anon;
revoke all on public.business_improvement_discovery_signals from authenticated, anon;
revoke all on public.business_improvement_revenue_items from authenticated, anon;
revoke all on public.business_improvement_cost_items from authenticated, anon;
revoke all on public.business_improvement_process_items from authenticated, anon;
revoke all on public.business_improvement_cx_items from authenticated, anon;
revoke all on public.business_improvement_plans from authenticated, anon;
revoke all on public.business_improvement_advisor from authenticated, anon;
revoke all on public.business_improvement_audit from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'business_improvement_center', v.description
from (values
  ('business_improvement.view', 'View Business Improvement Center', 'View improvement opportunities, scoring, and improvement intelligence'),
  ('business_improvement.manage', 'Manage Business Improvement Center', 'Acknowledge advisor recommendations and manage improvement plans')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'business_improvement.view'), ('owner', 'business_improvement.manage'),
  ('administrator', 'business_improvement.view'), ('administrator', 'business_improvement.manage'),
  ('manager', 'business_improvement.view'), ('manager', 'business_improvement.manage'),
  ('employee', 'business_improvement.view'),
  ('support_agent', 'business_improvement.view'),
  ('moderator', 'business_improvement.view'),
  ('viewer', 'business_improvement.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._bi439_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'user_id', v_user_id,
    'can_executive', public._irp_has_permission('business_improvement.manage', v_org_id),
    'can_manage', public._irp_has_permission('business_improvement.manage', v_org_id),
    'can_view', public._irp_has_permission('business_improvement.view', v_org_id)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', 'Access denied');
end; $$;

create or replace function public._bi439_log(
  p_org_id uuid, p_user_id uuid, p_item_type text, p_item_id uuid, p_action text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.business_improvement_audit
    (organization_id, user_id, item_type, item_id, action, description)
  values (p_org_id, p_user_id, p_item_type, p_item_id, p_action, left(p_desc, 500));
end; $$;

create or replace function public._bi439_section_json(s public.business_improvement_section_items)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', s.id, 'title', s.title, 'summary', s.summary, 'suggested_action', s.suggested_action,
    'impact_score', s.impact_score, 'risk_score', s.risk_score, 'complexity_score', s.complexity_score,
    'priority_level', s.priority_level, 'estimated_benefit', s.estimated_benefit,
    'status_key', s.status_key, 'section_key', s.section_key, 'item_type', 'section'
  );
$$;

create or replace function public._bi439_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.business_improvement_settings (organization_id)
  values (p_org_id) on conflict do nothing;

  if exists (select 1 from public.business_improvement_section_items where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.business_improvement_section_items
    (organization_id, section_key, title, summary, suggested_action, impact_score, risk_score, complexity_score, priority_level, estimated_benefit, status_key)
  values
    (p_org_id, 'improvement_opportunities', 'Consolidate duplicate support tools', 'Multiple tools performing the same function increase cost and complexity.', 'Evaluate tool consolidation plan.', 'high', 'low', 'medium', 'high', 'Potential annual savings $12,400', 'requires_attention'),
    (p_org_id, 'improvement_opportunities', 'Streamline procurement approvals', 'Approval chain contains unnecessary steps.', 'Remove redundant legal review for purchases under threshold.', 'medium', 'low', 'low', 'high', 'Estimated time reduction 37%', 'requires_attention'),
    (p_org_id, 'recommended_actions', 'Launch upgrade campaign', '24 customers qualify for higher-tier plans.', 'Launch upgrade campaign targeting qualified accounts.', 'high', 'low', 'medium', 'critical', 'Revenue uplift opportunity', 'requires_attention'),
    (p_org_id, 'recommended_actions', 'Improve onboarding workflow', 'Customer onboarding takes longer than industry benchmarks.', 'Reduce onboarding steps and automate welcome sequence.', 'high', 'low', 'medium', 'high', 'Improved retention and NPS', 'waiting'),
    (p_org_id, 'revenue_opportunities', 'Upsell qualified customers', '24 customers qualify for higher-tier plans based on usage patterns.', 'Launch upgrade campaign.', 'high', 'low', 'medium', 'critical', 'Expansion revenue', 'requires_attention'),
    (p_org_id, 'cost_savings', 'Duplicate tool consolidation', 'Multiple tools performing the same function.', 'Consolidate to single platform license.', 'medium', 'low', 'medium', 'high', 'Potential annual savings $12,400', 'requires_attention'),
    (p_org_id, 'process_improvements', 'Approval chain optimization', 'Approval chain contains unnecessary steps.', 'Reduce approvals for low-value purchases.', 'medium', 'low', 'low', 'high', 'Estimated time reduction 37%', 'requires_attention'),
    (p_org_id, 'customer_experience_improvements', 'Onboarding duration reduction', 'Customer onboarding takes longer than industry benchmarks.', 'Automate setup steps and improve welcome content.', 'high', 'low', 'medium', 'high', 'Faster time-to-value', 'requires_attention'),
    (p_org_id, 'completed_improvements', 'Support macro library rollout', 'Standardized response macros reduced handle time.', 'Maintain and expand macro library quarterly.', 'medium', 'low', 'low', 'medium', '12% faster resolution', 'completed');

  insert into public.business_improvement_discovery_signals
    (organization_id, analysis_domain, signal_type, title, summary, status_key)
  values
    (p_org_id, 'support', 'bottleneck', 'Support triage bottleneck', 'Ticket queue grows faster than resolution during peak hours.', 'requires_attention'),
    (p_org_id, 'workflows', 'redundant_work', 'Duplicate approval steps', 'Procurement workflow repeats budget validation twice.', 'requires_attention'),
    (p_org_id, 'finance', 'delay', 'Month-end close delay', 'Manual reconciliation adds 2 days to close cycle.', 'waiting'),
    (p_org_id, 'operations', 'underutilized_resource', 'Underutilized contractor capacity', 'Part-time contractors available but not assigned to backlog.', 'information'),
    (p_org_id, 'sales', 'bottleneck', 'Proposal approval delay', 'Discount approvals wait average 3 days.', 'requires_attention'),
    (p_org_id, 'customers', 'delay', 'Onboarding delay pattern', 'Enterprise onboarding exceeds benchmark by 40%.', 'requires_attention');

  insert into public.business_improvement_revenue_items
    (organization_id, opportunity_type, title, summary, suggested_action, customer_count, status_key)
  values
    (p_org_id, 'upsell', '24 customers qualify for higher-tier plans', 'Usage patterns indicate readiness for plan upgrade.', 'Launch upgrade campaign.', 24, 'requires_attention'),
    (p_org_id, 'cross_sell', 'Business Pack cross-sell opportunity', 'Support-heavy customers may benefit from Business Pack add-on.', 'Target accounts with high support volume.', 18, 'information'),
    (p_org_id, 'renewal', 'Renewal preparation window', '12 enterprise accounts enter renewal within 90 days.', 'Schedule success reviews before renewal.', 12, 'waiting'),
    (p_org_id, 'expansion', 'Regional expansion opportunity', 'Partner channel revenue up — capacity for geographic expansion.', 'Evaluate expansion playbook.', 0, 'verified');

  insert into public.business_improvement_cost_items
    (organization_id, cost_type, title, summary, potential_savings_label, status_key)
  values
    (p_org_id, 'duplicate_tool', 'Multiple tools performing the same function', 'Three overlapping collaboration tools detected.', '$12,400 annual savings', 'requires_attention'),
    (p_org_id, 'unused_license', 'Unused software licenses', '14 inactive SaaS seats across two platforms.', '$4,200 annual savings', 'requires_attention'),
    (p_org_id, 'inefficient_process', 'Manual invoice processing', 'Finance team spends 6 hours weekly on manual entry.', '$8,800 annual savings', 'information'),
    (p_org_id, 'vendor_cost_increase', 'Hosting vendor cost increase', 'Renewal quote 12% above current contract.', 'Negotiate or evaluate alternatives', 'waiting');

  insert into public.business_improvement_process_items
    (organization_id, workflow_type, title, summary, time_reduction_label, status_key)
  values
    (p_org_id, 'approval_chain', 'Approval chain contains unnecessary steps', 'Legal review duplicated for low-value purchases.', '37% time reduction', 'requires_attention'),
    (p_org_id, 'support', 'Support escalation workflow', 'Escalation path adds redundant handoffs.', '22% time reduction', 'information'),
    (p_org_id, 'sales', 'Sales discount approval', 'Three-tier approval for standard discounts.', '18% time reduction', 'waiting'),
    (p_org_id, 'employee', 'PTO request workflow', 'Manager and HR both approve identical requests.', '15% time reduction', 'information');

  insert into public.business_improvement_cx_items
    (organization_id, metric_type, title, summary, benchmark_label, status_key)
  values
    (p_org_id, 'response_time', 'First response time above target', 'Average first response 18% above SLA target.', 'Industry benchmark exceeded', 'requires_attention'),
    (p_org_id, 'resolution_time', 'Resolution time improving', 'Resolution time down 8% over 30 days.', 'Trending toward benchmark', 'verified'),
    (p_org_id, 'customer_feedback', 'Onboarding feedback gap', 'Customers report onboarding complexity in surveys.', 'Below industry NPS benchmark', 'requires_attention'),
    (p_org_id, 'escalation_rate', 'Escalation rate stable', 'Escalation rate within acceptable range.', 'Within benchmark', 'information');

  insert into public.business_improvement_plans
    (organization_id, problem, cause, recommended_solution, expected_outcome, estimated_benefit, impact_score, risk_score, complexity_score, priority_level, status)
  values
    (p_org_id, 'Duplicate tools increase cost', 'Three teams adopted overlapping collaboration tools independently.', 'Consolidate to single approved platform.', 'Reduced license cost and simpler onboarding.', '$12,400 annual savings', 'high', 'low', 'medium', 'high', 'pending'),
    (p_org_id, 'Slow customer onboarding', 'Manual setup steps and unclear welcome sequence.', 'Automate onboarding checklist and improve welcome content.', 'Faster time-to-value and higher NPS.', 'Improved retention', 'high', 'low', 'medium', 'high', 'pending'),
    (p_org_id, 'Revenue expansion untapped', '24 customers exceed usage thresholds for higher tier.', 'Launch targeted upgrade campaign with success review.', 'Increased ARPU from qualified accounts.', 'Expansion revenue', 'high', 'low', 'low', 'critical', 'pending');

  insert into public.business_improvement_advisor
    (organization_id, recommendation_type, recommendation, reason)
  values
    (p_org_id, 'simplify_process', 'Simplify procurement approval process', 'Approval chain contains unnecessary steps — 37% time reduction possible.'),
    (p_org_id, 'reduce_approvals', 'Reduce low-value purchase approvals', 'Duplicate budget validation adds delay without risk reduction.'),
    (p_org_id, 'consolidate_vendors', 'Consolidate duplicate collaboration tools', 'Multiple tools performing the same function — $12,400 potential savings.'),
    (p_org_id, 'upgrade_customers', 'Launch upgrade campaign for 24 qualified customers', 'Usage patterns indicate readiness for higher-tier plans.'),
    (p_org_id, 'improve_onboarding', 'Improve customer onboarding workflow', 'Onboarding duration exceeds industry benchmarks.'),
    (p_org_id, 'automate_tasks', 'Automate repetitive invoice processing', 'Finance team spends 6 hours weekly on manual entry.');
end; $$;

create or replace function public.get_business_improvement_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid;
  v_opportunities jsonb; v_recommended jsonb; v_revenue_section jsonb; v_cost_section jsonb;
  v_process_section jsonb; v_cx_section jsonb; v_completed jsonb;
  v_discovery jsonb; v_revenue jsonb; v_cost jsonb; v_process jsonb; v_cx jsonb;
  v_plans jsonb; v_advisor jsonb;
  v_total_opportunities integer; v_pending integer; v_completed_count integer;
begin
  perform public._irp_require_permission('business_improvement.view');
  v_ctx := public._bi439_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', coalesce(v_ctx->>'error', 'Access denied'));
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  perform public._bi439_seed(v_org_id);

  select coalesce(jsonb_agg(public._bi439_section_json(s) order by
    case s.priority_level when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end), '[]'::jsonb)
  into v_opportunities from public.business_improvement_section_items s
  where s.organization_id = v_org_id and s.section_key = 'improvement_opportunities';

  select coalesce(jsonb_agg(public._bi439_section_json(s) order by
    case s.priority_level when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end), '[]'::jsonb)
  into v_recommended from public.business_improvement_section_items s
  where s.organization_id = v_org_id and s.section_key = 'recommended_actions';

  select coalesce(jsonb_agg(public._bi439_section_json(s) order by s.updated_at desc), '[]'::jsonb)
  into v_revenue_section from public.business_improvement_section_items s
  where s.organization_id = v_org_id and s.section_key = 'revenue_opportunities';

  select coalesce(jsonb_agg(public._bi439_section_json(s) order by s.updated_at desc), '[]'::jsonb)
  into v_cost_section from public.business_improvement_section_items s
  where s.organization_id = v_org_id and s.section_key = 'cost_savings';

  select coalesce(jsonb_agg(public._bi439_section_json(s) order by s.updated_at desc), '[]'::jsonb)
  into v_process_section from public.business_improvement_section_items s
  where s.organization_id = v_org_id and s.section_key = 'process_improvements';

  select coalesce(jsonb_agg(public._bi439_section_json(s) order by s.updated_at desc), '[]'::jsonb)
  into v_cx_section from public.business_improvement_section_items s
  where s.organization_id = v_org_id and s.section_key = 'customer_experience_improvements';

  select coalesce(jsonb_agg(public._bi439_section_json(s) order by s.updated_at desc), '[]'::jsonb)
  into v_completed from public.business_improvement_section_items s
  where s.organization_id = v_org_id and s.section_key = 'completed_improvements';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'analysis_domain', d.analysis_domain, 'signal_type', d.signal_type,
    'title', d.title, 'summary', d.summary, 'status_key', d.status_key, 'item_type', 'discovery'
  ) order by d.created_at desc), '[]'::jsonb)
  into v_discovery from public.business_improvement_discovery_signals d where d.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'opportunity_type', r.opportunity_type, 'title', r.title, 'summary', r.summary,
    'suggested_action', r.suggested_action, 'customer_count', r.customer_count,
    'status_key', r.status_key, 'item_type', 'revenue'
  ) order by r.customer_count desc), '[]'::jsonb)
  into v_revenue from public.business_improvement_revenue_items r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'cost_type', c.cost_type, 'title', c.title, 'summary', c.summary,
    'potential_savings_label', c.potential_savings_label, 'status_key', c.status_key, 'item_type', 'cost'
  ) order by c.created_at desc), '[]'::jsonb)
  into v_cost from public.business_improvement_cost_items c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'workflow_type', p.workflow_type, 'title', p.title, 'summary', p.summary,
    'time_reduction_label', p.time_reduction_label, 'status_key', p.status_key, 'item_type', 'process'
  ) order by p.created_at desc), '[]'::jsonb)
  into v_process from public.business_improvement_process_items p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', cx.id, 'metric_type', cx.metric_type, 'title', cx.title, 'summary', cx.summary,
    'benchmark_label', cx.benchmark_label, 'status_key', cx.status_key, 'item_type', 'cx'
  ) order by cx.created_at desc), '[]'::jsonb)
  into v_cx from public.business_improvement_cx_items cx where cx.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', pl.id, 'problem', pl.problem, 'cause', pl.cause, 'recommended_solution', pl.recommended_solution,
    'expected_outcome', pl.expected_outcome, 'estimated_benefit', pl.estimated_benefit,
    'impact_score', pl.impact_score, 'risk_score', pl.risk_score, 'complexity_score', pl.complexity_score,
    'priority_level', pl.priority_level, 'status', pl.status, 'item_type', 'plan'
  ) order by case pl.priority_level when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end), '[]'::jsonb)
  into v_plans from public.business_improvement_plans pl
  where pl.organization_id = v_org_id and pl.status in ('pending', 'approved');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'recommendation_type', a.recommendation_type, 'recommendation', a.recommendation,
    'reason', a.reason, 'status', a.status, 'item_type', 'advisor'
  ) order by a.created_at desc), '[]'::jsonb)
  into v_advisor from public.business_improvement_advisor a
  where a.organization_id = v_org_id and a.status = 'open';

  select count(*) into v_total_opportunities from public.business_improvement_section_items
  where organization_id = v_org_id and section_key != 'completed_improvements';

  select count(*) into v_pending from public.business_improvement_plans
  where organization_id = v_org_id and status = 'pending';

  select count(*) into v_completed_count from public.business_improvement_section_items
  where organization_id = v_org_id and section_key = 'completed_improvements';

  return jsonb_build_object(
    'found', true,
    'philosophy', 'Every organization contains hidden opportunities. Aipify continuously searches for efficiency gains, revenue opportunities, cost reductions, and process improvements — as your continuous improvement companion.',
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'governance_note', 'Improvements are recommendations only — no operational changes occur without approval. All recommendations are auditable, explainable, and reviewable.',
    'executive_dashboard', jsonb_build_object(
      'total_opportunities', v_total_opportunities,
      'estimated_revenue_gain', 'Expansion from 24 qualified upgrade accounts',
      'estimated_cost_savings', '$12,400+ annual savings identified',
      'completed_improvements', v_completed_count,
      'pending_improvements', v_pending
    ),
    'sections', jsonb_build_object(
      'improvement_opportunities', v_opportunities,
      'recommended_actions', v_recommended,
      'revenue_opportunities', v_revenue_section,
      'cost_savings', v_cost_section,
      'process_improvements', v_process_section,
      'customer_experience_improvements', v_cx_section,
      'completed_improvements', v_completed
    ),
    'opportunity_discovery', v_discovery,
    'revenue_intelligence', v_revenue,
    'cost_optimization', v_cost,
    'process_optimization', v_process,
    'customer_experience', v_cx,
    'improvement_plans', v_plans,
    'companion_advisor', v_advisor,
    'statistics', jsonb_build_object(
      'opportunity_count', v_total_opportunities,
      'discovery_count', jsonb_array_length(v_discovery),
      'revenue_count', jsonb_array_length(v_revenue),
      'cost_count', jsonb_array_length(v_cost),
      'plan_count', jsonb_array_length(v_plans),
      'advisor_count', jsonb_array_length(v_advisor),
      'completed_count', v_completed_count
    ),
    'privacy_note', 'Aggregated operational patterns only — recommendations require human approval before any change.'
  );
end; $$;

create or replace function public.manage_business_improvement_item(
  p_item_type text,
  p_item_id uuid,
  p_action text
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid;
begin
  v_ctx := public._bi439_access();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Not authorized';
  end if;
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if p_action not in ('acknowledge', 'dismiss', 'approve', 'complete') then
    raise exception 'Invalid action';
  end if;

  if p_item_type = 'advisor' then
    update public.business_improvement_advisor set
      status = case p_action
        when 'acknowledge' then 'acknowledged'
        when 'dismiss' then 'dismissed'
        else status end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'plan' then
    update public.business_improvement_plans set
      status = case p_action
        when 'approve' then 'approved'
        when 'dismiss' then 'dismissed'
        when 'complete' then 'completed'
        else status end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  end if;

  perform public._bi439_log(v_org_id, v_user_id, p_item_type, p_item_id, p_action, 'Business improvement item updated');
  return jsonb_build_object('ok', true, 'action', p_action);
end; $$;

grant execute on function public.get_business_improvement_center() to authenticated;
grant execute on function public.manage_business_improvement_item(text, uuid, text) to authenticated;
