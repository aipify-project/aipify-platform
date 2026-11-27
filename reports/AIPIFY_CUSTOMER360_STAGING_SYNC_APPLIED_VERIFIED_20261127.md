# STAGING_DEPENDENCY_SYNC_APPLIED_VERIFIED

**Dato:** 2026-11-27  
**Prosjekt:** Staging `auedugihkduoaikfusqe`  
**Fil:** `docs/sql-candidates/20261127_staging_customer_contact_dependency_sync_v1.sql`  
**SHA256:** `5b67e2dfb21bc5cecf7232d5f283097cd43dd388f3a1e2ee59b655e4fd8e2d5f`  
**Eier-JA:** mottatt eksakt linje  
**Production:** ikke rørt (`qbcqoixhrvhnuwphefvw` kontakt-RPC fortsatt fraværende)

## Apply

| Felt | Verdi |
|------|--------|
| Metode | Supabase MCP `apply_migration` |
| Migration name | `staging_customer_contact_dependency_sync_v1` |
| schema_migrations version | `20261127165612` |
| Resultat | success |

## Post-apply probes (alle PASS)

| Probe | Resultat |
|-------|----------|
| `has_full_name` | true |
| `has_phone` | true |
| `has_updated_at` | true |
| `updated_at_not_null` | true |
| `platform_admin_audit_logs_exists` | true |
| `audit_rls_enabled` | true |
| `audit_select_policy` | true |
| `audit_insert_policy` | true |
| `record_platform_admin_audit_event` | true (signatur match) |
| `is_platform_admin` | true |
| `contact_rpc_still_absent` | true |
| `customers_row_count` | **9** (uendret) |
| `platform_admins_count` | **0** (ingen seed) |
| `audit_row_count` | 0 |
| `customers` kolonner | `id`, `company_id`, `full_name`, `phone`, `updated_at` |
| `record_fn` EXECUTE | `authenticated`, `postgres` (ikke anon) |

## Hard stop overholdt

- Kontakt-RPC **ikke** applied  
- Ingen `platform_admins` / auth seed  
- Ingen syntetisk kunde-write  
- Ingen Production-write  

## Neste eier-gates (ikke godkjent)

```
JA STAGING APPLY auedugihkduoaikfusqe docs/sql-candidates/20261127_update_platform_portal_customer_primary_contact_v1.sql SHA256=0cf8938b6e5114240230bae53e01782d8116e471bd52bd80032d8a059a28cd6b
```

+ egen godkjenning for Staging testadmin (0 admins nå)  
+ egen JA for syntetisk E2E  
+ Production apply separat etter Staging E2E PASS
