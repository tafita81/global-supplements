import { supabase } from '@/integrations/supabase/client';
import type { SEOPerformance } from '../types/analytics';
import { gscIntegration } from './integrations/googleSearchConsoleIntegration';

export class SEOService {
  async trackKeyword(data: Omit<SEOPerformance, 'id' | 'created_at'>) {
    const { data: result, error } = await supabase
      .from('seo_performance' as any)
      .upsert(data)
      .select()
      .single();

    if (error) throw error;
    return result as SEOPerformance;
  }

  async getPerformance(pageUrl?: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('seo_performance' as any)
      .select('*')
      .order('date', { ascending: false });

    if (pageUrl) query = query.eq('page_url', pageUrl);
    if (startDate) query = query.gte('date', startDate);
    if (endDate) query = query.lte('date', endDate);

    const { data, error } = await query;
    if (error) throw error;
    return data as SEOPerformance[];
  }

  async getTopKeywords(limit: number = 20) {
    const { data, error } = await supabase
      .from('seo_performance' as any)
      .select('*')
      .order('clicks', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as SEOPerformance[];
  }

  async getKeywordTrends(keyword: string, days: number = 30) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('seo_performance' as any)
      .select('*')
      .eq('keyword', keyword)
      .gte('date', startDate)
      .order('date', { ascending: true });

    if (error) throw error;
    return data as SEOPerformance[];
  }

  async bulkImportFromGSC(gscData: Array<Omit<SEOPerformance, 'id' | 'created_at'>>) {
    const { data, error } = await supabase
      .from('seo_performance' as any)
      .upsert(gscData)
      .select();

    if (error) throw error;
    return data;
  }

  async importFromGoogleSearchConsole(siteUrl: string, days: number = 30) {
    const records = await gscIntegration.importToDatabase(siteUrl, days);
    
    if (records.length === 0) {
      throw new Error('No data retrieved from Google Search Console');
    }

    return this.bulkImportFromGSC(records);
  }

  async syncGSCData(siteUrl: string = 'https://globalsupplements.com/') {
    console.log('Starting GSC data sync for:', siteUrl);
    
    const result = await this.importFromGoogleSearchConsole(siteUrl, 30);
    
    console.log(`✅ Imported ${result?.length || 0} SEO records from GSC`);
    
    return result;
  }
}

export const seoService = new SEOService();
