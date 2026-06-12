-- Implementation Blueprint Phase 93 — Adaptive Learning & Organizational Capability Engine
-- Extends Learning Engine Phase 65 + Phase 29 + Blueprint Phase 23. No new tables.
-- Distinct from Billing/Packaging repo Phase 93, Wisdom Engine A.93, and Learning & Training A.36/Phase 92.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._alocbp93_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 93 — Adaptive Learning & Organizational Capability Engine at /app/learning. Extends Learning Engine Phase 65 + Phase 29 and preserves Blueprint Phase 23 (_laebp_*) learning adaptation metadata. Phase 93 = adaptive capability needs, daily-work learning capture, organizational capability pathways. Distinct from Learning & Training A.36 / Blueprint Phase 92 at /app/learning-training-engine (formal talent development). Distinct from Billing/Packaging repo Phase 93 at /app/commercial and Wisdom Engine A.93 at /app/wisdom-engine (phase number collisions). Helpers use _alocbp93_* only — never collide with _laebp_* or _lrn_*.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._alocbp93_mission()
returns text language sql immutable as $$
  select 'Identify emerging capability needs and create adaptive learning experiences for long-term success.';
$$;

create or replace function public._alocbp93_philosophy()
returns text language sql immutable as $$
  select 'Learning happens daily through work — capture and cultivate intentionally. Adaptive learning should feel empowering and voluntary, not surveillance-based or compliance-driven.';
$$;

create or replace function public._alocbp93_abos_principle()
returns text language sql immutable as $$
  select 'Organizations that learn fastest thrive — not necessarily those with greatest resources.';
$$;

create or replace function public._alocbp93_vision()
returns text language sql immutable as $$
  select 'I am continually becoming more capable because this organization encourages me to learn.';
$$;

create or replace function public._alocbp93_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'capability_needs_detection', 'label', 'Capability needs detection', 'description', 'Identify emerging capability needs from daily work signals — metadata trends only'),
    jsonb_build_object('key', 'adaptive_experiences', 'label', 'Adaptive experiences', 'description', 'Create adaptive learning experiences aligned to long-term organizational success'),
    jsonb_build_object('key', 'intentional_capture', 'label', 'Intentional capture', 'description', 'Capture and cultivate learning that happens through everyday work'),
    jsonb_build_object('key', 'organizational_capability', 'label', 'Organizational capability', 'description', 'Build shared organizational capability through transparent learning loops'),
    jsonb_build_object('key', 'empowerment_not_surveillance', 'label', 'Empowerment not surveillance', 'description', 'Voluntary, transparent learning — no mandatory surveillance-based tracking'),
    jsonb_build_object('key', 'sustained_success', 'label', 'Sustained success', 'description', 'Connect adaptive learning to long-term capability and organizational resilience')
  );
$$;

create or replace function public._alocbp93_learning_signals()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Learning signals from daily work — metadata patterns and trends, never raw customer records or punitive individual scoring.',
    'signals', jsonb_build_array(
      jsonb_build_object(
        'key', 'support_requests',
        'label', 'Support requests',
        'description', 'Recurring support themes and resolution patterns — metadata trends from Support AI and ASO',
        'cross_link', '/app/settings/support-operations'
      ),
      jsonb_build_object(
        'key', 'mistakes_corrections',
        'label', 'Mistakes & corrections',
        'description', 'Normalized learning from corrections and false positives — mistakes as data, not failures',
        'cross_link', '/app/learning/review'
      ),
      jsonb_build_object(
        'key', 'strategic_initiatives',
        'label', 'Strategic initiatives',
        'description', 'New priorities and initiative adoption patterns from strategic intelligence signals',
        'cross_link', '/app/strategic-intelligence-foundation-engine'
      ),
      jsonb_build_object(
        'key', 'new_technology',
        'label', 'New technology',
        'description', 'Tool adoption and capability gaps from new integrations and install discoveries',
        'cross_link', '/app/install'
      ),
      jsonb_build_object(
        'key', 'sales_expert_observations',
        'label', 'Sales Expert observations',
        'description', 'Field observations from Sales Expert Academy — cross-link A.95 metadata only',
        'cross_link', '/app/sales-expert-engine'
      ),
      jsonb_build_object(
        'key', 'customer_feedback_trends',
        'label', 'Customer feedback trends',
        'description', 'Aggregate satisfaction and feedback trend metadata — no raw customer content',
        'cross_link', '/app/learning'
      )
    )
  );
$$;

