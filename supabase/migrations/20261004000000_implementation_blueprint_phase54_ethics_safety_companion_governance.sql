-- Implementation Blueprint Phase 54 — Ethics, Safety & Companion Governance Engine
-- Extends AI Ethics & Responsible Use Engine (Phase A.46) at /app/ai-ethics-responsible-use-engine.
-- No new tables — metadata helpers and dashboard/card RPC extensions only.

-- ---------------------------------------------------------------------------
-- Distinction & static blueprint helpers (_escgbp_*)
-- ---------------------------------------------------------------------------

create or replace function public._escgbp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 54 extends AI Ethics & Responsible Use Engine Phase A.46 at /app/ai-ethics-responsible-use-engine — companion ethics, emotional safety, autonomy tiers, and governance transparency framing on documented use cases. Distinct from Governance & Policy A.14 (tenant policies), Human Oversight A.40 (approval workflows), Trust & Action Phase 30 /app/approvals (risk levels 0–4 — cross-link only), Workflow Orchestration Blueprint Phase 40 (operational automation approval tiers), Inclusion & Humanity A.83 (communication conduct — not AI governance), Security & Trust A.18, and Compliance A.29. Cross-link Self Love A.76, Human Moments Phase 53, Proactive Companion A.79, and Companion Identity A.84 — do not duplicate ethics tables or approval stores.';
$$;

create or replace function public._escgbp_blueprint_mission()
returns text language sql immutable as $$
  select 'Govern companion ethics, emotional safety, and responsible autonomy — transparent governance that keeps humans in control while Aipify prepares explainable recommendations.';
$$;

create or replace function public._escgbp_blueprint_philosophy()
returns text language sql immutable as $$
  select 'Ethical companions inform and prepare — they never manipulate, assume facts, or replace human judgment. Uncertainty is honest; high-risk actions require explicit approval; critical actions are prohibited for AI.';
$$;

create or replace function public._escgbp_blueprint_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) earns trust through companion ethics, emotional safety, and governance transparency — humans decide; Aipify explains, safeguards, and escalates when uncertain.';
$$;

create or replace function public._escgbp_blueprint_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'ethical_guidance', 'label', 'Ethical guidance', 'description', 'Companion principles, uncertainty honesty, and explainable recommendations — never assumptions presented as facts'),
    jsonb_build_object('key', 'companion_safeguards', 'label', 'Companion safeguards', 'description', 'Emotional safety boundaries — no manipulation, fear, dependency, or shaming'),
    jsonb_build_object('key', 'human_oversight', 'label', 'Human oversight', 'description', 'Autonomy tiers aligned with Trust & Action risk levels — medium+ requires review; critical prohibited for AI'),
    jsonb_build_object('key', 'governance_transparency', 'label', 'Governance transparency', 'description', 'What data is used, why, permissions required, and how recommendations are formed'),
    jsonb_build_object('key', 'responsible_decision_support', 'label', 'Responsible decision support', 'description', 'Recommendations with reasoning, confidence, and trade-offs — humans decide outcomes'),
    jsonb_build_object('key', 'trust_practices', 'label', 'Trust practices', 'description', 'Periodic ethics reviews, evolution scaffolds, and audited policy exceptions')
  );
$$;

create or replace function public._escgbp_blueprint_companion_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion ethics — uncertainty honesty, no assumptions as facts, explain every recommendation.',
    'qualities', jsonb_build_array(
      'Acknowledge uncertainty — never present guesses as facts',
      'Explain why a recommendation is offered and what data informed it',
      'Offer alternatives and trade-offs when confidence is moderate',
      'Respect user autonomy — suggestions only, never pressure',
      'Align tone with Companion Identity A.84 — warm, professional, transparent'
    ),
    'companion_examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'uncertainty_honesty', 'scenario', 'Uncertainty honesty', 'example', '🦉 I am not certain about this outcome — here is what I noticed and what would help confirm it.'),
      jsonb_build_object('emoji', '🌹', 'key', 'explain_recommendation', 'scenario', 'Explain recommendation', 'example', '🌹 Aipify recommends reviewing this use case because it involves customer-facing automation — here is why and what approval may be needed.'),
      jsonb_build_object('emoji', '❤️', 'key', 'respect_autonomy', 'scenario', 'Respect autonomy', 'example', '❤️ You may approve, modify, or dismiss this suggestion — your judgment leads.'),
      jsonb_build_object('emoji', '🔔', 'key', 'escalate_when_uncertain', 'scenario', 'Escalate when uncertain', 'example', '🔔 Confidence is below the ethics threshold — Aipify recommends human review before proceeding.')
    ),
    'companion_identity_route', '/app/companion-identity-engine',
    'companion_identity_phase', 'A.84',
    'proactive_companion_route', '/app/proactive-companion-engine',
    'proactive_companion_phase', 'A.79'
  );
