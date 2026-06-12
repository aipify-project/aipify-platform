-- Implementation Blueprint Phase 86 — Autonomous Operations Orchestration Engine
-- Extends Workflow Orchestration Engine (Phase A.42) + Blueprint Phase 40. No new tables — metadata scaffold only.
-- Distinct from Customer Lifecycle repo Phase 86 (/app/customer-lifecycle), Legacy Engine A.86 (/app/legacy-engine),
-- Blueprint Phase 83 Long-Term Stewardship (extends A.86 Legacy), AEF Phase 44, Action Hub 64, Trust & Action 30.

create or replace function public._aoobp86_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 86 extends Workflow Orchestration Engine Phase A.42 + Blueprint Phase 40 at /app/workflow-orchestration-engine — autonomous operations orchestration for repetitive, well-defined, approved workflows with explainability and human checkpoints. Phase number collisions: Customer Lifecycle & Success Orchestration repo Phase 86 at /app/customer-lifecycle (customer journey, not operational workflow orchestration); Legacy Engine Phase A.86 at /app/legacy-engine (organizational wisdom storytelling); Blueprint Phase 83 Long-Term Stewardship extends A.86 Legacy — not operations orchestration. Distinct from Autonomous Execution Framework Phase 44 (/app/action-center) for controlled business action execution; Action Hub Phase 64 (/app/actions) for operational action queues; Trust & Action Engine Phase 30 (/app/approvals) for risk levels 0–4; Autonomous Operations Center repo Phase 79 (/app/operations) for observe/recommend operational health. Cross-link engines; do not duplicate action execution or approval tables.';
$$;

create or replace function public._aoobp86_mission()
returns text language sql immutable as $$
  select 'Reduce operational friction by orchestrating repetitive, well-defined, approved workflows.';
$$;

create or replace function public._aoobp86_philosophy()
returns text language sql immutable as $$
  select 'Autonomy without safeguards = risk; human judgment without support = burden.';
$$;

create or replace function public._aoobp86_abos_principle()
returns text language sql immutable as $$
  select 'Automation amplifies human potential — Aipify removes friction while preserving dignity, creativity, and accountability inside the Aipify Business Operating System.';
$$;

create or replace function public._aoobp86_vision()
returns text language sql immutable as $$
  select 'Aipify quietly handled everything that did not require our full attention.';
$$;

create or replace function public._aoobp86_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'friction_reduction', 'label', 'Friction reduction', 'description', 'Coordinate repetitive operational steps — reduce manual handoffs and context switching across modules'),
    jsonb_build_object('key', 'approval_aware_execution', 'label', 'Approval-aware execution', 'description', 'Execute within predefined rules and trust-aligned approval gates — never silent critical automation'),
    jsonb_build_object('key', 'cross_module_orchestration', 'label', 'Cross-module orchestration', 'description', 'Bridge Support AI, Sales Expert, Commerce, Integration Engine, and Knowledge Center in coherent sequences'),
    jsonb_build_object('key', 'explainable_automation', 'label', 'Explainable automation', 'description', 'Every step documented with reason, source trigger, systems involved, and expected outcomes'),
    jsonb_build_object('key', 'operational_consistency', 'label', 'Operational consistency', 'description', 'Repeatable processes reduce ad-hoc variance — templates and audit trails preserve organizational memory'),
    jsonb_build_object('key', 'human_judgment_preservation', 'label', 'Human judgment preservation', 'description', 'Strategic, financial, legal, and sensitive decisions always remain with humans — Aipify prepares and explains')
  );
$$;

