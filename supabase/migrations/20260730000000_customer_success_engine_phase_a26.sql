-- Phase A.26 — Customer Success Engine
-- Health scores, adoption tracking, interventions, and renewal risk detection.

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
    'launch_readiness_engine', 'customer_success_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_customer_success
-- ---------------------------------------------------------------------------
create table if not exists public.organization_customer_success (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  health_score int not null default 75 check (health_score >= 0 and health_score <= 100),
  health_status text not null default 'healthy' check (
    health_status in ('excellent', 'healthy', 'at_risk', 'critical')
  ),
  onboarding_status text not null default 'in_progress' check (
    onboarding_status in ('not_started', 'in_progress', 'completed', 'stalled')
  ),
  adoption_score int not null default 50 check (adoption_score >= 0 and adoption_score <= 100),
  satisfaction_score int not null default 70 check (satisfaction_score >= 0 and satisfaction_score <= 100),
  renewal_risk text not null default 'low' check (
    renewal_risk in ('low', 'medium', 'high', 'critical')
  ),
  last_assessed_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id)
);

alter table public.organization_customer_success enable row level security;
revoke all on public.organization_customer_success from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. success_playbooks
-- ---------------------------------------------------------------------------
create table if not exists public.success_playbooks (
  id uuid primary key default gen_random_uuid(),
  playbook_key text not null unique,
  playbook_title text not null,
  trigger_condition text not null,
  recommended_actions jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  created_at timestamptz not null default now()
);

alter table public.success_playbooks enable row level security;
revoke all on public.success_playbooks from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. success_interventions
-- ---------------------------------------------------------------------------
create table if not exists public.success_interventions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  playbook_key text references public.success_playbooks (playbook_key) on delete set null,
  intervention_type text not null check (
    intervention_type in ('onboarding_nudge', 'adoption_boost', 'satisfaction_followup', 'renewal_outreach', 'escalation')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'in_progress', 'completed', 'dismissed', 'escalated')
  ),
  priority text not null default 'routine' check (
    priority in ('critical', 'important', 'routine', 'optional')
  ),
  rationale text,
  assigned_to uuid references public.users (id) on delete set null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists success_interventions_org_idx
  on public.success_interventions (organization_id, status, priority);

alter table public.success_interventions enable row level security;
revoke all on public.success_interventions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. success_milestones
-- ---------------------------------------------------------------------------
-- Phase 82 human success used tenant_id; A.26 uses organization_id/milestone_key.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'success_milestones' and column_name = 'tenant_id'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'success_milestones' and column_name = 'organization_id'
  ) then
    alter table public.success_milestones rename to success_milestones_human_success_legacy;
  end if;
end $$;

create table if not exists public.success_milestones (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  milestone_key text not null,
  milestone_title text not null,
  category text not null default 'adoption',
  achieved boolean not null default false,
  achieved_at timestamptz,
  target_at timestamptz,
  created_at timestamptz not null default now(),
  unique (organization_id, milestone_key)
);

