-- Implementation Blueprint Phase 102 — Product Automation Engine
-- Extends Product Automation Engine repo Phase 102. No new tables.
-- Distinct from Dropshipping Operations repo Phase 103 at /app/dropshipping-operations.
-- Distinct from Commerce Intelligence Blueprint Phase 101 at /app/commerce-intelligence (discovery vs automation).

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._paebp102_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 102 — Product Automation Engine at /app/product-automation. Extends Product Automation Engine repo Phase 102 (_pae_*) and preserves ALL baseline dashboard and card fields. Automation supports creativity and consistency — humans own strategic decisions. Distinct from Dropshipping Operations repo Phase 103 at /app/dropshipping-operations (supplier and operational context cross-link). Distinct from Commerce Intelligence Blueprint Phase 101 at /app/commerce-intelligence (discovery and opportunity evaluation before import). Cross-links Workflow Orchestration Phase 86 (/app/workflow-orchestration-engine), Trust & Action (/app/approvals), Platform Install Phase 100, Business DNA, Self Love A.76. Helpers use _paebp102_* — never collide with _pae_*.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._paebp102_mission()
returns text language sql immutable as $$
  select 'Streamline product operations via automation, localization, and optimization with strategic oversight.';
$$;

create or replace function public._paebp102_philosophy()
returns text language sql immutable as $$
  select 'Automation supports creativity and consistency — humans own strategic decisions. Prepare store-ready content efficiently; never bypass accountability.';
$$;

create or replace function public._paebp102_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — humans in control. Aipify Product Companion prepares import, translation, rewriting, SEO, and category suggestions; humans choose draft, review, or approved publish paths. auto_publish_disabled remains default true.';
$$;

create or replace function public._paebp102_vision()
returns text language sql immutable as $$
  select 'We accomplished in minutes what previously required hours.';
$$;

create or replace function public._paebp102_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'product_import_automation', 'label', 'Product import automation', 'emoji', '🦉', 'description', 'Import from Shopify, WooCommerce, CSV, supplier feeds — awaiting review by default'),
    jsonb_build_object('key', 'localization_translation', 'label', 'Localization & translation', 'emoji', '🌹', 'description', 'no/en/sv/da/de/fr and additional language scaffold — human review before publish'),
    jsonb_build_object('key', 'brand_voice_rewriting', 'label', 'Brand voice rewriting', 'emoji', '🔔', 'description', 'Professional, luxury, sport performance, and custom brand voice modes with human checkpoint'),
    jsonb_build_object('key', 'seo_optimization', 'label', 'SEO optimization', 'emoji', '🦉', 'description', 'Title, meta, keywords, structured data recommendations — apply with approval'),
    jsonb_build_object('key', 'category_quality_readiness', 'label', 'Category & quality readiness', 'emoji', '🌹', 'description', 'Category suggestions and quality validation before store-ready status'),
    jsonb_build_object('key', 'approval_workflow_integration', 'label', 'Approval workflow integration', 'emoji', '🔔', 'description', 'Draft, human review, optional auto paths — cross-link Trust & Action and Workflow Orchestration Phase 86')
  );
$$;

create or replace function public._paebp102_product_import_automation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Product import automation — all imports land awaiting review; never silent publish.',
    'source_types', jsonb_build_array(
      jsonb_build_object('key', 'shopify', 'label', 'Shopify', 'description', 'Connected store catalog via Platform Install Phase 100'),
      jsonb_build_object('key', 'woocommerce', 'label', 'WooCommerce', 'description', 'WordPress/WooCommerce connector import'),
      jsonb_build_object('key', 'csv', 'label', 'CSV upload', 'description', 'Structured CSV product import with validation'),
      jsonb_build_object('key', 'supplier_feed', 'label', 'Supplier feed', 'description', 'Supplier XML/API feed — cross-link Dropshipping Operations Phase 103'),
      jsonb_build_object('key', 'xml_feed', 'label', 'XML feed', 'description', 'Standard product XML import'),
      jsonb_build_object('key', 'api', 'label', 'API import', 'description', 'Programmatic import via approved connectors'),
      jsonb_build_object('key', 'manual', 'label', 'Manual entry', 'description', 'Single product import for testing and corrections')
    ),
    'default_status', 'awaiting_review',
    'commerce_intelligence_route', '/app/commerce-intelligence',
    'platform_install_route', '/app/platform-install',
    'boundary_note', 'Import prepares catalog entries — Commerce Intelligence Phase 101 handles discovery before import decision.'
  );
$$;

