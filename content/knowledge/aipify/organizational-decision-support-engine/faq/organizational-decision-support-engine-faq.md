# Organizational Decision Support Engine FAQ

## FAQ 1

**Question:** What is the Organizational Decision Support Engine?

**Answer:** The Organizational Decision Support Engine (ODSE) helps teams manage tenant-wide operational and strategic decision recommendations with structured review, approval, outcome tracking, and audit accountability. Aipify prepares explainable recommendations — humans decide. This is distinct from the Assistant Decision Support Engine at `/app/assistant/decisions`, which provides personal guidance.

## FAQ 2

**Question:** What decision categories are supported?

**Answer:** Categories include operational, staffing, support prioritization, workflow optimization, strategic planning, and resource allocation. Each decision tracks recommendation text, confidence level (low, medium, high), rationale, expected benefits, potential risks, dependencies, alternatives, and scenarios.

## FAQ 3

**Question:** How does the approval workflow work?

**Answer:** Decisions start as `proposed`, move to `under_review` via `review_decision()`, then `approve_decision()` or `reject_decision()` with rationale. Approved decisions can be marked `implemented` via `mark_decision_implemented()`. Post-decision, `record_decision_outcome()` captures outcome summaries and optional organizational memory hooks — metadata only.

## FAQ 4

**Question:** Who can view, review, and export decisions?

**Answer:** Viewing requires `decisions.view`. Proposing decisions requires `decisions.manage`. Review, approval, rejection, and implementation require `decisions.review`. Exporting reports requires `decisions.export`. Owners and administrators typically hold full permissions; viewers may view only.
