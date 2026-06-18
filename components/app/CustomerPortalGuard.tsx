"use client";

import { type ReactNode } from "react";
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
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
          <p className="text-sm font-medium text-gray-500">{loadingLabel}</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return children;
}
