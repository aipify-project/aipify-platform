---
title: Desktop Extensions for Developers
slug: desktop-extensions-for-developers
category: developers
language: en
visibility: authenticated
status: published
tags: [developers, desktop]
keywords: [desktop extension, notification, widget]
article_type: guide
priority: 10
---
Desktop Extensions add widgets, notification panels, and focus tools to the Desktop Companion.

**Permission:** desktop.notification.create (typically medium risk)

**Design guidelines:**
- Reduce notification fatigue — batch non-critical alerts
- Escalate critical items through governed channels
- Respect tenant notification settings
- Never send cross-tenant notifications

**Category:** desktop_extension in manifest

Integrates with Desktop Agent collaboration flows for reminder timing and escalation.
