# Business Pulse Engine (BPE) — Phase 47

Calm operational awareness — what is normal, what changed, and what may deserve attention.

**Spec:** `aipify-core/modules/business-pulse-engine/phase-47-business-pulse-engine.txt`  
**Code:** `lib/aipify/business-pulse/`  
**Dashboard:** `/app/business-pulse`  
**Executive report:** `/app/business-pulse/executive-report` (Enterprise)  
**API:** `/api/aipify/business-pulse/*`

---

## Principle

> Aipify observes the business rhythm. Aipify notices meaningful change. Aipify explains calmly. Aipify recommends next steps. Humans remain in control.

Business Pulse is not a grade. It is a calm operational awareness layer.

---

## Package placement

| Plan | Capabilities |
|------|----------------|
| Starter / Growth | Upgrade message only |
| Business Pro | Support, Sales, Operations, Customer, Automation pulse · Daily briefing · Basic alerts · Anomaly detection |
| Enterprise | + Team Pulse · Executive report · Predictive signals (planned) · Custom thresholds (planned) |

Module gate: `business_pulse` in `lib/core/plans.ts` (business+).

---

## Pulse areas

`support` · `sales` · `operations` · `customer` · `automation` · `team` (Enterprise)

Status labels (calm wording):

`normal` · `worth_reviewing` · `needs_attention` · `requires_action`

Alert severities: `info` · `review` · `attention` · `action_required`

---

## Database

- `aipify_business_pulse_snapshots` — daily pulse snapshots per tenant
- `aipify_business_pulse_alerts` — active change alerts with acknowledgement flow
- `aipify_business_pulse_baselines` — expected ranges and patterns per metric

**RPCs:** `get_customer_business_pulse_center()`, `get_business_pulse_briefing()`, `recalculate_business_pulse()`, `acknowledge_business_pulse_alert()`, `dismiss_business_pulse_alert()`

Migration: `supabase/migrations/20260613500000_business_pulse_phase47.sql`

---

## Adapters

Integration-ready adapter pattern under `lib/aipify/business-pulse/adapters/`:

- `supportPulseAdapter` · `salesPulseAdapter` · `operationsPulseAdapter`
- `teamPulseAdapter` (Enterprise) · `customerPulseAdapter` · `automationPulseAdapter`

Each adapter returns metrics with current/expected values, status, explanation, and recommendation.

---

## Integration

Feeds signals into:

- **Continuous Improvement Engine** — repeated pulse issues suggest improvements
- **Action Center** — follow-up actions when pulse changes require attention
- **Reminder Engine** — unresolved pulse alerts
- **Adaptive Working Style Engine** — presentation by user preference
- **Business Insights Engine** — deeper analysis from pulse data

---

## Privacy

- Tenant isolation is mandatory
- Team Pulse is aggregated only — never ranks individuals
- No hidden productivity scores or employee surveillance
- Sensitive pulse views should be logged (planned)
