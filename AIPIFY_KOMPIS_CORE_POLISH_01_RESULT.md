# AIPIFY.KOMPIS.CORE.POLISH.01 — RESULT

## Status

| Point | Outcome |
| --- | --- |
| 1. White first-visit surface | Fixed in Core loader + embed shell |
| 2. Higher chat | Open height **720 → 800** (viewport-clamped, max 900) |
| 3. Contact support on start | Shown only when tenant FAQ evidence yields a safe URL |
| 4. New chat in header | Implemented with abort/stale-response guard |
| 5a. Header “Kompis” size | Matched to logo text height (~30px / 22px weight 750) |
| 5b. Purple color (image 5) | **BLOCKED** — screenshot not available in workspace/Downloads |
| Feedback votes / reuse / SQL | Untouched — votes fail-closed; reuse OFF; migration not applied |

## Root cause — white first-visit surface

Cold load showed a blank opaque field before the launcher painted because:

1. Embed shell used a full-viewport `min-h-dvh` document inside the host iframe.
2. Host iframe became visible immediately with transparent/white paint before the widget posted a closed resize.
3. Unavailable state used `h-full w-full`, which could leave a large click-catching surface if the host frame was oversized.

**Fix:** Host loader starts `opacity:0` + `pointer-events:none` until the first valid resize (closed forced to 72×72); embed layout drops `min-h-dvh`; closed shell pins `html/body` to 72×72 via `data-ak-shell="closed"`; unavailable state is 72×72 only.

## Height

| | Before | After |
| --- | --- | --- |
| Preferred open height | 720px | 800px |
| Loader/parse max | 800px | 900px |
| Viewport clamp | yes | yes (`viewport − 24`, min 560) |

Width remains 420.

## Contact support contract

- Source: published tenant FAQ rows resolved via existing public FAQ search (prefer `content_type=contact` + `source_url`).
- Validation: same-host absolute URL or host-relative `/…` path through existing navigate allow-list.
- Missing URL: **no button** (no invented `/contact`, no Aipify support substitute).
- Gap: there is still no dedicated install-config contact field; FAQ evidence is the current generic Core source.

## New chat

- Header action resets local messages/draft/sending, keeps panel open, keeps install/domain/locale/pageContext.
- AbortController + generation counter prevent stale answers from landing in the new conversation.
- Session storage rewritten with empty messages for the active chat (no server history delete).

## Color point (BLOCKED)

`Skjermbilde 2026-10-11 kl. 12.37.53.png` was not found under Downloads/Desktop/Pictures. No element recolor performed. Provide the image or name the element to complete 5b.

## Key files

- `public/embed/website-kompis.js`
- `lib/marketing/website-kompis-embed.ts`
- `components/embed/WebsiteKompisEmbedWidget.tsx`
- `components/embed/website-kompis-design-v1.css`
- `app/embed/layout.tsx` / `app/embed/website-kompis/layout.tsx`
- `lib/marketing/website-kompis-public-contact.ts`
- `lib/marketing/website-kompis-public-contact-server.ts`
- `app/api/embed/companion/launcher-icon/route.ts`
- `lib/marketing/website-kompis-visitor-tone.ts`

## Tests

- `npx tsx lib/marketing/website-kompis-embed.test.ts`
- `npx tsx lib/marketing/website-kompis-embed-session.test.ts`
- `npx tsx lib/marketing/website-kompis-public-contact.test.ts`
- `npx tsx lib/marketing/website-kompis-visitor-tone.test.ts`
- `npx tsx lib/marketing/website-kompis-context-faq-answer-repair-02.test.ts`
- `npx tsc --noEmit -p tsconfig.json`

## Merge / deploy

- PR: https://github.com/aipify-project/aipify-platform/pull/113
- Feature head: `b755702e369e45a83048c83bfa2bd347992a71c9`
- Merge on `main`: `a9a79ab734adcfd01ceccf8eee6b39a890649f9c`
- Vercel Preview CI: green (SSO-protected — browser Preview QA not completed from agent)
- Production deploy: follows Vercel main pipeline after merge

## Confirmations

- Core-only (no Host changes)
- SQL migration `20261937900000` untouched / not applied
- Feedback persistence gate untouched; reuse OFF
- Image-5 purple recolor BLOCKED pending asset