create or replace function public._alocbp93_capability_questions()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Capability questions — growth-oriented reflection, not compliance evaluation.',
    'questions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'capability_gaps', 'question', 'What capability gaps are emerging from daily work?', 'description', 'Wisdom-oriented gap detection — adaptive not punitive'),
      jsonb_build_object('emoji', '🌹', 'key', 'learning_progress', 'question', 'What learning progress deserves recognition?', 'description', 'Celebrate capability growth — cross-link Gratitude A.89'),
      jsonb_build_object('emoji', '❤️', 'key', 'empowering_learning', 'question', 'How can learning feel empowering rather than mandatory?', 'description', 'Voluntary participation — empowerment not surveillance'),
      jsonb_build_object('emoji', '🔔', 'key', 'adaptive_pathways', 'question', 'What adaptive pathways would strengthen organizational capability?', 'description', 'Pathway suggestions — humans decide pace and direction')
    ),
    'reflection_note', 'Questions invite capability reflection — humans decide what to pursue; Aipify scaffolds adaptive options.'
  );
$$;

create or replace function public._alocbp93_adaptive_learning_pathways()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'micro_learning',
      'title', 'Micro-learning',
      'description', 'Short, contextual learning moments tied to detected work signals',
      'designed_for', jsonb_build_array('All team members'),
      'topics', jsonb_build_array('Just-in-time guidance', 'Contextual tips', 'Quick knowledge checks')
    ),
    jsonb_build_object(
      'key', 'kc_recommendations',
      'title', 'Knowledge Center recommendations',
      'description', 'KC article suggestions from detected capability gaps',
      'cross_link', '/app/knowledge-center-engine',
      'cross_link_note', 'Knowledge Center A.5 — cross-link only',
      'topics', jsonb_build_array('Article relevance', 'Gap-driven suggestions', 'Search effectiveness')
    ),
    jsonb_build_object(
      'key', 'companion_guided_coaching',
      'title', 'Companion-guided coaching',
      'description', 'Growth-oriented companion guidance — development not compliance',
      'companion_name', 'Companion',
      'not_label', 'AI coach',
      'topics', jsonb_build_array('Capability reflection', 'Pathway suggestions', 'Progress encouragement')
    ),
    jsonb_build_object(
      'key', 'peer_learning',
      'title', 'Peer learning',
      'description', 'Community and peer learning connections without public ranking',
      'cross_link', '/app/community',
      'cross_link_note', 'Community Phase 89 — collective learning cross-link',
      'topics', jsonb_build_array('Shared insights', 'Best practice evolution', 'Collaborative discovery')
    ),
    jsonb_build_object(
      'key', 'simulation_based',
      'title', 'Simulation-based learning',
      'description', 'Practice scenarios via Simulation Lab for safe capability building',
      'cross_link', '/app/simulations',
      'topics', jsonb_build_array('Scenario practice', 'Decision rehearsal', 'Risk-free experimentation')
    ),
    jsonb_build_object(
      'key', 'leadership_pathways',
      'title', 'Leadership pathways',
      'description', 'Leadership capability development scaffolds — aggregate insights only',
      'cross_link', '/app/learning-training-engine',
      'cross_link_note', 'Formal leadership development via Learning & Training A.36 / Phase 92 — cross-link',
      'topics', jsonb_build_array('Strategic readiness', 'Team capability trends', 'Executive companion alignment')
    )
  );
$$;

create or replace function public._alocbp93_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion guidance — growth not compliance. Aipify observes capability signals and suggests adaptive pathways; humans decide whether and when to learn.',
    'companion_name', 'Companion',
    'not_label', 'AI coach',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'capability_gap', 'prompt', 'A recurring support theme may indicate a capability gap — would reviewing related Knowledge Center articles feel helpful?', 'consideration', 'Wisdom-oriented observation — not mandatory assignment'),
      jsonb_build_object('emoji', '🌹', 'key', 'learning_progress', 'prompt', 'Recent learning approvals suggest growing organizational capability — shall I highlight progress worth recognizing?', 'consideration', 'Celebrate growth — cross-link Gratitude A.89'),
      jsonb_build_object('emoji', '🔔', 'key', 'adaptive_pathway', 'prompt', 'A simulation scenario may help practice a new workflow — would exploring it at your own pace feel supportive?', 'consideration', 'Voluntary pathway — empowerment not surveillance')
    ),
    'boundary_note', 'Companion scaffolds adaptive learning options — never assigns mandatory training or hidden capability scores.'
  );
$$;

create or replace function public._alocbp93_knowledge_reinforcement()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Knowledge reinforcement — connect adaptive learning to approved knowledge sources and organizational memory.',
    'practices', jsonb_build_array(
      'Knowledge Center article references from detected gaps — metadata only',
      'Organizational memory hooks for lessons learned — cross-link A.34',
      'Employee Knowledge EKE procedures as fallback for internal guidance',
      'Reinforcement after learning events — explainable, auditable, reversible'
    ),
    'knowledge_center_route', '/app/knowledge-center-engine',
    'organizational_memory_route', '/app/organizational-memory-engine',
    'eke_route', '/app/settings/employee-knowledge',
    'boundary_note', 'Reinforcement uses approved metadata references — never raw customer content or surveillance tracking.'
  );
