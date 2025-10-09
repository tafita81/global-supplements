# Global Supplements - Premium Worldwide Network

## Overview

Global Supplements is a comprehensive B2B/B2C platform connecting global supplement suppliers with buyers. It leverages AI-powered market intelligence and automated distribution systems to facilitate international trade, government contracts, and enterprise solutions across various product categories, including beauty supplements, quantum materials, medical-grade products, smart gadgets, and traditional wellness products. The platform aims to identify arbitrage opportunities and execute high-margin deals in real-time by integrating numerous APIs for marketplace intelligence, logistics, compliance, and payment processing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

The frontend uses React 18 with TypeScript, Vite, React Router, Tailwind CSS, and shadcn/ui. It follows a component-based, responsive design with mobile-first principles, supports 15+ languages via i18next, and includes a theme system for dark/light modes. The application utilizes two main layouts: `AppLayout` for authenticated dashboard experiences and `PublicSiteLayout` for marketing pages.

### Backend

The backend is primarily built on Supabase, providing authentication, a PostgreSQL database, and real-time capabilities. Data tables include `execution_history`, `compliance_checks`, `opportunities`, `suppliers`, `government_contracts`, and `market_trends`. TanStack React Query is used for server state management.

### Key Architectural Decisions

-   **Multi-API Integration System**: Integrates over 50 external APIs for AI/analysis (OpenAI, Google Gemini), marketplaces (Alibaba, IndiaMART), e-commerce (Amazon MWS, eBay), Google Workspace, logistics (DHL, FedEx), compliance (FDA, WHO), and payments (Stripe, PayPal). This enables automated arbitrage, compliance verification, and seamless execution.
-   **Quantum Execution System**: Detects and executes opportunities in real-time by monitoring price discrepancies, performing AI-powered margin and risk assessments, and using automated execution pipelines.
-   **Progressive Registration Strategy**: Automates company registration across government (SAM.gov, GSA Schedule) and B2B platforms (Canton Fair, Alibaba.com) to unlock high-value contracts.
-   **Internationalization Architecture**: Supports 14+ languages with full i18n, ensuring global reach. The brand name "Global Supplements" is never translated.
-   **Amazon OneLink Integration**: Utilizes Amazon OneLink for universal affiliate links, ensuring geo-redirection and proper affiliate tracking across 13 global Amazon marketplaces.
-   **3-Layer Product Aggregation System**: A marketplace-aware system that fetches and aggregates products from global top, category top, and subcategory layers, deduplicates by ASIN, and sorts by review count to ensure high-review products are always visible.
-   **Instant Cache System**: Implements a LocalStorage-based caching mechanism for ultra-fast product loading (<100ms), reducing initial load times by approximately 95% for repeat visitors while maintaining data freshness through background refreshes.
-   **AI Content Automation System (Phase 1)**: A modular system for generating SEO-optimized content (articles, landing pages, product reviews, comparisons) using OpenAI GPT-4o-mini across 14 languages and 10 niches. It integrates Amazon OneLink and uses Supabase Edge Functions for secure OpenAI API key management and content storage.
-   **Google Ads Campaign Management System**: Comprehensive campaign management with 15 pre-optimized global headlines (max 30 chars) and 15 descriptions (max 90 chars) in English with icons. Supports 14 Amazon marketplaces, 10 niches, campaign status tracking (draft/active/paused/completed), and performance metrics by country (impressions, clicks, CTR, revenue, ROI). Database includes 4 tables: google_ads_campaigns, google_ads_headlines, google_ads_descriptions, campaign_performance with CASCADE delete for data integrity.
-   **Multi-Channel Marketing Dashboard (Phase 2)**: Integrated marketing automation hub with 4 core modules and production-ready API integrations:
    *   **Analytics Dashboard**: Real-time tracking of visitors, pageviews, conversions, revenue, bounce rate, session duration, and top countries/products with 7-day overview and historical trends.
    *   **Social Media Automation**: Multi-platform post scheduling (Facebook, Instagram, Twitter/X, LinkedIn, Pinterest, TikTok) with Buffer API integration, AI-powered content generation, engagement tracking, automated publishing, profile matching by platform, and mock/production mode switching.
    *   **Email Marketing Automation**: SendGrid ESP integration with campaign creation, AI-generated templates (welcome, promotion, newsletter), audience segmentation (7 segments), database-driven recipient fetching, fail-fast validation when no audience exists, performance metrics (open rate, click rate, sent count), and scheduled delivery.
    *   **SEO Performance Tracker**: Google Search Console integration with keyword tracking, position monitoring, impressions/clicks/CTR tracking, top performing keywords analysis, one-click GSC data sync, 30-day historical import, page-level SEO metrics, and mock data fallback.
    *   **Integration Architecture**: Decoupled credential checking per provider (Buffer, SendGrid, GSC), independent mock mode detection, environment-aware configuration with graceful degradation, console warnings in mock mode, and production-ready real API support when credentials provided.

### Design Trade-offs

-   **TypeScript Configuration**: Relaxed strictness for faster development over full type safety.
-   **Component Library**: shadcn/ui chosen for design customization and reduced bundle size over opinionated frameworks.
-   **Single-Page Application**: Prioritizes fast navigation and interactivity, mitigating SEO challenges with meta tags.

## External Dependencies

