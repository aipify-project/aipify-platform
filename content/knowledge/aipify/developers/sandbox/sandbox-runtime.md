---
title: Sandbox Runtime for Developers
slug: sandbox-runtime-for-developers
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, sandbox, security]
keywords: [sandbox runtime, isolation, no secrets]
article_type: guide
priority: 12
---
All third-party apps execute within Aipify Sandbox Runtime inside the App Runtime layer.

**Hard restrictions (never bypass):**
1. No unrestricted filesystem access
2. No unrestricted database access
3. No direct secret access
4. No cross-tenant access
5. No Governance bypass
6. No Policy Engine bypass

**How to design for Sandbox:**
- Use declared permissions and approved APIs only
- Pass tenant context through Orchestration — never hardcode tenant IDs
- Store configuration in tenant-scoped install settings
- Log actions for audit — assume every operation is reviewed

Internal Aipify-built apps may run with tighter platform integration but still respect Governance. Third-party apps always require sandbox_required: true in the registry.
