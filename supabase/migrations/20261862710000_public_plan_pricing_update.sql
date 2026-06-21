-- Forward migration: update published base plan prices for new checkout flows.
-- Does NOT modify existing subscription rows or Stripe/Klarna price objects.
-- Aligns public.plans.price_amount with lib/marketing/public-pricing.ts PUBLIC_PLAN_PRICES.
--
-- OPS NOTE: After applying, create new Stripe Price objects per environment and update
-- STRIPE_PRICE_ID_* env vars before routing live checkout to the new amounts.
-- No stripe_price_id column exists on public.plans — provider IDs remain environment-driven.

update public.plans
set price_amount = 799
where plan_key = 'starter';

update public.plans
set price_amount = 2500
where plan_key = 'growth';

update public.plans
set price_amount = 6999
where plan_key = 'business';

-- Enterprise remains custom (price_amount 0 / null semantics unchanged).
