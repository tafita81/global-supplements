import { supabase } from '@/integrations/supabase/client';
import type { SocialMediaPost } from '../types/analytics';

export class SocialMediaService {
  async createPost(postData: Omit<SocialMediaPost, 'id' | 'created_at' | 'published_at' | 'engagement_data'>) {
    const { data, error } = await supabase
      .from('social_media_posts' as any)
      .insert({
        ...postData,
        engagement_data: {}
      })
      .select()
      .single();

    if (error) throw error;
    return data as SocialMediaPost;
  }

  async getPosts(platform?: string, status?: string) {
    let query = supabase
      .from('social_media_posts' as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (platform) query = query.eq('platform', platform);
    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;
    return data as SocialMediaPost[];
  }

  async schedulePost(postId: string, scheduledDate: string) {
    const { data, error } = await supabase
      .from('social_media_posts' as any)
      .update({ 
        scheduled_date: scheduledDate,
        status: 'scheduled' 
      })
      .eq('id', postId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async publishPost(postId: string) {
    const { data, error } = await supabase
      .from('social_media_posts' as any)
      .update({ 
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', postId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateEngagement(postId: string, engagement: Partial<SocialMediaPost['engagement_data']>) {
    const { data: current } = await supabase
      .from('social_media_posts' as any)
      .select('engagement_data')
      .eq('id', postId)
      .single();

    const { data, error } = await supabase
      .from('social_media_posts' as any)
      .update({ 
        engagement_data: { 
          ...(current?.engagement_data || {}),
          ...engagement 
        } 
      })
      .eq('id', postId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async generatePostContent(niche: string, country: string, tone: 'professional' | 'casual' | 'engaging' = 'engaging') {
    const templates = {
      professional: [
        `Discover premium ${niche} products now available in ${country}. Quality you can trust.`,
        `New ${niche} collection for ${country} customers. Explore our curated selection.`,
        `Trusted by thousands in ${country}. Experience the best ${niche} products.`
      ],
      casual: [
        `Hey ${country}! Check out these amazing ${niche} finds 🎉`,
        `${country} friends! New ${niche} products just dropped 🔥`,
        `Loving ${niche}? We've got something special for you in ${country}!`
      ],
      engaging: [
        `🌟 ${country} exclusive: Top-rated ${niche} products with 5⭐ reviews!`,
        `💫 Best ${niche} picks for ${country} - Fast delivery guaranteed!`,
        `✨ ${country} favorites: Discover why everyone loves these ${niche} products!`
      ]
    };

    const toneTemplates = templates[tone];
    return toneTemplates[Math.floor(Math.random() * toneTemplates.length)];
  }
}

export const socialMediaService = new SocialMediaService();
