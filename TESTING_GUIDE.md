# Global Supplements - Complete Testing Guide

## 🎯 Testing Overview

This guide provides step-by-step instructions to test all features of Global Supplements in the correct order. Follow each section sequentially for best results.

---

## ✅ Pre-Testing Checklist

Before starting tests, verify:
- [x] Frontend is running on port 5000 (workflow: Server)
- [x] Database is connected (Supabase)
- [x] All 11 automation tables are created
- [x] Build completed successfully

---

## 📋 Phase 1: AI Content Generation System

### Test 1.1: Access Content Generator
1. Navigate to `/automation/content-generator`
2. ✓ Verify page loads with 4 content type cards
3. ✓ Check language selector shows 14 languages
4. ✓ Check niche selector shows 10 niches

### Test 1.2: Generate AI Content (Mock Mode)
**Note:** OpenAI integration uses Supabase Edge Functions with secure API key storage

1. Select content type: "SEO Article"
2. Choose language: "English (en)"
3. Choose niche: "Beauty & Anti-Aging"
4. Click "Generate Content"
5. ✓ Verify loading state appears
6. ✓ Verify content generates successfully
7. ✓ Check content is saved to database (ai_content table)
8. ✓ Verify Amazon OneLink integration in content

### Test 1.3: Test All Content Types
Repeat Test 1.2 for:
- Landing Page
- Product Review
- Product Comparison

### Test 1.4: Multi-Language Test
Generate content in:
- Portuguese (pt)
- Spanish (es)
- French (fr)
- German (de)

✓ Verify content is properly translated in each language

---

## 📋 Phase 1.5: Google Ads Campaign Management

### Test 2.1: Access Ads Manager
1. Navigate to `/automation/google-ads`
2. ✓ Verify page loads with campaign creation form
3. ✓ Check 15 headline options visible with icons
4. ✓ Check 15 description options visible with icons

### Test 2.2: Create Campaign
1. Enter campaign name: "Beauty Supplements US Q4"
2. Select country: "United States (amazon.com)"
3. Select niche: "Beauty & Anti-Aging"
4. Select 3-5 headlines from the 15 options
5. Select 2-4 descriptions from the 15 options
6. Set budget: $1000
7. Set start date: today
8. Click "Create Campaign"
9. ✓ Verify campaign appears in list
10. ✓ Verify status is "draft"

### Test 2.3: Campaign Management
1. Click "Activate" on draft campaign
2. ✓ Verify status changes to "active"
3. Click "Pause" button
4. ✓ Verify status changes to "paused"
5. Click "Resume" button
6. ✓ Verify status changes to "active"

### Test 2.4: Performance Metrics (Mock Data)
1. View active campaign
2. ✓ Verify impressions count is visible
3. ✓ Verify clicks count is visible
4. ✓ Verify CTR percentage is calculated
5. ✓ Verify revenue is displayed
6. ✓ Verify ROI is calculated

### Test 2.5: Multi-Country Test
Create campaigns for:
- United Kingdom (amazon.co.uk)
- Germany (amazon.de)
- Japan (amazon.co.jp)

✓ Verify each country's marketplace is correctly linked

---

## 📋 Phase 2: Multi-Channel Marketing Dashboard

### Test 3.1: Access Marketing Dashboard
1. Navigate to `/automation/marketing`
2. ✓ Verify 4 tabs are visible:
   - Analytics
   - Social Media
   - Email Campaigns
   - SEO Performance

---

## 📋 Test 3.2: Analytics Dashboard

### Analytics Overview
1. Click "Analytics" tab
2. ✓ Verify 6 metric cards display:
   - Total Visitors
   - Page Views
   - Conversions
   - Revenue
   - Bounce Rate
   - Avg. Session Duration

### Charts & Data
3. ✓ Verify "Last 7 Days Overview" chart is visible
4. ✓ Verify "Top Countries" list appears
5. ✓ Verify "Top Products" list appears

### Mock Data Verification
6. ✓ Check if realistic numbers are displayed
7. ✓ Verify chart has multiple data points
8. ✓ Verify top countries show flags and percentages

---

## 📋 Test 3.3: Social Media Automation

### Test 3.3.1: Create Social Post (Mock Mode)
**Note:** Buffer integration runs in mock mode without credentials

1. Click "Social Media" tab
2. Click "Create Post" button
3. Select platform: "Facebook"
4. Enter content: "Check out our latest beauty supplements! 💄✨"
5. Set scheduled date: tomorrow
6. Click "Create Post"
7. ✓ Verify post appears in list
8. ✓ Verify status is "scheduled"

