# AIPIFY – PHASE 435
## TITLE: Organizational Relationship Intelligence

**PURPOSE:** Enable Aipify to understand how people, customers, vendors, partners, teams, departments, projects, and systems are connected across the organization.

**OBJECTIVES:**
- Relationship Intelligence Center at `/app/intelligence/relationships`
- Customer, vendor, partner, employee, and project intelligence
- Project dependency engine and organizational risk detection
- Executive relationship dashboard and companion recommendations

**REQUIREMENTS:**
- Build on Phase A.78 organizational relationship tables
- Distinct from Phase 33 personal RSI at `/app/assistant/relationships`
- Auditable, role-controlled, permission-based governance
- i18n: en, no, sv, da

**COMPONENTS:**
- Migration: `20261843500000_organizational_relationship_intelligence_phase435.sql`
- Lib: `lib/organizational-relationship-intelligence/`
- UI: `components/app/organizational-relationship-intelligence/`
- API: `/api/intelligence/relationships`

END OF PHASE.
