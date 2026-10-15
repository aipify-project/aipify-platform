# AIPIFY — KOMPIS BEDRIFT D2N — CORE IDENTITY COLLISION READ-ONLY RESOLUTION V1 — RESULT

| Field | Value |
|---|---|
| **Verdict** | **PASS (RO evidence complete) — STOP for owner identity decision** |
| Worktree | `/Users/veltrix/Development/aipify-bedrift-d2m-internal-sandbox-enablement-contract-v1` |
| Branch / HEAD | `feat/kompis-bedrift-d2m-internal-sandbox-enablement-contract-v1` @ `f885adb3` |
| `origin/main` | `04acab2a` (branch ahead with D2M commit; dirty: none for this job) |
| Core | `qbcqoixhrvhnuwphefvw` — **READ-ONLY only** |
| PR #220 | **OPEN** · not merged · head `f885adb3` · mergeable_state `unstable` · **not merged / SQL not applied** |
| Frozen WK | **46/46** |
| Step B stash | **intact** |
| SQL / tenant / invite / grant / helper | **0 writes** |

---

## 1. Fact table

| # | Claim | Status | Evidence |
|---|---|---|---|
| F1 | Brreg enhet `937978960` is **AIPIFY GROUP AS** | **VERIFIED** | Official Brreg API `GET /enhetsregisteret/api/enheter/937978960` → `navn=AIPIFY GROUP AS`, AS, Bergen |
| F2 | Owner-stated sandbox orgnr `937978960` matches registry for Aipify Group AS | **VERIFIED** | F1 + aipify.ai company page org. no. |
| F3 | Core ordinary customer with `organization_number='937978960'` exists | **VERIFIED** | RO SQL: exactly **1** row |
| F4 | That row is the Web pilot: `slug=unonight`, display name Unonight, `environment_type=pilot`, `status=active`, `country=NO` | **VERIFIED** | RO SQL (customer id redacted in narrative; present in Core) |
| F5 | That row’s name/slug do **not** match registry name for `937978960` | **VERIFIED** | F1 vs F4 |
| F6 | Create RPC still raises `DUPLICATE_ORGANIZATION_NUMBER` on colliding NO orgnr | **VERIFIED** | Live function def contains that exception; duplicate scan is country-aware, ordinary (non-platform) customers |
| F7 | Candidate slug `aipify-internal-bedrift-demo` is free | **VERIFIED** | RO SQL |
| F8 | Separate Core row `slug=aipify-group` exists with `organization_number=null`, linked to **platform** company `aipify` (`is_platform=true`) | **VERIFIED** | RO SQL — this is **not** the orgnr holder and is **not** an ordinary sandbox tenant |
| F9 | Correct registry orgnr for the Web pilot legal entity | **UNVERIFIED** | Brreg name search `Unonight` → 0 hits; do **not** invent or assign a substitute number in this job |
| F10 | D2M exception SQL applied? | **No** | Helper `_platform_portal_internal_demo_bedrift_entitlement_authorized` **absent**; file SHA still `546723f1…af393` in repo only |
| F11 | Internal create / demo Bedrift usable today? | **No (fail-closed)** | Create helper `false`; demo helper missing; exposure triggers still block subscriptions/license links/domains/installs for `internal`; commercial Bedrift activate still needs subscription |

---

## 2. Collision evidence (minimum, redacted)

**Why collide?**

Core stores `customers.organization_number = '937978960'` on the **Web pilot** ordinary customer (`slug=unonight`).  
Registry and Aipify public company identity assign that same number to **AIPIFY GROUP AS**.  
Therefore a future create of Aipify Group AS / `937978960` hits Core uniqueness (`DUPLICATE_ORGANIZATION_NUMBER`) against the pilot row — **not** a join/proxy illusion.

