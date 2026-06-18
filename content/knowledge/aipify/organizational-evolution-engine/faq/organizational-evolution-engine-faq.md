# Organizational Evolution Engine — FAQ

## How does Aipify learn?

Aipify learns from approved operational metadata — workflow outcomes, approval patterns, knowledge usage, customer and support outcomes, and performance signals. Learning is tenant-isolated and transparent. Raw customer communications are not stored in evolution signals.

## How are improvements identified?

The Improvement Opportunity Engine detects workflow, automation, knowledge, training, customer experience, department, and governance improvements from learning signals and operational patterns. Recurring issues, delays, and successes are surfaced for human review.

## How are improvements approved?

Improvements follow the Approved Improvement Framework: suggested → under review → approved → implemented → validated → archived. Human approval is required before operational changes. The Approval Center at `/app/approvals` remains the governance boundary for sensitive actions.

## How is workflow evolution managed?

The Workflow Evolution Engine tracks success rates, failures, delays, approval bottlenecks, and automation candidates. Aipify recommends optimizations; humans approve rollout and monitor outcomes.

## How is knowledge updated?

The Knowledge Evolution Engine tracks frequently used, missing, outdated, and validated knowledge. Aipify recommends updates and ownership assignments — knowledge changes require human review and integrate with the Knowledge Center.

## How is organizational learning measured?

Evolution Analytics tracks improvements suggested, approved, and implemented; workflow optimizations; knowledge improvements; business impact; and improvement velocity. The Executive Evolution Dashboard summarizes organizational learning for leadership review.

## How is this different from the Learning Review Center?

**Learning Review Center** (`/app/learning`) governs how Aipify improves its assistance for your organization. **Organizational Evolution** (`/app/evolution`) governs how your organization improves workflows, knowledge, and operations based on structured operational learning.

## Governance boundaries

- No self-modifying behavior
- No autonomous policy or permission changes
- Human approval required for operational and governance improvements
- Human override always available
- Full audit logging of learning and improvement lifecycle events
