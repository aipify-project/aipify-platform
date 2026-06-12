-- Implementation Blueprint Phase 89 — Community & Collective Intelligence Engine
-- Extends Community & Collective Intelligence repo Phase 89 + Blueprint Phase 24 + Phase 52 at /app/community.
-- No new tables — metadata helpers and dashboard/card RPC extensions only.
-- Phase number collision: Gratitude & Recognition Engine Phase A.89 at /app/gratitude-recognition-engine.

-- ---------------------------------------------------------------------------
-- Distinction & static blueprint helpers (_ccibp89_*)
-- ---------------------------------------------------------------------------

create or replace function public._ccibp89_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 89 — Community & Collective Intelligence Engine at /app/community. Extends repo Phase 89 Community hub with collective experience insights, idea discovery, and community recognition scaffolds — preserves Blueprint Phase 24 and Phase 52 fields. Distinct from Gratitude & Recognition Engine Phase A.89 at /app/gratitude-recognition-engine (engine phase number collision — recognition cross-link only). Shared learning, not surveillance — collective intelligence strengthens people; humans decide.';
$$;

create or replace function public._ccibp89_mission()
returns text language sql immutable as $$
  select 'Strengthen learning, innovation, and adaptability through collective experience insights.';
$$;

create or replace function public._ccibp89_philosophy()
returns text language sql immutable as $$
  select 'Wisdom rarely lives in one individual alone — collective intelligence strengthens people, it does not replace them.';
$$;

create or replace function public._ccibp89_abos_principle()
returns text language sql immutable as $$
  select 'Shared learning, not surveillance — Aipify surfaces governed collective patterns from anonymized contributions; humans decide what to adopt.';
$$;

create or replace function public._ccibp89_vision()
returns text language sql immutable as $$
  select 'Our greatest ideas did not emerge from one individual alone. They emerged because we learned together.';
$$;

create or replace function public._ccibp89_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'collective_experience_insights', 'label', 'Collective experience insights', 'description', 'Strengthen learning from governed, anonymized community observations — metadata only'),
    jsonb_build_object('key', 'innovation_surfacing', 'label', 'Innovation surfacing', 'description', 'Surface innovation and adaptability patterns without prescribing outcomes'),
    jsonb_build_object('key', 'idea_discovery', 'label', 'Idea discovery', 'description', 'Discover feature requests, process improvements, and customer needs responsibly'),
    jsonb_build_object('key', 'wisdom_amplification', 'label', 'Wisdom amplification', 'description', 'Amplify community wisdom — companion guidance strengthens people, not replaces them'),
    jsonb_build_object('key', 'contribution_recognition', 'label', 'Contribution recognition', 'description', 'Recognize learning, support, and leadership contributions — cross-link Gratitude A.89'),
    jsonb_build_object('key', 'learning_organization_evolution', 'label', 'Learning organization evolution', 'description', 'Connect collective intelligence to KC, FAQ, training, and product evolution')
  );
$$;

create or replace function public._ccibp89_collective_intelligence_sources()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collective intelligence draws from governed, anonymized sources — never raw communications, org identity, or confidential records.',
    'sources', jsonb_build_array(
      jsonb_build_object('key', 'customer_feedback', 'label', 'Customer feedback', 'description', 'Anonymized satisfaction and usefulness metadata — never raw chats or PII'),
      jsonb_build_object('key', 'sales_expert_experiences', 'label', 'Sales Expert experiences', 'description', 'Governed sales wisdom — distinct from Sales Expert Community Phase 47 peer mentorship'),
      jsonb_build_object('key', 'support_observations', 'label', 'Support observations', 'description', 'Triage patterns, escalation improvements, and knowledge gap signals — metadata only'),
      jsonb_build_object('key', 'internal_communities', 'label', 'Internal communities', 'description', 'Voluntary org-wide knowledge sharing within governance workflow'),
      jsonb_build_object('key', 'kc_contributions', 'label', 'KC contributions', 'description', 'Knowledge Center articles and playbooks enriched by collective patterns'),
      jsonb_build_object('key', 'approved_suggestions', 'label', 'Approved suggestions', 'description', 'Human-approved improvement suggestions entering the collective library'),
      jsonb_build_object('key', 'community_discussions', 'label', 'Community discussions', 'description', 'Governed blueprint enhancements and operational lessons — metadata summaries only')
    )
  );
$$;

create or replace function public._ccibp89_community_observations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Community observations inform — they do not prescribe. Shared learning, not surveillance.',
    'tone', 'inform_not_surveil',
    'examples', jsonb_build_array(
      jsonb_build_object(
        'emoji', '🦉',
        'key', 'pattern_across_community',
        'scenario', 'Pattern across the community',
        'example', '🦉 Aipify noticed a recurring onboarding pattern across governed contributions — worth reviewing for your team without exposing who shared it.'
      ),
      jsonb_build_object(
        'emoji', '🌹',
        'key', 'shared_learning',
        'scenario', 'Shared learning — you are not alone',
        'example', '🌹 Similar process improvement challenges appear in collective observations — you are not alone; optional insights may help when your team is ready.'
      ),
      jsonb_build_object(
        'emoji', '🔔',
        'key', 'community_insight_ready',
        'scenario', 'Community insight worth exploring',
        'example', '🔔 A validated support workflow insight emerged from community discussions — informative, not mandatory; explore when appropriate.'
      )
    )
  );
