-- Employee Knowledge Center RPC volatility correction.
-- PostgREST executes STABLE (and IMMUTABLE) RPCs in READ ONLY transactions,
-- including POST /rpc. get_customer_employee_knowledge_center() is STABLE but
-- calls ensure_eke_settings(), which always runs:
--   INSERT INTO eke_settings ... ON CONFLICT DO NOTHING
-- (and may seed knowledge_permissions / employee_onboarding_paths).
-- That write fails with SQLSTATE 25006:
--   cannot execute INSERT in a read-only transaction
-- APP path: GET /api/employee-knowledge → supabase.rpc(center) → HTTP 400 →
-- EmployeeKnowledgeAdminPanel loadError (all four Kompis Bedrift knowledge cards
-- deep-link to /app/settings/employee-knowledge).
--
-- Minimal fix: mark the center RPC VOLATILE so PostgREST uses READ WRITE.
-- No schema, RLS, grant, or behavioral contract changes.
-- Precedent: 20261932900000_domain_license_center_rpc_volatile.sql
--
-- DO NOT APPLY without explicit owner Production SQL authorization for this file.
-- Does not touch Website Kompis Public Chain or 20261938200000.

alter function public.get_customer_employee_knowledge_center()
  volatile;
