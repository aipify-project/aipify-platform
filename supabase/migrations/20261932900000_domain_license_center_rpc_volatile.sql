-- Domain License Center RPC volatility correction.
-- PostgREST executes STABLE functions in read-only transactions; this center RPC
-- performs safe provisioning writes through existing helper functions
-- (_dl505_ensure_primary_domain, _dl505_license_summary). Mark VOLATILE only to
-- prevent SQLSTATE 25006 (cannot execute INSERT in a read-only transaction).

alter function public.get_domain_license_center()
  volatile;
