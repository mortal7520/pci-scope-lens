# Distribution — Scope Lens on free stores (AMO + Edge)

T42. Goal: a path that costs **$0** and needs no Chrome Web Store developer account (that one is a
one-time $5 fee). Firefox Add-ons (AMO) and Microsoft Edge Add-ons are both free for individual
developers.

**Nothing was published, no account was created, no credentials were used.** This document is the
runbook plus the exact artifacts and copy to paste when you do it.

| store | cost | account | package | status |
|---|---|---|---|---|
| Firefox Add-ons (AMO) | $0 | Firefox Account (free) | `dist/pci-scope-lens-0.1.0-firefox.xpi` | **submitted 2026-10-19, Awaiting Review** |
| Microsoft Edge Add-ons | $0 | Microsoft Partner Center (free) | `dist/pci-scope-lens-0.1.0-edge.zip` | built, not uploaded |
| Chrome Web Store | $5 one-time | Google developer account | not built | **out of scope** (fee) |


## 0. GitHub release (live now, no store account needed)

https://github.com/mortal7520/pci-scope-lens/releases/tag/v0.1.0

- Firefox: download `.xpi` → `about:debugging#/runtime/this-firefox` → Load Temporary Add-on (or set `xpinstall.signatures.required=false` in a dev build).
- Edge: download `.zip` → `edge://extensions` → Developer mode → Load unpacked.
- This is a **manual-install** release, not a store listing; AMO/Edge review still pending.

---

## 1. Build

```bash
cd money/mvp/pci-scope-lens
./build_dist.sh
```

The script copies the **7 allowlisted runtime files** only (`manifest.json logic.js content.js
popup.html popup.css popup.js icon128.png`), injects the AMO block into the Firefox copy's manifest,
and zips both. It never touches the frozen root archive or the source manifest.

```
dist/pci-scope-lens-0.1.0-firefox.xpi   7,852 B   sha256 b1b9d6329662f9f023e79a4420bc558b29fb6d71a5e93f5b75def8d8aff72a2e
dist/pci-scope-lens-0.1.0-edge.zip      7,753 B   sha256 ee95c73be981a3863af77318372b155b7d099847bf734cfa48af8b7f21cbad91
```

Frozen root zip `../pci-scope-lens-0.1.0.zip` is unchanged: `6562eac79503743cac99c63551cc7b6207335e6a50a848fefd55c7e0333a95e5`.

Hashes are from this build. `zip` stores file mtimes, so a rebuild of identical sources can produce a
different container hash; the entry list and the seven file hashes are the stable identity, not the
container digest.

## 2. Lint (web-ext 8)

```bash
npx --yes web-ext@8 lint --source-dir <extracted firefox package> --output json
```

```
{"count":0,"summary":{"errors":0,"notices":0,"warnings":0},
 "metadata":{"id":"pci-scope-lens@bbflow.local","manifestVersion":3,"name":"PCI Scope Lens",
             "version":"0.1.0","firefoxMinVersion":"121.0"},
 "errors":[],"warnings":[],"notices":[]}
```

Zero errors, zero warnings, zero notices. Notes on the two things that had to be added to get there:

* `browser_specific_settings.gecko.id` — AMO needs a stable add-on id to sign; without one the first
  upload gets an auto-generated GUID that an update cannot reuse.
* `browser_specific_settings.gecko.data_collection_permissions` — the first lint run returned
  `MISSING_DATA_COLLECTION_PERMISSIONS` (a notice: "will be required in the future"). Declaring
  `{"required": ["none"]}` is accurate for this extension and clears it.

Resulting Firefox manifest block:

```json
"browser_specific_settings": {
  "gecko": {
    "id": "pci-scope-lens@bbflow.local",
    "strict_min_version": "121.0",
    "data_collection_permissions": { "required": ["none"] }
  }
}
```

`strict_min_version 121.0` is the first Firefox release with the MV3 features this package uses
(content scripts + `action` + `chrome.tabs` messaging). The Edge package keeps the plain manifest —
Edge only accepts Chromium packages and ignores `browser_specific_settings`.

## 3. Listing copy