create or replace function public._aoobp86_autonomy_levels()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'level', 1,
      'key', 'observe',
      'label', 'Level 1 — Observe',
      'approval_required', true,
      'description', 'Detect patterns, surface operational signals, and recommend orchestration — humans approve before any action',
      'examples', jsonb_build_array(
        'Support case volume spike detected — recommend triage workflow template',
        'Renewal window approaching — surface financial reminder workflow for review',
        'Knowledge gap pattern after three similar cases — suggest KC update workflow'
      )
    ),
    jsonb_build_object(
      'level', 2,
      'key', 'assist',
      'label', 'Level 2 — Assist',
      'approval_required', true,
      'description', 'Prepare drafts, queue next steps, and assemble context — humans confirm before execution',
      'examples', jsonb_build_array(
        'Prepare Sales Expert onboarding task sequence — await owner approval',
        'Draft stakeholder notification for high-priority support case — review before send',
        'Assemble Stripe→Fiken reconciliation checklist — human confirms each step'
      )
    ),
    jsonb_build_object(
      'level', 3,
      'key', 'execute',
      'label', 'Level 3 — Execute',
      'approval_required', false,
      'description', 'Run predefined rules within trust boundaries — notifications, task creation, status updates when workflow trust level permits',
      'examples', jsonb_build_array(
        'Create follow-up task after support case resolution within approved template',
        'Send internal reminder when onboarding step overdue per workflow rules',
        'Update workflow execution status and log audit event after low-risk step completion'
      )
    ),
    jsonb_build_object(
      'level', 4,
      'key', 'orchestrate',
      'label', 'Level 4 — Orchestrate',
      'approval_required', true,
      'description', 'Coordinate multi-step flows across systems — governance, Human Oversight, and Delegated Trust required',
      'examples', jsonb_build_array(
        'Sales Expert onboarding flow across CRM, tasks, KC, and notifications — governance review',
        'Support case escalation with stakeholder notification and knowledge gap routing',
        'Commerce Stripe payment event → Fiken invoice preparation with financial approval gate'
      )
    )
  );
$$;

create or replace function public._aoobp86_operational_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'sales_expert_onboarding',
      'label', 'Sales Expert onboarding flow',
      'category', 'sales',
      'route', '/app/sales-expert-engine',
      'autonomy_level', 4,
      'description', 'Multi-step onboarding for new Sales Expert partners — governance and approval gates at sensitive steps',
      'steps', jsonb_build_array(
        jsonb_build_object('order', 1, 'action', 'detect_new_partner_signal', 'system', 'Sales Expert OS A.95', 'approval', 'none', 'note', 'Metadata trigger from partner activation'),
        jsonb_build_object('order', 2, 'action', 'create_onboarding_tasks', 'system', 'Unified Tasks A.62', 'approval', 'workflow_owner', 'note', 'Welcome, certification, and portal setup tasks'),
        jsonb_build_object('order', 3, 'action', 'assign_kc_resources', 'system', 'Knowledge Center A.5', 'approval', 'none', 'note', 'Link FAQ and training articles'),
        jsonb_build_object('order', 4, 'action', 'notify_sales_coach', 'system', 'Sales Coach Phase 45', 'approval', 'none', 'note', 'Coach enablement nudge for new partner'),
        jsonb_build_object('order', 5, 'action', 'schedule_check_in', 'system', 'Context Engine / Calendars', 'approval', 'partner_or_admin', 'note', '30-day onboarding review — human confirms')
      )
    ),
    jsonb_build_object(
      'key', 'support_case_flow',
      'label', 'Support case flow',
      'category', 'support',
      'route', '/app/support',
      'autonomy_level', 4,
      'description', 'Triage, assignment, escalation, and knowledge gap routing for support cases',
      'steps', jsonb_build_array(
        jsonb_build_object('order', 1, 'action', 'triage_case', 'system', 'Support AI A.7 / ASO', 'approval', 'none', 'note', 'Category and priority from Business DNA metadata'),
        jsonb_build_object('order', 2, 'action', 'assign_owner', 'system', 'Operations Center A.32', 'approval', 'support_lead', 'note', 'Assignment when confidence below threshold'),
        jsonb_build_object('order', 3, 'action', 'notify_stakeholders', 'system', 'Notification Engine', 'approval', 'medium_risk_review', 'note', 'High-priority case stakeholder alert'),
        jsonb_build_object('order', 4, 'action', 'generate_handoff_summary', 'system', 'Document Output A.59', 'approval', 'none', 'note', 'Metadata summary for handoffs — no raw chat'),
        jsonb_build_object('order', 5, 'action', 'detect_knowledge_gap', 'system', 'Business DNA / KC A.5', 'approval', 'knowledge_admin', 'note', 'FAQ update suggestion after resolution pattern')
      )
    ),
    jsonb_build_object(
      'key', 'commerce_stripe_fiken',
      'label', 'Commerce Stripe → Fiken flow',
      'category', 'financial',
      'route', '/app/commercial',
      'autonomy_level', 4,
      'description', 'Payment event awareness through invoice preparation — financial approval required',
      'steps', jsonb_build_array(
        jsonb_build_object('order', 1, 'action', 'receive_stripe_event', 'system', 'Integration Engine A.8', 'approval', 'none', 'note', 'Subscription or payment metadata event'),
        jsonb_build_object('order', 2, 'action', 'validate_tenant_mapping', 'system', 'Commerce / License Center', 'approval', 'none', 'note', 'Tenant and plan verification'),
        jsonb_build_object('order', 3, 'action', 'prepare_fiken_draft', 'system', 'Integration Engine A.8', 'approval', 'financial_reviewer', 'note', 'Invoice draft — explicit human approval before submission'),
        jsonb_build_object('order', 4, 'action', 'log_audit_event', 'system', 'Trust & Action / aipify_action_logs', 'approval', 'none', 'note', 'Timestamp, reason, source trigger, outcome'),
        jsonb_build_object('order', 5, 'action', 'notify_finance_owner', 'system', 'Notification Engine', 'approval', 'none', 'note', 'Finance team awareness — not auto-submit')
      )
    )
  );
