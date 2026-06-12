-- Implementation Blueprint Phase 52 — Collective Learning & Wisdom Engine
-- Extends Community & Collective Intelligence Phase 89 + Blueprint Phase 24 at /app/community.
-- No new tables — metadata helpers and dashboard/card RPC extensions only.

-- ---------------------------------------------------------------------------
-- Distinction & static blueprint helpers (_clwbp_*)
-- ---------------------------------------------------------------------------

create or replace function public._clwbp_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Global Learning Network Phase 72 /app/global-learning (platform evolution intelligence), Learning Engine Phase 23 /app/learning (tenant learning memory with approval), Wisdom Engine A.93 /app/wisdom-engine (companion wisdom interventions — cross-link only), and Organizational Memory A.34 / OME (tenant memory — not cross-ecosystem aggregates). Blueprint Phase 52 = anonymized collective wisdom compounding across the ecosystem via the Community & Collective Intelligence layer at /app/community — inform, not prescribe.';
$$;

create or replace function public._clwbp_blueprint_mission()
returns text language sql immutable as $$
  select 'Compound anonymized collective wisdom across the ecosystem — pattern recognition, best practice evolution, and responsible insights that inform without prescribing.';
$$;

create or replace function public._clwbp_blueprint_philosophy()
returns text language sql immutable as $$
  select 'Wisdom grows when experiences are shared responsibly. Collective observations inform teams — they never prescribe outcomes. Humans decide; Aipify surfaces patterns from governed, anonymized contributions.';
$$;

create or replace function public._clwbp_blueprint_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) strengthens when collective learning compounds safely — metadata patterns across the ecosystem, never confidential records or org identity.';
$$;

create or replace function public._clwbp_blueprint_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'pattern_recognition', 'label', 'Pattern recognition', 'description', 'Surface recurring themes from anonymized community contributions — metadata only'),
    jsonb_build_object('key', 'best_practices', 'label', 'Best practice evolution', 'description', 'Track how validated practices evolve across support, sales, implementation, operations, and training'),
    jsonb_build_object('key', 'ecosystem_observations', 'label', 'Ecosystem observations', 'description', 'Responsible industry and operational observations — never competitive intelligence or confidential content'),
    jsonb_build_object('key', 'knowledge_evolution', 'label', 'Knowledge evolution', 'description', 'How collective wisdom enriches Knowledge Center, training, and certification scaffolds'),
    jsonb_build_object('key', 'continuous_improvement', 'label', 'Continuous improvement', 'description', 'Community-validated improvements compound over time — voluntary, governed participation'),
    jsonb_build_object('key', 'responsible_insights', 'label', 'Responsible insights', 'description', 'Inform not prescribe — observations with explainability, optional adoption, and trust transparency')
  );
$$;

create or replace function public._clwbp_blueprint_collective_observations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collective observations inform — they do not prescribe. Humans decide what to adopt.',
    'tone', 'inform_not_prescribe',
    'examples', jsonb_build_array(
      jsonb_build_object(
        'emoji', '🦉',
        'key', 'pattern_worth_reviewing',
        'scenario', 'Pattern worth reviewing',
        'example', '🦉 A recurring onboarding pattern appears across the ecosystem — worth reviewing for your team without exposing who contributed.'
      ),
      jsonb_build_object(
        'emoji', '🌹',
        'key', 'shared_challenge',
        'scenario', 'Shared challenge — you are not alone',
        'example', '🌹 Similar implementation timing challenges appear in collective wisdom — you are not alone; optional insights may help your planning.'
      ),
      jsonb_build_object(
        'emoji', '🔔',
        'key', 'evolved_best_practice',
        'scenario', 'Evolved best practice signal',
        'example', '🔔 Support triage practices have evolved in the collective library — an observation worth exploring when your team is ready.'
      ),
      jsonb_build_object(
        'emoji', '🦉',
        'key', 'ecosystem_theme',
        'scenario', 'Ecosystem theme surfaced',
        'example', '🦉 An ecosystem theme around knowledge gap reviews emerged from anonymized contributions — informative, not mandatory.'
      )
    )
  );
$$;

