-- Implementation Blueprint Phase 106 — Supplier Intelligence & Relationship Engine
-- Extends Supplier Intelligence & Relationship Engine repo Phase 106. No new tables.
-- Distinct from Dropshipping Operations Blueprint Phase 103 at /app/dropshipping-operations.
-- Distinct from Commerce Intelligence Blueprint Phase 101 at /app/commerce-intelligence.
-- Distinct from Commerce Performance & Profit repo Phase 104 at /app/commerce-performance.
-- Distinct from Multi-Store Orchestration repo Phase 105 at /app/multi-store.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._sirbp106_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 106 — Supplier Intelligence & Relationship Engine at /app/supplier-intelligence. Extends Supplier Intelligence & Relationship Engine repo Phase 106 (_sir_*) and preserves ALL baseline dashboard and card fields including auto_replacement_disabled — no automatic supplier replacement; human oversight required. THIS phase — partnership stewardship. Distinct from Dropshipping Operations Blueprint Phase 103 at /app/dropshipping-operations (operational supplier monitoring for dropshipping — cross-link, NOT duplicate). Distinct from Commerce Intelligence Blueprint Phase 101 at /app/commerce-intelligence (supplier insights during product discovery). Distinct from Commerce Performance & Profit repo Phase 104 at /app/commerce-performance (margin contributions cross-link). Distinct from Multi-Store Orchestration repo Phase 105 at /app/multi-store (supplier dependencies across portfolio). Distinct from Marketplace Governance Phase 90 at /app/marketplace-governance (marketplace supplier profiles/scores — distinct layer). Cross-links Meeting Companion Blueprint Phase 72 / A.61 at /app/meeting-collaboration-intelligence-engine (supplier meeting summaries). Cross-links Integration Engine A.8 at /app/integration-engine (Shopify supplier ecosystems). Helpers use _sirbp106_* — never collide with _sir_*.';
$$;

create or replace function public._sirbp106_mission()
returns text language sql immutable as $$
  select 'Cultivate stronger, resilient supplier relationships through visibility and stewardship.';
$$;

create or replace function public._sirbp106_philosophy()
returns text language sql immutable as $$
  select 'Suppliers are partners, not transactional resources — trust and mutual value.';
$$;

create or replace function public._sirbp106_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — humans accountable. Aipify Stewardship Companion informs and prepares supplier health, diversification, relationship records, and partnership opportunities; auto_replacement_disabled remains default true; no encouraging unnecessary supplier replacement.';
$$;

create or replace function public._sirbp106_vision()
returns text language sql immutable as $$
  select 'We understand our supplier relationships better than ever before.';
$$;

create or replace function public._sirbp106_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'supplier_visibility', 'label', 'Supplier visibility', 'emoji', '🦉', 'description', 'Active suppliers, ratings, delivery, quality, refund associations, margin, responsiveness, dependency'),
    jsonb_build_object('key', 'health_stewardship', 'label', 'Health stewardship', 'emoji', '🌹', 'description', 'Health indicators and score components — partnership quality over price-only optimization'),
    jsonb_build_object('key', 'diversification_awareness', 'label', 'Diversification awareness', 'emoji', '🔔', 'description', 'Dependency concentration alerts — humans decide diversification timing'),
    jsonb_build_object('key', 'relationship_management', 'label', 'Relationship management', 'emoji', '🦉', 'description', 'Contact histories, meeting summaries, improvement initiatives, partnership opportunities — metadata only'),
    jsonb_build_object('key', 'risk_opportunity_intelligence', 'label', 'Risk & opportunity intelligence', 'emoji', '🌹', 'description', 'Risk events and opportunity insights with rationale — stewardship not suspicion'),
    jsonb_build_object('key', 'stewardship_decision_support', 'label', 'Stewardship decision support', 'emoji', '🔔', 'description', 'Recommendations with rationale — humans decide every supplier relationship action')
  );
$$;

