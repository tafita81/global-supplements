# 🚀 Setup GitHub Deploy Automático - Global Supplements

## ✅ **SISTEMA JÁ CONFIGURADO!**

O GitHub Actions está **100% pronto**. Agora siga os passos abaixo:

---

## 📋 **PASSO 1: Criar Repositório GitHub**

1. Acesse: https://github.com/new
2. Configure:
   - **Nome:** `global-supplements`
   - **Descrição:** `B2B/B2C platform with AI-powered arbitrage automation`
   - **Visibilidade:** Private (recomendado) ou Public
3. **NÃO marque** "Initialize with README"
4. Clique **"Create repository"**

---

## 📋 **PASSO 2: Configurar Secrets no GitHub**

1. No repositório criado, vá em **Settings** → **Secrets and variables** → **Actions**
2. Clique em **"New repository secret"**
3. Adicione os seguintes secrets:

### **Secrets Supabase:**
```
Name: VITE_SUPABASE_URL
Value: https://tpqwumhdcjjchhtqmlxb.supabase.co

Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwcXd1bWhkY2pqY2hodHFtbHhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1OTA0NjEsImV4cCI6MjA1MDE2NjQ2MX0.kPsY7EgvKzHC6YhNlT0qd8Ib-g0G0lmLwTZHnNLXlCw
```

### **Secrets Hostinger (FTP):**
```
Name: FTP_SERVER
Value: ftp.seudominio.com (ou IP do servidor)

Name: FTP_USERNAME
Value: seu_usuario_ftp_hostinger

Name: FTP_PASSWORD
Value: sua_senha_ftp_hostinger
```

**💡 Onde encontrar credenciais FTP Hostinger:**
- Acesse **hPanel → Files → FTP Accounts**
- Ou crie nova conta FTP
- Anote: Server, Username, Password

---

## 📋 **PASSO 3: Push para GitHub**

No terminal do Replit, execute:

```bash
# 1. Inicializar Git (se necessário)
git init

# 2. Adicionar remote do seu repositório
git remote add origin https://github.com/SEU_USUARIO/global-supplements.git

# 3. Adicionar todos os arquivos
git add .

# 4. Fazer commit
git commit -m "🚀 Deploy inicial: Sistema completo com IA autônoma"

# 5. Renomear branch para main
git branch -M main

# 6. Push para GitHub
git push -u origin main
```

**⚠️ Se pedir autenticação:**
- Use **Personal Access Token** ao invés de senha
- Crie em: https://github.com/settings/tokens
- Permissões: `repo` (full control)

---

## 🎉 **FUNCIONAMENTO AUTOMÁTICO:**

Após o push, o GitHub Actions vai:

1. ✅ **Instalar dependências**
2. ✅ **Compilar o projeto** (build)
3. ✅ **Copiar .htaccess**
4. ✅ **Fazer deploy no Hostinger** (via FTP)

**Acompanhe em:** `https://github.com/SEU_USUARIO/global-supplements/actions`

---

## 🔄 **WORKFLOW AUTOMÁTICO:**

```
git push → GitHub Actions → Build → Deploy Hostinger
```

**Toda vez que você fizer `git push`, o site será atualizado automaticamente!**

---

## ✅ **VERIFICAR DEPLOY:**

1. Acesse: `https://seudominio.com`
2. Verifique:
   - ✅ Site carrega
   - ✅ Login automático funciona
   - ✅ Todas páginas acessíveis
   - ✅ RFQ Matcher com IA
   - ✅ Emails para tafita81@gmail.com

---

## 📧 **CREDENCIAIS AUTOMÁTICAS:**

Já configuradas automaticamente:
- ✅ OpenAI (ChatGPT)
- ✅ SendGrid (Email)
- ✅ Stripe (Pagamentos)
- ✅ RapidAPI (Amazon)
- ✅ Amazon: globalsupleme-20
- ✅ Alibaba: contact@globalsuplements.com
- ✅ Payoneer: 99133638

---

## 🆘 **PROBLEMAS COMUNS:**

### **Deploy falhou?**
- Verifique secrets no GitHub (Settings → Secrets)
- Verifique credenciais FTP Hostinger
- Veja logs em: Actions → último workflow

### **Site não atualiza?**
- Verifique se push foi bem-sucedido
- Veja Actions no GitHub
- Limpe cache do navegador

---

## 🔧 **COMANDOS ÚTEIS:**

```bash
# Ver status
git status

# Fazer mudanças
git add .
git commit -m "Update: descrição"
git push

# Ver histórico
git log --oneline

# Ver remotes
git remote -v
```

---

## 🎉 **PRONTO!**

Agora cada `git push` atualiza o site automaticamente no Hostinger!

**Arquivo workflow:** `.github/workflows/deploy.yml`  
**Monitoramento:** https://github.com/SEU_USUARIO/global-supplements/actions
