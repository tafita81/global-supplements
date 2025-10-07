#!/bin/bash
cd /home/runner/workspace/s2day-new
git add .github/workflows/deploy-hostinger.yml
git commit -m "Fix: Deploy para pasta separada /public_html/s2day/"
git push origin main
echo ""
echo "✅ DEPLOY CORRIGIDO!"
echo "Agora vai para: /public_html/s2day/"
echo ""
echo "🔗 Acompanhe: https://github.com/tafita81/s2day-new/actions"
