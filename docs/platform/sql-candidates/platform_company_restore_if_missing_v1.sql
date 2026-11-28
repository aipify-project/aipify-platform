-- =============================================================================
-- PREPARED_ONLY — restore a platform company only when none exists.
-- DO NOT APPLY without a separate named owner YES citing this exact path
-- and the FULL SHA-256 of these bytes.
--
-- Purpose: Staging Core currently has zero rows in public.companies, so
-- platform_support_intake_web_create raises 'platform company missing'.
--
-- This statement inserts one row (name Aipify, slug aipify, is_platform true)
-- only when both of these are true:
--   - no row has is_platform = true
--   - no row already uses slug aipify or aipify-ai
--
-- It does not change name, slug, id, or is_platform on any existing company.
-- It does not set a hardcoded id. Production's platform company stays as it is.
-- If a non-platform row already owns slug aipify, this inserts nothing and
-- must be stopped for a separate decision. Do not flip that row here.
--
-- Apply target after YES: Staging auedugihkduoaikfusqe only.
-- Do not apply on Production qbcqoixhrvhnuwphefvw.
-- =============================================================================

insert into public.companies (name, slug, is_platform)
select 'Aipify', 'aipify', true
where not exists (
  select 1
  from public.companies
  where coalesce(is_platform, false) = true
)
and not exists (
  select 1
  from public.companies
  where slug in ('aipify', 'aipify-ai')
);

select 'PREPARED_ONLY_platform_company_restore_if_missing_v1' as draft_marker;
