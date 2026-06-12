# Customer Renewal & Expansion — FAQ (Phase 44)

## What is the Renewal & Expansion tab?

**Blueprint Phase 44** adds a **Renewal & Expansion** tab to the Sales Expert Operating System at `/app/sales-expert-engine`. It helps Sales Experts prepare for renewals, monitor aggregate customer health, and explore consultative expansion — metadata only, tenant-scoped.

## How is this different from Autonomous Execution Framework Phase 44?

**AEF Phase 44** at `/app/action-center` executes approved tenant business actions with safety checks. **Blueprint Phase 44** supports Sales Expert renewal awareness and consultative expansion coaching — completely different surfaces. Documented in `_crebp_distinction_note()`.

## How is this different from Revenue Intelligence (Phase 39)?

**Phase 39** at `/app/commercial` covers operational subscription revenue (MRR/ARR, renewals, expansion from commercial tables). **Phase 44** covers Sales Expert customer relationships in the partner portal — cross-link only, no duplication of commercial modules.

## What data powers the renewal dashboard?

`_crebp_renewal_summary()` derives from `organization_sales_expert_customers` plus optional `commercial_renewal_events` and `commercial_customer_health_scores` (Phase 93) when available — empty-safe. Customer org names and aggregate scores only — no email, chat, or financial PII.

## Are expansion recommendations mandatory?

**No.** Expansion opportunities are consultative scaffolds — team growth, Business Packs A.43, intelligence modules. Sales Experts always decide which conversations to have. Tone is **consultative_not_aggressive**.

## What are renewal playbooks?

Structured guidance for 30 days, 14 days, and renewal week — cross-links **Sales Coach Phase 45**. Structure not scripts; preparation not pressure.

## How does churn prevention work?

Early at-risk signals from customer status and aggregate metadata — support and understanding, **never blame**. Cross-links **Customer Success A.26** at `/app/customer-success-engine`.

## How does Self Love connect?

Renewal season can be emotionally demanding. Phase 44 cross-links **Self Love A.76** at `/app/self-love-engine` for clarity not anxiety. Renewal tab stores metadata only.

## Where is the implementation documented?

See [IMPLEMENTATION_BLUEPRINT_PHASE44_CUSTOMER_RENEWAL_EXPANSION.md](../../../../IMPLEMENTATION_BLUEPRINT_PHASE44_CUSTOMER_RENEWAL_EXPANSION.md) and migration `20260996000000_implementation_blueprint_phase44_customer_renewal_expansion.sql`.