$$;

create or replace function public._escgbp_blueprint_autonomy_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Autonomy tiers align with Trust & Action Engine risk levels 0–4 — low may proceed with transparency; medium requires review; high requires explicit approval; critical is prohibited for AI.',
    'levels', jsonb_build_array(
      jsonb_build_object(
        'key', 'low_risk',
        'label', 'Low risk',
        'trust_action_level', 0,
        'autonomy_tier', 'inform',
        'description', 'Informational guidance, drafts, and internal summaries — explainable, reversible, human may dismiss',
        'examples', jsonb_build_array('Briefing summaries', 'Internal draft suggestions', 'Knowledge gap observations')
      ),
      jsonb_build_object(
        'key', 'medium_risk',
        'label', 'Medium risk',
        'trust_action_level', 2,
        'autonomy_tier', 'prepare',
        'description', 'Reversible actions and customer-facing drafts — human review recommended before execution',
        'examples', jsonb_build_array('Customer communication drafts', 'Workflow step proposals', 'Use case changes')
      ),
      jsonb_build_object(
        'key', 'high_risk',
        'label', 'High risk',
        'trust_action_level', 3,
        'autonomy_tier', 'approve',
        'description', 'Sensitive operations — explicit human approval required; AI prepares only',
        'examples', jsonb_build_array('Policy exceptions', 'High-risk use case approval', 'Permission-sensitive automation')
      ),
      jsonb_build_object(
        'key', 'critical',
        'label', 'Critical (prohibited for AI)',
        'trust_action_level', 4,
        'autonomy_tier', 'human_only',
        'description', 'Critical actions prohibited for autonomous AI — human-only via Trust & Action Engine',
        'examples', jsonb_build_array('Refunds without human sign-off', 'Admin permission changes', 'Irreversible data operations')
      )
    ),
    'trust_action_route', '/app/approvals',
    'trust_action_phase', 30,
    'human_oversight_route', '/app/human-oversight-engine',
    'human_oversight_phase', 'A.40',
    'workflow_orchestration_phase', 40,
    'workflow_orchestration_route', '/app/workflow-orchestration-engine',
    'boundary', 'Phase 54 frames companion autonomy on A.46 ethics — Trust & Action owns approval policy; Workflow Phase 40 owns multi-step orchestration tiers.'
  );
$$;

create or replace function public._escgbp_blueprint_emotional_safety()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Emotional safety — companions never manipulate, induce fear, create dependency, or shame users.',
    'must_avoid', jsonb_build_array(
      'Manipulation or guilt-based motivation',
      'Fear-inducing urgency without factual basis',
      'Dependency framing — Aipify augments, never replaces human judgment',
      'Shaming language for setbacks, delays, or declined suggestions',
      'Presenting AI confidence as certainty when evidence is weak'
    ),
    'must_encourage', jsonb_build_array(
      'Reflection — pause and consider before acting',
      'Confidence through explainability — users understand why',
      'Autonomy — dismiss, snooze, or modify any companion suggestion',
      'Sustainable pace — no alert fatigue or pressure loops',
      'Honest uncertainty — escalate rather than guess'
    ),
    'self_love_route', '/app/self-love-engine',
    'self_love_phase', 'A.76',
    'inclusion_humanity_note', 'Inclusion & Humanity A.83 governs communication conduct — Phase 54 governs companion AI ethics and governance, not general organizational communication policies.'
  );
$$;

create or replace function public._escgbp_blueprint_data_ethics()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Data ethics transparency — users and administrators understand what data informs recommendations, why, permissions required, and how it is used.',
    'required_disclosure', jsonb_build_array(
      jsonb_build_object('key', 'what', 'label', 'What data', 'description', 'Metadata categories only — use case records, policy settings, aggregate counts; never raw conversations or PII in ethics RPC payloads'),
      jsonb_build_object('key', 'why', 'label', 'Why used', 'description', 'Risk classification, oversight requirements, and explainability scaffolds for responsible companion behavior'),
      jsonb_build_object('key', 'permissions', 'label', 'Permissions', 'description', 'ethics.view, ethics.manage, ethics.review, ethics.override — role-based via organization permissions'),
      jsonb_build_object('key', 'how_used', 'label', 'How used in recommendations', 'description', 'Companion prepares suggestions informed by approved use cases and policy — humans approve execution')
    ),
    'privacy_note', 'Metadata and governance records only — no email content, chat transcripts, or payment data in ethics dashboard RPCs.',
    'security_trust_route', '/app/security-trust-engine',
    'security_trust_phase', 'A.18',
    'compliance_route', '/app/compliance-regulatory-readiness-engine',
    'compliance_phase', 'A.29'
  );
