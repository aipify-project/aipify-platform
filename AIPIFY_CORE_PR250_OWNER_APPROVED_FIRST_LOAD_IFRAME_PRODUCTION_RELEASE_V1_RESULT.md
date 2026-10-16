# AIPIFY CORE / WEBSITE KOMPIS FIRST-LOAD WHITE IFRAME P1 — PR #250 OWNER-APPROVED RELEASE V1 — RESULT

**Status:** **PASS / LIVE**

**Date:** 2026-10-16  
**Owner waiver:** Authenticated / Deployment-Protected Preview visual QA = **WAIVED BY OWNER** (not PASS). Narrow exception for PR #250 only.

---

## Identifiers

| Item | Value |
|---|---|
| PR | https://github.com/aipify-project/aipify-platform/pull/250 |
| PR HEAD (full) | `c5a6910c2a831aac8e38ba030b9bbd3dedf459ce` |
| Merge SHA (full) | `6b47cb02af6157f212c8e970eac0ebed1394ccf1` |
| Base at merge | `3c8f323a23e0f4e751b65343f37951c4896e11cf` (`main`) |
| Production deploy | `dpl_AL4z2aeV8Cxj9abjeinXBdbHQWsZ` (**READY**, target production, commit `6b47cb02…`) |
| Apex alias proof | `https://aipify.ai/` link preload `dpl=dpl_AL4z2aeV8Cxj9abjeinXBdbHQWsZ` |
| Delivered embed SHA (full) | `0ba977a01b24c4fb0c3997f9f51a5cc247b554174c26da1f465f01851a6ebba9` |
| PR #249 | Untouched |

---

## Scope gate (pre-merge)

Changed files only:

1. `public/embed/website-kompis.js` — authorized frozen runtime fix  
2. `docs/integrations/website-kompis-public-chain-frozen-manifest.json` — SHA for that one file only  
3. `lib/marketing/website-kompis-white-startup-surface.test.ts` — contract/race harness  
4. `AIPIFY_CORE_WEBSITE_KOMPIS_FIRST_LOAD_WHITE_IFRAME_P1_SCOPED_REOPEN_FIX_V1_RESULT.md` — job docs  

Freeze integrity: **only** `public/embed/website-kompis.js` SHA changed among 46 protected files. Manifest entry matches file hash. No SQL/env/secrets/RPC/auth/license/customer-specific code.

---

## CI on exact PR HEAD `c5a6910c…`

| Check | Result |
|---|---|
| Vercel Preview Comments | SUCCESS |
| Vercel – aipify | SUCCESS |
| Vercel – aipify-platform | SUCCESS |
| Vercel – aipify-platform-iz5z | SUCCESS |
| mergeable / mergeStateStatus | MERGEABLE / CLEAN |

---

## Tests executed

| Suite | Result |
|---|---|
| `website-kompis-white-startup-surface.test.ts` (paint-gate / pending open / premature open) | **PASS** |
| `website-kompis-embed.test.ts` | **PASS** |
| Prior local same-turn race harness (patched loader) | **PASS** (from fix job) |
| Authenticated / Deployment-Protected Preview visual QA | **WAIVED BY OWNER** (not PASS) |
| Unauthenticated `https://www.unonight.com/no` closed smoke | **PASS** — iframe **72×72**, transparent `rgba(0,0,0,0)`, opacity 1, script `https://aipify.ai/embed/website-kompis.js` |

Not claimed as full visual regression: open→close→refresh matrix on desktop+mobile against authenticated Preview (waived).

---

## Production verification

| Check | Result |
|---|---|
| Production deploy READY for merge SHA | **YES** — `dpl_AL4z2aeV8Cxj9abjeinXBdbHQWsZ` |
| `https://aipify.ai/` serves that deploy | **YES** (`dpl=` in Link headers) |
| `https://aipify.ai/embed/website-kompis.js` SHA | **MATCH** `0ba977a01b24c4fb0c3997f9f51a5cc247b554174c26da1f465f01851a6ebba9` |
| Fix markers live | `closedPaintCommitted`, `pendingOpenResize`, stash-intent path present |
| Cache | `x-vercel-cache: HIT` with `max-age=0, must-revalidate`; content hash matches tip (not stale old SHA) |
| `https://app.aipify.ai/` | HTTP 200 (separate app project deploy id in headers; embed runtime is **aipify.ai**) |

---

## Residual risk

Owner-waived authenticated Preview visual QA means intermittent first-load white-plane timing was proven in contract/local harness + Production closed smoke, but not re-proven on a protected Preview host with full open/close/mobile matrix. Monitor Production reports; rollback candidate: prior `dpl_D9Pw4YKiZU4yDihKomrgnUtkqd9u` (`3c8f323a`, #249).

---

## Verdict

**PASS / LIVE.** PR #250 merged; Production `dpl_AL4z2aeV8Cxj9abjeinXBdbHQWsZ` on `aipify.ai` serves patched loader SHA `0ba977a01b24…`. Preview visual QA remains **WAIVED**, not PASS.

END OF RESULT.
