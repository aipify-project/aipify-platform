-- Implementation Blueprint Phase 103 — Dropshipping Operations Center Engine
-- Extends Dropshipping Operations Center repo Phase 103. No new tables.
-- Distinct from Product Automation Blueprint Phase 102 at /app/product-automation.
-- Distinct from Commerce Intelligence Blueprint Phase 101 at /app/commerce-intelligence.
-- Distinct from Commerce Performance & Profit repo Phase 104 at /app/commerce-performance.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._docbp103_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 103 — Dropshipping Operations Center Engine at /app/dropshipping-operations. Extends Dropshipping Operations Center repo Phase 103 (_doc_*) and preserves ALL baseline dashboard and card fields. Profitable, sustainable dropshipping via intelligent coordination — wisdom guides operations, not listing thousands of products. Distinct from Product Automation Blueprint Phase 102 at /app/product-automation (import/enrichment vs operations). Distinct from Commerce Intelligence Blueprint Phase 101 at /app/commerce-intelligence (discovery vs operations). Distinct from Commerce Performance & Profit repo Phase 104 at /app/commerce-performance (profit cross-link). Phase collision note: roadmap text once listed Phase 102 Dropshipping — repo assigns Dropshipping to Phase 103 and Product Automation to Phase 102. Cross-links Integration Engine A.8, Trust & Action /app/approvals, Commerce Intelligence Phase 101, Product Automation Phase 102, Commerce Performance Phase 104. Helpers use _docbp103_* — never collide with _doc_*.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._docbp103_mission()
returns text language sql immutable as $$
  select 'Profitable, sustainable dropshipping via intelligent coordination.';
$$;

create or replace function public._docbp103_philosophy()
returns text language sql immutable as $$
  select 'Right products + reliable suppliers + positive customer experience — wisdom guides operations, not listing thousands of products.';
$$;

create or replace function public._docbp103_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — humans accountable. Aipify Operations Companion informs and prepares supplier monitoring, order visibility, delivery intelligence, and profitability insights; manual supplier actions and approval gates remain default; no silent auto-removal.';
$$;

create or replace function public._docbp103_vision()
returns text language sql immutable as $$
  select 'We understand our operations better than ever before.';
$$;

create or replace function public._docbp103_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'supplier_monitoring', 'label', 'Supplier monitoring', 'emoji', '🦉', 'description', 'Reliability, delivery consistency, quality signals, and escalation readiness'),
    jsonb_build_object('key', 'order_visibility', 'label', 'Order visibility', 'emoji', '🌹', 'description', 'End-to-end order tracking from receipt through customer follow-up'),
    jsonb_build_object('key', 'profit_tracking', 'label', 'Profit tracking', 'emoji', '🔔', 'description', 'Margin, shipping cost, supplier fee, and advertising impact awareness'),
    jsonb_build_object('key', 'delivery_intelligence', 'label', 'Delivery intelligence', 'emoji', '🦉', 'description', 'Delay detection, regional disruption awareness, proactive customer messaging'),
    jsonb_build_object('key', 'product_lifecycle', 'label', 'Product lifecycle', 'emoji', '🌹', 'description', 'Launch → monitor → optimize → evaluate profitability → retire — no silent changes'),
    jsonb_build_object('key', 'operational_decision_support', 'label', 'Operational decision support', 'emoji', '🔔', 'description', 'Recommendations with rationale — humans decide every supplier action')
  );
$$;

create or replace function public._docbp103_dropshipping_dashboard()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Dropshipping operations dashboard — metadata summaries for orders, suppliers, revenue, and top products; never raw customer PII or payment records.',
    'metrics', jsonb_build_array(
      jsonb_build_object('key', 'orders_in_progress', 'label', 'Orders in progress', 'description', 'Active fulfillment pipeline count — supplier confirmed through in transit'),
      jsonb_build_object('key', 'orders_delivered', 'label', 'Orders delivered', 'description', 'Completed delivery count for rolling period'),
      jsonb_build_object('key', 'orders_delayed', 'label', 'Orders delayed', 'description', 'Orders exceeding expected delivery window — escalation signals'),
      jsonb_build_object('key', 'refund_requests', 'label', 'Refund requests', 'description', 'Open refund and return request count — trend metadata only'),
      jsonb_build_object('key', 'supplier_performance', 'label', 'Supplier performance', 'description', 'Aggregate health scores and status levels from supplier monitoring'),
      jsonb_build_object('key', 'revenue', 'label', 'Revenue', 'description', 'Illustrative revenue trend — cross-link Commerce Performance Phase 104 for profit detail'),
      jsonb_build_object('key', 'profit_margins', 'label', 'Profit margins', 'description', 'Estimated margin percent after shipping and supplier fees'),
      jsonb_build_object('key', 'top_performing_products', 'label', 'Top-performing products', 'description', 'Products with strong margin and low complaint volume — watchlist aligned')
    ),
    'boundary_note', 'Dashboard metrics are operational metadata — humans verify before supplier or catalog decisions.'
  );
