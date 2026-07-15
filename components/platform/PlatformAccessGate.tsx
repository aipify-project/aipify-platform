"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { buildMfaEnrollPath } from "@/lib/auth/two-factor/mfa-portal-routing";
import { useTwoFactorSessionGate } from "@/lib/auth/use-two-factor-session-gate";

const PLATFORM_SESSION_AUDIT_KEY = "aipify-platform-admin-session-audit";

type PlatformAccessGateProps = {
  loadingLabel: string;
  twoFactorRequiredLabel: string;
  children: ReactNode;
};

export default function PlatformAccessGate({
  loadingLabel,
  twoFactorRequiredLabel,
  children,
}: PlatformAccessGateProps) {
  const router = useRouter();
  const auditSentRef = useRef(false);

  const { ready, blockedReason } = useTwoFactorSessionGate({
    requireEnabled: true,
    onRequireEnabled: (pathname) => {
      router.replace(buildMfaEnrollPath(pathname, "platform"));
    },
  });

  useEffect(() => {
    if (!ready || auditSentRef.current) return;

    auditSentRef.current = true;
    if (sessionStorage.getItem(PLATFORM_SESSION_AUDIT_KEY) !== "1") {
      sessionStorage.setItem(PLATFORM_SESSION_AUDIT_KEY, "1");
      void fetch("/api/platform-admin/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action_type: "platform_admin_session_entered" }),
      });
    }
  }, [ready]);

  if (blockedReason) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <p className="text-sm font-medium text-slate-600">{twoFactorRequiredLabel}</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
          <p className="text-sm font-medium text-slate-600">{loadingLabel}</p>
        </div>
      </div>
    );
  }

  return children;
}
