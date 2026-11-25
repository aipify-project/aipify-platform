export const CSP_ONBOARDING_EMAIL_LOCALES = ["en", "no", "sv", "da", "pl", "uk", "es"] as const;
export type CspOnboardingEmailLocale = (typeof CSP_ONBOARDING_EMAIL_LOCALES)[number];

export const CSP_ONBOARDING_EMAIL_KINDS = [
  "application_received",
  "verify_email_nudge",
  "email_verified",
  "needs_information",
  "approved",
  "rejected",
  "certificate_awarded",
  /** Platform Admin only — no applicant PII beyond name/country/short reference. */
  "admin_new_application",
] as const;
export type CspOnboardingEmailKind = (typeof CSP_ONBOARDING_EMAIL_KINDS)[number];

export type CspOnboardingEmailKindCopy = {
  /** Used as email subject and heading. */
  subject: string;
  paragraphs: string[];
  cta: string;
};

export type CspOnboardingEmailLocaleCopy = {
  /** `{name}` is replaced when a display name is known. */
  greeting: string;
  greetingAnonymous: string;
  /** Appended when the account email is not verified yet. */
  unverifiedAddon: string;
  reasonLabel: string;
  statusLabel: string;
  statuses: { verified: string; approved: string; pending: string };
  footerNote: string;
  kinds: Record<CspOnboardingEmailKind, CspOnboardingEmailKindCopy>;
};

const no: CspOnboardingEmailLocaleCopy = {
  greeting: "Hei {name},",
  greetingAnonymous: "Hei,",
  unverifiedAddon:
    "Bekreft e-postadressen din via lenken vi har sendt deg. Finner du ikke e-posten, kontroller søppelpost eller be om en ny lenke.",
  reasonLabel: "Melding fra Aipify Group AS",
  statusLabel: "Status",
  statuses: { verified: "Verifisert", approved: "Godkjent", pending: "Til vurdering" },
  footerNote: "Du får denne e-posten fordi det er sendt en søknad med denne e-postadressen.",
  kinds: {
    application_received: {
      subject: "Søknaden din er mottatt",
      paragraphs: [
        "Takk for interessen for å bli Certified Aipify Sales Partner.",
        "Vi har mottatt søknaden din og vil gjennomgå opplysningene. Du får en e-post med informasjon om neste steg.",
      ],
      cta: "Åpne partnerportalen",
    },
    verify_email_nudge: {
      subject: "Bekreft e-postadressen din",
      paragraphs: [
        "Bekreft e-postadressen din via lenken vi har sendt deg.",
        "Finner du ikke e-posten, kontroller søppelpost eller be om en ny lenke.",
      ],
      cta: "Be om ny bekreftelseslenke",
    },
    email_verified: {
      subject: "E-postadressen din er bekreftet",
      paragraphs: [
        "Takk. E-postadressen din er nå bekreftet.",
        "Søknaden din er under behandling. Vi gir deg beskjed på e-post når vi har en oppdatering.",
      ],
      cta: "Åpne partnerportalen",
    },
    needs_information: {
      subject: "Vi trenger mer informasjon",
      paragraphs: [
        "Vi trenger litt mer informasjon for å kunne behandle søknaden din.",
        "Logg inn i partnerportalen, eller svar på denne e-posten, så følger vi opp.",
      ],
      cta: "Åpne partnerportalen",
    },
    approved: {
      subject: "Søknaden din er godkjent",
      paragraphs: [
        "Søknaden din er godkjent. Velkommen som Certified Aipify Sales Partner.",
        "Logg inn for å starte produktopplæringen. Du kan dele personlige salgslenker når du har bestått den aktuelle produktsertifiseringen.",
        "Bruk den samme e-postadressen du søkte med. Hvis du trenger å sette eller tilbakestille passord, bruk «Glemt passord» på innloggingssiden — vi sender aldri passord på e-post.",
      ],
      cta: "Logg inn som partner",
    },
    rejected: {
      subject: "Oppdatering om søknaden din",
      paragraphs: [
        "Takk for at du søkte om å bli Certified Aipify Sales Partner.",
        "Etter vurdering kan vi dessverre ikke gå videre med søknaden din nå.",
      ],
      cta: "Les mer hos Aipify",
    },
    certificate_awarded: {
      subject: "Sertifikatet ditt er utstedt",
      paragraphs: [
        "Gratulerer. Du har fullført opplæringen og eksamenen og er nå Certified Aipify Sales Partner.",
        "Sertifikatet finner du i partnerportalen.",
      ],
      cta: "Åpne partnerportalen",
    },
    admin_new_application: {
      subject: "Ny Certified Sales Partner-søknad",
      paragraphs: [
        "En ny søknad er mottatt og venter på gjennomgang i Platform Admin → Selgere → Partnere og godkjenning.",
        "Åpne oversikten for å se søknaden. Personlige detaljer er kun tilgjengelige i den autoriserte adminflaten.",
      ],
      cta: "Åpne Partnere og godkjenning",
    },
  },
};