| Field | Web pilot row (holder of orgnr) | Registry for `937978960` | Platform `aipify-group` row |
|---|---|---|---|
| Orgnr in Core | `937978960` | N/A (external) | `null` |
| Display / slug | Unonight / `unonight` | AIPIFY GROUP AS | Aipify / `aipify-group` |
| Company | ordinary, `is_platform=false` | — | **platform** `aipify` |
| Env | `pilot` | — | `customer` |

**Root-cause class (for owner review):**  
**Unresolved identity-integrity conflict** — Core pilot `organization_number` conflicts with authoritative registry binding of that number to Aipify Group AS. This job does **not** decide which historical write introduced the bad value, and does **not** mutate the pilot.

---

## 3. Safe resolution options (no write in D2N)

| Option | What it would do (later named job only) | Implications | Owner approval required |
|---|---|---|---|
| **A — Correct pilot orgnr (preferred class)** | Platform/Core **identity correction** on the Web pilot customer: set `organization_number` to the pilot’s **owner+registry verified** number; leave slug, domains, installs, Website Kompis, membership, licenses untouched | Frees `937978960` for a later Aipify Group AS internal sandbox create; preserves pilot product surface | Explicit YES naming customer id, current orgnr, new orgnr, Core project, and “identity correction only” |
| **B — Different sandbox legal entity** | Create sandbox under another **verified** orgnr/name (not Aipify Group AS / 937978960) | Avoids touching pilot; abandons stated sandbox identity | Explicit YES with new verified identity |
| **C — Stop sandbox using this orgnr** | Do not create internal Bedrift demo under `937978960` until A is done | Safest short-term; no product path | Decision to pause |

**Forbidden (do not approve as shortcuts):**

- Bypass `DUPLICATE_ORGANIZATION_NUMBER` / fake orgnr  
- Transfer or convert the Web pilot into Kompis Bedrift / internal sandbox  
- Reuse platform `aipify-group` / `is_platform` company as the sandbox tenant  
- Silent helper / Platform flag flips, D2M SQL apply, invites, or grants “to unblock”

---

## 4. Fail-closed status (unchanged by D2N)

| Control | State |
|---|---|
| Internal create helper | `false` |
| D2M demo Bedrift exception SQL | **Not applied** (planned only) |
| Subscriptions / license links / domains / installs for `internal` | Blocked by D2L triggers |
| Commercial Bedrift activate | Still requires healthy subscription → blocked for internal without exception+helper |
| Stripe / public website / sandbox LIVE claim | **Not enabled / not claimed** |

---

## 5. Answers to mandate questions

**(a) Why does orgnr 937978960 collide with the Web pilot?**  
Because that exact value is stored on the ordinary Core customer `slug=unonight`. Create uniqueness treats it as taken. Registry says the number belongs to AIPIFY GROUP AS — so the conflict is a Core identity-field mismatch, not a missing row for Aipify Group AS.

**(b) Which legal identity is independently verified?**  
**AIPIFY GROUP AS = 937978960** — verified via Brreg API.  
Web pilot’s **correct** registry number — **UNVERIFIED** in this job.

**(c) What precise safe owner choice is needed before writing anything?**  
Choose **A**, **B**, or **C** above. Recommended class: **A** only after owner supplies/confirms the pilot’s true Brreg orgnr in a **separate** named identity-correction YES. Do **not** proceed to D2M SQL apply, sandbox create, invite, or helper flip until the collision strategy is chosen.

---

## OWNER YES/NO — next single decision

Pick **one** (reply with the option letter and any required numbers):

1. **Option A prep:** Provide/confirm the Web pilot’s correct Norwegian organization number from Brreg (this packet will not invent it). Then a later job can ask for a verbatim identity-correction YES.  
2. **Option B:** Name a different verified legal identity for the internal sandbox.  
3. **Option C:** Pause sandbox create on `937978960` until A is resolved.

**Not authorized by this RESULT:** D2M SQL apply, PR #220 merge, helper flips, sandbox create, admin invite, Bedrift grant, or any UnoNight product mutation.

**STOP.**
