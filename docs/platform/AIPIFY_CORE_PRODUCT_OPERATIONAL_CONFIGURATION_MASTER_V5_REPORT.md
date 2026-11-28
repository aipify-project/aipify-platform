# AIPIFY_CORE_PRODUCT_OPERATIONAL_CONFIGURATION_MASTER_V5

**Overall:** Operational configuration **CODE_READY / INTEGRATION_READY** · Appearance theme writer **BLOCKED** (candidate) · Presence producer **BLOCKED** (Agent 4) · Signed-in E2E **BLOCKED**

| | |
| --- | --- |
| Branch | `agent/core-product-operational-configuration-master-v5-20261128` |
| Baseline | `origin/main` includes #538 (`330bafc37`) + #539 |
| #538 Production | **LIVE** — `app.aipify.ai` → `dpl_G1MnFE4oWDZGaychFV25MweCN4PP` READY · commit `330bafc37` · aliases include `app.aipify.ai` |
| Public-chain freeze | untouched |
| SQL apply / Stripe / provision / media upload / presence writer | none in this PR |

---

## Phase A–M

| Phase | Status | Notes |
| --- | --- | --- |
| A Release #538 | **LIVE** | Deploy proof above; V5 builds on that baseline |
| B Core configuration | **CODE_READY** | `buildOperationalConfigurationSnapshot` composes Agent 1 rules + quota + provision gate + appearance fail-closed |
| C Appearance | **BLOCKED** (theme writer) / **INTEGRATION_READY** (install chrome) | Fail-closed adapter + SQL candidate SHA `6a95f4dc…`; Connection domain API for icon/tone/welcome variant |
| D/E Widget/domains/install | **INTEGRATION_READY** | Connection summary authoritative; never “connected” without proof |
| F Provision/onboarding | **BLOCKED** (activation) | `WEBSITE_KOMPIS_SITE_PROVISION_LIVE=false`; boolean entitlement ≠ invented expiry |
| G Bedrift | **INTEGRATION_READY** | #538 license status + embedded panels preserved |
| H Knowledge/operator/feedback | **INTEGRATION_READY** | Existing FAQ/EKE/feedback; no parallel ingest |
| I Usage/capacity | **LIVE** (#538) | Usage page + null≠0 / unavailable preserved |
| J Product Center/media | **LIVE** (#531 reads) / upload **BLOCKED** in Production | No new media writes |
| K Commercial | **CODE_READY** (reads) | Agent 1 `AGENT_CONTRACT_RULES` — no purchase CTA / no commission in APP |
| L Presence | **BLOCKED** | No `lib/platform-portal/live-presence/` on main — see coordination doc |
| M Design/test/release | **CODE_READY** | 1560 width; en/no/sv/da/pl/uk/es; contract tests |

---

## Implemented vs reused

**New**
- `lib/website-kompis-appearance/*` — fail-closed adapter + validation + unit test
- `docs/platform/sql-candidates/website_kompis_appearance_settings_v1.sql` (+ `.sha256`)
- `lib/product-catalog/operational-configuration.ts` (+ test)
- Appearance page fail-closed status + install-chrome route to Connection `?section=domains`
- `docs/platform/AIPIFY_WIDGET_APPEARANCE_EDITOR_APPROVAL_READY_V1.md` (updated with SHA)
- `docs/platform/AIPIFY_APP_PRESENCE_PRODUCER_MOUNT_COORDINATION_V5.md`

**Reused**
- Domain install-config writer (`GET/PATCH /api/app/domains/website-kompis`)
- Connection summary, usage quota reads, commercial agent contracts, Bedrift hubs from #538
- Support routes (Agent 3)

---

## Agent ownership

| Concern | Owner |
| --- | --- |
| Stripe / entitlement activation / commission | Agent 1 |
| Support / public site / freeze hashes | Agent 3 |
| Live presence Core + heartbeat | Agent 4 |
| APP presentation + fail-closed adapters | Agent 2 (this) |

---

## Tests

- `lib/website-kompis-appearance/appearance-fail-closed.test.ts`
- `lib/product-catalog/operational-configuration.test.ts`

Signed-in E2E: **BLOCKED** (no authorized session). Never PASS without auth.

---

## Owner signed-in QA

1. `/app/website-kompis/appearance` — writer unavailable status; no save form  
2. Card → Connection (`?section=domains`) — edit icon/tone/welcome **variant** only if domain verified + licensed  
3. `/app/website-kompis/usage` — plan/remaining or unavailable  
4. Catalog `/app/software` without Web license; ops routes gated  
5. Support from Appearance → support requests  

---

## Combined YES packet (do not apply here)

1. Staging apply appearance SQL `docs/platform/sql-candidates/website_kompis_appearance_settings_v1.sql` SHA `6a95f4dc9f1dcd3aaf12146da914de9034a576521c16a3fc44020b7ec614f696`  
2. Staging grants + APP writer gate YES  
3. Production apply + activation YES (separate)  
4. Agent 4 presence contract + APP producer mount YES  
5. Site provision live YES  
6. Production media upload YES  
7. Stripe checkout live YES (Agent 1)  
8. Signed-in E2E session  
