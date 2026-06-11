-- Phase 92 — Enterprise Deployment Framework
-- Principle: Enterprise-grade AI without enterprise complexity.

alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community',
    'marketplace_governance', 'partner_certification', 'enterprise_deployment'
  )
);

-- ---------------------------------------------------------------------------
-- 1. enterprise_framework_settings
-- ---------------------------------------------------------------------------
create table if not exists public.enterprise_framework_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  framework_enabled boolean not null default true,
  pilot_recommended boolean not null default true,
  sso_enabled boolean not null default false,
  mfa_required boolean not null default false,
  support_tier text not null default 'standard' check (
    support_tier in ('standard', 'priority', 'dedicated_success', 'technical_account', 'strategic_advisory')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.enterprise_framework_settings enable row level security;
revoke all on public.enterprise_framework_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. enterprise_deployment_projects
-- ---------------------------------------------------------------------------
create table if not exists public.enterprise_deployment_projects (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  project_name text not null,
  deployment_model text not null default 'multi_tenant_saas' check (
    deployment_model in (
      'multi_tenant_saas', 'dedicated_tenant_cloud', 'enterprise_private_cloud',
      'hybrid_deployment', 'on_premise'
    )
  ),
  current_stage text not null default 'discovery_assessment' check (
    current_stage in (
      'discovery_assessment', 'solution_design', 'pilot_deployment',
      'enterprise_rollout', 'optimization'
    )
  ),
  status text not null default 'active' check (
    status in ('planning', 'active', 'pilot', 'rollout', 'optimization', 'completed', 'paused')
  ),
  readiness_score numeric(5, 2) not null default 0 check (readiness_score between 0 and 100),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, project_name)
);

alter table public.enterprise_deployment_projects enable row level security;
revoke all on public.enterprise_deployment_projects from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. enterprise_readiness_assessments
-- ---------------------------------------------------------------------------
create table if not exists public.enterprise_readiness_assessments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  project_id uuid references public.enterprise_deployment_projects (id) on delete cascade,
  assessment_area text not null check (
    assessment_area in (
      'infrastructure_maturity', 'security_requirements', 'governance_readiness',
      'change_management', 'data_classification', 'integration_complexity', 'stakeholder_alignment'
    )
  ),
  score numeric(5, 2) not null default 0 check (score between 0 and 100),
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed')),
  notes text,
  assessed_at timestamptz,
  unique (tenant_id, project_id, assessment_area)
);

alter table public.enterprise_readiness_assessments enable row level security;
revoke all on public.enterprise_readiness_assessments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. enterprise_deployment_stages
-- ---------------------------------------------------------------------------
create table if not exists public.enterprise_deployment_stages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  project_id uuid not null references public.enterprise_deployment_projects (id) on delete cascade,
  stage_key text not null check (
    stage_key in (
      'discovery_assessment', 'solution_design', 'pilot_deployment',
      'enterprise_rollout', 'optimization'
    )
  ),
  status text not null default 'pending' check (
    status in ('pending', 'in_progress', 'completed', 'skipped')
  ),
  progress_pct numeric(5, 2) not null default 0 check (progress_pct between 0 and 100),
  started_at timestamptz,
  completed_at timestamptz,
  unique (project_id, stage_key)
);

alter table public.enterprise_deployment_stages enable row level security;
revoke all on public.enterprise_deployment_stages from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. enterprise_framework_roles
-- ---------------------------------------------------------------------------
create table if not exists public.enterprise_framework_roles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  role_key text not null,
  title text not null,
  description text not null,
  permissions jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (status in ('active', 'disabled')),
  unique (tenant_id, role_key)
);

alter table public.enterprise_framework_roles enable row level security;
revoke all on public.enterprise_framework_roles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. enterprise_framework_security_policies
-- ---------------------------------------------------------------------------
create table if not exists public.enterprise_framework_security_policies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  policy_key text not null,
  title text not null,
  description text not null,
  control_type text not null check (
    control_type in (
      'encryption_at_rest', 'encryption_in_transit', 'ip_allowlisting',
      'network_segmentation', 'session_controls', 'threat_monitoring', 'backup_management'
    )
  ),
  enabled boolean not null default false,
  status text not null default 'active' check (status in ('active', 'disabled')),
  unique (tenant_id, policy_key)
);

