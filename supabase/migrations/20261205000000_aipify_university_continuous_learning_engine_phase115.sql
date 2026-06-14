-- Phase 115 — Aipify University & Continuous Learning Engine
-- Centralized user education — distinct from Learning Engine Phase 29 (/app/learning) and A.36 (/app/learning-training-engine).
-- Helpers: _auni_* (engine), _aubp115_* (blueprint — never collide with _lte_*, _le_*, _hptdbp92_*).

alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community',
    'marketplace_governance', 'partner_certification', 'enterprise_deployment',
    'billing_commercial', 'academy_learning', 'global_localization',
    'innovation_experimentation', 'future_technologies', 'aipify_constitution',
    'aipify_manifesto', 'platform_install', 'commerce_intelligence',
    'product_automation', 'dropshipping_operations', 'commerce_performance',
    'multi_store_orchestration', 'supplier_intelligence', 'global_commerce_expansion',
    'commerce_companion', 'aipify_core_platform', 'multi_tenant_architecture',
    'identity_permissions', 'secure_ai_action', 'audit_accountability',
    'knowledge_center_engine', 'admin_assistant_engine', 'support_ai_engine',
    'integration_engine', 'operations_dashboard_engine', 'customer_onboarding_engine',
    'subscription_plan_management_engine', 'aipify_self_support_engine',
    'quality_guardian_engine', 'notification_communication_engine',
    'governance_policy_engine', 'unonight_pilot_operations_engine',
    'analytics_insights_engine', 'deployment_environment_management_engine',
    'observability_platform_health_engine', 'aipify_install_engine',
    'module_marketplace_foundation_engine', 'aipify_internal_operations_engine',
    'launch_readiness_engine', 'customer_success_engine',
    'aipify_status_transparency_engine', 'enterprise_readiness_engine',
    'learning_training_engine', 'organizational_memory_engine',
    'enterprise_deployment_device_rollout_engine',
    'innovation_impact_engine', 'compliance_regulatory_readiness_engine',
    'strategic_intelligence_foundation_engine', 'operations_center_foundation_engine',
    'continuous_improvement_engine', 'human_oversight_engine',
    'workflow_orchestration_engine', 'business_packs_foundation_engine',
    'industry_intelligence_foundation_engine',
    'marketplace_partner_ecosystem_foundation_engine',
    'ai_ethics_responsible_use_engine',
    'change_management_engine',
    'value_realization_engine',
    'organizational_resilience_engine',
    'incident_response_coordination_engine',
    'service_level_commitment_engine',
    'stakeholder_communication_engine',
    'organizational_decision_support_engine',
    'strategic_alignment_engine',
    'organizational_health_engine',
    'capability_maturity_engine',
    'organizational_benchmarking_engine',
    'document_output_engine',
    'records_retention_management_engine',
    'meeting_collaboration_intelligence_engine',
    'unified_task_follow_up_engine',
    'resource_planning_engine',
    'capacity_workload_management_engine',
    'goals_okr_engine',
    'predictive_insights_engine',
    'personal_productivity_engine',
    'companion_presence_indicator_engine',
    'cross_tenant_intelligence_engine',
    'partner_success_engine',
    'relationship_intelligence_engine',
    'trust_reputation_engine',
    'ai_cost_governance_engine',
    'organization_workspace_engine',
    'proactive_companion_engine',
    'priority_focus_engine',
    'growth_evolution_engine',
    'purpose_values_engine',
    'inclusion_humanity_engine',
    'companion_identity_engine',
    'impact_engine',
    'legacy_engine',
    'curiosity_discovery_engine',
    'wonder_engine',
    'gratitude_recognition_engine',
    'presence_comfort_protocol',
    'dedication_engine',
    'hope_engine',
    'wisdom_engine',
    'wisdom_intervention_protocol',
    'sales_expert_engine',
    'security_trust_engine',
    'api_platform_engine',
    'companion_device_ecosystem_engine',
    'companion_marketplace',
    'growth_partner_operations',
    'aipify_university'
  )
);

-- ---------------------------------------------------------------------------
-- 1. aipify_university_settings
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_university_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  continuous_learning_enabled boolean not null default true,
  wellbeing_aware_enabled boolean not null default true,
  healthy_pacing_default boolean not null default true,
  micro_learning_enabled boolean not null default true,
  companion_coaching_enabled boolean not null default true,
  default_pacing text not null default 'balanced' check (
    default_pacing in ('gentle', 'balanced', 'accelerated')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.aipify_university_settings enable row level security;
revoke all on public.aipify_university_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. aipify_university_pathways
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_university_pathways (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  pathway_key text not null,
  title text not null,
  description text,
  pathway_type text not null check (
    pathway_type in (
      'executive_leadership', 'support_excellence', 'companion_adoption',
      'security_awareness', 'governance_excellence', 'commerce_excellence',
      'growth_partner', 'department_specific', 'new_employee_onboarding',
      'course', 'micro_learning', 'simulation', 'certification_track',
      'executive_program', 'security_training'
    )
  ),
  experience_type text check (
    experience_type in (
      'courses', 'micro_learning_sessions', 'interactive_simulations',
      'role_specific_pathways', 'knowledge_refreshers', 'executive_programs',
      'certification_tracks', 'companion_assisted_coaching'
    )
  ),
  target_role text,
  estimated_minutes int not null default 30 check (estimated_minutes > 0),
  content_ref text,
  cross_link_route text,
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, pathway_key)
);

create index if not exists aipify_university_pathways_tenant_type_idx
  on public.aipify_university_pathways (tenant_id, pathway_type, status);

alter table public.aipify_university_pathways enable row level security;
revoke all on public.aipify_university_pathways from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. aipify_university_enrollments
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_university_enrollments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  pathway_id uuid not null references public.aipify_university_pathways (id) on delete cascade,
  completion_percentage int not null default 0 check (completion_percentage between 0 and 100),
  status text not null default 'not_started' check (
    status in ('not_started', 'in_progress', 'completed', 'paused')
  ),
  knowledge_confidence text check (knowledge_confidence in ('low', 'moderate', 'high')),
  started_at timestamptz,
  completed_at timestamptz,
  last_activity_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id, pathway_id)
);

create index if not exists aipify_university_enrollments_tenant_user_idx
  on public.aipify_university_enrollments (tenant_id, user_id, status);

