-- Implementation Blueprint Phase 133 — Autonomous Workflow Orchestration Engine
-- Autonomous Organization Era (131–140) capstone depth on Workflow Orchestration A.42 + Phases 40 & 86.
-- Helpers: _awobp133_* — never collide with _woe_*, _awobp_*, _aoobp86_*.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._awobp133_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Autonomous Organization Era Phase 133 — Autonomous Workflow Orchestration Engine at /app/workflow-orchestration-engine. **Era 131–140 depth** layered on Workflow Orchestration A.42 + Blueprint Phase 40 (_awobp_*) + Phase 86 (_aoobp86_*). Wisdom before speed — automation supports people, never replaces accountability. **Distinct from AEF Phase 44** at /app/action-center (controlled business action execution — cross-link only). **Distinct from Action Hub Phase 64** at /app/actions (operational action queue). **Distinct from Trust & Action Phase 30** at /app/approvals (risk levels 0–4). **Cross-link Phase 132** Coordinated Companion Workforce at /app/companion-workforce-engine (companion teams — workflow participation, not duplicate orchestration). **Cross-link Phase 131** Autonomy Governance & Human Oversight via Human Oversight A.40 at /app/human-oversight-engine (oversight gates until dedicated Phase 131 migration ships). Growth Partner terminology — never Affiliate. Metadata and aggregate analytics only — no PII surveillance. Helpers _awobp133_* only.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata
-- ---------------------------------------------------------------------------
create or replace function public._awobp133_mission()
returns text language sql immutable as $$
  select 'Orchestrate organizational work with wisdom — companions support execution while humans retain accountability for every meaningful decision.';
$$;

create or replace function public._awobp133_philosophy()
returns text language sql immutable as $$
  select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Automation supports people — never replaces accountability.';
$$;

create or replace function public._awobp133_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — human-defined workflows with companion-supported execution, visible approvals, and full audit. Companions prepare and inform; humans decide and approve.';
$$;

create or replace function public._awobp133_vision()
returns text language sql immutable as $$
  select 'Our organization moved forward calmly — repetitive work orchestrated, companions helpful, and every sensitive step clearly owned by a person.';
$$;

create or replace function public._awobp133_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'workflow_orchestration_center', 'label', 'Workflow Orchestration Center', 'emoji', '🦉', 'description', 'Unified center for builder, templates, approvals, companion participation, and analytics'),
    jsonb_build_object('key', 'visual_builder', 'label', 'Visual workflow builder', 'emoji', '📈', 'description', 'No-code metadata scaffold — triggers, conditions, tasks, approvals, escalations, completion rules'),
    jsonb_build_object('key', 'companion_participation', 'label', 'Companion participation', 'emoji', '🌹', 'description', 'Companions retrieve knowledge, prepare tasks, draft updates, highlight risks — never approve restricted actions'),
    jsonb_build_object('key', 'approval_framework', 'label', 'Approval framework', 'emoji', '🔔', 'description', 'Mandatory, optional, role-based, executive, emergency, and escalation gates aligned with Trust & Action'),
    jsonb_build_object('key', 'exception_management', 'label', 'Exception management', 'emoji', '🦉', 'description', 'Escalate, pause, notify, capture context, recommend next steps — full audit trail'),
    jsonb_build_object('key', 'workflow_analytics', 'label', 'Workflow analytics', 'emoji', '📈', 'description', 'Aggregate metadata — completion rates, approval delays, companion participation, CI opportunities'),
    jsonb_build_object('key', 'human_accountability', 'label', 'Human accountability', 'emoji', '❤️', 'description', 'Human intervention points preserved — companions support, humans accountable'),
    jsonb_build_object('key', 'knowledge_integration', 'label', 'Knowledge integration', 'emoji', '🦉', 'description', 'Knowledge retrieval and approval workflows cross-link KC A.5, EKE, Business DNA')
  );
$$;

create or replace function public._awobp133_workflow_orchestration_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Workflow Orchestration Center — design, run, and improve approved organizational workflows with companion support and human checkpoints.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'visual_builder', 'label', 'Visual workflow builder', 'description', 'No-code builder metadata — triggers, conditions, tasks, approvals, escalations, completion rules'),
      jsonb_build_object('key', 'template_library', 'label', 'Template library', 'description', 'Curated templates for support, executive, onboarding, companion deployment, GP ops, security, transformation'),
      jsonb_build_object('key', 'approval_management', 'label', 'Approval management', 'description', 'Mandatory, optional, role-based, executive, emergency, and escalation approval gates'),
      jsonb_build_object('key', 'companion_participation', 'label', 'Companion participation', 'description', 'Companions assist with knowledge, drafts, status, trends, risk highlights — within limitations'),
      jsonb_build_object('key', 'human_intervention', 'label', 'Human intervention', 'description', 'Explicit pause, override, and approval points — never silent critical automation'),
      jsonb_build_object('key', 'workflow_analytics', 'label', 'Workflow analytics', 'description', 'Aggregate completion, delay, escalation, companion, and knowledge utilization metrics'),
      jsonb_build_object('key', 'exception_handling', 'label', 'Exception handling', 'description', 'Escalate, pause, notify, capture context, recommend next steps, audit'),
      jsonb_build_object('key', 'audit_trail', 'label', 'Audit trail', 'description', 'Workflow executions, approval histories, companion action metadata — no raw PII'),
      jsonb_build_object('key', 'knowledge_integration', 'label', 'Knowledge integration', 'description', 'Knowledge retrieval steps, KC approvals, EKE onboarding paths — cross-link only')
    ),
    'boundary_note', 'Orchestration Center coordinates approved workflows — AEF executes discrete actions; Trust & Action owns approval policy.'
  );
