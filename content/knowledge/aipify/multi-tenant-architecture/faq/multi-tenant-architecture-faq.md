# Multi-Tenant Architecture — FAQ

## What is a tenant in Aipify?

A tenant is a customer organization inside Aipify. Each tenant has its own users, settings, enabled modules, Knowledge Center, integrations, and audit logs.

## Why is Aipify multi-tenant?

Aipify is multi-tenant so it can serve many companies from one central platform while keeping each company's data isolated and secure.

## Can one customer see another customer's data?

No. Aipify must enforce strict tenant isolation. Users can only access organizations where they have an active membership.

## Is Unonight part of Aipify?

No. Unonight is the first pilot customer connected to Aipify. Aipify remains a standalone SaaS platform.

## Why does every table need organization_id?

organization_id ensures that tenant-owned data is always connected to the correct customer organization and prevents cross-tenant access.

## What happens when a tenant enables a module?

The module becomes available only for that organization, based on its subscription plan, permissions, and configuration.

## Can users belong to multiple organizations?

Yes. A user may belong to multiple organizations and must select the active organization context before working.

## Why are audit logs tenant-aware?

Audit logs must show which organization an action belongs to so each customer has a clear and secure activity history.

## Can Aipify be customized per customer?

Yes. Each tenant can have its own settings, branding, languages, modules, integrations, and approval policies.

## Why should Aipify Group AS be a tenant?

Aipify should use its own platform internally to test workflows, support, onboarding, and operational automation before selling modules externally.
