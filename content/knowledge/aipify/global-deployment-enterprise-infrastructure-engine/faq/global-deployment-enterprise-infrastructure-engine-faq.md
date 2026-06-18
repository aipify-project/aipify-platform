# Global Deployment & Enterprise Infrastructure Engine — FAQ

## How does global deployment work?

The Global Deployment Center at `/app/infrastructure/global` provides a unified framework for multi-region operations, country management, deployment models, and infrastructure governance. Aipify supports multi-tenant cloud, dedicated cloud, private cloud, hybrid cloud, on-premise, and air-gapped deployment models — configured per tenant with full audit logging.

## How does localization work?

The Localization Engine tracks languages, currencies, date formats, time zones, and regional formatting. Core languages include English, Norwegian, Swedish, Danish, Polish, and Ukrainian. Future languages (German, French, Spanish, and others) can be planned as `future` status locales. Localization is tenant-scoped — each organization configures adoption and regional policies independently.

## How are regions managed?

Regional Management supports North America, Europe, Nordics, United Kingdom, Asia Pacific, Middle East, Africa, Latin America, and custom regions. Each region tracks active countries, status, and governance summary. Regions link to country records, compliance policies, and deployment scopes.

## How does data residency work?

Data Residency Management supports regional storage, country storage, enterprise storage, hybrid storage, on-premise storage, and private infrastructure configurations. Residency rules integrate with the Regional Compliance Engine — privacy, retention, and audit requirements are tracked per region scope. Customer data ownership principles from the Trust Architecture apply; Aipify stores governance metadata, not operational business records, unless explicitly approved.

## What deployment models are available?

Supported deployment models:

- **Multi-tenant cloud** — default Aipify cloud
- **Dedicated cloud** — isolated tenant infrastructure in a region
- **Private cloud** — customer-controlled private environment
- **Hybrid cloud** — combined cloud and dedicated storage
- **On-premise** — customer-hosted deployment
- **Air-gapped** — isolated deployment with no external connectivity

Enterprise plans may enable additional models — contact your administrator for availability.

## How is global governance maintained?

Global governance ensures tenant isolation, regional compliance support, deployment flexibility, and human approval for sensitive configuration changes. Audit logs track region creation, country additions, localization updates, compliance policy changes, deployment creation, and infrastructure updates. Platform Admin sees aggregates only — customer global configuration remains tenant-scoped.

## How is this different from Global Expansion?

**Global Expansion** (`/app/global-expansion`) focuses on market expansion strategy and growth planning. **Global Deployment Center** (`/app/infrastructure/global`) is the Phase 424 infrastructure framework — regions, countries, localization, compliance, data residency, deployment models, and enterprise infrastructure profiles.

## Related routes

- `/app/infrastructure/global` — Global Deployment Center (Phase 424)
- `/app/global-expansion` — Global expansion engine
- `/app/deployment-environment-management-engine` — Deployment environment management
- `/app/observability-platform-health-engine` — Platform observability
- `/app/settings/security` — Security and trust settings