$$;

create or replace function public._docbp103_supplier_intelligence()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Supplier intelligence — reliability and relationship quality before scaling order volume.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'delivery_quality_patterns', 'label', 'Delivery and quality patterns', 'description', 'Delivery consistency, quality indicators, complaint patterns — metadata summaries'),
      jsonb_build_object('emoji', '🌹', 'key', 'trusted_partners', 'label', 'Trusted partners', 'description', 'Trusted and stable suppliers — relationship over volume for active lifestyle catalog'),
      jsonb_build_object('emoji', '🔔', 'key', 'escalation_signals', 'label', 'Escalation signals', 'description', 'When monitor_closely or escalation_recommended status should pause new orders — human approval always')
    ),
    'commerce_intelligence_route', '/app/commerce-intelligence',
    'boundary_note', 'Supplier scores are illustrative — humans validate relationships, samples, and contracts.'
  );
$$;

create or replace function public._docbp103_order_tracking_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Order tracking center — visibility across fulfillment lifecycle without replacing Shopify or supplier systems.',
    'steps', jsonb_build_array(
      jsonb_build_object('key', 'order_received', 'label', 'Order received', 'description', 'Customer order captured from connected store — metadata only'),
      jsonb_build_object('key', 'supplier_confirmed', 'label', 'Supplier confirmed', 'description', 'Supplier acknowledged order and stock allocation'),
      jsonb_build_object('key', 'shipped', 'label', 'Shipped', 'description', 'Shipment handoff to carrier — tracking reference when available'),
      jsonb_build_object('key', 'in_transit', 'label', 'In transit', 'description', 'Active delivery window — delay detection applies'),
      jsonb_build_object('key', 'delivered', 'label', 'Delivered', 'description', 'Delivery confirmed — customer experience follow-up eligible'),
      jsonb_build_object('key', 'customer_follow_up', 'label', 'Customer follow-up', 'description', 'Post-delivery satisfaction and support touchpoint — never automated personal messages')
    ),
    'integration_engine_route', '/app/integration-engine',
    'boundary_note', 'Tracking steps are operational scaffolding — Aipify orchestrates visibility, not carrier systems.'
  );
$$;

create or replace function public._docbp103_risk_monitoring()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Risk monitoring — early operational signals without alarmist automation or silent catalog changes.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'delivery_delays', 'label', 'Delivery delays', 'description', 'Extended delivery estimates and regional disruption events'),
      jsonb_build_object('key', 'refund_rates', 'label', 'Refund rates', 'description', 'Refund activity trends — stable, improving, or worsening metadata'),
      jsonb_build_object('key', 'supplier_communication', 'label', 'Supplier communication', 'description', 'Responsiveness and escalation patterns — open escalations tracked'),
      jsonb_build_object('key', 'quality_concerns', 'label', 'Quality concerns', 'description', 'Quality indicator shifts and complaint pattern changes'),
      jsonb_build_object('key', 'complaint_volumes', 'label', 'Complaint volumes', 'description', 'Shipping and product complaint frequency — order health insights cross-link')
    ),
    'approvals_route', '/app/approvals',
    'boundary_note', 'Risk signals inform — humans decide supplier changes and customer messaging.'
  );
$$;

create or replace function public._docbp103_profitability_intelligence()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Profitability intelligence — margin clarity before scale; cross-link Commerce Performance Phase 104 for profit operations.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'margin_tracking', 'label', 'Margin tracking', 'description', 'Estimated net margin after supplier cost — compared to tenant thresholds'),
      jsonb_build_object('key', 'shipping_costs', 'label', 'Shipping costs', 'description', 'Shipping cost variability and regional impact on landed margin'),
      jsonb_build_object('key', 'supplier_fees', 'label', 'Supplier fees', 'description', 'Supplier fees, handling charges, and pricing volatility signals'),
      jsonb_build_object('key', 'advertising_impact', 'label', 'Advertising impact', 'description', 'Ad spend dependency notes — weak net margin warnings when ad-heavy')
    ),
    'commerce_performance_route', '/app/commerce-performance',
    'boundary_note', 'Profitability intelligence supports decisions — do not duplicate Phase 104 profit dashboard.'
  );
$$;

create or replace function public._docbp103_top_product_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Top product insights — margin and trust alignment over catalog volume.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'margin_vs_complaints', 'label', 'Margin vs complaint volume', 'description', 'Which products drive margin vs operational stress — metadata only'),
      jsonb_build_object('emoji', '🌹', 'key', 'store_aligned_winners', 'label', 'Store-aligned winners', 'description', 'Top performers aligned with active lifestyle catalog and customer trust'),
      jsonb_build_object('emoji', '🔔', 'key', 'review_before_removal', 'label', 'Review before removal', 'description', 'When underperforming products need human review — no silent auto-removal')
    ),
    'product_automation_route', '/app/product-automation',
    'boundary_note', 'Product insights prepare lifecycle decisions — humans approve retire or scale actions.'
  );
