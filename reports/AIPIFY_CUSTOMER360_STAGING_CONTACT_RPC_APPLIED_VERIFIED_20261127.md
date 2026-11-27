# STAGING_CONTACT_RPC_APPLIED_VERIFIED

**Dato:** 2026-11-27  
**Prosjekt:** Staging `auedugihkduoaikfusqe`  
**Fil:** `docs/sql-candidates/20261127_update_platform_portal_customer_primary_contact_v1.sql`  
**SHA256:** `0cf8938b6e5114240230bae53e01782d8116e471bd52bd80032d8a059a28cd6b`  
**Eier-JA:** mottatt eksakt linje  
**Production:** ikke rørt (kontakt-RPC fortsatt fraværende)

## Apply

| Felt | Verdi |
|------|--------|
| Metode | Supabase MCP `apply_migration` |
| Migration name | `update_platform_portal_customer_primary_contact_v1` |
| schema_migrations version | `20261127170315` |
| Resultat | success |

## Pre-apply (deps allerede på Staging)

`full_name` / `phone` / `updated_at` · audit-tabell · `record_platform_admin_audit_event` · `is_platform_admin` — alle til stede. Kontakt-RPC manglet.

## Post-apply probes (PASS)

| Probe | Resultat |
|-------|----------|
| RPC exists + korrekt signatur | true |
| returns `jsonb` | true |
| EXECUTE grants | authenticated, service_role, postgres |
| anon EXECUTE | **false** |
| unauthorized call (ikke platform admin) | rejected (`forbidden` / platform_admin) |
| `customers` radtall | **9** (ingen kundedata skrevet) |
| `platform_admin_audit_logs` radtall | **0** |
| `platform_admins` | **0** (ingen seed) |

## Hard stop overholdt

- Ingen Production-apply  
- Ingen admin/auth seed  
- Ingen syntetisk kunde-write / authorized E2E  
- Ingen adresse-/faktura-/Stripe-endring  

## Neste eier-gates (ikke godkjent)

1. Staging testadmin/testidentitet (nødvendig — 0 `platform_admins`)  
2. `JA STAGING E2E CONTACT WRITE on synthetic customer after RPC apply`  
3. Production apply (separat JA etter E2E PASS)