create or replace function public._clwbp_blueprint_best_practice_evolution()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Best practices evolve through governed community contributions — scaffolds only, metadata summaries.',
    'domains', jsonb_build_array(
      jsonb_build_object('key', 'support', 'label', 'Support', 'signals', jsonb_build_array('Triage workflows', 'Escalation patterns', 'Template effectiveness trends')),
      jsonb_build_object('key', 'sales', 'label', 'Sales', 'signals', jsonb_build_array('Discovery approaches', 'Renewal conversation patterns', 'Ethical outreach rhythms')),
      jsonb_build_object('key', 'implementation', 'label', 'Implementation', 'signals', jsonb_build_array('Onboarding scope patterns', 'Install adoption accelerators', 'Handoff best practices')),
      jsonb_build_object('key', 'operational', 'label', 'Operational', 'signals', jsonb_build_array('Workflow optimization', 'Approval cadence', 'Automation success metadata')),
      jsonb_build_object('key', 'training', 'label', 'Training', 'signals', jsonb_build_array('Role-based learning paths', 'Certification readiness patterns', 'Academy resource effectiveness'))
    )
  );
$$;

create or replace function public._clwbp_blueprint_anonymization_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aggregates only — aligned with Impact Metrics privacy rules and lib/impact/privacy.ts forbidden-keys mindset.',
    'must', jsonb_build_array(
      'Store counts, categories, and outcome trends — never identities or confidential records',
      'No customer_name, email, chat_content, order_details, sales_figure, or payment_details in collective payloads',
      'No org identity disclosure in cross-ecosystem aggregates',
      'No competitive intelligence or confidential business records',
      'Explicit governance before any contribution enters collective wisdom'
    ),
    'must_not', jsonb_build_array(
      'Expose individual organization identity in collective insight payloads',
      'Include PII, raw communications, or sensitive business records',
      'Auto-adopt collective wisdom without human review',
      'Prescribe outcomes — observations inform only',
      'Bypass anonymization or governance checks'
    ),
    'impact_metrics_cross_link', '/platform/impact',
    'forbidden_keys_note', 'Aligns with FORBIDDEN_METRIC_FIELDS and FORBIDDEN_METRIC_CATEGORIES — metadata patterns only.'
  );
$$;

create or replace function public._clwbp_blueprint_knowledge_center_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collective wisdom enriches Knowledge Center scaffolds — FAQs, training, certification, industry guidance, and companion recommendations.',
    'surfaces', jsonb_build_array(
      jsonb_build_object('label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center', 'note', 'FAQs and playbooks informed by collective patterns — governed publication'),
      jsonb_build_object('label', 'Learning & Training (A.36)', 'route', '/app/academy', 'note', 'Training paths may reference collective best practices — tenant learning remains distinct'),
      jsonb_build_object('label', 'Certification (A.37)', 'route', '/app/partner-certification', 'note', 'Certification scaffolds cross-link collective operational wisdom'),
      jsonb_build_object('label', 'Industry guidance', 'route', '/app/industry-intelligence-foundation-engine', 'note', 'Industry context — cross-link only, no duplicate intelligence'),
      jsonb_build_object('label', 'Companion recommendations', 'route', '/app/wisdom-engine', 'note', 'Wisdom Engine A.93 may surface collective observations — inform not prescribe')
    )
  );
$$;

create or replace function public._clwbp_blueprint_sales_expert_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collective sales wisdom examples — ethical outreach, discovery, renewal patterns — metadata only, distinct from Sales Expert Community Phase 47 peer mentorship.',
    'examples', jsonb_build_array(
      jsonb_build_object('domain', 'discovery', 'signal', 'Discovery question patterns validated across multiple governed contributions'),
      jsonb_build_object('domain', 'renewals', 'signal', 'Relationship-focused renewal conversation themes — anonymized aggregates'),
      jsonb_build_object('domain', 'onboarding', 'signal', 'Customer onboarding handoff patterns from collective implementation wisdom'),
      jsonb_build_object('domain', 'outreach', 'signal', 'Sustainable outreach cadence observations — no customer PII')
    ),
    'sales_expert_route', '/app/sales-expert-engine',
    'phase47_note', 'Sales Expert Community Phase 47 is peer mentorship within Sales Expert OS — Phase 52 is ecosystem-wide anonymized collective wisdom via /app/community.'
  );
$$;

create or replace function public._clwbp_blueprint_executive_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive Insights receive ecosystem trends, themes, and positive signals — aggregates only, never individual org performance.',
    'signals', jsonb_build_array(
      'Emerging ecosystem themes from anonymized contribution categories',
      'Positive adoption and knowledge-sharing signals — counts and trends only',
      'Industry observation themes — no confidential market intelligence',
      'Community health and participation trend metadata for executive briefings'
    ),
    'executive_route', '/app/executive',
    'executive_insights_note', 'Executive Insights A.35 — cross-link collective wisdom themes into briefings; humans interpret.'
  );
