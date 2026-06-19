-- Phase 567 — Organizational Resilience, Continuity & Crisis Management Engine
-- Feature owner: CUSTOMER APP
-- Routes: /app/resilience, /app/resilience/incidents, /app/resilience/emergency
-- Helpers: _cmor567_*

create table if not exists public.organization_companion_resilience_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  resilience_enabled boolean not null default true,
  continuity_planning_enabled boolean not null default true,
  crisis_communication_approval_required boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_companion_resilience_settings enable row level security;
revoke all on public.organization_companion_resilience_settings from authenticated, anon;

create table if not exists public.organization_companion_resilience_incidents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  incident_key text not null,
  incident_title text not null,
  incident_type text not null check (
    incident_type in (
      'operational', 'technology', 'financial', 'security', 'compliance',
      'supplier', 'people', 'facilities', 'custom'
    )
  ),
  severity text not null default 'moderate' check (
    severity in ('minor', 'moderate', 'major', 'critical')
  ),
  incident_status text not null default 'open' check (
    incident_status in ('open', 'investigating', 'recovering', 'resolved', 'closed')
  ),
  owner_name text not null default '',
  impact_summary text not null default '' check (char_length(impact_summary) <= 500),
  affected_areas jsonb not null default '[]'::jsonb,
  timeline jsonb not null default '[]'::jsonb,
  lessons_learned text not null default '' check (char_length(lessons_learned) <= 500),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, incident_key)
);

alter table public.organization_companion_resilience_incidents enable row level security;
revoke all on public.organization_companion_resilience_incidents from authenticated, anon;

create table if not exists public.organization_companion_resilience_continuity_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  plan_key text not null,
  plan_title text not null,
  plan_type text not null check (
    plan_type in (
      'department', 'location', 'business_pack', 'executive', 'disaster_recovery', 'custom'
    )
  ),
  plan_status text not null default 'active' check (
    plan_status in ('draft', 'active', 'review_required', 'archived')
  ),
  critical_processes jsonb not null default '[]'::jsonb,
  fallback_systems jsonb not null default '[]'::jsonb,
  emergency_contacts jsonb not null default '[]'::jsonb,
  business_pack_key text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, plan_key)
);

alter table public.organization_companion_resilience_continuity_plans enable row level security;
revoke all on public.organization_companion_resilience_continuity_plans from authenticated, anon;

create table if not exists public.organization_companion_resilience_recovery (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  recovery_key text not null,
  recovery_title text not null,
  incident_key text not null default '',
  recovery_status text not null default 'in_progress' check (
    recovery_status in ('planned', 'in_progress', 'delayed', 'completed', 'failed')
  ),
  recovery_progress_pct numeric(5,2) not null default 0 check (recovery_progress_pct between 0 and 100),
  recovery_time_hours numeric(8,2) not null default 0,
  recovery_cost_estimate numeric(14,2) not null default 0,
  recovery_outcome text not null default '' check (char_length(recovery_outcome) <= 500),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, recovery_key)
);

alter table public.organization_companion_resilience_recovery enable row level security;
revoke all on public.organization_companion_resilience_recovery from authenticated, anon;

create table if not exists public.organization_companion_resilience_dependencies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  dependency_key text not null,
  dependency_title text not null,
  dependency_type text not null check (
    dependency_type in (
      'supplier', 'employee', 'technology', 'partner', 'domain', 'business_pack', 'custom'
    )
  ),
  risk_level text not null default 'moderate' check (
    risk_level in ('low', 'moderate', 'elevated', 'high', 'critical')
  ),
  dependency_status text not null default 'active' check (
    dependency_status in ('active', 'monitoring', 'at_risk', 'failed', 'mitigated')
  ),
  knowledge_graph_linked boolean not null default true,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, dependency_key)
);

alter table public.organization_companion_resilience_dependencies enable row level security;
revoke all on public.organization_companion_resilience_dependencies from authenticated, anon;

