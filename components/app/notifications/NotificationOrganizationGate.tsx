"use client";

import type { ReactNode } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import type { AppPortalAccessMessageKey } from "@/lib/app-portal/access-state-messages";

type NotificationOrganizationGateProps = {
  loading: boolean;
  isReady: boolean;
  accessMessageKey: AppPortalAccessMessageKey;
  messages: {
    organizationMissing: string;
    pageLoadError: string;
    accessDenied: string;
    subscriptionRequired: string;
    permissionMissing: string;
    entitlementLocked: string;
    retry: string;
  };
  onRetry: () => void;
  children: ReactNode;
};

function resolveAccessMessage(
  key: AppPortalAccessMessageKey,
  messages: NotificationOrganizationGateProps["messages"],
): string {
  switch (key) {
    case "organizationMissing":
      return messages.organizationMissing;
    case "pageLoadError":
      return messages.pageLoadError;
    case "subscriptionRequired":
      return messages.subscriptionRequired;
    case "permissionMissing":
      return messages.permissionMissing;
    case "entitlementLocked":
      return messages.entitlementLocked;
    default:
      return messages.accessDenied;
  }
}

export function NotificationOrganizationGate({
  loading,
  isReady,
  accessMessageKey,
  messages,
  onRetry,
  children,
}: NotificationOrganizationGateProps) {
  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (!isReady) {
    return (
      <PlatformEmptyState
        title={messages.accessDenied}
        message={resolveAccessMessage(accessMessageKey, messages)}
        primaryAction={{ label: messages.retry, onClick: onRetry }}
      />
    );
  }

  return <>{children}</>;
}
