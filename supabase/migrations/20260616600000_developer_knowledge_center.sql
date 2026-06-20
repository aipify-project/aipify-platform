-- Developer Knowledge Center — Assistant prioritization for developer technical questions

-- ---------------------------------------------------------------------------
-- 1. Category-scoped search (boost developers category)
-- ---------------------------------------------------------------------------
create or replace function public.search_knowledge_articles(
  p_query text,
  p_language text default 'en',
  p_visibility_context text default 'authenticated',
  p_limit int default 10,
  p_category_slug text default null
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

-- ---------------------------------------------------------------------------
-- 2. Developer-first retrieval for Aipify Assistant
-- ---------------------------------------------------------------------------
create or replace function public.retrieve_developer_knowledge_answer(
  p_query text,
  p_language text default 'en',
  p_visibility_context text default 'authenticated',
  p_source_type text default 'developer_assistant'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_knowledge_settings;
  v_results jsonb;
  v_fallback_results jsonb;
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
        'fallback_message', 'Knowledge Center is not enabled for this tenant.',
        'developer_knowledge', true
      );
    end if;
    v_min := v_settings.minimum_answer_confidence;
    v_gap_thresh := v_settings.create_gap_below_confidence;
  else
    v_min := 0.65;
    v_gap_thresh := 0.55;
  end if;

  v_results := public.search_knowledge_articles(p_query, p_language, p_visibility_context, 8, 'developers');

  if jsonb_array_length(v_results) = 0 then
    v_fallback_results := public.search_knowledge_articles(p_query, p_language, p_visibility_context, 5, null);
    v_results := v_fallback_results;
  end if;

  v_top := v_results->0;
  v_score := coalesce((v_top->>'score')::numeric / 100.0, 0);

  if v_top is not null and v_score >= v_gap_thresh then
    v_answer := coalesce(v_top->>'summary', '') || E'\n\n' || coalesce(v_top->>'body', '');
    v_answer := trim(v_answer);
    if v_score >= v_min then
      v_answered := true;
      v_answer := v_answer || E'\n\n_Based on the Aipify Developer Knowledge Center. Follow least-privilege permissions and Sandbox restrictions._';
    else
      v_fallback := 'This answer is based on limited developer documentation. Consider reviewing the Developer Portal or submitting a Knowledge Gap.';
      v_escalate := v_score < v_min;
    end if;
  else
    v_fallback := 'Aipify could not find a documented developer answer yet. Check /developers or submit your app manifest for review guidance.';
    v_gap_id := public._kc_upsert_gap(v_tenant_id, p_query, p_language, p_source_type, v_score, public._kc_user_id());
    v_escalate := true;
  end if;

  insert into public.aipify_knowledge_search_logs (
    tenant_id, user_id, actor_type, query, language, result_count,
    top_article_id, confidence_score, answered, created_gap
  ) values (
    v_tenant_id, public._kc_user_id(), 'developer_assistant', p_query, p_language,
    jsonb_array_length(v_results),
    (v_top->>'id')::uuid, v_score, v_answered, v_gap_id is not null
  ) returning id into v_log_id;

  perform public._kc_log_audit(v_tenant_id, 'aipify', 'developer_answer_generated', 'search_log', v_log_id,
    jsonb_build_object('query', p_query, 'confidence', v_score));

  return jsonb_build_object(
    'answer', coalesce(v_answer, ''),
    'confidence_score', v_score,
    'articles_used', v_results,
    'created_gap_id', v_gap_id,
    'should_escalate', v_escalate,
    'fallback_message', v_fallback,
    'answered', v_answered,
    'developer_knowledge', true
  );
end;
$$;

grant execute on function public.search_knowledge_articles(text, text, text, int, text) to authenticated;
grant execute on function public.retrieve_developer_knowledge_answer(text, text, text, text) to authenticated;
