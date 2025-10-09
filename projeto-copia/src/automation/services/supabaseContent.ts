import { supabase } from '@/integrations/supabase/client';
import type { GeneratedContent, SEOPage, Lead } from '../types/content';

export class SupabaseContentService {
  async saveContent(content: GeneratedContent) {
    const { data, error } = await supabase
      .from('ai_content')
      .insert({
        title: content.title,
        content: content.content,
        meta_description: content.metaDescription,
        keywords: content.keywords,
        language: content.language,
        country: content.country,
        niche: content.niche,
        content_type: content.contentType,
        status: content.status,
        seo_score: content.seoScore
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getContent(id: string) {
    const { data, error } = await supabase
      .from('ai_content')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async listContent(filters?: { country?: string; niche?: string; status?: string }) {
    let query = supabase.from('ai_content').select('*').order('created_at', { ascending: false });

    if (filters?.country) query = query.eq('country', filters.country);
    if (filters?.niche) query = query.eq('niche', filters.niche);
    if (filters?.status) query = query.eq('status', filters.status);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async publishContent(id: string) {
    const { data, error } = await supabase
      .from('ai_content')
      .update({ status: 'published', published_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async createSEOPage(page: Omit<SEOPage, 'id'>) {
    const { data, error } = await supabase
      .from('seo_pages')
      .insert({
        slug: page.slug,
        country: page.country,
        niche: page.niche,
        title: page.title,
        content: page.content,
        meta_title: page.metaTitle,
        meta_description: page.metaDescription,
        keywords: page.keywords,
        canonical_url: page.canonicalUrl,
        og_image: page.ogImage,
        structured_data: page.structuredData,
        published_at: page.publishedAt
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getSEOPage(slug: string, country: string) {
    const { data, error } = await supabase
      .from('seo_pages')
      .select('*')
      .eq('slug', slug)
      .eq('country', country)
      .single();

    if (error) throw error;
    return data;
  }

  async captureLead(lead: Omit<Lead, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('leads')
      .insert({
        email: lead.email,
        country: lead.country,
        niche: lead.niche,
        source: lead.source,
        metadata: lead.metadata
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getLeadStats(filters?: { country?: string; niche?: string }) {
    let query = supabase
      .from('leads')
      .select('country, niche, created_at', { count: 'exact' });

    if (filters?.country) query = query.eq('country', filters.country);
    if (filters?.niche) query = query.eq('niche', filters.niche);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      total: count || 0,
      byCountry: this.groupBy(data || [], 'country'),
      byNiche: this.groupBy(data || [], 'niche')
    };
  }

  private groupBy(array: any[], key: string) {
    return array.reduce((result, item) => {
      const group = item[key];
      result[group] = (result[group] || 0) + 1;
      return result;
    }, {} as Record<string, number>);
  }
}

export const supabaseContentService = new SupabaseContentService();
