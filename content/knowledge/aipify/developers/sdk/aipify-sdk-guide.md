---
title: Aipify SDK Guide
slug: aipify-sdk-guide
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, sdk]
keywords: [defineAipifySkill, defineAgentExtension, SDK_VERSION]
article_type: guide
priority: 12
---
The Aipify SDK lives in lib/aipify/app-ecosystem/sdk.ts (SDK v1.0.0).

**Register a Skill:**
```typescript
defineAipifySkill({
  key: "support.sentiment",
  name: "Support Sentiment",
  permissions: ["support.read"],
  risk_level: "medium",
});
```

**Register an Agent Extension:**
```typescript
defineAgentExtension({
  key: "support.agent.enhancer",
  name: "Support Agent Enhancer",
  permissions: ["support.read", "agent.extension.register"],
  target_agent: "support",
});
```

**Register a Dashboard Widget:**
```typescript
defineDashboardWidget({
  key: "kpi.dashboard.widget",
  name: "KPI Dashboard Widget",
  permissions: ["dashboard.widget.register"],
});
```

**Register a Workflow Pack:**
```typescript
defineWorkflowPack({
  key: "approval.workflow.pack",
  name: "Approval Workflow Pack",
  permissions: ["workflow.template.register", "governance.approval.read"],
  risk_level: "high",
});
```

The SDK produces manifests compatible with validate_app_manifest and the publish workflow.
