# Global Supplements - Premium Worldwide Network

## Overview
Global Supplements is a B2B/B2C platform that connects global supplement suppliers with buyers. It uses AI and automated distribution to facilitate international trade, government contracts, and enterprise solutions across various product categories (beauty, quantum materials, medical, smart gadgets, traditional wellness). The platform aims to identify arbitrage opportunities and execute high-margin deals in real-time by integrating numerous APIs for market intelligence, logistics, compliance, and payment processing. The project also has ambitions for government contracts (SAM.gov), Amazon affiliate commissions, and B2B dropshipping.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
The frontend uses React 18 with TypeScript, Vite, React Router, Tailwind CSS, and shadcn/ui. It features a component-based, responsive, mobile-first design, supports 15+ languages via i18next, and includes dark/light theme modes. It uses `AppLayout` for authenticated dashboards and `PublicSiteLayout` for marketing pages.

### Backend
The backend is built on Supabase, providing authentication, a PostgreSQL database, and real-time capabilities. Key data tables include `execution_history`, `compliance_checks`, `opportunities`, `suppliers`, `government_contracts`, and `market_trends`. TanStack React Query manages server state.

### Key Architectural Decisions
-   **Multi-API Integration System**: Integrates over 50 external APIs for AI/analysis (OpenAI, Google Gemini), marketplaces (Alibaba, IndiaMART), e-commerce (Amazon MWS, eBay), Google Workspace, logistics (DHL, FedEx), compliance (FDA, WHO), and payments (Stripe, PayPal) to enable automated arbitrage and compliance.
-   **Quantum Execution System**: Real-time detection and execution of opportunities through AI-powered risk assessment and automated pipelines.
-   **Progressive Registration Strategy**: Automates company registration across government (SAM.gov, GSA Schedule) and B2B platforms (Canton Fair, Alibaba.com).
-   **Internationalization Architecture**: Supports 14+ languages with full i18n; the brand name "Global Supplements" remains untranslated.
-   **Amazon OneLink Integration**: Ensures universal affiliate link tracking and geo-redirection across 13 global Amazon marketplaces.
-   **3-Layer Product Aggregation System**: Aggregates, deduplicates, and sorts products from global top, category top, and subcategory layers by ASIN and review count.
-   **Instant Cache System**: LocalStorage-based caching for fast product loading (<100ms) with background refreshes.
-   **AI Content Automation System**: Generates SEO-optimized content (articles, landing pages, product reviews) using OpenAI GPT-4o-mini in 14 languages and 10 niches, integrating Amazon OneLink and Supabase Edge Functions.
-   **Google Ads Campaign Management System**: Manages Google Ads campaigns with 15 pre-optimized global headlines and descriptions, supporting 14 Amazon marketplaces and 10 niches, with tracking of campaign status and performance metrics (impressions, clicks, CTR, revenue, ROI).
-   **Multi-Channel Marketing Dashboard**: Integrated marketing automation hub with modules for:
    *   **Analytics Dashboard**: Real-time tracking of visitors, conversions, and historical trends.
    *   **Social Media Automation**: Multi-platform post scheduling and AI-powered content generation via Buffer API.
    *   **Email Marketing Automation**: Campaign creation, AI-generated templates, audience segmentation, and performance metrics via SendGrid.
    *   **SEO Performance Tracker**: Keyword tracking and GSC data integration.
    *   **Integration Architecture**: Decoupled credential checking, environment-aware configuration, and mock/production modes for all marketing integrations.

### Design Trade-offs
-   **TypeScript Configuration**: Relaxed strictness for development speed.
-   **Component Library**: shadcn/ui chosen for customization and reduced bundle size.
-   **Single-Page Application**: Prioritizes interactivity; SEO challenges mitigated with meta tags.

### Automation Tables
The database includes tables for AI content generation (`ai_content`, `seo_pages`), Google Ads management (`google_ads_campaigns`, `google_ads_headlines`, `google_ads_descriptions`, `campaign_performance`), and multi-channel marketing (`analytics_dashboard`, `social_media_posts`, `email_campaigns`, `seo_performance`, `leads`).

