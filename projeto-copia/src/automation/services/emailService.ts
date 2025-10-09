import { supabase } from '@/integrations/supabase/client';
import type { EmailCampaign } from '../types/analytics';

export class EmailService {
  async createCampaign(campaignData: Omit<EmailCampaign, 'id' | 'created_at' | 'sent_count' | 'open_rate' | 'click_rate'>) {
    const { data, error } = await supabase
      .from('email_campaigns' as any)
      .insert({
        ...campaignData,
        sent_count: 0,
        open_rate: 0,
        click_rate: 0
      })
      .select()
      .single();

    if (error) throw error;
    return data as EmailCampaign;
  }

  async getCampaigns(status?: string) {
    let query = supabase
      .from('email_campaigns' as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;
    return data as EmailCampaign[];
  }

  async sendCampaign(campaignId: string) {
    const { data, error } = await supabase
      .from('email_campaigns' as any)
      .update({ status: 'sent' })
      .eq('id', campaignId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateMetrics(campaignId: string, metrics: { sent_count?: number; open_rate?: number; click_rate?: number }) {
    const { data, error } = await supabase
      .from('email_campaigns' as any)
      .update(metrics)
      .eq('id', campaignId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async generateEmailTemplate(niche: string, country: string, type: 'welcome' | 'promotion' | 'newsletter' = 'newsletter') {
    const templates = {
      welcome: {
        subject: `Welcome to Global Supplements - Your ${niche} Journey Starts Here!`,
        content: `
          <h1>Welcome to Global Supplements!</h1>
          <p>We're excited to have you join our ${country} community.</p>
          <p>Discover premium ${niche} products with:</p>
          <ul>
            <li>✅ Fast local delivery in ${country}</li>
            <li>✅ Top-rated products with verified reviews</li>
            <li>✅ Exclusive deals for ${country} customers</li>
          </ul>
          <a href="#" style="background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Shop ${niche} Now
          </a>
        `
      },
      promotion: {
        subject: `🔥 Exclusive ${niche} Deals for ${country} - Limited Time!`,
        content: `
          <h1>Special Offer Just for You!</h1>
          <p>Exclusive ${niche} deals available now in ${country}!</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #0066cc;">Top ${niche} Picks</h2>
            <p>Hand-selected products with 5⭐ ratings</p>
            <p>Fast delivery to ${country} - Order today!</p>
          </div>
          <a href="#" style="background: #ff6600; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            View Deals
          </a>
        `
      },
      newsletter: {
        subject: `${niche} Trends & Best Sellers in ${country} - Weekly Update`,
        content: `
          <h1>This Week's ${niche} Highlights</h1>
          <p>Here's what's trending in ${country}:</p>
          <h2>🏆 Best Sellers</h2>
          <p>Top-rated ${niche} products loved by ${country} customers</p>
          <h2>📈 Trending Now</h2>
          <p>New arrivals in ${niche} with fast ${country} delivery</p>
          <h2>💡 Expert Tips</h2>
          <p>How to choose the best ${niche} products for your needs</p>
          <a href="#" style="background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Read More
          </a>
        `
      }
    };

    return templates[type];
  }
}

export const emailService = new EmailService();