$$;

create or replace function public._awobp133_supported_workflow_types()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'support', 'label', 'Support workflows', 'route', '/app/support', 'description', 'Case triage, escalation, stakeholder notification, knowledge gap routing'),
    jsonb_build_object('key', 'knowledge', 'label', 'Knowledge workflows', 'route', '/app/knowledge-center', 'description', 'FAQ updates, approval routing, documentation improvement proposals'),
    jsonb_build_object('key', 'executive_briefing', 'label', 'Executive briefing workflows', 'route', '/app/executive-intelligence', 'description', 'Briefing preparation, review gates, distribution scaffolds — metadata only'),
    jsonb_build_object('key', 'growth_partner', 'label', 'Growth Partner workflows', 'route', '/app/growth-partner-operations', 'description', 'Growth Partner onboarding, certification handoffs, ecosystem ops — never Affiliate terminology'),
    jsonb_build_object('key', 'companion_deployment', 'label', 'Companion deployment workflows', 'route', '/app/companion-marketplace', 'description', 'Companion activation, workforce coordination handoffs — cross-link Phase 132'),
    jsonb_build_object('key', 'employee_onboarding', 'label', 'Employee onboarding workflows', 'route', '/app/settings/employee-knowledge', 'description', 'Onboarding paths, knowledge review, manager approval gates'),
    jsonb_build_object('key', 'security_response', 'label', 'Security response workflows', 'route', '/app/settings/security', 'description', 'Incident notification, escalation, review gates — cross-link Security & Trust A.18'),
    jsonb_build_object('key', 'transformation', 'label', 'Transformation workflows', 'route', '/app/change-management-engine', 'description', 'Change communication, adoption checkpoints — cross-link Transformation 127'),
    jsonb_build_object('key', 'commerce', 'label', 'Commerce workflows', 'route', '/app/commercial', 'description', 'Payment awareness, renewal preparation, financial approval gates'),
    jsonb_build_object('key', 'community', 'label', 'Community workflows', 'route', '/app/community', 'description', 'Community engagement follow-ups, collective success patterns — cross-link Community 117'),
    jsonb_build_object('key', 'custom', 'label', 'Custom workflows', 'route', '/app/workflow-orchestration-engine', 'description', 'Organization-defined sequences — human instantiation required')
  );
$$;

create or replace function public._awobp133_visual_workflow_builder()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Visual workflow builder — no-code metadata scaffold describing how approved workflows are designed (implementation future phase).',
    'elements', jsonb_build_array(
      jsonb_build_object('key', 'triggers', 'label', 'Triggers', 'description', 'Events that start or advance a workflow step — manual, integration, calendar, governance, companion recommendation'),
      jsonb_build_object('key', 'conditions', 'label', 'Conditions', 'description', 'Branching rules — role, trust level, outcome, approval status, metadata thresholds'),
      jsonb_build_object('key', 'tasks', 'label', 'Tasks', 'description', 'Create, assign, and complete tasks via Unified Tasks A.62 integration scaffold'),
      jsonb_build_object('key', 'approvals', 'label', 'Approvals', 'description', 'Request and await human approval — Human Oversight A.40 and Trust & Action Phase 30 alignment'),
      jsonb_build_object('key', 'escalations', 'label', 'Escalations', 'description', 'Route to manager, administrator, or executive when thresholds or timeouts met'),
      jsonb_build_object('key', 'companion_participation', 'label', 'Companion participation', 'description', 'Companion-assisted knowledge retrieval, drafting, status updates — within companion limitations'),
      jsonb_build_object('key', 'notifications', 'label', 'Notifications', 'description', 'Internal reminders and stakeholder alerts via Notification Engine — professional tone'),
      jsonb_build_object('key', 'knowledge_retrieval', 'label', 'Knowledge retrieval', 'description', 'Fetch approved KC, EKE, and Business DNA metadata — no raw customer content'),
      jsonb_build_object('key', 'completion_rules', 'label', 'Completion rules', 'description', 'Define when a workflow or step is complete, failed, or awaiting approval')
    ),
    'scaffold_note', 'Builder stores workflow definition metadata — execution remains within A.42 tables and Trust boundaries.'
  );
$$;

