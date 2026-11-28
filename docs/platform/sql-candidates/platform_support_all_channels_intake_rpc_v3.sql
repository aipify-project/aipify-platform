-- =============================================================================
-- PREPARED_ONLY — Platform Support all-channels intake RPCs V3
-- DO NOT APPLY without a separate named owner APPLY YES citing this exact path
-- and the FULL SHA-256 of these bytes (see sibling .sha256 after authoring).
--
-- Replaces the non-executable placeholder:
--   docs/platform/sql-candidates/platform_support_center_intake_rpc_v1.sql
--   (SHA e987d820… was a draft marker only — never treat as installable DDL)
--
-- Targets (separate YES each):
--   Staging  auedugihkduoaikfusqe
--   Production qbcqoixhrvhnuwphefvw  (only after green Staging QA)
--
-- Prerequisites (already APPLIED on Staging + Production — do NOT re-apply):
--   A  docs/platform/NOT_APPLIED_platform_support_tickets_cross_tenant_read_rpc_v1.sql
--   B  docs/platform/sql-candidates/platform_support_center_staging_batch_v1.sql
--
-- This candidate adds:
--   - channel values web + partner (extend check; keep existing values)
--   - partner_id / guest_contact_id / invoice_reference columns
--   - idempotency table for intake creates
--   - transaction lock so concurrent identical keys return one ticket
--   - web create RPC (service_role only — app layer rate-limits + bot protection)
--   - partner create / list / get / reply RPCs (authenticated; auth.uid → partner)
--   - revoke EXECUTE from public/anon on privileged APP create/list/get where present
--
-- Non-goals:
--   No email SEND · no CSP sales-email CRM · no secrets/DNS · no attachment buckets
--   No parallel ticket database — writes stay on app_portal_support_requests
--   No insert or update of public.companies (platform company is a separate candidate)
--
-- BEFORE: web/CSP create CORE_BLOCKED; APP create LIVE on Production only
-- AFTER:  web/CSP create RPCs exist (code gate still required for activation)
-- Reversible: revoke execute on new RPCs; columns remain nullable (no drops)
-- =============================================================================

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    create role service_role nologin;
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- Schema deltas (idempotent)
-- ---------------------------------------------------------------------------
alter table public.app_portal_support_requests
  drop constraint if exists app_portal_support_requests_channel_check;

alter table public.app_portal_support_requests
  add constraint app_portal_support_requests_channel_check
  check (
    channel = any (
      array[
        'app_portal'::text,
        'email'::text,
        'chat'::text,
        'phone'::text,
        'assistant'::text,
        'web'::text,
        'partner'::text
      ]
    )
  );

alter table public.app_portal_support_requests
  add column if not exists partner_id uuid;

alter table public.app_portal_support_requests
  add column if not exists guest_contact_id uuid;

alter table public.app_portal_support_requests
  add column if not exists invoice_reference text;

do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'csp_partner_profiles'
  ) and not exists (
    select 1 from pg_constraint
    where conname = 'app_portal_support_requests_partner_id_fkey'
  ) then
    alter table public.app_portal_support_requests
      add constraint app_portal_support_requests_partner_id_fkey
      foreign key (partner_id) references public.csp_partner_profiles (id)
      on delete set null;
  end if;

  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'platform_support_guest_contacts'
  ) and not exists (
    select 1 from pg_constraint
    where conname = 'app_portal_support_requests_guest_contact_id_fkey'
  ) then
    alter table public.app_portal_support_requests
      add constraint app_portal_support_requests_guest_contact_id_fkey
      foreign key (guest_contact_id) references public.platform_support_guest_contacts (id)
      on delete set null;
  end if;
end
$$;

create index if not exists app_portal_support_requests_partner_id_idx
  on public.app_portal_support_requests (partner_id, updated_at desc)
  where partner_id is not null;

create index if not exists app_portal_support_requests_channel_idx
  on public.app_portal_support_requests (channel, updated_at desc);

