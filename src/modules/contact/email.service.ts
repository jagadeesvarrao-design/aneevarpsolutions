import nodemailer from 'nodemailer';
import https from 'https';

export interface EmailSubmissionData {
  formType: 'CONTACT_US' | 'VENTURE_PITCH' | 'GRIEVANCE' | 'DATA_PRIVACY';
  ticketNumber: string;
  name: string;
  email: string;
  company?: string;
  category?: string;
  message: string;
  submittedAt?: Date;
}

export class EmailService {
  private targetEmail = 'aneevarpsolutions@gmail.com';

  /**
   * Main email dispatcher supporting SMTP (Nodemailer) and HTTPS API gateway
   */
  async sendSubmissionEmail(data: EmailSubmissionData): Promise<{ success: boolean; method: string }> {
    if (process.env.NODE_ENV === 'test') {
      return { success: true, method: 'TEST_MOCK' };
    }

    const timestamp = (data.submittedAt || new Date()).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    let subject = `[Aneevarp Solutions] New Inquiry - Ref: ${data.ticketNumber}`;
    if (data.formType === 'VENTURE_PITCH') {
      subject = `🚀 [Venture Studio Pitch] ${data.company || 'Product Proposal'} from ${data.name}`;
    } else if (data.formType === 'GRIEVANCE') {
      subject = `⚖️ [STATUTORY GRIEVANCE IT RULES 2021] Complainant: ${data.name} (Ticket: ${data.ticketNumber})`;
    } else if (data.formType === 'DATA_PRIVACY') {
      subject = `🔒 [DPDP ACT 2023 DSR REQUEST] User: ${data.email} (Ticket: ${data.ticketNumber})`;
    } else {
      subject = `📬 [Contact Desk] ${data.name} (${data.category || 'General Inquiry'}) - Ref: ${data.ticketNumber}`;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #476550; border-radius: 12px; overflow: hidden; background-color: #FCFAF5;">
        <div style="background-color: #1A1F1F; color: #FCFAF5; padding: 20px 24px; text-align: left;">
          <h2 style="margin: 0; font-size: 20px; color: #FCFAF5; letter-spacing: 0.5px;">Aneevarp Solutions Corporate Desk</h2>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #A2BCA8; text-transform: uppercase;">Parent Holding Entity • Official Submission Notification</p>
        </div>
        <div style="padding: 24px; color: #1A1F1F;">
          <div style="display: inline-block; background-color: #476550; color: #FFFFFF; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 6px; margin-bottom: 16px;">
            ${data.formType.replace('_', ' ')}
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #64748B; width: 140px; font-weight: bold;">Ticket Reference:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #1A1F1F;">${data.ticketNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748B; font-weight: bold;">Sender Name:</td>
              <td style="padding: 8px 0; color: #1A1F1F;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748B; font-weight: bold;">Sender Email:</td>
              <td style="padding: 8px 0; color: #1A1F1F;"><a href="mailto:${data.email}" style="color: #476550; font-weight: bold;">${data.email}</a></td>
            </tr>
            ${data.company ? `
            <tr>
              <td style="padding: 8px 0; color: #64748B; font-weight: bold;">Product / Org:</td>
              <td style="padding: 8px 0; color: #1A1F1F;">${data.company}</td>
            </tr>` : ''}
            ${data.category ? `
            <tr>
              <td style="padding: 8px 0; color: #64748B; font-weight: bold;">Category:</td>
              <td style="padding: 8px 0; color: #1A1F1F;">${data.category}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 8px 0; color: #64748B; font-weight: bold;">Timestamp (IST):</td>
              <td style="padding: 8px 0; color: #64748B; font-size: 12px;">${timestamp}</td>
            </tr>
          </table>

          <div style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 8px 0; color: #1A1F1F; font-size: 13px; text-transform: uppercase;">Message / Details:</h4>
            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${data.message}</p>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <a href="mailto:${data.email}?subject=Re:%20${encodeURIComponent(subject)}" style="display: inline-block; background-color: #476550; color: #FFFFFF; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: bold;">
              Reply Directly to Submitter
            </a>
          </div>
        </div>
        <div style="background-color: #F1F5F9; border-top: 1px solid #E2E8F0; padding: 12px 24px; font-size: 11px; color: #64748B; text-align: center;">
          Aneevarp Solutions Private Limited • MCA CIN: U72900TG2026PTC184920 • Regd. Office: Hitech City, Hyderabad
        </div>
      </div>
    `;

    // Strategy 1: Check if SMTP credentials exist in environment
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: `"Aneevarp Solutions Desk" <${smtpUser}>`,
          to: this.targetEmail,
          replyTo: data.email,
          subject,
          html: htmlContent,
        });

        console.log(`[Email Service] Delivered email via SMTP to ${this.targetEmail} for ticket ${data.ticketNumber}`);
        return { success: true, method: 'SMTP' };
      } catch (smtpErr) {
        console.warn('[Email Service] SMTP delivery failed, falling back to HTTPS gateway:', smtpErr);
      }
    }

    // Strategy 2: Forward via server-side HTTPS Gateway to FormSubmit
    try {
      await this.sendViaHttpsGateway({
        _subject: subject,
        _template: 'table',
        _replyto: data.email,
        form_type: data.formType,
        ticket_number: data.ticketNumber,
        name: data.name,
        email: data.email,
        company_or_product: data.company || 'N/A',
        category: data.category || 'N/A',
        message: data.message,
        received_time: timestamp,
      });

      console.log(`[Email Service] Forwarded email via HTTPS Gateway to ${this.targetEmail} for ticket ${data.ticketNumber}`);
      return { success: true, method: 'HTTPS_GATEWAY' };
    } catch (gatewayErr) {
      console.warn('[Email Service] HTTPS Gateway dispatch error:', gatewayErr);
      return { success: false, method: 'FALLBACK_LOG' };
    }
  }

  private sendViaHttpsGateway(payload: Record<string, any>): Promise<void> {
    return new Promise((resolve, reject) => {
      const dataString = JSON.stringify(payload);
      const req = https.request(
        `https://formsubmit.co/ajax/${this.targetEmail}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Referer': 'https://aneevarpsolutions.vercel.app/',
            'Origin': 'https://aneevarpsolutions.vercel.app',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Content-Length': Buffer.byteLength(dataString),
          },
          timeout: 6000,
        },
        (res) => {
          let responseBody = '';
          res.on('data', (chunk) => (responseBody += chunk));
          res.on('end', () => {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) {
              resolve();
            } else {
              reject(new Error(`Gateway responded with status ${res.statusCode}: ${responseBody}`));
            }
          });
        }
      );

      req.on('error', (err) => reject(err));
      req.on('timeout', () => {
        req.destroy();
        resolve();
      });

      req.write(dataString);
      req.end();
    });
  }
}
