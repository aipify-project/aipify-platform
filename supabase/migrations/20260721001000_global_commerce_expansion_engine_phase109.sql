-- Phase 109 — Global Commerce Expansion Engine
-- Principle: Expand confidently while preserving identity and reducing operational complexity.
-- Note: metadata-only scaffolds — regulatory notes are NOT legal advice; auto_market_entry_disabled default true.

alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community',
    'marketplace_governance', 'partner_certification', 'enterprise_deployment',
    'billing_commercial', 'academy_learning', 'global_localization',
    'innovation_experimentation', 'future_technologies', 'aipify_constitution',
    'aipify_manifesto', 'platform_install', 'commerce_intelligence',
    'product_automation', 'dropshipping_operations', 'commerce_performance',
    'multi_store_orchestration', 'supplier_intelligence', 'global_commerce_expansion'
  )
);

-- ---------------------------------------------------------------------------
-- 1. global_commerce_expansion_settings
-- ---------------------------------------------------------------------------
create table if not exists public.global_commerce_expansion_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  engine_enabled boolean not null default true,
  auto_market_entry_disabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.global_commerce_expansion_settings enable row level security;
revoke all on public.global_commerce_expansion_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. commerce_market_profiles
-- ---------------------------------------------------------------------------
create table if not exists public.commerce_market_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  market_key text not null,
  market_name text not null,
  region text not null default 'Nordic',
  currency text not null default 'NOK',
  status text not null default 'monitoring' check (
    status in ('active', 'preparing', 'monitoring', 'paused', 'archived')
  ),
  readiness_score numeric(5, 2) not null default 50.0 check (readiness_score between 0 and 100),
  unique (tenant_id, market_key)
);

alter table public.commerce_market_profiles enable row level security;
revoke all on public.commerce_market_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. market_readiness_assessments
-- ---------------------------------------------------------------------------
create table if not exists public.market_readiness_assessments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  market_id uuid references public.commerce_market_profiles (id) on delete cascade,
  assessment_type text not null check (
    assessment_type in (
      'market_entry', 'localization', 'operational', 'regulatory_scaffold',
      'cultural_fit', 'currency', 'partner_readiness'
    )
  ),
  title text not null,
  summary text not null,
  readiness_level text not null default 'moderate' check (
    readiness_level in ('ready', 'preparing', 'monitoring', 'not_ready')
  ),
  assessed_at timestamptz not null default now()
);

alter table public.market_readiness_assessments enable row level security;
revoke all on public.market_readiness_assessments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. localization_guidance_records
-- ---------------------------------------------------------------------------
create table if not exists public.localization_guidance_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  market_id uuid references public.commerce_market_profiles (id) on delete set null,
  guidance_type text not null check (
    guidance_type in ('language', 'translation', 'terminology', 'messaging', 'regional_content')
  ),
  language text not null default 'en',
  title text not null,
  summary text not null,
  authenticity_note text not null default 'Adapt authentically — preserve brand voice while respecting local context.',
  created_at timestamptz not null default now()
);

alter table public.localization_guidance_records enable row level security;
revoke all on public.localization_guidance_records from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. cultural_intelligence_insights
-- ---------------------------------------------------------------------------
create table if not exists public.cultural_intelligence_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  market_id uuid references public.commerce_market_profiles (id) on delete set null,
  insight_type text not null check (
    insight_type in ('seasonal', 'communication', 'values', 'shopping_behavior', 'trust_signals')
  ),
  title text not null,
  summary text not null,
  respect_note text not null default 'Cultural insights inform adaptation — never stereotype or assume.',
  created_at timestamptz not null default now()
);

alter table public.cultural_intelligence_insights enable row level security;
revoke all on public.cultural_intelligence_insights from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. multi_currency_visibility
-- ---------------------------------------------------------------------------
create table if not exists public.multi_currency_visibility (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  market_id uuid references public.commerce_market_profiles (id) on delete set null,
  currency_code text not null,
  regional_pricing_note text not null,
  performance_summary text not null,
  exchange_consideration text not null,
  updated_at timestamptz not null default now()
);

alter table public.multi_currency_visibility enable row level security;
revoke all on public.multi_currency_visibility from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. regional_commerce_insights
-- ---------------------------------------------------------------------------
create table if not exists public.regional_commerce_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  region_key text not null,
  insight_type text not null check (
    insight_type in (
      'best_performing', 'emerging_opportunity', 'seasonal', 'local_demand', 'competitive_context'
    )
  ),
  title text not null,
  summary text not null,
  trend_direction text not null default 'stable' check (
    trend_direction in ('improving', 'stable', 'declining')
  ),
  created_at timestamptz not null default now()
);

