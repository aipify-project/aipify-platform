-- Phase A.22 — Aipify Install Engine
-- Guided installation, discovery, permission review, and recommendations.
-- Extends Install Engine (Phase 17) — organizations.id = customers.id.

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
    'observability_platform_health_engine', 'aipify_install_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_installations
-- ---------------------------------------------------------------------------
create table if not exists public.organization_installations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  installation_status text not null default 'pending' check (
    installation_status in ('pending', 'in_progress', 'completed', 'failed', 'cancelled')
  ),
  current_step text not null default 'welcome' check (
    current_step in (
      'welcome', 'platform_detection', 'domain_verification', 'system_connection',
      'environment_discovery', 'permission_review', 'skill_recommendations', 'activation_complete'
    )
  ),
  completion_percentage int not null default 0 check (completion_percentage >= 0 and completion_percentage <= 100),
  system_type text,
  domain text,
  started_at timestamptz,
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id)
);

create index if not exists org_installations_org_status_idx
  on public.organization_installations (organization_id, installation_status);

alter table public.organization_installations enable row level security;
revoke all on public.organization_installations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. install_discovery_results
-- ---------------------------------------------------------------------------
create table if not exists public.install_discovery_results (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  installation_id uuid not null references public.organization_installations (id) on delete cascade,
  discovery_type text not null check (
    discovery_type in ('platform', 'integration', 'role', 'capability', 'workflow')
  ),
  entity_key text not null,
  entity_label text,
  confidence_score int not null default 50 check (confidence_score >= 0 and confidence_score <= 100),
  status text not null default 'detected' check (
    status in ('detected', 'confirmed', 'rejected', 'pending_review')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists install_discovery_org_idx
  on public.install_discovery_results (organization_id, installation_id, discovery_type);

alter table public.install_discovery_results enable row level security;
revoke all on public.install_discovery_results from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. install_recommendations
-- ---------------------------------------------------------------------------
create table if not exists public.install_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  installation_id uuid not null references public.organization_installations (id) on delete cascade,
  recommendation_type text not null check (
    recommendation_type in ('skill', 'module', 'integration', 'knowledge', 'workflow')
  ),
  recommendation_key text not null,
  recommendation_label text,
  priority int not null default 50,
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'rejected', 'deferred')
  ),
  rationale text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists install_recommendations_org_idx
  on public.install_recommendations (organization_id, installation_id, status);

alter table public.install_recommendations enable row level security;
revoke all on public.install_recommendations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. install_permission_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.install_permission_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  installation_id uuid not null references public.organization_installations (id) on delete cascade,
  permission_key text not null,
  permission_label text,
  risk_level text not null default 'low' check (risk_level in ('low', 'medium', 'high', 'critical')),
  review_status text not null default 'pending' check (
    review_status in ('pending', 'approved', 'rejected', 'deferred')
  ),
  reviewed_by uuid references public.users (id) on delete set null,
  reviewed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists install_permission_reviews_org_idx
  on public.install_permission_reviews (organization_id, installation_id, review_status);

