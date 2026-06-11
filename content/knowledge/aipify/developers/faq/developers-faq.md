---
title: What is the Aipify Developer Platform?
slug: what-is-the-aipify-developer-platform
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, faq, getting-started]
keywords: [developer platform, extend aipify, app ecosystem]
article_type: faq
priority: 10
---
The Aipify Developer Platform is a secure framework that allows developers, agencies, partners, and enterprise teams to extend Aipify with governed, permission-aware extensions.

---
title: What can I build on Aipify?
slug: what-can-i-build-on-aipify
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, faq]
keywords: [skills, agent extensions, knowledge packs, integrations]
article_type: faq
priority: 10
---
You can build Skills, Agent Extensions, Knowledge Packs, Workflow Packs, Automation Packs, Desktop Extensions, Dashboard Widgets, Integrations, Analytics Modules, and Industry Blueprints. Each extension type declares permissions, risk level, and deployment compatibility in an app manifest.

---
title: What is the Aipify SDK?
slug: what-is-the-aipify-sdk-faq
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, faq, sdk]
keywords: [sdk, defineAipifySkill, API]
article_type: faq
priority: 10
---
The Aipify SDK provides tools, APIs, and helpers required to safely extend Aipify. Use defineAipifySkill, defineAgentExtension, defineDashboardWidget, defineWorkflowPack, and defineKnowledgePack in lib/aipify/app-ecosystem/sdk to produce valid manifests.

---
title: What is an app manifest?
slug: what-is-an-app-manifest-faq
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, faq, manifests]
keywords: [app.manifest.json, manifest, permissions, risk_level]
article_type: faq
priority: 10
---
An app manifest (app.manifest.json) describes identity (name, app_key, version, author), permissions, dependencies, required modules, deployment modes, minimum Aipify version, risk level, and support contact. Every extension must ship a valid manifest before publishing.

---
title: Why are permissions required?
slug: why-are-permissions-required
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, faq, permissions]
keywords: [permissions, governance, policy engine]
article_type: faq
priority: 10
---
Permissions allow Governance and Policy Engine to evaluate whether an extension is safe for a tenant. Request only what you need — least privilege is required. Examples: support.read, knowledge.read, dashboard.widget.register, workflow.template.register.

---
title: Can apps access the database directly?
slug: can-apps-access-database-directly
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, faq, sandbox, security]
keywords: [database, direct access, sandbox]
article_type: faq
priority: 10
---
No. Apps cannot access the database directly. Third-party extensions run in Sandbox Runtime and interact only through approved Aipify APIs scoped to declared permissions and tenant context.

---
title: What is Sandbox Runtime?
slug: what-is-sandbox-runtime-faq
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, faq, sandbox]
keywords: [sandbox runtime, isolation, security]
article_type: faq
priority: 10
---
Sandbox Runtime isolates extensions to protect the platform. Restrictions include no unrestricted filesystem access, no unrestricted database access, no direct secret access, no cross-tenant access, and no Governance or Policy Engine bypass.

---
title: Can apps bypass Governance?
slug: can-apps-bypass-governance
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, faq, governance]
keywords: [governance, bypass, security]
article_type: faq
priority: 10
---
No. Apps are guests inside Aipify — they never become owners. No app may override Governance, disable Security controls, disable audit logging, or modify Core permissions.

---
title: Can apps bypass Policy Engine?
slug: can-apps-bypass-policy-engine
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, faq, governance]
keywords: [policy engine, bypass]
article_type: faq
priority: 10
---
No. Every install and publish request is evaluated by Policy Engine for permissions, tenant restrictions, deployment compatibility, and risk level.

---
title: Can apps access secrets?
slug: can-apps-access-secrets
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, faq, security]
keywords: [secrets, credentials, security]
article_type: faq
priority: 10
---
No. Apps must never access secrets directly. Integrations use governed connection flows and tenant-scoped credentials managed by Aipify — not raw secret injection into extension code.