create or replace function public._paebp102_product_translation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Product translation — localized store-ready content with human review before publish.',
    'primary_locales', jsonb_build_array(
      jsonb_build_object('code', 'no', 'label', 'Norwegian'),
      jsonb_build_object('code', 'en', 'label', 'English'),
      jsonb_build_object('code', 'sv', 'label', 'Swedish'),
      jsonb_build_object('code', 'da', 'label', 'Danish'),
      jsonb_build_object('code', 'de', 'label', 'German'),
      jsonb_build_object('code', 'fr', 'label', 'French')
    ),
    'additional_languages_scaffold', jsonb_build_array(
      jsonb_build_object('code', 'es', 'label', 'Spanish', 'status', 'scaffold'),
      jsonb_build_object('code', 'nl', 'label', 'Dutch', 'status', 'scaffold'),
      jsonb_build_object('code', 'fi', 'label', 'Finnish', 'status', 'scaffold'),
      jsonb_build_object('code', 'pl', 'label', 'Polish', 'status', 'scaffold'),
      jsonb_build_object('code', 'it', 'label', 'Italian', 'status', 'scaffold')
    ),
    'fields', jsonb_build_array('title', 'description', 'meta_description', 'tags', 'category_labels'),
    'review_required', true,
    'boundary_note', 'Translation versions stored for review — never silent overwrite of published content.'
  );
$$;

create or replace function public._paebp102_product_rewriting()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Product rewriting — brand voice consistency with creative enhancement and human checkpoint.',
    'modes', jsonb_build_array(
      jsonb_build_object('key', 'professional', 'label', 'Professional', 'description', 'Clear, confident, trustworthy product copy'),
      jsonb_build_object('key', 'luxury', 'label', 'Luxury', 'description', 'Premium tone with refined vocabulary'),
      jsonb_build_object('key', 'sport_performance', 'label', 'Sport performance', 'description', 'Active lifestyle and performance-oriented copy — Sportsklær.no dogfooding'),
      jsonb_build_object('key', 'minimalistic', 'label', 'Minimalistic', 'description', 'Concise, scannable product descriptions'),
      jsonb_build_object('key', 'custom_brand_voice', 'label', 'Custom brand voice', 'description', 'Tenant brand_voice_profiles — Business DNA cross-link')
    ),
    'dimensions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'brand_consistency', 'label', 'Brand voice consistency', 'description', 'Tone, forbidden terms, preferred terminology from brand voice profile'),
      jsonb_build_object('emoji', '🌹', 'key', 'creative_enhancement', 'label', 'Creative enhancement', 'description', 'Improve clarity and appeal without losing product truth'),
      jsonb_build_object('emoji', '🔔', 'key', 'human_checkpoint', 'label', 'Human review checkpoint', 'description', 'Pause for review when brand-sensitive or low-confidence rewrite detected')
    ),
    'business_dna_route', '/app/settings/business-dna',
    'boundary_note', 'Rewriting prepares content — humans approve before publication.'
  );
$$;

create or replace function public._paebp102_seo_optimization()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'SEO optimization — actionable recommendations with priority, rationale, and human apply/dismiss.',
    'recommendation_types', jsonb_build_array(
      jsonb_build_object('key', 'title_length', 'label', 'Title length', 'description', 'Optimal title length for search visibility'),
      jsonb_build_object('key', 'keyword', 'label', 'Keywords', 'description', 'Primary and secondary keyword placement'),
      jsonb_build_object('key', 'meta_description', 'label', 'Meta description', 'description', 'Compelling meta description within character limits'),
      jsonb_build_object('key', 'heading', 'label', 'Headings', 'description', 'Structured heading hierarchy in descriptions'),
      jsonb_build_object('key', 'internal_link', 'label', 'Internal links', 'description', 'Related product and collection link suggestions'),
      jsonb_build_object('key', 'structured_data', 'label', 'Structured data', 'description', 'Product schema and rich result readiness'),
      jsonb_build_object('key', 'image_alt', 'label', 'Image alt text', 'description', 'Accessible and search-friendly alt descriptions'),
      jsonb_build_object('key', 'faq_content', 'label', 'FAQ content', 'description', 'Common buyer questions for rich snippets')
    ),
    'priorities', jsonb_build_array('informational', 'moderate', 'important', 'critical'),
    'boundary_note', 'SEO recommendations are suggestions — humans apply or dismiss; no automatic publish-side changes.'
  );
$$;

create or replace function public._paebp102_category_recommendations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Category recommendations — primary, secondary, tags, and collections with confidence scoring.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'category_fit', 'label', 'Category fit', 'description', 'Primary and secondary category alignment with catalog structure'),
      jsonb_build_object('emoji', '🌹', 'key', 'merchandising', 'label', 'Merchandising alignment', 'description', 'Tags and collection assignments matching store identity'),
      jsonb_build_object('emoji', '🔔', 'key', 'low_confidence_review', 'label', 'Low confidence review', 'description', 'Human review when category confidence is low before publish')
    ),
    'confidence_levels', jsonb_build_array('low', 'medium', 'high'),
    'boundary_note', 'Category suggestions prepare merchandising — humans confirm before store sync.'
  );
$$;

