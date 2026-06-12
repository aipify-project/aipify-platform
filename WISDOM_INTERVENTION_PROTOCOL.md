# Wisdom Intervention Protocol (ABOS)

**Feature owner:** Customer App · **Phase A.94**

Pre-send reflection prompts, sleep-on-it nudges, and emotional charge detection scaffold — perspective, not control.

**Companion doc:** [Pause & Reflection Protocol](./PAUSE_REFLECTION_PROTOCOL.md) — integrated into this protocol; one dashboard, one route.

## Philosophy

Emotions influence communication — a pause can change outcomes; wisdom lives between impulse and action. Perspective, not control; human autonomy preserved.

## Mission

Gently encourage reflection before emotionally charged actions — pause, reflect, decisions less likely to regret.

## ABOS principle

Wisdom = thoughtful difficult conversations; sometimes waiting until tomorrow.

## Vision

Communicate reflecting values, not temporary frustration — *glad I did not send that email last night*.

## When to intervene

- Angry or heated email
- Excessive caps
- Aggressive wording
- Late-night decisions
- Emotionally charged response
- High-risk communication
- Repeated send attempts (Pause & Reflection)

## Boundaries

**May:** recommend reflection, suggest save draft, offer gentle perspective, record metadata-only outcomes.

**May not:** prevent sending, override autonomy, store raw message content, force delays, imply Aipify controls outcomes.

## Route

`/app/wisdom-intervention-protocol` — nav id `wisdomInterventionProtocol`

Legacy alias: `/app/pause-reflection-protocol` → redirects to wisdom intervention surface.

## Module

`wisdom_intervention_protocol`

## Tables

- `organization_wisdom_intervention_settings` — enabled, sleep_on_it, late_night_nudge, caps detection, user autonomy note
- `organization_wisdom_intervention_signals` — signal_type, summary, suggested_intervention, user_action — metadata only
- `organization_wisdom_intervention_prompts` — prompt_key, message_template, sleep_on_it flag

## Permissions

`wisdom_intervention.view` · `wisdom_intervention.manage` · `wisdom_intervention.export`

## RPCs

`get_wisdom_intervention_protocol_card` · `get_wisdom_intervention_protocol_dashboard` · `update_wisdom_intervention_settings` · `record_wisdom_intervention_outcome` · `suggest_wisdom_intervention` · `export_wisdom_intervention_report`

### Dashboard fields (Pause & Reflection integration)

- `pause_reflection_philosophy`
- `human_moment_note`
- `pause_communication_examples`
- `self_love_rose_phrases`
- `pause_abos_principle`
- `combined_protocol_note`

## Distinctions

- **NOT** Wisdom Engine A.93 — experience synthesis over time
- **NOT** Human Oversight A.40 — approval tiers for AI actions
- **NOT** Trust & Action Engine — sensitive policy execution
- **NOT** Inclusion & Humanity A.83 — organizational de-escalation
- **NOT** Attention Guardian TAG — focus mode

## Cross-links

- [PAUSE_REFLECTION_PROTOCOL.md](./PAUSE_REFLECTION_PROTOCOL.md)
- Presence & Comfort A.90 — emotional reassurance after difficulty
- Purpose & Values A.80 — values-aligned communication

## Metadata only

No raw email, chat, or message body storage.
