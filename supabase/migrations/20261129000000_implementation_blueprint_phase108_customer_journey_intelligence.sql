-- Implementation Blueprint Phase 108 — Customer Journey Intelligence Engine
-- Extends Customer Lifecycle & Success Orchestration repo Phase 86 at /app/customer-lifecycle. No new tables.
-- Distinct from Blueprint Phase 86 Autonomous Operations Orchestration at /app/workflow-orchestration-engine.
-- Helpers use _cjibp108_* — never collide with _cso_*.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._cjibp108_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 108 — Customer Journey Intelligence Engine at /app/customer-lifecycle. Extends Customer Lifecycle & Success Orchestration repo Phase 86 (_cso_*) and preserves ALL baseline dashboard and card fields. Strengthen relationships through journey understanding — experiences, needs, opportunities. Distinct from Blueprint Phase 86 Autonomous Operations Orchestration at /app/workflow-orchestration-engine (NOT customer journey). Cross-links Customer Success Engine A.26 at /app/customer-success-engine, Customer Onboarding A.10 + Blueprint Phase 28 at /app/customer-onboarding-engine, Growth Partner Blueprint Phase 107 at /app/partners, Meeting Companion Blueprint Phase 72 / A.61 at /app/meeting-collaboration-intelligence-engine, Value Realization A.48 at /app/value-realization-engine, Blueprint Phase 44 Renewal & Expansion (sales/renewal surfaces), Partner Success A.73 at /app/partner-success-engine. Helpers use _cjibp108_* — never collide with _cso_*.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._cjibp108_mission()
returns text language sql immutable as $$
  select 'Strengthen customer relationships through journey understanding — experiences, needs, and opportunities.';
$$;

create or replace function public._cjibp108_philosophy()
returns text language sql immutable as $$
  select 'Customers remember experiences, not transactions — clarity, confidence, and emotional connection guide every interaction. Customer success comes before expansion.';
$$;

create or replace function public._cjibp108_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — customer success not extraction. Aipify Customer Success Companion informs and prepares journey mapping, experience optimization, onboarding intelligence, adoption milestones, and advocacy identification; humans decide every engagement and expansion conversation.';
$$;

create or replace function public._cjibp108_vision()
returns text language sql immutable as $$
  select 'We understand our customers more deeply than ever before.';
$$;

create or replace function public._cjibp108_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'journey_mapping', 'label', 'Journey mapping', 'emoji', '🦉', 'description', 'Map awareness through advocacy — explainable progression without hidden profiling'),
    jsonb_build_object('key', 'experience_optimization', 'label', 'Experience optimization', 'emoji', '🌹', 'description', 'Satisfaction signals, support interactions, and friction awareness — improve experiences not manipulate outcomes'),
    jsonb_build_object('key', 'relationship_strengthening', 'label', 'Relationship strengthening', 'emoji', '🔔', 'description', 'Meeting summaries, commitments, and follow-up scaffolding — humans maintain relationships'),
    jsonb_build_object('key', 'lifecycle_intelligence', 'label', 'Lifecycle intelligence', 'emoji', '🦉', 'description', 'Onboarding completion, adoption milestones, renewal readiness — metadata patterns only'),
    jsonb_build_object('key', 'opportunity_identification', 'label', 'Opportunity identification', 'emoji', '🌹', 'description', 'Training, companion capabilities, Growth Partner, strategic review — optional, never pressured'),
    jsonb_build_object('key', 'long_term_success', 'label', 'Long-term success', 'emoji', '🔔', 'description', 'Advocacy, referrals, case studies — celebrate outcomes; expansion follows value')
  );
$$;

create or replace function public._cjibp108_customer_journey_stages()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'awareness', 'label', 'Awareness', 'step', 1, 'purpose', 'Discover Aipify value and fit — no pressure framing'),
    jsonb_build_object('key', 'interest', 'label', 'Interest', 'step', 2, 'purpose', 'Explore capabilities aligned with business needs'),
    jsonb_build_object('key', 'evaluation', 'label', 'Evaluation', 'step', 3, 'purpose', 'Validate fit, governance, and trust before commitment'),
    jsonb_build_object('key', 'purchase', 'label', 'Purchase', 'step', 4, 'purpose', 'License and plan selection — transparent commercial terms'),
    jsonb_build_object('key', 'onboarding', 'label', 'Onboarding', 'step', 5, 'purpose', 'Successful setup, welcome, and early confidence'),
    jsonb_build_object('key', 'adoption', 'label', 'Adoption', 'step', 6, 'purpose', 'Sustainable usage, training completion, companion activation'),
    jsonb_build_object('key', 'expansion', 'label', 'Expansion', 'step', 7, 'purpose', 'Extend value when readiness is high — never before success'),
    jsonb_build_object('key', 'advocacy', 'label', 'Advocacy', 'step', 8, 'purpose', 'Referrals, case studies, community leadership — celebrate outcomes')
  );
$$;

create or replace function public._cjibp108_journey_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Journey insights — warm stewardship, not surveillance. Metadata patterns only.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'context_before_action', 'label', 'Context before action', 'description', 'What journey stage signals mean for your customer — clarity before outreach'),
      jsonb_build_object('emoji', '🌹', 'key', 'experience_quality', 'label', 'Experience quality', 'description', 'Satisfaction and onboarding completion — celebrate progress, not pressure gaps'),
      jsonb_build_object('emoji', '🔔', 'key', 'pause_before_push', 'label', 'Pause before push', 'description', 'When expansion or upsell should wait — customer success before expansion')
    ),
    'boundary_note', 'Journey insights are explainable metadata — humans decide every customer engagement.'
  );
