-- Implementation Blueprint Phase 110 — Commerce Companion Engine
-- Extends Commerce Companion Engine repo Phase 110. Unified commerce hub — does NOT replace domain RPCs in Phases 101–109.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._ccombp110_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 110 — Commerce Companion Engine at /app/commerce-companion. Unified daily commerce Companion — holistic visibility and briefings across commerce modules without duplicating domain business logic. THIS phase is the unified entry point. Cross-links: Commerce Intelligence Phase 101 /app/commerce-intelligence (opportunity discovery); Product Automation Phase 102 /app/product-automation (catalog automation); Dropshipping Operations Phase 103 /app/dropshipping-operations (operational awareness); Commerce Performance Phase 104 /app/commerce-performance (profitability coaching source); Multi-Store Phase 105 /app/multi-store (portfolio visibility); Supplier Intelligence Phase 106 /app/supplier-intelligence (supplier health); Growth Partner Phase 107 /app/partners (partner support); Customer Journey Phase 108 /app/customer-lifecycle (customer success); Global Commerce Expansion Phase 109 /app/global-commerce-expansion (expansion readiness); Command Center /app/command-center (executive ops — distinct); Meeting Companion Phase 72 /app/meeting-collaboration-intelligence-engine; Knowledge Center A.5 /app/knowledge-center-engine. Helpers use _ccombp110_* — never collide with _ccom_*.';
$$;

create or replace function public._ccombp110_mission()
returns text language sql immutable as $$
  select 'Unified Companion for commerce — clarity, confidence, and sustainable success daily.';
$$;

create or replace function public._ccombp110_philosophy()
returns text language sql immutable as $$
  select 'Commerce is customers, teams, partnerships, and sustainability — simplify complexity; wisdom guides action. Partnership not pressure — stewardship not urgency.';
$$;

create or replace function public._ccombp110_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Commerce Companion aggregates visibility and daily briefings; domain engines Phases 101–109 remain authoritative for operations. Aipify informs and prepares; humans decide.';
$$;

create or replace function public._ccombp110_vision()
returns text language sql immutable as $$
  select 'We no longer manage our commerce operations alone.';
$$;

create or replace function public._ccombp110_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'daily_briefings', 'label', 'Daily briefings', 'emoji', '🌹', 'description', 'Morning commerce clarity — calm overview without reactive pressure'),
    jsonb_build_object('key', 'opportunity_discovery', 'label', 'Opportunity discovery connection', 'emoji', '🦉', 'description', 'Cross-link Commerce Intelligence — wisdom before action'),
    jsonb_build_object('key', 'operational_awareness', 'label', 'Operational awareness', 'emoji', '🔔', 'description', 'Delays, refunds, supplier concerns, shortages — human review'),
    jsonb_build_object('key', 'strategic_guidance', 'label', 'Strategic guidance', 'emoji', '🦉', 'description', 'Holistic portfolio view connecting modules without duplicating RPCs'),
    jsonb_build_object('key', 'profitability_support', 'label', 'Profitability support', 'emoji', '🌹', 'description', 'Commerce Performance coaching source — sustainable growth not extraction'),
    jsonb_build_object('key', 'sustainable_growth', 'label', 'Sustainable growth', 'emoji', '❤️', 'description', 'Human-centered pacing — no growth-at-any-cost pressure')
  );
$$;

create or replace function public._ccombp110_commerce_companion_dashboard()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Holistic visibility dashboard — metadata summaries only; domain modules remain authoritative.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'revenue_performance', 'label', 'Revenue performance', 'description', 'Portfolio revenue metadata — not raw order records'),
      jsonb_build_object('key', 'profit_performance', 'label', 'Profit performance', 'description', 'Margin and profit metadata — Commerce Performance cross-link'),
      jsonb_build_object('key', 'top_products_summary', 'label', 'Top products', 'description', 'Contribution metadata — human prioritization'),
      jsonb_build_object('key', 'supplier_health_summary', 'label', 'Supplier health', 'description', 'Stewardship summary — Supplier Intelligence cross-link'),
      jsonb_build_object('key', 'operational_alerts', 'label', 'Operational alerts', 'description', 'Open signals count — Dropshipping Operations cross-link'),
      jsonb_build_object('key', 'journey_indicators', 'label', 'Journey indicators', 'description', 'Onboarding, retention, advocacy — Customer Journey cross-link'),
      jsonb_build_object('key', 'growth_opportunities', 'label', 'Growth opportunities', 'description', 'Opportunity signal count — Commerce Intelligence cross-link'),
      jsonb_build_object('key', 'expansion_readiness', 'label', 'Expansion readiness', 'description', 'Market readiness summary — Global Commerce Expansion cross-link')
    ),
    'boundary_note', 'Dashboard aggregates — never replaces get_commerce_intelligence_dashboard or sibling domain RPCs.'
  );
