"use client";

import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
import { buildMfaEnrollPath } from "@/lib/auth/two-factor/mfa-portal-routing";
import { useTwoFactorSessionGate } from "@/lib/auth/use-two-factor-session-gate";

type SuperAdminAccessGateProps = {
  loadingLabel: string;
  recoveryRequiredLabel: string;
  children: ReactNode;
};

export default function SuperAdminAccessGate({
  loadingLabel,
  recoveryRequiredLabel,
  children,
}: SuperAdminAccessGateProps) {
  const router = useRouter();

  const { ready, blockedReason } = useTwoFactorSessionGate({
    requireEnabled: true,
    onRequireEnabled: (pathname) => {
      router.replace(buildMfaEnrollPath(pathname, "platform"));
    },
    validateStatus: (status) =>
      status.enabled && (status.recovery_codes_remaining ?? 0) >= 1,
    onBlocked: (reason) => {
      if (reason === "validation_failed") {
        router.replace(buildMfaEnrollPath("/super", "platform"));
      }
    },
  });

  if (blockedReason) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <p className="text-sm font-medium text-gray-600">{recoveryRequiredLabel}</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600" />
          <p className="text-sm font-medium text-gray-600">{loadingLabel}</p>
        </div>
      </div>
    );
  }

  return children;
}