$$;

create or replace function public._aoobp86_human_approval_principle()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Certain decisions always require human judgment — Aipify prepares context and explains options; humans decide and approve.',
    'categories', jsonb_build_array(
      jsonb_build_object('key', 'financial', 'label', 'Financial decisions', 'description', 'Invoices, refunds, pricing changes, payment reconciliation — explicit approval via Trust & Action and Human Oversight', 'trust_action_level', 3, 'route', '/app/approvals'),
      jsonb_build_object('key', 'termination', 'label', 'Termination decisions', 'description', 'Contract termination, service cancellation, account closure — human-only; critical actions prohibited for autonomous execution', 'trust_action_level', 4, 'route', '/app/approvals'),
      jsonb_build_object('key', 'strategic', 'label', 'Strategic decisions', 'description', 'Organizational direction, major partnerships, resource allocation — Aipify informs; leadership decides', 'trust_action_level', 3, 'route', '/app/human-oversight-engine'),
      jsonb_build_object('key', 'sensitive_comms', 'label', 'Sensitive communications', 'description', 'Customer-facing messages on disputes, billing, or personnel — draft and review before send', 'trust_action_level', 2, 'route', '/app/approvals'),
      jsonb_build_object('key', 'legal', 'label', 'Legal and compliance', 'description', 'Policy exceptions, data processing changes, regulatory filings — human and compliance review required', 'trust_action_level', 4, 'route', '/app/human-oversight-engine')
    ),
    'human_oversight_route', '/app/human-oversight-engine',
    'delegated_trust_route', '/app/enterprise-readiness-engine',
    'boundary', 'Workflow orchestration aligns with Trust & Action risk levels — never bypass approval policies.'
  );
$$;

create or replace function public._aoobp86_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion guidance observes operational patterns and recommends orchestration — never pressure, never hidden execution.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'cue', 'pattern_detected', 'example', 'Support cases with the same root cause appeared three times this week — a triage workflow could reduce repeat effort. Shall I prepare the template for your review?'),
      jsonb_build_object('emoji', '🌹', 'cue', 'handoff_ready', 'example', 'Sales Expert onboarding tasks are queued — the welcome sequence is ready when you approve the next step.'),
      jsonb_build_object('emoji', '🔔', 'cue', 'approval_waiting', 'example', 'Stripe payment received — Fiken invoice draft awaits finance approval before submission. Here is what changed and why.')
    ),
    'boundary', 'Companion guidance informs and prepares — humans retain control over activation and sensitive steps.'
  );
$$;

create or replace function public._aoobp86_audit_transparency()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Every orchestration event is auditable — metadata only, no PII in RPC payloads.',
    'required_fields', jsonb_build_array(
      jsonb_build_object('key', 'timestamp', 'label', 'Timestamp', 'description', 'When the step was triggered, executed, or completed'),
      jsonb_build_object('key', 'reason', 'label', 'Reason', 'description', 'Why Aipify recommended or executed the step — operational signal or rule match'),
      jsonb_build_object('key', 'source_trigger', 'label', 'Source trigger', 'description', 'Workflow template, manual initiation, integration event, or operational signal'),
      jsonb_build_object('key', 'outcome', 'label', 'Outcome', 'description', 'Completed, failed, partial, awaiting_approval, or cancelled — with explainability'),
      jsonb_build_object('key', 'approval_history', 'label', 'Approval history', 'description', 'Human Oversight and Trust & Action approvals granted, rejected, or pending')
    ),
    'audit_routes', jsonb_build_object(
      'workflow_executions', 'workflow_executions table — tenant-scoped execution audit',
      'aipify_action_logs', '/app/action-center — AEF Phase 44 action lifecycle logs',
      'trust_actions', '/app/approvals — Trust & Action approval history'
    ),
    'privacy_note', 'Audit stores metadata and outcomes — never raw email, chat, orders, or payment details.'
  );
