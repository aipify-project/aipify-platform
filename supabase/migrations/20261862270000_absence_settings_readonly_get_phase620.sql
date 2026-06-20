-- Phase 620 P1 — Absence Settings read-only GET repair.

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, v.module_key, v.description
from (values
  ('absence.view', 'View Absence', null, 'View absence settings, coverage, and vacation mode status'),
  ('absence.manage', 'Manage Absence', null, 'Configure absence policies, delegation, and vacation mode')
) as v(key, label, module_key, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'absence.view'), ('owner', 'absence.manage'),
  ('administrator', 'absence.view'), ('administrator', 'absence.manage'),
  ('manager', 'absence.view'), ('manager', 'absence.manage'),
  ('support_agent', 'absence.view'),
  ('viewer', 'absence.view')
) as v(role, key)
on conflict (organization_id, role, permission_key) do nothing;

insert into public.organization_vac606_settings (organization_id)
select o.id
from public.organizations o
where not exists (
  select 1
  from public.organization_vac606_settings s
  where s.organization_id = o.id
)
on conflict (organization_id) do nothing;

create or replace function public._vac606_read_settings(p_org_id uuid)
returns public.organization_vac606_settings
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_row public.organization_vac606_settings;
begin
  select * into v_row
  from public.organization_vac606_settings
  where organization_id = p_org_id;

  if found then
    return v_row;
  end if;

  v_row.organization_id := p_org_id;
  v_row.absence_center_enabled := true;
  v_row.max_coverage_level := 3;
  v_row.default_coverage_level := 2;
  v_row.delegation_rules_enabled := true;
  v_row.template_approval_required := true;
  v_row.urgency_escalation_enabled := true;
  v_row.audit_logging_required := true;
  v_row.private_reasons_hidden := true;
  v_row.approval_requirements_preserved := true;
  v_row.mobile_summary_enabled := true;
  v_row.metadata := '{}'::jsonb;
  v_row.updated_at := now();
  return v_row;
end;
$$;

create or replace function public.get_organization_absence_settings(p_section text default 'overview')
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_section text;
  v_settings public.organization_vac606_settings;
begin
  v_org_id := public._vac606_org();
  if v_org_id is null then
    return jsonb_build_object('found', false, 'error', 'Organization not found');
  end if;

  v_section := public._vac606_normalize_section(p_section);
  v_settings := public._vac606_read_settings(v_org_id);

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'Administrator policies govern max coverage, delegation, templates, urgency, and audit.',
    'privacy_note', 'Private absence reasons never exposed. Approval requirements never weakened.',
    'settings', jsonb_build_object(
      'absence_center_enabled', v_settings.absence_center_enabled,
      'max_coverage_level', v_settings.max_coverage_level,
      'default_coverage_level', v_settings.default_coverage_level,
      'delegation_rules_enabled', v_settings.delegation_rules_enabled,
      'template_approval_required', v_settings.template_approval_required,
      'urgency_escalation_enabled', v_settings.urgency_escalation_enabled,
      'audit_logging_required', v_settings.audit_logging_required,
      'private_reasons_hidden', v_settings.private_reasons_hidden,
      'approval_requirements_preserved', v_settings.approval_requirements_preserved,
      'mobile_summary_enabled', v_settings.mobile_summary_enabled
    ),
    'admin_policies', coalesce((select jsonb_agg(jsonb_build_object(
      'policy_key', p.policy_key, 'policy_title', p.policy_title, 'policy_type', p.policy_type, 'summary', p.summary
    )) from public.organization_vac606_policies p where p.organization_id = v_org_id and p.policy_type = 'admin'), '[]'::jsonb),
    'response_templates', coalesce((select jsonb_agg(jsonb_build_object(
      'template_key', t.template_key, 'template_title', t.template_title, 'approved', t.approved, 'summary', t.summary
    )) from public.organization_vac606_response_templates t where t.organization_id = v_org_id), '[]'::jsonb),
    'urgency_rules', coalesce((select jsonb_agg(jsonb_build_object(
      'rule_key', u.rule_key, 'rule_title', u.rule_title, 'urgency_tier', u.urgency_tier, 'summary', u.summary
    )) from public.organization_vac606_urgency_rules u where u.organization_id = v_org_id), '[]'::jsonb),
    'delegation_rules', coalesce((select jsonb_agg(jsonb_build_object(
      'delegation_key', d.delegation_key, 'scope_label', d.scope_label, 'auto_expire', d.auto_expire, 'summary', d.summary
    )) from public.organization_vac606_delegations d where d.organization_id = v_org_id), '[]'::jsonb),
    'privacy_controls', coalesce((select jsonb_agg(jsonb_build_object(
      'control_key', p.control_key, 'control_title', p.control_title, 'summary', p.summary
    )) from public.organization_vac606_privacy_controls p where p.organization_id = v_org_id), '[]'::jsonb),
    'notification_behavior', coalesce((select jsonb_agg(jsonb_build_object(
      'behavior_key', n.behavior_key, 'behavior_title', n.behavior_title, 'summary', n.summary
    )) from public.organization_vac606_notification_behavior n where n.organization_id = v_org_id), '[]'::jsonb),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_vac606_audit_logs where organization_id = v_org_id order by created_at desc limit 30
    ) l), '[]'::jsonb)
  );