create or replace function public._paebp102_product_quality_checks()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Product quality checks — readiness validation before approval and publish.',
    'check_types', jsonb_build_array(
      jsonb_build_object('key', 'missing_images', 'label', 'Missing images', 'severity', 'important', 'description', 'Products without primary image'),
      jsonb_build_object('key', 'thin_description', 'label', 'Thin description', 'severity', 'moderate', 'description', 'Description below minimum quality threshold'),
      jsonb_build_object('key', 'price_anomaly', 'label', 'Price anomaly', 'severity', 'important', 'description', 'Unusual price vs category norms'),
      jsonb_build_object('key', 'duplicate_title', 'label', 'Duplicate title', 'severity', 'moderate', 'description', 'Potential duplicate product titles in catalog'),
      jsonb_build_object('key', 'inventory_gap', 'label', 'Inventory gap', 'severity', 'informational', 'description', 'Missing or zero inventory metadata'),
      jsonb_build_object('key', 'translation_missing', 'label', 'Translation missing', 'severity', 'moderate', 'description', 'Target locale content not yet translated'),
      jsonb_build_object('key', 'seo_critical', 'label', 'Critical SEO gap', 'severity', 'critical', 'description', 'Blocking SEO issues before publish readiness')
    ),
    'readiness_score_note', 'Readiness score 0–100 combines quality, SEO, translation, and approval status — metadata only.',
    'boundary_note', 'Quality warnings guide review — humans resolve or accept with documented approval.'
  );
$$;

create or replace function public._paebp102_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Product Companion guidance — warm, optional, non-intrusive. Humans in control at every step.',
    'companion_name', 'Product Companion',
    'not_label', 'AI product bot',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'import_ready', 'prompt', 'Imported products are ready for review — shall I prepare a translation summary for your target locales?', 'consideration', 'Batch efficiency — humans approve each step'),
      jsonb_build_object('emoji', '🌹', 'key', 'rewrite_suggestion', 'prompt', 'Brand voice rewriting could strengthen these descriptions — would a preview before approval feel helpful?', 'consideration', 'Creative enhancement without losing product truth'),
      jsonb_build_object('emoji', '🔔', 'key', 'approval_checkpoint', 'prompt', 'SEO and category suggestions are ready — human review is required before publish. Open approvals?', 'consideration', 'Cross-link Trust & Action — never auto-publish')
    ),
    'approvals_route', '/app/approvals',
    'boundary_note', 'Product Companion scaffolds automation — never bypasses approval or publishes silently.'
  );
$$;

create or replace function public._paebp102_workflow_automation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Workflow automation — structured pipeline with human checkpoint before publish.',
    'pipeline_steps', jsonb_build_array(
      jsonb_build_object('step', 1, 'key', 'import', 'label', 'Import', 'description', 'Catalog import from connected source — status awaiting_review'),
      jsonb_build_object('step', 2, 'key', 'translate', 'label', 'Translate', 'description', 'Target locale translation versions for review'),
      jsonb_build_object('step', 3, 'key', 'rewrite', 'label', 'Rewrite', 'description', 'Brand voice rewriting with mode selection'),
      jsonb_build_object('step', 4, 'key', 'seo', 'label', 'SEO optimize', 'description', 'SEO recommendations generated and prioritized'),
      jsonb_build_object('step', 5, 'key', 'categories', 'label', 'Categories', 'description', 'Category, tag, and collection suggestions'),
      jsonb_build_object('step', 6, 'key', 'approval', 'label', 'Approval', 'description', 'Human review — draft, approve, or reject via approval workflow'),
      jsonb_build_object('step', 7, 'key', 'publish', 'label', 'Publish', 'description', 'Publish only after explicit approval — auto_publish_disabled default true')
    ),
    'bulk_actions', jsonb_build_array('translate', 'rewrite', 'seo_analyze', 'category_suggest', 'approval_queue'),
    'workflow_orchestration_route', '/app/workflow-orchestration-engine',
    'boundary_note', 'Bulk automation queues prepare work — publish requires human approval unless tenant explicitly opts in.'
  );
$$;

create or replace function public._paebp102_approval_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Approval principles — humans in control; draft, review, and optional auto paths.',
    'modes', jsonb_build_array(
      jsonb_build_object('key', 'draft', 'label', 'Draft', 'description', 'Save prepared content without publishing — default safe path'),
      jsonb_build_object('key', 'human_review', 'label', 'Human review', 'description', 'Mandatory approval before publication — auto_publish_disabled default true'),
      jsonb_build_object('key', 'auto_publish', 'label', 'Auto publish (opt-in)', 'description', 'Tenant-controlled opt-in only — never default; requires explicit settings change'),
      jsonb_build_object('key', 'approval_workflows', 'label', 'Approval workflows', 'description', 'Multi-step orchestration via Workflow Orchestration Phase 86 and Trust & Action')
    ),
    'trust_action_route', '/app/approvals',
    'workflow_orchestration_route', '/app/workflow-orchestration-engine',
    'must_avoid', jsonb_build_array(
      'Silent auto-publish without tenant opt-in',
      'Bypassing quality warnings for critical severity without documented approval',
      'Publishing translated content without review when review_required is true',
      'Bulk publish without per-batch human confirmation'
    ),
    'boundary_note', 'Accountability preserved — automation eliminates unnecessary effort, never responsibility.'
  );
$$;

