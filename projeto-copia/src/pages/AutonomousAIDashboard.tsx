import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Brain, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Lightbulb,
  Zap,
  Target,
  AlertTriangle,
  Activity
} from 'lucide-react';

export default function AutonomousAIDashboard() {
  const { toast } = useToast();
  const [autoMode, setAutoMode] = useState(false);

  // Buscar estatísticas de aprendizado
  const { data: learningStats, refetch: refetchStats } = useQuery({
    queryKey: ['learning-stats'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('ai_learning_history')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const total = data.length;
      const successes = data.filter(d => d.success === true).length;
      const failures = data.filter(d => d.success === false).length;
      const totalProfit = data
        .filter(d => d.actual_profit)
        .reduce((sum, d) => sum + parseFloat(d.actual_profit), 0);

      return {
        total,
        successes,
        failures,
        successRate: total > 0 ? (successes / total * 100).toFixed(1) : 0,
        totalProfit: totalProfit.toFixed(2),
        avgProfit: total > 0 ? (totalProfit / total).toFixed(2) : 0,
        recentDecisions: data.slice(0, 10)
      };
    }
  });

  // Analisar e decidir
  const analyzeMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('autonomous-ai-agent', {
        body: { action: 'analyze_and_decide' }
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "✅ Análise concluída!",
        description: `${data.approved} oportunidades aprovadas, ${data.rejected} rejeitadas`,
      });
      refetchStats();
    }
  });

  // Aprender com histórico
  const learnMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('autonomous-ai-agent', {
        body: { action: 'learn_from_history' }
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "🧠 IA evoluiu!",
        description: `Taxa de sucesso: ${data.success_rate}. Novos insights aprendidos.`,
      });
    }
  });

  // Execução automática
  const autoExecuteMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('autonomous-ai-agent', {
        body: { action: 'auto_execute' }
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "⚡ Execução automática!",
        description: `${data.total_executed} oportunidades executadas automaticamente`,
      });
      refetchStats();
    }
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="w-8 h-8" />
            IA Autônoma - Aprendizado Contínuo
          </h1>
          <p className="text-muted-foreground mt-1">
            Sistema que aprende com histórico e toma decisões automáticas calculadas
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={autoMode ? "destructive" : "default"}
            onClick={() => setAutoMode(!autoMode)}
          >
            <Zap className="w-4 h-4 mr-2" />
            {autoMode ? "Parar Auto-Execução" : "Ativar Auto-Execução"}
          </Button>
        </div>
      </div>

      {/* Estatísticas de Aprendizado */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total de Decisões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{learningStats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">Decisões analisadas pela IA</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Taxa de Sucesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{learningStats?.successRate || 0}%</div>
            <Progress value={parseFloat(learningStats?.successRate || '0')} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Lucro Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">${learningStats?.totalProfit || 0}</div>
            <p className="text-xs text-muted-foreground">Gerado pela IA</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-500" />
              Lucro Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">${learningStats?.avgProfit || 0}</div>
            <p className="text-xs text-muted-foreground">Por decisão</p>
          </CardContent>
        </Card>
      </div>

      {/* Ações da IA */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Analisar e Decidir
            </CardTitle>
            <CardDescription>
              IA analisa oportunidades e decide automaticamente com base no aprendizado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => analyzeMutation.mutate()}
              disabled={analyzeMutation.isPending}
              className="w-full"
            >
              {analyzeMutation.isPending ? 'Analisando...' : 'Iniciar Análise'}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Aprender com Histórico
            </CardTitle>
            <CardDescription>
              IA identifica padrões de sucesso/falha e evolui suas regras
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => learnMutation.mutate()}
              disabled={learnMutation.isPending}
              className="w-full"
              variant="outline"
            >
              {learnMutation.isPending ? 'Aprendendo...' : 'Evoluir IA'}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Execução Automática
            </CardTitle>
            <CardDescription>
              IA executa automaticamente oportunidades validadas e seguras
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => autoExecuteMutation.mutate()}
              disabled={autoExecuteMutation.isPending}
              className="w-full"
              variant="secondary"
            >
              {autoExecuteMutation.isPending ? 'Executando...' : 'Executar Agora'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Decisões Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Decisões Recentes da IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          {learningStats?.recentDecisions && learningStats.recentDecisions.length > 0 ? (
            <div className="space-y-3">
              {learningStats.recentDecisions.map((decision: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {decision.success ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : decision.success === false ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    )}
                    <div>
                      <div className="font-medium">{decision.decision_type}</div>
                      <div className="text-sm text-muted-foreground">
                        Risco: {decision.risk_score}% | 
                        Lucro esperado: ${decision.expected_profit || 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={decision.decision_made === 'EXECUTE' ? 'default' : 'destructive'}>
                      {decision.decision_made || 'PENDING'}
                    </Badge>
                    {decision.actual_profit && (
                      <div className="text-sm font-bold text-green-600 mt-1">
                        ${decision.actual_profit}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma decisão ainda. A IA começará a aprender quando você iniciar a análise.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Aviso Importante */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-yellow-900 mb-1">⚠️ Aviso Importante</p>
              <p className="text-yellow-800">
                A IA aprende com dados históricos e toma decisões calculadas, mas <strong>não pode garantir 100% de sucesso ou "milhões por semana"</strong>. 
                O sistema minimiza riscos, mas investimentos sempre envolvem incerteza. 
                Configure sua OpenAI API key em /revenue-automation-setup para ativar.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
