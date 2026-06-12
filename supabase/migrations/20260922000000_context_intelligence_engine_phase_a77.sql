-- Phase A.77 — Context Intelligence Engine
-- Organizational ABOS context intelligence — distinct from Phase 35 Context Engine (calendars/UCL).
-- Integrates Organization & Workspace (A.75), Organizational Memory (A.34), Human Oversight (A.40).
-- Self Love (A.76) monitors context quality.

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
    'marketplace_partner_ecosystem_foundation_engine',
    'ai_ethics_responsible_use_engine',
    'change_management_engine',
    'value_realization_engine',
    'organizational_resilience_engine',
    'incident_response_coordination_engine',
    'service_level_commitment_engine',
    'stakeholder_communication_engine',
    'organizational_decision_support_engine',
    'strategic_alignment_engine',
    'organizational_health_engine',
    'capability_maturity_engine',
    'organizational_benchmarking_engine',
    'document_output_engine',
    'records_retention_management_engine',
    'meeting_collaboration_intelligence_engine',
    'unified_task_follow_up_engine',
    'resource_planning_engine',
    'capacity_workload_management_engine',
    'goals_okr_engine',
    'predictive_insights_engine',
    'personal_productivity_engine',
    'companion_presence_indicator_engine',
    'cross_tenant_intelligence_engine',
    'partner_success_engine',
    'trust_reputation_engine',
    'ai_cost_governance_engine',
    'organization_workspace_engine',
    'context_intelligence_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_context_intelligence_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_context_intelligence_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  proactive_level text not null default 'balanced' check (
    proactive_level in ('minimal', 'balanced', 'proactive')
  ),
  gap_detection_enabled boolean not null default true,
  dimension_weights jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_context_intelligence_settings enable row level security;
