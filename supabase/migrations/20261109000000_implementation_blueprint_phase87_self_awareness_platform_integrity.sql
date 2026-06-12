-- Implementation Blueprint Phase 87 — Self-Awareness & Platform Integrity Engine
-- Extends Self-Awareness & Platform Integrity repo Phase 87 at /app/integrity (_int_* helpers).
-- No new tables — ABOS blueprint metadata scaffold only.
-- Distinct from Curiosity & Discovery Engine Phase A.87 at /app/curiosity-discovery-engine (engine phase number collision).
-- Distinct from Blueprint Phase 80 Opportunity Exploration (extends A.87 Curiosity — unrelated to this blueprint).

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._sapibp87_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 87 — Self-Awareness & Platform Integrity Engine at /app/integrity. Extends Self-Awareness & Platform Integrity repo Phase 87 via _int_* helpers — continuous self-monitoring and responsible self-improvement. Distinct from Curiosity & Discovery Engine Phase A.87 at /app/curiosity-discovery-engine (engine phase number collision only). Distinct from Blueprint Phase 80 Opportunity Exploration at /app/curiosity-discovery-engine (extends A.87 Curiosity — unrelated to this blueprint). Helpers: _int_* (repo Phase 87) — Blueprint Phase 87 uses _sapibp87_* only. Aipify evaluates itself; humans govern improvements.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._sapibp87_mission()
returns text language sql immutable as $$
  select 'Continuous self-monitoring and responsible self-improvement for trustworthiness and reliability.';
$$;

create or replace function public._sapibp87_philosophy()
returns text language sql immutable as $$
  select 'Self-awareness is recognizing when something deserves attention — humility strengthens intelligence.';
$$;

create or replace function public._sapibp87_abos_principle()
returns text language sql immutable as $$
  select 'Trustworthy companions recognize strengths and limitations — self-awareness supports responsible growth inside the Aipify Business Operating System.';
$$;

create or replace function public._sapibp87_vision()
returns text language sql immutable as $$
  select 'Aipify is continuously learning how to serve us better without losing sight of the principles that matter most.';
$$;

create or replace function public._sapibp87_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'continuous_self_monitoring', 'label', 'Continuous self-monitoring', 'description', 'Observe platform health, integration status, and operational signals — metadata only, no hidden diagnostics'),
    jsonb_build_object('key', 'honest_capability_boundaries', 'label', 'Honest capability boundaries', 'description', 'Recognize uncertainty, missing information, integration constraints, and confidence levels transparently'),
    jsonb_build_object('key', 'responsible_self_improvement', 'label', 'Responsible self-improvement', 'description', 'Surface improvement opportunities with human approval — never autonomous major corrections'),
    jsonb_build_object('key', 'integrity_safeguards', 'label', 'Integrity safeguards', 'description', 'Audit logging, approval checkpoints, governance reviews, escalation, and Companion Evolution Council oversight'),
    jsonb_build_object('key', 'trustworthy_transparency', 'label', 'Trustworthy transparency', 'description', 'Cross-link Trust Engine, Governance, Security, and Quality Guardian — explain findings without concealing concerns'),
    jsonb_build_object('key', 'privacy_restraint', 'label', 'Privacy restraint', 'description', 'Integrity requires restraint — no hidden diagnostics, unauthorized access, unnecessary collection, or expanding visibility without approval')
  );
$$;

create or replace function public._sapibp87_platform_health_monitoring()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Platform health monitoring — cross-link Observability Platform Health A.19; metadata scaffolds only.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'integration_status', 'label', 'Integration status', 'description', 'Connection health, sync recency, and credential validity — cross-link Integration Engine A.8'),
      jsonb_build_object('key', 'service_availability', 'label', 'Service availability', 'description', 'Core service and module availability signals — cross-link Observability A.19 and Status Transparency A.27'),
      jsonb_build_object('key', 'queue_health', 'label', 'Queue health', 'description', 'Pending approvals, action queues, and workflow backlog depth — cross-link Action Hub A.64 and Workflow Orchestration A.42'),
      jsonb_build_object('key', 'workflow_completion', 'label', 'Workflow completion', 'description', 'Orchestrated workflow completion rates and stalled step detection — cross-link Blueprint Phase 86'),
      jsonb_build_object('key', 'notification_delivery', 'label', 'Notification delivery', 'description', 'Delivery success, quiet-hours respect, and alert fatigue patterns — cross-link Notification Engine and Desktop Presence'),
      jsonb_build_object('key', 'support_response_effectiveness', 'label', 'Support response effectiveness', 'description', 'Triage confidence, escalation patterns, and knowledge gap correlation — cross-link Support AI A.7 and Quality Guardian A.13')
    ),
    'monitoring_note', 'Health signals inform integrity reviews — Aipify observes and reports; humans govern corrective actions.'
  );
