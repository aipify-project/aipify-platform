# ABOS Phase 1 — Organization & Workspace Foundation — FAQ

## What is Implementation Blueprint Phase 1?

The first implementation phase of Aipify Business Operating System (ABOS). It establishes Organization → Workspaces → Users → Roles → Permissions → Companion Experiences as the structural foundation every future module depends upon.

## What is the build philosophy?

Build once. Build properly. Scale forever.

## What is the ABOS principle for this phase?

Intelligence without structure creates chaos. Structure without humanity creates rigidity. Aipify combines both.

## Where is Phase 1 implemented?

In the Organization & Workspace Engine (A.75) at `/app/organization-workspace-engine`, extending Multi-Tenant Architecture (A.1) and Identity & Permissions (A.2).

## What dogfood organizations are seeded?

**Aipify Group AS** — Executive Office, Development, Support, Operations, Sales. **Unonight** — Admin, Moderation, Customer Support, Marketplace Operations (pilot mapping to blueprint Support / Operations / Marketplace contexts).

## How are companion preferences configured?

Via `companion_foundation` metadata on organization workspace settings — tone, humor, bell moments, Self Love reminders, recognition, and Presence & Comfort. Saved through `save_organization_companion_foundation` with `workspaces.settings.manage` permission.
