-- Phase 6.5: Customer, billing & subscription foundation (Platform Admin)

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  customer_number text not null unique,
  company_id uuid unique references public.companies (id) on delete set null,
  customer_type text not null check (customer_type in ('company', 'private')),
  company_name text,
  organization_number text,
  full_name text,
  email text not null,
  phone text,
  country text not null default 'NO',
  language text not null default 'en',
  status text not null default 'trial' check (
    status in ('trial', 'active', 'paused', 'cancelled', 'overdue')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index customers_company_id_idx on public.customers (company_id);
create index customers_status_idx on public.customers (status);
create index customers_customer_number_idx on public.customers (customer_number);

create table public.billing_profiles (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null unique references public.customers (id) on delete cascade,
  billing_name text not null,
  billing_email text not null,
  billing_address text not null,
  postal_code text not null,
  city text not null,
  country text not null,
  vat_number text,
  payment_method text not null default 'invoice' check (
    payment_method in ('manual', 'card', 'invoice', 'stripe')
  ),
  currency text not null default 'EUR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null unique references public.customers (id) on delete cascade,
  plan_name text not null,
  plan_type text not null check (
    plan_type in ('starter', 'growth', 'business', 'enterprise')
  ),
  status text not null default 'trialing' check (
    status in ('trialing', 'active', 'cancelled', 'paused', 'past_due')
  ),
  trial_starts_at timestamptz,
  trial_ends_at timestamptz,
  billing_cycle text not null default 'monthly' check (
    billing_cycle in ('monthly', 'yearly')
  ),
  price_amount numeric(12, 2) not null default 0,
  currency text not null default 'EUR',
  max_users integer not null default 5,
  max_installations integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index subscriptions_customer_id_idx on public.subscriptions (customer_id);
create index subscriptions_status_idx on public.subscriptions (status);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  invoice_number text not null unique,
  status text not null default 'draft' check (
    status in ('draft', 'sent', 'paid', 'overdue', 'cancelled')
  ),
  amount numeric(12, 2) not null,
  currency text not null default 'EUR',
  due_date date not null,
  issued_at timestamptz not null default now(),
  paid_at timestamptz,
  pdf_url text,
  last_sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index invoices_customer_id_idx on public.invoices (customer_id);
create index invoices_status_idx on public.invoices (status);

create sequence if not exists public.customer_number_seq start 1;
create sequence if not exists public.invoice_number_seq start 1;

alter table public.customers enable row level security;
alter table public.billing_profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.invoices enable row level security;

revoke all on public.customers from authenticated, anon;
revoke all on public.billing_profiles from authenticated, anon;
revoke all on public.subscriptions from authenticated, anon;
revoke all on public.invoices from authenticated, anon;
