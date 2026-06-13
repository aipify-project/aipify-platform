# Implementation Blueprint — Phase 34: API & Developer Platform

**Feature owner:** Customer App  
**Implementation:** [API Platform Engine — Phase A.21](./supabase/migrations/20260982000000_api_platform_engine_phase_a21.sql) · [App Ecosystem & Developer Platform (Phase 75)](./APP_ECOSYSTEM_DEVELOPER_PLATFORM_PHASE75.md)

This document defines **Phase 34 — API & Developer Platform** of the Aipify Business Operating System (ABOS). It promotes API Platform Engine Phase A.21 from scaffold to full Customer App engine — secure tenant APIs, developer governance, and extensibility cross-links.

> **Mapping:** ABOS Implementation Blueprint Phase 34 maps to **API Platform Engine Phase A.21** at `/app/api-platform-engine`. Do not duplicate App Ecosystem (Phase 75), Developer Portal (`/developers`), or Integration Engine (A.8) — cross-link only.

## Mission

Empower developers to integrate, customize, and build upon Aipify through secure APIs, documentation, and extensibility.

## Core philosophy

**Developers should integrate confidently — governance visible, secrets never stored in plain text, extensibility grows adoption.**

## Developer objectives

| Objective | Description |
|-----------|-------------|
| Public APIs | Documented REST endpoints for core tenant operations |
| Partner APIs | Sales Expert Portal, commission tracking, lifecycle visibility |
| Secure authentication | Scoped API keys with prefix/hash storage and expiration |
| API key management | Human approval for elevated scopes — never store full keys |
| Webhooks | Event subscriptions with secret_ref vault references only |
| Developer documentation | Interactive docs, examples, SDK references at `/developers` |
| Sandbox environments | Isolated testing with metadata-only scaffold data |

## API categories

### Core

Organizations · Users · Permissions · Knowledge Center · Tasks · Support

### Companion

Conversations · Notifications · Bell moments · Recognition events

### Commerce

Products · Orders · Commerce intelligence · Financial events

### Partner

Sales Expert Portal · Commission tracking · Customer lifecycle visibility

## Developer experience

Interactive documentation, example code, SDKs, API explorers, and testing environments — metadata scaffold cross-linked to `/developers` and `/app/settings/developer`.

## Security principles

Scoped permissions · Audit logging · Rate limits · Token expiration · Secure secret handling · Elevated scope approval

## Trust connection

Developers and administrators should understand available permissions, usage expectations, governance requirements, and security responsibilities. Customer tenant API platform only — distinct from Platform Admin `/api/platform/*`.

## Distinctions (cross-link, do not duplicate)

| Surface | Route | Purpose |
|---------|-------|---------|
| **App Ecosystem (Phase 75)** | `/app/apps` | Installed apps, catalog, install flow |
| **Developer Portal** | `/developers` | SDK, manifest spec, sandbox, publishing |
| **Developer Settings** | `/app/settings/developer` | Tokens, diagnostics — no raw tokens for standard users |
| **Integration Engine (A.8)** | `/app/integration-engine` | Connector credentials and sync boundaries |
| **Identity & Permissions (A.75)** | `/app/identity-access` | Role-based access and workspace governance |
| **Audit & Accountability (A.5)** | `/app/audit-accountability` | Immutable audit trails |
| **Marketplace & Partner (A.45)** | `/app/marketplace-partner-ecosystem-foundation-engine` | Sales Expert Portal and partner metadata |

## Dogfooding

| Organization | Role |
|--------------|------|
| **Aipify Group** | Internal — API key lifecycle, webhook metadata, audit logging, sandbox testing |
| **Unonight** | First external pilot — integration experiences and developer onboarding |

## Success criteria (live)

Computed by `_apdbp_success_criteria()`:

1. Developers build securely (scoped keys and audit logging active)
2. Integrations accelerate adoption (webhooks and developer portal linked)
3. Partner capabilities expand (partner API categories documented)
4. Extensibility increases (developer experience surfaces cross-linked)
5. Governance strong (elevated scopes require approval)
6. Sandbox available for safe testing

## RPCs and migration

| RPC | Purpose |
|-----|---------|
| `_api_*()` | Phase A.21 base engine helpers |
| `_apdbp_*()` | Phase 34 blueprint metadata helpers |
| `_apdbp_engagement_summary(org_id)` | Live API platform counts |
| `_apdbp_success_criteria(org_id)` | Live Phase 34 success criteria |
| `get_api_platform_engine_dashboard()` | Extended with Phase 34 fields — **all A.21 fields preserved** |
| `get_api_platform_engine_card()` | Compact blueprint reference |

Migrations:

- `supabase/migrations/20260982000000_api_platform_engine_phase_a21.sql`
- `supabase/migrations/20260982000001_implementation_blueprint_phase34_api_developer_platform.sql`

## ABOS principle

Extensibility increases when developers can build securely upon a platform they trust.

## Vision

Integrations accelerate adoption when APIs are scoped, auditable, and well documented — because governance strengthens when every key has a clear purpose.
