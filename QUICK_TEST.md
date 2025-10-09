# 🧪 Testes Rápidos - Global Supplements

## Guia de Testes Pós-Deploy

Após configurar os secrets e deployar as Edge Functions, use este guia para testar tudo.

---

## 📱 COMO TESTAR NO NAVEGADOR

### **Preparação:**

1. Acesse seu app: `https://seudominio.com/`
2. Faça login com sua conta
3. Abra DevTools: `F12` ou `Ctrl+Shift+I`
4. Vá na aba `Console`

---

## 🧪 TESTES DAS EDGE FUNCTIONS

### **Antes de tudo: Obter seu PROJECT_REF**

No Supabase Dashboard:
1. `Project Settings` → `General`
2. Copie o `Reference ID`
3. Substitua `SEU_PROJECT_REF` nos comandos abaixo

---

### **TESTE 1: Buffer Integration (Social Media)**

**Copie e cole no Console:**
```javascript
const testBuffer = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    console.error('❌ Você precisa estar logado!');
    return;
  }
  
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
  
  if (data.mock === false) {
    console.log('✅ Buffer conectado com sucesso!', data);
  } else {
    console.log('⚠️ Buffer em modo mock (credenciais não configuradas)', data);
  }
};

testBuffer();
```

**Resultado esperado:**
```
✅ Buffer conectado com sucesso!
{
  success: true,
  profiles: [Array],
  mock: false
}
```

---

### **TESTE 2: SendGrid Integration (Email)**

**⚠️ ATENÇÃO:** Isso vai enviar um email de verdade!

**Copie e cole no Console (substitua SEU@EMAIL.COM):**
```javascript
const testSendGrid = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    console.error('❌ Você precisa estar logado!');
    return;
  }
  
  const response = await fetch(
    'https://SEU_PROJECT_REF.supabase.co/functions/v1/sendgrid-integration',
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
        html: `
          <h1>Parabéns!</h1>
          <p>A integração com SendGrid está funcionando perfeitamente.</p>
          <p>Seu sistema de email está pronto para enviar campanhas!</p>
          <hr>
          <small>Global Supplements - Marketing Automation</small>
        `
      })
    }
  );
  
  const data = await response.json();
  
  if (data.mock === false) {
    console.log('✅ Email enviado com sucesso!', data);
    console.log('📧 Verifique sua caixa de entrada (e spam)');
  } else {
    console.log('⚠️ SendGrid em modo mock (credenciais não configuradas)', data);
  }
};

testSendGrid();
```

**Resultado esperado:**
```
✅ Email enviado com sucesso!
{
  success: true,
  mock: false
}
📧 Verifique sua caixa de entrada (e spam)
```

---

### **TESTE 3: Google Search Console (SEO)**

**Copie e cole no Console:**
```javascript
const testGSC = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    console.error('❌ Você precisa estar logado!');
    return;
  }
  
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
  
  if (data.mock === false) {
    console.log('✅ Google Search Console conectado!', data);
    console.table(data.rows?.slice(0, 5)); // Mostra primeiras 5 keywords
  } else {
    console.log('⚠️ GSC em modo mock (credenciais não configuradas)', data);
  }
};

testGSC();
```

**Resultado esperado:**
```
✅ Google Search Console conectado!
{
  success: true,
  rows: [Array],
  mock: false
}
```

---

### **TESTE 4: AI Content Generator**

**Copie e cole no Console:**
```javascript
const testAI = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    console.error('❌ Você precisa estar logado!');
    return;
  }
  
  console.log('🤖 Gerando conteúdo com IA...');
  
  const response = await fetch(
    'https://SEU_PROJECT_REF.supabase.co/functions/v1/generate-content',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contentType: 'article',
        niche: 'beauty-supplements',
        language: 'en',
        keywords: ['collagen', 'skin health']
      })
    }
  );
  
  const data = await response.json();
  
  if (data.success) {
    console.log('✅ Conteúdo gerado com IA!');
    console.log('📝 Título:', data.content?.title);
    console.log('📄 Preview:', data.content?.body?.substring(0, 200) + '...');
  } else {
    console.log('❌ Erro ao gerar conteúdo:', data.error);
  }
};

testAI();
```

**Resultado esperado:**
```
🤖 Gerando conteúdo com IA...
✅ Conteúdo gerado com IA!
📝 Título: "The Ultimate Guide to Collagen for Radiant Skin Health"
📄 Preview: "Collagen has become one of the most popular beauty supplements..."
```