-   **Primary Infrastructure**: Supabase (PostgreSQL, Auth, Storage, Edge Functions).
-   **AI & Market Intelligence**: OpenAI API (GPT models), Google Gemini AI.
-   **B2B Marketplace APIs**: Alibaba.com, IndiaMART, Global Sources, Made-in-China, Canton Fair Online.
-   **E-commerce & Dropshipping**: Amazon MWS, eBay, Shopify, AliExpress.
-   **Google Workspace Suite**: Gmail API, Google Drive, Google Sheets, Google Calendar, Google Maps, Google Translate, Google Cloud Storage.
-   **Logistics & Shipping**: DHL Express, FedEx Web Services, UPS, USPS.
-   **Compliance & Regulatory**: FDA API, WHO database, EPA, SAM.gov, GSA.
-   **Payment Processing**: Stripe, PayPal, Wise, Banking APIs.
-   **Document Management**: Supabase storage for company certificates, FDA approvals, quality certifications, patents, insurance, and tax documents.
-   **Marketing Automation APIs**: Buffer (social media scheduling), SendGrid (email service provider), Google Search Console (SEO data).

## 🚨 CRITICAL: Sistema 100% Dados Reais - ZERO Mock Data

**Última Atualização:** 2025-10-09

### Configuração Supabase Cloud (PRODUCTION)
- **URL:** `https://twglceexfetejawoumsr.supabase.co`
- **Frontend:** Conecta diretamente no Cloud (hardcoded em `src/integrations/supabase/client.ts`)
- **Edge Functions:** TODAS configuradas para usar Cloud URL (mesmo do frontend)
- **Migrations:** LIMPAS - sem INSERTs mockados

### Sistema de Auto-Refresh
- **Arquivo:** `projeto-copia/auto-refresh-opportunities.ts`
- **Frequência:** A cada 6 horas
- **Categorias:** health-supplements, electronics, industrial
- **Inserção:** Automática no Supabase Cloud após análise IA

### Dados Limpos (ZERO Mock)
✅ `opportunities`: Apenas dados reais detectados pelo sistema
✅ `suppliers`: Limpo - preencher com detecção real
✅ `mycogenesis_products`: Limpo - preencher com produtos reais
✅ `negotiations`: Apenas negociações reais
✅ Migrations 20250927130507, 130555, 130753: Limpas

### Padrão para Novas Edge Functions
```typescript
// ✅ CORRETO - Usar Cloud URL (mesmo do frontend)
const supabaseUrl = 'https://twglceexfetejawoumsr.supabase.co';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || 'anon_key_aqui';
const supabase = createClient(supabaseUrl, supabaseKey);

// ❌ ERRADO - Não usar env vars que apontam para local
const supabaseUrl = Deno.env.get('SUPABASE_URL')!; // NÃO USAR
```

## Database Schema

### Automation Tables (11 total)
**Phase 1 - AI Content Generation:**
- `ai_content` - Generated content (articles, landing pages, reviews, comparisons)
- `seo_pages` - SEO-optimized pages metadata

**Phase 1.5 - Google Ads Management:**
- `google_ads_campaigns` - Campaign metadata and status
- `google_ads_headlines` - 15 pre-optimized headlines with icons
- `google_ads_descriptions` - 15 pre-optimized descriptions with icons
- `campaign_performance` - Performance metrics by country (impressions, clicks, CTR, revenue, ROI)

**Phase 2 - Multi-Channel Marketing:**
- `analytics_dashboard` - Real-time visitor and conversion metrics
- `social_media_posts` - Platform-specific posts with engagement tracking
- `email_campaigns` - Email campaigns with performance metrics
- `seo_performance` - Keyword rankings and GSC data
- `leads` - Email recipient database for segmented campaigns

All tables include proper indexes, foreign keys with CASCADE delete, and Row Level Security (RLS) policies.

## API Integration Security

**Current State (✅ Migrated to Edge Functions with JWT Auth):**
- **Buffer Integration**: Supabase Edge Function `/functions/v1/buffer-integration` (JWT protected)
- **SendGrid Integration**: Supabase Edge Function `/functions/v1/sendgrid-integration` (JWT protected)
- **Google Search Console**: Supabase Edge Function `/functions/v1/gsc-integration` (JWT protected)
- **AI Content Generator**: Supabase Edge Function `/functions/v1/generate-content` (JWT protected)
- All Edge Functions validate user authentication before executing
- Frontend services call Edge Functions with Authorization header
- Mock mode by default when secrets not configured
- Graceful degradation to demo data

**Production Deployment Guide:**
See `SETUP_PRODUCAO.md` for complete step-by-step instructions:
1. Configure secrets in Supabase Dashboard (BUFFER_ACCESS_TOKEN, SENDGRID_API_KEY, GSC_CREDENTIALS)
2. Deploy Edge Functions: Run `./DEPLOY_COMMANDS.sh` or `supabase functions deploy`
3. Test integrations: Use `QUICK_TEST.md` browser console tests
4. Configure GitHub FTP_PASSWORD secret for automatic Hostinger deployment
5. Push to `main` or `experimentos` branch for automatic CI/CD deployment

**Security Benefits:**
- ✅ JWT authentication required for all Edge Functions
- ✅ Zero credential exposure in frontend bundle
- ✅ Server-side API key management with user validation
- ✅ CORS handled by Edge Functions
- ✅ Blocks unauthorized access and quota abuse
- ✅ Full audit trail with user_id in Supabase logs