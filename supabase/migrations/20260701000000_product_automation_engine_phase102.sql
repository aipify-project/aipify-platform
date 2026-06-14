-- Phase 102 — Product Automation Engine
-- Principle: Automation should eliminate unnecessary effort — never accountability.

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
    'product_automation', 'dropshipping_operations'
  )
);

-- ---------------------------------------------------------------------------
-- 1. product_automation_settings + brand_voice_profiles
-- ---------------------------------------------------------------------------
create table if not exists public.product_automation_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  engine_enabled boolean not null default true,
  auto_publish_disabled boolean not null default true,
  default_target_language text not null default 'en',
  default_rewriting_mode text not null default 'professional' check (
    default_rewriting_mode in (
      'professional', 'luxury', 'sport_performance', 'minimalistic',
      'informative', 'friendly', 'premium', 'custom_brand_voice'
    )
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.product_automation_settings enable row level security;
revoke all on public.product_automation_settings from authenticated, anon;

create table if not exists public.brand_voice_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  writing_style text not null default 'Professional and clear',
  tone_preference text not null default 'Confident, helpful, trustworthy',
  forbidden_terms jsonb not null default '[]'::jsonb,
  preferred_terms jsonb not null default '[]'::jsonb,
  personality_guidelines text,
  rewriting_mode text not null default 'professional',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.brand_voice_profiles enable row level security;
revoke all on public.brand_voice_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. import jobs + imported products
-- ---------------------------------------------------------------------------
create table if not exists public.product_import_jobs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  source_type text not null check (
    source_type in ('shopify', 'woocommerce', 'csv', 'supplier_feed', 'xml_feed', 'api', 'manual')
  ),
  status text not null default 'completed' check (
    status in ('pending', 'running', 'completed', 'failed')
  ),
  products_imported int not null default 0,
  summary text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.product_import_jobs enable row level security;
revoke all on public.product_import_jobs from authenticated, anon;

create table if not exists public.imported_products (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  import_job_id uuid references public.product_import_jobs (id) on delete set null,
  product_key text not null,
  title text not null,
  description text,
  source_type text not null default 'supplier_feed',
  status text not null default 'imported' check (
    status in ('imported', 'processing', 'awaiting_review', 'approved', 'published', 'rejected')
  ),
  price numeric(12, 2),
  currency text not null default 'NOK',
  category text,
  tags jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  variants jsonb not null default '[]'::jsonb,
  supplier_metadata jsonb not null default '{}'::jsonb,
  inventory_count int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, product_key)
);

alter table public.imported_products enable row level security;
revoke all on public.imported_products from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. translation + rewriting
-- ---------------------------------------------------------------------------
create table if not exists public.translation_jobs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  product_id uuid references public.imported_products (id) on delete cascade,
  source_language text not null default 'en',
  target_language text not null,
  status text not null default 'completed' check (status in ('pending', 'running', 'completed', 'failed')),
  created_at timestamptz not null default now()
);

alter table public.translation_jobs enable row level security;
revoke all on public.translation_jobs from authenticated, anon;

create table if not exists public.translation_versions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  product_id uuid references public.imported_products (id) on delete cascade,
  job_id uuid references public.translation_jobs (id) on delete set null,
  field_name text not null,
  original_text text not null,
  translated_text text not null,
  target_language text not null,
  version_number int not null default 1,
  created_at timestamptz not null default now()
);

alter table public.translation_versions enable row level security;
revoke all on public.translation_versions from authenticated, anon;

create table if not exists public.rewriting_jobs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  product_id uuid references public.imported_products (id) on delete cascade,
  rewriting_mode text not null default 'professional',
  status text not null default 'completed' check (status in ('pending', 'running', 'completed', 'failed')),
  created_at timestamptz not null default now()
);

alter table public.rewriting_jobs enable row level security;
revoke all on public.rewriting_jobs from authenticated, anon;

create table if not exists public.rewriting_versions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  product_id uuid references public.imported_products (id) on delete cascade,
  job_id uuid references public.rewriting_jobs (id) on delete set null,
  field_name text not null,
  original_text text not null,
  rewritten_text text not null,
  rewriting_mode text not null,
  version_number int not null default 1,
  created_at timestamptz not null default now()
);

