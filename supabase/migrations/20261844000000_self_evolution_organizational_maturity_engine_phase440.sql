-- Phase 440 — Self-Evolution & Organizational Maturity Engine (Customer App)
-- Route: /app/intelligence/maturity

create table if not exists public.organizational_maturity_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  maturity_scoring_enabled boolean not null default true,
  benchmarking_enabled boolean not null default true,
  self_evolution_enabled boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.organizational_maturity_section_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  section_key text not null check (section_key in (
    'maturity_overview', 'department_maturity', 'process_maturity', 'technology_maturity',
    'knowledge_maturity', 'governance_maturity', 'customer_experience_maturity', 'improvement_roadmap'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  maturity_level integer not null default 2 check (maturity_level between 1 and 5),
  explanation text not null default '' check (char_length(explanation) <= 500),
  status_key text not null default 'information' check (status_key in (
    'completed', 'requires_attention', 'waiting', 'information', 'restricted', 'verified', 'not_allowed'
  )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organizational_maturity_section_items_org_idx
  on public.organizational_maturity_section_items (organization_id, section_key, maturity_level desc);

create table if not exists public.organizational_maturity_domain_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  domain_key text not null check (domain_key in (
    'operations', 'finance', 'support', 'sales', 'knowledge', 'security', 'governance', 'automation'
  )),
  maturity_level integer not null default 2 check (maturity_level between 1 and 5),
  score_value numeric(5,2) not null default 0 check (score_value >= 0 and score_value <= 100),
  explanation text not null default '' check (char_length(explanation) <= 500),
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, domain_key)
);

create index if not exists organizational_maturity_domain_scores_org_idx
  on public.organizational_maturity_domain_scores (organization_id, maturity_level desc);

create table if not exists public.organizational_maturity_benchmarks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  domain_key text not null,
  compare_type text not null check (compare_type in (
    'industry', 'company_size', 'business_pack_type', 'region'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  comparison_label text not null default '',
  status_key text not null default 'information',
  created_at timestamptz not null default now()
);

create index if not exists organizational_maturity_benchmarks_org_idx
  on public.organizational_maturity_benchmarks (organization_id, compare_type);

create table if not exists public.organizational_maturity_department_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  department_name text not null,
  dimension_key text not null check (dimension_key in (
    'people', 'processes', 'systems', 'automation', 'documentation'
  )),
  maturity_level integer not null default 2 check (maturity_level between 1 and 5),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  status_key text not null default 'information',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organizational_maturity_department_items_org_idx
  on public.organizational_maturity_department_items (organization_id, department_name);

create table if not exists public.organizational_maturity_roadmaps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  domain_key text not null,
  current_level integer not null check (current_level between 1 and 5),
  target_level integer not null check (target_level between 1 and 5),
  required_improvements text not null default '',
  expected_benefits text not null default '',
  status text not null default 'active' check (status in ('active', 'completed', 'dismissed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organizational_maturity_roadmaps_org_idx
  on public.organizational_maturity_roadmaps (organization_id, status);

create table if not exists public.organizational_maturity_evolution_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  event_type text not null check (event_type in (
    'recommendation_accepted', 'improvement_succeeded', 'improvement_failed', 'measured_value'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  learning_note text not null default '' check (char_length(learning_note) <= 500),
  status_key text not null default 'verified',
  created_at timestamptz not null default now()
);

create index if not exists organizational_maturity_evolution_events_org_idx
  on public.organizational_maturity_evolution_events (organization_id, event_type, created_at desc);

create table if not exists public.organizational_maturity_growth_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  horizon_key text not null check (horizon_key in ('90_day', '6_month', '12_month')),
  domain_key text not null,
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  required_actions text not null default '',
  target_level integer not null default 3 check (target_level between 1 and 5),
  status_key text not null default 'requires_attention',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organizational_maturity_growth_plans_org_idx
  on public.organizational_maturity_growth_plans (organization_id, horizon_key);

create table if not exists public.organizational_maturity_pack_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null check (pack_key in (
    'hosts', 'commerce', 'support', 'growth_partners', 'finance', 'future_packs'
  )),
  maturity_level integer not null default 2 check (maturity_level between 1 and 5),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  explanation text not null default '' check (char_length(explanation) <= 500),
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, pack_key)
);

create index if not exists organizational_maturity_pack_scores_org_idx
  on public.organizational_maturity_pack_scores (organization_id, maturity_level desc);

create table if not exists public.organizational_maturity_audit (
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

create index if not exists organizational_maturity_audit_org_idx
  on public.organizational_maturity_audit (organization_id, created_at desc);

alter table public.organizational_maturity_settings enable row level security;
alter table public.organizational_maturity_section_items enable row level security;
alter table public.organizational_maturity_domain_scores enable row level security;
alter table public.organizational_maturity_benchmarks enable row level security;
alter table public.organizational_maturity_department_items enable row level security;
alter table public.organizational_maturity_roadmaps enable row level security;
alter table public.organizational_maturity_evolution_events enable row level security;
alter table public.organizational_maturity_growth_plans enable row level security;
alter table public.organizational_maturity_pack_scores enable row level security;
alter table public.organizational_maturity_audit enable row level security;
revoke all on public.organizational_maturity_settings from authenticated, anon;
revoke all on public.organizational_maturity_section_items from authenticated, anon;
revoke all on public.organizational_maturity_domain_scores from authenticated, anon;
revoke all on public.organizational_maturity_benchmarks from authenticated, anon;
revoke all on public.organizational_maturity_department_items from authenticated, anon;
revoke all on public.organizational_maturity_roadmaps from authenticated, anon;
revoke all on public.organizational_maturity_evolution_events from authenticated, anon;
revoke all on public.organizational_maturity_growth_plans from authenticated, anon;
revoke all on public.organizational_maturity_pack_scores from authenticated, anon;
revoke all on public.organizational_maturity_audit from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'organizational_maturity_center', v.description
from (values
  ('organizational_maturity.view', 'View Organizational Maturity Center', 'View maturity scores, benchmarking, roadmaps, and growth planning'),
  ('organizational_maturity.manage', 'Manage Organizational Maturity Center', 'Acknowledge roadmaps, growth plans, and maturity recommendations')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'organizational_maturity.view'), ('owner', 'organizational_maturity.manage'),
  ('administrator', 'organizational_maturity.view'), ('administrator', 'organizational_maturity.manage'),
  ('manager', 'organizational_maturity.view'), ('manager', 'organizational_maturity.manage'),
  ('employee', 'organizational_maturity.view'),
  ('support_agent', 'organizational_maturity.view'),
  ('moderator', 'organizational_maturity.view'),
  ('viewer', 'organizational_maturity.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._om440_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'user_id', v_user_id,
    'can_executive', public._irp_has_permission('organizational_maturity.manage', v_org_id),
    'can_manage', public._irp_has_permission('organizational_maturity.manage', v_org_id),
    'can_view', public._irp_has_permission('organizational_maturity.view', v_org_id)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', 'Access denied');
end; $$;

create or replace function public._om440_log(
  p_org_id uuid, p_user_id uuid, p_item_type text, p_item_id uuid, p_action text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organizational_maturity_audit
    (organization_id, user_id, item_type, item_id, action, description)
  values (p_org_id, p_user_id, p_item_type, p_item_id, p_action, left(p_desc, 500));
end; $$;

create or replace function public._om440_level_label(p_level integer)
returns text language sql immutable as $$
  select case p_level
    when 1 then 'emerging'
    when 2 then 'developing'
    when 3 then 'structured'
    when 4 then 'optimized'
    when 5 then 'world_class'
    else 'developing'
  end;
$$;

create or replace function public._om440_section_json(s public.organizational_maturity_section_items)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', s.id, 'title', s.title, 'summary', s.summary,
    'maturity_level', s.maturity_level, 'maturity_level_label', public._om440_level_label(s.maturity_level),
    'explanation', s.explanation, 'status_key', s.status_key,
    'section_key', s.section_key, 'item_type', 'section'
  );
$$;

create or replace function public._om440_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organizational_maturity_settings (organization_id)
  values (p_org_id) on conflict do nothing;

  if exists (select 1 from public.organizational_maturity_domain_scores where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organizational_maturity_domain_scores
    (organization_id, domain_key, maturity_level, score_value, explanation, status_key)
  values
    (p_org_id, 'operations', 2, 42.0, 'Manual approvals and limited workflow automation keep operations at Developing level.', 'requires_attention'),
    (p_org_id, 'finance', 3, 58.0, 'Structured close process with documented controls — approaching Structured maturity.', 'information'),
    (p_org_id, 'support', 4, 72.0, 'Support maturity exceeds industry average with strong triage and knowledge reuse.', 'verified'),
    (p_org_id, 'sales', 2, 38.0, 'Pipeline tracking exists but forecasting and handoff documentation need improvement.', 'requires_attention'),
    (p_org_id, 'knowledge', 2, 35.0, 'Knowledge maturity below industry average — documentation gaps across teams.', 'requires_attention'),
    (p_org_id, 'security', 3, 61.0, 'RBAC and audit trails in place; continuous monitoring maturing.', 'information'),
    (p_org_id, 'governance', 3, 55.0, 'Approval policies defined; some exceptions not yet documented.', 'waiting'),
    (p_org_id, 'automation', 2, 40.0, 'Automation limited to support macros — broader workflow automation needed.', 'requires_attention');

  insert into public.organizational_maturity_section_items
    (organization_id, section_key, title, summary, maturity_level, explanation, status_key)
  values
    (p_org_id, 'maturity_overview', 'Organization at Developing stage', 'Overall maturity score reflects structured foundations with optimization opportunities.', 2, 'Weighted average across eight domains — strongest in Support, weakest in Knowledge.', 'information'),
    (p_org_id, 'department_maturity', 'Operations team maturity', 'Operations processes documented but approval chains add delay.', 2, 'People and processes rated Developing; automation lagging.', 'requires_attention'),
    (p_org_id, 'process_maturity', 'Procurement process maturity', 'Procurement workflow has redundant approval steps.', 2, 'Process documentation partial — target Structured (Level 3).', 'requires_attention'),
    (p_org_id, 'technology_maturity', 'Integration and systems maturity', 'Core systems connected; some duplicate tools remain.', 3, 'Technology stack approaching Structured maturity.', 'information'),
    (p_org_id, 'knowledge_maturity', 'Knowledge base maturity', 'Knowledge articles incomplete; search effectiveness below benchmark.', 2, 'Below industry average — priority improvement area.', 'requires_attention'),
    (p_org_id, 'governance_maturity', 'Policy and approval governance', 'Policies defined; exception tracking improving.', 3, 'Governance controls auditable and explainable.', 'verified'),
    (p_org_id, 'customer_experience_maturity', 'Customer experience maturity', 'Support strong; onboarding duration above benchmark.', 3, 'CX maturity mixed — support exceeds, onboarding lags.', 'waiting'),
    (p_org_id, 'improvement_roadmap', 'Path to Structured Operations', 'Reduce manual approvals, improve documentation, implement workflow automation.', 3, 'Target Level 3 Operations within 6 months.', 'requires_attention');

  insert into public.organizational_maturity_benchmarks
    (organization_id, domain_key, compare_type, title, summary, comparison_label, status_key)
  values
    (p_org_id, 'support', 'industry', 'Support maturity exceeds industry average', 'First-response and resolution metrics above peer median.', 'Above industry average', 'verified'),
    (p_org_id, 'knowledge', 'industry', 'Knowledge maturity below industry average', 'Documentation coverage and search effectiveness lag peers.', 'Below industry average', 'requires_attention'),
    (p_org_id, 'operations', 'company_size', 'Operations vs similar-sized organizations', 'Manual process ratio higher than companies of comparable size.', 'Below size cohort average', 'requires_attention'),
    (p_org_id, 'automation', 'business_pack_type', 'Automation vs Business Pack baseline', 'Workflow automation below recommended Business Pack maturity.', 'Below pack baseline', 'information'),
    (p_org_id, 'governance', 'region', 'Governance vs regional benchmark', 'Audit and RBAC practices align with regional expectations.', 'Meets regional benchmark', 'information');

  insert into public.organizational_maturity_department_items
    (organization_id, department_name, dimension_key, maturity_level, title, summary, status_key)
  values
    (p_org_id, 'Operations', 'people', 2, 'Operations team capability', 'Team skilled but cross-training limited.', 'information'),
    (p_org_id, 'Operations', 'processes', 2, 'Operations process documentation', 'Key workflows documented; exceptions not fully captured.', 'requires_attention'),
    (p_org_id, 'Operations', 'systems', 3, 'Operations systems integration', 'Core ops tools connected with metadata sync.', 'information'),
    (p_org_id, 'Operations', 'automation', 2, 'Operations automation level', 'Manual approvals dominate low-value purchases.', 'requires_attention'),
    (p_org_id, 'Operations', 'documentation', 2, 'Operations runbooks', 'Runbooks exist for critical paths only.', 'requires_attention'),
    (p_org_id, 'Support', 'people', 4, 'Support team maturity', 'Strong triage skills and knowledge reuse culture.', 'verified'),
    (p_org_id, 'Support', 'processes', 4, 'Support workflow maturity', 'Escalation and resolution workflows optimized.', 'verified'),
    (p_org_id, 'Finance', 'processes', 3, 'Finance close process', 'Month-end close structured with review checkpoints.', 'information');

  insert into public.organizational_maturity_roadmaps
    (organization_id, domain_key, current_level, target_level, required_improvements, expected_benefits, status)
  values
    (p_org_id, 'operations', 2, 3, 'Improve onboarding · Improve documentation · Automate approvals', '37% faster procurement cycle · Clearer accountability', 'active'),
    (p_org_id, 'knowledge', 2, 3, 'Expand knowledge base · Improve search · Assign content owners', 'Reduced repeat questions · Faster onboarding', 'active'),
    (p_org_id, 'automation', 2, 4, 'Reduce manual approvals · Improve process documentation · Implement workflow automation', 'Reach Level 4 Operations Maturity', 'active');

  insert into public.organizational_maturity_evolution_events
    (organization_id, event_type, title, summary, learning_note, status_key)
  values
    (p_org_id, 'recommendation_accepted', 'Support macro library accepted', 'Team approved standardized response macro rollout.', 'Accepted recommendations correlate with 12% faster resolution.', 'verified'),
    (p_org_id, 'improvement_succeeded', 'Approval chain simplification succeeded', 'Removed duplicate legal review for low-value purchases.', 'Simplification reduced cycle time 37% — reinforce for other workflows.', 'completed'),
    (p_org_id, 'improvement_failed', 'Knowledge base migration stalled', 'Content owner assignment incomplete after 60 days.', 'Failed improvements often lack assigned ownership — add owner gate.', 'requires_attention'),
    (p_org_id, 'measured_value', 'Support maturity uplift measured', 'Support domain score increased from 68 to 72 over 90 days.', 'Measurable value from accepted support improvements validates scoring model.', 'verified');

  insert into public.organizational_maturity_growth_plans
    (organization_id, horizon_key, domain_key, title, summary, required_actions, target_level, status_key)
  values
    (p_org_id, '90_day', 'operations', '90-Day Operations uplift', 'Foundation improvements for Structured operations maturity.', 'Reduce manual approvals · Document top 5 workflows · Pilot workflow automation', 3, 'requires_attention'),
    (p_org_id, '6_month', 'operations', '6-Month Operations target', 'Reach Level 3 Operations with automation and documentation.', 'Implement workflow automation · Complete runbook library · Train cross-functional owners', 3, 'waiting'),
    (p_org_id, '12_month', 'operations', '12-Month Operations excellence path', 'Progress toward Level 4 Optimized operations.', 'Expand automation · Benchmark against industry · Continuous improvement cadence', 4, 'information'),
    (p_org_id, '90_day', 'knowledge', '90-Day Knowledge foundation', 'Address below-industry knowledge maturity.', 'Assign content owners · Audit top 20 articles · Improve search tags', 3, 'requires_attention'),
    (p_org_id, '6_month', 'knowledge', '6-Month Knowledge structured', 'Structured knowledge with ownership and review cycles.', 'Monthly content review · Gap detection workflow · Employee Q&A integration', 3, 'information');

  insert into public.organizational_maturity_pack_scores
    (organization_id, pack_key, maturity_level, title, summary, explanation, status_key)
  values
    (p_org_id, 'hosts', 3, 'Aipify Hosts pack maturity', 'Guest operations workflows structured with room for automation.', 'Hosts module approaching Structured maturity.', 'information'),
    (p_org_id, 'commerce', 2, 'Commerce pack maturity', 'Order workflows documented; fulfillment automation limited.', 'Developing — automation and documentation gaps.', 'requires_attention'),
    (p_org_id, 'support', 4, 'Support pack maturity', 'Support pack exceeds baseline with strong triage and knowledge.', 'Optimized support operations within pack scope.', 'verified'),
    (p_org_id, 'growth_partners', 2, 'Growth Partners pack maturity', 'Partner onboarding manual; referral tracking basic.', 'Developing — documentation and automation needed.', 'waiting'),
    (p_org_id, 'finance', 3, 'Finance pack maturity', 'Billing and reconciliation structured with audit visibility.', 'Structured financial operations.', 'information'),
    (p_org_id, 'future_packs', 1, 'Future Business Packs readiness', 'Foundation ready; pack-specific maturity not yet measured.', 'Emerging — baseline infrastructure only.', 'information');
end; $$;

create or replace function public.get_organizational_maturity_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid;
  v_overview jsonb; v_department jsonb; v_process jsonb; v_technology jsonb;
  v_knowledge jsonb; v_governance jsonb; v_cx jsonb; v_roadmap_section jsonb;
  v_domains jsonb; v_benchmarks jsonb; v_departments jsonb; v_roadmaps jsonb;
  v_evolution jsonb; v_growth jsonb; v_packs jsonb;
  v_avg_level numeric; v_avg_score numeric; v_highest jsonb; v_lowest jsonb;
  v_growth_trend text; v_priorities jsonb;
begin
  perform public._irp_require_permission('organizational_maturity.view');
  v_ctx := public._om440_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', coalesce(v_ctx->>'error', 'Access denied'));
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  perform public._om440_seed(v_org_id);

  select coalesce(jsonb_agg(public._om440_section_json(s) order by s.maturity_level desc), '[]'::jsonb)
  into v_overview from public.organizational_maturity_section_items s
  where s.organization_id = v_org_id and s.section_key = 'maturity_overview';

  select coalesce(jsonb_agg(public._om440_section_json(s) order by s.updated_at desc), '[]'::jsonb)
  into v_department from public.organizational_maturity_section_items s
  where s.organization_id = v_org_id and s.section_key = 'department_maturity';

  select coalesce(jsonb_agg(public._om440_section_json(s) order by s.updated_at desc), '[]'::jsonb)
  into v_process from public.organizational_maturity_section_items s
  where s.organization_id = v_org_id and s.section_key = 'process_maturity';

  select coalesce(jsonb_agg(public._om440_section_json(s) order by s.updated_at desc), '[]'::jsonb)
  into v_technology from public.organizational_maturity_section_items s
  where s.organization_id = v_org_id and s.section_key = 'technology_maturity';

  select coalesce(jsonb_agg(public._om440_section_json(s) order by s.updated_at desc), '[]'::jsonb)
  into v_knowledge from public.organizational_maturity_section_items s
  where s.organization_id = v_org_id and s.section_key = 'knowledge_maturity';

  select coalesce(jsonb_agg(public._om440_section_json(s) order by s.updated_at desc), '[]'::jsonb)
  into v_governance from public.organizational_maturity_section_items s
  where s.organization_id = v_org_id and s.section_key = 'governance_maturity';

  select coalesce(jsonb_agg(public._om440_section_json(s) order by s.updated_at desc), '[]'::jsonb)
  into v_cx from public.organizational_maturity_section_items s
  where s.organization_id = v_org_id and s.section_key = 'customer_experience_maturity';

  select coalesce(jsonb_agg(public._om440_section_json(s) order by s.updated_at desc), '[]'::jsonb)
  into v_roadmap_section from public.organizational_maturity_section_items s
  where s.organization_id = v_org_id and s.section_key = 'improvement_roadmap';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'domain_key', d.domain_key, 'maturity_level', d.maturity_level,
    'maturity_level_label', public._om440_level_label(d.maturity_level),
    'score_value', d.score_value, 'explanation', d.explanation,
    'status_key', d.status_key, 'item_type', 'domain'
  ) order by d.maturity_level desc, d.score_value desc), '[]'::jsonb)
  into v_domains from public.organizational_maturity_domain_scores d where d.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'domain_key', b.domain_key, 'compare_type', b.compare_type,
    'title', b.title, 'summary', b.summary, 'comparison_label', b.comparison_label,
    'status_key', b.status_key, 'item_type', 'benchmark'
  ) order by b.created_at desc), '[]'::jsonb)
  into v_benchmarks from public.organizational_maturity_benchmarks b where b.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', dep.id, 'department_name', dep.department_name, 'dimension_key', dep.dimension_key,
    'maturity_level', dep.maturity_level, 'maturity_level_label', public._om440_level_label(dep.maturity_level),
    'title', dep.title, 'summary', dep.summary, 'status_key', dep.status_key, 'item_type', 'department'
  ) order by dep.department_name, dep.dimension_key), '[]'::jsonb)
  into v_departments from public.organizational_maturity_department_items dep where dep.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'domain_key', r.domain_key, 'current_level', r.current_level,
    'current_level_label', public._om440_level_label(r.current_level),
    'target_level', r.target_level, 'target_level_label', public._om440_level_label(r.target_level),
    'required_improvements', r.required_improvements, 'expected_benefits', r.expected_benefits,
    'status', r.status, 'item_type', 'roadmap'
  ) order by r.target_level desc), '[]'::jsonb)
  into v_roadmaps from public.organizational_maturity_roadmaps r
  where r.organization_id = v_org_id and r.status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'event_type', e.event_type, 'title', e.title, 'summary', e.summary,
    'learning_note', e.learning_note, 'status_key', e.status_key, 'item_type', 'evolution'
  ) order by e.created_at desc), '[]'::jsonb)
  into v_evolution from public.organizational_maturity_evolution_events e where e.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', g.id, 'horizon_key', g.horizon_key, 'domain_key', g.domain_key,
    'title', g.title, 'summary', g.summary, 'required_actions', g.required_actions,
    'target_level', g.target_level, 'target_level_label', public._om440_level_label(g.target_level),
    'status_key', g.status_key, 'item_type', 'growth_plan'
  ) order by case g.horizon_key when '90_day' then 1 when '6_month' then 2 else 3 end), '[]'::jsonb)
  into v_growth from public.organizational_maturity_growth_plans g where g.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'pack_key', p.pack_key, 'maturity_level', p.maturity_level,
    'maturity_level_label', public._om440_level_label(p.maturity_level),
    'title', p.title, 'summary', p.summary, 'explanation', p.explanation,
    'status_key', p.status_key, 'item_type', 'pack'
  ) order by p.maturity_level desc), '[]'::jsonb)
  into v_packs from public.organizational_maturity_pack_scores p where p.organization_id = v_org_id;

  select round(avg(maturity_level)::numeric, 1), round(avg(score_value)::numeric, 1)
  into v_avg_level, v_avg_score
  from public.organizational_maturity_domain_scores where organization_id = v_org_id;

  select coalesce(jsonb_agg(sub.obj), '[]'::jsonb)
  into v_highest
  from (
    select jsonb_build_object(
      'domain_key', d.domain_key, 'maturity_level', d.maturity_level,
      'maturity_level_label', public._om440_level_label(d.maturity_level), 'score_value', d.score_value
    ) as obj
    from public.organizational_maturity_domain_scores d
    where d.organization_id = v_org_id
    order by d.maturity_level desc, d.score_value desc
    limit 3
  ) sub;

  select coalesce(jsonb_agg(sub.obj), '[]'::jsonb)
  into v_lowest
  from (
    select jsonb_build_object(
      'domain_key', d.domain_key, 'maturity_level', d.maturity_level,
      'maturity_level_label', public._om440_level_label(d.maturity_level), 'score_value', d.score_value
    ) as obj
    from public.organizational_maturity_domain_scores d
    where d.organization_id = v_org_id
    order by d.maturity_level asc, d.score_value asc
    limit 3
  ) sub;

  v_growth_trend := case
    when exists (
      select 1 from public.organizational_maturity_evolution_events e
      where e.organization_id = v_org_id and e.event_type = 'measured_value'
    ) then 'improving'
    else 'stable'
  end;

  select coalesce(jsonb_agg(sub.obj), '[]'::jsonb)
  into v_priorities
  from (
    select jsonb_build_object(
      'domain_key', d.domain_key, 'maturity_level', d.maturity_level,
      'explanation', d.explanation
    ) as obj
    from public.organizational_maturity_domain_scores d
    where d.organization_id = v_org_id and d.maturity_level <= 2
    order by d.maturity_level asc, d.score_value asc
    limit 5
  ) sub;

  return jsonb_build_object(
    'found', true,
    'philosophy', 'Organizations evolve through stages. Aipify continuously evaluates organizational maturity and guides improvement — helping organizations evolve, not merely operate.',
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'governance_note', 'All maturity scores are explainable, transparent, and auditable. Users must understand why a score exists.',
    'executive_dashboard', jsonb_build_object(
      'current_maturity_score', coalesce(v_avg_score, 0),
      'current_maturity_level', coalesce(v_avg_level, 2),
      'current_maturity_level_label', public._om440_level_label(coalesce(v_avg_level, 2)::integer),
      'growth_trend', v_growth_trend,
      'highest_performing_areas', v_highest,
      'lowest_performing_areas', v_lowest,
      'recommended_priorities', v_priorities
    ),
    'sections', jsonb_build_object(
      'maturity_overview', v_overview,
      'department_maturity', v_department,
      'process_maturity', v_process,
      'technology_maturity', v_technology,
      'knowledge_maturity', v_knowledge,
      'governance_maturity', v_governance,
      'customer_experience_maturity', v_cx,
      'improvement_roadmap', v_roadmap_section
    ),
    'maturity_scoring', v_domains,
    'benchmarking', v_benchmarks,
    'department_analysis', v_departments,
    'improvement_roadmaps', v_roadmaps,
    'self_evolution', v_evolution,
    'growth_planning', v_growth,
    'business_pack_maturity', v_packs,
    'statistics', jsonb_build_object(
      'domain_count', jsonb_array_length(v_domains),
      'benchmark_count', jsonb_array_length(v_benchmarks),
      'roadmap_count', jsonb_array_length(v_roadmaps),
      'evolution_count', jsonb_array_length(v_evolution),
      'growth_plan_count', jsonb_array_length(v_growth),
      'pack_count', jsonb_array_length(v_packs)
    ),
    'privacy_note', 'Maturity assessments use aggregated operational metadata only — no individual performance scoring.'
  );
