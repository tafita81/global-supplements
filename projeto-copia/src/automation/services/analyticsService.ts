import { supabase } from '@/integrations/supabase/client';
import type { AnalyticsDashboard } from '../types/analytics';

export class AnalyticsService {
  async getDashboardData(startDate?: string, endDate?: string) {
    let query = supabase
      .from('analytics_dashboard' as any)
      .select('*')
      .order('date', { ascending: false });

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as AnalyticsDashboard[];
  }

  async getOverview() {
    const today = new Date().toISOString().split('T')[0];
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('analytics_dashboard' as any)
      .select('*')
      .gte('date', lastWeek)
      .lte('date', today);

    if (error) throw error;

    const totals = (data || []).reduce((acc, day) => ({
      visitors: acc.visitors + day.total_visitors,
      pageviews: acc.pageviews + day.total_pageviews,
      conversions: acc.conversions + day.total_conversions,
      revenue: acc.revenue + parseFloat(day.total_revenue)
    }), { visitors: 0, pageviews: 0, conversions: 0, revenue: 0 });

    return {
      last7Days: data || [],
      totals,
      conversionRate: totals.visitors > 0 ? (totals.conversions / totals.visitors * 100).toFixed(2) : '0'
    };
  }

  async updateDailyMetrics(date: string, metrics: Partial<Omit<AnalyticsDashboard, 'id' | 'created_at'>>) {
    const { data, error } = await supabase
      .from('analytics_dashboard' as any)
      .upsert({ date, ...metrics })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getTopCountries(limit: number = 10) {
    const { data, error } = await supabase
      .from('analytics_dashboard' as any)
      .select('top_countries')
      .order('date', { ascending: false })
      .limit(30);

    if (error) throw error;

    const countriesMap = new Map<string, number>();
    data?.forEach(day => {
      (day.top_countries || []).forEach((c: any) => {
        countriesMap.set(c.country, (countriesMap.get(c.country) || 0) + c.visitors);
      });
    });

    return Array.from(countriesMap.entries())
      .map(([country, visitors]) => ({ country, visitors }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, limit);
  }
}

export const analyticsService = new AnalyticsService();
