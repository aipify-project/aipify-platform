"use client";

import { useState } from "react";

type DesktopConnectPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    platform: string;
    deviceName: string;
    connect: string;
    connecting: string;
    tokenTitle: string;
    tokenHint: string;
    copy: string;
    copied: string;
    error: string;
    planRequired: string;
    securityNote: string;
  };
};

export function DesktopConnectPanel({ labels }: DesktopConnectPanelProps) {
  const [platform, setPlatform] = useState("macos");
  const [deviceName, setDeviceName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleConnect() {
    setLoading(true);
    setError(null);
    setSessionToken(null);

    const res = await fetch("/api/desktop/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, device_name: deviceName || null }),
    });

    setLoading(false);

    if (!res.ok) {
      const payload = (await res.json()) as { error?: string };
      setError(payload.error ?? labels.error);
      return;
    }

    const data = (await res.json()) as { session_token?: string };
    if (data.session_token) {
      setSessionToken(data.session_token);
    }
  }

  async function handleCopy() {
    if (!sessionToken) return;
    await navigator.clipboard.writeText(sessionToken);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 rounded-lg border border-gray-200 bg-white p-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 text-xs text-gray-500">{labels.securityNote}</p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700" htmlFor="platform">
          {labels.platform}
        </label>
        <select
          id="platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="macos">macOS</option>
          <option value="windows" disabled>
            Windows (Phase 2)
          </option>
          <option value="linux" disabled>
            Linux (Phase 3)
          </option>
        </select>

        <label className="block text-sm font-medium text-gray-700" htmlFor="device">
          {labels.deviceName}
        </label>
        <input
          id="device"
          type="text"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          placeholder="MacBook Pro"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={() => void handleConnect()}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? labels.connecting : labels.connect}
      </button>

      {error && (
        <p className="text-sm text-red-600">
          {error.includes("Business") ? labels.planRequired : error}
        </p>
      )}

      {sessionToken && (
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
          <p className="font-medium text-indigo-900">{labels.tokenTitle}</p>
          <p className="mt-1 text-xs text-indigo-800">{labels.tokenHint}</p>
          <code className="mt-3 block break-all text-xs text-indigo-900">{sessionToken}</code>
          <button
            type="button"
            onClick={() => void handleCopy()}
            className="mt-3 text-sm text-indigo-700 hover:underline"
          >
            {copied ? labels.copied : labels.copy}
          </button>
        </div>
      )}
    </div>
  );
}