alter table public.aipify_university_enrollments enable row level security;
revoke all on public.aipify_university_enrollments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. aipify_university_micro_learning_events
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_university_micro_learning_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  event_type text not null check (
    event_type in (
      'three_minute_refresher', 'weekly_insight', 'scenario_exercise',
      'policy_reminder', 'companion_guidance_moment', 'knowledge_reinforcement'
    )
  ),
  title text not null,
  summary text not null,
  delivered_at timestamptz not null default now(),
  acknowledged boolean not null default false,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists aipify_university_micro_learning_events_tenant_idx
  on public.aipify_university_micro_learning_events (tenant_id, delivered_at desc);

alter table public.aipify_university_micro_learning_events enable row level security;
revoke all on public.aipify_university_micro_learning_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. aipify_university_certification_progress
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_university_certification_progress (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  cert_key text not null,
  title text not null,
  completion_percentage int not null default 0 check (completion_percentage between 0 and 100),
  status text not null default 'not_started' check (
    status in ('not_started', 'in_progress', 'completed', 'expired')
  ),
  cross_link_route text not null default '/app/certification-achievement-engine',
  metadata jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id, cert_key)
);

alter table public.aipify_university_certification_progress enable row level security;
revoke all on public.aipify_university_certification_progress from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. aipify_university_learning_analytics_snapshots
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_university_learning_analytics_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  participation_rate numeric not null default 0,
  completion_rate numeric not null default 0,
  knowledge_confidence_avg numeric not null default 0,
  learning_frequency_score numeric not null default 0,
  role_preparedness_score numeric not null default 0,
  companion_utilization_score numeric not null default 0,
  knowledge_retention_score numeric not null default 0,
  training_effectiveness_score numeric not null default 0,
  leadership_engagement_score numeric not null default 0,
  aggregate_learning_score numeric not null default 0,
  captured_at timestamptz not null default now()
);

create index if not exists aipify_university_analytics_snapshots_tenant_idx
  on public.aipify_university_learning_analytics_snapshots (tenant_id, captured_at desc);

