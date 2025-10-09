import { integrationConfig } from './config';

export class BufferIntegration {
  private accessToken: string;
  private baseUrl = 'https://api.bufferapp.com/1';
  private isMock: boolean;

  constructor(accessToken?: string) {
    this.accessToken = accessToken || process.env.BUFFER_ACCESS_TOKEN || '';
    this.isMock = !integrationConfig.hasBufferCredentials();
  }

  async createPost(profileId: string, text: string, scheduledAt?: string) {
    if (this.isMock) {
      console.warn('[MOCK MODE] Buffer API - would create post:', { profileId, text, scheduledAt });
      return { 
        success: true, 
        id: 'mock_' + Date.now(), 
        scheduled: true,
        mock: true 
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/updates/create.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: JSON.stringify({
          profile_ids: [profileId],
          text,
          scheduled_at: scheduledAt,
          now: !scheduledAt
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Buffer API error:', error);
      throw error;
    }
  }

  async getProfiles() {
    if (this.isMock) {
      console.warn('[MOCK MODE] Buffer - returning mock profiles');
      return [
        { id: 'facebook_mock', service: 'facebook', formatted_service: 'Facebook', mock: true },
        { id: 'twitter_mock', service: 'twitter', formatted_service: 'Twitter', mock: true },
        { id: 'linkedin_mock', service: 'linkedin', formatted_service: 'LinkedIn', mock: true },
        { id: 'instagram_mock', service: 'instagram', formatted_service: 'Instagram', mock: true },
        { id: 'pinterest_mock', service: 'pinterest', formatted_service: 'Pinterest', mock: true },
        { id: 'tiktok_mock', service: 'tiktok', formatted_service: 'TikTok', mock: true }
      ];
    }

    try {
      const response = await fetch(`${this.baseUrl}/profiles.json?access_token=${this.accessToken}`);
      return await response.json();
    } catch (error) {
      console.error('Buffer API error:', error);
      throw error;
    }
  }

  async getAnalytics(updateId: string) {
    if (!this.accessToken) {
      return {
        clicks: Math.floor(Math.random() * 100),
        likes: Math.floor(Math.random() * 200),
        shares: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 30),
        reach: Math.floor(Math.random() * 1000)
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/updates/${updateId}.json?access_token=${this.accessToken}`);
      const data = await response.json();
      return data.statistics;
    } catch (error) {
      console.error('Buffer API error:', error);
      throw error;
    }
  }
}

export const bufferIntegration = new BufferIntegration();
