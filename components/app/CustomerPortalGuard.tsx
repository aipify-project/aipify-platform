"use client";

import { type ReactNode } from "react";
import { AppGlobalLoadingShell } from "@/components/app/AppGlobalLoadingShell";
import { usePortalAuthGuard } from "@/lib/auth/use-portal-auth-guard";

type CustomerPortalGuardProps = {
  loadingLabel: string;
  children: ReactNode;
};

export default function CustomerPortalGuard({
  loadingLabel,
  children,
}: CustomerPortalGuardProps) {
  const { checking, authenticated } = usePortalAuthGuard({
    loginPath: "/login",
    nextPath: "/app/command-center",
  });

  if (checking) {
    return <AppGlobalLoadingShell message={loadingLabel} />;
  }

  if (!authenticated) {
    return null;
  }

  return children;
}
