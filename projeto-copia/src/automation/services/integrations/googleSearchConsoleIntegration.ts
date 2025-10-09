import { integrationConfig } from './config';
import { supabase } from '@/integrations/supabase/client';

export class GoogleSearchConsoleIntegration {
  private isMock: boolean;
  private edgeFunctionUrl: string;

  constructor() {
    this.isMock = !integrationConfig.hasGSCCredentials();
    this.edgeFunctionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gsc-integration`;
  }

  async getSearchAnalytics(siteUrl: string, startDate: string, endDate: string, dimensions: string[] = ['query', 'page']) {
    if (this.isMock) {
      console.warn('[MOCK MODE] GSC API not configured - generating mock data');
      return this.generateMockData(startDate, endDate);
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(this.edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify({
          siteUrl,
          startDate,
          endDate,
          dimensions
        })
      });

      const result = await response.json();
      
      if (result.mock) {
        this.isMock = true;
        return this.generateMockData(startDate, endDate);
      }
      
      return result.data;
    } catch (error) {
      console.error('GSC Edge Function error:', error);
      return this.generateMockData(startDate, endDate);
    }
  }

  private generateMockData(startDate: string, endDate: string) {
    const keywords = [
      'beauty supplements',
      'anti-aging supplements',
      'collagen powder',
      'vitamin c serum',
      'hair growth vitamins',
      'skin care routine',
      'biotin for hair',
      'hyaluronic acid benefits',
      'keratin treatment',
      'supplement store'
    ];

    return {
      rows: keywords.map((keyword, index) => ({
        keys: [keyword],
        clicks: Math.floor(Math.random() * 500) + 100,
        impressions: Math.floor(Math.random() * 5000) + 1000,
        ctr: parseFloat((Math.random() * 0.1 + 0.02).toFixed(4)),
        position: parseFloat((Math.random() * 30 + 1).toFixed(1))
      }))
    };
  }
}

export const googleSearchConsoleIntegration = new GoogleSearchConsoleIntegration();
