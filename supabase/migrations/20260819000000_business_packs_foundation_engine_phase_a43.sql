-- Phase A.43 — Business Packs Foundation Engine
-- Curated industry/operational packs — activates modules (A.23), workflows (A.42 scaffold), install context (A.22).
-- Integrates with Industry Blueprints (Phase 70) without duplicating blueprint apply logic.

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
    'workflow_orchestration_engine', 'business_packs_foundation_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. business_packs (global catalog)
-- ---------------------------------------------------------------------------
create table if not exists public.business_packs (
  id uuid primary key default gen_random_uuid(),
  pack_key text not null unique,
  pack_name text not null,
  industry text not null default 'general',
  description text,
  status text not null default 'active' check (
    status in ('active', 'beta', 'deprecated', 'archived')
  ),
  version text not null default '1.0.0',
  is_future boolean not null default false,
  components jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_packs_status_idx
  on public.business_packs (status, industry);

alter table public.business_packs enable row level security;
revoke all on public.business_packs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_business_packs (tenant activation)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_business_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  business_pack_id uuid not null references public.business_packs (id) on delete restrict,
  activated_at timestamptz not null default now(),
  activated_by uuid references public.users (id) on delete set null,
  customizations jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, business_pack_id)
);

create index if not exists organization_business_packs_org_idx
  on public.organization_business_packs (organization_id, activated_at desc);

