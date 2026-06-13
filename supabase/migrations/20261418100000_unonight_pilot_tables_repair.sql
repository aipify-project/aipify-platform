-- pilot tables
create table if not exists public.aipify_tenant_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  name text not null,
  slug text not null unique,
  tenant_type text not null default 'customer' check (
    tenant_type in ('internal', 'pilot_customer', 'customer', 'enterprise', 'sandbox')
  ),
  industry text,
  region text,
  default_language text not null default 'en',
  supported_languages text[] not null default '{en}',
  timezone text not null default 'Europe/Oslo',
  pilot_status text not null default 'setup' check (
    pilot_status in ('setup', 'discovery', 'pilot_active', 'active', 'paused', 'archived')
  ),
  pilot_stage int not null default 1 check (pilot_stage between 1 and 5),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aipify_tenant_profiles_slug_idx
  on public.aipify_tenant_profiles (slug);

alter table public.aipify_tenant_profiles enable row level security;
revoke all on public.aipify_tenant_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Extend tenant_modules with pilot mode
-- ---------------------------------------------------------------------------
alter table public.tenant_modules
  add column if not exists mode text not null default 'safe' check (
    mode in ('safe', 'read_only', 'approval_required', 'active', 'disabled', 'suggestions_only', 'draft_only')
  );

alter table public.tenant_modules
  add column if not exists settings jsonb not null default '{}'::jsonb;

alter table public.tenant_modules
  add column if not exists enabled_by_user_id uuid references public.users (id) on delete set null;

alter table public.tenant_modules
  add column if not exists enabled_at timestamptz;

-- ---------------------------------------------------------------------------
-- 3. aipify_tenant_integrations
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_tenant_integrations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  integration_key text not null,
  display_name text not null,
  status text not null default 'not_connected' check (
    status in ('not_connected', 'pending', 'connected', 'error', 'disabled')
  ),
  connection_mode text not null default 'api' check (
    connection_mode in ('api', 'webhook', 'database_readonly', 'manual', 'file_import')
  ),
  capabilities jsonb not null default '{}'::jsonb,
  credentials_ref text,
  last_sync_at timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, integration_key)
);

create index if not exists aipify_tenant_integrations_tenant_idx
  on public.aipify_tenant_integrations (tenant_id, status);

alter table public.aipify_tenant_integrations enable row level security;
revoke all on public.aipify_tenant_integrations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. aipify_tenant_discovery_runs
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_tenant_discovery_runs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  run_type text not null check (
    run_type in ('initial_install', 'manual_rescan', 'scheduled_scan')
  ),
  status text not null default 'queued' check (
    status in ('queued', 'running', 'completed', 'failed', 'cancelled')
  ),
  summary text,
  findings jsonb not null default '{}'::jsonb,
  recommendations jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_by_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists aipify_tenant_discovery_runs_tenant_idx
  on public.aipify_tenant_discovery_runs (tenant_id, created_at desc);

alter table public.aipify_tenant_discovery_runs enable row level security;
revoke all on public.aipify_tenant_discovery_runs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. aipify_tenant_pilot_checklist
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_tenant_pilot_checklist (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  checklist_key text not null,
  title text not null,
  description text,
  status text not null default 'pending' check (
    status in ('pending', 'in_progress', 'completed', 'blocked', 'skipped')
  ),
  priority int not null default 0,
  assigned_user_id uuid references public.users (id) on delete set null,
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, checklist_key)
);

create index if not exists aipify_tenant_pilot_checklist_tenant_idx
  on public.aipify_tenant_pilot_checklist (tenant_id, priority desc);

alter table public.aipify_tenant_pilot_checklist enable row level security;
revoke all on public.aipify_tenant_pilot_checklist from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. aipify_tenant_pilot_events
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_tenant_pilot_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  title text not null,
  summary text,
  severity text not null default 'info' check (
    severity in ('info', 'low', 'medium', 'high', 'critical')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_by text not null default 'system',
  created_at timestamptz not null default now()
);

create index if not exists aipify_tenant_pilot_events_tenant_idx
  on public.aipify_tenant_pilot_events (tenant_id, created_at desc);

alter table public.aipify_tenant_pilot_events enable row level security;
revoke all on public.aipify_tenant_pilot_events from authenticated, anon;
