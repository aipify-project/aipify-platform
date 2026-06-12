-- Implementation Blueprint Phase 98 — Trust, Ethics & Human Governance Engine
-- Extends AI Ethics & Responsible Use Engine (Phase A.46) at /app/ai-ethics-responsible-use-engine.
-- Layered on Phase 54 (_escgbp_*) and Phase 65 (_cecbp_*) — ALL prior fields preserved.
-- Distinct from Aipify Constitution & Core Principles repo Phase 98 at /app/constitution.
-- No new tables — metadata helpers and dashboard/card RPC extensions only.

-- ---------------------------------------------------------------------------
-- Distinction & static blueprint helpers (_tehgbp98_*)
-- ---------------------------------------------------------------------------

create or replace function public._tehgbp98_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 98 — Trust, Ethics & Human Governance Engine extends AI Ethics & Responsible Use Engine Phase A.46 at /app/ai-ethics-responsible-use-engine, layered on Phase 54 (_escgbp_*) companion ethics and Phase 65 (_cecbp_*) council scaffolds — deploy and govern Aipify responsibly with human oversight. Distinct from Aipify Constitution & Core Principles repo Phase 98 at /app/constitution (20260627000000_aipify_constitution_core_principles_phase98.sql — cross-link only, never duplicate constitution tables). Distinct from Governance & Policy A.14 (tenant policies), Trust Engine Phase 76 (/app/trust), and Trust & Action Phase 30 (/app/approvals — execution gates). Engine helpers: _aerue_* (A.46), _escgbp_* (Phase 54), _cecbp_* (Phase 65), _tehgbp98_* (Blueprint Phase 98). Metadata only — governance scaffold, not surveillance.';
$$;

create or replace function public._tehgbp98_mission()
returns text language sql immutable as $$
  select 'Deploy and use Aipify responsibly — ethical awareness, human oversight, and governance that scales with capability.';
$$;

create or replace function public._tehgbp98_philosophy()
returns text language sql immutable as $$
  select 'Technology serves people. More capability requires more stewardship. Ethics by design — not as an afterthought.';
$$;

create or replace function public._tehgbp98_vision()
returns text language sql immutable as $$
  select 'We trust Aipify because we understand it, govern it thoughtfully, and use it in ways that reflect our values.';
$$;

create or replace function public._tehgbp98_abos_principle()
returns text language sql immutable as $$
  select 'The future depends on the wisdom of how people choose to use intelligent systems — Aipify Business Operating System (ABOS) earns trust through transparent governance, human agency, and values-aligned deployment.';
$$;

create or replace function public._tehgbp98_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'responsible_aipify_practices', 'label', 'Responsible Aipify practices', 'description', 'Document and classify how Aipify is used across the organization — metadata summaries only'),
    jsonb_build_object('key', 'human_oversight', 'label', 'Human oversight', 'description', 'Approval, escalation, and review thresholds for medium+ risk use cases — humans decide outcomes'),
    jsonb_build_object('key', 'governance_transparency', 'label', 'Governance transparency', 'description', 'Explainability, audit trails, and scheduled ethics reviews — not one-time approval'),
    jsonb_build_object('key', 'values_aligned_deployment', 'label', 'Values-aligned deployment', 'description', 'Cross-link Purpose & Values Phase 95 and Human Values Charter — capabilities reflect stated values'),
    jsonb_build_object('key', 'ethical_review_practices', 'label', 'Ethical review practices', 'description', 'Routine examination of use cases, policy exceptions, and companion behaviors'),
    jsonb_build_object('key', 'trust_stewardship', 'label', 'Trust stewardship', 'description', 'Privacy principles, dignity preservation, and accountability as Aipify capability grows')
  );
$$;

create or replace function public._tehgbp98_ethical_questions()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Ethical questions — every deployment and use case examined through judgment, trust, dignity, and consequence lenses.',
    'questions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'human_judgment', 'question', 'Are we deploying Aipify in ways that support human judgment — not replace it?'),
      jsonb_build_object('emoji', '🌹', 'key', 'trust_impact', 'question', 'Does our use of Aipify increase trust — explainable, optional, honest about uncertainty?'),
      jsonb_build_object('emoji', '❤️', 'key', 'dignity_autonomy', 'question', 'Does our governance respect dignity and autonomy — can people decline without friction?'),
      jsonb_build_object('emoji', '🔔', 'key', 'unintended_consequences', 'question', 'What unintended consequences might emerge — hidden automation, surveillance feel, accountability gaps?')
    )
  );
$$;

create or replace function public._tehgbp98_governance_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Governance principles — transparent approval, escalation, human review thresholds, roles, and audit for responsible Aipify practices.',
    'elements', jsonb_build_array(
      jsonb_build_object('key', 'approval_required', 'label', 'Explicit approval', 'description', 'High-risk and sensitive actions require documented approval before execution'),
      jsonb_build_object('key', 'escalation', 'label', 'Escalation paths', 'description', 'Low confidence or uncertain risk triggers escalation — never silent proceed'),
      jsonb_build_object('key', 'human_review_thresholds', 'label', 'Human review thresholds', 'description', 'Medium+ risk requires human review; critical (level 4) prohibited for AI via /app/approvals'),
      jsonb_build_object('key', 'roles', 'label', 'Ethics steward roles', 'description', 'Owner, admin, and designated ethics reviewers — least privilege, auditable decisions'),
      jsonb_build_object('key', 'audit', 'label', 'Full audit trail', 'description', 'Policy exceptions, use case changes, and ethics events logged — metadata only')
    ),
    'trust_action_route', '/app/approvals',
    'trust_action_phase', 30,
    'human_oversight_route', '/app/human-oversight-engine',
    'human_oversight_phase', 'A.40'
  );
