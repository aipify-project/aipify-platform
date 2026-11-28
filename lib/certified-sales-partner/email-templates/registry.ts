import type {
  CspEmailLocalizedFields,
  CspEmailTemplateDefinition,
  CspEmailTemplateLocale,
} from "./types";

function L(
  en: CspEmailLocalizedFields,
  no: CspEmailLocalizedFields,
  sv: CspEmailLocalizedFields,
  da: CspEmailLocalizedFields,
  pl: CspEmailLocalizedFields,
  uk: CspEmailLocalizedFields,
  es: CspEmailLocalizedFields,
): Record<CspEmailTemplateLocale, CspEmailLocalizedFields> {
  return { en, no, sv, da, pl, uk, es };
}

const WEB_INTRO = L(
  {
    subject: "A short introduction to Buddy Web",
    preheader: "Website help based on content you approve.",
    body:
      "Hello,\n\n{{seller_display_name}} from {{seller_company}} would like to introduce Buddy Web — Aipify’s companion that answers visitor questions using content you have approved.\n\n{{product_description}}\n\nYou stay in control of what it can use. No invented claims or prices are included here.\n\nIf this is relevant, open the personal link below.",
    ctaLabel: "Learn more",
  },
  {
    subject: "En kort introduksjon til Kompis Web",
    preheader: "Nettsidehjelp basert på innhold du godkjenner.",
    body:
      "Hei,\n\n{{seller_display_name}} fra {{seller_company}} vil gjerne presentere Kompis Web — Aipifys løsning som svarer på besøkendes spørsmål med innhold du har godkjent.\n\n{{product_description}}\n\nDu beholder kontrollen over hva den kan bruke. Ingen priser eller resultatløfter er inkludert her.\n\nHvis dette er relevant, åpne den personlige lenken under.",
    ctaLabel: "Les mer",
  },
  {
    subject: "En kort introduktion till Kompis Web",
    preheader: "Webbhjälp baserad på innehåll du godkänner.",
    body:
      "Hej,\n\n{{seller_display_name}} från {{seller_company}} vill gärna presentera Kompis Web — Aipifys lösning som svarar på besökares frågor med innehåll du har godkänt.\n\n{{product_description}}\n\nDu behåller kontrollen över vad den får använda. Inga priser eller resultatlöften ingår här.\n\nOm detta är relevant, öppna den personliga länken nedan.",
    ctaLabel: "Läs mer",
  },
  {
    subject: "En kort introduktion til Kompis Web",
    preheader: "Websitehjælp baseret på indhold, du godkender.",
    body:
      "Hej,\n\n{{seller_display_name}} fra {{seller_company}} vil gerne præsentere Kompis Web — Aipifys løsning, der besvarer besøgendes spørgsmål med indhold, du har godkendt.\n\n{{product_description}}\n\nDu beholder kontrollen over, hvad den må bruge. Ingen priser eller resultatløfter er inkluderet her.\n\nHvis dette er relevant, åbn den personlige link nedenfor.",
    ctaLabel: "Læs mere",
  },
  {
    subject: "Krótkie wprowadzenie do Buddy Web",
    preheader: "Pomoc na stronie w oparciu o treści, które zatwierdzasz.",
    body:
      "Dzień dobry,\n\n{{seller_display_name}} z {{seller_company}} chciał(a)by przedstawić Buddy Web — rozwiązanie Aipify, które odpowiada na pytania odwiedzających na podstawie treści, które zatwierdzisz.\n\n{{product_description}}\n\nZachowujesz kontrolę nad tym, z czego może korzystać. Nie ma tu cen ani obietnic wyników.\n\nJeśli to jest istotne, otwórz osobisty link poniżej.",
    ctaLabel: "Dowiedz się więcej",
  },
  {
    subject: "Коротке знайомство з Buddy Web",
    preheader: "Допомога на сайті на основі матеріалів, які ви схвалюєте.",
    body:
      "Вітаємо,\n\n{{seller_display_name}} з {{seller_company}} хоче представити Buddy Web — рішення Aipify, яке відповідає на запитання відвідувачів на основі матеріалів, які ви схвалили.\n\n{{product_description}}\n\nВи зберігаєте контроль над тим, що він може використовувати. Тут немає цін і обіцянок результатів.\n\nЯкщо це актуально, відкрийте персональне посилання нижче.",
    ctaLabel: "Дізнатися більше",
  },
  {
    subject: "Una breve introducción a Buddy Web",
    preheader: "Ayuda en el sitio web con contenido que tú apruebas.",
    body:
      "Hola,\n\n{{seller_display_name}} de {{seller_company}} desea presentar Buddy Web — el companion de Aipify que responde a las preguntas de los visitantes con el contenido que hayas aprobado.\n\n{{product_description}}\n\nTú conservas el control de lo que puede usar. Aquí no se incluyen precios ni promesas de resultados.\n\nSi te resulta relevante, abre el enlace personal más abajo.",
    ctaLabel: "Más información",
  },
);

