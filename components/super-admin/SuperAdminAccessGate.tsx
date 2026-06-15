"use client";

import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
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
      router.replace(
        `/app/settings/two-factor?required=1&next=${encodeURIComponent(pathname)}`
      );
    },
    validateStatus: (status) =>
      status.enabled && (status.recovery_codes_remaining ?? 0) >= 1,
    onBlocked: (reason) => {
      if (reason === "validation_failed") {
        router.replace(
          `/app/settings/two-factor?required=1&next=${encodeURIComponent("/super")}`
        );
      }
    },
  });

  if (blockedReason) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
        <p className="text-sm font-medium text-zinc-400">{recoveryRequiredLabel}</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-200" />
          <p className="text-sm font-medium text-zinc-400">{loadingLabel}</p>
        </div>
      </div>
    );
  }

  return children;
}
