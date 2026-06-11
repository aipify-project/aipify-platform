# Industry Intelligence Foundation Engine FAQ

## FAQ 1

**Question:** What is the Industry Intelligence Foundation Engine?

**Answer:** It provides industry-specific patterns, terminology, operational priorities, benchmarks, and explainable recommendations for your organization. It extends Business Packs (A.43), Organizational Memory (A.34), and Strategic Intelligence (A.31) with vertical guidance — metadata only, no PII.

## FAQ 2

**Question:** How do I assign an industry profile?

**Answer:** Open the Industry Intelligence dashboard and select from available profiles (Membership Platforms, E-Commerce, Professional Services, Hospitality, Healthcare, Education, Manufacturing). Assignment requires `industry.manage` permission and seeds sample insights for your organization. Every assignment is audited.

## FAQ 3

**Question:** Can I override industry recommendations?

**Answer:** Yes. Overrides require explicit action via `industry.override` permission — Aipify never changes recommendations silently. Your override text replaces the original recommendation and is logged in the audit trail. You can also disable industry insights entirely or add custom terminology and priorities.

## FAQ 4

**Question:** How does this relate to Business Packs and Strategic Intelligence?

**Answer:** The dashboard surfaces Business Pack alignment for your industry (e.g. E-Commerce pack for retail). Strategic Intelligence (A.31) and Organizational Memory (A.34) summaries appear in integration notes so you can connect vertical guidance with cross-module operational insights. Future hooks for external data sources and benchmarking are scaffolded only.
