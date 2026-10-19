#!/usr/bin/env bash
# Build the store zip with an explicit allowlist. Keeps tests/store assets out.
set -euo pipefail
cd "$(dirname "$0")"
VERSION="$(python3 -c 'import json;print(json.load(open("manifest.json"))["version"])')"
OUT="${1:-dist/pci-scope-lens-${VERSION}.zip}"
FILES=(manifest.json logic.js content.js popup.html popup.css popup.js icon128.png)
mkdir -p "$(dirname "$OUT")"
rm -f "$OUT"
zip -X -r "$OUT" "${FILES[@]}"
unzip -l "$OUT" | tail -12
