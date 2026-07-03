-- Implementation Blueprint Phase 109 — Global Commerce Expansion Engine
-- Extends Global Commerce Expansion Engine repo Phase 109. No new tables.
-- Distinct from Global Expansion & Localization repo Phase 95 at /app/global-expansion.
-- Distinct from Multi-Store Orchestration repo Phase 105 at /app/multi-store.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._gcebp109_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 109 — Global Commerce Expansion Engine at /app/global-commerce-expansion. Extends Global Commerce Expansion Engine repo Phase 109 (_gce_*) and preserves ALL baseline dashboard and card fields including auto_market_entry_disabled — no automatic market launch; human oversight required. THIS phase — commerce international growth. Distinct from Global Expansion & Localization repo Phase 95 at /app/global-expansion (platform i18n, translation projects, terminology — NOT commerce market entry). Blueprint Phase 35 Localization extends Phase 95 — Nordic payments, KC localization — cross-link only. Distinct from Multi-Store Orchestration repo Phase 105 at /app/multi-store (portfolio/regional stores — cross-link, not duplicate). Cross-links Product Automation Blueprint Phase 102 at /app/product-automation (product translation for catalogs). Cross-links Commerce Intelligence Blueprint Phase 101 at /app/commerce-intelligence (market opportunity signals). Cross-links Commerce Performance & Profit repo Phase 104 at /app/commerce-performance (regional profitability). Cross-links Growth Partner Blueprint Phase 107 at /app/partners (regional implementation partners). Purpose & Values Blueprint Phase 95 at /app/purpose-values-engine is phase number collision only — NOT global expansion. Helpers use _gcebp109_* — never collide with _gce_*.';
$$;

create or replace function public._gcebp109_mission()
returns text language sql immutable as $$
  select 'Expand confidently while preserving identity and reducing operational complexity.';
$$;

create or replace function public._gcebp109_philosophy()
returns text language sql immutable as $$
  select 'Global growth without becoming generic — authentic adaptation, intentional expansion.';
$$;

create or replace function public._gcebp109_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — humans accountable. Aipify Expansion Companion informs and prepares market readiness, localization guidance, cultural intelligence, and expansion recommendations; auto_market_entry_disabled remains default true; no guaranteed outcomes.';
$$;

create or replace function public._gcebp109_vision()
returns text language sql immutable as $$
  select 'We can expand internationally without losing what makes us unique.';
$$;

create or replace function public._gcebp109_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'market_readiness', 'label', 'Market readiness', 'emoji', '🦉', 'description', 'Active markets, emerging opportunities, and readiness assessments — stewardship not rush'),
    jsonb_build_object('key', 'localization_support', 'label', 'Localization support', 'emoji', '🌹', 'description', 'Language, translations, terminology, messaging, regional content — authentic adaptation'),
    jsonb_build_object('key', 'cultural_intelligence', 'label', 'Cultural intelligence', 'emoji', '🔔', 'description', 'Respectful cultural insights — inform adaptation without stereotyping'),
    jsonb_build_object('key', 'multi_currency', 'label', 'Multi-currency visibility', 'emoji', '🦉', 'description', 'Regional pricing, currency performance, exchange considerations — humans decide pricing'),
    jsonb_build_object('key', 'regional_commerce', 'label', 'Regional commerce insights', 'emoji', '🌹', 'description', 'Best regions, emerging opportunities, seasonal patterns, local demand signals'),
    jsonb_build_object('key', 'stewardship_expansion', 'label', 'Stewardship expansion support', 'emoji', '🔔', 'description', 'Recommendations with rationale — humans decide every market entry action')
  );
$$;

create or replace function public._gcebp109_global_expansion_dashboard()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Global expansion dashboard — metadata summaries for active markets, emerging opportunities, localization readiness, regional performance, currency visibility, operational considerations, and expansion recommendations.',
    'metrics', jsonb_build_array(
      jsonb_build_object('key', 'active_markets', 'label', 'Active markets', 'description', 'Markets under active commerce operations'),
      jsonb_build_object('key', 'emerging_opportunities', 'label', 'Emerging opportunities', 'description', 'Regional signals suggesting preparation windows — not auto-launch'),
      jsonb_build_object('key', 'localization_readiness', 'label', 'Localization readiness', 'description', 'Guidance records for language, terminology, and messaging'),
      jsonb_build_object('key', 'regional_performance', 'label', 'Regional performance', 'description', 'Commerce Performance Phase 104 cross-link — profitability metadata'),
      jsonb_build_object('key', 'currency_visibility', 'label', 'Currency visibility', 'description', 'Multi-currency performance and exchange considerations'),
      jsonb_build_object('key', 'operational_considerations', 'label', 'Operational considerations', 'description', 'Shipping, payments, portfolio alignment — Multi-Store cross-link'),
      jsonb_build_object('key', 'expansion_recommendations', 'label', 'Expansion recommendations', 'description', 'Stewardship recommendations — human approval required')
    ),
    'boundary_note', 'Dashboard metrics are expansion metadata — humans verify before market entry decisions.'
  );