$$;

create or replace function public._docbp103_product_lifecycle_management()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Product lifecycle management — thoughtful catalog pacing over reactive churn.',
    'steps', jsonb_build_array(
      jsonb_build_object('key', 'launch', 'label', 'Launch', 'description', 'New product added after Commerce Intelligence discovery and Product Automation approval'),
      jsonb_build_object('key', 'monitor', 'label', 'Monitor', 'description', 'Watchlist tracking — margin, trend, supplier quality signals'),
      jsonb_build_object('key', 'optimize', 'label', 'Optimize', 'description', 'SEO, pricing, and supplier review recommendations — human approval'),
      jsonb_build_object('key', 'evaluate_profitability', 'label', 'Evaluate profitability', 'description', 'Margin and refund trend review before scale or retire decision'),
      jsonb_build_object('key', 'retire', 'label', 'Retire', 'description', 'Consider discontinuing — requires explicit human approval; never silent removal')
    ),
    'boundary_note', 'Lifecycle steps are scaffolding — auto_actions_disabled remains default true.'
  );
$$;

create or replace function public._docbp103_customer_experience_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Customer experience connection — protect trust through delivery transparency and honest communication.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'delivery_expectations', 'label', 'Delivery expectations', 'description', 'Proactive messaging when delivery windows extend — reduces complaint frequency'),
      jsonb_build_object('key', 'satisfaction_signals', 'label', 'Satisfaction signals', 'description', 'Aggregate satisfaction and repeat purchase metadata — no raw review content'),
      jsonb_build_object('key', 'communication_quality', 'label', 'Communication quality', 'description', 'Support response patterns — cross-link Business DNA tone and ASO'),
      jsonb_build_object('key', 'refund_experiences', 'label', 'Refund experiences', 'description', 'Refund trend awareness — stable refund rates protect long-term trust')
    ),
    'support_operations_route', '/app/settings/support-operations',
    'boundary_note', 'CX connection is cross-link scaffolding — customer data stays tenant-scoped.'
  );
$$;

create or replace function public._docbp103_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Operations Companion guidance — calm, optional, non-intrusive. Wisdom guides operations.',
    'companion_name', 'Operations Companion',
    'not_label', 'AI dropship bot',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'supplier_context', 'prompt', 'Global Dropship Co delivery times have increased — would a supplier comparison summary help before you decide?', 'consideration', 'Context before action — humans approve escalations'),
      jsonb_build_object('emoji', '🌹', 'key', 'trusted_supplier', 'prompt', 'Nordic Fitness Supply scores remain strong — shall I prepare a limited test-volume checklist for the seasonal push?', 'consideration', 'Trusted relationships over catalog volume'),
      jsonb_build_object('emoji', '🔔', 'key', 'pause_before_removal', 'prompt', 'Budget Import Ltd quality signals are mixed — would pausing new orders while you review alternatives feel wise?', 'consideration', 'No silent auto-removal — Self Love cross-link for sustainable pacing')
    ),
    'boundary_note', 'Operations Companion scaffolds monitoring — never auto-changes suppliers or removes products.'
  );
$$;

create or replace function public._docbp103_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — sustainable operations pacing over reactive supplier firefighting.',
    'quotes', jsonb_build_array(
      'Sustainable dropshipping grows through reliable systems and patient supplier relationships — not constant catalog churn.',
      'Not every supplier problem needs an immediate fix tonight — rest is part of sustainable business operations.',
      'Margin clarity before scale protects wellbeing — rushed supplier switches create avoidable stress.',
      'Your catalog can evolve at a human pace — wisdom guides operations.'
    ),
    'practices', jsonb_build_array(
      'Pause before reactive supplier switching — evaluate alternatives with calm context',
      'Celebrate reliable fulfillment weeks — not only rapid catalog expansion',
      'Delivery delay awareness reduces customer stress — proactive messaging over panic',
      'Sustainable operations pacing — cross-link Self Love A.76 rhythms'
    ),
    'route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports wellbeing rhythms — principle only; Dropshipping Operations stores operational metadata, not personal wellbeing content.'
  );
$$;

create or replace function public._docbp103_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparent operations intelligence — explainable scores, human approval, audited actions.',
    'users_should_see', jsonb_build_array(
      'How operational scores combine supplier health, delivery risks, and order health insights — metadata only',
      'auto_actions_disabled default and human approval for supplier escalations and sensitive changes',
      'Safety note — no automatic product removal or supplier changes',
      'Audit trail via dropshipping_operations_audit_log — watchlist, escalation, briefing events'
    ),
    'operators_should_understand', jsonb_build_array(
      'Dropshipping operations is scaffolding — not automated dropship bots or silent catalog management',
      'Cross-links Trust & Action Engine — supplier actions may require approval at /app/approvals',
      'Integration Engine supplies connector context — do not bypass tenant connector policy',
      'Platform aggregates only at platform governance — tenant data stays tenant-scoped'
    ),
    'audit_note', 'doc_watchlist_added, doc_escalation_created, doc_briefing_generated — metadata only.',
    'approvals_route', '/app/approvals'
  );
