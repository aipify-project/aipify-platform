-- =============================================================================
-- NOT_APPLIED — EXECUTABLE DRAFT — DO NOT AUTO-DEPLOY — DO NOT EXECUTE WITHOUT
-- A SEPARATE NAMED OWNER APPLY YES THAT CITES THIS FILE PATH AND SHA-256.
-- =============================================================================
-- Contract: platform_internal_customer_create_helper_allowlist_v1
-- Job: AIPIFY_KOMPIS_BEDRIFT_D2S_INTERNAL_SANDBOX_CREATE_PATH_AUTHOR_ONLY_V1
--
-- LOCATION RULE:
--   This file lives under docs/platform/ and MUST NOT be copied into
--   supabase/migrations/ or applied by CI/automatic migration runners until
--   an owner-named apply job explicitly relocates/applies it.
--
-- WHY THIS EXISTS (post D2L / D2R):
--   Core create_platform_portal_customer is 6-arg with p_environment_type.
--   Internal create requires active super_admin AND
--   _platform_portal_internal_customer_create_authorized() = true.
--   That helper currently returns false unconditionally (D2L).
--   This draft replaces the helper with an empty allowlist table so a later
--   named owner job can insert ONE grant row without rewriting the function
--   body to a global true.
--
-- WHAT THIS FILE DOES (when later applied):
--   1) Creates platform_internal_customer_create_grants (empty)
--   2) Replaces _platform_portal_internal_customer_create_authorized() to
--      return true only when auth.uid() has a non-revoked, non-expired grant
--   3) Preserves fail-closed behaviour while the table has ZERO rows
--
-- EXPLICIT NON-GOALS OF APPLYING THIS FILE:
--   ZERO grant rows / seed data
--   ZERO customer / company / auth / invite / membership writes
--   ZERO Bedrift / license / subscription / domain / installation writes
--   ZERO Platform flag / allowlist flips in application code
--   ZERO weakening of D2L exposure triggers
--   ZERO mutation of UnoNight or ordinary production customers
-- =============================================================================

create table if not exists public.platform_internal_customer_create_grants (
  id uuid primary key default gen_random_uuid(),
  granted_to_auth_user_id uuid not null,
  reason text not null,
  expires_at timestamptz null,
  revoked_at timestamptz null,
  created_by_auth_user_id uuid null,
  created_at timestamptz not null default now(),
  constraint platform_internal_customer_create_grants_reason_len
    check (char_length(btrim(reason)) >= 8)
);

create unique index if not exists
  platform_internal_customer_create_grants_active_uid_uidx
  on public.platform_internal_customer_create_grants (granted_to_auth_user_id)
  where revoked_at is null;

comment on table public.platform_internal_customer_create_grants is
  'Empty-by-default allowlist for Core internal customer create. No seed rows.';

revoke all on table public.platform_internal_customer_create_grants
  from public, anon, authenticated;
-- No grants to authenticated/anon: only security definer helpers may read.

create or replace function public._platform_portal_internal_customer_create_authorized()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.platform_internal_customer_create_grants g
    where g.granted_to_auth_user_id = auth.uid()
      and g.revoked_at is null
      and (g.expires_at is null or g.expires_at > now())
  );
$$;

revoke all on function public._platform_portal_internal_customer_create_authorized()
  from public, anon;
grant execute on function public._platform_portal_internal_customer_create_authorized()
  to authenticated, service_role;

-- =============================================================================
-- APPLY EFFECTS WHEN TABLE IS EMPTY: helper still returns false for all actors,
-- including super_admin. A later named job may insert a single grant row.
-- =============================================================================