$$;

create or replace function public._alocbp93_community_learning_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Community learning connection — peer insights and collective learning without public ranking.',
    'practices', jsonb_build_array(
      'Cross-link Community Phase 89 for collective intelligence signals',
      'Peer learning pathways — voluntary participation only',
      'Best practice evolution from anonymized community contributions',
      'No public leaderboards or individual comparison framing'
    ),
    'community_route', '/app/community',
    'boundary_note', 'Community learning amplifies collective wisdom — never surveillance-based mandatory participation.'
  );
$$;

create or replace function public._alocbp93_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — normalize learning curves, celebrate progress, reduce fear of mistakes.',
    'practices', jsonb_build_array(
      'Mistakes are data for better outcomes — not failures to punish',
      'Celebrate capability growth without perfection pressure',
      'Encourage experimentation in assisted learning mode first',
      'Patient mastery — learning at a human pace'
    ),
    'journey_phrase', 'Becoming more capable because the organization encourages learning — at your own pace.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports sustainable learning reflection — principle only; Adaptive Learning Blueprint stores metadata, not wellbeing content.'
  );
$$;

create or replace function public._alocbp93_leadership_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership insights — aggregate capability trend summaries for leaders, never individual ranking.',
    'insights', jsonb_build_array(
      jsonb_build_object('key', 'capability_trends', 'label', 'Capability trends', 'description', 'Aggregate learning event and feedback trends — team-level only'),
      jsonb_build_object('key', 'pathway_adoption', 'label', 'Pathway adoption', 'description', 'Which adaptive pathways are being explored — counts only, no individual scores'),
      jsonb_build_object('key', 'knowledge_gaps', 'label', 'Knowledge gaps', 'description', 'Recurring gap themes from support and knowledge signals — metadata patterns'),
      jsonb_build_object('key', 'learning_velocity', 'label', 'Learning velocity', 'description', 'Organizational learning pace indicators — celebrate progress, not productivity extraction')
    ),
    'boundary_note', 'Leadership sees aggregates and trends — no hidden individual capability evaluations or public ranking.'
  );
$$;

create or replace function public._alocbp93_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparent adaptive learning — empowerment not control.',
    'organizations_should_understand', jsonb_build_array(
      'What adaptive learning data represents — capability signal metadata and learning event trends only',
      'How recommendations form — explainable patterns from approved sources with confidence levels',
      'What remains optional — all adaptive pathways and companion suggestions are voluntary',
      'Empowerment not surveillance — no mandatory tracking or hidden capability scoring'
    ),
    'individuals_should_know', jsonb_build_array(
      'Learning happens through work — captured intentionally, never punitively',
      'Companion suggests pathways — humans decide whether and when to learn',
      'Mistakes normalize learning — not failures recorded for punishment',
      'Distinct from formal training (A.36), operational memory (Phase 65), and HR surveillance tooling'
    ),
    'audit_note', 'Adaptive learning events audited via learning_events and learning_audit — metadata only, tenant-scoped.'
  );
$$;

create or replace function public._alocbp93_privacy_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Privacy principles — empowerment not control in adaptive learning.',
    'forbidden', jsonb_build_array(
      'Surveillance-based mandatory learning or forced participation tracking',
      'Hidden evaluations or individual capability scoring',
      'Public ranking, leaderboards, or unfair comparison between individuals',
      'Punishment framing for mistakes, incomplete learning, or slow progress'
    ),
    'required', jsonb_build_array(
      'Voluntary adaptive pathways — human consent for material behavior changes',
      'Transparent capability signal sources — explainable metadata only',
      'Aggregate leadership insights — no individual surveillance',
      'Companion growth tone — supportive, not compliance-driven'
    ),
    'boundary_note', 'Aipify cultivates organizational capability — individuals and organizations retain agency.'
  );
$$;

create or replace function public._alocbp93_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates adaptive learning patterns internally before customer rollout.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — Sales Expert Academy, leadership development, product capability, Meeting Companion, KC evolution',
      'focus', jsonb_build_array(
        'Sales Expert Academy learning loops and field observation signals',
        'Leadership development capability trends from executive workflows',
        'Product team capability building and install discovery learning',
        'Meeting Companion observations and Knowledge Center evolution patterns'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce operational capability learning',
      'focus', jsonb_build_array(
        'Support resolution capability gaps and adaptive KC recommendations',
        'Seasonal workflow learning from automation and triage patterns',
        'Commerce team peer learning via community contributions'
      )
    )
  );
