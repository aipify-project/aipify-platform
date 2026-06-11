---
title: What is Aipify Enterprise Deployment?
slug: what-is-enterprise-deployment
category: enterprise-deployment
language: en
visibility: authenticated
status: published
tags: [enterprise, deployment, hybrid, on-premise]
article_type: faq
---
Aipify Enterprise Deployment lets organizations run Aipify in Cloud SaaS, Hybrid, or On-Premise modes. Hybrid uses a local Aipify Agent inside your network with outbound-only connection to Aipify Cloud. On-Premise runs Aipify Core entirely inside your environment.

---
title: What is the difference between Cloud, Hybrid and On-Premise?
slug: cloud-hybrid-on-premise-difference
category: enterprise-deployment
language: en
visibility: authenticated
status: published
tags: [enterprise, deployment]
article_type: faq
---
**Cloud SaaS** — Aipify runs in Aipify Cloud; fastest onboarding for public internet systems. **Hybrid** — Cloud control plane + local Aipify Agent for internal data access. **On-Premise** — Full Aipify stack inside your data center with no operational data leaving your environment.

---
title: What is Aipify Agent?
slug: what-is-aipify-agent
category: enterprise-deployment
language: en
visibility: authenticated
status: published
tags: [enterprise, agent]
article_type: faq
---
Aipify Agent is a local service installed inside the customer environment. It connects outbound to Aipify Cloud, accesses approved internal systems, performs local scans, and syncs safe results according to data residency policy. It does not expose inbound ports by default.

---
title: Does Aipify work behind a firewall?
slug: does-aipify-work-behind-firewall
category: enterprise-deployment
language: en
visibility: authenticated
status: published
tags: [enterprise, firewall, security]
article_type: faq
---
Yes. In Hybrid mode, Aipify uses a local Agent that runs inside your network and connects outbound to Aipify Cloud. Internal systems do not need inbound internet exposure.

---
title: Does Aipify require inbound firewall rules?
slug: does-aipify-require-inbound-firewall
category: enterprise-deployment
language: en
visibility: authenticated
status: published
tags: [enterprise, firewall]
article_type: faq
---
No, by default. The Aipify Agent uses outbound-only connection. Inbound ports are not required unless you explicitly configure them for a specific integration.

---
title: What data is sent to Aipify Cloud in Hybrid mode?
slug: what-data-leaves-in-hybrid-mode
category: enterprise-deployment
language: en
visibility: authenticated
status: published
tags: [enterprise, data-residency, hybrid]
article_type: faq
---
This depends on your data residency policy. Aipify supports metadata-only, redacted summaries, safe reports, or no raw data cloud sync. Raw internal data is never synced by default.

---
title: Can Aipify run fully on-premise?
slug: can-aipify-run-on-premise
category: enterprise-deployment
language: en
visibility: authenticated
status: published
tags: [enterprise, on-premise]
article_type: faq
---
Yes. On-Premise mode runs Aipify Core, Knowledge Center, Memory, Quality Guardian, and Agent inside your environment for full data residency.

---
title: What is local Knowledge Center?
slug: what-is-local-knowledge-center
category: enterprise-deployment
language: en
visibility: authenticated
status: published
tags: [enterprise, knowledge]
article_type: faq
---
Local Knowledge Center indexes and stores content inside your network — internal handbooks, SharePoint, HR policies, intranet pages. Search and retrieval happen locally; only safe summaries may sync to cloud if policy allows.

---
title: What is local Memory Engine?
slug: what-is-local-memory-engine
category: enterprise-deployment
language: en
visibility: authenticated
status: published
tags: [enterprise, memory]
article_type: faq
---
Local Memory stores tenant-specific operational memory only inside your network. Hybrid redacted mode keeps safe preferences in cloud and sensitive memory local. Memory never crosses tenants.

---
title: Can Desktop Companion connect to an internal Aipify endpoint?
slug: desktop-companion-internal-endpoint
category: enterprise-deployment
language: en
visibility: authenticated
status: published
tags: [enterprise, desktop]
article_type: faq
---
Yes. Desktop Companion supports cloud, hybrid, and on-premise endpoint modes. Configure the internal URL in Enterprise Deployment settings for intranet-only access.

