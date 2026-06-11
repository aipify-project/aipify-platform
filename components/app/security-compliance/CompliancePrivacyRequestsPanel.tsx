"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parsePrivacyRequests, type PrivacyRequest } from "@/lib/aipify/security-compliance";

type CompliancePrivacyRequestsPanelProps = {
  labels: Record<string, string>;
};

export function CompliancePrivacyRequestsPanel({ labels }: CompliancePrivacyRequestsPanelProps) {
  const [requests, setRequests] = useState<PrivacyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [requestType, setRequestType] = useState("export");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/compliance/privacy-requests");
    if (res.ok) {
      const data = await res.json();
      setRequests(data.requests ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function createRequest() {
    await fetch("/api/aipify/compliance/privacy-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_type: requestType, subject_email: email }),
    });
    setEmail("");
    await load();
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/compliance" className="text-sm text-indigo-700">{labels.back}</Link>
      </div>
      <p className="text-sm text-gray-600">{labels.subtitle}</p>

      <section className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
        <h2 className="text-sm font-semibold">{labels.createRequest}</h2>
        <select value={requestType} onChange={(e) => setRequestType(e.target.value)} className="rounded border border-gray-200 px-3 py-2 text-sm">
          <option value="export">{labels.export}</option>
          <option value="delete">{labels.delete}</option>
          <option value="anonymize">{labels.anonymize}</option>
        </select>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={labels.emailPlaceholder} className="w-full rounded border border-gray-200 px-3 py-2 text-sm" />
        <button type="button" disabled={!email.trim()} onClick={() => void createRequest()} className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50">{labels.submit}</button>
      </section>

      {requests.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.noRequests}</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {requests.map((r) => (
            <li key={r.id} className="rounded border border-gray-200 bg-white px-3 py-2">
              {r.request_type} · {r.subject_email} · <span className="capitalize">{r.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
