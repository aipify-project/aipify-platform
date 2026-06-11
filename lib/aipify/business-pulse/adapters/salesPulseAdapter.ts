import { buildMetric, worstPulseStatus, type PulseAdapter, type PulseAdapterResult } from "./base";

export const salesPulseAdapter: PulseAdapter = {
  area: "sales",
  collect(_tenantId, context) {
    const dailySales = Number(context.daily_sales ?? 0);
    const expectedSales = Number(context.expected_daily_sales ?? 10);
    const followUps = Number(context.pending_follow_ups ?? 0);
    const expectedFollowUps = Number(context.expected_pending_follow_ups ?? 3);

    const metrics = [
      buildMetric(
        "daily_sales",
        dailySales,
        expectedSales,
        "Sales activity has been lower than expected for the last three days.",
        "Review leads requiring follow-up and prioritize hot opportunities."
      ),
      buildMetric(
        "pending_follow_ups",
        followUps,
        expectedFollowUps,
        "Several follow-up opportunities may need attention.",
        "Prepare timely outreach for leads awaiting contact."
      ),
    ];

    const worst = worstPulseStatus(metrics.map((m) => m.status));

    return {
      area: "sales",
      metrics,
      area_status: worst,
      summary:
        worst === "normal"
          ? "Sales activity is within expected ranges."
          : "Sales activity has been lower than expected recently.",
    } satisfies PulseAdapterResult;
  },
};
