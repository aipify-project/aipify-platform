-- NOT APPLIED.
-- Executing this file raises and changes nothing.
-- Do not apply it to Production or Staging.
--
-- UP, only after a later approval names this file:
--   Add public.provision_website_kompis_site(p_domain_id uuid, p_confirmation boolean).
--   Preconditions: authenticated owner or admin; p_confirmation is true;
--   the organization_domains row belongs to that tenant;
--   verification_status is verified and domain_status is active;
--   an entitled license already exists. This function does not purchase a license
--   and does not mark a pending domain verified.
--   No customer_domains row may already bind the hostname to an installation.
--   Effect: insert one installation and one customer_domains row for that hostname.
--   A second call for the same hostname returns the first installation id.
--   The response must not include an installation token.
--   Do not assign FAQ rows and do not change existing installation ids.
-- DOWN: drop function public.provision_website_kompis_site(uuid, boolean).
--   Do not delete installations, domains, or FAQ rows.
-- Idempotency: repeating the same verified hostname returns the original installation id.

do $$
begin
  raise exception 'NOT_APPLIED website_kompis_site_provision_v1';
end
$$;
