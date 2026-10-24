-- NOT APPLIED
-- Feature owner: CUSTOMER APP / Kompis Web
-- Purpose: FAQ language families plus an explicit owner/admin link of one existing translation.
-- Apply this file only, after a separate owner approval of its SHA256.
-- Do not also apply docs/platform/NOT_APPLIED_website_kompis_faq_locale_family_v1.sql
-- (SHA256 94ca3a6d7b01b03c804af42f17153c15c9e1afea38643ff2acc4e5a5ecae687f) after this file.
-- Existing rows are NOT paired. Each unlinked row becomes its own family (translation_group_id = id).
-- This file does not change title, question, answer, locale, status, public_safe, or source_url.
-- A link updates only translation_group_id, and only for a singleton row the owner confirms.
-- A candidate that already has another live language version is refused. It is not moved.

alter table public.tenant_public_companion_faq_items
  add column if not exists translation_group_id uuid;

update public.tenant_public_companion_faq_items
set translation_group_id = id
where translation_group_id is null;

alter table public.tenant_public_companion_faq_items
  alter column translation_group_id set not null;

create or replace function public._wpkf_assign_faq_locale_family()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.translation_group_id is null then
    new.translation_group_id := new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists wpkf_items_assign_locale_family on public.tenant_public_companion_faq_items;
create trigger wpkf_items_assign_locale_family
  before insert on public.tenant_public_companion_faq_items
  for each row
  execute function public._wpkf_assign_faq_locale_family();

create or replace function public._wpkf_guard_faq_locale_family()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.locale is distinct from old.locale then
    raise exception 'FAQ locale is immutable; create a language version instead';
  end if;
  if new.translation_group_id is distinct from old.translation_group_id
     and current_setting('wpkf.faq_family_link', true) is distinct from '1' then
    raise exception 'FAQ language family cannot be reassigned';
  end if;
  if new.tenant_id is distinct from old.tenant_id then
    raise exception 'FAQ tenant cannot change';
  end if;
  if new.title is distinct from old.title
     or new.question is distinct from old.question
     or new.answer is distinct from old.answer
     or new.source_url is distinct from old.source_url
     or new.status is distinct from old.status
     or new.public_safe is distinct from old.public_safe then
    if current_setting('wpkf.faq_family_link', true) = '1' then
      raise exception 'FAQ link cannot change content';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists wpkf_items_guard_locale_family on public.tenant_public_companion_faq_items;
create trigger wpkf_items_guard_locale_family
  before update on public.tenant_public_companion_faq_items
  for each row
  execute function public._wpkf_guard_faq_locale_family();

create unique index if not exists wpkf_items_locale_family_install_uidx
  on public.tenant_public_companion_faq_items (tenant_id, install_id, translation_group_id, lower(locale))
  where install_id is not null and status <> 'archived';

create unique index if not exists wpkf_items_locale_family_legacy_uidx
  on public.tenant_public_companion_faq_items (tenant_id, coalesce(domain, ''), translation_group_id, lower(locale))
  where install_id is null and status <> 'archived';

create or replace function public._wpkf_faq_same_website(
  p_left_install uuid,
  p_left_domain text,
  p_right_install uuid,
  p_right_domain text
)
returns boolean
language sql
immutable
set search_path = public
as $$
  select case
    when p_left_install is not null or p_right_install is not null
      then p_left_install is not null and p_left_install = p_right_install
    else coalesce(p_left_domain, '') = coalesce(p_right_domain, '')
  end;
$$;

