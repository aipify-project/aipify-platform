import Link from "next/link";
import { resolveAppHref } from "@/lib/app/route-aliases";

type SettingsSubnavProps = {
  active: "domains" | "updates" | "security";
  labels: {
    domains: string;
    updates: string;
    security: string;
  };
};

export function SettingsSubnav({ active, labels }: SettingsSubnavProps) {
  const items = [
    { id: "domains" as const, href: resolveAppHref("/app/settings"), label: labels.domains },
    {
      id: "updates" as const,
      href: resolveAppHref("/app/settings/updates"),
      label: labels.updates,
    },
    {
      id: "security" as const,
      href: resolveAppHref("/app/settings/security"),
      label: labels.security,
    },
  ];

  return (
    <nav className="flex gap-4 border-b border-gray-200 px-1 text-sm">
      {items.map((item) =>
        item.id === active ? (
          <span
            key={item.id}
            className="border-b-2 border-indigo-600 py-3 font-medium text-indigo-600"
          >
            {item.label}
          </span>
        ) : (
          <Link
            key={item.id}
            href={item.href}
            className="py-3 text-gray-500 hover:text-gray-700"
          >
            {item.label}
          </Link>
        )
      )}
    </nav>
  );
}
