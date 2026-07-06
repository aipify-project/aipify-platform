(function websiteKompisEmbedLoader() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  if (window.__AIPIFY_WEBSITE_KOMPIS_EMBED__) {
    return;
  }

  var currentScript = document.currentScript;
  if (!currentScript) {
    return;
  }

  var installId = (currentScript.getAttribute("data-install-id") || "").trim();
  var domain = (currentScript.getAttribute("data-domain") || "").trim().toLowerCase();
  var locale = (currentScript.getAttribute("data-locale") || "no").trim().toLowerCase();
  var coreOrigin = (currentScript.getAttribute("data-core-origin") || "https://aipify.ai")
    .trim()
    .replace(/\/$/, "");

  if (!installId || !domain) {
    return;
  }

  var params = new URLSearchParams({
    installId: installId,
    domain: domain,
    locale: locale || "no",
  });

  var iframe = document.createElement("iframe");
  iframe.src = coreOrigin + "/embed/website-kompis?" + params.toString();
  iframe.title = "Website Kompis";
  iframe.setAttribute("aria-label", "Website Kompis");
  iframe.setAttribute("loading", "lazy");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "420px";
  iframe.style.height = "640px";
  iframe.style.border = "0";
  iframe.style.zIndex = "9999";
  iframe.style.maxWidth = "100vw";
  iframe.style.maxHeight = "100vh";
  iframe.style.background = "transparent";

  document.body.appendChild(iframe);
  window.__AIPIFY_WEBSITE_KOMPIS_EMBED__ = true;
})();