const WEB_FOLLOW = L(
  {
    subject: "Following up on Buddy Web",
    preheader: "A calm follow-up — no pressure.",
    body:
      "Hello,\n\nThis is a short follow-up from {{seller_display_name}} ({{seller_company}}) about Buddy Web.\n\nIf you have questions, reply to this email. {{seller_contact}}\n\nPersonal link:",
    ctaLabel: "Open link",
  },
  {
    subject: "Oppfølging om Kompis Web",
    preheader: "En rolig oppfølging — uten press.",
    body:
      "Hei,\n\nDette er en kort oppfølging fra {{seller_display_name}} ({{seller_company}}) om Kompis Web.\n\nHar du spørsmål, svar gjerne på denne e-posten. {{seller_contact}}\n\nPersonlig lenke:",
    ctaLabel: "Åpne lenke",
  },
  {
    subject: "Uppföljning om Kompis Web",
    preheader: "En lugn uppföljning — utan press.",
    body:
      "Hej,\n\nDetta är en kort uppföljning från {{seller_display_name}} ({{seller_company}}) om Kompis Web.\n\nHar du frågor, svara gärna på det här mejlet. {{seller_contact}}\n\nPersonlig länk:",
    ctaLabel: "Öppna länken",
  },
  {
    subject: "Opfølgning om Kompis Web",
    preheader: "En rolig opfølgning — uden pres.",
    body:
      "Hej,\n\nDette er en kort opfølgning fra {{seller_display_name}} ({{seller_company}}) om Kompis Web.\n\nHar du spørgsmål, så svar gerne på denne e-mail. {{seller_contact}}\n\nPersonligt link:",
    ctaLabel: "Åbn link",
  },
  {
    subject: "Kontynuacja w sprawie Buddy Web",
    preheader: "Spokojna kontynuacja — bez nacisku.",
    body:
      "Dzień dobry,\n\nTo krótka kontynuacja od {{seller_display_name}} ({{seller_company}}) w sprawie Buddy Web.\n\nJeśli masz pytania, odpowiedz na tę wiadomość. {{seller_contact}}\n\nOsobisty link:",
    ctaLabel: "Otwórz link",
  },
  {
    subject: "Продовження щодо Buddy Web",
    preheader: "Спокійне продовження — без тиску.",
    body:
      "Вітаємо,\n\nЦе коротке продовження від {{seller_display_name}} ({{seller_company}}) щодо Buddy Web.\n\nЯкщо маєте запитання, просто відповідайте на цей лист. {{seller_contact}}\n\nПерсональне посилання:",
    ctaLabel: "Відкрити посилання",
  },
  {
    subject: "Seguimiento sobre Buddy Web",
    preheader: "Un seguimiento calmado — sin presión.",
    body:
      "Hola,\n\nEste es un breve seguimiento de {{seller_display_name}} ({{seller_company}}) sobre Buddy Web.\n\nSi tienes preguntas, responde a este correo. {{seller_contact}}\n\nEnlace personal:",
    ctaLabel: "Abrir enlace",
  },
);

