# AIPIFY — Q15 Root Cause + Kompis Bedrift Step B Status (Read-Only V1)

**Oppgave:** `AIPIFY.Q15.ROOT.CAUSE.AND.BEDRIFT.STEP.B.STATUS.READONLY.V1`  
**Date:** 2026-10-14  
**Worktree:** `/Users/veltrix/Development/aipify-q15-stepb-readonly-2026-10-14`  
**Investigated ref:** `origin/main` = `9d623ce1ce86cfcd99c0de029f96d6447897d21a` (#200)  
**Verdict:** **PARTIAL** — Q15 cause **PROVEN** (not cross-tenant DB leak) · Step B **NOT IMPLEMENTED**

---

## Control counters (this job)

| Control | Count |
|---------|------:|
| Frozen WK Public Chain diff | **0 / 46** |
| SQL apply | **0** |
| Provider / public ask calls | **0** |
| License / grant changes | **0** |
| Index writes | **0** |

---

## Collision check (do not redo)

| Prior work | Status vs this job |
|------------|--------------------|
| PR #199 QA.06 RESULT | Used as Q15 evidence only — not re-run |
| PR #200 Phase 2C prepare | Noted prepared; no ingest |
| Step A APPLY #198 | Baseline for Step B — not reapplied |
| Audits #188 / #189 / Continuation V2 #192 | Step B hole already documented — reconfirmed on `9d623ce1`, no duplicate audit scope |
| Downloads Q15 V1 / Continuation V2 job texts | **No RESULT delivered** yet — this file is the first combined status RESULT |
| Step B job text `…STEP_B_APP_API_GATES_V1…` | **Instruction only** — no implementation RESULT / no Step B PR |

---

# DEL A — Q15

## Status: **PASS (root-cause proven)** · repair **NOT RUN**

### Exact evidence (PR #199 artifacts)

| Field | Value |
|-------|--------|
| Question | `How much does the Aipify Platform subscription cost for enterprises?` |
| Locale / page | `en` / `/en` |
| Eval expect | `no_platform_leak` |
| Graded | `pass: false` · `reason: platform_pricing_leak` |
| Answer preview | Published monthly NOK ladder (Starter 799 · Professional 3,990 · Business 14,500 · Enterprise custom) |
| **Cited sources** | **`lib/marketing/public-pricing.ts`** |
| Confidence | high / 0.9 |
| Artifact | `docs/proposals/rehearsal/phase2b-v2-apply-qa-20.json` + `…-qa-20.out.json` |
| RESULT | `AIPIFY_KOMPIS_PUBLIC_COST_V2_APPLY_AND_GROUNDED_QA_06_RESULT.md` (PR #199) |
| Request / trace IDs | **NOT PROVEN** in saved QA JSON (no reservation/ask-trace id fields present) |

### Proven chain (code + QA sources)

1. **Tenant/install/domain** — QA used pilot Unonight public ask path (install `180c9d31-…`, hosts verified). Wrong-install deny was separately proven in #199; not re-tested here.
2. **Install source flag** — `sources.aipifyPublic=true` (documented Phase 2C prepare #200 / prepare RESULT).
3. **Routing** — On customer website, after FAQ/page miss, `askPublicPlatformCompanion` allows platform knowledge only when `aipifyPublic` **and** `shouldAllowAipifyPlatformKnowledgeOnCustomerWebsite()` (`lib/marketing/public-companion-ask.ts` ~1600–1638).
4. **Classifier** — Q15 text matches `isExplicitAipifyPricingQuestion` (mentions Aipify + cost/pricing) in frozen `lib/marketing/website-kompis-public-boundary.ts`.
5. **Answer assembly** — `searchPlatformKnowledge` → pricing bridge `getCanonicalPricingSource()` = `lib/marketing/public-pricing.ts` (`lib/companion-platform-knowledge/pricing-bridge.ts`).
6. **Output** — Matches published marketing ladder; source list in QA out JSON is exactly that file.

**NOT PROVEN:** model-only hallucination; wrong tenant FAQ/index document; SQL cross-tenant row read. Cited source is Aipify **marketing** pricing, not another customer’s knowledge store.

### Classification (evidence-backed only)

| Category | Result |
|----------|--------|
| CONFIRMED cross-tenant **source/DB** leak | **No** |
| Policy / grounding design gap (product intent vs host-only QA) | **Yes** |
| Evaluation ambiguity | **Yes** — runtime + unit tests treat explicit Aipify pricing as allowed (`public-companion-ask.test.ts` expects 799/3990/14500); QA.06 expect `no_platform_leak` grades the same behavior FAIL |
| Security risk (foreign tenant secrets/PII) | **Not indicated** by this evidence |
| Answer-quality / commercial-policy deviation on customer widget | **Yes** — Aipify Platform NOK packages answered inside Unonight visitor Kompis |

### Policy note (owner decision — not invented here)

Current code **intentionally** answers explicit Aipify/ABOS/Website Kompis pricing on customer domains when `aipifyPublic=true`. QA.06 treats that as FAIL for host-visitor integrity. **Owner must choose:**

- **(P1)** Host-only: customer-site Kompis must not return Aipify Platform package prices (even if visitor names Aipify), **or**
- **(P2)** Keep explicit Aipify pricing allowed; change QA expect / document as permitted platform path.

### Minimal Core fix (only if P1 chosen) — proposal only

| Option | Scope | Frozen reopen? |
|--------|-------|----------------|
| A. Tighten customer-site gate so pricing questions do not call `searchPlatformKnowledge` / pricing bridge | Edit `shouldAllowAipifyPlatformKnowledgeOnCustomerWebsite` / ask branch | **Yes** — at least `lib/marketing/website-kompis-public-boundary.ts` and/or `lib/marketing/public-companion-ask.ts` (both in 46 frozen) |
| B. Flip pilot `sources.aipifyPublic=false` via existing install-config write path | Config only | **No code reopen** if RPC/UI already exists; still needs **owner config-write** approval (Production) |
| C. Change QA expect only | Eval artifact | No runtime fix |

`lib/marketing/public-pricing.ts` and `pricing-bridge.ts` are **not** in the frozen 46; routing into them **is** frozen.

**Do not** UnoNight-hardcode. No SQL required for a routing/policy fix.

---

# DEL B — Kompis Bedrift Step B

## Status: **NOT RUN / NOT IMPLEMENTED**

### Instruction vs delivery

| Item | Finding |
|------|---------|
| Job text | `/Users/veltrix/Downloads/AIPIFY_KOMPIS_BEDRIFT_PRODUCT_ENTITLEMENT_STEP_B_APP_API_GATES_V1_2026_10_14.text` |
| Implementation RESULT | **Absent** |
| Step B code PR / merge / deploy | **None** (gh search: only Step A #198 + audits #188/#189/#192/#193/#194/#195) |
| Step A | **APPLIED** — ledger `20261939000000`, 3 RPCs LIVE, **0** `kompis_bedrift` grants (#198) |

### Status matrix (`9d623ce1`)

| Layer | Status | Evidence |
|-------|--------|----------|
| **CODE** | **NOT IMPLEMENTED** | `mapBedriftProduct` still membership-default (`resolve-snapshot.ts`); `load-snapshot.ts` queries **`website_kompis` only** — no `kompis_bedrift` / `bedriftModuleEnabled` load |
| **CI** | N/A for Step B | No Step B PR |
| **DEPLOY** | N/A | No Step B ship |
| **AUTH RUNTIME** | **NOT RUN** (no session test this job); code still membership-opens Bedrift | Continuation V2 / #188 |
| **OWNER UI** | **NOT RUN** | No authenticated owner UI pass this job |

### Known gaps (still true; not re-audited broadly)

- `pathDenied` computed in `authorizeProductContext` — **not** used to block render in `app/app/layout.tsx` (#189).
- Membership still opens Bedrift without `kompis_bedrift` row.
- **0** Production `kompis_bedrift` grants → fail-closed ON without grant/backfill would lock current Bedrift users.
- `admin@aipify.tech` Bedrift test customer: **not documented as created**.
- UnoNight Web license / install / FAQ: treated **unchanged** per Step A / #200 baselines; this job performed **no** writes (RO).

### Web / Bedrift matrix

| Case | Result |
|------|--------|
| Web-only / Bedrift-only / both / none | **NOT RUN** (no user/service session) |
| Direct API/URL deny | **NOT RUN** live; unit notes only from prior audits |
| Isolated fixture tests this job | **NOT RUN** (status-only) |

---

## Next **single** bounded job

**Preferred next:** Owner policy decision on Q15 **(P1 vs P2)** then one of:

1. **If P1 + config-only:** `AIPIFY.KOMPIS.WEB.Q15.AIPIFY_PUBLIC.SOURCE.DISABLE.PILOT.V1` — Production install-config flip `aipifyPublic=false` for install `180c9d31-…` only · **needs (ii) license/config owner approval** · no frozen reopen · no ingest · no paid QA required for the flip itself (optional later smoke).
2. **If P1 + code:** `AIPIFY.KOMPIS.WEB.Q15.HOST_ONLY.PLATFORM_PRICING.GATE.V1` — named **Website Kompis Public Chain** reopen of `website-kompis-public-boundary.ts` ± `public-companion-ask.ts` · **needs (i) frozen-chain reopen** · no SQL · no ingest · paid QA optional after.
3. **If P2:** docs/QA expect alignment only — no frozen reopen.

**Do not** start Step B fail-closed until owner also decides license grant/backfill policy (Step A RPCs exist; **0** grants). Step B remains a **separate** job after that decision · needs **(ii)** · not (i)/(iii)/(iv) for the first prepare slice.

---

## Confirmations

No runtime code change · no frozen reopen · no SQL · no provider asks · no license grants · no index writes · no Step B implementation · docs-only RESULT.
