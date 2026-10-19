# Real checkout validation — PCI Scope Lens

Date: 2026-10-19. Extension: `pci-scope-lens` 0.1.0 (unpacked, MV3). Chrome 155.0.8059.84.
Goal: does the detector give a correct verdict on **two real public checkout pages**?

**Short answer: yes — the two provider checkouts came back `saq_a` with the right provider and zero
direct card fields; a real public checkout form with direct card inputs came back `saq_d`. The popup UI itself could not be clicked, because Chrome 155 refuses to load unpacked
extensions; the shipped analysis code was executed against the real DOM instead (limitation recorded
in §2).**

| # | Checkout | URL | Verdict | Providers | Direct card fields | Confidence |
|---|---|---|---|---|---|---|
| 1 | Stripe Payments Demo (official Stripe demo app) | `https://stripe-payments-demo.appspot.com/` | **saq_a** — SAQ A likely | **Stripe** (11 iframes) | **0** | medium |
| 2 | Shopify storefront checkout (Fashion Nova) | `https://www.fashionnova.com/checkouts/cn/<session>/en-us` | **saq_a** — SAQ A likely | **Shopify Payments** (11) + **PayPal** (1) | **0** | medium |
| 3 | W3Schools checkout form (public direct-input form) | `https://www.w3schools.com/howto/tryhow_css_checkout_form.htm` | **saq_d** — SAQ D / A-EP likely | none | **4** (cardnumber, expmonth, expyear, cvv) | high |

Raw scan output: `validation/scan_stripe_demo.json`, `validation/scan_shopify_fashionnova.json`, `validation/scan_w3schools_direct.json`.
Screenshots: `validation/stripe-demo-checkout.png`, `validation/shopify-fashionnova-checkout.png`.

---

## 1. What was actually exercised

The extension's two runtime pieces are `logic.js` (pure analysis) and `content.js` (`scanPage()`),
with `popup.js` only doing `chrome.tabs.sendMessage` and DOM rendering. The validation ran:

* `logic.js` — **verbatim, unmodified**, defining `window.PCIScopeLens`;
* a scan expression — **a line-for-line copy of `content.js` `scanPage()`** (iframe collection,
  `isCardField()` sweep over `input, select`, form action sweep, mixed-content check), with only the
  `chrome.runtime.onMessage` listener removed because there is no extension runtime in page context;
* `PCIScopeLens.analyze(signals)` — the same call the popup makes.

So the detection logic and the signals fed to it are the shipped code. What was **not** exercised is
the extension transport (`chrome.tabs.sendMessage`) and the popup's DOM rendering.

Real evidence that the two pages are genuine checkouts:

```
# Stripe demo
iframe: https://js.stripe.com/v3/elements-inner-card-<hash>.html          <- card number field
iframe: https://js.stripe.com/v3/elements-inner-payment-request-<hash>.html
iframe: https://js.stripe.com/v3/elements-inner-iban-<hash>.html
iframe: https://js.stripe.com/v3/payment-request-inner-google-pay-<hash>.html

# Shopify checkout
iframe: https://checkout.pci.shopifyinc.com/build/09497de/number-ltr.html            <- card number
iframe: https://checkout.pci.shopifyinc.com/build/09497de/expiry-ltr.html            <- expiry
iframe: https://checkout.pci.shopifyinc.com/build/09497de/verification_value-ltr.html <- CVV
iframe: https://checkout.pci.shopifyinc.com/build/09497de/name-ltr.html
iframe: https://checkout.shopify.com/2939277/sandboxes/wallets
iframe: https://extensions.shopifycdn.com/shopifycloud/checkout-web/assets/.../load...html
```

The Shopify card fields sitting on `checkout.pci.shopifyinc.com` (a separate registrable domain from
`fashionnova.com`) is the exact SAQ A shape the product claims to detect.

---

## 2. Limitation — the popup could not be clicked (recorded, not worked around)

Chrome 155 refuses to load unpacked extensions. Three attempts, all failed:

| attempt | result |
|---|---|
| `--load-extension=… --disable-extensions-except=…`, headless (`--headless=new`) | extension absent from `chrome://extensions-internals`; only the 3 COMPONENT extensions present |
| same, **headed** under Xvfb (`DISPLAY=:99`) | identical — `--load-extension` is ignored in this build (removed in Chrome 137) |
| CDP `Extensions.loadUnpacked` (`--enable-unsafe-extension-debugging`, both HTTP and `--remote-debugging-pipe` transports) | returns an id (`mociheikkepefaedkbcndfccnpeoocch`) but `Extensions.getExtensions` stays `{"extensions": []}`; `chrome-extension://<id>/popup.html` resolves to `chrome-error://chromewebdata/` |

Full transcript: `validation/extension_load_attempt.txt`.

Consequence: the popup page cannot be opened, so its layout/rendering was not observed. The verdict
data below is what the popup would render (`badge`, `confidence`, `providers`, `warnings`, `fields`),
captured by running the same analysis in the page.

