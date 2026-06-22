"use client";

import { SemanticBadge } from "@/components/ui/semantic-badge";
import {
  getIntegrationCanonicalBadgeConfig,
  type IntegrationCanonicalStatus,
} from "@/lib/app-portal/integrations/canonical-status";
import {
  getIntegrationConnectionBadgeConfig,
  getIntegrationWizardPhaseBadgeConfig,
  mapConnectionStatusToSemantic,
  type IntegrationConnectionSemanticStatus,
  type IntegrationWizardConnectionPhase,
} from "@/lib/install/integration-setup";

type IntegrationConnectionStatusBadgeProps = {
  status?: string | null | undefined;
  label: string;
  permissionLevel?: string | null;
  hasCredential?: boolean;
  lastTestSuccessAt?: string | null;
  lastTestFailedAt?: string | null;
  lastTestError?: string | null;
  semanticStatus?: IntegrationConnectionSemanticStatus;
  wizardPhase?: IntegrationWizardConnectionPhase;
  canonicalStatus?: IntegrationCanonicalStatus;
  activationComplete?: boolean;
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
  wizardPhase,
  canonicalStatus,
  className,
}: IntegrationConnectionStatusBadgeProps) {
  if (canonicalStatus) {
    const config = getIntegrationCanonicalBadgeConfig(canonicalStatus);
    return (
      <SemanticBadge
        type={config.badgeType}
        value={config.badgeValue}
        label={label}
        className={className}
      />
    );
  }

  if (wizardPhase) {
    const config = getIntegrationWizardPhaseBadgeConfig(wizardPhase);
    return (
      <SemanticBadge
        type={config.badgeType}
        value={config.badgeValue}
        label={label}
        className={className}
      />
    );
  }

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
