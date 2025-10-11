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

      const allMatches = [];

      for (const rfq of (pendingRFQs || [])) {
        const rfqMatches = []; // Track matches PER RFQ
        
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
          const shippingCost = calculateShippingCost(supplier.warehouse_zip, rfq.buyer_location, rfq.quantity);
          const totalCost = (supplier.unit_price * rfq.quantity) + shippingCost;
          const expectedRevenue = rfq.target_price ? (rfq.target_price * rfq.quantity) : totalCost * 1.3;
          const marginPercentage = ((expectedRevenue - totalCost) / expectedRevenue) * 100;
          const riskScore = calculateRiskScore(marginPercentage, meetsDeadline, totalDeliveryDays);

          // IA autônoma analisa com ChatGPT
          const aiAnalysis = await analyzeRFQMatchWithAI(
            {
              rfq,
              supplier,
              totalCost,
              expectedRevenue,
              marginPercentage,
              totalDeliveryDays,
              meetsDeadline,
              shippingCost
            },
            user.id,
            supabaseClient
          );

          const aiDecision = aiAnalysis.decision;
          const aiReasoning = aiAnalysis.reasoning;

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
            rfqMatches.push(match);
            allMatches.push(match);
          }
        }

        // Atualizar status do RFQ SOMENTE se ESTE RFQ encontrou matches
        if (rfqMatches.length > 0) {
          await supabaseClient
            .from('rfqs')
            .update({ status: 'matched', updated_at: new Date().toISOString() })
            .eq('id', rfq.id);
        }
      }

      // Enviar email com matches se encontrou algum
      if (allMatches.length > 0) {
        await sendMatchNotification(user.id, allMatches, supabaseClient);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `${allMatches.length} matches encontrados`,
          matches: allMatches 
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

async function analyzeRFQMatchWithAI(matchData: any, userId: string, supabaseClient: any) {
  try {
    // Buscar OpenAI API key
    const { data: credentials } = await supabaseClient
      .from('api_credentials')
      .select('openai_api_key')
      .eq('user_id', userId)
      .single();

    if (!credentials?.openai_api_key) {
      // Fallback para análise simples sem IA
      const riskScore = calculateRiskScore(
        matchData.marginPercentage,
        matchData.meetsDeadline,
        matchData.totalDeliveryDays
      );
      
      return {
        decision: riskScore < 30 ? 'EXECUTE' : 'REJECT',
        reasoning: generateSimpleReasoning(matchData, riskScore)
      };
    }

    // Buscar histórico de aprendizado
    const { data: history } = await supabaseClient
      .from('ai_learning_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    const successfulMatches = history?.filter((h: any) => h.success === true) || [];
    const failedMatches = history?.filter((h: any) => h.success === false) || [];

    // Chamar ChatGPT para análise inteligente
    const prompt = `Analise este match RFQ → Fornecedor e decida se deve EXECUTAR ou REJEITAR:

DADOS DO MATCH:
- Produto: ${matchData.rfq.product_name}
- Quantidade: ${matchData.rfq.quantity}
- Fornecedor: ${matchData.supplier.supplier_name}
- Margem: ${matchData.marginPercentage.toFixed(1)}%
- Custo Total: $${matchData.totalCost.toFixed(2)}
- Receita Esperada: $${matchData.expectedRevenue.toFixed(2)}
- Prazo Entrega: ${matchData.totalDeliveryDays} dias
- Prazo Esperado: ${matchData.rfq.expected_delivery_days} dias
- Cumpre Prazo: ${matchData.meetsDeadline ? 'SIM' : 'NÃO'}

HISTÓRICO DE APRENDIZADO:
- ${successfulMatches.length} matches bem-sucedidos
- ${failedMatches.length} matches falharam
- Taxa de sucesso histórica: ${history?.length > 0 ? ((successfulMatches.length / history.length) * 100).toFixed(1) : 0}%

LIÇÕES APRENDIDAS:
${history?.slice(0, 5).map((h: any) => `- ${h.lesson_learned || 'N/A'}`).join('\n')}

RESPONDA EM JSON:
{
  "decision": "EXECUTE" ou "REJECT",
  "risk_score": 0-100,
  "reasoning": "Explicação detalhada da decisão",
  "expected_profit": valor estimado,
  "confidence": 0-100
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.openai_api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em análise B2B e arbitragem internacional. Analise matches RFQ-Fornecedor e tome decisões baseadas em dados históricos e padrões de sucesso.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const aiResponse = await response.json();
    const aiDecision = JSON.parse(aiResponse.choices[0].message.content);

    // Salvar no histórico de aprendizado
    await supabaseClient
      .from('ai_learning_history')
      .insert({
        user_id: userId,
        decision_type: 'rfq_match',
        opportunity_data: matchData,
        ai_analysis: aiDecision,
        decision_made: aiDecision.decision,
        risk_score: aiDecision.risk_score,
        expected_profit: aiDecision.expected_profit,
        execution_time: new Date().toISOString()
      });

    return {
      decision: aiDecision.decision,
      reasoning: aiDecision.reasoning,
      riskScore: aiDecision.risk_score,
      confidence: aiDecision.confidence
    };

  } catch (error) {
    console.error('AI Analysis Error:', error);
    
    // Fallback para análise simples
    const riskScore = calculateRiskScore(
      matchData.marginPercentage,
      matchData.meetsDeadline,
      matchData.totalDeliveryDays
    );
    
    return {
      decision: riskScore < 30 ? 'EXECUTE' : 'REJECT',
      reasoning: generateSimpleReasoning(matchData, riskScore)
    };
  }
}

function generateSimpleReasoning(matchData: any, risk: number): string {
  const parts = [];
  const { rfq, supplier, marginPercentage, meetsDeadline } = matchData;
  
  parts.push(`Produto "${rfq.product_name}" encontrado com fornecedor ${supplier.supplier_name}.`);
  parts.push(`Margem de ${marginPercentage.toFixed(1)}% ${marginPercentage > 25 ? '(boa)' : marginPercentage > 15 ? '(aceitável)' : '(baixa)'}.`);
  
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
  const sendgridKey = Deno.env.get('SENDGRID_API_KEY');
  
  if (!sendgridKey) {
    console.log('SendGrid não configurado - email não enviado');
    return;
  }
  
  // Email SEMPRE para tafita81@gmail.com (conforme especificação)
  const userEmail = 'tafita81@gmail.com';
  
  const emailBody = `
    <h2>🎯 ${matches.length} Novos Matches RFQ → Fornecedor</h2>
    <p><strong>Sistema RFQ Matcher</strong> encontrou automaticamente as seguintes oportunidades:</p>
    ${matches.map(m => `
      <div style="border:1px solid ${m.ai_decision === 'EXECUTE' ? '#22c55e' : '#ef4444'}; border-radius:8px; padding:15px; margin:15px 0; background:${m.ai_decision === 'EXECUTE' ? '#f0fdf4' : '#fef2f2'};">
        <h3 style="color:${m.ai_decision === 'EXECUTE' ? '#16a34a' : '#dc2626'}; margin:0 0 10px 0;">
          ${m.ai_decision === 'EXECUTE' ? '✅ EXECUTAR' : '❌ REJEITAR'}
        </h3>
        <p style="margin:5px 0;"><strong>Margem de Lucro:</strong> <span style="color:${m.margin_percentage > 25 ? '#16a34a' : m.margin_percentage > 15 ? '#ca8a04' : '#dc2626'}">${m.margin_percentage?.toFixed(1)}%</span></p>
        <p style="margin:5px 0;"><strong>Risco Calculado:</strong> <span style="color:${m.risk_score < 30 ? '#16a34a' : m.risk_score < 60 ? '#ca8a04' : '#dc2626'}">${m.risk_score?.toFixed(1)}%</span></p>
        <p style="margin:5px 0;"><strong>Prazo de Entrega:</strong> ${m.total_delivery_days} dias ${m.meets_deadline ? '✅ (dentro do esperado)' : '❌ (excede esperado)'}</p>
        <p style="margin:5px 0;"><strong>Receita Esperada:</strong> <span style="color:#16a34a;font-weight:600;">$${m.expected_revenue?.toFixed(2)}</span></p>
        <p style="margin:5px 0;"><strong>Custo Total:</strong> $${m.total_cost?.toFixed(2)}</p>
        <div style="background:#f3f4f6; padding:10px; margin-top:10px; border-radius:4px;">
          <p style="margin:0;"><strong>Raciocínio da IA:</strong></p>
          <p style="margin:5px 0 0 0; font-style:italic;">${m.ai_reasoning}</p>
        </div>
      </div>
    `).join('')}
    <hr style="margin:30px 0;">
    <p style="color:#6b7280; font-size:14px;">
      <strong>Sistema Automático RFQ Matcher</strong><br>
      Consultoria em Tecnologia da Informação Corp<br>
      EIN: 33-3939483 | Orlando, FL, USA
    </p>
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
          subject: `🎯 ${matches.length} Novos Matches RFQ Encontrados - Ação Requerida`
        }],
        from: { 
          email: 'noreply@globalsupplements.site', 
          name: 'RFQ Matcher AI' 
        },
        content: [{
          type: 'text/html',
          value: emailBody
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro SendGrid:', response.status, errorText);
      throw new Error(`SendGrid API error: ${response.status}`);
    }

    console.log(`✅ Email enviado com sucesso para ${userEmail} com ${matches.length} matches`);
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    throw error; // Re-throw para que o chamador saiba que falhou
  }
}