If a popup-level check is required later, the options are: a Chrome build that still honours
`--load-extension` (≤136 / enterprise-policied build), or `web-ext` with Firefox and a `browser.*`
shim — both are environment changes, not extension changes.

---

## 3. Target 1 — Stripe Payments Demo

`https://stripe-payments-demo.appspot.com/` — Stripe's own public demo storefront; it renders a full
checkout ("SHIPPING & BILLING INFORMATION", "PAYMENT INFORMATION", "Pay €33.95") using test-mode keys
(`pk_test_…` in the payment-request iframe).

```json
{"result": {"verdict": "saq_a", "label": "SAQ A likely", "confidence": "medium",
            "providers": ["Stripe", ...11], "directFields": [], "warnings": [],
            "reason": "Card fields appear to be hosted by a payment provider iframe; no direct card inputs were found."}}
```

* Provider iframes: 11, all `js.stripe.com` (card, payment-request, Google Pay, iDEAL, IBAN, controller).
* Direct card inputs on the host page: **none** — the sweep found nothing named/autocompleted as
  card, CVV, expiry or PAN.
* Mixed content: none. Page is HTTPS.
* Verdict matches reality: Stripe Elements isolate the PAN in `js.stripe.com` iframes.

## 4. Target 2 — Shopify storefront checkout (Fashion Nova)

Flow: cart permalink `https://www.fashionnova.com/cart/12187008270460:1` (one GET, adds one item) →
the store's own **"Proceed to Checkout"** button → Shopify checkout session
`https://www.fashionnova.com/checkouts/cn/<session>/en-us`.

```json
{"result": {"verdict": "saq_a", "label": "SAQ A likely", "confidence": "medium",
            "providers": ["PayPal", "Shopify Payments", ...11], "directFields": [],
            "warnings": ["Multiple payment providers detected; confirm which one is live."],
            "reason": "Card fields appear to be hosted by a payment provider iframe; no direct card inputs were found."}}
```

* 21 distinct iframe URLs; 12 resolved to a known provider (11 × Shopify Payments, 1 × PayPal).
* The warning is correct behaviour, not a false positive: the page really does offer PayPal *and* card,
  and the product tells the user to confirm which is live.
* Direct card inputs: none. The number/expiry/CVV inputs live in
  `checkout.pci.shopifyinc.com` iframes.

### Blocked Shopify alternatives (so the next run does not repeat them)

| candidate | result |
|---|---|
| `shopify-demo-store.myshopify.com` | password-protected "opening soon" store — unusable |
| `gymshark.myshopify.com`, `beardbrand.myshopify.com`, `chubbiesshorts.myshopify.com`, `fashionnova.myshopify.com` | `429 local_rate_limited` from this network's egress proxy |
| `www.gymshark.com/cart/<variant>:1` | 404 — Gymshark runs a custom storefront; cart permalinks only work on stock Shopify storefronts |
| `www.fashionnova.com/products.json` | 404 (custom storefront), but the product page exposes
`ProductVariant/<id>` ids, which is what made the cart permalink work |

---

## 5. Safety notes (what was not done)

* No login, no account, no email/address entered, no card data typed, no payment submitted, no order
  placed.
* The only state changes: one item added to a cart (via a GET cart permalink) and one checkout session
  opened by clicking the store's own button. Both are ordinary shopper actions; both sessions are
  ephemeral and untouched.
* No scanning, fuzzing or enumeration beyond normal page loads. `test_logic.js` (extension unit tests)
  passes: `test_logic: 10 assertions OK`.

---

## 6. Reproduce

```bash
cd money/mvp/pci-scope-lens

# extension unit tests
node test_logic.js

# extension load attempt (expected to fail on Chrome 155)
google-chrome --headless=new --remote-debugging-port=9334 \
  --enable-unsafe-extension-debugging --remote-debugging-pipe \
  --disable-extensions-except=$PWD --load-extension=$PWD about:blank
curl -s localhost:9334/json/list            # no chrome-extension:// target appears

# scan a page with the shipped logic (agent-browser)
agent-browser open https://stripe-payments-demo.appspot.com/
agent-browser eval "$(cat validation/scan_bundle.js)"   # bundle = logic.js + content.js scanPage()
```

`validation/scan_bundle.js` is `logic.js` concatenated with a verbatim copy of `content.js`'s
`scanPage()`; it is a validation harness, not part of the shipped extension.

---

## 7. Verdict on the validation

* Detection logic: **works on real pages**, both times returning the correct `saq_a` shape with the
  right provider and zero direct fields.
* Popup UI: **not validated** in this environment — Chrome 155 cannot load unpacked extensions. This
  is an environment limitation, not a defect in the extension; the store listing screenshots remain
  unverified by automation.
* Missing coverage: no real-page `saq_d` sample (a custom checkout with direct card inputs).
  Worth adding a third fixture-backed case only if a public direct-input checkout can be found.
