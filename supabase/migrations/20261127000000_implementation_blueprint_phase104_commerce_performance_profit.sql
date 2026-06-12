-- Implementation Blueprint Phase 104 — Commerce Performance & Profit Engine
-- Extends Commerce Performance & Profit Engine repo Phase 104. No new tables.
-- Distinct from Commerce Intelligence Blueprint Phase 101 at /app/commerce-intelligence.
-- Distinct from Revenue Intelligence Blueprint Phase 39 at /app/commercial (MRR/ARR only).

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._cppbp104_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 104 — Commerce Performance & Profit Engine at /app/commerce-performance. Extends Commerce Performance & Profit Engine repo Phase 104 (_cpp_*) and preserves ALL baseline dashboard and card fields. More sales ≠ better business — balance growth with profitability. Distinct from Commerce Intelligence Blueprint Phase 101 at /app/commerce-intelligence (discovery/opportunity vs profit operations). Distinct from Revenue Intelligence Blueprint Phase 39 at /app/commercial (subscription MRR/ARR only — NOT product profit). Cross-links Product Automation Phase 102, Dropshipping Operations Phase 103, Integration Engine Fiken/Stripe, Enterprise Pricing at /app/settings/billing. Helpers use _cppbp104_* — never collide with _cpp_*.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._cppbp104_mission()
returns text language sql immutable as $$
  select 'Transform financial and operational data into meaningful profitability insights.';
$$;

create or replace function public._cppbp104_philosophy()
returns text language sql immutable as $$
  select 'More sales ≠ better business — balance growth with profitability; wisdom guides ambition. Revenue measures activity; profitability reflects sustainability.';
$$;

create or replace function public._cppbp104_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — sustainability not extraction. Aipify Commerce Companion informs and prepares profit visibility, product performance, cost awareness, and strategic prioritization; humans retain financial oversight and commercial decisions.';
$$;

create or replace function public._cppbp104_vision()
returns text language sql immutable as $$
  select 'We finally understand what truly drives profitability in our business.';
$$;

create or replace function public._cppbp104_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'profit_visibility', 'label', 'Profit visibility', 'emoji', '🦉', 'description', 'Clear gross and net profit signals across products and categories'),
    jsonb_build_object('key', 'product_performance', 'label', 'Product performance', 'emoji', '🌹', 'description', 'Which products drive revenue vs sustainable profit contribution'),
    jsonb_build_object('key', 'revenue_intelligence', 'label', 'Revenue intelligence', 'emoji', '🔔', 'description', 'Revenue trends with margin context — not volume alone'),
    jsonb_build_object('key', 'cost_awareness', 'label', 'Cost awareness', 'emoji', '🦉', 'description', 'Supplier, shipping, platform, advertising, and refund cost visibility'),
    jsonb_build_object('key', 'strategic_prioritization', 'label', 'Strategic prioritization', 'emoji', '🌹', 'description', 'Focus on profitable growth opportunities over noise'),
    jsonb_build_object('key', 'sustainable_growth', 'label', 'Sustainable growth', 'emoji', '🔔', 'description', 'Long-term business health over short-term metric spikes')
  );
$$;

create or replace function public._cppbp104_performance_dashboard()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Performance dashboard — operational profitability metadata; Fiken remains accounting source of truth.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'revenue', 'label', 'Revenue', 'description', 'Total and period revenue with trend signals'),
      jsonb_build_object('key', 'gross_profit', 'label', 'Gross profit', 'description', 'Gross margin percent and contribution by category'),
      jsonb_build_object('key', 'net_profit', 'label', 'Net profit', 'description', 'Net margin after ads, shipping, returns, and platform costs'),
      jsonb_build_object('key', 'aov', 'label', 'Average order value', 'description', 'AOV trends with bundle and cross-sell context'),
      jsonb_build_object('key', 'product_profitability', 'label', 'Product profitability', 'description', 'Per-SKU revenue contribution and profit classification'),
      jsonb_build_object('key', 'cac', 'label', 'Customer acquisition cost', 'description', 'CAC relative to margin — metadata patterns only'),
      jsonb_build_object('key', 'return_refund_rates', 'label', 'Return and refund rates', 'description', 'Category-level return impact on net profit'),
      jsonb_build_object('key', 'conversion_trends', 'label', 'Conversion trends', 'description', 'Conversion signals with margin context — not vanity metrics alone'),
      jsonb_build_object('key', 'top_categories', 'label', 'Top categories', 'description', 'Highest profit-contributing categories vs volume-only leaders')
    ),
    'boundary_note', 'Dashboard aggregates metadata — humans validate against professional financial records.'
  );
$$;

