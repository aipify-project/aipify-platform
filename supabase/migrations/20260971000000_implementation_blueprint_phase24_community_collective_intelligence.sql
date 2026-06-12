-- Implementation Blueprint Phase 24 — Community & Collective Intelligence Engine
-- Spec alignment extending Community & Collective Intelligence (Phase 89). No new tables.

create or replace function public._ccibp_blueprint_community_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'best_practice_recommendations', 'label', 'Best practice recommendations', 'description', 'Surface validated practices from anonymized collective patterns — voluntary, governed participation'),
    jsonb_build_object('key', 'industry_trend_awareness', 'label', 'Industry trend awareness', 'description', 'Emerging themes and industry observations from metadata — never confidential business records'),
    jsonb_build_object('key', 'cross_org_learning', 'label', 'Cross-organizational learning', 'description', 'Shared lessons accelerate progress without compromising confidentiality or org identity'),
    jsonb_build_object('key', 'emerging_pattern_detection', 'label', 'Emerging pattern detection', 'description', 'Identify recurring opportunities, workflow improvements, and knowledge gaps across the ecosystem'),
    jsonb_build_object('key', 'community_driven_improvements', 'label', 'Community-driven improvements', 'description', 'Voluntary contributions — templates, knowledge packs, lessons learned — strengthen the broader ecosystem'),
    jsonb_build_object('key', 'benchmarking_opportunities', 'label', 'Benchmarking opportunities', 'description', 'Anonymized aggregation enables benchmarking without exposing individual organizations')
  );
$$;

create or replace function public._ccibp_blueprint_collective_insight_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Metadata-only collective insights — patterns and outcomes, never raw customer records, org identity, or confidential content.',
    'categories', jsonb_build_array(
      jsonb_build_object(
        'domain', 'support',
        'label', 'Support collective insights',
        'signals', jsonb_build_array(
          'Frequently resolved issues and effective resolution workflows',
          'Escalation improvements and false-positive reduction patterns',
          'Template effectiveness and draft acceptance trends',
          'Customer satisfaction and helpfulness metadata'
        )
      ),
      jsonb_build_object(
        'domain', 'knowledge',
        'label', 'Knowledge collective insights',
        'signals', jsonb_build_array(
          'Common knowledge gaps and frequently requested topics',
          'Documentation best practices and article usefulness patterns',
          'Search effectiveness and missing-topic detection',
          'Employee knowledge Q&A confidence trends'
        )
      ),
      jsonb_build_object(
        'domain', 'operational',
        'label', 'Operational collective insights',
        'signals', jsonb_build_array(
          'Workflow optimization and bottleneck reduction patterns',
          'Team coordination and productivity recommendations',
          'Automation success and notification engagement trends',
          'Task completion and approval workflow improvements'
        )
      ),
      jsonb_build_object(
        'domain', 'strategic',
        'label', 'Strategic collective insights',
        'signals', jsonb_build_array(
          'Emerging opportunities and market observations',
          'Growth considerations and expansion patterns',
          'Industry priorities and repeated strategic themes',
          'Community-validated adoption accelerators'
        )
      )
    )
  );
$$;

create or replace function public._ccibp_blueprint_privacy_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collective intelligence without compromising confidentiality — trust is non-negotiable.',
    'must', jsonb_build_array(
      'Anonymized aggregation only — no org identity disclosure',
      'No confidential exposure — metadata patterns, not operational records',
      'Explicit governance — voluntary participation with review workflow',
      'Organizations own their knowledge — organizations control participation',
      'Trust transparency — what contributes to insights is explainable'
    ),
    'must_not', jsonb_build_array(
      'Expose individual organization identity in collective insights',
      'Share confidential business records, emails, chats, or PII',
      'Auto-publish contributions without governance and anonymization review',
      'Force participation — community contributions are voluntary',
      'Bypass anonymization or governance checks'
    )
  );
$$;

