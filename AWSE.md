# Adaptive Working Style Engine (AWSE) — Phase 46

Transparent personalization — how Aipify adapts to individual working preferences.

**Spec:** `aipify-core/modules/adaptive-working-style-engine/phase-46-adaptive-working-style-engine.txt`  
**Code:** `lib/adaptive-working-style-engine/`  
**Settings:** `/app/settings/working-style`  
**API:** `/api/working-style`, `/api/working-style/signals`

---

## Principle

> People work differently. Aipify should adapt responsibly. Humans remain in control.

Aipify adapts. Aipify does not manipulate.

---

## Package placement

| Plan | Capabilities |
|------|----------------|
| Starter / Growth | Manual preference selection only |
| Business Pro | User profiles, reminder prefs, detail levels, daily summary, optional adaptive learning |
| Enterprise | + Department templates, role defaults |

---

## Working profiles

`executive` · `operations` · `support` · `sales` · `focus` · `custom`

## Detail levels

`compact` · `standard` · `detailed`

## Reminder frequency

`minimal` · `balanced` · `proactive` · `highly_proactive`

---

## Database

- `aipify_user_working_preferences` — per-user settings
- `aipify_user_adaptation_signals` — opt-in learning signals
- `aipify_department_working_style_templates` — Enterprise department defaults

**RPCs:** `get_customer_working_style_center()`, `update_customer_working_preferences()`, `reset_customer_working_preferences()`, `record_awse_adaptation_signal()`, `upsert_awse_department_template()`

---

## Integration

- Chat: `detectAdaptiveStyleCue()` for *"just give me the highlights"* / *"stop reminding me"*
- ILM reminder frequencies align with AWSE `reminder_frequency`
- Module gate: `adaptive_working_style` in `lib/core/plans.ts` (business+)

---

## Restrictions

Never infer medical, political, religious, or other sensitive personal characteristics without explicit permission.
