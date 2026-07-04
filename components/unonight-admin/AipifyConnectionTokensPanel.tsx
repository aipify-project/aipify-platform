"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import {
  parseUnonightAipifyTokenList,
  parseUnonightAipifyTokenReveal,
  type UnonightAipifyTokenRecord,
  type UnonightAipifyTokenRevealResponse,
} from "@/lib/unonight-platform/types";
import type { UnonightAipifyConnectionLabels } from "@/lib/unonight-platform/labels";

type AipifyConnectionTokensPanelProps = {
  labels: UnonightAipifyConnectionLabels;
};

function formatDate(value: string | null, neverLabel: string): string {
  if (!value) return neverLabel;
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function AipifyConnectionTokensPanel({ labels }: AipifyConnectionTokensPanelProps) {
  const [tokens, setTokens] = useState<UnonightAipifyTokenRecord[]>([]);
  const [defaultScopes, setDefaultScopes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [tokenName, setTokenName] = useState("");
  const [actingId, setActingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [revealed, setRevealed] = useState<UnonightAipifyTokenRevealResponse | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/unonight-admin/aipify/tokens");
    if (!res.ok) {
      setError(labels.errors.unauthorized);
      setLoading(false);
      return;
    }
    const parsed = parseUnonightAipifyTokenList(await res.json());
    setTokens(parsed?.tokens ?? []);
    setDefaultScopes(parsed?.default_scopes ?? []);
    setLoading(false);
  }, [labels.errors.unauthorized]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    if (!tokenName.trim()) return;
    setCreating(true);
    setError(null);
    setRevealed(null);

    const res = await fetch("/api/unonight-admin/aipify/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token_name: tokenName.trim() }),
    });

    setCreating(false);
    if (!res.ok) {
      setError(labels.errors.generic);
      return;
    }

    const parsed = parseUnonightAipifyTokenReveal(await res.json());
    if (parsed) {
      setRevealed(parsed);
      setCopyState("idle");
    }
    setTokenName("");
    await refresh();
  }

  async function handleCopy() {
    if (!revealed?.token) return;
    try {
      await navigator.clipboard.writeText(revealed.token);
      setCopyState("copied");
      await fetch(`/api/unonight-admin/aipify/tokens/${revealed.id}/copied`, {
        method: "POST",
      });
    } catch {
      setError(labels.errors.generic);
    }
  }

  async function handleRevoke(tokenId: string) {
    setActingId(tokenId);
    setError(null);
    const res = await fetch(`/api/unonight-admin/aipify/tokens/${tokenId}/revoke`, {
      method: "POST",
    });
    setActingId(null);
    if (!res.ok) {
      setError(labels.errors.generic);
      return;
    }
    await refresh();
  }

  async function handleRotate(tokenId: string) {
    setActingId(tokenId);
    setError(null);
    setRevealed(null);
    const res = await fetch(`/api/unonight-admin/aipify/tokens/${tokenId}/rotate`, {
      method: "POST",
    });
    setActingId(null);
    if (!res.ok) {
      setError(labels.errors.generic);
      return;
    }
    const parsed = parseUnonightAipifyTokenReveal(await res.json());
    if (parsed) {
      setRevealed(parsed);
      setCopyState("idle");
    }
    await refresh();
  }

  const scopeLabels: Record<string, string> = {
    "metadata.read": labels.scopes.metadataRead,
    "organization.read": labels.scopes.organizationRead,
    "integration.status.read": labels.scopes.integrationStatusRead,
  };

  if (loading) {
    return <div className="p-6 text-sm text-slate-600">{labels.loading}</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">{labels.eyebrow}</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">{labels.subtitle}</p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{labels.help.title}</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <li>{labels.help.what}</li>
          <li>{labels.help.reads}</li>
          <li>{labels.help.notSupabase}</li>
          <li>{labels.help.revoke}</li>
          <li>{labels.help.connect}</li>
        </ul>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{labels.scopes.title}</h2>
        <ul className="mt-3 space-y-1 text-sm text-slate-700">
          {(defaultScopes.length ? defaultScopes : Object.keys(scopeLabels)).map((scope) => (
            <li key={scope}>
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{scope}</code>
              {" — "}
              {scopeLabels[scope] ?? scope}
            </li>
          ))}
        </ul>

        <form className="mt-6 flex flex-wrap items-end gap-3" onSubmit={(e) => void handleCreate(e)}>
          <div className="min-w-[240px] flex-1">
            <label htmlFor="token-name" className="block text-sm font-medium text-slate-800">
              {labels.form.nameLabel}
            </label>
            <input
              id="token-name"
              type="text"
              value={tokenName}
              onChange={(event) => setTokenName(event.target.value)}
              placeholder={labels.form.namePlaceholder}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              maxLength={120}
            />
          </div>
          <button
            type="submit"
            disabled={creating || !tokenName.trim()}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {creating ? labels.form.creating : labels.form.create}
          </button>
        </form>
      </section>

      {revealed ? (
        <section className="rounded-xl border border-amber-300 bg-amber-50 p-5">
          <h2 className="text-lg font-semibold text-amber-950">{labels.reveal.title}</h2>
          <p className="mt-2 text-sm text-amber-900">{labels.reveal.warning}</p>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-white p-3 text-xs text-slate-800">
            {revealed.token}
          </pre>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void handleCopy()}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white"
            >
              {copyState === "copied" ? labels.reveal.copied : labels.reveal.copy}
            </button>
            <button
              type="button"
              onClick={() => setRevealed(null)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700"
            >
              {labels.reveal.dismiss}
            </button>
          </div>
        </section>
      ) : null}

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{labels.table.name}</h2>
        {tokens.length === 0 ? (
          <div className="mt-4">
            <AipifyEmptyState message={labels.table.empty} pulseLabel="" />
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-2 py-2 font-medium">{labels.table.name}</th>
                  <th className="px-2 py-2 font-medium">{labels.table.scopes}</th>
                  <th className="px-2 py-2 font-medium">{labels.table.status}</th>
                  <th className="px-2 py-2 font-medium">{labels.table.lastUsed}</th>
                  <th className="px-2 py-2 font-medium">{labels.table.created}</th>
                  <th className="px-2 py-2 font-medium">{labels.table.actions}</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((token) => (
                  <tr key={token.id} className="border-b border-slate-100">
                    <td className="px-2 py-3 font-medium text-slate-900">{token.token_name}</td>
                    <td className="px-2 py-3 text-slate-600">
                      {token.scopes.map((scope) => (
                        <span
                          key={scope}
                          className="mr-1 inline-block rounded bg-slate-100 px-1.5 py-0.5 text-xs"
                        >
                          {scope}
                        </span>
                      ))}
                    </td>
                    <td className="px-2 py-3 text-slate-700">
                      {labels.status[token.status] ?? token.status}
                    </td>
                    <td className="px-2 py-3 text-slate-600">
                      {formatDate(token.last_used_at, labels.table.never)}
                    </td>
                    <td className="px-2 py-3 text-slate-600">
                      {formatDate(token.created_at, labels.table.never)}
                    </td>
                    <td className="px-2 py-3">
                      {token.status === "active" ? (
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={actingId === token.id}
                            onClick={() => void handleRotate(token.id)}
                            className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700"
                          >
                            {actingId === token.id ? labels.actions.rotating : labels.actions.rotate}
                          </button>
                          <button
                            type="button"
                            disabled={actingId === token.id}
                            onClick={() => void handleRevoke(token.id)}
                            className="rounded border border-red-200 px-2 py-1 text-xs text-red-700"
                          >
                            {actingId === token.id ? labels.actions.revoking : labels.actions.revoke}
                          </button>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
