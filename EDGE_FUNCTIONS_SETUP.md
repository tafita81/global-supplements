# Edge Functions Setup Guide - Global Supplements

## 🚀 Overview

Este guia explica como configurar as Edge Functions do Supabase para integrar Buffer, SendGrid e Google Search Console de forma **segura**, mantendo credenciais no servidor.

---

## 📦 Edge Functions Criadas

### 1. **Buffer Integration** (`buffer-integration`)
- **Endpoint**: `/functions/v1/buffer-integration`
- **Funcionalidades**:
  - Criar posts em redes sociais
  - Buscar perfis conectados ao Buffer
  - Agendar publicações

### 2. **SendGrid Integration** (`sendgrid-integration`)
- **Endpoint**: `/functions/v1/sendgrid-integration`
- **Funcionalidades**:
  - Enviar emails para listas de destinatários
  - Suporte a personalização
  - Tracking de envios

### 3. **Google Search Console Integration** (`gsc-integration`)
- **Endpoint**: `/functions/v1/gsc-integration`
- **Funcionalidades**:
  - Buscar dados de Search Analytics
  - Importar métricas de keywords
  - Tracking de performance SEO

---

## 🔐 Configuração de Secrets (Variáveis de Ambiente)

### **No Supabase Dashboard:**

1. Acesse: `Project Settings > Edge Functions > Manage Secrets`

2. Adicione as seguintes variáveis:

```bash
# Buffer API
BUFFER_ACCESS_TOKEN=your_buffer_access_token_here

# SendGrid API
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Google Search Console
GSC_CREDENTIALS={"client_id":"...","client_secret":"...","refresh_token":"..."}
```

### **Como Obter as Credenciais:**

#### **Buffer API Token:**
1. Acesse: https://publish.buffer.com/developers/api
2. Faça login na sua conta Buffer
3. Gere um Access Token
4. Copie o token e adicione no Supabase

#### **SendGrid API Key:**
1. Acesse: https://app.sendgrid.com/settings/api_keys
2. Clique em "Create API Key"
3. Dê permissões completas (Full Access)
4. Copie a API Key e adicione no Supabase

#### **Google Search Console Credentials:**
1. Acesse: https://console.cloud.google.com/
2. Crie um projeto ou use existente
3. Ative "Google Search Console API"
4. Crie credenciais OAuth 2.0
5. Baixe o JSON com: `client_id`, `client_secret`, `refresh_token`
6. Converta para string e adicione no Supabase

---

## 📤 Deploy das Edge Functions

### **Opção 1: Via Supabase CLI (Recomendado)**

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login no Supabase
supabase login

# Link com o projeto
supabase link --project-ref SEU_PROJECT_REF

# Deploy todas as functions
supabase functions deploy buffer-integration
supabase functions deploy sendgrid-integration
supabase functions deploy gsc-integration

# Deploy todas de uma vez
supabase functions deploy
```

### **Opção 2: Via Dashboard Supabase**

1. Acesse: `Edge Functions > Deploy new function`
2. Cole o código de cada função
3. Configure secrets
4. Deploy

---

## 🧪 Testando as Edge Functions

**IMPORTANTE:** As Edge Functions exigem autenticação. Você precisa de um JWT válido de usuário logado.

### **Opção 1: Obter JWT via Frontend (Recomendado)**

1. Faça login no app
2. Abra DevTools → Console
3. Execute:
```javascript
const { data: { session } } = await supabase.auth.getSession();
console.log(session.access_token); // Copie este token
```

### **Opção 2: Usar Service Role Key (Apenas desenvolvimento)**

Use a service_role key do Supabase (encontre em Project Settings → API)

### **Exemplos de Testes:**

### **1. Testar Buffer Integration:**

```bash
curl -X POST \
  https://SEU_PROJECT_REF.supabase.co/functions/v1/buffer-integration \
  -H "Authorization: Bearer SEU_USER_JWT_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "get_profiles"
  }'
```

### **2. Testar SendGrid Integration:**

```bash
curl -X POST \
  https://SEU_PROJECT_REF.supabase.co/functions/v1/sendgrid-integration \
  -H "Authorization: Bearer SEU_USER_JWT_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["teste@example.com"],
    "from": "noreply@globalsupplements.com",
    "subject": "Teste",
    "html": "<h1>Teste Email</h1>"
  }'
```

### **3. Testar GSC Integration:**

```bash
curl -X POST \
  https://SEU_PROJECT_REF.supabase.co/functions/v1/gsc-integration \
  -H "Authorization: Bearer SEU_USER_JWT_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "siteUrl": "https://globalsupplements.com",
    "startDate": "2025-01-01",
    "endDate": "2025-01-30"
  }'