$$;

create or replace function public._alocbp93_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'I am continually becoming more capable because this organization encourages me to learn.',
    'Learning happens daily through work — capture and cultivate intentionally.',
    'Organizations that learn fastest thrive — not necessarily those with greatest resources.',
    'Empowerment not control — voluntary, transparent adaptive learning.',
    'Growth not compliance — Companion scaffolds pathways; humans decide.',
    'Mistakes are data for better outcomes — never punishment framing.'
  );
$$;

create or replace function public._alocbp93_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'learning_training_a36', 'label', 'Learning & Training Engine (A.36 / Phase 92)', 'route', '/app/learning-training-engine', 'note', 'Formal talent development — cross-link only, distinct from operational adaptive learning'),
    jsonb_build_object('key', 'capability_maturity_a57', 'label', 'Capability Maturity Engine (A.57)', 'route', '/app/capability-maturity-engine', 'note', 'Maturity assessment — complements adaptive capability detection'),
    jsonb_build_object('key', 'knowledge_center_a5', 'label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine', 'note', 'KC recommendations and knowledge reinforcement'),
    jsonb_build_object('key', 'employee_knowledge_eke', 'label', 'Employee Knowledge Engine (EKE)', 'route', '/app/settings/employee-knowledge', 'note', 'Internal knowledge and onboarding procedures'),
    jsonb_build_object('key', 'community_phase89', 'label', 'Community & Collective Intelligence (Phase 89)', 'route', '/app/community', 'note', 'Peer learning and collective intelligence — no public ranking'),
    jsonb_build_object('key', 'continuous_improvement_a33', 'label', 'Continuous Improvement (A.33 / Phase 90)', 'route', '/app/continuous-improvement-engine', 'note', 'Improvement cycles complement adaptive learning loops'),
    jsonb_build_object('key', 'organizational_memory_a34', 'label', 'Organizational Memory (A.34)', 'route', '/app/organizational-memory-engine', 'note', 'Lessons learned and knowledge reinforcement hooks'),
    jsonb_build_object('key', 'simulation_lab', 'label', 'Simulation Lab', 'route', '/app/simulations', 'note', 'Simulation-based adaptive learning pathways'),
    jsonb_build_object('key', 'growth_evolution_a81', 'label', 'Growth & Evolution Engine (A.81)', 'route', '/app/growth-evolution-engine', 'note', 'Post-learning capability integration and evolution signals'),
    jsonb_build_object('key', 'blueprint_phase23', 'label', 'Learning & Adaptation (Blueprint Phase 23)', 'route', '/app/learning', 'note', 'Operational adaptation preserved — Phase 93 extends same route'),
    jsonb_build_object('key', 'learning_review_phase29', 'label', 'Learning Review Center (Phase 29)', 'route', '/app/learning/review', 'note', 'Assisted and adaptive learning modes'),
    jsonb_build_object('key', 'wisdom_engine_a93', 'label', 'Wisdom Engine (A.93)', 'route', '/app/wisdom-engine', 'note', 'Wisdom and judgment — repo engine phase collision only'),
    jsonb_build_object('key', 'commercial_repo93', 'label', 'Billing & Commercial (Repo Phase 93)', 'route', '/app/commercial', 'note', 'Commercial packaging — phase number collision only')
  );
$$;

create or replace function public._alocbp93_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_laebp jsonb;
begin
  v_laebp := public._laebp_engagement_summary(p_tenant_id);

  return jsonb_build_object(
    'learning_signals', jsonb_array_length(public._alocbp93_learning_signals()->'signals'),
    'capability_questions', jsonb_array_length(public._alocbp93_capability_questions()->'questions'),
    'adaptive_pathways', jsonb_array_length(public._alocbp93_adaptive_learning_pathways()),
    'companion_guidance_examples', jsonb_array_length(public._alocbp93_companion_guidance()->'examples'),
    'leadership_insight_dimensions', jsonb_array_length(public._alocbp93_leadership_insights()->'insights'),
    'privacy_forbidden_count', jsonb_array_length(public._alocbp93_privacy_principles()->'forbidden'),
    'integration_links', jsonb_array_length(public._alocbp93_integration_links()),
    'operational_engagement', v_laebp,
    'privacy_note', 'Metadata only — signal counts, pathway scaffolds, and operational learning engagement. No surveillance tracking, no individual capability scores, no PII.'
  );
end; $$;

create or replace function public._alocbp93_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_events int := 0;
  v_feedback int := 0;
  v_memory int := 0;
