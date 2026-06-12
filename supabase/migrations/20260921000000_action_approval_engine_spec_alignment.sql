-- Action & Approval Engine — spec alignment (five tiers, ABOS governance framing)
-- Extends Human Oversight (A.40), Secure AI Actions (A.3), Trust & Action Engine (Phase 30)

create or replace function public.get_human_oversight_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_oversight_settings;
begin
  perform public._irp_require_permission('oversight.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._hoe_ensure_settings(v_org_id);
  perform public._hoe_seed_approvals(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Aipify empowers action. Humans retain responsibility.',
    'mission', 'Enable safe execution of operational actions while maintaining transparency, control, and trust.',
    'abos_principle', 'Trust is built through transparency. The goal is to help humans make better decisions faster — not remove them from decision-making.',
    'self_love_note', 'Self Love (A.76 planned) will detect approval bottlenecks and suggest governance improvements without compromising safety.',
    'action_tiers', jsonb_build_array(
      jsonb_build_object('tier', 1, 'key', 'informational', 'label', 'Informational Actions', 'approval', 'none', 'trust_action_level', 0, 'risk_level', 'low'),
      jsonb_build_object('tier', 2, 'key', 'assisted', 'label', 'Assisted Actions', 'approval', 'review_recommended', 'trust_action_level', 1, 'risk_level', 'medium'),
      jsonb_build_object('tier', 3, 'key', 'approval_based', 'label', 'Approval-Based Actions', 'approval', 'explicit_required', 'trust_action_level', 2, 'risk_level', 'medium'),
      jsonb_build_object('tier', 4, 'key', 'high_risk', 'label', 'High-Risk Actions', 'approval', 'multi_approver', 'trust_action_level', 3, 'risk_level', 'high'),
      jsonb_build_object('tier', 5, 'key', 'restricted', 'label', 'Restricted Actions', 'approval', 'never_autonomous', 'trust_action_level', 4, 'risk_level', 'critical')
    ),
    'aipify_responsibilities', jsonb_build_array(
      'Explain what action is proposed and why',
      'Describe expected outcomes and associated risks',
      'Present approval requests clearly',
      'Record all actions in audit logs'
    ),
    'audit_fields', jsonb_build_array(
      'initiator', 'approver', 'timestamp', 'changes', 'affected_systems', 'rollback_available'
    ),
    'safety_note', 'Tier 5 (Restricted) and Trust Action level 4 (Critical) actions are prohibited for AI. Overrides require business justification and audit.',
    'principles', jsonb_build_array(
      'Five-tier Action & Approval model aligned with Trust & Action Engine',
      'Advisory by default when configured — no silent automation',
      'Critical actions require human confirmation — AI prohibited',
      'Every approval, rejection, and override is auditable',
      'Integrates Governance (A.14), Secure AI Actions (A.3), and Trust Actions (Phase 30)'
    ),
    'settings', jsonb_build_object(
      'default_oversight_level', v_settings.default_oversight_level,
      'require_approvals_for', v_settings.require_approvals_for,
      'critical_ai_prohibited', v_settings.critical_ai_prohibited
    ),
    'summary', jsonb_build_object(
      'pending_approvals', coalesce((
        select count(*) from public.organization_oversight_approvals
        where organization_id = v_org_id and approval_status = 'pending'
      ), 0),
      'rejected_recommendations', coalesce((
        select count(*) from public.organization_oversight_approvals
        where organization_id = v_org_id and approval_status = 'rejected'
      ), 0),
      'approved_count', coalesce((
        select count(*) from public.organization_oversight_approvals
        where organization_id = v_org_id and approval_status = 'approved'
      ), 0),
      'override_count', coalesce((
        select count(*) from public.organization_oversight_overrides
        where organization_id = v_org_id
      ), 0),
      'high_risk_pending', coalesce((
        select count(*) from public.organization_oversight_approvals
        where organization_id = v_org_id and approval_status = 'pending'
          and risk_level in ('high', 'critical')
      ), 0),
      'ai_action_pending', coalesce((
        select count(*) from public.ai_action_requests
        where organization_id = v_org_id and status = 'pending'
      ), 0)
    ),
    'accountability_metrics', jsonb_build_object(
      'approval_rate', coalesce((
        select round(
          100.0 * count(*) filter (where approval_status = 'approved')
          / nullif(count(*) filter (where approval_status in ('approved', 'rejected')), 0),
          1
        )
        from public.organization_oversight_approvals where organization_id = v_org_id
      ), 0),
      'override_rate', coalesce((
        select round(
          100.0 * (select count(*) from public.organization_oversight_overrides where organization_id = v_org_id)
          / nullif((select count(*) from public.organization_oversight_approvals where organization_id = v_org_id), 0),
          1
        )
      ), 0),
      'avg_confidence', coalesce((
        select round(avg(confidence)::numeric, 2)
        from public.organization_oversight_approvals
        where organization_id = v_org_id and confidence is not null
      ), 0),
      'critical_blocked', coalesce((
        select count(*) from public.organization_oversight_approvals
        where organization_id = v_org_id and risk_level = 'critical' and approval_status = 'rejected'
      ), 0)
    ),
    'pending_approvals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id,
        'action_type', a.action_type,
        'risk_level', a.risk_level,
        'approval_status', a.approval_status,
        'explanation', a.explanation,
        'confidence', a.confidence,
        'ai_initiated', a.ai_initiated,
        'created_at', a.created_at
      ) order by case a.risk_level when 'critical' then 0 when 'high' then 1 when 'medium' then 2 else 3 end, a.created_at desc)
      from public.organization_oversight_approvals a
      where a.organization_id = v_org_id and a.approval_status = 'pending'
      limit 20
    ), '[]'::jsonb),
    'rejected_recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id,
        'action_type', a.action_type,
        'risk_level', a.risk_level,
        'approval_reason', a.approval_reason,
        'explanation', a.explanation,
        'confidence', a.confidence,
        'resolved_at', a.resolved_at
      ) order by a.resolved_at desc nulls last)
      from public.organization_oversight_approvals a
      where a.organization_id = v_org_id and a.approval_status = 'rejected'
      limit 10
    ), '[]'::jsonb),
    'high_risk_actions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id,
        'action_type', a.action_type,
        'risk_level', a.risk_level,
        'approval_status', a.approval_status,
        'explanation', a.explanation,
        'ai_initiated', a.ai_initiated,
        'created_at', a.created_at
      ) order by a.created_at desc)
      from public.organization_oversight_approvals a
      where a.organization_id = v_org_id and a.risk_level in ('high', 'critical')
      limit 15
    ), '[]'::jsonb),
    'override_trends', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id,
        'approval_id', o.approval_id,
        'override_reason', o.override_reason,
        'business_justification', o.business_justification,
        'review_required', o.review_required,
        'review_status', o.review_status,
        'created_at', o.created_at
      ) order by o.created_at desc)
      from public.organization_oversight_overrides o
      where o.organization_id = v_org_id
      limit 10
    ), '[]'::jsonb),
    'risk_distribution', coalesce((
      select jsonb_agg(jsonb_build_object('risk_level', r.risk_level, 'count', r.cnt))
      from (
        select risk_level, count(*) as cnt
        from public.organization_oversight_approvals
        where organization_id = v_org_id
        group by risk_level
      ) r
    ), '[]'::jsonb),
    'integration_links', jsonb_build_object(
      'secure_ai_actions', '/app/secure-ai-actions',
      'governance', '/app/governance-policy-engine',
      'approvals', '/app/approvals',
      'enterprise_readiness', '/app/enterprise-readiness-engine'
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select
  'action-approval-engine',
  'Action & Approval Engine',
  'Five-tier action governance — transparency, approvals, audit, human accountability.',
  'authenticated',
  102
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'action-approval-engine' and tenant_id is null
);
