-- Phase 573 — Organizational Decision Memory, Reasoning History & Decision Intelligence Engine
-- Feature owner: CUSTOMER APP
-- Route: /app/decisions
-- Helpers: _cmde573_*

create table if not exists public.organization_companion_decision_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  decision_memory_enabled boolean not null default true,
  reasoning_capture_enabled boolean not null default true,
  review_cycles_enabled boolean not null default true,
  pattern_engine_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_companion_decision_settings enable row level security;
revoke all on public.organization_companion_decision_settings from authenticated, anon;

create table if not exists public.organization_companion_decision_registry (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  decision_key text not null,
  decision_id text not null,
  decision_title text not null,
  decision_category text not null check (
    decision_category in (
      'supplier_selection', 'budget_approval', 'market_expansion', 'hiring',
      'technology', 'business_pack_activation', 'process_change', 'custom'
    )
  ),
  owner_name text not null default '',
  approvers jsonb not null default '[]'::jsonb,
  decision_date date not null default current_date,
  decision_status text not null default 'pending' check (
    decision_status in ('draft', 'pending', 'approved', 'rejected', 'executed', 'review_due', 'archived')
  ),
  outcome_status text not null default 'pending' check (
    outcome_status in ('pending', 'successful', 'partially_successful', 'needs_review', 'unsuccessful')
  ),
  review_date date,
  business_pack text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, decision_key)
);

alter table public.organization_companion_decision_registry enable row level security;
revoke all on public.organization_companion_decision_registry from authenticated, anon;

create table if not exists public.organization_companion_decision_reasoning (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  decision_key text not null,
  context text not null default '' check (char_length(context) <= 500),
  options_considered jsonb not null default '[]'::jsonb,
  risks jsonb not null default '[]'::jsonb,
  benefits jsonb not null default '[]'::jsonb,
  forecasts jsonb not null default '[]'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  supporting_data jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, decision_key)
);

alter table public.organization_companion_decision_reasoning enable row level security;
revoke all on public.organization_companion_decision_reasoning from authenticated, anon;

create table if not exists public.organization_companion_decision_timeline (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  decision_key text not null,
  timeline_key text not null,
  stage text not null check (
    stage in ('created', 'analysis', 'review', 'approval', 'execution', 'outcome', 'lessons')
  ),
  stage_status text not null default 'completed' check (
    stage_status in ('pending', 'in_progress', 'completed', 'skipped')
  ),
  stage_label text not null default '',
  occurred_at timestamptz not null default now(),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, timeline_key)
);

alter table public.organization_companion_decision_timeline enable row level security;
revoke all on public.organization_companion_decision_timeline from authenticated, anon;

create table if not exists public.organization_companion_decision_options (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  decision_key text not null,
  option_key text not null,
  option_label text not null,
  benefits text not null default '',
  risks text not null default '',
  cost_estimate text not null default '',
  effort_estimate text not null default '',
  expected_outcome text not null default '',
  confidence text not null default 'moderate' check (
    confidence in ('low', 'moderate', 'high')
  ),
  selected boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, option_key)
);

alter table public.organization_companion_decision_options enable row level security;
revoke all on public.organization_companion_decision_options from authenticated, anon;

create table if not exists public.organization_companion_decision_outcomes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  decision_key text not null,
  outcome_key text not null,
  success_level text not null check (
    success_level in ('successful', 'partially_successful', 'needs_review', 'unsuccessful')
  ),
  business_impact text not null default '',
  financial_impact text not null default '',
  operational_impact text not null default '',
  lessons_learned text not null default '' check (char_length(lessons_learned) <= 500),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, outcome_key)
);

alter table public.organization_companion_decision_outcomes enable row level security;
revoke all on public.organization_companion_decision_outcomes from authenticated, anon;

