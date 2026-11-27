# PR #443 oppfølging — Staging Core-gate + autentisert QA

**Dato:** 2026-11-27  
**Worktree:** `aipify-pr443-c360-core-gate-qa-followup-20261127`  
**Branch:** `fix/pr443-staging-core-gate-auth-qa-20261127` @ `origin/main`  
**HEAD:** `d22c3465fe94998131a02a8460bbc90fa8e11dd7`  
**SQL applied i denne jobben:** nei (NO_SQL_APPLY)

## Bekreftet LIVE (ikke gjentatt)

| PR | Merge SHA | Status |
|----|-----------|--------|
| #443 Customer 360 tabs / product truth / fail-closed contact | `1bcc84204e248f43c1d79caed64288f9e8303688` | ancestor of `origin/main` |
| #447 Firma-/fakturaadresse + invoice status (read-only) | `7e85f8caa26cbe61169d3fc571f25276f9d1661c` | ancestor of `origin/main` |

Åpne PR-er ved kjøring (ikke kollidert): #445, #442, #411, #383, #373, m.fl. dokumentasjons-/CSP-PR-er.

## Del A — Kontakt-RPC Staging-preflight (read-only)

### Kandidat

| Felt | Verdi |
|------|--------|
| Fil | `docs/sql-candidates/20261127_update_platform_portal_customer_primary_contact_v1.sql` |
| SHA256 (beregnet) | `0cf8938b6e5114240230bae53e01782d8116e471bd52bd80032d8a059a28cd6b` |
| SHA256 (ledger) | `0cf8938b6e5114240230bae53e01782d8116e471bd52bd80032d8a059a28cd6b` |
| Match | **JA** — SQL-sporet kan fortsette |
| RPC | `update_platform_portal_customer_primary_contact(...)` |
| Skriver | kun `customers.full_name`, `customers.phone` |
| Krever | `is_platform_admin()`, `confirmation`, reason 3–500, `record_platform_admin_audit_event` |
| Rollback | `DROP FUNCTION public.update_platform_portal_customer_primary_contact(uuid, text, text, boolean, boolean, boolean, text, text);` |

### Read-only avhengigheter

| Avhengighet | Staging `auedugihkduoaikfusqe` | Production `qbcqoixhrvhnuwphefvw` |
|-------------|-------------------------------|----------------------------------|
| `is_platform_admin()` | til stede | til stede |
| `platform_admin_audit_logs` | **mangler** | til stede |
| `record_platform_admin_audit_event` | **mangler** | til stede |
| `customers.full_name` / `customers.phone` | **mangler** (tabell finnes, kun `id`+`company_id`) | til stede |
| `update_platform_portal_customer_primary_contact` | mangler (forventet) | mangler (forventet) |
| `organization_registration_profiles` | **mangler** | til stede (website, business_address, postal/city/country) |
| `payment_profiles` | **mangler** | til stede |
| `billing_profiles` | mangler | mangler (447 bruker `payment_profiles`) |

**Konklusjon Staging:** kontakt-RPC kan **ikke** installs alene. Staging Core er schema-driftet vs Production for kunde-/audit-fundament. Apply uten avhengighets-synk vil feile eller være usikker.

### Godkjenningspakke (ikke utført)

Hvert steg krever **egen eksakt eier-JA**.

#### (a) Avhengighets-synk Staging — `auedugihkduoaikfusqe`

| | |
|--|--|
| Formål | Fylle minimumskolonnene/objektene RPC-en trenger |
| Autoritative kilder | `supabase/migrations/20260610190000_customer_billing_subscription_foundation.sql` (`customers.full_name`/`phone`), `supabase/migrations/20261441000000_portal_separation_platform_audit.sql` (audit-tabell + `record_platform_admin_audit_event`) |
| Risiko | Høy — Staging `customers` er stub; synk må være additiv og reviewet, ikke destruktiv |
| Effekt | Staging får kolonner + audit som Production allerede har |
| Reversering | DROP/ALTER kun hvis eier godkjenner; ingen hard delete av kundedata |
| Blokkering | Staging mangler også org-registrering/payment for 447-lesestier — egen vurdering om synk skal utvides |

**JA-linje A:** `JA STAGING DEPENDENCY SYNC auedugihkduoaikfusqe customers.full_name+phone + platform_admin_audit (20260610190000/20261441000000 scope)`

#### (b) Kontakt-RPC Staging

| | |
|--|--|
| Fil / hash | `docs/sql-candidates/20261127_update_platform_portal_customer_primary_contact_v1.sql` · `0cf8938b…cd6b` |
| Prosjekt | `auedugihkduoaikfusqe` |
| Forutsetning | Steg (a) grønt |
| Risiko | Middels — SECURITY DEFINER, kun authenticated/service_role execute; ingen e-post/juridisk |
| Effekt | Platform Kontakt-edit kan lagre navn/telefon med audit |
| Reversering | DROP FUNCTION (se kandidat) |

**JA-linje B:** `JA STAGING APPLY auedugihkduoaikfusqe docs/sql-candidates/20261127_update_platform_portal_customer_primary_contact_v1.sql SHA256=0cf8938b6e5114240230bae53e01782d8116e471bd52bd80032d8a059a28cd6b`

#### (c) Staging funksjonell test (syntetisk testkunde)

| | |
|--|--|
| Omfang | Platform Admin → Kunde 360 → Kontakt → oppdater navn/telefon med reason + confirm → verify APP/Platform leser samme |
| Forbud | Ingen UnoNight-prod-data, ingen e-post/faktura |
| Etter suksess | Først da Production-JA |

**JA-linje C:** `JA STAGING E2E CONTACT WRITE on synthetic customer after RPC apply`

