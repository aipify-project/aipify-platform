-- PREPARED_ONLY — CSP SELGERE Complete Global Master V2
-- DO NOT APPLY without explicit owner approval (Staging first, then Production).
-- Schema delta for: partner messages, sales materials publish state, profile avatar URL.
-- Existing CSP tables (partners, attribution, commissions, academy, audit) are unchanged.
-- Apply-side effects = 0 (no seeds, no customer writes, no auth/email/payment).

-- =============================================================================
-- 1) Profile avatar (optional column; portal may also use auth user_metadata)
-- =============================================================================
alter table public.csp_partner_profiles
  add column if not exists avatar_url text;

comment on column public.csp_partner_profiles.avatar_url is
  'Optional public avatar URL for CSP seller profile; never store binary in Core.';

-- =============================================================================
-- 2) Partner messages (admin ↔ seller; no mass send without separate approval)
-- =============================================================================
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
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists csp_partner_messages_partner_created_idx
  on public.csp_partner_messages (partner_id, created_at desc);
create index if not exists csp_partner_messages_thread_idx
  on public.csp_partner_messages (thread_id, created_at);

alter table public.csp_partner_messages enable row level security;
revoke all on table public.csp_partner_messages from public, anon, authenticated;

create table if not exists public.csp_partner_message_recipients (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.csp_partner_messages(id) on delete cascade,
  partner_id uuid not null references public.csp_partner_profiles(id),
  delivery_status text not null default 'recorded'
    check (delivery_status in ('recorded', 'queued', 'sent', 'failed', 'read')),
  created_at timestamptz not null default now()
);

create index if not exists csp_partner_message_recipients_partner_idx
  on public.csp_partner_message_recipients (partner_id, created_at desc);

alter table public.csp_partner_message_recipients enable row level security;
revoke all on table public.csp_partner_message_recipients from public, anon, authenticated;

-- =============================================================================
-- 3) Sales materials library (admin publish / withdraw)
-- =============================================================================
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
  withdrawn_at timestamptz
);

alter table public.csp_sales_materials enable row level security;
revoke all on table public.csp_sales_materials from public, anon, authenticated;

create table if not exists public.csp_sales_material_versions (
  id uuid primary key default gen_random_uuid(),
  material_id uuid not null references public.csp_sales_materials(id),
  version text not null,
  asset_path text not null,
  change_note text,
  created_by_auth_user_id uuid,
  created_at timestamptz not null default now()
);

alter table public.csp_sales_material_versions enable row level security;
revoke all on table public.csp_sales_material_versions from public, anon, authenticated;

-- RPCs intentionally omitted in this candidate until Staging apply is approved.
-- Application code fail-closes messaging writes until csp_list/send message RPCs exist.
