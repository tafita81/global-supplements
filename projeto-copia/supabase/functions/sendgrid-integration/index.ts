import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SendEmailRequest {
  to: string[];
  from: string;
  subject: string;
  html: string;
  segment?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
    
    if (!SENDGRID_API_KEY) {
      return new Response(
        JSON.stringify({ 
          error: 'SendGrid API not configured',
          mock: true,
          message: 'SENDGRID_API_KEY not set in environment'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const { to, from, subject, html, segment }: SendEmailRequest = await req.json();

    if (!to || !from || !subject || !html) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, from, subject, html' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const personalizations = to.map(email => ({ to: [{ email }] }));

    const emailData = {
      personalizations,
      from: { email: from },
      subject,
      content: [
        {
          type: 'text/html',
          value: html
        }
      ]
    };

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`SendGrid API error: ${response.status} - ${error}`);
    }

    // SendGrid returns 202 Accepted with empty body on success
    return new Response(
      JSON.stringify({ 
        success: true,
        sent_count: to.length,
        segment: segment || 'all_subscribers',
        mock: false,
        message: `Email sent to ${to.length} recipients`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('SendGrid integration error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        mock: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