create table if not exists public.platform_support_intake_idempotency (
  id uuid primary key default gen_random_uuid(),
  scope text not null check (scope in ('web', 'partner')),
  actor_key text not null check (char_length(btrim(actor_key)) between 1 and 200),
  idempotency_key text not null check (char_length(btrim(idempotency_key)) between 8 and 120),
  ticket_id uuid not null references public.app_portal_support_requests (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (scope, actor_key, idempotency_key)
);

alter table public.platform_support_intake_idempotency enable row level security;
revoke all on table public.platform_support_intake_idempotency from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public._psacv3_platform_company_id()
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  select c.id into v_id
  from public.companies c
  where coalesce(c.is_platform, false) = true
  order by c.created_at asc
  limit 1;
  if v_id is null then
    raise exception 'platform company missing';
  end if;
  return v_id;
end;
$$;

revoke all on function public._psacv3_platform_company_id() from public, anon, authenticated;

-- Serializes concurrent creates that share one idempotency identity.
-- Called only from the security-definer intake functions below.
create or replace function public._psacv3_lock_intake_idempotency(
  p_scope text,
  p_actor_key text,
  p_idempotency_key text
)
returns void
language plpgsql
as $$
begin
  perform pg_advisory_xact_lock(
    hashtextextended(
      'psacv3:' || p_scope || chr(31) || p_actor_key || chr(31) || p_idempotency_key,
      0
    )
  );
end;
$$;

revoke all on function public._psacv3_lock_intake_idempotency(text, text, text)
  from public, anon, authenticated;

create or replace function public._psacv3_map_category(p_category text)
returns text
language sql
immutable
as $$
  select case lower(coalesce(nullif(btrim(p_category), ''), 'general'))
    when 'billing' then 'billing'
    when 'invoice' then 'billing'
    when 'payment' then 'billing'
    when 'product' then 'business_packs'
    when 'module' then 'business_packs'
    when 'account' then 'account'
    when 'license' then 'account'
    when 'technical' then 'technical'
    when 'security' then 'security'
    when 'integrations' then 'integrations'
    when 'partner_commission' then 'billing'
    when 'other' then 'general'
    when 'general' then 'general'
    else 'general'
  end;
$$;

revoke all on function public._psacv3_map_category(text) from public, anon;

create or replace function public._psacv3_map_priority(p_priority text)
returns text
language sql
immutable
as $$
  select case lower(coalesce(nullif(btrim(p_priority), ''), 'normal'))
    when 'critical' then 'urgent'
    when 'urgent' then 'urgent'
    when 'high' then 'high'
    when 'low' then 'low'
    when 'normal' then 'medium'
    when 'medium' then 'medium'
    else 'medium'
  end;
$$;

revoke all on function public._psacv3_map_priority(text) from public, anon;

create or replace function public._psacv3_ticket_number(p_id uuid)
returns text
language sql
immutable
as $$
  select 'SUP-' || upper(substr(replace(p_id::text, '-', ''), 1, 8));
$$;

revoke all on function public._psacv3_ticket_number(uuid) from public, anon;

create or replace function public._psacv3_require_partner_id()
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_partner_id uuid;
  v_status text;
begin
  if v_uid is null then
    raise exception 'unauthorized';
  end if;
  if not exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'csp_partner_profiles'
  ) then
    raise exception 'partner profiles missing';
  end if;

  select p.id, p.status into v_partner_id, v_status
  from public.csp_partner_profiles p
  where p.auth_user_id = v_uid
  limit 1;

  if v_partner_id is null then
    raise exception 'forbidden';
  end if;
  if lower(coalesce(v_status, '')) not in ('approved', 'active', 'certified', 'in_academy') then
    raise exception 'forbidden';
  end if;
  return v_partner_id;
end;
$$;