begin
  v_engagement := public._alocbp93_engagement_summary(p_tenant_id);
  v_events := coalesce((v_engagement->'operational_engagement'->>'learning_events_total')::int, 0);
  v_feedback := coalesce((v_engagement->'operational_engagement'->>'feedback_total')::int, 0);
  v_memory := coalesce((v_engagement->'operational_engagement'->>'active_learning_memory')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'capability_needs_detection',
      'label', 'Capability needs detection — learning signals documented',
      'met', jsonb_array_length(public._alocbp93_learning_signals()->'signals') >= 6,
      'note', 'Support, mistakes, initiatives, technology, Sales Expert, and feedback trends.'
    ),
    jsonb_build_object(
      'key', 'adaptive_experiences',
      'label', 'Adaptive experiences — pathways and companion guidance available',
      'met', jsonb_array_length(public._alocbp93_adaptive_learning_pathways()) >= 6
        and jsonb_array_length(public._alocbp93_companion_guidance()->'examples') >= 3,
      'note', 'Micro-learning, KC, companion-guided coaching, peer, simulation, leadership pathways.'
    ),
    jsonb_build_object(
      'key', 'intentional_capture',
      'label', 'Intentional capture — operational learning events or feedback recorded',
      'met', v_events > 0 or v_feedback > 0,
      'note', case when v_events = 0 and v_feedback = 0 then 'Collect signals or record feedback to begin adaptive learning loops.' else null end
    ),
    jsonb_build_object(
      'key', 'organizational_capability',
      'label', 'Organizational capability — active learning memory or learned rules',
      'met', v_memory > 0 or coalesce((v_engagement->'operational_engagement'->>'active_learned_rules')::int, 0) > 0,
      'note', 'Approved learnings build shared organizational capability over time.'
    ),
    jsonb_build_object(
      'key', 'knowledge_reinforcement',
      'label', 'Knowledge reinforcement — KC, organizational memory, and EKE cross-links',
      'met', (public._alocbp93_knowledge_reinforcement()->>'principle') is not null,
      'note', 'Reinforcement via approved knowledge sources — metadata only.'
    ),
    jsonb_build_object(
      'key', 'community_learning',
      'label', 'Community learning connection — peer learning without public ranking',
      'met', (public._alocbp93_community_learning_connection()->>'principle') is not null,
      'note', 'Cross-link Community Phase 89 — voluntary participation.'
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Companion guidance — growth not compliance',
      'met', jsonb_array_length(public._alocbp93_companion_guidance()->'examples') >= 3,
      'note', 'Companion-guided coaching — not AI coach. Humans decide pace.'
    ),
    jsonb_build_object(
      'key', 'leadership_insights',
      'label', 'Leadership insights — aggregate trends, no individual ranking',
      'met', jsonb_array_length(public._alocbp93_leadership_insights()->'insights') >= 4,
      'note', 'Team-level capability trends only.'
    ),
    jsonb_build_object(
      'key', 'privacy_principles',
      'label', 'Privacy principles — no surveillance, hidden evaluation, or punishment framing',
      'met', jsonb_array_length(public._alocbp93_privacy_principles()->'forbidden') >= 4,
      'note', 'Empowerment not control.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — transparent adaptive learning data',
      'met', jsonb_array_length(public._alocbp93_trust_connection()->'organizations_should_understand') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — normalize learning curves and celebrate progress',
      'met', (public._alocbp93_self_love_connection()->>'journey_phrase') is not null,
      'note', 'Becoming more capable at a human pace.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links Learning & Training A.36, Capability Maturity, KC, EKE, Community, CI, Org Memory, Simulations, Growth',
      'met', jsonb_array_length(public._alocbp93_integration_links()) >= 10,
      'note', 'Extend related engines — do not duplicate adaptive learning storage.'
    ),
    jsonb_build_object(
      'key', 'phase23_preserved',
      'label', 'Blueprint Phase 23 learning adaptation preserved',
      'met', jsonb_array_length(public._laebp_blueprint_learning_objectives()) >= 6,
      'note', 'Phase 23 operational adaptation metadata intact alongside Phase 93.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Sales Expert Academy, leadership dev, product capability, Meeting Companion, KC',
      'met', (public._alocbp93_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    )
  );
end; $$;

