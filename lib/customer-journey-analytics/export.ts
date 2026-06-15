import type { CustomerJourneyAnalytics } from "./types";

function escapeCsv(value: string | number): string {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function buildCustomerJourneyAnalyticsCsv(center: CustomerJourneyAnalytics): string {
  const lines: string[] = [];

  lines.push("Customer Journey Analytics Export");
  lines.push("");
  lines.push("Overview");
  lines.push(`New Registrations (30d),${center.overview.new_registrations}`);
  lines.push(`Onboarding Completion Rate,${center.overview.onboarding_completion_rate}%`);
  lines.push(`Trial Conversion Rate,${center.overview.trial_conversion_rate}%`);
  lines.push(`Time to First Value (days),${center.overview.time_to_first_value_days}`);
  lines.push(`Expansion Rate,${center.overview.expansion_rate}%`);
  lines.push(`Drop-Off Rate,${center.overview.drop_off_rate}%`);
  lines.push("");

  lines.push("Funnel");
  lines.push("From Stage,To Stage,Entered,Converted,Conversion Rate");
  for (const step of center.funnel) {
    lines.push(
      [step.from_stage, step.to_stage, step.entered, step.converted, `${step.conversion_rate}%`]
        .map(escapeCsv)
        .join(",")
    );
  }
  lines.push("");

  lines.push("Customer Journeys");
  lines.push("Company,Stage,Trend,Last Activity,Plan,Country,Milestones");
  for (const row of center.journeys) {
    lines.push(
      [
        row.company,
        row.current_stage,
        row.trend,
        row.last_activity ?? "",
        row.subscription_plan,
        row.country,
        row.milestones_completed,
      ]
        .map(escapeCsv)
        .join(",")
    );
  }
  lines.push("");

  lines.push("Drop-Offs");
  lines.push("Customer,Type,Stage,Message,Date");
  for (const row of center.drop_offs) {
    lines.push(
      [row.customer, row.drop_off_type, row.stage, row.message, row.created_at]
        .map(escapeCsv)
        .join(",")
    );
  }

  return lines.join("\n");
}

export function buildCustomerJourneyAnalyticsPdfText(center: CustomerJourneyAnalytics): string {
  const sections = [
    "AIPIFY CUSTOMER JOURNEY ANALYTICS",
    "=================================",
    "",
    center.principle,
    "",
    "OVERVIEW",
    `New Registrations (30d): ${center.overview.new_registrations}`,
    `Onboarding Completion Rate: ${center.overview.onboarding_completion_rate}%`,
    `Trial Conversion Rate: ${center.overview.trial_conversion_rate}%`,
    `Time to First Value: ${center.overview.time_to_first_value_days} days`,
    `Expansion Rate: ${center.overview.expansion_rate}%`,
    `Drop-Off Rate: ${center.overview.drop_off_rate}%`,
    "",
    "FUNNEL CONVERSION",
    ...center.funnel.map(
      (f) =>
        `${f.from_stage} → ${f.to_stage}: ${f.conversion_rate}% (${f.converted}/${f.entered})`
    ),
    "",
    "COMMON PATHS",
    ...center.common_paths.map(
      (p) =>
        `${p.path_label}: ${p.conversion_rate}% · ${p.customer_count} customers${
          p.abandonment_point ? ` · abandonment at ${p.abandonment_point}` : ""
        }`
    ),
    "",
    center.privacy_note,
  ];

  return sections.join("\n");
}