create or replace function public._awobp133_workflow_triggers()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'customer_request', 'label', 'Customer requests', 'description', 'Support case, onboarding signal, or service request metadata — not raw message content'),
    jsonb_build_object('key', 'calendar', 'label', 'Calendar events', 'description', 'Context Engine calendar signals — meeting prep, review cycles, overdue checkpoints'),
    jsonb_build_object('key', 'knowledge_update', 'label', 'Knowledge updates', 'description', 'KC article published or EKE path updated — review and approval routing'),
    jsonb_build_object('key', 'companion_recommendation', 'label', 'Companion recommendations', 'description', 'Companion suggests workflow template — human approves instantiation'),
    jsonb_build_object('key', 'governance', 'label', 'Governance events', 'description', 'Policy review due, approval bottleneck, compliance checkpoint — cross-link Governance 123'),
    jsonb_build_object('key', 'executive_review', 'label', 'Executive reviews', 'description', 'Executive briefing or decision review cycle — cross-link Executive Intelligence 121'),
    jsonb_build_object('key', 'security_incident', 'label', 'Security incidents', 'description', 'Incident detected metadata — notification and escalation scaffold'),
    jsonb_build_object('key', 'gp_activity', 'label', 'Growth Partner activities', 'description', 'GP onboarding, certification, ecosystem ops signals — cross-link GP Operations 114'),
    jsonb_build_object('key', 'community', 'label', 'Community signals', 'description', 'Community engagement patterns — cross-link Community 117'),
    jsonb_build_object('key', 'integration', 'label', 'Integration events', 'description', 'Stripe, CRM, or connector metadata events — Integration Engine A.8')
  );
$$;

create or replace function public._awobp133_approval_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Every workflow respects approval boundaries — companions prepare; humans approve sensitive and restricted steps.',
    'gate_types', jsonb_build_array(
      jsonb_build_object('key', 'mandatory', 'label', 'Mandatory approval', 'description', 'Step cannot proceed without explicit human approval — financial, legal, termination-adjacent'),
      jsonb_build_object('key', 'optional', 'label', 'Optional approval', 'description', 'Reviewer may approve or skip when confidence and trust level permit'),
      jsonb_build_object('key', 'role_based', 'label', 'Role-based approval', 'description', 'Manager, administrator, support lead, knowledge admin — via Human Oversight A.40'),
      jsonb_build_object('key', 'executive', 'label', 'Executive approval', 'description', 'Leadership review for strategic, cross-functional, or high-impact orchestration'),
      jsonb_build_object('key', 'emergency', 'label', 'Emergency approval', 'description', 'Expedited path with enhanced audit — never bypass critical prohibition'),
      jsonb_build_object('key', 'escalation', 'label', 'Escalation approval', 'description', 'Timeout or failure routes to next approver in chain — Delegated Trust A.41 scaffold')
    ),
    'trust_action_route', '/app/approvals',
    'human_oversight_route', '/app/human-oversight-engine',
    'boundary', 'Approval framework aligns with Trust & Action risk levels 0–4 — critical actions prohibited for autonomous execution.'
  );
$$;

create or replace function public._awobp133_companion_participation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companions participate in workflow execution as supportive teammates — knowledge, preparation, and visibility, not authority.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'knowledge_retrieval', 'label', 'Knowledge retrieval', 'description', 'Fetch approved KC, EKE, and Business DNA metadata for step context'),
      jsonb_build_object('key', 'task_preparation', 'label', 'Task preparation', 'description', 'Assemble task lists, checklists, and handoff summaries for human review'),
      jsonb_build_object('key', 'status_updates', 'label', 'Status updates', 'description', 'Update workflow execution status metadata when step completes within rules'),
      jsonb_build_object('key', 'drafting', 'label', 'Drafting support', 'description', 'Prepare notification and document drafts — human review before external send'),
      jsonb_build_object('key', 'trend_highlighting', 'label', 'Trend highlighting', 'description', 'Surface operational patterns suggesting workflow improvements — metadata only'),
      jsonb_build_object('key', 'risk_highlighting', 'label', 'Risk highlighting', 'description', 'Flag steps approaching approval or escalation thresholds — calm, not alarmist'),
      jsonb_build_object('key', 'summarization', 'label', 'Summarization', 'description', 'Metadata summaries for handoffs and audit — max 500 chars, no raw chat or email')
    ),
    'companion_workforce_route', '/app/companion-workforce-engine',
    'boundary', 'Companion participation supports execution — cross-link Phase 132 workforce coordination; never duplicate companion registry.'
  );
$$;

create or replace function public._awobp133_exception_management()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'When workflows fail, stall, or encounter unexpected conditions — escalate transparently with full context capture.',
    'actions', jsonb_build_array(
      jsonb_build_object('key', 'escalate', 'label', 'Escalate', 'description', 'Route to next approver, manager, or Operations Center visibility'),
      jsonb_build_object('key', 'pause', 'label', 'Pause workflow', 'description', 'Halt execution until human reviews context — no silent retry on critical paths'),
      jsonb_build_object('key', 'notify', 'label', 'Notify stakeholders', 'description', 'Alert workflow owner and affected roles — professional tone, metadata only'),
      jsonb_build_object('key', 'capture_context', 'label', 'Capture context', 'description', 'Record reason, trigger, systems involved, partial outcome — audit metadata'),
      jsonb_build_object('key', 'recommend_next_steps', 'label', 'Recommend next steps', 'description', 'Companion or system suggests recovery options — human chooses'),
      jsonb_build_object('key', 'audit', 'label', 'Audit event', 'description', 'Log exception in workflow_executions and trust audit — immutable trail')
    ),
    'operations_center_route', '/app/operations-center-foundation-engine',
    'boundary', 'Exception management preserves accountability — never auto-resume sensitive steps without approval.'
  );
$$;

