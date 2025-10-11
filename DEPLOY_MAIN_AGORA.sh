#!/bin/bash
# Deploy para MAIN - Execute este script

echo "🚀 Fazendo deploy na branch MAIN..."
echo ""

# 1. Ir para main
git checkout main

# 2. Puxar últimas mudanças
git pull origin main

# 3. Fazer merge de experimentos
git merge experimentos -m "Merge: Sistema completo com login automático e credenciais"

# 4. Push para main (ativa GitHub Actions)
git push origin main

echo ""
echo "✅ DEPLOY COMPLETO!"
echo ""
echo "📊 GitHub Actions em: https://github.com/tafita81/global-supplements/actions"
echo "🌐 Site será atualizado automaticamente no Hostinger"
echo ""