alter table public.enterprise_framework_security_policies enable row level security;
revoke all on public.enterprise_framework_security_policies from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. enterprise_framework_governance_policies
-- ---------------------------------------------------------------------------
create table if not exists public.enterprise_framework_governance_policies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  policy_key text not null,
  title text not null,
  description text not null,
  policy_type text not null check (
    policy_type in (
      'approval_workflow', 'escalation', 'usage_policy', 'risk_tolerance',
      'data_retention', 'incident_response'
    )
  ),
  status text not null default 'draft' check (status in ('draft', 'active', 'disabled')),
  accepted_at timestamptz,
  unique (tenant_id, policy_key)
);

alter table public.enterprise_framework_governance_policies enable row level security;
revoke all on public.enterprise_framework_governance_policies from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. enterprise_framework_integrations
-- ---------------------------------------------------------------------------
create table if not exists public.enterprise_framework_integrations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  integration_key text not null,
  display_name text not null,
  category text not null check (
    category in ('crm', 'erp', 'hr', 'ticketing', 'collaboration', 'knowledge', 'identity', 'other')
  ),
  status text not null default 'available' check (
    status in ('available', 'configured', 'active', 'disabled')
  ),
  requires_agent boolean not null default false,
  unique (tenant_id, integration_key)
);

alter table public.enterprise_framework_integrations enable row level security;
revoke all on public.enterprise_framework_integrations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. enterprise_framework_change_initiatives
-- ---------------------------------------------------------------------------
create table if not exists public.enterprise_framework_change_initiatives (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  project_id uuid references public.enterprise_deployment_projects (id) on delete set null,
  title text not null,
  description text not null,
  initiative_type text not null check (
    initiative_type in (
      'communication', 'stakeholder_engagement', 'training', 'feedback', 'resistance_management'
    )
  ),
  status text not null default 'planned' check (
    status in ('planned', 'in_progress', 'completed', 'deferred')
  ),
  created_at timestamptz not null default now()
);

alter table public.enterprise_framework_change_initiatives enable row level security;
revoke all on public.enterprise_framework_change_initiatives from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 10. enterprise_framework_continuity_plans
-- ---------------------------------------------------------------------------
create table if not exists public.enterprise_framework_continuity_plans (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  plan_key text not null,
  title text not null,
  description text not null,
  rto_hours int,
  rpo_hours int,
  last_tested_at timestamptz,
  status text not null default 'draft' check (status in ('draft', 'active', 'tested')),
  unique (tenant_id, plan_key)
);

alter table public.enterprise_framework_continuity_plans enable row level security;
revoke all on public.enterprise_framework_continuity_plans from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 11. enterprise_framework_success_metrics
-- ---------------------------------------------------------------------------
create table if not exists public.enterprise_framework_success_metrics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  metric_key text not null,
  title text not null,
  current_value numeric(10, 2) not null default 0,
  target_value numeric(10, 2),
  unit text not null default 'percent',
  calculated_at timestamptz not null default now(),
  unique (tenant_id, metric_key)
);

alter table public.enterprise_framework_success_metrics enable row level security;
revoke all on public.enterprise_framework_success_metrics from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 12. enterprise_framework_compliance_reports + briefings + audit
-- ---------------------------------------------------------------------------
create table if not exists public.enterprise_framework_compliance_reports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  report_type text not null,
  title text not null,
  summary text,
  status text not null default 'draft' check (status in ('draft', 'generated', 'archived')),
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.enterprise_framework_compliance_reports enable row level security;
revoke all on public.enterprise_framework_compliance_reports from authenticated, anon;

create table if not exists public.enterprise_framework_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.enterprise_framework_briefings enable row level security;
revoke all on public.enterprise_framework_briefings from authenticated, anon;

