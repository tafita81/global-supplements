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