create or replace function public._awobp133_workflow_analytics()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Workflow analytics use aggregate metadata only — improve processes without surveillance or punitive individual scoring.',
    'metrics', jsonb_build_array(
      jsonb_build_object('key', 'completion_rates', 'label', 'Completion rates', 'description', 'Workflow and step completion percentages — tenant aggregate'),
      jsonb_build_object('key', 'approval_delays', 'label', 'Approval delays', 'description', 'Average time awaiting approval — bottleneck awareness'),
      jsonb_build_object('key', 'escalation_frequency', 'label', 'Escalation frequency', 'description', 'How often steps escalate — pattern detection for template improvement'),
      jsonb_build_object('key', 'companion_participation', 'label', 'Companion participation', 'description', 'Aggregate companion-assisted step counts — not individual surveillance'),
      jsonb_build_object('key', 'knowledge_utilization', 'label', 'Knowledge utilization', 'description', 'Knowledge retrieval steps and KC approval workflow usage'),
      jsonb_build_object('key', 'human_satisfaction', 'label', 'Human satisfaction signals', 'description', 'Optional feedback metadata on workflow clarity — not performance scoring'),
      jsonb_build_object('key', 'exception_trends', 'label', 'Exception trends', 'description', 'Failed, partial, and paused execution patterns — CI input'),
      jsonb_build_object('key', 'ci_opportunities', 'label', 'Continuous improvement opportunities', 'description', 'Suggested template and process improvements — cross-link CI A.33')
    ),
    'privacy_note', 'Analytics store counts and trends only — never email content, chat, orders, or individual employee surveillance.'
  );
$$;

create or replace function public._awobp133_template_library()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'support_escalation', 'label', 'Support escalation', 'category', 'support', 'description', 'Triage, notification, manager escalation — extends A.42 seed template'),
    jsonb_build_object('key', 'executive_briefing', 'label', 'Executive briefings', 'category', 'executive', 'description', 'Briefing prep, review gate, distribution scaffold — metadata only'),
    jsonb_build_object('key', 'employee_onboarding', 'label', 'Employee onboarding', 'category', 'onboarding', 'description', 'Onboarding tasks, knowledge review, manager approval'),
    jsonb_build_object('key', 'companion_deployment', 'label', 'Companion deployments', 'category', 'companion', 'description', 'Companion activation checklist — cross-link Marketplace 113 and Workforce 132'),
    jsonb_build_object('key', 'gp_operations', 'label', 'Growth Partner operations', 'category', 'growth_partner', 'description', 'GP onboarding and certification handoffs — Growth Partner terminology'),
    jsonb_build_object('key', 'knowledge_approval', 'label', 'Knowledge approvals', 'category', 'knowledge', 'description', 'KC update review, draft generation, approver routing'),
    jsonb_build_object('key', 'security_review', 'label', 'Security reviews', 'category', 'security', 'description', 'Incident notification, stakeholder alert, administrator review'),
    jsonb_build_object('key', 'transformation_communication', 'label', 'Transformation communication', 'category', 'transformation', 'description', 'Change announcement, adoption checkpoint, feedback scaffold — cross-link 127')
  );
$$;

create or replace function public._awobp133_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'no_governance_modification', 'label', 'Never modify governance', 'description', 'Companions cannot change policies, approval rules, or trust boundaries'),
    jsonb_build_object('key', 'no_restricted_approval', 'label', 'Never approve restricted actions', 'description', 'Companions cannot grant approvals for sensitive or critical Trust & Action steps'),
    jsonb_build_object('key', 'no_escalation_circumvention', 'label', 'Never circumvent escalation', 'description', 'Companions cannot skip mandatory approval or escalation gates'),
    jsonb_build_object('key', 'no_authority_expansion', 'label', 'Never expand authority', 'description', 'Companions cannot widen workflow scope or trust level without human approval'),
    jsonb_build_object('key', 'no_audit_suppression', 'label', 'Never suppress audit', 'description', 'Companions cannot hide, delete, or alter workflow audit metadata')
  );
$$;

create or replace function public._awobp133_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Thoughtful workflow orchestration reduces admin burden and creates space for meaningful work — sustainable pace, not pressure.',
    'connections', jsonb_build_array(
      'Sustainable pace — automate routine handoffs so humans focus on judgment',
      'Healthy collaboration — clear workflow ownership and companion support boundaries',
      'Clear expectations — every step explains what Aipify prepared and what humans decide',
      'Recognition — celebrate completed workflows and improved processes, not burnout metrics',
      'Reduced admin burden — templates and orchestration replace spreadsheet chasing',
      'Psychological safety — exceptions escalate calmly; no blame-oriented surveillance analytics'
    ),
    'self_love_route', '/app/self-love-engine',
    'boundary', 'Self Love A.76 owns reflection workflows — Workflow Orchestration stores process metadata, not wellbeing content.'
  );
$$;

