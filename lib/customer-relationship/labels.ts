import type { Translator } from "@/lib/i18n/translate";

export function buildCustomerRelationshipLabels(t: Translator) {
  const p = "customerApp.customerRelationship";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    accessDenied: t(`${p}.accessDenied`),
    overview: t(`${p}.overview`),
    customers: t(`${p}.customers`),
    contacts: t(`${p}.contacts`),
    organizations: t(`${p}.organizations`),
    leads: t(`${p}.leads`),
    relationships: t(`${p}.relationships`),
    communication: t(`${p}.communication`),
    documents: t(`${p}.documents`),
    reports: t(`${p}.reports`),
    totalCustomers: t(`${p}.totalCustomers`),
    activeCustomers: t(`${p}.activeCustomers`),
    prospects: t(`${p}.prospects`),
    requiresAttention: t(`${p}.requiresAttention`),
    openLeads: t(`${p}.openLeads`),
    followUpsDue: t(`${p}.followUpsDue`),
    createCustomer: t(`${p}.createCustomer`),
    createLead: t(`${p}.createLead`),
    customerName: t(`${p}.customerName`),
    companyName: t(`${p}.companyName`),
    email: t(`${p}.email`),
    phone: t(`${p}.phone`),
    addNote: t(`${p}.addNote`),
    followUpTask: t(`${p}.followUpTask`),
    searchPlaceholder: t(`${p}.searchPlaceholder`),
    search: t(`${p}.search`),
    noCustomers: t(`${p}.noCustomers`),
    noCustomersHint: t(`${p}.noCustomersHint`),
    auditLog: t(`${p}.auditLog`),
    leadsLink: t(`${p}.leadsLink`),
    backToCustomers: t(`${p}.backToCustomers`),
    leadsTitle: t(`${p}.leadsTitle`),
    pipeline: t(`${p}.pipeline`),
    convertLead: t(`${p}.convertLead`),
    updateStatus: t(`${p}.updateStatus`),
    companionInsights: t(`${p}.companionInsights`),
    save: t(`${p}.save`),
  };
}

export type CustomerRelationshipLabels = ReturnType<typeof buildCustomerRelationshipLabels>;
