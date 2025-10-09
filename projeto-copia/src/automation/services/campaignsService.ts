import { supabase } from '@/integrations/supabase/client';
import type { GoogleAdsCampaign, GoogleAdsHeadline, GoogleAdsDescription, CampaignPerformance } from '../types/campaigns';
import { GLOBAL_HEADLINES, GLOBAL_DESCRIPTIONS } from '../types/campaigns';

export class CampaignsService {
  async createCampaign(data: Omit<GoogleAdsCampaign, 'id' | 'created_at' | 'updated_at'>) {
    const { data: campaign, error } = await supabase
      .from('google_ads_campaigns' as any)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return campaign;
  }

  async createCampaignWithHeadlinesAndDescriptions(
    campaignData: Omit<GoogleAdsCampaign, 'id' | 'created_at' | 'updated_at'>,
    headlineIndices: number[],
    descriptionIndices: number[]
  ) {
    const campaign = await this.createCampaign(campaignData);

    const headlines = headlineIndices.map(index => ({
      campaign_id: campaign.id,
      text: GLOBAL_HEADLINES[index].text,
      icon: GLOBAL_HEADLINES[index].icon,
      language: 'en'
    }));

    const descriptions = descriptionIndices.map(index => ({
      campaign_id: campaign.id,
      text: GLOBAL_DESCRIPTIONS[index].text,
      icon: GLOBAL_DESCRIPTIONS[index].icon,
      language: 'en'
    }));

    const [headlinesResult, descriptionsResult] = await Promise.all([
      supabase.from('google_ads_headlines' as any).insert(headlines),
      supabase.from('google_ads_descriptions' as any).insert(descriptions)
    ]);

    if (headlinesResult.error) {
      await supabase.from('google_ads_campaigns' as any).delete().eq('id', campaign.id);
      throw new Error(`Failed to insert headlines: ${headlinesResult.error.message}`);
    }

    if (descriptionsResult.error) {
      await supabase.from('google_ads_campaigns' as any).delete().eq('id', campaign.id);
      throw new Error(`Failed to insert descriptions: ${descriptionsResult.error.message}`);
    }

    return campaign;
  }

  async getCampaigns() {
    const { data, error } = await supabase
      .from('google_ads_campaigns' as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getCampaignWithAssets(campaignId: string) {
    const [campaignResult, headlinesResult, descriptionsResult] = await Promise.all([
      supabase.from('google_ads_campaigns' as any).select('*').eq('id', campaignId).single(),
      supabase.from('google_ads_headlines' as any).select('*').eq('campaign_id', campaignId),
      supabase.from('google_ads_descriptions' as any).select('*').eq('campaign_id', campaignId)
    ]);

    if (campaignResult.error) throw campaignResult.error;

    return {
      campaign: campaignResult.data,
      headlines: headlinesResult.data || [],
      descriptions: descriptionsResult.data || []
    };
  }

  async updateCampaignStatus(campaignId: string, status: 'draft' | 'active' | 'paused' | 'completed') {
    const { data, error } = await supabase
      .from('google_ads_campaigns' as any)
      .update({ status })
      .eq('id', campaignId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async trackPerformance(data: Omit<CampaignPerformance, 'id' | 'created_at'>) {
    const { data: performance, error } = await supabase
      .from('campaign_performance' as any)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return performance;
  }

  async getPerformanceMetrics(campaignId: string) {
    const { data, error } = await supabase
      .from('campaign_performance' as any)
      .select('*')
      .eq('campaign_id', campaignId)
      .order('date', { ascending: false });

    if (error) throw error;

    const totals = data?.reduce((acc, row) => ({
      impressions: acc.impressions + row.impressions,
      clicks: acc.clicks + row.clicks,
      conversions: acc.conversions + row.conversions,
      cost: acc.cost + parseFloat(row.cost),
      revenue: acc.revenue + parseFloat(row.revenue)
    }), { impressions: 0, clicks: 0, conversions: 0, cost: 0, revenue: 0 }) || {};

    return {
      daily: data || [],
      totals,
      ctr: totals.impressions > 0 ? (totals.clicks / totals.impressions * 100).toFixed(2) : '0',
      roi: totals.cost > 0 ? ((totals.revenue - totals.cost) / totals.cost * 100).toFixed(2) : '0'
    };
  }
}

export const campaignsService = new CampaignsService();