$$;

create or replace function public._escgbp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love A.76 influences companion tone — encouragement and reflection without perfectionism, guilt, or dependency.',
    'practices', jsonb_build_array(
      'Celebrate honest progress — not only polished outcomes',
      'Reduce admin fatigue through explainable automation boundaries',
      'Support sustainable decision-making pace — no urgency spam',
      'Normalize uncertainty — asking for help or declining suggestions is healthy',
      'Companion warmth aligned with Self Love — never judgmental follow-ups'
    ),
    'route', '/app/self-love-engine',
    'phase', 'A.76',
    'human_moments_route', '/app/gratitude-recognition-engine',
    'human_moments_phase', 53,
    'boundary_note', 'Human Moments Phase 53 handles consent-based life event recognition — Phase 54 handles companion ethics governance on A.46.'
  );
$$;

create or replace function public._escgbp_blueprint_organizational_governance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizational governance — approvals, permissions, escalation paths, and clear responsibilities for companion ethics.',
    'approval_workflows', jsonb_build_array(
      jsonb_build_object('step', 'propose', 'label', 'Propose use case', 'permission', 'ethics.manage', 'note', 'Document and risk-classify AI use cases'),
      jsonb_build_object('step', 'review', 'label', 'Ethics review', 'permission', 'ethics.review', 'note', 'Human reviewer examines proposed use cases'),
      jsonb_build_object('step', 'approve', 'label', 'Approve or restrict', 'permission', 'ethics.review', 'note', 'Approved use cases receive scheduled review dates'),
      jsonb_build_object('step', 'override', 'label', 'Policy exception', 'permission', 'ethics.override', 'note', 'Audited override with business justification — time-bound'),
      jsonb_build_object('step', 'escalate', 'label', 'Escalate uncertainty', 'permission', 'ethics.review', 'note', 'Low confidence or high risk triggers Human Oversight A.40 cross-link')
    ),
    'governance_policy_route', '/app/governance-policy-engine',
    'governance_policy_phase', 'A.14',
    'permissions', jsonb_build_array('ethics.view', 'ethics.manage', 'ethics.review', 'ethics.override'),
    'responsibilities', jsonb_build_array(
      'Owners and administrators — ethics policy settings and override authority',
      'Managers and reviewers — use case approval and restriction decisions',
      'All licensed users — transparency into approved use cases and prohibited examples',
      'Platform operators — aggregate governance metrics only — never customer operational content'
    )
  );
$$;

create or replace function public._escgbp_blueprint_companion_evolution_reviews()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion evolution reviews — periodic ethics, governance, safety, and community feedback scaffolds.',
    'review_cadence', jsonb_build_array(
      jsonb_build_object('key', 'use_case_review', 'label', 'Use case review', 'frequency_days', 90, 'description', 'Scheduled review of approved use cases — risk reclassification and oversight verification'),
      jsonb_build_object('key', 'policy_review', 'label', 'Ethics policy review', 'frequency_days', 90, 'description', 'Explainability and human oversight defaults — prohibited examples updated'),
      jsonb_build_object('key', 'companion_safety_review', 'label', 'Companion safety review', 'frequency_days', 180, 'description', 'Emotional safety and autonomy tier calibration — cross-link Companion Identity A.84'),
      jsonb_build_object('key', 'community_feedback', 'label', 'Community feedback scaffold', 'frequency_days', 180, 'description', 'Optional ecosystem ethics observations — metadata only, inform not prescribe')
    ),
    'feedback_sources', jsonb_build_array(
      jsonb_build_object('source', 'ethics_audit', 'label', 'Ethics audit logs', 'note', 'Use case propose, approve, restrict, and override events'),
      jsonb_build_object('source', 'oversight_trends', 'label', 'Oversight trends', 'note', 'High-risk with oversight vs approved without oversight counts'),
      jsonb_build_object('source', 'companion_identity', 'label', 'Companion Identity A.84', 'route', '/app/companion-identity-engine'),
      jsonb_build_object('source', 'community_intelligence', 'label', 'Community intelligence', 'route', '/app/community', 'note', 'Governance recommendations category — voluntary, anonymized')
    ),
    'evolution_note', 'Reviews are scaffolds — humans schedule and conduct; Aipify surfaces due dates and trend metadata only.'
  );