$$;

create or replace function public._clwbp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Shared challenges normalize learning — collective wisdom reduces isolation without judgment or pressure.',
    'practices', jsonb_build_array(
      'Normalize shared challenges — ecosystem patterns show others face similar obstacles',
      'Encourage learning at your pace — collective insights are optional',
      'Reduce fear of imperfection — governed sharing celebrates progress, not perfection',
      'Celebrate collective progress — wisdom compounds when experiences are shared responsibly'
    ),
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love A.76 influences tone — encouragement only. Collective Learning stores anonymized metadata, not wellbeing content.'
  );
$$;

create or replace function public._clwbp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Privacy, optional insights, and explainability — trust is non-negotiable for collective wisdom.',
    'users_should_know', jsonb_build_array(
      'Collective wisdom is optional — teams choose what to explore and adopt',
      'Only anonymized, governed contributions enter ecosystem aggregates',
      'Observations inform — they do not prescribe actions or outcomes',
      'Participation is voluntary — opt in to contribute, opt out anytime',
      'No org identity or competitive intelligence in collective payloads'
    ),
    'operators_should_understand', jsonb_build_array(
      'Workflow: draft → review → governance → anonymization → publication',
      'Distinct from tenant Learning Engine /app/learning — approval-based tenant memory',
      'Distinct from Global Learning Network /app/global-learning — platform evolution intelligence',
      'Distinct from Organizational Memory A.34 — tenant-scoped memory, not cross-ecosystem aggregates',
      'Impact Metrics Phase 21 forbidden-keys mindset applies to all collective payloads'
    ),
    'audit_note', 'Community contributions, briefings, and audit logs — metadata only, no PII or confidential content.'
  );
$$;

create or replace function public._clwbp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates Collective Learning & Wisdom internally; Unonight is the first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — collective pattern recognition, best practice evolution, KC enrichment',
      'focus', jsonb_build_array('Support workflow pattern validation', 'Knowledge gap collective observations', 'Executive theme surfacing from anonymized aggregates', 'Companion observation calibration — inform not prescribe')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — collective wisdom from commerce and verification workflows',
      'focus', jsonb_build_array('Implementation onboarding patterns', 'Support triage collective signals', 'Voluntary contribution governance validation', 'Optional insight adoption workflows')
    )
  );
$$;

create or replace function public._clwbp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Global Learning Network (Phase 72)', 'route', '/app/global-learning', 'note', 'Platform evolution intelligence — distinct from tenant community collective wisdom'),
    jsonb_build_object('label', 'Learning Engine (Phase 23)', 'route', '/app/learning', 'note', 'Tenant learning memory with approval — not cross-ecosystem aggregates'),
    jsonb_build_object('label', 'Wisdom Engine (A.93)', 'route', '/app/wisdom-engine', 'note', 'Companion wisdom interventions — cross-link collective observations'),
    jsonb_build_object('label', 'Organizational Memory (A.34 / OME)', 'route', '/app/organizational-memory-engine', 'note', 'Tenant memory — not cross-ecosystem aggregates'),
    jsonb_build_object('label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center', 'note', 'FAQs, playbooks, industry guidance enriched by collective patterns'),
    jsonb_build_object('label', 'Learning & Training (A.36)', 'route', '/app/academy', 'note', 'Academy and training scaffolds — cross-link collective best practices'),
    jsonb_build_object('label', 'Certification (A.37)', 'route', '/app/partner-certification', 'note', 'Certification framework — collective operational wisdom'),
    jsonb_build_object('label', 'Sales Expert OS', 'route', '/app/sales-expert-engine', 'note', 'Collective sales wisdom examples — distinct from Phase 47 peer community'),
    jsonb_build_object('label', 'Executive Insights (A.35)', 'route', '/app/executive', 'note', 'Ecosystem trends, themes, positive signals — aggregates only'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Shared challenges normalization — principle only'),
    jsonb_build_object('label', 'Impact Metrics (Phase 21)', 'route', '/platform/impact', 'note', 'Platform Admin — anonymised proof, forbidden-keys privacy rules')
  );
$$;

create or replace function public._clwbp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Collective wisdom compounds when experiences are shared responsibly — "we would never have discovered this alone."',
    'Observations inform; humans decide — Aipify never prescribes outcomes from collective intelligence.',
    'Anonymized patterns accelerate learning without compromising confidentiality or competitive trust.',
    'Best practices evolve through governed community contributions — support, sales, implementation, operations, training.',
    'Trust is non-negotiable — aggregates only, explicit governance, voluntary participation.'
  );