create table if not exists public.organization_companion_resilience_preparedness (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  preparedness_key text not null,
  preparedness_title text not null,
  activity_type text not null check (
    activity_type in ('training', 'exercise', 'simulation', 'recovery_test', 'continuity_test')
  ),
  activity_status text not null default 'scheduled' check (
    activity_status in ('scheduled', 'in_progress', 'completed', 'review_required')
  ),
  readiness_score numeric(5,2) not null default 0,
  improvements jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, preparedness_key)
);

alter table public.organization_companion_resilience_preparedness enable row level security;
revoke all on public.organization_companion_resilience_preparedness from authenticated, anon;

create table if not exists public.organization_companion_resilience_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  score_key text not null,
  dimension text not null check (
    dimension in (
      'preparedness', 'recovery_readiness', 'continuity_coverage',
      'dependency_risk', 'training_activity', 'simulation_results'
    )
  ),
  score_value numeric(5,2) not null default 0 check (score_value between 0 and 100),
  resilience_label text not null default 'stable' check (
    resilience_label in ('strong', 'stable', 'vulnerable', 'critical')
  ),
  unique (organization_id, score_key)
);

alter table public.organization_companion_resilience_scores enable row level security;
revoke all on public.organization_companion_resilience_scores from authenticated, anon;

create table if not exists public.organization_companion_resilience_crisis_communications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  communication_key text not null,
  communication_title text not null,
  audience_type text not null check (
    audience_type in ('internal', 'executive', 'partner', 'customer', 'incident_report')
  ),
  communication_status text not null default 'draft' check (
    communication_status in ('draft', 'pending_approval', 'approved', 'sent', 'archived')
  ),
  incident_key text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, communication_key)
);

alter table public.organization_companion_resilience_crisis_communications enable row level security;
revoke all on public.organization_companion_resilience_crisis_communications from authenticated, anon;

create table if not exists public.organization_companion_resilience_scenarios (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  scenario_key text not null,
  scenario_title text not null,
  scenario_type text not null check (
    scenario_type in (
      'supplier_failure', 'cyber_incident', 'market_disruption',
      'facility_closure', 'employee_loss', 'custom'
    )
  ),
  scenario_status text not null default 'scheduled' check (
    scenario_status in ('scheduled', 'running', 'completed', 'review_required')
  ),
  digital_twin_linked boolean not null default true,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, scenario_key)
);

alter table public.organization_companion_resilience_scenarios enable row level security;
revoke all on public.organization_companion_resilience_scenarios from authenticated, anon;

create table if not exists public.organization_companion_resilience_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null,
  metric_title text not null,
  metric_value numeric(12,2) not null default 0,
  metric_category text not null default 'resilience' check (
    metric_category in ('resilience', 'incidents', 'recovery', 'preparedness', 'continuity')
  ),
  unique (organization_id, metric_key)
);

alter table public.organization_companion_resilience_analytics enable row level security;
revoke all on public.organization_companion_resilience_analytics from authenticated, anon;

create table if not exists public.organization_companion_resilience_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'resilience' check (
    audit_category in (
      'incident', 'recovery', 'continuity', 'preparedness', 'resilience',
      'dependency', 'crisis', 'scenario'
    )
  ),
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_companion_resilience_audit_logs_org_idx
  on public.organization_companion_resilience_audit_logs (organization_id, created_at desc);

alter table public.organization_companion_resilience_audit_logs enable row level security;
revoke all on public.organization_companion_resilience_audit_logs from authenticated, anon;

