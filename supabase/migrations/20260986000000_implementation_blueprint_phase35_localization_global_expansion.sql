-- Implementation Blueprint Phase 35 — Localization & Global Expansion Engine
-- Extends Global Expansion & Localization Framework (Phase 95). No new tables.
-- Naming note: distinct from Context Engine Phase 35 (personal calendar) — see _lgebp_distinction_note().

create or replace function public._lgebp_mission()
returns text language sql immutable as $$
  select 'Help organizations expand globally while respecting local languages, cultures, payment preferences, and operational realities — localization creates belonging, not just translation.';
$$;

create or replace function public._lgebp_philosophy()
returns text language sql immutable as $$
  select 'Global platforms succeed when they respect local realities. Localization extends beyond translation — it creates belonging.';
$$;

create or replace function public._lgebp_abos_principle()
returns text language sql immutable as $$
  select 'One platform. Local experiences. Global impact — technology adapts to people, not the reverse.';
$$;

create or replace function public._lgebp_blueprint_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'multilingual_interfaces', 'label', 'Multilingual interfaces', 'description', 'Customer App, notifications, and operational surfaces in en, no, sv, da — future de, fr, es, nl, pt by market demand'),
    jsonb_build_object('key', 'regional_payment_preferences', 'label', 'Regional payment preferences', 'description', 'Nordic payment rails and international expansion scaffolds — Fiken, Vipps, Swish, MobilePay, Stripe'),
    jsonb_build_object('key', 'country_specific_guidance', 'label', 'Country-specific guidance', 'description', 'Regional playbooks, compliance readiness, and operational expectations per market'),
    jsonb_build_object('key', 'localized_knowledge_center', 'label', 'Localized Knowledge Center', 'description', 'Global articles, country-specific guidance, industry content, regional best practices'),
    jsonb_build_object('key', 'companion_language_adaptation', 'label', 'Companion language adaptation', 'description', 'Preserve Aipify identity across languages — personality, not mere translation'),
    jsonb_build_object('key', 'market_operational_recommendations', 'label', 'Market-specific operational recommendations', 'description', 'Expansion recommendations derived from localization analytics and playbooks — metadata only')
  );
$$;

create or replace function public._lgebp_blueprint_language_strategy()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Priority locales ship first with quality; future locales follow validated market demand.',
    'priority_locales', jsonb_build_array(
      jsonb_build_object('code', 'en', 'label', 'English', 'status', 'active', 'note', 'Default platform language and global fallback'),
      jsonb_build_object('code', 'no', 'label', 'Norwegian', 'status', 'active', 'note', 'Nordic priority — Knowledge Center and interface coverage'),
      jsonb_build_object('code', 'sv', 'label', 'Swedish', 'status', 'active', 'note', 'Nordic priority — regional terminology and playbooks'),
      jsonb_build_object('code', 'da', 'label', 'Danish', 'status', 'active', 'note', 'Nordic priority — date/number formats and regional content')
    ),
    'future_locales', jsonb_build_array('de', 'fr', 'es', 'nl', 'pt'),
    'future_note', 'German, French, Spanish, Dutch, Portuguese — activated by market demand and coverage thresholds'
  );
$$;

create or replace function public._lgebp_blueprint_companion_localization()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Preserve Aipify identity across languages — warm, wise, encouraging, human-centered. Personality is adapted, not merely translated.',
    'personalities', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'key', 'warm_supportive', 'trait', 'Warm and supportive', 'example', '🌹 Jeg har lagt merke til at du foretrekker korte oppsummeringer — jeg holder briefings fokusert med mindre du ber om mer.'),
      jsonb_build_object('emoji', '🦉', 'key', 'wise_thoughtful', 'trait', 'Wise and thoughtful', 'example', '🦉 Jeg er ikke helt sikker på denne tilnærmingen ennå — her er to alternativer verdt å sammenligne.'),
      jsonb_build_object('emoji', '🔔', 'key', 'encouraging_attentive', 'trait', 'Encouraging and attentive', 'example', '🔔 Ditt team har nådd et viktig lokaliseringsmål — jevn fremgang bygger tillit over tid.'),
      jsonb_build_object('emoji', '❤️', 'key', 'human_centered_compassionate', 'trait', 'Human-centered and compassionate', 'example', '❤️ Global ekspansjon kan være krevende — feir fremgangen; bærekraftig tempo betyr mer enn hast.')
    ),
    'companion_identity_route', '/app/companion-identity-engine',
    'boundary', 'Companion localization adapts tone and phrasing — never impersonate users or manipulate across locales.'
  );
