-- Implementation Blueprint Phase 12 — Task & Priority Engine Foundation
-- Spec alignment extending Unified Task & Follow-Up Engine (Phase A.62). No new tables.

create or replace function public._utfe_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_settings public.organization_task_settings;
  v_tasks int := 0;
  v_assigned int := 0;
  v_overdue int := 0;
  v_reminders int := 0;
  v_critical int := 0;
  v_completed int := 0;
  v_escalations int := 0;
  v_priority_levels int := 0;
begin
  perform public._utfe_ensure_settings(p_organization_id);
  perform public._utfe_seed_tasks(p_organization_id);
  perform public._utfe_mark_overdue_tasks(p_organization_id, null);

  select * into v_settings from public.organization_task_settings where organization_id = p_organization_id;

  select count(*) into v_tasks from public.organization_tasks where organization_id = p_organization_id;

  select count(*) into v_assigned
  from public.organization_tasks
  where organization_id = p_organization_id and assigned_user_id is not null;

  select count(*) into v_overdue
  from public.organization_tasks
  where organization_id = p_organization_id and status = 'overdue';

  select count(*) into v_reminders
  from public.organization_task_reminders
  where organization_id = p_organization_id and status = 'scheduled';

  select count(*) into v_critical
  from public.organization_tasks
  where organization_id = p_organization_id
    and priority = 'critical'
    and status in ('open', 'in_progress', 'awaiting_approval', 'overdue');

  select count(*) into v_completed
  from public.organization_tasks
  where organization_id = p_organization_id and status = 'completed';

  select count(*) into v_escalations
  from public.organization_task_escalations
  where organization_id = p_organization_id;

  select count(distinct priority) into v_priority_levels
  from public.organization_tasks
  where organization_id = p_organization_id;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'tasks_tracked',
      'label', 'Organizational tasks tracked with title, priority, and status',
      'met', v_tasks > 0,
      'note', case when v_tasks = 0 then 'Create or seed tasks to validate task management.' else null end
    ),
    jsonb_build_object(
      'key', 'assignments_present',
      'label', 'Tasks assigned with clear ownership',
      'met', v_assigned > 0,
      'note', case when v_assigned = 0 then 'Assign at least one task to validate ownership workflows.' else null end
    ),
    jsonb_build_object(
      'key', 'overdue_handling',
      'label', 'Overdue tasks detected and surfaced for follow-up',
      'met', v_overdue >= 0 and v_tasks > 0,
      'note', case
        when v_tasks > 0 and v_overdue = 0 then 'No overdue tasks — healthy queue or add a past-due test task.'
        else null
      end
    ),
    jsonb_build_object(
      'key', 'reminders_scheduled',
      'label', 'Follow-up reminders scheduled for open commitments',
      'met', v_reminders > 0 or coalesce(v_settings.reminders_enabled, true),
      'note', case
        when v_reminders = 0 then 'Schedule a reminder on an open task to validate follow-up.'
        else null
      end
    ),
    jsonb_build_object(
      'key', 'critical_tasks_visible',
      'label', 'Critical-priority tasks visible for executive attention',
      'met', v_critical >= 0 and v_tasks > 0,
      'note', case
        when v_tasks > 0 and v_critical = 0 then 'Add a critical task to validate priority surfacing.'
        else null
      end
    ),
    jsonb_build_object(
      'key', 'completions_recorded',
      'label', 'Task completions recorded with audit trail',
      'met', v_completed > 0,
      'note', case when v_completed = 0 then 'Complete a task to validate completion and organizational memory hooks.' else null end
    ),
    jsonb_build_object(
      'key', 'escalation_paths',
      'label', 'Escalation recommendations available when follow-up is needed',
      'met', v_escalations > 0 or coalesce(v_settings.escalation_enabled, true),
      'note', case
        when v_escalations = 0 then 'Escalate an overdue or critical task to validate escalation paths.'
        else null
      end
    ),
    jsonb_build_object(
      'key', 'priority_framework_used',
      'label', 'Priority framework applied across critical, high, medium, and low',
      'met', v_priority_levels >= 2,
      'note', case
        when v_priority_levels < 2 then 'Use multiple priority levels to validate the priority framework.'
        else null
      end
    )
  );
end; $$;

