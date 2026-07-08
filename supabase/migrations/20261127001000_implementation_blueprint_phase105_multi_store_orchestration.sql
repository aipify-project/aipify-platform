-- Implementation Blueprint Phase 105 — Multi-Store Orchestration Engine
-- Extends Multi-Store Orchestration Engine repo Phase 105. No new tables.
-- Distinct from Commerce Intelligence Blueprint Phase 101 at /app/commerce-intelligence.
-- Distinct from Product Automation Blueprint Phase 102 at /app/product-automation.
-- Distinct from Dropshipping Operations Blueprint Phase 103 at /app/dropshipping-operations.
-- Distinct from Commerce Performance & Profit repo Phase 104 at /app/commerce-performance.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._msobp105_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 105 — Multi-Store Orchestration Engine at /app/multi-store. Extends Multi-Store Orchestration Engine repo Phase 105 (_mso_*) and preserves ALL baseline dashboard and card fields including auto_sync_disabled — no automatic product synchronization. Distinct from Commerce Intelligence Blueprint Phase 101 at /app/commerce-intelligence (discovery cross-link). Distinct from Product Automation Blueprint Phase 102 at /app/product-automation (distribute/localize workflow cross-link). Distinct from Dropshipping Operations Blueprint Phase 103 at /app/dropshipping-operations (operational cross-link). Distinct from Commerce Performance & Profit repo Phase 104 at /app/commerce-performance (portfolio profit cross-link). Cross-links Integration Engine, Platform Install Phase 100, Workflow Orchestration Phase 86, Trust & Action (/app/approvals). Helpers use _msobp105_* — never collide with _mso_*.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._msobp105_mission()
returns text language sql immutable as $$
  select 'Centralized intelligence and orchestration across multiple stores — simplify complexity, scale confidently.';
$$;

create or replace function public._msobp105_philosophy()
returns text language sql immutable as $$
  select 'Growth creates complexity but not confusion — preserve brand individuality; wisdom guides expansion.';
$$;

create or replace function public._msobp105_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — portfolio authority retained. Aipify Portfolio Companion informs and prepares cross-store intelligence, unified reporting, and selective publish guidance; humans approve every sync and publish. auto_sync_disabled remains default true.';
$$;

create or replace function public._msobp105_vision()
returns text language sql immutable as $$
  select 'We have complete visibility across our entire commerce ecosystem.';
$$;

create or replace function public._msobp105_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'centralized_oversight', 'label', 'Centralized oversight', 'emoji', '🦉', 'description', 'Executive portfolio visibility — revenue, profit, alerts, and store health across all connected stores'),
    jsonb_build_object('key', 'cross_store_intelligence', 'label', 'Cross-store intelligence', 'emoji', '🌹', 'description', 'Shared opportunities, category replication, regional demand, and cross-brand learning'),
    jsonb_build_object('key', 'unified_reporting', 'label', 'Unified reporting', 'emoji', '🔔', 'description', 'Store-by-store performance, top global products, supplier dependencies, and operational alerts'),
    jsonb_build_object('key', 'brand_flexibility', 'label', 'Brand flexibility', 'emoji', '🦉', 'description', 'Preserve brand individuality — selective publish, localized descriptions, and market-specific pricing'),
    jsonb_build_object('key', 'operational_efficiency', 'label', 'Operational efficiency', 'emoji', '🌹', 'description', 'Governance coordination, approval alignment, and operational best-practice sharing'),
    jsonb_build_object('key', 'strategic_scalability', 'label', 'Strategic scalability', 'emoji', '🔔', 'description', 'Regional expansion readiness, expansion alignment, and manageable complexity at scale')
  );
$$;

create or replace function public._msobp105_supported_environments()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Supported environments — connected store platforms and regional storefronts via Integration Engine and Platform Install.',
    'platforms', jsonb_build_array(
      jsonb_build_object('key', 'shopify', 'label', 'Shopify', 'route', '/app/platform-install', 'description', 'Shopify store connections — catalog, orders, and install health metadata'),
      jsonb_build_object('key', 'woocommerce', 'label', 'WooCommerce', 'route', '/app/integration-engine', 'description', 'WordPress/WooCommerce connector — regional and brand-specific stores'),
      jsonb_build_object('key', 'future_integrations', 'label', 'Future integrations', 'description', 'Scaffold for additional commerce platforms — approved connectors only'),
      jsonb_build_object('key', 'regional_storefronts', 'label', 'Regional storefronts', 'description', 'Country and region-specific stores — localization and market pricing flexibility'),
      jsonb_build_object('key', 'brand_specific_stores', 'label', 'Brand-specific stores', 'description', 'Multi-brand portfolios — preserve brand individuality while sharing intelligence')
    ),
    'integration_engine_route', '/app/integration-engine',
    'platform_install_route', '/app/platform-install',
    'boundary_note', 'Environment metadata only — tenant-scoped store connections; no cross-tenant portfolio data.'
  );
$$;

