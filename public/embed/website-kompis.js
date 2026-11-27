(function websiteKompisEmbedLoader() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  if (window.__AIPIFY_WEBSITE_KOMPIS_EMBED__) {
    return;
  }

  var currentScript = document.currentScript;
  // A host may insert this file after publishing data-aipify-kompis-access.
  // Dynamic insertion often leaves document.currentScript null; one matching tag is enough.
  if (!currentScript) {
    var loaderScripts = document.querySelectorAll('script[src*="/embed/website-kompis.js"]');
    currentScript = loaderScripts.length === 1 ? loaderScripts[0] : null;
  }
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

  // Claim this page before classification. A host failover must not add another frame
  // while access is still being resolved.
  window.__AIPIFY_WEBSITE_KOMPIS_EMBED__ = true;

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
    se: true,
    da: true,
    dk: true,
    pl: true,
    uk: true,
    es: true,
    de: true,
    fr: true,
  };
  var SKIP_ANCESTOR_SELECTOR = "form, input, textarea, select, button, script, style, noscript";
  var UNSAFE_CONTENT_SELECTOR = "form, input, textarea, select, script, style, noscript, [contenteditable='true']";
  var CHROME_SELECTOR = "nav, footer, [role='navigation']";
  var OPEN_DETAILS_SELECTOR =
    "main details[open], article details[open], [role='main'] details[open], [class*='faq'] details[open], [class*='Faq'] details[open], [class*='accordion'] details[open], section details[open]";
  var EXPANDED_CONTROL_SELECTOR =
    "main [aria-expanded='true'], article [aria-expanded='true'], [role='main'] [aria-expanded='true'], [class*='faq'] [aria-expanded='true'], [class*='Faq'] [aria-expanded='true'], [class*='accordion'] [aria-expanded='true'], section [aria-expanded='true']";
  var ANSWER_PANEL_SELECTOR =
    "main [class*='faq-answer'], main [class*='FaqAnswer'], article [class*='faq-answer'], article [class*='FaqAnswer'], [role='main'] [class*='faq-answer'], [class*='faq'] [class*='faq-answer'], [class*='Faq'] [class*='faq-answer'], [class*='faq'] [class*='FaqAnswer'], section [class*='faq-answer'], section [class*='FaqAnswer'], main [class*='accordion-panel'], article [class*='accordion-panel'], [role='main'] [class*='accordion-panel'], [class*='accordion'] [class*='accordion-panel'], section [class*='accordion-panel']";
  var ANSWER_PANEL_CLASS_HINT =
    /faq[-_]?answer|accordion[-_]?(?:panel|content|body)|disclosure[-_]?(?:panel|content)|panel[-_]?body|answer[-_]?body/i;
  var EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
  var TOKEN_PATTERN =
    /\b(?:eyJ[A-Za-z0-9_-]{10,}|Bearer\s+[A-Za-z0-9._-]{10,}|session[_-]?id\s*[:=]\s*\S+|api[_-]?key\s*[:=]\s*\S+)\b/gi;

  function localePathPrimary(segment) {
    var primary = String(segment || "").split("-")[0];
    return LOCALE_SEGMENTS[primary] ? primary : "";
  }

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
    if (base === "se") return "sv";
    if (base === "dk") return "da";
    return base;
  }

  /**
   * Raw page candidate for FAQ content. The server registry accepts the 30 codes.
   * Do not split zh-Hans or pt-BR down to a primary tag here.
   */
  function readContentLocaleCandidate(value) {
    var normalized = String(value || "")
      .trim()
      .toLowerCase()
      .replace(/_/g, "-");
    if (!normalized || normalized.length > MAX_LOCALE_LENGTH) return "";
    if (!/^[a-z]{2,3}(-[a-z0-9]{2,8}){0,2}$/.test(normalized)) return "";
    return normalized;
  }

  function resolveContentLocaleCandidate() {
    var path = String(window.location.pathname || "").toLowerCase();
    var parts = path.split("/").filter(Boolean);
    var segment = parts.length > 0 ? readContentLocaleCandidate(parts[0]) : "";
    var segmentPrimary = segment ? segment.split("-")[0] : "";
    if (segment && LOCALE_SEGMENTS[segmentPrimary]) return segment;
    var htmlLang = document.documentElement && document.documentElement.getAttribute
      ? document.documentElement.getAttribute("lang")
      : "";
    var fromHtml = readContentLocaleCandidate(htmlLang);
    if (fromHtml) return fromHtml;
    var fromData = readContentLocaleCandidate(dataLocale);
    if (fromData) return fromData;
    if (segment && /^[a-z]{2}$/.test(segment)) return segment;
    return "";
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
    if (parts.length > 0 && localePathPrimary(parts[0])) {
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
    // No adapter yet. Private paths are rejected before this return.
    // A missing attribute must not become public on those member routes.
    return "missing";
  }

  var surfaceActive = false;
  var lastAccessClass = "unknown";
  var disclosureRefreshTimer = null;

  function resolveSurfaceActive(accessClass) {
    return accessClass === "public";
  }

  /**
   * Host access + Core path failsafe. Explicit host public must not override
   * a known private surface path. /login and /register are not in PRIVATE_PATH_PREFIXES.
   */
  function resolveEffectiveAccessClass(pathnameOverride) {
    var pathname =
      pathnameOverride != null
        ? String(pathnameOverride)
        : String(window.location.pathname || "");
    if (isPrivatePathname(pathname)) {
      return "private";
    }
    var hostAccess = readHostAccessClass();
    if (hostAccess === "missing") {
      return "public";
    }
    return hostAccess;
  }

  function syncIframeMount(active) {
    if (!active) {
      pendingOpenResize = null;
      lastOpenRequested = false;
      shellReady = false;
      closedHandshakeDone = false;
      closedPaintCommitted = false;
      cancelClosedPaintCommit();
      iframe.removeAttribute("src");
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
      return;
    }
    if (!iframe.getAttribute("src")) {
      iframe.src = embedSrc;
    }
    if (!iframe.parentNode && document.body) {
      document.body.appendChild(iframe);
    }
  }

  function applySurfaceVisibility(active) {
    syncIframeMount(active);
    if (!iframe.parentNode) return;
    if (active) {
      iframe.style.display = "block";
      iframe.style.visibility = "visible";
      iframe.setAttribute("aria-hidden", "false");
      // Re-assert closed host geometry when reactivating unless the panel is open.
      if (!lastOpenRequested) {
        applyResize(false);
      } else {
        markShellReady();
      }
    } else {
      iframe.style.display = "none";
      iframe.style.visibility = "hidden";
      iframe.style.pointerEvents = "none";
      iframe.style.opacity = "0";
      iframe.setAttribute("aria-hidden", "true");
      lastOpenRequested = false;
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

  function clearDisclosureRefreshTimer() {
    if (disclosureRefreshTimer) {
      window.clearTimeout(disclosureRefreshTimer);
      disclosureRefreshTimer = null;
    }
  }

  function applyAccessClass(nextAccessClass, options) {
    var accessClass = parseAccessClass(nextAccessClass);
    var nextActive = resolveSurfaceActive(accessClass);
    var clearContext = !nextActive || (options && options.forceClear);
    var becameInactive = surfaceActive && !nextActive;
    surfaceActive = nextActive;
    lastAccessClass = accessClass;
    applySurfaceVisibility(nextActive);
    if (!nextActive) {
      clearDisclosureRefreshTimer();
      clearActiveDisclosure();
    }
    if (clearContext || becameInactive) {
      clearActiveDisclosure();
      postSurfaceToIframe(accessClass, nextActive, true);
    } else {
      postSurfaceToIframe(accessClass, nextActive, false);
    }
    if (nextActive && !(options && options.skipContext)) {
      postPageContextToIframe();
    }
  }

  function applyAccessClassFromEnvironment(options) {
    applyAccessClass(resolveEffectiveAccessClass(), options);
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
    if (!localePathPrimary(parts[0])) {
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

  function isInsideUnsafeContent(element) {
    if (!element || !element.closest) {
      return false;
    }
    return Boolean(element.closest(UNSAFE_CONTENT_SELECTOR));
  }

  function isInsideChrome(element) {
    if (!element || !element.closest) {
      return false;
    }
    return Boolean(element.closest(CHROME_SELECTOR));
  }

  function isOpenDetailsElement(element) {
    if (!element) return false;
    if (element.open === true) return true;
    var openAttr = element.getAttribute ? element.getAttribute("open") : null;
    return openAttr === "" || openAttr === "true" || openAttr != null;
  }

  function isElementVisiblyOpen(element) {
    if (!element) return false;
    if (element.hidden) return false;
    if (element.getAttribute && element.getAttribute("aria-hidden") === "true") return false;
    if (element.closest) {
      if (element.closest("[hidden], [aria-hidden='true']")) return false;
      var detailsAncestor = element.closest("details");
      if (detailsAncestor && detailsAncestor !== element && !isOpenDetailsElement(detailsAncestor)) {
        return false;
      }
    }
    try {
      if (window.getComputedStyle) {
        var style = window.getComputedStyle(element);
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          style.opacity === "0"
        ) {
          return false;
        }
      }
    } catch (_error) {
      // Ignore computed-style failures; fall through to attribute checks.
    }
    return true;
  }

  function resolveExpandedAnswerPanel(control) {
    if (!control) return null;
    var controlsId = control.getAttribute ? String(control.getAttribute("aria-controls") || "").trim() : "";
    if (controlsId) {
      var byId = document.getElementById(controlsId);
      if (byId) return byId;
    }
    var sibling = control.nextElementSibling;
    for (var step = 0; sibling && step < 4; step += 1) {
      var role = sibling.getAttribute ? sibling.getAttribute("role") : "";
      var className = String(sibling.className || "");
      var dataState = sibling.getAttribute ? sibling.getAttribute("data-state") : "";
      if (role === "region" || ANSWER_PANEL_CLASS_HINT.test(className) || dataState === "open") {
        return sibling;
      }
      sibling = sibling.nextElementSibling;
    }
    return null;
  }

  function detailsAnswerText(details) {
    var summary = details.querySelector ? details.querySelector("summary") : null;
    var summaryText = summary && summary.textContent ? String(summary.textContent).trim() : "";
    var full = details.textContent ? String(details.textContent) : "";
    if (summaryText) {
      var idx = full.indexOf(summaryText);
      if (idx >= 0) {
        full = full.slice(0, idx) + " " + full.slice(idx + summaryText.length);
      }
    }
    return full;
  }

  function findAssociatedDisclosureQuestion(panel) {
    var panelId = panel && panel.id ? String(panel.id).trim() : "";
    if (panelId) {
      var controls = document.querySelectorAll(EXPANDED_CONTROL_SELECTOR);
      for (var i = 0; i < controls.length; i += 1) {
        var control = controls[i];
        var controlsId = control.getAttribute ? String(control.getAttribute("aria-controls") || "").trim() : "";
        if (controlsId === panelId) {
          return control.textContent || "";
        }
      }
    }
    if (panel && panel.closest) {
      var details = panel.closest("details");
      if (details && details.querySelector) {
        var summary = details.querySelector("summary");
        if (summary && summary.textContent) return summary.textContent;
      }
    }
    return "";
  }

  function formatOpenPanelSnippet(questionRaw, answerRaw) {
    var question = normalizeText(questionRaw, MAX_HEADING_LENGTH);
    var answer = normalizeText(answerRaw, MAX_TEXT_SNIPPET_LENGTH);
    if (!answer || answer.length < 12) return "";
    if (!question) return answer;
    var questionPrefix = question.slice(0, 48).toLowerCase();
    if (questionPrefix && answer.toLowerCase().indexOf(questionPrefix) !== -1) {
      return answer;
    }
    return normalizeText(question + ": " + answer, MAX_TEXT_SNIPPET_LENGTH);
  }

  function isInsideAlreadyCapturedOpenDisclosure(element) {
    if (!element || !element.closest) return false;
    var details = element.closest("details");
    if (details && isOpenDetailsElement(details)) return true;
    var node = element;
    for (var depth = 0; node && depth < 8; depth += 1) {
      if (ANSWER_PANEL_CLASS_HINT.test(String(node.className || ""))) {
        return isElementVisiblyOpen(node);
      }
      node = node.parentElement;
    }
    return false;
  }

  // Visitor-activated disclosure only (not SSR default-open DOM order).
  var lastActiveDisclosure = null;
  var pendingUserDisclosureControl = null;
  var pendingUserDisclosureAt = 0;

  function clearActiveDisclosure() {
    lastActiveDisclosure = null;
    pendingUserDisclosureControl = null;
    pendingUserDisclosureAt = 0;
  }

  function findDisclosureControlFromTarget(target) {
    if (!target || !target.closest) return null;
    var control = target.closest("[aria-expanded], summary");
    if (control) return control;
    var answerPanel = target.closest
      ? target.closest("[class*='faq-answer'], [class*='FaqAnswer'], [class*='accordion-panel'], [role='region']")
      : null;
    if (!answerPanel) return null;
    var panelId = answerPanel.id ? String(answerPanel.id).trim() : "";
    if (panelId) {
      var controls = document.querySelectorAll("[aria-controls]");
      for (var ci = 0; ci < controls.length; ci += 1) {
        var candidate = controls[ci];
        var controlsId = candidate.getAttribute
          ? String(candidate.getAttribute("aria-controls") || "").trim()
          : "";
        if (controlsId === panelId) return candidate;
      }
    }
    var prev = answerPanel.previousElementSibling;
    if (prev && prev.getAttribute && prev.getAttribute("aria-expanded") != null) {
      return prev;
    }
    return null;
  }

  function rememberActiveDisclosureFromControl(control) {
    if (!control || isInsideUnsafeContent(control) || isInsideChrome(control)) return;
    var question = "";
    var answer = "";
    var panel = null;
    var tag = String(control.tagName || "").toUpperCase();
    if (tag === "SUMMARY" && control.parentElement) {
      var details = control.parentElement;
      if (!isOpenDetailsElement(details) || !isElementVisiblyOpen(details)) return;
      question = control.textContent || "";
      answer = detailsAnswerText(details);
      panel = details;
    } else {
      if (control.getAttribute && control.getAttribute("aria-expanded") !== "true") return;
      panel = resolveExpandedAnswerPanel(control);
      if (!panel || !isElementVisiblyOpen(panel)) return;
      if (isInsideUnsafeContent(panel) || isInsideChrome(panel)) return;
      question = control.textContent || "";
      answer = panel.textContent || "";
    }
    var snippet = formatOpenPanelSnippet(question, answer);
    if (!snippet) return;
    lastActiveDisclosure = {
      question: normalizeText(question, MAX_HEADING_LENGTH),
      answer: normalizeText(answer, MAX_TEXT_SNIPPET_LENGTH),
      panel: panel,
      control: control,
      snippet: snippet,
    };
  }

  function onDisclosureUserActivate(event) {
    if (!event || !event.target) return;
    var control = findDisclosureControlFromTarget(event.target);
    if (!control) return;
    pendingUserDisclosureControl = control;
    pendingUserDisclosureAt = Date.now();
    // Already-open panel: click/focus activates it without an attribute change.
    rememberActiveDisclosureFromControl(control);
    scheduleDisclosurePageContextRefresh();
  }

  function collectOpenDisclosureSnippets(pushSnippet, textSnippets) {
    // Prefer visitor-activated panel (one 240-char slot), then other open panels.
    if (lastActiveDisclosure) {
      var activePanel = lastActiveDisclosure.panel;
      var activeControl = lastActiveDisclosure.control;
      var stillOpen = false;
      if (activePanel && isElementVisiblyOpen(activePanel)) {
        if (activeControl && activeControl.getAttribute) {
          var tagName = String(activeControl.tagName || "").toUpperCase();
          if (tagName === "SUMMARY") {
            stillOpen = activeControl.parentElement
              ? isOpenDetailsElement(activeControl.parentElement)
              : false;
          } else {
            stillOpen = activeControl.getAttribute("aria-expanded") === "true";
          }
        } else {
          stillOpen = true;
        }
      }
      if (stillOpen && lastActiveDisclosure.snippet) {
        pushSnippet(lastActiveDisclosure.snippet);
      } else {
        clearActiveDisclosure();
      }
    }

    var detailsNodes = document.querySelectorAll(OPEN_DETAILS_SELECTOR);
    for (var d = 0; d < detailsNodes.length && textSnippets.length < MAX_TEXT_SNIPPETS; d += 1) {
      var details = detailsNodes[d];
      if (isInsideUnsafeContent(details) || isInsideChrome(details)) continue;
      if (!isOpenDetailsElement(details) || !isElementVisiblyOpen(details)) continue;
      var summary = details.querySelector ? details.querySelector("summary") : null;
      var detailsSnippet = formatOpenPanelSnippet(
        summary && summary.textContent ? summary.textContent : "",
        detailsAnswerText(details),
      );
      if (detailsSnippet) pushSnippet(detailsSnippet);
    }

    var expandedControls = document.querySelectorAll(EXPANDED_CONTROL_SELECTOR);
    for (var e = 0; e < expandedControls.length && textSnippets.length < MAX_TEXT_SNIPPETS; e += 1) {
      var control = expandedControls[e];
      if (isInsideUnsafeContent(control) || isInsideChrome(control)) continue;
      if (!control.getAttribute || control.getAttribute("aria-expanded") !== "true") continue;
      var panel = resolveExpandedAnswerPanel(control);
      if (!panel) continue;
      if (isInsideUnsafeContent(panel) || isInsideChrome(panel)) continue;
      if (!isElementVisiblyOpen(panel)) continue;
      if (panel.closest) {
        var panelDetails = panel.closest("details");
        if (panelDetails && isOpenDetailsElement(panelDetails)) continue;
      }
      var expandedSnippet = formatOpenPanelSnippet(control.textContent || "", panel.textContent || "");
      if (expandedSnippet) pushSnippet(expandedSnippet);
    }

    var answerPanels = document.querySelectorAll(ANSWER_PANEL_SELECTOR);
    for (var a = 0; a < answerPanels.length && textSnippets.length < MAX_TEXT_SNIPPETS; a += 1) {
      var answerPanel = answerPanels[a];
      if (isInsideUnsafeContent(answerPanel) || isInsideChrome(answerPanel)) continue;
      if (!isElementVisiblyOpen(answerPanel)) continue;
      if (answerPanel.closest) {
        var closedDetails = answerPanel.closest("details");
        if (closedDetails && !isOpenDetailsElement(closedDetails)) continue;
      }
      var answerPanelId = answerPanel.id ? String(answerPanel.id).trim() : "";
      if (answerPanelId) {
        var allControls = document.querySelectorAll(
          "main [aria-expanded], article [aria-expanded], [role='main'] [aria-expanded], [class*='faq'] [aria-expanded], [class*='Faq'] [aria-expanded], [class*='accordion'] [aria-expanded], section [aria-expanded]",
        );
        var controlledByExpanded = false;
        var controlledByCollapsed = false;
        for (var c = 0; c < allControls.length; c += 1) {
          var linked = allControls[c];
          var linkedId = linked.getAttribute
            ? String(linked.getAttribute("aria-controls") || "").trim()
            : "";
          if (linkedId !== answerPanelId) continue;
          var expanded = linked.getAttribute ? linked.getAttribute("aria-expanded") : "";
          if (expanded === "true") controlledByExpanded = true;
          if (expanded === "false") controlledByCollapsed = true;
        }
        if (controlledByCollapsed && !controlledByExpanded) continue;
      }
      var classSnippet = formatOpenPanelSnippet(
        findAssociatedDisclosureQuestion(answerPanel),
        answerPanel.textContent || "",
      );
      if (classSnippet) pushSnippet(classSnippet);
    }
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
      var lower = snippetText.toLowerCase();
      for (var s = 0; s < textSnippets.length; s += 1) {
        if (textSnippets[s].toLowerCase().indexOf(lower) !== -1) {
          return;
        }
      }
      if (textSnippets.length >= MAX_TEXT_SNIPPETS) {
        return;
      }
      textSnippets.push(snippetText);
    }

    // Open FAQ/accordion panels first so early generic paragraphs cannot displace them.
    collectOpenDisclosureSnippets(pushSnippet, textSnippets);

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
      if (isInsideAlreadyCapturedOpenDisclosure(paragraphNode)) {
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
    var contentLocale = resolveContentLocaleCandidate();
    if (contentLocale) {
      pageContext.locale = normalizeText(contentLocale, MAX_LOCALE_LENGTH);
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
  var embedSrc = coreOrigin + "/embed/website-kompis?" + params.toString();

  var iframe = document.createElement("iframe");
  iframe.title = "Website Kompis";
  iframe.setAttribute("aria-label", "Website Kompis");
  // Eager load — lazy delays the closed resize handshake and can leave a host-sized blank frame.
  iframe.setAttribute("allow", "clipboard-write");
  iframe.setAttribute("allowtransparency", "true");
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
  iframe.style.backgroundColor = "transparent";
  iframe.style.colorScheme = "normal";
  iframe.style.overflow = "hidden";
  iframe.style.pointerEvents = "none";
  iframe.style.opacity = "0";
  iframe.setAttribute("scrolling", "no");

  var shellReady = false;
  /** First closed resize must win before the host frame may become visible or accept open size. */
  var closedHandshakeDone = false;
  /**
   * Open host geometry is deferred until closed 72×72 has been committed to a painted frame.
   * Otherwise restore/hydration can enlarge the iframe while the child still paints closed
   * launcher chrome — a large white host plane with the mascot in the top-left.
   */
  var closedPaintCommitted = false;
  var closedPaintRaf1 = 0;
  var closedPaintRaf2 = 0;
  /** Stashed open intent while closed paint is not yet committed (or handshake pending). */
  var pendingOpenResize = null;
  var lastOpenRequested = false;
  var lastPathname = String(window.location.pathname || "");
  var lastHref = String(window.location.href || "");

  function markShellReady() {
    // Never reveal a panel-sized (or empty) host frame before a closed 72×72 handshake.
    if (!closedHandshakeDone) return;
    if (!surfaceActive) {
      iframe.style.opacity = "0";
      iframe.style.pointerEvents = "none";
      return;
    }
    if (shellReady) {
      iframe.style.opacity = "1";
      iframe.style.pointerEvents = "auto";
      return;
    }
    shellReady = true;
    iframe.style.opacity = "1";
    iframe.style.pointerEvents = "auto";
  }

  function cancelClosedPaintCommit() {
    if (closedPaintRaf1 && typeof window.cancelAnimationFrame === "function") {
      window.cancelAnimationFrame(closedPaintRaf1);
    }
    if (closedPaintRaf2 && typeof window.cancelAnimationFrame === "function") {
      window.cancelAnimationFrame(closedPaintRaf2);
    }
    closedPaintRaf1 = 0;
    closedPaintRaf2 = 0;
  }

  function flushPendingOpenResize() {
    if (!pendingOpenResize || !closedPaintCommitted || !closedHandshakeDone) {
      return;
    }
    if (!surfaceActive) {
      pendingOpenResize = null;
      return;
    }
    var pending = pendingOpenResize;
    pendingOpenResize = null;
    applyResize(true, pending.width, pending.height);
  }

  function scheduleClosedPaintCommit() {
    if (closedPaintCommitted) {
      flushPendingOpenResize();
      return;
    }
    cancelClosedPaintCommit();
    if (typeof window.requestAnimationFrame !== "function") {
      closedPaintCommitted = true;
      flushPendingOpenResize();
      return;
    }
    closedPaintRaf1 = window.requestAnimationFrame(function onClosedPaintFrame1() {
      closedPaintRaf1 = 0;
      closedPaintRaf2 = window.requestAnimationFrame(function onClosedPaintFrame2() {
        closedPaintRaf2 = 0;
        closedPaintCommitted = true;
        flushPendingOpenResize();
      });
    });
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
    clearActiveDisclosure();
    clearDisclosureRefreshTimer();
    locale = resolveRuntimeLocale();
    applyAccessClassFromEnvironment();
  }

  function patchHistoryMethod(methodName) {
    var original = window.history[methodName];
    if (typeof original !== "function") return;
    window.history[methodName] = function patchedHistory() {
      var result = original.apply(this, arguments);
      maybePostPageContextOnRouteChange();
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

  function applyResize(open, width, height) {
    var viewport = readHostViewportSize();
    var viewportWidth = viewport.width;
    var viewportHeight = viewport.height;
    var nextWidth = CLOSED_WIDTH;
    var nextHeight = CLOSED_HEIGHT;
    var wantOpen = Boolean(open);
    // Premature open sizing before a closed handshake paints a large white host frame
    // with only the closed launcher chrome — stash intent; do not fake a closed handshake.
    if (wantOpen && !closedHandshakeDone) {
      pendingOpenResize = {
        width: typeof width === "number" ? width : undefined,
        height: typeof height === "number" ? height : undefined,
      };
      return;
    }
    // Inactive/private surface must never retain panel geometry for a later reveal.
    if (wantOpen && !surfaceActive) {
      pendingOpenResize = null;
      wantOpen = false;
    }
    // After handshake, defer open enlarge until closed chrome has painted at 72×72.
    // Sync restore/hydration often posts open=true in the same turn as the first closed
    // reveal; applying open immediately leaves closed launcher chrome inside a panel frame.
    if (wantOpen && !closedPaintCommitted) {
      pendingOpenResize = {
        width: typeof width === "number" ? width : undefined,
        height: typeof height === "number" ? height : undefined,
      };
      wantOpen = false;
    } else if (wantOpen) {
      pendingOpenResize = null;
    } else if (!open && closedHandshakeDone) {
      // Explicit close after handshake drops stashed open. Use original `open` (not
      // coerced wantOpen) so a deferred open that falls through as closed keeps pending.
      pendingOpenResize = null;
    }
    lastOpenRequested = wantOpen;
    if (wantOpen) {
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
    if (!wantOpen) {
      // Fail closed: never keep a panel-sized host frame while Kompis is closed.
      nextWidth = CLOSED_WIDTH;
      nextHeight = CLOSED_HEIGHT;
      closedHandshakeDone = true;
      // Keep closedPaintCommitted once true so user open-after-close is not double-rAF delayed.
      // Only the first closed→open bootstrap needs the paint gate.
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
    if (!wantOpen) {
      markShellReady();
      scheduleClosedPaintCommit();
    } else if (closedHandshakeDone) {
      markShellReady();
    }
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
    // Re-evaluate path failsafe before capture (SPA mid-flight / stale timers).
    var effective = resolveEffectiveAccessClass();
    if (effective !== "public") {
      applyAccessClass(effective, { skipContext: true, forceClear: true });
      return;
    }
    if (!surfaceActive || lastAccessClass !== "public") {
      applyAccessClass("public", { skipContext: true });
    }
    if (!surfaceActive || lastAccessClass !== "public") {
      postSurfaceToIframe(lastAccessClass, false, true);
      return;
    }
    var pageContext = capturePageContext();
    if (!pageContext) {
      // null must clear — never keep a stale public snapshot on denied/miss.
      postSurfaceToIframe(lastAccessClass, true, true);
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
    applyAccessClassFromEnvironment({ skipContext: false });
  });

  if (typeof MutationObserver === "function" && document.documentElement) {
    var accessObserver = new MutationObserver(function onAccessAttrChange() {
      applyAccessClassFromEnvironment();
    });
    accessObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [ACCESS_DATA_ATTR],
    });
  }

  // Re-capture when visitors open/close FAQ/accordion panels so ask does not use a stale snapshot.
  function scheduleDisclosurePageContextRefresh() {
    if (!surfaceActive || lastAccessClass !== "public") {
      return;
    }
    if (isPrivatePathname(String(window.location.pathname || ""))) {
      applyAccessClassFromEnvironment({ forceClear: true });
      return;
    }
    if (disclosureRefreshTimer) {
      window.clearTimeout(disclosureRefreshTimer);
    }
    disclosureRefreshTimer = window.setTimeout(function onDisclosureRefresh() {
      disclosureRefreshTimer = null;
      if (!surfaceActive || lastAccessClass !== "public") {
        return;
      }
      postPageContextToIframe();
    }, 120);
  }

  document.addEventListener("click", onDisclosureUserActivate, true);
  document.addEventListener("focusin", onDisclosureUserActivate, true);

  if (typeof MutationObserver === "function" && document.body) {
    var disclosureObserver = new MutationObserver(function onDisclosureMutation(mutations) {
      var shouldRefresh = false;
      for (var i = 0; i < mutations.length; i += 1) {
        var mutation = mutations[i];
        if (mutation.type !== "attributes") continue;
        var attr = mutation.attributeName;
        if (
          attr !== "open" &&
          attr !== "aria-expanded" &&
          attr !== "aria-hidden" &&
          attr !== "hidden" &&
          attr !== "data-state" &&
          attr !== "class" &&
          attr !== "style"
        ) {
          continue;
        }
        shouldRefresh = true;
        // Only promote last-active from attribute opens tied to a recent user gesture.
        var target = mutation.target;
        if (
          target &&
          pendingUserDisclosureControl &&
          Date.now() - pendingUserDisclosureAt < 1000 &&
          (target === pendingUserDisclosureControl ||
            (pendingUserDisclosureControl.contains &&
              pendingUserDisclosureControl.contains(target)) ||
            (target.contains && target.contains(pendingUserDisclosureControl)))
        ) {
          if (attr === "aria-expanded" && target.getAttribute && target.getAttribute("aria-expanded") === "true") {
            rememberActiveDisclosureFromControl(target);
          } else if (attr === "open" && isOpenDetailsElement(target)) {
            var summary = target.querySelector ? target.querySelector("summary") : null;
            if (summary) rememberActiveDisclosureFromControl(summary);
          } else if (attr === "aria-expanded" && target.getAttribute && target.getAttribute("aria-expanded") === "false") {
            if (lastActiveDisclosure && lastActiveDisclosure.control === target) {
              clearActiveDisclosure();
            }
          }
        }
      }
      if (shouldRefresh) {
        scheduleDisclosurePageContextRefresh();
      }
    });
    disclosureObserver.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ["open", "aria-expanded", "aria-hidden", "hidden", "data-state", "class", "style"],
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
      // Open restore before the child has painted must not grow the host frame.
      if (event.data.painted !== true || !surfaceActive) {
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

  applyAccessClassFromEnvironment({ skipContext: true });
  // Failsafe: never leave an invisible host frame if the iframe never posts resize.
  // Skip when path/host already marked the surface inactive.
  // Drop pre-handshake open intent — failsafe is closed-launcher only.
  window.setTimeout(function ensureShellVisible() {
    if (!shellReady && surfaceActive) {
      pendingOpenResize = null;
      applyResize(false, CLOSED_WIDTH, CLOSED_HEIGHT);
    }
  }, 2500);
})();
