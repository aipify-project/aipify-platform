# Industry Pack Ecosystem — FAQ

## What is an Industry Pack?

An Industry Pack is a specialized bundle on the shared Aipify Business Operating System (ABOS) foundation. It adapts companions, knowledge, workflows, terminology, and dashboards for a specific industry — without creating a separate platform.

## How do Industry Packs work?

Industry Packs inherit core platform capabilities: Companion, Knowledge Center, workforce scaffolds, governance, marketplace, billing, analytics, automation, identity, permissions, audit logging, and multi-language support. Installation is tenant-scoped with independent configuration and governance.

## How are packs installed?

Use **guided installation** or **one-click installation** from the Industry Pack Center at `/app/industry-packs`. Aipify validates dependencies and records an audit event. Humans approve installation — Aipify prepares and configures; it does not silently activate sensitive capabilities.

## How are packs governed?

Governance policies control installation approval, dependency validation, compliance baselines, and marketplace publishing. Policies are scoped per organization and logged in the industry pack audit trail.

## How are packs upgraded?

Upgrades update version labels and health metadata. Rollback support preserves prior install records with `rolled_back` status when administrators remove or revert packs. Review advisor signals before expanding production usage.

## How does Industry Pack licensing work?

Industry Packs respect your subscription plan and module entitlements. Licensed packs appear in **Installed Packs**; available catalog entries appear under **Available Packs** and the Industry Marketplace. Marketplace `industry_pack` items federate with the global catalog at `/app/marketplace`.

## How is this different from Business Packs?

**Business Packs Foundation (A.43)** at `/app/business-packs-foundation-engine` handles modular activation. **Industry Pack Ecosystem (Phase 400)** at `/app/industry-packs` is the industry-specific federation layer — catalog, lifecycle, governance, analytics, and marketplace presentation for vertical operating systems.
