# AIPIFY – PHASE 460
## TITLE: Book a Demo & Discovery Center
## PURPOSE
Premium enterprise demo booking at `/book-demo` — consultative discovery, not a lead form.

## OBJECTIVES
- Hero, what to expect, who should book, demo form, advisor card
- Enterprise readiness, deployment models, FAQ, Companion intro
- Post-submission: lead + opportunity + activity log + discovery_scheduled pipeline
- Global Book Demo CTA in header and footer

## REQUIREMENTS
- Route: `/book-demo`
- API: `GET/POST /api/marketing/book-demo`
- RPC: `submit_book_demo_request`, `get_book_demo_discovery_center`
- Tables: `marketing_demo_leads`, `marketing_demo_opportunities`, `marketing_demo_activity_log`, `marketing_demo_advisors`
- i18n: `marketing.bookDemoPage` in en/no/sv/da

**Feature owner: PUBLIC MARKETING**

END OF PHASE.
