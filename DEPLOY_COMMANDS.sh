#!/bin/bash

# 🚀 Script de Deploy - Global Supplements
# Execute este script após configurar todos os secrets

echo "╔════════════════════════════════════════════╗"
echo "║  Global Supplements - Deploy Automático   ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para verificar erros
check_error() {
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Erro: $1${NC}"
        exit 1
    fi
}

# Verificar se está na pasta correta
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Execute este script na pasta projeto-copia${NC}"
    exit 1
fi

echo -e "${BLUE}📋 CHECKLIST DE PRÉ-REQUISITOS${NC}"
echo ""
echo "Você já configurou os seguintes secrets no Supabase?"
echo "  - BUFFER_ACCESS_TOKEN"
echo "  - SENDGRID_API_KEY"
echo "  - GSC_CREDENTIALS"
echo ""
read -p "Todos os secrets estão configurados? (s/n): " secrets_ready

if [ "$secrets_ready" != "s" ]; then
    echo -e "${YELLOW}⚠️  Configure os secrets primeiro!${NC}"
    echo "Veja: SETUP_PRODUCAO.md - Passo 1"
    exit 1
fi

# Passo 1: Verificar Supabase CLI
echo ""
echo -e "${BLUE}🔍 Passo 1: Verificando Supabase CLI...${NC}"

if ! command -v supabase &> /dev/null; then
    echo -e "${YELLOW}📦 Instalando Supabase CLI...${NC}"
    npm install -g supabase
    check_error "Instalação do Supabase CLI falhou"
fi

echo -e "${GREEN}✅ Supabase CLI instalado${NC}"

# Passo 2: Login no Supabase
echo ""
echo -e "${BLUE}🔐 Passo 2: Login no Supabase...${NC}"
echo "Uma janela do navegador vai abrir para você autorizar."
echo ""

supabase login
check_error "Login no Supabase falhou"

echo -e "${GREEN}✅ Login realizado${NC}"

# Passo 3: Linkar projeto
echo ""
echo -e "${BLUE}🔗 Passo 3: Linkar com projeto Supabase...${NC}"
echo ""
echo "Você precisa do PROJECT_REF do seu projeto."
echo "Encontre em: Supabase Dashboard > Project Settings > General > Reference ID"
echo ""
read -p "Digite o PROJECT_REF: " project_ref

if [ -z "$project_ref" ]; then
    echo -e "${RED}❌ PROJECT_REF não pode estar vazio${NC}"
    exit 1
fi

supabase link --project-ref "$project_ref"
check_error "Link com projeto falhou"

echo -e "${GREEN}✅ Projeto linkado${NC}"

# Passo 4: Deploy das Edge Functions
echo ""
echo -e "${BLUE}📤 Passo 4: Deploy das Edge Functions...${NC}"
echo ""

echo "Deployando buffer-integration..."
supabase functions deploy buffer-integration
check_error "Deploy buffer-integration falhou"

echo "Deployando sendgrid-integration..."
supabase functions deploy sendgrid-integration
check_error "Deploy sendgrid-integration falhou"

echo "Deployando gsc-integration..."
supabase functions deploy gsc-integration
check_error "Deploy gsc-integration falhou"

echo "Deployando generate-content..."
supabase functions deploy generate-content
check_error "Deploy generate-content falhou"

echo -e "${GREEN}✅ Todas as Edge Functions deployadas!${NC}"

# Passo 5: Verificar deploy
echo ""
echo -e "${BLUE}🔍 Passo 5: Verificando deploy...${NC}"
echo ""

supabase functions list

# Passo 6: Verificar secrets
echo ""
echo -e "${BLUE}🔐 Passo 6: Verificando secrets...${NC}"
echo ""

supabase secrets list

# Resumo final
echo ""
echo "╔════════════════════════════════════════════╗"
echo "║          🎉 DEPLOY CONCLUÍDO! 🎉          ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✅ Edge Functions deployadas com sucesso!${NC}"
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1. Testar integrações (veja SETUP_PRODUCAO.md - Passo 4)"
echo "2. Configurar FTP_PASSWORD no GitHub"
echo "3. Fazer push para branch main ou experimentos"
echo ""
echo "🌐 Suas Edge Functions estão em:"
echo "   https://${project_ref}.supabase.co/functions/v1/buffer-integration"
echo "   https://${project_ref}.supabase.co/functions/v1/sendgrid-integration"
echo "   https://${project_ref}.supabase.co/functions/v1/gsc-integration"
echo "   https://${project_ref}.supabase.co/functions/v1/generate-content"
echo ""
echo -e "${BLUE}📖 Documentação completa: SETUP_PRODUCAO.md${NC}"
echo ""
