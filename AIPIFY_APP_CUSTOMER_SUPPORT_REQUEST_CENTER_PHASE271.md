# APP — Customer Support Request Center (Phase 271)

## Purpose

Give customers a clear place to contact Aipify Support, track requests, and receive structured assistance.

**Feature owner:** Customer App (`/app/support/requests`)

## Navigation

```
APP → Support → Support Requests
/app/support/requests
/app/support/requests/[id]
```

## Features

- Seven categories: Technical, Billing, Integrations, Business Packs, Account, Security, General
- Priorities: Low, Medium, High, Urgent
- Statuses: Open, In Review, Waiting for Customer, Waiting for Aipify, Resolved, Closed
- List with filters, search, create form, empty state
- Detail: full request, status history, audit, placeholders for comments/attachments/internal notes
- Role-based visibility within organization

## API

- `GET /api/aipify/support-requests` — list with filters
- `POST /api/aipify/support-requests` — create
- `GET /api/aipify/support-requests/[id]` — detail
- `PATCH /api/aipify/support-requests/[id]` — update

## Architecture

```
supabase/migrations/20261540000000_app_portal_support_request_center_phase271.sql
lib/app-portal/support-requests/
app/api/aipify/support-requests/
components/app/app-portal/SupportRequestsCenterPanel.tsx
components/app/app-portal/SupportRequestDetailPanel.tsx
```