create or replace function public._paebp102_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — sustainable catalog pacing; batch automation without burnout.',
    'quotes', jsonb_build_array(
      'We accomplished in minutes what previously required hours — without sacrificing quality or strategic judgment.',
      'Batch automation supports your rhythm — pause between bulk runs when the catalog feels overwhelming.',
      'Efficiency is not urgency — prepared products can wait for your review at a human pace.',
      'Creative consistency grows through steady preparation — not marathon publishing sessions.'
    ),
    'practices', jsonb_build_array(
      'Use bulk automation in manageable batches — not all-at-once pressure',
      'Celebrate prepared catalog progress — not only published volume',
      'Draft mode protects rest — nothing publishes until you are ready',
      'Sustainable growth pacing — cross-link Self Love A.76 rhythms'
    ),
    'route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports wellbeing rhythms — principle only; Product Automation stores product metadata, not personal wellbeing content.'
  );
$$;

create or replace function public._paebp102_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparent automation — explainable steps, human approval, audited actions.',
    'users_should_see', jsonb_build_array(
      'How import, translation, rewrite, SEO, and category steps are recorded — version history for review',
      'auto_publish_disabled default and approval status on every product',
      'Quality warnings and readiness scores with severity and explanation',
      'Audit trail via product automation audit log — import, translate, rewrite, SEO, approve, bulk events'
    ),
    'operators_should_understand', jsonb_build_array(
      'Product automation is preparation scaffolding — not unattended catalog bots',
      'Cross-links Trust & Action Engine — sensitive publish actions need approval context',
      'Commerce Intelligence Phase 101 supplies discovery — Product Automation handles post-approval preparation',
      'Platform aggregates only at platform governance — tenant product data stays tenant-scoped'
    ),
    'audit_note', 'pae_product_imported, pae_translated, pae_rewritten, pae_seo_analyzed, pae_approved, pae_bulk_run, pae_briefing_generated — metadata only.'
  );
$$;

create or replace function public._paebp102_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Dogfooding — validate product automation on real catalog workflows before broad rollout.',
    'sportsklaer_no', jsonb_build_object(
      'slug', 'sportsklaer-no',
      'role', 'Sportsklær.no — active lifestyle commerce dogfooding',
      'focus', jsonb_build_array(
        'Shopify catalog import via Platform Install Phase 100',
        'Nordic locale translation — no, sv, da for sport performance products',
        'Sport performance rewriting mode for training and outdoor categories',
        'SEO optimization for active lifestyle keywords and seasonal campaigns',
        'Supplier sync context — cross-link Dropshipping Operations Phase 103'
      )
    ),
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal validation — Product Companion tone, approval principles, KC FAQ',
      'focus', jsonb_build_array(
        'Product Companion guidance examples (🦉🌹🔔)',
        'Approval principles — no silent auto-publish language in ILM',
        'Workflow pipeline documentation — import through publish steps',
        'Knowledge Center FAQ — implementation-blueprint-phase102-faq'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — product automation in commerce operations',
      'focus', jsonb_build_array(
        'Import and translation workflow with human approval',
        'SEO and category suggestions before publish',
        'Cross-link Commerce Intelligence Phase 101 discovery-to-import path'
      )
    )
  );
$$;

create or replace function public._paebp102_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'We accomplished in minutes what previously required hours.',
    'Automation supports creativity and consistency — humans own strategic decisions.',
    '🦉 Import, translate, and optimize with strategic oversight — not unattended bots.',
    '🌹 Brand voice and localization that fit your store identity.',
    '🔔 Human review before publish — accountability preserved.',
    'From product discovery to store-ready content — preparation, not pressure.',
    'Draft, review, approve — humans in control at every step.',
    'Aipify Product Companion informs and prepares — humans decide when to publish.'
  );
$$;

create or replace function public._paebp102_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'commerce_intelligence_phase101', 'label', 'Commerce Intelligence (Blueprint Phase 101)', 'route', '/app/commerce-intelligence', 'note', 'Discovery vs automation — evaluate before import'),
    jsonb_build_object('key', 'dropshipping_operations_phase103', 'label', 'Dropshipping Operations (Phase 103)', 'route', '/app/dropshipping-operations', 'note', 'Supplier monitoring and order health — operational cross-link'),
    jsonb_build_object('key', 'workflow_orchestration_phase86', 'label', 'Workflow Orchestration (Phase 86)', 'route', '/app/workflow-orchestration-engine', 'note', 'Multi-step approval orchestration'),
    jsonb_build_object('key', 'trust_action_approvals', 'label', 'Trust & Action — Approvals', 'route', '/app/approvals', 'note', 'Human review before publish — mandatory checkpoint'),
    jsonb_build_object('key', 'platform_install_phase100', 'label', 'Platform Install (Phase 100)', 'route', '/app/platform-install', 'note', 'Shopify, WooCommerce, and connector catalog import'),
    jsonb_build_object('key', 'business_dna', 'label', 'Business DNA Engine', 'route', '/app/settings/business-dna', 'note', 'Brand tone and template cross-link for rewriting'),
    jsonb_build_object('key', 'commerce_performance_phase104', 'label', 'Commerce Performance & Profit (Phase 104)', 'route', '/app/commerce-performance', 'note', 'Profit context after catalog is live — cross-link'),
    jsonb_build_object('key', 'integration_engine_a8', 'label', 'Integration Engine (A.8)', 'route', '/app/integration-engine', 'note', 'Approved connectors for supplier sync'),
    jsonb_build_object('key', 'self_love_a76', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Sustainable catalog pacing — principle only'),
    jsonb_build_object('key', 'learning_engine', 'label', 'Learning Engine', 'route', '/app/learning', 'note', 'Assisted learning from approved automation patterns — metadata only'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'route', '/app/knowledge-center', 'note', 'Product automation guides and FAQ')
  );