$$;

create or replace function public._docbp103_approval_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Approval principles — humans accountable for every supplier and catalog decision.',
    'rules', jsonb_build_array(
      jsonb_build_object('key', 'manual_supplier_actions', 'label', 'Manual supplier actions', 'description', 'Supplier escalations, alternative evaluation, and relationship changes require human initiation'),
      jsonb_build_object('key', 'approval_required_automations', 'label', 'Approval-required automations', 'description', 'Any automation touching suppliers, catalog removal, or customer messaging requires explicit approval'),
      jsonb_build_object('key', 'auto_workflows_disabled', 'label', 'Auto workflows disabled by default', 'description', 'auto_actions_disabled true — no silent auto-removal or supplier switching'),
      jsonb_build_object('key', 'escalation_requires_approval', 'label', 'Escalation requires approval', 'description', 'create_supplier_escalation returns requires_approval true — Trust & Action cross-link')
    ),
    'approvals_route', '/app/approvals',
    'boundary_note', 'Approval gates protect customer trust — Aipify informs and prepares; humans execute.'
  );
$$;

create or replace function public._docbp103_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Dogfooding — validate dropshipping operations patterns on real catalog decisions before broad rollout.',
    'sportsklaer_no', jsonb_build_object(
      'slug', 'sportsklaer-no',
      'role', 'Sportsklær.no — active lifestyle dropshipping dogfooding',
      'focus', jsonb_build_array(
        'Shopify integration — order visibility and fulfillment metadata',
        'Supplier evaluation — Nordic fitness supply vs high-risk dropship patterns',
        'Margin analysis before seasonal campaigns — insulated bottles, training accessories',
        'Customer support patterns — delivery messaging and refund trend awareness',
        'Operations Companion tone — wisdom guides operations, not catalog volume'
      )
    ),
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal validation — approval principles, trust connection, KC FAQ',
      'focus', jsonb_build_array(
        'Operations Companion guidance examples (🦉🌹🔔)',
        'Approval principles — no silent auto-removal language in ILM',
        'Integration with Platform Install Phase 100 Shopify connectors',
        'Knowledge Center FAQ — implementation-blueprint-phase103-faq'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce operations cross-links',
      'focus', jsonb_build_array(
        'Supplier monitoring with human escalation workflow',
        'Order health insights alignment with support operations',
        'Commerce Performance Phase 104 profit cross-link'
      )
    )
  );
$$;

create or replace function public._docbp103_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We understand our operations better than ever before.',
    'Right products + reliable suppliers + positive customer experience.',
    'Wisdom guides operations — not listing thousands of products.',
    '🦉 Context before supplier action — delivery and quality patterns first.',
    '🌹 Trusted supplier relationships over reactive catalog churn.',
    '🔔 Pause when quality signals mixed — human approval before removal.',
    'Sustainable dropshipping grows through reliable systems.',
    'Aipify Operations Companion informs and prepares — humans decide every supplier action.'
  );
$$;

create or replace function public._docbp103_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'integration_engine_a8', 'label', 'Integration Engine (A.8)', 'route', '/app/integration-engine', 'note', 'Shopify and supplier connectors — approved sync metadata'),
    jsonb_build_object('key', 'commerce_intelligence_phase101', 'label', 'Commerce Intelligence (Blueprint Phase 101)', 'route', '/app/commerce-intelligence', 'note', 'Product discovery and supplier insights — distinct from operations'),
    jsonb_build_object('key', 'product_automation_phase102', 'label', 'Product Automation (Phase 102)', 'route', '/app/product-automation', 'note', 'Import and enrichment — cross-link after discovery approval'),
    jsonb_build_object('key', 'commerce_performance_phase104', 'label', 'Commerce Performance & Profit (Phase 104)', 'route', '/app/commerce-performance', 'note', 'Profit operations — cross-link for margin detail'),
    jsonb_build_object('key', 'trust_actions', 'label', 'Trust & Action Engine', 'route', '/app/approvals', 'note', 'Supplier actions requiring approval'),
    jsonb_build_object('key', 'platform_install_phase100', 'label', 'Platform Install (Phase 100)', 'route', '/app/platform-install', 'note', 'Connected store catalog and Shopify context'),
    jsonb_build_object('key', 'support_operations', 'label', 'Autonomous Support Operations', 'route', '/app/settings/support-operations', 'note', 'Customer support and refund pattern cross-link'),
    jsonb_build_object('key', 'business_dna', 'label', 'Business DNA Engine', 'route', '/app/settings/business-dna', 'note', 'Tone and support knowledge — cross-link only'),
    jsonb_build_object('key', 'decision_support', 'label', 'Decision Support Engine', 'route', '/app/assistant/decisions', 'note', 'Operational trade-offs — humans decide'),
    jsonb_build_object('key', 'self_love_a76', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Sustainable operations pacing — principle only'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'route', '/app/knowledge-center', 'note', 'Dropshipping operations guides and FAQ')
  );