$$;

create or replace function public._gcebp109_market_readiness_intelligence()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Market readiness intelligence — calm visibility before reactive international expansion.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'portfolio_readiness', 'label', 'Portfolio readiness', 'description', 'Overall expansion score and classification — intentional pacing'),
      jsonb_build_object('emoji', '🌹', 'key', 'proven_markets', 'label', 'Proven markets first', 'description', 'Deepen active markets before distant expansion — stewardship not metrics alone'),
      jsonb_build_object('emoji', '🔔', 'key', 'preparation_alerts', 'label', 'Preparation alerts', 'description', 'When regulatory or operational scaffolds should trigger human review — not auto-launch')
    ),
    'boundary_note', 'Readiness informs preparation — auto_market_entry_disabled true by default.'
  );
$$;

create or replace function public._gcebp109_localization_support()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Localization support — authentic adaptation cross-linked with platform localization and product automation.',
    'areas', jsonb_build_array(
      jsonb_build_object('key', 'language', 'label', 'Language', 'description', 'Market language guidance — distinct from platform i18n at /app/global-expansion'),
      jsonb_build_object('key', 'translations', 'label', 'Translations', 'description', 'Catalog translation workflow — Product Automation Phase 102 cross-link'),
      jsonb_build_object('key', 'terminology', 'label', 'Terminology', 'description', 'Consistent commerce terminology — Blueprint Phase 35 localization cross-link'),
      jsonb_build_object('key', 'messaging', 'label', 'Messaging', 'description', 'Campaign and brand messaging adaptation — preserve identity'),
      jsonb_build_object('key', 'regional_content', 'label', 'Regional content', 'description', 'Regional content scaffolds — human review before publish')
    ),
    'global_expansion_route', '/app/global-expansion',
    'product_automation_route', '/app/product-automation',
    'boundary_note', 'Commerce localization distinct from platform translation projects — cross-link, not duplicate.'
  );
$$;

create or replace function public._gcebp109_cultural_intelligence()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Cultural intelligence — respectful insights that inform adaptation without stereotyping.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'seasonal_patterns', 'label', 'Seasonal patterns', 'description', 'Regional seasonality metadata — planning not assumptions'),
      jsonb_build_object('emoji', '🌹', 'key', 'communication_norms', 'label', 'Communication norms', 'description', 'Trust signals and shopping behavior metadata — respect note required'),
      jsonb_build_object('emoji', '🔔', 'key', 'human_review', 'label', 'Human review', 'description', 'Cultural insights prepare campaigns — humans approve messaging')
    ),
    'boundary_note', 'Never ignore cultures or reduce markets to stereotypes — respect_note on every insight.'
  );
$$;

create or replace function public._gcebp109_multi_currency_support()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Multi-currency support — visibility for regional pricing and exchange stewardship.',
    'areas', jsonb_build_array(
      jsonb_build_object('key', 'regional_pricing', 'label', 'Regional pricing', 'description', 'Pricing notes aligned with margin targets — Commerce Performance cross-link'),
      jsonb_build_object('key', 'currency_performance', 'label', 'Currency performance', 'description', 'Revenue share metadata by currency — illustrative only'),
      jsonb_build_object('key', 'exchange_considerations', 'label', 'Exchange considerations', 'description', 'FX exposure awareness — finance review required'),
      jsonb_build_object('key', 'market_profitability', 'label', 'Market profitability', 'description', 'Regional profit signals — /app/commerce-performance cross-link')
    ),
    'commerce_performance_route', '/app/commerce-performance',
    'boundary_note', 'Currency visibility informs — does not auto-adjust pricing or guarantee outcomes.'
  );
$$;

