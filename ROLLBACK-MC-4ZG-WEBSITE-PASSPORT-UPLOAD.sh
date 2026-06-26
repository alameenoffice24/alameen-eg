#!/usr/bin/env bash
set -e
cd /home/amin/alameen-eg-site
cp "backups/MC-4ZG-website-passport-upload-20260627_002246/index.html" index.html
cp "backups/MC-4ZG-website-passport-upload-20260627_002246/main.js" js/main.js
echo "reverted index.html + js/main.js. Now: git add -A && git commit && git push to redeploy."
