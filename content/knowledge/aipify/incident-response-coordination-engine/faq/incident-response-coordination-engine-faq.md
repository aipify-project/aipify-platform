# Incident Response Coordination Engine FAQ

## FAQ 1

**Question:** What is the Incident Response Coordination Engine?

**Answer:** The Incident Response Coordination Engine helps organizations respond to operational disruptions with clear ownership, structured escalation, transparent communications, and audit accountability. It supports rapid response workflows — humans coordinate decisions; Aipify structures the process and records metadata only.

## FAQ 2

**Question:** What incident types are supported?

**Answer:** Incidents cover support incidents, system outages, integration failures, security incidents, operational disruptions, and customer-impacting events. Each incident tracks severity (low through critical), status lifecycle, owner, timeline events, and root cause metadata.

## FAQ 3

**Question:** How do escalation and communications work?

**Answer:** Teams escalate via `escalate_incident()` which records timeline events and escalation communications. Stakeholder, executive, resolution, and escalation messages use `record_incident_communication()`. Post-resolution, `capture_incident_lessons_learned()` may link to organizational memory — metadata only, never raw operational records.

## FAQ 4

**Question:** Who can manage and resolve incidents?

**Answer:** Viewing requires `incidents.view`. Creating and updating incidents requires `incidents.manage`. Escalation requires `incidents.escalate`. Resolution and closure require `incidents.resolve`. Owners and administrators typically hold full permissions; support agents may view and escalate.
