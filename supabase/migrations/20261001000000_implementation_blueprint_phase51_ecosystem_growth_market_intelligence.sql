-- Implementation Blueprint Phase 51 — Ecosystem Growth & Market Intelligence Engine
-- Extends Marketplace & Partner Ecosystem Foundation Engine (Phase A.45 + Phase 19 + Phase 33). No new tables.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._egmibp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 51 — Ecosystem Growth & Market Intelligence at /app/marketplace-partner-ecosystem-foundation-engine. Distinct from Platform Admin /platform/metrics (platform KPIs), Strategic Intelligence A.31, Industry Intelligence A.44 / Blueprint 32, Global Expansion Phase 35, Cross-Tenant Intelligence A.71 (platform only), Growth & Evolution A.81, Partner Success A.73, and Sales Expert OS A.95 field feedback (cross-linked, not duplicated). Phase 51 is tenant-scoped ecosystem and market observation metadata — observations inform, never dictate. All Phase 19 and Phase 33 dashboard fields preserved.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._egmibp_blueprint_mission()
returns text language sql immutable as $$
  select 'Help organizations understand their ecosystem context — market awareness, partner visibility, regional patterns, and field intelligence — so leaders can plan thoughtfully without cross-tenant noise or pressure.';
$$;

create or replace function public._egmibp_blueprint_philosophy()
returns text language sql immutable as $$
  select 'Market and ecosystem observations inform strategy — they never dictate decisions. Sustainable expansion beats urgency; metadata and aggregates protect privacy.';
$$;

create or replace function public._egmibp_blueprint_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) grows through a healthy partner ecosystem and honest market awareness — Aipify surfaces patterns; humans choose direction.';
$$;

create or replace function public._egmibp_blueprint_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'market_awareness', 'label', 'Market awareness', 'description', 'Illustrative sector and capability patterns — tenant-scoped, never cross-tenant benchmarks'),
    jsonb_build_object('key', 'ecosystem_insights', 'label', 'Ecosystem insights', 'description', 'Partner growth, offerings, certification, and activation counts from marketplace tables'),
    jsonb_build_object('key', 'industry_opportunities', 'label', 'Industry opportunities', 'description', 'Emerging needs, requested capabilities, frustrations, and outcome patterns — metadata scaffold'),
    jsonb_build_object('key', 'regional_observations', 'label', 'Regional observations', 'description', 'Nordic trends, partner activity indicators, and localization opportunities'),
    jsonb_build_object('key', 'strategic_planning', 'label', 'Strategic planning support', 'description', 'Executive summaries and strategic observations — inform planning, not replace judgment'),
    jsonb_build_object('key', 'partner_visibility', 'label', 'Partner visibility', 'description', 'Official tier distribution, community engagement, and regional support indicators')
  );
$$;

create or replace function public._egmibp_blueprint_market_observations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Market observations inform — they never dictate. Companion tone is calm, professional, and optional.',
    'companion_examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'ecosystem_review', 'example', 'Partner certification activity increased this quarter — here is what Aipify noticed from ecosystem metadata.'),
      jsonb_build_object('emoji', '🌹', 'key', 'positive_trend', 'example', 'Published offerings from Certified Partners grew — a healthy signal for organizations exploring extensions.'),
      jsonb_build_object('emoji', '🔔', 'key', 'gentle_alert', 'example', 'A few partner applications await human review — quality governance keeps the directory trustworthy.')
    ),
    'tone', 'Inform not dictate — no urgency, guilt, or pressure language.',
    'boundary', 'Illustrative patterns and aggregate counts only — no cross-tenant customer PII.'
  );
$$;

