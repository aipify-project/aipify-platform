-- Implementation Blueprint Phase 40 — Autonomous Workflow Orchestration Engine
-- Extends Workflow Orchestration Engine (Phase A.42). No new tables — metadata scaffold only.
-- Distinct from AEF Phase 44 (/app/action-center), Action Hub Phase 64 (/app/actions), Trust & Action Phase 30 (/app/approvals), Platform orchestration Phase 68.

create or replace function public._awobp_mission()
returns text language sql immutable as $$
  select 'Turn intentions into action — automation amplifies humans, does not eliminate judgment.';
$$;

create or replace function public._awobp_philosophy()
returns text language sql immutable as $$
  select 'Organizations remain in control — approved multi-step workflows execute with explainability and human checkpoints, never silent critical automation.';
$$;

create or replace function public._awobp_abos_principle()
returns text language sql immutable as $$
  select 'Approved workflow orchestration inside the Aipify Business Operating System — humans design processes; Aipify prepares, explains, and executes within trust boundaries.';
$$;

create or replace function public._awobp_workflow_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'recommendations', 'label', 'Recommendations', 'description', 'Explainable workflow suggestions from operational signals — metadata only, humans approve instantiation'),
    jsonb_build_object('key', 'multi_step_automations', 'label', 'Multi-step automations', 'description', 'Human-defined sequences with checkpoints — support, knowledge, sales, finance, and executive categories'),
    jsonb_build_object('key', 'cross_platform_actions', 'label', 'Cross-platform actions', 'description', 'Coordinated steps across Support AI, KC, tasks, documents, and integrations — via Integration Engine A.8'),
    jsonb_build_object('key', 'approval_checkpoints', 'label', 'Approval checkpoints', 'description', 'Role-based gates via Human Oversight A.40 — aligned with Trust & Action risk levels where possible'),
    jsonb_build_object('key', 'consistency', 'label', 'Consistency', 'description', 'Repeatable processes reduce ad-hoc variance — templates and audit trails preserve organizational memory'),
    jsonb_build_object('key', 'process_documentation', 'label', 'Process documentation', 'description', 'Workflow definitions document how work flows — connected to Knowledge Center A.5 and Document Output A.59')
  );
$$;

create or replace function public._awobp_workflow_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'category', 'support',
      'label', 'Support workflows',
      'examples', jsonb_build_array(
        'Case triage and assignment with escalation paths',
        'Stakeholder notification on high-priority cases',
        'Support summary generation for handoffs',
        'Knowledge gap detection after case resolution'
      ),
      'route', '/app/support'
    ),
    jsonb_build_object(
      'category', 'knowledge',
      'label', 'Knowledge workflows',
      'examples', jsonb_build_array(
        'FAQ update suggestions after repeated support patterns',
        'Outdated content review reminders',
        'Documentation improvement proposals for KC A.5',
        'Knowledge approval routing via Business DNA'
      ),
      'route', '/app/knowledge-center'
    ),
    jsonb_build_object(
      'category', 'sales',
      'label', 'Sales workflows',
      'examples', jsonb_build_array(
        'Follow-up sequences after qualified interest',
        'Welcome sequences for new customers',
        'Onboarding task creation for sales handoff',
        'Sales Expert notification on expansion signals'
      ),
      'route', '/app/sales-expert-engine'
    ),
    jsonb_build_object(
      'category', 'financial',
      'label', 'Financial workflows',
      'examples', jsonb_build_array(
        'Subscription event awareness and renewal reminders',
        'Commercial health decline preparation cues',
        'Invoice and renewal follow-up task creation',
        'Executive revenue summary scheduling'
      ),
      'route', '/app/commercial'
    ),
    jsonb_build_object(
      'category', 'executive',
      'label', 'Executive workflows',
      'examples', jsonb_build_array(
        'Weekly operational summaries for leadership',
        'Strategic concern escalation with context',
        'Opportunity surfacing from cross-module signals',
        'Document Output delivery for executive briefings'
      ),
      'route', '/app/executive-insights-engine'
    )
  );
$$;

