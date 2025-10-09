import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GSCRequest {
  siteUrl: string;
  startDate: string;
  endDate: string;
  dimensions?: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 🔐 AUTH CHECK: Validate Supabase user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const GSC_CREDENTIALS = Deno.env.get('GSC_CREDENTIALS');
    
    if (!GSC_CREDENTIALS) {
      return new Response(
        JSON.stringify({ 
          error: 'Google Search Console API not configured',
          mock: true,
          message: 'GSC_CREDENTIALS not set in environment'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const { siteUrl, startDate, endDate, dimensions = ['query', 'page'] }: GSCRequest = await req.json();

    if (!siteUrl || !startDate || !endDate) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: siteUrl, startDate, endDate' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    let credentials;
    try {
      credentials = JSON.parse(GSC_CREDENTIALS);
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid GSC_CREDENTIALS format. Must be valid JSON.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get OAuth token from credentials
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: credentials.client_id,
        client_secret: credentials.client_secret,
        refresh_token: credentials.refresh_token,
        grant_type: 'refresh_token'
      })
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get OAuth token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Query Search Analytics
    const analyticsResponse = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions,
          rowLimit: 1000
        })
      }
    );

    if (!analyticsResponse.ok) {
      const error = await analyticsResponse.text();
      throw new Error(`GSC API error: ${analyticsResponse.status} - ${error}`);
    }

    const analyticsData = await analyticsResponse.json();

    return new Response(
      JSON.stringify({ 
        success: true,
        data: analyticsData,
        mock: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('GSC integration error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        mock: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
