"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseOrganizationUnits,
  parseResponsibilityMap,
  type OrganizationUnit,
  type ResponsibilityEntry,
} from "@/lib/aipify/organizational-intelligence";

type OrganizationPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    units: string;
    responsibilities: string;
    emptyUnits: string;
    emptyResponsibilities: string;
    addUnit: string;
    addResponsibility: string;
    save: string;
    insightsLink: string;
  };
};

export function OrganizationPanel({ labels }: OrganizationPanelProps) {
  const [units, setUnits] = useState<OrganizationUnit[]>([]);
  const [responsibilities, setResponsibilities] = useState<ResponsibilityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [unitName, setUnitName] = useState("");
  const [roleName, setRoleName] = useState("");

  const load = useCallback(async () => {
    const [uRes, rRes] = await Promise.all([
      fetch("/api/aipify/organization/units"),
      fetch("/api/aipify/organization/responsibilities"),
    ]);
    if (uRes.ok) setUnits(parseOrganizationUnits(await uRes.json()));
    if (rRes.ok) setResponsibilities(parseResponsibilityMap(await rRes.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function addUnit() {
    if (!unitName.trim()) return;
    await fetch("/api/aipify/organization/units", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: unitName.trim(), unit_type: "department" }),
    });
    setUnitName("");
    void load();
  }

  async function addResponsibility() {
    if (!roleName.trim()) return;
    await fetch("/api/aipify/organization/responsibilities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role_name: roleName.trim(),
        responsibility_type: "workflow_owner",
      }),
    });
    setRoleName("");
    void load();
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <Link href="/app/insights" className="text-sm text-indigo-600 hover:underline">
        {labels.back}
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
        <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.units}</h2>
        {units.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.emptyUnits}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {units.map((u) => (
              <li key={u.id} className="flex items-center gap-2 text-sm text-gray-800">
                <span className="font-medium">{u.name}</span>
                <span className="text-gray-400">({u.unit_type})</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex gap-2">
          <input
            value={unitName}
            onChange={(e) => setUnitName(e.target.value)}
            placeholder="Support"
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => void addUnit()}
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700"
          >
            {labels.addUnit}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.responsibilities}</h2>
        {responsibilities.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.emptyResponsibilities}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {responsibilities.map((r) => (
              <li key={r.id} className="text-sm text-gray-800">
                <span className="font-medium">{r.role_name}</span>
                <span className="text-gray-400"> — {r.responsibility_type}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex gap-2">
          <input
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="Escalation Owner"
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => void addResponsibility()}
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700"
          >
            {labels.addResponsibility}
          </button>
        </div>
      </section>

      <Link href="/app/insights" className="text-sm text-indigo-600 hover:underline">
        {labels.insightsLink}
      </Link>
    </div>
  );
}
