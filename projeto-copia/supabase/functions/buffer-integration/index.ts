import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BufferPostRequest {
  profileId: string;
  text: string;
  scheduledAt?: string;
}

interface BufferProfilesRequest {
  action: 'get_profiles';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const BUFFER_ACCESS_TOKEN = Deno.env.get('BUFFER_ACCESS_TOKEN');
    
    if (!BUFFER_ACCESS_TOKEN) {
      return new Response(
        JSON.stringify({ 
          error: 'Buffer API not configured',
          mock: true,
          message: 'BUFFER_ACCESS_TOKEN not set in environment'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const body = await req.json();
    const baseUrl = 'https://api.bufferapp.com/1';

    // Get Profiles
    if ('action' in body && body.action === 'get_profiles') {
      const response = await fetch(`${baseUrl}/profiles.json?access_token=${BUFFER_ACCESS_TOKEN}`);
      
      if (!response.ok) {
        throw new Error(`Buffer API error: ${response.status}`);
      }

      const profiles = await response.json();
      
      return new Response(
        JSON.stringify({ success: true, profiles }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Post
    const { profileId, text, scheduledAt } = body as BufferPostRequest;

    if (!profileId || !text) {
      return new Response(
        JSON.stringify({ error: 'profileId and text are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const postData: any = {
      profile_ids: [profileId],
      text: text,
      now: scheduledAt ? false : true
    };

    if (scheduledAt) {
      postData.scheduled_at = new Date(scheduledAt).getTime() / 1000;
    }

    const response = await fetch(`${baseUrl}/updates/create.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...postData,
        access_token: BUFFER_ACCESS_TOKEN
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Buffer API error: ${response.status} - ${error}`);
    }

    const result = await response.json();

    return new Response(
      JSON.stringify({ 
        success: true, 
        id: result.updates?.[0]?.id || result.id,
        scheduled: !!scheduledAt,
        mock: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Buffer integration error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        mock: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