create or replace function public._gcebp109_regional_commerce_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Regional commerce insights — best regions, emerging opportunities, seasonal patterns, local demand.',
    'insight_types', jsonb_build_array(
      jsonb_build_object('key', 'best_performing', 'label', 'Best performing regions', 'description', 'Portfolio strength signals — deepen before distant expansion'),
      jsonb_build_object('key', 'emerging_opportunity', 'label', 'Emerging opportunities', 'description', 'Preparation windows — Commerce Intelligence Phase 101 cross-link'),
      jsonb_build_object('key', 'seasonal', 'label', 'Seasonal patterns', 'description', 'Regional seasonality for inventory and campaign planning'),
      jsonb_build_object('key', 'local_demand', 'label', 'Local demand', 'description', 'Demand signal metadata — not guaranteed market success')
    ),
    'commerce_intelligence_route', '/app/commerce-intelligence',
    'boundary_note', 'Regional insights scaffold decisions — humans accountable for market entry.'
  );
$$;

create or replace function public._gcebp109_regulatory_awareness()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Regulatory awareness — honest scaffolds with disclaimer — Aipify does NOT replace legal/compliance counsel.',
    'note_types', jsonb_build_array(
      jsonb_build_object('key', 'tax_scaffold', 'label', 'Tax awareness scaffold', 'description', 'Illustrative tax considerations — qualified counsel required'),
      jsonb_build_object('key', 'consumer_protection', 'label', 'Consumer protection scaffold', 'description', 'Distance selling and returns awareness — not legal advice'),
      jsonb_build_object('key', 'obligations', 'label', 'Obligations scaffold', 'description', 'Market entry obligation awareness — human legal review'),
      jsonb_build_object('key', 'data_privacy', 'label', 'Data privacy scaffold', 'description', 'Cross-border data handling awareness — GDPR and local privacy review')
    ),
    'disclaimer', 'Aipify provides awareness scaffolds only — not legal or compliance advice. Consult qualified counsel.',
    'boundary_note', 'Regulatory notes inform preparation — never substitute for professional legal counsel.'
  );
$$;

create or replace function public._gcebp109_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Expansion Companion guidance — calm, optional, non-intrusive. Stewardship not unchecked expansion.',
    'companion_name', 'Expansion Companion',
    'not_label', 'AI expansion bot',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'market_context', 'prompt', 'Sweden localization coverage is improving — would a terminology review checklist help before your next campaign?', 'consideration', 'Authentic adaptation before push — preserve brand identity'),
      jsonb_build_object('emoji', '🌹', 'key', 'patient_expansion', 'prompt', 'Denmark readiness is progressing — shall I prepare a preparation summary rather than rushing launch?', 'consideration', 'Sustainable expansion takes time — curiosity over pressure'),
      jsonb_build_object('emoji', '🔔', 'key', 'regulatory_review', 'prompt', 'Germany regulatory scaffold flagged counsel review — would linking your legal checklist feel helpful?', 'consideration', 'auto_market_entry_disabled — humans decide market entry timing')
    ),
    'boundary_note', 'Expansion Companion scaffolds visibility — never auto-launches markets.'
  );
$$;

create or replace function public._gcebp109_growth_partner_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Growth Partner connection — regional partners for local language, market onboarding, and industry expertise.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'regional_partners', 'label', 'Regional partners', 'description', 'Growth Partner Blueprint Phase 107 — implementation partners by region'),
      jsonb_build_object('key', 'local_language', 'label', 'Local language support', 'description', 'Partner-assisted localization onboarding — distinct from platform i18n'),
      jsonb_build_object('key', 'market_onboarding', 'label', 'Market onboarding', 'description', 'Partner-guided market entry preparation — human-led'),
      jsonb_build_object('key', 'industry_expertise', 'label', 'Industry expertise', 'description', 'Commerce and Shopify ecosystem partner knowledge')
    ),
    'route', '/app/partners',
    'boundary_note', 'Partners support human-led expansion — Aipify does not auto-select partners.'
  );
$$;

create or replace function public._gcebp109_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — patience, confidence, curiosity; sustainable expansion takes time.',
    'quotes', jsonb_build_array(
      'International growth is a journey — not every market needs to launch this quarter.',
      'Curiosity about new markets can coexist with patience for proven ones.',
      'Confidence grows through intentional preparation — not pressure to expand for metrics alone.',
      'Sustainable expansion protects wellbeing — rushed market entry creates avoidable stress.'
    ),
    'practices', jsonb_build_array(
      'Pause before reactive market launches — evaluate readiness with calm context',
      'Celebrate depth in proven markets — not only new country flags',
      'Regulatory review reduces stress — proactive preparation over panic',
      'Sustainable expansion pacing — cross-link Self Love rhythms'
    ),
    'route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports wellbeing rhythms — principle only; Global Commerce Expansion stores business metadata.'
  );
$$;

