# Subscription & Plan Management Engine — FAQ

## What does the subscription engine manage?

It manages tenant-aware subscriptions, plan-based module access, trials, upgrades, and downgrades with full auditability.

## How do plans affect module access?

Each plan maps to a set of modules in `plan_modules`. When your plan changes, module licensing syncs automatically through Core RPCs.

## What happens when a trial expires?

Expired trials move the subscription to `expired` status and administrators receive a notification. Upgrade to restore full access.

## Are downgrades safe?

Downgrades that would remove critical modules (Support AI, Integrations, Admin Assistant) require explicit confirmation before proceeding.

## Is billing integrated in this phase?

Billing readiness is scaffolded for Stripe, Paddle, and manual invoicing — no live payment processing is enabled yet. The License Center remains the operational billing view.