const en: CspOnboardingEmailLocaleCopy = {
  greeting: "Hello {name},",
  greetingAnonymous: "Hello,",
  unverifiedAddon:
    "Your email address is not verified yet. Open the verification link we sent so you can sign in without problems.",
  reasonLabel: "Message from Aipify Group AS",
  statusLabel: "Status",
  statuses: { verified: "Verified", approved: "Approved", pending: "Pending review" },
  footerNote: "You are receiving this email because an application was submitted with this email address.",
  kinds: {
    application_received: {
      subject: "Your application has been received",
      paragraphs: [
        "Thank you for your interest in becoming a Certified Aipify Sales Partner with Aipify Group AS.",
        "We have received your application and are reviewing it. We will email you when the status changes. Applying is not a guarantee of approval.",
      ],
      cta: "Open the partner portal",
    },
    verify_email_nudge: {
      subject: "Verify your email address",
      paragraphs: [
        "We sent a verification link to your email address. Open the link to confirm the address is yours.",
        "If you cannot find the email, check your spam folder or request a new link.",
      ],
      cta: "Request a new verification link",
    },
    email_verified: {
      subject: "Your email address is verified",
      paragraphs: [
        "Thank you. Your email address is now verified.",
        "Aipify Group AS continues to review your application. We will let you know when the status changes.",
      ],
      cta: "Open the partner portal",
    },
    needs_information: {
      subject: "We need more information",
      paragraphs: [
        "We need a little more information to process your application.",
        "Sign in to the partner portal or reply to this email and we will follow up.",
      ],
      cta: "Open the partner portal",
    },
    approved: {
      subject: "Your application has been approved",
      paragraphs: [
        "Your application has been approved. Welcome as a Certified Aipify Sales Partner.",
        "Sign in to start product training. You can share personal sales links after you pass the relevant product certification.",
        "Use the same email address you applied with. To set or reset a password, use Forgot password on the sign-in page — we never email passwords.",
      ],
      cta: "Sign in as a partner",
    },
    rejected: {
      subject: "An update on your application",
      paragraphs: [
        "Thank you for applying to become a Certified Aipify Sales Partner.",
        "After review, we are unfortunately unable to move forward with your application at this time.",
      ],
      cta: "Learn more at Aipify",
    },
    certificate_awarded: {
      subject: "Your certificate has been awarded",
      paragraphs: [
        "Congratulations. You have completed the training and exam and are now a Certified Aipify Sales Partner.",
        "You can find your certificate in the partner portal.",
      ],
      cta: "Open the partner portal",
    },
    admin_new_application: {
      subject: "New Certified Sales Partner application",
      paragraphs: [
        "A new application was received and is waiting for review in Platform Admin → Sellers → Partners & approval.",
        "Open the directory to review the application. Personal details are only available in the authorized admin panel.",
      ],
      cta: "Open Partners & approval",
    },
  },
};

