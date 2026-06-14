-- Phase A.36 — Learning & Training Engine
-- User education paths for Aipify module adoption — distinct from Phase 29 Learning Engine (AI memory).

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
    'multi_store_orchestration', 'aipify_core_platform', 'multi_tenant_architecture',
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
    'learning_training_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. learning_paths
-- ---------------------------------------------------------------------------
create table if not exists public.learning_paths (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  path_key text not null,
  title text not null,
  description text,
  category text not null default 'onboarding' check (
    category in (
      'onboarding', 'administrator', 'support_ai', 'governance',
      'security_awareness', 'integration_setup', 'module_specific'
    )
  ),
  target_role text not null default 'viewer' check (
    target_role in ('owner', 'administrator', 'manager', 'support_agent', 'viewer')
  ),
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  content_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, path_key)
);

create index if not exists learning_paths_org_role_idx
  on public.learning_paths (organization_id, target_role, status);

alter table public.learning_paths enable row level security;
revoke all on public.learning_paths from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. training_modules
-- ---------------------------------------------------------------------------
create table if not exists public.training_modules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  learning_path_id uuid not null references public.learning_paths (id) on delete cascade,
  module_key text not null,
  title text not null,
  content_type text not null default 'article' check (
    content_type in ('article', 'checklist', 'video', 'walkthrough', 'assessment')
  ),
  estimated_duration int not null default 15 check (estimated_duration > 0),
  completion_required boolean not null default true,
  content_ref text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, learning_path_id, module_key)
);

create index if not exists training_modules_path_idx
  on public.training_modules (learning_path_id, sort_order);

alter table public.training_modules enable row level security;
revoke all on public.training_modules from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. user_learning_progress
-- ---------------------------------------------------------------------------
create table if not exists public.user_learning_progress (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  learning_path_id uuid not null references public.learning_paths (id) on delete cascade,
  completion_percentage int not null default 0 check (completion_percentage between 0 and 100),
  status text not null default 'not_started' check (
    status in ('not_started', 'in_progress', 'completed', 'expired')
  ),
  completed_modules jsonb not null default '[]'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  due_at timestamptz,
  assigned_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id, learning_path_id)
);

create index if not exists user_learning_progress_org_user_idx
  on public.user_learning_progress (organization_id, user_id, status);

alter table public.user_learning_progress enable row level security;
revoke all on public.user_learning_progress from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. training_assessments
-- ---------------------------------------------------------------------------
create table if not exists public.training_assessments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  training_module_id uuid not null references public.training_modules (id) on delete cascade,
  assessment_key text not null,
  title text not null,
  question_count int not null default 5 check (question_count > 0),
  passing_score int not null default 80 check (passing_score between 0 and 100),
  content_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, training_module_id, assessment_key)
);

alter table public.training_assessments enable row level security;
revoke all on public.training_assessments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. learning_training_settings
-- ---------------------------------------------------------------------------
create table if not exists public.learning_training_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  setting_key text not null,
  setting_value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, setting_key)
);

alter table public.learning_training_settings enable row level security;
revoke all on public.learning_training_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions (learning_training.* — distinct from Phase 29 learning memory)
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'learning_training', v.description
from (values
  ('learning_training.view', 'View Training', 'View assigned learning paths and progress'),
  ('learning_training.assign', 'Assign Training', 'Assign learning paths to team members'),
  ('learning_training.manage', 'Manage Training', 'Create and manage learning paths and modules'),
  ('learning_training.review', 'Review Training', 'Review team readiness and assessment outcomes')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'learning_training.view'), ('owner', 'learning_training.assign'),
  ('owner', 'learning_training.manage'), ('owner', 'learning_training.review'),
  ('administrator', 'learning_training.view'), ('administrator', 'learning_training.assign'),
  ('administrator', 'learning_training.manage'), ('administrator', 'learning_training.review'),
  ('manager', 'learning_training.view'), ('manager', 'learning_training.review'),
  ('support_agent', 'learning_training.view'),
  ('viewer', 'learning_training.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Helpers (_lte_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._lte_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'learning_training',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._lte_default_setting(p_key text)
returns jsonb language sql immutable as $$
  select case p_key
    when 'defaults' then '{
      "auto_assign_onboarding": true,
      "first_login_guidance": true,
      "overdue_reminder_days": 7,
      "completion_required_for_go_live": false
    }'::jsonb
    when 'team_readiness' then '{"aggregate_only": true, "min_completion_threshold": 80}'::jsonb
    else '{}'::jsonb
  end;
