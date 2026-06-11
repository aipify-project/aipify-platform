-- Phase A.40 — Human Oversight Engine
-- Extends Secure AI Actions (A.3), Governance (A.14), and Trust & Action Engine — human accountability layer.

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
    'continuous_improvement_engine', 'human_oversight_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_oversight_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_oversight_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  default_oversight_level text not null default 'approval_required' check (
    default_oversight_level in (
      'advisory_only', 'approval_required', 'limited_automation', 'organization_defined'
    )
  ),
  require_approvals_for jsonb not null default '["medium", "high", "critical"]'::jsonb,
  critical_ai_prohibited boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organization_oversight_settings enable row level security;
revoke all on public.organization_oversight_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_oversight_approvals
-- ---------------------------------------------------------------------------
create table if not exists public.organization_oversight_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  action_type text not null,
  risk_level text not null check (risk_level in ('low', 'medium', 'high', 'critical')),
  requested_by uuid references public.users (id) on delete set null,
  approved_by uuid references public.users (id) on delete set null,
  approval_status text not null default 'pending' check (
    approval_status in ('pending', 'approved', 'rejected', 'expired', 'overridden')
  ),
  approval_reason text,
  explanation jsonb not null default '{}'::jsonb,
  confidence numeric check (confidence is null or (confidence >= 0 and confidence <= 1)),
  ai_initiated boolean not null default false,
  related_request_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists organization_oversight_approvals_org_status_idx
  on public.organization_oversight_approvals (organization_id, approval_status, created_at desc);

create index if not exists organization_oversight_approvals_org_risk_idx
  on public.organization_oversight_approvals (organization_id, risk_level, approval_status);

