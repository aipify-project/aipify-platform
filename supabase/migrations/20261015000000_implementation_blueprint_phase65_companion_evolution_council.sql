-- Implementation Blueprint Phase 65 — Companion Evolution Council Engine
-- Extends AI Ethics & Responsible Use Engine (Phase A.46) at /app/ai-ethics-responsible-use-engine.
-- Layered on Phase 54 (_escgbp_*) companion ethics scaffolds — all Phase 54 fields preserved.
-- No new tables — metadata helpers and dashboard/card RPC extensions only.

-- ---------------------------------------------------------------------------
-- Distinction & static blueprint helpers (_cecbp_*)
-- ---------------------------------------------------------------------------

create or replace function public._cecbp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 65 — Companion Evolution Council Engine extends AI Ethics & Responsible Use Engine Phase A.46 at /app/ai-ethics-responsible-use-engine, layered on Phase 54 (_escgbp_*) companion ethics and governance scaffolds — council framework for values-driven capability review. Distinct from Growth & Evolution A.81 at /app/growth-evolution-engine (Phase 58 _cgadbp_companion_evolution_principles — org growth/adaptation cross-link only), Evolution Governance Phase 84 at /app/evolution (tenant software evolution proposals — cross-link), Innovation Lab Phase 96 at /app/innovation-lab, Governance & Policy A.14 at /app/governance-policy-engine, Learning Engine repo Phase 65 (20260615400000_learning_engine_phase65.sql — feedback loop, not this council spec), and Goals & OKR Engine A.65 (repo phase number collision). Engine helpers: _aerue_* (A.46), _escgbp_* (Phase 54), _cecbp_* (Blueprint Phase 65). Metadata only — council is governance scaffold, not surveillance.';
$$;

create or replace function public._cecbp_mission()
returns text language sql immutable as $$
  select 'Ensure Aipify evolves responsibly by examining whether new capabilities strengthen or weaken founding principles — wisdom through restraint, not capability accumulation alone.';
$$;

create or replace function public._cecbp_philosophy()
returns text language sql immutable as $$
  select 'Not every capability that can be built should be built. Progress is evaluated through a values lens; companionship requires reflection. The council asks better questions before expanding what Aipify can do.';
$$;

create or replace function public._cecbp_abos_principle()
returns text language sql immutable as $$
  select '"What should we build?" matters more than "What can we build?" — Aipify Business Operating System (ABOS) earns long-term trust through wisdom, restraint, and values-driven evolution.';
$$;

create or replace function public._cecbp_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'ethical_reflection', 'label', 'Ethical reflection', 'description', 'Routine examination of whether proposed capabilities align with founding principles and companion ethics'),
    jsonb_build_object('key', 'companion_philosophy_reviews', 'label', 'Companion philosophy reviews', 'description', 'Periodic evaluation that Aipify remains warm, wise, human-centered, supportive, and trustworthy'),
    jsonb_build_object('key', 'capability_evaluation', 'label', 'Capability evaluation', 'description', 'Structured review of proposed features — intended benefits, risks, and principle alignment before build commitment'),
    jsonb_build_object('key', 'value_alignment', 'label', 'Value alignment assessments', 'description', 'Cross-link Purpose & Values A.82 and ethics use cases — capabilities must strengthen, not weaken, stated values'),
    jsonb_build_object('key', 'community_input', 'label', 'Community input', 'description', 'Voluntary user experiences, Sales Expert observations, and customer concerns — metadata only, inform not prescribe'),
    jsonb_build_object('key', 'long_term_stewardship', 'label', 'Long-term stewardship', 'description', 'Sustainable evolution — trust, dignity, and human agency preserved as capability grows')
  );
$$;