$$;

create or replace function public._lte_ensure_settings(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.learning_training_settings (organization_id, setting_key, setting_value)
  select p_organization_id, v.key, public._lte_default_setting(v.key)
  from (values ('defaults'), ('team_readiness')) as v(key)
  on conflict (organization_id, setting_key) do nothing;
end; $$;

create or replace function public._lte_seed_org_content(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_path_id uuid;
  v_module_id uuid;
begin
  perform public._lte_ensure_settings(p_organization_id);

  -- Owner paths: governance, enterprise
  insert into public.learning_paths (organization_id, path_key, title, description, category, target_role, content_ref)
  select p_organization_id, v.key, v.title, v.item_description, v.cat, v.role, v.ref
  from (values
    ('owner_governance', 'Governance Foundations', 'Enterprise governance, policies, and approval workflows.', 'governance', 'owner', 'kc://governance-policy-engine'),
    ('owner_enterprise', 'Enterprise Readiness', 'Enterprise controls, delegated admin, and deployment readiness.', 'governance', 'owner', 'kc://enterprise-readiness-engine')
  ) as v(key, title, item_description, cat, role, ref)
  on conflict (organization_id, path_key) do nothing;

  -- Administrator paths: operations, approvals, integrations
  insert into public.learning_paths (organization_id, path_key, title, description, category, target_role, content_ref)
  select p_organization_id, v.key, v.title, v.item_description, v.cat, v.role, v.ref
  from (values
    ('admin_operations', 'Operations Dashboard', 'Monitor operations, alerts, and daily workflows.', 'administrator', 'administrator', 'kc://operations-dashboard-engine'),
    ('admin_approvals', 'Approvals & Trust Actions', 'Review and approve AI actions with accountability.', 'administrator', 'administrator', 'kc://secure-ai-action'),
    ('admin_integrations', 'Integration Setup', 'Connect systems safely with read-only-first posture.', 'integration_setup', 'administrator', 'kc://integration-engine')
  ) as v(key, title, item_description, cat, role, ref)
  on conflict (organization_id, path_key) do nothing;

  -- Support paths: Support AI, Knowledge Center
  insert into public.learning_paths (organization_id, path_key, title, description, category, target_role, content_ref)
  select p_organization_id, v.key, v.title, v.item_description, v.cat, v.role, v.ref
  from (values
    ('support_ai_basics', 'Support AI Essentials', 'Configure and operate Support AI with human review.', 'support_ai', 'support_agent', 'kc://support-ai-engine'),
    ('support_knowledge_center', 'Knowledge Center for Support', 'Publish and maintain support knowledge articles.', 'support_ai', 'support_agent', 'kc://knowledge-center-engine')
  ) as v(key, title, item_description, cat, role, ref)
  on conflict (organization_id, path_key) do nothing;

  -- Manager paths: analytics, reporting
  insert into public.learning_paths (organization_id, path_key, title, description, category, target_role, content_ref)
  select p_organization_id, v.key, v.title, v.item_description, v.cat, v.role, v.ref
  from (values
    ('manager_analytics', 'Analytics & Insights', 'Understand business metrics and operational insights.', 'module_specific', 'manager', 'kc://analytics-insights-engine'),
    ('manager_reporting', 'Reporting & Exports', 'Generate metadata-only reports for stakeholders.', 'module_specific', 'manager', 'kc://audit-accountability')
  ) as v(key, title, item_description, cat, role, ref)
  on conflict (organization_id, path_key) do nothing;

  -- Onboarding path (all roles)
  insert into public.learning_paths (organization_id, path_key, title, description, category, target_role, content_ref)
  values (
    p_organization_id, 'onboarding_getting_started', 'Getting Started with Aipify',
    'First-login guidance and module adoption checklist.', 'onboarding', 'viewer',
    'kc://customer-onboarding-engine'
  )
  on conflict (organization_id, path_key) do nothing;

  -- Seed modules for onboarding path
  select id into v_path_id from public.learning_paths
  where organization_id = p_organization_id and path_key = 'onboarding_getting_started';

  if v_path_id is not null then
    insert into public.training_modules (
      organization_id, learning_path_id, module_key, title, content_type,
      estimated_duration, completion_required, content_ref, sort_order
    )
    select p_organization_id, v_path_id, v.key, v.title, v.type, v.dur, v.req, v.ref, v.ord
    from (values
      ('welcome_overview', 'Welcome & Platform Overview', 'article', 10, true, 'kc://aipify-core-platform', 1),
      ('team_setup', 'Team & Roles Setup', 'checklist', 15, true, 'kc://identity-access', 2),
      ('module_activation', 'Activate Core Modules', 'walkthrough', 20, true, 'kc://module-marketplace-foundation-engine', 3),
      ('go_live_checklist', 'Go-Live Readiness', 'checklist', 15, true, 'kc://customer-onboarding-engine', 4)
    ) as v(key, title, type, dur, req, ref, ord)
    on conflict (organization_id, learning_path_id, module_key) do nothing;

    select id into v_module_id from public.training_modules
    where organization_id = p_organization_id and learning_path_id = v_path_id and module_key = 'go_live_checklist';

    if v_module_id is not null then
      insert into public.training_assessments (
        organization_id, training_module_id, assessment_key, title, question_count, passing_score, content_ref
      )
      values (
        p_organization_id, v_module_id, 'go_live_knowledge_check', 'Go-Live Knowledge Check', 5, 80,
        'kc://learning-training-engine/faq'
      )
      on conflict (organization_id, training_module_id, assessment_key) do nothing;
    end if;
  end if;

  -- Security awareness path
  insert into public.learning_paths (organization_id, path_key, title, description, category, target_role, content_ref)
  values (
    p_organization_id, 'security_awareness_basics', 'Security Awareness',
    'Trust architecture, data ownership, and safe AI action practices.', 'security_awareness', 'viewer',
    'kc://audit-accountability'
  )
  on conflict (organization_id, path_key) do nothing;
end; $$;

create or replace function public._lte_user_role(p_organization_id uuid, p_user_id uuid)
returns text language sql stable security definer set search_path = public as $$
  select coalesce(u.role, 'viewer')
  from public.users u
  where u.id = p_user_id and u.company_id = p_organization_id
  limit 1;
$$;

create or replace function public._lte_recommended_paths(p_organization_id uuid, p_user_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_role text;
  v_onboarding_step text;
  v_completion numeric;
begin
  v_role := public._lte_user_role(p_organization_id, p_user_id);

  select o.current_step, o.completion_percentage
  into v_onboarding_step, v_completion
  from public.organization_onboarding o
  where o.organization_id = p_organization_id;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', lp.id,
      'path_key', lp.path_key,
      'title', lp.title,
      'category', lp.category,
      'target_role', lp.target_role,
      'content_ref', lp.content_ref,
      'recommendation_reason', case
        when lp.path_key = 'onboarding_getting_started' and coalesce(v_completion, 0) < 100
          then 'Recommended from Customer Onboarding (A.10) — first login guidance'
        when lp.target_role = v_role then 'Matched to your role'
        when lp.category = 'onboarding' and v_onboarding_step in ('welcome', 'organization_profile', 'team_setup')
          then 'Onboarding step: ' || v_onboarding_step
        else 'Suggested for module adoption'
      end
    ) order by lp.category, lp.path_key)
    from public.learning_paths lp
    where lp.organization_id = p_organization_id
      and lp.status = 'active'
      and (
        lp.target_role = v_role
        or lp.category = 'onboarding'
        or (v_onboarding_step = 'integrations' and lp.category = 'integration_setup')
        or (v_onboarding_step = 'support_ai' and lp.category = 'support_ai')
      )
    limit 8
  ), '[]'::jsonb);
