import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, TrendingUp, Users, Eye, DollarSign, Globe } from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import { useToast } from '@/hooks/use-toast';

export function AnalyticsDashboard() {
  const [overview, setOverview] = useState<any>(null);
  const [topCountries, setTopCountries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [overviewData, countriesData] = await Promise.all([
        analyticsService.getOverview(),
        analyticsService.getTopCountries(10)
      ]);
      setOverview(overviewData);
      setTopCountries(countriesData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load analytics data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.totals.visitors.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pageviews</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.totals.pageviews.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.totals.conversions.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              {overview?.conversionRate || 0}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${overview?.totals.revenue.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Top Countries
          </CardTitle>
          <CardDescription>Visitor distribution by country</CardDescription>
        </CardHeader>
        <CardContent>
          {topCountries.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No data available yet</p>
          ) : (
            <div className="space-y-3">
              {topCountries.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{country.country === 'US' ? '🇺🇸' : '🌍'}</span>
                    <span className="font-medium">{country.country}</span>
                  </div>
                  <span className="text-muted-foreground">{country.visitors.toLocaleString()} visitors</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
