#!/bin/bash
cd /home/runner/workspace/s2day-new
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://$GITHUB_TOKEN@github.com/tafita81/s2day-new.git
git push -u origin main --force
echo ""
echo "✅ PUSH COMPLETO!"
echo "🔗 https://github.com/tafita81/s2day-new/actions"