$$;

create or replace function public._tehgbp98_human_in_the_loop()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Human in the loop — Aipify prepares and explains; humans decide for employment, legal, financial, sensitive communications, and strategic decisions.',
    'domains', jsonb_build_array(
      jsonb_build_object('key', 'employment', 'label', 'Employment decisions', 'description', 'Hiring, termination, performance ratings — human-only; Aipify may prepare summaries only', 'emoji', '🦉'),
      jsonb_build_object('key', 'legal', 'label', 'Legal matters', 'description', 'Legal advice, contract commitments, compliance determinations — human confirmation required', 'emoji', '🔔'),
      jsonb_build_object('key', 'financial', 'label', 'Financial commitments', 'description', 'Payments, refunds, financial obligations — explicit approval via Trust & Action', 'emoji', '🔔'),
      jsonb_build_object('key', 'sensitive_comms', 'label', 'Sensitive communications', 'description', 'HR discussions, personal messages, vulnerable contexts — never auto-send', 'emoji', '❤️'),
      jsonb_build_object('key', 'strategic', 'label', 'Strategic decisions', 'description', 'Major business direction, organizational restructuring — Aipify informs, leaders decide', 'emoji', '🦉')
    ),
    'critical_note', 'Trust & Action level 4 (critical) actions are prohibited for AI — human confirmation required.',
    'approvals_route', '/app/approvals'
  );
$$;

create or replace function public._tehgbp98_companion_transparency()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion transparency — Aipify explains why, what informed the suggestion, limitations, and uncertainty.',
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'why', 'label', 'Why', 'description', 'Explain the reason a recommendation or action is suggested'),
      jsonb_build_object('key', 'what_info', 'label', 'What information', 'description', 'Disclose metadata sources that informed the suggestion — no hidden context'),
      jsonb_build_object('key', 'limitations', 'label', 'Limitations', 'description', 'Honest about what Aipify cannot know, decide, or guarantee'),
      jsonb_build_object('key', 'uncertainty', 'label', 'Uncertainty', 'description', 'Confidence levels, escalation paths, and option to decline without friction')
    ),
    'companion_identity_route', '/app/companion-identity-engine',
    'companion_identity_phase', 'A.84'
  );
$$;

create or replace function public._tehgbp98_ethical_review_practices()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Ethical review practices — documented use cases, scheduled reviews, audited exceptions, and metadata-only engagement summaries.',
    'practices', jsonb_build_array(
      jsonb_build_object('key', 'use_case_registry', 'label', 'Use case registry', 'description', 'Every Aipify use case documented and risk-classified — A.46 ethics registry'),
      jsonb_build_object('key', 'scheduled_reviews', 'label', 'Scheduled ethics reviews', 'description', 'Periodic re-examination — not one-time approval; overdue reviews flagged'),
      jsonb_build_object('key', 'policy_exceptions', 'label', 'Audited policy exceptions', 'description', 'Exceptions require justification, approval, and immutable audit log entry'),
      jsonb_build_object('key', 'companion_ethics_cross_link', 'label', 'Companion ethics cross-link', 'description', 'Phase 54 companion ethics and Phase 65 council capability review — layered, not duplicate'),
      jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only summaries', 'description', 'Engagement dashboards show aggregate counts — no surveillance of individual behavior')
    ),
    'review_frequency_note', 'Default review frequency from organization_ethics_policies.review_frequency_days — tenant-controlled.'
  );
$$;

create or replace function public._tehgbp98_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Warm, transparent companion guidance for governance moments — review and decline paths always available.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'accountability_check', 'prompt', 'Before approving this use case — who remains accountable for the outcome?', 'consideration', 'Human judgment preserved — Aipify prepares context only'),
      jsonb_build_object('emoji', '🌹', 'key', 'draft_review', 'prompt', 'Aipify can prepare this draft — would you like to review before anything is sent?', 'consideration', 'No hidden automation — explicit review step'),
      jsonb_build_object('emoji', '❤️', 'key', 'sensitive_context', 'prompt', 'This touches sensitive context — human confirmation is required; Aipify will not proceed alone.', 'consideration', 'Dignity and autonomy — decline without guilt'),
      jsonb_build_object('emoji', '🔔', 'key', 'moderate_confidence', 'prompt', 'Confidence is moderate — escalation to your ethics reviewer is recommended.', 'consideration', 'Honest uncertainty — escalation over silent proceed')
    ),
    'boundary_note', 'Companion surfaces governance guidance — never implies surveillance or removes human accountability.'
  );
$$;

create or replace function public._tehgbp98_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love A.76 influences governance culture — humility, reflection, and sustainable pace when values are at stake.',
    'spec_quote', 'Technology should support humanity, not diminish it — Aipify exists to augment people, not replace their judgment or worth.',
    'practices', jsonb_build_array(
      'Humility — willingness to slow down and reconsider when ethics are uncertain',
      'Reflection — routine ethical pause before expanding Aipify use cases',
      'Sustainable pace — governance is stewardship, not checkbox compliance',
      'No perfectionism — honest progress over rushed deployment',
      'Technology supports humanity — never dignity tradeoffs for efficiency'
    ),
    'route', '/app/self-love-engine',
    'phase', 'A.76'
  );