create or replace function public._cecbp_council_responsibilities()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'The Companion Evolution Council examines proposed capabilities through a values lens — humans decide; Aipify prepares transparent assessments.',
    'responsibilities', jsonb_build_array(
      jsonb_build_object('key', 'review_capabilities', 'label', 'Review proposed capabilities', 'description', 'Evaluate new features, skills, and companion behaviors before broad rollout'),
      jsonb_build_object('key', 'principles_alignment', 'label', 'Assess Aipify principles alignment', 'description', 'Core Foundation, Operating Principles, Trust Architecture, and companion ethics Phase 54 framing'),
      jsonb_build_object('key', 'unintended_consequences', 'label', 'Identify unintended consequences', 'description', 'Privacy, autonomy, dependency, alert fatigue, and dignity risks — escalate when uncertain'),
      jsonb_build_object('key', 'companion_experiences', 'label', 'Evaluate companion experiences', 'description', 'Warmth, clarity, honesty, and emotional safety — cross-link Companion Identity A.84 and Proactive Companion A.79'),
      jsonb_build_object('key', 'responsible_innovation', 'label', 'Encourage responsible innovation', 'description', 'Support thoughtful progress — restraint and reflection are features, not blockers')
    ),
    'boundary_note', 'Council complements Phase 54 ethics use case registry — does not replace Trust & Action Phase 30 execution gates or Human Oversight A.40 workflows.'
  );
$$;

create or replace function public._cecbp_guiding_questions()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Guiding questions — every capability proposal examined through human flourishing, trust, dignity, and consequence lenses.',
    'questions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'human_flourishing', 'question', 'Does this capability support human flourishing — or replace judgment, create dependency, or add unnecessary pressure?'),
      jsonb_build_object('emoji', '🌹', 'key', 'trust_impact', 'question', 'Will this increase or decrease trust — is the recommendation explainable, optional, and honest about uncertainty?'),
      jsonb_build_object('emoji', '❤️', 'key', 'dignity_autonomy', 'question', 'Does this respect dignity and autonomy — can users dismiss, modify, or decline without friction or guilt?'),
      jsonb_build_object('emoji', '🔔', 'key', 'unintended_consequences', 'question', 'What unintended consequences might emerge — privacy erosion, surveillance feel, alert fatigue, or values drift?')
    )
  );
$$;

create or replace function public._cecbp_representation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Diverse representation strengthens council judgment — multiple perspectives, one shared commitment to responsible evolution.',
    'representatives', jsonb_build_array(
      jsonb_build_object('key', 'leadership', 'label', 'Leadership', 'description', 'Strategic stewardship — long-term trust and values alignment'),
      jsonb_build_object('key', 'product_development', 'label', 'Product development', 'description', 'Capability feasibility, user experience, and build trade-offs'),
      jsonb_build_object('key', 'sales_experts', 'label', 'Sales Experts', 'description', 'Field observations from customer conversations — metadata summaries only'),
      jsonb_build_object('key', 'customer_representatives', 'label', 'Customer representatives', 'description', 'Pilot tenant feedback — Unonight and approved customer advocates'),
      jsonb_build_object('key', 'community_participants', 'label', 'Community participants', 'description', 'Voluntary ecosystem input — anonymized, inform not prescribe'),
      jsonb_build_object('key', 'ethics_advisors', 'label', 'Ethics advisors', 'description', 'Companion ethics, privacy, and governance specialists — cross-link Phase 54 scaffolds')
    ),
    'sales_expert_route', '/app/sales-expert-engine',
    'community_route', '/app/community'
  );
$$;

