-- Implementation Blueprint Phase 116 — Trust, Reputation & Relationship Engine
-- Extends Trust & Reputation Engine (Phase A.72 + ABOS Phase 26 + Phase 57). No new tables.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._trrbp116_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 116 — Trust, Reputation & Relationship Engine at /app/trust-reputation-engine. Extends Trust & Reputation Engine Phase A.72, Blueprint Phase 26, and Blueprint Phase 57. Distinct from Trust Engine Phase 76 /app/trust (explainability and Trust Score — not reputation profiles). Trust & Action Phase 30 /app/approvals (action approval gates). Relationship Intelligence A.78 /app/relationship-intelligence-engine (personal/org relationship context). Gratitude & Recognition A.89 /app/gratitude-recognition-engine (recognition cross-link — do not duplicate). Trust Ethics Blueprint 98 /app/ai-ethics-responsible-use-engine. Growth Partner Ops Phase 114 /app/growth-partner-operations. Companion Marketplace Phase 113 /app/companion-marketplace. Marketplace Phase 112 /app/marketplace. Organizational Memory A.34 /app/organizational-memory-engine. Self Love A.76 /app/self-love-engine. NOT an employee rating system — relationship health, supportive not punitive. Metadata only — no PII, no hidden scoring. All Phase A.72, Phase 26, and Phase 57 dashboard fields preserved.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._trrbp116_blueprint_mission()
returns text language sql immutable as $$
  select 'Build, protect, and strengthen trust across customers, employees, Growth Partners, and the ecosystem — consistency, responsibility, and integrity over popularity.';
$$;

create or replace function public._trrbp116_blueprint_philosophy()
returns text language sql immutable as $$
  select 'Business is built on trust. Technology accelerates communication but trust remains human. People First — stewardship through responsibility. Trust is earned, never manipulated.';
$$;

create or replace function public._trrbp116_blueprint_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) strengthens relationships through transparent trust patterns — Aipify identifies, explains, and prepares; humans decide with dignity.';
$$;

create or replace function public._trrbp116_blueprint_vision()
returns text language sql immutable as $$
  select 'Organizations where trust is visible, relationships are cared for proactively, and reputation reflects consistent responsible behavior — not a popularity contest.';
$$;

create or replace function public._trrbp116_blueprint_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'strengthen_customer_relationships', 'label', 'Strengthen customer relationships', 'description', 'Proactive care for customer trust patterns — supportive intervention, not surveillance'),
    jsonb_build_object('key', 'improve_collaboration', 'label', 'Improve collaboration', 'description', 'Internal team and cross-functional relationship health indicators'),
    jsonb_build_object('key', 'increase_transparency', 'label', 'Increase transparency', 'description', 'Explainable trust signals — metrics never hidden; individuals understand assessments'),
    jsonb_build_object('key', 'reward_responsible_behavior', 'label', 'Reward responsible behavior', 'description', 'Recognition cross-linked with Gratitude & Recognition A.89 — celebrate values, not competition'),
    jsonb_build_object('key', 'identify_trust_risks_early', 'label', 'Identify trust risks early', 'description', 'Early warning signals trigger supportive intervention — not punishment'),
    jsonb_build_object('key', 'build_stronger_partnerships', 'label', 'Build stronger partnerships', 'description', 'Growth Partner trust model — partnership quality, not sales volume'),
    jsonb_build_object('key', 'preserve_reputation', 'label', 'Preserve reputation', 'description', 'Contextual reputation profiles — organizations, partners, contributors, publishers, training providers'),
    jsonb_build_object('key', 'healthier_ecosystems', 'label', 'Healthier ecosystems', 'description', 'Community and companion adoption relationship health — sustainable relationships over time')
  );
$$;

create or replace function public._trrbp116_trust_framework_dimensions()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'reliability', 'label', 'Reliability', 'description', 'Follow-through and dependable patterns over time'),
    jsonb_build_object('key', 'consistency', 'label', 'Consistency', 'description', 'Predictable behavior across interactions and modules'),
    jsonb_build_object('key', 'transparency', 'label', 'Transparency', 'description', 'Explainable signals — what influenced guidance and what was excluded'),
    jsonb_build_object('key', 'accountability', 'label', 'Accountability', 'description', 'Clear ownership and human review for trust expansion'),
    jsonb_build_object('key', 'responsiveness', 'label', 'Responsiveness', 'description', 'Timely engagement without pressure or guilt'),
    jsonb_build_object('key', 'governance_maturity', 'label', 'Governance Maturity', 'description', 'Policy adherence and ethical conduct alignment'),
    jsonb_build_object('key', 'knowledge_sharing', 'label', 'Knowledge Sharing', 'description', 'Open contribution patterns — cross-link Organizational Memory A.34'),
    jsonb_build_object('key', 'ethical_conduct', 'label', 'Ethical Conduct', 'description', 'Values-aligned behavior — cross-link Trust Ethics Blueprint 98'),
    jsonb_build_object('key', 'commitment_to_improvement', 'label', 'Commitment to Improvement', 'description', 'Trust recovery and improvement plans with dignity'),
    jsonb_build_object('key', 'relationship_health', 'label', 'Relationship Health', 'description', 'Patterns over time — no single metric defines trust')
  );
