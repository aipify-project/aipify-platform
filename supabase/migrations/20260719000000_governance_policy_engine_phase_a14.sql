-- Phase A.14 — Governance & Policy Engine
-- Principle: tenant-aware governance with human oversight for sensitive actions.

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
    'quality_guardian_engine', 'governance_policy_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. governance_settings
-- ---------------------------------------------------------------------------
create table if not exists public.governance_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  ai_autonomy_level text not null default 'approval_required' check (
    ai_autonomy_level in ('advisory_only', 'approval_required', 'limited_automation', 'organization_defined')
  ),
  retention_defaults jsonb not null default '{
    "audit_logs_days": 365,
    "support_cases_days": 180,
    "kc_versions_days": 90,
    "notifications_days": 90,
    "approval_records_days": 365
  }'::jsonb,
  review_cadence_days int not null default 90,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.governance_settings enable row level security;
revoke all on public.governance_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_policies (org-wide — distinct from skill-level action_policies)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  policy_key text not null,
  policy_name text not null,
  description text,
  category text not null check (
    category in (
      'ai_autonomy', 'approval', 'support', 'access', 'knowledge_publishing',
      'integration', 'retention'
    )
  ),
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  configuration jsonb not null default '{}'::jsonb,
  created_by uuid references public.users (id) on delete set null,
  updated_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, policy_key)
);

create index if not exists organization_policies_org_status_idx
  on public.organization_policies (organization_id, status, category);

alter table public.organization_policies enable row level security;
revoke all on public.organization_policies from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. policy_violations
-- ---------------------------------------------------------------------------
create table if not exists public.policy_violations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  policy_id uuid not null references public.organization_policies (id) on delete cascade,
  violation_type text not null,
  severity text not null default 'moderate' check (severity in ('informational', 'moderate', 'high', 'critical')),
  description text not null,
  status text not null default 'open' check (status in ('open', 'acknowledged', 'resolved', 'dismissed')),
  detected_at timestamptz not null default now(),
  acknowledged_at timestamptz,
  acknowledged_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists policy_violations_org_status_idx
  on public.policy_violations (organization_id, status, detected_at desc);

alter table public.policy_violations enable row level security;
revoke all on public.policy_violations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. policy_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.policy_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  policy_id uuid not null references public.organization_policies (id) on delete cascade,
  scheduled_at timestamptz not null,
  owner_user_id uuid references public.users (id) on delete set null,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'overdue', 'cancelled')),
  completed_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists policy_reviews_org_status_idx
  on public.policy_reviews (organization_id, status, scheduled_at);

alter table public.policy_reviews enable row level security;
revoke all on public.policy_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'governance_policy', v.description
from (values
  ('governance.view', 'View Governance', 'View governance policies, violations, and reviews'),
  ('governance.manage', 'Manage Governance', 'Create, update, and archive organization policies'),
  ('governance.review', 'Review Governance', 'Schedule and complete policy reviews'),
  ('governance.approve', 'Approve Governance', 'Acknowledge violations and approve governance overrides')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'governance.view'), ('owner', 'governance.manage'), ('owner', 'governance.review'), ('owner', 'governance.approve'),
  ('administrator', 'governance.view'), ('administrator', 'governance.manage'), ('administrator', 'governance.review'), ('administrator', 'governance.approve'),
  ('manager', 'governance.view'), ('manager', 'governance.review'),
  ('viewer', 'governance.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_gpe_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._gpe_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'organization_policy',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb,
  p_ai_involved boolean default false
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, p_ai_involved, false, null, p_metadata
  );
end; $$;

create or replace function public._gpe_ensure_settings(p_organization_id uuid)
returns public.governance_settings language plpgsql security definer set search_path = public as $$
declare v_row public.governance_settings;
begin
  insert into public.governance_settings (organization_id) values (p_organization_id)
  on conflict (organization_id) do nothing;
  select * into v_row from public.governance_settings where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._gpe_get_policy(
  p_organization_id uuid,
  p_policy_key text
)
returns public.organization_policies language plpgsql stable security definer set search_path = public as $$
declare v_row public.organization_policies;
begin
  select * into v_row
  from public.organization_policies
  where organization_id = p_organization_id and policy_key = p_policy_key;
  return v_row;
end; $$;

