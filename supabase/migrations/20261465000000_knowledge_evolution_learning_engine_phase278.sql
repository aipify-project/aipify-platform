-- Phase 278 — Knowledge Evolution & Learning Engine (Platform Admin)

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.knowledge_evolution_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null default '',
  source text not null default 'internal_documentation' check (
    source in (
      'approved_support_case', 'customer_feedback', 'faq_update', 'product_release',
      'internal_documentation', 'success_playbook', 'growth_partner_insight'
    )
  ),
  workflow_status text not null default 'draft' check (
    workflow_status in ('draft', 'review_required', 'approved', 'published', 'archived')
  ),
  health_status text not null default 'healthy' check (
    health_status in ('excellent', 'healthy', 'needs_review', 'outdated')
  ),
  health_score integer not null default 70 check (health_score between 0 and 100),
  usage_frequency integer not null default 0,
  helpfulness_rating numeric(4, 2) not null default 0,
  resolution_effectiveness numeric(4, 2) not null default 0,
  freshness_score integer not null default 70 check (freshness_score between 0 and 100),
  feedback_sentiment numeric(4, 2) not null default 0,
  owner text not null default '',
  summary text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists knowledge_evolution_articles_health_idx
  on public.knowledge_evolution_articles (health_status, health_score desc);

create index if not exists knowledge_evolution_articles_workflow_idx
  on public.knowledge_evolution_articles (workflow_status, updated_at desc);