alter table public.organization_business_packs enable row level security;
revoke all on public.organization_business_packs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. business_pack_activation_log (step audit trail)
-- ---------------------------------------------------------------------------
create table if not exists public.business_pack_activation_log (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  business_pack_id uuid not null references public.business_packs (id) on delete cascade,
  activation_id uuid references public.organization_business_packs (id) on delete set null,
  step_name text not null,
  step_status text not null default 'completed' check (
    step_status in ('pending', 'in_progress', 'completed', 'failed', 'skipped')
  ),
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  actor_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists business_pack_activation_log_org_idx
  on public.business_pack_activation_log (organization_id, business_pack_id, created_at desc);

alter table public.business_pack_activation_log enable row level security;
revoke all on public.business_pack_activation_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'business_packs', v.description
from (values
  ('business_packs.view', 'View Business Packs', 'View business pack catalog and activation status'),
  ('business_packs.activate', 'Activate Business Packs', 'Activate business packs for organization'),
  ('business_packs.manage', 'Manage Business Packs', 'Manage pack lifecycle and updates'),
  ('business_packs.customize', 'Customize Business Packs', 'Customize activated business pack settings')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'business_packs.view'), ('owner', 'business_packs.activate'), ('owner', 'business_packs.manage'), ('owner', 'business_packs.customize'),
  ('administrator', 'business_packs.view'), ('administrator', 'business_packs.activate'), ('administrator', 'business_packs.manage'), ('administrator', 'business_packs.customize'),
  ('manager', 'business_packs.view'), ('manager', 'business_packs.customize'),
  ('viewer', 'business_packs.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 5. Helpers (_bpf_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._bpf_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'business_pack',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._bpf_activation_log(
  p_organization_id uuid,
  p_business_pack_id uuid,
  p_activation_id uuid,
  p_step_name text,
  p_step_status text,
  p_summary text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_user_id uuid;
begin
  v_user_id := public._mta_app_user_id();
  insert into public.business_pack_activation_log (
    organization_id, business_pack_id, activation_id, step_name, step_status, summary, metadata, actor_user_id
  )
  values (
    p_organization_id, p_business_pack_id, p_activation_id, p_step_name, p_step_status,
    left(coalesce(p_summary, ''), 500), p_metadata, v_user_id
  )
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._bpf_activate_module(p_organization_id uuid, p_module_key text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (
    select 1 from public.marketplace_modules where module_key = p_module_key and status in ('active', 'beta')
  ) then
    return;
  end if;

  insert into public.organization_modules (organization_id, module_key, status, activated_at)
  values (p_organization_id, p_module_key, 'active', now())
  on conflict (organization_id, module_key) do update set
    status = 'active', activated_at = now(), deactivated_at = null, updated_at = now();

  if exists (select 1 from pg_proc where proname = '_mmf_sync_tenant_module') then
    perform public._mmf_sync_tenant_module(p_organization_id, p_module_key, true);
  elsif exists (select 1 from pg_tables where tablename = 'tenant_modules' and schemaname = 'public') then
    insert into public.tenant_modules (tenant_id, module_key, enabled, licensed, status)
    values (p_organization_id, p_module_key, true, true, 'enabled')
    on conflict (tenant_id, module_key) do update set
      enabled = true, licensed = true, status = 'enabled', updated_at = now();
  end if;
end; $$;

create or replace function public._bpf_map_workflow_category(p_raw text)
returns text language sql immutable as $$
  select case lower(coalesce(p_raw, 'operations'))
    when 'support' then 'support'
    when 'onboarding' then 'onboarding'
    when 'incident' then 'incident'
    when 'knowledge' then 'knowledge'
    when 'risk' then 'risk'
    when 'governance' then 'governance'
    else 'operations'
  end;
$$;

create or replace function public._bpf_activate_workflow(
  p_organization_id uuid,
  p_workflow jsonb
)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_key text;
  v_template_key text;
  v_name text;
  v_category text;
  v_tpl public.workflow_templates;
  v_workflow_id uuid;
  v_step jsonb;
  v_order int := 0;
  v_user_id uuid;
begin
  v_user_id := public._mta_app_user_id();
  v_key := coalesce(p_workflow->>'key', p_workflow->>'workflow_key');
  if v_key is null or v_key = '' then return; end if;

  v_template_key := coalesce(nullif(p_workflow->>'template_key', ''), v_key);

  -- A.42 Workflow Orchestration — organization_workflows + workflow_steps
  if exists (select 1 from pg_tables where tablename = 'organization_workflows' and schemaname = 'public') then
    if exists (
      select 1 from public.organization_workflows ow
      where ow.organization_id = p_organization_id
        and (ow.source_template_key = v_template_key or ow.metadata->>'pack_workflow_key' = v_key)
    ) then
      return;
    end if;

    select * into v_tpl from public.workflow_templates where template_key = v_template_key;
    v_name := coalesce(p_workflow->>'name', v_tpl.template_name, initcap(replace(v_key, '_', ' ')));
    v_category := public._bpf_map_workflow_category(coalesce(p_workflow->>'category', v_tpl.category));

    insert into public.organization_workflows (
      organization_id, workflow_name, description, category, status, trust_level,
      created_by, source_template_key, metadata
    )
    values (
      p_organization_id, v_name, left(coalesce(p_workflow->>'description', v_tpl.description, ''), 500),
      v_category, 'active', coalesce(v_tpl.default_trust_level, 'standard'),
      v_user_id, case when v_tpl.template_key is not null then v_template_key else null end,
      jsonb_build_object('pack_workflow_key', v_key, 'activated_via', 'business_pack')
    )
    returning id into v_workflow_id;

    if v_tpl.id is not null and exists (select 1 from pg_tables where tablename = 'workflow_steps' and schemaname = 'public') then
      for v_step in select * from jsonb_array_elements(coalesce(v_tpl.steps, '[]'::jsonb)) loop
        v_order := v_order + 1;
        insert into public.workflow_steps (
          workflow_id, organization_id, trigger_type, conditions, action_type,
          approval_required, approver_role, escalation_rules, step_order
        )
        values (
          v_workflow_id, p_organization_id,
          coalesce(v_step->>'trigger_type', 'manual'),
          coalesce(v_step->'conditions', '{}'::jsonb),
          coalesce(v_step->>'action_type', 'create_task'),
          coalesce((v_step->>'approval_required')::boolean, false),
          v_step->>'approver_role',
          coalesce(v_step->'escalation_rules', '{"timeout_hours":24,"escalate_to":"administrator"}'::jsonb),
          coalesce((v_step->>'step_order')::int, v_order)
        );
      end loop;
    end if;

    return;
  end if;

  -- Legacy organizational intelligence fallback
  if exists (select 1 from pg_tables where tablename = 'aipify_workflow_definitions' and schemaname = 'public') then
    insert into public.aipify_workflow_definitions (tenant_id, workflow_key, name, description, category, active)
    values (
      p_organization_id, v_key,
      coalesce(p_workflow->>'name', initcap(replace(v_key, '_', ' '))),
      left(coalesce(p_workflow->>'description', ''), 500),
      coalesce(p_workflow->>'category', 'internal'), true
    )
    on conflict (tenant_id, workflow_key) do update set active = true, updated_at = now();
  end if;
end; $$;

create or replace function public._bpf_sync_install_context(
  p_organization_id uuid,
  p_pack_key text,
  p_components jsonb
)
returns void language plpgsql security definer set search_path = public as $$
declare v_install_id uuid; v_rec jsonb;
begin
  if not exists (select 1 from pg_tables where tablename = 'install_recommendations' and schemaname = 'public') then
    return;
  end if;

  select id into v_install_id
  from public.organization_installations
  where organization_id = p_organization_id
  order by created_at desc
  limit 1;

  if v_install_id is null then return; end if;

  for v_rec in select jsonb_array_elements(coalesce(p_components->'modules', '[]'::jsonb))
  loop
    if not exists (
      select 1 from public.install_recommendations
      where organization_id = p_organization_id
        and installation_id = v_install_id
        and recommendation_type = 'module'
        and recommendation_key = v_rec #>> '{}'
    ) then
      insert into public.install_recommendations (
        organization_id, installation_id, recommendation_type, recommendation_key,
        recommendation_label, priority, status, rationale
      )
      values (
        p_organization_id, v_install_id, 'module', v_rec #>> '{}',
        initcap(replace(v_rec #>> '{}', '_', ' ')), 70, 'accepted',
        format('Enabled via business pack %s', p_pack_key)
      );
    end if;
  end loop;

  for v_rec in select jsonb_array_elements(coalesce(p_components->'workflows', '[]'::jsonb))
  loop
    if not exists (
      select 1 from public.install_recommendations
      where organization_id = p_organization_id
        and installation_id = v_install_id
        and recommendation_type = 'workflow'
        and recommendation_key = coalesce(v_rec->>'key', v_rec->>'workflow_key')
    ) then
      insert into public.install_recommendations (
        organization_id, installation_id, recommendation_type, recommendation_key,
        recommendation_label, priority, status, rationale
      )
      values (
        p_organization_id, v_install_id, 'workflow',
        coalesce(v_rec->>'key', v_rec->>'workflow_key'),
        coalesce(v_rec->>'name', 'Workflow'),
        65, 'accepted',
        format('Enabled via business pack %s', p_pack_key)
      );
    end if;
  end loop;
end; $$;

create or replace function public._bpf_seed_catalog()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mmf_seed_catalog();
  if exists (select 1 from pg_proc where proname = '_woe_seed_templates') then
    perform public._woe_seed_templates();
  end if;

  insert into public.business_packs (pack_key, pack_name, industry, description, status, version, is_future, components)
  select v.key, v.name, v.industry, v.desc, v.status, v.version, v.future, v.components::jsonb
  from (values
    (
      'general_business', 'General Business', 'general',
      'Core operational modules for everyday business administration.',
      'active', '1.0.0', false,
      '{"modules":["admin_assistant","knowledge_center","analytics_insights"],"workflows":[{"key":"daily_ops_review","name":"Daily Operations Review","category":"internal"}],"kc_templates":["general-business-pack"],"dashboard_layout":{"sections":["overview","tasks","insights"]},"notifications":["daily_briefing"],"governance":{"oversight_level":"approval_required"}}'
    ),
    (
      'support_operations', 'Support Operations', 'support',
      'Support AI, knowledge, and quality workflows for customer operations.',
      'active', '1.0.0', false,
      '{"modules":["support_ai","knowledge_center","quality_guardian"],"workflows":[{"key":"support_triage","template_key":"support_escalation","name":"Support Triage","category":"support"},{"key":"escalation_handling","template_key":"support_escalation","name":"Escalation Handling","category":"support"}],"kc_templates":["support-operations-pack"],"dashboard_layout":{"sections":["inbox","escalations","quality"]},"notifications":["support_escalation"],"governance":{"oversight_level":"approval_required","require_approvals_for":["medium","high"]}}'
    ),
    (
      'e_commerce', 'E-Commerce', 'retail',
      'Commerce-oriented support, analytics, and integration workflows.',
      'active', '1.0.0', false,
      '{"modules":["support_ai","analytics_insights","integration_engine"],"workflows":[{"key":"order_support","name":"Order Support","category":"ecommerce"},{"key":"returns_handling","name":"Returns Handling","category":"ecommerce"}],"kc_templates":["e-commerce-pack"],"dashboard_layout":{"sections":["orders","support","analytics"]},"notifications":["order_alert"],"governance":{"oversight_level":"approval_required"}}'
    ),
    (
      'membership_platform', 'Membership Platform', 'membership',
      'Member onboarding, notifications, and retention workflows.',
      'active', '1.0.0', false,
      '{"modules":["support_ai","notification_communication","analytics_insights"],"workflows":[{"key":"member_onboarding","template_key":"new_employee_onboarding","name":"Member Onboarding","category":"onboarding"},{"key":"renewal_reminders","name":"Renewal Reminders","category":"operations"}],"kc_templates":["membership-platform-pack"],"dashboard_layout":{"sections":["members","renewals","engagement"]},"notifications":["renewal_reminder"],"governance":{"oversight_level":"approval_required"}}'
    ),
    (
      'professional_services', 'Professional Services', 'professional_services',
      'Client intake, project delivery, and governance for service firms.',
      'active', '1.0.0', false,
      '{"modules":["admin_assistant","analytics_insights","governance_policy"],"workflows":[{"key":"client_intake","name":"Client Intake","category":"sales"},{"key":"project_delivery","name":"Project Delivery","category":"internal"}],"kc_templates":["professional-services-pack"],"dashboard_layout":{"sections":["clients","projects","governance"]},"notifications":["project_milestone"],"governance":{"oversight_level":"approval_required","require_approvals_for":["high","critical"]}}'
    ),
    (
      'healthcare', 'Healthcare', 'healthcare',
      'Reserved — healthcare compliance and clinical operations pack.',
      'archived', '0.1.0', true,
      '{"modules":[],"workflows":[],"kc_templates":[],"dashboard_layout":{},"notifications":[],"governance":{}}'
    ),
    (
      'education', 'Education', 'education',
      'Reserved — education and training institution pack.',
      'archived', '0.1.0', true,
      '{"modules":[],"workflows":[],"kc_templates":[],"dashboard_layout":{},"notifications":[],"governance":{}}'
    ),
    (
      'manufacturing', 'Manufacturing', 'manufacturing',
      'Reserved — manufacturing operations and supply chain pack.',
      'archived', '0.1.0', true,
      '{"modules":[],"workflows":[],"kc_templates":[],"dashboard_layout":{},"notifications":[],"governance":{}}'
    ),
    (
      'hospitality', 'Hospitality', 'hospitality',
      'Reserved — hospitality and venue operations pack.',
      'archived', '0.1.0', true,
      '{"modules":[],"workflows":[],"kc_templates":[],"dashboard_layout":{},"notifications":[],"governance":{}}'
    ),
    (
      'enterprise_governance', 'Enterprise Governance', 'enterprise',
      'Reserved — enterprise governance and compliance pack.',
      'archived', '0.1.0', true,
      '{"modules":[],"workflows":[],"kc_templates":[],"dashboard_layout":{},"notifications":[],"governance":{}}'
    ),
    (
      'commerce_intelligence', 'Commerce Intelligence', 'commerce',
      'Reserved — advanced commerce intelligence pack.',
      'archived', '0.1.0', true,
      '{"modules":[],"workflows":[],"kc_templates":[],"dashboard_layout":{},"notifications":[],"governance":{}}'
    )
  ) as v(key, name, industry, desc, status, version, future, components)
  on conflict (pack_key) do update set
    pack_name = excluded.pack_name,
    industry = excluded.industry,
    description = excluded.description,
    status = excluded.status,
    version = excluded.version,
    is_future = excluded.is_future,
    components = excluded.components,
    updated_at = now();
end; $$;

create or replace function public._bpf_recommend_pack_keys(p_organization_id uuid)
returns text[] language plpgsql stable security definer set search_path = public as $$
declare v_industry text; v_keys text[] := array[]::text[];
begin
  select coalesce(
    nullif(trim(bdp.industry), ''),
    nullif(trim(oi.system_type), ''),
    'general'
  ) into v_industry
  from public.organizations o
  left join public.business_dna_profiles bdp on bdp.tenant_id = o.id
  left join public.organization_installations oi on oi.organization_id = o.id
  where o.id = p_organization_id
  limit 1;

  v_keys := case lower(coalesce(v_industry, 'general'))
    when 'retail' then array['e_commerce', 'support_operations', 'general_business']
    when 'ecommerce' then array['e_commerce', 'support_operations', 'general_business']
    when 'membership' then array['membership_platform', 'support_operations', 'general_business']
    when 'professional_services' then array['professional_services', 'general_business', 'support_operations']
    when 'support' then array['support_operations', 'general_business']
    else array['general_business', 'support_operations', 'professional_services']
  end;

  return v_keys;
end; $$;

-- ---------------------------------------------------------------------------
-- 6. RPCs — review, activate, customize, dashboard
-- ---------------------------------------------------------------------------
create or replace function public.get_business_pack_review(p_pack_key text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_pack public.business_packs;
begin
  perform public._irp_require_permission('business_packs.view');
  v_org_id := public._mta_require_organization();

  select * into v_pack from public.business_packs
  where pack_key = p_pack_key and status in ('active', 'beta') and is_future = false;

  if v_pack.id is null then
    raise exception 'Business pack not available for review';
  end if;

  return jsonb_build_object(
    'pack', row_to_json(v_pack)::jsonb,
    'review', jsonb_build_object(
      'modules', coalesce(v_pack.components->'modules', '[]'::jsonb),
      'workflows', coalesce(v_pack.components->'workflows', '[]'::jsonb),
      'kc_templates', coalesce(v_pack.components->'kc_templates', '[]'::jsonb),
      'dashboard_layout', coalesce(v_pack.components->'dashboard_layout', '{}'::jsonb),
      'notifications', coalesce(v_pack.components->'notifications', '[]'::jsonb),
      'governance', coalesce(v_pack.components->'governance', '{}'::jsonb)
    ),
    'already_active', exists (
      select 1 from public.organization_business_packs obp
      where obp.organization_id = v_org_id and obp.business_pack_id = v_pack.id
    ),
    'industry_blueprint_note', 'Industry Blueprints (Phase 70) remain available at /app/industry-blueprints for vertical profiles — business packs orchestrate modules and workflows without replacing blueprint apply.'
  );
end; $$;

create or replace function public.activate_organization_business_pack(p_pack_key text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_pack public.business_packs;
  v_activation public.organization_business_packs;
  v_module text;
  v_workflow jsonb;
  v_modules jsonb;
  v_workflows jsonb;
begin
  perform public._irp_require_permission('business_packs.activate');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  select * into v_pack from public.business_packs
  where pack_key = p_pack_key and status in ('active', 'beta') and is_future = false;

  if v_pack.id is null then
    raise exception 'Business pack not available for activation';
  end if;

  if exists (
    select 1 from public.organization_business_packs
    where organization_id = v_org_id and business_pack_id = v_pack.id
  ) then
    raise exception 'Business pack already activated';
  end if;

  insert into public.organization_business_packs (organization_id, business_pack_id, activated_by, customizations)
  values (v_org_id, v_pack.id, v_user_id, jsonb_build_object('governance', coalesce(v_pack.components->'governance', '{}'::jsonb)))
  returning * into v_activation;

  perform public._bpf_activation_log(
    v_org_id, v_pack.id, v_activation.id, 'pack_selected', 'completed',
    format('Selected pack %s', v_pack.pack_name),
    jsonb_build_object('pack_key', p_pack_key, 'version', v_pack.version)
  );

  v_modules := coalesce(v_pack.components->'modules', '[]'::jsonb);
  for v_module in select jsonb_array_elements_text(v_modules)
  loop
    perform public._bpf_activate_module(v_org_id, v_module);
    perform public._bpf_activation_log(
      v_org_id, v_pack.id, v_activation.id, 'module_enabled', 'completed',
      format('Enabled module %s', v_module),
      jsonb_build_object('module_key', v_module)
    );
  end loop;

  v_workflows := coalesce(v_pack.components->'workflows', '[]'::jsonb);
  for v_workflow in select jsonb_array_elements(v_workflows)
  loop
    perform public._bpf_activate_workflow(v_org_id, v_workflow);
    perform public._bpf_activation_log(
      v_org_id, v_pack.id, v_activation.id, 'workflow_enabled', 'completed',
      format('Enabled workflow %s', coalesce(v_workflow->>'key', v_workflow->>'workflow_key')),
      v_workflow
    );
  end loop;

  perform public._bpf_sync_install_context(v_org_id, p_pack_key, v_pack.components);
  perform public._bpf_activation_log(
    v_org_id, v_pack.id, v_activation.id, 'install_context_synced', 'completed',
    'Synced install recommendations with pack components',
    jsonb_build_object('installation_context', true)
  );

  perform public._bpf_activation_log(
    v_org_id, v_pack.id, v_activation.id, 'kc_templates_registered', 'completed',
    'Knowledge Center template references registered (metadata only)',
    jsonb_build_object('kc_templates', coalesce(v_pack.components->'kc_templates', '[]'::jsonb))
  );

  perform public._bpf_activation_log(
    v_org_id, v_pack.id, v_activation.id, 'pack_activated', 'completed',
    format('Activated business pack %s', v_pack.pack_name),
    jsonb_build_object('pack_key', p_pack_key, 'version', v_pack.version)
  );

  perform public._bpf_log(
    v_org_id, 'business_pack_activated', 'business_pack', v_activation.id,
    jsonb_build_object('pack_key', p_pack_key, 'pack_name', v_pack.pack_name)
  );

  return jsonb_build_object(
    'activation', row_to_json(v_activation)::jsonb,
    'pack_key', p_pack_key,
    'status', 'activated'
  );
end; $$;

create or replace function public.customize_organization_business_pack(
  p_pack_key text,
  p_customizations jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_pack_id uuid; v_row public.organization_business_packs;
begin
  perform public._irp_require_permission('business_packs.customize');
  v_org_id := public._mta_require_organization();

  select id into v_pack_id from public.business_packs where pack_key = p_pack_key;
  if v_pack_id is null then raise exception 'Business pack not found'; end if;

  update public.organization_business_packs
  set customizations = coalesce(customizations, '{}'::jsonb) || coalesce(p_customizations, '{}'::jsonb),
      updated_at = now()
  where organization_id = v_org_id and business_pack_id = v_pack_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Business pack not activated'; end if;

  perform public._bpf_log(
    v_org_id, 'business_pack_customized', 'business_pack', v_row.id,
    jsonb_build_object('pack_key', p_pack_key)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.get_business_packs_foundation_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_recommended text[];
begin
  perform public._irp_require_permission('business_packs.view');
  v_org_id := public._mta_require_organization();
  perform public._bpf_seed_catalog();

  v_recommended := public._bpf_recommend_pack_keys(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Curated business packs — select, review modules and workflows, activate with human approval, then customize. Integrates Module Marketplace (A.23), Workflow Orchestration (A.42), and Install Engine (A.22).',
    'principles', jsonb_build_array(
      'Select → review → activate → customize',
      'Modules enabled via Module Marketplace Foundation',
      'Workflows registered via Workflow Orchestration scaffold',
      'Install context synced via Install Engine recommendations',
      'Metadata-only — no raw customer content in pack definitions',
      'Industry Blueprints remain complementary — integrate, do not duplicate'
    ),
    'summary', jsonb_build_object(
      'active_count', coalesce((
        select count(*) from public.organization_business_packs obp
        where obp.organization_id = v_org_id
      ), 0),
      'available_count', coalesce((
        select count(*) from public.business_packs bp
        where bp.status in ('active', 'beta') and bp.is_future = false
          and not exists (
            select 1 from public.organization_business_packs obp
            where obp.organization_id = v_org_id and obp.business_pack_id = bp.id
          )
      ), 0),
      'recommended_count', coalesce((
        select count(*) from public.business_packs bp
        where bp.pack_key = any(v_recommended) and bp.status in ('active', 'beta') and bp.is_future = false
      ), 0),
      'future_reserved', coalesce((select count(*) from public.business_packs where is_future), 0),
      'pending_updates', coalesce((
        select count(*) from public.organization_business_packs obp
        join public.business_packs bp on bp.id = obp.business_pack_id
        where obp.organization_id = v_org_id
          and obp.customizations->>'acknowledged_version' is distinct from bp.version
      ), 0),
      'customized_count', coalesce((
        select count(*) from public.organization_business_packs obp
        where obp.organization_id = v_org_id
          and obp.customizations != '{}'::jsonb
      ), 0)
    ),
    'active_packs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'activation', row_to_json(obp)::jsonb,
        'pack', row_to_json(bp)::jsonb,
        'customization_status', case
          when obp.customizations = '{}'::jsonb then 'default'
          when obp.customizations->>'acknowledged_version' is distinct from bp.version then 'update_available'
          else 'customized'
        end
      ) order by obp.activated_at desc)
      from public.organization_business_packs obp
      join public.business_packs bp on bp.id = obp.business_pack_id
      where obp.organization_id = v_org_id
    ), '[]'::jsonb),
    'available_packs', coalesce((
      select jsonb_agg(row_to_json(bp) order by bp.pack_name)
      from public.business_packs bp
      where bp.status in ('active', 'beta') and bp.is_future = false
        and not exists (
          select 1 from public.organization_business_packs obp
          where obp.organization_id = v_org_id and obp.business_pack_id = bp.id
        )
    ), '[]'::jsonb),
    'recommended_packs', coalesce((
      select jsonb_agg(row_to_json(bp) order by array_position(v_recommended, bp.pack_key))
      from public.business_packs bp
      where bp.pack_key = any(v_recommended) and bp.status in ('active', 'beta') and bp.is_future = false
    ), '[]'::jsonb),
    'future_packs', coalesce((
      select jsonb_agg(jsonb_build_object('pack_key', bp.pack_key, 'pack_name', bp.pack_name, 'industry', bp.industry, 'status', bp.status))
      from public.business_packs bp where bp.is_future = true order by bp.pack_name
    ), '[]'::jsonb),
    'recent_activation_logs', coalesce((
      select jsonb_agg(row_to_json(l) order by l.created_at desc)
      from public.business_pack_activation_log l
      where l.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'integration_notes', jsonb_build_object(
      'module_marketplace', 'Modules activated via organization_modules and tenant_modules sync',
      'workflow_orchestration', 'Workflows registered in aipify_workflow_definitions',
      'install_engine', 'Install recommendations accepted when organization_installations exists',
      'industry_blueprints', 'Vertical profiles at /app/industry-blueprints — complementary to business packs'
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_business_packs_foundation_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'has_organization', true,
    'active_packs', coalesce((
      select count(*) from public.organization_business_packs where organization_id = v_org_id
    ), 0),
    'available_packs', coalesce((
      select count(*) from public.business_packs bp
      where bp.status in ('active', 'beta') and bp.is_future = false
        and not exists (
          select 1 from public.organization_business_packs obp
          where obp.organization_id = v_org_id and obp.business_pack_id = bp.id
        )
    ), 0),
    'philosophy', 'Activate curated packs — modules, workflows, and install context in one flow.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Audit extension
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
    'workflow_step_rejected', 'workflow_escalated'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'business-packs-foundation-engine', 'Business Packs Foundation Engine', 'Curated business packs — modules, workflows, governance, and install context in one activation flow.', 'authenticated', 77
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'business-packs-foundation-engine' and tenant_id is null);

select public._bpf_seed_catalog();

grant execute on function public.get_business_pack_review(text) to authenticated;
grant execute on function public.activate_organization_business_pack(text) to authenticated;
grant execute on function public.customize_organization_business_pack(text, jsonb) to authenticated;
grant execute on function public.get_business_packs_foundation_engine_dashboard() to authenticated;
grant execute on function public.get_business_packs_foundation_engine_card() to authenticated;