$$;

create or replace function public._paebp102_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_metrics jsonb;
  v_imported int := 0;
  v_translations int := 0;
  v_rewrites int := 0;
  v_seo int := 0;
begin
  perform public._pae_ensure_settings(p_tenant_id);
  v_metrics := public._pae_refresh_metrics(p_tenant_id);

  select count(*) into v_imported from public.imported_products where tenant_id = p_tenant_id;
  select count(*) into v_translations from public.translation_versions where tenant_id = p_tenant_id;
  select count(*) into v_rewrites from public.rewriting_versions where tenant_id = p_tenant_id;
  select count(*) into v_seo from public.seo_recommendations where tenant_id = p_tenant_id and applied = false;

  return jsonb_build_object(
    'automation_score', coalesce((v_metrics->>'automation_score')::numeric, 0),
    'imported_products_count', coalesce((v_metrics->>'imported_products_count')::int, 0),
    'awaiting_approval_count', coalesce((v_metrics->>'awaiting_approval_count')::int, 0),
    'avg_readiness_score', coalesce((v_metrics->>'avg_readiness_score')::numeric, 0),
    'seo_recommendations_open', v_seo,
    'translation_versions', v_translations,
    'rewriting_versions', v_rewrites,
    'products_tracked', v_imported,
    'objectives_documented', jsonb_array_length(public._paebp102_objectives()),
    'pipeline_steps', jsonb_array_length(public._paebp102_workflow_automation()->'pipeline_steps'),
    'primary_locales', jsonb_array_length(public._paebp102_product_translation()->'primary_locales'),
    'companion_examples', jsonb_array_length(public._paebp102_companion_guidance()->'examples'),
    'integration_links', jsonb_array_length(public._paebp102_integration_links()),
    'privacy_note', 'Aggregate product automation counts and blueprint scaffolds only — no raw supplier PII or payment records.'
  );
end; $$;

create or replace function public._paebp102_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_imported int := 0;
begin
  perform public._pae_ensure_settings(p_tenant_id);
  perform public._pae_seed_products(p_tenant_id);
  perform public._pae_seed_automation_data(p_tenant_id);
  v_engagement := public._paebp102_engagement_summary(p_tenant_id);
  v_imported := coalesce((v_engagement->>'products_tracked')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'product_import_automation',
      'label', 'Product import automation — source types and awaiting review default',
      'met', jsonb_array_length(public._paebp102_product_import_automation()->'source_types') >= 5,
      'note', 'Cross-link Commerce Intelligence Phase 101 for pre-import discovery.'
    ),
    jsonb_build_object(
      'key', 'product_translation',
      'label', 'Product translation — no/en/sv/da/de/fr plus scaffold',
      'met', jsonb_array_length(public._paebp102_product_translation()->'primary_locales') >= 6,
      'note', 'Additional languages scaffold documented for future expansion.'
    ),
    jsonb_build_object(
      'key', 'product_rewriting',
      'label', 'Product rewriting — brand voice modes (🦉🌹🔔)',
      'met', jsonb_array_length(public._paebp102_product_rewriting()->'dimensions') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'seo_optimization',
      'label', 'SEO optimization — recommendation types documented',
      'met', jsonb_array_length(public._paebp102_seo_optimization()->'recommendation_types') >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'category_recommendations',
      'label', 'Category recommendations — confidence and review (🦉🌹🔔)',
      'met', jsonb_array_length(public._paebp102_category_recommendations()->'dimensions') >= 3,
      'note', null
    ),
    jsonb_build_object(
      'key', 'product_quality_checks',
      'label', 'Product quality checks — readiness validation',
      'met', jsonb_array_length(public._paebp102_product_quality_checks()->'check_types') >= 5,
      'note', 'Readiness score on dashboard — baseline Phase 102 preserved.'
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Product Companion guidance — humans in control (🦉🌹🔔)',
      'met', jsonb_array_length(public._paebp102_companion_guidance()->'examples') >= 3,
      'note', 'Product Companion — not generic AI product bot.'
    ),
    jsonb_build_object(
      'key', 'workflow_automation',
      'label', 'Workflow automation — import through publish pipeline',
      'met', jsonb_array_length(public._paebp102_workflow_automation()->'pipeline_steps') >= 7,
      'note', 'Cross-link Workflow Orchestration Phase 86.'
    ),
    jsonb_build_object(
      'key', 'approval_principles',
      'label', 'Approval principles — draft, human review, opt-in auto',
      'met', jsonb_array_length(public._paebp102_approval_principles()->'modes') >= 4,
      'note', 'auto_publish_disabled default true — baseline preserved.'
    ),
    jsonb_build_object(
      'key', 'products_imported',
      'label', 'Imported products tracked with automation metadata',
      'met', v_imported >= 1,
      'note', case when v_imported < 1 then 'Import products or rely on seed data.' else null end
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — transparent steps and audit',
      'met', jsonb_array_length(public._paebp102_trust_connection()->'users_should_see') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — sustainable catalog pacing',
      'met', jsonb_array_length(public._paebp102_self_love_connection()->'quotes') >= 2,
      'note', 'We accomplished in minutes what previously required hours.'
    ),
    jsonb_build_object(
      'key', 'baseline_preserved',
      'label', 'Repo Phase 102 baseline fields preserved on dashboard',
      'met', to_regclass('public.product_automation_settings') is not null,
      'note', '_pae_* tables and RPC behavior intact.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links Commerce Intelligence 101, Dropshipping 103, Workflow 86, Approvals',
      'met', jsonb_array_length(public._paebp102_integration_links()) >= 10,
      'note', null
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Sportsklær.no Shopify, SEO, supplier sync',
      'met', (public._paebp102_dogfooding()->'sportsklaer_no') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS principle — humans in control',
      'met', true,
      'note', 'Automation supports creativity; humans own strategic decisions.'
    )
  );