$$;

create or replace function public._sapibp87_self_observation_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self-observation examples — humility strengthens intelligence; observations prepare dialogue, not conclusions.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'pattern_worth_review', 'observation', '🦉 Aipify noticed several similar knowledge gaps this month — would a focused review help strengthen support accuracy?', 'description', 'Wisdom-driven pattern recognition — not alarmist framing.'),
      jsonb_build_object('emoji', '🌹', 'key', 'strengths_to_preserve', 'observation', '🌹 Integration health and notification delivery remain strong — these capabilities deserve recognition as improvement work continues elsewhere.', 'description', 'Self Love connection — acknowledge strengths while improving.'),
      jsonb_build_object('emoji', '🔔', 'key', 'attention_deserved', 'observation', '🔔 Workflow completion rates in one area may benefit from calm review — shall Aipify prepare a summary for your next operations check-in?', 'description', 'Bell moments for thoughtful attention — not urgency pressure.')
    )
  );
$$;

create or replace function public._sapibp87_capability_boundaries()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Capability boundaries — honest limits strengthen trust; never imply certainty when evidence is incomplete.',
    'boundaries', jsonb_build_array(
      jsonb_build_object('key', 'uncertainty', 'label', 'Uncertainty', 'description', 'When confidence is low, Aipify states uncertainty clearly and recommends human review — never fabricates completeness'),
      jsonb_build_object('key', 'missing_information', 'label', 'Missing information', 'description', 'Gaps in integration data, knowledge coverage, or operational metadata are surfaced — not hidden or assumed'),
      jsonb_build_object('key', 'integration_constraints', 'label', 'Integration constraints', 'description', 'External system limits, API scopes, and sync delays constrain what Aipify can observe — transparent about blind spots'),
      jsonb_build_object('key', 'confidence_levels', 'label', 'Confidence levels', 'description', 'Findings and scores include confidence metadata — cross-link Trust Engine /app/trust for explainability')
    ),
    'boundary_note', 'Self-awareness includes knowing what Aipify cannot yet see or do reliably.'
  );
$$;

create or replace function public._sapibp87_self_improvement_opportunities()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self-improvement opportunities — surface possibilities; humans approve all major changes.',
    'opportunities', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'knowledge_freshness', 'prompt', '🦉 Knowledge freshness signals suggest a few FAQ areas may benefit from review — would you like Aipify to prepare a prioritized list?', 'consideration', 'Cross-link Knowledge Center A.5 and Continuous Improvement A.33'),
      jsonb_build_object('emoji', '🌹', 'key', 'quality_recognition', 'prompt', '🌹 Several integrity domains remain strong — would documenting what is working well help preserve those patterns during improvement work?', 'consideration', 'Self Love — celebrate strengths while improving'),
      jsonb_build_object('emoji', '🔔', 'key', 'governance_backlog', 'prompt', '🔔 A governance review item has been open longer than expected — shall Aipify prepare context for your next approval session?', 'consideration', 'Cross-link Governance A.14 and Companion Evolution Council Phase 65')
    ),
    'improvement_note', 'Improvement opportunities are suggestions — never autonomous corrections or silent changes.'
  );
$$;