alter table public.organization_oversight_approvals enable row level security;
revoke all on public.organization_oversight_approvals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_oversight_overrides
-- ---------------------------------------------------------------------------
create table if not exists public.organization_oversight_overrides (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  approval_id uuid references public.organization_oversight_approvals (id) on delete set null,
  overridden_by uuid not null references public.users (id) on delete restrict,
  override_reason text not null,
  business_justification text not null,
  review_required boolean not null default true,
  review_status text not null default 'pending' check (
    review_status in ('pending', 'reviewed', 'escalated')
  ),
  reviewed_by uuid references public.users (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists organization_oversight_overrides_org_idx
  on public.organization_oversight_overrides (organization_id, created_at desc);

alter table public.organization_oversight_overrides enable row level security;
revoke all on public.organization_oversight_overrides from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'human_oversight', v.description
from (values
  ('oversight.view', 'View Oversight', 'View oversight dashboard, pending approvals, and accountability metrics'),
  ('oversight.approve', 'Approve Oversight', 'Grant oversight approval for AI and operational actions'),
  ('oversight.reject', 'Reject Oversight', 'Reject AI recommendations and pending oversight requests'),
  ('oversight.override', 'Override Oversight', 'Apply audited policy overrides with business justification')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'oversight.view'), ('owner', 'oversight.approve'), ('owner', 'oversight.reject'), ('owner', 'oversight.override'),
  ('administrator', 'oversight.view'), ('administrator', 'oversight.approve'), ('administrator', 'oversight.reject'), ('administrator', 'oversight.override'),
  ('manager', 'oversight.view'), ('manager', 'oversight.approve'), ('manager', 'oversight.reject'),
  ('viewer', 'oversight.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 5. Helpers (_hoe_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._hoe_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'oversight_approval',
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

create or replace function public._hoe_ensure_settings(p_organization_id uuid)
returns public.organization_oversight_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_oversight_settings;
begin
  insert into public.organization_oversight_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;
  select * into v_row from public.organization_oversight_settings where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._hoe_ai_prohibited(
  p_risk_level text,
  p_ai_initiated boolean default true
)
returns boolean language plpgsql immutable as $$
begin
  if p_risk_level = 'critical' and coalesce(p_ai_initiated, true) then
    return true;
  end if;
  return false;
end; $$;

create or replace function public._hoe_requires_approval(
  p_organization_id uuid,
  p_risk_level text,
  p_action_type text default null
)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare
  v_settings public.organization_oversight_settings;
  v_gov public.governance_settings;
begin
  v_settings := public._hoe_ensure_settings(p_organization_id);

  if v_settings.default_oversight_level = 'advisory_only' then
    return false;
  end if;

  if v_settings.default_oversight_level = 'limited_automation' and p_risk_level = 'low' then
    return false;
  end if;

  if v_settings.require_approvals_for ? p_risk_level then
    return true;
  end if;

  if p_action_type is not null and v_settings.require_approvals_for ? p_action_type then
    return true;
  end if;

  select * into v_gov from public.governance_settings where organization_id = p_organization_id;
  if found and v_gov.ai_autonomy_level = 'advisory_only' then
    return true;
  end if;

  return p_risk_level in ('medium', 'high', 'critical');
end; $$;

create or replace function public._hoe_seed_approvals(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._hoe_ensure_settings(p_organization_id);

  insert into public.organization_oversight_approvals (
    organization_id, action_type, risk_level, approval_status, explanation, confidence, ai_initiated
  )
  select p_organization_id, v.action_type, v.risk, v.status, v.explanation, v.confidence, v.ai
  from (values
    (
      'support_automation',
      'medium',
      'pending',
      '{"summary":"Automate FAQ routing for recurring delivery questions","reason":"Pattern detected in support triage","expected_impact":"Reduced manual triage","trade_offs":"Requires monitoring for edge cases"}'::jsonb,
      0.82,
      true
    ),
    (
      'knowledge_publish',
      'high',
      'pending',
      '{"summary":"Publish updated refund policy article","reason":"Policy change approved by legal","expected_impact":"Consistent customer guidance","trade_offs":"Must align with Business DNA tone"}'::jsonb,
      0.71,
      true
    ),
    (
      'workflow_recommendation',
      'low',
      'rejected',
      '{"summary":"Auto-close stale support tickets after 14 days","reason":"Efficiency recommendation","expected_impact":"Cleaner queue","trade_offs":"Risk of premature closure"}'::jsonb,
      0.55,
      true
    ),
    (
      'billing_configuration',
      'critical',
      'rejected',
      '{"summary":"Adjust subscription tier automatically","reason":"Usage spike detected","expected_impact":"Revenue optimization","trade_offs":"Critical — AI prohibited"}'::jsonb,
      0.48,
      true
    )
  ) as v(action_type, risk, status, explanation, confidence, ai)
  where not exists (
    select 1 from public.organization_oversight_approvals
    where organization_id = p_organization_id
    limit 1
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Core RPCs
-- ---------------------------------------------------------------------------
create or replace function public.submit_oversight_approval_request(
  p_action_type text,
  p_risk_level text default 'medium',
  p_explanation jsonb default '{}'::jsonb,
  p_confidence numeric default null,
  p_ai_initiated boolean default true,
  p_related_request_id uuid default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_id uuid;
begin
  perform public._irp_require_permission('oversight.view');
  v_org_id := public._mta_require_organization();
  perform public._hoe_ensure_settings(v_org_id);

  if public._hoe_ai_prohibited(p_risk_level, p_ai_initiated) then
    raise exception 'Critical actions are prohibited for AI — human confirmation required';
  end if;

  insert into public.organization_oversight_approvals (
    organization_id, action_type, risk_level, requested_by, approval_status,
    explanation, confidence, ai_initiated, related_request_id
  )
  values (
    v_org_id, p_action_type, p_risk_level, public._mta_app_user_id(), 'pending',
    coalesce(p_explanation, '{}'::jsonb), p_confidence, coalesce(p_ai_initiated, true), p_related_request_id
  )
  returning id into v_id;

  perform public._hoe_log(v_org_id, 'oversight_approval_submitted', 'oversight_approval', v_id,
    jsonb_build_object('action_type', p_action_type, 'risk_level', p_risk_level, 'ai_initiated', p_ai_initiated),
    coalesce(p_ai_initiated, true));

  return jsonb_build_object('id', v_id, 'approval_status', 'pending', 'requires_approval',
    public._hoe_requires_approval(v_org_id, p_risk_level, p_action_type));
end; $$;

create or replace function public.perform_oversight_approval_action(
  p_approval_id uuid,
  p_action text,
  p_reason text default null,
  p_explanation jsonb default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.organization_oversight_approvals;
  v_new_status text;
begin
  v_org_id := public._mta_require_organization();
  select * into v_row from public.organization_oversight_approvals
  where id = p_approval_id and organization_id = v_org_id;

  if not found then raise exception 'Oversight approval not found'; end if;
  if v_row.approval_status not in ('pending', 'overridden') then
    raise exception 'Approval already resolved';
  end if;

  if public._hoe_ai_prohibited(v_row.risk_level, v_row.ai_initiated) and p_action = 'approve' then
    raise exception 'Critical AI actions cannot be approved — human-only execution required';
  end if;

  if p_action = 'approve' then
    perform public._irp_require_permission('oversight.approve');
    if not public._irp_can_approve_risk(v_row.risk_level, v_org_id) and v_row.risk_level <> 'critical' then
      raise exception 'Insufficient role to approve % risk action', v_row.risk_level;
    end if;
    if v_row.risk_level = 'critical' and not public._irp_has_permission('oversight.override', v_org_id) then
      raise exception 'Critical confirmations require oversight.override permission';
    end if;
    v_new_status := 'approved';
    perform public._hoe_log(v_org_id, 'oversight_approval_granted', 'oversight_approval', p_approval_id,
      jsonb_build_object('action_type', v_row.action_type, 'risk_level', v_row.risk_level), v_row.ai_initiated);
  elsif p_action = 'reject' then
    perform public._irp_require_permission('oversight.reject');
    v_new_status := 'rejected';
    perform public._hoe_log(v_org_id, 'oversight_approval_rejected', 'oversight_approval', p_approval_id,
      jsonb_build_object('action_type', v_row.action_type, 'reason', coalesce(p_reason, 'Rejected')), v_row.ai_initiated);
  elsif p_action = 'update_rationale' then
    perform public._irp_require_permission('oversight.approve');
    update public.organization_oversight_approvals
    set explanation = coalesce(p_explanation, explanation),
        approval_reason = coalesce(p_reason, approval_reason),
        updated_at = now()
    where id = p_approval_id;
    perform public._hoe_log(v_org_id, 'oversight_rationale_updated', 'oversight_approval', p_approval_id,
      jsonb_build_object('action_type', v_row.action_type));
    return jsonb_build_object('id', p_approval_id, 'approval_status', v_row.approval_status, 'updated', true);
  else
    raise exception 'Unknown oversight action: %', p_action;
  end if;

  update public.organization_oversight_approvals
  set approval_status = v_new_status,
      approved_by = public._mta_app_user_id(),
      approval_reason = coalesce(p_reason, approval_reason),
      explanation = case when p_explanation is not null then p_explanation else explanation end,
      resolved_at = now(),
      updated_at = now()
  where id = p_approval_id;

  return jsonb_build_object('id', p_approval_id, 'approval_status', v_new_status);
end; $$;

create or replace function public.apply_oversight_override(
  p_approval_id uuid,
  p_override_reason text,
  p_business_justification text,
  p_review_required boolean default true
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_approval public.organization_oversight_approvals;
  v_override_id uuid;
begin
  perform public._irp_require_permission('oversight.override');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  select * into v_approval from public.organization_oversight_approvals
  where id = p_approval_id and organization_id = v_org_id;

  if not found then raise exception 'Oversight approval not found'; end if;

  if v_approval.risk_level = 'critical' and v_approval.ai_initiated then
    raise exception 'Critical AI actions prohibited — human override must be manual execution, not AI approval';
  end if;

  insert into public.organization_oversight_overrides (
    organization_id, approval_id, overridden_by, override_reason, business_justification, review_required
  )
  values (
    v_org_id, p_approval_id, v_user_id,
    left(trim(p_override_reason), 500),
    left(trim(p_business_justification), 1000),
    coalesce(p_review_required, true)
  )
  returning id into v_override_id;

  update public.organization_oversight_approvals
  set approval_status = 'overridden', approved_by = v_user_id, resolved_at = now(), updated_at = now()
  where id = p_approval_id;

  perform public._hoe_log(v_org_id, 'oversight_override_applied', 'oversight_override', v_override_id,
    jsonb_build_object(
      'approval_id', p_approval_id,
      'action_type', v_approval.action_type,
      'risk_level', v_approval.risk_level,
      'review_required', coalesce(p_review_required, true)
    ));

  return jsonb_build_object('override_id', v_override_id, 'approval_id', p_approval_id, 'status', 'overridden');
end; $$;

create or replace function public.update_oversight_settings(
  p_default_level text default null,
  p_require_approvals_for jsonb default null,
  p_critical_ai_prohibited boolean default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_oversight_settings;
begin
  perform public._irp_require_permission('oversight.approve');
  v_org_id := public._mta_require_organization();
  perform public._hoe_ensure_settings(v_org_id);

  if p_default_level is not null and p_default_level not in (
    'advisory_only', 'approval_required', 'limited_automation', 'organization_defined'
  ) then
    raise exception 'Invalid oversight level';
  end if;

  update public.organization_oversight_settings
  set default_oversight_level = coalesce(p_default_level, default_oversight_level),
      require_approvals_for = coalesce(p_require_approvals_for, require_approvals_for),
      critical_ai_prohibited = coalesce(p_critical_ai_prohibited, critical_ai_prohibited),
      updated_at = now()
  where organization_id = v_org_id
  returning * into v_row;

  perform public._hoe_log(v_org_id, 'oversight_settings_changed', 'oversight_settings', v_row.id,
    jsonb_build_object('default_level', v_row.default_oversight_level));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.list_organization_oversight_approvals(
  p_status text default null,
  p_limit int default 50
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('oversight.view');
  v_org_id := public._mta_require_organization();

  return coalesce((
    select jsonb_agg(row_to_json(a) order by a.created_at desc)
    from public.organization_oversight_approvals a
    where a.organization_id = v_org_id
      and (p_status is null or a.approval_status = p_status)
    limit greatest(1, least(coalesce(p_limit, 50), 100))
  ), '[]'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Dashboard & card RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_human_oversight_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_oversight_settings;
begin
  perform public._irp_require_permission('oversight.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._hoe_ensure_settings(v_org_id);
  perform public._hoe_seed_approvals(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Human oversight ensures AI recommendations remain accountable — humans decide, Aipify explains and prepares.',
    'safety_note', 'Critical actions are prohibited for AI per Trust & Action Engine rules. Overrides require business justification and audit.',
    'principles', jsonb_build_array(
      'Advisory by default when configured — no silent automation',
      'Risk-aligned approvals extending Secure AI Actions and Governance',
      'Critical actions require human confirmation — AI prohibited',
      'Every approval, rejection, and override is auditable',
      'Integrates Governance (A.14), Secure AI Actions (A.3), and Trust Actions'
    ),
    'settings', jsonb_build_object(
      'default_oversight_level', v_settings.default_oversight_level,
      'require_approvals_for', v_settings.require_approvals_for,
      'critical_ai_prohibited', v_settings.critical_ai_prohibited
    ),
    'summary', jsonb_build_object(
      'pending_approvals', coalesce((
        select count(*) from public.organization_oversight_approvals
        where organization_id = v_org_id and approval_status = 'pending'
      ), 0),
      'rejected_recommendations', coalesce((
        select count(*) from public.organization_oversight_approvals
        where organization_id = v_org_id and approval_status = 'rejected'
      ), 0),
      'approved_count', coalesce((
        select count(*) from public.organization_oversight_approvals
        where organization_id = v_org_id and approval_status = 'approved'
      ), 0),
      'override_count', coalesce((
        select count(*) from public.organization_oversight_overrides
        where organization_id = v_org_id
      ), 0),
      'high_risk_pending', coalesce((
        select count(*) from public.organization_oversight_approvals
        where organization_id = v_org_id and approval_status = 'pending'
          and risk_level in ('high', 'critical')
      ), 0),
      'ai_action_pending', coalesce((
        select count(*) from public.ai_action_requests
        where organization_id = v_org_id and status = 'pending'
      ), 0)
    ),
    'accountability_metrics', jsonb_build_object(
      'approval_rate', coalesce((
        select round(
          100.0 * count(*) filter (where approval_status = 'approved')
          / nullif(count(*) filter (where approval_status in ('approved', 'rejected')), 0),
          1
        )
        from public.organization_oversight_approvals where organization_id = v_org_id
      ), 0),
      'override_rate', coalesce((
        select round(
          100.0 * (select count(*) from public.organization_oversight_overrides where organization_id = v_org_id)
          / nullif((select count(*) from public.organization_oversight_approvals where organization_id = v_org_id), 0),
          1
        )
      ), 0),
      'avg_confidence', coalesce((
        select round(avg(confidence)::numeric, 2)
        from public.organization_oversight_approvals
        where organization_id = v_org_id and confidence is not null
      ), 0),
      'critical_blocked', coalesce((
        select count(*) from public.organization_oversight_approvals
        where organization_id = v_org_id and risk_level = 'critical' and approval_status = 'rejected'
      ), 0)
    ),
    'pending_approvals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id,
        'action_type', a.action_type,
        'risk_level', a.risk_level,
        'approval_status', a.approval_status,
        'explanation', a.explanation,
        'confidence', a.confidence,
        'ai_initiated', a.ai_initiated,
        'created_at', a.created_at
      ) order by case a.risk_level when 'critical' then 0 when 'high' then 1 when 'medium' then 2 else 3 end, a.created_at desc)
      from public.organization_oversight_approvals a
      where a.organization_id = v_org_id and a.approval_status = 'pending'
      limit 20
    ), '[]'::jsonb),
    'rejected_recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id,
        'action_type', a.action_type,
        'risk_level', a.risk_level,
        'approval_reason', a.approval_reason,
        'explanation', a.explanation,
        'confidence', a.confidence,
        'resolved_at', a.resolved_at
      ) order by a.resolved_at desc nulls last)
      from public.organization_oversight_approvals a
      where a.organization_id = v_org_id and a.approval_status = 'rejected'
      limit 10
    ), '[]'::jsonb),
    'high_risk_actions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id,
        'action_type', a.action_type,
        'risk_level', a.risk_level,
        'approval_status', a.approval_status,
        'explanation', a.explanation,
        'ai_initiated', a.ai_initiated,
        'created_at', a.created_at
      ) order by a.created_at desc)
      from public.organization_oversight_approvals a
      where a.organization_id = v_org_id and a.risk_level in ('high', 'critical')
      limit 15
    ), '[]'::jsonb),
    'override_trends', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id,
        'approval_id', o.approval_id,
        'override_reason', o.override_reason,
        'business_justification', o.business_justification,
        'review_required', o.review_required,
        'review_status', o.review_status,
        'created_at', o.created_at
      ) order by o.created_at desc)
      from public.organization_oversight_overrides o
      where o.organization_id = v_org_id
      limit 10
    ), '[]'::jsonb),
    'risk_distribution', coalesce((
      select jsonb_agg(jsonb_build_object('risk_level', r.risk_level, 'count', r.cnt))
      from (
        select risk_level, count(*) as cnt
        from public.organization_oversight_approvals
        where organization_id = v_org_id
        group by risk_level
      ) r
    ), '[]'::jsonb),
    'integration_links', jsonb_build_object(
      'secure_ai_actions', '/app/secure-ai-actions',
      'governance', '/app/governance-policy-engine',
      'approvals', '/app/approvals',
      'enterprise_readiness', '/app/enterprise-readiness-engine'
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_human_oversight_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('oversight.view');
  v_org_id := public._mta_require_organization();
  perform public._hoe_ensure_settings(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'pending_approvals', coalesce((
      select count(*) from public.organization_oversight_approvals
      where organization_id = v_org_id and approval_status = 'pending'
    ), 0),
    'high_risk_pending', coalesce((
      select count(*) from public.organization_oversight_approvals
      where organization_id = v_org_id and approval_status = 'pending'
        and risk_level in ('high', 'critical')
    ), 0),
    'philosophy', 'Human accountability for AI recommendations and operational actions.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Audit extension (full list from A.33 + oversight events)
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
    'oversight_settings_changed'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'human-oversight-engine', 'Human Oversight Engine', 'Human accountability for AI recommendations, approvals, and policy overrides.', 'authenticated', 76
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'human-oversight-engine' and tenant_id is null);

grant execute on function public.get_human_oversight_engine_dashboard() to authenticated;
grant execute on function public.get_human_oversight_engine_card() to authenticated;
grant execute on function public.list_organization_oversight_approvals(text, int) to authenticated;
grant execute on function public.submit_oversight_approval_request(text, text, jsonb, numeric, boolean, uuid) to authenticated;
grant execute on function public.perform_oversight_approval_action(uuid, text, text, jsonb) to authenticated;
grant execute on function public.apply_oversight_override(uuid, text, text, boolean) to authenticated;
grant execute on function public.update_oversight_settings(text, jsonb, boolean) to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._hoe_ensure_settings(v_org_id);
    perform public._hoe_seed_approvals(v_org_id);
  end loop;
end $$;
