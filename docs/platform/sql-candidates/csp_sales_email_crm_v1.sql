-- =============================================================================
-- PREPARED_ONLY — Aipify-internal sales email, reply routing, and leads V1
-- DO NOT APPLY without a separate owner Staging approval.
-- Production requires a second, explicit owner approval after Staging verify.
--
-- Scope: tenant aipify_internal only. No customer-tenant publish, no commission
-- writes, no payment changes, no seeds, no live sends.
--
-- Owner must also set, outside git:
--   CSP_SALES_EMAIL_OUTBOUND=owner_approved
--   CSP_SALES_EMAIL_LAWFUL_BASIS=owner_recorded
--   CSP_SALES_EMAIL_ALLOWLIST=<one approved recipient>
--   CSP_SALES_EMAIL_REPLY_DOMAIN=<verified inbound domain>
--   CSP_SALES_EMAIL_TOKEN_SECRET
--   CSP_SALES_EMAIL_INBOUND_SECRET or RESEND_WEBHOOK_SECRET
--   RESEND_API_KEY on the sending project
-- Until those exist, the app keeps preview/draft and reports
-- REAL_INBOUND_E2E_BLOCKED.
-- =============================================================================

create table if not exists public.csp_sales_email_templates (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null default 'aipify_internal' check (tenant_id = 'aipify_internal'),
  template_key text not null,
  product_key text not null,
  template_type text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'withdrawn')),
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, template_key)
);

create table if not exists public.csp_sales_email_template_versions (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.csp_sales_email_templates (id),
  version integer not null,
  locale text not null,
  subject text not null,
  preheader text not null default '',
  body text not null,
  cta text not null,
  created_at timestamptz not null default now(),
  unique (template_id, version, locale)
);

create table if not exists public.csp_sales_email_sends (
  id uuid primary key,
  tenant_id text not null default 'aipify_internal' check (tenant_id = 'aipify_internal'),
  partner_id uuid not null,
  product_key text not null,
  template_key text not null,
  locale text not null,
  recipient_email text not null,
  idempotency_key text not null,
  delivery_status text not null check (delivery_status in ('draft', 'queued', 'accepted_by_provider', 'delivered', 'bounced', 'failed')),
  provider_id text,
  created_at timestamptz not null default now(),
  unique (partner_id, idempotency_key)
);

create table if not exists public.csp_sales_email_provider_events (
  id uuid primary key default gen_random_uuid(),
  provider_event_id text not null unique,
  send_id uuid references public.csp_sales_email_sends (id),
  event_class text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.csp_sales_email_leads (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null default 'aipify_internal' check (tenant_id = 'aipify_internal'),
  partner_id uuid not null,
  product_key text not null,
  recipient_email text not null,
  send_id uuid not null references public.csp_sales_email_sends (id),
  status text not null default 'new_enquiry',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, partner_id, product_key, recipient_email)
);

create table if not exists public.csp_sales_email_lead_messages (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.csp_sales_email_leads (id),
  direction text not null check (direction in ('inbound', 'outbound')),
  body_text text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.csp_sales_email_suppressions (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null default 'aipify_internal' check (tenant_id = 'aipify_internal'),
  email text not null,
  reason text not null,
  created_at timestamptz not null default now(),
  unique (tenant_id, email)
);

create table if not exists public.csp_sales_email_notifications (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null,
  lead_id uuid not null references public.csp_sales_email_leads (id),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.csp_sales_email_templates enable row level security;
alter table public.csp_sales_email_template_versions enable row level security;
alter table public.csp_sales_email_sends enable row level security;
alter table public.csp_sales_email_provider_events enable row level security;
alter table public.csp_sales_email_leads enable row level security;
alter table public.csp_sales_email_lead_messages enable row level security;
alter table public.csp_sales_email_suppressions enable row level security;
alter table public.csp_sales_email_notifications enable row level security;

revoke all on public.csp_sales_email_templates from public, anon, authenticated;
revoke all on public.csp_sales_email_template_versions from public, anon, authenticated;
revoke all on public.csp_sales_email_sends from public, anon, authenticated;
revoke all on public.csp_sales_email_provider_events from public, anon, authenticated;
revoke all on public.csp_sales_email_leads from public, anon, authenticated;
revoke all on public.csp_sales_email_lead_messages from public, anon, authenticated;
revoke all on public.csp_sales_email_suppressions from public, anon, authenticated;
revoke all on public.csp_sales_email_notifications from public, anon, authenticated;

create or replace function public.csp_sales_email_backend_status()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  -- Stays false until the owner-approved package includes the write/read RPCs
  -- (record send, ingest reply, list leads, unread, mark read). Tables above
  -- are the storage shape only. A true ready flag would let the app send.
  select jsonb_build_object(
    'ready', false,
    'tenant_id', 'aipify_internal',
    'reason', 'write_rpcs_not_in_this_candidate'
  );
$$;

revoke all on function public.csp_sales_email_backend_status() from public, anon;
grant execute on function public.csp_sales_email_backend_status() to authenticated, service_role;

-- Remaining list/save/publish/send/ingest/lead RPCs are created in the same
-- owner-approved apply. They must resolve the partner from auth.uid(), ignore
-- client partner ids, refuse cross-tenant rows, and never insert commission
-- or sale rows. A reply is a lead only. Retention target: 180 days, deletion
-- job is a later owner task.
