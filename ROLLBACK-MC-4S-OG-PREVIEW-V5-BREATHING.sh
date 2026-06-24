#!/usr/bin/env bash
# Rollback for MC-4S follow-up 4 (v5 OG image with breathing room around the card).
# Restores index.html (back to v4 / mc4s4) and removes the v5 image.
# Static/frontend social-preview asset only; no JS/backend touched.
set -euo pipefail
SITE="/home/amin/alameen-eg-site"
BK="$SITE/backups/MC-4S-og-preview-v5-breathing-20260624_153911"
cd "$SITE"
cp "$BK/index.html" index.html
rm -f images/alameen-og-preview-v5.png
echo "Restored index.html (v4 / mc4s4) from: $BK"
echo "Removed images/alameen-og-preview-v5.png"
echo "Commit & push to make the rollback live:"
echo "  git add -A && git commit -m 'Rollback MC-4S v5 breathing OG image' && git push"