$$;

create or replace function public._ccibp89_idea_discovery()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Idea discovery surfaces themes from governed contributions — humans approve what enters collective intelligence.',
    'categories', jsonb_build_array(
      jsonb_build_object('key', 'feature_requests', 'label', 'Feature requests', 'signals', jsonb_build_array('Repeated capability requests across anonymized contributions', 'Blueprint enhancement themes from community discussions')),
      jsonb_build_object('key', 'process_improvements', 'label', 'Process improvements', 'signals', jsonb_build_array('Workflow optimization patterns', 'Approval cadence and handoff improvements')),
      jsonb_build_object('key', 'customer_needs', 'label', 'Customer needs', 'signals', jsonb_build_array('Emerging support themes — metadata only', 'Knowledge gap patterns from collective observations')),
      jsonb_build_object('key', 'training', 'label', 'Training', 'signals', jsonb_build_array('Role-based learning path suggestions', 'Academy resource effectiveness patterns')),
      jsonb_build_object('key', 'product_innovation', 'label', 'Product innovation', 'signals', jsonb_build_array('Adoption accelerator patterns', 'Community-validated innovation themes — no confidential roadmaps'))
    )
  );
$$;

create or replace function public._ccibp89_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion guidance amplifies wisdom — it does not dominate. Collective intelligence strengthens people.',
    'examples', jsonb_build_array(
      jsonb_build_object(
        'emoji', '🦉',
        'key', 'collective_pattern',
        'prompt', '🦉 Aipify found a collective pattern worth exploring — shall Aipify prepare a summary for your next team review?',
        'consideration', 'Wisdom amplification — optional insight, not prescription.'
      ),
      jsonb_build_object(
        'emoji', '🌹',
        'key', 'recognize_contribution',
        'prompt', '🌹 A community contribution strengthened collective learning this month — recognition may be appropriate when your team celebrates progress.',
        'consideration', 'Cross-link Gratitude & Recognition A.89 — recognition connection only.'
      ),
      jsonb_build_object(
        'emoji', '🔔',
        'key', 'idea_theme',
        'prompt', '🔔 An idea discovery theme around process improvements emerged — explore when your team has capacity; no urgency framing.',
        'consideration', 'Humans decide timing — Aipify surfaces governed themes only.'
      )
    )
  );
$$;

create or replace function public._ccibp89_community_recognition()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Community recognition celebrates contributions to collective intelligence — cross-link Gratitude A.89, do not duplicate recognition storage.',
    'domains', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'key', 'contributions', 'label', 'Contributions', 'description', 'Governed knowledge packs, lessons learned, and blueprint enhancements shared responsibly'),
      jsonb_build_object('emoji', '🌹', 'key', 'learning', 'label', 'Learning', 'description', 'Teams that strengthen collective learning through voluntary participation'),
      jsonb_build_object('emoji', '🌹', 'key', 'support', 'label', 'Support', 'description', 'Support observations and triage improvements that help the broader ecosystem'),
      jsonb_build_object('emoji', '🌹', 'key', 'leadership', 'label', 'Leadership', 'description', 'Leaders who model governed sharing and trust transparency')
    ),
    'gratitude_route', '/app/gratitude-recognition-engine',
    'boundary_note', 'Gratitude & Recognition Engine Phase A.89 — engine phase number collision with repo Community Phase 89; cross-link only.'
  );
$$;

create or replace function public._ccibp89_learning_organization_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collective intelligence enriches learning organization scaffolds — governed publication only.',
    'surfaces', jsonb_build_array(
      jsonb_build_object('label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center', 'note', 'FAQs and playbooks informed by collective patterns'),
      jsonb_build_object('label', 'FAQ evolution', 'route', '/app/knowledge-center', 'note', 'Frequently requested topics from anonymized knowledge gap signals'),
      jsonb_build_object('label', 'Learning & Training (A.36)', 'route', '/app/academy', 'note', 'Training paths may reference collective best practices — tenant learning remains distinct'),
      jsonb_build_object('label', 'Product evolution', 'route', '/app/continuous-improvement-engine', 'note', 'Community-validated improvement themes inform product evolution — humans govern adoption'),
      jsonb_build_object('label', 'Employee Knowledge (EKE)', 'route', '/app/settings/employee-knowledge', 'note', 'Internal employee knowledge complements collective community insights — tenant-scoped')
    )
  );
$$;

