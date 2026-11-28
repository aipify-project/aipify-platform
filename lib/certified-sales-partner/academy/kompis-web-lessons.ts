/**
 * CSP Academy — Kompis Web lessons (6, stable ids lesson_01..lesson_06).
 *
 * Structured locale blocks (en, no, sv, da, pl, uk, es) — the UI picks by locale via `pickLocale`.
 * Content rules:
 *  - Describe only what Kompis Web does today; never promise missing features, integrations or dates.
 *  - Package facts are the PLANNED catalog only (not live in Stripe) — see KOMPIS_WEB_PLANNED_CATALOG.
 *  - Aipify supports people; humans decide. No pressure or fake urgency in sales guidance.
 */
import { localeBlock as L, type CspAcademyLesson } from "./types";

/**
 * Planned Kompis Web catalog facts. STATUS: planned — NOT live in Stripe.
 * Partners must not present these as binding offers or invoiced prices until the catalog is published.
 */
export const KOMPIS_WEB_PLANNED_CATALOG = {
  status: "planned_not_stripe_live",
  currency: "NOK",
  free: { lifetimeAnswers: 150 },
  standard: { answersPerMonth: 2500, monthlyPriceNok: 599 },
  pro: { answersPerMonth: 10000, monthlyPriceNok: 1199 },
} as const;