create or replace function public._awobp_approval_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust-aligned approval gates — low risk may auto-execute; medium requires review; high and critical require explicit human approval.',
    'levels', jsonb_build_array(
      jsonb_build_object(
        'key', 'low_risk',
        'label', 'Low risk',
        'trust_action_level', 0,
        'description', 'Notifications, reminders, internal summaries — may auto-execute when workflow trust level permits',
        'examples', jsonb_build_array('send_notification', 'create_task', 'generate_draft')
      ),
      jsonb_build_object(
        'key', 'medium_risk',
        'label', 'Medium risk',
        'trust_action_level', 2,
        'description', 'Drafts, customer communications, workflow initiation — review recommended via Human Oversight A.40',
        'examples', jsonb_build_array('customer_comm_draft', 'workflow_initiation', 'cross_module_action')
      ),
      jsonb_build_object(
        'key', 'high_risk',
        'label', 'High risk',
        'trust_action_level', 3,
        'description', 'Financial actions, permission changes, irreversible operations — explicit approval required',
        'examples', jsonb_build_array('financial_action', 'permission_change', 'irreversible_update')
      ),
      jsonb_build_object(
        'key', 'critical',
        'label', 'Critical (prohibited for AI)',
        'trust_action_level', 4,
        'description', 'Critical actions prohibited for autonomous execution — human-only via Trust & Action Engine',
        'examples', jsonb_build_array('refund', 'admin_permission_change', 'data_deletion')
      )
    ),
    'trust_action_route', '/app/approvals',
    'human_oversight_route', '/app/human-oversight-engine',
    'boundary', 'Workflow trust levels (advisory, standard, elevated, delegated) map to approval requirements — never silent critical execution.'
  );
$$;

create or replace function public._awobp_explainability_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Every workflow recommendation and execution step is explainable — why suggested, which systems involved, approvals required, and expected outcomes.',
    'required_elements', jsonb_build_array(
      jsonb_build_object('key', 'why_recommended', 'label', 'Why recommended', 'description', 'Operational signals and template match rationale — metadata only'),
      jsonb_build_object('key', 'systems_involved', 'label', 'Systems involved', 'description', 'Modules, integrations, and engines touched by each step'),
      jsonb_build_object('key', 'approvals_required', 'label', 'Approvals required', 'description', 'Human Oversight gates and Trust & Action levels before execution'),
      jsonb_build_object('key', 'expected_outcomes', 'label', 'Expected outcomes', 'description', 'Documented results, audit events, and follow-up tasks')
    ),
    'audit_note', 'Workflow create, pause, execute, and approve events logged — metadata only, no PII in RPC payloads.'
  );
$$;

create or replace function public._awobp_marketplace_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Industry workflows, best-practice templates, and partner workflows — activate through Business Packs and Marketplace with human review.',
    'sources', jsonb_build_array(
      jsonb_build_object('key', 'industry_workflows', 'label', 'Industry workflows', 'description', 'Vertical templates from Industry Intelligence A.44 and Business Packs A.43'),
      jsonb_build_object('key', 'best_practice_templates', 'label', 'Best-practice templates', 'description', 'Curated organization workflow templates — explicit human instantiation required'),
      jsonb_build_object('key', 'partner_workflows', 'label', 'Partner workflows', 'description', 'Certified partner offerings from Marketplace A.45 — approval before activation')
    ),
    'business_packs_route', '/app/business-packs-foundation-engine',
    'marketplace_route', '/app/marketplace-partner-ecosystem-foundation-engine',
    'boundary', 'Templates are scaffolds — AI never auto-creates workflows. Humans select, review, and activate.'
  );
$$;

create or replace function public._awobp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Reduce repetitive tasks, create space for meaningful work, and reduce admin fatigue — automation supports sustainable pace.',
    'connections', jsonb_build_array(
      'Automate routine notifications and reminders — humans focus on judgment',
      'Multi-step handoffs reduce context switching and spreadsheet chasing',
      'Approval checkpoints prevent rushed irreversible decisions',
      'Process documentation preserves institutional knowledge without extra admin burden'
    ),
    'self_love_route', '/app/self-love-engine',
    'boundary', 'Self Love A.76 owns reflection workflows — Workflow Orchestration stores process metadata, not wellbeing content.'
  );
$$;