create table if not exists public.organization_companion_decision_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  decision_key text not null,
  review_key text not null,
  review_type text not null check (
    review_type in ('30_day', '90_day', '6_month', 'annual')
  ),
  review_status text not null default 'scheduled' check (
    review_status in ('scheduled', 'due', 'completed', 'overdue', 'skipped')
  ),
  due_date date,
  findings text not null default '' check (char_length(findings) <= 500),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, review_key)
);

alter table public.organization_companion_decision_reviews enable row level security;
revoke all on public.organization_companion_decision_reviews from authenticated, anon;

create table if not exists public.organization_companion_decision_patterns (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pattern_key text not null,
  pattern_title text not null,
  pattern_type text not null check (
    pattern_type in (
      'repeated_success', 'repeated_failure', 'approval_bottleneck',
      'risk_pattern', 'forecast_accuracy'
    )
  ),
  pattern_status text not null default 'active' check (
    pattern_status in ('active', 'watch', 'resolved')
  ),
  confidence text not null default 'moderate' check (
    confidence in ('low', 'moderate', 'high')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pattern_key)
);

alter table public.organization_companion_decision_patterns enable row level security;
revoke all on public.organization_companion_decision_patterns from authenticated, anon;

create table if not exists public.organization_companion_decision_business_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  decision_types jsonb not null default '[]'::jsonb,
  recent_decisions jsonb not null default '[]'::jsonb,
  lessons_learned jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_companion_decision_business_packs enable row level security;
revoke all on public.organization_companion_decision_business_packs from authenticated, anon;

