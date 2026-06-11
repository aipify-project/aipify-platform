# Observability & Platform Health Engine — FAQ

## What is the Observability & Platform Health Engine?

A tenant-scoped platform and service health monitoring framework for Aipify Core — proactive visibility, component status, incidents, maintenance windows, and early warning signals.

## How does it differ from Quality Guardian (A.13)?

Quality Guardian monitors **operational quality** (support quality, knowledge gaps, approval bottlenecks). Observability monitors **platform/service health** (API availability, integration uptime, notification delivery, authentication signals).

## Which components are monitored?

Authentication, Support AI, Admin Assistant, Knowledge Center, Integrations, Notifications, Audit Log, Dashboard, and Analytics — with configurable per-org thresholds.

## Can I schedule maintenance windows?

Yes. Owners and administrators with `maintenance.manage` can schedule windows. Notifications may be sent via the Notification & Communication Engine (A.17).

## Are health events audited?

Yes. Health checks, incident creation/resolution, maintenance scheduling, threshold changes, and observability config updates are recorded via audit logs.