revoke all on function public._psacv3_require_partner_id() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Web guest create — service_role only (Next.js after bot protection)
-- ---------------------------------------------------------------------------
create or replace function public.platform_support_intake_web_create(
  p_email text,
  p_display_name text,
  p_title text,
  p_body text,
  p_category text default 'general',
  p_priority text default 'normal',
  p_related_module text default null,
  p_invoice_reference text default null,
  p_idempotency_key text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_name text := btrim(coalesce(p_display_name, ''));
  v_title text := btrim(coalesce(p_title, ''));
  v_body text := btrim(coalesce(p_body, ''));
  v_module text := nullif(btrim(coalesce(p_related_module, '')), '');
  v_invoice text := nullif(left(btrim(coalesce(p_invoice_reference, '')), 80), '');
  v_idem text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_guest_id uuid;
  v_company_id uuid;
  v_ticket_id uuid;
  v_msg_id uuid;
  v_existing uuid;
begin
  if v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'invalid email';
  end if;
  if char_length(v_name) < 1 or char_length(v_name) > 120 then
    raise exception 'invalid name';
  end if;
  if char_length(v_title) < 3 or char_length(v_title) > 200 then
    raise exception 'invalid title';
  end if;
  if char_length(v_body) < 10 or char_length(v_body) > 8000 then
    raise exception 'invalid body';
  end if;

  if v_idem is null or char_length(v_idem) < 8 or char_length(v_idem) > 120 then
    raise exception 'invalid idempotency key';
  end if;

  perform public._psacv3_lock_intake_idempotency('web', v_email, v_idem);

  select i.ticket_id into v_existing
  from public.platform_support_intake_idempotency i
  where i.scope = 'web'
    and i.actor_key = v_email
    and i.idempotency_key = v_idem
  limit 1;
  if v_existing is not null then
    return jsonb_build_object(
      'ok', true,
      'idempotent', true,
      'ticket_id', v_existing,
      'ticket_number', public._psacv3_ticket_number(v_existing),
      'channel', 'web',
      'status', 'open'
    );
  end if;

  insert into public.platform_support_guest_contacts (email, display_name)
  values (v_email, v_name)
  on conflict (email) do update
    set display_name = excluded.display_name
  returning id into v_guest_id;

  v_company_id := public._psacv3_platform_company_id();

  insert into public.app_portal_support_requests (
    company_id,
    title,
    description,
    category,
    priority,
    status,
    created_by,
    related_module,
    channel,
    guest_contact_id,
    invoice_reference,
    attachments,
    internal_notes
  ) values (
    v_company_id,
    left(v_title, 200),
    left(v_body, 8000),
    public._psacv3_map_category(p_category),
    public._psacv3_map_priority(p_priority),
    'open',
    null,
    v_module,
    'web',
    v_guest_id,
    v_invoice,
    '[]'::jsonb,
    ''
  ) returning id into v_ticket_id;

  insert into public.platform_support_ticket_messages (
    ticket_id, direction, body_text, author_user_id, author_role, delivery_status
  ) values (
    v_ticket_id, 'inbound', left(v_body, 20000), null, 'guest', 'not_applicable'
  ) returning id into v_msg_id;

  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'platform_support_ticket_admin_audit'
  ) then
    insert into public.platform_support_ticket_admin_audit (
      ticket_id, event_type, description, performed_by, metadata
    ) values (
      v_ticket_id,
      'intake_created',
      'Web guest support intake created',
      null,
      jsonb_build_object(
        'channel', 'web',
        'guest_contact_id', v_guest_id,
        'message_id', v_msg_id
      )
    );
  end if;

  insert into public.platform_support_intake_idempotency (
    scope, actor_key, idempotency_key, ticket_id
  ) values ('web', v_email, v_idem, v_ticket_id)
  on conflict (scope, actor_key, idempotency_key) do nothing;

  if not found then
    raise exception 'idempotency conflict';
  end if;

  return jsonb_build_object(
    'ok', true,
    'idempotent', false,
    'ticket_id', v_ticket_id,
    'ticket_number', public._psacv3_ticket_number(v_ticket_id),
    'channel', 'web',
    'status', 'open'
  );
end;
$$;

revoke all on function public.platform_support_intake_web_create(
  text, text, text, text, text, text, text, text, text
) from public, anon, authenticated;
grant execute on function public.platform_support_intake_web_create(
  text, text, text, text, text, text, text, text, text
) to service_role;