create or replace function public._cecbp_companion_philosophy_reviews()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion philosophy reviews — periodically confirm Aipify remains worthy of trust as capabilities grow.',
    'qualities', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'key', 'warm', 'label', 'Warm', 'description', 'Professional warmth without manipulation or false enthusiasm'),
      jsonb_build_object('emoji', '🦉', 'key', 'wise', 'label', 'Wise', 'description', 'Honest uncertainty, explainable recommendations, thoughtful restraint'),
      jsonb_build_object('emoji', '❤️', 'key', 'human_centered', 'label', 'Human-centered', 'description', 'Humans decide — Aipify informs, prepares, and supports'),
      jsonb_build_object('emoji', '🔔', 'key', 'supportive', 'label', 'Supportive', 'description', 'Helpful without pressure, guilt, or dependency framing'),
      jsonb_build_object('emoji', '🤝', 'key', 'trustworthy', 'label', 'Trustworthy', 'description', 'Transparent governance, metadata-only dashboards, audited exceptions')
    ),
    'review_cadence', jsonb_build_array(
      jsonb_build_object('key', 'philosophy_review', 'label', 'Companion philosophy review', 'frequency_days', 180, 'description', 'Warmth, wisdom, and trust calibration — cross-link Companion Identity A.84'),
      jsonb_build_object('key', 'capability_review', 'label', 'Capability proposal review', 'frequency_days', 90, 'description', 'New skills and companion behaviors — guiding questions applied'),
      jsonb_build_object('key', 'values_alignment_review', 'label', 'Values alignment review', 'frequency_days', 180, 'description', 'Cross-link Purpose & Values A.82 and ethics use case registry'),
      jsonb_build_object('key', 'stewardship_review', 'label', 'Long-term stewardship review', 'frequency_days', 365, 'description', 'Annual reflection on evolution pace, trust trends, and community input themes')
    ),
    'phase54_note', 'Phase 54 _escgbp_blueprint_companion_evolution_reviews() scaffolds ethics use case cadence — Phase 65 adds council-level philosophy and capability review framing.'
  );
$$;

create or replace function public._cecbp_community_feedback()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Community feedback informs council deliberation — voluntary, metadata-only, never surveillance.',
    'sources', jsonb_build_array(
      jsonb_build_object('key', 'user_experiences', 'label', 'User experiences', 'description', 'Voluntary companion experience observations — no raw chat or PII'),
      jsonb_build_object('key', 'sales_expert_observations', 'label', 'Sales Expert observations', 'description', 'Field metadata from /app/sales-expert-engine — customer concerns and improvement themes'),
      jsonb_build_object('key', 'customer_concerns', 'label', 'Customer concerns', 'description', 'Pilot tenant and advocate feedback — structured summaries only'),
      jsonb_build_object('key', 'improvement_suggestions', 'label', 'Improvement suggestions', 'description', 'Community intelligence governance category — inform council, humans decide')
    ),
    'privacy_note', 'Metadata and anonymized themes only — no email content, chat transcripts, or operational records in council RPC payloads.',
    'community_intelligence_route', '/app/community',
    'sales_expert_route', '/app/sales-expert-engine'
  );
$$;

create or replace function public._cecbp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love A.76 influences council culture — humility, reflection, and appreciation for diverse viewpoints.',
    'practices', jsonb_build_array(
      'Humility — willingness to reconsider and slow down when values are at stake',
      'Reflection — routine ethical pause before expanding capabilities',
      'Diverse viewpoints — council representation includes field, customer, and community voices',
      'Sustainable pace — growth sometimes requires slowing down long enough to ask better questions',
      'No perfectionism — honest progress over rushed capability launches'
    ),
    'reflection_phrase', 'Growth sometimes requires slowing down long enough to ask better questions.',
    'route', '/app/self-love-engine',
    'phase', 'A.76',
    'human_moments_route', '/app/gratitude-recognition-engine',
    'human_moments_phase', 53,
    'boundary_note', 'Human Moments Phase 53 handles consent-based life event recognition — Phase 65 council handles capability evolution governance.'
  );
$$;

create or replace function public._cecbp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust is why governance reviews occur — council decisions guided by transparency, human agency, and long-term stewardship.',
    'users_should_know', jsonb_build_array(
      'Council reviews examine whether new capabilities strengthen founding principles',
      'Community feedback contributes themes — humans decide outcomes, not automated council votes',
      'Phase 54 ethics use cases and Trust & Action Phase 30 gates remain authoritative for execution',
      'Metadata-only engagement summaries — no surveillance of individual user behavior',
      'Critical (level 4) actions remain prohibited for AI — human-only via /app/approvals'
    ),
    'operators_should_understand', jsonb_build_array(
      'Phase 65 complements Phase 54 — council framing on top of A.46 ethics registry',
      'Distinct from Evolution Governance Phase 84 — tenant software proposals, not ABOS capability philosophy',
      'Distinct from Innovation Lab Phase 96 — experiments require council values lens before production',
      'Learning Engine repo Phase 65 is product feedback loop — not this ABOS blueprint council',
      'Growth & Evolution A.81 Phase 58 cross-links org adaptation — council owns values-driven capability review'
    ),
    'approvals_route', '/app/approvals',
    'phase54_route', '/app/ai-ethics-responsible-use-engine'
  );
