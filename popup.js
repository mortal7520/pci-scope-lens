/* Popup: ask the content script for page signals, render the verdict. */
(function () {
  "use strict";

  const CHECKLIST_URL = "https://patent-stock-twist-temporary.trycloudflare.com/assessment";

  function $(id) { return document.getElementById(id); }

  function list(el, items, fallback) {
    el.innerHTML = "";
    const arr = items && items.length ? items : [fallback];
    for (const item of arr) {
      const li = document.createElement("li");
      li.textContent = item;
      el.appendChild(li);
    }
  }

  function render(signals) {
    const a = window.PCIScopeLens.analyze(signals);
    $("loading").hidden = true;
    $("result").hidden = false;
    const badge = $("badge");
    badge.textContent = a.label;
    badge.className = "badge " + a.verdict;
    $("confidence").textContent = "confidence: " + a.confidence;
    $("reason").textContent = a.reason;

    $("providersBlock").hidden = !a.providers.length;
    list($("providers"), a.providers, "");

    $("warningsBlock").hidden = !a.warnings.length;
    list($("warnings"), a.warnings, "");

    $("fieldsBlock").hidden = !a.directFields.length;
    list(
      $("fields"),
      a.directFields.map((f) => [f.name, f.id, f.autocomplete].filter(Boolean).join(" · ")),
      ""
    );

    $("open").href = CHECKLIST_URL;
    $("copy").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(JSON.stringify(a, null, 2));
        $("copy").textContent = "Copied";
        setTimeout(() => ($("copy").textContent = "Copy JSON"), 1200);
      } catch (_) {
        $("copy").textContent = "Copy failed";
      }
    });
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs && tabs[0];
    if (!tab || !tab.id) {
      $("loading").hidden = true;
      $("error").hidden = false;
      $("errorText").textContent = "No active tab.";
      return;
    }
    chrome.tabs.sendMessage(tab.id, { type: "scan" }, (resp) => {
      if (chrome.runtime.lastError || !resp || resp.error) {
        $("loading").hidden = true;
        $("error").hidden = false;
        $("errorText").textContent =
          (chrome.runtime.lastError && chrome.runtime.lastError.message) ||
          (resp && resp.error) ||
          "Could not scan this page.";
        return;
      }
      render(resp);
    });
  });
})();