alter table public.aipify_university_learning_analytics_snapshots enable row level security;
revoke all on public.aipify_university_learning_analytics_snapshots from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. aipify_university_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_university_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.aipify_university_audit_logs enable row level security;
revoke all on public.aipify_university_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_university', v.description
from (values
  ('aipify_university.view', 'View Aipify University', 'View learning pathways, progress, and university dashboard'),
  ('aipify_university.manage', 'Manage Aipify University', 'Configure university settings and assign pathways')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 9. Engine helpers (_auni_*)
-- ---------------------------------------------------------------------------
create or replace function public._auni_tenant_for_auth()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  return v_tenant_id;
end; $$;

create or replace function public._auni_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._auni_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._auni_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_university_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  perform public._tacc_log_audit(
    p_tenant_id, 'user', 'aipify_university_' || p_action_type,
    'aipify_university', 'logged', null, p_context
  );
  return v_id;
end; $$;

create or replace function public._auni_ensure_settings(p_tenant_id uuid)
returns public.aipify_university_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_university_settings;
begin
  insert into public.aipify_university_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_university_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._auni_seed_pathways(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_university_pathways (
    tenant_id, pathway_key, title, description, pathway_type, experience_type,
    target_role, estimated_minutes, content_ref, cross_link_route, sort_order
  )
  select p_tenant_id, v.key, v.title, v.description, v.pathway_type, v.experience_type,
    v.target_role, v.minutes, v.content_ref, v.route, v.sort_order
  from (values
    ('executive_leadership', 'Executive Leadership', 'Strategic leadership and Companion stewardship for executives.', 'executive_leadership', 'executive_programs', 'owner', 120, 'content/knowledge/aipify/aipify-university/', '/app/command-center', 1),
    ('support_excellence', 'Support Excellence', 'Support workflows, escalation, and customer communication excellence.', 'support_excellence', 'role_specific_pathways', 'support_agent', 90, 'content/knowledge/aipify/aipify-university/', '/app/support-ai-engine', 2),
    ('companion_adoption', 'Companion Adoption', 'Adopt and collaborate with Aipify Companions confidently.', 'companion_adoption', 'companion_assisted_coaching', 'viewer', 60, 'content/knowledge/aipify/aipify-university/', '/app/companion-marketplace', 3),
    ('security_awareness', 'Security Awareness', 'Password hygiene, 2FA, phishing, and responsible Companion usage.', 'security_awareness', 'knowledge_refreshers', 'viewer', 45, 'content/knowledge/aipify/aipify-university/', '/app/settings/two-factor', 4),
    ('governance_excellence', 'Governance Excellence', 'Approvals, policies, and trustworthy operational governance.', 'governance_excellence', 'courses', 'administrator', 75, 'content/knowledge/aipify/aipify-university/', '/app/approvals', 5),
    ('commerce_excellence', 'Commerce Excellence', 'Commerce Companion and operational commerce learning paths.', 'commerce_excellence', 'role_specific_pathways', 'manager', 80, 'content/knowledge/aipify/aipify-university/', '/app/commerce-companion', 6),
    ('growth_partner', 'Growth Partner Path', 'Partner operations, customer success, and implementation stewardship.', 'growth_partner', 'role_specific_pathways', 'manager', 70, 'content/knowledge/aipify/aipify-university/', '/app/growth-partner-operations', 7),
    ('department_specific', 'Department-Specific Learning', 'Tailored pathways for departmental roles and priorities.', 'department_specific', 'role_specific_pathways', 'viewer', 50, 'content/knowledge/aipify/aipify-university/', '/app/settings/employee-knowledge', 8),
    ('new_employee_onboarding', 'New Employee Onboarding', 'Welcome, role introduction, Companion familiarization, and cultural orientation.', 'new_employee_onboarding', 'courses', 'viewer', 60, 'content/knowledge/aipify/aipify-university/', '/app/customer-onboarding-engine', 9)
  ) as v(key, title, description, pathway_type, experience_type, target_role, minutes, content_ref, route, sort_order)
  on conflict (tenant_id, pathway_key) do update set
    title = excluded.title,
    description = excluded.description,
    cross_link_route = excluded.cross_link_route,
    updated_at = now();

  insert into public.aipify_university_pathways (
    tenant_id, pathway_key, title, description, pathway_type, experience_type,
    estimated_minutes, content_ref, sort_order
  )
  select p_tenant_id, v.key, v.title, v.description, 'security_training', 'knowledge_refreshers',
    v.minutes, v.content_ref, v.sort_order
  from (values
    ('security_password_hygiene', 'Password Hygiene', 'Strong passwords and credential stewardship.', 10, 'content/knowledge/aipify/aipify-university/', 20),
    ('security_two_fa_awareness', '2FA Awareness', 'Two-factor authentication benefits and setup guidance.', 10, 'content/knowledge/aipify/aipify-university/', 21),
    ('security_recovery_codes', 'Recovery Code Protection', 'Safeguard recovery codes — never share or store insecurely.', 8, 'content/knowledge/aipify/aipify-university/', 22),
    ('security_phishing_detection', 'Phishing Detection', 'Recognize suspicious messages and verify before acting.', 12, 'content/knowledge/aipify/aipify-university/', 23),
    ('security_data_classification', 'Data Classification', 'Understand sensitivity levels and handling expectations.', 10, 'content/knowledge/aipify/aipify-university/', 24),
    ('security_responsible_companion', 'Responsible Companion Usage', 'Use Companions within approved governance boundaries.', 10, 'content/knowledge/aipify/aipify-university/', 25),
    ('security_governance_expectations', 'Governance Expectations', 'Enterprise policy alignment and approval workflows.', 10, 'content/knowledge/aipify/aipify-university/', 26),
    ('security_incident_reporting', 'Incident Reporting', 'Report security concerns promptly — no blame, supportive process.', 8, 'content/knowledge/aipify/aipify-university/', 27)
  ) as v(key, title, description, minutes, content_ref, sort_order)
  on conflict (tenant_id, pathway_key) do nothing;

  insert into public.aipify_university_pathways (
    tenant_id, pathway_key, title, description, pathway_type, experience_type,
    estimated_minutes, content_ref, sort_order
  )
  select p_tenant_id, v.key, v.title, v.description, 'executive_program', 'executive_programs',
    v.minutes, v.content_ref, v.sort_order
  from (values
    ('exec_companion_strategy', 'Companion Strategy', 'Executive Companion strategy and organizational adoption.', 30, 'content/knowledge/aipify/aipify-university/', 30),
    ('exec_governance_principles', 'Governance Principles', 'Trust, approvals, and human accountability at scale.', 25, 'content/knowledge/aipify/aipify-university/', 31),
    ('exec_change_leadership', 'Change Leadership', 'Lead change with patience — reduce resistance through support.', 25, 'content/knowledge/aipify/aipify-university/', 32),
    ('exec_responsible_innovation', 'Responsible Innovation', 'Innovate within governance — wisdom before speed.', 20, 'content/knowledge/aipify/aipify-university/', 33),
    ('exec_decision_support', 'Executive Decision Support', 'Decision Support Engine for leadership — humans decide.', 20, 'content/knowledge/aipify/aipify-university/', 34),
    ('exec_operational_intelligence', 'Operational Intelligence', 'Operational visibility without overwhelm.', 20, 'content/knowledge/aipify/aipify-university/', 35),
    ('exec_organizational_design', 'Organizational Design', 'Structure teams for sustainable Companion collaboration.', 25, 'content/knowledge/aipify/aipify-university/', 36),
    ('exec_human_centered_transformation', 'Human-Centered Transformation', 'Transform with people first — growth through support.', 25, 'content/knowledge/aipify/aipify-university/', 37)
  ) as v(key, title, description, minutes, content_ref, sort_order)
  on conflict (tenant_id, pathway_key) do nothing;
end; $$;

create or replace function public._auni_seed_micro_learning(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.aipify_university_micro_learning_events where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.aipify_university_micro_learning_events (tenant_id, event_type, title, summary)
  select p_tenant_id, v.type, v.title, v.summary
  from (values
    ('three_minute_refresher', '🌹 Three-minute refresher', 'A calm recap of your current pathway — wisdom before speed.'),
    ('weekly_insight', '🦉 Weekly insight', 'One practical learning insight for your role this week.'),
    ('scenario_exercise', 'Scenario exercise', 'A short scenario to practice — mistakes are opportunities, not shame.'),
    ('policy_reminder', 'Policy reminder', 'Gentle reminder of governance expectations — supportive, not punitive.'),
    ('companion_guidance_moment', '🔔 Companion guidance moment', 'Your Companion suggests a resource when you are ready — never pressure.'),
    ('knowledge_reinforcement', 'Knowledge reinforcement', 'Reinforce a concept from your active pathway at a healthy pace.')
  ) as v(type, title, summary);
end; $$;

create or replace function public._auni_refresh_analytics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_pathways int;
  v_enrollments int;
  v_completed int;
  v_in_progress int;
  v_micro int;
  v_certs int;
  v_participation numeric;
  v_completion numeric;
  v_aggregate numeric;
begin
  select count(*) into v_pathways from public.aipify_university_pathways
  where tenant_id = p_tenant_id and status = 'active';

  select count(*), count(*) filter (where status = 'completed'), count(*) filter (where status = 'in_progress')
  into v_enrollments, v_completed, v_in_progress
  from public.aipify_university_enrollments where tenant_id = p_tenant_id;

  select count(*) into v_micro from public.aipify_university_micro_learning_events where tenant_id = p_tenant_id;
  select count(*) into v_certs from public.aipify_university_certification_progress
  where tenant_id = p_tenant_id and status in ('in_progress', 'completed');

  v_participation := least(100, round(40 + v_enrollments * 5 + v_micro * 0.5, 1));
  v_completion := case when v_enrollments > 0 then round(v_completed::numeric / v_enrollments * 100, 1) else 0 end;
  v_aggregate := least(100, round((v_participation + v_completion + v_pathways * 2) / 3, 1));

  if not exists (
    select 1 from public.aipify_university_learning_analytics_snapshots
    where tenant_id = p_tenant_id and captured_at > now() - interval '1 hour'
  ) then
    insert into public.aipify_university_learning_analytics_snapshots (
      tenant_id, participation_rate, completion_rate, knowledge_confidence_avg,
      learning_frequency_score, role_preparedness_score, companion_utilization_score,
      knowledge_retention_score, training_effectiveness_score, leadership_engagement_score,
      aggregate_learning_score
    ) values (
      p_tenant_id, v_participation, v_completion, 72, 68, 70, 65, 74, 71, 69, v_aggregate
    );
  end if;

  return jsonb_build_object(
    'active_pathways', v_pathways,
    'total_enrollments', v_enrollments,
    'completed_enrollments', v_completed,
    'in_progress_enrollments', v_in_progress,
    'micro_learning_events', v_micro,
    'certification_progress_records', v_certs,
    'participation_rate', v_participation,
    'completion_rate', v_completion,
    'aggregate_learning_score', v_aggregate
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Blueprint helpers (_aubp115_*)
-- ---------------------------------------------------------------------------
create or replace function public._aubp115_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Phase 115 — Aipify University & Continuous Learning Engine at /app/aipify-university. Centralized user education and continuous learning — NOT operational Learning Engine memory at /app/learning (Phase 29/65) and NOT formal talent paths at /app/learning-training-engine (A.36). Cross-links: Certification A.37 /app/certification-achievement-engine; Employee Knowledge /app/settings/employee-knowledge; Organizational Memory A.34 /app/organizational-memory-engine; Self Love A.76 /app/self-love-engine; Knowledge Center A.5 /app/knowledge-center-engine; Growth Partner Ops Phase 114 /app/growth-partner-operations; Companion Marketplace Phase 113 /app/companion-marketplace; 2FA /app/settings/two-factor. Helpers use _aubp115_* — never collide with _lte_*, _le_*, _hptdbp92_*.';
$$;

create or replace function public._aubp115_mission()
returns text language sql immutable as $$
  select 'Continuously educate teams — learning as part of everyday work, not a separate burden.';
$$;

create or replace function public._aubp115_philosophy()
returns text language sql immutable as $$
  select 'People First. Wisdom before speed. Growth through support. Learning empowers confidence, not pressure — purpose is growth, not perfection.';
$$;

create or replace function public._aubp115_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Aipify University is the centralized learning environment. Companion coaches support growth; humans decide pace. Metadata only in analytics — no hidden employee scoring.';
$$;

create or replace function public._aubp115_vision()
returns text language sql immutable as $$
  select 'Learning continuous, accessible, practical — woven into everyday work so organizations grow without overwhelm.';
$$;

create or replace function public._aubp115_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'continuously_educate', 'label', 'Continuously educate', 'emoji', '🦉', 'description', 'Ongoing learning integrated with daily workflows'),
    jsonb_build_object('key', 'accelerate_onboarding', 'label', 'Accelerate onboarding', 'emoji', '🌹', 'description', 'Welcome experiences and role introductions at a supportive pace'),
    jsonb_build_object('key', 'companion_adoption', 'label', 'Improve Companion adoption', 'emoji', '🔔', 'description', 'Companion-assisted coaching — never shame'),
    jsonb_build_object('key', 'preserve_knowledge', 'label', 'Preserve knowledge', 'emoji', '🦉', 'description', 'Knowledge retention and institutional memory cross-links'),
    jsonb_build_object('key', 'build_leadership', 'label', 'Build leadership', 'emoji', '🌹', 'description', 'Executive education center topics'),
    jsonb_build_object('key', 'reduce_change_resistance', 'label', 'Reduce change resistance', 'emoji', '🔔', 'description', 'Supportive change leadership learning'),
    jsonb_build_object('key', 'security_awareness', 'label', 'Strengthen security awareness', 'emoji', '🦉', 'description', 'Security training engine — 2FA cross-link'),
    jsonb_build_object('key', 'lifelong_culture', 'label', 'Lifelong learning culture', 'emoji', '🌹', 'description', 'Encourage development — not competition')
  );
$$;

create or replace function public._aubp115_learning_experiences()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'courses', 'label', 'Courses', 'description', 'Structured multi-module learning journeys'),
    jsonb_build_object('key', 'micro_learning_sessions', 'label', 'Micro-learning sessions', 'description', 'Short refreshers during work — not only outside'),
    jsonb_build_object('key', 'interactive_simulations', 'label', 'Interactive simulations', 'description', 'Scenario practice with supportive retakes'),
    jsonb_build_object('key', 'role_specific_pathways', 'label', 'Role-specific pathways', 'description', 'Paths aligned to owner, admin, support, and team roles'),
    jsonb_build_object('key', 'knowledge_refreshers', 'label', 'Knowledge refreshers', 'description', 'Periodic reinforcement without pressure'),
    jsonb_build_object('key', 'executive_programs', 'label', 'Executive programs', 'description', 'Leadership and transformation topics'),
    jsonb_build_object('key', 'certification_tracks', 'label', 'Certification tracks', 'description', 'Internal certs — cross-link A.37'),
    jsonb_build_object('key', 'companion_assisted_coaching', 'label', 'Companion-assisted coaching', 'description', 'Aipify Companion coaches — not generic AI tutors')
  );