$$;

create or replace function public._cecbp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates Companion Evolution Council governance internally before external rollout.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — council reviews for companion capabilities, workflow automation, Human Moments, and Sales Coach evolution',
      'focus', jsonb_build_array(
        'Companion capability proposals — proactive nudges, identity adaptations, presence features',
        'Workflow automation Phase 40 — autonomy tier alignment with council guiding questions',
        'Human Moments Phase 53 — recognition vs capability expansion boundaries',
        'Sales Coach Phase 45/46 — field enablement evolution through values lens'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — customer representative feedback and capability review exercise',
      'focus', jsonb_build_array(
        'Commerce support capability proposals — ethics and council dual review',
        'Sales Expert observation themes — metadata summaries into council deliberation',
        'Community feedback scaffold validation — voluntary, anonymized themes',
        'Trust trend review alongside Phase 54 governance summary'
      )
    )
  );
$$;

create or replace function public._cecbp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'ethics_phase54', 'label', 'Ethics & Companion Governance Phase 54', 'route', '/app/ai-ethics-responsible-use-engine', 'note', 'Layered foundation — _escgbp_* companion ethics scaffolds preserved'),
    jsonb_build_object('key', 'growth_evolution', 'label', 'Growth & Evolution A.81 (Phase 58)', 'route', '/app/growth-evolution-engine', 'note', 'Org growth/adaptation — _cgadbp_companion_evolution_principles cross-link only'),
    jsonb_build_object('key', 'evolution_governance', 'label', 'Evolution Governance Phase 84', 'route', '/app/evolution', 'note', 'Tenant software evolution proposals — cross-link'),
    jsonb_build_object('key', 'innovation_lab', 'label', 'Innovation Lab Phase 96', 'route', '/app/innovation-lab', 'note', 'Experimentation — council values lens before production'),
    jsonb_build_object('key', 'governance_policy', 'label', 'Governance & Policy A.14', 'route', '/app/governance-policy-engine', 'note', 'Tenant policies — distinct from council capability review'),
    jsonb_build_object('key', 'trust_actions', 'label', 'Trust & Action Phase 30', 'route', '/app/approvals', 'note', 'Risk levels 0–4 — critical prohibited for AI'),
    jsonb_build_object('key', 'purpose_values', 'label', 'Purpose & Values A.82', 'route', '/app/purpose-values-engine', 'note', 'Values alignment assessments cross-link'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Humility and reflection in council culture'),
    jsonb_build_object('key', 'companion_identity', 'label', 'Companion Identity A.84', 'route', '/app/companion-identity-engine', 'note', 'Philosophy review warmth and trust calibration'),
    jsonb_build_object('key', 'proactive_companion', 'label', 'Proactive Companion A.79', 'route', '/app/proactive-companion-engine', 'note', 'Capability proposals for proactive assistance'),
    jsonb_build_object('key', 'sales_expert', 'label', 'Sales Expert OS A.95', 'route', '/app/sales-expert-engine', 'note', 'Field observations — metadata only'),
    jsonb_build_object('key', 'community', 'label', 'Community Intelligence Phase 89', 'route', '/app/community', 'note', 'Voluntary community feedback themes'),
    jsonb_build_object('key', 'human_moments', 'label', 'Human Moments Phase 53', 'route', '/app/gratitude-recognition-engine', 'note', 'Life event recognition — distinct consent model'),
    jsonb_build_object('key', 'learning_engine', 'label', 'Learning Engine (repo Phase 65)', 'route', '/app/learning', 'note', 'Product feedback loop — NOT this ABOS blueprint council')
  );