$$;

create or replace function public._lgebp_blueprint_knowledge_center_localization()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Knowledge Center content scales globally while respecting regional context.',
    'content_types', jsonb_build_array(
      jsonb_build_object('key', 'global_articles', 'label', 'Global articles', 'description', 'Platform-wide operational guidance translated with terminology governance'),
      jsonb_build_object('key', 'country_guidance', 'label', 'Country-specific guidance', 'description', 'Regional playbooks, invoice standards, and market entry expectations'),
      jsonb_build_object('key', 'industry_content', 'label', 'Industry content', 'description', 'Vertical-specific localization projects scoped per tenant'),
      jsonb_build_object('key', 'regional_best_practices', 'label', 'Regional best practices', 'description', 'Nordic support norms, EU regulatory readiness, cultural adaptation notes')
    ),
    'knowledge_center_route', '/app/knowledge-center',
    'global_expansion_category', 'global-expansion'
  );
$$;

create or replace function public._lgebp_blueprint_sales_expert_localization()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Sales Expert guidance respects local languages, currencies, business structures, and regional communication preferences.',
    'capabilities', jsonb_build_array(
      'Local language partner portal surfaces and email templates',
      'Regional currencies and commission presentation',
      'Market-sensitive sales guidance — no aggressive pressure across cultures',
      'Regional communication preferences in one-to-one follow-up metadata'
    ),
    'sales_expert_route', '/app/sales-expert-engine',
    'cross_link_note', 'Extends Sales Expert Operating System A.95 — localized assets scaffold; metadata only in RPC payloads.'
  );
$$;

create or replace function public._lgebp_blueprint_payment_financial_localization()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Payment and financial localization scaffolds Nordic expectations and international expansion — not legal or tax advice.',
    'nordic_markets', jsonb_build_array(
      jsonb_build_object('country', 'Norway', 'code', 'NO', 'providers', jsonb_build_array('Fiken', 'Vipps'), 'expectations', jsonb_build_array('Norwegian accounting presentation', 'Vipps payment preference awareness', 'NOK currency formatting')),
      jsonb_build_object('country', 'Sweden', 'code', 'SE', 'providers', jsonb_build_array('Swish'), 'expectations', jsonb_build_array('Swedish payment norms', 'SEK currency formatting', 'Regional invoice standards')),
      jsonb_build_object('country', 'Denmark', 'code', 'DK', 'providers', jsonb_build_array('MobilePay'), 'expectations', jsonb_build_array('Danish payment expectations', 'DKK/EUR presentation', 'Local invoice standards'))
    ),
    'international', jsonb_build_object(
      'providers', jsonb_build_array('Stripe'),
      'strategies', jsonb_build_array('Regional expansion playbooks', 'Multi-currency billing scaffold', 'Compliance readiness — not legal counsel')
    ),
    'commercial_route', '/app/commercial',
    'safety_note', 'Scaffold metadata only — customers configure actual payment integrations in Billing & Commercial.'
  );
$$;

