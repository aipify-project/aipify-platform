# AIPIFY – KOMPIS WEB CONNECTION, LICENSE, DOMAIN & VISIBILITY BUILD 66 — RESULT

**Branch:** `feature/kompis-web-connection-license-domain-visibility-66`  
**Feature commit:** `72762b0e7050036e01df94866aab1379d492e234`  
**PR:** [#161](https://github.com/aipify-project/aipify-platform/pull/161)  
**Merge SHA:** `606c2287746fcd1142e61997194089f1f74c1e65`  
**APP project:** `aipify-platform` (`prj_tPgcqwgUAAkGvBy802arVXVYf1fv`)  
**Deployment ID:** `dpl_5Dm45wBXk8ET3x5beu43XTMxboXw` — **READY**  
**Canonical domain:** `app.aipify.ai`

| Gate | Result |
|------|--------|
| `READY FOR OWNER CONNECTION TEST` | **YES** |
| `SAFE TO FREEZE CONNECTION/LICENSE` | **NO** |
| `MIGRATION CREATED/APPLIED` | **NO** |
| Auth preserved | **YES** |
| `/app/kompis` preserved | **YES** |
| Old APP Companion absent | **YES** |
| Frozen Website Kompis files/hashes/runtime diff | **0** |

---

## What shipped

Canonical route remains **`/app/website-kompis/connection`** (`kompisWebConnection` / Tilkobling/lisens).

1. **Aggregate status card** — Active / Pending / Needs action / Blocked / Suspended / Not configured (server-composed).
2. **Checkpoints** — Product, Subscription link, License, Domain, Installation, Public runtime.
3. **Domains** — verified binding + install detected (masked install id); existing `DomainLicenseCenterPanel` for writes.
4. **Installation** — guidance only; snippet remains in domain settings; never secrets.
5. **Page visibility** — documents default (all approved public pages) + protected-route hide; no fake APP page-rule editor.
6. **License/capabilities** — product enabled, plan, license status; Design Studio stays hidden.
7. **Diagnosis** — deterministic reason codes + support reference (`WK-CONN-…`).
8. **Dashboard** — same aggregate status + deep links to domains/help sections.

No frozen Website Kompis runtime edits. No SQL/migration. No license force-active.

---

## Truth-source / precedence matrix

| Source | Authoritative | APP mutate |
|--------|---------------|------------|
| Product module | `is_tenant_module_enabled('website_kompis')` | No |
| Subscription / license | `get_app_organization_context` + license service | No (Subscription page) |
| Domains | `get_domain_license_center` / `perform_domain_license_action` | Yes (owner/admin) |
| Website binding | `customer_domains` + activate/deactivate WK | Yes (existing) |
| Installation | `installations` via binding | No new keys |
| Public runtime last-seen | none in APP | No |
| Page rules | Frozen loader default + job 51 protected hide | No |

**Active precedence:** product ok ∧ license ok ∧ domain verified ∧ install detected. Public runtime last-seen does **not** block Active when unavailable. Fail closed on conflict.

---

## Gaps (not created)

1. `app_install_heartbeat_last_seen`
2. `customer_editable_page_include_exclude_rules`
3. `unified_org_and_customer_domain_sot_rpc`
4. `public_runtime_probe_from_app`

`MIGRATION CREATED/APPLIED = NO`

---

## Tests / gates

| Check | Result |
|-------|--------|
| `npx tsx lib/website-kompis-connection/connection-66.test.ts` | PASS |
| `npm run typecheck` | PASS |
| Frozen SHA256 | **0 / 46** |
| `npm run build` | PASS |
| SQL/migration diff | None |

---

## Owner test after LIVE

1. Aggregate status understandable without technical knowledge.
2. Domains/verification correct.
3. Install status matches real site (script presence).
4. Active requires full chain, not payment alone.
5. Tilkobling/lisens ≠ Abonnement.
6. Page visibility matches runtime default (no fake local rules).
7. No private keys shown.
8. Dashboard matches detail page.
9. Public Website Kompis unchanged.

Stop after LIVE report and owner test. Do not freeze automatically.
