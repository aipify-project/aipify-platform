-- P1.12C3ZZA — Appointment Center RPC volatility correction.
-- PostgREST executes STABLE functions in read-only transactions; this RPC may
-- insert via _apt610_seed() and _apt610_log(). Mark VOLATILE only.

alter function public.get_organization_appointment_center(text)
  volatile;
