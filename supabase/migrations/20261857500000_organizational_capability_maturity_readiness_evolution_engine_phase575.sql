-- Phase 575 — Organizational Capability Maturity, Readiness & Evolution Engine
-- Feature owner: CUSTOMER APP
-- Route: /app/maturity
-- Helpers: _cmom575_*

create table if not exists public.organization_companion_maturity_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  maturity_center_enabled boolean not null default true,
  assessment_engine_enabled boolean not null default true,
  readiness_engine_enabled boolean not null default true,
  benchmark_engine_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_companion_maturity_settings enable row level security;
revoke all on public.organization_companion_maturity_settings from authenticated, anon;

create table if not exists public.organization_companion_maturity_capabilities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  capability_key text not null,
  capability_title text not null,
  capability_type text not null check (
    capability_type in (
      'support', 'operations', 'governance', 'knowledge', 'security',
      'automation', 'leadership', 'customer_success', 'partner_success',
      'finance', 'projects', 'custom'
    )
  ),
  maturity_level integer not null default 2 check (maturity_level between 1 and 5),
  maturity_label text not null default 'developing' check (
    maturity_label in ('ad_hoc', 'developing', 'defined', 'managed', 'optimized')
  ),
  target_level integer not null default 4 check (target_level between 1 and 5),
  owner_name text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, capability_key)
);

alter table public.organization_companion_maturity_capabilities enable row level security;
revoke all on public.organization_companion_maturity_capabilities from authenticated, anon;

create table if not exists public.organization_companion_maturity_assessments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  assessment_key text not null,
  capability_key text not null,
  assessment_title text not null,
  maturity_score numeric(5,2) not null default 0 check (maturity_score between 0 and 100),
  processes_score numeric(5,2) not null default 0,
  documentation_score numeric(5,2) not null default 0,
  knowledge_score numeric(5,2) not null default 0,
  ownership_score numeric(5,2) not null default 0,
  governance_score numeric(5,2) not null default 0,
  training_score numeric(5,2) not null default 0,
  automation_score numeric(5,2) not null default 0,
  measurement_score numeric(5,2) not null default 0,
  assessment_status text not null default 'active' check (
    assessment_status in ('scheduled', 'active', 'completed', 'archived')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, assessment_key)
);

alter table public.organization_companion_maturity_assessments enable row level security;
revoke all on public.organization_companion_maturity_assessments from authenticated, anon;

create table if not exists public.organization_companion_maturity_readiness (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  readiness_key text not null,
  readiness_title text not null,
  readiness_type text not null check (
    readiness_type in (
      'growth', 'operational', 'governance', 'technology', 'automation', 'expansion'
    )
  ),
  readiness_score numeric(5,2) not null default 0 check (readiness_score between 0 and 100),
  readiness_status text not null default 'moderate' check (
    readiness_status in ('low', 'moderate', 'high', 'ready')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, readiness_key)
);

alter table public.organization_companion_maturity_readiness enable row level security;
revoke all on public.organization_companion_maturity_readiness from authenticated, anon;

create table if not exists public.organization_companion_maturity_roadmaps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  roadmap_key text not null,
  capability_key text not null,
  roadmap_title text not null,
  current_state text not null default '',
  target_state text not null default '',
  required_improvements jsonb not null default '[]'::jsonb,
  milestones jsonb not null default '[]'::jsonb,
  timeline text not null default '',
  roadmap_status text not null default 'active' check (
    roadmap_status in ('draft', 'active', 'completed', 'archived')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, roadmap_key)
);

alter table public.organization_companion_maturity_roadmaps enable row level security;
revoke all on public.organization_companion_maturity_roadmaps from authenticated, anon;

create table if not exists public.organization_companion_maturity_benchmarks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  benchmark_key text not null,
  benchmark_title text not null,
  benchmark_type text not null check (
    benchmark_type in (
      'industry_average', 'department_average', 'organization_history', 'internal_team', 'federation'
    )
  ),
  capability_key text not null default '',
  organization_score numeric(5,2) not null default 0,
  benchmark_score numeric(5,2) not null default 0,
  anonymized boolean not null default true,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, benchmark_key)
);

