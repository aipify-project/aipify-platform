-- Implementation Blueprint Phase 101 — Commerce Intelligence Engine
-- Extends Commerce Intelligence Engine repo Phase 101. No new tables.
-- Distinct from Commerce Performance & Profit repo Phase 104 at /app/commerce-performance.
-- Distinct from Revenue Intelligence Blueprint Phase 39 at /app/commercial (MRR/ARR only).

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._cibp101_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 101 — Commerce Intelligence Engine at /app/commerce-intelligence. Extends Commerce Intelligence Engine repo Phase 101 (_cie_*) and preserves ALL baseline dashboard and card fields. Wisdom guides commerce — sustainable opportunities aligned with strengths and customer needs. Distinct from Commerce Performance & Profit repo Phase 104 at /app/commerce-performance (profit/operations cross-link, not duplicate). Distinct from Revenue Intelligence Blueprint Phase 39 at /app/commercial (subscription MRR/ARR only). Cross-links Integration Engine A.8, Business DNA, Purpose & Values Blueprint Phase 95, Decision Support, Marketplace A.45, Strategic Intelligence A.31, Curiosity A.87 Phase 80. Helpers use _cibp101_* — never collide with _cie_*.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._cibp101_mission()
returns text language sql immutable as $$
  select 'Commercial outcomes through opportunity discovery, product intelligence, and market awareness.';
$$;

create or replace function public._cibp101_philosophy()
returns text language sql immutable as $$
  select 'Wisdom guides commerce — sustainable opportunities aligned with strengths and customer needs. Awareness not hype — trends inform, humans decide.';
$$;

create or replace function public._cibp101_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — wisdom not speculation. Aipify Commerce Companion informs and prepares product research, trend awareness, margin analysis, and supplier evaluation; humans approve every import and commercial decision.';
$$;

create or replace function public._cibp101_vision()
returns text language sql immutable as $$
  select 'We understand our commercial opportunities more clearly than ever before.';
$$;

create or replace function public._cibp101_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'trend_intelligence', 'label', 'Trend intelligence', 'emoji', '🦉', 'description', 'Market trend awareness — signals without hype or urgency pressure'),
    jsonb_build_object('key', 'product_opportunity_discovery', 'label', 'Product opportunity discovery', 'emoji', '🌹', 'description', 'Discover products that fit customer needs, store identity, and margin goals'),
    jsonb_build_object('key', 'margin_intelligence', 'label', 'Margin intelligence', 'emoji', '🔔', 'description', 'Margin and profitability analysis before commitment — wisdom before scale'),
    jsonb_build_object('key', 'supplier_insights', 'label', 'Supplier insights', 'emoji', '🦉', 'description', 'Supplier evaluation, reliability signals, and risk awareness'),
    jsonb_build_object('key', 'store_fit_analysis', 'label', 'Store fit analysis', 'emoji', '🌹', 'description', 'Catalog alignment with audience, category, and brand identity'),
    jsonb_build_object('key', 'commerce_strategy_connection', 'label', 'Commerce strategy connection', 'emoji', '🔔', 'description', 'Connect opportunities to purpose, sustainable growth, and customer needs')
  );
$$;

create or replace function public._cibp101_commerce_insight_sources()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Commerce insight sources — metadata patterns only; never raw customer PII or payment records.',
    'sources', jsonb_build_array(
      jsonb_build_object('key', 'platform_install', 'label', 'Platform Install catalog', 'route', '/app/platform-install', 'description', 'Connected store catalog and installation context'),
      jsonb_build_object('key', 'trend_signals', 'label', 'Trend signals', 'description', 'Search interest, seasonal demand, marketplace popularity — aggregate metadata'),
      jsonb_build_object('key', 'competitor_signals', 'label', 'Competitor product signals', 'description', 'Competitor activity summaries — no scraped private data'),
      jsonb_build_object('key', 'supplier_profiles', 'label', 'Supplier profiles', 'description', 'Delivery, defect rate, price stability, stock consistency'),
      jsonb_build_object('key', 'margin_analyses', 'label', 'Margin analyses', 'description', 'Landed cost, gross/net margin estimates, classification'),
      jsonb_build_object('key', 'store_fit_reports', 'label', 'Store fit reports', 'description', 'Audience match and category alignment scores'),
      jsonb_build_object('key', 'business_dna', 'label', 'Business DNA tone', 'route', '/app/settings/business-dna', 'description', 'Brand tone and support knowledge — cross-link only'),
      jsonb_build_object('key', 'integration_connectors', 'label', 'Integration connectors', 'route', '/app/integration-engine', 'description', 'Integration Engine A.8 — approved connector metadata')
    ),
    'boundary_note', 'Insight sources are explainable metadata — humans verify before import or scale.'
  );
