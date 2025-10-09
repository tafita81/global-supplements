import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, FileText, Eye, Save } from 'lucide-react';
import { secureContentGenerator } from '../services/contentGeneratorSecure';
import { supabase } from '@/integrations/supabase/client';
import type { ContentGenerationRequest } from '../types/content';

const MARKETPLACES = [
  { id: 'US', name: 'United States', language: 'en' },
  { id: 'CA', name: 'Canada', language: 'en' },
  { id: 'UK', name: 'United Kingdom', language: 'en' },
  { id: 'DE', name: 'Germany', language: 'de' },
  { id: 'FR', name: 'France', language: 'fr' },
  { id: 'IT', name: 'Italy', language: 'it' },
  { id: 'ES', name: 'Spain', language: 'es' },
  { id: 'JP', name: 'Japan', language: 'ja' },
  { id: 'AU', name: 'Australia', language: 'en' },
  { id: 'NL', name: 'Netherlands', language: 'nl' },
  { id: 'SE', name: 'Sweden', language: 'sv' },
  { id: 'SG', name: 'Singapore', language: 'en' },
  { id: 'PL', name: 'Poland', language: 'pl' },
  { id: 'BR', name: 'Brazil', language: 'pt' }
];

const NICHES = [
  'beauty-supplements',
  'skincare',
  'fitness',
  'wellness',
  'vitamins',
  'collagen',
  'biotin',
  'hair-care',
  'anti-aging',
  'weight-loss'
];

const CONTENT_TYPES = [
  { value: 'article', label: 'SEO Article' },
  { value: 'landing-page', label: 'Landing Page' },
  { value: 'product-review', label: 'Product Review' },
  { value: 'comparison', label: 'Product Comparison' }
];

export function ContentGenerator() {
  const [niche, setNiche] = useState('');
  const [country, setCountry] = useState('US');
  const [contentType, setContentType] = useState<'article' | 'landing-page' | 'product-review' | 'comparison'>('article');
  const [keywords, setKeywords] = useState('');
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!niche) {
      toast({
        title: 'Error',
        description: 'Please select a niche',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);
    try {
      const marketplace = MARKETPLACES.find(m => m.id === country);
      const request: ContentGenerationRequest = {
        niche,
        country: marketplace?.name || 'United States',
        language: marketplace?.language || 'en',
        contentType,
        keywords: keywords.split(',').map(k => k.trim()).filter(Boolean)
      };

      const content = await secureContentGenerator.generateContent(request);
      setGeneratedContent(content);
      
      toast({
        title: 'Success!',
        description: `Content generated successfully! SEO Score: ${content.seoScore}/100`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate content. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedContent) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('ai_content' as any)
        .insert({
          title: generatedContent.title,
          content: generatedContent.content,
          meta_description: generatedContent.metaDescription,
          keywords: generatedContent.keywords,
          language: generatedContent.language,
          country: generatedContent.country,
          niche: generatedContent.niche,
          content_type: generatedContent.contentType,
          status: 'draft',
          seo_score: generatedContent.seoScore
        });

      if (error) throw error;

      toast({
        title: 'Saved!',
        description: 'Content saved to database successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save content',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            AI Content Generator
          </CardTitle>
          <CardDescription>
            Generate SEO-optimized content for any niche and country using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="niche">Niche</Label>
              <Select value={niche} onValueChange={setNiche}>
                <SelectTrigger id="niche">
                  <SelectValue placeholder="Select niche" />
                </SelectTrigger>
                <SelectContent>
                  {NICHES.map(n => (
                    <SelectItem key={n} value={n}>
                      {n.replace('-', ' ').toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger id="country">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MARKETPLACES.map(m => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentType">Content Type</Label>
              <Select value={contentType} onValueChange={(v: any) => setContentType(v)}>
                <SelectTrigger id="contentType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map(ct => (
                    <SelectItem key={ct.value} value={ct.value}>
                      {ct.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                placeholder="supplements, vitamins, wellness"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !niche}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Generated Content
              </span>
              <div className="flex gap-2">
                <span className="text-sm font-normal text-muted-foreground">
                  SEO Score: {generatedContent.seoScore}/100
                </span>
                <Button onClick={handleSave} disabled={isSaving} size="sm">
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={generatedContent.title} readOnly />
            </div>

            <div>
              <Label>Meta Description</Label>
              <Textarea value={generatedContent.metaDescription} readOnly rows={2} />
            </div>

            <div>
              <Label>Keywords</Label>
              <Input value={generatedContent.keywords.join(', ')} readOnly />
            </div>

            <div>
              <Label>Content Preview</Label>
              <div 
                className="prose max-w-none p-4 border rounded-md bg-muted/20"
                dangerouslySetInnerHTML={{ __html: generatedContent.content }}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