$$;

create or replace function public._cecbp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Aipify evolves thoughtfully.',
    '🦉 What should we build matters more than what can be built.',
    '🌹 Values-driven evolution strengthens long-term trust.',
    '❤️ Companionship requires reflection — humans decide pace and direction.',
    '🔔 Unintended consequences deserve honest examination before rollout.',
    '🤝 Community voices inform council deliberation — metadata only.',
    'Wisdom through restraint — capability growth serves founding principles.',
    'Aipify remains worthy of trust as capability grows.'
  );
$$;

-- ---------------------------------------------------------------------------
-- Live engagement summary (metadata from A.46 tables + audit counts)
-- ---------------------------------------------------------------------------

create or replace function public._cecbp_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_governance jsonb;
  v_approved int := 0;
  v_proposed int := 0;
  v_overdue int := 0;
  v_ethics_audit_events int := 0;
begin
  v_governance := public._escgbp_governance_summary(p_organization_id);
  v_approved := coalesce((v_governance->>'approved_use_cases')::int, 0);
  v_proposed := coalesce((v_governance->>'proposed_use_cases')::int, 0);
  v_overdue := coalesce((v_governance->>'overdue_reviews')::int, 0);

  select count(*) into v_ethics_audit_events
  from public.organization_audit_logs
  where organization_id = p_organization_id
    and entity_type = 'ai_ethics'
    and created_at > now() - interval '90 days';

  return jsonb_build_object(
    'approved_use_cases', v_approved,
    'proposed_use_cases', v_proposed,
    'overdue_ethics_reviews', v_overdue,
    'recent_ethics_audit_events', coalesce(v_ethics_audit_events, 0),
    'council_objectives_count', jsonb_array_length(public._cecbp_objectives()),
    'guiding_questions_count', jsonb_array_length(public._cecbp_guiding_questions()->'questions'),
    'governance_health', v_governance->>'governance_health',
    'privacy_note', 'Aggregate use case counts and ethics audit event counts only — no operational content or PII.',
    'summary_text', format(
      'Council engagement: %s approved use cases, %s proposed, %s overdue reviews, %s ethics audit events (90d).',
      v_approved, v_proposed, v_overdue, coalesce(v_ethics_audit_events, 0)
    )
  );
end; $$;

