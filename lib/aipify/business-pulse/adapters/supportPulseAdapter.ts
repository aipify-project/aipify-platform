import { buildMetric, worstPulseStatus, type PulseAdapter, type PulseAdapterResult } from "./base";

export const supportPulseAdapter: PulseAdapter = {
  area: "support",
  collect(_tenantId, context) {
    const openCases = Number(context.open_support_cases ?? 0);
    const expectedOpen = Number(context.expected_open_support_cases ?? 5);
    const responseHours = Number(context.avg_response_hours ?? 1.5);
    const expectedResponse = Number(context.expected_response_hours ?? 1.5);

    const metrics = [
      buildMetric(
        "open_support_cases",
        openCases,
        expectedOpen,
        "Support activity is higher than normal today, and response time has increased.",
        "Review unresolved cases and identify tickets requiring escalation."
      ),
      buildMetric(
        "avg_response_hours",
        responseHours,
        expectedResponse,
        "Response time appears higher than usual.",
        "Prioritize the support queue and consider escalation for urgent cases."
      ),
    ];

    const worst = worstPulseStatus(metrics.map((m) => m.status));

    return {
      area: "support",
      metrics,
      area_status: worst,
      summary:
        worst === "normal"
          ? "Support volume and response times are within expected ranges."
          : "Support activity is higher than normal today, and response time has increased.",
    } satisfies PulseAdapterResult;
  },
};