create or replace function public._gpe_validate_policy(p_configuration jsonb, p_category text)
returns jsonb language plpgsql immutable as $$
declare v_errors jsonb := '[]'::jsonb;
begin
  if p_category = 'ai_autonomy' then
    if coalesce(p_configuration->>'autonomy_level', '') not in (
      'advisory_only', 'approval_required', 'limited_automation', 'organization_defined'
    ) then
      v_errors := v_errors || jsonb_build_array('Invalid ai_autonomy level');
    end if;
  elsif p_category = 'approval' then
    if coalesce(p_configuration->>'risk_level', '') not in ('low', 'medium', 'high') then
      v_errors := v_errors || jsonb_build_array('Approval policy requires risk_level low|medium|high');
    end if;
    if coalesce(p_configuration->>'required_approvers', '') = '' then
      v_errors := v_errors || jsonb_build_array('Approval policy requires required_approvers');
    end if;
  elsif p_category = 'retention' then
    if coalesce((p_configuration->>'retention_days')::int, 0) < 30 then
      v_errors := v_errors || jsonb_build_array('Retention must be at least 30 days');
    end if;
  end if;

  return jsonb_build_object('valid', jsonb_array_length(v_errors) = 0, 'errors', v_errors);
end; $$;

create or replace function public._gpe_check_approval_requirements(
  p_organization_id uuid,
  p_risk_level text default 'medium',
  p_action_key text default null
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_settings public.governance_settings;
  v_policy public.organization_policies;
  v_policy_key text;
  v_requires_approval boolean := true;
  v_required_approvers text;
  v_escalation_path text;
  v_ai_prohibited boolean := false;
  v_pending int;
begin
  v_settings := public._gpe_ensure_settings(p_organization_id);

  if p_risk_level = 'critical' then
    return jsonb_build_object(
      'requires_approval', true,
      'ai_prohibited', true,
      'required_approvers', 'owner',
      'escalation_path', 'owner',
      'autonomy_level', v_settings.ai_autonomy_level,
      'reason', 'Level 4 critical actions are prohibited for AI'
    );
  end if;

  v_policy_key := 'approval_' || p_risk_level || '_risk';
  v_policy := public._gpe_get_policy(p_organization_id, v_policy_key);

  if v_policy.id is not null and v_policy.status = 'active' then
    v_requires_approval := coalesce((v_policy.configuration->>'approval_required')::boolean, true);
    v_required_approvers := coalesce(v_policy.configuration->>'required_approvers', 'administrator');
    v_escalation_path := coalesce(v_policy.configuration->>'escalation_path', 'owner');
  else
    v_required_approvers := case p_risk_level
      when 'low' then 'manager'
      when 'medium' then 'administrator'
      else 'owner'
    end;
    v_escalation_path := case p_risk_level when 'high' then 'owner' else 'administrator' end;
  end if;

  if v_settings.ai_autonomy_level = 'advisory_only' then
    v_requires_approval := true;
  elsif v_settings.ai_autonomy_level = 'limited_automation' and p_risk_level = 'low' then
    v_requires_approval := false;
  end if;

  if p_risk_level = 'high' then
    v_requires_approval := true;
  end if;

  select count(*) into v_pending
  from public.ai_action_requests
  where organization_id = p_organization_id and status = 'pending' and risk_level = p_risk_level;

  return jsonb_build_object(
    'requires_approval', v_requires_approval,
    'ai_prohibited', v_ai_prohibited,
    'required_approvers', v_required_approvers,
    'escalation_path', v_escalation_path,
    'autonomy_level', v_settings.ai_autonomy_level,
    'pending_approvals', v_pending,
    'action_key', p_action_key,
    'integrates_action_policies', exists (
      select 1 from public.action_policies ap
      where ap.tenant_id = p_organization_id
        and (p_action_key is null or ap.action_name = p_action_key)
        and ap.approval_required = true
      limit 1
    )
  );
end; $$;

create or replace function public._gpe_seed_default_policies(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._gpe_ensure_settings(p_organization_id);

  insert into public.organization_policies (organization_id, policy_key, policy_name, description, category, status, configuration)
  values
    (p_organization_id, 'ai_autonomy_default', 'AI Autonomy Default', 'Default AI autonomy level for the organization', 'ai_autonomy', 'active',
      '{"autonomy_level":"approval_required","human_oversight_required":true}'::jsonb),
    (p_organization_id, 'approval_low_risk', 'Low Risk Approvals', 'Approval requirements for low-risk AI actions', 'approval', 'active',
      '{"risk_level":"low","approval_required":false,"required_approvers":"manager","escalation_path":"administrator"}'::jsonb),
    (p_organization_id, 'approval_medium_risk', 'Medium Risk Approvals', 'Approval requirements for medium-risk AI actions', 'approval', 'active',
      '{"risk_level":"medium","approval_required":true,"required_approvers":"administrator","escalation_path":"owner"}'::jsonb),
    (p_organization_id, 'approval_high_risk', 'High Risk Approvals', 'Approval requirements for high-risk AI actions — never bypassed', 'approval', 'active',
      '{"risk_level":"high","approval_required":true,"required_approvers":"owner","escalation_path":"owner","ai_prohibited":false}'::jsonb),
    (p_organization_id, 'support_escalation', 'Support Escalation Policy', 'When support AI must escalate to humans', 'support', 'active',
      '{"escalate_below_confidence":0.5,"escalate_sensitive_topics":true}'::jsonb),
    (p_organization_id, 'access_admin_sensitive', 'Admin Access Policy', 'Sensitive settings require administrator role', 'access', 'active',
      '{"sensitive_areas":["governance","billing","security"],"minimum_role":"administrator"}'::jsonb),
    (p_organization_id, 'knowledge_publish_review', 'Knowledge Publishing Policy', 'Knowledge articles require review before publish', 'knowledge_publishing', 'active',
      '{"require_review":true,"minimum_reviewers":1}'::jsonb),
    (p_organization_id, 'integration_read_only_first', 'Integration Read-Only First', 'New integrations start read-only until approved', 'integration', 'active',
      '{"default_access":"read_only","require_approval_for_write":true}'::jsonb),
    (p_organization_id, 'retention_audit_logs', 'Audit Log Retention', 'Retention period for audit logs', 'retention', 'active',
      '{"data_type":"audit_logs","retention_days":365}'::jsonb),
    (p_organization_id, 'retention_support_cases', 'Support Case Retention', 'Retention period for support cases', 'retention', 'active',
      '{"data_type":"support_cases","retention_days":180}'::jsonb),
    (p_organization_id, 'retention_kc_versions', 'Knowledge Version Retention', 'Retention period for KC article versions', 'retention', 'active',
      '{"data_type":"kc_versions","retention_days":90}'::jsonb),
    (p_organization_id, 'retention_notifications', 'Notification Retention', 'Retention period for notifications', 'retention', 'active',
      '{"data_type":"notifications","retention_days":90}'::jsonb),
    (p_organization_id, 'retention_approval_records', 'Approval Record Retention', 'Retention period for approval records', 'retention', 'active',
      '{"data_type":"approval_records","retention_days":365}'::jsonb)
  on conflict (organization_id, policy_key) do nothing;
end; $$;

create or replace function public._gpe_record_explanation(
  p_organization_id uuid,
  p_summary text,
  p_confidence text default 'medium',
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.decision_explanations (
    tenant_id, decision_id, decision_type, source_module, summary, confidence_level, rules_applied
  ) values (
    p_organization_id,
    'gpe-' || gen_random_uuid()::text,
    'governance_policy_engine',
    'governance_policy_engine',
    left(p_summary, 500),
    case p_confidence when 'high' then 'high' when 'low' then 'low' else 'medium' end,
    coalesce(p_metadata, '{}'::jsonb)
  );
exception when others then null;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Policy CRUD RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_organization_policies(p_category text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('governance.view');
  v_org_id := public._mta_require_organization();
  perform public._gpe_seed_default_policies(v_org_id);

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', p.id, 'policy_key', p.policy_key, 'policy_name', p.policy_name,
      'description', p.description, 'category', p.category, 'status', p.status,
      'configuration', p.configuration, 'created_at', p.created_at, 'updated_at', p.updated_at
    ) order by p.category, p.policy_name)
    from public.organization_policies p
    where p.organization_id = v_org_id
      and (p_category is null or p.category = p_category)
  ), '[]'::jsonb);
