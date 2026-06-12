# Implementation Blueprint — Phase 29: AI Install & Discovery Engine

**Feature owner:** Customer App · **Install Engine layer** (embedded runtime) + Customer App dashboard  
**Implementation:** [Aipify Install Engine — Phase A.22](./AIPIFY_INSTALL_ENGINE_PHASE_A22.md) · [Install & Adoption Engine (ABOS)](./INSTALL_ADOPTION_ENGINE.md)

This document defines **Phase 29 — AI Install & Discovery Engine** of the Aipify Business Operating System (ABOS). It aligns the existing Aipify Install Engine with ABOS intelligent discovery standards — safe analysis, tailored recommendations, and human approval.

> **Mapping:** ABOS Implementation Blueprint Phase 29 maps to **Aipify Install Engine Phase A.22** at `/app/aipify-install-engine` and embedded Install Engine (`/api/install/*`, `/api/embed/*`, `/app/install`). Do not duplicate a separate discovery engine — extend A.22 RPCs, dashboard, and ILM vocabulary only. Install & Adoption ABOS alignment (`20260950000000`) fields are **preserved**.

## Mission

Reduce onboarding friction by allowing Aipify to safely analyze connected systems and recommend configurations tailored to each organization.

## Core philosophy

**Aipify should adapt to organizations — organizations should not be forced to adapt entirely to Aipify.** Discovery should reduce complexity, not create it.

## Discovery objectives

| Objective | Description |
|-----------|-------------|
| Organizational structures | Teams, roles, and responsibility patterns from environment scan |
| Existing workflows | Support, operational, and approval flows detected in connected systems |
| Knowledge sources | Documentation repositories, help centers, and internal wikis |
| Support processes | Channels, escalation paths, and ticket patterns (metadata) |
| Operational responsibilities | Role-to-capability mapping from discovery results |
| Integration opportunities | Shopify, WordPress, WooCommerce, and productivity platform hooks |

## Supported environments

**Initial priorities:** WordPress · Shopify · WooCommerce · Custom web applications · Internal documentation repositories · Connected productivity platforms

**Future scaffold:** CRM · ERP · Industry-specific platforms

## Discovery capabilities (metadata)

- Identify frequently accessed resources
- Detect support channels
- Recognize organizational terminology
- Suggest Knowledge Center structures
- Recommend Business Packs
- Highlight integration opportunities

## Human approval principles

| Aipify may | Aipify should not |
|------------|-------------------|
| Recommend | Modify systems automatically without approval |
| Analyze | Access restricted information without authorization |
| Suggest | Activate capabilities silently |

Organizations remain in control. Permission review step is mandatory before activation.

## Companion recommendation experiences

- 🌹 *"Your organization appears to rely heavily on support workflows. Aipify Support may be valuable."*
- 🦉 *"Several disconnected knowledge sources have been identified."*
- 🔔 *"An onboarding milestone has been completed."*
- ❤️ *"You have made excellent progress configuring Aipify."*

## Self Love connection

Discovery should reduce overwhelm — guide step by step, simplify configuration choices, encourage gradual adoption, celebrate onboarding progress. Route: `/app/self-love-engine` (principle, not a product toggle).

## Trust connection

Organizations should understand what Aipify analyzes, why recommendations are generated, which permissions are required, and how to revoke access. Permission review and audit trail — metadata only.

## Distinctions (cross-link, do not duplicate)

| Surface | Route | Purpose |
|---------|-------|---------|
| **Install Wizard Phase 17/24** | `/app/install` | Embedded modern install experience |
| **Customer Onboarding A.10 / Blueprint Phase 28** | `/app/customer-onboarding-engine` | Ten-step onboarding journey — complementary |
| **Integration Engine A.8** | `/app/integration-engine` | Connector activation after discovery recommendations |
| **Business Packs A.43 / Phase 15** | `/app/business-packs-foundation-engine` | Pack recommendations from discovery |
| **Curiosity & Discovery A.87** | `/app/curiosity-discovery-engine` | Question-led culture — not environment scan |

## Dogfooding

| Organization | Role |
|--------------|------|
| **Aipify Group** | Internal — knowledge discovery, workflow identification, integration recommendations |
| **Unonight** | First external pilot — support opportunity detection, commerce environment discovery |

## Success criteria (live)

Computed by `_aidbp_blueprint_success_criteria()`:

1. Onboarding friction reduced (discovery run or install in progress)
2. Recommendations available and reviewable
3. Discovery transparency documented
4. Human control via permission review
5. Time-to-value path visible (completion or accepted recommendations)

## RPCs and migration

| RPC | Purpose |
|-----|---------|
| `_aidbp_blueprint_*()` | Phase 29 metadata helpers |
| `_aidbp_engagement_summary(org_id)` | Live discovery and install counts |
| `_aidbp_blueprint_success_criteria(org_id)` | Live Phase 29 success criteria |
| `get_aipify_install_engine_dashboard()` | Extended with Phase 29 fields — **all A.22 + Install & Adoption fields preserved** |
| `get_aipify_install_engine_card()` | Compact blueprint reference |

Migration: `supabase/migrations/20260976000000_implementation_blueprint_phase29_ai_install_discovery.sql`

## ABOS principle

Understanding creates relevance. The more appropriately Aipify understands an organization, the more effectively it can assist.

## Vision

People should occasionally think: *"It already knows how we work."* Not because Aipify guessed — because it listened, learned responsibly, and adapted thoughtfully.
