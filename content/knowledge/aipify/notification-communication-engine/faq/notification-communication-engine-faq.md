# Notification & Communication Engine — FAQ

## What is the Notification & Communication Engine?

A centralized organization communication framework for Aipify Core phases — delivering actionable alerts, preferences, and digests across support, approvals, integrations, and more.

## How does it relate to the Operations Dashboard?

The Operations Dashboard (A.9) shows recent notifications via widgets. A.17 is the authoritative communication layer with full delivery state, preferences, and digests. Sends mirror to legacy `organization_notifications` for dashboard compatibility.

## Can I control which categories I receive?

Yes. Per-user preferences include category subscriptions, delivery channels, frequency, and quiet hours aligned with Presence notification settings.

## Do critical alerts bypass quiet hours?

Yes. Critical alerts may bypass quiet hours by default, respecting org governance policies. High-priority items may still be deferred during quiet hours unless marked critical.

## Are notification payloads audited?

Yes. Sends, dismissals, preference changes, digest generation, and failed deliveries are recorded via audit logs.