alter table public.organization_companion_maturity_benchmarks enable row level security;
revoke all on public.organization_companion_maturity_benchmarks from authenticated, anon;

create table if not exists public.organization_companion_maturity_gaps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  gap_key text not null,
  capability_key text not null,
  gap_title text not null,
  gap_type text not null check (
    gap_type in (
      'missing_documentation', 'missing_ownership', 'missing_training',
      'missing_governance', 'missing_processes', 'custom'
    )
  ),
  current_level integer not null default 2 check (current_level between 1 and 5),
  target_level integer not null default 4 check (target_level between 1 and 5),
  improvement_plan text not null default '',
  gap_status text not null default 'open' check (
    gap_status in ('open', 'planned', 'in_progress', 'resolved')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, gap_key)
);

alter table public.organization_companion_maturity_gaps enable row level security;
revoke all on public.organization_companion_maturity_gaps from authenticated, anon;

create table if not exists public.organization_companion_maturity_evolution (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  evolution_key text not null,
  evolution_title text not null,
  evolution_type text not null check (
    evolution_type in (
      'capability_growth', 'maturity_improvement', 'milestone_completed',
      'readiness_change', 'department_progress', 'custom'
    )
  ),
  progress_value numeric(5,2) not null default 0,
  evolution_status text not null default 'active' check (
    evolution_status in ('active', 'completed', 'archived')
  ),
  recorded_at date not null default current_date,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, evolution_key)
);

alter table public.organization_companion_maturity_evolution enable row level security;
revoke all on public.organization_companion_maturity_evolution from authenticated, anon;

create table if not exists public.organization_companion_maturity_business_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  assessments jsonb not null default '[]'::jsonb,
  benchmarks jsonb not null default '[]'::jsonb,
  roadmaps jsonb not null default '[]'::jsonb,
  capability_scores jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_companion_maturity_business_packs enable row level security;
revoke all on public.organization_companion_maturity_business_packs from authenticated, anon;

create table if not exists public.organization_companion_maturity_evolution_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  score_key text not null default 'organization',
  evolution_score numeric(5,2) not null default 0 check (evolution_score between 0 and 100),
  evolution_status text not null default 'improving' check (
    evolution_status in ('high_maturity', 'improving', 'needs_attention', 'capability_risk')
  ),
  capability_maturity numeric(5,2) not null default 0,
  knowledge_health numeric(5,2) not null default 0,
  governance_health numeric(5,2) not null default 0,
  process_quality numeric(5,2) not null default 0,
  operational_readiness numeric(5,2) not null default 0,
  improvement_velocity numeric(5,2) not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, score_key)
);

alter table public.organization_companion_maturity_evolution_scores enable row level security;
revoke all on public.organization_companion_maturity_evolution_scores from authenticated, anon;

create table if not exists public.organization_companion_maturity_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'maturity' check (
    audit_category in (
      'assessment', 'roadmap', 'gap', 'milestone', 'score', 'benchmark', 'evolution', 'maturity'
    )
  ),
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_companion_maturity_audit_logs_org_idx
  on public.organization_companion_maturity_audit_logs (organization_id, created_at desc);

alter table public.organization_companion_maturity_audit_logs enable row level security;
revoke all on public.organization_companion_maturity_audit_logs from authenticated, anon;

