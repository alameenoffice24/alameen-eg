#!/usr/bin/env bash
# Rollback for MC-4P premium bot-bubble styling (mc4p).
# Restores css/style.css + the 3 HTML files (cache-bust) from the backup.
# CSS-only change: ivory bot bubble + gold accent + softer shadow; no JS/backend touched.
set -euo pipefail
SITE="/home/amin/alameen-eg-site"
BK="$SITE/backups/MC-4P-chat-bubble-premium-style-20260624_033725"
cd "$SITE"
cp "$BK/style.css" css/style.css
for f in index.html terms.html privacy-policy.html; do cp "$BK/$f" "$f"; done
echo "Rolled back style.css + HTML cache-bust from: $BK"
echo "Commit & push to make the rollback live:"
echo "  git add -A && git commit -m 'Rollback MC-4P bot bubble premium style' && git push"
