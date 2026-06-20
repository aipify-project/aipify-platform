-- Phase 620 P1 — Knowledge Center read-only GET repair.

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, v.module_key, v.description
from (values
  ('knowledge_center.view', 'View Knowledge Center', null, 'View knowledge articles, categories, and search'),
  ('knowledge_center.manage', 'Manage Knowledge Center', null, 'Create, edit, publish, and manage knowledge content')
) as v(key, label, module_key, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'knowledge_center.view'), ('owner', 'knowledge_center.manage'),
  ('administrator', 'knowledge_center.view'), ('administrator', 'knowledge_center.manage'),
  ('manager', 'knowledge_center.view'), ('manager', 'knowledge_center.manage'),
  ('support_agent', 'knowledge_center.view'), ('support_agent', 'knowledge_center.manage'),
  ('viewer', 'knowledge_center.view')
) as v(role, key) on conflict (organization_id, role, permission_key) do nothing;

insert into public.aipify_knowledge_settings (tenant_id)
select c.id from public.customers c
where not exists (
  select 1 from public.aipify_knowledge_settings s where s.tenant_id = c.id
)
on conflict (tenant_id) do nothing;

create or replace function public._kc_read_knowledge_settings(p_tenant_id uuid)
returns public.aipify_knowledge_settings
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_row public.aipify_knowledge_settings;
begin
  select * into v_row
  from public.aipify_knowledge_settings
  where tenant_id = p_tenant_id;

  if found then
    return v_row;
  end if;

  v_row.id := null;
  v_row.tenant_id := p_tenant_id;
  v_row.enabled := true;
  v_row.use_global_knowledge := true;
  v_row.allow_tenant_articles := true;
  v_row.allow_ai_gap_drafts := true;
  v_row.require_review_before_publish := true;
  v_row.default_language := 'en';
  v_row.fallback_language := 'en';
  v_row.minimum_answer_confidence := 0.65;
  v_row.create_gap_below_confidence := 0.55;
  v_row.created_at := now();
  v_row.updated_at := now();
  return v_row;
end;
$$;

create or replace function public.search_knowledge_articles(
  p_query text,
  p_language text default 'en',
  p_visibility_context text default 'authenticated',
  p_limit int default 10
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_knowledge_settings;
  v_tsquery tsquery;
  v_norm text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is not null then
    if not public.has_organization_permission('knowledge_center.view')
       and not public.has_organization_permission('knowledge_center.manage') then
      raise exception 'Permission denied: knowledge_center.view';
    end if;
    v_settings := public._kc_read_knowledge_settings(v_tenant_id);
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

create or replace function public.get_knowledge_settings()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_knowledge_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false, 'has_access', false, 'upgrade_required', false);
  end if;

  if not public.has_organization_permission('knowledge_center.view')
     and not public.has_organization_permission('knowledge_center.manage') then
    raise exception 'Permission denied: knowledge_center.view';
  end if;

  v_settings := public._kc_read_knowledge_settings(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'has_access', public._kc_package_allows(v_tenant_id),
    'upgrade_required', not public._kc_package_allows(v_tenant_id),
    'settings', jsonb_build_object(
      'enabled', v_settings.enabled,
      'use_global_knowledge', v_settings.use_global_knowledge,
      'allow_tenant_articles', v_settings.allow_tenant_articles,
      'allow_ai_gap_drafts', v_settings.allow_ai_gap_drafts,
      'require_review_before_publish', v_settings.require_review_before_publish,
      'default_language', v_settings.default_language,
      'fallback_language', v_settings.fallback_language,
      'minimum_answer_confidence', v_settings.minimum_answer_confidence,
      'create_gap_below_confidence', v_settings.create_gap_below_confidence
    )
  );
end;
$$;

create or replace function public.get_customer_knowledge_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_knowledge_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false, 'has_access', false, 'upgrade_required', false, 'enabled', false);
  end if;

  if not public.has_organization_permission('knowledge_center.view')
     and not public.has_organization_permission('knowledge_center.manage') then
    raise exception 'Permission denied: knowledge_center.view';
  end if;

  v_settings := public._kc_read_knowledge_settings(v_tenant_id);

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

grant execute on function public._kc_read_knowledge_settings(uuid) to authenticated;
