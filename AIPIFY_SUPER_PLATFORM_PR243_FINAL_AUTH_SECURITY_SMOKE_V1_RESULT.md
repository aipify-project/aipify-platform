# AIPIFY_SUPER_PLATFORM_PR243_FINAL_AUTH_SECURITY_SMOKE_V1 — RESULT

**Date:** 2026-10-15  
**Type:** Final authenticated security smoke (verification only — **no merge / no LIVE**)  
**PR:** https://github.com/aipify-project/aipify-platform/pull/243  

---

## Verdict: **BLOCKED**

Real authenticated `super_admin` + MFA smoke **could not be completed**. No credentials, session cookies, MFA codes, or recovery codes were requested or used. Synthetic RBAC is **not** counted as authenticated smoke.

**No merge. No LIVE. No #240/#241/#242-style waiver applied.**

---

## 1) HEAD / main / CI

| Item | Value |
|------|--------|
| Reported HEAD | `660da304` |
| GitHub PR head (verified) | **`660da304b0369b7f326970acad718832497120d2`** — exact match |
| `origin/main` | `db063c348a525812b4a9b6c0a419b1daad4460bc` (#242 LIVE) |
| Mergeable | true (GitHub) |
| Merged / LIVE | **No** |
| Vercel Preview (aipify-platform) for harden commit `d0b495a9` | success → `https://aipify-platform-hkqpo8pc6-unonight-platform-s-projects.vercel.app` |
| Vercel Preview (aipify-platform-iz5z) for `660da304` | success |
| Vercel PR checks (end of job) | **All PASS** (Comments + aipify + aipify-platform + aipify-platform-iz5z) |

App logic for smoke is identical between `d0b495a9` and `660da304` (latter is report-only).

---

## 2) Exact blocker

| Blocker | Detail |
|---------|--------|
| No agent `super_admin` session | Browser has no Aipify Platform/Super login |
| Preview edge | Direct Preview URLs require **Vercel Authentication SSO** before app auth |
| Policy | Job forbids collecting passwords, OTP, recovery codes, cookies, tokens; forbids endless Vercel login loops |
| Service-role / auth bypass | **Not used** |

Therefore steps **4a–4d authenticated positive / role-negative** remain **NOT RUN**.

---

## 3) What was executed (real HTTP — not synthetic unit tests)

### 3.1 Unauthenticated — Production (`app.aipify.ai` = main LIVE, **pre-#243**)

| Check | Result |
|-------|--------|
| `GET /platform` | **307** → `/login?next=%2Fplatform` |
| `GET /api/super-portal/dashboard` | **401** body `{"error":"Unauthorized"}` — **no aggregates** |
| `GET https://super.aipify.ai/super` | **307** → `/login?next=%2Fsuper` |

Note: Production does **not** yet include PR #243 `private, no-store` deny headers (still main). Negative “no aggregates” still holds.

### 3.2 Unauthenticated — Preview (PR code, Vercel share-fetch past deployment protection)

| Check | Result |
|-------|--------|
| `GET …/platform` (share fetch) | Lands on **`/login?next=/platform`** (`x-matched-path: /login`) |
| HTML / RSC payload | Login portal only — keys `total_organizations`, `superAdminInsight`, `Konsernoversikt`, `Group overview`, etc. **absent** |
| Response cache | `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate` |
| `GET …/api/super-portal/dashboard` via share fetch | **401** / deployment auth after redirect — **no aggregate body obtained** |
| Agent browser open of Preview | Stopped at **Vercel Login** (one attempt; not continued) |

### 3.3 Authenticated matrix (required for PASS)

| Case | Result |
|------|--------|
| `super_admin` + MFA + recovery → `/platform` Konsernoversikt | **NOT RUN** |
| Same → API 200 + aggregates + `no-store` | **NOT RUN** |
| `platform_support` → no panel + API 403 without aggregates | **NOT RUN** |
| Incomplete MFA / no recovery → API 403 | **NOT RUN** |
| J0 nine Super modules read-only smoke | **NOT RUN** (same session gap; J0 remains PARTIAL) |

Prior job synthetic matrix remains PASS; **not** reclassified as authenticated smoke.

---

## 4) Residual risks (unchanged)

1. `/api/super-portal/*` still proxy MFA-excluded; only **dashboard** has route-local gate in #243.  
2. Authenticated multi-role runtime not observed by agent.  
3. Production LIVE still on main until #243 merges.

---

## 5) What owner can verify (no secrets shared with agent)

Use your own already-logged-in browser (Preview of #243 or, after a future release decision, Production). Role labels only — do not paste cookies/codes into chat.

1. **Role `super_admin`**, MFA verified, ≥1 recovery code:  
   - Preview `/platform` → Konsernoversikt visible with aggregates.  
   - Network: `GET /api/super-portal/dashboard` → **200**, body has expected RO fields, `Cache-Control` includes **`private` + `no-store`**.  
2. **Role `platform_support`**, MFA verified:  
   - `/platform` → **no** Konsernoversikt / Super insight markup.  
   - Same API → **403**, body `{ "error": "…" }` only (no counts).  
3. Incomplete MFA / no recovery as `super_admin`: API **403**, no panel.  
4. Optional: open `https://super.aipify.ai/super` — still gated; smoke nine modules read-only if you choose (J0).  
5. Confirm no Super aggregate keys in support-role page source / Network.

Reply with results + **new explicit release decision naming PR #243** if you want merge/LIVE. This job does **not** merge.

---

## 6) Untouched

Website Kompis freeze · Step B stash · PR #238 · Support SQL NOT_APPLIED · no SQL/RLS · no Super teardown · **J2 not started** · **no merge**.

---

## STOP

**BLOCKED** on authenticated smoke. Awaiting owner-executed matrix + separate release decision for PR #243.
