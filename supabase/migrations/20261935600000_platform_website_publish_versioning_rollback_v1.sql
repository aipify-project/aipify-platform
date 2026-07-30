-- AIPIFY.APP+PLATFORM.WEBSITE.PUBLISH.VERSIONING.ROLLBACK.V1
-- Candidate build from approved drafts, preview verification, publish,
-- rollback, and reconcile against the runtime-verified public read path.
-- No customer seeds. No publish on apply. History rows are never deleted.

set search_path = public;

-- ---------------------------------------------------------------------------
-- 1. Shared runtime verification helper
-- ---------------------------------------------------------------------------

create or replace function public._website_cms_verify_runtime(
  p_website public.customer_websites,
  p_version public.customer_website_versions,
  p_hostname text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_public jsonb;
  v_verified boolean := false;
  v_reason text := 'not_verified';
begin
  if p_hostname is null or btrim(p_hostname) = '' then
    return jsonb_build_object('verified', false, 'reason', 'no_domain_bound', 'checked_at', now());
  end if;

  v_public := public.get_public_website_active_version(p_hostname);

  if coalesce((v_public ->> 'ok')::boolean, false) is not true then
    v_reason := coalesce(v_public ->> 'reason', 'public_resolve_failed');
  elsif (v_public ->> 'website_id')::uuid is distinct from p_website.id then
    v_reason := 'website_mismatch';
  elsif (v_public ->> 'version_id')::uuid is distinct from p_version.id then
    v_reason := 'version_mismatch';
  elsif coalesce(v_public ->> 'manifest_checksum', '') is distinct from coalesce(p_version.manifest_checksum, '') then
    v_reason := 'checksum_mismatch';
  else
    v_verified := true;
    v_reason := 'ok';
  end if;

  return jsonb_build_object(
    'verified', v_verified,
    'reason', v_reason,
    'domain', p_hostname,
    'checked_at', now()
  );
end;
$$;

revoke all on function public._website_cms_verify_runtime(public.customer_websites, public.customer_website_versions, text)
  from public, anon, authenticated;

create or replace function public._website_cms_hostname(p_website public.customer_websites, p_access jsonb)
returns text
language sql
stable
set search_path = public
as $$
  select coalesce(
    (select cd.domain from public.customer_domains cd where cd.id = p_website.domain_id),
    nullif(btrim(coalesce(p_access ->> 'domain', '')), '')
  );
$$;

revoke all on function public._website_cms_hostname(public.customer_websites, jsonb) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Candidate build from approved drafts
-- ---------------------------------------------------------------------------

create or replace function public.build_customer_website_candidate_from_drafts(
  p_draft_ids uuid[],
  p_locales text[],
  p_expected_draft_versions jsonb,
  p_internal_reason text,
  p_idempotency_key text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_user uuid;
  v_website public.customer_websites;
  v_reason text := nullif(btrim(coalesce(p_internal_reason, '')), '');
  v_key text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_locales text[] := coalesce(p_locales, array[]::text[]);
  v_draft_ids uuid[] := coalesce(p_draft_ids, array[]::uuid[]);
  v_expected jsonb := coalesce(p_expected_draft_versions, '{}'::jsonb);
  v_existing_manifest jsonb;
  v_existing_version public.customer_website_versions;
  v_draft public.kompis_operator_drafts;
  v_draft_id uuid;
  v_locale text;
  v_expected_version int;
  v_scan_text text;
  v_path text;
  v_extras jsonb := '[]'::jsonb;
  v_pages jsonb := '[]'::jsonb;
  v_scratch record;
  v_page_id uuid;
  v_revision_number int;
  v_content jsonb;
  v_seo jsonb;
  v_content_checksum text;
  v_manifest jsonb;
  v_manifest_checksum text;
  v_content_checksum_total text;
  v_version_number int;
  v_previous_version_id uuid;
  v_version public.customer_website_versions;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access ->> 'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  if not public._website_cms_reason_ok(v_reason) then
    raise exception 'INVALID_INTERNAL_REASON' using errcode = 'P0001';
  end if;
  if v_key is null or char_length(v_key) < 8 or char_length(v_key) > 128 then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;
  if array_length(v_draft_ids, 1) is null or array_length(v_draft_ids, 1) < 1 or array_length(v_draft_ids, 1) > 50 then
    raise exception 'INVALID_DRAFT_IDS' using errcode = 'P0001';
  end if;
  if array_length(v_locales, 1) is null or array_length(v_locales, 1) < 1 then
    raise exception 'INVALID_LOCALES' using errcode = 'P0001';
  end if;

  v_org := (v_access ->> 'organization_id')::uuid;
  v_user := (v_access ->> 'user_id')::uuid;

  select * into v_website from public.customer_websites where organization_id = v_org for update;
  if v_website.id is null then
    raise exception 'WEBSITE_NOT_PROVISIONED' using errcode = 'P0001';
  end if;

  foreach v_locale in array v_locales loop
    if not (v_locale = any(v_website.active_locales)) then
      raise exception 'INVALID_OR_INACTIVE_LOCALE' using errcode = 'P0001';
    end if;
  end loop;

  select * into v_existing_version
  from public.customer_website_versions
  where website_id = v_website.id
    and status = 'candidate'
    and manifest ->> 'idempotency_key' = v_key;

  if v_existing_version.id is not null then
    return jsonb_build_object(
      'id', v_existing_version.id,
      'website_id', v_website.id,
      'version_number', v_existing_version.version_number,
      'status', v_existing_version.status,
      'manifest', v_existing_version.manifest,
      'content_checksum', v_existing_version.content_checksum,
      'manifest_checksum', v_existing_version.manifest_checksum,
      'idempotent_replay', true
    );
  end if;

  create temporary table if not exists wcms_candidate_scratch (
    path text primary key,
    locale text not null,
    title text,
    content jsonb not null default '{}'::jsonb,
    seo jsonb not null default '{}'::jsonb,
    source_draft_ids uuid[] not null default array[]::uuid[]
  ) on commit drop;
  truncate table wcms_candidate_scratch;

  foreach v_draft_id in array v_draft_ids loop
    select * into v_draft
    from public.kompis_operator_drafts
    where id = v_draft_id and organization_id = v_org;

    if v_draft.id is null then
      raise exception 'DRAFT_NOT_FOUND' using errcode = 'P0001';
    end if;
    if v_draft.draft_kind not like 'website_%' then
      raise exception 'INVALID_DRAFT_KIND' using errcode = 'P0001';
    end if;

    v_expected_version := nullif(v_expected ->> v_draft_id::text, '')::int;
    if v_expected_version is not null and v_expected_version is distinct from v_draft.version then
      raise exception 'DRAFT_VERSION_CONFLICT' using errcode = 'P0001';
    end if;

    v_scan_text := lower(concat_ws(' ',
      v_draft.title,
      v_draft.body ->> 'text',
      v_draft.body ->> 'metaDescription',
      v_draft.body ->> 'canonicalUrl',
      v_draft.body ->> 'altText'
    ));
    if v_scan_text ~ '<\s*script|javascript:|on\w+\s*=|<\s*iframe' then
      raise exception 'FORBIDDEN_MARKUP' using errcode = 'P0001';
    end if;

    if not (coalesce(v_draft.locale, 'en') = any(v_website.active_locales)) then
      raise exception 'INVALID_OR_INACTIVE_LOCALE' using errcode = 'P0001';
    end if;

    if v_draft.draft_kind in ('website_page', 'website_seo') then
      v_path := nullif(btrim(coalesce(v_draft.body ->> 'path', '')), '');
      if v_path is null or v_path !~ '^/' or v_path ~ '\.\.' or v_path ~ '<' or char_length(v_path) > 200 then
        raise exception 'INVALID_PAGE_PATH' using errcode = 'P0001';
      end if;

      select * into v_scratch from wcms_candidate_scratch where path = v_path and locale = v_draft.locale;
      if found then
        update wcms_candidate_scratch
        set
          title = coalesce(nullif(v_draft.title, ''), title),
          content = content || jsonb_strip_nulls(jsonb_build_object('text', nullif(v_draft.body ->> 'text', ''))),
          seo = seo || jsonb_strip_nulls(jsonb_build_object(
            'metaDescription', v_draft.body ->> 'metaDescription',
            'canonicalUrl', v_draft.body ->> 'canonicalUrl',
            'altText', v_draft.body ->> 'altText'
          )),
          source_draft_ids = array_append(source_draft_ids, v_draft.id)
        where path = v_path and locale = v_draft.locale;
      else
        insert into wcms_candidate_scratch (path, locale, title, content, seo, source_draft_ids)
        values (
          v_path,
          v_draft.locale,
          coalesce(nullif(v_draft.title, ''), 'Untitled'),
          jsonb_strip_nulls(jsonb_build_object('text', nullif(v_draft.body ->> 'text', ''))),
          jsonb_strip_nulls(jsonb_build_object(
            'metaDescription', v_draft.body ->> 'metaDescription',
            'canonicalUrl', v_draft.body ->> 'canonicalUrl',
            'altText', v_draft.body ->> 'altText'
          )),
          array[v_draft.id]
        );
      end if;
    else
      v_extras := v_extras || jsonb_build_array(jsonb_build_object(
        'draft_id', v_draft.id,
        'draft_kind', v_draft.draft_kind,
        'locale', v_draft.locale,
        'title', v_draft.title,
        'body', v_draft.body
      ));
    end if;
  end loop;

  for v_scratch in select * from wcms_candidate_scratch loop
    select id into v_page_id
    from public.customer_website_pages
    where website_id = v_website.id and path = v_scratch.path;

    if v_page_id is null then
      insert into public.customer_website_pages (website_id, organization_id, path, page_type, status)
      values (v_website.id, v_org, v_scratch.path, 'page', 'active')
      returning id into v_page_id;
    else
      update public.customer_website_pages
      set updated_at = now()
      where id = v_page_id;
    end if;

    select coalesce(max(revision_number), 0) + 1
    into v_revision_number
    from public.customer_website_page_revisions
    where page_id = v_page_id and locale = v_scratch.locale;

    v_content := jsonb_build_object('title', v_scratch.title) || v_scratch.content;
    v_seo := v_scratch.seo;
    v_content_checksum := public._website_cms_checksum(v_content::text || v_seo::text);

    insert into public.customer_website_page_revisions (
      page_id, website_id, organization_id, locale, revision_number,
      content, seo, source_draft_id, content_checksum, created_by
    ) values (
      v_page_id, v_website.id, v_org, v_scratch.locale, v_revision_number,
      v_content, v_seo, v_scratch.source_draft_ids[1], v_content_checksum, v_user
    );

    v_pages := v_pages || jsonb_build_array(jsonb_build_object(
      'page_id', v_page_id,
      'path', v_scratch.path,
      'locale', v_scratch.locale,
      'revision_number', v_revision_number,
      'title', v_scratch.title,
      'content', v_content,
      'seo', v_seo,
      'content_checksum', v_content_checksum
    ));
  end loop;

  if jsonb_array_length(v_pages) = 0 and jsonb_array_length(v_extras) = 0 then
    raise exception 'NO_CONTENT_TO_PUBLISH' using errcode = 'P0001';
  end if;

  v_manifest := jsonb_build_object(
    'pages', v_pages,
    'extras', v_extras,
    'locales', to_jsonb(v_locales),
    'default_locale', v_website.default_locale,
    'generated_at', now(),
    'idempotency_key', v_key
  );

  select public._website_cms_checksum(coalesce(v_pages::text, '') || coalesce(v_extras::text, ''))
  into v_content_checksum_total;
  select public._website_cms_checksum(v_manifest::text) into v_manifest_checksum;

  select coalesce(max(version_number), 0) + 1 into v_version_number
  from public.customer_website_versions
  where website_id = v_website.id;

  select id into v_previous_version_id
  from public.customer_website_versions
  where website_id = v_website.id and version_number = v_version_number - 1;

  insert into public.customer_website_versions (
    website_id, organization_id, version_number, status, previous_version_id,
    source_draft_ids, manifest, content_checksum, manifest_checksum, change_summary, created_by
  ) values (
    v_website.id, v_org, v_version_number, 'candidate', v_previous_version_id,
    v_draft_ids, v_manifest, v_content_checksum_total, v_manifest_checksum, v_reason, v_user
  )
  returning * into v_version;

  perform public.record_trust_audit_event(
    v_org,
    'customer_website_candidate_built',
    'success',
    'website_cms',
    v_reason,
    'operator',
    v_website.installation_id,
    jsonb_build_object(
      'website_id', v_website.id,
      'version_id', v_version.id,
      'version_number', v_version.version_number,
      'draft_count', array_length(v_draft_ids, 1),
      'idempotency_key', v_key
    )
  );

  return jsonb_build_object(
    'id', v_version.id,
    'website_id', v_website.id,
    'version_number', v_version.version_number,
    'status', v_version.status,
    'manifest', v_version.manifest,
    'content_checksum', v_version.content_checksum,
    'manifest_checksum', v_version.manifest_checksum,
    'idempotent_replay', false
  );
end;
$$;

revoke all on function public.build_customer_website_candidate_from_drafts(uuid[], text[], jsonb, text, text)
  from public, anon;
grant execute on function public.build_customer_website_candidate_from_drafts(uuid[], text[], jsonb, text, text)
  to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Preview
-- ---------------------------------------------------------------------------

create or replace function public.create_customer_website_version_preview(
  p_version_id uuid,
  p_locale text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_user uuid;
  v_version public.customer_website_versions;
  v_locale text := nullif(btrim(coalesce(p_locale, '')), '');
  v_row public.customer_website_previews;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access ->> 'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access ->> 'organization_id')::uuid;
  v_user := (v_access ->> 'user_id')::uuid;

  select * into v_version
  from public.customer_website_versions
  where id = p_version_id and organization_id = v_org;
  if v_version.id is null then
    raise exception 'VERSION_NOT_FOUND' using errcode = 'P0001';
  end if;
  if v_locale is null then
    v_locale := 'en';
  end if;

  insert into public.customer_website_previews (
    website_id, organization_id, version_id, created_by, locale, noindex, expires_at
  ) values (
    v_version.website_id, v_org, v_version.id, v_user, v_locale, true, now() + interval '1 hour'
  )
  returning * into v_row;

  return jsonb_build_object(
    'id', v_row.id,
    'website_id', v_row.website_id,
    'version_id', v_row.version_id,
    'locale', v_row.locale,
    'noindex', v_row.noindex,
    'expires_at', v_row.expires_at,
    'production_unchanged', true
  );
end;
$$;

revoke all on function public.create_customer_website_version_preview(uuid, text) from public, anon;
grant execute on function public.create_customer_website_version_preview(uuid, text) to authenticated;

create or replace function public.mark_customer_website_preview_verified(p_version_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_version public.customer_website_versions;
  v_preview public.customer_website_previews;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access ->> 'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access ->> 'organization_id')::uuid;

  select * into v_version
  from public.customer_website_versions
  where id = p_version_id and organization_id = v_org
  for update;
  if v_version.id is null then
    raise exception 'VERSION_NOT_FOUND' using errcode = 'P0001';
  end if;
  if v_version.status <> 'candidate' then
    raise exception 'VERSION_NOT_CANDIDATE' using errcode = 'P0001';
  end if;

  select * into v_preview
  from public.customer_website_previews
  where version_id = v_version.id
    and organization_id = v_org
    and expires_at > now()
  order by created_at desc
  limit 1;

  if v_preview.id is null then
    raise exception 'PREVIEW_NOT_FOUND' using errcode = 'P0001';
  end if;

  update public.customer_website_versions
  set preview_verified_at = now()
  where id = v_version.id
  returning * into v_version;

  return jsonb_build_object(
    'id', v_version.id,
    'preview_verified_at', v_version.preview_verified_at
  );
end;
$$;

revoke all on function public.mark_customer_website_preview_verified(uuid) from public, anon;
grant execute on function public.mark_customer_website_preview_verified(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Publish / rollback / reconcile
-- ---------------------------------------------------------------------------

create or replace function public.publish_customer_website_candidate(
  p_candidate_id uuid,
  p_expected_current_version_id uuid,
  p_internal_reason text,
  p_confirmation boolean,
  p_idempotency_key text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_user uuid;
  v_role text;
  v_reason text := nullif(btrim(coalesce(p_internal_reason, '')), '');
  v_key text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_website public.customer_websites;
  v_candidate public.customer_website_versions;
  v_prior_version public.customer_website_versions;
  v_existing_operation public.customer_website_operations;
  v_preview_ok boolean := false;
  v_hostname text;
  v_verification jsonb;
  v_operation public.customer_website_operations;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access ->> 'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access ->> 'organization_id')::uuid;
  v_user := (v_access ->> 'user_id')::uuid;
  v_role := lower(coalesce(v_access ->> 'organization_role', ''));

  if v_role not in ('owner', 'admin', 'organization_owner', 'organization_admin') then
    raise exception 'APPROVAL_ROLE_REQUIRED' using errcode = 'P0001';
  end if;
  if coalesce(p_confirmation, false) is not true then
    raise exception 'CONFIRMATION_REQUIRED' using errcode = 'P0001';
  end if;
  if not public._website_cms_reason_ok(v_reason) then
    raise exception 'INVALID_INTERNAL_REASON' using errcode = 'P0001';
  end if;
  if v_key is null or char_length(v_key) < 8 or char_length(v_key) > 128 then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;
  if coalesce((v_access -> 'acknowledgement' ->> 'ok')::boolean, false) is not true then
    raise exception 'DELIVERY_NOT_ACKNOWLEDGED' using errcode = 'P0001';
  end if;

  select * into v_existing_operation
  from public.customer_website_operations
  where organization_id = v_org and idempotency_key = v_key;
  if v_existing_operation.id is not null then
    return jsonb_build_object(
      'operation_id', v_existing_operation.id,
      'status', v_existing_operation.status,
      'resulting_version_id', v_existing_operation.resulting_version_id,
      'runtime_verification', v_existing_operation.runtime_verification,
      'idempotent_replay', true
    );
  end if;

  select * into v_website from public.customer_websites where organization_id = v_org for update;
  if v_website.id is null then
    raise exception 'WEBSITE_NOT_PROVISIONED' using errcode = 'P0001';
  end if;

  select * into v_candidate
  from public.customer_website_versions
  where id = p_candidate_id and website_id = v_website.id
  for update;
  if v_candidate.id is null then
    raise exception 'CANDIDATE_NOT_FOUND' using errcode = 'P0001';
  end if;
  if v_candidate.status <> 'candidate' then
    raise exception 'CANDIDATE_NOT_PUBLISHABLE' using errcode = 'P0001';
  end if;

  if p_expected_current_version_id is null then
    if v_website.current_version_id is not null then
      raise exception 'VERSION_CONFLICT' using errcode = 'P0001';
    end if;
  elsif p_expected_current_version_id is distinct from v_website.current_version_id then
    raise exception 'VERSION_CONFLICT' using errcode = 'P0001';
  end if;

  v_preview_ok := v_candidate.preview_verified_at is not null;
  if not v_preview_ok then
    select exists(
      select 1 from public.customer_website_previews
      where version_id = v_candidate.id and expires_at > now()
    ) into v_preview_ok;
    if v_preview_ok then
      update public.customer_website_versions
      set preview_verified_at = now()
      where id = v_candidate.id
      returning * into v_candidate;
    end if;
  end if;
  if not v_preview_ok then
    raise exception 'PREVIEW_REQUIRED' using errcode = 'P0001';
  end if;

  if v_website.current_version_id is not null then
    select * into v_prior_version from public.customer_website_versions where id = v_website.current_version_id;
  end if;

  update public.customer_website_versions
  set status = 'published'
  where id = v_candidate.id
  returning * into v_candidate;

  if v_prior_version.id is not null and v_prior_version.status = 'published' then
    update public.customer_website_versions
    set status = 'superseded'
    where id = v_prior_version.id;
  end if;

  update public.customer_websites
  set current_version_id = v_candidate.id, status = 'ready', updated_at = now()
  where id = v_website.id
  returning * into v_website;

  v_hostname := public._website_cms_hostname(v_website, v_access);
  v_verification := public._website_cms_verify_runtime(v_website, v_candidate, v_hostname);

  insert into public.customer_website_operations (
    website_id, organization_id, operation_kind, candidate_version_id,
    expected_current_version_id, resulting_version_id, status, idempotency_key,
    confirmation, internal_reason, runtime_verification, error_code, created_by
  ) values (
    v_website.id, v_org, 'publish', v_candidate.id,
    p_expected_current_version_id, v_candidate.id,
    case when coalesce((v_verification ->> 'verified')::boolean, false) then 'active' else 'attention' end,
    v_key, true, v_reason, v_verification,
    case when coalesce((v_verification ->> 'verified')::boolean, false) then null else v_verification ->> 'reason' end,
    v_user
  )
  returning * into v_operation;

  perform public.record_trust_audit_event(
    v_org,
    'customer_website_published',
    case when v_operation.status = 'active' then 'success' else 'pending' end,
    'website_cms',
    v_reason,
    'operator',
    v_website.installation_id,
    jsonb_build_object(
      'website_id', v_website.id,
      'operation_id', v_operation.id,
      'candidate_version_id', v_candidate.id,
      'previous_version_id', v_prior_version.id,
      'idempotency_key', v_key,
      'verified', coalesce((v_verification ->> 'verified')::boolean, false)
    )
  );

  return jsonb_build_object(
    'operation_id', v_operation.id,
    'status', v_operation.status,
    'version_id', v_candidate.id,
    'version_number', v_candidate.version_number,
    'resulting_version_id', v_operation.resulting_version_id,
    'runtime_verification', v_verification,
    'idempotent_replay', false
  );
end;
$$;

revoke all on function public.publish_customer_website_candidate(uuid, uuid, text, boolean, text)
  from public, anon;
grant execute on function public.publish_customer_website_candidate(uuid, uuid, text, boolean, text)
  to authenticated;

create or replace function public.reconcile_customer_website_publish(p_operation_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_operation public.customer_website_operations;
  v_website public.customer_websites;
  v_version public.customer_website_versions;
  v_hostname text;
  v_verification jsonb;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access ->> 'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access ->> 'organization_id')::uuid;

  select * into v_operation
  from public.customer_website_operations
  where id = p_operation_id and organization_id = v_org
  for update;
  if v_operation.id is null then
    raise exception 'OPERATION_NOT_FOUND' using errcode = 'P0001';
  end if;
  if v_operation.operation_kind not in ('publish', 'rollback') then
    raise exception 'OPERATION_NOT_RECONCILABLE' using errcode = 'P0001';
  end if;

  select * into v_website from public.customer_websites where id = v_operation.website_id;
  if v_website.id is null then
    raise exception 'WEBSITE_NOT_PROVISIONED' using errcode = 'P0001';
  end if;

  if v_operation.status = 'active' then
    return jsonb_build_object(
      'operation_id', v_operation.id,
      'status', v_operation.status,
      'runtime_verification', v_operation.runtime_verification,
      'already_active', true
    );
  end if;

  select * into v_version
  from public.customer_website_versions
  where id = coalesce(v_operation.resulting_version_id, v_operation.candidate_version_id);
  if v_version.id is null then
    raise exception 'VERSION_NOT_FOUND' using errcode = 'P0001';
  end if;

  v_hostname := public._website_cms_hostname(v_website, v_access);
  v_verification := public._website_cms_verify_runtime(v_website, v_version, v_hostname);

  update public.customer_website_operations
  set
    status = case when coalesce((v_verification ->> 'verified')::boolean, false) then 'active' else 'attention' end,
    resulting_version_id = case when coalesce((v_verification ->> 'verified')::boolean, false) then v_version.id else resulting_version_id end,
    runtime_verification = v_verification,
    error_code = case when coalesce((v_verification ->> 'verified')::boolean, false) then null else v_verification ->> 'reason' end,
    updated_at = now()
  where id = v_operation.id
  returning * into v_operation;

  perform public.record_trust_audit_event(
    v_org,
    'customer_website_reconciled',
    case when v_operation.status = 'active' then 'success' else 'pending' end,
    'website_cms',
    'reconcile',
    'operator',
    v_website.installation_id,
    jsonb_build_object(
      'website_id', v_website.id,
      'operation_id', v_operation.id,
      'verified', coalesce((v_verification ->> 'verified')::boolean, false)
    )
  );

  return jsonb_build_object(
    'operation_id', v_operation.id,
    'status', v_operation.status,
    'runtime_verification', v_verification,
    'already_active', false
  );
end;
$$;

revoke all on function public.reconcile_customer_website_publish(uuid) from public, anon;
grant execute on function public.reconcile_customer_website_publish(uuid) to authenticated;

create or replace function public.rollback_customer_website_version(
  p_target_version_id uuid,
  p_expected_current_version_id uuid,
  p_internal_reason text,
  p_confirmation boolean,
  p_idempotency_key text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_user uuid;
  v_role text;
  v_reason text := nullif(btrim(coalesce(p_internal_reason, '')), '');
  v_key text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_website public.customer_websites;
  v_target public.customer_website_versions;
  v_prior_version public.customer_website_versions;
  v_existing_operation public.customer_website_operations;
  v_hostname text;
  v_verification jsonb;
  v_operation public.customer_website_operations;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access ->> 'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access ->> 'organization_id')::uuid;
  v_user := (v_access ->> 'user_id')::uuid;
  v_role := lower(coalesce(v_access ->> 'organization_role', ''));

  if v_role not in ('owner', 'admin', 'organization_owner', 'organization_admin') then
    raise exception 'APPROVAL_ROLE_REQUIRED' using errcode = 'P0001';
  end if;
  if coalesce(p_confirmation, false) is not true then
    raise exception 'CONFIRMATION_REQUIRED' using errcode = 'P0001';
  end if;
  if not public._website_cms_reason_ok(v_reason) then
    raise exception 'INVALID_INTERNAL_REASON' using errcode = 'P0001';
  end if;
  if v_key is null or char_length(v_key) < 8 or char_length(v_key) > 128 then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;
  if coalesce((v_access -> 'acknowledgement' ->> 'ok')::boolean, false) is not true then
    raise exception 'DELIVERY_NOT_ACKNOWLEDGED' using errcode = 'P0001';
  end if;

  select * into v_existing_operation
  from public.customer_website_operations
  where organization_id = v_org and idempotency_key = v_key;
  if v_existing_operation.id is not null then
    return jsonb_build_object(
      'operation_id', v_existing_operation.id,
      'status', v_existing_operation.status,
      'resulting_version_id', v_existing_operation.resulting_version_id,
      'runtime_verification', v_existing_operation.runtime_verification,
      'idempotent_replay', true
    );
  end if;

  select * into v_website from public.customer_websites where organization_id = v_org for update;
  if v_website.id is null then
    raise exception 'WEBSITE_NOT_PROVISIONED' using errcode = 'P0001';
  end if;

  select * into v_target
  from public.customer_website_versions
  where id = p_target_version_id and website_id = v_website.id
  for update;
  if v_target.id is null then
    raise exception 'TARGET_VERSION_NOT_FOUND' using errcode = 'P0001';
  end if;
  if v_target.status not in ('published', 'superseded') then
    raise exception 'TARGET_NOT_PUBLISHABLE_HISTORY' using errcode = 'P0001';
  end if;
  if v_target.id = v_website.current_version_id then
    raise exception 'TARGET_ALREADY_CURRENT' using errcode = 'P0001';
  end if;

  if p_expected_current_version_id is null then
    if v_website.current_version_id is not null then
      raise exception 'VERSION_CONFLICT' using errcode = 'P0001';
    end if;
  elsif p_expected_current_version_id is distinct from v_website.current_version_id then
    raise exception 'VERSION_CONFLICT' using errcode = 'P0001';
  end if;

  if v_website.current_version_id is not null then
    select * into v_prior_version from public.customer_website_versions where id = v_website.current_version_id;
  end if;

  update public.customer_website_versions
  set status = 'published'
  where id = v_target.id
  returning * into v_target;

  if v_prior_version.id is not null and v_prior_version.status = 'published' then
    update public.customer_website_versions
    set status = 'superseded'
    where id = v_prior_version.id;
  end if;

  update public.customer_websites
  set current_version_id = v_target.id, status = 'ready', updated_at = now()
  where id = v_website.id
  returning * into v_website;

  v_hostname := public._website_cms_hostname(v_website, v_access);
  v_verification := public._website_cms_verify_runtime(v_website, v_target, v_hostname);

  insert into public.customer_website_operations (
    website_id, organization_id, operation_kind, candidate_version_id,
    expected_current_version_id, resulting_version_id, status, idempotency_key,
    confirmation, internal_reason, runtime_verification, error_code, created_by
  ) values (
    v_website.id, v_org, 'rollback', v_target.id,
    p_expected_current_version_id, v_target.id,
    case when coalesce((v_verification ->> 'verified')::boolean, false) then 'active' else 'attention' end,
    v_key, true, v_reason, v_verification,
    case when coalesce((v_verification ->> 'verified')::boolean, false) then null else v_verification ->> 'reason' end,
    v_user
  )
  returning * into v_operation;

  perform public.record_trust_audit_event(
    v_org,
    'customer_website_rolled_back',
    case when v_operation.status = 'active' then 'success' else 'pending' end,
    'website_cms',
    v_reason,
    'operator',
    v_website.installation_id,
    jsonb_build_object(
      'website_id', v_website.id,
      'operation_id', v_operation.id,
      'target_version_id', v_target.id,
      'previous_version_id', v_prior_version.id,
      'idempotency_key', v_key,
      'verified', coalesce((v_verification ->> 'verified')::boolean, false)
    )
  );

  return jsonb_build_object(
    'operation_id', v_operation.id,
    'status', v_operation.status,
    'version_id', v_target.id,
    'version_number', v_target.version_number,
    'resulting_version_id', v_operation.resulting_version_id,
    'runtime_verification', v_verification,
    'idempotent_replay', false
  );
end;
$$;

revoke all on function public.rollback_customer_website_version(uuid, uuid, text, boolean, text)
  from public, anon;
grant execute on function public.rollback_customer_website_version(uuid, uuid, text, boolean, text)
  to authenticated;

-- ---------------------------------------------------------------------------
-- 5. Platform reconcile
-- ---------------------------------------------------------------------------

create or replace function public.platform_reconcile_customer_website_publish(
  p_organization_id uuid,
  p_operation_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_operation public.customer_website_operations;
  v_website public.customer_websites;
  v_version public.customer_website_versions;
  v_hostname text;
  v_verification jsonb;
begin
  perform public._platform_require_high_risk_write();

  if p_organization_id is null then
    raise exception 'INVALID_ORGANIZATION' using errcode = 'P0001';
  end if;

  select * into v_operation
  from public.customer_website_operations
  where id = p_operation_id and organization_id = p_organization_id
  for update;
  if v_operation.id is null then
    raise exception 'OPERATION_NOT_FOUND' using errcode = 'P0001';
  end if;
  if v_operation.operation_kind not in ('publish', 'rollback') then
    raise exception 'OPERATION_NOT_RECONCILABLE' using errcode = 'P0001';
  end if;

  select * into v_website from public.customer_websites where id = v_operation.website_id;
  if v_website.id is null then
    raise exception 'WEBSITE_NOT_PROVISIONED' using errcode = 'P0001';
  end if;

  select * into v_version
  from public.customer_website_versions
  where id = coalesce(v_operation.resulting_version_id, v_operation.candidate_version_id);
  if v_version.id is null then
    raise exception 'VERSION_NOT_FOUND' using errcode = 'P0001';
  end if;

  v_hostname := (select cd.domain from public.customer_domains cd where cd.id = v_website.domain_id);
  v_verification := public._website_cms_verify_runtime(v_website, v_version, v_hostname);

  update public.customer_website_operations
  set
    status = case when coalesce((v_verification ->> 'verified')::boolean, false) then 'active' else 'attention' end,
    resulting_version_id = case when coalesce((v_verification ->> 'verified')::boolean, false) then v_version.id else resulting_version_id end,
    runtime_verification = v_verification,
    error_code = case when coalesce((v_verification ->> 'verified')::boolean, false) then null else v_verification ->> 'reason' end,
    updated_at = now()
  where id = v_operation.id
  returning * into v_operation;

  perform public.record_platform_admin_audit_event(
    'platform_customer_website_reconcile',
    'customer',
    p_organization_id::text,
    jsonb_build_object(
      'organization_id', p_organization_id,
      'operation_id', v_operation.id,
      'status', v_operation.status,
      'verified', coalesce((v_verification ->> 'verified')::boolean, false)
    )
  );

  return jsonb_build_object(
    'operation_id', v_operation.id,
    'status', v_operation.status,
    'runtime_verification', v_verification
  );
end;
$$;

revoke all on function public.platform_reconcile_customer_website_publish(uuid, uuid) from public, anon;
grant execute on function public.platform_reconcile_customer_website_publish(uuid, uuid) to authenticated;