create or replace function public._cmor567_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cmor567_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'resilience'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_resilience_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'resilience'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cmor567_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_resilience_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cmor567_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_companion_resilience_incidents where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_companion_resilience_incidents (
    organization_id, incident_key, incident_title, incident_type, severity,
    incident_status, owner_name, impact_summary, affected_areas, summary
  ) values
    (p_org_id, 'inc_supplier_delay', 'Primary Supplier Delay', 'supplier', 'major', 'recovering',
     'Operations Director', 'Warehouse fulfillment delayed 48 hours',
     '["warehouse","fulfillment"]'::jsonb, 'Supplier disruption — alternative supplier activation in progress.'),
    (p_org_id, 'inc_system_outage', 'Payment System Outage', 'technology', 'critical', 'investigating',
     'CTO', 'Payment processing unavailable for customer transactions',
     '["finance","support","commerce"]'::jsonb, 'Critical technology incident — fallback procedures under review.'),
    (p_org_id, 'inc_compliance_review', 'Compliance Audit Finding', 'compliance', 'moderate', 'open',
     'Compliance Officer', 'Minor compliance gap identified during audit',
     '["legal","operations"]'::jsonb, 'Moderate compliance incident — remediation plan required.');

  insert into public.organization_companion_resilience_continuity_plans (
    organization_id, plan_key, plan_title, plan_type, plan_status,
    critical_processes, fallback_systems, emergency_contacts, business_pack_key, summary
  ) values
    (p_org_id, 'cont_finance', 'Finance Continuity Plan', 'business_pack', 'active',
     '["payment_processing","invoicing","payroll"]'::jsonb,
     '["manual_payment_workflow","backup_accounting_system"]'::jsonb,
     '["CFO","Finance Director"]'::jsonb, 'pack_finance',
     'Finance continuity — fallback systems and alternative providers documented.'),
    (p_org_id, 'cont_support', 'Support Continuity Plan', 'department', 'active',
     '["customer_support","ticket_routing"]'::jsonb,
     '["backup_helpdesk","status_page"]'::jsonb,
     '["Support Lead","VP Customer Success"]'::jsonb, 'pack_support',
     'Support continuity — customer communication during disruptions.'),
    (p_org_id, 'cont_warehouse', 'Warehouse Continuity Plan', 'business_pack', 'review_required',
     '["inventory","shipping","receiving"]'::jsonb,
     '["alternative_supplier","secondary_warehouse"]'::jsonb,
     '["Warehouse Manager","Operations Director"]'::jsonb, 'pack_warehouse',
     'Warehouse continuity plan — review required before next audit.');

  insert into public.organization_companion_resilience_recovery (
    organization_id, recovery_key, recovery_title, incident_key, recovery_status,
    recovery_progress_pct, recovery_time_hours, recovery_cost_estimate, recovery_outcome, summary
  ) values
    (p_org_id, 'rec_supplier', 'Supplier Recovery — Alternative Activation', 'inc_supplier_delay', 'in_progress',
     65, 36, 12000, 'Alternative supplier activated — normal operations expected within 24 hours',
     'Recovery in progress — progress tracked to normal operations.'),
    (p_org_id, 'rec_payment', 'Payment System Recovery', 'inc_system_outage', 'planned',
     15, 0, 8500, 'Recovery initiated — engineering team engaged',
     'Payment system recovery — critical path identified.');

  insert into public.organization_companion_resilience_dependencies (
    organization_id, dependency_key, dependency_title, dependency_type, risk_level,
    dependency_status, knowledge_graph_linked, summary
  ) values
    (p_org_id, 'dep_primary_supplier', 'Primary Logistics Supplier', 'supplier', 'elevated', 'at_risk', true,
     'Single-source supplier — alternative provider documented in continuity plan.'),
    (p_org_id, 'dep_payment_gateway', 'Payment Gateway Provider', 'technology', 'high', 'monitoring', true,
     'Critical technology dependency — fallback procedures required.'),
    (p_org_id, 'dep_key_engineer', 'Lead Platform Engineer', 'employee', 'moderate', 'active', true,
     'Key employee dependency — succession plan recommended.'),
    (p_org_id, 'dep_domain_dns', 'Primary Domain DNS', 'domain', 'low', 'active', true,
     'Domain dependency — redundant DNS configured.');

  insert into public.organization_companion_resilience_preparedness (
    organization_id, preparedness_key, preparedness_title, activity_type, activity_status,
    readiness_score, improvements, summary
  ) values
    (p_org_id, 'prep_continuity_test', 'Q1 Continuity Test', 'continuity_test', 'completed', 82,
     '["Update emergency contacts","Refresh fallback procedures"]'::jsonb,
     'Continuity test completed — preparedness increased with identified improvements.'),
    (p_org_id, 'prep_cyber_sim', 'Cyber Incident Simulation', 'simulation', 'scheduled', 0,
     '[]'::jsonb,
     'Scheduled cyber incident simulation — Digital Twin Phase 543 linked.'),
    (p_org_id, 'prep_recovery_drill', 'Disaster Recovery Drill', 'recovery_test', 'review_required', 74,
     '["Reduce recovery time objective","Update runbooks"]'::jsonb,
     'Recovery drill completed — improvements identified.');

  insert into public.organization_companion_resilience_scores (
    organization_id, score_key, dimension, score_value, resilience_label
  ) values
    (p_org_id, 'score_preparedness', 'preparedness', 78, 'stable'),
    (p_org_id, 'score_recovery', 'recovery_readiness', 72, 'stable'),
    (p_org_id, 'score_continuity', 'continuity_coverage', 85, 'strong'),
    (p_org_id, 'score_dependency', 'dependency_risk', 58, 'vulnerable'),
    (p_org_id, 'score_training', 'training_activity', 80, 'strong'),
    (p_org_id, 'score_simulation', 'simulation_results', 70, 'stable');

  insert into public.organization_companion_resilience_crisis_communications (
    organization_id, communication_key, communication_title, audience_type,
    communication_status, incident_key, summary
  ) values
    (p_org_id, 'comm_exec_brief', 'Executive Incident Briefing', 'executive', 'pending_approval', 'inc_system_outage',
     'Executive update on payment system outage — approval required before send.'),
    (p_org_id, 'comm_internal', 'Internal Operations Update', 'internal', 'approved', 'inc_supplier_delay',
     'Internal team update on supplier recovery progress.'),
    (p_org_id, 'comm_customer', 'Customer Status Notification', 'customer', 'draft', 'inc_system_outage',
     'Customer notification draft — approval rules apply.');

  insert into public.organization_companion_resilience_scenarios (
    organization_id, scenario_key, scenario_title, scenario_type, scenario_status, digital_twin_linked, summary
  ) values
    (p_org_id, 'scen_supplier_fail', 'Supplier Failure Scenario', 'supplier_failure', 'completed', true,
     'Tested supplier failure readiness — alternative activation validated.'),
    (p_org_id, 'scen_cyber', 'Cyber Incident Scenario', 'cyber_incident', 'scheduled', true,
     'Scheduled cyber incident test — Digital Twin integration.'),
    (p_org_id, 'scen_facility', 'Facility Closure Scenario', 'facility_closure', 'review_required', true,
     'Facility closure simulation — review improvements before next test.');

  insert into public.organization_companion_resilience_analytics (
    organization_id, metric_key, metric_title, metric_value, metric_category
  ) values
    (p_org_id, 'metric_resilience_score', 'Overall Resilience Score', 74, 'resilience'),
    (p_org_id, 'metric_open_incidents', 'Open Incidents', 3, 'incidents'),
    (p_org_id, 'metric_recovery_active', 'Active Recoveries', 2, 'recovery'),
    (p_org_id, 'metric_preparedness', 'Preparedness Level', 78, 'preparedness');