create table if not exists public.enterprise_framework_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  trigger_source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.enterprise_framework_audit_log enable row level security;
revoke all on public.enterprise_framework_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 13. Helpers (_edf_)
-- ---------------------------------------------------------------------------
create or replace function public._edf_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._edf_log_audit(
  p_tenant_id uuid, p_event_type text, p_summary text default null,
  p_trigger_source text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.enterprise_framework_audit_log (tenant_id, event_type, summary, trigger_source, metadata)
  values (p_tenant_id, p_event_type, p_summary, p_trigger_source, p_metadata)
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'enterprise_deployment_' || p_event_type, 'enterprise_deployment', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._edf_ensure_settings(p_tenant_id uuid)
returns public.enterprise_framework_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.enterprise_framework_settings;
begin
  insert into public.enterprise_framework_settings (tenant_id) values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_settings from public.enterprise_framework_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._edf_stage_label(p_stage text)
returns text language sql immutable as $$
  select case p_stage
    when 'discovery_assessment' then 'Phase 1: Discovery & Assessment'
    when 'solution_design' then 'Phase 2: Solution Design'
    when 'pilot_deployment' then 'Phase 3: Pilot Deployment'
    when 'enterprise_rollout' then 'Phase 4: Enterprise Rollout'
    when 'optimization' then 'Phase 5: Optimization'
    else initcap(replace(p_stage, '_', ' '))
  end;
$$;

create or replace function public._edf_model_label(p_model text)
returns text language sql immutable as $$
  select case p_model
    when 'multi_tenant_saas' then 'Multi-Tenant SaaS'
    when 'dedicated_tenant_cloud' then 'Dedicated Tenant Cloud'
    when 'enterprise_private_cloud' then 'Enterprise Private Cloud'
    when 'hybrid_deployment' then 'Hybrid Deployment'
    when 'on_premise' then 'On-Premise Deployment'
    else initcap(replace(p_model, '_', ' '))
  end;
$$;

create or replace function public._edf_seed_roles(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.enterprise_framework_roles (tenant_id, role_key, title, description)
  select p_tenant_id, v.key, v.title, v.desc
  from (values
    ('executive_sponsor', 'Executive Sponsor', 'Executive accountability and strategic alignment.'),
    ('platform_administrator', 'Platform Administrator', 'Platform configuration and user management.'),
    ('governance_officer', 'Governance Officer', 'Policy enforcement and compliance oversight.'),
    ('department_administrator', 'Department Administrator', 'Department-level rollout and adoption.'),
    ('support_lead', 'Support Lead', 'Support operations and escalation management.'),
    ('analyst', 'Analyst', 'Reporting, insights, and operational analysis.'),
    ('standard_user', 'Standard User', 'Day-to-day Aipify usage.'),
    ('auditor', 'Auditor', 'Read-only access for audit and compliance review.')
  ) as v(key, title, desc)
  where not exists (select 1 from public.enterprise_framework_roles r where r.tenant_id = p_tenant_id and r.role_key = v.key);
end; $$;

create or replace function public._edf_seed_security_policies(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.enterprise_framework_security_policies (tenant_id, policy_key, title, description, control_type, enabled)
  select p_tenant_id, v.key, v.title, v.desc, v.type, v.enabled
  from (values
    ('encryption_rest', 'Encryption at Rest', 'Data encrypted at rest per organizational standards.', 'encryption_at_rest', true),
    ('encryption_transit', 'Encryption in Transit', 'TLS for all data in transit.', 'encryption_in_transit', true),
    ('ip_allowlist', 'IP Allowlisting', 'Restrict access to approved IP ranges.', 'ip_allowlisting', false),
    ('network_segmentation', 'Network Segmentation', 'Isolate Aipify components within network zones.', 'network_segmentation', false),
    ('session_controls', 'Session Controls', 'Session timeout and concurrent session limits.', 'session_controls', true),
    ('threat_monitoring', 'Threat Monitoring', 'Continuous security monitoring and alerting.', 'threat_monitoring', false),
    ('backup_management', 'Backup Management', 'Automated backups and recovery procedures.', 'backup_management', true)
  ) as v(key, title, desc, type, enabled)
  where not exists (select 1 from public.enterprise_framework_security_policies p where p.tenant_id = p_tenant_id and p.policy_key = v.key);
end; $$;

create or replace function public._edf_seed_governance_policies(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.enterprise_framework_governance_policies (tenant_id, policy_key, title, description, policy_type, status)
  select p_tenant_id, v.key, v.title, v.desc, v.type, 'active'
  from (values
    ('approval_workflows', 'Approval Workflows', 'Define approval requirements for AI actions.', 'approval_workflow'),
    ('escalation_procedures', 'Escalation Procedures', 'Escalation paths for incidents and exceptions.', 'escalation'),
    ('usage_policies', 'Usage Policies', 'Acceptable use and operational boundaries.', 'usage_policy'),
    ('risk_tolerance', 'Risk Tolerance Thresholds', 'Organization risk appetite for automated actions.', 'risk_tolerance'),
    ('data_retention', 'Data Retention Standards', 'Retention and deletion requirements.', 'data_retention'),
    ('incident_response', 'Incident Response Procedures', 'Security and operational incident response.', 'incident_response')
  ) as v(key, title, desc, type)
  where not exists (select 1 from public.enterprise_framework_governance_policies p where p.tenant_id = p_tenant_id and p.policy_key = v.key);
end; $$;

create or replace function public._edf_seed_integrations(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.enterprise_framework_integrations (tenant_id, integration_key, display_name, category, requires_agent, status)
  select p_tenant_id, c.connector_key, c.display_name,
    case c.connector_key
      when 'salesforce' then 'crm' when 'servicenow' then 'ticketing'
      when 'jira' then 'ticketing' when 'azure_ad' then 'identity'
      when 'active_directory' then 'identity' when 'microsoft_365' then 'collaboration'
      else 'other'
    end,
    c.requires_agent,
    case c.status when 'connected' then 'active' when 'configured' then 'configured' else 'available' end
  from public.enterprise_connectors c
  where c.tenant_id = p_tenant_id
  on conflict (tenant_id, integration_key) do nothing;

  insert into public.enterprise_framework_integrations (tenant_id, integration_key, display_name, category, status)
  select p_tenant_id, v.key, v.name, v.cat, 'available'
  from (values
    ('okta', 'Okta', 'identity'), ('google_workspace', 'Google Workspace', 'collaboration'),
    ('sap', 'SAP', 'erp'), ('workday', 'Workday', 'hr'), ('confluence', 'Confluence', 'knowledge')
  ) as v(key, name, cat)
  where not exists (select 1 from public.enterprise_framework_integrations i where i.tenant_id = p_tenant_id and i.integration_key = v.key);
end; $$;

create or replace function public._edf_seed_project(p_tenant_id uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_project_id uuid;
  v_mode text;
  v_model text;
begin
  select deployment_mode into v_mode from public.tenant_deployment_settings where tenant_id = p_tenant_id;
  v_model := case coalesce(v_mode, 'cloud_saas')
    when 'cloud_saas' then 'multi_tenant_saas'
    when 'hybrid' then 'hybrid_deployment'
    when 'on_premise' then 'on_premise'
    else 'multi_tenant_saas'
  end;

  insert into public.enterprise_deployment_projects (tenant_id, project_name, deployment_model, current_stage, status)
  values (p_tenant_id, 'Primary Enterprise Deployment', v_model, 'discovery_assessment', 'active')
  on conflict (tenant_id, project_name) do update set deployment_model = excluded.deployment_model
  returning id into v_project_id;

  if v_project_id is null then
    select id into v_project_id from public.enterprise_deployment_projects
    where tenant_id = p_tenant_id and project_name = 'Primary Enterprise Deployment';
  end if;

  insert into public.enterprise_deployment_stages (tenant_id, project_id, stage_key, status, progress_pct, started_at)
  select p_tenant_id, v_project_id, s.key,
    case s.key when 'discovery_assessment' then 'in_progress' else 'pending' end,
    case s.key when 'discovery_assessment' then 35 else 0 end,
    case s.key when 'discovery_assessment' then now() else null end
  from (values
    ('discovery_assessment'), ('solution_design'), ('pilot_deployment'),
    ('enterprise_rollout'), ('optimization')
  ) as s(key)
  on conflict (project_id, stage_key) do nothing;

  return v_project_id;
end; $$;

create or replace function public._edf_seed_assessments(p_tenant_id uuid, p_project_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.enterprise_readiness_assessments (tenant_id, project_id, assessment_area, score, status, assessed_at)
  select p_tenant_id, p_project_id, v.area, v.score,
    case when v.score >= 70 then 'completed' when v.score >= 40 then 'in_progress' else 'pending' end,
    case when v.score >= 70 then now() else null end
  from (values
    ('infrastructure_maturity', 72.0), ('security_requirements', 68.0),
    ('governance_readiness', 55.0), ('change_management', 48.0),
    ('data_classification', 62.0), ('integration_complexity', 58.0),
    ('stakeholder_alignment', 70.0)
  ) as v(area, score)
  on conflict (tenant_id, project_id, assessment_area) do nothing;
end; $$;

create or replace function public._edf_seed_change_initiatives(p_tenant_id uuid, p_project_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.enterprise_framework_change_initiatives (tenant_id, project_id, title, description, initiative_type, status)
  select p_tenant_id, p_project_id, v.title, v.desc, v.type, 'planned'
  from (values
    ('Executive communication plan', 'Stakeholder briefing and rollout messaging.', 'communication'),
    ('Champion network engagement', 'Identify and enable department champions.', 'stakeholder_engagement'),
    ('Administrator training program', 'Platform admin and governance officer training.', 'training'),
    ('Pilot feedback collection', 'Structured feedback from pilot users.', 'feedback'),
    ('Adoption resistance playbook', 'Address common adoption barriers.', 'resistance_management')
  ) as v(title, desc, type)
  where not exists (
    select 1 from public.enterprise_framework_change_initiatives c
    where c.tenant_id = p_tenant_id and c.title = v.title
  );
end; $$;

create or replace function public._edf_seed_continuity(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.enterprise_framework_continuity_plans (tenant_id, plan_key, title, description, rto_hours, rpo_hours, status)
  select p_tenant_id, v.key, v.title, v.desc, v.rto, v.rpo, 'active'
  from (values
    ('disaster_recovery', 'Disaster Recovery Plan', 'Failover and recovery for critical Aipify services.', 4, 1),
    ('backup_strategy', 'Backup Strategy', 'Regular backups and restoration testing.', 24, 4),
    ('continuity_testing', 'Continuity Testing', 'Scheduled DR and failover validation.', 8, 2)
  ) as v(key, title, desc, rto, rpo)
  where not exists (select 1 from public.enterprise_framework_continuity_plans p where p.tenant_id = p_tenant_id and p.plan_key = v.key);
end; $$;

create or replace function public._edf_seed_metrics(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  delete from public.enterprise_framework_success_metrics where tenant_id = p_tenant_id;
  insert into public.enterprise_framework_success_metrics (tenant_id, metric_key, title, current_value, target_value, unit)
  values
    (p_tenant_id, 'user_adoption', 'User Adoption Rate', 62, 85, 'percent'),
    (p_tenant_id, 'support_reduction', 'Support Volume Reduction', 18, 30, 'percent'),
    (p_tenant_id, 'productivity', 'Productivity Improvement', 24, 40, 'percent'),
    (p_tenant_id, 'response_time', 'Response Time Improvement', 35, 50, 'percent'),
    (p_tenant_id, 'satisfaction', 'Customer Satisfaction Impact', 78, 90, 'score'),
    (p_tenant_id, 'workflow_completion', 'Workflow Completion Rate', 71, 90, 'percent');
end; $$;

create or replace function public._edf_calculate_readiness(p_tenant_id uuid, p_project_id uuid)
returns numeric language plpgsql security definer set search_path = public as $$
declare v_score numeric;
begin
  select coalesce(avg(score), 0) into v_score
  from public.enterprise_readiness_assessments
  where tenant_id = p_tenant_id and project_id = p_project_id;

  update public.enterprise_deployment_projects set readiness_score = round(v_score, 1), updated_at = now()
  where id = p_project_id;

  return round(v_score, 1);
end; $$;

create or replace function public._edf_executive_health(p_tenant_id uuid, p_project_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_readiness numeric;
  v_stage text;
  v_governance int;
  v_security int;
  v_adoption numeric;
begin
  select readiness_score, current_stage into v_readiness, v_stage
  from public.enterprise_deployment_projects where id = p_project_id;

  select count(*) into v_governance from public.enterprise_framework_governance_policies
  where tenant_id = p_tenant_id and status = 'active';

  select count(*) into v_security from public.enterprise_framework_security_policies
  where tenant_id = p_tenant_id and enabled = true;

  select current_value into v_adoption from public.enterprise_framework_success_metrics
  where tenant_id = p_tenant_id and metric_key = 'user_adoption';

  return jsonb_build_object(
    'deployment_readiness', coalesce(v_readiness, 0),
    'current_stage', v_stage,
    'current_stage_label', public._edf_stage_label(v_stage),
    'governance_policies_active', v_governance,
    'security_controls_enabled', v_security,
    'user_adoption_pct', coalesce(v_adoption, 0),
    'framework_score', least(100, round(
      coalesce(v_readiness, 0) * 0.4 + coalesce(v_adoption, 0) * 0.3 +
      least(v_governance * 10, 20) + least(v_security * 5, 10)
    ))
  );
end; $$;

create or replace function public._edf_trust_explanation(p_tenant_id uuid, p_score numeric, p_label text)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public.generate_decision_explanation(
    'edf-score-' || p_tenant_id::text,
    'enterprise_deployment',
    'enterprise_deployment',
    'Enterprise deployment readiness: ' || p_score || '/100',
    p_label || '. Enterprise success requires trust, governance, and thoughtful implementation.',
    jsonb_build_array(
      jsonb_build_object('source', 'readiness_assessment'),
      jsonb_build_object('source', 'governance_policies'),
      jsonb_build_object('source', 'deployment_stage')
    ),
    jsonb_build_array('human_oversight_required', 'pilot_recommended', 'audit_logged'),
    'medium', '[]'::jsonb, '[]'::jsonb
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 14. Action RPCs
-- ---------------------------------------------------------------------------
create or replace function public.advance_enterprise_deployment_stage(p_project_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_current text;
  v_next text;
begin
  v_tenant_id := public._edf_require_tenant();

  select current_stage into v_current from public.enterprise_deployment_projects
  where id = p_project_id and tenant_id = v_tenant_id;

  if v_current is null then raise exception 'Project not found'; end if;

  v_next := case v_current
    when 'discovery_assessment' then 'solution_design'
    when 'solution_design' then 'pilot_deployment'
    when 'pilot_deployment' then 'enterprise_rollout'
    when 'enterprise_rollout' then 'optimization'
    else 'optimization'
  end;

  update public.enterprise_deployment_stages set status = 'completed', progress_pct = 100, completed_at = now()
  where project_id = p_project_id and stage_key = v_current;

  update public.enterprise_deployment_stages set status = 'in_progress', progress_pct = 10, started_at = now()
  where project_id = p_project_id and stage_key = v_next;

  update public.enterprise_deployment_projects set current_stage = v_next, updated_at = now()
  where id = p_project_id;

  perform public._edf_log_audit(v_tenant_id, 'stage_advanced', 'Advanced to ' || public._edf_stage_label(v_next),
    'deployment_stages', jsonb_build_object('project_id', p_project_id, 'stage', v_next));

  return jsonb_build_object('status', 'advanced', 'current_stage', v_next, 'current_stage_label', public._edf_stage_label(v_next));
end; $$;

create or replace function public.activate_enterprise_governance_policy(p_policy_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._edf_require_tenant();
  update public.enterprise_framework_governance_policies
  set status = 'active', accepted_at = now()
  where id = p_policy_id and tenant_id = v_tenant_id;
  perform public._edf_log_audit(v_tenant_id, 'governance_policy_activated', 'Governance policy activated',
    'governance', jsonb_build_object('policy_id', p_policy_id));
  return jsonb_build_object('status', 'active');
end; $$;

-- ---------------------------------------------------------------------------
-- 15. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.generate_enterprise_deployment_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_project_id uuid;
  v_health jsonb;
  v_id uuid;
  v_summary text;
begin
  v_tenant_id := public._edf_require_tenant();
  perform public._edf_ensure_settings(v_tenant_id);
  perform public._ent_seed_connectors(v_tenant_id);
  perform public._edf_seed_roles(v_tenant_id);
  perform public._edf_seed_security_policies(v_tenant_id);
  perform public._edf_seed_governance_policies(v_tenant_id);
  perform public._edf_seed_integrations(v_tenant_id);
  v_project_id := public._edf_seed_project(v_tenant_id);
  perform public._edf_seed_assessments(v_tenant_id, v_project_id);
  perform public._edf_seed_change_initiatives(v_tenant_id, v_project_id);
  perform public._edf_seed_continuity(v_tenant_id);
  perform public._edf_seed_metrics(v_tenant_id);
  perform public._edf_calculate_readiness(v_tenant_id, v_project_id);
  v_health := public._edf_executive_health(v_tenant_id, v_project_id);
  perform public._edf_trust_explanation(v_tenant_id,
    (v_health->>'framework_score')::numeric, v_health->>'current_stage_label');

  v_summary := 'Enterprise Framework Score ' || (v_health->>'framework_score') || '/100 — ' ||
    (v_health->>'current_stage_label');

  insert into public.enterprise_framework_briefings (tenant_id, summary, content)
  values (v_tenant_id, v_summary, v_health || jsonb_build_object('human_oversight_required', true))
  returning id into v_id;

  perform public._edf_log_audit(v_tenant_id, 'briefing_generated', v_summary, 'executive_briefing',
    jsonb_build_object('briefing_id', v_id));

  return jsonb_build_object('briefing_id', v_id, 'summary', v_summary);
end; $$;

create or replace function public.get_enterprise_deployment_framework_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_health jsonb; v_project_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select id into v_project_id from public.enterprise_deployment_projects
  where tenant_id = v_tenant_id order by created_at desc limit 1;

  if v_project_id is null then
    return jsonb_build_object(
      'has_customer', true, 'framework_score', 0, 'readiness_score', 0,
      'philosophy', 'Enterprise-grade AI without enterprise complexity.',
      'human_oversight_required', true
    );
  end if;

  v_health := public._edf_executive_health(v_tenant_id, v_project_id);

  return jsonb_build_object(
    'has_customer', true,
    'framework_score', v_health->'framework_score',
    'readiness_score', v_health->'deployment_readiness',
    'current_stage', v_health->'current_stage',
    'philosophy', 'Enterprise-grade AI without enterprise complexity.',
    'human_oversight_required', true
  );
end; $$;

create or replace function public.get_enterprise_deployment_framework_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.enterprise_framework_settings;
  v_project_id uuid;
  v_health jsonb;
  v_deploy_settings record;
begin
  v_tenant_id := public._edf_require_tenant();
  v_settings := public._edf_ensure_settings(v_tenant_id);
  perform public._ent_ensure_deployment_settings(v_tenant_id);
  perform public._ent_seed_connectors(v_tenant_id);
  perform public._edf_seed_roles(v_tenant_id);
  perform public._edf_seed_security_policies(v_tenant_id);
  perform public._edf_seed_governance_policies(v_tenant_id);
  perform public._edf_seed_integrations(v_tenant_id);
  v_project_id := public._edf_seed_project(v_tenant_id);
  perform public._edf_seed_assessments(v_tenant_id, v_project_id);
  perform public._edf_seed_change_initiatives(v_tenant_id, v_project_id);
  perform public._edf_seed_continuity(v_tenant_id);
  perform public._edf_seed_metrics(v_tenant_id);
  perform public._edf_calculate_readiness(v_tenant_id, v_project_id);
  v_health := public._edf_executive_health(v_tenant_id, v_project_id);
  perform public._edf_trust_explanation(v_tenant_id,
    (v_health->>'framework_score')::numeric, v_health->>'current_stage_label');

  select deployment_mode, data_residency_mode, enterprise_governance_enabled
  into v_deploy_settings from public.tenant_deployment_settings where tenant_id = v_tenant_id;

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'framework_enabled', v_settings.framework_enabled,
    'pilot_recommended', v_settings.pilot_recommended,
    'sso_enabled', v_settings.sso_enabled,
    'mfa_required', v_settings.mfa_required,
    'support_tier', v_settings.support_tier,
    'philosophy', 'Enterprise-grade AI without enterprise complexity.',
    'safety_note', 'Enterprise success requires trust, governance, and thoughtful implementation.',
    'framework_score', v_health->'framework_score',
    'deployment_readiness', v_health->'deployment_readiness',
    'current_stage', v_health->'current_stage',
    'current_stage_label', v_health->'current_stage_label',
    'governance_policies_active', v_health->'governance_policies_active',
    'security_controls_enabled', v_health->'security_controls_enabled',
    'user_adoption_pct', v_health->'user_adoption_pct',
    'deployment_mode', coalesce(v_deploy_settings.deployment_mode, 'cloud_saas'),
    'data_residency_mode', coalesce(v_deploy_settings.data_residency_mode, 'cloud'),
    'enterprise_governance_enabled', coalesce(v_deploy_settings.enterprise_governance_enabled, false),
    'deployment_models', jsonb_build_array(
      jsonb_build_object('key', 'multi_tenant_saas', 'label', public._edf_model_label('multi_tenant_saas'), 'description', 'Shared infrastructure with logical isolation.'),
      jsonb_build_object('key', 'dedicated_tenant_cloud', 'label', public._edf_model_label('dedicated_tenant_cloud'), 'description', 'Dedicated cloud resources for a single customer.'),
      jsonb_build_object('key', 'enterprise_private_cloud', 'label', public._edf_model_label('enterprise_private_cloud'), 'description', 'Customer-managed cloud infrastructure.'),
      jsonb_build_object('key', 'hybrid_deployment', 'label', public._edf_model_label('hybrid_deployment'), 'description', 'Combination of Aipify cloud and customer systems.'),
      jsonb_build_object('key', 'on_premise', 'label', public._edf_model_label('on_premise'), 'description', 'Deployment within customer-controlled environments.')
    ),
    'iam_capabilities', jsonb_build_array('Single Sign-On (SSO)', 'SAML', 'OpenID Connect', 'Multi-Factor Authentication', 'Role-Based Access Control', 'Attribute-Based Access Control'),
    'project', coalesce((
      select jsonb_build_object(
        'id', p.id, 'project_name', p.project_name, 'deployment_model', p.deployment_model,
        'deployment_model_label', public._edf_model_label(p.deployment_model),
        'current_stage', p.current_stage, 'current_stage_label', public._edf_stage_label(p.current_stage),
        'readiness_score', p.readiness_score, 'status', p.status
      ) from public.enterprise_deployment_projects p where p.id = v_project_id
    ), '{}'::jsonb),
    'deployment_stages', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'stage_key', s.stage_key, 'stage_label', public._edf_stage_label(s.stage_key),
        'status', s.status, 'progress_pct', s.progress_pct, 'started_at', s.started_at, 'completed_at', s.completed_at
      ) order by case s.stage_key
        when 'discovery_assessment' then 1 when 'solution_design' then 2 when 'pilot_deployment' then 3
        when 'enterprise_rollout' then 4 else 5 end)
      from public.enterprise_deployment_stages s where s.project_id = v_project_id
    ), '[]'::jsonb),
    'readiness_assessments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'assessment_area', a.assessment_area, 'score', a.score, 'status', a.status, 'notes', a.notes
      ) order by a.score desc)
      from public.enterprise_readiness_assessments a where a.project_id = v_project_id
    ), '[]'::jsonb),
    'enterprise_roles', coalesce((
      select jsonb_agg(jsonb_build_object('id', r.id, 'role_key', r.role_key, 'title', r.title, 'description', r.description))
      from public.enterprise_framework_roles r where r.tenant_id = v_tenant_id and r.status = 'active'
    ), '[]'::jsonb),
    'security_policies', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'policy_key', p.policy_key, 'title', p.title, 'description', p.description,
        'control_type', p.control_type, 'enabled', p.enabled
      ))
      from public.enterprise_framework_security_policies p where p.tenant_id = v_tenant_id and p.status = 'active'
    ), '[]'::jsonb),
    'governance_policies', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'policy_key', p.policy_key, 'title', p.title, 'description', p.description,
        'policy_type', p.policy_type, 'status', p.status
      ))
      from public.enterprise_framework_governance_policies p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'integrations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'integration_key', i.integration_key, 'display_name', i.display_name,
        'category', i.category, 'status', i.status, 'requires_agent', i.requires_agent
      ) order by i.display_name)
      from public.enterprise_framework_integrations i where i.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'change_initiatives', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.title, 'description', c.description,
        'initiative_type', c.initiative_type, 'status', c.status
      ))
      from public.enterprise_framework_change_initiatives c where c.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'continuity_plans', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'plan_key', p.plan_key, 'title', p.title, 'description', p.description,
        'rto_hours', p.rto_hours, 'rpo_hours', p.rpo_hours, 'status', p.status
      ))
      from public.enterprise_framework_continuity_plans p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'success_metrics', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'metric_key', m.metric_key, 'title', m.title,
        'current_value', m.current_value, 'target_value', m.target_value, 'unit', m.unit
      ))
      from public.enterprise_framework_success_metrics m where m.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'support_tiers', jsonb_build_array(
      jsonb_build_object('tier', 'standard', 'label', 'Standard Support'),
      jsonb_build_object('tier', 'priority', 'label', 'Priority Support'),
      jsonb_build_object('tier', 'dedicated_success', 'label', 'Dedicated Success Manager'),
      jsonb_build_object('tier', 'technical_account', 'label', 'Technical Account Manager'),
      jsonb_build_object('tier', 'strategic_advisory', 'label', 'Strategic Advisory Services')
    ),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'summary', b.summary, 'created_at', b.created_at)
        order by b.created_at desc)
      from public.enterprise_framework_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations_map', jsonb_build_object(
      'knowledge_center', 'Enterprise Deployment education',
      'partner_certification', 'Certified implementation partners',
      'governance_audit', 'Comprehensive audit and compliance',
      'identity_access', 'SSO, SAML, OIDC, RBAC',
      'marketplace_governance', 'Enterprise commerce governance',
      'phase66_deployment', 'Hybrid and on-premise agent architecture'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 16. Knowledge Center — ensure category exists (Phase 66 may have created it)
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'enterprise-deployment', 'Enterprise Deployment', 'Guides for implementing Aipify successfully at enterprise scale.', 'authenticated', 11
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'enterprise-deployment' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 17. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_enterprise_deployment_framework_card() to authenticated;
grant execute on function public.get_enterprise_deployment_framework_dashboard() to authenticated;
grant execute on function public.generate_enterprise_deployment_briefing() to authenticated;
grant execute on function public.advance_enterprise_deployment_stage(uuid) to authenticated;
grant execute on function public.activate_enterprise_governance_policy(uuid) to authenticated;
