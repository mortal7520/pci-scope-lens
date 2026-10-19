#!/usr/bin/env bash
# Build store packages for Scope Lens from the 7 allowlisted runtime files.
# Writes to dist/ and never touches the frozen root zip or the source manifest.
#
#   dist/pci-scope-lens-<ver>-firefox.xpi   AMO (gecko id + data collection declaration injected)
#   dist/pci-scope-lens-<ver>-edge.zip      Edge Add-ons (plain MV3 package)
set -euo pipefail
cd "$(dirname "$0")"

VERSION="$(python3 -c 'import json;print(json.load(open("manifest.json"))["version"])')"
GECKO_ID="${GECKO_ID:-pci-scope-lens@bbflow.local}"
OUT="dist"
FILES=(manifest.json logic.js content.js popup.html popup.css popup.js icon128.png)

rm -rf "$OUT"
mkdir -p "$OUT/firefox" "$OUT/edge"
cp "${FILES[@]}" "$OUT/firefox/"
cp "${FILES[@]}" "$OUT/edge/"

python3 - "$OUT/firefox/manifest.json" "$GECKO_ID" <<'PY'
import json, sys
path, gecko_id = sys.argv[1], sys.argv[2]
m = json.load(open(path))
m["browser_specific_settings"] = {
    "gecko": {
        "id": gecko_id,
        "strict_min_version": "142.0",
        "data_collection_permissions": {"required": ["none"]},
    }
}
json.dump(m, open(path, "w"), indent=2)
open(path, "a").write("\n")
print(f"firefox manifest: gecko id {gecko_id}, data_collection_permissions none")
PY

( cd "$OUT/firefox" && zip -X -q -r "../pci-scope-lens-${VERSION}-firefox.xpi" . )
( cd "$OUT/edge"    && zip -X -q -r "../pci-scope-lens-${VERSION}-edge.zip" . )

rm -rf "$OUT/firefox" "$OUT/edge"
echo
ls -l "$OUT"
sha256sum "$OUT"/*.xpi "$OUT"/*.zip