end; $$;

create or replace function public.create_organization_policy(
  p_policy_key text,
  p_policy_name text,
  p_category text,
  p_description text default null,
  p_configuration jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_validation jsonb;
  v_id uuid;
begin
  perform public._irp_require_permission('governance.manage');
  v_org_id := public._mta_require_organization();

  v_validation := public._gpe_validate_policy(p_configuration, p_category);
  if not (v_validation->>'valid')::boolean then
    raise exception 'Invalid policy configuration: %', v_validation->'errors';
  end if;

  insert into public.organization_policies (
    organization_id, policy_key, policy_name, description, category, status, configuration, created_by, updated_by
  ) values (
    v_org_id, p_policy_key, p_policy_name, p_description, p_category, 'draft', p_configuration,
    public._mta_app_user_id(), public._mta_app_user_id()
  ) returning id into v_id;

  perform public._gpe_log(v_org_id, 'policy_created', 'organization_policy', v_id,
    jsonb_build_object('policy_key', p_policy_key, 'category', p_category));

  perform public._gpe_record_explanation(v_org_id,
    'Policy "' || p_policy_name || '" created in draft status.',
    'high', jsonb_build_object('policy_id', v_id, 'policy_key', p_policy_key));

  return jsonb_build_object('policy_id', v_id, 'status', 'draft');
end; $$;

create or replace function public.update_organization_policy(
  p_policy_id uuid,
  p_policy_name text default null,
  p_description text default null,
  p_configuration jsonb default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_policy public.organization_policies;
  v_validation jsonb;
begin
  perform public._irp_require_permission('governance.manage');
  v_org_id := public._mta_require_organization();

  select * into v_policy from public.organization_policies
  where id = p_policy_id and organization_id = v_org_id;
  if v_policy.id is null then raise exception 'Policy not found'; end if;
  if v_policy.status = 'archived' then raise exception 'Cannot update archived policy'; end if;

  if p_configuration is not null then
    v_validation := public._gpe_validate_policy(p_configuration, v_policy.category);
    if not (v_validation->>'valid')::boolean then
      raise exception 'Invalid policy configuration: %', v_validation->'errors';
    end if;
  end if;

  update public.organization_policies set
    policy_name = coalesce(p_policy_name, policy_name),
    description = coalesce(p_description, description),
    configuration = coalesce(p_configuration, configuration),
    updated_by = public._mta_app_user_id(),
    updated_at = now()
  where id = p_policy_id;

  perform public._gpe_log(v_org_id, 'policy_updated', 'organization_policy', p_policy_id,
    jsonb_build_object('policy_key', v_policy.policy_key));

  return jsonb_build_object('policy_id', p_policy_id, 'status', v_policy.status);
end; $$;

create or replace function public.activate_organization_policy(p_policy_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_policy public.organization_policies;
begin
  perform public._irp_require_permission('governance.manage');
  v_org_id := public._mta_require_organization();

  select * into v_policy from public.organization_policies
  where id = p_policy_id and organization_id = v_org_id;
  if v_policy.id is null then raise exception 'Policy not found'; end if;

  update public.organization_policies set
    status = 'active', updated_by = public._mta_app_user_id(), updated_at = now()
  where id = p_policy_id;

  perform public._gpe_log(v_org_id, 'policy_activated', 'organization_policy', p_policy_id,
    jsonb_build_object('policy_key', v_policy.policy_key));

  return jsonb_build_object('policy_id', p_policy_id, 'status', 'active');
end; $$;

create or replace function public.archive_organization_policy(p_policy_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_policy public.organization_policies;
begin
  perform public._irp_require_permission('governance.manage');
  v_org_id := public._mta_require_organization();

  select * into v_policy from public.organization_policies
  where id = p_policy_id and organization_id = v_org_id;
  if v_policy.id is null then raise exception 'Policy not found'; end if;

  update public.organization_policies set
    status = 'archived', updated_by = public._mta_app_user_id(), updated_at = now()
  where id = p_policy_id;

  perform public._gpe_log(v_org_id, 'policy_archived', 'organization_policy', p_policy_id,
    jsonb_build_object('policy_key', v_policy.policy_key));

  return jsonb_build_object('policy_id', p_policy_id, 'status', 'archived');
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Violations & reviews
-- ---------------------------------------------------------------------------
create or replace function public.detect_policy_violations()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_policy public.organization_policies;
  v_pending_high int;
  v_draft_knowledge int;
  v_new_violations int := 0;
begin
  perform public._irp_require_permission('governance.review');
  v_org_id := public._mta_require_organization();
  perform public._gpe_seed_default_policies(v_org_id);

  select count(*) into v_pending_high
  from public.ai_action_requests
  where organization_id = v_org_id and status = 'pending' and risk_level = 'high';

  if v_pending_high > 0 then
    select * into v_policy from public.organization_policies
    where organization_id = v_org_id and policy_key = 'approval_high_risk' limit 1;

    if v_policy.id is not null and not exists (
      select 1 from public.policy_violations
      where organization_id = v_org_id and policy_id = v_policy.id
        and violation_type = 'pending_high_risk_approvals' and status = 'open'
    ) then
      insert into public.policy_violations (
        organization_id, policy_id, violation_type, severity, description
      ) values (
        v_org_id, v_policy.id, 'pending_high_risk_approvals', 'high',
        v_pending_high || ' high-risk AI action(s) awaiting approval beyond policy SLA'
      );
      v_new_violations := v_new_violations + 1;
    end if;
  end if;

  select count(*) into v_draft_knowledge
  from public.knowledge_articles
  where organization_id = v_org_id and status = 'review';

  if v_draft_knowledge > 0 then
    select * into v_policy from public.organization_policies
    where organization_id = v_org_id and policy_key = 'knowledge_publish_review' and status = 'active' limit 1;

    if v_policy.id is not null and coalesce((v_policy.configuration->>'require_review')::boolean, false)
      and not exists (
        select 1 from public.policy_violations
        where organization_id = v_org_id and policy_id = v_policy.id
          and violation_type = 'knowledge_awaiting_review' and status = 'open'
      ) then
      insert into public.policy_violations (
        organization_id, policy_id, violation_type, severity, description
      ) values (
        v_org_id, v_policy.id, 'knowledge_awaiting_review', 'moderate',
        v_draft_knowledge || ' knowledge article(s) awaiting review before publish'
      );
      v_new_violations := v_new_violations + 1;
    end if;
  end if;

  perform public._gpe_log(v_org_id, 'policy_violation_scan', 'organization_policy', null,
    jsonb_build_object('new_violations', v_new_violations), true);

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', v.id, 'policy_id', v.policy_id, 'policy_key', p.policy_key, 'policy_name', p.policy_name,
      'violation_type', v.violation_type, 'severity', v.severity, 'description', v.description,
      'status', v.status, 'detected_at', v.detected_at, 'acknowledged_at', v.acknowledged_at
    ) order by v.detected_at desc)
    from public.policy_violations v
    join public.organization_policies p on p.id = v.policy_id
    where v.organization_id = v_org_id and v.status in ('open', 'acknowledged')
  ), '[]'::jsonb);
