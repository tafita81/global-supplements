import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RFQ {
  id: string;
  product_name: string;
  quantity: number;
  buyer_location: string;
  expected_delivery_days: number;
  target_price?: number;
}

interface Supplier {
  id: string;
  supplier_name: string;
  product_name: string;
  quantity_available: number;
  unit_price: number;
  lead_time_days: number;
  warehouse_zip: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { action, rfq_id, supplier_id } = await req.json();

    // AÇÃO 1: Buscar RFQs pendentes e fazer matching automático
    if (action === 'match_rfqs') {
      const { data: pendingRFQs, error: rfqError } = await supabaseClient
        .from('rfqs')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(20);

      if (rfqError) throw rfqError;

      const matches = [];

      for (const rfq of (pendingRFQs || [])) {
        // Buscar fornecedores com produto similar
        const { data: suppliers, error: supplierError } = await supabaseClient
          .from('supplier_inventory')
          .select('*')
          .eq('user_id', user.id)
          .ilike('product_name', `%${rfq.product_name}%`)
          .gte('quantity_available', rfq.quantity)
          .order('unit_price', { ascending: true })
          .limit(5);

        if (supplierError) throw supplierError;

        for (const supplier of (suppliers || [])) {
          // Calcular prazo de entrega (simplificado - depois integrar ShipStation API)
          const estimatedShippingDays = calculateShippingDays(supplier.warehouse_zip, rfq.buyer_location);
          const totalDeliveryDays = supplier.lead_time_days + estimatedShippingDays;
          const meetsDeadline = totalDeliveryDays <= rfq.expected_delivery_days;

          // Calcular custos e margem
          const totalCost = (supplier.unit_price * rfq.quantity) + calculateShippingCost(supplier.warehouse_zip, rfq.buyer_location, rfq.quantity);
          const expectedRevenue = rfq.target_price ? (rfq.target_price * rfq.quantity) : totalCost * 1.3;
          const marginPercentage = ((expectedRevenue - totalCost) / expectedRevenue) * 100;
          const riskScore = calculateRiskScore(marginPercentage, meetsDeadline, totalDeliveryDays);

          // IA decide (integrar com OpenAI depois)
          const aiDecision = riskScore < 30 ? 'EXECUTE' : 'REJECT';
          const aiReasoning = generateAIReasoning(rfq, supplier, marginPercentage, riskScore, meetsDeadline);

          // Salvar match
          const { data: match, error: matchError } = await supabaseClient
            .from('rfq_matches')
            .insert({
              user_id: user.id,
              rfq_id: rfq.id,
              supplier_id: supplier.id,
              shipping_carrier: 'FedEx', // Placeholder
              shipping_days: estimatedShippingDays,
              shipping_cost: calculateShippingCost(supplier.warehouse_zip, rfq.buyer_location, rfq.quantity),
              total_delivery_days: totalDeliveryDays,
              meets_deadline: meetsDeadline,
              total_cost: totalCost,
              expected_revenue: expectedRevenue,
              margin_percentage: marginPercentage,
              risk_score: riskScore,
              ai_decision: aiDecision,
              ai_reasoning: aiReasoning,
              status: 'analyzed'
            })
            .select()
            .single();

          if (!matchError && match) {
            matches.push(match);
          }
        }

        // Atualizar status do RFQ se encontrou matches
        if (matches.length > 0) {
          await supabaseClient
            .from('rfqs')
            .update({ status: 'matched', updated_at: new Date().toISOString() })
            .eq('id', rfq.id);
        }
      }

      // Enviar email com matches (integrar com SendGrid depois)
      if (matches.length > 0) {
        await sendMatchNotification(user.id, matches, supabaseClient);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `${matches.length} matches encontrados`,
          matches 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // AÇÃO 2: Buscar RFQs via API Alibaba (quando disponível)
    if (action === 'fetch_alibaba_rfqs') {
      // Placeholder - implementar quando tiver Alibaba API
      const alibabaApiKey = Deno.env.get('ALIBABA_API_KEY');
      const alibabaAccessToken = Deno.env.get('ALIBABA_ACCESS_TOKEN');

      if (!alibabaApiKey || !alibabaAccessToken) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Alibaba API não configurada. Configure em /revenue-automation-setup' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      // Chamar Alibaba API aqui
      // const rfqs = await fetchAlibabaRFQs(alibabaAccessToken);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Alibaba RFQ fetch será implementado quando API estiver disponível' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // AÇÃO 3: Buscar fornecedores via API Inventory Source (quando disponível)
    if (action === 'fetch_suppliers') {
      const inventorySourceKey = Deno.env.get('INVENTORY_SOURCE_API_KEY');

      if (!inventorySourceKey) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Inventory Source API não configurada' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      // Implementar busca via Inventory Source API aqui
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Inventory Source fetch será implementado quando API estiver disponível' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Ação inválida' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Funções auxiliares
function calculateShippingDays(fromZip: string, toLocation: string): number {
  // Placeholder - integrar com ShipStation/Shippo API depois
  if (toLocation.includes('China') || fromZip.startsWith('3')) {
    return 12; // Internacional
  }
  return 3; // Doméstico
}

function calculateShippingCost(fromZip: string, toLocation: string, quantity: number): number {
  // Placeholder - integrar com ShipStation/Shippo API depois
  const baseRate = toLocation.includes('China') ? 15 : 8;
  return baseRate * Math.ceil(quantity / 100);
}

function calculateRiskScore(margin: number, meetsDeadline: boolean, deliveryDays: number): number {
  let risk = 50;
  
  // Margem afeta risco
  if (margin > 30) risk -= 20;
  else if (margin > 20) risk -= 10;
  else if (margin < 10) risk += 20;
  
  // Prazo afeta risco
  if (!meetsDeadline) risk += 30;
  else if (deliveryDays < 7) risk -= 10;
  
  return Math.max(0, Math.min(100, risk));
}

function generateAIReasoning(rfq: RFQ, supplier: Supplier, margin: number, risk: number, meetsDeadline: boolean): string {
  const parts = [];
  
  parts.push(`Produto "${rfq.product_name}" encontrado com fornecedor ${supplier.supplier_name}.`);
  parts.push(`Margem de ${margin.toFixed(1)}% ${margin > 25 ? '(boa)' : margin > 15 ? '(aceitável)' : '(baixa)'}.`);
  
  if (meetsDeadline) {
    parts.push(`Prazo de entrega dentro do esperado.`);
  } else {
    parts.push(`⚠️ Prazo de entrega excede expectativa do comprador.`);
  }
  
  parts.push(`Risco calculado: ${risk.toFixed(1)}%.`);
  
  if (risk < 30) {
    parts.push('Recomendação: EXECUTAR - risco baixo e margem viável.');
  } else {
    parts.push('Recomendação: REJEITAR - risco alto ou margem insuficiente.');
  }
  
  return parts.join(' ');
}

async function sendMatchNotification(userId: string, matches: any[], supabaseClient: any) {
  // Placeholder - integrar com SendGrid depois
  const sendgridKey = Deno.env.get('SENDGRID_API_KEY');
  
  if (!sendgridKey) {
    console.log('SendGrid não configurado - email não enviado');
    return;
  }
  
  // Buscar email do usuário
  const { data: credentials } = await supabaseClient
    .from('api_credentials')
    .select('credential_value')
    .eq('user_id', userId)
    .eq('credential_key', 'user_email')
    .single();
  
  const userEmail = credentials?.credential_value || 'tafita81@gmail.com';
  
  const emailBody = `
    <h2>🎯 ${matches.length} Novos Matches RFQ → Fornecedor</h2>
    ${matches.map(m => `
      <div style="border:1px solid #ccc; padding:10px; margin:10px 0;">
        <h3>${m.ai_decision === 'EXECUTE' ? '✅' : '❌'} ${m.ai_decision}</h3>
        <p><strong>Margem:</strong> ${m.margin_percentage.toFixed(1)}%</p>
        <p><strong>Risco:</strong> ${m.risk_score.toFixed(1)}%</p>
        <p><strong>Prazo:</strong> ${m.total_delivery_days} dias ${m.meets_deadline ? '✅' : '❌'}</p>
        <p><strong>Raciocínio IA:</strong> ${m.ai_reasoning}</p>
      </div>
    `).join('')}
  `;
  
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: userEmail }],
          subject: `🎯 ${matches.length} Novos Matches RFQ Encontrados`
        }],
        from: { email: 'ai@globalsupplements.site', name: 'RFQ Matcher AI' },
        content: [{
          type: 'text/html',
          value: emailBody
        }]
      })
    });

    if (!response.ok) {
      console.error('Erro SendGrid:', await response.text());
    }
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
}
