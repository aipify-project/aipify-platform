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
title: What is the SDK?
slug: what-is-the-aipify-sdk
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, sdk]
article_type: faq
---
The Aipify SDK (lib/aipify/app-ecosystem/sdk) helps developers register Skills, agent extensions, dashboard widgets, workflow packs, and knowledge packs with consistent manifest structure and permission declarations.

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
title: How do I publish an app?
slug: how-do-i-publish-an-app
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, publishing]
article_type: faq
---
Build your app, run manifest validation, pass security scan and governance review, then submit via submit_ecosystem_app_review. After approval, the app is published to the ecosystem registry and Marketplace.

---
title: Can I sell apps?
slug: can-i-sell-apps
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, marketplace]
article_type: faq
---
Monetization and revenue share are not part of V1. Partner tiers (verified developer, agency partner, enterprise partner) support distribution and review workflows. Marketplace pricing models may apply to published packs separately.

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
