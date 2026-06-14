-- Phase A.70 — Personal Productivity Engine
-- Per-user productivity: preferences, daily briefings, reminders, focus recommendations — metadata only.
-- Extends Desktop Companion (A.38), Meeting Intelligence (A.61), Unified Tasks (A.62 read-only), Companion Presence (A.67).
-- NOT organization_tasks (A.62 org scope) and NOT PAME personal_memories.

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
    'personal_productivity_engine',
    'companion_presence_indicator_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. personal_productivity_profiles
-- ---------------------------------------------------------------------------
create table if not exists public.personal_productivity_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  preferences jsonb not null default '{}'::jsonb,
  quiet_hours jsonb not null default '{"enabled": false, "start": "22:00", "end": "08:00"}'::jsonb,
  reminder_settings jsonb not null default '{"channels": ["in_app"], "lead_minutes": 30}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index if not exists personal_productivity_profiles_org_user_idx
  on public.personal_productivity_profiles (organization_id, user_id);

alter table public.personal_productivity_profiles enable row level security;
revoke all on public.personal_productivity_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. personal_productivity_briefings
-- ---------------------------------------------------------------------------
create table if not exists public.personal_productivity_briefings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  briefing_date date not null default current_date,
  status text not null default 'draft' check (
    status in ('draft', 'generated', 'viewed', 'archived')
  ),
  summary text,
  content jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id, briefing_date)
);

create index if not exists personal_productivity_briefings_org_user_idx
  on public.personal_productivity_briefings (organization_id, user_id, briefing_date desc);

