# 🔬 Guia de Branches - Global Supplements

## 📋 Estrutura de Branches

- **`main`** → Produção (deploy em `/public_html/global-supplements/`)
- **`experimentos`** → Desenvolvimento/Testes (deploy em `/public_html/global-supplements-dev/`)

---

## 🚀 Comandos Essenciais

### **1. Ver em qual branch você está**
```bash
git branch
```
✅ A branch com `*` é a atual

---

### **2. Mudar de Branch**

**Para experimentos:**
```bash
git checkout experimentos
```

**Para produção:**
```bash
git checkout main
```

---

### **3. Trabalhar em Experimentos**

```bash
# 1. Certifique-se que está na branch certa
git checkout experimentos

# 2. Faça suas alterações no código

# 3. Salvar alterações
git add -A
git commit -m "Teste: descrição do experimento"

# 4. Enviar para GitHub (deploy automático para /dev/)
git push origin experimentos
```

**✅ Deploy automático para ambiente DEV em ~2-3 minutos!**

---

### **4. Aprovar Experimento (Levar para Produção)**

Quando o experimento funcionar e você quiser colocar em produção:

```bash
# 1. Voltar para produção
git checkout main

# 2. Trazer mudanças aprovadas
git merge experimentos

# 3. Enviar para produção
git push origin main
```

**✅ Deploy automático para PRODUÇÃO em ~2-3 minutos!**

---

### **5. Descartar Experimento Falho**

Se o experimento não funcionou e quer começar do zero:

⚠️ **ATENÇÃO:** Isso apaga TODO o histórico de experimentos. Certifique-se que não tem nada importante!

```bash
# 1. Voltar para produção
git checkout main

# 2. Deletar branch local de experimentos
git branch -D experimentos

# 3. Deletar branch remota de experimentos (GitHub)
# IMPORTANTE: Remove do GitHub e limpa ambiente DEV
git push origin --delete experimentos

# 4. Criar nova branch limpa
git checkout -b experimentos

# 5. Enviar branch limpa para GitHub
git push origin experimentos
```

**❌ Experimento descartado completamente (local + remoto + ambiente DEV limpo), produção intocada!**

**Por que deletar o branch remoto?** Previne erros de push futuro e garante que código falho não fica acessível no ambiente DEV.

---

## 🔄 Fluxo de Trabalho Recomendado

### **Cenário 1: Testar Nova Feature**

```bash
git checkout experimentos
# Desenvolver feature
git add -A
git commit -m "Feat: adicionar nova seção"
git push origin experimentos
# Testar em ambiente DEV
# Se funcionar → merge para main
# Se falhar → descartar
```

### **Cenário 2: Fix de Bug Urgente**

```bash
git checkout main
# Corrigir bug diretamente
git add -A
git commit -m "Fix: corrigir erro X"
git push origin main
# Deploy imediato para produção
```

### **Cenário 3: Múltiplos Experimentos**

```bash
# Experimento 1
git checkout experimentos
# Desenvolver
git add -A && git commit -m "Teste A"
git push origin experimentos

# Experimento 2 (sem aprovar o anterior)
# Desenvolver mais
git add -A && git commit -m "Teste B"
git push origin experimentos

# Quando tudo estiver OK → merge para main
```

---

## 🛡️ Proteção de Produção

### **Regras de Segurança:**

✅ **SEMPRE desenvolver em `experimentos`**  
✅ **NUNCA fazer push direto em `main` sem testar**  
✅ **SEMPRE verificar branch antes de commit**: `git branch`  
✅ **Testar no ambiente DEV antes de merge**

---

## 📊 Monitorar Deploys

### **GitHub Actions:**
1. Acesse: GitHub → **Actions** tab
2. Veja status dos deploys
3. Logs completos de build/deploy

### **Verificar se Deploy Funcionou:**
- **Produção**: Acesse URL de produção
- **Dev**: Acesse `http://82.29.199.81/global-supplements-dev/`

---

## 🆘 Comandos de Emergência

### **Ver histórico de commits:**
```bash
git log --oneline
```

### **Voltar para commit anterior:**
```bash
git reset --hard HEAD~1
```

### **Sincronizar com GitHub:**
```bash
git pull origin experimentos
```

### **Ver diferenças entre branches:**
```bash
git diff main experimentos
```

---

## 💡 Dicas Profissionais

1. **Commits frequentes**: Commit pequeno e descritivo é melhor que commit gigante
2. **Mensagens claras**: Use `Feat:`, `Fix:`, `Test:` para organizar
3. **Testar sempre**: Nunca merge sem testar no DEV
4. **Backup**: GitHub guarda todo histórico, não tenha medo de experimentar
5. **Push regular**: Faça push para não perder trabalho

---

## 📞 Suporte

**Problemas comuns:**

**"Changes not staged for commit"**
```bash
git add -A
```

**"Your branch is behind 'origin/experimentos'"**
```bash
git pull origin experimentos
```

**"Failed to push"**
```bash
git pull origin experimentos
git push origin experimentos
```

---

**Última atualização:** Outubro 2025
