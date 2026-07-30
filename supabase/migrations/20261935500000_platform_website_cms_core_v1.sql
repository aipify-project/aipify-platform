-- AIPIFY.APP+PLATFORM.WEBSITE.CMS.CORE.V1
-- Authoritative Website CMS core schema: websites, pages, page revisions,
-- versions, previews, and the publish/rollback/reconcile operations ledger.
-- No customer seeds. No website/page creation on apply. No publish on apply.
-- Preserves kompis_operator_drafts and kompis_website_ops_previews (V4) untouched
-- as the drafting/preview surface that feeds candidate builds (migration 2).

set search_path = public;

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------

create table if not exists public.customer_websites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid not null references public.customers (id) on delete cascade,
  domain_id uuid references public.customer_domains (id) on delete set null,
  installation_id uuid references public.installations (id) on delete set null,
  default_locale text not null default 'en',
  active_locales text[] not null default array['en', 'no', 'sv', 'da', 'pl', 'uk'],
  status text not null default 'provisioned'
    check (status in ('provisioned', 'ready', 'attention', 'archived')),
  current_version_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id)
);

create index if not exists customer_websites_domain_idx
  on public.customer_websites (domain_id);
create index if not exists customer_websites_installation_idx
  on public.customer_websites (installation_id);

create table if not exists public.customer_website_pages (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.customer_websites (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  path text not null,
  page_type text not null default 'page',
  status text not null default 'active'
    check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (website_id, path)
);

create index if not exists customer_website_pages_org_idx
  on public.customer_website_pages (organization_id, updated_at desc);

create table if not exists public.customer_website_page_revisions (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.customer_website_pages (id) on delete cascade,
  website_id uuid not null references public.customer_websites (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  locale text not null,
  revision_number int not null check (revision_number >= 1),
  content jsonb not null default '{}'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  source_draft_id uuid references public.kompis_operator_drafts (id) on delete set null,
  content_checksum text not null,
  created_by uuid,
  created_at timestamptz not null default now(),
  unique (page_id, locale, revision_number)
);

create index if not exists customer_website_page_revisions_page_idx
  on public.customer_website_page_revisions (page_id, locale, revision_number desc);

create table if not exists public.customer_website_versions (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.customer_websites (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  version_number int not null check (version_number >= 1),
  status text not null default 'candidate'
    check (status in ('candidate', 'published', 'superseded', 'failed')),
  previous_version_id uuid references public.customer_website_versions (id) on delete set null,
  source_draft_ids uuid[] not null default array[]::uuid[],
  manifest jsonb not null default '{}'::jsonb,
  content_checksum text not null default '',
  manifest_checksum text not null default '',
  change_summary text,
  preview_verified_at timestamptz,
  created_by uuid,
  created_at timestamptz not null default now(),
  unique (website_id, version_number)
);

create index if not exists customer_website_versions_website_idx
  on public.customer_website_versions (website_id, version_number desc);
create index if not exists customer_website_versions_status_idx
  on public.customer_website_versions (website_id, status);

alter table public.customer_websites
  drop constraint if exists customer_websites_current_version_id_fkey;
alter table public.customer_websites
  add constraint customer_websites_current_version_id_fkey
  foreign key (current_version_id)
  references public.customer_website_versions (id)
  on delete set null;

create table if not exists public.customer_website_previews (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.customer_websites (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  version_id uuid not null references public.customer_website_versions (id) on delete cascade,
  created_by uuid,
  locale text not null,
  noindex boolean not null default true,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists customer_website_previews_version_idx
  on public.customer_website_previews (version_id, expires_at desc);
create index if not exists customer_website_previews_org_idx
  on public.customer_website_previews (organization_id, created_at desc);

create table if not exists public.customer_website_operations (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.customer_websites (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  operation_kind text not null
    check (operation_kind in ('publish', 'rollback', 'reconcile')),
  candidate_version_id uuid references public.customer_website_versions (id) on delete set null,
  expected_current_version_id uuid references public.customer_website_versions (id) on delete set null,
  resulting_version_id uuid references public.customer_website_versions (id) on delete set null,
  status text not null default 'pending_verification'
    check (status in ('pending_verification', 'active', 'attention', 'failed')),
  idempotency_key text not null,
  confirmation boolean not null default false,
  internal_reason text,
  runtime_verification jsonb not null default '{}'::jsonb,
  error_code text,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, idempotency_key)
);

create index if not exists customer_website_operations_website_idx
  on public.customer_website_operations (website_id, created_at desc);

alter table public.customer_websites enable row level security;
alter table public.customer_website_pages enable row level security;
alter table public.customer_website_page_revisions enable row level security;
alter table public.customer_website_versions enable row level security;
alter table public.customer_website_previews enable row level security;
alter table public.customer_website_operations enable row level security;

-- No direct table policies for authenticated — access via SECURITY DEFINER RPCs only.
revoke all on table public.customer_websites from public, anon, authenticated;
revoke all on table public.customer_website_pages from public, anon, authenticated;
revoke all on table public.customer_website_page_revisions from public, anon, authenticated;
revoke all on table public.customer_website_versions from public, anon, authenticated;
revoke all on table public.customer_website_previews from public, anon, authenticated;
revoke all on table public.customer_website_operations from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------

create or replace function public._website_cms_checksum(p_text text)
returns text
language sql
immutable
set search_path = public
as $$
  select md5(coalesce(p_text, ''));
$$;

revoke all on function public._website_cms_checksum(text) from public, anon;
grant execute on function public._website_cms_checksum(text) to authenticated;

create or replace function public._website_cms_reason_ok(p_reason text)
returns boolean
language sql
immutable
set search_path = public
as $$
  select
    p_reason is not null
    and char_length(p_reason) between 3 and 500
    and lower(p_reason) !~ '(sk-|rk_|bearer |password|secret|api[_-]?key|totp|mfa|authorization:)';
$$;

revoke all on function public._website_cms_reason_ok(text) from public, anon;
grant execute on function public._website_cms_reason_ok(text) to authenticated;

-- Resolve (or create) the single V1 website record for the calling APP operator.
create or replace function public._website_cms_upsert_website(
  p_organization_id uuid,
  p_customer_id uuid,
  p_domain text,
  p_installation_id uuid,
  p_ack_ok boolean
)
returns public.customer_websites
language plpgsql
security definer
set search_path = public
as $$
declare
  v_domain_id uuid;
  v_row public.customer_websites;
begin
  if p_domain is not null then
    select cd.id into v_domain_id
    from public.customer_domains cd
    where cd.customer_id = p_customer_id
      and lower(btrim(cd.domain)) = lower(btrim(p_domain))
      and lower(coalesce(cd.status, '')) not in ('removed', 'suspended')
    order by
      (lower(coalesce(cd.verification_status, '')) = 'verified') desc,
      cd.created_at desc
    limit 1;
  end if;

  select * into v_row
  from public.customer_websites
  where organization_id = p_organization_id
  for update;

  if v_row.id is not null then
    update public.customer_websites
    set
      domain_id = coalesce(v_domain_id, domain_id),
      installation_id = coalesce(p_installation_id, installation_id),
      status = case
        when status = 'archived' then status
        when p_ack_ok then 'ready'
        else 'provisioned'
      end,
      updated_at = now()
    where id = v_row.id
    returning * into v_row;
    return v_row;
  end if;

  insert into public.customer_websites (
    organization_id, customer_id, domain_id, installation_id, status
  ) values (
    p_organization_id,
    p_customer_id,
    v_domain_id,
    p_installation_id,
    case when p_ack_ok then 'ready' else 'provisioned' end
  )
  returning * into v_row;

  return v_row;
end;
$$;

revoke all on function public._website_cms_upsert_website(uuid, uuid, text, uuid, boolean)
  from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. APP RPCs
-- ---------------------------------------------------------------------------

create or replace function public.ensure_customer_website(p_internal_reason text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_customer uuid;
  v_domain text;
  v_install uuid;
  v_ack_ok boolean;
  v_reason text := nullif(btrim(coalesce(p_internal_reason, '')), '');
  v_existing_count int;
  v_website public.customer_websites;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access ->> 'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  if not public._website_cms_reason_ok(v_reason) then
    raise exception 'INVALID_INTERNAL_REASON' using errcode = 'P0001';
  end if;

  v_org := (v_access ->> 'organization_id')::uuid;
  v_customer := (v_access ->> 'customer_id')::uuid;
  v_domain := nullif(btrim(coalesce(v_access ->> 'domain', '')), '');
  v_install := nullif(v_access ->> 'installation_id', '')::uuid;
  v_ack_ok := coalesce((v_access -> 'acknowledgement' ->> 'ok')::boolean, false);

  select count(*) into v_existing_count
  from public.customer_websites
  where organization_id = v_org;

  v_website := public._website_cms_upsert_website(v_org, v_customer, v_domain, v_install, v_ack_ok);

  if v_existing_count = 0 then
    perform public.record_trust_audit_event(
      v_org,
      'customer_website_ensured',
      'success',
      'website_cms',
      v_reason,
      'operator',
      v_install,
      jsonb_build_object('website_id', v_website.id, 'created', true)
    );
  end if;

  return jsonb_build_object(
    'id', v_website.id,
    'organization_id', v_website.organization_id,
    'domain_id', v_website.domain_id,
    'installation_id', v_website.installation_id,
    'default_locale', v_website.default_locale,
    'active_locales', to_jsonb(v_website.active_locales),
    'status', v_website.status,
    'current_version_id', v_website.current_version_id,
    'created', v_existing_count = 0,
    'created_at', v_website.created_at,
    'updated_at', v_website.updated_at
  );
end;
$$;

revoke all on function public.ensure_customer_website(text) from public, anon;
grant execute on function public.ensure_customer_website(text) to authenticated;

create or replace function public.get_customer_website_cms_context()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_website public.customer_websites;
  v_version public.customer_website_versions;
  v_ack_ok boolean;
  v_delivery_active boolean;
  v_has_publish_history boolean := false;
begin
  begin
    v_access := public._kompis_operator_require_access();
  exception when others then
    return jsonb_build_object('available', false, 'website', null, 'capabilities', jsonb_build_object(
      'authoritative_page_model', false, 'publish_capability', false, 'rollback_capability', false,
      'draft_capability', false, 'preview_capability', false
    ));
  end;

  if coalesce((v_access ->> 'available')::boolean, false) is not true then
    return jsonb_build_object('available', false, 'website', null, 'capabilities', jsonb_build_object(
      'authoritative_page_model', false, 'publish_capability', false, 'rollback_capability', false,
      'draft_capability', false, 'preview_capability', false
    ));
  end if;

  v_org := (v_access ->> 'organization_id')::uuid;
  v_ack_ok := coalesce((v_access -> 'acknowledgement' ->> 'ok')::boolean, false);
  v_delivery_active := v_ack_ok;

  select * into v_website from public.customer_websites where organization_id = v_org;

  if v_website.id is not null and v_website.current_version_id is not null then
    select * into v_version from public.customer_website_versions where id = v_website.current_version_id;
  end if;

  if v_website.id is not null then
    select exists(
      select 1 from public.customer_website_versions
      where website_id = v_website.id
        and status in ('published', 'superseded')
        and id is distinct from v_website.current_version_id
    ) into v_has_publish_history;
  end if;

  return jsonb_build_object(
    'available', true,
    'organization_id', v_org,
    'domain', v_access ->> 'domain',
    'installation_id', v_access ->> 'installation_id',
    'acknowledgement', v_access -> 'acknowledgement',
    'website', case when v_website.id is null then null else jsonb_build_object(
      'id', v_website.id,
      'status', v_website.status,
      'domain_id', v_website.domain_id,
      'installation_id', v_website.installation_id,
      'default_locale', v_website.default_locale,
      'active_locales', to_jsonb(v_website.active_locales),
      'current_version_id', v_website.current_version_id,
      'created_at', v_website.created_at,
      'updated_at', v_website.updated_at
    ) end,
    'current_version', case when v_version.id is null then null else jsonb_build_object(
      'id', v_version.id,
      'version_number', v_version.version_number,
      'status', v_version.status,
      'content_checksum', v_version.content_checksum,
      'manifest_checksum', v_version.manifest_checksum,
      'change_summary', v_version.change_summary,
      'preview_verified_at', v_version.preview_verified_at,
      'created_at', v_version.created_at
    ) end,
    'capabilities', jsonb_build_object(
      'authoritative_page_model', v_website.id is not null,
      'draft_capability', true,
      'preview_capability', true,
      'publish_capability', v_website.id is not null and v_delivery_active,
      'rollback_capability', v_website.id is not null and v_delivery_active and v_has_publish_history
    )
  );
end;
$$;

revoke all on function public.get_customer_website_cms_context() from public, anon;
grant execute on function public.get_customer_website_cms_context() to authenticated;

create or replace function public.get_customer_website_pages(p_limit int default 50)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_website public.customer_websites;
  v_limit int := least(greatest(coalesce(p_limit, 50), 1), 200);
  v_items jsonb;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access ->> 'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access ->> 'organization_id')::uuid;

  select * into v_website from public.customer_websites where organization_id = v_org;
  if v_website.id is null then
    return jsonb_build_object('website_id', null, 'pages', '[]'::jsonb);
  end if;

  select coalesce(jsonb_agg(row_data order by row_data ->> 'updated_at' desc), '[]'::jsonb)
  into v_items
  from (
    select jsonb_build_object(
      'id', p.id,
      'path', p.path,
      'page_type', p.page_type,
      'status', p.status,
      'locales', (
        select coalesce(jsonb_agg(distinct r.locale), '[]'::jsonb)
        from public.customer_website_page_revisions r
        where r.page_id = p.id
      ),
      'latest_revision_number', (
        select max(r.revision_number) from public.customer_website_page_revisions r where r.page_id = p.id
      ),
      'created_at', p.created_at,
      'updated_at', p.updated_at
    ) as row_data
    from public.customer_website_pages p
    where p.website_id = v_website.id
    order by p.updated_at desc
    limit v_limit
  ) rows;

  return jsonb_build_object('website_id', v_website.id, 'pages', v_items);
end;
$$;

revoke all on function public.get_customer_website_pages(int) from public, anon;
grant execute on function public.get_customer_website_pages(int) to authenticated;

create or replace function public.get_customer_website_page_detail(p_page_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_page public.customer_website_pages;
  v_revisions jsonb;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access ->> 'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access ->> 'organization_id')::uuid;

  select * into v_page
  from public.customer_website_pages
  where id = p_page_id and organization_id = v_org;
  if v_page.id is null then
    raise exception 'PAGE_NOT_FOUND' using errcode = 'P0001';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id,
    'locale', r.locale,
    'revision_number', r.revision_number,
    'content', r.content,
    'seo', r.seo,
    'source_draft_id', r.source_draft_id,
    'content_checksum', r.content_checksum,
    'created_at', r.created_at
  ) order by r.locale, r.revision_number desc), '[]'::jsonb)
  into v_revisions
  from public.customer_website_page_revisions r
  where r.page_id = v_page.id;

  return jsonb_build_object(
    'id', v_page.id,
    'website_id', v_page.website_id,
    'path', v_page.path,
    'page_type', v_page.page_type,
    'status', v_page.status,
    'created_at', v_page.created_at,
    'updated_at', v_page.updated_at,
    'revisions', v_revisions
  );
end;
$$;

revoke all on function public.get_customer_website_page_detail(uuid) from public, anon;
grant execute on function public.get_customer_website_page_detail(uuid) to authenticated;

create or replace function public.get_customer_website_versions(p_limit int default 20)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_website public.customer_websites;
  v_limit int := least(greatest(coalesce(p_limit, 20), 1), 100);
  v_items jsonb;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access ->> 'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access ->> 'organization_id')::uuid;

  select * into v_website from public.customer_websites where organization_id = v_org;
  if v_website.id is null then
    return jsonb_build_object('website_id', null, 'current_version_id', null, 'versions', '[]'::jsonb);
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', v.id,
    'version_number', v.version_number,
    'status', v.status,
    'previous_version_id', v.previous_version_id,
    'source_draft_ids', to_jsonb(v.source_draft_ids),
    'content_checksum', v.content_checksum,
    'manifest_checksum', v.manifest_checksum,
    'change_summary', v.change_summary,
    'preview_verified_at', v.preview_verified_at,
    'created_at', v.created_at
  ) order by v.version_number desc), '[]'::jsonb)
  into v_items
  from (
    select * from public.customer_website_versions
    where website_id = v_website.id
    order by version_number desc
    limit v_limit
  ) v;

  return jsonb_build_object(
    'website_id', v_website.id,
    'current_version_id', v_website.current_version_id,
    'versions', v_items
  );
end;
$$;

revoke all on function public.get_customer_website_versions(int) from public, anon;
grant execute on function public.get_customer_website_versions(int) to authenticated;

create or replace function public.get_customer_website_version_detail(p_version_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_version public.customer_website_versions;
  v_previews jsonb;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access ->> 'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access ->> 'organization_id')::uuid;

  select * into v_version
  from public.customer_website_versions
  where id = p_version_id and organization_id = v_org;
  if v_version.id is null then
    raise exception 'VERSION_NOT_FOUND' using errcode = 'P0001';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', pv.id,
    'locale', pv.locale,
    'noindex', pv.noindex,
    'expires_at', pv.expires_at,
    'expired', pv.expires_at < now(),
    'created_at', pv.created_at
  ) order by pv.created_at desc), '[]'::jsonb)
  into v_previews
  from public.customer_website_previews pv
  where pv.version_id = v_version.id;

  return jsonb_build_object(
    'id', v_version.id,
    'website_id', v_version.website_id,
    'version_number', v_version.version_number,
    'status', v_version.status,
    'previous_version_id', v_version.previous_version_id,
    'source_draft_ids', to_jsonb(v_version.source_draft_ids),
    'manifest', v_version.manifest,
    'content_checksum', v_version.content_checksum,
    'manifest_checksum', v_version.manifest_checksum,
    'change_summary', v_version.change_summary,
    'preview_verified_at', v_version.preview_verified_at,
    'created_at', v_version.created_at,
    'previews', v_previews
  );
