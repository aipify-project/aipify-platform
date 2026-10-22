-- Already executed once as a direct Production statement. No schema_migrations row.
-- Do not copy this file into supabase/migrations and do not insert a ledger row for it.
-- The caller guard is a separate applied migration, 20261939400000. This file is not that migration.
-- The statement below is the historical revoke only. It does not grant anon.

revoke execute on function public.get_customer_license_limits(uuid) from anon;
