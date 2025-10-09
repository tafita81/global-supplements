# 🤖 Global Supplements - Automation System Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [Phase 1: AI Content Generation](#phase-1-ai-content-generation)
3. [Phase 2: Multi-Channel Marketing](#phase-2-multi-channel-marketing)
4. [Database Structure](#database-structure)
5. [How to Use](#how-to-use)
6. [API Integration](#api-integration)

---

## 🎯 Overview

Complete automation system for Global Supplements with AI-powered content generation, multi-channel marketing distribution, and comprehensive analytics tracking across 14 countries and 10 niches.

### System Architecture

```
src/automation/
├── types/
│   ├── content.ts          # AI content types
│   ├── campaigns.ts        # Google Ads types + global headlines/descriptions
│   └── analytics.ts        # Marketing & SEO types
├── services/
│   ├── contentGeneratorSecure.ts    # Secure AI content (Edge Function)
│   ├── supabaseContent.ts           # Content database ops
│   ├── campaignsService.ts          # Google Ads campaigns
│   ├── analyticsService.ts          # Analytics tracking
│   ├── socialMediaService.ts        # Social media automation
│   ├── emailService.ts              # Email marketing
│   └── seoService.ts                # SEO performance
└── components/
    ├── ContentGenerator.tsx         # AI content UI
    ├── GoogleAdsCampaigns.tsx       # Ads campaigns UI
    ├── AnalyticsDashboard.tsx       # Analytics UI
    ├── SocialMediaManager.tsx       # Social media UI
    ├── EmailCampaignManager.tsx     # Email UI
    └── SEOPerformanceTracker.tsx    # SEO UI
```

---

## 🚀 Phase 1: AI Content Generation

### Features
- **4 Content Types**: Articles, Landing Pages, Product Reviews, Comparisons
- **14 Languages**: EN, ES, FR, DE, IT, PT, JA, ZH, AR, RU, KO, NL, SV, PL
- **14 Countries**: US, UK, DE, FR, IT, ES, CA, AU, JP, NL, SE, SG, PL, BR
- **10 Niches**: Beauty, Skincare, Fitness, Wellness, Vitamins, Collagen, Biotin, Hair-care, Anti-aging, Weight-loss
- **Security**: Supabase Edge Functions (no exposed API keys)
- **SEO Score**: Automatic 0-100 scoring
- **Amazon OneLink**: Integrated affiliate links

### How to Use
1. Navigate to `/ai-content-generator`
2. Select niche, country, content type, language
3. Add keywords (optional)
4. Click "Generate Content"
5. Review SEO score and content
6. Save to database

### Database Tables
- `ai_content`: Generated content with metadata
- `seo_pages`: SEO landing pages
- `leads`: Lead capture data

---

## 📊 Phase 1.5: Google Ads Campaigns

### Features
- **15 Global Headlines** (max 30 chars) with icons
- **15 Global Descriptions** (max 90 chars) with icons
- **14 Marketplaces**: US, CA, UK, DE, FR, IT, ES, JP, AU, NL, SE, SG, PL, BR
- **Campaign Management**: Draft, Active, Paused, Completed
- **Performance Tracking**: Impressions, Clicks, CTR, Revenue, ROI

### Global Headlines (English)
```
🌎 Top Products in 20+ Countries
🛍️ Amazon Choice Global Picks
🔗 Smart Links by Region
💰 Shop Local, Earn Global
🌐 Top Reviews Worldwide
🚚 Fast Delivery Anywhere
🧠 Smart Amazon Selections
🏪 One Link, Local Store
🌍 Best-Sellers Around World
🥇 Top 5 Amazon by Country
💊 Supplements with Reviews
💅 Skincare Global Favorites
🧘 Wellness with Global Reach
🏋️ Fitness for Every Continent
🗣️ Right Choice Any Language
```

### How to Use
1. Navigate to `/google-ads-campaigns`
2. Create campaign: name, country, niche, budget
3. Select multiple headlines (checkboxes)
4. Select multiple descriptions (checkboxes)
5. Create and activate campaign
6. View performance metrics

### Database Tables
- `google_ads_campaigns`: Campaign configuration
- `google_ads_headlines`: Headline library
- `google_ads_descriptions`: Description library
- `campaign_performance`: Performance metrics by country/date

---

## 📈 Phase 2: Multi-Channel Marketing

### 1. Analytics Dashboard

**Route**: `/marketing-dashboard` (tab: Analytics)

**Features**:
- Total visitors, pageviews, conversions, revenue
- 7-day overview with trends
- Conversion rate calculation
- Top countries by visitors
- Top products by sales
- Bounce rate and session duration

**How to Use**:
1. View real-time metrics in cards
2. Analyze top countries performance
3. Track conversion rates
4. Monitor revenue trends

**Database**: `analytics_dashboard`

---

### 2. Social Media Automation

**Route**: `/marketing-dashboard` (tab: Social Media)

**Platforms**:
- 📘 Facebook
- 📸 Instagram
- 🐦 Twitter/X
- 💼 LinkedIn
- 📌 Pinterest
- 🎵 TikTok

**Features**:
- AI content generation by niche/country
- Post scheduling
- Draft, Scheduled, Published status
- Engagement tracking (likes, shares, comments, reach)
- Multi-platform management

**How to Use**:
1. Select platform
2. Generate AI content or write manually
3. Set schedule date (optional)
4. Save as draft or schedule
5. Publish when ready

**Database**: `social_media_posts`

---

### 3. Email Marketing Automation

**Route**: `/marketing-dashboard` (tab: Email)

**Templates**:
- Welcome emails
- Promotional campaigns
- Newsletters

**Segments**:
- All subscribers
- New customers
- Returning customers
- High value
- Inactive users
- By country
- By niche

**Features**:
- AI template generation
- HTML email content
- Campaign scheduling
- Performance metrics (open rate, click rate, sent count)
- Audience segmentation

**How to Use**:
1. Create campaign with name
2. Select target segment
3. Generate AI template or write custom
4. Add subject line
5. Create and send

**Database**: `email_campaigns`

---

### 4. SEO Performance Tracker

**Route**: `/marketing-dashboard` (tab: SEO)

**Features**:
- Keyword position tracking
- Impressions and clicks monitoring
- CTR calculation
- Top 20 performing keywords
- Google Search Console integration ready
- Page-level SEO metrics

**How to Use**:
1. Enter page URL
2. Enter target keyword
3. Start tracking
4. View top performing keywords
5. Monitor position changes

**Database**: `seo_performance`

---

## 🗄️ Database Structure

### Phase 1 Tables (3)
1. **ai_content**: AI-generated content
   - id, content_type, niche, country, language, title, content, seo_score, keywords, amazon_onelink

2. **seo_pages**: SEO landing pages
   - id, url, niche, country, content, meta_tags

3. **leads**: Lead capture
   - id, email, country, niche, source

### Phase 1.5 Tables (4)
4. **google_ads_campaigns**: Campaign configuration
   - id, name, country, niche, status, budget

5. **google_ads_headlines**: Headlines library
   - id, campaign_id, text, icon, language, performance_score

6. **google_ads_descriptions**: Descriptions library
   - id, campaign_id, text, icon, language, performance_score

7. **campaign_performance**: Performance metrics
   - id, campaign_id, country, impressions, clicks, conversions, cost, revenue, date

### Phase 2 Tables (4)
8. **analytics_dashboard**: Daily analytics
   - id, date, total_visitors, total_pageviews, total_conversions, total_revenue, avg_session_duration, bounce_rate, top_countries, top_products

9. **social_media_posts**: Social posts
   - id, platform, content, media_url, scheduled_date, status, engagement_data, published_at

10. **email_campaigns**: Email campaigns
    - id, name, subject, content, segment, status, sent_count, open_rate, click_rate, scheduled_date

11. **seo_performance**: SEO tracking
    - id, page_url, keyword, position, impressions, clicks, ctr, date

**Total**: 11 tables with full indexes and RLS policies

---

## 🔐 Security & Configuration

### Supabase Edge Function
- **Function**: `generate-content`
- **Location**: `supabase/functions/generate-content/index.ts`
- **Environment**: Set `OPENAI_API_KEY` in Supabase Edge Functions settings
- **Usage**: Called by `contentGeneratorSecure.ts`

### API Keys Required
1. **OpenAI API Key**: For AI content generation (stored in Supabase Edge Functions)
2. **Amazon OneLink ID**: For affiliate tracking (configured in frontend)
3. **Google Ads API** (optional): For campaign sync
4. **Google Search Console API** (optional): For SEO data import

---

## 📍 Routes Summary

| Route | Description | Component |
|-------|-------------|-----------|
| `/ai-content-generator` | AI Content Generation | AIContentGenerator |
| `/google-ads-campaigns` | Google Ads Management | GoogleAdsCampaigns |
| `/marketing-dashboard` | Multi-Channel Marketing Hub | MarketingDashboard |
| `/marketing-dashboard?tab=analytics` | Analytics Dashboard | AnalyticsDashboard |
| `/marketing-dashboard?tab=social` | Social Media Manager | SocialMediaManager |
| `/marketing-dashboard?tab=email` | Email Campaigns | EmailCampaignManager |
| `/marketing-dashboard?tab=seo` | SEO Performance | SEOPerformanceTracker |

---

## 🎯 Future Phases (Roadmap)

### Phase 3: B2B Commerce Automation
- Alibaba API integration
- Amazon Business API
- Web scraping best-sellers
- Automated dropshipping
- Supplier management

### Phase 4: Autonomous AI Agents
- Self-optimizing campaigns
- Automated negotiation
- ML-powered predictions
- Revenue optimization
- Real-time arbitrage

---

## 📊 Performance Metrics

### Build Stats
- **TypeScript Files**: 17 automation files
- **Database Tables**: 11 tables
- **Supported Languages**: 14
- **Supported Countries**: 14
- **Bundle Size**: ~2.96MB (optimized)
- **Build Time**: ~31s

### Coverage
- **Content Types**: 4
- **Social Platforms**: 6
- **Email Segments**: 7
- **Google Ads Headlines**: 15
- **Google Ads Descriptions**: 15

---

## 🚀 Quick Start

1. **Setup Environment**:
   ```bash
   # Add OPENAI_API_KEY to Supabase Edge Functions
   ```

2. **Access Features**:
   - AI Content: `/ai-content-generator`
   - Google Ads: `/google-ads-campaigns`
   - Marketing: `/marketing-dashboard`

3. **First Campaign**:
   - Generate content
   - Create Google Ads campaign
   - Schedule social posts
   - Set up email campaign
   - Track SEO keywords

---

## 📝 Notes

- All services use Supabase for database operations
- AI content generation is secure (Edge Functions)
- Google Ads headlines/descriptions are pre-optimized
- Social media content can be AI-generated
- Email templates are AI-generated
- SEO tracking supports GSC bulk import
- All tables have RLS policies enabled
- Foreign keys use CASCADE delete

---

**Version**: 2.0  
**Last Updated**: October 2025  
**Author**: Global Supplements Development Team