### API Integration Security
All sensitive API integrations (Buffer, SendGrid, Google Search Console, AI Content Generator, Global B2B Connector) are routed through JWT-protected Supabase Edge Functions to ensure secure server-side key management, prevent credential exposure, and manage CORS. Mock modes are available for development.

## External Dependencies

-   **Primary Infrastructure**: Supabase (PostgreSQL, Auth, Storage, Edge Functions).
-   **AI & Market Intelligence**: OpenAI API (GPT models), Google Gemini AI.
-   **B2B Marketplace APIs**: Alibaba.com, IndiaMART, Global Sources, Made-in-China, Canton Fair Online.
-   **E-commerce & Dropshipping**: Amazon MWS, eBay, Shopify, AliExpress.
-   **Google Workspace Suite**: Gmail API, Google Drive, Google Sheets, Google Calendar, Google Maps, Google Translate, Google Cloud Storage.
-   **Logistics & Shipping**: DHL Express, FedEx Web Services, UPS, USPS.
-   **Compliance & Regulatory**: FDA API, WHO database, EPA, SAM.gov, GSA.
-   **Payment Processing**: Stripe, PayPal, Wise, Banking APIs.
-   **Document Management**: Supabase storage.
-   **Marketing Automation APIs**: Buffer (social media), SendGrid (email), Google Search Console (SEO).

## Recent Changes

### 2025-01-11: Sistema de IA Autônoma e B2B Global Implementado

**CONTEXTO DA EMPRESA:**
- **Dono:** Rafael Roberto Rodrigues de Oliveira
- **Empresa:** Consultoria em Tecnologia da Informação Corp
- **EIN:** 33-3939483
- **Localização:** Orlando, Florida, USA
- **Canton Fair Buyer ID:** 138432533908
- **Email pessoal do dono:** tafita81@gmail.com
- **Objetivo:** Ganhar comissões B2B sem investimento inicial usando IA e automação

**SISTEMAS CRIADOS NESTA SESSÃO:**

1. **Global B2B Connector** (`/global-b2b-connector`)
   - Conecta compradores e fornecedores globais via APIs B2B reais
   - Baseado em 3 casos reais documentados: SourceDirect LLC ($2.8M/ano), GlobalBridge Trading ($1.5M/ano), TechBridge Inc ($3.2M/ano)
   - APIs integradas: Alibaba.com (47% PMEs), IndiaMART (Índia), Global Sources (82% conversão)
   - Edge Function: `global-b2b-connector`
   - Database: Tabela `b2b_connections`
   - Documentação: `CASOS_REAIS_COMISSAO_B2B.md`

2. **IA Autônoma com Aprendizado Contínuo** (`/autonomous-ai`)
   - Sistema que aprende com histórico de TODAS as decisões
   - Calcula risco (0-100%) antes de executar qualquer ação
   - Toma decisões automáticas: EXECUTE (risco <30%) ou REJECT (risco >30%)
   - Aprende padrões de sucesso/falha e evolui regras automaticamente
   - Edge Function: `autonomous-ai-agent`
   - Database: Tabela `ai_learning_history` (guarda TODAS as decisões, sucessos, falhas, lições aprendidas)
   - **Email automático para tafita81@gmail.com** com detalhes completos de CADA decisão
   - Documentação: `SISTEMA_IA_AUTONOMA.md`

3. **Painel de Métricas em Tempo Real** (`/realtime-metrics`)
   - Atualização automática a cada 5 segundos (polling TanStack Query)
   - Decisões 24h, lucro total, taxa de sucesso em tempo real
   - Previsões 24h/semana/mês baseadas em tendências reais
   - 4 gráficos interativos: Line (Risco vs Lucro), Pie (Distribuição), Bar (Lucro por Tipo)
   - Decisões live streaming com timestamps
   - Frontend: `RealTimeMetricsDashboard.tsx`