alter table public.rewriting_versions enable row level security;
revoke all on public.rewriting_versions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. SEO, categories, approvals, bulk, quality
-- ---------------------------------------------------------------------------
create table if not exists public.seo_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  product_id uuid references public.imported_products (id) on delete cascade,
  recommendation_type text not null check (
    recommendation_type in (
      'title_length', 'keyword', 'meta_description', 'heading', 'internal_link',
      'structured_data', 'image_alt', 'faq_content'
    )
  ),
  title text not null,
  suggestion text not null,
  rationale text not null,
  priority text not null default 'moderate' check (
    priority in ('informational', 'moderate', 'important', 'critical')
  ),
  applied boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.seo_recommendations enable row level security;
revoke all on public.seo_recommendations from authenticated, anon;

create table if not exists public.category_suggestions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  product_id uuid references public.imported_products (id) on delete cascade,
  primary_category text not null,
  secondary_categories jsonb not null default '[]'::jsonb,
  suggested_tags jsonb not null default '[]'::jsonb,
  collection_assignments jsonb not null default '[]'::jsonb,
  confidence text not null default 'medium' check (confidence in ('low', 'medium', 'high')),
  rationale text not null,
  created_at timestamptz not null default now()
);

alter table public.category_suggestions enable row level security;
revoke all on public.category_suggestions from authenticated, anon;

create table if not exists public.approval_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  product_id uuid references public.imported_products (id) on delete cascade,
  request_type text not null check (
    request_type in ('full_product', 'translation', 'rewrite', 'seo', 'category', 'bulk')
  ),
  summary text not null,
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'partial')
  ),
  created_at timestamptz not null default now()
);

alter table public.approval_requests enable row level security;
revoke all on public.approval_requests from authenticated, anon;

create table if not exists public.approval_decisions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  request_id uuid references public.approval_requests (id) on delete cascade,
  decision text not null check (decision in ('approve_all', 'approve_selected', 'reject', 'edit_before_approve')),
  notes text,
  decided_at timestamptz not null default now()
);

alter table public.approval_decisions enable row level security;
revoke all on public.approval_decisions from authenticated, anon;

create table if not exists public.bulk_automation_jobs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null check (
    action_type in ('translate', 'rewrite', 'seo_analyze', 'category_suggest', 'queue_approval')
  ),
  product_count int not null default 0,
  status text not null default 'completed' check (status in ('pending', 'running', 'completed', 'failed')),
  summary text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.bulk_automation_jobs enable row level security;
revoke all on public.bulk_automation_jobs from authenticated, anon;

create table if not exists public.product_readiness_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  product_id uuid references public.imported_products (id) on delete cascade,
  readiness_score numeric(5, 2) not null check (readiness_score between 0 and 100),
  status_label text not null check (
    status_label in ('ready_for_review', 'needs_improvement', 'not_ready', 'published_ready')
  ),
  recommendations text,
  scored_at timestamptz not null default now()
);

alter table public.product_readiness_scores enable row level security;
revoke all on public.product_readiness_scores from authenticated, anon;

