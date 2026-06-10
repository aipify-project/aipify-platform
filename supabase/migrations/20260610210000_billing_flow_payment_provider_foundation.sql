-- Billing flow foundation: payment provider structure, KID placeholders, payment events

alter table public.subscriptions
  add column if not exists next_billing_date date,
  add column if not exists cancelled_at timestamptz;

alter table public.invoices
  add column if not exists subscription_id uuid references public.subscriptions (id) on delete set null,
  add column if not exists kid_number text,
  add column if not exists provider_payment_id text;

alter table public.invoices drop constraint if exists invoices_status_check;

alter table public.invoices
  add constraint invoices_status_check
  check (status in ('draft', 'sent', 'paid', 'overdue', 'cancelled', 'failed'));

create index if not exists invoices_subscription_id_idx on public.invoices (subscription_id);

create table if not exists public.payment_profiles (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null unique references public.customers (id) on delete cascade,
  provider text not null default 'invoice' check (
    provider in ('klarna', 'stripe', 'vipps', 'manual', 'invoice')
  ),
  provider_customer_id text,
  provider_mandate_id text,
  payment_status text not null default 'pending_setup' check (
    payment_status in ('not_connected', 'pending_setup', 'active', 'failed', 'cancelled')
  ),
  kid_number text,
  billing_email text not null,
  billing_address text not null,
  postal_code text not null,
  city text not null,
  country text not null,
  vat_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payment_profiles_customer_id_idx
  on public.payment_profiles (customer_id);

create index if not exists payment_profiles_provider_idx
  on public.payment_profiles (provider);

insert into public.payment_profiles (
  customer_id,
  provider,
  provider_customer_id,
  provider_mandate_id,
  payment_status,
  kid_number,
  billing_email,
  billing_address,
  postal_code,
  city,
  country,
  vat_number
)
select
  bp.customer_id,
  case bp.payment_method
    when 'stripe' then 'stripe'
    when 'card' then 'stripe'
    when 'manual' then 'manual'
    else 'invoice'
  end,
  null,
  null,
  'pending_setup',
  null,
  bp.billing_email,
  bp.billing_address,
  bp.postal_code,
  bp.city,
  bp.country,
  bp.vat_number
from public.billing_profiles bp
on conflict (customer_id) do nothing;

drop table if exists public.billing_profiles;

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  provider text not null check (
    provider in ('klarna', 'stripe', 'vipps', 'manual', 'invoice')
  ),
  event_type text not null,
  provider_event_id text,
  status text not null default 'received',
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists payment_events_customer_id_idx
  on public.payment_events (customer_id);

create index if not exists payment_events_provider_idx
  on public.payment_events (provider);

alter table public.payment_profiles enable row level security;
alter table public.payment_events enable row level security;

revoke all on public.payment_profiles from authenticated, anon;
revoke all on public.payment_events from authenticated, anon;
