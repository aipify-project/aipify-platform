"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { invalidateTwoFactorStatusCache } from "@/lib/auth/two-factor";
import {
  normalizeTotpDigitsFromPaste,
  shouldAutoSubmitTotpCode,
} from "@/lib/auth/two-factor-verify-auto-submit";

type TwoFactorVerifyFormProps = {
  labels: {
    codeLabel: string;
    verify: string;
    useRecovery: string;
    recoveryTitle: string;
    recoveryHint: string;
    recoverySubmit: string;
    backToSignIn: string;
    codeRequired: string;
    invalidCode: string;
    challengeLocked: string;
    generic: string;
    verifying: string;
  };
};

export default function TwoFactorVerifyForm({ labels }: TwoFactorVerifyFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState("");
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const submitInFlightRef = useRef(false);
  const autoAttemptedCodeRef = useRef<string | null>(null);

  const nextPath = searchParams.get("next");

  const createChallenge = useCallback(async () => {
    const res = await fetch("/api/auth/2fa/challenge", { method: "POST" });
    if (!res.ok) {
      setError(labels.generic);
      return;
    }
    const data = (await res.json()) as { challengeId?: string };
    setChallengeId(data.challengeId ?? null);
  }, [labels.generic]);

  useEffect(() => {
    void createChallenge().finally(() => setBooting(false));
  }, [createChallenge]);

  const verifyCode = useCallback(
    async (code: string, manual = false) => {
      if (submitInFlightRef.current || loading) return;

      if (!manual && autoAttemptedCodeRef.current === code) return;

      setError(null);

      if (!challengeId) {
        setError(labels.generic);
        return;
      }

      if (!code) {
        setError(labels.codeRequired);
        return;
      }

      submitInFlightRef.current = true;
      if (!manual && !recoveryMode) {
        autoAttemptedCodeRef.current = code;
      }

      setLoading(true);
      try {
        const endpoint = recoveryMode
          ? "/api/auth/2fa/recovery/verify"
          : "/api/auth/2fa/verify";
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ challengeId, code }),
        });
        const data = (await res.json()) as { error?: string };

        if (!res.ok) {
          const key = data.error ?? "generic";
          setError(
            key === "invalidCode"
              ? labels.invalidCode
              : key === "challengeLocked"
                ? labels.challengeLocked
                : labels.generic,
          );
          if (key === "challengeLocked" || key === "generic") {
            await createChallenge();
          }
          return;
        }

        invalidateTwoFactorStatusCache();

        const destination =
          nextPath?.startsWith("/") && !nextPath.startsWith("//")
            ? nextPath
            : "/app/command-center";
        window.location.assign(destination);
      } catch {
        setError(labels.generic);
      } finally {
        setLoading(false);
        submitInFlightRef.current = false;
      }
    },
    [
      challengeId,
      createChallenge,
      labels.challengeLocked,
      labels.codeRequired,
      labels.generic,
      labels.invalidCode,
      loading,
      nextPath,
      recoveryMode,
    ],
  );

  useEffect(() => {
    const code = digits.join("");
    if (code.length < 6) {
      autoAttemptedCodeRef.current = null;
    }
  }, [digits]);

  useEffect(() => {
    if (
      !shouldAutoSubmitTotpCode({
        digits,
        autoAttemptedCode: autoAttemptedCodeRef.current,
        recoveryMode,
        booting,
        loading,
        submitInFlight: submitInFlightRef.current,
      })
    ) {
      return;
    }

    void verifyCode(digits.join(""));
  }, [digits, recoveryMode, booting, loading, verifyCode]);

  function updateDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text");
    const nextDigits = normalizeTotpDigitsFromPaste(pasted);
    if (!nextDigits.some(Boolean)) return;
    e.preventDefault();
    setDigits(nextDigits);
    inputRefs.current[Math.min(nextDigits.filter(Boolean).length, 5)]?.focus();
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const code = recoveryMode ? recoveryCode.trim() : digits.join("");
    await verifyCode(code, true);
  }

  if (booting) {
    return <p className="text-sm text-gray-500">{labels.verifying}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {error}
        </div>
      )}

      {recoveryMode ? (
        <div>
          <label htmlFor="recovery-code" className="block text-sm font-medium text-gray-700">
            {labels.recoveryTitle}
          </label>
          <p className="mt-1 text-sm text-gray-500">{labels.recoveryHint}</p>
          <input
            id="recovery-code"
            type="text"
            autoComplete="off"
            value={recoveryCode}
            onChange={(e) => setRecoveryCode(e.target.value)}
            className="mt-3 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm uppercase tracking-wide text-gray-900 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
          />
        </div>
      ) : (
        <div>
          <p className="text-sm font-medium text-gray-700">{labels.codeLabel}</p>
          <div className="mt-3 flex justify-center gap-2 sm:gap-3">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={1}
                value={digit}
                onChange={(e) => updateDigit(index, e.target.value)}
                onPaste={handlePaste}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !digits[index] && index > 0) {
                    inputRefs.current[index - 1]?.focus();
                  }
                }}
                className="h-12 w-10 rounded-xl border border-gray-200 bg-gray-50 text-center text-lg font-semibold text-gray-900 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100 sm:h-14 sm:w-12"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? labels.verifying
          : recoveryMode
            ? labels.recoverySubmit
            : labels.verify}
      </button>

      <div className="flex flex-col items-center gap-3 text-sm">
        <button
          type="button"
          onClick={() => {
            setRecoveryMode((v) => !v);
            setError(null);
            autoAttemptedCodeRef.current = null;
          }}
          className="font-medium text-violet-600 hover:text-violet-700"
        >
          {recoveryMode ? labels.verify : labels.useRecovery}
        </button>
        <button
          type="button"
          onClick={() => void handleSignOut()}
          className="font-medium text-gray-600 hover:text-gray-800"
        >
          {labels.backToSignIn}
        </button>
      </div>
    </form>
  );
}
