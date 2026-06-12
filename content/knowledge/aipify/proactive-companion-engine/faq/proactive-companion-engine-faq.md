# Proactive Companion Engine — FAQ

## What is the Proactive Companion Engine?

The Proactive Companion Engine (Phase A.79) is an organizational ABOS **Assistance** capability that delivers timely, relevant guidance before things become urgent. It manages assistance categories, org defaults, user preferences, and a metadata-only nudge lifecycle (pending, dismissed, snoozed, acted).

## How is this different from Companion Presence (A.67)?

**Companion Presence (A.67)** is the floating orb with heartbeat and online states — system presence UI at `/app/settings/companion-presence`. **Proactive Companion (A.79)** is the organizational engine that generates and manages proactive assistance categories and nudges. The orb may reflect attention state; it does not replace nudge governance.

## How is this different from ILM proactive guidance?

**ILM proactive guidance** (`lib/internal-language-model/proactive-guidance.ts`) defines assistant **language patterns** (observe → inform → recommend). **Proactive Companion** is the organizational engine for categories, preferences, and nudge storage. Nudge copy should align with ILM corpus — detection logic is not duplicated.

## What assistance categories are supported?

Five categories: **Operational**, **Support**, **Knowledge**, **Executive**, and **Team awareness**. Team awareness provides coordination cues — never colleague surveillance or monitoring.

## What user preferences can I configure?

Frequency (low, normal, high), channels (in_app, command_center, email_digest metadata routing), communication style (supportive, balanced, minimal), enabled categories, and quiet hours with timezone.

## Can I dismiss or snooze nudges?

Yes. Every nudge supports **dismiss** and **snooze** via `proactive_companion.nudges.dismiss`. Humans always retain control — Aipify suggests; you decide.

## What are the boundaries?

No anxiety-inducing urgency language, no notification flooding (daily caps and quiet hours), no surveillance (metadata only), and Self Love (A.76 planned) may reduce frequency when fatigue signals appear.

## What integrations does Proactive Companion use?

Command Center (A.26) for actionable delivery, Companion Presence (A.67) for presence context, Notification Engine (A.12) for channel distribution, and Quality Guardian (A.13) for quality-informed knowledge/operational nudges.

## Who can manage organization settings?

`proactive_companion.manage` is required for org-level settings (enabled categories, default frequency, max nudges per day). Owners and administrators have this by default.