end; $$;

create or replace function public.manage_organizational_maturity_item(
  p_item_type text,
  p_item_id uuid,
  p_action text
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid;
begin
  v_ctx := public._om440_access();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Not authorized';
  end if;
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if p_action not in ('acknowledge', 'dismiss', 'approve', 'complete') then
    raise exception 'Invalid action';
  end if;

  if p_item_type = 'roadmap' then
    update public.organizational_maturity_roadmaps set
      status = case p_action
        when 'approve' then 'active'
        when 'complete' then 'completed'
        when 'dismiss' then 'dismissed'
        else status end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'growth_plan' then
    update public.organizational_maturity_growth_plans set
      status_key = case p_action
        when 'acknowledge' then 'verified'
        when 'dismiss' then 'not_allowed'
        else status_key end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'evolution' then
    update public.organizational_maturity_evolution_events set
      status_key = case p_action
        when 'acknowledge' then 'verified'
        when 'dismiss' then 'information'
        else status_key end
    where id = p_item_id and organization_id = v_org_id;
  end if;

  perform public._om440_log(v_org_id, v_user_id, p_item_type, p_item_id, p_action, 'Organizational maturity item updated');
  return jsonb_build_object('ok', true, 'action', p_action);
end; $$;

grant execute on function public.get_organizational_maturity_center() to authenticated;
grant execute on function public.manage_organizational_maturity_item(text, uuid, text) to authenticated;
