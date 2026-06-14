-- Phase A.42 — Workflow Orchestration Engine
-- Org-scoped human-defined workflows — distinct from platform orchestration (Phase 68).
-- Extends Operations Center (A.32), Human Oversight (A.40), Delegated Trust scaffold (A.41).

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
    'workflow_orchestration_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_workflows
-- ---------------------------------------------------------------------------
create table if not exists public.organization_workflows (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workflow_name text not null,
  description text,
  category text not null default 'operations' check (
    category in ('support', 'onboarding', 'incident', 'knowledge', 'risk', 'operations', 'governance')
  ),
  status text not null default 'draft' check (status in ('draft', 'active', 'paused', 'archived')),
  trust_level text not null default 'standard' check (
    trust_level in ('advisory', 'standard', 'elevated', 'delegated')
  ),
  created_by uuid references public.users (id) on delete set null,
  source_template_key text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_workflows_org_status_idx
  on public.organization_workflows (organization_id, status, category);

alter table public.organization_workflows enable row level security;
revoke all on public.organization_workflows from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. workflow_steps
-- ---------------------------------------------------------------------------
create table if not exists public.workflow_steps (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.organization_workflows (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  trigger_type text not null check (trigger_type in (
    'support_case_created', 'approval_requested', 'incident_detected',
    'kc_article_updated', 'customer_health_decline', 'overdue_task', 'manual'
  )),
  conditions jsonb not null default '{}'::jsonb,
  action_type text not null check (action_type in (
    'create_task', 'send_notification', 'generate_draft', 'request_approval',
    'escalate', 'update_status'
  )),
  approval_required boolean not null default false,
  approver_role text,
  escalation_rules jsonb not null default '{"timeout_hours":24,"escalate_to":"administrator"}'::jsonb,
  step_order int not null default 1,
  created_at timestamptz not null default now()
);

create index if not exists workflow_steps_workflow_idx
  on public.workflow_steps (workflow_id, step_order);

alter table public.workflow_steps enable row level security;
revoke all on public.workflow_steps from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. workflow_executions
-- ---------------------------------------------------------------------------
create table if not exists public.workflow_executions (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.organization_workflows (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  outcome text not null check (outcome in ('completed', 'failed', 'partial', 'awaiting_approval', 'cancelled')),
  duration_ms int not null default 0,
  approvals_granted int not null default 0,
  escalations_triggered int not null default 0,
  trigger_type text,
  metadata jsonb not null default '{}'::jsonb,
  executed_at timestamptz not null default now()
);

create index if not exists workflow_executions_org_idx
  on public.workflow_executions (organization_id, executed_at desc);

alter table public.workflow_executions enable row level security;
revoke all on public.workflow_executions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. workflow_templates (human-selectable catalog — never auto-instantiated)
-- ---------------------------------------------------------------------------
create table if not exists public.workflow_templates (
  id uuid primary key default gen_random_uuid(),
  template_key text not null unique,
  template_name text not null,
  description text not null,
  category text not null,
  default_trust_level text not null default 'standard' check (
    default_trust_level in ('advisory', 'standard', 'elevated', 'delegated')
  ),
  steps jsonb not null default '[]'::jsonb,
  is_system boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.workflow_templates enable row level security;
revoke all on public.workflow_templates from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'workflow_orchestration', v.description
from (values
  ('workflows.view', 'View Workflows', 'View organization workflow orchestration'),
  ('workflows.manage', 'Manage Workflows', 'Create and edit human-defined workflows'),
  ('workflows.approve', 'Approve Workflows', 'Approve workflow steps requiring human oversight'),
  ('workflows.pause', 'Pause Workflows', 'Pause or resume active workflows')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'workflows.view'), ('owner', 'workflows.manage'), ('owner', 'workflows.approve'), ('owner', 'workflows.pause'),
  ('administrator', 'workflows.view'), ('administrator', 'workflows.manage'), ('administrator', 'workflows.approve'), ('administrator', 'workflows.pause'),
  ('manager', 'workflows.view'), ('manager', 'workflows.approve'), ('manager', 'workflows.pause'),
  ('viewer', 'workflows.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_woe_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._woe_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'organization_workflow',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

-- A.41 Delegated Trust scaffold hooks (_dt_ prefix)
create or replace function public._dt_has_delegated_scope(
  p_organization_id uuid,
  p_user_id uuid,
  p_scope text default 'workflows'
)
returns boolean language plpgsql stable security definer set search_path = public as $$
begin
  return exists (
    select 1 from public.enterprise_delegated_admins d
    where d.organization_id = p_organization_id
      and d.user_id = p_user_id
      and (d.scope = p_scope or d.scope = 'all')
  );
end; $$;

create or replace function public._dt_resolve_workflow_trust(
  p_organization_id uuid,
  p_trust_level text,
  p_approver_role text default null
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_delegated_count int;
begin
  select count(*) into v_delegated_count
  from public.enterprise_delegated_admins
  where organization_id = p_organization_id and scope in ('workflows', 'all');

  return jsonb_build_object(
    'trust_level', p_trust_level,
    'approver_role', coalesce(p_approver_role, 'administrator'),
    'delegated_admins_available', coalesce(v_delegated_count, 0),
    'delegated_trust_ready', p_trust_level = 'delegated' and coalesce(v_delegated_count, 0) > 0,
    'scaffold_note', 'A.41 Delegated Trust — full policy engine ships in a future phase'
  );
end; $$;

create or replace function public._woe_emit_operations_event(
  p_organization_id uuid,
  p_title text,
  p_description text default null,
  p_priority text default 'medium'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.operations_events (
    organization_id, source_module, category, priority, title, description, action_required
  )
  values (
    p_organization_id, 'workflow_orchestration_engine', 'governance', p_priority,
    p_title, p_description, true
  );
exception when undefined_table then null;
end; $$;

create or replace function public._woe_request_step_oversight(
  p_organization_id uuid,
  p_workflow_id uuid,
  p_step_id uuid,
  p_action_type text,
  p_risk_level text default 'medium'
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_result jsonb; v_id uuid;
begin
  v_result := public.submit_oversight_approval_request(
    'workflow_step_' || p_action_type,
    p_risk_level,
    jsonb_build_object(
      'summary', 'Workflow step requires human oversight approval',
      'workflow_id', p_workflow_id,
      'step_id', p_step_id,
      'reason', 'Human-defined workflow step with approval_required'
    ),
    null,
    false,
    p_step_id
  );
  v_id := (v_result->>'id')::uuid;
  return v_id;
exception when undefined_function then
  return null;
end; $$;

create or replace function public._woe_seed_templates()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.workflow_templates (template_key, template_name, description, category, default_trust_level, steps)
  select v.key, v.name, v.item_description, v.cat, v.trust, v.steps
  from (values
    (
      'support_escalation',
      'Support Escalation',
      'Route high-priority support cases through triage, notification, and escalation.',
      'support',
      'standard',
      '[
        {"trigger_type":"support_case_created","action_type":"create_task","approval_required":false,"step_order":1},
        {"trigger_type":"support_case_created","action_type":"send_notification","approval_required":false,"step_order":2},
        {"trigger_type":"approval_requested","action_type":"escalate","approval_required":true,"approver_role":"manager","step_order":3}
      ]'::jsonb
    ),
    (
      'new_employee_onboarding',
      'New Employee Onboarding',
      'Coordinate onboarding tasks, knowledge review, and manager approval.',
      'onboarding',
      'standard',
      '[
        {"trigger_type":"manual","action_type":"create_task","approval_required":false,"step_order":1},
        {"trigger_type":"overdue_task","action_type":"send_notification","approval_required":false,"step_order":2},
        {"trigger_type":"kc_article_updated","action_type":"request_approval","approval_required":true,"approver_role":"administrator","step_order":3}
      ]'::jsonb
    ),
    (
      'incident_response',
      'Incident Response',
      'Detect incidents, notify stakeholders, and escalate unresolved issues.',
      'incident',
      'elevated',
      '[
        {"trigger_type":"incident_detected","action_type":"send_notification","approval_required":false,"step_order":1},
        {"trigger_type":"incident_detected","action_type":"create_task","approval_required":false,"step_order":2},
        {"trigger_type":"incident_detected","action_type":"escalate","approval_required":true,"approver_role":"administrator","step_order":3}
      ]'::jsonb
    ),
    (
      'knowledge_review',
      'Knowledge Review',
      'Review Knowledge Center updates with draft generation and approval.',
      'knowledge',
      'standard',
      '[
        {"trigger_type":"kc_article_updated","action_type":"generate_draft","approval_required":false,"step_order":1},
        {"trigger_type":"kc_article_updated","action_type":"request_approval","approval_required":true,"approver_role":"manager","step_order":2},
        {"trigger_type":"approval_requested","action_type":"update_status","approval_required":false,"step_order":3}
      ]'::jsonb
    ),
    (
      'customer_risk_follow_up',
      'Customer Risk Follow-Up',
      'Respond to customer health decline with tasks and executive notification.',
      'risk',
      'elevated',
      '[
        {"trigger_type":"customer_health_decline","action_type":"create_task","approval_required":false,"step_order":1},
        {"trigger_type":"customer_health_decline","action_type":"send_notification","approval_required":false,"step_order":2},
        {"trigger_type":"customer_health_decline","action_type":"request_approval","approval_required":true,"approver_role":"administrator","step_order":3}
      ]'::jsonb
    )
  ) as v(key, name, item_description, cat, trust, steps)
  where not exists (select 1 from public.workflow_templates limit 1);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Core RPCs — human-defined workflows only (no AI auto-creation)
-- ---------------------------------------------------------------------------
create or replace function public.create_organization_workflow(
  p_workflow_name text,
  p_description text default null,
  p_category text default 'operations',
  p_trust_level text default 'standard',
  p_steps jsonb default '[]'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_workflow_id uuid;
  v_step jsonb;
  v_order int := 0;
begin
  perform public._irp_require_permission('workflows.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if trim(coalesce(p_workflow_name, '')) = '' then
    raise exception 'Workflow name is required — human-defined workflows only';
  end if;

  insert into public.organization_workflows (
    organization_id, workflow_name, description, category, status, trust_level, created_by
  )
  values (
    v_org_id, trim(p_workflow_name), p_description, coalesce(p_category, 'operations'),
    'draft', coalesce(p_trust_level, 'standard'), v_user_id
  )
  returning id into v_workflow_id;

  for v_step in select * from jsonb_array_elements(coalesce(p_steps, '[]'::jsonb)) loop
    v_order := v_order + 1;
    insert into public.workflow_steps (
      workflow_id, organization_id, trigger_type, conditions, action_type,
      approval_required, approver_role, escalation_rules, step_order
    )
    values (
      v_workflow_id, v_org_id,
      coalesce(v_step->>'trigger_type', 'manual'),
      coalesce(v_step->'conditions', '{}'::jsonb),
      coalesce(v_step->>'action_type', 'create_task'),
      coalesce((v_step->>'approval_required')::boolean, false),
      v_step->>'approver_role',
      coalesce(v_step->'escalation_rules', '{"timeout_hours":24,"escalate_to":"administrator"}'::jsonb),
      coalesce((v_step->>'step_order')::int, v_order)
    );
  end loop;

  perform public._woe_log(v_org_id, 'workflow_created', 'organization_workflow', v_workflow_id,
    jsonb_build_object('workflow_name', p_workflow_name, 'human_defined', true));

  return jsonb_build_object('id', v_workflow_id, 'status', 'draft');
end; $$;

create or replace function public.create_workflow_from_template(
  p_template_key text,
  p_workflow_name text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_tpl public.workflow_templates;
  v_name text;
  v_result jsonb;
begin
  perform public._irp_require_permission('workflows.manage');
  v_org_id := public._mta_require_organization();

  select * into v_tpl from public.workflow_templates where template_key = p_template_key;
  if not found then raise exception 'Workflow template not found'; end if;

  v_name := coalesce(nullif(trim(p_workflow_name), ''), v_tpl.template_name || ' (copy)');

  v_result := public.create_organization_workflow(
    v_name,
    v_tpl.description,
    v_tpl.category,
    v_tpl.default_trust_level,
    v_tpl.steps
  );

  update public.organization_workflows
  set source_template_key = p_template_key
  where id = (v_result->>'id')::uuid and organization_id = v_org_id;

  perform public._woe_log(v_org_id, 'workflow_from_template_created', 'organization_workflow',
    (v_result->>'id')::uuid,
    jsonb_build_object('template_key', p_template_key, 'human_defined', true));

  return v_result || jsonb_build_object('source_template_key', p_template_key, 'human_defined', true);
end; $$;

create or replace function public.set_organization_workflow_status(
  p_workflow_id uuid,
  p_status text
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  if p_status = 'paused' then
    perform public._irp_require_permission('workflows.pause');
  else
    perform public._irp_require_permission('workflows.manage');
  end if;

  v_org_id := public._mta_require_organization();

  if p_status not in ('draft', 'active', 'paused', 'archived') then
    raise exception 'Invalid workflow status';
  end if;

  update public.organization_workflows
  set status = p_status, updated_at = now()
  where id = p_workflow_id and organization_id = v_org_id;

  if not found then raise exception 'Workflow not found'; end if;

  perform public._woe_log(v_org_id, 'workflow_status_changed', 'organization_workflow', p_workflow_id,
    jsonb_build_object('status', p_status));

  return jsonb_build_object('id', p_workflow_id, 'status', p_status);
end; $$;

create or replace function public.execute_organization_workflow(
  p_workflow_id uuid,
  p_trigger_type text default 'manual'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_workflow public.organization_workflows;
  v_step record;
  v_start timestamptz := clock_timestamp();
  v_duration int;
  v_outcome text := 'completed';
  v_approvals int := 0;
  v_escalations int := 0;
  v_execution_id uuid;
  v_oversight_id uuid;
  v_trust jsonb;
begin
  perform public._irp_require_permission('workflows.manage');
  v_org_id := public._mta_require_organization();

  select * into v_workflow from public.organization_workflows
  where id = p_workflow_id and organization_id = v_org_id;

  if not found then raise exception 'Workflow not found'; end if;
  if v_workflow.status <> 'active' then
    raise exception 'Workflow must be active to execute';
  end if;

  v_trust := public._dt_resolve_workflow_trust(v_org_id, v_workflow.trust_level, null);

  for v_step in
    select * from public.workflow_steps
    where workflow_id = p_workflow_id
    order by step_order
  loop
    if v_step.trigger_type <> 'manual' and v_step.trigger_type <> coalesce(p_trigger_type, 'manual') then
      continue;
    end if;

    if v_step.approval_required then
      perform public._irp_require_permission('workflows.approve');
      v_oversight_id := public._woe_request_step_oversight(
        v_org_id, p_workflow_id, v_step.id, v_step.action_type,
        case v_workflow.trust_level when 'elevated' then 'high' when 'delegated' then 'medium' else 'medium' end
      );
      if v_oversight_id is not null then
        v_approvals := v_approvals + 1;
        v_outcome := 'awaiting_approval';
      end if;
    end if;

    if v_step.action_type = 'escalate' then
      v_escalations := v_escalations + 1;
      perform public._woe_emit_operations_event(
        v_org_id,
        format('Workflow escalation: %s', v_workflow.workflow_name),
        format('Step %s triggered escalation', v_step.step_order),
        'high'
      );
    end if;
  end loop;

  v_duration := extract(epoch from (clock_timestamp() - v_start)) * 1000;

  insert into public.workflow_executions (
    workflow_id, organization_id, outcome, duration_ms,
    approvals_granted, escalations_triggered, trigger_type,
    metadata
  )
  values (
    p_workflow_id, v_org_id, v_outcome, v_duration,
    v_approvals, v_escalations, p_trigger_type,
    jsonb_build_object('trust_context', v_trust, 'human_defined', true)
  )
  returning id into v_execution_id;

  if v_outcome = 'failed' then
    perform public._woe_emit_operations_event(
      v_org_id,
      format('Workflow failed: %s', v_workflow.workflow_name),
      'Review workflow configuration and approval bottlenecks',
      'high'
    );
  end if;

  perform public._woe_log(v_org_id, 'workflow_executed', 'workflow_execution', v_execution_id,
    jsonb_build_object('workflow_id', p_workflow_id, 'outcome', v_outcome));

  return jsonb_build_object(
    'execution_id', v_execution_id,
    'outcome', v_outcome,
    'duration_ms', v_duration,
    'approvals_granted', v_approvals,
    'escalations_triggered', v_escalations
  );
end; $$;

create or replace function public.list_workflow_templates()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._irp_require_permission('workflows.view');
  perform public._woe_seed_templates();

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'template_key', t.template_key,
      'template_name', t.template_name,
      'description', t.description,
      'category', t.category,
      'default_trust_level', t.default_trust_level,
      'step_count', jsonb_array_length(t.steps)
    ) order by t.template_name)
    from public.workflow_templates t
  ), '[]'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Dashboard & card RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_workflow_orchestration_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('workflows.view');
  v_org_id := public._mta_require_organization();
  perform public._woe_seed_templates();

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Human-defined workflow orchestration — organizations design processes; Aipify executes within oversight and trust boundaries.',
    'safety_note', 'Workflows are never auto-created by AI. Templates require explicit human instantiation.',
    'principles', jsonb_build_array(
      'Human-defined workflows only — no silent automation',
      'Role-based approvals via Human Oversight (A.40)',
      'Delegated trust hooks for enterprise approvers (A.41 scaffold)',
      'Operations Center visibility for failures and escalations (A.32)',
      'Full audit trail for create, pause, execute, and approve events'
    ),
    'summary', jsonb_build_object(
      'active_workflows', coalesce((
        select count(*) from public.organization_workflows
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'paused_workflows', coalesce((
        select count(*) from public.organization_workflows
        where organization_id = v_org_id and status = 'paused'
      ), 0),
      'draft_workflows', coalesce((
        select count(*) from public.organization_workflows
        where organization_id = v_org_id and status = 'draft'
      ), 0),
      'total_executions', coalesce((
        select count(*) from public.workflow_executions where organization_id = v_org_id
      ), 0),
      'failed_executions', coalesce((
        select count(*) from public.workflow_executions
        where organization_id = v_org_id and outcome = 'failed'
      ), 0),
      'awaiting_approval', coalesce((
        select count(*) from public.workflow_executions
        where organization_id = v_org_id and outcome = 'awaiting_approval'
      ), 0),
      'approval_bottlenecks', coalesce((
        select count(*) from public.organization_oversight_approvals
        where organization_id = v_org_id
          and approval_status = 'pending'
          and action_type like 'workflow_step_%'
      ), 0)
    ),
    'workflows', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', w.id,
        'workflow_name', w.workflow_name,
        'description', w.description,
        'category', w.category,
        'status', w.status,
        'trust_level', w.trust_level,
        'source_template_key', w.source_template_key,
        'step_count', (select count(*) from public.workflow_steps s where s.workflow_id = w.id),
        'updated_at', w.updated_at
      ) order by w.updated_at desc)
      from public.organization_workflows w
      where w.organization_id = v_org_id and w.status <> 'archived'
    ), '[]'::jsonb),
    'templates', coalesce((
      select jsonb_agg(jsonb_build_object(
        'template_key', t.template_key,
        'template_name', t.template_name,
        'description', t.description,
        'category', t.category,
        'default_trust_level', t.default_trust_level
      ) order by t.template_name)
      from public.workflow_templates t
    ), '[]'::jsonb),
    'recent_executions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id,
        'workflow_id', e.workflow_id,
        'outcome', e.outcome,
        'duration_ms', e.duration_ms,
        'approvals_granted', e.approvals_granted,
        'escalations_triggered', e.escalations_triggered,
        'executed_at', e.executed_at
      ) order by e.executed_at desc)
      from public.workflow_executions e
      where e.organization_id = v_org_id
      limit 15
    ), '[]'::jsonb),
    'integration_links', jsonb_build_object(
      'operations_center', '/app/operations-center-foundation-engine',
      'human_oversight', '/app/human-oversight-engine',
      'enterprise_readiness', '/app/enterprise-readiness-engine',
      'platform_orchestration', '/app/orchestration'
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_workflow_orchestration_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('workflows.view');
  v_org_id := public._mta_require_organization();

  return jsonb_build_object(
    'has_organization', true,
    'active_workflows', coalesce((
      select count(*) from public.organization_workflows
      where organization_id = v_org_id and status = 'active'
    ), 0),
    'approval_bottlenecks', coalesce((
      select count(*) from public.workflow_executions
      where organization_id = v_org_id and outcome = 'awaiting_approval'
    ), 0),
    'philosophy', 'Human-defined workflows with oversight and audit.'
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
    'workflow_created', 'workflow_status_changed', 'workflow_executed',
    'workflow_step_approved', 'workflow_from_template_created'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'workflow-orchestration-engine', 'Workflow Orchestration Engine', 'Human-defined organization workflow orchestration with oversight and audit.', 'authenticated', 77
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'workflow-orchestration-engine' and tenant_id is null);

grant execute on function public.get_workflow_orchestration_engine_dashboard() to authenticated;
grant execute on function public.get_workflow_orchestration_engine_card() to authenticated;
grant execute on function public.list_workflow_templates() to authenticated;
grant execute on function public.create_organization_workflow(text, text, text, text, jsonb) to authenticated;
grant execute on function public.create_workflow_from_template(text, text) to authenticated;
grant execute on function public.set_organization_workflow_status(uuid, text) to authenticated;
grant execute on function public.execute_organization_workflow(uuid, text) to authenticated;

do $$ begin perform public._woe_seed_templates(); end $$;