const sv: CspOnboardingEmailLocaleCopy = {
  greeting: "Hej {name},",
  greetingAnonymous: "Hej,",
  unverifiedAddon:
    "Din e-postadress är inte verifierad ännu. Öppna verifieringslänken vi skickade så att du kan logga in utan problem.",
  reasonLabel: "Meddelande från Aipify Group AS",
  statusLabel: "Status",
  statuses: { verified: "Verifierad", approved: "Godkänd", pending: "Under granskning" },
  footerNote: "Du får det här e-postmeddelandet eftersom en ansökan har skickats in med den här e-postadressen.",
  kinds: {
    application_received: {
      subject: "Din ansökan har tagits emot",
      paragraphs: [
        "Tack för ditt intresse för att bli Certified Aipify Sales Partner hos Aipify Group AS.",
        "Vi har tagit emot din ansökan och granskar den. Du får ett e-postmeddelande när statusen ändras. En ansökan är ingen garanti för godkännande.",
      ],
      cta: "Öppna partnerportalen",
    },
    verify_email_nudge: {
      subject: "Verifiera din e-postadress",
      paragraphs: [
        "Vi har skickat en verifieringslänk till din e-postadress. Öppna länken för att bekräfta att adressen är din.",
        "Hittar du inte e-postmeddelandet, kontrollera skräpposten eller begär en ny länk.",
      ],
      cta: "Begär en ny verifieringslänk",
    },
    email_verified: {
      subject: "Din e-postadress är verifierad",
      paragraphs: [
        "Tack. Din e-postadress är nu verifierad.",
        "Aipify Group AS fortsätter granska din ansökan. Vi meddelar dig när statusen ändras.",
      ],
      cta: "Öppna partnerportalen",
    },
    needs_information: {
      subject: "Vi behöver mer information",
      paragraphs: [
        "Vi behöver lite mer information för att kunna behandla din ansökan.",
        "Logga in i partnerportalen eller svara på det här meddelandet så följer vi upp.",
      ],
      cta: "Öppna partnerportalen",
    },
    approved: {
      subject: "Din ansökan är godkänd",
      paragraphs: [
        "Aipify Group AS har godkänt din ansökan.",
        "Logga in i partnerportalen för att starta akademin. Du blir certifierad först när utbildningen och provet är slutförda.",
      ],
      cta: "Logga in som partner",
    },
    rejected: {
      subject: "Besked om din ansökan",
      paragraphs: [
        "Tack för att du ansökte om att bli Certified Aipify Sales Partner.",
        "Efter granskning kan vi tyvärr inte gå vidare med din ansökan just nu.",
      ],
      cta: "Läs mer hos Aipify",
    },
    certificate_awarded: {
      subject: "Ditt certifikat har utfärdats",
      paragraphs: [
        "Grattis. Du har slutfört utbildningen och provet och är nu Certified Aipify Sales Partner.",
        "Du hittar ditt certifikat i partnerportalen.",
      ],
      cta: "Öppna partnerportalen",
    },
    admin_new_application: {
      subject: "Ny Certified Sales Partner-ansökan",
      paragraphs: [
        "En ny ansökan har mottagits och väntar på granskning i Platform Admin → Säljare → Partner och godkännande.",
        "Öppna översikten för att granska ansökan. Personuppgifter finns endast i den behöriga adminytan.",
      ],
      cta: "Öppna Partner och godkännande",
    },
  },
};

const da: CspOnboardingEmailLocaleCopy = {
  greeting: "Hej {name},",
  greetingAnonymous: "Hej,",
  unverifiedAddon:
    "Din e-mailadresse er endnu ikke bekræftet. Åbn bekræftelseslinket, vi har sendt, så du kan logge ind uden problemer.",
  reasonLabel: "Besked fra Aipify Group AS",
  statusLabel: "Status",
  statuses: { verified: "Bekræftet", approved: "Godkendt", pending: "Under behandling" },
  footerNote: "Du modtager denne e-mail, fordi der er indsendt en ansøgning med denne e-mailadresse.",
  kinds: {
    application_received: {
      subject: "Din ansøgning er modtaget",
      paragraphs: [
        "Tak for din interesse i at blive Certified Aipify Sales Partner hos Aipify Group AS.",
        "Vi har modtaget din ansøgning og behandler den. Du får besked på e-mail, når status ændres. En ansøgning er ikke en garanti for godkendelse.",
      ],
      cta: "Åbn partnerportalen",
    },
    verify_email_nudge: {
      subject: "Bekræft din e-mailadresse",
      paragraphs: [
        "Vi har sendt et bekræftelseslink til din e-mailadresse. Åbn linket for at bekræfte, at adressen er din.",
        "Kan du ikke finde e-mailen, så tjek spam-mappen eller bed om et nyt link.",
      ],
      cta: "Bed om et nyt bekræftelseslink",
    },
    email_verified: {
      subject: "Din e-mailadresse er bekræftet",
      paragraphs: [
        "Tak. Din e-mailadresse er nu bekræftet.",
        "Aipify Group AS behandler din ansøgning videre. Du får besked, når status ændres.",
      ],
      cta: "Åbn partnerportalen",
    },
    needs_information: {
      subject: "Vi har brug for flere oplysninger",
      paragraphs: [
        "Vi har brug for lidt flere oplysninger for at kunne behandle din ansøgning.",
        "Log ind i partnerportalen eller svar på denne e-mail, så følger vi op.",
      ],
      cta: "Åbn partnerportalen",
    },
    approved: {
      subject: "Din ansøgning er godkendt",
      paragraphs: [
        "Aipify Group AS har godkendt din ansøgning.",
        "Log ind i partnerportalen for at starte akademiet. Du bliver først certificeret, når uddannelsen og eksamen er gennemført.",
      ],
      cta: "Log ind som partner",
    },
    rejected: {
      subject: "Opdatering om din ansøgning",
      paragraphs: [
        "Tak fordi du søgte om at blive Certified Aipify Sales Partner.",
        "Efter vurdering kan vi desværre ikke gå videre med din ansøgning lige nu.",
      ],
      cta: "Læs mere hos Aipify",
    },
    certificate_awarded: {
      subject: "Dit certifikat er udstedt",
      paragraphs: [
        "Tillykke. Du har gennemført uddannelsen og eksamen og er nu Certified Aipify Sales Partner.",
        "Du finder dit certifikat i partnerportalen.",
      ],
      cta: "Åbn partnerportalen",
    },
    admin_new_application: {
      subject: "Ny Certified Sales Partner-ansøgning",
      paragraphs: [
        "En ny ansøgning er modtaget og venter på gennemgang i Platform Admin → Sælgere → Partnere og godkendelse.",
        "Åbn oversigten for at gennemgå ansøgningen. Personlige oplysninger er kun tilgængelige i den autoriserede adminflade.",
      ],
      cta: "Åbn Partnere og godkendelse",
    },
  },
};