$$;

create or replace function public._docbp103_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_metrics jsonb;
  v_suppliers int := 0;
  v_watchlists int := 0;
  v_risks int := 0;
  v_escalations int := 0;
begin
  perform public._doc_ensure_settings(p_tenant_id);
  v_metrics := public._doc_refresh_metrics(p_tenant_id);

  select count(*) into v_suppliers from public.supplier_monitoring_records where tenant_id = p_tenant_id;
  select count(*) into v_watchlists from public.dropshipping_product_watchlists where tenant_id = p_tenant_id and status = 'active';
  select count(*) into v_risks from public.delivery_risk_events where tenant_id = p_tenant_id and resolved = false;
  select count(*) into v_escalations from public.supplier_escalations where tenant_id = p_tenant_id and escalation_status = 'open';

  return jsonb_build_object(
    'operational_score', coalesce((v_metrics->>'operational_score')::numeric, 0),
    'health_classification', v_metrics->>'health_classification',
    'active_products', coalesce((v_metrics->>'active_products')::int, 0),
    'open_alerts', coalesce((v_metrics->>'open_alerts')::int, 0),
    'delivery_risks', coalesce((v_metrics->>'delivery_risks')::int, 0),
    'suppliers_monitored', v_suppliers,
    'open_escalations', v_escalations,
    'watchlist_count', v_watchlists,
    'objectives_documented', jsonb_array_length(public._docbp103_objectives()),
    'order_tracking_steps', jsonb_array_length(public._docbp103_order_tracking_center()->'steps'),
    'lifecycle_steps', jsonb_array_length(public._docbp103_product_lifecycle_management()->'steps'),
    'companion_examples', jsonb_array_length(public._docbp103_companion_guidance()->'examples'),
    'integration_links', jsonb_array_length(public._docbp103_integration_links()),
    'privacy_note', 'Aggregate dropshipping operations counts and blueprint scaffolds only — no raw customer content, orders, or PII.'
  );
end; $$;

create or replace function public._docbp103_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_suppliers int := 0;
begin
  perform public._doc_ensure_settings(p_tenant_id);
  perform public._doc_seed_suppliers(p_tenant_id);
  perform public._doc_seed_watchlists(p_tenant_id);
  perform public._doc_seed_risks_alerts(p_tenant_id);
  perform public._doc_seed_recommendations(p_tenant_id);
  v_engagement := public._docbp103_engagement_summary(p_tenant_id);
  v_suppliers := coalesce((v_engagement->>'suppliers_monitored')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'supplier_monitoring',
      'label', 'Supplier monitoring — reliability and escalation readiness (🦉🌹🔔)',
      'met', v_suppliers >= 1,
      'note', case when v_suppliers < 1 then 'Seed suppliers via dashboard load.' else null end
    ),
    jsonb_build_object(
      'key', 'order_visibility',
      'label', 'Order visibility — tracking center steps documented',
      'met', jsonb_array_length(public._docbp103_order_tracking_center()->'steps') >= 6,
      'note', 'Order received through customer follow-up.'
    ),
    jsonb_build_object(
      'key', 'profit_tracking',
      'label', 'Profit tracking — profitability intelligence dimensions',
      'met', jsonb_array_length(public._docbp103_profitability_intelligence()->'dimensions') >= 4,
      'note', 'Cross-link Commerce Performance Phase 104 for profit operations.'
    ),
    jsonb_build_object(
      'key', 'delivery_intelligence',
      'label', 'Delivery intelligence — risk monitoring dimensions',
      'met', jsonb_array_length(public._docbp103_risk_monitoring()->'dimensions') >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'product_lifecycle',
      'label', 'Product lifecycle — launch through retire steps',
      'met', jsonb_array_length(public._docbp103_product_lifecycle_management()->'steps') >= 5,
      'note', 'No silent auto-removal — auto_actions_disabled default.'
    ),
    jsonb_build_object(
      'key', 'operational_decision_support',
      'label', 'Operational decision support — recommendations with rationale',
      'met', exists (
        select 1 from public.operations_recommendations r where r.tenant_id = p_tenant_id limit 1
      ),
      'note', 'Baseline operations_recommendations preserved.'
    ),
    jsonb_build_object(
      'key', 'dropshipping_dashboard',
      'label', 'Dropshipping dashboard — operational metrics scaffold',
      'met', jsonb_array_length(public._docbp103_dropshipping_dashboard()->'metrics') >= 8,
      'note', null
    ),
    jsonb_build_object(
      'key', 'supplier_intelligence',
      'label', 'Supplier intelligence — reliability dimensions (🦉🌹🔔)',
      'met', jsonb_array_length(public._docbp103_supplier_intelligence()->'dimensions') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'top_product_insights',
      'label', 'Top product insights — margin and trust alignment (🦉🌹🔔)',
      'met', jsonb_array_length(public._docbp103_top_product_insights()->'dimensions') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'customer_experience_connection',
      'label', 'Customer experience connection — delivery and refund awareness',
      'met', jsonb_array_length(public._docbp103_customer_experience_connection()->'dimensions') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Operations Companion guidance — wisdom guides operations',
      'met', jsonb_array_length(public._docbp103_companion_guidance()->'examples') >= 3,
      'note', 'Operations Companion — not generic AI dropship bot.'
    ),
    jsonb_build_object(
      'key', 'approval_principles',
      'label', 'Approval principles — manual supplier actions, no silent automation',
      'met', jsonb_array_length(public._docbp103_approval_principles()->'rules') >= 4,
      'note', 'Cross-link Trust & Action /app/approvals.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — transparent scores and human approval',
      'met', jsonb_array_length(public._docbp103_trust_connection()->'users_should_see') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — sustainable operations pacing',
      'met', jsonb_array_length(public._docbp103_self_love_connection()->'quotes') >= 2,
      'note', 'Sustainable dropshipping — not constant catalog churn.'
    ),
    jsonb_build_object(
      'key', 'baseline_preserved',
      'label', 'Repo Phase 103 baseline fields preserved on dashboard',
      'met', to_regclass('public.dropshipping_operations_settings') is not null,
      'note', '_doc_* tables and RPC behavior intact.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links Commerce Intelligence 101, Product Automation 102, Commerce Performance 104, Integration, Approvals',
      'met', jsonb_array_length(public._docbp103_integration_links()) >= 10,
      'note', 'Phase collision note documented in distinction_note.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Sportsklær.no Shopify, supplier evaluation, margin analysis, support',
      'met', (public._docbp103_dogfooding()->'sportsklaer_no') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS principle — humans accountable',
      'met', true,
      'note', 'No silent auto-removal; Aipify informs and prepares.'
    )
  );