$$;

create or replace function public._ccombp110_morning_commerce_briefings()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Morning commerce briefings — calm, optional, pressure-free when pressure_free_mode true.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'key', 'morning_clarity', 'prompt', 'Good morning — your commerce Companion prepared a calm daily overview.', 'consideration', 'Encouraging partnership — not metric anxiety'),
      jsonb_build_object('emoji', '🦉', 'key', 'insight_before_action', 'prompt', 'Revenue and profit metadata summarized — review when it suits your rhythm.', 'consideration', 'Insightful — humans decide timing'),
      jsonb_build_object('emoji', '❤️', 'key', 'human_centered', 'prompt', 'No urgent pressure — stewardship over reactive commerce decisions today.', 'consideration', 'Human-centered pacing'),
      jsonb_build_object('emoji', '🔔', 'key', 'prepared_highlights', 'prompt', 'Operational signals and growth opportunities summarized — next steps are yours.', 'consideration', 'Proactive stewardship — not auto-actions')
    ),
    'boundary_note', 'Briefings store metadata summaries only — no raw customer content.'
  );
$$;

create or replace function public._ccombp110_commercial_opportunity_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Commercial opportunity guidance — cross-link Commerce Intelligence Phase 101; humans approve.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'context_before_test', 'prompt', 'Store fit metadata looks strong — would a Commerce Intelligence summary help before a test import?', 'consideration', 'Wisdom before action'),
      jsonb_build_object('emoji', '🌹', 'key', 'aligned_opportunity', 'prompt', 'Seasonal opportunity window approaching — shall Aipify prepare a checklist?', 'consideration', 'Aligned with strengths'),
      jsonb_build_object('emoji', '🔔', 'key', 'pause_before_scale', 'prompt', 'Margin metadata suggests review before promotion — pause feels wise?', 'consideration', 'No impulsive scaling')
    ),
    'commerce_intelligence_route', '/app/commerce-intelligence'
  );
$$;

create or replace function public._ccombp110_operational_awareness()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Operational awareness — delays, refunds, supplier concerns, shortages, regional demand.',
    'signal_types', jsonb_build_array(
      jsonb_build_object('key', 'delivery_delay', 'label', 'Delivery delays', 'cross_link', '/app/dropshipping-operations'),
      jsonb_build_object('key', 'refund_spike', 'label', 'Refund patterns', 'cross_link', '/app/commerce-performance'),
      jsonb_build_object('key', 'supplier_concern', 'label', 'Supplier concerns', 'cross_link', '/app/supplier-intelligence'),
      jsonb_build_object('key', 'inventory_shortage', 'label', 'Inventory shortages', 'cross_link', '/app/dropshipping-operations'),
      jsonb_build_object('key', 'regional_demand', 'label', 'Regional demand', 'cross_link', '/app/multi-store')
    ),
    'boundary_note', 'Alerts inform — humans accountable for operational decisions.'
  );
$$;

create or replace function public._ccombp110_profitability_coaching()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Profitability coaching — Commerce Performance Phase 104 is authoritative source.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'margin_context', 'prompt', 'Net margin metadata healthy on core SKUs — ad-dependent products may need review before scale.', 'consideration', 'Context before scaling spend'),
      jsonb_build_object('emoji', '🌹', 'key', 'sustainable_contribution', 'prompt', 'Bestsellers show sustainable profit contribution — celebrate thoughtful catalog choices.', 'consideration', 'Sustainable growth not extraction'),
      jsonb_build_object('emoji', '🔔', 'key', 'return_impact', 'prompt', 'Return metadata elevated on one SKU — would a customer experience review feel helpful?', 'consideration', 'Human review before reactive discounting')
    ),
    'commerce_performance_route', '/app/commerce-performance'
  );
$$;

create or replace function public._ccombp110_customer_success_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Customer success connection — onboarding, retention, advocacy, experience.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'onboarding', 'label', 'Onboarding completion', 'description', 'Customer Journey Phase 108 cross-link'),
      jsonb_build_object('key', 'retention', 'label', 'Retention signals', 'description', 'Metadata patterns — not individual customer records'),
      jsonb_build_object('key', 'advocacy', 'label', 'Advocacy indicators', 'description', 'Satisfaction metadata summaries'),
      jsonb_build_object('key', 'experience', 'label', 'Experience stewardship', 'description', 'Commerce decisions serve customers — not metrics alone')
    ),
    'customer_journey_route', '/app/customer-lifecycle'
  );