create or replace function public._alocbp93_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 93 — Adaptive Learning & Organizational Capability Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE93_ADAPTIVE_LEARNING_ORGANIZATIONAL_CAPABILITY.md',
    'engine_phase', 'Phase 65 Learning Engine (extends Phase 29 + Phase 23)',
    'route', '/app/learning',
    'mapping_note', 'ABOS Blueprint Phase 93 extends Phase 65/29/23 with adaptive capability detection, daily-work learning capture, companion-guided pathways, and empowerment-first privacy. Distinct from Learning & Training A.36/Phase 92, Billing repo Phase 93, and Wisdom Engine A.93.',
    'distinction_note', public._alocbp93_distinction_note(),
    'mission', public._alocbp93_mission(),
    'philosophy', public._alocbp93_philosophy(),
    'abos_principle', public._alocbp93_abos_principle(),
    'objectives', public._alocbp93_objectives(),
    'learning_signals', public._alocbp93_learning_signals(),
    'capability_questions', public._alocbp93_capability_questions(),
    'adaptive_learning_pathways', public._alocbp93_adaptive_learning_pathways(),
    'companion_guidance', public._alocbp93_companion_guidance(),
    'knowledge_reinforcement', public._alocbp93_knowledge_reinforcement(),
    'community_learning_connection', public._alocbp93_community_learning_connection(),
    'self_love_connection', public._alocbp93_self_love_connection(),
    'leadership_insights', public._alocbp93_leadership_insights(),
    'trust_connection', public._alocbp93_trust_connection(),
    'privacy_principles', public._alocbp93_privacy_principles(),
    'dogfooding', public._alocbp93_dogfooding(),
    'success_criteria', public._alocbp93_success_criteria(p_tenant_id),
    'vision', public._alocbp93_vision(),
    'vision_phrases', public._alocbp93_vision_phrases(),
    'integration_links', public._alocbp93_integration_links(),
    'engagement_summary', public._alocbp93_engagement_summary(p_tenant_id),
    'privacy_note', 'Adaptive learning blueprint data is metadata only — capability signal counts, pathway scaffolds, operational engagement. No surveillance tracking, no individual capability scores, no PII. Humans decide; Aipify informs and prepares.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL Phase 23 fields; append Phase 93