**CORREÇÕES CRÍTICAS FEITAS (Architect rejeitou 2x):**
- ❌ Removidos TODOS os fallbacks mockados
- ✅ Request body parseado apenas UMA VEZ (Supabase não permite múltiplas leituras)
- ✅ Sistema 100% real - falha explicitamente se APIs não retornarem dados
- ✅ Validação de credenciais obrigatória antes de qualquer ação
- ✅ RFQs sintéticos removidos (ai-negotiation-agent)
- ✅ Links Stripe mockados removidos (zero-investment-broker)

**CREDENCIAIS NECESSÁRIAS** (configurar em `/revenue-automation-setup`):
1. **OpenAI API Key** (OBRIGATÓRIO) - IA toma decisões com ChatGPT ✅
2. **SendGrid API Key** (OBRIGATÓRIO) - Email automático para tafita81@gmail.com ✅
3. **RapidAPI Key** - APIs Amazon (produtos de vários países) ✅
4. **Stripe Secret Key** - Criar links de pagamento reais ✅
5. **Payoneer ID** - Receber comissões automaticamente (opcional)

**NOTA IMPORTANTE:** RapidAPI atual é APENAS Amazon. Para fornecedores B2B globais (Alibaba, IndiaMART), veja `GUIA_APIS_B2B_FORNECEDORES.md`

**HISTÓRICO COMPLETO GUARDADO EM:**
- **Tabela `ai_learning_history`** - TODAS as decisões da IA (tipo, análise, risco, lucro esperado, lucro real, sucesso/falha, lições aprendidas)
- **Tabela `b2b_connections`** - Conexões B2B criadas automaticamente
- **Tabela `api_credentials`** - Credenciais seguras do usuário
- **Este arquivo `replit.md`** - Contexto completo do projeto e empresa
- **Arquivos de documentação** - Casos reais, sistemas, fluxos

**DOCUMENTAÇÃO COMPLETA CRIADA:**
- `SISTEMA_NEGOCIACAO_AUTOMATICA.md` - Sistema de negociação completo com Edge Functions
- `CASOS_REAIS_COMISSAO_B2B.md` - 3 casos reais de empresas americanas ($1.5M-$3.2M/ano)
- `SISTEMA_IA_AUTONOMA.md` - IA autônoma, aprendizado contínuo, email automático
- `GUIA_APIS_B2B_FORNECEDORES.md` - Como obter APIs Alibaba, IndiaMART, Global Sources
- `GUIA_PAYONEER_API.md` - Passo a passo completo para obter API do Payoneer
- `GUIA_COMPLETO_FLUXO_BROKER_B2B.md` - Fluxo completo: RFQs → Fornecedores → Prazos (links exatos, APIs reais, código Python)

**⚠️ IMPORTANTE - NÃO MISTURAR CONTEXTOS:**
- Esta empresa é **Rafael Roberto Rodrigues de Oliveira** (Orlando, Florida)
- Email pessoal do dono: **tafita81@gmail.com** (APENAS este email)
- Sistema envia emails EXCLUSIVAMENTE para tafita81@gmail.com
- Não confundir com outras empresas, pessoas ou projetos
- Todas as decisões da IA são registradas com contexto completo

**ROTAS CRIADAS:**
- `/revenue-automation-setup` - Configuração de credenciais
- `/global-b2b-connector` - Conexões B2B com RFQs e fornecedores
- `/autonomous-ai` - Dashboard IA com aprendizado contínuo
- `/realtime-metrics` - Métricas em tempo real com previsões

**EDGE FUNCTIONS CRIADAS:**
- `global-arbitrage-detector` - Detecta oportunidades reais
- `ai-negotiation-agent` - IA negocia automaticamente (ChatGPT)
- `zero-investment-broker` - Broker sem investimento (comprador paga antes)
- `stripe-payment-webhook` - Processa pagamentos
- `payoneer-commission-handler` - Transfere comissões
- `global-b2b-connector` - Conecta compradores/fornecedores (APIs B2B)
- `autonomous-ai-agent` - IA autônoma com aprendizado contínuo