create or replace function public._sirbp106_supplier_dashboard()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Supplier dashboard — metadata summaries for active suppliers, ratings, delivery, quality, refund associations, margin, responsiveness, and dependency.',
    'metrics', jsonb_build_array(
      jsonb_build_object('key', 'active_suppliers', 'label', 'Active suppliers', 'description', 'Partners under active or monitoring stewardship status'),
      jsonb_build_object('key', 'supplier_ratings', 'label', 'Supplier ratings', 'description', 'Aggregate health scores and status levels — illustrative metadata'),
      jsonb_build_object('key', 'delivery_reliability', 'label', 'Delivery reliability', 'description', 'Delivery consistency signals across supplier portfolio'),
      jsonb_build_object('key', 'quality_indicator', 'label', 'Quality indicator', 'description', 'Quality performance metadata — not raw customer complaints'),
      jsonb_build_object('key', 'refund_associations', 'label', 'Refund associations', 'description', 'Refund frequency patterns linked to supplier metadata'),
      jsonb_build_object('key', 'margin_performance', 'label', 'Margin performance', 'description', 'Margin contribution signals — cross-link Commerce Performance Phase 104'),
      jsonb_build_object('key', 'responsiveness', 'label', 'Responsiveness', 'description', 'Communication and account responsiveness metadata'),
      jsonb_build_object('key', 'dependency_level', 'label', 'Dependency level', 'description', 'SKU and category concentration awareness — diversification alerts')
    ),
    'boundary_note', 'Dashboard metrics are stewardship metadata — humans verify before supplier relationship decisions.'
  );
$$;

create or replace function public._sirbp106_supplier_health_indicators()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Supplier health indicators — stewardship visibility before reactive supplier switching.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'portfolio_health', 'label', 'Portfolio health', 'description', 'Overall supplier portfolio score and classification — calm visibility'),
      jsonb_build_object('emoji', '🌹', 'key', 'trusted_partners', 'label', 'Trusted partners', 'description', 'Suppliers with strong longevity and scores — deepen partnerships, not replace'),
      jsonb_build_object('emoji', '🔔', 'key', 'stewardship_alerts', 'label', 'Stewardship alerts', 'description', 'When monitor_closely or escalation_recommended should trigger human review — not auto-replacement')
    ),
    'boundary_note', 'Health indicators inform stewardship — auto_replacement_disabled true by default.'
  );
$$;

create or replace function public._sirbp106_supplier_score_components()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Supplier score components — holistic partnership quality beyond price.',
    'components', jsonb_build_array(
      jsonb_build_object('key', 'delivery_reliability', 'label', 'Delivery reliability', 'weight_note', 'Fulfillment consistency and on-time patterns'),
      jsonb_build_object('key', 'quality', 'label', 'Quality', 'weight_note', 'Product quality indicators and complaint trend metadata'),
      jsonb_build_object('key', 'refund_frequency', 'label', 'Refund frequency', 'weight_note', 'Refund association patterns — lower is better'),
      jsonb_build_object('key', 'satisfaction', 'label', 'Satisfaction', 'weight_note', 'Aggregate satisfaction signals — no raw review content'),
      jsonb_build_object('key', 'responsiveness', 'label', 'Responsiveness', 'weight_note', 'Account communication and issue resolution metadata'),
      jsonb_build_object('key', 'margin', 'label', 'Margin', 'weight_note', 'Margin performance — cross-link Commerce Performance Phase 104'),
      jsonb_build_object('key', 'longevity', 'label', 'Longevity', 'weight_note', 'Relationship longevity months — partnership history matters')
    ),
    'boundary_note', 'Scores are illustrative stewardship metadata — humans validate relationships and contracts.'
  );
$$;

create or replace function public._sirbp106_supplier_diversification_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Diversification insights — reduce concentration risk without encouraging unnecessary replacement.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'dependency_awareness', 'label', 'Dependency awareness', 'description', 'Single supplier and category concentration alerts — metadata only'),
      jsonb_build_object('emoji', '🌹', 'key', 'gradual_diversification', 'label', 'Gradual diversification', 'description', 'Plan diversification with trusted partners — partnership not extraction'),
      jsonb_build_object('emoji', '🔔', 'key', 'human_timing', 'label', 'Human timing', 'description', 'Diversification alert threshold crossed — humans decide when and how to act')
    ),
    'multi_store_route', '/app/multi-store',
    'boundary_note', 'Diversification prepares options — no automatic supplier replacement.'
  );
$$;

create or replace function public._sirbp106_supplier_relationship_management()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Relationship management — metadata summaries for partnership stewardship.',
    'areas', jsonb_build_array(
      jsonb_build_object('key', 'contact_histories', 'label', 'Contact histories', 'description', 'Business contact summary metadata — no raw PII beyond business summaries'),
      jsonb_build_object('key', 'meeting_summaries', 'label', 'Meeting summaries', 'description', 'Partnership review and performance discussion summaries'),
      jsonb_build_object('key', 'performance_discussions', 'label', 'Performance discussions', 'description', 'Improvement initiatives and accountability conversations'),
      jsonb_build_object('key', 'improvement_initiatives', 'label', 'Improvement initiatives', 'description', 'Joint quality audits and process improvements'),
      jsonb_build_object('key', 'partnership_opportunities', 'label', 'Partnership opportunities', 'description', 'Exclusive lines, co-marketing, regional expansion opportunities')
    ),
    'meeting_companion_route', '/app/meeting-collaboration-intelligence-engine',
    'boundary_note', 'Relationship records are metadata summaries — humans own supplier conversations.'
  );
