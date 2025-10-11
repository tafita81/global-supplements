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