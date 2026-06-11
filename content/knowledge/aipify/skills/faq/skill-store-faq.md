---
title: What is Skill Store?
slug: what-is-skill-store
category: skill-store
language: en
visibility: authenticated
status: published
tags: [skills, store, catalog]
article_type: faq
---
Skill Store allows organizations to extend Aipify by installing modular capabilities called Skills. Each Skill adds a focused capability — such as Support AI, Quality Guardian, or Memory Engine — without modifying the Aipify core platform.

---
title: Why does Aipify use Skills?
slug: why-does-aipify-use-skills
category: skill-store
language: en
visibility: authenticated
status: published
tags: [skills, architecture, modular]
article_type: faq
---
Skills keep Aipify scalable and unbloated. Businesses activate only the capabilities they need. The core platform stays stable while the ecosystem grows through governed, installable modules.

---
title: How do I install a Skill?
slug: how-do-i-install-a-skill
category: skill-store
language: en
visibility: authenticated
status: published
tags: [skills, install, catalog]
article_type: faq
---
Browse the Skill Store catalog at `/app/skills`, review the description, permissions, dependencies, and risk level, then approve installation. After install, configure settings and activate the Skill for your tenant.

---
title: Can Skills be disabled?
slug: can-skills-be-disabled
category: skill-store
language: en
visibility: authenticated
status: published
tags: [skills, disable, control]
article_type: faq
---
Yes. Administrators can disable installed Skills from the skill detail page or installed list. Disabling stops the Skill from running while preserving audit history and settings according to governance policy.

---
title: How are Skills approved?
slug: how-are-skills-approved
category: skill-store
language: en
visibility: authenticated
status: published
tags: [skills, approval, governance]
article_type: faq
---
Skills declare a risk level. Low-risk read-only Skills may install automatically when permitted by plan. Medium- and high-risk Skills require explicit administrator approval before installation or activation. All approvals are logged.

---
title: What permissions can a Skill request?
slug: what-permissions-can-a-skill-request
category: skill-store
language: en
visibility: authenticated
status: published
tags: [skills, permissions, security]
article_type: faq
---
Each Skill declares required permissions before installation — such as read access to support tickets, quality scans, or memory observations. You review these permissions on the skill detail page. Aipify never grants permissions beyond what the Skill declares and your governance policy allows.

---
title: Can Skills affect other tenants?
slug: can-skills-affect-other-tenants
category: skill-store
language: en
visibility: authenticated
status: published
tags: [skills, tenant, isolation]
article_type: faq
---
No. Skills are tenant-isolated. Installations, settings, audit events, and data access are scoped to your organization. Skills cannot read or modify another tenant's data.

---
title: Are Skills audited?
slug: are-skills-audited
category: skill-store
language: en
visibility: authenticated
status: published
tags: [skills, audit, compliance]
article_type: faq
---
Yes. Install, activate, disable, and update events are recorded in skill install history and linked to the broader Aipify audit system. Administrators can review history at `/app/skills/history`.

---
title: Can Skills add Knowledge Center content?
slug: can-skills-add-knowledge-center-content
category: skill-store
language: en
visibility: authenticated
status: published
tags: [skills, knowledge-center]
article_type: faq
---
Yes. Skills may declare a Knowledge Center category and seed FAQ or guide content during installation. This helps your team understand how each capability works without leaving Aipify.

---
title: What happens when a Skill is updated?
slug: what-happens-when-a-skill-is-updated
category: skill-store
language: en
visibility: authenticated
status: published
tags: [skills, updates, versions]
article_type: faq
---
Skill versions are tracked in the registry. When a new version is published, your tenant may receive an update event. Depending on risk level and governance rules, re-approval may be required before the new version activates.

---
title: Can I build custom Skills?
slug: can-i-build-custom-skills
category: skill-store
language: en
visibility: authenticated
status: published
tags: [skills, developer, custom]
article_type: faq
---
Custom Skills are supported through the Aipify skill registry and developer packages. They must declare permissions, risk level, dependencies, Knowledge Center content, and audit requirements before pilot or production use.

---
title: Can I remove Skills?
slug: can-i-remove-skills
category: skill-store
language: en
visibility: authenticated
status: published
tags: [skills, uninstall, remove]
article_type: faq
---
Yes. Administrators can disable or remove Skills according to governance policies and dependency checks. Skills that other installed Skills depend on cannot be removed until dependents are disabled first.

---
title: What is a Skill dependency?
slug: what-is-a-skill-dependency
category: skill-store
language: en
visibility: authenticated
status: published
tags: [skills, dependencies]
article_type: faq
---
Some Skills require other Skills or platform modules to be installed first — for example, Executive Briefing may depend on Governance or Knowledge Center. The catalog shows missing dependencies before you install.

---
title: Can Skills integrate with Unonight?
slug: can-skills-integrate-with-unonight
category: skill-store
language: en
visibility: authenticated
status: published
tags: [skills, unonight, pilot]
article_type: faq
---
Yes. Unonight acts as an early adopter pilot for Skills such as Support AI, Quality Guardian, Executive Briefing, Desktop Companion, and Memory Engine. Pilot activation is available via the Unonight seed endpoint for approved tenants.

---
title: How does Governance protect Skill installations?
slug: how-does-governance-protect-skill-installations
category: skill-store
language: en
visibility: authenticated
status: published
tags: [skills, governance, safety]
article_type: faq
---
Governance requires every Skill to declare risk level, required permissions, integrations, Knowledge Center content, and audit logging. High-risk Skills that perform actions need explicit approval. Tenant isolation and audit trails ensure organizations stay in control.
