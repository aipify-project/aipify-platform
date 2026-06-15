# Aipify — Enterprise Billing Experience Refinement (Phase 264)

**Feature owner:** SHARED (Customer App + Platform Admin billing surfaces)  
**Module:** `lib/billing-experience/` · `components/shared/billing-experience/`  
**Builds on:** Enterprise Invoice & DNB Billing Engine (`lib/enterprise-invoicing/`)

> **Phase numbering note:** Phase 264 is also used for Enterprise Opportunity Discovery Engine in the enterprise skills era. This document covers the **billing experience refinement** only.

---

## Purpose

Refine the enterprise billing experience to clearly separate **self-service customers** from **enterprise organizations** — professional, scalable, and enterprise-ready while remaining simple for small businesses.

---

## Commercial principle

| Segment | Behavior | Label |
|---------|----------|-------|
| Small businesses | Pay now. Use now. | **Instant Activation** |
| Large organizations | Approve. Procure. Deploy. | **Enterprise Procurement** |

Aipify Group AS serves both customer segments equally well. *From Norway. For the world.*

---

## Instant Activation

- **Former name:** Self-service billing
- **Providers:** Stripe · Vipps MobilePay · Klarna (official logos, rounded cards)
- **Customer message:** Activate your subscription instantly and start using Aipify within minutes.
- **Behavior:** Clicking a provider initiates checkout; access upgrades activate after payment.

**Routes:** `/app/settings/billing/payment-providers` · `/platform/payment-providers`

---

## Enterprise Procurement

- **Former name:** Enterprise invoice billing
- **Methods:** DNB Invoice · Purchase Orders · Bank Transfer · 30/60/90-Day Terms · Framework Agreements
- **Enterprise message:** Our enterprise team supports procurement processes, invoice terms, and tailored agreements.

**Routes:** `/platform/billing/enterprise-invoices` · `/app/settings/billing/invoice-details`

---

## Enterprise Invoice Center

Functional invoice table with columns:

- Customer · Invoice Number · Amount · Status · Due Date · Payment Method · Actions

Status badges: Draft · Sent · Paid · Overdue · Cancelled (+ extended statuses)

Actions: View · Download PDF · Send Reminder · Mark Paid

---

## Smart billing routing (registration)

During workspace registration (Step 3 — Package):

**"How would you like to purchase Aipify?"**

- Instant activation — ideal for smaller teams
- Enterprise procurement — ideal for organizations requiring invoicing or approvals

Selection stored in `workspace_metadata.billing_path` via `complete_aipify_workspace_registration`.

---

## Components

| Component | Purpose |
|-----------|---------|
| `InstantActivationSection` | Branded provider cards (admin or checkout mode) |
| `EnterpriseProcurementSection` | Enterprise methods and messaging |
| `SmartBillingRoutingPanel` | Onboarding purchase path selection |
| `EnterpriseInvoiceTable` | Platform invoice center table |

---

## i18n

- `platform.billingExperience.*` · `customerApp.billingExperience.*`
- Updated `billingModel` labels: Instant Activation / Enterprise Procurement
- `auth.wizard.errors.billingPathRequired`

Locales: `en` · `no` · `sv` · `da` (extend Nordic locales as needed)

---

## AIPIFY PRINCIPLES

People First · Technology Second · Enterprise quality · Clear commercial paths without friction.

**END OF PHASE.**
