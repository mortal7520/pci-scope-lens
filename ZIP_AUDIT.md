# ZIP audit — pci-scope-lens-0.1.0.zip

Date: 2026-10-19 07:31 PDT. Target: `money/mvp/pci-scope-lens-0.1.0.zip` (8,117 bytes, mtime 06:25).
Method: list, integrity test, extract to `/tmp/pci-zip-audit`, hash-compare against
`money/mvp/pci-scope-lens/`. Source and zip were **not modified**; no external requests.

**Verdict: PASS — 7/7 expected files, manifest V3, icon128.png present and valid, no tests or store
assets, all sha256 hashes identical to the current source.**

Zip sha256:

```
6562eac79503743cac99c63551cc7b6207335e6a50a848fefd55c7e0333a95e5  pci-scope-lens-0.1.0.zip
```

---

## 1. `unzip -l`

```
Archive:  pci-scope-lens-0.1.0.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
      669  2026-10-19 06:25   manifest.json
     3236  2026-10-19 06:15   logic.js
     1810  2026-10-19 06:15   content.js
     1558  2026-10-19 06:15   popup.html
     2072  2026-10-19 06:15   popup.css
     2362  2026-10-19 06:15   popup.js
     2172  2026-10-19 06:25   icon128.png
---------                     -------
    13879                     7 files
```

`unzip -t` → `No errors detected in compressed data of pci-scope-lens-0.1.0.zip`.

Entry types: 7 × `FILE`, zero directory entries, no `__MACOSX`, no `.DS_Store`.

## 2. Expected-file checklist

| # | expected | present | verdict |
|---|---|---|---|
| 1 | `manifest.json` | yes (669 B) | **PASS** |
| 2 | `logic.js` | yes (3,236 B) | **PASS** |
| 3 | `content.js` | yes (1,810 B) | **PASS** |
| 4 | `popup.html` | yes (1,558 B) | **PASS** |
| 5 | `popup.css` | yes (2,072 B) | **PASS** |
| 6 | `popup.js` | yes (2,362 B) | **PASS** |
| 7 | `icon128.png` | yes (2,172 B) | **PASS** |
| — | exactly 7 files, nothing else | 7 | **PASS** |

## 3. sha256 — zip vs current source

| file | sha256 (zip) | sha256 (source) | match |
|---|---|---|---|
| `content.js` | `e7b4e5751f132d81c7674679ccd2cd3d590300f8106db659fac1497cba27a39f` | same | **PASS** |
| `icon128.png` | `308fce7abd0adca0c221408cc6c82b841484c227f14848f57f16d6b698c0ba5f` | same | **PASS** |
| `logic.js` | `fc29b1ed9b037bfcfd226c033ab5c4f0b828bd765df219ee2451e919eaf41318` | same | **PASS** |
| `manifest.json` | `506cf3149df82e61e255293a936875d7689e7dfc3e480f32e1bdb91b4efabd59` | same | **PASS** |
| `popup.css` | `ec93b2a7cffbd77b4bfa31e2af34c45564f65a910bdab7e306469a10c34de84a` | same | **PASS** |
| `popup.html` | `cbb834eb39e7c0c8734fb8b8a05ed5e2dc8f63ba606338d2448628bba64a3c18` | same | **PASS** |
| `popup.js` | `e54aeb4cf6c8195086ef4c95ac1f436c47a561d693f97421bc3828a42fa1698d` | same | **PASS** |

No file differs. The archive is a byte-exact copy of the seven runtime files.

## 4. Manifest checks (read from the archive)

| check | value | verdict |
|---|---|---|
| parses as JSON | yes | **PASS** |
| `manifest_version` | **3** | **PASS** |
| `name` / `version` | `PCI Scope Lens` / `0.1.0` | **PASS** |
| `permissions` | `["activeTab"]` | **PASS** (minimum viable) |
| `host_permissions` | `["<all_urls>"]` | noted — required to scan any checkout the user is on |
| `content_scripts` | `logic.js`, `content.js`, `run_at=document_idle`, `matches=<all_urls>` | **PASS** |
| `action.default_popup` | `popup.html` | **PASS** |
| `icons` / `action.default_icon` | `128 → icon128.png` | **PASS** |
| every referenced file exists in the archive | `content.js`, `logic.js`, `popup.html`, `icon128.png` — none missing | **PASS** |
| `popup.html` references `popup.css`, `logic.js`, `popup.js` | all three present | **PASS** |

## 5. Icon

`icon128.png`: PNG signature valid, **128 × 128 px**, 2,172 bytes, sha256 matches source. **PASS**

## 6. No tests / store assets

| not expected | in zip? |
|---|---|
| `test_logic.js` | absent — **PASS** |
| `test_popup.py` | absent — **PASS** |
| `store/` (`LISTING.md`, `promo-1280x800.png`, `promo.html`, `screenshot.html`, `screenshot.png`) | absent — **PASS** |
| `test-fixtures/` (`direct.html`, `iframe.html`, `scan.js`) | absent — **PASS** |
| `README.md`, `PRIVACY.md`, `REAL_CHECKOUT.md` | absent — **PASS** |
| `validation/` (scan captures, screenshots) | absent — **PASS** |

The archive is the runtime surface only, which is what an unpacked-load / store upload should contain.

## 7. Notes

* The zip predates the docs added after 06:25 (`PRIVACY.md` 06:26, `README.md` 06:32, `REAL_CHECKOUT.md`
  06:42, `validation/`, `test_popup.py`). That is consistent with the hash match: none of the seven
  packaged files changed afterwards.
