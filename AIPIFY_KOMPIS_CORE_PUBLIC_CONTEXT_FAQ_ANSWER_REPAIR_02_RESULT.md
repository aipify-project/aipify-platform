# AIPIFY.KOMPIS.CORE.PUBLIC.CONTEXT.FAQ.ANSWER.REPAIR.02 — Result

Date: 2026-10-11  
Scope: Core answer relevance + minimal host mount. No SQL / secrets / ingest / paid provider.

## Ships

| Surface | PR | Merge SHA | Notes |
|--------|----|-----------|-------|
| Core | https://github.com/aipify-project/aipify-platform/pull/109 (MERGED) | `6529f83a` | FAQ/pageContext/sources/launcher/height |
| Host | https://github.com/Unonight/unonight-platform/pull/646 (MERGED) | `3a7a41d3` | `/login` + `/register` mount |

Shop polish (bilde 9) remains HOLD / out of scope.

## LIVE

| Surface | Deploy | State | Alias |
|--------|--------|-------|-------|
| Core `aipify-platform` | `dpl_EYFSbdmwWXX7hu9pKj4iXdjnN54X` @ `6529f83a` | READY | `app.aipify.ai` |
| Host `unonight-platform` | `dpl_A5hdtx2TREJ65iPtREhDsTPPfJzU` @ `3a7a41d3` | READY | `www.unonight.com` |

No SQL, secrets, ingest, or paid provider ask in this job.

## Case report (before → after)

| # | Observation | After (local/fixture) | Runtime note |
|---|-------------|------------------------|--------------|
| 1 | Closed bubble = triangle mark | Closed launcher uses robot avatar (`aipify-kompis-avatar.svg`, ~54px) | Needs LIVE loader asset |
| 2 | Travel Q → “Www” gap | `siteLabelFromDomain` strips www; tone uses “nettstedet” when unknown | Extractive/index path; no Www |
| 3 | “Ekte navn?” → delivery FAQ list | Hub question-lists rejected; synonym overlap for ekte navn | Depends on published FAQ row quality |
| 4 | Duplicate FAQ source cards | `dedupeCompanionSourcesByRoute` on FAQ + grounded + index | Same canonical URL → one card |
| 5 | “Ledig nå?” → wrong list | Intent tokens + hub reject; real Q+A preferred | Needs matching FAQ/index evidence |
| 6 | Tall empty input; want taller chat | Open height 720; composer still min 46px grow-to-cap; visualViewport clamp | Loader + embed constants aligned |
| 7–8 | `/register` `/login` no Kompis | Host mount allows those public paths; loader no longer treats them as private for pageContext (forms still skipped) | Separate host deploy |
| 9 | Shop white box | **HOLD** — not changed | Later job |
| 10 | Buy product → EN bio | Purchase/price path requires on-topic priced segment; else gap | Needs published buy/process text |
| 11 | Template Upgrade price | PageContext prefers same-card title+price (fixture 5 000 kr) over bio | Loader now captures priced cards |
| 12 | Gift card price → Template price | Gift-card Q without gift-card evidence → null/gap (not Template 5 000) | Honest gap if no gift-card text |

## Local tests run

- `website-kompis-context-faq-answer-repair-02.test.ts` — pass  
- `website-kompis-embed.test.ts` — pass  
- `website-kompis-grounded-answer.test.ts` — pass  
- `public-companion-ask.test.ts` — pass  
- Host `website-kompis.contract.test.ts` — pass  

## Remaining gaps (outside this job)

- Production provider ask / LIVE answer QA not run (forbidden).  
- No Production FAQ re-ingest; stale structured FAQ may still gap when only hub chunks exist.  
- Gift-card amounts only answer when published on-page/index evidence exists.  
- Bilde 9 shop polish deferred.
