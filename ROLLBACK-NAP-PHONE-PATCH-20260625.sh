#!/usr/bin/env bash
# Rollback the NAP phone patch (2026-06-25): restore +201030008802 in index.html + js/main.js.
# Restores from the timestamped backup taken before the patch, then commits + pushes (redeploys).
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"
BK="backups/NAP-PHONE-PATCH-20260625_082411"

for f in index.html js/main.js terms.html privacy-policy.html; do
  if [ ! -f "$BK/$f" ]; then echo "ERROR: backup missing $BK/$f" >&2; exit 1; fi
done

cp "$BK/index.html" index.html
cp "$BK/js/main.js" js/main.js
cp "$BK/terms.html" terms.html
cp "$BK/privacy-policy.html" privacy-policy.html
echo "Restored index.html + js/main.js + terms.html + privacy-policy.html from $BK"

echo "Verify:"; grep -n "telephone" index.html | head -1; grep -n "phoneNumber" js/main.js | head -1

# To redeploy the rollback (GitHub Pages), uncomment:
# git add index.html js/main.js
# git commit -m "Rollback NAP phone patch (restore legacy number)"
# git push origin main
echo "Local rollback done. To redeploy: git add + commit + push origin main (see commented lines)."
