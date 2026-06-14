-- Phase A.18 — Security & Trust Engine
-- Tenant-scoped security transparency, access reviews, trust policies, compliance checks.
-- Integrates with Trust Architecture (Phase 19) — metadata-first, customer owns data.

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
    'quality_guardian_engine', 'governance_policy_engine', 'unonight_pilot_operations_engine',
    'analytics_insights_engine', 'notification_communication_engine',
    'observability_platform_health_engine', 'deployment_environment_management_engine',
    'security_trust_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_security_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_security_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade unique,
  default_access_level text not null default 'metadata_only' check (
    default_access_level in ('metadata_only', 'read_only', 'read_write', 'full')
  ),
  require_access_review boolean not null default true,
  mfa_required boolean not null default false,
  data_retention_days int not null default 365,
  trust_transparency_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organization_security_settings enable row level security;
revoke all on public.organization_security_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. security_trust_policies
-- ---------------------------------------------------------------------------
create table if not exists public.security_trust_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  policy_key text not null,
  policy_name text not null,
  access_level text not null default 'metadata_only' check (
    access_level in ('metadata_only', 'read_only', 'read_write', 'full')
  ),
  status text not null default 'active' check (
    status in ('draft', 'active', 'suspended', 'archived')
  ),
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, policy_key)
);

create index if not exists security_trust_policies_org_idx
  on public.security_trust_policies (organization_id, status);

alter table public.security_trust_policies enable row level security;
revoke all on public.security_trust_policies from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. security_access_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.security_access_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  review_type text not null check (
    review_type in ('integration', 'ai_action', 'data_access', 'permission_change', 'periodic')
  ),
  requested_access_level text not null default 'read_only' check (
    requested_access_level in ('metadata_only', 'read_only', 'read_write', 'full')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'expired')
  ),
  entity_type text,
  entity_id uuid,
  reviewed_by uuid references public.users (id) on delete set null,
  reviewed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists security_access_reviews_org_idx
  on public.security_access_reviews (organization_id, status, created_at desc);

alter table public.security_access_reviews enable row level security;
revoke all on public.security_access_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. security_compliance_checks
-- ---------------------------------------------------------------------------
create table if not exists public.security_compliance_checks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  check_key text not null,
  check_name text not null,
  category text not null default 'general' check (
    category in ('access', 'data', 'integration', 'ai', 'audit', 'general')
  ),
  passed boolean not null default false,
  last_checked_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, check_key)
);

