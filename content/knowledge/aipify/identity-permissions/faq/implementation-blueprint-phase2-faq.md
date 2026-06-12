# ABOS Phase 2 — User, Role & Permission Foundation — FAQ

## What is Implementation Blueprint Phase 2?

The second implementation phase of Aipify Business Operating System (ABOS). It establishes secure identity management, roles, and permissions — the right access at the right time — atop Phase 1 organizational structure.

## What is the build philosophy?

Least privilege by default. Humans decide. Aipify prepares and enforces.

## What is the ABOS principle for this phase?

Access without accountability erodes trust. Accountability without empathy erodes adoption. Aipify balances both.

## Where is Phase 2 implemented?

In the Identity, Roles & Permission Engine (A.2) at `/app/identity-access`, extending Organization & Workspace Engine (A.75) and Multi-Tenant Architecture (A.1).

## What are the default roles?

Super Admin (Platform Admin only), Org Owner, Administrator, Executive, Manager, Support Agent, Moderator, Employee, Viewer, plus custom workspace roles.

## What are the permission categories?

Organization, workspace, knowledge, support, companion, and admin — each grouping related permission keys from the global catalog.

## How are access review settings saved?

Via `save_identity_access_review_settings` with `settings.manage` permission. Settings are stored as metadata on organization workspace settings and integrate with Security & Trust (A.18).

## How are companion permission preferences configured?

Via `save_identity_companion_permission_prefs` with `settings.manage` permission. Self Love boundary flag is scaffold until Self Love Engine (A.76) ships.

## Why do medium and high-risk AI actions require approval?

Approvals reduce risk and ensure sensitive actions receive human oversight. Only low-risk actions may execute automatically.