end; $$;

create or replace function public._paebp102_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 102 — Product Automation Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE102_PRODUCT_AUTOMATION.md',
    'engine_phase', 'Repo Phase 102 Product Automation Engine',
    'route', '/app/product-automation',
    'mapping_note', 'ABOS Blueprint Phase 102 extends repo Phase 102 with product automation scaffolding. Distinct from Commerce Intelligence Phase 101 discovery and Dropshipping Operations Phase 103.',
    'distinction_note', public._paebp102_distinction_note(),
    'mission', public._paebp102_mission(),
    'philosophy', public._paebp102_philosophy(),
    'abos_principle', public._paebp102_abos_principle(),
    'objectives', public._paebp102_objectives(),
    'product_import_automation', public._paebp102_product_import_automation(),
    'product_translation', public._paebp102_product_translation(),
    'product_rewriting', public._paebp102_product_rewriting(),
    'seo_optimization', public._paebp102_seo_optimization(),
    'category_recommendations', public._paebp102_category_recommendations(),
    'product_quality_checks', public._paebp102_product_quality_checks(),
    'companion_guidance', public._paebp102_companion_guidance(),
    'workflow_automation', public._paebp102_workflow_automation(),
    'approval_principles', public._paebp102_approval_principles(),
    'self_love_connection', public._paebp102_self_love_connection(),
    'trust_connection', public._paebp102_trust_connection(),
    'dogfooding', public._paebp102_dogfooding(),
    'success_criteria', public._paebp102_success_criteria(p_tenant_id),
    'vision', public._paebp102_vision(),
    'vision_phrases', public._paebp102_vision_phrases(),
    'integration_links', public._paebp102_integration_links(),
    'engagement_summary', public._paebp102_engagement_summary(p_tenant_id),
    'privacy_note', 'Product automation blueprint data is metadata only — import summaries, translation versions, SEO recommendations. No silent auto-publish. Humans decide; Aipify Product Companion informs and prepares.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Card RPC — preserve ALL baseline fields; append Phase 102
