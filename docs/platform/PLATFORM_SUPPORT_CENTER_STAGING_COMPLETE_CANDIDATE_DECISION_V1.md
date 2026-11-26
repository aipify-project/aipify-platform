# Support Center — komplett Staging-kandidat (beslutningsrapport)

**Dato:** 2026-11-26  
**Repo / PR:** `aipify-project/aipify-platform` · [#400](https://github.com/aipify-project/aipify-platform/pull/400)  
**Worktree:** `/Users/veltrix/Development/aipify-platform-support-center-v1-20261126b`  
**Branch / HEAD (ved forfattering):** `feat/platform-support-center-v1-20261126b`  
**Staging:** `aipify-core-staging` · `auedugihkduoaikfusqe`  
**Status:** **NOT_RUN** — ingen SQL apply i denne jobben

---

## 1. Konklusjon (kort)

De to opprinnelige Support Center-filene kan **ikke** kjøres alene på Staging. Staging mangler ticket-SoT og Platform-access-helper, men har allerede `platform_admins` (+ `is_platform_admin`).

**Hele phase258 / phase271 / phase620 trengs ikke.**  
Minsteløsning: én **minimal foundation**-kandidat (nytt fil) + de to opprinnelige filene, i den rekkefølgen.

Standalone schemafil  
`platform_support_center_messages_signature_templates_v1.sql`  
**skal ikke kjøres** — dekkes av Staging batch.

---

## 2. Staging-faktum (kontrollert nå)

| Objekt | Staging nå | Trengs av |
|--------|------------|-----------|
| `platform_admins` | **Finnes** (`id, auth_user_id, role, created_at`; role check `super_admin\|platform_support`) | Access |
| `platform_admins.status` | **Mangler** (Prod har den) | `_ppsf258_require_platform_access` |
| `is_platform_admin()` | **Finnes** (kun membership, ikke role/status) | Ikke brukt av Support Center-RPC-ene |
| `_ppsf258_require_platform_access()` | **Mangler** | Read + write RPCs |
| `companies` / `users` | **Mangler** | Ticket FK + read join (`c.is_platform`, `c.name`) |
| `app_portal_support_requests` (+ audit) | **Mangler** | Read + write |
| `platform_support_*` | **Mangler** | Staging batch |
| CSP `csp_sales_email_*` | Finnes | **Utenfor scope — ikke rør** |

Production Core (`qbcqoixhrvhnuwphefvw`) har ticket-SoT + companies/users + `_ppsf258` — Staging er ikke i paritet; denne kandidaten bygger **kun** Support Center-minimum.

### Phase-mapping (hva som faktisk trengs)

| Fase | Full fil? | Minimal erstatning |
|------|-----------|--------------------|
| phase258 | **Nei** (dashboard/subscriptions utelates) | Kun `_ppsf258_require_platform_access` + `platform_admins.status` |
| phase271 | **Nei** (APP list/create RPCs utelates) | Tabellene `app_portal_support_requests` + audit med nødvendige kolonner |
| phase620 | **Nei** (history/reopen RPCs utelates) | Kolonnene `channel`, `resolved_at` + utvidet status-sett |
| multi_tenant_foundation | **Nei** (triggers/policies utover minimum utelates) | Minimal `companies` + `users` subset kompatibel med Prod-kolonner |

---

## 3. Kjørerekkefølge (eksakt) — 3 filer, én gang hver

| Steg | Filbane | FULL SHA-256 |
|------|---------|--------------|
| **1** | `docs/platform/sql-candidates/platform_support_center_staging_foundation_minimal_v1.sql` | `ab258cff0dc1a77cc0ae7e998bc38d2b20c1e523c9c5a9a2499ff7ccf69ba891` |
| **2** | `docs/platform/NOT_APPLIED_platform_support_tickets_cross_tenant_read_rpc_v1.sql` | `63ed974a50229e828b34e0eb99be00080a8b84b48258414f64ce802039134291` |
| **3** | `docs/platform/sql-candidates/platform_support_center_staging_batch_v1.sql` | `96991c0cccce9ad23f7d6f4696b888aba9a13b4f37ee13e52652bbf715501c95` |

**Ikke kjør:**  
`docs/platform/sql-candidates/platform_support_center_messages_signature_templates_v1.sql`  
SHA `247f4635e4f97a2b5a1f0080d7a795a66403aa9ef20db256a3f331a74f4bf192` (overlapp med steg 3).

---

## 4. Objekter per fil

### Steg 1 — foundation minimal
**Oppretter / endrer:**
- `ALTER platform_admins ADD status` (+ check `active|suspended|disabled`)
- `FUNCTION _ppsf258_require_platform_access()` — grant execute → `authenticated`; revoke → `public, anon`
- `TABLE companies` (`id, name, slug, created_at, is_platform`) — RLS on; revoke direct access
- `TABLE users` (`id, auth_user_id→auth.users, company_id→companies, full_name, role, created_at`) — RLS on; revoke direct access
- `TABLE app_portal_support_requests` (SoT-kolonner inkl. `channel`, `resolved_at`, status inkl. Platform-overganger) — RLS on; revoke `public/anon/authenticated`
- `TABLE app_portal_support_request_audit_logs` — RLS on; revoke samme

**Oppretter ikke:** APP portal RPCs, phase258 dashboard, phase620 history RPCs, CRM.

### Steg 2 — Platform read RPCs
**Oppretter:**
- Index `app_portal_support_requests_platform_list_idx`
- Helpers `_psstrv1_list_item`, `_psstrv1_detail_item` (ingen grant til authenticated)
- `list_platform_app_portal_support_requests`
- `get_platform_app_portal_support_request`
- `get_platform_app_portal_support_request_counts`  
Alle gated av `_ppsf258_require_platform_access`; execute → `authenticated`; **ikke anon**.

**Leser:** `app_portal_support_requests` ⋈ `companies` (`is_platform = false`); detail timeline fra audit logs.

### Steg 3 — Staging batch (messages / signature / templates / write)
**Oppretter tabeller:**  
`platform_support_ticket_messages`, `platform_support_signatures`, `platform_support_reply_templates`, `platform_support_ticket_admin_audit`, `platform_support_guest_contacts`  
(RLS on; revoke direct table access)

**Oppretter RPCs (authenticated execute, ikke anon):**
- `platform_support_post_internal_note`
- `platform_support_post_external_reply_draft` → `delivery_status = blocked_unconfigured` (**ingen e-postsending**)
- `platform_support_update_ticket_status`
- `platform_support_assign_ticket`

---

## 5. Eksisterende data, tilgang, avhengigheter

### Data
- Staging har **ingen** Support Center-tabeller i dag → ingen eksisterende ticket-rader å migrere.
- CSP/CRM-data forblir urørt (ingen referanser i executable statements utover «ikke rør»-kommentarer).
- `platform_admins`-rader beholdes; `status` får default `'active'`.

### Tilgangsregler (forventet etter apply)
- Direkte tabelltilgang til ticket/message/signature/template: **ikke** til `anon`/`authenticated`.
- Les/skriv kun via security definer RPCs + `_ppsf258` (aktive `super_admin` \| `platform_support`).
- Eksterne svar lagres som draft `blocked_unconfigured` — e-post **OFF**.

### Avhengighetsgraf
```
platform_admins (+status)
        └── _ppsf258_require_platform_access
companies ← users
    └── app_portal_support_requests ← audit_logs
              ├── [steg 2] list/get/counts RPCs
              └── [steg 3] messages/audit/write RPCs
                          signatures / reply_templates / guest_contacts
```

---

## 6. Lokal / Staging verifikasjonsplan (etter apply — ikke nå)

1. Re-hash alle tre filer; stopp ved mismatch.  
2. Kjør steg 1 → 2 → 3 via `apply_migration` (eller ekvivalent), **én gang hver**.  
3. Kjør verify harness:  
   `docs/platform/sql-candidates/platform_support_center_staging_verify_harness_v1.sql`  
   Forvent: objekter finnes; `anon_execute = false` på Support RPCs; ingen uønskede table grants.  
4. Med innlogget Staging-bruker i `platform_admins` (`platform_support` eller `super_admin`, `status=active`):
   - list/counts (tom eller med midlertidige rader)
   - negativ: vanlig authenticated uten platform_admins → «Platform portal access denied»
5. Midlertidige fixtures (to `companies` med `is_platform=false`, to tickets, evt. to `users`):
   - filter på `company_id` / list ikke lekker på tvers
   - internal note + external reply draft + status-overgang
   - insert signature + reply_template rad (persist)
6. **Rydd alle fixtures** (delete test tickets/messages/companies/users merket for test).  
7. Bekreft ingen rader i e-post-provider kø / ingen CRM-endring.

### Plan ved feil
| Feil | Handling |
|------|----------|
| SHA mismatch | STOPP — ingen apply |
| Steg 1 feiler | STOPP — ikke kjør steg 2/3; ingen auto-retry |
| Steg 2 feiler etter steg 1 | STOPP — ikke kjør steg 3; rapporter objekttilstand; forward-fix kun med ny eier-YES |
| Steg 3 feiler | STOPP — behold steg 1–2; ikke re-kjør steg 3 automatisk |
| Privilege/anon execute true | STOPP — revoke manuelt; ny eier-godkjenning før videre |
| Utilsiktet CRM-endring | STOPP umiddelbart (skal ikke skje; kandidatene rører ikke CSP-tabeller) |

Rollback-preferanse: **forward-fix / revoke execute**, ikke `DROP` av delte objekter uten egen godkjenning.

---

## 7. Én samlet, eksakt Staging-godkjenningstekst

Kopier/lim inn som eier-beslutning:

```text
Jeg godkjenner ÉN kontrollert Staging-kjøring på aipify-core-staging
(auedugihkduoaikfusqe) av følgende tre SQL-filer, i eksakt denne rekkefølgen,
maks én gang hver. Ingen Production. Ingen CRM/Sales Email-endring.
Ingen secrets/DNS/e-postaktivering. Ingen separat kjøring av
platform_support_center_messages_signature_templates_v1.sql.

1) docs/platform/sql-candidates/platform_support_center_staging_foundation_minimal_v1.sql
   SHA256: ab258cff0dc1a77cc0ae7e998bc38d2b20c1e523c9c5a9a2499ff7ccf69ba891

2) docs/platform/NOT_APPLIED_platform_support_tickets_cross_tenant_read_rpc_v1.sql
   SHA256: 63ed974a50229e828b34e0eb99be00080a8b84b48258414f64ce802039134291

3) docs/platform/sql-candidates/platform_support_center_staging_batch_v1.sql
   SHA256: 96991c0cccce9ad23f7d6f4696b888aba9a13b4f37ee13e52652bbf715501c95

Før kjøring: verifiser repo/worktree, filbytes-SHA, at objektene i steg 1 mangler
(companies/users/app_portal_support_requests/_ppsf258), og at CSP-tabeller ikke endres.
Ved avvik eller feil: stopp uten automatisk ny kjøring.
Etter kjøring: kjør verify harness, isolasjons-/status-/note-/draft-tester,
bekreft ingen e-postsending, rydd testdata, og lever rapport + neste port
(kode-gate flips / Production — separate godkjenninger).
```

---

## 8. Neste porter etter grønn Staging

1. **Kode:** separat eier-YES for å flippe `RPC_CONNECTED` / feature gates (les + intake/write) — ikke del av denne SQL-godkjenningen.  
2. **E-post:** separat OFF→ON (Resend/DNS/secrets).  
3. **Production SQL:** separat apply YES etter Staging-QA (samme SHA-er, ny beslutning).

---

## FINAL_STATUS

**STAGING_COMPLETE_CANDIDATE_READY_OWNER_APPROVAL_PENDING**  
Ingen SQL er kjørt i denne jobben.