create or replace function public._msobp105_executive_commerce_dashboard()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive commerce dashboard — portfolio-level visibility for leadership without replacing store-level autonomy.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'total_revenue_profit', 'label', 'Total revenue and profit', 'description', 'Combined portfolio revenue and average profit margin across connected stores'),
      jsonb_build_object('key', 'store_by_store_performance', 'label', 'Store-by-store performance', 'description', 'Individual store scores, status levels, and revenue contribution'),
      jsonb_build_object('key', 'top_global_products', 'label', 'Top global products', 'description', 'Cross-store product performers and replication opportunities'),
      jsonb_build_object('key', 'regional_opportunities', 'label', 'Regional opportunities', 'description', 'Expansion readiness and regional demand signals'),
      jsonb_build_object('key', 'supplier_dependencies', 'label', 'Supplier dependencies', 'description', 'Shared supplier relationships and operational practices across stores'),
      jsonb_build_object('key', 'operational_alerts', 'label', 'Operational alerts', 'description', 'Stores needing attention, governance gaps, and portfolio notifications')
    ),
    'executive_report_rpc', 'generate_executive_portfolio_report()',
    'boundary_note', 'Executive summaries are metadata aggregates — humans decide portfolio actions.'
  );
$$;

create or replace function public._msobp105_store_performance_comparison()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Store performance comparison — learning not competition. Signals inform support; never rank teams against each other.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'context_before_comparison', 'label', 'Context before comparison', 'description', 'Performance signals inform support decisions — margin, region, and brand context matter'),
      jsonb_build_object('emoji', '🌹', 'key', 'cross_store_learning', 'label', 'Cross-store learning', 'description', 'Share successful practices and bundles without competitive ranking between store teams'),
      jsonb_build_object('emoji', '🔔', 'key', 'stores_needing_support', 'label', 'Stores needing support', 'description', 'Attention signals for underperforming or governance-misaligned stores — support, not blame')
    ),
    'boundary_note', 'Comparison is for portfolio learning — never punitive leaderboard framing.'
  );
$$;

create or replace function public._msobp105_cross_store_intelligence()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Cross-store intelligence — shared opportunities and patterns; recommendations require approval before sync.',
    'capabilities', jsonb_build_array(
      'Shared opportunities — seasonal initiatives, successful bundles, operational practices',
      'Category replication — top-performing categories applicable across stores',
      'Regional demand — market observations and expansion readiness profiles',
      'Cross-brand learning — governance coordination and best-practice sharing without eliminating brand individuality'
    ),
    'baseline_tables', jsonb_build_array('cross_store_insights', 'opportunity_distributions', 'product_sync_recommendations'),
    'auto_sync_note', 'auto_sync_disabled default true — all product sync recommendations require human approval',
    'boundary_note', 'Intelligence prepares portfolio decisions — organizations retain authority over sync and publish.'
  );
$$;

create or replace function public._msobp105_unified_product_management()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Unified product management — selective publish with brand individuality preserved.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'selective_publish', 'label', 'Selective publish', 'description', 'Choose which products to share across stores — never automatic full-catalog sync'),
      jsonb_build_object('key', 'share_across_stores', 'label', 'Share across stores', 'description', 'Replicate proven SKUs with source and target store guidance — approval required'),
      jsonb_build_object('key', 'localize_descriptions', 'label', 'Localize descriptions', 'description', 'Market-specific product content — cross-link Product Automation Phase 102 translation'),
      jsonb_build_object('key', 'market_pricing', 'label', 'Market pricing', 'description', 'Regional pricing flexibility while maintaining portfolio margin visibility'),
      jsonb_build_object('key', 'brand_individuality', 'label', 'Brand individuality', 'description', 'Brand groups retain catalog identity — orchestration coordinates, never homogenizes')
    ),
    'product_automation_route', '/app/product-automation',
    'approvals_route', '/app/approvals',
    'boundary_note', 'Product management is guidance and preparation — humans approve every publish and sync action.'
  );
$$;

create or replace function public._msobp105_global_commerce_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Global commerce insights — portfolio trends and strategic signals; wisdom guides expansion.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'portfolio_trends', 'label', 'Portfolio trends', 'description', 'Combined revenue momentum, margin patterns, and cross-store comparisons'),
      jsonb_build_object('emoji', '🌹', 'key', 'governance_alignment', 'label', 'Governance alignment', 'description', 'Approval workflow consistency, return policies, and reporting cadence across stores'),
      jsonb_build_object('emoji', '🔔', 'key', 'expansion_readiness', 'label', 'Expansion readiness', 'description', 'Regional profiles and readiness scores — defer expansion when localization is incomplete')
    ),
    'commerce_performance_route', '/app/commerce-performance',
    'boundary_note', 'Global insights are metadata — cross-link Phase 104 for profit operations detail.'
  );
$$;