end; $$;

create or replace function public.acknowledge_policy_violation(p_violation_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.policy_violations;
begin
  perform public._irp_require_permission('governance.approve');
  v_org_id := public._mta_require_organization();

  select * into v_row from public.policy_violations
  where id = p_violation_id and organization_id = v_org_id;
  if v_row.id is null then raise exception 'Violation not found'; end if;

  update public.policy_violations set
    status = 'acknowledged',
    acknowledged_at = now(),
    acknowledged_by = public._mta_app_user_id()
  where id = p_violation_id;

  perform public._gpe_log(v_org_id, 'policy_violation_acknowledged', 'policy_violation', p_violation_id,
    jsonb_build_object('violation_type', v_row.violation_type));

  return jsonb_build_object('violation_id', p_violation_id, 'status', 'acknowledged');
end; $$;

create or replace function public.schedule_policy_review(
  p_policy_id uuid,
  p_scheduled_at timestamptz default null,
  p_owner_user_id uuid default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.governance_settings;
  v_policy public.organization_policies;
  v_id uuid;
  v_scheduled timestamptz;
begin
  perform public._irp_require_permission('governance.review');
  v_org_id := public._mta_require_organization();
  v_settings := public._gpe_ensure_settings(v_org_id);

  select * into v_policy from public.organization_policies
  where id = p_policy_id and organization_id = v_org_id;
  if v_policy.id is null then raise exception 'Policy not found'; end if;

  v_scheduled := coalesce(p_scheduled_at, now() + (v_settings.review_cadence_days || ' days')::interval);

  insert into public.policy_reviews (
    organization_id, policy_id, scheduled_at, owner_user_id, status
  ) values (
    v_org_id, p_policy_id, v_scheduled, coalesce(p_owner_user_id, public._mta_app_user_id()), 'scheduled'
  ) returning id into v_id;

  perform public._gpe_log(v_org_id, 'policy_review_scheduled', 'policy_review', v_id,
    jsonb_build_object('policy_key', v_policy.policy_key, 'scheduled_at', v_scheduled));

  return jsonb_build_object('review_id', v_id, 'scheduled_at', v_scheduled, 'status', 'scheduled');
end; $$;

create or replace function public.complete_policy_review(
  p_review_id uuid,
  p_notes text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.policy_reviews;
begin
  perform public._irp_require_permission('governance.review');
  v_org_id := public._mta_require_organization();

  select * into v_row from public.policy_reviews
  where id = p_review_id and organization_id = v_org_id;
  if v_row.id is null then raise exception 'Review not found'; end if;

  update public.policy_reviews set
    status = 'completed', completed_at = now(), notes = p_notes
  where id = p_review_id;

  perform public._gpe_log(v_org_id, 'policy_review_completed', 'policy_review', p_review_id, '{}'::jsonb);

  return jsonb_build_object('review_id', p_review_id, 'status', 'completed');
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_governance_policy_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.governance_settings;
  v_pending_approvals int;
begin
  perform public._irp_require_permission('governance.view');
  v_org_id := public._mta_require_organization();
  perform public._gpe_seed_default_policies(v_org_id);
  v_settings := public._gpe_ensure_settings(v_org_id);

  select count(*) into v_pending_approvals
  from public.ai_action_requests where organization_id = v_org_id and status = 'pending';

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Tenant-aware governance with human oversight for sensitive actions, transparent decision-making, and full audit support.',
    'safety_note', 'High and critical risk actions always require human approval. Level 4 critical actions are prohibited for AI.',
    'principles', jsonb_build_array(
      'Tenant-aware governance',
      'Human oversight for sensitive actions',
      'Transparent decision-making',
      'Configurable policies',
      'Full audit support'
    ),
    'settings', jsonb_build_object(
      'ai_autonomy_level', v_settings.ai_autonomy_level,
      'retention_defaults', v_settings.retention_defaults,
      'review_cadence_days', v_settings.review_cadence_days
    ),
    'active_policies', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'policy_key', p.policy_key, 'policy_name', p.policy_name,
        'category', p.category, 'status', p.status, 'configuration', p.configuration
      ) order by p.category, p.policy_name)
      from public.organization_policies p
      where p.organization_id = v_org_id and p.status = 'active'
    ), '[]'::jsonb),
    'policy_violations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', v.id, 'policy_id', v.policy_id, 'policy_name', p.policy_name,
        'violation_type', v.violation_type, 'severity', v.severity,
        'description', v.description, 'status', v.status, 'detected_at', v.detected_at
      ) order by v.detected_at desc)
      from public.policy_violations v
      join public.organization_policies p on p.id = v.policy_id
      where v.organization_id = v_org_id and v.status in ('open', 'acknowledged') limit 15
    ), '[]'::jsonb),
    'upcoming_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'policy_id', r.policy_id, 'policy_name', p.policy_name,
        'scheduled_at', r.scheduled_at, 'status', r.status, 'owner_user_id', r.owner_user_id
      ) order by r.scheduled_at asc)
      from public.policy_reviews r
      join public.organization_policies p on p.id = r.policy_id
      where r.organization_id = v_org_id and r.status in ('scheduled', 'overdue') limit 10
    ), '[]'::jsonb),
    'pending_approvals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'action_key', a.action_key, 'risk_level', a.risk_level,
        'status', a.status, 'created_at', a.created_at
      ) order by a.created_at desc)
      from public.ai_action_requests a
      where a.organization_id = v_org_id and a.status = 'pending' limit 10
    ), '[]'::jsonb),
    'pending_approval_count', v_pending_approvals,
    'approval_requirements', jsonb_build_object(
      'low', public._gpe_check_approval_requirements(v_org_id, 'low'),
      'medium', public._gpe_check_approval_requirements(v_org_id, 'medium'),
      'high', public._gpe_check_approval_requirements(v_org_id, 'high')
    ),
    'governance_recommendations', coalesce((
      select jsonb_agg(rec order by (rec->>'priority')::int)
      from (
        select jsonb_build_object(
          'key', 'review_high_risk_pending',
          'title', 'Review pending high-risk approvals',
          'priority', 1,
          'reason', 'High-risk AI actions require owner approval per governance policy'
        ) as rec
        where v_pending_approvals > 0
        union all
        select jsonb_build_object(
          'key', 'schedule_policy_review',
          'title', 'Schedule quarterly policy review',
          'priority', 2,
          'reason', 'Regular policy reviews maintain governance health'
        ) as rec
        where not exists (
          select 1 from public.policy_reviews
          where organization_id = v_org_id and status = 'scheduled'
            and scheduled_at > now()
        )
        union all
        select jsonb_build_object(
          'key', 'run_violation_scan',
          'title', 'Run policy violation scan',
          'priority', 3,
          'reason', 'Detect drift from active governance policies'
        ) as rec
        where exists (
          select 1 from public.organization_policies
          where organization_id = v_org_id and status = 'active'
        )
      ) s
    ), '[]'::jsonb),
    'policy_categories', jsonb_build_array(
      'ai_autonomy', 'approval', 'support', 'access', 'knowledge_publishing', 'integration', 'retention'
    ),
    'autonomy_levels', jsonb_build_array(
      'advisory_only', 'approval_required', 'limited_automation', 'organization_defined'
    ),
    'integrates_with', jsonb_build_array('action_policies', 'ai_action_requests', 'audit_logs', 'trust_action_engine')
  );
