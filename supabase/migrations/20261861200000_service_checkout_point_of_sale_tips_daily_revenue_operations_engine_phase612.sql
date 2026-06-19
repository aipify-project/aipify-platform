-- Phase 612 — Service Checkout, Point of Sale, Tips & Daily Revenue Operations Engine
-- Feature owner: CUSTOMER APP (/app/checkout) + Service POS Business Pack
-- Helpers: _pos612_*
-- Distinct from Phase 586 platform subscriptions/billing checkout

-- ---------------------------------------------------------------------------
-- Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_pos612_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  checkout_enabled boolean not null default true,
  tips_enabled boolean not null default true,
  tips_preselect_forbidden boolean not null default true,
  payment_verification_required boolean not null default true,
  companion_advisor_enabled boolean not null default true,
  daily_close_required boolean not null default true,
  cash_management_enabled boolean not null default true,
  fiken_export_enabled boolean not null default false,
  vacation_revenue_view_enabled boolean not null default true,
  idempotency_enforced boolean not null default true,
  retention_days integer not null default 365,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_pos612_settings enable row level security;
revoke all on public.organization_pos612_settings from authenticated, anon;

-- Transaction scopes (org, domain, location, employee, customer, currency)
create table if not exists public.organization_pos612_transaction_scopes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'transaction_scopes',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_transaction_scopes enable row level security;
revoke all on public.organization_pos612_transaction_scopes from authenticated, anon;