$$;

create or replace function public._trrbp116_relationship_health_categories()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'customer', 'label', 'Customer', 'description', 'Communication quality, engagement, support responsiveness, issue resolution trends, satisfaction signals, renewal confidence'),
    jsonb_build_object('key', 'growth_partner', 'label', 'Growth Partner', 'description', 'Implementation success, governance alignment, knowledge contributions, relationship continuity'),
    jsonb_build_object('key', 'executive', 'label', 'Executive', 'description', 'Leadership trust visibility, executive reporting rules, strategic relationship health'),
    jsonb_build_object('key', 'internal_team', 'label', 'Internal Team', 'description', 'Collaboration patterns, knowledge silos, team dynamics — supportive not punitive'),
    jsonb_build_object('key', 'vendor', 'label', 'Vendor', 'description', 'Vendor relationship indicators — responsiveness and accountability'),
    jsonb_build_object('key', 'companion_adoption', 'label', 'Companion Adoption', 'description', 'Companion adoption and appropriate reliance — cross-link Companion Marketplace Phase 113'),
    jsonb_build_object('key', 'community', 'label', 'Community', 'description', 'Community contribution and engagement health — cross-link Marketplace Phase 112')
  );
$$;

create or replace function public._trrbp116_reputation_profiles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'organizations', 'label', 'Organizations', 'description', 'Customer outcomes, governance compliance, long-term consistency — contextual not universal'),
    jsonb_build_object('key', 'growth_partners', 'label', 'Growth Partners', 'description', 'Implementation success, support effectiveness, training excellence — cross-link Phase 114'),
    jsonb_build_object('key', 'marketplace_contributors', 'label', 'Marketplace Contributors', 'description', 'Knowledge contributions and governance compliance — cross-link Phase 112'),
    jsonb_build_object('key', 'companion_publishers', 'label', 'Companion Publishers', 'description', 'Support quality and adoption outcomes — cross-link Phase 113'),
    jsonb_build_object('key', 'training_providers', 'label', 'Training Providers', 'description', 'Training participation and long-term consistency signals')
  );
$$;

create or replace function public._trrbp116_trust_insights_questions()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'strengthening', 'question', 'Where is trust strengthening?', 'intent', 'Proactive care — highlight positive patterns'),
    jsonb_build_object('key', 'deteriorating', 'question', 'Where is trust deteriorating?', 'intent', 'Supportive intervention — not surveillance'),
    jsonb_build_object('key', 'teams_need_support', 'question', 'Which teams need support?', 'intent', 'Identify collaboration gaps early'),
    jsonb_build_object('key', 'partners_excel', 'question', 'Which Growth Partners excel?', 'intent', 'Celebrate partnership quality'),
    jsonb_build_object('key', 'communication_gaps', 'question', 'Where are communication gaps emerging?', 'intent', 'Facilitate healthy dialogue'),
    jsonb_build_object('key', 'customers_need_intervention', 'question', 'Which customers may need intervention?', 'intent', 'Proactive care — dignity-first outreach recommendations')
  );
$$;

create or replace function public._trrbp116_early_warning_signals()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'reduced_engagement', 'label', 'Reduced engagement', 'description', 'Declining interaction patterns — suggest check-in, not judgment'),
    jsonb_build_object('key', 'delayed_responses', 'label', 'Delayed responses', 'description', 'Response time trends — supportive follow-up recommendations'),
    jsonb_build_object('key', 'escalating_conflicts', 'label', 'Escalating conflicts', 'description', 'Conflict pattern detection — de-escalation resources'),
    jsonb_build_object('key', 'declining_satisfaction', 'label', 'Declining satisfaction', 'description', 'Satisfaction signal trends — metadata only'),
    jsonb_build_object('key', 'repeated_misunderstandings', 'label', 'Repeated misunderstandings', 'description', 'Communication clarity gaps — template and coaching suggestions'),
    jsonb_build_object('key', 'companion_avoidance', 'label', 'Companion avoidance', 'description', 'Reduced companion engagement — respect boundaries, offer alternatives'),
    jsonb_build_object('key', 'knowledge_silos', 'label', 'Knowledge silos', 'description', 'Reduced knowledge sharing — cross-link Organizational Memory A.34'),
    jsonb_build_object('key', 'governance_concerns', 'label', 'Governance concerns', 'description', 'Policy adherence signals — cross-link Trust Ethics Blueprint 98')
  );
$$;

