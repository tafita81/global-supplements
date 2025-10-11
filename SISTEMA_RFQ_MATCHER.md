# 🎯 Sistema RFQ Matcher - Matching Inteligente RFQ → Fornecedor

## 📋 VISÃO GERAL

Sistema automatizado de matching entre RFQs (Request for Quotation) de compradores e fornecedores globais com análise inteligente via ChatGPT, cálculo de prazo de entrega e decisão automática de execução.

**Empresa:** Consultoria em Tecnologia da Informação Corp (EIN: 33-3939483)  
**Dono:** Rafael Roberto Rodrigues de Oliveira  
**Email:** tafita81@gmail.com  
**Localização:** Orlando, Florida, USA

---

## 🎯 OBJETIVO

Conectar automaticamente pedidos de compradores (RFQs) com fornecedores disponíveis, validar prazos de entrega, calcular margens de lucro e usar IA para decidir se deve EXECUTAR ou REJEITAR cada match.

---

## 🔄 FLUXO COMPLETO

```
1. BUSCAR RFQs (Últimos dias)
   ├─ Alibaba RFQ Market (20K/dia) [quando disponível]
   ├─ IndiaMART Push API (tempo real) [quando disponível]
   └─ Manual (inserir no sistema)
   
2. PARA CADA RFQ → BUSCAR FORNECEDORES
   ├─ Inventory Source API (180+ fornecedores) [quando disponível]
   ├─ Alibaba Suppliers [quando disponível]
   └─ Fornecedores manuais (base de dados)
   
3. FILTRAR FORNECEDORES
   ├─ Produto compatível (nome similar)
   ├─ Estoque >= Quantidade pedida
   └─ MOQ (Minimum Order Quantity) atendido
   
4. CALCULAR PRAZO DE ENTREGA
   ├─ Lead Time do fornecedor (processamento)
   ├─ Shipping Time (warehouse → comprador)
   │  ├─ ShipStation API [quando disponível]
   │  ├─ Shippo API [quando disponível]
   │  └─ Estimativa simplificada
   └─ Total = Lead Time + Shipping
   
5. CALCULAR CUSTOS E MARGEM
   ├─ Custo = (Preço Unitário × Quantidade) + Frete
   ├─ Receita = Preço Alvo × Quantidade (ou Custo × 1.3)
   └─ Margem = ((Receita - Custo) / Receita) × 100
   
6. IA CHATGPT ANALISA E DECIDE
   ├─ Busca histórico de aprendizado (últimas 20 decisões)
   ├─ Calcula taxa de sucesso histórica
   ├─ Identifica padrões de risco
   ├─ Chama ChatGPT com contexto completo
   ├─ Recebe: decision, risk_score, reasoning, confidence
   └─ Salva no histórico de aprendizado
   
7. SALVAR MATCH NO BANCO
   ├─ rfq_matches (com decisão IA)
   ├─ ai_learning_history (para aprendizado contínuo)
   └─ Atualiza status do RFQ
   
8. ENVIAR EMAIL AUTOMÁTICO
   ├─ Para: tafita81@gmail.com (EXCLUSIVAMENTE)
   ├─ SendGrid API
   └─ Detalhes completos: matches, decisões, raciocínio IA
```

---

## 🗄️ ESTRUTURA DO BANCO DE DADOS

### Tabela: `rfqs` (Pedidos de Compradores)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | VARCHAR (PK) | UUID gerado automaticamente |
| user_id | VARCHAR | ID do usuário (Rafael) |
| source | VARCHAR | 'alibaba', 'indiamart', 'manual' |
| external_id | VARCHAR | ID do RFQ na plataforma externa |
| buyer_name | VARCHAR | Nome do comprador |
| buyer_email | VARCHAR | Email do comprador |
| buyer_location | VARCHAR | Localização do comprador |
| product_name | VARCHAR | Nome do produto solicitado |
| product_description | TEXT | Descrição detalhada |
| quantity | INTEGER | Quantidade solicitada |
| unit | VARCHAR | Unidade (pcs, kg, boxes) |
| target_price | DECIMAL | Preço alvo por unidade |
| expected_delivery_days | INTEGER | Prazo esperado (dias) |
| status | VARCHAR | 'pending', 'matched', 'executed', 'rejected' |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