end; $$;

create or replace function public._docbp103_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 103 — Dropshipping Operations Center Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE103_DROPSHIPPING_OPERATIONS.md',
    'engine_phase', 'Repo Phase 103 Dropshipping Operations Center',
    'route', '/app/dropshipping-operations',
    'mapping_note', 'ABOS Blueprint Phase 103 extends repo Phase 103 with operations scaffolding. Distinct from Product Automation Phase 102 and Commerce Intelligence Phase 101. Phase collision: roadmap once listed Phase 102 Dropshipping — repo assigns Dropshipping to Phase 103.',
    'distinction_note', public._docbp103_distinction_note(),
    'mission', public._docbp103_mission(),
    'philosophy', public._docbp103_philosophy(),
    'abos_principle', public._docbp103_abos_principle(),
    'objectives', public._docbp103_objectives(),
    'dropshipping_dashboard', public._docbp103_dropshipping_dashboard(),
    'supplier_intelligence', public._docbp103_supplier_intelligence(),
    'order_tracking_center', public._docbp103_order_tracking_center(),
    'risk_monitoring', public._docbp103_risk_monitoring(),
    'profitability_intelligence', public._docbp103_profitability_intelligence(),
    'top_product_insights', public._docbp103_top_product_insights(),
    'product_lifecycle_management', public._docbp103_product_lifecycle_management(),
    'customer_experience_connection', public._docbp103_customer_experience_connection(),
    'companion_guidance', public._docbp103_companion_guidance(),
    'self_love_connection', public._docbp103_self_love_connection(),
    'trust_connection', public._docbp103_trust_connection(),
    'approval_principles', public._docbp103_approval_principles(),
    'dogfooding', public._docbp103_dogfooding(),
    'success_criteria', public._docbp103_success_criteria(p_tenant_id),
    'vision', public._docbp103_vision(),
    'vision_phrases', public._docbp103_vision_phrases(),
    'integration_links', public._docbp103_integration_links(),
    'engagement_summary', public._docbp103_engagement_summary(p_tenant_id),
    'privacy_note', 'Dropshipping operations blueprint data is metadata only — supplier scores, delivery risk summaries, order health trends. No silent automation. Humans decide; Aipify Operations Companion informs and prepares.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Card RPC — preserve ALL baseline fields; append Phase 103