$$;

create or replace function public._escgbp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust is non-negotiable — companion ethics require transparency, explicit approvals for high risk, and prohibition of AI on critical actions.',
    'users_should_know', jsonb_build_array(
      'Every approved AI use case is documented with risk level and oversight requirements',
      'Critical risk use cases are prohibited for autonomous AI — human confirmation required',
      'Policy exceptions require audited justification and expire',
      'Companion recommendations explain what data informed them — metadata only in dashboard',
      'Emotional safety boundaries — no manipulation, fear, dependency, or shaming'
    ),
    'operators_should_understand', jsonb_build_array(
      'Phase 54 extends A.46 — not a duplicate ethics engine or approval store',
      'Trust & Action Phase 30 /app/approvals owns risk levels 0–4 execution gates',
      'Human Oversight A.40 owns operational approval workflows — cross-link only',
      'Inclusion & Humanity A.83 is communication conduct — distinct from AI governance',
      'Workflow Orchestration Phase 40 approval tiers complement but do not replace ethics use case registry'
    ),
    'critical_prohibition_note', 'Trust & Action level 4 (critical) actions are prohibited for AI — refunds, admin permission changes, and irreversible operations require human-only execution.',
    'approvals_route', '/app/approvals'
  );
$$;

create or replace function public._escgbp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates companion ethics governance internally; Unonight pilots use case review and emotional safety scaffolds as first external tenant.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — ethics policy defaults, companion principle calibration, critical prohibition messaging',
      'focus', jsonb_build_array(
        'Support and sales use case documentation',
        'Human Moments Phase 53 cross-link — recognition vs governance boundaries',
        'Workflow Phase 40 autonomy tier alignment review',
        'Proactive Companion A.79 nudge ethics calibration'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce support use cases and ethics review workflow',
      'focus', jsonb_build_array(
        'Support triage use case approval workflow',
        'Customer-facing automation risk classification',
        'Explainability requirement validation for approved use cases',
        'Scheduled ethics review cadence exercise'
      )
    )
  );
$$;

create or replace function public._escgbp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'trust_actions', 'label', 'Trust & Action Engine Phase 30', 'route', '/app/approvals', 'note', 'Risk levels 0–4 — critical prohibited for AI'),
    jsonb_build_object('key', 'human_oversight', 'label', 'Human Oversight A.40', 'route', '/app/human-oversight-engine', 'note', 'Operational approval workflows'),
    jsonb_build_object('key', 'governance_policy', 'label', 'Governance & Policy A.14', 'route', '/app/governance-policy-engine', 'note', 'Tenant policies — distinct from companion ethics framing'),
    jsonb_build_object('key', 'workflow_orchestration', 'label', 'Workflow Orchestration Phase 40', 'route', '/app/workflow-orchestration-engine', 'note', 'Operational automation approval tiers'),
    jsonb_build_object('key', 'security_trust', 'label', 'Security & Trust A.18', 'route', '/app/security-trust-engine', 'note', 'Security transparency cross-link'),
    jsonb_build_object('key', 'compliance', 'label', 'Compliance A.29', 'route', '/app/compliance-regulatory-readiness-engine', 'note', 'Regulatory readiness alignment'),
    jsonb_build_object('key', 'inclusion_humanity', 'label', 'Inclusion & Humanity A.83', 'route', '/app/inclusion-humanity-engine', 'note', 'Communication conduct — not AI governance'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Companion tone and emotional safety influence'),
    jsonb_build_object('key', 'human_moments', 'label', 'Human Moments Phase 53', 'route', '/app/gratitude-recognition-engine', 'note', 'Life event recognition — distinct consent model'),
    jsonb_build_object('key', 'proactive_companion', 'label', 'Proactive Companion A.79', 'route', '/app/proactive-companion-engine', 'note', 'Proactive nudge ethics boundaries'),
    jsonb_build_object('key', 'companion_identity', 'label', 'Companion Identity A.84', 'route', '/app/companion-identity-engine', 'note', 'Unified companion personality and behavioral standards')
  );