end;
$$;

revoke all on function public.get_customer_website_version_detail(uuid) from public, anon;
grant execute on function public.get_customer_website_version_detail(uuid) to authenticated;

create or replace function public.get_customer_website_publish_history(p_limit int default 20)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_website public.customer_websites;
  v_limit int := least(greatest(coalesce(p_limit, 20), 1), 100);
  v_items jsonb;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access ->> 'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access ->> 'organization_id')::uuid;

  select * into v_website from public.customer_websites where organization_id = v_org;
  if v_website.id is null then
    return jsonb_build_object('website_id', null, 'operations', '[]'::jsonb);
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id,
    'operation_kind', o.operation_kind,
    'candidate_version_id', o.candidate_version_id,
    'expected_current_version_id', o.expected_current_version_id,
    'resulting_version_id', o.resulting_version_id,
    'status', o.status,
    'internal_reason', o.internal_reason,
    'error_code', o.error_code,
    'created_at', o.created_at,
    'updated_at', o.updated_at
  ) order by o.created_at desc), '[]'::jsonb)
  into v_items
  from (
    select * from public.customer_website_operations
    where website_id = v_website.id
      and operation_kind in ('publish', 'rollback')
    order by created_at desc
    limit v_limit
  ) o;

  return jsonb_build_object('website_id', v_website.id, 'operations', v_items);
