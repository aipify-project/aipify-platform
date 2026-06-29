-- P1.13BV — Authoritative support queue summary on Support AI dashboard
-- Adds queue_summary aggregates to get_support_ai_engine_dashboard (no new RPC/tables).

create or replace function public.get_support_ai_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_settings public.support_ai_settings;
begin
  perform public._irp_require_permission('support.view');
  v_org_id := public._mta_require_organization();
  perform public._sai_seed_demo_content(v_org_id);
  v_settings := public._sai_ensure_settings(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 11 — Support Engine Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE11_SUPPORT_ENGINE_FOUNDATION.md',
      'engine_phase', 'A.7 Support AI Engine',
      'route', '/app/support-ai-engine',
      'mapping_note', 'ABOS Blueprint Phase 11 maps to Support AI Engine A.7 — extend, do not duplicate. Distinct from ASO at /app/settings/support-operations.'
    ),
    'mission', 'Faster support and higher quality through intelligent assistance, Knowledge Center utilization, and responsible escalation.',
    'philosophy', 'People want help solved — focus on quick, accurate, respectful resolution. AI assists; humans decide on sensitive topics.',
    'abos_principle', 'Support should feel human — technology accelerates routine work while keeping people in control of sensitive decisions.',
    'vision', 'Organizations deliver support that is fast, consistent, and transparent — with knowledge that improves every day.',
    'support_ai_engine_note', 'Support Engine Foundation (ABOS Phase 11) — extends Support AI Engine (Phase A.7).',
    'distinction_note', 'Distinct from Autonomous Support Operations (ASO) at /app/settings/support-operations — ASO governs autonomy levels and triage policies; Support AI Engine A.7 handles customer-facing cases, drafts, and KC integration.',
    'support_objectives', public._sai_support_objectives(),
    'support_tiers', public._sai_support_tiers(),
    'case_management_capabilities', public._sai_case_management_capabilities(),
    'kc_connection', public._sai_kc_connection(),
    'self_love_connection', public._sai_self_love_connection(),
    'self_love_note', 'Self Love (A.76) reduces repetitive support work, balances workload, and celebrates resolutions — principle only; Support AI Engine stores metadata, not wellbeing content.',
    'trust_connection', public._sai_trust_connection(),
    'dogfooding', public._sai_blueprint_dogfooding(),
    'success_criteria', public._sai_blueprint_success_criteria(v_org_id),
    'vision_phrases', public._sai_vision_phrases(),
    'integration_links', public._sai_integration_links(),
    'safety_note', 'Only approved low-risk responses may be automated. Medium and high-risk topics always require human review.',
    'principles', jsonb_build_array(
      'Tenant-aware operation',
      'Knowledge-driven responses',
      'Human oversight for medium/high-risk actions',
      'Audit logging for important activities',
      'Continuous improvement through feedback'
    ),
    'settings', jsonb_build_object(
      'default_response_mode', v_settings.default_response_mode,
      'auto_faq_enabled', v_settings.auto_faq_enabled,
      'escalation_confidence_threshold', v_settings.escalation_confidence_threshold,
      'channels_enabled', v_settings.channels_enabled
    ),
    'queue_summary', (
      select jsonb_build_object(
        'total_open', count(*)::int,
        'unassigned', count(*) filter (where c.assigned_to is null)::int,
        'preview_limit', 15
      )
      from public.organization_support_cases c
      where c.organization_id = v_org_id and c.status not in ('resolved', 'closed')
    ),
    'open_cases', coalesce((
      select jsonb_agg(preview.row_json order by preview.priority_order, preview.created_at desc)
      from (
        select
          jsonb_build_object(
            'id', c.id, 'case_number', c.case_number, 'subject', c.subject,
            'customer_identifier', c.customer_identifier, 'channel', c.channel,
            'status', c.status, 'priority', c.priority, 'ai_summary', c.ai_summary,
            'created_at', c.created_at, 'escalated_at', c.escalated_at
          ) as row_json,
          case c.priority when 'urgent' then 1 when 'high' then 2 when 'medium' then 3 else 4 end as priority_order,
          c.created_at
        from public.organization_support_cases c
        where c.organization_id = v_org_id and c.status not in ('resolved', 'closed')
        order by
          case c.priority when 'urgent' then 1 when 'high' then 2 when 'medium' then 3 else 4 end,
          c.created_at desc
        limit 15
      ) preview
    ), '[]'::jsonb),
    'pending_approvals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'case_id', r.case_id, 'content', left(r.content, 200),
        'response_mode', r.response_mode, 'confidence_score', r.confidence_score,
        'created_at', r.created_at
      ) order by r.created_at desc)
      from public.support_ai_responses r
      where r.organization_id = v_org_id and r.status = 'pending' limit 10
    ), '[]'::jsonb),
    'escalated_cases', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'case_number', c.case_number, 'subject', c.subject,
        'escalation_reason', c.escalation_reason, 'escalated_at', c.escalated_at
      ) order by c.escalated_at desc nulls last)
      from public.organization_support_cases c
      where c.organization_id = v_org_id and c.escalated_at is not null limit 8
    ), '[]'::jsonb),
    'unresolved_issues', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'case_number', c.case_number, 'subject', c.subject, 'status', c.status, 'priority', c.priority
      ) order by c.updated_at desc)
      from public.organization_support_cases c
      where c.organization_id = v_org_id and c.status in ('open', 'waiting_for_internal', 'waiting_for_customer') limit 10
    ), '[]'::jsonb),
    'ai_statistics', jsonb_build_object(
      'total_responses', (select count(*) from public.support_ai_responses where organization_id = v_org_id),
      'automatic_sent', (select count(*) from public.support_ai_responses where organization_id = v_org_id and response_mode = 'automatic' and status = 'sent'),
      'drafts_pending', (select count(*) from public.support_ai_responses where organization_id = v_org_id and status = 'pending'),
      'escalated', (select count(*) from public.support_ai_responses where organization_id = v_org_id and status = 'escalated')
    ),
    'metrics', public.get_support_ai_metrics(),
    'knowledge_gaps', public.detect_support_knowledge_gaps(),
    'response_modes', jsonb_build_array('automatic', 'draft', 'manual'),
    'channels', jsonb_build_array('support_widget', 'admin_inbox', 'email_support')
  );
end; $$;
