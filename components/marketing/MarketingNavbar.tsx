"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AipifyPulse from "@/components/branding/AipifyPulse";
import MarketingGlobalSearch from "@/components/marketing/MarketingGlobalSearch";
import { AipifyMarketingClasses, AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import type { MarketingSearchResult } from "@/lib/marketing/governance/types";
import { isNavHrefActive } from "@/lib/marketing/public-nav";

export type MarketingNavLabels = {
  platform: string;
  businessPacks: string;
  solutions: string;
  enterprise: string;
  partners: string;
  resources: string;
  company: string;
  bookDemo: string;
  login: string;
  /** @deprecated legacy keys — kept for locale compatibility */
  product?: string;
  modules?: string;
  whyAipify?: string;
  customerStories?: string;
  pricing?: string;
  security?: string;
  pilot?: string;
  knowledge?: string;
  growthPartners?: string;
  earlyAccess?: string;
  contact?: string;
  careers?: string;
  media?: string;
  controlCenter?: string;
  getStarted?: string;
};

type MarketingNavbarProps = {
  appName: string;
  labels: MarketingNavLabels;
  search?: {
    placeholder: string;
    noResults: string;
    index: MarketingSearchResult[];
  };
};

type NavItem = { label: string; href: string };

function buildNavItems(labels: MarketingNavLabels): NavItem[] {
  return [
    { label: labels.platform, href: "/product" },
    { label: labels.businessPacks, href: "/pricing#business-packs" },
    { label: labels.solutions, href: "/customer-stories" },
    { label: labels.enterprise, href: "/enterprise" },
    { label: labels.partners, href: "/growth-partners" },
    { label: labels.resources, href: "/knowledge" },
    { label: labels.company, href: "/company" },
  ];
}

export default function MarketingNavbar({ appName, labels, search }: MarketingNavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const items = buildNavItems(labels);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className={AipifyMarketingClasses.header}>
      <nav
        className="mx-auto flex h-14 max-w-[87.5rem] items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <AipifyPulse size={32} variant="gradient" title={appName} aria-label={appName} />
          <span className="text-lg font-semibold tracking-tight text-aipify-text">{appName}</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {items.map((item) => {
            const active = isNavHrefActive(item.href, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 ${active ? AipifyMarketingClasses.navLinkActive : AipifyMarketingClasses.navLink}`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {search ? (
            <MarketingGlobalSearch placeholder={search.placeholder} noResults={search.noResults} index={search.index} />
          ) : null}
          <Link href="/login" className={`rounded-lg px-3 py-2 ${AipifyMarketingClasses.navLink}`}>
            {labels.login}
          </Link>
          <Link
            href="/book-demo"
            className={AipifyMarketingClasses.primaryCta}
            {...marketingDataAttr("cta_click", "nav_book_demo")}
          >
            {labels.bookDemo}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex rounded-lg p-2 text-aipify-text-secondary lg:hidden"
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

      {menuOpen ? (
        <div className="border-t border-aipify-border bg-aipify-surface px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:hidden">
          <div className="flex flex-col gap-1">
            {items.map((item) => {
              const active = isNavHrefActive(item.href, pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-aipify-surface-muted ${
                    active ? "text-aipify-companion" : "text-aipify-text-secondary"
                  }`}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <hr className="my-3 border-aipify-border" />
            <Link href="/login" className={`${AipifyShellClasses.secondaryButton} text-center`} onClick={() => setMenuOpen(false)}>
              {labels.login}
            </Link>
            <Link
              href="/book-demo"
              className={`${AipifyMarketingClasses.primaryCta} text-center`}
              onClick={() => setMenuOpen(false)}
            >
              {labels.bookDemo}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
