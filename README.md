# PCI Scope Lens (Chrome extension MVP)

A client-side lead magnet for the PCI SAQ A copilot. It scans the current page and tells you
whether card fields look **isolated in a payment provider iframe** (SAQ A shape) or **direct on
the page** (SAQ D / A-EP shape).

No automatic network requests, no storage, and no page data leaves the browser. The only
outbound navigation is the "Open checklist" link you click, which opens the public project page
in a new tab.

## Verdicts

| Verdict | Meaning |
|---|---|
| **SAQ A likely** | A known provider iframe is present (Stripe, Braintree, Adyen, Shopify, etc.) and no direct card inputs were found. |
| **SAQ D / A-EP likely** | Card-number/CVV/expiry inputs appear directly on the page; card data may touch your servers. |
| **Inconclusive** | No provider iframe or card field detected — custom checkout, shadow DOM, or another page. |

## Install (unpacked)

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. **Load unpacked** → select `money/mvp/pci-scope-lens`.
4. Open a checkout page and click the extension icon.

If the popup says it cannot scan, reload the page after installing the extension (content scripts
only inject on page load).

## Test

```bash
cd money/mvp/pci-scope-lens
node test_logic.js
# test_logic: 10 assertions OK
python3 -m json.tool manifest.json >/dev/null && echo manifest-ok
```

Package:

```bash
cd money/mvp/pci-scope-lens
./package.sh
# writes dist/pci-scope-lens-0.1.0.zip, never overwrites the frozen archive
# explicit 7-file allowlist: manifest, logic, content, popup.{html,css,js}, icon128
```

## Browser fixture check

Two local fixtures were scanned in a real Chrome page context (agent-browser + logic.js):

| fixture | verdict |
|---|---|
| `test-fixtures/iframe.html` (Stripe iframe, no direct inputs) | **saq_a**, provider Stripe, confidence low (file:// is not HTTPS) |
| `test-fixtures/direct.html` (card_number/cvv/expiry) | **saq_d**, 3 direct fields, confidence high |

## Popup DOM test

`python3 test_popup.py` loads `popup.html` in Playwright with a mocked `chrome.tabs` API and
asserts both states render: **SAQ A likely** (Stripe provider) and **SAQ D / A-EP likely**
(cardnumber field). This tests the popup DOM/`analyze()` integration, not the real extension
transport.

## Real checkout validation

- Stripe Payments Demo → **saq_a**, Stripe (11 iframes), 0 direct fields.
- Fashion Nova Shopify checkout → **saq_a**, Shopify Payments (11) + PayPal (1), 0 direct fields.
- W3Schools public checkout form → **saq_d**, 4 direct card fields (cardnumber/expmonth/expyear/cvv).
- Popup UI could not be clicked on Chrome 155 (unpacked extensions blocked); the shipped `logic.js`
  + a line-for-line copy of `scanPage()` were run in page context. See `REAL_CHECKOUT.md`.

## Store assets

- `PRIVACY.md` — no data collection, no network
- `store/LISTING.md` — Chrome Web Store copy + submission checklist
- `store/promo-1280x800.png` — listing screenshot
- `icon128.png` — extension icon

## Limits

- Cross-origin iframes are opaque; the extension can see the iframe `src`, not its DOM.
- Shadow DOM and custom elements may hide card fields.
- A page can load a provider iframe without using it; verdict is a hint, not proof.
- Not an audit, not legal advice, not a PCI assessment.
- No auto-scan of every page; only the active tab, on demand.

## Why this exists

The PCI copilot sells an evidence checklist. The extension gives a free, instant "are we even
SAQ A?" answer, then links to the 10-question assessment:

https://gist.github.com/mortal7520/2b4e7b36392fe3c928bb3931bc1dca6d

Live demo: https://patent-stock-twist-temporary.trycloudflare.com/extension

Assessment: https://patent-stock-twist-temporary.trycloudflare.com/assessment

That is the lead magnet: scope check → assessment → $99 audit-prep.