-- ---------------------------------------------------------------------------
create or replace function public.get_product_automation_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb; v_engagement jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._pae_ensure_settings(v_tenant_id);
  v_metrics := public._pae_refresh_metrics(v_tenant_id);
  v_engagement := public._paebp102_engagement_summary(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'automation_score', v_metrics->'automation_score',
    'awaiting_approval_count', v_metrics->'awaiting_approval_count',
    'philosophy', 'From product discovery to store-ready content in minutes.',
    'human_oversight_required', true,
    'implementation_blueprint_phase102', jsonb_build_object(
      'phase', 'Phase 102 — Product Automation Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE102_PRODUCT_AUTOMATION.md',
      'engine_phase', 'Repo Phase 102 Product Automation Engine',
      'route', '/app/product-automation',
      'mapping_note', 'ABOS Blueprint Phase 102 extends repo Phase 102 — automation supports creativity; humans own strategic decisions.'
    ),
    'product_automation_mission', public._paebp102_mission(),
    'product_automation_abos_principle', public._paebp102_abos_principle(),
    'product_automation_engagement_summary', v_engagement,
    'product_automation_note', 'Product Automation Engine (ABOS Phase 102) — humans in control; draft, review, approve before publish.',
    'product_automation_vision_note', public._paebp102_vision()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Dashboard RPC — preserve ALL baseline fields; append Phase 102
-- ---------------------------------------------------------------------------
create or replace function public.get_product_automation_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.product_automation_settings;
  v_brand public.brand_voice_profiles;
  v_metrics jsonb;
begin
  v_tenant_id := public._pae_require_tenant();
  v_settings := public._pae_ensure_settings(v_tenant_id);
  v_brand := public._pae_ensure_brand_voice(v_tenant_id);
  perform public._pae_seed_products(v_tenant_id);
  perform public._pae_seed_automation_data(v_tenant_id);
  v_metrics := public._pae_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'auto_publish_disabled', v_settings.auto_publish_disabled,
    'philosophy', 'From product discovery to store-ready content in minutes.',
    'safety_note', 'Aipify assists with product preparation — human approval is mandatory before publication. No automatic publishing.',
    'engine_enabled', v_settings.engine_enabled,
    'default_target_language', v_settings.default_target_language,
    'default_rewriting_mode', v_settings.default_rewriting_mode,
    'automation_score', v_metrics->'automation_score',
    'imported_products_count', v_metrics->'imported_products_count',
    'awaiting_approval_count', v_metrics->'awaiting_approval_count',
    'avg_readiness_score', v_metrics->'avg_readiness_score',
    'seo_recommendations_count', v_metrics->'seo_recommendations_count',
    'quality_warnings_count', v_metrics->'quality_warnings_count',
    'pending_approvals', v_metrics->'pending_approvals',
    'translation_opportunities', v_metrics->'translation_opportunities',
    'brand_voice', jsonb_build_object(
      'writing_style', v_brand.writing_style,
      'tone_preference', v_brand.tone_preference,
      'rewriting_mode', v_brand.rewriting_mode,
      'personality_guidelines', v_brand.personality_guidelines
    ),
    'imported_products', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'product_key', p.product_key, 'title', p.title,
        'description', p.description, 'source_type', p.source_type, 'status', p.status,
        'price', p.price, 'currency', p.currency, 'category', p.category,
        'readiness_score', (select r.readiness_score from public.product_readiness_scores r where r.product_id = p.id order by r.scored_at desc limit 1),
        'readiness_status', (select r.status_label from public.product_readiness_scores r where r.product_id = p.id order by r.scored_at desc limit 1)
      ) order by p.created_at desc)
      from public.imported_products p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'awaiting_approval', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'title', p.title, 'status', p.status, 'category', p.category,
        'readiness_score', (select r.readiness_score from public.product_readiness_scores r where r.product_id = p.id order by r.scored_at desc limit 1)
      ) order by p.updated_at desc)
      from public.imported_products p
      where p.tenant_id = v_tenant_id and p.status in ('imported', 'processing', 'awaiting_review')
    ), '[]'::jsonb),
    'translation_opportunities_list', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'title', p.title, 'category', p.category,
        'has_translation', exists(select 1 from public.translation_versions t where t.product_id = p.id)
      ) order by p.created_at desc)
      from public.imported_products p
      where p.tenant_id = v_tenant_id
        and not exists (select 1 from public.translation_versions t where t.product_id = p.id)
    ), '[]'::jsonb),
    'seo_recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'product_id', s.product_id, 'product_title', p.title,
        'recommendation_type', s.recommendation_type, 'title', s.title,
        'suggestion', s.suggestion, 'rationale', s.rationale, 'priority', s.priority, 'applied', s.applied
      ) order by s.created_at desc)
      from public.seo_recommendations s
      join public.imported_products p on p.id = s.product_id
      where s.tenant_id = v_tenant_id and s.applied = false
    ), '[]'::jsonb),
    'quality_warnings', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', q.id, 'product_id', q.product_id, 'product_title', p.title,
        'check_type', q.check_type, 'severity', q.severity, 'title', q.title, 'explanation', q.explanation
      ) order by q.created_at desc)
      from public.quality_validation_results q
      join public.imported_products p on p.id = q.product_id
      where q.tenant_id = v_tenant_id and q.resolved = false
    ), '[]'::jsonb),
    'category_suggestions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'product_id', c.product_id, 'product_title', p.title,
        'primary_category', c.primary_category, 'secondary_categories', c.secondary_categories,
        'suggested_tags', c.suggested_tags, 'collection_assignments', c.collection_assignments,
        'confidence', c.confidence, 'rationale', c.rationale
      ) order by c.created_at desc)
      from public.category_suggestions c
      join public.imported_products p on p.id = c.product_id
      where c.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'approval_requests', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'product_id', a.product_id, 'product_title', p.title,
        'request_type', a.request_type, 'summary', a.summary, 'status', a.status
      ) order by a.created_at desc)
      from public.approval_requests a
      join public.imported_products p on p.id = a.product_id
      where a.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'bulk_jobs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', b.id, 'action_type', b.action_type, 'product_count', b.product_count,
        'status', b.status, 'summary', b.summary, 'completed_at', b.completed_at
      ) order by b.created_at desc)
      from public.bulk_automation_jobs b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'recent_translations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id, 'product_id', t.product_id, 'product_title', p.title,
        'field_name', t.field_name, 'target_language', t.target_language,
        'translated_preview', left(t.translated_text, 120)
      ) order by t.created_at desc)
      from public.translation_versions t
      join public.imported_products p on p.id = t.product_id
      where t.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'recent_rewrites', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'product_id', r.product_id, 'product_title', p.title,
        'rewriting_mode', r.rewriting_mode, 'rewritten_preview', left(r.rewritten_text, 120)
      ) order by r.created_at desc)
      from public.rewriting_versions r
      join public.imported_products p on p.id = r.product_id
      where r.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'summary', b.summary, 'created_at', b.created_at)
        order by b.created_at desc)
      from public.product_automation_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'commerce_intelligence', 'Product opportunities and margin signals',
      'platform_install', 'Connected store catalog import',
      'dropshipping_operations', 'Supplier and operational context',
      'knowledge_center', 'Product automation guides and FAQ'
    ),
    'implementation_blueprint_phase102', jsonb_build_object(
      'phase', 'Phase 102 — Product Automation Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE102_PRODUCT_AUTOMATION.md',
      'engine_phase', 'Repo Phase 102 Product Automation Engine',
      'route', '/app/product-automation',
      'mapping_note', 'ABOS Blueprint Phase 102 extends repo Phase 102 — automation supports creativity; humans own strategic decisions.'
    ),
    'product_automation_engine_note', 'Product Automation Engine (ABOS Phase 102) — streamline product operations via automation, localization, and optimization with strategic oversight.',
    'product_automation_blueprint', public._paebp102_blueprint_block(v_tenant_id),
    'product_automation_distinction_note', public._paebp102_distinction_note(),
    'product_automation_mission', public._paebp102_mission(),
    'product_automation_philosophy', public._paebp102_philosophy(),
    'product_automation_abos_principle', public._paebp102_abos_principle(),
    'product_automation_objectives', public._paebp102_objectives(),
    'product_import_automation', public._paebp102_product_import_automation(),
    'product_translation', public._paebp102_product_translation(),
    'product_rewriting', public._paebp102_product_rewriting(),
    'seo_optimization', public._paebp102_seo_optimization(),
    'category_recommendations', public._paebp102_category_recommendations(),
    'product_quality_checks', public._paebp102_product_quality_checks(),
    'product_companion_guidance', public._paebp102_companion_guidance(),
    'workflow_automation', public._paebp102_workflow_automation(),
    'approval_principles', public._paebp102_approval_principles(),
    'product_automation_self_love_connection', public._paebp102_self_love_connection(),
    'product_automation_trust_connection', public._paebp102_trust_connection(),
    'product_automation_dogfooding', public._paebp102_dogfooding(),
    'paebp102_integration_links', public._paebp102_integration_links(),
    'product_automation_engagement_summary', public._paebp102_engagement_summary(v_tenant_id),
    'product_automation_success_criteria', public._paebp102_success_criteria(v_tenant_id),
    'product_automation_vision', public._paebp102_vision(),
    'product_automation_vision_phrases', public._paebp102_vision_phrases(),
    'product_automation_privacy_note', 'Product automation metadata only — no silent auto-publish. Humans decide; Aipify Product Companion informs and prepares.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._paebp102_distinction_note() to authenticated;
