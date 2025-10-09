import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { seoService } from '../services/seoService';
import type { SEOPerformance } from '../types/analytics';

export function SEOPerformanceTracker() {
  const [topKeywords, setTopKeywords] = useState<SEOPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageUrl, setPageUrl] = useState('');
  const [keyword, setKeyword] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadTopKeywords();
  }, []);

  const loadTopKeywords = async () => {
    setIsLoading(true);
    try {
      const data = await seoService.getTopKeywords(20);
      setTopKeywords(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load SEO data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const trackKeyword = async () => {
    if (!pageUrl || !keyword) {
      toast({
        title: 'Validation Error',
        description: 'Please enter both URL and keyword',
        variant: 'destructive'
      });
      return;
    }

    try {
      await seoService.trackKeyword({
        page_url: pageUrl,
        keyword,
        position: 0,
        impressions: 0,
        clicks: 0,
        ctr: 0,
        date: new Date().toISOString().split('T')[0]
      });

      toast({
        title: 'Success!',
        description: 'Keyword tracking started'
      });

      setPageUrl('');
      setKeyword('');
      loadTopKeywords();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to track keyword',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Track New Keyword
          </CardTitle>
          <CardDescription>Monitor SEO performance for specific keywords</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Page URL</Label>
              <Input
                placeholder="https://example.com/page"
                value={pageUrl}
                onChange={(e) => setPageUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Keyword</Label>
              <Input
                placeholder="e.g., best supplements"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={trackKeyword} className="w-full">
            <Search className="mr-2 h-4 w-4" />
            Start Tracking
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Top Performing Keywords
          </CardTitle>
          <CardDescription>Best keywords by clicks and impressions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : topKeywords.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No keywords tracked yet. Start tracking above!
            </p>
          ) : (
            <div className="space-y-3">
              {topKeywords.map((kw, index) => (
                <div key={kw.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">#{index + 1}</span>
                        <h3 className="font-semibold">{kw.keyword}</h3>
                        {kw.position && kw.position <= 10 && (
                          <span className="flex items-center text-green-600 text-sm">
                            <ArrowUp className="w-3 h-3 mr-1" />
                            Top 10
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{kw.page_url}</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="text-muted-foreground">
                          Position: {kw.position || 'N/A'}
                        </span>
                        <span className="text-muted-foreground">
                          Impressions: {kw.impressions.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground">
                          Clicks: {kw.clicks.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground">
                          CTR: {kw.ctr}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
