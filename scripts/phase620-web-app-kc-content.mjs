#!/usr/bin/env node
/**
 * Phase 620 — inject Public Knowledge Center article and FAQs for
 * installing-aipify-web-app into locales/{en,no,sv,da}/marketing.json.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const LOCALES = ["en", "no", "sv", "da"];
const SLUG = "installing-aipify-web-app";

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    const tgtVal = target[key];
    if (
      srcVal &&
      typeof srcVal === "object" &&
      !Array.isArray(srcVal) &&
      tgtVal &&
      typeof tgtVal === "object" &&
      !Array.isArray(tgtVal)
    ) {
      deepMerge(tgtVal, srcVal);
    } else {
      target[key] = srcVal;
    }
  }
  return target;
}

const content = {
  en: {
    article: {
      title: "Installing the Aipify Web App",
      metaDescription:
        "Install the Aipify Web App on desktop and mobile for quick access with the same secure workspace, login, and organization permissions.",
      introduction:
        "The Aipify Web App lets you open Aipify from your home screen, dock, or taskbar — using the same app.aipify.ai workspace, sign-in, and permissions you already trust. It is not a separate product or browser extension.",
      sections: [
        {
          heading: "What is the Aipify Web App?",
          body:
            "The Aipify Web App installs Aipify to your device for quick access in a dedicated app window. You continue using app.aipify.ai with your existing account. It is not a second portal, browser extension, or standalone product license.",
        },
        {
          heading: "Benefits",
          body:
            "Open Aipify in one tap from your home screen or dock. Work in a focused app window without browser tab clutter. Use the same secure workspace, roles, approvals, and Business Packs you already have. Receive improvements when Aipify releases updates — without managing a separate install package.",
        },
        {
          heading: "Supported platforms",
          body:
            "Chrome and Edge on desktop support full installation with Install Aipify. Android Chrome supports Add to Home screen. iPhone, iPad, and Safari on macOS support Add to Home Screen or Add to Dock where the browser offers it — with limited standalone behavior compared to Chromium browsers.",
        },
        {
          heading: "Security",
          body:
            "Installation does not bypass Aipify sign-in, two-factor authentication, or organization permissions. Sensitive actions still require human approval under your existing policies. The Web App uses the same secure session and tenant isolation as the browser workspace.",
        },
        {
          heading: "Offline behavior",
          body:
            "Limited cached content may be available briefly, but Aipify is designed for connected operational work. Do not expect full offline operation. Sign-in, approvals, and live operational data require a network connection.",
        },
        {
          heading: "Updates",
          body:
            "When you open the installed app, Aipify loads the latest release from our servers. Updates are not guaranteed to appear on your device until the app is opened again. You do not need to download or manage update packages manually.",
        },
        {
          heading: "Remove or reinstall",
          body:
            "You can remove the installed app from your browser or device settings at any time. Your Aipify account, subscription, and organization data remain unchanged. Reinstall later from the Aipify install page, login screen, or your browser menu when installation is supported.",
        },
      ],
      examples: [
        {
          title: "Desktop workflow",
          body:
            "Sign in to app.aipify.ai in Chrome → Select Install Aipify → Review the Aipify panel → Confirm in your browser dialog → Open Aipify from your dock or taskbar.",
        },
        {
          title: "Mobile workflow",
          body:
            "Open app.aipify.ai in Chrome on Android → Tap Install Aipify or Add to Home screen → Confirm → Launch from your home screen with the same sign-in.",
        },
      ],
      keyTakeaways: {
        "1": "The Aipify Web App is quick access to app.aipify.ai — not a separate product.",
        "2": "Sign-in, two-factor authentication, and organization permissions remain fully enforced.",
        "3": "You can remove or reinstall from device or browser settings without affecting your subscription.",
      },
      readingTime: "6 min read",
      publishedDate: "2026-06-21",
    },
    faqs: {
      "1": {
        q: "What is the Aipify Web App?",
        a: "The Aipify Web App installs Aipify to your home screen, dock, or taskbar for quick access in a dedicated app window. You continue using app.aipify.ai with your existing account.",
      },
      "2": {
        q: "Is it different from app.aipify.ai?",
        a: "No. The Web App opens the same Aipify workspace at app.aipify.ai. It is a convenient entry point — not a separate portal or product.",
      },
      "3": {
        q: "Do I need a separate account?",
        a: "No. Use the same Aipify account and organization you already have. Installation does not create a second identity.",
      },
      "4": {
        q: "Which browsers support installation?",
        a: "Chrome and Edge on desktop, Chrome on Android, and Safari on iOS, iPadOS, and macOS (where Add to Home Screen or Add to Dock is available). Support varies by platform and browser version.",
      },
      "5": {
        q: "How do I install on Chrome or Edge desktop?",
        a: "Sign in to app.aipify.ai, select Install Aipify from the menu or install page, review the Aipify panel, then confirm in your browser installation dialog.",
      },
      "6": {
        q: "How do I install on Android?",
        a: "Open app.aipify.ai in Chrome, tap Install Aipify or Add to Home screen when offered, confirm in your browser, then open Aipify from your home screen.",
      },
      "7": {
        q: "How do I install on iPhone or iPad?",
        a: "Open app.aipify.ai in Safari, tap Share → Add to Home Screen, confirm, then launch Aipify from the icon. Sign in with your existing account.",
      },
      "8": {
        q: "Why don't I see Install Aipify?",
        a: "Your browser or device may not support installation, you may already have the app installed, or installation may be limited on your platform. Try Chrome or Edge on desktop, or use Add to Home Screen in Safari on Apple devices.",
      },
      "9": {
        q: "What happens when I choose Continue to installation?",
        a: "Aipify shows a summary of what installation means. Your browser then displays the final confirmation dialog. Installation completes only after you confirm in the browser.",
      },
      "10": {
        q: "Can Aipify install without my confirmation?",
        a: "No. Installation always requires explicit confirmation in your browser or device dialog. Aipify never installs silently.",
      },
      "11": {
        q: "Does the Web App work offline?",
        a: "Limited cached content may appear briefly, but Aipify requires a connection for sign-in, approvals, and live operational work. Do not expect full offline operation.",
      },
      "12": {
        q: "How do updates work?",
        a: "When you open the installed app, Aipify loads the latest release from our servers. Updates appear when you next open the app — you do not manage update packages manually.",
      },
      "13": {
        q: "Is the Web App secure?",
        a: "Yes. The Web App uses the same secure sign-in, session handling, and tenant isolation as app.aipify.ai. Installation does not weaken security controls.",
      },
      "14": {
        q: "Does two-factor authentication still apply?",
        a: "Yes. Two-factor authentication and your organization's security policies apply exactly as they do in the browser workspace.",
      },
      "15": {
        q: "Do my organization permissions stay the same?",
        a: "Yes. Roles, Business Pack access, and approval policies are identical in the Web App. Installation does not change permissions.",
      },
      "16": {
        q: "Can I install on multiple devices?",
        a: "Yes. Install the Aipify Web App on each device you use. Each device maintains its own local install while sharing your account and organization settings.",
      },
      "17": {
        q: "How do I open Aipify after installing?",
        a: "Open Aipify from your home screen icon, dock, taskbar entry, or app list — depending on your platform. You remain signed in when your session is active.",
      },
      "18": {
        q: "How do I remove the Web App?",
        a: "Remove the installed app from your browser apps page, device home screen settings, or operating system app list. Your Aipify account and data are unaffected.",
      },
      "19": {
        q: "Can I reinstall later?",
        a: "Yes. Reinstall from the Aipify install page, login screen, or your browser menu whenever installation is supported on your device.",
      },
      "20": {
        q: "What is standalone mode?",
        a: "Standalone mode opens Aipify in a dedicated app window without browser chrome. Chromium browsers on desktop support full standalone behavior. Safari and some mobile installs may open more like a home screen shortcut.",
      },
      "21": {
        q: "Does installation change my subscription?",
        a: "No. Installing the Web App does not change your plan, billing, or licensed Business Packs. It is only a local access method.",
      },
      "22": {
        q: "Can I install from the login page?",
        a: "Yes. When your browser supports installation, Install Aipify is available from the login page and other entry points after you sign in.",
      },
      "23": {
        q: "What data is stored on my device?",
        a: "Your device may store cached assets and session tokens needed for performance and sign-in convenience. Operational business data remains governed by Aipify Core — not duplicated as a full offline copy on your device.",
      },
      "24": {
        q: "Does the Web App send notifications?",
        a: "If your organization enables Presence or desktop notifications and your browser allows them, notifications may appear for the installed app. You control notification preferences in Aipify settings and your device.",
      },
      "25": {
        q: "Is this a browser extension?",
        a: "No. The Aipify Web App is a Progressive Web App install — not a browser extension from an extension store.",
      },
      "26": {
        q: "What if installation fails?",
        a: "Try a supported browser, ensure you are signed in, clear the browser install prompt if stuck, and retry. Contact your administrator or Aipify support if the issue persists.",
      },
      "27": {
        q: "Where can I get help?",
        a: "Contact your organization administrator for access issues. For product support, use your organization's Aipify support channel or visit the Knowledge Center and install guide.",
      },
      "28": {
        q: "Where is the full installation guide?",
        a: "The full guide is available at /install on the Aipify website and in this Knowledge Center article. Platform-specific steps are listed for desktop, Android, and Apple devices.",
      },
    },
  },
  no: {
    article: {
      title: "Installere Aipify Web App",
      metaDescription:
        "Installer Aipify Web App på desktop og mobil for rask tilgang med samme sikre arbeidsområde, innlogging og organisasjonstillatelser.",
      introduction:
        "Aipify Web App lar deg åpne Aipify fra startskjermen, docken eller oppgavelinjen — med samme app.aipify.ai-arbeidsområde, innlogging og tillatelser du allerede stoler på. Det er ikke et separat produkt eller nettleserutvidelse.",
      sections: [
        {
          heading: "Hva er Aipify Web App?",
          body:
            "Aipify Web App installerer Aipify på enheten din for rask tilgang i et dedikert appvindu. Du fortsetter å bruke app.aipify.ai med din eksisterende konto. Det er ikke en second portal, nettleserutvidelse eller separat produktlisens.",
        },
        {
          heading: "Fordeler",
          body:
            "Åpne Aipify med ett trykk fra startskjermen eller docken. Jobb i et fokusert appvindu uten nettleserfaner. Bruk samme sikre arbeidsområde, roller, godkjenninger og Business Packs du allerede har. Motta forbedringer når Aipify slipper oppdateringer — uten å administrere en separat installasjonspakke.",
        },
        {
          heading: "Støttede plattformer",
          body:
            "Chrome og Edge på desktop støtter full installasjon med Installer Aipify. Android Chrome støtter Legg til på startskjermen. iPhone, iPad og Safari på macOS støtter Legg til på Hjem-skjermen eller Legg til i Dock der nettleseren tilbyr det — med mer begrenset standalone-atferd enn Chromium-nettlesere.",
        },
        {
          heading: "Sikkerhet",
          body:
            "Installasjon omgår ikke Aipify-innlogging, tofaktorautentisering eller organisasjonstillatelser. Sensitive handlinger krever fortsatt human godkjenning under dine eksisterende retningslinjer. Web App bruker samme sikre sesjon og tenant-isolasjon som nettleserarbeidsområdet.",
        },
        {
          heading: "Offline-atferd",
          body:
            "Begrenset cachet innhold kan være tilgjengelig kortvarig, men Aipify er designet for tilkoblet operativt arbeid. Ikke forvent full offline-funksjon. Innlogging, godkjenninger og live operasjonsdata krever nettverkstilkobling.",
        },
        {
          heading: "Oppdateringer",
          body:
            "Når du åpner den installerte appen, laster Aipify den nyeste versjonen fra våre servere. Oppdateringer vises ikke nødvendigvis på enheten før appen åpnes igjen. Du trenger ikke laste ned eller administrere oppdateringspakker manuelt.",
        },
        {
          heading: "Fjern eller installer på nytt",
          body:
            "Du kan fjerne den installerte appen fra nettleser- eller enhetsinnstillinger når som helst. Din Aipify-konto, abonnement og organisasjonsdata forblir uendret. Installer på nytt senere fra Aipify-installasjonssiden, innloggingssiden eller nettlesermenyen når installasjon er støttet.",
        },
      ],
      examples: [
        {
          title: "Desktop-arbeidsflyt",
          body:
            "Logg inn på app.aipify.ai i Chrome → Velg Installer Aipify → Gjennomgå Aipify-panelet → Bekreft i nettleserens installasjonsdialog → Åpne Aipify fra dock eller oppgavelinje.",
        },
        {
          title: "Mobil-arbeidsflyt",
          body:
            "Åpne app.aipify.ai i Chrome på Android → Trykk Installer Aipify eller Legg til på startskjermen → Bekreft → Start fra startskjermen med samme innlogging.",
        },
      ],
      keyTakeaways: {
        "1": "Aipify Web App er rask tilgang til app.aipify.ai — ikke et separat produkt.",
        "2": "Innlogging, tofaktorautentisering og organisasjonstillatelser forblir fullt ut påkrevd.",
        "3": "Du kan fjerne eller installere på nytt fra enhets- eller nettleserinnstillinger uten å påvirke abonnementet.",
      },
      readingTime: "6 min lesing",
      publishedDate: "2026-06-21",
    },
    faqs: {
      "1": {
        q: "Hva er Aipify Web App?",
        a: "Aipify Web App installerer Aipify på startskjermen, docken eller oppgavelinjen for rask tilgang i et dedikert appvindu. Du fortsetter å bruke app.aipify.ai med din eksisterende konto.",
      },
      "2": {
        q: "Er det forskjellig fra app.aipify.ai?",
        a: "Nei. Web App åpner samme Aipify-arbeidsområde på app.aipify.ai. Det er en praktisk inngang — ikke en separat portal eller produkt.",
      },
      "3": {
        q: "Trenger jeg en separat konto?",
        a: "Nei. Bruk samme Aipify-konto og organisasjon du allerede har. Installasjon oppretter ikke en second identitet.",
      },
      "4": {
        q: "Hvilke nettlesere støtter installasjon?",
        a: "Chrome og Edge på desktop, Chrome på Android, og Safari på iOS, iPadOS og macOS (der Legg til på Hjem-skjermen eller Legg til i Dock er tilgjengelig). Støtte varierer etter plattform og nettleserversjon.",
      },
      "5": {
        q: "Hvordan installerer jeg på Chrome eller Edge desktop?",
        a: "Logg inn på app.aipify.ai, velg Installer Aipify fra menyen eller installasjonssiden, gjennomgå Aipify-panelet, og bekreft i nettleserens installasjonsdialog.",
      },
      "6": {
        q: "Hvordan installerer jeg på Android?",
        a: "Åpne app.aipify.ai i Chrome, trykk Installer Aipify eller Legg til på startskjermen når det tilbys, bekreft i nettleseren, og åpne Aipify fra startskjermen.",
      },
      "7": {
        q: "Hvordan installerer jeg på iPhone eller iPad?",
        a: "Åpne app.aipify.ai i Safari, trykk Del → Legg til på Hjem-skjermen, bekreft, og start Aipify fra ikonet. Logg inn med din eksisterende konto.",
      },
      "8": {
        q: "Hvorfor ser jeg ikke Installer Aipify?",
        a: "Nettleseren eller enheten din kan ikke støtte installasjon, appen kan allerede være installert, eller installasjon kan være begrenset på plattformen. Prøv Chrome eller Edge på desktop, eller Legg til på Hjem-skjermen i Safari på Apple-enheter.",
      },
      "9": {
        q: "Hva skjer når jeg velger Fortsett til installasjon?",
        a: "Aipify viser en oversikt over hva installasjon innebærer. Nettleseren viser deretter den endelige bekreftelsesdialogen. Installasjon fullføres bare etter at du bekrefter i nettleseren.",
      },
      "10": {
        q: "Kan Aipify installere uten min bekreftelse?",
        a: "Nei. Installasjon krever alltid eksplisitt bekreftelse i nettleser- eller enhetsdialogen. Aipify installerer aldri stille.",
      },
      "11": {
        q: "Fungerer Web App offline?",
        a: "Begrenset cachet innhold kan vises kortvarig, men Aipify krever tilkobling for innlogging, godkjenninger og live operativt arbeid. Ikke forvent full offline-funksjon.",
      },
      "12": {
        q: "Hvordan fungerer oppdateringer?",
        a: "Når du åpner den installerte appen, laster Aipify den nyeste versjonen fra våre servere. Oppdateringer vises når du neste gang åpner appen — du administrerer ikke oppdateringspakker manuelt.",
      },
      "13": {
        q: "Er Web App sikker?",
        a: "Ja. Web App bruker samme sikker innlogging, sesjonshåndtering og tenant-isolasjon som app.aipify.ai. Installasjon svekker ikke sikkerhetskontroller.",
      },
      "14": {
        q: "Gjelder tofaktorautentisering fortsatt?",
        a: "Ja. Tofaktorautentisering og organisasjonens sikkerhetsretningslinjer gjelder nøyaktig som i nettleserarbeidsområdet.",
      },
      "15": {
        q: "Forblir organisasjonstillatelsene de samme?",
        a: "Ja. Roller, Business Pack-tilgang og godkjenningsretningslinjer er identiske i Web App. Installasjon endrer ikke tillatelser.",
      },
      "16": {
        q: "Kan jeg installere på flere enheter?",
        a: "Ja. Installer Aipify Web App på hver enhet du bruker. Hver enhet har sin egen lokal installasjon mens konto og organisasjonsinnstillinger deles.",
      },
      "17": {
        q: "Hvordan åpner jeg Aipify etter installasjon?",
        a: "Åpne Aipify fra startskjermikonet, docken, oppgavelinjen eller app-listen — avhengig av plattform. Du forblir innlogget når sesjonen er aktiv.",
      },
      "18": {
        q: "Hvordan fjerner jeg Web App?",
        a: "Fjern den installerte appen fra nettleserens appside, enhetens startskjerminnstillinger eller operativsystemets appliste. Din Aipify-konto og data påvirkes ikke.",
      },
      "19": {
        q: "Kan jeg installere på nytt senere?",
        a: "Ja. Installer på nytt fra Aipify-installasjonssiden, innloggingssiden eller nettlesermenyen når installasjon er støttet på enheten.",
      },
      "20": {
        q: "Hva er standalone-modus?",
        a: "Standalone-modus åpner Aipify i et dedikert appvindu uten nettleserchrome. Chromium-nettlesere på desktop støtter full standalone-atferd. Safari og noen mobilinstallasjoner kan oppføre seg mer som en startskjermsnarvei.",
      },
      "21": {
        q: "Endrer installasjon abonnementet mitt?",
        a: "Nei. Installasjon av Web App endrer ikke plan, fakturering eller lisensierte Business Packs. Det er bare en lokal tilgangsmetode.",
      },
      "22": {
        q: "Kan jeg installere fra innloggingssiden?",
        a: "Ja. Når nettleseren støtter installasjon, er Installer Aipify tilgjengelig fra innloggingssiden og andre innganger etter at du har logget inn.",
      },
      "23": {
        q: "Hvilke data lagres på enheten min?",
        a: "Enheten kan lagre cachede ressurser og sesjonstokener for ytelse og innloggingskomfort. Operativ forretningsdata forblir styrt av Aipify Core — ikke duplisert som full offline-kopi på enheten.",
      },
      "24": {
        q: "Sender Web App varsler?",
        a: "Hvis organisasjonen aktiverer Presence eller desktop-varsler og nettleseren tillater det, kan varsler vises for den installerte appen. Du kontrollerer varselinnstillinger i Aipify og på enheten.",
      },
      "25": {
        q: "Er dette en nettleserutvidelse?",
        a: "Nei. Aipify Web App er en Progressive Web App-installasjon — ikke en nettleserutvidelse fra en utvidelsesbutikk.",
      },
      "26": {
        q: "Hva om installasjonen mislykkes?",
        a: "Prøv en støttet nettleser, sørg for at du er innlogget, tøm nettleserens installasjonsdialog hvis den henger, og prøv igjen. Kontakt administrator eller Aipify-støtte hvis problemet vedvarer.",
      },
      "27": {
        q: "Hvor kan jeg få hjelp?",
        a: "Kontakt organisasjonsadministrator for tilgangsproblemer. For produktstøtte, bruk organisasjonens Aipify-støttekanal eller Knowledge Center og installasjonsveiledningen.",
      },
      "28": {
        q: "Hvor er den fullstendige installasjonsveiledningen?",
        a: "Den fullstendige veiledningen er tilgjengelig på /install på Aipify-nettstedet og i denne Knowledge Center-artikkelen. Plattformspesifikke trinn er listet for desktop, Android og Apple-enheter.",
      },
    },
  },
  sv: {
    article: {
      title: "Installera Aipify Web App",
      metaDescription:
        "Installera Aipify Web App på desktop och mobil för snabb åtkomst med samma säkra arbetsyta, inloggning och organisationstillstånd.",
      introduction:
        "Aipify Web App låter dig öppna Aipify från hemskärmen, dockan eller aktivitetsfältet — med samma app.aipify.ai-arbetsyta, inloggning och behörigheter du redan litar på. Det är inte en separat produkt eller webbläsartillägg.",
      sections: [
        {
          heading: "Vad är Aipify Web App?",
          body:
            "Aipify Web App installerar Aipify på din enhet för snabb åtkomst i ett dedikerat appfönster. Du fortsätter använda app.aipify.ai med ditt befintliga konto. Det är inte en second portal, webbläsartillägg eller separat produktlicens.",
        },
        {
          heading: "Fördelar",
          body:
            "Öppna Aipify med ett tryck från hemskärmen eller dockan. Arbeta i ett fokuserat appfönster utan webbläsarflikar. Använd samma säkra arbetsyta, roller, godkännanden och Business Packs du redan har. Få förbättringar när Aipify släpper uppdateringar — utan att hantera en separat installation.",
        },
        {
          heading: "Stödda plattformar",
          body:
            "Chrome och Edge på desktop stöder full installation med Installera Aipify. Android Chrome stöder Lägg till på hemskärmen. iPhone, iPad och Safari på macOS stöder Lägg till på hemskärmen eller Lägg till i Dock där webbläsaren erbjuder det — med mer begränsad standalone-beteende än Chromium-webbläsare.",
        },
        {
          heading: "Säkerhet",
          body:
            "Installation kringgår inte Aipify-inloggning, tvåfaktorsautentisering eller organisationstillstånd. Känsliga åtgärder kräver fortfarande human godkännande under dina befintliga policyer. Web App använder samma säkra session och tenant-isolering som webbläsararbetsytan.",
        },
        {
          heading: "Offline-beteende",
          body:
            "Begränsat cachelagrat innehåll kan vara tillgängligt tillfälligt, men Aipify är designad för uppkopplat operativt arbete. Förvänta inte full offline-funktion. Inloggning, godkännanden och live operativ data kräver nätverksanslutning.",
        },
        {
          heading: "Uppdateringar",
          body:
            "När du öppnar den installerade appen laddar Aipify den senaste versionen från våra servrar. Uppdateringar visas inte nödvändigtvis på enheten förrän appen öppnas igen. Du behöver inte ladda ner eller hantera uppdateringspaket manuellt.",
        },
        {
          heading: "Ta bort eller installera om",
          body:
            "Du kan ta bort den installerade appen från webbläsar- eller enhetsinställningar när som helst. Din Aipify-konto, prenumeration och organisationsdata förändras inte. Installera om senare från Aipify-installationssidan, inloggningssidan eller webbläsarmenyn när installation stöds.",
        },
      ],
      examples: [
        {
          title: "Desktop-arbetsflöde",
          body:
            "Logga in på app.aipify.ai i Chrome → Välj Installera Aipify → Granska Aipify-panelen → Bekräfta i webbläsarens installationsdialog → Öppna Aipify från dockan eller aktivitetsfältet.",
        },
        {
          title: "Mobil-arbetsflöde",
          body:
            "Öppna app.aipify.ai i Chrome på Android → Tryck Installera Aipify eller Lägg till på hemskärmen → Bekräfta → Starta från hemskärmen med samma inloggning.",
        },
      ],
      keyTakeaways: {
        "1": "Aipify Web App är snabb åtkomst till app.aipify.ai — inte en separat produkt.",
        "2": "Inloggning, tvåfaktorsautentisering och organisationstillstånd förblir fullt ut krävda.",
        "3": "Du kan ta bort eller installera om från enhets- eller webbläsarinställningar utan att påverka prenumerationen.",
      },
      readingTime: "6 min läsning",
      publishedDate: "2026-06-21",
    },
    faqs: {
      "1": {
        q: "Vad är Aipify Web App?",
        a: "Aipify Web App installerar Aipify på hemskärmen, dockan eller aktivitetsfältet för snabb åtkomst i ett dedikerat appfönster. Du fortsätter använda app.aipify.ai med ditt befintliga konto.",
      },
      "2": {
        q: "Är det annorlunda från app.aipify.ai?",
        a: "Nej. Web App öppnar samma Aipify-arbetsyta på app.aipify.ai. Det är en praktisk ingång — inte en separat portal eller produkt.",
      },
      "3": {
        q: "Behöver jag ett separat konto?",
        a: "Nej. Använd samma Aipify-konto och organisation du redan har. Installation skapar inte en second identitet.",
      },
      "4": {
        q: "Vilka webbläsare stöder installation?",
        a: "Chrome och Edge på desktop, Chrome på Android, och Safari på iOS, iPadOS och macOS (där Lägg till på hemskärmen eller Lägg till i Dock är tillgängligt). Stöd varierar per plattform och webbläsarversion.",
      },
      "5": {
        q: "Hur installerar jag på Chrome eller Edge desktop?",
        a: "Logga in på app.aipify.ai, välj Installera Aipify från menyn eller installationssidan, granska Aipify-panelen och bekräfta i webbläsarens installationsdialog.",
      },
      "6": {
        q: "Hur installerar jag på Android?",
        a: "Öppna app.aipify.ai i Chrome, tryck Installera Aipify eller Lägg till på hemskärmen när det erbjuds, bekräfta i webbläsaren och öppna Aipify från hemskärmen.",
      },
      "7": {
        q: "Hur installerar jag på iPhone eller iPad?",
        a: "Öppna app.aipify.ai i Safari, tryck Dela → Lägg till på hemskärmen, bekräfta och starta Aipify från ikonen. Logga in med ditt befintliga konto.",
      },
      "8": {
        q: "Varför ser jag inte Installera Aipify?",
        a: "Din webbläsare eller enhet kanske inte stöder installation, appen kan redan vara installerad, eller installation kan vara begränsad på plattformen. Prova Chrome eller Edge på desktop, eller Lägg till på hemskärmen i Safari på Apple-enheter.",
      },
      "9": {
        q: "Vad händer när jag väljer Fortsätt till installation?",
        a: "Aipify visar en sammanfattning av vad installation innebär. Webbläsaren visar sedan den slutliga bekräftelsedialogen. Installation slutförs bara efter att du bekräftar i webbläsaren.",
      },
      "10": {
        q: "Kan Aipify installera utan min bekräftelse?",
        a: "Nej. Installation kräver alltid explicit bekräftelse i webbläsar- eller enhetsdialogen. Aipify installerar aldrig tyst.",
      },
      "11": {
        q: "Fungerar Web App offline?",
        a: "Begränsat cachelagrat innehåll kan visas tillfälligt, men Aipify kräver anslutning för inloggning, godkännanden och live operativt arbete. Förvänta inte full offline-funktion.",
      },
      "12": {
        q: "Hur fungerar uppdateringar?",
        a: "När du öppnar den installerade appen laddar Aipify den senaste versionen från våra servrar. Uppdateringar visas när du nästa gång öppnar appen — du hanterar inte uppdateringspaket manuellt.",
      },
      "13": {
        q: "Är Web App säker?",
        a: "Ja. Web App använder samma säker inloggning, sessionshantering och tenant-isolering som app.aipify.ai. Installation försvagar inte säkerhetskontroller.",
      },
      "14": {
        q: "Gäller tvåfaktorsautentisering fortfarande?",
        a: "Ja. Tvåfaktorsautentisering och organisationens säkerhetspolicyer gäller exakt som i webbläsararbetsytan.",
      },
      "15": {
        q: "Förblir organisationstillstånden desamma?",
        a: "Ja. Roller, Business Pack-åtkomst och godkännandepolicyer är identiska i Web App. Installation ändrar inte behörigheter.",
      },
      "16": {
        q: "Kan jag installera på flera enheter?",
        a: "Ja. Installera Aipify Web App på varje enhet du använder. Varje enhet har sin egen lokal installation medan konto och organisationsinställningar delas.",
      },
      "17": {
        q: "Hur öppnar jag Aipify efter installation?",
        a: "Öppna Aipify från hemskärmsikonen, dockan, aktivitetsfältet eller applistan — beroende på plattform. Du förblir inloggad när sessionen är aktiv.",
      },
      "18": {
        q: "Hur tar jag bort Web App?",
        a: "Ta bort den installerade appen från webbläsarens appsida, enhetens hemskärmsinställningar eller operativsystemets applista. Din Aipify-konto och data påverkas inte.",
      },
      "19": {
        q: "Kan jag installera om senare?",
        a: "Ja. Installera om från Aipify-installationssidan, inloggningssidan eller webbläsarmenyn när installation stöds på enheten.",
      },
      "20": {
        q: "Vad är standalone-läge?",
        a: "Standalone-läge öppnar Aipify i ett dedikerat appfönster utan webbläsarkrom. Chromium-webbläsare på desktop stöder full standalone-beteende. Safari och vissa mobilinstallationer kan fungera mer som en hemskärmsgenväg.",
      },
      "21": {
        q: "Ändrar installation min prenumeration?",
        a: "Nej. Installation av Web App ändrar inte plan, fakturering eller licensierade Business Packs. Det är bara en lokal åtkomstmetod.",
      },
      "22": {
        q: "Kan jag installera från inloggningssidan?",
        a: "Ja. När webbläsaren stöder installation är Installera Aipify tillgängligt från inloggningssidan och andra ingångar efter att du loggat in.",
      },
      "23": {
        q: "Vilken data lagras på min enhet?",
        a: "Enheten kan lagra cachelagrade resurser och sessionstokens för prestanda och inloggningskomfort. Operativ affärsdata förblir styrd av Aipify Core — inte duplicerad som full offline-kopia på enheten.",
      },
      "24": {
        q: "Skickar Web App aviseringar?",
        a: "Om organisationen aktiverar Presence eller desktop-aviseringar och webbläsaren tillåter det kan aviseringar visas för den installerade appen. Du kontrollerar aviseringsinställningar i Aipify och på enheten.",
      },
      "25": {
        q: "Är detta ett webbläsartillägg?",
        a: "Nej. Aipify Web App är en Progressive Web App-installation — inte ett webbläsartillägg från en tilläggsbutik.",
      },
      "26": {
        q: "Vad om installationen misslyckas?",
        a: "Prova en stödd webbläsare, se till att du är inloggad, rensa webbläsarens installationsdialog om den hänger, och försök igen. Kontakta administratör eller Aipify-support om problemet kvarstår.",
      },
      "27": {
        q: "Var kan jag få hjälp?",
        a: "Kontakta organisationsadministratör för åtkomstproblem. För produktsupport, använd organisationens Aipify-supportkanal eller Knowledge Center och installationsguiden.",
      },
      "28": {
        q: "Var är den fullständiga installationsguiden?",
        a: "Den fullständiga guiden finns på /install på Aipify-webbplatsen och i denna Knowledge Center-artikel. Plattformsspecifika steg listas för desktop, Android och Apple-enheter.",
      },
    },
  },
  da: {
    article: {
      title: "Installere Aipify Web App",
      metaDescription:
        "Installer Aipify Web App på desktop og mobil for hurtig adgang med samme sikre arbejdsområde, login og organisationstilladelser.",
      introduction:
        "Aipify Web App giver dig mulighed for at åbne Aipify fra startskærmen, docken eller proceslinjen — med samme app.aipify.ai-arbejdsområde, login og tilladelser du allerede stoler på. Det er ikke et separat produkt eller browserudvidelse.",
      sections: [
        {
          heading: "Hvad er Aipify Web App?",
          body:
            "Aipify Web App installerer Aipify på din enhed for hurtig adgang i et dedikeret appvindue. Du fortsætter med at bruge app.aipify.ai med din eksisterende konto. Det er ikke en second portal, browserudvidelse eller separat produktlicens.",
        },
        {
          heading: "Fordele",
          body:
            "Åbn Aipify med ét tryk fra startskærmen eller docken. Arbejd i et fokuseret appvindue uden browserfaner. Brug samme sikre arbejdsområde, roller, godkendelser og Business Packs du allerede har. Modtag forbedringer når Aipify udgiver opdateringer — uden at administrere en separat installation.",
        },
        {
          heading: "Understøttede platforme",
          body:
            "Chrome og Edge på desktop understøtter fuld installation med Installer Aipify. Android Chrome understøtter Tilføj til startskærm. iPhone, iPad og Safari på macOS understøtter Tilføj til Hjem-skærm eller Tilføj til Dock hvor browseren tilbyder det — med mere begrænset standalone-adfærd end Chromium-browsere.",
        },
        {
          heading: "Sikkerhed",
          body:
            "Installation omgår ikke Aipify-login, tofaktorgodkendelse eller organisationstilladelser. Følsomme handlinger kræver stadig human godkendelse under dine eksisterende politikker. Web App bruger samme sikre session og tenant-isolation som browserarbejdsområdet.",
        },
        {
          heading: "Offline-adfærd",
          body:
            "Begrænset cachelagret indhold kan være tilgængeligt kortvarigt, men Aipify er designet til tilsluttet operationelt arbejde. Forvent ikke fuld offline-funktion. Login, godkendelser og live driftsdata kræver netværksforbindelse.",
        },
        {
          heading: "Opdateringer",
          body:
            "Når du åbner den installerede app, loader Aipify den seneste version fra vores servere. Opdateringer vises ikke nødvendigvis på enheden før appen åbnes igen. Du behøver ikke downloade eller administrere opdateringspakker manuelt.",
        },
        {
          heading: "Fjern eller geninstaller",
          body:
            "Du kan fjerne den installerede app fra browser- eller enhedsindstillinger når som helst. Din Aipify-konto, abonnement og organisationsdata forbliver uændret. Geninstaller senere fra Aipify-installationssiden, login-siden eller browsermenuen når installation er understøttet.",
        },
      ],
      examples: [
        {
          title: "Desktop-workflow",
          body:
            "Log ind på app.aipify.ai i Chrome → Vælg Installer Aipify → Gennemgå Aipify-panelet → Bekræft i browserens installationsdialog → Åbn Aipify fra dock eller proceslinje.",
        },
        {
          title: "Mobil-workflow",
          body:
            "Åbn app.aipify.ai i Chrome på Android → Tryk Installer Aipify eller Tilføj til startskærm → Bekræft → Start fra startskærmen med samme login.",
        },
      ],
      keyTakeaways: {
        "1": "Aipify Web App er hurtig adgang til app.aipify.ai — ikke et separat produkt.",
        "2": "Login, tofaktorgodkendelse og organisationstilladelser forbliver fuldt ud påkrævet.",
        "3": "Du kan fjerne eller geninstallere fra enheds- eller browserindstillinger uden at påvirke abonnementet.",
      },
      readingTime: "6 min læsning",
      publishedDate: "2026-06-21",
    },
    faqs: {
      "1": {
        q: "Hvad er Aipify Web App?",
        a: "Aipify Web App installerer Aipify på startskærmen, docken eller proceslinjen for hurtig adgang i et dedikeret appvindue. Du fortsætter med at bruge app.aipify.ai med din eksisterende konto.",
      },
      "2": {
        q: "Er det anderledes end app.aipify.ai?",
        a: "Nej. Web App åbner det samme Aipify-arbejdsområde på app.aipify.ai. Det er en praktisk indgang — ikke en separat portal eller produkt.",
      },
      "3": {
        q: "Har jeg brug for en separat konto?",
        a: "Nej. Brug samme Aipify-konto og organisation du allerede har. Installation opretter ikke en second identitet.",
      },
      "4": {
        q: "Hvilke browsere understøtter installation?",
        a: "Chrome og Edge på desktop, Chrome på Android, og Safari på iOS, iPadOS og macOS (hvor Tilføj til Hjem-skærm eller Tilføj til Dock er tilgængelig). Understøttelse varierer efter platform og browserversion.",
      },
      "5": {
        q: "Hvordan installerer jeg på Chrome eller Edge desktop?",
        a: "Log ind på app.aipify.ai, vælg Installer Aipify fra menuen eller installationssiden, gennemgå Aipify-panelet, og bekræft i browserens installationsdialog.",
      },
      "6": {
        q: "Hvordan installerer jeg på Android?",
        a: "Åbn app.aipify.ai i Chrome, tryk Installer Aipify eller Tilføj til startskærm når det tilbydes, bekræft i browseren, og åbn Aipify fra startskærmen.",
      },
      "7": {
        q: "Hvordan installerer jeg på iPhone eller iPad?",
        a: "Åbn app.aipify.ai i Safari, tryk Del → Tilføj til Hjem-skærm, bekræft, og start Aipify fra ikonet. Log ind med din eksisterende konto.",
      },
      "8": {
        q: "Hvorfor ser jeg ikke Installer Aipify?",
        a: "Din browser eller enhed understøtter måske ikke installation, appen kan allerede være installeret, eller installation kan være begrænset på platformen. Prøv Chrome eller Edge på desktop, eller Tilføj til Hjem-skærm i Safari på Apple-enheder.",
      },
      "9": {
        q: "Hvad sker der når jeg vælger Fortsæt til installation?",
        a: "Aipify viser en oversigt over hvad installation indebærer. Browseren viser derefter den endelige bekræftelsesdialog. Installation fuldføres kun efter du bekræfter i browseren.",
      },
      "10": {
        q: "Kan Aipify installere uden min bekræftelse?",
        a: "Nej. Installation kræver altid eksplicit bekræftelse i browser- eller enhedsdialogen. Aipify installerer aldrig stille.",
      },
      "11": {
        q: "Fungerer Web App offline?",
        a: "Begrænset cachelagret indhold kan vises kortvarigt, men Aipify kræver forbindelse til login, godkendelser og live operationelt arbejde. Forvent ikke fuld offline-funktion.",
      },
      "12": {
        q: "Hvordan fungerer opdateringer?",
        a: "Når du åbner den installerede app, loader Aipify den seneste version fra vores servere. Opdateringer vises når du næste gang åbner appen — du administrerer ikke opdateringspakker manuelt.",
      },
      "13": {
        q: "Er Web App sikker?",
        a: "Ja. Web App bruger samme sikre login, sessionshåndtering og tenant-isolation som app.aipify.ai. Installation svækker ikke sikkerhedskontroller.",
      },
      "14": {
        q: "Gælder tofaktorgodkendelse stadig?",
        a: "Ja. Tofaktorgodkendelse og organisationens sikkerhedspolitikker gælder nøjagtigt som i browserarbejdsområdet.",
      },
      "15": {
        q: "Forbliver organisationstilladelserne de samme?",
        a: "Ja. Roller, Business Pack-adgang og godkendelsespolitikker er identiske i Web App. Installation ændrer ikke tilladelser.",
      },
      "16": {
        q: "Kan jeg installere på flere enheder?",
        a: "Ja. Installer Aipify Web App på hver enhed du bruger. Hver enhed har sin egen lokal installation mens konto og organisationsindstillinger deles.",
      },
      "17": {
        q: "Hvordan åbner jeg Aipify efter installation?",
        a: "Åbn Aipify fra startskærmikonet, docken, proceslinjen eller applisten — afhængigt af platform. Du forbliver logget ind når sessionen er aktiv.",
      },
      "18": {
        q: "Hvordan fjerner jeg Web App?",
        a: "Fjern den installerede app fra browserens appside, enhedens startskærmindstillinger eller operativsystemets appliste. Din Aipify-konto og data påvirkes ikke.",
      },
      "19": {
        q: "Kan jeg geninstallere senere?",
        a: "Ja. Geninstaller fra Aipify-installationssiden, login-siden eller browsermenuen når installation er understøttet på enheden.",
      },
      "20": {
        q: "Hvad er standalone-tilstand?",
        a: "Standalone-tilstand åbner Aipify i et dedikeret appvindue uden browserchrome. Chromium-browsere på desktop understøtter fuld standalone-adfærd. Safari og nogle mobilinstallationer kan fungere mere som en startskærmgenvej.",
      },
      "21": {
        q: "Ændrer installation mit abonnement?",
        a: "Nej. Installation af Web App ændrer ikke plan, fakturering eller licenserede Business Packs. Det er kun en lokal adgangsmetode.",
      },
      "22": {
        q: "Kan jeg installere fra login-siden?",
        a: "Ja. Når browseren understøtter installation, er Installer Aipify tilgængelig fra login-siden og andre indgange efter du har logget ind.",
      },
      "23": {
        q: "Hvilke data gemmes på min enhed?",
        a: "Enheden kan gemme cachelagrede ressourcer og sessiontokens til ydeevne og login-komfort. Operationel forretningsdata forbliver styret af Aipify Core — ikke duplikeret som fuld offline-kopi på enheden.",
      },
      "24": {
        q: "Sender Web App notifikationer?",
        a: "Hvis organisationen aktiverer Presence eller desktop-notifikationer og browseren tillader det, kan notifikationer vises for den installerede app. Du kontrollerer notifikationsindstillinger i Aipify og på enheden.",
      },
      "25": {
        q: "Er dette en browserudvidelse?",
        a: "Nej. Aipify Web App er en Progressive Web App-installation — ikke en browserudvidelse fra en udvidelsesbutik.",
      },
      "26": {
        q: "Hvad hvis installationen mislykkes?",
        a: "Prøv en understøttet browser, sørg for at du er logget ind, ryd browserens installationsdialog hvis den hænger, og prøv igen. Kontakt administrator eller Aipify-support hvis problemet fortsætter.",
      },
      "27": {
        q: "Hvor kan jeg få hjælp?",
        a: "Kontakt organisationsadministrator for adgangsproblemer. For produktsupport, brug organisationens Aipify-supportkanal eller Knowledge Center og installationsvejledningen.",
      },
      "28": {
        q: "Hvor er den fulde installationsvejledning?",
        a: "Den fulde vejledning er tilgængelig på /install på Aipify-webstedet og i denne Knowledge Center-artikel. Platformsspecifikke trin er listet for desktop, Android og Apple-enheder.",
      },
    },
  },
};

const summary = { locales: [], faqCounts: {} };

for (const locale of LOCALES) {
  const filePath = path.join(ROOT, "locales", locale, "marketing.json");
  const marketing = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const localeContent = content[locale];

  const patch = {
    publicKnowledge: {
      articles: {
        [SLUG]: localeContent.article,
      },
      faqs: {
        [SLUG]: localeContent.faqs,
      },
    },
  };

  deepMerge(marketing, patch);

  fs.writeFileSync(filePath, `${JSON.stringify(marketing, null, 2)}\n`);

  const faqCount = Object.keys(marketing.publicKnowledge.faqs[SLUG]).length;
  summary.locales.push(locale);
  summary.faqCounts[locale] = faqCount;

  console.log(
    `Patched ${locale}/marketing.json — article: publicKnowledge.articles.${SLUG}, faqs: publicKnowledge.faqs.${SLUG} (${faqCount} entries)`,
  );
}

console.log("Phase 620 web app KC content applied.");
console.log(`Locales patched: ${summary.locales.join(", ")}`);
console.log(`FAQ counts: ${JSON.stringify(summary.faqCounts)}`);