create table if not exists public.quality_validation_results (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  product_id uuid references public.imported_products (id) on delete cascade,
  check_type text not null check (
    check_type in (
      'missing_description', 'missing_images', 'duplicate_content', 'seo_opportunity',
      'category_mismatch', 'language_inconsistency', 'brand_voice_alignment'
    )
  ),
  severity text not null default 'moderate' check (
    severity in ('informational', 'moderate', 'important', 'critical')
  ),
  title text not null,
  explanation text not null,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.quality_validation_results enable row level security;
revoke all on public.quality_validation_results from authenticated, anon;

create table if not exists public.product_automation_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.product_automation_briefings enable row level security;
revoke all on public.product_automation_briefings from authenticated, anon;

create table if not exists public.product_automation_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  trigger_source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.product_automation_audit_log enable row level security;
revoke all on public.product_automation_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Helpers (_pae_)
-- ---------------------------------------------------------------------------
create or replace function public._pae_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._pae_log_audit(
  p_tenant_id uuid, p_event_type text, p_summary text default null,
  p_trigger_source text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.product_automation_audit_log (tenant_id, event_type, summary, trigger_source, metadata)
  values (p_tenant_id, p_event_type, p_summary, p_trigger_source, p_metadata)
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'product_automation_' || p_event_type, 'product_automation', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._pae_ensure_settings(p_tenant_id uuid)
returns public.product_automation_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.product_automation_settings;
begin
  insert into public.product_automation_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.product_automation_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._pae_ensure_brand_voice(p_tenant_id uuid)
returns public.brand_voice_profiles language plpgsql security definer set search_path = public as $$
declare v_profile public.brand_voice_profiles;
begin
  insert into public.brand_voice_profiles (tenant_id, personality_guidelines)
  values (p_tenant_id, 'Write with clarity and warmth. Avoid hype and exaggerated claims.')
  on conflict (tenant_id) do nothing;
  select * into v_profile from public.brand_voice_profiles where tenant_id = p_tenant_id;
  return v_profile;
end; $$;

create or replace function public._pae_seed_products(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_job_id uuid;
begin
  insert into public.product_import_jobs (tenant_id, source_type, status, products_imported, summary, completed_at)
  select p_tenant_id, 'supplier_feed', 'completed', 4, 'Initial demo import from supplier feed.', now()
  where not exists (select 1 from public.product_import_jobs j where j.tenant_id = p_tenant_id limit 1)
  returning id into v_job_id;

  if v_job_id is null then
    select id into v_job_id from public.product_import_jobs where tenant_id = p_tenant_id order by created_at desc limit 1;
  end if;

  insert into public.imported_products (
    tenant_id, import_job_id, product_key, title, description, source_type, status,
    price, category, tags, images, supplier_metadata, inventory_count
  )
  select p_tenant_id, v_job_id, v.key, v.title, v.item_description, v.source, v.status, v.price, v.cat, v.tags, v.images, v.meta, v.stock
  from (values
    (
      'portable_blender_pro', 'Portable Blender Pro 600ml',
      'High-speed portable blender. USB rechargeable. Perfect for smoothies on the go.',
      'supplier_feed', 'awaiting_review', 449.00, 'Active Lifestyle',
      '["blender","fitness","portable"]'::jsonb,
      '["https://example.com/blender.jpg"]'::jsonb,
      '{"supplier":"Nordic Fitness Supply","sku":"NFS-PB600"}'::jsonb, 120
    ),
    (
      'resistance_band_set', 'Resistance Band Set Pro',
      'Professional resistance bands with handles. 5 resistance levels included.',
      'supplier_feed', 'processing', 299.00, 'Fitness',
      '["fitness","training","bands"]'::jsonb,
      '["https://example.com/bands.jpg"]'::jsonb,
      '{"supplier":"Premium Active Goods","sku":"PAG-RBS5"}'::jsonb, 85
    ),
    (
      'eco_water_bottle', 'Insulated Eco Water Bottle 750ml',
      'Double-wall insulated stainless steel bottle. Keeps drinks cold 24h.',
      'csv', 'imported', 349.00, 'Sustainable Living',
      '["bottle","eco","hydration"]'::jsonb,
      '["https://example.com/bottle.jpg"]'::jsonb,
      '{"supplier":"EcoGoods Nordic","sku":"EGN-WB750"}'::jsonb, 200
    ),
    (
      'yoga_mat_premium', 'Premium Non-Slip Yoga Mat',
      'Extra thick yoga mat with alignment lines. Eco-friendly TPE material.',
      'woocommerce', 'approved', 599.00, 'Fitness',
      '["yoga","mat","wellness"]'::jsonb,
      '["https://example.com/yogamat.jpg"]'::jsonb,
      '{"supplier":"Premium Active Goods","sku":"PAG-YM01"}'::jsonb, 45
    )
  ) as v(key, title, item_description, source, status, price, cat, tags, images, meta, stock)
  where not exists (select 1 from public.imported_products p where p.tenant_id = p_tenant_id and p.product_key = v.key);
end; $$;

create or replace function public._pae_seed_automation_data(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.translation_versions (tenant_id, product_id, field_name, original_text, translated_text, target_language)
  select p_tenant_id, p.id, 'description', p.description,
    'Høyhastighets bærbar blender. USB-oppladbar. Perfekt for smoothies på farten.',
    'no'
  from public.imported_products p
  where p.tenant_id = p_tenant_id and p.product_key = 'portable_blender_pro'
    and not exists (select 1 from public.translation_versions t where t.product_id = p.id);

  insert into public.rewriting_versions (tenant_id, product_id, field_name, original_text, rewritten_text, rewriting_mode)
  select p_tenant_id, p.id, 'description', p.description,
    'Blend anywhere, anytime. The Portable Blender Pro delivers smooth results in seconds — USB rechargeable, travel-ready, and built for your active lifestyle.',
    'professional'
  from public.imported_products p
  where p.tenant_id = p_tenant_id and p.product_key = 'portable_blender_pro'
    and not exists (select 1 from public.rewriting_versions r where r.product_id = p.id);

  insert into public.seo_recommendations (tenant_id, product_id, recommendation_type, title, suggestion, rationale, priority)
  select p_tenant_id, p.id, v.type, v.title, v.suggestion, v.rationale, v.priority
  from public.imported_products p
  join (values
    ('portable_blender_pro', 'title_length', 'Improve title length', 'Add target keyword naturally: "Portable Blender Pro — USB Rechargeable Smoothie Maker"', 'Title is short — include primary keyword for search visibility.', 'important'),
    ('portable_blender_pro', 'meta_description', 'Enhance meta description', 'Create a compelling 150-character meta description highlighting USB recharge and portability.', 'Meta description missing — improves click-through from search results.', 'moderate'),
    ('portable_blender_pro', 'image_alt', 'Optimize image descriptions', 'Add descriptive alt text: "Portable USB rechargeable blender for smoothies on the go"', 'Image alt text improves accessibility and image search.', 'moderate'),
    ('resistance_band_set', 'keyword', 'Include target keyword', 'Naturally include "resistance band set" in the first paragraph.', 'Keyword placement supports category search rankings.', 'important'),
    ('eco_water_bottle', 'faq_content', 'Add FAQ content', 'Add FAQ: How long does it keep drinks cold? Is it dishwasher safe?', 'FAQ content supports featured snippets and customer trust.', 'informational')
  ) as v(key, type, title, suggestion, rationale, priority) on p.product_key = v.key
  where p.tenant_id = p_tenant_id
    and not exists (select 1 from public.seo_recommendations s where s.product_id = p.id and s.recommendation_type = v.type);

  insert into public.category_suggestions (tenant_id, product_id, primary_category, secondary_categories, suggested_tags, collection_assignments, confidence, rationale)
  select p_tenant_id, p.id, v.primary_cat, v.secondary, v.tags, v.collections, v.conf, v.rationale
  from public.imported_products p
  join (values
    ('portable_blender_pro', 'Active Lifestyle', '["Kitchen & Fitness","Travel Accessories"]'::jsonb, '["smoothie","portable","usb"]'::jsonb, '["Summer Essentials"]'::jsonb, 'high', 'Strong fit with active lifestyle catalog and seasonal collections.'),
    ('resistance_band_set', 'Fitness', '["Training Accessories","Home Gym"]'::jsonb, '["resistance","home-workout"]'::jsonb, '["Fitness Bundles"]'::jsonb, 'high', 'Complements existing fitness products — bundle opportunity.'),
    ('eco_water_bottle', 'Sustainable Living', '["Hydration","Outdoor"]'::jsonb, '["eco","insulated"]'::jsonb, '["Summer Hydration"]'::jsonb, 'medium', 'Seasonal placement recommended for summer campaign.')
  ) as v(key, primary_cat, secondary, tags, collections, conf, rationale) on p.product_key = v.key
  where p.tenant_id = p_tenant_id
    and not exists (select 1 from public.category_suggestions c where c.product_id = p.id);

  insert into public.approval_requests (tenant_id, product_id, request_type, summary, status)
  select p_tenant_id, p.id, 'full_product', 'Review translated and rewritten content before publication.', 'pending'
  from public.imported_products p
  where p.tenant_id = p_tenant_id and p.product_key = 'portable_blender_pro'
    and not exists (select 1 from public.approval_requests a where a.product_id = p.id);

  insert into public.product_readiness_scores (tenant_id, product_id, readiness_score, status_label, recommendations)
  select p_tenant_id, p.id, v.score, v.label, v.rec
  from public.imported_products p
  join (values
    ('portable_blender_pro', 89.0, 'ready_for_review', 'Improve meta description before publication.'),
    ('resistance_band_set', 72.0, 'needs_improvement', 'Complete translation and SEO recommendations.'),
    ('eco_water_bottle', 65.0, 'needs_improvement', 'Run translation and rewriting before review.'),
    ('yoga_mat_premium', 94.0, 'published_ready', 'Approved — ready for publication when you choose.')
  ) as v(key, score, label, rec) on p.product_key = v.key
  where p.tenant_id = p_tenant_id
    and not exists (select 1 from public.product_readiness_scores r where r.product_id = p.id);

  insert into public.quality_validation_results (tenant_id, product_id, check_type, severity, title, explanation)
  select p_tenant_id, p.id, v.check_type, v.severity, v.title, v.explanation
  from public.imported_products p
  join (values
    ('eco_water_bottle', 'missing_description', 'moderate', 'Description needs expansion', 'Supplier description is brief — rewriting recommended for store quality.'),
    ('eco_water_bottle', 'seo_opportunity', 'informational', 'SEO opportunities detected', 'Meta description and FAQ content would improve discoverability.'),
    ('resistance_band_set', 'language_inconsistency', 'important', 'Translation pending', 'Product content not yet translated to store language.'),
    ('portable_blender_pro', 'brand_voice_alignment', 'informational', 'Brand voice applied', 'Rewritten content aligns with professional brand voice profile.')
  ) as v(key, check_type, severity, title, explanation) on p.product_key = v.key
  where p.tenant_id = p_tenant_id
    and not exists (select 1 from public.quality_validation_results q where q.product_id = p.id and q.check_type = v.check_type);
end; $$;

create or replace function public._pae_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_imported int;
  v_awaiting int;
  v_avg_readiness numeric;
  v_seo_count int;
  v_quality_warnings int;
begin
  select count(*) into v_imported from public.imported_products where tenant_id = p_tenant_id;
  select count(*) into v_awaiting from public.imported_products where tenant_id = p_tenant_id and status in ('imported', 'processing', 'awaiting_review');
  select coalesce(avg(readiness_score), 0) into v_avg_readiness from public.product_readiness_scores where tenant_id = p_tenant_id;
  select count(*) into v_seo_count from public.seo_recommendations where tenant_id = p_tenant_id and applied = false;
  select count(*) into v_quality_warnings from public.quality_validation_results where tenant_id = p_tenant_id and resolved = false and severity in ('important', 'critical');

  return jsonb_build_object(
    'automation_score', least(100, round(v_avg_readiness, 1)),
    'imported_products_count', v_imported,
    'awaiting_approval_count', v_awaiting,
    'avg_readiness_score', round(v_avg_readiness, 1),
    'seo_recommendations_count', v_seo_count,
    'quality_warnings_count', v_quality_warnings,
    'pending_approvals', (select count(*) from public.approval_requests where tenant_id = p_tenant_id and status = 'pending'),
    'translation_opportunities', (select count(*) from public.imported_products p where p.tenant_id = p_tenant_id and not exists (
      select 1 from public.translation_versions t where t.product_id = p.id
    )),
    'bulk_jobs_completed', (select count(*) from public.bulk_automation_jobs where tenant_id = p_tenant_id and status = 'completed')
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Action RPCs
-- ---------------------------------------------------------------------------
create or replace function public.import_product(
  p_product_key text, p_title text, p_description text default null,
  p_source_type text default 'supplier_feed', p_price numeric default null, p_category text default 'General'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_job_id uuid; v_id uuid;
begin
  v_tenant_id := public._pae_require_tenant();
  perform public._pae_ensure_settings(v_tenant_id);

  insert into public.product_import_jobs (tenant_id, source_type, status, products_imported, summary, completed_at)
  values (v_tenant_id, coalesce(p_source_type, 'supplier_feed'), 'completed', 1,
    'Product imported — awaiting review.', now())
  returning id into v_job_id;

  insert into public.imported_products (tenant_id, import_job_id, product_key, title, description, source_type, status, price, category)
  values (v_tenant_id, v_job_id, p_product_key, p_title, p_description, coalesce(p_source_type, 'supplier_feed'), 'awaiting_review', p_price, p_category)
  on conflict (tenant_id, product_key) do update set
    title = excluded.title, description = excluded.description, status = 'awaiting_review', updated_at = now()
  returning id into v_id;

  insert into public.approval_requests (tenant_id, product_id, request_type, summary, status)
  values (v_tenant_id, v_id, 'full_product', 'Imported product requires human review before publication.', 'pending');

  perform public._pae_log_audit(v_tenant_id, 'product_imported', 'Product imported: ' || p_title, 'import_engine',
    jsonb_build_object('product_id', v_id, 'product_key', p_product_key, 'auto_publish', false));

  return jsonb_build_object('status', 'awaiting_review', 'product_id', v_id, 'requires_approval', true);
end; $$;

create or replace function public.translate_product(
  p_product_id uuid, p_target_language text default 'no'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_product public.imported_products; v_job_id uuid; v_translated text;
begin
  v_tenant_id := public._pae_require_tenant();
  select * into v_product from public.imported_products where id = p_product_id and tenant_id = v_tenant_id;
  if v_product.id is null then raise exception 'Product not found'; end if;

  insert into public.translation_jobs (tenant_id, product_id, target_language, status)
  values (v_tenant_id, p_product_id, coalesce(p_target_language, 'no'), 'completed')
  returning id into v_job_id;

  v_translated := '[Translated to ' || coalesce(p_target_language, 'no') || '] ' || coalesce(v_product.description, v_product.title);

  insert into public.translation_versions (tenant_id, product_id, job_id, field_name, original_text, translated_text, target_language)
  values (v_tenant_id, p_product_id, v_job_id, 'description', coalesce(v_product.description, v_product.title), v_translated, coalesce(p_target_language, 'no'));

  update public.imported_products set status = 'awaiting_review', updated_at = now() where id = p_product_id;

  perform public._pae_log_audit(v_tenant_id, 'product_translated', 'Translation generated for review', 'translation_engine',
    jsonb_build_object('product_id', p_product_id, 'target_language', p_target_language));

  return jsonb_build_object('status', 'awaiting_review', 'job_id', v_job_id, 'requires_approval', true, 'translated_preview', v_translated);
end; $$;

create or replace function public.rewrite_product(
  p_product_id uuid, p_rewriting_mode text default 'professional'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_product public.imported_products; v_job_id uuid; v_rewritten text;
begin
  v_tenant_id := public._pae_require_tenant();
  perform public._pae_ensure_brand_voice(v_tenant_id);
  select * into v_product from public.imported_products where id = p_product_id and tenant_id = v_tenant_id;
  if v_product.id is null then raise exception 'Product not found'; end if;

  insert into public.rewriting_jobs (tenant_id, product_id, rewriting_mode, status)
  values (v_tenant_id, p_product_id, coalesce(p_rewriting_mode, 'professional'), 'completed')
  returning id into v_job_id;

  v_rewritten := 'Discover ' || v_product.title || ' — crafted for clarity and appeal. '
    || coalesce(v_product.description, '') || ' Designed to match your brand voice.';

  insert into public.rewriting_versions (tenant_id, product_id, job_id, field_name, original_text, rewritten_text, rewriting_mode)
  values (v_tenant_id, p_product_id, v_job_id, 'description', coalesce(v_product.description, v_product.title), v_rewritten, coalesce(p_rewriting_mode, 'professional'));

  update public.imported_products set status = 'awaiting_review', updated_at = now() where id = p_product_id;

  perform public._pae_log_audit(v_tenant_id, 'product_rewritten', 'Description rewritten for review', 'rewriting_engine',
    jsonb_build_object('product_id', p_product_id, 'rewriting_mode', p_rewriting_mode));

  return jsonb_build_object('status', 'awaiting_review', 'job_id', v_job_id, 'requires_approval', true, 'rewritten_preview', v_rewritten);
end; $$;

create or replace function public.analyze_product_seo(p_product_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_count int;
begin
  v_tenant_id := public._pae_require_tenant();
  perform public._pae_seed_automation_data(v_tenant_id);

  select count(*) into v_count from public.seo_recommendations
  where product_id = p_product_id and tenant_id = v_tenant_id and applied = false;

  if v_count = 0 then
    insert into public.seo_recommendations (tenant_id, product_id, recommendation_type, title, suggestion, rationale, priority)
    values (v_tenant_id, p_product_id, 'title_length', 'Review title optimization',
      'Ensure product title includes primary keyword naturally within 60 characters.',
      'Optimized titles improve search visibility without compromising readability.', 'moderate');
    v_count := 1;
  end if;

  perform public._pae_log_audit(v_tenant_id, 'seo_analyzed', 'SEO analysis completed', 'seo_engine',
    jsonb_build_object('product_id', p_product_id, 'recommendations_count', v_count));

  return jsonb_build_object('status', 'completed', 'recommendations_count', v_count, 'requires_approval', true);
end; $$;

create or replace function public.suggest_product_categories(p_product_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid; v_product public.imported_products;
begin
  v_tenant_id := public._pae_require_tenant();
  select * into v_product from public.imported_products where id = p_product_id and tenant_id = v_tenant_id;
  if v_product.id is null then raise exception 'Product not found'; end if;

  insert into public.category_suggestions (tenant_id, product_id, primary_category, secondary_categories, suggested_tags, confidence, rationale)
  values (v_tenant_id, p_product_id, coalesce(v_product.category, 'General'), '[]'::jsonb, coalesce(v_product.tags, '[]'::jsonb), 'medium',
    'Category suggested based on product description and existing catalog structure.')
  on conflict do nothing
  returning id into v_id;

  if v_id is null then
    select id into v_id from public.category_suggestions where product_id = p_product_id and tenant_id = v_tenant_id order by created_at desc limit 1;
  end if;

  perform public._pae_log_audit(v_tenant_id, 'categories_suggested', 'Category suggestions generated', 'category_engine',
    jsonb_build_object('product_id', p_product_id, 'suggestion_id', v_id));

  return jsonb_build_object('status', 'completed', 'suggestion_id', v_id, 'requires_approval', true);
end; $$;

create or replace function public.approve_product_changes(
  p_product_id uuid, p_decision text default 'approve_all', p_notes text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_request_id uuid; v_new_status text;
begin
  v_tenant_id := public._pae_require_tenant();

  v_new_status := case when p_decision = 'reject' then 'rejected' else 'approved' end;

  update public.imported_products set status = v_new_status, updated_at = now()
  where id = p_product_id and tenant_id = v_tenant_id;

  select id into v_request_id from public.approval_requests
  where product_id = p_product_id and tenant_id = v_tenant_id and status = 'pending'
  order by created_at desc limit 1;

  if v_request_id is not null then
    update public.approval_requests set status = case when p_decision = 'reject' then 'rejected' else 'approved' end
    where id = v_request_id;

    insert into public.approval_decisions (tenant_id, request_id, decision, notes)
    values (v_tenant_id, v_request_id, coalesce(p_decision, 'approve_all'), p_notes);
  end if;

  perform public._pae_log_audit(v_tenant_id, 'product_approved', 'Human approval decision recorded', 'approval_workflow',
    jsonb_build_object('product_id', p_product_id, 'decision', p_decision, 'auto_publish', false));

  return jsonb_build_object('status', v_new_status, 'decision', p_decision, 'requires_manual_publish', true);
end; $$;

create or replace function public.run_bulk_automation(
  p_action_type text, p_product_ids uuid[] default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_job_id uuid; v_count int; v_pid uuid;
begin
  v_tenant_id := public._pae_require_tenant();

  if p_product_ids is null or array_length(p_product_ids, 1) is null then
    select array_agg(id) into p_product_ids from public.imported_products where tenant_id = v_tenant_id limit 10;
  end if;

  v_count := coalesce(array_length(p_product_ids, 1), 0);

  insert into public.bulk_automation_jobs (tenant_id, action_type, product_count, status, summary, completed_at)
  values (v_tenant_id, coalesce(p_action_type, 'translate'), v_count, 'completed',
    'Bulk ' || coalesce(p_action_type, 'translate') || ' completed for ' || v_count || ' products.', now())
  returning id into v_job_id;

  foreach v_pid in array p_product_ids loop
    case coalesce(p_action_type, 'translate')
      when 'translate' then perform public.translate_product(v_pid, 'no');
      when 'rewrite' then perform public.rewrite_product(v_pid, 'professional');
      when 'seo_analyze' then perform public.analyze_product_seo(v_pid);
      when 'category_suggest' then perform public.suggest_product_categories(v_pid);
      when 'queue_approval' then
        insert into public.approval_requests (tenant_id, product_id, request_type, summary, status)
        values (v_tenant_id, v_pid, 'bulk', 'Queued for bulk approval review.', 'pending')
        on conflict do nothing;
      else null;
    end case;
  end loop;

  perform public._pae_log_audit(v_tenant_id, 'bulk_automation', 'Bulk automation job completed', 'bulk_engine',
    jsonb_build_object('job_id', v_job_id, 'action_type', p_action_type, 'product_count', v_count));

  return jsonb_build_object('job_id', v_job_id, 'status', 'completed', 'product_count', v_count, 'requires_approval', true);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.generate_product_automation_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb; v_id uuid; v_summary text;
begin
  v_tenant_id := public._pae_require_tenant();
  v_metrics := public._pae_refresh_metrics(v_tenant_id);
  v_summary := 'Automation briefing: readiness ' || (v_metrics->>'avg_readiness_score') || '/100, '
    || (v_metrics->>'awaiting_approval_count') || ' awaiting approval, '
    || (v_metrics->>'seo_recommendations_count') || ' SEO recommendations.';

  insert into public.product_automation_briefings (tenant_id, summary, content)
  values (v_tenant_id, v_summary, v_metrics) returning id into v_id;

  perform public._pae_log_audit(v_tenant_id, 'briefing_generated', v_summary, 'executive_reporting', v_metrics);
  return jsonb_build_object('briefing_id', v_id, 'summary', v_summary);
end; $$;

create or replace function public.get_product_automation_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._pae_ensure_settings(v_tenant_id);
  v_metrics := public._pae_refresh_metrics(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'automation_score', v_metrics->'automation_score',
    'awaiting_approval_count', v_metrics->'awaiting_approval_count',
    'philosophy', 'From product discovery to store-ready content in minutes.',
    'human_oversight_required', true
  );
end; $$;

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
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'product-automation', 'Product Automation', 'Import, translate, rewrite, SEO optimization and category suggestions for store-ready products.', 'authenticated', 47
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'product-automation' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 9. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_product_automation_card() to authenticated;
grant execute on function public.get_product_automation_dashboard() to authenticated;
grant execute on function public.generate_product_automation_briefing() to authenticated;
grant execute on function public.import_product(text, text, text, text, numeric, text) to authenticated;
grant execute on function public.translate_product(uuid, text) to authenticated;
grant execute on function public.rewrite_product(uuid, text) to authenticated;
grant execute on function public.analyze_product_seo(uuid) to authenticated;
grant execute on function public.suggest_product_categories(uuid) to authenticated;
grant execute on function public.approve_product_changes(uuid, text, text) to authenticated;
grant execute on function public.run_bulk_automation(text, uuid[]) to authenticated;
