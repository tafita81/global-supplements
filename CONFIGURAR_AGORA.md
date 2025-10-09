# 🚀 CONFIGURAÇÃO PASSO A PASSO - Começe Aqui!

## Guia Interativo: Levando Seu Sistema a 100%

**Tempo Total:** ~30 minutos  
**Complexidade:** Fácil (apenas copiar e colar)

---

## 📋 ANTES DE COMEÇAR

### **Você Vai Precisar:**

1. ✅ Conta no Supabase (já tem - seu projeto está linkado)
2. ✅ Conta no Buffer (ou criar grátis)
3. ✅ Conta no SendGrid (ou criar grátis)
4. ✅ Conta Google (para Search Console)
5. ✅ Acesso ao Hostinger (você já tem - credenciais nos workflows)
6. ✅ Acesso ao GitHub (você já tem - repositório configurado)

### **O Que Vamos Fazer:**

```
PASSO 1 → Configurar 3 secrets no Supabase        [15 min]
PASSO 2 → Deploy de 4 Edge Functions              [5 min]
PASSO 3 → Testar tudo no navegador               [10 min]
PASSO 4 → Ativar deploy automático (GitHub)       [2 min]
══════════════════════════════════════════════════════════
TOTAL                                              [32 min]
```

---

## 🔐 PASSO 1: CONFIGURAR SECRETS NO SUPABASE (15 MIN)

### **1.1 Acesse o Dashboard do Supabase**

1. Abra: https://supabase.com/dashboard
2. Faça login
3. Selecione seu projeto **Global Supplements**
4. No menu lateral, vá em: `Project Settings` (ícone engrenagem ⚙️)
5. Clique em: `Edge Functions`
6. Role até: `Function Secrets` ou `Manage Secrets`

---

### **1.2 SECRET #1: BUFFER_ACCESS_TOKEN**

#### **Obter o Token:**

1. **Abra em nova aba:** https://publish.buffer.com/developers/api
2. Faça login na sua conta Buffer (ou crie uma conta grátis)
3. Clique em `Create Access Token` ou `Generate Access Token`
4. Copie o token gerado (começa com algo como: `1/`)

#### **Adicionar no Supabase:**

1. Volte para aba do Supabase (Edge Functions → Secrets)
2. Clique em `Add new secret` ou `New secret`
3. **Nome:** `BUFFER_ACCESS_TOKEN`
4. **Valor:** [Cole o token que você copiou do Buffer]
5. Clique em `Save` ou `Add secret`

✅ **Checkpoint:** Você deve ver `BUFFER_ACCESS_TOKEN` na lista de secrets

---

### **1.3 SECRET #2: SENDGRID_API_KEY**

#### **Obter a API Key:**

1. **Abra em nova aba:** https://app.sendgrid.com/settings/api_keys
2. Faça login no SendGrid (ou crie conta grátis)
3. Clique em `Create API Key`
4. **Nome da Key:** `Global Supplements Production`
5. **Permissões:** Selecione `Full Access` (mais fácil) ou customize depois
6. Clique em `Create & View`
7. **⚠️ IMPORTANTE:** Copie a API Key AGORA (só aparece uma vez!)

#### **Adicionar no Supabase:**

1. Volte para aba do Supabase (Edge Functions → Secrets)
2. Clique em `Add new secret`
3. **Nome:** `SENDGRID_API_KEY`
4. **Valor:** [Cole a API Key que você copiou do SendGrid]
5. Clique em `Save`

✅ **Checkpoint:** Você deve ver `SENDGRID_API_KEY` na lista de secrets

---

### **1.4 SECRET #3: GSC_CREDENTIALS** (Mais complexo - 10 min)

Este é o mais trabalhoso, mas vou te guiar passo a passo.

#### **PARTE A: Criar Projeto no Google Cloud**

1. **Abra em nova aba:** https://console.cloud.google.com/
2. Faça login com sua conta Google
3. No topo, clique no seletor de projeto
4. Clique em `New Project`
5. **Nome do projeto:** `Global Supplements SEO`
6. Clique em `Create`
7. Aguarde 30 segundos e selecione o projeto criado

#### **PARTE B: Ativar API do Search Console**

1. No menu lateral, vá em: `APIs & Services` → `Library`
2. Na busca, digite: `Google Search Console API`
3. Clique no resultado
4. Clique em `Enable` (Ativar)
5. Aguarde ativação

#### **PARTE C: Criar Credenciais OAuth**

1. No menu lateral, vá em: `APIs & Services` → `Credentials`
2. Clique em `+ CREATE CREDENTIALS` (topo)
3. Selecione: `OAuth client ID`
4. Se pedir para configurar tela de consentimento:
   - Clique em `CONFIGURE CONSENT SCREEN`
   - Selecione `External`
   - Preencha apenas campos obrigatórios:
     - App name: `Global Supplements`
     - User support email: [seu email]
     - Developer contact: [seu email]
   - Clique em `Save and Continue` até o final
   - Volte para criar credenciais