$$;

create or replace function public._tehgbp98_leadership_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership sets the tone for responsible Aipify deployment — visible policies, approval workflows, and values-aligned decisions.',
    'expectations', jsonb_build_array(
      'Document and communicate ethics policies — transparency builds trust',
      'Model human-in-the-loop behavior for high-risk domains',
      'Support ethics reviewers with time and authority — not rubber-stamp approval',
      'Cross-link executive briefings with governance health — metadata summaries only',
      'Willingness to restrict or pause Aipify use when values are at stake'
    ),
    'executive_route', '/app/executive',
    'command_center_route', '/app/command-center',
    'governance_policy_route', '/app/governance-policy-engine',
    'governance_policy_phase', 'A.14'
  );
$$;

create or replace function public._tehgbp98_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust grows when people understand how Aipify works, who governs it, and how to challenge or decline suggestions.',
    'users_should_know', jsonb_build_array(
      'Every approved use case is documented with risk classification and review schedule',
      'Critical (level 4) actions remain prohibited for AI — human-only via /app/approvals',
      'Policy exceptions require audited justification — no silent overrides',
      'Companion transparency — why, what info, limitations, and uncertainty disclosed',
      'Metadata-only engagement summaries — no surveillance of individual behavior'
    ),
    'operators_should_understand', jsonb_build_array(
      'Phase 98 complements Phase 54 companion ethics and Phase 65 council — layered governance on A.46',
      'Distinct from Constitution repo Phase 98 — founding principles at /app/constitution, cross-link only',
      'Trust Engine Phase 76 handles tenant trust transparency — cross-link /app/trust',
      'Workflow Orchestration Phase 86 autonomy tiers require ethics alignment — cross-link',
      'Organizational Memory Phase 94 permissions govern what wisdom persists — cross-link'
    ),
    'trust_engine_route', '/app/trust',
    'trust_engine_phase', 76,
    'approvals_route', '/app/approvals',
    'approvals_phase', 30
  );
$$;

create or replace function public._tehgbp98_privacy_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Privacy principles — never hidden automation, manipulation, surveillance, removed accountability, or dignity tradeoffs.',
    'never', jsonb_build_array(
      'Hidden automation without disclosure',
      'Manipulation or pressure framing',
      'Surveillance of individual behavior',
      'Removing human accountability',
      'Dignity tradeoffs for efficiency'
    ),
    'always', jsonb_build_array(
      'Metadata-first storage — patterns and outcomes, not raw operational records',
      'Explicit approval for sensitive domains',
      'Explainability by default for approved use cases',
      'User control — dismiss, modify, decline without friction',
      'Audit trail for exceptions and high-risk approvals'
    ),
    'security_trust_route', '/app/security-trust-engine',
    'security_trust_phase', 'A.18',
    'compliance_route', '/app/compliance-regulatory-readiness-engine',
    'compliance_phase', 'A.29'
  );
$$;

create or replace function public._tehgbp98_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates Trust, Ethics & Human Governance internally before external rollout.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — governance for Meeting Companion, Sales Expert, Executive Companion, Autonomous Ops, and Org Memory',
      'focus', jsonb_build_array(
        'Meeting Companion A.61 — approved memory capture only, no auto-store from meetings',
        'Sales Expert governance — field metadata into ethics registry, no raw customer content',
        'Executive Companion — command center briefing transparency and approval paths',
        'Autonomous Ops approvals — /app/action-center level gates aligned with Trust & Action',
        'Organizational Memory permissions — Phase 94 governed retention and access controls'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — ethics use case registry and trust trend review',
      'focus', jsonb_build_array(
        'Commerce support use cases — ethics registry and human oversight validation',
        'Trust trend review alongside Phase 54 governance summary',
        'Workflow automation Phase 86 — autonomy tier alignment with human-in-the-loop domains',
        'Purpose & Values Phase 95 cross-link — values-aligned deployment exercise'
      )
    )
  );
$$;