create or replace function public._trrbp116_recognition_types()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Celebrate values, not competition — cross-link Gratitude & Recognition A.89; do not duplicate recognition RPCs.',
    'recognition_route', '/app/gratitude-recognition-engine',
    'types', jsonb_build_array(
      jsonb_build_object('key', 'knowledge_sharing', 'label', 'Knowledge Sharing', 'description', 'Contributions that strengthen organizational knowledge'),
      jsonb_build_object('key', 'support_excellence', 'label', 'Support Excellence', 'description', 'Outstanding support responsiveness and resolution'),
      jsonb_build_object('key', 'customer_advocacy', 'label', 'Customer Advocacy', 'description', 'Customers who champion responsible partnership'),
      jsonb_build_object('key', 'growth_partner_excellence', 'label', 'Growth Partner Excellence', 'description', 'Partnership quality and long-term outcomes'),
      jsonb_build_object('key', 'governance_leadership', 'label', 'Governance Leadership', 'description', 'Ethical conduct and policy stewardship'),
      jsonb_build_object('key', 'community_contribution', 'label', 'Community Contribution', 'description', 'Ecosystem contributions — cross-link Marketplace Phase 112')
    )
  );
$$;

create or replace function public._trrbp116_trust_recovery_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'reflection_guides', 'label', 'Reflection guides', 'description', 'Structured reflection — dignity-first, no shaming'),
    jsonb_build_object('key', 'communication_templates', 'label', 'Communication templates', 'description', 'Constructive dialogue templates for trust repair'),
    jsonb_build_object('key', 'follow_up_recommendations', 'label', 'Follow-up recommendations', 'description', 'Gentle follow-up scheduling — cross-link Self Love A.76'),
    jsonb_build_object('key', 'improvement_plans', 'label', 'Improvement plans', 'description', 'Collaborative improvement plans with clear milestones'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility', 'description', 'Executive reporting when appropriate — transparent, not punitive'),
    jsonb_build_object('key', 'companion_coaching', 'label', 'Companion coaching', 'description', 'Aipify suggests resources and empathy — never authoritative judgment'),
    jsonb_build_object('key', 'progress_tracking', 'label', 'Progress tracking', 'description', 'Metadata-only progress signals — patterns over time')
  );
$$;

create or replace function public._trrbp116_companion_responsibilities()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'may', jsonb_build_array(
      'Identify trust and relationship patterns over time',
      'Encourage healthy communication and constructive dialogue',
      'Highlight unresolved issues with empathy',
      'Promote empathy and compassion in recommendations',
      'Suggest resources for trust recovery and improvement',
      'Facilitate knowledge sharing — cross-link Organizational Memory A.34'
    ),
    'must_avoid', jsonb_build_array(
      'Manipulation — no guilt, urgency traps, or pressure',
      'Bias amplification — surface patterns without stereotyping',
      'Shaming — dignity-first intervention always',
      'Authoritative judgment — Aipify informs and prepares; humans decide'
    )
  );
$$;

create or replace function public._trrbp116_growth_partner_trust_model()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Partnership quality, not sales volume — cross-link Growth Partner Ops Phase 114.',
    'growth_partner_route', '/app/growth-partner-operations',
    'areas', jsonb_build_array(
      jsonb_build_object('key', 'implementation_success', 'label', 'Implementation success', 'description', 'Successful deployments and adoption outcomes'),
      jsonb_build_object('key', 'customer_satisfaction', 'label', 'Customer satisfaction', 'description', 'Customer outcome signals — metadata only'),
      jsonb_build_object('key', 'governance_alignment', 'label', 'Governance alignment', 'description', 'Policy and ethics compliance'),
      jsonb_build_object('key', 'knowledge_contributions', 'label', 'Knowledge contributions', 'description', 'Partner knowledge sharing to ecosystem'),
      jsonb_build_object('key', 'support_effectiveness', 'label', 'Support effectiveness', 'description', 'Support quality and responsiveness'),
      jsonb_build_object('key', 'relationship_continuity', 'label', 'Relationship continuity', 'description', 'Long-term partnership patterns'),
      jsonb_build_object('key', 'training_excellence', 'label', 'Training excellence', 'description', 'Training participation and outcomes'),
      jsonb_build_object('key', 'long_term_outcomes', 'label', 'Long-term outcomes', 'description', 'Sustainable partnership results over time')
    )
  );
$$;

create or replace function public._trrbp116_enterprise_trust_governance()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'trust_visibility_levels', 'label', 'Trust visibility levels', 'description', 'Who sees what trust data — explainable access tiers'),
    jsonb_build_object('key', 'relationship_categories', 'label', 'Relationship categories', 'description', 'Configurable relationship health categories'),
    jsonb_build_object('key', 'recognition_programs', 'label', 'Recognition programs', 'description', 'Cross-link Gratitude & Recognition A.89 — tenant-configurable'),
    jsonb_build_object('key', 'escalation_procedures', 'label', 'Escalation procedures', 'description', 'Supportive escalation — cross-link Trust & Action Phase 30'),
    jsonb_build_object('key', 'executive_reporting_rules', 'label', 'Executive reporting rules', 'description', 'When and how executives see trust summaries'),
    jsonb_build_object('key', 'data_retention_policies', 'label', 'Data retention policies', 'description', 'Metadata retention with transparent boundaries'),
    jsonb_build_object('key', 'privacy_requirements', 'label', 'Privacy requirements', 'description', 'Consent boundaries and privacy expectations'),
    jsonb_build_object('key', 'companion_participation_boundaries', 'label', 'Companion participation boundaries', 'description', 'What Aipify may and may not do in trust assessments')
  );
$$;