create or replace function public._msobp105_automation_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Automation connection — product update through publish with human checkpoints at every step.',
    'pipeline_steps', jsonb_build_array(
      jsonb_build_object('step', 1, 'key', 'product_update', 'label', 'Product update', 'description', 'Source store product change detected — metadata signal only'),
      jsonb_build_object('step', 2, 'key', 'translate', 'label', 'Translate', 'description', 'Cross-link Product Automation Phase 102 — localized content for target stores'),
      jsonb_build_object('step', 3, 'key', 'distribute', 'label', 'Distribute', 'description', 'Selective distribution guidance — target store keys with approval gate'),
      jsonb_build_object('step', 4, 'key', 'review_local_adjustments', 'label', 'Review local adjustments', 'description', 'Brand admins review market pricing and localized descriptions'),
      jsonb_build_object('step', 5, 'key', 'publish', 'label', 'Publish', 'description', 'Human approval before publish — cross-link Trust & Action and Workflow Orchestration Phase 86')
    ),
    'product_automation_route', '/app/product-automation',
    'workflow_orchestration_route', '/app/workflow-orchestration-engine',
    'approvals_route', '/app/approvals',
    'boundary_note', 'Pipeline prepares — never silent sync or publish across portfolio stores.'
  );
$$;

create or replace function public._msobp105_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Portfolio Companion guidance — warm, optional, non-intrusive. Wisdom guides expansion — not urgency pressure.',
    'companion_name', 'Portfolio Companion',
    'not_label', 'AI multi-store bot',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'portfolio_overview', 'prompt', 'Your portfolio health score is ready — would an executive summary across all connected stores feel helpful?', 'consideration', 'Centralized oversight — humans decide which stores need attention'),
      jsonb_build_object('emoji', '🌹', 'key', 'cross_store_opportunity', 'prompt', 'A fitness bundle performs well in Norway — shall I prepare a replication checklist for SE and FI stores?', 'consideration', 'Cross-store learning — approval required before sync'),
      jsonb_build_object('emoji', '🔔', 'key', 'sync_approval', 'prompt', 'Product sync recommendations are ready — human approval is required before any publish. Open approvals?', 'consideration', 'auto_sync_disabled — organizations retain portfolio decision authority')
    ),
    'boundary_note', 'Portfolio Companion scaffolds oversight — never auto-syncs products or bypasses approval gates.'
  );
$$;

create or replace function public._msobp105_leadership_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership connection — manageable complexity for executives scaling multi-store portfolios.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'manageable_complexity', 'label', 'Manageable complexity', 'description', 'Unified dashboard without overwhelming detail — portfolio score and attention signals'),
      jsonb_build_object('key', 'stores_needing_support', 'label', 'Stores needing support', 'description', 'Clear indicators for underperforming or governance-misaligned stores'),
      jsonb_build_object('key', 'brand_differentiation', 'label', 'Brand differentiation', 'description', 'Preserve brand individuality while sharing intelligence — not one-size-fits-all catalogs'),
      jsonb_build_object('key', 'expansion_alignment', 'label', 'Expansion alignment', 'description', 'Regional readiness profiles — wisdom before entering new markets')
    ),
    'executive_reporting', 'generate_executive_portfolio_report()',
    'boundary_note', 'Leadership insights prepare decisions — executives retain portfolio strategy authority.'
  );
$$;

create or replace function public._msobp105_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — sustainable portfolio growth pacing; avoid burnout from reactive multi-store firefighting.',
    'quotes', jsonb_build_array(
      'Growth creates complexity — sustainable portfolio management grows one thoughtful decision at a time.',
      'Not every store needs the same catalog — brand individuality protects wellbeing and customer trust.',
      'Cross-store learning is collaboration, not competition — support teams without ranking pressure.',
      'Complete visibility can wait for your review pace — orchestration informs, never overwhelms.'
    ),
    'practices', jsonb_build_array(
      'Pause before replicating products across all stores — selective publish over reactive sync',
      'Celebrate governance alignment — not only revenue growth across the portfolio',
      'Regional expansion at a human pace — readiness scores before market entry',
      'Sustainable portfolio rhythms — cross-link Self Love A.76'
    ),
    'route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports wellbeing rhythms — principle only; Multi-Store Orchestration stores portfolio metadata, not personal wellbeing content.'
  );
$$;

create or replace function public._msobp105_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparent portfolio intelligence — explainable scores, human approval, audited actions.',
    'users_should_see', jsonb_build_array(
      'Portfolio health score components — performance, profit, governance, and operational stability',
      'auto_sync_disabled default and human approval for product sync recommendations',
      'Safety note — Aipify coordinates intelligence; organizations retain portfolio decision authority',
      'Audit trail via multi_store_audit_log — store registration, recommendation actions, executive reports'
    ),
    'operators_should_understand', jsonb_build_array(
      'Multi-store orchestration is scaffolding — not automated catalog management across stores',
      'Cross-links Trust & Action Engine — sync and publish actions require approval context',
      'Integration Engine and Platform Install supply store connections — do not bypass connector policy',
      'Platform aggregates only at platform governance — tenant portfolio data stays tenant-scoped'
    ),
    'audit_note', 'store_registered, recommendation_action, executive_report_generated — metadata only; auto_sync false on all actions.'
  );
$$;