create or replace function public._ccibp_blueprint_community_contributions()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Voluntary participation — organizations contribute best practices, templates, knowledge packs, lessons learned, and industry guidance.',
    'contribution_types', jsonb_build_array(
      jsonb_build_object('key', 'best_practices', 'label', 'Best practices', 'description', 'Validated operational and support practices — anonymized before publication'),
      jsonb_build_object('key', 'templates', 'label', 'Templates', 'description', 'Reusable templates and implementation guides — governed review required'),
      jsonb_build_object('key', 'knowledge_packs', 'label', 'Knowledge packs', 'description', 'Curated knowledge articles and playbooks — metadata only'),
      jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned', 'description', 'Operational lessons and adoption success stories — voluntary sharing'),
      jsonb_build_object('key', 'industry_guidance', 'label', 'Industry guidance', 'description', 'Industry observations and emerging trend notes — no confidential content')
    ),
    'participation_note', 'Contributions require internal review, governance validation, anonymization check, and publication approval.'
  );
$$;

create or replace function public._ccibp_blueprint_companion_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'others_approached_differently',
      'scenario', 'Others approached this challenge differently — thoughtful observation',
      'example', '🦉 Other organizations approached morning triage differently — Aipify found a pattern worth exploring for your team review, without exposing who shared it.'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'not_alone',
      'scenario', 'You are not alone — collective progress',
      'example', '🌹 You are not alone — similar knowledge gaps appear across the ecosystem. Community insights can accelerate your documentation improvements.'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'community_insight_worth_exploring',
      'scenario', 'Community insight worth exploring',
      'example', '🔔 A community insight on escalation workflows is worth exploring — validated by multiple organizations and available for voluntary review.'
    ),
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'emerging_trends',
      'scenario', 'Emerging trends in best practices',
      'example', '🦉 Emerging trends in support best practices suggest prioritizing knowledge gap reviews — collective intelligence surfaced this pattern responsibly.'
    )
  );
$$;

create or replace function public._ccibp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love normalizes challenges, encourages learning, reduces fear of imperfection, and celebrates collective progress.',
    'practices', jsonb_build_array(
      'Normalize challenges — shared patterns show others face similar obstacles',
      'Encourage learning — collective insights accelerate without judgment',
      'Reduce fear of imperfection — voluntary participation, governed and reversible',
      'Celebrate collective progress — ecosystem strengthens when experiences shared responsibly'
    ),
    'self_love_route', '/app/self-love-engine',
    'naming_doc', 'SELF_LOVE_NAMING_STANDARD.md',
    'boundary_note', 'Self Love is a principle — not a feature toggle. Community Intelligence stores anonymized metadata, not wellbeing content.'
  );
$$;

create or replace function public._ccibp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'What contributes to insights, anonymity protection, which recommendations come from community trends, and participation settings — trust is non-negotiable.',
    'users_should_know', jsonb_build_array(
      'Organizations own their knowledge — you control participation',
      'Only anonymized, governed contributions contribute to collective insights',
      'Community recommendations are guidance — humans decide what to adopt',
      'Participation is voluntary — opt in to contribute, opt out anytime',
      'No org identity disclosure — aggregation protects confidentiality'
    ),
    'operators_should_understand', jsonb_build_array(
      'Contribution workflow: draft → review → governance → anonymization → publication',
      'Community Health Score reflects governed participation quality — not competitive ranking',
      'Distinct from Cross-Tenant Intelligence A.71 — tenant-scoped community, not platform-wide browsing',
      'Distinct from Organizational Benchmarking A.58 — benchmarking via anonymized aggregates only',
      'Impact Metrics Phase 21 at /platform/impact — anonymised proof, aggregates only'
    ),
    'audit_note', 'Community contributions, ratings, briefings, and audit logs — metadata only, no PII or confidential content.'
  );
$$;