end; $$;

create or replace function public._lte_team_readiness(p_organization_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'aggregate_only', true,
    'privacy_note', 'Team counts and completion rates only — no individual PII.',
    'total_assignments', count(*),
    'completed_count', count(*) filter (where ulp.status = 'completed'),
    'in_progress_count', count(*) filter (where ulp.status = 'in_progress'),
    'overdue_count', count(*) filter (where ulp.due_at < now() and ulp.status not in ('completed', 'expired')),
    'average_completion', coalesce(round(avg(ulp.completion_percentage))::int, 0),
    'readiness_score', coalesce(round(
      100.0 * count(*) filter (where ulp.status = 'completed') / nullif(count(*), 0)
    )::int, 0)
  )
  from public.user_learning_progress ulp
  where ulp.organization_id = p_organization_id;
$$;

create or replace function public._lte_calc_path_completion(
  p_organization_id uuid,
  p_path_id uuid,
  p_completed_modules jsonb
)
returns int language sql stable security definer set search_path = public as $$
  select case
    when coalesce(v_total, 0) = 0 then 0
    else least(100, round(100.0 * coalesce(v_done, 0) / v_total)::int)
  end
  from (
    select
      count(*) filter (where tm.completion_required) as v_total,
      count(*) filter (
        where tm.completion_required
          and p_completed_modules ? tm.id::text
      ) as v_done
    from public.training_modules tm
    where tm.organization_id = p_organization_id and tm.learning_path_id = p_path_id
  ) s;
