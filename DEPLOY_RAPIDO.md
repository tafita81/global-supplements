# 🚀 DEPLOY RÁPIDO - Global Supplements

## 📦 **OPÇÃO 1: DEPLOY HOSTINGER (MAIS RÁPIDO)**

### **3 Passos Simples:**

1. **Baixe a pasta `projeto-copia/dist/`**
   - Contém todo o site compilado
   - Já inclui `.htaccess` configurado

2. **Upload para Hostinger:**
   - Acesse **cPanel File Manager**
   - Vá até pasta `public_html`
   - Faça upload de TUDO da pasta `dist/`
   - **OU** crie ZIP da pasta `dist/` e extraia no servidor

3. **Pronto!** 🎉
   - Site estará ativo em: `https://seudominio.com`
   - Login automático (SEM precisar logar)
   - Credenciais importadas automaticamente

---

## 🔧 **OPÇÃO 2: DEPLOY VIA FTP**

### **FileZilla / WinSCP:**

```
Host: ftp.seudominio.com
User: seu_usuario_ftp
Pass: sua_senha_ftp
Port: 21

Faça upload de: projeto-copia/dist/* → /public_html/
```

---

## 🌐 **OPÇÃO 3: DEPLOY GITHUB PAGES**

1. **Criar repositório GitHub**
2. **Fazer push:**
```bash
git add .
git commit -m "Deploy Global Supplements"
git push origin main
```

3. **Ativar GitHub Pages:**
   - Settings → Pages
   - Source: `main` branch, folder `/`
   - Save

---

## ✅ **VERIFICAÇÕES PÓS-DEPLOY:**

Acesse o site e confirme:
- ✅ Site carrega corretamente
- ✅ Login automático funciona
- ✅ Todas páginas acessíveis
- ✅ RFQ Matcher funcionando
- ✅ Emails chegando em **tafita81@gmail.com**

---

## 📧 **CREDENCIAIS DO SISTEMA:**

**Todas configuradas automaticamente:**
- OpenAI API (ChatGPT)
- SendGrid (Email)
- Stripe (Pagamentos)
- RapidAPI (Amazon)
- Amazon Affiliate: globalsupleme-20
- Alibaba: contact@globalsuplements.com
- Payoneer: 99133638

**Email notificações:** tafita81@gmail.com

---

## 🆘 **AJUDA RÁPIDA:**

**Site não carrega?**
- Verifique se `.htaccess` está no servidor
- Verifique se HTTPS está ativo
- Limpe cache do navegador (Ctrl+Shift+Del)

**Login não funciona?**
- O sistema faz login automático
- Não precisa digitar nada
- Se aparecer erro, recarregue a página

---

## 📁 **ARQUIVOS IMPORTANTES:**

```
dist/
├── index.html          (Página principal)
├── .htaccess          (Config servidor - IMPORTANTE!)
├── assets/            (CSS, JS, imagens)
└── ...

DEPLOY_HOSTINGER.md    (Guia completo Hostinger)
DEPLOY_GITHUB.md       (Guia completo GitHub)
.htaccess              (Configuração Apache)
```

---

## 🎉 **DEPLOY COMPLETO EM 5 MINUTOS!**

Escolha a opção que preferir e faça o upload. O sistema funcionará automaticamente!