create or replace function public._egmibp_blueprint_industry_intelligence()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Industry intelligence summarizes emerging needs and outcome patterns — cross-link Industry Intelligence A.44; tenant-scoped metadata only.',
    'signal_categories', jsonb_build_array(
      jsonb_build_object('key', 'emerging_needs', 'label', 'Emerging needs', 'description', 'Capabilities organizations request during onboarding and partner engagements'),
      jsonb_build_object('key', 'requested_capabilities', 'label', 'Requested capabilities', 'description', 'Connectors, packs, and workflow patterns referenced in ecosystem metadata'),
      jsonb_build_object('key', 'common_frustrations', 'label', 'Common frustrations', 'description', 'Integration complexity, scattered knowledge, and adoption pacing — illustrative, not diagnostic'),
      jsonb_build_object('key', 'outcome_patterns', 'label', 'Outcome patterns', 'description', 'Metadata trends from activations, certifications, and published offerings')
    ),
    'industries', jsonb_build_array(
      jsonb_build_object('key', 'commerce', 'label', 'Commerce', 'emerging_needs', jsonb_build_array('Install-first support in existing admin', 'Multi-channel operational visibility')),
      jsonb_build_object('key', 'professional_services', 'label', 'Professional services', 'emerging_needs', jsonb_build_array('Knowledge Center consolidation', 'Client onboarding consistency')),
      jsonb_build_object('key', 'nordic_retail', 'label', 'Nordic retail', 'emerging_needs', jsonb_build_array('Localization-ready packs', 'Regional partner support'))
    ),
    'industry_intelligence_route', '/app/industry-intelligence-foundation-engine',
    'industry_solutions_phase', 32
  );
$$;

create or replace function public._egmibp_blueprint_regional_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Regional insights highlight localization and partner activity — especially Nordic markets where Aipify Group operates — metadata indicators only.',
    'regions', jsonb_build_array(
      jsonb_build_object(
        'key', 'nordic',
        'label', 'Nordic region',
        'trends', jsonb_build_array('Growing interest in install-first operational AI', 'Partner certification pathways in Danish, Norwegian, and Swedish locales', 'Commerce and support pack adoption'),
        'partner_activity', 'Approved partners with Nordic naming or regional metadata contribute offerings and training content',
        'localization_opportunities', jsonb_build_array('Knowledge Center articles in no/sv/da', 'Regional business packs', 'Localized partner directory visibility')
      ),
      jsonb_build_object(
        'key', 'global',
        'label', 'Global expansion',
        'trends', jsonb_build_array('Expert network discovery across industries', 'Remote implementation and training delivery'),
        'localization_opportunities', jsonb_build_array('Global Expansion Phase 35 locale packs', 'Partner-led regional onboarding')
      )
    ),
    'global_expansion_route', '/app/global-expansion-localization-engine',
    'global_expansion_phase', 35
  );
$$;

create or replace function public._egmibp_blueprint_sales_expert_feedback()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Sales Expert OS field feedback loops supply market intelligence — metadata signal counts only, no raw customer content.',
    'feedback_loops', jsonb_build_array(
      jsonb_build_object('key', 'customer_observations', 'label', 'Customer observations', 'description', 'Aggregate customer and opportunity counts from Sales Expert OS — relationship metadata only'),
      jsonb_build_object('key', 'industry_feedback', 'label', 'Industry feedback', 'description', 'Sector patterns surfaced in Sales Expert Intelligence tab (Phase 49) — cross-linked'),
      jsonb_build_object('key', 'competitive_insights', 'label', 'Competitive insights', 'description', 'Illustrative objection and positioning patterns — never store competitor PII or confidential briefs'),
      jsonb_build_object('key', 'faq_patterns', 'label', 'FAQ patterns', 'description', 'Knowledge Center and Sales Expert FAQ categories — which topics partners ask about most')
    ),
    'sales_expert_route', '/app/sales-expert-engine',
    'sales_expert_phase', 'A.95',
    'intelligence_tab_phase', 49,
    'boundary', 'Counts and category metadata only — Sales Expert OS stores operational partner data; Phase 51 aggregates for ecosystem visibility.'
  );
$$;

create or replace function public._egmibp_blueprint_partner_ecosystem_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Partner ecosystem insights combine marketplace governance with expert network engagement — growth, certification, community, and regional support.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'growth', 'label', 'Ecosystem growth', 'description', 'Approved partners, pending reviews, and published offerings over time — aggregate counts'),
      jsonb_build_object('key', 'certification', 'label', 'Certification activity', 'description', 'Official tier distribution and recertification workflow indicators'),
      jsonb_build_object('key', 'community_engagement', 'label', 'Community engagement', 'description', 'Partner forums, advisory councils, beta programs, and innovation workshops — metadata scaffold'),
      jsonb_build_object('key', 'regional_support', 'label', 'Regional support', 'description', 'Partners offering implementation, training, and Nordic-market expertise')
    ),
    'partner_success_route', '/app/partner-success-engine',
    'partner_success_phase', 'A.73',
    'partner_network_phase', 33
  );
