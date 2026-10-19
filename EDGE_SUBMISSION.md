# Edge Add-ons submission runbook — PCI Scope Lens 0.1.2

T44. **Nothing was uploaded and no account was created.** This is the verified package, the exact field
values, and the click path through Partner Center.

Package under test: `dist/pci-scope-lens-0.1.2-edge.zip` · 7,753 B ·
`sha256 ee95c73be981a3863af77318372b155b7d099847bf734cfa48af8b7f21cbad91` (unchanged since the T42 build).

Sources for the steps and limits: [Publish a Microsoft Edge extension](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension)
(Microsoft Learn, page updated 2026-08-12), fetched 2026-10-19.

---

## 1. Package verification (done)

| check | result | evidence |
|---|---|---|
| zip opens, 7 entries, no directories | **PASS** | `unzip -Z1` lists `manifest.json logic.js content.js popup.html popup.css popup.js icon128.png` |
| no store / test / doc files | **PASS** | no `store/`, `test-fixtures/`, `validation/`, `test_*.py`, `README.md` |
| `manifest_version` | **PASS** — 3 | parsed from the zip, not the source tree |
| name / version | `PCI Scope Lens` (14 chars) / `0.1.2` | short enough for any store name field |
| manifest description | 108 chars | becomes the store **short description**; short enough for any limit |
| permissions | `["activeTab"]` | only what the popup needs |
| host_permissions | `["<all_urls>"]` | required — see §4 justification |
| content_scripts | `logic.js` + `content.js`, `document_idle`, `<all_urls>` | both files present |
| icons / action | `128 → icon128.png`, popup `popup.html` | icon file present, 128×128 |
| Firefox-only key absent | **PASS** | no `browser_specific_settings` in the Edge build |
| remote code | **none** | no `fetch(`, `XMLHttpRequest`, `WebSocket`, `navigator.sendBeacon`, `importScripts`; no remote `<script>`/`<link>` |
| privacy policy URL live | **PASS** — HTTP 200 | gist serves "PCI Scope Lens privacy policy", contains "Data collection" / "does not collect" |

Two URL strings exist and are benign — `content.js` compares `u.startsWith("http://")` for the
mixed-content check, and `popup.js` holds `CHECKLIST_URL` used as an `<a href>`. Neither transmits page
data. Expect a reviewer to notice them; §4 says so up front.

## 2. Asset checklist for the listing form

| asset | Edge requirement | file | status |
|---|---|---|---|
| Extension logo | required per language, 1:1, **min 128×128**, recommended 300×300 | `icon128.png` (128×128) | **satisfies the minimum**; a 300×300 export is a quality upgrade, not a blocker |
| Screenshot | optional, 640×480 **or** 1280×800, max 6 | `store/promo-1280x800.png` (1280×800) | ready |
| Small promotional tile | optional, 440×280 | — | not provided (skippable) |
| Large promotional tile | optional, 1400×560 | — | not provided (skippable) |
| Description | required, **250–10,000 chars** | copy in §5 | ready (1,020 chars) |
| Short description | required for ≥1 language, read-only, from manifest | manifest `description` (108 chars) | ready |
| Privacy policy URL | required | gist URL | ready |

## 3. Partner Center steps (exact)

1. **Account** — https://partner.microsoft.com/dashboard/microsoftedge/public/login (free individual
   registration; verification is email/identity, **no fee**). Creating it is a manual step for the
   operator and is *not* done here.
2. **Create the extension** — Partner Center → **Home → Workspaces → Edge** card → **Create new
   extension**. The *Upload package (.zip file)* page opens.
3. **Upload** — drag `dist/pci-scope-lens-0.1.2-edge.zip` onto the drop zone (or *Browse your files*).
   Partner Center validates the package and lists it. Then left nav → **Extension overview** → review →
   **Packages** → **Continue**.
4. **Availability** — **Visibility: Public**; **Markets: all markets** (default). → **Save & Continue**.
5. **Properties** — **Category: Productivity**; Website: the checklist gist; Support contact: same URL
   or an email address; **Mature content: unchecked**. → **Save & Continue**.
6. **Privacy** — four sections, copy from §4 and §5:
   - *Single Purpose* → §5 single-purpose text
   - *Permission justification* → one box per manifest permission, text in §4
   - *Are you using remote code?* → **No, I am not using remote code**
   - *Data usage* → leave every "data you collect" checkbox **unchecked**; tick the three certification
     checkboxes
   - *Privacy policy URL* → `https://gist.github.com/mortal7520/aaf9a2abd389b2ce6c2ef03a731081df`
   → **Save & Continue**.
7. **Store listings → Details for English (United States)**:
   - Extension name: `PCI Scope Lens` (read-only, from manifest)
   - Description: paste the §5 long description (≥250 chars)
   - Extension logo: `icon128.png`
   - Screenshots: `store/promo-1280x800.png`
   - Short description: read-only, comes from the manifest
   - Search terms: `pci`, `saq`, `checkout`, `stripe`, `shopify`, `card fields`, `payment iframe`
     (7 terms, 9 words, longest 14 chars — limits are 7 terms / 21 words / 30 chars)
   - → **Save draft**
8. **Submit** — **Publish** → *Notes for certification* (paste §6) → **Publish**. Certification takes up
   to **7 business days**; status moves to **In the Store** on success.