create or replace function public._ccibp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates Community & Collective Intelligence internally; Unonight is the first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — knowledge sharing, support improvements, workflow recommendations, companion experiences',
      'focus', jsonb_build_array('Internal best practice contributions', 'Support workflow pattern validation', 'Knowledge pack curation from platform ops', 'Companion community insight calibration')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — knowledge sharing, support improvements, workflow recommendations, companion experiences',
      'focus', jsonb_build_array('Commerce support pattern sharing', 'Verification workflow lessons learned', 'Knowledge gap collective insights', 'Voluntary contribution governance validation')
    )
  );
$$;

create or replace function public._ccibp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Cross-Tenant Intelligence Engine (A.71)', 'route', '/app/cross-tenant-intelligence-engine', 'note', 'Platform-wide pattern intelligence — distinct from tenant community hub'),
    jsonb_build_object('label', 'Organizational Benchmarking (A.58)', 'route', '/app/organizational-benchmarking-engine', 'note', 'Benchmarking via anonymized aggregates — cross-link, do not duplicate'),
    jsonb_build_object('label', 'Impact Metrics (Phase 21)', 'route', '/platform/impact', 'note', 'Platform Admin — anonymised proof, aggregates only'),
    jsonb_build_object('label', 'Learning & Adaptation (Phase 23)', 'route', '/app/learning', 'note', 'Tenant learning loops — distinct from collective community insights'),
    jsonb_build_object('label', 'Marketplace Ecosystem (Phase 19)', 'route', '/app/marketplace-partner-ecosystem-foundation-engine', 'note', 'Partner ecosystem foundation — community feedback and pack improvements'),
    jsonb_build_object('label', 'Industry Intelligence (A.44)', 'route', '/app/industry-intelligence-foundation-engine', 'note', 'Industry context and trend awareness — cross-link only'),
    jsonb_build_object('label', 'Continuous Improvement (A.49)', 'route', '/app/continuous-improvement-engine', 'note', 'Operational improvement cycles — distinct from community contributions')
  );
$$;

create or replace function public._ccibp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Benefit from broader ecosystem lessons — "we would never have discovered this on our own."',
    'Wisdom grows when experiences are shared responsibly — collective intelligence without compromising confidentiality.',
    'Organizations should not solve every problem alone — shared learning accelerates progress.',
    'Organizations own their knowledge. Organizations control participation.',
    'Trust is non-negotiable — anonymized aggregation, explicit governance, voluntary participation.'
  );
$$;

create or replace function public._ccibp_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_contributions int := 0;
  v_published int := 0;
  v_pending int := 0;
  v_drafts int := 0;
  v_briefings int := 0;
  v_briefings_30d int := 0;
  v_ratings int := 0;
  v_avg_health numeric := 0;
  v_avg_intelligence numeric := 0;
  v_participation_enabled boolean := false;
  v_allow_contributions boolean := false;
  v_categories_used int := 0;
begin
  select count(*) into v_contributions
  from public.community_contributions where tenant_id = p_tenant_id;

  select count(*) into v_published
  from public.community_contributions
  where tenant_id = p_tenant_id and status = 'published';

  select count(*) into v_pending
  from public.community_contributions
  where tenant_id = p_tenant_id and status in ('review', 'governance_check', 'anonymization_check');

  select count(*) into v_drafts
  from public.community_contributions
  where tenant_id = p_tenant_id and status = 'draft';

  select count(*) into v_briefings
  from public.community_briefings where tenant_id = p_tenant_id;

  select count(*) into v_briefings_30d
  from public.community_briefings
  where tenant_id = p_tenant_id and created_at >= now() - interval '30 days';

  select count(*) into v_ratings
  from public.community_ratings where tenant_id = p_tenant_id;

  select coalesce(avg(health_score), 0), coalesce(avg(contribution_score), 0)
  into v_avg_health, v_avg_intelligence
  from public.community_scores where tenant_id = p_tenant_id;

  select coalesce(participation_enabled, false), coalesce(allow_contributions, false)
  into v_participation_enabled, v_allow_contributions
  from public.community_settings where tenant_id = p_tenant_id;

  select count(distinct category) into v_categories_used
  from public.community_contributions
  where tenant_id = p_tenant_id and status != 'archived';

  return jsonb_build_object(
    'contributions_total', v_contributions,
    'published_contributions', v_published,
    'pending_reviews', v_pending,
    'draft_contributions', v_drafts,
    'briefings_total', v_briefings,
    'briefings_last_30d', v_briefings_30d,
    'ratings_total', v_ratings,
    'avg_health_score', round(v_avg_health, 1),
    'avg_intelligence_score', round(v_avg_intelligence, 1),
    'categories_used', v_categories_used,
    'participation_enabled', v_participation_enabled,
    'allow_contributions', v_allow_contributions,
    'privacy_note', 'Counts only — no contribution content, org identity, or PII.'
  );