create or replace function public._cppbp104_profit_intelligence()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Profit intelligence — margin context before scaling; never growth-at-any-cost.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'margin_observations', 'label', 'Margin observations', 'description', 'Gross and net margin trends with cost pressure signals — context before scaling'),
      jsonb_build_object('emoji', '🌹', 'key', 'sustainable_contributors', 'label', 'Sustainable contributors', 'description', 'Products and categories with durable profit contribution'),
      jsonb_build_object('emoji', '🔔', 'key', 'review_signals', 'label', 'Review signals', 'description', 'When returns, ad spend, or weak margins need human review')
    ),
    'boundary_note', 'Profit intelligence prepares decisions — does not replace accountants or auditors.'
  );
$$;

create or replace function public._cppbp104_product_performance_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Product performance insights — revenue vs profit contribution; humans prioritize catalog actions.',
    'insight_types', jsonb_build_array(
      jsonb_build_object('key', 'highest_revenue', 'label', 'Highest revenue products', 'description', 'Top revenue contributors — may differ from top profit'),
      jsonb_build_object('key', 'highest_profit', 'label', 'Highest profit products', 'description', 'SKUs with strong net margin and profit contribution percent'),
      jsonb_build_object('key', 'lowest_performing', 'label', 'Lowest performing products', 'description', 'Weak margin or profit_risk classification — review or reprice'),
      jsonb_build_object('key', 'declining_demand', 'label', 'Declining demand', 'description', 'Seasonal or trend decline with margin under pressure'),
      jsonb_build_object('key', 'exceptional_satisfaction', 'label', 'Exceptional satisfaction', 'description', 'High repeat and loyalty signals with strong margins — protect and expand thoughtfully')
    ),
    'product_automation_route', '/app/product-automation',
    'boundary_note', 'Insights prepare prioritization — auto_actions_disabled remains default true.'
  );
$$;

create or replace function public._cppbp104_growth_quality_analysis()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Growth quality analysis — evaluate growth sustainability step by step, not volume alone.',
    'steps', jsonb_build_array(
      jsonb_build_object('step', 1, 'key', 'revenue_growth', 'label', 'Revenue growth', 'description', 'Period revenue momentum and seasonal context'),
      jsonb_build_object('step', 2, 'key', 'margin_impact', 'label', 'Margin impact', 'description', 'Whether growth improved or compressed net margin'),
      jsonb_build_object('step', 3, 'key', 'operational_complexity', 'label', 'Operational complexity', 'description', 'Fulfillment, supplier, and support load from scaling'),
      jsonb_build_object('step', 4, 'key', 'customer_satisfaction', 'label', 'Customer satisfaction', 'description', 'Returns, complaints, and repeat purchase signals'),
      jsonb_build_object('step', 5, 'key', 'long_term_sustainability', 'label', 'Long-term sustainability', 'description', 'Whether growth patterns support durable profitability')
    ),
    'boundary_note', 'Quality of growth matters — revenue without profitability is not sustainable.'
  );
$$;

create or replace function public._cppbp104_cost_visibility()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Cost visibility — operational cost categories for margin awareness; Fiken = accounting source of truth.',
    'categories', jsonb_build_array(
      jsonb_build_object('key', 'supplier_expenses', 'label', 'Supplier expenses', 'description', 'Landed cost and supplier payment patterns — cross-link Dropshipping Operations Phase 103'),
      jsonb_build_object('key', 'shipping', 'label', 'Shipping', 'description', 'Fulfillment and delivery cost impact on net margin'),
      jsonb_build_object('key', 'platform_subscriptions', 'label', 'Platform subscriptions', 'description', 'Shopify, apps, and SaaS overhead allocated to commerce operations'),
      jsonb_build_object('key', 'advertising', 'label', 'Advertising', 'description', 'Ad spend vs margin — when scaling ads compresses net profit'),
      jsonb_build_object('key', 'refund_impacts', 'label', 'Refund impacts', 'description', 'Return and refund erosion on category profitability')
    ),
    'fiken_note', 'Fiken remains accounting source of truth — Aipify provides operational intelligence layer only.',
    'integration_route', '/app/integration-engine',
    'boundary_note', 'Cost visibility is metadata scaffolding — verify with professional financial records.'
  );
$$;

create or replace function public._cppbp104_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Commerce Companion guidance — calm profitability framing; never alarmist or growth-at-any-cost.',
    'companion_name', 'Commerce Companion',
    'not_label', 'AI finance bot',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'margin_context', 'prompt', 'Net margin dipped on ad-heavy SKUs — would a cost breakdown summary help before you adjust spend?', 'consideration', 'Context before scaling — humans decide commercial actions'),
      jsonb_build_object('emoji', '🌹', 'key', 'sustainable_winners', 'prompt', 'Fitness accessories show strong profit contribution — shall Aipify prepare a category focus brief?', 'consideration', 'Celebrate sustainable performers — not volume-only leaders'),
      jsonb_build_object('emoji', '🔔', 'key', 'review_prompt', 'prompt', 'Return rates rose in electronics — would reviewing product messaging and supplier quality feel wise?', 'consideration', 'Customer experience and margin together — pause before blind scale')
    ),
    'boundary_note', 'Commerce Companion scaffolds profitability review — never replaces professional financial expertise.'
  );
