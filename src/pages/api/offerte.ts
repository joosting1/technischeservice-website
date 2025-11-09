import type { APIRoute } from 'astro';

// Note: Environment variables are available via process.env on Cloudflare Workers
// No need for dotenv in production

type OffertePayload = {
  voornaam: string;
  achternaam: string;
  telefoon: string;
  email: string;
  adres: string;
  postcode: string;
  woonplaats: string;
  service: string;
  personen?: string;
  datum?: string;
  opmerkingen?: string;
  website?: string; // honeypot
  privacy?: string | boolean;
};

function sanitize(input: unknown, max = 500): string {
  const s = (typeof input === 'string' ? input : String(input ?? '')).trim();
  return s.replace(/[\u0000-\u001F<>]/g, '').slice(0, max);
}

function isEmail(v: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
}

function isPostcodeNL(v: string): boolean {
  return /^\d{4}\s?[A-Za-z]{2}$/.test(v);
}

async function maybeStoreSupabase(data: Record<string, any>) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { stored: false };
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key);
    const { error } = await supabase.from('offertes').insert({
      created_at: new Date().toISOString(),
      payload: data,
    });
    if (error) throw error;
    return { stored: true };
  } catch (e) {
    return { stored: false, error: String(e) };
  }
}

async function maybeSendEmail(data: Record<string, any>) {
  // For now, only send notification email to business (not confirmation to customer)
  // Confirmation emails require domain verification with Resend
  const notificationResult = await sendNotificationEmail(data);
  
  console.log('[Email] Notification result:', JSON.stringify(notificationResult, null, 2));
  
  return {
    emailed: notificationResult.emailed,
    notification: notificationResult,
    confirmation: { skipped: true, reason: 'Domain verification required for customer emails' }
  };
}

