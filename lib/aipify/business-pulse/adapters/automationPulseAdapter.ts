import { buildMetric, worstPulseStatus, type PulseAdapter, type PulseAdapterResult } from "./base";

export const automationPulseAdapter: PulseAdapter = {
  area: "automation",
  collect(_tenantId, context) {
    const waitingApproval = Number(context.automation_waiting_approval ?? 0);
    const expectedWaiting = Number(context.expected_automation_waiting ?? 2);
    const failed = Number(context.automation_failed ?? 0);
    const expectedFailed = Number(context.expected_automation_failed ?? 1);

    const metrics = [
      buildMetric(
        "automation_waiting_approval",
        waitingApproval,
        expectedWaiting,
        "Several automation actions are waiting for approval.",
        "Review pending automation actions in the Action Center."
      ),
      buildMetric(
        "automation_failed",
        failed,
        expectedFailed,
        "More failed automations than usual may need review.",
        "Inspect failed automation runs and adjust rules if needed."
      ),
    ];

    const worst = worstPulseStatus(metrics.map((m) => m.status));

    return {
      area: "automation",
      metrics,
      area_status: worst,
      summary:
        worst === "normal"
          ? "Automation is performing within expected ranges."
          : "Several automation actions are waiting for approval.",
    } satisfies PulseAdapterResult;
  },
};