create or replace function public._awobp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates workflow orchestration internally; Unonight exercises sales, support, knowledge, and executive workflows as first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — support case workflows, knowledge updates, executive summaries, renewal preparation',
      'focus', jsonb_build_array(
        'Support case escalation and stakeholder notification templates',
        'KC documentation suggestion workflows after internal support patterns',
        'Executive weekly summary delivery via Document Output A.59',
        'Human Oversight approval gate calibration for medium-risk steps'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce support, sales follow-up, and knowledge workflows',
      'focus', jsonb_build_array(
        'Support triage and escalation workflows for commerce operations',
        'Sales welcome sequences and onboarding task handoffs',
        'FAQ update suggestions from support pattern metadata',
        'Operations Center visibility for workflow failures and bottlenecks'
      )
    )
  );
$$;

create or replace function public._awobp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Turn intentions into action — automation amplifies humans, does not eliminate judgment.',
    'Organizations design processes; Aipify executes within oversight and trust boundaries.',
    'Explainability before execution — why, which systems, what approvals, what outcomes.',
    'Low-risk steps may flow; high-risk steps always wait for humans.',
    'Repeatable workflows reduce admin fatigue — space for meaningful work.'
  );
$$;

create or replace function public._awobp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'human_oversight', 'label', 'Human Oversight A.40', 'route', '/app/human-oversight-engine', 'note', 'Role-based approval checkpoints for workflow steps'),
    jsonb_build_object('key', 'operations_center', 'label', 'Operations Center A.32', 'route', '/app/operations-center-foundation-engine', 'note', 'Failure visibility, escalations, and operational event routing'),
    jsonb_build_object('key', 'integration_engine', 'label', 'Integration Engine A.8', 'route', '/app/integration-engine', 'note', 'Cross-platform connector actions within workflow steps'),
    jsonb_build_object('key', 'business_packs', 'label', 'Business Packs A.43', 'route', '/app/business-packs-foundation-engine', 'note', 'Industry workflow packs and activation scaffolds'),
    jsonb_build_object('key', 'marketplace', 'label', 'Marketplace & Partner Ecosystem A.45', 'route', '/app/marketplace-partner-ecosystem-foundation-engine', 'note', 'Partner workflow templates and certification'),
    jsonb_build_object('key', 'document_output', 'label', 'Document & Output A.59', 'route', '/app/document-output-engine', 'note', 'Scheduled summaries and operational document delivery'),
    jsonb_build_object('key', 'unified_tasks', 'label', 'Unified Tasks A.62', 'route', '/app/unified-task-follow-up-engine', 'note', 'Task creation and follow-up steps in workflows'),
    jsonb_build_object('key', 'support_ai', 'label', 'Support AI A.7', 'route', '/app/support', 'note', 'Support case triage, escalation, and notification steps'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center A.5', 'route', '/app/knowledge-center', 'note', 'FAQ updates and documentation suggestion workflows'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Reduce admin fatigue — principle only'),
    jsonb_build_object('key', 'trust_actions', 'label', 'Trust & Action Engine Phase 30', 'route', '/app/approvals', 'note', 'Risk levels 0–4 — sensitive action approvals'),
    jsonb_build_object('key', 'action_center', 'label', 'Autonomous Execution Framework Phase 44', 'route', '/app/action-center', 'note', 'Controlled business action execution — distinct from workflow orchestration'),
    jsonb_build_object('key', 'action_hub', 'label', 'Action Hub Phase 64', 'route', '/app/actions', 'note', 'Operational action queue — distinct from multi-step workflows'),
    jsonb_build_object('key', 'enterprise_readiness', 'label', 'Enterprise Readiness A.41', 'route', '/app/enterprise-readiness-engine', 'note', 'Delegated trust and enterprise approval chains')
  );
$$;

create or replace function public._awobp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 40 extends Workflow Orchestration Engine Phase A.42 at /app/workflow-orchestration-engine — approved multi-step workflow orchestration with explainability and human checkpoints. Distinct from Autonomous Execution Framework Phase 44 (/app/action-center) for controlled business action execution; Action Hub Phase 64 (/app/actions) for operational action queues; Trust & Action Engine Phase 30 (/app/approvals) for risk levels 0–4; and Platform orchestration Phase 68 for platform-level rollouts, not tenant workflows. Cross-link engines; do not duplicate action execution or approval tables.';
$$;

