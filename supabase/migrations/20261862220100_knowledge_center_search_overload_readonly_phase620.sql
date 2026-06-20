-- Phase 620 P1 — Knowledge Center 5-arg search overload read-only repair.

create or replace function public.search_knowledge_articles(
  p_query text,
  p_language text default 'en',
  p_visibility_context text default 'authenticated',
  p_limit int default 10,
  p_category_slug text default null
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
          case when p_category_slug is not null and c.slug = p_category_slug then 35 else 0 end +
          case when p_category_slug is not null and 'developers' = any (a.tags) then 25 else 0 end +
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
          p_category_slug is null
          or c.slug = p_category_slug
          or p_category_slug = any (a.tags)
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