### Test 3.3.2: AI Content Generation
1. Click "Generate with AI" button
2. Select platform: "Instagram"
3. Select tone: "Professional"
4. Enter topic: "Anti-aging supplements"
5. Click "Generate"
6. ✓ Verify AI-generated content appears
7. ✓ Verify content includes relevant hashtags
8. Click "Use This Content"
9. ✓ Verify content is populated in form

### Test 3.3.3: Multi-Platform Publishing
Create posts for all 6 platforms:
- Facebook
- Instagram
- Twitter/X
- LinkedIn
- Pinterest
- TikTok

✓ Verify each platform post is created successfully

### Test 3.3.4: Publish Post (Mock Mode)
1. Select a scheduled post
2. Click "Publish Now"
3. ✓ Verify console shows: "[MOCK MODE] Buffer API - would create post"
4. ✓ Verify status changes to "published"
5. ✓ Verify engagement_data includes buffer_profile_id
6. ✓ Verify mock_mode flag is set to true

### Test 3.3.5: Engagement Tracking
1. View published posts
2. ✓ Verify likes count is visible
3. ✓ Verify comments count is visible
4. ✓ Verify shares count is visible
5. ✓ Verify click count is visible

---

## 📋 Test 3.4: Email Marketing Automation

### Test 3.4.1: Create Email Campaign (Mock Mode)
**Note:** SendGrid integration runs in mock mode without credentials

1. Click "Email Campaigns" tab
2. Click "Create Campaign" button
3. Enter name: "Welcome Series - Beauty"
4. Select template: "Welcome Email"
5. Select segment: "New Subscribers"
6. Enter subject: "Welcome to Global Supplements! 🌟"
7. ✓ Verify AI-generated content appears in editor
8. Click "Create Campaign"
9. ✓ Verify campaign appears in list
10. ✓ Verify status is "draft"

### Test 3.4.2: Test All Templates
Create campaigns with each template:
- Welcome Email
- Promotional Email
- Newsletter

✓ Verify AI generates appropriate content for each type

### Test 3.4.3: Test All Segments
Create campaigns for each segment:
- New Subscribers
- Active Customers
- VIP Customers
- Inactive Users
- Cart Abandoners
- Product Interests
- All Subscribers

✓ Verify segment selection works correctly

### Test 3.4.4: Send Campaign (Mock Mode)
1. Select draft campaign
2. Click "Send Now"
3. ✓ Verify console shows: "[MOCK MODE] SendGrid - would send email"
4. ✓ Verify status changes to "sent"
5. ✓ Verify sent_count is 100 (mock recipients)
6. ✓ Verify open_rate is between 10-50%
7. ✓ Verify click_rate is between 5-20%

### Test 3.4.5: Database Integration
**Note:** Tests recipient fetching from database

1. Check if `leads` table exists in database
2. If empty, SendGrid will use mock recipients
3. If populated, SendGrid will use real email addresses
4. ✓ Verify appropriate recipient source is used

### Test 3.4.6: Production Safety Check
1. Attempt to send with empty audience (no leads in DB)
2. With SendGrid in production mode (credentials set):
   - ✓ Should throw error: "No recipients found for segment"
   - ✓ Should prevent sending to mock emails
3. With SendGrid in mock mode:
   - ✓ Should fall back to demo recipients
   - ✓ Console shows: "[MOCK MODE] using mock recipients for demo"

---

## 📋 Test 3.5: SEO Performance Tracker

### Test 3.5.1: View SEO Dashboard (Mock Mode)
**Note:** Google Search Console integration runs in mock mode without credentials

1. Click "SEO Performance" tab
2. ✓ Verify keyword tracking table is visible
3. ✓ Verify columns: Keyword, Position, Impressions, Clicks, CTR
4. ✓ Verify mock data is displayed (if GSC not connected)

### Test 3.5.2: GSC Sync UI
1. Click "Sync GSC Data" button
2. ✓ Verify loading state appears
3. If GSC credentials NOT set:
   - ✓ Console shows: "[MOCK MODE] GSC API not configured - generating mock data"
   - ✓ Mock keywords appear (beauty supplements, anti-aging, etc.)
   - ✓ Positions are between 1-50
4. If GSC credentials ARE set:
   - ✓ Real Search Console data imports
   - ✓ Last 30 days of history fetched
   - ✓ Data saved to seo_performance table

### Test 3.5.3: Keyword Analysis
1. Review imported keywords
2. ✓ Verify position trends are visible
3. ✓ Verify impressions are realistic
4. ✓ Verify clicks are realistic
5. ✓ Verify CTR is calculated correctly