$$;

create or replace function public._egmibp_blueprint_executive_support()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive support surfaces ecosystem summaries, strategic observations, gentle alerts, and positive trends — leadership decides every action.',
    'support_types', jsonb_build_array(
      jsonb_build_object('emoji', '📈', 'key', 'positive_trends', 'label', 'Positive trends', 'description', 'Growing offerings, tier progression, and activation wins — celebrate without comparison pressure'),
      jsonb_build_object('emoji', '🦉', 'key', 'strategic_observations', 'label', 'Strategic observations', 'description', 'Patterns worth reviewing in quarterly planning — metadata only'),
      jsonb_build_object('emoji', '🔔', 'key', 'gentle_alerts', 'label', 'Gentle alerts', 'description', 'Pending partner reviews or governance items needing human attention — never alarmist'),
      jsonb_build_object('emoji', '🌹', 'key', 'ecosystem_highlights', 'label', 'Ecosystem highlights', 'description', 'Certification milestones and community contributions — recognition without hustle language')
    ),
    'executive_route', '/app/executive-insights-engine',
    'strategic_intelligence_route', '/app/strategic-intelligence-foundation-engine',
    'boundary', 'Summaries and counts only — not a replacement for Executive Dashboard operational KPIs.'
  );
$$;

create or replace function public._egmibp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Sustainable expansion — celebrate ecosystem wins without urgency; market intelligence never implies inadequacy for unfollowed observations.',
    'practices', jsonb_build_array(
      'Growth at a pace the organization can sustain — one pack, connector, or partner engagement at a time',
      'Positive trends are invitations to explore — not mandates to activate everything',
      'Self Love supports leaders and partners — never comparison guilt or hustle framing'
    ),
    'route', '/app/self-love-engine',
    'phase', 'A.76'
  );
$$;

create or replace function public._egmibp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizations should understand data sources, assumptions, and uncertainty in market intelligence — transparency builds trust.',
    'organizations_should_understand', jsonb_build_array(
      'Which counts come from marketplace tables vs Sales Expert signal aggregates',
      'Assumptions in regional and industry scaffolds — illustrative until validated by humans',
      'Uncertainty is stated honestly — low-confidence patterns escalate to human review',
      'No cross-tenant customer PII in tenant ecosystem dashboards'
    ),
    'security_route', '/app/security-trust-engine',
    'trust_route', '/app/trust-reputation-engine'
  );
$$;

create or replace function public._egmibp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates ecosystem growth intelligence internally; Unonight pilots Nordic commerce ecosystem observations.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal validation',
      'focus', jsonb_build_array('Ecosystem summary aggregation', 'Sales Expert feedback loop counts', 'Regional insight scaffolds'),
      'note', 'Validate metadata-only aggregation and distinction from platform metrics before broad release'
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot',
      'focus', jsonb_build_array('Commerce ecosystem activation trends', 'Nordic partner discovery', 'Field feedback from Sales Expert OS'),
      'note', 'First external organization to review tenant-scoped ecosystem growth summary alongside partner directory'
    )
  );
$$;

create or replace function public._egmibp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'strategic_intelligence', 'label', 'Strategic Intelligence (A.31)', 'route', '/app/strategic-intelligence-foundation-engine', 'note', 'Org strategic context — distinct from Phase 51 ecosystem layer'),
    jsonb_build_object('key', 'industry_intelligence', 'label', 'Industry Intelligence (A.44 / Phase 32)', 'route', '/app/industry-intelligence-foundation-engine', 'note', 'Industry patterns and terminology — Phase 51 cross-links, does not duplicate'),
    jsonb_build_object('key', 'global_expansion', 'label', 'Global Expansion (Phase 35)', 'route', '/app/global-expansion-localization-engine', 'note', 'Localization and regional rollout'),
    jsonb_build_object('key', 'growth_evolution', 'label', 'Growth & Evolution (A.81)', 'route', '/app/growth-evolution-engine', 'note', 'Long-term evolution governance — complementary to market observations'),
    jsonb_build_object('key', 'sales_expert_os', 'label', 'Sales Expert OS (A.95 / Phase 49)', 'route', '/app/sales-expert-engine', 'note', 'Field feedback loops — Intelligence tab metadata'),
    jsonb_build_object('key', 'partner_success', 'label', 'Partner Success (A.73)', 'route', '/app/partner-success-engine', 'note', 'Partner program health — distinct from marketplace catalog'),
    jsonb_build_object('key', 'partner_network', 'label', 'Partner Expert Network (Phase 33)', 'route', '/app/marketplace-partner-ecosystem-foundation-engine', 'note', 'Official tiers and expert directory — this engine'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Sustainable expansion tone')
  );