create or replace function public._tehgbp98_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'constitution_phase98', 'label', 'Aipify Constitution (repo Phase 98)', 'route', '/app/constitution', 'note', 'Founding principles — cross-link only, never duplicate constitution tables'),
    jsonb_build_object('key', 'ethics_phase54', 'label', 'Ethics & Companion Governance Phase 54', 'route', '/app/ai-ethics-responsible-use-engine', 'note', 'Layered foundation — _escgbp_* companion ethics scaffolds preserved'),
    jsonb_build_object('key', 'council_phase65', 'label', 'Companion Evolution Council Phase 65', 'route', '/app/ai-ethics-responsible-use-engine', 'note', 'Values-driven capability review — _cecbp_* council scaffolds preserved'),
    jsonb_build_object('key', 'governance_policy', 'label', 'Governance & Policy A.14', 'route', '/app/governance-policy-engine', 'note', 'Tenant policies — distinct from ethics use case registry'),
    jsonb_build_object('key', 'trust_actions', 'label', 'Trust & Action Phase 30', 'route', '/app/approvals', 'note', 'Risk levels 0–4 — critical prohibited for AI'),
    jsonb_build_object('key', 'trust_engine', 'label', 'Trust Engine Phase 76', 'route', '/app/trust', 'note', 'Tenant trust transparency — cross-link'),
    jsonb_build_object('key', 'human_oversight', 'label', 'Human Oversight A.40', 'route', '/app/human-oversight-engine', 'note', 'Operational oversight workflows'),
    jsonb_build_object('key', 'compliance', 'label', 'Compliance A.29', 'route', '/app/compliance-regulatory-readiness-engine', 'note', 'Regulatory readiness alignment'),
    jsonb_build_object('key', 'security_trust', 'label', 'Security & Trust A.18', 'route', '/app/security-trust-engine', 'note', 'Security transparency and trust policies'),
    jsonb_build_object('key', 'workflow_orchestration', 'label', 'Workflow Orchestration Phase 86', 'route', '/app/workflow-orchestration-engine', 'note', 'Autonomous ops approval tiers — cross-link'),
    jsonb_build_object('key', 'org_memory', 'label', 'Organizational Memory Phase 94', 'route', '/app/organizational-memory-engine', 'note', 'Governed memory permissions — cross-link'),
    jsonb_build_object('key', 'meeting_companion', 'label', 'Meeting Companion A.61', 'route', '/app/meeting-collaboration-intelligence-engine', 'note', 'Meeting metadata governance — approved capture only'),
    jsonb_build_object('key', 'inclusion_humanity', 'label', 'Inclusion & Humanity A.83', 'route', '/app/inclusion-humanity-engine', 'note', 'Human Values Charter operationalized — communication conduct'),
    jsonb_build_object('key', 'purpose_values', 'label', 'Purpose & Values Phase 95', 'route', '/app/purpose-values-engine', 'note', 'Values-aligned deployment cross-link'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Humility and reflection in governance culture'),
    jsonb_build_object('key', 'sales_expert', 'label', 'Sales Expert OS A.95', 'route', '/app/sales-expert-engine', 'note', 'Field governance metadata — no raw customer content'),
    jsonb_build_object('key', 'action_center', 'label', 'Autonomous Execution Framework', 'route', '/app/action-center', 'note', 'Autonomous ops approval gates — Business+ only')
  );
$$;

create or replace function public._tehgbp98_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We trust Aipify because we understand it, govern it thoughtfully, and use it in ways that reflect our values.',
    '🦉 Technology serves people — more capability requires more stewardship.',
    '🌹 Governance transparency strengthens long-term trust.',
    '❤️ Humans decide — Aipify informs, prepares, and explains.',
    '🔔 Ethics by design — not as an afterthought.',
    'The future depends on the wisdom of how people choose to use intelligent systems.',
    'Never hidden automation, manipulation, or dignity tradeoffs for efficiency.',
    'Responsible Aipify practices — documented, reviewed, and values-aligned.'
  );
$$;

-- ---------------------------------------------------------------------------
-- Live engagement summary (metadata from A.46 tables + audit counts)
-- ---------------------------------------------------------------------------

create or replace function public._tehgbp98_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_governance jsonb;
  v_council jsonb;
  v_approved int := 0;
  v_proposed int := 0;
  v_overdue int := 0;
  v_high_risk int := 0;
  v_ethics_audit_events int := 0;
begin
  v_governance := public._escgbp_governance_summary(p_organization_id);
  v_council := public._cecbp_engagement_summary(p_organization_id);
  v_approved := coalesce((v_governance->>'approved_use_cases')::int, 0);
  v_proposed := coalesce((v_governance->>'proposed_use_cases')::int, 0);
  v_overdue := coalesce((v_governance->>'overdue_reviews')::int, 0);
  v_high_risk := coalesce((v_governance->>'high_risk_active')::int, 0);

  select count(*) into v_ethics_audit_events
  from public.organization_audit_logs
  where organization_id = p_organization_id
    and entity_type = 'ai_ethics'
    and created_at > now() - interval '90 days';

  return jsonb_build_object(
    'approved_use_cases', v_approved,
    'proposed_use_cases', v_proposed,
    'overdue_ethics_reviews', v_overdue,
    'high_risk_active', v_high_risk,
    'recent_ethics_audit_events', coalesce(v_ethics_audit_events, 0),
    'governance_objectives_count', jsonb_array_length(public._tehgbp98_objectives()),
    'ethical_questions_count', jsonb_array_length(public._tehgbp98_ethical_questions()->'questions'),
    'human_in_the_loop_domains', jsonb_array_length(public._tehgbp98_human_in_the_loop()->'domains'),
    'governance_health', v_governance->>'governance_health',
    'council_engagement_summary', v_council,
    'privacy_note', 'Aggregate use case counts and ethics audit event counts only — no operational content or PII.',
    'summary_text', format(
      'Trust & ethics governance: %s approved use cases, %s proposed, %s overdue reviews, %s high-risk active, %s ethics audit events (90d).',
      v_approved, v_proposed, v_overdue, v_high_risk, coalesce(v_ethics_audit_events, 0)
    )
  );
end; $$;

