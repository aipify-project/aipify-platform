"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseAssistantIdentityCard, type AssistantIdentityCard } from "@/lib/aipify/assistant-identity";

type AssistantIdentityWelcomeBannerProps = {
  labels: Record<string, string>;
};

export function AssistantIdentityWelcomeBanner({ labels }: AssistantIdentityWelcomeBannerProps) {
  const [card, setCard] = useState<AssistantIdentityCard | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/aipify/assistant-identity/card");
    if (res.ok) setCard(parseAssistantIdentityCard(await res.json()));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (!card?.has_customer || card.welcome_completed || !card.require_welcome_flow) return null;

  return (
    <section className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm">
      <p className="text-sm font-medium text-amber-900">{labels.prompt}</p>
      <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
      <Link href="/app/welcome" className="mt-3 inline-block text-sm font-medium text-amber-800 hover:underline">
        {labels.cta}
      </Link>
    </section>
  );
}
