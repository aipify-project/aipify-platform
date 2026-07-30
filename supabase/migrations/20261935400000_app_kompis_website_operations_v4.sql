-- AIPIFY.APP.KOMPIS.WEBSITE.OPERATIONS.CONTENT.SEO.V4
-- Website Operations draft/preview metadata. No CMS publish. No customer-specific seeds. No apply-side effects.

set search_path = public;

alter table public.kompis_operator_drafts
  drop constraint if exists kompis_operator_drafts_draft_kind_check;

alter table public.kompis_operator_drafts
  add constraint kompis_operator_drafts_draft_kind_check
  check (
    draft_kind in (
      'organization_profile',
      'content',
      'knowledge',
      'website_page',
      'website_seo',
      'website_navigation',
      'website_translation',
      'website_section',
      'website_image_metadata'
    )
  );

create table if not exists public.kompis_website_ops_previews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  draft_id uuid not null references public.kompis_operator_drafts(id) on delete cascade,
  created_by uuid not null,
  locale text not null,
  preview_payload jsonb not null default '{}'::jsonb,
  noindex boolean not null default true,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists kompis_website_ops_previews_org_idx
  on public.kompis_website_ops_previews (organization_id, created_at desc);

create index if not exists kompis_website_ops_previews_draft_idx
  on public.kompis_website_ops_previews (draft_id, created_at desc);

alter table public.kompis_website_ops_previews enable row level security;

revoke all on table public.kompis_website_ops_previews from public, anon;
grant select, insert on table public.kompis_website_ops_previews to authenticated;