-- ---------------------------------------------------------------------------
create or replace function public.get_learning_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._lrn_require_tenant();
  perform public._lrn_ensure_settings(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'metrics', jsonb_build_object(
      'total_events', (select count(*) from public.learning_events where tenant_id = v_tenant_id),
      'positive_feedback', (select count(*) from public.learning_feedback where tenant_id = v_tenant_id and feedback_type in ('helpful', 'approved')),
      'negative_feedback', (select count(*) from public.learning_feedback where tenant_id = v_tenant_id and feedback_type in ('not_helpful', 'false_positive', 'too_noisy', 'rejected')),
      'false_positives_reduced', (select count(*) from public.learning_events where tenant_id = v_tenant_id and event_type = 'incident_false_positive'),
      'suggestions_improved', (select count(*) from public.learning_scores where tenant_id = v_tenant_id and current_score > 55),
      'automations_improved', (select count(*) from public.learning_events where tenant_id = v_tenant_id and event_type = 'automation_success'),
      'noisy_notifications_reduced', (select count(*) from public.learning_events where tenant_id = v_tenant_id and event_type = 'notification_muted')
    ),
    'top_patterns', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pattern_key', ls.pattern_key, 'source_module', ls.source_module,
        'current_score', ls.current_score, 'positive_count', ls.positive_count,
        'negative_count', ls.negative_count, 'explanation', ls.explanation
      ) order by ls.current_score desc)
      from public.learning_scores ls where ls.tenant_id = v_tenant_id limit 10
    ), '[]'::jsonb),
    'recent_priority_adjustments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', le.id, 'event_type', le.event_type, 'source_module', le.source_module,
        'explanation', le.explanation, 'confidence_before', le.confidence_before,
        'confidence_after', le.confidence_after, 'created_at', le.created_at
      ) order by le.created_at desc)
      from public.learning_events le where le.tenant_id = v_tenant_id
        and le.confidence_after is not null limit 10
    ), '[]'::jsonb),
    'recent_events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', le.id, 'event_type', le.event_type, 'source_module', le.source_module,
        'user_decision', le.user_decision, 'outcome', le.outcome, 'explanation', le.explanation,
        'created_at', le.created_at
      ) order by le.created_at desc)
      from public.learning_events le where le.tenant_id = v_tenant_id limit 15
    ), '[]'::jsonb),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 23 — Learning & Adaptation Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE23_LEARNING_ADAPTATION.md',
      'engine_phase', 'Phase 65 Learning Engine (extends Phase 29)',
      'route', '/app/learning',
      'mapping_note', 'ABOS Blueprint Phase 23 maps to Learning Engine Phase 65 — extend, do not duplicate Learning & Training A.36, Knowledge Evolution Phase 14, or Growth & Evolution A.81.'
    ),
    'mission', 'Continuous improvement through observation, feedback, and experience — preserving trust, governance, and human oversight.',
    'philosophy', 'Learning is intentional; adaptation is transparent; improvement never compromises trust.',
    'abos_principle', 'Strongest organizations keep learning — make learning visible, practical, and continuous.',
    'core_principle', 'Aipify learns WITH the customer — not FROM the customer.',
    'vision', 'Organizations become wiser through experience; Aipify grows alongside them responsibly, one lesson at a time.',
    'learning_engine_note', 'Learning & Adaptation Engine (ABOS Phase 23) — extends Learning Engine Phase 65 and Phase 29 Review Center.',
    'distinction_note', public._laebp_distinction_note(),
    'learning_objectives', public._laebp_blueprint_learning_objectives(),
    'learning_sources', public._laebp_blueprint_learning_sources(),
    'adaptation_principles', public._laebp_blueprint_adaptation_principles(),
    'companion_examples', public._laebp_blueprint_companion_examples(),
    'self_love_connection', public._laebp_blueprint_self_love_connection(),
    'trust_connection', public._laebp_blueprint_trust_connection(),
    'dogfooding', public._laebp_blueprint_dogfooding(),
    'integration_links', public._laebp_blueprint_integration_links(),
    'engagement_summary', public._laebp_engagement_summary(v_tenant_id),
    'success_criteria', public._laebp_blueprint_success_criteria(v_tenant_id),
    'vision_phrases', public._laebp_blueprint_vision_phrases(),
    'privacy_note', 'Learning is tenant-isolated, explainable, auditable, and reversible. Metadata only — no raw customer content.',
    'principles', jsonb_build_array(
      'Observe → Suggest → User decides → Outcome → Feedback → Learning updated',
      'Aipify learns WITH the customer — not FROM the customer',
      'Metadata only — human approval before material behavior changes',
      'Every pattern explainable, auditable, and reversible',
      'Recommendations are guidance — humans decide'
    ),
    'implementation_blueprint_phase93', jsonb_build_object(
      'phase', 'Phase 93 — Adaptive Learning & Organizational Capability Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE93_ADAPTIVE_LEARNING_ORGANIZATIONAL_CAPABILITY.md',
      'engine_phase', 'Phase 65 Learning Engine (extends Phase 29 + Phase 23)',
      'route', '/app/learning',
      'mapping_note', 'ABOS Blueprint Phase 93 extends Phase 65/29/23 with adaptive capability detection and organizational capability pathways. Distinct from Learning & Training A.36/Phase 92, Billing repo Phase 93, and Wisdom Engine A.93.'
    ),
    'adaptive_learning_organizational_capability_engine_note', 'Adaptive Learning & Organizational Capability Engine (ABOS Phase 93) — identify capability needs, create adaptive experiences, cultivate daily-work learning — empowerment not surveillance.',
    'adaptive_learning_organizational_capability_blueprint', public._alocbp93_blueprint_block(v_tenant_id),
    'adaptive_organizational_distinction_note', public._alocbp93_distinction_note(),
    'adaptive_organizational_mission', public._alocbp93_mission(),
    'adaptive_organizational_philosophy', public._alocbp93_philosophy(),
    'adaptive_organizational_abos_principle', public._alocbp93_abos_principle(),
    'adaptive_organizational_objectives', public._alocbp93_objectives(),
    'adaptive_organizational_learning_signals', public._alocbp93_learning_signals(),
    'adaptive_organizational_capability_questions', public._alocbp93_capability_questions(),
    'adaptive_organizational_pathways', public._alocbp93_adaptive_learning_pathways(),
    'adaptive_organizational_companion_guidance', public._alocbp93_companion_guidance(),
    'adaptive_organizational_knowledge_reinforcement', public._alocbp93_knowledge_reinforcement(),
    'adaptive_organizational_community_learning', public._alocbp93_community_learning_connection(),
    'adaptive_organizational_self_love_connection', public._alocbp93_self_love_connection(),
    'adaptive_organizational_leadership_insights', public._alocbp93_leadership_insights(),
    'adaptive_organizational_trust_connection', public._alocbp93_trust_connection(),
    'adaptive_organizational_privacy_principles', public._alocbp93_privacy_principles(),
    'adaptive_organizational_dogfooding', public._alocbp93_dogfooding(),
    'adaptive_organizational_integration_links', public._alocbp93_integration_links(),
    'adaptive_organizational_engagement_summary', public._alocbp93_engagement_summary(v_tenant_id),
    'adaptive_organizational_success_criteria', public._alocbp93_success_criteria(v_tenant_id),
    'adaptive_organizational_vision', public._alocbp93_vision(),
    'adaptive_organizational_vision_phrases', public._alocbp93_vision_phrases(),
    'adaptive_organizational_privacy_note', 'Adaptive learning blueprint data is metadata only — no surveillance tracking, no individual capability scores, no PII. Humans decide; Aipify informs and prepares.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve Phase 23 fields; append Phase 93 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_learning_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_engagement jsonb;
  v_adaptive_engagement jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._lrn_ensure_settings(v_tenant_id);

  v_engagement := public._laebp_engagement_summary(v_tenant_id);
  v_adaptive_engagement := public._alocbp93_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'enabled', (select enabled from public.learning_settings where tenant_id = v_tenant_id),
    'total_events', (select count(*) from public.learning_events where tenant_id = v_tenant_id),
    'positive_feedback', (select count(*) from public.learning_feedback where tenant_id = v_tenant_id and feedback_type in ('helpful', 'approved')),
    'negative_feedback', (select count(*) from public.learning_feedback where tenant_id = v_tenant_id and feedback_type in ('not_helpful', 'false_positive', 'too_noisy', 'rejected')),
    'philosophy', 'Observe → Suggest → User decides → Outcome → Feedback → Learning updated',
    'privacy_note', 'Learning is tenant-isolated, explainable, auditable, and reversible.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 23 — Learning & Adaptation Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE23_LEARNING_ADAPTATION.md',
      'engine_phase', 'Phase 65 Learning Engine (extends Phase 29)',
      'route', '/app/learning'
    ),
    'mission', 'Continuous improvement through observation, feedback, and experience — preserving trust and human oversight.',
    'abos_principle', 'Strongest organizations keep learning — make learning visible, practical, and continuous.',
    'core_principle', 'Aipify learns WITH the customer — not FROM the customer.',
    'engagement_summary', v_engagement,
    'blueprint_note', 'Learning & Adaptation Engine (ABOS Phase 23) — extends Phase 65 with blueprint metadata, learning sources, adaptation principles, and live success criteria.',
    'implementation_blueprint_phase93', jsonb_build_object(
      'phase', 'Phase 93 — Adaptive Learning & Organizational Capability Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE93_ADAPTIVE_LEARNING_ORGANIZATIONAL_CAPABILITY.md',
      'engine_phase', 'Phase 65 Learning Engine (extends Phase 29 + Phase 23)',
      'route', '/app/learning'
    ),
    'adaptive_organizational_mission', public._alocbp93_mission(),
    'adaptive_organizational_abos_principle', public._alocbp93_abos_principle(),
    'adaptive_organizational_engagement_summary', v_adaptive_engagement,
    'adaptive_organizational_note', 'Adaptive Learning & Organizational Capability Engine (ABOS Phase 93) — capability needs, adaptive pathways, empowerment not surveillance.',
    'adaptive_organizational_vision_note', public._alocbp93_vision()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._alocbp93_distinction_note() to authenticated;