create or replace function public._ccibp89_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collective progress normalizes challenges — shared learning reduces isolation without judgment or pressure.',
    'practices', jsonb_build_array(
      'Normalize shared challenges — ecosystem patterns show others face similar obstacles',
      'Encourage learning at your pace — collective insights are optional',
      'Reduce fear of imperfection — governed sharing celebrates progress, not perfection',
      'Celebrate collective progress — wisdom compounds when experiences are shared responsibly'
    ),
    'journey_phrase', 'Our greatest ideas did not emerge from one individual alone. They emerged because we learned together.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love A.76 influences tone — encouragement only. Community Intelligence stores anonymized metadata, not wellbeing content.'
  );
$$;

create or replace function public._ccibp89_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Shared learning requires trust — permission, transparency, and explainability are non-negotiable.',
    'users_should_know', jsonb_build_array(
      'Collective intelligence is optional — teams choose what to explore and adopt',
      'Only anonymized, governed contributions enter ecosystem aggregates',
      'Contributions require permission — never used without approval workflow completion',
      'Participation is voluntary — opt in to contribute, opt out anytime',
      'No hidden profiling — shared learning, not surveillance'
    ),
    'operators_should_understand', jsonb_build_array(
      'Workflow: draft → review → governance → anonymization → publication',
      'Distinct from Cross-Tenant Intelligence A.71 — tenant community hub, not platform-wide browsing',
      'Distinct from Gratitude & Recognition A.89 — recognition experiences, not collective intelligence storage',
      'Distinct from Ecosystem Intelligence Phase 88 — external relationships, not internal community wisdom',
      'Impact Metrics Phase 21 forbidden-keys mindset applies to all collective payloads'
    ),
    'audit_note', 'Community contributions, briefings, and audit logs — metadata only, no PII or confidential content.'
  );
$$;

create or replace function public._ccibp89_privacy_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Shared learning, not surveillance — collective intelligence without compromising dignity or confidentiality.',
    'must', jsonb_build_array(
      'Anonymized aggregation only — no org identity disclosure',
      'Explicit permission before contributions enter collective intelligence',
      'Governed review workflow — draft through publication approval',
      'Explainability — what contributes to insights is transparent',
      'Voluntary participation — organizations control opt-in'
    ),
    'must_not', jsonb_build_array(
      'Hidden profiling of individuals or organizations',
      'Public exposure of private experiences without permission',
      'Using contributions without completing approval workflow',
      'Reducing individuals to data points — people strengthen collective intelligence',
      'Surveillance framing — observations inform, they do not monitor'
    ),
    'shared_learning_note', 'Shared learning, not surveillance.'
  );
$$;

create or replace function public._ccibp89_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates Community & Collective Intelligence Blueprint Phase 89 internally; Unonight is the first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — Sales Expert communities, support, product feedback, KC evolution, companion philosophy',
      'focus', jsonb_build_array(
        'Sales Expert community collective wisdom validation',
        'Support observation pattern calibration',
        'Product feedback and idea discovery themes',
        'Knowledge Center evolution from collective contributions',
        'Companion philosophy — amplify wisdom, not dominate'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — community contributions and voluntary governance',
      'focus', jsonb_build_array(
        'Commerce support collective observations',
        'Voluntary contribution governance validation',
        'Idea discovery from operational lessons',
        'Recognition culture cross-link with Gratitude A.89'
      )
    )
  );
$$;

create or replace function public._ccibp89_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Community repo Phase 89', 'route', '/app/community', 'note', 'Governed community hub — this blueprint extends'),
    jsonb_build_object('label', 'Blueprint Phase 24', 'route', '/app/community', 'note', 'First ABOS community blueprint — preserved fields'),
    jsonb_build_object('label', 'Blueprint Phase 52', 'route', '/app/community', 'note', 'Collective Learning & Wisdom — preserved fields'),
    jsonb_build_object('label', 'Gratitude & Recognition (A.89)', 'route', '/app/gratitude-recognition-engine', 'note', 'Recognition connection — engine phase number collision'),
    jsonb_build_object('label', 'Cross-Tenant Intelligence (A.71)', 'route', '/app/cross-tenant-intelligence-engine', 'note', 'Platform-wide pattern intelligence — distinct from tenant community hub'),
    jsonb_build_object('label', 'Organizational Benchmarking (A.58)', 'route', '/app/organizational-benchmarking-engine', 'note', 'Anonymized benchmarking aggregates — cross-link only'),
    jsonb_build_object('label', 'Learning Engine (Phase 23)', 'route', '/app/learning', 'note', 'Tenant learning memory with approval — not cross-ecosystem aggregates'),
    jsonb_build_object('label', 'Continuous Improvement (A.49)', 'route', '/app/continuous-improvement-engine', 'note', 'Operational improvement cycles — cross-link idea discovery'),
    jsonb_build_object('label', 'Continuous Improvement (A.33)', 'route', '/app/continuous-improvement-engine', 'note', 'Improvement workflow — cross-link only'),
    jsonb_build_object('label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center', 'note', 'FAQs, playbooks, industry guidance enriched by collective patterns'),
    jsonb_build_object('label', 'Employee Knowledge (EKE)', 'route', '/app/settings/employee-knowledge', 'note', 'Internal employee knowledge — tenant-scoped, complements community'),
    jsonb_build_object('label', 'Wisdom Engine (A.93)', 'route', '/app/wisdom-engine', 'note', 'Companion wisdom interventions — cross-link collective observations'),
    jsonb_build_object('label', 'Curiosity & Discovery (A.87)', 'route', '/app/curiosity-discovery-engine', 'note', 'Curiosity-led exploration — distinct from collective community hub'),
    jsonb_build_object('label', 'Ecosystem Intelligence (Phase 88)', 'route', '/app/ecosystem', 'note', 'External relationship intelligence — distinct from internal community wisdom'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Collective progress normalization — principle only'),
    jsonb_build_object('label', 'Impact Metrics (Phase 21)', 'route', '/platform/impact', 'note', 'Platform Admin — anonymised proof, forbidden-keys privacy rules')
  );