async function sendNotificationEmail(data: Record<string, any>) {
  const subject = `🔔 Nieuwe offerte aanvraag – ${data.voornaam} ${data.achternaam}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 40px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                    Nieuwe Offerte Aanvraag
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-bottom: 30px;">
                        <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 15px 20px; border-radius: 4px;">
                          <p style="margin: 0; color: #6c757d; font-size: 14px;">Er is een nieuwe offerte aanvraag binnengekomen via de website</p>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Klantgegevens -->
                    <tr>
                      <td style="padding-bottom: 25px;">
                        <h2 style="margin: 0 0 15px 0; color: #2d3748; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
                          👤 Klantgegevens
                        </h2>
                        <table width="100%" cellpadding="8" cellspacing="0">
                          <tr>
                            <td width="140" style="color: #6c757d; font-size: 14px; font-weight: 500;">Naam:</td>
                            <td style="color: #2d3748; font-size: 14px; font-weight: 600;">${data.voornaam} ${data.achternaam}</td>
                          </tr>
                          <tr>
                            <td style="color: #6c757d; font-size: 14px; font-weight: 500;">Telefoon:</td>
                            <td style="color: #2d3748; font-size: 14px;"><a href="tel:${data.telefoon}" style="color: #667eea; text-decoration: none;">${data.telefoon}</a></td>
                          </tr>
                          <tr>
                            <td style="color: #6c757d; font-size: 14px; font-weight: 500;">Email:</td>
                            <td style="color: #2d3748; font-size: 14px;"><a href="mailto:${data.email}" style="color: #667eea; text-decoration: none;">${data.email}</a></td>
                          </tr>
                          <tr>
                            <td style="color: #6c757d; font-size: 14px; font-weight: 500;">Adres:</td>
                            <td style="color: #2d3748; font-size: 14px;">${data.adres}</td>
                          </tr>
                          <tr>
                            <td style="color: #6c757d; font-size: 14px; font-weight: 500;">Postcode & Plaats:</td>
                            <td style="color: #2d3748; font-size: 14px;">${data.postcode} ${data.woonplaats}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Aanvraagdetails -->
                    <tr>
                      <td style="padding-bottom: 25px;">
                        <h2 style="margin: 0 0 15px 0; color: #2d3748; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
                          📋 Aanvraagdetails
                        </h2>
                        <table width="100%" cellpadding="8" cellspacing="0">
                          <tr>
                            <td width="140" style="color: #6c757d; font-size: 14px; font-weight: 500;">Service:</td>
                            <td style="color: #2d3748; font-size: 14px;">
                              <span style="background-color: #667eea; color: #ffffff; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 500;">
                                ${data.service}
                              </span>
                            </td>
                          </tr>
                          ${data.personen ? `
                          <tr>
                            <td style="color: #6c757d; font-size: 14px; font-weight: 500;">Personen:</td>
                            <td style="color: #2d3748; font-size: 14px;">${data.personen}</td>
                          </tr>
                          ` : ''}
                          ${data.datum ? `
                          <tr>
                            <td style="color: #6c757d; font-size: 14px; font-weight: 500;">Gewenste datum:</td>
                            <td style="color: #2d3748; font-size: 14px;">${data.datum}</td>
                          </tr>
                          ` : ''}
                        </table>
                      </td>
                    </tr>
                    
                    ${data.opmerkingen ? `
                    <!-- Opmerkingen -->
                    <tr>
                      <td style="padding-bottom: 25px;">
                        <h2 style="margin: 0 0 15px 0; color: #2d3748; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
                          💬 Opmerkingen
                        </h2>
                        <div style="background-color: #f8f9fa; padding: 15px 20px; border-radius: 6px; border: 1px solid #e2e8f0;">
                          <p style="margin: 0; color: #2d3748; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.opmerkingen}</p>
                        </div>
                      </td>
                    </tr>
                    ` : ''}
                    
                    <!-- Call to Action -->
                    <tr>
                      <td style="padding-top: 20px; text-align: center;">
                        <a href="mailto:${data.email}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                          📧 Reageer direct via email
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px 40px; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0; color: #6c757d; font-size: 12px; text-align: center;">
                    Deze mail is automatisch verstuurd vanaf technischeservice.nl
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  const text = `Nieuwe Offerte Aanvraag\n\nNaam: ${data.voornaam} ${data.achternaam}\nTelefoon: ${data.telefoon}\nEmail: ${data.email}\nAdres: ${data.adres}, ${data.postcode} ${data.woonplaats}\nService: ${data.service}\nPersonen: ${data.personen || ''}\nGewenste datum: ${data.datum || ''}\nOpmerkingen:\n${data.opmerkingen || ''}`;

  return await sendEmailViaProviders({
    to: process.env.SMTP_TO || process.env.OFFERTE_TO_EMAIL || process.env.SEND_TO_EMAIL,
    subject,
    html,
    text,
    replyTo: data.email
  });
}

async function sendConfirmationEmail(data: Record<string, any>) {
  const subject = `✅ Bevestiging offerte aanvraag - Technische Service Assen`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px 40px; text-align: center;">
                  <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                    Bedankt voor uw aanvraag!
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-bottom: 25px;">
                        <p style="margin: 0 0 15px 0; color: #2d3748; font-size: 16px; line-height: 1.6;">
                          Beste <strong>${data.voornaam}</strong>,
                        </p>
                        <p style="margin: 0; color: #2d3748; font-size: 16px; line-height: 1.6;">
                          We hebben uw aanvraag voor <strong style="color: #10b981;">${data.service}</strong> ontvangen en nemen binnen 24 uur contact met u op.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Success Box -->
                    <tr>
                      <td style="padding-bottom: 30px;">
                        <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-left: 4px solid #10b981; padding: 20px; border-radius: 6px;">
                          <p style="margin: 0; color: #065f46; font-size: 14px; font-weight: 500;">
                            ⏱️ Reactietijd: binnen 24 uur<br/>
                            � Spoed? App direct: <a href="https://wa.me/31658980933" style="color: #059669; text-decoration: none; font-weight: 600;">06-58980933</a>
                          </p>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Uw gegevens -->
                    <tr>
                      <td style="padding-bottom: 25px;">
                        <h2 style="margin: 0 0 15px 0; color: #2d3748; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
                          📋 Uw aanvraag
                        </h2>
                        <table width="100%" cellpadding="8" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px;">
                          <tr>
                            <td width="140" style="color: #6c757d; font-size: 14px; font-weight: 500; padding: 12px;">Naam:</td>
                            <td style="color: #2d3748; font-size: 14px; padding: 12px;">${data.voornaam} ${data.achternaam}</td>
                          </tr>
                          <tr style="border-top: 1px solid #e2e8f0;">
                            <td style="color: #6c757d; font-size: 14px; font-weight: 500; padding: 12px;">Telefoon:</td>
                            <td style="color: #2d3748; font-size: 14px; padding: 12px;">${data.telefoon}</td>
                          </tr>
                          <tr style="border-top: 1px solid #e2e8f0;">
                            <td style="color: #6c757d; font-size: 14px; font-weight: 500; padding: 12px;">Email:</td>
                            <td style="color: #2d3748; font-size: 14px; padding: 12px;">${data.email}</td>
                          </tr>
                          <tr style="border-top: 1px solid #e2e8f0;">
                            <td style="color: #6c757d; font-size: 14px; font-weight: 500; padding: 12px;">Adres:</td>
                            <td style="color: #2d3748; font-size: 14px; padding: 12px;">${data.adres}<br/>${data.postcode} ${data.woonplaats}</td>
                          </tr>
                          <tr style="border-top: 1px solid #e2e8f0;">
                            <td style="color: #6c757d; font-size: 14px; font-weight: 500; padding: 12px;">Service:</td>
                            <td style="color: #2d3748; font-size: 14px; padding: 12px;">
                              <span style="background-color: #10b981; color: #ffffff; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 500;">
                                ${data.service}
                              </span>
                            </td>
                          </tr>
                          ${data.personen ? `
                          <tr style="border-top: 1px solid #e2e8f0;">
                            <td style="color: #6c757d; font-size: 14px; font-weight: 500; padding: 12px;">Aantal personen:</td>
                            <td style="color: #2d3748; font-size: 14px; padding: 12px;">${data.personen}</td>
                          </tr>
                          ` : ''}
                          ${data.datum ? `
                          <tr style="border-top: 1px solid #e2e8f0;">
                            <td style="color: #6c757d; font-size: 14px; font-weight: 500; padding: 12px;">Gewenste datum:</td>
                            <td style="color: #2d3748; font-size: 14px; padding: 12px;">${data.datum}</td>
                          </tr>
                          ` : ''}
                          ${data.opmerkingen ? `
                          <tr style="border-top: 1px solid #e2e8f0;">
                            <td colspan="2" style="padding: 12px;">
                              <div style="color: #6c757d; font-size: 14px; font-weight: 500; margin-bottom: 8px;">Uw opmerkingen:</div>
                              <div style="color: #2d3748; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.opmerkingen}</div>
                            </td>
                          </tr>
                          ` : ''}
                        </table>
                      </td>
                    </tr>
                    
                    <!-- CTA Button -->
                    <tr>
                      <td style="padding: 20px 0; text-align: center;">
                        <a href="https://wa.me/31658980933" style="display: inline-block; background: linear-gradient(135deg, #25d366 0%, #128c7e 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(37, 211, 102, 0.3);">
                          � Direct appen via WhatsApp
                        </a>
                      </td>
                    </tr>
                    
                    <!-- Company Info -->
                    <tr>
                      <td style="padding-top: 30px; border-top: 2px solid #e2e8f0;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="text-align: center; padding: 20px 0;">
                              <p style="margin: 0 0 10px 0; color: #2d3748; font-size: 18px; font-weight: 600;">
                                Technische Service Assen
                              </p>
                              <p style="margin: 0; color: #6c757d; font-size: 14px; line-height: 1.8;">
                                � <a href="https://wa.me/31658980933" style="color: #25d366; text-decoration: none; font-weight: 600;">WhatsApp: 06-58980933</a><br/>
                                �📞 <a href="tel:0658980933" style="color: #10b981; text-decoration: none;">Tel: 06-58980933</a><br/>
                                📧 <a href="mailto:info@technischeservice.nl" style="color: #10b981; text-decoration: none;">info@technischeservice.nl</a><br/>
                                🌐 <a href="https://technischeservice.nl" style="color: #10b981; text-decoration: none;">www.technischeservice.nl</a>
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px 40px; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0; color: #6c757d; font-size: 12px; text-align: center;">
                    Deze bevestigingsmail is automatisch verstuurd via technischeservice.nl
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  const text = `Bedankt voor uw offerte aanvraag!\n\nBeste ${data.voornaam},\n\nWe hebben uw aanvraag voor ${data.service} ontvangen en nemen binnen 24 uur contact met u op.\n\nUw gegevens:\nNaam: ${data.voornaam} ${data.achternaam}\nTelefoon: ${data.telefoon}\nEmail: ${data.email}\nAdres: ${data.adres}, ${data.postcode} ${data.woonplaats}\n${data.personen ? `Aantal personen: ${data.personen}\n` : ''}${data.datum ? `Gewenste datum: ${data.datum}\n` : ''}${data.opmerkingen ? `Uw opmerkingen:\n${data.opmerkingen}\n` : ''}\nHeeft u haast? App ons direct via WhatsApp: https://wa.me/31658980933\n\nTechnische Service Assen\nWhatsApp: 06-58980933\nEmail: info@technischeservice.nl\nWebsite: www.technischeservice.nl`;

  return await sendEmailViaProviders({
    to: data.email,
    subject,
    html,
    text
  });
}