alter table public.install_permission_reviews enable row level security;
revoke all on public.install_permission_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_install', v.description
from (values
  ('install.view', 'View Install', 'View installation progress and discovery results'),
  ('install.manage', 'Manage Install', 'Start and advance installation workflow'),
  ('install.discover', 'Run Discovery', 'Execute environment discovery scans'),
  ('install.approve_permissions', 'Approve Install Permissions', 'Review and approve installation permissions')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'install.view'), ('owner', 'install.manage'), ('owner', 'install.discover'), ('owner', 'install.approve_permissions'),
  ('administrator', 'install.view'), ('administrator', 'install.manage'), ('administrator', 'install.discover'), ('administrator', 'install.approve_permissions'),
  ('manager', 'install.view'), ('manager', 'install.discover'),
  ('support_agent', 'install.view'),
  ('viewer', 'install.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_ain_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._ain_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'installation',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._ain_step_order(p_step text)
returns int language sql immutable as $$
  select case p_step
    when 'welcome' then 1 when 'platform_detection' then 2 when 'domain_verification' then 3
    when 'system_connection' then 4 when 'environment_discovery' then 5
    when 'permission_review' then 6 when 'skill_recommendations' then 7
    when 'activation_complete' then 8 else 0
  end;
$$;

create or replace function public._ain_ensure_installation(p_organization_id uuid)
returns public.organization_installations language plpgsql security definer set search_path = public as $$
declare v_row public.organization_installations;
begin
  insert into public.organization_installations (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;

  select * into v_row from public.organization_installations where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._ain_completion_for_step(p_step text)
returns int language sql immutable as $$
  select (public._ain_step_order(p_step) * 100 / 8);
$$;

create or replace function public._ain_seed_demo_content(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_install public.organization_installations;
begin
  v_install := public._ain_ensure_installation(p_organization_id);

  if v_install.installation_status = 'pending' and v_install.completion_percentage = 0 then
    insert into public.install_permission_reviews (
      organization_id, installation_id, permission_key, permission_label, risk_level
    )
    select p_organization_id, v_install.id, v.key, v.label, v.risk
    from (values
      ('integrations.view', 'View Integrations', 'low'),
      ('integrations.create', 'Create Integrations', 'medium'),
      ('knowledge.publish', 'Publish Knowledge', 'medium'),
      ('ai.approve', 'Approve AI Actions', 'high')
    ) as v(key, label, risk)
    where not exists (
      select 1 from public.install_permission_reviews pr
      where pr.installation_id = v_install.id and pr.permission_key = v.key
    );

    insert into public.install_recommendations (
      organization_id, installation_id, recommendation_type, recommendation_key, recommendation_label, priority, rationale
    )
    select p_organization_id, v_install.id, v.rtype, v.rkey, v.rlabel, v.prio, v.rationale
    from (values
      ('module', 'support_ai', 'Support AI', 90, 'Detected support workflow — enable Support AI module.'),
      ('module', 'knowledge_center', 'Knowledge Center', 85, 'Initialize KC with getting-started articles.'),
      ('skill', 'support_operations', 'Support Operations Skill', 75, 'Recommended based on platform detection.'),
      ('integration', 'wordpress', 'WordPress Connector', 70, 'Detected WordPress admin environment.')
    ) as v(rtype, rkey, rlabel, prio, rationale)
    where not exists (
      select 1 from public.install_recommendations r
      where r.installation_id = v_install.id and r.recommendation_key = v.rkey
    );
  end if;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.start_installation(
  p_system_type text default null,
  p_domain text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_install public.organization_installations;
begin
  perform public._irp_require_permission('install.manage');
  v_org_id := public._mta_require_organization();
  v_install := public._ain_ensure_installation(v_org_id);

  if v_install.installation_status in ('completed', 'cancelled') then
    raise exception 'Installation already finalized';
  end if;

  update public.organization_installations
  set installation_status = 'in_progress',
      current_step = 'welcome',
      completion_percentage = public._ain_completion_for_step('welcome'),
      system_type = coalesce(p_system_type, system_type),
      domain = coalesce(p_domain, domain),
      started_at = coalesce(started_at, now()),
      updated_at = now()
  where id = v_install.id
  returning * into v_install;

  perform public._ain_log(v_org_id, 'installation_started', 'installation', v_install.id, jsonb_build_object(
    'system_type', v_install.system_type, 'domain', v_install.domain
  ));

  return row_to_json(v_install)::jsonb;
end; $$;

create or replace function public.advance_install_step(
  p_step text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_install public.organization_installations;
  v_next_step text;
  v_steps text[] := array[
    'welcome', 'platform_detection', 'domain_verification', 'system_connection',
    'environment_discovery', 'permission_review', 'skill_recommendations', 'activation_complete'
  ];
  v_idx int;
begin
  perform public._irp_require_permission('install.manage');
  v_org_id := public._mta_require_organization();
  v_install := public._ain_ensure_installation(v_org_id);

  if v_install.installation_status not in ('pending', 'in_progress') then
    raise exception 'Installation not active';
  end if;

  if p_step is not null then
    v_next_step := p_step;
  else
    v_idx := array_position(v_steps, v_install.current_step);
    v_next_step := v_steps[least(coalesce(v_idx, 1) + 1, array_length(v_steps, 1))];
  end if;

  update public.organization_installations
  set installation_status = 'in_progress',
      current_step = v_next_step,
      completion_percentage = public._ain_completion_for_step(v_next_step),
      updated_at = now()
  where id = v_install.id
  returning * into v_install;

  perform public._ain_log(v_org_id, 'installation_step_advanced', 'installation', v_install.id, jsonb_build_object(
    'current_step', v_next_step, 'completion_percentage', v_install.completion_percentage
  ));

  return row_to_json(v_install)::jsonb;
end; $$;

create or replace function public.run_install_discovery()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_install public.organization_installations;
  v_count int;
begin
  perform public._irp_require_permission('install.discover');
  v_org_id := public._mta_require_organization();
  v_install := public._ain_ensure_installation(v_org_id);

  insert into public.install_discovery_results (
    organization_id, installation_id, discovery_type, entity_key, entity_label, confidence_score
  )
  select v_org_id, v_install.id, v.dtype, v.ekey, v.elabel, v.conf
  from (values
    ('platform', coalesce(v_install.system_type, 'wordpress'), 'Detected Platform', 85),
    ('integration', 'wordpress', 'WordPress', 80),
    ('role', 'administrator', 'Administrator Role', 90),
    ('capability', 'support_inbox', 'Support Inbox', 75),
    ('workflow', 'ticket_triage', 'Ticket Triage', 70)
  ) as v(dtype, ekey, elabel, conf)
  where not exists (
    select 1 from public.install_discovery_results d
    where d.installation_id = v_install.id and d.entity_key = v.ekey and d.discovery_type = v.dtype
  );

  get diagnostics v_count = row_count;

  perform public._ain_log(v_org_id, 'installation_discovery_executed', 'installation', v_install.id, jsonb_build_object(
    'discoveries_added', v_count
  ));

  return jsonb_build_object(
    'installation_id', v_install.id,
    'discoveries_added', v_count,
    'discoveries', coalesce((
      select jsonb_agg(row_to_json(d) order by d.confidence_score desc)
      from public.install_discovery_results d
      where d.installation_id = v_install.id
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.approve_install_permissions(
  p_permission_keys text[] default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_install public.organization_installations;
  v_user_id uuid;
  v_count int;
begin
  perform public._irp_require_permission('install.approve_permissions');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_install := public._ain_ensure_installation(v_org_id);

  update public.install_permission_reviews
  set review_status = 'approved', reviewed_by = v_user_id, reviewed_at = now()
  where installation_id = v_install.id
    and review_status = 'pending'
    and (p_permission_keys is null or permission_key = any(p_permission_keys));

  get diagnostics v_count = row_count;

  perform public._ain_log(v_org_id, 'installation_permissions_approved', 'installation', v_install.id, jsonb_build_object(
    'approved_count', v_count, 'permission_keys', p_permission_keys
  ));

  return jsonb_build_object('approved_count', v_count);
end; $$;

create or replace function public.accept_install_recommendations(
  p_recommendation_ids uuid[] default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_install public.organization_installations;
  v_count int;
begin
  perform public._irp_require_permission('install.manage');
  v_org_id := public._mta_require_organization();
  v_install := public._ain_ensure_installation(v_org_id);

  update public.install_recommendations
  set status = 'accepted', updated_at = now()
  where installation_id = v_install.id
    and status = 'pending'
    and (p_recommendation_ids is null or id = any(p_recommendation_ids));

  get diagnostics v_count = row_count;

  perform public._ain_log(v_org_id, 'installation_recommendations_accepted', 'installation', v_install.id, jsonb_build_object(
    'accepted_count', v_count
  ));

  -- KC initialization scaffold
  if exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-install-engine' and tenant_id is null) then
    perform public._ain_log(v_org_id, 'integrations_connected', 'installation', v_install.id, jsonb_build_object(
      'kc_initialized', true, 'note', 'Knowledge Center scaffold linked during install completion.'
    ));
  end if;

  return jsonb_build_object('accepted_count', v_count);
end; $$;

create or replace function public.complete_installation()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_install public.organization_installations;
begin
  perform public._irp_require_permission('install.manage');
  v_org_id := public._mta_require_organization();
  v_install := public._ain_ensure_installation(v_org_id);

  update public.organization_installations
  set installation_status = 'completed',
      current_step = 'activation_complete',
      completion_percentage = 100,
      completed_at = now(),
      updated_at = now()
  where id = v_install.id
  returning * into v_install;

  perform public._ain_log(v_org_id, 'installation_completed', 'installation', v_install.id, jsonb_build_object(
    'system_type', v_install.system_type, 'domain', v_install.domain
  ));

  return row_to_json(v_install)::jsonb;
end; $$;

create or replace function public.get_aipify_install_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_install public.organization_installations;
begin
  perform public._irp_require_permission('install.view');
  v_org_id := public._mta_require_organization();
  v_install := public._ain_ensure_installation(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Install Aipify in minutes — guided discovery, permission review, and recommendations inside your existing system.',
    'install_engine_note', 'Extends Install Engine (Phase 17) — embedded runtime at /api/install and /api/embed.',
    'principles', jsonb_build_array(
      'Eight-step guided installation with human approval at permission review',
      'Environment discovery detects platforms, integrations, roles, and workflows',
      'Recommendation engine suggests modules, skills, and integrations',
      'Knowledge Center initialization on completion',
      'Full audit trail for installation lifecycle events'
    ),
    'installation', row_to_json(v_install),
    'steps', jsonb_build_array(
      'welcome', 'platform_detection', 'domain_verification', 'system_connection',
      'environment_discovery', 'permission_review', 'skill_recommendations', 'activation_complete'
    ),
    'summary', jsonb_build_object(
      'completion_percentage', v_install.completion_percentage,
      'installation_status', v_install.installation_status,
      'current_step', v_install.current_step,
      'pending_permissions', coalesce((
        select count(*) from public.install_permission_reviews
        where installation_id = v_install.id and review_status = 'pending'
      ), 0),
      'pending_recommendations', coalesce((
        select count(*) from public.install_recommendations
        where installation_id = v_install.id and status = 'pending'
      ), 0),
      'discoveries', coalesce((
        select count(*) from public.install_discovery_results where installation_id = v_install.id
      ), 0)
    ),
    'discoveries', coalesce((
      select jsonb_agg(row_to_json(d) order by d.confidence_score desc)
      from public.install_discovery_results d where d.installation_id = v_install.id
    ), '[]'::jsonb),
    'recommendations', coalesce((
      select jsonb_agg(row_to_json(r) order by r.priority desc)
      from public.install_recommendations r where r.installation_id = v_install.id
    ), '[]'::jsonb),
    'permission_reviews', coalesce((
      select jsonb_agg(row_to_json(p) order by p.risk_level desc)
      from public.install_permission_reviews p where p.installation_id = v_install.id
    ), '[]'::jsonb),
    'install_engine_integration', jsonb_build_object(
      'workflow_steps', jsonb_build_array(
        'create_account', 'select_plan', 'register_domains', 'connect_systems',
        'environment_discovery', 'recommend_skills', 'customer_approval', 'activate'
      ),
      'api_routes', jsonb_build_array('/api/install/*', '/api/embed/*'),
      'customer_route', '/app/install'
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_aipify_install_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_install public.organization_installations;
begin
  v_org_id := public._mta_require_organization();
  v_install := public._ain_ensure_installation(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'completion_percentage', v_install.completion_percentage,
    'installation_status', v_install.installation_status,
    'current_step', v_install.current_step,
    'philosophy', 'Guided installation with discovery and permission review.'
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
    'integrations_connected', 'installation_completed'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._ain_seed_demo_content(v_org_id);
  end loop;
end $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-install-engine', 'Aipify Install Engine', 'Guided installation, environment discovery, permission review, and skill recommendations — extending Install Engine Phase 17.', 'authenticated', 65
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-install-engine' and tenant_id is null);

grant execute on function public.start_installation(text, text) to authenticated;
grant execute on function public.advance_install_step(text) to authenticated;
grant execute on function public.run_install_discovery() to authenticated;
grant execute on function public.approve_install_permissions(text[]) to authenticated;
grant execute on function public.accept_install_recommendations(uuid[]) to authenticated;
grant execute on function public.complete_installation() to authenticated;
grant execute on function public.get_aipify_install_engine_dashboard() to authenticated;
grant execute on function public.get_aipify_install_engine_card() to authenticated;
