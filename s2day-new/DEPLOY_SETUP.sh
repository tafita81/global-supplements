#!/bin/bash

echo "🚀 SETUP AUTOMÁTICO S2DAY-NEW"
echo "=============================="
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Execute este script dentro da pasta s2day-new"
    exit 1
fi

# Inicializar Git
echo "📦 Inicializando repositório Git..."
git init
git add .
git commit -m "Initial commit - S2Day New (clone completo do Global Supplements)"

# Adicionar remote
echo "🔗 Conectando ao GitHub..."
git branch -M main
git remote add origin https://github.com/tafita81/s2day-new.git

# Push
echo "⬆️ Fazendo push para GitHub..."
git push -u origin main --force

echo ""
echo "✅ REPOSITÓRIO CONFIGURADO!"
echo ""
echo "⚠️ ÚLTIMO PASSO (Manual):"
echo "1. Acesse: https://github.com/tafita81/s2day-new/settings/secrets/actions/new"
echo "2. Name: FTP_PASSWORD"
echo "3. Secret: Dani2025@"
echo "4. Clique em 'Add secret'"
echo ""
echo "Depois disso, o deploy automático vai começar a funcionar!"
echo "Acompanhe em: https://github.com/tafita81/s2day-new/actions"
