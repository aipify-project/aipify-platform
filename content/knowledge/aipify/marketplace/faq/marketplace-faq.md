---
title: What is Aipify Marketplace?
slug: what-is-aipify-marketplace
category: marketplace
language: en
visibility: authenticated
status: published
tags: [marketplace, ecosystem]
article_type: faq
---
Aipify Marketplace is where organizations discover and install Skills, Business Packs, Knowledge Packs, Workflow Packs, Automation Packs, Integration Packs, and Playbooks. It is Aipify's capability marketplace — not a customer product store.

---
title: What is the difference between Skill Store and Marketplace?
slug: skill-store-vs-marketplace
category: marketplace
language: en
visibility: authenticated
status: published
tags: [marketplace, skill-store]
article_type: faq
---
Skill Store installs individual modular capabilities with dependency and governance checks. Marketplace is the commercial catalog layer that bundles Skills with templates, Knowledge Center content, workflows, and settings into Business Packs and Industry Packs.

---
title: What is a Business Pack?
slug: what-is-a-business-pack
category: marketplace
language: en
visibility: authenticated
status: published
tags: [marketplace, business-pack]
article_type: faq
---
A Business Pack is a bundle of Aipify capabilities, templates, workflows, and Knowledge Center content designed to solve a specific business need — such as Support Starter Pack or Website Quality Pack.

---
title: What is an Industry Pack?
slug: what-is-an-industry-pack
category: marketplace
language: en
visibility: authenticated
status: published
tags: [marketplace, industry]
article_type: faq
---
An Industry Pack is a Business Pack targeted at a specific industry such as e-commerce, restaurants, agencies, or healthcare administration.

---
title: What is a Knowledge Pack?
slug: what-is-a-knowledge-pack
category: marketplace
language: en
visibility: authenticated
status: published
tags: [marketplace, knowledge]
article_type: faq
---
A Knowledge Pack installs prewritten Knowledge Center articles, FAQ content, and admin guides without requiring you to author everything from scratch.

---
title: How do I install a Marketplace item?
slug: how-to-install-marketplace-item
category: marketplace
language: en
visibility: authenticated
status: published
tags: [marketplace, install]
article_type: faq
---
Open Marketplace, browse the catalog, review permissions and risk level on the item detail page, then click Install. Aipify runs a precheck for plan, deployment mode, dependencies, and Policy Engine rules before installation.

---
title: Why does installation require approval?
slug: why-marketplace-install-requires-approval
category: marketplace
language: en
visibility: authenticated
status: published
tags: [marketplace, governance]
article_type: faq
---
Medium and high-risk items request permissions, integrations, or automations. Aipify uses Governance and the Policy Engine to ensure the item is safe before activation. You may need to confirm approval for governed packs.

---
title: What permissions can Marketplace items request?
slug: marketplace-permissions
category: marketplace
language: en
visibility: authenticated
status: published
tags: [marketplace, permissions]
article_type: faq
---
Permissions are declared in each item manifest — for example support.draft.create, quality.scan.read, or governance.approval.create. The item detail page lists all required permissions before you install.

---
title: Can Marketplace items be disabled?
slug: can-marketplace-items-be-disabled
category: marketplace
language: en
visibility: authenticated
status: published
tags: [marketplace, disable]
article_type: faq
---
Yes. Admins can disable installed items from the Installed page. Disabling stops functionality but keeps configuration and data for safe re-enable later.

---
title: Can Marketplace items be uninstalled?
slug: can-marketplace-items-be-uninstalled
category: marketplace
language: en
visibility: authenticated
status: published
tags: [marketplace, uninstall]
article_type: faq
---
Yes. Uninstall removes item configuration and archives related settings. Business data is not deleted without explicit approval. You will see affected dependencies before uninstalling.

---
title: What happens when a Marketplace item is updated?
slug: marketplace-item-updates
category: marketplace
language: en
visibility: authenticated
status: published
tags: [marketplace, updates]
article_type: faq
---
When a new version is published, installed items may show update available. Admins review the changelog and any new permissions before applying updates. Permissions are never added silently.

---
title: How does Aipify check if a Marketplace item is safe?
slug: marketplace-safety-checks
category: marketplace
language: en
visibility: authenticated
status: published
tags: [marketplace, security]
article_type: faq
---
Install precheck validates tenant plan, deployment compatibility, Skill Store dependencies, module licensing, Policy Engine rules, and governance requirements. Restricted items cannot be installed from the general catalog.

---
title: What are official Aipify items?
slug: official-aipify-marketplace-items
category: marketplace
language: en
visibility: authenticated
status: published
tags: [marketplace, official]
article_type: faq
---
Official items are published by Aipify with author_type aipify. They include starter packs for Support, Quality, Governance, Knowledge Center, Desktop Companion, Memory, and Security.

---
title: What are partner items?
slug: partner-marketplace-items
category: marketplace
language: en
visibility: authenticated
status: published
tags: [marketplace, partners]
article_type: faq
---
Partner items are published by approved developers, agencies, or enterprise partners. They require security review through the publish workflow before becoming available for installation.

---
title: How does deployment mode affect Marketplace items?
slug: marketplace-deployment-mode
category: marketplace
language: en
visibility: authenticated
status: published
tags: [marketplace, enterprise]
article_type: faq
---
Each item declares deployment_support (cloud_saas, hybrid, on_premise). Install precheck blocks items incompatible with your tenant deployment mode or when a required Aipify Agent is not registered.
