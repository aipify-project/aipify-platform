# Aipify Design Principle — Companion Briefing on Every Major Page

**Feature owner:** Customer App  
**Extends:** Briefing System (Phase 60) — `get_briefing_card()`, `lib/aipify/briefing/`, `AipifyBriefingCard`

## Philosophy

Aipify is not a traditional admin panel. Aipify is the **Companion** guiding the journey — alive, warm, and partnership-oriented.

Every major Customer App page should open with a **Companion Briefing**: a compact, context-aware summary of what matters most *right now* in that workspace. The user should feel that Aipify has been paying attention — calmly, honestly, without pressure.

See also [AIPIFY_COMPANION_GOLDEN_RULE.md](./AIPIFY_COMPANION_GOLDEN_RULE.md) — briefings must not stop at counts; include recommended focus, impact, and next steps when data is available.

### Language policy

- Use **Aipify** and **Companion** — never generic "AI"
- Professional tone: inform and prepare; humans decide
- Metadata only — no email, chat, or payment instrument content in summaries

### Examples

| Context | Companion summary (illustrative) |
|---------|----------------------------------|
| Customers | "Aipify noticed your customer journey needs additional attention." |
| Billing | "Revenue remains healthy. Two invoices are approaching due dates." |
| Support | "Aipify resolved 32 support requests today." |
| Approvals | "Aipify prepared 4 action(s) awaiting your approval." |
| Install | "1 installation(s) still completing setup." |

## Implementation pattern

### 1. Database (Core RPC)

Migration: `supabase/migrations/20261130000001_companion_context_briefing_design_principle.sql`

- `_acb_require_tenant()` — tenant guard
- `_acb_context_summary(p_context)` — context-specific summary, key_items, metrics
- `get_companion_context_briefing(p_context)` — public RPC; respects `aipify_briefing_settings.enabled`

Context keys: `home`, `customers`, `customer_success`, `billing`, `support`, `approvals`, `command_center`, `commerce`, `commerce_intelligence`, `commerce_performance`, `product_automation`, `dropshipping`, `license`, `learning`, `install`

### 2. TypeScript

- `lib/aipify/briefing/contexts.ts` — `COMPANION_BRIEFING_CONTEXTS`, route map
- `lib/aipify/briefing/types.ts` — `CompanionContextBriefing`
- `lib/aipify/briefing/parse.ts` — `parseCompanionContextBriefing()`

### 3. API (thin client)

`GET /api/aipify/companion-briefing?context=support` → `get_companion_context_briefing`

### 4. UI

| Component | Purpose |
|-----------|---------|
| `AipifyCompanionBriefingBanner` | Compact indigo gradient banner; fetches API; skeleton while loading; null if disabled |
| `CompanionBriefingPageIntro` | Optional wrapper: title + subtitle + banner |

Labels: `buildCompanionBriefingLabels()` from `lib/app/companion-briefing-labels.ts`  
i18n: `customerApp.companionBriefing.*` (en/no/sv/da)

### 5. Page integration

**Preferred — pages with title block:**

```tsx
import { CompanionBriefingPageIntro } from "@/components/app/briefing";
import { buildCompanionBriefingLabels } from "@/lib/app/companion-briefing-labels";

// Inside page component:
<CompanionBriefingPageIntro
  title={t(`${p}.title`)}
  subtitle={t(`${p}.subtitle`)}
  context="support"
  labels={buildCompanionBriefingLabels(t)}
/>
```

**Alternative — panel-owned title:**

```tsx
import { AipifyCompanionBriefingBanner } from "@/components/app/briefing";

<div className="space-y-6 p-6">
  <AipifyCompanionBriefingBanner context="approvals" labels={buildCompanionBriefingLabels(t)} />
  <ApprovalsCenterPanel ... />
</div>
```

Place the banner **after** the title block (or at the top when the panel renders its own title).

## Page checklist (rolled out)

| Route | Context |
|-------|---------|
| `/app/customer-lifecycle` | `customer_success` |
| `/app/customer-success-engine` | `customer_success` |
| `/app/settings/billing` | `billing` |
| `/app/license` | `license` |
| `/app/support-ai-engine` | `support` |
| `/app/approvals` | `approvals` |
| `/app/command-center` | `command_center` |
| `/app/commerce-intelligence` | `commerce_intelligence` |
| `/app/commerce-performance` | `commerce_performance` |
| `/app/product-automation` | `product_automation` |
| `/app/dropshipping-operations` | `dropshipping` |
| `/app/learning` | `learning` |
| `/app/install` | `install` |

**Home** (`/app`) retains `AipifyBriefingCard` (Since Last Login) — distinct from per-page Companion Briefing.

**Future pages:** add context to `COMPANION_BRIEFING_ROUTE_MAP`, extend `_acb_context_summary` if needed, add `CompanionBriefingPageIntro` or banner to `page.tsx`. See `.cursor/rules/companion-briefing-design.mdc`.

## Privacy

Companion briefings summarize **verified module activity metadata** only. When live data is unavailable, RPCs return honest scaffolds — never fabricated counts or PII.
