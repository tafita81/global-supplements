# 🚀 SETUP COMPLETO - S2DAY-NEW

## ⚠️ IMPORTANTE: USAR CREDENCIAIS NOVAS E SEPARADAS

Este projeto é uma **cópia independente** do Global Supplements. Você precisa criar **novos serviços separados** para evitar conflitos.

---

## 📋 CHECKLIST COMPLETO (Faça na ordem)

### ✅ 1. CRIAR NOVO BANCO DE DADOS SUPABASE

**Por que:** O projeto atual usa o Supabase do Global Supplements. Você precisa de um NOVO banco separado.

1. Acesse: https://supabase.com/dashboard
2. Clique em **"New Project"**
3. Configure:
   - **Name:** `s2day-new` (ou outro nome)
   - **Database Password:** Crie uma senha forte
   - **Region:** Escolha mais próxima de você
4. Aguarde ~2 minutos (criação do banco)
5. Copie as credenciais:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **Anon/Public Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI...`

**Onde usar:**
- Arquivo: `s2day-new/src/integrations/supabase/client.ts`
- Substitua `SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY`

---

### ✅ 2. CRIAR TABELAS NO NOVO SUPABASE

O banco novo está vazio. Você precisa criar as mesmas tabelas do projeto original:

**OPÇÃO A - Copiar Schema (Recomendado):**
1. No Supabase antigo: SQL Editor → Export Schema
2. No Supabase novo: SQL Editor → Cole e execute

**OPÇÃO B - Criar Manualmente:**
Execute no SQL Editor do novo Supabase:

```sql
-- Tabela de oportunidades
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  margin DECIMAL,
  status TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de suppliers
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  country TEXT,
  rating DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de execuções
CREATE TABLE execution_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID REFERENCES opportunities(id),
  status TEXT,
  profit DECIMAL,
  executed_at TIMESTAMP DEFAULT NOW()
);

-- Adicione outras tabelas conforme necessário
```

---

### ✅ 3. OBTER NOVAS API KEYS DO RAPIDAPI

**Por que:** Usar as mesmas keys divide a cota entre 2 projetos.

1. Acesse: https://rapidapi.com/hub
2. Procure: **"Real-Time Amazon Data"**
3. **Subscribe** (plano gratuito 100 req/mês)
4. Copie a **X-RapidAPI-Key** nova

**Onde usar:**
- Arquivo: `s2day-new/.env`
- Adicione: `VITE_RAPIDAPI_KEY_1=sua-nova-key-aqui`

---

### ✅ 4. CRIAR NOVA CONTA OPENAI (Opcional)

**Por que:** Para ter créditos separados.

1. Acesse: https://platform.openai.com/signup (use outro email)
2. Vá em: API Keys → Create new secret key
3. Copie a key: `sk-proj-xxxxx...`

**Onde usar:**
- Arquivo: `s2day-new/.env`
- Adicione: `VITE_OPENAI_API_KEY=sk-proj-xxxxx`

**OU use a mesma:**
- No Replit, a variável `$OPENAI_API_KEY` já existe
- Mantenha: `VITE_OPENAI_API_KEY=$OPENAI_API_KEY`

---

### ✅ 5. CONFIGURAR NOVO SERVIDOR HOSTINGER

**OPÇÃO A - Novo domínio/subdomínio:**
1. No painel Hostinger, crie novo site/subdomínio
2. Anote: servidor FTP, usuário, senha, diretório

**OPÇÃO B - Usar mesmo servidor, pasta diferente:**
- Servidor: `82.29.199.81`
- Usuário: `u930134944`
- Senha: `Dani2025@`
- **Diretório:** `/public_html/s2day/` (pasta separada!)

---

### ✅ 6. CRIAR REPOSITÓRIO GITHUB

1. Acesse: https://github.com/new
2. Nome: `s2day-new`
3. ⚠️ **NÃO** marque "Add README"
4. Clique em **"Create repository"**

---

### ✅ 7. CONECTAR AO GITHUB

```bash
cd ~/workspace/s2day-new
git init
git add .
git commit -m "Initial commit - S2Day New Project"
git branch -M main
git remote add origin https://github.com/tafita81/s2day-new.git
git push -u origin main
```

---

### ✅ 8. ADICIONAR SECRETS NO GITHUB

Acesse: https://github.com/tafita81/s2day-new/settings/secrets/actions

Adicione os seguintes secrets com VALORES NOVOS:

| Secret Name | Valor | Descrição |
|-------------|-------|-----------|
| `FTP_SERVER` | `82.29.199.81` | Servidor FTP (ou novo) |
| `FTP_USERNAME` | `u930134944` | Usuário FTP (ou novo) |
| `FTP_PASSWORD` | `Dani2025@` | Senha FTP (ou nova) |
| `FTP_SERVER_DIR` | `/public_html/s2day/` | **PASTA DIFERENTE!** |

---

### ✅ 9. ATUALIZAR ARQUIVO .ENV

Edite: `s2day-new/.env`

```env
# OpenAI (pode usar a mesma ou criar nova conta)
VITE_OPENAI_API_KEY=$OPENAI_API_KEY

