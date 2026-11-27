-- NOT APPLIED
-- Candidate only. Do not execute against local, staging, or production Core.
-- Feature owner: PLATFORM ADMIN
-- Purpose: align Customer Success overview website_kompis_status with the
-- dedicated activation RPC semantics used on the customer card, instead of
-- deriving solely from license provisioning_status.
-- Rollback: restore prior get_platform_portal_customer_success_overview body.
-- Requires separate owner YES for the target environment.
-- Live Core was not queried or mutated by this candidate file.

-- IMPLEMENTATION NOTES (for apply review):
-- 1. Keep Success overview read-only and tenant-isolated via is_platform_admin().
-- 2. Prefer calling public._platform_portal_* helpers already used by
--    get_platform_portal_customer_website_kompis_status rather than inventing
--    a third status model.
-- 3. Preserve columns returned to PlatformCustomerSuccessOverviewPanel.
-- 4. Do not grant or activate Website Kompis for any customer as a side effect.
-- 5. Until applied, APP/Platform UI labels Success WK as a setup signal.

select 'NOT_APPLIED_platform_customer_success_wk_activation_truth_v1' as candidate;
