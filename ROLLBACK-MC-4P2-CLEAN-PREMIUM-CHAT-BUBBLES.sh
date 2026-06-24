#!/usr/bin/env bash
# Rollback for MC-4P2 clean premium chat bubble redesign (mc4p2).
# Restores css/style.css + the 3 HTML files (cache-bust) from the backup.
# CSS-only: white bot bubble (no gold bar / no creamy card); no JS/backend touched.
set -euo pipefail
SITE="/home/amin/alameen-eg-site"
BK="$SITE/backups/MC-4P2-clean-premium-chat-bubbles-20260624_041240"
cd "$SITE"
cp "$BK/style.css" css/style.css
for f in index.html terms.html privacy-policy.html; do cp "$BK/$f" "$f"; done
echo "Rolled back style.css + HTML cache-bust from: $BK"
echo "Commit & push to make the rollback live:"
echo "  git add -A && git commit -m 'Rollback MC-4P2 clean chat bubbles' && git push"