async function sendEmailViaProviders({ to, subject, html, text, replyTo }: {
  to: string | undefined;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}) {
  if (!to) {
    console.log('[Email] No recipient configured');
    return { emailed: false, error: 'No recipient configured' };
  }
  
  // Try SMTP first (Gmail works on Cloudflare Workers via fetch)
  try {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || user || 'no-reply@localhost';
    
    console.log('[Email] Attempting SMTP...', { host, port, user: user ? '***' : undefined, from, to });
    
    if (host && port && user && pass) {
      // Use Cloudflare Email Workers API or fetch-based SMTP
      // For now, we'll use nodemailer (works locally, may not work on Workers)
      const { createTransport } = await import('nodemailer');
      const transporter = createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
        replyTo,
      });
      console.log('[Email] SMTP success to:', to);
      return { emailed: true, via: 'smtp' };
    } else {
      console.log('[Email] SMTP not configured, trying Resend...');
    }
  } catch (e) {
    console.error('[Email] SMTP failed:', e);
    // fall through to Resend
  }
  
  // Fallback to Resend (requires domain verification)
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.OFFERTE_FROM_EMAIL || 'onboarding@resend.dev';
    console.log('[Email] Attempting Resend...', { 
      apiKey: apiKey ? 'SET' : 'MISSING', 
      fromEmail, 
      to 
    });
    
    if (!apiKey) {
      console.error('[Email] RESEND_API_KEY not set!');
      return { emailed: false, error: 'RESEND_API_KEY not configured' };
    }
    
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);
    
    console.log('[Email] Calling Resend API...');
    const result = await resend.emails.send({ 
      to, 
      from: fromEmail, 
      subject, 
      html, 
      text, 
      replyTo: replyTo 
    });
    
    console.log('[Email] Resend raw result:', JSON.stringify(result, null, 2));
    
    if (result.error) {
      console.error('[Email] Resend API error:', result.error);
      return { 
        emailed: false, 
        error: result.error,
        via: 'resend'
      };
    }
    
    console.log('[Email] Resend success:', { to, id: result.data?.id });
    return { emailed: true, via: 'resend', id: result.data?.id };
  } catch (e) {
    console.error('[Email] Resend failed:', e);
    return { emailed: false, error: String(e) };
  }

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Debug: Log environment variables
    console.log('[Offerte API] Environment check:', {
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER ? '***' : undefined,
      SMTP_FROM: process.env.SMTP_FROM,
      SMTP_TO: process.env.SMTP_TO
    });
    
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return new Response(JSON.stringify({ ok: false, message: 'Invalid content type' }), { status: 400 });
    }
    const body = (await request.json()) as Partial<OffertePayload>;

    // Honeypot
    if (body.website && String(body.website).trim().length > 0) {
      return new Response(JSON.stringify({ ok: true, message: 'Dank je wel' }), { status: 200 });
    }

    // Privacy checkbox validatie
    const privacyAccepted = body.privacy === 'on' || body.privacy === true || body.privacy === 'true';
    if (!privacyAccepted) {
      return new Response(JSON.stringify({ ok: false, message: 'U moet akkoord gaan met het privacybeleid' }), { status: 400, headers: { 'content-type': 'application/json' } });
    }

    // Sanitize and basic validation
    const data: Record<string, string> = {
      voornaam: sanitize(body.voornaam, 100),
      achternaam: sanitize(body.achternaam, 120),
      telefoon: sanitize(body.telefoon, 40),
      email: sanitize(body.email, 200),
      adres: sanitize(body.adres, 200),
      postcode: sanitize(body.postcode, 8).toUpperCase(),
      woonplaats: sanitize(body.woonplaats, 120),
      service: sanitize(body.service, 60),
      personen: sanitize(body.personen ?? '', 20),
      datum: sanitize(body.datum ?? '', 20),
      opmerkingen: sanitize(body.opmerkingen ?? '', 2000),
    };

    const missing = ['voornaam','achternaam','telefoon','email','adres','postcode','woonplaats','service'].filter(k => !data[k]);
    if (missing.length) {
      return new Response(JSON.stringify({ ok: false, message: `Ontbrekende velden: ${missing.join(', ')}` }), { status: 400, headers: { 'content-type': 'application/json' } });
    }
    if (!isEmail(data.email)) {
      return new Response(JSON.stringify({ ok: false, message: 'Ongeldig e-mailadres' }), { status: 400, headers: { 'content-type': 'application/json' } });
    }
    if (!isPostcodeNL(data.postcode)) {
      return new Response(JSON.stringify({ ok: false, message: 'Ongeldige postcode (NL)' }), { status: 400, headers: { 'content-type': 'application/json' } });
    }

    // Optional server-side basic rate limiting via header fingerprint (best-effort)
    // Intentionally omitted persistent rate limiting in this minimal setup.

    // Store (Supabase if configured)
    const stored = await maybeStoreSupabase({ ...data, created_at: new Date().toISOString() });
    console.log('[Offerte API] Storage result:', stored);
    
    // Email (Resend if configured)
    const emailed = await maybeSendEmail(data);
    console.log('[Offerte API] Email result:', JSON.stringify(emailed, null, 2));

    return new Response(JSON.stringify({ 
      ok: true, 
      stored: stored.stored === true, 
      emailed: emailed.emailed === true,
      emailDetails: {
        notification: emailed.notification,
        confirmation: emailed.confirmation
      }
    }), { status: 200, headers: { 'content-type': 'application/json' } });
  } catch (e) {
    console.error('[Offerte API] Fatal error:', e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    const errorStack = e instanceof Error ? e.stack : undefined;
    return new Response(JSON.stringify({ 
      ok: false, 
      message: 'Serverfout', 
      error: errorMessage,
      stack: errorStack
    }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
};