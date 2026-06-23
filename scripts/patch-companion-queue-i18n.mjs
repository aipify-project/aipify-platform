#!/usr/bin/env node
/**
 * Adds companionExperience queue + role i18n keys to all core + es locales.
 */
import fs from "node:fs";
import path from "node:path";

const locales = ["en", "no", "sv", "da", "pl", "uk", "es"];

const patches = {
  en: {
    roleHeading: "Role",
    roles: {
      owner: "Owner",
      admin: "Admin",
      support: "Support",
      staff: "Staff",
      read_only: "Read only",
      manager: "Manager",
      moderator: "Moderator",
      growth_partner: "Growth Partner",
    },
    queue: {
      title: "Message queue",
      summary: "{count} waiting",
      statusWaiting: "Waiting",
      statusProcessing: "Processing",
      statusCompleted: "Completed",
      statusFailed: "Could not complete",
      statusCancelled: "Cancelled",
      cancel: "Cancel",
      retry: "Try again",
      notificationTitle: "Aipify has a reply ready",
      notificationBody: "Your Companion answer for “{question}” is ready.",
      restoreError: "Your previous conversation could not be restored. You can start a new one below.",
      syncError: "Aipify could not queue that message. Please try again.",
    },
  },
  no: {
    roleHeading: "Rolle",
    roles: {
      owner: "Eier",
      admin: "Administrator",
      support: "Support",
      staff: "Ansatt",
      read_only: "Kun lesing",
      manager: "Leder",
      moderator: "Moderator",
      growth_partner: "Vekstpartner",
    },
    queue: {
      title: "Meldingskø",
      summary: "{count} venter",
      statusWaiting: "Venter",
      statusProcessing: "Behandles",
      statusCompleted: "Fullført",
      statusFailed: "Kunne ikke fullføres",
      statusCancelled: "Avbrutt",
      cancel: "Avbryt",
      retry: "Prøv igjen",
      notificationTitle: "Aipify har et svar klart",
      notificationBody: "Companion-svaret ditt for «{question}» er klart.",
      restoreError: "Den forrige samtalen kunne ikke gjenopprettes. Du kan starte en ny nedenfor.",
      syncError: "Aipify kunne ikke legge meldingen i kø. Prøv igjen.",
    },
  },
  sv: {
    roleHeading: "Roll",
    roles: {
      owner: "Ägare",
      admin: "Administratör",
      support: "Support",
      staff: "Medarbetare",
      read_only: "Endast läsning",
      manager: "Chef",
      moderator: "Moderator",
      growth_partner: "Tillväxtpartner",
    },
    queue: {
      title: "Meddelandekö",
      summary: "{count} väntar",
      statusWaiting: "Väntar",
      statusProcessing: "Bearbetas",
      statusCompleted: "Slutförd",
      statusFailed: "Kunde inte slutföras",
      statusCancelled: "Avbruten",
      cancel: "Avbryt",
      retry: "Försök igen",
      notificationTitle: "Aipify har ett svar klart",
      notificationBody: "Ditt Companion-svar för ”{question}” är klart.",
      restoreError: "Din tidigare konversation kunde inte återställas. Du kan starta en ny nedan.",
      syncError: "Aipify kunde inte köa meddelandet. Försök igen.",
    },
  },
  da: {
    roleHeading: "Rolle",
    roles: {
      owner: "Ejer",
      admin: "Administrator",
      support: "Support",
      staff: "Medarbejder",
      read_only: "Kun læsning",
      manager: "Leder",
      moderator: "Moderator",
      growth_partner: "Vækstpartner",
    },
    queue: {
      title: "Beskedkø",
      summary: "{count} venter",
      statusWaiting: "Venter",
      statusProcessing: "Behandles",
      statusCompleted: "Fuldført",
      statusFailed: "Kunne ikke fuldføres",
      statusCancelled: "Annulleret",
      cancel: "Annuller",
      retry: "Prøv igen",
      notificationTitle: "Aipify har et svar klar",
      notificationBody: "Dit Companion-svar for ”{question}” er klar.",
      restoreError: "Din tidligere samtale kunne ikke gendannes. Du kan starte en ny nedenfor.",
      syncError: "Aipify kunne ikke sætte beskeden i kø. Prøv igen.",
    },
  },
  pl: {
    roleHeading: "Rola",
    roles: {
      owner: "Właściciel",
      admin: "Administrator",
      support: "Wsparcie",
      staff: "Pracownik",
      read_only: "Tylko odczyt",
      manager: "Menedżer",
      moderator: "Moderator",
      growth_partner: "Partner wzrostu",
    },
    queue: {
      title: "Kolejka wiadomości",
      summary: "{count} oczekuje",
      statusWaiting: "Oczekuje",
      statusProcessing: "Przetwarzanie",
      statusCompleted: "Ukończono",
      statusFailed: "Nie udało się ukończyć",
      statusCancelled: "Anulowano",
      cancel: "Anuluj",
      retry: "Spróbuj ponownie",
      notificationTitle: "Aipify ma gotową odpowiedź",
      notificationBody: "Odpowiedź Companion dla „{question}” jest gotowa.",
      restoreError: "Nie udało się przywrócić poprzedniej rozmowy. Możesz rozpocząć nową poniżej.",
      syncError: "Aipify nie mogło dodać wiadomości do kolejki. Spróbuj ponownie.",
    },
  },
  uk: {
    roleHeading: "Роль",
    roles: {
      owner: "Власник",
      admin: "Адміністратор",
      support: "Підтримка",
      staff: "Співробітник",
      read_only: "Лише перегляд",
      manager: "Керівник",
      moderator: "Модератор",
      growth_partner: "Партнер зі зростання",
    },
    queue: {
      title: "Черга повідомлень",
      summary: "{count} очікує",
      statusWaiting: "Очікує",
      statusProcessing: "Обробляється",
      statusCompleted: "Завершено",
      statusFailed: "Не вдалося завершити",
      statusCancelled: "Скасовано",
      cancel: "Скасувати",
      retry: "Спробувати знову",
      notificationTitle: "Aipify має готову відповідь",
      notificationBody: "Ваша відповідь Companion для «{question}» готова.",
      restoreError: "Попередню розмову не вдалося відновити. Ви можете почати нову нижче.",
      syncError: "Aipify не вдалося поставити повідомлення в чергу. Спробуйте ще раз.",
    },
  },
  es: {
    roleHeading: "Rol",
    roles: {
      owner: "Propietario",
      admin: "Administrador",
      support: "Soporte",
      staff: "Personal",
      read_only: "Solo lectura",
      manager: "Gerente",
      moderator: "Moderador",
      growth_partner: "Socio de crecimiento",
    },
    queue: {
      title: "Cola de mensajes",
      summary: "{count} en espera",
      statusWaiting: "En espera",
      statusProcessing: "Procesando",
      statusCompleted: "Completado",
      statusFailed: "No se pudo completar",
      statusCancelled: "Cancelado",
      cancel: "Cancelar",
      retry: "Reintentar",
      notificationTitle: "Aipify tiene una respuesta lista",
      notificationBody: "Tu respuesta de Companion para «{question}» está lista.",
      restoreError: "No se pudo restaurar la conversación anterior. Puedes iniciar una nueva abajo.",
      syncError: "Aipify no pudo poner el mensaje en cola. Inténtalo de nuevo.",
    },
  },
};

const root = process.cwd();

for (const locale of locales) {
  const filePath = path.join(root, "locales", locale, "customer-app", "companion.json");
  const raw = fs.readFileSync(filePath, "utf8");
  const json = JSON.parse(raw);
  const patch = patches[locale] ?? patches.en;
  Object.assign(json.companionExperience, patch);
  fs.writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`);
  console.log(`patched ${locale}`);
}
