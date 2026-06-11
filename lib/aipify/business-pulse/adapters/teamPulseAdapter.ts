import { buildMetric, type PulseAdapter, type PulseAdapterResult } from "./base";

export const teamPulseAdapter: PulseAdapter = {
  area: "team",
  collect(_tenantId, context) {
    const workloadIndex = Number(context.team_workload_index ?? 50);
    const expectedWorkload = Number(context.expected_team_workload ?? 50);

    const metrics = [
      buildMetric(
        "team_workload_index",
        workloadIndex,
        expectedWorkload,
        "One team appears to have a higher workload than usual. Additional support may be helpful.",
        "Review aggregated workload distribution and consider rebalancing tasks."
      ),
    ];

    return {
      area: "team",
      metrics,
      area_status: metrics[0].status,
      summary:
        metrics[0].status === "normal"
          ? "Team workload appears balanced across departments."
          : "One team appears to have a higher workload than usual. Additional support may be helpful.",
    } satisfies PulseAdapterResult;
  },
};