-- ---------------------------------------------------------------------------
create or replace function public.get_dropshipping_operations_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb; v_engagement jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._doc_ensure_settings(v_tenant_id);
  v_metrics := public._doc_refresh_metrics(v_tenant_id);
  v_engagement := public._docbp103_engagement_summary(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'operational_score', v_metrics->'operational_score',
    'health_classification', v_metrics->'health_classification',
    'philosophy', 'Run your dropshipping business with confidence.',
    'human_oversight_required', true,
    'implementation_blueprint_phase103', jsonb_build_object(
      'phase', 'Phase 103 — Dropshipping Operations Center Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE103_DROPSHIPPING_OPERATIONS.md',
      'engine_phase', 'Repo Phase 103 Dropshipping Operations Center',
      'route', '/app/dropshipping-operations',
      'mapping_note', 'ABOS Blueprint Phase 103 extends repo Phase 103 — wisdom guides operations. Distinct from Product Automation Phase 102 and Commerce Intelligence Phase 101.'
    ),
    'dropshipping_operations_mission', public._docbp103_mission(),
    'dropshipping_operations_abos_principle', public._docbp103_abos_principle(),
    'dropshipping_operations_engagement_summary', v_engagement,
    'dropshipping_operations_note', 'Dropshipping Operations Center (ABOS Phase 103) — profitable, sustainable dropshipping via intelligent coordination; humans accountable.',
    'dropshipping_operations_vision_note', public._docbp103_vision()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Dashboard RPC — preserve ALL baseline fields; append Phase 103
-- ---------------------------------------------------------------------------
create or replace function public.get_dropshipping_operations_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.dropshipping_operations_settings;
  v_metrics jsonb;
begin
  v_tenant_id := public._doc_require_tenant();
  v_settings := public._doc_ensure_settings(v_tenant_id);
  perform public._doc_seed_suppliers(v_tenant_id);
  perform public._doc_seed_watchlists(v_tenant_id);
  perform public._doc_seed_risks_alerts(v_tenant_id);
  perform public._doc_seed_recommendations(v_tenant_id);
  v_metrics := public._doc_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'auto_actions_disabled', v_settings.auto_actions_disabled,
    'philosophy', 'Run your dropshipping business with confidence.',
    'safety_note', 'Aipify recommends actions — organizations remain responsible for operational decisions. No automatic product removal or supplier changes.',
    'operations_enabled', v_settings.operations_enabled,
    'operational_score', v_metrics->'operational_score',
    'health_classification', v_metrics->'health_classification',
    'active_products', v_metrics->'active_products',
    'open_alerts', v_metrics->'open_alerts',
    'delivery_risks', v_metrics->'delivery_risks',
    'suppliers_monitored', v_metrics->'suppliers_monitored',
    'open_escalations', v_metrics->'open_escalations',
    'supplier_insights', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', h.id, 'supplier_id', h.supplier_id, 'supplier_name', s.supplier_name,
        'health_score', h.health_score, 'status_level', h.status_level,
        'strengths', h.strengths, 'risks', h.risks, 'recommendation', h.recommendation,
        'delivery_consistency', s.delivery_consistency, 'quality_indicator', s.quality_indicator
      ) order by h.health_score desc)
      from public.supplier_health_scores h
      join public.supplier_monitoring_records s on s.id = h.supplier_id
      where h.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'product_watchlists', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', w.id, 'product_key', w.product_key, 'product_name', w.product_name,
        'category', w.category, 'watch_reason', w.watch_reason, 'status', w.status
      ) order by w.added_at desc)
      from public.dropshipping_product_watchlists w where w.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'order_health_insights', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id, 'insight_type', o.insight_type, 'title', o.title,
        'summary', o.summary, 'trend_direction', o.trend_direction
      ) order by o.detected_at desc)
      from public.order_health_insights o where o.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'delivery_risk_indicators', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id, 'risk_type', d.risk_type, 'title', d.title,
        'summary', d.summary, 'severity', d.severity, 'resolved', d.resolved
      ) order by d.detected_at desc)
      from public.delivery_risk_events d where d.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'opportunity_alerts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'alert_type', a.alert_type, 'title', a.title,
        'summary', a.summary, 'priority', a.priority, 'acknowledged', a.acknowledged
      ) order by a.created_at desc)
      from public.dropshipping_opportunity_alerts a where a.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'operations_recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'section', r.section, 'title', r.title, 'summary', r.summary,
        'recommendation_type', r.recommendation_type, 'priority', r.priority, 'rationale', r.rationale
      ) order by r.created_at desc)
      from public.operations_recommendations r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'escalation_activity', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'supplier_id', e.supplier_id, 'issue_summary', e.issue_summary,
        'escalation_status', e.escalation_status, 'alternative_supplier', e.alternative_supplier,
        'created_at', e.created_at
      ) order by e.created_at desc)
      from public.supplier_escalations e where e.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'risk_notifications', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', n.id, 'title', n.title, 'message', n.message, 'priority', n.priority
      ) order by n.created_at desc)
      from public.dropshipping_risk_notifications n where n.tenant_id = v_tenant_id limit 10
    ), '[]'::jsonb),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'summary', b.summary, 'created_at', b.created_at)
        order by b.created_at desc)
      from public.dropshipping_operations_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'commerce_intelligence', 'Product opportunities and supplier scores',
      'platform_install', 'Connected store catalog',
      'knowledge_center', 'Dropshipping operations guides and FAQ',
      'notifications', 'Operational alerts and risk notifications'
    ),
    'implementation_blueprint_phase103', jsonb_build_object(
      'phase', 'Phase 103 — Dropshipping Operations Center Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE103_DROPSHIPPING_OPERATIONS.md',
      'engine_phase', 'Repo Phase 103 Dropshipping Operations Center',
      'route', '/app/dropshipping-operations',
      'mapping_note', 'ABOS Blueprint Phase 103 extends repo Phase 103 — wisdom guides operations. Distinct from Product Automation Phase 102 and Commerce Intelligence Phase 101.'
    ),
    'dropshipping_operations_engine_note', 'Dropshipping Operations Center (ABOS Phase 103) — profitable, sustainable dropshipping via intelligent coordination — humans accountable.',
    'dropshipping_operations_blueprint', public._docbp103_blueprint_block(v_tenant_id),
    'dropshipping_operations_distinction_note', public._docbp103_distinction_note(),
    'dropshipping_operations_mission', public._docbp103_mission(),
    'dropshipping_operations_philosophy', public._docbp103_philosophy(),
    'dropshipping_operations_abos_principle', public._docbp103_abos_principle(),
    'dropshipping_operations_objectives', public._docbp103_objectives(),
    'dropshipping_dashboard', public._docbp103_dropshipping_dashboard(),
    'dropshipping_supplier_intelligence', public._docbp103_supplier_intelligence(),
    'dropshipping_order_tracking_center', public._docbp103_order_tracking_center(),
    'dropshipping_risk_monitoring', public._docbp103_risk_monitoring(),
    'dropshipping_profitability_intelligence', public._docbp103_profitability_intelligence(),
    'dropshipping_top_product_insights', public._docbp103_top_product_insights(),
    'dropshipping_product_lifecycle_management', public._docbp103_product_lifecycle_management(),
    'dropshipping_customer_experience_connection', public._docbp103_customer_experience_connection(),
    'dropshipping_companion_guidance', public._docbp103_companion_guidance(),
    'dropshipping_self_love_connection', public._docbp103_self_love_connection(),
    'dropshipping_trust_connection', public._docbp103_trust_connection(),
    'dropshipping_approval_principles', public._docbp103_approval_principles(),
    'dropshipping_operations_dogfooding', public._docbp103_dogfooding(),
    'docbp103_integration_links', public._docbp103_integration_links(),
    'dropshipping_operations_engagement_summary', public._docbp103_engagement_summary(v_tenant_id),
    'dropshipping_operations_success_criteria', public._docbp103_success_criteria(v_tenant_id),
    'dropshipping_operations_vision', public._docbp103_vision(),
    'dropshipping_operations_vision_phrases', public._docbp103_vision_phrases(),
    'dropshipping_operations_privacy_note', 'Dropshipping operations metadata only — no silent automation, no auto-removal without approval. Humans decide; Aipify Operations Companion informs and prepares.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._docbp103_distinction_note() to authenticated;