create or replace function public._cmom575_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cmom575_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'maturity'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_maturity_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'maturity'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cmom575_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_maturity_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cmom575_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_companion_maturity_capabilities where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_companion_maturity_capabilities (
    organization_id, capability_key, capability_title, capability_type, maturity_level, maturity_label, target_level, owner_name, summary
  ) values
    (p_org_id, 'cap_support', 'Support', 'support', 2, 'developing', 4, 'Support Lead', 'Support capability — assessment identifies improvement path to Level 4.'),
    (p_org_id, 'cap_operations', 'Operations', 'operations', 3, 'defined', 4, 'Operations Director', 'Operations maturity defined — targeting managed level.'),
    (p_org_id, 'cap_governance', 'Governance', 'governance', 3, 'defined', 5, 'COO', 'Governance processes defined — optimization target.'),
    (p_org_id, 'cap_knowledge', 'Knowledge', 'knowledge', 2, 'developing', 4, 'Knowledge Lead', 'Knowledge management developing — documentation gaps identified.'),
    (p_org_id, 'cap_security', 'Security', 'security', 4, 'managed', 5, 'Security Lead', 'Security at managed level — strong governance baseline.'),
    (p_org_id, 'cap_automation', 'Automation', 'automation', 2, 'developing', 4, 'Automation Lead', 'Automation developing — manual work remains in key processes.'),
    (p_org_id, 'cap_leadership', 'Leadership', 'leadership', 3, 'defined', 4, 'Executive Team', 'Leadership alignment defined — readiness for growth.'),
    (p_org_id, 'cap_customer_success', 'Customer Success', 'customer_success', 3, 'defined', 4, 'CS Director', 'Customer success processes defined.'),
    (p_org_id, 'cap_finance', 'Finance', 'finance', 3, 'defined', 4, 'CFO', 'Finance maturity defined — forecast discipline improving.');

  insert into public.organization_companion_maturity_assessments (
    organization_id, assessment_key, capability_key, assessment_title, maturity_score,
    processes_score, documentation_score, knowledge_score, ownership_score,
    governance_score, training_score, automation_score, measurement_score, summary
  ) values
    (p_org_id, 'ass_support', 'cap_support', 'Support Capability Assessment', 42,
     40, 35, 45, 38, 50, 42, 30, 48,
     'Support Capability → Assessment → Maturity Score → Improvement Recommendations.'),
    (p_org_id, 'ass_operations', 'cap_operations', 'Operations Assessment', 68,
     70, 65, 72, 68, 75, 60, 55, 70,
     'Operations at defined maturity — automation and measurement need focus.');

  insert into public.organization_companion_maturity_readiness (
    organization_id, readiness_key, readiness_title, readiness_type, readiness_score, readiness_status, summary
  ) values
    (p_org_id, 'ready_growth', 'Growth Readiness', 'growth', 72, 'high', 'Organization ready for moderate growth expansion.'),
    (p_org_id, 'ready_operational', 'Operational Readiness', 'operational', 68, 'moderate', 'Operations stable — automation gaps limit scale.'),
    (p_org_id, 'ready_governance', 'Governance Readiness', 'governance', 75, 'high', 'Governance framework supports expansion.'),
    (p_org_id, 'ready_technology', 'Technology Readiness', 'technology', 65, 'moderate', 'Technology foundation solid — integration depth needed.'),
    (p_org_id, 'ready_automation', 'Automation Readiness', 'automation', 55, 'moderate', 'Automation readiness moderate — manual processes remain.'),
    (p_org_id, 'ready_expansion', 'Expansion Readiness', 'expansion', 70, 'high', 'Expansion readiness improving — support maturity is limiting factor.');

  insert into public.organization_companion_maturity_roadmaps (
    organization_id, roadmap_key, capability_key, roadmap_title, current_state, target_state,
    required_improvements, milestones, timeline, summary
  ) values
    (p_org_id, 'road_support', 'cap_support', 'Support Maturity Roadmap',
     'Level 2 — Developing', 'Level 4 — Managed',
     '["Document escalation procedures","Assign knowledge owners","Implement training program","Automate triage"]'::jsonb,
     '["Q2: Documentation complete","Q3: Training rollout","Q4: Automation pilot"]'::jsonb,
     '12 months', 'Current State → Target State → Required Improvements → Milestones → Timeline.'),
    (p_org_id, 'road_automation', 'cap_automation', 'Automation Roadmap',
     'Level 2 — Developing', 'Level 4 — Managed',
     '["Identify manual workflows","Prioritize automation candidates","Deploy workflow automation"]'::jsonb,
     '["Q2: Workflow audit","Q3: First automation wave"]'::jsonb,
     '9 months', 'Companion-generated improvement roadmap.');

  insert into public.organization_companion_maturity_benchmarks (
    organization_id, benchmark_key, benchmark_title, benchmark_type, capability_key,
    organization_score, benchmark_score, anonymized, summary
  ) values
    (p_org_id, 'bench_support_industry', 'Support vs Industry Average', 'industry_average', 'cap_support',
     42, 58, true, 'Support below industry average — anonymized Federation Intelligence comparison (Phase 565).'),
    (p_org_id, 'bench_ops_dept', 'Operations vs Department Average', 'department_average', 'cap_operations',
     68, 62, true, 'Operations above department average.'),
    (p_org_id, 'bench_gov_history', 'Governance vs Organization History', 'organization_history', 'cap_governance',
     75, 68, true, 'Governance improved 7 points vs last quarter.'),
    (p_org_id, 'bench_security_team', 'Security vs Internal Teams', 'internal_team', 'cap_security',
     80, 72, true, 'Security leads internal team benchmark.');

  insert into public.organization_companion_maturity_gaps (
    organization_id, gap_key, capability_key, gap_title, gap_type, current_level, target_level, improvement_plan, summary
  ) values
    (p_org_id, 'gap_support_docs', 'cap_support', 'Missing Support Documentation', 'missing_documentation', 2, 4,
     'Document escalation procedures and knowledge base articles by Q2.',
     'Support Maturity Level 2 → Target Level 4 → Improvement Plan Generated.'),
    (p_org_id, 'gap_support_owner', 'cap_support', 'Missing Escalation Ownership', 'missing_ownership', 2, 4,
     'Assign knowledge owners for each escalation category.',
     'Missing ownership identified — link to Expertise Center.'),
    (p_org_id, 'gap_automation_training', 'cap_automation', 'Missing Automation Training', 'missing_training', 2, 4,
     'Train teams on workflow automation tools.',
     'Training gap limits automation adoption.');

  insert into public.organization_companion_maturity_evolution (
    organization_id, evolution_key, evolution_title, evolution_type, progress_value, evolution_status, summary
  ) values
    (p_org_id, 'evo_support', 'Support Maturity Growth', 'capability_growth', 8, 'active', 'Support maturity improved 8 points this quarter.'),
    (p_org_id, 'evo_gov_milestone', 'Governance Milestone Completed', 'milestone_completed', 100, 'completed', 'Governance review cycle completed.'),
    (p_org_id, 'evo_readiness', 'Expansion Readiness Change', 'readiness_change', 5, 'active', 'Expansion readiness up 5 points.'),
    (p_org_id, 'evo_ops_dept', 'Operations Department Progress', 'department_progress', 12, 'active', 'Operations department progress tracked.');

  insert into public.organization_companion_maturity_business_packs (
    organization_id, pack_key, pack_title, assessments, benchmarks, roadmaps, capability_scores, summary
  ) values
    (p_org_id, 'finance', 'Finance Pack', '["Finance Assessment"]'::jsonb, '["Finance vs Industry"]'::jsonb,
     '["Finance Maturity Roadmap"]'::jsonb, '[{"capability":"finance","level":3}]'::jsonb, 'Finance Pack → Finance Maturity.'),
    (p_org_id, 'support', 'Support Pack', '["Support Assessment"]'::jsonb, '["Support vs Industry"]'::jsonb,
     '["Support Maturity Roadmap"]'::jsonb, '[{"capability":"support","level":2}]'::jsonb, 'Support Pack → Support Maturity.'),
    (p_org_id, 'warehouse', 'Warehouse Pack', '["Operations Assessment"]'::jsonb, '[]'::jsonb,
     '["Operations Roadmap"]'::jsonb, '[{"capability":"operations","level":3}]'::jsonb, 'Warehouse Pack → Operations Maturity.');

  insert into public.organization_companion_maturity_evolution_scores (
    organization_id, score_key, evolution_score, evolution_status,
    capability_maturity, knowledge_health, governance_health,
    process_quality, operational_readiness, improvement_velocity, summary
  ) values
    (p_org_id, 'organization', 74, 'improving', 68, 72, 75, 70, 68, 65,
     'Organizational evolution score — improving across capabilities.');