### Tabela: `supplier_inventory` (Estoque de Fornecedores)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | VARCHAR (PK) | UUID gerado automaticamente |
| user_id | VARCHAR | ID do usuário (Rafael) |
| supplier_name | VARCHAR | Nome do fornecedor |
| supplier_source | VARCHAR | 'inventory_source', 'alibaba', 'amazon', 'manual' |
| supplier_location | VARCHAR | Localização do fornecedor |
| product_name | VARCHAR | Nome do produto |
| sku | VARCHAR | SKU do produto |
| quantity_available | INTEGER | Quantidade em estoque |
| unit_price | DECIMAL | Preço por unidade (USD) |
| moq | INTEGER | Minimum Order Quantity |
| lead_time_days | INTEGER | Tempo de processamento (dias) |
| warehouse_zip | VARCHAR | CEP/ZIP do warehouse |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

### Tabela: `rfq_matches` (Matches RFQ → Fornecedor)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | VARCHAR (PK) | UUID gerado automaticamente |
| user_id | VARCHAR | ID do usuário (Rafael) |
| rfq_id | VARCHAR (FK) | Referência ao RFQ |
| supplier_id | VARCHAR (FK) | Referência ao fornecedor |
| shipping_carrier | VARCHAR | Transportadora (FedEx, DHL, etc) |
| shipping_days | INTEGER | Dias de envio |
| shipping_cost | DECIMAL | Custo do frete |
| total_delivery_days | INTEGER | lead_time + shipping |
| meets_deadline | BOOLEAN | Se cumpre prazo esperado |
| total_cost | DECIMAL | Custo total (produto + frete) |
| expected_revenue | DECIMAL | Receita esperada |
| margin_percentage | DECIMAL | Margem de lucro (%) |
| risk_score | DECIMAL | Risco calculado (0-100) |
| ai_decision | VARCHAR | 'EXECUTE' ou 'REJECT' |
| ai_reasoning | TEXT | Raciocínio da IA |
| status | VARCHAR | 'analyzed', 'approved', 'rejected', 'executed' |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

---

## 🤖 INTEGRAÇÃO COM IA AUTÔNOMA

### ChatGPT Análise Inteligente

**Modelo:** GPT-4o-mini  
**Temperatura:** 0.3 (mais preciso, menos criativo)

**Prompt Sistema:**
```
Você é um especialista em análise B2B e arbitragem internacional. 
Analise matches RFQ-Fornecedor e tome decisões baseadas em dados 
históricos e padrões de sucesso.
```

**Dados Enviados ao ChatGPT:**
- Produto, quantidade, fornecedor
- Margem de lucro calculada
- Custo total vs Receita esperada
- Prazo de entrega vs Prazo esperado
- Histórico de sucesso/falha (últimas 20 decisões)
- Lições aprendidas anteriores

**Resposta ChatGPT (JSON):**
```json
{
  "decision": "EXECUTE" ou "REJECT",
  "risk_score": 0-100,
  "reasoning": "Explicação detalhada da decisão",
  "expected_profit": 1500.50,
  "confidence": 85
}
```

### Aprendizado Contínuo

Cada decisão é salva em `ai_learning_history`:
- `decision_type`: 'rfq_match'
- `opportunity_data`: Match completo
- `ai_analysis`: Resposta do ChatGPT
- `decision_made`: EXECUTE/REJECT
- `risk_score`: Risco calculado
- `expected_profit`: Lucro esperado
- `success`: TRUE/FALSE (atualizado depois)
- `lesson_learned`: O que foi aprendido

**IA evolui automaticamente:**
1. Identifica padrões de sucesso (margens boas, prazos curtos)
2. Identifica padrões de falha (margens baixas, prazos longos)
3. Ajusta decisões futuras baseadas no histórico
4. Melhora taxa de sucesso ao longo do tempo

---

## 🌐 EDGE FUNCTION: `rfq-supplier-matcher`

**Localização:** `supabase/functions/rfq-supplier-matcher/index.ts`

### Ações Disponíveis

#### 1. `match_rfqs` (Principal)
Busca RFQs pendentes e faz matching automático com fornecedores.

**Request:**
```json
{
  "action": "match_rfqs"
}
```

