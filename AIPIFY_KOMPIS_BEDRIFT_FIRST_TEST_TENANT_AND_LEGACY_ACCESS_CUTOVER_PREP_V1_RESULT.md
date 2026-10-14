# AIPIFY — Kompis Bedrift First Test Tenant & Legacy Access Cutover Prep V1 RESULT

**Oppgave:** `AIPIFY.KOMPIS.BEDRIFT.FIRST.TEST.TENANT.AND.LEGACY.ACCESS.CUTOVER.PREP.V1`  
**Date:** 2026-10-14  
**Worktree:** `/Users/veltrix/Development/aipify-bedrift-cutover-prep-v1`  
**origin/main baseline:** `d577b995bf204e6cc8c3119ed1c1c660b56f9f4b` (#205)  
**Core:** `qbcqoixhrvhnuwphefvw` (read-only)  
**Overall:** **PASS (prep only)** — decision objects ready · **STOP** before all Production writes  
**Not claimed:** tenant created · license activated · Step B LIVE

---

## Control counters

| Control | Count / status |
|---------|----------------|
| SQL / license / tenant / auth writes | **0** |
| Step B stash apply / merge | **0** (stash preserved) |
| Frozen WK Public Chain | **46 / 46** SHA match · **0** diff |
| Paid AI / index ingest | **0** |

---

## A. Repo baseline · PR overview · Platform API/UI status

### Baseline

| Item | Value |
|------|--------|
| HEAD | `d577b995` |
| Step B runtime on main | **NOT LIVE** — membership-default Bedrift remains |
| Step B stash | `stash@{0}: step-b-wip-blocked-not-for-merge` in worktree `aipify-step-b-product-routing-v1` — **not** proof of delivery; **not** touched this job |

### PR status (verified)

| PR | State | Role vs this prep |
|----|-------|-------------------|
| #198 Step A APPLY | MERGED | Core RPCs LIVE · empty backfill |
| #201 Q15 + Step B RO | MERGED | Step B NOT IMPLEMENTED (historical) |
| #203 Q15 P1 | MERGED LIVE | Frozen chain closed again |
| #204 Test-tenant prep | MERGED docs | Gaps: no Platform activate HTTP; `admin@aipify.tech` absent |
| #205 Step B BLOCKED RESULT | MERGED docs | Fail-closed cutover stopped for empty grants |
| Platform STATUS/ACTIVATE API/UI | **NOT FOUND** on main · **no** open PR · Downloads job text absent | **BLOCKED** for safe Platform HTTP activate |

### Platform `kompis_bedrift` HTTP/UI (re-verified on `d577b995`)

| Capability | Status |
|------------|--------|
| Core RPC `get_…_kompis_bedrift_status(uuid)` | **VERIFIED LIVE** |
| Core RPC `activate_…(uuid, text, boolean, text)` · `bpk-` idempotency · confirmation | **VERIFIED LIVE** |
| Core RPC `deactivate_…` | **VERIFIED LIVE** |
| `app/api/platform-portal/**` status/activate routes | **MISSING** |
| Platform UI panel for Bedrift activate | **MISSING** |
| Server auth / audit / idempotency in APP layer | N/A until thin Platform client exists |

**Do not** treat ad-hoc SQL RPC as approved Platform flow without a separate named owner authorization.

### Create / license paths (still valid; no writes)

| Step | Artifact | Creates auth/invite? |
|------|----------|----------------------|
| Create customer | `POST /api/platform-portal/customers` → `create_platform_portal_customer` | **No** |
| License/agreement | `POST …/customers/[id]/licenses` → `create_platform_portal_customer_license` | **No** |
| Team invite UI | `inviteSoon` | **Not wired** |
| Core invite RPC | `invite_organization_user` (legacy) | Exists; Platform/APP wire-up **NOT VERIFIED** as production-ready |

---

## B. Who can use Bedrift today (RO · aggregated)

### Membership-access vs product license

| Dimension | Finding |
|-----------|---------|
| Canonical Bedrift license rows (`kompis_bedrift`) | **0** platform-wide |
| Membership-default APP Bedrift chrome | **OPEN** for org members with usable membership/license plane (`mapBedriftProduct`) |
| `employee_knowledge` as Bedrift license | **Forbidden / not used** — present on UnoNight only; **≠** `kompis_bedrift` |
| `pathDenied` | Computed · **unused** in `app/app/layout.tsx` |
| EKE APIs | Auth user only · **no** product gate |

### Non-platform companies (anonymized)

| Slug (ops ref) | App users | `website_kompis` | `kompis_bedrift` | `employee_knowledge` |
|----------------|----------:|:----------------:|:----------------:|:--------------------:|
| `unonight` | **5** | yes | **no** | yes |
| `my-company-1` | **1** | no | no | no |
| `website-verification-staging-3e04914c` | **0** | no | no | no |

**Totals:** non-platform companies **3** · customers **3** · WK-enabled tenants **1** · EKE-enabled tenants **1** · Bedrift grants **0**.

### Activity vs capability

| Signal | Value | Interpretation |
|--------|------:|----------------|
| `employee_knowledge_items` | **0** | No stored EKE knowledge content |
| `employee_knowledge_audit_logs` | **2** | Minimal audit noise — **not** proof of active Bedrift product operations |
| Bedrift page / EKE API hit analytics | **NOT VERIFIED** | No product-usage telemetry required for this prep |

**Impact if Step B fail-closed ships with 0 grants (estimated):**

| Cohort | Effect |
|--------|--------|
| UnoNight (5 users) | Lose Bedrift switcher/routes/API · **intended** for Web-only reference |
| `my-company-1` (1 user) | Lose membership-opened Bedrift chrome (no WK/EKE/Bedrift modules) |
| Staging (0 users) | No active human impact |
| Future paying Bedrift customers | **None yet** (0 grants) |

**Legitimate Bedrift license holders to grandfather:** **none** found (0 grants).  
**Legitimate Web customers mis-shown Bedrift:** UnoNight (primary).  
Active product usage beyond UI capability: **NOT VERIFIED** (content empty; audit tiny).

---

## C. UnoNight Web-only invariants · FAQ · frozen chain

| Invariant | Status |
|-----------|--------|
| `website_kompis` licensed+enabled | **VERIFIED** |
| `kompis_bedrift` row | **ABSENT** |
| `employee_knowledge` | Present — **not** Bedrift license |
| Install `180c9d31-3340-4633-b210-3b64edf1e1be` | **active** |
| Verified domains | `unonight.com`, `www.unonight.com` |
| Published public-safe FAQ | **5** |
| Frozen WK 46 SHA | **46/46** · **0** diff |
| Q15 P1 / pricing / Public Chain edits this job | **0** |

---

## D. New Bedrift test tenant plan (not executed)

**Working title:** Aipify Bedrift Test · suggested slug `aipify-bedrift-test` (confirm uniqueness at execute).  
**Admin:** `admin@aipify.tech` — auth count today **0**.  
**Product intent:** `kompis_bedrift` **only** · **no** `website_kompis` by default · **never** reuse UnoNight.

No `customer_id` / `company_id` invented before create.

### Ordered mutations — each needs its own owner approval text

| Gate | Action | Prerequisite | Forbidden without gate |
|------|--------|--------------|------------------------|
| **D1** | Platform create customer (legal name, display, slug, country, org#) | Exact payload in owner text | Guessing identity · UnoNight mutate |
| **D2** | Create agreement/license so status RPC `eligible=true` | D1 `customer_id` | Activate before healthy agreement |
| **D3** | Create/invite `admin@aipify.tech` as **owner** on **new** company only | Named auth/invite procedure (Platform API **or** approved Core invite path) | Reuse existing tenant · silent auth create |
| **D4** | Activate `kompis_bedrift` for **that** `customer_id` only | Safe Platform HTTP/UI **or** separately named platform-admin RPC call with `p_confirmation=true`, reason, `bpk-…` | Activate UnoNight · blanket grants |
| **D5** | Verify status `active=true` · audit row · UnoNight still **0** Bedrift | D4 | Claim E2E complete |

**Blocking gap for D4:** Platform STATUS/ACTIVATE API/UI still **MISSING** → either ship that job first, or owner names an exact one-shot RPC procedure.

---

## E. Legacy cutover / backfill policy options (no auto grants)

| Option | Description | Customer impact | When Step B may LIVE |
|--------|-------------|-----------------|----------------------|
| **E1 — Hard cutover (recommended given evidence)** | Ship Step B fail-closed with **0** grants; no grandfather list | UnoNight + any membership-only Bedrift chrome disappear · **aligned** with Web-only pilot | After D1–D5 test tenant **or** after owner accepts “no Bedrift until activate” |
| **E2 — Named grandfather** | Owner lists exact `customer_id`s to activate before Step B | Only listed tenants keep Bedrift | After those activates + regression |
| **E3 — Defer Step B** | Keep membership-default until ≥1 Bedrift customer sold/activated | Status quo UI leak continues | After policy + activates |

**No blanket grants. No automatic backfill SQL.**  
Estimated interruption under **E1:** ≤6 app-user seats across 2 non-empty orgs; **0** licensed Bedrift holders lose a paid product. Customer communication: optional calm note that Bedrift appears only when licensed (Enterprise Design tone).

**Owner must pick E1 / E2 / E3 in a dedicated approval text before Step B LIVE.**

---

## F. Step B resume plan (from preserved stash — not this job)

After **D4/D5** (or E1 acceptance) + cutover choice:

1. Restore stash `step-b-wip-blocked-not-for-merge` in isolated worktree (do not invent parallel rewrite).  
2. Finish missing pieces: `app/app/layout.tsx` honor `pathDenied`; wire `requireKompisBedriftProduct` on all `/api/employee-knowledge/*`; locales `en,no,sv,da,pl,uk,es`; update ACP/menu/bypass tests + matrix.  
3. Test matrix: Web-only · Bedrift-only · both · none · direct URL · API 401/403 · platform-admin separation.  
4. Frozen WK **0/46** · no UnoNight-hardcode.  
5. PR → CI/Preview green → merge → Production; authenticated Safari **required** before claim LIVE product chrome.

**NOT RUN here:** stash apply · Step B code · tests · CI · deploy.

---

## G. Scorecard · docs delivery · next job

| Section | Status |
|---------|--------|
| A baseline / Platform API | **PASS** (API/UI **BLOCKED**/missing documented) |
| B access impact | **PASS** (activity depth **PARTIAL** / NOT VERIFIED for page hits) |
| C UnoNight + frozen | **PASS** |
| D tenant plan + approval gates | **PASS** (prep only) |
| E cutover options | **PASS** (decision pending owner) |
| F Step B resume | **PASS** (plan only · **NOT RUN**) |
| Production writes | **NOT RUN** |

### Recommended owner sequence (single jobs)

1. **`AIPIFY.PLATFORM.KOMPIS_BEDRIFT.STATUS_ACTIVATE.API_UI.V1`** — thin Platform HTTP/UI (no SQL if RPCs stay as-is).  
2. Owner text: **D1–D5** exact payloads + **E1/E2/E3** cutover choice.  
3. Execute create → license → admin attach → activate (**new tenant only**).  
4. Resume Step B from stash → LIVE.  
5. Authenticated Bedrift E2E on test tenant · Web-only check on UnoNight.

---

## Confirmations

No tenant · no auth user · no invite · no email · no grant · no Step B code · no stash apply · no SQL apply · frozen **0/46**.

**Bedrift test tenant created?** No.  
**License activated?** No.  
**Step B LIVE?** No.

---

## Final status

# **PASS (prep only)**

Decision-ready. All mutating work remains **NOT RUN** pending owner gates above.