$$;

create or replace function public._ccombp110_growth_partner_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Growth Partner connection — partner support recommendations without replacing Phase 107 RPCs.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'partner_recommendations', 'label', 'Partner recommendations', 'description', 'Growth Partner Phase 107 cross-link'),
      jsonb_build_object('key', 'implementation_support', 'label', 'Implementation support', 'description', 'When regional expansion needs partner stewardship'),
      jsonb_build_object('key', 'certification_context', 'label', 'Certification context', 'description', 'Trusted partners for commerce operations')
    ),
    'growth_partner_route', '/app/partners'
  );
$$;

create or replace function public._ccombp110_meeting_companion_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Meeting Companion connection — commerce meeting summaries and renewal prep.',
    'use_cases', jsonb_build_array(
      'Supplier renewal briefing prep — cross-link Meeting Companion Phase 72',
      'Portfolio review meeting summaries — metadata only',
      'Leadership commerce check-ins — stewardship framing'
    ),
    'route', '/app/meeting-collaboration-intelligence-engine',
    'boundary_note', 'Meeting Companion stores meeting metadata — not raw transcripts in Commerce Companion.'
  );
$$;

create or replace function public._ccombp110_knowledge_center_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Knowledge Center connection — training, product management, supplier resources, growth playbooks.',
    'resources', jsonb_build_array(
      jsonb_build_object('key', 'commerce_training', 'label', 'Commerce training', 'description', 'KC commerce Companion guides and FAQ'),
      jsonb_build_object('key', 'product_management', 'label', 'Product management playbooks', 'description', 'Cross-link Product Automation Phase 102 KC'),
      jsonb_build_object('key', 'supplier_resources', 'label', 'Supplier stewardship resources', 'description', 'Cross-link Supplier Intelligence Phase 106 KC'),
      jsonb_build_object('key', 'growth_playbooks', 'label', 'Growth playbooks', 'description', 'Sustainable growth — not growth-at-any-cost')
    ),
    'route', '/app/knowledge-center-engine'
  );
$$;

create or replace function public._ccombp110_companion_personality()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Commerce Companion personality — encouraging, insightful, human-centered, proactive. Partnership not pressure.',
    'traits', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'key', 'encouraging', 'label', 'Encouraging', 'description', 'Celebrates thoughtful progress — not metric anxiety'),
      jsonb_build_object('emoji', '🦉', 'key', 'insightful', 'label', 'Insightful', 'description', 'Connects modules with wisdom — not speculation'),
      jsonb_build_object('emoji', '❤️', 'key', 'human_centered', 'label', 'Human-centered', 'description', 'Customers and teams at the center'),
      jsonb_build_object('emoji', '🔔', 'key', 'proactive', 'label', 'Proactive', 'description', 'Gentle stewardship prompts — never urgency pressure')
    ),
    'not_label', 'generic AI commerce bot',
    'companion_name', 'Commerce Companion'
  );
$$;

create or replace function public._ccombp110_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — sustainable commerce pacing; rest is part of business growth.',
    'quotes', jsonb_build_array(
      'You do not have to react to every commerce signal today — stewardship beats urgency.',
      'Sustainable catalog and market decisions protect wellbeing — rushed expansion creates avoidable stress.',
      'Your commerce portfolio can evolve at a human pace — partnership not pressure.',
      'Clarity before scale — margin and operational metadata help disciplined choices.'
    ),
    'route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports wellbeing rhythms — principle only; Commerce Companion stores commerce metadata.'
  );
$$;

create or replace function public._ccombp110_leadership_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership connection — executive commerce visibility without Command Center duplication.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'portfolio_overview', 'label', 'Portfolio overview', 'description', 'Holistic commerce snapshot for leadership check-ins'),
      jsonb_build_object('key', 'stewardship_framing', 'label', 'Stewardship framing', 'description', 'Sustainable growth narrative — not growth-at-any-cost'),
      jsonb_build_object('key', 'command_center_distinction', 'label', 'Command Center distinction', 'description', 'Executive ops at /app/command-center — commerce Companion is commerce-specific')
    ),
    'command_center_route', '/app/command-center'
  );
$$;

create or replace function public._ccombp110_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparent aggregation — explainable summaries, human decisions, audited briefings.',
    'users_should_see', jsonb_build_array(
      'Which modules supply each visibility dimension — cross-links to authoritative routes',
      'pressure_free_mode default true — stewardship not urgency',
      'No auto-actions — domain RPCs remain authoritative',
      'Audit trail via commerce_companion_audit_logs — briefing and visibility events'
    ),
    'operators_should_understand', jsonb_build_array(
      'Commerce Companion is a hub — not a replacement for Phases 101–109',
      'Metadata summaries only — no raw orders, chat, or PII',
      'Morning briefings are optional — morning_briefing_enabled tenant-controlled',
      'Platform aggregates only at platform governance — tenant data stays tenant-scoped'
    ),
    'audit_note', 'ccom_briefing_generated, ccom_visibility_refreshed — metadata only.'
  );