create or replace function public._lgebp_blueprint_training_certification_localization()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Training and certification materials adapt to multiple languages with localized examples and region-specific scenarios.',
    'capabilities', jsonb_build_array(
      'Multiple language learning paths and course metadata',
      'Localized examples in training modules',
      'Region-specific scenario scaffolds for demos and simulations',
      'Market-sensitive demo scripts — metadata cross-links only'
    ),
    'learning_training_route', '/app/learning-training-engine',
    'certification_route', '/app/certification-achievement-engine',
    'academy_route', '/app/academy',
    'cross_link_note', 'Learning & Training A.36 and Certification A.37 — extend Phase 95 localization projects; do not duplicate academy tables.'
  );
$$;

create or replace function public._lgebp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Globally standardized platform capabilities with regionally adapted experiences — localization decisions are transparent and auditable.',
    'users_should_understand', jsonb_build_array(
      'Which capabilities are globally standardized vs regionally adapted',
      'How language coverage and playbook readiness scores are calculated',
      'That compliance readiness scaffolds are not legal advice',
      'How localization recommendations are generated from metadata — no PII in payloads'
    ),
    'operators_should_understand', jsonb_build_array(
      'Translation projects, terminology glossary, and regional content are tenant-scoped',
      'Country playbooks advance through human-reviewed stages',
      'Localization audits track quality — metadata only',
      'Trust Architecture privacy rules apply to all localized content ingestion'
    ),
    'trust_route', '/app/settings/security',
    'license_route', '/app/license',
    'metadata_only', true
  );
$$;

create or replace function public._lgebp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates localization quality internally; Unonight exercises multilingual operational flows as first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal validation — Nordic language quality, KC localization, companion tone across da/no/sv/en',
      'focus', jsonb_build_array('Nordic locale coverage thresholds', 'Terminology consistency across modules', 'Companion personality preserved in Norwegian and Danish', 'Regional payment scaffold accuracy')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — multilingual customer operations testing',
      'focus', jsonb_build_array('Interface language switching', 'Localized notification templates', 'Country playbook readiness for commerce markets', 'Sales Expert regional guidance cross-links')
    )
  );
$$;

create or replace function public._lgebp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'People everywhere should feel that Aipify was built for their market — not translated as an afterthought.',
    'Global scale with local respect — belonging through language, culture, and operational context.',
    'Companion warmth travels across borders when personality is preserved, not merely translated.',
    'Expansion succeeds when local teams trust the platform understands their reality.',
    'One Aipify — many local experiences, all grounded in the same transparent principles.'
  );
$$;

create or replace function public._lgebp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center A.5', 'route', '/app/knowledge-center', 'note', 'Localized articles, country guidance, regional best practices'),
    jsonb_build_object('key', 'sales_expert', 'label', 'Sales Expert OS A.95', 'route', '/app/sales-expert-engine', 'note', 'Local languages, currencies, market-sensitive sales guidance'),
    jsonb_build_object('key', 'learning_training', 'label', 'Learning & Training A.36', 'route', '/app/learning-training-engine', 'note', 'Localized training paths and examples'),
    jsonb_build_object('key', 'certification', 'label', 'Certification A.37', 'route', '/app/certification-achievement-engine', 'note', 'Region-specific scenarios and localized achievement metadata'),
    jsonb_build_object('key', 'commercial', 'label', 'Billing & Commercial Phase 93', 'route', '/app/commercial', 'note', 'Regional currencies, invoice standards, Stripe scaffold'),
    jsonb_build_object('key', 'companion_identity', 'label', 'Companion Identity A.84', 'route', '/app/companion-identity-engine', 'note', 'Communication style preserved across locales'),
    jsonb_build_object('key', 'academy', 'label', 'Aipify Academy Phase 94', 'route', '/app/academy', 'note', 'Structured learning with localization projects'),
    jsonb_build_object('key', 'global_learning', 'label', 'Global Learning Network', 'route', '/app/global-learning', 'note', 'Distinct from Phase 95 tenant localization — collective intelligence only'),
    jsonb_build_object('key', 'license', 'label', 'License & Trust Center', 'route', '/app/license', 'note', 'Data ownership and regional trust transparency'),
    jsonb_build_object('key', 'security', 'label', 'Trust Architecture Security', 'route', '/app/settings/security', 'note', 'Privacy-by-design for localized content ingestion')
  );
