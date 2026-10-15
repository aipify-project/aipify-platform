# AIPIFY_PLATFORM_MASTER_NAVIGATION_DASHBOARD_DESIGN_STANDARD_V1_RESULT

## Status

**READY for merge** (fill PR/merge/deploy after LIVE). Nav/IA + shared design polish only.

## Baseline

| Item | Value |
|---|---|
| Worktree | `/Users/veltrix/Development/aipify-platform-master-navigation-dashboard-design-standard-v1` |
| Branch | `fix/platform-master-navigation-dashboard-design-standard-v1` |
| Base | `origin/main` @ `37b585d3` (Selgere/Fakturaer LIVE) |
| Prior LIVE | Customer detail compaction (#228), Selgere/Fakturaer (#230) |
| Drift audit worktree | Present but stale/behind — not conflicting; no duplicate PR |
| Frozen WK 46/46 | Untouched |
| Step B stash | Untouched |

## Before → after (sidebar)

### Before
- No pinned home link; `Platformoversikt` lived under **Drift**
- Installations under **Produkt**
- Translations under **Kunnskap**
- Selgere / Avtaler og salg as shipped in #230

### After

| Section | Items |
|---|---|
| **Dashboard** (pinned, always visible) | Dashboard → `/platform` (active light-blue only on exact `/platform`) |
| **Drift** | Driftsoversikt · Plattformstatus · Kompis AI · Nettsideverifisering · Publiseringer · Installasjoner · Hendelseslogg · Customer Zero / testdrift (`/platform/unonight-pilot`) |
| **Kunder** | Organisasjoner · Kundesuksess · Support |
| **Selgere** | Selgerregister · Salgslenker og attribusjon · Provisjoner |
| **Avtaler og salg** | Betalinger · Fakturaer · Kundeavtaler · Markedsplass |
| **Kunnskap** | Kunnskapssenter · Dokumentasjon |
| **Produkt** | Produktstyring · Business Packs · Kompis Web-planer |
| **Kontroll og styring** | Systeminnstillinger · Språk og oversettelser · Aktivitetslogg · Styringsregistre · Sikkerhetsgjennomganger |

## Moved / unchanged routes

| Item | Change |
|---|---|
| `/platform` | Pinned Dashboard link; removed duplicate from Drift |
| `/platform/installations` | Menu moved Drift ← Produkt (URL unchanged) |
| `/platform/knowledge/translation-management` | Menu moved Kontroll ← Kunnskap (URL unchanged) |
| `/platform/system` | Surfaced under Kontroll |
| `/platform/unonight-pilot` | Surfaced under Drift as Customer Zero / testdrift |
| All other hrefs | Unchanged; no redirects required |

## Explicitly deferred (do not ship as fake pages)

- Trafikk og markedsføring (no live module)
- Empty «Selgeroversikt» placeholder
- Moving Markedsplass → Produkt / Kompis AI → Produkt (unclear ownership)
- Invoice engine, Selgere backend, Kompis Bedrift license, language-admin backend, traffic tracking
- Functional repair of Business Packs / Knowledge Center / translation admin beyond nav labels

## Design

- Platform active accent: light blue (`sky-100` / `sky-950`) — already LIVE from #230
- Dashboard uses home icon; clearer icons for Driftsoversikt, status, publishing, installations, organizations
- Customer APP sidebar unchanged (no Platform Dashboard)

## i18n

`navGroups.dashboard` + updated `nav.overview` / `installationOversight` / `translationManagement` / `system` / `websiteReleaseVerification` / `unonightPilot` in **en/no/sv/da/pl/uk/es**.

## QA

| Gate | Result |
|---|---|
| `nav-master-structure.test.ts` | **PASS** |
| `nav-sellers-commercial-structure.test.ts` | **PASS** |
| `dashboard-business-language.test.ts` | **PASS** |
| Auth visual click-through | **NOT RUN** (login-gated) |
| CI / Vercel | Pending PR |

## PR / deploy

| Item | Value |
|---|---|
| PR | _pending_ |
| Head | _pending_ |
| Merge SHA | _pending_ |
| Deploy | _pending_ |
