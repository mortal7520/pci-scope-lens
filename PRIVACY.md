# Privacy policy — PCI Scope Lens

Last updated: 2026-10-19

Public copy: https://gist.github.com/mortal7520/aaf9a2abd389b2ce6c2ef03a731081df

PCI Scope Lens is a Chrome extension that inspects the **current tab** for signs of payment-form
isolation: payment-provider iframes, direct card input fields, HTTPS, and mixed content.

## Data collection

**None.** The extension does not collect, transmit, sell, or share personal data, browsing history,
page content, or analytics. There is no account and no extension backend. The extension makes
**no automatic network request**. The only outbound navigation is the **Open checklist** link
you click, which opens `https://mortal7520.github.io/pci-scope-lens/` in a new tab.

## How it works

- A content script is injected on pages matching `<all_urls>` at `document_idle`, but it only scans when you click the extension icon and the popup asks the active tab for a scan.
- When you click the extension icon, the popup asks that tab for a scan result.
- The result is rendered in the popup.
- "Copy JSON" writes the result to your clipboard only when you click it.
- "Open checklist" opens `https://mortal7520.github.io/pci-scope-lens/` in a new tab; that site has its own privacy policy.

## Permissions

| Permission | Why |
|---|---|
| `activeTab` | Lets the popup ask the active tab for a scan result. |
| `host_permissions: <all_urls>` | The content script is available on checkout pages across sites. It does not read the DOM until you open the popup and trigger a scan. |

## Data retention

No data is stored by the extension. Clipboard content is controlled by your OS/browser.

## Contact

Open an issue at the project repository or use the contact link on the demo site.

## Changes

If this policy changes, the "Last updated" date above changes. Material changes will be noted in
the extension's release notes.