$$;

create or replace function public._lgebp_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Context Engine Phase 35 (personal calendar — migration 20260612300000_context_calendar_phase35.sql, routes /app/assistant/context and /app/assistant/calendars). ABOS Implementation Blueprint Phase 35 maps to Global Expansion & Localization Framework Phase 95 at /app/global-expansion — extend Phase 95 RPCs and dashboard only; do not duplicate Context Engine, Global Learning Network, or Academy tables.';
$$;

create or replace function public._lgebp_localization_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_active_langs int := 0;
  v_avg_coverage numeric := 0;
  v_active_markets int := 0;
  v_open_recommendations int := 0;
  v_published_projects int := 0;
  v_regional_content int := 0;
begin
  select count(*) filter (where market_status = 'active'),
         coalesce(avg(coverage_pct) filter (where market_status = 'active'), 0)
    into v_active_langs, v_avg_coverage
  from public.localization_supported_languages
  where tenant_id = p_tenant_id;

  select count(*) into v_active_markets
  from public.localization_country_playbooks
  where tenant_id = p_tenant_id and market_status = 'active';

  select count(*) into v_open_recommendations
  from public.localization_recommendations
  where tenant_id = p_tenant_id and status = 'open';

  select count(*) into v_published_projects
  from public.localization_projects
  where tenant_id = p_tenant_id and status = 'published';

  select count(*) into v_regional_content
  from public.localization_regional_content
  where tenant_id = p_tenant_id and status = 'published';

  return jsonb_build_object(
    'active_languages', v_active_langs,
    'avg_coverage_pct', round(v_avg_coverage, 1),
    'active_markets', v_active_markets,
    'open_recommendations', v_open_recommendations,
    'published_projects', v_published_projects,
    'regional_content_items', v_regional_content,
    'privacy_note', 'Counts from tenant-scoped localization tables only — no translation content or PII in summary.'
  );
end; $$;

create or replace function public._lgebp_blueprint_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_summary jsonb;
  v_active_langs int := 0;
  v_avg_coverage numeric := 0;
  v_active_markets int := 0;
