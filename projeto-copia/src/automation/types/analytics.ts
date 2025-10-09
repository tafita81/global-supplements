export interface AnalyticsDashboard {
  id: string;
  date: string;
  total_visitors: number;
  total_pageviews: number;
  total_conversions: number;
  total_revenue: number;
  avg_session_duration: number;
  bounce_rate: number;
  top_countries: Array<{ country: string; visitors: number }>;
  top_products: Array<{ product: string; sales: number }>;
  created_at: string;
}

export interface SocialMediaPost {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'pinterest' | 'tiktok';
  content: string;
  media_url?: string;
  scheduled_date?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  engagement_data: {
    likes?: number;
    shares?: number;
    comments?: number;
    reach?: number;
  };
  created_at: string;
  published_at?: string;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  segment?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  sent_count: number;
  open_rate: number;
  click_rate: number;
  scheduled_date?: string;
  created_at: string;
}

export interface SEOPerformance {
  id: string;
  page_url: string;
  keyword: string;
  position?: number;
  impressions: number;
  clicks: number;
  ctr: number;
  date: string;
  created_at: string;
}

export const SOCIAL_PLATFORMS = [
  { id: 'facebook', name: 'Facebook', icon: '📘' },
  { id: 'instagram', name: 'Instagram', icon: '📸' },
  { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'pinterest', name: 'Pinterest', icon: '📌' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵' }
] as const;

export const EMAIL_SEGMENTS = [
  'all_subscribers',
  'new_customers',
  'returning_customers',
  'high_value',
  'inactive_users',
  'by_country',
  'by_niche'
] as const;