end; $$;

create or replace function public.get_organization_companion_maturity_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid; v_org jsonb; v_overview jsonb; v_capabilities jsonb; v_assessments jsonb;
  v_readiness jsonb; v_roadmaps jsonb; v_benchmarks jsonb; v_gaps jsonb; v_evolution jsonb;
  v_packs jsonb; v_evolution_score jsonb; v_executive jsonb; v_companion jsonb;
  v_reports jsonb; v_audit jsonb;
begin
  v_org_id := public._cmom575_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._cmom575_ensure_settings(v_org_id);
  perform public._cmom575_seed(v_org_id);

  select jsonb_build_object('id', o.id, 'name', o.name) into v_org from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'total_capabilities', (select count(*) from public.organization_companion_maturity_capabilities where organization_id = v_org_id),
    'active_assessments', (select count(*) from public.organization_companion_maturity_assessments where organization_id = v_org_id and assessment_status = 'active'),
    'open_gaps', (select count(*) from public.organization_companion_maturity_gaps where organization_id = v_org_id and gap_status in ('open', 'planned', 'in_progress')),
    'active_roadmaps', (select count(*) from public.organization_companion_maturity_roadmaps where organization_id = v_org_id and roadmap_status = 'active'),
    'benchmarks', (select count(*) from public.organization_companion_maturity_benchmarks where organization_id = v_org_id),
    'evolution_items', (select count(*) from public.organization_companion_maturity_evolution where organization_id = v_org_id and evolution_status = 'active'),
    'avg_maturity_level', coalesce((select round(avg(maturity_level), 1) from public.organization_companion_maturity_capabilities where organization_id = v_org_id), 0),
    'evolution_score', coalesce((select evolution_score from public.organization_companion_maturity_evolution_scores where organization_id = v_org_id and score_key = 'organization' limit 1), 0)
  ) into v_overview;

  select coalesce(jsonb_agg(jsonb_build_object(
    'capability_key', c.capability_key, 'capability_title', c.capability_title,
    'capability_type', c.capability_type, 'maturity_level', c.maturity_level,
    'maturity_label', c.maturity_label, 'target_level', c.target_level,
    'owner_name', c.owner_name, 'summary', c.summary
  ) order by c.maturity_level, c.capability_title), '[]'::jsonb)
  into v_capabilities from public.organization_companion_maturity_capabilities c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'assessment_key', a.assessment_key, 'capability_key', a.capability_key,
    'assessment_title', a.assessment_title, 'maturity_score', a.maturity_score,
    'processes_score', a.processes_score, 'documentation_score', a.documentation_score,
    'knowledge_score', a.knowledge_score, 'ownership_score', a.ownership_score,
    'governance_score', a.governance_score, 'training_score', a.training_score,
    'automation_score', a.automation_score, 'measurement_score', a.measurement_score,
    'assessment_status', a.assessment_status, 'summary', a.summary
  ) order by a.maturity_score), '[]'::jsonb)
  into v_assessments from public.organization_companion_maturity_assessments a where a.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'readiness_key', r.readiness_key, 'readiness_title', r.readiness_title,
    'readiness_type', r.readiness_type, 'readiness_score', r.readiness_score,
    'readiness_status', r.readiness_status, 'summary', r.summary
  ) order by r.readiness_score desc), '[]'::jsonb)
  into v_readiness from public.organization_companion_maturity_readiness r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'roadmap_key', rm.roadmap_key, 'capability_key', rm.capability_key,
    'roadmap_title', rm.roadmap_title, 'current_state', rm.current_state,
    'target_state', rm.target_state, 'required_improvements', rm.required_improvements,
    'milestones', rm.milestones, 'timeline', rm.timeline,
    'roadmap_status', rm.roadmap_status, 'summary', rm.summary
  ) order by rm.roadmap_title), '[]'::jsonb)
  into v_roadmaps from public.organization_companion_maturity_roadmaps rm where rm.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'benchmark_key', b.benchmark_key, 'benchmark_title', b.benchmark_title,
    'benchmark_type', b.benchmark_type, 'capability_key', b.capability_key,
    'organization_score', b.organization_score, 'benchmark_score', b.benchmark_score,
    'anonymized', b.anonymized, 'summary', b.summary
  ) order by b.benchmark_title), '[]'::jsonb)
  into v_benchmarks from public.organization_companion_maturity_benchmarks b where b.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'gap_key', g.gap_key, 'capability_key', g.capability_key, 'gap_title', g.gap_title,
    'gap_type', g.gap_type, 'current_level', g.current_level, 'target_level', g.target_level,
    'improvement_plan', g.improvement_plan, 'gap_status', g.gap_status, 'summary', g.summary
  ) order by g.current_level), '[]'::jsonb)
  into v_gaps from public.organization_companion_maturity_gaps g where g.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'evolution_key', e.evolution_key, 'evolution_title', e.evolution_title,
    'evolution_type', e.evolution_type, 'progress_value', e.progress_value,
    'evolution_status', e.evolution_status, 'recorded_at', e.recorded_at, 'summary', e.summary
  ) order by e.recorded_at desc), '[]'::jsonb)
  into v_evolution from public.organization_companion_maturity_evolution e where e.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'pack_key', bp.pack_key, 'pack_title', bp.pack_title,
    'assessments', bp.assessments, 'benchmarks', bp.benchmarks,
    'roadmaps', bp.roadmaps, 'capability_scores', bp.capability_scores, 'summary', bp.summary
  ) order by bp.pack_title), '[]'::jsonb)
  into v_packs from public.organization_companion_maturity_business_packs bp where bp.organization_id = v_org_id;

  select coalesce(jsonb_build_object(
    'score_key', es.score_key, 'evolution_score', es.evolution_score,
    'evolution_status', es.evolution_status, 'capability_maturity', es.capability_maturity,
    'knowledge_health', es.knowledge_health, 'governance_health', es.governance_health,
    'process_quality', es.process_quality, 'operational_readiness', es.operational_readiness,
    'improvement_velocity', es.improvement_velocity, 'summary', es.summary
  ), '{}'::jsonb)
  into v_evolution_score
  from public.organization_companion_maturity_evolution_scores es
  where es.organization_id = v_org_id and es.score_key = 'organization';

  select jsonb_build_object(
    'maturity_scores', v_capabilities,
    'capability_gaps', v_gaps,
    'improvement_progress', v_evolution,
    'readiness_scores', v_readiness,
    'roadmaps', v_roadmaps,
    'companion_recommendations', jsonb_build_array(
      jsonb_build_object('title', 'Prioritize Support documentation', 'reason', 'Lowest maturity capability with highest growth impact'),
      jsonb_build_object('title', 'Accelerate automation roadmap', 'reason', 'Automation readiness limits operational scale'),
      jsonb_build_object('title', 'Complete governance milestone', 'reason', 'Governance readiness supports expansion')
    )
  ) into v_executive;

  select jsonb_build_object(
    'maturity_advisor_prompts', jsonb_build_array(
      'Where are we weakest?', 'What should improve first?',
      'What capability limits growth?', 'What maturity improvements create the highest impact?',
      'Generate maturity briefing.'
    )
  ) into v_companion;

  select jsonb_build_object(
    'executive_dashboard', v_executive,
    'evolution_score', v_evolution_score,
    'benchmarks', v_benchmarks,
    'capability_gaps', v_gaps
  ) into v_reports;

  select coalesce((
    select jsonb_agg(jsonb_build_object('event_type', al.event_type, 'audit_category', al.audit_category,
      'summary', al.summary, 'created_at', al.created_at) order by al.created_at desc)
    from (select * from public.organization_companion_maturity_audit_logs where organization_id = v_org_id order by created_at desc limit 10) al
  ), '[]'::jsonb) into v_audit;

  return jsonb_build_object(
    'found', true,
    'principle', 'Performance shows where an organization is today. Maturity shows where it can go tomorrow.',
    'philosophy', 'One Maturity Center. One Capability Framework. One Organizational Evolution Engine.',
    'section', coalesce(p_section, 'overview'),
    'organization', v_org,
    'overview', v_overview,
    'capabilities', v_capabilities,
    'assessments', v_assessments,
    'readiness', v_readiness,
    'roadmaps', v_roadmaps,
    'benchmarks', v_benchmarks,
    'gaps', v_gaps,
    'capability_gaps', v_gaps,
    'evolution', v_evolution,
    'evolution_tracking', v_evolution,
    'business_packs', v_packs,
    'evolution_score', v_evolution_score,
    'executive_dashboard', v_executive,
    'recommendations', (v_executive->'companion_recommendations'),
    'companion', v_companion,
    'reports', v_reports,
    'audit_recent', v_audit,
    'maturity_model', jsonb_build_object(
      'levels', jsonb_build_array(
        jsonb_build_object('level', 1, 'label', 'ad_hoc', 'title', 'Ad Hoc'),
        jsonb_build_object('level', 2, 'label', 'developing', 'title', 'Developing'),
        jsonb_build_object('level', 3, 'label', 'defined', 'title', 'Defined'),
        jsonb_build_object('level', 4, 'label', 'managed', 'title', 'Managed'),
        jsonb_build_object('level', 5, 'label', 'optimized', 'title', 'Optimized')
      )
    ),
    'routes', jsonb_build_object(
      'maturity_center', '/app/maturity',
      'federation_intelligence', '/app/federation'
    ),
    'mobile_access', jsonb_build_object(
      'review_assessments', true, 'review_roadmaps', true,
      'review_scores', true, 'review_progress', true, 'generate_reports', true
    )
  );