Shared fields (lengths checked against both stores' limits):

| field | value | length / limit |
|---|---|---|
| Name | `PCI Scope Lens` | 14 / 50 (AMO), 45 (Edge) |
| Summary / short description | `See if card fields are isolated in a payment provider iframe. Free, client-side PCI SAQ A scope check.` | 102 / 250 (AMO), 132 (Edge) |
| Category | AMO: `Privacy & Security` · Edge: `Productivity` | — |
| Language | English | — |
| License | MIT (recommended; matches the rest of the project) | — |
| Privacy policy | `https://gist.github.com/mortal7520/aaf9a2abd389b2ce6c2ef03a731081df` | public, required by both |
| Support / homepage | `https://gist.github.com/mortal7520/2b4e7b36392fe3c928bb3931bc1dca6d` | optional on AMO |
| Icon | `icon128.png` (128×128) | required |
| Screenshot | `store/promo-1280x800.png` (1280×800) | required; both stores accept 1280×800 |
| Tags (AMO) | `pci, saq, checkout, security, stripe, shopify` | up to 10 |

Detailed description (paste into both stores; plain text, stores render it as-is):

```
Card data on your checkout page — is it actually isolated in a payment provider iframe, or are card
inputs sitting directly on your page?

PCI Scope Lens gives you a fast, client-side answer:

- SAQ A likely — a known provider iframe (Stripe, Braintree, Adyen, Shopify, PayPal, etc.) is present
  and no direct card inputs were found.
- SAQ D / A-EP likely — card number / CVV / expiry inputs appear directly on the page.
- Inconclusive — custom checkout, shadow DOM, or another page.

It also flags missing HTTPS, mixed content, and multiple providers.

No data leaves your browser. No account, no analytics, no server. The extension reads the current tab
only when you click the toolbar button.

Not an audit, not legal advice, not a PCI assessment.
```

## 4. Permission justification (paste into the reviewer notes)

Both stores ask why a broad host permission is needed. Use this verbatim:

> **`activeTab`** — the extension reads the page only when the user clicks the toolbar button. No
> background scanning, no automatic page access.
>
> **`<all_urls>` host permission (content script)** — the whole purpose is to answer "is *this*
> checkout page PCI-isolated?" for whatever merchant the user is on; there is no fixed list of
> stores to enumerate in the manifest. The content script does not read form values: it reads
> `iframe[src]`, `input.name/id/placeholder/autocomplete`, `<form action>`, and `<link>/<img>/<script>`
> URLs to compute one of three verdicts locally.
>
> **No network code exists in the package.** `fetch(`, `XMLHttpRequest`, `WebSocket`,
> `navigator.sendBeacon` and `importScripts` do not appear anywhere; there are no remote script or
> style tags. Nothing is stored (`storage` permission is not requested), nothing is transmitted,
> nothing is sold.
>
> Two URL strings exist, both benign — a reviewer grepping for `http` will find exactly these:
> `content.js` compares `u.startsWith("http://")` to flag mixed content (a string test, not a
> request), and `popup.js` holds `CHECKLIST_URL`, assigned to an `<a href>` the user may click to open
> the checklist in a normal tab. Neither sends page data.
>
> Reviewers can confirm all of the above in `content.js`, `logic.js` and `popup.js` — the package is
> 20 KB of unminified source, no bundler, no remote imports.

## 5. AMO upload — exact steps

1. Sign in at **https://addons.mozilla.org/developers/** with a Firefox Account (free; creating the
   account is a manual step and was **not** done here).
2. **Submit a New Add-on** → choose **"On this site"** (listed, discoverable). *Unlisted* is only for
   self-distribution and does not need a public listing.
3. Upload `dist/pci-scope-lens-0.1.0-firefox.xpi`.
4. The validator runs automatically — expect the same 0/0/0 result shown in §2. If it reports
   `browser_specific_settings` unknown keys, they are already in the manifest; do not "fix" them by
   removing the block.
5. Fill the listing from §3: name, summary, description, category **Privacy & Security**, tags,
   license **MIT**, privacy policy URL, support URL.
6. Upload the icon and `store/promo-1280x800.png`.
7. Paste §4 into **Notes to Reviewer**.
8. Submit for review. Broad host permissions put this in the human review queue; the usual turnaround
   is a few days, and a reviewer may ask a question through the developer hub — answer with §4.
9. After approval, the AMO page serves the signed `.xpi`; the signed file (not our build) is what users
   install, and it is what must be re-uploaded for every future version.

