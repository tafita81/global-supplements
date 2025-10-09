import { integrationConfig } from './config';

export class SendGridIntegration {
  private apiKey: string;
  private baseUrl = 'https://api.sendgrid.com/v3';
  public isMock: boolean;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.SENDGRID_API_KEY || '';
    this.isMock = !integrationConfig.hasSendGridCredentials();
  }

  async sendEmail(data: {
    to: string[];
    from: string;
    subject: string;
    html: string;
    segment?: string;
  }) {
    if (this.isMock) {
      console.warn('[MOCK MODE] SendGrid - would send email:', {
        recipients: data.to.length,
        subject: data.subject,
        segment: data.segment
      });
      
      return {
        success: true,
        sent_count: data.to.length,
        mock: true,
        open_rate: parseFloat((Math.random() * 40 + 10).toFixed(2)),
        click_rate: parseFloat((Math.random() * 15 + 5).toFixed(2))
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/mail/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          personalizations: data.to.map(email => ({ to: [{ email }] })),
          from: { email: data.from },
          subject: data.subject,
          content: [{ type: 'text/html', value: data.html }]
        })
      });

      if (response.ok) {
        return {
          success: true,
          sent_count: data.to.length,
          message_id: response.headers.get('X-Message-Id')
        };
      }

      throw new Error(`SendGrid API error: ${response.status}`);
    } catch (error) {
      console.error('SendGrid API error:', error);
      throw error;
    }
  }

  async getEmailStats(campaignId: string) {
    if (!this.apiKey) {
      return {
        opens: Math.floor(Math.random() * 500),
        clicks: Math.floor(Math.random() * 200),
        delivered: Math.floor(Math.random() * 1000),
        bounces: Math.floor(Math.random() * 50)
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/stats?start_date=${new Date().toISOString().split('T')[0]}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return await response.json();
    } catch (error) {
      console.error('SendGrid API error:', error);
      throw error;
    }
  }

  async createContactList(name: string, segment: string) {
    if (!this.apiKey) {
      console.warn('SendGrid API not configured - would create list:', { name, segment });
      return { id: 'list_mock_' + Date.now(), name };
    }

    try {
      const response = await fetch(`${this.baseUrl}/marketing/lists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({ name })
      });

      return await response.json();
    } catch (error) {
      console.error('SendGrid API error:', error);
      throw error;
    }
  }
}

export const sendgridIntegration = new SendGridIntegration();
