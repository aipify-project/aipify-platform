-- Phase 55 — Self-Knowledge & Knowledge Center

-- ---------------------------------------------------------------------------
-- 1. aipify_knowledge_categories
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_knowledge_categories (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete cascade,
  parent_category_id uuid references public.aipify_knowledge_categories (id) on delete set null,
  slug text not null,
  name text not null,
  description text,
  sort_order int not null default 0,
  visibility text not null default 'admin_and_support' check (
    visibility in ('public', 'authenticated', 'admin_and_support', 'internal')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists aipify_knowledge_categories_global_slug_idx
  on public.aipify_knowledge_categories (slug) where tenant_id is null;
create unique index if not exists aipify_knowledge_categories_tenant_slug_idx
  on public.aipify_knowledge_categories (tenant_id, slug) where tenant_id is not null;

alter table public.aipify_knowledge_categories enable row level security;
revoke all on public.aipify_knowledge_categories from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. aipify_knowledge_articles
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_knowledge_articles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete cascade,
  category_id uuid references public.aipify_knowledge_categories (id) on delete set null,
  slug text not null,
  title text not null,
  summary text,
  body text not null,
  format text not null default 'markdown' check (format in ('markdown', 'plain_text', 'html_safe')),
  language text not null default 'en',
  article_type text not null default 'faq' check (
    article_type in ('faq', 'guide', 'troubleshooting', 'policy', 'api_doc', 'release_note', 'onboarding', 'internal_note')
  ),
  status text not null default 'draft' check (
    status in ('draft', 'review', 'published', 'archived')
  ),
  visibility text not null default 'admin_and_support' check (
    visibility in ('public', 'authenticated', 'admin_and_support', 'internal')
  ),
  tags text[] not null default '{}',
  keywords text[] not null default '{}',
  source_path text,
  is_global boolean not null default false,
  priority int not null default 0,
  owner_user_id uuid references public.users (id) on delete set null,
  last_reviewed_at timestamptz,
  review_due_at timestamptz,
  published_at timestamptz,
  created_by_user_id uuid references public.users (id) on delete set null,
  updated_by_user_id uuid references public.users (id) on delete set null,
  search_vector tsvector,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Pilot bootstrap may have created articles without full-text search columns.
alter table public.aipify_knowledge_articles
  add column if not exists review_due_at timestamptz,
  add column if not exists created_by_user_id uuid references public.users (id) on delete set null,
  add column if not exists updated_by_user_id uuid references public.users (id) on delete set null,
  add column if not exists search_vector tsvector;

create unique index if not exists aipify_knowledge_articles_global_slug_lang_idx
  on public.aipify_knowledge_articles (slug, language) where tenant_id is null;
create unique index if not exists aipify_knowledge_articles_tenant_slug_lang_idx
  on public.aipify_knowledge_articles (tenant_id, slug, language) where tenant_id is not null;
create index if not exists aipify_knowledge_articles_search_idx
  on public.aipify_knowledge_articles using gin (search_vector);
create index if not exists aipify_knowledge_articles_status_idx
  on public.aipify_knowledge_articles (status, language);

alter table public.aipify_knowledge_articles enable row level security;
revoke all on public.aipify_knowledge_articles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. aipify_knowledge_article_versions
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_knowledge_article_versions (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.aipify_knowledge_articles (id) on delete cascade,
  tenant_id uuid references public.customers (id) on delete cascade,
  version_number int not null,
  title text not null,
  summary text,
  body text not null,
  language text not null default 'en',
  status text not null,
  change_note text,
  created_by_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (article_id, version_number)
);

alter table public.aipify_knowledge_article_versions enable row level security;
revoke all on public.aipify_knowledge_article_versions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. aipify_knowledge_search_logs
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_knowledge_search_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  actor_type text not null default 'user' check (
    actor_type in ('user', 'aipify', 'admin', 'system')
  ),
  query text not null,
  language text,
  result_count int not null default 0,
  top_article_id uuid references public.aipify_knowledge_articles (id) on delete set null,
  confidence_score numeric(4, 2),
  answered boolean not null default false,
  created_gap boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists aipify_knowledge_search_logs_tenant_idx
  on public.aipify_knowledge_search_logs (tenant_id, created_at desc);

alter table public.aipify_knowledge_search_logs enable row level security;
revoke all on public.aipify_knowledge_search_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. aipify_knowledge_gaps
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_knowledge_gaps (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete cascade,
  question text not null,
  normalized_question text,
  language text,
  source_type text not null default 'support_chat' check (
    source_type in ('support_chat', 'admin_chat', 'onboarding', 'api', 'internal', 'customer_email')
  ),
  source_id text,
  user_id uuid references public.users (id) on delete set null,
  frequency_count int not null default 1,
  confidence_score numeric(4, 2),
  suggested_category_id uuid references public.aipify_knowledge_categories (id) on delete set null,
  suggested_title text,
  suggested_answer_draft text,
  status text not null default 'open' check (
    status in ('open', 'reviewing', 'drafted', 'article_created', 'dismissed', 'merged')
  ),
  assigned_user_id uuid references public.users (id) on delete set null,
  related_article_id uuid references public.aipify_knowledge_articles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aipify_knowledge_gaps_tenant_status_idx
  on public.aipify_knowledge_gaps (tenant_id, status, created_at desc);

alter table public.aipify_knowledge_gaps enable row level security;
revoke all on public.aipify_knowledge_gaps from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. aipify_knowledge_gap_events
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_knowledge_gap_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete cascade,
  gap_id uuid not null references public.aipify_knowledge_gaps (id) on delete cascade,
  question text not null,
  source_type text,
  source_id text,
  user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.aipify_knowledge_gap_events enable row level security;
revoke all on public.aipify_knowledge_gap_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. aipify_knowledge_feedback
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_knowledge_feedback (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete cascade,
  article_id uuid references public.aipify_knowledge_articles (id) on delete set null,
  search_log_id uuid references public.aipify_knowledge_search_logs (id) on delete set null,
  user_id uuid references public.users (id) on delete set null,
  rating int check (rating between 1 and 5),
  helpful boolean,
  feedback_text text,
  created_at timestamptz not null default now()
);

alter table public.aipify_knowledge_feedback enable row level security;
revoke all on public.aipify_knowledge_feedback from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. aipify_knowledge_settings
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_knowledge_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  use_global_knowledge boolean not null default true,
  allow_tenant_articles boolean not null default true,
  allow_ai_gap_drafts boolean not null default true,
  require_review_before_publish boolean not null default true,
  default_language text not null default 'en',
  fallback_language text not null default 'en',
  minimum_answer_confidence numeric(4, 2) not null default 0.65,
  create_gap_below_confidence numeric(4, 2) not null default 0.55,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.aipify_knowledge_settings enable row level security;
revoke all on public.aipify_knowledge_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. aipify_knowledge_audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_knowledge_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete cascade,
  actor_type text not null check (actor_type in ('user', 'admin', 'aipify', 'system')),
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  target_type text,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists aipify_knowledge_audit_log_tenant_idx
  on public.aipify_knowledge_audit_log (tenant_id, created_at desc);

alter table public.aipify_knowledge_audit_log enable row level security;
revoke all on public.aipify_knowledge_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 10. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._kc_tenant_plan(p_tenant_id uuid)
returns text language sql stable security definer set search_path = public as $$
  select coalesce(s.plan_key, s.plan_type, 'starter')
  from public.subscriptions s where s.customer_id = p_tenant_id limit 1;
$$;

create or replace function public._kc_package_allows(p_tenant_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public._kc_tenant_plan(p_tenant_id) in ('growth', 'business', 'enterprise');
$$;

create or replace function public._kc_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select u.id from public.users u where u.auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._kc_user_role()
returns text language sql stable security definer set search_path = public as $$
  select coalesce(u.role, 'staff') from public.users u where u.auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._kc_require_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if public._kc_user_role() not in ('owner', 'admin') then
    raise exception 'Admin access required';
  end if;
end;
$$;

create or replace function public._kc_log_audit(
  p_tenant_id uuid, p_actor_type text, p_action text,
  p_target_type text default null, p_target_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_knowledge_audit_log (
    tenant_id, actor_type, actor_user_id, action, target_type, target_id, metadata
  ) values (
    p_tenant_id, p_actor_type,
    case when p_actor_type in ('user', 'admin') then public._kc_user_id() else null end,
    p_action, p_target_type, p_target_id, coalesce(p_metadata, '{}'::jsonb)
  );
end;
$$;

create or replace function public._kc_refresh_article_search_vector(p_article_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.aipify_knowledge_articles set search_vector =
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(summary, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(keywords, ' '), '')), 'B') ||
    setweight(to_tsvector('english', coalesce(body, '')), 'C')
  where id = p_article_id;
end;
$$;

create or replace function public._kc_normalize_question(p_question text)
returns text language sql immutable as $$
  select lower(trim(regexp_replace(p_question, '[^a-zA-Z0-9 ]', '', 'g')));
$$;

create or replace function public.ensure_kc_knowledge_settings(p_tenant_id uuid)
returns public.aipify_knowledge_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_knowledge_settings;
begin
  insert into public.aipify_knowledge_settings (tenant_id) values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_knowledge_settings where tenant_id = p_tenant_id;
  return v_row;
end;
$$;

create or replace function public._kc_article_json(p_row public.aipify_knowledge_articles)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', a.id, 'slug', a.slug, 'title', a.title, 'summary', a.summary, 'body', a.body,
    'language', a.language, 'article_type', a.article_type, 'status', a.status,
    'visibility', a.visibility, 'tags', a.tags, 'keywords', a.keywords,
    'category_id', a.category_id,
    'category_slug', (select c.slug from public.aipify_knowledge_categories c where c.id = a.category_id),
    'is_global', a.is_global, 'priority', a.priority, 'source_path', a.source_path,
    'published_at', a.published_at, 'updated_at', a.updated_at
  )
  from public.aipify_knowledge_articles a where a.id = p_row.id;
$$;

-- ---------------------------------------------------------------------------
-- 11. Seed categories and starter articles
-- ---------------------------------------------------------------------------
create or replace function public.seed_kc_global_categories()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_knowledge_categories (tenant_id, slug, name, sort_order, visibility)
  values
    (null, 'getting-started', 'Getting Started', 1, 'authenticated'),
    (null, 'faq', 'FAQ', 2, 'authenticated'),
    (null, 'support-ai', 'Support AI', 3, 'admin_and_support'),
    (null, 'automations', 'Automations', 4, 'admin_and_support'),
    (null, 'governance-approvals', 'Governance & Approvals', 5, 'admin_and_support'),
    (null, 'insights', 'Insights', 6, 'admin_and_support'),
    (null, 'predictions', 'Predictions', 7, 'admin_and_support'),
    (null, 'integrations', 'Integrations', 8, 'admin_and_support'),
    (null, 'troubleshooting', 'Troubleshooting', 9, 'admin_and_support'),
    (null, 'privacy-security', 'Privacy & Security', 10, 'authenticated'),
    (null, 'enterprise', 'Enterprise', 11, 'internal'),
    (null, 'api', 'Developer/API', 12, 'internal'),
    (null, 'policies', 'Policies', 13, 'admin_and_support'),
    (null, 'release-notes', 'Release Notes', 14, 'authenticated'),
    (null, 'aipify-itself', 'Aipify Itself', 15, 'authenticated')
  on conflict do nothing;
end;
$$;

create or replace function public.seed_kc_global_articles()
returns void language plpgsql security definer set search_path = public as $$
declare
  v_cat uuid;
  v_id uuid;
begin
  perform public.seed_kc_global_categories();

  -- what-is-aipify
  if not exists (select 1 from public.aipify_knowledge_articles where slug = 'what-is-aipify' and language = 'en' and tenant_id is null) then
    select id into v_cat from public.aipify_knowledge_categories where slug = 'aipify-itself' and tenant_id is null;
    insert into public.aipify_knowledge_articles (
      tenant_id, category_id, slug, title, summary, body, language, article_type, status, visibility,
      tags, keywords, is_global, published_at, source_path
    ) values (
      null, v_cat, 'what-is-aipify', 'What is Aipify?',
      'Overview of the Aipify platform.',
      'Aipify is an AI-powered business operations platform designed to help organizations with support, administration, workflow intelligence, reminders, automation, insights, and decision support.',
      'en', 'faq', 'published', 'authenticated',
      array['aipify','overview','faq'], array['what is aipify','aipify platform'], true, now(),
      'content/knowledge/aipify/faq/aipify-itself.md'
    ) returning id into v_id;
    perform public._kc_refresh_article_search_vector(v_id);
  end if;

  -- is-aipify-a-chatbot
  if not exists (select 1 from public.aipify_knowledge_articles where slug = 'is-aipify-a-chatbot' and language = 'en' and tenant_id is null) then
    select id into v_cat from public.aipify_knowledge_categories where slug = 'faq' and tenant_id is null;
    insert into public.aipify_knowledge_articles (
      tenant_id, category_id, slug, title, body, language, status, visibility, tags, keywords, is_global, published_at, source_path
    ) values (
      null, v_cat, 'is-aipify-a-chatbot', 'Is Aipify just a chatbot?',
      'No. Aipify is designed as an operational intelligence platform. It can assist with support, analyze workflows, identify bottlenecks, suggest automations, and provide business insights.',
      'en', 'published', 'authenticated', array['aipify','chatbot'], array['chatbot'], true, now(),
      'content/knowledge/aipify/faq/general.md'
    ) returning id into v_id;
    perform public._kc_refresh_article_search_vector(v_id);
  end if;

  -- governance articles
  if not exists (select 1 from public.aipify_knowledge_articles where slug = 'can-aipify-act-without-permission' and language = 'en' and tenant_id is null) then
    select id into v_cat from public.aipify_knowledge_categories where slug = 'governance-approvals' and tenant_id is null;
    insert into public.aipify_knowledge_articles (
      tenant_id, category_id, slug, title, body, language, status, visibility, tags, keywords, is_global, published_at, source_path
    ) values (
      null, v_cat, 'can-aipify-act-without-permission', 'Can Aipify perform actions without permission?',
      'Only within the permissions configured by the organization. Medium and high-risk actions require approval according to governance settings.',
      'en', 'published', 'admin_and_support', array['governance','approvals'], array['approval','permission'], true, now(),
      'content/knowledge/aipify/faq/governance-approvals.md'
    ) returning id into v_id;
    perform public._kc_refresh_article_search_vector(v_id);
  end if;

  if not exists (select 1 from public.aipify_knowledge_articles where slug = 'can-aipify-be-paused' and language = 'en' and tenant_id is null) then
    select id into v_cat from public.aipify_knowledge_categories where slug = 'governance-approvals' and tenant_id is null;
    insert into public.aipify_knowledge_articles (
      tenant_id, category_id, slug, title, body, language, status, visibility, tags, keywords, is_global, published_at, source_path
    ) values (
      null, v_cat, 'can-aipify-be-paused', 'Can Aipify be paused?',
      'Yes. Administrators can activate Emergency Stop to pause AI-driven actions, automations, external messages, and scheduled non-critical executions.',
      'en', 'published', 'admin_and_support', array['governance','emergency stop'], array['pause','emergency stop'], true, now(),
      'content/knowledge/aipify/faq/governance-approvals.md'
    ) returning id into v_id;
    perform public._kc_refresh_article_search_vector(v_id);
  end if;

  -- support, automations, insights, predictions, privacy, self-support, getting started
  if not exists (select 1 from public.aipify_knowledge_articles where slug = 'can-aipify-answer-customer-questions' and language = 'en' and tenant_id is null) then
    select id into v_cat from public.aipify_knowledge_categories where slug = 'support-ai' and tenant_id is null;
    insert into public.aipify_knowledge_articles (tenant_id, category_id, slug, title, body, language, status, visibility, is_global, published_at, source_path)
    values (null, v_cat, 'can-aipify-answer-customer-questions', 'Can Aipify answer customer questions?',
      'Yes. Aipify can respond to frequently asked questions, provide guidance, create support drafts, and escalate cases when necessary.',
      'en', 'published', 'admin_and_support', true, now(), 'content/knowledge/aipify/faq/support-ai.md')
    returning id into v_id; perform public._kc_refresh_article_search_vector(v_id);
  end if;

  if not exists (select 1 from public.aipify_knowledge_articles where slug = 'does-aipify-build-automations-automatically' and language = 'en' and tenant_id is null) then
    select id into v_cat from public.aipify_knowledge_categories where slug = 'automations' and tenant_id is null;
    insert into public.aipify_knowledge_articles (tenant_id, category_id, slug, title, body, language, status, visibility, is_global, published_at, source_path)
    values (null, v_cat, 'does-aipify-build-automations-automatically', 'Does Aipify build automations automatically?',
      'Aipify can suggest automation drafts, but automations must be approved before activation according to governance settings.',
      'en', 'published', 'admin_and_support', true, now(), 'content/knowledge/aipify/faq/automations.md')
    returning id into v_id; perform public._kc_refresh_article_search_vector(v_id);
  end if;

  if not exists (select 1 from public.aipify_knowledge_articles where slug = 'what-are-aipify-insights' and language = 'en' and tenant_id is null) then
    select id into v_cat from public.aipify_knowledge_categories where slug = 'insights' and tenant_id is null;
    insert into public.aipify_knowledge_articles (tenant_id, category_id, slug, title, body, language, status, visibility, is_global, published_at, source_path)
    values (null, v_cat, 'what-are-aipify-insights', 'What are Aipify Insights?',
      'Aipify Insights identify trends, bottlenecks, overdue follow-ups, operational risks, and opportunities for improvement.',
      'en', 'published', 'admin_and_support', true, now(), 'content/knowledge/aipify/faq/insights-predictions.md')
    returning id into v_id; perform public._kc_refresh_article_search_vector(v_id);
  end if;

  if not exists (select 1 from public.aipify_knowledge_articles where slug = 'can-aipify-predict-future-problems' and language = 'en' and tenant_id is null) then
    select id into v_cat from public.aipify_knowledge_categories where slug = 'predictions' and tenant_id is null;
    insert into public.aipify_knowledge_articles (tenant_id, category_id, slug, title, body, language, status, visibility, is_global, published_at, source_path)
    values (null, v_cat, 'can-aipify-predict-future-problems', 'Can Aipify predict future problems?',
      'Yes. Aipify can identify emerging risks using historical patterns and operational signals, but predictions are recommendations and not guarantees.',
      'en', 'published', 'admin_and_support', true, now(), 'content/knowledge/aipify/faq/insights-predictions.md')
    returning id into v_id; perform public._kc_refresh_article_search_vector(v_id);
  end if;

  if not exists (select 1 from public.aipify_knowledge_articles where slug = 'who-owns-aipify-data' and language = 'en' and tenant_id is null) then
    select id into v_cat from public.aipify_knowledge_categories where slug = 'privacy-security' and tenant_id is null;
    insert into public.aipify_knowledge_articles (tenant_id, category_id, slug, title, body, language, status, visibility, is_global, published_at, source_path)
    values (null, v_cat, 'who-owns-aipify-data', 'Who owns the data processed by Aipify?',
      'The customer retains ownership of their business data. Aipify is designed with tenant isolation, access control, retention settings, and audit logs.',
      'en', 'published', 'authenticated', true, now(), 'content/knowledge/aipify/faq/privacy-security.md')
    returning id into v_id; perform public._kc_refresh_article_search_vector(v_id);
  end if;

  if not exists (select 1 from public.aipify_knowledge_articles where slug = 'can-aipify-support-itself' and language = 'en' and tenant_id is null) then
    select id into v_cat from public.aipify_knowledge_categories where slug = 'aipify-itself' and tenant_id is null;
    insert into public.aipify_knowledge_articles (tenant_id, category_id, slug, title, body, language, status, visibility, is_global, published_at, source_path)
    values (null, v_cat, 'can-aipify-support-itself', 'Can Aipify support itself?',
      'Yes. Aipify is designed to use its own Knowledge Center to answer questions about setup, features, troubleshooting, policies, and workflows.',
      'en', 'published', 'authenticated', true, now(), 'content/knowledge/aipify/faq/privacy-security.md')
    returning id into v_id; perform public._kc_refresh_article_search_vector(v_id);
  end if;

  if not exists (select 1 from public.aipify_knowledge_articles where slug = 'getting-started-with-aipify' and language = 'en' and tenant_id is null) then
    select id into v_cat from public.aipify_knowledge_categories where slug = 'getting-started' and tenant_id is null;
    insert into public.aipify_knowledge_articles (tenant_id, category_id, slug, title, body, language, article_type, status, visibility, is_global, priority, published_at, source_path)
    values (null, v_cat, 'getting-started-with-aipify', 'Getting Started with Aipify',
      E'1. Complete tenant setup and invite your team.\n2. Configure governance and approval settings.\n3. Enable Support AI and Knowledge Center.\n4. Connect your first integration when ready.\n5. Review Insights and Automation suggestions as activity grows.',
      'en', 'guide', 'published', 'authenticated', true, 10, now(), 'content/knowledge/aipify/guides/getting-started.md')
    returning id into v_id; perform public._kc_refresh_article_search_vector(v_id);
  end if;
end;
$$;

select public.seed_kc_global_categories();
select public.seed_kc_global_articles();

-- ---------------------------------------------------------------------------
-- 12. Search
-- ---------------------------------------------------------------------------
create or replace function public.search_knowledge_articles(
  p_query text,
  p_language text default 'en',
  p_visibility_context text default 'authenticated',
  p_limit int default 10
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_knowledge_settings;
  v_tsquery tsquery;
  v_norm text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is not null then
    v_settings := public.ensure_kc_knowledge_settings(v_tenant_id);
  end if;
  v_norm := lower(trim(p_query));
  v_tsquery := plainto_tsquery('english', p_query);

  return coalesce((
    select jsonb_agg(row_to_json(r) order by r.score desc)
    from (
      select
        a.id, a.slug, a.title, a.summary, a.body, a.language,
        c.slug as category_slug, a.is_global,
        (
          case when lower(a.title) = v_norm then 100 else 0 end +
          case when lower(a.slug) = replace(v_norm, ' ', '-') then 90 else 0 end +
          case when v_norm = any (select lower(unnest(a.keywords))) then 80 else 0 end +
          case when p_query = any (a.tags) then 40 else 0 end +
          coalesce(ts_rank(a.search_vector, v_tsquery) * 50, 0) +
          a.priority
        )::numeric as score
      from public.aipify_knowledge_articles a
      left join public.aipify_knowledge_categories c on c.id = a.category_id
      where a.status = 'published'
        and a.language in (p_language, coalesce(v_settings.fallback_language, 'en'))
        and (
          (v_tenant_id is not null and a.tenant_id = v_tenant_id)
          or (a.tenant_id is null and coalesce(v_settings.use_global_knowledge, true))
          or v_tenant_id is null
        )
        and (
          p_visibility_context = 'internal'
          or (p_visibility_context = 'admin_and_support' and a.visibility in ('public','authenticated','admin_and_support'))
          or (p_visibility_context = 'authenticated' and a.visibility in ('public','authenticated'))
          or (p_visibility_context = 'public' and a.visibility = 'public')
        )
        and (
          lower(a.title) like '%' || v_norm || '%'
          or lower(a.body) like '%' || v_norm || '%'
          or v_norm = any (select lower(unnest(a.keywords)))
          or a.search_vector @@ v_tsquery
        )
      order by score desc
      limit p_limit
    ) r
  ), '[]'::jsonb);
end;
$$;

-- ---------------------------------------------------------------------------
-- 13. Knowledge gaps
-- ---------------------------------------------------------------------------
create or replace function public._kc_upsert_gap(
  p_tenant_id uuid, p_question text, p_language text, p_source_type text,
  p_confidence numeric, p_user_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_norm text;
  v_gap public.aipify_knowledge_gaps;
  v_id uuid;
begin
  v_norm := public._kc_normalize_question(p_question);
  select * into v_gap from public.aipify_knowledge_gaps
  where (tenant_id is not distinct from p_tenant_id)
    and normalized_question = v_norm
    and status in ('open', 'reviewing', 'drafted')
  limit 1;

  if found then
    update public.aipify_knowledge_gaps set
      frequency_count = frequency_count + 1,
      confidence_score = coalesce(p_confidence, confidence_score),
      updated_at = now()
    where id = v_gap.id;
    insert into public.aipify_knowledge_gap_events (tenant_id, gap_id, question, source_type, user_id)
    values (p_tenant_id, v_gap.id, p_question, p_source_type, p_user_id);
    return v_gap.id;
  end if;

  insert into public.aipify_knowledge_gaps (
    tenant_id, question, normalized_question, language, source_type, user_id, confidence_score, suggested_title
  ) values (
    p_tenant_id, p_question, v_norm, p_language, p_source_type, p_user_id, p_confidence, left(p_question, 120)
  ) returning id into v_id;

  insert into public.aipify_knowledge_gap_events (tenant_id, gap_id, question, source_type, user_id)
  values (p_tenant_id, v_id, p_question, p_source_type, p_user_id);

  perform public._kc_log_audit(p_tenant_id, 'aipify', 'gap_created', 'knowledge_gap', v_id,
    jsonb_build_object('question', p_question));
  return v_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- 14. Retrieve answer
-- ---------------------------------------------------------------------------
create or replace function public.retrieve_knowledge_answer(
  p_query text,
  p_language text default 'en',
  p_visibility_context text default 'authenticated',
  p_source_type text default 'admin_chat'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_knowledge_settings;
  v_results jsonb;
  v_top jsonb;
  v_score numeric;
  v_answer text;
  v_gap_id uuid;
  v_log_id uuid;
  v_min numeric;
  v_gap_thresh numeric;
  v_answered boolean := false;
  v_escalate boolean := false;
  v_fallback text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is not null then
    v_settings := public.ensure_kc_knowledge_settings(v_tenant_id);
    if not v_settings.enabled then
      return jsonb_build_object(
        'answer', '', 'confidence_score', 0, 'articles_used', '[]'::jsonb,
        'created_gap_id', null, 'should_escalate', true, 'answered', false,
        'fallback_message', 'Knowledge Center is not enabled for this tenant.'
      );
    end if;
    v_min := v_settings.minimum_answer_confidence;
    v_gap_thresh := v_settings.create_gap_below_confidence;
  else
    v_min := 0.65;
    v_gap_thresh := 0.55;
  end if;

  v_results := public.search_knowledge_articles(p_query, p_language, p_visibility_context, 5);
  v_top := v_results->0;
  v_score := coalesce((v_top->>'score')::numeric / 100.0, 0);

  if v_top is not null and v_score >= v_gap_thresh then
    v_answer := coalesce(v_top->>'summary', '') || E'\n\n' || coalesce(v_top->>'body', '');
    v_answer := trim(v_answer);
    if v_score >= v_min then
      v_answered := true;
      v_answer := v_answer || E'\n\n_Based on current Aipify documentation._';
    else
      v_fallback := 'This answer is based on limited documentation. An admin may need to review.';
      v_escalate := v_score < v_min;
    end if;
  else
    v_fallback := 'Aipify could not find a documented answer to that question yet.';
    v_gap_id := public._kc_upsert_gap(v_tenant_id, p_query, p_language, p_source_type, v_score, public._kc_user_id());
    v_escalate := true;
  end if;

  insert into public.aipify_knowledge_search_logs (
    tenant_id, user_id, actor_type, query, language, result_count,
    top_article_id, confidence_score, answered, created_gap
  ) values (
    v_tenant_id, public._kc_user_id(), 'aipify', p_query, p_language,
    jsonb_array_length(v_results),
    (v_top->>'id')::uuid, v_score, v_answered, v_gap_id is not null
  ) returning id into v_log_id;

  perform public._kc_log_audit(v_tenant_id, 'aipify', 'answer_generated', 'search_log', v_log_id,
    jsonb_build_object('query', p_query, 'confidence', v_score));

  return jsonb_build_object(
    'answer', coalesce(v_answer, ''),
    'confidence_score', v_score,
    'articles_used', v_results,
    'created_gap_id', v_gap_id,
    'should_escalate', v_escalate,
    'fallback_message', v_fallback,
    'answered', v_answered
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 15. Center, settings, articles, gaps
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_knowledge_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_knowledge_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false, 'has_access', false, 'upgrade_required', false, 'enabled', false);
  end if;
  v_settings := public.ensure_kc_knowledge_settings(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'has_access', public._kc_package_allows(v_tenant_id),
    'upgrade_required', not public._kc_package_allows(v_tenant_id),
    'enabled', v_settings.enabled,
    'privacy_note', 'Search Knowledge Center first. Never invent answers about Aipify.',
    'metrics', jsonb_build_object(
      'published_articles', (
        select count(*)::int from public.aipify_knowledge_articles
        where status = 'published' and (tenant_id = v_tenant_id or (tenant_id is null and v_settings.use_global_knowledge))
      ),
      'draft_articles', (
        select count(*)::int from public.aipify_knowledge_articles
        where status = 'draft' and (tenant_id = v_tenant_id or tenant_id is null)
      ),
      'review_articles', (
        select count(*)::int from public.aipify_knowledge_articles
        where status = 'review' and (tenant_id = v_tenant_id or tenant_id is null)
      ),
      'open_gaps', (select count(*)::int from public.aipify_knowledge_gaps where (tenant_id = v_tenant_id or tenant_id is null) and status = 'open'),
      'searches_24h', (select count(*)::int from public.aipify_knowledge_search_logs where tenant_id = v_tenant_id and created_at >= now() - interval '24 hours')
    ),
    'recent_articles', coalesce((
      select jsonb_agg(public._kc_article_json(a) order by a.updated_at desc)
      from (select * from public.aipify_knowledge_articles
        where (tenant_id = v_tenant_id or (tenant_id is null and v_settings.use_global_knowledge))
        order by updated_at desc limit 15) a
    ), '[]'::jsonb),
    'open_gaps', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', g.id, 'question', g.question, 'language', g.language, 'source_type', g.source_type,
        'frequency_count', g.frequency_count, 'confidence_score', g.confidence_score,
        'suggested_title', g.suggested_title, 'suggested_answer_draft', g.suggested_answer_draft,
        'status', g.status, 'related_article_id', g.related_article_id, 'created_at', g.created_at
      ) order by g.frequency_count desc, g.created_at desc)
      from (select * from public.aipify_knowledge_gaps
        where (tenant_id = v_tenant_id or tenant_id is null) and status = 'open' limit 20) g
    ), '[]'::jsonb),
    'top_searches', coalesce((
      select jsonb_agg(jsonb_build_object('query', q.query, 'count', q.cnt))
      from (
        select query, count(*)::int as cnt from public.aipify_knowledge_search_logs
        where tenant_id = v_tenant_id and created_at >= now() - interval '7 days'
        group by query order by cnt desc limit 10
      ) q
    ), '[]'::jsonb)
  );
end;
$$;

create or replace function public.get_knowledge_settings()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_knowledge_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false, 'has_access', false, 'upgrade_required', false);
  end if;
  v_settings := public.ensure_kc_knowledge_settings(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true, 'has_access', public._kc_package_allows(v_tenant_id),
    'upgrade_required', not public._kc_package_allows(v_tenant_id),
    'settings', jsonb_build_object(
      'enabled', v_settings.enabled, 'use_global_knowledge', v_settings.use_global_knowledge,
      'allow_tenant_articles', v_settings.allow_tenant_articles,
      'allow_ai_gap_drafts', v_settings.allow_ai_gap_drafts,
      'require_review_before_publish', v_settings.require_review_before_publish,
      'default_language', v_settings.default_language, 'fallback_language', v_settings.fallback_language,
      'minimum_answer_confidence', v_settings.minimum_answer_confidence,
      'create_gap_below_confidence', v_settings.create_gap_below_confidence
    )
  );
end;
$$;

create or replace function public.update_knowledge_settings(p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;
  if not public._kc_package_allows(v_tenant_id) then raise exception 'Upgrade required'; end if;
  perform public._kc_require_admin();
  perform public.ensure_kc_knowledge_settings(v_tenant_id);
  update public.aipify_knowledge_settings set
    enabled = coalesce((p_patch->>'enabled')::boolean, enabled),
    use_global_knowledge = coalesce((p_patch->>'use_global_knowledge')::boolean, use_global_knowledge),
    allow_tenant_articles = coalesce((p_patch->>'allow_tenant_articles')::boolean, allow_tenant_articles),
    allow_ai_gap_drafts = coalesce((p_patch->>'allow_ai_gap_drafts')::boolean, allow_ai_gap_drafts),
    require_review_before_publish = coalesce((p_patch->>'require_review_before_publish')::boolean, require_review_before_publish),
    default_language = coalesce(p_patch->>'default_language', default_language),
    fallback_language = coalesce(p_patch->>'fallback_language', fallback_language),
    minimum_answer_confidence = coalesce((p_patch->>'minimum_answer_confidence')::numeric, minimum_answer_confidence),
    create_gap_below_confidence = coalesce((p_patch->>'create_gap_below_confidence')::numeric, create_gap_below_confidence),
    updated_at = now()
  where tenant_id = v_tenant_id;
  perform public._kc_log_audit(v_tenant_id, 'admin', 'settings_updated', 'knowledge_settings', null, p_patch);
  return public.get_knowledge_settings();
end;
$$;

create or replace function public.upsert_knowledge_article(p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_id uuid;
  v_row public.aipify_knowledge_articles;
  v_cat uuid;
  v_version int;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;
  perform public._kc_require_admin();

  if p_patch ? 'category_slug' then
    select id into v_cat from public.aipify_knowledge_categories
    where slug = p_patch->>'category_slug' and (tenant_id = v_tenant_id or tenant_id is null)
    order by tenant_id nulls last limit 1;
  end if;

  if p_patch ? 'id' then
    update public.aipify_knowledge_articles set
      title = coalesce(p_patch->>'title', title),
      summary = coalesce(p_patch->>'summary', summary),
      body = coalesce(p_patch->>'body', body),
      category_id = coalesce(v_cat, category_id),
      status = coalesce(p_patch->>'status', status),
      visibility = coalesce(p_patch->>'visibility', visibility),
      tags = coalesce(array(select jsonb_array_elements_text(p_patch->'tags')), tags),
      keywords = coalesce(array(select jsonb_array_elements_text(p_patch->'keywords')), keywords),
      updated_by_user_id = public._kc_user_id(),
      updated_at = now()
    where id = (p_patch->>'id')::uuid
      and (tenant_id = v_tenant_id or (tenant_id is null and public._kc_user_role() in ('owner','admin')))
    returning * into v_row;
  else
    insert into public.aipify_knowledge_articles (
      tenant_id, category_id, slug, title, summary, body, language, article_type,
      status, visibility, tags, keywords, is_global, created_by_user_id, updated_by_user_id
    ) values (
      case when coalesce((p_patch->>'is_global')::boolean, false) then null else v_tenant_id end,
      v_cat, p_patch->>'slug', p_patch->>'title', p_patch->>'summary', p_patch->>'body',
      coalesce(p_patch->>'language', 'en'), coalesce(p_patch->>'article_type', 'faq'),
      coalesce(p_patch->>'status', 'draft'), coalesce(p_patch->>'visibility', 'admin_and_support'),
      coalesce(array(select jsonb_array_elements_text(p_patch->'tags')), '{}'),
      coalesce(array(select jsonb_array_elements_text(p_patch->'keywords')), '{}'),
      coalesce((p_patch->>'is_global')::boolean, false),
      public._kc_user_id(), public._kc_user_id()
    ) returning * into v_row;
  end if;

  if not found then raise exception 'Article not found or not allowed'; end if;
  v_id := v_row.id;
  perform public._kc_refresh_article_search_vector(v_id);

  select coalesce(max(version_number), 0) + 1 into v_version
  from public.aipify_knowledge_article_versions where article_id = v_id;
  insert into public.aipify_knowledge_article_versions (
    article_id, tenant_id, version_number, title, summary, body, language, status, created_by_user_id
  ) values (
    v_id, v_row.tenant_id, v_version, v_row.title, v_row.summary, v_row.body, v_row.language, v_row.status, public._kc_user_id()
  );

  perform public._kc_log_audit(v_tenant_id, 'admin', 'article_updated', 'knowledge_article', v_id, '{}'::jsonb);
  return public._kc_article_json(v_row);
end;
$$;

create or replace function public.publish_knowledge_article(p_article_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_knowledge_articles;
begin
  perform public._kc_require_admin();
  update public.aipify_knowledge_articles set
    status = 'published', published_at = now(), last_reviewed_at = now(), updated_at = now()
  where id = p_article_id returning * into v_row;
  if not found then raise exception 'Article not found'; end if;
  perform public._kc_log_audit(v_row.tenant_id, 'admin', 'article_published', 'knowledge_article', p_article_id, '{}'::jsonb);
  return public._kc_article_json(v_row);
end;
$$;

create or replace function public.update_knowledge_gap_status(p_gap_id uuid, p_status text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_gap public.aipify_knowledge_gaps;
begin
  perform public._kc_require_admin();
  update public.aipify_knowledge_gaps set status = p_status, updated_at = now()
  where id = p_gap_id returning * into v_gap;
  if not found then raise exception 'Gap not found'; end if;
  perform public._kc_log_audit(v_gap.tenant_id, 'admin', 'gap_updated', 'knowledge_gap', p_gap_id,
    jsonb_build_object('status', p_status));
  return jsonb_build_object('id', v_gap.id, 'status', v_gap.status);
end;
$$;

create or replace function public.create_article_from_knowledge_gap(p_gap_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_gap public.aipify_knowledge_gaps;
  v_article public.aipify_knowledge_articles;
  v_id uuid;
  v_slug text;
begin
  perform public._kc_require_admin();
  select * into v_gap from public.aipify_knowledge_gaps where id = p_gap_id;
  if not found then raise exception 'Gap not found'; end if;

  v_slug := regexp_replace(lower(coalesce(v_gap.suggested_title, v_gap.question)), '[^a-z0-9]+', '-', 'g');
  v_slug := trim(both '-' from v_slug);
  v_slug := left(v_slug, 80);

  insert into public.aipify_knowledge_articles (
    tenant_id, slug, title, summary, body, language, status, visibility, is_global, created_by_user_id
  ) values (
    v_gap.tenant_id, v_slug, coalesce(v_gap.suggested_title, v_gap.question), v_gap.question,
    coalesce(v_gap.suggested_answer_draft, 'Draft article created from knowledge gap.'),
    coalesce(v_gap.language, 'en'), 'draft', 'admin_and_support',
    v_gap.tenant_id is null, public._kc_user_id()
  ) returning * into v_article;

  perform public._kc_refresh_article_search_vector(v_article.id);
  update public.aipify_knowledge_gaps set
    status = 'article_created', related_article_id = v_article.id, updated_at = now()
  where id = p_gap_id;

  return public._kc_article_json(v_article);
end;
$$;

create or replace function public.import_knowledge_seed_articles(p_articles jsonb, p_overwrite boolean default false)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_item jsonb;
  v_cat uuid;
  v_id uuid;
  v_count int := 0;
begin
  perform public._kc_require_admin();
  perform public.seed_kc_global_categories();

  for v_item in select * from jsonb_array_elements(p_articles)
  loop
    select id into v_cat from public.aipify_knowledge_categories
    where slug = v_item->>'category' and tenant_id is null limit 1;

    if exists (
      select 1 from public.aipify_knowledge_articles
      where slug = v_item->>'slug' and language = coalesce(v_item->>'language', 'en') and tenant_id is null
    ) then
      if p_overwrite then
        update public.aipify_knowledge_articles set
          title = v_item->>'title', body = v_item->>'body', summary = v_item->>'title',
          category_id = v_cat, status = coalesce(v_item->>'status', 'published'),
          visibility = coalesce(v_item->>'visibility', 'authenticated'),
          source_path = v_item->>'source_path', updated_at = now()
        where slug = v_item->>'slug' and language = coalesce(v_item->>'language', 'en') and tenant_id is null
        returning id into v_id;
        perform public._kc_refresh_article_search_vector(v_id);
        v_count := v_count + 1;
      end if;
      continue;
    end if;

    insert into public.aipify_knowledge_articles (
      tenant_id, category_id, slug, title, summary, body, language, article_type, status, visibility,
      tags, keywords, source_path, is_global, published_at
    ) values (
      null, v_cat, v_item->>'slug', v_item->>'title', v_item->>'title', v_item->>'body',
      coalesce(v_item->>'language', 'en'), coalesce(v_item->>'article_type', 'faq'),
      coalesce(v_item->>'status', 'published'), coalesce(v_item->>'visibility', 'authenticated'),
      coalesce(array(select jsonb_array_elements_text(v_item->'tags')), '{}'),
      coalesce(array(select jsonb_array_elements_text(v_item->'keywords')), '{}'),
      v_item->>'source_path', true,
      case when coalesce(v_item->>'status', 'published') = 'published' then now() else null end
    ) returning id into v_id;
    perform public._kc_refresh_article_search_vector(v_id);
    v_count := v_count + 1;
  end loop;

  perform public._kc_log_audit(null, 'system', 'article_imported', null, null,
    jsonb_build_object('count', v_count));
  return jsonb_build_object('imported', v_count);
end;
$$;

create or replace function public.submit_knowledge_feedback(p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  insert into public.aipify_knowledge_feedback (
    tenant_id, article_id, search_log_id, user_id, rating, helpful, feedback_text
  ) values (
    v_tenant_id, (p_patch->>'article_id')::uuid, (p_patch->>'search_log_id')::uuid,
    public._kc_user_id(), (p_patch->>'rating')::int, (p_patch->>'helpful')::boolean, p_patch->>'feedback_text'
  ) returning id into v_id;
  perform public._kc_log_audit(v_tenant_id, 'user', 'feedback_received', 'knowledge_feedback', v_id, p_patch);
  return jsonb_build_object('feedback_id', v_id);
end;
$$;

-- ---------------------------------------------------------------------------
-- 16. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_customer_knowledge_center() to authenticated;
grant execute on function public.get_knowledge_settings() to authenticated;
grant execute on function public.update_knowledge_settings(jsonb) to authenticated;
grant execute on function public.search_knowledge_articles(text, text, text, int) to authenticated;
grant execute on function public.retrieve_knowledge_answer(text, text, text, text) to authenticated;
grant execute on function public.upsert_knowledge_article(jsonb) to authenticated;
grant execute on function public.publish_knowledge_article(uuid) to authenticated;
grant execute on function public.update_knowledge_gap_status(uuid, text) to authenticated;
grant execute on function public.create_article_from_knowledge_gap(uuid) to authenticated;
grant execute on function public.import_knowledge_seed_articles(jsonb, boolean) to authenticated;
grant execute on function public.submit_knowledge_feedback(jsonb) to authenticated;