alter table public.regional_commerce_insights enable row level security;
revoke all on public.regional_commerce_insights from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. regulatory_awareness_notes (scaffold — NOT legal advice)
-- ---------------------------------------------------------------------------
create table if not exists public.regulatory_awareness_notes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  market_id uuid references public.commerce_market_profiles (id) on delete set null,
  note_type text not null check (
    note_type in ('tax_scaffold', 'consumer_protection', 'obligations', 'data_privacy', 'general_awareness')
  ),
  title text not null,
  summary text not null,
  disclaimer text not null default 'Aipify provides awareness scaffolds only — not legal or compliance advice. Consult qualified counsel.',
  created_at timestamptz not null default now()
);

alter table public.regulatory_awareness_notes enable row level security;
revoke all on public.regulatory_awareness_notes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. expansion_recommendations + briefings + audit
-- ---------------------------------------------------------------------------
create table if not exists public.expansion_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  market_id uuid references public.commerce_market_profiles (id) on delete set null,
  section text not null check (
    section in (
      'global_expansion_dashboard', 'market_readiness', 'localization_support',
      'cultural_intelligence', 'multi_currency', 'regional_insights',
      'regulatory_awareness', 'recommendations'
    )
  ),
  title text not null,
  summary text not null,
  recommendation_type text not null,
  priority text not null default 'moderate' check (
    priority in ('informational', 'moderate', 'important', 'critical')
  ),
  rationale text not null,
  created_at timestamptz not null default now()
);

alter table public.expansion_recommendations enable row level security;
revoke all on public.expansion_recommendations from authenticated, anon;

create table if not exists public.global_commerce_expansion_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  metrics jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.global_commerce_expansion_briefings enable row level security;
revoke all on public.global_commerce_expansion_briefings from authenticated, anon;

create table if not exists public.global_commerce_expansion_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.global_commerce_expansion_audit_logs enable row level security;
revoke all on public.global_commerce_expansion_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 10. Helpers (_gce_)
-- ---------------------------------------------------------------------------
create or replace function public._gce_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._gce_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.global_commerce_expansion_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  perform public._tacc_log_audit(
    p_tenant_id, 'user', 'global_commerce_expansion_' || p_action_type,
    'global_commerce_expansion', 'logged', null, p_context
  );
  return v_id;
end; $$;