-- Fix org resolution and allow website draft kinds (still unpublished).
create or replace function public.create_app_kompis_operator_draft(
  p_draft_kind text,
  p_title text,
  p_locale text,
  p_body jsonb,
  p_idempotency_key text,
  p_run_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org_id uuid;
  v_user uuid;
  v_key text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_kind text := nullif(btrim(coalesce(p_draft_kind, '')), '');
  v_title text := left(btrim(coalesce(p_title, '')), 200);
  v_locale text := left(nullif(btrim(coalesce(p_locale, '')), ''), 16);
  v_existing public.kompis_operator_drafts;
  v_row public.kompis_operator_drafts;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access ->> 'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org_id := nullif(v_access ->> 'organization_id', '')::uuid;
  v_user := nullif(v_access ->> 'user_id', '')::uuid;

  if v_org_id is null or v_user is null then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;

  if v_kind is null or v_kind not in (
    'organization_profile', 'content', 'knowledge',
    'website_page', 'website_seo', 'website_navigation',
    'website_translation', 'website_section', 'website_image_metadata'
  ) then
    raise exception 'INVALID_DRAFT_KIND' using errcode = 'P0001';
  end if;
  if v_key is null or char_length(v_key) < 8 or char_length(v_key) > 128 then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;
  if v_locale is null then
    v_locale := 'en';
  end if;

  select * into v_existing
  from public.kompis_operator_drafts
  where organization_id = v_org_id
    and idempotency_key = v_key;

  if found then
    return jsonb_build_object(
      'id', v_existing.id,
      'organization_id', v_existing.organization_id,
      'draft_kind', v_existing.draft_kind,
      'title', v_existing.title,
      'locale', v_existing.locale,
      'status', v_existing.status,
      'version', v_existing.version,
      'idempotent_replay', true,
      'published', false
    );
  end if;

  insert into public.kompis_operator_drafts (
    organization_id, created_by, draft_kind, title, locale, body, status, version, idempotency_key, run_id
  ) values (
    v_org_id, v_user, v_kind, coalesce(nullif(v_title, ''), 'Draft'), v_locale,
    coalesce(p_body, '{}'::jsonb), 'draft', 1, v_key, p_run_id
  )
  returning * into v_row;

  perform public.record_trust_audit_event(
    v_org_id,
    'kompis_operator_draft_created',
    'success',
    'kompis_operator',
    null,
    'operator',
    null,
    jsonb_build_object(
      'draft_id', v_row.id,
      'draft_kind', v_kind,
      'run_id', p_run_id
    )
  );

  return jsonb_build_object(
    'id', v_row.id,
    'organization_id', v_row.organization_id,
    'draft_kind', v_row.draft_kind,
    'title', v_row.title,
    'locale', v_row.locale,
    'status', v_row.status,
    'version', v_row.version,
    'idempotent_replay', false,
    'published', false
  );
end;
$$;

revoke all on function public.create_app_kompis_operator_draft(text, text, text, jsonb, text, uuid)
  from public, anon;
grant execute on function public.create_app_kompis_operator_draft(text, text, text, jsonb, text, uuid)
  to authenticated;

create or replace function public.update_app_kompis_operator_draft(
  p_draft_id uuid,
  p_title text,
  p_body jsonb,
  p_expected_version int
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org_id uuid;
  v_row public.kompis_operator_drafts;
  v_updated public.kompis_operator_drafts;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access ->> 'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org_id := nullif(v_access ->> 'organization_id', '')::uuid;

  select * into v_row
  from public.kompis_operator_drafts
  where id = p_draft_id
    and organization_id = v_org_id
  for update;

  if not found then
    raise exception 'DRAFT_NOT_FOUND' using errcode = 'P0001';
  end if;
  if v_row.version is distinct from p_expected_version then
    raise exception 'DRAFT_VERSION_CONFLICT' using errcode = 'P0001';
  end if;

  update public.kompis_operator_drafts
  set
    title = coalesce(nullif(btrim(coalesce(p_title, '')), ''), title),
    body = coalesce(p_body, body),
    version = version + 1,
    updated_at = now()
  where id = v_row.id
  returning * into v_updated;

  return jsonb_build_object(
    'id', v_updated.id,
    'organization_id', v_updated.organization_id,
    'draft_kind', v_updated.draft_kind,
    'title', v_updated.title,
    'locale', v_updated.locale,
    'status', v_updated.status,
    'version', v_updated.version,
    'published', false
  );
end;
$$;

revoke all on function public.update_app_kompis_operator_draft(uuid, text, jsonb, int)
  from public, anon;
grant execute on function public.update_app_kompis_operator_draft(uuid, text, jsonb, int)
  to authenticated;

create or replace function public.list_app_kompis_operator_drafts(p_limit int default 20)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org_id uuid;
  v_limit int := least(greatest(coalesce(p_limit, 20), 1), 100);
  v_items jsonb;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access ->> 'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org_id := nullif(v_access ->> 'organization_id', '')::uuid;

  select coalesce(jsonb_agg(to_jsonb(d) order by d.updated_at desc), '[]'::jsonb)
  into v_items
  from (
    select id, draft_kind, title, locale, status, version, body, created_at, updated_at
    from public.kompis_operator_drafts
    where organization_id = v_org_id
      and status = 'draft'
    order by updated_at desc
    limit v_limit
  ) d;

  return jsonb_build_object('drafts', v_items);
end;
$$;

revoke all on function public.list_app_kompis_operator_drafts(int) from public, anon;
grant execute on function public.list_app_kompis_operator_drafts(int) to authenticated;

create or replace function public.get_app_kompis_operator_draft(p_draft_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org_id uuid;
  v_row public.kompis_operator_drafts;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access ->> 'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org_id := nullif(v_access ->> 'organization_id', '')::uuid;

  select * into v_row
  from public.kompis_operator_drafts
  where id = p_draft_id
    and organization_id = v_org_id;

  if not found then
    raise exception 'DRAFT_NOT_FOUND' using errcode = 'P0001';
  end if;

  return jsonb_build_object(
    'id', v_row.id,
    'organization_id', v_row.organization_id,
    'draft_kind', v_row.draft_kind,
    'title', v_row.title,
    'locale', v_row.locale,
    'body', v_row.body,
    'status', v_row.status,
    'version', v_row.version,
    'published', false,
    'created_at', v_row.created_at,
    'updated_at', v_row.updated_at
  );
end;
$$;

revoke all on function public.get_app_kompis_operator_draft(uuid) from public, anon;
grant execute on function public.get_app_kompis_operator_draft(uuid) to authenticated;

create or replace function public.create_app_kompis_website_ops_preview(
  p_draft_id uuid,
  p_preview_payload jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_actor uuid;
  v_draft public.kompis_operator_drafts;
  v_row public.kompis_website_ops_previews;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access->>'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := nullif(v_access->>'organization_id', '')::uuid;
  v_actor := nullif(v_access->>'user_id', '')::uuid;

  select * into v_draft
  from public.kompis_operator_drafts
  where id = p_draft_id
    and organization_id = v_org
  limit 1;

  if v_draft.id is null then
    raise exception 'DRAFT_NOT_FOUND' using errcode = 'P0001';
  end if;

  if v_draft.draft_kind not like 'website_%' then
    raise exception 'INVALID_DRAFT_KIND' using errcode = 'P0001';
  end if;

  insert into public.kompis_website_ops_previews (
    organization_id, draft_id, created_by, locale, preview_payload, noindex, expires_at
  ) values (
    v_org,
    v_draft.id,
    v_actor,
    coalesce(nullif(v_draft.locale, ''), 'en'),
    coalesce(p_preview_payload, '{}'::jsonb),
    true,
    now() + interval '1 hour'
  )
  returning * into v_row;

  return jsonb_build_object(
    'id', v_row.id,
    'organization_id', v_row.organization_id,
    'draft_id', v_row.draft_id,
    'locale', v_row.locale,
    'noindex', v_row.noindex,
    'expires_at', v_row.expires_at,
    'preview', v_row.preview_payload,
    'production_unchanged', true
  );
end;
$$;

revoke all on function public.create_app_kompis_website_ops_preview(uuid, jsonb) from public, anon;
grant execute on function public.create_app_kompis_website_ops_preview(uuid, jsonb) to authenticated;

create or replace function public.get_app_kompis_website_ops_context()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_draft_count int := 0;
begin
  begin
    v_access := public._kompis_operator_require_access();
  exception when others then
    return jsonb_build_object(
      'available', false,
      'draft_capability', false,
      'preview_capability', false,
      'publish_capability', false,
      'rollback_capability', false,
      'authoritative_page_model', false
    );
  end;

  if coalesce((v_access->>'available')::boolean, false) is not true then
    return jsonb_build_object(
      'available', false,
      'draft_capability', false,
      'preview_capability', false,
      'publish_capability', false,
      'rollback_capability', false,
      'authoritative_page_model', false,
      'workspace', v_access
    );
  end if;

  v_org := nullif(v_access->>'organization_id', '')::uuid;

  select count(*)::int into v_draft_count
  from public.kompis_operator_drafts
  where organization_id = v_org
    and draft_kind like 'website_%'
    and status = 'draft';

  return jsonb_build_object(
    'available', true,
    'organization_id', v_org,
    'domain', v_access->>'domain',
    'installation_id', v_access->>'installation_id',
    'acknowledgement', v_access->'acknowledgement',
    'draft_capability', true,
    'preview_capability', true,
    'publish_capability', false,
    'rollback_capability', false,
    'authoritative_page_model', false,
    'draft_count', v_draft_count,
    'publish_unavailable_reason', 'no_authoritative_website_cms_publish_path_v4',
    'rollback_unavailable_reason', 'no_authoritative_website_version_rollback_path_v4'
  );
end;
$$;

revoke all on function public.get_app_kompis_website_ops_context() from public, anon;
grant execute on function public.get_app_kompis_website_ops_context() to authenticated;