$$;

create or replace function public._sirbp106_supplier_risk_intelligence()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Risk intelligence — early stewardship signals without alarmist supplier switching.',
    'risk_types', jsonb_build_array(
      jsonb_build_object('key', 'delivery_instability', 'label', 'Delivery instability', 'description', 'Delivery variance and reliability decline patterns'),
      jsonb_build_object('key', 'quality_decline', 'label', 'Quality decline', 'description', 'Quality indicator shifts — performance discussion before replacement'),
      jsonb_build_object('key', 'communication_gap', 'label', 'Communication gap', 'description', 'Responsiveness and account engagement patterns'),
      jsonb_build_object('key', 'dependency_concentration', 'label', 'Dependency concentration', 'description', 'Over-reliance on single supplier — diversification planning'),
      jsonb_build_object('key', 'margin_erosion', 'label', 'Margin erosion', 'description', 'Supplier fee and landed margin pressure — Commerce Performance cross-link'),
      jsonb_build_object('key', 'contract_renewal', 'label', 'Contract renewal', 'description', 'Renewal season preparation — meeting companion cross-link')
    ),
    'dropshipping_operations_route', '/app/dropshipping-operations',
    'boundary_note', 'Risk signals inform stewardship — humans decide supplier actions.'
  );
$$;

create or replace function public._sirbp106_supplier_opportunity_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Opportunity insights — grow partnerships before seeking replacements.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'partnership_expansion', 'label', 'Partnership expansion', 'description', 'Deepen collaboration with trusted suppliers — exclusive lines and co-marketing'),
      jsonb_build_object('emoji', '🌹', 'key', 'mutual_value', 'label', 'Mutual value', 'description', 'Cost improvement and quality upgrade opportunities that benefit both parties'),
      jsonb_build_object('emoji', '🔔', 'key', 'human_evaluation', 'label', 'Human evaluation', 'description', 'Opportunity insights prepare decisions — humans approve partnership changes')
    ),
    'commerce_intelligence_route', '/app/commerce-intelligence',
    'boundary_note', 'Opportunities scaffold partnership growth — not price-only optimization.'
  );
$$;

create or replace function public._sirbp106_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Stewardship Companion guidance — calm, optional, non-intrusive. Stewardship not suspicion.',
    'companion_name', 'Stewardship Companion',
    'not_label', 'AI supplier bot',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'partnership_context', 'prompt', 'Nordic Activewear Partners scores remain strong — would a renewal preparation summary help before your Q2 review?', 'consideration', 'Stewardship before switching — deepen trusted partnerships'),
      jsonb_build_object('emoji', '🌹', 'key', 'performance_discussion', 'prompt', 'Global Textile Supply delivery variance increased — shall I prepare talking points for a performance discussion?', 'consideration', 'Partnership conversation before replacement consideration'),
      jsonb_build_object('emoji', '🔔', 'key', 'diversification_planning', 'prompt', 'Dependency concentration crossed your threshold — would a gradual diversification plan feel wise?', 'consideration', 'auto_replacement_disabled — humans decide timing and approach')
    ),
    'boundary_note', 'Stewardship Companion scaffolds visibility — never auto-replaces suppliers.'
  );
$$;

create or replace function public._sirbp106_meeting_companion_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Meeting Companion connection — supplier meeting summaries, action items, renewal reminders, performance review prep.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'meeting_summaries', 'label', 'Meeting summaries', 'description', 'Supplier partnership review summaries — metadata only'),
      jsonb_build_object('key', 'action_items', 'label', 'Action items', 'description', 'Follow-up tasks from supplier performance discussions'),
      jsonb_build_object('key', 'renewal_reminders', 'label', 'Renewal reminders', 'description', 'Contract renewal season preparation — human-scheduled'),
      jsonb_build_object('key', 'performance_review_prep', 'label', 'Performance review prep', 'description', 'Health score and risk context before supplier reviews')
    ),
    'route', '/app/meeting-collaboration-intelligence-engine',
    'boundary_note', 'Meeting Companion cross-link — supplier conversations remain human-led.'
  );
$$;

