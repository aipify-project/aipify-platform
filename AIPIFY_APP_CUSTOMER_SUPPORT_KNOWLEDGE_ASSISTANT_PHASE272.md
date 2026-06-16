# APP — Customer Support Knowledge Assistant (Phase 272)

## Purpose

Help customers find answers from the Knowledge Center before creating a support request.

**Feature owner:** Customer App (`/app/support/assistant`)

## Navigation

```
APP → Support → Support Assistant
/app/support/assistant
```

## Features

- Knowledge search across FAQs, setup, billing, integrations, Business Packs
- Six suggested questions with step-by-step guidance
- Answer panel with related articles
- Escalation CTA → Support Request Center with prepared context (user confirms)
- Lightweight context staging table for audit

## API

- `GET /api/aipify/support-assistant/search` — search knowledge corpus
- `POST /api/aipify/support-assistant/context` — prepare support request context

## Architecture

```
supabase/migrations/20261541000000_app_portal_support_knowledge_assistant_phase272.sql
lib/app-portal/support-assistant/
app/api/aipify/support-assistant/
components/app/app-portal/SupportAssistantPanel.tsx
```

No autonomous AI — structured Knowledge Center search only.