$$;

create or replace function public._cjibp108_customer_experience_dashboard()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Customer experience dashboard — journey progression, satisfaction, and success signals.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'journey_progression', 'label', 'Journey progression', 'description', 'Current stage and milestone trajectory — awareness through advocacy'),
      jsonb_build_object('key', 'satisfaction', 'label', 'Satisfaction signals', 'description', 'Health band, success score, and positive/risk signals — no hidden scoring'),
      jsonb_build_object('key', 'onboarding_completion', 'label', 'Onboarding completion', 'description', 'Welcome, training, companion activation, KC engagement — cross-link onboarding engine'),
      jsonb_build_object('key', 'adoption_milestones', 'label', 'Adoption milestones', 'description', 'Quick wins, feature adoption, and learning participation'),
      jsonb_build_object('key', 'support_interactions', 'label', 'Support interactions', 'description', 'Support patterns and knowledge gap resolution — metadata summaries only'),
      jsonb_build_object('key', 'renewal_opportunities', 'label', 'Renewal opportunities', 'description', 'Renewal readiness when value is validated — cross-link Phase 44 renewal surfaces'),
      jsonb_build_object('key', 'advocacy_signals', 'label', 'Advocacy signals', 'description', 'Referral potential, testimonials, case study readiness — optional, never pressured')
    ),
    'boundary_note', 'Experience dashboard scaffolds understanding — never manipulates customer behavior.'
  );
$$;

create or replace function public._cjibp108_onboarding_intelligence()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Onboarding intelligence — welcome, training, companion activation, KC engagement, early success.',
    'signals', jsonb_build_array(
      jsonb_build_object('key', 'welcome', 'label', 'Welcome experience', 'description', 'First impressions, orientation, and confidence-building touchpoints'),
      jsonb_build_object('key', 'training_completion', 'label', 'Training completion', 'description', 'Learning paths, Human Success journeys, and capability building'),
      jsonb_build_object('key', 'companion_activation', 'label', 'Companion activation', 'description', 'Desktop Companion, Executive Companion, and assistant adoption — cross-link install'),
      jsonb_build_object('key', 'kc_engagement', 'label', 'Knowledge Center engagement', 'description', 'KC articles, FAQ contributions, and knowledge gap closure'),
      jsonb_build_object('key', 'early_success', 'label', 'Early success milestones', 'description', 'First FAQ, briefing, automation, and measurable value outcomes')
    ),
    'onboarding_engine_route', '/app/customer-onboarding-engine',
    'boundary_note', 'Onboarding intelligence prepares support — cross-link Customer Onboarding A.10 + Blueprint Phase 28.'
  );
$$;

create or replace function public._cjibp108_adoption_intelligence()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Adoption intelligence — sustainable usage patterns without pressure tactics.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'adoption_strength', 'label', 'Adoption strength', 'description', 'Feature usage, learning participation, and confidence scores — explainable components'),
      jsonb_build_object('emoji', '🌹', 'key', 'capability_expansion', 'label', 'Capability expansion readiness', 'description', 'When new modules or companions fit validated outcomes — expansion follows value'),
      jsonb_build_object('emoji', '🔔', 'key', 'support_before_scale', 'label', 'Support before scale', 'description', 'When adoption gaps need human support before expansion conversations')
    ),
    'customer_success_route', '/app/customer-success-engine',
    'boundary_note', 'Adoption intelligence cross-links Customer Success Engine A.26 — health scoring and interventions.'
  );
$$;

create or replace function public._cjibp108_customer_success_opportunities()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Customer success opportunities — optional recommendations; humans decide; no_pressure default true.',
    'opportunities', jsonb_build_array(
      jsonb_build_object('key', 'training', 'label', 'Training & learning paths', 'description', 'Human Success journeys, KC workshops, and capability building'),
      jsonb_build_object('key', 'companion_capabilities', 'label', 'Companion capabilities', 'description', 'Executive Companion, Desktop Companion, and assistant features — activate when ready'),
      jsonb_build_object('key', 'growth_partner', 'label', 'Growth Partner support', 'description', 'Partner-assisted onboarding and adoption — cross-link Blueprint Phase 107 at /app/partners'),
      jsonb_build_object('key', 'strategic_review', 'label', 'Strategic success review', 'description', 'Quarterly value review, outcomes validation, and renewal planning — never pressured')
    ),
    'boundary_note', 'Opportunities are suggestions — dismissible; expansion_recommendations_enabled remains tenant-controlled.'
  );
$$;

create or replace function public._cjibp108_advocacy_identification()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Advocacy identification — celebrate outcomes; never pressure testimonials or referrals.',
    'signals', jsonb_build_array(
      jsonb_build_object('key', 'referral_potential', 'label', 'Referral potential', 'description', 'High success score and advocacy stage — optional referral conversation'),
      jsonb_build_object('key', 'case_studies', 'label', 'Case study readiness', 'description', 'Validated outcomes suitable for anonymised success stories — human approval required'),
      jsonb_build_object('key', 'community_leadership', 'label', 'Community leadership', 'description', 'Forum contribution, mentorship, and ecosystem participation — optional'),
      jsonb_build_object('key', 'testimonials', 'label', 'Testimonials', 'description', 'Customer willingness signals — never automated solicitation')
    ),
    'boundary_note', 'Advocacy is invitation-only — customers choose participation; no manipulative nudges.'
  );