$$;

create or replace function public._aoobp86_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Reduce repetitive operational burden — create space for meaningful work and sustainable pace.',
    'connections', jsonb_build_array(
      'Automate routine notifications and task creation — humans focus on judgment',
      'Multi-step handoffs reduce spreadsheet chasing and context switching',
      'Approval checkpoints prevent rushed irreversible decisions',
      'Explainable orchestration reduces anxiety about what Aipify did in the background'
    ),
    'self_love_route', '/app/self-love-engine',
    'boundary', 'Self Love A.76 owns reflection workflows — Autonomous Operations Orchestration stores process metadata, not wellbeing content.'
  );
$$;

create or replace function public._aoobp86_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust grows through transparency — orchestration respects approval policies, audit requirements, and human accountability.',
    'connections', jsonb_build_array(
      'Trust & Action Engine Phase 30 — risk levels 0–4 for sensitive steps',
      'Human Oversight A.40 — role-based approval checkpoints',
      'Delegated Trust A.41 — enterprise approver chains',
      'AEF Phase 44 — controlled execution with safety checker and aipify_action_logs',
      'Action Hub Phase 64 — operational queue visibility without duplicating workflow design'
    ),
    'approvals_route', '/app/approvals',
    'action_center_route', '/app/action-center',
    'actions_route', '/app/actions',
    'boundary', 'Orchestration prepares and coordinates — Trust & Action owns approval policy enforcement.'
  );
$$;

create or replace function public._aoobp86_safety_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Safe orchestration requires visible boundaries — humans always know what Aipify prepared, recommended, or executed.',
    'avoid', jsonb_build_array(
      jsonb_build_object('key', 'hidden_automation', 'label', 'Hidden automation', 'description', 'Never execute steps without visibility in workflow audit and dashboard'),
      jsonb_build_object('key', 'irreversible_autonomous', 'label', 'Irreversible autonomous actions', 'description', 'Critical and high-risk irreversible operations require explicit human approval — never silent'),
      jsonb_build_object('key', 'unexplained_decisions', 'label', 'Unexplained decisions', 'description', 'Every recommendation and execution includes reason, systems involved, and expected outcomes'),
      jsonb_build_object('key', 'removing_accountability', 'label', 'Removing accountability', 'description', 'Orchestration supports humans — never implies Aipify replaces judgment or ownership')
    ),
    'safety_note', 'Workflows are never auto-created — templates require explicit human instantiation.'
  );
$$;

create or replace function public._aoobp86_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates autonomous operations orchestration internally; Unonight exercises commerce, support, and sales workflows as first external pilot.',
    'focus_areas', jsonb_build_array(
      'Sales Expert onboarding sequences — partner portal handoffs and certification tasks',
      'Support workflows — triage, escalation, and knowledge gap routing',
      'Fiken/Stripe commerce reconciliation — financial approval gate calibration',
      'Meeting prep workflows — Context Engine and Document Output coordination',
      'KC update suggestions — documentation improvement after support patterns'
    ),
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — Sales Expert onboarding, support workflows, Stripe/Fiken, meeting prep, KC updates',
      'focus', jsonb_build_array(
        'Sales Expert onboarding orchestration with Human Oversight gates',
        'Support case triage and stakeholder notification templates',
        'Commerce payment event → invoice draft with finance approval',
        'Executive meeting prep task and document delivery workflows',
        'KC documentation suggestion workflows after internal support patterns'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce support, sales onboarding, and knowledge workflows',
      'focus', jsonb_build_array(
        'Support triage and escalation for commerce operations',
        'Sales welcome and onboarding task handoffs',
        'Stripe subscription event awareness with renewal preparation',
        'FAQ update suggestions from support pattern metadata',
        'Operations Center visibility for workflow failures and bottlenecks'
      )
    )
  );
$$;

