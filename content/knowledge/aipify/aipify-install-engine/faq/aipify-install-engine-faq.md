# Aipify Install Engine — FAQ

## What is this engine?

Aipify Install Engine is a Customer App engine (Phase A.22) with dashboard at `/app/aipify-install-engine`. Business logic lives in Supabase RPCs.

## Who can access it?

Owners and administrators have full access. Managers and support agents have view access where configured. Server-side RPCs enforce permissions.

## Where does business logic live?

All business logic is in Supabase RPCs (_ain_* helpers). API routes and dashboard panels are thin clients.

## Is customer data stored?

Metadata only — no PII, email content, chat, or payment data. Audit events via _mta_create_audit_log dual-write.

## How does it integrate with other engines?

Extends Install Engine (Phase 17) — lib/install/, /api/install/, /app/install. KC initialization on completion.

## What is the Install & Adoption Engine (ABOS)?

The ABOS Install & Adoption framing extends A.22 — Aipify adapts to organizations; organizations should not rebuild around Aipify. See [INSTALL_ADOPTION_ENGINE.md](../../../../INSTALL_ADOPTION_ENGINE.md).

## What is the adoption journey?

1. **Welcome** — introduce Aipify, explain purpose, establish trust  
2. **Discovery** — learn the organization, teams, and priorities  
3. **Assistance** — begin helping, recommend improvements, reduce friction  
4. **Partnership** — embedded in operations, support growth, preserve organizational memory

## What platforms are supported?

WordPress, Shopify, WooCommerce, custom websites, and future business platforms via environment discovery.

## What is the ABOS principle?

> Technology should adapt to people. People should not be forced to adapt entirely to technology.
