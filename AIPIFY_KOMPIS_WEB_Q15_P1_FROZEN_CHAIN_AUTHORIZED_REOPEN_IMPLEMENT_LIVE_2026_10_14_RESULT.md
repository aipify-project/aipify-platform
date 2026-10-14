# AIPIFY — Q15 P1 Host-Only Platform Pricing Gate — Authorized Reopen / LIVE RESULT

**Oppgave:** Website Kompis Public Chain — Q15 P1 host-only platform pricing gate  
**Date:** 2026-10-14  
**Owner auth:** «Ja, jeg godkjenner Q15 P1-gjenåpningen»  
**Base:** `origin/main` @ `00b632b7` → PR **#203**

---

## Verdict

| Gate | Status |
|------|--------|
| Collision (already LIVE?) | **PASS** — not previously implemented |
| Narrow frozen reopen only | **PASS** — 2/46 authorized files |
| Other frozen files | **PASS** — 44/46 byte-match pre-change baseline; manifest SHAs updated for the two |
| Unit / contract tests (P1) | **PASS** |
| Pre-existing ask failures on main | **NOT INTRODUCED** (5 failures identical on `origin/main`) |
| SQL / config / license / provider / index / Bedrift | **0** |
| Paid public ask QA | **NOT RUN** (no separate cost consent) |
| Production LIVE | *(filled after merge/deploy)* |

---

## Root cause (unchanged)

Q15 returned Aipify NOK packages from `lib/marketing/public-pricing.ts` because customer-host asks with explicit Aipify pricing intent were allowed via `aipifyPublic` + `shouldAllowAipifyPlatformKnowledgeOnCustomerWebsite`. Not a cross-tenant DB leak.

---

## Exact paths changed

| Path | Role |
|------|------|
| `lib/marketing/website-kompis-public-boundary.ts` | **FROZEN** — deny `isExplicitAipifyPricingQuestion` on customer hosts (even when also matching Aipify/Kompis identity); expand pricing intent (package/plan/license/kostar) |
| `lib/marketing/public-companion-ask.ts` | **FROZEN** — `buildPublicPricingCompanionResponse` only when `!onCustomerWebsite` |
| `lib/marketing/website-kompis-public-boundary.test.ts` | Non-frozen tests |
| `lib/marketing/public-companion-ask.test.ts` | Non-frozen tests |
| `docs/integrations/website-kompis-public-chain-frozen-manifest.json` | Authorized SHA refresh for the two files |

### New file SHAs (post-change)

| File | SHA-256 |
|------|---------|
| `public-companion-ask.ts` | `4ec48ee373ab7dc11bf39f07abff0317708c89df265513517499988ae9575682` |
| `website-kompis-public-boundary.ts` | `f09e3a1c89d6efd7fb4a7dad905a222330d5c1490df197734945eb52982e1e01` |

---

## Acceptance matrix

| Case | Result |
|------|--------|
| Customer install + Q15 / Aipify pricing | **Deny** platform ladder / no `public-pricing.ts` |
| Aipify-owned assistant + same ask | **Allow** published ladder |
| Customer host FAQ (membership) | **Preserved** |
| Cross-tenant FAQ | **Preserved** (existing tests) |
| Spoofed/wrong install | Existing fail-closed paths unchanged |
| Provider fallback re-enabling pricing | Denied via boundary + `!onCustomerWebsite` short-circuit |
| Frozen 46 hash contract | **PASS** after manifest update |
| Provider cost this job | **0** |

---

## Rollback

Revert PR #203 (or restore the two frozen files + manifest SHAs to pre-change). No DB rollback.

---

## Remaining E2E

Paid Production ask / 20-Q regrade: **NOT RUN**. Do not claim 20/20 without separate owner cost consent.

---

## Next (after this job closes)

Optional: bounded paid Q15 smoke on Production. Bedrift Step B and index ingest remain separate.
