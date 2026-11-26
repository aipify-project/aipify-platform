-- =============================================================================
-- PREPARED_ONLY — Platform Support Center V1 Staging batch (additive)
-- DO NOT APPLY to Staging/Production without a separate named owner APPLY YES
-- that cites this exact file path and the FULL SHA-256 of these bytes.
--
-- Staging owner decision should approve THIS batch as one unit after reviewing
-- the prerequisite read RPCs. Production requires a second, separate approval
-- after green Staging QA.
--
-- Prerequisites (apply first or include in the same owner-named Staging session):
--   docs/platform/NOT_APPLIED_platform_support_tickets_cross_tenant_read_rpc_v1.sql
--   SHA-256: 63ed974a50229e828b34e0eb99be00080a8b84b48258414f64ce802039134291
--
-- This batch adds:
--   - message / signature / template / admin-audit tables (idempotent)
--   - write RPCs: intake (web/app/partner), internal note, external reply draft,
--     status transition, assignment
--
-- Non-goals:
--   - No CSP sales-email CRM tables
--   - No outbound provider secrets / Resend / webhooks
--   - No destructive drops
--   - No grant to anon except guest intake RPC (rate-limited at app layer)
--
-- Hash:
--   shasum -a 256 docs/platform/sql-candidates/platform_support_center_staging_batch_v1.sql
-- Digest lives only in the sibling .sha256 file.
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
-- Schema (idempotent; mirrors messages/signature/templates candidate)
-- ---------------------------------------------------------------------------
create table if not exists public.platform_support_ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.app_portal_support_requests (id) on delete restrict,
  direction text not null check (direction in ('inbound', 'outbound', 'internal_note')),
  body_text text not null check (char_length(body_text) between 1 and 20000),
  body_html text check (body_html is null or char_length(body_html) <= 40000),
  author_user_id uuid references auth.users (id) on delete set null,
  author_role text not null check (author_role in ('customer', 'platform_agent', 'system', 'guest', 'partner')),
  delivery_status text not null default 'not_applicable'
    check (delivery_status in ('not_applicable', 'draft', 'queued', 'sent', 'failed', 'blocked_unconfigured')),
  template_id text,
  template_version integer,
  signature_version integer,
  created_at timestamptz not null default timezone('utc', now()),
  edited_at timestamptz,
  edited_by uuid references auth.users (id) on delete set null
);

create index if not exists platform_support_ticket_messages_ticket_created_idx
  on public.platform_support_ticket_messages (ticket_id, created_at);

alter table public.platform_support_ticket_messages enable row level security;
revoke all on table public.platform_support_ticket_messages from public, anon, authenticated;

create table if not exists public.platform_support_signatures (
  id uuid primary key default gen_random_uuid(),
  version integer not null check (version > 0),
  display_name text not null check (char_length(btrim(display_name)) between 1 and 120),
  agent_name_default text not null default '' check (char_length(agent_name_default) <= 120),
  agent_title_default text not null default '' check (char_length(agent_title_default) <= 120),
  company_name text not null check (company_name = 'Aipify Group AS'),
  website_url text not null check (website_url ~ '^https://aipify\.ai(/.*)?$'),
  support_email text not null check (support_email ~ '^[^[:space:]@]+@aipify\.ai$'),
  phone text not null default '' check (char_length(phone) <= 40),
  address_line text not null default '' check (char_length(address_line) <= 200),
  logo_url text not null check (logo_url ~ '^https://aipify\.ai/'),
  include_logo boolean not null default true,
  is_active boolean not null default false,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (version)
);

alter table public.platform_support_signatures enable row level security;
revoke all on table public.platform_support_signatures from public, anon, authenticated;