$$;

create or replace function public._ccombp110_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Limitation principles — stewardship not urgency in unified commerce Companion.',
    'must_avoid', jsonb_build_array(
      'Reactive pressure framing or urgency-driven commerce decisions',
      'Growth-at-any-cost recommendations ignoring margin or operational health',
      'Revenue-only optimization that ignores customers, teams, or sustainability',
      'Operational pressure that bypasses human accountability in domain modules'
    ),
    'required', jsonb_build_array(
      'pressure_free_mode default true',
      'Cross-link domain modules — never duplicate or replace their RPCs',
      'Human oversight for operational and commercial decisions',
      'Commerce Companion tone — Aipify informs and prepares; humans decide'
    ),
    'boundary_note', 'Unified visibility — not unified auto-execution.'
  );
$$;

create or replace function public._ccombp110_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Dogfooding — validate Commerce Companion hub on real multi-module commerce operations.',
    'sportsklaer_no', jsonb_build_object(
      'slug', 'sportsklaer-no',
      'role', 'Sportsklær.no — Shopify multi-category commerce dogfooding',
      'focus', jsonb_build_array(
        'Daily morning briefing across intelligence, operations, and performance modules',
        'Supplier stewardship signals from Phase 106 without replacing supplier RPCs',
        'Seasonal campaign preparation cross-links Product Automation and Intelligence',
        'Multi-store Nordic portfolio visibility — Phase 105 cross-link'
      )
    ),
    'shopify', jsonb_build_object(
      'role', 'Shopify install context — Platform Install Phase 100 connector metadata',
      'focus', jsonb_build_array('Integration health grid shows linked module routes', 'Catalog metadata flows to holistic visibility')
    ),
    'multi_store', jsonb_build_object(
      'role', 'Multi-store portfolio — Phase 105 cross-link in integration grid',
      'focus', jsonb_build_array('Portfolio revenue metadata in visibility snapshot', 'Regional demand operational alerts')
    ),
    'growth_partner', jsonb_build_object(
      'role', 'Growth Partner programs — Phase 107 cross-link',
      'focus', jsonb_build_array('Partner support recommendations in growth connection', 'Implementation partner context for expansion readiness')
    )
  );
$$;

create or replace function public._ccombp110_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'commerce_companion_phase110', 'label', 'Commerce Companion (Phase 110)', 'route', '/app/commerce-companion', 'note', 'THIS phase — unified daily commerce Companion'),
    jsonb_build_object('key', 'commerce_intelligence_phase101', 'label', 'Commerce Intelligence (Phase 101)', 'route', '/app/commerce-intelligence', 'note', 'Opportunity discovery'),
    jsonb_build_object('key', 'product_automation_phase102', 'label', 'Product Automation (Phase 102)', 'route', '/app/product-automation', 'note', 'Catalog automation'),
    jsonb_build_object('key', 'dropshipping_operations_phase103', 'label', 'Dropshipping Operations (Phase 103)', 'route', '/app/dropshipping-operations', 'note', 'Operational awareness'),
    jsonb_build_object('key', 'commerce_performance_phase104', 'label', 'Commerce Performance (Phase 104)', 'route', '/app/commerce-performance', 'note', 'Profitability coaching source'),
    jsonb_build_object('key', 'multi_store_phase105', 'label', 'Multi-Store (Phase 105)', 'route', '/app/multi-store', 'note', 'Portfolio visibility'),
    jsonb_build_object('key', 'supplier_intelligence_phase106', 'label', 'Supplier Intelligence (Phase 106)', 'route', '/app/supplier-intelligence', 'note', 'Supplier health'),
    jsonb_build_object('key', 'growth_partner_phase107', 'label', 'Growth Partner (Phase 107)', 'route', '/app/partners', 'note', 'Partner support recommendations'),
    jsonb_build_object('key', 'customer_journey_phase108', 'label', 'Customer Journey (Phase 108)', 'route', '/app/customer-lifecycle', 'note', 'Customer success indicators'),
    jsonb_build_object('key', 'global_commerce_expansion_phase109', 'label', 'Global Commerce Expansion (Phase 109)', 'route', '/app/global-commerce-expansion', 'note', 'Expansion readiness'),
    jsonb_build_object('key', 'command_center', 'label', 'Command Center', 'route', '/app/command-center', 'note', 'Executive ops — distinct from commerce Companion'),
    jsonb_build_object('key', 'meeting_companion_phase72', 'label', 'Meeting Companion (Phase 72)', 'route', '/app/meeting-collaboration-intelligence-engine', 'note', 'Commerce meeting summaries'),
    jsonb_build_object('key', 'knowledge_center_a5', 'label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine', 'note', 'Commerce training and playbooks'),
    jsonb_build_object('key', 'self_love_a76', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Sustainable commerce pacing — principle only')
  );
