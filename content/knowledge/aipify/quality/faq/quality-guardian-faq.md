---
title: What is Quality Guardian?
slug: what-is-quality-guardian
category: quality_guardian
language: en
visibility: authenticated
status: published
tags: [quality, monitoring, health]
keywords: [quality guardian, software health, frontend]
article_type: faq
priority: 100
---
Quality Guardian is Aipify's software and frontend health monitoring system. It watches workflows, websites, integrations, images, and mobile experiences — then calmly reports issues before customers complain.

---
title: What does Quality Guardian monitor?
slug: what-quality-guardian-monitors
category: quality_guardian
language: en
visibility: authenticated
status: published
tags: [quality, links, workflows, images, performance]
keywords: [broken links, workflows, images, mobile, translations]
article_type: faq
priority: 99
---
Quality Guardian monitors broken links, slow or heavy pages, oversized images, missing alt text, mobile layout issues, failed workflows, integration health, missing translations, registration and checkout journeys, and governance violations.

---
title: Why does Aipify warn about large images?
slug: why-large-images-matter
category: quality-images
language: en
visibility: authenticated
status: published
tags: [quality, images, performance]
keywords: [large images, mobile, page speed]
article_type: faq
priority: 98
---
Large images can make pages slower, especially on mobile. Slow pages can hurt user experience, conversions, and search performance. Aipify warns when image files are larger than configured thresholds or much larger than needed for their display size.

---
title: What image formats does Aipify recommend?
slug: recommended-image-formats
category: quality-images
language: en
visibility: authenticated
status: published
tags: [quality, images, webp, avif]
keywords: [webp, avif, jpeg, png, image formats]
article_type: faq
priority: 97
---
Aipify normally recommends modern web formats such as WebP or AVIF for many website images, while still allowing JPEG, PNG, SVG, or other formats when appropriate. The correct format depends on image type, transparency needs, browser support, and design requirements.

---
title: Can Aipify compress images automatically?
slug: can-aipify-compress-images-automatically
category: quality-images
language: en
visibility: authenticated
status: published
tags: [quality, images, governance]
keywords: [compress images, automatic, approval]
article_type: faq
priority: 96
---
In the first version, Aipify reports and recommends image optimization — it does not automatically change production images. Later, low-risk optimization workflows may be offered with admin approval.

---
title: What is a heavy page?
slug: what-is-a-heavy-page
category: quality-performance
language: en
visibility: authenticated
status: published
tags: [quality, performance, page weight]
keywords: [heavy page, page weight, javascript]
article_type: faq
priority: 95
---
A heavy page loads too much data: large images, scripts, fonts, videos, or third-party resources. Aipify uses tenant-configurable thresholds (for example 3 MB warning, 6 MB high) to flag pages that may feel slow on mobile.

---
title: Can Aipify monitor mobile experiences?
slug: can-aipify-monitor-mobile-experiences
category: quality-mobile
language: en
visibility: authenticated
status: published
tags: [quality, mobile, layout]
keywords: [mobile, responsive, viewport, layout]
article_type: faq
priority: 94
---
Yes. Aipify scans important pages using common viewport sizes and looks for overlapping buttons, horizontal scrolling, hidden CTAs, broken menus, unreadable text, and unusable forms. Findings become incidents — layouts are not changed automatically.

---
title: How does Aipify detect broken links?
slug: quality-broken-link-detection
category: quality-frontend
language: en
visibility: authenticated
status: published
tags: [quality, links, 404]
keywords: [broken links, 404, redirects]
article_type: faq
priority: 93
---
The link monitor compares expected URLs and redirect behaviour against documented expectations and configured checks. When a page returns 404, loops redirects, or fails to load, an incident is created with evidence and a suggested fix.

---
title: What happens when Aipify finds a problem?
slug: what-happens-when-quality-problem-found
category: quality-frontend
language: en
visibility: authenticated
status: published
tags: [quality, incidents, reports]
keywords: [incident, report, deviation]
article_type: faq
priority: 92
---
Aipify creates a quality incident, assigns severity, explains expected versus observed behaviour, stores evidence, links to relevant Knowledge Center articles, and can generate an admin summary or developer report. No production changes are made automatically.

---
title: What is an incident?
slug: what-is-quality-incident
category: quality-incidents
language: en
visibility: authenticated
status: published
tags: [quality, incidents]
keywords: [incident, open, resolved, false positive]
article_type: faq
priority: 91
---
An incident is a recorded deviation between expected and observed behaviour. It includes title, severity, impact, evidence, suggested fix, and status (open, acknowledged, resolved, dismissed, or false positive).

---
title: How does incident severity work?
slug: quality-incident-severity
category: quality-incidents
language: en
visibility: authenticated
status: published
tags: [quality, severity, critical]
keywords: [severity, info, low, medium, high, critical]
article_type: faq
priority: 90
---
Incidents are classified as Info, Low, Medium, High, or Critical based on user impact and business risk. Critical and high incidents should be reviewed first. Severity guides prioritization but does not bypass governance approval for production changes.

---
title: What is a false positive?
slug: what-is-false-positive
category: quality-incidents
language: en
visibility: authenticated
status: published
tags: [quality, false positive]
keywords: [false positive, dismiss, review]
article_type: faq
priority: 89
---
A false positive is an issue Aipify flagged that an admin or developer decides is not actually a problem. Marking false positives updates the incident status and is logged in the audit timeline.

---
title: Can Aipify fix problems automatically?
slug: can-aipify-fix-problems-automatically
category: quality-governance
language: en
visibility: authenticated
status: published
tags: [quality, governance, automation]
keywords: [automatic fix, approval, production]
article_type: faq
priority: 88
---
No. Aipify primarily observes, reports, explains, and recommends. Production changes require approval and developer review according to governance settings. Quality Guardian does not deploy code or modify databases directly.