end; $$;

create or replace function public._ccibp_blueprint_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_published int := 0;
  v_briefings int := 0;
  v_ratings int := 0;
  v_participation_enabled boolean := false;
  v_anonymization_required boolean := true;
  v_avg_health numeric := 0;
begin
  v_engagement := public._ccibp_engagement_summary(p_tenant_id);
  v_published := coalesce((v_engagement->>'published_contributions')::int, 0);
  v_briefings := coalesce((v_engagement->>'briefings_total')::int, 0);
  v_ratings := coalesce((v_engagement->>'ratings_total')::int, 0);
  v_participation_enabled := coalesce((v_engagement->>'participation_enabled')::boolean, false);
  v_avg_health := coalesce((v_engagement->>'avg_health_score')::numeric, 0);

  select coalesce(anonymization_required, true) into v_anonymization_required
  from public.community_settings where tenant_id = p_tenant_id;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'collective_learning_benefit',
      'label', 'Benefit from collective learning — published insights or briefings available',
      'met', v_published > 0 or v_briefings > 0,
      'note', case when v_published = 0 and v_briefings = 0 then 'Generate a briefing or publish governed contributions to begin collective learning.' else null end
    ),
    jsonb_build_object(
      'key', 'privacy_effective',
      'label', 'Privacy effective — anonymization required and governance intact',
      'met', v_anonymization_required,
      'note', 'Anonymization and governance review protect confidentiality.'
    ),
    jsonb_build_object(
      'key', 'community_recs_improve',
      'label', 'Community recommendations improve outcomes — ratings and validated practices tracked',
      'met', v_ratings > 0 or v_published > 0,
      'note', case when v_ratings = 0 and v_published = 0 then 'Published contributions and usefulness ratings build collective value over time.' else null end
    ),
    jsonb_build_object(
      'key', 'transparent_voluntary_participation',
      'label', 'Transparent voluntary participation — organizations control opt-in',
      'met', v_participation_enabled,
      'note', case when not v_participation_enabled then 'Enable participation in community settings when ready to contribute.' else null end
    ),
    jsonb_build_object(
      'key', 'ecosystem_strengthens',
      'label', 'Ecosystem strengthens organizations — health score and contributions tracked',
      'met', v_avg_health > 0 or v_published > 0,
      'note', 'Community Health Score reflects governed participation quality.'
    ),
    jsonb_build_object(
      'key', 'community_objectives',
      'label', 'Community objectives documented — best practices, trends, cross-org learning, patterns, improvements, benchmarking',
      'met', jsonb_array_length(public._ccibp_blueprint_community_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'collective_insight_examples',
      'label', 'Collective insight examples documented — support, knowledge, operational, strategic',
      'met', jsonb_array_length(public._ccibp_blueprint_collective_insight_examples()->'categories') >= 4,
      'note', 'Metadata signals only — no confidential exposure.'
    ),
    jsonb_build_object(
      'key', 'privacy_principles',
      'label', 'Privacy principles — anonymized aggregation, no org identity, explicit governance',
      'met', jsonb_array_length(public._ccibp_blueprint_privacy_principles()->'must') >= 5,
      'note', 'Trust is non-negotiable.'
    ),
    jsonb_build_object(
      'key', 'companion_examples',
      'label', 'Companion examples documented (🦉🌹🔔) — different approaches, not alone, insights, trends',
      'met', jsonb_array_length(public._ccibp_blueprint_companion_examples()) >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — normalize challenges, encourage learning, celebrate collective progress',
      'met', true,
      'note', 'Self Love is a principle — reduce fear of imperfection through voluntary, governed sharing.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from Cross-Tenant Intelligence, Benchmarking, Learning, and Marketplace',
      'met', jsonb_array_length(public._ccibp_blueprint_integration_links()) >= 7,
      'note', 'Extend related engines — do not duplicate platform-wide intelligence or tenant learning loops.'
    )
  );
