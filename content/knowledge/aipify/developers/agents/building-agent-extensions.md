---
title: Building Agent Extensions
slug: building-agent-extensions
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, agents]
keywords: [agent extension, collaboration agents, orchestration]
article_type: guide
priority: 11
---
Agent Extensions add capabilities to specialist collaboration agents (Support, Knowledge, Governance, Security, Action, Desktop, Learning, Marketplace, Blueprint).

**Rules:**
- Agents are specialists — not autonomous employees
- Extensions register through agent.extension.register permission
- All agent messages flow through Orchestration and Policy Engine
- Use structured message types: request_information, provide_recommendation, request_approval, create_action, escalate, record_learning

**Example:**
```typescript
defineAgentExtension({
  key: "support.agent.enhancer",
  name: "Support Agent Enhancer",
  permissions: ["support.read", "agent.extension.register"],
  target_agent: "support",
  risk_level: "medium",
});
```

Extensions cannot bypass Governance when Support and Governance disagree — Governance decides.

See /app/agents for agent registry and collaboration event history.
