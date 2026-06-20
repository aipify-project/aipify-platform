-- Phase 620 P1 — Approvals read-only GET repair.

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, v.module_key, v.description
from (values
  ('approvals.view', 'View Approvals', null, 'View organization approval inbox and history'),
  ('approvals.manage', 'Manage Approvals', null, 'Approve, reject, and manage approval actions')
) as v(key, label, module_key, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'approvals.view'), ('owner', 'approvals.manage'),
  ('administrator', 'approvals.view'), ('administrator', 'approvals.manage'),
  ('manager', 'approvals.view'), ('manager', 'approvals.manage'),
  ('support_agent', 'approvals.view'),
  ('viewer', 'approvals.view')
) as v(role, key) on conflict (organization_id, role, permission_key) do nothing;

insert into public.tenant_action_emergency (tenant_id)
select c.id from public.customers c
where not exists (
  select 1 from public.tenant_action_emergency e where e.tenant_id = c.id
)
on conflict (tenant_id) do nothing;

insert into public.aipify_briefing_settings (tenant_id)
select c.id from public.customers c
where not exists (
  select 1 from public.aipify_briefing_settings s where s.tenant_id = c.id
)
on conflict (tenant_id) do nothing;

create or replace function public._bs_read_settings(p_tenant_id uuid)
returns public.aipify_briefing_settings
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_row public.aipify_briefing_settings;
begin
  select * into v_row
  from public.aipify_briefing_settings
  where tenant_id = p_tenant_id;

  if found then
    return v_row;
  end if;

  v_row.id := null;
  v_row.tenant_id := p_tenant_id;
  v_row.enabled := true;
  v_row.since_last_login_enabled := true;
  v_row.daily_brief_enabled := true;
  v_row.executive_brief_enabled := true;
  v_row.operational_brief_enabled := true;
  v_row.default_daily_time := '08:00';
  v_row.default_timezone := 'Europe/Oslo';
  v_row.max_default_items := 7;
  v_row.include_quality := true;
  v_row.include_support := true;
  v_row.include_knowledge := true;
  v_row.include_governance := true;
  v_row.include_automation := true;
  v_row.include_insights := true;
  v_row.include_integrations := true;
  v_row.created_at := now();
  v_row.updated_at := now();
  return v_row;
end;
$$;

