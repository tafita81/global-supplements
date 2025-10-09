export interface ContentGenerationRequest {
  niche: string;
  country: string;
  language: string;
  contentType: 'article' | 'landing-page' | 'product-review' | 'comparison';
  keywords?: string[];
  productASINs?: string[];
}

export interface GeneratedContent {
  id: string;
  title: string;
  content: string;
  metaDescription: string;
  keywords: string[];
  language: string;
  country: string;
  niche: string;
  contentType: string;
  createdAt: string;
  status: 'draft' | 'published' | 'scheduled';
  seoScore?: number;
}

export interface SEOPage {
  id: string;
  slug: string;
  country: string;
  niche: string;
  title: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: Record<string, any>;
  publishedAt?: string;
}

export interface Lead {
  id: string;
  email: string;
  country: string;
  niche: string;
  source: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface ContentTemplate {
  niche: string;
  country: string;
  template: string;
  variables: string[];
}