$$;

-- ---------------------------------------------------------------------------
-- 8. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.assign_training_path(
  p_user_id uuid,
  p_learning_path_id uuid,
  p_due_at timestamptz default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_assigner uuid;
  v_row public.user_learning_progress;
begin
  perform public._irp_require_permission('learning_training.assign');
  v_org_id := public._mta_require_organization();
  v_assigner := public._mta_app_user_id();

  insert into public.user_learning_progress (
    organization_id, user_id, learning_path_id, status, assigned_by, due_at, started_at
  )
  values (v_org_id, p_user_id, p_learning_path_id, 'not_started', v_assigner, p_due_at, null)
  on conflict (organization_id, user_id, learning_path_id) do update set
    assigned_by = v_assigner,
    due_at = coalesce(excluded.due_at, user_learning_progress.due_at),
    updated_at = now()
  returning * into v_row;

  perform public._lte_log(v_org_id, 'training_assigned', 'learning_path', v_row.id,
    jsonb_build_object('user_id', p_user_id, 'learning_path_id', p_learning_path_id));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.record_training_progress(
  p_learning_path_id uuid,
  p_module_id uuid default null,
  p_completion_percentage int default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.user_learning_progress;
  v_modules jsonb;
  v_pct int;
  v_required int;
begin
  perform public._irp_require_permission('learning_training.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  select * into v_row from public.user_learning_progress
  where organization_id = v_org_id and user_id = v_user_id and learning_path_id = p_learning_path_id;

  if not found then
    insert into public.user_learning_progress (
      organization_id, user_id, learning_path_id, status, started_at
    )
    values (v_org_id, v_user_id, p_learning_path_id, 'in_progress', now())
    returning * into v_row;
  end if;

  v_modules := coalesce(v_row.completed_modules, '[]'::jsonb);
  if p_module_id is not null then
    v_modules := v_modules || to_jsonb(p_module_id::text);
    v_modules := (select coalesce(jsonb_agg(distinct elem), '[]'::jsonb) from jsonb_array_elements_text(v_modules) elem);
  end if;

  v_pct := coalesce(p_completion_percentage, public._lte_calc_path_completion(v_org_id, p_learning_path_id, v_modules));

  select count(*) into v_required
  from public.training_modules
  where organization_id = v_org_id and learning_path_id = p_learning_path_id and completion_required;

  update public.user_learning_progress
  set completed_modules = v_modules,
      completion_percentage = v_pct,
      status = case
        when v_pct >= 100 then 'completed'
        when v_pct > 0 then 'in_progress'
        else status
      end,
      started_at = coalesce(started_at, now()),
      completed_at = case when v_pct >= 100 then now() else completed_at end,
      updated_at = now()
  where id = v_row.id
  returning * into v_row;

  perform public._lte_log(v_org_id, 'training_progress_recorded', 'learning_progress', v_row.id,
    jsonb_build_object(
      'learning_path_id', p_learning_path_id,
      'module_id', p_module_id,
      'completion_percentage', v_pct
    ));

  if v_row.status = 'completed' then
    perform public._lte_log(v_org_id, 'training_completed', 'learning_progress', v_row.id,
      jsonb_build_object('learning_path_id', p_learning_path_id));
  end if;

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.submit_training_assessment(
  p_assessment_id uuid,
  p_score int,
  p_passed boolean default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_assessment public.training_assessments;
  v_passed boolean;
  v_module_id uuid;
  v_path_id uuid;
begin
  perform public._irp_require_permission('learning_training.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  select * into v_assessment from public.training_assessments
  where id = p_assessment_id and organization_id = v_org_id;
  if not found then raise exception 'Assessment not found'; end if;

  v_passed := coalesce(p_passed, p_score >= v_assessment.passing_score);
  v_module_id := v_assessment.training_module_id;

  select learning_path_id into v_path_id
  from public.training_modules where id = v_module_id;

  if v_passed and v_path_id is not null then
    perform public.record_training_progress(v_path_id, v_module_id, null);
  end if;

  perform public._lte_log(v_org_id, 'training_assessment_submitted', 'training_assessment', v_assessment.id,
    jsonb_build_object(
      'assessment_key', v_assessment.assessment_key,
      'score', p_score,
      'passed', v_passed,
      'user_id', v_user_id
    ));

  return jsonb_build_object(
    'assessment_id', p_assessment_id,
    'score', p_score,
    'passing_score', v_assessment.passing_score,
    'passed', v_passed,
    'module_completed', v_passed
  );
end; $$;

create or replace function public.save_learning_training_path(
  p_path_key text,
  p_title text,
  p_description text default null,
  p_category text default 'module_specific',
  p_target_role text default 'viewer',
  p_content_ref text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.learning_paths;
begin
  perform public._irp_require_permission('learning_training.manage');
  v_org_id := public._mta_require_organization();

  insert into public.learning_paths (
    organization_id, path_key, title, description, category, target_role, content_ref
  )
  values (v_org_id, p_path_key, p_title, p_description, p_category, p_target_role, p_content_ref)
  on conflict (organization_id, path_key) do update set
    title = excluded.title,
    description = excluded.description,
    category = excluded.category,
    target_role = excluded.target_role,
    content_ref = excluded.content_ref,
    updated_at = now()
  returning * into v_row;

  perform public._lte_log(v_org_id, 'learning_path_updated', 'learning_path', v_row.id,
    jsonb_build_object('path_key', p_path_key));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.save_learning_training_setting(
  p_setting_key text,
  p_setting_value jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.learning_training_settings;
begin
  perform public._irp_require_permission('learning_training.manage');
  v_org_id := public._mta_require_organization();

  insert into public.learning_training_settings (organization_id, setting_key, setting_value)
  values (v_org_id, p_setting_key, p_setting_value)
  on conflict (organization_id, setting_key) do update set
    setting_value = excluded.setting_value,
    updated_at = now()
  returning * into v_row;

  perform public._lte_log(v_org_id, 'training_settings_changed', 'learning_training_settings', v_row.id,
    jsonb_build_object('setting_key', p_setting_key));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.list_training_paths()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('learning_training.view');
  v_org_id := public._mta_require_organization();
  perform public._lte_seed_org_content(v_org_id);

  return coalesce((
    select jsonb_agg(row_to_json(lp) order by lp.category, lp.path_key)
    from public.learning_paths lp
    where lp.organization_id = v_org_id and lp.status = 'active'
  ), '[]'::jsonb);
end; $$;

create or replace function public.get_training_progress()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  perform public._irp_require_permission('learning_training.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', ulp.id,
      'learning_path_id', ulp.learning_path_id,
      'path_key', lp.path_key,
      'path_title', lp.title,
      'completion_percentage', ulp.completion_percentage,
      'status', ulp.status,
      'due_at', ulp.due_at,
      'started_at', ulp.started_at,
      'completed_at', ulp.completed_at,
      'overdue', ulp.due_at < now() and ulp.status not in ('completed', 'expired')
    ) order by ulp.updated_at desc)
    from public.user_learning_progress ulp
    join public.learning_paths lp on lp.id = ulp.learning_path_id
    where ulp.organization_id = v_org_id and ulp.user_id = v_user_id
  ), '[]'::jsonb);
end; $$;

create or replace function public.list_training_assessments(p_module_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('learning_training.view');
  v_org_id := public._mta_require_organization();

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', ta.id,
      'assessment_key', ta.assessment_key,
      'title', ta.title,
      'training_module_id', ta.training_module_id,
      'question_count', ta.question_count,
      'passing_score', ta.passing_score,
      'content_ref', ta.content_ref
    ) order by ta.title)
    from public.training_assessments ta
    where ta.organization_id = v_org_id
      and (p_module_id is null or ta.training_module_id = p_module_id)
  ), '[]'::jsonb);
end; $$;

create or replace function public.get_learning_training_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings jsonb;
begin
  perform public._irp_require_permission('learning_training.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._lte_seed_org_content(v_org_id);

  select coalesce(jsonb_object_agg(s.setting_key, s.setting_value), '{}'::jsonb)
  into v_settings
  from public.learning_training_settings s
  where s.organization_id = v_org_id;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Self-paced education for Aipify module adoption — metadata-only content references, not AI learning memory.',
    'principles', jsonb_build_array(
      'Tenant-aware learning paths with role-specific training',
      'Knowledge Center article references — no raw PII',
      'First-login guidance integrated with Customer Onboarding (A.10)',
      'Team readiness aggregates only for managers and reviewers',
      'Distinct from Phase 29 Learning Engine (customer_learning_memory)'
    ),
    'summary', jsonb_build_object(
      'assigned_paths', coalesce((
        select count(*) from public.user_learning_progress
        where organization_id = v_org_id and user_id = v_user_id
      ), 0),
      'completed_paths', coalesce((
        select count(*) from public.user_learning_progress
        where organization_id = v_org_id and user_id = v_user_id and status = 'completed'
      ), 0),
      'in_progress_paths', coalesce((
        select count(*) from public.user_learning_progress
        where organization_id = v_org_id and user_id = v_user_id and status = 'in_progress'
      ), 0),
      'overdue_paths', coalesce((
        select count(*) from public.user_learning_progress
        where organization_id = v_org_id and user_id = v_user_id
          and due_at < now() and status not in ('completed', 'expired')
      ), 0),
      'available_paths', coalesce((
        select count(*) from public.learning_paths
        where organization_id = v_org_id and status = 'active'
      ), 0)
    ),
    'assigned_paths', public.get_training_progress(),
    'recommended_paths', public._lte_recommended_paths(v_org_id, v_user_id),
    'overdue_training', coalesce((
      select jsonb_agg(jsonb_build_object(
        'path_title', lp.title,
        'path_key', lp.path_key,
        'due_at', ulp.due_at,
        'completion_percentage', ulp.completion_percentage
      ) order by ulp.due_at)
      from public.user_learning_progress ulp
      join public.learning_paths lp on lp.id = ulp.learning_path_id
      where ulp.organization_id = v_org_id and ulp.user_id = v_user_id
        and ulp.due_at < now() and ulp.status not in ('completed', 'expired')
    ), '[]'::jsonb),
    'recommended_modules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', tm.id,
        'module_key', tm.module_key,
        'title', tm.title,
        'content_type', tm.content_type,
        'estimated_duration', tm.estimated_duration,
        'content_ref', tm.content_ref,
        'path_title', lp.title
      ) order by tm.sort_order)
      from public.training_modules tm
      join public.learning_paths lp on lp.id = tm.learning_path_id
      where tm.organization_id = v_org_id
        and lp.id in (
          select (elem->>'id')::uuid
          from jsonb_array_elements(public._lte_recommended_paths(v_org_id, v_user_id)) elem
          where elem->>'id' is not null
        )
      limit 12
    ), '[]'::jsonb),
    'learning_paths', coalesce((
      select jsonb_agg(row_to_json(lp) order by lp.category, lp.path_key)
      from public.learning_paths lp
      where lp.organization_id = v_org_id and lp.status = 'active'
    ), '[]'::jsonb),
    'team_readiness', case
      when public._irp_has_permission('learning_training.review') then public._lte_team_readiness(v_org_id)
      else jsonb_build_object('aggregate_only', true, 'access_denied', true)
    end,
    'onboarding_integration', coalesce((
      select jsonb_build_object(
        'current_step', o.current_step,
        'completion_percentage', o.completion_percentage,
        'first_login_guidance', coalesce((v_settings->'defaults'->>'first_login_guidance')::boolean, true),
        'onboarding_route', '/app/customer-onboarding-engine'
      )
      from public.organization_onboarding o
      where o.organization_id = v_org_id
    ), jsonb_build_object('current_step', 'welcome', 'completion_percentage', 0)),
    'settings', v_settings,
    'distinction_note', 'Phase A.36 user education only — not Phase 29 Learning Engine (customer_learning_memory at /app/learning).'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_learning_training_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_assigned int;
  v_completed int;
  v_overdue int;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._lte_seed_org_content(v_org_id);

  select
    count(*),
    count(*) filter (where status = 'completed'),
    count(*) filter (where due_at < now() and status not in ('completed', 'expired'))
  into v_assigned, v_completed, v_overdue
  from public.user_learning_progress
  where organization_id = v_org_id and user_id = v_user_id;

  return jsonb_build_object(
    'has_organization', true,
    'assigned_paths', v_assigned,
    'completed_paths', v_completed,
    'overdue_paths', v_overdue,
    'philosophy', 'Self-paced training for Aipify module adoption.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Audit extension
-- ---------------------------------------------------------------------------
create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'module_activated', 'module_deactivated', 'module_configured',
    'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'support_ai_draft_generated', 'support_escalated', 'support_approval_granted',
    'support_case_created', 'support_case_closed', 'support_case_assigned', 'support_satisfaction_received',
    'integration_created', 'integration_updated', 'integration_disabled', 'integration_connected',
    'integration_credential_rotated', 'integration_sync_executed', 'integration_sync_failed',
    'integration_webhook_received', 'integration_webhook_failed',
    'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_removed', 'settings_updated',
    'organization_provisioned', 'organization_switched', 'approval_submitted', 'approval_approved', 'approval_rejected',
    'audit_exported',
    'assistant_task_created', 'assistant_task_assigned', 'assistant_task_updated',
    'assistant_recommendation_accepted', 'assistant_recommendation_rejected',
    'assistant_daily_briefing_generated', 'assistant_reminder_sent',
    'dashboard_preferences_saved', 'operations_alert_dismissed', 'critical_alert_acknowledged',
    'onboarding_started', 'onboarding_step_advanced', 'checklist_completed', 'onboarding_completed',
    'subscription_created', 'trial_started', 'plan_upgraded', 'plan_downgraded',
    'subscription_cancelled', 'subscription_reactivated',
    'self_support_response_sent', 'self_support_draft_generated', 'self_support_escalated',
    'self_support_conversation_closed', 'self_support_feedback_submitted',
    'self_support_knowledge_recommended', 'self_support_conversation_created',
    'quality_alert_created', 'quality_check_resolved', 'quality_finding_ignored',
    'quality_recommendation_accepted', 'quality_recommendation_rejected', 'quality_scan_executed',
    'notification_sent', 'notification_dismissed', 'notification_preferences_saved',
    'notification_digest_generated', 'critical_alert_sent', 'notification_delivery_failed',
    'deployment_scheduled', 'deployment_initiated', 'deployment_completed', 'deployment_failed',
    'deployment_rollback_executed', 'feature_flag_changed', 'rollout_adjusted',
    'health_check_recorded', 'incident_created', 'incident_updated', 'incident_resolved',
    'maintenance_scheduled', 'maintenance_started', 'maintenance_completed',
    'installation_started', 'installation_step_advanced', 'installation_discovery_executed',
    'installation_permissions_approved', 'installation_recommendations_accepted',
    'integrations_connected', 'installation_completed',
    'internal_validation_recorded', 'internal_feedback_submitted',
    'launch_checklist_updated', 'launch_review_submitted',
    'success_health_assessed', 'success_intervention_created',
    'status_event_recorded', 'incident_published', 'incident_updated', 'incident_resolved',
    'maintenance_announced', 'status_configuration_changed', 'status_override_applied',
    'enterprise_setting_changed', 'delegated_admin_assigned', 'approval_chain_updated',
    'approval_override_applied', 'readiness_assessment_recorded', 'enterprise_export_generated',
    'training_assigned', 'training_progress_recorded', 'training_completed',
    'training_assessment_submitted', 'learning_path_updated', 'training_settings_changed'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'learning-training-engine', 'Learning & Training Engine', 'User education paths for Aipify module adoption — distinct from Learning Engine memory.', 'authenticated', 72
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'learning-training-engine' and tenant_id is null);

grant execute on function public.assign_training_path(uuid, uuid, timestamptz) to authenticated;
grant execute on function public.record_training_progress(uuid, uuid, int) to authenticated;
grant execute on function public.submit_training_assessment(uuid, int, boolean) to authenticated;
grant execute on function public.save_learning_training_path(text, text, text, text, text, text) to authenticated;
grant execute on function public.save_learning_training_setting(text, jsonb) to authenticated;
grant execute on function public.list_training_paths() to authenticated;
grant execute on function public.get_training_progress() to authenticated;
grant execute on function public.list_training_assessments(uuid) to authenticated;
grant execute on function public.get_learning_training_engine_dashboard() to authenticated;
grant execute on function public.get_learning_training_engine_card() to authenticated;

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._lte_seed_org_content(v_org_id);
  end loop;
end $$;
