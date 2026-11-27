# AIPIFY_CUSTOMER360_STAGING_DEPENDENCY_PREFLIGHT_V1

**Dato:** 2026-11-27  
**Status:** **STAGING_DEPENDENCY_SYNC_READY_FOR_OWNER_APPROVAL**  
**SQL applied:** nei (NO_SQL_APPLY)  
**Production endret:** nei  
**Kunde 360 UI:** ikke gjenoppbygd

## Leveranse

| Artefakt | Sti |
|----------|-----|
| Sync-kandidat (idempotent) | `docs/sql-candidates/20261127_staging_customer_contact_dependency_sync_v1.sql` |
| Sync SHA256 ledger | `docs/sql-candidates/20261127_staging_customer_contact_dependency_sync_v1.sha256.txt` |
| Read-only verify | `docs/sql-candidates/20261127_staging_customer_contact_dependency_verify_readonly_v1.sql` |
| E2E-plan | `docs/sql-candidates/20261127_staging_customer_contact_e2e_plan_v1.md` |
| Kontraktstest | `lib/platform-portal/customer-contact-staging-dependency-sql.contract.test.ts` |
| Kontakt-RPC (uendret) | `docs/sql-candidates/20261127_update_platform_portal_customer_primary_contact_v1.sql` |

## 1) Staging-gap (read-only, `auedugihkduoaikfusqe`)

| Objekt | Staging nå | Production `qbcqoixhrvhnuwphefvw` |
|--------|------------|-----------------------------------|
| `customers` tabell | finnes (stub) | finnes (full) |
| kolonner | kun `id`, `company_id` | bl.a. `full_name`, `phone`, `updated_at`, … |
| `customers.full_name` | **mangler** | til stede (nullable text) |
| `customers.phone` | **mangler** | til stede (nullable text) |
| `customers.updated_at` | **mangler** (RPC setter feltet) | til stede NOT NULL |
| `platform_admin_audit_logs` | **mangler** | til stede + RLS |
| `record_platform_admin_audit_event` | **mangler** | til stede `(text,text,text,jsonb)→uuid` |
| `is_platform_admin()` | til stede | til stede |
| `platform_admins` | tabell finnes, **0 rader** | i bruk |
| `update_platform_portal_customer_primary_contact` | mangler (forventet) | mangler (forventet) |
| `schema_migrations` for `20260610190000` / `20261441000000` | ikke registrert | historisk applied |

**Radtelling Staging `customers`:** 9 (skal forbli 9 etter kolonne-ADD — ingen DELETE).

## 2) Migrasjonskilder og rekkefølge

| Steg | Kilde | Handling på Staging |
|------|-------|---------------------|
| Forutsetning | `20260610180000_multi_tenant_separation.sql` | allerede: `is_platform_admin`, `platform_admins` |
| A — kolonner | subset av `20260610190000_…foundation.sql` | **ADD COLUMN IF NOT EXISTS** — ikke `CREATE TABLE customers` (ville feile / være for bred) |
| B — audit | `20261441000000_portal_separation_platform_audit.sql` | `CREATE TABLE IF NOT EXISTS` + RLS + `CREATE OR REPLACE` funksjon + policy DROP/CREATE |
| C — kontakt-RPC | egen kandidat SHA `0cf8938b…` | **ikke** i denne sync-fila — egen JA etter sync |

Rettigheter i sync-planen:

- Audit: RLS ON; SELECT/INSERT kun for `authenticated` + `is_platform_admin()`; ingen UPDATE/DELETE-policy.
- `record_platform_admin_audit_event`: `REVOKE ALL … FROM public, anon`; `GRANT EXECUTE … TO authenticated`; body krever `is_platform_admin()`.
- Ingen svekkelse vs Production-intensjon; ingen utvidet table GRANT på `customers`.

## 3) Minimal idempotent plan (innhold)

1. `ALTER TABLE customers ADD COLUMN IF NOT EXISTS full_name text`
2. `ADD COLUMN IF NOT EXISTS phone text`
3. `ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now()` (+ idempotent NOT NULL-guard)
4. `CREATE TABLE IF NOT EXISTS platform_admin_audit_logs (…)` + index
5. Enable RLS; recreate select/insert policies
6. `CREATE OR REPLACE record_platform_admin_audit_event`

**Ikke inkludert:** contact RPC, Production, billing/org-profiler, admin-seed, data-overwrite av navn/telefon.

## 4) Verifikasjon etter apply

Kjør read-only: `docs/sql-candidates/20261127_staging_customer_contact_dependency_verify_readonly_v1.sql`

Alle `has_*` / policy / funksjon-prober skal være `true`.  
`contact_rpc_still_absent` skal være `true` (RPC er neste steg).  
`customers_row_count` skal fortsatt være 9 (med mindre eier aktivt insertet syntetisk kunde).

## 5) Kontakt-RPC SHA256

| | |
|--|--|
| Fil | `docs/sql-candidates/20261127_update_platform_portal_customer_primary_contact_v1.sql` |
| SHA256 | `0cf8938b6e5114240230bae53e01782d8116e471bd52bd80032d8a059a28cd6b` |
| Ledger-match | **JA** (uendret) |

## 6) Syntetisk E2E (etter sync + RPC — ikke nå)

Se `docs/sql-candidates/20261127_staging_customer_contact_e2e_plan_v1.md`:

- Unauthorized → `forbidden: platform_admin required`
- Uten confirmation / ugyldig reason/phone → feil, ingen mutate
- Authorized → oppdater + `platform_admin_audit_logs` med before/after/reason
- **Merk:** Staging har 0 `platform_admins` — kreves før authorized E2E (egen kontrollert seed, ikke i sync-SQL)

## 7) Eksakt godkjenningslinje for Staging dependency sync

```
JA STAGING DEPENDENCY SYNC auedugihkduoaikfusqe docs/sql-candidates/20261127_staging_customer_contact_dependency_sync_v1.sql SHA256=5b67e2dfb21bc5cecf7232d5f283097cd43dd388f3a1e2ee59b655e4fd8e2d5f
```

### Neste JA-linjer (ikke bedt om nå)

```
JA STAGING APPLY auedugihkduoaikfusqe docs/sql-candidates/20261127_update_platform_portal_customer_primary_contact_v1.sql SHA256=0cf8938b6e5114240230bae53e01782d8116e471bd52bd80032d8a059a28cd6b
JA STAGING E2E CONTACT WRITE on synthetic customer after RPC apply
```

## Konklusjon

**STAGING_DEPENDENCY_SYNC_READY_FOR_OWNER_APPROVAL**

Ingen SQL er kjørt. Stopper ved eiergodkjenning av linjen over.