create or replace function public._gce_ensure_settings(p_tenant_id uuid)
returns public.global_commerce_expansion_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.global_commerce_expansion_settings;
begin
  insert into public.global_commerce_expansion_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.global_commerce_expansion_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._gce_seed_markets(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.commerce_market_profiles (
    tenant_id, market_key, market_name, region, currency, status, readiness_score
  )
  select p_tenant_id, v.key, v.name, v.region, v.currency, v.status, v.score
  from (values
    ('norway', 'Norway', 'Nordic', 'NOK', 'active', 88.0),
    ('sweden', 'Sweden', 'Nordic', 'SEK', 'active', 82.0),
    ('denmark', 'Denmark', 'Nordic', 'DKK', 'preparing', 74.0),
    ('finland', 'Finland', 'Nordic', 'EUR', 'monitoring', 68.0),
    ('germany', 'Germany', 'EU', 'EUR', 'monitoring', 62.0),
    ('united_kingdom', 'United Kingdom', 'Europe', 'GBP', 'preparing', 58.0)
  ) as v(key, name, region, currency, status, score)
  where not exists (
    select 1 from public.commerce_market_profiles m where m.tenant_id = p_tenant_id and m.market_key = v.key
  );
end; $$;

create or replace function public._gce_seed_insights(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_no_id uuid;
  v_se_id uuid;
  v_de_id uuid;
  v_fi_id uuid;
begin
  select id into v_no_id from public.commerce_market_profiles
  where tenant_id = p_tenant_id and market_key = 'norway';
  select id into v_se_id from public.commerce_market_profiles
  where tenant_id = p_tenant_id and market_key = 'sweden';
  select id into v_de_id from public.commerce_market_profiles
  where tenant_id = p_tenant_id and market_key = 'germany';
  select id into v_fi_id from public.commerce_market_profiles
  where tenant_id = p_tenant_id and market_key = 'finland';

  insert into public.market_readiness_assessments (
    tenant_id, market_id, assessment_type, title, summary, readiness_level
  )
  select p_tenant_id, v.market_id, v.type, v.title, v.summary, v.level
  from (values
    (v_no_id, 'market_entry', 'Norway Core Market Stable', 'Active market with strong localization and operational readiness.', 'ready'),
    (v_se_id, 'localization', 'Sweden Localization Progress', 'Product catalog translation coverage improving — terminology review suggested.', 'preparing'),
    (v_de_id, 'regulatory_scaffold', 'Germany Regulatory Scaffold', 'Tax and consumer protection awareness notes available — counsel review required before entry.', 'monitoring'),
    (v_fi_id, 'operational', 'Finland Operational Readiness', 'Shipping and payment methods need portfolio alignment before launch.', 'not_ready')
  ) as v(market_id, type, title, summary, level)
  where not exists (select 1 from public.market_readiness_assessments a where a.tenant_id = p_tenant_id limit 1);

  insert into public.localization_guidance_records (
    tenant_id, market_id, guidance_type, language, title, summary, authenticity_note
  )
  select p_tenant_id, v.market_id, v.type, v.lang, v.title, v.summary, v.note
  from (values
    (v_se_id, 'language', 'sv', 'Swedish Catalog Tone', 'Maintain active lifestyle voice — avoid literal English phrasing in product titles.', 'Authentic adaptation preserves Sportsklær brand energy.'),
    (v_de_id, 'terminology', 'de', 'German Commerce Terminology', 'Use local sizing and shipping terminology — cross-link Product Automation Phase 102.', 'Terminology consistency builds trust — not generic translation.'),
    (null::uuid, 'messaging', 'en', 'Nordic Brand Consistency', 'Shared Nordic values across NO/SE/DK — allow regional nuance in campaigns.', 'Global growth without becoming generic.')
  ) as v(market_id, type, lang, title, summary, note)
  where not exists (select 1 from public.localization_guidance_records l where l.tenant_id = p_tenant_id limit 1);

  insert into public.cultural_intelligence_insights (
    tenant_id, market_id, insight_type, title, summary, respect_note
  )
  select p_tenant_id, v.market_id, v.type, v.title, v.summary, v.note
  from (values
    (v_no_id, 'seasonal', 'Nordic Outdoor Seasonality', 'Autumn/winter activewear peaks earlier in Norway — plan inventory metadata accordingly.', 'Seasonal patterns inform planning — not stereotypes.'),
    (v_se_id, 'shopping_behavior', 'Swedish Mobile Commerce', 'Higher mobile checkout share — ensure storefront UX metadata reflects mobile-first patterns.', 'Respect local shopping preferences without assumptions about individuals.'),
    (v_de_id, 'trust_signals', 'German Trust & Transparency', 'Clear shipping, returns, and pricing transparency signals matter — authenticity over hype.', 'Cultural intelligence supports respectful adaptation.')
  ) as v(market_id, type, title, summary, note)
  where not exists (select 1 from public.cultural_intelligence_insights c where c.tenant_id = p_tenant_id limit 1);

  insert into public.multi_currency_visibility (
    tenant_id, market_id, currency_code, regional_pricing_note, performance_summary, exchange_consideration
  )
  select p_tenant_id, v.market_id, v.code, v.pricing, v.perf, v.exchange
  from (values
    (v_no_id, 'NOK', 'Home currency baseline — reference pricing for Nordic portfolio.', 'Strong conversion metadata in core market.', 'Minimal exchange impact for domestic operations.'),
    (v_se_id, 'SEK', 'Regional pricing aligned with Nordic margin targets — Commerce Performance cross-link.', 'Growing revenue share — monitor margin after FX.', 'SEK/NOK variance within stewardship thresholds.'),
    (v_de_id, 'EUR', 'EU pricing scaffold — review landed costs before market entry.', 'Pre-entry — illustrative performance metadata only.', 'EUR exposure requires finance review — not automated pricing.')
  ) as v(market_id, code, pricing, perf, exchange)
  where not exists (select 1 from public.multi_currency_visibility m where m.tenant_id = p_tenant_id limit 1);

  insert into public.regional_commerce_insights (
    tenant_id, region_key, insight_type, title, summary, trend_direction
  )
  select p_tenant_id, v.region, v.type, v.title, v.summary, v.trend
  from (values
    ('nordic', 'best_performing', 'Nordic Portfolio Strength', 'Norway and Sweden lead portfolio revenue metadata — deepen before distant expansion.', 'improving'),
    ('nordic', 'emerging_opportunity', 'Denmark Preparation Window', 'Denmark readiness improving — localization and partner onboarding suggested.', 'improving'),
    ('eu', 'local_demand', 'EU Activewear Demand Signal', 'Commerce Intelligence cross-link — moderate demand signal for Germany entry evaluation.', 'stable'),
    ('europe', 'seasonal', 'UK Seasonal Consideration', 'Brexit-era shipping metadata requires operational review before UK activation.', 'stable')
  ) as v(region, type, title, summary, trend)
  where not exists (select 1 from public.regional_commerce_insights r where r.tenant_id = p_tenant_id limit 1);

  insert into public.regulatory_awareness_notes (
    tenant_id, market_id, note_type, title, summary, disclaimer
  )
  select p_tenant_id, v.market_id, v.type, v.title, v.summary, v.disclaimer
  from (values
    (v_de_id, 'tax_scaffold', 'Germany VAT Awareness Scaffold', 'EU market entry may involve VAT registration considerations — illustrative scaffold only.', 'Aipify provides awareness scaffolds only — not legal or compliance advice. Consult qualified counsel.'),
    (v_de_id, 'consumer_protection', 'EU Consumer Rights Scaffold', 'Distance selling and return policy awareness — align with qualified legal review.', 'Aipify provides awareness scaffolds only — not legal or compliance advice. Consult qualified counsel.'),
    (null::uuid, 'data_privacy', 'GDPR Cross-Border Data', 'Cross-market customer data handling requires privacy review — metadata awareness only.', 'Aipify provides awareness scaffolds only — not legal or compliance advice. Consult qualified counsel.')
  ) as v(market_id, type, title, summary, disclaimer)
  where not exists (select 1 from public.regulatory_awareness_notes r where r.tenant_id = p_tenant_id limit 1);

  insert into public.expansion_recommendations (
    tenant_id, market_id, section, title, summary, recommendation_type, priority, rationale
  )
  select p_tenant_id, v.market_id, v.section, v.title, v.summary, v.type, v.priority, v.rationale
  from (values
    (null::uuid, 'global_expansion_dashboard', 'Portfolio Expansion Overview', 'Nordic markets remain primary — evaluate EU entry with patience.', 'review_portfolio', 'moderate', 'Stewardship not unchecked expansion — deepen proven markets first.'),
    (v_se_id, 'localization_support', 'Complete Swedish Terminology Review', 'Product Automation cross-link — finish terminology consistency before campaign push.', 'localization_review', 'important', 'Authentic adaptation requires human review — not auto-publish.'),
    (v_de_id, 'regulatory_awareness', 'Schedule Legal Counsel Review', 'Regulatory scaffold flagged Germany entry — human counsel required.', 'legal_review', 'important', 'Aipify does not replace legal/compliance counsel.'),
    (v_fi_id, 'market_readiness', 'Finland Operational Checklist', 'Align shipping and payments with Multi-Store portfolio standards.', 'operational_prep', 'moderate', 'auto_market_entry_disabled — humans approve market launch.'),
    (null::uuid, 'cultural_intelligence', 'Respectful Campaign Adaptation', 'Review cultural intelligence notes before regional marketing.', 'cultural_review', 'informational', 'Global growth without becoming generic.'),
    (null::uuid, 'multi_currency', 'FX Stewardship Review', 'Review SEK/EUR exposure with finance — Commerce Performance cross-link.', 'currency_review', 'moderate', 'Currency visibility informs — does not auto-adjust pricing.'),
    (null::uuid, 'recommendations', 'Generate Expansion Briefing', 'Prepare leadership briefing before Q3 market evaluation.', 'generate_briefing', 'informational', 'Humans decide timing — Aipify informs and prepares.')
  ) as v(market_id, section, title, summary, type, priority, rationale)
  where not exists (select 1 from public.expansion_recommendations e where e.tenant_id = p_tenant_id limit 1);
end; $$;

create or replace function public._gce_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_expansion_score numeric;
  v_active_markets int;
  v_preparing_markets int;
  v_emerging int;
  v_localization int;
  v_regulatory int;
  v_currencies int;
  v_regional int;
  v_recommendations int;
  v_readiness_class text;
begin
  select coalesce(avg(readiness_score), 65.0) into v_expansion_score
  from public.commerce_market_profiles where tenant_id = p_tenant_id;

  select count(*) into v_active_markets from public.commerce_market_profiles
  where tenant_id = p_tenant_id and status = 'active';

  select count(*) into v_preparing_markets from public.commerce_market_profiles
  where tenant_id = p_tenant_id and status in ('preparing', 'monitoring');

  select count(*) into v_emerging from public.regional_commerce_insights
  where tenant_id = p_tenant_id and insight_type = 'emerging_opportunity';

  select count(*) into v_localization from public.localization_guidance_records
  where tenant_id = p_tenant_id;

  select count(*) into v_regulatory from public.regulatory_awareness_notes
  where tenant_id = p_tenant_id;

  select count(*) into v_currencies from public.multi_currency_visibility
  where tenant_id = p_tenant_id;

  select count(*) into v_regional from public.regional_commerce_insights
  where tenant_id = p_tenant_id;

  select count(*) into v_recommendations from public.expansion_recommendations
  where tenant_id = p_tenant_id;

  v_expansion_score := least(100, round(v_expansion_score + v_active_markets * 2 - v_regulatory * 0.5, 1));

  v_readiness_class := case
    when v_expansion_score >= 85 then 'strong'
    when v_expansion_score >= 70 then 'stable'
    when v_expansion_score >= 55 then 'preparing'
    when v_expansion_score >= 40 then 'early_stage'
    else 'foundational'
  end;

  return jsonb_build_object(
    'expansion_score', v_expansion_score,
    'readiness_classification', v_readiness_class,
    'active_markets', v_active_markets,
    'preparing_markets', v_preparing_markets,
    'emerging_opportunities', v_emerging,
    'localization_guidance_count', v_localization,
    'regulatory_notes_count', v_regulatory,
    'currency_visibility_count', v_currencies,
    'regional_insights_count', v_regional,
    'recommendations_pending', v_recommendations,
    'cultural_insights_count', (select count(*) from public.cultural_intelligence_insights where tenant_id = p_tenant_id),
    'readiness_assessments_count', (select count(*) from public.market_readiness_assessments where tenant_id = p_tenant_id)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Action RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_expansion_recommendation_action(
  p_recommendation_id uuid, p_action text, p_summary text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._gce_require_tenant();

  perform public._gce_log_audit(v_tenant_id, 'recommendation_action', coalesce(p_summary, p_action),
    jsonb_build_object('recommendation_id', p_recommendation_id, 'action', p_action));

  return jsonb_build_object(
    'status', 'logged',
    'recommendation_id', p_recommendation_id,
    'action', p_action,
    'human_oversight_required', true
  );
end; $$;

create or replace function public.generate_global_commerce_expansion_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb; v_id uuid; v_summary text;
begin
  v_tenant_id := public._gce_require_tenant();
  v_metrics := public._gce_refresh_metrics(v_tenant_id);
  v_summary := 'Global commerce expansion briefing: score ' || (v_metrics->>'expansion_score') || '/100, '
    || (v_metrics->>'active_markets') || ' active markets, '
    || (v_metrics->>'preparing_markets') || ' preparing, '
    || (v_metrics->>'recommendations_pending') || ' recommendations.';

  insert into public.global_commerce_expansion_briefings (tenant_id, summary, metrics)
  values (v_tenant_id, v_summary, v_metrics) returning id into v_id;

  perform public._gce_log_audit(v_tenant_id, 'briefing_generated', v_summary, v_metrics);
  return jsonb_build_object('briefing_id', v_id, 'summary', v_summary);
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_global_commerce_expansion_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._gce_ensure_settings(v_tenant_id);
  v_metrics := public._gce_refresh_metrics(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'expansion_score', v_metrics->'expansion_score',
    'readiness_classification', v_metrics->'readiness_classification',
    'philosophy', 'Global growth without becoming generic — authentic adaptation, intentional expansion.',
    'human_oversight_required', true
  );
end; $$;

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
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'global-commerce-expansion', 'Global Commerce Expansion',
  'Commerce international growth — market readiness, localization guidance, cultural intelligence, and expansion recommendations.',
  'authenticated', 49
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'global-commerce-expansion' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 14. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_global_commerce_expansion_card() to authenticated;
grant execute on function public.get_global_commerce_expansion_dashboard() to authenticated;
grant execute on function public.generate_global_commerce_expansion_briefing() to authenticated;
grant execute on function public.record_expansion_recommendation_action(uuid, text, text) to authenticated;