$$;

create or replace function public._cppbp104_pricing_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Pricing insights — margin-aware pricing signals; humans approve price changes.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'landed_cost_gap', 'label', 'Landed cost gap', 'description', 'When price may not cover supplier, shipping, and ad assumptions'),
      jsonb_build_object('emoji', '🌹', 'key', 'sustainable_pricing', 'label', 'Sustainable pricing', 'description', 'Categories where thoughtful pricing supports durable margins'),
      jsonb_build_object('emoji', '🔔', 'key', 'discount_ad_pressure', 'label', 'Discount and ad pressure', 'description', 'When discounting or ad scaling compresses net profit below threshold')
    ),
    'enterprise_pricing_route', '/app/settings/billing',
    'boundary_note', 'Pricing insights inform — Enterprise Pricing Philosophy governs Aipify licensing separately.'
  );
$$;

create or replace function public._cppbp104_commerce_strategy_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Commerce strategy connection — profitable growth aligned with purpose and manageable complexity.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'product_alignment', 'label', 'Product alignment', 'description', 'Catalog and category focus aligned with brand and audience strengths'),
      jsonb_build_object('key', 'profitable_growth', 'label', 'Profitable growth', 'description', 'Prioritize margin-positive expansion over volume-only pushes'),
      jsonb_build_object('key', 'meaningful_investments', 'label', 'Meaningful investments', 'description', 'Spend and inventory decisions tied to profit contribution evidence'),
      jsonb_build_object('key', 'manageable_complexity', 'label', 'Manageable complexity', 'description', 'Operational load stays sustainable as catalog grows')
    ),
    'purpose_values_route', '/app/purpose-values-engine',
    'decision_support_route', '/app/assistant/decisions',
    'boundary_note', 'Strategy connection is cross-link scaffolding — humans decide commercial direction.'
  );
$$;

create or replace function public._cppbp104_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — sustainable pacing in commercial ambition; clarity reduces rushed-scaling stress.',
    'quotes', jsonb_build_array(
      'Profitability clarity before scale protects wellbeing — rushed growth creates avoidable operational stress.',
      'Not every revenue spike deserves immediate reinvestment — rest and review are part of sustainable commerce.',
      'Understanding what truly drives profit is calmer than chasing every metric — wisdom guides ambition.',
      'Your business can grow at a human pace — margin health matters as much as top-line revenue.'
    ),
    'practices', jsonb_build_array(
      'Pause before scaling ad spend when net margin is under pressure',
      'Celebrate sustainable profit contributors — not only highest-revenue SKUs',
      'Review return trends as care for customers and margin together',
      'Cross-link Self Love A.76 rhythms for disciplined commercial pacing'
    ),
    'route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports wellbeing rhythms — principle only; Commerce Performance stores profit metadata, not personal wellbeing content.'
  );
$$;

create or replace function public._cppbp104_leadership_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership insights — executive-ready profitability summaries; humans decide strategy.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('emoji', '📈', 'key', 'profitability_summaries', 'label', 'Profitability summaries', 'description', 'Period score, margin percent, and profit contribution overview'),
      jsonb_build_object('emoji', '🦉', 'key', 'margin_observations', 'label', 'Margin observations', 'description', 'Where gross is strong but net is under pressure — cost drivers explained'),
      jsonb_build_object('emoji', '🌹', 'key', 'sustainable_growth', 'label', 'Sustainable growth', 'description', 'Categories and products supporting durable profitability'),
      jsonb_build_object('emoji', '🔔', 'key', 'exploration_areas', 'label', 'Areas for exploration', 'description', 'Profit risk SKUs, refund trends, and opportunity center items for leadership review')
    ),
    'boundary_note', 'Leadership insights prepare briefings — generate_commerce_performance_briefing requires human interpretation.'
  );
$$;

create or replace function public._cppbp104_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparent profitability intelligence — explainable classifications, human approval, audited actions.',
    'users_should_see', jsonb_build_array(
      'How performance score and profit classifications are derived — metadata only',
      'auto_actions_disabled default and human approval for performance recommendation actions',
      'Safety note — does not replace professional financial expertise',
      'Audit trail via commerce_performance_audit_log — briefing, recommendation, and report events'
    ),
    'operators_should_understand', jsonb_build_array(
      'Commerce performance is operational intelligence — Fiken remains accounting source of truth',
      'Cross-links Trust & Action Engine — sensitive commercial actions may need approval context',
      'Distinct from Revenue Intelligence Phase 39 — subscription MRR/ARR vs product profit',
      'Platform aggregates only at platform governance — tenant data stays tenant-scoped'
    ),
    'audit_note', 'commerce_performance_executive_report_generated, commerce_performance_recommendation_action — metadata only.'
  );
$$;