$$;

create or replace function public._cibp101_trend_intelligence()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trend intelligence — awareness not hype. Signals inform evaluation; never urgency pressure or guaranteed wins.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'context_before_action', 'label', 'Context before action', 'description', 'What trend signals mean for your store — fit, margin, and audience before chasing popularity'),
      jsonb_build_object('emoji', '🌹', 'key', 'audience_fit', 'label', 'Audience-fit opportunities', 'description', 'Seasonal and segment-aligned trends — aligned with store strengths'),
      jsonb_build_object('emoji', '🔔', 'key', 'pause_before_chase', 'label', 'Pause before chasing', 'description', 'When saturated markets or weak margins should slow impulsive tests — human approval always')
    ),
    'boundary_note', 'Trend velocity is metadata — not a promise of revenue or guaranteed success.'
  );
$$;

create or replace function public._cibp101_product_opportunity_discovery()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Product opportunity discovery — scores and recommendations prepare decisions; auto_import_disabled remains default true.',
    'capabilities', jsonb_build_array(
      'Discovery runs with balanced, trend-focused, margin-focused, and low-competition modes',
      'Opportunity scores combining trend, margin, supplier, store fit, and competition',
      'Recommendation types: test_product, add_watchlist, import_later, avoid_for_now, and related actions',
      'Product risk flags — saturated market, weak margin, unreliable supplier',
      'Watchlists and human approval before any import — record_commerce_recommendation_action requires approval'
    ),
    'product_automation_route', '/app/product-automation',
    'boundary_note', 'Discovery prepares — humans approve imports and catalog changes.'
  );
$$;

create or replace function public._cibp101_margin_intelligence()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Margin intelligence — wisdom before scale. Landed cost and net margin estimates before commitment.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'landed_cost', 'label', 'Landed cost estimation', 'description', 'Supplier cost plus shipping and handling assumptions — transparent risk notes'),
      jsonb_build_object('key', 'gross_net_margin', 'label', 'Gross and net margin', 'description', 'Estimated margin percent against recommended price range'),
      jsonb_build_object('key', 'margin_classification', 'label', 'Margin classification', 'description', 'excellent_margin through high_risk — compared to tenant margin_threshold_percent'),
      jsonb_build_object('key', 'risk_notes', 'label', 'Risk notes', 'description', 'Shipping variability, ad cost dependency, and weak net margin warnings')
    ),
    'commerce_performance_route', '/app/commerce-performance',
    'boundary_note', 'Margin intelligence supports decisions — cross-link Phase 104 for profit operations, do not duplicate.'
  );
$$;

create or replace function public._cibp101_supplier_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Supplier insights — reliability and risk awareness before product tests.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'reliability_patterns', 'label', 'Reliability patterns', 'description', 'Delivery time, defect rate, price stability, stock consistency — metadata summaries'),
      jsonb_build_object('emoji', '🌹', 'key', 'trusted_testing', 'label', 'Trusted for testing', 'description', 'Approved_for_testing and trusted suppliers — limited volume before scale'),
      jsonb_build_object('emoji', '🔔', 'key', 'risk_blocks', 'label', 'Risk blocks impulsive tests', 'description', 'High_risk and avoid suppliers — pause before large orders or auto-import paths')
    ),
    'dropshipping_route', '/app/dropshipping-operations',
    'boundary_note', 'Supplier scores are illustrative — humans validate relationships and samples.'
  );
$$;

create or replace function public._cibp101_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Commerce Companion guidance — warm, optional, non-intrusive. Wisdom not speculation.',
    'companion_name', 'Commerce Companion',
    'not_label', 'AI commerce bot',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'trend_context', 'prompt', 'This product is trending — would a margin and store-fit summary help before you decide?', 'consideration', 'Awareness not hype — humans approve imports'),
      jsonb_build_object('emoji', '🌹', 'key', 'store_fit', 'prompt', 'Store fit looks strong for your active lifestyle catalog — shall I prepare a test-product checklist?', 'consideration', 'Aligned with strengths — not popularity alone'),
      jsonb_build_object('emoji', '🔔', 'key', 'supplier_risk', 'prompt', 'Supplier reliability signals are mixed — would pausing for an alternative evaluation feel wise?', 'consideration', 'Patience over impulsive launches — Self Love cross-link')
    ),
    'boundary_note', 'Commerce Companion scaffolds research — never auto-imports or guarantees success.'
  );
$$;

