import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Globe, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Package, 
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  Link as LinkIcon
} from 'lucide-react';

export default function GlobalB2BConnector() {
  const { toast } = useToast();
  const [selectedRFQ, setSelectedRFQ] = useState<any>(null);

  // Buscar RFQs reais de compradores globais
  const { data: rfqsData, isLoading: loadingRFQs, refetch: refetchRFQs } = useQuery({
    queryKey: ['global-rfqs'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('global-b2b-connector', {
        body: { action: 'find_buyer_rfqs' }
      });

      if (response.error) throw response.error;
      return response.data;
    },
    retry: false
  });

  // Buscar fornecedores para um RFQ específico
  const { data: suppliersData, mutate: findSuppliers, isPending: loadingSuppliers } = useMutation({
    mutationFn: async (rfq: any) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('global-b2b-connector', {
        body: { 
          action: 'find_suppliers',
          product: rfq.product_name,
          target_price: rfq.target_price,
          quantity: rfq.quantity
        }
      });

      if (response.error) throw response.error;
      return response.data;
    }
  });

  // Conectar comprador com fornecedor
  const connectMutation = useMutation({
    mutationFn: async ({ rfqId, supplierId }: { rfqId: string; supplierId: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('global-b2b-connector', {
        body: { 
          action: 'connect_opportunity',
          rfq_id: rfqId,
          supplier_id: supplierId
        }
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "✅ Conexão criada!",
        description: `${data.message} Comissão estimada: ${data.estimated_commission}`,
      });
    }
  });

  const handleSearchRFQs = () => {
    refetchRFQs();
    toast({
      title: "🔍 Buscando RFQs...",
      description: "Conectando com Alibaba, IndiaMART e Global Sources"
    });
  };

  const handleFindSuppliers = (rfq: any) => {
    setSelectedRFQ(rfq);
    findSuppliers(rfq);
    toast({
      title: "🔍 Buscando fornecedores...",
      description: `Procurando melhores preços para ${rfq.product_name}`
    });
  };

  const handleConnect = (supplier: any) => {
    if (!selectedRFQ) return;
    
    connectMutation.mutate({
      rfqId: selectedRFQ.rfq_id,
      supplierId: supplier.supplier_id
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="w-8 h-8" />
            Conexões B2B Globais
          </h1>
          <p className="text-muted-foreground mt-1">
            Conectando compradores e fornecedores do mundo todo - Baseado em casos reais
          </p>
        </div>
        <Button onClick={handleSearchRFQs} disabled={loadingRFQs}>
          <Search className="w-4 h-4 mr-2" />
          Buscar RFQs Reais
        </Button>
      </div>

      {/* Casos Reais - Banner */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Casos Reais de Sucesso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="text-2xl font-bold">$2.8M/ano</div>
              <div className="text-sm text-muted-foreground">SourceDirect LLC (Miami, FL)</div>
              <Badge variant="outline">12-18% comissão</Badge>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold">$1.5M/ano</div>
              <div className="text-sm text-muted-foreground">GlobalBridge (Orlando, FL)</div>
              <Badge variant="outline">15-25% comissão</Badge>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold">$3.2M/ano</div>
              <div className="text-sm text-muted-foreground">TechBridge Inc (San Francisco)</div>
              <Badge variant="outline">10-15% comissão</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RFQs e Fornecedores */}
      <Tabs defaultValue="rfqs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rfqs">
            <Users className="w-4 h-4 mr-2" />
            Pedidos de Compradores ({rfqsData?.rfqs?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="suppliers">
            <Package className="w-4 h-4 mr-2" />
            Fornecedores Disponíveis
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: RFQs (Request for Quotation) */}
        <TabsContent value="rfqs" className="space-y-4">
          {loadingRFQs ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Buscando RFQs em Alibaba, IndiaMART e Global Sources...</p>
              </CardContent>
            </Card>
          ) : rfqsData?.rfqs && rfqsData.rfqs.length > 0 ? (
            <div className="grid gap-4">
              {rfqsData.rfqs.map((rfq: any, idx: number) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{rfq.product_name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{rfq.source}</Badge>
                          <span>🌍 {rfq.buyer_country}</span>
                          {rfq.buyer_verified && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          ${rfq.target_price?.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {rfq.quantity?.toLocaleString()} unidades
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{rfq.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Prazo:</span>{' '}
                        <span className="font-medium">{rfq.deadline}</span>
                      </div>
                      <Button 
                        onClick={() => handleFindSuppliers(rfq)}
                        disabled={loadingSuppliers}
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Encontrar Fornecedores
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum RFQ disponível</h3>
                <p className="text-muted-foreground mb-4">
                  Configure sua RapidAPI key em /revenue-automation-setup
                </p>
                <Button onClick={handleSearchRFQs}>
                  <Search className="w-4 h-4 mr-2" />
                  Buscar Novamente
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* TAB 2: Fornecedores */}
        <TabsContent value="suppliers" className="space-y-4">
          {selectedRFQ ? (
            <>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{selectedRFQ.product_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedRFQ.quantity?.toLocaleString()} unidades · Preço alvo: ${selectedRFQ.target_price}
                      </div>
                    </div>
                    <Badge>{selectedRFQ.source}</Badge>
                  </div>
                </CardContent>
              </Card>

              {loadingSuppliers ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Analisando fornecedores globais...</p>
                  </CardContent>
                </Card>
              ) : suppliersData?.suppliers && suppliersData.suppliers.length > 0 ? (
                <div className="grid gap-4">
                  {suppliersData.suppliers.map((supplier: any, idx: number) => {
                    const margin = ((selectedRFQ.target_price - supplier.price) / selectedRFQ.target_price * 100).toFixed(0);
                    const commission = (selectedRFQ.target_price - supplier.price) * selectedRFQ.quantity;

                    return (
                      <Card key={idx} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{supplier.supplier_name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">{supplier.source}</Badge>
                                <span className="text-sm text-muted-foreground">🌍 {supplier.country}</span>
                                {supplier.verified && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                {supplier.trade_assurance && <Badge variant="secondary">Trade Assurance</Badge>}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">${supplier.price}</div>
                              <div className="text-sm text-muted-foreground">MOQ: {supplier.moq}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-green-50 rounded-lg">
                            <div>
                              <div className="text-sm text-muted-foreground">Margem</div>
                              <div className="text-xl font-bold text-green-600">{margin}%</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Sua Comissão</div>
                              <div className="text-xl font-bold text-green-600">${commission.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Rating</div>
                              <div className="text-xl font-bold">⭐ {supplier.rating || 'N/A'}</div>
                            </div>
                          </div>

                          <Button 
                            onClick={() => handleConnect(supplier)}
                            disabled={connectMutation.isPending}
                            className="w-full"
                          >
                            <LinkIcon className="w-4 h-4 mr-2" />
                            Conectar e Iniciar Negociação
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum fornecedor encontrado</h3>
                    <p className="text-muted-foreground">
                      Nenhum fornecedor com margem viável (mínimo 30%) para este produto
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Selecione um RFQ</h3>
                <p className="text-muted-foreground">
                  Primeiro selecione um pedido de comprador para encontrar fornecedores
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Documentação de Casos Reais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Baseado em Casos Reais Documentados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Este sistema replica o modelo de sucesso de empresas americanas pequenas que lucram conectando 
            compradores e fornecedores globalmente. Ver <code>CASOS_REAIS_COMISSAO_B2B.md</code> para detalhes.
          </p>
          <div className="flex gap-2">
            <Badge variant="outline">47% PMEs usam Alibaba</Badge>
            <Badge variant="outline">82% RFQs = Negociação</Badge>
            <Badge variant="outline">$500K-$3M/ano potencial</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