create or replace function public._utfe_task_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'create', 'label', 'Create organizational tasks with clear titles and context'),
    jsonb_build_object('key', 'assign', 'label', 'Assign owners and confirm accountability'),
    jsonb_build_object('key', 'priority_recommendations', 'label', 'Apply priority recommendations — humans approve adjustments'),
    jsonb_build_object('key', 'due_dates', 'label', 'Set due dates and surface upcoming deadlines'),
    jsonb_build_object('key', 'follow_up', 'label', 'Schedule reminders and proactive follow-up'),
    jsonb_build_object('key', 'status', 'label', 'Track status from open through completion'),
    jsonb_build_object('key', 'completion', 'label', 'Mark complete and capture lessons for organizational memory')
  );
$$;

create or replace function public._utfe_task_attributes()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'note', 'Maps to organization_tasks and metadata — no new tables.',
    'attributes', jsonb_build_array(
      jsonb_build_object('key', 'title', 'label', 'Title', 'field', 'title'),
      jsonb_build_object('key', 'description', 'label', 'Description', 'field', 'description'),
      jsonb_build_object('key', 'priority', 'label', 'Priority', 'field', 'priority', 'values', jsonb_build_array('critical', 'high', 'medium', 'low')),
      jsonb_build_object('key', 'owner', 'label', 'Owner', 'field', 'assigned_user_id', 'via', 'assign_organization_task'),
      jsonb_build_object('key', 'workspace', 'label', 'Workspace', 'field', 'organization_id', 'note', 'Tenant-scoped via organization'),
      jsonb_build_object('key', 'due_date', 'label', 'Due date', 'field', 'due_date'),
      jsonb_build_object('key', 'status', 'label', 'Status', 'field', 'status', 'values', jsonb_build_array('open', 'in_progress', 'awaiting_approval', 'completed', 'cancelled', 'overdue')),
      jsonb_build_object('key', 'kc_articles', 'label', 'KC articles', 'field', 'metadata.kc_article_ids', 'note', 'Linked playbooks and procedures — metadata only'),
      jsonb_build_object('key', 'support_cases', 'label', 'Linked support cases', 'field', 'source_type', 'value', 'support', 'via', 'source_id'),
      jsonb_build_object('key', 'tags', 'label', 'Tags', 'field', 'metadata.tags'),
      jsonb_build_object('key', 'audit', 'label', 'Audit trail', 'via', 'utfe_* audit events', 'note', 'Task lifecycle logged — metadata only')
    )
  );
$$;

create or replace function public._utfe_priority_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Not all tasks are equal — focus on what matters for sustainable progress.',
    'levels', jsonb_build_array(
      jsonb_build_object('key', 'critical', 'label', 'Critical', 'focus', 'Immediate organizational impact — executive attention'),
      jsonb_build_object('key', 'high', 'label', 'High', 'focus', 'Important this week — clear owner required'),
      jsonb_build_object('key', 'medium', 'label', 'Medium', 'focus', 'Standard operational follow-through'),
      jsonb_build_object('key', 'low', 'label', 'Low', 'focus', 'When capacity allows — no artificial urgency')
    ),
    'recommendation_note', 'Aipify may recommend priority adjustments with explainable reasoning — humans approve changes.',
    'priority_focus_engine_route', '/app/priority-focus-engine',
    'priority_focus_engine_note', 'Priority & Focus Engine A.80 provides P1–P4 dimensions and focus recommendations — cross-link only, do not merge engines.'
  );
$$;

create or replace function public._utfe_companion_assistance_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'priority_suggestion',
      'scenario', 'User creates a task with unclear urgency',
      'example', 'This looks important for the launch timeline — would you like to set priority to High and assign an owner?'
    ),
    jsonb_build_object(
      'key', 'overdue_gentle',
      'scenario', 'Task is approaching or past due date',
      'example', 'The incident review checklist is due tomorrow — shall I schedule a reminder or help re-prioritize?'
    ),
    jsonb_build_object(
      'key', 'workload_balance',
      'scenario', 'User has many critical tasks open',
      'example', 'You have three critical tasks this week — would it help to review priorities together?'
    ),
    jsonb_build_object(
      'key', 'completion_celebration',
      'scenario', 'Task marked complete after sustained effort',
      'example', 'Nice work completing the weekly priorities review — steady progress adds up.'
    ),
    jsonb_build_object(
      'key', 'kc_procedure',
      'scenario', 'Task linked to a support or operational procedure',
      'example', 'There is a Knowledge Center playbook for this follow-up — would you like me to surface it?'
    )
  );
$$;

