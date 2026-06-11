---
title: What is Learning Engine?
slug: what-is-learning-engine
category: learning-engine
language: en
visibility: authenticated
status: published
tags: [learning, feedback, improvement]
article_type: faq
---
Learning Engine helps Aipify improve recommendations and prioritization by observing approved feedback, decisions, and outcomes within your tenant. It closes the loop: Aipify suggests, users decide, outcomes happen, and future suggestions improve.

---
title: Does Aipify train on my data?
slug: does-aipify-train-on-my-data
category: learning-engine
language: en
visibility: authenticated
status: published
tags: [learning, privacy, tenant]
article_type: faq
---
Learning Engine is tenant-isolated and governed. It learns operational patterns and feedback for your organization. It does not share tenant-specific learning with other customers and is not uncontrolled global model training.

---
title: What does Aipify learn from?
slug: what-does-aipify-learn-from
category: learning-engine
language: en
visibility: authenticated
status: published
tags: [learning, sources, feedback]
article_type: faq
---
Aipify learns from approvals, Action Center outcomes, support answer feedback, Quality Guardian false positives, automation results, briefing engagement, desktop notification behavior, and Knowledge Center article feedback — when enabled in settings.

---
title: Can I control what Aipify learns?
slug: can-i-control-what-aipify-learns
category: learning-engine
language: en
visibility: authenticated
status: published
tags: [learning, settings, control]
article_type: faq
---
Yes. Action Center settings at `/app/learning/settings` let you enable or disable learning by module — support, quality, automation, notifications, briefing, and actions — and require admin review for major learned rules.

---
title: Can learning be disabled?
slug: can-learning-be-disabled
category: learning-engine
language: en
visibility: authenticated
status: published
tags: [learning, disable, governance]
article_type: faq
---
Yes. Administrators can disable Learning Engine entirely or use the Phase 29 review center at `/app/learning/review` to set learning mode to Disabled, Assisted, or Adaptive.

---
title: Does learning affect other tenants?
slug: does-learning-affect-other-tenants
category: learning-engine
language: en
visibility: authenticated
status: published
tags: [learning, tenant, isolation]
article_type: faq
---
No. All learning events, scores, rules, and feedback are tenant-isolated. Cross-tenant learning without anonymization and consent is explicitly not supported.

---
title: How does Aipify use feedback?
slug: how-does-aipify-use-feedback
category: learning-engine
language: en
visibility: authenticated
status: published
tags: [learning, feedback, scoring]
article_type: faq
---
Feedback adjusts pattern scores — helpful approvals increase confidence, rejections and false positives decrease it. These scores influence future prioritization, notification filtering, and recommendation confidence.

---
title: What is a learning event?
slug: what-is-a-learning-event
category: learning-engine
language: en
visibility: authenticated
status: published
tags: [learning, events, audit]
article_type: faq
---
A learning event records a user decision or system outcome — such as action_completed, suggestion_rejected, or incident_false_positive — with source module, explanation, and optional confidence before/after values.

---
title: What is a false positive?
slug: what-is-a-false-positive-learning
category: learning-engine
language: en
visibility: authenticated
status: published
tags: [learning, quality, false-positive]
article_type: faq
---
A false positive is an alert or incident that looked important but was not a real issue. Marking incidents as false positive teaches Aipify to reduce noise from similar future alerts without hiding critical issues automatically.

---
title: How does Learning Engine improve recommendations?
slug: how-does-learning-improve-recommendations
category: learning-engine
language: en
visibility: authenticated
status: published
tags: [learning, recommendations, prioritization]
article_type: faq
---
Learning scores and rules adjust prioritization. Patterns with high positive feedback get boosted; repeatedly dismissed or rejected patterns are deprioritized. Action Center and Briefing use these adjustments for better next-step suggestions.

---
title: Can I reset learned behavior?
slug: can-i-reset-learned-behavior
category: learning-engine
language: en
visibility: authenticated
status: published
tags: [learning, reset, reversible]
article_type: faq
---
Yes. Administrators can reset tenant learning scores and rules from Learning Engine settings. Learning is designed to be reversible — you stay in control.

---
title: How does Governance protect learning?
slug: how-does-governance-protect-learning
category: learning-engine
language: en
visibility: authenticated
status: published
tags: [learning, governance, audit]
article_type: faq
---
Governance requires tenant isolation, explainability, audit logging for high-impact changes, and configurable settings. Learning cannot bypass approvals. Sensitive data must not be stored unnecessarily.

---
title: Does Aipify learn from rejected suggestions?
slug: does-aipify-learn-from-rejected-suggestions
category: learning-engine
language: en
visibility: authenticated
status: published
tags: [learning, rejection, improvement]
article_type: faq
---
Yes. Rejections help Aipify understand which recommendations are not useful, too risky, badly timed, or irrelevant — reducing similar suggestions in the future.

---
title: How does Learning Engine work with Memory Engine?
slug: how-does-learning-work-with-memory-engine
category: learning-engine
language: en
visibility: authenticated
status: published
tags: [learning, memory, integration]
article_type: faq
---
Memory Engine remembers context — such as when someone usually reviews verifications. Learning Engine evaluates outcomes — such as which briefing items get opened and completed. Together they improve prioritization without invasive profiling.

---
title: Can Learning Engine improve Unonight operations?
slug: can-learning-engine-improve-unonight
category: learning-engine
language: en
visibility: authenticated
status: published
tags: [learning, unonight, pilot]
article_type: faq
---
Yes. Unonight pilot learning tracks verification patterns, support draft acceptance, marketplace false positives, quality alert relevance, briefing engagement, and knowledge gap trends to improve operational recommendations.
