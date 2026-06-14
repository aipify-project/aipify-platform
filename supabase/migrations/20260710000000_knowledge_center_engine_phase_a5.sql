-- Phase A.5 — Knowledge Center Engine
-- Principle: tenant-owned, approved knowledge powers every AI response.

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
    'multi_store_orchestration', 'aipify_core_platform', 'multi_tenant_architecture',
    'identity_permissions', 'secure_ai_action', 'audit_accountability', 'knowledge_center_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. knowledge_categories (organization-scoped)
-- ---------------------------------------------------------------------------
create table if not exists public.knowledge_categories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  slug text not null,
  name text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create index if not exists knowledge_categories_org_idx
  on public.knowledge_categories (organization_id, sort_order);

alter table public.knowledge_categories enable row level security;
revoke all on public.knowledge_categories from authenticated, anon;

-- Phase 55 bootstrap linked FAQ items to aipify_knowledge_categories; A.5 uses organization-scoped knowledge_categories.
do $$
begin
  if exists (
    select 1 from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    where t.relname = 'knowledge_faq_items'
      and c.conname = 'knowledge_faq_items_category_id_fkey'
      and pg_get_constraintdef(c.oid) like '%aipify_knowledge_categories%'
  ) then
    alter table public.knowledge_faq_items drop constraint knowledge_faq_items_category_id_fkey;
    update public.knowledge_faq_items set category_id = null
    where category_id is not null
      and not exists (
        select 1 from public.knowledge_categories kc where kc.id = knowledge_faq_items.category_id
      );
    alter table public.knowledge_faq_items
      add constraint knowledge_faq_items_category_id_fkey
      foreign key (category_id) references public.knowledge_categories (id) on delete set null;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 2. knowledge_articles (organization-scoped)
-- ---------------------------------------------------------------------------
create table if not exists public.knowledge_articles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  category_id uuid references public.knowledge_categories (id) on delete set null,
  title text not null,
  slug text not null,
  content text not null,
  summary text,
  language text not null default 'en',
  visibility text not null default 'internal' check (
    visibility in ('internal', 'customer', 'public')
  ),
  status text not null default 'draft' check (
    status in ('draft', 'review', 'published', 'archived')
  ),
  version int not null default 1,
  view_count int not null default 0,
  review_due_at timestamptz,
  created_by uuid references public.users (id) on delete set null,
  updated_by uuid references public.users (id) on delete set null,
  published_at timestamptz,
  search_vector tsvector,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug, language)
);

create index if not exists knowledge_articles_org_status_idx
  on public.knowledge_articles (organization_id, status, language);
create index if not exists knowledge_articles_search_idx
  on public.knowledge_articles using gin (search_vector);

alter table public.knowledge_articles enable row level security;
revoke all on public.knowledge_articles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. knowledge_article_revisions (version history)
-- ---------------------------------------------------------------------------
create table if not exists public.knowledge_article_revisions (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.knowledge_articles (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  version_number int not null,
  title text not null,
  content text not null,
  summary text,
  language text not null default 'en',
  status text not null,
  change_note text,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (article_id, version_number)
);

alter table public.knowledge_article_revisions enable row level security;
revoke all on public.knowledge_article_revisions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. knowledge_imports
-- ---------------------------------------------------------------------------
create table if not exists public.knowledge_imports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  imported_by uuid references public.users (id) on delete set null,
  import_type text not null check (import_type in ('text', 'markdown', 'faq', 'support_doc')),
  source_name text,
  item_count int not null default 0,
  status text not null default 'completed' check (status in ('pending', 'completed', 'failed')),
  created_at timestamptz not null default now()
);