create or replace function public._sirbp106_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — sustainable supplier stewardship pacing over reactive firefighting.',
    'quotes', jsonb_build_array(
      'Strong supplier relationships grow through patient stewardship — not constant switching.',
      'Not every supplier concern needs an immediate fix tonight — rest is part of sustainable operations.',
      'Partnership conversations protect wellbeing — rushed supplier replacement creates avoidable stress.',
      'Your supplier portfolio can evolve at a human pace — stewardship not suspicion.'
    ),
    'practices', jsonb_build_array(
      'Pause before reactive supplier switching — evaluate alternatives with calm context',
      'Celebrate reliable partnership quarters — not only cost savings',
      'Performance discussions reduce stress — proactive stewardship over panic',
      'Sustainable supplier pacing — cross-link Self Love A.76 rhythms'
    ),
    'route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports wellbeing rhythms — principle only; Supplier Intelligence stores business metadata, not personal wellbeing content.'
  );
$$;

create or replace function public._sirbp106_leadership_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership connection — executive visibility into supplier portfolio health and diversification.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'portfolio_briefings', 'label', 'Portfolio briefings', 'description', 'Stewardship briefings for leadership review — metadata summaries'),
      jsonb_build_object('key', 'dependency_governance', 'label', 'Dependency governance', 'description', 'Concentration risk awareness for strategic supplier decisions'),
      jsonb_build_object('key', 'partnership_strategy', 'label', 'Partnership strategy', 'description', 'Long-term supplier relationship alignment with business goals')
    ),
    'executive_route', '/app/executive',
    'boundary_note', 'Leadership sees aggregates and summaries — tenant-scoped stewardship metadata.'
  );
$$;

create or replace function public._sirbp106_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparent supplier intelligence — explainable scores, human approval, audited actions.',
    'users_should_see', jsonb_build_array(
      'How supplier scores combine delivery, quality, refund, responsiveness, margin, and longevity — metadata only',
      'auto_replacement_disabled default and human oversight for supplier relationship changes',
      'Safety note — no automatic supplier replacement; partnership not extraction',
      'Audit trail via supplier_intelligence_audit_logs — relationship notes, recommendation actions, briefing events'
    ),
    'operators_should_understand', jsonb_build_array(
      'Supplier Intelligence is stewardship scaffolding — not automated supplier switching bots',
      'Cross-links Trust & Action Engine — sensitive supplier actions may require approval at /app/approvals',
      'Integration Engine supplies connector context — do not bypass tenant connector policy',
      'Platform aggregates only at platform governance — tenant data stays tenant-scoped'
    ),
    'audit_note', 'sir_relationship_note_created, sir_recommendation_action, sir_briefing_generated — metadata only.',
    'approvals_route', '/app/approvals'
  );
$$;

create or replace function public._sirbp106_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Limitation principles — partnership not extraction.',
    'avoid', jsonb_build_array(
      jsonb_build_object('key', 'cost_center_only', 'label', 'Cost-center-only view', 'description', 'Never reduce suppliers to unit cost alone — relationship quality matters'),
      jsonb_build_object('key', 'unnecessary_replacement', 'label', 'Unnecessary replacement', 'description', 'Do not encourage supplier switching when performance discussion could resolve issues'),
      jsonb_build_object('key', 'price_only_optimization', 'label', 'Price-only optimization', 'description', 'Margin matters but price-only decisions erode long-term partnership value'),
      jsonb_build_object('key', 'ignoring_relationship_quality', 'label', 'Ignoring relationship quality', 'description', 'Longevity, responsiveness, and mutual value must inform stewardship')
    ),
    'boundary_note', 'auto_replacement_disabled true — humans accountable for every supplier decision.'
  );
$$;

create or replace function public._sirbp106_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Dogfooding — validate supplier stewardship patterns on real partnership decisions before broad rollout.',
    'sportsklaer_no', jsonb_build_object(
      'store', 'Sportsklær.no',
      'platform', 'Shopify',
      'patterns', jsonb_build_array(
        'Dropshipping supplier relationships with Nordic and international partners',
        'Seasonal activewear supplier stewardship and renewal preparation',
        'Dependency awareness across active lifestyle catalog categories',
        'Partnership expansion opportunities with trusted Nordic suppliers'
      )
    ),
    'shopify_note', 'Shopify integration supplies catalog and order context — Integration Engine cross-link.',
    'boundary_note', 'Dogfooding validates stewardship UX — metadata only on tenant data.'
  );
$$;

create or replace function public._sirbp106_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We understand our supplier relationships better than ever before.',
    'Suppliers are partners, not transactional resources.',
    'Stewardship not suspicion — trust and mutual value.',
    'Aipify Stewardship Companion informs and prepares — humans decide every supplier action.'
  );
$$;

