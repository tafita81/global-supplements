import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Zap, 
  Target, 
  DollarSign,
  Activity,
  ExternalLink,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QuantumSystemStatus } from "@/components/dashboard/QuantumSystemStatus";

export default function QuantumSystemComplete() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            🚀 SISTEMA QUÂNTICO COMPLETO
          </h1>
          <p className="text-2xl text-muted-foreground mb-6">
            Inteligência Artificial Avançada Gerando Milhões Automaticamente
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => navigate('/')}
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 text-lg"
            >
              <Activity className="h-5 w-5 mr-2" />
              Ver Dashboard Operacional
            </Button>
            <Button 
              onClick={() => navigate('/quantum-arbitrage-engine')}
              size="lg" 
              variant="outline"
              className="px-8 py-4 text-lg"
            >
              <Zap className="h-5 w-5 mr-2" />
              Motor Arbitragem Quântica
            </Button>
          </div>
        </div>

        {/* Sistema Quântico Status Completo - COM DADOS REAIS */}
        <QuantumSystemStatus />

        {/* REMOVED - Estratégias hardcoded devem vir do banco */}
        {/* REMOVED - Características hardcoded (94.7%, 2.3ms, 84.7%, etc) devem usar métricas reais */}
        {/* REMOVED - Como Funciona com valores hardcoded - usar dados reais */}
        {/* REMOVED - Potencial de Lucro com valores estimados hardcoded ($50K, $200K, $500K+) */}

        {/* Navegação para configuração */}
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-3xl text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
              🚀 Próximos Passos
            </CardTitle>
            <CardDescription className="text-xl text-emerald-700 dark:text-emerald-300">
              Configure o sistema para começar a operar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => navigate('/')}
                size="lg" 
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 text-lg"
              >
                <Activity className="h-5 w-5 mr-2" />
                Acessar Dashboard Operacional
              </Button>
              <Button 
                onClick={() => navigate('/practical-implementation')}
                size="lg" 
                variant="outline"
                className="px-8 py-4 text-lg"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Configurar Sistema
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}