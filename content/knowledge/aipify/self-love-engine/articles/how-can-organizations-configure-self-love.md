# How can organizations configure Self Love?

**Category:** Self Love Engine · **Phase:** A.76

Organizations configure Self Love at `/app/self-love-engine`.

## Organization settings (owner/admin)

Requires `self_love.manage`:

- **Enabled** — master toggle for org Self Love features
- **Reminder frequency** — low, normal, or high
- **Quiet hours** — when reminders should respect rest
- **Reminder tone** — warm, balanced, or minimal
- **Dashboard insights** — show wellbeing summaries on the engine dashboard
- **Workspace settings** — JSON metadata for org-specific configuration

## User preferences (all roles)

Requires `self_love.preferences.manage`:

- Personal **tone** and **channels** (in-app, command center)
- **Pause suggestions** — enable or disable gentle pause prompts
- **Reminder preferences** — frequency caps per day

## Permissions

| Permission | Purpose |
|------------|---------|
| `self_love.view` | View dashboard and recommendations |
| `self_love.manage` | Configure organization settings |
| `self_love.preferences.manage` | Manage personal preferences |
| `self_love.export` | Export configuration summary |

Self Love is a principle — org settings control *how* reminders appear, not whether wellbeing matters.