---
title: Can I build Agent Extensions?
slug: can-i-build-agent-extensions-faq
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, faq, agents]
keywords: [agent extension, collaboration agents]
article_type: faq
priority: 10
---
Yes, through approved interfaces. Use defineAgentExtension and register capabilities that collaborate with specialist agents (Support, Knowledge, Governance, etc.) under Orchestration — never as autonomous bypass paths.

---
title: How do I publish an app?
slug: how-do-i-publish-an-app-faq
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, faq, publishing]
keywords: [publish, review, security scan]
article_type: faq
priority: 10
---
Build → Test locally → Validate manifest → Security scan → Governance review → Submit for review → Publish to Marketplace. Use POST /api/aipify/apps/submit-review after local validation passes.

---
title: Can I sell apps?
slug: can-i-sell-apps-faq
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, faq, marketplace]
keywords: [sell apps, monetization, marketplace]
article_type: faq
priority: 10
---
Future Marketplace models support commercial offerings. V1 focuses on secure distribution through partner tiers (verified developer, agency partner, enterprise partner) and governed publishing — not revenue share billing.

---
title: Why was my app rejected?
slug: why-was-my-app-rejected
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, faq, publishing, troubleshooting]
keywords: [rejected, review, permissions]
article_type: faq
priority: 10
---
Common reasons: excessive permissions, security concerns, missing documentation, invalid manifest, policy violations, dependency safety issues, or governance incompatibility. Review notes appear on the publish request — reduce permissions and resubmit.

---
title: Can organizations disable apps?
slug: can-organizations-disable-apps
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, faq, governance]
keywords: [disable apps, tenant admin]
article_type: faq
priority: 10
---
Yes. Tenant admins can disable or uninstall apps from /app/apps. Disabled apps stop participating in coordinated flows while remaining in the registry for audit history.

---
title: What is tenant isolation?
slug: what-is-tenant-isolation-developers
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, faq, security]
keywords: [tenant isolation, multi-tenant]
article_type: faq
priority: 10
---
Every organization operates within its own isolated environment. Extensions cannot read or write another tenant's data. Cross-tenant access is explicitly forbidden in Sandbox Runtime.

---
title: Can extensions modify Aipify Core?
slug: can-extensions-modify-aipify-core
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, faq, security]
keywords: [core, modify, platform]
article_type: faq
priority: 10
---
No. Extensions cannot modify Aipify Core code, billing, permissions, or platform security controls. They register capabilities through the App Runtime and operate as governed guests.

---
title: What is the App Ecosystem?
slug: what-is-the-app-ecosystem
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, app-ecosystem]
article_type: faq
---
The App Ecosystem lets approved developers build extensions for Aipify — Skills, agent extensions, knowledge packs, workflow packs, dashboard widgets, and integrations. Every app is permission-aware, sandboxed, governed, and auditable.

---
title: How do I build an app?
slug: how-do-i-build-an-app
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, sdk]
article_type: faq
---
Start at the Developer Portal (/developers). Use the Aipify SDK helpers (defineAipifySkill, defineAgentExtension, etc.) to build your manifest, validate locally, then submit for review. Published apps appear in the App Registry and Marketplace.

---
title: What permissions can apps request?
slug: what-permissions-can-apps-request
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, permissions]
article_type: faq
---
Examples include support.read, knowledge.read, dashboard.widget.register, workflow.template.register, and integration.external.connect. Policy Engine validates every permission at install time against tenant restrictions and app risk level.

---
title: How does Sandbox work?
slug: how-does-sandbox-work
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, sandbox, security]
article_type: faq
---
Third-party apps execute in Aipify Sandbox Runtime with no unrestricted filesystem or database access, no direct secret access, no cross-tenant access, and no Governance or Policy Engine bypass.

---
title: How are apps reviewed?
slug: how-are-apps-reviewed
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, review]
article_type: faq
---
Review verifies manifest correctness, permission requests, dependency safety, security requirements, documentation quality, and governance compatibility through validation, security scan, and Policy Engine governance review.

---
title: What happens if an app violates policies?
slug: app-policy-violation
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, governance]
article_type: faq
---
Policy violations block installation or publishing. Installed apps can be disabled or uninstalled by tenant admins. All install, update, and removal events are audit-logged. Restricted apps cannot be installed without explicit governance approval.