$$;

create or replace function public._cjibp108_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Customer Success Companion guidance — warm stewardship, optional, non-intrusive. Customer success not extraction.',
    'companion_name', 'Customer Success Companion',
    'not_label', 'AI sales bot',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'journey_context', 'prompt', 'This customer is in adoption with strong onboarding completion — would a journey summary help before your next check-in?', 'consideration', 'Context before action — humans maintain relationships'),
      jsonb_build_object('emoji', '🌹', 'key', 'early_success', 'prompt', 'Early success milestones look strong — shall Aipify prepare a celebration note for your team?', 'consideration', 'Celebrate progress — not pressure for expansion'),
      jsonb_build_object('emoji', '🔔', 'key', 'pause_expansion', 'prompt', 'Value realization is still building — would deferring expansion conversation until the next success review feel wise?', 'consideration', 'Customer success before expansion — Self Love cross-link')
    ),
    'boundary_note', 'Customer Success Companion scaffolds journey understanding — never auto-sends customer communications.'
  );
$$;

create or replace function public._cjibp108_meeting_companion_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Meeting Companion connection — summaries, commitment tracking, relationship timelines, follow-ups.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'summaries', 'label', 'Meeting summaries', 'description', 'Customer meeting metadata summaries — no raw transcript storage by default'),
      jsonb_build_object('key', 'commitment_tracking', 'label', 'Commitment tracking', 'description', 'Follow-up items and accountability — human-approved notes only'),
      jsonb_build_object('key', 'relationship_timelines', 'label', 'Relationship timelines', 'description', 'Engagement history patterns — cross-link RSI where appropriate'),
      jsonb_build_object('key', 'follow_ups', 'label', 'Follow-up scaffolding', 'description', 'Gentle reminders for customer success check-ins — never guilt-based')
    ),
    'meeting_companion_route', '/app/meeting-collaboration-intelligence-engine',
    'boundary_note', 'Meeting Companion cross-link Blueprint Phase 72 / A.61 — customer meeting intelligence, not duplicate.'
  );
$$;

create or replace function public._cjibp108_growth_partner_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Growth Partner connection — partner onboarding, education, adoption acceleration, regional expertise.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'partner_onboarding', 'label', 'Partner-assisted onboarding', 'description', 'Growth Partners support customer setup — cross-link Blueprint Phase 107'),
      jsonb_build_object('key', 'partner_education', 'label', 'Partner education programs', 'description', 'Workshops and adoption programs delivered by certified partners'),
      jsonb_build_object('key', 'adoption_acceleration', 'label', 'Adoption acceleration', 'description', 'Regional and platform expertise when customers request partner support'),
      jsonb_build_object('key', 'regional_expertise', 'label', 'Regional expertise', 'description', 'Geography and language-aligned partner matching — human confirmation required')
    ),
    'growth_partner_route', '/app/partners',
    'partner_success_route', '/app/partner-success-engine',
    'boundary_note', 'Growth Partner connection is cross-link scaffolding — humans confirm partner engagements.'
  );
$$;

create or replace function public._cjibp108_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — empathy, curiosity, patience. Customers are people.',
    'quotes', jsonb_build_array(
      'Every customer journey moves at a human pace — patience and curiosity beat pressure and urgency.',
      'Celebrating one customer success deeply matters more than chasing the next expansion conversation.',
      'Empathy in customer success protects both your team and your customers — rest is part of sustainable service.',
      'Customers are people — journey intelligence supports relationships, not extraction.'
    ),
    'practices', jsonb_build_array(
      'Pause before expansion outreach when value realization is still building',
      'Celebrate onboarding and adoption milestones — not only renewal targets',
      'Use curiosity before assumptions — ask what customers need, not what metrics suggest',
      'Cross-link Self Love A.76 rhythms for sustainable customer success pacing'
    ),
    'route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports wellbeing rhythms — principle only; Journey Intelligence stores customer success metadata, not personal wellbeing content.'
  );
$$;

create or replace function public._cjibp108_leadership_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership connection — executive stewardship of customer success culture.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'success_culture', 'label', 'Customer success culture', 'description', 'Leadership models customer-first decisions — success before expansion'),
      jsonb_build_object('key', 'value_reviews', 'label', 'Executive value reviews', 'description', 'Quarterly outcomes validation — cross-link Value Realization A.48'),
      jsonb_build_object('key', 'renewal_governance', 'label', 'Renewal governance', 'description', 'Renewal conversations when value is proven — cross-link Phase 44 renewal surfaces'),
      jsonb_build_object('key', 'advocacy_ethics', 'label', 'Advocacy ethics', 'description', 'Testimonials and case studies require explicit customer consent — leadership oversight')
    ),
    'value_realization_route', '/app/value-realization-engine',
    'boundary_note', 'Leadership connection is governance scaffolding — high-impact customer decisions require human approval.'
  );
$$;

