# Platform Admin live status bar — owner browser QA (short)

Use a **signed-in Platform Admin** session (do not reset/guess credentials).

1. Open `/platform` — confirm compact status sits **between search and organization selector**.
2. Navigate to three other routes (e.g. `/platform/customers`, `/platform/billing`, `/platform/operations/platform-health`) — status remains; no duplicate bars; search + org selector still present.
3. Confirm seven indicators: Console OK · APP+ · Sellers+ · APP online · Sellers online · Signed in · Visitors.
4. Real registry zeros show `0`; unmeasured online/visitors show `—` (not fake zeros).
5. Hover a metric — tooltip shows last-checked context / source note; Console OK hint says limited console check.
6. Narrow the viewport — expand/collapse status without horizontal overflow; search and org selector remain usable.
7. Leave the tab hidden ~2 minutes, return — status refreshes; if delayed, “Update delayed” may appear (stale after ~90s without success).
8. Optional: signed-out / APP / seller session must **not** receive `/api/platform-portal/traffic-status` (401/403).

**E2E without Admin session:** report BLOCKED — do not invent credentials.
