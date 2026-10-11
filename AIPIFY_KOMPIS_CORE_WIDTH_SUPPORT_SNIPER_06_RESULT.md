# AIPIFY.KOMPIS.CORE.WIDTH.SUPPORT.SNIPER.06 — Result

**Status: PARTIAL**

Date: 2026-10-11  
Scope: Core-only. Visible panel width 450 + stronger public contact auto-discovery. No Host / ask-engine / SQL apply / ingest.

## Owner requirements

| # | Requirement | Status |
|---|-------------|--------|
| 1 | Visible open panel **450 CSS-px** wide on roomy desktop | **PROVEN** |
| 2 | Auto-discover public contact/support page | **CODE PROVEN** (LIVE depends on index/FAQ hits matching new rules) |
| 3 | APP reserve support-URL field | **BLOCKED** — needs schema allowlist migration (not authorized) |
| 4 | Start-screen Kontakt support when URL resolved | Unchanged wiring — shows when launcher metadata has `publicContactUrl` |

Ask/retrieval/provider/fallback **untouched**. SQL `202619379` NOT APPLIED. Votes gated. Reuse OFF.

## Exact Core files

- `lib/marketing/website-kompis-embed.ts` (+ test) — `OPEN_WIDTH` **450** (host = panel + outset×2 → **474**)
- `public/embed/website-kompis.js` — `OPEN_WIDTH = 450`
- `lib/marketing/website-kompis-public-contact.ts` (+ test) — tiered path/title/form ranking, HTTPS, private-path reject, evaluate/reject reasons
- `lib/marketing/website-kompis-public-contact-server.ts` — broader locale query passes, higher index limit

## Frame measurements

Authoritative: panel width constant + `OPEN_FRAME_OUTSET=12` → outer = panel + 24.

| Viewport | Outer iframe (host) | Visible panel (outer − 12×2 pad) |
|----------|---------------------|-----------------------------------|
| Before (REPAIR.05) 1440×1000 | 444×824 | ≈420×800 |
| After desktop Chrome headless ~1440×913 | **474×824** | **450×800** |
| Closed | 72×72 | launcher only |
| Mobile math 390×844 | **378×808** (clamped) | ≈354×784 |

Chrome headless proof (desktop):

```json
{
  "closed": { "width": 72, "height": 72 },
  "open": { "width": 474, "height": 824 },
  "visiblePanel": { "width": 450, "height": 800 },
  "hostPreferred": { "width": 474, "height": 824 }
}
```

## Contact auto-discovery

**Priority (documented):**
1. Published FAQ rows (`content_type=contact` or contact-relevant title/category/url) — same-host, not private
2. Site-index hits ranked by tier then score: **path contact (0) → title contact (1) → form excerpt (2) → weak path/url text (3)**
3. No safe candidate → `null` (no invented `/contact`, no Aipify support substitute)

**Accept:** HTTPS absolute or same-host relative; public path; path/title/form evidence.  
**Reject:** other host, `http:`, private prefixes (`/member`, `/login`, …), non-contact high-score pages, excerpt-only keyword without title/path/form.

**Why prior “contact-like” index docs could still miss CTA:** search queries too narrow; ranking by score alone; title/path patterns missing (`kontakt-oss`, `contact-us`, form cues); private paths; HTTP canonicals. This sniper widens queries + tiers + HTTPS + private reject. FAQ `source_url` is **not** required for index picks.

**Install-config override:** not in `ALLOWED_CONFIG_KEYS` / `_wpkf_sanitize_install_config_patch` allowlist → cannot persist without additive migration. **BLOCKED** this job (no SQL created/applied, no fake UI field).

### Minimal schema for APP reserve field (future job)

Allow `publicSupportUrl` (string|null) in:
- TS `WebsiteKompisInstallConfig` + `ALLOWED_CONFIG_KEYS`
- SQL `_wpkf_sanitize_install_config_patch` (+ normalize HTTPS/same-host)
- APP `WebsiteKompisDomainSettingsCard` + `buildWebsiteKompisSettingsPatch`
- Launcher resolve: auto-discovery first, then explicit override (or document override-first if product prefers)

## FAQ admin → public Kompis (mapping only)

| Topic | Location |
|-------|----------|
| Admin UI | `/app/website-kompis/faq` · `WebsiteKompisFaqAdminPanel` |
| Locales | `WPKF_LOCALES` = core locales (`en/no/sv/da/pl/uk`) |
| Status | draft / published / archived |
| Roles | owner/admin (tenant FAQ RPCs) |
| Public ask | `searchPublicCompanionTenantFaq` ← published rows only |
| Already in APP | Yes — FAQ admin under Website Kompis in Customer App |

Published FAQ rows **can** already feed public ask and contact discovery when `source_url` + relevance pass.

## Document / PDF upload (mapping only)

No Website Kompis / public-site-index PDF upload path. Index is crawl/HTML ingest. Closest unrelated: authenticated Companion attachments.  
**Suggested later Core job:** customer-approved document ingest wired into public evidence pack — improves coverage but does **not** alone fix an answer path that ignores retrieved evidence.

## Tests

- `website-kompis-embed.test.ts` — 450/474 desktop; mobile clamp
- `website-kompis-public-contact.test.ts` — two tenant shapes, index-without-FAQ, form title, private reject, HTTPS, tier preference

## Deploy

| Item | Value |
|------|-------|
| Delivery | Direct `main` commit `f25c2da870b5db3a50d00c6cca592cea78c73fb0` (worktree was on `main`; owner pre-approved LIVE for this sniper scope) |
| Branch note | `feat/kompis-width-support-sniper-06` left at pre-change `0e711642` — code shipped on `main` |
| Production | `dpl_GZLzvYERADB48xjZdviunUd6B6B6` READY · aliases `app.aipify.ai` |
| LIVE loader | `OPEN_WIDTH = 450` on `app.aipify.ai` + `aipify.ai` |
| Loader SHA-256 | `6d7d634a39cc6942e23469cf558affa018f80582879021e367dbe8b312fc009f` (app = aipify.ai = repo) |

## Confirmed untouched

- Ask / grounded / provider / fallback
- Host / UnoNight
- SQL apply · votes gate · reuse OFF
- No customer-specific URLs in Core

## Stop

No document upload. No answer-engine work. Owner LIVE check for 450 width + Kontakt CTA when index has a qualifying public contact page. APP override waits on separate schema-authorized job.