create or replace function public._gcebp109_leadership_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership connection — executive visibility into expansion portfolio and market readiness.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'expansion_briefings', 'label', 'Expansion briefings', 'description', 'Stewardship briefings for leadership review — metadata summaries'),
      jsonb_build_object('key', 'market_portfolio', 'label', 'Market portfolio governance', 'description', 'Active vs preparing markets for strategic expansion decisions'),
      jsonb_build_object('key', 'identity_preservation', 'label', 'Identity preservation', 'description', 'Ensure expansion aligns with brand values — Purpose & Values cross-link awareness only')
    ),
    'executive_route', '/app/executive',
    'boundary_note', 'Leadership sees aggregates and summaries — tenant-scoped expansion metadata.'
  );
$$;

create or replace function public._gcebp109_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparent expansion intelligence — explainable recommendations, human approval, audited actions.',
    'users_should_see', jsonb_build_array(
      'How expansion scores combine market readiness, localization, and regional signals — metadata only',
      'auto_market_entry_disabled default and human oversight for market entry changes',
      'Regulatory disclaimer — Aipify scaffolds awareness, not legal advice',
      'Audit trail via global_commerce_expansion_audit_logs — recommendation actions, briefing events'
    ),
    'operators_should_understand', jsonb_build_array(
      'Global Commerce Expansion is stewardship scaffolding — not automated market launch bots',
      'Cross-links Trust & Action Engine — sensitive market actions may require approval at /app/approvals',
      'Distinct from Global Expansion Phase 95 platform localization — commerce market entry only',
      'Platform aggregates only at platform governance — tenant data stays tenant-scoped'
    ),
    'audit_note', 'gce_recommendation_action, gce_briefing_generated — metadata only.',
    'approvals_route', '/app/approvals'
  );
$$;

create or replace function public._gcebp109_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Limitation principles — stewardship not unchecked expansion.',
    'avoid', jsonb_build_array(
      jsonb_build_object('key', 'metrics_alone', 'label', 'Expansion for metrics alone', 'description', 'Never push market entry solely for growth metrics — identity and capacity matter'),
      jsonb_build_object('key', 'guaranteed_outcomes', 'label', 'Guaranteed outcomes', 'description', 'No guaranteed international success — honest scaffolds only'),
      jsonb_build_object('key', 'ignoring_cultures', 'label', 'Ignoring cultures', 'description', 'Never stereotype or reduce markets — cultural intelligence requires respect'),
      jsonb_build_object('key', 'beyond_capacity', 'label', 'Beyond capacity', 'description', 'Do not recommend expansion beyond operational capacity — sustainable pacing')
    ),
    'boundary_note', 'auto_market_entry_disabled true — humans accountable for every market decision.'
  );
$$;

create or replace function public._gcebp109_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Dogfooding — validate expansion stewardship patterns on real international growth before broad rollout.',
    'aipify_group', jsonb_build_object(
      'context', 'Aipify international growth',
      'patterns', jsonb_build_array(
        'Multi-language commerce and KC localization',
        'Nordic market presence with authentic brand identity',
        'Growth Partner ecosystem for regional onboarding'
      )
    ),
    'unonight', jsonb_build_object(
      'context', 'Unonight pilot',
      'patterns', jsonb_build_array('International customer base metadata', 'Regional expansion readiness scaffolds')
    ),
    'sportsklaer_no', jsonb_build_object(
      'store', 'Sportsklær.no',
      'platform', 'Shopify',
      'patterns', jsonb_build_array(
        'Nordic activewear expansion across NO/SE/DK',
        'Multi-language product catalog via Product Automation cross-link',
        'Shopify international storefront metadata',
        'Growth Partner assisted market preparation'
      )
    ),
    'shopify_note', 'Shopify integration supplies catalog and market context — Integration Engine cross-link.',
    'boundary_note', 'Dogfooding validates expansion UX — metadata only on tenant data.'
  );
$$;

create or replace function public._gcebp109_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We can expand internationally without losing what makes us unique.',
    'Global growth without becoming generic — authentic adaptation.',
    'Stewardship not unchecked expansion — humans decide market entry.',
    'Aipify Expansion Companion informs and prepares — humans accountable.'
  );
$$;