$$;

create or replace function public._ccibp89_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_collective jsonb;
  v_engagement jsonb;
begin
  v_collective := public._clwbp_collective_summary(p_organization_id);
  v_engagement := public._ccibp_engagement_summary(p_organization_id);

  return jsonb_build_object(
    'collective_intelligence_sources', jsonb_array_length(public._ccibp89_collective_intelligence_sources()->'sources'),
    'community_observation_examples', jsonb_array_length(public._ccibp89_community_observations()->'examples'),
    'idea_discovery_categories', jsonb_array_length(public._ccibp89_idea_discovery()->'categories'),
    'companion_guidance_examples', jsonb_array_length(public._ccibp89_companion_guidance()->'examples'),
    'recognition_domains', jsonb_array_length(public._ccibp89_community_recognition()->'domains'),
    'learning_organization_surfaces', jsonb_array_length(public._ccibp89_learning_organization_connection()->'surfaces'),
    'integration_links', jsonb_array_length(public._ccibp89_integration_links()),
    'tenant_contributions_total', coalesce((v_collective->>'tenant_contributions_total')::int, 0),
    'ecosystem_published_total', coalesce((v_collective->>'ecosystem_published_total')::int, 0),
    'contributions_total', coalesce((v_engagement->>'contributions_total')::int, 0),
    'published_contributions', coalesce((v_engagement->>'published_contributions')::int, 0),
    'participation_enabled', coalesce((v_engagement->>'participation_enabled')::boolean, false),
    'privacy_note', 'Shared learning, not surveillance — aggregates only, no identities or confidential content.'
  );
end; $$;

create or replace function public._ccibp89_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_summary jsonb;
  v_tenant_published int := 0;
  v_ecosystem_published int := 0;
  v_participation_enabled boolean := false;
  v_anonymization_required boolean := true;
begin
  v_summary := public._clwbp_collective_summary(p_organization_id);
  v_tenant_published := coalesce((v_summary->>'tenant_published')::int, 0);
  v_ecosystem_published := coalesce((v_summary->>'ecosystem_published_total')::int, 0);

  select coalesce(participation_enabled, false), coalesce(anonymization_required, true)
  into v_participation_enabled, v_anonymization_required
  from public.community_settings where tenant_id = p_organization_id;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'collective_intelligence_sources',
      'label', 'Collective intelligence sources — seven governed sources documented',
      'met', jsonb_array_length(public._ccibp89_collective_intelligence_sources()->'sources') >= 7,
      'note', 'Customer feedback, Sales Expert, support, internal communities, KC, approved suggestions, discussions.'
    ),
    jsonb_build_object(
      'key', 'community_observations',
      'label', 'Community observations — inform not surveil (🦉🌹🔔)',
      'met', jsonb_array_length(public._ccibp89_community_observations()->'examples') >= 3,
      'note', 'Shared learning, not surveillance.'
    ),
    jsonb_build_object(
      'key', 'idea_discovery',
      'label', 'Idea discovery — feature, process, customer, training, innovation',
      'met', jsonb_array_length(public._ccibp89_idea_discovery()->'categories') >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Companion guidance — amplify wisdom, not dominate',
      'met', jsonb_array_length(public._ccibp89_companion_guidance()->'examples') >= 3,
      'note', 'Collective intelligence strengthens people.'
    ),
    jsonb_build_object(
      'key', 'community_recognition',
      'label', 'Community recognition — contributions, learning, support, leadership',
      'met', jsonb_array_length(public._ccibp89_community_recognition()->'domains') >= 4,
      'note', 'Cross-link Gratitude A.89 — recognition connection only.'
    ),
    jsonb_build_object(
      'key', 'learning_organization_connection',
      'label', 'Learning organization connection — KC, FAQ, training, product evolution',
      'met', jsonb_array_length(public._ccibp89_learning_organization_connection()->'surfaces') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'privacy_principles',
      'label', 'Privacy principles — shared learning not surveillance',
      'met', jsonb_array_length(public._ccibp89_privacy_principles()->'must_not') >= 4,
      'note', 'No hidden profiling, no exposure without permission, no reducing people to data points.'
    ),
    jsonb_build_object(
      'key', 'anonymization_effective',
      'label', 'Anonymization effective — voluntary participation',
      'met', v_anonymization_required and (v_participation_enabled or v_tenant_published > 0 or v_ecosystem_published > 0),
      'note', case when not v_participation_enabled and v_tenant_published = 0 then 'Enable participation when ready to contribute.' else null end
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — collective progress without pressure',
      'met', (public._ccibp89_self_love_connection()->>'journey_phrase') is not null,
      'note', 'Encouragement only — no surveillance framing.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — permission and transparency documented',
      'met', jsonb_array_length(public._ccibp89_trust_connection()->'users_should_know') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Distinct from Gratitude A.89, Cross-Tenant A.71, Ecosystem Phase 88, Learning Phase 23',
      'met', jsonb_array_length(public._ccibp89_integration_links()) >= 12,
      'note', 'Cross-link related engines — do not duplicate intelligence storage.'
    ),
    jsonb_build_object(
      'key', 'vision',
      'label', 'Vision phrase documented',
      'met', (public._ccibp89_vision()) is not null,
      'note', 'Our greatest ideas emerged because we learned together.'
    )
  );
