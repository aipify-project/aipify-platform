"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AipifyPulse from "@/components/branding/AipifyPulse";
import MarketingGlobalSearch from "@/components/marketing/MarketingGlobalSearch";
import { AipifyMarketingClasses, AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import type { MarketingSearchResult } from "@/lib/marketing/governance/types";

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
  bookDemo: string;
  contact: string;
  company: string;
  careers: string;
  media: string;
  controlCenter: string;
  login: string;
  getStarted: string;
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

type NavGroup = {
  id: string;
  label: string;
  links: Array<{ label: string; href: string }>;
};

function buildNavGroups(labels: MarketingNavLabels): NavGroup[] {
  return [
    {
      id: "product",
      label: labels.product,
      links: [
        { label: labels.product, href: "/product" },
        { label: labels.modules, href: "/modules" },
        { label: labels.getStarted, href: "/get-started" },
        { label: labels.whyAipify, href: "/why-aipify" },
      ],
    },
    {
      id: "packs",
      label: labels.businessPacks,
      links: [
        { label: labels.businessPacks, href: "/pricing#business-packs" },
        { label: labels.pricing, href: "/pricing" },
      ],
    },
    {
      id: "solutions",
      label: labels.enterprise,
      links: [
        { label: labels.enterprise, href: "/enterprise" },
        { label: labels.security, href: "/security" },
        { label: labels.customerStories, href: "/customer-stories" },
        { label: labels.pilot, href: "/pilot" },
      ],
    },
    {
      id: "partners",
      label: labels.growthPartners,
      links: [{ label: labels.growthPartners, href: "/growth-partners" }],
    },
    {
      id: "resources",
      label: labels.knowledge,
      links: [
        { label: labels.knowledge, href: "/knowledge" },
        { label: labels.businessPacks, href: "/knowledge#business-packs" },
      ],
    },
    {
      id: "company",
      label: labels.company,
      links: [
        { label: labels.company, href: "/company" },
        { label: labels.careers, href: "/careers" },
        { label: labels.media, href: "/media" },
        { label: labels.contact, href: "/contact" },
        { label: labels.bookDemo, href: "/book-demo" },
      ],
    },
  ];
}

export default function MarketingNavbar({ appName, labels, search }: MarketingNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const groups = buildNavGroups(labels);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className={AipifyMarketingClasses.header}>
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <AipifyPulse size={32} variant="gradient" title={appName} aria-label={appName} />
          <span className="text-lg font-semibold tracking-tight text-aipify-text">{appName}</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {groups.map((group) => (
            <div key={group.id} className="relative">
              <button
                type="button"
                className={`rounded-lg px-3 py-2 ${AipifyMarketingClasses.navLink}`}
                aria-expanded={openGroup === group.id}
                onClick={() => setOpenGroup(openGroup === group.id ? null : group.id)}
                onBlur={() => window.setTimeout(() => setOpenGroup(null), 120)}
              >
                {group.label}
              </button>
              {openGroup === group.id ? (
                <div className="absolute left-0 top-full z-50 mt-1 min-w-[12rem] rounded-xl border border-aipify-border bg-aipify-surface p-2 shadow-lg">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block rounded-lg px-3 py-2 text-sm text-aipify-text-secondary hover:bg-aipify-surface-muted hover:text-aipify-text"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {search ? (
            <MarketingGlobalSearch placeholder={search.placeholder} noResults={search.noResults} index={search.index} />
          ) : null}
          <Link href="/login" className={`rounded-lg px-3 py-2 ${AipifyMarketingClasses.navLink}`}>
            {labels.login}
          </Link>
          <Link href="/app" className={`rounded-lg px-3 py-2 ${AipifyMarketingClasses.navLink}`}>
            {labels.controlCenter}
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
        <div className="border-t border-aipify-border bg-aipify-surface px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-4">
            {groups.map((group) => (
              <div key={group.id}>
                <p className="px-3 text-xs font-semibold uppercase tracking-wide text-aipify-text-muted">{group.label}</p>
                <div className="mt-1 flex flex-col gap-0.5">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-aipify-text-secondary hover:bg-aipify-surface-muted"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <hr className="border-aipify-border" />
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
