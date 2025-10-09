import OpenAI from 'openai';
import type { ContentGenerationRequest, GeneratedContent } from '../types/content';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const CONTENT_PROMPTS = {
  article: (niche: string, country: string, language: string) => `
    Create a comprehensive, SEO-optimized article about ${niche} products for ${country} market.
    Language: ${language}
    
    Requirements:
    - 800-1200 words
    - Include H2 and H3 headings
    - Use bullet points for product features
    - Add a compelling call-to-action
    - Include Amazon OneLink references
    - Optimize for search engines
    - Write in a professional yet engaging tone
    
    Return JSON with:
    {
      "title": "SEO-optimized title (60 chars max)",
      "content": "Full article in HTML format",
      "metaDescription": "Compelling meta description (155 chars max)",
      "keywords": ["keyword1", "keyword2", "keyword3"]
    }
  `,
  
  'landing-page': (niche: string, country: string, language: string) => `
    Create a high-converting landing page for ${niche} products in ${country}.
    Language: ${language}
    
    Requirements:
    - Attention-grabbing headline
    - Benefits-focused copy
    - Social proof elements
    - Strong call-to-action
    - Trust signals
    - Mobile-optimized structure
    
    Return JSON with:
    {
      "title": "Compelling headline",
      "content": "Landing page HTML with sections",
      "metaDescription": "Conversion-focused meta description",
      "keywords": ["high-intent keywords"]
    }
  `,
  
  'product-review': (niche: string, country: string, language: string) => `
    Write an in-depth product review for top ${niche} products in ${country}.
    Language: ${language}
    
    Requirements:
    - Pros and cons analysis
    - Comparison table
    - Expert recommendations
    - User testimonials structure
    - Affiliate links integration
    
    Return JSON with:
    {
      "title": "Product review title",
      "content": "Detailed review in HTML",
      "metaDescription": "Review summary",
      "keywords": ["product-specific keywords"]
    }
  `,
  
  comparison: (niche: string, country: string, language: string) => `
    Create a detailed comparison article for ${niche} products in ${country}.
    Language: ${language}
    
    Requirements:
    - Side-by-side comparison table
    - Feature breakdown
    - Price analysis
    - Best use cases for each product
    - Winner recommendation
    
    Return JSON with:
    {
      "title": "Comparison title",
      "content": "Comparison article with tables",
      "metaDescription": "Comparison summary",
      "keywords": ["comparison keywords"]
    }
  `
};

export class ContentGeneratorService {
  async generateContent(request: ContentGenerationRequest): Promise<GeneratedContent> {
    try {
      const prompt = CONTENT_PROMPTS[request.contentType](
        request.niche,
        request.country,
        request.language
      );

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert SEO content writer specializing in affiliate marketing and e-commerce. 
                     You create high-converting, search-engine optimized content that drives clicks and sales.
                     Always include Amazon OneLink references: https://amzn.to/4mU7qT4`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 2000
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');

      const generatedContent: GeneratedContent = {
        id: crypto.randomUUID(),
        title: result.title || '',
        content: result.content || '',
        metaDescription: result.metaDescription || '',
        keywords: result.keywords || [],
        language: request.language,
        country: request.country,
        niche: request.niche,
        contentType: request.contentType,
        createdAt: new Date().toISOString(),
        status: 'draft',
        seoScore: this.calculateSEOScore(result)
      };

      return generatedContent;
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

  private calculateSEOScore(content: any): number {
    let score = 0;
    
    if (content.title && content.title.length >= 30 && content.title.length <= 60) score += 25;
    if (content.metaDescription && content.metaDescription.length >= 120 && content.metaDescription.length <= 155) score += 25;
    if (content.keywords && content.keywords.length >= 3) score += 25;
    if (content.content && content.content.length >= 800) score += 25;
    
    return score;
  }

  async optimizeForSEO(content: string, keywords: string[]): Promise<string> {
    const prompt = `
      Optimize the following content for SEO using these keywords: ${keywords.join(', ')}
      
      Content:
      ${content}
      
      Return the optimized version with:
      - Keywords naturally integrated
      - Improved heading structure
      - Better readability
      - Internal linking suggestions
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5
    });

    return completion.choices[0].message.content || content;
  }
}

export const contentGenerator = new ContentGeneratorService();