$$;

create or replace function public._aubp115_learning_pathways()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'executive_leadership', 'title', 'Executive Leadership', 'route', '/app/command-center'),
    jsonb_build_object('key', 'support_excellence', 'title', 'Support Excellence', 'route', '/app/support-ai-engine'),
    jsonb_build_object('key', 'companion_adoption', 'title', 'Companion Adoption', 'route', '/app/companion-marketplace'),
    jsonb_build_object('key', 'security_awareness', 'title', 'Security Awareness', 'route', '/app/settings/two-factor'),
    jsonb_build_object('key', 'governance_excellence', 'title', 'Governance Excellence', 'route', '/app/approvals'),
    jsonb_build_object('key', 'commerce_excellence', 'title', 'Commerce Excellence', 'route', '/app/commerce-companion'),
    jsonb_build_object('key', 'growth_partner', 'title', 'Growth Partner', 'route', '/app/growth-partner-operations'),
    jsonb_build_object('key', 'department_specific', 'title', 'Department-Specific', 'route', '/app/settings/employee-knowledge'),
    jsonb_build_object('key', 'new_employee_onboarding', 'title', 'New Employee Onboarding', 'route', '/app/customer-onboarding-engine')
  );
$$;

create or replace function public._aubp115_micro_learning_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Micro-learning during work — 3-minute refreshers, weekly insights, scenario exercises, policy reminders, Companion guidance, knowledge reinforcement.',
    'formats', jsonb_build_array(
      jsonb_build_object('key', 'three_minute_refresher', 'label', '3-minute refreshers', 'duration_minutes', 3),
      jsonb_build_object('key', 'weekly_insight', 'label', 'Weekly insights', 'duration_minutes', 5),
      jsonb_build_object('key', 'scenario_exercise', 'label', 'Scenario exercises', 'duration_minutes', 10),
      jsonb_build_object('key', 'policy_reminder', 'label', 'Policy reminders', 'duration_minutes', 3),
      jsonb_build_object('key', 'companion_guidance_moment', 'label', 'Companion guidance moments', 'duration_minutes', 2),
      jsonb_build_object('key', 'knowledge_reinforcement', 'label', 'Knowledge reinforcement', 'duration_minutes', 5)
    ),
    'boundary_note', 'Delivery log metadata only — no raw assessment content.'
  );
