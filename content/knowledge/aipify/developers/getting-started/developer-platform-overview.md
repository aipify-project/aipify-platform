---
title: Developer Platform Getting Started
slug: developer-platform-getting-started
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, getting-started]
keywords: [getting started, developer portal, first app]
article_type: guide
priority: 12
---
Welcome to the Aipify Developer Platform. Start at /developers for SDK documentation, manifest specifications, and publishing guides.

**Step 1 — Choose an extension type:** Skill, Agent Extension, Knowledge Pack, Workflow Pack, Dashboard Widget, Integration, or Blueprint component.

**Step 2 — Define your manifest:** Use SDK helpers or author app.manifest.json with name, app_key, version, author, category, permissions, deployment_modes, and risk_level.

**Step 3 — Validate locally:** POST /api/aipify/apps/validate-manifest before submitting.

**Step 4 — Test in Sandbox:** All third-party code runs in Sandbox Runtime — plan for API-only access.

**Step 5 — Submit for review:** Security scan and Governance review run automatically on submit.

**Step 6 — Publish:** Approved apps appear in /app/apps catalog and Marketplace.

Always document your extension in Knowledge Center and request minimal permissions.
