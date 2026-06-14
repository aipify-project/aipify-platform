-- Phase 95 — Global Expansion & Localization Framework
-- Principle: One platform. Local experiences. Global impact.

alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community',
    'marketplace_governance', 'partner_certification', 'enterprise_deployment',
    'billing_commercial', 'academy_learning', 'global_localization'
  )
);

-- ---------------------------------------------------------------------------
-- 1. localization_settings
-- ---------------------------------------------------------------------------
create table if not exists public.localization_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  default_language text not null default 'en',
  default_region text not null default 'EU',
  default_timezone text not null default 'Europe/Copenhagen',
  default_currency text not null default 'EUR',
  date_format text not null default 'DD/MM/YYYY',
  time_format text not null default '24h',
  number_format text not null default '1.234,56',
  multi_language_enabled boolean not null default true,
  localized_notifications boolean not null default true,
  timezone_intelligence boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.localization_settings enable row level security;
revoke all on public.localization_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. localization_supported_languages
-- ---------------------------------------------------------------------------
create table if not exists public.localization_supported_languages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  language_code text not null,
  language_name text not null,
  native_name text not null,
  market_status text not null default 'active' check (
    market_status in ('active', 'planned', 'beta', 'deprecated')
  ),
  coverage_pct numeric(5, 2) not null default 0 check (coverage_pct between 0 and 100),
  is_default boolean not null default false,
  unique (tenant_id, language_code)
);

alter table public.localization_supported_languages enable row level security;
revoke all on public.localization_supported_languages from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. localization_language_variants
-- ---------------------------------------------------------------------------
create table if not exists public.localization_language_variants (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  language_id uuid not null references public.localization_supported_languages (id) on delete cascade,
  variant_code text not null,
  variant_label text not null,
  region_code text,
  unique (tenant_id, language_id, variant_code)
);

alter table public.localization_language_variants enable row level security;
revoke all on public.localization_language_variants from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. localization_projects + translation entries + reviews
-- ---------------------------------------------------------------------------
create table if not exists public.localization_projects (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  project_key text not null,
  title text not null,
  description text not null,
  target_language text not null,
  content_scope text not null default 'interface' check (
    content_scope in ('interface', 'knowledge_center', 'notifications', 'emails', 'documentation', 'partner_assets')
  ),
  status text not null default 'in_progress' check (
    status in ('planned', 'in_progress', 'review', 'published', 'archived')
  ),
  progress_pct numeric(5, 2) not null default 0 check (progress_pct between 0 and 100),
  unique (tenant_id, project_key)
);

alter table public.localization_projects enable row level security;
revoke all on public.localization_projects from authenticated, anon;

create table if not exists public.localization_translation_entries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  project_id uuid references public.localization_projects (id) on delete cascade,
  entry_key text not null,
  source_text text not null,
  translated_text text,
  language_code text not null,
  status text not null default 'pending' check (
    status in ('pending', 'translated', 'review', 'approved', 'outdated')
  ),
  unique (tenant_id, entry_key, language_code)
);

alter table public.localization_translation_entries enable row level security;
revoke all on public.localization_translation_entries from authenticated, anon;

create table if not exists public.localization_translation_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  entry_id uuid not null references public.localization_translation_entries (id) on delete cascade,
  review_status text not null default 'pending' check (
    review_status in ('pending', 'approved', 'rejected', 'needs_revision')
  ),
  accuracy_score numeric(5, 2),
  clarity_score numeric(5, 2),
  cultural_score numeric(5, 2),
  reviewer_notes text,
  reviewed_at timestamptz
);

alter table public.localization_translation_reviews enable row level security;
revoke all on public.localization_translation_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. terminology, regional content, playbooks
-- ---------------------------------------------------------------------------
create table if not exists public.localization_terminology_glossary (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  term_key text not null,
  source_term text not null,
  translated_term text not null,
  language_code text not null,
  domain text not null default 'general' check (
    domain in ('general', 'support', 'governance', 'commerce', 'technical', 'executive')
  ),
  unique (tenant_id, term_key, language_code)
);

