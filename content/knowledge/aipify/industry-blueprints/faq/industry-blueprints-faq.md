---
title: What is an Industry Blueprint?
slug: what-is-an-industry-blueprint
category: industry-blueprints
language: en
visibility: authenticated
status: published
tags: [industry-blueprints, onboarding]
article_type: faq
---
An Industry Blueprint is a recommended Aipify setup for a specific type of business. It can suggest Skills, Marketplace Packs, workflows, Knowledge Center content, Quality checks, Governance settings, and briefings.

---
title: Why does Aipify ask what type of business I run?
slug: why-aipify-asks-business-type
category: industry-blueprints
language: en
visibility: authenticated
status: published
tags: [industry-blueprints, discovery]
article_type: faq
---
Different organizations need different operating models. A restaurant, e-commerce store, law firm, and municipality do not need the same default setup. Industry Blueprints use your business type to recommend relevant capabilities faster.

---
title: Can I change my Industry Blueprint later?
slug: can-i-change-industry-blueprint
category: industry-blueprints
language: en
visibility: authenticated
status: published
tags: [industry-blueprints, settings]
article_type: faq
---
Yes. You can change or adjust your Industry Blueprint as your business grows or changes focus. Open Industry Blueprints settings to update your industry profile and regenerate recommendations.

---
title: Does a Blueprint install everything automatically?
slug: does-blueprint-auto-install
category: industry-blueprints
language: en
visibility: authenticated
status: published
tags: [industry-blueprints, governance]
article_type: faq
---
No. Aipify recommends a setup based on your industry, but administrators review and approve what should be applied. High-risk items require explicit approval.

---
title: How are Blueprint recommendations chosen?
slug: how-blueprint-recommendations-chosen
category: industry-blueprints
language: en
visibility: authenticated
status: published
tags: [industry-blueprints, recommendations]
article_type: faq
---
Recommendations are generated from the official blueprint manifest for your selected industry, filtered by what is already installed, your deployment mode, business size, goals, and Marketplace availability.

---
title: What is the difference between a Blueprint and a Business Pack?
slug: blueprint-vs-business-pack
category: industry-blueprints
language: en
visibility: authenticated
status: published
tags: [industry-blueprints, marketplace]
article_type: faq
---
A Business Pack is a bundled Marketplace item you install directly. An Industry Blueprint is a vertical operating model that recommends multiple Skills, Packs, workflows, and settings tailored to your business type.

---
title: Can I reject Blueprint recommendations?
slug: can-i-reject-blueprint-recommendations
category: industry-blueprints
language: en
visibility: authenticated
status: published
tags: [industry-blueprints, recommendations]
article_type: faq
---
Yes. Each recommendation can be accepted, rejected, or dismissed. Only accepted or pending items you approve during apply will be installed.

---
title: Can I use multiple Blueprints?
slug: can-i-use-multiple-blueprints
category: industry-blueprints
language: en
visibility: authenticated
status: published
tags: [industry-blueprints]
article_type: faq
---
V1 supports one primary Industry Blueprint per tenant. You can still install additional Marketplace Packs and Skills independently.

---
title: Do Blueprints affect Governance?
slug: do-blueprints-affect-governance
category: industry-blueprints
language: en
visibility: authenticated
status: published
tags: [industry-blueprints, governance]
article_type: faq
---
Blueprints may recommend governance defaults such as approval-required external messages or blocked refund actions. These are suggestions — Policy Engine and admin approval still apply before changes take effect.

---
title: Do Blueprints affect Knowledge Center?
slug: do-blueprints-affect-knowledge-center
category: industry-blueprints
language: en
visibility: authenticated
status: published
tags: [industry-blueprints, knowledge]
article_type: faq
---
Blueprints recommend Knowledge Center categories and can install Knowledge Packs from Marketplace. They do not overwrite your existing articles without review.

---
title: Do Blueprints affect Desktop Companion?
slug: do-blueprints-affect-desktop-companion
category: industry-blueprints
language: en
visibility: authenticated
status: published
tags: [industry-blueprints, desktop]
article_type: faq
---
Blueprint manifests can suggest Desktop Companion alert priorities and modes (for example balanced vs critical-only). Admins configure the final settings.

---
title: Are Blueprints available for Enterprise deployments?
slug: blueprints-enterprise-deployments
category: industry-blueprints
language: en
visibility: authenticated
status: published
tags: [industry-blueprints, enterprise]
article_type: faq
---
Yes. Each blueprint declares supported deployment modes (cloud SaaS, hybrid, on-premise). Apply precheck verifies compatibility with your tenant deployment settings.

---
title: Can Aipify create custom Blueprints?
slug: custom-industry-blueprints
category: industry-blueprints
language: en
visibility: authenticated
status: published
tags: [industry-blueprints]
article_type: faq
---
V1 ships official Aipify blueprints only. Custom partner or tenant-specific blueprints are planned for a later phase.

---
title: What happens when a Blueprint is updated?
slug: blueprint-updates
category: industry-blueprints
language: en
visibility: authenticated
status: published
tags: [industry-blueprints, versioning]
article_type: faq
---
Blueprint versions are tracked in blueprint_versions. When a new version is published, Aipify can surface new recommendations without auto-applying them.

---
title: Can a Blueprint recommend Marketplace items?
slug: blueprint-recommend-marketplace
category: industry-blueprints
language: en
visibility: authenticated
status: published
tags: [industry-blueprints, marketplace]
article_type: faq
---
Yes. Blueprints recommend Marketplace Packs and install them through the same governed install flow as manual Marketplace installs, including precheck and Policy Engine evaluation.
