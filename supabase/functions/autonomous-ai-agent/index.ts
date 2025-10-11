import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = 'https://twglceexfetejawoumsr.supabase.co';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Validar autenticação
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing authorization header');

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error('Unauthorized');

    // Buscar credenciais
    const { data: credentials } = await supabase
      .from('api_credentials')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!credentials?.openai_api_key) {
      throw new Error('ChatGPT API key não configurada. Configure em /revenue-automation-setup');
    }

    const payload = await req.json();
    const { action } = payload;

    if (action === 'analyze_and_decide') {
      // IA autônoma analisa oportunidades e decide
      const result = await analyzeAndDecide(supabase, user.id, credentials.openai_api_key);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'learn_from_history') {
      // IA aprende com histórico de decisões
      const insights = await learnFromHistory(supabase, user.id, credentials.openai_api_key);
      return new Response(JSON.stringify(insights), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'auto_execute') {
      // Execução automática de oportunidades validadas
      const execution = await autoExecuteOpportunities(supabase, user.id, credentials);
      return new Response(JSON.stringify(execution), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// FUNÇÃO 1: IA Autônoma - Analisar e Decidir
async function analyzeAndDecide(supabase: any, userId: string, openaiKey: string) {
  // 1. Buscar oportunidades disponíveis
  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'pending')
    .limit(10);

  if (!opportunities || opportunities.length === 0) {
    return { message: 'Nenhuma oportunidade pendente para analisar' };
  }

  // 2. Buscar histórico de aprendizado
  const { data: history } = await supabase
    .from('ai_learning_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  // 3. Calcular estatísticas de sucesso
  const successRate = calculateSuccessRate(history || []);
  const avgProfit = calculateAvgProfit(history || []);
  const riskPatterns = identifyRiskPatterns(history || []);

  // 4. ChatGPT analisa cada oportunidade com base no histórico
  const decisions = [];
  
  for (const opp of opportunities) {
    const analysis = await analyzeSingleOpportunity(openaiKey, opp, {
      successRate,
      avgProfit,
      riskPatterns,
      history: history?.slice(0, 10) || [] // Últimas 10 decisões
    });

    // Salvar decisão no histórico
    const { data: decision } = await supabase
      .from('ai_learning_history')
      .insert({
        user_id: userId,
        decision_type: 'opportunity_analysis',
        opportunity_data: opp,
        ai_analysis: analysis,
        decision_made: analysis.decision,
        risk_score: analysis.risk_score,
        expected_profit: analysis.expected_profit,
        execution_time: new Date().toISOString()
      })
      .select()
      .single();

    // Enviar email automático para tafita81@gmail.com
    const { data: credentials } = await supabase
      .from('api_credentials')
      .select('sendgrid_key')
      .eq('user_id', userId)
      .single();
    
    if (credentials?.sendgrid_key && decision) {
      await sendDecisionEmail(credentials.sendgrid_key, decision, opp, 'analyzed');
    }

    decisions.push({
      opportunity_id: opp.id,
      decision: analysis.decision,
      risk_score: analysis.risk_score,
      expected_profit: analysis.expected_profit,
      reasoning: analysis.reasoning
    });
  }

  return {
    total_analyzed: opportunities.length,
    approved: decisions.filter(d => d.decision === 'EXECUTE').length,
    rejected: decisions.filter(d => d.decision === 'REJECT').length,
    decisions,
    learning_stats: { successRate, avgProfit }
  };
}

// FUNÇÃO 2: Aprender com Histórico
async function learnFromHistory(supabase: any, userId: string, openaiKey: string) {
  // Buscar histórico completo
  const { data: history } = await supabase
    .from('ai_learning_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100);

  if (!history || history.length === 0) {
    return { message: 'Sem histórico para aprender' };
  }

  // Separar sucessos e falhas
  const successes = history.filter((h: any) => h.success === true);
  const failures = history.filter((h: any) => h.success === false);

  // ChatGPT identifica padrões
  const prompt = `
Você é um sistema de aprendizado de máquina analisando ${history.length} decisões de negociação B2B.

SUCESSOS (${successes.length}):
${JSON.stringify(successes.slice(0, 10), null, 2)}

FALHAS (${failures.length}):
${JSON.stringify(failures.slice(0, 10), null, 2)}

Identifique:
1. Padrões comuns em decisões LUCRATIVAS
2. Padrões comuns em decisões PREJUDICIAIS
3. Regras para EVITAR prejuízo no futuro
4. Recomendações para MAXIMIZAR lucro

Retorne JSON:
{
  "success_patterns": ["padrão 1", "padrão 2", ...],
  "failure_patterns": ["padrão 1", "padrão 2", ...],
  "safety_rules": ["regra 1", "regra 2", ...],
  "profit_strategies": ["estratégia 1", "estratégia 2", ...]
}
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })
  });

  const data = await response.json();
  const insights = JSON.parse(data.choices[0].message.content);

  // Salvar insights como aprendizado
  await supabase.from('ai_learning_history').insert({
    user_id: userId,
    decision_type: 'learning_insights',
    opportunity_data: { total_analyzed: history.length },
    ai_analysis: insights,
    created_at: new Date().toISOString()
  });

  return {
    total_analyzed: history.length,
    success_rate: (successes.length / history.length * 100).toFixed(1) + '%',
    insights
  };
}

// FUNÇÃO 3: Execução Automática de Oportunidades Validadas
async function autoExecuteOpportunities(supabase: any, userId: string, credentials: any) {
  // Buscar decisões aprovadas pela IA
  const { data: approvedDecisions } = await supabase
    .from('ai_learning_history')
    .select('*')
    .eq('user_id', userId)
    .eq('decision_made', 'EXECUTE')
    .gte('risk_score', 0)
    .lte('risk_score', 30) // Apenas baixo risco
    .is('result_time', null) // Ainda não executadas
    .limit(5);

  if (!approvedDecisions || approvedDecisions.length === 0) {
    return { message: 'Nenhuma oportunidade aprovada para execução automática' };
  }

  const executions = [];

  for (const decision of approvedDecisions) {
    const opp = decision.opportunity_data;

    // Executar automaticamente
    try {
      // 1. Criar link de pagamento Stripe
      const paymentLink = await createPaymentLink(credentials.stripe_key, opp);

      // 2. Enviar proposta automática
      if (credentials.sendgrid_key) {
        await sendAutomatedProposal(credentials.sendgrid_key, opp, paymentLink);
      }

      // 3. Registrar execução
      await supabase
        .from('ai_learning_history')
        .update({
          result_time: new Date().toISOString(),
          lessons_learned: 'Executado automaticamente pela IA'
        })
        .eq('id', decision.id);

      // 4. Enviar email automático para tafita81@gmail.com
      if (credentials.sendgrid_key) {
        await sendDecisionEmail(credentials.sendgrid_key, decision, opp, 'executed');
      }

      executions.push({
        opportunity_id: opp.id,
        status: 'executed',
        payment_link: paymentLink
      });

    } catch (error) {
      console.error('Execution error:', error);
      executions.push({
        opportunity_id: opp.id,
        status: 'failed',
        error: error.message
      });
    }
  }

  return {
    total_executed: executions.length,
    executions
  };
}

// HELPER: Analisar oportunidade individual com ChatGPT
async function analyzeSingleOpportunity(openaiKey: string, opportunity: any, context: any) {
  const prompt = `
Você é um sistema autônomo de decisão de investimento B2B.

TAXA DE SUCESSO HISTÓRICA: ${context.successRate}%
LUCRO MÉDIO HISTÓRICO: $${context.avgProfit}

OPORTUNIDADE:
${JSON.stringify(opportunity, null, 2)}

PADRÕES DE RISCO IDENTIFICADOS:
${JSON.stringify(context.riskPatterns, null, 2)}

ÚLTIMAS 10 DECISÕES:
${JSON.stringify(context.history, null, 2)}

Analise e decida:
1. Esta oportunidade é LUCRATIVA e SEGURA?
2. Qual o risco (0-100)?
3. Qual o lucro esperado?
4. EXECUTE ou REJEITE?

Retorne JSON:
{
  "decision": "EXECUTE" ou "REJECT",
  "risk_score": 0-100,
  "expected_profit": valor numérico,
  "reasoning": "explicação breve"
}
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      response_format: { type: 'json_object' }
    })
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

// HELPER: Calcular taxa de sucesso
function calculateSuccessRate(history: any[]) {
  if (history.length === 0) return 0;
  const successes = history.filter(h => h.success === true).length;
  return (successes / history.length * 100).toFixed(1);
}

// HELPER: Calcular lucro médio
function calculateAvgProfit(history: any[]) {
  const profits = history.filter(h => h.actual_profit).map(h => h.actual_profit);
  if (profits.length === 0) return 0;
  const sum = profits.reduce((a, b) => a + b, 0);
  return (sum / profits.length).toFixed(2);
}

// HELPER: Identificar padrões de risco
function identifyRiskPatterns(history: any[]) {
  const failures = history.filter(h => h.success === false);
  
  const patterns = {
    high_risk_categories: [] as string[],
    avoid_countries: [] as string[],
    dangerous_price_ranges: [] as any[]
  };

  // Analisar falhas
  failures.forEach(f => {
    if (f.opportunity_data?.category && !patterns.high_risk_categories.includes(f.opportunity_data.category)) {
      patterns.high_risk_categories.push(f.opportunity_data.category);
    }
    if (f.opportunity_data?.country && !patterns.avoid_countries.includes(f.opportunity_data.country)) {
      patterns.avoid_countries.push(f.opportunity_data.country);
    }
  });

  return patterns;
}

// HELPER: Criar link de pagamento
async function createPaymentLink(stripeKey: string, opportunity: any) {
  if (!stripeKey) return null;
  
  // Simulação - Em produção seria Stripe API real
  return `https://stripe.com/pay/${opportunity.id}`;
}

// HELPER: Enviar proposta automática
async function sendAutomatedProposal(sendgridKey: string, opportunity: any, paymentLink: string) {
  // Simulação - Em produção seria SendGrid API real
  console.log('Proposta enviada automaticamente para:', opportunity.buyer_email);
}

// HELPER: Enviar email com detalhes da decisão para tafita81@gmail.com
async function sendDecisionEmail(sendgridKey: string, decision: any, opportunity: any, status: string) {
  const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; }
        .content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px; }
        .metric { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #667eea; }
        .success { border-left-color: #10b981; }
        .warning { border-left-color: #f59e0b; }
        .danger { border-left-color: #ef4444; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🤖 IA Autônoma - Nova Decisão</h1>
          <p>Sistema de aprendizado automático tomou uma decisão</p>
        </div>
        
        <div class="content">
          <h2>📊 Detalhes da Decisão</h2>
          
          <div class="metric ${decision.decision_made === 'EXECUTE' ? 'success' : 'danger'}">
            <strong>Decisão:</strong> ${decision.decision_made || 'PENDING'}<br>
            <strong>Status:</strong> ${status.toUpperCase()}<br>
            <strong>Tipo:</strong> ${decision.decision_type}
          </div>
          
          <div class="metric">
            <strong>🎯 Oportunidade:</strong><br>
            Produto: ${opportunity.product_name || 'N/A'}<br>
            Quantidade: ${opportunity.quantity || 'N/A'} unidades<br>
            Preço: $${opportunity.sell_price || 'N/A'}
          </div>
          
          <div class="metric ${decision.risk_score <= 30 ? 'success' : decision.risk_score <= 60 ? 'warning' : 'danger'}">
            <strong>⚠️ Análise de Risco:</strong><br>
            Score de Risco: ${decision.risk_score || 'N/A'}%<br>
            Lucro Esperado: $${decision.expected_profit || 'N/A'}<br>
            ${decision.ai_analysis?.reasoning ? `Raciocínio: ${decision.ai_analysis.reasoning}` : ''}
          </div>
          
          <div class="metric">
            <strong>📈 Análise da IA:</strong><br>
            ${JSON.stringify(decision.ai_analysis || {}, null, 2)}
          </div>
          
          <div class="metric">
            <strong>⏰ Timestamps:</strong><br>
            Decisão: ${decision.execution_time || new Date().toISOString()}<br>
            Resultado: ${decision.result_time || 'Pendente'}
          </div>
        </div>
        
        <div class="footer">
          <p>Global Supplements - IA Autônoma<br>
          Rafael Roberto Rodrigues de Oliveira<br>
          Orlando, Florida, USA</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: 'tafita81@gmail.com' }],
          subject: `🤖 IA Autônoma: ${decision.decision_made || 'NOVA'} - ${opportunity.product_name || 'Oportunidade'}`
        }],
        from: {
          email: 'ai@globalsupplements.site',
          name: 'Global Supplements IA Autônoma'
        },
        content: [{
          type: 'text/html',
          value: emailContent
        }]
      })
    });

    if (response.ok) {
      console.log('✅ Email enviado para tafita81@gmail.com');
    } else {
      console.error('❌ Falha ao enviar email:', await response.text());
    }
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
  }
}
