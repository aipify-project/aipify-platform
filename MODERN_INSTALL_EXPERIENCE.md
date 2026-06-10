# Aipify Modern Install Experience & License Engine

**Phase 24 · Version 1.0 · Critical**

Customers connect Aipify like a modern SaaS product. Licensing, domain ownership, plan limits, and token validation stay server-side.

**Prerequisites:** [INSTALL_ENGINE.md](./INSTALL_ENGINE.md) · [LICENSE_CENTER.md](./LICENSE_CENTER.md) · [TRUST_ARCHITECTURE.md](./TRUST_ARCHITECTURE.md)

**Code:** `lib/install/experience.ts`, `lib/install/knowledge-base.ts` · Customer: `/app/install` · Developer: `/app/settings/developer` · APIs: `/api/install/begin`, `/api/install/detect-platform`, `/api/install/escalate`

---

## Layer ownership

| Surface | Layer | Responsibility |
|---------|-------|----------------|
| Installation Assistant UI, guided steps, escalations | **Customer App** | `/app/install` |
| Developer Settings (tokens, API keys, diagnostics) | **Customer App** | `/app/settings/developer` |
| Install tokens, heartbeat, domain/plan validation | **Install Engine** | `app/api/install/*`, RPCs |
| Plan limits, subscription grace/pause | **Shared** | `lib/core/plans.ts`, `assert_license_capacity` |

---

## 1. Customer flow (8 steps)

1. Select platform  
2. Sign in to Aipify  
3. Connect platform  
4. Approve permissions  
5. Aipify learns  
6. Review recommendations  
7. Activate Aipify  
8. First executive briefing  

Standard users **never** see install tokens. Tokens are issued server-side via `begin_modern_install` but stripped from API responses.

---

## 2. Install tokens (not license keys)

Install tokens validate server-side:

- Tenant · Subscription · Domain · Installation count · Plan limits · Allowed modules · Heartbeat status

Security rules (`lib/install/token-policy.ts`):

- Never in logs or email  
- Revocable via rotation  
- Shown only in Developer Settings after explicit rotation  

---

## 3. Platform detection

`POST /api/install/detect-platform` inspects URL/hints. If uncertain, returns `ask_customer: true` — never guess silently.

Supported: Shopify, WordPress, WooCommerce, Custom Website.

---

## 4. Knowledge base

Structured guides in `lib/install/knowledge-base.ts`. Support AI should prefer these before generic answers.

---

## 5. Support escalation

`POST /api/install/escalate` records:

- Platform type · Domain · Installation status · Error summary  

Never collect passwords, payment details, email/chat content, or PII.

---

## 6. Heartbeat (customer labels)

| Internal | Customer-facing |
|----------|-----------------|
| `healthy` | Connected |
| `warning` | Warning |
| `disconnected` | Disconnected |
| `pending_update` | Updating |
| `paused` | Suspended |

---

## 7. Subscription control

3-day grace period (see LICENSE_CENTER.md). After grace: suspend services, preserve configuration. Payment restores services automatically.

---

## 8. Database (Phase 24)

| Object | Purpose |
|--------|---------|
| `customer_onboarding.modern_install_*` | Platform selection & step |
| `install_escalations` | Support escalations |
| `begin_modern_install` | Create draft without returning token |
| `get_customer_modern_install_state` | Customer state (no tokens) |
| `record_install_support_escalation` | Escalation RPC |

---

## 9. Principle

> Complexity belongs inside Aipify. Simplicity belongs to the customer.