create or replace function public._trrbp116_privacy_ethics_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'human_dignity', 'label', 'Human dignity', 'description', 'Every assessment respects individual and organizational dignity'),
    jsonb_build_object('key', 'privacy_expectations', 'label', 'Privacy expectations', 'description', 'Metadata only — no PII, no hidden scoring'),
    jsonb_build_object('key', 'transparency', 'label', 'Transparency', 'description', 'Metrics never hidden; individuals understand assessments'),
    jsonb_build_object('key', 'organizational_culture', 'label', 'Organizational culture', 'description', 'Trust patterns reflect culture — not imposed rankings'),
    jsonb_build_object('key', 'consent_boundaries', 'label', 'Consent boundaries', 'description', 'Explicit consent for expanded trust visibility'),
    jsonb_build_object('key', 'governance_frameworks', 'label', 'Governance frameworks', 'description', 'Cross-link Trust Ethics Blueprint 98 — explainable systems')
  );
$$;

create or replace function public._trrbp116_self_love_in_relationships()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love in relationships — reflection, constructive dialogue, compassion, personal accountability, boundary awareness, and growth mindsets.',
    'practices', jsonb_build_array(
      'Reflection — pause before reactive responses in strained relationships',
      'Constructive dialogue — compassionate communication templates',
      'Compassion — supportive tone during demanding periods',
      'Personal accountability — own your part without guilt',
      'Boundary awareness — respect limits in all relationship categories',
      'Growth mindsets — setbacks are learning, not failure'
    ),
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love is a principle — Trust & Reputation stores metadata signals, not wellbeing content.'
  );
$$;

create or replace function public._trrbp116_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Trust & Reputation A.72 + Blueprint 26/57', 'route', '/app/trust-reputation-engine', 'note', 'THIS blueprint extends — preserve all prior fields'),
    jsonb_build_object('label', 'Trust Engine Phase 76', 'route', '/app/trust', 'note', 'Explainability and Trust Score — distinct from reputation profiles'),
    jsonb_build_object('label', 'Trust & Action Phase 30', 'route', '/app/approvals', 'note', 'Action approval gates — cross-link escalation'),
    jsonb_build_object('label', 'Relationship Intelligence A.78', 'route', '/app/relationship-intelligence-engine', 'note', 'Personal/org relationship context'),
    jsonb_build_object('label', 'Gratitude & Recognition A.89', 'route', '/app/gratitude-recognition-engine', 'note', 'Recognition cross-link — do not duplicate RPCs'),
    jsonb_build_object('label', 'Trust Ethics Blueprint 98', 'route', '/app/ai-ethics-responsible-use-engine', 'note', 'Ethics governance cross-link'),
    jsonb_build_object('label', 'Growth Partner Ops Phase 114', 'route', '/app/growth-partner-operations', 'note', 'Partner trust model'),
    jsonb_build_object('label', 'Companion Marketplace Phase 113', 'route', '/app/companion-marketplace', 'note', 'Companion adoption relationships'),
    jsonb_build_object('label', 'Marketplace Phase 112', 'route', '/app/marketplace', 'note', 'Marketplace contributors'),
    jsonb_build_object('label', 'Organizational Memory A.34', 'route', '/app/organizational-memory-engine', 'note', 'Knowledge and trust outcomes')
  );
$$;

create or replace function public._trrbp116_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'NOT an employee rating system — relationship health indicators only',
    'Supportive intervention, not punishment or surveillance',
    'Metadata only — no PII, no raw conversations, no hidden scoring',
    'Patterns over time — no single metric defines trust',
    'Contextual reputation — not universal rankings',
    'Humans decide — Aipify identifies, explains, and prepares'
  );
$$;

create or replace function public._trrbp116_companion_adaptation()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'trust_pattern_awareness',
      'scenario', 'Thoughtful trust pattern awareness',
      'example', '🦉 Aipify noticed engagement with the support team has been steady while customer response times lengthened — here are patterns worth a supportive check-in when you are ready.'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'relationship_strength',
      'scenario', 'Celebrating relationship strength',
      'example', '🌹 Trust signals show consistent knowledge sharing from your operations team this quarter — a values-aligned pattern worth recognizing via Gratitude & Recognition.'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'gentle_trust_nudge',
      'scenario', 'Gentle trust recovery nudge',
      'example', '🔔 A gentle reminder — the trust recovery follow-up for the Growth Partner review is still open. Reflection guides are available when you are ready.'
    )
  );
$$;

