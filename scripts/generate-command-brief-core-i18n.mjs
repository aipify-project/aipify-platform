#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const repoRoot = path.join(import.meta.dirname, "..");

const SIGNAL_KEYS = [
  "activity_change",
  "new_members",
  "reward_milestone",
  "pending_moderation",
  "reports_requiring_attention",
  "listing_review",
  "new_lead",
  "lead_without_follow_up",
  "recommended_follow_up",
  "deal_status_change",
  "sales_target_deviation",
  "customer_health_warning",
  "churn_risk",
  "conversion_deviation",
  "overdue_invoice",
  "subscription_change",
  "forecast_warning",
  "revenue_deviation",
  "payment_failure",
  "payout_attention",
  "reconciliation_issue",
  "verification_pending",
  "access_review_required",
  "security_incident",
  "failed_login_2fa_issue",
  "expiring_certificate",
  "compliance_attention",
  "unresolved_risk_signal",
  "permission_anomaly",
  "onboarding_in_progress",
  "absence_upcoming",
  "expiring_certifications",
  "training_pending",
  "pending_invitations",
  "performance_reviews",
  "low_stock",
  "delayed_receipt",
  "transfer_in_progress",
  "inventory_discrepancy",
  "replenishment_required",
  "unresolved_support_case",
  "sla_risk",
  "escalation_required",
];

function humanize(key) {
  return key.replace(/_/g, " ");
}