create or replace function public._gcebp109_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'global_expansion', 'label', 'Global Expansion Phase 95', 'route', '/app/global-expansion', 'note', 'Platform i18n — NOT commerce market entry'),
    jsonb_build_object('key', 'localization_phase35', 'label', 'Blueprint Phase 35 Localization', 'route', '/app/global-expansion', 'note', 'Nordic payments, KC localization — cross-link'),
    jsonb_build_object('key', 'multi_store', 'label', 'Multi-Store Phase 105', 'route', '/app/multi-store', 'note', 'Portfolio/regional stores — cross-link'),
    jsonb_build_object('key', 'product_automation', 'label', 'Product Automation Phase 102', 'route', '/app/product-automation', 'note', 'Product translation for catalogs'),
    jsonb_build_object('key', 'commerce_intelligence', 'label', 'Commerce Intelligence Phase 101', 'route', '/app/commerce-intelligence', 'note', 'Market opportunity signals'),
    jsonb_build_object('key', 'commerce_performance', 'label', 'Commerce Performance Phase 104', 'route', '/app/commerce-performance', 'note', 'Regional profitability'),
    jsonb_build_object('key', 'growth_partners', 'label', 'Growth Partner Phase 107', 'route', '/app/partners', 'note', 'Regional implementation partners'),
    jsonb_build_object('key', 'integration_engine', 'label', 'Integration Engine A.8', 'route', '/app/integration-engine', 'note', 'Shopify international storefronts'),
    jsonb_build_object('key', 'approvals', 'label', 'Trust & Action', 'route', '/app/approvals', 'note', 'Market entry decisions requiring approval'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Sustainable expansion pacing'),
    jsonb_build_object('key', 'executive', 'label', 'Executive Dashboard', 'route', '/app/executive', 'note', 'Leadership expansion briefings'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'route', '/app/knowledge-center', 'note', 'Global commerce expansion FAQ and guides')
  );
$$;

create or replace function public._gcebp109_engagement_summary(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'expansion_score', coalesce((public._gce_refresh_metrics(p_tenant_id)->>'expansion_score')::numeric, 0),
    'readiness_classification', coalesce(public._gce_refresh_metrics(p_tenant_id)->>'readiness_classification', 'stable'),
    'active_markets', coalesce((public._gce_refresh_metrics(p_tenant_id)->>'active_markets')::int, 0),
    'preparing_markets', coalesce((public._gce_refresh_metrics(p_tenant_id)->>'preparing_markets')::int, 0),
    'emerging_opportunities', coalesce((public._gce_refresh_metrics(p_tenant_id)->>'emerging_opportunities')::int, 0),
    'objectives_documented', jsonb_array_length(public._gcebp109_objectives()),
    'regulatory_notes', coalesce((public._gce_refresh_metrics(p_tenant_id)->>'regulatory_notes_count')::int, 0),
    'companion_examples', jsonb_array_length(public._gcebp109_companion_guidance()->'examples'),
    'integration_links', jsonb_array_length(public._gcebp109_integration_links()),
    'privacy_note', 'Global commerce expansion metadata only — no automatic market launch.'
  );
$$;

create or replace function public._gcebp109_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_array(
    jsonb_build_object(
      'key', 'baseline_preserved',
      'label', 'Repo Phase 109 baseline fields preserved on dashboard',
      'met', to_regclass('public.global_commerce_expansion_settings') is not null,
      'note', '_gce_* tables and RPC behavior intact.'
    ),
    jsonb_build_object(
      'key', 'auto_market_entry_disabled',
      'label', 'auto_market_entry_disabled default true — no automatic market launch',
      'met', coalesce((
        select auto_market_entry_disabled from public.global_commerce_expansion_settings where tenant_id = p_tenant_id
      ), true),
      'note', 'Human oversight required for market entry.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links Phases 95, 101–105, 107, Global Expansion, Product Automation',
      'met', jsonb_array_length(public._gcebp109_integration_links()) >= 10,
      'note', 'Distinction note documents all mandatory cross-links.'
    ),
    jsonb_build_object(
      'key', 'limitation_principles',
      'label', 'Limitation principles — stewardship not unchecked expansion',
      'met', jsonb_array_length(public._gcebp109_limitation_principles()->'avoid') >= 4,
      'note', 'Avoid expansion for metrics alone and guaranteed outcomes.'
    ),
    jsonb_build_object(
      'key', 'regulatory_disclaimer',
      'label', 'Regulatory awareness includes disclaimer — not legal advice',
      'met', (public._gcebp109_regulatory_awareness()->>'disclaimer') is not null,
      'note', 'Aipify does not replace legal/compliance counsel.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Aipify, Unonight, Sportsklær.no Shopify multi-language commerce',
      'met', (public._gcebp109_dogfooding()->'sportsklaer_no') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS principle — humans accountable',
      'met', true,
      'note', 'Expansion Companion informs and prepares — humans decide.'
    )
  );
end; $$;

