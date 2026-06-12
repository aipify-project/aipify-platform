# Records & Retention Management Engine FAQ

## FAQ 1

**Question:** What is the Records & Retention Management Engine?

**Answer:** The Records & Retention Management Engine governs retention policies, metadata-only archived records, disposal approval workflows, and compliance snapshots. Aipify prepares retention governance; humans approve disposal. No raw document content is stored in archives — metadata only per trust architecture.

## FAQ 2

**Question:** How does this relate to Document & Output (A.59)?

**Answer:** Document & Output generates operational outputs with file metadata. The Records & Retention Management Engine (nav id `recordsRetentionManagementEngine`, route `/app/records-retention-management-engine`) can archive `output_generations` as a source entity type with metadata links — never raw file content. Retention policies apply by record category.

## FAQ 3

**Question:** How does the disposal workflow work?

**Answer:** Authorized users request disposal with `request_record_disposal()`. Approvers with `records.dispose` call `approve_record_disposal()` or reject the request. After approval, `complete_record_disposal()` records disposal metadata and marks the archived record as disposed. All steps are audited via `_rrme_log()`.

## FAQ 4

**Question:** Who can manage retention policies and archives?

**Answer:** Viewing requires `records.view`. Creating and updating policies requires `records.manage`. Archiving and restoring requires `records.archive`. Disposal request, approval, and completion requires `records.dispose`. Owners and administrators typically hold full permissions; viewers may view policies and compliance snapshots only.
