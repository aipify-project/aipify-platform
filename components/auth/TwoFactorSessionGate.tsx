"use client";

import { type ReactNode } from "react";
import { AppGlobalLoadingShell } from "@/components/app/AppGlobalLoadingShell";
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
    return <AppGlobalLoadingShell message={loadingLabel} />;
  }

  return children;
}
