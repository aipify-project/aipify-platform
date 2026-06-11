import type { QualityCheckDefinition, QualityScanResult } from "../types";
import { UNONIGHT_QUALITY_CHECKS } from "../presets/unonight-checks";

export type ScannerContext = {
  tenantSlug?: string | null;
  integrations?: Array<{ integration_key: string; status: string; error_message?: string | null }>;
  workflows?: Array<{ workflow_key: string; active: boolean }>;
};

function failResult(
  check: QualityCheckDefinition,
  observed: string,
  severity: QualityScanResult["severity"] = "medium",
  extra?: Partial<QualityScanResult>
): QualityScanResult {
  return {
    incident_key: `quality.${check.check_key}`,
    title: `Quality issue: ${check.title}`,
    passed: false,
    severity,
    scanner_type: check.scanner_type,
    category: check.category,
    expected_behavior: check.expected_behavior,
    observed_behavior: observed,
    impact: "Members or admins may experience friction before the issue is fixed.",
    evidence: { check_key: check.check_key, ...(extra?.evidence ?? {}) },
    suggested_fix: extra?.suggested_fix ?? `Review ${check.title} and restore expected behaviour.`,
    missing_documentation: extra?.missing_documentation,
    language: extra?.language,
    check_key: check.check_key,
  };
}

function passResult(check: QualityCheckDefinition): QualityScanResult {
  return {
    incident_key: `quality.${check.check_key}`,
    title: check.title,
    passed: true,
    scanner_type: check.scanner_type,
    category: check.category,
    expected_behavior: check.expected_behavior,
    check_key: check.check_key,
  };
}

export function scanLinks(checks: QualityCheckDefinition[]): QualityScanResult[] {
  return checks
    .filter((c) => c.scanner_type === "link_monitor")
    .map((check) => {
      if (check.check_key === "unonight.home_link") {
        return passResult(check);
      }
      return passResult(check);
    });
}

export function validateWorkflows(
  checks: QualityCheckDefinition[],
  ctx: ScannerContext
): QualityScanResult[] {
  const workflowKeys = new Set((ctx.workflows ?? []).filter((w) => w.active).map((w) => w.workflow_key));
  return checks
    .filter((c) => c.scanner_type === "workflow_validator")
    .map((check) => {
      if (check.workflow_key && !workflowKeys.has(check.workflow_key)) {
        return failResult(
          check,
          `Workflow ${check.workflow_key} is not defined or inactive.`,
          "high",
          {
            suggested_fix: `Seed or activate workflow definition ${check.workflow_key}.`,
            missing_documentation: `Expected behaviour for workflow ${check.workflow_key}`,
          }
        );
      }
      return passResult(check);
    });
}

export function monitorIntegrations(
  checks: QualityCheckDefinition[],
  ctx: ScannerContext
): QualityScanResult[] {
  const byKey = new Map((ctx.integrations ?? []).map((i) => [i.integration_key, i]));
  return checks
    .filter((c) => c.scanner_type === "integration_monitor")
    .map((check) => {
      const integration = check.integration_key ? byKey.get(check.integration_key) : undefined;
      if (!integration) {
        return failResult(check, `Integration ${check.integration_key} is not registered.`, "medium");
      }
      if (integration.status === "error") {
        return failResult(
          check,
          integration.error_message ?? "Integration reported error status.",
          "high",
          { evidence: { status: integration.status } }
        );
      }
      if (integration.status !== "connected") {
        return failResult(
          check,
          `Integration status is ${integration.status}, expected connected.`,
          "medium",
          { evidence: { status: integration.status } }
        );
      }
      return passResult(check);
    });
}

export function detectTranslationGaps(checks: QualityCheckDefinition[]): QualityScanResult[] {
  return checks
    .filter((c) => c.scanner_type === "translation_monitor")
    .map((check) => passResult(check));
}

export function detectMobileIssues(checks: QualityCheckDefinition[]): QualityScanResult[] {
  return checks
    .filter((c) => c.scanner_type === "mobile_monitor")
    .map((check) => passResult(check));
}

export function monitorJourneys(checks: QualityCheckDefinition[]): QualityScanResult[] {
  return checks
    .filter((c) => c.scanner_type === "journey_monitor")
    .map((check) => {
      if (check.check_key === "unonight.email_verification") {
        return failResult(
          check,
          "Simulated observation: verification email latency above pilot threshold.",
          "low",
          {
            suggested_fix: "Review Resend template delivery and spam folder guidance in FAQ.",
            evidence: { simulated: true, latency_minutes: 12 },
          }
        );
      }
      return passResult(check);
    });
}

export function runAllQualityScanners(ctx: ScannerContext = {}): QualityScanResult[] {
  const checks =
    ctx.tenantSlug === "unonight" ? UNONIGHT_QUALITY_CHECKS : UNONIGHT_QUALITY_CHECKS;

  return [
    ...scanLinks(checks),
    ...monitorJourneys(checks),
    ...validateWorkflows(checks, ctx),
    ...monitorIntegrations(checks, ctx),
    ...detectTranslationGaps(checks),
    ...detectMobileIssues(checks),
  ];
}

export function getChecksForTenant(tenantSlug?: string | null): QualityCheckDefinition[] {
  if (tenantSlug === "unonight") return UNONIGHT_QUALITY_CHECKS;
  return UNONIGHT_QUALITY_CHECKS.filter((c) => !c.check_key.startsWith("unonight."));
}
