# Change Management Engine FAQ

## FAQ 1

**Question:** What is the Change Management Engine?

**Answer:** The Change Management Engine helps organizations plan, communicate, and measure adoption of operational changes — such as new module activations, workflow updates, governance changes, role updates, process improvements, and deployment initiatives. It provides structured implementation with transparent communication and measurable outcomes.

## FAQ 2

**Question:** How does change communication work?

**Answer:** For each initiative, owners create communication plans — stakeholder announcements, rollout messages, reminders, and completion updates. Plans start as drafts or scheduled messages and are released when ready. Every release is audited via `_cme_log()` for accountability.

## FAQ 3

**Question:** How does training integrate with Learning & Training (A.36)?

**Answer:** `assign_change_training()` links change initiatives to learning paths. When a learning path exists, it calls `assign_training_path()` from the Learning & Training Engine. When paths are unavailable, Aipify stores metadata-only training links — never raw training content.

## FAQ 4

**Question:** Who can manage and review changes?

**Answer:** Viewing requires `changes.view`. Creating initiatives and completing milestones requires `changes.manage`. Communication plans require `changes.communicate`. Impact assessments and adoption metrics require `changes.review`. Owners and administrators typically hold full permissions; managers may manage and review changes.
