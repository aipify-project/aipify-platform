import type { InstallPlatformOption } from "./experience";

export type InstallEscalationPayload = {
  platform_type: InstallPlatformOption | string;
  domain?: string;
  installation_status?: string;
  installation_id?: string;
  error_summary: string;
};

export const ESCALATION_FORBIDDEN_FIELDS = [
  "email_content",
  "chat_content",
  "order_details",
  "payment_details",
  "customer_names",
] as const;

export function isValidEscalationPayload(
  payload: Record<string, unknown>
): payload is InstallEscalationPayload {
  return (
    typeof payload.error_summary === "string" &&
    payload.error_summary.length > 0 &&
    typeof payload.platform_type === "string"
  );
}