### Test 3.5.4: Top Performing Keywords
1. Sort by position (ascending)
2. ✓ Verify top 10 keywords are highlighted
3. Sort by clicks (descending)
4. ✓ Verify highest traffic keywords appear first

---

## 📋 Integration Testing - API Modes

### Test 4.1: Mock Mode Verification
**Default state without credentials**

1. Open browser console (F12)
2. Navigate through all automation features
3. ✓ Verify console shows mock mode warnings:
   - "[MOCK MODE] Buffer API - would create post"
   - "[MOCK MODE] SendGrid - would send email"
   - "[MOCK MODE] GSC API not configured - generating mock data"

### Test 4.2: Production Mode Setup (Future)
**When credentials are available**

Buffer Integration:
1. Set environment variable: `BUFFER_ACCESS_TOKEN=your_token`
2. Restart application
3. Create social post
4. ✓ Verify real Buffer API call is made
5. ✓ Verify actual profile IDs are used (not "_mock" suffix)
6. ✓ Console no longer shows "[MOCK MODE]"

SendGrid Integration:
1. Set environment variable: `SENDGRID_API_KEY=your_key`
2. Create email campaign
3. Add real leads to `leads` table in database
4. Send campaign
5. ✓ Verify real recipients from database are used
6. ✓ Verify SendGrid API receives request
7. ✓ Verify actual delivery metrics are tracked

Google Search Console Integration:
1. Set environment variable: `GSC_CREDENTIALS=your_oauth_json`
2. Click "Sync GSC Data"
3. ✓ Verify real Search Console data is imported
4. ✓ Verify last 30 days of keyword data
5. ✓ Verify actual position/impression/click counts

---

## 📋 Database Verification

### Test 5.1: Verify All Tables Exist
Run this SQL in Supabase:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'ai_content',
  'seo_pages',
  'google_ads_campaigns',
  'google_ads_headlines',
  'google_ads_descriptions',
  'campaign_performance',
  'analytics_dashboard',
  'social_media_posts',
  'email_campaigns',
  'seo_performance',
  'leads'
);
```

✓ Verify all 11 tables are returned

### Test 5.2: Check Indexes
```sql
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN (
  'social_media_posts',
  'email_campaigns',
  'seo_performance',
  'campaign_performance'
);
```

✓ Verify indexes exist on status, platform, segment, keyword columns

### Test 5.3: Verify Foreign Key Cascades
```sql
SELECT
  tc.table_name, 
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
  ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public';