$$;

create or replace function public._ccombp110_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._ccom_ensure_settings(p_tenant_id);
  perform public._ccom_seed_integration_health(p_tenant_id);
  perform public._ccom_seed_visibility(p_tenant_id);
  perform public._ccom_seed_guidance(p_tenant_id);
  v_metrics := public._ccom_refresh_metrics(p_tenant_id);

  return jsonb_build_object(
    'companion_score', coalesce((v_metrics->>'companion_score')::numeric, 0),
    'operational_alerts_count', coalesce((v_metrics->>'operational_alerts_count')::int, 0),
    'growth_opportunities_count', coalesce((v_metrics->>'growth_opportunities_count')::int, 0),
    'profitability_coaching_count', coalesce((v_metrics->>'profitability_coaching_count')::int, 0),
    'integration_modules_count', coalesce((v_metrics->>'integration_modules_count')::int, 0),
    'objectives_documented', jsonb_array_length(public._ccombp110_objectives()),
    'personality_traits', jsonb_array_length(public._ccombp110_companion_personality()->'traits'),
    'morning_briefing_examples', jsonb_array_length(public._ccombp110_morning_commerce_briefings()->'examples'),
    'integration_links', jsonb_array_length(public._ccombp110_integration_links()),
    'privacy_note', 'Aggregate commerce Companion counts and blueprint scaffolds only — metadata summaries, no raw customer content.'
  );
end; $$;

create or replace function public._ccombp110_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_engagement jsonb;
begin
  perform public._ccom_ensure_settings(p_tenant_id);
  perform public._ccom_seed_integration_health(p_tenant_id);
  perform public._ccom_seed_visibility(p_tenant_id);
  perform public._ccom_seed_guidance(p_tenant_id);
  v_engagement := public._ccombp110_engagement_summary(p_tenant_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'daily_briefings', 'label', 'Daily briefings — morning commerce clarity (🌹🦉❤️🔔)', 'met', jsonb_array_length(public._ccombp110_morning_commerce_briefings()->'examples') >= 4, 'note', null),
    jsonb_build_object('key', 'holistic_visibility', 'label', 'Holistic visibility dashboard — eight dimensions documented', 'met', jsonb_array_length(public._ccombp110_commerce_companion_dashboard()->'dimensions') >= 8, 'note', null),
    jsonb_build_object('key', 'operational_awareness', 'label', 'Operational awareness — delays, refunds, supplier, shortages', 'met', jsonb_array_length(public._ccombp110_operational_awareness()->'signal_types') >= 5, 'note', null),
    jsonb_build_object('key', 'profitability_coaching', 'label', 'Profitability coaching — Commerce Performance cross-link (🦉🌹🔔)', 'met', jsonb_array_length(public._ccombp110_profitability_coaching()->'examples') >= 3, 'note', null),
    jsonb_build_object('key', 'companion_personality', 'label', 'Companion personality — partnership not pressure', 'met', jsonb_array_length(public._ccombp110_companion_personality()->'traits') >= 4, 'note', 'Commerce Companion — not generic AI bot'),
    jsonb_build_object('key', 'integration_links', 'label', 'Integration links — Phases 101–109 plus Command Center and KC', 'met', jsonb_array_length(public._ccombp110_integration_links()) >= 13, 'note', null),
    jsonb_build_object('key', 'limitation_principles', 'label', 'Limitation principles — stewardship not urgency', 'met', jsonb_array_length(public._ccombp110_limitation_principles()->'must_avoid') >= 4, 'note', null),
    jsonb_build_object('key', 'pressure_free_mode', 'label', 'pressure_free_mode default true', 'met', exists (select 1 from public.commerce_companion_settings s where s.tenant_id = p_tenant_id and s.pressure_free_mode = true), 'note', 'Stewardship not urgency'),
    jsonb_build_object('key', 'customer_success_connection', 'label', 'Customer success connection — journey cross-link', 'met', (public._ccombp110_customer_success_connection()->>'customer_journey_route') is not null, 'note', null),
    jsonb_build_object('key', 'growth_partner_connection', 'label', 'Growth Partner connection — Phase 107 cross-link', 'met', (public._ccombp110_growth_partner_connection()->>'growth_partner_route') is not null, 'note', null),
    jsonb_build_object('key', 'trust_connection', 'label', 'Trust connection — transparent aggregation and audit', 'met', jsonb_array_length(public._ccombp110_trust_connection()->'users_should_see') >= 4, 'note', null),
    jsonb_build_object('key', 'self_love_connection', 'label', 'Self Love connection — sustainable commerce pacing', 'met', jsonb_array_length(public._ccombp110_self_love_connection()->'quotes') >= 2, 'note', null),
    jsonb_build_object('key', 'baseline_preserved', 'label', 'Repo Phase 110 baseline fields preserved on dashboard', 'met', to_regclass('public.commerce_companion_settings') is not null, 'note', '_ccom_* tables and RPC behavior intact'),
    jsonb_build_object('key', 'dogfooding', 'label', 'Dogfooding — Sportsklær.no, Shopify, multi-store, Growth Partner', 'met', (public._ccombp110_dogfooding()->'sportsklaer_no') is not null, 'note', null),
    jsonb_build_object('key', 'abos_principle', 'label', 'ABOS principle — domain modules authoritative', 'met', true, 'note', 'Humans decide; Aipify informs and prepares')
  );
