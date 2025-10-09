#!/bin/bash
cd /home/runner/workspace/s2day-new
git add .
git commit -m "Rebrand: Global Supplements → Shipping Today"
git push origin main
echo ""
echo "✅ REBRANDING COMPLETO!"
echo ""
echo "🔄 Deploy iniciando automaticamente..."
echo "📊 https://github.com/tafita81/s2day-new/actions"
