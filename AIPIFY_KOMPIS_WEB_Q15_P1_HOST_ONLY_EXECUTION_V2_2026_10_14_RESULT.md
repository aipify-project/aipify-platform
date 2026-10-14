# AIPIFY — Kompis Web Q15 P1 Host-Only Execution V2 RESULT

**Oppgave:** `AIPIFY.KOMPIS.WEB.Q15.P1.HOST_ONLY.EXECUTION.V2`  
**Date:** 2026-10-14  
**Worktree:** `/Users/veltrix/Development/aipify-q15-p1-host-only-v2`  
**origin/main:** `00053b964b96e0aaa1708d6325563dce7c3b36ce` (#201)  
**P1 LIVE?** **No** — **BLOCKED** before change (frozen Public Chain required)

---

## Scorecard

| Gate | Status |
|------|--------|
| Collision: P1 already implemented/verified | **PASS (absent)** — no P1 code PR; only root-cause docs #201 |
| Map canonical `aipifyPublic` resolve | **PASS** |
| Customer vs Aipify-own assistant impact | **PASS** (mapped) |
| Ordinary non-frozen code fix | **BLOCKED** — not possible for generic P1 |
| Frozen 46/46 diff | **0 / 46** (no edits) |
| SQL / license / Production config / provider / index / cost V2 | **0** |
| Contract tests / merge LIVE | **NOT RUN** (blocked before implement) |
| Real model QA | **NOT RUN** (not authorized; not claimed) |

---

## 1. Collision

| Check | Result |
|-------|--------|
| P1 implementation PR/commit | **None** |
| Prior RESULT | Root cause only: `docs/audits/AIPIFY_Q15_ROOT_CAUSE_AND_BEDRIFT_STEP_B_STATUS_READONLY_V1_RESULT.md` (#201) |
| Bedrift Step B | Untouched (separate) |

---

## 2. Canonical `aipifyPublic` (no Production mutation)

| Layer | Fact |
|-------|------|
| Install source key | `sources.aipifyPublic` (default **true** in frozen `website-kompis-install-config.ts` + Core install-config RPCs) |
| Public ask resolve | `getWebsiteKompisInstallConfigForPublicRequest` → used in frozen `public-companion-ask.ts` |
| Customer-site gate | `allowAipifyPlatformKnowledge = !onCustomerWebsite \|\| shouldAllowAipifyPlatformKnowledgeOnCustomerWebsite(...)` |
| Pricing short-circuit | If `isPublicPricingQuestion` **and** `allowAipifyPlatformKnowledge` → `buildPublicPricingCompanionResponse` → source `lib/marketing/public-pricing.ts` |
| Q15 match | Explicit Aipify + cost → `isExplicitAipifyPricingQuestion` **true** → allow **true** on customer host when `aipifyPublic=true` |

**Without frozen code / SQL / Production writes:** cannot change global or class-wide host-only pricing behavior. Per-install `aipifyPublic=false` would require **Production config writes**, would disable **all** Aipify-platform knowledge on that host (not prices-only), and is **not** a generic all-customer Core fix.

---

## 3. Impact map (P1 intent)

| Surface | Desired P1 | Today |
|---------|------------|--------|
| Customer Website Kompis (all installs) | No Aipify Platform package NOK ladder as external product info | Returns ladder for explicit Aipify pricing asks |
| Host FAQ / index / currentPage | Keep | Unchanged by this job |
| Aipify-owned public assistants (`onCustomerWebsite=false`) | Keep Aipify pricing/policy | Still allowed via `allowAipifyPlatformKnowledge=true` |
| Cross-tenant DB | N/A | Still **not** proven as Q15 class |

---

## 4. Why ordinary non-frozen code cannot ship P1

| Candidate | Frozen? | Why insufficient |
|-----------|---------|------------------|
| `website-kompis-public-boundary.ts` (`shouldAllow…` / `isExplicitAipifyPricingQuestion`) | **Yes** | Owns customer-site allow for Aipify pricing |
| `public-companion-ask.ts` (pricing short-circuit + platform search fallback) | **Yes** | Emits `public-pricing.ts` responses |
| `website-kompis-install-config.ts` (default `aipifyPublic`) | **Yes** | Broad flag; not prices-only |
| `public-pricing.ts` / `pricing-bridge.ts` / `search.ts` | Open | No customer-vs-Aipify host signal; blanking prices would break Aipify-owned assistants |
| Production `aipifyPublic=false` | Config write | Needs separate owner approval; not generic; not prices-only |

**Conclusion:** Generic P1 (all customer installs, prices-only, preserve Aipify-own assistants) **requires named Website Kompis Public Chain reopen**. Per job §8 → **STOP before any edit**.

---

## 5. Exact approval request (do not imply reopen)

**Name:** `Website Kompis Public Chain — Q15 P1 host-only platform pricing gate`

**Proposed frozen reopen (minimal):**

1. `lib/marketing/website-kompis-public-boundary.ts` — on customer websites, do **not** treat explicit Aipify **pricing** as allowed platform knowledge (support/identity patterns may remain per owner detail).
2. `lib/marketing/public-companion-ask.ts` — ensure customer-host path cannot short-circuit to `buildPublicPricingCompanionResponse` / platform pricing for those asks; host evidence or honest gap instead.
3. Neighbouring **non-frozen** tests only (e.g. `public-companion-ask.test.ts`, `website-kompis-public-boundary.test.ts`) — align expectations: customer host Q15-class → no `public-pricing.ts` / no 799–14500 ladder; Aipify-own surface still may.

**Out of reopen:** other 44 frozen files · SQL · Cost V2 · index · Bedrift · UnoNight hardcoding.

**Rollback:** revert the two files + tests to pre-change SHA; no DB rollback.

**Expected tests (after approval):** deterministic fixture asks — customer install + Q15-class → gap/host sources only; Aipify marketing ask → pricing OK; wrong install 401/403 unchanged; no paid model required for unit gate.

**Not requested here:** Production `aipifyPublic` flips · paid 20-Q · Step B.

---

## 6. Confirmations

Frozen diff **0/46** · SQL **0** · provider **0** · license/config Production **0** · index **0** · Cost V2 untouched · no runtime PR · Bedrift Step B not started.

**P1 status:** **BLOCKED** (awaiting named frozen-chain reopen) — not LIVE, not prepared-as-code.
