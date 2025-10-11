import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://twglceexfetejawoumsr.supabase.co';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Verificar autenticação
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    }

    const { opportunityId } = await req.json();

    console.log('🤝 Iniciando negociação automática...');

    // 1. BUSCAR OPORTUNIDADE
    const { data: opportunity, error: oppError } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', opportunityId)
      .single();

    if (oppError || !opportunity) {
      return new Response(JSON.stringify({ error: 'Oportunidade não encontrada' }), { status: 404 });
    }

    // 2. ENVIAR PROPOSTA AO FORNECEDOR (Simulação de API)
    const supplierProposal = await sendSupplierProposal(opportunity);

    // 3. BUSCAR COMPRADOR (Simulação de marketplace API)
    const buyerMatch = await findBuyer(opportunity);

    // 4. CRIAR NEGOCIAÇÃO NO BANCO
    const { data: negotiation, error: negError } = await supabase
      .from('negotiations')
      .insert({
        opportunity_id: opportunityId,
        supplier_id: opportunity.supplier_info?.name || 'Unknown',
        buyer_id: buyerMatch.buyerId,
        product_name: opportunity.product_name,
        quantity: opportunity.moq || 1000,
        unit_price: opportunity.buy_price,
        total_value: (opportunity.buy_price * (opportunity.moq || 1000)),
        commission_rate: 15, // 15% de comissão
        commission_value: ((opportunity.sell_price - opportunity.buy_price) * (opportunity.moq || 1000) * 0.15),
        status: 'pending',
        supplier_response: supplierProposal.message,
        buyer_response: buyerMatch.message,
        payment_method: 'payoneer',
        delivery_terms: 'FOB China',
        estimated_delivery: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (negError) {
      throw new Error(negError.message);
    }

    console.log('✅ Negociação criada:', negotiation.id);

    return new Response(
      JSON.stringify({
        success: true,
        negotiation,
        nextSteps: [
          '1. Fornecedor respondeu: ' + supplierProposal.message,
          '2. Comprador identificado: ' + buyerMatch.buyerId,
          '3. Comissão estimada: $' + negotiation.commission_value.toFixed(2),
          '4. Aguardando confirmação final'
        ]
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Erro na negociação:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

async function sendSupplierProposal(opportunity: any) {
  // Simula envio de proposta via API do marketplace
  // Em produção, seria integração real com Alibaba API, IndiaMART API, etc.
  
  return {
    status: 'sent',
    message: `Proposta aceita. MOQ: ${opportunity.moq} units @ $${opportunity.buy_price}/unit. Lead time: 15 days.`,
    supplierConfirmed: true
  };
}

async function findBuyer(opportunity: any) {
  // Simula busca de comprador via API de marketplaces B2B
  // Em produção, seria integração com Amazon MWS, eBay API, Shopify, etc.
  
  const buyerTypes = [
    { id: 'AMZ-US-HEALTH-001', type: 'Amazon FBA Seller', market: 'US' },
    { id: 'EB-EU-WELLNESS-045', type: 'eBay Power Seller', market: 'EU' },
    { id: 'SHOP-CA-ORGANIC-023', type: 'Shopify Store Owner', market: 'CA' }
  ];

  const buyer = buyerTypes[Math.floor(Math.random() * buyerTypes.length)];

  return {
    buyerId: buyer.id,
    buyerType: buyer.type,
    market: buyer.market,
    message: `Comprador ${buyer.id} interessado. Pagamento via PayPal/Stripe confirmado.`,
    paymentConfirmed: true
  };
}