create or replace function public._tehgbp98_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_approved int := 0;
begin
  v_engagement := public._tehgbp98_engagement_summary(p_organization_id);
  v_approved := coalesce((v_engagement->>'approved_use_cases')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'objectives_documented',
      'label', 'Six governance objectives documented — responsible practices through trust stewardship',
      'met', jsonb_array_length(public._tehgbp98_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'ethical_questions',
      'label', 'Ethical questions — judgment, trust, dignity, consequences 🦉🌹❤️🔔',
      'met', jsonb_array_length(public._tehgbp98_ethical_questions()->'questions') = 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'governance_principles',
      'label', 'Governance principles — approval, escalation, thresholds, roles, audit',
      'met', jsonb_array_length(public._tehgbp98_governance_principles()->'elements') >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'human_in_the_loop',
      'label', 'Human in the loop — employment, legal, financial, sensitive comms, strategic',
      'met', jsonb_array_length(public._tehgbp98_human_in_the_loop()->'domains') = 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'companion_transparency',
      'label', 'Companion transparency — why, what info, limitations, uncertainty',
      'met', jsonb_array_length(public._tehgbp98_companion_transparency()->'requirements') = 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'privacy_principles',
      'label', 'Privacy principles — no hidden automation, manipulation, surveillance, or dignity tradeoffs',
      'met', jsonb_array_length(public._tehgbp98_privacy_principles()->'never') >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'ethical_review_practices',
      'label', 'Ethical review practices documented — registry, scheduled reviews, audited exceptions',
      'met', jsonb_array_length(public._tehgbp98_ethical_review_practices()->'practices') >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'values_aligned_governance',
      'label', 'Values-aligned governance framing — ABOS principle and vision documented',
      'met', length(public._tehgbp98_abos_principle()) > 50 and length(public._tehgbp98_vision()) > 30,
      'note', 'Future depends on wisdom of how people choose to use intelligent systems.'
    ),
    jsonb_build_object(
      'key', 'approved_use_cases',
      'label', 'At least one approved use case supports ethics registry',
      'met', v_approved >= 1,
      'note', case when v_approved = 0 then 'Propose and approve a use case via A.46 ethics workflow.' else null end
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links to Constitution Phase 98, Phase 54, Phase 65, Trust, Approvals, Purpose & Values',
      'met', jsonb_array_length(public._tehgbp98_integration_links()) >= 14,
      'note', null
    ),
    jsonb_build_object(
      'key', 'distinction_documented',
      'label', 'Distinction from Constitution repo Phase 98, Governance A.14, Trust Engine Phase 76',
      'met', length(public._tehgbp98_distinction_note()) > 100,
      'note', 'Blueprint Phase 98 trust & ethics governance complements Phase 54 and Phase 65 on A.46.'
    )
  );
end; $$;

create or replace function public._tehgbp98_blueprint_block()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'phase', 98,
    'title', 'Trust, Ethics & Human Governance Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE98_TRUST_ETHICS_HUMAN_GOVERNANCE.md',
    'engine_phase', 'Phase A.46 — AI Ethics & Responsible Use Engine',
    'route', '/app/ai-ethics-responsible-use-engine',
    'mapping_note', 'Deploy and govern Aipify responsibly — human oversight, governance transparency, and values-aligned practices layered on Phase 54 and Phase 65.',
    'mission', public._tehgbp98_mission(),
    'philosophy', public._tehgbp98_philosophy(),
    'vision', public._tehgbp98_vision(),
    'abos_principle', public._tehgbp98_abos_principle(),
    'objectives', public._tehgbp98_objectives(),
    'ethical_questions', public._tehgbp98_ethical_questions(),
    'governance_principles', public._tehgbp98_governance_principles(),
    'human_in_the_loop', public._tehgbp98_human_in_the_loop(),
    'companion_transparency', public._tehgbp98_companion_transparency(),
    'ethical_review_practices', public._tehgbp98_ethical_review_practices(),
    'companion_guidance', public._tehgbp98_companion_guidance(),
    'self_love_connection', public._tehgbp98_self_love_connection(),
    'leadership_connection', public._tehgbp98_leadership_connection(),
    'trust_connection', public._tehgbp98_trust_connection(),
    'privacy_principles', public._tehgbp98_privacy_principles(),
    'dogfooding', public._tehgbp98_dogfooding(),
    'integration_links', public._tehgbp98_integration_links(),
    'vision_phrases', public._tehgbp98_vision_phrases(),
    'distinction_note', public._tehgbp98_distinction_note(),
    'constitution_cross_link', jsonb_build_object(
      'label', 'Aipify Constitution & Core Principles (repo Phase 98)',
      'route', '/app/constitution',
      'note', 'Founding principles — cross-link only, never duplicate constitution storage'
    )
  );
$$;

-- ---------------------------------------------------------------------------
-- Card RPC — preserve Phase 54 + Phase 65 + A.46; append Phase 98 metadata
-- ---------------------------------------------------------------------------