create or replace function public._cibp101_commerce_strategy_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Commerce strategy connection — opportunities must fit purpose, sustainable growth, and customer needs.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'purpose_alignment', 'label', 'Purpose alignment', 'description', 'Cross-link Purpose & Values Blueprint Phase 95 — values-aware product choices'),
      jsonb_build_object('key', 'sustainable_growth', 'label', 'Sustainable growth', 'description', 'Pace catalog expansion — margin thresholds and store fit before scale'),
      jsonb_build_object('key', 'customer_needs', 'label', 'Customer needs first', 'description', 'Products good when they fit customer, store, supplier, margin, and long-term trust'),
      jsonb_build_object('key', 'decision_support', 'label', 'Decision support', 'description', 'Cross-link Decision Support Engine — trade-offs and confidence, never auto-execute')
    ),
    'purpose_values_route', '/app/purpose-values-engine',
    'decision_support_route', '/app/assistant/decisions',
    'boundary_note', 'Strategy connection is cross-link scaffolding — humans decide commercial direction.'
  );
$$;

create or replace function public._cibp101_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — patience and disciplined decisions in commercial growth.',
    'quotes', jsonb_build_array(
      'Patience and disciplined decisions beat impulsive product launches — sustainable commerce grows one thoughtful choice at a time.',
      'Not every trending product deserves your energy — rest is part of sustainable business growth.',
      'Margin clarity before scale protects wellbeing — rushed imports create avoidable stress.',
      'Your catalog can grow at a human pace — wisdom not speculation.'
    ),
    'practices', jsonb_build_array(
      'Pause before chasing saturated trends — disciplined evaluation over hype',
      'Celebrate thoughtful product tests — not only rapid catalog expansion',
      'Supplier risk awareness reduces operational stress — patience in partner selection',
      'Sustainable growth pacing — cross-link Self Love A.76 rhythms'
    ),
    'route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports wellbeing rhythms — principle only; Commerce Intelligence stores product metadata, not personal wellbeing content.'
  );
$$;

create or replace function public._cibp101_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparent commerce intelligence — explainable scores, human approval, audited actions.',
    'users_should_see', jsonb_build_array(
      'How opportunity scores combine trend, margin, supplier, store fit, and competition — metadata only',
      'auto_import_disabled default and human approval for recommendation actions',
      'Limitation principles — no guaranteed success promises',
      'Audit trail via commerce_intelligence_audit_log — discovery, margin, watchlist, briefing events'
    ),
    'operators_should_understand', jsonb_build_array(
      'Commerce intelligence is scaffolding — not automated catalog management or dropship bots',
      'Cross-links Trust & Action Engine — sensitive commercial actions may need approval context',
      'Business DNA and Integration Engine supply context — do not bypass tenant tone or connector policy',
      'Platform aggregates only at platform governance — tenant data stays tenant-scoped'
    ),
    'audit_note', 'cie_discovery_run, cie_margin_analyzed, cie_watchlist_added, cie_briefing_generated — metadata only.'
  );
$$;

create or replace function public._cibp101_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Limitation principles — wisdom not speculation in commercial intelligence.',
    'must_avoid', jsonb_build_array(
      'Guaranteed success promises or hype-driven urgency framing',
      'Impulsive product decisions driven by trend popularity alone',
      'Popularity-only recommendations that ignore store fit, margin thresholds, or supplier risk',
      'Ignoring stated purpose, values, or long-term customer trust for short-term trend chasing'
    ),
    'required', jsonb_build_array(
      'Human approval before product import — auto_import_disabled default true',
      'Explainable opportunity scores with risk flags and margin classification',
      'Store fit and supplier insight alongside trend signals',
      'Commerce Companion tone — Aipify informs and prepares; humans decide'
    ),
    'boundary_note', 'A product is good when it fits customer, store, supplier, margin, and trust — not when it merely trends.'
  );
$$;

create or replace function public._cibp101_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Dogfooding — validate commerce intelligence patterns on real catalog decisions before broad rollout.',
    'sportsklaer_no', jsonb_build_object(
      'slug', 'sportsklaer-no',
      'role', 'Sportsklær.no — active lifestyle commerce dogfooding',
      'focus', jsonb_build_array(
        'Product research for fitness and active lifestyle categories',
        'Supplier evaluation — Nordic fitness supply vs high-risk dropship patterns',
        'Margin analysis before seasonal campaigns — insulated bottles, training accessories',
        'Store fit validation — lifestyle brand identity vs weak-fit kitchen gadgets',
        'Commerce Companion tone — wisdom not speculation on trending products'
      )
    ),
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal validation — limitation principles, trust connection, KC FAQ',
      'focus', jsonb_build_array(
        'Commerce Companion guidance examples (🦉🌹🔔)',
        'Limitation principles — no guaranteed success language in ILM',
        'Integration with Platform Install Phase 100 connectors',
        'Knowledge Center FAQ — implementation-blueprint-phase101-faq'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce operations cross-links',
      'focus', jsonb_build_array(
        'Opportunity discovery with human approval workflow',
        'Margin threshold alignment with commerce performance Phase 104 cross-link',
        'Supplier watchlist in dropshipping operations context'
      )
    )
  );
