---
title: What is an Aipify Agent?
slug: what-is-an-aipify-agent
category: agents
language: en
visibility: authenticated
status: published
tags: [agents, collaboration]
article_type: faq
---
An Aipify Agent is a specialist AI role with a clearly defined responsibility, limited tools, permissions, and governance restrictions. Agents provide expertise — they are not autonomous employees.

---
title: Why does Aipify use multiple agents?
slug: why-multiple-agents
category: agents
language: en
visibility: authenticated
status: published
tags: [agents]
article_type: faq
---
Multiple agents mirror how organizations work: support, knowledge, quality, governance, security, and action each have distinct expertise. The Orchestration Engine coordinates them so no single assistant tries to do everything unsafely.

---
title: Can agents work independently?
slug: can-agents-work-independently
category: agents
language: en
visibility: authenticated
status: published
tags: [agents, governance]
article_type: faq
---
No. Agents never operate without oversight. Every action flows through Orchestration, Policy Engine checks, and Governance for high-risk operations. Agents cannot bypass Security or tenant isolation.

---
title: How do agents collaborate?
slug: how-agents-collaborate
category: agents
language: en
visibility: authenticated
status: published
tags: [agents, orchestration]
article_type: faq
---
Agents communicate through structured message types (request information, provide recommendation, request approval, create action, escalate, record learning). All exchanges are logged as collaboration events and audited.

---
title: Can I disable an agent?
slug: can-i-disable-an-agent
category: agents
language: en
visibility: authenticated
status: published
tags: [agents]
article_type: faq
---
Yes. Open the agent detail page and toggle enable/disable for your tenant. Disabled agents remain in the registry but do not participate in coordinated flows.

---
title: How are agent permissions controlled?
slug: how-agent-permissions-controlled
category: agents
language: en
visibility: authenticated
status: published
tags: [agents, permissions]
article_type: faq
---
Each agent has explicit capabilities and permissions seeded in the registry. Policy Engine evaluates agent identity, requested action, tenant permissions, risk level, and data classification before execution.

---
title: Are agent actions audited?
slug: are-agent-actions-audited
category: agents
language: en
visibility: authenticated
status: published
tags: [agents, audit]
article_type: faq
---
Yes. Agent requests, recommendations, approvals, escalations, failures, and outcomes are logged in collaboration audit logs and agent event history.

---
title: How are agent recommendations generated?
slug: how-agent-recommendations-generated
category: agents
language: en
visibility: authenticated
status: published
tags: [agents]
article_type: faq
---
Specialist agents analyze their domain (support drafts, knowledge gaps, quality issues, pack opportunities) and emit structured recommendations. Orchestration coordinates which recommendations proceed to actions.

---
title: What happens when agents disagree?
slug: what-happens-when-agents-disagree
category: agents
language: en
visibility: authenticated
status: published
tags: [agents, governance]
article_type: faq
---
Agents never vote. When Support suggests sending a response but Governance requires approval, Governance wins. High-risk and restricted actions always defer to Governance and Policy Engine.

---
title: How does Governance affect agents?
slug: how-governance-affects-agents
category: agents
language: en
visibility: authenticated
status: published
tags: [agents, governance]
article_type: faq
---
Governance Agent reviews approvals, assesses risk, and enforces policies. No agent may modify billing, change permissions, delete data, publish externally, or execute restricted automations without Governance approval.
