import { Suspense } from "react";
import PlatformSupportCenterPanel from "@/components/platform/support-center/PlatformSupportCenterPanel";
import type { SupportCenterLabels } from "@/components/platform/support-center/support-center-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

function buildSupportCenterLabels(t: (key: string) => string): SupportCenterLabels {
  const statusKeys = [
    "new",
    "open",
    "in_progress",
    "waiting_for_customer",
    "waiting_internal",
    "resolved",
    "closed",
    "reopened",
    "archived",
  ] as const;
  const priorityKeys = ["low", "normal", "high", "critical", "urgent"] as const;
  const categoryKeys = [
    "general",
    "onboarding",
    "billing",
    "technical",
    "business_packs",
    "security",
    "feedback",
    "bug",
  ] as const;
  const channelKeys = [
    "app_portal",
    "email",
    "chat",
    "phone",
    "assistant",
  ] as const;

  const statusLabels: Record<string, string> = {};
  for (const key of statusKeys) {
    statusLabels[key] = t(`platform.supportCenter.statusLabels.${key}`);
  }
  const priorityLabels: Record<string, string> = {};
  for (const key of priorityKeys) {
    priorityLabels[key] = t(`platform.supportCenter.priorityLabels.${key}`);
  }
  const categoryLabels: Record<string, string> = {};
  for (const key of categoryKeys) {
    categoryLabels[key] = t(`platform.supportCenter.categoryLabels.${key}`);
  }
  const channelLabels: Record<string, string> = {};
  for (const key of channelKeys) {
    channelLabels[key] = t(`platform.supportCenter.channelLabels.${key}`);
  }

  return {
    title: t("platform.supportCenter.title"),
    subtitle: t("platform.supportCenter.subtitle"),
    loading: t("platform.supportCenter.loading"),
    empty: t("platform.supportCenter.empty"),
    emptyCoreBlocked: t("platform.supportCenter.emptyCoreBlocked"),
    coreBlockedTitle: t("platform.supportCenter.coreBlockedTitle"),
    coreBlockedBody: t("platform.supportCenter.coreBlockedBody"),
    legacyKpiRemoved: t("platform.supportCenter.legacyKpiRemoved"),
    customer: t("platform.supportCenter.customer"),
    category: t("platform.supportCenter.category"),
    priority: t("platform.supportCenter.priority"),
    assignee: t("platform.supportCenter.assignee"),
    lastUpdated: t("platform.supportCenter.lastUpdated"),
    subject: t("platform.supportCenter.subject"),
    reference: t("platform.supportCenter.reference"),
    channel: t("platform.supportCenter.channel"),
    product: t("platform.supportCenter.product"),
    status: t("platform.supportCenter.status"),
    unassigned: t("platform.supportCenter.unassigned"),
    openTicket: t("platform.supportCenter.openTicket"),
    viewCustomer: t("platform.supportCenter.viewCustomer"),
    pulseLabel: t("branding.pulseLabel"),
    refresh: t("platform.supportCenter.refresh"),
    filterAll: t("platform.supportCenter.filterAll"),
    tabAll: t("platform.supportCenter.tabs.all"),
    tabMine: t("platform.supportCenter.tabs.mine"),
    tabTemplates: t("platform.supportCenter.tabs.templates"),
    tabSignature: t("platform.supportCenter.tabs.signature"),
    tabChannels: t("platform.supportCenter.tabs.channels"),
    tabsAria: t("platform.supportCenter.tabs.aria"),
    kpiNew: t("platform.supportCenter.kpi.new"),
    kpiInProgress: t("platform.supportCenter.kpi.inProgress"),
    kpiWaiting: t("platform.supportCenter.kpi.waiting"),
    kpiCritical: t("platform.supportCenter.kpi.critical"),
    kpiResolved: t("platform.supportCenter.kpi.resolved"),
    kpiUnavailable: t("platform.supportCenter.kpi.unavailable"),
    kpiSourceNote: t("platform.supportCenter.kpi.sourceNote"),
    statusLabels,
    categoryLabels,
    priorityLabels,
    channelLabels,
    templates: {
      title: t("platform.supportCenter.templates.title"),
      subtitle: t("platform.supportCenter.templates.subtitle"),
      starterBadge: t("platform.supportCenter.templates.starterBadge"),
      preview: t("platform.supportCenter.templates.preview"),
      insertDraft: t("platform.supportCenter.templates.insertDraft"),
      persistBlocked: t("platform.supportCenter.templates.persistBlocked"),
      variables: t("platform.supportCenter.templates.variables"),
      localeNote: t("platform.supportCenter.templates.localeNote"),
      category: t("platform.supportCenter.templates.category"),
      subject: t("platform.supportCenter.templates.subject"),
      body: t("platform.supportCenter.templates.body"),
    },
    signature: {
      title: t("platform.supportCenter.signature.title"),
      subtitle: t("platform.supportCenter.signature.subtitle"),
      displayName: t("platform.supportCenter.signature.displayName"),
      agentName: t("platform.supportCenter.signature.agentName"),
      agentTitle: t("platform.supportCenter.signature.agentTitle"),
      companyName: t("platform.supportCenter.signature.companyName"),
      website: t("platform.supportCenter.signature.website"),
      supportEmail: t("platform.supportCenter.signature.supportEmail"),
      phone: t("platform.supportCenter.signature.phone"),
      address: t("platform.supportCenter.signature.address"),
      includeLogo: t("platform.supportCenter.signature.includeLogo"),
      active: t("platform.supportCenter.signature.active"),
      previewLight: t("platform.supportCenter.signature.previewLight"),
      previewDark: t("platform.supportCenter.signature.previewDark"),
      previewText: t("platform.supportCenter.signature.previewText"),
      persistBlocked: t("platform.supportCenter.signature.persistBlocked"),
      resetDefaults: t("platform.supportCenter.signature.resetDefaults"),
    },
    channels: {
      title: t("platform.supportCenter.channels.title"),
      subtitle: t("platform.supportCenter.channels.subtitle"),
      active: t("platform.supportCenter.channels.active"),
      notActivated: t("platform.supportCenter.channels.notActivated"),
      preparedOnly: t("platform.supportCenter.channels.preparedOnly"),
      web: t("platform.supportCenter.channels.web"),
      webNote: t("platform.supportCenter.channels.webNote"),
      app: t("platform.supportCenter.channels.app"),
      appNote: t("platform.supportCenter.channels.appNote"),
      partner: t("platform.supportCenter.channels.partner"),
      partnerNote: t("platform.supportCenter.channels.partnerNote"),
      module: t("platform.supportCenter.channels.module"),
      moduleNote: t("platform.supportCenter.channels.moduleNote"),
      kompis: t("platform.supportCenter.channels.kompis"),
      kompisNote: t("platform.supportCenter.channels.kompisNote"),
      emailSendBlocked: t("platform.supportCenter.channels.emailSendBlocked"),
    },
    reply: {
      title: t("platform.supportCenter.reply.title"),
      draft: t("platform.supportCenter.reply.draft"),
      chooseTemplate: t("platform.supportCenter.reply.chooseTemplate"),
      preview: t("platform.supportCenter.reply.preview"),
      send: t("platform.supportCenter.reply.send"),
      sendBlocked: t("platform.supportCenter.reply.sendBlocked"),
      internalNote: t("platform.supportCenter.reply.internalNote"),
      attachSignature: t("platform.supportCenter.reply.attachSignature"),
    },
    detail: {
      title: t("platform.supportCenter.detail.title"),
      timeline: t("platform.supportCenter.detail.timeline"),
      internalNotes: t("platform.supportCenter.detail.internalNotes"),
      noMessages: t("platform.supportCenter.detail.noMessages"),
      messagesBlocked: t("platform.supportCenter.detail.messagesBlocked"),
      back: t("platform.supportCenter.detail.back"),
    },
  };
}

export default async function PlatformSupportPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform", "branding"]);
  const t = createTranslator(dict);

  return (
    <Suspense
      fallback={
        <p className="text-sm text-[color:var(--aipify-text-secondary)]">
          {t("platform.supportCenter.loading")}
        </p>
      }
    >
      <PlatformSupportCenterPanel
        locale={locale}
        labels={buildSupportCenterLabels(t)}
      />
    </Suspense>
  );
}
