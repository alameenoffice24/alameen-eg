#!/usr/bin/env bash
# Rollback for MC-4S follow-up 3 (v4 dominant-logo OG composition).
# Restores index.html (back to v3 / mc4s3) and removes the v4 image.
# Static/frontend social-preview asset only; no JS/backend touched.
set -euo pipefail
SITE="/home/amin/alameen-eg-site"
BK="$SITE/backups/MC-4S-og-preview-v4-dominant-logo-20260624_142026"
cd "$SITE"
cp "$BK/index.html" index.html
rm -f images/alameen-og-preview-v4.png
echo "Restored index.html (v3 / mc4s3) from: $BK"
echo "Removed images/alameen-og-preview-v4.png"
echo "Commit & push to make the rollback live:"
echo "  git add -A && git commit -m 'Rollback MC-4S v4 dominant-logo OG image' && git push"
