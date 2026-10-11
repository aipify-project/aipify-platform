# AIPIFY.KOMPIS.CORE.GROUNDED.FALLBACK.CONTACT.FRAME.REPAIR.04 — Result

Date: 2026-10-11  
Scope: Core-only public Website Kompis answer policy, contact resolution, open panel frame. No SQL / Host / secrets / ingest / provider enablement / feedback activation / reuse.

## Before → after

| Gap (AUDIT.02) | Before | After |
|----------------|--------|-------|
| Shared Core “how” rules | Provider grounded prompt only; extract/FAQ/fallback skipped shared contract | `website-kompis-public-answer-policy.ts` — prompt for provider + deterministic gate for extract/FAQ; honest gap for safe fallback |
| Contact support | FAQ `source_url` only; URL alone treated as enough | FAQ first, then published site-index; path/title relevance required; same-host navigate only |
| Open panel frame | Viewport clamp clipped Design V1 border/shadow | `OPEN_FRAME_OUTSET=12` + `OPEN_EDGE_INSET=12` on iframe; open shell `padding:12px`; height still 800 / max 900 content rules |
| Copy visibility | Reported live in #112; felt missing near actions | Existing answer actions kept; `scroll-padding-bottom:88px` so copy row stays in scroll view; votes still schema-gated |

## Exact Core files

- `lib/marketing/website-kompis-public-answer-policy.ts` (+ `.test.ts`) — NEW shared policy
- `lib/marketing/website-kompis-grounded-answer.ts` — provider prompt from shared builder
- `lib/marketing/public-companion-ask.ts` — deterministic policy gate + `answerPath` diagnostics
- `lib/marketing/website-kompis-public-contact.ts` (+ server + tests) — index picker + relevance
- `lib/marketing/website-kompis-embed.ts` (+ test) — outset/inset sizing helpers
- `public/embed/website-kompis.js` — LIVE loader frame math
- `app/embed/website-kompis/layout.tsx` — open-shell padding; closed 72×72 unchanged
- `components/embed/website-kompis-design-v1.css` — scroll-padding for answer actions
- `app/api/embed/companion/launcher-icon/route.ts` — Cache-Control 300 (asset freshness)

## Shared policy (all public answer paths)

Rules (`WEBSITE_KOMPIS_PUBLIC_ANSWER_POLICY_RULES`): direct answer · locale · approved public evidence only · site/user text untrusted · no invented prices/terms/URLs · honest gap · deduped sources · no FAQ hub lists · no off-topic bio for price/purchase.

| Path | How policy applies |
|------|--------------------|
| `provider_grounded` | `buildWebsiteKompisPublicAnswerPolicyPrompt(locale)` in system prompt |
| `current_page` / `public_site_index` / `faq` | `evaluateWebsiteKompisDeterministicAnswerPolicy` — reject → try next path |
| `safe_fallback` | Explicit warm honest-gap copy (cannot “run” the prompt string) |
| Diagnostics (internal) | `answerPath` + `policy: website_kompis_public_v1` when diagnostics enabled; no provider error text in visitor dialog |

Honest limit: deterministic paths enforce selection/refusal rules; they do not claim full natural-language understanding beyond documented checks.

## Contact

`resolveWebsiteKompisPublicContactUrl`: tenant FAQ → if none, site-index hits with contact-relevant path and/or title. Rejects other-host, invented `/contact`, stale/private docs, and random high-score pages. Start screen shows Kontakt support only when a safe href exists; host-tab navigate via existing origin protocol.

## Frame measurements (LIVE loader)

| Constant | Value |
|----------|-------|
| Content open height | 800 (max 900) |
| `OPEN_FRAME_OUTSET` | 12 |
| `OPEN_EDGE_INSET` | 12 |
| Outer iframe | panel + outset×2; clamped to viewport − edge inset |
| Closed | 72×72 launcher only |

Small viewports still clamp; do not claim fixed 800 content height everywhere.

## Copy / feedback

- Copy remains on finished provider/FAQ/extract/fallback answers via existing `WebsiteKompisAnswerActions`.
- Votes remain fail-closed / schema-gated. SQL `20261937900000` NOT APPLIED. Reuse OFF.
- No new feedback feature in this job.

## Tests / Preview

Local targeted tests (generic tenants/sources; no paid live provider calls): public-answer-policy, public-contact (FAQ + index-only + reject other host), embed frame constants, related ask/relevance regressions from CI on PR head.

Preview: CI typecheck green after `1e080e2f` diagnostics typing fix; desktop/mobile frame markers verified in loader source. Full Safari + live provider-success visitor QA: not claimed as browser-complete in this report — owner re-test on LIVE.

## Deploy / LIVE proof

| Item | Value |
|------|-------|
| PR | [#114](https://github.com/aipify-project/aipify-platform/pull/114) MERGED |
| Feature heads | `85b1d258` → `1e080e2f` (typecheck) |
| Merge / `origin/main` | `df72b6e31987e47356012ee263b2a482ad199cf4` |
| Production project | `aipify-platform` → aliases `app.aipify.ai` |
| Deployment | `dpl_3ZP1EzNU9Fpifrk8njCoHaNXXFja` |
| Ready URL | `aipify-platform-b1824jz9y-unonight-platform-s-projects.vercel.app` |
| State | READY · target production · source SHA `df72b6e3` |
| Loader | `https://app.aipify.ai/embed/website-kompis.js` and `https://aipify.ai/embed/website-kompis.js` both contain `OPEN_FRAME_OUTSET = 12` / `OPEN_EDGE_INSET = 12` / `OPEN_HEIGHT = 800` |
| Loader SHA-256 | `f0f74bf10e5e814237aac9a5f2a71fa26ec58fbf1bcb877bab1611f9eb03b484` (app = aipify.ai = repo `public/embed/website-kompis.js`) |

## Confirmed untouched

- Core-only diff (no Host / UnoNight site / Shopify / customer config)
- No customer names, domains, or product routes hardcoded in Core
- SQL NOT APPLIED · votes gated · reuse OFF
- Cost / provider / ingest / secrets ports unchanged
- Image-5 recolor still out of scope

## Stop

Job complete. Further Kompis feature work waits on owner LIVE visitor test.