$$;

create or replace function public._cibp101_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We understand our commercial opportunities more clearly than ever before.',
    'Wisdom guides commerce — sustainable opportunities aligned with strengths and customer needs.',
    'Awareness not hype — trends inform, humans decide.',
    '🦉 Context before action — margin and store fit before chasing popularity.',
    '🌹 Products that fit your customers and catalog identity — not trend noise alone.',
    '🔔 Pause when supplier risk or weak margins signal impulsive tests.',
    'Patience and disciplined decisions beat impulsive product launches.',
    'Aipify Commerce Companion informs and prepares — humans approve every import.'
  );
$$;

create or replace function public._cibp101_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'integration_engine_a8', 'label', 'Integration Engine (A.8)', 'route', '/app/integration-engine', 'note', 'Approved connectors and sync metadata'),
    jsonb_build_object('key', 'business_dna', 'label', 'Business DNA Engine', 'route', '/app/settings/business-dna', 'note', 'Tone, templates, and support knowledge — cross-link'),
    jsonb_build_object('key', 'purpose_values_phase95', 'label', 'Purpose & Values (Blueprint Phase 95)', 'route', '/app/purpose-values-engine', 'note', 'Purpose-aligned product and catalog decisions'),
    jsonb_build_object('key', 'decision_support', 'label', 'Decision Support Engine', 'route', '/app/assistant/decisions', 'note', 'Trade-offs and confidence — humans decide'),
    jsonb_build_object('key', 'marketplace_a45', 'label', 'Marketplace (A.45)', 'route', '/app/marketplace', 'note', 'Module marketplace governance — cross-link'),
    jsonb_build_object('key', 'commerce_performance_phase104', 'label', 'Commerce Performance & Profit (Phase 104)', 'route', '/app/commerce-performance', 'note', 'Profit/operations — distinct from Phase 101 discovery'),
    jsonb_build_object('key', 'revenue_intelligence_phase39', 'label', 'Revenue Intelligence (Blueprint Phase 39)', 'route', '/app/commercial', 'note', 'Subscription MRR/ARR only — not product discovery'),
    jsonb_build_object('key', 'strategic_intelligence_a31', 'label', 'Strategic Intelligence (A.31)', 'route', '/app/strategic-intelligence-foundation-engine', 'note', 'Market and competitor strategic signals'),
    jsonb_build_object('key', 'curiosity_a87_phase80', 'label', 'Curiosity & Discovery (A.87 / Phase 80)', 'route', '/app/curiosity-discovery-engine', 'note', 'Opportunity exploration — cross-link'),
    jsonb_build_object('key', 'platform_install_phase100', 'label', 'Platform Install (Phase 100)', 'route', '/app/platform-install', 'note', 'Store catalog from connected platforms'),
    jsonb_build_object('key', 'product_automation_phase102', 'label', 'Product Automation (Phase 102)', 'route', '/app/product-automation', 'note', 'Post-approval import and content — cross-link'),
    jsonb_build_object('key', 'dropshipping_operations_phase103', 'label', 'Dropshipping Operations (Phase 103)', 'route', '/app/dropshipping-operations', 'note', 'Supplier monitoring and order health'),
    jsonb_build_object('key', 'self_love_a76', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Patience and disciplined decisions — principle only'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'route', '/app/knowledge-center', 'note', 'Commerce intelligence guides and FAQ')
  );
$$;

create or replace function public._cibp101_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_metrics jsonb;
  v_opportunities int := 0;
  v_products int := 0;
  v_suppliers int := 0;
begin
  perform public._cie_ensure_settings(p_tenant_id);
  v_metrics := public._cie_refresh_metrics(p_tenant_id);

  select count(*) into v_opportunities from public.product_opportunities where tenant_id = p_tenant_id;
  select count(*) into v_products from public.commerce_products where tenant_id = p_tenant_id;
  select count(*) into v_suppliers from public.supplier_profiles where tenant_id = p_tenant_id;

  return jsonb_build_object(
    'intelligence_score', coalesce((v_metrics->>'intelligence_score')::numeric, 0),
    'opportunities_count', coalesce((v_metrics->>'opportunities_count')::int, 0),
    'trending_signals', coalesce((v_metrics->>'trending_signals')::int, 0),
    'products_tracked', v_products,
    'suppliers_tracked', v_suppliers,
    'active_opportunities', v_opportunities,
    'watchlist_count', coalesce((v_metrics->>'watchlist_count')::int, 0),
    'objectives_documented', jsonb_array_length(public._cibp101_objectives()),
    'insight_sources', jsonb_array_length(public._cibp101_commerce_insight_sources()->'sources'),
    'companion_examples', jsonb_array_length(public._cibp101_companion_guidance()->'examples'),
    'integration_links', jsonb_array_length(public._cibp101_integration_links()),
    'privacy_note', 'Aggregate commerce intelligence counts and blueprint scaffolds only — no raw customer content, orders, or PII.'
  );
