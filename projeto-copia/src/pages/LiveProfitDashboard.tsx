import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  Zap, 
  Target,
  Clock,
  CreditCard,
  Globe,
  Activity,
  ArrowUp,
  Wallet,
  Banknote,
  RefreshCw
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfitData {
  id: string;
  created_at: string;
  amount: number;
  source: string;
  type: "contract_payment" | "arbitrage_profit" | "commission" | "bonus";
  status: "pending" | "processing" | "completed";
}

interface LiveMetrics {
  totalToday: number;
  totalWeek: number;
  totalMonth: number;
  activeContracts: number;
  pendingPayments: number;
  averageMargin: number;
  profitVelocity: number;
}

export default function LiveProfitDashboard() {
  const [profits, setProfits] = useState<ProfitData[]>([]);
  const [metrics, setMetrics] = useState<LiveMetrics>({
    totalToday: 0,
    totalWeek: 0,
    totalMonth: 0,
    activeContracts: 0,
    pendingPayments: 0,
    averageMargin: 0,
    profitVelocity: 0
  });
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    loadProfitsData();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('campaign_performance_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'campaign_performance' },
        () => {
          loadProfitsData();
        }
      )
      .subscribe();

    // Auto refresh every 30 seconds
    const interval = setInterval(loadProfitsData, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const loadProfitsData = async () => {
    try {
      // Calculate date ranges
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Get revenue data from campaign_performance (using type assertion)
      const { data: performanceData } = await supabase
        .from('campaign_performance' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Transform performance data into profit format
      const transformedProfits: ProfitData[] = (performanceData || []).map((p: any) => ({
        id: p.id,
        created_at: p.created_at,
        amount: Number(p.revenue || 0),
        source: `Campaign ${p.campaign_id?.substring(0, 8) || 'Unknown'}`,
        type: 'commission' as const,
        status: 'completed' as const
      }));

      setProfits(transformedProfits);

      // Calculate totals from campaign_performance
      const { data: todayData } = await supabase
        .from('campaign_performance' as any)
        .select('revenue')
        .gte('created_at', startOfToday.toISOString());
      
      const totalToday = todayData?.reduce((sum: number, p: any) => sum + Number(p.revenue || 0), 0) || 0;

      const { data: weekData } = await supabase
        .from('campaign_performance' as any)
        .select('revenue')
        .gte('created_at', startOfWeek.toISOString());
      
      const totalWeek = weekData?.reduce((sum: number, p: any) => sum + Number(p.revenue || 0), 0) || 0;

      const { data: monthData } = await supabase
        .from('campaign_performance' as any)
        .select('revenue, clicks')
        .gte('created_at', startOfMonth.toISOString());
      
      const totalMonth = monthData?.reduce((sum: number, p: any) => sum + Number(p.revenue || 0), 0) || 0;

      // Count active campaigns
      const { count: adsCount } = await supabase
        .from('google_ads_campaigns' as any)
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const { count: emailCount } = await supabase
        .from('email_campaigns' as any)
        .select('*', { count: 'exact', head: true })
        .in('status', ['scheduled', 'sending']);

      const activeContracts = (adsCount || 0) + (emailCount || 0);

      // Count pending operations (using social media posts as proxy)
      const { count: pendingCount } = await supabase
        .from('social_media_posts' as any)
        .select('*', { count: 'exact', head: true })
        .eq('status', 'scheduled');

      // Calculate ROI from campaign data
      const totalRevenue = monthData?.reduce((sum: number, p: any) => sum + Number(p.revenue || 0), 0) || 0;
      const totalClicks = monthData?.reduce((sum: number, p: any) => sum + Number(p.clicks || 0), 0) || 1;
      const averageMargin = totalClicks > 0 ? (totalRevenue / totalClicks) * 10 : 0;

      setMetrics({
        totalToday,
        totalWeek,
        totalMonth,
        activeContracts,
        pendingPayments: pendingCount || 0,
        averageMargin: Number(averageMargin.toFixed(2)),
        profitVelocity: totalToday / 24
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading profits:', error);
      toast.error('Erro ao carregar dados de lucros');
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "contract_payment": return <Banknote className="h-4 w-4" />;
      case "arbitrage_profit": return <TrendingUp className="h-4 w-4" />;
      case "commission": return <Wallet className="h-4 w-4" />;
      case "bonus": return <Zap className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-50";
      case "processing": return "text-blue-600 bg-blue-50";
      case "pending": return "text-yellow-600 bg-yellow-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard de Lucros</h1>
            <p className="text-muted-foreground">Carregando dados reais...</p>
          </div>
          <RefreshCw className="h-6 w-6 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Activity className="h-8 w-8 text-green-600" />
            Dashboard de Lucros em Tempo Real
          </h1>
          <p className="text-muted-foreground">
            Métricas baseadas em dados reais do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className={`px-4 py-2 ${isLive ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            {isLive ? 'LIVE' : 'OFFLINE'}
          </Badge>
          <Button variant="outline" size="sm" onClick={loadProfitsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Lucro Hoje</p>
                <p className="text-3xl font-bold text-green-700">
                  ${metrics.totalToday.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  {metrics.totalWeek > 0 ? ((metrics.totalToday / metrics.totalWeek) * 100).toFixed(1) : '0'}% da semana
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Lucro Semanal</p>
                <p className="text-3xl font-bold text-blue-700">
                  ${metrics.totalWeek.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Últimos 7 dias
                </p>
              </div>
              <TrendingUp className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">Velocidade $/h</p>
                <p className="text-3xl font-bold text-purple-700">
                  ${Math.floor(metrics.profitVelocity).toLocaleString()}
                </p>
                <p className="text-xs text-purple-600">Por hora hoje</p>
              </div>
              <Zap className="h-12 w-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-800">ROI Médio</p>
                <p className="text-3xl font-bold text-orange-700">
                  {metrics.averageMargin.toFixed(1)}%
                </p>
                <p className="text-xs text-orange-600">{metrics.activeContracts} campanhas ativas</p>
              </div>
              <Target className="h-12 w-12 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Lucros Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profits.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {profits.map((profit) => (
                  <div key={profit.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-100">
                        {getTypeIcon(profit.type)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{profit.source}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(profit.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        +${Number(profit.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                      <Badge className={getStatusColor(profit.status)} variant="secondary">
                        {profit.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Nenhum dado de lucro disponível. 
                <br />
                <span className="text-sm">Os lucros são baseados em dados de 'campaign_performance' do banco.</span>
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Estatísticas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Lucro Mensal vs Meta</span>
                <span className="text-sm font-bold">
                  ${metrics.totalMonth.toLocaleString()}
                </span>
              </div>
              <Progress value={Math.min((metrics.totalMonth / 1000000) * 100, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Meta: $1,000,000</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{metrics.activeContracts}</p>
                <p className="text-xs text-blue-600">Campanhas Ativas</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{metrics.pendingPayments}</p>
                <p className="text-xs text-yellow-600">Pagamentos Pendentes</p>
              </div>
            </div>

            <Button className="w-full mt-4" variant="outline">
              <Globe className="h-4 w-4 mr-2" />
              Ver Relatório Completo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
