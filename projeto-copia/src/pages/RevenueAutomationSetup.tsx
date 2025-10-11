import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle2, AlertCircle, Loader2, DollarSign, Zap } from 'lucide-react';

export default function RevenueAutomationSetup() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState<any>({});
  const [configured, setConfigured] = useState<string[]>([]);

  const requiredServices = [
    {
      name: 'rapidapi',
      label: 'RapidAPI Key',
      description: 'Para buscar produtos em Alibaba, Amazon, AliExpress',
      placeholder: 'be45bf9b25mshe7d22fbd6e07e9cp169e8djsne8d3d39a4df5',
      help: 'Obtenha em: https://rapidapi.com/hub'
    },
    {
      name: 'openai',
      label: 'OpenAI API Key (ChatGPT)',
      description: 'Para negociações automáticas com IA em tempo real',
      placeholder: 'sk-...',
      help: 'Obtenha em: https://platform.openai.com/api-keys'
    },
    {
      name: 'stripe',
      label: 'Stripe Secret Key',
      description: 'Para receber pagamentos dos compradores',
      placeholder: 'sk_live_...',
      help: 'Obtenha em: https://dashboard.stripe.com/apikeys'
    },
    {
      name: 'amazon_affiliate',
      label: 'Amazon Affiliate Tag',
      description: 'Seu ID de afiliado Amazon (comissão extra 8%)',
      placeholder: 'globalsupps-20',
      help: 'Obtenha em: https://affiliate-program.amazon.com'
    },
    {
      name: 'alibaba',
      label: 'Alibaba Account Email',
      description: 'Email da sua conta Alibaba Dropshipping',
      placeholder: 'seu@email.com',
      help: 'Crie conta em: https://www.alibaba.com'
    },
    {
      name: 'payoneer',
      label: 'Payoneer ID',
      description: 'Para receber comissões internacionais',
      placeholder: 'P12345678',
      help: 'Obtenha em: https://www.payoneer.com'
    },
    {
      name: 'sendgrid',
      label: 'SendGrid API Key (Opcional)',
      description: 'Para enviar propostas por email automaticamente',
      placeholder: 'SG.xxx',
      help: 'Obtenha em: https://app.sendgrid.com/settings/api_keys',
      optional: true
    }
  ];

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('api_credentials')
      .select('service_name, credentials')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (!error && data) {
      const configured = data.map(c => c.service_name);
      setConfigured(configured);
    }
  };

  const saveCredential = async (serviceName: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado',
        variant: 'destructive'
      });
      return;
    }

    const value = credentials[serviceName];
    if (!value) {
      toast({
        title: 'Erro',
        description: 'Preencha o campo',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    // Determinar estrutura da credencial
    let credentialData: any = {};
    
    if (serviceName === 'rapidapi') {
      credentialData = { api_key: value };
    } else if (serviceName === 'openai') {
      credentialData = { api_key: value };
    } else if (serviceName === 'stripe') {
      credentialData = { secret_key: value };
    } else if (serviceName === 'amazon_affiliate') {
      credentialData = { affiliate_tag: value };
    } else if (serviceName === 'alibaba') {
      credentialData = { email: value };
    } else if (serviceName === 'payoneer') {
      credentialData = { payoneer_id: value };
    } else if (serviceName === 'sendgrid') {
      credentialData = { api_key: value };
    }

    const { error } = await supabase
      .from('api_credentials')
      .upsert({
        user_id: user.id,
        service_name: serviceName,
        credentials: credentialData,
        is_active: true
      });

    setLoading(false);

    if (error) {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: '✅ Salvo com sucesso!',
        description: `${serviceName} configurado`,
      });
      setConfigured([...configured, serviceName]);
      setCredentials({ ...credentials, [serviceName]: '' });
    }
  };

  const allConfigured = requiredServices
    .filter(s => !s.optional)
    .every(s => configured.includes(s.name));

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🚀 Configuração do Sistema de Receita</h1>
          <p className="text-muted-foreground mt-2">
            Configure suas credenciais para começar a ganhar comissões SEM INVESTIMENTO
          </p>
        </div>
        {allConfigured && (
          <div className="text-green-600 flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6" />
            <span className="font-semibold">Sistema Pronto!</span>
          </div>
        )}
      </div>

      {/* Explicação do Fluxo */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Como Funciona (ZERO Investimento)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-2xl mb-2">1️⃣</div>
              <div className="text-sm font-semibold">Detecta Oportunidade</div>
              <div className="text-xs text-muted-foreground">APIs buscam arbitragem</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-2xl mb-2">2️⃣</div>
              <div className="text-sm font-semibold">Envia Proposta</div>
              <div className="text-xs text-muted-foreground">Email automático</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-2xl mb-2">3️⃣</div>
              <div className="text-sm font-semibold">Comprador Paga</div>
              <div className="text-xs text-muted-foreground">Stripe/PayPal</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-2xl mb-2">4️⃣</div>
              <div className="text-sm font-semibold">Pedido ao Fornecedor</div>
              <div className="text-xs text-muted-foreground">Automaticamente</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-green-500">
              <div className="text-2xl mb-2">💰</div>
              <div className="text-sm font-semibold text-green-600">Você Recebe Comissão</div>
              <div className="text-xs text-muted-foreground">Payoneer/Stripe</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Credenciais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requiredServices.map(service => (
          <Card key={service.name} className={configured.includes(service.name) ? 'border-green-500' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {configured.includes(service.name) ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                  )}
                  {service.label}
                  {service.optional && (
                    <span className="text-xs text-muted-foreground">(Opcional)</span>
                  )}
                </CardTitle>
              </div>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={service.name}>Credencial</Label>
                <Input
                  id={service.name}
                  type={service.name.includes('key') || service.name === 'stripe' ? 'password' : 'text'}
                  placeholder={service.placeholder}
                  value={credentials[service.name] || ''}
                  onChange={(e) => setCredentials({ ...credentials, [service.name]: e.target.value })}
                  className={configured.includes(service.name) ? 'border-green-500' : ''}
                />
                <p className="text-xs text-muted-foreground mt-1">{service.help}</p>
              </div>
              <Button
                onClick={() => saveCredential(service.name)}
                disabled={loading || !credentials[service.name]}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : configured.includes(service.name) ? (
                  '✅ Atualizar'
                ) : (
                  '💾 Salvar'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Próximos Passos */}
      {allConfigured && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-400">
              ✅ Configuração Completa!
            </CardTitle>
            <CardDescription>Você está pronto para começar a ganhar comissões</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm">Próximos passos:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Vá para o Dashboard e clique em "🔍 Buscar Oportunidades"</li>
                <li>O sistema vai detectar arbitragens em tempo real</li>
                <li>Escolha uma oportunidade e clique em "Iniciar Negociação"</li>
                <li>Proposta enviada automaticamente para comprador</li>
                <li>Quando comprador pagar → Pedido vai para fornecedor</li>
                <li>Você recebe comissão na sua conta Payoneer!</li>
              </ol>
              <Button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Ir para Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
