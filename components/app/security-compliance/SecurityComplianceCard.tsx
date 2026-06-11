"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseSecurityComplianceCard, type SecurityComplianceCard } from "@/lib/aipify/security-compliance";

type SecurityComplianceCardProps = {
  labels: Record<string, string>;
};

export function SecurityComplianceCard({ labels }: SecurityComplianceCardProps) {
  const [card, setCard] = useState<SecurityComplianceCard | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/aipify/security/card");
    if (res.ok) setCard(parseSecurityComplianceCard(await res.json()));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (!card?.has_customer) return null;

  return (
    <section className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50/80 to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-rose-700">{labels.title}</p>
          {card.emergency_stop_active ? (
            <p className="mt-1 text-sm font-semibold text-rose-800">{labels.emergencyStop}</p>
          ) : (
            <p className="mt-1 text-sm text-gray-800">
              {card.open_incidents ?? 0} {labels.openIncidents}
              {(card.critical_incidents ?? 0) > 0 ? ` · ${card.critical_incidents} ${labels.critical}` : ""}
            </p>
          )}
          <p className="mt-1 text-xs text-rose-600">{card.privacy_note}</p>
        </div>
        <Link href="/app/security" className="text-sm font-medium text-rose-700 hover:underline">
          {labels.open}
        </Link>
      </div>
    </section>
  );
}