create or replace function public._awobp133_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Workflow orchestration security requires visible audit, approval history, and enterprise-grade access control.',
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'audit_logs', 'label', 'Audit logs', 'description', 'workflow_executions and trust audit events — immutable, tenant-scoped'),
      jsonb_build_object('key', 'approval_histories', 'label', 'Approval histories', 'description', 'Human Oversight and Trust & Action approval records cross-linked'),
      jsonb_build_object('key', 'companion_action_histories', 'label', 'Companion action histories', 'description', 'Metadata log of companion-assisted steps — no raw content'),
      jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'description', 'Sensitive workflow administration may require 2FA — cross-link /app/settings/two-factor'),
      jsonb_build_object('key', 'rbac', 'label', 'Role-based access control', 'description', 'workflows.view and workflows.manage permissions — IRP aligned'),
      jsonb_build_object('key', 'enterprise_policy', 'label', 'Enterprise policy', 'description', 'Delegated Trust A.41 and Governance A.14 policy alignment for enterprise tenants')
    ),
    'two_factor_route', '/app/settings/two-factor',
    'security_route', '/app/settings/security',
    'boundary', 'Security requirements scaffold enterprise readiness — never store secrets or raw PII in workflow metadata.'
  );
$$;

create or replace function public._awobp133_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'action_center', 'label', 'Autonomous Execution Framework Phase 44', 'route', '/app/action-center', 'note', 'Controlled business action execution — cross-link, not duplicate'),
    jsonb_build_object('key', 'trust_actions', 'label', 'Trust & Action Engine Phase 30', 'route', '/app/approvals', 'note', 'Risk levels 0–4 — sensitive action approvals'),
    jsonb_build_object('key', 'action_hub', 'label', 'Action Hub Phase 64', 'route', '/app/actions', 'note', 'Operational action queue — distinct from multi-step orchestration'),
    jsonb_build_object('key', 'human_oversight', 'label', 'Human Oversight A.40 / Phase 131', 'route', '/app/human-oversight-engine', 'note', 'Autonomy governance and approval checkpoints'),
    jsonb_build_object('key', 'companion_workforce', 'label', 'Coordinated Companion Workforce Phase 132', 'route', '/app/companion-workforce-engine', 'note', 'Companion teams — workflow participation cross-link'),
    jsonb_build_object('key', 'companion_marketplace', 'label', 'Companion Marketplace Phase 113', 'route', '/app/companion-marketplace', 'note', 'Digital employee catalog — deployment workflows'),
    jsonb_build_object('key', 'gp_operations', 'label', 'Growth Partner Operations Phase 114', 'route', '/app/growth-partner-operations', 'note', 'Growth Partner ops workflows — never Affiliate'),
    jsonb_build_object('key', 'operations_center', 'label', 'Operations Center A.32', 'route', '/app/operations-center-foundation-engine', 'note', 'Failure visibility and cross-module coordination'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center A.5', 'route', '/app/knowledge-center', 'note', 'Knowledge retrieval and approval workflows'),
    jsonb_build_object('key', 'change_management', 'label', 'Transformation Phase 127', 'route', '/app/change-management-engine', 'note', 'Transformation communication workflows'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Sustainable pace and reduced admin burden — principle only'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-Factor Settings', 'route', '/app/settings/two-factor', 'note', 'Enterprise security cross-link for sensitive workflow admin')
  );
$$;

create or replace function public._awobp133_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates autonomous workflow orchestration internally; Unonight exercises support, commerce, and Growth Partner workflows as first external pilot.',
    'focus_areas', jsonb_build_array(
      'Support escalation and knowledge approval templates',
      'Executive briefing preparation workflows with review gates',
      'Growth Partner onboarding and certification handoffs',
      'Companion deployment checklists with Workforce 132 cross-link',
      'Commerce renewal preparation with financial approval gates',
      'Transformation communication scaffolds for internal change initiatives'
    ),
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — support, executive briefings, GP ops, companion deployment, KC approvals',
      'focus', jsonb_build_array(
        'Support triage workflow with Human Oversight gates',
        'Executive briefing template with leadership review',
        'Growth Partner certification handoff workflow',
        'Companion deployment checklist with audit trail',
        'Knowledge approval routing after internal support patterns'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce support, onboarding, and knowledge workflows',
      'focus', jsonb_build_array(
        'Support escalation for commerce operations',
        'Employee onboarding workflow with EKE cross-link',
        'Stripe subscription event awareness with renewal preparation',
        'Community engagement follow-up workflow metadata',
        'Operations Center visibility for workflow exceptions'
      )
    )
  );
$$;

create or replace function public._awobp133_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Wisdom before speed — orchestration that respects human accountability.',
    'Companions support execution; humans remain accountable for every meaningful decision.',
    'Our organization moved forward calmly — repetitive work handled, sensitive steps clearly owned.',
    'Automation supports people — never replaces judgment, ownership, or psychological safety.',
    'The Autonomous Organization Era deepens workflow orchestration — not unchecked automation.'
  );
$$;

create or replace function public._awobp133_privacy_note()
returns text language sql immutable as $$
  select 'Autonomous Workflow Orchestration Phase 133 uses metadata and aggregate analytics only — workflow definitions, execution outcomes, approval counts, and companion participation trends. Never email content, chat transcripts, orders, payment details, or individual employee surveillance.';
$$;

create or replace function public._awobp133_era_capstone_note()
returns text language sql immutable as $$
  select 'Autonomous Organization Era (131–140) — Phase 133 deepens Workflow Orchestration A.42 + Phases 40 & 86 with orchestration center, visual builder scaffold, companion participation, approval framework, exception management, and aggregate analytics. Cross-link Phase 131 Human Oversight and Phase 132 Companion Workforce. Era capstone completes at Phase 140 (planned).';
