# Platform Install Connectors — Phase 100

## Vision

**Everybody should be able to install Aipify with Aipify's help.**

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260629000000_platform_install_connectors_phase100.sql` |
| Lib | `lib/aipify/platform-install/` |
| Stripe client | `lib/billing/stripe-client.ts` |
| API | `/api/aipify/platform-install/*`, `/api/install/*`, `/api/billing/*`, `/api/webhooks/stripe` |
| UI | `/app/platform-install` — Install wizard hub |
| KC FAQ | `content/knowledge/aipify/platform-installation/faq/platform-installation-faq.md` |

## Supported platforms

1. WordPress — plugin, manual upload, JavaScript embed, API key
2. Shopify — app installation, OAuth, webhooks
3. WooCommerce — WordPress plugin + REST API
4. Other Platforms — JavaScript embed, API keys, webhooks, developer docs

## Install wizard (12 steps)

Welcome → Account → Plan → Payment → Trial → Platform → Connect → Permissions → Install → Health check → Activate → Success

## Trial model

- 14-day free trial after payment method registration
- No charge at registration
- Subscription starts automatically after trial unless cancelled
- Trial reminders on days 1, 7, 11, 13

## Database tables

- `platform_install_settings`, `platform_connectors`, `installation_sessions`
- `connector_installations`, `installation_steps`, `installation_health_checks`
- `platform_permissions`, `connector_api_keys`, `oauth_connections`
- `connector_webhook_endpoints`, `connector_webhook_events`, `connector_logs`
- `installation_errors`, `install_assistant_messages`
- `install_subscription_trials`, `trial_events`, `trial_reminders`
- `cancellation_events`, `billing_portal_sessions`
- `platform_install_briefings`, `platform_install_audit_log`

## RPCs

- `get_platform_install_dashboard()` — full install wizard dashboard
- `get_platform_install_card()` — summary card
- `generate_platform_install_briefing()` — install progress briefing
- `start_installation_session()` — begin wizard
- `select_install_platform(text, text)` — choose platform
- `connect_install_platform(uuid, jsonb)` — connect store/domain
- `verify_install_connection(uuid)` — verify permissions
- `run_install_health_check(uuid)` — health check and go live
- `register_trial_payment_method(text)` — activate trial after payment
- `cancel_install_trial(text)` — cancel before billing
- `get_install_status()` — current install status
- `get_billing_trial_status()` — billing/trial status

## API endpoints

- `POST /api/install/start`
- `POST /api/install/select-platform`
- `POST /api/install/connect`
- `POST /api/install/verify` (supports both token verify and connector verify)
- `POST /api/install/health-check`
- `GET /api/install/status`
- `POST /api/billing/create-checkout-session`
- `POST /api/billing/create-portal-session`
- `GET /api/billing/status`
- `POST /api/webhooks/stripe`

## Stripe integration

Uses Stripe Checkout with `trial_period_days: 14` when `STRIPE_SECRET_KEY` and price IDs are configured. Falls back to demo mode for local development.

## Principle

Installation should feel simple. Payment should feel safe. The trial should feel honest. Aipify creates trust before the first charge.
