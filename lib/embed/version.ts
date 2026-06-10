import {
  INSTALL_UPDATE_STATUS_API,
  INSTALL_VERSION_API,
} from "@/lib/update";

export type VersionReportPayload = {
  installation_token: string;
  current_version: string;
  update_result?: "success" | "failure";
  details?: Record<string, unknown>;
};

/** Layer 3 — report installed Aipify version to platform. */
export async function reportInstallationVersion(
  payload: VersionReportPayload
): Promise<Response> {
  return fetch(INSTALL_VERSION_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function reportUpdateStatus(input: {
  installation_token: string;
  success: boolean;
  current_version?: string;
  details?: Record<string, unknown>;
}): Promise<Response> {
  return fetch(INSTALL_UPDATE_STATUS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}