revoke all on public.organization_context_intelligence_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_context_gaps
-- ---------------------------------------------------------------------------
create table if not exists public.organization_context_gaps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  gap_type text not null check (
    gap_type in (
      'missing_structure', 'stale_context', 'permission_ambiguity',
      'operational_blind_spot', 'historical_gap', 'strategic_misalignment',
      'temporal_conflict', 'integration_gap'
    )
  ),
  dimension text not null check (
    dimension in (
      'organizational', 'workspace', 'user', 'historical',
      'operational', 'permission', 'strategic', 'temporal'
    )
  ),
  summary text not null check (char_length(summary) <= 500),
  severity text not null default 'medium' check (
    severity in ('low', 'medium', 'high', 'critical')
  ),
  status text not null default 'open' check (
    status in ('open', 'acknowledged', 'resolved', 'dismissed')
  ),
  detected_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references public.users (id) on delete set null,
  resolution_note text check (resolution_note is null or char_length(resolution_note) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_context_gaps_org_status_idx
  on public.organization_context_gaps (organization_id, status, severity);

create index if not exists organization_context_gaps_dimension_idx
  on public.organization_context_gaps (organization_id, dimension, status);

alter table public.organization_context_gaps enable row level security;
revoke all on public.organization_context_gaps from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'context_intelligence', v.description
from (values
  ('context_intelligence.view', 'View Context Intelligence', 'View organizational context dimensions and gaps'),
  ('context_intelligence.manage', 'Manage Context Intelligence', 'Configure context intelligence settings and proactive levels'),
  ('context_intelligence.gaps.resolve', 'Resolve Context Gaps', 'Acknowledge and resolve detected context gaps')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'context_intelligence.view'), ('owner', 'context_intelligence.manage'), ('owner', 'context_intelligence.gaps.resolve'),
  ('administrator', 'context_intelligence.view'), ('administrator', 'context_intelligence.manage'), ('administrator', 'context_intelligence.gaps.resolve'),
  ('manager', 'context_intelligence.view'), ('manager', 'context_intelligence.gaps.resolve'),
  ('support_agent', 'context_intelligence.view'),
  ('viewer', 'context_intelligence.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 4. Helpers (_cie_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._cie_ensure_settings(p_organization_id uuid)
returns public.organization_context_intelligence_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_context_intelligence_settings;
begin
  insert into public.organization_context_intelligence_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;
  select * into v_row from public.organization_context_intelligence_settings where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._cie_truncate_summary(p_text text)
returns text language sql immutable as $$
  select left(coalesce(trim(p_text), ''), 500);
$$;

create or replace function public._cie_gap_json(g public.organization_context_gaps)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', g.id,
    'organization_id', g.organization_id,
    'gap_type', g.gap_type,
    'dimension', g.dimension,
    'summary', g.summary,
    'severity', g.severity,
    'status', g.status,
    'detected_at', g.detected_at,
    'resolved_at', g.resolved_at,
    'resolved_by', g.resolved_by,
    'resolution_note', g.resolution_note,
    'created_at', g.created_at,
    'updated_at', g.updated_at
  );
$$;

create or replace function public._cie_log(
  p_organization_id uuid,
  p_action text,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action, 'context_intelligence', null, false, false, null,
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('metadata_only', true)
  );
end; $$;

create or replace function public._cie_signal_counts(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_users int := 0;
  v_workspaces int := 0;
  v_workspace_members int := 0;
  v_memory_records int := 0;
  v_decisions int := 0;
  v_pending_approvals int := 0;
  v_tasks int := 0;
  v_role_permissions int := 0;
  v_objectives int := 0;
  v_calendar_events int := 0;
  v_workspace_contexts int := 0;
begin
  select count(*) into v_org_users
  from public.organization_users
  where organization_id = p_organization_id and status = 'active';

  select count(*) into v_workspaces
  from public.organization_workspaces
  where organization_id = p_organization_id and status = 'active';

  select count(*) into v_workspace_members
  from public.workspace_members wm
  join public.organization_workspaces w on w.id = wm.workspace_id
  where w.organization_id = p_organization_id and wm.status = 'active';

  select count(*) into v_memory_records
  from public.organization_memory_records
  where organization_id = p_organization_id and status = 'active';

  select count(*) into v_decisions
  from public.organization_decision_register
  where organization_id = p_organization_id and status = 'active';

  select count(*) into v_pending_approvals
  from public.organization_oversight_approvals
  where organization_id = p_organization_id and approval_status = 'pending';

  if to_regclass('public.organization_tasks') is not null then
    execute $q$
      select count(*) from public.organization_tasks
      where organization_id = $1 and status not in ('completed', 'cancelled')
    $q$ into v_tasks using p_organization_id;
  end if;

  select count(*) into v_role_permissions
  from public.organization_role_permissions
  where organization_id = p_organization_id;

  if to_regclass('public.organization_objectives') is not null then
    execute $q$
      select count(*) from public.organization_objectives
      where organization_id = $1 and status = 'active'
    $q$ into v_objectives using p_organization_id;
  end if;

  if to_regclass('public.calendar_events') is not null then
    execute $q$
      select count(*) from public.calendar_events
      where tenant_id = $1 and starts_at >= now() - interval '30 days'
    $q$ into v_calendar_events using p_organization_id;
  end if;

  select count(*) into v_workspace_contexts
  from public.workspace_user_context
  where organization_id = p_organization_id;

  return jsonb_build_object(
    'org_users', v_org_users,
    'workspaces', v_workspaces,
    'workspace_members', v_workspace_members,
    'memory_records', v_memory_records,
    'decisions', v_decisions,
    'pending_approvals', v_pending_approvals,
    'open_tasks', v_tasks,
    'role_permissions', v_role_permissions,
    'objectives', v_objectives,
    'calendar_events_30d', v_calendar_events,
    'workspace_contexts', v_workspace_contexts
  );
end; $$;

create or replace function public._cie_refresh_gaps(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_settings public.organization_context_intelligence_settings;
  v_counts jsonb;
  v_ws int;
  v_mem int;
  v_users int;
  v_perms int;
begin
  v_settings := public._cie_ensure_settings(p_organization_id);
  if not v_settings.gap_detection_enabled then return; end if;

  v_counts := public._cie_signal_counts(p_organization_id);
  v_ws := coalesce((v_counts->>'workspaces')::int, 0);
  v_mem := coalesce((v_counts->>'memory_records')::int, 0);
  v_users := coalesce((v_counts->>'org_users')::int, 0);
  v_perms := coalesce((v_counts->>'role_permissions')::int, 0);

  if v_ws = 0 and not exists (
    select 1 from public.organization_context_gaps
    where organization_id = p_organization_id and dimension = 'workspace'
      and gap_type = 'missing_structure' and status in ('open', 'acknowledged')
  ) then
    insert into public.organization_context_gaps (
      organization_id, gap_type, dimension, summary, severity
    ) values (
      p_organization_id, 'missing_structure', 'workspace',
      'No active workspaces detected — operational context may be undefined.',
      'high'
    );
  end if;

  if v_mem = 0 and not exists (
    select 1 from public.organization_context_gaps
    where organization_id = p_organization_id and dimension = 'historical'
      and gap_type = 'historical_gap' and status in ('open', 'acknowledged')
  ) then
    insert into public.organization_context_gaps (
      organization_id, gap_type, dimension, summary, severity
    ) values (
      p_organization_id, 'historical_gap', 'historical',
      'No organizational memory records — historical context may be limited.',
      'medium'
    );
  end if;

  if v_users <= 1 and not exists (
    select 1 from public.organization_context_gaps
    where organization_id = p_organization_id and dimension = 'user'
      and gap_type = 'operational_blind_spot' and status in ('open', 'acknowledged')
  ) then
    insert into public.organization_context_gaps (
      organization_id, gap_type, dimension, summary, severity
    ) values (
      p_organization_id, 'operational_blind_spot', 'user',
      'Single active user — collaboration and role context may be incomplete.',
      'low'
    );
  end if;

  if v_perms = 0 and not exists (
    select 1 from public.organization_context_gaps
    where organization_id = p_organization_id and dimension = 'permission'
      and gap_type = 'permission_ambiguity' and status in ('open', 'acknowledged')
  ) then
    insert into public.organization_context_gaps (
      organization_id, gap_type, dimension, summary, severity
    ) values (
      p_organization_id, 'permission_ambiguity', 'permission',
      'No role permissions configured — access context may be ambiguous.',
      'high'
    );
  end if;
end; $$;

create or replace function public._cie_context_dimensions(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_counts jsonb;
begin
  v_counts := public._cie_signal_counts(p_organization_id);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'organizational',
      'label', 'Organizational Context',
      'description', 'Tenant structure, membership, and organization-level defaults.',
      'signal_summary', jsonb_build_object(
        'active_users', coalesce((v_counts->>'org_users')::int, 0),
        'role_permissions', coalesce((v_counts->>'role_permissions')::int, 0)
      )
    ),
    jsonb_build_object(
      'key', 'workspace',
      'label', 'Workspace Context',
      'description', 'Isolated operational contexts within the organization.',
      'signal_summary', jsonb_build_object(
        'active_workspaces', coalesce((v_counts->>'workspaces')::int, 0),
        'active_members', coalesce((v_counts->>'workspace_members')::int, 0),
        'active_contexts', coalesce((v_counts->>'workspace_contexts')::int, 0)
      )
    ),
    jsonb_build_object(
      'key', 'user',
      'label', 'User Context',
      'description', 'Who is acting, their roles, and active workspace selection.',
      'signal_summary', jsonb_build_object(
        'active_users', coalesce((v_counts->>'org_users')::int, 0),
        'workspace_selections', coalesce((v_counts->>'workspace_contexts')::int, 0)
      )
    ),
    jsonb_build_object(
      'key', 'historical',
      'label', 'Historical Context',
      'description', 'Organizational memory, precedents, and past decisions.',
      'signal_summary', jsonb_build_object(
        'memory_records', coalesce((v_counts->>'memory_records')::int, 0),
        'active_decisions', coalesce((v_counts->>'decisions')::int, 0)
      )
    ),
    jsonb_build_object(
      'key', 'operational',
      'label', 'Operational Context',
      'description', 'Tasks, approvals, and in-flight operational activity.',
      'signal_summary', jsonb_build_object(
        'open_tasks', coalesce((v_counts->>'open_tasks')::int, 0),
        'pending_approvals', coalesce((v_counts->>'pending_approvals')::int, 0)
      )
    ),
    jsonb_build_object(
      'key', 'permission',
      'label', 'Permission Context',
      'description', 'Role permissions and access boundaries for safe assistance.',
      'signal_summary', jsonb_build_object(
        'org_role_permissions', coalesce((v_counts->>'role_permissions')::int, 0)
      )
    ),
    jsonb_build_object(
      'key', 'strategic',
      'label', 'Strategic Context',
      'description', 'Goals, OKRs, and strategic alignment signals.',
      'signal_summary', jsonb_build_object(
        'active_objectives', coalesce((v_counts->>'objectives')::int, 0),
        'decision_register', coalesce((v_counts->>'decisions')::int, 0)
      )
    ),
    jsonb_build_object(
      'key', 'temporal',
      'label', 'Temporal Context',
      'description', 'Time-bound signals — calendars, deadlines, and scheduling context.',
      'signal_summary', jsonb_build_object(
        'calendar_events_30d', coalesce((v_counts->>'calendar_events_30d')::int, 0),
        'note', 'Phase 35 Context Engine provides personal calendar orchestration — distinct from organizational context.'
      )
    )
  );
end; $$;

create or replace function public._cie_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'context_engine_phase35', jsonb_build_object(
      'route', '/app/assistant/context',
      'engine', 'Context Engine (Phase 35)',
      'note', 'Calendars and UCL — personal scheduling, not organizational ABOS context.',
      'metadata_only', true
    ),
    'organizational_memory', jsonb_build_object(
      'route', '/app/organizational-memory-engine',
      'engine', 'Organizational Memory (A.34)',
      'metadata_only', true
    ),
    'organization_workspace', jsonb_build_object(
      'route', '/app/organization-workspace-engine',
      'engine', 'Organization & Workspace (A.75)',
      'metadata_only', true
    ),
    'human_oversight', jsonb_build_object(
      'route', '/app/human-oversight-engine',
      'engine', 'Human Oversight (A.40)',
      'metadata_only', true
    )
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.list_organization_context_gaps(
  p_status text default 'open',
  p_limit int default 50
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('context_intelligence.view');
  v_org_id := public._mta_require_organization();
  perform public._cie_refresh_gaps(v_org_id);

  return coalesce((
    select jsonb_agg(public._cie_gap_json(g) order by
      case g.severity when 'critical' then 0 when 'high' then 1 when 'medium' then 2 else 3 end,
      g.detected_at desc
    )
    from public.organization_context_gaps g
    where g.organization_id = v_org_id
      and (p_status is null or g.status = p_status)
    limit greatest(1, least(p_limit, 100))
  ), '[]'::jsonb);
end; $$;

create or replace function public.resolve_organization_context_gap(
  p_gap_id uuid,
  p_resolution_note text default null,
  p_status text default 'resolved'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_context_gaps;
begin
  perform public._irp_require_permission('context_intelligence.gaps.resolve');
  v_org_id := public._mta_require_organization();

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  update public.organization_context_gaps g
  set
    status = coalesce(nullif(trim(p_status), ''), 'resolved'),
    resolution_note = public._cie_truncate_summary(p_resolution_note),
    resolved_at = now(),
    resolved_by = v_user_id,
    updated_at = now()
  where g.id = p_gap_id and g.organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Context gap not found'; end if;

  perform public._cie_log(v_org_id, 'cie_gap_resolved', jsonb_build_object(
    'gap_id', v_row.id,
    'dimension', v_row.dimension,
    'gap_type', v_row.gap_type,
    'status', v_row.status
  ));

  return public._cie_gap_json(v_row);
end; $$;

create or replace function public.get_context_intelligence_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_context_intelligence_settings;
  v_open_gaps int;
begin
  perform public._irp_require_permission('context_intelligence.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._cie_ensure_settings(v_org_id);
  perform public._cie_refresh_gaps(v_org_id);

  select count(*) into v_open_gaps
  from public.organization_context_gaps
  where organization_id = v_org_id and status in ('open', 'acknowledged');

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Context before assistance — Aipify understands the situation so recommendations reach the right people at the right time.',
    'mission', 'Right assistance, right people, right time, right context.',
    'abos_principle', 'ABOS composes organizational intelligence from structure, memory, permissions, and operational signals — never from raw customer content.',
    'self_love_note', 'Self Love (A.76) monitors context quality — stale dimensions, contradictions, and gap patterns — and suggests improvements without compromising privacy.',
    'principles', jsonb_build_array(
      'Eight context dimensions — organizational through temporal',
      'Metadata-only gap summaries — no PII or raw conversations',
      'Integrates Workspace (A.75), Memory (A.34), and Oversight (A.40)',
      'Distinct from Phase 35 Context Engine (calendars/UCL)',
      'Proactive levels configurable — humans retain control'
    ),
    'settings', row_to_json(v_settings)::jsonb,
    'summary', jsonb_build_object(
      'open_gaps', v_open_gaps,
      'dimensions_monitored', 8,
      'proactive_level', v_settings.proactive_level,
      'gap_detection_enabled', v_settings.gap_detection_enabled
    ),
    'context_dimensions', public._cie_context_dimensions(v_org_id),
    'context_gaps', public.list_organization_context_gaps('open', 20),
    'integration_links', public._cie_integration_links(),
    'privacy_note', 'Context Intelligence stores metadata summaries only. No raw email, chat, or PII.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_context_intelligence_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('context_intelligence.view');
  v_org_id := public._mta_require_organization();
  perform public._cie_refresh_gaps(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'open_gaps', coalesce((
      select count(*) from public.organization_context_gaps
      where organization_id = v_org_id and status in ('open', 'acknowledged')
    ), 0),
    'dimensions_monitored', 8,
    'philosophy', 'Organizational context intelligence — metadata only.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.export_context_intelligence_summary(p_format text default 'json')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_context_intelligence_settings;
begin
  perform public._irp_require_permission('context_intelligence.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._cie_ensure_settings(v_org_id);
  perform public._cie_refresh_gaps(v_org_id);

  perform public._cie_log(v_org_id, 'cie_summary_exported', jsonb_build_object(
    'format', coalesce(p_format, 'json')
  ));

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'context_intelligence',
    'format', coalesce(p_format, 'json'),
    'settings', row_to_json(v_settings)::jsonb,
    'summary', jsonb_build_object(
      'open_gaps', coalesce((
        select count(*) from public.organization_context_gaps
        where organization_id = v_org_id and status in ('open', 'acknowledged')
      ), 0),
      'dimensions_monitored', 8
    ),
    'context_dimensions', public._cie_context_dimensions(v_org_id),
    'context_gaps', public.list_organization_context_gaps(null, 100),
    'integration_links', public._cie_integration_links(),
    'privacy_note', 'Metadata-only export — no PII.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Audit allowlist extension
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
    'owe_workspace_created', 'owe_workspace_updated', 'owe_workspace_archived',
    'owe_workspace_switched', 'owe_member_invited', 'owe_member_updated',
    'owe_custom_role_created', 'owe_org_permissions_saved', 'owe_summary_exported',
    'cie_gap_detected', 'cie_gap_resolved', 'cie_settings_changed', 'cie_summary_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed'
    or p_action_type like 'owe_%' or p_action_type like 'cie_%';
$$;

-- ---------------------------------------------------------------------------
-- 7. KC category seed
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'context-intelligence-engine', 'Context Intelligence Engine',
  'Organizational ABOS context intelligence — eight dimensions, gap detection, and integration with Memory, Workspace, and Oversight.',
  'authenticated', 101
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'context-intelligence-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 8. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_context_intelligence_engine_dashboard() to authenticated;
grant execute on function public.get_context_intelligence_engine_card() to authenticated;
grant execute on function public.list_organization_context_gaps(text, int) to authenticated;
grant execute on function public.resolve_organization_context_gap(uuid, text, text) to authenticated;
grant execute on function public.export_context_intelligence_summary(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 9. Settings seed
-- ---------------------------------------------------------------------------
do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._cie_ensure_settings(v_org_id);
  end loop;
end $$;