create or replace function public._cppbp104_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Limitation principles — sustainability not extraction in profitability intelligence.',
    'must_avoid', jsonb_build_array(
      'Growth-at-any-cost framing that ignores margin or customer experience',
      'Short-term-only optimization that sacrifices long-term profitability',
      'Ignoring customer experience for volume or conversion metrics alone',
      'Treating metrics as the sole definition of business success'
    ),
    'required', jsonb_build_array(
      'Human oversight for performance actions — auto_actions_disabled default true',
      'Explainable profit classifications with cost and return context',
      'Growth quality analysis — margin impact before celebrating revenue alone',
      'Commerce Companion tone — Aipify informs and prepares; humans decide'
    ),
    'boundary_note', 'More sales ≠ better business — wisdom guides ambition.'
  );
$$;

create or replace function public._cppbp104_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Dogfooding — validate commerce performance patterns on real catalog profitability before broad rollout.',
    'sportsklaer_no', jsonb_build_object(
      'slug', 'sportsklaer-no',
      'role', 'Sportsklær.no — active lifestyle commerce dogfooding',
      'focus', jsonb_build_array(
        'Shopify catalog profit contribution — fitness and sustainable living categories',
        'Seasonal margin patterns — hydration and training accessories',
        'Supplier landed cost awareness — Nordic fitness supply profitability',
        'Return rate monitoring on electronics and weak-fit categories',
        'Commerce Companion tone — calm margin review, not alarmist growth pressure'
      )
    ),
    'integrations', jsonb_build_object(
      'shopify', 'Platform Install / Shopify — order and catalog metadata for profit contribution',
      'fiken', 'Fiken — accounting source of truth; Aipify operational intelligence layer only',
      'stripe', 'Stripe — payment metadata patterns; no raw payment records in performance tables'
    ),
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal validation — limitation principles, leadership insights, KC FAQ',
      'focus', jsonb_build_array(
        'Commerce Companion profitability guidance examples (🦉🌹🔔)',
        'Distinction from Revenue Intelligence Phase 39 in ILM and dashboard',
        'Knowledge Center FAQ — implementation-blueprint-phase104-faq'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce performance cross-links',
      'focus', jsonb_build_array(
        'Profit intelligence with human approval workflow',
        'Cross-link Commerce Intelligence Phase 101 and Dropshipping Operations Phase 103',
        'Executive commerce briefing generation with human interpretation'
      )
    )
  );
$$;

create or replace function public._cppbp104_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We finally understand what truly drives profitability in our business.',
    'More sales ≠ better business — balance growth with profitability.',
    'Revenue measures activity; profitability reflects sustainability.',
    '🦉 Margin context before scaling — humans retain financial oversight.',
    '🌹 Celebrate sustainable profit contributors — not volume-only leaders.',
    '🔔 Review when returns, ad spend, or weak margins need attention.',
    'Aipify Commerce Companion informs and prepares — does not replace professional financial expertise.',
    'Fiken remains accounting source of truth — Aipify is the operational intelligence layer.'
  );
$$;

create or replace function public._cppbp104_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'commerce_intelligence_phase101', 'label', 'Commerce Intelligence (Blueprint Phase 101)', 'route', '/app/commerce-intelligence', 'note', 'Discovery/opportunity — distinct from profit operations'),
    jsonb_build_object('key', 'product_automation_phase102', 'label', 'Product Automation (Phase 102)', 'route', '/app/product-automation', 'note', 'Catalog automation cross-link'),
    jsonb_build_object('key', 'dropshipping_operations_phase103', 'label', 'Dropshipping Operations (Phase 103)', 'route', '/app/dropshipping-operations', 'note', 'Operational margin and supplier context'),
    jsonb_build_object('key', 'revenue_intelligence_phase39', 'label', 'Revenue Intelligence (Blueprint Phase 39)', 'route', '/app/commercial', 'note', 'Subscription MRR/ARR only — NOT product profit'),
    jsonb_build_object('key', 'integration_engine_fiken_stripe', 'label', 'Integration Engine — Fiken & Stripe', 'route', '/app/integration-engine', 'note', 'Fiken = accounting source of truth; Aipify = operational intelligence'),
    jsonb_build_object('key', 'enterprise_pricing', 'label', 'Enterprise Pricing Philosophy', 'route', '/app/settings/billing', 'note', 'Aipify licensing — distinct from product pricing insights'),
    jsonb_build_object('key', 'license_center', 'label', 'License & Trust Center', 'route', '/app/license', 'note', 'Trust and ownership transparency'),
    jsonb_build_object('key', 'purpose_values_phase95', 'label', 'Purpose & Values (Blueprint Phase 95)', 'route', '/app/purpose-values-engine', 'note', 'Values-aware commercial prioritization'),
    jsonb_build_object('key', 'decision_support', 'label', 'Decision Support Engine', 'route', '/app/assistant/decisions', 'note', 'Trade-offs and confidence — humans decide'),
    jsonb_build_object('key', 'business_dna', 'label', 'Business DNA Engine', 'route', '/app/settings/business-dna', 'note', 'Tone and support knowledge — cross-link'),
    jsonb_build_object('key', 'platform_install', 'label', 'Platform Install', 'route', '/app/platform-install', 'note', 'Shopify and connected store catalog context'),
    jsonb_build_object('key', 'self_love_a76', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Sustainable pacing — principle only'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'route', '/app/knowledge-center', 'note', 'Commerce performance guides and FAQ')
  );