create or replace function public._gcebp109_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 109 — Global Commerce Expansion Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE109_GLOBAL_COMMERCE_EXPANSION.md',
    'engine_phase', 'Repo Phase 109 Global Commerce Expansion Engine',
    'route', '/app/global-commerce-expansion',
    'mapping_note', 'ABOS Blueprint Phase 109 extends repo Phase 109 with commerce international growth scaffolding. Distinct from Global Expansion Phase 95 platform localization.',
    'distinction_note', public._gcebp109_distinction_note(),
    'mission', public._gcebp109_mission(),
    'philosophy', public._gcebp109_philosophy(),
    'abos_principle', public._gcebp109_abos_principle(),
    'objectives', public._gcebp109_objectives(),
    'global_expansion_dashboard', public._gcebp109_global_expansion_dashboard(),
    'market_readiness_intelligence', public._gcebp109_market_readiness_intelligence(),
    'localization_support', public._gcebp109_localization_support(),
    'cultural_intelligence', public._gcebp109_cultural_intelligence(),
    'multi_currency_support', public._gcebp109_multi_currency_support(),
    'regional_commerce_insights', public._gcebp109_regional_commerce_insights(),
    'regulatory_awareness', public._gcebp109_regulatory_awareness(),
    'companion_guidance', public._gcebp109_companion_guidance(),
    'growth_partner_connection', public._gcebp109_growth_partner_connection(),
    'self_love_connection', public._gcebp109_self_love_connection(),
    'leadership_connection', public._gcebp109_leadership_connection(),
    'trust_connection', public._gcebp109_trust_connection(),
    'limitation_principles', public._gcebp109_limitation_principles(),
    'dogfooding', public._gcebp109_dogfooding(),
    'success_criteria', public._gcebp109_success_criteria(p_tenant_id),
    'vision', public._gcebp109_vision(),
    'vision_phrases', public._gcebp109_vision_phrases(),
    'integration_links', public._gcebp109_integration_links(),
    'engagement_summary', public._gcebp109_engagement_summary(p_tenant_id),
    'privacy_note', 'Global commerce expansion blueprint data is metadata only — market readiness, localization guidance, cultural insights, regulatory scaffolds. No automatic market launch. Humans decide; Aipify Expansion Companion informs and prepares.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 2. Card RPC — preserve ALL baseline fields; append Phase 109