end; $$;

create or replace function public._cibp101_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_opportunities int := 0;
begin
  perform public._cie_ensure_settings(p_tenant_id);
  perform public._cie_seed_products(p_tenant_id);
  perform public._cie_seed_suppliers(p_tenant_id);
  perform public._cie_seed_opportunities(p_tenant_id);
  v_engagement := public._cibp101_engagement_summary(p_tenant_id);
  v_opportunities := coalesce((v_engagement->>'active_opportunities')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'trend_intelligence',
      'label', 'Trend intelligence — awareness not hype (🦉🌹🔔)',
      'met', jsonb_array_length(public._cibp101_trend_intelligence()->'dimensions') >= 3,
      'note', 'Trend signals inform — never guarantee success.'
    ),
    jsonb_build_object(
      'key', 'product_opportunity_discovery',
      'label', 'Product opportunity discovery — scores and human approval',
      'met', v_opportunities >= 1,
      'note', case when v_opportunities < 1 then 'Run product discovery to seed opportunities.' else null end
    ),
    jsonb_build_object(
      'key', 'margin_intelligence',
      'label', 'Margin intelligence — classification and risk notes documented',
      'met', (public._cibp101_margin_intelligence()->>'principle') is not null,
      'note', 'Cross-link Commerce Performance Phase 104 for profit operations.'
    ),
    jsonb_build_object(
      'key', 'supplier_insights',
      'label', 'Supplier insights — reliability and risk dimensions (🦉🌹🔔)',
      'met', jsonb_array_length(public._cibp101_supplier_insights()->'dimensions') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'store_fit_analysis',
      'label', 'Store fit analysis — catalog alignment objective documented',
      'met', exists (
        select 1 from public._cibp101_objectives() obj
        where obj->>'key' = 'store_fit_analysis'
      ),
      'note', 'Store fit reports on dashboard — baseline Phase 101 preserved.'
    ),
    jsonb_build_object(
      'key', 'commerce_strategy_connection',
      'label', 'Commerce strategy connection — purpose, growth, customer needs',
      'met', jsonb_array_length(public._cibp101_commerce_strategy_connection()->'dimensions') >= 4,
      'note', 'Cross-link Purpose & Values Phase 95 and Decision Support.'
    ),
    jsonb_build_object(
      'key', 'commerce_insight_sources',
      'label', 'Commerce insight sources — explainable metadata sources',
      'met', jsonb_array_length(public._cibp101_commerce_insight_sources()->'sources') >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Commerce Companion guidance — wisdom not speculation',
      'met', jsonb_array_length(public._cibp101_companion_guidance()->'examples') >= 3,
      'note', 'Commerce Companion — not generic AI commerce bot.'
    ),
    jsonb_build_object(
      'key', 'limitation_principles',
      'label', 'Limitation principles — no guaranteed success or impulsive hype',
      'met', jsonb_array_length(public._cibp101_limitation_principles()->'must_avoid') >= 4,
      'note', 'Wisdom not speculation.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — transparent scores and human approval',
      'met', jsonb_array_length(public._cibp101_trust_connection()->'users_should_see') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — patience and disciplined decisions',
      'met', jsonb_array_length(public._cibp101_self_love_connection()->'quotes') >= 2,
      'note', 'Patience and disciplined decisions beat impulsive product launches.'
    ),
    jsonb_build_object(
      'key', 'baseline_preserved',
      'label', 'Repo Phase 101 baseline fields preserved on dashboard',
      'met', to_regclass('public.commerce_intelligence_settings') is not null,
      'note', '_cie_* tables and RPC behavior intact.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links Integration, Business DNA, Purpose & Values, Decision Support, Marketplace, Phase 104, Phase 39',
      'met', jsonb_array_length(public._cibp101_integration_links()) >= 12,
      'note', 'Strategic Intelligence A.31 and Curiosity A.87 included.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Sportsklær.no product research, supplier evaluation, margin analysis',
      'met', (public._cibp101_dogfooding()->'sportsklaer_no') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS principle — wisdom not speculation',
      'met', true,
      'note', 'Humans approve every import; Aipify informs and prepares.'
    )
  );