alter table public.personal_productivity_briefings enable row level security;
revoke all on public.personal_productivity_briefings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. personal_productivity_reminders
-- ---------------------------------------------------------------------------
create table if not exists public.personal_productivity_reminders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  remind_at timestamptz not null,
  channel text not null default 'in_app' check (
    channel in ('in_app', 'desktop', 'email', 'presence')
  ),
  status text not null default 'scheduled' check (
    status in ('scheduled', 'delivered', 'dismissed', 'snoozed', 'cancelled')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists personal_productivity_reminders_org_user_idx
  on public.personal_productivity_reminders (organization_id, user_id, status, remind_at);

alter table public.personal_productivity_reminders enable row level security;
revoke all on public.personal_productivity_reminders from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. personal_productivity_settings (org-level defaults)
-- ---------------------------------------------------------------------------
create table if not exists public.personal_productivity_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  default_quiet_hours jsonb not null default '{"enabled": false, "start": "22:00", "end": "08:00"}'::jsonb,
  default_reminder_settings jsonb not null default '{"channels": ["in_app"], "lead_minutes": 30}'::jsonb,
  briefing_enabled boolean not null default true,
  focus_recommendations_enabled boolean not null default true,
  calendar_sync_enabled boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.personal_productivity_settings enable row level security;
revoke all on public.personal_productivity_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'personal_productivity', v.description
from (values
  ('productivity.view', 'View Productivity', 'View personal productivity dashboard and briefings'),
  ('productivity.manage', 'Manage Productivity', 'Manage personal reminders and daily briefings'),
  ('productivity.configure', 'Configure Productivity', 'Configure org-level productivity defaults')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'productivity.view'), ('owner', 'productivity.manage'), ('owner', 'productivity.configure'),
  ('administrator', 'productivity.view'), ('administrator', 'productivity.manage'), ('administrator', 'productivity.configure'),
  ('manager', 'productivity.view'), ('manager', 'productivity.manage'),
  ('support_agent', 'productivity.view'), ('support_agent', 'productivity.manage'),
  ('viewer', 'productivity.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_ppe_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._ppe_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'personal_productivity_profile',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._ppe_ensure_settings(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.personal_productivity_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._ppe_ensure_profile(
  p_organization_id uuid,
  p_user_id uuid
)
returns public.personal_productivity_profiles language plpgsql security definer set search_path = public as $$
declare v_row public.personal_productivity_profiles; v_defaults jsonb;
begin
  perform public._ppe_ensure_settings(p_organization_id);

  select default_quiet_hours, default_reminder_settings
  into v_defaults
  from public.personal_productivity_settings
  where organization_id = p_organization_id;

  insert into public.personal_productivity_profiles (
    organization_id, user_id, quiet_hours, reminder_settings
  )
  values (
    p_organization_id,
    p_user_id,
    coalesce((select default_quiet_hours from public.personal_productivity_settings where organization_id = p_organization_id), '{"enabled": false}'::jsonb),
    coalesce((select default_reminder_settings from public.personal_productivity_settings where organization_id = p_organization_id), '{"channels": ["in_app"]}'::jsonb)
  )
  on conflict (organization_id, user_id) do nothing;

  select * into v_row
  from public.personal_productivity_profiles
  where organization_id = p_organization_id and user_id = p_user_id;

  return v_row;
end; $$;

create or replace function public._ppe_task_integration_summary(
  p_organization_id uuid,
  p_user_id uuid
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'organization_tasks' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'assigned_open_tasks', coalesce((
      select count(*) from public.organization_tasks
      where organization_id = p_organization_id
        and assigned_user_id = p_user_id
        and status in ('open', 'in_progress', 'awaiting_approval')
    ), 0),
    'overdue_tasks', coalesce((
      select count(*) from public.organization_tasks
      where organization_id = p_organization_id
        and assigned_user_id = p_user_id
        and status = 'overdue'
    ), 0),
    'upcoming_deadlines_7d', coalesce((
      select count(*) from public.organization_tasks
      where organization_id = p_organization_id
        and assigned_user_id = p_user_id
        and status in ('open', 'in_progress', 'awaiting_approval')
        and due_date is not null
        and due_date between current_date and current_date + 7
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._ppe_meeting_integration_summary(
  p_organization_id uuid,
  p_user_id uuid
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'collaboration_meetings' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'upcoming_meetings_7d', coalesce((
      select count(*) from public.collaboration_meetings
      where organization_id = p_organization_id
        and scheduled_at >= now()
        and scheduled_at <= now() + interval '7 days'
        and status in ('scheduled', 'in_progress')
    ), 0),
    'open_meeting_actions', coalesce((
      select count(*) from public.meeting_action_items
      where organization_id = p_organization_id
        and assigned_user_id = p_user_id
        and status in ('open', 'in_progress', 'overdue')
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

-- Delegates to A.67 _cpie_* helpers when companion_presence tables exist (see 20260911500000).
create or replace function public._ppe_companion_presence_summary(
  p_organization_id uuid,
  p_user_id uuid
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_counts jsonb;
declare v_prefs record;
declare v_derived text;
declare v_pending_approvals int := 0;
begin
  if exists (select 1 from pg_tables where tablename = 'companion_presence_settings' and schemaname = 'public') then
    v_counts := public._cpie_summary_counts(p_organization_id, p_user_id);
    select quiet_mode_enabled into v_prefs
    from public.companion_presence_user_preferences
    where organization_id = p_organization_id and user_id = p_user_id;
    v_derived := public._cpie_derive_state(
      p_organization_id, p_user_id, coalesce(v_prefs.quiet_mode_enabled, false)
    );
    return jsonb_build_object(
      'available', true,
      'companion_presence_scaffold', false,
      'current_state', v_derived,
      'pending_approvals', coalesce((v_counts->>'pending_approvals')::int, 0),
      'open_tasks', coalesce((v_counts->>'open_tasks')::int, 0),
      'quiet_hours_respected', coalesce(v_prefs.quiet_mode_enabled, false),
      'metadata_only', true
    );
  end if;

  if exists (select 1 from pg_tables where tablename = 'ai_action_requests' and schemaname = 'public') then
    select count(*) into v_pending_approvals
    from public.ai_action_requests
    where organization_id = p_organization_id
      and status = 'pending'
      and initiated_by = p_user_id;
  end if;

  return jsonb_build_object(
    'available', true,
    'companion_presence_scaffold', true,
    'pending_approvals', v_pending_approvals,
    'quiet_hours_respected', true,
    'metadata_only', true
  );
exception when others then
  return jsonb_build_object('available', false, 'companion_presence_scaffold', true);
end; $$;

create or replace function public._ppe_memory_hook(
  p_organization_id uuid,
  p_summary text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = 'capture_organization_memory') then
    return jsonb_build_object('linked', false, 'metadata_only', true, 'summary', left(coalesce(p_summary, ''), 500));
  end if;
  return public.capture_organization_memory(
    'productivity_pattern',
    left(coalesce(p_summary, 'Productivity preference captured'), 500),
    jsonb_build_object(
      'source', 'personal_productivity_engine',
      'metadata', coalesce(p_metadata, '{}'::jsonb)
    )
  );
exception when others then
  return jsonb_build_object('linked', false, 'metadata_only', true, 'error', 'hook_unavailable');
end; $$;

create or replace function public._ppe_summary_block(
  p_organization_id uuid,
  p_user_id uuid
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tasks jsonb;
begin
  v_tasks := public._ppe_task_integration_summary(p_organization_id, p_user_id);

  return jsonb_build_object(
    'open_priorities', coalesce((v_tasks->>'assigned_open_tasks')::int, 0),
    'overdue_items', coalesce((v_tasks->>'overdue_tasks')::int, 0),
    'upcoming_commitments_7d', coalesce((v_tasks->>'upcoming_deadlines_7d')::int, 0)
      + coalesce((public._ppe_meeting_integration_summary(p_organization_id, p_user_id)->>'upcoming_meetings_7d')::int, 0),
    'scheduled_reminders', coalesce((
      select count(*) from public.personal_productivity_reminders
      where organization_id = p_organization_id and user_id = p_user_id and status = 'scheduled'
    ), 0),
    'completed_items_30d', coalesce((
      select count(*) from public.personal_productivity_reminders
      where organization_id = p_organization_id and user_id = p_user_id
        and status = 'dismissed'
        and updated_at >= now() - interval '30 days'
    ), 0) + coalesce((v_tasks->>'assigned_open_tasks')::int, 0),
    'pending_approvals', coalesce((
      public._ppe_companion_presence_summary(p_organization_id, p_user_id)->>'pending_approvals'
    )::int, 0)
  );
end; $$;

create or replace function public._ppe_completion_trends(
  p_organization_id uuid,
  p_user_id uuid
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'week_start', date_trunc('week', r.updated_at)::date,
      'completed_count', count(*)
    ) order by date_trunc('week', r.updated_at))
    from public.personal_productivity_reminders r
    where r.organization_id = p_organization_id
      and r.user_id = p_user_id
      and r.status in ('dismissed', 'delivered')
      and r.updated_at >= now() - interval '90 days'
    group by date_trunc('week', r.updated_at)
  ), '[]'::jsonb);
end; $$;

create or replace function public._ppe_focus_recommendations(
  p_organization_id uuid,
  p_user_id uuid
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_summary jsonb; v_recs jsonb := '[]'::jsonb;
begin
  v_summary := public._ppe_summary_block(p_organization_id, p_user_id);

  if coalesce((v_summary->>'overdue_items')::int, 0) > 0 then
    v_recs := v_recs || jsonb_build_array(jsonb_build_object(
      'type', 'overdue_focus',
      'confidence', 'high',
      'summary', 'Address overdue commitments before taking on new work.'
    ));
  end if;

  if coalesce((v_summary->>'upcoming_commitments_7d')::int, 0) > 3 then
    v_recs := v_recs || jsonb_build_array(jsonb_build_object(
      'type', 'capacity_guard',
      'confidence', 'moderate',
      'summary', 'Several commitments this week — consider blocking focus time.'
    ));
  end if;

  if coalesce((v_summary->>'scheduled_reminders')::int, 0) = 0 then
    v_recs := v_recs || jsonb_build_array(jsonb_build_object(
      'type', 'reminder_setup',
      'confidence', 'low',
      'summary', 'No personal reminders scheduled — add gentle nudges for key priorities.'
    ));
  end if;

  return v_recs;
end; $$;

create or replace function public._ppe_todays_priorities(
  p_organization_id uuid,
  p_user_id uuid
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'organization_tasks' and schemaname = 'public') then
    return '[]'::jsonb;
  end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'source', 'organization_task',
      'id', t.id,
      'title', t.title,
      'priority', t.priority,
      'due_date', t.due_date,
      'status', t.status
    ) order by t.priority desc, t.due_date nulls last)
    from public.organization_tasks t
    where t.organization_id = p_organization_id
      and t.assigned_user_id = p_user_id
      and t.status in ('open', 'in_progress', 'awaiting_approval', 'overdue')
    limit 10
  ), '[]'::jsonb);
exception when others then
  return '[]'::jsonb;
end; $$;

create or replace function public._ppe_upcoming_commitments(
  p_organization_id uuid,
  p_user_id uuid
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_items jsonb := '[]'::jsonb;
begin
  if exists (select 1 from pg_tables where tablename = 'organization_tasks' and schemaname = 'public') then
    v_items := v_items || coalesce((
      select jsonb_agg(jsonb_build_object(
        'source', 'task_deadline',
        'title', t.title,
        'due_date', t.due_date,
        'priority', t.priority
      ) order by t.due_date)
      from public.organization_tasks t
      where t.organization_id = p_organization_id
        and t.assigned_user_id = p_user_id
        and t.due_date is not null
        and t.due_date between current_date and current_date + 14
        and t.status in ('open', 'in_progress', 'awaiting_approval')
      limit 15
    ), '[]'::jsonb);
  end if;

  if exists (select 1 from pg_tables where tablename = 'collaboration_meetings' and schemaname = 'public') then
    v_items := v_items || coalesce((
      select jsonb_agg(jsonb_build_object(
        'source', 'meeting',
        'title', m.meeting_title,
        'scheduled_at', m.scheduled_at,
        'status', m.status
      ) order by m.scheduled_at)
      from public.collaboration_meetings m
      where m.organization_id = p_organization_id
        and m.scheduled_at >= now()
        and m.scheduled_at <= now() + interval '14 days'
        and m.status in ('scheduled', 'in_progress')
      limit 10
    ), '[]'::jsonb);
  end if;

  return v_items;
exception when others then
  return '[]'::jsonb;
end; $$;

create or replace function public._ppe_overdue_work(
  p_organization_id uuid,
  p_user_id uuid
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'organization_tasks' and schemaname = 'public') then
    return '[]'::jsonb;
  end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'source', 'organization_task',
      'id', t.id,
      'title', t.title,
      'due_date', t.due_date,
      'priority', t.priority
    ) order by t.due_date)
    from public.organization_tasks t
    where t.organization_id = p_organization_id
      and t.assigned_user_id = p_user_id
      and (t.status = 'overdue' or (t.due_date < current_date and t.status in ('open', 'in_progress', 'awaiting_approval')))
    limit 20
  ), '[]'::jsonb);