5. **Application type:** `Web application`
6. **Nome:** `Global Supplements OAuth`
7. **Authorized redirect URIs:** Clique em `+ Add URI`
   - Cole: `https://developers.google.com/oauthplayground`
8. Clique em `Create`
9. **📋 COPIE E GUARDE:**
   - `Client ID` (começa com números.apps.googleusercontent.com)
   - `Client secret` (string alfanumérica)

#### **PARTE D: Obter Refresh Token**

1. **Abra em nova aba:** https://developers.google.com/oauthplayground
2. No canto superior direito, clique no ícone de engrenagem ⚙️
3. Marque a caixa: `Use your own OAuth credentials`
4. **OAuth Client ID:** [Cole o Client ID que você copiou]
5. **OAuth Client secret:** [Cole o Client secret que você copiou]
6. Clique em `Close`
7. No lado esquerdo, busque por: `Google Search Console API v1`
8. Expanda e selecione:
   - ✅ `https://www.googleapis.com/auth/webmasters.readonly`
9. Clique em `Authorize APIs` (botão azul embaixo)
10. Escolha sua conta Google
11. Clique em `Allow` (permitir acesso)
12. Você voltará para o playground
13. Clique em `Exchange authorization code for tokens` (botão azul)
14. **📋 COPIE:** O `Refresh token` que apareceu

#### **PARTE E: Montar o JSON e Adicionar no Supabase**

1. Abra um editor de texto (Notepad, VSCode, qualquer um)
2. Cole este template:
```json
{"client_id":"SEU_CLIENT_ID","client_secret":"SEU_CLIENT_SECRET","refresh_token":"SEU_REFRESH_TOKEN"}
```

3. Substitua:
   - `SEU_CLIENT_ID` → Client ID do Passo C
   - `SEU_CLIENT_SECRET` → Client secret do Passo C
   - `SEU_REFRESH_TOKEN` → Refresh token do Passo D

4. **⚠️ IMPORTANTE:** O JSON deve estar em UMA LINHA SÓ (sem quebras)

5. **Exemplo final:**
```json
{"client_id":"123456789.apps.googleusercontent.com","client_secret":"GOCSPX-abc123xyz","refresh_token":"1//0gABC123xyz"}
```

6. Copie o JSON completo

#### **Adicionar no Supabase:**

1. Volte para aba do Supabase (Edge Functions → Secrets)
2. Clique em `Add new secret`
3. **Nome:** `GSC_CREDENTIALS`
4. **Valor:** [Cole o JSON completo que você montou]
5. Clique em `Save`

✅ **Checkpoint:** Você deve ver `GSC_CREDENTIALS` na lista de secrets

---

### **✅ PASSO 1 COMPLETO!**

**Verifique que você tem os 3 secrets:**
- ✅ BUFFER_ACCESS_TOKEN
- ✅ SENDGRID_API_KEY
- ✅ GSC_CREDENTIALS

**Screenshot para confirmar:** Tire um print da tela de secrets (esconda os valores por segurança)

---

## 📤 PASSO 2: DEPLOY DAS EDGE FUNCTIONS (5 MIN)

Agora vamos deployar as 4 Edge Functions para o Supabase.

### **Opção A: Script Automatizado (Recomendado)**

**No terminal do Replit:**

```bash
# Execute o script que já está pronto
./DEPLOY_COMMANDS.sh
```

O script vai:
1. Instalar Supabase CLI (se necessário)
2. Fazer login no Supabase
3. Pedir seu PROJECT_REF
4. Deployar as 4 Edge Functions
5. Verificar se tudo funcionou

**Siga as instruções na tela!**

---

### **Opção B: Manual (se script der problema)**

**No terminal do Replit:**

```bash
# 1. Instalar Supabase CLI
npm install -g supabase

# 2. Login
supabase login
# (abrirá navegador para autorizar)

# 3. Linkar projeto
supabase link --project-ref SEU_PROJECT_REF
# Encontre seu PROJECT_REF em: Supabase Dashboard → Project Settings → General → Reference ID

# 4. Deploy functions
cd projeto-copia
supabase functions deploy buffer-integration
supabase functions deploy sendgrid-integration
supabase functions deploy gsc-integration
supabase functions deploy generate-content

# 5. Verificar
supabase functions list
```

---

### **✅ PASSO 2 COMPLETO!**

**Você deve ver:**
```
Functions:
  - buffer-integration (deployed)
  - sendgrid-integration (deployed)
  - gsc-integration (deployed)
  - generate-content (deployed)
```