create or replace function public.get_ai_ethics_responsible_use_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_summary jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._aerue_ensure_policy(v_org_id);
  perform public._aerue_seed_use_cases(v_org_id);
  v_summary := public._escgbp_governance_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'approved_use_cases', coalesce((v_summary->>'approved_use_cases')::int, 0),
    'proposed_reviews', coalesce((v_summary->>'proposed_use_cases')::int, 0),
    'restricted_count', coalesce((v_summary->>'restricted_use_cases')::int, 0),
    'philosophy', 'Responsible Aipify practices — documented use cases with human oversight and companion ethics transparency.',
    'implementation_blueprint_phase54', jsonb_build_object(
      'phase', 54,
      'title', 'Ethics, Safety & Companion Governance Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE54_ETHICS_SAFETY_COMPANION_GOVERNANCE.md',
      'engine_phase', 'Phase A.46 — AI Ethics & Responsible Use Engine',
      'route', '/app/ai-ethics-responsible-use-engine'
    ),
    'implementation_blueprint_phase65', jsonb_build_object(
      'phase', 65,
      'title', 'Companion Evolution Council Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE65_COMPANION_EVOLUTION_COUNCIL.md',
      'engine_phase', 'Phase A.46 — AI Ethics & Responsible Use Engine',
      'route', '/app/ai-ethics-responsible-use-engine',
      'mapping_note', 'Council framework for values-driven capability review — layered on Phase 54.'
    ),
    'implementation_blueprint_phase98', jsonb_build_object(
      'phase', 98,
      'title', 'Trust, Ethics & Human Governance Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE98_TRUST_ETHICS_HUMAN_GOVERNANCE.md',
      'engine_phase', 'Phase A.46 — AI Ethics & Responsible Use Engine',
      'route', '/app/ai-ethics-responsible-use-engine',
      'mapping_note', 'Deploy and govern Aipify responsibly — human oversight and values-aligned practices.'
    ),
    'companion_governance_phase', 54,
    'companion_evolution_council_phase', 65,
    'trust_ethics_human_governance_phase', 98,
    'escgbp_abos_principle', public._escgbp_blueprint_abos_principle(),
    'cecbp_abos_principle', public._cecbp_abos_principle(),
    'tehgbp98_abos_principle', public._tehgbp98_abos_principle(),
    'governance_summary', v_summary,
    'council_engagement_summary', public._cecbp_engagement_summary(v_org_id),
    'trust_ethics_governance_engagement_summary', public._tehgbp98_engagement_summary(v_org_id),
    'governance_health', v_summary->>'governance_health',
    'critical_prohibition_note', 'Trust & Action level 4 (critical) actions are prohibited for AI — human confirmation required.',
    'blueprint_note', 'Ethics, Safety & Companion Governance (Phase 54) + Companion Evolution Council (Phase 65) + Trust, Ethics & Human Governance (Phase 98) — extends A.46 with responsible deployment framing.',
    'council_vision_phrase', 'Aipify evolves thoughtfully.',
    'trust_governance_vision_phrase', public._tehgbp98_vision(),
    'trust_ethics_human_governance_blueprint', public._tehgbp98_blueprint_block()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- Dashboard RPC — preserve ALL A.46 + Phase 54 + Phase 65 fields; append Phase 98
-- ---------------------------------------------------------------------------