end; $$;

create or replace function public.get_organization_companion_resilience_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid; v_org jsonb; v_overview jsonb; v_incidents jsonb; v_continuity jsonb;
  v_recovery jsonb; v_dependencies jsonb; v_preparedness jsonb; v_crisis jsonb;
  v_reports jsonb; v_executive jsonb; v_integrations jsonb; v_audit jsonb;
  v_scores jsonb; v_avg_score numeric;
begin
  v_org_id := public._cmor567_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._cmor567_ensure_settings(v_org_id);
  perform public._cmor567_seed(v_org_id);

  select jsonb_build_object('id', o.id, 'name', o.name) into v_org from public.organizations o where o.id = v_org_id;

  select round(avg(score_value)::numeric, 0) into v_avg_score
  from public.organization_companion_resilience_scores where organization_id = v_org_id;

  select jsonb_build_object(
    'resilience_score', coalesce(v_avg_score, 75),
    'open_incidents', (select count(*) from public.organization_companion_resilience_incidents where organization_id = v_org_id and incident_status in ('open', 'investigating', 'recovering')),
    'critical_incidents', (select count(*) from public.organization_companion_resilience_incidents where organization_id = v_org_id and severity = 'critical' and incident_status != 'closed'),
    'recovery_in_progress', (select count(*) from public.organization_companion_resilience_recovery where organization_id = v_org_id and recovery_status = 'in_progress'),
    'critical_dependencies', (select count(*) from public.organization_companion_resilience_dependencies where organization_id = v_org_id and risk_level in ('high', 'critical')),
    'preparedness_level', coalesce((select metric_value from public.organization_companion_resilience_analytics where organization_id = v_org_id and metric_key = 'metric_preparedness'), 75),
    'continuity_plans_active', (select count(*) from public.organization_companion_resilience_continuity_plans where organization_id = v_org_id and plan_status = 'active')
  ) into v_overview;

  select coalesce(jsonb_agg(jsonb_build_object(
    'incident_key', i.incident_key, 'incident_title', i.incident_title, 'incident_type', i.incident_type,
    'severity', i.severity, 'incident_status', i.incident_status, 'owner_name', i.owner_name,
    'impact_summary', i.impact_summary, 'affected_areas', i.affected_areas,
    'lessons_learned', i.lessons_learned, 'summary', i.summary
  ) order by case i.severity when 'critical' then 1 when 'major' then 2 when 'moderate' then 3 else 4 end), '[]'::jsonb)
  into v_incidents from public.organization_companion_resilience_incidents i where i.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'plan_key', p.plan_key, 'plan_title', p.plan_title, 'plan_type', p.plan_type,
    'plan_status', p.plan_status, 'critical_processes', p.critical_processes,
    'fallback_systems', p.fallback_systems, 'emergency_contacts', p.emergency_contacts,
    'business_pack_key', p.business_pack_key, 'summary', p.summary
  ) order by p.plan_title), '[]'::jsonb)
  into v_continuity from public.organization_companion_resilience_continuity_plans p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'recovery_key', r.recovery_key, 'recovery_title', r.recovery_title, 'incident_key', r.incident_key,
    'recovery_status', r.recovery_status, 'recovery_progress_pct', r.recovery_progress_pct,
    'recovery_time_hours', r.recovery_time_hours, 'recovery_cost_estimate', r.recovery_cost_estimate,
    'recovery_outcome', r.recovery_outcome, 'summary', r.summary
  ) order by r.recovery_progress_pct desc), '[]'::jsonb)
  into v_recovery from public.organization_companion_resilience_recovery r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'dependency_key', d.dependency_key, 'dependency_title', d.dependency_title,
    'dependency_type', d.dependency_type, 'risk_level', d.risk_level,
    'dependency_status', d.dependency_status, 'knowledge_graph_linked', d.knowledge_graph_linked,
    'summary', d.summary
  ) order by d.risk_level desc), '[]'::jsonb)
  into v_dependencies from public.organization_companion_resilience_dependencies d where d.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'preparedness_key', p.preparedness_key, 'preparedness_title', p.preparedness_title,
    'activity_type', p.activity_type, 'activity_status', p.activity_status,
    'readiness_score', p.readiness_score, 'improvements', p.improvements, 'summary', p.summary
  ) order by p.preparedness_title), '[]'::jsonb)
  into v_preparedness from public.organization_companion_resilience_preparedness p where p.organization_id = v_org_id;

  select jsonb_build_object(
    'active_incidents', coalesce((
      select jsonb_agg(jsonb_build_object(
        'incident_key', i.incident_key, 'incident_title', i.incident_title,
        'severity', i.severity, 'incident_status', i.incident_status, 'owner_name', i.owner_name
      ))
      from public.organization_companion_resilience_incidents i
      where i.organization_id = v_org_id and i.incident_status in ('open', 'investigating', 'recovering')
    ), '[]'::jsonb),
    'communications', coalesce((
      select jsonb_agg(jsonb_build_object(
        'communication_key', c.communication_key, 'communication_title', c.communication_title,
        'audience_type', c.audience_type, 'communication_status', c.communication_status, 'summary', c.summary
      ))
      from public.organization_companion_resilience_crisis_communications c where c.organization_id = v_org_id
    ), '[]'::jsonb),
    'response_teams', jsonb_build_array('Operations Response', 'Technology Response', 'Executive Crisis Team'),
    'escalation_path', jsonb_build_array('Incident Owner', 'Department Lead', 'Executive Team', 'Crisis Commander')
  ) into v_crisis;

  select coalesce(jsonb_agg(jsonb_build_object(
    'score_key', s.score_key, 'dimension', s.dimension, 'score_value', s.score_value,
    'resilience_label', s.resilience_label
  ) order by s.score_value desc), '[]'::jsonb)
  into v_scores from public.organization_companion_resilience_scores s where s.organization_id = v_org_id;

  select jsonb_build_object(
    'resilience_scores', v_scores,
    'overall_score', coalesce(v_avg_score, 75),
    'incident_trends', jsonb_build_object('open', (select count(*) from public.organization_companion_resilience_incidents where organization_id = v_org_id and incident_status != 'closed')),
    'scenario_tests', coalesce((
      select jsonb_agg(jsonb_build_object(
        'scenario_key', sc.scenario_key, 'scenario_title', sc.scenario_title,
        'scenario_type', sc.scenario_type, 'scenario_status', sc.scenario_status,
        'digital_twin_linked', sc.digital_twin_linked, 'summary', sc.summary
      ) order by sc.scenario_title)
      from public.organization_companion_resilience_scenarios sc where sc.organization_id = v_org_id
    ), '[]'::jsonb),
    'companion_recommendations', jsonb_build_array(
      jsonb_build_object('title', 'Address payment system critical incident', 'reason', 'Critical technology incident — activate continuity plan'),
      jsonb_build_object('title', 'Review warehouse continuity plan', 'reason', 'Continuity plan review required'),
      jsonb_build_object('title', 'Mitigate supplier dependency risk', 'reason', 'Elevated dependency risk — alternative provider validation needed')
    )
  ) into v_reports;

  select jsonb_build_object(
    'resilience_score', coalesce(v_avg_score, 75),
    'open_incidents', (select count(*) from public.organization_companion_resilience_incidents where organization_id = v_org_id and incident_status in ('open', 'investigating', 'recovering')),
    'preparedness_level', coalesce((select metric_value from public.organization_companion_resilience_analytics where organization_id = v_org_id and metric_key = 'metric_preparedness'), 75),
    'critical_risks', (select count(*) from public.organization_companion_resilience_dependencies where organization_id = v_org_id and risk_level in ('high', 'critical')),
    'recovery_activity', (select count(*) from public.organization_companion_resilience_recovery where organization_id = v_org_id and recovery_status = 'in_progress'),
    'companion_recommendations', 3
  ) into v_executive;

  select jsonb_build_object(
    'crisis_advisor_prompts', jsonb_build_array(
      'What is affected?', 'Who should be notified?', 'What continuity plan exists?',
      'What recovery steps are recommended?', 'Generate crisis briefing.'
    ),
    'knowledge_graph_integration', jsonb_build_object('phase', '540', 'route', '/app/knowledge-graph'),
    'digital_twin_integration', jsonb_build_object('phase', '543', 'route', '/app/business-digital-twin'),
    'business_pack_integration', jsonb_build_object(
      'finance_pack', 'Financial recovery',
      'support_pack', 'Customer continuity',
      'warehouse_pack', 'Inventory recovery',
      'partner_pack', 'Partner continuity',
      'route', '/app/settings/modules'
    ),
    'future_readiness_integration', jsonb_build_object('phase', '566', 'route', '/app/future-readiness')
  ) into v_integrations;

  select coalesce((
    select jsonb_agg(jsonb_build_object('event_type', al.event_type, 'audit_category', al.audit_category,
      'summary', al.summary, 'created_at', al.created_at) order by al.created_at desc)
    from (select * from public.organization_companion_resilience_audit_logs where organization_id = v_org_id order by created_at desc limit 10) al
  ), '[]'::jsonb) into v_audit;

  return jsonb_build_object(
    'found', true,
    'principle', 'Successful organizations are defined by how they respond when problems occur — not by avoiding problems.',
    'philosophy', 'Companion helps organizations remain operational under pressure — prepare, respond, recover, learn.',
    'section', coalesce(p_section, 'overview'),
    'organization', v_org,
    'overview', v_overview,
    'incidents', v_incidents,
    'continuity', v_continuity,
    'business_continuity', v_continuity,
    'recovery', v_recovery,
    'crisis_management', v_crisis,
    'dependencies', v_dependencies,
    'preparedness', v_preparedness,
    'reports', v_reports,
    'executive_dashboard', v_executive,
    'integrations', v_integrations,
    'resilience_scores', v_scores,
    'audit_recent', v_audit,
    'routes', jsonb_build_object(
      'resilience', '/app/resilience',
      'incidents', '/app/resilience/incidents',
      'emergency', '/app/resilience/emergency',
      'knowledge_graph', '/app/knowledge-graph',
      'digital_twin', '/app/business-digital-twin'
    ),
    'notifications', jsonb_build_object(
      'critical_incident_created', true, 'recovery_delayed', true,
      'preparedness_review_due', true, 'dependency_risk_increased', true,
      'continuity_plan_missing', true
    ),
    'mobile_access', jsonb_build_object(
      'review_incidents', true, 'review_recovery', true, 'review_continuity_plans', true,
      'review_risks', true, 'coordinate_response', true
    )
  );
