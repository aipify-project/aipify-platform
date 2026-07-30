import type { KompisOperatorSeverityTone } from "@/lib/kompis-operator/severity";
import type {
  WebsiteStagingEnvironmentStatus,
  WebsiteStagingFixtureStatus,
  WebsiteStagingRunStatus,
} from "./types";

export function websiteStagingEnvironmentStatusTone(
  status: WebsiteStagingEnvironmentStatus | string,
): KompisOperatorSeverityTone {
  switch (status) {
    case "active":
      return "success";
    case "attention":
      return "warning";
    case "archived":
      return "muted";
    default:
      return "info";
  }
}

export function websiteStagingFixtureStatusTone(
  status: WebsiteStagingFixtureStatus | string,
): KompisOperatorSeverityTone {
  return status === "archived" ? "muted" : "success";
}

export function websiteStagingRunStatusTone(status: WebsiteStagingRunStatus | string): KompisOperatorSeverityTone {
  switch (status) {
    case "passed":
      return "success";
    case "running":
    case "pending":
    case "partial":
      return "warning";
    case "failed":
    case "blocked":
      return "danger";
    default:
      return "muted";
  }
}
