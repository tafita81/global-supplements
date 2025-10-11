# 🚀 Deploy Global Supplements - Hostinger

## 📋 **CREDENCIAIS DA EMPRESA**
- **Alibaba Dropshipping Email:** contact@globalsuplements.com
- **Alibaba Dropshipping ID:** us29218711001mvvi
- **Amazon Affiliate Tag:** globalsupleme-20
- **Payoneer Customer ID:** 99133638
- **Email Notificações:** tafita81@gmail.com

---

## 🌐 **PASSO 1: DEPLOY NO HOSTINGER**

### **1.1 Upload dos Arquivos**
1. Acesse **Hostinger cPanel** ou **File Manager**
2. Navegue até pasta `public_html` (ou pasta do domínio)
3. Faça upload da pasta `dist/` completa do projeto
4. Renomeie `dist/` para o nome do domínio ou mantenha como raiz

### **1.2 Configurar Variáveis de Ambiente**
No **Hostinger**, adicione as variáveis no arquivo `.htaccess` ou no painel de configuração:

```env
# APIs Replit Secrets
VITE_SUPABASE_URL=https://tpqwumhdcjjchhtqmlxb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# No servidor (Edge Functions via Supabase)
OPENAI_API_KEY=sk-...
SENDGRID_API_KEY=SG....
STRIPE_SECRET_KEY=sk_live_...
RAPIDAPI_KEY=be45bf9b25mshe7d22fbd6e07e9cp169e8djsne8d3d39a4df5
```

---

## 🗄️ **PASSO 2: BANCO DE DADOS SUPABASE**

O banco de dados já está no **Supabase Cloud**, então:
- ✅ **Nada a fazer** - O Hostinger apenas serve o frontend
- ✅ **Edge Functions** continuam rodando no Supabase
- ✅ **Todas as credenciais** já estão no sistema

---

## ⚙️ **PASSO 3: CONFIGURAR .htaccess (Hostinger)**

Crie arquivo `.htaccess` na raiz do site:

```apache
# Redirect HTTP para HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# React Router - Redirecionar tudo para index.html
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Cache Control
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access 1 year"
  ExpiresByType image/jpeg "access 1 year"
  ExpiresByType image/gif "access 1 year"
  ExpiresByType image/png "access 1 year"
  ExpiresByType image/webp "access 1 year"
  ExpiresByType text/css "access 1 month"
  ExpiresByType application/javascript "access 1 month"
  ExpiresByType text/html "access 1 hour"
</IfModule>
```

---

## 🔐 **PASSO 4: EDGE FUNCTIONS (Supabase)**

As Edge Functions já estão rodando no Supabase:
- ✅ `import-replit-secrets` - Importação automática
- ✅ `rfq-supplier-matcher` - Sistema RFQ com IA
- ✅ Outras 30+ funções configuradas

**Configuração automática** - Nada a fazer!

---

## 📧 **PASSO 5: EMAIL AUTOMÁTICO**

Sistema configurado para enviar emails para:
- ✅ **tafita81@gmail.com** (todas notificações)
- ✅ **Via SendGrid** (já configurado automaticamente)

---

## 🚀 **PASSO 6: TESTAR O DEPLOY**

1. **Acesse o site** no Hostinger
2. **Sistema carrega automaticamente** com:
   - ✅ Login automático (sem precisar logar)
   - ✅ Credenciais importadas automaticamente
   - ✅ Todas as APIs funcionando

3. **Testar funcionalidades:**
   - `/rfq-matcher` - Sistema de matching RFQ
   - `/revenue-automation-setup` - Status das credenciais
   - Todas as outras páginas

---

## 📊 **ESTRUTURA DO SISTEMA**

```
Frontend (Hostinger)
    ↓
Supabase (Backend/Database)
    ↓
Edge Functions (APIs)
    ↓
Serviços Externos (OpenAI, SendGrid, Stripe, etc)
```

---

## 🔧 **COMANDOS ÚTEIS**

### **Build local (se precisar):**
```bash
cd projeto-copia
npm install
npm run build
```

### **Upload para Hostinger:**
- Via **FTP/SFTP**: FileZilla, WinSCP
- Via **cPanel File Manager**: Upload ZIP da pasta `dist/`
- Via **SSH** (se disponível):
```bash
scp -r dist/* user@hostinger:/public_html/
```

---

## ✅ **CHECKLIST FINAL**

- [ ] Upload pasta `dist/` para Hostinger
- [ ] Configurar `.htaccess` para React Router
- [ ] Verificar HTTPS funcionando
- [ ] Testar login automático
- [ ] Testar importação de credenciais
- [ ] Testar RFQ Matcher com IA
- [ ] Verificar emails em tafita81@gmail.com

---

## 🎉 **SISTEMA PRONTO!**

**URL do Site:** https://seudominio.com  
**Email Notificações:** tafita81@gmail.com  
**Banco de Dados:** Supabase (automático)  
**Todas Credenciais:** Importadas automaticamente!

---

## 🆘 **SUPORTE**

Se houver problemas:
1. Verifique logs do Hostinger cPanel
2. Verifique logs Supabase Dashboard
3. Verifique console do navegador (F12)
4. Todos os emails vão para tafita81@gmail.com
