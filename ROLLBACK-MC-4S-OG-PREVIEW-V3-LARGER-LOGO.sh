#!/usr/bin/env bash
# Rollback for MC-4S follow-up 2 (new v3 OG asset with larger logo).
# Restores index.html (back to mc4s2 / alameen-og-preview.png) and removes the v3 image.
# Static/frontend social-preview asset only; no JS/backend touched.
set -euo pipefail
SITE="/home/amin/alameen-eg-site"
BK="$SITE/backups/MC-4S-og-preview-v3-larger-logo-20260624_140808"
cd "$SITE"
cp "$BK/index.html" index.html
rm -f images/alameen-og-preview-v3.png
echo "Restored index.html (mc4s2) from: $BK"
echo "Removed images/alameen-og-preview-v3.png"
echo "Commit & push to make the rollback live:"
echo "  git add -A && git commit -m 'Rollback MC-4S v3 larger-logo OG image' && git push"
