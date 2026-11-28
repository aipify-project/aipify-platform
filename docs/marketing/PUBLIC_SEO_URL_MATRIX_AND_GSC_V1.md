# Public SEO URL matrix + Search Console owner recipe V1

**Scope:** Public website indexability only. No ranking guarantees. noindex ≠ Google removal.

## Host inventory

| Host | Role | Expectation |
|---|---|---|
| `aipify.ai` | Primary public | Indexable sales chrome |
| `www.aipify.ai` | Alias | Should canonicalize to apex (verify in Production) |
| `app.aipify.ai` | APP | **Must not** be in public sitemap; auth/app robots disallow |

## Indexability matrix (code)

| URL | robots meta | sitemap.xml | robots.txt allow | Notes |
|---|---|---|---|---|
| `/` | index,follow | yes | yes | Sales home + JSON-LD Organization/SoftwareApplication |
| `/growth-partners` | index,follow | yes | yes | Free GP |
| `/certified-sales-partner` | index,follow | yes | yes | Paid CSP |
| `/contact/support` | index,follow | yes | yes | Intake |
| `/privacy` · `/terms` | (inherit sales/legal) | yes | yes | Legal |
| `/start` | **noindex**,follow | no | allow | Correct — not SEO landing |
| `/login` | auth | no | allow | Not SEO landing |
| `/s/[code]` · `/p/*` | referral | no | — | Keep public, not SEO hubs |
| Legacy `(marketing)/*` | **noindex**,follow | no | not disallowed | Observe noindex |
| `/app/*` · `/platform/*` · `/api/*` · `/partners/` | — | no | disallow | Private |

Locales: sales cookie locale; do not invent hreflang pairs without verified locale-equivalent URLs. Core locales en/no/sv/da/pl/uk (+ es if mounted) — reciprocity only when real equivalents exist.

## Freeze drift (separate approval — do not touch)

| Path | Manifest SHA-256 | Actual SHA-256 |
|---|---|---|
| `components/embed/WebsiteKompisEmbedWidget.tsx` | `73585a579de9ee5127cb4b4c0cc258202eb7c37ddff243e8ae283325c1134863` | `4aa343c10595a8d39eb06a3badd77ddf1001792cd9dae598dc11fb6806201f4e` |
| `lib/marketing/website-kompis-public-answer-policy.ts` | `ae14aacb3aff82bc803b5ec2d6ac7de7cb2242f6571564a859c4bdc65c90b42a` | `24cde88546fa851ed726007b35a4f8d95f0c50df98bf6b57e326ec9bbb1d77f7` |
| `lib/marketing/website-kompis-answer-feedback-server.ts` | `00600726e501ec59661660a229b996deff085d9c412687cafa4bf4e4348e0f0a` | `1c4b273e59f2c2c7e4072a089080a8d2e4ad3e72648cd3035debb3349f64e14a` |

```text
YES UPDATE website-kompis-public-chain-frozen-manifest.json hashes only
to match current Production HEAD after owner review of diff for the three drifted files.
No behavior change required in this SEO job.
```

## Google Search Console — owner recipe (no external config without permission)

1. Confirm property `https://aipify.ai/` (Domain or URL-prefix) with DNS/HTML already authorized.
2. Submit sitemap `https://aipify.ai/sitemap.xml`.
3. URL Inspection priority: `/`, `/growth-partners`, `/certified-sales-partner`, `/contact/support`, `/privacy`, `/terms`.
4. Monitor legacy URLs for “Excluded by ‘noindex’ tag” — expected until 301 YES.
5. Do **not** Request Indexing in bulk without owner; no API submissions from agents without YES.
6. Track: indexed count vs sitemap URLs; coverage errors; www vs apex.

## Measurable controls

- HTTP: sitemap lists only approved paths; robots disallows `/app` `/platform` `/api` `/partners`.
- HTML: sales home `robots` indexable; legacy `noindex,follow`.
- Diff: no freeze file edits in SEO PR.
