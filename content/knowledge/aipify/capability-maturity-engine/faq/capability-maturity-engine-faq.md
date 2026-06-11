# Capability Maturity Engine FAQ

## FAQ 1

**Question:** What is the Capability Maturity Engine?

**Answer:** The Capability Maturity Engine helps organizations assess capability maturity across six domains (support operations, governance, knowledge management, workflow automation, change management, strategic execution) using a five-level scale from initial to optimized. Humans assess maturity; Aipify surfaces gaps and learning paths with metadata only.

## FAQ 2

**Question:** What are the maturity levels and domains?

**Answer:** Maturity levels 1–5 map to initial, developing, established, advanced, and optimized. Domains cover support operations, governance, knowledge management, workflow automation, change management, and strategic execution. Each domain can have assessments, criteria scores, and improvement roadmaps with learning requirements.

## FAQ 3

**Question:** How do roadmaps and learning requirements work?

**Answer:** `generate_maturity_roadmap()` creates domain-specific recommendations based on the latest assessment level and assigns learning requirements referencing the Learning & Training Engine (A.36). Roadmaps follow a draft → active → completed / archived lifecycle. Optional org memory hooks capture assessment learnings — metadata only.

## FAQ 4

**Question:** Who can manage and export capability maturity data?

**Answer:** Viewing requires `maturity.view`. Creating and updating assessments requires `maturity.manage`. Generating roadmaps requires `maturity.review`. Report export requires `maturity.export`. All four permissions are registered in `PERMISSION_KEYS`. Owners and administrators typically hold full permissions; support agents and viewers may view assessments.
