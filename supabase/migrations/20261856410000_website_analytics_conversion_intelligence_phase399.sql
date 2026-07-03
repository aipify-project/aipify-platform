-- Phase 399 — Website Analytics, Conversion Intelligence & Growth Insights Engine
-- Metadata-only marketing events. No email, chat, or PII.

create table if not exists public.marketing_website_events (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  event_type text not null,
  page_path text,
  previous_path text,
  cta_label text,
  scroll_depth integer,
  content_type text,
  funnel_stage text,
  lead_source text,
  campaign_source text,
  locale text,
  metadata jsonb not null default '{}'::jsonb,
  recorded_at timestamptz not null default now(),
  constraint marketing_website_events_event_type_check check (
    event_type in (
      'page_view',
      'page_exit',
      'scroll_depth',
      'cta_click',
      'cta_view',
      'navigation',
      'early_access_submit',
      'book_demo_submit',
      'growth_partner_signup',
      'knowledge_view',
      'business_pack_view',
      'demo_step_view',
      'conversion'
    )
  )
);

create index if not exists marketing_website_events_recorded_at_idx
  on public.marketing_website_events (recorded_at desc);

create index if not exists marketing_website_events_event_type_idx
  on public.marketing_website_events (event_type, recorded_at desc);

create index if not exists marketing_website_events_page_path_idx
  on public.marketing_website_events (page_path, recorded_at desc);

create index if not exists marketing_website_events_session_idx
  on public.marketing_website_events (session_id, recorded_at desc);

alter table public.marketing_website_events enable row level security;
revoke all on public.marketing_website_events from authenticated, anon;

create or replace function public._mkt399_forbidden_metadata_keys()
returns text[]
language sql
immutable
as $$
  select array[
    'email', 'name', 'phone', 'address', 'message', 'password',
    'full_name', 'company_name', 'ip', 'ip_address', 'user_agent'
  ];
$$;

create or replace function public._mkt399_sanitize_metadata(p_metadata jsonb)
returns jsonb
language plpgsql
immutable
as $$
declare
  k text;
  cleaned jsonb := '{}'::jsonb;
begin
  if p_metadata is null or p_metadata = 'null'::jsonb then
    return '{}'::jsonb;
  end if;

  for k in select jsonb_object_keys(p_metadata)
  loop
    if k = any (public._mkt399_forbidden_metadata_keys()) then
      continue;
    end if;
    cleaned := cleaned || jsonb_build_object(k, p_metadata -> k);
  end loop;

  return cleaned;
end;
$$;