$$;

create or replace function public._escgbp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Ethical companions inform and prepare — humans decide.',
    '🦉 Uncertainty is honest — never present guesses as facts.',
    '🌹 Every recommendation explains why — transparency builds trust.',
    '❤️ Emotional safety first — no manipulation, fear, dependency, or shaming.',
    '🔔 High-risk waits for humans; critical actions are prohibited for AI.',
    'Governance transparency — what data, why, permissions, how used.',
    'Periodic ethics reviews — companion evolution is a shared responsibility.',
    'ABOS trust grows when autonomy tiers and approvals are visible.'
  );
$$;

-- ---------------------------------------------------------------------------
-- Live governance summary (metadata from A.46 tables)
-- ---------------------------------------------------------------------------

create or replace function public._escgbp_governance_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_policy public.organization_ethics_policies;
  v_approved int := 0;
  v_proposed int := 0;
  v_restricted int := 0;
  v_high_risk int := 0;
  v_overdue_reviews int := 0;
  v_exceptions int := 0;
begin
  v_policy := public._aerue_ensure_policy(p_organization_id);
  perform public._aerue_seed_use_cases(p_organization_id);

  select count(*) into v_approved from public.ai_use_cases
  where organization_id = p_organization_id and status = 'approved';

  select count(*) into v_proposed from public.ai_use_cases
  where organization_id = p_organization_id and status = 'proposed';

  select count(*) into v_restricted from public.ai_use_cases
  where organization_id = p_organization_id and status = 'restricted';

  select count(*) into v_high_risk from public.ai_use_cases
  where organization_id = p_organization_id and risk_level in ('high', 'critical') and status = 'approved';

  select count(*) into v_overdue_reviews from public.ai_use_cases
  where organization_id = p_organization_id and status = 'approved' and next_review_at < now();

  v_exceptions := jsonb_array_length(coalesce(v_policy.policy_exceptions, '[]'::jsonb));

  return jsonb_build_object(
    'approved_use_cases', v_approved,
    'proposed_use_cases', v_proposed,
    'restricted_use_cases', v_restricted,
    'high_risk_active', v_high_risk,
    'overdue_reviews', v_overdue_reviews,
    'policy_exceptions', v_exceptions,
    'explainability_required', v_policy.explainability_required,
    'human_oversight_default', v_policy.human_oversight_default,
    'review_frequency_days', v_policy.review_frequency_days,
    'governance_health', case
      when v_proposed > 0 and v_high_risk > 0 then 'attention_needed'
      when v_overdue_reviews > 0 then 'reviews_due'
      when v_approved >= 1 then 'healthy'
      else 'initializing'
    end,
    'privacy_note', 'Aggregate use case counts and policy flags only — no operational content or PII.',
    'summary_text', format(
      '%s approved use cases; %s proposed; %s high-risk active; %s overdue reviews.',
      v_approved, v_proposed, v_high_risk, v_overdue_reviews
    )
  );
end; $$;

create or replace function public._escgbp_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_summary jsonb;
  v_approved int := 0;