create or replace function public._awobp_orchestration_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_active int := 0;
  v_paused int := 0;
  v_draft int := 0;
  v_total_executions int := 0;
  v_failed int := 0;
  v_awaiting int := 0;
  v_templates int := 0;
  v_bottlenecks int := 0;
begin
  select count(*) into v_active
  from public.organization_workflows
  where organization_id = p_organization_id and status = 'active';

  select count(*) into v_paused
  from public.organization_workflows
  where organization_id = p_organization_id and status = 'paused';

  select count(*) into v_draft
  from public.organization_workflows
  where organization_id = p_organization_id and status = 'draft';

  select count(*) into v_total_executions
  from public.workflow_executions
  where organization_id = p_organization_id;

  select count(*) into v_failed
  from public.workflow_executions
  where organization_id = p_organization_id and outcome = 'failed';

  select count(*) into v_awaiting
  from public.workflow_executions
  where organization_id = p_organization_id and outcome = 'awaiting_approval';

  select count(*) into v_templates
  from public.workflow_templates;

  select count(*) into v_bottlenecks
  from public.organization_oversight_approvals
  where organization_id = p_organization_id
    and approval_status = 'pending'
    and action_type like 'workflow_step_%';

  return jsonb_build_object(
    'active_workflows', v_active,
    'paused_workflows', v_paused,
    'draft_workflows', v_draft,
    'total_executions', v_total_executions,
    'failed_executions', v_failed,
    'awaiting_approval', v_awaiting,
    'approval_bottlenecks', v_bottlenecks,
    'template_count', v_templates,
    'orchestration_health', case
      when v_failed > 0 and v_active = 0 then 'needs_attention'
      when v_awaiting > 3 or v_bottlenecks > 3 then 'approval_backlog'
      when v_active >= 1 then 'operational'
      else 'scaffold'
    end,
    'privacy_note', 'Aggregate counts from tenant-scoped workflow tables only — no PII or raw operational content.'
  );
end; $$;

create or replace function public._awobp_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_summary jsonb;
  v_active int := 0;
  v_templates int := 0;
begin
  v_summary := public._awobp_orchestration_summary(p_organization_id);
  v_active := coalesce((v_summary->>'active_workflows')::int, 0);
  v_templates := coalesce((v_summary->>'template_count')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'workflow_objectives',
      'label', 'Workflow objectives documented — recommendations through process documentation',
      'met', jsonb_array_length(public._awobp_workflow_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'workflow_examples',
      'label', 'Workflow examples by category — support, knowledge, sales, financial, executive',
      'met', jsonb_array_length(public._awobp_workflow_examples()) >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'approval_principles',
      'label', 'Approval principles aligned with Trust & Action risk levels',
      'met', jsonb_array_length((public._awobp_approval_principles()->'levels')) >= 4,
      'note', 'Route /app/approvals for sensitive actions.'
    ),
    jsonb_build_object(
      'key', 'explainability_principles',
      'label', 'Explainability principles — why, systems, approvals, outcomes',
      'met', jsonb_array_length((public._awobp_explainability_principles()->'required_elements')) >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'marketplace_connection',
      'label', 'Workflow marketplace connection — packs, templates, partner workflows',
      'met', jsonb_array_length((public._awobp_marketplace_connection()->'sources')) >= 3,
      'note', 'Cross-link Business Packs A.43 and Marketplace A.45.'
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — reduce repetitive tasks and admin fatigue',
      'met', jsonb_array_length((public._awobp_self_love_connection()->'connections')) >= 4,
      'note', 'Principle only — route /app/self-love-engine.'
    ),
    jsonb_build_object(
      'key', 'templates_available',
      'label', 'Workflow templates seeded for human instantiation',
      'met', v_templates >= 1,
      'note', case when v_templates = 0 then 'Seed workflow templates via A.42 migration.' else null end
    ),
    jsonb_build_object(
      'key', 'active_workflow',
      'label', 'At least one active organization workflow',
      'met', v_active >= 1,
      'note', case when v_active = 0 then 'Create and activate a workflow from a template.' else null end
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links to A.40, A.32, A.8, A.43, A.45, A.59, A.62, A.7, A.5, A.76, Phase 30, 44, 64',
      'met', jsonb_array_length(public._awobp_integration_links()) >= 12,
      'note', null
    ),
    jsonb_build_object(
      'key', 'distinction_documented',
      'label', 'Distinction from AEF Phase 44, Action Hub 64, Trust & Action 30, Platform orchestration 68',
      'met', length(public._awobp_distinction_note()) > 50,
      'note', 'Blueprint Phase 40 extends A.42 — not a duplicate route.'
    )
  );
