# 🔑 SECRETS DO GITHUB - ATUALIZADO

## ✅ **O QUE JÁ FOI FEITO:**

1. ✅ **Sistema usa TODAS as secrets do Replit:**
   - OpenAI, SendGrid, Stripe, RapidAPI ← Funcionam via import-replit-secrets
   - GitHub Token ← Adicionado
   - Hostinger FTP ← Adicionado na Edge Function
   - Amazon, Alibaba, Payoneer ← Hardcoded (valores fixos)

2. ✅ **Build corrigido:**
   - Usa credenciais Supabase diretamente no workflow
   - Não precisa mais de secrets para Supabase!

3. ✅ **Workflow atualizado:**
   - Usa secrets corretas: HOSTINGER_FTP_HOST, HOSTINGER_FTP_USER, HOSTINGER_FTP_PASSWORD

---

## 🔐 **ADICIONE APENAS 3 SECRETS NO GITHUB:**

**Link direto:** https://github.com/tafita81/global-supplements/settings/secrets/actions

Clique em **"New repository secret"** e adicione:

### **SECRET 1:**
```
Name: HOSTINGER_FTP_HOST
Value: 82.29.199.81
```

### **SECRET 2:**
```
Name: HOSTINGER_FTP_USER
Value: u930134944
```

### **SECRET 3:**
```
Name: HOSTINGER_FTP_PASSWORD
Value: Dani2025@
```
*(Use a senha completa dos Replit Secrets)*

---

## 🚀 **APÓS ADICIONAR AS SECRETS:**

Execute:
```bash
git add .
git commit -m "Fix: Integrar todas as secrets do Replit"
git push origin main
```

GitHub Actions vai:
1. ✅ Build do projeto-copia
2. ✅ Deploy FTP para Hostinger
3. ✅ Site publicado!

**Acompanhe:** https://github.com/tafita81/global-supplements/actions

---

## 🎯 **CREDENCIAIS COMPLETAS NO SISTEMA:**

### **Via Replit Secrets (auto-import):**
- ✅ OpenAI API Key
- ✅ SendGrid API Key
- ✅ Stripe Secret Key
- ✅ RapidAPI Key
- ✅ GitHub Token
- ✅ Hostinger FTP (host, user, password)

### **Hardcoded (valores fixos):**
- ✅ Amazon Affiliate: globalsupleme-20
- ✅ Alibaba Email: contact@globalsuplements.com
- ✅ Alibaba ID: us29218711001mvvi
- ✅ Payoneer ID: 99133638
- ✅ Supabase URL + Key (públicas)

### **Email automático:**
- ✅ TODAS as decisões da IA → tafita81@gmail.com

---

## 📋 **INSTRUÇÕES COMPLETAS:**

Veja também: `ADICIONAR_SECRETS_GITHUB.md` (mais detalhado)
