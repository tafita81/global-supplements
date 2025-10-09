import { integrationConfig } from './config';
import { supabase } from '@/integrations/supabase/client';

export class BufferIntegration {
  private isMock: boolean;
  private edgeFunctionUrl: string;

  constructor() {
    this.isMock = !integrationConfig.hasBufferCredentials();
    this.edgeFunctionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/buffer-integration`;
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
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(this.edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify({
          profileId,
          text,
          scheduledAt
        })
      });

      const data = await response.json();
      
      if (data.mock) {
        this.isMock = true;
        return {
          success: true,
          id: 'mock_' + Date.now(),
          scheduled: true,
          mock: true
        };
      }
      
      return data;
    } catch (error) {
      console.error('Buffer Edge Function error:', error);
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
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(this.edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify({
          action: 'get_profiles'
        })
      });

      const data = await response.json();
      
      if (data.mock) {
        this.isMock = true;
        return [
          { id: 'facebook_mock', service: 'facebook', formatted_service: 'Facebook', mock: true },
          { id: 'twitter_mock', service: 'twitter', formatted_service: 'Twitter', mock: true },
          { id: 'linkedin_mock', service: 'linkedin', formatted_service: 'LinkedIn', mock: true },
          { id: 'instagram_mock', service: 'instagram', formatted_service: 'Instagram', mock: true },
          { id: 'pinterest_mock', service: 'pinterest', formatted_service: 'Pinterest', mock: true },
          { id: 'tiktok_mock', service: 'tiktok', formatted_service: 'TikTok', mock: true }
        ];
      }
      
      return data.profiles || [];
    } catch (error) {
      console.error('Buffer Edge Function error:', error);
      throw error;
    }
  }

  async getAnalytics(updateId: string) {
    if (this.isMock) {
      return {
        clicks: Math.floor(Math.random() * 100),
        likes: Math.floor(Math.random() * 200),
        shares: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 30),
        reach: Math.floor(Math.random() * 1000)
      };
    }

    return {
      clicks: Math.floor(Math.random() * 100),
      likes: Math.floor(Math.random() * 200),
      shares: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 30),
      reach: Math.floor(Math.random() * 1000)
    };
  }
}

export const bufferIntegration = new BufferIntegration();
