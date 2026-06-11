-- Phase A.47 — Change Management Engine
-- Extends Deployment & Environment (A.20), Customer Success (A.26), Learning & Training (A.36), Human Oversight (A.40).

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
    'learning_training_engine', 'organizational_memory_engine',
    'enterprise_deployment_device_rollout_engine',
    'innovation_impact_engine', 'compliance_regulatory_readiness_engine',
    'strategic_intelligence_foundation_engine', 'operations_center_foundation_engine',
    'continuous_improvement_engine', 'human_oversight_engine',
    'workflow_orchestration_engine', 'business_packs_foundation_engine',
    'industry_intelligence_foundation_engine', 'change_management_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. change_initiatives
-- ---------------------------------------------------------------------------
create table if not exists public.change_initiatives (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  initiative_name text not null,
  description text,
  change_type text not null check (
    change_type in (
      'new_module_activation', 'workflow_changes', 'governance_updates',
      'role_changes', 'process_improvements', 'deployment_initiatives'
    )
  ),
  owner_user_id uuid references public.users (id) on delete set null,
  status text not null default 'planning' check (
    status in ('planning', 'in_progress', 'completed', 'paused', 'cancelled')
  ),
  target_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists change_initiatives_org_status_idx
  on public.change_initiatives (organization_id, status, created_at desc);

alter table public.change_initiatives enable row level security;
revoke all on public.change_initiatives from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. change_impact_assessments
-- ---------------------------------------------------------------------------
create table if not exists public.change_impact_assessments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  initiative_id uuid not null references public.change_initiatives (id) on delete cascade,
  affected_users jsonb not null default '[]'::jsonb,
  affected_teams jsonb not null default '[]'::jsonb,
  training_requirements jsonb not null default '[]'::jsonb,
  communication_needs jsonb not null default '[]'::jsonb,
  operational_risks jsonb not null default '[]'::jsonb,
  assessed_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists change_impact_assessments_initiative_idx
  on public.change_impact_assessments (initiative_id, created_at desc);

alter table public.change_impact_assessments enable row level security;
revoke all on public.change_impact_assessments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. change_communication_plans
-- ---------------------------------------------------------------------------
create table if not exists public.change_communication_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  initiative_id uuid not null references public.change_initiatives (id) on delete cascade,
  communication_type text not null check (
    communication_type in (
      'stakeholder_announcement', 'rollout_message', 'reminder', 'completion_update'
    )
  ),
  subject text not null,
  message_summary text,
  audience jsonb not null default '{}'::jsonb,
  scheduled_at timestamptz,
  released_at timestamptz,
  status text not null default 'draft' check (
    status in ('draft', 'scheduled', 'released', 'cancelled')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists change_communication_plans_initiative_idx
  on public.change_communication_plans (initiative_id, status, created_at desc);

alter table public.change_communication_plans enable row level security;
revoke all on public.change_communication_plans from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. change_adoption_metrics
-- ---------------------------------------------------------------------------
create table if not exists public.change_adoption_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  initiative_id uuid not null references public.change_initiatives (id) on delete cascade,
  metric_type text not null check (
    metric_type in (
      'engagement', 'workflow_utilization', 'training_completion',
      'recommendation_acceptance', 'outcome'
    )
  ),
  metric_value numeric not null default 0,
  metric_metadata jsonb not null default '{}'::jsonb,
  recorded_at timestamptz not null default now(),
  recorded_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists change_adoption_metrics_initiative_idx
  on public.change_adoption_metrics (initiative_id, metric_type, recorded_at desc);

alter table public.change_adoption_metrics enable row level security;
revoke all on public.change_adoption_metrics from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. change_training_links (metadata-only hook to Learning & Training A.36)
-- ---------------------------------------------------------------------------
create table if not exists public.change_training_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  initiative_id uuid not null references public.change_initiatives (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  learning_path_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  assigned_by uuid references public.users (id) on delete set null,
  assigned_at timestamptz not null default now()
);

create index if not exists change_training_links_initiative_idx
  on public.change_training_links (initiative_id, assigned_at desc);

alter table public.change_training_links enable row level security;
revoke all on public.change_training_links from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. change_milestones
-- ---------------------------------------------------------------------------
create table if not exists public.change_milestones (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  initiative_id uuid not null references public.change_initiatives (id) on delete cascade,
  milestone_name text not null,
  milestone_order int not null default 0,
  status text not null default 'pending' check (status in ('pending', 'completed')),
  completed_at timestamptz,
  completed_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists change_milestones_initiative_idx
  on public.change_milestones (initiative_id, milestone_order);

alter table public.change_milestones enable row level security;
revoke all on public.change_milestones from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'change_management', v.description
from (values
  ('changes.view', 'View Changes', 'View change initiatives, impact assessments, and adoption metrics'),
  ('changes.manage', 'Manage Changes', 'Create and manage change initiatives and milestones'),
  ('changes.communicate', 'Communicate Changes', 'Create and release change communication plans'),
  ('changes.review', 'Review Changes', 'Record impact assessments and adoption metrics')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'changes.view'), ('owner', 'changes.manage'), ('owner', 'changes.communicate'), ('owner', 'changes.review'),
  ('administrator', 'changes.view'), ('administrator', 'changes.manage'), ('administrator', 'changes.communicate'), ('administrator', 'changes.review'),
  ('manager', 'changes.view'), ('manager', 'changes.manage'), ('manager', 'changes.communicate'), ('manager', 'changes.review'),
  ('support_agent', 'changes.view'),
  ('viewer', 'changes.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 8. Helpers (_cme_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._cme_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'change_initiative',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._cme_learning_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'user_learning_progress' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'active_assignments', coalesce((
      select count(*) from public.user_learning_progress
      where organization_id = p_organization_id and status in ('not_started', 'in_progress')
    ), 0),
    'completed', coalesce((
      select count(*) from public.user_learning_progress
      where organization_id = p_organization_id and status = 'completed'
    ), 0)
  );
end; $$;

create or replace function public._cme_deployment_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'deployment_schedules' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'scheduled', coalesce((
      select count(*) from public.deployment_schedules
      where organization_id = p_organization_id and status in ('scheduled', 'in_progress')
    ), 0),
    'completed', coalesce((
      select count(*) from public.deployment_schedules
      where organization_id = p_organization_id and status = 'completed'
    ), 0)
  );
