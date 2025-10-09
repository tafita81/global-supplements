import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Cpu, Zap, TrendingUp, AlertTriangle, Settings, Activity } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AISystem() {
  const { t } = useTranslation();

  // Dados dos módulos IA REAIS que estão no sistema
  const realAiModules = [
    {
      name: "Opportunity Detector",
      status: "active",
      performance: 0, // Será calculado com base em detecções reais
      description: "Detecção automática de oportunidades em marketplaces globais",
      lastUpdate: new Date().toISOString()
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "training": return "warning";
      case "inactive": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Activity className="h-4 w-4" />;
      case "training": return <Brain className="h-4 w-4" />;
      case "inactive": return <AlertTriangle className="h-4 w-4" />;
      default: return <Cpu className="h-4 w-4" />;
    }
  };

  const activeModules = realAiModules.filter(m => m.status === "active").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('aiSystem.title')}</h1>
          <p className="text-muted-foreground">
            {t('aiSystem.subtitle')}
          </p>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          {t('aiSystem.configurations')}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('aiSystem.activeModules')}</p>
                <p className="text-2xl font-bold">{activeModules}</p>
              </div>
              <Brain className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('aiSystem.averagePerformance')}</p>
                <p className="text-2xl font-bold">0%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('aiSystem.processing')}</p>
                <p className="text-2xl font-bold">{t('aiSystem.realTime')}</p>
              </div>
              <Zap className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('aiSystem.uptime')}</p>
                <p className="text-2xl font-bold">0%</p>
              </div>
              <Activity className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="modules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="modules">{t('aiSystem.tabs.modules')}</TabsTrigger>
          <TabsTrigger value="training">{t('aiSystem.tabs.training')}</TabsTrigger>
          <TabsTrigger value="logs">{t('aiSystem.tabs.logs')}</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          <div className="grid gap-4">
            {realAiModules.map((module, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {getStatusIcon(module.status)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(module.status) as any}>
                      {t(`aiSystem.status.${module.status}`)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">{t('aiSystem.performance')}</h4>
                      <div className="space-y-2">
                        <Progress value={module.performance} className="h-2" />
                        <p className="text-sm font-medium text-muted-foreground">
                          {module.performance}%
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">{t('aiSystem.lastUpdate')}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(module.lastUpdate).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm">
                      {t('aiSystem.configure')}
                    </Button>
                    <Button variant="outline" size="sm">
                      {t('aiSystem.logs')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {realAiModules.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Nenhum Módulo Ativo</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure módulos de IA para começar a análise automática.
                </p>
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar Módulos
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle>{t('aiSystem.training')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Dados de treinamento serão exibidos quando houver atividade de IA.
              </p>
              <Button variant="outline">
                <Brain className="h-4 w-4 mr-2" />
                Ver Histórico de Treinamento
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>{t('aiSystem.logs')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Logs de sistema serão exibidos quando houver atividade.
              </p>
              <Button variant="outline">
                Ver Todos os Logs
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
