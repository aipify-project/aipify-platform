import type { WpkfContentType, WpkfStatus } from "@/lib/website-kompis-faq/constants";

export type WebsiteKompisFaqItem = {
  id: string;
  installId: string | null;
  domain: string | null;
  locale: string;
  title: string;
  question: string | null;
  answer: string;
  category: string | null;
  contentType: WpkfContentType;
  status: WpkfStatus;
  publicSafe: boolean;
  priority: number;
  tags: string[];
  sourceUrl: string | null;
  validFrom: string | null;
  validUntil: string | null;
  lastReviewedAt: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WebsiteKompisFaqListFilters = {
  status?: WpkfStatus | "";
  locale?: string;
  contentType?: WpkfContentType | "";
  query?: string;
};

export type WebsiteKompisFaqUpsertInput = {
  itemId?: string | null;
  installId?: string | null;
  domain?: string | null;
  locale: string;
  title: string;
  question?: string | null;
  answer: string;
  category?: string | null;
  contentType: WpkfContentType;
  publicSafe: boolean;
  priority: number;
  tags: string[];
  sourceUrl?: string | null;
  validFrom?: string | null;
  validUntil?: string | null;
  lastReviewedAt?: string | null;
};

export type WebsiteKompisFaqUpsertResult = {
  id: string;
  status: WpkfStatus;
  created: boolean;
};