end; $$;

create or replace function public._ccibp89_community_collective_intelligence_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'implementation_blueprint_phase89', jsonb_build_object(
      'phase', 'Phase 89 — Community & Collective Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE89_COMMUNITY_COLLECTIVE_INTELLIGENCE.md',
      'engine_phase', 'Repo Phase 89 Community & Collective Intelligence',
      'extends', 'Blueprint Phase 24 + Phase 52 Collective Learning & Wisdom',
      'route', '/app/community',
      'admin_route', '/app/community/admin',
      'mapping_note', 'ABOS Blueprint Phase 89 extends repo Phase 89 community hub — collective experience insights, idea discovery, community recognition. Distinct from Gratitude & Recognition A.89 at /app/gratitude-recognition-engine (phase number collision). Preserves Phase 24 and Phase 52 fields.'
    ),
    'community_collective_intelligence_note', 'Community & Collective Intelligence Engine (ABOS Blueprint Phase 89) — strengthen learning, innovation, and adaptability through collective experience insights. Shared learning, not surveillance.',
    'distinction_note', public._ccibp89_distinction_note(),
    'mission', public._ccibp89_mission(),
    'philosophy', public._ccibp89_philosophy(),
    'abos_principle', public._ccibp89_abos_principle(),
    'vision', public._ccibp89_vision(),
    'objectives', public._ccibp89_objectives(),
    'collective_intelligence_sources', public._ccibp89_collective_intelligence_sources(),
    'community_observations', public._ccibp89_community_observations(),
    'idea_discovery', public._ccibp89_idea_discovery(),
    'companion_guidance', public._ccibp89_companion_guidance(),
    'community_recognition', public._ccibp89_community_recognition(),
    'learning_organization_connection', public._ccibp89_learning_organization_connection(),
    'self_love_connection', public._ccibp89_self_love_connection(),
    'trust_connection', public._ccibp89_trust_connection(),
    'privacy_principles', public._ccibp89_privacy_principles(),
    'dogfooding', public._ccibp89_dogfooding(),
    'success_criteria', public._ccibp89_success_criteria(p_organization_id),
    'integration_links', public._ccibp89_integration_links(),
    'engagement_summary', public._ccibp89_engagement_summary(p_organization_id),
    'shared_learning_not_surveillance_note', 'Shared learning, not surveillance.',
    'privacy_note', 'Community collective intelligence metadata only — governed contributions, observation themes, and idea discovery scaffolds. No PII, hidden profiling, or confidential content.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- Dashboard — preserve ALL Phase 89 repo + Phase 24 + Phase 52; append Phase 89 blueprint
-- ---------------------------------------------------------------------------

create or replace function public.get_community_intelligence_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.community_settings;
  v_scores jsonb;
  v_briefings jsonb;
