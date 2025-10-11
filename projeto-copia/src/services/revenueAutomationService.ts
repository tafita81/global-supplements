import { supabase } from '@/integrations/supabase/client';

export const revenueAutomationService = {
  // 1. BUSCAR OPORTUNIDADES GLOBAIS COM APIs REAIS
  async generateRealOpportunities() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(
      `https://twglceexfetejawoumsr.supabase.co/functions/v1/global-arbitrage-detector`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate opportunities');
    }

    return await response.json();
  },

  // 2. INICIAR NEGOCIAÇÃO AUTOMÁTICA COM IA (ChatGPT)
  async startAINegotiation() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(
      `https://twglceexfetejawoumsr.supabase.co/functions/v1/ai-negotiation-agent`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to start AI negotiation');
    }

    return await response.json();
  },

  // 3. INICIAR NEGOCIAÇÃO SEM INVESTIMENTO (Broker Mode)
  async startZeroInvestmentNegotiation(opportunityId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(
      `https://twglceexfetejawoumsr.supabase.co/functions/v1/zero-investment-broker`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ opportunityId })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to start negotiation');
    }

    return await response.json();
  },

  // 4. PROCESSAR COMISSÃO VIA PAYONEER
  async processCommission(negotiationId: string, payoneerId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(
      `https://twglceexfetejawoumsr.supabase.co/functions/v1/payoneer-commission-handler`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ negotiationId, payoneerId })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to process commission');
    }

    return await response.json();
  },

  // 5. BUSCAR NEGOCIAÇÕES ATIVAS
  async getActiveNegotiations() {
    const { data, error } = await supabase
      .from('negotiations')
      .select('*')
      .in('status', ['pending', 'in_progress', 'ai_negotiating', 'awaiting_payment'])
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // 6. BUSCAR OPORTUNIDADES DISPONÍVEIS
  async getAvailableOpportunities() {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('status', 'active')
      .gte('expires_at', new Date().toISOString())
      .order('margin_percentage', { ascending: false})
      .limit(50);

    if (error) throw error;
    return data;
  },

  // 7. CALCULAR RECEITA TOTAL
  async getTotalRevenue() {
    const { data, error } = await supabase
      .from('execution_history')
      .select('profit_amount')
      .eq('status', 'completed')
      .eq('action_type', 'commission_received');

    if (error) throw error;
    
    const total = data?.reduce((sum, record) => sum + (record.profit_amount || 0), 0) || 0;
    return total;
  },

  // 8. BUSCAR ESTATÍSTICAS DE NEGOCIAÇÕES
  async getNegotiationStats() {
    const { data, error } = await supabase
      .from('negotiations')
      .select('status, commission_value, total_value');

    if (error) throw error;

    const stats = {
      total: data.length,
      active: data.filter(n => ['pending', 'in_progress', 'ai_negotiating'].includes(n.status)).length,
      completed: data.filter(n => n.status === 'completed').length,
      total_commission: data.reduce((sum, n) => sum + (n.commission_value || 0), 0),
      total_volume: data.reduce((sum, n) => sum + (n.total_value || 0), 0)
    };

    return stats;
  }
};