end; $$;

create or replace function public.perform_organization_companion_maturity_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_action text := coalesce(p_payload->>'action_type', p_payload->>'action', '');
  v_roadmap_key text := coalesce(p_payload->>'roadmap_key', '');
  v_gap_key text := coalesce(p_payload->>'gap_key', '');
begin
  v_org_id := public._cmom575_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;
  perform public._bde_require_admin();

  if v_action = 'refresh_maturity' then
    perform public._cmom575_log(v_org_id, 'maturity_refreshed', 'Maturity center refreshed', p_payload, 'maturity');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'create_assessment' then
    perform public._cmom575_log(v_org_id, 'assessment_created', 'Assessment created', p_payload, 'assessment');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'generate_roadmap' then
    perform public._cmom575_log(v_org_id, 'roadmap_generated', 'Maturity roadmap generated', p_payload, 'roadmap');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'identify_gap' then
    perform public._cmom575_log(v_org_id, 'gap_identified', 'Capability gap identified', p_payload, 'gap');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'complete_milestone' and v_roadmap_key <> '' then
    perform public._cmom575_log(v_org_id, 'milestone_completed', 'Roadmap milestone completed', p_payload, 'milestone');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'update_score' then
    perform public._cmom575_log(v_org_id, 'score_updated', 'Evolution score updated', p_payload, 'score');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'generate_benchmark' then
    perform public._cmom575_log(v_org_id, 'benchmark_generated', 'Benchmark generated', p_payload, 'benchmark');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'generate_evolution_report' then
    perform public._cmom575_log(v_org_id, 'evolution_report_generated', 'Evolution report generated', p_payload, 'evolution');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'generate_maturity_briefing' then
    perform public._cmom575_log(v_org_id, 'maturity_briefing_generated', 'Maturity briefing generated', p_payload, 'maturity');
    return jsonb_build_object('ok', true, 'action', v_action);
  end if;
  raise exception 'Unknown action: %', v_action;
