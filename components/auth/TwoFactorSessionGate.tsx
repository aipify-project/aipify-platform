"use client";

import { type ReactNode } from "react";
import { useTwoFactorSessionGate } from "@/lib/auth/use-two-factor-session-gate";

type TwoFactorSessionGateProps = {
  loadingLabel: string;
  children: ReactNode;
};

export default function TwoFactorSessionGate({
  loadingLabel,
  children,
}: TwoFactorSessionGateProps) {
  const { ready } = useTwoFactorSessionGate();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
          <p className="text-sm font-medium text-gray-500">{loadingLabel}</p>
        </div>
      </div>
    );
  }

  return children;
}
