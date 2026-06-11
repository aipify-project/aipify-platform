---
title: Workflow Packs for Developers
slug: workflow-packs-for-developers
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, workflows]
keywords: [workflow pack, approval workflow, incident response]
article_type: guide
priority: 11
---
Workflow Packs provide pre-built approval, incident response, and onboarding workflows.

**Examples:** Approval Workflows, Incident Response, Employee Onboarding

**Permissions:** workflow.template.register, often governance.approval.read

**Risk level:** Typically HIGH — requires Governance review and tenant admin approval on install.

**SDK:**
```typescript
defineWorkflowPack({
  key: "approval.workflow.pack",
  name: "Approval Workflow Pack",
  permissions: ["workflow.template.register", "governance.approval.read"],
  risk_level: "high",
});
```

Workflows must integrate with Orchestration Engine — not execute autonomously outside policy checks.
