import { integrationConfig } from './config';

export class GoogleSearchConsoleIntegration {
  private credentials: any;
  private baseUrl = 'https://www.googleapis.com/webmasters/v3';
  private isMock: boolean;

  constructor(credentials?: any) {
    this.credentials = credentials || (typeof process !== 'undefined' ? process.env.GSC_CREDENTIALS : null);
    this.isMock = !integrationConfig.hasGSCCredentials();
    
    if (this.credentials && typeof this.credentials === 'string') {
      try {
        this.credentials = JSON.parse(this.credentials);
      } catch (e) {
        console.error('Failed to parse GSC credentials');
        this.credentials = null;
        this.isMock = true;
      }
    }
  }

  async getSearchAnalytics(siteUrl: string, startDate: string, endDate: string, dimensions: string[] = ['query', 'page']) {
    if (this.isMock) {
      console.warn('[MOCK MODE] GSC API not configured - generating mock data');
      return this.generateMockData(startDate, endDate);
    }

    try {
      const response = await fetch(`${this.baseUrl}/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.credentials.accessToken}`
        },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions,
          rowLimit: 25000
        })
      });

      return await response.json();
    } catch (error) {
      console.error('GSC API error:', error);
      throw error;
    }
  }

  private generateMockData(startDate: string, endDate: string) {
    const keywords = [
      'best supplements 2024',
      'collagen benefits',
      'vitamin d supplements',
      'omega 3 fish oil',
      'protein powder reviews',
      'biotin for hair growth',
      'probiotics for gut health',
      'multivitamin comparison',
      'best skincare supplements',
      'anti aging vitamins'
    ];

    const pages = [
      '/products/collagen',
      '/products/vitamins',
      '/blog/supplement-guide',
      '/products/protein',
      '/reviews/best-supplements'
    ];

    const rows = [];
    
    for (const keyword of keywords) {
      for (const page of pages) {
        if (Math.random() > 0.5) {
          rows.push({
            keys: [keyword, `https://globalsupplements.com${page}`],
            impressions: Math.floor(Math.random() * 10000) + 100,
            clicks: Math.floor(Math.random() * 500) + 10,
            ctr: parseFloat((Math.random() * 0.1).toFixed(4)),
            position: Math.floor(Math.random() * 50) + 1
          });
        }
      }
    }

    return { rows };
  }

  async importToDatabase(siteUrl: string, days: number = 30) {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const data = await this.getSearchAnalytics(siteUrl, startDate, endDate);

    const records = (data.rows || []).map((row: any) => ({
      page_url: row.keys[1] || siteUrl,
      keyword: row.keys[0],
      position: row.position,
      impressions: row.impressions,
      clicks: row.clicks,
      ctr: (row.ctr * 100).toFixed(2),
      date: endDate
    }));

    return records;
  }

  async getSitesList() {
    if (!this.credentials) {
      return [
        { siteUrl: 'https://globalsupplements.com/', permissionLevel: 'siteOwner' },
        { siteUrl: 'https://www.globalsupplements.com/', permissionLevel: 'siteOwner' }
      ];
    }

    try {
      const response = await fetch(`${this.baseUrl}/sites`, {
        headers: {
          'Authorization': `Bearer ${this.credentials.accessToken}`
        }
      });

      const data = await response.json();
      return data.siteEntry || [];
    } catch (error) {
      console.error('GSC API error:', error);
      throw error;
    }
  }
}

export const gscIntegration = new GoogleSearchConsoleIntegration();
