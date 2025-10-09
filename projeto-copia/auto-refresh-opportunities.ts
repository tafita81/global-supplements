// Sistema de Auto-Refresh para Oportunidades Reais
// Executa detecção automática a cada 6 horas

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://twglceexfetejawoumsr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3Z2xjZWV4ZmV0ZWphd291bXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MjExOTAsImV4cCI6MjA3NDQ5NzE5MH0.kVKkE-dbIDi2-31-pCKBVzjjk5Hu-SV7SgmKzQVkaeY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function detectNewOpportunities() {
  console.log('🔍 Iniciando detecção automática de oportunidades...');
  
  try {
    const { data, error } = await supabase.functions.invoke('opportunity-detector', {
      body: { 
        categories: ['health-supplements', 'electronics', 'industrial'],
        auto_analyze: true 
      }
    });
    
    if (error) throw error;
    
    console.log('✅ Detecção concluída:', data);
    return data;
  } catch (error) {
    console.error('❌ Erro na detecção:', error);
  }
}

// Executar imediatamente
detectNewOpportunities();

// Executar a cada 6 horas
setInterval(detectNewOpportunities, 6 * 60 * 60 * 1000);
