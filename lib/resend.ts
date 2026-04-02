// lib/resend.ts - Transactional Email Service
import { createClient } from '@supabase/supabase-js';

interface EmailConfig {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

interface WelcomeEmailData {
  userName: string;
  userEmail: string;
  companyName?: string;
}

interface InvoiceEmailData {
  clientName: string;
  clientEmail: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  companyName?: string;
}

class EmailService {
  private resendApiKey: string;
  private fromEmail: string;
  private supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
  );

  constructor() {
    this.resendApiKey = process.env.RESEND_API_KEY || '';
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@flowfinance.app';
  }

  /**
   * Send Welcome Email
   */
  async sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
    try {
      const emailHtml = this.generateWelcomeTemplate(data);
      
      const emailData: EmailConfig = {
        to: data.userEmail,
        subject: `Welcome to ${data.companyName || 'FlowFinance'}! 🎉`,
        html: emailHtml,
        from: this.fromEmail
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error('❌ Welcome email error:', error);
      return false;
    }
  }

  /**
   * Send Invoice Email
   */
  async sendInvoiceEmail(data: InvoiceEmailData): Promise<boolean> {
    try {
      const emailHtml = this.generateInvoiceTemplate(data);
      
      const emailData: EmailConfig = {
        to: data.clientEmail,
        subject: `Invoice ${data.invoiceNumber} from ${data.companyName || 'FlowFinance'}`,
        html: emailHtml,
        from: this.fromEmail
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error('❌ Invoice email error:', error);
      return false;
    }
  }

  /**
   * Generic Email Sender
   */
  private async sendEmail(emailData: EmailConfig): Promise<boolean> {
    if (!this.resendApiKey) {
      console.warn('⚠️ RESEND_API_KEY not configured - email logging only');
      console.log('📧 Email would be sent:', {
        to: emailData.to,
        subject: emailData.subject,
        from: emailData.from || this.fromEmail
      });
      return true; // Mock success for development
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: emailData.from || this.fromEmail,
          to: Array.isArray(emailData.to) ? emailData.to : [emailData.to],
          subject: emailData.subject,
          html: emailData.html,
        }),
      });

      if (!response.ok) {
        throw new Error(`Resend API error: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Email sent successfully:', result.id);
      return true;
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return false;
    }
  }

  /**
   * Welcome Email Template
   */
  private generateWelcomeTemplate(data: WelcomeEmailData): string {
    const companyName = data.companyName || 'FlowFinance';
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ${companyName}</title>
    <style>
        body { font-family: 'Poppins', sans-serif; background: #0D0D0D; color: #FFFFFF; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #1A1A1A; border-radius: 16px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #D97757, #FF006E); padding: 40px; text-align: center; }
        .logo { font-size: 48px; margin-bottom: 16px; }
        .content { padding: 40px; }
        .button { display: inline-block; background: #D97757; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
        .footer { background: #2A2A2A; padding: 20px; text-align: center; color: #AAAAAA; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🥕</div>
            <h1>Welcome to ${companyName}!</h1>
        </div>
        <div class="content">
            <h2>Hi ${data.userName},</h2>
            <p>Welcome aboard! We're excited to have you join ${companyName}. Your account is ready and you can start managing your finances like a pro.</p>
            
            <h3>What's Next?</h3>
            <ul>
                <li>✅ Track your expenses automatically</li>
                <li>✅ Create professional invoices</li>
                <li>✅ Manage your clients efficiently</li>
                <li>✅ Get insights into your financial health</li>
            </ul>
            
            <a href="https://flowfinance.app/dashboard" class="button">Go to Dashboard</a>
            
            <p>If you have any questions, just reply to this email. We're here to help!</p>
            
            <p>Best regards,<br>The ${companyName} Team</p>
        </div>
        <div class="footer">
            <p>© 2026 ${companyName}. All rights reserved.</p>
            <p>You received this email because you signed up for ${companyName}.</p>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Invoice Email Template
   */
  private generateInvoiceTemplate(data: InvoiceEmailData): string {
    const companyName = data.companyName || 'FlowFinance';
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${data.invoiceNumber}</title>
    <style>
        body { font-family: 'Poppins', sans-serif; background: #0D0D0D; color: #FFFFFF; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #1A1A1A; border-radius: 16px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #D97757, #FF006E); padding: 40px; text-align: center; }
        .logo { font-size: 48px; margin-bottom: 16px; }
        .content { padding: 40px; }
        .invoice-details { background: #2A2A2A; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .amount { font-size: 32px; font-weight: bold; color: #D97757; }
        .button { display: inline-block; background: #D97757; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
        .footer { background: #2A2A2A; padding: 20px; text-align: center; color: #AAAAAA; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🥕</div>
            <h1>Invoice ${data.invoiceNumber}</h1>
        </div>
        <div class="content">
            <h2>Hi ${data.clientName},</h2>
            <p>Here's your invoice from ${companyName}. Thank you for your business!</p>
            
            <div class="invoice-details">
                <h3>Invoice Details</h3>
                <p><strong>Invoice Number:</strong> ${data.invoiceNumber}</p>
                <p><strong>Amount Due:</strong> <span class="amount">₹${data.amount.toLocaleString()}</span></p>
                <p><strong>Due Date:</strong> ${data.dueDate}</p>
            </div>
            
            <p>Please review the attached invoice and make payment by the due date. If you have any questions, don't hesitate to contact us.</p>
            
            <a href="https://flowfinance.app/invoice/${data.invoiceNumber}" class="button">View Invoice Online</a>
            
            <p>Best regards,<br>The ${companyName} Team</p>
        </div>
        <div class="footer">
            <p>© 2026 ${companyName}. All rights reserved.</p>
            <p>This is an automated invoice notification.</p>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Log email for debugging
   */
  private logEmail(emailData: EmailConfig): void {
    console.log('📧 Email Service Log:', {
      to: emailData.to,
      subject: emailData.subject,
      timestamp: new Date().toISOString()
    });
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Convenience functions
export const sendWelcomeEmail = (data: WelcomeEmailData) => 
  emailService.sendWelcomeEmail(data);

export const sendInvoiceEmail = (data: InvoiceEmailData) => 
  emailService.sendInvoiceEmail(data);
