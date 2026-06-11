import { buildMetric, worstPulseStatus, type PulseAdapter, type PulseAdapterResult } from "./base";

export const customerPulseAdapter: PulseAdapter = {
  area: "customer",
  collect(_tenantId, context) {
    const complaints = Number(context.customer_complaints ?? 0);
    const expectedComplaints = Number(context.expected_customer_complaints ?? 2);
    const repeatIssues = Number(context.repeat_issues ?? 0);
    const expectedRepeat = Number(context.expected_repeat_issues ?? 1);

    const metrics = [
      buildMetric(
        "customer_complaints",
        complaints,
        expectedComplaints,
        "Several customers have raised similar concerns today.",
        "Review recurring customer issues and prepare suggested responses."
      ),
      buildMetric(
        "repeat_issues",
        repeatIssues,
        expectedRepeat,
        "Repeated customer issues may indicate a pattern worth reviewing.",
        "Identify root causes for repeated support themes."
      ),
    ];

    const worst = worstPulseStatus(metrics.map((m) => m.status));

    return {
      area: "customer",
      metrics,
      area_status: worst,
      summary:
        worst === "normal"
          ? "Customer signals are within expected ranges."
          : "Several customers have raised similar concerns today.",
    } satisfies PulseAdapterResult;
  },
};
