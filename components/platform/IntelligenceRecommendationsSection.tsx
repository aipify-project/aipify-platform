"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  parseIntelligenceRecommendations,
  type IntelligenceRecommendation,
} from "@/lib/platform/intelligence-engine";

type IntelligenceRecommendationsSectionProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    confidence: string;
    viewQueue: string;
  };
};

export default function IntelligenceRecommendationsSection({
  labels,
}: IntelligenceRecommendationsSectionProps) {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<IntelligenceRecommendation[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_intelligence_recommendations");

      if (!cancelled) {
        setRecommendations(
          error || !data ? [] : parseIntelligenceRecommendations(data)
        );
        setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
          <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
        </div>
        <Link
          href="/platform/intelligence/learning-queue"
          className="text-sm font-semibold text-violet-700 hover:text-violet-900"
        >
          {labels.viewQueue} →
        </Link>
      </div>

      {recommendations.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">{labels.empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {recommendations.slice(0, 5).map((rec) => (
            <li
              key={rec.id}
              className="rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm"
            >
              <p className="font-medium text-gray-900">&ldquo;{rec.message}&rdquo;</p>
              <p className="mt-1 text-xs text-gray-600">
                {labels.confidence}: {rec.confidence}%
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