create or replace function public._sirbp106_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'dropshipping_operations', 'label', 'Dropshipping Operations Phase 103', 'route', '/app/dropshipping-operations', 'note', 'Operational supplier monitoring — cross-link, NOT duplicate'),
    jsonb_build_object('key', 'commerce_intelligence', 'label', 'Commerce Intelligence Phase 101', 'route', '/app/commerce-intelligence', 'note', 'Supplier insights during product discovery'),
    jsonb_build_object('key', 'commerce_performance', 'label', 'Commerce Performance Phase 104', 'route', '/app/commerce-performance', 'note', 'Margin contributions cross-link'),
    jsonb_build_object('key', 'multi_store', 'label', 'Multi-Store Phase 105', 'route', '/app/multi-store', 'note', 'Supplier dependencies across portfolio'),
    jsonb_build_object('key', 'marketplace_governance', 'label', 'Marketplace Governance Phase 90', 'route', '/app/marketplace-governance', 'note', 'Marketplace supplier profiles — distinct layer'),
    jsonb_build_object('key', 'meeting_companion', 'label', 'Meeting Companion Phase 72', 'route', '/app/meeting-collaboration-intelligence-engine', 'note', 'Supplier meeting summaries cross-link'),
    jsonb_build_object('key', 'integration_engine', 'label', 'Integration Engine A.8', 'route', '/app/integration-engine', 'note', 'Shopify supplier ecosystems'),
    jsonb_build_object('key', 'approvals', 'label', 'Trust & Action', 'route', '/app/approvals', 'note', 'Supplier decisions requiring approval'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Sustainable stewardship pacing'),
    jsonb_build_object('key', 'executive', 'label', 'Executive Dashboard', 'route', '/app/executive', 'note', 'Leadership portfolio briefings'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'route', '/app/knowledge-center', 'note', 'Supplier intelligence FAQ and guides')
  );
$$;

create or replace function public._sirbp106_engagement_summary(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'portfolio_score', coalesce((public._sir_refresh_metrics(p_tenant_id)->>'portfolio_score')::numeric, 0),
    'health_classification', coalesce(public._sir_refresh_metrics(p_tenant_id)->>'health_classification', 'stable'),
    'active_suppliers', coalesce((public._sir_refresh_metrics(p_tenant_id)->>'active_suppliers')::int, 0),
    'open_risks', coalesce((public._sir_refresh_metrics(p_tenant_id)->>'open_risks')::int, 0),
    'diversification_alerts', coalesce((public._sir_refresh_metrics(p_tenant_id)->>'diversification_alerts')::int, 0),
    'objectives_documented', jsonb_array_length(public._sirbp106_objectives()),
    'score_components', jsonb_array_length(public._sirbp106_supplier_score_components()->'components'),
    'companion_examples', jsonb_array_length(public._sirbp106_companion_guidance()->'examples'),
    'integration_links', jsonb_array_length(public._sirbp106_integration_links()),
    'privacy_note', 'Supplier intelligence metadata only — no automatic supplier replacement.'
  );
$$;

create or replace function public._sirbp106_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_array(
    jsonb_build_object(
      'key', 'baseline_preserved',
      'label', 'Repo Phase 106 baseline fields preserved on dashboard',
      'met', to_regclass('public.supplier_intelligence_settings') is not null,
      'note', '_sir_* tables and RPC behavior intact.'
    ),
    jsonb_build_object(
      'key', 'auto_replacement_disabled',
      'label', 'auto_replacement_disabled default true — no automatic supplier replacement',
      'met', coalesce((
        select auto_replacement_disabled from public.supplier_intelligence_settings where tenant_id = p_tenant_id
      ), true),
      'note', 'Human oversight required for supplier changes.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links Dropshipping 103, Commerce Intelligence 101, Commerce Performance 104, Multi-Store 105, Meeting Companion, Integration Engine',
      'met', jsonb_array_length(public._sirbp106_integration_links()) >= 10,
      'note', 'Distinction note documents all mandatory cross-links.'
    ),
    jsonb_build_object(
      'key', 'limitation_principles',
      'label', 'Limitation principles — partnership not extraction',
      'met', jsonb_array_length(public._sirbp106_limitation_principles()->'avoid') >= 4,
      'note', 'Avoid cost-center-only view and unnecessary replacement.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Sportsklær.no Shopify dropshipping relationships',
      'met', (public._sirbp106_dogfooding()->'sportsklaer_no') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS principle — humans accountable',
      'met', true,
      'note', 'Stewardship Companion informs and prepares — humans decide.'
    )
  );
end; $$;