end; $$;

create or replace function public._ccombp110_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 110 — Commerce Companion Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE110_COMMERCE_COMPANION.md',
    'engine_phase', 'Repo Phase 110 Commerce Companion Engine',
    'route', '/app/commerce-companion',
    'mapping_note', 'ABOS Blueprint Phase 110 — unified commerce Companion hub. Aggregates visibility; Phases 101–109 remain authoritative.',
    'distinction_note', public._ccombp110_distinction_note(),
    'mission', public._ccombp110_mission(),
    'philosophy', public._ccombp110_philosophy(),
    'abos_principle', public._ccombp110_abos_principle(),
    'objectives', public._ccombp110_objectives(),
    'commerce_companion_dashboard', public._ccombp110_commerce_companion_dashboard(),
    'morning_commerce_briefings', public._ccombp110_morning_commerce_briefings(),
    'commercial_opportunity_guidance', public._ccombp110_commercial_opportunity_guidance(),
    'operational_awareness', public._ccombp110_operational_awareness(),
    'profitability_coaching', public._ccombp110_profitability_coaching(),
    'customer_success_connection', public._ccombp110_customer_success_connection(),
    'growth_partner_connection', public._ccombp110_growth_partner_connection(),
    'meeting_companion_connection', public._ccombp110_meeting_companion_connection(),
    'knowledge_center_connection', public._ccombp110_knowledge_center_connection(),
    'companion_personality', public._ccombp110_companion_personality(),
    'self_love_connection', public._ccombp110_self_love_connection(),
    'leadership_connection', public._ccombp110_leadership_connection(),
    'trust_connection', public._ccombp110_trust_connection(),
    'limitation_principles', public._ccombp110_limitation_principles(),
    'dogfooding', public._ccombp110_dogfooding(),
    'success_criteria', public._ccombp110_success_criteria(p_tenant_id),
    'vision', public._ccombp110_vision(),
    'integration_links', public._ccombp110_integration_links(),
    'engagement_summary', public._ccombp110_engagement_summary(p_tenant_id),
    'privacy_note', 'Commerce Companion blueprint data is metadata only — holistic summaries and cross-links. No auto-actions. Humans decide; Aipify Commerce Companion informs and prepares.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 2. Card RPC — preserve ALL baseline fields; append Phase 110 blueprint
