/**
 * Localized Auth lifecycle emails (password reset + partner activation).
 * Extensible locale map — not a hard-coded seven-language ceiling in callers.
 */

export const AUTH_LIFECYCLE_EMAIL_LOCALES = ["en", "no", "sv", "da", "pl", "uk", "es"] as const;
export type AuthLifecycleEmailLocale = (typeof AUTH_LIFECYCLE_EMAIL_LOCALES)[number];

export type AuthLifecycleEmailKind = "password_reset" | "partner_activation";

export type AuthLifecycleEmailCopy = {
  subject: string;
  preheader: string;
  greeting: string;
  greetingAnonymous: string;
  paragraphs: string[];
  cta: string;
  footer: string;
  supportName: string;
};

const LOCALE_ALIASES: Readonly<Record<string, AuthLifecycleEmailLocale>> = {
  nb: "no",
  nn: "no",
};

export function resolveAuthLifecycleEmailLocale(value: unknown): AuthLifecycleEmailLocale {
  if (typeof value !== "string") return "en";
  const base = value.trim().toLowerCase().split(/[-_]/)[0] ?? "";
  const aliased = LOCALE_ALIASES[base] ?? base;
  return (AUTH_LIFECYCLE_EMAIL_LOCALES as readonly string[]).includes(aliased)
    ? (aliased as AuthLifecycleEmailLocale)
    : "en";
}

const COPY: Record<
  AuthLifecycleEmailLocale,
  Record<AuthLifecycleEmailKind, AuthLifecycleEmailCopy>