### One ambiguity in step 7, resolved

Microsoft's docs say the manifest `Description` populates the listing and is read-only there, while the
form simultaneously requires a **Description of at least 250 characters**. Both cannot bind the same
field: a Chromium manifest `description` is capped well below 250, so the ≥250 field must be the editable
Partner Center **Description**, and the manifest text is what fills the read-only **Short description**.

Do it in this order: paste the §5 long copy into Description first; the 108-char manifest text stays as
the short description. Only if Partner Center refuses input in Description is a rebuild needed — and in
that case the fix is a longer manifest description, which `./build_dist.sh` turns into a one-field change.

## 4. Privacy answers (copy-ready)

**Single purpose** (184 chars):

> Tell the user, in one click, whether the card fields on the current checkout page are isolated in a
> payment provider iframe (SAQ A shape) or sitting directly on the page (SAQ D shape).

**Permission justification — `activeTab`:**

> Used only when the user clicks the toolbar button, to read the current tab's DOM and compute the
> verdict. There is no background scanning and no access to tabs the user has not invoked the extension
> on.

**Permission justification — `<all_urls>` host permission (content script):**

> The extension answers "is *this* checkout page PCI-isolated?" for whatever merchant the user is
> visiting, so the content script must be available on any host; there is no fixed list of stores to
> declare. The script reads only `iframe[src]`, `input.name/id/placeholder/autocomplete`, `<form action>`
> and `<link>/<img>/<script>` URLs. It never reads form values, never sends data anywhere, and there is
> no network code in the package: no `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon` or
> `importScripts`. Two URL strings exist and are benign — a `http://` prefix comparison for the
> mixed-content check, and a link the user may click to open the checklist. No storage permission is
> requested and nothing is persisted.

**Remote code:** No.

**Data usage:** nothing collected — leave all collection checkboxes unchecked, certify the three
statements.

## 5. Listing copy

**Short description** (from the manifest, 108 chars, read-only):

> See whether card fields are isolated in a PCI provider iframe. Client-side only; no data leaves the browser.

**Long description** (1024 chars — paste into the Description field):

```
Card data on your checkout page — is it actually isolated in a payment provider iframe, or are card
inputs sitting directly on your page?

PCI Scope Lens gives you a fast, client-side answer:

- SAQ A likely — a known provider iframe (Stripe, Braintree, Adyen, Shopify, PayPal and others) is
  present and no direct card inputs were found.
- SAQ D / A-EP likely — card number, CVV or expiry inputs appear directly on the page, so card data may
  touch your servers.
- Inconclusive — the checkout is custom, inside a shadow DOM, or lives on another page.

It also flags a non-HTTPS page, mixed content, and multiple payment providers on the same page.

No data leaves your browser. No account, no analytics, no server, no storage. The extension reads the
current tab only when you click the toolbar button, and the result is a single verdict rendered in the
popup.

Not an audit, not legal advice, and not a PCI assessment. It is a scope hint to help you decide whether
SAQ A is even plausible before you start the paperwork.
```

**Search terms:** `pci`, `saq`, `checkout`, `stripe`, `shopify`, `card fields`, `payment iframe`.

## 6. Notes for certification (paste-ready)

> PCI Scope Lens is a read-only, client-side checker. No account, no login, no data collection, no
> network requests of any kind.
>
> To test: open any checkout page and click the toolbar icon.
> - `https://stripe-payments-demo.appspot.com/` → expect **SAQ A likely** (Stripe Elements iframes).
> - A page with a plain `<input name="cardnumber">` → expect **SAQ D / A-EP likely**.
> - `chrome://extensions` or a blank tab → expect **Inconclusive**.
>
> The `<all_urls>` permission exists because the user can be on any merchant's checkout; the content
> script only reads iframe `src`, input attribute names, form actions and asset URLs, never field
> values. Permissions requested: `activeTab` only. No remote code, no `storage`.

## 7. Certification risks

| risk | mitigation |
|---|---|
| broad host permission questioned | §4 justification; the script reads attributes, not values |
| "collects browsing data" flag | no collection checkboxes; privacy policy states none; no network code to find |
| description under 250 chars | paste the 1024-char copy (§5) |
| logo below recommended size | 128×128 meets the minimum; export 300×300 if certification complains |
| privacy URL unreachable at review time | gist is live today (200); move `PRIVACY.md` to GitHub Pages if it ever 404s |
| package rejected as duplicate | first submission, no existing listing |

## 8. Update process

```bash
# 1. bump "version" in manifest.json
# 2. rebuild
./build_dist.sh
# 3. Partner Center -> the extension -> Packages -> upload the new zip -> submit
# Listing text and assets are retained between versions.
```

## 9. Boundaries

* No Partner Center account created, nothing uploaded, nothing published, no certification request.
* Chrome Web Store deliberately excluded (one-time $5 developer fee).
* The AMO route and its lint evidence live in `DISTRIBUTION.md` (§1–§5); this file is the Edge-specific
  runbook only.
* Runtime testing on Edge was not possible here (Chrome 155 on this machine refuses unpacked extensions,
  see `REAL_CHECKOUT.md` §2); package validation above is static plus the AMO-side `web-ext` lint.
