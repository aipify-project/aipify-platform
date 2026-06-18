"use client";

import { useRef, useState } from "react";

export type VerificationPayload = { token: string; answer: number };

export function usePublicFormGuard() {
  const formStartedAt = useRef(Date.now());
  const [verification, setVerification] = useState<VerificationPayload | null>(null);
  const [verificationRequired, setVerificationRequired] = useState(false);

  function onVerified(payload: VerificationPayload) {
    setVerification(payload);
    setVerificationRequired(false);
  }

  function onVerificationReset() {
    setVerification(null);
  }

  function requireVerification(): boolean {
    if (!verification) {
      setVerificationRequired(true);
      return false;
    }
    return true;
  }

  function guardFields(email?: string, extra?: Record<string, unknown>) {
    return {
      ...extra,
      email,
      _verification_token: verification?.token ?? "",
      _verification_answer: verification?.answer ?? -1,
      _form_started_at: formStartedAt.current,
    };
  }

  return {
    formStartedAt,
    verification,
    onVerified,
    onVerificationReset,
    requireVerification,
    guardFields,
    verificationRequired,
  };
}