```

**Resposta Esperada (Sem autenticação):**
```json
{
  "error": "Missing authorization header"
}
```

**Resposta Esperada (Com JWT válido):**
```json
{
  "success": true,
  ...dados da API...
}
```

---

## 🔄 Como o Frontend Usa as Edge Functions

### **Antes (Inseguro):**
```typescript
// ❌ Credenciais expostas no frontend
const BUFFER_TOKEN = process.env.BUFFER_ACCESS_TOKEN;
fetch('https://api.bufferapp.com/1/updates/create.json', {
  headers: { 'Authorization': `Bearer ${BUFFER_TOKEN}` }
});
```

### **Depois (Seguro):**
```typescript
// ✅ Chama Edge Function sem expor credenciais
const { data: { session } } = await supabase.auth.getSession();
fetch(`${SUPABASE_URL}/functions/v1/buffer-integration`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ profileId, text })
});
```

---

## 📊 Modo Mock vs Produção

### **Mock Mode (Sem Credenciais):**
- Edge Functions retornam `{ mock: true }`
- Frontend usa dados simulados
- Nenhuma API externa é chamada
- Perfeito para desenvolvimento/testes

### **Production Mode (Com Credenciais):**
- Edge Functions chamam APIs reais
- Retorna `{ mock: false }`
- Dados reais são processados
- Requer credenciais configuradas

---

## 🛡️ Segurança

### **Vantagens da Arquitetura com Edge Functions:**

1. ✅ **Credenciais Protegidas**: API keys ficam apenas no servidor
2. ✅ **Autenticação Obrigatória**: Todas as Edge Functions validam JWT do Supabase
3. ✅ **CORS Controlado**: Edge Functions gerenciam CORS corretamente
4. ✅ **Rate Limiting**: Pode adicionar limites por usuário
5. ✅ **Auditoria**: Logs de todas as chamadas
6. ✅ **Rollback**: Fácil reverter versões

### **Proteção de Autenticação:**

Todas as Edge Functions implementam validação de usuário:

```typescript
// 🔐 Valida Authorization header
const authHeader = req.headers.get('Authorization');
if (!authHeader) {
  return new Response(JSON.stringify({ error: 'Missing authorization header' }), { status: 401 })
}

// 🔐 Verifica usuário autenticado
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: { headers: { Authorization: authHeader } }
});

const { data: { user }, error } = await supabaseClient.auth.getUser();
if (error || !user) {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
}

// ✅ Só executa se usuário autenticado
```

**Benefícios:**
- ❌ Bloqueia acesso não autenticado
- ❌ Previne abuso de quota
- ✅ Apenas usuários logados podem usar as integrações
- ✅ Audit trail completo (user_id nos logs)

### **Checklist de Segurança:**

- [ ] Secrets configurados no Supabase Dashboard
- [ ] Edge Functions deployadas
- [ ] Frontend atualizado para chamar Edge Functions
- [ ] Testes realizados em staging
- [ ] Monitoramento de logs ativo
- [ ] Rollback plan definido

---

## 📁 Estrutura de Arquivos

```
projeto-copia/
├── supabase/
│   └── functions/
│       ├── buffer-integration/
│       │   └── index.ts
│       ├── sendgrid-integration/
│       │   └── index.ts
│       └── gsc-integration/
│           └── index.ts
│
└── src/
    └── automation/
        └── services/
            └── integrations/
                ├── bufferIntegration.ts       (✅ Atualizado)
                ├── sendgridIntegration.ts     (✅ Atualizado)
                └── googleSearchConsoleIntegration.ts (✅ Atualizado)
```

---

## 🚨 Troubleshooting

### **Erro: "Buffer API not configured"**
- Verifique se `BUFFER_ACCESS_TOKEN` está configurado no Supabase
- Teste o secret via CLI: `supabase secrets list`

### **Erro: "Failed to get OAuth token" (GSC)**
- Verifique formato do JSON em `GSC_CREDENTIALS`
- Confirme que `refresh_token` é válido
- Regenere OAuth credentials se necessário

### **Erro: "CORS error"**
- Edge Functions já têm CORS configurado
- Verifique se está usando o endpoint correto
- Confirme que `Authorization` header está presente

### **Erro: "Function not found"**
- Verifique se fez deploy: `supabase functions list`
- Confirme o nome da função está correto
- Re-deploy se necessário

---

## 📈 Monitoramento

### **Ver Logs das Edge Functions:**

```bash
# Ver logs em tempo real
supabase functions logs buffer-integration --tail

# Ver logs específicos
supabase functions logs sendgrid-integration --limit 100

# Ver todos os logs
supabase functions logs
```

### **Via Dashboard:**
1. Acesse: `Edge Functions > [function_name] > Logs`
2. Filtre por data/hora
3. Busque por erros específicos

---

## 🎯 Próximos Passos

1. ✅ Edge Functions criadas
2. ✅ Frontend atualizado
3. ⏳ **Configurar secrets no Supabase**
4. ⏳ **Deploy das Edge Functions**
5. ⏳ **Testar em staging**
6. ⏳ **Deploy em produção**

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique logs das Edge Functions
2. Confirme secrets estão configurados
3. Teste endpoints via curl
4. Revise documentação do Supabase: https://supabase.com/docs/guides/functions

---

**Última Atualização:** Outubro 9, 2025  
**Versão:** 1.0 (Migração para Edge Functions)