create table if not exists public.organization_companion_decision_health (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  health_score numeric(5,2) not null default 0 check (health_score between 0 and 100),
  health_status text not null default 'needs_review' check (
    health_status in ('excellent', 'healthy', 'needs_review', 'decision_risk')
  ),
  review_quality numeric(5,2) not null default 0,
  outcome_tracking numeric(5,2) not null default 0,
  approval_quality numeric(5,2) not null default 0,
  documentation_quality numeric(5,2) not null default 0,
  forecast_accuracy numeric(5,2) not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.organization_companion_decision_health enable row level security;
revoke all on public.organization_companion_decision_health from authenticated, anon;

create table if not exists public.organization_companion_decision_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'decision' check (
    audit_category in (
      'decision', 'approval', 'outcome', 'review', 'lesson', 'pattern', 'briefing'
    )
  ),
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_companion_decision_audit_logs_org_idx
  on public.organization_companion_decision_audit_logs (organization_id, created_at desc);

alter table public.organization_companion_decision_audit_logs enable row level security;
revoke all on public.organization_companion_decision_audit_logs from authenticated, anon;

create or replace function public._cmde573_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cmde573_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'decision'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_decision_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'decision'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cmde573_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_decision_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
  insert into public.organization_companion_decision_health (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cmde573_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_companion_decision_registry where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_companion_decision_registry (
    organization_id, decision_key, decision_id, decision_title, decision_category,
    owner_name, approvers, decision_date, decision_status, outcome_status, review_date, business_pack, summary
  ) values
    (p_org_id, 'dec_supplier_acme', 'DEC-2024-0142', 'Supplier Selection — Acme Logistics', 'supplier_selection',
     'Procurement Lead', '["CFO","Operations Director"]'::jsonb, '2024-03-15', 'executed', 'successful', '2025-03-15', 'finance',
     'Why did we choose this supplier? Documented reasoning preserved for future review.'),
    (p_org_id, 'dec_budget_q2', 'DEC-2025-0088', 'Q2 Budget Approval — Marketing Expansion', 'budget_approval',
     'CFO', '["CEO","Board"]'::jsonb, '2025-01-10', 'approved', 'partially_successful', '2025-07-10', 'finance',
     'Budget decision with forecasted ROI — 90-day review scheduled.'),
    (p_org_id, 'dec_market_se', 'DEC-2025-0112', 'Market Expansion — Sweden', 'market_expansion',
     'VP Sales', '["CEO","CFO"]'::jsonb, '2025-02-01', 'executed', 'needs_review', '2025-08-01', '',
     'Why did we enter this market? Full reasoning chain captured.'),
    (p_org_id, 'dec_hire_support', 'DEC-2025-0045', 'Hiring Decision — Support Team Lead', 'hiring',
     'HR Director', '["Support Director","CEO"]'::jsonb, '2025-01-22', 'executed', 'successful', '2025-07-22', 'support',
     'Hiring decision with options considered and outcome tracked.'),
    (p_org_id, 'dec_tech_crm', 'DEC-2024-0099', 'Technology Decision — CRM Migration', 'technology',
     'CTO', '["CFO","Operations"]'::jsonb, '2024-09-01', 'executed', 'partially_successful', '2025-09-01', '',
     'Why did we change this process? Technology decision memory preserved.'),
    (p_org_id, 'dec_pack_warehouse', 'DEC-2025-0067', 'Business Pack Activation — Warehouse', 'business_pack_activation',
     'Operations Director', '["CFO","CEO"]'::jsonb, '2025-02-15', 'approved', 'pending', '2025-08-15', 'warehouse',
     'Warehouse Pack activation — pending execution outcome.');

  insert into public.organization_companion_decision_reasoning (
    organization_id, decision_key, context, options_considered, risks, benefits, forecasts, recommendations, supporting_data, summary
  ) values
    (p_org_id, 'dec_supplier_acme', 'Need reliable Nordic logistics partner for warehouse expansion.',
     '["Acme Logistics","Nordic Freight","In-house fleet"]'::jsonb,
     '["Single supplier dependency","Price volatility"]'::jsonb,
     '["18% cost reduction","Faster delivery SLA"]'::jsonb,
     '["ROI positive within 8 months"]'::jsonb,
     '["Acme recommended — best SLA track record"]'::jsonb,
     '["Vendor scorecards","Pilot shipment data"]'::jsonb,
     'Context, options, and forecasts preserved — why we chose Acme.'),
    (p_org_id, 'dec_market_se', 'Evaluate Sweden as first international expansion market.',
     '["Sweden","Denmark","Germany"]'::jsonb,
     '["Regulatory complexity","Localization cost"]'::jsonb,
     '["Nordic market familiarity","Partner network exists"]'::jsonb,
     '["Break-even in 14 months"]'::jsonb,
     '["Sweden first — lowest entry barrier"]'::jsonb,
     '["Market research Q4 2024","Partner interviews"]'::jsonb,
     'Full reasoning for market entry decision preserved.');

  insert into public.organization_companion_decision_timeline (
    organization_id, decision_key, timeline_key, stage, stage_status, stage_label, occurred_at, summary
  ) values
    (p_org_id, 'dec_supplier_acme', 'tl_acme_created', 'created', 'completed', 'Decision Created', '2024-02-01', 'Supplier selection initiated.'),
    (p_org_id, 'dec_supplier_acme', 'tl_acme_analysis', 'analysis', 'completed', 'Analysis', '2024-02-15', 'Three options evaluated with cost and SLA data.'),
    (p_org_id, 'dec_supplier_acme', 'tl_acme_review', 'review', 'completed', 'Review', '2024-03-01', 'Operations and finance review completed.'),
    (p_org_id, 'dec_supplier_acme', 'tl_acme_approval', 'approval', 'completed', 'Approval', '2024-03-10', 'CFO and Operations Director approved.'),
    (p_org_id, 'dec_supplier_acme', 'tl_acme_execution', 'execution', 'completed', 'Execution', '2024-03-15', 'Contract signed and onboarding started.'),
    (p_org_id, 'dec_supplier_acme', 'tl_acme_outcome', 'outcome', 'completed', 'Outcome', '2024-12-01', 'Successful — 18% cost reduction achieved.'),
    (p_org_id, 'dec_supplier_acme', 'tl_acme_lessons', 'lessons', 'completed', 'Lessons Learned', '2024-12-15', 'Pilot period essential — document for future supplier decisions.');

  insert into public.organization_companion_decision_options (
    organization_id, decision_key, option_key, option_label, benefits, risks, cost_estimate, effort_estimate, expected_outcome, confidence, selected, summary
  ) values
    (p_org_id, 'dec_supplier_acme', 'opt_acme', 'Option A — Acme Logistics', 'Best SLA, Nordic coverage', 'Single supplier', 'Medium', 'Low', '18% cost reduction', 'high', true, 'Selected option.'),
    (p_org_id, 'dec_supplier_acme', 'opt_nordic', 'Option B — Nordic Freight', 'Lower cost', 'Limited coverage', 'Low', 'Low', '12% cost reduction', 'moderate', false, 'Rejected — coverage gaps.'),
    (p_org_id, 'dec_supplier_acme', 'opt_inhouse', 'Option C — In-house fleet', 'Full control', 'High capital', 'High', 'High', 'Long-term savings', 'low', false, 'Rejected — capital constraints.');

  insert into public.organization_companion_decision_outcomes (
    organization_id, decision_key, outcome_key, success_level, business_impact, financial_impact, operational_impact, lessons_learned, summary
  ) values
    (p_org_id, 'dec_supplier_acme', 'out_acme', 'successful', 'Delivery reliability improved', '18% logistics cost reduction', 'On-time delivery 96%', 'Always run pilot before full supplier switch.', 'Successful supplier decision.'),
    (p_org_id, 'dec_budget_q2', 'out_budget', 'partially_successful', 'Marketing reach expanded', 'ROI below forecast by 8%', 'Campaign execution delayed', 'Build buffer into marketing forecasts.', 'Needs 90-day review follow-up.'),
    (p_org_id, 'dec_hire_support', 'out_hire', 'successful', 'Support response time improved 22%', 'Within budget', 'Team morale improved', 'Structured interview rubric improved hire quality.', 'Successful hiring decision.');

  insert into public.organization_companion_decision_reviews (
    organization_id, decision_key, review_key, review_type, review_status, due_date, findings, summary
  ) values
    (p_org_id, 'dec_supplier_acme', 'rev_acme_annual', 'annual', 'completed', '2025-03-15', 'Expected benefits occurred. Risks were accurate.', 'Annual review complete — decision validated.'),
    (p_org_id, 'dec_budget_q2', 'rev_budget_90', '90_day', 'due', '2025-04-10', '', '90-day review due — did expected benefits occur?'),
    (p_org_id, 'dec_market_se', 'rev_se_6mo', '6_month', 'scheduled', '2025-08-01', '', '6-month market expansion review scheduled.'),
    (p_org_id, 'dec_tech_crm', 'rev_crm_annual', 'annual', 'overdue', '2025-09-01', '', 'Annual CRM decision review overdue.');

  insert into public.organization_companion_decision_patterns (
    organization_id, pattern_key, pattern_title, pattern_type, pattern_status, confidence, summary
  ) values
    (p_org_id, 'pat_no_review', 'Projects approved without review fail more often', 'repeated_failure', 'active', 'high',
     'Decisions skipping formal review show 2.3x higher failure rate.'),
    (p_org_id, 'pat_supplier', 'Supplier changes improve performance', 'repeated_success', 'active', 'moderate',
     'Documented supplier changes with pilot phase succeed 85% of the time.'),
    (p_org_id, 'pat_approval', 'Finance approvals bottleneck Q1', 'approval_bottleneck', 'watch', 'moderate',
     'Budget decisions queue 12+ days in Q1 — pattern identified.'),
    (p_org_id, 'pat_forecast', 'Marketing ROI forecasts optimistic', 'forecast_accuracy', 'active', 'high',
     'Marketing expansion forecasts average 8% optimistic vs actual.');

  insert into public.organization_companion_decision_business_packs (
    organization_id, pack_key, pack_title, decision_types, recent_decisions, lessons_learned, summary
  ) values
    (p_org_id, 'finance', 'Finance Pack', '["Budget Approval","Supplier Selection"]'::jsonb,
     '["Q2 Budget Approval","Supplier Selection — Acme"]'::jsonb,
     '["Build forecast buffers","Run supplier pilots"]'::jsonb, 'Finance Pack → Budget Decisions.'),
    (p_org_id, 'support', 'Support Pack', '["Hiring Decision","Operational Decisions"]'::jsonb,
     '["Support Team Lead Hire"]'::jsonb, '["Structured interview rubrics work"]'::jsonb, 'Support Pack → Operational Decisions.'),
    (p_org_id, 'warehouse', 'Warehouse Pack', '["Inventory Decisions","Pack Activation"]'::jsonb,
     '["Warehouse Pack Activation"]'::jsonb, '[]'::jsonb, 'Warehouse Pack → Inventory Decisions.');

  update public.organization_companion_decision_health set
    health_score = 78, health_status = 'healthy',
    review_quality = 82, outcome_tracking = 75,
    approval_quality = 80, documentation_quality = 85, forecast_accuracy = 68
  where organization_id = p_org_id;
end; $$;

create or replace function public.get_organization_companion_decision_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid; v_org jsonb; v_overview jsonb; v_decisions jsonb; v_approvals jsonb;
  v_outcomes jsonb; v_lessons jsonb; v_reviews jsonb; v_patterns jsonb; v_packs jsonb;
  v_briefings jsonb; v_health jsonb; v_knowledge jsonb; v_companion jsonb; v_reports jsonb; v_audit jsonb;
begin
  v_org_id := public._cmde573_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._cmde573_ensure_settings(v_org_id);
  perform public._cmde573_seed(v_org_id);

  select jsonb_build_object('id', o.id, 'name', o.name) into v_org from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'health_score', coalesce((select health_score from public.organization_companion_decision_health where organization_id = v_org_id), 0),
    'health_status', coalesce((select health_status from public.organization_companion_decision_health where organization_id = v_org_id), 'needs_review'),
    'total_decisions', (select count(*) from public.organization_companion_decision_registry where organization_id = v_org_id),
    'pending_decisions', (select count(*) from public.organization_companion_decision_registry where organization_id = v_org_id and decision_status = 'pending'),
    'pending_approvals', (select count(*) from public.organization_companion_decision_registry where organization_id = v_org_id and decision_status in ('pending', 'approved')),
    'reviews_due', (select count(*) from public.organization_companion_decision_reviews where organization_id = v_org_id and review_status in ('due', 'overdue')),
    'patterns_active', (select count(*) from public.organization_companion_decision_patterns where organization_id = v_org_id and pattern_status = 'active'),
    'successful_outcomes', (select count(*) from public.organization_companion_decision_outcomes where organization_id = v_org_id and success_level = 'successful')
  ) into v_overview;

  select coalesce(jsonb_agg(jsonb_build_object(
    'decision_key', d.decision_key, 'decision_id', d.decision_id, 'decision_title', d.decision_title,
    'decision_category', d.decision_category, 'owner_name', d.owner_name, 'approvers', d.approvers,
    'decision_date', d.decision_date, 'decision_status', d.decision_status, 'outcome_status', d.outcome_status,
    'review_date', d.review_date, 'business_pack', d.business_pack, 'summary', d.summary
  ) order by d.decision_date desc), '[]'::jsonb)
  into v_decisions from public.organization_companion_decision_registry d where d.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'decision_key', d.decision_key, 'decision_id', d.decision_id, 'decision_title', d.decision_title,
    'owner_name', d.owner_name, 'approvers', d.approvers, 'decision_status', d.decision_status, 'summary', d.summary
  ) order by d.decision_date desc), '[]'::jsonb)
  into v_approvals from public.organization_companion_decision_registry d
  where d.organization_id = v_org_id and d.decision_status in ('pending', 'approved');

  select coalesce(jsonb_agg(jsonb_build_object(
    'decision_key', o.decision_key, 'outcome_key', o.outcome_key, 'success_level', o.success_level,
    'business_impact', o.business_impact, 'financial_impact', o.financial_impact,
    'operational_impact', o.operational_impact, 'lessons_learned', o.lessons_learned, 'summary', o.summary
  ) order by o.success_level), '[]'::jsonb)
  into v_outcomes from public.organization_companion_decision_outcomes o where o.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'decision_key', o.decision_key, 'lessons_learned', o.lessons_learned, 'success_level', o.success_level, 'summary', o.summary
  ) order by o.decision_key), '[]'::jsonb)
  into v_lessons from public.organization_companion_decision_outcomes o
  where o.organization_id = v_org_id and o.lessons_learned <> '';

  select coalesce(jsonb_agg(jsonb_build_object(
    'decision_key', r.decision_key, 'review_key', r.review_key, 'review_type', r.review_type,
    'review_status', r.review_status, 'due_date', r.due_date, 'findings', r.findings, 'summary', r.summary
  ) order by case r.review_status when 'overdue' then 1 when 'due' then 2 else 3 end), '[]'::jsonb)
  into v_reviews from public.organization_companion_decision_reviews r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'pattern_key', p.pattern_key, 'pattern_title', p.pattern_title, 'pattern_type', p.pattern_type,
    'pattern_status', p.pattern_status, 'confidence', p.confidence, 'summary', p.summary
  ) order by p.pattern_title), '[]'::jsonb)
  into v_patterns from public.organization_companion_decision_patterns p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'pack_key', bp.pack_key, 'pack_title', bp.pack_title, 'decision_types', bp.decision_types,
    'recent_decisions', bp.recent_decisions, 'lessons_learned', bp.lessons_learned, 'summary', bp.summary
  ) order by bp.pack_title), '[]'::jsonb)
  into v_packs from public.organization_companion_decision_business_packs bp where bp.organization_id = v_org_id;

  select jsonb_build_object(
    'review_quality', coalesce((select review_quality from public.organization_companion_decision_health where organization_id = v_org_id), 0),
    'outcome_tracking', coalesce((select outcome_tracking from public.organization_companion_decision_health where organization_id = v_org_id), 0),
    'approval_quality', coalesce((select approval_quality from public.organization_companion_decision_health where organization_id = v_org_id), 0),
    'documentation_quality', coalesce((select documentation_quality from public.organization_companion_decision_health where organization_id = v_org_id), 0),
    'forecast_accuracy', coalesce((select forecast_accuracy from public.organization_companion_decision_health where organization_id = v_org_id), 0)
  ) into v_health;

  select jsonb_build_object(
    'supplier_decisions', (select count(*) from public.organization_companion_decision_registry where organization_id = v_org_id and decision_category = 'supplier_selection'),
    'budget_decisions', (select count(*) from public.organization_companion_decision_registry where organization_id = v_org_id and decision_category = 'budget_approval'),
    'hiring_decisions', (select count(*) from public.organization_companion_decision_registry where organization_id = v_org_id and decision_category = 'hiring'),
    'technology_decisions', (select count(*) from public.organization_companion_decision_registry where organization_id = v_org_id and decision_category = 'technology'),
    'expansion_decisions', (select count(*) from public.organization_companion_decision_registry where organization_id = v_org_id and decision_category = 'market_expansion'),
    'categories', coalesce((
      select jsonb_agg(distinct decision_category) from public.organization_companion_decision_registry where organization_id = v_org_id
    ), '[]'::jsonb)
  ) into v_knowledge;

  select jsonb_build_object(
    'decision_history', v_decisions,
    'pending_decisions', (select count(*) from public.organization_companion_decision_registry where organization_id = v_org_id and decision_status = 'pending'),
    'decision_outcomes', v_outcomes,
    'review_status', v_reviews,
    'decision_risks', (select count(*) from public.organization_companion_decision_reviews where organization_id = v_org_id and review_status = 'overdue'),
    'decision_trends', v_patterns,
    'companion_recommendations', jsonb_build_array(
      jsonb_build_object('title', 'Complete overdue CRM annual review', 'reason', 'Decision memory gap — reasoning may be lost'),
      jsonb_build_object('title', 'Run 90-day budget review', 'reason', 'Did expected benefits occur?'),
      jsonb_build_object('title', 'Document warehouse pack activation outcome', 'reason', 'Outcome tracking pending')
    )
  ) into v_briefings;

  select jsonb_build_object(
    'decision_advisor_prompts', jsonb_build_array(
      'Have we done this before?', 'What happened last time?', 'What options were considered?',
      'Who approved this?', 'What were the outcomes?', 'Why did we choose this supplier?',
      'Why did we enter this market?', 'Generate decision briefing.'
    )
  ) into v_companion;

  select jsonb_build_object(
    'executive_briefing', v_briefings,
    'pattern_report', v_patterns,
    'health_report', v_health,
    'knowledge_base', v_knowledge
  ) into v_reports;

  select coalesce((
    select jsonb_agg(jsonb_build_object('event_type', al.event_type, 'audit_category', al.audit_category,
      'summary', al.summary, 'created_at', al.created_at) order by al.created_at desc)
    from (select * from public.organization_companion_decision_audit_logs where organization_id = v_org_id order by created_at desc limit 10) al
  ), '[]'::jsonb) into v_audit;

  return jsonb_build_object(
    'found', true,
    'principle', 'Organizations should not only remember decisions — they should remember why they made them.',
    'philosophy', 'One Decision Center. One Reasoning Engine. One Organizational Memory Framework.',
    'section', coalesce(p_section, 'overview'),
    'organization', v_org,
    'overview', v_overview,
    'decisions', v_decisions,
    'decision_registry', v_decisions,
    'approvals', v_approvals,
    'outcomes', v_outcomes,
    'lessons', v_lessons,
    'reviews', v_reviews,
    'patterns', v_patterns,
    'business_packs', v_packs,
    'decision_health', v_health,
    'knowledge_base', v_knowledge,
    'executive_briefings', v_briefings,
    'companion', v_companion,
    'reports', v_reports,
    'audit_recent', v_audit,
    'routes', jsonb_build_object('decisions', '/app/decisions'),
    'mobile_access', jsonb_build_object(
      'review_decisions', true, 'review_outcomes', true, 'review_history', true,
      'review_approvals', true, 'generate_briefings', true
    )
  );