$$;

create or replace function public._aubp115_companion_coaching()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion coaches support growth — never shame.',
    'responsibilities', jsonb_build_array(
      'Answer questions with patience',
      'Offer encouragement and celebrate progress',
      'Suggest resources when helpful',
      'Identify knowledge gaps gently',
      'Recommend next steps — user decides',
      'Celebrate milestones without perfection pressure'
    ),
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'key', 'encouragement', 'example', 'You are making thoughtful progress — shall we review the next module when you are ready?'),
      jsonb_build_object('emoji', '🦉', 'key', 'resource_suggestion', 'example', 'A Knowledge Center guide might help with this topic — would you like a link?'),
      jsonb_build_object('emoji', '🔔', 'key', 'gap_identification', 'example', 'This area is new for many teams — a short refresher could build confidence.')
    ),
    'not_label', 'generic AI tutor'
  );
$$;

create or replace function public._aubp115_onboarding_acceleration()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Onboarding acceleration — welcome, orient, and build confidence at a healthy pace.',
    'items', jsonb_build_array(
      'Welcome experiences',
      'Role introductions',
      'Companion familiarization',
      'Knowledge Center guidance',
      'Security training',
      'Departmental paths',
      'Milestone tracking',
      'Manager collaboration',
      'Cultural orientation'
    ),
    'onboarding_route', '/app/customer-onboarding-engine'
  );
$$;

create or replace function public._aubp115_knowledge_retention()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Knowledge retention — capture, preserve, and discover institutional learning.',
    'features', jsonb_build_array(
      'Knowledge capture',
      'Best practice libraries',
      'Lessons learned',
      'Expert contributions',
      'Searchable knowledge maps',
      'Context preservation',
      'Companion-assisted discovery'
    ),
    'organizational_memory_route', '/app/organizational-memory-engine',
    'employee_knowledge_route', '/app/settings/employee-knowledge'
  );
$$;

create or replace function public._aubp115_executive_education()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive education center — leadership topics with human-centered transformation.',
    'topics', jsonb_build_array(
      'Companion Strategy', 'Governance Principles', 'Change Leadership',
      'Responsible Innovation', 'Executive Decision Support', 'Operational Intelligence',
      'Organizational Design', 'Human-Centered Transformation'
    ),
    'route', '/app/executive-insights-engine'
  );
$$;

create or replace function public._aubp115_learning_analytics()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Learning analytics — aggregate metrics only; supportive wellbeing-aware signals, not punitive scoring.',
    'metrics', jsonb_build_array(
      jsonb_build_object('key', 'participation', 'label', 'Participation'),
      jsonb_build_object('key', 'completion', 'label', 'Completion'),
      jsonb_build_object('key', 'knowledge_confidence', 'label', 'Knowledge confidence'),
      jsonb_build_object('key', 'learning_frequency', 'label', 'Learning frequency'),
      jsonb_build_object('key', 'role_preparedness', 'label', 'Role preparedness'),
      jsonb_build_object('key', 'companion_utilization', 'label', 'Companion utilization'),
      jsonb_build_object('key', 'knowledge_retention', 'label', 'Knowledge retention'),
      jsonb_build_object('key', 'training_effectiveness', 'label', 'Training effectiveness'),
      jsonb_build_object('key', 'leadership_engagement', 'label', 'Leadership engagement')
    ),
    'privacy_note', 'Aggregates only — no raw chat, PII, or hidden employee scoring.'
  );
$$;

create or replace function public._aubp115_certification_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Internal certifications encourage development — not competition. Cross-link Certification & Achievement A.37.',
    'certifications', jsonb_build_array(
      jsonb_build_object('key', 'aipify_foundations', 'title', 'Aipify Foundations'),
      jsonb_build_object('key', 'companion_practitioner', 'title', 'Companion Practitioner'),
      jsonb_build_object('key', 'support_excellence_specialist', 'title', 'Support Excellence Specialist'),
      jsonb_build_object('key', 'governance_steward', 'title', 'Governance Steward'),
      jsonb_build_object('key', 'commerce_excellence_specialist', 'title', 'Commerce Excellence Specialist'),
      jsonb_build_object('key', 'knowledge_leader', 'title', 'Knowledge Leader'),
      jsonb_build_object('key', 'executive_transformation_leader', 'title', 'Executive Transformation Leader'),
      jsonb_build_object('key', 'growth_partner_professional', 'title', 'Growth Partner Professional')
    ),
    'certification_route', '/app/certification-achievement-engine'
  );
$$;

create or replace function public._aubp115_self_love_in_learning()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love in learning — healthy pacing, reflection, progress recognition, curiosity, confidence building. Mistakes are opportunities, not shame.',
    'practices', jsonb_build_array(
      'Healthy pacing — no guilt for incomplete modules',
      'Reflection moments between sessions',
      'Progress recognition without perfection pressure',
      'Curiosity encouraged — questions welcomed',
      'Confidence building — retakes normalized'
    ),
    'route', '/app/self-love-engine',
    'boundary_note', 'Self Love influences learning tone — University stores progress metadata only.'
  );
$$;

create or replace function public._aubp115_wellbeing_aware_learning()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Wellbeing-aware learning — monitor overload supportively, never punitively.',
    'signals', jsonb_build_array(
      'Excessive mandatory training load',
      'Repeated assessment failures',
      'Burnout signs from engagement patterns',
      'Low engagement over time'
    ),
    'companion_responses', jsonb_build_array(
      'Suggest reduced intensity or alternative formats',
      'Recommend manager check-ins when appropriate',
      'Offer encouragement and support resources',
      'Never shame or penalize learners'
    ),
    'boundary_note', 'Supportive suggestions only — not automated disciplinary actions.'
  );
$$;

