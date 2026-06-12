export type PortalNoticeListSection = {
  id: string;
  titleKey: string;
  bodyKeys?: string[];
  listKeys?: string[];
};

export const SALES_EXPERT_PORTAL_NOTICE_SECTIONS: PortalNoticeListSection[] = [
  {
    id: "independent",
    titleKey: "portalNotice.independentBusinessTitle",
    bodyKeys: ["portalNotice.independentBusinessBody", "portalNotice.independentBusinessAck"],
  },
  {
    id: "starting",
    titleKey: "portalNotice.startingJourneyTitle",
    bodyKeys: [
      "portalNotice.startingJourneyExisting",
      "portalNotice.startingJourneyNew",
      "portalNotice.businessStructureExamples",
    ],
    listKeys: [
      "portalNotice.businessStructure1",
      "portalNotice.businessStructure2",
      "portalNotice.businessStructure3",
    ],
  },
  {
    id: "whyMatters",
    titleKey: "portalNotice.whyMattersTitle",
    listKeys: [
      "portalNotice.whyMatters1",
      "portalNotice.whyMatters2",
      "portalNotice.whyMatters3",
      "portalNotice.whyMatters4",
      "portalNotice.whyMatters5",
    ],
  },
  {
    id: "relationship",
    titleKey: "portalNotice.relationshipTitle",
    bodyKeys: ["portalNotice.aipifyManagesTitle", "portalNotice.expertsManageTitle"],
    listKeys: [
      "portalNotice.aipifyManages1",
      "portalNotice.aipifyManages2",
      "portalNotice.aipifyManages3",
      "portalNotice.aipifyManages4",
      "portalNotice.aipifyManages5",
      "portalNotice.expertsManage1",
      "portalNotice.expertsManage2",
      "portalNotice.expertsManage3",
      "portalNotice.expertsManage4",
      "portalNotice.expertsManage5",
    ],
  },
  {
    id: "opportunity",
    titleKey: "portalNotice.opportunityTitle",
    bodyKeys: [
      "portalNotice.opportunityBody",
      "portalNotice.opportunityOccasional",
      "portalNotice.opportunityFullTime",
      "portalNotice.opportunityWelcome",
    ],
  },
  {
    id: "expectations",
    titleKey: "portalNotice.expectationsTitle",
    listKeys: [
      "portalNotice.expectations1",
      "portalNotice.expectations2",
      "portalNotice.expectations3",
      "portalNotice.expectations4",
      "portalNotice.expectations5",
    ],
  },
];

export const SALES_EXPERT_PORTAL_NOTICE_STATIC_KEYS = [
  "portalNotice.badge",
  "portalNotice.title",
  "portalNotice.welcome",
  "portalNotice.intro",
  "portalNotice.consultAdvisors",
  "portalNotice.finalThoughtTitle",
  "portalNotice.finalThought1",
  "portalNotice.finalThought2",
  "portalNotice.finalThought3",
  "portalNotice.finalThoughtClosing",
] as const;

export function buildSalesExpertPortalNoticeLabels(
  t: (key: string) => string,
  prefix: string,
): Record<string, string> {
  const labels: Record<string, string> = {};
  for (const key of SALES_EXPERT_PORTAL_NOTICE_STATIC_KEYS) {
    labels[key] = t(`${prefix}.${key}`);
  }
  for (const section of SALES_EXPERT_PORTAL_NOTICE_SECTIONS) {
    labels[section.titleKey] = t(`${prefix}.${section.titleKey}`);
    for (const key of section.bodyKeys ?? []) {
      labels[key] = t(`${prefix}.${key}`);
    }
    for (const key of section.listKeys ?? []) {
      labels[key] = t(`${prefix}.${key}`);
    }
  }
  return labels;
}