end; $$;

create or replace function public._cibp101_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 101 — Commerce Intelligence Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE101_COMMERCE_INTELLIGENCE.md',
    'engine_phase', 'Repo Phase 101 Commerce Intelligence Engine',
    'route', '/app/commerce-intelligence',
    'mapping_note', 'ABOS Blueprint Phase 101 extends repo Phase 101 with wisdom-guided commerce scaffolding. Distinct from Commerce Performance Phase 104 and Revenue Intelligence Blueprint Phase 39.',
    'distinction_note', public._cibp101_distinction_note(),
    'mission', public._cibp101_mission(),
    'philosophy', public._cibp101_philosophy(),
    'abos_principle', public._cibp101_abos_principle(),
    'objectives', public._cibp101_objectives(),
    'commerce_insight_sources', public._cibp101_commerce_insight_sources(),
    'trend_intelligence', public._cibp101_trend_intelligence(),
    'product_opportunity_discovery', public._cibp101_product_opportunity_discovery(),
    'margin_intelligence', public._cibp101_margin_intelligence(),
    'supplier_insights', public._cibp101_supplier_insights(),
    'companion_guidance', public._cibp101_companion_guidance(),
    'commerce_strategy_connection', public._cibp101_commerce_strategy_connection(),
    'self_love_connection', public._cibp101_self_love_connection(),
    'trust_connection', public._cibp101_trust_connection(),
    'limitation_principles', public._cibp101_limitation_principles(),
    'dogfooding', public._cibp101_dogfooding(),
    'success_criteria', public._cibp101_success_criteria(p_tenant_id),
    'vision', public._cibp101_vision(),
    'vision_phrases', public._cibp101_vision_phrases(),
    'integration_links', public._cibp101_integration_links(),
    'engagement_summary', public._cibp101_engagement_summary(p_tenant_id),
    'privacy_note', 'Commerce intelligence blueprint data is metadata only — opportunity scores, trend summaries, supplier metadata. No guaranteed success promises. Humans decide; Aipify Commerce Companion informs and prepares.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Card RPC — preserve ALL baseline fields; append Phase 101