create or replace function public._aubp115_knowledge_center_integration()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Knowledge Center integration — FAQs, guides, reference materials, scenario libraries.',
    'outputs', jsonb_build_array(
      'FAQs', 'Implementation guides', 'Reference materials',
      'Scenario libraries', 'Quick starts', 'Best practices', 'Companion learning cards'
    ),
    'faq_path', 'content/knowledge/aipify/aipify-university/faq/aipify-university-continuous-learning-faq.md',
    'route', '/app/knowledge-center-engine'
  );
$$;

create or replace function public._aubp115_security_training()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Security training engine — enterprise policy awareness with 2FA cross-link.',
    'programs', jsonb_build_array(
      jsonb_build_object('key', 'password_hygiene', 'title', 'Password hygiene'),
      jsonb_build_object('key', 'two_fa_awareness', 'title', '2FA awareness', 'route', '/app/settings/two-factor'),
      jsonb_build_object('key', 'recovery_code_protection', 'title', 'Recovery code protection'),
      jsonb_build_object('key', 'phishing_detection', 'title', 'Phishing detection'),
      jsonb_build_object('key', 'data_classification', 'title', 'Data classification'),
      jsonb_build_object('key', 'responsible_companion_usage', 'title', 'Responsible Companion usage'),
      jsonb_build_object('key', 'governance_expectations', 'title', 'Governance expectations'),
      jsonb_build_object('key', 'incident_reporting', 'title', 'Incident reporting')
    ),
    'two_factor_route', '/app/settings/two-factor'
  );
$$;

create or replace function public._aubp115_companion_adaptation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion adaptation — supportive coaching with wisdom, encouragement, and gentle prompts.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'wisdom_pacing', 'prompt', 'Would a shorter refresher feel better today?', 'consideration', 'Wisdom before speed'),
      jsonb_build_object('emoji', '🌹', 'key', 'encouragement', 'prompt', 'Your progress matters — shall we celebrate this milestone?', 'consideration', 'Growth through support'),
      jsonb_build_object('emoji', '🔔', 'key', 'gentle_nudge', 'prompt', 'A security refresher is available when you are ready — no rush.', 'consideration', 'Supportive not punitive')
    ),
    'boundary_note', 'Companion coaches — never replaces A.36 formal training RPCs.'
  );
$$;

create or replace function public._aubp115_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'University supports humans — does not replace operational learning memory or formal HR systems.',
    'must_avoid', jsonb_build_array(
      'Duplicating Learning Engine customer_learning_memory at /app/learning',
      'Duplicating A.36 training_assessments and formal certification RPCs',
      'Hidden employee scoring or punitive wellbeing surveillance',
      'Storing raw chat, assessment answers, or PII in analytics',
      'Pressure framing — mandatory guilt or perfection demands'
    ),
    'required', jsonb_build_array(
      'Cross-link distinct learning surfaces',
      'Metadata-only analytics and audit',
      'Self Love and healthy pacing in copy',
      'Human oversight on pathway assignment'
    ),
    'boundary_note', 'Aipify University educates — Learning Engine learns WITH the customer operationally.'
  );
$$;

create or replace function public._aubp115_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'learning_engine', 'label', 'Learning Engine (Phase 29/65)', 'route', '/app/learning', 'note', 'Operational learning memory — NOT user education'),
    jsonb_build_object('key', 'learning_training_a36', 'label', 'Learning & Training (A.36)', 'route', '/app/learning-training-engine', 'note', 'Formal talent development paths'),
    jsonb_build_object('key', 'certification_a37', 'label', 'Certification & Achievement (A.37)', 'route', '/app/certification-achievement-engine', 'note', 'Internal certs and badges'),
    jsonb_build_object('key', 'employee_knowledge', 'label', 'Employee Knowledge Engine', 'route', '/app/settings/employee-knowledge', 'note', 'Approved internal knowledge'),
    jsonb_build_object('key', 'organizational_memory', 'label', 'Organizational Memory (A.34)', 'route', '/app/organizational-memory-engine', 'note', 'Institutional memory'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Healthy pacing principles'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine', 'note', 'KC assets integration'),
    jsonb_build_object('key', 'growth_partner_ops', 'label', 'Growth Partner Ops (Phase 114)', 'route', '/app/growth-partner-operations', 'note', 'Growth Partner Path'),
    jsonb_build_object('key', 'companion_marketplace', 'label', 'Companion Marketplace (Phase 113)', 'route', '/app/companion-marketplace', 'note', 'Companion Adoption Path'),
    jsonb_build_object('key', 'two_factor', 'label', '2FA Security', 'route', '/app/settings/two-factor', 'note', 'Security training cross-link')
  );
$$;

create or replace function public._aubp115_success_metrics()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'faster_onboarding', 'label', 'Faster onboarding', 'description', 'Reduced time-to-confidence for new team members'),
    jsonb_build_object('key', 'improved_retention', 'label', 'Improved retention', 'description', 'Knowledge retained through refreshers and libraries'),
    jsonb_build_object('key', 'companion_adoption', 'label', 'Greater Companion adoption', 'description', 'Teams collaborate with Companions confidently'),
    jsonb_build_object('key', 'higher_confidence', 'label', 'Higher confidence', 'description', 'Learners report readiness without pressure'),
    jsonb_build_object('key', 'stronger_leadership', 'label', 'Stronger leadership', 'description', 'Executive programs engaged'),
    jsonb_build_object('key', 'reduced_fatigue', 'label', 'Reduced fatigue', 'description', 'Wellbeing-aware pacing reduces overload'),
    jsonb_build_object('key', 'security_awareness', 'label', 'Improved security awareness', 'description', 'Security training completion and 2FA adoption'),
    jsonb_build_object('key', 'healthier_cultures', 'label', 'Healthier cultures', 'description', 'Self Love integration — mistakes as opportunities'),
    jsonb_build_object('key', 'long_term_success', 'label', 'Long-term success', 'description', 'Lifelong learning culture sustained')
  );
$$;

create or replace function public._aubp115_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_pathways int := 0;
  v_enrollments int := 0;
  v_completed int := 0;
  v_micro int := 0;
  v_certs int := 0;
  v_analytics public.aipify_university_learning_analytics_snapshots;
