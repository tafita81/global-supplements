import { ContentGenerator } from '@/automation/components/ContentGenerator';

export default function AIContentGenerator() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">AI Content Generator</h1>
        <p className="text-muted-foreground">
          Generate SEO-optimized content automatically for any niche and country using advanced AI
        </p>
      </div>
      
      <ContentGenerator />
    </div>
  );
}
