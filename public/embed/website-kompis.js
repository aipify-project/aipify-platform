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

  var PAGE_CONTEXT_MESSAGE_TYPE = "aipify.websiteKompis.pageContext";
  var PAGE_CONTEXT_REQUEST_MESSAGE_TYPE = "aipify.websiteKompis.requestPageContext";
  var MAX_PATHNAME_LENGTH = 240;
  var MAX_TITLE_LENGTH = 200;
  var MAX_META_DESCRIPTION_LENGTH = 320;
  var MAX_HEADINGS = 12;
  var MAX_HEADING_LENGTH = 140;
  var MAX_TEXT_SNIPPETS = 8;
  var MAX_TEXT_SNIPPET_LENGTH = 240;
  var MAX_CANONICAL_URL_LENGTH = 320;
  var MAX_LOCALE_LENGTH = 16;
  var PRIVATE_PATH_PREFIXES = [
    "/admin",
    "/member",
    "/members",
    "/profile",
    "/account",
    "/auth",
    "/onboarding",
    "/checkout",
    "/payment",
    "/messages",
    "/app/",
  ];
  var SKIP_ANCESTOR_SELECTOR = "form, input, textarea, select, button, script, style, noscript";
  var EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
  var TOKEN_PATTERN =
    /\b(?:eyJ[A-Za-z0-9_-]{10,}|Bearer\s+[A-Za-z0-9._-]{10,}|session[_-]?id\s*[:=]\s*\S+|api[_-]?key\s*[:=]\s*\S+)\b/gi;

  function normalizeText(value, maxLength) {
    return String(value || "")
      .replace(/<[^>]+>/g, " ")
      .replace(EMAIL_PATTERN, "")
      .replace(TOKEN_PATTERN, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, maxLength);
  }

  function isPrivatePathname(pathname) {
    var normalized = String(pathname || "")
      .trim()
      .toLowerCase();
    if (!normalized.startsWith("/")) {
      return true;
    }
    for (var i = 0; i < PRIVATE_PATH_PREFIXES.length; i += 1) {
      var prefix = PRIVATE_PATH_PREFIXES[i];
      if (normalized === prefix || normalized.indexOf(prefix + "/") === 0) {
        return true;
      }
    }
    return false;
  }

  function isInsideSkipZone(element) {
    if (!element || !element.closest) {
      return false;
    }
    return Boolean(element.closest(SKIP_ANCESTOR_SELECTOR));
  }

  function sanitizeCanonicalUrl(value) {
    var trimmed = String(value || "")
      .trim()
      .slice(0, MAX_CANONICAL_URL_LENGTH);
    if (!trimmed) {
      return undefined;
    }
    try {
      var parsed = new URL(trimmed, window.location.href);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return undefined;
      }
      return parsed.toString();
    } catch (_error) {
      return undefined;
    }
  }

  function capturePageContext() {
    var pathname = String(window.location.pathname || "")
      .trim()
      .slice(0, MAX_PATHNAME_LENGTH);
    if (!pathname.startsWith("/") || isPrivatePathname(pathname)) {
      return null;
    }

    var title = normalizeText(document.title, MAX_TITLE_LENGTH);
    var metaNode = document.querySelector('meta[name="description"]');
    var metaDescription = normalizeText(
      metaNode && metaNode.getAttribute ? metaNode.getAttribute("content") : "",
      MAX_META_DESCRIPTION_LENGTH,
    );
    var canonicalNode = document.querySelector('link[rel="canonical"]');
    var canonicalUrl = sanitizeCanonicalUrl(
      canonicalNode && canonicalNode.getAttribute ? canonicalNode.getAttribute("href") : window.location.href,
    );

    var headings = [];
    var headingNodes = document.querySelectorAll("h1, h2");
    for (var h = 0; h < headingNodes.length && headings.length < MAX_HEADINGS; h += 1) {
      var headingNode = headingNodes[h];
      if (isInsideSkipZone(headingNode)) {
        continue;
      }
      var tagName = String(headingNode.tagName || "").toUpperCase();
      var level = tagName === "H1" ? 1 : tagName === "H2" ? 2 : null;
      if (!level) {
        continue;
      }
      var headingText = normalizeText(headingNode.textContent, MAX_HEADING_LENGTH);
      if (!headingText) {
        continue;
      }
      headings.push({ level: level, text: headingText });
    }

    var textSnippets = [];
    var paragraphNodes = document.querySelectorAll("main p, article p, [role='main'] p, body > p");
    for (var p = 0; p < paragraphNodes.length && textSnippets.length < MAX_TEXT_SNIPPETS; p += 1) {
      var paragraphNode = paragraphNodes[p];
      if (isInsideSkipZone(paragraphNode)) {
        continue;
      }
      var snippetText = normalizeText(paragraphNode.textContent, MAX_TEXT_SNIPPET_LENGTH);
      if (!snippetText || snippetText.length < 24) {
        continue;
      }
      if (textSnippets.indexOf(snippetText) !== -1) {
        continue;
      }
      textSnippets.push(snippetText);
    }

    if (!title && !metaDescription && headings.length === 0 && textSnippets.length === 0) {
      return null;
    }

    var pageContext = {
      pathname: pathname,
      surface: "public",
      capturedAt: new Date().toISOString(),
    };

    if (title) {
      pageContext.title = title;
    }
    if (metaDescription) {
      pageContext.metaDescription = metaDescription;
    }
    if (canonicalUrl) {
      pageContext.canonicalUrl = canonicalUrl;
    }
    if (locale) {
      pageContext.locale = normalizeText(locale, MAX_LOCALE_LENGTH);
    }
    if (headings.length > 0) {
      pageContext.headings = headings;
    }
    if (textSnippets.length > 0) {
      pageContext.textSnippets = textSnippets;
    }

    return pageContext;
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

  function postPageContextToIframe() {
    if (!iframe.contentWindow) {
      return;
    }
    var pageContext = capturePageContext();
    if (!pageContext) {
      return;
    }
    iframe.contentWindow.postMessage(
      {
        type: PAGE_CONTEXT_MESSAGE_TYPE,
        pageContext: pageContext,
      },
      coreOrigin,
    );
  }

  iframe.addEventListener("load", function onIframeLoad() {
    postPageContextToIframe();
  });

  window.addEventListener("message", function onEmbedMessage(event) {
    if (event.source !== iframe.contentWindow) {
      return;
    }
    if (!event.data || event.data.type !== PAGE_CONTEXT_REQUEST_MESSAGE_TYPE) {
      return;
    }
    postPageContextToIframe();
  });

  document.body.appendChild(iframe);
  window.__AIPIFY_WEBSITE_KOMPIS_EMBED__ = true;
})();