-- ---------------------------------------------------------------------------
create or replace function public.get_commerce_companion_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb; v_settings public.commerce_companion_settings; v_engagement jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._ccom_ensure_settings(v_tenant_id);
  perform public._ccom_seed_integration_health(v_tenant_id);
  perform public._ccom_seed_visibility(v_tenant_id);
  perform public._ccom_seed_guidance(v_tenant_id);
  v_metrics := public._ccom_refresh_metrics(v_tenant_id);
  v_engagement := public._ccombp110_engagement_summary(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'companion_score', v_metrics->'companion_score',
    'operational_alerts_count', v_metrics->'operational_alerts_count',
    'growth_opportunities_count', v_metrics->'growth_opportunities_count',
    'philosophy', 'Unified Companion for commerce — clarity, confidence, sustainable success daily.',
    'human_oversight_required', true,
    'pressure_free_mode', v_settings.pressure_free_mode,
    'implementation_blueprint_phase110', jsonb_build_object(
      'phase', 'Phase 110 — Commerce Companion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE110_COMMERCE_COMPANION.md',
      'engine_phase', 'Repo Phase 110 Commerce Companion Engine',
      'route', '/app/commerce-companion',
      'mapping_note', 'Unified commerce Companion hub — Phases 101–109 remain authoritative.'
    ),
    'commerce_companion_mission', public._ccombp110_mission(),
    'commerce_companion_abos_principle', public._ccombp110_abos_principle(),
    'commerce_companion_engagement_summary', v_engagement,
    'commerce_companion_note', 'Commerce Companion Engine (ABOS Phase 110) — stewardship not urgency; holistic visibility without duplicating domain RPCs.',
    'commerce_companion_vision_note', public._ccombp110_vision()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL baseline fields; append Phase 110 blueprint
-- ---------------------------------------------------------------------------
create or replace function public.get_commerce_companion_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.commerce_companion_settings;
  v_metrics jsonb;
begin
  v_tenant_id := public._ccom_require_tenant();
  v_settings := public._ccom_ensure_settings(v_tenant_id);
  perform public._ccom_seed_integration_health(v_tenant_id);
  perform public._ccom_seed_visibility(v_tenant_id);
  perform public._ccom_seed_guidance(v_tenant_id);
  v_metrics := public._ccom_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'pressure_free_mode', v_settings.pressure_free_mode,
    'companion_enabled', v_settings.companion_enabled,
    'morning_briefing_enabled', v_settings.morning_briefing_enabled,
    'philosophy', 'Unified Companion for commerce — clarity, confidence, sustainable success daily.',
    'safety_note', 'Commerce Companion aggregates holistic visibility — domain modules Phases 101–109 remain authoritative. No auto-actions; stewardship not urgency.',
    'companion_score', v_metrics->'companion_score',
    'operational_alerts_count', v_metrics->'operational_alerts_count',
    'growth_opportunities_count', v_metrics->'growth_opportunities_count',
    'profitability_coaching_count', v_metrics->'profitability_coaching_count',
    'guidance_items_count', v_metrics->'guidance_items_count',
    'integration_modules_count', v_metrics->'integration_modules_count',
    'revenue_performance', v_metrics->'revenue_performance',
    'profit_performance', v_metrics->'profit_performance',
    'top_products_summary', v_metrics->'top_products_summary',
    'supplier_health_summary', v_metrics->'supplier_health_summary',
    'journey_indicators_summary', v_metrics->'journey_indicators_summary',
    'expansion_readiness_summary', v_metrics->'expansion_readiness_summary',
    'morning_briefing_guidance', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', g.id, 'emoji', g.emoji, 'title', g.title, 'summary', g.summary, 'priority', g.priority
      ) order by g.created_at)
      from public.commerce_companion_guidance_items g
      where g.tenant_id = v_tenant_id and g.guidance_type = 'morning_briefing'
    ), '[]'::jsonb),
    'companion_personality', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', g.id, 'emoji', g.emoji, 'title', g.title, 'summary', g.summary
      ) order by g.created_at)
      from public.commerce_companion_guidance_items g
      where g.tenant_id = v_tenant_id and g.guidance_type = 'personality'
    ), '[]'::jsonb),
    'operational_alerts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'alert_type', a.alert_type, 'title', a.title, 'summary', a.summary,
        'severity', a.severity, 'resolved', a.resolved
      ) order by a.detected_at desc)
      from public.commerce_companion_operational_alerts a
      where a.tenant_id = v_tenant_id and a.resolved = false
    ), '[]'::jsonb),
    'opportunity_signals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'signal_type', s.signal_type, 'title', s.title,
        'summary', s.summary, 'intention_note', s.intention_note
      ) order by s.created_at desc)
      from public.commerce_companion_opportunity_signals s where s.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'profitability_coaching', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'coaching_type', c.coaching_type, 'title', c.title,
        'summary', c.summary, 'margin_note', c.margin_note
      ) order by c.created_at desc)
      from public.commerce_companion_profitability_coaching c where c.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'integration_health', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'module_key', i.module_key, 'route', i.route,
        'status', i.status, 'last_summary', i.last_summary
      ) order by i.module_key)
      from public.commerce_companion_integration_health i where i.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'daily_briefings', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', b.id, 'briefing_date', b.briefing_date, 'summary', b.summary,
        'revenue_note', b.revenue_note, 'profit_note', b.profit_note,
        'highlights', b.highlights, 'created_at', b.created_at
      ) order by b.created_at desc)
      from public.commerce_companion_daily_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integration_links', public._ccombp110_integration_links(),
    'implementation_blueprint_phase110', jsonb_build_object(
      'phase', 'Phase 110 — Commerce Companion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE110_COMMERCE_COMPANION.md',
      'engine_phase', 'Repo Phase 110 Commerce Companion Engine',
      'route', '/app/commerce-companion',
      'mapping_note', 'Unified commerce Companion hub — Phases 101–109 remain authoritative.'
    ),
    'commerce_companion_engine_note', 'Commerce Companion Engine (ABOS Phase 110) — unified daily commerce Companion with holistic visibility and morning briefings — partnership not pressure.',
    'commerce_companion_blueprint', public._ccombp110_blueprint_block(v_tenant_id),
    'commerce_companion_distinction_note', public._ccombp110_distinction_note(),
    'commerce_companion_mission', public._ccombp110_mission(),
    'commerce_companion_philosophy', public._ccombp110_philosophy(),
    'commerce_companion_abos_principle', public._ccombp110_abos_principle(),
    'commerce_companion_objectives', public._ccombp110_objectives(),
    'commerce_companion_dashboard_meta', public._ccombp110_commerce_companion_dashboard(),
    'morning_commerce_briefings', public._ccombp110_morning_commerce_briefings(),
    'commercial_opportunity_guidance', public._ccombp110_commercial_opportunity_guidance(),
    'operational_awareness', public._ccombp110_operational_awareness(),
    'profitability_coaching_meta', public._ccombp110_profitability_coaching(),
    'customer_success_connection', public._ccombp110_customer_success_connection(),
    'growth_partner_connection', public._ccombp110_growth_partner_connection(),
    'meeting_companion_connection', public._ccombp110_meeting_companion_connection(),
    'knowledge_center_connection', public._ccombp110_knowledge_center_connection(),
    'companion_personality_meta', public._ccombp110_companion_personality(),
    'commerce_self_love_connection', public._ccombp110_self_love_connection(),
    'commerce_leadership_connection', public._ccombp110_leadership_connection(),
    'commerce_trust_connection', public._ccombp110_trust_connection(),
    'commerce_limitation_principles', public._ccombp110_limitation_principles(),
    'commerce_companion_dogfooding', public._ccombp110_dogfooding(),
    'ccombp110_integration_links', public._ccombp110_integration_links(),
    'commerce_companion_engagement_summary', public._ccombp110_engagement_summary(v_tenant_id),
    'commerce_companion_success_criteria', public._ccombp110_success_criteria(v_tenant_id),
    'commerce_companion_vision', public._ccombp110_vision(),
    'commerce_companion_privacy_note', 'Commerce Companion metadata only — holistic summaries and cross-links. No auto-actions. pressure_free_mode default true. Humans decide; Aipify Commerce Companion informs and prepares.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._ccombp110_distinction_note() to authenticated;
