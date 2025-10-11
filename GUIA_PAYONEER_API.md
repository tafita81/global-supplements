# 🏦 GUIA COMPLETO: Como Obter API do Payoneer

## ✅ VOCÊ JÁ TEM: Conta Empresa EUA no Payoneer

Agora precisa de **3 credenciais** para usar a API:
1. **Program ID** (já tem no dashboard)
2. **Client ID** (precisa solicitar)
3. **Client Secret** (precisa solicitar)

---

## 📋 **PASSO A PASSO COMPLETO**

### **PASSO 1: Encontre seu Program ID** (Já tem!)

1. Faça login no Payoneer: https://www.payoneer.com
2. Vá para seu **Dashboard**
3. Olhe no **canto superior direito** (acima do nome da empresa)
4. Você verá um número como: `100012345678`
5. **Esse é seu Program ID** - anote!

---

### **PASSO 2: Solicite Acesso à API** (MAIS IMPORTANTE!)

⚠️ **ATENÇÃO:** A API do Payoneer **NÃO está ativa por padrão**. Você PRECISA solicitar acesso!

#### **Como solicitar:**

**Envie email para:** `integration@payoneer.com`

**Assunto do email:**
```
API Access Request - [Nome da sua empresa]
```

**Corpo do email (em inglês):**
```
Dear Payoneer Integration Team,

I would like to request API access for my business account.

Company Information:
- Company Name: Consultoria em Tecnologia da Informação Corp
- Program ID: [seu_program_id]
- Country: United States
- EIN: 33-3939483

API Needs:
- Mass Payout API (to send commission payments automatically)
- I need Client ID and Client Secret for OAuth authentication

Use Case:
- B2B marketplace platform
- Automatic commission distribution to global suppliers/buyers
- Expected monthly volume: $20,000+

Please enable API access and provide:
1. Client ID
2. Client Secret
3. Sandbox credentials for testing

Thank you,
Rafael Roberto Rodrigues de Oliveira
tafita81@gmail.com
```

#### **O que vai acontecer:**

1. **Payoneer vai revisar** (1-3 dias úteis)
2. Eles podem pedir mais informações sobre seu negócio
3. Após aprovação, você recebe **por email**:
   - ✅ Client ID
   - ✅ Client Secret
   - ✅ Credenciais sandbox (teste)

---

### **PASSO 3: Escolha qual API precisa**

Payoneer tem **4 APIs principais**:

| API | Para que serve | Você precisa? |
|-----|----------------|---------------|
| **Mass Payout API** | Enviar pagamentos em massa (comissões) | ✅ **SIM** |
| **Checkout API** | Receber pagamentos de clientes | ⚠️ Talvez |
| **Charge Account API** | Debitar de contas Payoneer | ⚠️ Talvez |
| **PSD2 API** | Serviços bancários UE (precisa certificado) | ❌ Não |

**Recomendação:** Solicite **Mass Payout API** (para enviar comissões automaticamente)

---

### **PASSO 4: Configurar Autenticação OAuth** (Depois de receber credenciais)

Quando receber **Client ID** e **Client Secret**, você usará **OAuth 2.0**:

#### **Fluxo de Autenticação:**

```python
import requests
import base64

# Suas credenciais (vão chegar por email)
CLIENT_ID = "seu_client_id"
CLIENT_SECRET = "seu_client_secret"

# 1. Obter Access Token
token_url = "https://api.payoneer.com/v1/oauth/token"

auth = (CLIENT_ID, CLIENT_SECRET)
data = {
    "grant_type": "client_credentials"
}

response = requests.post(token_url, auth=auth, data=data)
access_token = response.json()["access_token"]

print(f"Access Token: {access_token}")

# 2. Usar token em requests
headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json"
}

# Exemplo: Buscar saldo da conta
balance_url = "https://api.payoneer.com/v2/account/balance"
balance_response = requests.get(balance_url, headers=headers)
print(balance_response.json())
```

---

### **PASSO 5: Testar em Sandbox** (Ambiente de teste)

Payoneer vai te dar credenciais **sandbox** separadas:

**Ambiente Sandbox:**
- URL: `https://api.sandbox.payoneer.com`
- Credenciais diferentes do produção
- Dinheiro falso (não cobra nada)
- Teste tudo antes de ir para produção

**Ambiente Produção:**
- URL: `https://api.payoneer.com`
- Credenciais reais
- Transações reais
- Só use depois de testar tudo em sandbox

---

## 🔧 **OPERAÇÕES DISPONÍVEIS (Mass Payout API)**

### **1. Enviar Pagamento (Comissão)**

```python
# Enviar $500 de comissão para fornecedor
payout_url = "https://api.payoneer.com/v2/payouts"

headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json"
}

data = {
    "payee_id": "fornecedor@email.com",  # Email do beneficiário
    "amount": 500.00,
    "currency": "USD",
    "description": "B2B Commission Payment",
    "client_reference_id": "ORDER123456"  # Seu ID interno
}

response = requests.post(payout_url, headers=headers, json=data)
payout = response.json()

print(f"Payout ID: {payout['payout_id']}")
print(f"Status: {payout['status']}")
```

### **2. Verificar Status de Pagamento**

```python
# Checar se pagamento foi completado
payout_id = "payout_12345"
status_url = f"https://api.payoneer.com/v2/payouts/{payout_id}"

response = requests.get(status_url, headers=headers)
status = response.json()

print(f"Status: {status['status']}")  # PENDING, COMPLETED, FAILED
print(f"Amount: ${status['amount']}")
```

### **3. Buscar Saldo da Conta**

```python
# Ver quanto você tem disponível
balance_url = "https://api.payoneer.com/v2/account/balance"

response = requests.get(balance_url, headers=headers)
balance = response.json()

print(f"Available Balance: ${balance['available_balance']}")
print(f"Pending Balance: ${balance['pending_balance']}")
```

### **4. Registrar Beneficiário (Payee)**

```python
# Cadastrar fornecedor para receber comissões
register_url = "https://api.payoneer.com/v2/payees"

data = {
    "email": "fornecedor@email.com",
    "first_name": "John",
    "last_name": "Supplier",
    "date_of_birth": "1980-01-15",
    "country": "CN"  # China
}

response = requests.post(register_url, headers=headers, json=data)
payee = response.json()

print(f"Payee ID: {payee['payee_id']}")
print(f"Status: {payee['status']}")  # ACTIVE, PENDING_VERIFICATION
```

---

## 💰 **CUSTOS E REQUISITOS**

### **Requisitos Mínimos:**
- ✅ Conta Payoneer verificada (você já tem!)
- ✅ Volume mensal mínimo: **$20,000** em payouts
- ✅ Fundos disponíveis na conta

### **Taxas:**
- **Envio de pagamento:** ~0.5-2% (depende do país destino)
- **Retirada para banco:** $3 por transferência
- **Manutenção:** Grátis se ativo

### **Como Adicionar Fundos:**

1. **Wire Transfer** (Transferência bancária)
   - Email: `clientservices@payoneer.com`
   - Peça instruções de wire
   - Receba dados bancários do Payoneer
   - Transfira de seu banco

2. **Cartão de Crédito/Débito**
   - Faça login no Payoneer
   - Vá em: Add Funds → Credit/Debit Card
   - Taxa: ~2-3%

---

## 📞 **CONTATOS ÚTEIS**

| Serviço | Email | Para que serve |
|---------|-------|----------------|
| **API Access** | integration@payoneer.com | Solicitar Client ID/Secret |
| **Suporte Técnico** | integration@payoneer.com | Dúvidas de integração |
| **Atendimento** | clientservices@payoneer.com | Wire transfer, fundos |
| **Telefone** | +1-646-202-8478 | Suporte 24/7 (22 idiomas) |

---

## 📚 **DOCUMENTAÇÃO OFICIAL**

| Recurso | URL |
|---------|-----|
| **Developer Portal** | https://www.payoneer.com/developers/ |
| **API Reference** | https://developer.payoneer.com/docs/payoneer-api-reference |
| **Mass Payout Docs** | https://developer.payoneer.com/docs/mass-payouts-and-services.html |
| **GitHub Examples** | https://github.com/payoneer/chargeaccount-integration-example |
| **Postman Collection** | https://www.postman.com/payoneerdocs |

