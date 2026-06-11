---
title: SDK and Manifest Examples
slug: sdk-and-manifest-examples
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, examples]
keywords: [example, manifest, skill, integration]
article_type: guide
priority: 10
---
**Support Skill (medium risk):**
```json
{
  "name": "Support Sentiment",
  "app_key": "support.sentiment",
  "version": "1.0.0",
  "author": "Aipify",
  "category": "skill",
  "permissions": ["support.read"],
  "deployment_modes": ["cloud", "hybrid"],
  "risk_level": "medium"
}
```

**Knowledge Pack (low risk):**
```json
{
  "name": "GDPR FAQ Pack",
  "app_key": "gdpr.faq.pack",
  "version": "1.0.0",
  "author": "Aipify",
  "category": "knowledge_pack",
  "permissions": ["knowledge.read"],
  "risk_level": "low"
}
```

**CRM Integration (high risk):**
```json
{
  "name": "HubSpot CRM Connector",
  "app_key": "crm.connector.hubspot",
  "version": "1.0.0",
  "author": "Verified Partner",
  "category": "integration",
  "permissions": ["integration.external.connect"],
  "deployment_modes": ["cloud"],
  "risk_level": "high",
  "support_contact": "partner@example.com"
}
```

Test with validate_app_manifest before submit_ecosystem_app_review.