alter table public.knowledge_imports enable row level security;
revoke all on public.knowledge_imports from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Extend knowledge_faq_items status for review workflow
-- ---------------------------------------------------------------------------
alter table public.knowledge_faq_items drop constraint if exists knowledge_faq_items_status_check;
alter table public.knowledge_faq_items add constraint knowledge_faq_items_status_check check (
  status in ('draft', 'review', 'published', 'archived')
);

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'knowledge_center', v.description
from (values
  ('knowledge.edit', 'Edit Knowledge', 'Update knowledge articles and FAQs'),
  ('knowledge.review', 'Review Knowledge', 'Review knowledge content before publication'),
  ('knowledge.archive', 'Archive Knowledge', 'Archive knowledge articles and FAQs')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'knowledge.edit'), ('owner', 'knowledge.review'), ('owner', 'knowledge.archive'),
  ('administrator', 'knowledge.edit'), ('administrator', 'knowledge.review'), ('administrator', 'knowledge.archive'),
  ('manager', 'knowledge.edit'), ('manager', 'knowledge.review'),
  ('support_agent', 'knowledge.edit')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Helpers (_kce_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._kce_article_search_vector()
returns trigger language plpgsql as $$
begin
  new.search_vector := to_tsvector(
    'simple',
    coalesce(new.title, '') || ' ' || coalesce(new.summary, '') || ' ' || coalesce(new.content, '')
  );
  new.updated_at := now();
  return new;
end; $$;

drop trigger if exists knowledge_articles_search_vector on public.knowledge_articles;
create trigger knowledge_articles_search_vector
  before insert or update of title, summary, content on public.knowledge_articles
  for each row execute function public._kce_article_search_vector();

create or replace function public._kce_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'knowledge_article',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._kce_seed_categories(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.knowledge_categories (organization_id, slug, name, description, sort_order)
  select p_organization_id, v.slug, v.name, v.description, v.sort_order
  from (values
    ('faq', 'FAQ', 'Frequently asked questions', 1),
    ('support', 'Support', 'Support documentation and guides', 2),
    ('onboarding', 'Onboarding', 'Getting started and onboarding content', 3),
    ('policies', 'Policies', 'Organizational policies and guidelines', 4),
    ('products', 'Products', 'Product information and specifications', 5),
    ('integrations', 'Integrations', 'Integration setup and usage', 6),
    ('troubleshooting', 'Troubleshooting', 'Problem resolution guides', 7),
    ('internal_procedures', 'Internal Procedures', 'Internal team procedures', 8),
    ('training', 'Training', 'Training materials and courses', 9)
  ) as v(slug, name, description, sort_order)
  on conflict (organization_id, slug) do nothing;
end; $$;

create or replace function public._kce_category_id(p_organization_id uuid, p_slug text)
returns uuid language sql stable as $$
  select id from public.knowledge_categories
  where organization_id = p_organization_id and slug = p_slug limit 1;
$$;

create or replace function public._kce_save_revision(p_article public.knowledge_articles, p_change_note text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.knowledge_article_revisions (
    article_id, organization_id, version_number, title, content, summary,
    language, status, change_note, created_by
  ) values (
    p_article.id, p_article.organization_id, p_article.version, p_article.title,
    p_article.content, p_article.summary, p_article.language, p_article.status,
    p_change_note, public._mta_app_user_id()
  )
  on conflict (article_id, version_number) do update set
    title = excluded.title,
    content = excluded.content,
    summary = excluded.summary,
    status = excluded.status,
    change_note = excluded.change_note;
end; $$;

create or replace function public._kce_seed_demo_content(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_cat_faq uuid;
declare v_cat_support uuid;
begin
  perform public._kce_seed_categories(p_organization_id);
  v_cat_faq := public._kce_category_id(p_organization_id, 'faq');
  v_cat_support := public._kce_category_id(p_organization_id, 'support');

  insert into public.knowledge_articles (
    organization_id, category_id, title, slug, content, summary, language,
    visibility, status, version, review_due_at, published_at, view_count
  )
  select p_organization_id, v.category_id, v.title, v.slug, v.content, v.summary, 'en',
    v.visibility, v.status, 1, v.review_due, v.published, v.views
  from (values
    (v_cat_faq, 'Getting Started with Aipify', 'getting-started',
     'Aipify helps your team manage support, knowledge, and AI-assisted workflows in one place.',
     'Quick start guide for new organizations.', 'customer', 'published', null, now() - interval '7 days', 42),
    (v_cat_support, 'How to Reset Your Password', 'reset-password',
     'Navigate to Settings > Security and click Reset Password. Follow the email link to set a new password.',
     'Password reset instructions for team members.', 'customer', 'published', now() + interval '90 days', now() - interval '30 days', 28),
    (v_cat_support, 'Support Escalation Policy', 'escalation-policy',
     'Draft escalation policy pending review. Critical issues escalate to administrators within 4 hours.',
     'Internal escalation workflow.', 'internal', 'review', now() - interval '5 days', null, 0),
    (v_cat_faq, 'Billing FAQ Draft', 'billing-faq-draft',
     'Draft billing FAQ content awaiting publication review.',
     'Billing questions and answers.', 'customer', 'draft', null, null, 0)
  ) as v(category_id, title, slug, content, summary, visibility, status, review_due, published, views)
  where not exists (
    select 1 from public.knowledge_articles a
    where a.organization_id = p_organization_id and a.slug = v.slug
  );

  insert into public.knowledge_faq_items (
    organization_id, category_id, question, answer, slug, visibility, status, language
  )
  select p_organization_id, v_cat_faq, v.q, v.a, v.slug, v.vis, v.status, 'en'
  from (values
    ('What is the Knowledge Center?', 'The trusted information source that powers Aipify responses and guidance.', 'what-is-kc', 'customer', 'published'),
    ('Can AI use unpublished content?', 'No. AI prioritizes approved and published information only.', 'ai-unpublished', 'internal', 'published'),
    ('How do I submit content for review?', 'Create or edit an article, then submit it for review before publication.', 'submit-review', 'internal', 'review')
  ) as v(q, a, slug, vis, status)
  where not exists (
    select 1 from public.knowledge_faq_items f
    where f.organization_id = p_organization_id and f.slug = v.slug
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Article lifecycle RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_organization_knowledge_article(
  p_title text,
  p_slug text,
  p_content text,
  p_category_slug text default 'faq',
  p_summary text default null,
  p_language text default 'en',
  p_visibility text default 'internal'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_article public.knowledge_articles;
  v_category_id uuid;
begin
  perform public._irp_require_permission('knowledge.create');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._kce_seed_categories(v_org_id);
  v_category_id := public._kce_category_id(v_org_id, p_category_slug);

  insert into public.knowledge_articles (
    organization_id, category_id, title, slug, content, summary, language,
    visibility, status, version, created_by, updated_by
  ) values (
    v_org_id, v_category_id, p_title, p_slug, p_content, p_summary, coalesce(p_language, 'en'),
    coalesce(p_visibility, 'internal'), 'draft', 1, v_user_id, v_user_id
  )
  returning * into v_article;

  perform public._kce_save_revision(v_article, 'Initial version');
  perform public._kce_log(v_org_id, 'knowledge_created', 'knowledge_article', v_article.id,
    jsonb_build_object('title', p_title, 'slug', p_slug));

  return jsonb_build_object('id', v_article.id, 'status', v_article.status, 'version', v_article.version);
end; $$;

create or replace function public.submit_knowledge_article_for_review(p_article_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_article public.knowledge_articles;
begin
  perform public._irp_require_permission('knowledge.edit');
  v_org_id := public._mta_require_organization();
  update public.knowledge_articles set status = 'review', updated_by = public._mta_app_user_id()
  where id = p_article_id and organization_id = v_org_id and status in ('draft', 'review')
  returning * into v_article;
  if v_article.id is null then raise exception 'Article not found or not submittable'; end if;
  perform public._kce_log(v_org_id, 'knowledge_updated', 'knowledge_article', v_article.id,
    jsonb_build_object('action', 'submitted_for_review'));
  return jsonb_build_object('id', v_article.id, 'status', 'review');
end; $$;

create or replace function public.publish_organization_knowledge_article(p_article_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_article public.knowledge_articles;
begin
  perform public._irp_require_permission('knowledge.publish');
  v_org_id := public._mta_require_organization();
  update public.knowledge_articles set
    status = 'published', published_at = now(), updated_by = public._mta_app_user_id(),
    review_due_at = coalesce(review_due_at, now() + interval '6 months')
  where id = p_article_id and organization_id = v_org_id and status in ('draft', 'review', 'published')
  returning * into v_article;
  if v_article.id is null then raise exception 'Article not found'; end if;
  perform public._kce_save_revision(v_article, 'Published');
  perform public._kce_log(v_org_id, 'knowledge_published', 'knowledge_article', v_article.id,
    jsonb_build_object('title', v_article.title, 'version', v_article.version));
  return jsonb_build_object('id', v_article.id, 'status', 'published', 'published_at', v_article.published_at);
end; $$;

create or replace function public.archive_organization_knowledge_article(p_article_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_article public.knowledge_articles;
begin
  perform public._irp_require_permission('knowledge.archive');
  v_org_id := public._mta_require_organization();
  update public.knowledge_articles set status = 'archived', updated_by = public._mta_app_user_id()
  where id = p_article_id and organization_id = v_org_id and status <> 'archived'
  returning * into v_article;
  if v_article.id is null then raise exception 'Article not found'; end if;
  perform public._kce_save_revision(v_article, 'Archived');
  perform public._kce_log(v_org_id, 'knowledge_archived', 'knowledge_article', v_article.id,
    jsonb_build_object('title', v_article.title));
  return jsonb_build_object('id', v_article.id, 'status', 'archived');
end; $$;

create or replace function public.update_organization_knowledge_article(
  p_article_id uuid,
  p_title text default null,
  p_content text default null,
  p_summary text default null,
  p_change_note text default 'Content updated'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_article public.knowledge_articles;
begin
  perform public._irp_require_permission('knowledge.edit');
  v_org_id := public._mta_require_organization();
  update public.knowledge_articles set
    title = coalesce(p_title, title),
    content = coalesce(p_content, content),
    summary = coalesce(p_summary, summary),
    version = version + 1,
    updated_by = public._mta_app_user_id(),
    status = case when status = 'published' then 'review' else status end
  where id = p_article_id and organization_id = v_org_id and status <> 'archived'
  returning * into v_article;
  if v_article.id is null then raise exception 'Article not found'; end if;
  perform public._kce_save_revision(v_article, p_change_note);
  perform public._kce_log(v_org_id, 'knowledge_updated', 'knowledge_article', v_article.id,
    jsonb_build_object('title', v_article.title, 'version', v_article.version));
  return jsonb_build_object('id', v_article.id, 'status', v_article.status, 'version', v_article.version);
end; $$;

create or replace function public.rollback_organization_knowledge_article(
  p_article_id uuid,
  p_version_number int
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_article public.knowledge_articles;
  v_revision public.knowledge_article_revisions;
begin
  perform public._irp_require_permission('knowledge.edit');
  v_org_id := public._mta_require_organization();
  select * into v_revision from public.knowledge_article_revisions
  where article_id = p_article_id and organization_id = v_org_id and version_number = p_version_number;
  if v_revision.id is null then raise exception 'Revision not found'; end if;

  update public.knowledge_articles set
    title = v_revision.title,
    content = v_revision.content,
    summary = v_revision.summary,
    language = v_revision.language,
    version = version + 1,
    status = 'review',
    updated_by = public._mta_app_user_id()
  where id = p_article_id and organization_id = v_org_id
  returning * into v_article;

  perform public._kce_save_revision(v_article, 'Rolled back to version ' || p_version_number);
  perform public._kce_log(v_org_id, 'knowledge_updated', 'knowledge_article', v_article.id,
    jsonb_build_object('action', 'rollback', 'from_version', p_version_number, 'new_version', v_article.version));
  return jsonb_build_object('id', v_article.id, 'version', v_article.version, 'status', v_article.status);
end; $$;

-- ---------------------------------------------------------------------------
-- 9. FAQ RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_organization_knowledge_faq(
  p_question text,
  p_answer text,
  p_slug text,
  p_category_slug text default 'faq',
  p_language text default 'en',
  p_visibility text default 'internal'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_id uuid; v_category_id uuid;
begin
  perform public._irp_require_permission('knowledge.create');
  v_org_id := public._mta_require_organization();
  perform public._kce_seed_categories(v_org_id);
  v_category_id := public._kce_category_id(v_org_id, p_category_slug);

  insert into public.knowledge_faq_items (
    organization_id, category_id, question, answer, slug, language, visibility, status,
    created_by, updated_by
  ) values (
    v_org_id, v_category_id, p_question, p_answer, p_slug, coalesce(p_language, 'en'),
    coalesce(p_visibility, 'internal'), 'draft', public._mta_app_user_id(), public._mta_app_user_id()
  ) returning id into v_id;

  perform public._kce_log(v_org_id, 'knowledge_created', 'knowledge_article', v_id,
    jsonb_build_object('type', 'faq', 'question', p_question));
  return jsonb_build_object('id', v_id, 'status', 'draft');
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Search & AI retrieval
-- ---------------------------------------------------------------------------
create or replace function public.search_organization_knowledge(p_filters jsonb default '{}'::jsonb)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_query text := coalesce(p_filters->>'query', '');
  v_tsquery tsquery;
begin
  perform public._irp_require_permission('knowledge.view');
  v_org_id := public._mta_require_organization();

  if length(trim(v_query)) > 0 then
    v_tsquery := plainto_tsquery('simple', v_query);
  end if;

  return coalesce((
    select jsonb_agg(row order by row->>'rank' desc nulls last)
    from (
      select jsonb_build_object(
        'id', a.id, 'title', a.title, 'slug', a.slug, 'summary', a.summary,
        'content', left(a.content, 500), 'language', a.language, 'visibility', a.visibility,
        'status', a.status, 'category_slug', c.slug, 'version', a.version,
        'published_at', a.published_at, 'view_count', a.view_count,
        'rank', case when v_tsquery is not null then ts_rank(a.search_vector, v_tsquery) else 0 end,
        'source_type', 'article'
      ) as row
      from public.knowledge_articles a
      left join public.knowledge_categories c on c.id = a.category_id
      where a.organization_id = v_org_id
        and a.status <> 'archived'
        and (p_filters->>'status' is null or a.status = p_filters->>'status')
        and (p_filters->>'language' is null or a.language = p_filters->>'language')
        and (p_filters->>'category_slug' is null or c.slug = p_filters->>'category_slug')
        and (p_filters->>'visibility' is null or a.visibility = p_filters->>'visibility')
        and (v_tsquery is null or a.search_vector @@ v_tsquery)
      union all
      select jsonb_build_object(
        'id', f.id, 'title', f.question, 'slug', f.slug, 'summary', left(f.answer, 200),
        'content', f.answer, 'language', f.language, 'visibility', f.visibility,
        'status', f.status, 'category_slug', c.slug, 'version', 1,
        'published_at', f.updated_at, 'view_count', 0,
        'rank', case when v_tsquery is not null and f.question ilike '%' || v_query || '%' then 0.5 else 0.1 end,
        'source_type', 'faq'
      )
      from public.knowledge_faq_items f
      left join public.knowledge_categories c on c.id = f.category_id
      where f.organization_id = v_org_id
        and f.status <> 'archived'
        and (p_filters->>'status' is null or f.status = p_filters->>'status')
        and (p_filters->>'language' is null or f.language = p_filters->>'language')
        and (p_filters->>'category_slug' is null or c.slug = p_filters->>'category_slug')
        and (p_filters->>'visibility' is null or f.visibility = p_filters->>'visibility')
        and (v_tsquery is null or f.question ilike '%' || v_query || '%' or f.answer ilike '%' || v_query || '%')
    ) combined
    limit coalesce((p_filters->>'limit')::int, 25)
  ), '[]'::jsonb);
end; $$;

create or replace function public.get_published_knowledge_articles(p_language text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('knowledge.view');
  v_org_id := public._mta_require_organization();
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', a.id, 'title', a.title, 'slug', a.slug, 'summary', a.summary,
      'language', a.language, 'visibility', a.visibility, 'version', a.version,
      'published_at', a.published_at, 'view_count', a.view_count,
      'category_slug', c.slug
    ) order by a.published_at desc nulls last)
    from public.knowledge_articles a
    left join public.knowledge_categories c on c.id = a.category_id
    where a.organization_id = v_org_id and a.status = 'published'
      and (p_language is null or a.language = p_language)
  ), '[]'::jsonb);
end; $$;

create or replace function public.retrieve_knowledge_for_ai(
  p_query text,
  p_language text default 'en',
  p_visibility text default 'internal'
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_results jsonb;
begin
  v_org_id := public._mta_require_organization();

  v_results := public.search_organization_knowledge(jsonb_build_object(
    'query', p_query,
    'language', p_language,
    'status', 'published',
    'visibility', p_visibility,
    'limit', 5
  ));

  return jsonb_build_object(
    'query', p_query,
    'organization_id', v_org_id,
    'sources', coalesce(v_results, '[]'::jsonb),
    'rules_applied', jsonb_build_array(
      'Tenant knowledge searched first',
      'Only published content included',
      'Visibility settings respected',
      'Archived content excluded',
      'Source articles cited internally'
    )
  );
exception when others then
  return jsonb_build_object('query', p_query, 'sources', '[]'::jsonb, 'error', sqlerrm);
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Import
-- ---------------------------------------------------------------------------
create or replace function public.import_organization_knowledge(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_import_id uuid;
  v_item jsonb;
  v_count int := 0;
  v_type text;
  v_slug text;
begin
  perform public._irp_require_permission('knowledge.create');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_type := coalesce(p_payload->>'import_type', 'markdown');
  perform public._kce_seed_categories(v_org_id);

  insert into public.knowledge_imports (organization_id, imported_by, import_type, source_name, status)
  values (v_org_id, v_user_id, v_type, p_payload->>'source_name', 'pending')
  returning id into v_import_id;

  for v_item in select * from jsonb_array_elements(coalesce(p_payload->'items', '[]'::jsonb)) loop
    v_slug := coalesce(v_item->>'slug', lower(regexp_replace(v_item->>'title', '[^a-zA-Z0-9]+', '-', 'g')));
    if coalesce(v_item->>'type', 'article') = 'faq' then
      perform public.create_organization_knowledge_faq(
        v_item->>'question', v_item->>'answer', v_slug,
        coalesce(v_item->>'category_slug', 'faq'),
        coalesce(v_item->>'language', 'en'),
        coalesce(v_item->>'visibility', 'internal')
      );
    else
      perform public.create_organization_knowledge_article(
        v_item->>'title', v_slug, coalesce(v_item->>'content', ''),
        coalesce(v_item->>'category_slug', 'support'),
        v_item->>'summary',
        coalesce(v_item->>'language', 'en'),
        coalesce(v_item->>'visibility', 'internal')
      );
      if coalesce((v_item->>'submit_for_review')::boolean, true) then
        perform public.submit_knowledge_article_for_review(
          (select id from public.knowledge_articles where organization_id = v_org_id and slug = v_slug limit 1)
        );
      end if;
    end if;
    v_count := v_count + 1;
  end loop;

  update public.knowledge_imports set item_count = v_count, status = 'completed' where id = v_import_id;
  perform public._kce_log(v_org_id, 'knowledge_imported', 'organization', v_org_id,
    jsonb_build_object('import_id', v_import_id, 'import_type', v_type, 'item_count', v_count));

  return jsonb_build_object('import_id', v_import_id, 'item_count', v_count, 'status', 'completed');
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_knowledge_center_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('knowledge.view');
  v_org_id := public._mta_require_organization();
  perform public._kce_seed_demo_content(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Trusted, tenant-owned knowledge powers every Aipify response — approved content first, always.',
    'safety_note', 'AI prioritizes published knowledge. Unpublished and archived content is never used for customer-facing responses.',
    'principles', jsonb_build_array(
      'Knowledge must be tenant-aware',
      'Organizations own their knowledge',
      'AI responses prioritize approved content',
      'Knowledge supports versioning',
      'Access respects permissions'
    ),
    'published_articles', (
      select count(*) from public.knowledge_articles
      where organization_id = v_org_id and status = 'published'
    ),
    'drafts_awaiting_review', (
      select count(*) from public.knowledge_articles
      where organization_id = v_org_id and status in ('draft', 'review')
    ),
    'faq_count', (
      select count(*) from public.knowledge_faq_items
      where organization_id = v_org_id and status = 'published'
    ),
    'categories', coalesce((
      select jsonb_agg(jsonb_build_object('slug', c.slug, 'name', c.name, 'description', c.description) order by c.sort_order)
      from public.knowledge_categories c where c.organization_id = v_org_id
    ), '[]'::jsonb),
    'published_list', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title, 'slug', a.slug, 'language', a.language,
        'visibility', a.visibility, 'version', a.version, 'view_count', a.view_count,
        'published_at', a.published_at, 'category_slug', c.slug
      ) order by a.published_at desc nulls last)
      from public.knowledge_articles a
      left join public.knowledge_categories c on c.id = a.category_id
      where a.organization_id = v_org_id and a.status = 'published' limit 10
    ), '[]'::jsonb),
    'awaiting_review', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title, 'slug', a.slug, 'status', a.status, 'version', a.version,
        'updated_at', a.updated_at, 'category_slug', c.slug
      ) order by a.updated_at desc)
      from public.knowledge_articles a
      left join public.knowledge_categories c on c.id = a.category_id
      where a.organization_id = v_org_id and a.status in ('draft', 'review') limit 10
    ), '[]'::jsonb),
    'outdated_alerts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title, 'review_due_at', a.review_due_at, 'status', a.status
      ) order by a.review_due_at asc nulls last)
      from public.knowledge_articles a
      where a.organization_id = v_org_id and a.status = 'published'
        and a.review_due_at is not null and a.review_due_at < now() limit 10
    ), '[]'::jsonb),
    'most_viewed', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title, 'view_count', a.view_count, 'slug', a.slug
      ) order by a.view_count desc)
      from public.knowledge_articles a
      where a.organization_id = v_org_id and a.status = 'published' limit 8
    ), '[]'::jsonb),
    'needs_update', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title, 'review_due_at', a.review_due_at, 'updated_at', a.updated_at
      ) order by a.review_due_at asc nulls last)
      from public.knowledge_articles a
      where a.organization_id = v_org_id and a.status = 'published'
        and (
          (a.review_due_at is not null and a.review_due_at <= now() + interval '30 days')
          or a.updated_at < now() - interval '6 months'
        ) limit 10
    ), '[]'::jsonb),
    'recent_faqs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', f.id, 'question', f.question, 'status', f.status, 'visibility', f.visibility
      ) order by f.updated_at desc)
      from public.knowledge_faq_items f
      where f.organization_id = v_org_id limit 8
    ), '[]'::jsonb),
    'import_formats', jsonb_build_array('text', 'markdown', 'faq', 'support_doc')
  );