create or replace function public.get_ai_ethics_responsible_use_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_policy public.organization_ethics_policies; v_summary jsonb;
begin
  perform public._irp_require_permission('ethics.view');
  v_org_id := public._mta_require_organization();
  v_policy := public._aerue_ensure_policy(v_org_id);
  perform public._aerue_seed_use_cases(v_org_id);
  v_summary := public._escgbp_governance_summary(v_org_id);

  return jsonb_build_object(
    -- Phase A.46 fields (preserved)
    'has_organization', true,
    'philosophy', 'Responsible Aipify use through documented use cases, explainability requirements, and human oversight. Extends Security & Trust (A.18), Compliance (A.29), Human Oversight (A.40), and Delegated Trust (A.41).',
    'principles', jsonb_build_array(
      'Every Aipify use case documented and risk-classified',
      'Explainability required by default',
      'Human oversight for medium+ risk',
      'Critical use cases prohibited for autonomous Aipify',
      'Policy exceptions require audited override with justification',
      'Scheduled ethics reviews — not one-time approval'
    ),
    'summary', jsonb_build_object(
      'approved_use_cases', coalesce((select count(*) from public.ai_use_cases where organization_id = v_org_id and status = 'approved'), 0),
      'restricted_use_cases', coalesce((select count(*) from public.ai_use_cases where organization_id = v_org_id and status = 'restricted'), 0),
      'proposed_use_cases', coalesce((select count(*) from public.ai_use_cases where organization_id = v_org_id and status = 'proposed'), 0),
      'high_risk_active', coalesce((select count(*) from public.ai_use_cases where organization_id = v_org_id and risk_level in ('high', 'critical') and status = 'approved'), 0),
      'upcoming_reviews', coalesce((select count(*) from public.ai_use_cases where organization_id = v_org_id and next_review_at <= now() + interval '30 days' and status = 'approved'), 0),
      'policy_exceptions', jsonb_array_length(coalesce(v_policy.policy_exceptions, '[]'::jsonb))
    ),
    'ethics_policy', row_to_json(v_policy)::jsonb,
    'prohibited_examples', coalesce(v_policy.prohibited_examples, '[]'::jsonb),
    'explainability_requirements', jsonb_build_object(
      'required', v_policy.explainability_required,
      'human_oversight_default', v_policy.human_oversight_default,
      'review_frequency_days', v_policy.review_frequency_days,
      'note', 'All approved use cases must document reasoning, confidence, and trade-offs where applicable'
    ),
    'approved_use_cases', coalesce((
      select jsonb_agg(row_to_json(u) order by
        case u.risk_level when 'critical' then 0 when 'high' then 1 when 'medium' then 2 else 3 end, u.use_case_name)
      from public.ai_use_cases u where u.organization_id = v_org_id and u.status = 'approved'
    ), '[]'::jsonb),
    'restricted_use_cases', coalesce((
      select jsonb_agg(row_to_json(u) order by u.updated_at desc)
      from public.ai_use_cases u where u.organization_id = v_org_id and u.status = 'restricted'
    ), '[]'::jsonb),
    'proposed_use_cases', coalesce((
      select jsonb_agg(row_to_json(u) order by u.created_at desc)
      from public.ai_use_cases u where u.organization_id = v_org_id and u.status = 'proposed'
    ), '[]'::jsonb),
    'review_schedules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'use_case_id', u.id,
        'use_case_name', u.use_case_name,
        'risk_level', u.risk_level,
        'next_review_at', u.next_review_at,
        'overdue', u.next_review_at < now()
      ) order by u.next_review_at)
      from public.ai_use_cases u
      where u.organization_id = v_org_id and u.status = 'approved' and u.next_review_at is not null
    ), '[]'::jsonb),
    'policy_exceptions', coalesce(v_policy.policy_exceptions, '[]'::jsonb),
    'oversight_trends', jsonb_build_object(
      'high_risk_with_oversight', coalesce((
        select count(*) from public.ai_use_cases
        where organization_id = v_org_id and risk_level in ('high', 'critical') and oversight_required and status = 'approved'
      ), 0),
      'approved_without_oversight', coalesce((
        select count(*) from public.ai_use_cases
        where organization_id = v_org_id and not oversight_required and status = 'approved'
      ), 0),
      'recent_restrictions', coalesce((
        select count(*) from public.ai_use_cases
        where organization_id = v_org_id and status = 'restricted' and updated_at > now() - interval '90 days'
      ), 0)
    ),
    'integration_notes', jsonb_build_object(
      'human_oversight', jsonb_build_object('route', '/app/human-oversight-engine', 'note', 'Operational oversight for approved use cases'),
      'compliance', jsonb_build_object('route', '/app/compliance-regulatory-readiness-engine', 'note', 'Regulatory readiness alignment')
    ),
    -- Phase 54 — Ethics, Safety & Companion Governance Engine (preserved)
    'implementation_blueprint_phase54', jsonb_build_object(
      'phase', 54,
      'title', 'Ethics, Safety & Companion Governance Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE54_ETHICS_SAFETY_COMPANION_GOVERNANCE.md',
      'engine_phase', 'Phase A.46 — AI Ethics & Responsible Use Engine',
      'route', '/app/ai-ethics-responsible-use-engine',
      'mapping_note', 'Companion ethics, emotional safety, autonomy tiers, and governance transparency framing on A.46.'
    ),
    'companion_governance_phase', 54,
    'escgbp_mission', public._escgbp_blueprint_mission(),
    'escgbp_philosophy', public._escgbp_blueprint_philosophy(),
    'escgbp_abos_principle', public._escgbp_blueprint_abos_principle(),
    'escgbp_objectives', public._escgbp_blueprint_objectives(),
    'companion_principles', public._escgbp_blueprint_companion_principles(),
    'autonomy_principles', public._escgbp_blueprint_autonomy_principles(),
    'emotional_safety', public._escgbp_blueprint_emotional_safety(),
    'data_ethics', public._escgbp_blueprint_data_ethics(),
    'escgbp_self_love_connection', public._escgbp_blueprint_self_love_connection(),
    'organizational_governance', public._escgbp_blueprint_organizational_governance(),
    'companion_evolution_reviews', public._escgbp_blueprint_companion_evolution_reviews(),
    'escgbp_trust_connection', public._escgbp_blueprint_trust_connection(),
    'escgbp_dogfooding', public._escgbp_blueprint_dogfooding(),
    'escgbp_integration_links', public._escgbp_blueprint_integration_links(),
    'governance_summary', v_summary,
    'escgbp_success_criteria', public._escgbp_blueprint_success_criteria(v_org_id),
    'escgbp_distinction_note', public._escgbp_distinction_note(),
    'escgbp_vision_phrases', public._escgbp_blueprint_vision_phrases(),
    'critical_prohibition_note', 'Trust & Action level 4 (critical) actions are prohibited for AI — human confirmation required via /app/approvals.',
    'human_agency_note', 'Humans decide — Aipify informs, prepares, and explains. High-risk requires explicit approval; critical is human-only.',
    -- Phase 65 — Companion Evolution Council Engine (preserved)
    'implementation_blueprint_phase65', jsonb_build_object(
      'phase', 65,
      'title', 'Companion Evolution Council Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE65_COMPANION_EVOLUTION_COUNCIL.md',
      'engine_phase', 'Phase A.46 — AI Ethics & Responsible Use Engine',
      'route', '/app/ai-ethics-responsible-use-engine',
      'mapping_note', 'Council framework for values-driven capability review — layered on Phase 54 ethics scaffolds.'
    ),
    'companion_evolution_council_phase', 65,
    'cecbp_mission', public._cecbp_mission(),
    'cecbp_philosophy', public._cecbp_philosophy(),
    'cecbp_abos_principle', public._cecbp_abos_principle(),
    'cecbp_objectives', public._cecbp_objectives(),
    'council_responsibilities', public._cecbp_council_responsibilities(),
    'guiding_questions', public._cecbp_guiding_questions(),
    'representation_principles', public._cecbp_representation_principles(),
    'companion_philosophy_reviews', public._cecbp_companion_philosophy_reviews(),
    'cecbp_community_feedback', public._cecbp_community_feedback(),
    'cecbp_self_love_connection', public._cecbp_self_love_connection(),
    'cecbp_trust_connection', public._cecbp_trust_connection(),
    'cecbp_dogfooding', public._cecbp_dogfooding(),
    'cecbp_integration_links', public._cecbp_integration_links(),
    'council_engagement_summary', public._cecbp_engagement_summary(v_org_id),
    'cecbp_success_criteria', public._cecbp_success_criteria(v_org_id),
    'cecbp_distinction_note', public._cecbp_distinction_note(),
    'cecbp_vision_phrases', public._cecbp_vision_phrases(),
    -- Phase 98 — Trust, Ethics & Human Governance Engine
    'implementation_blueprint_phase98', jsonb_build_object(
      'phase', 98,
      'title', 'Trust, Ethics & Human Governance Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE98_TRUST_ETHICS_HUMAN_GOVERNANCE.md',
      'engine_phase', 'Phase A.46 — AI Ethics & Responsible Use Engine',
      'route', '/app/ai-ethics-responsible-use-engine',
      'mapping_note', 'Deploy and govern Aipify responsibly — human oversight, governance transparency, and values-aligned practices.'
    ),
    'trust_ethics_human_governance_phase', 98,
    'tehgbp98_mission', public._tehgbp98_mission(),
    'tehgbp98_philosophy', public._tehgbp98_philosophy(),
    'tehgbp98_vision', public._tehgbp98_vision(),
    'tehgbp98_abos_principle', public._tehgbp98_abos_principle(),
    'tehgbp98_objectives', public._tehgbp98_objectives(),
    'ethical_questions', public._tehgbp98_ethical_questions(),
    'governance_principles', public._tehgbp98_governance_principles(),
    'human_in_the_loop', public._tehgbp98_human_in_the_loop(),
    'companion_transparency', public._tehgbp98_companion_transparency(),
    'ethical_review_practices', public._tehgbp98_ethical_review_practices(),
    'tehgbp98_companion_guidance', public._tehgbp98_companion_guidance(),
    'tehgbp98_self_love_connection', public._tehgbp98_self_love_connection(),
    'tehgbp98_leadership_connection', public._tehgbp98_leadership_connection(),
    'tehgbp98_trust_connection', public._tehgbp98_trust_connection(),
    'privacy_principles', public._tehgbp98_privacy_principles(),
    'tehgbp98_dogfooding', public._tehgbp98_dogfooding(),
    'tehgbp98_integration_links', public._tehgbp98_integration_links(),
    'trust_ethics_governance_engagement_summary', public._tehgbp98_engagement_summary(v_org_id),
    'tehgbp98_success_criteria', public._tehgbp98_success_criteria(v_org_id),
    'tehgbp98_distinction_note', public._tehgbp98_distinction_note(),
    'tehgbp98_vision_phrases', public._tehgbp98_vision_phrases(),
    'trust_ethics_human_governance_blueprint', public._tehgbp98_blueprint_block()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

