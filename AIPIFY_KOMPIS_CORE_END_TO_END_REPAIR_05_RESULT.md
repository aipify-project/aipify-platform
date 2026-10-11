# AIPIFY.KOMPIS.CORE.END.TO.END.REPAIR.05 — Result

**Status: PARTIAL**

Date: 2026-10-11  
Scope: Core-only Website Kompis end-to-end repair. No Host / UnoNight / SQL apply / secrets / provider enablement / reuse.

## Owner requirements — proof status

| # | Requirement | Status | Evidence |
|---|-------------|--------|----------|
| 1 | Larger open frame (≥420×800 when viewport has room) | **PROVEN (code + local browser)** | Root cause: embed posted size from iframe viewport → sticky ~560 height. Fix: host loader sizes from parent viewport; rejects undersized posts; widget posts preferred size only. Chrome headless 1440×~913: closed **72×72**, open after undersized 444×584 post → **444×824** (`getBoundingClientRect`). Content after 12px shell pad ≈ **420×800**. LIVE loaders match. |
| 2 | Kontakt support when public contact page exists | **CODE PROVEN / DATA-DEPENDENT LIVE** | Resolver: FAQ → index, alt queries, broader path (`kunde-service` / `customer-service`). Unit tests pass. Live CTA still depends on tenant-published contact page in FAQ/index — no invented `/contact`. If absent in knowledge: honest null (no dead link). |
| 3 | Answers that use available evidence | **PROVEN (mocked provider paths)** | Provider `covered:false` no longer early-returns; retries page/index/FAQ before gap/fallback. Controlled test: Bronze/Gold FAQ used instead of gap text. Provider-not-configured / failure still fall through (existing). **Live model-success not claimed** (no paid live QA). |
| 4 | Thumbs + copy | **PARTIAL / VOTES BLOCKED** | Copy: purple outline icons always rendered on finished answers (existing). Votes remain fail-closed until SQL apply. Migration bytes verified; **SQL NOT APPLIED** (not authorized). |

Screenshots 15.15 / 15.16: not present in Cursor context — not inspected. REPAIR.04 Production was READY before those times; findings treated as remaining product gaps, not assumed #114 regressions.

## Exact Core files changed

- `public/embed/website-kompis.js` — host viewport floor; reject undersized posts; `reclampOpenFromHostViewport`
- `components/embed/WebsiteKompisEmbedWidget.tsx` — stop posting iframe viewport height
- `lib/marketing/website-kompis-embed.ts` (+ test) — `resolveWebsiteKompisEmbedPreferredHostOpenSize` (1440×1000 → 444×824)
- `lib/marketing/public-companion-ask.ts` (+ test) — provider knowledge-gap → deterministic retry
- `lib/marketing/website-kompis-public-answer-policy.ts` (+ test) — `isWebsiteKompisProviderKnowledgeGapResponse`
- `lib/marketing/website-kompis-public-contact.ts` (+ server + test) — path/query hardening

## Frame measurements (before → after)

| Condition | Before (bug) | After |
|-----------|--------------|-------|
| Desktop roomy (host 1440×1000) | Embed used iframe vh (~72 then ~560) → outer often **~444×584** | Outer **444×824**, panel **420×800** |
| Undersized post `444×584` on roomy host | Accepted → locked short | Rejected; host preferred kept |
| Closed | 72×72 | 72×72 unchanged |
| Mobile 390×844 | Viewport clamp | Width ≤378, height clamped to available (honest clamp) |

Local Chrome headless (`window-size=1440,1000`):

```json
{
  "closed": { "width": 72, "height": 72 },
  "openRejectUndersized": {
    "viewport": { "width": 1440, "height": 913 },
    "hostPreferred": { "width": 444, "height": 824 },
    "applied": { "width": 444, "height": 824 },
    "rect": { "width": 444, "height": 824 }
  }
}
```

Preview SSO: Vercel Authentication blocks anonymous Preview UI — reported **BLOCKED for in-Preview widget SSO**, not PASS. Preview loader content verified via authorized Vercel fetch (markers present). Local harness used same loader source as repo/LIVE.

## Answer cases (controlled / mocked)

| Question | Path | Expected | Actual (test) |
|----------|------|----------|---------------|
| Bronze vs Gold (FAQ present) | Mock provider `covered:false` | FAQ content, not gap | FAQ with Bronze/Gold + membership source |
| Provider not configured / timeout | Existing | Deterministic FAQ/index | Pass (prior + retained) |
| Off-topic bio for price | Policy gate | Reject → next path | Pass (policy tests) |
| Live provider success on customer site | — | — | **Not verified** (no paid live call) |

## Contact

- `resolveWebsiteKompisPublicContactUrl`: locale query + alt “customer service / kundeservice”, FAQ then index per query.
- Path RE includes `kunde-service` / `customer-service`.
- Title-only “Kundeservice” on contact-shaped path accepted in unit tests.
- No Host change; no hardcoded customer URL.

## Feedback / SQL apply underlag (NOT APPLIED)

| Item | Value |
|------|-------|
| File | `supabase/migrations/20261937900000_website_kompis_answer_feedback_v1.sql` |
| SHA256 | `81f347c1aa2dd7a0cc7c94275fb26ebe0e924cd81498bb6f3667d5655a3d9490` (matches expected; bytes unchanged) |
| Tables | `website_kompis_answer_receipts`, `website_kompis_answer_feedback` |
| RPCs | `create_website_kompis_answer_receipt`, `record_website_kompis_answer_feedback`, `get_website_kompis_answer_feedback_overview` |
| Access | RLS deny-all for anon/authenticated; `GRANT EXECUTE` to `service_role` (overview to authenticated) |
| App gate | Votes hidden until receipt RPC exists (`feedbackPersistenceReady`) — do not remove |
| Reuse | OFF |
| Owner action required | Explicit apply approval → apply once → Production storage test (persist/reload/change-vote) |

Until apply: Production thumbs remain **BLOCKED**; copy remains available.

## Deploy

| Item | Value |
|------|-------|
| PR | [#115](https://github.com/aipify-project/aipify-platform/pull/115) MERGED (squash) |
| Head tested | `d8a96f69` |
| `origin/main` | `0e711642dc0a0bc3e72c96d370123ca4273605a7` |
| Preview | `dpl_GFAAbFLX62W9KbfoGfa8wRHzeGJP` READY (SSO-protected) |
| Production | `dpl_3Zt9TofF2pdm7YNos2gLrN7gj1VF` READY · aliases `app.aipify.ai` |
| LIVE loader | `https://app.aipify.ai/embed/website-kompis.js` = `https://aipify.ai/embed/website-kompis.js` = repo |
| Loader SHA-256 | `88e6e191d22d9196e22c5134949509a9e7afc9f1b2b057d05e9f30cbb331e5cd` |
| Markers | `OPEN_HEIGHT = 800`, `OPEN_FRAME_OUTSET = 12`, `height >= host.height`, `reclampOpenFromHostViewport` |

## Confirmed untouched

- Core-only (no Host / UnoNight site)
- SQL NOT APPLIED · votes gated · reuse OFF
- Cost / provider / ingest / secrets ports unchanged
- No customer names hardcoded in Core

## Remaining for COMPLETE

1. Owner LIVE visitor test on real customer site (frame + contact CTA if knowledge has contact page + answer quality).
2. Separate SQL apply authorization + persistence test for thumbs.
3. Optional paid live provider-success QA (separate budget).

## Stop

No further feature work until owner LIVE Kompis test approval. No UnoNight changes.