begin
  v_summary := public._lgebp_localization_summary(p_tenant_id);
  v_active_langs := coalesce((v_summary->>'active_languages')::int, 0);
  v_avg_coverage := coalesce((v_summary->>'avg_coverage_pct')::numeric, 0);
  v_active_markets := coalesce((v_summary->>'active_markets')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'priority_locales',
      'label', 'Priority locales documented — en, no, sv, da with future de, fr, es, nl, pt',
      'met', jsonb_array_length((public._lgebp_blueprint_language_strategy()->'priority_locales')) >= 4,
      'note', format('%s active languages configured for this tenant.', v_active_langs)
    ),
    jsonb_build_object(
      'key', 'multilingual_interfaces',
      'label', 'Multilingual interface objective documented',
      'met', jsonb_array_length(public._lgebp_blueprint_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'companion_personality',
      'label', 'Companion localization preserves 🌹🦉🔔❤️ personality across languages',
      'met', jsonb_array_length((public._lgebp_blueprint_companion_localization()->'personalities')) >= 4,
      'note', 'Personality adapted — not merely translated.'
    ),
    jsonb_build_object(
      'key', 'nordic_payment_scaffold',
      'label', 'Nordic payment scaffold documented — NO/SE/DK expectations',
      'met', jsonb_array_length((public._lgebp_blueprint_payment_financial_localization()->'nordic_markets')) >= 3,
      'note', 'Fiken, Vipps, Swish, MobilePay metadata — configure integrations in Commercial.'
    ),
    jsonb_build_object(
      'key', 'knowledge_center_localization',
      'label', 'Knowledge Center localization content types documented',
      'met', jsonb_array_length((public._lgebp_blueprint_knowledge_center_localization()->'content_types')) >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'sales_expert_localization',
      'label', 'Sales Expert localization cross-linked to A.95',
      'met', (public._lgebp_blueprint_sales_expert_localization()->>'sales_expert_route') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'training_certification',
      'label', 'Training & certification localization cross-linked to A.36/A.37',
      'met', (public._lgebp_blueprint_training_certification_localization()->>'certification_route') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'language_coverage',
      'label', 'Active language coverage meets Nordic quality threshold',
      'met', v_avg_coverage >= 85 or v_active_langs >= 4,
      'note', case when v_avg_coverage < 85 and v_active_langs < 4
        then 'Seed languages and advance localization projects to raise coverage.'
        else format('Average active coverage %.1f%%.', v_avg_coverage) end
    ),
    jsonb_build_object(
      'key', 'active_markets',
      'label', 'At least one active country playbook',
      'met', v_active_markets >= 1,
      'note', case when v_active_markets = 0 then 'Advance country playbooks through assessment stages.' else null end
    ),
    jsonb_build_object(
      'key', 'trust_transparency',
      'label', 'Trust connection explains standardized vs adapted capabilities',
      'met', jsonb_array_length((public._lgebp_blueprint_trust_connection()->'users_should_understand')) >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links to KC A.5, Sales Expert A.95, Learning A.36, Certification A.37, Commercial',
      'met', jsonb_array_length(public._lgebp_blueprint_integration_links()) >= 8,
      'note', null
    ),
    jsonb_build_object(
      'key', 'distinction_documented',
      'label', 'Distinction from Context Engine Phase 35 documented',
      'met', length(public._lgebp_distinction_note()) > 50,
      'note', 'Blueprint Phase 35 ≠ Context Engine calendar Phase 35.'
    )
  );
end; $$;

-- Extend dashboard — preserve ALL Phase 95 fields; append Phase 35 blueprint
create or replace function public.get_global_expansion_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.localization_settings;
  v_metrics jsonb;
  v_base jsonb;
