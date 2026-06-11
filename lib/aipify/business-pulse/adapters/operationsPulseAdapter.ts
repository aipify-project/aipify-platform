import { buildMetric, worstPulseStatus, type PulseAdapter, type PulseAdapterResult } from "./base";

export const operationsPulseAdapter: PulseAdapter = {
  area: "operations",
  collect(_tenantId, context) {
    const pendingApprovals = Number(context.pending_approvals ?? 0);
    const expectedApprovals = Number(context.expected_pending_approvals ?? 5);
    const openTasks = Number(context.open_tasks ?? 0);
    const expectedTasks = Number(context.expected_open_tasks ?? 12);

    const metrics = [
      buildMetric(
        "pending_approvals",
        pendingApprovals,
        expectedApprovals,
        "There are more pending approvals than usual, which may slow down operations.",
        "Review pending approvals and delegate where appropriate."
      ),
      buildMetric(
        "open_tasks",
        openTasks,
        expectedTasks,
        "Open tasks appear higher than usual.",
        "Prioritize tasks with the greatest operational impact."
      ),
    ];

    const worst = worstPulseStatus(metrics.map((m) => m.status));

    return {
      area: "operations",
      metrics,
      area_status: worst,
      summary:
        worst === "normal"
          ? "Operations are running within expected ranges."
          : "There are more pending approvals than usual, which may slow down operations.",
    } satisfies PulseAdapterResult;
  },
};