$$;

create or replace function public._cppbp104_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_metrics jsonb;
  v_products int := 0;
  v_profit_reports int := 0;
  v_risks int := 0;
begin
  perform public._cpp_ensure_settings(p_tenant_id);
  v_metrics := public._cpp_refresh_metrics(p_tenant_id);

  select count(*) into v_products from public.product_profitability_profiles where tenant_id = p_tenant_id;
  select count(*) into v_profit_reports from public.profit_intelligence_reports where tenant_id = p_tenant_id;
  select count(*) into v_risks from public.loss_prevention_events where tenant_id = p_tenant_id and resolved = false;

  return jsonb_build_object(
    'performance_score', coalesce((v_metrics->>'performance_score')::numeric, 0),
    'performance_classification', v_metrics->>'performance_classification',
    'total_revenue', coalesce((v_metrics->>'total_revenue')::numeric, 0),
    'estimated_profit', coalesce((v_metrics->>'estimated_profit')::numeric, 0),
    'avg_net_margin_percent', coalesce((v_metrics->>'avg_net_margin_percent')::numeric, 0),
    'products_tracked', v_products,
    'profit_intelligence_reports', v_profit_reports,
    'open_risks', v_risks,
    'opportunity_count', coalesce((v_metrics->>'opportunity_count')::int, 0),
    'profit_risk_products', coalesce((v_metrics->>'profit_risk_products')::int, 0),
    'objectives_documented', jsonb_array_length(public._cppbp104_objectives()),
    'performance_dimensions', jsonb_array_length(public._cppbp104_performance_dashboard()->'dimensions'),
    'companion_examples', jsonb_array_length(public._cppbp104_companion_guidance()->'examples'),
    'integration_links', jsonb_array_length(public._cppbp104_integration_links()),
    'privacy_note', 'Aggregate commerce performance counts and blueprint scaffolds only — no raw orders, payment records, or PII.'
  );
end; $$;

create or replace function public._cppbp104_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_products int := 0;
begin
  perform public._cpp_ensure_settings(p_tenant_id);
  perform public._cpp_seed_products(p_tenant_id);
  perform public._cpp_seed_insights(p_tenant_id);
  v_engagement := public._cppbp104_engagement_summary(p_tenant_id);
  v_products := coalesce((v_engagement->>'products_tracked')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'profit_visibility',
      'label', 'Profit visibility — gross and net margin signals (🦉)',
      'met', coalesce((v_engagement->>'avg_net_margin_percent')::numeric, 0) > 0,
      'note', 'Margin percent from product profitability profiles.'
    ),
    jsonb_build_object(
      'key', 'product_performance',
      'label', 'Product performance — profitability profiles tracked',
      'met', v_products >= 1,
      'note', case when v_products < 1 then 'Seed product profitability profiles.' else null end
    ),
    jsonb_build_object(
      'key', 'revenue_intelligence',
      'label', 'Revenue intelligence — trend reports with margin context',
      'met', exists (select 1 from public.revenue_trend_reports where tenant_id = p_tenant_id limit 1),
      'note', 'Revenue trends on dashboard — baseline Phase 104 preserved.'
    ),
    jsonb_build_object(
      'key', 'cost_awareness',
      'label', 'Cost visibility — supplier, shipping, ads, refunds documented',
      'met', jsonb_array_length(public._cppbp104_cost_visibility()->'categories') >= 5,
      'note', 'Fiken = accounting source of truth.'
    ),
    jsonb_build_object(
      'key', 'strategic_prioritization',
      'label', 'Strategic prioritization — opportunity and strategic recommendations',
      'met', exists (select 1 from public.strategic_performance_recommendations where tenant_id = p_tenant_id limit 1),
      'note', null
    ),
    jsonb_build_object(
      'key', 'sustainable_growth',
      'label', 'Sustainable growth — growth quality analysis steps documented',
      'met', jsonb_array_length(public._cppbp104_growth_quality_analysis()->'steps') >= 5,
      'note', 'Quality of growth over volume alone.'
    ),
    jsonb_build_object(
      'key', 'profit_intelligence',
      'label', 'Profit intelligence — margin dimensions (🦉🌹🔔)',
      'met', jsonb_array_length(public._cppbp104_profit_intelligence()->'dimensions') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'product_performance_insights',
      'label', 'Product performance insights — insight types documented',
      'met', jsonb_array_length(public._cppbp104_product_performance_insights()->'insight_types') >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'pricing_insights',
      'label', 'Pricing insights — margin-aware dimensions (🦉🌹🔔)',
      'met', jsonb_array_length(public._cppbp104_pricing_insights()->'dimensions') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Commerce Companion guidance — sustainability not extraction',
      'met', jsonb_array_length(public._cppbp104_companion_guidance()->'examples') >= 3,
      'note', 'Commerce Companion — not generic AI finance bot.'
    ),
    jsonb_build_object(
      'key', 'leadership_insights',
      'label', 'Leadership insights — executive profitability framing (📈🦉🌹🔔)',
      'met', jsonb_array_length(public._cppbp104_leadership_insights()->'dimensions') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'limitation_principles',
      'label', 'Limitation principles — no growth-at-any-cost',
      'met', jsonb_array_length(public._cppbp104_limitation_principles()->'must_avoid') >= 4,
      'note', 'Sustainability not extraction.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — transparent scores and human approval',
      'met', jsonb_array_length(public._cppbp104_trust_connection()->'users_should_see') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — sustainable commercial pacing',
      'met', jsonb_array_length(public._cppbp104_self_love_connection()->'quotes') >= 2,
      'note', 'Profitability clarity before scale protects wellbeing.'
    ),
    jsonb_build_object(
      'key', 'commerce_strategy_connection',
      'label', 'Commerce strategy connection — profitable growth alignment',
      'met', jsonb_array_length(public._cppbp104_commerce_strategy_connection()->'dimensions') >= 4,
      'note', 'Cross-link Purpose & Values Phase 95.'
    ),
    jsonb_build_object(
      'key', 'baseline_preserved',
      'label', 'Repo Phase 104 baseline fields preserved on dashboard',
      'met', to_regclass('public.commerce_performance_settings') is not null,
      'note', '_cpp_* tables and RPC behavior intact.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links Phases 101–103, Phase 39, Fiken/Stripe, Enterprise Pricing',
      'met', jsonb_array_length(public._cppbp104_integration_links()) >= 12,
      'note', 'Revenue Intelligence Phase 39 distinction documented.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Sportsklær.no, Shopify, Fiken, Stripe, supplier profitability',
      'met', (public._cppbp104_dogfooding()->'sportsklaer_no') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS principle — sustainability not extraction',
      'met', true,
      'note', 'Humans retain financial oversight; Aipify informs and prepares.'
    )
  );
