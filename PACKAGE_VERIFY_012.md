# Package verification — Scope Lens v0.1.2

T50. Verification only: **no upload, no publish, no file in `dist/` was modified.**
Date: 2026-10-19 13:35 PDT.

**Verdict: PASS for both packages and for the release/landing URLs.** One packaging defect and three
doc-drift items are recorded in §6 — none of them affects the artifacts that were published.

| artifact | size | sha256 |
|---|---|---|
| `dist/pci-scope-lens-0.1.2-firefox.xpi` | 7,852 B | `60d9a5407b67ac46de236d93cd2c96ac26a27a71145c4923a1e2ff5883287abe` |
| `dist/pci-scope-lens-0.1.2-edge.zip` | 7,751 B | `631e93851c7559cc394be25227a1a9cd3561df499468a77c17d591b5e6996cee` |

---

## 1. Zip contents

Both archives contain exactly the seven runtime files and nothing else:

```
manifest.json  logic.js  content.js  popup.html  popup.css  popup.js  icon128.png
```

No `store/`, `test-fixtures/`, `validation/`, `docs/`, tests, docs or `dist/` recursion. Entry count
7/7 for both.

## 2. Manifests

| field | Firefox xpi | Edge zip |
|---|---|---|
| `manifest_version` | 3 | 3 |
| `version` | **0.1.2** | **0.1.2** |
| `name` | `PCI Scope Lens` | `PCI Scope Lens` |
| `permissions` | `["activeTab"]` | `["activeTab"]` |
| `host_permissions` | `["<all_urls>"]` | `["<all_urls>"]` |
| `action` / `icons` | popup.html / icon128.png | popup.html / icon128.png |
| `content_scripts` | logic.js + content.js, `document_idle` | same |
| `browser_specific_settings` | `gecko.id=pci-scope-lens@bbflow.local`, **`strict_min_version=142.0`**, `data_collection_permissions={"required":["none"]}` | absent (correct) |

`strict_min_version 142.0` is present in the packaged manifest, not only in the build script — that was
the point of the v0.1.2 bump (commit `b719338`), and it survived packaging.

## 3. Lint (web-ext 8, on the packaged xpi)

```bash
npx --yes web-ext@8 lint --source-dir /tmp/v012/fx --output json
```

```json
{"summary":{"errors":0,"warnings":0,"notices":0},
 "metadata":{"id":"pci-scope-lens@bbflow.local","manifestVersion":3,"name":"PCI Scope Lens",
             "version":"0.1.2","firefoxMinVersion":"142.0","firefoxStrictMinVersion":142}}
```

0 errors / 0 warnings / 0 notices. The previous release needed
`MISSING_DATA_COLLECTION_PERMISSIONS`; that notice is gone in 0.1.2.

## 4. Release URL

`https://github.com/mortal7520/pci-scope-lens/releases/tag/v0.1.2` → **HTTP 200**, release is
`draft: false`, `prerelease: false`.

GitHub API asset digests, compared against the local builds:

| asset | size | digest | matches local |
|---|---:|---|---|
| `pci-scope-lens-0.1.2-firefox.xpi` | 7,852 B | `sha256:60d9a540…3287abe` | **yes** |
| `pci-scope-lens-0.1.2-edge.zip` | 7,751 B | `sha256:631e9385…6996cee` | **yes** |

The published binaries are byte-identical to `dist/`, so the release was not rebuilt from stale sources.
Remote tags present: `v0.1.0`, `v0.1.1`, `v0.1.2`.

## 5. Landing URL

| URL | status | note |
|---|---|---|
| `https://mortal7520.github.io/pci-scope-lens/` | 200 | "Download v0.1.2" button |
| `…/checklist.html` | 200 | |
| `…/assessment.html` | 200 | |
| download target | 200 | `href="https://github.com/mortal7520/pci-scope-lens/releases/tag/v0.1.2"` |
| footer privacy link | 200 | `…/blob/master/PRIVACY.md` |
| live demo `https://patent-stock-twist-temporary.trycloudflare.com/extension` | 200 | ephemeral tunnel — see §6 F6 |

The landing page names v0.1.2 and points at the v0.1.2 release tag, so version, landing and release agree.

## 6. Findings

| id | severity | finding | impact |
|---|---|---|---|
| **F1** | **defect (low)** | `package.sh` still defaults to `OUT="${1:-dist/pci-scope-lens-0.1.0.zip}"` | running it today produces a correctly-built 0.1.2 package **under a 0.1.0 filename** — a mislabel that survives upload. `build_dist.sh` is unaffected (it derives the version from `manifest.json`). One-line fix, not applied here because this task is verification-only. |
| F2 | cosmetic | local git repo has **no tags** (`git tag -l` empty) while the remote has `v0.1.0/1/2` | `git describe` in this checkout cannot name the release; the published artifacts are fine |
| F3 | doc drift | `EDGE_SUBMISSION.md` (title and §1) and `DISTRIBUTION.md` (§1 hashes, §2 lint `version 0.1.0 / firefoxMinVersion 121.0`, §release link `v0.1.0`) still describe 0.1.0 | a reader following them today gets 0.1.0 numbers; the runbooks are historical, the store steps themselves are unchanged |
| F4 | doc drift | `README.md` says `package.sh` writes `dist/pci-scope-lens-0.1.0.zip` | consistent with F1, both need the same one-line update |
| F5 | cosmetic | `ZIP_AUDIT.md` / `REAL_CHECKOUT.md` are 0.1.0-era documents | expected; they are point-in-time audits |
| F6 | operational | the README "live demo" URL is a `trycloudflare` tunnel | returns 200 now, but the hostname dies with the tunnel; the landing page (GitHub Pages) is the stable address |

No finding touches the two published binaries: their digests match the release exactly.

## 7. Reproduce

```bash
cd money/mvp/pci-scope-lens
unzip -Z1 dist/pci-scope-lens-0.1.2-firefox.xpi
unzip -Z1 dist/pci-scope-lens-0.1.2-edge.zip
unzip -p dist/pci-scope-lens-0.1.2-firefox.xpi manifest.json | python3 -m json.tool | head -20
sha256sum dist/pci-scope-lens-0.1.2-*
rm -rf /tmp/v012 && mkdir -p /tmp/v012/fx && \
  unzip -q dist/pci-scope-lens-0.1.2-firefox.xpi -d /tmp/v012/fx && \
  npx --yes web-ext@8 lint --source-dir /tmp/v012/fx --output json
curl -sS https://api.github.com/repos/mortal7520/pci-scope-lens/releases/tags/v0.1.2 \
  | python3 -c "import json,sys;[print(a['name'],a['size'],a.get('digest')) for a in json.load(sys.stdin)['assets']]"
curl -sS -o /dev/null -w '%{http_code}\n' -L https://mortal7520.github.io/pci-scope-lens/
```

## 8. Boundaries

* Nothing uploaded, published, signed or rebuilt. `dist/` files were read, never written.
* Only network reads: GitHub API/release pages, the Pages site, and the demo URL status check.
