# AIPIFY – PUBLIC HOME APPROVED DESIGN V1 — RESULT

**Branch:** `feature/public-home-approved-design-v1`  
**Commit:** `6fafb4f3fa09ffaec4ca99e5450c4455e16879f8`  
**PR:** [#163](https://github.com/aipify-project/aipify-platform/pull/163)  
**Public Preview (iz5z):** https://aipify-platform-iz5z-git-fe-905559-unonight-platform-s-projects.vercel.app  
**Package verified:** MANIFEST SHA-256 all OK (mascot `9646db7d…`)  
**Status:** Preview PR only — **do not merge/deploy in this job**

| Gate | Result |
|------|--------|
| `READY FOR OWNER PUBLIC HOME VISUAL TEST` | **YES** (after Preview URL available) |
| `SAFE TO MERGE/DEPLOY` | **NOT AUTHORIZED IN THIS JOB** |
| Frozen Website Kompis files/hashes/runtime diff | **0** |
| `MIGRATION CREATED/APPLIED` | **NO** |

---

## Allowlist (changed)

- `app/(marketing)/page.tsx` — render approved home
- `components/marketing/homepage/approved-home/*` — page component + scoped CSS
- `lib/marketing/parse-approved-public-home.ts`
- `locales/{en,no,sv,da,pl,uk}/marketing.json` — `approvedPublicHome.*`
- `public/brand/aipify-kompis-avatar.png` — package mascot (hash matched)

## Unchanged (by design)

- MarketingNavbar / MarketingFooter / language selector (footer)
- `/login`, `/growth-partners` pages (linked only)
- Frozen Website Kompis runtime
- APP panel, Platform Admin, auth, Core, SQL
- No new packages

---

## CTA deviations from HTML reference

| Reference | Production used | Reason |
|-----------|-----------------|--------|
| `mailto:hello@aipify.ai` | `/book-demo` | Concept mailbox not verified; keep existing demo flow |
| Header «Kom i gang» `#contact` | Existing nav `Book Demo` → `/book-demo` | Layout keeps MarketingNavbar |
| Demo language pill «30+ språk» | «Flere språk» / «Multiple languages» | Do not hardcode 30 as architecture limit |

Partner → `/growth-partners`, Login → `/login` remain available via existing marketing navigation (desktop + mobile menu).

---

## Visual QA note

Automated compile/typecheck/freeze only. Owner must confirm Preview desktop/mobile against `reference/index.html` (mascot placements, no horizontal scroll, demo switch, anchors).

---

## Functions preserved

- Existing locale system + footer language switcher
- Book demo / login / growth-partners routes
- Product demo is illustrative only (labeled Produktdemo / Product demo)
- Design Studio + AI Translator marked planned add-ons
- Kompis Web vs Bedrift product boundary copy
