-- Phase A.45 — Marketplace & Partner Ecosystem Foundation Engine
-- Extends Module Marketplace (A.23), Business Packs (A.43), API Platform scaffold (A.21).

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
    'industry_intelligence_foundation_engine',
    'marketplace_partner_ecosystem_foundation_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. partners (ecosystem catalog)
-- ---------------------------------------------------------------------------
create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  partner_name text not null,
  partner_type text not null default 'developer' check (
    partner_type in ('developer', 'agency', 'consultant', 'integrator', 'training_provider', 'internal')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'suspended', 'retired')
  ),
  certification_level text not null default 'registered' check (
    certification_level in ('registered', 'certified', 'advanced', 'strategic')
  ),
  website text,
  submitted_by_organization_id uuid references public.organizations (id) on delete set null,
  reviewed_by uuid references public.users (id) on delete set null,
  review_notes text,
  quality_score int check (quality_score is null or (quality_score >= 0 and quality_score <= 100)),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists partners_status_idx on public.partners (status, certification_level);
create index if not exists partners_type_idx on public.partners (partner_type, status);

alter table public.partners enable row level security;
revoke all on public.partners from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. marketplace_offerings
-- ---------------------------------------------------------------------------
create table if not exists public.marketplace_offerings (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners (id) on delete cascade,
  offering_type text not null check (
    offering_type in (
      'business_packs', 'workflow_templates', 'training_content',
      'integrations', 'industry_templates', 'consulting_services'
    )
  ),
  title text not null,
  description text,
  version text not null default '1.0.0',
  status text not null default 'draft' check (
    status in ('draft', 'pending', 'published', 'suspended', 'retired')
  ),
  quality_indicator text check (
    quality_indicator is null or quality_indicator in ('excellent', 'good', 'acceptable', 'needs_review')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists marketplace_offerings_partner_idx
  on public.marketplace_offerings (partner_id, status, offering_type);

alter table public.marketplace_offerings enable row level security;
revoke all on public.marketplace_offerings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'partner_ecosystem', v.description
from (values
  ('ecosystem.view', 'View Partner Ecosystem', 'View approved partners, offerings, and certification status'),
  ('ecosystem.manage', 'Manage Partner Ecosystem', 'Submit partners and offerings for review'),
  ('ecosystem.approve', 'Approve Partners', 'Approve partner applications and offering publications'),
  ('ecosystem.suspend', 'Suspend Partners', 'Suspend partners and offerings with audit trail')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'ecosystem.view'), ('owner', 'ecosystem.manage'), ('owner', 'ecosystem.approve'), ('owner', 'ecosystem.suspend'),
  ('administrator', 'ecosystem.view'), ('administrator', 'ecosystem.manage'), ('administrator', 'ecosystem.approve'), ('administrator', 'ecosystem.suspend'),
  ('manager', 'ecosystem.view'), ('manager', 'ecosystem.manage'),
  ('viewer', 'ecosystem.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 4. Helpers (_mpfe_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._mpfe_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'partner_ecosystem',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._mpfe_seed_partners()
returns void language plpgsql security definer set search_path = public as $$
declare v_partner_id uuid;
begin
  insert into public.partners (partner_name, partner_type, status, certification_level, website, quality_score)
  values
    ('Nordic Commerce Partners', 'integrator', 'approved', 'certified', 'https://example.com/nordic-commerce', 88),
    ('Workflow Studio AS', 'agency', 'approved', 'advanced', 'https://example.com/workflow-studio', 92),
    ('Aipify Training Collective', 'training_provider', 'approved', 'strategic', 'https://example.com/training', 95)
  on conflict do nothing;

  select id into v_partner_id from public.partners where partner_name = 'Nordic Commerce Partners' limit 1;
  if v_partner_id is not null then
    insert into public.marketplace_offerings (partner_id, offering_type, title, description, version, status, quality_indicator)
    values
      (v_partner_id, 'integrations', 'Shopify Connector Pack', 'Pre-built Shopify integration templates', '1.2.0', 'published', 'excellent'),
      (v_partner_id, 'business_packs', 'Nordic Retail Pack', 'Retail operations pack for Nordic markets', '1.0.0', 'published', 'good')
    on conflict do nothing;
  end if;

  select id into v_partner_id from public.partners where partner_name = 'Workflow Studio AS' limit 1;
  if v_partner_id is not null then
    insert into public.marketplace_offerings (partner_id, offering_type, title, description, version, status, quality_indicator)
    values
      (v_partner_id, 'workflow_templates', 'Support Escalation Workflow', 'Multi-step support escalation template', '2.0.0', 'published', 'excellent'),
      (v_partner_id, 'consulting_services', 'Operations Review', 'Quarterly operations optimization consulting', '1.0.0', 'published', 'good')
    on conflict do nothing;
  end if;

  select id into v_partner_id from public.partners where partner_name = 'Aipify Training Collective' limit 1;
  if v_partner_id is not null then
    insert into public.marketplace_offerings (partner_id, offering_type, title, description, version, status, quality_indicator)
    values
      (v_partner_id, 'training_content', 'Aipify Administrator Certification', 'Role-based admin training path', '3.1.0', 'published', 'excellent'),
      (v_partner_id, 'industry_templates', 'Hospitality Onboarding Template', 'Industry-specific onboarding content', '1.0.0', 'published', 'acceptable')
    on conflict do nothing;
  end if;
end; $$;

-- ---------------------------------------------------------------------------
-- 5. RPCs — approval workflow
-- ---------------------------------------------------------------------------
create or replace function public.submit_partner_for_review(
  p_partner_name text,
  p_partner_type text default 'developer',
  p_website text default null,
  p_offering jsonb default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_partner public.partners;
  v_offering public.marketplace_offerings;
begin
  perform public._irp_require_permission('ecosystem.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if coalesce(trim(p_partner_name), '') = '' then
    raise exception 'Partner name required';
  end if;

  insert into public.partners (
    partner_name, partner_type, status, certification_level, website,
    submitted_by_organization_id, reviewed_by
  )
  values (
    left(trim(p_partner_name), 200),
    coalesce(p_partner_type, 'developer'),
    'pending',
    'registered',
    left(coalesce(p_website, ''), 500),
    v_org_id,
    v_user_id
  )
  returning * into v_partner;

  if p_offering is not null and p_offering ? 'title' then
    insert into public.marketplace_offerings (
      partner_id, offering_type, title, description, version, status
    )
    values (
      v_partner.id,
      coalesce(p_offering->>'offering_type', 'integrations'),
      left(p_offering->>'title', 200),
      left(coalesce(p_offering->>'description', ''), 2000),
      coalesce(p_offering->>'version', '1.0.0'),
      'pending'
    )
    returning * into v_offering;
  end if;

  perform public._mpfe_log(
    v_org_id, 'partner_submitted_for_review', 'partner', v_partner.id,
    jsonb_build_object('partner_name', v_partner.partner_name, 'partner_type', v_partner.partner_type)
  );

  return jsonb_build_object(
    'partner', row_to_json(v_partner)::jsonb,
    'offering', case when v_offering.id is not null then row_to_json(v_offering)::jsonb else null end,
    'status', 'submitted'
  );
end; $$;

create or replace function public.review_partner_application(
  p_partner_id uuid,
  p_review_notes text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_partner public.partners;
begin
  perform public._irp_require_permission('ecosystem.approve');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.partners
  set review_notes = left(coalesce(p_review_notes, review_notes, ''), 2000),
      reviewed_by = v_user_id,
      updated_at = now()
  where id = p_partner_id and status = 'pending'
  returning * into v_partner;

  if v_partner.id is null then raise exception 'Pending partner not found'; end if;

  perform public._mpfe_log(
    v_org_id, 'partner_application_reviewed', 'partner', v_partner.id,
    jsonb_build_object('partner_name', v_partner.partner_name)
  );

  return row_to_json(v_partner)::jsonb;
end; $$;

create or replace function public.approve_partner(
  p_partner_id uuid,
  p_certification_level text default 'certified'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_partner public.partners;
begin
  perform public._irp_require_permission('ecosystem.approve');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.partners
  set status = 'approved',
      certification_level = coalesce(p_certification_level, 'certified'),
      reviewed_by = v_user_id,
      updated_at = now()
  where id = p_partner_id and status in ('pending', 'suspended')
  returning * into v_partner;

  if v_partner.id is null then raise exception 'Partner not eligible for approval'; end if;

  update public.marketplace_offerings
  set status = 'published', updated_at = now()
  where partner_id = v_partner.id and status = 'pending';

  perform public._mpfe_log(
    v_org_id, 'partner_approved', 'partner', v_partner.id,
    jsonb_build_object('partner_name', v_partner.partner_name, 'certification_level', v_partner.certification_level)
  );

  return row_to_json(v_partner)::jsonb;
end; $$;

create or replace function public.suspend_partner(
  p_partner_id uuid,
  p_reason text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_partner public.partners;
begin
  perform public._irp_require_permission('ecosystem.suspend');
  v_org_id := public._mta_require_organization();

  update public.partners
  set status = 'suspended',
      review_notes = left(coalesce(p_reason, review_notes, ''), 2000),
      updated_at = now()
  where id = p_partner_id and status = 'approved'
  returning * into v_partner;

  if v_partner.id is null then raise exception 'Approved partner not found'; end if;

  update public.marketplace_offerings
  set status = 'suspended', updated_at = now()
  where partner_id = v_partner.id and status = 'published';

  perform public._mpfe_log(
    v_org_id, 'partner_suspended', 'partner', v_partner.id,
    jsonb_build_object('partner_name', v_partner.partner_name, 'reason', p_reason)
  );

  return row_to_json(v_partner)::jsonb;
end; $$;

create or replace function public.recertify_partner(
  p_partner_id uuid,
  p_certification_level text default 'certified'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_partner public.partners;
begin
  perform public._irp_require_permission('ecosystem.approve');
  v_org_id := public._mta_require_organization();

  update public.partners
  set certification_level = coalesce(p_certification_level, certification_level),
      status = case when status = 'suspended' then 'approved' else status end,
      updated_at = now()
  where id = p_partner_id and status in ('approved', 'suspended')
  returning * into v_partner;

  if v_partner.id is null then raise exception 'Partner not found for recertification'; end if;

  perform public._mpfe_log(
    v_org_id, 'partner_recertified', 'partner', v_partner.id,
    jsonb_build_object('partner_name', v_partner.partner_name, 'certification_level', v_partner.certification_level)
  );

  return row_to_json(v_partner)::jsonb;
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Dashboard & card RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_marketplace_partner_ecosystem_foundation_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('ecosystem.view');
  v_org_id := public._mta_require_organization();
  perform public._mpfe_seed_partners();

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Curated partner ecosystem — approved partners, offerings, and certification with human governance. Extends Module Marketplace (A.23), Business Packs (A.43), and API Platform (A.21).',
    'principles', jsonb_build_array(
      'Approved partners only in production views',
      'Certification levels with re-certification workflow',
      'Offering quality indicators — transparent, not hidden',
      'Full audit for approvals, suspensions, and publications',
      'Metadata only — no partner PII in dashboard'
    ),
    'summary', jsonb_build_object(
      'approved_partners', coalesce((select count(*) from public.partners where status = 'approved'), 0),
      'pending_partners', coalesce((select count(*) from public.partners where status = 'pending'), 0),
      'suspended_partners', coalesce((select count(*) from public.partners where status = 'suspended'), 0),
      'published_offerings', coalesce((select count(*) from public.marketplace_offerings where status = 'published'), 0),
      'strategic_partners', coalesce((select count(*) from public.partners where certification_level = 'strategic' and status = 'approved'), 0),
      'org_submissions', coalesce((select count(*) from public.partners where submitted_by_organization_id = v_org_id), 0)
    ),
    'approved_partners', coalesce((
      select jsonb_agg(row_to_json(p) order by
        case p.certification_level when 'strategic' then 0 when 'advanced' then 1 when 'certified' then 2 else 3 end,
        p.partner_name)
      from public.partners p where p.status = 'approved'
    ), '[]'::jsonb),
    'pending_partners', coalesce((
      select jsonb_agg(row_to_json(p) order by p.created_at desc)
      from public.partners p where p.status = 'pending'
    ), '[]'::jsonb),
    'offerings', coalesce((
      select jsonb_agg(jsonb_build_object(
        'offering', row_to_json(o),
        'partner_name', p.partner_name,
        'partner_certification', p.certification_level
      ) order by o.title)
      from public.marketplace_offerings o
      join public.partners p on p.id = o.partner_id
      where o.status = 'published' and p.status = 'approved'
    ), '[]'::jsonb),
    'certification_breakdown', coalesce((
      select jsonb_object_agg(certification_level, cnt)
      from (
        select certification_level, count(*) as cnt
        from public.partners where status = 'approved'
        group by certification_level
      ) s
    ), '{}'::jsonb),
    'quality_indicators', coalesce((
      select jsonb_object_agg(coalesce(quality_indicator, 'unrated'), cnt)
      from (
        select quality_indicator, count(*) as cnt
        from public.marketplace_offerings where status = 'published'
        group by quality_indicator
      ) s
    ), '{}'::jsonb),
    'integration_notes', jsonb_build_object(
      'module_marketplace', jsonb_build_object('route', '/app/module-marketplace-foundation-engine', 'note', 'Activate modules from marketplace catalog'),
      'business_packs', jsonb_build_object('route', '/app/business-packs-foundation-engine', 'note', 'Business pack offerings from certified partners')
    ),
    'recent_activity', coalesce((
      select jsonb_agg(jsonb_build_object(
        'action_type', al.action_type,
        'entity_type', al.entity_type,
        'created_at', al.created_at,
        'metadata', al.metadata
      ) order by al.created_at desc)
      from (
        select action_type, entity_type, created_at, metadata
        from public.audit_logs
        where organization_id = v_org_id
          and action_type in (
            'partner_submitted_for_review', 'partner_application_reviewed',
            'partner_approved', 'partner_suspended', 'partner_recertified',
            'offering_published', 'offering_suspended'
          )
        order by created_at desc
        limit 10
      ) al
    ), '[]'::jsonb)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_marketplace_partner_ecosystem_foundation_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._mpfe_seed_partners();

  return jsonb_build_object(
    'has_organization', true,
    'approved_partners', coalesce((select count(*) from public.partners where status = 'approved'), 0),
    'published_offerings', coalesce((select count(*) from public.marketplace_offerings where status = 'published'), 0),
    'pending_reviews', coalesce((select count(*) from public.partners where status = 'pending'), 0),
    'philosophy', 'Certified partner ecosystem with governed offerings.'
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
    'workflow_step_rejected', 'workflow_escalated',
    'industry_profile_assigned', 'industry_insight_overridden', 'industry_insights_toggled',
    'industry_terminology_updated', 'industry_priorities_updated', 'industry_insights_exported',
    'partner_submitted_for_review', 'partner_application_reviewed', 'partner_approved',
    'partner_suspended', 'partner_recertified', 'offering_published', 'offering_suspended'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'marketplace-partner-ecosystem-foundation-engine', 'Marketplace & Partner Ecosystem Foundation Engine', 'Partner certification, offerings, and ecosystem governance with approval workflows.', 'authenticated', 79
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'marketplace-partner-ecosystem-foundation-engine' and tenant_id is null);

select public._mpfe_seed_partners();

grant execute on function public.submit_partner_for_review(text, text, text, jsonb) to authenticated;
grant execute on function public.review_partner_application(uuid, text) to authenticated;
grant execute on function public.approve_partner(uuid, text) to authenticated;
grant execute on function public.suspend_partner(uuid, text) to authenticated;
grant execute on function public.recertify_partner(uuid, text) to authenticated;
grant execute on function public.get_marketplace_partner_ecosystem_foundation_engine_dashboard() to authenticated;
grant execute on function public.get_marketplace_partner_ecosystem_foundation_engine_card() to authenticated;
