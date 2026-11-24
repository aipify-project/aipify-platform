-- =============================================================================
-- Certified Aipify Sales Partner (CSP) — Core V1
-- STATUS: REVIEW CANDIDATE ONLY — do NOT apply to Production without owner approval.
--
-- Reuse notes (documentation only — no changes made to existing engines):
--  * Growth Partner percentage-commission engines remain untouched. CSP pays a
--    ONE-TIME FIXED amount per product after TWO paid subscription periods;
--    there is no renewal commission and no percentage model here.
--  * Tenant/org identity reuses public.organizations; platform checks reuse
--    public.is_platform_admin(). No parallel customer or entitlement model.
--  * Website Kompis files and the frozen public chain are not touched.
--
-- Security posture:
--  * All tables: RLS enabled, all privileges revoked from public/anon/authenticated.
--  * Access only through SECURITY DEFINER RPCs (search_path = public).
--  * RPCs in this candidate are FAIL-CLOSED stubs returning
--    { found:false, error:'csp_backend_not_applied' } until real logic is approved.
--  * Bank data is stored only as an encrypted payload (no plaintext fields).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Partners
-- ---------------------------------------------------------------------------
create table if not exists public.csp_partner_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users (id) on delete restrict,
  display_name text not null check (length(btrim(display_name)) > 0),
  -- ISO 3166-1 alpha-2; never defaulted globally.
  country text not null check (country ~ '^[A-Z]{2}$'),
  status text not null default 'applied'
    check (status in ('applied','in_academy','certified','active','suspended','terminated')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.csp_partner_bank_profiles (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.csp_partner_profiles (id) on delete restrict,
  -- Encrypted by Core before storage; this column never holds plaintext bank data.
  encrypted_payload jsonb not null,
  key_version integer not null default 1 check (key_version > 0),
  fingerprint text,
  status text not null default 'pending_verification'
    check (status in ('pending_verification','verified','rotation_required','revoked')),
  superseded_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index if not exists csp_partner_bank_profiles_one_current_idx
  on public.csp_partner_bank_profiles (partner_id) where superseded_at is null;

-- ---------------------------------------------------------------------------
-- Products & commission rates
-- ---------------------------------------------------------------------------
create table if not exists public.csp_sales_products (
  id uuid primary key default gen_random_uuid(),
  -- Maps to the canonical product key; not an independent catalog.
  product_key text not null unique check (length(btrim(product_key)) > 0),
  fixed_commission_amount numeric(12,2) not null check (fixed_commission_amount >= 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.csp_commission_rate_versions (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.csp_sales_products (id) on delete restrict,
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  effective_from timestamptz not null,
  created_at timestamptz not null default now(),
  unique (product_id, effective_from)
);

-- ---------------------------------------------------------------------------
-- Academy & certification (pass score 80)
-- ---------------------------------------------------------------------------
create table if not exists public.csp_academy_courses (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.csp_sales_products (id) on delete restrict,
  course_key text not null unique,
  published boolean not null default false,
  pass_score integer not null default 80 check (pass_score between 1 and 100),
  created_at timestamptz not null default now()
);

create table if not exists public.csp_academy_questions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.csp_academy_courses (id) on delete restrict,
  position integer not null check (position > 0),
  -- Locale blocks for en/no/sv/da/pl/uk; answer key is never exposed to clients.
  question_blocks jsonb not null,
  answer_key jsonb not null,
  created_at timestamptz not null default now(),
  unique (course_id, position)
);

create table if not exists public.csp_academy_attempts (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.csp_partner_profiles (id) on delete restrict,
  course_id uuid not null references public.csp_academy_courses (id) on delete restrict,
  score integer not null check (score between 0 and 100),
  passed boolean not null,
  submitted_at timestamptz not null default now()
);

create table if not exists public.csp_product_certifications (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.csp_partner_profiles (id) on delete restrict,
  product_id uuid not null references public.csp_sales_products (id) on delete restrict,
  status text not null default 'not_started'
    check (status in ('not_started','in_progress','passed','expired','revoked')),
  score integer check (score between 0 and 100),
  passed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (partner_id, product_id)
);

-- ---------------------------------------------------------------------------
-- Attribution (90-day window enforced in RPC logic, recorded here)
-- ---------------------------------------------------------------------------
create table if not exists public.csp_attribution_links (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.csp_partner_profiles (id) on delete restrict,
  code text not null unique check (length(btrim(code)) > 0),
  channel_origin text not null
    check (channel_origin in ('referral_link','partner_code','partner_registered_customer','event','manual_platform_assignment')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.csp_attribution_events (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references public.csp_attribution_links (id) on delete restrict,
  -- Counts/outcomes only: no visitor PII, no raw IP/user-agent.
  event_type text not null check (event_type in ('click','registration_started','registration_completed')),
  occurred_at timestamptz not null default now()
);

create table if not exists public.csp_attributed_registrations (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references public.csp_attribution_links (id) on delete restrict,
  partner_id uuid not null references public.csp_partner_profiles (id) on delete restrict,
  customer_org_id uuid not null references public.organizations (id) on delete restrict,
  attributed_at timestamptz not null,
  registered_at timestamptz not null,
  window_expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  check (registered_at >= attributed_at),
  -- First attribution wins: one partner per customer organization.
  unique (customer_org_id)
);

-- ---------------------------------------------------------------------------
-- Qualified sales, ledger, settlements
-- ---------------------------------------------------------------------------
create table if not exists public.csp_qualified_sales (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.csp_partner_profiles (id) on delete restrict,
  customer_org_id uuid not null references public.organizations (id) on delete restrict,
  product_id uuid not null references public.csp_sales_products (id) on delete restrict,
  status text not null default 'registered_awaiting_second_payment'
    check (status in (
      'registered_awaiting_second_payment','pending_possible','earned',
      'approved_for_payout','queued_for_payout','paid','reversed','rejected')),
  attributed_at timestamptz not null,
  first_confirmed_at timestamptz,
  paid_periods_count integer not null default 0 check (paid_periods_count >= 0),
  -- Snapshot at first confirmed sale; immutable once set (trigger below).
  snapshot_amount numeric(12,2) check (snapshot_amount >= 0),
  snapshot_currency text check (snapshot_currency ~ '^[A-Z]{3}$'),
  snapshot_rate_version_id uuid references public.csp_commission_rate_versions (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Prevents double commission for the same partner / customer / product.
  constraint csp_qualified_sales_no_double_commission unique (partner_id, customer_org_id, product_id),
  check (
    (snapshot_amount is null and snapshot_currency is null and snapshot_rate_version_id is null)
    or (snapshot_amount is not null and snapshot_currency is not null and snapshot_rate_version_id is not null)
  )
);
-- Two different partners can never both earn on the same customer + product.
create unique index if not exists csp_qualified_sales_one_live_claim_idx
  on public.csp_qualified_sales (customer_org_id, product_id)
  where status not in ('rejected','reversed');

create table if not exists public.csp_monthly_settlements (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.csp_partner_profiles (id) on delete restrict,
  -- YYYY-MM computed in Europe/Oslo.
  period_month text not null check (period_month ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  status text not null default 'open'
    check (status in ('open','closed','approved','paid','voided')),
  total_amount numeric(12,2) not null default 0,
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (partner_id, period_month)
);

create table if not exists public.csp_settlement_lines (
  id uuid primary key default gen_random_uuid(),
  settlement_id uuid not null references public.csp_monthly_settlements (id) on delete restrict,
  qualified_sale_id uuid not null references public.csp_qualified_sales (id) on delete restrict,
  amount numeric(12,2) not null,
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  created_at timestamptz not null default now(),
  -- A sale can be settled once.
  unique (qualified_sale_id)
);

create table if not exists public.csp_commission_ledger (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.csp_partner_profiles (id) on delete restrict,
  qualified_sale_id uuid references public.csp_qualified_sales (id) on delete restrict,
  settlement_id uuid references public.csp_monthly_settlements (id) on delete restrict,
  entry_type text not null check (entry_type in ('earned','payout','reversal','adjustment')),
  -- Signed amount; reversals are negative.
  amount numeric(12,2) not null,
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  idempotency_key text not null unique,
  created_at timestamptz not null default now()
);
-- At most one 'earned' entry per qualified sale (no renewal commission).
create unique index if not exists csp_commission_ledger_one_earned_per_sale_idx
  on public.csp_commission_ledger (qualified_sale_id)
  where entry_type = 'earned';

create table if not exists public.csp_audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_auth_user_id uuid,
  actor_kind text not null check (actor_kind in ('partner','platform_admin','system')),
  action text not null,
  subject_table text,
  subject_id uuid,
  -- Metadata only; never secrets or bank details.
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Integrity triggers
-- ---------------------------------------------------------------------------
create or replace function public._csp_block_mutation()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  raise exception 'csp_append_only: % on % is not permitted', tg_op, tg_table_name
    using errcode = '42501';
end;
$$;

drop trigger if exists csp_commission_ledger_append_only on public.csp_commission_ledger;
create trigger csp_commission_ledger_append_only
  before update or delete on public.csp_commission_ledger
  for each row execute function public._csp_block_mutation();

drop trigger if exists csp_audit_events_append_only on public.csp_audit_events;
create trigger csp_audit_events_append_only
  before update or delete on public.csp_audit_events
  for each row execute function public._csp_block_mutation();

create or replace function public._csp_protect_sale_snapshot()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.snapshot_amount is not null and (
       new.snapshot_amount is distinct from old.snapshot_amount
    or new.snapshot_currency is distinct from old.snapshot_currency
    or new.snapshot_rate_version_id is distinct from old.snapshot_rate_version_id
    or new.first_confirmed_at is distinct from old.first_confirmed_at
  ) then
    raise exception 'csp_snapshot_immutable: commission snapshot cannot change after first confirmed sale'
      using errcode = '42501';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists csp_qualified_sales_protect_snapshot on public.csp_qualified_sales;
create trigger csp_qualified_sales_protect_snapshot
  before update on public.csp_qualified_sales
  for each row execute function public._csp_protect_sale_snapshot();

-- ---------------------------------------------------------------------------
-- RLS on, no direct access
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'csp_partner_profiles','csp_partner_bank_profiles','csp_sales_products',
    'csp_commission_rate_versions','csp_academy_courses','csp_academy_questions',
    'csp_academy_attempts','csp_product_certifications','csp_attribution_links',
    'csp_attribution_events','csp_attributed_registrations','csp_qualified_sales',
    'csp_commission_ledger','csp_monthly_settlements','csp_settlement_lines','csp_audit_events'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force row level security', t);
    execute format('revoke all on public.%I from public, anon, authenticated', t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- FAIL-CLOSED stub RPCs (SECURITY DEFINER, search_path = public)
-- Real implementations (partner auth + is_platform_admin() gating) require a
-- separate, explicitly approved migration.
-- ---------------------------------------------------------------------------
create or replace function public.csp_get_backend_status()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object('found', false, 'error', 'csp_backend_not_applied');
$$;

create or replace function public.csp_get_partner_overview()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object('found', false, 'error', 'csp_backend_not_applied');
$$;

create or replace function public.csp_get_platform_overview()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object('found', false, 'error', 'csp_backend_not_applied');
$$;

create or replace function public.csp_list_qualified_sales()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object('found', false, 'error', 'csp_backend_not_applied');
$$;

create or replace function public.csp_list_monthly_settlements()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object('found', false, 'error', 'csp_backend_not_applied');
$$;

do $$
declare
  f text;
begin
  foreach f in array array[
    'csp_get_backend_status','csp_get_partner_overview','csp_get_platform_overview',
    'csp_list_qualified_sales','csp_list_monthly_settlements'
  ] loop
    execute format('revoke all on function public.%I() from public, anon', f);
    execute format('grant execute on function public.%I() to authenticated', f);
  end loop;
end;
$$;

comment on table public.csp_partner_bank_profiles is
  'CSP bank profile. encrypted_payload is Core-encrypted; no plaintext bank data is stored.';
comment on table public.csp_qualified_sales is
  'CSP qualifying sales. One-time fixed commission snapshotted at first confirmed sale; no renewal commission.';
