# Security Principles

ABOS is built on **trust by design** — the customer owns the data; Aipify owns the intelligence layer.

## Core rules

- **Tenant isolation** — organizations never access other organizations' data
- **Metadata first** — store patterns and outcomes, not raw customer records unless explicitly approved
- **Read-only first** — new integrations start read-only; write access requires approval
- **Encryption** — data encrypted in transit and at rest (platform infrastructure)
- **Audit logging** — immutable history of user, AI, and administrative actions

## What Aipify refuses to collect

Email content, chat transcripts, payment details, passwords, and prohibited PII categories are blocked by default storage policies.

## Transparency

Customers can review security settings, audit activity, and license/trust disclosures in the Customer App Security Dashboard and License Center.

See [TRUST_ARCHITECTURE.md](../../../../TRUST_ARCHITECTURE.md) for full trust architecture.