const WEB_MEET = L(
  {
    subject: "Would a short meeting about Buddy Web help?",
    preheader: "Optional meeting request — you decide.",
    body:
      "Hello,\n\n{{seller_display_name}} from {{seller_company}} is available for a short meeting about Buddy Web if that would be useful.\n\n{{product_description}}\n\nReply to this email if you want to schedule something. No obligation.",
    ctaLabel: "View product page",
  },
  {
    subject: "Kan et kort møte om Kompis Web være nyttig?",
    preheader: "Valgfri møteforespørsel — du bestemmer.",
    body:
      "Hei,\n\n{{seller_display_name}} fra {{seller_company}} kan ta et kort møte om Kompis Web hvis det er nyttig.\n\n{{product_description}}\n\nSvar på denne e-posten hvis du vil avtale noe. Ingen forpliktelse.",
    ctaLabel: "Se produktside",
  },
  {
    subject: "Kan ett kort möte om Kompis Web vara till hjälp?",
    preheader: "Valfri mötesförfrågan — du bestämmer.",
    body:
      "Hej,\n\n{{seller_display_name}} från {{seller_company}} kan ta ett kort möte om Kompis Web om det skulle vara till hjälp.\n\n{{product_description}}\n\nSvara på det här mejlet om du vill boka något. Ingen förpliktelse.",
    ctaLabel: "Se produktsidan",
  },
  {
    subject: "Kan et kort møde om Kompis Web være nyttigt?",
    preheader: "Valgfri mødeforespørgsel — du bestemmer.",
    body:
      "Hej,\n\n{{seller_display_name}} fra {{seller_company}} kan tage et kort møde om Kompis Web, hvis det er nyttigt.\n\n{{product_description}}\n\nSvar på denne e-mail, hvis du vil aftale noget. Ingen forpligtelse.",
    ctaLabel: "Se produktsiden",
  },
  {
    subject: "Czy krótkie spotkanie o Buddy Web byłoby pomocne?",
    preheader: "Opcjonalna prośba o spotkanie — Ty decydujesz.",
    body:
      "Dzień dobry,\n\n{{seller_display_name}} z {{seller_company}} może umówić krótkie spotkanie o Buddy Web, jeśli to będzie pomocne.\n\n{{product_description}}\n\nOdpowiedz na tę wiadomość, jeśli chcesz coś ustalić. Bez zobowiązań.",
    ctaLabel: "Zobacz stronę produktu",
  },
  {
    subject: "Чи була б корисною коротка зустріч про Buddy Web?",
    preheader: "Необов’язковий запит на зустріч — ви вирішуєте.",
    body:
      "Вітаємо,\n\n{{seller_display_name}} з {{seller_company}} може провести коротку зустріч про Buddy Web, якщо це буде корисно.\n\n{{product_description}}\n\nВідповідайте на цей лист, якщо хочете щось узгодити. Без зобов’язань.",
    ctaLabel: "Переглянути сторінку продукту",
  },
  {
    subject: "¿Ayudaría una breve reunión sobre Buddy Web?",
    preheader: "Solicitud de reunión opcional — tú decides.",
    body:
      "Hola,\n\n{{seller_display_name}} de {{seller_company}} puede mantener una breve reunión sobre Buddy Web si te resulta útil.\n\n{{product_description}}\n\nResponde a este correo si quieres concertar algo. Sin compromiso.",
    ctaLabel: "Ver página del producto",
  },
);

const WEB_INFO = L(
  {
    subject: "Product information: Buddy Web",
    preheader: "Approved product information only.",
    body:
      "Hello,\n\nHere is approved product information for Buddy Web from {{seller_display_name}} at {{seller_company}}.\n\n{{product_description}}\n\nUse the personal referral link for the official page.",
    ctaLabel: "Open referral link",
  },
  {
    subject: "Produktinformasjon: Kompis Web",
    preheader: "Kun godkjent produktinformasjon.",
    body:
      "Hei,\n\nHer er godkjent produktinformasjon om Kompis Web fra {{seller_display_name}} hos {{seller_company}}.\n\n{{product_description}}\n\nBruk den personlige salgslenken for den offisielle siden.",
    ctaLabel: "Åpne salgslenke",
  },
  {
    subject: "Produktinformation: Kompis Web",
    preheader: "Endast godkänd produktinformation.",
    body:
      "Hej,\n\nHär är godkänd produktinformation om Kompis Web från {{seller_display_name}} på {{seller_company}}.\n\n{{product_description}}\n\nAnvänd den personliga säljlänken till den officiella sidan.",
    ctaLabel: "Öppna säljlänken",
  },
  {
    subject: "Produktinformation: Kompis Web",
    preheader: "Kun godkendt produktinformation.",
    body:
      "Hej,\n\nHer er godkendt produktinformation om Kompis Web fra {{seller_display_name}} hos {{seller_company}}.\n\n{{product_description}}\n\nBrug det personlige salgslink til den officielle side.",
    ctaLabel: "Åbn salgslink",
  },
  {
    subject: "Informacje o produkcie: Buddy Web",
    preheader: "Wyłącznie zatwierdzone informacje o produkcie.",
    body:
      "Dzień dobry,\n\nOto zatwierdzone informacje o produkcie Buddy Web od {{seller_display_name}} z {{seller_company}}.\n\n{{product_description}}\n\nUżyj osobistego linku sprzedażowego do oficjalnej strony.",
    ctaLabel: "Otwórz link sprzedażowy",
  },
  {
    subject: "Інформація про продукт: Buddy Web",
    preheader: "Лише схвалена інформація про продукт.",
    body:
      "Вітаємо,\n\nОсь схвалена інформація про продукт Buddy Web від {{seller_display_name}} з {{seller_company}}.\n\n{{product_description}}\n\nВикористовуйте персональне посилання для продажу на офіційну сторінку.",
    ctaLabel: "Відкрити посилання для продажу",
  },
  {
    subject: "Información del producto: Buddy Web",
    preheader: "Solo información de producto aprobada.",
    body:
      "Hola,\n\nAquí tienes información de producto aprobada sobre Buddy Web de {{seller_display_name}} en {{seller_company}}.\n\n{{product_description}}\n\nUsa el enlace personal de venta para la página oficial.",
    ctaLabel: "Abrir enlace de venta",
  },
);

