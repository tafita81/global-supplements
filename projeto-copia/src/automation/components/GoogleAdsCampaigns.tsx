import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, TrendingUp, Eye, Play, Pause, BarChart3 } from 'lucide-react';
import { campaignsService } from '../services/campaignsService';
import { GLOBAL_HEADLINES, GLOBAL_DESCRIPTIONS } from '../types/campaigns';
import type { GoogleAdsCampaign } from '../types/campaigns';

const MARKETPLACES = [
  'US', 'CA', 'UK', 'DE', 'FR', 'IT', 'ES', 'JP', 'AU', 'NL', 'SE', 'SG', 'PL', 'BR'
];

const NICHES = [
  'beauty-supplements', 'skincare', 'fitness', 'wellness', 'vitamins',
  'collagen', 'biotin', 'hair-care', 'anti-aging', 'weight-loss'
];

export function GoogleAdsCampaigns() {
  const [campaigns, setCampaigns] = useState<GoogleAdsCampaign[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewingMetrics, setViewingMetrics] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  
  const [name, setName] = useState('');
  const [country, setCountry] = useState('US');
  const [niche, setNiche] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedHeadlines, setSelectedHeadlines] = useState<number[]>([]);
  const [selectedDescriptions, setSelectedDescriptions] = useState<number[]>([]);
  
  const { toast } = useToast();

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setIsLoading(true);
    try {
      const data = await campaignsService.getCampaigns();
      setCampaigns(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load campaigns',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!name || !niche || selectedHeadlines.length === 0 || selectedDescriptions.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all fields and select at least one headline and description',
        variant: 'destructive'
      });
      return;
    }

    setIsCreating(true);
    try {
      await campaignsService.createCampaignWithHeadlinesAndDescriptions(
        {
          name,
          country,
          niche,
          budget: budget ? parseFloat(budget) : undefined,
          status: 'draft'
        },
        selectedHeadlines,
        selectedDescriptions
      );

      toast({
        title: 'Success!',
        description: 'Campaign created successfully'
      });

      setName('');
      setBudget('');
      setSelectedHeadlines([]);
      setSelectedDescriptions([]);
      loadCampaigns();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create campaign',
        variant: 'destructive'
      });
    } finally {
      setIsCreating(false);
    }
  };

  const toggleStatus = async (campaignId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      await campaignsService.updateCampaignStatus(campaignId, newStatus as any);
      loadCampaigns();
      toast({
        title: 'Success',
        description: `Campaign ${newStatus === 'active' ? 'activated' : 'paused'}`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update campaign',
        variant: 'destructive'
      });
    }
  };

  const viewMetrics = async (campaignId: string) => {
    try {
      const data = await campaignsService.getPerformanceMetrics(campaignId);
      setMetrics(data);
      setViewingMetrics(campaignId);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load metrics',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Create Google Ads Campaign
          </CardTitle>
          <CardDescription>
            Global campaigns with pre-optimized headlines and descriptions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Campaign Name</Label>
              <Input
                placeholder="e.g., Global Supplements Q1 2025"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Target Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MARKETPLACES.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Niche</Label>
              <Select value={niche} onValueChange={setNiche}>
                <SelectTrigger>
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
              <Label>Budget ($)</Label>
              <Input
                type="number"
                placeholder="1000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Select Headlines (max 30 chars)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
              {GLOBAL_HEADLINES.map((headline, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`headline-${index}`}
                    checked={selectedHeadlines.includes(index)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedHeadlines([...selectedHeadlines, index]);
                      } else {
                        setSelectedHeadlines(selectedHeadlines.filter(i => i !== index));
                      }
                    }}
                  />
                  <label htmlFor={`headline-${index}`} className="text-sm cursor-pointer">
                    {headline.icon} {headline.text}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Selected: {selectedHeadlines.length} headlines
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Select Descriptions (max 90 chars)</Label>
            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
              {GLOBAL_DESCRIPTIONS.map((desc, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`desc-${index}`}
                    checked={selectedDescriptions.includes(index)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedDescriptions([...selectedDescriptions, index]);
                      } else {
                        setSelectedDescriptions(selectedDescriptions.filter(i => i !== index));
                      }
                    }}
                  />
                  <label htmlFor={`desc-${index}`} className="text-sm cursor-pointer">
                    {desc.icon} {desc.text}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Selected: {selectedDescriptions.length} descriptions
            </p>
          </div>

          <Button onClick={handleCreate} disabled={isCreating} className="w-full">
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Campaign
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Active Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : campaigns.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No campaigns yet. Create your first campaign above!
            </p>
          ) : (
            <div className="space-y-3">
              {campaigns.map(campaign => (
                <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{campaign.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {campaign.country} • {campaign.niche} • ${campaign.budget || 0}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => viewMetrics(campaign.id)}
                    >
                      <BarChart3 className="mr-1 h-3 w-3" /> Metrics
                    </Button>
                    <Button
                      size="sm"
                      variant={campaign.status === 'active' ? 'destructive' : 'default'}
                      onClick={() => toggleStatus(campaign.id, campaign.status)}
                    >
                      {campaign.status === 'active' ? (
                        <><Pause className="mr-1 h-3 w-3" /> Pause</>
                      ) : (
                        <><Play className="mr-1 h-3 w-3" /> Activate</>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {viewingMetrics && metrics && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Campaign performance by country</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Impressions</p>
                <p className="text-2xl font-bold">{metrics.totals.impressions.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Clicks</p>
                <p className="text-2xl font-bold">{metrics.totals.clicks.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">CTR</p>
                <p className="text-2xl font-bold">{metrics.ctr}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">${metrics.totals.revenue.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">ROI</p>
                <p className="text-2xl font-bold">{metrics.roi}%</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setViewingMetrics(null)}>Close</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
