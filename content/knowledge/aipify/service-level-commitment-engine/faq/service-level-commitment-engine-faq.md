# Service Level & Commitment Engine FAQ

## FAQ 1

**Question:** What is the Service Level & Commitment Engine?

**Answer:** The Service Level & Commitment Engine helps organizations define operational commitments — support response times, incident acknowledgment, resolution targets, onboarding milestones, and approval turnaround — then track compliance with transparent alerts and executive summaries. Humans define targets; Aipify records metadata only.

## FAQ 2

**Question:** What commitment types are supported?

**Answer:** Commitments cover support response, incident response, resolution targets, onboarding commitments, and approval turnaround. Each commitment specifies a target value, measurement unit (minutes, hours, business days, or percentage), severity scope, and lifecycle status (active, paused, or retired).

## FAQ 3

**Question:** How do alerts and performance tracking work?

**Answer:** Teams record period compliance via `record_commitment_performance()`. When thresholds are exceeded, `create_commitment_alert()` surfaces threshold warnings, breaches, or escalations. Alerts are acknowledged via `acknowledge_commitment_alert()`. Optional org memory hooks capture learnings — metadata only.

## FAQ 4

**Question:** Who can manage and export commitments?

**Answer:** Viewing requires `commitments.view`. Creating and updating commitments requires `commitments.manage`. Performance recording and alert acknowledgment require `commitments.review`. Report export requires `commitments.export`. Owners and administrators typically hold full permissions; support agents may view and review.