create or replace function public._trrbp116_success_metrics()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'improved_retention', 'label', 'Improved retention', 'description', 'Healthier customer and partner relationships sustain renewals'),
    jsonb_build_object('key', 'healthier_team_dynamics', 'label', 'Healthier team dynamics', 'description', 'Internal collaboration patterns strengthen over time'),
    jsonb_build_object('key', 'higher_satisfaction', 'label', 'Higher satisfaction', 'description', 'Satisfaction signals trend positively — metadata only'),
    jsonb_build_object('key', 'reduced_conflicts', 'label', 'Reduced conflicts', 'description', 'Escalating conflict patterns decline with proactive care'),
    jsonb_build_object('key', 'stronger_partner_ecosystems', 'label', 'Stronger Growth Partner ecosystems', 'description', 'Partnership quality indicators improve'),
    jsonb_build_object('key', 'increased_knowledge_sharing', 'label', 'Increased knowledge sharing', 'description', 'Knowledge contribution patterns grow — cross-link Organizational Memory'),
    jsonb_build_object('key', 'improved_governance_maturity', 'label', 'Improved governance maturity', 'description', 'Policy adherence and ethical conduct alignment'),
    jsonb_build_object('key', 'organizational_resilience', 'label', 'Organizational resilience', 'description', 'Trust recovery and improvement plans succeed with dignity'),
    jsonb_build_object('key', 'sustainable_relationships', 'label', 'Sustainable relationships', 'description', 'Long-term relationship health — not short-term metrics')
  );
$$;

create or replace function public._trrbp116_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_base jsonb;
  v_relationship_signals int := 0;
  v_warning_signals int := 0;
begin
  v_base := public._crtbp_engagement_summary(p_org_id);

  select count(*) into v_relationship_signals
  from public.organization_trust_signals s
  join public.organization_trust_profiles p on p.id = s.profile_id
  where p.organization_id = p_org_id
    and s.signal_type in ('relationship_health', 'communication_quality', 'engagement_trend', 'satisfaction_signal')
    and s.recorded_at >= now() - interval '90 days';

  select count(*) into v_warning_signals
  from public.organization_trust_signals s
  join public.organization_trust_profiles p on p.id = s.profile_id
  where p.organization_id = p_org_id
    and s.signal_type in ('reduced_engagement', 'delayed_response', 'declining_satisfaction', 'governance_concern')
    and s.recorded_at >= now() - interval '30 days';

  return v_base || jsonb_build_object(
    'relationship_signals_90d', v_relationship_signals,
    'warning_signals_30d', v_warning_signals,
    'phase116_note', 'Phase 116 relationship engagement — counts only; extends Phase 57 engagement summary.'
  );
end; $$;

create or replace function public._trrbp116_blueprint_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_trusted int := 0;
  v_signals_30d int := 0;
  v_relationship int := 0;