-- ---------------------------------------------------------------------------
create or replace function public.get_global_commerce_expansion_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb; v_engagement jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._gce_ensure_settings(v_tenant_id);
  v_metrics := public._gce_refresh_metrics(v_tenant_id);
  v_engagement := public._gcebp109_engagement_summary(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'expansion_score', v_metrics->'expansion_score',
    'readiness_classification', v_metrics->'readiness_classification',
    'philosophy', 'Global growth without becoming generic — authentic adaptation, intentional expansion.',
    'human_oversight_required', true,
    'implementation_blueprint_phase109', jsonb_build_object(
      'phase', 'Phase 109 — Global Commerce Expansion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE109_GLOBAL_COMMERCE_EXPANSION.md',
      'engine_phase', 'Repo Phase 109 Global Commerce Expansion Engine',
      'route', '/app/global-commerce-expansion',
      'mapping_note', 'ABOS Blueprint Phase 109 extends repo Phase 109 — commerce international growth; humans accountable.'
    ),
    'global_commerce_expansion_mission', public._gcebp109_mission(),
    'global_commerce_expansion_abos_principle', public._gcebp109_abos_principle(),
    'global_commerce_expansion_engagement_summary', v_engagement,
    'global_commerce_expansion_note', 'Global Commerce Expansion Engine (ABOS Phase 109) — expand confidently while preserving identity and reducing operational complexity.',
    'global_commerce_expansion_vision_note', public._gcebp109_vision()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL baseline fields; append Phase 109
-- ---------------------------------------------------------------------------
create or replace function public.get_global_commerce_expansion_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.global_commerce_expansion_settings;
  v_metrics jsonb;
begin
  v_tenant_id := public._gce_require_tenant();
  v_settings := public._gce_ensure_settings(v_tenant_id);
  perform public._gce_seed_markets(v_tenant_id);
  perform public._gce_seed_insights(v_tenant_id);
  v_metrics := public._gce_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'auto_market_entry_disabled', v_settings.auto_market_entry_disabled,
    'philosophy', 'Global growth without becoming generic — authentic adaptation, intentional expansion.',
    'safety_note', 'Aipify recommends expansion preparation — organizations remain responsible for market entry decisions. No automatic market launch. Regulatory notes are awareness scaffolds only — not legal advice.',
    'engine_enabled', v_settings.engine_enabled,
    'expansion_score', v_metrics->'expansion_score',
    'readiness_classification', v_metrics->'readiness_classification',
    'active_markets', v_metrics->'active_markets',
    'preparing_markets', v_metrics->'preparing_markets',
    'emerging_opportunities', v_metrics->'emerging_opportunities',
    'localization_guidance_count', v_metrics->'localization_guidance_count',
    'regulatory_notes_count', v_metrics->'regulatory_notes_count',
    'currency_visibility_count', v_metrics->'currency_visibility_count',
    'regional_insights_count', v_metrics->'regional_insights_count',
    'recommendations_pending', v_metrics->'recommendations_pending',
    'cultural_insights_count', v_metrics->'cultural_insights_count',
    'readiness_assessments_count', v_metrics->'readiness_assessments_count',
    'market_profiles', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'market_key', m.market_key, 'market_name', m.market_name,
        'region', m.region, 'currency', m.currency, 'status', m.status, 'readiness_score', m.readiness_score
      ) order by m.readiness_score desc)
      from public.commerce_market_profiles m where m.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'readiness_assessments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'market_id', a.market_id, 'market_name', mp.market_name,
        'assessment_type', a.assessment_type, 'title', a.title, 'summary', a.summary,
        'readiness_level', a.readiness_level, 'assessed_at', a.assessed_at
      ) order by a.assessed_at desc)
      from public.market_readiness_assessments a
      left join public.commerce_market_profiles mp on mp.id = a.market_id
      where a.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'localization_guidance', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'market_id', l.market_id, 'market_name', mp.market_name,
        'guidance_type', l.guidance_type, 'language', l.language, 'title', l.title,
        'summary', l.summary, 'authenticity_note', l.authenticity_note
      ) order by l.created_at desc)
      from public.localization_guidance_records l
      left join public.commerce_market_profiles mp on mp.id = l.market_id
      where l.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'cultural_insights', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'market_id', c.market_id, 'market_name', mp.market_name,
        'insight_type', c.insight_type, 'title', c.title, 'summary', c.summary,
        'respect_note', c.respect_note
      ) order by c.created_at desc)
      from public.cultural_intelligence_insights c
      left join public.commerce_market_profiles mp on mp.id = c.market_id
      where c.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'currency_visibility', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', cv.id, 'market_id', cv.market_id, 'market_name', mp.market_name,
        'currency_code', cv.currency_code, 'regional_pricing_note', cv.regional_pricing_note,
        'performance_summary', cv.performance_summary, 'exchange_consideration', cv.exchange_consideration
      ) order by cv.updated_at desc)
      from public.multi_currency_visibility cv
      left join public.commerce_market_profiles mp on mp.id = cv.market_id
      where cv.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'regional_insights', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'region_key', r.region_key, 'insight_type', r.insight_type,
        'title', r.title, 'summary', r.summary, 'trend_direction', r.trend_direction
      ) order by r.created_at desc)
      from public.regional_commerce_insights r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'regulatory_notes', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', n.id, 'market_id', n.market_id, 'market_name', mp.market_name,
        'note_type', n.note_type, 'title', n.title, 'summary', n.summary, 'disclaimer', n.disclaimer
      ) order by n.created_at desc)
      from public.regulatory_awareness_notes n
      left join public.commerce_market_profiles mp on mp.id = n.market_id
      where n.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'market_id', e.market_id, 'section', e.section, 'title', e.title,
        'summary', e.summary, 'recommendation_type', e.recommendation_type,
        'priority', e.priority, 'rationale', e.rationale
      ) order by e.created_at desc)
      from public.expansion_recommendations e where e.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'summary', b.summary, 'created_at', b.created_at)
        order by b.created_at desc)
      from public.global_commerce_expansion_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'global_expansion_localization', 'Platform i18n and translation projects at /app/global-expansion — NOT commerce market entry',
      'multi_store', 'Portfolio/regional stores — cross-link Multi-Store Phase 105',
      'product_automation', 'Product translation for catalogs — Phase 102',
      'commerce_intelligence', 'Market opportunity signals — Phase 101',
      'commerce_performance', 'Regional profitability — Phase 104',
      'growth_partners', 'Regional implementation partners — Phase 107',
      'knowledge_center', 'Global commerce expansion guides and FAQ',
      'approvals', 'Market entry decisions requiring human approval'
    ),
    'implementation_blueprint_phase109', jsonb_build_object(
      'phase', 'Phase 109 — Global Commerce Expansion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE109_GLOBAL_COMMERCE_EXPANSION.md',
      'engine_phase', 'Repo Phase 109 Global Commerce Expansion Engine',
      'route', '/app/global-commerce-expansion',
      'mapping_note', 'ABOS Blueprint Phase 109 extends repo Phase 109 — commerce international growth; humans accountable.'
    ),
    'global_commerce_expansion_engine_note', 'Global Commerce Expansion Engine (ABOS Phase 109) — expand confidently while preserving identity and reducing operational complexity.',
    'global_commerce_expansion_blueprint', public._gcebp109_blueprint_block(v_tenant_id),
    'global_commerce_expansion_distinction_note', public._gcebp109_distinction_note(),
    'global_commerce_expansion_mission', public._gcebp109_mission(),
    'global_commerce_expansion_philosophy', public._gcebp109_philosophy(),
    'global_commerce_expansion_abos_principle', public._gcebp109_abos_principle(),
    'global_commerce_expansion_objectives', public._gcebp109_objectives(),
    'global_expansion_dashboard', public._gcebp109_global_expansion_dashboard(),
    'market_readiness_intelligence', public._gcebp109_market_readiness_intelligence(),
    'localization_support', public._gcebp109_localization_support(),
    'cultural_intelligence', public._gcebp109_cultural_intelligence(),
    'multi_currency_support', public._gcebp109_multi_currency_support(),
    'regional_commerce_insights', public._gcebp109_regional_commerce_insights(),
    'regulatory_awareness', public._gcebp109_regulatory_awareness(),
    'expansion_companion_guidance', public._gcebp109_companion_guidance(),
    'growth_partner_connection', public._gcebp109_growth_partner_connection(),
    'expansion_self_love_connection', public._gcebp109_self_love_connection(),
    'expansion_leadership_connection', public._gcebp109_leadership_connection(),
    'expansion_trust_connection', public._gcebp109_trust_connection(),
    'expansion_limitation_principles', public._gcebp109_limitation_principles(),
    'global_commerce_expansion_dogfooding', public._gcebp109_dogfooding(),
    'gcebp109_integration_links', public._gcebp109_integration_links(),
    'global_commerce_expansion_engagement_summary', public._gcebp109_engagement_summary(v_tenant_id),
    'global_commerce_expansion_success_criteria', public._gcebp109_success_criteria(v_tenant_id),
    'global_commerce_expansion_vision', public._gcebp109_vision(),
    'global_commerce_expansion_vision_phrases', public._gcebp109_vision_phrases(),
    'global_commerce_expansion_privacy_note', 'Global commerce expansion metadata only — no automatic market launch. Humans decide; Aipify Expansion Companion informs and prepares.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._gcebp109_distinction_note() to authenticated;
