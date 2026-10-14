-- WEBSITE KOMPIS — visitor FAQ install isolation v1
-- Exact task: Website Kompis Public Chain — visitor FAQ isolation Phase 2
-- Feature owner: Aipify Core (SQL) · public ask frozen TS unchanged
--
-- APPROVAL GATE ONLY until owner authorizes apply under the exact task name.
-- Do NOT apply to Staging/Production without that authorization.
--
-- Changes:
-- 1) Count active verified installs by DISTINCT installation_id (aliases ≠ installs)
-- 2) search_tenant_public_visitor_knowledge: exact install match OR
--    (legacy NULL AND tenant has exactly one active verified install)
-- 3) upsert_tenant_public_companion_faq_item: reject foreign/unowned p_install_id
--
-- Not changed: RPC signatures, response shapes, list_* signature (no p_install_id),
-- FAQ row data, domain repair, frozen public-chain TypeScript.

-- ---------------------------------------------------------------------------
-- Helper: active verified install count (installations, not domain aliases)
-- ---------------------------------------------------------------------------
create or replace function public._wpkf_count_active_verified_installs(p_tenant_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select count(distinct cd.installation_id)::integer
      from public.customer_domains cd
      inner join public.installations i on i.id = cd.installation_id
      where cd.customer_id = p_tenant_id
        and cd.verification_status = 'verified'
        and cd.status = 'active'
        and cd.installation_id is not null
        and i.revoked_at is null
        and i.status in ('ready', 'installing', 'active', 'warning')
    ),
    0
  );
$$;

revoke all on function public._wpkf_count_active_verified_installs(uuid) from public, anon, authenticated;

comment on function public._wpkf_count_active_verified_installs(uuid) is
  'Counts distinct active verified Website Kompis installs for a tenant. Domain aliases on the same installation_id count once.';

-- ---------------------------------------------------------------------------
-- Helper: upsert may only attach installs owned by the tenant
-- ---------------------------------------------------------------------------
create or replace function public._wpkf_assert_install_owned_by_tenant(
  p_tenant_id uuid,
  p_install_id uuid
)
returns void
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if p_install_id is null then
    return;
  end if;

  if p_tenant_id is null then
    raise exception 'install_id rejected: missing tenant';
  end if;

  if not exists (
    select 1
    from public.customer_domains cd
    inner join public.installations i on i.id = cd.installation_id
    where cd.customer_id = p_tenant_id
      and cd.installation_id = p_install_id
      and cd.verification_status = 'verified'
      and cd.status = 'active'
      and i.revoked_at is null
      and i.status in ('ready', 'installing', 'active', 'warning')
  ) then
    raise exception 'install_id not owned by tenant or not active/verified';
  end if;
end;
$$;