end; $$;

-- Extend card — blueprint phase indicator
create or replace function public.get_workflow_orchestration_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('workflows.view');
  v_org_id := public._mta_require_organization();

  return jsonb_build_object(
    'has_organization', true,
    'active_workflows', coalesce((
      select count(*) from public.organization_workflows
      where organization_id = v_org_id and status = 'active'
    ), 0),
    'approval_bottlenecks', coalesce((
      select count(*) from public.workflow_executions
      where organization_id = v_org_id and outcome = 'awaiting_approval'
    ), 0),
    'philosophy', 'Human-defined workflows with oversight and audit.',
    'implementation_blueprint_phase40', jsonb_build_object(
      'phase', 40,
      'title', 'Autonomous Workflow Orchestration Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE40_AUTONOMOUS_WORKFLOW_ORCHESTRATION.md',
      'engine_phase', 'Phase A.42 — Workflow Orchestration Engine',
      'route', '/app/workflow-orchestration-engine'
    ),
    'autonomous_workflow_phase', 40,
    'workflow_abos_principle', public._awobp_abos_principle(),
    'workflow_orchestration_summary', public._awobp_orchestration_summary(v_org_id),
    'blueprint_note', 'Autonomous Workflow Orchestration (ABOS Phase 40) — extends A.42 with approved multi-step orchestration, explainability, and human checkpoints.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- Replace dashboard — preserve ALL A.42 fields; append Phase 40 blueprint
create or replace function public.get_workflow_orchestration_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('workflows.view');
  v_org_id := public._mta_require_organization();
  perform public._woe_seed_templates();

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Human-defined workflow orchestration — organizations design processes; Aipify executes within oversight and trust boundaries.',
    'safety_note', 'Workflows are never auto-created by AI. Templates require explicit human instantiation.',
    'principles', jsonb_build_array(
      'Human-defined workflows only — no silent automation',
      'Role-based approvals via Human Oversight (A.40)',
      'Delegated trust hooks for enterprise approvers (A.41 scaffold)',
      'Operations Center visibility for failures and escalations (A.32)',
      'Full audit trail for create, pause, execute, and approve events'
    ),
    'summary', jsonb_build_object(
      'active_workflows', coalesce((
        select count(*) from public.organization_workflows
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'paused_workflows', coalesce((
        select count(*) from public.organization_workflows
        where organization_id = v_org_id and status = 'paused'
      ), 0),
      'draft_workflows', coalesce((
        select count(*) from public.organization_workflows
        where organization_id = v_org_id and status = 'draft'
      ), 0),
      'total_executions', coalesce((
        select count(*) from public.workflow_executions where organization_id = v_org_id
      ), 0),
      'failed_executions', coalesce((
        select count(*) from public.workflow_executions
        where organization_id = v_org_id and outcome = 'failed'
      ), 0),
      'awaiting_approval', coalesce((
        select count(*) from public.workflow_executions
        where organization_id = v_org_id and outcome = 'awaiting_approval'
      ), 0),
      'approval_bottlenecks', coalesce((
        select count(*) from public.organization_oversight_approvals
        where organization_id = v_org_id
          and approval_status = 'pending'
          and action_type like 'workflow_step_%'
      ), 0)
    ),
    'workflows', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', w.id,
        'workflow_name', w.workflow_name,
        'description', w.description,
        'category', w.category,
        'status', w.status,
        'trust_level', w.trust_level,
        'source_template_key', w.source_template_key,
        'step_count', (select count(*) from public.workflow_steps s where s.workflow_id = w.id),
        'updated_at', w.updated_at
      ) order by w.updated_at desc)
      from public.organization_workflows w
      where w.organization_id = v_org_id and w.status <> 'archived'
    ), '[]'::jsonb),
    'templates', coalesce((
      select jsonb_agg(jsonb_build_object(
        'template_key', t.template_key,
        'template_name', t.template_name,
        'description', t.description,
        'category', t.category,
        'default_trust_level', t.default_trust_level
      ) order by t.template_name)
      from public.workflow_templates t
    ), '[]'::jsonb),
    'recent_executions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id,
        'workflow_id', e.workflow_id,
        'outcome', e.outcome,
        'duration_ms', e.duration_ms,
        'approvals_granted', e.approvals_granted,
        'escalations_triggered', e.escalations_triggered,
        'executed_at', e.executed_at
      ) order by e.executed_at desc)
      from public.workflow_executions e
      where e.organization_id = v_org_id
      limit 15
    ), '[]'::jsonb),
    'integration_links', jsonb_build_object(
      'operations_center', '/app/operations-center-foundation-engine',
      'human_oversight', '/app/human-oversight-engine',
      'enterprise_readiness', '/app/enterprise-readiness-engine',
      'platform_orchestration', '/app/orchestration'
    ),
    'implementation_blueprint_phase40', jsonb_build_object(
      'phase', 40,
      'title', 'Autonomous Workflow Orchestration Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE40_AUTONOMOUS_WORKFLOW_ORCHESTRATION.md',
      'engine_phase', 'Phase A.42 — Workflow Orchestration Engine',
      'route', '/app/workflow-orchestration-engine',
      'mapping_note', 'ABOS Blueprint Phase 40 extends A.42 — distinct from AEF Phase 44, Action Hub 64, Trust & Action 30, Platform orchestration 68.'
    ),
    'autonomous_workflow_mission', public._awobp_mission(),
    'autonomous_workflow_philosophy', public._awobp_philosophy(),
    'workflow_objectives', public._awobp_workflow_objectives(),
    'workflow_examples', public._awobp_workflow_examples(),
    'approval_principles', public._awobp_approval_principles(),
    'explainability_principles', public._awobp_explainability_principles(),
    'workflow_marketplace_connection', public._awobp_marketplace_connection(),
    'workflow_self_love_connection', public._awobp_self_love_connection(),
    'workflow_dogfooding', public._awobp_dogfooding(),
    'workflow_orchestration_summary', public._awobp_orchestration_summary(v_org_id),
    'workflow_success_criteria', public._awobp_blueprint_success_criteria(v_org_id),
    'workflow_vision_phrases', public._awobp_vision_phrases(),
    'workflow_abos_principle', public._awobp_abos_principle(),
    'workflow_distinction_note', public._awobp_distinction_note(),
    'workflow_integration_links', public._awobp_integration_links()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._awobp_mission() to authenticated;
grant execute on function public._awobp_philosophy() to authenticated;
grant execute on function public._awobp_abos_principle() to authenticated;
grant execute on function public._awobp_workflow_objectives() to authenticated;
grant execute on function public._awobp_workflow_examples() to authenticated;
grant execute on function public._awobp_approval_principles() to authenticated;
grant execute on function public._awobp_explainability_principles() to authenticated;
grant execute on function public._awobp_marketplace_connection() to authenticated;
grant execute on function public._awobp_self_love_connection() to authenticated;
grant execute on function public._awobp_dogfooding() to authenticated;
grant execute on function public._awobp_vision_phrases() to authenticated;
grant execute on function public._awobp_integration_links() to authenticated;
grant execute on function public._awobp_distinction_note() to authenticated;
grant execute on function public._awobp_orchestration_summary(uuid) to authenticated;
grant execute on function public._awobp_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'autonomous-workflow-orchestration-blueprint', 'Autonomous Workflow Orchestration (ABOS Phase 40)',
  'Autonomous Workflow Orchestration Engine — extends A.42 with approved multi-step orchestration, explainability, approval checkpoints, and marketplace connections.',
  'authenticated', 78
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'autonomous-workflow-orchestration-blueprint' and tenant_id is null
);