create or replace function public._sapibp87_integrity_safeguards()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Integrity safeguards — responsible self-improvement requires governance, audit, and human checkpoints.',
    'safeguards', jsonb_build_array(
      jsonb_build_object('key', 'audit_logging', 'label', 'Audit logging', 'description', 'Every integrity review, finding acknowledgment, and action completion logged via integrity_audit_log and Trust audit events'),
      jsonb_build_object('key', 'approval_checkpoints', 'label', 'Approval checkpoints', 'description', 'Critical and governance-required actions await explicit approval — cross-link Trust & Action Phase 30 /app/approvals'),
      jsonb_build_object('key', 'governance_reviews', 'label', 'Governance reviews', 'description', 'Policy alignment and evolution proposals reviewed via Governance A.14 — cross-link /app/governance-policy-engine'),
      jsonb_build_object('key', 'escalation', 'label', 'Escalation', 'description', 'Critical integrity findings escalate to executive review — never concealed or downgraded'),
      jsonb_build_object('key', 'companion_evolution_oversight', 'label', 'Companion Evolution Council oversight', 'description', 'Capability changes reviewed against founding principles — cross-link Companion Evolution Council Blueprint Phase 65 at /app/ai-ethics-responsible-use-engine')
    ),
    'safeguard_note', 'No inflated scores, no concealed concerns, no autonomous major corrections.'
  );
$$;

create or replace function public._sapibp87_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion guidance — calm self-awareness; recognize attention without alarm or self-criticism.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'integrity_review', 'prompt', '🦉 Aipify completed its monthly integrity review — would a summary of what deserves attention help your next planning conversation?', 'consideration', 'Self-monitoring with humility — not performance judgment.'),
      jsonb_build_object('emoji', '🌹', 'key', 'trust_strength', 'prompt', '🌹 Trust and governance alignment remain strong in your organization — acknowledging that helps focus improvement where it matters most.', 'consideration', 'Self Love — strengths and limitations both deserve honest recognition.'),
      jsonb_build_object('emoji', '🔔', 'key', 'improvement_ready', 'prompt', '🔔 One integrity finding may benefit from review when you have a moment — shall Aipify prepare context without urgency framing?', 'consideration', 'Humans decide timing — Aipify prepares context only.')
    )
  );
$$;

create or replace function public._sapibp87_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — self-awareness with compassion, not self-criticism; humility strengthens intelligence.',
    'practices', jsonb_build_array(
      'Recognize strengths alongside areas for improvement — integrity is honest, not punitive',
      'Humility — attention signals invite review, not shame or failure framing',
      'Compassion — Aipify serves people; self-improvement supports reliability, not perfectionism',
      'Continuous learning — responsible growth preserves principles that matter most'
    ),
    'journey_phrase', 'Aipify is continuously learning how to serve us better without losing sight of the principles that matter most.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports thoughtful self-awareness — principle only; Platform Integrity stores metadata, not personal wellbeing content.'
  );
$$;

create or replace function public._sapibp87_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparency about monitoring sources, score components, limitations, and the distinction between observation and corrective action.',
    'leaders_should_know', jsonb_build_array(
      'Which metadata sources contributed to integrity scores and findings',
      'Integrity scores are never inflated — quality concerns are never concealed',
      'Self-improvement suggestions require human approval — no autonomous major corrections',
      'Capability boundaries and confidence levels are stated honestly when evidence is incomplete'
    ),
    'organizations_should_understand', jsonb_build_array(
      'Self-Awareness & Platform Integrity observes operational metadata — no raw customer records or PII',
      'Cross-links Observability A.19, Governance A.14, Security & Trust A.18, Quality Guardian A.13, and Trust Engine /app/trust',
      'Distinct from Curiosity & Discovery A.87 at /app/curiosity-discovery-engine — phase number collision only',
      'Humans govern improvements — Aipify evaluates itself and prepares context for responsible action'
    ),
    'audit_note', 'Integrity reviews, findings, and actions logged via integrity_audit_log — metadata only.'
  );
$$;

