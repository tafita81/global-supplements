# 🔑 GUIA PASSO A PASSO - CONFIGURAR TODAS AS CREDENCIAIS

## Índice Rápido

**Tempo Total:** 32 minutos

| Passo | Serviço | Tempo | Página |
|-------|---------|-------|--------|
| 1️⃣ | **Buffer** (Social Media) | 5 min | [Ir](#passo-1-buffer-access-token) |
| 2️⃣ | **SendGrid** (Email) | 10 min | [Ir](#passo-2-sendgrid-api-key) |
| 3️⃣ | **Google Search Console** (SEO) | 15 min | [Ir](#passo-3-google-search-console) |
| 4️⃣ | **Deploy Edge Functions** | 5 min | [Ir](#passo-4-deploy-edge-functions) |
| 5️⃣ | **GitHub FTP** (CI/CD) | 2 min | [Ir](#passo-5-github-ftp-password) |

---

## 📋 PRÉ-REQUISITOS

Antes de começar, você precisa ter:

- [ ] Conta Supabase (você já tem)
- [ ] Acesso ao projeto no Supabase Dashboard
- [ ] Navegador com acesso à internet
- [ ] Email para criar contas nos serviços

---

# PASSO 1: BUFFER ACCESS TOKEN

## ⏱️ Tempo: 5 minutos

### 📝 O que é Buffer?

Buffer é uma plataforma para agendar posts em redes sociais (Facebook, Instagram, Twitter, etc.).

### 🎯 O que vamos fazer:

1. Criar conta grátis no Buffer
2. Conectar suas redes sociais
3. Obter o Access Token (chave de API)
4. Adicionar no Supabase

---

### **1.1 Criar Conta no Buffer**

1. **Acesse:** https://publish.buffer.com/signup
   
2. **Preencha o formulário:**
   - Nome
   - Email
   - Senha
   - Clique em "Get Started Free"

3. **Confirme seu email:**
   - Abra o email do Buffer
   - Clique no link de confirmação

4. **Escolha o plano:**
   - Selecione: **"Free Plan"** (grátis)
   - Permite 3 canais sociais
   - 10 posts agendados

---

### **1.2 Conectar Redes Sociais (Opcional)**

1. **No Dashboard do Buffer:**
   - Clique em "Connect Channels"
   
2. **Escolha suas redes:**
   - Facebook Page
   - Instagram Business
   - Twitter/X
   - LinkedIn Page
   - (escolha pelo menos 1)

3. **Autorize cada rede:**
   - Faça login na rede social
   - Autorize o Buffer
   - Aguarde confirmação

---

### **1.3 Obter Access Token**

1. **Acesse a área de desenvolvedores:**
   ```
   https://publish.buffer.com/developers/api
   ```

2. **Clique em "Create a Token"**

3. **Copie o Access Token:**
   ```
   Exemplo: 1/abc123def456ghi789jkl012mno345pqr678
   ```
   
   ⚠️ **IMPORTANTE:** Guarde este token, ele aparece só uma vez!

---

### **1.4 Adicionar no Supabase**

1. **Abra o Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/SEU_PROJETO_ID/settings/vault/secrets
   ```

2. **Clique em "New Secret"**

3. **Preencha:**
   - **Name:** `BUFFER_ACCESS_TOKEN`
   - **Value:** Cole o token que você copiou
   - Exemplo: `1/abc123def456ghi789jkl012mno345pqr678`

4. **Clique em "Save"**

5. **✅ Confirmação:**
   - Você verá: `BUFFER_ACCESS_TOKEN` na lista de secrets

---

### **1.5 Verificação Rápida**

```bash
# No terminal do Replit, teste:
curl -X POST https://SEU_PROJETO.supabase.co/functions/v1/buffer-integration \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_JWT_TOKEN" \
  -d '{"action": "get_profiles"}'

# Se retornar seus perfis sociais = ✅ FUNCIONOU!
# Se retornar erro = ❌ verificar token
```

---

# PASSO 2: SENDGRID API KEY

## ⏱️ Tempo: 10 minutos

### 📝 O que é SendGrid?

SendGrid é um serviço para enviar emails (transacionais, newsletters, campanhas).

### 🎯 O que vamos fazer:

1. Criar conta grátis no SendGrid (100 emails/dia grátis)
2. Verificar email de remetente
3. Obter API Key
4. Adicionar no Supabase

---

### **2.1 Criar Conta no SendGrid**

1. **Acesse:** https://signup.sendgrid.com/

2. **Preencha o formulário:**
   - Email
   - Senha
   - Clique em "Create Account"

3. **Complete o questionário:**
   - Role: "Developer" ou "Marketing"
   - Company: "Personal" ou nome da sua empresa
   - Employee Count: "1-10"
   - Email Goal: "Transactional Emails"

4. **Confirme seu email:**
   - Abra o email do SendGrid
   - Clique em "Verify Single Sender"

---

### **2.2 Verificar Email de Remetente**

⚠️ **OBRIGATÓRIO:** SendGrid só envia emails de remetentes verificados.

1. **No Dashboard do SendGrid:**
   - Menu: **Settings** → **Sender Authentication**

2. **Opção 1: Single Sender (Mais Rápido - 2 min):**
   
   a. Clique em "**Get Started**" em "Single Sender Verification"
   
   b. Preencha o formulário:
      - **From Name:** Seu nome ou empresa
      - **From Email:** seu@email.com (email real que você controla)
      - **Reply To:** mesmo email ou outro
      - **Company Address:** Endereço completo
      - **City, State, ZIP, Country:** Complete os dados
   
   c. Clique em "**Create**"
   
   d. **Verifique seu email:**
      - Abra o email "SendGrid Sender Verification"
      - Clique em "**Verify Single Sender**"
      - ✅ Confirmação: "Sender Verified"

---

3. **Opção 2: Domain Authentication (Recomendado - 10 min):**
   
   *Use se você tem um domínio próprio (mais profissional)*
   
   a. Clique em "**Get Started**" em "Domain Authentication"
   
   b. Escolha seu DNS provider:
      - Hostinger
      - GoDaddy
      - Cloudflare
      - Outro
   
   c. Digite seu domínio:
      - Exemplo: `meusite.com`
   
   d. **Copie os registros DNS** que aparecem:
      ```
      CNAME: em1234.meusite.com → u1234567.wl123.sendgrid.net
      CNAME: s1._domainkey.meusite.com → s1.domainkey.u1234567.wl123.sendgrid.net
      CNAME: s2._domainkey.meusite.com → s2.domainkey.u1234567.wl123.sendgrid.net
      ```
   
   e. **Adicione no seu DNS:**
      - Vá ao painel do seu provedor de domínio
      - Adicione cada registro CNAME
      - Aguarde 5-10 minutos (propagação DNS)
   
   f. **Volte ao SendGrid:**
      - Clique em "**Verify**"
      - ✅ Se aparecer "Verified" = pronto!

---

### **2.3 Obter API Key**

1. **No Dashboard do SendGrid:**
   ```
   Menu: Settings → API Keys
   ```

2. **Clique em "Create API Key"**

3. **Configure a API Key:**
   - **API Key Name:** `Global Supplements Marketing`
   - **API Key Permissions:** Selecione "**Full Access**"
     *(ou "Restricted Access" → marque apenas "Mail Send")*

4. **Clique em "Create & View"**

5. **COPIE A API KEY:**
   ```
   Exemplo: SG.abc123DEF456ghi789JKL012mno345PQR678stu901VWX234
   ```
   
   ⚠️ **CRÍTICO:** Esta chave aparece **UMA VEZ APENAS**!
   - Copie agora
   - Salve em arquivo temporário
   - Se perder, precisa criar outra

---

### **2.4 Adicionar no Supabase**

1. **Abra o Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/SEU_PROJETO_ID/settings/vault/secrets
   ```

2. **Clique em "New Secret"**

3. **Preencha:**
   - **Name:** `SENDGRID_API_KEY`
   - **Value:** Cole a API Key que você copiou
   - Exemplo: `SG.abc123DEF456ghi789JKL012mno345PQR678stu901VWX234`

4. **Clique em "Save"**

5. **✅ Confirmação:**
   - Você verá: `SENDGRID_API_KEY` na lista de secrets

---

### **2.5 Testar Email**

**Teste rápido no navegador:**

```javascript
// Abra o console do navegador (F12) no seu app
// Cole e execute:

const response = await fetch('https://SEU_PROJETO.supabase.co/functions/v1/sendgrid-integration', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session.access_token}`
  },
  body: JSON.stringify({
    action: 'send_email',
    to: ['seu@email.com'],
    subject: 'Teste SendGrid',
    html: '<h1>Funcionou!</h1><p>SendGrid está configurado.</p>'
  })
});

const data = await response.json();
console.log(data);

// ✅ Se você recebeu o email = FUNCIONOU!
// ❌ Se erro 403 = verificar API Key
// ❌ Se erro 400 = verificar sender (passo 2.2)
```

---

# PASSO 3: GOOGLE SEARCH CONSOLE

## ⏱️ Tempo: 15 minutos

### 📝 O que é Google Search Console?

Ferramenta gratuita do Google para ver como seu site aparece na busca (keywords, posições, cliques).

### 🎯 O que vamos fazer:

1. Adicionar site no Google Search Console
2. Criar projeto no Google Cloud
3. Ativar API do Search Console
4. Criar OAuth Credentials
5. Obter Refresh Token
6. Adicionar JSON no Supabase

---

### **3.1 Adicionar Site no Google Search Console**

1. **Acesse:** https://search.google.com/search-console

2. **Clique em "Adicionar Propriedade"**

3. **Escolha o tipo:**
   - **Prefixo de URL:** Digite `https://seusite.com`
   - Clique em "Continuar"

4. **Verificar propriedade:**
   
   **Opção mais fácil: HTML Tag**
   
   a. Copie o código de verificação:
      ```html
      <meta name="google-site-verification" content="ABC123XYZ789...">
      ```
   
   b. Adicione no `<head>` do seu site:
      ```html
      <!-- No arquivo index.html -->
      <head>
        <meta name="google-site-verification" content="ABC123XYZ789...">
        ...
      </head>
      ```
   
   c. Publique o site (git push)
   
   d. Volte ao Search Console e clique em "**Verificar**"
   
   e. ✅ Se aparecer "Propriedade verificada" = pronto!

---

### **3.2 Criar Projeto no Google Cloud**

1. **Acesse:** https://console.cloud.google.com/

2. **Criar novo projeto:**
   - Clique no seletor de projeto (topo)
   - Clique em "**New Project**"
   - Nome: `Global Supplements Marketing`
   - Clique em "**Create**"
   - Aguarde 30 segundos (criação do projeto)

3. **Selecione o projeto:**
   - Clique no seletor de projeto
   - Selecione "Global Supplements Marketing"

---

### **3.3 Ativar API do Search Console**

1. **No Google Cloud Console:**
   ```
   Menu (☰) → APIs & Services → Library
   ```

2. **Buscar API:**
   - Digite: "**Google Search Console API**"
   - Clique na API que aparece

3. **Ativar:**
   - Clique em "**Enable**"
   - Aguarde 10 segundos

4. **✅ Confirmação:**
   - Aparece: "API enabled"

---

### **3.4 Criar OAuth Credentials**

1. **No Google Cloud Console:**
   ```
   Menu (☰) → APIs & Services → Credentials
   ```

2. **Criar OAuth Consent Screen (primeira vez):**
   
   a. Clique na aba "**OAuth consent screen**"
   
   b. User Type: **External**
   
   c. Clique em "**Create**"
   
   d. Preencha:
      - **App name:** `Global Supplements`
      - **User support email:** seu@email.com
      - **Developer contact:** seu@email.com
   
   e. Clique em "**Save and Continue**" (3x)
   
   f. Clique em "**Back to Dashboard**"

---

3. **Criar OAuth Client ID:**
   
   a. Volte para: **Credentials**
   
   b. Clique em "**+ Create Credentials**" → "**OAuth client ID**"
   
   c. Preencha:
      - **Application type:** `Web application`
      - **Name:** `Global Supplements Marketing`
      - **Authorized redirect URIs:** Clique em "+ Add URI"
        ```
        https://developers.google.com/oauthplayground
        ```
   
   d. Clique em "**Create**"
   
   e. **COPIE e SALVE:**
      ```
      Client ID: 123456789012-abc123def456ghi789jkl.apps.googleusercontent.com
      Client Secret: GOCSPX-abc123DEF456ghi789JKL012
      ```
      
      ⚠️ Guarde estes valores! Vamos usar no próximo passo.

---

### **3.5 Obter Refresh Token**

1. **Acesse o OAuth Playground:**
   ```
   https://developers.google.com/oauthplayground
   ```

2. **Configurar o Playground:**
   
   a. Clique no ícone de **⚙️ (engrenagem)** no canto superior direito
   
   b. Marque: **"Use your own OAuth credentials"**
   
   c. Cole:
      - **OAuth Client ID:** (copiado no passo 3.4)
      - **OAuth Client Secret:** (copiado no passo 3.4)
   
   d. Clique fora para fechar

---

3. **Autorizar a API:**
   
   a. **Step 1 (lado esquerdo):**
      - Busque: "**Google Search Console API v1**"
      - Marque: `https://www.googleapis.com/auth/webmasters.readonly`
   
   b. Clique em "**Authorize APIs**"
   
   c. **Escolha sua conta Google**
   
   d. Clique em "**Advanced**" → "**Go to Global Supplements (unsafe)**"
   
   e. Marque: "**Select all**"
   
   f. Clique em "**Continue**"
   
   g. ✅ Você volta para o Playground

---

4. **Obter o Refresh Token:**
   
   a. **Step 2 (lado esquerdo):**
      - Clique em "**Exchange authorization code for tokens**"
   
   b. **COPIE o Refresh Token:**
      ```json
      {
        "refresh_token": "1//0abc123DEF456ghi789JKL012mno345PQR678stu901VWX234"
      }
      ```
      
      ⚠️ Este é o token mais importante! Salve-o.

---

### **3.6 Criar JSON de Credenciais**

Agora vamos juntar tudo em um JSON:

1. **Abra um editor de texto**

2. **Cole este template:**

```json
{
  "client_id": "COLE_SEU_CLIENT_ID_AQUI",
  "client_secret": "COLE_SEU_CLIENT_SECRET_AQUI",
  "refresh_token": "COLE_SEU_REFRESH_TOKEN_AQUI"
}
```

3. **Substitua os valores:**

```json
{
  "client_id": "123456789012-abc123def456ghi789jkl.apps.googleusercontent.com",
  "client_secret": "GOCSPX-abc123DEF456ghi789JKL012",
  "refresh_token": "1//0abc123DEF456ghi789JKL012mno345PQR678stu901VWX234"
}
```

4. **IMPORTANTE:** Deve ser uma LINHA ÚNICA (sem quebras):

```json
{"client_id":"123456789012-abc123def456ghi789jkl.apps.googleusercontent.com","client_secret":"GOCSPX-abc123DEF456ghi789JKL012","refresh_token":"1//0abc123DEF456ghi789JKL012mno345PQR678stu901VWX234"}
```

---

### **3.7 Adicionar no Supabase**

1. **Abra o Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/SEU_PROJETO_ID/settings/vault/secrets
   ```

2. **Clique em "New Secret"**

3. **Preencha:**
   - **Name:** `GSC_CREDENTIALS`
   - **Value:** Cole o JSON (1 linha única)

4. **Clique em "Save"**

5. **✅ Confirmação:**
   - Você verá: `GSC_CREDENTIALS` na lista de secrets

---

### **3.8 Testar Search Console**

**Teste rápido no navegador:**

```javascript
// Console do navegador (F12) no seu app:

const response = await fetch('https://SEU_PROJETO.supabase.co/functions/v1/gsc-integration', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session.access_token}`
  },
  body: JSON.stringify({
    action: 'get_search_analytics',
    siteUrl: 'https://seusite.com',
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  })
});

const data = await response.json();
console.log(data);

// ✅ Se retornar dados de keywords = FUNCIONOU!
// ❌ Se erro 401 = refresh_token inválido (refazer passo 3.5)
// ❌ Se erro 403 = API não ativada (verificar passo 3.3)
```

---

# PASSO 4: DEPLOY EDGE FUNCTIONS

## ⏱️ Tempo: 5 minutos

### 📝 O que são Edge Functions?

Funções serverless do Supabase que rodam no backend (protegem suas API keys).

### 🎯 O que vamos fazer:

Deploy das 4 Edge Functions:
- `buffer-integration`
- `sendgrid-integration`
- `gsc-integration`
- `generate-content`

---

### **4.1 Opção A: Script Automatizado (Recomendado)**

1. **No terminal do Replit:**

```bash
# Tornar o script executável
chmod +x DEPLOY_COMMANDS.sh

# Executar deploy
./DEPLOY_COMMANDS.sh
```

2. **Aguarde:**
   - O script vai deployar as 4 funções
   - Tempo: ~2 minutos

3. **✅ Sucesso se aparecer:**
   ```
   ✅ buffer-integration deployed
   ✅ sendgrid-integration deployed
   ✅ gsc-integration deployed
   ✅ generate-content deployed
   ```

---

### **4.2 Opção B: Deploy Manual**

Se o script falhar, faça manual:

1. **Login no Supabase CLI:**

```bash
npx supabase login
```

2. **Link ao projeto:**

```bash
npx supabase link --project-ref SEU_PROJETO_ID
```

3. **Deploy cada função:**

```bash
# Buffer
npx supabase functions deploy buffer-integration

# SendGrid
npx supabase functions deploy sendgrid-integration

# Google Search Console
npx supabase functions deploy gsc-integration

# AI Content Generator
npx supabase functions deploy generate-content
```

4. **✅ Cada comando deve retornar:**
   ```
   Function [nome] deployed successfully
   ```

---

### **4.3 Verificar Deploy**

1. **No Supabase Dashboard:**
   ```
   Project → Edge Functions
   ```

2. **Você deve ver 4 funções:**
   - ✅ buffer-integration
   - ✅ sendgrid-integration
   - ✅ gsc-integration
   - ✅ generate-content

3. **Cada uma com:**
   - Status: **Active**
   - Última atualização: agora

---

# PASSO 5: GITHUB FTP PASSWORD

## ⏱️ Tempo: 2 minutos

### 📝 O que é GitHub FTP Password?

Secret do GitHub Actions para fazer deploy automático no Hostinger via FTP.

### 🎯 O que vamos fazer:

1. Obter senha FTP do Hostinger
2. Adicionar secret no GitHub

---

### **5.1 Obter Senha FTP**

**Opção A: Criar Nova Conta FTP (Recomendado)**

1. **Acesse o Hostinger hPanel:**
   ```
   https://hpanel.hostinger.com/
   ```

2. **Vá em: Arquivos → FTP Accounts**

3. **Criar nova conta:**
   - Username: `deploy@seudominio.com`
   - Password: Gere uma senha forte (ex: `Dp!2025#Ft_Sec`)
   - Directory: `/public_html` (ou `/htdocs`)
   - Clique em "**Create**"

4. **COPIE:**
   - FTP Username: `deploy@seudominio.com`
   - FTP Password: `Dp!2025#Ft_Sec`
   - FTP Host: `ftp.seudominio.com`

---

**Opção B: Usar Conta Existente**

1. **No hPanel:**
   - Vá em: Arquivos → FTP Accounts

2. **Encontre sua conta principal**

3. **Se não lembra a senha:**
   - Clique em "**Change Password**"
   - Digite nova senha
   - Salve

---

### **5.2 Adicionar Secret no GitHub**

1. **Acesse seu repositório GitHub:**
   ```
   https://github.com/SEU_USUARIO/SEU_REPO
   ```

2. **Vá em: Settings → Secrets and variables → Actions**

3. **Clique em "New repository secret"**

4. **Preencha:**
   - **Name:** `FTP_PASSWORD`
   - **Value:** Cole a senha FTP
   - Exemplo: `Dp!2025#Ft_Sec`

5. **Clique em "Add secret"**

6. **✅ Confirmação:**
   - Você verá: `FTP_PASSWORD` na lista de secrets

---

### **5.3 Verificar Outros Secrets**

Certifique-se que você TEM estes secrets:

- [x] `FTP_SERVER` (exemplo: `ftp.seudominio.com`)
- [x] `FTP_USERNAME` (exemplo: `deploy@seudominio.com`)
- [x] `FTP_PASSWORD` (que você acabou de adicionar)

Se faltar algum, adicione da mesma forma.

---

### **5.4 Testar Deploy Automático**

1. **Faça qualquer alteração no código:**

```bash
# No terminal Replit
echo "# Deploy test" >> README.md
git add .
git commit -m "test: deploy automático"
git push origin main
```

2. **Acompanhe no GitHub:**
   - Vá em: **Actions**
   - Veja o workflow rodando
   - Aguarde ~2 minutos

3. **✅ Sucesso se:**
   - Status: ✅ Green check
   - Deploy completo

4. **❌ Se falhar:**
   - Clique no workflow
   - Veja o erro
   - Geralmente é: senha FTP errada ou servidor incorreto

---

# ✅ CHECKLIST FINAL

Use este checklist para confirmar tudo:

## Secrets do Supabase:

- [ ] `BUFFER_ACCESS_TOKEN` adicionado
- [ ] `SENDGRID_API_KEY` adicionado
- [ ] `GSC_CREDENTIALS` adicionado (JSON)

## Edge Functions:

- [ ] `buffer-integration` deployed
- [ ] `sendgrid-integration` deployed
- [ ] `gsc-integration` deployed
- [ ] `generate-content` deployed

## GitHub Secrets:

- [ ] `FTP_PASSWORD` adicionado
- [ ] `FTP_SERVER` existe
- [ ] `FTP_USERNAME` existe

## Testes:

- [ ] Buffer: perfis carregam
- [ ] SendGrid: email de teste enviado
- [ ] GSC: keywords aparecem
- [ ] Deploy: GitHub Actions verde

---

# 🧪 TESTE COMPLETO (10 MIN)

Depois de configurar tudo, teste o sistema completo:

### **1. Teste Buffer (Social Media)**

```javascript
// Console do navegador (F12):
const testBuffer = async () => {
  const response = await fetch('https://SEU_PROJETO.supabase.co/functions/v1/buffer-integration', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session.access_token}`
    },
    body: JSON.stringify({ action: 'get_profiles' })
  });
  console.log(await response.json());
};
testBuffer();
// ✅ Deve retornar seus perfis sociais
```

---

### **2. Teste SendGrid (Email)**

```javascript
// Console do navegador:
const testSendGrid = async () => {
  const response = await fetch('https://SEU_PROJETO.supabase.co/functions/v1/sendgrid-integration', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session.access_token}`
    },
    body: JSON.stringify({
      action: 'send_email',
      to: ['seu@email.com'],
      subject: 'Teste Sistema',
      html: '<h1>Funcionou! 🎉</h1>'
    })
  });
  console.log(await response.json());
};
testSendGrid();
// ✅ Deve enviar email
```

---

### **3. Teste Google Search Console (SEO)**

```javascript
// Console do navegador:
const testGSC = async () => {
  const response = await fetch('https://SEU_PROJETO.supabase.co/functions/v1/gsc-integration', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session.access_token}`
    },
    body: JSON.stringify({
      action: 'get_search_analytics',
      siteUrl: 'https://seusite.com',
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    })
  });
  console.log(await response.json());
};
testGSC();
// ✅ Deve retornar dados de busca
```

---

### **4. Teste AI Content (Geração de Conteúdo)**

```javascript
// Console do navegador:
const testAI = async () => {
  const response = await fetch('https://SEU_PROJETO.supabase.co/functions/v1/generate-content', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session.access_token}`
    },
    body: JSON.stringify({
      type: 'article',
      niche: 'beauty-supplements',
      language: 'en',
      keywords: ['collagen', 'anti-aging']
    })
  });
  console.log(await response.json());
};
testAI();
// ✅ Deve retornar conteúdo gerado
```

---

# 🆘 TROUBLESHOOTING

### **Erro: "Invalid credentials"**

**Causa:** Secret incorreto ou mal formatado

**Solução:**
1. Verifique se copiou o secret completo
2. Verifique se não tem espaços extras
3. Refaça o secret no Supabase

---

### **Erro: "Function not found"**

**Causa:** Edge Function não deployed

**Solução:**
1. Rode: `./DEPLOY_COMMANDS.sh`
2. Ou deploy manual de cada função

---

### **Erro: "Unauthorized"**

**Causa:** JWT token expirado ou inválido

**Solução:**
1. Faça logout e login novamente
2. Atualize o access_token nos testes

---

### **Erro: "Rate limit exceeded"**

**Causa:** Muitas requisições

**Solução:**
1. Aguarde 1 minuto
2. Tente novamente
3. Buffer: limite 10 req/min
4. SendGrid: limite 100 emails/dia (plano grátis)

---

### **Email não chega (SendGrid)**

**Causa:** Sender não verificado ou spam

**Solução:**
1. Verifique se completou passo 2.2 (verificar sender)
2. Verifique pasta SPAM
3. Adicione SendGrid no whitelist

---

### **GSC retorna dados vazios**

**Causa:** Site novo ou sem dados

**Solução:**
1. Aguarde 2-3 dias após verificar site
2. Gere tráfego orgânico (Google)
3. Teste com período maior (6 meses)

---

# 📞 PRECISA DE AJUDA?

Se tiver problemas:

1. **Veja o arquivo:** `STATUS_FINAL.md` (seção Troubleshooting)
2. **Veja o arquivo:** `QUICK_TEST.md` (testes detalhados)
3. **Logs das Edge Functions:**
   - Supabase Dashboard → Edge Functions → Logs
4. **Pergunte no chat:** Descreva o erro exato

---

# 🎉 PARABÉNS!

Se completou todos os passos:

✅ **Sistema 100% configurado!**

Agora você pode:
- ✅ Postar em redes sociais via Buffer
- ✅ Enviar emails via SendGrid
- ✅ Ver SEO analytics via Google Search Console
- ✅ Gerar conteúdo com AI
- ✅ Deploy automático via GitHub

---

**🚀 PRÓXIMO PASSO:**

Acesse seu app e comece a usar:
```
https://seudominio.com/marketing-dashboard
```

---

**Criado em:** Outubro 9, 2025  
**Tempo total:** 32 minutos  
**Dificuldade:** ⭐⭐⭐ (Médio)
