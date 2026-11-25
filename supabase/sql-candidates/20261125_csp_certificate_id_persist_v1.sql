-- CANDIDATE ONLY — DO NOT APPLY without exact owner approval.
-- Purpose: persist indexed certificate_id for public verify + Admin registry.
-- App already uses reversible ids `{product_key}-{partner_uuid}` for O(1) lookup.
-- This candidate stores the same id for audit, revoke tooling, and legacy UUID PDFs.

-- alter table public.csp_product_certifications
--   add column if not exists certificate_id text;
--
-- create unique index if not exists csp_product_certifications_certificate_id_uidx
--   on public.csp_product_certifications (certificate_id)
--   where certificate_id is not null;
--
-- -- Backfill from reversible format (kompis_web and future product keys):
-- update public.csp_product_certifications c
-- set certificate_id = lower(p.product_key) || '-' || c.partner_id::text
-- from public.csp_sales_products p
-- where p.id = c.product_id
--   and c.certificate_id is null
--   and c.status in ('passed', 'revoked');
--
-- comment on column public.csp_product_certifications.certificate_id is
--   'Public certificate identifier; unique when set. Reversible form: {product_key}-{partner_id}.';

select 'csp_certificate_id_persist_v1_candidate_not_applied' as status;