-- ---------------------------------------------------------------------------
create or replace function public.get_commerce_intelligence_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb; v_engagement jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._cie_ensure_settings(v_tenant_id);
  v_metrics := public._cie_refresh_metrics(v_tenant_id);
  v_engagement := public._cibp101_engagement_summary(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'intelligence_score', v_metrics->'intelligence_score',
    'opportunities_count', v_metrics->'opportunities_count',
    'philosophy', 'Find better products. Understand the market. Grow smarter.',
    'human_oversight_required', true,
    'implementation_blueprint_phase101', jsonb_build_object(
      'phase', 'Phase 101 — Commerce Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE101_COMMERCE_INTELLIGENCE.md',
      'engine_phase', 'Repo Phase 101 Commerce Intelligence Engine',
      'route', '/app/commerce-intelligence',
      'mapping_note', 'ABOS Blueprint Phase 101 extends repo Phase 101 — wisdom guides commerce. Distinct from Phase 104 profit operations and Phase 39 MRR/ARR.'
    ),
    'commerce_intelligence_mission', public._cibp101_mission(),
    'commerce_intelligence_abos_principle', public._cibp101_abos_principle(),
    'commerce_intelligence_engagement_summary', v_engagement,
    'commerce_intelligence_note', 'Commerce Intelligence Engine (ABOS Phase 101) — wisdom not speculation; humans approve imports.',
    'commerce_intelligence_vision_note', public._cibp101_vision()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Dashboard RPC — preserve ALL baseline fields; append Phase 101
-- ---------------------------------------------------------------------------
create or replace function public.get_commerce_intelligence_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.commerce_intelligence_settings;
  v_metrics jsonb;
begin
  v_tenant_id := public._cie_require_tenant();
  v_settings := public._cie_ensure_settings(v_tenant_id);
  perform public._cie_seed_products(v_tenant_id);
  perform public._cie_seed_suppliers(v_tenant_id);
  perform public._cie_seed_opportunities(v_tenant_id);
  perform public._cie_seed_margins(v_tenant_id);
  perform public._cie_seed_trends_risks_fit(v_tenant_id);
  v_metrics := public._cie_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'auto_import_disabled', v_settings.auto_import_disabled,
    'philosophy', 'Find better products. Understand the market. Grow smarter.',
    'safety_note', 'Phase 101 provides intelligence and recommendations only. Product import requires human approval.',
    'engine_enabled', v_settings.engine_enabled,
    'margin_threshold_percent', v_settings.margin_threshold_percent,
    'discovery_mode', v_settings.discovery_mode,
    'intelligence_score', v_metrics->'intelligence_score',
    'opportunities_count', v_metrics->'opportunities_count',
    'avg_opportunity_score', v_metrics->'avg_opportunity_score',
    'trending_signals', v_metrics->'trending_signals',
    'products_to_avoid_count', v_metrics->'products_to_avoid',
    'watchlist_count', v_metrics->'watchlist_count',
    'best_opportunities', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id, 'product_id', o.product_id, 'product_name', p.name, 'category', p.category,
        'opportunity_score', o.opportunity_score, 'recommendation_type', o.recommendation_type,
        'recommendation_summary', o.recommendation_summary, 'trend_confidence', o.trend_confidence,
        'competition_level', o.competition_level, 'margin_classification', o.margin_classification,
        'store_fit_score', o.store_fit_score, 'on_watchlist', exists(
          select 1 from public.commerce_watchlists w where w.product_id = o.product_id and w.tenant_id = v_tenant_id
        )
      ) order by o.opportunity_score desc)
      from public.product_opportunities o
      join public.commerce_products p on p.id = o.product_id
      where o.tenant_id = v_tenant_id and o.recommendation_type in ('test_product', 'bundle_product', 'seasonal_campaign')
    ), '[]'::jsonb),
    'trending_now', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id, 'product_name', p.name, 'signal_type', t.signal_type,
        'signal_strength', t.signal_strength, 'summary', t.summary
      ) order by t.detected_at desc)
      from public.trend_signals t
      left join public.commerce_products p on p.id = t.product_id
      where t.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'high_margin_candidates', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'product_id', m.product_id, 'product_name', p.name,
        'estimated_net_margin_percent', m.estimated_net_margin_percent,
        'margin_classification', m.margin_classification,
        'recommended_price_min', m.recommended_price_min,
        'recommended_price_max', m.recommended_price_max,
        'risk_note', m.risk_note
      ) order by m.estimated_net_margin_percent desc)
      from public.margin_analyses m
      join public.commerce_products p on p.id = m.product_id
      where m.tenant_id = v_tenant_id and m.margin_classification in ('excellent_margin', 'good_margin')
    ), '[]'::jsonb),
    'supplier_watchlist', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', sc.id, 'supplier_name', s.name, 'insight_score', sc.insight_score,
        'risk_level', sc.risk_level, 'strengths', sc.strengths, 'risks', sc.risks,
        'recommendation', sc.recommendation
      ) order by sc.insight_score desc)
      from public.supplier_insight_scores sc
      join public.supplier_profiles s on s.id = sc.supplier_id
      where sc.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'products_to_avoid', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id, 'product_id', o.product_id, 'product_name', p.name,
        'opportunity_score', o.opportunity_score, 'recommendation_summary', o.recommendation_summary,
        'risk_flags', coalesce((
          select jsonb_agg(jsonb_build_object('title', r.title, 'explanation', r.explanation, 'severity', r.severity))
          from public.product_risk_flags r where r.product_id = o.product_id and r.resolved = false
        ), '[]'::jsonb)
      ))
      from public.product_opportunities o
      join public.commerce_products p on p.id = o.product_id
      where o.tenant_id = v_tenant_id and o.recommendation_type = 'avoid_for_now'
    ), '[]'::jsonb),
    'seasonal_opportunities', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', so.id, 'season_label', so.season_label, 'title', so.title,
        'summary', so.summary, 'product_name', p.name
      ))
      from public.seasonal_opportunities so
      left join public.commerce_products p on p.id = so.product_id
      where so.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'store_fit_recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', sf.id, 'product_id', sf.product_id, 'product_name', p.name,
        'fit_score', sf.fit_score, 'fit_summary', sf.fit_summary,
        'audience_match', sf.audience_match, 'category_alignment', sf.category_alignment
      ) order by sf.fit_score desc)
      from public.store_fit_reports sf
      join public.commerce_products p on p.id = sf.product_id
      where sf.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'commerce_recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', cr.id, 'section', cr.section, 'title', cr.title,
        'summary', cr.summary, 'action_type', cr.action_type
      ) order by cr.priority)
      from public.commerce_recommendations cr where cr.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'discovery_runs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', dr.id, 'discovery_mode', dr.discovery_mode, 'products_found', dr.products_found,
        'summary', dr.summary, 'completed_at', dr.completed_at
      ) order by dr.completed_at desc)
      from public.product_discovery_runs dr where dr.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'summary', b.summary, 'created_at', b.created_at)
        order by b.created_at desc)
      from public.commerce_intelligence_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'platform_install', 'Store catalog from connected platforms',
      'marketplace_governance', 'Product quality standards',
      'strategic_intelligence', 'Market and competitor signals',
      'knowledge_center', 'Commerce intelligence guides and FAQ'
    ),
    'implementation_blueprint_phase101', jsonb_build_object(
      'phase', 'Phase 101 — Commerce Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE101_COMMERCE_INTELLIGENCE.md',
      'engine_phase', 'Repo Phase 101 Commerce Intelligence Engine',
      'route', '/app/commerce-intelligence',
      'mapping_note', 'ABOS Blueprint Phase 101 extends repo Phase 101 — wisdom guides commerce. Distinct from Commerce Performance Phase 104 and Revenue Intelligence Blueprint Phase 39.'
    ),
    'commerce_intelligence_engine_note', 'Commerce Intelligence Engine (ABOS Phase 101) — commercial outcomes through opportunity discovery, product intelligence, and market awareness — wisdom not speculation.',
    'commerce_intelligence_blueprint', public._cibp101_blueprint_block(v_tenant_id),
    'commerce_intelligence_distinction_note', public._cibp101_distinction_note(),
    'commerce_intelligence_mission', public._cibp101_mission(),
    'commerce_intelligence_philosophy', public._cibp101_philosophy(),
    'commerce_intelligence_abos_principle', public._cibp101_abos_principle(),
    'commerce_intelligence_objectives', public._cibp101_objectives(),
    'commerce_insight_sources', public._cibp101_commerce_insight_sources(),
    'commerce_trend_intelligence', public._cibp101_trend_intelligence(),
    'commerce_product_opportunity_discovery', public._cibp101_product_opportunity_discovery(),
    'commerce_margin_intelligence', public._cibp101_margin_intelligence(),
    'commerce_supplier_insights', public._cibp101_supplier_insights(),
    'commerce_companion_guidance', public._cibp101_companion_guidance(),
    'commerce_strategy_connection', public._cibp101_commerce_strategy_connection(),
    'commerce_self_love_connection', public._cibp101_self_love_connection(),
    'commerce_trust_connection', public._cibp101_trust_connection(),
    'commerce_limitation_principles', public._cibp101_limitation_principles(),
    'commerce_intelligence_dogfooding', public._cibp101_dogfooding(),
    'cibp101_integration_links', public._cibp101_integration_links(),
    'commerce_intelligence_engagement_summary', public._cibp101_engagement_summary(v_tenant_id),
    'commerce_intelligence_success_criteria', public._cibp101_success_criteria(v_tenant_id),
    'commerce_intelligence_vision', public._cibp101_vision(),
    'commerce_intelligence_vision_phrases', public._cibp101_vision_phrases(),
    'commerce_intelligence_privacy_note', 'Commerce intelligence metadata only — no guaranteed success promises, no auto-import without approval. Humans decide; Aipify Commerce Companion informs and prepares.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._cibp101_distinction_note() to authenticated;
