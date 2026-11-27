import Link from "next/link";
import type { ReactNode } from "react";
import type { SalesHeroModel } from "./types";

const PRIMARY =
  "inline-flex min-h-11 items-center justify-center rounded-xl bg-[#7C3AED] px-4 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDD6FE] focus-visible:ring-offset-2";
const SECONDARY =
  "inline-flex min-h-11 items-center justify-center rounded-xl border border-[#E8E4F2] bg-white px-4 text-sm font-semibold text-[#1E293B] hover:border-[#7C3AED]/40 hover:bg-[#F7F4FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDD6FE] focus-visible:ring-offset-2";

/**
 * Page hero for a guided sales workspace.
 * Brand, tenant and product names arrive only through the copy props.
 */
export function SalesExperienceHero({
  hero,
  aside,
}: {
  hero: SalesHeroModel;
  aside?: ReactNode;
}) {
  const [primary, ...rest] = hero.actions ?? [];
  return (
    <section className="overflow-hidden rounded-2xl border border-[#E8E4F2] bg-white shadow-[0_1px_2px_rgba(30,24,60,0.04),0_8px_24px_rgba(30,24,60,0.04)]">
      <div className={`grid gap-6 p-6 sm:p-8 ${aside ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-center" : ""}`}>
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold tracking-tight text-[#1E293B] sm:text-4xl">{hero.title}</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#64748B]">{hero.support}</p>
          {primary ? (
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Link href={primary.href} className={PRIMARY}>
                {primary.label}
              </Link>
              {rest.map((action) => (
                <Link key={action.href + action.label} href={action.href} className={SECONDARY}>
                  {action.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        {aside ? <div className="min-w-0 rounded-2xl bg-[#F3EDFF] p-5 text-[#1E293B]">{aside}</div> : null}
      </div>
      {hero.notice ? (
        <p className="border-t border-[#E8E4F2] px-6 py-3 text-sm text-[#475569] sm:px-8">{hero.notice}</p>
      ) : null}
    </section>
  );
}
