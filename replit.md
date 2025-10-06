# Global Supplements - Premium Worldwide Network

## Overview

Global Supplements is a comprehensive B2B/B2C platform connecting global supplement suppliers with buyers, leveraging AI-powered market intelligence and automated distribution systems. The platform facilitates international trade, government contracts, and enterprise solutions across beauty supplements, quantum materials, medical-grade products, smart gadgets, and traditional wellness products.

The system integrates multiple APIs for marketplace intelligence, logistics, compliance verification, and payment processing to enable automated arbitrage opportunities and real-time execution of high-margin deals.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type safety
- Vite as the build tool and development server
- React Router for client-side routing with multiple layouts (AppLayout for dashboard, PublicSiteLayout for marketing pages)
- Tailwind CSS for styling with custom design system
- shadcn/ui component library built on Radix UI primitives

**Design Patterns:**
- Component-based architecture with clear separation between UI components, pages, and business logic
- Responsive layouts with mobile-first approach using custom ResponsiveLayout components
- Internationalization (i18n) support with 15+ languages using i18next
- Custom hooks for business logic (useQuantumPersistence, useIsMobile, use-toast)
- Theme system supporting dark/light modes via next-themes

**Routing Strategy:**
The application uses two distinct layouts:
1. **AppLayout** - Authenticated dashboard experience with sidebar navigation
2. **PublicSiteLayout** - Marketing and public-facing pages with header/footer

Key routes include dashboard, opportunities, suppliers, AI system, compliance, market intelligence, execution hubs, and product category pages.

### Backend Architecture

**Primary Backend Service:**
- Supabase for backend-as-a-service providing authentication, database, and real-time capabilities
- RESTful API integration layer in `@/integrations/supabase/client`

**Data Layer:**
- Supabase PostgreSQL database (schema not visible but referenced throughout)
- Tables include: execution_history, compliance_checks, opportunities, suppliers, government_contracts, market_trends
- Real-time subscriptions for live updates on executions and metrics

**State Management:**
- TanStack React Query (v5) for server state management, caching, and data synchronization
- Local React state for UI interactions
- Custom persistence hooks for quantum execution tracking

### Key Architectural Decisions

**Multi-API Integration System:**
The platform integrates 50+ external APIs across categories:
- **AI/Analysis**: OpenAI GPT, Google Gemini for market intelligence and opportunity analysis
- **Marketplaces**: Alibaba, IndiaMART, Global Sources, AliExpress for supplier discovery
- **E-commerce**: Amazon MWS, eBay, Shopify for B2C channels
- **Google Workspace**: Gmail, Drive, Sheets, Calendar, Maps for workflow automation
- **Logistics**: DHL, FedEx, UPS for shipping calculations
- **Compliance**: FDA, WHO, EPA for regulatory checks
- **Payments**: Stripe, PayPal, Wise for transaction processing

**Rationale**: Centralized API management enables automated arbitrage detection, compliance verification, and seamless execution across global markets.

**Quantum Execution System:**
The platform implements a "quantum" approach to opportunity detection and execution:
- Real-time monitoring of price discrepancies across platforms
- AI-powered margin calculation and risk assessment
- Automated execution pipelines with status tracking
- Persistent storage of execution history for analytics

**Rationale**: Eliminates manual research and enables zero-investment arbitrage through automated supplier-buyer matching with real-time margin optimization.

**Progressive Registration Strategy:**
Automated company registration across government and B2B platforms:
- SAM.gov for US government contracts
- GSA Schedule for federal purchasing
- Canton Fair for Asian suppliers
- Alibaba.com for global B2B trade

**Rationale**: Establishes credibility and unlocks high-value contract opportunities without manual paperwork.

**Internationalization Architecture:**
Full i18n support with browser language detection:
- 15 language files covering major markets (EN, ES, PT, FR, DE, IT, JA, KO, ZH, AR, HI, MS, NL, SV)
- Context-based translation provider wrapping the application
- Fallback to English for missing translations

**Rationale**: Enables global reach for both supplier and buyer sides of the marketplace.