create or replace function public._cecbp_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_approved int := 0;
begin
  v_engagement := public._cecbp_engagement_summary(p_organization_id);
  v_approved := coalesce((v_engagement->>'approved_use_cases')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'objectives_documented',
      'label', 'Six council objectives documented — reflection through long-term stewardship',
      'met', jsonb_array_length(public._cecbp_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'council_responsibilities',
      'label', 'Council responsibilities — capability review through responsible innovation',
      'met', jsonb_array_length(public._cecbp_council_responsibilities()->'responsibilities') >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'guiding_questions',
      'label', 'Guiding questions — flourishing, trust, dignity, consequences 🦉🌹❤️🔔',
      'met', jsonb_array_length(public._cecbp_guiding_questions()->'questions') = 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'representation_principles',
      'label', 'Representation principles — leadership through ethics advisors',
      'met', jsonb_array_length(public._cecbp_representation_principles()->'representatives') >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'companion_philosophy_reviews',
      'label', 'Companion philosophy reviews — warm, wise, human-centered, supportive, trustworthy',
      'met', jsonb_array_length(public._cecbp_companion_philosophy_reviews()->'qualities') = 5,
      'note', '🌹🦉❤️🔔🤝 qualities scaffolded.'
    ),
    jsonb_build_object(
      'key', 'community_feedback',
      'label', 'Community feedback sources documented — metadata only',
      'met', jsonb_array_length(public._cecbp_community_feedback()->'sources') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'values_driven_evolution',
      'label', 'Values-driven evolution framing — ABOS principle documented',
      'met', length(public._cecbp_abos_principle()) > 50,
      'note', '"What should we build?" over "What can we build?"'
    ),
    jsonb_build_object(
      'key', 'approved_use_cases',
      'label', 'At least one approved AI use case supports council ethics registry',
      'met', v_approved >= 1,
      'note', case when v_approved = 0 then 'Propose and approve a use case via Phase 54 ethics workflow.' else null end
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links to Phase 54, Growth A.81, Evolution 84, Innovation Lab 96, Learning repo Phase 65',
      'met', jsonb_array_length(public._cecbp_integration_links()) >= 12,
      'note', null
    ),
    jsonb_build_object(
      'key', 'distinction_documented',
      'label', 'Distinction from Growth A.81, Evolution 84, Innovation Lab 96, Learning repo Phase 65, Goals A.65',
      'met', length(public._cecbp_distinction_note()) > 100,
      'note', 'Blueprint Phase 65 council complements Phase 54 ethics scaffolds.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- Card RPC — preserve Phase 54 + A.46; append Phase 65 metadata
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
    'implementation_blueprint_phase65', jsonb_build_object(
      'phase', 65,
      'title', 'Companion Evolution Council Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE65_COMPANION_EVOLUTION_COUNCIL.md',
      'engine_phase', 'Phase A.46 — AI Ethics & Responsible Use Engine',
      'route', '/app/ai-ethics-responsible-use-engine',
      'mapping_note', 'Council framework for values-driven capability review — layered on Phase 54.'
    ),
    'companion_governance_phase', 54,
    'companion_evolution_council_phase', 65,
    'escgbp_abos_principle', public._escgbp_blueprint_abos_principle(),
    'cecbp_abos_principle', public._cecbp_abos_principle(),
    'governance_summary', v_summary,
    'council_engagement_summary', public._cecbp_engagement_summary(v_org_id),
    'governance_health', v_summary->>'governance_health',
    'critical_prohibition_note', 'Trust & Action level 4 (critical) actions are prohibited for AI — human confirmation required.',
    'blueprint_note', 'Ethics, Safety & Companion Governance (Phase 54) + Companion Evolution Council (Phase 65) — extends A.46 with values-driven evolution framing.',
    'council_vision_phrase', 'Aipify evolves thoughtfully.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- Dashboard RPC — preserve ALL A.46 + Phase 54 fields; append Phase 65
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
    -- Phase 65 — Companion Evolution Council Engine
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
    'cecbp_vision_phrases', public._cecbp_vision_phrases()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

grant execute on function public._cecbp_distinction_note() to authenticated;
grant execute on function public._cecbp_mission() to authenticated;
grant execute on function public._cecbp_philosophy() to authenticated;
grant execute on function public._cecbp_abos_principle() to authenticated;
grant execute on function public._cecbp_objectives() to authenticated;
grant execute on function public._cecbp_council_responsibilities() to authenticated;
grant execute on function public._cecbp_guiding_questions() to authenticated;
grant execute on function public._cecbp_representation_principles() to authenticated;
grant execute on function public._cecbp_companion_philosophy_reviews() to authenticated;
grant execute on function public._cecbp_community_feedback() to authenticated;
grant execute on function public._cecbp_self_love_connection() to authenticated;
grant execute on function public._cecbp_trust_connection() to authenticated;
grant execute on function public._cecbp_dogfooding() to authenticated;
grant execute on function public._cecbp_integration_links() to authenticated;
grant execute on function public._cecbp_vision_phrases() to authenticated;
grant execute on function public._cecbp_engagement_summary(uuid) to authenticated;
grant execute on function public._cecbp_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'companion-evolution-council-blueprint-phase65', 'Companion Evolution Council (ABOS Phase 65)',
  'Companion Evolution Council Engine — values-driven capability review extending AI Ethics A.46 and Phase 54 companion governance.',
  'authenticated', 107
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'companion-evolution-council-blueprint-phase65' and tenant_id is null
);