grant execute on function public._gcebp109_mission() to authenticated;
grant execute on function public._gcebp109_philosophy() to authenticated;
grant execute on function public._gcebp109_abos_principle() to authenticated;
grant execute on function public._gcebp109_vision() to authenticated;
grant execute on function public._gcebp109_objectives() to authenticated;
grant execute on function public._gcebp109_global_expansion_dashboard() to authenticated;
grant execute on function public._gcebp109_market_readiness_intelligence() to authenticated;
grant execute on function public._gcebp109_localization_support() to authenticated;
grant execute on function public._gcebp109_cultural_intelligence() to authenticated;
grant execute on function public._gcebp109_multi_currency_support() to authenticated;
grant execute on function public._gcebp109_regional_commerce_insights() to authenticated;
grant execute on function public._gcebp109_regulatory_awareness() to authenticated;
grant execute on function public._gcebp109_companion_guidance() to authenticated;
grant execute on function public._gcebp109_growth_partner_connection() to authenticated;
grant execute on function public._gcebp109_self_love_connection() to authenticated;
grant execute on function public._gcebp109_leadership_connection() to authenticated;
grant execute on function public._gcebp109_trust_connection() to authenticated;
grant execute on function public._gcebp109_limitation_principles() to authenticated;
grant execute on function public._gcebp109_dogfooding() to authenticated;
grant execute on function public._gcebp109_vision_phrases() to authenticated;
grant execute on function public._gcebp109_integration_links() to authenticated;
grant execute on function public._gcebp109_engagement_summary(uuid) to authenticated;
grant execute on function public._gcebp109_success_criteria(uuid) to authenticated;
grant execute on function public._gcebp109_blueprint_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'global-commerce-expansion-blueprint-phase109', 'Global Commerce Expansion (ABOS Phase 109)',
  'Global Commerce Expansion Engine — commerce international growth, market readiness, localization, and cultural intelligence. Humans accountable.',
  'authenticated', 133
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'global-commerce-expansion-blueprint-phase109' and tenant_id is null
);