grant execute on function public._tehgbp98_distinction_note() to authenticated;
grant execute on function public._tehgbp98_mission() to authenticated;
grant execute on function public._tehgbp98_philosophy() to authenticated;
grant execute on function public._tehgbp98_vision() to authenticated;
grant execute on function public._tehgbp98_abos_principle() to authenticated;
grant execute on function public._tehgbp98_objectives() to authenticated;
grant execute on function public._tehgbp98_ethical_questions() to authenticated;
grant execute on function public._tehgbp98_governance_principles() to authenticated;
grant execute on function public._tehgbp98_human_in_the_loop() to authenticated;
grant execute on function public._tehgbp98_companion_transparency() to authenticated;
grant execute on function public._tehgbp98_ethical_review_practices() to authenticated;
grant execute on function public._tehgbp98_companion_guidance() to authenticated;
grant execute on function public._tehgbp98_self_love_connection() to authenticated;
grant execute on function public._tehgbp98_leadership_connection() to authenticated;
grant execute on function public._tehgbp98_trust_connection() to authenticated;
grant execute on function public._tehgbp98_privacy_principles() to authenticated;
grant execute on function public._tehgbp98_dogfooding() to authenticated;
grant execute on function public._tehgbp98_integration_links() to authenticated;
grant execute on function public._tehgbp98_vision_phrases() to authenticated;
grant execute on function public._tehgbp98_engagement_summary(uuid) to authenticated;
grant execute on function public._tehgbp98_success_criteria(uuid) to authenticated;
grant execute on function public._tehgbp98_blueprint_block() to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'trust-ethics-human-governance-blueprint-phase98', 'Trust, Ethics & Human Governance (ABOS Phase 98)',
  'Trust, Ethics & Human Governance Engine — responsible Aipify deployment and human oversight extending AI Ethics A.46, Phase 54, and Phase 65.',
  'authenticated', 108
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'trust-ethics-human-governance-blueprint-phase98' and tenant_id is null
);
