import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string;
  icon: ReactNode;
  accent?: "blue" | "violet" | "indigo" | "green";
};

const accentStyles = {
  blue: "from-blue-500 to-blue-600",
  violet: "from-violet-500 to-violet-600",
  indigo: "from-indigo-500 to-indigo-600",
  green: "from-emerald-500 to-emerald-600",
};

export default function StatCard({
  label,
  value,
  icon,
  accent = "blue",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {value}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accentStyles[accent]} text-white shadow-sm`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