end; $$;

create or replace function public._ccibp_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Cross-Tenant Intelligence Engine A.71 /app/cross-tenant-intelligence-engine (platform-wide patterns), Organizational Benchmarking A.58 /app/organizational-benchmarking-engine (benchmark aggregates), Learning & Adaptation Blueprint Phase 23 /app/learning (tenant learning loops), Marketplace Ecosystem Phase 19 /app/marketplace-partner-ecosystem-foundation-engine (partner ecosystem), Industry Intelligence A.44 /app/industry-intelligence-foundation-engine (industry context), and Continuous Improvement A.49 /app/continuous-improvement-engine (operational cycles). Phase 89 community hub extends with governed, anonymized collective intelligence.';
$$;

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
    )
  );
end; $$;

create or replace function public.get_community_intelligence_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_health numeric;
  v_intelligence numeric;
  v_pending int;
  v_engagement jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select health_score, contribution_score into v_health, v_intelligence
  from public.community_scores where tenant_id = v_tenant_id order by calculated_at desc limit 1;

  select count(*) into v_pending from public.community_contributions
  where tenant_id = v_tenant_id and status in ('review', 'governance_check', 'anonymization_check');

  v_engagement := public._ccibp_engagement_summary(v_tenant_id);

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
    'mission', 'Identify broader patterns and collective improvements — preserving privacy, security, and trust.',
    'abos_principle', 'Wisdom grows when experiences are shared responsibly.',
    'core_principle', 'Organizations own their knowledge. Organizations control participation.',
    'engagement_summary', v_engagement,
    'blueprint_note', 'Community & Collective Intelligence Engine (ABOS Phase 24) — extends Phase 89 with blueprint metadata, collective insight examples, privacy principles, and live success criteria.'
  );
end; $$;

grant execute on function public._ccibp_blueprint_community_objectives() to authenticated;
grant execute on function public._ccibp_blueprint_collective_insight_examples() to authenticated;
grant execute on function public._ccibp_blueprint_privacy_principles() to authenticated;
grant execute on function public._ccibp_blueprint_community_contributions() to authenticated;
grant execute on function public._ccibp_blueprint_companion_examples() to authenticated;
grant execute on function public._ccibp_blueprint_self_love_connection() to authenticated;
grant execute on function public._ccibp_blueprint_trust_connection() to authenticated;
grant execute on function public._ccibp_blueprint_dogfooding() to authenticated;
grant execute on function public._ccibp_blueprint_integration_links() to authenticated;
grant execute on function public._ccibp_blueprint_vision_phrases() to authenticated;
grant execute on function public._ccibp_engagement_summary(uuid) to authenticated;
grant execute on function public._ccibp_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'community-collective-intelligence-blueprint', 'Community & Collective Intelligence Engine (ABOS Phase 24)',
  'Community & Collective Intelligence Engine — extends Phase 89 with community objectives, collective insight examples, privacy principles, companion examples, and live engagement summary.',
  'authenticated', 99
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'community-collective-intelligence-blueprint' and tenant_id is null
);