end; $$;

create or replace function public.get_organization_companion_maturity_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmom575_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return (public.get_organization_companion_maturity_center('overview')->'overview')
    || jsonb_build_object('found', true, 'route', '/app/maturity');
end; $$;

create or replace function public.get_assistant_companion_maturity_advisor_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmom575_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return jsonb_build_object(
    'found', true,
    'principle', 'Companion helps organizations understand where they are, where they want to be, and what is required to get there.',
    'advisor_prompts', jsonb_build_array(
      'Where are we weakest?', 'What should improve first?',
      'What capability limits growth?', 'Generate maturity briefing.'
    ),
    'total_capabilities', (select count(*) from public.organization_companion_maturity_capabilities where organization_id = v_org_id),
    'open_gaps', (select count(*) from public.organization_companion_maturity_gaps where organization_id = v_org_id and gap_status in ('open', 'planned', 'in_progress')),
    'evolution_score', coalesce((select evolution_score from public.organization_companion_maturity_evolution_scores where organization_id = v_org_id and score_key = 'organization' limit 1), 0),
    'route', '/app/maturity'
  );
end; $$;

grant execute on function public.get_organization_companion_maturity_center(text) to authenticated;
grant execute on function public.perform_organization_companion_maturity_action(jsonb) to authenticated;
grant execute on function public.get_organization_companion_maturity_mobile_summary() to authenticated;
grant execute on function public.get_assistant_companion_maturity_advisor_context() to authenticated;
