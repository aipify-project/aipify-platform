import fs from "node:fs";
import path from "node:path";

const translations = {
  no: {
    linkExpired: "Tilbakestillingslenken har utløpt. Be om en ny nedenfor.",
    linkInvalid: "Tilbakestillingslenken er ugyldig eller allerede brukt. Be om en ny nedenfor.",
    callbackFailed: "Aipify kunne ikke bekrefte lenken. Be om en ny nedenfor.",
  },
  sv: {
    linkExpired: "Återställningslänken har gått ut. Begär en ny nedan.",
    linkInvalid: "Återställningslänken är ogiltig eller redan använd. Begär en ny nedan.",
    callbackFailed: "Aipify kunde inte verifiera länken. Begär en ny nedan.",
  },
  da: {
    linkExpired: "Nulstillingslinket er udløbet. Anmod om et nyt nedenfor.",
    linkInvalid: "Nulstillingslinket er ugyldigt eller allerede brugt. Anmod om et nyt nedenfor.",
    callbackFailed: "Aipify kunne ikke bekræfte linket. Anmod om et nyt nedenfor.",
  },
  pl: {
    linkExpired: "Link resetowania wygasł. Poproś o nowy poniżej.",
    linkInvalid: "Link resetowania jest nieprawidłowy lub został już użyty. Poproś o nowy poniżej.",
    callbackFailed: "Aipify nie mogło zweryfikować linku. Poproś o nowy poniżej.",
  },
  uk: {
    linkExpired: "Посилання для скидання пароля прострочено. Запросіть нове нижче.",
    linkInvalid: "Посилання недійсне або вже використане. Запросіть нове нижче.",
    callbackFailed: "Aipify не вдалося підтвердити посилання. Запросіть нове нижче.",
  },
  es: {
    linkExpired: "El enlace de restablecimiento ha caducado. Solicita uno nuevo abajo.",
    linkInvalid: "El enlace no es válido o ya se usó. Solicita uno nuevo abajo.",
    callbackFailed: "Aipify no pudo verificar el enlace. Solicita uno nuevo abajo.",
  },
};

for (const [locale, copy] of Object.entries(translations)) {
  const filePath = path.join("locales", locale, "auth.json");
  const json = JSON.parse(fs.readFileSync(filePath, "utf8"));
  json.resetPassword.errors = copy;
  fs.writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`);
  console.log(`patched ${locale}`);
}
