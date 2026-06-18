# Real-World Actions & Service Orchestration — FAQ

## What are Real-World Actions?

Real-World Actions allow Aipify to coordinate approved operational work with external providers — scheduling, bookings, reservations, transportation, deliveries, purchasing, vendor coordination, and custom governed actions. Aipify prepares and orchestrates; your organization approves and decides.

## How do approvals work?

Actions are classified by risk level (low, medium, high, critical, human reserved). Medium and higher risk actions require approval before execution. Approval types include personal, manager, finance, compliance, executive, and multi-step workflows. Pending approvals appear in the Real-World Actions center and link to the broader Approval Center at `/app/approvals`.

## How are providers selected?

Service providers are registered in the provider directory with category, region, capabilities, integration type, and approval requirements. Orchestration supports single provider, multi-provider, sequential, parallel, and fallback provider patterns. Provider selection respects tenant-approved and preferred vendor tiers.

## How are actions governed?

Governance rules enforced by default:

- No irreversible actions without explicit approval
- No financial commitments without authorization
- No external commitments without governance review
- Human override always available

All action lifecycle events are audited.

## How are execution failures handled?

Failed executions are tracked with status, failure reason, and recovery status. Aipify surfaces intelligence signals and companion advisor recommendations. Recovery workflows can be initiated from the Executions module; humans decide whether to retry, change provider, or escalate.

## How is audit logging maintained?

Every significant event is logged: action requested, approval requested/granted/rejected, provider selected, execution started/completed/failed, recovery initiated, and dashboard views. Audit history is tenant-isolated and visible in the Audit History module.

## How is this different from Action Center?

**Action Center** (`/app/action-center`) governs autonomous in-platform execution (AEF). **Real-World Actions** (`/app/actions`) governs external service orchestration with providers and vendors. **Action Hub** (`/app/actions/inbox`) remains the personal/team task inbox.
