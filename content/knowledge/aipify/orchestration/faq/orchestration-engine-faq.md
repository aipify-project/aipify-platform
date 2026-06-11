---
title: What is Orchestration Engine?
slug: what-is-orchestration-engine
category: orchestration-engine
language: en
visibility: authenticated
status: published
tags: [orchestration, coordination, modules]
article_type: faq
---
Orchestration Engine is the coordination layer that helps Aipify modules work together. It receives events from modules, evaluates context, matches rules, and routes the right next actions through governance and policy rules.

---
title: Why does Aipify need orchestration?
slug: why-does-aipify-need-orchestration
category: orchestration-engine
language: en
visibility: authenticated
status: published
tags: [orchestration, coordination]
article_type: faq
---
Without orchestration, Aipify modules become separate dashboards with duplicate alerts and unclear responsibility. Orchestration creates one brain that coordinates Support AI, Quality Guardian, Action Center, Briefing, Desktop Companion, and more.

---
title: How do Aipify modules work together?
slug: how-do-aipify-modules-work-together
category: orchestration-engine
language: en
visibility: authenticated
status: published
tags: [orchestration, modules]
article_type: faq
---
Modules emit standardized orchestration events. Orchestration matches rules, starts flows, dispatches safe actions to Action Center, Briefing, Desktop, Knowledge Center, Memory, and Learning Engine — always through Policy Engine and Governance when required.

---
title: What happens when Quality Guardian finds a critical issue?
slug: quality-critical-orchestration
category: orchestration-engine
language: en
visibility: authenticated
status: published
tags: [orchestration, quality]
article_type: faq
---
A critical quality incident triggers an orchestration flow that may create an Action Center item, send a Desktop notification, add a Briefing highlight, generate a developer report, and audit every step. Automatic fixes are blocked unless policy allows.

---
title: Why did Aipify create an Action Center item?
slug: why-orchestration-created-action-item
category: orchestration-engine
language: en
visibility: authenticated
status: published
tags: [orchestration, action-center]
article_type: faq
---
Aipify creates Action Center items when an orchestrated event requires attention, follow-up, approval, or human decision-making. Orchestration routes work to the Action Center instead of sending scattered alerts.

---
title: Why did Aipify send a Desktop notification?
slug: why-orchestration-desktop-notification
category: orchestration-engine
language: en
visibility: authenticated
status: published
tags: [orchestration, desktop]
article_type: faq
---
Desktop Companion receives only relevant orchestration dispatches — critical, high, user-assigned, or time-sensitive events. Orchestration avoids notification spam through duplicate suppression and severity thresholds.

---
title: Why was an orchestration flow blocked?
slug: why-orchestration-flow-blocked
category: orchestration-engine
language: en
visibility: authenticated
status: published
tags: [orchestration, governance, policy]
article_type: faq
---
Flows are blocked when Emergency Stop is active, Policy Engine denies an action, Governance requires approval, deployment mode restricts the action, or a step fails. Blocked flows are auditable and can be retried by admins when safe.

---
title: How does Governance affect orchestration?
slug: governance-orchestration
category: orchestration-engine
language: en
visibility: authenticated
status: published
tags: [orchestration, governance]
article_type: faq
---
Governance can pause flows, require approvals, and activate Emergency Stop. Orchestration never bypasses Governance — medium and high-risk actions create approval requests and pause the flow until resolved.

---
title: How does Policy Engine protect orchestration?
slug: policy-engine-orchestration
category: orchestration-engine
language: en
visibility: authenticated
status: published
tags: [orchestration, policy, security]
article_type: faq
---
Before sensitive dispatches (notifications, approvals, security incidents, memory storage), Orchestration calls the Policy Engine. Denied actions are blocked; approval-required actions pause the flow and create governance requests.

---
title: Can Orchestration Engine take actions automatically?
slug: can-orchestration-act-automatically
category: orchestration-engine
language: en
visibility: authenticated
status: published
tags: [orchestration, automation, safety]
article_type: faq
---
It can route low-risk system actions such as briefing highlights and audit logs. Medium and high-risk actions require governance and policy checks. Orchestration does not deploy code, change billing, ban users, or delete data automatically.

---
title: How does Aipify avoid duplicate alerts?
slug: orchestration-duplicate-suppression
category: orchestration-engine
language: en
visibility: authenticated
status: published
tags: [orchestration, duplicates]
article_type: faq
---
When the same event type and source repeats within the duplicate window, Orchestration groups events, updates counts, and suppresses repeated notifications and flows. Existing Action Center items may be updated instead of duplicated.

---
title: Can admins change orchestration rules?
slug: can-admins-change-orchestration-rules
category: orchestration-engine
language: en
visibility: authenticated
status: published
tags: [orchestration, admin, rules]
article_type: faq
---
Admins can view global rules, create tenant overrides, enable or disable tenant rules, and edit conditions and action chains. Global rules cannot be edited by tenants but can be extended with tenant-specific rules.

---
title: How are orchestration flows audited?
slug: orchestration-audit
category: orchestration-engine
language: en
visibility: authenticated
status: published
tags: [orchestration, audit]
article_type: faq
---
Every important orchestration decision is logged in orchestration_audit_log and integrated with the Governance audit timeline. Flows track steps, policy decisions, dispatches, and outcomes.

---
title: What happens when a module fails during orchestration?
slug: orchestration-module-failure
category: orchestration-engine
language: en
visibility: authenticated
status: published
tags: [orchestration, reliability]
article_type: faq
---
Failed steps mark the flow as failed or blocked. Admins can retry safe failed flows. The health monitor detects stuck flows. Orchestration does not retry high-risk blocked steps automatically.

---
title: Can orchestration work in hybrid or on-premise mode?
slug: orchestration-hybrid-on-premise
category: orchestration-engine
language: en
visibility: authenticated
status: published
tags: [orchestration, enterprise, deployment]
article_type: faq
---
Yes. Orchestration respects deployment mode and data residency. Cloud sync dispatches and sensitive notifications are blocked or require redaction when hybrid or on-premise policies restrict them.