exception when others then
  return '[]'::jsonb;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.upsert_personal_productivity_profile(
  p_preferences jsonb default '{}'::jsonb,
  p_quiet_hours jsonb default null,
  p_reminder_settings jsonb default null,
  p_capture_memory boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_row public.personal_productivity_profiles; v_memory jsonb;
begin
  perform public._irp_require_permission('productivity.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_row := public._ppe_ensure_profile(v_org_id, v_user_id);

  update public.personal_productivity_profiles
  set
    preferences = coalesce(p_preferences, preferences),
    quiet_hours = coalesce(p_quiet_hours, quiet_hours),
    reminder_settings = coalesce(p_reminder_settings, reminder_settings),
    updated_at = now()
  where organization_id = v_org_id and user_id = v_user_id
  returning * into v_row;

  perform public._ppe_log(
    v_org_id, 'ppe_profile_updated', 'personal_productivity_profile', v_row.id,
    jsonb_build_object('metadata_only', true)
  );

  if p_capture_memory then
    v_memory := public._ppe_memory_hook(v_org_id, 'Personal productivity preferences updated', jsonb_build_object('profile_id', v_row.id));
  end if;

  return jsonb_build_object('profile', row_to_json(v_row), 'memory', v_memory);
end; $$;

create or replace function public.create_productivity_reminder(
  p_title text,
  p_remind_at timestamptz default null,
  p_channel text default 'in_app',
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_row public.personal_productivity_reminders;
begin
  perform public._irp_require_permission('productivity.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._ppe_ensure_profile(v_org_id, v_user_id);

  if coalesce(trim(p_title), '') = '' then raise exception 'Reminder title required'; end if;

  insert into public.personal_productivity_reminders (
    organization_id, user_id, title, remind_at, channel, metadata
  )
  values (
    v_org_id, v_user_id, left(trim(p_title), 200),
    coalesce(p_remind_at, now() + interval '1 hour'),
    coalesce(p_channel, 'in_app'),
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning * into v_row;

  perform public._ppe_log(
    v_org_id, 'ppe_reminder_created', 'personal_productivity_reminder', v_row.id,
    jsonb_build_object('channel', v_row.channel)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.dismiss_productivity_reminder(
  p_reminder_id uuid
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_row public.personal_productivity_reminders;
begin
  perform public._irp_require_permission('productivity.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.personal_productivity_reminders
  set status = 'dismissed', updated_at = now()
  where id = p_reminder_id and organization_id = v_org_id and user_id = v_user_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Reminder not found'; end if;
  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.generate_daily_briefing(
  p_capture_memory boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_row public.personal_productivity_briefings;
  v_summary jsonb; v_content jsonb; v_memory jsonb;
begin
  perform public._irp_require_permission('productivity.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._ppe_ensure_profile(v_org_id, v_user_id);

  v_summary := public._ppe_summary_block(v_org_id, v_user_id);
  v_content := jsonb_build_object(
    'priorities', public._ppe_todays_priorities(v_org_id, v_user_id),
    'upcoming', public._ppe_upcoming_commitments(v_org_id, v_user_id),
    'overdue', public._ppe_overdue_work(v_org_id, v_user_id),
    'focus_recommendations', public._ppe_focus_recommendations(v_org_id, v_user_id),
    'metadata_only', true
  );

  insert into public.personal_productivity_briefings (
    organization_id, user_id, briefing_date, status, summary, content
  )
  values (
    v_org_id, v_user_id, current_date, 'generated',
    left('Daily briefing — ' || coalesce((v_summary->>'open_priorities')::text, '0') || ' priorities, '
      || coalesce((v_summary->>'overdue_items')::text, '0') || ' overdue', 500),
    v_content
  )
  on conflict (organization_id, user_id, briefing_date) do update
  set status = 'generated', summary = excluded.summary, content = excluded.content, updated_at = now()
  returning * into v_row;

  perform public._ppe_log(
    v_org_id, 'ppe_briefing_generated', 'personal_productivity_briefing', v_row.id,
    jsonb_build_object('briefing_date', v_row.briefing_date)
  );

  if p_capture_memory then
    v_memory := public._ppe_memory_hook(v_org_id, 'Daily productivity briefing generated', jsonb_build_object('briefing_id', v_row.id));
  end if;

  return jsonb_build_object('briefing', row_to_json(v_row), 'memory', v_memory);
end; $$;

create or replace function public.get_daily_productivity_briefing(
  p_briefing_date date default null
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_row public.personal_productivity_briefings;
begin
  perform public._irp_require_permission('productivity.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._ppe_ensure_profile(v_org_id, v_user_id);

  select * into v_row
  from public.personal_productivity_briefings
  where organization_id = v_org_id
    and user_id = v_user_id
    and briefing_date = coalesce(p_briefing_date, current_date);

  if v_row.id is null then
    return jsonb_build_object('has_briefing', false, 'briefing_date', coalesce(p_briefing_date, current_date));
  end if;

  return jsonb_build_object('has_briefing', true, 'briefing', row_to_json(v_row));
end; $$;

create or replace function public.get_productivity_recommendations()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  perform public._irp_require_permission('productivity.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._ppe_ensure_profile(v_org_id, v_user_id);

  return jsonb_build_object(
    'has_organization', true,
    'recommendations', public._ppe_focus_recommendations(v_org_id, v_user_id)
  );
end; $$;

create or replace function public.calendar_sync_hook(
  p_provider text default 'aipify_internal',
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_enabled boolean;
begin
  perform public._irp_require_permission('productivity.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  select calendar_sync_enabled into v_enabled
  from public.personal_productivity_settings where organization_id = v_org_id;

  return jsonb_build_object(
    'scaffold', true,
    'provider', coalesce(p_provider, 'aipify_internal'),
    'enabled', coalesce(v_enabled, false),
    'user_id', v_user_id,
    'metadata', coalesce(p_metadata, '{}'::jsonb),
    'message', 'Calendar sync scaffold — Context Engine integration pending'
  );
end; $$;

create or replace function public.companion_orb_productivity_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_tasks jsonb; v_approvals int := 0;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_tasks := public._ppe_task_integration_summary(v_org_id, v_user_id);

  if exists (select 1 from pg_tables where tablename = 'ai_action_requests' and schemaname = 'public') then
    select count(*) into v_approvals
    from public.ai_action_requests
    where organization_id = v_org_id and status = 'pending' and initiated_by = v_user_id;
  end if;

  return jsonb_build_object(
    'has_organization', true,
    'tasks_count', coalesce((v_tasks->>'assigned_open_tasks')::int, 0),
    'approvals_count', v_approvals,
    'deadlines_count', coalesce((v_tasks->>'upcoming_deadlines_7d')::int, 0),
    'overdue_count', coalesce((v_tasks->>'overdue_tasks')::int, 0),
    'companion_orb_scaffold', true,
    'metadata_only', true
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.export_personal_productivity_manifest(
  p_format text default 'json'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  perform public._irp_require_permission('productivity.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._ppe_ensure_profile(v_org_id, v_user_id);

  perform public._ppe_log(
    v_org_id, 'ppe_manifest_exported', 'personal_productivity_profile', null,
    jsonb_build_object('format', p_format, 'user_id', v_user_id)
  );

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'personal_productivity',
    'format', coalesce(p_format, 'json'),
    'profile', (
      select row_to_json(p)::jsonb from public.personal_productivity_profiles p
      where p.organization_id = v_org_id and p.user_id = v_user_id
    ),
    'briefings', coalesce((
      select jsonb_agg(row_to_json(b) order by b.briefing_date desc)
      from public.personal_productivity_briefings b
      where b.organization_id = v_org_id and b.user_id = v_user_id
      limit 30
    ), '[]'::jsonb),
    'reminders', coalesce((
      select jsonb_agg(row_to_json(r) order by r.remind_at)
      from public.personal_productivity_reminders r
      where r.organization_id = v_org_id and r.user_id = v_user_id
      limit 100
    ), '[]'::jsonb),
    'summary', public._ppe_summary_block(v_org_id, v_user_id),
    'recommendations', public._ppe_focus_recommendations(v_org_id, v_user_id),
    'metadata_only', true
  );
end; $$;

create or replace function public.get_personal_productivity_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_briefing jsonb;
begin
  perform public._irp_require_permission('productivity.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._ppe_ensure_profile(v_org_id, v_user_id);

  v_briefing := public.get_daily_productivity_briefing(current_date);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Personal productivity support — reduced cognitive load, respectful reminders, human control. Metadata only.',
    'principles', jsonb_build_array(
      'Human-first assistance',
      'Reduced cognitive load',
      'Proactive but respectful reminders',
      'User control over preferences',
      'Metadata only — not surveillance'
    ),
    'summary', public._ppe_summary_block(v_org_id, v_user_id),
    'sections', jsonb_build_object(
      'todays_priorities', public._ppe_todays_priorities(v_org_id, v_user_id),
      'upcoming_commitments', public._ppe_upcoming_commitments(v_org_id, v_user_id),
      'overdue_work', public._ppe_overdue_work(v_org_id, v_user_id),
      'completion_trends', public._ppe_completion_trends(v_org_id, v_user_id),
      'focus_recommendations', public._ppe_focus_recommendations(v_org_id, v_user_id),
      'daily_briefing', v_briefing
    ),
    'reminders', coalesce((
      select jsonb_agg(row_to_json(r) order by r.remind_at)
      from public.personal_productivity_reminders r
      where r.organization_id = v_org_id and r.user_id = v_user_id and r.status = 'scheduled'
      limit 20
    ), '[]'::jsonb),
    'recommendations', public._ppe_focus_recommendations(v_org_id, v_user_id),
    'profile', (
      select row_to_json(p)::jsonb from public.personal_productivity_profiles p
      where p.organization_id = v_org_id and p.user_id = v_user_id
    ),
    'settings', (
      select row_to_json(s)::jsonb from public.personal_productivity_settings s
      where s.organization_id = v_org_id
    ),
    'integration_notes', jsonb_build_object(
      'unified_tasks', 'Assigned organizational task counts — read-only hook from A.62, not personal memory',
      'meetings', 'Upcoming meetings and action prep scaffold — A.61',
      'companion_presence', 'Orb summary metadata — A.67 scaffold',
      'organizational_memory', 'Preference and briefing patterns — metadata hook A.34',
      'desktop_companion', 'Personal briefings and focus nudges — A.38 scaffold',
      'pame_distinction', 'NOT PAME personal_memories — per-user productivity metadata only'
    ),
    'integration_summaries', jsonb_build_object(
      'unified_tasks', public._ppe_task_integration_summary(v_org_id, v_user_id),
      'meetings', public._ppe_meeting_integration_summary(v_org_id, v_user_id),
      'companion_presence', public._ppe_companion_presence_summary(v_org_id, v_user_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_personal_productivity_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_summary jsonb;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._ppe_ensure_profile(v_org_id, v_user_id);
  v_summary := public._ppe_summary_block(v_org_id, v_user_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Personal Productivity — your priorities, briefings, and focus support.',
    'open_priorities', v_summary->'open_priorities',
    'overdue_items', v_summary->'overdue_items',
    'upcoming_commitments_7d', v_summary->'upcoming_commitments_7d',
    'scheduled_reminders', v_summary->'scheduled_reminders'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Audit allowlist extension
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
    'change_initiative_created', 'change_initiative_status_updated', 'change_impact_assessed',
    'change_communication_plan_created', 'change_communication_released',
    'change_training_assigned', 'change_adoption_metric_recorded', 'change_milestone_completed',
    'value_baseline_captured', 'value_metric_recorded', 'value_metric_updated',
    'value_report_generated', 'value_report_exported', 'value_milestone_adjusted',
    'resilience_plan_created', 'resilience_plan_status_updated', 'resilience_plan_approved',
    'resilience_simulation_recorded', 'resilience_review_completed',
    'resilience_vulnerability_recorded', 'resilience_vulnerability_resolved',
    'irce_incident_created', 'irce_incident_owner_assigned', 'irce_incident_severity_updated',
    'irce_incident_status_updated', 'irce_incident_escalated', 'irce_incident_resolved',
    'irce_incident_closed', 'irce_incident_communication_recorded', 'irce_incident_lessons_captured',
    'odse_decision_proposed', 'odse_decision_review_started', 'odse_decision_approved',
    'odse_decision_rejected', 'odse_decision_implemented', 'odse_decision_outcome_recorded',
    'odse_decision_report_exported',
    'sae_objective_created', 'sae_objective_updated', 'sae_objective_entity_linked',
    'sae_strategic_review_recorded', 'sae_misalignment_detected', 'sae_alignment_report_exported',
    'ohe_health_measured', 'ohe_category_refreshed', 'ohe_score_overridden',
    'ohe_recommendations_generated', 'ohe_intervention_approved', 'ohe_health_report_exported',
    'cma_assessment_created', 'cma_assessment_updated', 'cma_roadmap_generated', 'cma_maturity_report_exported',
    'obe_profile_created', 'obe_profile_updated', 'obe_comparison_generated', 'obe_benchmark_report_exported',
    'doe_template_created', 'doe_template_updated', 'doe_template_archived',
    'doe_output_generated', 'doe_schedule_created', 'doe_schedule_cancelled',
    'doe_delivery_recorded', 'doe_manifest_exported',
    'rrme_policy_created', 'rrme_policy_updated', 'rrme_policy_retired',
    'rrme_record_archived', 'rrme_record_restored',
    'rrme_disposal_requested', 'rrme_disposal_approved', 'rrme_disposal_rejected', 'rrme_disposal_completed',
    'mcie_meeting_created', 'mcie_meeting_status_updated', 'mcie_meeting_cancelled',
    'mcie_agenda_generated', 'mcie_summary_captured', 'mcie_actions_extracted',
    'mcie_action_assigned', 'mcie_action_status_updated', 'mcie_actions_marked_overdue',
    'mcie_decision_captured', 'mcie_outputs_generated', 'mcie_manifest_exported',
    'utfe_task_created', 'utfe_task_created_from_source', 'utfe_task_assigned',
    'utfe_task_status_updated', 'utfe_task_completed', 'utfe_reminder_scheduled',
    'utfe_task_escalated', 'utfe_calendar_sync_requested', 'utfe_manifest_exported',
    'rpe_plan_created', 'rpe_plan_status_updated', 'rpe_plan_approved',
    'rpe_allocation_created', 'rpe_allocation_updated', 'rpe_utilization_overridden',
    'rpe_scenario_created', 'rpe_scenarios_compared', 'rpe_manifest_exported',
    'cwme_capacity_profile_created', 'cwme_capacity_profile_updated',
    'cwme_workload_item_created', 'cwme_workload_reassigned',
    'cwme_warning_acknowledged', 'cwme_threshold_updated', 'cwme_manifest_exported',
    'goke_objective_created', 'goke_objective_activated', 'goke_key_result_created',
    'goke_progress_updated', 'goke_progress_overridden', 'goke_objective_completed',
    'goke_manifest_exported',
    'ppe_profile_updated', 'ppe_reminder_created', 'ppe_briefing_generated',
    'ppe_automation_approved', 'ppe_manifest_exported',
    'cpie_critical_alert_acknowledged', 'cpie_quiet_mode_changed', 'cpie_org_settings_changed'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'personal-productivity-engine', 'Personal Productivity Engine', 'Per-user productivity preferences, daily briefings, reminders, and focus recommendations — metadata only. Not PAME or organizational tasks.', 'authenticated', 96
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'personal-productivity-engine' and tenant_id is null);

grant execute on function public.upsert_personal_productivity_profile(jsonb, jsonb, jsonb, boolean) to authenticated;
grant execute on function public.create_productivity_reminder(text, timestamptz, text, jsonb) to authenticated;
grant execute on function public.dismiss_productivity_reminder(uuid) to authenticated;
grant execute on function public.generate_daily_briefing(boolean) to authenticated;
grant execute on function public.get_daily_productivity_briefing(date) to authenticated;
grant execute on function public.get_productivity_recommendations() to authenticated;
grant execute on function public.calendar_sync_hook(text, jsonb) to authenticated;
grant execute on function public.companion_orb_productivity_summary() to authenticated;
grant execute on function public.export_personal_productivity_manifest(text) to authenticated;
grant execute on function public.get_personal_productivity_engine_dashboard() to authenticated;
grant execute on function public.get_personal_productivity_engine_card() to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._ppe_ensure_settings(v_org_id);
  end loop;
end $$;
