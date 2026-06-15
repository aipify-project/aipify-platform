# Aipify — Customer Health & Early Warning Engine (Phase 274)

**Feature owner:** Super Admin  
**Migration:** `20261461000000_customer_health_early_warning_engine_phase274.sql`  
**Module:** `lib/customer-health-early-warning/`

---

## Purpose

Proactively identify customers who may need assistance before they request support — improving retention, satisfaction, and long-term success.

**Founding principle:** The best customer success programs solve problems before customers feel abandoned.

---

## Surface

| Surface | Route |
|---------|-------|
| Super Admin → Customer Success → Customer Health | `/super/customer-health` |

---

## Customer Health Score (0–100)

| Category | Range |
|----------|-------|
| Healthy | 80–100 |
| Stable | 60–79 |
| Attention Needed | 40–59 |
| At Risk | 0–39 |

**Health factors:** login frequency · feature adoption · install completion · support cases · active users · activity trends · subscription status · feedback sentiment · usage growth/decline · onboarding completion

**Trend indicators:** ↑ Improving · → Stable · ↓ Declining

---

## Early warning signals

- No login for 30+ days
- Significant usage decline
- Failed onboarding steps
- Repeated support topics
- Multiple unresolved tickets
- Negative feedback patterns
- Expiring payment methods
- Declining team engagement

---

## Dashboard sections

Overview: Healthy · Stable · Attention Needed · At Risk · Recovery Opportunities

Customer table: Company · Health Score · Trend · Last Activity · Plan · Support Status · Success Owner · Actions

Automated recommendations · Success tasks · Recovery workflows · Audit log

---

## APIs

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/customer-health/overview` | Health dashboard |
| POST | `/api/customer-health/actions` | Recovery & success actions |

---

## Privacy

Health scoring exists to improve customer outcomes — never for advertising or resale to third parties.

---

## Tables

`customer_health_profiles` · `customer_health_early_warnings` · `customer_health_recommendations` · `customer_health_tasks` · `customer_health_recovery_workflows` · `customer_health_audit_logs`

---

END OF PHASE.