end; $$;

create or replace function public.get_knowledge_center_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'has_organization', true,
    'published_articles', (select count(*) from public.knowledge_articles where organization_id = v_org_id and status = 'published'),
    'drafts_awaiting_review', (select count(*) from public.knowledge_articles where organization_id = v_org_id and status in ('draft', 'review')),
    'philosophy', 'Trusted knowledge for every AI response.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- Update audit should-audit list
create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_connected', 'integration_removed', 'settings_updated',
    'organization_provisioned', 'organization_switched', 'approval_submitted', 'approval_approved', 'approval_rejected',
    'audit_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._kce_seed_demo_content(v_org_id);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 13. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'knowledge-center-engine', 'Knowledge Center Engine', 'Tenant-owned knowledge infrastructure powering Support AI and Admin Assistant.', 'authenticated', 55
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'knowledge-center-engine' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 14. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.create_organization_knowledge_article(text, text, text, text, text, text, text) to authenticated;
grant execute on function public.update_organization_knowledge_article(uuid, text, text, text, text) to authenticated;
grant execute on function public.submit_knowledge_article_for_review(uuid) to authenticated;
grant execute on function public.publish_organization_knowledge_article(uuid) to authenticated;
grant execute on function public.archive_organization_knowledge_article(uuid) to authenticated;
grant execute on function public.rollback_organization_knowledge_article(uuid, int) to authenticated;
grant execute on function public.create_organization_knowledge_faq(text, text, text, text, text, text) to authenticated;
grant execute on function public.search_organization_knowledge(jsonb) to authenticated;
grant execute on function public.get_published_knowledge_articles(text) to authenticated;
grant execute on function public.retrieve_knowledge_for_ai(text, text, text) to authenticated;
grant execute on function public.import_organization_knowledge(jsonb) to authenticated;
grant execute on function public.get_knowledge_center_engine_dashboard() to authenticated;
grant execute on function public.get_knowledge_center_engine_card() to authenticated;
