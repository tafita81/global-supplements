import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Package, AlertTriangle, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ReactNode;
  status?: "success" | "warning" | "error" | "info";
}

interface MetricsData {
  activeCampaigns: number;
  totalRevenue: number;
  activeContent: number;
  emailPerformance: number;
}

function MetricCard({ title, value, change, trend, icon, status }: MetricCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "success": return "bg-success/10 text-success border-success/20";
      case "warning": return "bg-warning/10 text-warning border-warning/20";
      case "error": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <Card className={`transition-all hover:shadow-md ${getStatusColor()}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-card-foreground/70">{title}</CardTitle>
        <div className="h-5 w-5 opacity-70">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className={`text-xs flex items-center mt-1 ${
            trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground"
          }`}>
            {trend === "up" && <TrendingUp className="h-3 w-3 mr-1" />}
            {trend === "down" && <TrendingDown className="h-3 w-3 mr-1" />}
            {change}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function MetricsCards() {
  const [metrics, setMetrics] = useState<MetricsData>({
    activeCampaigns: 0,
    totalRevenue: 0,
    activeContent: 0,
    emailPerformance: 0
  });

  useEffect(() => {
    fetchRealMetrics();
  }, []);

  const fetchRealMetrics = async () => {
    try {
      // Fetch active Google Ads campaigns
      const { data: campaigns } = await supabase
        .from('google_ads_campaigns')
        .select('*')
        .eq('status', 'active');

      // Fetch campaign performance for revenue
      const { data: performance } = await supabase
        .from('campaign_performance')
        .select('revenue');

      // Fetch active AI content (last 30 days)
      const { data: content } = await supabase
        .from('ai_content')
        .select('id')
        .gte('created_at', new Date(Date.now() - 2592000000).toISOString()); // 30 days

      // Fetch email campaigns for performance
      const { data: emails } = await supabase
        .from('email_campaigns')
        .select('open_rate');

      const activeCampaigns = campaigns?.length || 0;
      const totalRevenue = performance?.reduce((sum, p) => sum + (Number(p.revenue) || 0), 0) || 0;
      const activeContent = content?.length || 0;
      const emailPerformance = emails && emails.length > 0
        ? emails.reduce((sum, e) => sum + (Number(e.open_rate) || 0), 0) / emails.length
        : 0;

      setMetrics({
        activeCampaigns,
        totalRevenue,
        activeContent,
        emailPerformance
      });

    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Active Campaigns"
        value={metrics.activeCampaigns.toString()}
        change="Google Ads running"
        trend={metrics.activeCampaigns > 0 ? "up" : "neutral"}
        icon={<TrendingUp className="h-4 w-4" />}
        status={metrics.activeCampaigns > 0 ? "success" : "warning"}
      />
      <MetricCard
        title="Total Revenue"
        value={`$${(metrics.totalRevenue / 1000).toFixed(1)}K`}
        change="Campaign performance"
        trend={metrics.totalRevenue > 0 ? "up" : "neutral"}
        icon={<DollarSign className="h-4 w-4" />}
        status="info"
      />
      <MetricCard
        title="AI Content Generated"
        value={metrics.activeContent.toString()}
        change="Last 30 days"
        trend="neutral"
        icon={<Package className="h-4 w-4" />}
        status="success"
      />
      <MetricCard
        title="Email Open Rate"
        value={`${metrics.emailPerformance.toFixed(1)}%`}
        change={metrics.emailPerformance === 0 ? "No data yet" : "Average performance"}
        trend={metrics.emailPerformance >= 20 ? "up" : metrics.emailPerformance > 0 ? "neutral" : "down"}
        icon={metrics.emailPerformance >= 20 ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
        status={metrics.emailPerformance >= 20 ? "success" : "warning"}
      />
    </div>
  );
}