$$;

create or replace function public._awobp133_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_summary jsonb;
begin
  v_summary := public._awobp_orchestration_summary(p_organization_id);
  return jsonb_build_object(
    'active_workflows', coalesce((v_summary->>'active_workflows')::int, 0),
    'awaiting_approval', coalesce((v_summary->>'awaiting_approval')::int, 0),
    'total_executions', coalesce((v_summary->>'total_executions')::int, 0),
    'failed_executions', coalesce((v_summary->>'failed_executions')::int, 0),
    'approval_bottlenecks', coalesce((v_summary->>'approval_bottlenecks')::int, 0),
    'template_count', coalesce((v_summary->>'template_count')::int, 0),
    'orchestration_health', coalesce(v_summary->>'orchestration_health', 'unknown'),
    'supported_workflow_types', jsonb_array_length(public._awobp133_supported_workflow_types()),
    'template_library_count', jsonb_array_length(public._awobp133_template_library()),
    'privacy_note', public._awobp133_privacy_note()
  );
end; $$;

create or replace function public._awobp133_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_active int := 0;
begin
  v_active := coalesce((
    select count(*) from public.organization_workflows
    where organization_id = p_organization_id and status = 'active'
  ), 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'objectives',
      'label', 'Eight orchestration objectives — center, builder, companion, approval, exception, analytics, accountability, knowledge',
      'met', jsonb_array_length(public._awobp133_objectives()) >= 8,
      'note', null
    ),
    jsonb_build_object(
      'key', 'orchestration_center',
      'label', 'Workflow Orchestration Center — nine capabilities documented',
      'met', jsonb_array_length((public._awobp133_workflow_orchestration_center()->'capabilities')) >= 9,
      'note', null
    ),
    jsonb_build_object(
      'key', 'supported_workflow_types',
      'label', 'Supported workflow types — support through custom (11 types)',
      'met', jsonb_array_length(public._awobp133_supported_workflow_types()) >= 11,
      'note', 'Growth Partner terminology — never Affiliate.'
    ),
    jsonb_build_object(
      'key', 'visual_builder',
      'label', 'Visual workflow builder scaffold — triggers through completion rules',
      'met', jsonb_array_length((public._awobp133_visual_workflow_builder()->'elements')) >= 9,
      'note', 'No-code builder metadata — future implementation.'
    ),
    jsonb_build_object(
      'key', 'approval_framework',
      'label', 'Approval framework — mandatory through escalation gate types',
      'met', jsonb_array_length((public._awobp133_approval_framework()->'gate_types')) >= 6,
      'note', 'Route /app/approvals for sensitive actions.'
    ),
    jsonb_build_object(
      'key', 'companion_participation',
      'label', 'Companion participation — seven supportive capabilities documented',
      'met', jsonb_array_length((public._awobp133_companion_participation()->'capabilities')) >= 7,
      'note', 'Cross-link Phase 132 companion workforce.'
    ),
    jsonb_build_object(
      'key', 'companion_limitations',
      'label', 'Companion limitations — governance, approval, escalation, authority, audit boundaries',
      'met', jsonb_array_length(public._awobp133_companion_limitations()) >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'exception_management',
      'label', 'Exception management — escalate, pause, notify, context, recommend, audit',
      'met', jsonb_array_length((public._awobp133_exception_management()->'actions')) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'workflow_analytics',
      'label', 'Workflow analytics — eight aggregate metadata metrics',
      'met', jsonb_array_length((public._awobp133_workflow_analytics()->'metrics')) >= 8,
      'note', public._awobp133_privacy_note()
    ),
    jsonb_build_object(
      'key', 'security_requirements',
      'label', 'Security requirements — audit, approvals, companion history, 2FA, RBAC, enterprise policy',
      'met', jsonb_array_length((public._awobp133_security_requirements()->'requirements')) >= 6,
      'note', 'Cross-link /app/settings/two-factor.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Integration links — AEF 44, approvals, actions, Human Oversight, Workforce 132, GP 114',
      'met', jsonb_array_length(public._awobp133_integration_links()) >= 10,
      'note', null
    ),
    jsonb_build_object(
      'key', 'distinction_documented',
      'label', 'Distinction from AEF 44, Action Hub 64, Trust 30, Phases 40/86, Workforce 132, Human Oversight 131',
      'met', length(public._awobp133_distinction_note()) > 100,
      'note', 'Phase 133 extends A.42 — not a duplicate route.'
    ),
    jsonb_build_object(
      'key', 'active_workflow',
      'label', 'At least one active organization workflow for live orchestration',
      'met', v_active >= 1,
      'note', case when v_active = 0 then 'Create and activate a workflow from a template.' else null end
    )
  );
end; $$;

