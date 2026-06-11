-- Phase A.30 — Enterprise Readiness Engine
-- Tenant-aware enterprise controls, governance, delegated admin, and deployment readiness hooks.

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
    'aipify_status_transparency_engine', 'enterprise_readiness_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_enterprise_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_enterprise_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  setting_key text not null,
  setting_value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, setting_key)
);

create index if not exists organization_enterprise_settings_org_idx
  on public.organization_enterprise_settings (organization_id, setting_key);

alter table public.organization_enterprise_settings enable row level security;
revoke all on public.organization_enterprise_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. enterprise_delegated_admins
-- ---------------------------------------------------------------------------
create table if not exists public.enterprise_delegated_admins (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  scope text not null default 'team' check (scope in ('team', 'department', 'division', 'region')),
  permissions jsonb not null default '[]'::jsonb,
  assigned_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (organization_id, user_id, scope)
);

create index if not exists enterprise_delegated_admins_org_idx
  on public.enterprise_delegated_admins (organization_id, scope);

alter table public.enterprise_delegated_admins enable row level security;
revoke all on public.enterprise_delegated_admins from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. enterprise_approval_chains
-- ---------------------------------------------------------------------------
create table if not exists public.enterprise_approval_chains (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  chain_key text not null,
  chain_title text not null,
  chain_type text not null default 'department' check (
    chain_type in ('department', 'executive', 'emergency_override', 'integration', 'deployment')
  ),
  steps jsonb not null default '[]'::jsonb,
  emergency_override_config jsonb not null default '{}'::jsonb,
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, chain_key)
);

alter table public.enterprise_approval_chains enable row level security;
revoke all on public.enterprise_approval_chains from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. enterprise_onboarding_milestones
-- ---------------------------------------------------------------------------
create table if not exists public.enterprise_onboarding_milestones (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  milestone_key text not null,
  milestone_title text not null,
  category text not null default 'implementation' check (
    category in ('implementation', 'stakeholders', 'training', 'security', 'deployment')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'in_progress', 'completed', 'blocked')
  ),
  stakeholders jsonb not null default '[]'::jsonb,
  training_readiness_score int not null default 0 check (training_readiness_score between 0 and 100),
  target_at timestamptz,
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, milestone_key)
);

alter table public.enterprise_onboarding_milestones enable row level security;
revoke all on public.enterprise_onboarding_milestones from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. enterprise_readiness_assessments (ERE health overview — extends Phase 92 when present)
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_tables where schemaname = 'public' and tablename = 'enterprise_readiness_assessments'
  ) then
    create table public.enterprise_readiness_assessments (
      id uuid primary key default gen_random_uuid(),
      organization_id uuid not null references public.organizations (id) on delete cascade,
      assessment_dimension text not null check (
        assessment_dimension in (
          'governance', 'security', 'integrations', 'operations', 'deployment',
          'infrastructure_maturity', 'security_requirements', 'governance_readiness',
          'change_management', 'data_classification', 'integration_complexity', 'stakeholder_alignment'
        )
      ),
      score int not null default 0 check (score between 0 and 100),
      status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed')),
      health_overview jsonb not null default '{}'::jsonb,
      assessed_at timestamptz,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      unique (organization_id, assessment_dimension)
    );
  else
    alter table public.enterprise_readiness_assessments
      add column if not exists organization_id uuid references public.organizations (id) on delete cascade;
    alter table public.enterprise_readiness_assessments
      add column if not exists assessment_dimension text;
    alter table public.enterprise_readiness_assessments
      add column if not exists health_overview jsonb not null default '{}'::jsonb;
    alter table public.enterprise_readiness_assessments
      add column if not exists updated_at timestamptz not null default now();

    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'enterprise_readiness_assessments' and column_name = 'tenant_id'
    ) then
      update public.enterprise_readiness_assessments
      set organization_id = tenant_id
      where organization_id is null;
    end if;

    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'enterprise_readiness_assessments' and column_name = 'assessment_area'
    ) then
      update public.enterprise_readiness_assessments
      set assessment_dimension = assessment_area
      where assessment_dimension is null and assessment_area is not null;
    end if;
  end if;
end $$;