begin
  v_summary := public._escgbp_governance_summary(p_organization_id);
  v_approved := coalesce((v_summary->>'approved_use_cases')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'objectives_documented',
      'label', 'Six companion ethics objectives documented — guidance through trust practices',
      'met', jsonb_array_length(public._escgbp_blueprint_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'companion_principles',
      'label', 'Companion principles — uncertainty, explainability, autonomy respect',
      'met', jsonb_array_length(public._escgbp_blueprint_companion_principles()->'companion_examples') >= 4,
      'note', '🌹🦉❤️🔔 companion examples scaffolded.'
    ),
    jsonb_build_object(
      'key', 'autonomy_tiers',
      'label', 'Autonomy tiers aligned with Trust & Action risk levels 0–4',
      'met', jsonb_array_length(public._escgbp_blueprint_autonomy_principles()->'levels') = 4,
      'note', 'Critical (level 4) prohibited for AI — human-only.'
    ),
    jsonb_build_object(
      'key', 'emotional_safety',
      'label', 'Emotional safety boundaries documented — no manipulation, fear, dependency, shaming',
      'met', jsonb_array_length(public._escgbp_blueprint_emotional_safety()->'must_avoid') >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'data_ethics',
      'label', 'Data ethics transparency — what, why, permissions, how used',
      'met', jsonb_array_length(public._escgbp_blueprint_data_ethics()->'required_disclosure') = 4,
      'note', 'Metadata only in RPC payloads.'
    ),
    jsonb_build_object(
      'key', 'organizational_governance',
      'label', 'Organizational governance — approvals, permissions, escalation scaffolds',
      'met', jsonb_array_length(public._escgbp_blueprint_organizational_governance()->'approval_workflows') >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'evolution_reviews',
      'label', 'Companion evolution review cadence scaffolded',
      'met', jsonb_array_length(public._escgbp_blueprint_companion_evolution_reviews()->'review_cadence') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'approved_use_cases',
      'label', 'At least one approved AI use case documented',
      'met', v_approved >= 1,
      'note', case when v_approved = 0 then 'Propose and approve a use case via ethics workflow.' else null end
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links to Trust Action Phase 30, Self Love A.76, Human Moments 53, Proactive Companion A.79, Companion Identity A.84',
      'met', jsonb_array_length(public._escgbp_blueprint_integration_links()) >= 10,
      'note', null
    ),
    jsonb_build_object(
      'key', 'distinction_documented',
      'label', 'Distinction from Governance A.14, Human Oversight A.40, Inclusion A.83, Workflow Phase 40',
      'met', length(public._escgbp_distinction_note()) > 50,
      'note', 'Blueprint Phase 54 extends A.46 — companion ethics framing.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- Card RPC — compact Phase 54 metadata
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
    'philosophy', 'Responsible AI — documented use cases with human oversight and companion ethics transparency.',
    'implementation_blueprint_phase54', jsonb_build_object(
      'phase', 54,
      'title', 'Ethics, Safety & Companion Governance Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE54_ETHICS_SAFETY_COMPANION_GOVERNANCE.md',
      'engine_phase', 'Phase A.46 — AI Ethics & Responsible Use Engine',
      'route', '/app/ai-ethics-responsible-use-engine'
    ),
    'companion_governance_phase', 54,
    'escgbp_abos_principle', public._escgbp_blueprint_abos_principle(),
    'governance_summary', v_summary,
    'governance_health', v_summary->>'governance_health',
    'critical_prohibition_note', 'Trust & Action level 4 (critical) actions are prohibited for AI — human confirmation required.',
    'blueprint_note', 'Ethics, Safety & Companion Governance (ABOS Phase 54) — extends A.46 with companion ethics, emotional safety, autonomy tiers, and governance transparency.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- Dashboard RPC — preserve ALL A.46 fields; append Phase 54 blueprint
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
    'philosophy', 'Responsible AI use through documented use cases, explainability requirements, and human oversight. Extends Security & Trust (A.18), Compliance (A.29), Human Oversight (A.40), and Delegated Trust (A.41).',
    'principles', jsonb_build_array(
      'Every AI use case documented and risk-classified',
      'Explainability required by default',
      'Human oversight for medium+ risk',
      'Critical use cases prohibited for autonomous AI',
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
    -- Phase 54 — Ethics, Safety & Companion Governance Engine
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
    'human_agency_note', 'Humans decide — Aipify informs, prepares, and explains. High-risk requires explicit approval; critical is human-only.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

grant execute on function public._escgbp_distinction_note() to authenticated;
grant execute on function public._escgbp_blueprint_mission() to authenticated;
grant execute on function public._escgbp_blueprint_philosophy() to authenticated;
grant execute on function public._escgbp_blueprint_abos_principle() to authenticated;
grant execute on function public._escgbp_blueprint_objectives() to authenticated;
grant execute on function public._escgbp_blueprint_companion_principles() to authenticated;
grant execute on function public._escgbp_blueprint_autonomy_principles() to authenticated;
grant execute on function public._escgbp_blueprint_emotional_safety() to authenticated;
grant execute on function public._escgbp_blueprint_data_ethics() to authenticated;
grant execute on function public._escgbp_blueprint_self_love_connection() to authenticated;
grant execute on function public._escgbp_blueprint_organizational_governance() to authenticated;
grant execute on function public._escgbp_blueprint_companion_evolution_reviews() to authenticated;
grant execute on function public._escgbp_blueprint_trust_connection() to authenticated;
grant execute on function public._escgbp_blueprint_dogfooding() to authenticated;
grant execute on function public._escgbp_blueprint_integration_links() to authenticated;
grant execute on function public._escgbp_blueprint_vision_phrases() to authenticated;
grant execute on function public._escgbp_governance_summary(uuid) to authenticated;
grant execute on function public._escgbp_blueprint_success_criteria(uuid) to authenticated;
