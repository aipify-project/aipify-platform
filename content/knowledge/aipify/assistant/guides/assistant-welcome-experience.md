---
title: Assistant welcome experience
slug: assistant-welcome-experience
category: assistant-identity
language: en
visibility: authenticated
status: published
tags: [assistant, welcome, onboarding, install]
article_type: guide
---
# Assistant welcome experience

Aipify starts with a relationship, not a dashboard. During first install or tenant setup, the welcome flow asks who hired Aipify and collects communication preferences.

## Steps

1. **Who hired me?** — Stores `assistant_owner_name`.
2. **How to address you** — First name, full name, role, or custom.
3. **Primary focus** — Support, administration, quality, automation, insights, or all.
4. **Communication style** — Professional through technical and precise.
5. **Uncertainty handling** — Ask first, suggest and approve, draft only, or report only.
6. **Welcome message** — Personalized greeting confirming control and next steps.

## Where it applies

- First install and tenant setup (`/app/welcome`)
- Home banner when welcome is incomplete
- Memory Engine profile sync on completion
- Briefing and Desktop Companion greetings
- Support AI tone (admin-facing vs customer-facing)

## Changing preferences later

Go to **Settings → Assistant identity** to edit owner name, greeting name, style, and toggles. Redo or reset the welcome flow when needed.

## Safety

Warm personality never overrides approvals, governance, or Emergency Stop. Aipify remains a professional assistant — not a separate human employee.