---

## 🧪 PASSO 3: TESTAR TUDO NO NAVEGADOR (10 MIN)

Agora vamos verificar se tudo está funcionando com dados REAIS (não mock).

### **Preparação:**

1. Abra seu app no navegador: `https://seudominio.com/` (ou a URL do Replit)
2. **Faça login** com sua conta
3. Abra o DevTools:
   - Chrome/Edge: `F12` ou `Ctrl+Shift+I`
   - Mac: `Cmd+Option+I`
4. Vá na aba `Console`

---

### **TESTE 1: Buffer (Social Media)**

**Copie e cole no Console:**

```javascript
// Substitua SEU_PROJECT_REF pelo Reference ID do seu projeto Supabase
const PROJECT_REF = 'SEU_PROJECT_REF';

const testBuffer = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    console.error('❌ Faça login primeiro!');
    return;
  }
  
  console.log('🧪 Testando Buffer...');
  
  const response = await fetch(
    `https://${PROJECT_REF}.supabase.co/functions/v1/buffer-integration`,
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
  
  if (data.mock === false) {
    console.log('✅ Buffer CONECTADO EM PRODUÇÃO!');
    console.log('📱 Perfis:', data.profiles);
  } else {
    console.log('⚠️ Buffer em modo mock (verifique BUFFER_ACCESS_TOKEN)');
  }
  
  return data;
};

testBuffer();
```

**Resultado esperado:**
```
🧪 Testando Buffer...
✅ Buffer CONECTADO EM PRODUÇÃO!
📱 Perfis: [{...}]
```

---

### **TESTE 2: SendGrid (Email)**

**⚠️ AVISO:** Isso vai enviar um email de teste!

**Copie e cole no Console (substitua SEU@EMAIL.COM):**

```javascript
const PROJECT_REF = 'SEU_PROJECT_REF';

const testSendGrid = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    console.error('❌ Faça login primeiro!');
    return;
  }
  
  console.log('🧪 Testando SendGrid...');
  
  const response = await fetch(
    `https://${PROJECT_REF}.supabase.co/functions/v1/sendgrid-integration`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: ['SEU@EMAIL.COM'],
        from: 'noreply@globalsupplements.com',
        subject: '🎉 Teste de Produção - Global Supplements',
        html: '<h1>Sucesso!</h1><p>SendGrid está funcionando em produção!</p>'
      })
    }
  );
  
  const data = await response.json();
  
  if (data.mock === false) {
    console.log('✅ Email ENVIADO EM PRODUÇÃO!');
    console.log('📧 Verifique sua caixa de entrada (e spam)');
  } else {
    console.log('⚠️ SendGrid em modo mock (verifique SENDGRID_API_KEY)');
  }
  
  return data;
};

testSendGrid();
```

**Resultado esperado:**
```
🧪 Testando SendGrid...
✅ Email ENVIADO EM PRODUÇÃO!
📧 Verifique sua caixa de entrada (e spam)
```

---

### **TESTE 3: Google Search Console (SEO)**

**Copie e cole no Console:**

```javascript
const PROJECT_REF = 'SEU_PROJECT_REF';

const testGSC = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    console.error('❌ Faça login primeiro!');
    return;
  }
  
  console.log('🧪 Testando Google Search Console...');
  
  const response = await fetch(
    `https://${PROJECT_REF}.supabase.co/functions/v1/gsc-integration`,
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
  
  if (data.mock === false) {
    console.log('✅ GSC CONECTADO EM PRODUÇÃO!');
    console.log('📊 Dados SEO:', data.rows?.slice(0, 3));
  } else {
    console.log('⚠️ GSC em modo mock (verifique GSC_CREDENTIALS)');
  }
  
  return data;
};

testGSC();
```

---

### **TESTE COMPLETO (Todos de uma vez)**

**Copie e cole no Console:**

```javascript
const PROJECT_REF = 'SEU_PROJECT_REF'; // ⚠️ SUBSTITUA!

