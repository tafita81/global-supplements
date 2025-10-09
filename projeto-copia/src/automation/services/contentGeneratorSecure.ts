import { supabase } from '@/integrations/supabase/client';
import type { ContentGenerationRequest, GeneratedContent } from '../types/content';

export class SecureContentGeneratorService {
  async generateContent(request: ContentGenerationRequest): Promise<GeneratedContent> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: request
      });

      if (error) throw error;
      return data as GeneratedContent;
    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('Failed to generate content');
    }
  }

  async generateBulkContent(requests: ContentGenerationRequest[]): Promise<GeneratedContent[]> {
    const results = await Promise.all(
      requests.map(request => this.generateContent(request))
    );
    return results;
  }
}

export const secureContentGenerator = new SecureContentGeneratorService();
