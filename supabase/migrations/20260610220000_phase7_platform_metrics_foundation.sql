-- Phase 7: Platform metrics, usage, support, activity logs

alter table public.users
  add column if not exists last_login_at timestamptz,
  add column if not exists status text not null default 'active' check (
    status in ('active', 'invited', 'disabled')
  );

create table if not exists public.usage_statistics (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null unique references public.customers (id) on delete cascade,
  support_requests_handled integer not null default 0,
  automated_actions integer not null default 0,
  ai_recommendations integer not null default 0,
  avg_response_time_seconds numeric(10, 2) not null default 0,
  most_used_modules jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_cases (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  subject text not null,
  status text not null default 'open' check (
    status in ('open', 'closed', 'escalated')
  ),
  assigned_agent text,
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  last_contact_at timestamptz,
  resolution_time_hours numeric(10, 2),
  created_at timestamptz not null default now()
);

create index if not exists support_cases_customer_id_idx
  on public.support_cases (customer_id);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  title text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists activity_logs_customer_id_idx
  on public.activity_logs (customer_id);

alter table public.usage_statistics enable row level security;
alter table public.support_cases enable row level security;
alter table public.activity_logs enable row level security;

revoke all on public.usage_statistics from authenticated, anon;
revoke all on public.support_cases from authenticated, anon;
revoke all on public.activity_logs from authenticated, anon;
