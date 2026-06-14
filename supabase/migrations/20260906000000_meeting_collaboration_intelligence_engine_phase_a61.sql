-- Phase A.61 — Meeting & Collaboration Intelligence Engine
-- Extends Operations Center (A.32), Workflow Orchestration (A.42),
-- Stakeholder Communication (A.53), Document & Output (A.59).

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
    'meeting_collaboration_intelligence_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. collaboration_meetings
-- ---------------------------------------------------------------------------
create table if not exists public.collaboration_meetings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  meeting_title text not null,
  meeting_type text not null check (
    meeting_type in (
      'executive', 'department', 'incident_review', 'customer_success', 'strategy', 'project'
    )
  ),
  organizer_user_id uuid references public.users (id) on delete set null,
  scheduled_at timestamptz not null default now(),
  status text not null default 'scheduled' check (
    status in ('scheduled', 'in_progress', 'completed', 'cancelled')
  ),
  agenda jsonb not null default '{}'::jsonb,
  summary_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists collaboration_meetings_org_idx
  on public.collaboration_meetings (organization_id, status, meeting_type, scheduled_at desc);

alter table public.collaboration_meetings enable row level security;
revoke all on public.collaboration_meetings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. meeting_action_items
-- ---------------------------------------------------------------------------
create table if not exists public.meeting_action_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  meeting_id uuid not null references public.collaboration_meetings (id) on delete cascade,
  assigned_user_id uuid references public.users (id) on delete set null,
  action_description text not null,
  due_date date,
  status text not null default 'open' check (
    status in ('open', 'in_progress', 'completed', 'overdue')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists meeting_action_items_org_idx
  on public.meeting_action_items (organization_id, meeting_id, status, due_date);

alter table public.meeting_action_items enable row level security;
revoke all on public.meeting_action_items from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. meeting_decisions
-- ---------------------------------------------------------------------------
create table if not exists public.meeting_decisions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  meeting_id uuid not null references public.collaboration_meetings (id) on delete cascade,
  decision_text text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists meeting_decisions_org_idx
  on public.meeting_decisions (organization_id, meeting_id, created_at desc);

alter table public.meeting_decisions enable row level security;
revoke all on public.meeting_decisions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. meeting_output_links
-- ---------------------------------------------------------------------------
create table if not exists public.meeting_output_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  meeting_id uuid not null references public.collaboration_meetings (id) on delete cascade,
  document_output_generation_id uuid references public.output_generations (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists meeting_output_links_org_idx
  on public.meeting_output_links (organization_id, meeting_id, created_at desc);

alter table public.meeting_output_links enable row level security;
revoke all on public.meeting_output_links from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions — meetings.*
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'meeting_collaboration', v.description
from (values
  ('meetings.view', 'View Meetings', 'View collaboration meetings, agendas, summaries, and action items'),
  ('meetings.manage', 'Manage Meetings', 'Create meetings, update status, capture summaries, and log decisions'),
  ('meetings.export', 'Export Meetings', 'Export meeting manifests and collaboration metadata'),
  ('meetings.assign_actions', 'Assign Meeting Actions', 'Assign and update meeting action items')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'meetings.view'), ('owner', 'meetings.manage'), ('owner', 'meetings.export'), ('owner', 'meetings.assign_actions'),
  ('administrator', 'meetings.view'), ('administrator', 'meetings.manage'), ('administrator', 'meetings.export'), ('administrator', 'meetings.assign_actions'),
  ('manager', 'meetings.view'), ('manager', 'meetings.manage'), ('manager', 'meetings.export'), ('manager', 'meetings.assign_actions'),
  ('support_agent', 'meetings.view'), ('support_agent', 'meetings.assign_actions'),
  ('viewer', 'meetings.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_mcie_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._mcie_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'collaboration_meeting',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._mcie_workflow_examples(p_meeting_type text)
returns jsonb language sql immutable as $$
  select case p_meeting_type
    when 'executive' then jsonb_build_object(
      'workflow_trigger', 'post_executive_meeting_summary',
      'requires_approval', true,
      'example_steps', jsonb_build_array('capture_summary', 'generate_executive_output', 'notify_stakeholders')
    )
    when 'incident_review' then jsonb_build_object(
      'workflow_trigger', 'incident_review_follow_up',
      'requires_approval', true,
      'example_steps', jsonb_build_array('log_decisions', 'assign_actions', 'link_incident_response')
    )
    when 'customer_success' then jsonb_build_object(
      'workflow_trigger', 'customer_success_meeting_outcomes',
      'requires_approval', true,
      'example_steps', jsonb_build_array('capture_actions', 'schedule_follow_up_communication')
    )
    when 'strategy' then jsonb_build_object(
      'workflow_trigger', 'strategic_alignment_review',
      'requires_approval', true,
      'example_steps', jsonb_build_array('capture_decisions', 'link_strategic_objectives')
    )
    when 'department' then jsonb_build_object(
      'workflow_trigger', 'department_sync_actions',
      'requires_approval', true,
      'example_steps', jsonb_build_array('extract_action_items', 'assign_owners')
    )
    else jsonb_build_object(
      'workflow_trigger', 'project_meeting_follow_up',
      'requires_approval', true,
      'example_steps', jsonb_build_array('capture_summary', 'assign_actions')
    )
  end;
$$;

create or replace function public._mcie_default_agenda(p_meeting_type text, p_meeting_title text)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'title', coalesce(nullif(trim(p_meeting_title), ''), 'Collaboration meeting'),
    'meeting_type', p_meeting_type,
    'sections', case p_meeting_type
      when 'executive' then jsonb_build_array(
        jsonb_build_object('topic', 'Executive priorities', 'duration_minutes', 15),
        jsonb_build_object('topic', 'Operational review', 'duration_minutes', 20),
        jsonb_build_object('topic', 'Decisions and next steps', 'duration_minutes', 10)
      )
      when 'incident_review' then jsonb_build_array(
        jsonb_build_object('topic', 'Incident timeline', 'duration_minutes', 15),
        jsonb_build_object('topic', 'Root cause and mitigation', 'duration_minutes', 20),
        jsonb_build_object('topic', 'Action owners', 'duration_minutes', 10)
      )
      when 'customer_success' then jsonb_build_array(
        jsonb_build_object('topic', 'Customer health signals', 'duration_minutes', 15),
        jsonb_build_object('topic', 'Renewal and adoption', 'duration_minutes', 15),
        jsonb_build_object('topic', 'Follow-up actions', 'duration_minutes', 10)
      )
      when 'strategy' then jsonb_build_array(
        jsonb_build_object('topic', 'Strategic objectives', 'duration_minutes', 20),
        jsonb_build_object('topic', 'Alignment review', 'duration_minutes', 15),
        jsonb_build_object('topic', 'Decision register', 'duration_minutes', 10)
      )
      when 'department' then jsonb_build_array(
        jsonb_build_object('topic', 'Team updates', 'duration_minutes', 15),
        jsonb_build_object('topic', 'Blockers', 'duration_minutes', 10),
        jsonb_build_object('topic', 'Action items', 'duration_minutes', 10)
      )
      else jsonb_build_array(
        jsonb_build_object('topic', 'Project status', 'duration_minutes', 15),
        jsonb_build_object('topic', 'Risks and dependencies', 'duration_minutes', 10),
        jsonb_build_object('topic', 'Next steps', 'duration_minutes', 10)
      )
    end,
    'workflow_example', public._mcie_workflow_examples(p_meeting_type),
    'metadata_only', true
  );
$$;

create or replace function public._mcie_operations_center_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'operations_center_events' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'open_events', coalesce((
      select count(*) from public.operations_center_events
      where organization_id = p_organization_id and status in ('open', 'assigned', 'escalated')
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._mcie_stakeholder_communication_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'stakeholder_communication_campaigns' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'scheduled_campaigns', coalesce((
      select count(*) from public.stakeholder_communication_campaigns
      where organization_id = p_organization_id and status = 'scheduled'
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._mcie_document_output_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'output_generations' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'recent_generations', coalesce((
      select count(*) from public.output_generations
      where organization_id = p_organization_id and generated_at >= now() - interval '30 days'
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._mcie_executive_summary_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'scheduled_meetings', coalesce((
      select count(*) from public.collaboration_meetings
      where organization_id = p_organization_id and status = 'scheduled'
    ), 0),
    'in_progress_meetings', coalesce((
      select count(*) from public.collaboration_meetings
      where organization_id = p_organization_id and status = 'in_progress'
    ), 0),
    'completed_meetings_30d', coalesce((
      select count(*) from public.collaboration_meetings
      where organization_id = p_organization_id and status = 'completed'
        and updated_at >= now() - interval '30 days'
    ), 0),
    'open_action_items', coalesce((
      select count(*) from public.meeting_action_items
      where organization_id = p_organization_id and status in ('open', 'in_progress', 'overdue')
    ), 0),
    'overdue_action_items', coalesce((
      select count(*) from public.meeting_action_items
      where organization_id = p_organization_id and status = 'overdue'
    ), 0),
    'decisions_logged_30d', coalesce((
      select count(*) from public.meeting_decisions
      where organization_id = p_organization_id and created_at >= now() - interval '30 days'
    ), 0)
  );
end; $$;

create or replace function public._mcie_capture_memory_hook(
  p_organization_id uuid,
  p_meeting_id uuid,
  p_summary text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = 'capture_organization_memory') then
    return jsonb_build_object('linked', false, 'metadata_only', true, 'summary', left(coalesce(p_summary, ''), 500));
  end if;

  return public.capture_organization_memory(
    'meeting_outcome',
    left(coalesce(p_summary, 'Meeting outcome captured'), 500),
    jsonb_build_object(
      'source', 'meeting_collaboration_intelligence_engine',
      'meeting_id', p_meeting_id,
      'metadata', coalesce(p_metadata, '{}'::jsonb)
    )
  );
exception when others then
  return jsonb_build_object('linked', false, 'metadata_only', true, 'error', 'hook_unavailable');
end; $$;

create or replace function public._mcie_seed_meetings(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_meeting_id uuid;
begin
  if exists (select 1 from public.collaboration_meetings where organization_id = p_organization_id limit 1) then
    return;
  end if;

  insert into public.collaboration_meetings (
    organization_id, meeting_title, meeting_type, status, scheduled_at, agenda
  )
  values (
    p_organization_id,
    'Weekly operational sync',
    'department',
    'scheduled',
    now() + interval '3 days',
    public._mcie_default_agenda('department', 'Weekly operational sync')
  )
  returning id into v_meeting_id;

  insert into public.meeting_action_items (
    organization_id, meeting_id, action_description, due_date, status
  )
  values (
    p_organization_id, v_meeting_id,
    'Review open operational events and assign owners',
    (current_date + 7),
    'open'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_collaboration_meeting(
  p_meeting_title text,
  p_meeting_type text default 'department',
  p_scheduled_at timestamptz default null,
  p_agenda jsonb default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.collaboration_meetings;
begin
  perform public._irp_require_permission('meetings.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if coalesce(trim(p_meeting_title), '') = '' then raise exception 'Meeting title required'; end if;

  insert into public.collaboration_meetings (
    organization_id, meeting_title, meeting_type, organizer_user_id,
    scheduled_at, status, agenda
  )
  values (
    v_org_id,
    left(trim(p_meeting_title), 200),
    coalesce(nullif(trim(p_meeting_type), ''), 'department'),
    v_user_id,
    coalesce(p_scheduled_at, now() + interval '1 day'),
    'scheduled',
    coalesce(p_agenda, public._mcie_default_agenda(coalesce(nullif(trim(p_meeting_type), ''), 'department'), p_meeting_title))
  )
  returning * into v_row;

  perform public._mcie_log(
    v_org_id, 'mcie_meeting_created', 'collaboration_meeting', v_row.id,
    jsonb_build_object('meeting_type', v_row.meeting_type, 'meeting_title', v_row.meeting_title)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.update_meeting_status(
  p_meeting_id uuid,
  p_status text
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.collaboration_meetings; v_prev text;
begin
  perform public._irp_require_permission('meetings.manage');
  v_org_id := public._mta_require_organization();

  select status into v_prev from public.collaboration_meetings
  where id = p_meeting_id and organization_id = v_org_id;

  update public.collaboration_meetings
  set status = p_status, updated_at = now()
  where id = p_meeting_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Meeting not found'; end if;

  perform public._mcie_log(
    v_org_id, 'mcie_meeting_status_updated', 'collaboration_meeting', v_row.id,
    jsonb_build_object('previous_status', v_prev, 'status', v_row.status)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.cancel_meeting(p_meeting_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.collaboration_meetings;
begin
  perform public._irp_require_permission('meetings.manage');
  v_org_id := public._mta_require_organization();

  update public.collaboration_meetings
  set status = 'cancelled', updated_at = now()
  where id = p_meeting_id and organization_id = v_org_id and status <> 'completed'
  returning * into v_row;

  if v_row.id is null then raise exception 'Meeting not found or already completed'; end if;

  perform public._mcie_log(
    v_org_id, 'mcie_meeting_cancelled', 'collaboration_meeting', v_row.id,
    jsonb_build_object('meeting_title', v_row.meeting_title)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.generate_meeting_agenda(
  p_meeting_id uuid,
  p_regenerate boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.collaboration_meetings; v_agenda jsonb;
begin
  perform public._irp_require_permission('meetings.manage');
  v_org_id := public._mta_require_organization();

  select * into v_row from public.collaboration_meetings
  where id = p_meeting_id and organization_id = v_org_id;
  if v_row.id is null then raise exception 'Meeting not found'; end if;

  if coalesce(p_regenerate, false) or coalesce(v_row.agenda, '{}'::jsonb) = '{}'::jsonb then
    v_agenda := public._mcie_default_agenda(v_row.meeting_type, v_row.meeting_title);
  else
    v_agenda := v_row.agenda;
  end if;

  update public.collaboration_meetings
  set agenda = v_agenda, updated_at = now()
  where id = v_row.id
  returning * into v_row;

  perform public._mcie_log(
    v_org_id, 'mcie_agenda_generated', 'collaboration_meeting', v_row.id,
    jsonb_build_object('meeting_type', v_row.meeting_type, 'metadata_only', true)
  );

  return jsonb_build_object('meeting', row_to_json(v_row)::jsonb, 'agenda', v_agenda);
end; $$;

create or replace function public.capture_meeting_summary(
  p_meeting_id uuid,
  p_summary_metadata jsonb default '{}'::jsonb,
  p_capture_memory boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.collaboration_meetings; v_memory jsonb;
begin
  perform public._irp_require_permission('meetings.manage');
  v_org_id := public._mta_require_organization();

  update public.collaboration_meetings
  set
    summary_metadata = coalesce(p_summary_metadata, '{}'::jsonb) || jsonb_build_object('captured_at', now()),
    status = case when status = 'scheduled' then 'in_progress' else status end,
    updated_at = now()
  where id = p_meeting_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Meeting not found'; end if;

  v_memory := '{}'::jsonb;
  if coalesce(p_capture_memory, false) then
    v_memory := public._mcie_capture_memory_hook(
      v_org_id, v_row.id,
      coalesce(p_summary_metadata->>'headline', v_row.meeting_title),
      p_summary_metadata
    );
    update public.collaboration_meetings
    set summary_metadata = summary_metadata || jsonb_build_object('memory_hook', v_memory)
    where id = v_row.id
    returning * into v_row;
  end if;

  perform public._mcie_log(
    v_org_id, 'mcie_summary_captured', 'collaboration_meeting', v_row.id,
    jsonb_build_object('metadata_only', true, 'memory_hook', v_memory)
  );

  return jsonb_build_object('meeting', row_to_json(v_row)::jsonb, 'memory_hook', v_memory);
end; $$;

create or replace function public.extract_action_items(
  p_meeting_id uuid,
  p_action_items jsonb default '[]'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_item jsonb;
  v_created jsonb := '[]'::jsonb;
  v_row public.meeting_action_items;
begin
  perform public._irp_require_permission('meetings.manage');
  v_org_id := public._mta_require_organization();

  if not exists (
    select 1 from public.collaboration_meetings where id = p_meeting_id and organization_id = v_org_id
  ) then
    raise exception 'Meeting not found';
  end if;

  for v_item in select * from jsonb_array_elements(coalesce(p_action_items, '[]'::jsonb)) loop
    insert into public.meeting_action_items (
      organization_id, meeting_id, assigned_user_id, action_description, due_date, status
    )
    values (
      v_org_id,
      p_meeting_id,
      nullif(v_item->>'assigned_user_id', '')::uuid,
      left(coalesce(v_item->>'action_description', 'Follow-up action'), 500),
      nullif(v_item->>'due_date', '')::date,
      coalesce(nullif(v_item->>'status', ''), 'open')
    )
    returning * into v_row;

    v_created := v_created || jsonb_build_array(row_to_json(v_row)::jsonb);
  end loop;

  if jsonb_array_length(coalesce(p_action_items, '[]'::jsonb)) = 0 then
    insert into public.meeting_action_items (
      organization_id, meeting_id, action_description, due_date, status
    )
    values (
      v_org_id, p_meeting_id,
      'Review meeting outcomes and confirm next steps',
      current_date + 7,
      'open'
    )
    returning * into v_row;

    v_created := v_created || jsonb_build_array(row_to_json(v_row)::jsonb);
  end if;

  perform public._mcie_log(
    v_org_id, 'mcie_actions_extracted', 'meeting_action_item', p_meeting_id,
    jsonb_build_object('created_count', jsonb_array_length(v_created))
  );

  return jsonb_build_object('action_items', v_created, 'created_count', jsonb_array_length(v_created));
end; $$;

create or replace function public.assign_meeting_action(
  p_action_id uuid,
  p_assigned_user_id uuid,
  p_due_date date default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.meeting_action_items;
begin
  perform public._irp_require_permission('meetings.assign_actions');
  v_org_id := public._mta_require_organization();

  update public.meeting_action_items
  set
    assigned_user_id = p_assigned_user_id,
    due_date = coalesce(p_due_date, due_date),
    updated_at = now()
  where id = p_action_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Action item not found'; end if;

  perform public._mcie_log(
    v_org_id, 'mcie_action_assigned', 'meeting_action_item', v_row.id,
    jsonb_build_object('meeting_id', v_row.meeting_id, 'assigned_user_id', p_assigned_user_id)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.update_action_item_status(
  p_action_id uuid,
  p_status text
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.meeting_action_items;
begin
  perform public._irp_require_permission('meetings.assign_actions');
  v_org_id := public._mta_require_organization();

  update public.meeting_action_items
  set status = p_status, updated_at = now()
  where id = p_action_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Action item not found'; end if;

  perform public._mcie_log(
    v_org_id, 'mcie_action_status_updated', 'meeting_action_item', v_row.id,
    jsonb_build_object('status', p_status)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.mark_action_overdue(p_action_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_count int := 0;
begin
  perform public._irp_require_permission('meetings.assign_actions');
  v_org_id := public._mta_require_organization();

  if p_action_id is not null then
    update public.meeting_action_items
    set status = 'overdue', updated_at = now()
    where id = p_action_id and organization_id = v_org_id
      and status in ('open', 'in_progress')
      and due_date is not null and due_date < current_date;
    get diagnostics v_count = row_count;
  else
    update public.meeting_action_items
    set status = 'overdue', updated_at = now()
    where organization_id = v_org_id
      and status in ('open', 'in_progress')
      and due_date is not null and due_date < current_date;
    get diagnostics v_count = row_count;
  end if;

  perform public._mcie_log(
    v_org_id, 'mcie_actions_marked_overdue', 'meeting_action_item', p_action_id,
    jsonb_build_object('updated_count', v_count)
  );

  return jsonb_build_object('updated_count', v_count);
end; $$;

create or replace function public.capture_meeting_decision(
  p_meeting_id uuid,
  p_decision_text text,
  p_metadata jsonb default '{}'::jsonb,
  p_capture_memory boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.meeting_decisions;
  v_memory jsonb;
begin
  perform public._irp_require_permission('meetings.manage');
  v_org_id := public._mta_require_organization();

  if coalesce(trim(p_decision_text), '') = '' then raise exception 'Decision text required'; end if;

  if not exists (
    select 1 from public.collaboration_meetings where id = p_meeting_id and organization_id = v_org_id
  ) then
    raise exception 'Meeting not found';
  end if;

  insert into public.meeting_decisions (
    organization_id, meeting_id, decision_text, metadata
  )
  values (
    v_org_id, p_meeting_id, left(trim(p_decision_text), 1000),
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning * into v_row;

  v_memory := '{}'::jsonb;
  if coalesce(p_capture_memory, false) then
    v_memory := public._mcie_capture_memory_hook(v_org_id, p_meeting_id, p_decision_text, p_metadata);
    update public.meeting_decisions
    set metadata = metadata || jsonb_build_object('memory_hook', v_memory)
    where id = v_row.id
    returning * into v_row;
  end if;

  perform public._mcie_log(
    v_org_id, 'mcie_decision_captured', 'meeting_decision', v_row.id,
    jsonb_build_object('meeting_id', p_meeting_id, 'memory_hook', v_memory)
  );

  return jsonb_build_object('decision', row_to_json(v_row)::jsonb, 'memory_hook', v_memory);
end; $$;

create or replace function public.trigger_meeting_workflow_hook(
  p_meeting_id uuid,
  p_trigger_context jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_meeting public.collaboration_meetings;
  v_workflow_count int := 0;
  v_example jsonb;
begin
  v_org_id := public._mta_require_organization();

  select * into v_meeting from public.collaboration_meetings
  where id = p_meeting_id and organization_id = v_org_id;
  if v_meeting.id is null then
    return jsonb_build_object('triggered', false, 'reason', 'meeting_not_found');
  end if;

  v_example := public._mcie_workflow_examples(v_meeting.meeting_type);

  if exists (select 1 from pg_tables where tablename = 'organization_workflows' and schemaname = 'public') then
    select count(*) into v_workflow_count
    from public.organization_workflows
    where organization_id = v_org_id and status = 'active';
  end if;

  return jsonb_build_object(
    'triggered', v_workflow_count > 0,
    'requires_human_approval', true,
    'auto_execute', false,
    'meeting_id', p_meeting_id,
    'meeting_type', v_meeting.meeting_type,
    'workflow_example', v_example,
    'active_workflows', v_workflow_count,
    'trigger_context', coalesce(p_trigger_context, '{}'::jsonb),
    'metadata_only', true
  );
end; $$;

create or replace function public.generate_meeting_outputs(
  p_meeting_id uuid,
  p_report_type text default 'executive',
  p_format text default 'pdf'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_meeting public.collaboration_meetings;
  v_generation jsonb;
  v_generation_id uuid;
  v_link public.meeting_output_links;
  v_workflow jsonb;
begin
  perform public._irp_require_permission('meetings.export');
  v_org_id := public._mta_require_organization();

  select * into v_meeting from public.collaboration_meetings
  where id = p_meeting_id and organization_id = v_org_id;
  if v_meeting.id is null then raise exception 'Meeting not found'; end if;

  if exists (select 1 from pg_proc where proname = 'generate_document_output') then
    v_generation := public.generate_document_output(
      null,
      coalesce(nullif(trim(p_report_type), ''), 'executive'),
      coalesce(nullif(trim(p_format), ''), 'pdf'),
      jsonb_build_object(
        'source', 'meeting_collaboration_intelligence_engine',
        'meeting_id', p_meeting_id,
        'meeting_type', v_meeting.meeting_type,
        'summary_metadata', v_meeting.summary_metadata
      )
    );
    v_generation_id := (v_generation->'generation'->>'id')::uuid;
  else
    v_generation := jsonb_build_object('generation', jsonb_build_object('id', null), 'metadata_only', true);
    v_generation_id := null;
  end if;

  insert into public.meeting_output_links (
    organization_id, meeting_id, document_output_generation_id, metadata
  )
  values (
    v_org_id, p_meeting_id, v_generation_id,
    jsonb_build_object('report_type', p_report_type, 'format', p_format, 'metadata_only', true)
  )
  returning * into v_link;

  v_workflow := public.trigger_meeting_workflow_hook(
    p_meeting_id,
    jsonb_build_object('output_link_id', v_link.id, 'generation_id', v_generation_id)
  );

  perform public._mcie_log(
    v_org_id, 'mcie_outputs_generated', 'meeting_output_link', v_link.id,
    jsonb_build_object('meeting_id', p_meeting_id, 'generation_id', v_generation_id)
  );

  return jsonb_build_object(
    'output_link', row_to_json(v_link)::jsonb,
    'generation', v_generation,
    'workflow_hook', v_workflow
  );
end; $$;

create or replace function public.export_meeting_collaboration_manifest(p_manifest_type text default 'meetings_summary')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_meetings jsonb;
  v_actions jsonb;
  v_decisions jsonb;
begin
  perform public._irp_require_permission('meetings.export');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  perform public.mark_action_overdue(null);

  select coalesce(jsonb_agg(row_to_json(m) order by m.scheduled_at desc), '[]'::jsonb) into v_meetings
  from public.collaboration_meetings m where m.organization_id = v_org_id limit 50;

  select coalesce(jsonb_agg(row_to_json(a) order by a.due_date nulls last), '[]'::jsonb) into v_actions
  from public.meeting_action_items a where a.organization_id = v_org_id limit 50;

  select coalesce(jsonb_agg(row_to_json(d) order by d.created_at desc), '[]'::jsonb) into v_decisions
  from public.meeting_decisions d where d.organization_id = v_org_id limit 30;

  perform public._mcie_log(
    v_org_id, 'mcie_manifest_exported', 'collaboration_meeting', null,
    jsonb_build_object('manifest_type', p_manifest_type, 'exported_by', v_user_id)
  );

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', coalesce(p_manifest_type, 'meetings_summary'),
    'meetings', v_meetings,
    'action_items', v_actions,
    'decisions', v_decisions,
    'summary', public._mcie_executive_summary_block(v_org_id)
  );
end; $$;

create or replace function public.get_executive_meeting_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('meetings.view');
  v_org_id := public._mta_require_organization();
  perform public._mcie_seed_meetings(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Meeting accountability — metadata summaries; humans approve actions and outputs.',
    'summary', public._mcie_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'operations_center', 'Operations event context via A.32',
      'workflow_orchestration', 'Workflow hooks require approval — A.42',
      'stakeholder_communication', 'Follow-up communications — A.53',
      'document_output', 'Meeting outputs via Document & Output Engine — A.59'
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_meeting_collaboration_intelligence_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('meetings.view');
  v_org_id := public._mta_require_organization();
  perform public._mcie_seed_meetings(v_org_id);
  perform public.mark_action_overdue(null);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Structured meeting lifecycle — agendas, summaries, decisions, and actions with human approval.',
    'principles', jsonb_build_array(
      'Metadata-only meeting capture',
      'Human-approved workflow triggers',
      'Action accountability',
      'Decision register',
      'Output links via Document & Output Engine'
    ),
    'summary', public._mcie_executive_summary_block(v_org_id),
    'meetings', coalesce((
      select jsonb_agg(row_to_json(m) order by m.scheduled_at desc)
      from public.collaboration_meetings m where m.organization_id = v_org_id limit 30
    ), '[]'::jsonb),
    'action_items', coalesce((
      select jsonb_agg(row_to_json(a) order by a.due_date nulls last)
      from public.meeting_action_items a where a.organization_id = v_org_id limit 40
    ), '[]'::jsonb),
    'decisions', coalesce((
      select jsonb_agg(row_to_json(d) order by d.created_at desc)
      from public.meeting_decisions d where d.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'executive_summary', public._mcie_executive_summary_block(v_org_id),
    'workflow_examples', jsonb_build_object(
      'executive', public._mcie_workflow_examples('executive'),
      'incident_review', public._mcie_workflow_examples('incident_review'),
      'customer_success', public._mcie_workflow_examples('customer_success'),
      'strategy', public._mcie_workflow_examples('strategy'),
      'department', public._mcie_workflow_examples('department'),
      'project', public._mcie_workflow_examples('project')
    ),
    'integration_notes', jsonb_build_object(
      'operations_center', 'Extends Operations Center Foundation (A.32) with meeting-driven follow-ups',
      'workflow_orchestration', 'trigger_meeting_workflow_hook() — metadata triggers, not auto-execute (A.42)',
      'stakeholder_communication', 'Follow-up campaigns complement Stakeholder Communication (A.53)',
      'document_output', 'generate_meeting_outputs() links A.59 output_generations',
      'organizational_memory', 'Optional memory hooks — metadata only (A.34)'
    ),
    'integration_summaries', jsonb_build_object(
      'operations_center', public._mcie_operations_center_summary(v_org_id),
      'stakeholder_communication', public._mcie_stakeholder_communication_summary(v_org_id),
      'document_output', public._mcie_document_output_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_meeting_collaboration_intelligence_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_summary jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._mcie_seed_meetings(v_org_id);
  v_summary := public._mcie_executive_summary_block(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Meeting & Collaboration Intelligence — structured accountability.',
    'scheduled_meetings', v_summary->'scheduled_meetings',
    'open_actions', v_summary->'open_action_items',
    'completed_meetings_30d', v_summary->'completed_meetings_30d',
    'overdue_actions', v_summary->'overdue_action_items'
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
    'mcie_decision_captured', 'mcie_outputs_generated', 'mcie_manifest_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'meeting-collaboration-intelligence-engine', 'Meeting & Collaboration Intelligence Engine', 'Meeting lifecycle, agendas, summaries, decisions, action items, and output links — metadata only, human-approved workflows.', 'authenticated', 92
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'meeting-collaboration-intelligence-engine' and tenant_id is null);

grant execute on function public.create_collaboration_meeting(text, text, timestamptz, jsonb) to authenticated;
grant execute on function public.update_meeting_status(uuid, text) to authenticated;
grant execute on function public.cancel_meeting(uuid) to authenticated;
grant execute on function public.generate_meeting_agenda(uuid, boolean) to authenticated;
grant execute on function public.capture_meeting_summary(uuid, jsonb, boolean) to authenticated;
grant execute on function public.extract_action_items(uuid, jsonb) to authenticated;
grant execute on function public.assign_meeting_action(uuid, uuid, date) to authenticated;
grant execute on function public.update_action_item_status(uuid, text) to authenticated;
grant execute on function public.mark_action_overdue(uuid) to authenticated;
grant execute on function public.capture_meeting_decision(uuid, text, jsonb, boolean) to authenticated;
grant execute on function public.trigger_meeting_workflow_hook(uuid, jsonb) to authenticated;
grant execute on function public.generate_meeting_outputs(uuid, text, text) to authenticated;
grant execute on function public.export_meeting_collaboration_manifest(text) to authenticated;
grant execute on function public.get_executive_meeting_summary() to authenticated;
grant execute on function public.get_meeting_collaboration_intelligence_engine_dashboard() to authenticated;
grant execute on function public.get_meeting_collaboration_intelligence_engine_card() to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._mcie_seed_meetings(v_org_id);
  end loop;
end $$;