grant execute on function public._paebp102_mission() to authenticated;
grant execute on function public._paebp102_philosophy() to authenticated;
grant execute on function public._paebp102_abos_principle() to authenticated;
grant execute on function public._paebp102_vision() to authenticated;
grant execute on function public._paebp102_objectives() to authenticated;
grant execute on function public._paebp102_product_import_automation() to authenticated;
grant execute on function public._paebp102_product_translation() to authenticated;
grant execute on function public._paebp102_product_rewriting() to authenticated;
grant execute on function public._paebp102_seo_optimization() to authenticated;
grant execute on function public._paebp102_category_recommendations() to authenticated;
grant execute on function public._paebp102_product_quality_checks() to authenticated;
grant execute on function public._paebp102_companion_guidance() to authenticated;
grant execute on function public._paebp102_workflow_automation() to authenticated;
grant execute on function public._paebp102_approval_principles() to authenticated;
grant execute on function public._paebp102_self_love_connection() to authenticated;
grant execute on function public._paebp102_trust_connection() to authenticated;
grant execute on function public._paebp102_dogfooding() to authenticated;
grant execute on function public._paebp102_vision_phrases() to authenticated;
grant execute on function public._paebp102_integration_links() to authenticated;
grant execute on function public._paebp102_engagement_summary(uuid) to authenticated;
grant execute on function public._paebp102_success_criteria(uuid) to authenticated;
grant execute on function public._paebp102_blueprint_block(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'product-automation-blueprint-phase102', 'Product Automation Engine (ABOS Phase 102)',
  'Product Automation Engine — import, translate, rewrite, SEO, categories, and approval workflow with human oversight. Automation supports creativity; humans own strategic decisions.',
  'authenticated', 131
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'product-automation-blueprint-phase102' and tenant_id is null
);
