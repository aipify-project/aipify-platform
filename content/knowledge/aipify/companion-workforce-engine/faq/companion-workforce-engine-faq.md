# Companion Workforce Engine — FAQ

## What is the Companion Workforce Center?

The **Coordinated Companion Workforce Engine (Phase 132)** at `/app/companion-workforce-engine` is Aipify's workforce coordination center. It organizes specialized Companions as teams with clear responsibilities, collaboration rules, routing, and human oversight — not a single super-assistant.

## How is this different from Multi-Agent Collaboration (Phase 74)?

Phase 74 at `/app/agents` is the **agent registry and orchestration** layer. Phase 132 is the **companion workforce coordination center** using Companion terminology and responsibility frameworks. Cross-link only — do not duplicate Phase 74 RPCs.

## How is this different from Companion Marketplace (Phase 113)?

Phase 113 at `/app/companion-marketplace` is the **digital employee catalog and deployment** marketplace. Phase 132 coordinates **already-defined companion roles** inside your organization. Cross-link only.

## What about Phase 131 Autonomy Governance?

Phase 131 is marked complete in the product roadmap but **has no dedicated migration in this repo yet**. Until it ships, use **Human Oversight A.40** at `/app/human-oversight-engine` for oversight gates and approval workflows.

## What companion roles are included?

Ten default roles seed on first dashboard load: Executive, Support, Knowledge, Commerce, Growth Partner, Governance, Transformation, Community, Resilience, and Operations — each linking to existing engine routes where available.

## Does Aipify surveil employees through companion health?

No. Companion health indicators (task quality, escalation frequency, knowledge usage, human satisfaction, adoption, contribution, collaboration success) are **aggregate metadata only** — never individual ranking or surveillance.

## What can companions never do?

Never expand authority silently, redefine responsibilities, suppress escalation, bypass governance, or override humans. Humans lead; companions support within governance frameworks.

## What permissions are required?

- `companion_workforce.view` — view dashboard and directory
- `companion_workforce.manage` — configure settings and routing (owner/administrator)

## Is Growth Partner the same as Affiliate?

No. Aipify uses **Growth Partner** terminology everywhere — never Affiliate.

## Where does Self Love connect?

Phase 132 cross-links **Self Love A.76** at `/app/self-love-engine` for meaningful work, healthy collaboration, recognition, balanced workloads, and psychological safety.

## Where is two-factor authentication configured?

Security requirements cross-link **Two-Factor Authentication** at `/app/settings/two-factor`.

## What data is stored?

Metadata only in directory entries, collaborations, routing rules, and conflicts — no PII, no raw chat, no email content.