# RapidAPI (NOVA key obrigatória!)
VITE_RAPIDAPI_KEY_1=sua-nova-rapidapi-key-aqui

# Supabase (NOVAS credenciais obrigatórias!)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

---

### ✅ 10. ATUALIZAR SUPABASE CLIENT

Edite: `s2day-new/src/integrations/supabase/client.ts`

```typescript
const SUPABASE_URL = "https://SEU-NOVO-PROJETO.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6...SUA-NOVA-KEY";
```

---

## 🎯 RESUMO - O QUE CRIAR DE NOVO:

| Serviço | Status | Ação |
|---------|--------|------|
| Supabase | ❌ Criar novo | Novo projeto + copiar schema |
| RapidAPI | ❌ Criar novo | Nova subscription |
| OpenAI | ⚠️ Opcional | Nova conta ou usar mesma |
| GitHub Repo | ❌ Criar novo | Repositório s2day-new |
| Hostinger | ⚠️ Opcional | Novo site ou pasta separada |

---

## ✅ CHECKLIST FINAL

Antes de fazer push, verifique:

- [ ] Novo banco Supabase criado e configurado
- [ ] Tabelas copiadas no novo Supabase
- [ ] Nova RapidAPI key obtida
- [ ] Arquivo `.env` atualizado com credenciais novas
- [ ] `supabase/client.ts` com URL e key novas
- [ ] Repositório GitHub criado
- [ ] Secrets FTP configurados no GitHub
- [ ] FTP_SERVER_DIR aponta para pasta diferente

---

## 🚀 TESTAR LOCALMENTE

```bash
cd ~/workspace/s2day-new
npm install
npm run dev
```

Acesse: http://localhost:5173

**Teste:**
1. ✅ Site carrega sem erros
2. ✅ Produtos Amazon aparecem (RapidAPI funcionando)
3. ✅ Banco de dados conecta (Supabase funcionando)

---

## 📤 FAZER DEPLOY

```bash
git add .
git commit -m "Update credentials and deploy config"
git push origin main
```

Acompanhe: https://github.com/tafita81/s2day-new/actions

---

## ⚠️ IMPORTANTE - NÃO MISTURAR!

### ❌ NÃO FAÇA:
- Usar mesmo banco Supabase (vai conflitar)
- Usar mesma RapidAPI key (vai dividir cota)
- Fazer deploy na mesma pasta Hostinger (vai sobrescrever)

### ✅ FAÇA:
- Novo banco Supabase (independente)
- Nova RapidAPI key (cota própria)
- Pasta separada no Hostinger (ou novo domínio)

---

**Está tudo pronto para configurar!** 

Siga a ordem dos passos e terá um projeto 100% independente! 🎊
