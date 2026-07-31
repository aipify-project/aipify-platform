-- AIPIFY.APPROVAL.DETAIL.PRODUCTION.CRASH.ROOT.CAUSE.V2
-- Read-only: attach Website Kompis binding metadata to Approval Center rows.
-- Apply side effects: 0 records created, no approval decisions, no CMS writes.

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
      'principle', 'Aipify Group validates action workflows internally; external pilots validate customer workflows.',
      'aipify_group', jsonb_build_object('slug', 'aipify-group')
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
      jsonb_build_object('label', 'Action Center (AEF)', 'route', '/app/action-center'),
      jsonb_build_object('label', 'Kompis', 'route', '/app/kompis')
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
            'title', case
              when ar.action_name = 'website_publish_approved_draft' then 'Kompis website publish'
              when ar.action_name = 'website_publish_rollback' then 'Kompis website rollback'
              else coalesce(s.name, 'Aipify') || ': ' || ar.action_name
            end,
            'description', coalesce(ae.explanation, ar.description),
            'category', 'action',
            'status', ar.status,
            'risk_level', ar.risk_level::text,
            'action_name', ar.action_name,
            'skill_name', s.name,
            'confidence_score', ae.confidence_score,
            'approver_role_required', ar.approver_role_required,
            'undo_available', ar.undo_available,
            'created_at', ar.created_at,
            'expires_at', b.expires_at,
            'source', case
              when ar.resource_type = 'kompis_operator_run' then 'kompis'
              else 'trust_action'
            end,
            'resource_type', ar.resource_type,
            'resource_id', ar.resource_id,
            'return_to_kompis', case
              when ar.resource_type = 'kompis_operator_run' then true
              else false
            end,
            'website_id', b.website_id,
            'website_path', b.path,
            'website_locale', b.locale,
            'candidate_id', b.candidate_id,
            'expected_current_version_id', b.expected_current_version_id,
            'current_version_id', b.expected_current_version_id,
            'action_checksum', b.action_checksum,
            'tool_key', b.tool_key,
            'run_id', b.run_id,
            'step_id', b.step_id,
            'audit_reference', left(ar.id::text, 8),
            'binding_complete', case
              when ar.action_name in ('website_publish_approved_draft', 'website_publish_rollback') then (
                b.action_request_id is not null
                and nullif(trim(coalesce(b.path, '')), '') is not null
                and nullif(trim(coalesce(b.locale, '')), '') is not null
                and b.candidate_id is not null
                and b.expected_current_version_id is not null
                and nullif(trim(coalesce(b.action_checksum, '')), '') is not null
                and b.used_at is null
                and b.cancelled_at is null
              )
              else true
            end
          ) as row
          from public.action_requests ar
          left join public.skills s on s.id = ar.skill_id
          left join public.action_explanations ae on ae.action_request_id = ar.id
          left join public.kompis_operator_core_approval_bindings b
            on b.action_request_id = ar.id
           and b.organization_id = ar.tenant_id
          where ar.tenant_id = v_tenant_id
            and ar.status in ('pending', 'approved', 'executing', 'rejected', 'completed', 'cancelled', 'expired')
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
            'created_at', n.created_at,
            'source', 'notification',
            'binding_complete', true
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
            'created_at', ip.created_at,
            'source', 'recommendation',
            'binding_complete', true
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

revoke all on function public.get_customer_approvals_center() from public, anon;
grant execute on function public.get_customer_approvals_center() to authenticated;

comment on function public.get_customer_approvals_center() is
  'Customer Approval Center read model with optional Website Kompis binding metadata for detail presentation.';