**Do not change `gecko.id` after the first submission** — a new id is a new add-on, with no update path
from the old one.

## 6. Edge Add-ons upload — exact steps

1. Create a free **Microsoft Partner Center** account and enrol in the **Microsoft Edge** programme:
   **https://partner.microsoft.com/dashboard/microsoftedge/** (individual enrolment, no fee; manual
   step, not done here).
2. **New extension** → upload `dist/pci-scope-lens-0.1.0-edge.zip`.
3. Listing: name, short description, detailed description, category **Productivity**, language,
   screenshots (`store/promo-1280x800.png`), store logo (`icon128.png`).
4. **Privacy policy URL is mandatory** — paste the gist URL from §3. Edge certification rejects
   submissions without it.
5. Support contact: the gist URL is enough; an email address speeds up review.
6. Paste §4 into the "Notes for certification" field.
7. Submit. Certification typically takes 1–7 days; the result arrives by email.

## 7. Review risks and mitigations

| risk | why it happens | mitigation |
|---|---|---|
| broad host permission questioned | `<all_urls>` content script + "Access your data for all websites" prompt | §4 explains the merchant-anywhere requirement; the script reads attributes, never values |
| "collects browsing data" flag | the permission prompt looks invasive | `data_collection_permissions: none` in the manifest plus §4; no network code to find |
| privacy policy URL dead | the gist is third-party hosted | move `PRIVACY.md` to GitHub Pages under the operator's account if the gist is ever rate-limited or removed |
| version already exists | re-uploading 0.1.0 | bump `version` in `manifest.json`, re-run `build_dist.sh`, upload the new files |
| AMO asks for source | only for minified/obfuscated packages | not applicable: 20 KB unminified, no build step |

## 8. Release process (every future version)

```bash
# 1. bump version in manifest.json (e.g. 0.1.2)
# 2. rebuild both packages
./build_dist.sh
# 3. lint the Firefox package again
unzip -q dist/pci-scope-lens-0.1.2-firefox.xpi -d /tmp/lint-fx && \
  npx --yes web-ext@8 lint --source-dir /tmp/lint-fx
# 4. upload: AMO -> Developer Hub -> the add-on -> New Version
#            Edge -> Partner Center -> the extension -> Update
```

## 9. Verification performed here

```bash
./build_dist.sh
unzip -Z1 dist/pci-scope-lens-0.1.0-firefox.xpi     # 7 files, no store/tests/docs
unzip -Z1 dist/pci-scope-lens-0.1.0-edge.zip        # same 7 files
python3 -c "import json;print(json.load(open('/tmp/lint-fx/manifest.json'))['browser_specific_settings'])"
npx --yes web-ext@8 lint --source-dir /tmp/lint-fx --output json   # 0 errors / 0 warnings / 0 notices
sha256sum dist/*                                                   # see §1
```

Package contents (both): `manifest.json`, `logic.js`, `content.js`, `popup.html`, `popup.css`,
`popup.js`, `icon128.png`. No `store/`, `test-fixtures/`, `validation/`, tests or docs.

Edge package check: `manifest_version` 3 and **no** `browser_specific_settings` key (Firefox-only block
correctly absent).

Firefox runtime was **not** exercised — there is no Firefox binary on this machine. `web-ext lint`
(0/0/0) is the available pre-upload signal; the AMO validator runs the same rule set on upload.

## 10. Boundaries

* No account was created on AMO, Partner Center, or anywhere else.
* Nothing was uploaded or published; no signing request was made.
* The Chrome Web Store path is deliberately not prepared — it needs the $5 fee the task rules out.
* The Firefox package is unsigned. `web-ext sign` requires AMO API credentials; signing happens during
  the AMO upload flow, not from this machine.


## AMO submission record (2026-10-19)

- API credentials generated (issuer `user:20259039:667`; secret only in `~/.config/bbflow/mozilla/amo-api.txt`, 0600)
- `web-ext sign --channel listed --amo-metadata /tmp/amo-meta.json` accepted
- AMO status: **Awaiting Review**
- Developer edit: https://addons.mozilla.org/en-US/developers/addon/pci-scope-lens/edit
- Public page (after approval): https://addons.mozilla.org/en-US/firefox/addon/pci-scope-lens/
- Metadata used: `{"categories":["privacy-security"],"version":{"license":"MIT"}}`