const LOCALE_BLOCKS = {
  en: {
    sections: {
      requiresAttention: {
        title: "Requires attention",
        emptyTitle: "Nothing requires attention right now",
        emptyExplanation: "Aipify found no unresolved operational signals from connected sources.",
        emptyAction: "Review Command Brief later",
      },
      sinceLast: {
        title: "Since last visit",
        emptyTitle: "No new events since your last visit",
        emptyExplanation: "Connected sources reported no new Command Brief events since your last login or brief view.",
        emptyAction: "Open activity overview",
      },
      completedByAipify: {
        title: "Aipify completed",
        emptyTitle: "No recent Aipify completions",
        emptyExplanation: "Aipify has not recorded completed brief actions since your last visit.",
        emptyAction: "View recommendations",
      },
      opportunities: {
        title: "Opportunities",
        emptyTitle: "No new opportunities",
        emptyExplanation: "Connected sources have not reported new growth or opportunity signals.",
        emptyAction: "Explore analytics",
      },
      recommendedNextSteps: {
        title: "Recommended next steps",
        emptyTitle: "No recommended next steps",
        emptyExplanation: "Aipify has no additional recommended actions from connected sources right now.",
        emptyAction: "Ask Aipify Companion",
      },
    },
    actions: {
      openDetails: "Open details",
      viewDetails: "View details",
      createTask: "Create task",
    },
    warnings: {
      partialSource: "This signal uses partial source metadata — review before acting.",
      sourceMissing: "No live source is connected for this signal.",
    },
    freshness: {
      fresh: "Fresh",
      stale: "May be outdated",
      unknown: "Unknown freshness",
    },
    sinceLast: {
      labelLastLogin: "Since your last login",
      labelLastView: "Since your last Command Brief visit",
    },
    signals: {
      generic: {
        title: "Operational signal detected",
        summary: "Aipify detected an event from a connected source.",
      },
    },
    signalTitle: (key) => `${humanize(key).replace(/\b\w/g, (c) => c.toUpperCase())} needs review`,
    signalSummary: (key) => `Connected sources reported ${humanize(key)} activity.`,
  },
  no: {
    sections: {
      requiresAttention: {
        title: "Krever oppmerksomhet",
        emptyTitle: "Ingenting krever oppmerksomhet akkurat nå",
        emptyExplanation: "Aipify fant ingen uløste operative signaler fra tilkoblede kilder.",
        emptyAction: "Se Command Brief senere",
      },
      sinceLast: {
        title: "Siden sist",
        emptyTitle: "Ingen nye hendelser siden sist besøk",
        emptyExplanation: "Tilkoblede kilder rapporterte ingen nye Command Brief-hendelser siden siste innlogging eller brief-visning.",
        emptyAction: "Åpne aktivitetsoversikt",
      },
      completedByAipify: {
        title: "Aipify har fullført",
        emptyTitle: "Ingen nylige Aipify-fullføringer",
        emptyExplanation: "Aipify har ikke registrert fullførte brief-handlinger siden sist besøk.",
        emptyAction: "Se anbefalinger",
      },
      opportunities: {
        title: "Muligheter",
        emptyTitle: "Ingen nye muligheter",
        emptyExplanation: "Tilkoblede kilder har ikke rapportert nye vekst- eller mulighetssignaler.",
        emptyAction: "Utforsk analyse",
      },
      recommendedNextSteps: {
        title: "Anbefalte neste steg",
        emptyTitle: "Ingen anbefalte neste steg",
        emptyExplanation: "Aipify har ingen ytterligere anbefalte handlinger fra tilkoblede kilder akkurat nå.",
        emptyAction: "Spør Aipify Companion",
      },
    },
    actions: {
      openDetails: "Åpne detaljer",
      viewDetails: "Vis detaljer",
      createTask: "Opprett oppgave",
    },
    warnings: {
      partialSource: "Dette signalet bruker delvis kilde-metadata — gjennomgå før handling.",
      sourceMissing: "Ingen live-kilde er koblet for dette signalet.",
    },
    freshness: {
      fresh: "Fersk",
      stale: "Kan være utdatert",
      unknown: "Ukjent ferskhet",
    },
    sinceLast: {
      labelLastLogin: "Siden siste innlogging",
      labelLastView: "Siden siste Command Brief-besøk",
    },
    signals: {
      generic: {
        title: "Operativt signal oppdaget",
        summary: "Aipify oppdaget en hendelse fra en tilkoblet kilde.",
      },
    },
    signalTitle: (key) => `${humanize(key)} krever gjennomgang`,
    signalSummary: (key) => `Tilkoblede kilder rapporterte ${humanize(key)}.`,
  },
  sv: {
    sections: {
      requiresAttention: {
        title: "Kräver uppmärksamhet",
        emptyTitle: "Inget kräver uppmärksamhet just nu",
        emptyExplanation: "Aipify hittade inga olösta operativa signaler från anslutna källor.",
        emptyAction: "Granska Command Brief senare",
      },
      sinceLast: {
        title: "Sedan senast",
        emptyTitle: "Inga nya händelser sedan senaste besöket",
        emptyExplanation: "Anslutna källor rapporterade inga nya Command Brief-händelser sedan senaste inloggning eller brief-visning.",
        emptyAction: "Öppna aktivitetsöversikt",
      },
      completedByAipify: {
        title: "Aipify har slutfört",
        emptyTitle: "Inga nyliga Aipify-slutföranden",
        emptyExplanation: "Aipify har inte registrerat slutförda brief-åtgärder sedan senaste besöket.",
        emptyAction: "Visa rekommendationer",
      },
      opportunities: {
        title: "Möjligheter",
        emptyTitle: "Inga nya möjligheter",
        emptyExplanation: "Anslutna källor har inte rapporterat nya tillväxt- eller möjlighetssignaler.",
        emptyAction: "Utforska analys",
      },
      recommendedNextSteps: {
        title: "Rekommenderade nästa steg",
        emptyTitle: "Inga rekommenderade nästa steg",
        emptyExplanation: "Aipify har inga ytterligare rekommenderade åtgärder från anslutna källor just nu.",
        emptyAction: "Fråga Aipify Companion",
      },
    },
    actions: {
      openDetails: "Öppna detaljer",
      viewDetails: "Visa detaljer",
      createTask: "Skapa uppgift",
    },
    warnings: {
      partialSource: "Denna signal använder partiell källmetadata — granska före åtgärd.",
      sourceMissing: "Ingen live-källa är ansluten för denna signal.",
    },
    freshness: {
      fresh: "Färsk",
      stale: "Kan vara inaktuell",
      unknown: "Okänd färskhet",
    },
    sinceLast: {
      labelLastLogin: "Sedan senaste inloggning",
      labelLastView: "Sedan senaste Command Brief-besök",
    },
    signals: { generic: { title: "Operativ signal upptäckt", summary: "Aipify upptäckte en händelse från en ansluten källa." } },
    signalTitle: (key) => `${humanize(key)} kräver granskning`,
    signalSummary: (key) => `Anslutna källor rapporterade ${humanize(key)}.`,
  },
  da: {
    sections: {
      requiresAttention: {
        title: "Kræver opmærksomhed",
        emptyTitle: "Intet kræver opmærksomhed lige nu",
        emptyExplanation: "Aipify fandt ingen uløste operationelle signaler fra tilsluttede kilder.",
        emptyAction: "Gennemgå Command Brief senere",
      },
      sinceLast: {
        title: "Siden sidst",
        emptyTitle: "Ingen nye hændelser siden sidste besøg",
        emptyExplanation: "Tilsluttede kilder rapporterede ingen nye Command Brief-hændelser siden sidste login eller brief-visning.",
        emptyAction: "Åbn aktivitetsoversigt",
      },
      completedByAipify: {
        title: "Aipify har fuldført",
        emptyTitle: "Ingen nylige Aipify-fuldførelser",
        emptyExplanation: "Aipify har ikke registreret fuldførte brief-handlinger siden sidste besøg.",
        emptyAction: "Se anbefalinger",
      },
      opportunities: {
        title: "Muligheder",
        emptyTitle: "Ingen nye muligheder",
        emptyExplanation: "Tilsluttede kilder har ikke rapporteret nye vækst- eller mulighedssignaler.",
        emptyAction: "Udforsk analyse",
      },
      recommendedNextSteps: {
        title: "Anbefalede næste trin",
        emptyTitle: "Ingen anbefalede næste trin",
        emptyExplanation: "Aipify har ingen yderligere anbefalede handlinger fra tilsluttede kilder lige nu.",
        emptyAction: "Spørg Aipify Companion",
      },
    },
    actions: {
      openDetails: "Åbn detaljer",
      viewDetails: "Vis detaljer",
      createTask: "Opret opgave",
    },
    warnings: {
      partialSource: "Dette signal bruger delvis kilde-metadata — gennemgå før handling.",
      sourceMissing: "Ingen live-kilde er tilsluttet for dette signal.",
    },
    freshness: {
      fresh: "Frisk",
      stale: "Kan være forældet",
      unknown: "Ukendt friskhed",
    },
    sinceLast: {
      labelLastLogin: "Siden sidste login",
      labelLastView: "Siden sidste Command Brief-besøg",
    },
    signals: { generic: { title: "Operationelt signal registreret", summary: "Aipify registrerede en hændelse fra en tilsluttet kilde." } },
    signalTitle: (key) => `${humanize(key)} kræver gennemgang`,
    signalSummary: (key) => `Tilsluttede kilder rapporterede ${humanize(key)}.`,
  },
  es: {
    sections: {
      requiresAttention: {
        title: "Requiere atención",
        emptyTitle: "Nada requiere atención ahora",
        emptyExplanation: "Aipify no encontró señales operativas sin resolver de fuentes conectadas.",
        emptyAction: "Revisar Command Brief más tarde",
      },
      sinceLast: {
        title: "Desde la última visita",
        emptyTitle: "No hay eventos nuevos desde su última visita",
        emptyExplanation: "Las fuentes conectadas no reportaron nuevos eventos de Command Brief desde su último inicio de sesión o vista del brief.",
        emptyAction: "Abrir resumen de actividad",
      },
      completedByAipify: {
        title: "Aipify completó",
        emptyTitle: "No hay finalizaciones recientes de Aipify",
        emptyExplanation: "Aipify no ha registrado acciones completadas del brief desde su última visita.",
        emptyAction: "Ver recomendaciones",
      },
      opportunities: {
        title: "Oportunidades",
        emptyTitle: "No hay nuevas oportunidades",
        emptyExplanation: "Las fuentes conectadas no han reportado nuevas señales de crecimiento u oportunidad.",
        emptyAction: "Explorar analítica",
      },
      recommendedNextSteps: {
        title: "Próximos pasos recomendados",
        emptyTitle: "No hay próximos pasos recomendados",
        emptyExplanation: "Aipify no tiene acciones recomendadas adicionales de fuentes conectadas en este momento.",
        emptyAction: "Preguntar a Aipify Companion",
      },
    },
    actions: {
      openDetails: "Abrir detalles",
      viewDetails: "Ver detalles",
      createTask: "Crear tarea",
    },
    warnings: {
      partialSource: "Esta señal usa metadatos parciales de la fuente — revísela antes de actuar.",
      sourceMissing: "No hay una fuente live conectada para esta señal.",
    },
    freshness: {
      fresh: "Reciente",
      stale: "Puede estar desactualizada",
      unknown: "Frescura desconocida",
    },
    sinceLast: {
      labelLastLogin: "Desde su último inicio de sesión",
      labelLastView: "Desde su última visita a Command Brief",
    },
    signals: { generic: { title: "Señal operativa detectada", summary: "Aipify detectó un evento de una fuente conectada." } },
    signalTitle: (key) => `${humanize(key)} requiere revisión`,
    signalSummary: (key) => `Las fuentes conectadas reportaron ${humanize(key)}.`,
  },
  pl: {
    sections: {
      requiresAttention: {
        title: "Wymaga uwagi",
        emptyTitle: "Nic nie wymaga uwagi teraz",
        emptyExplanation: "Aipify nie znalazł nierozwiązanych sygnałów operacyjnych z podłączonych źródeł.",
        emptyAction: "Przejrzyj Command Brief później",
      },
      sinceLast: {
        title: "Od ostatniej wizyty",
        emptyTitle: "Brak nowych zdarzeń od ostatniej wizyty",
        emptyExplanation: "Podłączone źródła nie zgłosiły nowych zdarzeń Command Brief od ostatniego logowania lub wyświetlenia briefu.",
        emptyAction: "Otwórz przegląd aktywności",
      },
      completedByAipify: {
        title: "Aipify ukończył",
        emptyTitle: "Brak ostatnich ukończeń Aipify",
        emptyExplanation: "Aipify nie zarejestrował ukończonych działań briefu od ostatniej wizyty.",
        emptyAction: "Zobacz rekomendacje",
      },
      opportunities: {
        title: "Możliwości",
        emptyTitle: "Brak nowych możliwości",
        emptyExplanation: "Podłączone źródła nie zgłosiły nowych sygnałów wzrostu lub możliwości.",
        emptyAction: "Eksploruj analitykę",
      },
      recommendedNextSteps: {
        title: "Zalecane następne kroki",
        emptyTitle: "Brak zalecanych następnych kroków",
        emptyExplanation: "Aipify nie ma dodatkowych zalecanych działań z podłączonych źródeł.",
        emptyAction: "Zapytaj Aipify Companion",
      },
    },
    actions: {
      openDetails: "Otwórz szczegóły",
      viewDetails: "Zobacz szczegóły",
      createTask: "Utwórz zadanie",
    },
    warnings: {
      partialSource: "Ten sygnał używa częściowych metadanych źródła — przejrzyj przed działaniem.",
      sourceMissing: "Brak podłączonego live źródła dla tego sygnału.",
    },
    freshness: {
      fresh: "Świeży",
      stale: "Może być nieaktualny",
      unknown: "Nieznana świeżość",
    },
    sinceLast: {
      labelLastLogin: "Od ostatniego logowania",
      labelLastView: "Od ostatniej wizyty w Command Brief",
    },
    signals: { generic: { title: "Wykryto sygnał operacyjny", summary: "Aipify wykrył zdarzenie z podłączonego źródła." } },
    signalTitle: (key) => `${humanize(key)} wymaga przeglądu`,
    signalSummary: (key) => `Podłączone źródła zgłosiły ${humanize(key)}.`,
  },
  uk: {
    sections: {
      requiresAttention: {
        title: "Потребує уваги",
        emptyTitle: "Зараз нічого не потребує уваги",
        emptyExplanation: "Aipify не знайшов нерозв'язаних операційних сигналів із підключених джерел.",
        emptyAction: "Переглянути Command Brief пізніше",
      },
      sinceLast: {
        title: "З моменту останнього візиту",
        emptyTitle: "Немає нових подій з моменту останнього візиту",
        emptyExplanation: "Підключені джерела не повідомили нових подій Command Brief з моменту останнього входу або перегляду brief.",
        emptyAction: "Відкрити огляд активності",
      },
      completedByAipify: {
        title: "Aipify завершив",
        emptyTitle: "Немає недавніх завершень Aipify",
        emptyExplanation: "Aipify не зафіксував завершених дій brief з моменту останнього візиту.",
        emptyAction: "Переглянути рекомендації",
      },
      opportunities: {
        title: "Можливості",
        emptyTitle: "Немає нових можливостей",
        emptyExplanation: "Підключені джерела не повідомили нових сигналів зростання чи можливостей.",
        emptyAction: "Дослідити аналітику",
      },
      recommendedNextSteps: {
        title: "Рекомендовані наступні кроки",
        emptyTitle: "Немає рекомендованих наступних кроків",
        emptyExplanation: "Aipify не має додаткових рекомендованих дій із підключених джерел зараз.",
        emptyAction: "Запитати Aipify Companion",
      },
    },
    actions: {
      openDetails: "Відкрити деталі",
      viewDetails: "Переглянути деталі",
      createTask: "Створити завдання",
    },
    warnings: {
      partialSource: "Цей сигнал використовує часткові метадані джерела — перегляньте перед дією.",
      sourceMissing: "Для цього сигналу не підключено live-джерело.",
    },
    freshness: {
      fresh: "Свіжий",
      stale: "Може бути застарілим",
      unknown: "Невідома свіжість",
    },
    sinceLast: {
      labelLastLogin: "З моменту останнього входу",
      labelLastView: "З моменту останнього перегляду Command Brief",
    },
    signals: { generic: { title: "Виявлено операційний сигнал", summary: "Aipify виявив подію з підключеного джерела." } },
    signalTitle: (key) => `${humanize(key)} потребує перегляду`,
    signalSummary: (key) => `Підключені джерела повідомили про ${humanize(key)}.`,
  },
};

for (const [locale, block] of Object.entries(LOCALE_BLOCKS)) {
  const signals = { ...block.signals };
  for (const key of SIGNAL_KEYS) {
    signals[key] = {
      title: block.signalTitle(key),
      summary: block.signalSummary(key),
    };
  }

  const commandBriefCore = {
    sections: block.sections,
    actions: block.actions,
    warnings: block.warnings,
    freshness: block.freshness,
    sinceLast: block.sinceLast,
    signals,
  };

  const filePath = path.join(repoRoot, `locales/${locale}/customer-app/companionPlatformKnowledge.json`);
  const json = JSON.parse(fs.readFileSync(filePath, "utf8"));
  json.companionPlatformKnowledge.commandBriefCore = commandBriefCore;
  fs.writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`);
  console.log(`Updated ${locale}`);
}
