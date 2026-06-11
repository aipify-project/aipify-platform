# Employee Knowledge Engine (EKE)

**Phase 41 · Internal knowledge partner for employees**

Transforms Aipify from a customer-facing support assistant into an internal knowledge partner that helps employees learn, navigate, and execute company processes consistently.

**Prerequisites:** [BUSINESS_DNA_ENGINE.md](./BUSINESS_DNA_ENGINE.md) · [AUTONOMOUS_SUPPORT_OPERATIONS.md](./AUTONOMOUS_SUPPORT_OPERATIONS.md)

**Code:** `lib/employee-knowledge-engine/` · migration `20260612900000_employee_knowledge_phase41.sql`

---

## Vision

From *"Ask Karen, she knows how we do this"* → *"Aipify can guide you through the process."*

---

## Route mapping

| Spec | Aipify route |
|------|----------------|
| `/admin/employee-knowledge` | `/app/settings/employee-knowledge` |

---

## Knowledge categories

| Category | Examples |
|----------|----------|
| `company_info` | Mission, values, org structure |
| `policies` | Privacy, HR, compliance |
| `operational_procedures` | Approvals, workflows, escalations |
| `product_knowledge` | Products, pricing, features |
| `support_procedures` | Customer response, moderation |
| `training_content` | Onboarding, tutorials, guides |

---

## Database tables

| Table | Purpose |
|-------|---------|
| `eke_settings` | Assistant, gaps, onboarding, approval flags |
| `employee_knowledge_items` | Approved internal knowledge articles |
| `knowledge_permissions` | Role × category access levels |
| `employee_knowledge_sources` | Admin-approved import sources |
| `employee_knowledge_gaps` | Improvement loop / gap detection |
| `employee_onboarding_paths` | Role-based learning paths |
| `employee_onboarding_progress` | Per-user completion tracking |
| `employee_knowledge_audit_logs` | Full audit trail |

---

## Ingestion flow

1. Administrator approves source
2. Content scanned and categorized
3. Knowledge chunks created with metadata
4. Confidence evaluated
5. Admin review available
6. Knowledge activated

**Rule:** Nothing imported without administrator consent.

---

## Confidence levels

| Level | Criteria |
|-------|----------|
| High (80+) | Approved documentation exists |
| Medium (50–79) | Partial documentation — human confirmation recommended |
| Low (&lt;50) | Incomplete — escalation suggested |

---

## APIs

| Route | Methods |
|-------|---------|
| `/api/employee-knowledge` | GET, PATCH, POST (create, approve, import, onboarding, feedback) |
| `/api/employee-knowledge/ask` | POST |
| `/api/employee-knowledge/search` | POST |

---

## Key RPCs

- `answer_employee_question()` — role-filtered Q&A with steps and confidence
- `search_employee_knowledge()` — natural language / keyword search
- `get_customer_employee_knowledge_center()` — admin dashboard
- `calculate_employee_knowledge_health()` — health score 0–100
- `get_onboarding_path_for_role()` / `record_onboarding_progress()` — onboarding engine
- `detect_employee_knowledge_gap()` — improvement loop
- `get_platform_employee_knowledge_overview()` — aggregates only

---

## Chat integration

Natural language via `detectEmployeeKnowledgeIntent()` in `lib/employee-knowledge-engine/detection.ts` — suggests Employee Knowledge dashboard; employees retain judgment.

---

## i18n

`customerApp.employeeKnowledge.*` · `platform.employeeKnowledge.*` (en/no/sv/da)
