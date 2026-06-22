"use client";

import { SemanticBadge } from "@/components/ui/semantic-badge";
import {
  getIntegrationConnectionBadgeConfig,
  mapConnectionStatusToSemantic,
  type IntegrationConnectionSemanticStatus,
} from "@/lib/install/integration-setup";

type IntegrationConnectionStatusBadgeProps = {
  status: string | null | undefined;
  label: string;
  permissionLevel?: string | null;
  hasCredential?: boolean;
  lastTestSuccessAt?: string | null;
  lastTestFailedAt?: string | null;
  lastTestError?: string | null;
  /** Override mapped semantic status when known. */
  semanticStatus?: IntegrationConnectionSemanticStatus;
  className?: string;
};

export function IntegrationConnectionStatusBadge({
  status,
  label,
  permissionLevel,
  hasCredential,
  lastTestSuccessAt,
  lastTestFailedAt,
  lastTestError,
  semanticStatus,
  className,
}: IntegrationConnectionStatusBadgeProps) {
  const resolved =
    semanticStatus ??
    mapConnectionStatusToSemantic(status, {
      permissionLevel,
      hasCredential,
      lastTestSuccessAt,
      lastTestFailedAt,
      lastTestError,
    });
  const config = getIntegrationConnectionBadgeConfig(resolved);

  return (
    <SemanticBadge
      type={config.badgeType}
      value={config.badgeValue}
      label={label}
      className={className}
    />
  );
}