**Response:**
```json
{
  "success": true,
  "message": "5 matches encontrados",
  "matches": [
    {
      "id": "uuid",
      "rfq_id": "uuid",
      "supplier_id": "uuid",
      "ai_decision": "EXECUTE",
      "margin_percentage": 28.5,
      "risk_score": 22,
      "ai_reasoning": "Match excelente: margem de 28.5%, prazo dentro do esperado..."
    }
  ]
}
```

#### 2. `fetch_alibaba_rfqs` (Futuro)
Busca RFQs do Alibaba RFQ Market quando API estiver disponível.

#### 3. `fetch_suppliers` (Futuro)
Busca fornecedores do Inventory Source quando API estiver disponível.

### Funções Auxiliares

**`calculateShippingDays(fromZip, toLocation)`**
- Estima dias de envio baseado em localização
- Internacional (China): ~12 dias
- Doméstico (USA): ~3 dias

**`calculateShippingCost(fromZip, toLocation, quantity)`**
- Estima custo de frete
- Base rate × quantidade/100

**`calculateRiskScore(margin, meetsDeadline, deliveryDays)`**
- Margem > 30%: -20 risco
- Margem > 20%: -10 risco
- Margem < 10%: +20 risco
- Não cumpre prazo: +30 risco
- Prazo < 7 dias: -10 risco

**`analyzeRFQMatchWithAI(matchData, userId, supabaseClient)`**
- Busca OpenAI API key do usuário
- Busca histórico de aprendizado
- Chama ChatGPT com contexto completo
- Salva decisão no histórico
- Retorna: decision, reasoning, riskScore, confidence

**`generateSimpleReasoning(matchData, risk)`**
- Fallback quando ChatGPT não disponível
- Análise baseada em regras simples

**`sendMatchNotification(userId, matches, supabaseClient)`**
- Envia email via SendGrid
- Para: tafita81@gmail.com
- Detalhes completos dos matches

---

## 💻 FRONTEND: `/rfq-matcher`

**Localização:** `projeto-copia/src/pages/RFQMatcher.tsx`

### Componentes Principais

#### Dashboard Cards (Estatísticas)
- RFQs Pendentes
- Matches Encontrados (X para executar)
- Fornecedores cadastrados
- Taxa de Sucesso (% EXECUTE)

#### Tabs Principais

**1. Tab: Matches**
- Lista todos os matches encontrados
- Badge verde (EXECUTE) ou vermelho (REJECT)
- Detalhes: Margem, Risco, Prazo, Receita
- Raciocínio da IA completo

**2. Tab: RFQs**
- Lista todos os RFQs cadastrados
- Status: pending, matched, executed, rejected
- Detalhes do comprador e produto

**3. Tab: Fornecedores**
- Lista todos os fornecedores cadastrados
- Estoque disponível, preço, MOQ, lead time
- Fonte: manual, inventory_source, alibaba

**4. Tab: Adicionar**
- Formulário: Adicionar RFQ manual
- Formulário: Adicionar Fornecedor manual

### Botão Principal: "Buscar Matches"
Chama Edge Function `rfq-supplier-matcher` com action `match_rfqs`.

### React Query
- Auto-refresh a cada 30 segundos
- Cache otimizado
- Invalidação automática após mutations

---

## 🔗 APIs FUTURAS (Quando Disponíveis)

### 1. Alibaba Gold Supplier API ($3K-6K/ano)
**20,000+ RFQs novos por dia**

```typescript
// Exemplo de integração
const rfqs = await fetch('https://openapi.alibaba.com/rfqs', {
  headers: {
    'Authorization': `Bearer ${alibabaAccessToken}`,
    'App-Key': alibabaAppKey
  }
});

// Inserir no banco
for (const rfq of rfqs.data) {
  await supabase.from('rfqs').insert({
    source: 'alibaba',
    external_id: rfq.id,
    product_name: rfq.product_name,
    quantity: rfq.quantity,
    buyer_location: rfq.buyer_country,
    expected_delivery_days: rfq.delivery_days
  });
}
```

### 2. IndiaMART Push API (Grátis para vendedores pagos)
**Webhook em tempo real**

