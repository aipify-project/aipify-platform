-- NOT APPLIED. Do not copy this file into supabase/migrations.
-- Candidate version if a later owner approval applies it: 20261939400000
-- Candidate ledger name: website_kompis_license_limits_revoke_anon_v1
--
-- get_customer_license_limits(uuid) is security definer and does not check
-- the caller against p_customer_id. An explicit anon EXECUTE grant lets an
-- anonymous PostgREST call read another customer's license limits.
-- REVOKE ALL FROM public does not remove that explicit anon grant.
--
-- This statement revokes only anon. authenticated, postgres, and service_role
-- keep EXECUTE. Internal license, billing, install, and platform functions
-- pass a customer id that is not the session user's membership, so this
-- candidate does not add a tenant guard inside the function.

revoke execute on function public.get_customer_license_limits(uuid) from anon;