end; $$;

create or replace function public._cppbp104_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 104 — Commerce Performance & Profit Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE104_COMMERCE_PERFORMANCE_PROFIT.md',
    'engine_phase', 'Repo Phase 104 Commerce Performance & Profit Engine',
    'route', '/app/commerce-performance',
    'mapping_note', 'ABOS Blueprint Phase 104 extends repo Phase 104 with sustainability-guided profitability scaffolding. Distinct from Commerce Intelligence Phase 101 and Revenue Intelligence Blueprint Phase 39.',
    'distinction_note', public._cppbp104_distinction_note(),
    'mission', public._cppbp104_mission(),
    'philosophy', public._cppbp104_philosophy(),
    'abos_principle', public._cppbp104_abos_principle(),
    'objectives', public._cppbp104_objectives(),
    'performance_dashboard', public._cppbp104_performance_dashboard(),
    'profit_intelligence', public._cppbp104_profit_intelligence(),
    'product_performance_insights', public._cppbp104_product_performance_insights(),
    'growth_quality_analysis', public._cppbp104_growth_quality_analysis(),
    'cost_visibility', public._cppbp104_cost_visibility(),
    'companion_guidance', public._cppbp104_companion_guidance(),
    'pricing_insights', public._cppbp104_pricing_insights(),
    'commerce_strategy_connection', public._cppbp104_commerce_strategy_connection(),
    'self_love_connection', public._cppbp104_self_love_connection(),
    'leadership_insights', public._cppbp104_leadership_insights(),
    'trust_connection', public._cppbp104_trust_connection(),
    'limitation_principles', public._cppbp104_limitation_principles(),
    'dogfooding', public._cppbp104_dogfooding(),
    'success_criteria', public._cppbp104_success_criteria(p_tenant_id),
    'vision', public._cppbp104_vision(),
    'vision_phrases', public._cppbp104_vision_phrases(),
    'integration_links', public._cppbp104_integration_links(),
    'engagement_summary', public._cppbp104_engagement_summary(p_tenant_id),
    'privacy_note', 'Commerce performance blueprint data is metadata only — profit classifications, trend summaries, cost category scaffolds. Does not replace professional financial expertise. Humans decide; Aipify Commerce Companion informs and prepares.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Card RPC — preserve ALL baseline fields; append Phase 104