---

## 🎯 TESTE COMPLETO (TODOS DE UMA VEZ)

**Copie e cole no Console:**
```javascript
const runAllTests = async () => {
  console.log('🚀 Iniciando testes completos...\n');
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    console.error('❌ Você precisa estar logado primeiro!');
    return;
  }
  
  const PROJECT_REF = 'SEU_PROJECT_REF'; // ⚠️ SUBSTITUA AQUI!
  const baseUrl = `https://${PROJECT_REF}.supabase.co/functions/v1`;
  
  const results = {
    buffer: '⏳',
    sendgrid: '⏳',
    gsc: '⏳',
    ai: '⏳'
  };
  
  // Test Buffer
  try {
    const bufferRes = await fetch(`${baseUrl}/buffer-integration`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'get_profiles' })
    });
    const bufferData = await bufferRes.json();
    results.buffer = bufferData.mock === false ? '✅ Produção' : '⚠️ Mock';
  } catch (e) {
    results.buffer = '❌ Erro';
  }
  
  // Test SendGrid (NÃO envia email neste test)
  try {
    const sgRes = await fetch(`${baseUrl}/sendgrid-integration`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: ['test@example.com'],
        from: 'noreply@globalsupplements.com',
        subject: 'Test',
        html: '<p>Test</p>'
      })
    });
    const sgData = await sgRes.json();
    results.sendgrid = sgData.mock === false ? '✅ Produção' : '⚠️ Mock';
  } catch (e) {
    results.sendgrid = '❌ Erro';
  }
  
  // Test GSC
  try {
    const gscRes = await fetch(`${baseUrl}/gsc-integration`, {
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
    });
    const gscData = await gscRes.json();
    results.gsc = gscData.mock === false ? '✅ Produção' : '⚠️ Mock';
  } catch (e) {
    results.gsc = '❌ Erro';
  }
  
  // Test AI
  try {
    const aiRes = await fetch(`${baseUrl}/generate-content`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contentType: 'article',
        niche: 'beauty-supplements',
        language: 'en',
        keywords: ['test']
      })
    });
    const aiData = await aiRes.json();
    results.ai = aiData.success ? '✅ Funcionando' : '⚠️ Mock';
  } catch (e) {
    results.ai = '❌ Erro';
  }
  
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║      RESULTADO DOS TESTES              ║');
  console.log('╚════════════════════════════════════════╝\n');
  console.table(results);
  
  const allProduction = Object.values(results).every(r => r.includes('✅'));
  
  if (allProduction) {
    console.log('\n🎉 PARABÉNS! Todos os sistemas estão em PRODUÇÃO!');
  } else {
    console.log('\n⚠️ Alguns sistemas ainda estão em modo mock.');
    console.log('Verifique SETUP_PRODUCAO.md para configurar os secrets.');
  }
};

runAllTests();
```

---

## 📊 INTERPRETANDO RESULTADOS

### **✅ Produção / Funcionando**
- Secrets configurados corretamente
- Edge Function conectada à API real
- Sistema pronto para uso

### **⚠️ Mock**
- Secrets não configurados
- Usando dados simulados
- Funcional mas sem dados reais

### **❌ Erro**
- Problema na Edge Function
- Verifique logs no Supabase
- Verifique se fez deploy

---

## 🔍 VERIFICAR LOGS (Se houver erros)

**No Supabase Dashboard:**
1. `Edge Functions`
2. Clique na function com erro
3. Vá em `Logs`
4. Veja o erro detalhado

**Via CLI:**
```bash
# Ver logs da última hora
supabase functions logs buffer-integration --tail

# Ver logs específicos
supabase functions logs sendgrid-integration --limit 100
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

Após rodar os testes, verifique:

- [ ] Buffer retorna `mock: false`
- [ ] SendGrid retorna `mock: false` (e email é recebido)
- [ ] GSC retorna `mock: false` (com dados reais)
- [ ] AI Content Generator funciona
- [ ] Nenhum erro 401 Unauthorized
- [ ] Nenhum erro de CORS

---

## 🚀 PRÓXIMO PASSO

Se todos os testes passaram:
1. Configure `FTP_PASSWORD` no GitHub
2. Faça push para branch `main` ou `experimentos`
3. Acompanhe o deploy automático
4. Acesse o site em produção

**Documentação completa:** SETUP_PRODUCAO.md

---

**Data:** Outubro 9, 2025  
**Versão:** 1.0