create or replace function public._msobp105_permission_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Permission principles — store-specific authority with executive visibility and approval gates.',
    'rules', jsonb_build_array(
      jsonb_build_object('key', 'store_specific_permissions', 'label', 'Store-specific permissions', 'description', 'Brand admins and regional teams control local catalog and pricing decisions'),
      jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility', 'description', 'Portfolio-level metrics and reports without bypassing store autonomy'),
      jsonb_build_object('key', 'brand_admin_rights', 'label', 'Brand admin rights', 'description', 'Franchise and regional stores retain local authority — orchestration coordinates, never overrides'),
      jsonb_build_object('key', 'approval_requirements', 'label', 'Approval requirements', 'description', 'Sync and publish require human approval — auto_sync_disabled default true; cross-link /app/approvals')
    ),
    'approvals_route', '/app/approvals',
    'boundary_note', 'Permissions enforce portfolio authority — no silent cross-store product synchronization.'
  );
$$;

create or replace function public._msobp105_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Dogfooding — validate multi-store orchestration patterns on real portfolio decisions before broad rollout.',
    'sportsklaer_no', jsonb_build_object(
      'slug', 'sportsklaer-no',
      'role', 'Sportsklær.no — active lifestyle commerce dogfooding',
      'focus', jsonb_build_array(
        'Future commerce expansion — international storefronts and Shopify connections',
        'Cross-brand reporting — Nordic active lifestyle portfolio patterns',
        'Selective product replication — fitness category across regional stores',
        'Portfolio Companion tone — wisdom guides expansion, not urgency',
        'Governance coordination — approval workflow alignment across brand groups'
      )
    ),
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal validation — permission principles, trust connection, KC FAQ',
      'focus', jsonb_build_array(
        'Portfolio Companion guidance examples (🦉🌹🔔)',
        'auto_sync_disabled enforcement in ILM and dashboard safety note',
        'Integration with Platform Install Phase 100 and Integration Engine connectors',
        'Knowledge Center FAQ — implementation-blueprint-phase105-faq'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — multi-store operations cross-links',
      'focus', jsonb_build_array(
        'Portfolio dashboard with human approval workflow',
        'Commerce Performance Phase 104 cross-link for profit signals',
        'Product Automation Phase 102 distribute/localize workflow integration'
      )
    )
  );
$$;

create or replace function public._msobp105_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We have complete visibility across our entire commerce ecosystem.',
    'Growth creates complexity but not confusion — preserve brand individuality.',
    'Wisdom guides expansion — orchestration informs, humans decide.',
    '🦉 Centralized oversight — portfolio health without losing store autonomy.',
    '🌹 Cross-store learning — share practices without competitive ranking.',
    '🔔 Approval before sync — organizations retain portfolio decision authority.',
    'Manage many stores as if they were one ecosystem — with local decision-making authority.',
    'Aipify Portfolio Companion informs and prepares — humans approve every sync and publish.'
  );
$$;

create or replace function public._msobp105_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'commerce_intelligence_phase101', 'label', 'Commerce Intelligence (Blueprint Phase 101)', 'route', '/app/commerce-intelligence', 'note', 'Product discovery and opportunity evaluation — cross-link before replication'),
    jsonb_build_object('key', 'product_automation_phase102', 'label', 'Product Automation (Blueprint Phase 102)', 'route', '/app/product-automation', 'note', 'Distribute/localize workflow — translate, rewrite, publish pipeline'),
    jsonb_build_object('key', 'dropshipping_operations_phase103', 'label', 'Dropshipping Operations (Blueprint Phase 103)', 'route', '/app/dropshipping-operations', 'note', 'Operational stability and supplier context across stores'),
    jsonb_build_object('key', 'commerce_performance_phase104', 'label', 'Commerce Performance & Profit (Phase 104)', 'route', '/app/commerce-performance', 'note', 'Portfolio profit and performance signals — distinct from orchestration'),
    jsonb_build_object('key', 'integration_engine', 'label', 'Integration Engine', 'route', '/app/integration-engine', 'note', 'Shopify/WooCommerce connectors and approved integrations'),
    jsonb_build_object('key', 'platform_install_phase100', 'label', 'Platform Install (Phase 100)', 'route', '/app/platform-install', 'note', 'Connected store catalog and install status'),
    jsonb_build_object('key', 'workflow_orchestration_phase86', 'label', 'Workflow Orchestration (Phase 86)', 'route', '/app/workflow-orchestration-engine', 'note', 'Approval orchestration for sync and publish workflows'),
    jsonb_build_object('key', 'trust_actions_approvals', 'label', 'Trust & Action — Approvals', 'route', '/app/approvals', 'note', 'Publish/sync approval gates — human oversight required'),
    jsonb_build_object('key', 'self_love_a76', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Sustainable portfolio growth pacing — principle only'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'route', '/app/knowledge-center', 'note', 'Multi-store management guides and FAQ')
  );
$$;

create or replace function public._msobp105_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_metrics jsonb;
  v_stores int := 0;
  v_insights int := 0;
  v_sync int := 0;
  v_opportunities int := 0;