create or replace function public._awobp133_blueprint_block()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'phase', 133,
    'title', 'Autonomous Workflow Orchestration Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE133_AUTONOMOUS_WORKFLOW_ORCHESTRATION.md',
    'spec_doc', 'AUTONOMOUS_WORKFLOW_ORCHESTRATION_ENGINE_PHASE133.md',
    'engine_phase', 'Phase A.42 — Workflow Orchestration Engine',
    'era', 'Autonomous Organization Era (131–140)',
    'route', '/app/workflow-orchestration-engine',
    'mapping_note', 'Autonomous Organization Phase 133 extends A.42 + Phase 40 + Phase 86 — orchestration center depth with companion participation and aggregate analytics.',
    'distinction_note', public._awobp133_distinction_note(),
    'mission', public._awobp133_mission(),
    'philosophy', public._awobp133_philosophy(),
    'abos_principle', public._awobp133_abos_principle(),
    'vision', public._awobp133_vision(),
    'objectives', public._awobp133_objectives(),
    'workflow_orchestration_center', public._awobp133_workflow_orchestration_center(),
    'supported_workflow_types', public._awobp133_supported_workflow_types(),
    'visual_workflow_builder', public._awobp133_visual_workflow_builder(),
    'workflow_triggers', public._awobp133_workflow_triggers(),
    'approval_framework', public._awobp133_approval_framework(),
    'companion_participation', public._awobp133_companion_participation(),
    'exception_management', public._awobp133_exception_management(),
    'workflow_analytics', public._awobp133_workflow_analytics(),
    'template_library', public._awobp133_template_library(),
    'companion_limitations', public._awobp133_companion_limitations(),
    'self_love_connection', public._awobp133_self_love_connection(),
    'security_requirements', public._awobp133_security_requirements(),
    'dogfooding', public._awobp133_dogfooding(),
    'integration_links', public._awobp133_integration_links(),
    'vision_phrases', public._awobp133_vision_phrases(),
    'privacy_note', public._awobp133_privacy_note(),
    'era_capstone_note', public._awobp133_era_capstone_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Optional Phase 133 template seeds (metadata only — per-key insert)