$$;

-- ---------------------------------------------------------------------------
-- Live collective summary (empty-safe, metadata only)
-- organization_id = customers.id (tenant bridge)
-- ---------------------------------------------------------------------------

create or replace function public._clwbp_collective_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_contributions int := 0;
  v_tenant_published int := 0;
  v_tenant_pending int := 0;
  v_tenant_briefings int := 0;
  v_tenant_ratings int := 0;
  v_ecosystem_published int := 0;
  v_ecosystem_categories jsonb := '[]'::jsonb;
  v_ecosystem_types jsonb := '[]'::jsonb;
  v_avg_rating numeric := 0;
  v_recent_90d int := 0;
begin
  if p_organization_id is null then
    return jsonb_build_object(
      'has_data', false,
      'privacy_note', 'Aggregates only — no identities, confidential content, or competitive intelligence.'
    );
  end if;

  select count(*) into v_tenant_contributions
  from public.community_contributions where tenant_id = p_organization_id;

  select count(*) into v_tenant_published
  from public.community_contributions
  where tenant_id = p_organization_id and status = 'published' and anonymization_verified = true;

  select count(*) into v_tenant_pending
  from public.community_contributions
  where tenant_id = p_organization_id and status in ('review', 'governance_check', 'anonymization_check');

  select count(*) into v_tenant_briefings
  from public.community_briefings where tenant_id = p_organization_id;

  select count(*) into v_tenant_ratings
  from public.community_ratings where tenant_id = p_organization_id;

  select count(*) into v_ecosystem_published
  from public.community_contributions
  where status = 'published' and anonymization_verified = true;

  select coalesce(jsonb_agg(jsonb_build_object(
    'category', agg.category,
    'category_label', public._col_category_label(agg.category),
    'count', agg.cnt
  ) order by agg.cnt desc), '[]'::jsonb) into v_ecosystem_categories
  from (
    select category, count(*) as cnt
    from public.community_contributions
    where status = 'published' and anonymization_verified = true
    group by category
  ) agg;

  select coalesce(jsonb_agg(jsonb_build_object(
    'contribution_type', agg.contribution_type,
    'type_label', public._col_contribution_type_label(agg.contribution_type),
    'count', agg.cnt
  ) order by agg.cnt desc), '[]'::jsonb) into v_ecosystem_types
  from (
    select contribution_type, count(*) as cnt
    from public.community_contributions
    where status = 'published' and anonymization_verified = true
    group by contribution_type
    limit 8
  ) agg;

  select coalesce(avg(rating_avg), 0) into v_avg_rating
  from public.community_contributions
  where status = 'published' and anonymization_verified = true and rating_count > 0;

  select count(*) into v_recent_90d
  from public.community_contributions
  where status = 'published' and anonymization_verified = true
    and published_at > now() - interval '90 days';

  return jsonb_build_object(
    'has_data', v_tenant_contributions > 0 or v_ecosystem_published > 0,
    'tenant_contributions_total', v_tenant_contributions,
    'tenant_published', v_tenant_published,
    'tenant_pending_reviews', v_tenant_pending,
    'tenant_briefings', v_tenant_briefings,
    'tenant_ratings', v_tenant_ratings,
    'ecosystem_published_total', v_ecosystem_published,
    'ecosystem_categories', v_ecosystem_categories,
    'ecosystem_contribution_types', v_ecosystem_types,
    'ecosystem_avg_rating', round(v_avg_rating, 1),
    'ecosystem_recent_90d', v_recent_90d,
    'inform_not_prescribe', true,
    'privacy_note', 'Aggregates only — no identities, confidential content, or competitive intelligence.'
  );
end; $$;