const pl: CspOnboardingEmailLocaleCopy = {
  greeting: "Dzień dobry, {name},",
  greetingAnonymous: "Dzień dobry,",
  unverifiedAddon:
    "Twój adres e-mail nie został jeszcze zweryfikowany. Otwórz wysłany link weryfikacyjny, aby bez problemu się zalogować.",
  reasonLabel: "Wiadomość od Aipify Group AS",
  statusLabel: "Status",
  statuses: { verified: "Zweryfikowany", approved: "Zatwierdzony", pending: "W trakcie weryfikacji" },
  footerNote: "Otrzymujesz tę wiadomość, ponieważ z tego adresu e-mail złożono zgłoszenie.",
  kinds: {
    application_received: {
      subject: "Twoje zgłoszenie zostało przyjęte",
      paragraphs: [
        "Dziękujemy za zainteresowanie współpracą jako Certified Aipify Sales Partner w Aipify Group AS.",
        "Otrzymaliśmy Twoje zgłoszenie i je weryfikujemy. Powiadomimy Cię e-mailem o zmianie statusu. Złożenie zgłoszenia nie gwarantuje akceptacji.",
      ],
      cta: "Otwórz portal partnera",
    },
    verify_email_nudge: {
      subject: "Zweryfikuj swój adres e-mail",
      paragraphs: [
        "Wysłaliśmy link weryfikacyjny na Twój adres e-mail. Otwórz go, aby potwierdzić, że adres należy do Ciebie.",
        "Jeśli nie możesz znaleźć wiadomości, sprawdź folder spam lub poproś o nowy link.",
      ],
      cta: "Poproś o nowy link weryfikacyjny",
    },
    email_verified: {
      subject: "Twój adres e-mail został zweryfikowany",
      paragraphs: [
        "Dziękujemy. Twój adres e-mail został zweryfikowany.",
        "Aipify Group AS kontynuuje weryfikację Twojego zgłoszenia. Powiadomimy Cię o zmianie statusu.",
      ],
      cta: "Otwórz portal partnera",
    },
    needs_information: {
      subject: "Potrzebujemy więcej informacji",
      paragraphs: [
        "Potrzebujemy dodatkowych informacji, aby rozpatrzyć Twoje zgłoszenie.",
        "Zaloguj się do portalu partnera lub odpowiedz na tę wiadomość, a skontaktujemy się z Tobą.",
      ],
      cta: "Otwórz portal partnera",
    },
    approved: {
      subject: "Twoje zgłoszenie zostało zatwierdzone",
      paragraphs: [
        "Aipify Group AS zatwierdziło Twoje zgłoszenie.",
        "Zaloguj się do portalu partnera, aby rozpocząć akademię. Certyfikat otrzymasz dopiero po ukończeniu szkolenia i egzaminu.",
      ],
      cta: "Zaloguj się jako partner",
    },
    rejected: {
      subject: "Informacja o Twoim zgłoszeniu",
      paragraphs: [
        "Dziękujemy za zgłoszenie chęci zostania Certified Aipify Sales Partner.",
        "Po weryfikacji niestety nie możemy obecnie kontynuować Twojego zgłoszenia.",
      ],
      cta: "Dowiedz się więcej o Aipify",
    },
    certificate_awarded: {
      subject: "Twój certyfikat został wydany",
      paragraphs: [
        "Gratulacje. Ukończyłeś(-aś) szkolenie i egzamin i jesteś teraz Certified Aipify Sales Partner.",
        "Certyfikat znajdziesz w portalu partnera.",
      ],
      cta: "Otwórz portal partnera",
    },
    admin_new_application: {
      subject: "Nowa aplikacja Certified Sales Partner",
      paragraphs: [
        "Otrzymano nową aplikację oczekującą na przegląd w Platform Admin → Sprzedawcy → Partnerzy i zatwierdzanie.",
        "Otwórz listę, aby przejrzeć wniosek. Dane osobowe są dostępne tylko w autoryzowanym panelu administratora.",
      ],
      cta: "Otwórz Partnerzy i zatwierdzanie",
    },
  },
};

