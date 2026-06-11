import type { QualityScanResult } from "./types";

export type MobileCheckInput = {
  page_url: string;
  viewport: string;
  issue: string;
  component?: string;
  severity?: QualityScanResult["severity"];
};

export function evaluateMobileIssue(input: MobileCheckInput): QualityScanResult {
  return {
    incident_key: `quality.mobile.${input.page_url}.${input.issue}`.replace(/[^a-z0-9]/gi, "_").slice(0, 80),
    title: `Mobile issue: ${input.issue}`,
    passed: false,
    severity: input.severity ?? "medium",
    scanner_type: "mobile_monitor",
    category: "mobile",
    incident_type: "mobile_layout_issue",
    page_url: input.page_url,
    expected_behavior: "Layout should be usable on mobile without overlap, horizontal scroll, or hidden CTAs.",
    observed_behavior: input.issue,
    impact: "Mobile users may struggle to complete key actions.",
    suggested_fix: "Review responsive CSS, tap targets, and sticky elements on small viewports.",
    evidence: { viewport: input.viewport, component: input.component },
  };
}
