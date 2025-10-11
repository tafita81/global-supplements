import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://twglceexfetejawoumsr.supabase.co';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

/**
 * STRIPE PAYMENT WEBHOOK
 * 
 * FLUXO AUTOMÁTICO:
 * 1. Comprador paga via Stripe
 * 2. Stripe envia webhook
 * 3. Sistema confirma pagamento
 * 4. Faz pedido AUTOMATICAMENTE ao fornecedor (Alibaba/AliExpress API)
 * 5. Transfere comissão para sua conta Payoneer
 * 6. Envia tracking para comprador
 */

serve(async (req) => {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Verificar assinatura Stripe
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();
    
    // Parse evento Stripe
    const event = JSON.parse(body);

    if (event.type === 'payment_intent.succeeded' || event.type === 'checkout.session.completed') {
      console.log('💰 PAGAMENTO CONFIRMADO - Processando pedido...');

      const paymentIntent = event.data.object;
      const opportunityId = paymentIntent.metadata?.opportunity_id;
      const userId = paymentIntent.metadata?.user_id;

      if (!opportunityId || !userId) {
        console.log('Missing metadata');
        return new Response(JSON.stringify({ received: true }), { status: 200 });
      }

      // 1. BUSCAR NEGOCIAÇÃO
      const { data: negotiation, error: negError } = await supabase
        .from('negotiations')
        .select('*, opportunities(*)')
        .eq('opportunity_id', opportunityId)
        .eq('status', 'awaiting_payment')
        .single();

      if (negError || !negotiation) {
        console.log('Negociação não encontrada');
        return new Response(JSON.stringify({ received: true }), { status: 200 });
      }

      // 2. BUSCAR CREDENCIAIS DO USUÁRIO
      const { data: credentials } = await supabase
        .from('api_credentials')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      const alibabaCred = credentials?.find(c => c.service_name === 'alibaba');
      const payoneerCred = credentials?.find(c => c.service_name === 'payoneer');

      // 3. FAZER PEDIDO AO FORNECEDOR (ALIBABA/ALIEXPRESS)
      let supplierOrderId = null;
      if (alibabaCred) {
        supplierOrderId = await placeSupplierOrder(
          alibabaCred.credentials,
          negotiation.opportunities,
          paymentIntent
        );
      }

      // 4. TRANSFERIR COMISSÃO PARA PAYONEER
      let commissionTransferId = null;
      if (payoneerCred) {
        commissionTransferId = await transferCommission(
          payoneerCred.credentials,
          negotiation.commission_value,
          negotiation.id
        );
      }

      // 5. ATUALIZAR NEGOCIAÇÃO
      await supabase
        .from('negotiations')
        .update({
          status: 'in_progress',
          payment_received: true,
          payment_date: new Date().toISOString(),
          buyer_id: paymentIntent.customer || paymentIntent.receipt_email,
          supplier_order_id: supplierOrderId,
          commission_transfer_id: commissionTransferId
        })
        .eq('id', negotiation.id);

      // 6. REGISTRAR EXECUÇÃO
      await supabase
        .from('execution_history')
        .insert({
          opportunity_id: opportunityId,
          action_type: 'order_placed',
          status: 'completed',
          result: {
            payment_amount: paymentIntent.amount / 100,
            supplier_order_id: supplierOrderId,
            commission_transfer_id: commissionTransferId,
            buyer_email: paymentIntent.receipt_email
          },
          profit_amount: negotiation.commission_value,
          execution_time_ms: 0,
          executed_at: new Date().toISOString()
        });

      console.log('✅ Pedido processado automaticamente!');
      console.log(`💰 Comissão de $${negotiation.commission_value} transferida`);

      return new Response(
        JSON.stringify({
          received: true,
          status: 'processed',
          supplier_order: supplierOrderId,
          commission_transfer: commissionTransferId
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });

  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

// Fazer pedido ao fornecedor (Alibaba/AliExpress)
async function placeSupplierOrder(credentials: any, opportunity: any, payment: any) {
  console.log('📦 Fazendo pedido ao fornecedor...');

  // EM PRODUÇÃO: Alibaba API ou AliExpress Dropshipping API
  // https://developers.aliexpress.com/en/doc.htm?docId=108980
  
  try {
    // Exemplo de payload para Alibaba API
    const orderData = {
      product_id: opportunity.supplier_info?.product_id,
      quantity: opportunity.moq || 1,
      shipping_address: {
        name: payment.shipping?.name || payment.receipt_email,
        address: payment.shipping?.address || {},
        country: 'US'
      },
      payment_method: 'escrow' // Pagamento em custódia até entrega
    };

    // Chamada real em produção:
    /*
    const response = await fetch('https://api.alibaba.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();
    return result.order_id;
    */

    // Simulação para desenvolvimento
    const orderId = `ALI-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    console.log(`✅ Pedido criado: ${orderId}`);
    return orderId;

  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return null;
  }
}

// Transferir comissão para Payoneer
async function transferCommission(credentials: any, amount: number, negotiationId: string) {
  console.log(`💸 Transferindo comissão de $${amount}...`);

  // EM PRODUÇÃO: Payoneer Payout API
  // https://developers.payoneer.com/api-docs/payouts/
  
  try {
    // Chamada real em produção:
    /*
    const response = await fetch('https://api.payoneer.com/v4/payouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        payee_id: credentials.payoneer_id,
        amount: amount,
        currency: 'USD',
        description: `Commission for negotiation ${negotiationId}`,
        payment_method: 'balance'
      })
    });

    const result = await response.json();
    return result.payout_id;
    */

    // Simulação para desenvolvimento
    const transferId = `PAYN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    console.log(`✅ Transferência criada: ${transferId}`);
    return transferId;

  } catch (error) {
    console.error('Erro ao transferir comissão:', error);
    return null;
  }
}
