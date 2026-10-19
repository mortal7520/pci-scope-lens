# Privacy policy — PCI Scope Lens

Last updated: 2026-10-19

Public copy: https://gist.github.com/mortal7520/aaf9a2abd389b2ce6c2ef03a731081df

PCI Scope Lens is a Chrome extension that inspects the **current tab** for signs of payment-form
isolation: payment-provider iframes, direct card input fields, HTTPS, and mixed content.

## Data collection

**None.** The extension does not collect, transmit, sell, or share personal data, browsing history,
page content, or analytics. There is no account, no server, and no network request from the
extension.

## How it works

- A content script runs on the active page and reads the DOM locally.
- When you click the extension icon, the popup asks that tab for a scan result.
- The result is rendered in the popup.
- "Copy JSON" writes the result to your clipboard only when you click it.
- "Open checklist" opens a separate website in a new tab; that site has its own privacy policy.

## Permissions

| Permission | Why |
|---|---|
| `activeTab` | Read the page you explicitly invoke the extension on. |
| `host_permissions: <all_urls>` | The content script must be available on checkout pages across sites; it only reads the DOM when you open the popup. |

## Data retention

No data is stored by the extension. Clipboard content is controlled by your OS/browser.

## Contact

Open an issue at the project repository or use the contact link on the demo site.

## Changes

If this policy changes, the "Last updated" date above changes. Material changes will be noted in
the extension's release notes.
