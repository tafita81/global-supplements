# 🚀 Setup de Produção - Global Supplements

## Guia Passo a Passo para Ativar Todas as Funcionalidades

---

## 📋 CHECKLIST GERAL

- [ ] Passo 1: Configurar Secrets no Supabase
- [ ] Passo 2: Deploy das Edge Functions
- [ ] Passo 3: Configurar Secret do GitHub (FTP)
- [ ] Passo 4: Testar Integrações
- [ ] Passo 5: Deploy em Produção

---

## 🔐 PASSO 1: CONFIGURAR SECRETS NO SUPABASE

### **1.1 Acessar Dashboard do Supabase**

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto: **Global Supplements**
3. Vá em: `Project Settings` → `Edge Functions` → `Manage Secrets`

---

### **1.2 Configurar Buffer API Token**

**Como obter:**
1. Acesse: https://publish.buffer.com/developers/api
2. Faça login na sua conta Buffer
3. Clique em `Create Access Token`
4. Copie o token gerado

**Adicionar no Supabase:**
```bash
# Nome do Secret:
BUFFER_ACCESS_TOKEN

# Valor:
[Cole aqui o token que você copiou]
```

---

### **1.3 Configurar SendGrid API Key**

**Como obter:**
1. Acesse: https://app.sendgrid.com/settings/api_keys
2. Faça login na sua conta SendGrid
3. Clique em `Create API Key`
4. Nome: "Global Supplements Production"
5. Permissões: `Full Access`
6. Copie a API Key (você só verá uma vez!)

**Adicionar no Supabase:**
```bash
# Nome do Secret:
SENDGRID_API_KEY

# Valor:
[Cole aqui a API Key que você copiou]
```

---

### **1.4 Configurar Google Search Console Credentials**

**Como obter:**

**Passo 1: Criar Projeto no Google Cloud**
1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto ou use existente
3. Nome: "Global Supplements SEO"

**Passo 2: Ativar API**
1. Vá em `APIs & Services` → `Library`
2. Busque: "Google Search Console API"
3. Clique em `Enable`

**Passo 3: Criar Credenciais OAuth**
1. Vá em `APIs & Services` → `Credentials`
2. Clique em `+ CREATE CREDENTIALS` → `OAuth client ID`
3. Application type: `Web application`
4. Nome: "Global Supplements"
5. Authorized redirect URIs: `https://developers.google.com/oauthplayground`
6. Copie: `Client ID` e `Client Secret`

**Passo 4: Obter Refresh Token**
1. Acesse: https://developers.google.com/oauthplayground
2. Clique no ícone de engrenagem (⚙️) → `Use your own OAuth credentials`
3. Cole seu `Client ID` e `Client Secret`
4. No campo esquerdo, busque: "Google Search Console API v1"
5. Selecione: `https://www.googleapis.com/auth/webmasters.readonly`
6. Clique em `Authorize APIs`
7. Faça login com sua conta Google
8. Autorize o acesso
9. Clique em `Exchange authorization code for tokens`
10. Copie o `Refresh token`

**Adicionar no Supabase:**
```bash
# Nome do Secret:
GSC_CREDENTIALS

# Valor (formato JSON em uma linha):
{"client_id":"SEU_CLIENT_ID","client_secret":"SEU_CLIENT_SECRET","refresh_token":"SEU_REFRESH_TOKEN"}
```

⚠️ **IMPORTANTE:** O JSON deve estar em uma única linha, sem quebras!

---

### **1.5 Verificar Secrets Configurados**

No terminal do Supabase CLI:
```bash
supabase secrets list
```

Deve aparecer:
- ✅ BUFFER_ACCESS_TOKEN
- ✅ SENDGRID_API_KEY
- ✅ GSC_CREDENTIALS

---

## 📤 PASSO 2: DEPLOY DAS EDGE FUNCTIONS

### **2.1 Instalar Supabase CLI (se ainda não tiver)**

```bash
npm install -g supabase
```

### **2.2 Login no Supabase**

```bash
supabase login
```

Isso abrirá o navegador para você autorizar.

### **2.3 Linkar com o Projeto**

```bash
cd projeto-copia
supabase link --project-ref [SEU_PROJECT_REF]
```

**Como encontrar o PROJECT_REF:**
1. Vá no Supabase Dashboard
2. `Project Settings` → `General`
3. Copie o `Reference ID`

### **2.4 Deploy das Edge Functions**

```bash
# Deploy individual (recomendado para primeira vez)
supabase functions deploy buffer-integration
supabase functions deploy sendgrid-integration
supabase functions deploy gsc-integration
supabase functions deploy generate-content

# OU deploy de todas de uma vez:
supabase functions deploy
```

### **2.5 Verificar Deploy**

```bash
supabase functions list
```

Deve aparecer:
- ✅ buffer-integration (deployed)
- ✅ sendgrid-integration (deployed)
- ✅ gsc-integration (deployed)
- ✅ generate-content (deployed)

---

## 🔑 PASSO 3: CONFIGURAR SECRET DO GITHUB (FTP)

### **3.1 Obter Credenciais FTP do Hostinger**

Você já tem no workflow:
- Server: `82.29.199.81`
- Username: `u930134944`
- Falta: **Password do FTP**

**Como obter:**
1. Acesse: https://hpanel.hostinger.com/
2. Faça login
3. Vá em `Hospedagem` → `Gerenciar`
4. Clique em `FTP Accounts`
5. Copie ou resete a senha do usuário `u930134944`

