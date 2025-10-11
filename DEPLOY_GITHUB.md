# 🚀 Deploy GitHub - Global Supplements

## 📋 **PASSO A PASSO PARA GITHUB**

### **1. Configurar Repositório GitHub**

```bash
# 1. Criar repositório no GitHub
# Acesse: https://github.com/new
# Nome: global-supplements
# Descrição: B2B/B2C platform with AI-powered arbitrage automation

# 2. No terminal do Replit:
git remote add origin https://github.com/SEU_USUARIO/global-supplements.git

# 3. Fazer push
git branch -M main
git push -u origin main
```

---

### **2. Configurar GitHub Secrets**

No repositório GitHub:
1. Vá em **Settings** → **Secrets and variables** → **Actions**
2. Adicione os secrets:

```
VITE_SUPABASE_URL=https://tpqwumhdcjjchhtqmlxb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

OPENAI_API_KEY=sk-...
SENDGRID_API_KEY=SG....
STRIPE_SECRET_KEY=sk_live_...
RAPIDAPI_KEY=be45bf9b25mshe7d22fbd6e07e9cp169e8djsne8d3d39a4df5
```

---

### **3. GitHub Actions (CI/CD Automático)**

Crie arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Hostinger

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        
    - name: Install dependencies
      run: |
        cd projeto-copia
        npm install
        
    - name: Build
      run: |
        cd projeto-copia
        npm run build
        
    - name: Deploy to Hostinger via FTP
      uses: SamKirkland/FTP-Deploy-Action@4.3.3
      with:
        server: ${{ secrets.FTP_SERVER }}
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: ./projeto-copia/dist/
        server-dir: /public_html/
```

---

### **4. Adicionar FTP Secrets (Hostinger)**

No GitHub Secrets, adicione:
```
FTP_SERVER=ftp.seudominio.com
FTP_USERNAME=seu_usuario_ftp
FTP_PASSWORD=sua_senha_ftp
```

---

### **5. Fluxo Automático**

```
git push → GitHub Actions → Build → Deploy Hostinger
```

Toda vez que você fizer `git push`, o site será atualizado automaticamente!

---

## ✅ **COMANDOS ÚTEIS**

```bash
# Verificar status
git status

# Adicionar mudanças
git add .

# Commit
git commit -m "Update: Automated credentials import"

# Push para GitHub
git push origin main
```

---

## 🎉 **PRONTO!**

Agora o código está no GitHub e deploy é automático para Hostinger!
