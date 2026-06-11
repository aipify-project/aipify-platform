---
title: Governance for Developers
slug: governance-for-developers
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, governance]
keywords: [governance, policy engine, approvals]
article_type: guide
priority: 11
---
No app may:
- Override Governance
- Override Policy Engine
- Disable Security controls
- Disable Audit logging
- Modify Core permissions
- Modify billing
- Delete tenant data without approval
- Publish externally without approval

**Install-time governance:**
- Medium/high risk apps require approval (precheck_ecosystem_app_install)
- Restricted apps are blocked from install
- Governance Agent participates in multi-agent flows for high-risk actions

**Developer responsibilities:**
- Document why each permission is needed
- Explain data classification in manifest context
- Provide Knowledge Center FAQ for your extension
- Support audit-friendly logging in extension behavior

When agents disagree on an action, Governance wins — extensions must not implement voting or bypass paths.
