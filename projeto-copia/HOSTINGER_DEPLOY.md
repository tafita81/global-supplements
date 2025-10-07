# 🚀 Global Supplements - Instruções de Deploy para Hostinger

## ✅ Status do Projeto
- **Build de Produção**: ✓ Concluído (8.3MB)
- **Traduções**: ✓ 14 idiomas (94.5%+ cobertura)
- **Amazon Affiliate**: ✓ Tag unificada `globalsupleme-20`
- **OneLink**: ✓ Configurado para 13 países
- **Responsivo**: ✓ Mobile + Desktop

---

## 📦 Deploy para www.globalsupplements.site

### Passo 1: Fazer Upload dos Arquivos

1. **Acesse o painel da Hostinger**
   - Login em: https://hpanel.hostinger.com

2. **Vá para File Manager**
   - Navegue até `public_html` ou `www`

3. **Faça upload da pasta `dist/`**
   - Envie **TODO** o conteúdo da pasta `dist/` para o diretório raiz
   - Certifique-se de que `index.html` está na raiz
   - Mantenha a estrutura de pastas:
     ```
     /index.html
     /assets/
     /images/
     /documents/
     /favicon.ico
     /robots.txt
     ```

### Passo 2: Configurar .htaccess

Crie um arquivo `.htaccess` na raiz com o seguinte conteúdo:

```apache
# Redirect all traffic to HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]

# SPA Routing - Redirect all requests to index.html
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Cache Control
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript
</IfModule>
```

### Passo 3: Configurar DNS (se necessário)

Se o domínio ainda não estiver apontado:
1. Vá para **Domains** → **DNS/Nameservers**
2. Configure os nameservers da Hostinger
3. Aguarde propagação (24-48h)

### Passo 4: Ativar SSL

1. No painel Hostinger, vá para **SSL**
2. Selecione **Free Let's Encrypt SSL**
3. Ative SSL para `www.globalsupplements.site`
4. Force HTTPS (já configurado no .htaccess)

---

## 🔑 Amazon Associates - Configuração Necessária

### IMPORTANTE: Ative o "Earn Globally"

Para que a tag `globalsupleme-20` funcione em todos os 13 países:

1. **Faça login na Amazon Associates**: https://affiliate-program.amazon.com
2. **Vá para Account Settings**
3. **Procure por "OneLink" ou "Earn Globally"**
4. **Ative a opção** para usar uma única tag em todos os marketplaces
5. **Confirme que sua tag é**: `globalsupleme-20`

Países suportados:
- 🇺🇸 United States (amazon.com)
- 🇨🇦 Canada (amazon.ca)
- 🇬🇧 United Kingdom (amazon.co.uk)
- 🇩🇪 Germany (amazon.de)
- 🇫🇷 France (amazon.fr)
- 🇮🇹 Italy (amazon.it)
- 🇪🇸 Spain (amazon.es)
- 🇯🇵 Japan (amazon.co.jp)
- 🇦🇺 Australia (amazon.com.au)
- 🇳🇱 Netherlands (amazon.nl)
- 🇸🇪 Sweden (amazon.se)
- 🇸🇬 Singapore (amazon.sg)
- 🇵🇱 Poland (amazon.pl)
- 🇸🇦 Saudi Arabia (amazon.sa)

---

## 🌍 Funcionalidades Multilíngues

O site detecta automaticamente o idioma do visitante e traduz:

### Idiomas Suportados (14):
- 🇺🇸 English
- 🇵🇹 Português
- 🇪🇸 Español
- 🇫🇷 Français
- 🇩🇪 Deutsch
- 🇮🇹 Italiano
- 🇯🇵 日本語
- 🇰🇷 한국어
- 🇨🇳 中文
- 🇸🇦 العربية
- 🇮🇳 हिन्दी
- 🇲🇾 Bahasa Melayu
- 🇳🇱 Nederlands
- 🇸🇪 Svenska

### O que é traduzido:
✅ Interface completa
✅ Categorias e subcategorias
✅ Textos de marketing
✅ Botões e ações
✅ Depoimentos
✅ Estatísticas
✅ Certificações

**Não traduzido** (proposital):
- ❌ Nome da marca "Global Supplements" (sempre em inglês)
- ❌ Nomes próprios e siglas (FDA, WHO, GMP, etc)
- ❌ Nomes de produtos da Amazon (mantidos originais)

---

## 📊 Após o Deploy - Verificações

1. **Teste Multi-idioma**:
   - Acesse www.globalsupplements.site
   - Troque o idioma no seletor
   - Verifique se as subcategorias traduzem

2. **Teste Amazon**:
   - Selecione diferentes países
   - Verifique se produtos carregam
   - Clique em "Shop Premium Product"
   - Confirme que a URL contém `tag=globalsupleme-20`

3. **Teste Mobile**:
   - Abra em smartphone
   - Verifique menu responsivo
   - Teste navegação entre páginas

4. **Performance**:
   - Use Google PageSpeed Insights
   - Meta: >90 score

---

## 🔧 Manutenção

### Atualizar Produtos
Os produtos são carregados em tempo real da API da Amazon. Não é necessário atualizar manualmente.

### Adicionar Novo Idioma
Edite: `src/i18n/locales/{codigo}.json`

### Alterar Tag de Afiliado
Edite: `src/config/amazonMarketplaces.ts`

---

## ✅ Checklist Final

- [ ] Upload de todos os arquivos da pasta `dist/`
- [ ] Arquivo `.htaccess` criado
- [ ] SSL ativado
- [ ] DNS configurado (se novo domínio)
- [ ] Amazon OneLink ativado no painel Associates
- [ ] Testado em desktop
- [ ] Testado em mobile
- [ ] Testado em diferentes países
- [ ] Testado em diferentes idiomas
- [ ] Links de afiliado funcionando

---

## 🎉 Pronto!

Seu site estará no ar em **www.globalsupplements.site** com:
- 14 idiomas
- 13 países Amazon
- Tag unificada de afiliado
- Design responsivo
- SEO otimizado

**Tempo estimado de deploy**: 15-30 minutos