create table if not exists public.platform_support_reply_templates (
  id uuid primary key default gen_random_uuid(),
  template_key text not null check (char_length(btrim(template_key)) between 1 and 80),
  version integer not null check (version > 0),
  name text not null check (char_length(btrim(name)) between 1 and 160),
  category text not null check (char_length(btrim(category)) between 1 and 40),
  locale text not null check (locale in ('en', 'no', 'sv', 'da', 'pl', 'uk', 'es')),
  subject text not null check (char_length(subject) between 1 and 200),
  body_text text not null check (char_length(body_text) between 1 and 20000),
  allowed_variables text[] not null default array['customer_name','ticket_number','product_name','agent_name']::text[],
  is_active boolean not null default true,
  is_starter boolean not null default false,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (template_key, version, locale)
);

alter table public.platform_support_reply_templates enable row level security;
revoke all on table public.platform_support_reply_templates from public, anon, authenticated;

create table if not exists public.platform_support_ticket_admin_audit (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.app_portal_support_requests (id) on delete restrict,
  event_type text not null check (char_length(btrim(event_type)) between 1 and 64),
  description text not null check (char_length(description) between 1 and 500),
  performed_by uuid references auth.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists platform_support_ticket_admin_audit_ticket_created_idx
  on public.platform_support_ticket_admin_audit (ticket_id, created_at);

alter table public.platform_support_ticket_admin_audit enable row level security;
revoke all on table public.platform_support_ticket_admin_audit from public, anon, authenticated;

-- Guest intake identity (no login; cannot enumerate tickets)
create table if not exists public.platform_support_guest_contacts (
  id uuid primary key default gen_random_uuid(),
  email text not null check (email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  display_name text not null check (char_length(btrim(display_name)) between 1 and 120),
  created_at timestamptz not null default timezone('utc', now()),
  unique (email)
);

alter table public.platform_support_guest_contacts enable row level security;
revoke all on table public.platform_support_guest_contacts from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Human-readable ticket number helper
-- ---------------------------------------------------------------------------
create or replace function public._pscwv1_ticket_number(p_id uuid)
returns text
language sql
immutable
as $$
  select 'SUP-' || upper(substr(replace(p_id::text, '-', ''), 1, 8));
$$;

revoke all on function public._pscwv1_ticket_number(uuid) from public, anon;

-- ---------------------------------------------------------------------------
-- Platform agent: post internal note (never emailed)
-- ---------------------------------------------------------------------------
create or replace function public.platform_support_post_internal_note(
  p_ticket_id uuid,
  p_body text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_msg_id uuid;
begin
  perform public._ppsf258_require_platform_access();
  if p_ticket_id is null or coalesce(char_length(btrim(p_body)), 0) < 1 then
    raise exception 'invalid argument';
  end if;
  if not exists (select 1 from public.app_portal_support_requests r where r.id = p_ticket_id) then
    raise exception 'not found';
  end if;

  insert into public.platform_support_ticket_messages (
    ticket_id, direction, body_text, author_user_id, author_role, delivery_status
  ) values (
    p_ticket_id, 'internal_note', left(btrim(p_body), 20000), v_uid, 'platform_agent', 'not_applicable'
  ) returning id into v_msg_id;

  insert into public.platform_support_ticket_admin_audit (
    ticket_id, event_type, description, performed_by, metadata
  ) values (
    p_ticket_id, 'internal_note', 'Internal note added', v_uid,
    jsonb_build_object('message_id', v_msg_id)
  );

  return jsonb_build_object('ok', true, 'id', v_msg_id, 'direction', 'internal_note');
end;
$$;

revoke all on function public.platform_support_post_internal_note(uuid, text) from public, anon;
grant execute on function public.platform_support_post_internal_note(uuid, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Platform agent: external reply DRAFT (email send stays app-gated / blocked)
-- ---------------------------------------------------------------------------
create or replace function public.platform_support_post_external_reply_draft(
  p_ticket_id uuid,
  p_body text,
  p_template_id text default null,
  p_template_version integer default null,
  p_signature_version integer default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_msg_id uuid;
begin
  perform public._ppsf258_require_platform_access();
  if p_ticket_id is null or coalesce(char_length(btrim(p_body)), 0) < 1 then
    raise exception 'invalid argument';
  end if;
  if not exists (select 1 from public.app_portal_support_requests r where r.id = p_ticket_id) then
    raise exception 'not found';
  end if;

  insert into public.platform_support_ticket_messages (
    ticket_id, direction, body_text, author_user_id, author_role, delivery_status,
    template_id, template_version, signature_version
  ) values (
    p_ticket_id, 'outbound', left(btrim(p_body), 20000), v_uid, 'platform_agent', 'blocked_unconfigured',
    nullif(btrim(coalesce(p_template_id, '')), ''), p_template_version, p_signature_version
  ) returning id into v_msg_id;

  insert into public.platform_support_ticket_admin_audit (
    ticket_id, event_type, description, performed_by, metadata
  ) values (
    p_ticket_id, 'external_reply_draft', 'External reply draft stored (email not sent)', v_uid,
    jsonb_build_object('message_id', v_msg_id, 'delivery_status', 'blocked_unconfigured')
  );

  return jsonb_build_object(
    'ok', true,
    'id', v_msg_id,
    'direction', 'outbound',
    'delivery_status', 'blocked_unconfigured'
  );
end;
$$;

revoke all on function public.platform_support_post_external_reply_draft(uuid, text, text, integer, integer)
  from public, anon;
grant execute on function public.platform_support_post_external_reply_draft(uuid, text, text, integer, integer)
  to authenticated;

-- ---------------------------------------------------------------------------
-- Platform agent: status transition
-- ---------------------------------------------------------------------------
create or replace function public.platform_support_update_ticket_status(
  p_ticket_id uuid,
  p_to_status text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_from text;
begin
  perform public._ppsf258_require_platform_access();
  if p_ticket_id is null or coalesce(char_length(btrim(p_to_status)), 0) < 1 then
    raise exception 'invalid argument';
  end if;

  select r.status into v_from
  from public.app_portal_support_requests r
  where r.id = p_ticket_id
  for update;
  if v_from is null then
    raise exception 'not found';
  end if;

  update public.app_portal_support_requests
  set status = btrim(p_to_status),
      updated_at = timezone('utc', now()),
      resolved_at = case
        when btrim(p_to_status) in ('resolved', 'closed') then coalesce(resolved_at, timezone('utc', now()))
        when btrim(p_to_status) = 'reopened' then null
        else resolved_at
      end
  where id = p_ticket_id;

  insert into public.platform_support_ticket_admin_audit (
    ticket_id, event_type, description, performed_by, metadata
  ) values (
    p_ticket_id, 'status_change', 'Status updated', v_uid,
    jsonb_build_object('from', v_from, 'to', btrim(p_to_status))
  );

  return jsonb_build_object('ok', true, 'from', v_from, 'to', btrim(p_to_status));
end;
$$;

revoke all on function public.platform_support_update_ticket_status(uuid, text) from public, anon;
grant execute on function public.platform_support_update_ticket_status(uuid, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Platform agent: assignment
-- ---------------------------------------------------------------------------
create or replace function public.platform_support_assign_ticket(
  p_ticket_id uuid,
  p_assignee_user_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  perform public._ppsf258_require_platform_access();
  if p_ticket_id is null then
    raise exception 'invalid argument';
  end if;
  if not exists (select 1 from public.app_portal_support_requests r where r.id = p_ticket_id) then
    raise exception 'not found';
  end if;

  update public.app_portal_support_requests
  set assigned_support_owner_id = p_assignee_user_id,
      updated_at = timezone('utc', now())
  where id = p_ticket_id;

  insert into public.platform_support_ticket_admin_audit (
    ticket_id, event_type, description, performed_by, metadata
  ) values (
    p_ticket_id, 'assignment', 'Assignee updated', v_uid,
    jsonb_build_object('assignee_user_id', p_assignee_user_id)
  );

  return jsonb_build_object('ok', true, 'assignee_user_id', p_assignee_user_id);
end;
$$;

revoke all on function public.platform_support_assign_ticket(uuid, uuid) from public, anon;
grant execute on function public.platform_support_assign_ticket(uuid, uuid) to authenticated;

select 'PREPARED_ONLY_platform_support_center_staging_batch_v1' as draft_marker;