alter table public.localization_terminology_glossary enable row level security;
revoke all on public.localization_terminology_glossary from authenticated, anon;

create table if not exists public.localization_regional_content (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  content_key text not null,
  title text not null,
  description text not null,
  region_code text not null,
  language_code text not null,
  content_type text not null default 'guidance' check (
    content_type in ('guidance', 'example', 'regulatory', 'terminology', 'playbook_excerpt')
  ),
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  unique (tenant_id, content_key)
);

alter table public.localization_regional_content enable row level security;
revoke all on public.localization_regional_content from authenticated, anon;

create table if not exists public.localization_country_playbooks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  country_code text not null,
  country_name text not null,
  market_status text not null default 'assessment' check (
    market_status in ('assessment', 'planning', 'launch_ready', 'active', 'paused')
  ),
  readiness_score numeric(5, 2) not null default 0 check (readiness_score between 0 and 100),
  summary text not null,
  checklist jsonb not null default '[]'::jsonb,
  unique (tenant_id, country_code)
);

alter table public.localization_country_playbooks enable row level security;
revoke all on public.localization_country_playbooks from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. recommendations, audits, analytics, briefings
-- ---------------------------------------------------------------------------
create table if not exists public.localization_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  title text not null,
  description text not null,
  recommendation_type text not null check (
    recommendation_type in ('missing_translation', 'outdated_content', 'regional_optimization', 'cultural_adaptation')
  ),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  language_code text,
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  created_at timestamptz not null default now()
);

alter table public.localization_recommendations enable row level security;
revoke all on public.localization_recommendations from authenticated, anon;

create table if not exists public.localization_audits (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  audit_type text not null check (
    audit_type in ('translation_quality', 'terminology_consistency', 'cultural_review', 'compliance_readiness')
  ),
  title text not null,
  summary text,
  overall_score numeric(5, 2),
  status text not null default 'completed' check (status in ('scheduled', 'in_progress', 'completed')),
  created_at timestamptz not null default now()
);

alter table public.localization_audits enable row level security;
revoke all on public.localization_audits from authenticated, anon;

create table if not exists public.localization_analytics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  region_code text not null,
  region_label text not null,
  adoption_rate_pct numeric(5, 2) not null default 0,
  language_usage_pct numeric(5, 2) not null default 0,
  satisfaction_score numeric(5, 2) not null default 0,
  calculated_at timestamptz not null default now()
);

alter table public.localization_analytics enable row level security;
revoke all on public.localization_analytics from authenticated, anon;

create table if not exists public.localization_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.localization_briefings enable row level security;
revoke all on public.localization_briefings from authenticated, anon;