begin
  select count(*) into v_pathways from public.aipify_university_pathways
  where tenant_id = p_tenant_id and status = 'active';
  select count(*), count(*) filter (where status = 'completed')
  into v_enrollments, v_completed
  from public.aipify_university_enrollments where tenant_id = p_tenant_id;
  select count(*) into v_micro from public.aipify_university_micro_learning_events where tenant_id = p_tenant_id;
  select count(*) into v_certs from public.aipify_university_certification_progress
  where tenant_id = p_tenant_id and status in ('in_progress', 'completed');
  select * into v_analytics from public.aipify_university_learning_analytics_snapshots
  where tenant_id = p_tenant_id order by captured_at desc limit 1;

  return jsonb_build_object(
    'active_pathways', v_pathways,
    'total_enrollments', v_enrollments,
    'completed_enrollments', v_completed,
    'micro_learning_events', v_micro,
    'certification_progress_records', v_certs,
    'aggregate_learning_score', coalesce(v_analytics.aggregate_learning_score, 0),
    'participation_rate', coalesce(v_analytics.participation_rate, 0),
    'completion_rate', coalesce(v_analytics.completion_rate, 0),
    'privacy_note', 'Counts and aggregate scores only — no raw content, chat, or PII.'
  );
end; $$;

create or replace function public._aubp115_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_pathways int; v_micro int; v_settings public.aipify_university_settings;
begin
  select count(*) into v_pathways from public.aipify_university_pathways
  where tenant_id = p_tenant_id and status = 'active';
  select count(*) into v_micro from public.aipify_university_micro_learning_events where tenant_id = p_tenant_id;
  v_settings := public._auni_ensure_settings(p_tenant_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'pathways_seeded', 'label', 'Learning pathways available', 'met', v_pathways >= 9, 'note', case when v_pathways >= 9 then null else 'Seed pathways on first dashboard load' end),
    jsonb_build_object('key', 'micro_learning_active', 'label', 'Micro-learning engine active', 'met', v_micro > 0, 'note', null),
    jsonb_build_object('key', 'wellbeing_aware', 'label', 'Wellbeing-aware learning enabled', 'met', v_settings.wellbeing_aware_enabled, 'note', null),
    jsonb_build_object('key', 'healthy_pacing', 'label', 'Healthy pacing default', 'met', v_settings.healthy_pacing_default, 'note', null),
    jsonb_build_object('key', 'companion_coaching', 'label', 'Companion coaching enabled', 'met', v_settings.companion_coaching_enabled, 'note', null),
    jsonb_build_object('key', 'cross_links', 'label', 'Cross-links to distinct surfaces', 'met', true, 'note', 'Learning Engine, A.36, A.37, EKE, KC, Self Love'),
    jsonb_build_object('key', 'security_training', 'label', 'Security training programs seeded', 'met', v_pathways >= 17, 'note', null),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only analytics', 'met', true, 'note', 'No hidden employee scoring'),
    jsonb_build_object('key', 'self_love_integration', 'label', 'Self Love integration in copy', 'met', true, 'note', 'Mistakes are opportunities — not shame')
  );
end; $$;