grant execute on function public._docbp103_mission() to authenticated;
grant execute on function public._docbp103_philosophy() to authenticated;
grant execute on function public._docbp103_abos_principle() to authenticated;
grant execute on function public._docbp103_vision() to authenticated;
grant execute on function public._docbp103_objectives() to authenticated;
grant execute on function public._docbp103_dropshipping_dashboard() to authenticated;
grant execute on function public._docbp103_supplier_intelligence() to authenticated;
grant execute on function public._docbp103_order_tracking_center() to authenticated;
grant execute on function public._docbp103_risk_monitoring() to authenticated;
grant execute on function public._docbp103_profitability_intelligence() to authenticated;
grant execute on function public._docbp103_top_product_insights() to authenticated;
grant execute on function public._docbp103_product_lifecycle_management() to authenticated;
grant execute on function public._docbp103_customer_experience_connection() to authenticated;
grant execute on function public._docbp103_companion_guidance() to authenticated;
grant execute on function public._docbp103_self_love_connection() to authenticated;
grant execute on function public._docbp103_trust_connection() to authenticated;
grant execute on function public._docbp103_approval_principles() to authenticated;
grant execute on function public._docbp103_dogfooding() to authenticated;
grant execute on function public._docbp103_vision_phrases() to authenticated;
grant execute on function public._docbp103_integration_links() to authenticated;
grant execute on function public._docbp103_engagement_summary(uuid) to authenticated;
grant execute on function public._docbp103_success_criteria(uuid) to authenticated;
grant execute on function public._docbp103_blueprint_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'dropshipping-operations-blueprint-phase103', 'Dropshipping Operations Center (ABOS Phase 103)',
  'Dropshipping Operations Center — supplier monitoring, order visibility, delivery intelligence, and profitability insights. Wisdom guides operations; humans accountable.',
  'authenticated', 131
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'dropshipping-operations-blueprint-phase103' and tenant_id is null
);