```typescript
// Configurar webhook
POST https://seller.indiamart.com/leadmanager/crmapi/setup_webhook
{
  "webhook_url": "https://twglceexfetejawoumsr.supabase.co/functions/v1/rfq-supplier-matcher",
  "events": ["new_inquiry"]
}

// Receber RFQs instantaneamente
const indiaMartWebhook = async (req) => {
  const inquiry = await req.json();
  await supabase.from('rfqs').insert({
    source: 'indiamart',
    external_id: inquiry.UNIQUE_QUERY_ID,
    product_name: inquiry.QUERY_PRODUCT_NAME,
    quantity: inquiry.QUERY_MCAT_NAME,
    buyer_location: inquiry.QUERY_CITY
  });
};
```

### 3. Inventory Source API
**180+ fornecedores, 3.5M produtos**

```typescript
const suppliers = await fetch('https://api.inventorysource.com/products', {
  headers: {
    'Authorization': `Bearer ${inventorySourceKey}`
  },
  params: {
    search: productName,
    inStock: true
  }
});

// Inserir no banco
for (const product of suppliers.data) {
  await supabase.from('supplier_inventory').insert({
    supplier_source: 'inventory_source',
    supplier_name: product.supplier_name,
    product_name: product.name,
    sku: product.sku,
    quantity_available: product.stock,
    unit_price: product.price,
    lead_time_days: product.lead_time
  });
}
```

### 4. ShipStation API
**Cálculo preciso de frete**

```typescript
const shipping = await fetch('https://ssapi.shipstation.com/shipments/getrates', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${btoa(shipstationKey + ':' + shipstationSecret)}`
  },
  body: JSON.stringify({
    carrierCode: 'fedex',
    fromPostalCode: supplierZip,
    toPostalCode: buyerZip,
    weight: { value: totalWeight, units: 'pounds' }
  })
});

// Usar dias e custo reais
const shippingDays = shipping.transitDays;
const shippingCost = shipping.shipmentCost;
```

---

## 📧 EMAIL AUTOMÁTICO

**Destinatário:** tafita81@gmail.com (EXCLUSIVAMENTE)  
**Disparado:** Quando matches são encontrados  
**Via:** SendGrid API

**Conteúdo do Email:**
```html
<h2>🎯 5 Novos Matches RFQ → Fornecedor</h2>

<div style="border:1px solid #ccc; padding:10px; margin:10px 0;">
  <h3>✅ EXECUTE</h3>
  <p><strong>Produto:</strong> Vitamin D3 5000 IU Softgels</p>
  <p><strong>Fornecedor:</strong> Global Health Supplies Inc.</p>
  <p><strong>Margem:</strong> 28.5%</p>
  <p><strong>Risco:</strong> 22%</p>
  <p><strong>Prazo:</strong> 8 dias ✅</p>
  <p><strong>Receita Esperada:</strong> $3,450.00</p>
  <p><strong>Raciocínio IA:</strong> Match excelente com margem de 28.5%, 
  prazo dentro do esperado e histórico positivo similar. Taxa de confiança: 87%.</p>
</div>