begin
  v_tenant_id := public._col_require_tenant();
  v_settings := public._col_ensure_settings(v_tenant_id);
  perform public._col_seed_templates(v_tenant_id);
  perform public._col_seed_suggestions(v_tenant_id);
  v_scores := public._col_calculate_scores(v_tenant_id);
  perform public._col_trust_explanation(v_tenant_id, (v_scores->>'health_score')::numeric);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'summary', b.summary, 'created_at', b.created_at
  ) order by b.created_at desc), '[]'::jsonb) into v_briefings
  from public.community_briefings b where b.tenant_id = v_tenant_id limit 5;

  return jsonb_build_object(
    'has_customer', true,
    'participation_enabled', v_settings.participation_enabled,
    'participation_voluntary', true,
    'anonymization_required', v_settings.anonymization_required,
    'philosophy', 'Organizations own their knowledge. Organizations control participation.',
    'safety_note', 'No confidential sharing. Participation is voluntary, governed, and anonymized.',
    'health_score', v_scores->'health_score',
    'intelligence_score', v_scores->'intelligence_score',
    'contribution_score', v_scores->'contribution_score',
    'score_components', v_scores->'components',
    'featured_learnings', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'description', left(c.anonymized_description, 300),
        'category', c.category, 'category_label', public._col_category_label(c.category),
        'contribution_type', c.contribution_type, 'type_label', public._col_contribution_type_label(c.contribution_type),
        'rating_avg', c.rating_avg, 'rating_count', c.rating_count, 'published_at', c.published_at
      ) order by c.published_at desc)
      from public.community_contributions c
      where c.status = 'published' and c.anonymization_verified = true limit 6
    ), '[]'::jsonb),
    'featured_insights', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'description', left(c.anonymized_description, 300),
        'category', c.category, 'contribution_type', c.contribution_type,
        'type_label', public._col_contribution_type_label(c.contribution_type),
        'rating_avg', c.rating_avg, 'rating_count', c.rating_count
      ) order by c.published_at desc)
      from public.community_contributions c
      where c.status = 'published' and c.anonymization_verified = true limit 6
    ), '[]'::jsonb),
    'best_practices', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'category', c.category,
        'category_label', public._col_category_label(c.category), 'rating_avg', c.rating_avg
      ) order by c.rating_avg desc)
      from public.community_contributions c
      where c.status = 'published' and c.category in ('knowledge', 'governance', 'operational') limit 8
    ), '[]'::jsonb),
    'recently_validated', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'category', c.category,
        'category_label', public._col_category_label(c.category), 'published_at', c.published_at
      ) order by c.published_at desc)
      from public.community_contributions c
      where c.status = 'published' and c.published_at > now() - interval '90 days' limit 8
    ), '[]'::jsonb),
    'blueprint_recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'description', left(c.anonymized_description, 200)
      ))
      from public.community_contributions c
      where c.status = 'published' and c.category = 'industry' limit 5
    ), '[]'::jsonb),
    'blueprint_discussions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'description', left(c.anonymized_description, 200)
      ))
      from public.community_contributions c
      where c.status = 'published' and c.contribution_type = 'blueprint_enhancement' limit 5
    ), '[]'::jsonb),
    'industry_insights', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'description', left(c.anonymized_description, 200),
        'category_label', public._col_category_label(c.category)
      ))
      from public.community_contributions c
      where c.status = 'published' and c.category = 'industry' limit 6
    ), '[]'::jsonb),
    'popular_resources', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'rating_avg', c.rating_avg, 'rating_count', c.rating_count
      ) order by c.rating_avg desc, c.rating_count desc)
      from public.community_contributions c where c.status = 'published' limit 10
    ), '[]'::jsonb),
    'top_rated', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'rating_avg', c.rating_avg, 'rating_count', c.rating_count
      ) order by c.rating_avg desc, c.rating_count desc)
      from public.community_contributions c where c.status = 'published' limit 10
    ), '[]'::jsonb),
    'briefings', v_briefings,
    'intelligence_categories', jsonb_build_array(
      jsonb_build_object('key', 'knowledge', 'label', 'Knowledge Contributions'),
      jsonb_build_object('key', 'operational', 'label', 'Operational Contributions'),
      jsonb_build_object('key', 'governance', 'label', 'Governance Contributions'),
      jsonb_build_object('key', 'customer_success', 'label', 'Customer Success Contributions'),
      jsonb_build_object('key', 'industry', 'label', 'Industry Contributions'),
      jsonb_build_object('key', 'marketplace', 'label', 'Marketplace Contributions')
    ),
    'contribution_types', jsonb_build_array(
      jsonb_build_object('key', 'knowledge_article', 'label', 'Knowledge Articles'),
      jsonb_build_object('key', 'implementation_guide', 'label', 'Implementation Guides'),
      jsonb_build_object('key', 'blueprint_enhancement', 'label', 'Blueprint Enhancements'),
      jsonb_build_object('key', 'business_pack_review', 'label', 'Business Pack Reviews'),
      jsonb_build_object('key', 'operational_lesson', 'label', 'Operational Lessons Learned'),
      jsonb_build_object('key', 'governance_recommendation', 'label', 'Governance Recommendations'),
      jsonb_build_object('key', 'adoption_success_story', 'label', 'Adoption Success Stories'),
      jsonb_build_object('key', 'risk_mitigation_practice', 'label', 'Risk Mitigation Practices')
    ),
    'approval_workflow', jsonb_build_array(
      jsonb_build_object('step', 'draft', 'label', 'Draft'),
      jsonb_build_object('step', 'review', 'label', 'Internal Review'),
      jsonb_build_object('step', 'governance_check', 'label', 'Governance Validation'),
      jsonb_build_object('step', 'anonymization_check', 'label', 'Anonymization Check'),
      jsonb_build_object('step', 'published', 'label', 'Publication Approval'),
      jsonb_build_object('step', 'community_rating', 'label', 'Community Availability')
    ),
    'integrations', jsonb_build_object(
      'learning_engine', 'Improves recommendations, knowledge suggestions, and Human Success initiatives',
      'knowledge_center', 'Enriches FAQs, playbooks, best practices, and Blueprint guidance',
      'global_learning', 'Strengthens pattern recognition and industry guidance',
      'marketplace', 'Community feedback, outcome validation, and pack improvements',
      'strategic_intelligence', 'Emerging trends, repeated opportunities, and community priorities',
      'human_success', 'Successful onboarding patterns and adoption accelerators',
      'executive_briefing', 'Community intelligence briefings'
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 24 — Community & Collective Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE24_COMMUNITY_COLLECTIVE_INTELLIGENCE.md',
      'engine_phase', 'Phase 89 Community & Collective Intelligence',
      'route', '/app/community',
      'admin_route', '/app/community/admin',
      'mapping_note', 'ABOS Blueprint Phase 24 maps to Community & Collective Intelligence Phase 89 — extend, do not duplicate Cross-Tenant Intelligence A.71, Benchmarking A.58, or Learning Phase 23.'
    ),
    'mission', 'Identify broader patterns, shared learning, and collective improvements across organizations — preserving privacy, security, and trust.',
    'community_philosophy', 'Organizations should not solve every problem alone — shared learning accelerates progress; collective intelligence without compromising confidentiality.',
    'abos_principle', 'Wisdom grows when experiences are shared responsibly.',
    'core_principle', 'Organizations own their knowledge. Organizations control participation.',
    'vision', 'Benefit from broader ecosystem lessons — "we would never have discovered this on our own."',
    'community_intelligence_note', 'Community & Collective Intelligence Engine (ABOS Phase 24) — extends Phase 89 with blueprint metadata, collective insight examples, privacy principles, and live success criteria.',
    'distinction_note', public._ccibp_distinction_note(),
    'community_objectives', public._ccibp_blueprint_community_objectives(),
    'collective_insight_examples', public._ccibp_blueprint_collective_insight_examples(),
    'privacy_principles', public._ccibp_blueprint_privacy_principles(),
    'community_contributions_blueprint', public._ccibp_blueprint_community_contributions(),
    'companion_examples', public._ccibp_blueprint_companion_examples(),
    'self_love_connection', public._ccibp_blueprint_self_love_connection(),
    'trust_connection', public._ccibp_blueprint_trust_connection(),
    'dogfooding', public._ccibp_blueprint_dogfooding(),
    'integration_links', public._ccibp_blueprint_integration_links(),
    'engagement_summary', public._ccibp_engagement_summary(v_tenant_id),
    'success_criteria', public._ccibp_blueprint_success_criteria(v_tenant_id),
    'vision_phrases', public._ccibp_blueprint_vision_phrases(),
    'privacy_note', 'Community intelligence is governed, anonymized, voluntary, and explainable. Metadata only — no org identity or confidential content.',
    'principles', jsonb_build_array(
      'Organizations own their knowledge — organizations control participation',
      'Voluntary participation — governed review before publication',
      'Anonymized aggregation — no org identity disclosure',
      'Collective intelligence without compromising confidentiality',
      'Trust is non-negotiable — explicit governance and transparency'
    ),
    'collective_learning_wisdom_blueprint', jsonb_build_object(
      'phase', 'Phase 52 — Collective Learning & Wisdom Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE52_COLLECTIVE_LEARNING_WISDOM.md',
      'engine_phase', 'Phase 89 Community & Collective Intelligence',
      'extends', 'Phase 24 Community Blueprint',
      'route', '/app/community',
      'admin_route', '/app/community/admin',
      'mapping_note', 'Anonymized collective wisdom compounding across the ecosystem via community intelligence — inform not prescribe.'
    ),
    'clwbp_mission', public._clwbp_blueprint_mission(),
    'clwbp_philosophy', public._clwbp_blueprint_philosophy(),
    'clwbp_abos_principle', public._clwbp_blueprint_abos_principle(),
    'clwbp_objectives', public._clwbp_blueprint_objectives(),
    'collective_observations', public._clwbp_blueprint_collective_observations(),
    'best_practice_evolution', public._clwbp_blueprint_best_practice_evolution(),
    'clwbp_anonymization_principles', public._clwbp_blueprint_anonymization_principles(),
    'knowledge_center_connection', public._clwbp_blueprint_knowledge_center_connection(),
    'sales_expert_connection', public._clwbp_blueprint_sales_expert_connection(),
    'executive_connection', public._clwbp_blueprint_executive_connection(),
    'clwbp_self_love_connection', public._clwbp_blueprint_self_love_connection(),
    'clwbp_trust_connection', public._clwbp_blueprint_trust_connection(),
    'clwbp_dogfooding', public._clwbp_blueprint_dogfooding(),
    'clwbp_integration_links', public._clwbp_blueprint_integration_links(),
    'collective_summary', public._clwbp_collective_summary(v_tenant_id),
    'clwbp_success_criteria', public._clwbp_blueprint_success_criteria(v_tenant_id),
    'clwbp_distinction_note', public._clwbp_distinction_note(),
    'clwbp_vision_phrases', public._clwbp_blueprint_vision_phrases(),
    'inform_not_prescribe_note', 'Collective observations inform — they do not prescribe. Humans decide what to adopt.',
    'community_collective_intelligence_blueprint_phase89', public._ccibp89_community_collective_intelligence_block(v_tenant_id)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- Card RPC — compact Phase 89 blueprint metadata