grant execute on function public._ccombp110_mission() to authenticated;
grant execute on function public._ccombp110_philosophy() to authenticated;
grant execute on function public._ccombp110_abos_principle() to authenticated;
grant execute on function public._ccombp110_vision() to authenticated;
grant execute on function public._ccombp110_objectives() to authenticated;
grant execute on function public._ccombp110_commerce_companion_dashboard() to authenticated;
grant execute on function public._ccombp110_morning_commerce_briefings() to authenticated;
grant execute on function public._ccombp110_commercial_opportunity_guidance() to authenticated;
grant execute on function public._ccombp110_operational_awareness() to authenticated;
grant execute on function public._ccombp110_profitability_coaching() to authenticated;
grant execute on function public._ccombp110_customer_success_connection() to authenticated;
grant execute on function public._ccombp110_growth_partner_connection() to authenticated;
grant execute on function public._ccombp110_meeting_companion_connection() to authenticated;
grant execute on function public._ccombp110_knowledge_center_connection() to authenticated;
grant execute on function public._ccombp110_companion_personality() to authenticated;
grant execute on function public._ccombp110_self_love_connection() to authenticated;
grant execute on function public._ccombp110_leadership_connection() to authenticated;
grant execute on function public._ccombp110_trust_connection() to authenticated;
grant execute on function public._ccombp110_limitation_principles() to authenticated;
grant execute on function public._ccombp110_dogfooding() to authenticated;
grant execute on function public._ccombp110_integration_links() to authenticated;
grant execute on function public._ccombp110_engagement_summary(uuid) to authenticated;
grant execute on function public._ccombp110_success_criteria(uuid) to authenticated;
grant execute on function public._ccombp110_blueprint_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'commerce-companion-blueprint-phase110', 'Commerce Companion Engine (ABOS Phase 110)',
  'Unified daily commerce Companion — holistic visibility, morning briefings, and cross-module integration. Stewardship not urgency.',
  'authenticated', 131
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'commerce-companion-blueprint-phase110' and tenant_id is null
);