create table if not exists public.knowledge_evolution_gaps (
  id uuid primary key default gen_random_uuid(),
  gap_type text not null check (
    gap_type in (
      'unanswered_question', 'repeated_support', 'missing_documentation',
      'outdated_article', 'low_confidence_response'
    )
  ),
  topic text not null,
  message text not null,
  occurrence_count integer not null default 1,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists knowledge_evolution_gaps_open_idx
  on public.knowledge_evolution_gaps (resolved, occurrence_count desc);

create table if not exists public.knowledge_evolution_suggestions (
  id uuid primary key default gen_random_uuid(),
  suggestion_type text not null check (
    suggestion_type in (
      'create_article', 'expand_article', 'update_screenshots',
      'improve_troubleshooting', 'add_localization'
    )
  ),
  title text not null,
  summary text not null default '',
  article_id uuid references public.knowledge_evolution_articles (id) on delete set null,
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists knowledge_evolution_suggestions_open_idx
  on public.knowledge_evolution_suggestions (status, created_at desc);

create table if not exists public.knowledge_evolution_recommendations (
  id uuid primary key default gen_random_uuid(),
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'declined')),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists knowledge_evolution_recommendations_open_idx
  on public.knowledge_evolution_recommendations (status, priority);

create table if not exists public.knowledge_evolution_localizations (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.knowledge_evolution_articles (id) on delete cascade,
  locale text not null check (locale in ('en', 'no', 'sv', 'da')),
  translation_status text not null default 'pending' check (
    translation_status in ('complete', 'pending', 'review_needed')
  ),
  updated_at timestamptz not null default now(),
  unique (article_id, locale)
);

create index if not exists knowledge_evolution_localizations_article_idx
  on public.knowledge_evolution_localizations (article_id);

create table if not exists public.knowledge_evolution_audit_logs (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.knowledge_evolution_articles (id) on delete set null,
  event_type text not null check (
    event_type in (
      'article_created', 'article_updated', 'approval_completed', 'publication_completed',
      'recommendation_accepted', 'recommendation_declined', 'gap_resolved'
    )
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists knowledge_evolution_audit_created_idx
  on public.knowledge_evolution_audit_logs (created_at desc);

alter table public.knowledge_evolution_articles enable row level security;
alter table public.knowledge_evolution_gaps enable row level security;
alter table public.knowledge_evolution_suggestions enable row level security;
alter table public.knowledge_evolution_recommendations enable row level security;
alter table public.knowledge_evolution_localizations enable row level security;
alter table public.knowledge_evolution_audit_logs enable row level security;

revoke all on public.knowledge_evolution_articles from authenticated, anon;
revoke all on public.knowledge_evolution_gaps from authenticated, anon;
revoke all on public.knowledge_evolution_suggestions from authenticated, anon;
revoke all on public.knowledge_evolution_recommendations from authenticated, anon;
revoke all on public.knowledge_evolution_localizations from authenticated, anon;
revoke all on public.knowledge_evolution_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._kel278_require_platform_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;
end;
$$;

create or replace function public._kel278_log_audit(
  p_article_id uuid,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.knowledge_evolution_audit_logs (article_id, event_type, summary, context)
  values (p_article_id, p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end;
$$;

create or replace function public._kel278_health_status(p_score integer)
returns text
language sql
immutable
as $$
  select case
    when p_score >= 90 then 'excellent'
    when p_score >= 75 then 'healthy'
    when p_score >= 55 then 'needs_review'
    else 'outdated'
  end;
$$;

create or replace function public._kel278_compute_health_score(
  p_usage int, p_helpfulness numeric, p_resolution numeric, p_freshness int, p_sentiment numeric
)
returns integer
language sql
immutable
as $$
  select greatest(0, least(100, round(
    (least(p_usage, 100) * 0.2 +
     least(p_helpfulness, 5) / 5.0 * 100 * 0.25 +
     least(p_resolution, 5) / 5.0 * 100 * 0.25 +
     p_freshness * 0.2 +
     ((least(p_sentiment, 5) + 5) / 10.0) * 100 * 0.1)::numeric
  )::int));
$$;

create or replace function public._kel278_build_article_row(p_article public.knowledge_evolution_articles)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_localizations jsonb;
begin
  select coalesce(jsonb_agg(jsonb_build_object(
    'locale', l.locale,
    'translation_status', l.translation_status,
    'updated_at', l.updated_at
  ) order by l.locale), '[]'::jsonb)
  into v_localizations
  from public.knowledge_evolution_localizations l
  where l.article_id = p_article.id;

  return jsonb_build_object(
    'id', p_article.id,
    'title', p_article.title,
    'slug', p_article.slug,
    'source', p_article.source,
    'workflow_status', p_article.workflow_status,
    'health_status', p_article.health_status,
    'health_score', p_article.health_score,
    'usage_frequency', p_article.usage_frequency,
    'helpfulness_rating', p_article.helpfulness_rating,
    'resolution_effectiveness', p_article.resolution_effectiveness,
    'freshness_score', p_article.freshness_score,
    'feedback_sentiment', p_article.feedback_sentiment,
    'owner', p_article.owner,
    'summary', p_article.summary,
    'localizations', v_localizations,
    'created_at', p_article.created_at,
    'updated_at', p_article.updated_at,
    'published_at', p_article.published_at
  );
end;
$$;

create or replace function public._kel278_seed_if_empty()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_article_id uuid;
begin
  if exists (select 1 from public.knowledge_evolution_articles limit 1) then return; end if;

  insert into public.knowledge_evolution_articles (
    title, slug, source, workflow_status, health_score, health_status,
    usage_frequency, helpfulness_rating, resolution_effectiveness, freshness_score,
    feedback_sentiment, owner, summary, published_at
  ) values
    (
      'Install Engine — First Connection Guide', 'install-first-connection', 'internal_documentation',
      'published', 88, 'excellent', 420, 4.6, 4.5, 92, 4.2, 'Knowledge Team',
      'Step-by-step guide for connecting Aipify to customer environments.', now() - interval '10 days'
    ),
    (
      'Billing Grace Period FAQ', 'billing-grace-period', 'faq_update',
      'published', 72, 'healthy', 180, 3.8, 3.9, 65, 3.5, 'Support Ops',
      'Explains the 3-day payment grace period and service pause behavior.', now() - interval '45 days'
    ),
    (
      'Enterprise SSO Troubleshooting', 'enterprise-sso-troubleshooting', 'approved_support_case',
      'review_required', 58, 'needs_review', 95, 3.1, 3.0, 48, 2.8, 'Trust Team',
      'Common SSO configuration issues for enterprise tenants.', null
    ),
    (
      'Customer Journey Analytics Overview', 'customer-journey-analytics', 'product_release',
      'approved', 81, 'healthy', 60, 4.0, 4.1, 88, 4.0, 'Product Team',
      'Platform Admin guide to journey funnel analytics.', null
    );

  select id into v_article_id from public.knowledge_evolution_articles where slug = 'install-first-connection';

  insert into public.knowledge_evolution_localizations (article_id, locale, translation_status)
  select a.id, loc, case when loc = 'en' then 'complete' when loc = 'no' then 'complete' else 'review_needed' end
  from public.knowledge_evolution_articles a
  cross join (values ('en'), ('no'), ('sv'), ('da')) as t(loc)
  where a.slug in ('install-first-connection', 'billing-grace-period');

  insert into public.knowledge_evolution_gaps (gap_type, topic, message, occurrence_count)
  values
    ('repeated_support', 'Payment webhook retries', 'Customers ask about failed webhook retries repeatedly.', 17),
    ('missing_documentation', 'Roadmap Center', 'No published guide for Platform Admin Roadmap Center.', 8),
    ('outdated_article', 'Legacy API endpoints', 'Install API deprecation article references old endpoints.', 12),
    ('low_confidence_response', 'Growth Partner onboarding', 'Assistant confidence below 50% for partner certification steps.', 6),
    ('unanswered_question', 'Release rollback procedure', 'No article covers rollback communication workflow.', 9);

  insert into public.knowledge_evolution_suggestions (suggestion_type, title, summary, status)
  values
    ('create_article', 'Create payment webhook retry article', '17 support cases suggest a dedicated troubleshooting article.', 'open'),
    ('expand_article', 'Expand Enterprise SSO troubleshooting', 'Add session timeout and audit log sections.', 'open'),
    ('update_screenshots', 'Update Install Engine screenshots', 'UI changes in Phase 24 install experience.', 'open'),
    ('improve_troubleshooting', 'Improve grace period troubleshooting steps', 'Low resolution effectiveness on billing FAQ.', 'open'),
    ('add_localization', 'Add Swedish translation for journey analytics', 'Swedish locale marked review_needed.', 'open');

  insert into public.knowledge_evolution_recommendations (recommendation_key, message, priority)
  values
    ('support_repeat_17', 'This support issue has occurred 17 times. Create knowledge article.', 'high'),
    ('low_usefulness_sso', 'Enterprise SSO article has low usefulness ratings. Review content.', 'medium'),
    ('release_docs_277', 'Release Center feature release requires updated documentation.', 'high'),
    ('gap_rollback', 'Release rollback procedure gap detected — create documentation.', 'medium');

  insert into public.knowledge_evolution_audit_logs (event_type, summary)
  values
    ('article_created', 'Knowledge Evolution Center initialized with seed articles.'),
    ('publication_completed', 'Platform knowledge evolution engine ready.');
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Main RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_knowledge_evolution_center(p_filters jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_overview jsonb;
  v_articles jsonb;
  v_gaps jsonb;
  v_suggestions jsonb;
  v_recommendations jsonb;
  v_analytics jsonb;
  v_audit jsonb;
  v_health_filter text;
  v_status_filter text;
  v_source_filter text;
  v_locale_filter text;
begin
  perform public._kel278_require_platform_admin();
  perform public._kel278_seed_if_empty();

  v_health_filter := nullif(p_filters->>'health_status', '');
  v_status_filter := nullif(p_filters->>'workflow_status', '');
  v_source_filter := nullif(p_filters->>'source', '');
  v_locale_filter := nullif(p_filters->>'locale', '');

  v_overview := jsonb_build_object(
    'knowledge_articles', (select count(*)::int from public.knowledge_evolution_articles where workflow_status <> 'archived'),
    'suggested_improvements', (select count(*)::int from public.knowledge_evolution_suggestions where status = 'open'),
    'pending_reviews', (select count(*)::int from public.knowledge_evolution_articles where workflow_status = 'review_required'),
    'recently_updated', (select count(*)::int from public.knowledge_evolution_articles where updated_at >= now() - interval '30 days'),
    'knowledge_gaps', (select count(*)::int from public.knowledge_evolution_gaps where resolved = false),
    'learning_opportunities', (select count(*)::int from public.knowledge_evolution_recommendations where status = 'open')
  );

  select coalesce(jsonb_agg(public._kel278_build_article_row(a) order by a.health_score desc), '[]'::jsonb)
  into v_articles
  from public.knowledge_evolution_articles a
  where (v_health_filter is null or a.health_status = v_health_filter)
    and (v_status_filter is null or a.workflow_status = v_status_filter)
    and (v_source_filter is null or a.source = v_source_filter)
    and (
      v_locale_filter is null or exists (
        select 1 from public.knowledge_evolution_localizations l
        where l.article_id = a.id and l.locale = v_locale_filter
      )
    );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', g.id,
    'gap_type', g.gap_type,
    'topic', g.topic,
    'message', g.message,
    'occurrence_count', g.occurrence_count,
    'created_at', g.created_at
  ) order by g.occurrence_count desc), '[]'::jsonb)
  into v_gaps
  from public.knowledge_evolution_gaps g
  where g.resolved = false;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id,
    'suggestion_type', s.suggestion_type,
    'title', s.title,
    'summary', s.summary,
    'article_id', s.article_id,
    'status', s.status
  ) order by s.created_at desc), '[]'::jsonb)
  into v_suggestions
  from public.knowledge_evolution_suggestions s
  where s.status = 'open';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id,
    'recommendation_key', r.recommendation_key,
    'message', r.message,
    'priority', r.priority,
    'status', r.status
  ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end), '[]'::jsonb)
  into v_recommendations
  from public.knowledge_evolution_recommendations r
  where r.status = 'open';

  v_analytics := jsonb_build_object(
    'most_viewed', coalesce((
      select jsonb_agg(jsonb_build_object('title', title, 'views', usage_frequency) order by usage_frequency desc)
      from (select title, usage_frequency from public.knowledge_evolution_articles order by usage_frequency desc limit 5) mv
    ), '[]'::jsonb),
    'highest_rated', coalesce((
      select jsonb_agg(jsonb_build_object('title', title, 'rating', helpfulness_rating) order by helpfulness_rating desc)
      from (select title, helpfulness_rating from public.knowledge_evolution_articles order by helpfulness_rating desc limit 5) hr
    ), '[]'::jsonb),
    'lowest_rated', coalesce((
      select jsonb_agg(jsonb_build_object('title', title, 'rating', helpfulness_rating) order by helpfulness_rating asc)
      from (select title, helpfulness_rating from public.knowledge_evolution_articles order by helpfulness_rating asc limit 5) lr
    ), '[]'::jsonb),
    'most_requested_topics', coalesce((
      select jsonb_agg(jsonb_build_object('topic', topic, 'count', occurrence_count) order by occurrence_count desc)
      from (select topic, occurrence_count from public.knowledge_evolution_gaps where resolved = false order by occurrence_count desc limit 5) mt
    ), '[]'::jsonb),
    'resolution_contribution_rate', 68.5
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id,
    'article_id', l.article_id,
    'event_type', l.event_type,
    'summary', l.summary,
    'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from (select * from public.knowledge_evolution_audit_logs order by created_at desc limit 40) l;

  return jsonb_build_object(
    'principle', 'Knowledge should improve continuously. Every solved problem is an opportunity to help the next customer faster.',
    'filters', coalesce(p_filters, '{}'::jsonb),
    'overview', v_overview,
    'articles', v_articles,
    'gaps', v_gaps,
    'suggestions', v_suggestions,
    'recommendations', v_recommendations,
    'analytics', v_analytics,
    'audit', v_audit
  );
end;
$$;

create or replace function public.record_knowledge_evolution_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_action text;
  v_article_id uuid;
  v_id uuid;
  v_score integer;
begin
  perform public._kel278_require_platform_admin();

  v_action := p_payload->>'action';
  v_article_id := (p_payload->>'article_id')::uuid;
  v_id := (p_payload->>'id')::uuid;

  case v_action
    when 'create_article' then
      v_score := public._kel278_compute_health_score(10, 3, 3, 80, 3);
      insert into public.knowledge_evolution_articles (
        title, slug, source, workflow_status, health_score, health_status, owner, summary
      ) values (
        coalesce(p_payload->>'title', 'New article'),
        coalesce(p_payload->>'slug', 'new-article'),
        coalesce(p_payload->>'source', 'internal_documentation'),
        'draft',
        v_score,
        public._kel278_health_status(v_score),
        coalesce(p_payload->>'owner', ''),
        coalesce(p_payload->>'summary', '')
      )
      returning id into v_article_id;

      insert into public.knowledge_evolution_localizations (article_id, locale, translation_status)
      select v_article_id, loc, 'pending'
      from (values ('en'), ('no'), ('sv'), ('da')) as t(loc);

      perform public._kel278_log_audit(v_article_id, 'article_created', 'Knowledge article created.', p_payload);

    when 'update_workflow_status' then
      update public.knowledge_evolution_articles set
        workflow_status = coalesce(p_payload->>'workflow_status', workflow_status),
        updated_at = now(),
        published_at = case
          when coalesce(p_payload->>'workflow_status', workflow_status) = 'published' then now()
          else published_at
        end
      where id = v_article_id;
      perform public._kel278_log_audit(
        v_article_id, 'article_updated',
        coalesce(p_payload->>'summary', 'Article workflow status updated.'), p_payload
      );

    when 'approve_article' then
      update public.knowledge_evolution_articles set
        workflow_status = 'approved',
        updated_at = now()
      where id = v_article_id;
      perform public._kel278_log_audit(
        v_article_id, 'approval_completed',
        coalesce(p_payload->>'summary', format('Article approved by %s.', coalesce(p_payload->>'approval_role', 'knowledge_admin'))),
        p_payload
      );

    when 'publish_article' then
      update public.knowledge_evolution_articles set
        workflow_status = 'published',
        published_at = now(),
        updated_at = now()
      where id = v_article_id;
      perform public._kel278_log_audit(
        v_article_id, 'publication_completed',
        coalesce(p_payload->>'summary', 'Article published.'), p_payload
      );

    when 'archive_article' then
      update public.knowledge_evolution_articles set
        workflow_status = 'archived',
        updated_at = now()
      where id = v_article_id;
      perform public._kel278_log_audit(
        v_article_id, 'article_updated',
        'Article archived.', p_payload
      );

    when 'accept_recommendation' then
      update public.knowledge_evolution_recommendations set status = 'accepted' where id = v_id;
      perform public._kel278_log_audit(
        v_article_id, 'recommendation_accepted',
        coalesce(p_payload->>'summary', 'Knowledge recommendation accepted.'), p_payload
      );

    when 'decline_recommendation' then
      update public.knowledge_evolution_recommendations set status = 'declined' where id = v_id;
      perform public._kel278_log_audit(
        v_article_id, 'recommendation_declined',
        coalesce(p_payload->>'summary', 'Knowledge recommendation declined.'), p_payload
      );

    when 'resolve_gap' then
      update public.knowledge_evolution_gaps set resolved = true where id = v_id;
      perform public._kel278_log_audit(
        null, 'gap_resolved',
        coalesce(p_payload->>'summary', 'Knowledge gap marked resolved.'), p_payload
      );

    when 'accept_suggestion' then
      update public.knowledge_evolution_suggestions set status = 'accepted' where id = v_id;
      perform public._kel278_log_audit(
        v_article_id, 'article_updated',
        'Knowledge improvement suggestion accepted.', p_payload
      );

    else
      raise exception 'Invalid action';
  end case;

  return public.get_knowledge_evolution_center(coalesce(p_payload->'filters', '{}'::jsonb));
end;
$$;

grant execute on function public.get_knowledge_evolution_center(jsonb) to authenticated;
grant execute on function public.record_knowledge_evolution_action(jsonb) to authenticated;