-- ---------------------------------------------------------------------------

create or replace function public.get_community_intelligence_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_health numeric;
  v_intelligence numeric;
  v_pending int;
  v_engagement jsonb;
  v_collective jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select health_score, contribution_score into v_health, v_intelligence
  from public.community_scores where tenant_id = v_tenant_id order by calculated_at desc limit 1;

  select count(*) into v_pending from public.community_contributions
  where tenant_id = v_tenant_id and status in ('review', 'governance_check', 'anonymization_check');

  v_engagement := public._ccibp_engagement_summary(v_tenant_id);
  v_collective := public._clwbp_collective_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'health_score', coalesce(v_health, 0),
    'intelligence_score', coalesce(v_intelligence, 0),
    'contribution_score', coalesce(v_intelligence, 0),
    'pending_reviews', v_pending,
    'philosophy', 'Organizations own their knowledge. Organizations control participation.',
    'participation_voluntary', true,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 24 — Community & Collective Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE24_COMMUNITY_COLLECTIVE_INTELLIGENCE.md',
      'engine_phase', 'Phase 89 Community & Collective Intelligence',
      'route', '/app/community',
      'admin_route', '/app/community/admin'
    ),
    'collective_learning_wisdom_blueprint', jsonb_build_object(
      'phase', 'Phase 52 — Collective Learning & Wisdom Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE52_COLLECTIVE_LEARNING_WISDOM.md',
      'route', '/app/community'
    ),
    'community_collective_intelligence_blueprint_phase89', jsonb_build_object(
      'phase', 'Phase 89 — Community & Collective Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE89_COMMUNITY_COLLECTIVE_INTELLIGENCE.md',
      'route', '/app/community'
    ),
    'mission', 'Identify broader patterns and collective improvements — preserving privacy, security, and trust.',
    'clwbp_mission', public._clwbp_blueprint_mission(),
    'ccibp89_mission', public._ccibp89_mission(),
    'abos_principle', 'Wisdom grows when experiences are shared responsibly.',
    'clwbp_abos_principle', public._clwbp_blueprint_abos_principle(),
    'ccibp89_abos_principle', public._ccibp89_abos_principle(),
    'ccibp89_philosophy', public._ccibp89_philosophy(),
    'ccibp89_vision', public._ccibp89_vision(),
    'core_principle', 'Organizations own their knowledge. Organizations control participation.',
    'engagement_summary', v_engagement,
    'collective_summary', v_collective,
    'ccibp89_engagement_summary', public._ccibp89_engagement_summary(v_tenant_id),
    'inform_not_prescribe_note', 'Collective observations inform — they do not prescribe.',
    'shared_learning_not_surveillance_note', 'Shared learning, not surveillance.',
    'blueprint_note', 'Community & Collective Intelligence (ABOS Phase 24 + Phase 52 + Blueprint Phase 89) — governed, anonymized collective wisdom.',
    'clwbp_distinction_note', public._clwbp_distinction_note(),
    'ccibp89_distinction_note', public._ccibp89_distinction_note()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- Grants + knowledge category
