# S2Day - Novo Projeto

## 🎉 Projeto Criado com Sucesso!

Este é uma cópia completa do projeto Global Supplements, pronto para ser seu novo projeto independente.

## 📋 Próximos Passos (Você Precisa Fazer)

### 1️⃣ Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. **Nome do repositório:** `s2day-new` (ou outro nome que preferir)
3. **Visibilidade:** Público ou Privado
4. ⚠️ **NÃO marque:** "Add a README file"
5. ⚠️ **NÃO marque:** "Add .gitignore"
6. Clique em **"Create repository"**

### 2️⃣ Conectar ao GitHub (Execute no Terminal)

```bash
cd ~/workspace/s2day-new
git init
git add .
git commit -m "Initial commit - S2Day project"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/s2day-new.git
git push -u origin main
```

**Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub!**

### 3️⃣ Configurar Secrets no GitHub

Acesse: `https://github.com/SEU-USUARIO/s2day-new/settings/secrets/actions`

Adicione os seguintes secrets:

| Secret Name | Valor Sugerido | Descrição |
|-------------|----------------|-----------|
| `FTP_SERVER` | Seu servidor FTP | Servidor FTP Hostinger |
| `FTP_USERNAME` | Seu usuário FTP | Usuário FTP |
| `FTP_PASSWORD` | Sua senha FTP | Senha FTP |
| `FTP_PORT` | `21` | Porta FTP (opcional, padrão 21) |
| `FTP_SERVER_DIR` | `/public_html/` | Diretório no servidor (opcional) |

**⚠️ IMPORTANTE:** Use os dados do SEU servidor Hostinger!

### 4️⃣ Verificar Deploy Automático

Após o push, verifique se o deploy está rodando:

🔗 https://github.com/SEU-USUARIO/s2day-new/actions

Você verá:
- ✅ Verde = Deploy com sucesso
- ❌ Vermelho = Erro (verifique os secrets)

## 🚀 Funcionalidades Já Configuradas

### ✅ Deploy Automático
- **A cada push** para branch `main`
- **A cada 1:30h** (deploy agendado)
- **Manual** via botão "Run workflow"

### ✅ Cache Inteligente
- LocalStorage com validade de 1 hora
- Load instantâneo (0ms) em visitas repetidas
- Economia de 95% nas chamadas de API

### ✅ Tecnologias
- React 18 + TypeScript
- Vite + Tailwind CSS
- shadcn/ui components
- Sistema Multi-API

## 📦 Desenvolvimento Local

```bash
cd ~/workspace/s2day-new
npm install
npm run dev
```

Acesse: http://localhost:5173

## 🔧 Build para Produção

```bash
npm run build
```

Os arquivos de produção estarão na pasta `dist/`

---

**Criado a partir de:** Global Supplements  
**Data:** Outubro 2025  
**Status:** ✅ Pronto para uso!