const uk: CspOnboardingEmailLocaleCopy = {
  greeting: "Вітаємо, {name},",
  greetingAnonymous: "Вітаємо,",
  unverifiedAddon:
    "Вашу адресу електронної пошти ще не підтверджено. Відкрийте надіслане посилання для підтвердження, щоб без проблем увійти.",
  reasonLabel: "Повідомлення від Aipify Group AS",
  statusLabel: "Статус",
  statuses: { verified: "Підтверджено", approved: "Схвалено", pending: "На розгляді" },
  footerNote: "Ви отримали цей лист, тому що з цієї адреси електронної пошти подано заявку.",
  kinds: {
    application_received: {
      subject: "Вашу заявку отримано",
      paragraphs: [
        "Дякуємо за інтерес до співпраці як Certified Aipify Sales Partner в Aipify Group AS.",
        "Ми отримали вашу заявку та розглядаємо її. Ми повідомимо вас електронною поштою, коли статус зміниться. Подання заявки не гарантує схвалення.",
      ],
      cta: "Відкрити портал партнера",
    },
    verify_email_nudge: {
      subject: "Підтвердьте свою адресу електронної пошти",
      paragraphs: [
        "Ми надіслали посилання для підтвердження на вашу адресу. Відкрийте його, щоб підтвердити, що адреса належить вам.",
        "Якщо ви не знаходите лист, перевірте папку зі спамом або запросіть нове посилання.",
      ],
      cta: "Запросити нове посилання",
    },
    email_verified: {
      subject: "Вашу адресу електронної пошти підтверджено",
      paragraphs: [
        "Дякуємо. Вашу адресу електронної пошти підтверджено.",
        "Aipify Group AS продовжує розглядати вашу заявку. Ми повідомимо, коли статус зміниться.",
      ],
      cta: "Відкрити портал партнера",
    },
    needs_information: {
      subject: "Нам потрібна додаткова інформація",
      paragraphs: [
        "Для розгляду вашої заявки нам потрібно трохи більше інформації.",
        "Увійдіть до порталу партнера або дайте відповідь на цей лист, і ми зв’яжемося з вами.",
      ],
      cta: "Відкрити портал партнера",
    },
    approved: {
      subject: "Вашу заявку схвалено",
      paragraphs: [
        "Aipify Group AS схвалило вашу заявку.",
        "Увійдіть до порталу партнера, щоб розпочати академію. Сертифікацію буде завершено лише після проходження навчання та іспиту.",
      ],
      cta: "Увійти як партнер",
    },
    rejected: {
      subject: "Оновлення щодо вашої заявки",
      paragraphs: [
        "Дякуємо, що подали заявку на статус Certified Aipify Sales Partner.",
        "Після розгляду ми, на жаль, не можемо продовжити роботу над вашою заявкою зараз.",
      ],
      cta: "Дізнатися більше про Aipify",
    },
    certificate_awarded: {
      subject: "Ваш сертифікат видано",
      paragraphs: [
        "Вітаємо. Ви пройшли навчання та іспит і тепер є Certified Aipify Sales Partner.",
        "Сертифікат доступний у порталі партнера.",
      ],
      cta: "Відкрити портал партнера",
    },
    admin_new_application: {
      subject: "Нова заявка Certified Sales Partner",
      paragraphs: [
        "Отримано нову заявку, яка очікує перегляду в Platform Admin → Продавці → Партнери та затвердження.",
        "Відкрийте список, щоб переглянути заявку. Особисті дані доступні лише в авторизованій адмін-панелі.",
      ],
      cta: "Відкрити Партнери та затвердження",
    },
  },
};