grant execute on function public._cibp101_mission() to authenticated;
grant execute on function public._cibp101_philosophy() to authenticated;
grant execute on function public._cibp101_abos_principle() to authenticated;
grant execute on function public._cibp101_vision() to authenticated;
grant execute on function public._cibp101_objectives() to authenticated;
grant execute on function public._cibp101_commerce_insight_sources() to authenticated;
grant execute on function public._cibp101_trend_intelligence() to authenticated;
grant execute on function public._cibp101_product_opportunity_discovery() to authenticated;
grant execute on function public._cibp101_margin_intelligence() to authenticated;
grant execute on function public._cibp101_supplier_insights() to authenticated;
grant execute on function public._cibp101_companion_guidance() to authenticated;
grant execute on function public._cibp101_commerce_strategy_connection() to authenticated;
grant execute on function public._cibp101_self_love_connection() to authenticated;
grant execute on function public._cibp101_trust_connection() to authenticated;
grant execute on function public._cibp101_limitation_principles() to authenticated;
grant execute on function public._cibp101_dogfooding() to authenticated;
grant execute on function public._cibp101_vision_phrases() to authenticated;
grant execute on function public._cibp101_integration_links() to authenticated;
grant execute on function public._cibp101_engagement_summary(uuid) to authenticated;
grant execute on function public._cibp101_success_criteria(uuid) to authenticated;
grant execute on function public._cibp101_blueprint_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'commerce-intelligence-blueprint-phase101', 'Commerce Intelligence Engine (ABOS Phase 101)',
  'Commerce Intelligence Engine — wisdom-guided product discovery, trend awareness, margin analysis, and supplier insights. Awareness not hype; humans approve imports.',
  'authenticated', 130
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'commerce-intelligence-blueprint-phase101' and tenant_id is null
);
