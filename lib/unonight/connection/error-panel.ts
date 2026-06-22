import {
  getUnonightFailureErrorPanelKey,
  getUnonightFailureMessageKey,
} from "./failures";
import type { UnonightConnectionFailureCode } from "./types";
import { normalizeUnonightFailureCode } from "./types";

export type UnonightConnectionErrorPanelModel = {
  errorCode: UnonightConnectionFailureCode;
  titleKey: string;
  bodyKey: string;
  messageKey: string;
};

export function buildUnonightConnectionErrorPanelModel(
  errorCode: string | null | undefined
): UnonightConnectionErrorPanelModel {
  const normalized = normalizeUnonightFailureCode(
    (errorCode as UnonightConnectionFailureCode) ?? "unsupported_response"
  );
  return {
    errorCode: normalized,
    titleKey: getUnonightFailureErrorPanelKey(normalized, "title"),
    bodyKey: getUnonightFailureErrorPanelKey(normalized, "body"),
    messageKey: getUnonightFailureMessageKey(normalized),
  };
}

export async function parseUnonightTestErrorFromResponse(
  response: Response
): Promise<UnonightConnectionErrorPanelModel> {
  let payload: Record<string, unknown> = {};
  try {
    payload = (await response.json()) as Record<string, unknown>;
  } catch {
    payload = {};
  }

  const errorCode = String(
    payload.error_code ?? payload.code ?? payload.error ?? "unsupported_response"
  );

  return buildUnonightConnectionErrorPanelModel(errorCode);
}

export type UnonightConnectionErrorPanelLabels = {
  title: string;
  body: string;
  retry: string;
  updateKey: string;
  openUnonightAdmin: string;
  backToIntegrations: string;
  openUnonightAdminHref: string;
  backToIntegrationsHref: string;
};

export function buildUnonightConnectionErrorPanelLabels(
  model: UnonightConnectionErrorPanelModel,
  t: (key: string) => string,
  options?: { openUnonightAdminHref?: string; backToIntegrationsHref?: string }
): UnonightConnectionErrorPanelLabels {
  const prefix = "customerApp.portalStructure.integrations.unonightConnection.errorPanels";
  return {
    title: t(model.titleKey),
    body: t(model.bodyKey),
    retry: t(`${prefix}.actions.retry`),
    updateKey: t(`${prefix}.actions.updateKey`),
    openUnonightAdmin: t(`${prefix}.actions.openUnonightAdmin`),
    backToIntegrations: t(`${prefix}.actions.backToIntegrations`),
    openUnonightAdminHref: options?.openUnonightAdminHref ?? t(`${prefix}.openUnonightAdminHref`),
    backToIntegrationsHref: options?.backToIntegrationsHref ?? "/app/platform/integrations",
  };
}