begin
  v_engagement := public._trrbp116_engagement_summary(p_org_id);
  v_trusted := coalesce((v_engagement->>'trusted_profiles')::int, 0);
  v_signals_30d := coalesce((v_engagement->>'recent_signals_30d')::int, 0);
  v_relationship := coalesce((v_engagement->>'relationship_signals_90d')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'trust_framework',
      'label', 'Trust framework — ten dimensions documented',
      'met', jsonb_array_length(public._trrbp116_trust_framework_dimensions()) >= 10,
      'note', 'Patterns over time — no single metric defines trust.'
    ),
    jsonb_build_object(
      'key', 'relationship_health',
      'label', 'Relationship health — seven categories with indicators',
      'met', jsonb_array_length(public._trrbp116_relationship_health_categories()) >= 7,
      'note', 'Supportive intervention, not surveillance.'
    ),
    jsonb_build_object(
      'key', 'reputation_profiles',
      'label', 'Reputation profiles — five contextual profile types',
      'met', jsonb_array_length(public._trrbp116_reputation_profiles()) >= 5,
      'note', 'Contextual reputation — not universal rankings.'
    ),
    jsonb_build_object(
      'key', 'trust_insights',
      'label', 'Trust Insights Center — six proactive questions',
      'met', jsonb_array_length(public._trrbp116_trust_insights_questions()) >= 6,
      'note', 'Proactive care — not surveillance.'
    ),
    jsonb_build_object(
      'key', 'early_warnings',
      'label', 'Early warning signals — eight supportive indicators',
      'met', jsonb_array_length(public._trrbp116_early_warning_signals()) >= 8,
      'note', 'Supportive intervention — not punishment.'
    ),
    jsonb_build_object(
      'key', 'recognition_cross_link',
      'label', 'Recognition cross-link — Gratitude & Recognition A.89',
      'met', (public._trrbp116_recognition_types()->>'recognition_route') is not null,
      'note', 'Celebrate values — do not duplicate recognition RPCs.'
    ),
    jsonb_build_object(
      'key', 'trust_recovery',
      'label', 'Trust recovery framework — seven dignity-first supports',
      'met', jsonb_array_length(public._trrbp116_trust_recovery_framework()) >= 7,
      'note', 'Prioritize dignity in all recovery paths.'
    ),
    jsonb_build_object(
      'key', 'growth_partner_trust',
      'label', 'Growth Partner trust model — eight partnership areas',
      'met', jsonb_array_length(public._trrbp116_growth_partner_trust_model()->'areas') >= 8,
      'note', 'Partnership quality, not sales volume.'
    ),
    jsonb_build_object(
      'key', 'enterprise_governance',
      'label', 'Enterprise trust governance — eight config areas',
      'met', jsonb_array_length(public._trrbp116_enterprise_trust_governance()) >= 8,
      'note', 'Explainable systems — humans configure boundaries.'
    ),
    jsonb_build_object(
      'key', 'privacy_ethics',
      'label', 'Privacy and ethics — six principles',
      'met', jsonb_array_length(public._trrbp116_privacy_ethics_principles()) >= 6,
      'note', 'Metrics never hidden; individuals understand assessments.'
    ),
    jsonb_build_object(
      'key', 'companion_adaptation',
      'label', 'Companion adaptation — 🦉🌹🔔 trust examples',
      'met', jsonb_array_length(public._trrbp116_companion_adaptation()) >= 3,
      'note', 'Aipify-first language — inform and prepare, never judge.'
    ),
    jsonb_build_object(
      'key', 'live_trust_signals',
      'label', 'Live trust signals — profiles and relationship patterns',
      'met', v_trusted > 0 or v_signals_30d > 0 or v_relationship > 0,
      'note', case when v_trusted = 0 and v_signals_30d = 0 then 'Seed trust profiles and record relationship health signals.' else null end
    ),
    jsonb_build_object(
      'key', 'cross_links',
      'label', 'Cross-links distinct from Trust Engine, Approvals, RSI, Recognition, Ethics',
      'met', jsonb_array_length(public._trrbp116_cross_links()) >= 10,
      'note', 'Extend related engines — do not duplicate.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL A.72 + Phase 26 + Phase 57; append Phase 116
-- ---------------------------------------------------------------------------
create or replace function public.get_trust_reputation_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('trust.view');
  v_org_id := public._mta_require_organization();
  perform public._tre_seed_profiles(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Earned trust through transparent reputation signals — metadata only, humans review expansion.',
    'principles', jsonb_build_array(
      'Metadata-only reputation signals',
      'Entity-scoped trust profiles',
      'Human review for trust expansion',
      'Revocation with audit trail',
      'Delegated trust hooks for enterprise admins'
    ),
    'summary', public._tre_executive_summary_block(v_org_id),
    'sections', jsonb_build_object(
      'trust_profiles', coalesce((
        select jsonb_agg(row_to_json(p) order by p.trust_score desc, p.entity_type)
        from public.organization_trust_profiles p
        where p.organization_id = v_org_id and p.status in ('active', 'under_review')
        limit 40
      ), '[]'::jsonb),
      'trust_trends', coalesce((
        select jsonb_agg(jsonb_build_object(
          'entity_type', p.entity_type,
          'avg_score', round(avg(p.trust_score)::numeric, 1),
          'profile_count', count(*),
          'trusted_count', count(*) filter (where p.trust_level in ('trusted', 'highly_trusted'))
        ) order by avg(p.trust_score) desc)
        from public.organization_trust_profiles p
        where p.organization_id = v_org_id and p.status = 'active'
        group by p.entity_type
      ), '[]'::jsonb),
      'trusted_workflows', coalesce((
        select jsonb_agg(row_to_json(p) order by p.trust_score desc)
        from public.organization_trust_profiles p
        where p.organization_id = v_org_id and p.status = 'active'
          and p.entity_type in ('workflow', 'automation')
          and p.trust_level in ('trusted', 'highly_trusted')
        limit 20
      ), '[]'::jsonb),
      'approval_quality', coalesce((
        select jsonb_agg(jsonb_build_object(
          'signal_type', s.signal_type,
          'avg_value', round(avg(s.signal_value)::numeric, 1),
          'signal_count', count(*)
        ) order by avg(s.signal_value) desc)
        from public.organization_trust_signals s
        join public.organization_trust_profiles p on p.id = s.profile_id
        where p.organization_id = v_org_id
          and s.signal_type in ('approval_accuracy', 'policy_adherence', 'positive_audit')
          and s.recorded_at >= now() - interval '90 days'
        group by s.signal_type
      ), '[]'::jsonb),
      'reputation_indicators', coalesce((
        select jsonb_agg(row_to_json(s) order by s.recorded_at desc)
        from public.organization_trust_signals s
        join public.organization_trust_profiles p on p.id = s.profile_id
        where p.organization_id = v_org_id
        limit 30
      ), '[]'::jsonb),
      'recent_outcomes', coalesce((
        select jsonb_agg(row_to_json(o) order by o.created_at desc)
        from public.organization_trust_outcomes o
        where o.organization_id = v_org_id
        limit 20
      ), '[]'::jsonb)
    ),
    'settings', (
      select row_to_json(s)::jsonb from public.organization_trust_settings s where s.organization_id = v_org_id
    ),
    'executive_summary', public._tre_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'human_oversight', 'Oversight approvals inform trust expansion decisions — A.40',
      'secure_ai_actions', 'AI action approval accuracy feeds reputation signals — A.3',
      'workflow_orchestration', 'Workflow execution patterns contribute to workflow trust — A.42',
      'governance_policy', 'Policy adherence signals strengthen governance trust — A.14',
      'enterprise_delegated_admins', 'Delegated admin scopes enable enterprise trust delegation — A.30/A.41'
    ),
    'integration_summaries', jsonb_build_object(
      'human_oversight', public._tre_human_oversight_summary(v_org_id),
      'secure_ai_actions', public._tre_secure_ai_actions_summary(v_org_id),
      'workflow_orchestration', public._tre_workflow_summary(v_org_id),
      'governance_policy', public._tre_governance_summary(v_org_id),
      'enterprise_delegated_admins', public._tre_delegated_trust_summary(v_org_id)
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 116 — Trust, Reputation & Relationship Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE116_TRUST_REPUTATION_RELATIONSHIP.md',
      'engine_phase', 'Phase A.72 Trust & Reputation Engine',
      'route', '/app/trust-reputation-engine',
      'mapping_note', 'ABOS Blueprint Phase 116 maps to Trust & Reputation Engine Phase A.72 — extends Phase 26 and Phase 57 with trust framework, relationship health, reputation profiles, trust insights, early warnings, recognition cross-link, trust recovery, Growth Partner trust, enterprise governance, and privacy/ethics metadata.'
    ),
    'implementation_blueprint_phase57', jsonb_build_object(
      'phase', 'Phase 57 — Companion Relationship & Trust Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE57_COMPANION_RELATIONSHIP_TRUST.md',
      'engine_phase', 'Phase A.72 Trust & Reputation Engine',
      'route', '/app/trust-reputation-engine'
    ),
    'implementation_blueprint_phase26', jsonb_build_object(
      'phase', 'Phase 26 — Trust & Relationship Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE26_TRUST_RELATIONSHIP.md',
      'engine_phase', 'Phase A.72 Trust & Reputation Engine',
      'route', '/app/trust-reputation-engine'
    ),
    'trust_relationship_note', 'Trust & Relationship Engine (ABOS Phase 26) — extends Trust & Reputation Engine Phase A.72 with blueprint metadata, relationship objectives, principles, and live engagement summary.',
    'companion_relationship_trust_note', 'Companion Relationship & Trust Engine (ABOS Phase 57) — companion trust development on A.72 reputation profiles with continuity, reliability, boundaries, and organizational trust pillars.',
    'trust_reputation_relationship_note', 'Trust, Reputation & Relationship Engine (ABOS Phase 116) — trust framework dimensions, relationship health categories, reputation profiles, trust insights, early warnings, recognition cross-link, trust recovery, Growth Partner trust, enterprise governance, and privacy/ethics on A.72 profiles.',
    'blueprint_philosophy', public._trrbp116_blueprint_philosophy(),
    'blueprint_mission', public._trrbp116_blueprint_mission(),
    'blueprint_abos_principle', public._trrbp116_blueprint_abos_principle(),
    'vision', public._trrbp116_blueprint_vision(),
    'blueprint_distinction_note', public._trrbp116_distinction_note(),
    'relationship_objectives', public._trbp_blueprint_relationship_objectives(),
    'relationship_principles', public._trbp_blueprint_relationship_principles(),
    'example_phrases', public._trbp_blueprint_example_phrases(),
    'trust_signals', public._trbp_blueprint_trust_signals(),
    'companion_examples', public._trbp_blueprint_companion_examples(),
    'blueprint_boundaries', public._trbp_blueprint_boundaries(),
    'self_love_connection', public._trbp_blueprint_self_love_connection(),
    'dogfooding', public._trbp_blueprint_dogfooding(),
    'blueprint_integration_links', public._trbp_blueprint_integration_links(),
    'engagement_summary', public._trrbp116_engagement_summary(v_org_id),
    'success_criteria', public._trbp_blueprint_success_criteria(v_org_id),
    'vision_phrases', public._trbp_blueprint_vision_phrases(),
    'companion_objectives', public._crtbp_blueprint_objectives(),
    'trust_principles', public._crtbp_blueprint_trust_principles(),
    'avoid_practices', public._crtbp_blueprint_avoid_practices(),
    'relationship_continuity', public._crtbp_blueprint_relationship_continuity(),
    'companion_reliability', public._crtbp_blueprint_companion_reliability(),
    'companion_self_love', public._crtbp_blueprint_self_love_connection(),
    'boundary_principles', public._crtbp_blueprint_boundary_principles(),
    'trust_signal_indicators', public._crtbp_blueprint_trust_signals(),
    'organizational_trust', public._crtbp_blueprint_organizational_trust(),
    'dogfooding_phase57', public._crtbp_blueprint_dogfooding(),
    'companion_integration_links', public._crtbp_blueprint_integration_links(),
    'companion_success_criteria', public._crtbp_blueprint_success_criteria(v_org_id),
    'companion_vision_phrases', public._crtbp_blueprint_vision_phrases(),
    'phase116_objectives', public._trrbp116_blueprint_objectives(),
    'trust_framework_dimensions', public._trrbp116_trust_framework_dimensions(),
    'relationship_health_categories', public._trrbp116_relationship_health_categories(),
    'reputation_profile_types', public._trrbp116_reputation_profiles(),
    'trust_insights_questions', public._trrbp116_trust_insights_questions(),
    'early_warning_signals', public._trrbp116_early_warning_signals(),
    'recognition_types', public._trrbp116_recognition_types(),
    'trust_recovery_framework', public._trrbp116_trust_recovery_framework(),
    'companion_responsibilities', public._trrbp116_companion_responsibilities(),
    'growth_partner_trust_model', public._trrbp116_growth_partner_trust_model(),
    'enterprise_trust_governance', public._trrbp116_enterprise_trust_governance(),
    'privacy_ethics_principles', public._trrbp116_privacy_ethics_principles(),
    'self_love_in_relationships', public._trrbp116_self_love_in_relationships(),
    'phase116_integration_links', public._trrbp116_cross_links(),
    'limitation_principles', public._trrbp116_limitation_principles(),
    'companion_adaptation', public._trrbp116_companion_adaptation(),
    'phase116_success_metrics', public._trrbp116_success_metrics(),
    'phase116_success_criteria', public._trrbp116_blueprint_success_criteria(v_org_id),
    'privacy_note', 'Trust, reputation, and relationship signals are organization-scoped, explainable, and auditable. Metadata only — no raw customer content, no hidden scoring.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve Phase 26 + Phase 57 + append Phase 116 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_trust_reputation_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_summary jsonb; v_engagement jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._tre_seed_profiles(v_org_id);
  v_summary := public._tre_executive_summary_block(v_org_id);
  v_engagement := public._trrbp116_engagement_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Trust & Reputation — earned trust through transparent metadata signals.',
    'active_profiles', v_summary->'active_profiles',
    'trusted_profiles', v_summary->'trusted_profiles',
    'under_review_profiles', v_summary->'under_review_profiles',
    'avg_trust_score', v_summary->'avg_trust_score',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 116 — Trust, Reputation & Relationship Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE116_TRUST_REPUTATION_RELATIONSHIP.md',
      'engine_phase', 'Phase A.72 Trust & Reputation Engine',
      'route', '/app/trust-reputation-engine'
    ),
    'implementation_blueprint_phase57', jsonb_build_object(
      'phase', 'Phase 57 — Companion Relationship & Trust Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE57_COMPANION_RELATIONSHIP_TRUST.md',
      'engine_phase', 'Phase A.72 Trust & Reputation Engine',
      'route', '/app/trust-reputation-engine'
    ),
    'implementation_blueprint_phase26', jsonb_build_object(
      'phase', 'Phase 26 — Trust & Relationship Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE26_TRUST_RELATIONSHIP.md',
      'engine_phase', 'Phase A.72 Trust & Reputation Engine',
      'route', '/app/trust-reputation-engine'
    ),
    'mission', public._trrbp116_blueprint_mission(),
    'abos_principle', public._trrbp116_blueprint_abos_principle(),
    'engagement_summary', v_engagement,
    'blueprint_note', 'Trust, Reputation & Relationship Engine (ABOS Phase 116) — extends Phase A.72, Phase 26, and Phase 57 with trust framework, relationship health, reputation profiles, trust insights, early warnings, and live success criteria.',
    'companion_note', 'Earned trust through honest patterns — Aipify identifies, explains, and prepares; humans decide with dignity.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants
-- ---------------------------------------------------------------------------
grant execute on function public._trrbp116_distinction_note() to authenticated;
grant execute on function public._trrbp116_blueprint_mission() to authenticated;
grant execute on function public._trrbp116_blueprint_philosophy() to authenticated;
grant execute on function public._trrbp116_blueprint_abos_principle() to authenticated;
grant execute on function public._trrbp116_blueprint_vision() to authenticated;
grant execute on function public._trrbp116_blueprint_objectives() to authenticated;
grant execute on function public._trrbp116_trust_framework_dimensions() to authenticated;
grant execute on function public._trrbp116_relationship_health_categories() to authenticated;
grant execute on function public._trrbp116_reputation_profiles() to authenticated;
grant execute on function public._trrbp116_trust_insights_questions() to authenticated;
grant execute on function public._trrbp116_early_warning_signals() to authenticated;
grant execute on function public._trrbp116_recognition_types() to authenticated;
grant execute on function public._trrbp116_trust_recovery_framework() to authenticated;
grant execute on function public._trrbp116_companion_responsibilities() to authenticated;
grant execute on function public._trrbp116_growth_partner_trust_model() to authenticated;
grant execute on function public._trrbp116_enterprise_trust_governance() to authenticated;
grant execute on function public._trrbp116_privacy_ethics_principles() to authenticated;
grant execute on function public._trrbp116_self_love_in_relationships() to authenticated;
grant execute on function public._trrbp116_cross_links() to authenticated;
grant execute on function public._trrbp116_limitation_principles() to authenticated;
grant execute on function public._trrbp116_companion_adaptation() to authenticated;
grant execute on function public._trrbp116_success_metrics() to authenticated;
grant execute on function public._trrbp116_engagement_summary(uuid) to authenticated;
grant execute on function public._trrbp116_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'trust-reputation-relationship-blueprint', 'Trust, Reputation & Relationship Engine (ABOS Phase 116)',
  'Trust, Reputation & Relationship Engine — extends Phase A.72, Phase 26, and Phase 57 with trust framework, relationship health, reputation profiles, trust insights, early warnings, recognition cross-link, trust recovery, Growth Partner trust, enterprise governance, and privacy/ethics metadata.',
  'authenticated', 105
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'trust-reputation-relationship-blueprint' and tenant_id is null
);