alter table public.success_milestones enable row level security;
revoke all on public.success_milestones from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'customer_success', v.description
from (values
  ('success.view', 'View Customer Success', 'View health scores and success metrics'),
  ('success.manage', 'Manage Customer Success', 'Manage interventions and milestones'),
  ('success.intervene', 'Create Interventions', 'Create and assign success interventions'),
  ('success.assess', 'Assess Health', 'Run customer success health assessments')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'success.view'), ('owner', 'success.manage'), ('owner', 'success.intervene'), ('owner', 'success.assess'),
  ('administrator', 'success.view'), ('administrator', 'success.manage'), ('administrator', 'success.intervene'), ('administrator', 'success.assess'),
  ('manager', 'success.view'), ('manager', 'success.intervene'),
  ('support_agent', 'success.view'),
  ('viewer', 'success.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_cse_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._cse_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'customer_success',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._cse_health_status(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'excellent'
    when p_score >= 70 then 'healthy'
    when p_score >= 50 then 'at_risk'
    else 'critical'
  end;
$$;

create or replace function public._cse_ensure_profile(p_organization_id uuid)
returns public.organization_customer_success language plpgsql security definer set search_path = public as $$
declare v_row public.organization_customer_success;
begin
  insert into public.organization_customer_success (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;
  select * into v_row from public.organization_customer_success where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._cse_seed_playbooks()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.success_playbooks (playbook_key, playbook_title, trigger_condition, recommended_actions)
  select v.key, v.title, v.trigger, v.actions::jsonb
  from (values
    ('onboarding_stalled', 'Onboarding Recovery', 'onboarding_status = stalled', '["send_welcome_reminder","schedule_walkthrough","review_checklist"]'),
    ('low_adoption', 'Adoption Boost', 'adoption_score < 50', '["highlight_core_modules","share_quick_wins","assign_success_manager"]'),
    ('satisfaction_drop', 'Satisfaction Follow-up', 'satisfaction_score < 60', '["request_feedback","review_support_cases","offer_training"]'),
    ('renewal_risk_high', 'Renewal Outreach', 'renewal_risk in (high, critical)', '["executive_check_in","value_report","plan_review"]')
  ) as v(key, title, trigger, actions)
  on conflict (playbook_key) do nothing;
end; $$;

create or replace function public._cse_seed_org_content(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._cse_ensure_profile(p_organization_id);

  insert into public.success_milestones (organization_id, milestone_key, milestone_title, category, achieved)
  select p_organization_id, v.key, v.title, v.cat, v.achieved
  from (values
    ('first_login', 'First team login', 'onboarding', true),
    ('module_activated', 'First module activated', 'adoption', true),
    ('knowledge_published', 'First KC article published', 'adoption', false),
    ('integration_connected', 'First integration connected', 'adoption', false),
    ('support_ai_live', 'Support AI operational', 'adoption', false)
  ) as v(key, title, cat, achieved)
  on conflict (organization_id, milestone_key) do nothing;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.assess_customer_success_health()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_profile public.organization_customer_success;
  v_adoption int;
  v_modules int;
begin
  perform public._irp_require_permission('success.assess');
  v_org_id := public._mta_require_organization();
  v_profile := public._cse_ensure_profile(v_org_id);

  select count(*) into v_modules
  from public.organization_modules where organization_id = v_org_id and status = 'active';
  if v_modules = 0 and exists (select 1 from pg_tables where tablename = 'tenant_modules') then
    select count(*) into v_modules from public.tenant_modules where tenant_id = v_org_id and enabled = true;
  end if;

  v_adoption := least(100, v_modules * 15 + coalesce((
    select count(*) * 10 from public.success_milestones where organization_id = v_org_id and achieved
  ), 0));

  update public.organization_customer_success
  set adoption_score = v_adoption,
      health_score = round((adoption_score + satisfaction_score) / 2.0),
      health_status = public._cse_health_status(round((v_adoption + satisfaction_score) / 2.0)),
      renewal_risk = case
        when satisfaction_score < 50 or v_adoption < 30 then 'critical'
        when satisfaction_score < 60 or v_adoption < 50 then 'high'
        when satisfaction_score < 75 or v_adoption < 70 then 'medium'
        else 'low'
      end,
      last_assessed_at = now(),
      updated_at = now()
  where organization_id = v_org_id
  returning * into v_profile;

  perform public._cse_log(v_org_id, 'success_health_assessed', 'customer_success', v_profile.id, jsonb_build_object(
    'health_score', v_profile.health_score, 'health_status', v_profile.health_status
  ));

  return row_to_json(v_profile)::jsonb;
end; $$;

create or replace function public.create_success_intervention(
  p_intervention_type text,
  p_playbook_key text default null,
  p_rationale text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.success_interventions;
begin
  perform public._irp_require_permission('success.intervene');
  v_org_id := public._mta_require_organization();

  insert into public.success_interventions (organization_id, playbook_key, intervention_type, rationale, priority)
  values (
    v_org_id, p_playbook_key, p_intervention_type, p_rationale,
    case p_intervention_type when 'renewal_outreach' then 'critical' when 'escalation' then 'important' else 'routine' end
  )
  returning * into v_row;

  perform public._cse_log(v_org_id, 'success_intervention_created', 'intervention', v_row.id, jsonb_build_object(
    'intervention_type', p_intervention_type
  ));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.get_customer_success_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_profile public.organization_customer_success;
begin
  perform public._irp_require_permission('success.view');
  v_org_id := public._mta_require_organization();
  v_profile := public._cse_ensure_profile(v_org_id);
  perform public._cse_seed_org_content(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Customer success through adoption tracking, health scoring, and proactive interventions — metadata only, no PII.',
    'principles', jsonb_build_array(
      'Health status: excellent, healthy, at_risk, critical',
      'Adoption and satisfaction scores drive renewal risk detection',
      'Playbook-driven interventions with human assignment',
      'Milestone tracking across onboarding and adoption',
      'Integrates with onboarding (A.10) and subscription (A.11)'
    ),
    'profile', row_to_json(v_profile),
    'summary', jsonb_build_object(
      'health_score', v_profile.health_score,
      'health_status', v_profile.health_status,
      'adoption_score', v_profile.adoption_score,
      'satisfaction_score', v_profile.satisfaction_score,
      'renewal_risk', v_profile.renewal_risk,
      'pending_interventions', coalesce((select count(*) from public.success_interventions where organization_id = v_org_id and status in ('pending', 'in_progress')), 0),
      'milestones_achieved', coalesce((select count(*) from public.success_milestones where organization_id = v_org_id and achieved), 0)
    ),
    'interventions', coalesce((
      select jsonb_agg(row_to_json(i) order by
        case i.priority when 'critical' then 0 when 'important' then 1 else 2 end, i.created_at desc)
      from public.success_interventions i where i.organization_id = v_org_id
    ), '[]'::jsonb),
    'milestones', coalesce((
      select jsonb_agg(row_to_json(m) order by m.achieved, m.milestone_key)
      from public.success_milestones m where m.organization_id = v_org_id
    ), '[]'::jsonb),
    'playbooks', coalesce((
      select jsonb_agg(row_to_json(p) order by p.playbook_key)
      from public.success_playbooks p where p.status = 'active'
    ), '[]'::jsonb),
    'recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'playbook_key', sp.playbook_key,
        'playbook_title', sp.playbook_title,
        'trigger_condition', sp.trigger_condition,
        'recommended_actions', sp.recommended_actions
      ))
      from public.success_playbooks sp
      where sp.status = 'active'
        and (
          (sp.playbook_key = 'low_adoption' and v_profile.adoption_score < 50)
          or (sp.playbook_key = 'satisfaction_drop' and v_profile.satisfaction_score < 60)
          or (sp.playbook_key = 'renewal_risk_high' and v_profile.renewal_risk in ('high', 'critical'))
          or (sp.playbook_key = 'onboarding_stalled' and v_profile.onboarding_status = 'stalled')
        )
    ), '[]'::jsonb)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_customer_success_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_profile public.organization_customer_success;
begin
  v_org_id := public._mta_require_organization();
  v_profile := public._cse_ensure_profile(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'health_score', v_profile.health_score,
    'health_status', v_profile.health_status,
    'renewal_risk', v_profile.renewal_risk,
    'philosophy', 'Proactive customer success with health scoring and interventions.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

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
    'success_health_assessed', 'success_intervention_created'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

select public._cse_seed_playbooks();

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._cse_seed_org_content(v_org_id);
  end loop;
end $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'customer-success-engine', 'Customer Success Engine', 'Health scoring, adoption tracking, interventions, and renewal risk detection.', 'authenticated', 69
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'customer-success-engine' and tenant_id is null);

grant execute on function public.assess_customer_success_health() to authenticated;
grant execute on function public.create_success_intervention(text, text, text) to authenticated;
grant execute on function public.get_customer_success_engine_dashboard() to authenticated;
grant execute on function public.get_customer_success_engine_card() to authenticated;
