import { supabase } from '@/integrations/supabase/client';

export const revenueAutomationService = {
  // 1. GERAR OPORTUNIDADES REAIS
  async generateRealOpportunities() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(
      `https://twglceexfetejawoumsr.supabase.co/functions/v1/real-opportunity-generator`,
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

  // 2. INICIAR NEGOCIAÇÃO AUTOMÁTICA
  async startAutoNegotiation(opportunityId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(
      `https://twglceexfetejawoumsr.supabase.co/functions/v1/auto-negotiation-engine`,
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

  // 3. PROCESSAR COMISSÃO VIA PAYONEER
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

  // 4. BUSCAR NEGOCIAÇÕES ATIVAS
  async getActiveNegotiations() {
    const { data, error } = await supabase
      .from('negotiations')
      .select('*')
      .in('status', ['pending', 'in_progress'])
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // 5. BUSCAR OPORTUNIDADES DISPONÍVEIS
  async getAvailableOpportunities() {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('status', 'active')
      .gte('expires_at', new Date().toISOString())
      .order('margin_percentage', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data;
  },

  // 6. CALCULAR RECEITA TOTAL
  async getTotalRevenue() {
    const { data, error } = await supabase
      .from('execution_history')
      .select('profit_amount')
      .eq('status', 'completed')
      .eq('action_type', 'commission_received');

    if (error) throw error;
    
    const total = data?.reduce((sum, record) => sum + (record.profit_amount || 0), 0) || 0;
    return total;
  }
};