-- ---------------------------------------------------------------------------
create or replace function public._awobp133_seed_templates()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.workflow_templates (template_key, template_name, description, category, default_trust_level, steps)
  select v.key, v.name, v.desc, v.cat, v.trust, v.steps
  from (values
    (
      'executive_briefing',
      'Executive Briefing',
      'Prepare executive briefing materials with leadership review gate before distribution.',
      'executive',
      'elevated',
      '[
        {"trigger_type":"manual","action_type":"generate_draft","approval_required":false,"step_order":1},
        {"trigger_type":"approval_requested","action_type":"request_approval","approval_required":true,"approver_role":"administrator","step_order":2},
        {"trigger_type":"approval_requested","action_type":"send_notification","approval_required":false,"step_order":3}
      ]'::jsonb
    ),
    (
      'companion_deployment',
      'Companion Deployment',
      'Checklist for companion activation with workforce coordination and audit trail.',
      'companion',
      'standard',
      '[
        {"trigger_type":"manual","action_type":"create_task","approval_required":false,"step_order":1},
        {"trigger_type":"approval_requested","action_type":"request_approval","approval_required":true,"approver_role":"administrator","step_order":2},
        {"trigger_type":"manual","action_type":"update_status","approval_required":false,"step_order":3}
      ]'::jsonb
    ),
    (
      'gp_onboarding',
      'Growth Partner Onboarding',
      'Growth Partner welcome, certification tasks, and ecosystem ops handoffs.',
      'growth_partner',
      'standard',
      '[
        {"trigger_type":"manual","action_type":"create_task","approval_required":false,"step_order":1},
        {"trigger_type":"overdue_task","action_type":"send_notification","approval_required":false,"step_order":2},
        {"trigger_type":"approval_requested","action_type":"request_approval","approval_required":true,"approver_role":"manager","step_order":3}
      ]'::jsonb
    )
  ) as v(key, name, desc, cat, trust, steps)
  where not exists (
    select 1 from public.workflow_templates t where t.template_key = v.key
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve ALL A.42 + Phase 40 + Phase 86 fields; append Phase 133
-- ---------------------------------------------------------------------------
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
    ),
    'implementation_blueprint_phase133', jsonb_build_object(
      'phase', 133,
      'title', 'Autonomous Workflow Orchestration Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE133_AUTONOMOUS_WORKFLOW_ORCHESTRATION.md',
      'spec_doc', 'AUTONOMOUS_WORKFLOW_ORCHESTRATION_ENGINE_PHASE133.md',
      'engine_phase', 'Phase A.42 — Workflow Orchestration Engine',
      'era', 'Autonomous Organization Era (131–140)',
      'route', '/app/workflow-orchestration-engine'
    ),
    'awobp133_mission', public._awobp133_mission(),
    'awobp133_abos_principle', public._awobp133_abos_principle(),
    'awobp133_engagement_summary', public._awobp133_engagement_summary(v_org_id),
    'awobp133_note', 'Autonomous Workflow Orchestration Engine (Autonomous Organization Phase 133) — era depth on A.42 + Phases 40 & 86 with companion participation and aggregate analytics.',
    'autonomous_workflow_orchestration_blueprint', public._awobp133_blueprint_block() || jsonb_build_object(
      'success_criteria', public._awobp133_success_criteria(v_org_id),
      'engagement_summary', public._awobp133_engagement_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Dashboard RPC — preserve ALL A.42 + Phase 40 + Phase 86 fields; append Phase 133
-- ---------------------------------------------------------------------------
create or replace function public.get_workflow_orchestration_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('workflows.view');
  v_org_id := public._mta_require_organization();
  perform public._woe_seed_templates();
  perform public._awobp133_seed_templates();

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
    ),
    'implementation_blueprint_phase133', jsonb_build_object(
      'phase', 133,
      'title', 'Autonomous Workflow Orchestration Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE133_AUTONOMOUS_WORKFLOW_ORCHESTRATION.md',
      'spec_doc', 'AUTONOMOUS_WORKFLOW_ORCHESTRATION_ENGINE_PHASE133.md',
      'engine_phase', 'Phase A.42 — Workflow Orchestration Engine',
      'era', 'Autonomous Organization Era (131–140)',
      'route', '/app/workflow-orchestration-engine',
      'mapping_note', 'Autonomous Organization Phase 133 extends A.42 + Phase 40 + Phase 86 — orchestration center, companion participation, approval framework, exception management, aggregate analytics.'
    ),
    'autonomous_workflow_orchestration_engine_note', 'Autonomous Workflow Orchestration Engine (Autonomous Organization Phase 133) — era depth on Workflow Orchestration A.42 with companion-supported execution and human accountability.',
    'autonomous_organization_era_note', public._awobp133_era_capstone_note(),
    'awobp133_distinction_note', public._awobp133_distinction_note(),
    'awobp133_mission', public._awobp133_mission(),
    'awobp133_philosophy', public._awobp133_philosophy(),
    'awobp133_abos_principle', public._awobp133_abos_principle(),
    'awobp133_vision', public._awobp133_vision(),
    'awobp133_objectives', public._awobp133_objectives(),
    'awobp133_workflow_orchestration_center', public._awobp133_workflow_orchestration_center(),
    'awobp133_supported_workflow_types', public._awobp133_supported_workflow_types(),
    'awobp133_visual_workflow_builder', public._awobp133_visual_workflow_builder(),
    'awobp133_workflow_triggers', public._awobp133_workflow_triggers(),
    'awobp133_approval_framework', public._awobp133_approval_framework(),
    'awobp133_companion_participation', public._awobp133_companion_participation(),
    'awobp133_exception_management', public._awobp133_exception_management(),
    'awobp133_workflow_analytics', public._awobp133_workflow_analytics(),
    'awobp133_template_library', public._awobp133_template_library(),
    'awobp133_companion_limitations', public._awobp133_companion_limitations(),
    'awobp133_self_love_connection', public._awobp133_self_love_connection(),
    'awobp133_security_requirements', public._awobp133_security_requirements(),
    'awobp133_integration_links', public._awobp133_integration_links(),
    'awobp133_dogfooding', public._awobp133_dogfooding(),
    'awobp133_engagement_summary', public._awobp133_engagement_summary(v_org_id),
    'awobp133_success_criteria', public._awobp133_success_criteria(v_org_id),
    'awobp133_vision_phrases', public._awobp133_vision_phrases(),
    'awobp133_privacy_note', public._awobp133_privacy_note(),
    'autonomous_workflow_orchestration_blueprint', public._awobp133_blueprint_block() || jsonb_build_object(
      'success_criteria', public._awobp133_success_criteria(v_org_id),
      'engagement_summary', public._awobp133_engagement_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._awobp133_distinction_note() to authenticated;
grant execute on function public._awobp133_mission() to authenticated;
grant execute on function public._awobp133_philosophy() to authenticated;
grant execute on function public._awobp133_abos_principle() to authenticated;
grant execute on function public._awobp133_vision() to authenticated;
grant execute on function public._awobp133_objectives() to authenticated;
grant execute on function public._awobp133_workflow_orchestration_center() to authenticated;
grant execute on function public._awobp133_supported_workflow_types() to authenticated;
grant execute on function public._awobp133_visual_workflow_builder() to authenticated;
grant execute on function public._awobp133_workflow_triggers() to authenticated;
grant execute on function public._awobp133_approval_framework() to authenticated;
grant execute on function public._awobp133_companion_participation() to authenticated;
grant execute on function public._awobp133_exception_management() to authenticated;
grant execute on function public._awobp133_workflow_analytics() to authenticated;
grant execute on function public._awobp133_template_library() to authenticated;
grant execute on function public._awobp133_companion_limitations() to authenticated;
grant execute on function public._awobp133_self_love_connection() to authenticated;
grant execute on function public._awobp133_security_requirements() to authenticated;
grant execute on function public._awobp133_integration_links() to authenticated;
grant execute on function public._awobp133_dogfooding() to authenticated;
grant execute on function public._awobp133_vision_phrases() to authenticated;
grant execute on function public._awobp133_privacy_note() to authenticated;
grant execute on function public._awobp133_era_capstone_note() to authenticated;
grant execute on function public._awobp133_engagement_summary(uuid) to authenticated;
grant execute on function public._awobp133_success_criteria(uuid) to authenticated;
grant execute on function public._awobp133_blueprint_block() to authenticated;
grant execute on function public._awobp133_seed_templates() to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'autonomous-workflow-orchestration-blueprint-phase133', 'Autonomous Workflow Orchestration (Autonomous Organization Phase 133)',
  'Autonomous Organization Era depth on Workflow Orchestration A.42 + Phases 40 & 86 — orchestration center, visual builder scaffold, companion participation, approval framework, exception management, aggregate analytics, and human accountability.',
  'authenticated', 133
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'autonomous-workflow-orchestration-blueprint-phase133' and tenant_id is null
);