create or replace function public._aoobp86_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'action_center', 'label', 'Autonomous Execution Framework Phase 44', 'route', '/app/action-center', 'note', 'Controlled business action execution — safety checker and aipify_action_logs'),
    jsonb_build_object('key', 'trust_actions', 'label', 'Trust & Action Engine Phase 30', 'route', '/app/approvals', 'note', 'Risk levels 0–4 — sensitive action approvals'),
    jsonb_build_object('key', 'action_hub', 'label', 'Action Hub Phase 64', 'route', '/app/actions', 'note', 'Operational action queue — distinct from multi-step workflow orchestration'),
    jsonb_build_object('key', 'operations_center', 'label', 'Autonomous Operations Center Phase 79', 'route', '/app/operations', 'note', 'Observes and recommends operational health — cross-link, not duplicate'),
    jsonb_build_object('key', 'integration_engine', 'label', 'Integration Engine A.8', 'route', '/app/integration-engine', 'note', 'Cross-platform connector actions within workflow steps'),
    jsonb_build_object('key', 'support_ai', 'label', 'Support AI A.7', 'route', '/app/support', 'note', 'Support case triage, escalation, and notification steps'),
    jsonb_build_object('key', 'sales_expert', 'label', 'Sales Expert OS A.95', 'route', '/app/sales-expert-engine', 'note', 'Partner onboarding and sales workflow handoffs'),
    jsonb_build_object('key', 'human_oversight', 'label', 'Human Oversight A.40', 'route', '/app/human-oversight-engine', 'note', 'Role-based approval checkpoints for workflow steps'),
    jsonb_build_object('key', 'delegated_trust', 'label', 'Delegated Trust A.41', 'route', '/app/enterprise-readiness-engine', 'note', 'Enterprise approver chains and delegated trust scaffold'),
    jsonb_build_object('key', 'workflow_phase40', 'label', 'Workflow Orchestration Blueprint Phase 40', 'route', '/app/workflow-orchestration-engine', 'note', 'Approved multi-step workflow orchestration baseline on A.42'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center A.5', 'route', '/app/knowledge-center', 'note', 'FAQ updates and documentation suggestion workflows'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Reduce operational burden — principle only')
  );
$$;

create or replace function public._aoobp86_blueprint_block()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'phase', 86,
    'title', 'Autonomous Operations Orchestration Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE86_AUTONOMOUS_OPERATIONS_ORCHESTRATION.md',
    'engine_phase', 'Phase A.42 — Workflow Orchestration Engine',
    'route', '/app/workflow-orchestration-engine',
    'mapping_note', 'ABOS Blueprint Phase 86 extends A.42 + Phase 40 — distinct from Customer Lifecycle repo Phase 86, Legacy A.86, and Blueprint Phase 83.',
    'distinction_note', public._aoobp86_distinction_note(),
    'mission', public._aoobp86_mission(),
    'philosophy', public._aoobp86_philosophy(),
    'abos_principle', public._aoobp86_abos_principle(),
    'vision', public._aoobp86_vision(),
    'objectives', public._aoobp86_objectives(),
    'autonomy_levels', public._aoobp86_autonomy_levels(),
    'operational_examples', public._aoobp86_operational_examples(),
    'human_approval_principle', public._aoobp86_human_approval_principle(),
    'companion_guidance', public._aoobp86_companion_guidance(),
    'audit_transparency', public._aoobp86_audit_transparency(),
    'self_love_connection', public._aoobp86_self_love_connection(),
    'trust_connection', public._aoobp86_trust_connection(),
    'safety_principles', public._aoobp86_safety_principles(),
    'dogfooding', public._aoobp86_dogfooding(),
    'integration_links', public._aoobp86_integration_links()
  );
$$;

create or replace function public._aoobp86_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_summary jsonb;
  v_active int := 0;