create or replace function public._sirbp106_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 106 — Supplier Intelligence & Relationship Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE106_SUPPLIER_INTELLIGENCE_RELATIONSHIP.md',
    'engine_phase', 'Repo Phase 106 Supplier Intelligence & Relationship Engine',
    'route', '/app/supplier-intelligence',
    'mapping_note', 'ABOS Blueprint Phase 106 extends repo Phase 106 with partnership stewardship scaffolding. Distinct from Dropshipping Operations Phase 103.',
    'distinction_note', public._sirbp106_distinction_note(),
    'mission', public._sirbp106_mission(),
    'philosophy', public._sirbp106_philosophy(),
    'abos_principle', public._sirbp106_abos_principle(),
    'objectives', public._sirbp106_objectives(),
    'supplier_dashboard', public._sirbp106_supplier_dashboard(),
    'supplier_health_indicators', public._sirbp106_supplier_health_indicators(),
    'supplier_score_components', public._sirbp106_supplier_score_components(),
    'supplier_diversification_insights', public._sirbp106_supplier_diversification_insights(),
    'supplier_relationship_management', public._sirbp106_supplier_relationship_management(),
    'supplier_risk_intelligence', public._sirbp106_supplier_risk_intelligence(),
    'supplier_opportunity_insights', public._sirbp106_supplier_opportunity_insights(),
    'companion_guidance', public._sirbp106_companion_guidance(),
    'meeting_companion_connection', public._sirbp106_meeting_companion_connection(),
    'self_love_connection', public._sirbp106_self_love_connection(),
    'leadership_connection', public._sirbp106_leadership_connection(),
    'trust_connection', public._sirbp106_trust_connection(),
    'limitation_principles', public._sirbp106_limitation_principles(),
    'dogfooding', public._sirbp106_dogfooding(),
    'success_criteria', public._sirbp106_success_criteria(p_tenant_id),
    'vision', public._sirbp106_vision(),
    'vision_phrases', public._sirbp106_vision_phrases(),
    'integration_links', public._sirbp106_integration_links(),
    'engagement_summary', public._sirbp106_engagement_summary(p_tenant_id),
    'privacy_note', 'Supplier intelligence blueprint data is metadata only — health scores, relationship summaries, diversification alerts. No automatic supplier replacement. Humans decide; Aipify Stewardship Companion informs and prepares.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Card RPC — preserve ALL baseline fields; append Phase 106
