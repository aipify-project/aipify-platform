---
title: What is Quality Guardian?
slug: what-is-quality-guardian
category: quality_guardian
language: en
visibility: authenticated
status: published
tags: [quality, monitoring, health]
keywords: [quality guardian, software health, monitoring]
article_type: faq
---
Quality Guardian is Aipify's software health monitoring system. It detects failures, risks, and quality issues across workflows, websites, and integrations before customers report them.

---
title: What does Quality Guardian monitor?
slug: what-quality-guardian-monitors
category: quality_guardian
language: en
visibility: authenticated
status: published
tags: [quality, links, workflows, integrations]
keywords: [broken links, workflows, integrations, mobile]
article_type: faq
---
Quality Guardian monitors broken links, slow pages, failed forms, registration and verification journeys, support and marketplace workflows, integration health, missing translations, mobile layout issues, and governance violations.

---
title: Can Quality Guardian fix problems automatically?
slug: can-quality-guardian-fix-automatically
category: quality_guardian
language: en
visibility: authenticated
status: published
tags: [quality, automation, approval]
keywords: [automatic fix, approval, production]
article_type: faq
---
Only low-risk recommendations may be prepared automatically. Production changes such as redirects, CMS updates, and knowledge article publishing require governance approval. Quality Guardian does not deploy code or modify databases directly.

---
title: How does incident severity work?
slug: quality-incident-severity
category: quality_guardian
language: en
visibility: authenticated
status: published
tags: [quality, incidents, severity]
keywords: [severity, critical, high, medium, low]
article_type: faq
---
Incidents are classified as Info, Low, Medium, High, or Critical based on user impact and business risk. Critical and high incidents should be reviewed first. Severity informs prioritization but does not bypass approval requirements.

---
title: How does Quality Guardian detect broken links?
slug: quality-broken-link-detection
category: quality_guardian
language: en
visibility: authenticated
status: published
tags: [quality, links, 404]
keywords: [broken links, 404, redirects]
article_type: faq
---
The link monitor compares expected URLs and redirect behaviour against documented expectations. When a page returns 404, loops redirects, or fails to load, an incident is created with evidence and a suggested fix.

---
title: How are developer reports generated?
slug: quality-developer-reports
category: quality_guardian
language: en
visibility: authenticated
status: published
tags: [quality, reports, developers]
keywords: [developer report, incident, evidence]
article_type: faq
---
When a deviation is detected, Quality Guardian creates a developer report with expected behaviour, observed behaviour, impact, evidence, suggested fix, and priority. Reports remain in draft until reviewed.

---
title: What happens when Quality Guardian cannot identify the root cause?
slug: quality-unknown-root-cause
category: quality_guardian
language: en
visibility: authenticated
status: published
tags: [quality, investigation, knowledge gap]
keywords: [root cause, unknown, knowledge gap]
article_type: faq
---
If the root cause is unclear, the incident stays open for investigation and a Knowledge Gap may be created when expected behaviour is not documented. Admins can mark incidents as false positives after review.

---
title: How does Quality Guardian use Knowledge Center?
slug: quality-knowledge-center-integration
category: quality_guardian
language: en
visibility: authenticated
status: published
tags: [quality, knowledge center]
keywords: [expected behaviour, documentation, knowledge center]
article_type: faq
---
Quality Guardian compares observed behaviour to documented expected behaviour in Knowledge Center articles and workflow definitions. Missing documentation can trigger knowledge gaps so teams can improve self-service answers.

---
title: Can Quality Guardian monitor mobile experiences?
slug: quality-mobile-monitoring
category: quality_guardian
language: en
visibility: authenticated
status: published
tags: [quality, mobile, layout]
keywords: [mobile, responsive, layout]
article_type: faq
---
Yes. The mobile monitor checks core journeys on mobile viewports for layout breakage, unusable forms, and navigation issues. Findings are reported without changing production layouts automatically.

---
title: Can Quality Guardian monitor integrations?
slug: quality-integration-monitoring
category: quality_guardian
language: en
visibility: authenticated
status: published
tags: [quality, integrations, shopify, supabase]
keywords: [integrations, webhooks, supabase, resend, shopify]
article_type: faq
---
Yes. Integration monitors track connection status and sync failures for systems such as Supabase, Shopify, Resend, and custom platform adapters. Integration errors create incidents with integration-specific evidence.

---
title: How are false positives handled?
slug: quality-false-positives
category: quality_guardian
language: en
visibility: authenticated
status: published
tags: [quality, false positive]
keywords: [false positive, resolve, dismiss]
article_type: faq
---
Admins can mark an incident as a false positive after review. This updates the incident status and is logged in the audit timeline. Repeated false positives may indicate checks that need tuning.

---
title: How does Quality Guardian create admin tasks?
slug: quality-admin-tasks
category: quality_guardian
language: en
visibility: authenticated
status: published
tags: [quality, admin tasks]
keywords: [admin task, notification, developer]
article_type: faq
---
For medium and higher severity issues, Quality Guardian can notify developers and recommend admin follow-up tasks. Tasks are suggestions for human review, not autonomous production actions.

---
title: Can Quality Guardian suggest workflow improvements?
slug: quality-workflow-improvements
category: quality_guardian
language: en
visibility: authenticated
status: published
tags: [quality, workflows, recommendations]
keywords: [workflow, improvement, recommendation]
article_type: faq
---
Yes. Workflow validation compares live signals to defined workflows and recommends improvements when bottlenecks, missing steps, or repeated failures are detected.

---
title: Does Quality Guardian change production systems automatically?
slug: quality-no-auto-production-changes
category: quality_guardian
language: en
visibility: authenticated
status: published
tags: [quality, governance, safety]
keywords: [production, automatic, governance]
article_type: faq
---
No. Quality Guardian begins in observation mode. It observes, compares, detects, explains, reports, and recommends. Production changes require explicit governance approval.

---
title: How are incidents prioritized?
slug: quality-incident-prioritization
category: quality_guardian
language: en
visibility: authenticated
status: published
tags: [quality, priority, incidents]
keywords: [priority, critical, open incidents]
article_type: faq
---
Incidents are prioritized by severity, category, and user impact. Critical integration failures and broken registration flows are surfaced first on the Quality Guardian dashboard.