end; $$;

create or replace function public.perform_organization_companion_resilience_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_action text := coalesce(p_payload->>'action_type', p_payload->>'action', '');
  v_incident_key text := coalesce(p_payload->>'incident_key', '');
  v_recovery_key text := coalesce(p_payload->>'recovery_key', '');
  v_plan_key text := coalesce(p_payload->>'plan_key', '');
  v_preparedness_key text := coalesce(p_payload->>'preparedness_key', '');
begin
  v_org_id := public._cmor567_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;
  perform public._bde_require_admin();

  if v_action = 'create_incident' then
    insert into public.organization_companion_resilience_incidents (
      organization_id, incident_key, incident_title, incident_type, severity,
      incident_status, owner_name, impact_summary, summary
    ) values (
      v_org_id, 'inc_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
      coalesce(p_payload->>'incident_title', 'New Incident'),
      coalesce(p_payload->>'incident_type', 'operational'),
      coalesce(p_payload->>'severity', 'moderate'), 'open',
      coalesce(p_payload->>'owner_name', 'Unassigned'),
      coalesce(p_payload->>'impact_summary', ''),
      coalesce(p_payload->>'summary', 'Incident created — Companion Crisis Advisor available.')
    );
    perform public._cmor567_log(v_org_id, 'incident_created', 'Incident created', p_payload, 'incident');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'update_recovery' and v_recovery_key <> '' then
    update public.organization_companion_resilience_recovery
    set recovery_status = 'in_progress',
        recovery_progress_pct = least(recovery_progress_pct + 10, 100)
    where organization_id = v_org_id and recovery_key = v_recovery_key;
    perform public._cmor567_log(v_org_id, 'recovery_updated', 'Recovery progress updated', p_payload, 'recovery');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'complete_recovery' and v_recovery_key <> '' then
    update public.organization_companion_resilience_recovery
    set recovery_status = 'completed', recovery_progress_pct = 100
    where organization_id = v_org_id and recovery_key = v_recovery_key;
    perform public._cmor567_log(v_org_id, 'recovery_completed', 'Recovery completed', p_payload, 'recovery');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'activate_continuity' and v_plan_key <> '' then
    update public.organization_companion_resilience_continuity_plans
    set plan_status = 'active' where organization_id = v_org_id and plan_key = v_plan_key;
    perform public._cmor567_log(v_org_id, 'continuity_plan_updated', 'Continuity plan activated', p_payload, 'continuity');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'run_preparedness_test' and v_preparedness_key <> '' then
    update public.organization_companion_resilience_preparedness
    set activity_status = 'completed', readiness_score = least(readiness_score + 5, 100)
    where organization_id = v_org_id and preparedness_key = v_preparedness_key;
    perform public._cmor567_log(v_org_id, 'preparedness_test_executed', 'Preparedness test executed', p_payload, 'preparedness');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'update_incident' and v_incident_key <> '' then
    update public.organization_companion_resilience_incidents
    set incident_status = coalesce(p_payload->>'incident_status', 'investigating')
    where organization_id = v_org_id and incident_key = v_incident_key;
    perform public._cmor567_log(v_org_id, 'incident_updated', 'Incident updated', p_payload, 'incident');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'refresh_resilience' then
    perform public._cmor567_log(v_org_id, 'resilience_refreshed', 'Resilience center refreshed', p_payload, 'resilience');
    return jsonb_build_object('ok', true, 'action', v_action);
  end if;
  raise exception 'Unknown action: %', v_action;