-- Checkout transaction types
create table if not exists public.organization_pos612_transaction_types (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'transaction_types',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_transaction_types enable row level security;
revoke all on public.organization_pos612_transaction_types from authenticated, anon;

-- Transaction status catalog (icon + text always)
create table if not exists public.organization_pos612_transaction_status_catalog (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'transaction_status_catalog',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_transaction_status_catalog enable row level security;
revoke all on public.organization_pos612_transaction_status_catalog from authenticated, anon;

-- Checkout origin tracking
create table if not exists public.organization_pos612_checkout_origins (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'checkout_origins',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_checkout_origins enable row level security;
revoke all on public.organization_pos612_checkout_origins from authenticated, anon;

-- Phase 610 appointment handoff — integrate, do not duplicate booking
create table if not exists public.organization_pos612_appointment_handoff_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'appointment_handoff_links',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_appointment_handoff_links enable row level security;
revoke all on public.organization_pos612_appointment_handoff_links from authenticated, anon;

-- Checkout cart sessions
create table if not exists public.organization_pos612_checkout_carts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'checkout_carts',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_checkout_carts enable row level security;
revoke all on public.organization_pos612_checkout_carts from authenticated, anon;

-- Cart service line items
create table if not exists public.organization_pos612_cart_services (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'cart_services',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_cart_services enable row level security;
revoke all on public.organization_pos612_cart_services from authenticated, anon;

-- Cart product line items
create table if not exists public.organization_pos612_cart_products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'cart_products',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_cart_products enable row level security;
revoke all on public.organization_pos612_cart_products from authenticated, anon;

-- Cart add-on line items
create table if not exists public.organization_pos612_cart_addons (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'cart_addons',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_cart_addons enable row level security;
revoke all on public.organization_pos612_cart_addons from authenticated, anon;

-- Cart discount applications
create table if not exists public.organization_pos612_cart_discounts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'cart_discounts',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_cart_discounts enable row level security;
revoke all on public.organization_pos612_cart_discounts from authenticated, anon;

-- Cart package items
create table if not exists public.organization_pos612_cart_packages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'cart_packages',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_cart_packages enable row level security;
revoke all on public.organization_pos612_cart_packages from authenticated, anon;

-- Cart membership items
create table if not exists public.organization_pos612_cart_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'cart_memberships',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_cart_memberships enable row level security;
revoke all on public.organization_pos612_cart_memberships from authenticated, anon;

-- Cart loyalty redemptions
create table if not exists public.organization_pos612_cart_loyalty (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'cart_loyalty',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_cart_loyalty enable row level security;
revoke all on public.organization_pos612_cart_loyalty from authenticated, anon;

-- Cart gift card applications
create table if not exists public.organization_pos612_cart_gift_cards (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'cart_gift_cards',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_cart_gift_cards enable row level security;
revoke all on public.organization_pos612_cart_gift_cards from authenticated, anon;

-- Cart tip lines — optional, no preselect, no pressure
create table if not exists public.organization_pos612_cart_tips (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'cart_tips',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_cart_tips enable row level security;
revoke all on public.organization_pos612_cart_tips from authenticated, anon;

-- Cart tax/VAT lines
create table if not exists public.organization_pos612_cart_taxes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'cart_taxes',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_cart_taxes enable row level security;
revoke all on public.organization_pos612_cart_taxes from authenticated, anon;

-- Price source tracking
create table if not exists public.organization_pos612_price_sources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'price_sources',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_price_sources enable row level security;
revoke all on public.organization_pos612_price_sources from authenticated, anon;

-- Price lock records
create table if not exists public.organization_pos612_price_locks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'price_locks',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_price_locks enable row level security;
revoke all on public.organization_pos612_price_locks from authenticated, anon;

-- Discount engine rules
create table if not exists public.organization_pos612_discount_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'discount_rules',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_discount_rules enable row level security;
revoke all on public.organization_pos612_discount_rules from authenticated, anon;

-- Discount combination rules
create table if not exists public.organization_pos612_discount_combination_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'discount_combination_rules',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_discount_combination_rules enable row level security;
revoke all on public.organization_pos612_discount_combination_rules from authenticated, anon;

-- Discount approval requests
create table if not exists public.organization_pos612_discount_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'discount_approvals',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_discount_approvals enable row level security;
revoke all on public.organization_pos612_discount_approvals from authenticated, anon;

-- Promo codes
create table if not exists public.organization_pos612_promo_codes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'promo_codes',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_promo_codes enable row level security;
revoke all on public.organization_pos612_promo_codes from authenticated, anon;

-- Phase 611 membership redemption integration
create table if not exists public.organization_pos612_membership_redemption_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'membership_redemption_links',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_membership_redemption_links enable row level security;
revoke all on public.organization_pos612_membership_redemption_links from authenticated, anon;

-- Phase 611 package redemption integration
create table if not exists public.organization_pos612_package_redemption_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'package_redemption_links',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_package_redemption_links enable row level security;
revoke all on public.organization_pos612_package_redemption_links from authenticated, anon;

-- Phase 611 loyalty redemption integration
create table if not exists public.organization_pos612_loyalty_redemption_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'loyalty_redemption_links',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_loyalty_redemption_links enable row level security;
revoke all on public.organization_pos612_loyalty_redemption_links from authenticated, anon;

-- Phase 611 gift card redemption integration
create table if not exists public.organization_pos612_gift_card_redemption_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'gift_card_redemption_links',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_gift_card_redemption_links enable row level security;
revoke all on public.organization_pos612_gift_card_redemption_links from authenticated, anon;

-- Phase 611 customer credit redemption
create table if not exists public.organization_pos612_customer_credit_redemption (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'customer_credit_redemption',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_customer_credit_redemption enable row level security;
revoke all on public.organization_pos612_customer_credit_redemption from authenticated, anon;

-- Phase 610 deposit application
create table if not exists public.organization_pos612_deposit_application (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'deposit_application',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_deposit_application enable row level security;
revoke all on public.organization_pos612_deposit_application from authenticated, anon;

-- Phase 610 deposit difference handling
create table if not exists public.organization_pos612_deposit_difference (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'deposit_difference',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_deposit_difference enable row level security;
revoke all on public.organization_pos612_deposit_difference from authenticated, anon;

-- Tips engine settings — optional, no preselect
create table if not exists public.organization_pos612_tips_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'tips_settings',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_tips_settings enable row level security;
revoke all on public.organization_pos612_tips_settings from authenticated, anon;

-- Tips attribution to employees
create table if not exists public.organization_pos612_tips_attribution (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'tips_attribution',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_tips_attribution enable row level security;
revoke all on public.organization_pos612_tips_attribution from authenticated, anon;

-- Tips privacy rules — aggregated analytics only
create table if not exists public.organization_pos612_tips_privacy_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'tips_privacy_rules',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_tips_privacy_rules enable row level security;
revoke all on public.organization_pos612_tips_privacy_rules from authenticated, anon;

-- Payment methods catalog
create table if not exists public.organization_pos612_payment_methods (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'payment_methods',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_payment_methods enable row level security;
revoke all on public.organization_pos612_payment_methods from authenticated, anon;

-- Split payment records
create table if not exists public.organization_pos612_split_payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'split_payments',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_split_payments enable row level security;
revoke all on public.organization_pos612_split_payments from authenticated, anon;

-- Multi-person payment splits
create table if not exists public.organization_pos612_multi_person_payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'multi_person_payments',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_multi_person_payments enable row level security;
revoke all on public.organization_pos612_multi_person_payments from authenticated, anon;

-- Terminal payment metadata + verified states
create table if not exists public.organization_pos612_terminal_payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'terminal_payments',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_terminal_payments enable row level security;
revoke all on public.organization_pos612_terminal_payments from authenticated, anon;

-- Vipps payment metadata + verified states
create table if not exists public.organization_pos612_vipps_payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'vipps_payments',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_vipps_payments enable row level security;
revoke all on public.organization_pos612_vipps_payments from authenticated, anon;

-- Stripe payment metadata + verified states
create table if not exists public.organization_pos612_stripe_payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'stripe_payments',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_stripe_payments enable row level security;
revoke all on public.organization_pos612_stripe_payments from authenticated, anon;

-- Klarna payment metadata + verified states
create table if not exists public.organization_pos612_klarna_payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'klarna_payments',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_klarna_payments enable row level security;
revoke all on public.organization_pos612_klarna_payments from authenticated, anon;

-- Invoice payment records
create table if not exists public.organization_pos612_invoice_payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'invoice_payments',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_invoice_payments enable row level security;
revoke all on public.organization_pos612_invoice_payments from authenticated, anon;

-- Payment link records
create table if not exists public.organization_pos612_payment_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'payment_links',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_payment_links enable row level security;
revoke all on public.organization_pos612_payment_links from authenticated, anon;

-- Phase 606/610 vacation payment continuity
create table if not exists public.organization_pos612_vacation_payment_continuity (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'vacation_payment_continuity',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_vacation_payment_continuity enable row level security;
revoke all on public.organization_pos612_vacation_payment_continuity from authenticated, anon;

-- Payment failure records
create table if not exists public.organization_pos612_payment_failures (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'payment_failures',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_payment_failures enable row level security;
revoke all on public.organization_pos612_payment_failures from authenticated, anon;

-- Payment idempotency keys — no duplicate charges
create table if not exists public.organization_pos612_payment_idempotency (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'payment_idempotency',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_payment_idempotency enable row level security;
revoke all on public.organization_pos612_payment_idempotency from authenticated, anon;

-- Auth vs capture distinction records
create table if not exists public.organization_pos612_auth_capture_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'auth_capture_records',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_auth_capture_records enable row level security;
revoke all on public.organization_pos612_auth_capture_records from authenticated, anon;

-- Receipt records
create table if not exists public.organization_pos612_receipts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'receipts',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_receipts enable row level security;
revoke all on public.organization_pos612_receipts from authenticated, anon;

-- Receipt delivery tracking
create table if not exists public.organization_pos612_receipt_delivery (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'receipt_delivery',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_receipt_delivery enable row level security;
revoke all on public.organization_pos612_receipt_delivery from authenticated, anon;

-- Receipt printer prep metadata
create table if not exists public.organization_pos612_receipt_printer_prep (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'receipt_printer_prep',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_receipt_printer_prep enable row level security;
revoke all on public.organization_pos612_receipt_printer_prep from authenticated, anon;

-- Cash drawer records
create table if not exists public.organization_pos612_cash_drawers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'cash_drawers',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_cash_drawers enable row level security;
revoke all on public.organization_pos612_cash_drawers from authenticated, anon;

-- Cash movement ledger
create table if not exists public.organization_pos612_cash_movements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'cash_movements',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_cash_movements enable row level security;
revoke all on public.organization_pos612_cash_movements from authenticated, anon;

-- Cash difference review — non-punitive
create table if not exists public.organization_pos612_cash_difference_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'cash_difference_reviews',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_cash_difference_reviews enable row level security;
revoke all on public.organization_pos612_cash_difference_reviews from authenticated, anon;

-- Daily close records
create table if not exists public.organization_pos612_daily_close_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'daily_close_records',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_daily_close_records enable row level security;
revoke all on public.organization_pos612_daily_close_records from authenticated, anon;

-- Daily close validation checks
create table if not exists public.organization_pos612_daily_close_validation (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'daily_close_validation',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_daily_close_validation enable row level security;
revoke all on public.organization_pos612_daily_close_validation from authenticated, anon;

-- Governed daily close reopening
create table if not exists public.organization_pos612_daily_close_reopening (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'daily_close_reopening',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_daily_close_reopening enable row level security;
revoke all on public.organization_pos612_daily_close_reopening from authenticated, anon;

-- Payment reconciliation
create table if not exists public.organization_pos612_payment_reconciliation (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'payment_reconciliation',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_payment_reconciliation enable row level security;
revoke all on public.organization_pos612_payment_reconciliation from authenticated, anon;

-- Settlement reconciliation
create table if not exists public.organization_pos612_settlement_reconciliation (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'settlement_reconciliation',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_settlement_reconciliation enable row level security;
revoke all on public.organization_pos612_settlement_reconciliation from authenticated, anon;

-- Fiken accounting integration prep
create table if not exists public.organization_pos612_fiken_integration_prep (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'fiken_integration_prep',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_fiken_integration_prep enable row level security;
revoke all on public.organization_pos612_fiken_integration_prep from authenticated, anon;

-- Fiken export status tracking
create table if not exists public.organization_pos612_fiken_export_statuses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'fiken_export_statuses',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_fiken_export_statuses enable row level security;
revoke all on public.organization_pos612_fiken_export_statuses from authenticated, anon;

-- Revenue recognition signals
create table if not exists public.organization_pos612_revenue_recognition_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'revenue_recognition_signals',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_revenue_recognition_signals enable row level security;
revoke all on public.organization_pos612_revenue_recognition_signals from authenticated, anon;

-- Tax/VAT rules
create table if not exists public.organization_pos612_tax_vat_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'tax_vat_rules',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_tax_vat_rules enable row level security;
revoke all on public.organization_pos612_tax_vat_rules from authenticated, anon;

-- Multi-currency checkout rules
create table if not exists public.organization_pos612_multi_currency_checkout (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'multi_currency_checkout',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_multi_currency_checkout enable row level security;
revoke all on public.organization_pos612_multi_currency_checkout from authenticated, anon;

-- Refund request records
create table if not exists public.organization_pos612_refund_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'refund_requests',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_refund_requests enable row level security;
revoke all on public.organization_pos612_refund_requests from authenticated, anon;

-- Partial refund records
create table if not exists public.organization_pos612_partial_refunds (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'partial_refunds',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_partial_refunds enable row level security;
revoke all on public.organization_pos612_partial_refunds from authenticated, anon;

-- Refund approval workflow
create table if not exists public.organization_pos612_refund_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'refund_approvals',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_refund_approvals enable row level security;
revoke all on public.organization_pos612_refund_approvals from authenticated, anon;

-- Cash refund records
create table if not exists public.organization_pos612_cash_refunds (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'cash_refunds',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_cash_refunds enable row level security;
revoke all on public.organization_pos612_cash_refunds from authenticated, anon;

-- Return merchandise records
create table if not exists public.organization_pos612_return_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'return_records',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_return_records enable row level security;
revoke all on public.organization_pos612_return_records from authenticated, anon;

-- Phase 611 service recovery connection
create table if not exists public.organization_pos612_service_recovery_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'service_recovery_links',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_service_recovery_links enable row level security;
revoke all on public.organization_pos612_service_recovery_links from authenticated, anon;

-- Credit note records
create table if not exists public.organization_pos612_credit_notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'credit_notes',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_credit_notes enable row level security;
revoke all on public.organization_pos612_credit_notes from authenticated, anon;

-- Phase 610 cancellation fees
create table if not exists public.organization_pos612_cancellation_fees (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'cancellation_fees',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_cancellation_fees enable row level security;
revoke all on public.organization_pos612_cancellation_fees from authenticated, anon;

-- Phase 610 no-show fees
create table if not exists public.organization_pos612_no_show_fees (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'no_show_fees',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_no_show_fees enable row level security;
revoke all on public.organization_pos612_no_show_fees from authenticated, anon;

-- Chargeback records
create table if not exists public.organization_pos612_chargebacks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'chargebacks',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_chargebacks enable row level security;
revoke all on public.organization_pos612_chargebacks from authenticated, anon;

-- Payment dispute records
create table if not exists public.organization_pos612_disputes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'disputes',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_disputes enable row level security;
revoke all on public.organization_pos612_disputes from authenticated, anon;

-- Fraud review records
create table if not exists public.organization_pos612_fraud_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'fraud_reviews',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_fraud_reviews enable row level security;
revoke all on public.organization_pos612_fraud_reviews from authenticated, anon;

-- Product inventory signals — no duplicate warehouse
create table if not exists public.organization_pos612_inventory_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'inventory_signals',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_inventory_signals enable row level security;
revoke all on public.organization_pos612_inventory_signals from authenticated, anon;

-- Low stock alerts
create table if not exists public.organization_pos612_low_stock_alerts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'low_stock_alerts',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_low_stock_alerts enable row level security;
revoke all on public.organization_pos612_low_stock_alerts from authenticated, anon;

-- Service consumable usage signals
create table if not exists public.organization_pos612_service_consumables (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'service_consumables',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_service_consumables enable row level security;
revoke all on public.organization_pos612_service_consumables from authenticated, anon;

-- Employee checkout attribution
create table if not exists public.organization_pos612_employee_attribution (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'employee_attribution',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_employee_attribution enable row level security;
revoke all on public.organization_pos612_employee_attribution from authenticated, anon;

-- Team attribution records
create table if not exists public.organization_pos612_team_attribution (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'team_attribution',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_team_attribution enable row level security;
revoke all on public.organization_pos612_team_attribution from authenticated, anon;

-- Commission event preparation
create table if not exists public.organization_pos612_commission_event_prep (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'commission_event_prep',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_commission_event_prep enable row level security;
revoke all on public.organization_pos612_commission_event_prep from authenticated, anon;

-- Front desk checkout queue
create table if not exists public.organization_pos612_front_desk_queue (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'front_desk_queue',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_front_desk_queue enable row level security;
revoke all on public.organization_pos612_front_desk_queue from authenticated, anon;

-- Self-checkout sessions
create table if not exists public.organization_pos612_self_checkout_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'self_checkout_sessions',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_self_checkout_sessions enable row level security;
revoke all on public.organization_pos612_self_checkout_sessions from authenticated, anon;

-- QR checkout sessions
create table if not exists public.organization_pos612_qr_checkout_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'qr_checkout_sessions',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_qr_checkout_sessions enable row level security;
revoke all on public.organization_pos612_qr_checkout_sessions from authenticated, anon;

-- Mobile POS sessions
create table if not exists public.organization_pos612_mobile_pos_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'mobile_pos_sessions',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_mobile_pos_sessions enable row level security;
revoke all on public.organization_pos612_mobile_pos_sessions from authenticated, anon;

-- Offline checkout handling
create table if not exists public.organization_pos612_offline_handling (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'offline_handling',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_offline_handling enable row level security;
revoke all on public.organization_pos612_offline_handling from authenticated, anon;

-- Companion Checkout Assistant metadata
create table if not exists public.organization_pos612_checkout_advisor_meta (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'checkout_advisor_meta',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_checkout_advisor_meta enable row level security;
revoke all on public.organization_pos612_checkout_advisor_meta from authenticated, anon;

-- Transparent customer experience rules
create table if not exists public.organization_pos612_customer_experience_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'customer_experience_rules',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_customer_experience_rules enable row level security;
revoke all on public.organization_pos612_customer_experience_rules from authenticated, anon;

-- Checkout approval engine
create table if not exists public.organization_pos612_checkout_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'checkout_approvals',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_checkout_approvals enable row level security;
revoke all on public.organization_pos612_checkout_approvals from authenticated, anon;

-- Segregation of duties rules
create table if not exists public.organization_pos612_segregation_of_duties (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'segregation_of_duties',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_segregation_of_duties enable row level security;
revoke all on public.organization_pos612_segregation_of_duties from authenticated, anon;

-- Multilingual checkout copy (en/no/sv/da)
create table if not exists public.organization_pos612_locale_checkout_copy (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'locale_checkout_copy',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_locale_checkout_copy enable row level security;
revoke all on public.organization_pos612_locale_checkout_copy from authenticated, anon;

-- Accessibility rules for checkout
create table if not exists public.organization_pos612_accessibility_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'accessibility_rules',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_accessibility_rules enable row level security;
revoke all on public.organization_pos612_accessibility_rules from authenticated, anon;

-- Employee checkout dashboard
create table if not exists public.organization_pos612_employee_dashboard_meta (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'employee_dashboard_meta',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_employee_dashboard_meta enable row level security;
revoke all on public.organization_pos612_employee_dashboard_meta from authenticated, anon;

-- Manager checkout dashboard
create table if not exists public.organization_pos612_manager_dashboard_meta (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'manager_dashboard_meta',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_manager_dashboard_meta enable row level security;
revoke all on public.organization_pos612_manager_dashboard_meta from authenticated, anon;

-- Executive checkout dashboard
create table if not exists public.organization_pos612_executive_dashboard_meta (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'executive_dashboard_meta',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_executive_dashboard_meta enable row level security;
revoke all on public.organization_pos612_executive_dashboard_meta from authenticated, anon;

-- Vacation revenue view — Phase 606 continuity
create table if not exists public.organization_pos612_vacation_revenue_view (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'vacation_revenue_view',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_vacation_revenue_view enable row level security;
revoke all on public.organization_pos612_vacation_revenue_view from authenticated, anon;

-- Since Last Login integration
create table if not exists public.organization_pos612_since_last_login_meta (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'since_last_login_meta',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_since_last_login_meta enable row level security;
revoke all on public.organization_pos612_since_last_login_meta from authenticated, anon;

-- Revenue analytics signals
create table if not exists public.organization_pos612_revenue_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'revenue_analytics',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_revenue_analytics enable row level security;
revoke all on public.organization_pos612_revenue_analytics from authenticated, anon;

-- Payment analytics signals
create table if not exists public.organization_pos612_payment_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'payment_analytics',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_payment_analytics enable row level security;
revoke all on public.organization_pos612_payment_analytics from authenticated, anon;

-- Discount analytics
create table if not exists public.organization_pos612_discount_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'discount_analytics',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_discount_analytics enable row level security;
revoke all on public.organization_pos612_discount_analytics from authenticated, anon;

-- Tip privacy analytics — aggregated only
create table if not exists public.organization_pos612_tip_privacy_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'tip_privacy_analytics',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_tip_privacy_analytics enable row level security;
revoke all on public.organization_pos612_tip_privacy_analytics from authenticated, anon;

-- Product checkout analytics
create table if not exists public.organization_pos612_product_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'product_analytics',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_product_analytics enable row level security;
revoke all on public.organization_pos612_product_analytics from authenticated, anon;

-- Profitability signals
create table if not exists public.organization_pos612_profitability_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'profitability_signals',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_profitability_signals enable row level security;
revoke all on public.organization_pos612_profitability_signals from authenticated, anon;

-- Phase 588 revenue ops integration
create table if not exists public.organization_pos612_revenue_ops_integration (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'revenue_ops_integration',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_revenue_ops_integration enable row level security;
revoke all on public.organization_pos612_revenue_ops_integration from authenticated, anon;

-- Phase 611 client CRM integration
create table if not exists public.organization_pos612_client_crm_integration (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'client_crm_integration',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_client_crm_integration enable row level security;
revoke all on public.organization_pos612_client_crm_integration from authenticated, anon;

-- Phase 610 booking integration
create table if not exists public.organization_pos612_booking_integration (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'booking_integration',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_booking_integration enable row level security;
revoke all on public.organization_pos612_booking_integration from authenticated, anon;

-- Phase 609 time tracking integration
create table if not exists public.organization_pos612_time_tracking_integration (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'time_tracking_integration',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_time_tracking_integration enable row level security;
revoke all on public.organization_pos612_time_tracking_integration from authenticated, anon;

-- Import/export jobs
create table if not exists public.organization_pos612_import_export_jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'import_export_jobs',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_import_export_jobs enable row level security;
revoke all on public.organization_pos612_import_export_jobs from authenticated, anon;

-- Checkout API metadata
create table if not exists public.organization_pos612_checkout_api_meta (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'checkout_api_meta',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_checkout_api_meta enable row level security;
revoke all on public.organization_pos612_checkout_api_meta from authenticated, anon;

-- Event bus signals
create table if not exists public.organization_pos612_event_bus_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'event_bus_signals',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_event_bus_signals enable row level security;
revoke all on public.organization_pos612_event_bus_signals from authenticated, anon;

-- Checkout notification preferences
create table if not exists public.organization_pos612_notification_prefs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'notification_prefs',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_notification_prefs enable row level security;
revoke all on public.organization_pos612_notification_prefs from authenticated, anon;

-- Checkout security rules
create table if not exists public.organization_pos612_security_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'security_rules',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_security_rules enable row level security;
revoke all on public.organization_pos612_security_rules from authenticated, anon;

-- Data retention policies
create table if not exists public.organization_pos612_retention_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'retention_policies',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_retention_policies enable row level security;
revoke all on public.organization_pos612_retention_policies from authenticated, anon;

-- Checkout governance rules
create table if not exists public.organization_pos612_governance_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'governance_rules',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_governance_rules enable row level security;
revoke all on public.organization_pos612_governance_rules from authenticated, anon;

-- Open checkout sessions
create table if not exists public.organization_pos612_open_checkouts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'open_checkouts',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_open_checkouts enable row level security;
revoke all on public.organization_pos612_open_checkouts from authenticated, anon;

-- Completed sales records
create table if not exists public.organization_pos612_completed_sales (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'completed_sales',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_completed_sales enable row level security;
revoke all on public.organization_pos612_completed_sales from authenticated, anon;

-- Appointment-linked checkouts
create table if not exists public.organization_pos612_appointment_checkouts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'appointment_checkouts',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_appointment_checkouts enable row level security;
revoke all on public.organization_pos612_appointment_checkouts from authenticated, anon;

-- Checkout reports catalog
create table if not exists public.organization_pos612_checkout_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'checkout_reports',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_checkout_reports enable row level security;
revoke all on public.organization_pos612_checkout_reports from authenticated, anon;

-- Service POS Business Pack registry
create table if not exists public.organization_pos612_business_pack_registry (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'business_pack_registry',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_pos612_business_pack_registry enable row level security;
revoke all on public.organization_pos612_business_pack_registry from authenticated, anon;

create table if not exists public.organization_pos612_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'checkout',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_pos612_audit_logs enable row level security;
revoke all on public.organization_pos612_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public._pos612_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._pos612_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'checkout'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_pos612_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'checkout'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._pos612_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_pos612_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._pos612_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_pos612_checkout_carts where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_pos612_transaction_scopes (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'transact_baseline', initcap(replace('transaction_scopes', '_', ' ')), 'active', 'circle', 'Active', 'transaction_scopes', 'organization', 'routine', '',
    'Baseline seed — Phase 612 transaction_scopes.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_transaction_types (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'transact_baseline', initcap(replace('transaction_types', '_', ' ')), 'active', 'circle', 'Active', 'transaction_types', 'organization', 'routine', '',
    'Baseline seed — Phase 612 transaction_types.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_transaction_status_catalog (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'transact_baseline', initcap(replace('transaction_status_catalog', '_', ' ')), 'active', 'circle', 'Active', 'transaction_status_catalog', 'organization', 'routine', '',
    'Baseline seed — Phase 612 transaction_status_catalog.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_checkout_origins (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'checkout_baseline', initcap(replace('checkout_origins', '_', ' ')), 'active', 'circle', 'Active', 'checkout_origins', 'organization', 'routine', '',
    'Baseline seed — Phase 612 checkout_origins.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_appointment_handoff_links (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'appointm_baseline', initcap(replace('appointment_handoff_links', '_', ' ')), 'active', 'circle', 'Active', 'appointment_handoff_links', 'organization', 'routine', '',
    'Baseline seed — Phase 612 appointment_handoff_links.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_checkout_carts (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'checkout_baseline', initcap(replace('checkout_carts', '_', ' ')), 'active', 'circle', 'Active', 'checkout_carts', 'organization', 'routine', '',
    'Baseline seed — Phase 612 checkout_carts.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_cart_services (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'cartserv_baseline', initcap(replace('cart_services', '_', ' ')), 'active', 'circle', 'Active', 'cart_services', 'organization', 'routine', '',
    'Baseline seed — Phase 612 cart_services.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_cart_products (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'cartprod_baseline', initcap(replace('cart_products', '_', ' ')), 'active', 'circle', 'Active', 'cart_products', 'organization', 'routine', '',
    'Baseline seed — Phase 612 cart_products.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_cart_addons (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'cartaddo_baseline', initcap(replace('cart_addons', '_', ' ')), 'active', 'circle', 'Active', 'cart_addons', 'organization', 'routine', '',
    'Baseline seed — Phase 612 cart_addons.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_cart_discounts (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'cartdisc_baseline', initcap(replace('cart_discounts', '_', ' ')), 'active', 'circle', 'Active', 'cart_discounts', 'organization', 'routine', '',
    'Baseline seed — Phase 612 cart_discounts.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_cart_packages (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'cartpack_baseline', initcap(replace('cart_packages', '_', ' ')), 'active', 'circle', 'Active', 'cart_packages', 'organization', 'routine', '',
    'Baseline seed — Phase 612 cart_packages.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_cart_memberships (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'cartmemb_baseline', initcap(replace('cart_memberships', '_', ' ')), 'active', 'circle', 'Active', 'cart_memberships', 'organization', 'routine', '',
    'Baseline seed — Phase 612 cart_memberships.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_cart_loyalty (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'cartloya_baseline', initcap(replace('cart_loyalty', '_', ' ')), 'active', 'circle', 'Active', 'cart_loyalty', 'organization', 'routine', '',
    'Baseline seed — Phase 612 cart_loyalty.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_cart_gift_cards (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'cartgift_baseline', initcap(replace('cart_gift_cards', '_', ' ')), 'active', 'circle', 'Active', 'cart_gift_cards', 'organization', 'routine', '',
    'Baseline seed — Phase 612 cart_gift_cards.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_cart_tips (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'carttips_baseline', initcap(replace('cart_tips', '_', ' ')), 'active', 'circle', 'Active', 'cart_tips', 'organization', 'routine', '',
    'Baseline seed — Phase 612 cart_tips.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_cart_taxes (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'carttaxe_baseline', initcap(replace('cart_taxes', '_', ' ')), 'active', 'circle', 'Active', 'cart_taxes', 'organization', 'routine', '',
    'Baseline seed — Phase 612 cart_taxes.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_price_sources (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'pricesou_baseline', initcap(replace('price_sources', '_', ' ')), 'active', 'circle', 'Active', 'price_sources', 'organization', 'routine', '',
    'Baseline seed — Phase 612 price_sources.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_price_locks (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'priceloc_baseline', initcap(replace('price_locks', '_', ' ')), 'active', 'circle', 'Active', 'price_locks', 'organization', 'routine', '',
    'Baseline seed — Phase 612 price_locks.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_discount_rules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'discount_baseline', initcap(replace('discount_rules', '_', ' ')), 'active', 'circle', 'Active', 'discount_rules', 'organization', 'routine', '',
    'Baseline seed — Phase 612 discount_rules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_discount_combination_rules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'discount_baseline', initcap(replace('discount_combination_rules', '_', ' ')), 'active', 'circle', 'Active', 'discount_combination_rules', 'organization', 'routine', '',
    'Baseline seed — Phase 612 discount_combination_rules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_discount_approvals (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'discount_baseline', initcap(replace('discount_approvals', '_', ' ')), 'active', 'circle', 'Active', 'discount_approvals', 'organization', 'routine', '',
    'Baseline seed — Phase 612 discount_approvals.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_promo_codes (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'promocod_baseline', initcap(replace('promo_codes', '_', ' ')), 'active', 'circle', 'Active', 'promo_codes', 'organization', 'routine', '',
    'Baseline seed — Phase 612 promo_codes.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_membership_redemption_links (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'membersh_baseline', initcap(replace('membership_redemption_links', '_', ' ')), 'active', 'circle', 'Active', 'membership_redemption_links', 'organization', 'routine', '',
    'Baseline seed — Phase 612 membership_redemption_links.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_package_redemption_links (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'packager_baseline', initcap(replace('package_redemption_links', '_', ' ')), 'active', 'circle', 'Active', 'package_redemption_links', 'organization', 'routine', '',
    'Baseline seed — Phase 612 package_redemption_links.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_loyalty_redemption_links (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'loyaltyr_baseline', initcap(replace('loyalty_redemption_links', '_', ' ')), 'active', 'circle', 'Active', 'loyalty_redemption_links', 'organization', 'routine', '',
    'Baseline seed — Phase 612 loyalty_redemption_links.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_gift_card_redemption_links (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'giftcard_baseline', initcap(replace('gift_card_redemption_links', '_', ' ')), 'active', 'circle', 'Active', 'gift_card_redemption_links', 'organization', 'routine', '',
    'Baseline seed — Phase 612 gift_card_redemption_links.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_customer_credit_redemption (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'customer_baseline', initcap(replace('customer_credit_redemption', '_', ' ')), 'active', 'circle', 'Active', 'customer_credit_redemption', 'organization', 'routine', '',
    'Baseline seed — Phase 612 customer_credit_redemption.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_deposit_application (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'deposita_baseline', initcap(replace('deposit_application', '_', ' ')), 'active', 'circle', 'Active', 'deposit_application', 'organization', 'routine', '',
    'Baseline seed — Phase 612 deposit_application.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_deposit_difference (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'depositd_baseline', initcap(replace('deposit_difference', '_', ' ')), 'active', 'circle', 'Active', 'deposit_difference', 'organization', 'routine', '',
    'Baseline seed — Phase 612 deposit_difference.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_tips_settings (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'tipssett_baseline', initcap(replace('tips_settings', '_', ' ')), 'active', 'circle', 'Active', 'tips_settings', 'organization', 'routine', '',
    'Baseline seed — Phase 612 tips_settings.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_tips_attribution (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'tipsattr_baseline', initcap(replace('tips_attribution', '_', ' ')), 'active', 'circle', 'Active', 'tips_attribution', 'organization', 'routine', '',
    'Baseline seed — Phase 612 tips_attribution.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_tips_privacy_rules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'tipspriv_baseline', initcap(replace('tips_privacy_rules', '_', ' ')), 'active', 'circle', 'Active', 'tips_privacy_rules', 'organization', 'routine', '',
    'Baseline seed — Phase 612 tips_privacy_rules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_payment_methods (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'paymentm_baseline', initcap(replace('payment_methods', '_', ' ')), 'active', 'circle', 'Active', 'payment_methods', 'organization', 'routine', '',
    'Baseline seed — Phase 612 payment_methods.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_split_payments (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'splitpay_baseline', initcap(replace('split_payments', '_', ' ')), 'active', 'circle', 'Active', 'split_payments', 'organization', 'routine', '',
    'Baseline seed — Phase 612 split_payments.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_multi_person_payments (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'multiper_baseline', initcap(replace('multi_person_payments', '_', ' ')), 'active', 'circle', 'Active', 'multi_person_payments', 'organization', 'routine', '',
    'Baseline seed — Phase 612 multi_person_payments.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_terminal_payments (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'terminal_baseline', initcap(replace('terminal_payments', '_', ' ')), 'active', 'circle', 'Active', 'terminal_payments', 'organization', 'routine', '',
    'Baseline seed — Phase 612 terminal_payments.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_vipps_payments (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'vippspay_baseline', initcap(replace('vipps_payments', '_', ' ')), 'active', 'circle', 'Active', 'vipps_payments', 'organization', 'routine', '',
    'Baseline seed — Phase 612 vipps_payments.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_stripe_payments (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'stripepa_baseline', initcap(replace('stripe_payments', '_', ' ')), 'active', 'circle', 'Active', 'stripe_payments', 'organization', 'routine', '',
    'Baseline seed — Phase 612 stripe_payments.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_klarna_payments (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'klarnapa_baseline', initcap(replace('klarna_payments', '_', ' ')), 'active', 'circle', 'Active', 'klarna_payments', 'organization', 'routine', '',
    'Baseline seed — Phase 612 klarna_payments.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_invoice_payments (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'invoicep_baseline', initcap(replace('invoice_payments', '_', ' ')), 'active', 'circle', 'Active', 'invoice_payments', 'organization', 'routine', '',
    'Baseline seed — Phase 612 invoice_payments.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_payment_links (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'paymentl_baseline', initcap(replace('payment_links', '_', ' ')), 'active', 'circle', 'Active', 'payment_links', 'organization', 'routine', '',
    'Baseline seed — Phase 612 payment_links.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_vacation_payment_continuity (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'vacation_baseline', initcap(replace('vacation_payment_continuity', '_', ' ')), 'active', 'circle', 'Active', 'vacation_payment_continuity', 'organization', 'routine', '',
    'Baseline seed — Phase 612 vacation_payment_continuity.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_payment_failures (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'paymentf_baseline', initcap(replace('payment_failures', '_', ' ')), 'active', 'circle', 'Active', 'payment_failures', 'organization', 'routine', '',
    'Baseline seed — Phase 612 payment_failures.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_payment_idempotency (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'paymenti_baseline', initcap(replace('payment_idempotency', '_', ' ')), 'active', 'circle', 'Active', 'payment_idempotency', 'organization', 'routine', '',
    'Baseline seed — Phase 612 payment_idempotency.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_auth_capture_records (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'authcapt_baseline', initcap(replace('auth_capture_records', '_', ' ')), 'active', 'circle', 'Active', 'auth_capture_records', 'organization', 'routine', '',
    'Baseline seed — Phase 612 auth_capture_records.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_receipts (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'receipts_baseline', initcap(replace('receipts', '_', ' ')), 'active', 'circle', 'Active', 'receipts', 'organization', 'routine', '',
    'Baseline seed — Phase 612 receipts.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_receipt_delivery (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'receiptd_baseline', initcap(replace('receipt_delivery', '_', ' ')), 'active', 'circle', 'Active', 'receipt_delivery', 'organization', 'routine', '',
    'Baseline seed — Phase 612 receipt_delivery.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_receipt_printer_prep (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'receiptp_baseline', initcap(replace('receipt_printer_prep', '_', ' ')), 'active', 'circle', 'Active', 'receipt_printer_prep', 'organization', 'routine', '',
    'Baseline seed — Phase 612 receipt_printer_prep.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_cash_drawers (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'cashdraw_baseline', initcap(replace('cash_drawers', '_', ' ')), 'active', 'circle', 'Active', 'cash_drawers', 'organization', 'routine', '',
    'Baseline seed — Phase 612 cash_drawers.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_cash_movements (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'cashmove_baseline', initcap(replace('cash_movements', '_', ' ')), 'active', 'circle', 'Active', 'cash_movements', 'organization', 'routine', '',
    'Baseline seed — Phase 612 cash_movements.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_cash_difference_reviews (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'cashdiff_baseline', initcap(replace('cash_difference_reviews', '_', ' ')), 'active', 'circle', 'Active', 'cash_difference_reviews', 'organization', 'routine', '',
    'Baseline seed — Phase 612 cash_difference_reviews.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_daily_close_records (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'dailyclo_baseline', initcap(replace('daily_close_records', '_', ' ')), 'active', 'circle', 'Active', 'daily_close_records', 'organization', 'routine', '',
    'Baseline seed — Phase 612 daily_close_records.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_daily_close_validation (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'dailyclo_baseline', initcap(replace('daily_close_validation', '_', ' ')), 'active', 'circle', 'Active', 'daily_close_validation', 'organization', 'routine', '',
    'Baseline seed — Phase 612 daily_close_validation.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_daily_close_reopening (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'dailyclo_baseline', initcap(replace('daily_close_reopening', '_', ' ')), 'active', 'circle', 'Active', 'daily_close_reopening', 'organization', 'routine', '',
    'Baseline seed — Phase 612 daily_close_reopening.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_payment_reconciliation (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'paymentr_baseline', initcap(replace('payment_reconciliation', '_', ' ')), 'active', 'circle', 'Active', 'payment_reconciliation', 'organization', 'routine', '',
    'Baseline seed — Phase 612 payment_reconciliation.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_settlement_reconciliation (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'settleme_baseline', initcap(replace('settlement_reconciliation', '_', ' ')), 'active', 'circle', 'Active', 'settlement_reconciliation', 'organization', 'routine', '',
    'Baseline seed — Phase 612 settlement_reconciliation.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_fiken_integration_prep (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'fikenint_baseline', initcap(replace('fiken_integration_prep', '_', ' ')), 'active', 'circle', 'Active', 'fiken_integration_prep', 'organization', 'routine', '',
    'Baseline seed — Phase 612 fiken_integration_prep.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_fiken_export_statuses (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'fikenexp_baseline', initcap(replace('fiken_export_statuses', '_', ' ')), 'active', 'circle', 'Active', 'fiken_export_statuses', 'organization', 'routine', '',
    'Baseline seed — Phase 612 fiken_export_statuses.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_revenue_recognition_signals (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'revenuer_baseline', initcap(replace('revenue_recognition_signals', '_', ' ')), 'active', 'circle', 'Active', 'revenue_recognition_signals', 'organization', 'routine', '',
    'Baseline seed — Phase 612 revenue_recognition_signals.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_tax_vat_rules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'taxvatru_baseline', initcap(replace('tax_vat_rules', '_', ' ')), 'active', 'circle', 'Active', 'tax_vat_rules', 'organization', 'routine', '',
    'Baseline seed — Phase 612 tax_vat_rules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_multi_currency_checkout (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'multicur_baseline', initcap(replace('multi_currency_checkout', '_', ' ')), 'active', 'circle', 'Active', 'multi_currency_checkout', 'organization', 'routine', '',
    'Baseline seed — Phase 612 multi_currency_checkout.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_refund_requests (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'refundre_baseline', initcap(replace('refund_requests', '_', ' ')), 'active', 'circle', 'Active', 'refund_requests', 'organization', 'routine', '',
    'Baseline seed — Phase 612 refund_requests.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_partial_refunds (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'partialr_baseline', initcap(replace('partial_refunds', '_', ' ')), 'active', 'circle', 'Active', 'partial_refunds', 'organization', 'routine', '',
    'Baseline seed — Phase 612 partial_refunds.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_refund_approvals (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'refundap_baseline', initcap(replace('refund_approvals', '_', ' ')), 'active', 'circle', 'Active', 'refund_approvals', 'organization', 'routine', '',
    'Baseline seed — Phase 612 refund_approvals.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_cash_refunds (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'cashrefu_baseline', initcap(replace('cash_refunds', '_', ' ')), 'active', 'circle', 'Active', 'cash_refunds', 'organization', 'routine', '',
    'Baseline seed — Phase 612 cash_refunds.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_return_records (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'returnre_baseline', initcap(replace('return_records', '_', ' ')), 'active', 'circle', 'Active', 'return_records', 'organization', 'routine', '',
    'Baseline seed — Phase 612 return_records.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_service_recovery_links (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'servicer_baseline', initcap(replace('service_recovery_links', '_', ' ')), 'active', 'circle', 'Active', 'service_recovery_links', 'organization', 'routine', '',
    'Baseline seed — Phase 612 service_recovery_links.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_credit_notes (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'creditno_baseline', initcap(replace('credit_notes', '_', ' ')), 'active', 'circle', 'Active', 'credit_notes', 'organization', 'routine', '',
    'Baseline seed — Phase 612 credit_notes.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_cancellation_fees (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'cancella_baseline', initcap(replace('cancellation_fees', '_', ' ')), 'active', 'circle', 'Active', 'cancellation_fees', 'organization', 'routine', '',
    'Baseline seed — Phase 612 cancellation_fees.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_no_show_fees (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'noshowfe_baseline', initcap(replace('no_show_fees', '_', ' ')), 'active', 'circle', 'Active', 'no_show_fees', 'organization', 'routine', '',
    'Baseline seed — Phase 612 no_show_fees.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_chargebacks (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'chargeba_baseline', initcap(replace('chargebacks', '_', ' ')), 'active', 'circle', 'Active', 'chargebacks', 'organization', 'routine', '',
    'Baseline seed — Phase 612 chargebacks.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_disputes (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'disputes_baseline', initcap(replace('disputes', '_', ' ')), 'active', 'circle', 'Active', 'disputes', 'organization', 'routine', '',
    'Baseline seed — Phase 612 disputes.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_fraud_reviews (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'fraudrev_baseline', initcap(replace('fraud_reviews', '_', ' ')), 'active', 'circle', 'Active', 'fraud_reviews', 'organization', 'routine', '',
    'Baseline seed — Phase 612 fraud_reviews.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_inventory_signals (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'inventor_baseline', initcap(replace('inventory_signals', '_', ' ')), 'active', 'circle', 'Active', 'inventory_signals', 'organization', 'routine', '',
    'Baseline seed — Phase 612 inventory_signals.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_low_stock_alerts (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'lowstock_baseline', initcap(replace('low_stock_alerts', '_', ' ')), 'active', 'circle', 'Active', 'low_stock_alerts', 'organization', 'routine', '',
    'Baseline seed — Phase 612 low_stock_alerts.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_service_consumables (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'servicec_baseline', initcap(replace('service_consumables', '_', ' ')), 'active', 'circle', 'Active', 'service_consumables', 'organization', 'routine', '',
    'Baseline seed — Phase 612 service_consumables.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_employee_attribution (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'employee_baseline', initcap(replace('employee_attribution', '_', ' ')), 'active', 'circle', 'Active', 'employee_attribution', 'organization', 'routine', '',
    'Baseline seed — Phase 612 employee_attribution.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_team_attribution (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'teamattr_baseline', initcap(replace('team_attribution', '_', ' ')), 'active', 'circle', 'Active', 'team_attribution', 'organization', 'routine', '',
    'Baseline seed — Phase 612 team_attribution.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_commission_event_prep (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'commissi_baseline', initcap(replace('commission_event_prep', '_', ' ')), 'active', 'circle', 'Active', 'commission_event_prep', 'organization', 'routine', '',
    'Baseline seed — Phase 612 commission_event_prep.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_front_desk_queue (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'frontdes_baseline', initcap(replace('front_desk_queue', '_', ' ')), 'active', 'circle', 'Active', 'front_desk_queue', 'organization', 'routine', '',
    'Baseline seed — Phase 612 front_desk_queue.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_self_checkout_sessions (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'selfchec_baseline', initcap(replace('self_checkout_sessions', '_', ' ')), 'active', 'circle', 'Active', 'self_checkout_sessions', 'organization', 'routine', '',
    'Baseline seed — Phase 612 self_checkout_sessions.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_qr_checkout_sessions (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'qrchecko_baseline', initcap(replace('qr_checkout_sessions', '_', ' ')), 'active', 'circle', 'Active', 'qr_checkout_sessions', 'organization', 'routine', '',
    'Baseline seed — Phase 612 qr_checkout_sessions.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_mobile_pos_sessions (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'mobilepo_baseline', initcap(replace('mobile_pos_sessions', '_', ' ')), 'active', 'circle', 'Active', 'mobile_pos_sessions', 'organization', 'routine', '',
    'Baseline seed — Phase 612 mobile_pos_sessions.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_offline_handling (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'offlineh_baseline', initcap(replace('offline_handling', '_', ' ')), 'active', 'circle', 'Active', 'offline_handling', 'organization', 'routine', '',
    'Baseline seed — Phase 612 offline_handling.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_checkout_advisor_meta (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'checkout_baseline', initcap(replace('checkout_advisor_meta', '_', ' ')), 'active', 'circle', 'Active', 'checkout_advisor_meta', 'organization', 'routine', '',
    'Baseline seed — Phase 612 checkout_advisor_meta.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_customer_experience_rules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'customer_baseline', initcap(replace('customer_experience_rules', '_', ' ')), 'active', 'circle', 'Active', 'customer_experience_rules', 'organization', 'routine', '',
    'Baseline seed — Phase 612 customer_experience_rules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_checkout_approvals (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'checkout_baseline', initcap(replace('checkout_approvals', '_', ' ')), 'active', 'circle', 'Active', 'checkout_approvals', 'organization', 'routine', '',
    'Baseline seed — Phase 612 checkout_approvals.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_segregation_of_duties (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'segregat_baseline', initcap(replace('segregation_of_duties', '_', ' ')), 'active', 'circle', 'Active', 'segregation_of_duties', 'organization', 'routine', '',
    'Baseline seed — Phase 612 segregation_of_duties.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_locale_checkout_copy (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'localech_baseline', initcap(replace('locale_checkout_copy', '_', ' ')), 'active', 'circle', 'Active', 'locale_checkout_copy', 'organization', 'routine', '',
    'Baseline seed — Phase 612 locale_checkout_copy.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_accessibility_rules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'accessib_baseline', initcap(replace('accessibility_rules', '_', ' ')), 'active', 'circle', 'Active', 'accessibility_rules', 'organization', 'routine', '',
    'Baseline seed — Phase 612 accessibility_rules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_employee_dashboard_meta (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'employee_baseline', initcap(replace('employee_dashboard_meta', '_', ' ')), 'active', 'circle', 'Active', 'employee_dashboard_meta', 'organization', 'routine', '',
    'Baseline seed — Phase 612 employee_dashboard_meta.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_manager_dashboard_meta (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'managerd_baseline', initcap(replace('manager_dashboard_meta', '_', ' ')), 'active', 'circle', 'Active', 'manager_dashboard_meta', 'organization', 'routine', '',
    'Baseline seed — Phase 612 manager_dashboard_meta.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_executive_dashboard_meta (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'executiv_baseline', initcap(replace('executive_dashboard_meta', '_', ' ')), 'active', 'circle', 'Active', 'executive_dashboard_meta', 'organization', 'routine', '',
    'Baseline seed — Phase 612 executive_dashboard_meta.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_vacation_revenue_view (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'vacation_baseline', initcap(replace('vacation_revenue_view', '_', ' ')), 'active', 'circle', 'Active', 'vacation_revenue_view', 'organization', 'routine', '',
    'Baseline seed — Phase 612 vacation_revenue_view.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_since_last_login_meta (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'sincelas_baseline', initcap(replace('since_last_login_meta', '_', ' ')), 'active', 'circle', 'Active', 'since_last_login_meta', 'organization', 'routine', '',
    'Baseline seed — Phase 612 since_last_login_meta.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_revenue_analytics (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'revenuea_baseline', initcap(replace('revenue_analytics', '_', ' ')), 'active', 'circle', 'Active', 'revenue_analytics', 'organization', 'routine', '',
    'Baseline seed — Phase 612 revenue_analytics.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_payment_analytics (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'paymenta_baseline', initcap(replace('payment_analytics', '_', ' ')), 'active', 'circle', 'Active', 'payment_analytics', 'organization', 'routine', '',
    'Baseline seed — Phase 612 payment_analytics.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_discount_analytics (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'discount_baseline', initcap(replace('discount_analytics', '_', ' ')), 'active', 'circle', 'Active', 'discount_analytics', 'organization', 'routine', '',
    'Baseline seed — Phase 612 discount_analytics.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_tip_privacy_analytics (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'tippriva_baseline', initcap(replace('tip_privacy_analytics', '_', ' ')), 'active', 'circle', 'Active', 'tip_privacy_analytics', 'organization', 'routine', '',
    'Baseline seed — Phase 612 tip_privacy_analytics.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_product_analytics (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'producta_baseline', initcap(replace('product_analytics', '_', ' ')), 'active', 'circle', 'Active', 'product_analytics', 'organization', 'routine', '',
    'Baseline seed — Phase 612 product_analytics.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_profitability_signals (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'profitab_baseline', initcap(replace('profitability_signals', '_', ' ')), 'active', 'circle', 'Active', 'profitability_signals', 'organization', 'routine', '',
    'Baseline seed — Phase 612 profitability_signals.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_revenue_ops_integration (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'revenueo_baseline', initcap(replace('revenue_ops_integration', '_', ' ')), 'active', 'circle', 'Active', 'revenue_ops_integration', 'organization', 'routine', '',
    'Baseline seed — Phase 612 revenue_ops_integration.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_client_crm_integration (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'clientcr_baseline', initcap(replace('client_crm_integration', '_', ' ')), 'active', 'circle', 'Active', 'client_crm_integration', 'organization', 'routine', '',
    'Baseline seed — Phase 612 client_crm_integration.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_booking_integration (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'bookingi_baseline', initcap(replace('booking_integration', '_', ' ')), 'active', 'circle', 'Active', 'booking_integration', 'organization', 'routine', '',
    'Baseline seed — Phase 612 booking_integration.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_time_tracking_integration (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'timetrac_baseline', initcap(replace('time_tracking_integration', '_', ' ')), 'active', 'circle', 'Active', 'time_tracking_integration', 'organization', 'routine', '',
    'Baseline seed — Phase 612 time_tracking_integration.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_import_export_jobs (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'importex_baseline', initcap(replace('import_export_jobs', '_', ' ')), 'active', 'circle', 'Active', 'import_export_jobs', 'organization', 'routine', '',
    'Baseline seed — Phase 612 import_export_jobs.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_checkout_api_meta (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'checkout_baseline', initcap(replace('checkout_api_meta', '_', ' ')), 'active', 'circle', 'Active', 'checkout_api_meta', 'organization', 'routine', '',
    'Baseline seed — Phase 612 checkout_api_meta.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_event_bus_signals (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'eventbus_baseline', initcap(replace('event_bus_signals', '_', ' ')), 'active', 'circle', 'Active', 'event_bus_signals', 'organization', 'routine', '',
    'Baseline seed — Phase 612 event_bus_signals.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_notification_prefs (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'notifica_baseline', initcap(replace('notification_prefs', '_', ' ')), 'active', 'circle', 'Active', 'notification_prefs', 'organization', 'routine', '',
    'Baseline seed — Phase 612 notification_prefs.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_security_rules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'security_baseline', initcap(replace('security_rules', '_', ' ')), 'active', 'circle', 'Active', 'security_rules', 'organization', 'routine', '',
    'Baseline seed — Phase 612 security_rules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_retention_policies (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'retentio_baseline', initcap(replace('retention_policies', '_', ' ')), 'active', 'circle', 'Active', 'retention_policies', 'organization', 'routine', '',
    'Baseline seed — Phase 612 retention_policies.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_governance_rules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'governan_baseline', initcap(replace('governance_rules', '_', ' ')), 'active', 'circle', 'Active', 'governance_rules', 'organization', 'routine', '',
    'Baseline seed — Phase 612 governance_rules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_open_checkouts (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'openchec_baseline', initcap(replace('open_checkouts', '_', ' ')), 'active', 'circle', 'Active', 'open_checkouts', 'organization', 'routine', '',
    'Baseline seed — Phase 612 open_checkouts.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_completed_sales (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'complete_baseline', initcap(replace('completed_sales', '_', ' ')), 'active', 'circle', 'Active', 'completed_sales', 'organization', 'routine', '',
    'Baseline seed — Phase 612 completed_sales.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_appointment_checkouts (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'appointm_baseline', initcap(replace('appointment_checkouts', '_', ' ')), 'active', 'circle', 'Active', 'appointment_checkouts', 'organization', 'routine', '',
    'Baseline seed — Phase 612 appointment_checkouts.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_checkout_reports (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'checkout_baseline', initcap(replace('checkout_reports', '_', ' ')), 'active', 'circle', 'Active', 'checkout_reports', 'organization', 'routine', '',
    'Baseline seed — Phase 612 checkout_reports.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_business_pack_registry (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'business_baseline', initcap(replace('business_pack_registry', '_', ' ')), 'active', 'circle', 'Active', 'business_pack_registry', 'organization', 'routine', '',
    'Baseline seed — Phase 612 business_pack_registry.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_transaction_status_catalog (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, summary, metadata
  ) values
    (p_org_id, 'status_open', 'Open checkout', 'open', 'shopping-cart', 'Open', 'transaction_status_catalog', 'Checkout in progress — payment not verified.', '{"verified":false}'::jsonb),
    (p_org_id, 'status_pending', 'Payment pending', 'pending', 'clock', 'Pending verification', 'transaction_status_catalog', 'Awaiting payment provider verification.', '{"verified":false}'::jsonb),
    (p_org_id, 'status_paid', 'Payment verified', 'paid', 'check-circle', 'Paid', 'transaction_status_catalog', 'Payment verified — sale complete.', '{"verified":true}'::jsonb),
    (p_org_id, 'status_refunded', 'Refunded', 'refunded', 'rotate-ccw', 'Refunded', 'transaction_status_catalog', 'Refund processed with approval.', '{"verified":true}'::jsonb)
  on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_business_pack_registry (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'service_pos_pack', 'Service POS Business Pack', 'registered', 'package', 'Registered', 'business_pack_registry', 'service_pos_business_pack',
    'Service-business checkout, POS, tips, and daily revenue operations — APP Business Pack.',
    '{"pack_key":"service_pos","route":"/app/checkout","phase612":true}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_appointment_handoff_links (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'book610_handoff', 'Appointment checkout handoff', 'linked', 'calendar', 'Booking linked', 'appointment_handoff_links', 'phase610_booking',
    'Phase 610 appointment handoff — reuses booking engine, does not duplicate.',
    '{"phase610_ref":"booking","duplicate_engine":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_client_crm_integration (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'crm611_link', 'Client CRM integration', 'linked', 'users', 'CRM linked', 'client_crm_integration', 'phase611_client_crm',
    'Phase 611 membership, packages, loyalty, gift cards — integrate, do not duplicate CRM.',
    '{"phase611_ref":"client_crm","duplicate_engine":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_booking_integration (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'book610_link', 'Booking integration', 'linked', 'calendar-check', 'Booking linked', 'booking_integration', 'phase610_booking',
    'Phase 610 deposits, cancellation/no-show fees — integrate only.',
    '{"phase610_ref":"booking","duplicate_engine":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_revenue_ops_integration (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'rev588_link', 'Revenue ops integration', 'linked', 'trending-up', 'Revenue ops linked', 'revenue_ops_integration', 'phase588_revenue_ops',
    'Phase 588 revenue operations — metadata signals only.',
    '{"phase588_ref":"get_organization_revenue_operations_center","duplicate_engine":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_time_tracking_integration (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'time609_link', 'Time tracking integration', 'linked', 'timer', 'Time linked', 'time_tracking_integration', 'phase609_time',
    'Phase 609 time & attendance connection for employee attribution.',
    '{"phase609_ref":"time_attendance","duplicate_engine":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_vacation_payment_continuity (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'vac606_continuity', 'Vacation payment continuity', 'active', 'palmtree', 'Continuity active', 'vacation_payment_continuity', 'phase606_vacation_mode',
    'Phase 606/610 vacation payment continuity — revenue view during absence coverage.',
    '{"phase606_ref":"vacation_mode","duplicate_engine":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_tips_settings (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, summary, metadata
  ) values (
    p_org_id, 'tips_optional', 'Optional tips — no preselect', 'active', 'heart', 'Optional tips', 'tips_settings',
    'Tips are optional. No preselected amounts. No pressure language.',
    '{"preselect_forbidden":true,"pressure_forbidden":true}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_open_checkouts (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, priority, summary, metadata
  ) values (
    p_org_id, 'checkout_front_1', 'Front desk — Walk-in service', 'open', 'shopping-cart', 'Open checkout', 'open_checkouts', 'important',
    'Service checkout awaiting payment verification.',
    '{"origin":"front_desk","route":"/app/checkout/front-desk"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_completed_sales (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, summary, metadata
  ) values (
    p_org_id, 'sale_today_1', 'Verified sale — Haircut + product', 'paid', 'check-circle', 'Payment verified', 'completed_sales',
    'Payment verified via terminal — receipt delivered.',
    '{"amount_nok":890,"verified":true}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_front_desk_queue (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, priority, summary, metadata
  ) values (
    p_org_id, 'queue_1', 'Queue — Appointment handoff', 'waiting', 'users', 'Waiting', 'front_desk_queue', 'routine',
    'Customer arrived from Phase 610 appointment — ready for checkout.',
    '{"handoff":"phase610","route":"/app/checkout/front-desk"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_daily_close_records (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, summary, metadata
  ) values (
    p_org_id, 'close_today', 'Daily close — today', 'pending', 'sunset', 'Pending close', 'daily_close_records',
    'Daily close validation pending — review cash difference before closing.',
    '{"route":"/app/checkout/daily-close"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  perform public._pos612_log(p_org_id, 'service_checkout_seeded', 'Service checkout center baseline seeded — Phase 612.');
end; $$;

create or replace function public._pos612_section_rows(p_org_id uuid, p_domain text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_sql text; v_result jsonb;
begin
  v_sql := format(
    'select coalesce(jsonb_agg(jsonb_build_object(
      ''record_key'', record_key, ''record_title'', record_title, ''record_status'', record_status,
      ''status_icon'', status_icon, ''status_label'', status_label, ''domain_key'', domain_key,
      ''scope_type'', scope_type, ''priority'', priority, ''integration_ref'', integration_ref,
      ''summary'', summary, ''metadata'', metadata, ''starts_at'', starts_at, ''ends_at'', ends_at
    ) order by record_title), ''[]''::jsonb) from public.organization_pos612_%s where organization_id = $1',
    p_domain
  );
  execute v_sql into v_result using p_org_id;
  return coalesce(v_result, '[]'::jsonb);
end; $$;

create or replace function public.get_organization_checkout_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_org jsonb;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_overview jsonb;
  v_open jsonb;
  v_completed jsonb;
  v_queue jsonb;
  v_audit jsonb;
  v_all_sections jsonb := '{}'::jsonb;
  v_domain text;
begin
  v_org_id := public._pos612_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._pos612_ensure_settings(v_org_id);
  perform public._pos612_seed(v_org_id);

  select jsonb_build_object('id', o.id, 'name', o.name) into v_org from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'open_checkouts_count', (select count(*) from public.organization_pos612_open_checkouts where organization_id = v_org_id and record_status = 'open'),
    'completed_sales_today', (select count(*) from public.organization_pos612_completed_sales where organization_id = v_org_id and record_status = 'paid'),
    'pending_payments', (select count(*) from public.organization_pos612_checkout_carts where organization_id = v_org_id and record_status = 'pending'),
    'pending_refunds', (select count(*) from public.organization_pos612_refund_requests where organization_id = v_org_id and record_status = 'pending'),
    'daily_close_pending', (select count(*) from public.organization_pos612_daily_close_records where organization_id = v_org_id and record_status = 'pending'),
    'front_desk_queue', (select count(*) from public.organization_pos612_front_desk_queue where organization_id = v_org_id and record_status = 'waiting'),
    'cash_difference_open', (select count(*) from public.organization_pos612_cash_difference_reviews where organization_id = v_org_id and record_status = 'open'),
    'tips_enabled', (select tips_enabled from public.organization_pos612_settings where organization_id = v_org_id),
    'verification_required', (select payment_verification_required from public.organization_pos612_settings where organization_id = v_org_id)
  ) into v_overview;

  v_open := public._pos612_section_rows(v_org_id, 'open_checkouts');
  v_completed := public._pos612_section_rows(v_org_id, 'completed_sales');
  v_queue := public._pos612_section_rows(v_org_id, 'front_desk_queue');

  foreach v_domain in array array['transaction_scopes', 'transaction_types', 'transaction_status_catalog', 'checkout_origins', 'appointment_handoff_links', 'checkout_carts', 'cart_services', 'cart_products', 'cart_addons', 'cart_discounts', 'cart_packages', 'cart_memberships', 'cart_loyalty', 'cart_gift_cards', 'cart_tips', 'cart_taxes', 'price_sources', 'price_locks', 'discount_rules', 'discount_combination_rules', 'discount_approvals', 'promo_codes', 'membership_redemption_links', 'package_redemption_links', 'loyalty_redemption_links', 'gift_card_redemption_links', 'customer_credit_redemption', 'deposit_application', 'deposit_difference', 'tips_settings', 'tips_attribution', 'tips_privacy_rules', 'payment_methods', 'split_payments', 'multi_person_payments', 'terminal_payments', 'vipps_payments', 'stripe_payments', 'klarna_payments', 'invoice_payments', 'payment_links', 'vacation_payment_continuity', 'payment_failures', 'payment_idempotency', 'auth_capture_records', 'receipts', 'receipt_delivery', 'receipt_printer_prep', 'cash_drawers', 'cash_movements', 'cash_difference_reviews', 'daily_close_records', 'daily_close_validation', 'daily_close_reopening', 'payment_reconciliation', 'settlement_reconciliation', 'fiken_integration_prep', 'fiken_export_statuses', 'revenue_recognition_signals', 'tax_vat_rules', 'multi_currency_checkout', 'refund_requests', 'partial_refunds', 'refund_approvals', 'cash_refunds', 'return_records', 'service_recovery_links', 'credit_notes', 'cancellation_fees', 'no_show_fees', 'chargebacks', 'disputes', 'fraud_reviews', 'inventory_signals', 'low_stock_alerts', 'service_consumables', 'employee_attribution', 'team_attribution', 'commission_event_prep', 'front_desk_queue', 'self_checkout_sessions', 'qr_checkout_sessions', 'mobile_pos_sessions', 'offline_handling', 'checkout_advisor_meta', 'customer_experience_rules', 'checkout_approvals', 'segregation_of_duties', 'locale_checkout_copy', 'accessibility_rules', 'employee_dashboard_meta', 'manager_dashboard_meta', 'executive_dashboard_meta', 'vacation_revenue_view', 'since_last_login_meta', 'revenue_analytics', 'payment_analytics', 'discount_analytics', 'tip_privacy_analytics', 'product_analytics', 'profitability_signals', 'revenue_ops_integration', 'client_crm_integration', 'booking_integration', 'time_tracking_integration', 'import_export_jobs', 'checkout_api_meta', 'event_bus_signals', 'notification_prefs', 'security_rules', 'retention_policies', 'governance_rules', 'open_checkouts', 'completed_sales', 'appointment_checkouts', 'checkout_reports', 'business_pack_registry'] loop
    v_all_sections := v_all_sections || jsonb_build_object(v_domain, public._pos612_section_rows(v_org_id, v_domain));
  end loop;

  select coalesce((
    select jsonb_agg(jsonb_build_object('event_type', al.event_type, 'audit_category', al.audit_category,
      'summary', al.summary, 'created_at', al.created_at) order by al.created_at desc)
    from (select * from public.organization_pos612_audit_logs where organization_id = v_org_id order by created_at desc limit 15) al
  ), '[]'::jsonb) into v_audit;

  return jsonb_build_object(
    'found', true,
    'section', v_section,
    'principle', 'Service checkout completes verified sales — never mark payment complete without verification.',
    'privacy_note', 'Tip amounts are private to attribution rules — analytics remain aggregated.',
    'companion_identity', 'Companion Checkout Assistant',
    'organization', v_org,
    'overview', v_overview,
    'open_checkouts', v_open,
    'completed_sales', v_completed,
    'front_desk_queue', v_queue,
    'transaction_status_catalog', public._pos612_section_rows(v_org_id, 'transaction_status_catalog'),
    'companion_recommendations', jsonb_build_array(
      jsonb_build_object('title', 'Verify pending front desk checkout', 'reason', 'One open checkout awaits payment verification.', 'effort', 'low', 'route', '/app/checkout/front-desk'),
      jsonb_build_object('title', 'Complete daily close validation', 'reason', 'Daily close pending — review cash difference non-punitionally.', 'effort', 'routine', 'route', '/app/checkout/daily-close'),
      jsonb_build_object('title', 'Review appointment handoff queue', 'reason', 'Phase 610 appointment ready for checkout — no duplicate booking.', 'effort', 'low', 'route', '/app/checkout/appointments')
    ),
    'integrations', jsonb_build_object(
      'phase610_booking', public._pos612_section_rows(v_org_id, 'booking_integration'),
      'phase611_client_crm', public._pos612_section_rows(v_org_id, 'client_crm_integration'),
      'phase588_revenue_ops', public._pos612_section_rows(v_org_id, 'revenue_ops_integration'),
      'phase609_time', public._pos612_section_rows(v_org_id, 'time_tracking_integration'),
      'phase606_vacation', public._pos612_section_rows(v_org_id, 'vacation_payment_continuity')
    ),
    'sections', v_all_sections,
    'rows', case v_section
      when 'overview' then public._pos612_section_rows(v_org_id, 'open_checkouts')
      when 'open_checkouts' then public._pos612_section_rows(v_org_id, 'open_checkouts')
      when 'completed_sales' then public._pos612_section_rows(v_org_id, 'completed_sales')
      when 'appointments' then public._pos612_section_rows(v_org_id, 'appointment_checkouts')
      when 'products' then public._pos612_section_rows(v_org_id, 'cart_products')
      when 'payments' then public._pos612_section_rows(v_org_id, 'payment_methods')
      when 'tips' then public._pos612_section_rows(v_org_id, 'cart_tips')
      when 'discounts' then public._pos612_section_rows(v_org_id, 'discount_rules')
      when 'gift_cards' then public._pos612_section_rows(v_org_id, 'gift_card_redemption_links')
      when 'packages' then public._pos612_section_rows(v_org_id, 'package_redemption_links')
      when 'memberships' then public._pos612_section_rows(v_org_id, 'membership_redemption_links')
      when 'refunds' then public._pos612_section_rows(v_org_id, 'refund_requests')
      when 'invoices' then public._pos612_section_rows(v_org_id, 'invoice_payments')
      when 'cash_management' then public._pos612_section_rows(v_org_id, 'cash_drawers')
      when 'reconciliation' then public._pos612_section_rows(v_org_id, 'payment_reconciliation')
      when 'daily_close' then public._pos612_section_rows(v_org_id, 'daily_close_records')
      when 'reports' then public._pos612_section_rows(v_org_id, 'checkout_reports')
      when 'front_desk' then public._pos612_section_rows(v_org_id, 'front_desk_queue')
      else v_open
    end,
    'audit_recent', v_audit,
    'routes', jsonb_build_object(
      'center', '/app/checkout',
      'daily_close', '/app/checkout/daily-close',
      'refunds', '/app/checkout/refunds',
      'front_desk', '/app/checkout/front-desk'
    ),
    'since_last_login', public._pos612_section_rows(v_org_id, 'since_last_login_meta'),
    'executive_view', public._pos612_section_rows(v_org_id, 'executive_dashboard_meta'),
    'mobile_access', jsonb_build_object('route', '/app/checkout', 'summary_available', true)
  );
end; $$;

create or replace function public.get_aipify_companion_checkout_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._pos612_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;
  perform public._pos612_ensure_settings(v_org_id);
  perform public._pos612_seed(v_org_id);

  return jsonb_build_object(
    'found', true,
    'companion_identity', 'Companion Checkout Assistant',
    'principle', 'Aipify prepares checkout and verifies payments — staff approve completion.',
    'advisor_prompts', jsonb_build_array(
      'What checkouts are open?', 'Is daily close ready?', 'Any pending refunds?',
      'Show front desk queue.', 'Prepare receipt for verified sale.'
    ),
    'open_checkouts', (select count(*) from public.organization_pos612_open_checkouts where organization_id = v_org_id and record_status = 'open'),
    'pending_payments', (select count(*) from public.organization_pos612_checkout_carts where organization_id = v_org_id and record_status = 'pending'),
    'daily_close_pending', (select count(*) from public.organization_pos612_daily_close_records where organization_id = v_org_id and record_status = 'pending'),
    'front_desk_waiting', (select count(*) from public.organization_pos612_front_desk_queue where organization_id = v_org_id and record_status = 'waiting'),
    'integrations', jsonb_build_object(
      'booking', 'phase610',
      'client_crm', 'phase611',
      'revenue_ops', 'phase588',
      'time_tracking', 'phase609',
      'vacation_mode', 'phase606'
    ),
    'route', '/app/checkout',
    'privacy_note', 'Tips remain optional — Companion never preselects tip amounts or applies pressure.'
  );
end; $$;

create or replace function public.get_organization_checkout_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._pos612_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return (public.get_organization_checkout_center('overview')->'overview')
    || jsonb_build_object('found', true, 'route', '/app/checkout', 'companion_identity', 'Companion Checkout Assistant');
end; $$;

grant execute on function public.get_organization_checkout_center(text) to authenticated;
grant execute on function public.get_aipify_companion_checkout_advisor_bundle() to authenticated;
grant execute on function public.get_organization_checkout_mobile_summary() to authenticated;
