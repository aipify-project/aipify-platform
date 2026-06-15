# Aipify — Global Announcements & Communication Center (Phase 272)

**Feature owner:** Platform Admin  
**Route:** `/platform/communications/announcement-center`  
**Migration:** `20261459000000_global_announcements_communication_center_phase272.sql`  
**Module:** `lib/global-announcements/`

---

## Purpose

Centralized communication system for Aipify Group AS — customers, Growth Partners, platform administrators, and internal teams.

---

## Platform Admin navigation

```
Platform Admin → Communications → Announcement Center
```

---

## Overview cards

- Active Announcements
- Scheduled Messages
- Draft Messages
- Targeted Campaigns
- Delivery Success Rate
- Messages Requiring Review

---

## Announcement types

System Updates · Maintenance Notices · New Feature Releases · Security Notifications · Billing Communications · Growth Partner Updates · Internal Communications

---

## Target audiences

All Customers · Trial Customers · Enterprise Customers · Growth Partners · Super Admins · Platform Admins · Internal Teams

---

## Announcement table

Title · Category · Audience · Status · Scheduled Date · Created By · Actions

**Statuses:** Draft · Scheduled · Published · Expired · Cancelled · Archived

**Actions:** View · Edit · Duplicate · Publish · Schedule · Archive · Approve

---

## Delivery channels

In-App Notifications · Email · Dashboard Banners · Notification Center

---

## Scheduling

Immediate publishing · Future scheduling · Expiration dates

---

## Audience filters

Country · Language · Subscription Plan · Customer Segment · User Role

---

## Review workflow

Announcements may require approval before publishing (Super Admin · Communications Admin roles enforced server-side).

---

## Announcement analytics

Views · Email Opens · Click Rates · Delivery Success Rate

---

## Audit logging

Announcement Created · Edited · Published · Cancelled · Archived · Audience Modified · Scheduled · Duplicated · Approved

---

## Empty state

> No announcements available.

---

## APIs

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/global-announcements/overview` | Dashboard bundle via `get_global_announcement_center` |
| POST | `/api/global-announcements/actions` | Actions via `record_global_announcement_action` |

---

## Tables

`global_announcements` · `global_announcement_analytics` · `global_announcement_audit_logs`

---

## i18n

`platform.nav.announcementCenter` · `platform.globalAnnouncements.*` in `locales/{en,no,sv,da}/platform.json`

---

END OF PHASE.