export const KOMPIS_WEB_LESSONS: readonly CspAcademyLesson[] = [
  {
    id: "lesson_01",
    productId: "kompis_web",
    order: 1,
    containsPlannedCatalogFacts: false,
    title: L(
      "What is Buddy Web?",
      "Hva er Kompis Web?",
      "Vad är Kompis Web?",
      "Hvad er Kompis Web?",
      "Czym jest Buddy Web?",
      "Що таке Buddy Web?",
      "¿Qué es Buddy Web?",
    ),
    body: [
      L(
        "Buddy Web is Aipify's website companion. It sits on a customer's own website and helps visitors find answers to their questions, based on content the customer has approved.",
        "Kompis Web er Aipifys nettstedskompis. Den ligger på kundens eget nettsted og hjelper besøkende med å finne svar på spørsmålene sine, basert på innhold kunden har godkjent.",
        "Kompis Web är Aipifys webbplatskompis. Den finns på kundens egen webbplats och hjälper besökare att hitta svar på sina frågor, baserat på innehåll som kunden har godkänt.",
        "Kompis Web er Aipifys hjemmesidekompagnon. Den ligger på kundens egen hjemmeside og hjælper besøgende med at finde svar på deres spørgsmål, baseret på indhold, som kunden har godkendt.",
        "Buddy Web to towarzysz witryny Aipify. Działa na stronie klienta i pomaga odwiedzającym znaleźć odpowiedzi na ich pytania w oparciu o treści zatwierdzone przez klienta.",
        "Buddy Web — це помічник вебсайту від Aipify. Він працює на власному сайті клієнта й допомагає відвідувачам знаходити відповіді на запитання на основі матеріалів, схвалених клієнтом.",
        "Buddy Web es el compañero de sitio web de Aipify. Funciona en el propio sitio del cliente y ayuda a los visitantes a encontrar respuestas a sus preguntas a partir del contenido que el cliente ha aprobado.",
      ),
      L(
        "The value for a customer is clearer service and less repetitive work: visitors get a helpful answer at the moment they have the question, and the team spends less time on the same questions. People remain responsible; Buddy Web supports them.",
        "Verdien for kunden er tydeligere service og mindre gjentakende arbeid: besøkende får et nyttig svar i øyeblikket de lurer på noe, og teamet bruker mindre tid på de samme spørsmålene. Mennesker har fortsatt ansvaret; Kompis Web støtter dem.",
        "Värdet för kunden är tydligare service och mindre repetitivt arbete: besökare får ett hjälpsamt svar i det ögonblick de undrar över något, och teamet lägger mindre tid på samma frågor. Människor har fortfarande ansvaret; Kompis Web stöttar dem.",
        "Værdien for kunden er tydeligere service og mindre gentagende arbejde: besøgende får et nyttigt svar i det øjeblik, de har spørgsmålet, og teamet bruger mindre tid på de samme spørgsmål. Mennesker har stadig ansvaret; Kompis Web støtter dem.",
        "Wartość dla klienta to czytelniejsza obsługa i mniej powtarzalnej pracy: odwiedzający dostają pomocną odpowiedź w chwili, gdy mają pytanie, a zespół poświęca mniej czasu na te same pytania. Odpowiedzialność nadal ponoszą ludzie; Buddy Web ich wspiera.",
        "Цінність для клієнта — зрозуміліший сервіс і менше повторюваної роботи: відвідувачі отримують корисну відповідь саме тоді, коли в них виникає запитання, а команда витрачає менше часу на однакові запитання. Відповідальність залишається за людьми; Buddy Web їх підтримує.",
        "El valor para el cliente es un servicio más claro y menos trabajo repetitivo: los visitantes reciben una respuesta útil en el momento en que tienen la duda y el equipo dedica menos tiempo a las mismas preguntas. Las personas siguen siendo responsables; Buddy Web las apoya.",
      ),
      L(
        "Buddy Web is a companion, not a replacement for employees. When it does not have a reliable answer, it should say so honestly instead of guessing.",
        "Kompis Web er en kompis, ikke en erstatning for ansatte. Når den ikke har et pålitelig svar, skal den si det ærlig i stedet for å gjette.",
        "Kompis Web är en kompis, inte en ersättning för anställda. När den inte har ett pålitligt svar ska den säga det ärligt i stället för att gissa.",
        "Kompis Web er en kompagnon, ikke en erstatning for medarbejdere. Når den ikke har et pålideligt svar, skal den sige det ærligt i stedet for at gætte.",
        "Buddy Web jest towarzyszem, a nie zamiennikiem pracowników. Gdy nie ma wiarygodnej odpowiedzi, powinien szczerze to powiedzieć zamiast zgadywać.",
        "Buddy Web — це помічник, а не заміна працівників. Коли він не має надійної відповіді, він має чесно про це сказати, а не вгадувати.",
        "Buddy Web es un compañero, no un sustituto de los empleados. Cuando no tiene una respuesta fiable, debe decirlo con honestidad en lugar de adivinar.",
      ),
    ],
  },
  {
    id: "lesson_02",
    productId: "kompis_web",
    order: 2,
    containsPlannedCatalogFacts: false,
    title: L(
      "Who is it for?",
      "Hvem passer det for?",
      "Vem passar det för?",
      "Hvem passer det til?",
      "Dla kogo jest przeznaczone?",
      "Для кого це підходить?",
      "¿Para quién es?",
    ),
    body: [
      L(
        "Typical fits are websites where visitors repeatedly ask about the same things: opening hours, services, prices that are already published, delivery or booking information, and how to contact the business.",
        "Typiske tilfeller er nettsteder der besøkende gjentatte ganger spør om de samme tingene: åpningstider, tjenester, priser som allerede er publisert, levering eller booking, og hvordan man kontakter virksomheten.",
        "Typiska fall är webbplatser där besökare ofta frågar om samma saker: öppettider, tjänster, redan publicerade priser, leverans- eller bokningsinformation och hur man kontaktar företaget.",
        "Typiske tilfælde er hjemmesider, hvor besøgende gentagne gange spørger om de samme ting: åbningstider, ydelser, allerede offentliggjorte priser, levering eller booking og hvordan man kontakter virksomheden.",
        "Typowe zastosowania to strony, na których odwiedzający często pytają o to samo: godziny otwarcia, usługi, już opublikowane ceny, dostawę lub rezerwacje oraz kontakt z firmą.",
        "Типові випадки — сайти, де відвідувачі постійно запитують про те саме: години роботи, послуги, вже опубліковані ціни, доставку чи бронювання та способи зв'язку з компанією.",
        "Los casos típicos son sitios web donde los visitantes preguntan una y otra vez lo mismo: horarios, servicios, precios ya publicados, información de entrega o reservas y cómo contactar con el negocio.",
      ),
      L(
        "Good prospects have useful, up-to-date content on their site, a clear owner who can approve that content, and a team that wants less repetitive support work. Small businesses, clubs, clinics, shops and service companies are common examples.",
        "Gode kunder har nyttig, oppdatert innhold på nettstedet, en tydelig eier som kan godkjenne innholdet, og et team som ønsker mindre repetitivt kundeservicearbeid. Små bedrifter, foreninger, klinikker, butikker og tjenestebedrifter er vanlige eksempler.",
        "Bra kunder har användbart, uppdaterat innehåll på sin webbplats, en tydlig ägare som kan godkänna innehållet och ett team som vill ha mindre repetitivt supportarbete. Småföretag, föreningar, kliniker, butiker och tjänsteföretag är vanliga exempel.",
        "Gode kunder har brugbart, opdateret indhold på hjemmesiden, en tydelig ejer, der kan godkende indholdet, og et team, der ønsker mindre gentagende supportarbejde. Små virksomheder, foreninger, klinikker, butikker og servicevirksomheder er almindelige eksempler.",
        "Dobrzy klienci mają przydatne, aktualne treści na stronie, wyraźnego właściciela, który może je zatwierdzać, oraz zespół chcący ograniczyć powtarzalną obsługę. Typowe przykłady to małe firmy, stowarzyszenia, kliniki, sklepy i firmy usługowe.",
        "Добрі клієнти мають корисний актуальний вміст на сайті, чіткого власника, який може його схвалювати, і команду, що хоче менше повторюваної підтримки. Типові приклади — малий бізнес, спілки, клініки, магазини та сервісні компанії.",
        "Los buenos clientes potenciales tienen contenido útil y actualizado en su sitio, un responsable claro que puede aprobarlo y un equipo que quiere menos soporte repetitivo. Pequeñas empresas, asociaciones, clínicas, tiendas y empresas de servicios son ejemplos habituales.",
      ),
      L(
        "Poor fits are sites with almost no content, or customers who expect Buddy Web to make decisions, handle payments or give legal, medical or financial advice. Be honest when it is not the right match.",
        "Dårlig match er nettsteder med nesten ikke innhold, eller kunder som forventer at Kompis Web skal ta beslutninger, håndtere betaling eller gi juridiske, medisinske eller økonomiske råd. Vær ærlig når det ikke passer.",
        "Dålig matchning är webbplatser med nästan inget innehåll, eller kunder som förväntar sig att Kompis Web ska fatta beslut, hantera betalningar eller ge juridiska, medicinska eller ekonomiska råd. Var ärlig när det inte passar.",
        "Dårligt match er hjemmesider med næsten intet indhold eller kunder, der forventer, at Kompis Web træffer beslutninger, håndterer betaling eller giver juridisk, medicinsk eller økonomisk rådgivning. Vær ærlig, når det ikke passer.",
        "Słabe dopasowanie to strony prawie bez treści albo klienci oczekujący, że Buddy Web będzie podejmował decyzje, obsługiwał płatności lub udzielał porad prawnych, medycznych czy finansowych. Bądź szczery, gdy produkt nie pasuje.",
        "Погане поєднання — сайти майже без вмісту або клієнти, які очікують, що Buddy Web ухвалюватиме рішення, обробляти платежі чи давати юридичні, медичні або фінансові поради. Будьте чесними, коли продукт не підходить.",
        "Un mal encaje son los sitios casi sin contenido o los clientes que esperan que Buddy Web tome decisiones, gestione pagos u ofrezca asesoramiento legal, médico o financiero. Sea honesto cuando no sea la opción adecuada.",
      ),
    ],
  },
  {
    id: "lesson_03",
    productId: "kompis_web",
    order: 3,
    containsPlannedCatalogFacts: false,
    title: L(
      "Features, content and clear limits",
      "Funksjoner, innhold og klare begrensninger",
      "Funktioner, innehåll och tydliga gränser",
      "Funktioner, indhold og klare begrænsninger",
      "Funkcje, treści i jasne ograniczenia",
      "Функції, вміст і чіткі обмеження",
      "Funciones, contenido y límites claros",
    ),
    body: [
      L(
        "Buddy Web is installed on the customer's own website and works only for a domain that has been verified as belonging to that customer. The customer's own team, or a developer they choose, performs the installation.",
        "Kompis Web installeres på kundens eget nettsted og fungerer bare for et domene som er verifisert som kundens eget. Kundens eget team, eller en utvikler de velger, gjennomfører installasjonen.",
        "Kompis Web installeras på kundens egen webbplats och fungerar bara för en domän som har verifierats som kundens. Kundens eget team, eller en utvecklare de väljer, utför installationen.",
        "Kompis Web installeres på kundens egen hjemmeside og fungerer kun for et domæne, der er verificeret som kundens eget. Kundens eget team, eller en udvikler de vælger, gennemfører installationen.",
        "Buddy Web instaluje się na stronie klienta i działa tylko dla domeny zweryfikowanej jako należąca do klienta. Instalację wykonuje zespół klienta lub wybrany przez niego programista.",
        "Buddy Web встановлюється на власному сайті клієнта й працює лише для домену, підтвердженого як належний клієнту. Встановлення виконує команда клієнта або розробник, якого він обере.",
        "Buddy Web se instala en el propio sitio web del cliente y solo funciona para un dominio verificado como suyo. La instalación la realiza el equipo del cliente o un desarrollador que este elija.",
      ),
      L(
        "After connection, the customer decides which content Buddy Web may use as its source and reviews it. Answers can only be as good as the approved content, so a short review before going live is part of a good start.",
        "Etter tilkobling bestemmer kunden hvilket innhold Kompis Web kan bruke som kilde, og gjennomgår det. Svarene kan bare bli så gode som det godkjente innholdet, så en kort gjennomgang før lansering hører med til en god start.",
        "Efter anslutning bestämmer kunden vilket innehåll Kompis Web får använda som källa och granskar det. Svaren kan bara bli så bra som det godkända innehållet, så en kort granskning före lansering hör till en bra start.",
        "Efter tilslutning bestemmer kunden, hvilket indhold Kompis Web må bruge som kilde, og gennemgår det. Svarene kan kun blive så gode som det godkendte indhold, så en kort gennemgang før lancering hører med til en god start.",
        "Po połączeniu klient decyduje, z jakich treści Buddy Web może korzystać jako ze źródła, i je przegląda. Odpowiedzi mogą być tylko tak dobre jak zatwierdzone treści, więc krótki przegląd przed startem to element dobrego początku.",
        "Після підключення клієнт вирішує, які матеріали Buddy Web може використовувати як джерело, і переглядає їх. Відповіді можуть бути лише такими добрими, як схвалений вміст, тому короткий огляд перед запуском — частина хорошого старту.",
        "Tras la conexión, el cliente decide qué contenido puede usar Buddy Web como fuente y lo revisa. Las respuestas solo pueden ser tan buenas como el contenido aprobado, así que una breve revisión antes de publicar es parte de un buen comienzo.",
      ),
      L(
        "Only describe what the product does today. If a customer asks for a specific integration, feature or date that you cannot confirm from current Aipify information, say that you will check — never promise it. Unsure? Ask Aipify before you answer.",
        "Beskriv bare det produktet gjør i dag. Hvis en kunde spør om en bestemt integrasjon, funksjon eller dato du ikke kan bekrefte fra gjeldende Aipify-informasjon, si at du vil sjekke — aldri lov det. Usikker? Spør Aipify før du svarer.",
        "Beskriv bara vad produkten gör i dag. Om en kund frågar efter en viss integration, funktion eller ett datum som du inte kan bekräfta från aktuell Aipify-information, säg att du ska kontrollera — lova det aldrig. Osäker? Fråga Aipify innan du svarar.",
        "Beskriv kun, hvad produktet gør i dag. Hvis en kunde spørger efter en bestemt integration, funktion eller dato, som du ikke kan bekræfte ud fra aktuel Aipify-information, så sig, at du vil undersøge det — lov det aldrig. Usikker? Spørg Aipify, før du svarer.",
        "Opisuj tylko to, co produkt robi dziś. Jeśli klient pyta o konkretną integrację, funkcję lub termin, których nie możesz potwierdzić na podstawie aktualnych informacji Aipify, powiedz, że to sprawdzisz — nigdy tego nie obiecuj. Nie jesteś pewien? Zapytaj Aipify, zanim odpowiesz.",
        "Описуйте лише те, що продукт робить сьогодні. Якщо клієнт питає про конкретну інтеграцію, функцію чи дату, яку ви не можете підтвердити за чинною інформацією Aipify, скажіть, що перевірите, — ніколи не обіцяйте. Не впевнені? Запитайте Aipify, перш ніж відповідати.",
        "Describa solo lo que el producto hace hoy. Si un cliente pide una integración, función o fecha concretas que no puede confirmar con la información vigente de Aipify, diga que lo comprobará; nunca lo prometa. ¿Duda? Consulte a Aipify antes de responder.",
      ),
    ],
  },
  {
    id: "lesson_04",
    productId: "kompis_web",
    order: 4,
    containsPlannedCatalogFacts: false,
    title: L(
      "Privacy, trust and honest limits",
      "Personvern, tillit og ærlige grenser",
      "Integritet, tillit och ärliga gränser",
      "Privatliv, tillid og ærlige grænser",
      "Prywatność, zaufanie i uczciwe granice",
      "Приватність, довіра і чесні межі",
      "Privacidad, confianza y límites honestos",
    ),
    body: [
      L(
        "The customer owns their data and their content. Buddy Web uses only content the customer has approved, and Aipify stores what is needed to run the service — not more than that.",
        "Kunden eier sine data og sitt innhold. Kompis Web bruker bare innhold kunden har godkjent, og Aipify lagrer det som trengs for å drive tjenesten — ikke mer enn det.",
        "Kunden äger sina data och sitt innehåll. Kompis Web använder bara innehåll som kunden har godkänt, och Aipify lagrar det som behövs för att driva tjänsten — inte mer än så.",
        "Kunden ejer sine data og sit indhold. Kompis Web bruger kun indhold, som kunden har godkendt, og Aipify gemmer det, der er nødvendigt for at drive tjenesten — ikke mere end det.",
        "Klient jest właścicielem swoich danych i treści. Buddy Web korzysta wyłącznie z treści zatwierdzonych przez klienta, a Aipify przechowuje to, co potrzebne do działania usługi — nic więcej.",
        "Клієнт володіє своїми даними та вмістом. Buddy Web використовує лише схвалений клієнтом вміст, а Aipify зберігає те, що потрібно для роботи сервісу, і не більше.",
        "El cliente es propietario de sus datos y de su contenido. Buddy Web usa solo el contenido que el cliente ha aprobado, y Aipify almacena lo necesario para prestar el servicio, y nada más.",
      ),
      L(
        "As a partner you do not get access to a customer's data, visitor conversations or accounts, and you must never ask for passwords or secret keys. Do not make privacy or legal promises beyond what Aipify has published, such as claims about certifications or specific regulations.",
        "Som partner får du ikke tilgang til kundens data, besøkendes samtaler eller kontoer, og du skal aldri be om passord eller hemmelige nøkler. Ikke gi personvern- eller juridiske løfter utover det Aipify har publisert, for eksempel påstander om sertifiseringer eller bestemte regelverk.",
        "Som partner får du inte tillgång till kundens data, besökares konversationer eller konton, och du ska aldrig be om lösenord eller hemliga nycklar. Ge inga integritets- eller juridiska löften utöver det Aipify har publicerat, till exempel påståenden om certifieringar eller särskilda regelverk.",
        "Som partner får du ikke adgang til kundens data, besøgendes samtaler eller konti, og du må aldrig bede om adgangskoder eller hemmelige nøgler. Giv ikke privatlivs- eller juridiske løfter ud over det, Aipify har offentliggjort, fx påstande om certificeringer eller bestemte regelsæt.",
        "Jako partner nie masz dostępu do danych klienta, rozmów odwiedzających ani kont i nigdy nie wolno Ci prosić o hasła ani tajne klucze. Nie składaj obietnic dotyczących prywatności ani prawa wykraczających poza to, co opublikowało Aipify, np. twierdzeń o certyfikatach czy konkretnych regulacjach.",
        "Як партнер ви не маєте доступу до даних клієнта, розмов відвідувачів чи облікових записів і ніколи не повинні просити паролі чи секретні ключі. Не давайте обіцянок щодо приватності чи права понад те, що опублікувала Aipify, наприклад тверджень про сертифікати чи конкретні регуляції.",
        "Como socio no tiene acceso a los datos del cliente, a las conversaciones de los visitantes ni a las cuentas, y nunca debe pedir contraseñas ni claves secretas. No haga promesas de privacidad o legales más allá de lo que Aipify ha publicado, como afirmaciones sobre certificaciones o normativas concretas.",
      ),
      L(
        "Buddy Web is not for emergencies, and it does not replace professional advice. Customers remain responsible for the content they approve and for how they use answers in their business.",
        "Kompis Web er ikke for nødsituasjoner og erstatter ikke profesjonell rådgivning. Kunden er fortsatt ansvarlig for innholdet de godkjenner og for hvordan de bruker svarene i virksomheten sin.",
        "Kompis Web är inte till för nödsituationer och ersätter inte professionell rådgivning. Kunden är fortsatt ansvarig för innehållet de godkänner och för hur de använder svaren i sin verksamhet.",
        "Kompis Web er ikke til nødsituationer og erstatter ikke professionel rådgivning. Kunden er fortsat ansvarlig for det indhold, de godkender, og for, hvordan de bruger svarene i deres virksomhed.",
        "Buddy Web nie służy do sytuacji nagłych i nie zastępuje profesjonalnych porad. Klient nadal odpowiada za zatwierdzane treści i za to, jak wykorzystuje odpowiedzi w swojej firmie.",
        "Buddy Web не призначений для надзвичайних ситуацій і не замінює професійних порад. Клієнт і надалі відповідає за схвалений вміст та за те, як використовує відповіді у своєму бізнесі.",
        "Buddy Web no es para emergencias y no sustituye el asesoramiento profesional. El cliente sigue siendo responsable del contenido que aprueba y de cómo usa las respuestas en su negocio.",
      ),
    ],
  },
  {
    id: "lesson_05",
    productId: "kompis_web",
    order: 5,
    containsPlannedCatalogFacts: true,
    title: L(
      "Packages, free model and pricing",
      "Pakker, gratismodell og pris",
      "Paket, gratisnivå och pris",
      "Pakker, gratismodel og pris",
      "Pakiety, model bezpłatny i ceny",
      "Пакети, безкоштовна модель і ціна",
      "Paquetes, modelo gratuito y precios",
    ),
    body: [
      L(
        "PLANNED catalog — not yet live in billing. The planned free tier includes 150 answers in total (lifetime, not per month). The planned Standard package includes 2,500 answers per month at 599 NOK per month, and the planned Pro package includes 10,000 answers per month at 1,199 NOK per month.",
        "PLANLAGT katalog — ennå ikke live i fakturering. Den planlagte gratisnivået inkluderer 150 svar totalt (levetid, ikke per måned). Den planlagte Standard-pakken inkluderer 2 500 svar per måned til 599 NOK per måned, og den planlagte Pro-pakken inkluderer 10 000 svar per måned til 1 199 NOK per måned.",
        "PLANERAD katalog — ännu inte aktiv i fakturering. Den planerade gratisnivån omfattar 150 svar totalt (livstid, inte per månad). Det planerade Standard-paketet omfattar 2 500 svar per månad för 599 NOK per månad, och det planerade Pro-paketet omfattar 10 000 svar per månad för 1 199 NOK per månad.",
        "PLANLAGT katalog — endnu ikke live i fakturering. Det planlagte gratisniveau omfatter 150 svar i alt (levetid, ikke pr. måned). Den planlagte Standard-pakke omfatter 2.500 svar pr. måned til 599 NOK pr. måned, og den planlagte Pro-pakke omfatter 10.000 svar pr. måned til 1.199 NOK pr. måned.",
        "PLANOWANY katalog — jeszcze nieaktywny w rozliczeniach. Planowany poziom bezpłatny obejmuje łącznie 150 odpowiedzi (na całe życie konta, nie miesięcznie). Planowany pakiet Standard obejmuje 2500 odpowiedzi miesięcznie za 599 NOK miesięcznie, a planowany pakiet Pro — 10 000 odpowiedzi miesięcznie za 1199 NOK miesięcznie.",
        "ПЛАНОВАНИЙ каталог — ще не активний у білінгу. Плановий безкоштовний рівень включає 150 відповідей загалом (за весь час, а не на місяць). Плановий пакет Standard включає 2500 відповідей на місяць за 599 NOK на місяць, а плановий пакет Pro — 10 000 відповідей на місяць за 1199 NOK на місяць.",
        "Catálogo PLANIFICADO — aún no activo en la facturación. El nivel gratuito planificado incluye 150 respuestas en total (de por vida, no por mes). El paquete Standard planificado incluye 2500 respuestas al mes por 599 NOK al mes, y el paquete Pro planificado incluye 10 000 respuestas al mes por 1199 NOK al mes.",
      ),
      L(
        "Because these figures are planned and not live in Stripe, never present them as a binding offer, an invoice price or a guaranteed date. Say clearly that packages and prices are planned and may change before they are published.",
        "Fordi disse tallene er planlagt og ikke live i Stripe, må du aldri presentere dem som et bindende tilbud, en fakturapris eller en garantert dato. Si tydelig at pakker og priser er planlagt og kan endres før de publiseres.",
        "Eftersom dessa siffror är planerade och inte aktiva i Stripe får du aldrig presentera dem som ett bindande erbjudande, ett fakturapris eller ett garanterat datum. Säg tydligt att paket och priser är planerade och kan ändras innan de publiceras.",
        "Fordi disse tal er planlagte og ikke live i Stripe, må du aldrig præsentere dem som et bindende tilbud, en fakturapris eller en garanteret dato. Sig tydeligt, at pakker og priser er planlagte og kan ændres, før de offentliggøres.",
        "Ponieważ te wartości są planowane i nieaktywne w Stripe, nigdy nie przedstawiaj ich jako wiążącej oferty, ceny na fakturze ani gwarantowanego terminu. Powiedz wprost, że pakiety i ceny są planowane i mogą się zmienić przed publikacją.",
        "Оскільки ці цифри планові й не активні в Stripe, ніколи не подавайте їх як обов'язкову пропозицію, ціну в рахунку чи гарантовану дату. Чітко скажіть, що пакети й ціни планові та можуть змінитися до публікації.",
        "Como estas cifras son planificadas y no están activas en Stripe, nunca las presente como una oferta vinculante, un precio de factura o una fecha garantizada. Diga con claridad que los paquetes y precios son planificados y pueden cambiar antes de publicarse.",
      ),
      L(
        "Capacity means answers used. Explain that a customer should choose a package by expected visitor questions, not by pressure, and that the team will help them review usage. Do not promise unlimited use, discounts or special terms.",
        "Kapasitet betyr brukte svar. Forklar at kunden bør velge pakke ut fra forventede spørsmål fra besøkende, ikke under press, og at teamet hjelper dem med å følge med på bruken. Ikke lov ubegrenset bruk, rabatter eller spesielle vilkår.",
        "Kapacitet betyder använda svar. Förklara att kunden bör välja paket utifrån förväntade besökarfrågor, inte under press, och att teamet hjälper dem att följa upp användningen. Lova inte obegränsad användning, rabatter eller särskilda villkor.",
        "Kapacitet betyder brugte svar. Forklar, at kunden bør vælge pakke ud fra forventede spørgsmål fra besøgende, ikke under pres, og at teamet hjælper med at følge forbruget. Lov ikke ubegrænset brug, rabatter eller særlige vilkår.",
        "Pojemność oznacza wykorzystane odpowiedzi. Wyjaśnij, że klient powinien wybrać pakiet na podstawie spodziewanej liczby pytań odwiedzających, a nie pod presją, oraz że zespół pomoże mu monitorować zużycie. Nie obiecuj nieograniczonego użycia, rabatów ani specjalnych warunków.",
        "Ємність означає використані відповіді. Поясніть, що клієнт має обирати пакет за очікуваною кількістю запитань відвідувачів, а не під тиском, і що команда допоможе стежити за використанням. Не обіцяйте необмеженого використання, знижок чи особливих умов.",
        "La capacidad significa respuestas utilizadas. Explique que el cliente debe elegir el paquete según las preguntas esperadas de los visitantes, no bajo presión, y que el equipo le ayudará a revisar el uso. No prometa uso ilimitado, descuentos ni condiciones especiales.",
      ),
    ],
  },
  {
    id: "lesson_06",
    productId: "kompis_web",
    order: 6,
    containsPlannedCatalogFacts: false,
    title: L(
      "Ethics, privacy, commission and certification",
      "Etikk, privatliv, provisjon og sertifisering",
      "Etik, integritet, provision och certifiering",
      "Etik, privatliv, provision og certificering",
      "Etyka, prywatność, prowizja i certyfikacja",
      "Етика, приватність, комісія та сертифікація",
      "Ética, privacidad, comisión y certificación",
    ),
    body: [
      L(
        "Represent Aipify honestly. Listen first, ask what the customer's visitors actually ask, and describe only what Buddy Web does today. No false urgency, no guilt, no invented scarcity, and no guaranteed results such as exact savings or sales increases.",
        "Representer Aipify ærlig. Lytt først, spør hva kundens besøkende faktisk spør om, og beskriv bare det Kompis Web gjør i dag. Ingen falsk hast, ingen skyldfølelse, ingen oppdiktet knapphet og ingen garanterte resultater som eksakte besparelser eller salgsøkning.",
        "Representera Aipify ärligt. Lyssna först, fråga vad kundens besökare faktiskt frågar om och beskriv bara vad Kompis Web gör i dag. Ingen falsk brådska, ingen skuldkänsla, ingen påhittad knapphet och inga garanterade resultat som exakta besparingar eller försäljningsökningar.",
        "Repræsenter Aipify ærligt. Lyt først, spørg hvad kundens besøgende faktisk spørger om, og beskriv kun, hvad Kompis Web gør i dag. Ingen falsk hast, ingen skyldfølelse, ingen opdigtet knaphed og ingen garanterede resultater som præcise besparelser eller salgsstigninger.",
        "Reprezentuj Aipify uczciwie. Najpierw słuchaj, pytaj, o co faktycznie pytają odwiedzający klienta, i opisuj tylko to, co Buddy Web robi dziś. Bez fałszywej pilności, poczucia winy, zmyślonej rzadkości i gwarantowanych wyników, takich jak dokładne oszczędności czy wzrost sprzedaży.",
        "Представляйте Aipify чесно. Спочатку слухайте, запитайте, про що насправді питають відвідувачі клієнта, і описуйте лише те, що Buddy Web робить сьогодні. Жодної хибної терміновості, почуття провини, вигаданого дефіциту чи гарантованих результатів, як-от точна економія або зростання продажів.",
        "Represente a Aipify con honestidad. Escuche primero, pregunte qué preguntan realmente los visitantes del cliente y describa solo lo que Buddy Web hace hoy. Sin falsa urgencia, sin culpa, sin escasez inventada y sin resultados garantizados como ahorros exactos o aumentos de ventas.",
      ),
      L(
        "Common objections: “We have no time to set it up” — be honest about the steps and who does them. “Will it replace my staff?” — no, it supports people. “What if it is wrong?” — it uses approved content and should say when it does not know. “Is it too expensive?” — explain the planned packages as planned, and let the customer decide.",
        "Vanlige innvendinger: «Vi har ikke tid til å sette det opp» — vær ærlig om trinnene og hvem som gjør dem. «Erstatter det de ansatte?» — nei, det støtter mennesker. «Hva hvis det tar feil?» — det bruker godkjent innhold og skal si fra når det ikke vet. «Er det for dyrt?» — forklar de planlagte pakkene som planlagte, og la kunden bestemme.",
        "Vanliga invändningar: ”Vi har ingen tid att sätta upp det” — var ärlig med stegen och vem som gör dem. ”Ersätter det min personal?” — nej, det stöttar människor. ”Tänk om det har fel?” — det använder godkänt innehåll och ska säga när det inte vet. ”Är det för dyrt?” — förklara de planerade paketen som planerade och låt kunden bestämma.",
        "Almindelige indvendinger: »Vi har ikke tid til at sætte det op« — vær ærlig om trinnene, og hvem der udfører dem. »Erstatter det mine medarbejdere?« — nej, det støtter mennesker. »Hvad hvis det tager fejl?« — det bruger godkendt indhold og skal sige til, når det ikke ved det. »Er det for dyrt?« — forklar de planlagte pakker som planlagte, og lad kunden bestemme.",
        "Typowe zastrzeżenia: „Nie mamy czasu na konfigurację” — bądź szczery co do kroków i tego, kto je wykonuje. „Czy to zastąpi moich pracowników?” — nie, wspiera ludzi. „A jeśli się pomyli?” — korzysta ze zatwierdzonych treści i powinien powiedzieć, gdy czegoś nie wie. „Czy to zbyt drogie?” — wyjaśnij planowane pakiety jako planowane i pozwól klientowi zdecydować.",
        "Типові заперечення: «Ми не маємо часу на налаштування» — чесно розкажіть про кроки й хто їх виконує. «Чи це замінить моїх працівників?» — ні, воно підтримує людей. «А якщо помилиться?» — воно використовує схвалений вміст і має сказати, коли не знає. «Чи не надто дорого?» — поясніть планові пакети як планові та дайте клієнту вирішити.",
        "Objeciones habituales: «No tenemos tiempo para configurarlo» — sea honesto sobre los pasos y quién los realiza. «¿Sustituirá a mi personal?» — no, apoya a las personas. «¿Y si se equivoca?» — usa contenido aprobado y debe decir cuándo no lo sabe. «¿Es demasiado caro?» — explique los paquetes planificados como planificados y deje decidir al cliente.",
      ),
      L(
        "Respect “no”. Never claim to be an Aipify employee, never create sales through misleading claims, and never pressure someone to decide on the spot. A customer who decides in their own time is a customer who stays. When in doubt, pause and ask Aipify.",
        "Respekter et «nei». Aldri utgi deg for å være ansatt i Aipify, aldri lag salg gjennom villedende påstander, og aldri press noen til å bestemme seg på stedet. En kunde som bestemmer seg i sin egen tid, er en kunde som blir. Er du i tvil, stopp og spør Aipify.",
        "Respektera ett ”nej”. Utge dig aldrig för att vara anställd på Aipify, skapa aldrig försäljning genom vilseledande påståenden och pressa aldrig någon att bestämma sig på stående fot. En kund som bestämmer sig i sin egen takt är en kund som stannar. Vid tvekan, pausa och fråga Aipify.",
        "Respekter et »nej«. Udgiv dig aldrig for at være ansat i Aipify, skab aldrig salg gennem vildledende påstande, og pres aldrig nogen til at beslutte sig på stedet. En kunde, der beslutter sig i eget tempo, er en kunde, der bliver. Er du i tvivl, så hold pause og spørg Aipify.",
        "Szanuj „nie”. Nigdy nie podawaj się za pracownika Aipify, nie twórz sprzedaży przez wprowadzające w błąd twierdzenia i nie naciskaj na podjęcie decyzji od razu. Klient, który decyduje we własnym tempie, to klient, który zostaje. W razie wątpliwości zatrzymaj się i zapytaj Aipify.",
        "Поважайте «ні». Ніколи не видавайте себе за працівника Aipify, не створюйте продажі через оманливі твердження й не тисніть на людину, щоб вона вирішила одразу. Клієнт, який вирішує у власному темпі, — це клієнт, що залишається. Якщо сумніваєтеся, зупиніться й запитайте Aipify.",
        "Respete el «no». Nunca se presente como empleado de Aipify, nunca genere ventas con afirmaciones engañosas y nunca presione a nadie para decidir al instante. Un cliente que decide a su ritmo es un cliente que se queda. Ante la duda, haga una pausa y consulte a Aipify.",
      ),
    ],
  },
];

export const KOMPIS_WEB_LESSON_IDS: readonly string[] = KOMPIS_WEB_LESSONS.map((l) => l.id);

export function getKompisWebLesson(id: string): CspAcademyLesson | undefined {
  return KOMPIS_WEB_LESSONS.find((l) => l.id === id);
}
