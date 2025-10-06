import OpenAI from 'openai';

const getApiKey = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_OPENAI_API_KEY;
  }
  return '';
};

const openai = new OpenAI({
  apiKey: getApiKey(),
  dangerouslyAllowBrowser: true
});

interface ProductValidation {
  isRelevant: boolean;
  confidence: number;
  reason: string;
}

interface QueryOptimization {
  optimizedQuery: string;
  keywords: string[];
}

class AIProductValidator {
  private validationCache = new Map<string, ProductValidation>();
  private queryCache = new Map<string, QueryOptimization>();

  async validateProduct(
    productTitle: string,
    category: string,
    subcategory: string | null
  ): Promise<ProductValidation> {
    const cacheKey = `${productTitle}-${category}-${subcategory}`;
    
    if (this.validationCache.has(cacheKey)) {
      return this.validationCache.get(cacheKey)!;
    }

    try {
      const context = subcategory 
        ? `Category: ${category}, Subcategory: ${subcategory}`
        : `Category: ${category}`;

      const prompt = `Analyze if this product belongs to the specified category:

Product: "${productTitle}"
${context}

Rules:
1. Return "true" ONLY if the product clearly belongs to this category/subcategory
2. Be strict: if it's a vitamin but the category is "Blood Pressure Monitors", return false
3. Consider the primary purpose of the product
4. Ignore brand names, focus on product type

Respond in JSON format:
{
  "isRelevant": true/false,
  "confidence": 0-100,
  "reason": "brief explanation"
}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a product categorization expert. Analyze products strictly and accurately.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 150,
        response_format: { type: 'json_object' }
      });

      const response = JSON.parse(completion.choices[0].message.content || '{}');
      
      const result: ProductValidation = {
        isRelevant: response.isRelevant === true,
        confidence: response.confidence || 0,
        reason: response.reason || 'No reason provided'
      };

      this.validationCache.set(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('❌ AI validation error:', error);
      return {
        isRelevant: true,
        confidence: 50,
        reason: 'Fallback due to AI error'
      };
    }
  }

  async validateProductBatch(
    products: Array<{ title: string; asin: string }>,
    category: string,
    subcategory: string | null
  ): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();
    
    const context = subcategory 
      ? `Category: ${category}, Subcategory: ${subcategory}`
      : `Category: ${category}`;

    try {
      const productList = products.map((p, i) => `${i + 1}. ${p.title}`).join('\n');
      
      const prompt = `Analyze which products belong to the specified category:

${context}

Products:
${productList}

STRICT VALIDATION RULES:
1. Return ONLY the numbers of products that EXACTLY match this category
2. BE EXTREMELY STRICT - reject anything that doesn't perfectly fit
3. Focus ONLY on the primary product type, never secondary uses

EXPLICIT EXCLUSIONS:
- If category is "makeup" → vitamins/supplements/pills/capsules are FORBIDDEN (even if they claim to help skin/hair)
- If category is "skin care" → oral supplements/vitamins/gummies are FORBIDDEN (only topical products allowed)
- If category is "vitamins" → makeup/cosmetics/lotions/creams are FORBIDDEN
- If category is "sports nutrition" → beauty products/makeup are FORBIDDEN
- A product can ONLY belong to ONE primary category

EXAMPLES:
✅ "Maybelline Fit Me Foundation" → makeup: YES
❌ "Biotin 10000mcg Hair Skin Nails Vitamins" → makeup: NO (it's a supplement, not makeup)
✅ "CeraVe Moisturizing Cream" → skin care: YES
❌ "Collagen Peptides Powder" → skin care: NO (it's an oral supplement)
✅ "Nature's Bounty Biotin 10000mcg" → vitamins: YES
❌ "MAC Ruby Woo Lipstick" → vitamins: NO (it's makeup)

Respond in JSON format:
{
  "relevant": [1, 3, 5],
  "reasoning": "brief explanation"
}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a strict product categorization expert. Filter products accurately.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 300,
        response_format: { type: 'json_object' }
      });

      const response = JSON.parse(completion.choices[0].message.content || '{}');
      const relevantIndices = new Set(response.relevant || []);

      console.log(`🤖 AI Batch Validation: ${relevantIndices.size}/${products.length} products relevant`);
      console.log(`📝 AI Reasoning: ${response.reasoning}`);

      products.forEach((product, index) => {
        results.set(product.asin, relevantIndices.has(index + 1));
      });

    } catch (error) {
      console.error('❌ AI batch validation error:', error);
      products.forEach(product => {
        results.set(product.asin, true);
      });
    }

    return results;
  }

  async optimizeSearchQuery(
    category: string,
    subcategory: string | null
  ): Promise<QueryOptimization> {
    const cacheKey = `${category}-${subcategory}`;
    
    if (this.queryCache.has(cacheKey)) {
      return this.queryCache.get(cacheKey)!;
    }

    try {
      const context = subcategory 
        ? `Category: ${category}, Subcategory: ${subcategory}`
        : `Category: ${category}`;

      const prompt = `Generate the BEST Amazon search query for this category:

${context}

Requirements:
1. Create a query that returns ONLY products from this specific category
2. Use the most effective keywords Amazon sellers use
3. Be specific enough to avoid irrelevant products
4. Maximum 5-7 keywords
5. Focus on product type, not brands

Example for "Blood Pressure Monitors":
Good: "blood pressure monitor cuff digital automatic"
Bad: "health supplements vitamins"

Respond in JSON format:
{
  "optimizedQuery": "keyword1 keyword2 keyword3",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an Amazon search optimization expert. Create precise, effective search queries.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 150,
        response_format: { type: 'json_object' }
      });

      const response = JSON.parse(completion.choices[0].message.content || '{}');
      
      const result: QueryOptimization = {
        optimizedQuery: response.optimizedQuery || '',
        keywords: response.keywords || []
      };

      this.queryCache.set(cacheKey, result);
      
      console.log(`🎯 AI Optimized Query for "${context}": "${result.optimizedQuery}"`);
      
      return result;
    } catch (error) {
      console.error('❌ AI query optimization error:', error);
      return {
        optimizedQuery: subcategory || category,
        keywords: [subcategory || category]
      };
    }
  }

  clearCache() {
    this.validationCache.clear();
    this.queryCache.clear();
  }
}

export const aiValidator = new AIProductValidator();
