import type { Translator } from "@/lib/i18n/translate";

export type DocumentManagementLabels = {
  title: string;
  subtitle: string;
  recent: string;
  knowledgeBase: string;
  shared: string;
  departments: string;
  templates: string;
  policies: string;
  contracts: string;
  reports: string;
  archives: string;
  search: string;
  accessDenied: string;
  createDocument: string;
  docTitle: string;
  docDescription: string;
  category: string;
  fileType: string;
  save: string;
  submitReview: string;
  approve: string;
  reject: string;
  archive: string;
  useTemplate: string;
  total: string;
  published: string;
  pendingReview: string;
  requiresUpdate: string;
  noDocuments: string;
  noDocumentsHint: string;
  status: string;
  pack: string;
  knowledgeLink: string;
  statusDraft: string;
  statusUnderReview: string;
  statusRequiresUpdate: string;
  statusPublished: string;
  statusRestricted: string;
  statusArchived: string;
  searchPlaceholder: string;
  searchResults: string;
};

export type KnowledgeManagementLabels = {
  title: string;
  subtitle: string;
  published: string;
  awaitingReview: string;
  faqs: string;
  knowledgeGaps: string;
  categories: string;
  mostViewed: string;
  outdated: string;
  accessDenied: string;
  documentsLink: string;
  search: string;
  searchPlaceholder: string;
  noArticles: string;
  noArticlesHint: string;
};

export function buildDocumentManagementLabels(t: Translator): DocumentManagementLabels {
  const p = "customerApp.documentManagement";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    recent: t(`${p}.recent`),
    knowledgeBase: t(`${p}.knowledgeBase`),
    shared: t(`${p}.shared`),
    departments: t(`${p}.departments`),
    templates: t(`${p}.templates`),
    policies: t(`${p}.policies`),
    contracts: t(`${p}.contracts`),
    reports: t(`${p}.reports`),
    archives: t(`${p}.archives`),
    search: t(`${p}.search`),
    accessDenied: t(`${p}.accessDenied`),
    createDocument: t(`${p}.createDocument`),
    docTitle: t(`${p}.docTitle`),
    docDescription: t(`${p}.docDescription`),
    category: t(`${p}.category`),
    fileType: t(`${p}.fileType`),
    save: t(`${p}.save`),
    submitReview: t(`${p}.submitReview`),
    approve: t(`${p}.approve`),
    reject: t(`${p}.reject`),
    archive: t(`${p}.archive`),
    useTemplate: t(`${p}.useTemplate`),
    total: t(`${p}.total`),
    published: t(`${p}.published`),
    pendingReview: t(`${p}.pendingReview`),
    requiresUpdate: t(`${p}.requiresUpdate`),
    noDocuments: t(`${p}.noDocuments`),
    noDocumentsHint: t(`${p}.noDocumentsHint`),
    status: t(`${p}.status`),
    pack: t(`${p}.pack`),
    knowledgeLink: t(`${p}.knowledgeLink`),
    statusDraft: t(`${p}.statusDraft`),
    statusUnderReview: t(`${p}.statusUnderReview`),
    statusRequiresUpdate: t(`${p}.statusRequiresUpdate`),
    statusPublished: t(`${p}.statusPublished`),
    statusRestricted: t(`${p}.statusRestricted`),
    statusArchived: t(`${p}.statusArchived`),
    searchPlaceholder: t(`${p}.searchPlaceholder`),
    searchResults: t(`${p}.searchResults`),
  };
}

export function buildKnowledgeManagementLabels(t: Translator): KnowledgeManagementLabels {
  const p = "customerApp.knowledgeManagement";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    published: t(`${p}.published`),
    awaitingReview: t(`${p}.awaitingReview`),
    faqs: t(`${p}.faqs`),
    knowledgeGaps: t(`${p}.knowledgeGaps`),
    categories: t(`${p}.categories`),
    mostViewed: t(`${p}.mostViewed`),
    outdated: t(`${p}.outdated`),
    accessDenied: t(`${p}.accessDenied`),
    documentsLink: t(`${p}.documentsLink`),
    search: t(`${p}.search`),
    searchPlaceholder: t(`${p}.searchPlaceholder`),
    noArticles: t(`${p}.noArticles`),
    noArticlesHint: t(`${p}.noArticlesHint`),
  };
}

export function documentStatusLabel(labels: DocumentManagementLabels, status: string): string {
  switch (status) {
    case "draft": return labels.statusDraft;
    case "under_review": return labels.statusUnderReview;
    case "requires_update": return labels.statusRequiresUpdate;
    case "published": return labels.statusPublished;
    case "restricted": return labels.statusRestricted;
    case "archived": return labels.statusArchived;
    default: return status;
  }
}
