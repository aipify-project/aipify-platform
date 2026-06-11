---
title: Developer Permission Model
slug: developer-permission-model
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, permissions]
keywords: [support.read, knowledge.read, least privilege]
article_type: guide
priority: 11
---
Apps declare permissions in their manifest. Policy Engine validates each permission at install time.

**Common permissions:**
- support.read — Read support context (drafts, tickets)
- support.draft.create — Create support drafts (medium risk)
- knowledge.read — Search Knowledge Center
- knowledge.article.create — Propose FAQ articles
- dashboard.widget.register — Register dashboard widgets
- desktop.notification.create — Send desktop notifications
- workflow.template.register — Register workflow templates
- marketplace.publish — Submit marketplace items (restricted)
- integration.external.connect — External CRM/ERP connectors (high risk)
- agent.extension.register — Extend collaboration agents

**Risk levels:**
- LOW — Knowledge packs, dashboard widgets
- MEDIUM — Support skills, desktop extensions
- HIGH — Workflow packs, external integrations
- RESTRICTED — Approval tools, security extensions

Always request minimal permissions. Excessive permissions are a common rejection reason.
