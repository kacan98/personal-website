import { format } from 'date-fns';

interface BookingEmailData {
  attendeeName: string;
  attendeeEmail: string;
  meetingDuration: number; // in minutes
  scheduledAt: Date;
  scheduledEndAt: Date;
  timezone: string;
  meetLink?: string;
  cancellationToken: string;
}

export class EmailService {
  static async sendBookingConfirmation(data: BookingEmailData): Promise<void> {
    const cancellationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/schedule/cancel/${data.cancellationToken}`;

    const emailContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1976d2;">Meeting Confirmed! 🎉</h2>

            <p>Hi ${data.attendeeName},</p>

            <p>Your meeting has been successfully scheduled.</p>

            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Meeting Details</h3>
              <p><strong>Duration:</strong> ${data.meetingDuration} minutes</p>
              <p><strong>Date:</strong> ${format(data.scheduledAt, 'MMMM d, yyyy')}</p>
              <p><strong>Time:</strong> ${format(data.scheduledAt, 'h:mm a')} - ${format(data.scheduledEndAt, 'h:mm a')}</p>
              <p><strong>Timezone:</strong> ${data.timezone}</p>
            </div>

            ${data.meetLink ? `
              <p>
                <a href="${data.meetLink}"
                   style="display: inline-block; padding: 12px 24px; background-color: #1976d2; color: white; text-decoration: none; border-radius: 4px;">
                  Join Google Meet
                </a>
              </p>
            ` : ''}

            <p>
              A calendar invite has been sent to your email. If you need to cancel or reschedule,
              please use the link below:
            </p>

            <p>
              <a href="${cancellationLink}" style="color: #d32f2f;">Cancel this meeting</a>
            </p>

            <p style="color: #666; font-size: 0.9em; margin-top: 40px;">
              Looking forward to speaking with you!
            </p>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: data.attendeeEmail,
      subject: `Meeting Confirmed - ${data.meetingDuration} minutes`,
      html: emailContent,
    });
  }

  static async sendCancellationConfirmation(
    attendeeEmail: string,
    attendeeName: string,
    scheduledAt: Date
  ): Promise<void> {
    const emailContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #d32f2f;">Meeting Cancelled</h2>

            <p>Hi ${attendeeName},</p>

            <p>Your meeting scheduled for ${format(scheduledAt, 'MMMM d, yyyy')} at ${format(scheduledAt, 'h:mm a')} has been cancelled.</p>

            <p>If you'd like to schedule another meeting, please visit our scheduling page.</p>

            <p>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/schedule"
                 style="display: inline-block; padding: 12px 24px; background-color: #1976d2; color: white; text-decoration: none; border-radius: 4px;">
                Schedule Another Meeting
              </a>
            </p>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: attendeeEmail,
      subject: `Meeting Cancelled`,
      html: emailContent,
    });
  }

  private static async sendEmail(params: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    // This is a placeholder implementation
    // You should implement actual email sending using a service like:
    // - Resend (recommended for Next.js)
    // - SendGrid
    // - Amazon SES
    // - Postmark
    // - Nodemailer with SMTP

    const emailProvider = process.env.EMAIL_PROVIDER || 'console';

    if (emailProvider === 'console') {
      console.log('=== EMAIL ===');
      console.log('To:', params.to);
      console.log('Subject:', params.subject);
      console.log('Body:', params.html);
      console.log('=============');
      return;
    }

    // Uncomment this block to use Resend (after running: npm install resend)
    // if (emailProvider === 'resend') {
    //   const { Resend } = require('resend');
    //   const resend = new Resend(process.env.RESEND_API_KEY);
    //   await resend.emails.send({
    //     from: process.env.EMAIL_FROM!,
    //     to: params.to,
    //     subject: params.subject,
    //     html: params.html,
    //   });
    //   return;
    // }

    throw new Error(`Unsupported email provider: ${emailProvider}`);
  }
}
