---
title: App Publishing Workflow
slug: app-publishing-workflow
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, publishing]
keywords: [publish, review, security scan, governance review]
article_type: guide
priority: 12
---
**Publishing flow:**

1. **Build** — Implement extension using SDK and manifest
2. **Test** — Local validation and tenant sandbox testing
3. **Validate** — POST /api/aipify/apps/validate-manifest
4. **Security scan** — Automated on submit (no secret access, sandbox required)
5. **Governance validation** — Policy Engine evaluates permissions and risk
6. **Submit** — POST /api/aipify/apps/submit-review with manifest JSON
7. **Review** — process_ecosystem_app_review_queue verifies manifest, permissions, docs
8. **Publish** — Approved apps status = published in ecosystem_apps registry

**Review checks:**
- Manifest correctness
- Permission requests (least privilege)
- Dependency safety
- Security requirements
- Documentation quality
- Governance compatibility

Rejected apps receive review_notes — fix and resubmit. Never attempt to bypass review.
