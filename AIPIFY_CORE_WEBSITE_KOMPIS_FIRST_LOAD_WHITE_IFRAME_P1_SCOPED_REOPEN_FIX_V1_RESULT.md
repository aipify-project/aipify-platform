# AIPIFY.CORE.WEBSITE_KOMPIS.FIRST_LOAD_WHITE_IFRAME.P1.SCOPED_REOPEN_FIX.V1 — RESULT

**Status:** **PARTIAL / HOLD** — root cause isolated and fix implemented in authorized frozen loader; contract tests PASS; production public closed-state OK; merge/LIVE deferred until Preview visual QA of the fix (host must serve patched `website-kompis.js`).

**Date:** 2026-10-16  
**Baseline `origin/main`:** `3c8f323a23e0f4e751b65343f37951c4896e11cf` (#249 LIVE tip, untouched)  
**Branch:** `feat/kompis-first-load-white-iframe-p1-scoped-fix-v1`

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
| Preview visual QA of **patched** loader | **PENDING** — HOLD merge until Preview host serves new JS and cold/open/close/refresh desktop+mobile checked |

---

## Release gates

- PR: open for review/CI (this job).
- Merge/LIVE: **HOLD** until Preview visual QA PASS on patched loader + CI green.
- PR #249: untouched.
- No SQL, secrets, Customer APP, licenses, or Step B stash.

---

## Next exact step

1. Land PR / Preview deploy serving `public/embed/website-kompis.js` at new SHA.  
2. Visual QA: cold closed 72×72 transparent; open panel; close; refresh; no white plane on first paint.  
3. If PASS → merge + Production alias verify; mark LIVE. Else HOLD with blocker.

END OF RESULT.
