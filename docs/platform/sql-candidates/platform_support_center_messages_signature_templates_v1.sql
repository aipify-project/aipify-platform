-- =============================================================================
-- PREPARED_ONLY — Platform Support Center V1 additive Core contract
-- DO NOT APPLY to Local / Staging / Production without a separate named owner
-- apply YES. This file must NOT be copied into supabase/migrations/ from this job.
--
-- Purpose:
--   1) Message / reply thread for app_portal_support_requests
--   2) Versioned support firm signature (admin-managed)
--   3) Versioned reply templates (admin-managed)
--
-- Non-goals:
--   - Does not replace or rewrite app_portal_support_requests APP RPCs
--   - Does not touch csp_sales_email_* / seller CRM tables
--   - Does not enable outbound email providers or secrets
--   - Does not apply the existing NOT_APPLIED cross-tenant read RPCs
--     (docs/platform/NOT_APPLIED_platform_support_tickets_cross_tenant_read_rpc_v1.sql)
--
-- Hash method:
--   shasum -a 256 docs/platform/sql-candidates/platform_support_center_messages_signature_templates_v1.sql
-- Digest lives only in the sibling .sha256 file — do not paste into this file.
--
-- Dependencies (must already exist; this file does not create them):
--   public.app_portal_support_requests
--   public.platform_admins
--   public._ppsf258_require_platform_access()
--   auth.uid()
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
-- Messages (external replies + internal notes)
-- ---------------------------------------------------------------------------
create table if not exists public.platform_support_ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.app_portal_support_requests (id) on delete restrict,
  direction text not null check (direction in ('inbound', 'outbound', 'internal_note')),
  body_text text not null check (char_length(body_text) between 1 and 20000),
  body_html text check (body_html is null or char_length(body_html) <= 40000),
  author_user_id uuid references auth.users (id) on delete set null,
  author_role text not null check (author_role in ('customer', 'platform_agent', 'system')),
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
-- No broad grants: access only via security definer RPCs after owner apply.

-- ---------------------------------------------------------------------------
-- Firm signature (versioned)
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- Reply templates (versioned)
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- Append-only audit (status / assignment / sends) — separate from APP audit
-- ---------------------------------------------------------------------------
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

-- Intentionally no RPCs in this candidate beyond schema.
-- List/get/counts remain in NOT_APPLIED_platform_support_tickets_cross_tenant_read_rpc_v1.sql.
-- Message/signature/template RPCs require a follow-up named prepare after this schema apply.

select 'PREPARED_ONLY_platform_support_center_messages_signature_templates_v1' as draft_marker;