-- ---------------------------------------------------------------------------
create or replace function public.get_commerce_performance_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb; v_engagement jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._cpp_ensure_settings(v_tenant_id);
  v_metrics := public._cpp_refresh_metrics(v_tenant_id);
  v_engagement := public._cppbp104_engagement_summary(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'performance_score', v_metrics->'performance_score',
    'performance_classification', v_metrics->'performance_classification',
    'philosophy', 'Revenue is important. Profit is essential.',
    'human_oversight_required', true,
    'implementation_blueprint_phase104', jsonb_build_object(
      'phase', 'Phase 104 — Commerce Performance & Profit Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE104_COMMERCE_PERFORMANCE_PROFIT.md',
      'engine_phase', 'Repo Phase 104 Commerce Performance & Profit Engine',
      'route', '/app/commerce-performance',
      'mapping_note', 'ABOS Blueprint Phase 104 extends repo Phase 104 — sustainability not extraction. Distinct from Phase 101 discovery and Phase 39 MRR/ARR.'
    ),
    'commerce_performance_mission', public._cppbp104_mission(),
    'commerce_performance_abos_principle', public._cppbp104_abos_principle(),
    'commerce_performance_engagement_summary', v_engagement,
    'commerce_performance_note', 'Commerce Performance & Profit Engine (ABOS Phase 104) — meaningful profitability insights; humans retain financial oversight.',
    'commerce_performance_vision_note', public._cppbp104_vision()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Dashboard RPC — preserve ALL baseline fields; append Phase 104
-- ---------------------------------------------------------------------------
create or replace function public.get_commerce_performance_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.commerce_performance_settings;
  v_metrics jsonb;
begin
  v_tenant_id := public._cpp_require_tenant();
  v_settings := public._cpp_ensure_settings(v_tenant_id);
  perform public._cpp_seed_products(v_tenant_id);
  perform public._cpp_seed_insights(v_tenant_id);
  v_metrics := public._cpp_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'auto_actions_disabled', v_settings.auto_actions_disabled,
    'philosophy', 'Revenue is important. Profit is essential.',
    'safety_note', 'Aipify provides decision-support insights — organizations remain responsible for commercial actions. Does not replace professional financial expertise.',
    'engine_enabled', v_settings.engine_enabled,
    'margin_alert_threshold', v_settings.margin_alert_threshold,
    'performance_score', v_metrics->'performance_score',
    'performance_classification', v_metrics->'performance_classification',
    'total_revenue', v_metrics->'total_revenue',
    'estimated_profit', v_metrics->'estimated_profit',
    'avg_net_margin_percent', v_metrics->'avg_net_margin_percent',
    'open_risks', v_metrics->'open_risks',
    'opportunity_count', v_metrics->'opportunity_count',
    'products_tracked', v_metrics->'products_tracked',
    'profit_risk_products', v_metrics->'profit_risk_products',
    'profit_intelligence', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'report_type', r.report_type, 'title', r.title,
        'summary', r.summary, 'observation', r.observation, 'impact_level', r.impact_level
      ) order by r.created_at desc)
      from public.profit_intelligence_reports r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'product_profitability', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'product_key', p.product_key, 'product_name', p.product_name,
        'category', p.category, 'revenue_contribution', p.revenue_contribution,
        'gross_margin_percent', p.gross_margin_percent, 'net_margin_percent', p.net_margin_percent,
        'profit_contribution_percent', p.profit_contribution_percent,
        'profit_classification', p.profit_classification, 'seasonal_pattern', p.seasonal_pattern
      ) order by p.profit_contribution_percent desc)
      from public.product_profitability_profiles p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'customer_value_signals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'observation_type', c.observation_type, 'title', c.title,
        'summary', c.summary, 'trend_direction', c.trend_direction
      ) order by c.created_at desc)
      from public.customer_value_observations c where c.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'revenue_trends', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'period_label', r.period_label, 'revenue_amount', r.revenue_amount,
        'profit_amount', r.profit_amount, 'margin_percent', r.margin_percent,
        'trend_signal', r.trend_signal, 'summary', r.summary
      ) order by r.period_start desc)
      from public.revenue_trend_reports r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'performance_opportunities', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id, 'opportunity_type', o.opportunity_type, 'title', o.title,
        'summary', o.summary, 'rationale', o.rationale, 'priority', o.priority
      ) order by o.created_at desc)
      from public.performance_opportunity_recommendations o where o.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'loss_prevention', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'event_type', l.event_type, 'title', l.title,
        'summary', l.summary, 'severity', l.severity, 'resolved', l.resolved
      ) order by l.detected_at desc)
      from public.loss_prevention_events l where l.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'strategic_recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'section', s.section, 'title', s.title, 'summary', s.summary,
        'recommendation_type', s.recommendation_type, 'priority', s.priority, 'rationale', s.rationale
      ) order by s.created_at desc)
      from public.strategic_performance_recommendations s where s.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'executive_reports', coalesce((
      select jsonb_agg(jsonb_build_object('id', e.id, 'summary', e.summary, 'created_at', e.created_at)
        order by e.created_at desc)
      from public.executive_commerce_reports e where e.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'commerce_intelligence', 'Product opportunities and margin signals',
      'product_automation', 'Catalog quality and readiness',
      'dropshipping_operations', 'Operational stability and supplier context',
      'knowledge_center', 'Commerce performance guides and FAQ'
    ),
    'implementation_blueprint_phase104', jsonb_build_object(
      'phase', 'Phase 104 — Commerce Performance & Profit Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE104_COMMERCE_PERFORMANCE_PROFIT.md',
      'engine_phase', 'Repo Phase 104 Commerce Performance & Profit Engine',
      'route', '/app/commerce-performance',
      'mapping_note', 'ABOS Blueprint Phase 104 extends repo Phase 104 — sustainability not extraction. Distinct from Commerce Intelligence Phase 101 and Revenue Intelligence Blueprint Phase 39.'
    ),
    'commerce_performance_engine_note', 'Commerce Performance & Profit Engine (ABOS Phase 104) — transform operational data into meaningful profitability insights — wisdom guides ambition.',
    'commerce_performance_blueprint', public._cppbp104_blueprint_block(v_tenant_id),
    'commerce_performance_distinction_note', public._cppbp104_distinction_note(),
    'commerce_performance_mission', public._cppbp104_mission(),
    'commerce_performance_philosophy', public._cppbp104_philosophy(),
    'commerce_performance_abos_principle', public._cppbp104_abos_principle(),
    'commerce_performance_objectives', public._cppbp104_objectives(),
    'commerce_performance_dashboard_meta', public._cppbp104_performance_dashboard(),
    'commerce_profit_intelligence_meta', public._cppbp104_profit_intelligence(),
    'commerce_product_performance_insights', public._cppbp104_product_performance_insights(),
    'commerce_growth_quality_analysis', public._cppbp104_growth_quality_analysis(),
    'commerce_cost_visibility', public._cppbp104_cost_visibility(),
    'commerce_companion_guidance', public._cppbp104_companion_guidance(),
    'commerce_pricing_insights', public._cppbp104_pricing_insights(),
    'commerce_strategy_connection', public._cppbp104_commerce_strategy_connection(),
    'commerce_self_love_connection', public._cppbp104_self_love_connection(),
    'commerce_leadership_insights', public._cppbp104_leadership_insights(),
    'commerce_trust_connection', public._cppbp104_trust_connection(),
    'commerce_limitation_principles', public._cppbp104_limitation_principles(),
    'commerce_performance_dogfooding', public._cppbp104_dogfooding(),
    'cppbp104_integration_links', public._cppbp104_integration_links(),
    'commerce_performance_engagement_summary', public._cppbp104_engagement_summary(v_tenant_id),
    'commerce_performance_success_criteria', public._cppbp104_success_criteria(v_tenant_id),
    'commerce_performance_vision', public._cppbp104_vision(),
    'commerce_performance_vision_phrases', public._cppbp104_vision_phrases(),
    'commerce_performance_privacy_note', 'Commerce performance metadata only — profit classifications and trend summaries. Does not replace professional financial expertise. Fiken = accounting source of truth. Humans decide; Aipify Commerce Companion informs and prepares.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._cppbp104_distinction_note() to authenticated;
grant execute on function public._cppbp104_mission() to authenticated;
grant execute on function public._cppbp104_philosophy() to authenticated;
grant execute on function public._cppbp104_abos_principle() to authenticated;
grant execute on function public._cppbp104_vision() to authenticated;
grant execute on function public._cppbp104_objectives() to authenticated;
grant execute on function public._cppbp104_performance_dashboard() to authenticated;
grant execute on function public._cppbp104_profit_intelligence() to authenticated;
grant execute on function public._cppbp104_product_performance_insights() to authenticated;
grant execute on function public._cppbp104_growth_quality_analysis() to authenticated;
grant execute on function public._cppbp104_cost_visibility() to authenticated;
grant execute on function public._cppbp104_companion_guidance() to authenticated;
grant execute on function public._cppbp104_pricing_insights() to authenticated;
grant execute on function public._cppbp104_commerce_strategy_connection() to authenticated;
grant execute on function public._cppbp104_self_love_connection() to authenticated;
grant execute on function public._cppbp104_leadership_insights() to authenticated;
grant execute on function public._cppbp104_trust_connection() to authenticated;
grant execute on function public._cppbp104_limitation_principles() to authenticated;
grant execute on function public._cppbp104_dogfooding() to authenticated;
grant execute on function public._cppbp104_vision_phrases() to authenticated;
grant execute on function public._cppbp104_integration_links() to authenticated;
grant execute on function public._cppbp104_engagement_summary(uuid) to authenticated;
grant execute on function public._cppbp104_success_criteria(uuid) to authenticated;
grant execute on function public._cppbp104_blueprint_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'commerce-performance-blueprint-phase104', 'Commerce Performance & Profit (ABOS Phase 104)',
  'Commerce Performance & Profit Engine — meaningful profitability insights, cost visibility, growth quality analysis, and leadership framing. Sustainability not extraction; humans retain financial oversight.',
  'authenticated', 131
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'commerce-performance-blueprint-phase104' and tenant_id is null
);