create or replace function public._clwbp_blueprint_success_criteria(p_organization_id uuid)
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
      'key', 'collective_wisdom_available',
      'label', 'Collective wisdom available — ecosystem or tenant published contributions',
      'met', v_ecosystem_published > 0 or v_tenant_published > 0,
      'note', case when v_ecosystem_published = 0 and v_tenant_published = 0 then 'Publish governed contributions or explore ecosystem collective wisdom when available.' else null end
    ),
    jsonb_build_object(
      'key', 'anonymization_effective',
      'label', 'Anonymization effective — aggregates only, no identity exposure',
      'met', v_anonymization_required,
      'note', 'Aligned with Impact Metrics forbidden-keys privacy rules.'
    ),
    jsonb_build_object(
      'key', 'inform_not_prescribe',
      'label', 'Inform not prescribe — collective observations documented',
      'met', jsonb_array_length(public._clwbp_blueprint_collective_observations()->'examples') >= 4,
      'note', 'Humans decide what to adopt from collective wisdom.'
    ),
    jsonb_build_object(
      'key', 'best_practice_evolution',
      'label', 'Best practice evolution scaffolds — support, sales, implementation, operational, training',
      'met', jsonb_array_length(public._clwbp_blueprint_best_practice_evolution()->'domains') >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'knowledge_center_connection',
      'label', 'Knowledge Center connection — FAQs, training, certification cross-links',
      'met', jsonb_array_length(public._clwbp_blueprint_knowledge_center_connection()->'surfaces') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'executive_connection',
      'label', 'Executive connection — ecosystem trends and positive signals documented',
      'met', jsonb_array_length(public._clwbp_blueprint_executive_connection()->'signals') >= 3,
      'note', 'Aggregates only — never individual org performance.'
    ),
    jsonb_build_object(
      'key', 'voluntary_participation',
      'label', 'Voluntary participation — organizations control opt-in',
      'met', v_participation_enabled or v_tenant_published > 0,
      'note', case when not v_participation_enabled and v_tenant_published = 0 then 'Enable participation when ready to contribute to collective wisdom.' else null end
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — shared challenges normalize learning',
      'met', true,
      'note', 'Encouragement only — no pressure from collective observations.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Distinct from Global Learning, Learning Engine, Wisdom Engine, and OME',
      'met', jsonb_array_length(public._clwbp_blueprint_integration_links()) >= 10,
      'note', 'Cross-link related engines — do not duplicate tenant or platform intelligence.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- Dashboard — preserve ALL Phase 89 + Phase 24 fields; add Phase 52
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
    -- Phase 52 — Collective Learning & Wisdom Engine
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
    'inform_not_prescribe_note', 'Collective observations inform — they do not prescribe. Humans decide what to adopt.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- Card RPC — compact Phase 52 metadata
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
    'mission', 'Identify broader patterns and collective improvements — preserving privacy, security, and trust.',
    'clwbp_mission', public._clwbp_blueprint_mission(),
    'abos_principle', 'Wisdom grows when experiences are shared responsibly.',
    'clwbp_abos_principle', public._clwbp_blueprint_abos_principle(),
    'core_principle', 'Organizations own their knowledge. Organizations control participation.',
    'engagement_summary', v_engagement,
    'collective_summary', v_collective,
    'inform_not_prescribe_note', 'Collective observations inform — they do not prescribe.',
    'blueprint_note', 'Community & Collective Intelligence Engine (ABOS Phase 24 + Phase 52 Collective Learning & Wisdom) — governed, anonymized collective wisdom.',
    'clwbp_distinction_note', public._clwbp_distinction_note()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

grant execute on function public._clwbp_distinction_note() to authenticated;
grant execute on function public._clwbp_blueprint_mission() to authenticated;
grant execute on function public._clwbp_blueprint_philosophy() to authenticated;
grant execute on function public._clwbp_blueprint_abos_principle() to authenticated;
grant execute on function public._clwbp_blueprint_objectives() to authenticated;
grant execute on function public._clwbp_blueprint_collective_observations() to authenticated;
grant execute on function public._clwbp_blueprint_best_practice_evolution() to authenticated;
grant execute on function public._clwbp_blueprint_anonymization_principles() to authenticated;
grant execute on function public._clwbp_blueprint_knowledge_center_connection() to authenticated;
grant execute on function public._clwbp_blueprint_sales_expert_connection() to authenticated;
grant execute on function public._clwbp_blueprint_executive_connection() to authenticated;
grant execute on function public._clwbp_blueprint_self_love_connection() to authenticated;
grant execute on function public._clwbp_blueprint_trust_connection() to authenticated;
grant execute on function public._clwbp_blueprint_dogfooding() to authenticated;
grant execute on function public._clwbp_blueprint_integration_links() to authenticated;
grant execute on function public._clwbp_blueprint_vision_phrases() to authenticated;
grant execute on function public._clwbp_collective_summary(uuid) to authenticated;
grant execute on function public._clwbp_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'collective-learning-wisdom-blueprint', 'Collective Learning & Wisdom Engine (ABOS Phase 52)',
  'Collective Learning & Wisdom Engine — anonymized collective wisdom compounding across the ecosystem via Community & Collective Intelligence Phase 89.',
  'authenticated', 100
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'collective-learning-wisdom-blueprint' and tenant_id is null
);
