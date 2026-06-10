import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string;
  change?: string;
  changeTone?: "positive" | "neutral" | "warning";
  icon: ReactNode;
  accent?: "blue" | "violet" | "indigo" | "green";
  className?: string;
};

const accentStyles = {
  blue: "from-blue-500 to-blue-600",
  violet: "from-violet-500 to-violet-600",
  indigo: "from-indigo-500 to-indigo-600",
  green: "from-emerald-500 to-emerald-600",
};

const changeStyles = {
  positive: "text-emerald-600",
  neutral: "text-gray-500",
  warning: "text-amber-600",
};

export default function StatCard({
  label,
  value,
  change,
  changeTone = "neutral",
  icon,
  accent = "blue",
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md sm:p-6 ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {value}
          </p>
          {change && (
            <p className={`mt-2 text-xs font-medium ${changeStyles[changeTone]}`}>
              {change}
            </p>
          )}
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accentStyles[accent]} text-white shadow-sm transition-transform duration-200 group-hover:scale-105`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
