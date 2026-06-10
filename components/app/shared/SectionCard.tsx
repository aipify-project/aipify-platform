import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  children: ReactNode;
  action?: ReactNode;
};

export function SectionCard({ title, children, action }: SectionCardProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