#### (d) Production apply — separat

| | |
|--|--|
| Prosjekt | `qbcqoixhrvhnuwphefvw` |
| Avhengigheter | allerede til stede (audit + kolonner) |
| Forutsetning | Staging (b)+(c) grønne |

**JA-linje D:** `JA PRODUCTION APPLY qbcqoixhrvhnuwphefvw docs/sql-candidates/20261127_update_platform_portal_customer_primary_contact_v1.sql SHA256=0cf8938b6e5114240230bae53e01782d8116e471bd52bd80032d8a059a28cd6b`

## Del B — Firma- / fakturaadresse

### #447 read-only (bekreftet i kode + tester)

- Leser `organization_registration_profiles` (firmaadresse/nettsted) og `payment_profiles` (fakturaadresse) via `lib/platform-portal/load-customer-360-company-invoice.ts`.
- Presentasjon: `customer-company-address.ts` — «Ikke registrert» vs «Ikke tilgjengelig»; ingen address line 2/region uten lagring.
- Faktura: `customer-invoice-status.ts` — paid / overdue / partially_paid / credited / unknown / zero; valuta holdes adskilt.
- Tester grønne: `customer-company-address.test.ts`, `customer-invoice-status.test.ts`, `customer-detail.test.ts` (assert ingen write).

### Skrivekandidater (ikke applied)

| Kandidat | SHA256 | Scope | Egnet for Platform 360 firmaadresse? |
|----------|--------|-------|--------------------------------------|
| `docs/platform/NOT_APPLIED_company_profile_contact_write_v2.sql` | `1960f826fed25973a3203b749066a32f3cdbc523092291d5dabcfa3658bfcbe3` | APP owner/admin: **website + phone** på registration profile | Nei — ikke street/postal/city; ikke Platform Admin |
| `docs/platform/NOT_APPLIED_company_profile_read_v2.sql` | `4f721013456757366b45c5ec01501f32f067ccd6909656f173ab2ef4b7b64c93` | Read | — |
| `docs/platform/NOT_APPLIED_company_profile_logo_storage_v2.sql` | `30a741b353f53a9780a534bf69481cf625642317f816a12d0c49af9767a6f6b9` | Logo | Utenfor denne jobben |

**Gap:** Ingen klar NOT_APPLIED-kandidat for Platform-sikret oppdatering av firmaadresse (gateadresse) eller separat fakturaadresse (`payment_profiles`). Anbefaling: behold read-only UI; ny additiv SQL-kandidat krever egen oppgave (ikke fabrikkert her).

## Del C — Autentisert E2E-QA

| Probe | Resultat |
|-------|----------|
| `GET https://app.aipify.ai/platform/customers` | **307** → `/login?next=/platform/customers` |
| `GET https://app.aipify.ai/app/profile` | **307** → `/login?next=/app/profile` |

**OWNER_BROWSER_QA_PENDING** — ingen innlogget nettlesersesjon i denne agenten. Kontraktstester brukes som supplement (ikke viewport PASS).

### Eierens manuelle sjekkliste

1. Platform → Kunder → åpne kunde → faner Kontakt / Firma / Produkter / Abonnement / Support / Teknisk (375 / 768 / 1440).
2. Firma: firmaadresse + nettsted fra registration; fakturaadresse fra `payment_profiles` eller «samme som firma»; tom = Ikke registrert; feil = Ikke tilgjengelig.
3. Abonnement/faktura: forfalt vs betalt, 0≠ukjent, valuta, partial/credit/unknown.
4. Kontakt «Oppdater kontakt»: uten RPC → lokal melding `errorCoreGatePending` (NO: *Kontaktoppdateringer er forberedt, men venter på Core-godkjenning…*), ingen rå backend-stack.
5. APP «Be om endring» → `/app/support/requests?new=1&category=account&intent=customer_profile_change` med prefill; ingen falsk suksess hvis create feiler.
6. APP personlige felt lagres via eksisterende flyt; ikke bland APP-lisens / Website Kompis / Bedrift.

## Del D — Kode

Ingen ny regresjon funnet. **Ingen kodeendring** i denne oppfølgingen. Fail-closed contact write forblir `501 core_gate_pending` til RPC er applied.

## Statusmatrise

| Merke | Innhold |
|-------|---------|
| **CODE_LIVE** | #443 + #447 allerede på Production (`app.aipify.ai`) |
| **CORE_GATE_PENDING** | Kontakt-RPC; Staging avhengighets-synk før Staging-apply; Production-apply etter Staging E2E |
| **OWNER_BROWSER_QA_PENDING** | Innlogget Platform/APP viewport-QA (liste over) |
| **ADDRESS_WRITE_GAP** | Ingen Platform firma-/fakturaadresse-write-kandidat klar |

## Eksakte JA-linjer som mangler

```
JA STAGING DEPENDENCY SYNC auedugihkduoaikfusqe customers.full_name+phone + platform_admin_audit (20260610190000/20261441000000 scope)
JA STAGING APPLY auedugihkduoaikfusqe docs/sql-candidates/20261127_update_platform_portal_customer_primary_contact_v1.sql SHA256=0cf8938b6e5114240230bae53e01782d8116e471bd52bd80032d8a059a28cd6b
JA STAGING E2E CONTACT WRITE on synthetic customer after RPC apply
JA PRODUCTION APPLY qbcqoixhrvhnuwphefvw docs/sql-candidates/20261127_update_platform_portal_customer_primary_contact_v1.sql SHA256=0cf8938b6e5114240230bae53e01782d8116e471bd52bd80032d8a059a28cd6b
```

Ingen SQL er kjørt. Ingen faktura, e-post eller kundedata skrevet.
