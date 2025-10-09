-- Create AI Content table
CREATE TABLE IF NOT EXISTS ai_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  meta_description TEXT,
  keywords TEXT[] DEFAULT '{}',
  language VARCHAR(10) NOT NULL,
  country VARCHAR(50) NOT NULL,
  niche VARCHAR(100) NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  seo_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  published_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create SEO Pages table
CREATE TABLE IF NOT EXISTS seo_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(255) NOT NULL,
  country VARCHAR(50) NOT NULL,
  niche VARCHAR(100) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  meta_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  canonical_url TEXT,
  og_image TEXT,
  structured_data JSONB,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(slug, country)
);

-- Create Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  country VARCHAR(50) NOT NULL,
  niche VARCHAR(100) NOT NULL,
  source VARCHAR(100) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create Content Templates table
CREATE TABLE IF NOT EXISTS content_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  niche VARCHAR(100) NOT NULL,
  country VARCHAR(50) NOT NULL,
  template TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(niche, country)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_content_country_niche ON ai_content(country, niche);
CREATE INDEX IF NOT EXISTS idx_ai_content_status ON ai_content(status);
CREATE INDEX IF NOT EXISTS idx_seo_pages_slug_country ON seo_pages(slug, country);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_country_niche ON leads(country, niche);

-- Enable Row Level Security
ALTER TABLE ai_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now - adjust based on auth requirements)
CREATE POLICY "Allow all operations on ai_content" ON ai_content FOR ALL USING (true);
CREATE POLICY "Allow all operations on seo_pages" ON seo_pages FOR ALL USING (true);
CREATE POLICY "Allow all operations on leads" ON leads FOR ALL USING (true);
CREATE POLICY "Allow all operations on content_templates" ON content_templates FOR ALL USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_ai_content_updated_at BEFORE UPDATE ON ai_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seo_pages_updated_at BEFORE UPDATE ON seo_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_templates_updated_at BEFORE UPDATE ON content_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