create or replace function public.record_marketing_website_event(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event_type text := nullif(trim(p_payload->>'event_type'), '');
  v_session_id text := nullif(trim(p_payload->>'session_id'), '');
begin
  if v_event_type is null then
    raise exception 'event_type required';
  end if;

  if v_session_id is null or length(v_session_id) < 8 or length(v_session_id) > 128 then
    raise exception 'Invalid session_id';
  end if;

  insert into public.marketing_website_events (
    session_id,
    event_type,
    page_path,
    previous_path,
    cta_label,
    scroll_depth,
    content_type,
    funnel_stage,
    lead_source,
    campaign_source,
    locale,
    metadata
  ) values (
    v_session_id,
    v_event_type,
    nullif(left(p_payload->>'page_path', 512), ''),
    nullif(left(p_payload->>'previous_path', 512), ''),
    nullif(left(p_payload->>'cta_label', 256), ''),
    nullif(p_payload->>'scroll_depth', '')::integer,
    nullif(left(p_payload->>'content_type', 64), ''),
    nullif(left(p_payload->>'funnel_stage', 64), ''),
    nullif(left(p_payload->>'lead_source', 64), ''),
    nullif(left(p_payload->>'campaign_source', 128), ''),
    nullif(left(p_payload->>'locale', 8), ''),
    public._mkt399_sanitize_metadata(coalesce(p_payload->'metadata', '{}'::jsonb))
  );

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.record_marketing_website_event(jsonb) from public;
grant execute on function public.record_marketing_website_event(jsonb) to anon, authenticated, service_role;

create or replace function public.get_platform_website_intelligence(p_section text default 'overview')
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_section text := coalesce(nullif(trim(p_section), ''), 'overview');
  v_since timestamptz := now() - interval '30 days';
  v_overview jsonb;
  v_funnel jsonb;
  v_ctas jsonb;
  v_content jsonb;
  v_sources jsonb;
  v_demos jsonb;
  v_partners jsonb;
  v_gaps jsonb;
  v_advisor jsonb;
  v_heatmap jsonb;
  v_reports jsonb;
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  select jsonb_build_object(
    'visitors', (select count(distinct session_id) from public.marketing_website_events where recorded_at >= v_since),
    'page_views', (select count(*) from public.marketing_website_events where event_type = 'page_view' and recorded_at >= v_since),
    'conversions', (select count(*) from public.marketing_website_events where event_type in ('book_demo_submit', 'early_access_submit', 'growth_partner_signup', 'conversion') and recorded_at >= v_since),
    'demo_requests', (select count(*) from public.marketing_website_events where event_type = 'book_demo_submit' and recorded_at >= v_since),
    'partner_applications', (select count(*) from public.marketing_website_events where event_type = 'growth_partner_signup' and recorded_at >= v_since),
    'organic_sessions', (select count(distinct session_id) from public.marketing_website_events where lead_source = 'organic' and recorded_at >= v_since)
  ) into v_overview;

  select jsonb_build_object(
    'stages', jsonb_build_array(
      jsonb_build_object('stage', 'visitor', 'count', (select count(distinct session_id) from public.marketing_website_events where recorded_at >= v_since), 'rate', 100),
      jsonb_build_object('stage', 'product_page', 'count', (select count(distinct session_id) from public.marketing_website_events where page_path like '/product%' and recorded_at >= v_since),
        'rate', case when (select count(distinct session_id) from public.marketing_website_events where recorded_at >= v_since) > 0
          then round(100.0 * (select count(distinct session_id) from public.marketing_website_events where page_path like '/product%' and recorded_at >= v_since)
            / (select count(distinct session_id) from public.marketing_website_events where recorded_at >= v_since), 1) else 0 end),
      jsonb_build_object('stage', 'business_pack', 'count', (select count(distinct session_id) from public.marketing_website_events where page_path like '/business-packs%' and recorded_at >= v_since),
        'rate', case when (select count(distinct session_id) from public.marketing_website_events where recorded_at >= v_since) > 0
          then round(100.0 * (select count(distinct session_id) from public.marketing_website_events where page_path like '/business-packs%' and recorded_at >= v_since)
            / (select count(distinct session_id) from public.marketing_website_events where recorded_at >= v_since), 1) else 0 end),
      jsonb_build_object('stage', 'demo_page', 'count', (select count(distinct session_id) from public.marketing_website_events where page_path like '/book-demo%' and recorded_at >= v_since),
        'rate', case when (select count(distinct session_id) from public.marketing_website_events where recorded_at >= v_since) > 0
          then round(100.0 * (select count(distinct session_id) from public.marketing_website_events where page_path like '/book-demo%' and recorded_at >= v_since)
            / (select count(distinct session_id) from public.marketing_website_events where recorded_at >= v_since), 1) else 0 end),
      jsonb_build_object('stage', 'form_submission', 'count', (select count(distinct session_id) from public.marketing_website_events where event_type in ('book_demo_submit', 'early_access_submit', 'growth_partner_signup') and recorded_at >= v_since),
        'rate', case when (select count(distinct session_id) from public.marketing_website_events where recorded_at >= v_since) > 0
          then round(100.0 * (select count(distinct session_id) from public.marketing_website_events where event_type in ('book_demo_submit', 'early_access_submit', 'growth_partner_signup') and recorded_at >= v_since)
            / (select count(distinct session_id) from public.marketing_website_events where recorded_at >= v_since), 1) else 0 end),
      jsonb_build_object('stage', 'qualified_lead', 'count', (select count(*) from public.marketing_website_events where event_type = 'conversion' and coalesce(metadata->>'qualified', 'false') = 'true' and recorded_at >= v_since),
        'rate', case when (select count(*) from public.marketing_website_events where event_type in ('book_demo_submit', 'early_access_submit', 'growth_partner_signup') and recorded_at >= v_since) > 0
          then round(100.0 * (select count(*) from public.marketing_website_events where event_type = 'conversion' and coalesce(metadata->>'qualified', 'false') = 'true' and recorded_at >= v_since)
            / (select count(*) from public.marketing_website_events where event_type in ('book_demo_submit', 'early_access_submit', 'growth_partner_signup') and recorded_at >= v_since), 1) else 0 end)
    )
  ) into v_funnel;

  select coalesce(jsonb_agg(row order by (row->>'clicks')::int desc), '[]'::jsonb)
  into v_ctas
  from (
    select jsonb_build_object(
      'label', coalesce(cta_label, 'unknown'),
      'views', count(*) filter (where event_type = 'cta_view'),
      'clicks', count(*) filter (where event_type = 'cta_click'),
      'conversion_rate', case
        when count(*) filter (where event_type = 'cta_view') > 0
          then round(100.0 * count(*) filter (where event_type = 'cta_click') / count(*) filter (where event_type = 'cta_view'), 1)
        when count(*) filter (where event_type = 'cta_click') > 0 then 100.0
        else 0
      end
    ) as row
    from public.marketing_website_events
    where recorded_at >= v_since
      and event_type in ('cta_click', 'cta_view')
      and cta_label is not null
    group by cta_label
    limit 20
  ) s;

  select coalesce(jsonb_agg(row order by (row->>'views')::int desc), '[]'::jsonb)
  into v_content
  from (
    select jsonb_build_object(
      'content_type', coalesce(content_type, 'general'),
      'views', count(*) filter (where event_type = 'page_view'),
      'engagement_events', count(*) filter (where event_type in ('scroll_depth', 'cta_click')),
      'conversions', count(*) filter (where event_type in ('book_demo_submit', 'early_access_submit', 'growth_partner_signup', 'conversion'))
    ) as row
    from public.marketing_website_events
    where recorded_at >= v_since
    group by coalesce(content_type, 'general')
  ) s;

  select coalesce(jsonb_agg(row order by (row->>'sessions')::int desc), '[]'::jsonb)
  into v_sources
  from (
    select jsonb_build_object(
      'source', coalesce(lead_source, 'direct'),
      'sessions', count(distinct session_id),
      'conversions', count(*) filter (where event_type in ('book_demo_submit', 'early_access_submit', 'growth_partner_signup', 'conversion'))
    ) as row
    from public.marketing_website_events
    where recorded_at >= v_since
    group by coalesce(lead_source, 'direct')
  ) s;

  select jsonb_build_object(
    'total_requests', (select count(*) from public.marketing_website_events where event_type = 'book_demo_submit' and recorded_at >= v_since),
    'by_industry', coalesce((
      select jsonb_agg(jsonb_build_object('industry', industry, 'count', cnt))
      from (
        select coalesce(metadata->>'industry', 'unspecified') as industry, count(*) as cnt
        from public.marketing_website_events
        where event_type = 'book_demo_submit' and recorded_at >= v_since
        group by 1
        order by cnt desc
        limit 10
      ) x
    ), '[]'::jsonb),
    'by_country', coalesce((
      select jsonb_agg(jsonb_build_object('country', country, 'count', cnt))
      from (
        select coalesce(metadata->>'country', 'unspecified') as country, count(*) as cnt
        from public.marketing_website_events
        where event_type = 'book_demo_submit' and recorded_at >= v_since
        group by 1
        order by cnt desc
        limit 10
      ) x
    ), '[]'::jsonb),
    'by_pack_interest', coalesce((
      select jsonb_agg(jsonb_build_object('pack', pack, 'count', cnt))
      from (
        select coalesce(metadata->>'business_pack_interest', 'unspecified') as pack, count(*) as cnt
        from public.marketing_website_events
        where event_type = 'book_demo_submit' and recorded_at >= v_since
        group by 1
        order by cnt desc
        limit 10
      ) x
    ), '[]'::jsonb)
  ) into v_demos;

  select jsonb_build_object(
    'applications', (select count(*) from public.marketing_website_events where event_type = 'growth_partner_signup' and recorded_at >= v_since),
    'by_country', coalesce((
      select jsonb_agg(jsonb_build_object('country', country, 'count', cnt))
      from (
        select coalesce(metadata->>'country', 'unspecified') as country, count(*) as cnt
        from public.marketing_website_events
        where event_type = 'growth_partner_signup' and recorded_at >= v_since
        group by 1
        order by cnt desc
        limit 10
      ) x
    ), '[]'::jsonb)
  ) into v_partners;

  select coalesce(jsonb_agg(row), '[]'::jsonb)
  into v_gaps
  from (
    select jsonb_build_object(
      'page_path', page_path,
      'exit_events', count(*) filter (where event_type = 'page_exit'),
      'views', count(*) filter (where event_type = 'page_view'),
      'exit_rate', case when count(*) filter (where event_type = 'page_view') > 0
        then round(100.0 * count(*) filter (where event_type = 'page_exit') / count(*) filter (where event_type = 'page_view'), 1)
        else 0 end
    ) as row
    from public.marketing_website_events
    where recorded_at >= v_since and page_path is not null
    group by page_path
    having count(*) filter (where event_type = 'page_view') >= 3
    order by case when count(*) filter (where event_type = 'page_view') > 0
      then count(*) filter (where event_type = 'page_exit')::numeric / count(*) filter (where event_type = 'page_view') else 0 end desc
    limit 8
  ) s;

  v_advisor := jsonb_build_array(
    jsonb_build_object(
      'question', 'Which pages convert best?',
      'recommendation', coalesce(
        (select 'Top converter: ' || page_path || ' (' || count(*)::text || ' conversions)'
         from public.marketing_website_events
         where event_type in ('book_demo_submit', 'early_access_submit', 'growth_partner_signup', 'conversion')
           and page_path is not null and recorded_at >= v_since
         group by page_path order by count(*) desc limit 1),
        'Insufficient conversion data — promote Book Demo and Get Started CTAs on high-traffic pages.'
      ),
      'priority', 'high'
    ),
    jsonb_build_object(
      'question', 'Which pages lose visitors?',
      'recommendation', 'Review high-exit pages in the Content Gaps section and improve clarity, CTAs, and next steps.',
      'priority', 'medium'
    ),
    jsonb_build_object(
      'question', 'What content should we create?',
      'recommendation', 'Expand Knowledge Center articles for Business Operating System, Companion differentiation, and industry hubs with weak engagement.',
      'priority', 'medium'
    ),
    jsonb_build_object(
      'question', 'Which Business Pack attracts attention?',
      'recommendation', coalesce(
        (select 'Most viewed: ' || page_path
         from public.marketing_website_events
         where content_type = 'business_pack' and page_path is not null and recorded_at >= v_since
         group by page_path order by count(*) desc limit 1),
        'Drive traffic to /business-packs/* landing pages from industry hubs.'
      ),
      'priority', 'high'
    )
  );

  v_heatmap := jsonb_build_object(
    'click_heatmaps', jsonb_build_object('status', 'architecture_ready', 'provider', 'optional'),
    'scroll_heatmaps', jsonb_build_object('status', 'architecture_ready', 'provider', 'optional'),
    'attention_maps', jsonb_build_object('status', 'architecture_ready', 'provider', 'optional'),
    'session_recordings', jsonb_build_object('status', 'architecture_ready', 'provider', 'optional'),
    'privacy_note', 'Heatmap providers must respect Aipify privacy standards — no keystroke or PII capture.'
  );

  v_reports := jsonb_build_object(
    'available', jsonb_build_array(
      'weekly_website',
      'monthly_growth',
      'quarterly_conversion',
      'partner_acquisition',
      'seo_performance',
      'board_summary'
    ),
    'optimization_rule', 'Never redesign based on opinions alone. Use data, behavior, conversions, engagement, and feedback.'
  );

  return jsonb_build_object(
    'section', v_section,
    'privacy_note', 'Aggregates only — marketing website events store metadata, not customer PII or conversation content.',
    'period_days', 30,
    'overview', v_overview,
    'traffic', jsonb_build_object(
      'top_pages', coalesce((
        select jsonb_agg(jsonb_build_object('page_path', page_path, 'views', cnt))
        from (
          select page_path, count(*) as cnt
          from public.marketing_website_events
          where event_type = 'page_view' and page_path is not null and recorded_at >= v_since
          group by page_path order by cnt desc limit 15
        ) t
      ), '[]'::jsonb),
      'landing_pages', coalesce((
        select jsonb_agg(jsonb_build_object('page_path', page_path, 'sessions', cnt))
        from (
          select page_path, count(distinct session_id) as cnt
          from public.marketing_website_events
          where event_type = 'page_view' and page_path is not null and recorded_at >= v_since
          group by page_path order by cnt desc limit 10
        ) t
      ), '[]'::jsonb),
      'exit_pages', v_gaps
    ),
    'conversions', jsonb_build_object(
      'total', v_overview->'conversions',
      'demo_requests', v_overview->'demo_requests',
      'partner_applications', v_overview->'partner_applications'
    ),
    'funnels', v_funnel,
    'ctas', v_ctas,
    'content', v_content,
    'partners', v_partners,
    'campaigns', coalesce((
      select jsonb_agg(jsonb_build_object('campaign', campaign_source, 'events', cnt))
      from (
        select coalesce(campaign_source, 'none') as campaign_source, count(*) as cnt
        from public.marketing_website_events
        where recorded_at >= v_since and campaign_source is not null
        group by 1 order by cnt desc limit 15
      ) c
    ), '[]'::jsonb),
    'lead_sources', v_sources,
    'demos', v_demos,
    'content_gaps', v_gaps,
    'companion_advisor', v_advisor,
    'heatmap', v_heatmap,
    'reports', v_reports,
    'growth_loop', jsonb_build_array('traffic', 'engagement', 'conversion', 'customer', 'feedback', 'improvement', 'more_traffic', 'more_conversions')
  );
end;
$$;

revoke all on function public.get_platform_website_intelligence(text) from public;
grant execute on function public.get_platform_website_intelligence(text) to authenticated, service_role;