-- ---------------------------------------------------------------------------

grant execute on function public._ccibp89_distinction_note() to authenticated;
grant execute on function public._ccibp89_mission() to authenticated;
grant execute on function public._ccibp89_philosophy() to authenticated;
grant execute on function public._ccibp89_abos_principle() to authenticated;
grant execute on function public._ccibp89_vision() to authenticated;
grant execute on function public._ccibp89_objectives() to authenticated;
grant execute on function public._ccibp89_collective_intelligence_sources() to authenticated;
grant execute on function public._ccibp89_community_observations() to authenticated;
grant execute on function public._ccibp89_idea_discovery() to authenticated;
grant execute on function public._ccibp89_companion_guidance() to authenticated;
grant execute on function public._ccibp89_community_recognition() to authenticated;
grant execute on function public._ccibp89_learning_organization_connection() to authenticated;
grant execute on function public._ccibp89_self_love_connection() to authenticated;
grant execute on function public._ccibp89_trust_connection() to authenticated;
grant execute on function public._ccibp89_privacy_principles() to authenticated;
grant execute on function public._ccibp89_dogfooding() to authenticated;
grant execute on function public._ccibp89_integration_links() to authenticated;
grant execute on function public._ccibp89_engagement_summary(uuid) to authenticated;
grant execute on function public._ccibp89_success_criteria(uuid) to authenticated;
grant execute on function public._ccibp89_community_collective_intelligence_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'community-collective-intelligence-blueprint-phase89', 'Community & Collective Intelligence Engine (ABOS Blueprint Phase 89)',
  'Community & Collective Intelligence Blueprint Phase 89 — collective experience insights, idea discovery, community recognition, and shared learning not surveillance via /app/community.',
  'authenticated', 122
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'community-collective-intelligence-blueprint-phase89' and tenant_id is null
);
