-- NOT APPLIED.
-- Do not execute this file against Production, Staging, or any customer database.
-- The statement below raises before any catalog change. The predicate is a comment only.
--
-- Target function, already applied elsewhere and not edited here:
--   public.search_tenant_public_visitor_knowledge
-- Current public predicate:
--   f.install_id is null or f.install_id = ctx.resolved_install_id
--
-- Preconditions before any later approved apply:
--   1. Owner approval that names this file.
--   2. Read-only count of published website_kompis FAQ rows with install_id null,
--      grouped only by whether the tenant has 0, 1, or more than 1 verified active
--      customer_domains.installation_id. Do not print row text, domains, or tenant names.
--   3. Confirm APP already hides those null rows when a tenant has more than one site.
--   4. No bulk update that assigns existing null rows to an installation.
--   5. Tenant guard remains: the row tenant_id equals the resolved visitor tenant.
--
-- Proposed predicate, still not applied:
--   and (
--     f.install_id = ctx.resolved_install_id
--     or (
--       f.install_id is null
--       and (
--         select count(*)
--         from public.customer_domains cd
--         where cd.customer_id = ctx.tenant_id
--           and cd.installation_id is not null
--           and cd.verification_status = 'verified'
--           and cd.status = 'active'
--       ) <= 1
--     )
--   )
--
-- Rollback: restore the current null-or-equal predicate. Do not delete FAQ rows.
-- Idempotency: replacing the same predicate twice leaves the same function body.
-- This file does not grant that change.

do $$
begin
  raise exception 'NOT_APPLIED website_kompis_faq_install_isolation_v1';
end
$$;