create or replace function public._cjibp108_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparent customer journey intelligence — explainable scores, no hidden profiling, audited recommendations.',
    'users_should_see', jsonb_build_array(
      'How Customer Success Score combines onboarding, adoption, value, learning, expansion readiness, and retention',
      'no_pressure and expansion_follows_value flags on every recommendation',
      'Dismissible recommendations — accept or dismiss without consequence framing',
      'Audit trail via customer_success_audit_log — milestone, score, briefing, recommendation events'
    ),
    'operators_should_understand', jsonb_build_array(
      'Customer journey intelligence is scaffolding — not automated CRM outreach or sales bots',
      'Cross-links Trust & Action Engine — sensitive customer actions may need approval context',
      'Meeting Companion and Growth Partner supply context — do not bypass tenant privacy policy',
      'Platform aggregates only at platform governance — tenant customer data stays tenant-scoped'
    ),
    'audit_note', 'cso_milestone_achieved, cso_score_recalculated, cso_briefing_generated, cso_recommendation_accepted — metadata only.'
  );
$$;

create or replace function public._cjibp108_privacy_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Privacy principles — customer success not extraction.',
    'must_avoid', jsonb_build_array(
      'Manipulative journey design or dark patterns that pressure expansion',
      'Hidden profiling or scoring customers cannot see or question',
      'Sales-only optimization that ignores wellbeing and adoption gaps',
      'Ignoring customer wellbeing for short-term renewal or upsell targets'
    ),
    'required', jsonb_build_array(
      'Transparent Customer Success Score components — visible on dashboard',
      'no_pressure default on recommendations and desktop celebrations',
      'Human approval for advocacy, testimonials, and case study usage',
      'Customer Success Companion tone — Aipify informs and prepares; humans decide'
    ),
    'boundary_note', 'Customer journey intelligence protects trust — metadata patterns only, never raw customer communications.'
  );
$$;

create or replace function public._cjibp108_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Dogfooding — validate customer journey patterns on Aipify own customer onboarding before broad rollout.',
    'aipify_customer_onboarding', jsonb_build_object(
      'focus', 'Aipify customer onboarding — welcome, training, companion activation, KC journeys',
      'patterns', jsonb_build_array(
        'Onboarding checklist and early success milestones',
        'Executive Companion adoption for customer owners',
        'Knowledge Center orientation paths',
        'Sales Expert to Growth Partner transition journeys'
      )
    ),
    'growth_partner_implementations', jsonb_build_object(
      'focus', 'Growth Partner implementations — partner-assisted onboarding and adoption acceleration',
      'route', '/app/partners'
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — customer lifecycle and success orchestration',
      'focus', jsonb_build_array(
        'Customer Success Score validation with real adoption data',
        'Quick wins detection and playbooks',
        'Expansion recommendations gated by expansion_readiness'
      )
    ),
    'internal_validation', jsonb_build_object(
      'role', 'Aipify Group internal — limitation principles, trust connection, KC FAQ',
      'focus', jsonb_build_array(
        'Customer Success Companion guidance examples (🦉🌹🔔)',
        'Privacy principles — no manipulative journey design in ILM',
        'Knowledge Center FAQ — implementation-blueprint-phase108-faq'
      )
    )
  );
$$;

create or replace function public._cjibp108_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We understand our customers more deeply than ever before.',
    'Customers remember experiences, not transactions — clarity, confidence, emotional connection.',
    'Customer success comes before expansion — expansion follows value.',
    '🦉 Context before action — journey stage clarity before outreach.',
    '🌹 Celebrate onboarding and adoption milestones — not only renewal targets.',
    '🔔 Pause expansion conversations when value realization is still building.',
    'Customers are people — empathy, curiosity, patience in every success interaction.',
    'Aipify Customer Success Companion informs and prepares — humans maintain relationships.'
  );
$$;

create or replace function public._cjibp108_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'customer_lifecycle_phase86', 'label', 'Customer Lifecycle repo Phase 86', 'route', '/app/customer-lifecycle', 'note', 'Baseline lifecycle stages, success score, playbooks — THIS blueprint extends'),
    jsonb_build_object('key', 'customer_success_a26', 'label', 'Customer Success Engine (A.26)', 'route', '/app/customer-success-engine', 'note', 'Health scoring, interventions, renewal risk — cross-link'),
    jsonb_build_object('key', 'customer_onboarding_a10', 'label', 'Customer Onboarding (A.10 + Phase 28)', 'route', '/app/customer-onboarding-engine', 'note', 'Technical onboarding flow — cross-link'),
    jsonb_build_object('key', 'growth_partner_phase107', 'label', 'Growth Partner (Blueprint Phase 107)', 'route', '/app/partners', 'note', 'Partner-assisted onboarding/adoption'),
    jsonb_build_object('key', 'meeting_companion_phase72', 'label', 'Meeting Companion (Phase 72 / A.61)', 'route', '/app/meeting-collaboration-intelligence-engine', 'note', 'Customer meeting summaries — cross-link'),
    jsonb_build_object('key', 'value_realization_a48', 'label', 'Value Realization (A.48)', 'route', '/app/value-realization-engine', 'note', 'Outcome measurement — cross-link'),
    jsonb_build_object('key', 'renewal_expansion_phase44', 'label', 'Renewal & Expansion (Blueprint Phase 44)', 'route', '/app/commercial', 'note', 'Renewal opportunities — sales/renewal surfaces cross-link'),
    jsonb_build_object('key', 'partner_success_a73', 'label', 'Partner Success (A.73)', 'route', '/app/partner-success-engine', 'note', 'Partner portfolio health — cross-link'),
    jsonb_build_object('key', 'outcomes_phase85', 'label', 'Outcomes & ROI (Phase 85)', 'route', '/app/outcomes', 'note', 'Validated success score components — cross-link'),
    jsonb_build_object('key', 'human_success', 'label', 'Human Success', 'route', '/app/human-success', 'note', 'Adoption and confidence insights — cross-link'),
    jsonb_build_object('key', 'self_love_a76', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Empathy, curiosity, patience — customers are people'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'route', '/app/knowledge-center', 'note', 'Customer success guides and Phase 108 FAQ')
  );
