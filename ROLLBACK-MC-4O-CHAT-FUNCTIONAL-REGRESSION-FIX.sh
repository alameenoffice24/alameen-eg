#!/usr/bin/env bash
# Rollback for MC-4O chat functional-regression diagnosis fix (mc4o3).
# Diagnosis found the live chat was already FUNCTIONAL; this change only
# added a safe textarea scrollbar polish + bumped cache-bust mc4o2 -> mc4o3.
# Restores style.css + the 3 HTML files (cache-bust) from the backup.
set -euo pipefail
SITE="/home/amin/alameen-eg-site"
BK="$SITE/backups/MC-4O-chat-functional-regression-fix-20260624_032918"
cd "$SITE"
for f in style.css; do cp "$BK/$f" "css/$f"; done
for f in index.html terms.html privacy-policy.html; do cp "$BK/$f" "$f"; done
echo "Rolled back style.css + HTML cache-bust from: $BK"
echo "Now commit & push if you want the rollback live:"
echo "  git add -A && git commit -m 'Rollback MC-4O chat regression fix (mc4o3)' && git push"
