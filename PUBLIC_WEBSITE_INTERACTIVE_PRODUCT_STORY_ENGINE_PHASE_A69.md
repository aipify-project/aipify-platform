# Public Website & Interactive Product Story Engine — Phase A.69

**Feature owner:** Customer App (public marketing surface)

Interactive public marketing site and product story — install-first positioning as an Aipify Business Operating System (ABOS), not a chatbot.

## Extends

- Existing landing scaffold (`app/page.tsx` → `app/(marketing)/`)
- Presence orb animations (`app/globals.css` — A.67 scaffold)
- Trust Architecture — no employee surveillance messaging
- Unonight pilot (A.15) — operational validation story

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Enhanced home — hero, demos, trust, modules, pilot, outputs, oversight |
| `/product` | Product story + animated support demo |
| `/modules` | Module showcase (10 cards) |
| `/enterprise` | IT trust points |
| `/security` | Security, privacy, human oversight |
| `/early-access` | Lead capture form |
| `/pilot` | Unonight pilot (operational focus) |
| `/knowledge` | Knowledge intro + FAQ preview |
| `/contact` | Contact information |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

## Code locations

| Area | Path |
|------|------|
| Routes | `app/(marketing)/` |
| Components | `components/marketing/` |
| i18n | `locales/{en,no,sv,da}/marketing.json` |
| Analytics scaffold | `lib/marketing/analytics.ts` |
| Early access API | `app/api/marketing/early-access/route.ts` |
| Migration | `20260911100000_public_website_early_access_phase_a69.sql` |
| KC FAQ | `content/knowledge/aipify/public-website/faq/public-website-faq.md` |

## Key components

- `HeroSection` — headline, CTAs, stats
- `AnimatedProductDemo` — 9-step support flow (lazy-loaded)
- `CompanionOrbDemo` — presence states: online, working, attention, critical, disconnected, quiet
- `EnterpriseTrustSection` — multi-tenant, RBAC, audit, SSO, no surveillance
- `HowAipifyWorksSection` — 5 install-first steps
- `ModuleShowcase` — 10 module cards with hover animation
- `PilotStorySection` — Unonight operational validation
- `OutputEngineShowcase` — deliverables list
- `HumanOversightSection` — Manual → Trusted automation ladder
- `EarlyAccessForm` — POST `/api/marketing/early-access`

## Privacy & messaging

- **Not a chatbot** — Aipify Business Operating System (ABOS)
- **No employee monitoring** — prominent in hero, footer, security, FAQ
- `prefers-reduced-motion` respected on animated demos

## Tables

`marketing_early_access_leads` — tenant-agnostic public leads (name, company, email, company_size, industry, interest_area, message, created_at)

RPC: `submit_marketing_early_access_lead()` — public insert via security definer; API falls back to server log if unavailable.
