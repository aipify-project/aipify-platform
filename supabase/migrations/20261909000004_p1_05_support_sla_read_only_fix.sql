-- P1.05 fix — ASO center read must not INSERT inside STABLE transaction.

create or replace function public.get_customer_support_operations_center()
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.aso_settings;
  v_readiness jsonb;
  v_open integer;
  v_auto_month integer;
  v_escalated_month integer;
  v_total_month integer;
  v_sla_ready boolean;
  v_sla_at_risk integer := 0;
  v_sla_breached integer := 0;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select * into v_settings
  from public.aso_settings
  where tenant_id = v_tenant_id
  limit 1;

  if v_settings.id is null then
    v_settings.tenant_id := v_tenant_id;
    v_settings.autonomy_level := 1;
    v_settings.proactive_support_enabled := true;
    v_settings.knowledge_gap_detection_enabled := true;
    v_settings.self_healing_enabled := true;
    v_settings.human_collaboration_mode := true;
    v_settings.channels_enabled := '{"email": true, "chat": true, "ticket": true, "mobile": false}'::jsonb;
    v_settings.confidence_auto_reply_threshold := 90;
    v_settings.confidence_draft_threshold := 70;
    v_settings.privacy_settings := '{"store_case_content": true, "share_performance_aggregates": false}'::jsonb;
    v_settings.sla_policy_enabled := false;
  end if;

  v_readiness := public.calculate_automation_readiness_score(v_tenant_id);
  v_sla_ready := public._aso_sla_policy_ready(v_settings);

  select count(*) into v_open
  from public.support_cases
  where tenant_id = v_tenant_id and status not in ('resolved', 'closed', 'auto_replied');

  if v_sla_ready then
    select
      count(*) filter (
        where public._aso_compute_case_sla_status(now(), sc, v_settings) in ('warning', 'at_risk')
      ),
      count(*) filter (
        where public._aso_compute_case_sla_status(now(), sc, v_settings) = 'breached'
      )
    into v_sla_at_risk, v_sla_breached
    from public.support_cases sc
    where sc.tenant_id = v_tenant_id
      and sc.status not in ('resolved', 'closed', 'auto_replied');
  end if;

  select count(*) into v_total_month
  from public.support_cases
  where tenant_id = v_tenant_id and created_at >= date_trunc('month', now());

  select count(*) into v_auto_month
  from public.support_cases
  where tenant_id = v_tenant_id and status = 'auto_replied'
    and created_at >= date_trunc('month', now());

  select count(*) into v_escalated_month
  from public.support_cases
  where tenant_id = v_tenant_id and status = 'escalated'
    and created_at >= date_trunc('month', now());

  return jsonb_build_object(
    'has_customer', true,
    'settings', jsonb_build_object(
      'autonomy_level', v_settings.autonomy_level,
      'proactive_support_enabled', v_settings.proactive_support_enabled,
      'knowledge_gap_detection_enabled', v_settings.knowledge_gap_detection_enabled,
      'self_healing_enabled', v_settings.self_healing_enabled,
      'human_collaboration_mode', v_settings.human_collaboration_mode,
      'channels_enabled', v_settings.channels_enabled,
      'confidence_auto_reply_threshold', v_settings.confidence_auto_reply_threshold,
      'confidence_draft_threshold', v_settings.confidence_draft_threshold,
      'privacy_settings', v_settings.privacy_settings,
      'sla_policy_enabled', v_settings.sla_policy_enabled,
      'sla_first_response_minutes', v_settings.sla_first_response_minutes,
      'sla_resolution_minutes', v_settings.sla_resolution_minutes,
      'sla_warning_minutes_before_due', v_settings.sla_warning_minutes_before_due,
      'sla_at_risk_minutes_before_due', v_settings.sla_at_risk_minutes_before_due
    ),
    'sla', jsonb_build_object(
      'source_exact', v_sla_ready,
      'policy_configured', v_sla_ready,
      'sla_at_risk', case when v_sla_ready then v_sla_at_risk else 0 end,
      'breached', case when v_sla_ready then v_sla_breached else 0 end,
      'source_reference', 'autonomous_support_operations:get_customer_support_operations_center'
    ),
    'autonomy_levels', jsonb_build_array(
      jsonb_build_object('level', 0, 'name', 'Human Only', 'description', 'Drafts and suggestions only'),
      jsonb_build_object('level', 1, 'name', 'Assisted Support', 'description', 'AI assistance, human approval'),
      jsonb_build_object('level', 2, 'name', 'Supervised Automation', 'description', 'Low-risk auto-replies with oversight'),
      jsonb_build_object('level', 3, 'name', 'Trusted Operations', 'description', 'Approved categories managed autonomously')
    ),
    'readiness', v_readiness,
    'categories', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', c.id, 'name', c.name, 'risk_level', c.risk_level,
        'automation_level', c.automation_level, 'approval_required', c.approval_required
      ) order by c.name) from public.support_categories c where c.tenant_id = v_tenant_id and c.active),
      '[]'::jsonb
    ),
    'open_cases', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', sc.id, 'subject', sc.subject, 'category', sc.category,
        'risk_level', sc.risk_level, 'confidence_score', sc.confidence_score,
        'status', sc.status, 'triage_action', sc.triage_action, 'created_at', sc.created_at,
        'first_response_due_at', sc.first_response_due_at,
        'resolution_due_at', sc.resolution_due_at,
        'first_responded_at', sc.first_responded_at,
        'resolved_at', sc.resolved_at,
        'sla_status', public._aso_compute_case_sla_status(now(), sc, v_settings)
      ) order by sc.created_at desc)
      from public.support_cases sc
      where sc.tenant_id = v_tenant_id and sc.status not in ('resolved', 'closed')
      limit 20),
      '[]'::jsonb
    ),
    'performance', jsonb_build_object(
      'open_cases', v_open,
      'cases_this_month', v_total_month,
      'auto_resolved_this_month', v_auto_month,
      'escalated_this_month', v_escalated_month,
      'automation_rate', case when v_total_month > 0
        then round((v_auto_month::numeric / v_total_month) * 100) else 0 end,
      'sla_at_risk', case when v_sla_ready then v_sla_at_risk else null end,
      'sla_breached', case when v_sla_ready then v_sla_breached else null end,
      'insights', coalesce(
        (select jsonb_agg(insight) from (
          select format(
            'Aipify resolved %s%% of cases autonomously this month.',
            case when v_total_month > 0 then round((v_auto_month::numeric / v_total_month) * 100) else 0 end
          ) as insight where v_total_month > 0
          union all
          select format('Escalations this month: %s', v_escalated_month)
          union all
          select format('Open cases requiring attention: %s', v_open) where v_open > 0
        ) sub),
        '[]'::jsonb
      )
    ),
    'knowledge_gaps', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', g.id, 'category', g.category, 'occurrence_count', g.occurrence_count,
        'sample_question', g.sample_question, 'suggestion', g.suggestion, 'status', g.status
      ) order by g.occurrence_count desc)
      from public.support_knowledge_gaps g
      where g.tenant_id = v_tenant_id and g.status = 'open' limit 10),
      '[]'::jsonb
    ),
    'proactive_alerts', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', a.id, 'alert_type', a.alert_type, 'title', a.title, 'message', a.message, 'status', a.status
      ) order by a.created_at desc)
      from public.support_proactive_alerts a
      where a.tenant_id = v_tenant_id and a.status = 'pending' limit 5),
      '[]'::jsonb
    ),
    'approval_queue', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', sc.id, 'subject', sc.subject, 'category', sc.category,
        'confidence_score', sc.confidence_score, 'draft_id', sc.draft_id
      ) order by sc.created_at desc)
      from public.support_cases sc
      where sc.tenant_id = v_tenant_id and sc.status = 'pending_approval' limit 10),
      '[]'::jsonb
    ),
    'high_risk_cases', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', sc.id, 'subject', sc.subject, 'risk_level', sc.risk_level, 'status', sc.status,
        'created_at', sc.created_at,
        'first_response_due_at', sc.first_response_due_at,
        'resolution_due_at', sc.resolution_due_at,
        'first_responded_at', sc.first_responded_at,
        'resolved_at', sc.resolved_at,
        'sla_status', public._aso_compute_case_sla_status(now(), sc, v_settings)
      ) order by sc.created_at desc)
      from public.support_cases sc
      where sc.tenant_id = v_tenant_id and sc.risk_level in ('high', 'critical')
        and sc.status not in ('resolved', 'closed') limit 10),
      '[]'::jsonb
    ),
    'audit_log', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', al.id, 'case_id', al.case_id, 'event_type', al.event_type,
        'performed_by', al.performed_by, 'created_at', al.created_at
      ) order by al.created_at desc)
      from public.support_audit_logs al where al.tenant_id = v_tenant_id limit 20),
      '[]'::jsonb
    ),
    'ethical_principles', jsonb_build_array(
      'Never hide uncertainty',
      'Escalate sensitive situations to humans',
      'Respect business policies from Business DNA',
      'Full audit transparency'
    ),
    'privacy_note', 'Support case data belongs to your business. Platform admins see aggregates only.',
    'integrations', jsonb_build_object(
      'business_dna', 'Templates, knowledge, tone, escalation rules',
      'trust_actions', 'Send and publish permissions',
      'learning_engine', 'Approved interaction patterns only'
    )
  );
end;
$$;
