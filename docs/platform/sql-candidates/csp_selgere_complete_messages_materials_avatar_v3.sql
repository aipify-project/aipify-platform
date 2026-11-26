-- =============================================================================
-- PREPARED_ONLY — CSP SELGERE Messages + Materials + Avatar SQL/RPC V3
-- DO NOT APPLY without explicit owner Staging approval.
-- Production requires a SEPARATE explicit owner approval after Staging verify.
--
-- Prerequisite (already LIVE on Staging + Production Core):
--   csp_partner_profiles, csp_audit_events, is_platform_admin(), _csp_audit()
--
-- Delta only:
--   1) optional avatar_url on csp_partner_profiles
--   2) partner messages (+ recipients) + list/send/read RPCs
--   3) sales materials (+ versions) + list/upsert/publish/withdraw RPCs
--
-- Apply-side effects = 0 (no seeds, no partner status changes, no email sends,
-- no Storage writes, no auth/payment mutations).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0) Helpers (local to this package; safe to re-run)
-- -----------------------------------------------------------------------------
create or replace function public._csp_messages_partner_for_auth(p_uid uuid)
returns public.csp_partner_profiles
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_p public.csp_partner_profiles%rowtype;
begin
  if p_uid is null then
    return null;
  end if;
  select * into v_p from public.csp_partner_profiles where auth_user_id = p_uid;
  if not found then
    return null;
  end if;
  return v_p;
end;
$$;

create or replace function public._csp_messages_portal_status_ok(p_status text)
returns boolean
language sql
immutable
as $$
  select coalesce(p_status, '') in ('approved', 'active', 'certified', 'in_academy');
$$;

revoke all on function public._csp_messages_partner_for_auth(uuid) from public, anon, authenticated, service_role;
revoke all on function public._csp_messages_portal_status_ok(text) from public, anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- 1) Avatar URL column (optional Core sync pointer — bytes stay in Storage)
-- -----------------------------------------------------------------------------
alter table public.csp_partner_profiles
  add column if not exists avatar_url text;

comment on column public.csp_partner_profiles.avatar_url is
  'Optional same-origin avatar pointer for admin ranking/profile sync. Binary lives in private Storage; never store image bytes here.';

-- -----------------------------------------------------------------------------
-- 2) Messages
-- -----------------------------------------------------------------------------
create table if not exists public.csp_partner_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null,
  partner_id uuid not null references public.csp_partner_profiles(id),
  direction text not null check (direction in ('admin_to_partner', 'partner_to_admin')),
  subject text,
  body text not null,
  template_key text,
  delivery_status text not null default 'recorded'
    check (delivery_status in ('recorded', 'queued', 'sent', 'failed', 'read')),
  created_by_auth_user_id uuid,
  created_at timestamptz not null default now(),
  read_at timestamptz,
  idempotency_key text,
  metadata jsonb not null default '{}'::jsonb,
  constraint csp_partner_messages_body_len check (char_length(body) between 1 and 20000),
  constraint csp_partner_messages_subject_len check (subject is null or char_length(subject) <= 500)
);

create unique index if not exists csp_partner_messages_idempotency_uidx
  on public.csp_partner_messages (partner_id, direction, idempotency_key)
  where idempotency_key is not null;

create index if not exists csp_partner_messages_partner_created_idx
  on public.csp_partner_messages (partner_id, created_at desc);

create index if not exists csp_partner_messages_thread_idx
  on public.csp_partner_messages (thread_id, created_at);

alter table public.csp_partner_messages enable row level security;
alter table public.csp_partner_messages force row level security;
revoke all on table public.csp_partner_messages from public, anon, authenticated;

create table if not exists public.csp_partner_message_recipients (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.csp_partner_messages(id) on delete cascade,
  partner_id uuid not null references public.csp_partner_profiles(id),
  delivery_status text not null default 'recorded'
    check (delivery_status in ('recorded', 'queued', 'sent', 'failed', 'read')),
  created_at timestamptz not null default now(),
  unique (message_id, partner_id)
);

create index if not exists csp_partner_message_recipients_partner_idx
  on public.csp_partner_message_recipients (partner_id, created_at desc);

alter table public.csp_partner_message_recipients enable row level security;
alter table public.csp_partner_message_recipients force row level security;
revoke all on table public.csp_partner_message_recipients from public, anon, authenticated;