create or replace function public.get_tenant_public_companion_faq_locale_version(
  p_item_id uuid,
  p_locale text
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant uuid;
  v_source public.tenant_public_companion_faq_items;
  v_locale text;
  v_match public.tenant_public_companion_faq_items;
  v_count bigint;
begin
  v_tenant := public._wpkf_require_owner_admin();
  v_locale := lower(trim(coalesce(p_locale, '')));
  if v_locale = '' then
    raise exception 'locale is required';
  end if;

  select * into v_source
  from public.tenant_public_companion_faq_items f
  where f.id = p_item_id
    and f.tenant_id = v_tenant;

  if v_source.id is null then
    raise exception 'FAQ item not found';
  end if;

  if v_source.translation_group_id is null then
    return jsonb_build_object('outcome', 'unlinked');
  end if;

  select count(*) into v_count
  from public.tenant_public_companion_faq_items f
  where f.tenant_id = v_tenant
    and f.translation_group_id = v_source.translation_group_id
    and lower(f.locale) = v_locale
    and f.status <> 'archived'
    and public._wpkf_faq_same_website(v_source.install_id, v_source.domain, f.install_id, f.domain);

  if v_count > 1 then
    return jsonb_build_object('outcome', 'ambiguous');
  end if;

  select * into v_match
  from public.tenant_public_companion_faq_items f
  where f.tenant_id = v_tenant
    and f.translation_group_id = v_source.translation_group_id
    and lower(f.locale) = v_locale
    and f.status <> 'archived'
    and public._wpkf_faq_same_website(v_source.install_id, v_source.domain, f.install_id, f.domain);

  if v_match.id is null then
    return jsonb_build_object(
      'outcome', 'missing',
      'source_item_id', v_source.id,
      'translation_group_id', v_source.translation_group_id
    );
  end if;

  return jsonb_build_object('outcome', 'found', 'item', to_jsonb(v_match));
end;
$$;

create or replace function public.insert_tenant_public_companion_faq_locale_version(
  p_source_item_id uuid,
  p_locale text,
  p_title text,
  p_question text,
  p_answer text,
  p_category text default null,
  p_content_type text default null,
  p_priority integer default null,
  p_tags text[] default '{}'::text[],
  p_source_url text default null,
  p_valid_from timestamptz default null,
  p_valid_until timestamptz default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant uuid;
  v_user uuid;
  v_source public.tenant_public_companion_faq_items;
  v_locale text;
  v_existing uuid;
  v_row public.tenant_public_companion_faq_items;
  v_content_type text;
begin
  v_tenant := public._wpkf_require_owner_admin();
  v_user := public._wpkf_current_user_id();
  if v_user is null then
    raise exception 'User profile not found';
  end if;

  v_locale := lower(trim(coalesce(p_locale, '')));
  if v_locale = '' or coalesce(trim(p_title), '') = '' or coalesce(trim(p_answer), '') = '' then
    raise exception 'locale, title, and answer are required';
  end if;

  select * into v_source
  from public.tenant_public_companion_faq_items f
  where f.id = p_source_item_id
    and f.tenant_id = v_tenant
  for update;

  if v_source.id is null then
    raise exception 'FAQ item not found';
  end if;
  if v_source.translation_group_id is null then
    raise exception 'FAQ language family is not linked';
  end if;

  select f.id into v_existing
  from public.tenant_public_companion_faq_items f
  where f.tenant_id = v_tenant
    and f.translation_group_id = v_source.translation_group_id
    and lower(f.locale) = v_locale
    and f.status <> 'archived'
    and public._wpkf_faq_same_website(v_source.install_id, v_source.domain, f.install_id, f.domain);

  if v_existing is not null then
    raise exception 'FAQ language version already exists';
  end if;

  v_content_type := coalesce(nullif(trim(coalesce(p_content_type, '')), ''), v_source.content_type);
  if not public._wpkf_is_valid_content_type(v_content_type) then
    raise exception 'Invalid content_type';
  end if;

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
    translation_group_id,
    created_by,
    updated_by
  )
  values (
    v_tenant,
    v_source.install_id,
    v_source.domain,
    v_locale,
    trim(p_title),
    nullif(trim(coalesce(p_question, '')), ''),
    trim(p_answer),
    nullif(trim(coalesce(p_category, '')), ''),
    v_content_type,
    'draft',
    false,
    coalesce(p_priority, v_source.priority),
    coalesce(p_tags, '{}'::text[]),
    nullif(trim(coalesce(p_source_url, '')), ''),
    p_valid_from,
    p_valid_until,
    v_source.translation_group_id,
    v_user,
    v_user
  )
  returning * into v_row;

  return jsonb_build_object('id', v_row.id, 'status', v_row.status, 'created', true);
end;
$$;

create or replace function public.search_tenant_public_companion_faq_locale_candidates(
  p_source_item_id uuid,
  p_locale text,
  p_query text
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant uuid;
  v_source public.tenant_public_companion_faq_items;
  v_locale text;
  v_query text;
  v_rows jsonb;
begin
  v_tenant := public._wpkf_require_owner_admin();
  v_locale := lower(trim(coalesce(p_locale, '')));
  if v_locale = '' then
    raise exception 'locale is required';
  end if;

  select * into v_source
  from public.tenant_public_companion_faq_items f
  where f.id = p_source_item_id
    and f.tenant_id = v_tenant;

  if v_source.id is null then
    raise exception 'FAQ item not found';
  end if;
  if v_source.translation_group_id is null then
    raise exception 'FAQ language family is not linked';
  end if;

  v_query := left(trim(coalesce(p_query, '')), 80);
  v_query := replace(replace(replace(v_query, '\', '\\'), '%', '\%'), '_', '\_');

  select coalesce(jsonb_agg(row_to_json(c) order by c.title, c.id), '[]'::jsonb)
  into v_rows
  from (
    select
      f.id,
      f.title,
      left(coalesce(f.question, ''), 140) as "questionExcerpt",
      lower(f.locale) as locale,
      f.status,
      f.domain,
      f.install_id as "installId"
    from public.tenant_public_companion_faq_items f
    where f.tenant_id = v_tenant
      and f.id <> v_source.id
      and f.status <> 'archived'
      and lower(f.locale) = v_locale
      and public._wpkf_faq_same_website(v_source.install_id, v_source.domain, f.install_id, f.domain)
      and (
        v_query = ''
        or f.title ilike '%' || v_query || '%' escape '\'
        or coalesce(f.question, '') ilike '%' || v_query || '%' escape '\'
      )
    order by f.title, f.id
    limit 25
  ) c;

  return jsonb_build_object('candidates', v_rows);
end;
$$;

create or replace function public.link_tenant_public_companion_faq_locale_member(
  p_source_item_id uuid,
  p_candidate_id uuid,
  p_locale text,
  p_confirmed boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant uuid;
  v_locale text;
  v_source public.tenant_public_companion_faq_items;
  v_candidate public.tenant_public_companion_faq_items;
  v_other uuid;
  v_updated uuid;
begin
  v_tenant := public._wpkf_require_owner_admin();
  v_locale := lower(trim(coalesce(p_locale, '')));
  if v_locale = '' then
    return jsonb_build_object('code', 'invalid_locale');
  end if;
  if p_source_item_id = p_candidate_id then
    return jsonb_build_object('code', 'same_row');
  end if;

  perform 1
  from public.tenant_public_companion_faq_items f
  where f.tenant_id = v_tenant
    and f.id in (p_source_item_id, p_candidate_id)
  order by f.id
  for update;

  select * into v_source
  from public.tenant_public_companion_faq_items f
  where f.id = p_source_item_id
    and f.tenant_id = v_tenant;

  select * into v_candidate
  from public.tenant_public_companion_faq_items f
  where f.id = p_candidate_id
    and f.tenant_id = v_tenant;

  if v_source.id is null or v_candidate.id is null then
    raise exception 'FAQ item not found';
  end if;
  if v_source.translation_group_id is null then
    raise exception 'FAQ language family is not linked';
  end if;
  if v_candidate.status = 'archived' then
    return jsonb_build_object('code', 'archived');
  end if;
  if not public._wpkf_faq_same_website(v_source.install_id, v_source.domain, v_candidate.install_id, v_candidate.domain) then
    return jsonb_build_object('code', 'website');
  end if;
  if lower(v_candidate.locale) is distinct from v_locale then
    return jsonb_build_object('code', 'locale_mismatch');
  end if;

  select f.id into v_other
  from public.tenant_public_companion_faq_items f
  where f.tenant_id = v_tenant
    and f.translation_group_id = v_source.translation_group_id
    and lower(f.locale) = v_locale
    and f.status <> 'archived'
    and f.id <> v_candidate.id
    and public._wpkf_faq_same_website(v_source.install_id, v_source.domain, f.install_id, f.domain);

  if v_other is not null then
    return jsonb_build_object('code', 'locale_taken');
  end if;

  if v_candidate.translation_group_id is not distinct from v_source.translation_group_id then
    return jsonb_build_object('outcome', 'already_linked', 'item', to_jsonb(v_candidate));
  end if;

  select f.id into v_other
  from public.tenant_public_companion_faq_items f
  where f.tenant_id = v_tenant
    and f.translation_group_id = v_candidate.translation_group_id
    and f.status <> 'archived'
    and f.id <> v_candidate.id
    and public._wpkf_faq_same_website(v_candidate.install_id, v_candidate.domain, f.install_id, f.domain);

  if v_other is not null then
    return jsonb_build_object('code', 'family_conflict');
  end if;

  if p_confirmed is distinct from true then
    return jsonb_build_object('code', 'confirmation_required');
  end if;

  perform set_config('wpkf.faq_family_link', '1', true);

  update public.tenant_public_companion_faq_items
  set translation_group_id = v_source.translation_group_id
  where id = v_candidate.id
    and tenant_id = v_tenant
    and translation_group_id is not distinct from v_candidate.translation_group_id
  returning id into v_updated;

  if v_updated is null then
    return jsonb_build_object('code', 'conflict');
  end if;

  select * into v_candidate
  from public.tenant_public_companion_faq_items f
  where f.id = v_updated
    and f.tenant_id = v_tenant;

  return jsonb_build_object('outcome', 'linked', 'item', to_jsonb(v_candidate));
exception
  when unique_violation then
    return jsonb_build_object('code', 'conflict');
end;
$$;

revoke all on function public._wpkf_assign_faq_locale_family() from public, anon, authenticated;
revoke all on function public._wpkf_guard_faq_locale_family() from public, anon, authenticated;
revoke all on function public._wpkf_faq_same_website(uuid, text, uuid, text) from public, anon, authenticated;
revoke all on function public.get_tenant_public_companion_faq_locale_version(uuid, text) from public, anon;
revoke all on function public.insert_tenant_public_companion_faq_locale_version(uuid, text, text, text, text, text, text, integer, text[], text, timestamptz, timestamptz) from public, anon;
revoke all on function public.search_tenant_public_companion_faq_locale_candidates(uuid, text, text) from public, anon;
revoke all on function public.link_tenant_public_companion_faq_locale_member(uuid, uuid, text, boolean) from public, anon;
grant execute on function public.get_tenant_public_companion_faq_locale_version(uuid, text) to authenticated;
grant execute on function public.insert_tenant_public_companion_faq_locale_version(uuid, text, text, text, text, text, text, integer, text[], text, timestamptz, timestamptz) to authenticated;
grant execute on function public.search_tenant_public_companion_faq_locale_candidates(uuid, text, text) to authenticated;
grant execute on function public.link_tenant_public_companion_faq_locale_member(uuid, uuid, text, boolean) to authenticated;
