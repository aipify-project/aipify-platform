"use client";

import Link from "next/link";

type Props = {
  labels: Record<string, string>;
};

export function DesktopCompanionSidebar({ labels }: Props) {
  const items = [
    { key: "sidebarAsk", href: "/app/desktop/companion" },
    { key: "sidebarBriefings", href: "/app/desktop/briefings" },
    { key: "sidebarSuggestions", href: "/app/desktop/actions" },
    { key: "sidebarRecommendations", href: "/app/desktop/notifications" },
    { key: "sidebarFollowUps", href: "/app/desktop/tasks" },
    { key: "sidebarQuickActions", href: "/app/desktop/actions" },
  ];

  return (
    <section className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
      <h2 className="text-sm font-semibold text-indigo-900">{labels.title}</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.key}>
            <Link href={item.href} className="text-indigo-800 hover:underline">
              {labels[item.key]}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