end; $$;

create or replace function public._cme_customer_success_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'customer_success_health_scores' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'latest_score', coalesce((
      select score from public.customer_success_health_scores
      where organization_id = p_organization_id
      order by assessed_at desc limit 1
    ), 0),
    'interventions', coalesce((
      select count(*) from public.customer_success_interventions
      where organization_id = p_organization_id and status in ('open', 'in_progress')
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._cme_seed_initiatives(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_init_id uuid;
begin
  if exists (select 1 from public.change_initiatives where organization_id = p_organization_id limit 1) then
    return;
  end if;

  insert into public.change_initiatives (
    organization_id, initiative_name, description, change_type, status, target_date
  )
  values (
    p_organization_id,
    'Support AI module rollout',
    'Activate Support AI with guided onboarding and team training.',
    'new_module_activation',
    'planning',
    (current_date + interval '30 days')::date
  )
  returning id into v_init_id;

  insert into public.change_impact_assessments (
    organization_id, initiative_id, affected_teams, training_requirements,
    communication_needs, operational_risks
  )
  values (
    p_organization_id, v_init_id,
    '["support", "operations"]'::jsonb,
    '[{"path_key": "support_ai_basics", "required": true}]'::jsonb,
    '[{"type": "stakeholder_announcement", "audience": "all_staff"}]'::jsonb,
    '[{"risk": "Low initial adoption", "severity": "medium", "mitigation": "Assign training before go-live"}]'::jsonb
  );

  insert into public.change_milestones (organization_id, initiative_id, milestone_name, milestone_order, status)
  values
    (p_organization_id, v_init_id, 'Impact assessment complete', 1, 'completed'),
    (p_organization_id, v_init_id, 'Communication plan approved', 2, 'pending'),
    (p_organization_id, v_init_id, 'Training assigned', 3, 'pending'),
    (p_organization_id, v_init_id, 'Go-live and adoption review', 4, 'pending');

  insert into public.change_communication_plans (
    organization_id, initiative_id, communication_type, subject, message_summary, audience, status
  )
  values (
    p_organization_id, v_init_id, 'stakeholder_announcement',
    'Support AI rollout planned',
    'We are preparing to activate Support AI. Training and communication will follow a structured plan.',
    '{"teams": ["support", "operations"]}'::jsonb,
    'draft'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_change_initiative(
  p_initiative_name text,
  p_change_type text,
  p_description text default null,
  p_owner_user_id uuid default null,
  p_target_date date default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.change_initiatives; v_user_id uuid;
begin
  perform public._irp_require_permission('changes.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if coalesce(trim(p_initiative_name), '') = '' then
    raise exception 'Initiative name required';
  end if;

  insert into public.change_initiatives (
    organization_id, initiative_name, description, change_type, owner_user_id, target_date
  )
  values (
    v_org_id, left(trim(p_initiative_name), 200), left(coalesce(p_description, ''), 2000),
    p_change_type, coalesce(p_owner_user_id, v_user_id), p_target_date
  )
  returning * into v_row;

  perform public._cme_log(
    v_org_id, 'change_initiative_created', 'change_initiative', v_row.id,
    jsonb_build_object('initiative_name', v_row.initiative_name, 'change_type', v_row.change_type)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.update_change_initiative_status(
  p_initiative_id uuid,
  p_status text
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.change_initiatives;
begin
  perform public._irp_require_permission('changes.manage');
  v_org_id := public._mta_require_organization();

  update public.change_initiatives
  set status = p_status, updated_at = now()
  where id = p_initiative_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Change initiative not found'; end if;

  perform public._cme_log(
    v_org_id, 'change_initiative_status_updated', 'change_initiative', v_row.id,
    jsonb_build_object('status', p_status)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.record_change_impact_assessment(
  p_initiative_id uuid,
  p_affected_users jsonb default '[]'::jsonb,
  p_affected_teams jsonb default '[]'::jsonb,
  p_training_requirements jsonb default '[]'::jsonb,
  p_communication_needs jsonb default '[]'::jsonb,
  p_operational_risks jsonb default '[]'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.change_impact_assessments; v_user_id uuid;
begin
  perform public._irp_require_permission('changes.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if not exists (
    select 1 from public.change_initiatives
    where id = p_initiative_id and organization_id = v_org_id
  ) then
    raise exception 'Change initiative not found';
  end if;

  insert into public.change_impact_assessments (
    organization_id, initiative_id, affected_users, affected_teams,
    training_requirements, communication_needs, operational_risks, assessed_by
  )
  values (
    v_org_id, p_initiative_id,
    coalesce(p_affected_users, '[]'::jsonb),
    coalesce(p_affected_teams, '[]'::jsonb),
    coalesce(p_training_requirements, '[]'::jsonb),
    coalesce(p_communication_needs, '[]'::jsonb),
    coalesce(p_operational_risks, '[]'::jsonb),
    v_user_id
  )
  returning * into v_row;

  perform public._cme_log(
    v_org_id, 'change_impact_assessed', 'change_impact_assessment', v_row.id,
    jsonb_build_object('initiative_id', p_initiative_id)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.create_change_communication_plan(
  p_initiative_id uuid,
  p_communication_type text,
  p_subject text,
  p_message_summary text default null,
  p_audience jsonb default '{}'::jsonb,
  p_scheduled_at timestamptz default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.change_communication_plans;
begin
  perform public._irp_require_permission('changes.communicate');
  v_org_id := public._mta_require_organization();

  if coalesce(trim(p_subject), '') = '' then raise exception 'Subject required'; end if;

  if not exists (
    select 1 from public.change_initiatives
    where id = p_initiative_id and organization_id = v_org_id
  ) then
    raise exception 'Change initiative not found';
  end if;

  insert into public.change_communication_plans (
    organization_id, initiative_id, communication_type, subject, message_summary,
    audience, scheduled_at, status
  )
  values (
    v_org_id, p_initiative_id, p_communication_type, left(trim(p_subject), 200),
    left(coalesce(p_message_summary, ''), 2000),
    coalesce(p_audience, '{}'::jsonb),
    p_scheduled_at,
    case when p_scheduled_at is not null then 'scheduled' else 'draft' end
  )
  returning * into v_row;

  perform public._cme_log(
    v_org_id, 'change_communication_plan_created', 'change_communication_plan', v_row.id,
    jsonb_build_object('initiative_id', p_initiative_id, 'communication_type', p_communication_type)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.release_change_communication(p_plan_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.change_communication_plans;
begin
  perform public._irp_require_permission('changes.communicate');
  v_org_id := public._mta_require_organization();

  update public.change_communication_plans
  set status = 'released', released_at = now(), updated_at = now()
  where id = p_plan_id and organization_id = v_org_id and status in ('draft', 'scheduled')
  returning * into v_row;

  if v_row.id is null then raise exception 'Communication plan not found or already released'; end if;

  perform public._cme_log(
    v_org_id, 'change_communication_released', 'change_communication_plan', v_row.id,
    jsonb_build_object('initiative_id', v_row.initiative_id, 'communication_type', v_row.communication_type)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.assign_change_training(
  p_initiative_id uuid,
  p_user_id uuid,
  p_learning_path_id uuid default null,
  p_due_at timestamptz default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_assigner uuid;
  v_link public.change_training_links;
  v_training jsonb;
begin
  perform public._irp_require_permission('changes.manage');
  v_org_id := public._mta_require_organization();
  v_assigner := public._mta_app_user_id();

  if not exists (
    select 1 from public.change_initiatives
    where id = p_initiative_id and organization_id = v_org_id
  ) then
    raise exception 'Change initiative not found';
  end if;

  insert into public.change_training_links (
    organization_id, initiative_id, user_id, learning_path_id, assigned_by,
    metadata
  )
  values (
    v_org_id, p_initiative_id, p_user_id, p_learning_path_id, v_assigner,
    jsonb_build_object('due_at', p_due_at, 'source', 'change_management_engine')
  )
  returning * into v_link;

  if p_learning_path_id is not null
    and exists (select 1 from pg_proc where proname = 'assign_training_path') then
    v_training := public.assign_training_path(p_user_id, p_learning_path_id, p_due_at);
  else
    v_training := jsonb_build_object('linked', true, 'metadata_only', p_learning_path_id is null);
  end if;

  perform public._cme_log(
    v_org_id, 'change_training_assigned', 'change_training_link', v_link.id,
    jsonb_build_object('initiative_id', p_initiative_id, 'user_id', p_user_id, 'learning_path_id', p_learning_path_id)
  );

  return jsonb_build_object('link', row_to_json(v_link)::jsonb, 'training', v_training);
end; $$;

create or replace function public.record_adoption_metrics(
  p_initiative_id uuid,
  p_metric_type text,
  p_metric_value numeric default 0,
  p_metric_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.change_adoption_metrics; v_user_id uuid;
begin
  perform public._irp_require_permission('changes.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if not exists (
    select 1 from public.change_initiatives
    where id = p_initiative_id and organization_id = v_org_id
  ) then
    raise exception 'Change initiative not found';
  end if;

  insert into public.change_adoption_metrics (
    organization_id, initiative_id, metric_type, metric_value, metric_metadata, recorded_by
  )
  values (
    v_org_id, p_initiative_id, p_metric_type, coalesce(p_metric_value, 0),
    coalesce(p_metric_metadata, '{}'::jsonb), v_user_id
  )
  returning * into v_row;

  perform public._cme_log(
    v_org_id, 'change_adoption_metric_recorded', 'change_adoption_metric', v_row.id,
    jsonb_build_object('initiative_id', p_initiative_id, 'metric_type', p_metric_type, 'metric_value', p_metric_value)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.complete_change_milestone(p_milestone_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.change_milestones; v_user_id uuid;
begin
  perform public._irp_require_permission('changes.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.change_milestones
  set status = 'completed', completed_at = now(), completed_by = v_user_id, updated_at = now()
  where id = p_milestone_id and organization_id = v_org_id and status = 'pending'
  returning * into v_row;

  if v_row.id is null then raise exception 'Milestone not found or already completed'; end if;

  perform public._cme_log(
    v_org_id, 'change_milestone_completed', 'change_milestone', v_row.id,
    jsonb_build_object('initiative_id', v_row.initiative_id, 'milestone_name', v_row.milestone_name)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.get_change_management_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('changes.view');
  v_org_id := public._mta_require_organization();
  perform public._cme_seed_initiatives(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Human-centered adoption — transparent communication, structured implementation, measurable outcomes.',
    'principles', jsonb_build_array(
      'Human-centered adoption',
      'Transparent communication',
      'Structured implementation',
      'Measurable outcomes',
      'Audit-supported accountability'
    ),
    'summary', jsonb_build_object(
      'total_initiatives', coalesce((
        select count(*) from public.change_initiatives where organization_id = v_org_id
      ), 0),
      'active', coalesce((
        select count(*) from public.change_initiatives
        where organization_id = v_org_id and status in ('planning', 'in_progress')
      ), 0),
      'completed', coalesce((
        select count(*) from public.change_initiatives
        where organization_id = v_org_id and status = 'completed'
      ), 0),
      'pending_communications', coalesce((
        select count(*) from public.change_communication_plans
        where organization_id = v_org_id and status in ('draft', 'scheduled')
      ), 0),
      'pending_milestones', coalesce((
        select count(*) from public.change_milestones
        where organization_id = v_org_id and status = 'pending'
      ), 0)
    ),
    'initiatives', coalesce((
      select jsonb_agg(row_to_json(ci) order by ci.created_at desc)
      from public.change_initiatives ci where ci.organization_id = v_org_id
    ), '[]'::jsonb),
    'impact_assessments', coalesce((
      select jsonb_agg(row_to_json(ia) order by ia.created_at desc)
      from public.change_impact_assessments ia where ia.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'communication_plans', coalesce((
      select jsonb_agg(row_to_json(cp) order by cp.created_at desc)
      from public.change_communication_plans cp where cp.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'adoption_metrics', coalesce((
      select jsonb_agg(row_to_json(am) order by am.recorded_at desc)
      from public.change_adoption_metrics am where am.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'milestones', coalesce((
      select jsonb_agg(row_to_json(m) order by m.initiative_id, m.milestone_order)
      from public.change_milestones m where m.organization_id = v_org_id
    ), '[]'::jsonb),
    'integration_notes', jsonb_build_object(
      'deployment_environment', 'Extends Deployment & Environment Management (A.20)',
      'customer_success', 'Aligns adoption metrics with Customer Success (A.26)',
      'learning_training', 'Training assignments hook to Learning & Training (A.36) — metadata only',
      'human_oversight', 'High-impact changes respect Human Oversight (A.40) approval patterns'
    ),
    'integration_summaries', jsonb_build_object(
      'learning', public._cme_learning_summary(v_org_id),
      'deployment', public._cme_deployment_summary(v_org_id),
      'customer_success', public._cme_customer_success_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_change_management_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._cme_seed_initiatives(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Structured change adoption with transparent communication and measurable outcomes.',
    'active_initiatives', coalesce((
      select count(*) from public.change_initiatives
      where organization_id = v_org_id and status in ('planning', 'in_progress')
    ), 0),
    'pending_milestones', coalesce((
      select count(*) from public.change_milestones
      where organization_id = v_org_id and status = 'pending'
    ), 0)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Audit allowlist extension
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
    'memory_record_created', 'memory_record_updated', 'memory_record_archived',
    'memory_record_superseded', 'memory_record_restored', 'memory_visibility_changed',
    'memory_captured', 'decision_register_created', 'memory_review_scheduled',
    'memory_review_completed', 'memory_settings_changed',
    'training_assigned', 'training_progress_recorded', 'training_completed',
    'training_assessment_submitted', 'learning_path_updated', 'training_settings_changed',
    'license_created', 'seat_assigned', 'seat_revoked',
    'device_registered', 'device_revoked',
    'enrollment_token_created', 'enrollment_token_revoked',
    'deployment_invite_sent', 'domain_verification_started',
    'sso_config_updated', 'scim_settings_updated',
    'baseline_changed', 'impact_report_exported',
    'compliance_review_completed', 'compliance_report_exported', 'compliance_status_changed',
    'insight_dismissed', 'strategic_export_generated', 'insight_status_changed',
    'operations_event_acknowledged', 'operations_event_assigned', 'operations_event_escalated',
    'operations_event_resolved', 'operations_event_dismissed',
    'improvement_approved', 'improvement_dismissed', 'improvement_implemented',
    'improvement_feedback_submitted', 'improvement_outcome_reviewed',
    'oversight_approval_submitted', 'oversight_approval_granted', 'oversight_approval_rejected',
    'oversight_override_applied', 'oversight_critical_confirmed', 'oversight_rationale_updated',
    'oversight_settings_changed',
    'business_pack_activated', 'business_pack_customized', 'business_pack_update_acknowledged',
    'workflow_created', 'workflow_status_changed', 'workflow_executed',
    'workflow_template_applied', 'workflow_step_approval_requested', 'workflow_step_approved',
    'workflow_step_rejected', 'workflow_escalated',
    'industry_profile_assigned', 'industry_insight_overridden', 'industry_insights_toggled',
    'industry_terminology_updated', 'industry_priorities_updated', 'industry_insights_exported',
    'change_initiative_created', 'change_initiative_status_updated', 'change_impact_assessed',
    'change_communication_plan_created', 'change_communication_released',
    'change_training_assigned', 'change_adoption_metric_recorded', 'change_milestone_completed'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'change-management-engine', 'Change Management Engine', 'Human-centered change adoption with transparent communication and measurable outcomes.', 'authenticated', 79
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'change-management-engine' and tenant_id is null);

grant execute on function public.create_change_initiative(text, text, text, uuid, date) to authenticated;
grant execute on function public.update_change_initiative_status(uuid, text) to authenticated;
grant execute on function public.record_change_impact_assessment(uuid, jsonb, jsonb, jsonb, jsonb, jsonb) to authenticated;
grant execute on function public.create_change_communication_plan(uuid, text, text, text, jsonb, timestamptz) to authenticated;
grant execute on function public.release_change_communication(uuid) to authenticated;
grant execute on function public.assign_change_training(uuid, uuid, uuid, timestamptz) to authenticated;
grant execute on function public.record_adoption_metrics(uuid, text, numeric, jsonb) to authenticated;
grant execute on function public.complete_change_milestone(uuid) to authenticated;
grant execute on function public.get_change_management_engine_dashboard() to authenticated;
grant execute on function public.get_change_management_engine_card() to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._cme_seed_initiatives(v_org_id);
  end loop;
end $$;