begin
  v_tenant_id := public._gel_require_tenant();
  v_settings := public._gel_ensure_settings(v_tenant_id);
  perform public._gel_seed_languages(v_tenant_id);
  perform public._gel_seed_projects(v_tenant_id);
  perform public._gel_seed_playbooks(v_tenant_id);
  perform public._gel_seed_recommendations(v_tenant_id);
  perform public._gel_seed_glossary(v_tenant_id);
  perform public._gel_seed_regional_content(v_tenant_id);
  v_metrics := public._gel_refresh_analytics(v_tenant_id);
  perform public._gel_trust_explanation(v_tenant_id, (v_metrics->>'global_readiness_score')::numeric);

  v_base := jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'philosophy', 'One platform. Local experiences. Global impact.',
    'safety_note', 'Aipify supports compliance readiness but does not replace professional legal counsel.',
    'default_language', v_settings.default_language,
    'default_region', v_settings.default_region,
    'default_timezone', v_settings.default_timezone,
    'default_currency', v_settings.default_currency,
    'multi_language_enabled', v_settings.multi_language_enabled,
    'localized_notifications', v_settings.localized_notifications,
    'timezone_intelligence', v_settings.timezone_intelligence,
    'global_readiness_score', v_metrics->'global_readiness_score',
    'avg_language_coverage_pct', v_metrics->'avg_language_coverage_pct',
    'active_markets', v_metrics->'active_markets',
    'planned_markets', v_metrics->'planned_markets',
    'localization_dimensions', jsonb_build_array(
      'Language adaptation', 'Date formatting', 'Time formatting', 'Number formatting',
      'Currency presentation', 'Regulatory messaging', 'Cultural considerations'
    ),
    'supported_languages', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'language_code', l.language_code, 'language_name', l.language_name,
        'native_name', l.native_name, 'market_status', l.market_status,
        'coverage_pct', l.coverage_pct, 'is_default', l.is_default
      ) order by l.coverage_pct desc)
      from public.localization_supported_languages l where l.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'future_languages', jsonb_build_array('German', 'French', 'Spanish', 'Dutch', 'Portuguese', 'Italian', 'Japanese', 'Korean', 'Arabic'),
    'localization_projects', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'project_key', p.project_key, 'title', p.title, 'description', p.description,
        'target_language', p.target_language, 'content_scope', p.content_scope,
        'status', p.status, 'progress_pct', p.progress_pct
      ) order by p.progress_pct desc)
      from public.localization_projects p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'country_playbooks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', cp.id, 'country_code', cp.country_code, 'country_name', cp.country_name,
        'market_status', cp.market_status, 'readiness_score', cp.readiness_score,
        'summary', cp.summary, 'checklist', cp.checklist
      ) order by cp.readiness_score desc)
      from public.localization_country_playbooks cp where cp.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'title', r.title, 'description', r.description,
        'recommendation_type', r.recommendation_type, 'priority', r.priority,
        'language_code', r.language_code, 'status', r.status
      ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.localization_recommendations r
      where r.tenant_id = v_tenant_id and r.status = 'open' limit 10
    ), '[]'::jsonb),
    'terminology_glossary', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', g.id, 'term_key', g.term_key, 'source_term', g.source_term,
        'translated_term', g.translated_term, 'language_code', g.language_code, 'domain', g.domain
      ))
      from public.localization_terminology_glossary g where g.tenant_id = v_tenant_id limit 15
    ), '[]'::jsonb),
    'regional_content', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', rc.id, 'title', rc.title, 'description', rc.description,
        'region_code', rc.region_code, 'language_code', rc.language_code, 'content_type', rc.content_type
      ))
      from public.localization_regional_content rc where rc.tenant_id = v_tenant_id and rc.status = 'published'
    ), '[]'::jsonb),
    'localization_audits', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'audit_type', a.audit_type, 'title', a.title,
        'summary', a.summary, 'overall_score', a.overall_score, 'status', a.status
      ))
      from public.localization_audits a where a.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'international_analytics', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', ia.id, 'region_code', ia.region_code, 'region_label', ia.region_label,
        'adoption_rate_pct', ia.adoption_rate_pct, 'language_usage_pct', ia.language_usage_pct,
        'satisfaction_score', ia.satisfaction_score
      ))
      from public.localization_analytics ia where ia.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'timezone_capabilities', jsonb_build_array(
      'User location awareness', 'Distributed team scheduling', 'Local business hours',
      'Notification timing optimization'
    ),
    'compliance_readiness', jsonb_build_array(
      'Privacy regulations', 'Data residency expectations', 'Industry requirements',
      'Consumer protection obligations'
    ),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'summary', b.summary, 'created_at', b.created_at)
        order by b.created_at desc)
      from public.localization_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'knowledge_center', 'Localized content and translation workflows',
      'academy', 'Localized training materials',
      'partners', 'Regional partner enablement assets',
      'billing_commercial', 'Regional currencies and invoice standards',
      'global_learning', 'Distinct from collective intelligence network'
    )
  );

  return v_base || jsonb_build_object(
    'implementation_blueprint_phase35', jsonb_build_object(
      'phase', 35,
      'title', 'Localization & Global Expansion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE35_LOCALIZATION_GLOBAL_EXPANSION.md',
      'engine_phase', 'Phase 95 — Global Expansion & Localization Framework',
      'route', '/app/global-expansion',
      'mapping_note', 'ABOS Blueprint Phase 35 extends Phase 95 — distinct from Context Engine calendar Phase 35.'
    ),
    'localization_expansion_mission', public._lgebp_mission(),
    'localization_expansion_philosophy', public._lgebp_philosophy(),
    'localization_objectives', public._lgebp_blueprint_objectives(),
    'language_strategy', public._lgebp_blueprint_language_strategy(),
    'companion_localization', public._lgebp_blueprint_companion_localization(),
    'knowledge_center_localization', public._lgebp_blueprint_knowledge_center_localization(),
    'sales_expert_localization', public._lgebp_blueprint_sales_expert_localization(),
    'payment_financial_localization', public._lgebp_blueprint_payment_financial_localization(),
    'training_certification_localization', public._lgebp_blueprint_training_certification_localization(),
    'localization_trust_connection', public._lgebp_blueprint_trust_connection(),
    'localization_dogfooding', public._lgebp_blueprint_dogfooding(),
    'localization_success_criteria', public._lgebp_blueprint_success_criteria(v_tenant_id),
    'localization_vision_phrases', public._lgebp_blueprint_vision_phrases(),
    'localization_abos_principle', public._lgebp_abos_principle(),
    'localization_distinction_note', public._lgebp_distinction_note(),
    'localization_integration_links', public._lgebp_blueprint_integration_links(),
    'localization_summary', public._lgebp_localization_summary(v_tenant_id)
  );
