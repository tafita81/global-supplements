import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalyticsDashboard } from '@/automation/components/AnalyticsDashboard';
import { SocialMediaManager } from '@/automation/components/SocialMediaManager';
import { EmailCampaignManager } from '@/automation/components/EmailCampaignManager';
import { SEOPerformanceTracker } from '@/automation/components/SEOPerformanceTracker';

export default function MarketingDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Marketing Dashboard</h1>
        <p className="text-muted-foreground">
          Multi-channel distribution, analytics, and automation
        </p>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
          <TabsTrigger value="social">📱 Social Media</TabsTrigger>
          <TabsTrigger value="email">📧 Email</TabsTrigger>
          <TabsTrigger value="seo">🔍 SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="social">
          <SocialMediaManager />
        </TabsContent>

        <TabsContent value="email">
          <EmailCampaignManager />
        </TabsContent>

        <TabsContent value="seo">
          <SEOPerformanceTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
}
