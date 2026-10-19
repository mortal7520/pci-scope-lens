/* Content script: scan the current page for PCI scope signals. No network. */
(function () {
  "use strict";

  function scanPage() {
    const iframes = Array.from(document.querySelectorAll("iframe")).map((f) => ({
      src: f.src || "",
      title: f.title || "",
    }));
    const providerIframes = [];
    for (const f of iframes) {
      const p = window.PCIScopeLens.providerFromSrc(f.src);
      if (p) providerIframes.push(p);
    }

    const directFields = [];
    for (const el of Array.from(document.querySelectorAll("input, select"))) {
      if (window.PCIScopeLens.isCardField(el)) {
        directFields.push({
          name: el.name || "",
          id: el.id || "",
          type: el.type || "",
          autocomplete: el.autocomplete || "",
        });
      }
    }

    const forms = Array.from(document.querySelectorAll("form")).map((f) => ({
      action: f.action || "",
      method: (f.method || "get").toLowerCase(),
    }));
    const formsWithPaymentAction = forms.some((f) =>
      /(checkout|payment|pay|billing|order)/i.test(f.action)
    );

    const mixedContent =
      location.protocol === "https:" &&
      Array.from(document.querySelectorAll("img, script, link, iframe")).some((el) => {
        const u = el.src || el.href || "";
        return u.startsWith("http://");
      });

    return {
      url: location.href,
      https: location.protocol === "https:",
      providerIframes,
      iframes,
      directFields,
      forms,
      formsWithPaymentAction,
      mixedContent,
    };
  }

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg && msg.type === "scan") {
      try {
        sendResponse(scanPage());
      } catch (e) {
        sendResponse({ error: String(e) });
      }
    }
    return true;
  });
})();
