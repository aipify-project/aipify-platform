# Implementation Blueprint — Phase 33 Extension: Sales Expert Operating System

**Feature owner:** Customer App  
**Engine phase:** A.95 (Blueprint Phase 33 Extension)  
**Route:** `/app/sales-expert-engine` · Nav id: `salesExpertEngine`

> **Note:** Engine phase **A.95** is assigned here because **A.79** is Proactive Companion Engine. This extension extends [Phase 33 Partner & Expert Network](./IMPLEMENTATION_BLUEPRINT_PHASE33_PARTNER_EXPERT_NETWORK.md) and Marketplace Partner Ecosystem A.45.

## Mission

Empower **Aipify Sales Representatives** and **Aipify Sales Experts** with a professional partner portal — Customers, Opportunities, Pipeline, Commission Overview, training cross-links, Partner Resources, and one-to-one email follow-up.

## Core philosophy

Professional partner engagement with official tier terminology. **Never Affiliate** publicly. Metadata only — no raw email bodies or customer PII in logs.

## Portal sections

| Section | Purpose |
|---------|---------|
| **Dashboard** | Revenue overview, monthly commissions, lifetime subscription value, follow-ups, active opportunities |
| **Customers** | Status, subscription status, onboarding progress, follow-up schedules, notes (metadata) |
| **Opportunities** | Pipeline stages, next/recommended actions |
| **Commission Overview** | Pending, paid, forecasted — subscription-linked metadata |
| **Training Center** | Cross-links to Learning & Training A.36 and Certification A.37 |
| **Partner Resources** | Marketing materials, playbooks, templates (metadata scaffold) |
| **Email Center** | One-to-one send, scheduled follow-ups, history — **no mass email** |
| **Implementation Services** | Setup (15000 NOK), Training (5000 NOK), Package (20000 NOK) suggested pricing |

## Email templates (10 initial)

Introduction · Discovery meeting · Post-demo follow-up · Knowledge/Support/Commerce/Executive outreach · Re-engagement · Upgrade recommendation · Welcome to Aipify — auto-insert `expert_name`, `company_name`, `booking_link`, `personal_link`.

## Automated follow-ups

14 / 30 / 90 day cadence templates (metadata).

## Subscription principles

- **Aipify subscription:** Customer ↔ Aipify  
- **Consulting / implementation:** Customer ↔ Sales Expert

## Distinctions

| Surface | Route | Purpose |
|---------|-------|---------|
| Partner Success A.73 | `/app/partner-success-engine` | Portfolio health |
| Partner Certification Phase 91 | `/app/partners` | Certification ecosystem |
| Marketplace Ecosystem A.45 | `/app/marketplace-partner-ecosystem-foundation-engine` | Expert network governance |

## Database

Migration: `supabase/migrations/20260981000000_sales_expert_operating_system_phase_a79.sql`

Tables: `organization_sales_expert_*` (settings, customers, opportunities, commissions, email_templates, emails, follow_ups)

RPCs: `get_sales_expert_operating_system_dashboard()`, `get_sales_expert_operating_system_card()`, `_seos_*` helpers

Permissions: `sales_expert.view`, `sales_expert.manage`, `sales_expert.email`

## Related docs

- [PARTNER_TERMINOLOGY_UPDATE.md](./PARTNER_TERMINOLOGY_UPDATE.md)
- [IMPLEMENTATION_BLUEPRINT_PHASE33_PARTNER_EXPERT_NETWORK.md](./IMPLEMENTATION_BLUEPRINT_PHASE33_PARTNER_EXPERT_NETWORK.md)