---
title: How does Aipify scan intranet pages?
slug: how-does-aipify-scan-intranet
category: enterprise-deployment
language: en
visibility: authenticated
status: published
tags: [enterprise, quality, intranet]
article_type: faq
---
In hybrid or on-premise mode, the local Aipify Agent performs Quality Guardian scans on intranet pages, internal portals, and documentation. Safe scan reports sync to cloud only if policy allows.

---
title: How does Aipify handle data residency?
slug: how-does-aipify-handle-data-residency
category: enterprise-deployment
language: en
visibility: authenticated
status: published
tags: [enterprise, data-residency]
article_type: faq
---
Per-category data residency policies define storage location (cloud, local, hybrid), cloud sync allowance, redaction requirements, and retention. Admins configure these in Enterprise Deployment settings.

---
title: Can Aipify integrate with SharePoint?
slug: can-aipify-integrate-sharepoint
category: enterprise-deployment
language: en
visibility: authenticated
status: published
tags: [enterprise, sharepoint, connectors]
article_type: faq
---
SharePoint integration is supported in hybrid and on-premise modes and requires a local Aipify Agent. Connector status and permissions are managed in Enterprise Connectors.

---
title: Can Aipify integrate with Active Directory or Azure AD?
slug: can-aipify-integrate-active-directory
category: enterprise-deployment
language: en
visibility: authenticated
status: published
tags: [enterprise, azure-ad, sso]
article_type: faq
---
Active Directory and Azure AD / Entra ID connectors are available for enterprise deployments. SSO, SAML/OIDC, and SCIM provisioning integrate with enterprise governance controls.

---
title: Can cloud sync be disabled?
slug: can-cloud-sync-be-disabled
category: enterprise-deployment
language: en
visibility: authenticated
status: published
tags: [enterprise, privacy]
article_type: faq
---
Yes. Disable cloud sync at deployment level and per data category in residency policies. On-premise and local-only modes keep all operational data inside your environment.

---
title: How are agent actions audited?
slug: how-are-agent-actions-audited
category: enterprise-deployment
language: en
visibility: authenticated
status: published
tags: [enterprise, audit, agent]
article_type: faq
---
Agent registration, heartbeat, job completion, and failures are logged in agent access events and governance audit logs. Audit exports can be requested from Enterprise Audit.

---
title: What happens if the agent goes offline?
slug: what-if-agent-goes-offline
category: enterprise-deployment
language: en
visibility: authenticated
status: published
tags: [enterprise, agent, reliability]
article_type: faq
---
The agent status changes to offline. Queued jobs remain until the agent reconnects or expire per policy. Cloud control plane continues; local data access pauses until agent is online.

---
title: Can Aipify work in offline-limited environments?
slug: can-aipify-work-offline-limited
category: enterprise-deployment
language: en
visibility: authenticated
status: published
tags: [enterprise, offline]
article_type: faq
---
On-premise and offline-limited connectivity modes support near-air-gapped environments. The local agent and on-premise stack operate without continuous internet when configured.

---
title: How does Enterprise Governance protect internal data?
slug: how-enterprise-governance-protects-data
category: enterprise-deployment
language: en
visibility: authenticated
status: published
tags: [enterprise, governance, security]
article_type: faq
---
Enterprise governance enforces RBAC, approval chains, data residency, redaction, Emergency Stop, audit export, and integration permission review. Deployment mode is checked before cloud sync.

---
title: Which deployment mode should we choose?
slug: which-deployment-mode-to-choose
category: enterprise-deployment
language: en
visibility: authenticated
status: published
tags: [enterprise, deployment, guide]
article_type: faq
---
Choose **Cloud SaaS** for SMBs and public websites. Choose **Hybrid** when you need cloud AI with local data access behind a firewall. Choose **On-Premise** for banks, government, hospitals, and strict data residency requirements.