-- List messages: partner = own only + portal-allowed status; admin = any partner filter.
create or replace function public.csp_list_partner_messages(
  p_partner_id uuid default null,
  p_limit integer default 100
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_admin boolean := coalesce(public.is_platform_admin(), false);
  v_p public.csp_partner_profiles%rowtype;
  v_partner uuid;
  v_limit integer := greatest(1, least(coalesce(p_limit, 100), 500));
begin
  if v_uid is null then
    return jsonb_build_object('found', false, 'error', 'unauthorized');
  end if;

  if v_admin then
    v_partner := p_partner_id;
  else
    v_p := public._csp_messages_partner_for_auth(v_uid);
    if v_p.id is null then
      return jsonb_build_object('found', false, 'error', 'partner_not_found');
    end if;
    if not public._csp_messages_portal_status_ok(v_p.status) then
      return jsonb_build_object('found', false, 'error', 'partner_not_active');
    end if;
    v_partner := v_p.id;
    if p_partner_id is not null and p_partner_id <> v_partner then
      return jsonb_build_object('found', false, 'error', 'forbidden');
    end if;
  end if;

  return jsonb_build_object(
    'found', true,
    'backend_ready', true,
    'messages', coalesce((
      select jsonb_agg(row_to_json(x)::jsonb order by x.created_at desc)
      from (
        select
          m.id,
          m.thread_id,
          m.partner_id,
          m.direction,
          m.subject,
          m.body,
          m.delivery_status,
          m.created_at,
          m.read_at,
          m.created_by_auth_user_id
        from public.csp_partner_messages m
        where (v_partner is null or m.partner_id = v_partner)
        order by m.created_at desc
        limit v_limit
      ) x
    ), '[]'::jsonb)
  );
end;
$$;

-- Send message. Admin → any partner. Partner reply only when portal-allowed.
-- Idempotent on (partner_id, direction, idempotency_key).
create or replace function public.csp_send_partner_message(
  p_partner_id uuid,
  p_direction text,
  p_body text,
  p_subject text default null,
  p_thread_id uuid default null,
  p_idempotency_key text default null,
  p_template_key text default null
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_admin boolean := coalesce(public.is_platform_admin(), false);
  v_p public.csp_partner_profiles%rowtype;
  v_self public.csp_partner_profiles%rowtype;
  v_existing public.csp_partner_messages%rowtype;
  v_id uuid;
  v_thread uuid;
  v_direction text := nullif(trim(coalesce(p_direction, '')), '');
  v_body text := nullif(trim(coalesce(p_body, '')), '');
  v_subject text := nullif(trim(coalesce(p_subject, '')), '');
  v_key text := nullif(trim(coalesce(p_idempotency_key, '')), '');
begin
  if v_uid is null then
    return jsonb_build_object('found', false, 'error', 'unauthorized');
  end if;
  if p_partner_id is null then
    return jsonb_build_object('found', false, 'error', 'partner_id_required');
  end if;
  if v_direction is null or v_direction not in ('admin_to_partner', 'partner_to_admin') then
    return jsonb_build_object('found', false, 'error', 'invalid_direction');
  end if;
  if v_body is null or char_length(v_body) > 20000 then
    return jsonb_build_object('found', false, 'error', 'invalid_body');
  end if;
  if v_subject is not null and char_length(v_subject) > 500 then
    return jsonb_build_object('found', false, 'error', 'invalid_subject');
  end if;

  select * into v_p from public.csp_partner_profiles where id = p_partner_id;
  if not found then
    return jsonb_build_object('found', false, 'error', 'partner_not_found');
  end if;

  if v_admin then
    if v_direction <> 'admin_to_partner' then
      return jsonb_build_object('found', false, 'error', 'forbidden');
    end if;
  else
    v_self := public._csp_messages_partner_for_auth(v_uid);
    if v_self.id is null then
      return jsonb_build_object('found', false, 'error', 'partner_not_found');
    end if;
    if not public._csp_messages_portal_status_ok(v_self.status) then
      return jsonb_build_object('found', false, 'error', 'partner_not_active');
    end if;
    if v_self.id <> p_partner_id then
      return jsonb_build_object('found', false, 'error', 'forbidden');
    end if;
    if v_direction <> 'partner_to_admin' then
      return jsonb_build_object('found', false, 'error', 'forbidden');
    end if;
  end if;

  if v_key is not null then
    select * into v_existing
    from public.csp_partner_messages
    where partner_id = p_partner_id
      and direction = v_direction
      and idempotency_key = v_key;
    if found then
      return jsonb_build_object(
        'found', true,
        'created', false,
        'replayed', true,
        'message_id', v_existing.id,
        'thread_id', v_existing.thread_id
      );
    end if;
  end if;

  v_thread := coalesce(p_thread_id, gen_random_uuid());
  insert into public.csp_partner_messages (
    thread_id, partner_id, direction, subject, body, template_key,
    delivery_status, created_by_auth_user_id, idempotency_key
  ) values (
    v_thread, p_partner_id, v_direction, v_subject, v_body, nullif(trim(coalesce(p_template_key, '')), ''),
    'recorded', v_uid, v_key
  )
  returning id into v_id;

  insert into public.csp_partner_message_recipients (message_id, partner_id, delivery_status)
  values (v_id, p_partner_id, 'recorded')
  on conflict (message_id, partner_id) do nothing;

  perform public._csp_audit(
    v_uid,
    case when v_admin then 'platform_admin' else 'partner' end,
    'partner_message_sent',
    'csp_partner_messages',
    v_id,
    jsonb_build_object(
      'partner_id', p_partner_id,
      'direction', v_direction,
      'thread_id', v_thread,
      'idempotency_key_present', v_key is not null
    )
  );

  return jsonb_build_object(
    'found', true,
    'created', true,
    'replayed', false,
    'message_id', v_id,
    'thread_id', v_thread
  );
exception
  when unique_violation then
    select * into v_existing
    from public.csp_partner_messages
    where partner_id = p_partner_id
      and direction = v_direction
      and idempotency_key = v_key;
    if found then
      return jsonb_build_object(
        'found', true,
        'created', false,
        'replayed', true,
        'message_id', v_existing.id,
        'thread_id', v_existing.thread_id
      );
    end if;
    return jsonb_build_object('found', false, 'error', 'send_failed');
end;
$$;

create or replace function public.csp_mark_partner_message_read(p_message_id uuid)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_admin boolean := coalesce(public.is_platform_admin(), false);
  v_m public.csp_partner_messages%rowtype;
  v_self public.csp_partner_profiles%rowtype;
begin
  if v_uid is null then
    return jsonb_build_object('found', false, 'error', 'unauthorized');
  end if;
  if p_message_id is null then
    return jsonb_build_object('found', false, 'error', 'message_id_required');
  end if;

  select * into v_m from public.csp_partner_messages where id = p_message_id for update;
  if not found then
    return jsonb_build_object('found', false, 'error', 'not_found');
  end if;

  if v_admin then
    if v_m.direction <> 'partner_to_admin' then
      return jsonb_build_object('found', false, 'error', 'forbidden');
    end if;
  else
    v_self := public._csp_messages_partner_for_auth(v_uid);
    if v_self.id is null then
      return jsonb_build_object('found', false, 'error', 'partner_not_found');
    end if;
    if not public._csp_messages_portal_status_ok(v_self.status) then
      return jsonb_build_object('found', false, 'error', 'partner_not_active');
    end if;
    if v_m.partner_id <> v_self.id or v_m.direction <> 'admin_to_partner' then
      return jsonb_build_object('found', false, 'error', 'forbidden');
    end if;
  end if;

  if v_m.read_at is not null then
    return jsonb_build_object('found', true, 'changed', false, 'message_id', v_m.id, 'read_at', v_m.read_at);
  end if;

  update public.csp_partner_messages
  set read_at = now(), delivery_status = 'read'
  where id = v_m.id
  returning * into v_m;

  update public.csp_partner_message_recipients
  set delivery_status = 'read'
  where message_id = v_m.id;

  return jsonb_build_object('found', true, 'changed', true, 'message_id', v_m.id, 'read_at', v_m.read_at);
end;
$$;

-- -----------------------------------------------------------------------------
-- 3) Sales materials (unpublished by default)
-- -----------------------------------------------------------------------------
create table if not exists public.csp_sales_materials (
  id uuid primary key default gen_random_uuid(),
  material_key text not null unique,
  category text not null,
  product_keys text[] not null default '{}',
  locales text[] not null default '{}',
  title text not null,
  description text,
  asset_path text not null,
  mime_hint text,
  version text not null default '1.0',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  withdrawn_at timestamptz,
  created_by_auth_user_id uuid,
  constraint csp_sales_materials_asset_path_ok check (asset_path ~ '^/')
);

alter table public.csp_sales_materials enable row level security;
alter table public.csp_sales_materials force row level security;
revoke all on table public.csp_sales_materials from public, anon, authenticated;

create table if not exists public.csp_sales_material_versions (
  id uuid primary key default gen_random_uuid(),
  material_id uuid not null references public.csp_sales_materials(id),
  version text not null,
  asset_path text not null,
  change_note text,
  created_by_auth_user_id uuid,
  created_at timestamptz not null default now(),
  unique (material_id, version)
);

alter table public.csp_sales_material_versions enable row level security;
alter table public.csp_sales_material_versions force row level security;
revoke all on table public.csp_sales_material_versions from public, anon, authenticated;

-- Partners see published only. Admin may include unpublished.
create or replace function public.csp_list_sales_materials(
  p_include_unpublished boolean default false,
  p_product_key text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_admin boolean := coalesce(public.is_platform_admin(), false);
  v_self public.csp_partner_profiles%rowtype;
  v_include boolean := coalesce(p_include_unpublished, false);
  v_product text := nullif(trim(coalesce(p_product_key, '')), '');
begin
  if v_uid is null then
    return jsonb_build_object('found', false, 'error', 'unauthorized');
  end if;

  if not v_admin then
    v_self := public._csp_messages_partner_for_auth(v_uid);
    if v_self.id is null then
      return jsonb_build_object('found', false, 'error', 'partner_not_found');
    end if;
    if not public._csp_messages_portal_status_ok(v_self.status) then
      return jsonb_build_object('found', false, 'error', 'partner_not_active');
    end if;
    v_include := false; -- partners never see drafts
  end if;

  return jsonb_build_object(
    'found', true,
    'backend_ready', true,
    'materials', coalesce((
      select jsonb_agg(row_to_json(x)::jsonb order by x.updated_at desc)
      from (
        select
          m.id,
          m.material_key,
          m.category,
          m.product_keys,
          m.locales,
          m.title,
          m.description,
          m.asset_path,
          m.mime_hint,
          m.version,
          m.published,
          m.published_at,
          m.withdrawn_at,
          m.updated_at
        from public.csp_sales_materials m
        where (v_include or m.published = true)
          and (
            v_product is null
            or cardinality(m.product_keys) = 0
            or v_product = any (m.product_keys)
          )
        order by m.updated_at desc
        limit 500
      ) x
    ), '[]'::jsonb)
  );
end;
$$;

-- Upsert draft material. Never auto-publishes. Platform Admin only.
-- Idempotent: same material_key + version + asset_path returns existing without duplicate version noise.
create or replace function public.csp_upsert_sales_material(
  p_material_key text,
  p_category text,
  p_title text,
  p_asset_path text,
  p_product_keys text[] default '{}',
  p_locales text[] default '{}',
  p_description text default null,
  p_mime_hint text default null,
  p_version text default '1.0',
  p_change_note text default null
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_key text := nullif(trim(coalesce(p_material_key, '')), '');
  v_category text := nullif(trim(coalesce(p_category, '')), '');
  v_title text := nullif(trim(coalesce(p_title, '')), '');
  v_path text := nullif(trim(coalesce(p_asset_path, '')), '');
  v_version text := coalesce(nullif(trim(coalesce(p_version, '')), ''), '1.0');
  v_id uuid;
  v_existing public.csp_sales_materials%rowtype;
  v_ver public.csp_sales_material_versions%rowtype;
  v_changed boolean := false;
begin
  if v_uid is null then
    return jsonb_build_object('found', false, 'error', 'unauthorized');
  end if;
  if not coalesce(public.is_platform_admin(), false) then
    return jsonb_build_object('found', false, 'error', 'forbidden');
  end if;
  if v_key is null or v_category is null or v_title is null or v_path is null or v_path !~ '^/' then
    return jsonb_build_object('found', false, 'error', 'invalid_payload');
  end if;

  select * into v_existing from public.csp_sales_materials where material_key = v_key;
  if found then
    if v_existing.category is distinct from v_category
      or v_existing.title is distinct from v_title
      or coalesce(v_existing.description, '') is distinct from coalesce(nullif(trim(coalesce(p_description, '')), ''), '')
      or v_existing.asset_path is distinct from v_path
      or coalesce(v_existing.mime_hint, '') is distinct from coalesce(nullif(trim(coalesce(p_mime_hint, '')), ''), '')
      or v_existing.product_keys is distinct from coalesce(p_product_keys, '{}')
      or v_existing.locales is distinct from coalesce(p_locales, '{}')
      or v_existing.version is distinct from v_version
    then
      update public.csp_sales_materials
      set
        category = v_category,
        title = v_title,
        description = nullif(trim(coalesce(p_description, '')), ''),
        asset_path = v_path,
        mime_hint = nullif(trim(coalesce(p_mime_hint, '')), ''),
        product_keys = coalesce(p_product_keys, '{}'),
        locales = coalesce(p_locales, '{}'),
        version = v_version,
        updated_at = now()
      where id = v_existing.id
      returning id into v_id;
      v_changed := true;
    else
      v_id := v_existing.id;
    end if;
  else
    insert into public.csp_sales_materials (
      material_key, category, product_keys, locales, title, description,
      asset_path, mime_hint, version, published, created_by_auth_user_id
    ) values (
      v_key, v_category, coalesce(p_product_keys, '{}'), coalesce(p_locales, '{}'),
      v_title, nullif(trim(coalesce(p_description, '')), ''),
      v_path, nullif(trim(coalesce(p_mime_hint, '')), ''), v_version, false, v_uid
    )
    returning id into v_id;
    v_changed := true;
  end if;

  select * into v_ver
  from public.csp_sales_material_versions
  where material_id = v_id and version = v_version;

  if not found then
    insert into public.csp_sales_material_versions (
      material_id, version, asset_path, change_note, created_by_auth_user_id
    ) values (
      v_id, v_version, v_path, nullif(trim(coalesce(p_change_note, '')), ''), v_uid
    );
    v_changed := true;
  elsif v_ver.asset_path is distinct from v_path
    or coalesce(v_ver.change_note, '') is distinct from coalesce(nullif(trim(coalesce(p_change_note, '')), ''), '')
  then
    update public.csp_sales_material_versions
    set asset_path = v_path,
        change_note = nullif(trim(coalesce(p_change_note, '')), '')
    where id = v_ver.id;
    v_changed := true;
  end if;

  if v_changed then
    perform public._csp_audit(
      v_uid, 'platform_admin', 'sales_material_upserted', 'csp_sales_materials', v_id,
      jsonb_build_object(
        'material_key', v_key,
        'version', v_version,
        'published', false
      )
    );
  end if;

  return jsonb_build_object(
    'found', true,
    'created_or_updated', v_changed,
    'replayed', not v_changed,
    'material_id', v_id,
    'material_key', v_key,
    'published', false
  );
end;
$$;

create or replace function public.csp_publish_sales_material(p_material_id uuid)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_m public.csp_sales_materials%rowtype;
begin
  if v_uid is null then
    return jsonb_build_object('found', false, 'error', 'unauthorized');
  end if;
  if not coalesce(public.is_platform_admin(), false) then
    return jsonb_build_object('found', false, 'error', 'forbidden');
  end if;
  if p_material_id is null then
    return jsonb_build_object('found', false, 'error', 'material_id_required');
  end if;

  select * into v_m from public.csp_sales_materials where id = p_material_id for update;
  if not found then
    return jsonb_build_object('found', false, 'error', 'not_found');
  end if;

  if v_m.published then
    return jsonb_build_object(
      'found', true, 'changed', false, 'material_id', v_m.id, 'published', true, 'published_at', v_m.published_at
    );
  end if;

  update public.csp_sales_materials
  set published = true,
      published_at = now(),
      withdrawn_at = null,
      updated_at = now()
  where id = v_m.id
  returning * into v_m;

  perform public._csp_audit(
    v_uid, 'platform_admin', 'sales_material_published', 'csp_sales_materials', v_m.id,
    jsonb_build_object('material_key', v_m.material_key, 'version', v_m.version)
  );

  return jsonb_build_object(
    'found', true, 'changed', true, 'material_id', v_m.id, 'published', true, 'published_at', v_m.published_at
  );
end;
$$;

create or replace function public.csp_withdraw_sales_material(p_material_id uuid)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_m public.csp_sales_materials%rowtype;
begin
  if v_uid is null then
    return jsonb_build_object('found', false, 'error', 'unauthorized');
  end if;
  if not coalesce(public.is_platform_admin(), false) then
    return jsonb_build_object('found', false, 'error', 'forbidden');
  end if;
  if p_material_id is null then
    return jsonb_build_object('found', false, 'error', 'material_id_required');
  end if;

  select * into v_m from public.csp_sales_materials where id = p_material_id for update;
  if not found then
    return jsonb_build_object('found', false, 'error', 'not_found');
  end if;

  if not v_m.published then
    return jsonb_build_object(
      'found', true, 'changed', false, 'material_id', v_m.id, 'published', false, 'withdrawn_at', v_m.withdrawn_at
    );
  end if;

  update public.csp_sales_materials
  set published = false,
      withdrawn_at = now(),
      updated_at = now()
  where id = v_m.id
  returning * into v_m;

  perform public._csp_audit(
    v_uid, 'platform_admin', 'sales_material_withdrawn', 'csp_sales_materials', v_m.id,
    jsonb_build_object('material_key', v_m.material_key, 'version', v_m.version)
  );

  return jsonb_build_object(
    'found', true, 'changed', true, 'material_id', v_m.id, 'published', false, 'withdrawn_at', v_m.withdrawn_at
  );
end;
$$;

-- -----------------------------------------------------------------------------
-- 4) Avatar Core sync pointer (Storage remains byte source of truth)
-- -----------------------------------------------------------------------------
create or replace function public.csp_set_partner_avatar_url(
  p_avatar_url text,
  p_partner_id uuid default null
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_admin boolean := coalesce(public.is_platform_admin(), false);
  v_self public.csp_partner_profiles%rowtype;
  v_target uuid;
  v_url text := nullif(trim(coalesce(p_avatar_url, '')), '');
begin
  if v_uid is null then
    return jsonb_build_object('found', false, 'error', 'unauthorized');
  end if;

  -- Same-origin relative path or empty (clear). Reject absolute remote URLs.
  if v_url is not null and (v_url !~ '^/' or v_url ~* '^(https?:)?//') then
    return jsonb_build_object('found', false, 'error', 'invalid_avatar_url');
  end if;

  if v_admin and p_partner_id is not null then
    v_target := p_partner_id;
  else
    v_self := public._csp_messages_partner_for_auth(v_uid);
    if v_self.id is null then
      return jsonb_build_object('found', false, 'error', 'partner_not_found');
    end if;
    if not public._csp_messages_portal_status_ok(v_self.status) then
      return jsonb_build_object('found', false, 'error', 'partner_not_active');
    end if;
    if p_partner_id is not null and p_partner_id <> v_self.id then
      return jsonb_build_object('found', false, 'error', 'forbidden');
    end if;
    v_target := v_self.id;
  end if;

  if not exists (select 1 from public.csp_partner_profiles where id = v_target) then
    return jsonb_build_object('found', false, 'error', 'partner_not_found');
  end if;

  update public.csp_partner_profiles
  set avatar_url = v_url,
      updated_at = now()
  where id = v_target;

  perform public._csp_audit(
    v_uid,
    case when v_admin then 'platform_admin' else 'partner' end,
    'partner_avatar_url_set',
    'csp_partner_profiles',
    v_target,
    jsonb_build_object('avatar_url_set', v_url is not null)
  );

  return jsonb_build_object('found', true, 'partner_id', v_target, 'avatar_url', v_url);
end;
$$;

-- -----------------------------------------------------------------------------
-- 5) Grants — RPC execute for authenticated; tables remain revoked
-- -----------------------------------------------------------------------------
revoke all on function public.csp_list_partner_messages(uuid, integer) from public, anon;
revoke all on function public.csp_send_partner_message(uuid, text, text, text, uuid, text, text) from public, anon;
revoke all on function public.csp_mark_partner_message_read(uuid) from public, anon;
revoke all on function public.csp_list_sales_materials(boolean, text) from public, anon;
revoke all on function public.csp_upsert_sales_material(text, text, text, text, text[], text[], text, text, text, text) from public, anon;
revoke all on function public.csp_publish_sales_material(uuid) from public, anon;
revoke all on function public.csp_withdraw_sales_material(uuid) from public, anon;
revoke all on function public.csp_set_partner_avatar_url(text, uuid) from public, anon;

grant execute on function public.csp_list_partner_messages(uuid, integer) to authenticated, service_role;
grant execute on function public.csp_send_partner_message(uuid, text, text, text, uuid, text, text) to authenticated, service_role;
grant execute on function public.csp_mark_partner_message_read(uuid) to authenticated, service_role;
grant execute on function public.csp_list_sales_materials(boolean, text) to authenticated, service_role;
grant execute on function public.csp_upsert_sales_material(text, text, text, text, text[], text[], text, text, text, text) to authenticated, service_role;
grant execute on function public.csp_publish_sales_material(uuid) to authenticated, service_role;
grant execute on function public.csp_withdraw_sales_material(uuid) to authenticated, service_role;
grant execute on function public.csp_set_partner_avatar_url(text, uuid) to authenticated, service_role;

-- =============================================================================
-- END V3 — PREPARED_ONLY
-- =============================================================================
