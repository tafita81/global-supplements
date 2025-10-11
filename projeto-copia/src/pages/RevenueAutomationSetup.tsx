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
  const [user, setUser] = useState<any>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

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
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      loadCredentials();
    }
  };

  const handleLogin = async () => {
    if (!authEmail || !authPassword) {
      toast({
        title: 'Erro',
        description: 'Preencha email e senha',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    // Tentar login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword
    });

    if (error) {
      // Se erro, tentar criar conta automaticamente
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: authEmail,
        password: authPassword,
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (signUpError) {
        toast({
          title: 'Erro ao autenticar',
          description: signUpError.message,
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

      setUser(signUpData.user);
      toast({
        title: 'Conta criada!',
        description: 'Você está autenticado e pode salvar credenciais'
      });
    } else {
      setUser(data.user);
      toast({
        title: 'Login realizado!',
        description: 'Você está autenticado'
      });
    }

    setLoading(false);
    loadCredentials();
  };

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

  const importReplitSecrets = async () => {
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Erro',
          description: 'Você precisa estar logado',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${supabase.supabaseUrl}/functions/v1/import-replit-secrets`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        toast({
          title: result.errors ? '⚠️ Importação parcial' : '✅ Importação completa!',
          description: result.message,
          variant: result.errors ? 'default' : 'default'
        });
        
        // Mostrar erros específicos se houver
        if (result.errors && result.errors.length > 0) {
          setTimeout(() => {
            result.errors.forEach((err: any) => {
              toast({
                title: `❌ ${err.service}`,
                description: err.error,
                variant: 'destructive'
              });
            });
          }, 1000);
        }
        
        // Recarregar credenciais
        await loadCredentials();
      } else {
        toast({
          title: 'Erro na importação',
          description: result.message || result.error || 'Erro desconhecido',
          variant: 'destructive'
        });
        
        // Mostrar erros específicos
        if (result.errors && result.errors.length > 0) {
          setTimeout(() => {
            result.errors.forEach((err: any) => {
              toast({
                title: `❌ ${err.service}`,
                description: err.error,
                variant: 'destructive'
              });
            });
          }, 1000);
        }
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao importar',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const allConfigured = requiredServices
    .filter(s => !s.optional)
    .every(s => configured.includes(s.name));

  // Se não está logado, mostrar tela de login
  if (!user) {
    return (
      <div className="container mx-auto p-6 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">🔐 Login Necessário</CardTitle>
            <CardDescription>
              Faça login ou crie uma conta para configurar suas credenciais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="auth-email">Email</Label>
              <Input
                id="auth-email"
                type="email"
                placeholder="seu@email.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auth-password">Senha</Label>
              <Input
                id="auth-password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button 
              onClick={handleLogin} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Autenticando...
                </>
              ) : (
                'Entrar / Criar Conta'
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Se a conta não existir, será criada automaticamente
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🚀 Configuração do Sistema de Receita</h1>
          <p className="text-muted-foreground mt-2">
            Configure suas credenciais para começar a ganhar comissões SEM INVESTIMENTO
          </p>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="text-sm text-muted-foreground">
              {user.email}
            </div>
          )}
          {allConfigured && (
            <div className="text-green-600 flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6" />
              <span className="font-semibold">Sistema Pronto!</span>
            </div>
          )}
        </div>
      </div>

      {/* Botão de Importação Rápida */}
      {user && !allConfigured && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-300">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">⚡ Importação Automática</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Importe automaticamente as credenciais configuradas nos Replit Secrets
                </p>
              </div>
              <Button
                onClick={importReplitSecrets}
                disabled={loading}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importando...
                  </>
                ) : (
                  <>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Importar Credenciais
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
