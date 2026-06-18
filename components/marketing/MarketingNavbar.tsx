"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { marketingDataAttr } from "@/lib/marketing/analytics";

export type MarketingNavLabels = {
  product: string;
  modules: string;
  businessPacks: string;
  whyAipify: string;
  customerStories: string;
  pricing: string;
  enterprise: string;
  security: string;
  pilot: string;
  knowledge: string;
  growthPartners: string;
  earlyAccess: string;
  contact: string;
  controlCenter: string;
  login: string;
  getStarted: string;
};

type MarketingNavbarProps = {
  appName: string;
  labels: MarketingNavLabels;
};

const navLinks: Array<{ key: keyof MarketingNavLabels; href: string }> = [
  { key: "product", href: "/product" },
  { key: "businessPacks", href: "/pricing#business-packs" },
  { key: "whyAipify", href: "/why-aipify" },
  { key: "customerStories", href: "/customer-stories" },
  { key: "pricing", href: "/pricing" },
  { key: "enterprise", href: "/enterprise" },
  { key: "security", href: "/security" },
  { key: "modules", href: "/modules" },
  { key: "growthPartners", href: "/growth-partners" },
  { key: "pilot", href: "/pilot" },
  { key: "knowledge", href: "/knowledge" },
];

export default function MarketingNavbar({ appName, labels }: MarketingNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0e14]/90 backdrop-blur-md">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 text-sm font-bold text-white shadow-lg shadow-cyan-500/20">
            A
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">{appName}</span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map(({ key, href }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              {labels[key]}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/early-access"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
            {...marketingDataAttr("cta_click", "nav_early_access")}
          >
            {labels.earlyAccess}
          </Link>
          <Link
            href="/app"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
          >
            {labels.controlCenter}
          </Link>
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
          >
            {labels.login}
          </Link>
          <Link
            href="/early-access"
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-400 hover:to-blue-500"
            {...marketingDataAttr("cta_click", "nav_get_started")}
          >
            {labels.getStarted}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex rounded-lg p-2 text-slate-300 lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-white/10 bg-[#0a0e14] px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map(({ key, href }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5"
                onClick={() => setMenuOpen(false)}
              >
                {labels[key]}
              </Link>
            ))}
            <Link
              href="/contact"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5"
              onClick={() => setMenuOpen(false)}
            >
              {labels.contact}
            </Link>
            <hr className="my-2 border-white/10" />
            <Link
              href="/early-access"
              className="mt-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-center text-sm font-semibold text-white"
              onClick={() => setMenuOpen(false)}
            >
              {labels.getStarted}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