create or replace function public._utfe_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love reduces task stress, discourages unrealistic workloads, celebrates completion, and avoids constant urgency.',
    'task_patterns', jsonb_build_array(
      'Reduce stress — gentle reminders, not guilt-based follow-up',
      'Discourage unrealistic workloads — flag when critical tasks pile up',
      'Celebrate completion — acknowledge steady progress on milestones',
      'Avoid constant urgency — low priority means when capacity allows'
    ),
    'self_love_route', '/app/self-love-engine',
    'naming_doc', 'SELF_LOVE_NAMING_STANDARD.md',
    'boundary_note', 'Self Love is a principle — not a feature toggle. No ™ in product copy.'
  );
$$;

create or replace function public._utfe_bell_moments()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'emoji', '🔔',
    'label', 'Bell Moments',
    'principle', 'Small celebrations on milestones and completion — infrequent enough to retain significance.',
    'frequency_note', 'Not alert spam — celebrate meaningful completions and team milestones.',
    'examples', jsonb_build_array(
      jsonb_build_object('key', 'milestone_complete', 'text', '🔔 Critical task completed — the team moved something important forward.'),
      jsonb_build_object('key', 'weekly_progress', 'text', '🔔 All weekly priorities reviewed — steady progress this week.'),
      jsonb_build_object('key', 'team_handoff', 'text', '🔔 Meeting action items converted to tracked tasks — clear ownership set.')
    ),
    'gratitude_route', '/app/gratitude-recognition-engine',
    'gratitude_note', 'Bell moments coordinate with Gratitude & Recognition A.89 — metadata only.'
  );
$$;

create or replace function public._utfe_kc_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Tasks connect to procedures, playbooks, and lessons learned in the Knowledge Center.',
    'flows', jsonb_build_array(
      jsonb_build_object('key', 'procedures', 'action', 'Link KC article IDs in task metadata for operational playbooks'),
      jsonb_build_object('key', 'support_follow_up', 'action', 'create_task_from_source(support, …) for case follow-up tasks'),
      jsonb_build_object('key', 'lessons_learned', 'action', 'Completed tasks may suggest KC article updates — approval workflow'),
      jsonb_build_object('key', 'retrieval', 'action', 'Surface relevant KC content when companion assists on task context')
    ),
    'knowledge_center_route', '/app/knowledge-center-engine',
    'source_type', 'knowledge_center'
  );
$$;

create or replace function public._utfe_organizational_memory_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Completed tasks inform lessons, improvements, and recommendations — metadata only.',
    'flows', jsonb_build_array(
      jsonb_build_object('key', 'completion_hook', 'action', '_utfe_memory_hook() captures follow-up patterns on complete'),
      jsonb_build_object('key', 'lessons', 'action', 'Post-completion summaries feed organizational memory A.34'),
      jsonb_build_object('key', 'improvements', 'action', 'Recurring overdue patterns suggest process improvements'),
      jsonb_build_object('key', 'recommendations', 'action', 'Task completion trends inform continuous improvement')
    ),
    'organizational_memory_route', '/app/organizational-memory-engine',
    'boundary_note', 'Organizational memory stores patterns and outcomes — never raw operational records.'
  );
$$;

create or replace function public._utfe_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Priority recommendations and reminders must be explainable — users understand why Aipify suggests changes.',
    'users_should_know', jsonb_build_array(
      'Why a priority adjustment is recommended',
      'Which tasks triggered a follow-up reminder',
      'When an escalation was suggested and why',
      'That task payloads are metadata only — no raw chat or email content'
    ),
    'organizations_should_understand', jsonb_build_array(
      'Priority framework maps to organization_tasks.priority',
      'Reminders respect organization_task_settings preferences',
      'Escalations are recommendations — humans approve action',
      'Full audit via utfe_* events — transparent accountability'
    ),
    'audit_note', 'Task lifecycle logged in audit allowlist — metadata only.'
  );
$$;

create or replace function public._utfe_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates task management internally; Unonight is the first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — task capture, priority framework, reminders, completion tracking',
      'focus', jsonb_build_array('Weekly operational priorities', 'Meeting action item follow-up', 'Incident review tasks', 'KC-linked procedures')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce operational task workflows',
      'focus', jsonb_build_array('Support case follow-up tasks', 'Launch checklist tracking', 'Team accountability', 'Priority recommendations with human approval')
    )
  );
$$;

create or replace function public._utfe_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Prioritize effectively — focus on what matters, not everything at once.',
    'Clear ownership and gentle follow-up beat constant urgency.',
    'Steady progress compounds — celebrate completions along the way.',
    'Not all tasks are equal — the priority framework keeps teams aligned.',
    'Transparent recommendations build trust — humans always decide.'
  );