> = {
  en: {
    password_reset: {
      subject: "Reset your Aipify password",
      preheader: "Secure link to set a new password",
      greeting: "Hello {name},",
      greetingAnonymous: "Hello,",
      paragraphs: [
        "We received a request to reset the password for your Aipify account.",
        "Use the button below to choose a new password. The link works on any device and expires soon for your security.",
        "If you did not request this, you can ignore this email. Your password will stay the same.",
      ],
      cta: "Set a new password",
      footer: "You receive this email from Aipify Support because a password reset was requested for this address.",
      supportName: "Aipify Support",
    },
    partner_activation: {
      subject: "Activate your seller account",
      preheader: "Set your password and open the Seller panel",
      greeting: "Hello {name},",
      greetingAnonymous: "Hello,",
      paragraphs: [
        "Congratulations — your application has been approved. Welcome as a Certified Aipify Sales Partner.",
        "Activate your seller account to choose your own password, then open the Seller panel and start training in Aipify Academy.",
        "Personal sales links stay unavailable until you pass the relevant product certification. We never send passwords by email.",
      ],
      cta: "Activate my seller account",
      footer: "You receive this email because your Certified Aipify Sales Partner application was approved.",
      supportName: "Aipify Support",
    },
  },
  no: {
    password_reset: {
      subject: "Tilbakestill Aipify-passordet ditt",
      preheader: "Sikker lenke for å sette nytt passord",
      greeting: "Hei {name},",
      greetingAnonymous: "Hei,",
      paragraphs: [
        "Vi har mottatt en forespørsel om å tilbakestille passordet for Aipify-kontoen din.",
        "Bruk knappen nedenfor for å velge et nytt passord. Lenken fungerer på alle enheter og utløper snart av sikkerhetshensyn.",
        "Hvis du ikke ba om dette, kan du se bort fra e-posten. Passordet ditt forblir uendret.",
      ],
      cta: "Sett nytt passord",
      footer: "Du får denne e-posten fra Aipify Support fordi det er bedt om tilbakestilling for denne adressen.",
      supportName: "Aipify Support",
    },
    partner_activation: {
      subject: "Aktiver selgerkontoen din",
      preheader: "Sett passord og åpne Selgerpanelet",
      greeting: "Hei {name},",
      greetingAnonymous: "Hei,",
      paragraphs: [
        "Gratulerer – søknaden din er godkjent! Vi har gleden av å ønske deg velkommen som Certified Aipify Sales Partner.",
        "Aktiver selgerkontoen din for å velge ditt eget passord. Deretter åpner du Selgerpanelet og starter opplæringen i Aipify Academy.",
        "Personlige salgslenker blir tilgjengelige først når du har bestått den aktuelle produktsertifiseringen. Vi sender aldri passord på e-post.",
      ],
      cta: "Aktiver selgerkontoen min",
      footer: "Du får denne e-posten fordi søknaden din som Certified Aipify Sales Partner er godkjent.",
      supportName: "Aipify Support",
    },
  },
  sv: {
    password_reset: {
      subject: "Återställ ditt Aipify-lösenord",
      preheader: "Säker länk för att välja nytt lösenord",
      greeting: "Hej {name},",
      greetingAnonymous: "Hej,",
      paragraphs: [
        "Vi har tagit emot en begäran om att återställa lösenordet för ditt Aipify-konto.",
        "Använd knappen nedan för att välja ett nytt lösenord. Länken fungerar på alla enheter och går snart ut av säkerhetsskäl.",
        "Om du inte begärde detta kan du ignorera e-postmeddelandet. Ditt lösenord förblir oförändrat.",
      ],
      cta: "Välj nytt lösenord",
      footer: "Du får detta mejl från Aipify Support eftersom en återställning begärdes för den här adressen.",
      supportName: "Aipify Support",
    },
    partner_activation: {
      subject: "Aktivera ditt säljarkonto",
      preheader: "Välj lösenord och öppna Säljarpanelen",
      greeting: "Hej {name},",
      greetingAnonymous: "Hej,",
      paragraphs: [
        "Grattis – din ansökan är godkänd! Välkommen som Certified Aipify Sales Partner.",
        "Aktivera ditt säljarkonto för att välja ditt eget lösenord. Öppna sedan Säljarpanelen och börja utbildningen i Aipify Academy.",
        "Personliga säljlänkar blir tillgängliga först när du har klarat aktuell produktcertifiering. Vi skickar aldrig lösenord via e-post.",
      ],
      cta: "Aktivera mitt säljarkonto",
      footer: "Du får detta mejl eftersom din ansökan som Certified Aipify Sales Partner har godkänts.",
      supportName: "Aipify Support",
    },
  },
  da: {
    password_reset: {
      subject: "Nulstil din Aipify-adgangskode",
      preheader: "Sikkert link til at vælge ny adgangskode",
      greeting: "Hej {name},",
      greetingAnonymous: "Hej,",
      paragraphs: [
        "Vi har modtaget en anmodning om at nulstille adgangskoden til din Aipify-konto.",
        "Brug knappen nedenfor til at vælge en ny adgangskode. Linket virker på alle enheder og udløber snart af sikkerhedshensyn.",
        "Hvis du ikke har bedt om dette, kan du ignorere e-mailen. Din adgangskode forbliver uændret.",
      ],
      cta: "Vælg ny adgangskode",
      footer: "Du modtager denne e-mail fra Aipify Support, fordi der er anmodet om nulstilling for denne adresse.",
      supportName: "Aipify Support",
    },
    partner_activation: {
      subject: "Aktivér din sælgerkonto",
      preheader: "Vælg adgangskode og åbn Sælgerpanelet",
      greeting: "Hej {name},",
      greetingAnonymous: "Hej,",
      paragraphs: [
        "Tillykke – din ansøgning er godkendt! Velkommen som Certified Aipify Sales Partner.",
        "Aktivér din sælgerkonto for at vælge din egen adgangskode. Åbn derefter Sælgerpanelet og start træningen i Aipify Academy.",
        "Personlige salgslinks bliver først tilgængelige, når du har bestået den relevante produktcertificering. Vi sender aldrig adgangskoder på e-mail.",
      ],
      cta: "Aktivér min sælgerkonto",
      footer: "Du modtager denne e-mail, fordi din ansøgning som Certified Aipify Sales Partner er godkendt.",
      supportName: "Aipify Support",
    },
  },
  pl: {
    password_reset: {
      subject: "Zresetuj hasło Aipify",
      preheader: "Bezpieczny link do ustawienia nowego hasła",
      greeting: "Cześć {name},",
      greetingAnonymous: "Cześć,",
      paragraphs: [
        "Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta Aipify.",
        "Użyj przycisku poniżej, aby wybrać nowe hasło. Link działa na każdym urządzeniu i wkrótce wygaśnie ze względów bezpieczeństwa.",
        "Jeśli nie prosiłeś o tę zmianę, zignoruj tę wiadomość. Hasło pozostanie bez zmian.",
      ],
      cta: "Ustaw nowe hasło",
      footer: "Otrzymujesz tę wiadomość od Aipify Support, ponieważ zgłoszono reset hasła dla tego adresu.",
      supportName: "Aipify Support",
    },
    partner_activation: {
      subject: "Aktywuj konto sprzedawcy",
      preheader: "Ustaw hasło i otwórz Panel sprzedawcy",
      greeting: "Cześć {name},",
      greetingAnonymous: "Cześć,",
      paragraphs: [
        "Gratulacje — wniosek został zatwierdzony. Witamy jako Certified Aipify Sales Partner.",
        "Aktywuj konto sprzedawcy, aby wybrać własne hasło, a następnie otwórz Panel sprzedawcy i rozpocznij szkolenie w Aipify Academy.",
        "Osobiste linki sprzedażowe będą dostępne dopiero po zdaniu odpowiedniej certyfikacji produktowej. Nigdy nie wysyłamy haseł e-mailem.",
      ],
      cta: "Aktywuj moje konto sprzedawcy",
      footer: "Otrzymujesz tę wiadomość, ponieważ zatwierdzono Twój wniosek Certified Aipify Sales Partner.",
      supportName: "Aipify Support",
    },
  },
  uk: {
    password_reset: {
      subject: "Скиньте пароль Aipify",
      preheader: "Безпечне посилання для нового пароля",
      greeting: "Вітаємо, {name}!",
      greetingAnonymous: "Вітаємо!",
      paragraphs: [
        "Ми отримали запит на скидання пароля для вашого облікового запису Aipify.",
        "Натисніть кнопку нижче, щоб обрати новий пароль. Посилання працює на будь-якому пристрої та незабаром закінчиться з міркувань безпеки.",
        "Якщо ви не надсилали цей запит, просто проігноруйте лист. Пароль залишиться без змін.",
      ],
      cta: "Встановити новий пароль",
      footer: "Ви отримали цей лист від Aipify Support, бо для цієї адреси надіслано запит на скидання пароля.",
      supportName: "Aipify Support",
    },
    partner_activation: {
      subject: "Активуйте обліковий запис продавця",
      preheader: "Встановіть пароль і відкрийте Панель продавця",
      greeting: "Вітаємо, {name}!",
      greetingAnonymous: "Вітаємо!",
      paragraphs: [
        "Вітаємо — вашу заявку схвалено! Ласкаво просимо як Certified Aipify Sales Partner.",
        "Активуйте обліковий запис продавця, щоб обрати власний пароль, потім відкрийте Панель продавця та почніть навчання в Aipify Academy.",
        "Особисті посилання для продажу стануть доступні лише після проходження відповідної сертифікації продукту. Ми ніколи не надсилаємо паролі електронною поштою.",
      ],
      cta: "Активувати мій обліковий запис продавця",
      footer: "Ви отримали цей лист, бо схвалено вашу заявку Certified Aipify Sales Partner.",
      supportName: "Aipify Support",
    },
  },
  es: {
    password_reset: {
      subject: "Restablece tu contraseña de Aipify",
      preheader: "Enlace seguro para elegir una contraseña nueva",
      greeting: "Hola {name},",
      greetingAnonymous: "Hola,",
      paragraphs: [
        "Hemos recibido una solicitud para restablecer la contraseña de tu cuenta de Aipify.",
        "Usa el botón de abajo para elegir una contraseña nueva. El enlace funciona en cualquier dispositivo y caduca pronto por seguridad.",
        "Si no solicitaste esto, puedes ignorar este correo. Tu contraseña no cambiará.",
      ],
      cta: "Establecer una contraseña nueva",
      footer: "Recibes este correo de Aipify Support porque se solicitó un restablecimiento para esta dirección.",
      supportName: "Aipify Support",
    },
    partner_activation: {
      subject: "Activa tu cuenta de vendedor",
      preheader: "Elige contraseña y abre el Panel de vendedor",
      greeting: "Hola {name},",
      greetingAnonymous: "Hola,",
      paragraphs: [
        "Enhorabuena: tu solicitud ha sido aprobada. Bienvenido como Certified Aipify Sales Partner.",
        "Activa tu cuenta de vendedor para elegir tu propia contraseña; después abre el Panel de vendedor y empieza la formación en Aipify Academy.",
        "Los enlaces de venta personales estarán disponibles solo cuando apruebes la certificación del producto correspondiente. Nunca enviamos contraseñas por correo.",
      ],
      cta: "Activar mi cuenta de vendedor",
      footer: "Recibes este correo porque se aprobó tu solicitud de Certified Aipify Sales Partner.",
      supportName: "Aipify Support",
    },
  },
};

export function getAuthLifecycleEmailCopy(
  kind: AuthLifecycleEmailKind,
  locale: unknown,
): AuthLifecycleEmailCopy {
  const resolved = resolveAuthLifecycleEmailLocale(locale);
  return COPY[resolved][kind];
}