end; $$;

create or replace function public.get_organization_companion_decision_detail(p_decision_key text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_decision jsonb; v_reasoning jsonb; v_timeline jsonb; v_options jsonb;
begin
  v_org_id := public._cmde573_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  select to_jsonb(d.*) into v_decision from public.organization_companion_decision_registry d
  where d.organization_id = v_org_id and d.decision_key = p_decision_key;

  select to_jsonb(r.*) into v_reasoning from public.organization_companion_decision_reasoning r
  where r.organization_id = v_org_id and r.decision_key = p_decision_key;

  select coalesce(jsonb_agg(to_jsonb(t.*) order by t.occurred_at), '[]'::jsonb) into v_timeline
  from public.organization_companion_decision_timeline t
  where t.organization_id = v_org_id and t.decision_key = p_decision_key;

  select coalesce(jsonb_agg(to_jsonb(o.*) order by o.option_label), '[]'::jsonb) into v_options
  from public.organization_companion_decision_options o
  where o.organization_id = v_org_id and o.decision_key = p_decision_key;

  return jsonb_build_object(
    'found', v_decision is not null,
    'decision', v_decision,
    'reasoning', v_reasoning,
    'timeline', v_timeline,
    'options', v_options
  );
end; $$;

create or replace function public.perform_organization_companion_decision_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_action text := coalesce(p_payload->>'action_type', p_payload->>'action', '');
  v_decision_key text := coalesce(p_payload->>'decision_key', '');
begin
  v_org_id := public._cmde573_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;
  perform public._bde_require_admin();

  if v_action = 'refresh_decisions' then
    perform public._cmde573_log(v_org_id, 'decisions_refreshed', 'Decision center refreshed', p_payload, 'decision');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'approve_decision' and v_decision_key <> '' then
    update public.organization_companion_decision_registry set decision_status = 'approved'
    where organization_id = v_org_id and decision_key = v_decision_key;
    perform public._cmde573_log(v_org_id, 'decision_approved', 'Decision approved', p_payload, 'approval');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'reject_decision' and v_decision_key <> '' then
    update public.organization_companion_decision_registry set decision_status = 'rejected'
    where organization_id = v_org_id and decision_key = v_decision_key;
    perform public._cmde573_log(v_org_id, 'decision_rejected', 'Decision rejected', p_payload, 'approval');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'record_outcome' and v_decision_key <> '' then
    perform public._cmde573_log(v_org_id, 'outcome_recorded', 'Decision outcome recorded', p_payload, 'outcome');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'complete_review' and v_decision_key <> '' then
    perform public._cmde573_log(v_org_id, 'decision_reviewed', 'Decision review completed', p_payload, 'review');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'add_lesson' then
    perform public._cmde573_log(v_org_id, 'lesson_added', 'Lesson added to decision memory', p_payload, 'lesson');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'identify_pattern' then
    perform public._cmde573_log(v_org_id, 'pattern_identified', 'Decision pattern identified', p_payload, 'pattern');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'generate_briefing' then
    perform public._cmde573_log(v_org_id, 'briefing_generated', 'Executive decision briefing generated', p_payload, 'briefing');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'create_decision' then
    perform public._cmde573_log(v_org_id, 'decision_created', 'Decision created in registry', p_payload, 'decision');
    return jsonb_build_object('ok', true, 'action', v_action);
  end if;
  raise exception 'Unknown action: %', v_action;
end; $$;

create or replace function public.get_organization_companion_decision_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmde573_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return (public.get_organization_companion_decision_center('overview')->'overview')
    || jsonb_build_object(
      'found', true,
      'route', '/app/decisions',
      'mobile_access', jsonb_build_object(
        'review_decisions', true, 'review_outcomes', true, 'review_history', true,
        'review_approvals', true, 'generate_briefings', true
      )
    );
end; $$;

create or replace function public.get_assistant_companion_decision_advisor_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmde573_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return jsonb_build_object(
    'found', true,
    'principle', 'Companion preserves organizational reasoning — why decisions were made, not just what was decided.',
    'advisor_prompts', jsonb_build_array(
      'Have we done this before?', 'What happened last time?', 'What options were considered?',
      'Who approved this?', 'Why did we choose this supplier?', 'Generate decision briefing.'
    ),
    'total_decisions', (select count(*) from public.organization_companion_decision_registry where organization_id = v_org_id),
    'reviews_due', (select count(*) from public.organization_companion_decision_reviews where organization_id = v_org_id and review_status in ('due', 'overdue')),
    'health_status', coalesce((select health_status from public.organization_companion_decision_health where organization_id = v_org_id), 'needs_review'),
    'route', '/app/decisions'
  );
end; $$;

grant execute on function public.get_organization_companion_decision_center(text) to authenticated;
grant execute on function public.get_organization_companion_decision_detail(text) to authenticated;
grant execute on function public.perform_organization_companion_decision_action(jsonb) to authenticated;
grant execute on function public.get_organization_companion_decision_mobile_summary() to authenticated;
grant execute on function public.get_assistant_companion_decision_advisor_context() to authenticated;