-- ---------------------------------------------------------------------------
-- Partner create — authenticated; partner derived from auth.uid()
-- ---------------------------------------------------------------------------
create or replace function public.platform_support_intake_partner_create(
  p_title text,
  p_body text,
  p_category text default 'general',
  p_priority text default 'normal',
  p_related_module text default null,
  p_invoice_reference text default null,
  p_idempotency_key text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_partner_id uuid;
  v_title text := btrim(coalesce(p_title, ''));
  v_body text := btrim(coalesce(p_body, ''));
  v_module text := nullif(btrim(coalesce(p_related_module, '')), '');
  v_invoice text := nullif(left(btrim(coalesce(p_invoice_reference, '')), 80), '');
  v_idem text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_company_id uuid;
  v_ticket_id uuid;
  v_msg_id uuid;
  v_existing uuid;
begin
  v_partner_id := public._psacv3_require_partner_id();
  if char_length(v_title) < 3 or char_length(v_title) > 200 then
    raise exception 'invalid title';
  end if;
  if char_length(v_body) < 10 or char_length(v_body) > 8000 then
    raise exception 'invalid body';
  end if;

  if v_idem is not null then
    if char_length(v_idem) < 8 or char_length(v_idem) > 120 then
      raise exception 'invalid idempotency key';
    end if;

    perform public._psacv3_lock_intake_idempotency('partner', v_partner_id::text, v_idem);

    select i.ticket_id into v_existing
    from public.platform_support_intake_idempotency i
    where i.scope = 'partner'
      and i.actor_key = v_partner_id::text
      and i.idempotency_key = v_idem
    limit 1;
    if v_existing is not null then
      return jsonb_build_object(
        'ok', true,
        'idempotent', true,
        'ticket_id', v_existing,
        'ticket_number', public._psacv3_ticket_number(v_existing),
        'channel', 'partner',
        'status', 'open'
      );
    end if;
  end if;

  v_company_id := public._psacv3_platform_company_id();

  insert into public.app_portal_support_requests (
    company_id,
    title,
    description,
    category,
    priority,
    status,
    created_by,
    related_module,
    channel,
    partner_id,
    invoice_reference,
    attachments,
    internal_notes
  ) values (
    v_company_id,
    left(v_title, 200),
    left(v_body, 8000),
    public._psacv3_map_category(p_category),
    public._psacv3_map_priority(p_priority),
    'open',
    v_uid,
    v_module,
    'partner',
    v_partner_id,
    v_invoice,
    '[]'::jsonb,
    ''
  ) returning id into v_ticket_id;

  insert into public.platform_support_ticket_messages (
    ticket_id, direction, body_text, author_user_id, author_role, delivery_status
  ) values (
    v_ticket_id, 'inbound', left(v_body, 20000), v_uid, 'partner', 'not_applicable'
  ) returning id into v_msg_id;

  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'platform_support_ticket_admin_audit'
  ) then
    insert into public.platform_support_ticket_admin_audit (
      ticket_id, event_type, description, performed_by, metadata
    ) values (
      v_ticket_id,
      'intake_created',
      'Partner support intake created',
      v_uid,
      jsonb_build_object(
        'channel', 'partner',
        'partner_id', v_partner_id,
        'message_id', v_msg_id
      )
    );
  end if;

  if v_idem is not null then
    insert into public.platform_support_intake_idempotency (
      scope, actor_key, idempotency_key, ticket_id
    ) values ('partner', v_partner_id::text, v_idem, v_ticket_id)
    on conflict (scope, actor_key, idempotency_key) do nothing;

    if not found then
      raise exception 'idempotency conflict';
    end if;
  end if;

  return jsonb_build_object(
    'ok', true,
    'idempotent', false,
    'ticket_id', v_ticket_id,
    'ticket_number', public._psacv3_ticket_number(v_ticket_id),
    'channel', 'partner',
    'status', 'open'
  );
end;
$$;

revoke all on function public.platform_support_intake_partner_create(
  text, text, text, text, text, text, text
) from public, anon;
grant execute on function public.platform_support_intake_partner_create(
  text, text, text, text, text, text, text
) to authenticated;

-- ---------------------------------------------------------------------------
-- Partner list / get / reply — own partner_id only; never APP tenant tickets
-- ---------------------------------------------------------------------------
create or replace function public.list_partner_support_requests(
  p_status text default null,
  p_page integer default 1,
  p_page_size integer default 25
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_partner_id uuid := public._psacv3_require_partner_id();
  v_page integer := greatest(coalesce(p_page, 1), 1);
  v_size integer := least(greatest(coalesce(p_page_size, 25), 1), 100);
  v_status text := nullif(btrim(coalesce(p_status, '')), '');
  v_total integer;
  v_items jsonb;
begin
  select count(*)::integer into v_total
  from public.app_portal_support_requests r
  where r.partner_id = v_partner_id
    and r.channel = 'partner'
    and (v_status is null or r.status = v_status);

  select coalesce(jsonb_agg(row_to_json(x)::jsonb order by x.updated_at desc), '[]'::jsonb)
  into v_items
  from (
    select
      r.id,
      public._psacv3_ticket_number(r.id) as ticket_number,
      r.title,
      r.status,
      r.priority,
      r.category,
      r.channel,
      r.created_at,
      r.updated_at
    from public.app_portal_support_requests r
    where r.partner_id = v_partner_id
      and r.channel = 'partner'
      and (v_status is null or r.status = v_status)
    order by r.updated_at desc
    offset (v_page - 1) * v_size
    limit v_size
  ) x;

  return jsonb_build_object(
    'ok', true,
    'total', v_total,
    'page', v_page,
    'page_size', v_size,
    'items', v_items
  );
end;
$$;

revoke all on function public.list_partner_support_requests(text, integer, integer) from public, anon;
grant execute on function public.list_partner_support_requests(text, integer, integer) to authenticated;

create or replace function public.get_partner_support_request(p_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_partner_id uuid := public._psacv3_require_partner_id();
  v_row public.app_portal_support_requests%rowtype;
  v_messages jsonb;
begin
  if p_id is null then
    raise exception 'invalid argument';
  end if;

  select * into v_row
  from public.app_portal_support_requests r
  where r.id = p_id
    and r.partner_id = v_partner_id
    and r.channel = 'partner';

  if not found then
    raise exception 'not found';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id,
    'direction', m.direction,
    'body_text', m.body_text,
    'author_role', m.author_role,
    'created_at', m.created_at
  ) order by m.created_at asc), '[]'::jsonb)
  into v_messages
  from public.platform_support_ticket_messages m
  where m.ticket_id = v_row.id
    and m.direction in ('inbound', 'outbound');

  return jsonb_build_object(
    'ok', true,
    'request', jsonb_build_object(
      'id', v_row.id,
      'ticket_number', public._psacv3_ticket_number(v_row.id),
      'title', v_row.title,
      'description', v_row.description,
      'status', v_row.status,
      'priority', v_row.priority,
      'category', v_row.category,
      'channel', v_row.channel,
      'related_module', v_row.related_module,
      'invoice_reference', v_row.invoice_reference,
      'created_at', v_row.created_at,
      'updated_at', v_row.updated_at,
      'messages', v_messages
    )
  );
