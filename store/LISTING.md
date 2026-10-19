# Chrome Web Store listing — PCI Scope Lens

## Name

PCI Scope Lens

## Short description (132 chars max)

See if card fields are isolated in a payment provider iframe. Free, client-side PCI SAQ A scope check.

## Detailed description

Card data on your checkout page — is it actually isolated in a payment provider iframe, or are card
inputs sitting directly on your page?

PCI Scope Lens gives you a fast, client-side answer:

- **SAQ A likely** — a known provider iframe (Stripe, Braintree, Adyen, Shopify, PayPal, etc.) is
  present and no direct card inputs were found.
- **SAQ D / A-EP likely** — card number / CVV / expiry inputs appear directly on the page.
- **Inconclusive** — custom checkout, shadow DOM, or another page.

It also flags missing HTTPS, mixed content, and multiple providers.

**No page data leaves your browser.** No account, no analytics, no extension backend. The
extension makes no automatic network request; it reads the current tab only when you click it.
The only outbound navigation is the “Open checklist” link you click (public project page).

Free scope check → 10-question readiness assessment → optional $99 founding / $149 list audit-prep review.

Not an audit, not legal advice, not a PCI assessment.

## Category

Developer Tools

## Language

English

## Permissions justification

- `activeTab`: read the page the user explicitly invokes the extension on.
- `<all_urls>` host permission: checkout pages can be on any merchant domain; the content script
  must be available there. It only reads the DOM when the popup is opened.

## Privacy

Privacy policy: https://gist.github.com/mortal7520/aaf9a2abd389b2ce6c2ef03a731081df

Data use: no collection, no transmission, no sale.

## Support URL

Demo / checklist: https://gist.github.com/mortal7520/2b4e7b36392fe3c928bb3931bc1dca6d

## Screenshots

1. `store/promo-1280x800.png` — popup with **SAQ A likely** + Stripe provider.

`store/screenshot.html` is the popup mock; `store/promo.html` composes the 1280×800 listing image.

## Submission checklist

- [ ] Chrome Web Store developer account ($5 one-time)
- [x] Privacy policy public URL
- [x] 128×128 icon (`icon128.png`)
- [x] 1 screenshot 1280×800 (`store/promo-1280x800.png`)
- [ ] Zip without tests/store assets
- [x] Verify on 3 real pages: Stripe demo (saq_a), Fashion Nova Shopify (saq_a), W3Schools direct form (saq_d)
- [ ] No remote code; manifest V3