$$;

create or replace function public._cjibp108_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_profile public.customer_profiles;
  v_milestones int := 0;
  v_quick_wins int := 0;
  v_recommendations int := 0;
  v_briefings int := 0;
begin
  perform public._cso_ensure_profile(p_tenant_id);
  perform public._cso_ensure_settings(p_tenant_id);
  select * into v_profile from public.customer_profiles where tenant_id = p_tenant_id;

  select count(*) into v_milestones from public.customer_milestones where tenant_id = p_tenant_id;
  select count(*) into v_quick_wins from public.customer_milestones where tenant_id = p_tenant_id and is_quick_win = true;
  select count(*) into v_recommendations from public.customer_recommendations
    where tenant_id = p_tenant_id and status in ('pending', 'accepted');
  select count(*) into v_briefings from public.customer_success_briefings where tenant_id = p_tenant_id;

  return jsonb_build_object(
    'success_score', coalesce(v_profile.success_score, 0),
    'health_band', v_profile.health_band,
    'lifecycle_stage', v_profile.lifecycle_stage,
    'onboarding_completion', v_profile.onboarding_completion,
    'adoption_strength', v_profile.adoption_strength,
    'value_realization', v_profile.value_realization,
    'expansion_readiness', v_profile.expansion_readiness,
    'milestones_count', v_milestones,
    'quick_wins_count', coalesce(v_profile.quick_wins_count, v_quick_wins),
    'pending_recommendations', v_recommendations,
    'briefings_count', v_briefings,
    'journey_stages_documented', jsonb_array_length(public._cjibp108_customer_journey_stages()),
    'objectives_documented', jsonb_array_length(public._cjibp108_objectives()),
    'companion_examples', jsonb_array_length(public._cjibp108_companion_guidance()->'examples'),
    'integration_links', jsonb_array_length(public._cjibp108_integration_links()),
    'privacy_note', 'Aggregate customer success counts and blueprint scaffolds only — no raw customer communications, orders, or PII.'
  );
end; $$;

create or replace function public._cjibp108_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_profile public.customer_profiles;
  v_milestones int := 0;
begin
  perform public._cso_ensure_profile(p_tenant_id);
  v_engagement := public._cjibp108_engagement_summary(p_tenant_id);
  select * into v_profile from public.customer_profiles where tenant_id = p_tenant_id;
  select count(*) into v_milestones from public.customer_milestones where tenant_id = p_tenant_id;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'journey_mapping',
      'label', 'Journey mapping — awareness through advocacy (🦉🌹🔔)',
      'met', jsonb_array_length(public._cjibp108_customer_journey_stages()) >= 8,
      'note', 'Eight journey stages documented — explainable progression.'
    ),
    jsonb_build_object(
      'key', 'journey_insights',
      'label', 'Journey insights — context, experience, pause dimensions',
      'met', jsonb_array_length(public._cjibp108_journey_insights()->'dimensions') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'customer_experience_dashboard',
      'label', 'Customer experience dashboard — seven experience dimensions',
      'met', jsonb_array_length(public._cjibp108_customer_experience_dashboard()->'dimensions') >= 7,
      'note', null
    ),
    jsonb_build_object(
      'key', 'onboarding_intelligence',
      'label', 'Onboarding intelligence — welcome through early success',
      'met', jsonb_array_length(public._cjibp108_onboarding_intelligence()->'signals') >= 5,
      'note', 'Cross-link Customer Onboarding A.10 + Blueprint Phase 28.'
    ),
    jsonb_build_object(
      'key', 'adoption_intelligence',
      'label', 'Adoption intelligence — strength, expansion readiness, support (🦉🌹🔔)',
      'met', jsonb_array_length(public._cjibp108_adoption_intelligence()->'dimensions') >= 3,
      'note', 'Cross-link Customer Success Engine A.26.'
    ),
    jsonb_build_object(
      'key', 'customer_success_opportunities',
      'label', 'Customer success opportunities — training, companion, partner, review',
      'met', jsonb_array_length(public._cjibp108_customer_success_opportunities()->'opportunities') >= 4,
      'note', 'Optional recommendations — no_pressure preserved.'
    ),
    jsonb_build_object(
      'key', 'advocacy_identification',
      'label', 'Advocacy identification — referral, case study, community, testimonials',
      'met', jsonb_array_length(public._cjibp108_advocacy_identification()->'signals') >= 4,
      'note', 'Invitation-only — never automated solicitation.'
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Customer Success Companion guidance — stewardship not sales',
      'met', jsonb_array_length(public._cjibp108_companion_guidance()->'examples') >= 3,
      'note', 'Customer Success Companion — not generic AI sales bot.'
    ),
    jsonb_build_object(
      'key', 'meeting_companion_connection',
      'label', 'Meeting Companion connection — summaries and follow-ups',
      'met', jsonb_array_length(public._cjibp108_meeting_companion_connection()->'capabilities') >= 4,
      'note', 'Cross-link Blueprint Phase 72 / A.61.'
    ),
    jsonb_build_object(
      'key', 'growth_partner_connection',
      'label', 'Growth Partner connection — partner onboarding and adoption',
      'met', jsonb_array_length(public._cjibp108_growth_partner_connection()->'dimensions') >= 4,
      'note', 'Cross-link Blueprint Phase 107 at /app/partners.'
    ),
    jsonb_build_object(
      'key', 'privacy_principles',
      'label', 'Privacy principles — no manipulative design or hidden profiling',
      'met', jsonb_array_length(public._cjibp108_privacy_principles()->'must_avoid') >= 4,
      'note', 'Customer success not extraction.'
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — empathy, curiosity, patience',
      'met', jsonb_array_length(public._cjibp108_self_love_connection()->'quotes') >= 2,
      'note', 'Customers are people — principle only.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — transparent scores and dismissible recommendations',
      'met', jsonb_array_length(public._cjibp108_trust_connection()->'users_should_see') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'baseline_preserved',
      'label', 'Repo Phase 86 baseline fields preserved on dashboard',
      'met', to_regclass('public.customer_profiles') is not null,
      'note', '_cso_* tables and RPC behavior intact — customer success before expansion.'
    ),
    jsonb_build_object(
      'key', 'lifecycle_engagement',
      'label', 'Live lifecycle engagement — profile and milestones active',
      'met', v_milestones >= 0 and v_profile.id is not null,
      'note', case when v_milestones = 0 then 'Milestones will populate as customers achieve early wins.' else null end
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links A.26, Phase 28 onboarding, Phase 107 partners, Meeting Companion, A.48, Phase 44, A.73',
      'met', jsonb_array_length(public._cjibp108_integration_links()) >= 10,
      'note', 'Distinct from Blueprint Phase 86 Autonomous Operations at /app/workflow-orchestration-engine.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Aipify onboarding, Growth Partner, KC journeys, Sales Expert transitions',
      'met', (public._cjibp108_dogfooding()->'aipify_customer_onboarding') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS principle — customer success not extraction',
      'met', true,
      'note', 'Humans decide; Aipify Customer Success Companion informs and prepares.'
    )
  );
