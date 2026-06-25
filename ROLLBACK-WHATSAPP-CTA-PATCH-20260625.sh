#!/usr/bin/env bash
# Rollback the WhatsApp CTA consistency patch (2026-06-25):
# restores the pre-patch index.html + js/main.js (re-adds the "WhatsApp being
# activated" notice/modal and removes the direct wa.me CTA + schema contactPoint).
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"
BK="backups/WHATSAPP-CTA-PATCH-20260625_084010"

for f in index.html js/main.js; do
  if [ ! -f "$BK/$f" ]; then echo "ERROR: backup missing $BK/$f" >&2; exit 1; fi
done

cp "$BK/index.html" index.html
cp "$BK/js/main.js" js/main.js
echo "Restored index.html + js/main.js from $BK"
grep -c "قيد التفعيل" index.html | xargs echo "  'قيد التفعيل' occurrences after restore:"

# To redeploy the rollback (GitHub Pages), uncomment:
# git add index.html js/main.js
# git commit -m "Rollback WhatsApp CTA patch"
# git push origin main
echo "Local rollback done. To redeploy: git add + commit + push origin main (see commented lines)."