create or replace function public._sapibp87_privacy_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Integrity requires restraint — privacy-by-design governs all self-monitoring and diagnostic activity.',
    'forbidden', jsonb_build_array(
      'Hidden diagnostics or undisclosed monitoring beyond approved metadata scopes',
      'Unauthorized access to customer operational records, email, chat, or payment data',
      'Unnecessary collection of data not required for integrity review',
      'Expanding visibility or diagnostic scope without explicit approval'
    ),
    'required', jsonb_build_array(
      'Metadata-first integrity signals — patterns and outcomes, not raw content',
      'Transparent monitoring sources documented in findings and score components',
      'Human approval before expanding diagnostic visibility',
      'Cross-link Security & Trust A.18 and Trust Architecture privacy rules'
    ),
    'boundary_note', 'Self-awareness serves trustworthiness — restraint is part of integrity.'
  );
$$;

create or replace function public._sapibp87_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates self-awareness and platform integrity patterns internally before customer rollout.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — Meeting Companion, Sales Expert ops, support workflows, Executive Companion',
      'focus', jsonb_build_array(
        'Meeting Companion (A.61 / Blueprint Phase 72) — meeting insight quality and follow-through integrity',
        'Sales Expert operations (A.95) — partner onboarding and marketplace integrity signals',
        'Support workflows (A.7 / ASO) — triage accuracy, escalation patterns, knowledge gap correlation',
        'Executive Companion — briefing quality, explanation clarity, and governance alignment'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce operational integrity',
      'focus', jsonb_build_array(
        'Support and knowledge integrity during commerce operations',
        'Integration health for customer-facing workflows',
        'Recommendation and outcome validation patterns',
        'Human Success adoption integrity signals'
      )
    )
  );
$$;

create or replace function public._sapibp87_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Observability Platform Health (A.19)', 'route', '/app/observability-platform-health-engine', 'note', 'Service availability and incident signals — cross-link only'),
    jsonb_build_object('label', 'Governance & Policy (A.14)', 'route', '/app/governance-policy-engine', 'note', 'Governance reviews and approval requirements for integrity actions'),
    jsonb_build_object('label', 'Security & Trust (A.18)', 'route', '/app/security-trust-engine', 'note', 'Security posture and trust alignment — metadata only'),
    jsonb_build_object('label', 'Quality Guardian (A.13)', 'route', '/app/quality-guardian-engine', 'note', 'Operational quality monitoring — complements integrity findings'),
    jsonb_build_object('label', 'Companion Evolution Council (Phase 65)', 'route', '/app/ai-ethics-responsible-use-engine', 'note', 'Values-driven capability review — oversight for self-improvement proposals'),
    jsonb_build_object('label', 'Continuous Improvement (A.33)', 'route', '/app/continuous-improvement-engine', 'note', 'Improvement workflow and outcome validation — cross-link only'),
    jsonb_build_object('label', 'Trust Engine (Phase 76)', 'route', '/app/trust', 'note', 'Decision explanations, Trust Score, and transparent scoring'),
    jsonb_build_object('label', 'Curiosity & Discovery (A.87)', 'route', '/app/curiosity-discovery-engine', 'note', 'Engine phase number collision — distinct from this blueprint; Blueprint Phase 80 extends A.87'),
    jsonb_build_object('label', 'Learning Engine (Phase 29/65)', 'route', '/app/learning', 'note', 'Emerging quality issues and corrective patterns — cross-link only'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Compassionate self-awareness — principle only')
  );
$$;

create or replace function public._sapibp87_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_open_findings int := 0;
  v_critical int := 0;
  v_pending_actions int := 0;
begin
  select count(*) filter (where status in ('open', 'acknowledged', 'in_review')),
         count(*) filter (where severity = 'critical_review_required' and status = 'open')
  into v_open_findings, v_critical
  from public.integrity_findings where tenant_id = p_tenant_id;

  select count(*) into v_pending_actions
  from public.integrity_actions
  where tenant_id = p_tenant_id and status not in ('completed', 'dismissed');

  return jsonb_build_object(
    'open_findings', v_open_findings,
    'critical_findings', v_critical,
    'pending_actions', v_pending_actions,
    'monitoring_dimensions', jsonb_array_length(public._sapibp87_platform_health_monitoring()->'dimensions'),
    'self_observation_examples', jsonb_array_length(public._sapibp87_self_observation_examples()->'examples'),
    'improvement_opportunities', jsonb_array_length(public._sapibp87_self_improvement_opportunities()->'opportunities'),
    'integrity_safeguards', jsonb_array_length(public._sapibp87_integrity_safeguards()->'safeguards'),
    'companion_examples', jsonb_array_length(public._sapibp87_companion_guidance()->'examples'),
    'capability_boundaries', jsonb_array_length(public._sapibp87_capability_boundaries()->'boundaries'),
    'integration_links', jsonb_array_length(public._sapibp87_integration_links()),
    'privacy_note', 'Metadata only — integrity counts, monitoring scaffolds, and improvement context. No raw customer content or PII.'
  );
