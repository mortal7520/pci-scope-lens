/* PCI Scope Lens — pure analysis logic. Browser global + Node export. */
(function (global) {
  "use strict";

  const PROVIDERS = [
    ["stripe", "Stripe"],
    ["braintree", "Braintree"],
    ["paypal", "PayPal"],
    ["adyen", "Adyen"],
    ["checkout.com", "Checkout.com"],
    ["shopify", "Shopify Payments"],
    ["recurly", "Recurly"],
    ["chargebee", "Chargebee"],
    ["worldpay", "Worldpay"],
    ["authorize.net", "Authorize.net"],
    ["square", "Square"],
    ["mollie", "Mollie"],
    ["klarna", "Klarna"],
    ["affirm", "Affirm"],
    ["spreedly", "Spreedly"],
    ["paddle", "Paddle"],
  ];

  const CARD_FIELD = /(card[\s_-]?(number|num|no)|cc[\s_-]?(num|number|no)|cvv|cvc|csc|security[\s_-]?code|expir(y|ation)|exp[\s_-]?(month|year|date)|\bpan\b)/i;

  function providerFromSrc(src) {
    const s = String(src || "").toLowerCase();
    for (const [needle, name] of PROVIDERS) {
      if (s.includes(needle)) return name;
    }
    return null;
  }

  function isCardField(el) {
    if (!el || el.disabled || el.type === "hidden") return false;
    const ac = String(el.autocomplete || "").toLowerCase();
    if (ac.startsWith("cc-")) return true;
    const hay = [el.name, el.id, el.placeholder, el.getAttribute && el.getAttribute("aria-label")]
      .filter(Boolean)
      .join(" ");
    return CARD_FIELD.test(hay);
  }

  function analyze(signals) {
    const s = signals || {};
    const providers = Array.from(new Set(s.providerIframes || []));
    const direct = Array.isArray(s.directFields) ? s.directFields : [];
    const warnings = [];

    if (!s.https) warnings.push("Page is not HTTPS.");
    if (s.mixedContent) warnings.push("HTTPS page loads HTTP resources (mixed content).");
    if (providers.length > 1) warnings.push("Multiple payment providers detected; confirm which one is live.");
    if (direct.length > 0) warnings.push("Direct card fields detected on the page — this is not SAQ A isolation.");

    let verdict = "unknown";
    let confidence = "low";
    if (direct.length > 0) {
      verdict = "saq_d";
      confidence = "high";
    } else if (providers.length > 0) {
      verdict = "saq_a";
      confidence = s.https ? "medium" : "low";
    } else if (s.formsWithPaymentAction) {
      verdict = "unknown";
      confidence = "low";
    }

    const labels = {
      saq_a: "SAQ A likely",
      saq_d: "SAQ D / A-EP likely",
      unknown: "Inconclusive",
    };
    const reasons = {
      saq_a: "Card fields appear to be hosted by a payment provider iframe; no direct card inputs were found.",
      saq_d: "Card inputs appear directly on the page; card data may touch your servers.",
      unknown: "No provider iframe or card field was detected. The checkout may be custom, in a shadow DOM, or on another page.",
    };

    return {
      verdict,
      label: labels[verdict],
      confidence,
      providers,
      directFields: direct,
      warnings,
      reason: reasons[verdict],
      checkedUrl: s.url || "",
    };
  }

  const api = { analyze, providerFromSrc, isCardField, PROVIDERS };
  global.PCIScopeLens = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
(function(){
  const iframes = Array.from(document.querySelectorAll('iframe')).map(f => ({src: f.src || '', title: f.title || ''}));
  const providerIframes = [];
  for (const f of iframes) { const p = window.PCIScopeLens.providerFromSrc(f.src); if (p) providerIframes.push(p); }
  const directFields = [];
  for (const el of Array.from(document.querySelectorAll('input, select'))) {
    if (window.PCIScopeLens.isCardField(el)) directFields.push({name: el.name || '', id: el.id || '', type: el.type || '', autocomplete: el.autocomplete || ''});
  }
  const forms = Array.from(document.querySelectorAll('form')).map(f => ({action: f.action || '', method: (f.method || 'get').toLowerCase()}));
  const formsWithPaymentAction = forms.some(f => /(checkout|payment|pay|billing|order)/i.test(f.action));
  const mixedContent = location.protocol === 'https:' && Array.from(document.querySelectorAll('img, script, link, iframe')).some(el => (el.src || el.href || '').startsWith('http://'));
  const signals = {url: location.href, https: location.protocol === 'https:', providerIframes, iframes, directFields, forms, formsWithPaymentAction, mixedContent};
  return JSON.stringify({signals: signals, result: window.PCIScopeLens.analyze(signals)});
})()