const runAllTests = async () => {
  console.log('🚀 Executando TODOS os testes...\n');
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    console.error('❌ Faça login primeiro!');
    return;
  }
  
  const baseUrl = `https://${PROJECT_REF}.supabase.co/functions/v1`;
  const headers = {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  };
  
  const results = {};
  
  // Test Buffer
  console.log('1️⃣ Testando Buffer...');
  try {
    const res = await fetch(`${baseUrl}/buffer-integration`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'get_profiles' })
    });
    const data = await res.json();
    results.buffer = data.mock === false ? '✅ Produção' : '⚠️ Mock';
  } catch (e) {
    results.buffer = '❌ Erro: ' + e.message;
  }
  
  // Test SendGrid
  console.log('2️⃣ Testando SendGrid...');
  try {
    const res = await fetch(`${baseUrl}/sendgrid-integration`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        to: ['test@example.com'],
        from: 'test@test.com',
        subject: 'Test',
        html: '<p>Test</p>'
      })
    });
    const data = await res.json();
    results.sendgrid = data.mock === false ? '✅ Produção' : '⚠️ Mock';
  } catch (e) {
    results.sendgrid = '❌ Erro: ' + e.message;
  }
  
  // Test GSC
  console.log('3️⃣ Testando GSC...');
  try {
    const res = await fetch(`${baseUrl}/gsc-integration`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        siteUrl: 'https://globalsupplements.com',
        startDate: '2025-01-01',
        endDate: '2025-01-30'
      })
    });
    const data = await res.json();
    results.gsc = data.mock === false ? '✅ Produção' : '⚠️ Mock';
  } catch (e) {
    results.gsc = '❌ Erro: ' + e.message;
  }
  
  console.log('\n╔════════════════════════════════╗');
  console.log('║    RESULTADO DOS TESTES        ║');
  console.log('╚════════════════════════════════╝\n');
  console.table(results);
  
  const allProd = Object.values(results).every(r => r.includes('✅'));
  if (allProd) {
    console.log('\n🎉 PARABÉNS! Tudo em PRODUÇÃO!');
  } else {
    console.log('\n⚠️ Alguns ainda em mock - verifique secrets');
  }
};

runAllTests();
```

---

### **✅ PASSO 3 COMPLETO!**

**Você deve ver:**
- ✅ Buffer: Produção
- ✅ SendGrid: Produção
- ✅ GSC: Produção

---

## 🔑 PASSO 4: CONFIGURAR GITHUB SECRET (2 MIN)

Último passo! Configurar deploy automático.

### **4.1 Obter Senha FTP do Hostinger**

1. Acesse: https://hpanel.hostinger.com/
2. Faça login
3. Vá em: `Hospedagem` → `Gerenciar`
4. Clique em: `FTP Accounts`
5. Encontre o usuário: `u930134944`
6. **Copie a senha** ou clique em `Change Password` para criar nova

### **4.2 Adicionar no GitHub**

1. Acesse seu repositório no GitHub
2. Vá em: `Settings` (aba no topo)
3. No menu lateral: `Secrets and variables` → `Actions`
4. Clique em: `New repository secret`
5. **Name:** `FTP_PASSWORD`
6. **Value:** [Cole a senha FTP que você copiou]
7. Clique em: `Add secret`

### **4.3 Testar Deploy Automático**

**No terminal do Replit:**

```bash
# Deploy para ambiente DEV (branch experimentos)
git add .
git commit -m "test: ativar CI/CD"
git push origin experimentos

# OU deploy para PRODUÇÃO (branch main)
git push origin main
```

### **4.4 Acompanhar Deploy**

1. Acesse: https://github.com/SEU_USUARIO/SEU_REPO/actions
2. Veja o workflow rodando
3. Se tudo OK: ✅ verde
4. Acesse seu site:
   - DEV: `https://seudominio.com/global-supplements-dev/`
   - PROD: `https://seudominio.com/`

---

### **✅ PASSO 4 COMPLETO!**

**Deploy automático ativado!** 🚀

---

## 🎉 CONFIGURAÇÃO 100% COMPLETA!

### **Checklist Final:**

- ✅ BUFFER_ACCESS_TOKEN configurado
- ✅ SENDGRID_API_KEY configurado
- ✅ GSC_CREDENTIALS configurado
- ✅ Edge Functions deployadas (4)
- ✅ Testes passaram (modo produção)
- ✅ FTP_PASSWORD configurado
- ✅ Deploy automático ativo

---

## 📊 SEU SISTEMA AGORA:

```
✅ Código:        100% Pronto
✅ Secrets:       100% Configurados
✅ Edge Functions: 100% Deployadas
✅ Testes:        100% Passaram
✅ CI/CD:         100% Ativo
═══════════════════════════════════
🎯 TOTAL:        100% COMPLETO! 🎉
```

---

## 🚀 PRÓXIMOS PASSOS:

1. **Use o sistema!**
   - Gere conteúdo com IA
   - Crie campanhas Google Ads
   - Publique em redes sociais
   - Envie emails para clientes

2. **Monitore performance:**
   - Supabase Dashboard → Edge Functions → Logs
   - GitHub Actions → Workflows

3. **Escale conforme necessário:**
   - Adicione mais secrets
   - Configure rate limiting
   - Otimize bundle size

---

**🎊 PARABÉNS! Seu sistema está 100% operacional em produção!**

---

**Criado em:** Outubro 9, 2025  
**Tempo de execução:** ~32 minutos  
**Status:** ✅ Sistema Completo