end;
$$;

create or replace function public.get_organization_absence_center(p_section text default 'overview')
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_section text;
  v_settings public.organization_vac606_settings;
  v_active_modes int;
  v_team_away int;
  v_avg_readiness int;
begin
  v_org_id := public._vac606_org();
  if v_org_id is null then
    return jsonb_build_object('found', false, 'error', 'Organization not found');
  end if;

  v_section := public._vac606_normalize_section(p_section);
  v_settings := public._vac606_read_settings(v_org_id);

  select count(*) into v_active_modes from public.organization_vac606_active_modes
    where organization_id = v_org_id and mode_status in ('active', 'scheduled');
  select count(*) into v_team_away from public.organization_vac606_team_availability
    where organization_id = v_org_id and availability_level_key in ('vacation', 'unavailable', 'unexpected', 'limited');
  v_avg_readiness := coalesce((
    select round(avg(readiness_score)) from public.organization_vac606_readiness_checks where organization_id = v_org_id
  ), 80);

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'Slapp av – Aipify svarer for deg. Transparent coverage — Aipify never pretends to be the absent person.',
      'privacy_note', 'Private absence reasons are never exposed. Coverage capped by organization policy.',
      'max_coverage_level', v_settings.max_coverage_level,
      'stats', jsonb_build_object(
        'active_modes', v_active_modes,
        'team_away', v_team_away,
        'readiness_score', v_avg_readiness,
        'delegations', (select count(*) from public.organization_vac606_delegations where organization_id = v_org_id),
        'templates', (select count(*) from public.organization_vac606_response_templates where organization_id = v_org_id)
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'check_title', c.check_title, 'recommendation', c.summary, 'readiness_score', c.readiness_score
        ) order by c.readiness_score)
        from public.organization_vac606_readiness_checks c
        where c.organization_id = v_org_id and c.readiness_score < 85 limit 3
      ), '[]'::jsonb),
      'availability_levels', coalesce((
        select jsonb_agg(jsonb_build_object(
          'level_key', d.level_key, 'level_title', d.level_title, 'icon_key', d.icon_key, 'status_key', d.status_key
        ) order by d.level_key) from public.vac606_availability_level_defs d
      ), '[]'::jsonb),
      'coverage_levels', coalesce((
        select jsonb_agg(jsonb_build_object(
          'coverage_level', c.coverage_level, 'level_title', c.level_title, 'status_key', c.status_key, 'summary', c.summary
        ) order by c.coverage_level) from public.vac606_coverage_level_defs c
      ), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'Business continuity through transparent Aipify coverage — humans decide, Aipify prepares.',
    'privacy_note', 'Approval requirements preserved. Private reasons hidden.',
    'max_coverage_level', v_settings.max_coverage_level,
    'stats', jsonb_build_object(
      'active_modes', v_active_modes, 'team_away', v_team_away, 'readiness_score', v_avg_readiness
    ),
    'scopes', coalesce((select jsonb_agg(jsonb_build_object('scope_key', s.scope_key, 'scope_title', s.scope_title, 'summary', s.summary) order by s.scope_key)
      from public.vac606_scope_defs s where s.scope_group in ('app', 'shared')), '[]'::jsonb),
    'activation_options', coalesce((select jsonb_agg(jsonb_build_object('option_key', o.option_key, 'option_title', o.option_title, 'summary', o.summary) order by o.option_key)
      from public.vac606_activation_option_defs o), '[]'::jsonb),
    'employee_settings', coalesce((select jsonb_agg(jsonb_build_object(
      'settings_key', e.settings_key, 'vacation_mode_enabled', e.vacation_mode_enabled,
      'preferred_coverage_level', e.preferred_coverage_level, 'activation_option_key', e.activation_option_key,
      'availability_level_key', e.availability_level_key, 'auto_return_enabled', e.auto_return_enabled, 'summary', e.summary
    )) from public.organization_vac606_employee_settings e where e.organization_id = v_org_id), '[]'::jsonb),
    'active_modes', coalesce((select jsonb_agg(jsonb_build_object(
      'mode_key', m.mode_key, 'scope_key', m.scope_key, 'activation_option_key', m.activation_option_key,
      'availability_level_key', m.availability_level_key, 'coverage_level', m.coverage_level,
      'mode_status', m.mode_status, 'transparent_notice', m.transparent_notice, 'summary', m.summary
    ) order by m.mode_status) from public.organization_vac606_active_modes m where m.organization_id = v_org_id), '[]'::jsonb),
    'team_availability', coalesce((select jsonb_agg(jsonb_build_object(
      'member_key', t.member_key, 'member_label', t.member_label, 'department_label', t.department_label,
      'availability_level_key', t.availability_level_key, 'coverage_level', t.coverage_level,
      'status_key', t.status_key, 'summary', t.summary
    )) from public.organization_vac606_team_availability t where t.organization_id = v_org_id), '[]'::jsonb),
    'coverage_items', coalesce((select jsonb_agg(jsonb_build_object(
      'coverage_key', c.coverage_key, 'coverage_title', c.coverage_title, 'coverage_type', c.coverage_type,
      'coverage_level', c.coverage_level, 'assignee_label', c.assignee_label, 'status_key', c.status_key, 'summary', c.summary
    )) from public.organization_vac606_coverage_items c where c.organization_id = v_org_id), '[]'::jsonb),
    'delegations', coalesce((select jsonb_agg(jsonb_build_object(
      'delegation_key', d.delegation_key, 'delegator_label', d.delegator_label, 'delegate_label', d.delegate_label,
      'scope_label', d.scope_label, 'starts_at', d.starts_at, 'ends_at', d.ends_at, 'auto_expire', d.auto_expire,
      'delegation_status', d.delegation_status, 'status_key', d.status_key, 'summary', d.summary
    )) from public.organization_vac606_delegations d where d.organization_id = v_org_id), '[]'::jsonb),
    'response_templates', coalesce((select jsonb_agg(jsonb_build_object(
      'template_key', t.template_key, 'template_title', t.template_title, 'template_body', t.template_body,
      'never_impersonate', t.never_impersonate, 'approved', t.approved, 'status_key', t.status_key, 'summary', t.summary
    )) from public.organization_vac606_response_templates t where t.organization_id = v_org_id), '[]'::jsonb),
    'schedules', coalesce((select jsonb_agg(jsonb_build_object(
      'schedule_key', s.schedule_key, 'schedule_title', s.schedule_title, 'schedule_type', s.schedule_type,
      'starts_label', s.starts_label, 'ends_label', s.ends_label, 'status_key', s.status_key, 'summary', s.summary
    )) from public.organization_vac606_schedules s where s.organization_id = v_org_id), '[]'::jsonb),
    'policies', coalesce((select jsonb_agg(jsonb_build_object(
      'policy_key', p.policy_key, 'policy_title', p.policy_title, 'policy_type', p.policy_type,
      'status_key', p.status_key, 'summary', p.summary
    )) from public.organization_vac606_policies p where p.organization_id = v_org_id), '[]'::jsonb),
    'return_summaries', coalesce((select jsonb_agg(jsonb_build_object(
      'summary_key', r.summary_key, 'summary_title', r.summary_title,
      'items_pending', r.items_pending, 'items_delegated', r.items_delegated, 'items_urgent', r.items_urgent,
      'status_key', r.status_key, 'summary', r.summary
    )) from public.organization_vac606_return_summaries r where r.organization_id = v_org_id), '[]'::jsonb),
    'history_events', coalesce((select jsonb_agg(jsonb_build_object(
      'event_key', h.event_key, 'event_title', h.event_title, 'event_type', h.event_type,
      'date_label', h.date_label, 'status_key', h.status_key, 'summary', h.summary, 'created_at', h.created_at
    ) order by h.created_at desc) from public.organization_vac606_history_events h where h.organization_id = v_org_id), '[]'::jsonb),
    'org_closure', coalesce((select jsonb_agg(jsonb_build_object(
      'closure_key', c.closure_key, 'closure_title', c.closure_title, 'closure_status', c.closure_status,
      'starts_label', c.starts_label, 'ends_label', c.ends_label, 'status_key', c.status_key, 'summary', c.summary
    )) from public.organization_vac606_org_closure c where c.organization_id = v_org_id), '[]'::jsonb),
    'department_routing', coalesce((select jsonb_agg(jsonb_build_object(
      'routing_key', r.routing_key, 'department_label', r.department_label,
      'coverage_contact_label', r.coverage_contact_label, 'status_key', r.status_key, 'summary', r.summary
    )) from public.organization_vac606_department_routing r where r.organization_id = v_org_id), '[]'::jsonb),
    'task_coverage', coalesce((select jsonb_agg(jsonb_build_object(
      'task_key', t.task_key, 'task_title', t.task_title, 'evaluation_status', t.evaluation_status,
      'assignee_label', t.assignee_label, 'status_key', t.status_key, 'summary', t.summary
    )) from public.organization_vac606_task_coverage t where t.organization_id = v_org_id), '[]'::jsonb),
    'message_coverage', coalesce((select jsonb_agg(jsonb_build_object(
      'channel_key', m.channel_key, 'channel_title', m.channel_title, 'channel_type', m.channel_type,
      'coverage_status', m.coverage_status, 'status_key', m.status_key, 'summary', m.summary
    )) from public.organization_vac606_message_coverage m where m.organization_id = v_org_id), '[]'::jsonb),
    'approval_coverage', coalesce((select jsonb_agg(jsonb_build_object(
      'approval_key', a.approval_key, 'approval_title', a.approval_title, 'risk_level', a.risk_level,
      'preserved', a.preserved, 'status_key', a.status_key, 'summary', a.summary
    )) from public.organization_vac606_approval_coverage a where a.organization_id = v_org_id), '[]'::jsonb),
    'calendar_integration', coalesce((select jsonb_agg(jsonb_build_object(
      'provider_key', c.provider_key, 'provider_title', c.provider_title,
      'integration_status', c.integration_status, 'status_key', c.status_key, 'summary', c.summary
    )) from public.organization_vac606_calendar_integration c where c.organization_id = v_org_id), '[]'::jsonb),
    'unexpected_absence', coalesce((select jsonb_agg(jsonb_build_object(
      'absence_key', u.absence_key, 'absence_title', u.absence_title, 'partial_availability', u.partial_availability,
      'urgency_level', u.urgency_level, 'status_key', u.status_key, 'summary', u.summary
    )) from public.organization_vac606_unexpected_absence u where u.organization_id = v_org_id), '[]'::jsonb),
    'urgency_rules', coalesce((select jsonb_agg(jsonb_build_object(
      'rule_key', u.rule_key, 'rule_title', u.rule_title, 'urgency_tier', u.urgency_tier,
      'escalate_to_label', u.escalate_to_label, 'status_key', u.status_key, 'summary', u.summary
    )) from public.organization_vac606_urgency_rules u where u.organization_id = v_org_id), '[]'::jsonb),
    'knowledge_governance', coalesce((select jsonb_agg(jsonb_build_object(
      'governance_key', k.governance_key, 'governance_title', k.governance_title,
      'access_level', k.access_level, 'status_key', k.status_key, 'summary', k.summary
    )) from public.organization_vac606_knowledge_governance k where k.organization_id = v_org_id), '[]'::jsonb),
    'return_workflows', coalesce((select jsonb_agg(jsonb_build_object(
      'workflow_key', w.workflow_key, 'workflow_title', w.workflow_title,
      'workflow_status', w.workflow_status, 'status_key', w.status_key, 'summary', w.summary
    )) from public.organization_vac606_return_workflows w where w.organization_id = v_org_id), '[]'::jsonb),
    'since_last_login_meta', coalesce((select jsonb_agg(jsonb_build_object(
      'meta_key', s.meta_key, 'meta_title', s.meta_title, 'items_count', s.items_count,
      'status_key', s.status_key, 'summary', s.summary
    )) from public.organization_vac606_since_last_login_meta s where s.organization_id = v_org_id), '[]'::jsonb),
    'permission_governance', coalesce((select jsonb_agg(jsonb_build_object(
      'governance_key', p.governance_key, 'governance_title', p.governance_title,
      'uses_existing_roles', p.uses_existing_roles, 'status_key', p.status_key, 'summary', p.summary
    )) from public.organization_vac606_permission_governance p where p.organization_id = v_org_id), '[]'::jsonb),
    'privacy_controls', coalesce((select jsonb_agg(jsonb_build_object(
      'control_key', p.control_key, 'control_title', p.control_title,
      'private_reasons_hidden', p.private_reasons_hidden, 'status_key', p.status_key, 'summary', p.summary
    )) from public.organization_vac606_privacy_controls p where p.organization_id = v_org_id), '[]'::jsonb),
    'notification_behavior', coalesce((select jsonb_agg(jsonb_build_object(
      'behavior_key', n.behavior_key, 'behavior_title', n.behavior_title,
      'channel_label', n.channel_label, 'status_key', n.status_key, 'summary', n.summary
    )) from public.organization_vac606_notification_behavior n where n.organization_id = v_org_id), '[]'::jsonb),
    'status_display', coalesce((select jsonb_agg(jsonb_build_object(
      'display_key', s.display_key, 'display_title', s.display_title, 'icon_key', s.icon_key,
      'text_label', s.text_label, 'status_key', s.status_key, 'summary', s.summary
    )) from public.organization_vac606_status_display s where s.organization_id = v_org_id), '[]'::jsonb),
    'meeting_scheduling', coalesce((select jsonb_agg(jsonb_build_object(
      'meeting_key', m.meeting_key, 'meeting_title', m.meeting_title,
      'integration_status', m.integration_status, 'status_key', m.status_key, 'summary', m.summary
    )) from public.organization_vac606_meeting_scheduling m where m.organization_id = v_org_id), '[]'::jsonb),
    'customer_expectations', coalesce((select jsonb_agg(jsonb_build_object(
      'expectation_key', e.expectation_key, 'expectation_title', e.expectation_title,
      'response_window_label', e.response_window_label, 'status_key', e.status_key, 'summary', e.summary
    )) from public.organization_vac606_customer_expectations e where e.organization_id = v_org_id), '[]'::jsonb),
    'business_pack_behavior', coalesce((select jsonb_agg(jsonb_build_object(
      'pack_key', b.pack_key, 'pack_title', b.pack_title, 'vacation_behavior', b.vacation_behavior,
      'status_key', b.status_key, 'summary', b.summary
    )) from public.organization_vac606_business_pack_behavior b where b.organization_id = v_org_id), '[]'::jsonb),
    'readiness_checks', coalesce((select jsonb_agg(jsonb_build_object(
      'check_key', r.check_key, 'check_title', r.check_title, 'readiness_score', r.readiness_score,
      'status_key', r.status_key, 'summary', r.summary
    ) order by r.readiness_score) from public.organization_vac606_readiness_checks r where r.organization_id = v_org_id), '[]'::jsonb),
    'reports', coalesce((select jsonb_agg(jsonb_build_object(
      'report_key', r.report_key, 'report_title', r.report_title, 'report_type', r.report_type,
      'metric_value', r.metric_value, 'status_key', r.status_key, 'summary', r.summary
    )) from public.organization_vac606_reports r where r.organization_id = v_org_id), '[]'::jsonb),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_vac606_audit_logs where organization_id = v_org_id order by created_at desc limit 20
    ) l), '[]'::jsonb),
    'mobile_access', jsonb_build_object(
      'vacation_mode', true, 'team_availability', true, 'return_summary', true, 'readiness_check', true
    )
  );
end;
$$;

grant execute on function public._vac606_read_settings(uuid) to authenticated;
grant execute on function public.get_organization_absence_settings(text) to authenticated;
grant execute on function public.get_organization_absence_center(text) to authenticated;