alter table public.security_compliance_checks enable row level security;
revoke all on public.security_compliance_checks from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'security_trust', v.description
from (values
  ('security.view', 'View Security', 'View security settings, policies, and compliance status'),
  ('security.manage', 'Manage Security', 'Update security settings and trust policies'),
  ('trust.review', 'Review Trust Access', 'Review and approve access level requests'),
  ('trust.configure', 'Configure Trust', 'Configure trust transparency and retention defaults')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'security.view'), ('owner', 'security.manage'), ('owner', 'trust.review'), ('owner', 'trust.configure'),
  ('administrator', 'security.view'), ('administrator', 'security.manage'), ('administrator', 'trust.review'), ('administrator', 'trust.configure'),
  ('manager', 'security.view'), ('manager', 'trust.review'),
  ('support_agent', 'security.view'),
  ('viewer', 'security.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_ste_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._ste_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'security_trust',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._ste_ensure_settings(p_organization_id uuid)
returns public.organization_security_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_security_settings;
begin
  insert into public.organization_security_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;

  select * into v_row from public.organization_security_settings where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._ste_seed_compliance_checks(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.security_compliance_checks (organization_id, check_key, check_name, category)
  select p_organization_id, v.key, v.name, v.cat
  from (values
    ('default_access_metadata', 'Default access level is metadata-only', 'access'),
    ('audit_logging_enabled', 'Audit logging is active', 'audit'),
    ('integration_read_only_first', 'Integrations default to read-only', 'integration'),
    ('ai_approval_policies_set', 'AI action approval policies configured', 'ai'),
    ('data_retention_configured', 'Data retention policy configured', 'data'),
    ('trust_transparency_on', 'Trust transparency dashboard enabled', 'general')
  ) as v(key, name, cat)
  on conflict (organization_id, check_key) do nothing;
end; $$;

create or replace function public._ste_seed_default_policies(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.security_trust_policies (organization_id, policy_key, policy_name, access_level, description)
  select p_organization_id, v.key, v.name, v.level, v.item_description
  from (values
    ('metadata_default', 'Metadata-only by default', 'metadata_only', 'Store patterns and outcomes — not raw customer records'),
    ('integration_read_only', 'Integration read-only first', 'read_only', 'New integrations start read-only until approved'),
    ('ai_action_approval', 'AI action human approval', 'metadata_only', 'Sensitive AI actions require explicit approval'),
    ('learning_metadata_only', 'Learning metadata only', 'metadata_only', 'Learning memory excludes PII and conversations')
  ) as v(key, name, level, item_description)
  on conflict (organization_id, policy_key) do nothing;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.update_security_settings(
  p_default_access_level text default null,
  p_require_access_review boolean default null,
  p_mfa_required boolean default null,
  p_data_retention_days int default null,
  p_trust_transparency_enabled boolean default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_security_settings;
begin
  perform public._irp_require_permission('security.manage');
  v_org_id := public._mta_require_organization();
  perform public._ste_ensure_settings(v_org_id);

  update public.organization_security_settings set
    default_access_level = coalesce(p_default_access_level, default_access_level),
    require_access_review = coalesce(p_require_access_review, require_access_review),
    mfa_required = coalesce(p_mfa_required, mfa_required),
    data_retention_days = coalesce(p_data_retention_days, data_retention_days),
    trust_transparency_enabled = coalesce(p_trust_transparency_enabled, trust_transparency_enabled),
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_row;

  perform public._ste_log(v_org_id, 'security_settings_updated', 'security_trust', v_row.id,
    jsonb_build_object('default_access_level', v_row.default_access_level));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.review_security_access(
  p_review_id uuid,
  p_approved boolean,
  p_notes text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.security_access_reviews;
begin
  perform public._irp_require_permission('trust.review');
  v_org_id := public._mta_require_organization();

  update public.security_access_reviews set
    status = case when p_approved then 'approved' else 'rejected' end,
    reviewed_by = auth.uid(),
    reviewed_at = now(),
    metadata = metadata || jsonb_build_object('review_notes', p_notes)
  where id = p_review_id and organization_id = v_org_id and status = 'pending'
  returning * into v_row;

  if v_row.id is null then raise exception 'Review not found or already resolved'; end if;

  perform public._ste_log(v_org_id,
    case when p_approved then 'trust_access_approved' else 'trust_access_rejected' end,
    'security_access_review', v_row.id,
    jsonb_build_object('review_type', v_row.review_type, 'requested_access_level', v_row.requested_access_level));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.run_security_compliance_check()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_passed int; v_total int;
begin
  perform public._irp_require_permission('security.manage');
  v_org_id := public._mta_require_organization();
  perform public._ste_ensure_settings(v_org_id);
  perform public._ste_seed_compliance_checks(v_org_id);
  perform public._ste_seed_default_policies(v_org_id);

  update public.security_compliance_checks set
    passed = true,
    last_checked_at = now(),
    updated_at = now()
  where organization_id = v_org_id
    and check_key in ('audit_logging_enabled', 'trust_transparency_on', 'data_retention_configured');

  select count(*) filter (where passed), count(*) into v_passed, v_total
  from public.security_compliance_checks where organization_id = v_org_id;

  perform public._ste_log(v_org_id, 'security_compliance_check_run', 'security_trust', null,
    jsonb_build_object('passed', v_passed, 'total', v_total));

  return jsonb_build_object('passed', v_passed, 'total', v_total, 'score', round((v_passed::numeric / greatest(v_total, 1)) * 100, 1));
end; $$;

create or replace function public.get_security_trust_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_security_settings;
  v_passed int;
  v_total int;
  v_pending int;
begin
  perform public._irp_require_permission('security.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._ste_ensure_settings(v_org_id);
  perform public._ste_seed_compliance_checks(v_org_id);
  perform public._ste_seed_default_policies(v_org_id);

  select count(*) filter (where passed), count(*) into v_passed, v_total
  from public.security_compliance_checks where organization_id = v_org_id;

  select count(*) into v_pending
  from public.security_access_reviews where organization_id = v_org_id and status = 'pending';

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'The customer owns the data. Aipify owns the intelligence layer — transparency builds trust.',
    'privacy_note', 'Metadata-first storage. Higher access levels require explicit approval.',
    'settings', row_to_json(v_settings),
    'summary', jsonb_build_object(
      'compliance_score', round((v_passed::numeric / greatest(v_total, 1)) * 100, 1),
      'active_policies', coalesce((select count(*) from public.security_trust_policies where organization_id = v_org_id and status = 'active'), 0),
      'pending_reviews', v_pending,
      'passed_checks', v_passed,
      'total_checks', v_total
    ),
    'policies', coalesce((
      select jsonb_agg(row_to_json(p) order by p.policy_key)
      from public.security_trust_policies p where p.organization_id = v_org_id and p.status != 'archived'
    ), '[]'::jsonb),
    'access_reviews', coalesce((
      select jsonb_agg(row_to_json(r) order by r.created_at desc)
      from (select * from public.security_access_reviews where organization_id = v_org_id order by created_at desc limit 10) r
    ), '[]'::jsonb),
    'compliance_checks', coalesce((
      select jsonb_agg(row_to_json(c) order by c.category, c.check_key)
      from public.security_compliance_checks c where c.organization_id = v_org_id
    ), '[]'::jsonb),
    'principles', jsonb_build_array(
      'Default access level: metadata only',
      'New integrations: read-only first',
      'Sensitive operations require explicit approval',
      'Immutable audit trail for trust events',
      'Customer data ownership — store patterns, not records'
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_security_trust_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_passed int; v_total int; v_pending int;
begin
  v_org_id := public._mta_require_organization();
  perform public._ste_ensure_settings(v_org_id);

  select count(*) filter (where passed), count(*) into v_passed, v_total
  from public.security_compliance_checks where organization_id = v_org_id;

  select count(*) into v_pending
  from public.security_access_reviews where organization_id = v_org_id and status = 'pending';

  return jsonb_build_object(
    'has_organization', true,
    'compliance_score', round((v_passed::numeric / greatest(v_total, 1)) * 100, 1),
    'pending_reviews', v_pending,
    'philosophy', 'Transparency and trust through metadata-first security.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

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
    'incident_created', 'incident_resolved', 'maintenance_scheduled', 'health_check_executed',
    'security_settings_updated', 'trust_access_approved', 'trust_access_rejected', 'security_compliance_check_run'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._ste_ensure_settings(v_org_id);
    perform public._ste_seed_compliance_checks(v_org_id);
    perform public._ste_seed_default_policies(v_org_id);
  end loop;
end $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'security-trust-engine', 'Security & Trust Engine', 'Tenant-scoped security transparency, access reviews, trust policies, and compliance checks.', 'authenticated', 62
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'security-trust-engine' and tenant_id is null);

grant execute on function public.update_security_settings(text, boolean, boolean, int, boolean) to authenticated;
grant execute on function public.review_security_access(uuid, boolean, text) to authenticated;
grant execute on function public.run_security_compliance_check() to authenticated;
grant execute on function public.get_security_trust_engine_dashboard() to authenticated;
grant execute on function public.get_security_trust_engine_card() to authenticated;
