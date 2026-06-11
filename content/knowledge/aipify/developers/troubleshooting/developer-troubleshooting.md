---
title: Developer Troubleshooting
slug: developer-troubleshooting
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, troubleshooting]
keywords: [rejected, install failed, precheck failed, validation]
article_type: guide
priority: 10
---
**Manifest validation failed**
- Check all required fields: name, app_key, version, author, category, permissions, risk_level
- Ensure permissions is an array, not a string
- Use valid category and risk_level enum values

**Install precheck failed**
- already_installed — uninstall first from /app/apps
- restricted_app — reduce risk_level or request governance approval
- invalid_manifest — fix manifest and republish
- policy blocked — reduce permissions or contact tenant admin

**App rejected in review**
- Excessive permissions — apply least privilege
- Missing documentation — add Knowledge Center FAQ
- Security scan failure — ensure sandbox_required, no secret access patterns
- Governance incompatibility — high-risk actions need explicit approval flows

**Low assistant confidence**
- Add keywords and FAQ articles under content/knowledge/aipify/developers/
- Re-import seed content via Knowledge Center import

Never bypass security controls to work around failures.