$$;

create or replace function public._egmibp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Ecosystem growth should feel sustainable — not like a race.',
    'Market observations inform leaders — they never dictate strategy.',
    'Partner visibility builds trust — verified tiers over anonymous marketplaces.',
    'Regional insights respect localization — Nordic roots, global ambition.',
    'Field feedback from Sales Experts strengthens the whole ABOS ecosystem.',
    'Metadata and aggregates protect privacy — the customer owns operational data.',
    'Humans decide — Aipify observes, prepares, and explains ecosystem context.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Live ecosystem summary (empty-safe)
-- ---------------------------------------------------------------------------
create or replace function public._egmibp_ecosystem_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb := '{}'::jsonb;
  v_activation jsonb := '{}'::jsonb;
  v_open_opportunities int := 0;
  v_active_customers int := 0;
  v_follow_ups int := 0;
  v_sales_signals int := 0;
  v_nordic_indicators int := 0;
  v_approved int := 0;
  v_offerings int := 0;
  v_pending int := 0;
begin
  if to_regprocedure('public._penbp_engagement_summary(uuid)') is not null then
    v_engagement := public._penbp_engagement_summary(p_organization_id);
  end if;

  if to_regprocedure('public._mpfe_ecosystem_activation_summary(uuid)') is not null then
    v_activation := public._mpfe_ecosystem_activation_summary(p_organization_id);
  end if;

  v_approved := coalesce((v_engagement->>'approved_partners_total')::int, 0);
  v_offerings := coalesce((v_engagement->>'published_offerings')::int, 0);
  v_pending := coalesce((v_engagement->>'pending_reviews')::int, 0);

  if to_regclass('public.organization_sales_expert_opportunities') is not null then
    select count(*) into v_open_opportunities
    from public.organization_sales_expert_opportunities
    where organization_id = p_organization_id and status = 'open';
  end if;

  if to_regclass('public.organization_sales_expert_customers') is not null then
    select count(*) into v_active_customers
    from public.organization_sales_expert_customers
    where organization_id = p_organization_id and status = 'active';
  end if;

  if to_regclass('public.organization_sales_expert_follow_ups') is not null then
    select count(*) into v_follow_ups
    from public.organization_sales_expert_follow_ups f
    where f.organization_id = p_organization_id and f.status in ('scheduled', 'pending');
  end if;

  v_sales_signals := v_open_opportunities + v_active_customers + v_follow_ups;

  if to_regclass('public.partners') is not null then
    select count(*) into v_nordic_indicators
    from public.partners p
    where p.status = 'approved'
      and (
        coalesce(p.metadata->>'region', '') ilike '%nordic%'
        or p.partner_name ilike '%nordic%'
        or p.partner_name ilike '% AS'
        or p.partner_name ilike '% AB'
      );
  end if;

  return jsonb_build_object(
    'partner_engagement', v_engagement,
    'activation', v_activation,
    'sales_expert_signal_counts', jsonb_build_object(
      'open_opportunities', v_open_opportunities,
      'active_customers', v_active_customers,
      'scheduled_follow_ups', v_follow_ups,
      'total_signals', v_sales_signals
    ),
    'nordic_partner_indicators', v_nordic_indicators,
    'ecosystem_summary', format(
      '%s approved partners, %s published offerings, %s pending reviews, %s Sales Expert field signals, %s Nordic partner indicators.',
      v_approved, v_offerings, v_pending, v_sales_signals, v_nordic_indicators
    ),
    'privacy_note', 'Metadata and aggregate counts only — no cross-tenant customer PII or raw field content.'
  );
end; $$;

create or replace function public._egmibp_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_summary jsonb;
  v_approved int := 0;
  v_signals int := 0;