end; $$;

create or replace function public.get_organization_companion_resilience_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmor567_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return (public.get_organization_companion_resilience_center('overview')->'overview')
    || jsonb_build_object('found', true, 'route', '/app/resilience');
end; $$;

create or replace function public.get_assistant_companion_resilience_advisor_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_avg_score numeric;
begin
  v_org_id := public._cmor567_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  select round(avg(score_value)::numeric, 0) into v_avg_score
  from public.organization_companion_resilience_scores where organization_id = v_org_id;
  return jsonb_build_object(
    'found', true,
    'principle', 'Companion assists during incidents — what is affected, who to notify, continuity plans, recovery steps.',
    'advisor_prompts', jsonb_build_array(
      'What is affected?', 'Who should be notified?', 'What continuity plan exists?',
      'What recovery steps are recommended?', 'Generate crisis briefing.'
    ),
    'resilience_score', coalesce(v_avg_score, 75),
    'open_incidents', (select count(*) from public.organization_companion_resilience_incidents where organization_id = v_org_id and incident_status in ('open', 'investigating', 'recovering')),
    'critical_incidents', (select count(*) from public.organization_companion_resilience_incidents where organization_id = v_org_id and severity = 'critical'),
    'route', '/app/resilience'
  );
end; $$;

grant execute on function public.get_organization_companion_resilience_center(text) to authenticated;
grant execute on function public.perform_organization_companion_resilience_action(jsonb) to authenticated;
grant execute on function public.get_organization_companion_resilience_mobile_summary() to authenticated;
grant execute on function public.get_assistant_companion_resilience_advisor_context() to authenticated;
