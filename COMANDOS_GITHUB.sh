#!/bin/bash
# 🚀 Deploy Automático GitHub - Global Supplements
# Execute este script para fazer push para GitHub

echo "🚀 Deploy Automático GitHub - Global Supplements"
echo "================================================"
echo ""

# Verificar se já tem remote
if git remote | grep -q "origin"; then
    echo "✅ Remote 'origin' já configurado"
else
    echo "⚠️  Configure o remote primeiro:"
    echo "git remote add origin https://github.com/SEU_USUARIO/global-supplements.git"
    exit 1
fi

echo "📦 Adicionando arquivos..."
git add .

echo "💬 Fazendo commit..."
read -p "Mensagem do commit (ou Enter para usar padrão): " COMMIT_MSG
if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Update: $(date '+%Y-%m-%d %H:%M:%S')"
fi
git commit -m "$COMMIT_MSG"

echo "🚀 Fazendo push para GitHub..."
git push -u origin main

echo ""
echo "✅ DEPLOY INICIADO!"
echo ""
echo "📊 Acompanhe em: https://github.com/SEU_USUARIO/global-supplements/actions"
echo "🌐 Site será atualizado em: https://seudominio.com"
echo ""
echo "🎉 Pronto!"
