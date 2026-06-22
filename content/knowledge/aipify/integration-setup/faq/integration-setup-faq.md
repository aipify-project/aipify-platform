---
title: How do I connect an external platform to Aipify?
slug: how-do-i-connect-an-external-platform
category: integration-setup
language: en
visibility: authenticated
status: published
tags: [integrations, setup, faq]
keywords: [connect integration, external platform, setup wizard]
article_type: faq
priority: 10
---
Open APP → Platform → Integrations, choose your system, and follow the 7-step setup wizard. Aipify uses plain language at each step: choose your system, understand access, find your connection key, enter credentials, test the connection, review the access summary, and confirm activation. Read-only access is the default.

---
title: Where do I find my API key?
slug: where-do-i-find-my-api-key
category: integration-setup
language: en
visibility: authenticated
status: published
tags: [integrations, api key, credentials, faq]
keywords: [api key, connection key, secure connection key, find credentials]
article_type: faq
priority: 10
---
Each provider is different. The setup wizard shows step-by-step guidance for Shopify, WordPress, WooCommerce, Stripe, and custom APIs. Look for Settings, Developer, or API sections in your external platform admin. Create a **read-only** connection key and paste it into Aipify during setup. Aipify never shows the full key after saving.

---
title: What is read-only access?
slug: what-is-read-only-access-integration
category: integration-setup
language: en
visibility: authenticated
status: published
tags: [integrations, read-only, security, faq]
keywords: [read-only access, permissions, scopes]
article_type: faq
priority: 10
---
Read-only access means Aipify can read approved operational information from your external system but **cannot change anything**. This is the default for all integrations. Write or admin permissions are never enabled without your explicit approval.

---
title: What is a secure connection key?
slug: what-is-a-secure-connection-key
category: integration-setup
language: en
visibility: authenticated
status: published
tags: [integrations, api key, security, faq]
keywords: [secure connection key, api key, credentials]
article_type: faq
priority: 10
---
A secure connection key (often called an API key or access token) lets Aipify connect to your external system with the permissions you approve. Aipify encrypts credentials at rest, masks them after save, and never displays the full secret again.

---
title: How do I test an integration connection?
slug: how-do-i-test-an-integration-connection
category: integration-setup
language: en
visibility: authenticated
status: published
tags: [integrations, test connection, faq]
keywords: [test connection, validate, verify integration]
article_type: faq
priority: 10
---
After entering your connection key, click **Test the connection** in the setup wizard. Aipify verifies that the key is valid and has the read-only scopes you approved. If the test fails, the wizard shows actionable guidance — check permissions, verify the key, or contact support.

---
title: What should I do if an integration fails?
slug: what-should-i-do-if-an-integration-fails
category: integration-setup
language: en
visibility: authenticated
status: published
tags: [integrations, troubleshooting, faq]
keywords: [integration failed, connection error, unauthorized, invalid scope]
article_type: faq
priority: 10
---
Common causes: an expired or incorrect connection key, missing read-only permissions, or selecting the wrong store or project. Use the error guidance in the setup wizard — it translates technical messages like "Unauthorized" or "Invalid scope" into clear next steps. Run **Test the connection** again after fixing the issue, or contact Aipify Support.

---
title: Is it safe to connect my business tools to Aipify?
slug: is-it-safe-to-connect-integration
category: integration-setup
language: en
visibility: authenticated
status: published
tags: [integrations, security, trust, faq]
keywords: [safe to connect, encryption, revoke access]
article_type: faq
priority: 10
---
Yes — when you follow the read-only default. Credentials are encrypted at rest, masked after save, revocable at any time, and all connect, test, and remove actions are audit logged. You can remove an integration instantly from Platform → Integrations.

---
title: Can I change permissions later?
slug: can-i-change-permissions-later
category: integration-setup
language: en
visibility: authenticated
status: published
tags: [integrations, permissions, faq]
keywords: [change permissions, rotate key, update scopes]
article_type: faq
priority: 10
---
Yes. Remove the integration in Aipify, create a new connection key with updated scopes in your external platform, reconnect, and test. Revoke the old key externally. All changes are audit logged.

---
title: Who can manage integrations?
slug: who-can-manage-integrations
category: integration-setup
language: en
visibility: authenticated
status: published
tags: [integrations, roles, permissions, faq]
keywords: [manage integrations, organization admin, owner]
article_type: faq
priority: 10
---
Organization owners and administrators can connect, test, replace, and remove integrations. Other roles may have view-only access to see connected platforms without changing credentials.

---
title: What is the difference between OAuth and API keys?
slug: oauth-vs-api-keys-integration
category: integration-setup
language: en
visibility: authenticated
status: published
tags: [integrations, oauth, api key, faq]
keywords: [oauth, api keys, connection method]
article_type: faq
priority: 10
---
**OAuth** uses an official provider redirect — you sign in on the external platform and approve scopes there. **API keys** (secure connection keys) are copied manually from the provider admin. Both methods require you to review and approve permissions before Aipify saves credentials.