revoke all on function public._wpkf_assert_install_owned_by_tenant(uuid, uuid) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Visitor search: close NULL-OR-match cross-install bleed
-- Signature + grants unchanged from 20261932500000
-- ---------------------------------------------------------------------------
create or replace function public.search_tenant_public_visitor_knowledge(
  p_install_id uuid default null,
  p_domain text default null,
  p_locale text default 'no',
  p_query text default null,
  p_pathname text default null,
  p_limit integer default 5
)
returns table (
  item_id uuid,
  title text,
  answer text,
  category text,
  content_type text,
  locale text,
  source_url text,
  score numeric,
  matched_reason text
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_query text;
  v_locale text;
  v_limit integer;
  v_pathname text;
  v_tokens text[];
begin
  v_query := lower(trim(coalesce(p_query, '')));
  v_locale := lower(trim(coalesce(nullif(p_locale, ''), 'no')));
  v_limit := least(greatest(coalesce(p_limit, 5), 1), 10);
  v_pathname := lower(trim(coalesce(p_pathname, '')));
  v_tokens := public._wpkf_faq_query_tokens(v_query);

  return query
  with ctx as (
    select c.tenant_id, c.resolved_install_id, c.resolved_domain
    from public._wpkf_resolve_visitor_context(p_install_id, p_domain) c
    where c.tenant_id is not null
      and c.resolved_install_id is not null
    limit 1
  ),
  install_stats as (
    select
      ctx.tenant_id,
      ctx.resolved_install_id,
      ctx.resolved_domain,
      public._wpkf_count_active_verified_installs(ctx.tenant_id) as active_verified_install_count
    from ctx
  ),
  filtered as (
    select
      f.id,
      f.title,
      f.answer,
      f.category,
      f.content_type,
      f.locale,
      f.source_url,
      f.priority,
      f.published_at,
      f.updated_at,
      (
        case when v_query = '' then 1 else 0 end
        + case when v_query <> '' and lower(f.title) like '%' || v_query || '%' then 40 else 0 end
        + case when v_query <> '' and lower(coalesce(f.question, '')) like '%' || v_query || '%' then 30 else 0 end
        + case when v_query <> '' and lower(f.answer) like '%' || v_query || '%' then 20 else 0 end
        + case when v_query <> '' and lower(coalesce(f.category, '')) like '%' || v_query || '%' then 15 else 0 end
        + case
            when v_query <> '' and exists (
              select 1
              from unnest(f.tags) tag
              where lower(tag) like '%' || v_query || '%'
            ) then 25
            else 0
          end
        + case
            when v_query <> '' and lower(f.content_type) like '%' || v_query || '%' then 10
            else 0
          end
        + case
            when v_pathname <> ''
              and f.content_type = 'link'
              and lower(coalesce(f.source_url, '')) like '%' || v_pathname || '%'
            then 10
            else 0
          end
        + coalesce((
            select sum(
              case when lower(f.title) like '%' || tok || '%' then 12 else 0 end
              + case when lower(coalesce(f.question, '')) like '%' || tok || '%' then 10 else 0 end
              + case when lower(f.answer) like '%' || tok || '%' then 8 else 0 end
              + case when lower(coalesce(f.category, '')) like '%' || tok || '%' then 5 else 0 end
              + case when lower(f.content_type) like '%' || tok || '%' then 4 else 0 end
              + case
                  when exists (
                    select 1
                    from unnest(f.tags) tag
                    where lower(tag) like '%' || tok || '%'
                  ) then 6
                  else 0
                end
            )
            from unnest(v_tokens) tok
          ), 0)
      )::numeric as score,
      case
        when v_query = '' then 'priority'
        when lower(f.title) like '%' || v_query || '%' then 'title_match'
        when lower(coalesce(f.question, '')) like '%' || v_query || '%' then 'question_match'
        when lower(f.answer) like '%' || v_query || '%' then 'answer_match'
        when lower(coalesce(f.category, '')) like '%' || v_query || '%' then 'category_match'
        when exists (
          select 1
          from unnest(f.tags) tag
          where lower(tag) like '%' || v_query || '%'
        ) then 'tag_match'
        when lower(f.content_type) like '%' || v_query || '%' then 'content_type_match'
        when v_pathname <> ''
          and f.content_type = 'link'
          and lower(coalesce(f.source_url, '')) like '%' || v_pathname || '%'
        then 'pathname_link_match'
        when exists (
          select 1
          from unnest(v_tokens) tok
          where lower(f.title) like '%' || tok || '%'
            or lower(coalesce(f.question, '')) like '%' || tok || '%'
            or lower(f.answer) like '%' || tok || '%'
            or lower(coalesce(f.category, '')) like '%' || tok || '%'
            or lower(f.content_type) like '%' || tok || '%'
            or exists (
              select 1
              from unnest(f.tags) tag
              where lower(tag) like '%' || tok || '%'
            )
        ) then 'token_match'
        else 'fallback'
      end as matched_reason
    from public.tenant_public_companion_faq_items f
    inner join install_stats s on s.tenant_id = f.tenant_id
    where f.status = 'published'
      and f.public_safe = true
      and f.surface = 'website_kompis'
      and f.locale in (v_locale, 'en')
      and (f.valid_from is null or f.valid_from <= now())
      and (f.valid_until is null or f.valid_until >= now())
      and (
        f.install_id = s.resolved_install_id
        or (
          f.install_id is null
          and s.active_verified_install_count = 1
        )
      )
      and (
        f.domain is null
        or s.resolved_domain is null
        or f.domain = s.resolved_domain
      )
      and (
        v_query = ''
        or lower(f.title) like '%' || v_query || '%'
        or lower(coalesce(f.question, '')) like '%' || v_query || '%'
        or lower(f.answer) like '%' || v_query || '%'
        or lower(coalesce(f.category, '')) like '%' || v_query || '%'
        or lower(f.content_type) like '%' || v_query || '%'
        or exists (
          select 1
          from unnest(f.tags) tag
          where lower(tag) like '%' || v_query || '%'
        )
        or exists (
          select 1
          from unnest(v_tokens) tok
          where lower(f.title) like '%' || tok || '%'
            or lower(coalesce(f.question, '')) like '%' || tok || '%'
            or lower(f.answer) like '%' || tok || '%'
            or lower(coalesce(f.category, '')) like '%' || tok || '%'
            or lower(f.content_type) like '%' || tok || '%'
            or exists (
              select 1
              from unnest(f.tags) tag
              where lower(tag) like '%' || tok || '%'
            )
        )
      )
  )
  select
    filtered.id as item_id,
    filtered.title,
    filtered.answer,
    filtered.category,
    filtered.content_type,
    filtered.locale,
    filtered.source_url,
    filtered.score,
    filtered.matched_reason
  from filtered
  order by
    case when filtered.locale = v_locale then 0 else 1 end,
    filtered.score desc,
    filtered.priority asc,
    filtered.published_at desc nulls last,
    filtered.updated_at desc
  limit v_limit;
end;
$$;

revoke all on function public.search_tenant_public_visitor_knowledge(uuid, text, text, text, text, integer) from public;
grant execute on function public.search_tenant_public_visitor_knowledge(uuid, text, text, text, text, integer) to anon;

-- ---------------------------------------------------------------------------
-- Upsert: validate install ownership (signature unchanged)
-- ---------------------------------------------------------------------------
create or replace function public.upsert_tenant_public_companion_faq_item(
  p_item_id uuid default null,
  p_install_id uuid default null,
  p_domain text default null,
  p_locale text default null,
  p_title text default null,
  p_question text default null,
  p_answer text default null,
  p_category text default null,
  p_content_type text default 'faq',
  p_public_safe boolean default false,
  p_priority integer default 100,
  p_tags text[] default '{}'::text[],
  p_source_url text default null,
  p_valid_from timestamptz default null,
  p_valid_until timestamptz default null,
  p_last_reviewed_at timestamptz default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_row public.tenant_public_companion_faq_items;
  v_old_status text;
  v_domain text;
begin
  v_tenant_id := public._wpkf_require_owner_admin();
  v_user_id := public._wpkf_current_user_id();

  if v_user_id is null then
    raise exception 'User profile not found';
  end if;

  if not public._wpkf_is_valid_content_type(p_content_type) then
    raise exception 'Invalid content_type';
  end if;

  if coalesce(trim(p_locale), '') = ''
    or coalesce(trim(p_title), '') = ''
    or coalesce(trim(p_answer), '') = ''
  then
    raise exception 'locale, title, and answer are required';
  end if;

  if p_valid_until is not null
    and p_valid_from is not null
    and p_valid_until < p_valid_from
  then
    raise exception 'valid_until must be on or after valid_from';
  end if;

  v_domain := public.normalize_domain(p_domain);

  -- Reject cross-tenant / inactive / unverified install attachment
  perform public._wpkf_assert_install_owned_by_tenant(v_tenant_id, p_install_id);

  if p_item_id is null then
    insert into public.tenant_public_companion_faq_items (
      tenant_id,
      install_id,
      domain,
      locale,
      title,
      question,
      answer,
      category,
      content_type,
      status,
      public_safe,
      priority,
      tags,
      source_url,
      valid_from,
      valid_until,
      last_reviewed_at,
      created_by,
      updated_by
    )
    values (
      v_tenant_id,
      p_install_id,
      v_domain,
      trim(p_locale),
      trim(p_title),
      nullif(trim(coalesce(p_question, '')), ''),
      trim(p_answer),
      nullif(trim(coalesce(p_category, '')), ''),
      p_content_type,
      'draft',
      coalesce(p_public_safe, false),
      coalesce(p_priority, 100),
      coalesce(p_tags, '{}'::text[]),
      nullif(trim(coalesce(p_source_url, '')), ''),
      p_valid_from,
      p_valid_until,
      p_last_reviewed_at,
      v_user_id,
      v_user_id
    )
    returning * into v_row;

    perform public._wpkf_record_audit_event(
      v_tenant_id,
      v_row.id,
      'created',
      null,
      v_row.status,
      v_row.locale,
      v_row.install_id,
      v_row.domain,
      jsonb_build_object('content_type', v_row.content_type)
    );

    return jsonb_build_object(
      'id', v_row.id,
      'status', v_row.status,
      'created', true
    );
  end if;

  select * into v_row
  from public.tenant_public_companion_faq_items f
  where f.id = p_item_id
    and f.tenant_id = v_tenant_id
  for update;

  if v_row.id is null then
    raise exception 'FAQ item not found';
  end if;

  if v_row.status = 'archived' then
    raise exception 'Archived items must be restored before editing';
  end if;

  v_old_status := v_row.status;

  update public.tenant_public_companion_faq_items
  set
    install_id = p_install_id,
    domain = v_domain,
    locale = trim(p_locale),
    title = trim(p_title),
    question = nullif(trim(coalesce(p_question, '')), ''),
    answer = trim(p_answer),
    category = nullif(trim(coalesce(p_category, '')), ''),
    content_type = p_content_type,
    public_safe = coalesce(p_public_safe, public_safe),
    priority = coalesce(p_priority, priority),
    tags = coalesce(p_tags, tags),
    source_url = nullif(trim(coalesce(p_source_url, '')), ''),
    valid_from = p_valid_from,
    valid_until = p_valid_until,
    last_reviewed_at = coalesce(p_last_reviewed_at, last_reviewed_at),
    updated_by = v_user_id,
    updated_at = now()
  where id = p_item_id
    and tenant_id = v_tenant_id
  returning * into v_row;

  perform public._wpkf_record_audit_event(
    v_tenant_id,
    v_row.id,
    'updated',
    v_old_status,
    v_row.status,
    v_row.locale,
    v_row.install_id,
    v_row.domain,
    jsonb_build_object('content_type', v_row.content_type)
  );

  return jsonb_build_object(
    'id', v_row.id,
    'status', v_row.status,
    'created', false
  );
end;
$$;

revoke all on function public.upsert_tenant_public_companion_faq_item(uuid, uuid, text, text, text, text, text, text, text, boolean, integer, text[], text, timestamptz, timestamptz, timestamptz) from public, anon;
grant execute on function public.upsert_tenant_public_companion_faq_item(uuid, uuid, text, text, text, text, text, text, text, boolean, integer, text[], text, timestamptz, timestamptz, timestamptz) to authenticated;