/**
 * Code-reviewed marketing templates for Aipify’s own sellers.
 * Incomplete locales are simply absent — UI must show unavailable, never English fallback.
 * Future products are added here as unpublished registry rows — never hardcode product options in UI.
 */
export const CSP_EMAIL_TEMPLATE_REGISTRY: readonly CspEmailTemplateDefinition[] = [
  {
    id: "kompis-web-product-introduction-v1",
    type: "product_introduction",
    productKey: "kompis_web",
    version: 1,
    published: true,
    locales: WEB_INTRO,
  },
  {
    id: "kompis-web-follow-up-v1",
    type: "follow_up",
    productKey: "kompis_web",
    version: 1,
    published: true,
    locales: WEB_FOLLOW,
  },
  {
    id: "kompis-web-meeting-request-v1",
    type: "meeting_request",
    productKey: "kompis_web",
    version: 1,
    published: true,
    locales: WEB_MEET,
  },
  {
    id: "kompis-web-product-information-v1",
    type: "product_information",
    productKey: "kompis_web",
    version: 1,
    published: true,
    locales: WEB_INFO,
  },
  // Bedrift templates are registered as unpublished examples for later activation.
  {
    id: "kompis-bedrift-product-introduction-v1",
    type: "product_introduction",
    productKey: "kompis_bedrift",
    version: 1,
    published: false,
    locales: L(
      {
        subject: "A short introduction to Buddy Business",
        preheader: "Internal knowledge companion — draft template.",
        body: "Hello,\n\n{{seller_display_name}} from {{seller_company}} would like to introduce Buddy Business.\n\n{{product_description}}",
        ctaLabel: "Learn more",
      },
      {
        subject: "En kort introduksjon til Kompis Bedrift",
        preheader: "Intern kunnskaps-kompis — utkast.",
        body: "Hei,\n\n{{seller_display_name}} fra {{seller_company}} vil gjerne presentere Kompis Bedrift.\n\n{{product_description}}",
        ctaLabel: "Les mer",
      },
      {
        subject: "En kort introduktion till Kompis Bedrift",
        preheader: "Intern kunskapskompanjon — utkast.",
        body: "Hej,\n\n{{seller_display_name}} från {{seller_company}} vill gärna presentera Kompis Bedrift.\n\n{{product_description}}",
        ctaLabel: "Läs mer",
      },
      {
        subject: "En kort introduktion til Kompis Bedrift",
        preheader: "Intern videnskompis — udkast.",
        body: "Hej,\n\n{{seller_display_name}} fra {{seller_company}} vil gerne præsentere Kompis Bedrift.\n\n{{product_description}}",
        ctaLabel: "Læs mere",
      },
      {
        subject: "Krótkie wprowadzenie do Buddy Business",
        preheader: "Wewnętrzny companion wiedzy — szkic.",
        body: "Dzień dobry,\n\n{{seller_display_name}} z {{seller_company}} chciał(a)by przedstawić Buddy Business.\n\n{{product_description}}",
        ctaLabel: "Dowiedz się więcej",
      },
      {
        subject: "Коротке знайомство з Buddy Business",
        preheader: "Внутрішній companion знань — чернетка.",
        body: "Вітаємо,\n\n{{seller_display_name}} з {{seller_company}} хоче представити Buddy Business.\n\n{{product_description}}",
        ctaLabel: "Дізнатися більше",
      },
      {
        subject: "Una breve introducción a Buddy Business",
        preheader: "Companion de conocimiento interno — borrador.",
        body: "Hola,\n\n{{seller_display_name}} de {{seller_company}} desea presentar Buddy Business.\n\n{{product_description}}",
        ctaLabel: "Más información",
      },
    ),
  },
];

export function listPublishedCspEmailTemplates(opts?: {
  productKey?: string;
  type?: string;
}): CspEmailTemplateDefinition[] {
  return CSP_EMAIL_TEMPLATE_REGISTRY.filter(
    (t) =>
      t.published &&
      (!opts?.productKey || t.productKey === opts.productKey) &&
      (!opts?.type || t.type === opts.type),
  );
}

export function getCspEmailTemplateById(id: string): CspEmailTemplateDefinition | null {
  return CSP_EMAIL_TEMPLATE_REGISTRY.find((t) => t.id === id) ?? null;
}