begin
  perform public._mso_ensure_settings(p_tenant_id);
  perform public._mso_seed_portfolio(p_tenant_id);
  v_metrics := public._mso_refresh_metrics(p_tenant_id);

  select count(*) into v_stores from public.portfolio_members where tenant_id = p_tenant_id;
  select count(*) into v_insights from public.cross_store_insights where tenant_id = p_tenant_id;
  select count(*) into v_sync from public.product_sync_recommendations where tenant_id = p_tenant_id;
  select count(*) into v_opportunities from public.opportunity_distributions where tenant_id = p_tenant_id;

  return jsonb_build_object(
    'portfolio_score', coalesce((v_metrics->>'portfolio_score')::numeric, 0),
    'stores_connected', coalesce((v_metrics->>'stores_connected')::int, 0),
    'portfolio_revenue', coalesce((v_metrics->>'portfolio_revenue')::numeric, 0),
    'stores_needing_attention', coalesce((v_metrics->>'stores_needing_attention')::int, 0),
    'governance_gaps', coalesce((v_metrics->>'governance_gaps')::int, 0),
    'regions_tracked', coalesce((v_metrics->>'regions_tracked')::int, 0),
    'store_count', v_stores,
    'cross_store_insights_count', v_insights,
    'product_sync_recommendations', v_sync,
    'opportunity_distributions', v_opportunities,
    'objectives_documented', jsonb_array_length(public._msobp105_objectives()),
    'supported_platforms', jsonb_array_length(public._msobp105_supported_environments()->'platforms'),
    'companion_examples', jsonb_array_length(public._msobp105_companion_guidance()->'examples'),
    'integration_links', jsonb_array_length(public._msobp105_integration_links()),
    'auto_sync_disabled', true,
    'privacy_note', 'Aggregate portfolio counts and blueprint scaffolds only — no raw customer content, orders, or PII.'
  );
end; $$;

create or replace function public._msobp105_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_stores int := 0;
begin
  perform public._mso_ensure_settings(p_tenant_id);
  perform public._mso_seed_portfolio(p_tenant_id);
  perform public._mso_seed_insights(p_tenant_id);
  v_engagement := public._msobp105_engagement_summary(p_tenant_id);
  v_stores := coalesce((v_engagement->>'store_count')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'centralized_oversight',
      'label', 'Centralized oversight — executive portfolio visibility (🦉)',
      'met', jsonb_array_length(public._msobp105_executive_commerce_dashboard()->'dimensions') >= 6,
      'note', 'Executive commerce dashboard dimensions documented.'
    ),
    jsonb_build_object(
      'key', 'cross_store_intelligence',
      'label', 'Cross-store intelligence — shared opportunities and patterns',
      'met', coalesce((v_engagement->>'cross_store_insights_count')::int, 0) >= 1,
      'note', case when coalesce((v_engagement->>'cross_store_insights_count')::int, 0) < 1 then 'Seed portfolio insights to activate cross-store intelligence.' else null end
    ),
    jsonb_build_object(
      'key', 'unified_reporting',
      'label', 'Unified reporting — store performance and portfolio metrics',
      'met', v_stores >= 1,
      'note', 'Portfolio members and executive report RPC available.'
    ),
    jsonb_build_object(
      'key', 'brand_flexibility',
      'label', 'Brand flexibility — selective publish and brand individuality',
      'met', (public._msobp105_unified_product_management()->>'principle') is not null,
      'note', 'Unified product management scaffold documented.'
    ),
    jsonb_build_object(
      'key', 'operational_efficiency',
      'label', 'Operational efficiency — governance coordination',
      'met', coalesce((v_engagement->>'governance_gaps')::int, 0) >= 0,
      'note', 'Governance coordination records on baseline dashboard.'
    ),
    jsonb_build_object(
      'key', 'strategic_scalability',
      'label', 'Strategic scalability — regional expansion profiles',
      'met', coalesce((v_engagement->>'regions_tracked')::int, 0) >= 1,
      'note', 'Regional expansion readiness tracked on dashboard.'
    ),
    jsonb_build_object(
      'key', 'supported_environments',
      'label', 'Supported environments — Shopify, WooCommerce, regional storefronts',
      'met', jsonb_array_length(public._msobp105_supported_environments()->'platforms') >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'store_performance_comparison',
      'label', 'Store performance comparison — learning not competition (🦉🌹🔔)',
      'met', jsonb_array_length(public._msobp105_store_performance_comparison()->'dimensions') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'global_commerce_insights',
      'label', 'Global commerce insights — portfolio trends (🦉🌹🔔)',
      'met', jsonb_array_length(public._msobp105_global_commerce_insights()->'dimensions') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'automation_connection',
      'label', 'Automation connection — update through publish pipeline',
      'met', jsonb_array_length(public._msobp105_automation_connection()->'pipeline_steps') >= 5,
      'note', 'Cross-link Product Automation Phase 102 and Workflow Orchestration Phase 86.'
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Portfolio Companion guidance — wisdom guides expansion',
      'met', jsonb_array_length(public._msobp105_companion_guidance()->'examples') >= 3,
      'note', 'Portfolio Companion — not generic AI multi-store bot.'
    ),
    jsonb_build_object(
      'key', 'permission_principles',
      'label', 'Permission principles — store authority and approval gates',
      'met', jsonb_array_length(public._msobp105_permission_principles()->'rules') >= 4,
      'note', 'auto_sync_disabled default true — baseline preserved.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — transparent scores and human approval',
      'met', jsonb_array_length(public._msobp105_trust_connection()->'users_should_see') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — sustainable portfolio growth pacing',
      'met', jsonb_array_length(public._msobp105_self_love_connection()->'quotes') >= 2,
      'note', 'Growth creates complexity — sustainable decisions beat reactive sync.'
    ),
    jsonb_build_object(
      'key', 'leadership_connection',
      'label', 'Leadership connection — manageable complexity for executives',
      'met', jsonb_array_length(public._msobp105_leadership_connection()->'dimensions') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'baseline_preserved',
      'label', 'Repo Phase 105 baseline fields preserved on dashboard',
      'met', to_regclass('public.multi_store_orchestration_settings') is not null,
      'note', '_mso_* tables and RPC behavior intact including auto_sync_disabled.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links Commerce Phases 101–104, Integration Engine, Workflow Phase 86, Approvals',
      'met', jsonb_array_length(public._msobp105_integration_links()) >= 10,
      'note', 'Commerce Intelligence, Product Automation, Dropshipping, Commerce Performance included.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Sportsklær.no portfolio, Shopify, cross-brand reporting',
      'met', (public._msobp105_dogfooding()->'sportsklaer_no') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS principle — portfolio authority retained',
      'met', true,
      'note', 'Humans approve every sync and publish; Aipify Portfolio Companion informs and prepares.'
    )
  );