end; $$;

create or replace function public.get_governance_policy_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._gpe_seed_default_policies(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'active_policies', (select count(*) from public.organization_policies where organization_id = v_org_id and status = 'active'),
    'open_violations', (select count(*) from public.policy_violations where organization_id = v_org_id and status = 'open'),
    'pending_approvals', (select count(*) from public.ai_action_requests where organization_id = v_org_id and status = 'pending'),
    'upcoming_reviews', (select count(*) from public.policy_reviews where organization_id = v_org_id and status = 'scheduled' and scheduled_at >= now()),
    'philosophy', 'Configurable governance policies with human oversight.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- Update audit list
create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'support_ai_draft_generated', 'support_escalated', 'support_approval_granted',
    'support_case_created', 'support_case_closed', 'support_case_assigned', 'support_satisfaction_received',
    'integration_created', 'integration_updated', 'integration_disabled', 'integration_connected',
    'integration_credential_rotated', 'integration_sync_executed', 'integration_sync_failed',
    'integration_webhook_received', 'integration_webhook_failed',
    'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_connected', 'integration_removed', 'settings_updated',
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
    'policy_created', 'policy_updated', 'policy_activated', 'policy_archived',
    'policy_violation_scan', 'policy_violation_acknowledged',
    'policy_review_scheduled', 'policy_review_completed', 'governance_override'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._gpe_seed_default_policies(v_org_id);
  end loop;
end $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'governance-policy-engine', 'Governance & Policy Engine', 'Tenant governance policies, violations, reviews, and approval requirements.', 'authenticated', 62
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'governance-policy-engine' and tenant_id is null);

grant execute on function public.get_organization_policies(text) to authenticated;
grant execute on function public.create_organization_policy(text, text, text, text, jsonb) to authenticated;
grant execute on function public.update_organization_policy(uuid, text, text, jsonb) to authenticated;
grant execute on function public.activate_organization_policy(uuid) to authenticated;
grant execute on function public.archive_organization_policy(uuid) to authenticated;
grant execute on function public.detect_policy_violations() to authenticated;
grant execute on function public.acknowledge_policy_violation(uuid) to authenticated;
grant execute on function public.schedule_policy_review(uuid, timestamptz, uuid) to authenticated;
grant execute on function public.complete_policy_review(uuid, text) to authenticated;
grant execute on function public.get_governance_policy_engine_dashboard() to authenticated;
grant execute on function public.get_governance_policy_engine_card() to authenticated;
