---
title: What is the Policy Engine?
slug: what-is-the-policy-engine
category: security-compliance
language: en
visibility: authenticated
status: published
tags: [security, policy, governance]
article_type: faq
---
The Policy Engine checks whether an action is allowed, blocked, or requires approval before Aipify performs it. It considers role, data classification, deployment mode, Emergency Stop, and access policies.

---
title: What data does Aipify never store?
slug: what-data-does-aipify-never-store
category: security-compliance
language: en
visibility: authenticated
status: published
tags: [security, privacy, data-classification]
article_type: faq
---
Aipify should never store raw passwords, full payment card data, unrestricted API secrets in normal tables, or unnecessary sensitive personal data. Secrets use reference-only storage through the approved secrets system.

---
title: How does Aipify protect data?
slug: how-does-aipify-protect-data
category: security-compliance
language: en
visibility: authenticated
status: published
tags: [security, data-governance]
article_type: faq
---
Aipify uses data classification, access policies, the Policy Engine, tenant isolation, audit logging, retention policies, and deployment-aware sync controls. Hybrid and on-premise modes restrict cloud data transfer.

---
title: Where is my data stored?
slug: where-is-my-data-stored
category: security-compliance
language: en
visibility: authenticated
status: published
tags: [security, data-residency]
article_type: faq
---
Storage location depends on deployment mode and data residency policies. Cloud SaaS stores operational data in Aipify Cloud. Hybrid and on-premise keep sensitive data local unless policy explicitly allows cloud sync.

---
title: What is data classification?
slug: what-is-data-classification
category: security-compliance
language: en
visibility: authenticated
status: published
tags: [security, classification]
article_type: faq
---
Data classification levels (public, internal, confidential, sensitive, restricted, never_store) define how data is protected, retained, synced, audited, and whether external use requires approval.

---
title: How does Aipify handle GDPR?
slug: how-does-aipify-handle-gdpr
category: security-compliance
language: en
visibility: authenticated
status: published
tags: [compliance, gdpr, privacy]
article_type: faq
---
Aipify provides privacy request workflows for export, deletion, anonymization, and correction. Requests respect legal retention, audit requirements, and tenant policies. Aipify does not claim automatic legal certification.

---
title: Can I export user data?
slug: can-i-export-user-data
category: security-compliance
language: en
visibility: authenticated
status: published
tags: [compliance, privacy, export]
article_type: faq
---
Yes. Admins can create privacy export requests from Compliance → Privacy requests. Exports follow tenant policies and require appropriate permissions and audit logging.

---
title: Can I delete or anonymize user data?
slug: can-i-delete-or-anonymize-user-data
category: security-compliance
language: en
visibility: authenticated
status: published
tags: [compliance, privacy, deletion]
article_type: faq
---
Yes, through privacy deletion and anonymization requests. Audit logs and legally required records may be retained or anonymized rather than deleted outright.

---
title: What is a privacy request?
slug: what-is-a-privacy-request
category: security-compliance
language: en
visibility: authenticated
status: published
tags: [compliance, privacy]
article_type: faq
---
A privacy request is a formal workflow for export, delete, anonymize, correct, restrict processing, or consent withdrawal. Statuses track verification, progress, and completion.

---
title: What is data retention?
slug: what-is-data-retention
category: security-compliance
language: en
visibility: authenticated
status: published
tags: [compliance, retention]
article_type: faq
---
Retention policies define how long each data category is kept and what happens on expiry (delete, anonymize, archive, or review). Audit logs typically have longer retention than operational logs.

---
title: How are API keys stored?
slug: how-are-api-keys-stored
category: security-compliance
language: en
visibility: authenticated
status: published
tags: [security, secrets]
article_type: faq
---
API keys and credentials are stored only through the secrets reference system. Normal database tables store secret_ref, provider, and status — never raw secret values after creation.

---
title: Can Aipify access sensitive data?
slug: can-aipify-access-sensitive-data
category: security-compliance
language: en
visibility: authenticated
status: published
tags: [security, access]
article_type: faq
---
Only when permitted by access policies, user role, and Policy Engine evaluation. Sensitive and restricted data requires approval and is always audited.

---
title: Why was an action blocked?
slug: why-was-an-action-blocked
category: security-compliance
language: en
visibility: authenticated
status: published
tags: [security, policy]
article_type: faq
---
Actions may be blocked by Emergency Stop, never_store classification, denied role in access policy, hybrid cloud sync restrictions, or deployment mode settings. Policy decisions are logged with reasons.

---
title: Why does this action require approval?
slug: why-does-action-require-approval
category: security-compliance
language: en
visibility: authenticated
status: published
tags: [security, approval]
article_type: faq
---
External use of confidential data, automations, agent cloud sync, and privacy operations typically require approval per classification and access policy rules.

---
title: What happens during a security incident?
slug: what-happens-during-security-incident
category: security-compliance
language: en
visibility: authenticated
status: published
tags: [security, incidents]
article_type: faq
---
Security incidents are recorded with severity, evidence, and recommended actions. Admins investigate, contain, and resolve. Critical incidents may trigger Emergency Stop or integration lockdown.

---
title: Can audit logs be exported?
slug: can-audit-logs-be-exported
category: security-compliance
language: en
visibility: authenticated
status: published
tags: [compliance, audit]
article_type: faq
---
Yes. Authorized admins and auditors can request audit exports from Enterprise Audit and Compliance reports. Audit logs are not auto-deleted by privacy requests.

---
title: How does Emergency Stop affect security?
slug: how-emergency-stop-affects-security
category: security-compliance
language: en
visibility: authenticated
status: published
tags: [security, governance]
article_type: faq
---
When Emergency Stop is active, the Policy Engine blocks new actions except read, audit, and export_audit operations until an approved administrator reopens the system.

---
title: What is the difference between audit log and activity log?
slug: audit-log-vs-activity-log
category: security-compliance
language: en
visibility: authenticated
status: published
tags: [compliance, audit]
article_type: faq
---
Activity logs show operational events for users. Security audit logs record sensitive access, policy evaluations, secret operations, and compliance actions with tamper-aware retention.

---
title: What data is synced in Hybrid mode?
slug: what-data-is-synced-in-hybrid
category: security-compliance
language: en
visibility: authenticated
status: published
tags: [security, hybrid, enterprise]
article_type: faq
---
Only data allowed by data residency and classification policies — typically redacted summaries, metadata, and safe reports. Raw internal data is not synced unless explicitly permitted.

---
title: How does Aipify work with on-premise data?
slug: how-aipify-works-with-on-premise-data
category: security-compliance
language: en
visibility: authenticated
status: published
tags: [security, on-premise]
article_type: faq
---
On-premise deployment keeps operational data inside the customer environment. The Policy Engine enforces local-only storage and blocks unauthorized cloud sync.
