# AIPIFY.CORE.WEBSITE_KOMPIS.FIRST_LOAD_WHITE_IFRAME.P1.SCOPED_REOPEN_FIX.V1 — RESULT

**Status:** **PARTIAL / HOLD** — root cause isolated; scoped frozen-loader fix on PR **#250**; contract + local same-turn race harness PASS; production closed-state OK on old loader; **merge/LIVE HOLD** until Preview/Production host serves patched JS and cold-start visual desktop+mobile is confirmed (Vercel Deployment Protection blocked automated Preview fetch).

**Date:** 2026-10-16  
**Baseline `origin/main`:** `3c8f323a23e0f4e751b65343f37951c4896e11cf` (#249 LIVE tip, untouched)  
**Branch:** `feat/kompis-first-load-white-iframe-p1-scoped-fix-v1`  
**PR:** https://github.com/aipify-project/aipify-platform/pull/250  
**HEAD:** `e4a73d9d08f734159ebea1546b5e28ccd1b375c1`  
**Preview deploy (iz5z):** `dpl_H8UomT3ZJCGtNQ76TWYjhAgCh3rc` READY (protection blocked curl/share)

---

## Root cause (proven in loader state machine)

Owner symptom (large white host plane + mascot at top-left of that plane, chat not open; click opens chat in same plane; refresh often OK) matches:

**Host iframe enlarged to open geometry (~450×800 + outset) while the embed document still paints closed launcher chrome (72×72 at the iframe origin).** Browsers fill the oversized iframe canvas opaquely → white plane; mascot sits at the top-left of that canvas.

Job 52 already refused open sizing before `closedHandshakeDone`, but:

1. A premature `open=true` was **coerced into a closed handshake** (revealed 72×72 and unlocked later open).
2. After handshake, **same-turn restore/hydration `open=true`** could enlarge the host **before** closed chrome had committed to a painted frame — leaving closed UI inside a panel-sized host.

This is a Core host-loader race (not UnoNight CSS). Hypothesis class from the job is confirmed for the size/state mismatch path; intermittent timing matches restore/hydration/postMessage ordering.

---

## Fix (authorized scope only)

| File | Freeze | Change |
|---|---|---|
| `public/embed/website-kompis.js` | **FROZEN — owner scoped reopen** | Stash pre-handshake open (do not fake handshake). Defer open enlarge until double-rAF `closedPaintCommitted`. Failsafe drops stale pre-handshake open. |
| `lib/marketing/website-kompis-white-startup-surface.test.ts` | not frozen | Extended state-machine contract for paint gate + pending open. |
| `docs/integrations/website-kompis-public-chain-frozen-manifest.json` | re-freeze SHA | SHA256 for `public/embed/website-kompis.js` → `0ba977a01b24c4fb0c3997f9f51a5cc247b554174c26da1f465f01851a6ebba9` |

**Not changed (would need separate named auth):** `app/embed/website-kompis/layout.tsx`, `components/embed/WebsiteKompisEmbedWidget.tsx`, other 44 frozen runtime files.

---

## Evidence

| Check | Result |
|---|---|
| Freeze SHA baseline (pre-edit) | loader/layout/widget/page **MATCH** manifest on `3c8f323a` |
| `website-kompis-white-startup-surface.test.ts` | **PASS** |
| `website-kompis-embed.test.ts` | **PASS** |
| Live `https://www.unonight.com/no` (production loader) | iframe **72×72**, `backgroundColor: transparent`, opacity 1 — **no white plane** on this observation (intermittent; production still on old loader) |
| Auth model routes | Not used (login wall); not required once Core race is isolated |
| Local same-turn closed→open race harness (patched loader) | **PASS** — first sample 72×72 transparent; open only after paint commit (~32ms); no sync enlarge |
| Vercel Preview JS fetch / share link | **BLOCKED** (Deployment Protection 403) — cannot automate Preview visual on real embed URL |
| Cold-start visual desktop+mobile on host serving new JS | **PENDING** — required before merge |

---

## Release gates

- PR **#250** open; Vercel project checks completed on Preview.
- Merge/LIVE: **HOLD** until owner/agent can open Preview (or temporary protection bypass) and confirm cold closed 72×72, open/close/refresh, no white plane on desktop+mobile.
- PR #249: untouched.
- No SQL, secrets, Customer APP, licenses, or Step B stash.

---

## Next exact step

1. Access Preview `aipify-platform-iz5z` (or bypass) and confirm `/embed/website-kompis.js` SHA `0ba977a01b24…`.  
2. Visual QA cold/open/close/refresh desktop+mobile — no white plane.  
3. If PASS → merge #250 + Production alias verify; mark LIVE. Else keep HOLD.

END OF RESULT.
