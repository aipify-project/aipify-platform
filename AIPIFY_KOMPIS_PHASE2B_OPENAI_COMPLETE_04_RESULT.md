# AIPIFY KOMPIS — PHASE 2B OPENAI COMPLETE 04 RESULT

**Oppgave-ID:** `AIPIFY.KOMPIS.PHASE2B.OPENAI.COMPLETE.04`  
**Date:** 2026-10-14  
**Job text:** `AIPIFY_KOMPIS_PHASE2B_OPENAI_FULLFOR_PR98_2026_10_10.text`  
**origin/main audited:** `8149fcc497318cfa9c49ffb44e12734e256a90eb`  

## Verdict

| Layer | Status |
|-------|--------|
| **KODE LIVE** (#98 grounded + public cost gate) | **PASS** — already MERGED / ancestor of Production |
| **Offentlig kostnadskontroll** (Core RPC + server bind) | **PASS** — applied on Core; anon cannot EXECUTE |
| **Preview/public costControls bypass** | **PASS** — no client-settable `costControls` |
| **MODELLBEVIS I TEST** (per-case real OpenAI grounded success + 20-Q baseline) | **BLOCKED** — owner credit refill not confirmed in this instruction; no new paid provider attempts |
| **FULL NETTSTEDSKUNNSKAP LIVE** | **NOT CLAIMED** — index data exists; writes gate OFF; no Production ask-write/index-enable in this job |
| Overall | **PARTIAL** — code/cost LIVE; fresh model proof not completed under this gate |

No competing PR opened. No force-push. Frozen Website Kompis Public Chain **46/46** unchanged. **#96** left **OPEN** (not merged). No secrets printed. No Stripe/billing. Migration **376** not reapplied.

---

## 1. #98 identity (current, not Oct-10 snapshot)

| Field | Value |
|-------|-------|
| PR | https://github.com/aipify-project/aipify-platform/pull/98 |
| State | **MERGED** 2026-10-10T18:51:55Z |
| Merge commit | `9fd7ef2c9e9a9faa9a6f778dda282e0f3f93f50b` |
| Head at merge | `6e710a1abce83d1f75b2f8090479ef2017ec2215` |
| Job text expected head | `5b1d6f8b` (superseded by later #98 commits before merge) |
| In current `main` | **Yes** (ancestor of `8149fcc4`) |
| Production deploys observed | `aipify` / `aipify-platform` / `aipify-platform-iz5z` @ `8149fcc4` |

Owner decision (OpenAI for Kompis; ILM audit not repeated) is respected. No new model server/training.

---

## 2. Public cost control (requirement 1)

### Runtime contract (LIVE)

| Piece | Evidence |
|-------|----------|
| Server gate | `reserveWebsiteKompisPublicAiCostControls` → RPC `reserve_website_kompis_public_ai_call` |
| Finalize | `finalizeWebsiteKompisPublicAiCostControls` → RPC `finalize_website_kompis_public_ai_call` |
| Trust bind | install/domain via `resolveWebsiteKompisPublicInstallDomainTrust` (server) |
| Public ask | After reserve success, grounded completion uses server `costControls: "off"` so APP `auth.uid()` metering RPCs are **not** used for anonymous embed |
| Fail-closed | Missing RPC / untrusted bind / service_role failure → **0 provider fetch** |

### Core Production (`qbcqoixhrvhnuwphefvw`) — read-only

| Check | Result |
|-------|--------|
| Ledger `20261937700000` | **Present** |
| Functions | Both RPCs exist, `SECURITY DEFINER` |
| EXECUTE grants | `service_role=true`; `anon`/`authenticated`=**false** |
| Reservation statuses | success **107** · provider_error **56** · skipped **22** · fallback **19** |
| Budget windows | Active hourly rows (e.g. reserved_count/call_count present; recent windows through 2026-10-13) |

### Repo SQL note (stale header)

File `supabase/migrations/20261937700000_website_kompis_public_ai_cost_controls_v1.sql` still says **PROPOSAL ONLY — NOT APPLIED**. That header is **stale relative to Core**: ledger + functions + reservation rows prove apply already happened (outside this job).  

SHA-256 (repo bytes today): `b4319e34cc804e14358b765a1def549b198c982f932f87e1d6e83629494937d6` · **9517** bytes.

**No new schema proposal required** for public reserve/finalize — contract exists.  
**No schema apply** performed in this job.

Unit tests (mock / source guards): `website-kompis-public-ai-cost-controls.test.ts` **PASS**; `website-kompis-grounded-answer.test.ts` **PASS**; `provider-http-error.test.ts` included in run **PASS**.

---

## 3. Preview / diagnostic bypass (requirement 2)

| Control | Status |
|---------|--------|
| `ALLOWED_REQUEST_KEYS` excludes `costControls` | **PASS** (asserted in unit test) |
| Public ask hardcodes post-reserve path; no query/body/browser off-switch | **PASS** (frozen source) |
| `testHarnessAllow` only when `NODE_ENV=test` | **PASS** |
| Preview SSO alone is not a cost limit | **PASS** (public RPC gate required) |
| Provider request IDs stripped from public Preview diagnostics | **PASS** (shipped in #98 head) |

Preview binds to shared Core (same project). This job did **not** open a Preview path that writes conversation/index to Production beyond existing public ask metering already in Core.

---

## 4. Credit / timing (requirement 3)

| Item | Status |
|------|--------|
| Owner credit refill confirmed in this `.text` | **No** (“Påfyll er ennå ikke bekreftet”) |
| New paid provider smoke (≤3 attempts / 120s) | **NOT RUN** (instruction) |
| Vercel `OPENAI_API_KEY` | **Present** on Preview + Production (sensitive; value not read/printed) |
| Local `.env*` OpenAI binding | **Absent** in this worktree |
| Historical Core `provider_error` rows | **56** — consistent with earlier quota/billing failures; not re-probed |

No retry loop against billing/quota. No parallel full baseline against a blocked provider.

---

## 5. Real grounded model evidence (requirement 4)

| Gate | Status |
|------|--------|
| Fresh embed→ask→retrieval→provider→answer/sources case log | **NOT RUN** |
| ≥20 real-model baseline with follow-ups / multilingual / injection / isolation | **NOT RUN** |
| HTTP 200 / extractive FAQ alone counted as grounded-success | **No** (not claimed) |
| Fixture/oracle baseline `website-kompis-grounded-baseline.test.ts` | **FAIL locally 9/20** on current `main` — **mock/oracle**, not live model proof; not used as merge evidence |
| Browser desktop/mobile / Safari | **NOT RUN** / Safari **unverifisert** |
| Core reservation `success=107` | Operational metering only — **not** a substitute for per-case answer/source validation |

**BLOCKED FOR OWNER:** confirm OpenAI org/project credit for the **existing** API key binding, then authorize a dedicated model-proof job (isolated fixtures; max provider budget; no Production index write).

---

## 6. Merge / LIVE gates (requirement 5)

| Gate | Outcome |
|------|---------|
| Public cost without operator login | **PASS** (service_role RPC after trust) |
| Bad install/host/budget/control → 0 provider | **PASS** (fail-closed design + unit coverage) |
| Public cannot set diagnostic cost bypass | **PASS** |
| Real model + browser baseline | **FAIL / NOT RUN** → blocks “complete” claim |
| #97 regressions / frozen chain | Frozen **46/46 MATCH**; #97 left alone |
| #96 merge | **NOT DONE** (#96 still OPEN) |
| Unauthorized schema/config/secret/billing/index | **None by this job** |

Because #98 is already merged and cost/code gates are green, this job **does not** open a remediation PR against frozen runtime files. Remaining gap is **model proof under credit confirmation**, not another silent merge of mocked AI.

Status labels (mandatory distinction):

- **KODE LIVE** — yes  
- **MODELLBEVIS I TEST** — no (this job)  
- **FULL NETTSTEDSKUNNSKAP LIVE** — no  

Site index inventory (RO): documents **212** · chunks **839** · crawl_runs **1**.  
Production env `AIPIFY_PUBLIC_SITE_INDEX_WRITES_ENABLED=false` (write gate closed).

---

## 7. Schema proposal

**None new.** Public AI cost V1 is already on Core. Stale “NOT APPLIED” comment in the migration file should be cleaned only under an explicit docs/comment job (do not rewrite applied SQL casually; do not touch frozen TS).

---

## 8. Recommended next job (do not start here)

**Exact owner scope for next controlled job:**

1. Confirm credit on the Vercel-bound OpenAI project for existing `OPENAI_API_KEY` (no new key).  
2. Authorize ≤3 smoke + then bounded real grounded baseline (fixtures only; wall-clock + attempt caps; no Production crawl/index-enable).  
3. Deliver per-case PASS/FAIL with answers/sources/model mode.  
4. Separately: controlled public site-index ingest/rollout job if product completeness requires it — **not** started by this RESULT.

---

## Confirmations

- No unauthorized billing / config write / migration apply / Production ingest / index-enable / #96 merge.  
- No Website Kompis Public Chain file edits (46/46 hash match).  
- No UnoNight hardcoding in Core.  
- No secrets or PII in this report.