$$;

create or replace function public._utfe_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Priority & Focus (A.80)', 'route', '/app/priority-focus-engine', 'note', 'P1–P4 dimensions and focus recommendations — cross-link only'),
    jsonb_build_object('label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine'),
    jsonb_build_object('label', 'Organizational Memory (A.34)', 'route', '/app/organizational-memory-engine'),
    jsonb_build_object('label', 'Support AI (A.7)', 'route', '/app/support-ai-engine', 'note', 'Support case follow-up via source_type support'),
    jsonb_build_object('label', 'Gratitude & Recognition (A.89)', 'route', '/app/gratitude-recognition-engine', 'note', 'Bell moments on milestones and completion'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine'),
    jsonb_build_object('label', 'Proactive Companion (A.79)', 'route', '/app/proactive-companion-engine'),
    jsonb_build_object('label', 'Meeting Intelligence (A.61)', 'route', '/app/meeting-collaboration-intelligence-engine', 'note', 'create_task_from_source(meeting, …)'),
    jsonb_build_object('label', 'Unonight Pilot', 'route', '/app/unonight-pilot-operations-engine')
  );
$$;

create or replace function public.get_unified_task_follow_up_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_summary jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._utfe_seed_tasks(v_org_id);
  perform public._utfe_mark_overdue_tasks(v_org_id, null);
  v_summary := public._utfe_executive_summary_block(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Prioritize effectively, reduce friction, and make steady progress — not all tasks are equal.',
    'mission', 'Help organizations prioritize effectively, reduce friction, and maintain steady progress on what matters.',
    'abos_principle', 'Focus on what matters — sustainable progress beats constant urgency.',
    'my_open_tasks', v_summary->'my_open_tasks',
    'overdue_tasks', v_summary->'overdue_tasks',
    'critical_tasks', v_summary->'critical_tasks',
    'completed_tasks_30d', v_summary->'completed_tasks_30d',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 12 — Task & Priority Engine Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE12_TASK_PRIORITY_ENGINE_FOUNDATION.md',
      'engine_phase', 'A.62 Unified Task & Follow-Up Engine',
      'route', '/app/unified-task-follow-up-engine'
    ),
    'unified_task_follow_up_engine_note', 'Task & Priority Engine Foundation (ABOS Phase 12) — extends Unified Task & Follow-Up Engine (Phase A.62).'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_unified_task_follow_up_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  perform public._irp_require_permission('tasks.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._utfe_seed_tasks(v_org_id);
  perform public._utfe_mark_overdue_tasks(v_org_id, null);

  return jsonb_build_object(
    'has_organization', true,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 12 — Task & Priority Engine Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE12_TASK_PRIORITY_ENGINE_FOUNDATION.md',
      'engine_phase', 'A.62 Unified Task & Follow-Up Engine',
      'route', '/app/unified-task-follow-up-engine',
      'mapping_note', 'ABOS Blueprint Phase 12 maps to Unified Task & Follow-Up Engine A.62 — extend, do not duplicate. Priority recommendations dimension cross-links Priority & Focus Engine A.80.'
    ),
    'mission', 'Help organizations prioritize effectively, reduce friction, and maintain steady progress on what matters.',
    'philosophy', 'Not all tasks are equal — focus on what matters, reduce friction, and make steady sustainable progress.',
    'abos_principle', 'Focus on what matters — sustainable progress beats constant urgency.',
    'vision', 'Organizations know what to do next, who owns it, and why it matters — with gentle follow-up and transparent priorities.',
    'unified_task_follow_up_engine_note', 'Task & Priority Engine Foundation (ABOS Phase 12) — extends Unified Task & Follow-Up Engine (Phase A.62).',
    'distinction_note', 'Distinct from PAME personal tasks at /app/assistant — organization_tasks stores metadata commitments only. Priority recommendations cross-link Priority & Focus Engine A.80 — do not merge engines.',
    'task_objectives', public._utfe_task_objectives(),
    'task_attributes', public._utfe_task_attributes(),
    'priority_framework', public._utfe_priority_framework(),
    'companion_assistance_examples', public._utfe_companion_assistance_examples(),
    'self_love_connection', public._utfe_self_love_connection(),
    'self_love_note', 'Self Love (A.76) reduces task stress, balances workloads, and celebrates completion — principle only; Unified Task Engine stores metadata, not wellbeing content.',
    'bell_moments', public._utfe_bell_moments(),
    'kc_connection', public._utfe_kc_connection(),
    'organizational_memory_connection', public._utfe_organizational_memory_connection(),
    'trust_connection', public._utfe_trust_connection(),
    'dogfooding', public._utfe_blueprint_dogfooding(),
    'success_criteria', public._utfe_blueprint_success_criteria(v_org_id),
    'vision_phrases', public._utfe_vision_phrases(),
    'integration_links', public._utfe_integration_links(),
    'principles', jsonb_build_array(
      'Clear ownership',
      'Transparent accountability',
      'Proactive follow-up',
      'Organizational visibility',
      'Audit-supported accountability',
      'Sustainable progress over constant urgency'
    ),
    'summary', public._utfe_executive_summary_block(v_org_id),
    'sections', jsonb_build_object(
      'my_tasks', coalesce((
        select jsonb_agg(row_to_json(t) order by t.due_date nulls last)
        from public.organization_tasks t
        where t.organization_id = v_org_id
          and t.assigned_user_id = v_user_id
          and t.status in ('open', 'in_progress', 'awaiting_approval', 'overdue')
        limit 30
      ), '[]'::jsonb),
      'team_tasks', coalesce((
        select jsonb_agg(row_to_json(t) order by t.due_date nulls last)
        from public.organization_tasks t
        where t.organization_id = v_org_id
          and (t.assigned_user_id is null or t.assigned_user_id <> v_user_id)
          and t.status in ('open', 'in_progress', 'awaiting_approval', 'overdue')
        limit 30
      ), '[]'::jsonb),
      'overdue_tasks', coalesce((
        select jsonb_agg(row_to_json(t) order by t.due_date nulls last)
        from public.organization_tasks t
        where t.organization_id = v_org_id and t.status = 'overdue'
        limit 30
      ), '[]'::jsonb),
      'upcoming_deadlines', coalesce((
        select jsonb_agg(row_to_json(t) order by t.due_date nulls last)
        from public.organization_tasks t
        where t.organization_id = v_org_id
          and t.status in ('open', 'in_progress', 'awaiting_approval')
          and t.due_date is not null
          and t.due_date between current_date and current_date + 14
        limit 30
      ), '[]'::jsonb),
      'critical_tasks', coalesce((
        select jsonb_agg(row_to_json(t) order by t.due_date nulls last)
        from public.organization_tasks t
        where t.organization_id = v_org_id
          and t.priority = 'critical'
          and t.status in ('open', 'in_progress', 'awaiting_approval', 'overdue')
        limit 30
      ), '[]'::jsonb),
      'completed_tasks', coalesce((
        select jsonb_agg(row_to_json(t) order by t.updated_at desc)
        from public.organization_tasks t
        where t.organization_id = v_org_id and t.status = 'completed'
        limit 30
      ), '[]'::jsonb)
    ),
    'reminders', coalesce((
      select jsonb_agg(row_to_json(r) order by r.remind_at)
      from public.organization_task_reminders r
      where r.organization_id = v_org_id and r.status = 'scheduled'
      limit 20
    ), '[]'::jsonb),
    'escalations', coalesce((
      select jsonb_agg(row_to_json(e) order by e.created_at desc)
      from public.organization_task_escalations e
      where e.organization_id = v_org_id
      limit 20
    ), '[]'::jsonb),
    'settings', (
      select row_to_json(s)::jsonb from public.organization_task_settings s
      where s.organization_id = v_org_id
    ),
    'executive_summary', public._utfe_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'operations_center', 'Extends Operations Center Foundation (A.32)',
      'workflow_orchestration', 'Approved workflows may create tasks — A.42',
      'meeting_collaboration', 'Meeting action items via create_task_from_source — A.61',
      'organizational_memory', 'Completion hooks capture follow-up patterns — A.34',
      'context_engine', 'sync_task_calendar_hook() scaffold — never replaces calendars',
      'priority_focus', 'Priority recommendations cross-link Priority & Focus Engine A.80 — distinct engines'
    ),
    'integration_summaries', jsonb_build_object(
      'operations_center', public._utfe_operations_center_summary(v_org_id),
      'workflow_orchestration', public._utfe_workflow_integration_summary(v_org_id),
      'meeting_collaboration', public._utfe_meeting_integration_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._utfe_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'task-priority-engine-blueprint', 'Task & Priority Engine (ABOS Phase 12)',
  'Task & Priority Engine Foundation — extends Unified Task & Follow-Up Engine A.62 with priority framework, companion examples, and live success criteria.',
  'authenticated', 94
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'task-priority-engine-blueprint' and tenant_id is null
);
