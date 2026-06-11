# Marketplace & Partner Ecosystem Foundation Engine FAQ

## FAQ 1

**Question:** What is the Marketplace & Partner Ecosystem Foundation Engine?

**Answer:** It provides a governed view of certified partners, marketplace offerings, certification status, and quality indicators for your organization. It extends Module Marketplace (A.23), Business Packs (A.43), and the API Platform scaffold (A.21) with human approval workflows — partners are never auto-approved.

## FAQ 2

**Question:** How do partner approvals work?

**Answer:** Partners start in `pending` status. Users with `ecosystem.approve` can review and approve partners, which also publishes pending offerings. Suspensions require `ecosystem.suspend` and cascade to published offerings. Every approval, suspension, and re-certification is audited.

## FAQ 3

**Question:** What offering types are supported?

**Answer:** Six offering types: business_packs, workflow_templates, training_content, integrations, industry_templates, and consulting_services. Each offering tracks version, status, and quality indicators (excellent, good, acceptable, needs_review).

## FAQ 4

**Question:** How does this relate to the Module Marketplace?

**Answer:** The dashboard links to Module Marketplace Foundation Engine (A.23) for module activation and Business Packs (A.43) for pack offerings from certified partners. The Partner Ecosystem layer adds certification governance and offering quality — distinct from tenant module licensing.
