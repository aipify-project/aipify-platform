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
  var dataLocale = (currentScript.getAttribute("data-locale") || "").trim().toLowerCase();
  var coreOrigin = (currentScript.getAttribute("data-core-origin") || "https://aipify.ai")
    .trim()
    .replace(/\/$/, "");

  if (!installId || !domain) {
    return;
  }

  var PAGE_CONTEXT_MESSAGE_TYPE = "aipify.websiteKompis.pageContext";
  var PAGE_CONTEXT_REQUEST_MESSAGE_TYPE = "aipify.websiteKompis.requestPageContext";
  var SURFACE_MESSAGE_TYPE = "aipify.websiteKompis.surface";
  var RESIZE_MESSAGE_TYPE = "aipify.websiteKompis.resize";
  var NAVIGATE_MESSAGE_TYPE = "aipify.websiteKompis.navigate";
  var ACCESS_DATA_ATTR = "data-aipify-kompis-access";
  var ACCESS_WINDOW_FLAG = "__AIPIFY_WEBSITE_KOMPIS_ACCESS__";
  var SUPPORTED_EMBED_LOCALES = {
    en: true,
    no: true,
    sv: true,
    da: true,
    pl: true,
    uk: true,
  };
  var CLOSED_WIDTH = 72;
  var CLOSED_HEIGHT = 72;
  var OPEN_WIDTH = 450;
  var OPEN_HEIGHT = 800;
  var OPEN_HEIGHT_MAX = 900;
  var OPEN_HEIGHT_MIN = 560;
  var VIEWPORT_HEIGHT_GUTTER = 24;
  var OPEN_FRAME_OUTSET = 12;
  var OPEN_EDGE_INSET = 12;
  var MAX_PATHNAME_LENGTH = 240;
  var MAX_TITLE_LENGTH = 200;
  var MAX_META_DESCRIPTION_LENGTH = 320;
  var MAX_HEADINGS = 12;
  var MAX_HEADING_LENGTH = 140;
  var MAX_TEXT_SNIPPETS = 8;
  var MAX_TEXT_SNIPPET_LENGTH = 240;
  var MAX_CANONICAL_URL_LENGTH = 320;
  var MAX_LOCALE_LENGTH = 16;
  // Fail-closed context deny-list only (not surface availability). Forms skipped via SKIP_ANCESTOR.
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
    "/billing",
    "/settings",
    "/logout",
    "/app",
    "/api",
    "/chat",
    "/discover",
    "/wishlist",
    "/marketplace",
  ];
  var LOCALE_SEGMENTS = {
    en: true,
    no: true,
    nb: true,
    nn: true,
    sv: true,
    da: true,
    pl: true,
    uk: true,
    es: true,
    de: true,
    fr: true,
  };
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

  function normalizeLocaleTag(value) {
    var normalized = String(value || "")
      .trim()
      .toLowerCase()
      .replace(/_/g, "-");
    if (!normalized) return "";
    var base = normalized.split("-")[0] || normalized;
    if (base === "nb" || base === "nn") return "no";
    return base;
  }

  /** Explicit unsupported host locales map to English — never Norwegian by accident. */
  function sanitizeEmbedLocale(value) {
    var normalized = normalizeLocaleTag(value);
    if (SUPPORTED_EMBED_LOCALES[normalized]) return normalized;
    if (normalized) return "en";
    return "no";
  }

  function resolveRuntimeLocale() {
    var path = String(window.location.pathname || "").toLowerCase();
    var parts = path.split("/").filter(Boolean);
    if (parts.length > 0 && LOCALE_SEGMENTS[parts[0]]) {
      return sanitizeEmbedLocale(parts[0]);
    }
    var htmlLang = document.documentElement && document.documentElement.getAttribute
      ? document.documentElement.getAttribute("lang")
      : "";
    if (htmlLang) {
      return sanitizeEmbedLocale(htmlLang);
    }
    return sanitizeEmbedLocale(dataLocale || "no");
  }

  var locale = resolveRuntimeLocale();

  function parseAccessClass(value) {
    var normalized = String(value || "")
      .trim()
      .toLowerCase();
    if (normalized === "public" || normalized === "private" || normalized === "unknown") {
      return normalized;
    }
    return "unknown";
  }

  function readHostAccessClass() {
    var docEl = document.documentElement;
    var fromDoc =
      docEl && docEl.getAttribute ? docEl.getAttribute(ACCESS_DATA_ATTR) : null;
    if (fromDoc != null && String(fromDoc).trim() !== "") {
      return parseAccessClass(fromDoc);
    }
    var fromScript =
      currentScript.getAttribute(ACCESS_DATA_ATTR) ||
      currentScript.getAttribute("data-access-class");
    if (fromScript != null && String(fromScript).trim() !== "") {
      return parseAccessClass(fromScript);
    }
    var fromWindow = window[ACCESS_WINDOW_FLAG];
    if (fromWindow != null && String(fromWindow).trim() !== "") {
      return parseAccessClass(fromWindow);
    }
    // Host chose to load this public loader without an adapter attribute yet.
    return "public";
  }

  var surfaceActive = true;
  var lastAccessClass = "public";

  function resolveSurfaceActive(accessClass) {
    return accessClass === "public";
  }

  function applySurfaceVisibility(active) {
    if (!iframe) return;
    if (active) {
      iframe.style.display = "block";
      iframe.style.visibility = "visible";
      iframe.style.pointerEvents = "auto";
      iframe.setAttribute("aria-hidden", "false");
    } else {
      iframe.style.display = "none";
      iframe.style.visibility = "hidden";
      iframe.style.pointerEvents = "none";
      iframe.setAttribute("aria-hidden", "true");
      applyResize(false);
    }
  }

  function postSurfaceToIframe(accessClass, active, clearPageContext) {
    if (!iframe || !iframe.contentWindow) return;
    iframe.contentWindow.postMessage(
      {
        type: SURFACE_MESSAGE_TYPE,
        accessClass: accessClass,
        active: active,
        clearPageContext: Boolean(clearPageContext),
      },
      coreOrigin,
    );
  }

  function applyAccessClass(nextAccessClass, options) {
    var accessClass = parseAccessClass(nextAccessClass);
    var nextActive = resolveSurfaceActive(accessClass);
    var clearContext = !nextActive || (options && options.forceClear);
    var becameInactive = surfaceActive && !nextActive;
    surfaceActive = nextActive;
    lastAccessClass = accessClass;
    applySurfaceVisibility(nextActive);
    if (clearContext || becameInactive) {
      postSurfaceToIframe(accessClass, nextActive, true);
    } else {
      postSurfaceToIframe(accessClass, nextActive, false);
    }
    if (nextActive && !(options && options.skipContext)) {
      postPageContextToIframe();
    }
  }

  function hostsMatchAllowed(candidateHost) {
    var allowed = String(domain || "").toLowerCase();
    var host = String(candidateHost || "").toLowerCase();
    if (!allowed || !host) return false;
    if (host === allowed) return true;
    if (allowed.indexOf("www.") === 0 && host === allowed.slice(4)) return true;
    if (host.indexOf("www.") === 0 && host.slice(4) === allowed) return true;
    return false;
  }

  function isAllowedNavigateHref(href) {
    try {
      var parsed = new URL(String(href || ""), window.location.href);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
      if (!hostsMatchAllowed(parsed.hostname)) return false;
      return true;
    } catch (_error) {
      return false;
    }
  }

  function stripLocalePrefix(pathname) {
    var normalized = String(pathname || "").trim().toLowerCase();
    if (!normalized.startsWith("/")) {
      return normalized;
    }
    var parts = normalized.split("/").filter(Boolean);
    if (parts.length === 0) {
      return "/";
    }
    if (!LOCALE_SEGMENTS[parts[0]]) {
      return normalized;
    }
    var rest = parts.slice(1);
    return rest.length === 0 ? "/" : "/" + rest.join("/");
  }

  function matchesPrivatePrefix(pathname) {
    for (var i = 0; i < PRIVATE_PATH_PREFIXES.length; i += 1) {
      var prefix = PRIVATE_PATH_PREFIXES[i];
      if (pathname === prefix || pathname.indexOf(prefix + "/") === 0) {
        return true;
      }
    }
    return false;
  }

  function isPrivatePathname(pathname) {
    var normalized = String(pathname || "")
      .trim()
      .toLowerCase();
    if (!normalized.startsWith("/")) {
      return true;
    }
    if (matchesPrivatePrefix(normalized)) {
      return true;
    }
    return matchesPrivatePrefix(stripLocalePrefix(normalized));
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
    if (!surfaceActive || lastAccessClass !== "public") {
      return null;
    }
    var pathname = String(window.location.pathname || "")
      .trim()
      .slice(0, MAX_PATHNAME_LENGTH);
    // Fail-closed context safety — does not decide surface availability (host adapter does).
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
    function pushSnippet(raw) {
      var snippetText = normalizeText(raw, MAX_TEXT_SNIPPET_LENGTH);
      if (!snippetText || snippetText.length < 12) {
        return;
      }
      if (textSnippets.indexOf(snippetText) !== -1) {
        return;
      }
      textSnippets.push(snippetText);
    }

    // Prefer published product/offer cards (title + price kept on same snippet).
    var productNodes = document.querySelectorAll(
      "main [class*='product'], main [class*='Product'], main [class*='offer'], main [class*='Offer'], main [data-product], main article, [role='main'] article, main li, [role='listitem']",
    );
    var PRICE_HINT = /(?:\d{1,3}(?:[.\s]\d{3})*(?:,\d{2})?|\d+(?:[.,]\d{2})?)\s*(?:kr|nok|usd|eur|\$)|(?:kr|nok)\s*\d/i;
    for (var c = 0; c < productNodes.length && textSnippets.length < MAX_TEXT_SNIPPETS; c += 1) {
      var cardNode = productNodes[c];
      if (isInsideSkipZone(cardNode)) {
        continue;
      }
      var cardText = normalizeText(cardNode.textContent, MAX_TEXT_SNIPPET_LENGTH);
      if (!cardText || !PRICE_HINT.test(cardText)) {
        continue;
      }
      if (cardText.length < 16 || cardText.length > MAX_TEXT_SNIPPET_LENGTH) {
        continue;
      }
      pushSnippet(cardText);
    }

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
      pushSnippet(snippetText);
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
    var runtimeLocale = resolveRuntimeLocale();
    if (runtimeLocale) {
      pageContext.locale = normalizeText(runtimeLocale, MAX_LOCALE_LENGTH);
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
  iframe.setAttribute("allow", "clipboard-write");
  iframe.style.position = "fixed";
  iframe.style.right = "12px";
  iframe.style.bottom = "12px";
  iframe.style.width = CLOSED_WIDTH + "px";
  iframe.style.height = CLOSED_HEIGHT + "px";
  iframe.style.border = "0";
  iframe.style.zIndex = "9999";
  iframe.style.maxWidth = "100vw";
  iframe.style.maxHeight = "100vh";
  iframe.style.background = "transparent";
  iframe.style.colorScheme = "normal";
  iframe.style.overflow = "hidden";
  iframe.style.pointerEvents = "none";
  iframe.style.opacity = "0";
  iframe.setAttribute("scrolling", "no");

  var shellReady = false;
  var lastPathname = String(window.location.pathname || "");
  var lastHref = String(window.location.href || "");

  function markShellReady() {
    if (shellReady) return;
    shellReady = true;
    iframe.style.opacity = "1";
    iframe.style.pointerEvents = "auto";
  }

  function preferredOpenPanelHeight(viewportHeight) {
    var preferred = OPEN_HEIGHT;
    if (typeof viewportHeight !== "number" || !isFinite(viewportHeight) || viewportHeight <= 0) {
      return preferred;
    }
    var reserved = VIEWPORT_HEIGHT_GUTTER + OPEN_EDGE_INSET + OPEN_FRAME_OUTSET * 2;
    var capped = Math.floor(viewportHeight - reserved);
    return Math.max(OPEN_HEIGHT_MIN, Math.min(preferred, capped, OPEN_HEIGHT_MAX));
  }

  function hostOpenSize(panelWidth, panelHeight) {
    return {
      width: Math.round(panelWidth + OPEN_FRAME_OUTSET * 2),
      height: Math.round(panelHeight + OPEN_FRAME_OUTSET * 2),
    };
  }

  function readHostViewportSize() {
    return {
      width: (window.visualViewport && window.visualViewport.width) || window.innerWidth || 0,
      height: (window.visualViewport && window.visualViewport.height) || window.innerHeight || 0,
    };
  }

  function maybePostPageContextOnRouteChange() {
    var nextPath = String(window.location.pathname || "");
    var nextHref = String(window.location.href || "");
    if (nextPath === lastPathname && nextHref === lastHref) {
      return;
    }
    lastPathname = nextPath;
    lastHref = nextHref;
    locale = resolveRuntimeLocale();
    applyAccessClass(readHostAccessClass());
  }

  function patchHistoryMethod(methodName) {
    var original = window.history[methodName];
    if (typeof original !== "function") return;
    window.history[methodName] = function patchedHistory() {
      var result = original.apply(this, arguments);
      window.setTimeout(maybePostPageContextOnRouteChange, 0);
      return result;
    };
  }
  patchHistoryMethod("pushState");
  patchHistoryMethod("replaceState");
  window.addEventListener("popstate", maybePostPageContextOnRouteChange);

  function postLocaleAwarePageContext() {
    locale = resolveRuntimeLocale();
    postPageContextToIframe();
  }

  window.addEventListener("languagechange", postLocaleAwarePageContext);
  if (typeof MutationObserver === "function" && document.documentElement) {
    var langObserver = new MutationObserver(function onHtmlLangChange() {
      postLocaleAwarePageContext();
    });
    langObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });
  }

  var lastOpenRequested = false;

  function applyResize(open, width, height) {
    var viewport = readHostViewportSize();
    var viewportWidth = viewport.width;
    var viewportHeight = viewport.height;
    var nextWidth = CLOSED_WIDTH;
    var nextHeight = CLOSED_HEIGHT;
    lastOpenRequested = Boolean(open);
    if (open) {
      // Host window decides preferred open size from real viewport (not iframe height).
      var panelHeight = preferredOpenPanelHeight(viewportHeight);
      var host = hostOpenSize(OPEN_WIDTH, panelHeight);
      nextWidth = host.width;
      nextHeight = host.height;
      // Accept embed-posted host size only when it is at least the host-preferred floor.
      // Undersized posts (legacy iframe-viewport clamp) must not shrink a spacious desktop.
      if (
        typeof width === "number" &&
        width >= host.width &&
        width <= 560
      ) {
        nextWidth = Math.round(width);
      }
      if (
        typeof height === "number" &&
        height >= host.height &&
        height <= OPEN_HEIGHT_MAX + OPEN_FRAME_OUTSET * 2
      ) {
        nextHeight = Math.round(height);
      }
    }
    if (!open) {
      // Fail closed: never keep a panel-sized host frame while Kompis is closed.
      nextWidth = CLOSED_WIDTH;
      nextHeight = CLOSED_HEIGHT;
    }
    if (viewportWidth && nextWidth > viewportWidth - OPEN_EDGE_INSET) {
      nextWidth = Math.max(CLOSED_WIDTH, Math.floor(viewportWidth - OPEN_EDGE_INSET));
    }
    if (viewportHeight && nextHeight > viewportHeight - OPEN_EDGE_INSET) {
      nextHeight = Math.max(CLOSED_HEIGHT, Math.floor(viewportHeight - OPEN_EDGE_INSET));
    }
    iframe.style.width = nextWidth + "px";
    iframe.style.height = nextHeight + "px";
    // Keep open panel inset so border/shadow are not flush-clipped against the viewport edge.
    iframe.style.right = OPEN_EDGE_INSET + "px";
    iframe.style.bottom = OPEN_EDGE_INSET + "px";
    markShellReady();
  }

  function reclampOpenFromHostViewport() {
    if (!lastOpenRequested) return;
    applyResize(true);
  }

  window.addEventListener("resize", reclampOpenFromHostViewport);
  if (window.visualViewport && typeof window.visualViewport.addEventListener === "function") {
    window.visualViewport.addEventListener("resize", reclampOpenFromHostViewport);
  }

  function postPageContextToIframe() {
    if (!iframe.contentWindow) {
      return;
    }
    if (!surfaceActive || lastAccessClass !== "public") {
      postSurfaceToIframe(lastAccessClass, false, true);
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
    applyAccessClass(readHostAccessClass(), { skipContext: false });
  });

  if (typeof MutationObserver === "function" && document.documentElement) {
    var accessObserver = new MutationObserver(function onAccessAttrChange() {
      applyAccessClass(readHostAccessClass());
    });
    accessObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [ACCESS_DATA_ATTR],
    });
  }

  window.addEventListener("message", function onEmbedMessage(event) {
    if (event.source !== iframe.contentWindow) {
      return;
    }
    if (event.origin !== coreOrigin) {
      return;
    }
    if (!event.data || typeof event.data !== "object") {
      return;
    }
    if (event.data.type === PAGE_CONTEXT_REQUEST_MESSAGE_TYPE) {
      postPageContextToIframe();
      return;
    }
    if (event.data.type === RESIZE_MESSAGE_TYPE) {
      if (typeof event.data.open !== "boolean") {
        return;
      }
      if (!event.data.open) {
        applyResize(false);
        return;
      }
      var resizeWidth = event.data.width;
      var resizeHeight = event.data.height;
      var widthOk =
        typeof resizeWidth === "number" &&
        isFinite(resizeWidth) &&
        resizeWidth >= 48 &&
        resizeWidth <= 560;
      var heightOk =
        typeof resizeHeight === "number" &&
        isFinite(resizeHeight) &&
        resizeHeight >= 48 &&
        resizeHeight <= OPEN_HEIGHT_MAX + OPEN_FRAME_OUTSET * 2;
      // Open always applies host-preferred size; optional posted dims may only grow it.
      applyResize(
        true,
        widthOk ? resizeWidth : undefined,
        heightOk ? resizeHeight : undefined,
      );
      return;
    }
    if (event.data.type === NAVIGATE_MESSAGE_TYPE) {
      var href = event.data.href;
      if (typeof href !== "string" || !isAllowedNavigateHref(href)) {
        return;
      }
      try {
        var target = new URL(href, window.location.href);
        window.location.assign(target.toString());
      } catch (_error) {
        /* ignore invalid navigation */
      }
    }
  });

  document.body.appendChild(iframe);
  window.__AIPIFY_WEBSITE_KOMPIS_EMBED__ = true;
  applyAccessClass(readHostAccessClass(), { skipContext: true });
  // Failsafe: never leave an invisible host frame if the iframe never posts resize.
  window.setTimeout(function ensureShellVisible() {
    if (!shellReady) {
      applyResize(false, CLOSED_WIDTH, CLOSED_HEIGHT);
    }
  }, 2500);
})();