create or replace function public.get_companion_context_briefing(p_context text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_context text;
  v_settings public.aipify_briefing_settings;
  v_body jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_context := lower(trim(coalesce(p_context, 'home')));
  v_settings := public._bs_read_settings(v_tenant_id);

  if not v_settings.enabled then
    return jsonb_build_object(
      'has_customer', true,
      'enabled', false,
      'context', v_context
    );
  end if;

  v_body := public._acb_context_summary(v_context);

  return jsonb_build_object(
    'has_customer', true,
    'enabled', true,
    'context', v_context,
    'summary', v_body ->> 'summary',
    'key_items', coalesce(v_body -> 'key_items', '[]'::jsonb),
    'metrics', coalesce(v_body -> 'metrics', '{}'::jsonb),
    'companion_note', v_body ->> 'companion_note',
    'privacy_note', 'Companion briefings summarize verified module activity only — metadata, calm tone, human control.'
  );
end;
$$;

create or replace function public.get_customer_approvals_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  if not public.has_organization_permission('approvals.view')
     and not public.has_organization_permission('approvals.manage') then
    raise exception 'Permission denied: approvals.view';
  end if;

  return jsonb_build_object(
    'has_customer', true,
    'philosophy', 'Assist. Recommend. Execute responsibly. Aipify never performs irreversible or sensitive actions without appropriate authorization.',
    'mission', 'Allow Aipify to automate and perform approved actions while ensuring humans remain informed and empowered.',
    'abos_principle', 'Automation should strengthen human capability. Not replace human responsibility.',
    'vision', 'Organizations move faster without sacrificing trust, governance, or accountability.',
    'core_philosophy', jsonb_build_array('Assist', 'Recommend', 'Execute responsibly'),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 6 — Action & Approval Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE6_ACTION_APPROVAL_FOUNDATION.md'
    ),
    'action_categories', jsonb_build_array(
      jsonb_build_object(
        'key', 'low',
        'label', 'Low Risk Actions',
        'approval', 'automatic_permitted',
        'examples', jsonb_build_array(
          'Draft responses', 'Create reminders', 'Organize information',
          'Generate reports', 'Recommend knowledge articles'
        ),
        'trust_action_levels', jsonb_build_array(0, 1)
      ),
      jsonb_build_object(
        'key', 'medium',
        'label', 'Medium Risk Actions',
        'approval', 'human_review_recommended',
        'examples', jsonb_build_array(
          'Send approved emails', 'Update documentation', 'Create support tickets',
          'Schedule meetings', 'Modify operational records'
        ),
        'trust_action_levels', jsonb_build_array(1, 2)
      ),
      jsonb_build_object(
        'key', 'high',
        'label', 'High Risk Actions',
        'approval', 'explicit_approval_required',
        'examples', jsonb_build_array(
          'Delete data', 'Change permissions', 'Execute financial actions',
          'Publish externally', 'Modify governance settings'
        ),
        'trust_action_levels', jsonb_build_array(3, 4)
      )
    ),
    'approval_principles', jsonb_build_array(
      jsonb_build_object('risk', 'low', 'rule', 'Automatic execution permitted'),
      jsonb_build_object('risk', 'medium', 'rule', 'Human review recommended'),
      jsonb_build_object('risk', 'high', 'rule', 'Explicit approval required')
    ),
    'approval_workflow_fields', jsonb_build_array(
      'Action summary', 'Reason for recommendation', 'Expected outcome',
      'Potential risks', 'Approval history', 'Responsible approver'
    ),
    'transparency_requirements', jsonb_build_array(
      'What Aipify proposes',
      'Why the action is recommended',
      'What systems are affected',
      'Whether approval is required',
      'Whether the action succeeded'
    ),
    'self_love_note', 'Self Love (A.76 planned) encourages thoughtful action — discouraging impulsive decisions, recommending reflection, and promoting sustainable operational practices.',
    'audit_requirements', jsonb_build_array(
      'Who initiated the action',
      'Who approved the action',
      'What occurred',
      'When it occurred',
      'Which systems were affected'
    ),
    'dogfooding', jsonb_build_object(
      'principle', 'Aipify Group validates action workflows internally; Unonight is the first external pilot.',
      'aipify_group', jsonb_build_object('slug', 'aipify-group'),
      'unonight', jsonb_build_object('slug', 'unonight')
    ),
    'success_criteria', public._tae_blueprint_success_criteria(v_tenant_id),
    'vision_phrases', jsonb_build_array(
      'Yes, Aipify can handle that.',
      'Because they understand exactly how and why it works.'
    ),
    'integration_links', jsonb_build_array(
      jsonb_build_object('label', 'Human Oversight Engine (A.40)', 'route', '/app/human-oversight-engine'),
      jsonb_build_object('label', 'Secure AI Actions (A.3)', 'route', '/app/secure-ai-actions'),
      jsonb_build_object('label', 'Trust & Explainability (Phase 76)', 'route', '/app/trust'),
      jsonb_build_object('label', 'Governance & Policy (A.14)', 'route', '/app/governance-policy-engine'),
      jsonb_build_object('label', 'Action Center (AEF)', 'route', '/app/action-center')
    ),
    'emergency_state', (select state from public.tenant_action_emergency where tenant_id = v_tenant_id),
    'summary', jsonb_build_object(
      'pending_approvals', coalesce((
        select count(*) from public.action_requests
        where tenant_id = v_tenant_id and status = 'pending'
      ), 0),
      'high_risk_pending', coalesce((
        select count(*) from public.action_requests
        where tenant_id = v_tenant_id and status = 'pending' and risk_level >= 3
      ), 0),
      'audit_events', coalesce((
        select count(*) from public.action_audit_logs where tenant_id = v_tenant_id
      ), 0)
    ),
    'approvals', coalesce(
      (
        select jsonb_agg(row order by row ->> 'created_at' desc)
        from (
          select jsonb_build_object(
            'id', ar.id,
            'title', coalesce(s.name, 'Aipify') || ': ' || ar.action_name,
            'description', coalesce(ae.explanation, ar.description),
            'category', 'action',
            'status', ar.status,
            'risk_level', ar.risk_level::text,
            'action_name', ar.action_name,
            'skill_name', s.name,
            'confidence_score', ae.confidence_score,
            'approver_role_required', ar.approver_role_required,
            'undo_available', ar.undo_available,
            'created_at', ar.created_at
          ) as row
          from public.action_requests ar
          left join public.skills s on s.id = ar.skill_id
          left join public.action_explanations ae on ae.action_request_id = ar.id
          where ar.tenant_id = v_tenant_id
            and ar.status in ('pending', 'approved', 'executing')
          union all
          select jsonb_build_object(
            'id', n.id,
            'title', n.title,
            'description', coalesce(n.body, ''),
            'category', 'notification',
            'status', case n.status
              when 'acted' then 'approved'
              when 'dismissed' then 'rejected'
              else 'pending'
            end,
            'risk_level', n.level,
            'created_at', n.created_at
          )
          from public.presence_notifications n
          where n.tenant_id = v_tenant_id
            and n.level in ('action_required', 'important', 'critical')
          union all
          select jsonb_build_object(
            'id', ip.id,
            'title', ip.pattern_title,
            'description', coalesce(ip.suggested_action, 'Recommended action awaiting approval.'),
            'category', 'recommendation',
            'status', case ip.approval_status
              when 'approved' then 'approved'
              when 'rejected' then 'rejected'
              else 'pending'
            end,
            'risk_level', coalesce(ip.potential_impact, 'medium'),
            'created_at', ip.created_at
          )
          from public.intelligence_patterns ip
          where ip.approval_status in ('pending', 'approved', 'rejected')
            and (ip.tenant_id = v_tenant_id or ip.tenant_id is null)
        ) combined
      ),
      '[]'::jsonb
    )
  );
end;
$$;

grant execute on function public._bs_read_settings(uuid) to authenticated;