<!-- Mais matches... -->
```

---

## ⚙️ CONFIGURAÇÃO

### 1. Credenciais Necessárias

Configure em `/revenue-automation-setup`:

| Credencial | Obrigatório | Uso |
|------------|-------------|-----|
| OPENAI_API_KEY | ✅ SIM | ChatGPT análise inteligente |
| SENDGRID_API_KEY | ✅ SIM | Email automático para tafita81@gmail.com |
| RAPIDAPI_KEY | ⚠️ Opcional | Amazon produtos (fornecedor único) |
| STRIPE_SECRET_KEY | ⚠️ Opcional | Links de pagamento |
| ALIBABA_API_KEY | 🔮 Futuro | RFQs Alibaba (20K/dia) |
| INDIAMART_API_KEY | 🔮 Futuro | RFQs IndiaMART (tempo real) |
| INVENTORY_SOURCE_KEY | 🔮 Futuro | Fornecedores (180+) |
| SHIPSTATION_KEY | 🔮 Futuro | Cálculo frete preciso |

### 2. Rotas Criadas

- `/rfq-matcher` - Dashboard principal
- `/revenue-automation-setup` - Configurar credenciais
- `/autonomous-ai` - Dashboard IA autônoma
- `/realtime-metrics` - Métricas em tempo real

### 3. Edge Functions

- `rfq-supplier-matcher` - Matching RFQ → Fornecedor
- `autonomous-ai-agent` - IA autônoma com aprendizado
- `global-b2b-connector` - Conexões B2B globais

---

## 🚀 COMO USAR

### Passo 1: Adicionar RFQs
1. Acesse `/rfq-matcher`
2. Vá em "Adicionar" tab
3. Preencha formulário RFQ:
   - Produto, quantidade, preço alvo
   - Localização comprador
   - Prazo esperado (dias)
4. Clique "Adicionar RFQ"

### Passo 2: Adicionar Fornecedores
1. Mesma tab "Adicionar"
2. Preencha formulário Fornecedor:
   - Nome fornecedor, produto
   - Estoque, preço, MOQ
   - Lead time, localização
3. Clique "Adicionar Fornecedor"

### Passo 3: Buscar Matches
1. Volte à tab "Matches"
2. Clique "Buscar Matches"
3. Sistema automaticamente:
   - Busca RFQs pendentes
   - Encontra fornecedores compatíveis
   - Calcula prazos e custos
   - ChatGPT analisa e decide
   - Salva matches no banco
   - Envia email para tafita81@gmail.com

### Passo 4: Revisar Decisões
1. Veja matches encontrados
2. Verde (✅ EXECUTE): IA recomenda executar
3. Vermelho (❌ REJECT): IA recomenda rejeitar
4. Leia raciocínio completo da IA
5. Aprove ou rejeite manualmente se necessário

---

## 📊 MÉTRICAS E APRENDIZADO

### Dashboard `/realtime-metrics`
- Decisões 24h
- Lucro total
- Taxa de sucesso
- Previsões 24h/semana/mês
- Gráficos interativos
- Live streaming de decisões

### IA Aprende Automaticamente
1. **Padrões de Sucesso:**
   - Margens > 25% = sucesso alto
   - Prazos < 7 dias = confiança alta
   - Fornecedores específicos = histórico bom

2. **Padrões de Falha:**
   - Margens < 10% = risco alto
   - Prazos > 30 dias = rejeitar
   - Produtos complexos = cautela

3. **Auto-Correção:**
   - Ajusta decisões futuras
   - Melhora taxa de sucesso
   - Reduz risco ao longo do tempo

---

## ⚠️ IMPORTANTE - NÃO MISTURAR CONTEXTOS

**Esta empresa é:**
- **Dono:** Rafael Roberto Rodrigues de Oliveira
- **Empresa:** Consultoria em Tecnologia da Informação Corp
- **EIN:** 33-3939483
- **Email:** tafita81@gmail.com (EXCLUSIVAMENTE)
- **Localização:** Orlando, Florida, USA

**Sistema envia emails SOMENTE para:** tafita81@gmail.com

**Não confundir com:**
- Outras empresas
- Outros projetos
- Outros emails
- Outros contextos

---

## 📝 PRÓXIMOS PASSOS

### Quando tiver APIs:
1. **Alibaba Gold Supplier** → RFQs automáticos (20K/dia)
2. **IndiaMART Webhook** → Leads em tempo real
3. **Inventory Source** → 180+ fornecedores automáticos
4. **ShipStation/Shippo** → Prazos e custos precisos

### Melhorias Futuras:
- Auto-execução de matches EXECUTE
- Negociação automática via IA
- Integração Payoneer (receber comissões)
- Sistema de rastreamento de pedidos
- Dashboard de performance por fornecedor

---

## 🔧 TROUBLESHOOTING

**Erro: "ChatGPT API key não configurada"**
→ Configure OPENAI_API_KEY em `/revenue-automation-setup`

**Erro: "SendGrid não configurado"**
→ Configure SENDGRID_API_KEY em `/revenue-automation-setup`

**Nenhum match encontrado**
→ Adicione mais fornecedores ou RFQs no sistema

**Email não chegou**
→ Verifique spam/lixo eletrônico de tafita81@gmail.com

---

**Sistema criado em:** 2025-01-11  
**Última atualização:** 2025-01-11  
**Versão:** 1.0.0
