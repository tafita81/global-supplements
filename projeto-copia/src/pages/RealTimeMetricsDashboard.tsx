import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Target,
  Zap,
  Brain,
  AlertCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function RealTimeMetricsDashboard() {
  const [liveMetrics, setLiveMetrics] = useState<any>(null);
  const [predictions, setPredictions] = useState<any>(null);

  // Buscar métricas em tempo real (atualiza a cada 5 segundos)
  const { data: metricsData, refetch } = useQuery({
    queryKey: ['real-time-metrics'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      // Buscar decisões da IA
      const { data: decisions } = await supabase
        .from('ai_learning_history')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      // Buscar oportunidades
      const { data: opportunities } = await supabase
        .from('opportunities')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      // Buscar conexões B2B
      const { data: connections } = await supabase
        .from('b2b_connections')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      return { decisions: decisions || [], opportunities: opportunities || [], connections: connections || [] };
    },
    refetchInterval: 5000 // Atualiza a cada 5 segundos
  });

  useEffect(() => {
    if (metricsData) {
      // Calcular métricas em tempo real
      const now = new Date();
      const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const decisions24h = metricsData.decisions.filter((d: any) => 
        new Date(d.created_at) >= last24h
      );
      const decisionsWeek = metricsData.decisions.filter((d: any) => 
        new Date(d.created_at) >= lastWeek
      );

      const totalProfit = metricsData.decisions
        .filter((d: any) => d.actual_profit)
        .reduce((sum: number, d: any) => sum + parseFloat(d.actual_profit), 0);

      const avgRiskScore = metricsData.decisions
        .filter((d: any) => d.risk_score)
        .reduce((sum: number, d: any) => sum + parseFloat(d.risk_score), 0) / 
        (metricsData.decisions.filter((d: any) => d.risk_score).length || 1);

      const successRate = metricsData.decisions.filter((d: any) => d.success === true).length / 
        (metricsData.decisions.length || 1) * 100;

      setLiveMetrics({
        total_decisions: metricsData.decisions.length,
        decisions_24h: decisions24h.length,
        decisions_week: decisionsWeek.length,
        total_profit: totalProfit.toFixed(2),
        avg_risk: avgRiskScore.toFixed(1),
        success_rate: successRate.toFixed(1),
        active_opportunities: metricsData.opportunities.filter((o: any) => o.status === 'pending').length,
        active_connections: metricsData.connections.filter((c: any) => c.status === 'pending_negotiation').length
      });

      // Calcular previsões
      const hourlyRate = decisions24h.length / 24;
      const dailyRevenue = decisions24h
        .filter((d: any) => d.actual_profit)
        .reduce((sum: number, d: any) => sum + parseFloat(d.actual_profit), 0);

      setPredictions({
        next_24h_decisions: Math.round(hourlyRate * 24),
        next_week_decisions: Math.round(hourlyRate * 24 * 7),
        projected_daily_revenue: dailyRevenue.toFixed(2),
        projected_weekly_revenue: (dailyRevenue * 7).toFixed(2),
        projected_monthly_revenue: (dailyRevenue * 30).toFixed(2)
      });
    }
  }, [metricsData]);

  // Dados para gráficos
  const decisionTrendData = metricsData?.decisions.slice(0, 20).reverse().map((d: any, idx: number) => ({
    name: `#${idx + 1}`,
    risk: parseFloat(d.risk_score || 0),
    profit: parseFloat(d.expected_profit || 0),
    actual: parseFloat(d.actual_profit || 0)
  })) || [];

  const statusDistribution = [
    { name: 'Executadas', value: metricsData?.decisions.filter((d: any) => d.decision_made === 'EXECUTE').length || 0 },
    { name: 'Rejeitadas', value: metricsData?.decisions.filter((d: any) => d.decision_made === 'REJECT').length || 0 },
    { name: 'Pendentes', value: metricsData?.decisions.filter((d: any) => !d.decision_made).length || 0 }
  ];

  const profitByType = metricsData?.decisions
    .filter((d: any) => d.actual_profit)
    .reduce((acc: any, d: any) => {
      const type = d.decision_type || 'outros';
      if (!acc[type]) acc[type] = 0;
      acc[type] += parseFloat(d.actual_profit);
      return acc;
    }, {});

  const profitChartData = Object.entries(profitByType || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="w-8 h-8 animate-pulse" />
            Painel de Métricas em Tempo Real
          </h1>
          <p className="text-muted-foreground mt-1">
            Atualizações automáticas a cada 5 segundos · Previsões e análises avançadas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium">LIVE</span>
        </div>
      </div>

      {/* Métricas em Tempo Real */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-500" />
              Decisões (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{liveMetrics?.decisions_24h || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +{liveMetrics?.decisions_week || 0} esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-500" />
              Lucro Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              ${liveMetrics?.total_profit || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ${predictions?.projected_daily_revenue || 0}/dia previsto
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-500" />
              Taxa de Sucesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {liveMetrics?.success_rate || 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Risco médio: {liveMetrics?.avg_risk || 0}%
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="w-4 h-4 text-orange-500" />
              IA Ativa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {liveMetrics?.active_opportunities || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {liveMetrics?.active_connections || 0} conexões ativas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Previsões */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Previsões Baseadas em IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Próximas 24h</div>
              <div className="text-2xl font-bold">{predictions?.next_24h_decisions || 0} decisões</div>
              <div className="text-sm text-green-600">≈ ${predictions?.projected_daily_revenue || 0}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Próxima Semana</div>
              <div className="text-2xl font-bold">{predictions?.next_week_decisions || 0} decisões</div>
              <div className="text-sm text-green-600">≈ ${predictions?.projected_weekly_revenue || 0}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Próximo Mês (projeção)</div>
              <div className="text-2xl font-bold text-green-600">${predictions?.projected_monthly_revenue || 0}</div>
              <div className="text-sm text-muted-foreground">Baseado em tendências atuais</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Tendência: Risco vs Lucro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={decisionTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="risk" stroke="#ef4444" name="Risco %" />
                <Line type="monotone" dataKey="profit" stroke="#10b981" name="Lucro Esperado" />
                <Line type="monotone" dataKey="actual" stroke="#3b82f6" name="Lucro Real" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Distribuição de Decisões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Lucro por Tipo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Lucro por Tipo de Decisão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={profitChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" name="Lucro Total ($)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Decisões Recentes em Tempo Real */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Decisões em Tempo Real (Últimas 5)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metricsData?.decisions.slice(0, 5).map((decision: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  {decision.decision_made === 'EXECUTE' ? (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  ) : decision.decision_made === 'REJECT' ? (
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  <div>
                    <div className="font-medium">{decision.decision_type}</div>
                    <div className="text-sm text-muted-foreground">
                      Risco: {decision.risk_score}% · Lucro: ${decision.expected_profit || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={decision.decision_made === 'EXECUTE' ? 'default' : 'destructive'}>
                    {decision.decision_made || 'PENDING'}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(decision.created_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Nota sobre email */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-blue-600" />
            <div className="text-sm">
              <p className="font-semibold text-blue-900">📧 Email Automático Ativado</p>
              <p className="text-blue-700">
                Todas as decisões são enviadas automaticamente para <strong>tafita81@gmail.com</strong> com detalhes completos.
                Configure SendGrid API key em /revenue-automation-setup para ativar.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