const es: CspOnboardingEmailLocaleCopy = {
  greeting: "Hola {name}:",
  greetingAnonymous: "Hola:",
  unverifiedAddon:
    "Tu correo electrónico aún no está verificado. Abre el enlace de verificación que te enviamos para poder iniciar sesión sin problemas.",
  reasonLabel: "Mensaje de Aipify Group AS",
  statusLabel: "Estado",
  statuses: { verified: "Verificado", approved: "Aprobado", pending: "En revisión" },
  footerNote: "Recibes este correo porque se envió una solicitud con esta dirección de correo electrónico.",
  kinds: {
    application_received: {
      subject: "Hemos recibido tu solicitud",
      paragraphs: [
        "Gracias por tu interés en convertirte en Certified Aipify Sales Partner con Aipify Group AS.",
        "Hemos recibido tu solicitud y la estamos revisando. Te avisaremos por correo cuando cambie el estado. Presentar la solicitud no garantiza la aprobación.",
      ],
      cta: "Abrir el portal de partners",
    },
    verify_email_nudge: {
      subject: "Verifica tu correo electrónico",
      paragraphs: [
        "Hemos enviado un enlace de verificación a tu correo. Ábrelo para confirmar que la dirección es tuya.",
        "Si no encuentras el mensaje, revisa la carpeta de spam o solicita un nuevo enlace.",
      ],
      cta: "Solicitar un nuevo enlace",
    },
    email_verified: {
      subject: "Tu correo electrónico está verificado",
      paragraphs: [
        "Gracias. Tu correo electrónico ya está verificado.",
        "Aipify Group AS sigue revisando tu solicitud. Te avisaremos cuando cambie el estado.",
      ],
      cta: "Abrir el portal de partners",
    },
    needs_information: {
      subject: "Necesitamos más información",
      paragraphs: [
        "Necesitamos un poco más de información para tramitar tu solicitud.",
        "Inicia sesión en el portal de partners o responde a este correo y haremos el seguimiento.",
      ],
      cta: "Abrir el portal de partners",
    },
    approved: {
      subject: "Tu solicitud ha sido aprobada",
      paragraphs: [
        "Aipify Group AS ha aprobado tu solicitud.",
        "Inicia sesión en el portal de partners para comenzar la academia. Quedarás certificado solo cuando completes la formación y el examen.",
      ],
      cta: "Iniciar sesión como partner",
    },
    rejected: {
      subject: "Novedades sobre tu solicitud",
      paragraphs: [
        "Gracias por solicitar ser Certified Aipify Sales Partner.",
        "Tras la revisión, lamentablemente no podemos continuar con tu solicitud por ahora.",
      ],
      cta: "Más información sobre Aipify",
    },
    certificate_awarded: {
      subject: "Tu certificado ha sido emitido",
      paragraphs: [
        "Enhorabuena. Has completado la formación y el examen y ahora eres Certified Aipify Sales Partner.",
        "Encontrarás tu certificado en el portal de partners.",
      ],
      cta: "Abrir el portal de partners",
    },
    admin_new_application: {
      subject: "Nueva solicitud de Certified Sales Partner",
      paragraphs: [
        "Se recibió una nueva solicitud pendiente de revisión en Platform Admin → Vendedores → Socios y aprobación.",
        "Abra el directorio para revisar la solicitud. Los datos personales solo están disponibles en el panel de administración autorizado.",
      ],
      cta: "Abrir Socios y aprobación",
    },
  },
};

export const CSP_ONBOARDING_EMAIL_COPY: Readonly<Record<CspOnboardingEmailLocale, CspOnboardingEmailLocaleCopy>> = {
  en,
  no,
  sv,
  da,
  pl,
  uk,
  es,
};

const LOCALE_ALIASES: Readonly<Record<string, CspOnboardingEmailLocale>> = { nb: "no", nn: "no" };

/** Maps `nb-NO`, `uk_UA`, `NO` etc. to a supported email locale; unknown values fall back to English. */
export function resolveCspOnboardingEmailLocale(value: unknown): CspOnboardingEmailLocale {
  if (typeof value !== "string") return "en";
  const base = value.trim().toLowerCase().split(/[-_]/)[0] ?? "";
  const aliased = LOCALE_ALIASES[base] ?? base;
  return (CSP_ONBOARDING_EMAIL_LOCALES as readonly string[]).includes(aliased)
    ? (aliased as CspOnboardingEmailLocale)
    : "en";
}