grant execute on function public._alocbp93_mission() to authenticated;
grant execute on function public._alocbp93_philosophy() to authenticated;
grant execute on function public._alocbp93_abos_principle() to authenticated;
grant execute on function public._alocbp93_vision() to authenticated;
grant execute on function public._alocbp93_objectives() to authenticated;
grant execute on function public._alocbp93_learning_signals() to authenticated;
grant execute on function public._alocbp93_capability_questions() to authenticated;
grant execute on function public._alocbp93_adaptive_learning_pathways() to authenticated;
grant execute on function public._alocbp93_companion_guidance() to authenticated;
grant execute on function public._alocbp93_knowledge_reinforcement() to authenticated;
grant execute on function public._alocbp93_community_learning_connection() to authenticated;
grant execute on function public._alocbp93_self_love_connection() to authenticated;
grant execute on function public._alocbp93_leadership_insights() to authenticated;
grant execute on function public._alocbp93_trust_connection() to authenticated;
grant execute on function public._alocbp93_privacy_principles() to authenticated;
grant execute on function public._alocbp93_dogfooding() to authenticated;
grant execute on function public._alocbp93_vision_phrases() to authenticated;
grant execute on function public._alocbp93_integration_links() to authenticated;
grant execute on function public._alocbp93_engagement_summary(uuid) to authenticated;
grant execute on function public._alocbp93_success_criteria(uuid) to authenticated;
grant execute on function public._alocbp93_blueprint_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'adaptive-learning-organizational-capability-blueprint-phase93', 'Adaptive Learning & Organizational Capability Engine (ABOS Phase 93)',
  'Adaptive Learning & Organizational Capability Engine — extends Learning Engine Phase 65/29/23 with capability signals, adaptive pathways, companion-guided coaching, and empowerment-first privacy. No surveillance tracking.',
  'authenticated', 124
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'adaptive-learning-organizational-capability-blueprint-phase93' and tenant_id is null
);
