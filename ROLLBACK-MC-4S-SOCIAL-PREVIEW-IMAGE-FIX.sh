#!/usr/bin/env bash
# Rollback for MC-4S social preview (OG) image fix.
# Restores index.html (OG/Twitter/JSON-LD tags) from backup and removes the new OG image.
# Static/frontend only; no JS/backend touched.
set -euo pipefail
SITE="/home/amin/alameen-eg-site"
BK="$SITE/backups/MC-4S-social-preview-image-fix-20260624_130453"
cd "$SITE"
cp "$BK/index.html" index.html
rm -f images/alameen-og-preview.png
echo "Restored index.html from: $BK"
echo "Removed images/alameen-og-preview.png"
echo "Commit & push to make the rollback live:"
echo "  git add -A && git commit -m 'Rollback MC-4S social preview image' && git push"
