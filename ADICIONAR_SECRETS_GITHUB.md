# 🔑 ADICIONAR SECRETS NO GITHUB - PASSO A PASSO

## ⚡ **3 SECRETS NECESSÁRIAS (valores do Replit):**

---

### **📍 PASSO 1: Acesse a página de secrets**

**Link direto:** https://github.com/tafita81/global-supplements/settings/secrets/actions

---

### **📍 PASSO 2: Adicione cada secret abaixo**

Clique em **"New repository secret"** e adicione:

---

#### **🔐 SECRET 1:**
```
Name: HOSTINGER_FTP_HOST
Value: 82.29.199.81
```
*(Removi o "ftp://" - não é necessário)*

---

#### **🔐 SECRET 2:**
```
Name: HOSTINGER_FTP_USER
Value: u930134944
```

---

#### **🔐 SECRET 3:**
```
Name: HOSTINGER_FTP_PASSWORD
Value: Dani2025@
```
*(Use a senha completa que está nos Replit Secrets)*

---

## ✅ **APÓS ADICIONAR AS 3 SECRETS:**

O GitHub Actions vai ter acesso a:
- ✅ HOSTINGER_FTP_HOST = 82.29.199.81
- ✅ HOSTINGER_FTP_USER = u930134944  
- ✅ HOSTINGER_FTP_PASSWORD = Dani2025@

---

## 🚀 **DEPOIS DAS SECRETS, FAÇA O DEPLOY:**

```bash
git add .
git commit -m "Fix: Usar todas as secrets do Replit + Hostinger FTP"
git push origin main
```

**GitHub Actions vai:**
1. ✅ Build do projeto-copia (com credenciais Supabase)
2. ✅ Deploy FTP para Hostinger (com credenciais FTP)
3. ✅ Site publicado automaticamente!

---

## 📊 **ACOMPANHE O DEPLOY:**

Após o push: https://github.com/tafita81/global-supplements/actions

Você verá:
- ✅ Build: Success
- ✅ Deploy FTP: Success
- ✅ Site publicado!

---

## 🎉 **RESUMO DO QUE FIZ:**

✅ **Integração completa com Replit Secrets:**
- OpenAI, SendGrid, Stripe, RapidAPI ← JÁ FUNCIONAM
- GitHub Token ← ADICIONADO
- Hostinger FTP ← ADICIONADO NA EDGE FUNCTION

✅ **GitHub Actions configurado:**
- Build usa credenciais Supabase (hardcoded, são públicas)
- Deploy usa secrets FTP do GitHub

✅ **Sistema import-replit-secrets atualizado:**
- Importa TODAS as credenciais do Replit automaticamente
- Inclui: OpenAI, SendGrid, Stripe, RapidAPI, GitHub, Hostinger FTP
- Inclui hardcoded: Amazon (globalsupleme-20), Alibaba, Payoneer (99133638)

---

## 🔥 **TUDO PRONTO!**

**Só falta:**
1. ✅ Adicionar 3 secrets no GitHub (link acima)
2. ✅ Commit e push
3. ✅ Acompanhar deploy