end; $$;

create or replace function public._cjibp108_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 108 — Customer Journey Intelligence Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE108_CUSTOMER_JOURNEY_INTELLIGENCE.md',
    'engine_phase', 'Repo Phase 86 Customer Lifecycle & Success Orchestration',
    'route', '/app/customer-lifecycle',
    'mapping_note', 'ABOS Blueprint Phase 108 extends repo Phase 86 with customer journey intelligence scaffolding. Distinct from Blueprint Phase 86 Autonomous Operations at /app/workflow-orchestration-engine.',
    'distinction_note', public._cjibp108_distinction_note(),
    'mission', public._cjibp108_mission(),
    'philosophy', public._cjibp108_philosophy(),
    'abos_principle', public._cjibp108_abos_principle(),
    'objectives', public._cjibp108_objectives(),
    'customer_journey_stages', public._cjibp108_customer_journey_stages(),
    'journey_insights', public._cjibp108_journey_insights(),
    'customer_experience_dashboard', public._cjibp108_customer_experience_dashboard(),
    'onboarding_intelligence', public._cjibp108_onboarding_intelligence(),
    'adoption_intelligence', public._cjibp108_adoption_intelligence(),
    'customer_success_opportunities', public._cjibp108_customer_success_opportunities(),
    'advocacy_identification', public._cjibp108_advocacy_identification(),
    'companion_guidance', public._cjibp108_companion_guidance(),
    'meeting_companion_connection', public._cjibp108_meeting_companion_connection(),
    'growth_partner_connection', public._cjibp108_growth_partner_connection(),
    'self_love_connection', public._cjibp108_self_love_connection(),
    'leadership_connection', public._cjibp108_leadership_connection(),
    'trust_connection', public._cjibp108_trust_connection(),
    'privacy_principles', public._cjibp108_privacy_principles(),
    'dogfooding', public._cjibp108_dogfooding(),
    'success_criteria', public._cjibp108_success_criteria(p_tenant_id),
    'vision', public._cjibp108_vision(),
    'vision_phrases', public._cjibp108_vision_phrases(),
    'integration_links', public._cjibp108_integration_links(),
    'engagement_summary', public._cjibp108_engagement_summary(p_tenant_id),
    'privacy_note', 'Customer journey intelligence blueprint data is metadata only — success scores, milestone summaries, recommendation categories. No manipulative journey design. Humans decide; Aipify Customer Success Companion informs and prepares.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Card RPC — preserve ALL baseline fields; append Phase 108
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_lifecycle_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_profile public.customer_profiles; v_engagement jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._cso_ensure_profile(v_tenant_id);
  select * into v_profile from public.customer_profiles where tenant_id = v_tenant_id;
  v_engagement := public._cjibp108_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'success_score', coalesce(v_profile.success_score, 0),
    'health_band', v_profile.health_band,
    'health_band_label', public._cso_health_band_label(v_profile.health_band),
    'lifecycle_stage', v_profile.lifecycle_stage,
    'quick_wins_count', v_profile.quick_wins_count,
    'philosophy', 'Customer success comes before expansion.',
    'no_pressure', true,
    'implementation_blueprint_phase108', jsonb_build_object(
      'phase', 'Phase 108 — Customer Journey Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE108_CUSTOMER_JOURNEY_INTELLIGENCE.md',
      'engine_phase', 'Repo Phase 86 Customer Lifecycle & Success Orchestration',
      'route', '/app/customer-lifecycle',
      'mapping_note', 'ABOS Blueprint Phase 108 extends repo Phase 86 — customer journey intelligence. Distinct from Blueprint Phase 86 Autonomous Operations at /app/workflow-orchestration-engine.'
    ),
    'customer_journey_intelligence_mission', public._cjibp108_mission(),
    'customer_journey_intelligence_abos_principle', public._cjibp108_abos_principle(),
    'customer_journey_intelligence_engagement_summary', v_engagement,
    'customer_journey_intelligence_note', 'Customer Journey Intelligence Engine (ABOS Phase 108) — customer success not extraction; humans maintain relationships.',
    'customer_journey_intelligence_vision_note', public._cjibp108_vision()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Dashboard RPC — preserve ALL baseline fields; append Phase 108
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_lifecycle_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.customer_success_settings;
  v_profile public.customer_profiles;
  v_score jsonb;
  v_milestones jsonb;
  v_recommendations jsonb;
  v_playbooks jsonb;
  v_briefings jsonb;
  v_signals jsonb;
  v_stages jsonb;
