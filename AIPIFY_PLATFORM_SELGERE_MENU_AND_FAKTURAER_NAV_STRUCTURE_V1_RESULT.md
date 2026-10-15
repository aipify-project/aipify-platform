# AIPIFY_PLATFORM_SELGERE_MENU_AND_FAKTURAER_NAV_STRUCTURE_V1_RESULT

## Status

**LIVE** — nav/IA only; no invoice engine.

## Baseline

| Item | Value |
|---|---|
| Worktree | `/Users/veltrix/Development/aipify-platform-selgere-menu-and-fakturaer-nav-structure-v1` |
| Branch | `fix/platform-selgere-menu-and-fakturaer-nav-structure-v1` (merged/deleted) |
| Base | `origin/main` @ `45ece944` (customer-detail compaction present) |
| Frozen WK 46/46 | Untouched |
| Step B stash | Untouched |

## Before → after menu

### Before (Avtaler og salg)
Betalinger · Growth Partner-attribusjon · Provisjoner · Kundeavtaler · Markedsplass · Growth Partners

### After

**Selgere**
- Selgerregister / Growth Partners → `/platform/pilot-operations`
- Salgslenker og attribusjon → `/platform/billing/growth-partner-attribution`
- Provisjoner → `/platform/billing/commissions`

**Avtaler og salg**
- Betalinger → `/platform/billing`
- Fakturaer → `/platform/billing/invoices` (existing module; also highlights enterprise-invoices)
- Kundeavtaler → `/platform/subscriptions`
- Markedsplass → `/platform/skills`

## Active state

Platform sidebar selected item uses **light blue** (`sky-100` / `sky-950`), not status green/red. Customer APP active accent unchanged (Companion purple).

## i18n

`navGroups.sellers` + `nav.growthPartners` / `growthPartnerAttribution` / `commissions` / `invoices` in **en/no/sv/da/pl/uk/es**. NO section label: **Selgere**.

## Explicitly not built (backlog)

Full invoice ops: row-level Stripe reconciliation, manual create, PDF send, dunning, ⋮ menu. Existing `/platform/billing/invoices` and enterprise invoices remain as-is. No Stripe writes, PDF generation, or payment mutations in this job.

## QA

| Gate | Result |
|---|---|
| `nav-sellers-commercial-structure.test.ts` | **PASS** |
| `dashboard-business-language.test.ts` | **PASS** |
| Auth visual click-through | **NOT RUN** (login-gated) |
| CI / Vercel preview | **PASS** |

## PR / deploy

| Item | Value |
|---|---|
| PR | https://github.com/aipify-project/aipify-platform/pull/230 |
| Head | `702e586e` |
| Merge SHA | `5d0917e7` |
| Deploy (aipify-platform) | `dpl_ESLULrdhDLtYAkPDWAZ8ggxZiRHp` **READY** → `app.aipify.ai` |
| Deploy (aipify) | `dpl_ATQtHwzUgVdBjXx2yzXGzRBa8Fgh` **READY** |
| Merged at | 2026-10-15T12:00:46Z |