end; $$;

create or replace function public._msobp105_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 105 — Multi-Store Orchestration Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE105_MULTI_STORE_ORCHESTRATION.md',
    'engine_phase', 'Repo Phase 105 Multi-Store Orchestration Engine',
    'route', '/app/multi-store',
    'mapping_note', 'ABOS Blueprint Phase 105 extends repo Phase 105 with portfolio orchestration scaffolding. Distinct from Commerce Intelligence Phase 101, Product Automation Phase 102, Dropshipping Phase 103, Commerce Performance Phase 104.',
    'distinction_note', public._msobp105_distinction_note(),
    'mission', public._msobp105_mission(),
    'philosophy', public._msobp105_philosophy(),
    'abos_principle', public._msobp105_abos_principle(),
    'objectives', public._msobp105_objectives(),
    'supported_environments', public._msobp105_supported_environments(),
    'executive_commerce_dashboard', public._msobp105_executive_commerce_dashboard(),
    'store_performance_comparison', public._msobp105_store_performance_comparison(),
    'cross_store_intelligence', public._msobp105_cross_store_intelligence(),
    'unified_product_management', public._msobp105_unified_product_management(),
    'global_commerce_insights', public._msobp105_global_commerce_insights(),
    'automation_connection', public._msobp105_automation_connection(),
    'companion_guidance', public._msobp105_companion_guidance(),
    'leadership_connection', public._msobp105_leadership_connection(),
    'self_love_connection', public._msobp105_self_love_connection(),
    'trust_connection', public._msobp105_trust_connection(),
    'permission_principles', public._msobp105_permission_principles(),
    'dogfooding', public._msobp105_dogfooding(),
    'success_criteria', public._msobp105_success_criteria(p_tenant_id),
    'vision', public._msobp105_vision(),
    'vision_phrases', public._msobp105_vision_phrases(),
    'integration_links', public._msobp105_integration_links(),
    'engagement_summary', public._msobp105_engagement_summary(p_tenant_id),
    'privacy_note', 'Multi-store orchestration blueprint data is metadata only — portfolio scores, cross-store insights, sync guidance. No automatic product synchronization. Humans decide; Aipify Portfolio Companion informs and prepares.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Card RPC — preserve ALL baseline fields; append Phase 105
