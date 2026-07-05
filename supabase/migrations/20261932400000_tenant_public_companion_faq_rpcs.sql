-- PUBLIC.KOMPIS.FAQ.01E — Website Kompis FAQ admin RPCs + public-safe visitor search
-- Feature owner: Customer App (admin) · Install Engine (public read)
-- Builds on: 20261932300000_tenant_public_companion_faq.sql

-- ---------------------------------------------------------------------------
-- 0. Internal helpers
-- ---------------------------------------------------------------------------
create or replace function public._wpkf_require_owner_admin()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  if not public._wpkf_auth_is_owner_admin() then
    raise exception 'Owner or admin role required';
  end if;

  v_tenant_id := public._wpkf_auth_tenant_id();
  if v_tenant_id is null then
    raise exception 'No tenant context';
  end if;

  return v_tenant_id;
end;
$$;

create or replace function public._wpkf_current_user_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select u.id
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;
$$;

create or replace function public._wpkf_record_audit_event(
  p_tenant_id uuid,
  p_item_id uuid,
  p_action text,
  p_old_status text default null,
  p_new_status text default null,
  p_locale text default null,
  p_install_id uuid default null,
  p_domain text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.tenant_public_companion_faq_audit_events (
    tenant_id,
    item_id,
    action,
    old_status,
    new_status,
    actor_user_id,
    locale,
    install_id,
    domain,
    metadata
  )
  values (
    p_tenant_id,
    p_item_id,
    p_action,
    p_old_status,
    p_new_status,
    public._wpkf_current_user_id(),
    p_locale,
    p_install_id,
    p_domain,
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_id;

  return v_id;
end;
$$;

create or replace function public._wpkf_resolve_visitor_context(
  p_install_id uuid,
  p_domain text
)
returns table (
  tenant_id uuid,
  resolved_install_id uuid,
  resolved_domain text
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_domain text;
  v_tenant_id uuid;
  v_install_id uuid;
  v_install public.installations;
begin
  v_domain := public.normalize_domain(p_domain);

  if p_install_id is not null then
    select * into v_install
    from public.installations i
    where i.id = p_install_id
      and i.revoked_at is null
      and i.status in ('ready', 'installing', 'active', 'warning')
    limit 1;

    if v_install.id is null then
      return;
    end if;

    v_tenant_id := coalesce(
      v_install.customer_id,
      (
        select c.id
        from public.customers c
        where c.company_id = v_install.company_id
        limit 1
      )
    );

    if v_tenant_id is null then
      return;
    end if;

    if v_domain is null and v_install.site_url is not null then
      v_domain := public.normalize_domain(v_install.site_url);
    end if;

    if v_domain is not null then
      if not exists (
        select 1
        from public.customer_domains cd
        where cd.customer_id = v_tenant_id
          and cd.domain = v_domain
          and cd.verification_status = 'verified'
          and cd.status = 'active'
          and (cd.installation_id is null or cd.installation_id = p_install_id)
      ) then
        return;
      end if;
    end if;

    tenant_id := v_tenant_id;
    resolved_install_id := v_install.id;
    resolved_domain := v_domain;
    return next;
    return;
  end if;

  if v_domain is not null then
    select cd.customer_id, cd.installation_id
    into v_tenant_id, v_install_id
    from public.customer_domains cd
    where cd.domain = v_domain
      and cd.verification_status = 'verified'
      and cd.status = 'active'
    limit 1;

    if v_tenant_id is null then
      return;
    end if;

    tenant_id := v_tenant_id;
    resolved_install_id := v_install_id;
    resolved_domain := v_domain;
    return next;
  end if;

  return;
end;
$$;

create or replace function public._wpkf_is_valid_content_type(p_content_type text)
returns boolean
language sql
immutable
set search_path = public
as $$
  select coalesce(p_content_type, '') in (
    'faq',
    'opening_hours',
    'holiday_notice',
    'contact',
    'policy',
    'product_info',
    'service_info',
    'link'
  );
$$;

revoke all on function public._wpkf_require_owner_admin() from public, anon;
revoke all on function public._wpkf_current_user_id() from public, anon;
revoke all on function public._wpkf_record_audit_event(uuid, uuid, text, text, text, text, uuid, text, jsonb) from public, anon;
revoke all on function public._wpkf_resolve_visitor_context(uuid, text) from public, anon;
revoke all on function public._wpkf_is_valid_content_type(text) from public, anon;

grant execute on function public._wpkf_require_owner_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- 1. list_tenant_public_companion_faq_items
-- ---------------------------------------------------------------------------
create or replace function public.list_tenant_public_companion_faq_items(
  p_status text default null,
  p_locale text default null,
  p_content_type text default null,
  p_query text default null,
  p_limit integer default 100,
  p_offset integer default 0
)
returns table (
  id uuid,
  tenant_id uuid,
  install_id uuid,
  domain text,
  locale text,
  title text,
  question text,
  answer text,
  category text,
  content_type text,
  status text,
  public_safe boolean,
  surface text,
  priority integer,
  tags text[],
  source_url text,
  valid_from timestamptz,
  valid_until timestamptz,
  last_reviewed_at timestamptz,
  published_at timestamptz,
  published_by uuid,
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz,
  archived_by uuid,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_query text;
  v_limit integer;
  v_offset integer;
begin
  v_tenant_id := public._wpkf_require_owner_admin();
  v_query := lower(trim(coalesce(p_query, '')));
  v_limit := least(greatest(coalesce(p_limit, 100), 1), 500);
  v_offset := greatest(coalesce(p_offset, 0), 0);

  return query
  select
    f.id,
    f.tenant_id,
    f.install_id,
    f.domain,
    f.locale,
    f.title,
    f.question,
    f.answer,
    f.category,
    f.content_type,
    f.status,
    f.public_safe,
    f.surface,
    f.priority,
    f.tags,
    f.source_url,
    f.valid_from,
    f.valid_until,
    f.last_reviewed_at,
    f.published_at,
    f.published_by,
    f.created_by,
    f.updated_by,
    f.archived_at,
    f.archived_by,
    f.created_at,
    f.updated_at
  from public.tenant_public_companion_faq_items f
  where f.tenant_id = v_tenant_id
    and (p_status is null or f.status = p_status)
    and (p_locale is null or f.locale = p_locale)
    and (p_content_type is null or f.content_type = p_content_type)
    and (
      v_query = ''
      or lower(f.title) like '%' || v_query || '%'
      or lower(coalesce(f.question, '')) like '%' || v_query || '%'
      or lower(f.answer) like '%' || v_query || '%'
      or lower(coalesce(f.category, '')) like '%' || v_query || '%'
      or exists (
        select 1
        from unnest(f.tags) tag
        where lower(tag) like '%' || v_query || '%'
      )
    )
  order by f.updated_at desc, f.priority asc, f.created_at desc
  limit v_limit
  offset v_offset;
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. upsert_tenant_public_companion_faq_item
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

-- ---------------------------------------------------------------------------
-- 3. publish_tenant_public_companion_faq_item
-- ---------------------------------------------------------------------------
create or replace function public.publish_tenant_public_companion_faq_item(p_item_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_row public.tenant_public_companion_faq_items;
begin
  v_tenant_id := public._wpkf_require_owner_admin();
  v_user_id := public._wpkf_current_user_id();

  select * into v_row
  from public.tenant_public_companion_faq_items f
  where f.id = p_item_id
    and f.tenant_id = v_tenant_id
  for update;

  if v_row.id is null then
    raise exception 'FAQ item not found';
  end if;

  if v_row.status <> 'draft' then
    raise exception 'Only draft items can be published';
  end if;

  if v_row.public_safe is distinct from true then
    raise exception 'public_safe must be true before publish';
  end if;

  if coalesce(trim(v_row.locale), '') = ''
    or coalesce(trim(v_row.title), '') = ''
    or coalesce(trim(v_row.answer), '') = ''
    or not public._wpkf_is_valid_content_type(v_row.content_type)
  then
    raise exception 'Missing required publish fields';
  end if;

  if v_row.valid_until is not null and v_row.valid_until < now() then
    raise exception 'Cannot publish expired item';
  end if;

  update public.tenant_public_companion_faq_items
  set
    status = 'published',
    published_at = now(),
    published_by = v_user_id,
    archived_at = null,
    archived_by = null,
    updated_by = v_user_id,
    updated_at = now()
  where id = p_item_id
    and tenant_id = v_tenant_id
  returning * into v_row;

  perform public._wpkf_record_audit_event(
    v_tenant_id,
    v_row.id,
    'published',
    'draft',
    'published',
    v_row.locale,
    v_row.install_id,
    v_row.domain
  );

  return jsonb_build_object('id', v_row.id, 'status', v_row.status, 'published_at', v_row.published_at);
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. unpublish_tenant_public_companion_faq_item
-- ---------------------------------------------------------------------------
create or replace function public.unpublish_tenant_public_companion_faq_item(p_item_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_row public.tenant_public_companion_faq_items;
begin
  v_tenant_id := public._wpkf_require_owner_admin();
  v_user_id := public._wpkf_current_user_id();

  select * into v_row
  from public.tenant_public_companion_faq_items f
  where f.id = p_item_id
    and f.tenant_id = v_tenant_id
  for update;

  if v_row.id is null then
    raise exception 'FAQ item not found';
  end if;

  if v_row.status <> 'published' then
    raise exception 'Only published items can be unpublished';
  end if;

  update public.tenant_public_companion_faq_items
  set
    status = 'draft',
    updated_by = v_user_id,
    updated_at = now()
  where id = p_item_id
    and tenant_id = v_tenant_id
  returning * into v_row;

  perform public._wpkf_record_audit_event(
    v_tenant_id,
    v_row.id,
    'unpublished',
    'published',
    'draft',
    v_row.locale,
    v_row.install_id,
    v_row.domain
  );

  return jsonb_build_object('id', v_row.id, 'status', v_row.status);
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. archive_tenant_public_companion_faq_item
-- ---------------------------------------------------------------------------
create or replace function public.archive_tenant_public_companion_faq_item(p_item_id uuid)
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
begin
  v_tenant_id := public._wpkf_require_owner_admin();
  v_user_id := public._wpkf_current_user_id();

  select * into v_row
  from public.tenant_public_companion_faq_items f
  where f.id = p_item_id
    and f.tenant_id = v_tenant_id
  for update;

  if v_row.id is null then
    raise exception 'FAQ item not found';
  end if;

  if v_row.status = 'archived' then
    raise exception 'Item is already archived';
  end if;

  v_old_status := v_row.status;

  update public.tenant_public_companion_faq_items
  set
    status = 'archived',
    archived_at = now(),
    archived_by = v_user_id,
    updated_by = v_user_id,
    updated_at = now()
  where id = p_item_id
    and tenant_id = v_tenant_id
  returning * into v_row;

  perform public._wpkf_record_audit_event(
    v_tenant_id,
    v_row.id,
    'archived',
    v_old_status,
    'archived',
    v_row.locale,
    v_row.install_id,
    v_row.domain
  );

  return jsonb_build_object('id', v_row.id, 'status', v_row.status, 'archived_at', v_row.archived_at);
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. restore_tenant_public_companion_faq_item
-- ---------------------------------------------------------------------------
create or replace function public.restore_tenant_public_companion_faq_item(p_item_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_row public.tenant_public_companion_faq_items;
begin
  v_tenant_id := public._wpkf_require_owner_admin();
  v_user_id := public._wpkf_current_user_id();

  select * into v_row
  from public.tenant_public_companion_faq_items f
  where f.id = p_item_id
    and f.tenant_id = v_tenant_id
  for update;

  if v_row.id is null then
    raise exception 'FAQ item not found';
  end if;

  if v_row.status <> 'archived' then
    raise exception 'Only archived items can be restored';
  end if;

  update public.tenant_public_companion_faq_items
  set
    status = 'draft',
    archived_at = null,
    archived_by = null,
    updated_by = v_user_id,
    updated_at = now()
  where id = p_item_id
    and tenant_id = v_tenant_id
  returning * into v_row;

  perform public._wpkf_record_audit_event(
    v_tenant_id,
    v_row.id,
    'restored',
    'archived',
    'draft',
    v_row.locale,
    v_row.install_id,
    v_row.domain
  );

  return jsonb_build_object('id', v_row.id, 'status', v_row.status);
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. search_tenant_public_visitor_knowledge (anon-safe public read)
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
begin
  v_query := lower(trim(coalesce(p_query, '')));
  v_locale := lower(trim(coalesce(nullif(p_locale, ''), 'no')));
  v_limit := least(greatest(coalesce(p_limit, 5), 1), 10);
  v_pathname := lower(trim(coalesce(p_pathname, '')));

  return query
  with ctx as (
    select c.tenant_id, c.resolved_install_id, c.resolved_domain
    from public._wpkf_resolve_visitor_context(p_install_id, p_domain) c
    limit 1
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
            when v_pathname <> ''
              and f.content_type = 'link'
              and lower(coalesce(f.source_url, '')) like '%' || v_pathname || '%'
            then 10
            else 0
          end
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
        when v_pathname <> ''
          and f.content_type = 'link'
          and lower(coalesce(f.source_url, '')) like '%' || v_pathname || '%'
        then 'pathname_link_match'
        else 'fallback'
      end as matched_reason
    from public.tenant_public_companion_faq_items f
    inner join ctx on ctx.tenant_id = f.tenant_id
    where f.status = 'published'
      and f.public_safe = true
      and f.surface = 'website_kompis'
      and f.locale in (v_locale, 'en')
      and (f.valid_from is null or f.valid_from <= now())
      and (f.valid_until is null or f.valid_until >= now())
      and (f.install_id is null or f.install_id = ctx.resolved_install_id)
      and (
        f.domain is null
        or ctx.resolved_domain is null
        or f.domain = ctx.resolved_domain
      )
      and (
        v_query = ''
        or lower(f.title) like '%' || v_query || '%'
        or lower(coalesce(f.question, '')) like '%' || v_query || '%'
        or lower(f.answer) like '%' || v_query || '%'
        or lower(coalesce(f.category, '')) like '%' || v_query || '%'
        or exists (
          select 1
          from unnest(f.tags) tag
          where lower(tag) like '%' || v_query || '%'
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

-- ---------------------------------------------------------------------------
-- 8. Grants
-- ---------------------------------------------------------------------------
revoke all on function public.list_tenant_public_companion_faq_items(text, text, text, text, integer, integer) from public, anon;
revoke all on function public.upsert_tenant_public_companion_faq_item(uuid, uuid, text, text, text, text, text, text, text, boolean, integer, text[], text, timestamptz, timestamptz, timestamptz) from public, anon;
revoke all on function public.publish_tenant_public_companion_faq_item(uuid) from public, anon;
revoke all on function public.unpublish_tenant_public_companion_faq_item(uuid) from public, anon;
revoke all on function public.archive_tenant_public_companion_faq_item(uuid) from public, anon;
revoke all on function public.restore_tenant_public_companion_faq_item(uuid) from public, anon;
revoke all on function public.search_tenant_public_visitor_knowledge(uuid, text, text, text, text, integer) from public;

grant execute on function public.list_tenant_public_companion_faq_items(text, text, text, text, integer, integer) to authenticated;
grant execute on function public.upsert_tenant_public_companion_faq_item(uuid, uuid, text, text, text, text, text, text, text, boolean, integer, text[], text, timestamptz, timestamptz, timestamptz) to authenticated;
grant execute on function public.publish_tenant_public_companion_faq_item(uuid) to authenticated;
grant execute on function public.unpublish_tenant_public_companion_faq_item(uuid) to authenticated;
grant execute on function public.archive_tenant_public_companion_faq_item(uuid) to authenticated;
grant execute on function public.restore_tenant_public_companion_faq_item(uuid) to authenticated;

grant execute on function public.search_tenant_public_visitor_knowledge(uuid, text, text, text, text, integer) to anon;