end;
$$;

revoke all on function public.get_customer_website_publish_history(int) from public, anon;
grant execute on function public.get_customer_website_publish_history(int) to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Public read-only resolve (no install tokens, no secrets)
-- ---------------------------------------------------------------------------

create or replace function public.get_public_website_active_version(p_domain text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_domain text := lower(btrim(coalesce(p_domain, '')));
  v_domain_row public.customer_domains;
  v_website public.customer_websites;
  v_version public.customer_website_versions;
begin
  if v_domain = '' then
    return jsonb_build_object('ok', false, 'reason', 'domain_required');
  end if;

  select * into v_domain_row
  from public.customer_domains cd
  where lower(btrim(cd.domain)) = v_domain
    and lower(coalesce(cd.status, '')) not in ('removed', 'suspended')
    and (
      lower(coalesce(cd.verification_status, '')) = 'verified'
      or cd.verified_at is not null
    )
  order by cd.created_at desc
  limit 1;

  if v_domain_row.id is null then
    return jsonb_build_object('ok', false, 'reason', 'domain_not_verified');
  end if;

  select * into v_website
  from public.customer_websites
  where organization_id = v_domain_row.customer_id
    and status <> 'archived';

  if v_website.id is null or v_website.current_version_id is null then
    return jsonb_build_object('ok', false, 'reason', 'website_not_published');
  end if;

  select * into v_version
  from public.customer_website_versions
  where id = v_website.current_version_id
    and status = 'published';

  if v_version.id is null then
    return jsonb_build_object('ok', false, 'reason', 'version_not_published');
  end if;

  return jsonb_build_object(
    'ok', true,
    'domain', v_domain_row.domain,
    'website_id', v_website.id,
    'version_id', v_version.id,
    'version_number', v_version.version_number,
    'default_locale', v_website.default_locale,
    'active_locales', to_jsonb(v_website.active_locales),
    'manifest', v_version.manifest,
    'content_checksum', v_version.content_checksum,
    'manifest_checksum', v_version.manifest_checksum,
    'published_at', v_version.created_at
  );
end;
$$;

revoke all on function public.get_public_website_active_version(text) from public;
grant execute on function public.get_public_website_active_version(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 5. Platform RPCs (read + high-risk ensure)
-- ---------------------------------------------------------------------------

create or replace function public.platform_get_customer_website_status(p_organization_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_website public.customer_websites;
  v_version public.customer_website_versions;
  v_page_count int := 0;
begin
  if not public.is_platform_admin() then
    raise exception 'PLATFORM_FORBIDDEN' using errcode = 'P0001';
  end if;
  if p_organization_id is null then
    raise exception 'INVALID_ORGANIZATION' using errcode = 'P0001';
  end if;

  select * into v_website from public.customer_websites where organization_id = p_organization_id;
  if v_website.id is null then
    return jsonb_build_object('organization_id', p_organization_id, 'website', null);
  end if;

  select count(*) into v_page_count
  from public.customer_website_pages
  where website_id = v_website.id;

  if v_website.current_version_id is not null then
    select * into v_version from public.customer_website_versions where id = v_website.current_version_id;
  end if;

  return jsonb_build_object(
    'organization_id', p_organization_id,
    'website', jsonb_build_object(
      'id', v_website.id,
      'status', v_website.status,
      'domain_id', v_website.domain_id,
      'installation_id', v_website.installation_id,
      'default_locale', v_website.default_locale,
      'active_locales', to_jsonb(v_website.active_locales),
      'page_count', v_page_count,
      'current_version', case when v_version.id is null then null else jsonb_build_object(
        'id', v_version.id,
        'version_number', v_version.version_number,
        'status', v_version.status,
        'created_at', v_version.created_at
      ) end,
      'created_at', v_website.created_at,
      'updated_at', v_website.updated_at
    )
  );
end;
$$;

revoke all on function public.platform_get_customer_website_status(uuid) from public, anon;
grant execute on function public.platform_get_customer_website_status(uuid) to authenticated;

create or replace function public.platform_ensure_customer_website(
  p_organization_id uuid,
  p_internal_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status jsonb;
  v_reason text := nullif(btrim(coalesce(p_internal_reason, '')), '');
  v_domain text;
  v_install uuid;
  v_ack_ok boolean;
  v_existing_count int;
  v_website public.customer_websites;
begin
  perform public._platform_require_high_risk_write();

  if p_organization_id is null then
    raise exception 'INVALID_ORGANIZATION' using errcode = 'P0001';
  end if;
  if not public._website_cms_reason_ok(v_reason) then
    raise exception 'INVALID_INTERNAL_REASON' using errcode = 'P0001';
  end if;

  v_status := public.get_platform_portal_app_kompis_delivery_status(p_organization_id);
  if v_status is null then
    raise exception 'CUSTOMER_NOT_FOUND' using errcode = 'P0001';
  end if;

  v_domain := nullif(btrim(coalesce(v_status -> 'domain' ->> 'hostname', '')), '');
  v_install := nullif(v_status -> 'installation' ->> 'id', '')::uuid;
  v_ack_ok := coalesce((v_status -> 'acknowledgement' ->> 'ok')::boolean, false);

  select count(*) into v_existing_count
  from public.customer_websites
  where organization_id = p_organization_id;

  v_website := public._website_cms_upsert_website(
    p_organization_id, p_organization_id, v_domain, v_install, v_ack_ok
  );

  perform public.record_platform_admin_audit_event(
    'platform_customer_website_ensure',
    'customer',
    p_organization_id::text,
    jsonb_build_object(
      'organization_id', p_organization_id,
      'website_id', v_website.id,
      'created', v_existing_count = 0,
      'internal_reason', v_reason
    )
  );

  return jsonb_build_object(
    'organization_id', p_organization_id,
    'website_id', v_website.id,
    'status', v_website.status,
    'created', v_existing_count = 0
  );
end;
$$;

revoke all on function public.platform_ensure_customer_website(uuid, text) from public, anon;
grant execute on function public.platform_ensure_customer_website(uuid, text) to authenticated;
