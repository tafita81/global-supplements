import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Send, Sparkles, BarChart3 } from 'lucide-react';
import { emailService } from '../services/emailService';
import { EMAIL_SEGMENTS } from '../types/analytics';
import type { EmailCampaign } from '../types/analytics';

const NICHES = ['beauty', 'skincare', 'fitness', 'wellness', 'vitamins'];
const COUNTRIES = ['US', 'UK', 'DE', 'FR', 'CA'];

export function EmailCampaignManager() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [segment, setSegment] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setIsLoading(true);
    try {
      const data = await emailService.getCampaigns();
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

  const generateTemplate = async () => {
    const niche = NICHES[Math.floor(Math.random() * NICHES.length)];
    const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    const template = await emailService.generateEmailTemplate(niche, country, 'newsletter');
    
    setSubject(template.subject);
    setContent(template.content);
    
    toast({
      title: 'Template Generated!',
      description: 'Email template is ready'
    });
  };

  const handleCreate = async () => {
    if (!name || !subject || !content) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all required fields',
        variant: 'destructive'
      });
      return;
    }

    setIsCreating(true);
    try {
      await emailService.createCampaign({
        name,
        subject,
        content,
        segment: segment || undefined,
        status: 'draft'
      });

      toast({
        title: 'Success!',
        description: 'Campaign created successfully'
      });

      setName('');
      setSubject('');
      setContent('');
      setSegment('');
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

  const sendCampaign = async (campaignId: string) => {
    try {
      await emailService.sendCampaign(campaignId);
      toast({
        title: 'Sent!',
        description: 'Campaign has been sent'
      });
      loadCampaigns();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send campaign',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Create Email Campaign
          </CardTitle>
          <CardDescription>Automated email marketing campaigns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Campaign Name</Label>
              <Input
                placeholder="e.g., Weekly Newsletter"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Target Segment</Label>
              <Select value={segment} onValueChange={setSegment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select segment" />
                </SelectTrigger>
                <SelectContent>
                  {EMAIL_SEGMENTS.map(s => (
                    <SelectItem key={s} value={s}>
                      {s.replace('_', ' ').toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email Subject</Label>
            <Input
              placeholder="Enter email subject line"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Email Content (HTML)</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={generateTemplate}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Template
              </Button>
            </div>
            <Textarea
              placeholder="Email HTML content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
            />
          </div>

          <Button onClick={handleCreate} disabled={isCreating} className="w-full">
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Create Campaign
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : campaigns.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No campaigns yet</p>
          ) : (
            <div className="space-y-3">
              {campaigns.map(campaign => (
                <div key={campaign.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{campaign.name}</h3>
                      <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Sent: {campaign.sent_count}</span>
                        <span>Open: {campaign.open_rate}%</span>
                        <span>Click: {campaign.click_rate}%</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {campaign.status === 'draft' && (
                        <Button size="sm" onClick={() => sendCampaign(campaign.id)}>
                          <Send className="mr-1 h-3 w-3" />
                          Send
                        </Button>
                      )}
                      {campaign.status === 'sent' && (
                        <Button size="sm" variant="outline">
                          <BarChart3 className="mr-1 h-3 w-3" />
                          Stats
                        </Button>
                      )}
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