```

✓ Verify delete_rule is 'CASCADE' for campaign_performance → google_ads_campaigns

---

## 📋 Performance Testing

### Test 6.1: Content Generation Speed
1. Generate 5 pieces of content consecutively
2. ✓ Measure time for each generation
3. ✓ Average should be < 5 seconds (mock mode)
4. ✓ With real OpenAI: < 30 seconds

### Test 6.2: Dashboard Load Time
1. Navigate to Marketing Dashboard
2. ✓ Initial load should be < 2 seconds
3. ✓ Tab switching should be instant
4. ✓ Data fetching should show loading states

### Test 6.3: Bulk Operations
1. Create 10 social posts at once
2. ✓ Verify all posts are created successfully
3. ✓ Verify database handles concurrent inserts
4. Publish all 10 posts
5. ✓ Verify all status updates correctly

---

## 📋 Security Testing

### Test 7.1: Frontend Credential Check
1. Open browser DevTools → Network tab
2. Perform actions that would use API integrations
3. ✓ Verify NO API keys are visible in requests
4. ✓ Verify NO credentials in localStorage/sessionStorage
5. ✓ Verify console shows mock mode warnings

### Test 7.2: Edge Function Security (OpenAI)
1. Navigate to Content Generator
2. Open Network tab
3. Generate content
4. Find request to Supabase Edge Function
5. ✓ Verify request only contains: contentType, language, niche, topic
6. ✓ Verify NO OpenAI API key in request
7. ✓ Verify response contains only generated content

---

## 📋 Error Handling Testing

### Test 8.1: Network Error Simulation
1. Disable internet connection
2. Try to generate content
3. ✓ Verify error message appears
4. ✓ Verify loading state ends
5. ✓ Verify UI remains responsive

### Test 8.2: Empty Audience Prevention
1. Ensure `leads` table is empty
2. Set SendGrid to production mode (simulate with credentials)
3. Try to send email campaign
4. ✓ Verify error: "No recipients found for segment"
5. ✓ Verify campaign status remains "draft"
6. ✓ Verify NO emails are sent

### Test 8.3: Invalid Data Handling
1. Try to create campaign with empty name
2. ✓ Verify validation error appears
3. Try to create post with missing platform
4. ✓ Verify error message is clear

---

## 📋 Internationalization Testing

### Test 9.1: Multi-Language Content
Generate content in all 14 languages:
- en (English)
- es (Spanish)
- pt (Portuguese)
- fr (French)
- de (German)
- it (Italian)
- ja (Japanese)
- zh (Chinese)
- ko (Korean)
- ar (Arabic)
- ru (Russian)
- hi (Hindi)
- tr (Turkish)
- nl (Dutch)

✓ Verify each language generates appropriate content

### Test 9.2: Amazon Marketplace Links
For each country's campaign:
1. US → amazon.com
2. UK → amazon.co.uk
3. Germany → amazon.de
4. France → amazon.fr
5. Italy → amazon.it
6. Spain → amazon.es
7. Japan → amazon.co.jp
8. Canada → amazon.ca
9. Australia → amazon.com.au
10. India → amazon.in
11. Mexico → amazon.com.mx
12. Brazil → amazon.com.br
13. UAE → amazon.ae
14. Saudi Arabia → amazon.sa

✓ Verify correct marketplace domain in generated content

---

## 📋 Final Integration Test

### Test 10.1: Complete Workflow
**End-to-end automation pipeline:**

1. **Generate Content:**
   - Create SEO article in English for Beauty niche
   - ✓ Content saved to ai_content table

2. **Create Google Ads Campaign:**
   - Use generated content topic
   - Select US marketplace
   - Choose 5 headlines and 3 descriptions
   - ✓ Campaign created with status "draft"

3. **Create Social Media Posts:**
   - Generate 6 posts (one per platform)
   - Use campaign theme
   - Schedule for next week
   - ✓ All posts scheduled

4. **Create Email Campaign:**
   - Use "Promotional Email" template
   - Select "All Subscribers" segment
   - Reference Google Ads campaign
   - ✓ Campaign created

5. **Track SEO:**
   - Sync GSC data
   - Monitor target keywords from content
   - ✓ Keywords tracked

6. **View Analytics:**
   - Check visitor metrics
   - Review conversion funnel
   - Analyze top products
   - ✓ All metrics visible

7. **Activate Everything:**
   - Activate Google Ads campaign
   - Publish social posts
   - Send email campaign
   - ✓ All actions complete successfully

✓ Verify complete marketing automation pipeline works end-to-end

---

## 🎯 Testing Completion Checklist

After completing all tests, verify:

- [ ] All 4 content types generate successfully
- [ ] 14 languages work correctly
- [ ] Google Ads campaigns manage properly
- [ ] 15 headlines and 15 descriptions available
- [ ] Analytics dashboard displays metrics
- [ ] 6 social platforms post successfully
- [ ] Email campaigns send (mock mode)
- [ ] 7 audience segments work
- [ ] SEO tracking imports data
- [ ] Mock mode warnings appear in console
- [ ] No credentials in frontend bundle
- [ ] All 11 database tables exist
- [ ] Foreign key cascades work
- [ ] Error handling works correctly
- [ ] Multi-language content generates
- [ ] Amazon marketplaces link correctly

---

## 📊 Expected Test Results Summary

**Phase 1 (AI Content):** 4/4 content types ✓  
**Phase 1.5 (Google Ads):** Campaign management ✓  
**Phase 2 (Marketing Dashboard):** 4/4 modules ✓  
**Integration Modes:** Mock mode working ✓  
**Database:** 11/11 tables ✓  
**Security:** No credential exposure ✓  

---

## 🚀 Next Steps After Testing

1. **Production Deployment:**
   - Move Buffer/SendGrid/GSC to Edge Functions
   - Configure environment variables in Replit Secrets
   - Deploy to Replit hosting

2. **Real API Integration:**
   - Obtain Buffer API access token
   - Obtain SendGrid API key
   - Set up Google Search Console OAuth
   - Configure credentials in server environment

3. **Populate Database:**
   - Import real customer leads to `leads` table
   - Segment leads appropriately
   - Test real email campaigns with small audience first

4. **Monitor & Optimize:**
   - Track real campaign performance
   - Analyze ROI metrics
   - Optimize based on data

---

## 📞 Support

If any test fails:
1. Check browser console for error messages
2. Verify database connection
3. Ensure all workflows are running
4. Check Supabase Edge Functions are deployed
5. Review AUTOMATION_GUIDE.md for technical details

---

**Last Updated:** October 9, 2025  
**Version:** 2.0 (Phase 2 Complete)