### **3.2 Adicionar Secret no GitHub**

1. Acesse: https://github.com/SEU_USUARIO/SEU_REPOSITORIO/settings/secrets/actions
2. Clique em `New repository secret`
3. Nome: `FTP_PASSWORD`
4. Value: [Cole a senha do FTP]
5. Clique em `Add secret`

---

## 🧪 PASSO 4: TESTAR INTEGRAÇÕES

### **4.1 Testar Buffer Integration**

**No navegador (DevTools Console):**
```javascript
const { data: { session } } = await supabase.auth.getSession();

const response = await fetch(
  'https://SEU_PROJECT_REF.supabase.co/functions/v1/buffer-integration',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action: 'get_profiles' })
  }
);

const data = await response.json();
console.log('Buffer:', data);
```

**Resultado esperado:**
```json
{
  "success": true,
  "profiles": [...],
  "mock": false
}
```

---

### **4.2 Testar SendGrid Integration**

**No navegador (DevTools Console):**
```javascript
const { data: { session } } = await supabase.auth.getSession();

const response = await fetch(
  'https://SEU_PROJECT_REF.supabase.co/functions/v1/sendgrid-integration',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      to: ['seu@email.com'],
      from: 'noreply@globalsupplements.com',
      subject: 'Teste de Produção',
      html: '<h1>Funcionou! 🎉</h1>'
    })
  }
);

const data = await response.json();
console.log('SendGrid:', data);
```

**Resultado esperado:**
```json
{
  "success": true,
  "mock": false
}
```

E você deve receber o email!

---

### **4.3 Testar Google Search Console**

**No navegador (DevTools Console):**
```javascript
const { data: { session } } = await supabase.auth.getSession();

const response = await fetch(
  'https://SEU_PROJECT_REF.supabase.co/functions/v1/gsc-integration',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      siteUrl: 'https://globalsupplements.com',
      startDate: '2025-01-01',
      endDate: '2025-01-30'
    })
  }
);

const data = await response.json();
console.log('GSC:', data);
```

**Resultado esperado:**
```json
{
  "success": true,
  "rows": [...],
  "mock": false
}
```

---

## 🚀 PASSO 5: DEPLOY EM PRODUÇÃO

### **5.1 Deploy Automático via GitHub**

**Branch Experimentos (Dev):**
```bash
git checkout experimentos
git pull
git push origin experimentos
```

Isso dispara:
- ✅ Build automático
- ✅ Deploy para: `/public_html/global-supplements-dev/`
- ✅ Acesse: `https://seudominio.com/global-supplements-dev/`

**Branch Main (Produção):**
```bash
git checkout main
git merge experimentos  # ou seu branch de trabalho
git push origin main
```

Isso dispara:
- ✅ Build automático
- ✅ Deploy para: `/public_html/`
- ✅ Acesse: `https://seudominio.com/`

### **5.2 Acompanhar Deploy**

1. Acesse: https://github.com/SEU_USUARIO/SEU_REPOSITORIO/actions
2. Veja o workflow rodando
3. Se tudo OK: ✅ verde
4. Se erro: 🔴 vermelho (clique para ver logs)

---

## ✅ CHECKLIST FINAL

### **Secrets Configurados:**
- [ ] Buffer Access Token (Supabase)
- [ ] SendGrid API Key (Supabase)
- [ ] GSC Credentials (Supabase)
- [ ] FTP Password (GitHub)

### **Edge Functions:**
- [ ] buffer-integration deployed
- [ ] sendgrid-integration deployed
- [ ] gsc-integration deployed
- [ ] generate-content deployed

### **Testes:**
- [ ] Buffer retorna `mock: false`
- [ ] SendGrid envia email real
- [ ] GSC retorna dados reais
- [ ] Amazon products carregam

### **Deploy:**
- [ ] GitHub Actions configurado
- [ ] Deploy DEV funcionando
- [ ] Deploy PROD funcionando

---

## 🎯 RESUMO DOS LINKS IMPORTANTES

| Serviço | Link | O que fazer |
|---------|------|-------------|
| Supabase | https://supabase.com/dashboard | Configurar secrets + Deploy Edge Functions |
| Buffer | https://publish.buffer.com/developers/api | Obter Access Token |
| SendGrid | https://app.sendgrid.com/settings/api_keys | Obter API Key |
| Google Cloud | https://console.cloud.google.com/ | Criar OAuth credentials |
| OAuth Playground | https://developers.google.com/oauthplayground | Obter Refresh Token |
| GitHub Secrets | https://github.com/settings/secrets | Adicionar FTP_PASSWORD |
| Hostinger | https://hpanel.hostinger.com/ | Obter senha FTP |

---

## 🆘 TROUBLESHOOTING

### **Edge Function retorna `mock: true`**
→ Secrets não configurados. Verifique no Supabase Dashboard.

### **Deploy falha no GitHub**
→ Secret `FTP_PASSWORD` ausente ou incorreto.

### **Buffer/SendGrid/GSC retorna erro**
→ Verifique se as credenciais estão corretas e ativas.

### **Email não chega (SendGrid)**
→ Verifique spam. Configure domínio no SendGrid.

---

## 📞 SUPORTE

Se tiver problemas:
1. Verifique logs no Supabase: `Edge Functions > [function] > Logs`
2. Verifique logs no GitHub Actions: `Actions > [workflow] > Build logs`
3. Teste localmente primeiro antes de deployar

---

**Data de Criação:** Outubro 9, 2025  
**Versão:** 1.0 - Setup de Produção Completo
