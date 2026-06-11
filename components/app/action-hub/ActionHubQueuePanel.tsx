"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseActionItems, type ActionItem } from "@/lib/aipify/action-hub";
import { ActionItemList } from "./ActionItemList";

type ActionHubQueuePanelProps = {
  labels: Record<string, string>;
  mode: "inbox" | "assigned" | "recommended" | "completed";
};

function queueParams(mode: ActionHubQueuePanelProps["mode"]): Record<string, string> {
  switch (mode) {
    case "inbox":
      return { assigned_to_me: "true" };
    case "assigned":
      return { status: "assigned" };
    case "recommended":
      return { status: "open" };
    case "completed":
      return { status: "completed" };
  }
}

export function ActionHubQueuePanel({ labels, mode }: ActionHubQueuePanelProps) {
  const [items, setItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams(queueParams(mode));
    const res = await fetch(`/api/aipify/action-hub/queue?${params}`);
    if (res.ok) {
      const data = await res.json();
      setItems(parseActionItems({ items: data.items }));
    }
    setLoading(false);
  }, [mode]);

  useEffect(() => {
    void load();
  }, [load]);

  async function updateStatus(id: string, status: string) {
    setActing(id);
    await fetch(`/api/aipify/action-hub/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
    setActing(null);
  }

  const title =
    mode === "inbox"
      ? labels.inboxTitle
      : mode === "assigned"
        ? labels.assignedTitle
        : mode === "recommended"
          ? labels.recommendedTitle
          : labels.completedTitle;

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <Link href="/app/actions" className="text-sm text-rose-700">
          {labels.back}
        </Link>
      </div>
      <ActionItemList
        items={items}
        empty={labels.empty}
        showActions={mode !== "completed"}
        labels={labels}
        onStatus={updateStatus}
        acting={acting}
      />
    </div>
  );
}
