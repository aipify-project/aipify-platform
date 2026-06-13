# Implementation Blueprint — Phase 42: Sales Demo & Experience Engine

**Feature owner:** Customer App  
**Engine phase:** A.95 extension (Sales Expert Operating System)  
**Route:** `/app/sales-expert-engine` · Tab: **Demo / Demonstrations**

> **Naming collision:** ARCHITECTURE lists **Commercial Packages Phase 42** (`20260613000000_commercial_packages_phase42.sql` — subscription packages and tenant module licensing at `/app/settings/billing`). **Implementation Blueprint Phase 42 Sales Demo** is a distinct blueprint extending Sales Expert OS — documented in `_sdebp_distinction_note()`.

## Mission

Help Sales Experts deliver outcome-focused demonstrations that help prospects envision a better future — people invest in outcomes, not features.

## Core philosophy

**People invest in outcomes; demos envision a better future.** Discovery before demonstration. Honest about simulated vs live data.

## Objectives

| Key | Focus |
|-----|-------|
| **Interactive demos** | Guided walkthroughs showing outcomes — not feature lists |
| **Industry examples** | Commerce, professional services, community platforms |
| **Guided journeys** | Intro → discovery → tailored demo → Q&A → summary → next steps |
| **Companion presentations** | Companion examples 🌹🦉🔔 during demos |
| **Scenario storytelling** | Operational narratives with simulated metadata |
| **Secure demo environments** | Read-only, time-limited link scaffolds — no customer PII |

## Demo environments (catalog scaffold)

| Key | Label |
|-----|-------|
| `small_business` | Small business |
| `support_focused` | Support-focused |
| `executive` | Executive |
| `commerce` | Commerce |
| `community_platform` | Community platform |
| `enterprise` | Enterprise |

Stored in `sales_expert_demo_environments` — metadata catalog only.

## Demo data examples (simulated metadata)

Support tickets · KC articles · Executive dashboards · Tasks/workflows · Bell moments · Recognition · Sales opportunities — **metadata only, no PII**.

## Industry demonstrations

- **Commerce** — Operational efficiency, support AI, customer experience without replacing storefronts
- **Professional services** — Knowledge management, decision support, repetitive task reduction
- **Community platforms** — Member support, knowledge sharing, community health summaries

## Demo guidance (Sales Coach connection)

Cross-links **Coach Phase 45** `demonstration_guidance` and **Certification Phase 46 Module 4** (Aipify Demonstrations). Companion examples during demos — technology supports people.

## Discovery question library

Categories: Operational challenges · Knowledge management · Repetitive tasks · Success in six months

## Demo flow structure

1. Introduction  
2. Discovery  
3. Tailored demo  
4. Q&A  
5. Summary  
6. Next steps  

## Custom demo experiences

Support-first · Knowledge-first · Executive · Commerce

## Demo links (scaffold)

Secure links: **24h access**, **read-only**, **guided** — scaffold in `sales_expert_demo_links` (slug, environment_key, expires_at, access_mode). **No fake live provisioning.**

## Self Love connection (A.76)

Preparation checklists, talking points, confidence guidance — **not memorize everything**. Route: `/app/self-love-engine`.

## Trust connection

Transparent about:

- Simulated vs actual demo data
- Integration requirements (install-first, read-only first)
- Simulation Lab Phase 78 (`/app/simulations`) — strategic what-if, **NOT** sales demos
- Demo link scaffold vs live provisioning

## Cross-links

| Surface | Route | Purpose |
|---------|-------|---------|
| Coach Phase 45/46 | `/app/sales-expert-engine` | Demo guidance extension |
| Certification Module 4 | `/app/sales-expert-engine` | Demonstrations training |
| Simulation Lab Phase 78 | `/app/simulations` | Strategic what-if — NOT sales demos |
| Marketing Center Phase 33 | `/app/marketing-center-engine` | Marketing materials (if on disk) |
| Global Expansion Phase 35 | `/app/localization-global-expansion-engine` | Demo i18n en/no/sv/da |
| Self Love A.76 | `/app/self-love-engine` | Demo preparation confidence |
| Workflow Orchestration Phase 40 | `/app/workflow-orchestration-engine` | Tasks/workflows demo data |

## Distinction from Commercial Packages Phase 42

| Blueprint | Migration | Purpose |
|-----------|-----------|---------|
| **Commercial Packages Phase 42** | `20260613000000_commercial_packages_phase42.sql` | Subscription packages, tenant modules, billing |
| **Sales Demo Blueprint Phase 42** | `20260994000000_implementation_blueprint_phase42_sales_demo_experience.sql` | Sales Expert demo environments and experience |

## Database

Migration: `supabase/migrations/20260994000000_implementation_blueprint_phase42_sales_demo_experience.sql`

**Optional tables:** `sales_expert_demo_environments`, `sales_expert_demo_links` — metadata scaffold only.

Extends `get_sales_expert_operating_system_dashboard()` and `get_sales_expert_operating_system_card()` via `_sdebp_*` helpers — **all A.95 + Phase 41 + Phase 45 + Phase 46 fields preserved**.

## UI

- `components/app/sales-expert-engine/SalesExpertEngineDashboardPanel.tsx` — **Demo / Demonstrations** tab (`demoExperience`)
- Types: `lib/aipify/sales-expert-operating-system/types.ts`, `parse.ts`
- i18n: `customerApp.salesExpertEngine.tabDemoExperience` + section labels in en/no/sv/da

## ILM

- Corpus: `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase42-sales-demo-experience.txt`
- Vocabulary: `lib/internal-language-model/implementation-blueprint-phase42-vocabulary.ts`

## Related docs

- [IMPLEMENTATION_BLUEPRINT_PHASE45_SALES_COACH_ENABLEMENT.md](./IMPLEMENTATION_BLUEPRINT_PHASE45_SALES_COACH_ENABLEMENT.md)
- [IMPLEMENTATION_BLUEPRINT_PHASE46_SALES_COACH_CERTIFICATION_FIELD_ENABLEMENT.md](./IMPLEMENTATION_BLUEPRINT_PHASE46_SALES_COACH_CERTIFICATION_FIELD_ENABLEMENT.md)
- [COMMERCIAL_PACKAGES.md](./COMMERCIAL_PACKAGES.md) — Commercial Packages Phase 42 (distinct)