-- ---------------------------------------------------------------------------
create or replace function public.get_supplier_intelligence_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb; v_engagement jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._sir_ensure_settings(v_tenant_id);
  v_metrics := public._sir_refresh_metrics(v_tenant_id);
  v_engagement := public._sirbp106_engagement_summary(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'portfolio_score', v_metrics->'portfolio_score',
    'health_classification', v_metrics->'health_classification',
    'philosophy', 'Suppliers are partners, not transactional resources — trust and mutual value.',
    'human_oversight_required', true,
    'implementation_blueprint_phase106', jsonb_build_object(
      'phase', 'Phase 106 — Supplier Intelligence & Relationship Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE106_SUPPLIER_INTELLIGENCE_RELATIONSHIP.md',
      'engine_phase', 'Repo Phase 106 Supplier Intelligence & Relationship Engine',
      'route', '/app/supplier-intelligence',
      'mapping_note', 'ABOS Blueprint Phase 106 extends repo Phase 106 — partnership stewardship; humans accountable.'
    ),
    'supplier_intelligence_mission', public._sirbp106_mission(),
    'supplier_intelligence_abos_principle', public._sirbp106_abos_principle(),
    'supplier_intelligence_engagement_summary', v_engagement,
    'supplier_intelligence_note', 'Supplier Intelligence & Relationship Engine (ABOS Phase 106) — cultivate stronger, resilient supplier relationships through visibility and stewardship.',
    'supplier_intelligence_vision_note', public._sirbp106_vision()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Dashboard RPC — preserve ALL baseline fields; append Phase 106
-- ---------------------------------------------------------------------------
create or replace function public.get_supplier_intelligence_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.supplier_intelligence_settings;
  v_metrics jsonb;
begin
  v_tenant_id := public._sir_require_tenant();
  v_settings := public._sir_ensure_settings(v_tenant_id);
  perform public._sir_seed_suppliers(v_tenant_id);
  perform public._sir_seed_insights(v_tenant_id);
  v_metrics := public._sir_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'auto_replacement_disabled', v_settings.auto_replacement_disabled,
    'philosophy', 'Suppliers are partners, not transactional resources — trust and mutual value.',
    'safety_note', 'Aipify recommends stewardship actions — organizations remain responsible for supplier decisions. No automatic supplier replacement.',
    'engine_enabled', v_settings.engine_enabled,
    'diversification_alert_threshold', v_settings.diversification_alert_threshold,
    'portfolio_score', v_metrics->'portfolio_score',
    'health_classification', v_metrics->'health_classification',
    'active_suppliers', v_metrics->'active_suppliers',
    'open_risks', v_metrics->'open_risks',
    'opportunity_insights_count', v_metrics->'opportunity_insights',
    'diversification_alerts_count', v_metrics->'diversification_alerts',
    'relationship_records_count', v_metrics->'relationship_records',
    'recommendations_pending', v_metrics->'recommendations_pending',
    'supplier_profiles', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'supplier_key', p.supplier_key, 'supplier_name', p.supplier_name,
        'status', p.status, 'region', p.region, 'dependency_level', p.dependency_level,
        'relationship_longevity_months', p.relationship_longevity_months
      ) order by p.supplier_name)
      from public.supplier_profiles p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'health_scores', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', h.id, 'supplier_id', h.supplier_id, 'supplier_name', p.supplier_name,
        'health_score', h.health_score, 'status_level', h.status_level,
        'delivery_reliability', h.delivery_reliability, 'quality_indicator', h.quality_indicator,
        'refund_frequency', h.refund_frequency, 'responsiveness', h.responsiveness,
        'margin_performance', h.margin_performance
      ) order by h.health_score desc)
      from public.supplier_intelligence_health_scores h
      join public.supplier_profiles p on p.id = h.supplier_id
      where h.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'relationship_records', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'supplier_id', r.supplier_id, 'supplier_name', p.supplier_name,
        'contact_history_summary', r.contact_history_summary, 'meeting_summary', r.meeting_summary,
        'improvement_initiative', r.improvement_initiative, 'partnership_opportunity', r.partnership_opportunity,
        'recorded_at', r.recorded_at
      ) order by r.recorded_at desc)
      from public.supplier_relationship_records r
      left join public.supplier_profiles p on p.id = r.supplier_id
      where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'risk_events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'supplier_id', e.supplier_id, 'supplier_name', p.supplier_name,
        'risk_type', e.risk_type, 'title', e.title, 'summary', e.summary,
        'severity', e.severity, 'resolved', e.resolved
      ) order by e.detected_at desc)
      from public.supplier_risk_events e
      left join public.supplier_profiles p on p.id = e.supplier_id
      where e.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'opportunity_insights', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id, 'supplier_id', o.supplier_id, 'supplier_name', p.supplier_name,
        'opportunity_type', o.opportunity_type, 'title', o.title, 'summary', o.summary, 'priority', o.priority
      ) order by o.created_at desc)
      from public.supplier_opportunity_insights o
      left join public.supplier_profiles p on p.id = o.supplier_id
      where o.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'diversification_alerts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id, 'supplier_id', d.supplier_id, 'supplier_name', p.supplier_name,
        'alert_type', d.alert_type, 'title', d.title, 'summary', d.summary,
        'affected_products_count', d.affected_products_count, 'acknowledged', d.acknowledged
      ) order by d.created_at desc)
      from public.supplier_diversification_alerts d
      left join public.supplier_profiles p on p.id = d.supplier_id
      where d.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'supplier_id', r.supplier_id, 'section', r.section, 'title', r.title,
        'summary', r.summary, 'recommendation_type', r.recommendation_type,
        'priority', r.priority, 'rationale', r.rationale
      ) order by r.created_at desc)
      from public.supplier_intelligence_recommendations r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'summary', b.summary, 'created_at', b.created_at)
        order by b.created_at desc)
      from public.supplier_intelligence_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'dropshipping_operations', 'Operational supplier monitoring for dropshipping — cross-link, not duplicate',
      'commerce_intelligence', 'Supplier insights during product discovery',
      'commerce_performance', 'Margin contributions cross-link',
      'multi_store', 'Supplier dependencies across portfolio',
      'marketplace_governance', 'Marketplace supplier profiles/scores — distinct layer',
      'meeting_companion', 'Supplier meeting summaries cross-link',
      'integration_engine', 'Shopify supplier ecosystems',
      'knowledge_center', 'Supplier intelligence guides and FAQ',
      'approvals', 'Supplier decisions requiring human approval'
    ),
    'implementation_blueprint_phase106', jsonb_build_object(
      'phase', 'Phase 106 — Supplier Intelligence & Relationship Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE106_SUPPLIER_INTELLIGENCE_RELATIONSHIP.md',
      'engine_phase', 'Repo Phase 106 Supplier Intelligence & Relationship Engine',
      'route', '/app/supplier-intelligence',
      'mapping_note', 'ABOS Blueprint Phase 106 extends repo Phase 106 — partnership stewardship; humans accountable.'
    ),
    'supplier_intelligence_engine_note', 'Supplier Intelligence & Relationship Engine (ABOS Phase 106) — cultivate stronger, resilient supplier relationships through visibility and stewardship.',
    'supplier_intelligence_blueprint', public._sirbp106_blueprint_block(v_tenant_id),
    'supplier_intelligence_distinction_note', public._sirbp106_distinction_note(),
    'supplier_intelligence_mission', public._sirbp106_mission(),
    'supplier_intelligence_philosophy', public._sirbp106_philosophy(),
    'supplier_intelligence_abos_principle', public._sirbp106_abos_principle(),
    'supplier_intelligence_objectives', public._sirbp106_objectives(),
    'supplier_dashboard', public._sirbp106_supplier_dashboard(),
    'supplier_health_indicators', public._sirbp106_supplier_health_indicators(),
    'supplier_score_components', public._sirbp106_supplier_score_components(),
    'supplier_diversification_insights', public._sirbp106_supplier_diversification_insights(),
    'supplier_relationship_management', public._sirbp106_supplier_relationship_management(),
    'supplier_risk_intelligence', public._sirbp106_supplier_risk_intelligence(),
    'supplier_opportunity_insights', public._sirbp106_supplier_opportunity_insights(),
    'supplier_companion_guidance', public._sirbp106_companion_guidance(),
    'supplier_meeting_companion_connection', public._sirbp106_meeting_companion_connection(),
    'supplier_self_love_connection', public._sirbp106_self_love_connection(),
    'supplier_leadership_connection', public._sirbp106_leadership_connection(),
    'supplier_trust_connection', public._sirbp106_trust_connection(),
    'supplier_limitation_principles', public._sirbp106_limitation_principles(),
    'supplier_intelligence_dogfooding', public._sirbp106_dogfooding(),
    'sirbp106_integration_links', public._sirbp106_integration_links(),
    'supplier_intelligence_engagement_summary', public._sirbp106_engagement_summary(v_tenant_id),
    'supplier_intelligence_success_criteria', public._sirbp106_success_criteria(v_tenant_id),
    'supplier_intelligence_vision', public._sirbp106_vision(),
    'supplier_intelligence_vision_phrases', public._sirbp106_vision_phrases(),
    'supplier_intelligence_privacy_note', 'Supplier intelligence metadata only — no automatic supplier replacement. Humans decide; Aipify Stewardship Companion informs and prepares.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._sirbp106_distinction_note() to authenticated;