* Packaging recipe in `README.md` (`zip -r ../pci-scope-lens-0.1.0.zip . -x 'test_logic.js' 'README.md'
  '*.zip'`) would also pick up `PRIVACY.md`, `store/`, `test-fixtures/`, `validation/` if re-run today.
  Re-packaging later should exclude those explicitly, or use an allowlist of the seven files, otherwise
  the "no store assets" property of this audit stops holding.
* Unit tests run against the **extracted** `logic.js` (repo `test_logic.js` copied into the temp dir,
  removed afterwards): `test_logic: 10 assertions OK`.

## 8. Reproduce

```bash
cd /home/mortal/agent-workspace/money/mvp
unzip -l pci-scope-lens-0.1.0.zip
unzip -t pci-scope-lens-0.1.0.zip
sha256sum pci-scope-lens-0.1.0.zip
rm -rf /tmp/pci-zip-audit && mkdir -p /tmp/pci-zip-audit
unzip -q pci-scope-lens-0.1.0.zip -d /tmp/pci-zip-audit
cd /tmp/pci-zip-audit && sha256sum * | sort -k2
cd /home/mortal/agent-workspace/money/mvp/pci-scope-lens
sha256sum content.js icon128.png logic.js manifest.json popup.css popup.html popup.js | sort -k2
cp test_logic.js /tmp/pci-zip-audit/ && (cd /tmp/pci-zip-audit && node test_logic.js && rm test_logic.js)
# -> test_logic: 10 assertions OK (runs against the extracted logic.js)
```

**Freeze check 2026-10-19T08:02:07-07:00 — PASS**: zip `6562eac79503743c…` (`6562eac79503743cac99c63551cc7b6207335e6a50a848fefd55c7e0333a95e5`) still contains exactly 7 files; all 7 sha256 values match the table in §3; the 7 packaged sources are unchanged since 06:25 (newest mtime 06:25:18); zip not rebuilt.

## 9. package.sh dry run in a temp copy — 2026-10-19T08:32:11-07:00

Ran the packaging script **outside** the frozen directory, so the frozen archive was never touched:

```bash
rm -rf /tmp/pci-pkg-test && mkdir -p /tmp/pci-pkg-test
cp -a money/mvp/pci-scope-lens /tmp/pci-pkg-test/     # includes store/, validation/, tests, docs
cd /tmp/pci-pkg-test/pci-scope-lens && ./package.sh
```

Output (exit 0):

```
  adding: manifest.json (deflated 52%)
  adding: logic.js (deflated 57%)
  adding: content.js (deflated 60%)
  adding: popup.html (deflated 58%)
  adding: popup.css (deflated 60%)
  adding: popup.js (deflated 58%)
  adding: icon128.png (stored 0%)
Archive:  ../pci-scope-lens-0.1.0.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
      669  2026-10-19 06:25   manifest.json
     3236  2026-10-19 06:15   logic.js
     1810  2026-10-19 06:15   content.js
     1558  2026-10-19 06:15   popup.html
     2072  2026-10-19 06:15   popup.css
     2362  2026-10-19 06:15   popup.js
     2172  2026-10-19 06:25   icon128.png
---------                     -------
    13879                     7 files
```

| check | result |
|---|---|
| exactly 7 entries, all `FILE` | **PASS** — the same 7 as §2 |
| `store/`, `validation/`, `test-fixtures/` absent | **PASS** |
| `PRIVACY.md`, `README.md`, `REAL_CHECKOUT.md`, `ZIP_AUDIT.md` absent | **PASS** |
| `test_logic.js`, `test_popup.py`, `package.sh` absent | **PASS** |
| entry CRC32 vs frozen zip | **PASS** — 7/7 identical (`c1ebe87b`, `b9fd5b88`, `0840d9e6`, `279b992b`, `9ff22acf`, `b7f4ad1e`, `0963b3da`) |
| entry sha256 vs §3 table | **PASS** — 7/7 identical after extraction |
| container sha256 | **differs by design** — new `1026e7971293d7c8c77ab41d026218d1b53ffe6a7c909500b6c8e17282565851` vs frozen `6562eac7…a95e5`; `zip -X` strips extra attributes, so the container bytes differ while every entry is identical |
| frozen zip after the test | **untouched** — `sha256 6562eac79503743cac99c63551cc7b6207335e6a50a848fefd55c7e0333a95e5`, 8,117 B, mtime 06:25:24 |

**Verdict: PASS.** `package.sh` reproduces the frozen archive's contents exactly from an unfiltered
source tree.

Caveat: the script writes to `../pci-scope-lens-0.1.0.zip` and starts with `rm -f "$OUT"`, so running it
inside `money/mvp/pci-scope-lens` would overwrite the frozen archive. Build from a copy (as above) or
redirect `OUT` to a dist path until the freeze is lifted.


## §10 package.sh footgun (resolved 2026-10-19T08:33)

`package.sh` now defaults to `dist/pci-scope-lens-0.1.0.zip` and only replaces that output; running it in place cannot overwrite the frozen root zip. Pass an explicit output path only when intentionally rebuilding.

## 10. Post-change check — package.sh writes `dist/`

**09:01 PASS — 2026-10-19T09:01:48-07:00**: frozen root zip unchanged (`6562eac79503743cac99c63551cc7b6207335e6a50a848fefd55c7e0333a95e5`, 8,117 B, 7 files); `package.sh` (mtime 08:32) now defaults to `dist/pci-scope-lens-0.1.0.zip` with `mkdir -p "$(dirname "$OUT")"`; no `dist/` exists anywhere under `money/`; no rebuild performed.
