import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Package, TrendingUp, AlertCircle, CheckCircle, XCircle } from "lucide-react";

export default function RFQMatcher() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("matches");

  // Fetch RFQs
  const { data: rfqs = [], isLoading: loadingRFQs } = useQuery({
    queryKey: ['rfqs'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('rfqs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    }
  });

  // Fetch Matches
  const { data: matches = [], isLoading: loadingMatches } = useQuery({
    queryKey: ['rfq_matches'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('rfq_matches')
        .select(`
          *,
          rfqs (*),
          supplier_inventory (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    }
  });

  // Fetch Suppliers
  const { data: suppliers = [], isLoading: loadingSuppliers } = useQuery({
    queryKey: ['supplier_inventory'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('supplier_inventory')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    }
  });

  // Run Matcher
  const matcherMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('rfq-supplier-matcher', {
        body: { action: 'match_rfqs' },
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(`✅ ${data.message}`);
      queryClient.invalidateQueries({ queryKey: ['rfqs'] });
      queryClient.invalidateQueries({ queryKey: ['rfq_matches'] });
    },
    onError: (error: any) => {
      toast.error(`Erro: ${error.message}`);
    }
  });

  // Add RFQ
  const addRFQMutation = useMutation({
    mutationFn: async (formData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('rfqs')
        .insert({
          user_id: user.id,
          source: 'manual',
          ...formData
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('✅ RFQ adicionado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['rfqs'] });
      setActiveTab('matches');
    }
  });

  // Add Supplier
  const addSupplierMutation = useMutation({
    mutationFn: async (formData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('supplier_inventory')
        .insert({
          user_id: user.id,
          supplier_source: 'manual',
          ...formData
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('✅ Fornecedor adicionado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['supplier_inventory'] });
      setActiveTab('matches');
    }
  });

  const pendingRFQs = rfqs.filter(r => r.status === 'pending');
  const matchedRFQs = rfqs.filter(r => r.status === 'matched');
  const executeMatches = matches.filter(m => m.ai_decision === 'EXECUTE');
  const rejectMatches = matches.filter(m => m.ai_decision === 'REJECT');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">🎯 RFQ Matcher</h1>
          <p className="text-muted-foreground">Sistema Inteligente de Matching RFQ → Fornecedor</p>
        </div>
        <Button 
          onClick={() => matcherMutation.mutate()}
          disabled={matcherMutation.isPending}
          size="lg"
        >
          <Search className="mr-2 h-4 w-4" />
          {matcherMutation.isPending ? 'Buscando...' : 'Buscar Matches'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">RFQs Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRFQs.length}</div>
            <p className="text-xs text-muted-foreground">Aguardando match</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Matches Encontrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{matches.length}</div>
            <p className="text-xs text-muted-foreground">{executeMatches.length} para executar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fornecedores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
            <p className="text-xs text-muted-foreground">Na base de dados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {matches.length > 0 ? Math.round((executeMatches.length / matches.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Decisões EXECUTE</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="matches">Matches ({matches.length})</TabsTrigger>
          <TabsTrigger value="rfqs">RFQs ({rfqs.length})</TabsTrigger>
          <TabsTrigger value="suppliers">Fornecedores ({suppliers.length})</TabsTrigger>
          <TabsTrigger value="add">➕ Adicionar</TabsTrigger>
        </TabsList>

        {/* Matches Tab */}
        <TabsContent value="matches" className="space-y-4">
          {loadingMatches ? (
            <div className="text-center py-8">Carregando matches...</div>
          ) : matches.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum match encontrado ainda</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Clique em "Buscar Matches" para encontrar oportunidades
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {matches.map((match: any) => (
                <Card key={match.id} className={match.ai_decision === 'EXECUTE' ? 'border-green-500' : 'border-red-500'}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {match.ai_decision === 'EXECUTE' ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          {match.rfqs?.product_name}
                        </CardTitle>
                        <CardDescription>
                          Fornecedor: {match.supplier_inventory?.supplier_name}
                        </CardDescription>
                      </div>
                      <Badge variant={match.ai_decision === 'EXECUTE' ? 'default' : 'destructive'}>
                        {match.ai_decision}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="font-semibold">Margem</p>
                        <p className={match.margin_percentage > 25 ? 'text-green-600' : match.margin_percentage > 15 ? 'text-yellow-600' : 'text-red-600'}>
                          {match.margin_percentage?.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">Risco</p>
                        <p className={match.risk_score < 30 ? 'text-green-600' : match.risk_score < 60 ? 'text-yellow-600' : 'text-red-600'}>
                          {match.risk_score?.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">Prazo Entrega</p>
                        <p className={match.meets_deadline ? 'text-green-600' : 'text-red-600'}>
                          {match.total_delivery_days} dias {match.meets_deadline ? '✅' : '❌'}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">Receita Esperada</p>
                        <p className="text-green-600">${match.expected_revenue?.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm font-semibold mb-1">Raciocínio da IA:</p>
                      <p className="text-sm text-muted-foreground">{match.ai_reasoning}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* RFQs Tab */}
        <TabsContent value="rfqs" className="space-y-4">
          {loadingRFQs ? (
            <div className="text-center py-8">Carregando RFQs...</div>
          ) : rfqs.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum RFQ cadastrado</p>
                <Button className="mt-4" onClick={() => setActiveTab('add')}>
                  Adicionar Primeiro RFQ
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {rfqs.map((rfq: any) => (
                <Card key={rfq.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{rfq.product_name}</CardTitle>
                      <Badge variant={
                        rfq.status === 'pending' ? 'secondary' :
                        rfq.status === 'matched' ? 'default' :
                        rfq.status === 'executed' ? 'default' : 'destructive'
                      }>
                        {rfq.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="font-semibold">Quantidade</p>
                        <p>{rfq.quantity} {rfq.unit}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Preço Alvo</p>
                        <p>${rfq.target_price?.toFixed(2) || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Localização</p>
                        <p>{rfq.buyer_location}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Prazo Esperado</p>
                        <p>{rfq.expected_delivery_days} dias</p>
                      </div>
                    </div>
                    {rfq.product_description && (
                      <div className="bg-muted p-2 rounded text-sm">
                        {rfq.product_description}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers" className="space-y-4">
          {loadingSuppliers ? (
            <div className="text-center py-8">Carregando fornecedores...</div>
          ) : suppliers.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum fornecedor cadastrado</p>
                <Button className="mt-4" onClick={() => setActiveTab('add')}>
                  Adicionar Primeiro Fornecedor
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {suppliers.map((supplier: any) => (
                <Card key={supplier.id}>
                  <CardHeader>
                    <CardTitle>{supplier.product_name}</CardTitle>
                    <CardDescription>{supplier.supplier_name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="font-semibold">Estoque</p>
                        <p>{supplier.quantity_available}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Preço Unit.</p>
                        <p>${supplier.unit_price}</p>
                      </div>
                      <div>
                        <p className="font-semibold">MOQ</p>
                        <p>{supplier.moq || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Lead Time</p>
                        <p>{supplier.lead_time_days} dias</p>
                      </div>
                      <div>
                        <p className="font-semibold">Local</p>
                        <p>{supplier.supplier_location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Add Tab */}
        <TabsContent value="add" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add RFQ Form */}
            <Card>
              <CardHeader>
                <CardTitle>Adicionar RFQ (Pedido Comprador)</CardTitle>
                <CardDescription>
                  Insira manualmente ou será importado via Alibaba/IndiaMART APIs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  addRFQMutation.mutate({
                    product_name: formData.get('product_name'),
                    product_description: formData.get('product_description'),
                    quantity: parseInt(formData.get('quantity') as string),
                    unit: formData.get('unit'),
                    target_price: parseFloat(formData.get('target_price') as string),
                    buyer_location: formData.get('buyer_location'),
                    expected_delivery_days: parseInt(formData.get('expected_delivery_days') as string),
                    buyer_name: formData.get('buyer_name'),
                    buyer_email: formData.get('buyer_email'),
                    status: 'pending'
                  });
                  e.currentTarget.reset();
                }} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product_name">Nome do Produto *</Label>
                    <Input id="product_name" name="product_name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product_description">Descrição</Label>
                    <Textarea id="product_description" name="product_description" rows={2} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantidade *</Label>
                      <Input id="quantity" name="quantity" type="number" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unidade *</Label>
                      <Input id="unit" name="unit" placeholder="pcs, kg, boxes" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target_price">Preço Alvo (USD)</Label>
                    <Input id="target_price" name="target_price" type="number" step="0.01" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyer_location">Localização Comprador *</Label>
                    <Input id="buyer_location" name="buyer_location" placeholder="Orlando, FL, USA" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expected_delivery_days">Prazo Esperado (dias) *</Label>
                    <Input id="expected_delivery_days" name="expected_delivery_days" type="number" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyer_name">Nome Comprador</Label>
                    <Input id="buyer_name" name="buyer_name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyer_email">Email Comprador</Label>
                    <Input id="buyer_email" name="buyer_email" type="email" />
                  </div>
                  <Button type="submit" className="w-full" disabled={addRFQMutation.isPending}>
                    {addRFQMutation.isPending ? 'Adicionando...' : 'Adicionar RFQ'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Add Supplier Form */}
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Fornecedor</CardTitle>
                <CardDescription>
                  Insira manualmente ou será importado via Inventory Source API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  addSupplierMutation.mutate({
                    supplier_name: formData.get('supplier_name'),
                    product_name: formData.get('product_name'),
                    sku: formData.get('sku'),
                    quantity_available: parseInt(formData.get('quantity_available') as string),
                    unit_price: parseFloat(formData.get('unit_price') as string),
                    moq: parseInt(formData.get('moq') as string) || null,
                    lead_time_days: parseInt(formData.get('lead_time_days') as string),
                    supplier_location: formData.get('supplier_location'),
                    warehouse_zip: formData.get('warehouse_zip')
                  });
                  e.currentTarget.reset();
                }} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplier_name">Nome Fornecedor *</Label>
                    <Input id="supplier_name" name="supplier_name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product_name">Nome do Produto *</Label>
                    <Input id="product_name" name="product_name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input id="sku" name="sku" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity_available">Estoque *</Label>
                      <Input id="quantity_available" name="quantity_available" type="number" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit_price">Preço Unit. (USD) *</Label>
                      <Input id="unit_price" name="unit_price" type="number" step="0.01" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="moq">MOQ (Mínimo)</Label>
                    <Input id="moq" name="moq" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lead_time_days">Lead Time (dias) *</Label>
                    <Input id="lead_time_days" name="lead_time_days" type="number" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier_location">Localização *</Label>
                    <Input id="supplier_location" name="supplier_location" placeholder="Shenzhen, China" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warehouse_zip">CEP/ZIP Warehouse *</Label>
                    <Input id="warehouse_zip" name="warehouse_zip" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={addSupplierMutation.isPending}>
                    {addSupplierMutation.isPending ? 'Adicionando...' : 'Adicionar Fornecedor'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
