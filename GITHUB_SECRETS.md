# 🔑 Configurar Secrets do GitHub

## ❌ PROBLEMA ATUAL:
O GitHub Actions está falhando porque faltam **5 secrets** necessários.

## ✅ SOLUÇÃO - Adicionar Secrets Manualmente:

### 📋 **PASSO A PASSO:**

1. **Acesse:** https://github.com/tafita81/global-supplements/settings/secrets/actions

2. **Clique em:** "New repository secret"

3. **Adicione CADA secret abaixo:**

---

### 🔐 **SECRET 1: VITE_SUPABASE_URL**
```
Name: VITE_SUPABASE_URL
Value: https://twglceexfetejawoumsr.supabase.co
```

---

### 🔐 **SECRET 2: VITE_SUPABASE_ANON_KEY**
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3Z2xjZWV4ZmV0ZWphd291bXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MjExOTAsImV4cCI6MjA3NDQ5NzE5MH0.kVKkE-dbIDi2-31-pCKBVzjjk5Hu-SV7SgmKzQVkaeY
```

---

### 🔐 **SECRET 3: FTP_SERVER**
```
Name: FTP_SERVER
Value: [SEU_SERVIDOR_HOSTINGER]
Exemplo: ftp.seudominio.com
```

---

### 🔐 **SECRET 4: FTP_USERNAME**
```
Name: FTP_USERNAME
Value: [SEU_USUARIO_FTP]
Exemplo: user@seudominio.com
```

---

### 🔐 **SECRET 5: FTP_PASSWORD**
```
Name: FTP_PASSWORD
Value: [SUA_SENHA_FTP]
(Já existe, mas verifique se está correto)
```

---

## 🚀 **APÓS ADICIONAR OS SECRETS:**

1. **Commit e push das mudanças:**
```bash
git add projeto-copia/src/integrations/supabase/client.ts projeto-copia/.env
git commit -m "Fix: Use env vars for Supabase credentials"
git push origin main
```

2. **O GitHub Actions vai rodar automaticamente**

3. **Acompanhe em:** https://github.com/tafita81/global-supplements/actions

---

## 📝 **NOTA IMPORTANTE:**

Se você **NÃO TIVER** credenciais FTP do Hostinger ainda:
- Você pode desabilitar temporariamente o deploy FTP
- O build vai funcionar mesmo assim
- Adicione as credenciais FTP depois

---

## ✅ **VERIFICAR SE FUNCIONOU:**

Após adicionar os secrets e fazer push:
- ✅ Build passa com sucesso
- ✅ Deploy FTP funciona (se credenciais corretas)
- ✅ Site publicado no Hostinger
