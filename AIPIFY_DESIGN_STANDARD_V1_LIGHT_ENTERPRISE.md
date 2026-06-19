# AIPIFY Design Standard V1 — Light Enterprise Experience

**Aipify Group AS** · Bergen · *From Norway. For the world.*

**Status:** ACTIVE · **Version:** 1.0

Cross-reference: [ENTERPRISE_DESIGN_COMMUNICATION_STANDARD.md](./ENTERPRISE_DESIGN_COMMUNICATION_STANDARD.md) · [ABOS_BRAND_TERMINOLOGY_STANDARD.md](./ABOS_BRAND_TERMINOLOGY_STANDARD.md)

---

## Purpose

Lock the official visual direction for Aipify. Aipify is a **Business Operating System** — not a gaming platform, cyberpunk dashboard, or dark-mode-first application.

> *Unonight owns the night. Aipify owns the workday.*

Users spend entire workdays inside Aipify. The interface must reduce visual fatigue and feel welcoming, calm, modern, and professional.

---

## Default theme

**Light Enterprise Theme** — primary experience across:

- Customer APP
- Employee panels
- Platform Admin
- Growth Partner Portal
- Business Packs
- Customer portals
- Knowledge Center
- Companion interfaces

Dark theme may exist in the future but is **not** the primary design direction.

---

## Color system

| Role | Token | Value | Usage |
|------|-------|-------|--------|
| Canvas | `--aipify-canvas` | `#F7F6F3` | Page background — warm off-white |
| Surface | `--aipify-surface` | `#FFFFFF` | Cards, panels, modals |
| Surface muted | `--aipify-surface-muted` | `#F3F2EF` | Inputs, secondary areas |
| Border | `--aipify-border` | `#E7E5E4` | Dividers, card borders |
| Text primary | `--aipify-text-primary` | `#1E293B` | Headings, body |
| Text secondary | `--aipify-text-secondary` | `#64748B` | Supporting copy |
| Companion Purple | `--aipify-companion-purple` | `#7C3AED` | Brand, primary actions |
| Soft Blue-Purple | `--aipify-accent` | `#6366F1` | Links, charts, selected states |

**Do not** use pure `#FFFFFF` as the page background.

---

## Design language

Reference inspiration: Microsoft 365 · Stripe · Notion · Linear · Asana · Monday · Atlassian · Apple business experiences.

Visual goals: professional · premium · modern · elegant · clean · scalable · executive-friendly · accessible.

Hierarchy through **spacing, typography, layout, and structure** — not excessive color.

---

## Navigation

Professional · organized · structured · enterprise-ready.

- Active nav: solid Companion Purple (no heavy gradients)
- Avoid gaming, cyberpunk, neon, or hacker aesthetics

---

## Status system

Always combine **icon + text** — never color alone:

| Icon | Meaning |
|------|---------|
| ✅ | Completed |
| ❌ | Not allowed |
| ⚠️ | Needs attention |
| ℹ️ | Information |
| 🔒 | Restricted |
| 🛡️ | Verified |
| ⏳ | Waiting |

Code: `lib/design/status-system.ts` · `components/ui/aipify-status-badge.tsx`

---

## Explicitly avoid

- Black-first dashboards
- Gaming / cyberpunk / neon / hacker aesthetics
- Visual clutter, excessive gradients, animation overload
- Discord-style or developer-toy interfaces

---

## Explicitly want

- Companion Purple + soft blue-purple accents
- Warm off-white canvas + professional gray surfaces
- Enterprise appearance, premium SaaS feel, calm UX
- Executive readiness for boardroom and customer demos

---

## Implementation

| Area | Path |
|------|------|
| CSS tokens | `app/globals.css` |
| TypeScript tokens & classes | `lib/design/light-enterprise-theme.ts` |
| Status helpers | `lib/design/status-system.ts` |
| Shell (nav, topbar) | `components/dashboard/*` |
| ILM corpus | `aipify-core/knowledge/internal-language-model/light-enterprise-design-standard.txt` |
| Cursor rule | `.cursor/rules/light-enterprise-design-standard.mdc` |

---

## Decision filter

When in doubt:

1. Choose **clarity** over effects
2. Choose **professionalism** over trends
3. Choose **enterprise quality** over visual noise

---

## END OF STANDARD
