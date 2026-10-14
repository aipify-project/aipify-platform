# AIPIFY — UNONIGHT APP → CORE → KOMPIS WEB — OWNER-ASSISTED E2E V1 RESULT

**Date:** 2026-10-14  
**Repo head:** `origin/main` `62dfa9b3d8c9ca1baac01f1546be86957e8d9e96` (PR #184 baseline)  
**Job type:** Owner-assisted verification — no SQL, no freeze edits, **no paid ask**

| Counter | Value |
|---------|------:|
| Frozen WK touched | **0** |
| SQL / schema changes | **0** |
| Production writes | **0** |
| Provider-billable asks | **0** |
| FULL E2E VERIFIED | **NO** → remains **PARTIAL** |

---

## Verdict

**PARTIAL.** Agent browser has **no** logged-in APP session (redirected to login). Real public ask **stopped at paid-call gate** because Production Core has `reserve_website_kompis_public_ai_call` deployed; a successful reservation proceeds to grounded provider synthesis.

---

## Per-hop status

| Hop | Status | Evidence |
|-----|--------|----------|
| APP login (agent session) | **NOT RUN** | `https://app.aipify.ai/app/website-kompis/faq` → redirect `…/login?next=%2Fapp%2Fwebsite-kompis%2Ffaq` (2026-10-14). No cookies/session available to agent. Passwords/OTP **not** requested. |
| APP correct-site FAQ GET | **NOT RUN** | Blocked on login |
| APP locale view | **NOT RUN** | Blocked on login |
| Core install-scoped public FAQ | **PASS** (prior + unchanged baseline) | Install `180c9d31…`: 5 published / 4 searchable / 1 expired; wrong domain/install → 0 |
| Host loader www.unonight.com | **PASS** (prior) | Aipify loader + matching install/domain/core-origin |
| Real widget ask | **NOT RUN / PAID APPROVAL PENDING** | See Phase B gate below |
| Live multi-install | **NOT RUN** | Docker-only previously |

---

## Phase A — Owner APP checklist (please run interactively)

Do **not** paste passwords, cookies, or OTP into chat.

1. Open `https://app.aipify.ai/login` → **Fortsett som kunde** → sign in as UnoNight owner/admin.  
2. Go to `https://app.aipify.ai/app/website-kompis/faq` (and Connection if useful: `/app/website-kompis/connection`).  
3. Confirm organization is UnoNight and site selector shows **www.unonight.com** (install prefix `180c9d31…` if shown in secondary/technical UI).  
4. Confirm FAQ list shows **5 published** public items for that site (and that expired validity may still appear as published in admin — search exclusion is Core visitor-side).  
5. Note locale tabs actually available (expect Norwegian / customer setup).  
6. Reply in chat with **only**: PASS/FAIL per step, masked install if visible, published count seen, any mismatch — no secrets.

Until those observations arrive, APP hops stay **NOT RUN**.

---

## Phase B — Paid-call gate (READ-ONLY; not executed)

| Finding | Detail |
|---------|--------|
| Ask route | `POST https://aipify.ai/api/marketing/companion/ask` (frozen public chain) |
| Cost RPCs on Core | **Present:** `reserve_website_kompis_public_ai_call` · `finalize_website_kompis_public_ai_call` |
| Behavior when reserve **allowed** | Provider grounded synthesis runs (`canCallProvider=true`) → **billable / metered** |
| Behavior when reserve **denied** | Provider skipped; may still return deterministic FAQ / site-index / safe fallback — **not** used as a substitute for E2E PASS |
| Tenant hourly public budget | **60** reserved calls / calendar hour / tenant (Core SQL default) |
| Estimated max $ for ONE ask | **Not reliably bound from repo alone** (depends on live model routing for `kompis_result_summary_v1` and token size). Uncertainty must be accepted in any approval. |
| Telemetry / counters | Reservation + finalize on `website_kompis_public_ai_*` tables; trace events `public_ai_cost_*` / grounded ask logs (no secrets) |
| Environment | Production apex `aipify.ai` · host `www.unonight.com` · install `180c9d31…` |
| Retries | **None** if approved (exactly one ask) |

### Exact owner authorization required before first ask

Please reply with an affirmative that names **all** of:

1. Task: `UnoNight APP → Core → Kompis Web owner-assisted E2E V1 — ONE public ask`  
2. Route: `POST https://aipify.ai/api/marketing/companion/ask` via widget on `https://www.unonight.com`  
3. Install/domain: `180c9d31…` / `www.unonight.com`  
4. **ONE** benign FAQ-grounded question only; **no retries**  
5. Accept that **USD cost cannot be hard-capped from code alone**, and that the call may consume **1** of **60**/hour public AI reservations for the tenant  
6. Explicit: **APPLY / ALLOW this one provider-capable public ask**

Phase 2 SQL approval is **not** reusable for this spend.

Until that message: **REAL ASK = NOT RUN / PAID APPROVAL PENDING**.

---

## Absolute boundaries (held)

- Frozen Website Kompis 46 files: **diff 0** (not modified this job)  
- No SQL apply, Stripe, secrets, UnoNight platform repo changes  
- No mocked Production PASS  

---

## Next single step

1. Owner completes Phase A checklist → report observations, **or** leave APP as NOT RUN.  
2. If FULL E2E is required: send the exact Phase B paid-ask authorization above → agent runs **one** widget ask and updates RESULT.

**STOP** before any provider-capable ask.
