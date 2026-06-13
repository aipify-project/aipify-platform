# Aipify Elder Care Companion — Future Module

**Status:** Strategically approved · **Planted for future development**  
**Do not implement** until Companion Core, Life Events, Memory, Presence, Family Companion, and Action Framework foundations are established.

---

## Objective

Enable Aipify to responsibly support elderly individuals and their families by helping coordinate reminders, appointments, communication, routines, and practical life tasks while preserving dignity, independence, and human connection.

## Core principle

**The goal is not to replace family members or caregivers.**

The goal is to help people remain independent for as long as possible while strengthening support systems around them.

## Positioning

Aipify Elder Care Companion is a **Companion Module** designed to support aging individuals and the people who care about them.

## Aipify's role

Aipify should:

- Help maintain routines
- Encourage independence
- Coordinate practical activities
- Strengthen family communication
- Support memory through reminders
- Reduce caregiver stress

Aipify should never:

- Replace healthcare professionals
- Make medical decisions
- Override family authority
- Create fear or dependency
- Diagnose health conditions

## Support categories

### Daily life support

- Medication reminders (scheduling only — not medical advice)
- Appointment reminders
- Hydration reminders
- Meal reminders
- Shopping reminders
- Household task reminders

### Family coordination

- Family check-ins
- Visit planning
- Shared calendars
- Important event reminders
- Care coordination summaries

### Practical assistance

- Taxi coordination
- Transportation reminders
- Printing important documents
- Preparing appointment checklists
- Organizing emergency contacts

### Social wellbeing

- Encourage family contact
- Celebrate milestones
- Remember birthdays
- Suggest social engagement opportunities
- Support hobbies and interests

## Elder dashboard (when implemented)

Display:

- Upcoming appointments
- Daily reminders
- Family updates
- Important contacts
- Companion recommendations
- Routine summaries

## Family access principle

Families must be able to define:

- Who may assist
- Which reminders are shared
- Notification preferences
- Emergency contact visibility
- Permission levels

## Reminder principle

Examples:

- "It's time for your appointment preparation checklist."
- "Your granddaughter's birthday is tomorrow."
- "You usually call your son on Sundays."

**Constraint:** Reminders should remain respectful and supportive.

## Emergency support preparation

Support:

- Emergency contact lists
- Important document organization
- Family notification preferences
- Medical information storage references

**Constraint:** Aipify coordinates preparedness. Emergency response remains human-led.

## Aipify insights

Examples:

- "You have successfully maintained your routines this week."
- "You may wish to prepare transportation for tomorrow's appointment."
- "Family coordination appears well organized."

**Constraint:** Insights should promote confidence — never create anxiety.

## User control principle

Users and families must control:

- Reminder frequency
- Shared information
- Companion involvement
- Notification settings
- Permission structures

## Aipify actions

Examples:

- Schedule reminders
- Coordinate transportation
- Print appointment summaries
- Prepare family updates
- Organize calendars
- Generate preparation checklists

**Constraint:** Actions require appropriate approvals.

## Privacy requirements

Aipify must:

- Preserve dignity
- Respect autonomy
- Support consent-based sharing
- Provide transparency
- Allow complete data control

## Success metrics

- Reminder usefulness ratings
- Family coordination satisfaction
- Routine adherence support effectiveness
- Companion trust indicators
- Caregiver stress reduction feedback
- Elder satisfaction ratings

## Design principles

- Respectful
- Dignity-first
- Human-centered
- Family-supportive
- Companion-driven
- Simple and approachable

## Vision

Growing older should not mean losing independence.

Aipify Elder Care Companion exists to help people maintain dignity, strengthen family connections, and navigate later stages of life with greater confidence and support.

## Implementation prerequisites

Before building:

1. **Companion Core** — identity, presence, and companion module framework
2. **Life Events** — proactive care patterns (Phase 290)
3. **Memory foundations** — PAME and LifeOS metadata patterns
4. **Presence** — notification and continuity patterns (Phase 292)
5. **Family Companion** — family coordination patterns (planted — must ship first)
6. **Action Framework** — Trust & Action, approval profiles, financial guardrails

## Planned layer placement (when ready)

| Surface | Owner |
|---------|-------|
| Elder care dashboard UI | **Customer App** (`/app/companion/elder-care` — provisional) |
| Coordination logic | **Aipify Core** (Supabase RPCs — metadata only) |
| Family cross-link | **Family Companion** — shared coordination patterns |
| Calendar cross-link | **Context Engine** — read-only |
| Medical boundary | **Never** store clinical records or provide medical advice |

## Related documents

- [IMPLEMENTATION_BLUEPRINT_FUTURE_AIPIFY_ELDER_CARE_COMPANION.md](./IMPLEMENTATION_BLUEPRINT_FUTURE_AIPIFY_ELDER_CARE_COMPANION.md)
- [AIPIFY_FAMILY_COMPANION_FUTURE_MODULE.md](./AIPIFY_FAMILY_COMPANION_FUTURE_MODULE.md) — prerequisite companion module
- [AIPIFY_WELLNESS_COMPANION_FUTURE_MODULE.md](./AIPIFY_WELLNESS_COMPANION_FUTURE_MODULE.md) — distinct; wellness is personal wellbeing, elder care is aging support
- [RELATIONSHIP_SOCIAL_INTELLIGENCE.md](./RELATIONSHIP_SOCIAL_INTELLIGENCE.md) — family connection cross-link
- [TRUST_ARCHITECTURE.md](./TRUST_ARCHITECTURE.md)

**Not medical care. Not emergency response. Build when the ecosystem is ready.**