grant execute on function public._sirbp106_mission() to authenticated;
grant execute on function public._sirbp106_philosophy() to authenticated;
grant execute on function public._sirbp106_abos_principle() to authenticated;
grant execute on function public._sirbp106_vision() to authenticated;
grant execute on function public._sirbp106_objectives() to authenticated;
grant execute on function public._sirbp106_supplier_dashboard() to authenticated;
grant execute on function public._sirbp106_supplier_health_indicators() to authenticated;
grant execute on function public._sirbp106_supplier_score_components() to authenticated;
grant execute on function public._sirbp106_supplier_diversification_insights() to authenticated;
grant execute on function public._sirbp106_supplier_relationship_management() to authenticated;
grant execute on function public._sirbp106_supplier_risk_intelligence() to authenticated;
grant execute on function public._sirbp106_supplier_opportunity_insights() to authenticated;
grant execute on function public._sirbp106_companion_guidance() to authenticated;
grant execute on function public._sirbp106_meeting_companion_connection() to authenticated;
grant execute on function public._sirbp106_self_love_connection() to authenticated;
grant execute on function public._sirbp106_leadership_connection() to authenticated;
grant execute on function public._sirbp106_trust_connection() to authenticated;
grant execute on function public._sirbp106_limitation_principles() to authenticated;
grant execute on function public._sirbp106_dogfooding() to authenticated;
grant execute on function public._sirbp106_vision_phrases() to authenticated;
grant execute on function public._sirbp106_integration_links() to authenticated;
grant execute on function public._sirbp106_engagement_summary(uuid) to authenticated;
grant execute on function public._sirbp106_success_criteria(uuid) to authenticated;
grant execute on function public._sirbp106_blueprint_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'supplier-intelligence-blueprint-phase106', 'Supplier Intelligence & Relationship (ABOS Phase 106)',
  'Supplier Intelligence & Relationship Engine — partnership stewardship, health scores, diversification, and relationship management. Humans accountable.',
  'authenticated', 132
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'supplier-intelligence-blueprint-phase106' and tenant_id is null
);
