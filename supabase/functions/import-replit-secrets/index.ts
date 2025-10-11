import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mapeamento de secrets do Replit para service_name
    const secretMappings = [
      {
        envVar: 'OPENAI_API_KEY',
        serviceName: 'openai',
        credentialKey: 'api_key'
      },
      {
        envVar: 'SENDGRID_API_KEY',
        serviceName: 'sendgrid',
        credentialKey: 'api_key'
      },
      {
        envVar: 'STRIPE_SECRET_KEY',
        serviceName: 'stripe',
        credentialKey: 'secret_key'
      },
      {
        envVar: 'RAPIDAPI_KEY',
        serviceName: 'rapidapi',
        credentialKey: 'api_key'
      }
    ];

    const results = [];
    const errors = [];

    // Importar cada credencial
    for (const mapping of secretMappings) {
      const secretValue = Deno.env.get(mapping.envVar);
      
      if (!secretValue) {
        errors.push({
          service: mapping.serviceName,
          error: `${mapping.envVar} não encontrado nos Replit Secrets`
        });
        continue;
      }

      // Upsert no banco de dados
      const { error } = await supabaseClient
        .from('api_credentials')
        .upsert({
          user_id: user.id,
          service_name: mapping.serviceName,
          credentials: { [mapping.credentialKey]: secretValue },
          is_active: true
        }, {
          onConflict: 'user_id,service_name'
        });

      if (error) {
        errors.push({
          service: mapping.serviceName,
          error: error.message
        });
      } else {
        results.push({
          service: mapping.serviceName,
          status: 'importado'
        });
      }
    }

    // Adicionar Amazon Affiliate Tag (hardcoded)
    const { error: amazonError } = await supabaseClient
      .from('api_credentials')
      .upsert({
        user_id: user.id,
        service_name: 'amazon_affiliate',
        credentials: { affiliate_tag: 'globalsupleme-20' },
        is_active: true
      }, {
        onConflict: 'user_id,service_name'
      });

    if (!amazonError) {
      results.push({
        service: 'amazon_affiliate',
        status: 'importado (globalsupleme-20)'
      });
    } else {
      errors.push({
        service: 'amazon_affiliate',
        error: amazonError.message
      });
    }

    // Adicionar Alibaba Dropshipping (hardcoded)
    const { error: alibabaError } = await supabaseClient
      .from('api_credentials')
      .upsert({
        user_id: user.id,
        service_name: 'alibaba',
        credentials: { 
          email: 'contact@globalsuplements.com',
          dropshipping_id: 'us29218711001mvvi'
        },
        is_active: true
      }, {
        onConflict: 'user_id,service_name'
      });

    if (!alibabaError) {
      results.push({
        service: 'alibaba',
        status: 'importado (contact@globalsuplements.com)'
      });
    } else {
      errors.push({
        service: 'alibaba',
        error: alibabaError.message
      });
    }

    // Adicionar Payoneer Customer ID
    const { error: payoneerError } = await supabaseClient
      .from('api_credentials')
      .upsert({
        user_id: user.id,
        service_name: 'payoneer',
        credentials: { 
          payoneer_id: '99133638'
        },
        is_active: true
      }, {
        onConflict: 'user_id,service_name'
      });

    if (!payoneerError) {
      results.push({
        service: 'payoneer',
        status: 'importado (99133638)'
      });
    } else {
      errors.push({
        service: 'payoneer',
        error: payoneerError.message
      });
    }

    console.log('✅ Credenciais importadas:', results);
    if (errors.length > 0) {
      console.error('❌ Erros ao importar:', errors);
    }

    // Determinar sucesso: pelo menos 1 credencial importada E nenhum erro crítico
    const success = results.length > 0;
    const hasErrors = errors.length > 0;

    let message = '';
    if (!success && hasErrors) {
      message = `Falha ao importar credenciais. ${errors.length} erro(s) encontrado(s).`;
    } else if (success && hasErrors) {
      message = `${results.length} credenciais importadas, mas ${errors.length} falharam.`;
    } else if (success) {
      message = `${results.length} credenciais importadas com sucesso!`;
    } else {
      message = 'Nenhuma credencial disponível nos Replit Secrets.';
    }

    return new Response(
      JSON.stringify({ 
        success,
        imported: results,
        errors: hasErrors ? errors : undefined,
        message
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro na importação:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