**3-Layer Product Aggregation System:**
Marketplace-aware product discovery architecture ensuring high-review products always surface:
- **Layer 0 - Global Top Products**: Fetches TOP 40 most popular products across all categories, filtered for current marketplace (stores `{marketplaceId, domain, products}`)
- **Layer 1 - Category Top Products**: Fetches TOP 40 products specific to the selected category
- **Layer 2 - Subcategory Products**: Fetches 20 products from each of 5 subcategories with specialized search queries
- **Deduplication**: ASIN-based duplicate removal across all layers
- **Sorting**: Final products sorted by review count (descending), top 40 displayed

**Technical Safeguards:**
- Triple protection against stale data: cache cleared on marketplace change, double verification (marketplaceId + domain), request ID prevents race conditions
- Request ID system prevents older API responses from overwriting newer ones when user switches marketplaces rapidly
- Marketplace change triggers automatic re-fetch and re-aggregation with fresh data
- Deterministic filtering with category/subcategory-specific forbidden keywords, beauty supplement exceptions (hair/skin/nail products)

**Rationale**: Guarantees that products with 100K+ reviews (e.g., Biotin 109K, DIM 32K) always appear in appropriate categories, regardless of API response timing or marketplace switches. The 3-layer approach ensures both popularity and diversity in product listings while maintaining perfect marketplace consistency.

### Design Trade-offs

**TypeScript Configuration:**
- Relaxed strictness settings (`strict: false`, `noImplicitAny: false`)
- **Trade-off**: Faster development velocity but reduced type safety guarantees
- **Alternative considered**: Full strict mode would catch more errors but slow initial development

**Component Library Choice:**
- shadcn/ui over Material-UI or Ant Design
- **Pros**: Unstyled primitives allow full design customization, copy-paste architecture reduces bundle size
- **Cons**: More initial setup required compared to opinionated frameworks

**Single-Page Application:**
- Client-side routing rather than server-side rendering
- **Pros**: Fast navigation, rich interactivity, simplified deployment
- **Cons**: Larger initial bundle, SEO challenges (mitigated by meta tags)

## External Dependencies

### Primary Infrastructure

**Supabase** (Backend-as-a-Service)
- PostgreSQL database with real-time subscriptions
- Authentication and authorization
- File storage for documents
- Edge functions for serverless operations

### AI & Market Intelligence

**OpenAI API** (Required)
- GPT models for opportunity analysis
- Business intelligence and market trend prediction
- Automated content generation

**Google Gemini AI** (Optional)
- Translation services
- Additional market analysis capabilities

### B2B Marketplace APIs

**Critical Integrations:**
- Alibaba.com API (access key + secret key)
- IndiaMART API
- Global Sources API
- Made-in-China API
- Canton Fair Online platform

### E-commerce & Dropshipping

- Amazon MWS (access + secret keys)
- eBay App ID
- Shopify API
- AliExpress API (key + secret)

### Google Workspace Suite

Full integration with Google services:
- Gmail API for automated communications
- Google Drive for document management
- Google Sheets for data export/import
- Google Calendar for scheduling
- Google Maps for logistics
- Google Translate for internationalization
- Google Cloud Storage for file management

### Logistics & Shipping

- DHL Express API
- FedEx Web Services
- UPS API
- USPS Web Tools
- Major freight forwarders

### Compliance & Regulatory

- FDA API for product verification
- WHO database integration
- EPA compliance checking
- Government contract databases (SAM.gov, GSA)

### Payment Processing

- Stripe for card payments
- PayPal for international transactions
- Wise (TransferWide) for currency exchange
- Banking APIs for wire transfers

### Additional Services

- Lovable platform for development (referenced in README)
- Email service providers for campaigns
- SMS/WhatsApp for notifications
- Analytics platforms for tracking

### Document Management

The system handles multiple document types:
- Company incorporation certificates
- FDA approvals
- Quality certifications (GMP, ISO)
- Product patents
- Insurance documents
- Tax documentation

All documents are stored in Supabase storage with metadata tracking for automated platform registrations.