import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailInput {
  to: string;
  subject: string;
  body: string;
  from?: string;
}

interface SendEmailOutput {
  messageId: string;
  status: 'pending' | 'error';
  error?: string;
}

const DEFAULT_FROM = 'noreply@coldreach.io';

export async function sendEmail(input: SendEmailInput): Promise<SendEmailOutput> {
  try {
    const result = await resend.emails.send({
      from: input.from || DEFAULT_FROM,
      to: input.to,
      subject: input.subject,
      html: formatEmailHTML(input.body),
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      return {
        messageId: '',
        status: 'error',
        error: result.error.message,
      };
    }

    return {
      messageId: result.data?.id || '',
      status: 'pending',
    };
  } catch (error: any) {
    console.error('Email send error:', error.message);
    return {
      messageId: '',
      status: 'error',
      error: error.message,
    };
  }
}

export async function sendBatchEmails(
  emails: SendEmailInput[]
): Promise<SendEmailOutput[]> {
  const results = await Promise.all(emails.map((email) => sendEmail(email)));
  return results;
}

function formatEmailHTML(body: string): string {
  const htmlBody = body
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    .replace(/^(.+)$/gm, '<p>$1</p>');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; color: #333; }
          p { margin: 0 0 1em 0; }
          a { color: #0066cc; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        ${htmlBody}
      </body>
    </html>
  `;
}