alter table public.enterprise_readiness_assessments enable row level security;
revoke all on public.enterprise_readiness_assessments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'enterprise_readiness', v.description
from (values
  ('enterprise.view', 'View Enterprise Readiness', 'View enterprise health and readiness dashboards'),
  ('enterprise.manage', 'Manage Enterprise Readiness', 'Manage enterprise settings, chains, and milestones'),
  ('enterprise.export', 'Export Enterprise Reports', 'Export metadata-only enterprise reports'),
  ('enterprise.override', 'Enterprise Approval Override', 'Apply emergency approval overrides with audit')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'enterprise.view'), ('owner', 'enterprise.manage'), ('owner', 'enterprise.export'), ('owner', 'enterprise.override'),
  ('administrator', 'enterprise.view'), ('administrator', 'enterprise.manage'), ('administrator', 'enterprise.export'),
  ('manager', 'enterprise.view'), ('manager', 'enterprise.export'),
  ('viewer', 'enterprise.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Helpers (_ere_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._ere_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'enterprise_readiness',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._ere_health_status(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'excellent'
    when p_score >= 75 then 'healthy'
    when p_score >= 55 then 'at_risk'
    else 'critical'
  end;
$$;

create or replace function public._ere_default_setting(p_key text)
returns jsonb language sql immutable as $$
  select case p_key
    when 'deployment_model' then '{"model":"multi_tenant_saas","dedicated_ready":false,"hybrid_ready":false,"on_prem_ready":false}'::jsonb
    when 'governance_posture' then '{"delegated_admin_enabled":true,"approval_chains_enabled":true,"audit_retention_days":365}'::jsonb
    when 'integration_landscape' then '{"connected_count":0,"pending_count":0,"enterprise_connectors":[]}'::jsonb
    when 'security_posture' then '{"mfa_required":false,"sso_enabled":false,"score":75}'::jsonb
    else '{}'::jsonb
  end;
$$;

create or replace function public._ere_ensure_settings(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_enterprise_settings (organization_id, setting_key, setting_value)
  select p_organization_id, v.key, public._ere_default_setting(v.key)
  from (values
    ('deployment_model'), ('governance_posture'), ('integration_landscape'), ('security_posture')
  ) as v(key)
  on conflict (organization_id, setting_key) do nothing;
end; $$;

create or replace function public._ere_seed_org_content(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ere_ensure_settings(p_organization_id);

  insert into public.enterprise_approval_chains (
    organization_id, chain_key, chain_title, chain_type, steps, emergency_override_config
  )
  select p_organization_id, v.key, v.title, v.type, v.steps::jsonb, v.override::jsonb
  from (values
    ('department_standard', 'Department Approval Chain', 'department',
      '[{"step":1,"role":"manager","label":"Department lead"},{"step":2,"role":"administrator","label":"Administrator"}]',
      '{"enabled":false,"requires_owner":true}'),
    ('executive_signoff', 'Executive Sign-off Chain', 'executive',
      '[{"step":1,"role":"manager","label":"Operations lead"},{"step":2,"role":"owner","label":"Executive owner"}]',
      '{"enabled":true,"requires_dual_approval":true}'),
    ('emergency_override', 'Emergency Override Chain', 'emergency_override',
      '[{"step":1,"role":"owner","label":"Owner override with audit"}]',
      '{"enabled":true,"audit_required":true,"ai_prohibited":true}')
  ) as v(key, title, type, steps, override)
  on conflict (organization_id, chain_key) do nothing;

  insert into public.enterprise_onboarding_milestones (
    organization_id, milestone_key, milestone_title, category, status, stakeholders, training_readiness_score
  )
  select p_organization_id, v.key, v.title, v.cat, v.status, v.stakeholders::jsonb, v.training
  from (values
    ('implementation_plan', 'Implementation plan approved', 'implementation', 'in_progress', '["sponsor","it_lead"]', 40),
    ('stakeholder_alignment', 'Stakeholder alignment workshop', 'stakeholders', 'pending', '["executive","department_heads"]', 20),
    ('training_readiness', 'Training readiness assessment', 'training', 'pending', '["enablement","support"]', 30),
    ('security_review', 'Enterprise security review', 'security', 'pending', '["security","compliance"]', 50),
    ('deployment_readiness', 'Deployment environment readiness', 'deployment', 'pending', '["platform","operations"]', 25)
  ) as v(key, title, cat, status, stakeholders, training)
  on conflict (organization_id, milestone_key) do nothing;

  insert into public.enterprise_readiness_assessments (organization_id, assessment_dimension, score, status, assessed_at)
  select p_organization_id, v.dim, v.score, 'completed', now()
  from (values
    ('governance', 78), ('security', 82), ('integrations', 65), ('operations', 74), ('deployment', 70)
  ) as v(dim, score)
  where not exists (
    select 1 from public.enterprise_readiness_assessments e
    where e.organization_id = p_organization_id and e.assessment_dimension = v.dim
  );
end; $$;

create or replace function public._ere_overall_score(p_organization_id uuid)
returns int language sql stable security definer set search_path = public as $$
  select coalesce(round(avg(score))::int, 0)
  from public.enterprise_readiness_assessments
  where organization_id = p_organization_id
    and assessment_dimension in ('governance', 'security', 'integrations', 'operations', 'deployment');
$$;

create or replace function public._ere_approval_bottlenecks(p_organization_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'chain_key', c.chain_key,
    'chain_title', c.chain_title,
    'chain_type', c.chain_type,
    'step_count', jsonb_array_length(c.steps),
    'status', c.status,
    'bottleneck_risk', case when jsonb_array_length(c.steps) > 2 then 'elevated' else 'normal' end
  )), '[]'::jsonb)
  from public.enterprise_approval_chains c
  where c.organization_id = p_organization_id and c.status = 'active';
$$;

create or replace function public._ere_deployment_hooks(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_settings jsonb;
begin
  select setting_value into v_settings
  from public.organization_enterprise_settings
  where organization_id = p_organization_id and setting_key = 'deployment_model';

  return jsonb_build_object(
    'deployment_engine', 'A.20 Deployment & Environment Management Engine',
    'enterprise_deployment_framework', 'Phase 92 enterprise deployment framework',
    'supported_models', jsonb_build_array('dedicated_tenant_cloud', 'hybrid_deployment', 'on_premise', 'multi_tenant_saas'),
    'current_model', coalesce(v_settings->>'model', 'multi_tenant_saas'),
    'readiness_flags', jsonb_build_object(
      'dedicated_ready', coalesce((v_settings->>'dedicated_ready')::boolean, false),
      'hybrid_ready', coalesce((v_settings->>'hybrid_ready')::boolean, false),
      'on_prem_ready', coalesce((v_settings->>'on_prem_ready')::boolean, false)
    ),
    'route', '/app/deployment-environment-management-engine'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.save_enterprise_setting(
  p_setting_key text,
  p_setting_value jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_enterprise_settings;
begin
  perform public._irp_require_permission('enterprise.manage');
  v_org_id := public._mta_require_organization();

  insert into public.organization_enterprise_settings (organization_id, setting_key, setting_value)
  values (v_org_id, p_setting_key, p_setting_value)
  on conflict (organization_id, setting_key) do update set
    setting_value = excluded.setting_value,
    updated_at = now()
  returning * into v_row;

  perform public._ere_log(v_org_id, 'enterprise_setting_changed', 'enterprise_setting', v_row.id,
    jsonb_build_object('setting_key', p_setting_key));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.assign_enterprise_delegated_admin(
  p_user_id uuid,
  p_scope text default 'team',
  p_permissions jsonb default '[]'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.enterprise_delegated_admins; v_assigner uuid;
begin
  perform public._irp_require_permission('enterprise.manage');
  v_org_id := public._mta_require_organization();
  v_assigner := public._mta_app_user_id();

  insert into public.enterprise_delegated_admins (organization_id, user_id, scope, permissions, assigned_by)
  values (v_org_id, p_user_id, p_scope, p_permissions, v_assigner)
  on conflict (organization_id, user_id, scope) do update set
    permissions = excluded.permissions,
    assigned_by = v_assigner
  returning * into v_row;

  perform public._ere_log(v_org_id, 'delegated_admin_assigned', 'delegated_admin', v_row.id,
    jsonb_build_object('user_id', p_user_id, 'scope', p_scope));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.save_enterprise_approval_chain(
  p_chain_key text,
  p_chain_title text,
  p_chain_type text default 'department',
  p_steps jsonb default '[]'::jsonb,
  p_emergency_override_config jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.enterprise_approval_chains;
begin
  perform public._irp_require_permission('enterprise.manage');
  v_org_id := public._mta_require_organization();

  insert into public.enterprise_approval_chains (
    organization_id, chain_key, chain_title, chain_type, steps, emergency_override_config
  ) values (v_org_id, p_chain_key, p_chain_title, p_chain_type, p_steps, p_emergency_override_config)
  on conflict (organization_id, chain_key) do update set
    chain_title = excluded.chain_title,
    chain_type = excluded.chain_type,
    steps = excluded.steps,
    emergency_override_config = excluded.emergency_override_config,
    updated_at = now()
  returning * into v_row;

  perform public._ere_log(v_org_id, 'approval_chain_updated', 'approval_chain', v_row.id,
    jsonb_build_object('chain_key', p_chain_key));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.apply_enterprise_approval_override(
  p_chain_key text,
  p_rationale text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_chain public.enterprise_approval_chains;
begin
  perform public._irp_require_permission('enterprise.override');
  v_org_id := public._mta_require_organization();

  select * into v_chain from public.enterprise_approval_chains
  where organization_id = v_org_id and chain_key = p_chain_key and status = 'active';
  if not found then raise exception 'Approval chain not found'; end if;

  if coalesce((v_chain.emergency_override_config->>'ai_prohibited')::boolean, false) then
    raise exception 'Level 4 critical actions prohibited for AI — human override only';
  end if;

  perform public._ere_log(v_org_id, 'approval_override_applied', 'approval_chain', v_chain.id,
    jsonb_build_object('chain_key', p_chain_key, 'rationale', p_rationale));

  return jsonb_build_object('chain_key', p_chain_key, 'override_applied', true, 'audited', true);
end; $$;

create or replace function public.record_enterprise_readiness_assessment(
  p_assessment_dimension text,
  p_score int,
  p_health_overview jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.enterprise_readiness_assessments;
begin
  perform public._irp_require_permission('enterprise.manage');
  v_org_id := public._mta_require_organization();

  update public.enterprise_readiness_assessments
  set score = p_score,
      status = 'completed',
      health_overview = p_health_overview,
      assessed_at = now(),
      updated_at = now()
  where organization_id = v_org_id and assessment_dimension = p_assessment_dimension
  returning * into v_row;

  if not found then
    insert into public.enterprise_readiness_assessments (
      organization_id, assessment_dimension, score, status, health_overview, assessed_at
    ) values (v_org_id, p_assessment_dimension, p_score, 'completed', p_health_overview, now())
    returning * into v_row;
  end if;

  perform public._ere_log(v_org_id, 'readiness_assessment_recorded', 'readiness_assessment', v_row.id,
    jsonb_build_object('dimension', p_assessment_dimension, 'score', p_score));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.get_enterprise_executive_report()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_score int;
begin
  perform public._irp_require_permission('enterprise.view');
  v_org_id := public._mta_require_organization();
  perform public._ere_seed_org_content(v_org_id);
  v_score := public._ere_overall_score(v_org_id);

  return jsonb_build_object(
    'report_type', 'executive',
    'generated_at', now(),
    'privacy_note', 'Metadata and summary scores only — no PII.',
    'overall_readiness_score', v_score,
    'health_status', public._ere_health_status(v_score),
    'top_risks', coalesce((
      select jsonb_agg(jsonb_build_object('dimension', a.assessment_dimension, 'score', a.score) order by a.score)
      from public.enterprise_readiness_assessments a
      where a.organization_id = v_org_id and a.score < 70
        and a.assessment_dimension in ('governance', 'security', 'integrations', 'operations', 'deployment')
      limit 3
    ), '[]'::jsonb),
    'deployment_hooks', public._ere_deployment_hooks(v_org_id)
  );
end; $$;

create or replace function public.get_enterprise_operational_report()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('enterprise.view');
  v_org_id := public._mta_require_organization();
  perform public._ere_seed_org_content(v_org_id);

  return jsonb_build_object(
    'report_type', 'operational',
    'generated_at', now(),
    'privacy_note', 'Metadata and summary scores only — no PII.',
    'approval_bottlenecks', public._ere_approval_bottlenecks(v_org_id),
    'onboarding_milestones', coalesce((
      select jsonb_agg(row_to_json(m) order by m.category, m.milestone_key)
      from public.enterprise_onboarding_milestones m where m.organization_id = v_org_id
    ), '[]'::jsonb),
    'operational_risks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'milestone_key', m.milestone_key,
        'status', m.status,
        'risk', case when m.status in ('blocked', 'pending') then 'attention' else 'normal' end
      ))
      from public.enterprise_onboarding_milestones m
      where m.organization_id = v_org_id and m.status in ('blocked', 'pending')
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_enterprise_governance_report()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('enterprise.view');
  v_org_id := public._mta_require_organization();
  perform public._ere_seed_org_content(v_org_id);

  return jsonb_build_object(
    'report_type', 'governance',
    'generated_at', now(),
    'privacy_note', 'Metadata and summary scores only — no PII.',
    'delegated_admins', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id, 'user_id', d.user_id, 'scope', d.scope,
        'permission_count', jsonb_array_length(d.permissions)
      ))
      from public.enterprise_delegated_admins d where d.organization_id = v_org_id
    ), '[]'::jsonb),
    'approval_chains', coalesce((
      select jsonb_agg(row_to_json(c) order by c.chain_key)
      from public.enterprise_approval_chains c where c.organization_id = v_org_id and c.status = 'active'
    ), '[]'::jsonb),
    'governance_score', coalesce((
      select score from public.enterprise_readiness_assessments
      where organization_id = v_org_id and assessment_dimension = 'governance'
    ), 0)
  );
end; $$;

create or replace function public.get_enterprise_audit_preparation_report()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('enterprise.export');
  v_org_id := public._mta_require_organization();
  perform public._ere_seed_org_content(v_org_id);

  perform public._ere_log(v_org_id, 'enterprise_export_generated', 'enterprise_report', null,
    jsonb_build_object('report_type', 'audit_preparation'));

  return jsonb_build_object(
    'report_type', 'audit_preparation',
    'generated_at', now(),
    'privacy_note', 'Metadata and summary scores only — no PII.',
    'audit_scope', jsonb_build_array(
      'delegated_admin_assignments', 'approval_overrides', 'enterprise_setting_changes', 'enterprise_exports'
    ),
    'security_posture', coalesce((
      select setting_value from public.organization_enterprise_settings
      where organization_id = v_org_id and setting_key = 'security_posture'
    ), '{}'::jsonb),
    'readiness_dimensions', coalesce((
      select jsonb_agg(jsonb_build_object('dimension', a.assessment_dimension, 'score', a.score, 'status', a.status))
      from public.enterprise_readiness_assessments a where a.organization_id = v_org_id
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_enterprise_readiness_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_score int;
  v_integration jsonb;
  v_security jsonb;
begin
  perform public._irp_require_permission('enterprise.view');
  v_org_id := public._mta_require_organization();
  perform public._ere_seed_org_content(v_org_id);
  v_score := public._ere_overall_score(v_org_id);

  select setting_value into v_integration
  from public.organization_enterprise_settings
  where organization_id = v_org_id and setting_key = 'integration_landscape';

  select setting_value into v_security
  from public.organization_enterprise_settings
  where organization_id = v_org_id and setting_key = 'security_posture';

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Enterprise readiness through scalable governance, delegated administration, and accountable deployment — metadata only.',
    'principles', jsonb_build_array(
      'Advanced role structures and delegated administration',
      'Multi-step approval chains with emergency override audit',
      'Dedicated enterprise onboarding milestones',
      'Integration with Governance (A.14) and Deployment (A.20)',
      'Level 4 critical actions prohibited for AI'
    ),
    'summary', jsonb_build_object(
      'overall_readiness_score', v_score,
      'health_status', public._ere_health_status(v_score),
      'delegated_admin_count', coalesce((select count(*) from public.enterprise_delegated_admins where organization_id = v_org_id), 0),
      'active_approval_chains', coalesce((select count(*) from public.enterprise_approval_chains where organization_id = v_org_id and status = 'active'), 0),
      'pending_milestones', coalesce((select count(*) from public.enterprise_onboarding_milestones where organization_id = v_org_id and status in ('pending', 'in_progress', 'blocked')), 0),
      'integration_connected_count', coalesce((v_integration->>'connected_count')::int, 0)
    ),
    'health_overview', jsonb_build_object(
      'overall_score', v_score,
      'status', public._ere_health_status(v_score),
      'dimensions', coalesce((
        select jsonb_agg(row_to_json(a) order by a.assessment_dimension)
        from public.enterprise_readiness_assessments a
        where a.organization_id = v_org_id
          and a.assessment_dimension in ('governance', 'security', 'integrations', 'operations', 'deployment')
      ), '[]'::jsonb)
    ),
    'approval_bottlenecks', public._ere_approval_bottlenecks(v_org_id),
    'security_posture', coalesce(v_security, '{}'::jsonb),
    'integration_landscape', coalesce(v_integration, '{}'::jsonb),
    'operational_risks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'milestone_key', m.milestone_key,
        'milestone_title', m.milestone_title,
        'category', m.category,
        'status', m.status,
        'training_readiness_score', m.training_readiness_score
      ) order by m.category)
      from public.enterprise_onboarding_milestones m
      where m.organization_id = v_org_id and m.status in ('pending', 'blocked', 'in_progress')
    ), '[]'::jsonb),
    'delegated_admins', coalesce((
      select jsonb_agg(row_to_json(d) order by d.created_at desc)
      from public.enterprise_delegated_admins d where d.organization_id = v_org_id
    ), '[]'::jsonb),
    'approval_chains', coalesce((
      select jsonb_agg(row_to_json(c) order by c.chain_key)
      from public.enterprise_approval_chains c where c.organization_id = v_org_id
    ), '[]'::jsonb),
    'onboarding_milestones', coalesce((
      select jsonb_agg(row_to_json(m) order by m.category, m.milestone_key)
      from public.enterprise_onboarding_milestones m where m.organization_id = v_org_id
    ), '[]'::jsonb),
    'enterprise_settings', coalesce((
      select jsonb_object_agg(s.setting_key, s.setting_value)
      from public.organization_enterprise_settings s where s.organization_id = v_org_id
    ), '{}'::jsonb),
    'deployment_readiness', public._ere_deployment_hooks(v_org_id),
    'reports_available', jsonb_build_array('executive', 'operational', 'governance', 'audit_preparation')
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_enterprise_readiness_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_score int;
begin
  v_org_id := public._mta_require_organization();
  perform public._ere_seed_org_content(v_org_id);
  v_score := public._ere_overall_score(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'overall_readiness_score', v_score,
    'health_status', public._ere_health_status(v_score),
    'philosophy', 'Enterprise readiness with accountable governance and flexible deployment.'
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
    'approval_override_applied', 'readiness_assessment_recorded', 'enterprise_export_generated'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'enterprise-readiness-engine', 'Enterprise Readiness Engine', 'Enterprise health, governance, delegated admin, approval chains, and deployment readiness.', 'authenticated', 71
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'enterprise-readiness-engine' and tenant_id is null);

grant execute on function public.save_enterprise_setting(text, jsonb) to authenticated;
grant execute on function public.assign_enterprise_delegated_admin(uuid, text, jsonb) to authenticated;
grant execute on function public.save_enterprise_approval_chain(text, text, text, jsonb, jsonb) to authenticated;
grant execute on function public.apply_enterprise_approval_override(text, text) to authenticated;
grant execute on function public.record_enterprise_readiness_assessment(text, int, jsonb) to authenticated;
grant execute on function public.get_enterprise_executive_report() to authenticated;
grant execute on function public.get_enterprise_operational_report() to authenticated;
grant execute on function public.get_enterprise_governance_report() to authenticated;
grant execute on function public.get_enterprise_audit_preparation_report() to authenticated;
grant execute on function public.get_enterprise_readiness_engine_dashboard() to authenticated;
grant execute on function public.get_enterprise_readiness_engine_card() to authenticated;

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._ere_seed_org_content(v_org_id);
  end loop;
end $$;