end; $$;

create or replace function public._sapibp87_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_engagement jsonb;
begin
  v_engagement := public._sapibp87_engagement_summary(p_tenant_id);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'continuous_self_monitoring',
      'label', 'Continuous self-monitoring — six health dimensions documented',
      'met', jsonb_array_length(public._sapibp87_platform_health_monitoring()->'dimensions') >= 6,
      'note', 'Integration status, service availability, queue health, workflow completion, notification delivery, support effectiveness.'
    ),
    jsonb_build_object(
      'key', 'self_observation',
      'label', 'Self-observation examples — 🦉🌹🔔 humility-driven observations',
      'met', jsonb_array_length(public._sapibp87_self_observation_examples()->'examples') >= 3,
      'note', 'Pattern review, strengths recognition, attention signals — not alarmist framing.'
    ),
    jsonb_build_object(
      'key', 'capability_boundaries',
      'label', 'Capability boundaries — uncertainty, missing info, constraints, confidence',
      'met', jsonb_array_length(public._sapibp87_capability_boundaries()->'boundaries') >= 4,
      'note', 'Honest limits strengthen trust — never imply certainty when evidence is incomplete.'
    ),
    jsonb_build_object(
      'key', 'self_improvement',
      'label', 'Self-improvement opportunities — human-approved changes only',
      'met', jsonb_array_length(public._sapibp87_self_improvement_opportunities()->'opportunities') >= 3,
      'note', 'Knowledge freshness, quality recognition, governance backlog — suggestions not autonomous corrections.'
    ),
    jsonb_build_object(
      'key', 'integrity_safeguards',
      'label', 'Integrity safeguards — audit, approval, governance, escalation, council oversight',
      'met', jsonb_array_length(public._sapibp87_integrity_safeguards()->'safeguards') >= 5,
      'note', 'No inflated scores, no concealed concerns, no autonomous major corrections.'
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Companion guidance — calm self-awareness without self-criticism',
      'met', jsonb_array_length(public._sapibp87_companion_guidance()->'examples') >= 3,
      'note', 'Integrity review, trust strength, improvement readiness — humans decide timing.'
    ),
    jsonb_build_object(
      'key', 'privacy_principles',
      'label', 'Privacy principles — no hidden diagnostics or unauthorized access',
      'met', jsonb_array_length(public._sapibp87_privacy_principles()->'forbidden') >= 4,
      'note', 'Integrity requires restraint — metadata only, approval before expanding visibility.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — sources, limitations, and human governance documented',
      'met', jsonb_array_length(public._sapibp87_trust_connection()->'leaders_should_know') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — humility strengthens intelligence',
      'met', (public._sapibp87_self_love_connection()->>'journey_phrase') is not null,
      'note', 'Compassionate self-awareness — not self-criticism or punitive framing.'
    ),
    jsonb_build_object(
      'key', 'objectives',
      'label', 'Six self-awareness objectives documented',
      'met', jsonb_array_length(public._sapibp87_objectives()) >= 6,
      'note', 'Self-monitoring, boundaries, improvement, safeguards, transparency, privacy restraint.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links Observability A.19, Governance A.14, Security A.18, QG A.13, Trust, Continuous Improvement A.33',
      'met', jsonb_array_length(public._sapibp87_integration_links()) >= 10,
      'note', 'Extend related engines — do not duplicate integrity storage.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Meeting Companion, Sales Expert, support, Executive Companion',
      'met', (public._sapibp87_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    ),
    jsonb_build_object(
      'key', 'integrity_baseline',
      'label', 'Integrity baseline — repo Phase 87 findings and scores active',
      'met', coalesce((v_engagement->>'open_findings')::int, 0) >= 0,
      'note', case when coalesce((v_engagement->>'open_findings')::int, 0) = 0
        then 'No open findings — integrity review may confirm healthy baseline.'
        else null end
    ),
    jsonb_build_object(
      'key', 'vision',
      'label', 'Vision phrase documented',
      'met', (public._sapibp87_vision()) is not null,
      'note', 'Aipify is continuously learning how to serve us better without losing sight of the principles that matter most.'
    )
  );