begin
  v_summary := public._awobp_orchestration_summary(p_organization_id);
  v_active := coalesce((v_summary->>'active_workflows')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'objectives',
      'label', 'Six orchestration objectives documented — friction reduction through human judgment preservation',
      'met', jsonb_array_length(public._aoobp86_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'autonomy_levels',
      'label', 'Four autonomy levels — Observe, Assist, Execute, Orchestrate with examples',
      'met', jsonb_array_length(public._aoobp86_autonomy_levels()) = 4,
      'note', 'Levels 1–2 and 4 require approval; Level 3 runs within predefined rules.'
    ),
    jsonb_build_object(
      'key', 'operational_examples',
      'label', 'Structured operational examples — Sales Expert onboarding, Support case, Stripe→Fiken',
      'met', jsonb_array_length(public._aoobp86_operational_examples()) >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'human_approval_principle',
      'label', 'Human approval principle — financial, termination, strategic, sensitive comms, legal',
      'met', jsonb_array_length((public._aoobp86_human_approval_principle()->'categories')) >= 5,
      'note', 'Route /app/approvals for sensitive actions.'
    ),
    jsonb_build_object(
      'key', 'audit_transparency',
      'label', 'Audit transparency — timestamp, reason, source trigger, outcome, approval history',
      'met', jsonb_array_length((public._aoobp86_audit_transparency()->'required_fields')) >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'safety_principles',
      'label', 'Safety principles — no hidden automation, irreversible autonomous, unexplained decisions, accountability removal',
      'met', jsonb_array_length((public._aoobp86_safety_principles()->'avoid')) >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Companion guidance examples — 🦉🌹🔔 observe, handoff, approval waiting',
      'met', jsonb_array_length((public._aoobp86_companion_guidance()->'examples')) >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — Phase 30, A.40, A.41, AEF 44, Action Hub 64',
      'met', jsonb_array_length((public._aoobp86_trust_connection()->'connections')) >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links to AEF 44, approvals, actions, operations, A.8, A.7, A.95, A.40, A.41',
      'met', jsonb_array_length(public._aoobp86_integration_links()) >= 10,
      'note', null
    ),
    jsonb_build_object(
      'key', 'distinction_documented',
      'label', 'Distinction from Customer Lifecycle repo 86, Legacy A.86, Blueprint 83, AEF 44, Action Hub 64',
      'met', length(public._aoobp86_distinction_note()) > 100,
      'note', 'Blueprint Phase 86 extends A.42 + Phase 40 — not a duplicate route.'
    ),
    jsonb_build_object(
      'key', 'active_workflow',
      'label', 'At least one active organization workflow for live orchestration',
      'met', v_active >= 1,
      'note', case when v_active = 0 then 'Create and activate a workflow from a template.' else null end
    )
  );
end; $$;

-- Replace card — preserve ALL Phase 40 + A.42 fields; append autonomous_operations_orchestration
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
    'blueprint_note', 'Autonomous Workflow Orchestration (ABOS Phase 40) — extends A.42 with approved multi-step orchestration, explainability, and human checkpoints.',
    'autonomous_operations_orchestration', public._aoobp86_blueprint_block() || jsonb_build_object(
      'success_criteria', public._aoobp86_blueprint_success_criteria(v_org_id),
      'orchestration_summary', public._awobp_orchestration_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- Replace dashboard — preserve ALL A.42 + Phase 40 fields; append autonomous_operations_orchestration
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
    'workflow_integration_links', public._awobp_integration_links(),
    'autonomous_operations_orchestration', public._aoobp86_blueprint_block() || jsonb_build_object(
      'success_criteria', public._aoobp86_blueprint_success_criteria(v_org_id),
      'orchestration_summary', public._awobp_orchestration_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._aoobp86_distinction_note() to authenticated;
grant execute on function public._aoobp86_mission() to authenticated;
grant execute on function public._aoobp86_philosophy() to authenticated;
grant execute on function public._aoobp86_abos_principle() to authenticated;
grant execute on function public._aoobp86_vision() to authenticated;
grant execute on function public._aoobp86_objectives() to authenticated;
grant execute on function public._aoobp86_autonomy_levels() to authenticated;
grant execute on function public._aoobp86_operational_examples() to authenticated;
grant execute on function public._aoobp86_human_approval_principle() to authenticated;
grant execute on function public._aoobp86_companion_guidance() to authenticated;
grant execute on function public._aoobp86_audit_transparency() to authenticated;
grant execute on function public._aoobp86_self_love_connection() to authenticated;
grant execute on function public._aoobp86_trust_connection() to authenticated;
grant execute on function public._aoobp86_safety_principles() to authenticated;
grant execute on function public._aoobp86_dogfooding() to authenticated;
grant execute on function public._aoobp86_integration_links() to authenticated;
grant execute on function public._aoobp86_blueprint_block() to authenticated;
grant execute on function public._aoobp86_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'autonomous-operations-orchestration-blueprint-phase86', 'Autonomous Operations Orchestration (ABOS Phase 86)',
  'Autonomous Operations Orchestration Engine — extends Workflow Orchestration A.42 + Phase 40 with autonomy levels, operational examples, audit transparency, and trust-aligned orchestration.',
  'authenticated', 86
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'autonomous-operations-orchestration-blueprint-phase86' and tenant_id is null
);