---
title: What is a developer report?
slug: what-is-developer-report
category: quality-reports
language: en
visibility: authenticated
status: published
tags: [quality, reports, developers]
keywords: [developer report, evidence, reproduction]
article_type: faq
priority: 87
---
A developer report is a technical explanation of a quality issue. It includes affected URL, affected asset, expected behaviour, observed behaviour, evidence, reproduction steps, suggested fix, priority, and risk level of the fix.

---
title: Does Aipify replace a developer?
slug: does-aipify-replace-developer
category: quality-frontend
language: en
visibility: authenticated
status: published
tags: [quality, developers]
keywords: [developer, production changes]
article_type: faq
priority: 86
---
No. Aipify helps detect issues early and creates actionable reports, but developers remain responsible for reviewing and implementing production changes.

---
title: How does Aipify know what is expected behaviour?
slug: how-does-aipify-know-expected-behaviour
category: quality-frontend
language: en
visibility: authenticated
status: published
tags: [quality, knowledge center, expected behaviour]
keywords: [expected behaviour, knowledge center, workflows]
article_type: faq
priority: 85
---
Aipify compares observed behaviour with documented expected behaviour stored in Knowledge Center articles, workflow definitions, tenant quality settings, and configured quality rules. Missing documentation may open a Knowledge Gap.

---
title: Can Aipify monitor integrations?
slug: quality-integration-monitoring
category: quality-frontend
language: en
visibility: authenticated
status: published
tags: [quality, integrations]
keywords: [integrations, webhooks, supabase, shopify]
article_type: faq
priority: 84
---
Yes. Integration monitors track connection status and sync failures for systems such as Supabase, Shopify, Resend, and custom platform adapters. Integration errors create incidents with integration-specific evidence.

---
title: Can Aipify monitor Shopify stores?
slug: can-aipify-monitor-shopify-stores
category: quality-images
language: en
visibility: authenticated
status: published
tags: [quality, shopify, integrations]
keywords: [shopify, product images, checkout]
article_type: faq
priority: 83
---
Yes, if the Shopify integration is connected and permitted. Aipify can inspect product images, detect oversized media, broken image links, missing alt text, heavy product pages, and suspicious upgrade or checkout flows.

---
title: Can Aipify monitor Unonight?
slug: can-aipify-monitor-unonight
category: quality-frontend
language: en
visibility: authenticated
status: published
tags: [quality, unonight, pilot]
keywords: [unonight, pilot, marketplace]
article_type: faq
priority: 82
---
Yes. In the Unonight pilot, Aipify monitors important public, member, marketplace, and admin pages for broken or heavy images, mobile issues, missing translations, and integration health — using tenant-specific quality presets.

---
title: Can Aipify monitor missing translations?
slug: can-aipify-monitor-missing-translations
category: quality-mobile
language: en
visibility: authenticated
status: published
tags: [quality, localization, translations]
keywords: [translations, missing keys, multilingual]
article_type: faq
priority: 81
---
Yes. The localization monitor checks for missing translation keys, visible fallback keys, mixed-language pages, and text overflow after translation. Issues create incidents and may open Knowledge Gaps when locale behaviour is undocumented.

---
title: Why was my homepage hero image flagged?
slug: why-homepage-hero-image-flagged
category: quality-images
language: en
visibility: authenticated
status: published
tags: [quality, images, hero]
keywords: [hero image, homepage, above the fold]
article_type: faq
priority: 80
---
Aipify may flag a hero image if it is very large, loaded too early, not responsive, missing dimensions, or slowing the first page experience. Hero images matter because they often load before the user can interact with the page.

---
title: Can Aipify monitor performance trends over time?
slug: can-aipify-monitor-performance-trends
category: quality-troubleshooting
language: en
visibility: authenticated
status: published
tags: [quality, performance, trends]
keywords: [trends, page weight, load time]
article_type: faq
priority: 79
---
Quality Guardian stores page snapshots and scan history so admins can compare scans over time. Trend monitoring detects when pages become heavier, load times worsen, or new broken assets appear after a deploy. Full trend dashboards may expand in later releases.

---
title: How often does Quality Guardian scan?
slug: how-often-does-quality-guardian-scan
category: quality-troubleshooting
language: en
visibility: authenticated
status: published
tags: [quality, scans, schedule]
keywords: [scan frequency, daily, manual]
article_type: faq
priority: 78
---
Scan frequency is configurable per tenant: manual, hourly, daily, or weekly. Admins can also run on-demand health scans from the Quality Guardian dashboard. Scheduled worker jobs can be enabled when cron infrastructure is connected.

---
title: What happens if a critical issue is detected?
slug: what-happens-when-critical-issue-detected
category: quality-incidents
language: en
visibility: authenticated
status: published
tags: [quality, critical, notifications]
keywords: [critical incident, notify, emergency]
article_type: faq
priority: 77
---
Aipify creates an incident, surfaces it on the dashboard, notifies administrators when notify-on-critical is enabled, generates reports, and recommends immediate review. Production fixes still require governance approval and developer review.

---
title: How does Governance affect Quality Guardian?
slug: how-governance-affects-quality-guardian
category: quality-governance
language: en
visibility: authenticated
status: published
tags: [quality, governance, approval]
keywords: [governance, approval, observation mode]
article_type: faq
priority: 76
---
Governance defines what Quality Guardian may do automatically versus what requires approval. Scanning, incident creation, and reporting are low risk. CMS updates, redirects, production deploys, and checkout changes require explicit approval. Emergency Stop blocks sensitive actions platform-wide.
