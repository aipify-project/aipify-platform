---
title: App Manifest Specification
slug: app-manifest-specification
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, manifests]
keywords: [app.manifest.json, app_key, minimum_aipify_version]
article_type: guide
priority: 12
---
Every app must provide app.manifest.json with required fields:

| Field | Required | Description |
|-------|----------|-------------|
| name | Yes | Human-readable name |
| app_key | Yes | Unique dotted key (e.g. support.sentiment) |
| version | Yes | Semver (e.g. 1.0.0) |
| author | Yes | Author or organization |
| description | Recommended | Short summary |
| category | Yes | skill, agent_extension, knowledge_pack, workflow_pack, etc. |
| permissions | Yes | Array of permission keys |
| deployment_modes | Recommended | cloud, hybrid |
| required_modules | Optional | Aipify modules needed |
| minimum_aipify_version | Recommended | Platform compatibility |
| risk_level | Yes | low, medium, high, restricted |
| support_contact | Recommended | Support email or URL |

Example:
```json
{
  "name": "Support Sentiment",
  "app_key": "support.sentiment",
  "version": "1.0.0",
  "author": "Developer Name",
  "category": "skill",
  "permissions": ["support.read"],
  "deployment_modes": ["cloud", "hybrid"],
  "risk_level": "medium"
}
```

Validate via POST /api/aipify/apps/validate-manifest before publishing.