begin
  v_summary := public._egmibp_ecosystem_summary(p_organization_id);
  v_approved := coalesce((v_summary->'partner_engagement'->>'approved_partners_total')::int, 0);
  v_signals := coalesce((v_summary->'sales_expert_signal_counts'->>'total_signals')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'objectives_documented',
      'label', 'Six ecosystem growth objectives documented — market awareness through partner visibility',
      'met', jsonb_array_length(public._egmibp_blueprint_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'market_observations_inform',
      'label', 'Market observations use inform-not-dictate companion examples',
      'met', jsonb_array_length(public._egmibp_blueprint_market_observations()->'companion_examples') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'ecosystem_summary_live',
      'label', 'Live ecosystem summary aggregates marketplace and optional Sales Expert signals',
      'met', v_summary ? 'ecosystem_summary',
      'note', case when v_approved = 0 then 'Approved partners populate after human review.' else null end
    ),
    jsonb_build_object(
      'key', 'industry_intelligence_scaffold',
      'label', 'Industry intelligence categories documented — emerging needs through outcome patterns',
      'met', jsonb_array_length(public._egmibp_blueprint_industry_intelligence()->'signal_categories') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'regional_insights',
      'label', 'Regional insights include Nordic trends and localization opportunities',
      'met', jsonb_array_length(public._egmibp_blueprint_regional_insights()->'regions') >= 2,
      'note', null
    ),
    jsonb_build_object(
      'key', 'sales_expert_feedback_link',
      'label', 'Sales Expert feedback loops cross-linked — metadata scaffold',
      'met', (public._egmibp_blueprint_sales_expert_feedback()->>'sales_expert_route') is not null,
      'note', case when v_signals = 0 then 'Sales Expert signals appear when partner portal data exists for this organization.' else null end
    ),
    jsonb_build_object(
      'key', 'executive_support',
      'label', 'Executive support types documented — trends, observations, alerts, highlights',
      'met', jsonb_array_length(public._egmibp_blueprint_executive_support()->'support_types') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'no_cross_tenant_pii',
      'label', 'Tenant-scoped metadata only — no cross-tenant customer PII',
      'met', true,
      'note', 'Distinct from Platform Admin /platform/metrics and Cross-Tenant A.71.'
    ),
    jsonb_build_object(
      'key', 'self_love_sustainable',
      'label', 'Self Love connection — sustainable expansion principle',
      'met', true,
      'note', 'Growth at a sustainable pace — never urgency or guilt.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links to Strategic Intelligence, Industry Intelligence, Global Expansion, Sales Expert OS, Partner Success',
      'met', jsonb_array_length(public._egmibp_blueprint_integration_links()) >= 7,
      'note', null
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve Phase 19 + Phase 33; append Phase 51
-- ---------------------------------------------------------------------------
create or replace function public.get_marketplace_partner_ecosystem_foundation_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._mpfe_seed_partners();

  return jsonb_build_object(
    'has_organization', true,
    'approved_partners', coalesce((select count(*) from public.partners where status = 'approved'), 0),
    'published_offerings', coalesce((select count(*) from public.marketplace_offerings where status = 'published'), 0),
    'pending_reviews', coalesce((select count(*) from public.partners where status = 'pending'), 0),
    'philosophy', 'Certified partner ecosystem with governed offerings.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 19,
      'title', 'Marketplace & Ecosystem Engine',
      'engine_phase', 'A.45',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE19_MARKETPLACE_ECOSYSTEM.md'
    ),
    'mission', 'Discover, activate, and benefit from ecosystem extensions — Business Packs, Industry Packs, Connectors, Knowledge Packs, and Companion Skills.',
    'abos_principle', 'No single platform solves everything — empower contributors and grow the ecosystem openly.',
    'ecosystem_activation_summary', public._mpfe_ecosystem_activation_summary(v_org_id),
    'partner_mission', public._penbp_blueprint_mission(),
    'partner_philosophy', public._penbp_blueprint_philosophy(),
    'partner_abos_principle', 'Verified expertise earns trust — official partner tiers must be credible and outcomes-driven.',
    'implementation_blueprint_phase33', jsonb_build_object(
      'phase', 33,
      'title', 'Partner & Aipify Expert Network Engine',
      'engine_phase', 'A.45',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE33_PARTNER_EXPERT_NETWORK.md'
    ),
    'partner_engagement_summary', public._penbp_engagement_summary(v_org_id),
    'market_intelligence_mission', public._egmibp_blueprint_mission(),
    'market_intelligence_philosophy', public._egmibp_blueprint_philosophy(),
    'implementation_blueprint_phase51', jsonb_build_object(
      'phase', 51,
      'title', 'Ecosystem Growth & Market Intelligence Engine',
      'engine_phase', 'A.45',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE51_ECOSYSTEM_GROWTH_MARKET_INTELLIGENCE.md'
    ),
    'ecosystem_growth_summary', public._egmibp_ecosystem_summary(v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Dashboard RPC — preserve ALL Phase 19 + Phase 33; append Phase 51
-- ---------------------------------------------------------------------------
create or replace function public.get_marketplace_partner_ecosystem_foundation_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('ecosystem.view');
  v_org_id := public._mta_require_organization();
  perform public._mpfe_seed_partners();

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Curated partner ecosystem — approved partners, offerings, and certification with human governance. Extends Module Marketplace (A.23), Business Packs (A.43), and API Platform (A.21).',
    'principles', jsonb_build_array(
      'Approved partners only in production views',
      'Official partner tiers with re-certification workflow',
      'Offering quality indicators — transparent, not hidden',
      'Full audit for approvals, suspensions, and publications',
      'Metadata only — no partner PII in dashboard'
    ),
    'summary', jsonb_build_object(
      'approved_partners', coalesce((select count(*) from public.partners where status = 'approved'), 0),
      'pending_partners', coalesce((select count(*) from public.partners where status = 'pending'), 0),
      'suspended_partners', coalesce((select count(*) from public.partners where status = 'suspended'), 0),
      'published_offerings', coalesce((select count(*) from public.marketplace_offerings where status = 'published'), 0),
      'strategic_partners', coalesce((select count(*) from public.partners where certification_level = 'expert' and status = 'approved'), 0),
      'org_submissions', coalesce((select count(*) from public.partners where submitted_by_organization_id = v_org_id), 0)
    ),
    'approved_partners', coalesce((
      select jsonb_agg(
        (row_to_json(p)::jsonb || jsonb_build_object(
          'certification_level_label', public._mpfe_tier_label(p.certification_level)
        ))
        order by
          case p.certification_level when 'expert' then 0 when 'certified' then 1 when 'sales_expert' then 2 when 'sales_representative' then 3 else 4 end,
          p.partner_name
      )
      from public.partners p where p.status = 'approved'
    ), '[]'::jsonb),
    'pending_partners', coalesce((
      select jsonb_agg(
        (row_to_json(p)::jsonb || jsonb_build_object(
          'certification_level_label', public._mpfe_tier_label(p.certification_level)
        ))
        order by p.created_at desc
      )
      from public.partners p where p.status = 'pending'
    ), '[]'::jsonb),
    'offerings', coalesce((
      select jsonb_agg(jsonb_build_object(
        'offering', row_to_json(o),
        'partner_name', p.partner_name,
        'partner_certification', p.certification_level,
        'partner_certification_label', public._mpfe_tier_label(p.certification_level)
      ) order by o.title)
      from public.marketplace_offerings o
      join public.partners p on p.id = o.partner_id
      where o.status = 'published' and p.status = 'approved'
    ), '[]'::jsonb),
    'certification_breakdown', coalesce((
      select jsonb_object_agg(certification_level, cnt)
      from (
        select certification_level, count(*) as cnt
        from public.partners where status = 'approved'
        group by certification_level
      ) s
    ), '{}'::jsonb),
    'certification_breakdown_labels', coalesce((
      select jsonb_object_agg(certification_level, public._mpfe_tier_label(certification_level))
      from (
        select distinct certification_level
        from public.partners where status = 'approved'
      ) s
    ), '{}'::jsonb),
    'quality_indicators', coalesce((
      select jsonb_object_agg(coalesce(quality_indicator, 'unrated'), cnt)
      from (
        select quality_indicator, count(*) as cnt
        from public.marketplace_offerings where status = 'published'
        group by quality_indicator
      ) s
    ), '{}'::jsonb),
    'integration_notes', jsonb_build_object(
      'module_marketplace', jsonb_build_object('route', '/app/module-marketplace-foundation-engine', 'note', 'Activate modules from marketplace catalog'),
      'business_packs', jsonb_build_object('route', '/app/business-packs-foundation-engine', 'note', 'Business pack offerings from certified partners')
    ),
    'recent_activity', coalesce((
      select jsonb_agg(jsonb_build_object(
        'action_type', al.action_type,
        'entity_type', al.entity_type,
        'created_at', al.created_at,
        'metadata', al.metadata
      ) order by al.created_at desc)
      from (
        select action_type, entity_type, created_at, metadata
        from public.audit_logs
        where organization_id = v_org_id
          and action_type in (
            'partner_submitted_for_review', 'partner_application_reviewed',
            'partner_approved', 'partner_suspended', 'partner_recertified',
            'offering_published', 'offering_suspended'
          )
        order by created_at desc
        limit 10
      ) al
    ), '[]'::jsonb),
    'implementation_blueprint', jsonb_build_object(
      'phase', 19,
      'title', 'Marketplace & Ecosystem Engine',
      'engine_phase', 'A.45',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE19_MARKETPLACE_ECOSYSTEM.md',
      'mapping_note', 'ABOS Blueprint Phase 19 maps to Marketplace & Partner Ecosystem Foundation Engine A.45 — extend, do not duplicate Module Marketplace A.23 or Business Packs A.43.'
    ),
    'mission', 'Discover, activate, and benefit from ecosystem extensions — Business Packs, Industry Packs, Connectors, Knowledge Packs, and Companion Skills.',
    'abos_principle', 'No single platform solves everything — empower contributors and grow the ecosystem openly.',
    'ecosystem_objectives', public._mpfe_blueprint_ecosystem_objectives(),
    'industry_packs', public._mpfe_blueprint_industry_packs(),
    'connector_marketplace', public._mpfe_blueprint_connector_marketplace(),
    'knowledge_packs', public._mpfe_blueprint_knowledge_packs(),
    'companion_skills', public._mpfe_blueprint_companion_skills(),
    'self_love_connection', public._mpfe_blueprint_self_love_connection(),
    'trust_connection', public._mpfe_blueprint_trust_connection(),
    'quality_guardian_connection', public._mpfe_blueprint_quality_guardian_connection(),
    'dogfooding', public._mpfe_blueprint_dogfooding(),
    'integration_links', public._mpfe_blueprint_integration_links(),
    'ecosystem_activation_summary', public._mpfe_ecosystem_activation_summary(v_org_id),
    'success_criteria', public._mpfe_blueprint_success_criteria(v_org_id),
    'vision_phrases', public._mpfe_blueprint_vision_phrases(),
    'partner_mission', public._penbp_blueprint_mission(),
    'partner_philosophy', public._penbp_blueprint_philosophy(),
    'partner_abos_principle', 'Verified expertise earns trust — official partner tiers must be credible and outcomes-driven.',
    'partner_vision', 'Organizations locate experts they trust — partners deliver measurable value through credible certification and collaboration.',
    'implementation_blueprint_phase33', jsonb_build_object(
      'phase', 33,
      'title', 'Partner & Aipify Expert Network Engine',
      'engine_phase', 'A.45',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE33_PARTNER_EXPERT_NETWORK.md',
      'mapping_note', 'ABOS Blueprint Phase 33 extends A.45 with expert network tiers, partner discovery, certification cross-links — preserves Phase 19 ecosystem fields. See PARTNER_TERMINOLOGY_UPDATE.md.'
    ),
    'partner_objectives', public._penbp_blueprint_partner_objectives(),
    'partner_tiers', public._penbp_blueprint_partner_tiers(),
    'partner_capabilities', public._penbp_blueprint_partner_capabilities(),
    'partner_marketplace_connection', public._penbp_blueprint_partner_marketplace_connection(),
    'partner_portal_terminology', public._penbp_blueprint_partner_portal_terminology(),
    'compensation_principle', public._penbp_blueprint_compensation_principle(),
    'partner_self_love_connection', public._penbp_blueprint_self_love_connection(),
    'partner_trust_connection', public._penbp_blueprint_trust_connection(),
    'certification_connection', public._penbp_blueprint_certification_connection(),
    'partner_dogfooding', public._penbp_blueprint_dogfooding(),
    'penbp_integration_links', public._penbp_blueprint_integration_links(),
    'partner_engagement_summary', public._penbp_engagement_summary(v_org_id),
    'blueprint_success_criteria', public._penbp_blueprint_success_criteria(v_org_id),
    'partner_vision_phrases', public._penbp_blueprint_vision_phrases(),
    'blueprint_distinction_note', public._penbp_distinction_note(),
    'sales_expert_os_link', jsonb_build_object(
      'label', 'Sales Expert Portal',
      'route', '/app/sales-expert-engine',
      'engine_phase', 'A.95',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE33_SALES_EXPERT_OPERATING_SYSTEM.md',
      'note', 'Field feedback loops for market intelligence — metadata signal counts cross-linked in Phase 51.'
    ),
    'implementation_blueprint_phase51', jsonb_build_object(
      'phase', 51,
      'title', 'Ecosystem Growth & Market Intelligence Engine',
      'engine_phase', 'A.45',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE51_ECOSYSTEM_GROWTH_MARKET_INTELLIGENCE.md',
      'mapping_note', 'ABOS Blueprint Phase 51 extends A.45 with tenant-scoped ecosystem growth and market intelligence — preserves Phase 19 and Phase 33 fields. Distinct from Platform Admin /platform/metrics.'
    ),
    'market_intelligence_mission', public._egmibp_blueprint_mission(),
    'market_intelligence_philosophy', public._egmibp_blueprint_philosophy(),
    'market_intelligence_abos_principle', public._egmibp_blueprint_abos_principle(),
    'market_intelligence_objectives', public._egmibp_blueprint_objectives(),
    'market_observations', public._egmibp_blueprint_market_observations(),
    'industry_intelligence', public._egmibp_blueprint_industry_intelligence(),
    'regional_insights', public._egmibp_blueprint_regional_insights(),
    'sales_expert_feedback_loops', public._egmibp_blueprint_sales_expert_feedback(),
    'partner_ecosystem_insights', public._egmibp_blueprint_partner_ecosystem_insights(),
    'executive_support', public._egmibp_blueprint_executive_support(),
    'market_intelligence_self_love_connection', public._egmibp_blueprint_self_love_connection(),
    'market_intelligence_trust_connection', public._egmibp_blueprint_trust_connection(),
    'market_intelligence_dogfooding', public._egmibp_blueprint_dogfooding(),
    'egmibp_integration_links', public._egmibp_blueprint_integration_links(),
    'ecosystem_growth_summary', public._egmibp_ecosystem_summary(v_org_id),
    'market_intelligence_success_criteria', public._egmibp_blueprint_success_criteria(v_org_id),
    'market_intelligence_vision_phrases', public._egmibp_blueprint_vision_phrases(),
    'market_intelligence_distinction_note', public._egmibp_distinction_note()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Grants + KC category
-- ---------------------------------------------------------------------------
grant execute on function public._egmibp_distinction_note() to authenticated;
grant execute on function public._egmibp_blueprint_mission() to authenticated;
grant execute on function public._egmibp_blueprint_philosophy() to authenticated;
grant execute on function public._egmibp_blueprint_abos_principle() to authenticated;
grant execute on function public._egmibp_blueprint_objectives() to authenticated;
grant execute on function public._egmibp_blueprint_market_observations() to authenticated;
grant execute on function public._egmibp_blueprint_industry_intelligence() to authenticated;
grant execute on function public._egmibp_blueprint_regional_insights() to authenticated;
grant execute on function public._egmibp_blueprint_sales_expert_feedback() to authenticated;
grant execute on function public._egmibp_blueprint_partner_ecosystem_insights() to authenticated;
grant execute on function public._egmibp_blueprint_executive_support() to authenticated;
grant execute on function public._egmibp_blueprint_self_love_connection() to authenticated;
grant execute on function public._egmibp_blueprint_trust_connection() to authenticated;
grant execute on function public._egmibp_blueprint_dogfooding() to authenticated;
grant execute on function public._egmibp_blueprint_integration_links() to authenticated;
grant execute on function public._egmibp_blueprint_vision_phrases() to authenticated;
grant execute on function public._egmibp_ecosystem_summary(uuid) to authenticated;
grant execute on function public._egmibp_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'ecosystem-growth-market-intelligence-blueprint', 'Ecosystem Growth & Market Intelligence Engine (ABOS Phase 51)',
  'Ecosystem Growth & Market Intelligence — tenant-scoped market observations, regional insights, Sales Expert feedback loops, and live ecosystem summary. Distinct from Platform Admin metrics.',
  'authenticated', 99
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'ecosystem-growth-market-intelligence-blueprint' and tenant_id is null
);
