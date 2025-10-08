#!/bin/bash
cd /home/runner/workspace/s2day-new
git add .github/workflows/deploy-hostinger.yml
git commit -m "Deploy final para shippingtoday.shop"
git push origin main
echo ""
echo "✅ DEPLOY CONFIGURADO!"
echo "📍 Pasta: /public_html/shippingtoday.shop/"
echo ""
echo "🔗 https://github.com/tafita81/s2day-new/actions"
