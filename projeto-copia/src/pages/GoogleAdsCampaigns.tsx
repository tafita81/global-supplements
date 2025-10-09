import { GoogleAdsCampaigns as CampaignsComponent } from '@/automation/components/GoogleAdsCampaigns';

export default function GoogleAdsCampaignsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Google Ads Campaigns</h1>
        <p className="text-muted-foreground">
          Create and manage global Google Ads campaigns with optimized headlines and descriptions
        </p>
      </div>
      
      <CampaignsComponent />
    </div>
  );
}