create table if not exists public.localization_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  trigger_source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.localization_audit_log enable row level security;
revoke all on public.localization_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Helpers (_gel_)
-- ---------------------------------------------------------------------------
create or replace function public._gel_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._gel_log_audit(
  p_tenant_id uuid, p_event_type text, p_summary text default null,
  p_trigger_source text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.localization_audit_log (tenant_id, event_type, summary, trigger_source, metadata)
  values (p_tenant_id, p_event_type, p_summary, p_trigger_source, p_metadata)
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'global_localization_' || p_event_type, 'global_localization', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._gel_ensure_settings(p_tenant_id uuid)
returns public.localization_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.localization_settings;
begin
  insert into public.localization_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.localization_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._gel_seed_languages(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.localization_supported_languages (tenant_id, language_code, language_name, native_name, market_status, coverage_pct, is_default)
  select p_tenant_id, v.code, v.name, v.native, v.status, v.cov, v.def
  from (values
    ('en', 'English', 'English', 'active', 100.0, true),
    ('da', 'Danish', 'Dansk', 'active', 95.0, false),
    ('no', 'Norwegian', 'Norsk', 'active', 92.0, false),
    ('sv', 'Swedish', 'Svenska', 'active', 90.0, false),
    ('de', 'German', 'Deutsch', 'planned', 0.0, false),
    ('fr', 'French', 'Français', 'planned', 0.0, false),
    ('es', 'Spanish', 'Español', 'planned', 0.0, false)
  ) as v(code, name, native, status, cov, def)
  where not exists (select 1 from public.localization_supported_languages l where l.tenant_id = p_tenant_id and l.language_code = v.code);
end; $$;

create or replace function public._gel_seed_projects(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.localization_projects (tenant_id, project_key, title, description, target_language, content_scope, status, progress_pct)
  select p_tenant_id, v.key, v.title, v.item_description, v.lang, v.scope, v.status, v.prog
  from (values
    ('kc_da', 'Knowledge Center — Danish', 'Operational guidance in Danish.', 'da', 'knowledge_center', 'published', 95.0),
    ('kc_no', 'Knowledge Center — Norwegian', 'Operational guidance in Norwegian.', 'no', 'knowledge_center', 'published', 92.0),
    ('kc_sv', 'Knowledge Center — Swedish', 'Operational guidance in Swedish.', 'sv', 'knowledge_center', 'published', 90.0),
    ('ui_de', 'Interface — German', 'Customer app interface translation.', 'de', 'interface', 'planned', 0.0),
    ('notifications_multi', 'Localized Notifications', 'Email and in-app notification localization.', 'en', 'notifications', 'in_progress', 78.0),
    ('partner_assets', 'Partner Enablement Assets', 'Localized partner training materials.', 'en', 'partner_assets', 'review', 65.0)
  ) as v(key, title, item_description, lang, scope, status, prog)
  where not exists (select 1 from public.localization_projects p where p.tenant_id = p_tenant_id and p.project_key = v.key);
end; $$;

create or replace function public._gel_seed_playbooks(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.localization_country_playbooks (tenant_id, country_code, country_name, market_status, readiness_score, summary, checklist)
  select p_tenant_id, v.code, v.name, v.status, v.score, v.summary, v.checklist
  from (values
    ('DK', 'Denmark', 'active', 92.0, 'Nordic launch market with full language support.',
      jsonb_build_array('Language coverage', 'Regional compliance review', 'Partner network', 'Payment localization')),
    ('NO', 'Norway', 'active', 88.0, 'Active market with Norwegian localization.',
      jsonb_build_array('Language coverage', 'Data residency review', 'Partner enablement')),
    ('SE', 'Sweden', 'active', 86.0, 'Active market with Swedish localization.',
      jsonb_build_array('Language coverage', 'Regional terminology', 'Customer success playbooks')),
    ('DE', 'Germany', 'planning', 45.0, 'Expansion assessment for DACH region.',
      jsonb_build_array('Market assessment', 'Competitive analysis', 'Regulatory evaluation', 'Localization requirements')),
    ('GB', 'United Kingdom', 'launch_ready', 78.0, 'English-first market with regional compliance readiness.',
      jsonb_build_array('Privacy regulations', 'Invoice standards', 'Partner opportunities'))
  ) as v(code, name, status, score, summary, checklist)
  where not exists (select 1 from public.localization_country_playbooks cp where cp.tenant_id = p_tenant_id and cp.country_code = v.code);
end; $$;

create or replace function public._gel_seed_recommendations(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.localization_recommendations (tenant_id, title, description, recommendation_type, priority, language_code)
  select p_tenant_id, v.title, v.item_description, v.type, v.pri, v.lang
  from (values
    ('Complete German interface translations', 'Interface project for de locale is at 0% — prioritize core navigation.', 'missing_translation', 'high', 'de'),
    ('Review Norwegian notification templates', 'Three notification templates flagged as outdated after product update.', 'outdated_content', 'medium', 'no'),
    ('Optimize Danish date formatting', 'Align date presentation with regional business expectations.', 'regional_optimization', 'low', 'da'),
    ('Adapt executive briefing tone for Nordic markets', 'Communication formality may benefit from cultural adaptation.', 'cultural_adaptation', 'medium', 'da')
  ) as v(title, item_description, type, pri, lang)
  where not exists (select 1 from public.localization_recommendations r where r.tenant_id = p_tenant_id limit 1);
end; $$;

create or replace function public._gel_seed_glossary(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.localization_terminology_glossary (tenant_id, term_key, source_term, translated_term, language_code, domain)
  select p_tenant_id, v.key, v.source, v.translated, v.lang, v.domain
  from (values
    ('action_center', 'Action Center', 'Handlingcenter', 'da', 'general'),
    ('knowledge_center', 'Knowledge Center', 'Videncenter', 'da', 'general'),
    ('governance', 'Governance', 'Governance', 'no', 'governance'),
    ('business_pack', 'Business Pack', 'Business Pack', 'sv', 'commerce')
  ) as v(key, source, translated, lang, domain)
  where not exists (select 1 from public.localization_terminology_glossary g where g.tenant_id = p_tenant_id and g.term_key = v.key and g.language_code = v.lang);
end; $$;

create or replace function public._gel_seed_regional_content(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.localization_regional_content (tenant_id, content_key, title, description, region_code, language_code, content_type)
  select p_tenant_id, v.key, v.title, v.item_description, v.region, v.lang, v.type
  from (values
    ('gdpr_eu', 'GDPR Compliance Readiness', 'Privacy regulation guidance for EU operations.', 'EU', 'en', 'regulatory'),
    ('nordic_support_norms', 'Nordic Customer Service Norms', 'Communication expectations for Nordic markets.', 'NORDIC', 'da', 'guidance'),
    ('invoice_dk', 'Danish Invoice Standards', 'Local invoice and tax presentation requirements.', 'DK', 'da', 'regulatory')
  ) as v(key, title, item_description, region, lang, type)
  where not exists (select 1 from public.localization_regional_content rc where rc.tenant_id = p_tenant_id and rc.content_key = v.key);
end; $$;

create or replace function public._gel_refresh_analytics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_avg_coverage numeric;
begin
  select coalesce(avg(coverage_pct), 0) into v_avg_coverage
  from public.localization_supported_languages where tenant_id = p_tenant_id and market_status = 'active';

  delete from public.localization_analytics where tenant_id = p_tenant_id;
  insert into public.localization_analytics (tenant_id, region_code, region_label, adoption_rate_pct, language_usage_pct, satisfaction_score)
  values
    (p_tenant_id, 'NORDIC', 'Nordic Region', 88.0, 72.0, 91.0),
    (p_tenant_id, 'EU', 'European Union', 76.0, 58.0, 87.0),
    (p_tenant_id, 'GLOBAL', 'Global (English)', 65.0, 45.0, 84.0);

  delete from public.localization_audits where tenant_id = p_tenant_id;
  insert into public.localization_audits (tenant_id, audit_type, title, summary, overall_score, status)
  values
    (p_tenant_id, 'translation_quality', 'Q2 Translation Quality Review', 'Nordic locales pass accuracy and clarity thresholds.', 92.0, 'completed'),
    (p_tenant_id, 'terminology_consistency', 'Terminology Consistency Audit', 'Glossary alignment verified across da/no/sv.', 89.0, 'completed'),
    (p_tenant_id, 'compliance_readiness', 'Regional Compliance Readiness', 'Compliance readiness — not legal advice.', 85.0, 'completed');

  return jsonb_build_object(
    'global_readiness_score', least(100, round(v_avg_coverage * 0.9 + 10, 1)),
    'avg_language_coverage_pct', round(v_avg_coverage, 1),
    'active_markets', (select count(*) from public.localization_country_playbooks where tenant_id = p_tenant_id and market_status = 'active'),
    'planned_markets', (select count(*) from public.localization_country_playbooks where tenant_id = p_tenant_id and market_status in ('assessment', 'planning', 'launch_ready'))
  );
end; $$;

create or replace function public._gel_trust_explanation(p_tenant_id uuid, p_score numeric)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public.generate_decision_explanation(
    'gel-score-' || p_tenant_id::text,
    'global_localization',
    'global_localization',
    'Global localization readiness: ' || p_score || '/100',
    'Global success requires local understanding. Technology should adapt to people.',
    jsonb_build_array(
      jsonb_build_object('source', 'language_coverage'),
      jsonb_build_object('source', 'regional_analytics'),
      jsonb_build_object('source', 'country_playbooks')
    ),
    jsonb_build_array('multi_language', 'regional_compliance_readiness', 'audit_logged'),
    'medium', '[]'::jsonb, '[]'::jsonb
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Action RPCs
-- ---------------------------------------------------------------------------
create or replace function public.dismiss_localization_recommendation(p_recommendation_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._gel_require_tenant();
  update public.localization_recommendations set status = 'dismissed'
  where id = p_recommendation_id and tenant_id = v_tenant_id;
  perform public._gel_log_audit(v_tenant_id, 'recommendation_dismissed', 'Localization recommendation dismissed', 'recommendation_engine',
    jsonb_build_object('recommendation_id', p_recommendation_id));
  return jsonb_build_object('status', 'dismissed');
end; $$;

create or replace function public.advance_country_playbook(p_country_code text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_new_status text;
begin
  v_tenant_id := public._gel_require_tenant();
  select case market_status
    when 'assessment' then 'planning'
    when 'planning' then 'launch_ready'
    when 'launch_ready' then 'active'
    else market_status
  end into v_new_status
  from public.localization_country_playbooks
  where tenant_id = v_tenant_id and country_code = p_country_code;

  if v_new_status is null then return jsonb_build_object('error', 'Playbook not found'); end if;

  update public.localization_country_playbooks
  set market_status = v_new_status,
      readiness_score = least(100, readiness_score + 10)
  where tenant_id = v_tenant_id and country_code = p_country_code;

  perform public._gel_log_audit(v_tenant_id, 'playbook_advanced', 'Country playbook advanced to ' || v_new_status, 'expansion_playbook',
    jsonb_build_object('country_code', p_country_code, 'status', v_new_status));
  return jsonb_build_object('status', v_new_status);
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.generate_global_expansion_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_metrics jsonb;
  v_id uuid;
  v_summary text;
begin
  v_tenant_id := public._gel_require_tenant();
  perform public._gel_ensure_settings(v_tenant_id);
  perform public._gel_seed_languages(v_tenant_id);
  perform public._gel_seed_projects(v_tenant_id);
  perform public._gel_seed_playbooks(v_tenant_id);
  v_metrics := public._gel_refresh_analytics(v_tenant_id);

  v_summary := 'Global expansion briefing: readiness ' || (v_metrics->>'global_readiness_score') || '/100, '
    || (v_metrics->>'active_markets') || ' active markets, avg coverage ' || (v_metrics->>'avg_language_coverage_pct') || '%.';

  insert into public.localization_briefings (tenant_id, summary, content)
  values (v_tenant_id, v_summary, v_metrics)
  returning id into v_id;

  perform public._gel_log_audit(v_tenant_id, 'briefing_generated', v_summary, 'executive_reporting', v_metrics);
  return jsonb_build_object('briefing_id', v_id, 'summary', v_summary);
end; $$;

create or replace function public.get_global_expansion_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._gel_ensure_settings(v_tenant_id);
  perform public._gel_seed_languages(v_tenant_id);
  v_metrics := public._gel_refresh_analytics(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'global_readiness_score', v_metrics->'global_readiness_score',
    'avg_language_coverage_pct', v_metrics->'avg_language_coverage_pct',
    'philosophy', 'One platform. Local experiences. Global impact.',
    'human_oversight_required', true
  );
end; $$;

create or replace function public.get_global_expansion_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.localization_settings;
  v_metrics jsonb;
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

  return jsonb_build_object(
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
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'global-expansion', 'Global Expansion & Localization', 'Scale internationally while maintaining relevance, trust and operational consistency.', 'authenticated', 39
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'global-expansion' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 11. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_global_expansion_card() to authenticated;
grant execute on function public.get_global_expansion_dashboard() to authenticated;
grant execute on function public.generate_global_expansion_briefing() to authenticated;
grant execute on function public.dismiss_localization_recommendation(uuid) to authenticated;
grant execute on function public.advance_country_playbook(text) to authenticated;