---

## ✅ **CHECKLIST COMPLETO**

### **Agora (Hoje):**
- [ ] Login no Payoneer → Anotar **Program ID**
- [ ] Enviar email para **integration@payoneer.com** solicitando API
- [ ] Mencionar: Mass Payout API + Client ID/Secret

### **Quando Receber Credenciais (1-3 dias):**
- [ ] Receber **Client ID** e **Client Secret** por email
- [ ] Receber credenciais **sandbox**
- [ ] Testar autenticação OAuth
- [ ] Fazer primeira chamada em sandbox

### **Antes de Produção:**
- [ ] Testar todos endpoints em sandbox
- [ ] Verificar saldo mínimo ($20K/mês)
- [ ] Adicionar fundos via wire/cartão
- [ ] Configurar webhooks (notificações)
- [ ] Trocar para credenciais produção

---

## 🚀 **INTEGRAÇÃO NO SISTEMA**

Quando você tiver **Client ID** e **Client Secret**, vou implementar:

1. **Edge Function: `payoneer-commission-handler`**
   - Envia comissões automaticamente
   - Registra beneficiários
   - Checa status de pagamentos

2. **Frontend: `/payoneer-setup`**
   - Configurar credenciais
   - Testar conexão
   - Ver saldo em tempo real

3. **Webhook Handler**
   - Recebe notificações do Payoneer
   - Atualiza status no banco
   - Envia email para tafita81@gmail.com

---

## ⚠️ **AVISOS IMPORTANTES**

1. **Client Secret é CONFIDENCIAL**
   - NUNCA exponha em frontend
   - Guarde em secrets (já fizemos isso com outras APIs)
   - Use apenas server-side

2. **Volume Mínimo $20K/mês**
   - Payoneer exige esse mínimo
   - Planeje bem antes de ativar
   - Comece em sandbox (sem limite)

3. **Aprovação pode demorar**
   - 1-3 dias úteis normalmente
   - Podem pedir documentos extras
   - Tenha paciência

---

## 📧 **EMAIL MODELO - COPIAR E ENVIAR AGORA**

```
To: integration@payoneer.com
Subject: API Access Request - Consultoria em Tecnologia da Informação Corp

Dear Payoneer Integration Team,

I would like to request API access for my business account.

Company Information:
- Company Name: Consultoria em Tecnologia da Informação Corp
- Program ID: [COLE SEU PROGRAM_ID AQUI]
- Country: United States
- EIN: 33-3939483
- Account Email: tafita81@gmail.com

API Requirements:
- Mass Payout API (OAuth 2.0)
- Client ID and Client Secret
- Sandbox credentials for testing

Use Case:
- Global B2B marketplace platform connecting suppliers and buyers
- Automatic commission distribution system
- Expected monthly payout volume: $25,000 - $50,000
- Integration with AI-powered arbitrage system

Technical Setup:
- Backend: Supabase Edge Functions (Deno/TypeScript)
- Authentication: OAuth 2.0 Bearer Token
- Webhook endpoint ready for status notifications

Please provide:
1. Production Client ID + Client Secret
2. Sandbox Client ID + Client Secret
3. API documentation access
4. Webhook setup instructions

Thank you for your assistance.

Best regards,
Rafael Roberto Rodrigues de Oliveira
Consultoria em Tecnologia da Informação Corp
Orlando, Florida, USA
Email: tafita81@gmail.com
Phone: [seu telefone]
```

---

## 🎯 **RESUMO - O QUE FAZER**

1. ✅ **HOJE:** Envie email para integration@payoneer.com
2. ⏳ **AGUARDE:** 1-3 dias para aprovação
3. ✅ **RECEBA:** Client ID + Client Secret por email
4. ✅ **TESTE:** Use sandbox antes de produção
5. ✅ **PRODUZA:** Adicione fundos e ative API real

**Quer que eu prepare o código de integração agora (enquanto aguarda aprovação)?** 🚀
