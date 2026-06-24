#!/usr/bin/env bash
# Rollback for MC-4S follow-up (enlarge logo in OG social preview).
# Restores the previous OG image + index.html (cache-bust mc4s) from backup.
# Static/frontend social-preview asset only; no JS/backend touched.
set -euo pipefail
SITE="/home/amin/alameen-eg-site"
BK="$SITE/backups/MC-4S-followup-og-image-enlarge-logo-20260624_135505"
cd "$SITE"
cp "$BK/alameen-og-preview.png" images/alameen-og-preview.png
cp "$BK/index.html" index.html
echo "Restored images/alameen-og-preview.png + index.html from: $BK"
echo "Commit & push to make the rollback live:"
echo "  git add -A && git commit -m 'Rollback MC-4S follow-up enlarge logo' && git push"
