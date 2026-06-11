---
title: What is Action Center?
slug: what-is-action-center
category: action-hub
language: en
visibility: authenticated
status: published
tags: [actions, decision-hub, execution]
article_type: faq
---
Action Center is Aipify's decision and execution hub where important recommendations become actionable tasks. It answers: "What should I do now?"

---
title: Why did Aipify recommend this action?
slug: why-did-aipify-recommend-this-action
category: action-hub
language: en
visibility: authenticated
status: published
tags: [actions, recommendations, rationale]
article_type: faq
---
Recommendations are generated from incidents, workflows, patterns, predictions, and governance rules across modules such as Quality Guardian, Memory Engine, Knowledge Center, and Executive Briefing. Each action includes a rationale when available.

---
title: How are actions prioritized?
slug: how-are-actions-prioritized
category: action-hub
language: en
visibility: authenticated
status: published
tags: [actions, priority, severity]
article_type: faq
---
Actions are ranked by priority (Critical, High, Medium, Low, Informational) and priority score. Critical quality incidents and pending governance approvals surface first. The dashboard shows My Actions, Critical Actions, and Recommended Actions separately.

---
title: Can actions be delegated?
slug: can-actions-be-delegated
category: action-hub
language: en
visibility: authenticated
status: published
tags: [actions, assign, delegate]
article_type: faq
---
Yes. Administrators can assign actions to appropriate users based on roles and responsibilities. Assignment history is recorded in action assignments and decision logs.

---
title: Can actions be dismissed?
slug: can-actions-be-dismissed
category: action-hub
language: en
visibility: authenticated
status: published
tags: [actions, dismiss, control]
article_type: faq
---
Yes. You can dismiss actions that are not relevant. Dismissed actions are retained for audit and learning but removed from active queues.

---
title: What actions require approval?
slug: what-actions-require-approval
category: action-hub
language: en
visibility: authenticated
status: published
tags: [actions, approval, governance]
article_type: faq
---
High-risk actions — such as governance approvals, marketplace moderation, and support draft reviews — are marked as requiring approval and start in Waiting Approval status until an administrator approves them.

---
title: Can Action Center learn from decisions?
slug: can-action-center-learn-from-decisions
category: action-hub
language: en
visibility: authenticated
status: published
tags: [actions, learning, feedback]
article_type: faq
---
Yes. Action feedback and decision history feed Memory Engine and future prioritization. Mark actions as helpful or not helpful to improve recommendations over time.

---
title: How does Memory Engine influence actions?
slug: how-does-memory-engine-influence-actions
category: action-hub
language: en
visibility: authenticated
status: published
tags: [actions, memory, patterns]
article_type: faq
---
When Memory Engine detects recurring patterns, it creates memory recommendations that Action Center collects as actionable items with rationale from observed workflows.

---
title: Can Action Center create reminders?
slug: can-action-center-create-reminders
category: action-hub
language: en
visibility: authenticated
status: published
tags: [actions, reminders, desktop]
article_type: faq
---
Action Center integrates with Desktop Companion. Reminder-type items can link to Desktop Companion, and recommended due dates help teams follow up on time.

---
title: Can Action Center assign tasks automatically?
slug: can-action-center-assign-tasks-automatically
category: action-hub
language: en
visibility: authenticated
status: published
tags: [actions, auto-assign, settings]
article_type: faq
---
Automatic assignment is configurable in Action Center settings. When enabled, Aipify can suggest owners based on recommended_owner roles and module defaults.

---
title: What happens when an action becomes blocked?
slug: what-happens-when-an-action-is-blocked
category: action-hub
language: en
visibility: authenticated
status: published
tags: [actions, blocked, status]
article_type: faq
---
Blocked actions appear in the Blocked Items section. They typically depend on another approval, missing dependency, or governance hold. Resolve the blocker, then move the action back to In Progress.

---
title: Does Action Center replace project management software?
slug: does-action-center-replace-pm-software
category: action-hub
language: en
visibility: authenticated
status: published
tags: [actions, pm, scope]
article_type: faq
---
No. Action Center focuses on operational decisions surfaced by Aipify intelligence — approvals, quality alerts, knowledge gaps, and module recommendations — not full project planning.

---
title: Can Action Center work with Unonight?
slug: can-action-center-work-with-unonight
category: action-hub
language: en
visibility: authenticated
status: published
tags: [actions, unonight, pilot]
article_type: faq
---
Yes. Unonight pilot actions include reviewing verifications, approving marketplace listings, reviewing support drafts, resolving Quality Guardian alerts, and following up knowledge gaps.

---
title: How does Governance protect Action Center?
slug: how-does-governance-protect-action-center
category: action-hub
language: en
visibility: authenticated
status: published
tags: [actions, governance, audit]
article_type: faq
---
Governance requires approval for high-risk actions, enforces tenant isolation, limits visibility by permissions, and logs every decision to the audit timeline via `_tacc_log_audit`.

---
title: How are completed actions used for improvement?
slug: how-are-completed-actions-used-for-improvement
category: action-hub
language: en
visibility: authenticated
status: published
tags: [actions, completed, learning]
article_type: faq
---
Completed and dismissed actions remain in history. Feedback, decision types, and completion patterns help Memory Engine and future collectors prioritize more relevant recommendations.
