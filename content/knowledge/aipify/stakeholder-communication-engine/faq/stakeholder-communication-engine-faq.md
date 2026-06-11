# Stakeholder Communication Engine FAQ

## FAQ 1

**Question:** What is the Stakeholder Communication Engine?

**Answer:** The Stakeholder Communication Engine helps organizations coordinate communications to employees, managers, executives, customers, partners, and suppliers. It supports multi-channel delivery, engagement tracking, and outcome summaries — humans approve and publish; Aipify structures delivery and records metadata only.

## FAQ 2

**Question:** What communication types and channels are supported?

**Answer:** Communication types include announcements, operational updates, incident notifications, onboarding messages, executive communications, and policy updates. Delivery channels include email, desktop notifications, in-platform messages, and knowledge center articles. Campaigns track status from draft through scheduled, active, completed, or cancelled.

## FAQ 3

**Question:** How do scheduling, publishing, and outcomes work?

**Answer:** Teams create campaigns via `create_communication_campaign()`, schedule with `schedule_campaign()`, and publish via `publish_campaign()` which records per-channel deliveries. Engagement metrics use `record_campaign_delivery()` and `record_communication_outcome()` — outcomes may link to organizational memory metadata only, never raw operational records.

## FAQ 4

**Question:** Who can manage stakeholder communications?

**Answer:** Viewing requires `communications.view`. Creating and updating campaigns requires `communications.manage`. Scheduling and publishing require `communications.publish`. Exporting campaign metadata requires `communications.export`. These permissions are distinct from `notifications.*` alert distribution permissions.