end; $$;

create or replace function public._sapibp87_self_awareness_platform_integrity_block(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'implementation_blueprint_phase87', jsonb_build_object(
      'phase', 'Phase 87 — Self-Awareness & Platform Integrity Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE87_SELF_AWARENESS_PLATFORM_INTEGRITY.md',
      'engine_phase', 'Repo Phase 87 Self-Awareness & Platform Integrity',
      'route', '/app/integrity',
      'mapping_note', 'ABOS Blueprint Phase 87 extends repo Phase 87 (_int_*) with self-awareness scaffolding — continuous self-monitoring, capability boundaries, and responsible self-improvement. Distinct from Curiosity & Discovery A.87 at /app/curiosity-discovery-engine (phase number collision). Distinct from Blueprint Phase 80 Opportunity Exploration (extends A.87 Curiosity — unrelated).'
    ),
    'self_awareness_platform_integrity_note', 'Self-Awareness & Platform Integrity Engine (ABOS Phase 87) — continuous self-monitoring and responsible self-improvement for trustworthiness and reliability.',
    'distinction_note', public._sapibp87_distinction_note(),
    'mission', public._sapibp87_mission(),
    'philosophy', public._sapibp87_philosophy(),
    'abos_principle', public._sapibp87_abos_principle(),
    'vision', public._sapibp87_vision(),
    'objectives', public._sapibp87_objectives(),
    'platform_health_monitoring', public._sapibp87_platform_health_monitoring(),
    'self_observation_examples', public._sapibp87_self_observation_examples(),
    'capability_boundaries', public._sapibp87_capability_boundaries(),
    'self_improvement_opportunities', public._sapibp87_self_improvement_opportunities(),
    'integrity_safeguards', public._sapibp87_integrity_safeguards(),
    'companion_guidance', public._sapibp87_companion_guidance(),
    'self_love_connection', public._sapibp87_self_love_connection(),
    'trust_connection', public._sapibp87_trust_connection(),
    'privacy_principles', public._sapibp87_privacy_principles(),
    'dogfooding', public._sapibp87_dogfooding(),
    'success_criteria', public._sapibp87_success_criteria(p_tenant_id),
    'integration_links', public._sapibp87_integration_links(),
    'engagement_summary', public._sapibp87_engagement_summary(p_tenant_id),
    'privacy_note', 'Self-awareness and platform integrity metadata only — monitoring scaffolds, observation themes, and improvement context. No raw customer content, chat, or PII. Humans govern all major improvements.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL repo Phase 87 fields; append blueprint block
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_integrity_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.integrity_settings;
  v_score jsonb;
  v_findings jsonb;
  v_reviews jsonb;
  v_actions jsonb;
  v_deprecated jsonb;
  v_briefings jsonb;
  v_trends jsonb;
  v_domains jsonb;
begin
  v_tenant_id := public._int_require_tenant();
  v_settings := public._int_ensure_settings(v_tenant_id);
  perform public._int_run_review(v_tenant_id, 'monthly');
  v_score := public._int_calculate_integrity_score(v_tenant_id);
  perform public._int_trust_explanation(v_tenant_id,
    (v_score->>'integrity_score')::numeric, v_score->>'integrity_band');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', f.id, 'domain', f.domain, 'severity', f.severity, 'status', f.status,
    'summary', f.summary, 'evidence', f.evidence,
    'affected_domains', f.affected_domains, 'potential_impact', f.potential_impact,
    'recommended_actions', f.recommended_actions,
    'governance_requirements', f.governance_requirements, 'created_at', f.created_at
  ) order by case f.severity
    when 'critical_review_required' then 1 when 'attention_required' then 2
    when 'monitor' then 3 else 4 end), '[]'::jsonb)
  into v_findings
  from public.integrity_findings f
  where f.tenant_id = v_tenant_id and f.status in ('open', 'acknowledged', 'in_review')
  limit 25;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'review_type', r.review_type, 'review_period', r.review_period,
    'status', r.status, 'summary', r.summary, 'created_at', r.created_at
  ) order by r.created_at desc), '[]'::jsonb)
  into v_reviews
  from public.integrity_reviews r where r.tenant_id = v_tenant_id limit 10;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'finding_id', a.finding_id, 'action_description', a.action_description,
    'status', a.status, 'requires_governance', a.requires_governance, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_actions
  from public.integrity_actions a where a.tenant_id = v_tenant_id and a.status not in ('completed', 'dismissed')
  limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'asset_type', d.asset_type, 'asset_title', d.asset_title,
    'reason', d.reason, 'status', d.status, 'flagged_at', d.flagged_at
  ) order by d.flagged_at desc), '[]'::jsonb)
  into v_deprecated
  from public.integrity_deprecated_assets d
  where d.tenant_id = v_tenant_id and d.status in ('flagged', 'under_review')
  limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'summary', b.summary, 'created_at', b.created_at
  ) order by b.created_at desc), '[]'::jsonb)
  into v_briefings
  from public.integrity_briefings b where b.tenant_id = v_tenant_id limit 5;

  select coalesce(jsonb_agg(jsonb_build_object(
    'score', s.integrity_score, 'band', s.integrity_band, 'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb)
  into v_trends
  from public.integrity_scores s where s.tenant_id = v_tenant_id limit 12;

  v_domains := jsonb_build_array(
    jsonb_build_object('key', 'knowledge', 'label', 'Knowledge Integrity'),
    jsonb_build_object('key', 'support', 'label', 'Support Integrity'),
    jsonb_build_object('key', 'marketplace', 'label', 'Marketplace Integrity'),
    jsonb_build_object('key', 'blueprint', 'label', 'Blueprint Integrity'),
    jsonb_build_object('key', 'recommendation', 'label', 'Recommendation Integrity'),
    jsonb_build_object('key', 'explanation', 'label', 'Explanation Integrity'),
    jsonb_build_object('key', 'human_success', 'label', 'Human Success Integrity'),
    jsonb_build_object('key', 'desktop', 'label', 'Desktop Experience Integrity'),
    jsonb_build_object('key', 'strategic_intelligence', 'label', 'Strategic Intelligence Integrity'),
    jsonb_build_object('key', 'governance', 'label', 'Governance Integrity')
  );

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'reviews_enabled', v_settings.reviews_enabled,
    'show_critical_findings', v_settings.show_critical_findings,
    'philosophy', 'Aipify evaluates itself. Humans govern improvements.',
    'safety_note', 'Integrity scores are never inflated. Quality concerns are never concealed.',
    'integrity_score', v_score->'integrity_score',
    'integrity_band', v_score->'integrity_band',
    'integrity_band_label', v_score->'integrity_band_label',
    'score_components', v_score->'components',
    'review_queue', v_reviews,
    'findings', case when v_settings.show_critical_findings then v_findings else
      (select coalesce(jsonb_agg(x), '[]'::jsonb) from jsonb_array_elements(v_findings) x
       where x->>'severity' != 'critical_review_required') end,
    'actions', v_actions,
    'deprecated_assets', v_deprecated,
    'briefings', v_briefings,
    'integrity_trends', v_trends,
    'review_domains', v_domains,
    'review_frequencies', jsonb_build_array(
      jsonb_build_object('key', 'weekly', 'label', 'Weekly', 'purpose', 'Identify emerging issues'),
      jsonb_build_object('key', 'monthly', 'label', 'Monthly', 'purpose', 'Evaluate trends'),
      jsonb_build_object('key', 'quarterly', 'label', 'Quarterly', 'purpose', 'Assess strategic quality'),
      jsonb_build_object('key', 'annual', 'label', 'Annual', 'purpose', 'Review long-term alignment')
    ),
    'integrations', jsonb_build_object(
      'learning_engine', 'Emerging quality issues and improvement opportunities',
      'strategic_intelligence', 'High-value integrity investments',
      'outcomes_engine', 'Recommendation and marketplace effectiveness',
      'governance', 'Review workflows and approval requirements',
      'trust_engine', 'Transparent findings and explanations',
      'executive_briefing', 'Integrity trends and critical findings',
      'knowledge_center', 'Outdated content and gap identification'
    ),
    'self_awareness_platform_integrity_blueprint', public._sapibp87_self_awareness_platform_integrity_block(v_tenant_id)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve ALL repo Phase 87 fields; append blueprint framing
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_integrity_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_score numeric;
  v_band text;
  v_open int;
  v_engagement jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select integrity_score, integrity_band into v_score, v_band
  from public.integrity_scores where tenant_id = v_tenant_id
  order by created_at desc limit 1;

  select count(*) into v_open from public.integrity_findings
  where tenant_id = v_tenant_id and status = 'open';

  v_engagement := public._sapibp87_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'integrity_score', coalesce(v_score, 0),
    'integrity_band', v_band,
    'integrity_band_label', public._int_band_label(coalesce(v_band, 'improvements_recommended')),
    'open_findings', v_open,
    'philosophy', 'Aipify evaluates itself. Humans govern improvements.',
    'human_oversight_required', true,
    'implementation_blueprint_phase87', jsonb_build_object(
      'phase', 'Phase 87 — Self-Awareness & Platform Integrity Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE87_SELF_AWARENESS_PLATFORM_INTEGRITY.md',
      'engine_phase', 'Repo Phase 87 Self-Awareness & Platform Integrity',
      'route', '/app/integrity'
    ),
    'blueprint_mission', public._sapibp87_mission(),
    'blueprint_philosophy', public._sapibp87_philosophy(),
    'blueprint_abos_principle', public._sapibp87_abos_principle(),
    'blueprint_engagement_summary', v_engagement,
    'blueprint_note', 'Self-Awareness & Platform Integrity (ABOS Phase 87) — continuous self-monitoring and responsible self-improvement. Distinct from Curiosity & Discovery A.87 at /app/curiosity-discovery-engine.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._sapibp87_distinction_note() to authenticated;
grant execute on function public._sapibp87_mission() to authenticated;
grant execute on function public._sapibp87_philosophy() to authenticated;
grant execute on function public._sapibp87_abos_principle() to authenticated;
grant execute on function public._sapibp87_vision() to authenticated;
grant execute on function public._sapibp87_objectives() to authenticated;
grant execute on function public._sapibp87_platform_health_monitoring() to authenticated;
grant execute on function public._sapibp87_self_observation_examples() to authenticated;
grant execute on function public._sapibp87_capability_boundaries() to authenticated;
grant execute on function public._sapibp87_self_improvement_opportunities() to authenticated;
grant execute on function public._sapibp87_integrity_safeguards() to authenticated;
grant execute on function public._sapibp87_companion_guidance() to authenticated;
grant execute on function public._sapibp87_self_love_connection() to authenticated;
grant execute on function public._sapibp87_trust_connection() to authenticated;
grant execute on function public._sapibp87_privacy_principles() to authenticated;
grant execute on function public._sapibp87_dogfooding() to authenticated;
grant execute on function public._sapibp87_integration_links() to authenticated;
grant execute on function public._sapibp87_engagement_summary(uuid) to authenticated;
grant execute on function public._sapibp87_success_criteria(uuid) to authenticated;
grant execute on function public._sapibp87_self_awareness_platform_integrity_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'integrity-blueprint-phase87', 'Self-Awareness & Platform Integrity Engine (ABOS Phase 87)',
  'Self-Awareness & Platform Integrity — extends repo Phase 87 with continuous self-monitoring, capability boundaries, integrity safeguards, companion guidance, and live success criteria.',
  'authenticated', 121
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'integrity-blueprint-phase87' and tenant_id is null
);