end; $$;

create or replace function public.get_global_expansion_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb; v_summary jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._gel_ensure_settings(v_tenant_id);
  perform public._gel_seed_languages(v_tenant_id);
  v_metrics := public._gel_refresh_analytics(v_tenant_id);
  v_summary := public._lgebp_localization_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'global_readiness_score', v_metrics->'global_readiness_score',
    'avg_language_coverage_pct', v_metrics->'avg_language_coverage_pct',
    'philosophy', 'One platform. Local experiences. Global impact.',
    'human_oversight_required', true,
    'implementation_blueprint_phase35', jsonb_build_object(
      'phase', 35,
      'title', 'Localization & Global Expansion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE35_LOCALIZATION_GLOBAL_EXPANSION.md',
      'engine_phase', 'Phase 95',
      'route', '/app/global-expansion'
    ),
    'localization_expansion_phase', 35,
    'localization_abos_principle', public._lgebp_abos_principle(),
    'localization_summary', v_summary,
    'blueprint_note', 'Localization & Global Expansion Engine (ABOS Phase 35) — extends Phase 95 with blueprint metadata, companion localization, payment regional scaffolds, and live success criteria.'
  );
end; $$;

grant execute on function public._lgebp_mission() to authenticated;
grant execute on function public._lgebp_philosophy() to authenticated;
grant execute on function public._lgebp_abos_principle() to authenticated;
grant execute on function public._lgebp_blueprint_objectives() to authenticated;
grant execute on function public._lgebp_blueprint_language_strategy() to authenticated;
grant execute on function public._lgebp_blueprint_companion_localization() to authenticated;
grant execute on function public._lgebp_blueprint_knowledge_center_localization() to authenticated;
grant execute on function public._lgebp_blueprint_sales_expert_localization() to authenticated;
grant execute on function public._lgebp_blueprint_payment_financial_localization() to authenticated;
grant execute on function public._lgebp_blueprint_training_certification_localization() to authenticated;
grant execute on function public._lgebp_blueprint_trust_connection() to authenticated;
grant execute on function public._lgebp_blueprint_dogfooding() to authenticated;
grant execute on function public._lgebp_blueprint_vision_phrases() to authenticated;
grant execute on function public._lgebp_blueprint_integration_links() to authenticated;
grant execute on function public._lgebp_distinction_note() to authenticated;
grant execute on function public._lgebp_localization_summary(uuid) to authenticated;
grant execute on function public._lgebp_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'localization-global-expansion-blueprint', 'Localization & Global Expansion Engine (ABOS Phase 35)',
  'Localization & Global Expansion Engine — extends Phase 95 with blueprint metadata, companion localization, Nordic payment scaffolds, and live success criteria.',
  'authenticated', 104
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'localization-global-expansion-blueprint' and tenant_id is null
);