create or replace function public._aubp115_blueprint_block(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'phase', 'Phase 115 — Aipify University & Continuous Learning Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE115_AIPIFY_UNIVERSITY_CONTINUOUS_LEARNING.md',
    'engine_phase', 'Repo Phase 115 Aipify University Engine',
    'route', '/app/aipify-university',
    'mapping_note', 'Centralized learning environment — distinct from Learning Engine and A.36.',
    'distinction_note', public._aubp115_distinction_note(),
    'mission', public._aubp115_mission(),
    'philosophy', public._aubp115_philosophy(),
    'abos_principle', public._aubp115_abos_principle(),
    'vision', public._aubp115_vision(),
    'objectives', public._aubp115_objectives(),
    'learning_experiences', public._aubp115_learning_experiences(),
    'learning_pathways', public._aubp115_learning_pathways(),
    'micro_learning_engine', public._aubp115_micro_learning_engine(),
    'companion_coaching', public._aubp115_companion_coaching(),
    'onboarding_acceleration', public._aubp115_onboarding_acceleration(),
    'knowledge_retention', public._aubp115_knowledge_retention(),
    'executive_education', public._aubp115_executive_education(),
    'learning_analytics', public._aubp115_learning_analytics(),
    'certification_framework', public._aubp115_certification_framework(),
    'self_love_in_learning', public._aubp115_self_love_in_learning(),
    'wellbeing_aware_learning', public._aubp115_wellbeing_aware_learning(),
    'knowledge_center_integration', public._aubp115_knowledge_center_integration(),
    'security_training', public._aubp115_security_training(),
    'companion_adaptation', public._aubp115_companion_adaptation(),
    'limitation_principles', public._aubp115_limitation_principles(),
    'cross_links', public._aubp115_cross_links(),
    'success_metrics', public._aubp115_success_metrics(),
    'engagement_summary', public._aubp115_engagement_summary(p_tenant_id),
    'success_criteria', public._aubp115_success_criteria(p_tenant_id)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_aipify_university_card(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_university_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._auni_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  if p_tenant_id is not null and p_tenant_id != public._auni_tenant_for_auth() then
    raise exception 'Tenant mismatch';
  end if;

  v_settings := public._auni_ensure_settings(v_tenant_id);
  perform public._auni_seed_pathways(v_tenant_id);
  perform public._auni_seed_micro_learning(v_tenant_id);
  v_metrics := public._auni_refresh_analytics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'aggregate_learning_score', v_metrics->'aggregate_learning_score',
    'active_pathways', v_metrics->'active_pathways',
    'participation_rate', v_metrics->'participation_rate',
    'philosophy', public._aubp115_philosophy(),
    'human_oversight_required', true,
    'wellbeing_aware_enabled', v_settings.wellbeing_aware_enabled,
    'healthy_pacing_default', v_settings.healthy_pacing_default,
    'implementation_blueprint_phase115', jsonb_build_object(
      'phase', 'Phase 115 — Aipify University & Continuous Learning Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE115_AIPIFY_UNIVERSITY_CONTINUOUS_LEARNING.md',
      'engine_phase', 'Repo Phase 115',
      'route', '/app/aipify-university'
    ),
    'aipify_university_mission', public._aubp115_mission(),
    'aipify_university_abos_principle', public._aubp115_abos_principle(),
    'aipify_university_engagement_summary', public._aubp115_engagement_summary(v_tenant_id),
    'aipify_university_vision_note', public._aubp115_vision()
  );
end; $$;

create or replace function public.get_aipify_university_dashboard(p_tenant_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_university_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._auni_require_tenant());
  if p_tenant_id is not null and p_tenant_id != public._auni_tenant_for_auth() then
    raise exception 'Tenant mismatch';
  end if;

  v_settings := public._auni_ensure_settings(v_tenant_id);
  perform public._auni_seed_pathways(v_tenant_id);
  perform public._auni_seed_micro_learning(v_tenant_id);
  v_metrics := public._auni_refresh_analytics(v_tenant_id);
  perform public._auni_log_audit(v_tenant_id, 'dashboard_viewed', 'Aipify University dashboard loaded', v_metrics);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'philosophy', public._aubp115_philosophy(),
    'distinction_note', public._aubp115_distinction_note(),
    'safety_note', 'Aipify University educates teams — Learning Engine (/app/learning) and A.36 (/app/learning-training-engine) remain distinct. Metadata only; wellbeing-aware is supportive not punitive.',
    'continuous_learning_enabled', v_settings.continuous_learning_enabled,
    'wellbeing_aware_enabled', v_settings.wellbeing_aware_enabled,
    'healthy_pacing_default', v_settings.healthy_pacing_default,
    'micro_learning_enabled', v_settings.micro_learning_enabled,
    'companion_coaching_enabled', v_settings.companion_coaching_enabled,
    'default_pacing', v_settings.default_pacing,
    'active_pathways', v_metrics->'active_pathways',
    'total_enrollments', v_metrics->'total_enrollments',
    'completed_enrollments', v_metrics->'completed_enrollments',
    'in_progress_enrollments', v_metrics->'in_progress_enrollments',
    'micro_learning_events', v_metrics->'micro_learning_events',
    'aggregate_learning_score', v_metrics->'aggregate_learning_score',
    'participation_rate', v_metrics->'participation_rate',
    'completion_rate', v_metrics->'completion_rate',
    'pathways', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'pathway_key', p.pathway_key, 'title', p.title,
        'description', p.description, 'pathway_type', p.pathway_type,
        'experience_type', p.experience_type, 'target_role', p.target_role,
        'estimated_minutes', p.estimated_minutes, 'cross_link_route', p.cross_link_route,
        'status', p.status
      ) order by p.sort_order)
      from public.aipify_university_pathways p
      where p.tenant_id = v_tenant_id and p.status = 'active'
    ), '[]'::jsonb),
    'micro_learning_recent', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'event_type', m.event_type, 'title', m.title,
        'summary', m.summary, 'delivered_at', m.delivered_at, 'acknowledged', m.acknowledged
      ) order by m.delivered_at desc)
      from public.aipify_university_micro_learning_events m
      where m.tenant_id = v_tenant_id limit 10
    ), '[]'::jsonb),
    'analytics_snapshot', coalesce((
      select jsonb_build_object(
        'participation_rate', a.participation_rate,
        'completion_rate', a.completion_rate,
        'knowledge_confidence_avg', a.knowledge_confidence_avg,
        'learning_frequency_score', a.learning_frequency_score,
        'role_preparedness_score', a.role_preparedness_score,
        'companion_utilization_score', a.companion_utilization_score,
        'knowledge_retention_score', a.knowledge_retention_score,
        'training_effectiveness_score', a.training_effectiveness_score,
        'leadership_engagement_score', a.leadership_engagement_score,
        'aggregate_learning_score', a.aggregate_learning_score,
        'captured_at', a.captured_at
      )
      from public.aipify_university_learning_analytics_snapshots a
      where a.tenant_id = v_tenant_id order by a.captured_at desc limit 1
    ), '{}'::jsonb),
    'integration_links', public._aubp115_cross_links(),
    'implementation_blueprint', public._aubp115_blueprint_block(v_tenant_id),
    'implementation_blueprint_phase115', jsonb_build_object(
      'phase', 'Phase 115 — Aipify University & Continuous Learning Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE115_AIPIFY_UNIVERSITY_CONTINUOUS_LEARNING.md',
      'engine_phase', 'Repo Phase 115',
      'route', '/app/aipify-university'
    ),
    'aipify_university_mission', public._aubp115_mission(),
    'aipify_university_philosophy', public._aubp115_philosophy(),
    'aipify_university_abos_principle', public._aubp115_abos_principle(),
    'aipify_university_objectives', public._aubp115_objectives(),
    'learning_experiences', public._aubp115_learning_experiences(),
    'learning_pathways_blueprint', public._aubp115_learning_pathways(),
    'micro_learning_engine', public._aubp115_micro_learning_engine(),
    'companion_coaching', public._aubp115_companion_coaching(),
    'onboarding_acceleration', public._aubp115_onboarding_acceleration(),
    'knowledge_retention', public._aubp115_knowledge_retention(),
    'executive_education', public._aubp115_executive_education(),
    'learning_analytics_meta', public._aubp115_learning_analytics(),
    'certification_framework', public._aubp115_certification_framework(),
    'self_love_in_learning', public._aubp115_self_love_in_learning(),
    'wellbeing_aware_learning', public._aubp115_wellbeing_aware_learning(),
    'knowledge_center_integration', public._aubp115_knowledge_center_integration(),
    'security_training', public._aubp115_security_training(),
    'companion_adaptation', public._aubp115_companion_adaptation(),
    'limitation_principles', public._aubp115_limitation_principles(),
    'aubp115_cross_links', public._aubp115_cross_links(),
    'success_metrics', public._aubp115_success_metrics(),
    'engagement_summary', public._aubp115_engagement_summary(v_tenant_id),
    'success_criteria', public._aubp115_success_criteria(v_tenant_id),
    'aipify_university_vision', public._aubp115_vision(),
    'privacy_note', 'Aipify University metadata only — pathway progress, aggregate analytics, delivery logs. No raw chat, assessment content, or hidden employee scoring.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Grants + Knowledge Center category
-- ---------------------------------------------------------------------------
grant execute on function public._auni_tenant_for_auth() to authenticated;
grant execute on function public.get_aipify_university_card(uuid) to authenticated;
grant execute on function public.get_aipify_university_dashboard(uuid) to authenticated;
grant execute on function public._aubp115_blueprint_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-university', 'Aipify University',
  'Centralized continuous learning environment — pathways, micro-learning, Companion coaching, and wellbeing-aware education.',
  'authenticated', 132
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'aipify-university' and tenant_id is null
);