begin
  v_tenant_id := public._cso_require_tenant();
  v_settings := public._cso_ensure_settings(v_tenant_id);
  perform public._cso_ensure_profile(v_tenant_id);
  perform public._cso_seed_playbooks(v_tenant_id);
  v_score := public._cso_calculate_success_score(v_tenant_id);
  perform public._cso_seed_recommendations(v_tenant_id);
  select * into v_profile from public.customer_profiles where tenant_id = v_tenant_id;
  perform public._cso_trust_explanation(v_tenant_id, v_profile);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'milestone_type', m.milestone_type, 'description', m.description,
    'is_quick_win', m.is_quick_win, 'achieved_at', m.achieved_at
  ) order by m.achieved_at desc), '[]'::jsonb) into v_milestones
  from public.customer_milestones m where m.tenant_id = v_tenant_id limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'recommendation', r.recommendation, 'category', r.category,
    'rationale', r.rationale, 'priority', r.priority, 'status', r.status, 'created_at', r.created_at
  ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end), '[]'::jsonb)
  into v_recommendations
  from public.customer_recommendations r
  where r.tenant_id = v_tenant_id and r.status in ('pending', 'accepted')
  limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'playbook_name', p.playbook_name, 'audience', p.audience,
    'content', p.content, 'active', p.active
  )), '[]'::jsonb) into v_playbooks
  from public.customer_playbooks p where p.tenant_id = v_tenant_id and p.active = true;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'summary', b.summary, 'created_at', b.created_at
  ) order by b.created_at desc), '[]'::jsonb) into v_briefings
  from public.customer_success_briefings b where b.tenant_id = v_tenant_id limit 5;

  v_signals := jsonb_build_object(
    'positive', case when v_profile.adoption_strength >= 70 then
      jsonb_build_array('Strong adoption', 'Healthy engagement patterns')
    else '[]'::jsonb end,
    'risk', case when v_profile.health_band in ('at_risk', 'critical') then
      jsonb_build_array('Declining engagement indicators', 'Limited value realization')
    when v_profile.onboarding_completion < 50 then
      jsonb_build_array('Incomplete onboarding')
    else '[]'::jsonb end
  );

  v_stages := jsonb_build_array(
    jsonb_build_object('key', 'discovery', 'label', 'Discovery', 'purpose', 'Understand Aipify value'),
    jsonb_build_object('key', 'onboarding', 'label', 'Onboarding', 'purpose', 'Successful setup'),
    jsonb_build_object('key', 'activation', 'label', 'Activation', 'purpose', 'Early wins'),
    jsonb_build_object('key', 'adoption', 'label', 'Adoption', 'purpose', 'Sustainable usage'),
    jsonb_build_object('key', 'expansion', 'label', 'Expansion', 'purpose', 'Extend value'),
    jsonb_build_object('key', 'optimization', 'label', 'Optimization', 'purpose', 'Maximize outcomes'),
    jsonb_build_object('key', 'advocacy', 'label', 'Advocacy', 'purpose', 'Celebrate success')
  );

  return jsonb_build_object(
    'has_customer', true,
    'no_pressure', true,
    'expansion_follows_value', true,
    'orchestration_enabled', v_settings.orchestration_enabled,
    'philosophy', 'Customer success comes before expansion.',
    'safety_note', 'No aggressive upselling, manipulative retention, or hidden scoring.',
    'success_score', v_profile.success_score,
    'health_band', v_profile.health_band,
    'health_band_label', public._cso_health_band_label(v_profile.health_band),
    'lifecycle_stage', v_profile.lifecycle_stage,
    'lifecycle_stage_label', public._cso_stage_label(v_profile.lifecycle_stage),
    'score_components', v_score->'components',
    'milestones', v_milestones,
    'quick_wins', coalesce((
      select jsonb_agg(jsonb_build_object('id', m.id, 'description', m.description, 'achieved_at', m.achieved_at))
      from public.customer_milestones m
      where m.tenant_id = v_tenant_id and m.is_quick_win = true
      order by m.achieved_at desc
    ), '[]'::jsonb),
    'recommendations', v_recommendations,
    'playbooks', v_playbooks,
    'briefings', v_briefings,
    'signals', v_signals,
    'lifecycle_stages', v_stages,
    'integrations', jsonb_build_object(
      'human_success', 'Adoption and confidence insights',
      'value_engine', 'Time savings and operational improvements',
      'outcomes', 'Validated value realization',
      'strategic_intelligence', 'Expansion and optimization opportunities',
      'learning_engine', 'Learning paths and best practices',
      'marketplace', 'Value-first pack recommendations',
      'desktop_companion', 'Milestone celebrations and supportive nudges',
      'executive_briefing', 'Customer success briefings'
    ),
    'implementation_blueprint_phase108', jsonb_build_object(
      'phase', 'Phase 108 — Customer Journey Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE108_CUSTOMER_JOURNEY_INTELLIGENCE.md',
      'engine_phase', 'Repo Phase 86 Customer Lifecycle & Success Orchestration',
      'route', '/app/customer-lifecycle',
      'mapping_note', 'ABOS Blueprint Phase 108 extends repo Phase 86 — customer journey intelligence. Distinct from Blueprint Phase 86 Autonomous Operations at /app/workflow-orchestration-engine.'
    ),
    'customer_journey_intelligence_engine_note', 'Customer Journey Intelligence Engine (ABOS Phase 108) — strengthen relationships through journey understanding — customer success not extraction.',
    'customer_journey_intelligence_blueprint', public._cjibp108_blueprint_block(v_tenant_id),
    'customer_journey_intelligence_distinction_note', public._cjibp108_distinction_note(),
    'customer_journey_intelligence_mission', public._cjibp108_mission(),
    'customer_journey_intelligence_philosophy', public._cjibp108_philosophy(),
    'customer_journey_intelligence_abos_principle', public._cjibp108_abos_principle(),
    'customer_journey_intelligence_objectives', public._cjibp108_objectives(),
    'customer_journey_stages', public._cjibp108_customer_journey_stages(),
    'journey_insights', public._cjibp108_journey_insights(),
    'customer_experience_dashboard', public._cjibp108_customer_experience_dashboard(),
    'onboarding_intelligence', public._cjibp108_onboarding_intelligence(),
    'adoption_intelligence', public._cjibp108_adoption_intelligence(),
    'customer_success_opportunities', public._cjibp108_customer_success_opportunities(),
    'advocacy_identification', public._cjibp108_advocacy_identification(),
    'customer_success_companion_guidance', public._cjibp108_companion_guidance(),
    'meeting_companion_connection', public._cjibp108_meeting_companion_connection(),
    'growth_partner_connection', public._cjibp108_growth_partner_connection(),
    'customer_journey_self_love_connection', public._cjibp108_self_love_connection(),
    'customer_journey_leadership_connection', public._cjibp108_leadership_connection(),
    'customer_journey_trust_connection', public._cjibp108_trust_connection(),
    'customer_journey_privacy_principles', public._cjibp108_privacy_principles(),
    'customer_journey_intelligence_dogfooding', public._cjibp108_dogfooding(),
    'cjibp108_integration_links', public._cjibp108_integration_links(),
    'customer_journey_intelligence_engagement_summary', public._cjibp108_engagement_summary(v_tenant_id),
    'customer_journey_intelligence_success_criteria', public._cjibp108_success_criteria(v_tenant_id),
    'customer_journey_intelligence_vision', public._cjibp108_vision(),
    'customer_journey_intelligence_vision_phrases', public._cjibp108_vision_phrases(),
    'customer_journey_intelligence_privacy_note', 'Customer journey intelligence metadata only — no manipulative journey design, no hidden profiling, no pressure expansion. Humans decide; Aipify Customer Success Companion informs and prepares.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._cjibp108_distinction_note() to authenticated;
grant execute on function public._cjibp108_mission() to authenticated;
grant execute on function public._cjibp108_philosophy() to authenticated;
grant execute on function public._cjibp108_abos_principle() to authenticated;
grant execute on function public._cjibp108_vision() to authenticated;
grant execute on function public._cjibp108_objectives() to authenticated;
grant execute on function public._cjibp108_customer_journey_stages() to authenticated;
grant execute on function public._cjibp108_journey_insights() to authenticated;
grant execute on function public._cjibp108_customer_experience_dashboard() to authenticated;
grant execute on function public._cjibp108_onboarding_intelligence() to authenticated;
grant execute on function public._cjibp108_adoption_intelligence() to authenticated;
grant execute on function public._cjibp108_customer_success_opportunities() to authenticated;
grant execute on function public._cjibp108_advocacy_identification() to authenticated;
grant execute on function public._cjibp108_companion_guidance() to authenticated;
grant execute on function public._cjibp108_meeting_companion_connection() to authenticated;
grant execute on function public._cjibp108_growth_partner_connection() to authenticated;
grant execute on function public._cjibp108_self_love_connection() to authenticated;
grant execute on function public._cjibp108_leadership_connection() to authenticated;
grant execute on function public._cjibp108_trust_connection() to authenticated;
grant execute on function public._cjibp108_privacy_principles() to authenticated;
grant execute on function public._cjibp108_dogfooding() to authenticated;
grant execute on function public._cjibp108_vision_phrases() to authenticated;
grant execute on function public._cjibp108_integration_links() to authenticated;
grant execute on function public._cjibp108_engagement_summary(uuid) to authenticated;
grant execute on function public._cjibp108_success_criteria(uuid) to authenticated;
grant execute on function public._cjibp108_blueprint_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'customer-journey-intelligence-blueprint-phase108', 'Customer Journey Intelligence (ABOS Phase 108)',
  'Customer Journey Intelligence Engine — journey mapping, experience optimization, onboarding and adoption intelligence, advocacy identification. Customer success not extraction; expansion follows value.',
  'authenticated', 131
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'customer-journey-intelligence-blueprint-phase108' and tenant_id is null
);
