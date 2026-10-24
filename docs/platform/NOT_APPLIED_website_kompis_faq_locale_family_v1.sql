-- NOT APPLIED
-- Feature owner: CUSTOMER APP / Kompis Web
-- Purpose: explicit FAQ language family. Do not run until the owner approves this file by SHA256.
-- Existing rows are NOT paired. Each current row becomes its own family (translation_group_id = id).
-- This statement does not change title, question, answer, locale, status, or public_safe.
-- Rows are not matched by title, question, category, or row order.

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
  if new.translation_group_id is distinct from old.translation_group_id then
    raise exception 'FAQ language family cannot be reassigned';
  end if;
  if new.tenant_id is distinct from old.tenant_id then
    raise exception 'FAQ tenant cannot change';
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
    and (
      (v_source.install_id is not null and f.install_id = v_source.install_id)
      or (
        v_source.install_id is null
        and f.install_id is null
        and coalesce(f.domain, '') = coalesce(v_source.domain, '')
      )
    );

  if v_count > 1 then
    return jsonb_build_object('outcome', 'ambiguous');
  end if;

  select * into v_match
  from public.tenant_public_companion_faq_items f
  where f.tenant_id = v_tenant
    and f.translation_group_id = v_source.translation_group_id
    and lower(f.locale) = v_locale
    and f.status <> 'archived'
    and (
      (v_source.install_id is not null and f.install_id = v_source.install_id)
      or (
        v_source.install_id is null
        and f.install_id is null
        and coalesce(f.domain, '') = coalesce(v_source.domain, '')
      )
    );

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
    and (
      (v_source.install_id is not null and f.install_id = v_source.install_id)
      or (
        v_source.install_id is null
        and f.install_id is null
        and coalesce(f.domain, '') = coalesce(v_source.domain, '')
      )
    );

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

revoke all on function public.get_tenant_public_companion_faq_locale_version(uuid, text) from public, anon;
revoke all on function public.insert_tenant_public_companion_faq_locale_version(uuid, text, text, text, text, text, text, integer, text[], text, timestamptz, timestamptz) from public, anon;
grant execute on function public.get_tenant_public_companion_faq_locale_version(uuid, text) to authenticated;
grant execute on function public.insert_tenant_public_companion_faq_locale_version(uuid, text, text, text, text, text, text, integer, text[], text, timestamptz, timestamptz) to authenticated;