end;
$$;

revoke all on function public.get_partner_support_request(uuid) from public, anon;
grant execute on function public.get_partner_support_request(uuid) to authenticated;

create or replace function public.reply_partner_support_request(
  p_id uuid,
  p_body text,
  p_idempotency_key text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_partner_id uuid := public._psacv3_require_partner_id();
  v_body text := btrim(coalesce(p_body, ''));
  v_idem text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_msg_id uuid;
  v_existing uuid;
begin
  if p_id is null or char_length(v_body) < 1 or char_length(v_body) > 8000 then
    raise exception 'invalid argument';
  end if;
  if not exists (
    select 1 from public.app_portal_support_requests r
    where r.id = p_id
      and r.partner_id = v_partner_id
      and r.channel = 'partner'
  ) then
    raise exception 'not found';
  end if;

  if v_idem is not null then
    if char_length(v_idem) < 8 or char_length(v_idem) > 120 then
      raise exception 'invalid idempotency key';
    end if;

    perform public._psacv3_lock_intake_idempotency(
      'partner',
      v_partner_id::text || ':reply:' || p_id::text,
      v_idem
    );

    select i.ticket_id into v_existing
    from public.platform_support_intake_idempotency i
    where i.scope = 'partner'
      and i.actor_key = (v_partner_id::text || ':reply:' || p_id::text)
      and i.idempotency_key = v_idem
    limit 1;
    if v_existing is not null then
      return jsonb_build_object('ok', true, 'idempotent', true, 'ticket_id', p_id);
    end if;
  end if;

  insert into public.platform_support_ticket_messages (
    ticket_id, direction, body_text, author_user_id, author_role, delivery_status
  ) values (
    p_id, 'inbound', left(v_body, 20000), v_uid, 'partner', 'not_applicable'
  ) returning id into v_msg_id;

  update public.app_portal_support_requests
  set updated_at = timezone('utc', now()),
      status = case when status in ('resolved', 'closed') then 'reopened' else status end
  where id = p_id;

  if v_idem is not null then
    insert into public.platform_support_intake_idempotency (
      scope, actor_key, idempotency_key, ticket_id
    ) values (
      'partner',
      v_partner_id::text || ':reply:' || p_id::text,
      v_idem,
      p_id
    )
    on conflict (scope, actor_key, idempotency_key) do nothing;

    if not found then
      raise exception 'idempotency conflict';
    end if;
  end if;

  return jsonb_build_object(
    'ok', true,
    'idempotent', false,
    'message_id', v_msg_id,
    'ticket_id', p_id
  );
end;
$$;

revoke all on function public.reply_partner_support_request(uuid, text, text) from public, anon;
grant execute on function public.reply_partner_support_request(uuid, text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Security harden: APP create/list/get must not be executable by anon
-- ---------------------------------------------------------------------------
do $$
declare
  r record;
begin
  for r in
    select p.oid::regprocedure as sig
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in (
        'create_app_portal_support_request',
        'list_app_portal_support_requests',
        'get_app_portal_support_request',
        'get_app_portal_support_history',
        'update_app_portal_support_request',
        'prepare_app_portal_support_assistant_context'
      )
  loop
    execute format('revoke all on function %s from public, anon', r.sig);
    execute format('grant execute on function %s to authenticated', r.sig);
  end loop;
end
$$;

select 'PREPARED_ONLY_platform_support_all_channels_intake_rpc_v3' as draft_marker;