-- ---------------------------------------------------------------------------
create or replace function public.get_multi_store_orchestration_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb; v_engagement jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._mso_ensure_settings(v_tenant_id);
  perform public._mso_seed_portfolio(v_tenant_id);
  v_metrics := public._mso_refresh_metrics(v_tenant_id);
  v_engagement := public._msobp105_engagement_summary(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'portfolio_score', v_metrics->'portfolio_score',
    'portfolio_classification', v_metrics->'portfolio_classification',
    'stores_connected', v_metrics->'stores_connected',
    'philosophy', 'Manage many stores as if they were one ecosystem.',
    'human_oversight_required', true,
    'implementation_blueprint_phase105', jsonb_build_object(
      'phase', 'Phase 105 — Multi-Store Orchestration Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE105_MULTI_STORE_ORCHESTRATION.md',
      'engine_phase', 'Repo Phase 105 Multi-Store Orchestration Engine',
      'route', '/app/multi-store',
      'mapping_note', 'ABOS Blueprint Phase 105 extends repo Phase 105 — wisdom guides expansion. Distinct from Commerce Phases 101–104.'
    ),
    'multi_store_orchestration_mission', public._msobp105_mission(),
    'multi_store_orchestration_abos_principle', public._msobp105_abos_principle(),
    'multi_store_orchestration_engagement_summary', v_engagement,
    'multi_store_orchestration_note', 'Multi-Store Orchestration Engine (ABOS Phase 105) — centralized intelligence across stores; humans approve every sync and publish.',
    'multi_store_orchestration_vision_note', public._msobp105_vision()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Dashboard RPC — preserve ALL baseline fields; append Phase 105
-- ---------------------------------------------------------------------------
create or replace function public.get_multi_store_orchestration_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.multi_store_orchestration_settings;
  v_metrics jsonb;
begin
  v_tenant_id := public._mso_require_tenant();
  v_settings := public._mso_ensure_settings(v_tenant_id);
  perform public._mso_seed_portfolio(v_tenant_id);
  perform public._mso_seed_insights(v_tenant_id);
  v_metrics := public._mso_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'auto_sync_disabled', v_settings.auto_sync_disabled,
    'philosophy', 'Manage many stores as if they were one ecosystem.',
    'safety_note', 'Aipify coordinates intelligence across stores — organizations retain authority over portfolio decisions. No automatic product synchronization.',
    'orchestration_enabled', v_settings.orchestration_enabled,
    'portfolio_score', v_metrics->'portfolio_score',
    'portfolio_classification', v_metrics->'portfolio_classification',
    'stores_connected', v_metrics->'stores_connected',
    'portfolio_revenue', v_metrics->'portfolio_revenue',
    'avg_profit_margin_percent', v_metrics->'avg_profit_margin_percent',
    'stores_needing_attention', v_metrics->'stores_needing_attention',
    'opportunity_count', v_metrics->'opportunity_count',
    'governance_gaps', v_metrics->'governance_gaps',
    'regions_tracked', v_metrics->'regions_tracked',
    'store_summaries', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'store_key', m.store_key, 'store_name', m.store_name,
        'platform_type', m.platform_type, 'brand_group', m.brand_group, 'region', m.region,
        'ownership_label', m.ownership_label, 'status_level', m.status_level,
        'revenue_amount', m.revenue_amount, 'profit_margin_percent', m.profit_margin_percent,
        'performance_score', m.performance_score
      ) order by m.performance_score desc)
      from public.portfolio_members m where m.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'cross_store_insights', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'insight_type', c.insight_type, 'title', c.title,
        'summary', c.summary, 'affected_stores', c.affected_stores, 'trend_direction', c.trend_direction
      ) order by c.created_at desc)
      from public.cross_store_insights c where c.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'product_sync_guidance', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'product_key', p.product_key, 'product_name', p.product_name,
        'source_store_key', p.source_store_key, 'target_store_keys', p.target_store_keys,
        'recommendation_summary', p.recommendation_summary, 'rationale', p.rationale,
        'requires_approval', p.requires_approval
      ) order by p.created_at desc)
      from public.product_sync_recommendations p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'opportunity_distributions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id, 'opportunity_type', o.opportunity_type, 'title', o.title,
        'summary', o.summary, 'applicable_stores', o.applicable_stores,
        'rationale', o.rationale, 'priority', o.priority
      ) order by o.created_at desc)
      from public.opportunity_distributions o where o.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'governance_coordination', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', g.id, 'coordination_type', g.coordination_type, 'title', g.title,
        'summary', g.summary, 'consistency_level', g.consistency_level,
        'affected_stores', g.affected_stores, 'recommendation', g.recommendation
      ) order by g.created_at desc)
      from public.governance_coordination_records g where g.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'regional_expansion', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'region_key', r.region_key, 'region_name', r.region_name,
        'readiness_score', r.readiness_score, 'readiness_status', r.readiness_status,
        'localization_notes', r.localization_notes, 'market_observation', r.market_observation
      ) order by r.readiness_score desc)
      from public.regional_expansion_profiles r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'strategic_recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'section', s.section, 'title', s.title, 'summary', s.summary,
        'recommendation_type', s.recommendation_type, 'priority', s.priority, 'rationale', s.rationale
      ) order by s.created_at desc)
      from public.portfolio_strategic_recommendations s where s.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'portfolio_notifications', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', n.id, 'title', n.title, 'message', n.message, 'priority', n.priority
      ) order by n.created_at desc)
      from public.multi_store_notifications n where n.tenant_id = v_tenant_id limit 10
    ), '[]'::jsonb),
    'executive_reports', coalesce((
      select jsonb_agg(jsonb_build_object('id', e.id, 'summary', e.summary, 'created_at', e.created_at)
        order by e.created_at desc)
      from public.executive_portfolio_reports e where e.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'platform_install', 'Connected store catalog and install status',
      'commerce_intelligence', 'Cross-store product opportunities',
      'commerce_performance', 'Portfolio profit and performance signals',
      'dropshipping_operations', 'Operational stability across stores',
      'knowledge_center', 'Multi-store management guides and FAQ'
    ),
    'implementation_blueprint_phase105', jsonb_build_object(
      'phase', 'Phase 105 — Multi-Store Orchestration Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE105_MULTI_STORE_ORCHESTRATION.md',
      'engine_phase', 'Repo Phase 105 Multi-Store Orchestration Engine',
      'route', '/app/multi-store',
      'mapping_note', 'ABOS Blueprint Phase 105 extends repo Phase 105 — wisdom guides expansion. Distinct from Commerce Phases 101–104.'
    ),
    'multi_store_orchestration_engine_note', 'Multi-Store Orchestration Engine (ABOS Phase 105) — centralized intelligence and orchestration across multiple stores — portfolio authority retained.',
    'multi_store_orchestration_blueprint', public._msobp105_blueprint_block(v_tenant_id),
    'multi_store_orchestration_distinction_note', public._msobp105_distinction_note(),
    'multi_store_orchestration_mission', public._msobp105_mission(),
    'multi_store_orchestration_philosophy', public._msobp105_philosophy(),
    'multi_store_orchestration_abos_principle', public._msobp105_abos_principle(),
    'multi_store_orchestration_objectives', public._msobp105_objectives(),
    'multi_store_supported_environments', public._msobp105_supported_environments(),
    'multi_store_executive_commerce_dashboard', public._msobp105_executive_commerce_dashboard(),
    'multi_store_performance_comparison', public._msobp105_store_performance_comparison(),
    'multi_store_cross_store_intelligence', public._msobp105_cross_store_intelligence(),
    'multi_store_unified_product_management', public._msobp105_unified_product_management(),
    'multi_store_global_commerce_insights', public._msobp105_global_commerce_insights(),
    'multi_store_automation_connection', public._msobp105_automation_connection(),
    'multi_store_companion_guidance', public._msobp105_companion_guidance(),
    'multi_store_leadership_connection', public._msobp105_leadership_connection(),
    'multi_store_self_love_connection', public._msobp105_self_love_connection(),
    'multi_store_trust_connection', public._msobp105_trust_connection(),
    'multi_store_permission_principles', public._msobp105_permission_principles(),
    'multi_store_orchestration_dogfooding', public._msobp105_dogfooding(),
    'msobp105_integration_links', public._msobp105_integration_links(),
    'multi_store_orchestration_engagement_summary', public._msobp105_engagement_summary(v_tenant_id),
    'multi_store_orchestration_success_criteria', public._msobp105_success_criteria(v_tenant_id),
    'multi_store_orchestration_vision', public._msobp105_vision(),
    'multi_store_orchestration_vision_phrases', public._msobp105_vision_phrases(),
    'multi_store_orchestration_privacy_note', 'Multi-store orchestration metadata only — no automatic product sync, no silent publish without approval. Humans decide; Aipify Portfolio Companion informs and prepares.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._msobp105_distinction_note() to authenticated;
grant execute on function public._msobp105_mission() to authenticated;
grant execute on function public._msobp105_philosophy() to authenticated;
grant execute on function public._msobp105_abos_principle() to authenticated;
grant execute on function public._msobp105_vision() to authenticated;
grant execute on function public._msobp105_objectives() to authenticated;
grant execute on function public._msobp105_supported_environments() to authenticated;
grant execute on function public._msobp105_executive_commerce_dashboard() to authenticated;
grant execute on function public._msobp105_store_performance_comparison() to authenticated;
grant execute on function public._msobp105_cross_store_intelligence() to authenticated;
grant execute on function public._msobp105_unified_product_management() to authenticated;
grant execute on function public._msobp105_global_commerce_insights() to authenticated;
grant execute on function public._msobp105_automation_connection() to authenticated;
grant execute on function public._msobp105_companion_guidance() to authenticated;
grant execute on function public._msobp105_leadership_connection() to authenticated;
grant execute on function public._msobp105_self_love_connection() to authenticated;
grant execute on function public._msobp105_trust_connection() to authenticated;
grant execute on function public._msobp105_permission_principles() to authenticated;
grant execute on function public._msobp105_dogfooding() to authenticated;
grant execute on function public._msobp105_vision_phrases() to authenticated;
grant execute on function public._msobp105_integration_links() to authenticated;
grant execute on function public._msobp105_engagement_summary(uuid) to authenticated;
grant execute on function public._msobp105_success_criteria(uuid) to authenticated;
grant execute on function public._msobp105_blueprint_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'multi-store-orchestration-blueprint-phase105', 'Multi-Store Orchestration Engine (ABOS Phase 105)',
  'Multi-Store Orchestration Engine — centralized portfolio visibility, cross-store intelligence, unified reporting, and selective publish guidance. Wisdom guides expansion; humans approve sync and publish.',
  'authenticated', 132
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'multi-store-orchestration-blueprint-phase105' and tenant_id is null
);
