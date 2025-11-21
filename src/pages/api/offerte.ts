import type { APIRoute } from 'astro';

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
  // Send notification email to business
  const notificationResult = await sendNotificationEmail(data);
  
  // Send confirmation email to submitter
  const confirmationResult = await sendConfirmationEmail(data);
  
  return {
    emailed: notificationResult.emailed || confirmationResult.emailed,
    notification: notificationResult,
    confirmation: confirmationResult
  };
}

async function sendNotificationEmail(data: Record<string, any>) {
  const subject = `Nieuwe offerte aanvraag – ${data.voornaam} ${data.achternaam}`;
  const html = `
    <h2>Nieuwe Offerte Aanvraag</h2>
    <p><strong>Naam:</strong> ${data.voornaam} ${data.achternaam}</p>
    <p><strong>Telefoon:</strong> ${data.telefoon}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Adres:</strong> ${data.adres}, ${data.postcode} ${data.woonplaats}</p>
    <p><strong>Service:</strong> ${data.service}</p>
    ${data.personen ? `<p><strong>Personen:</strong> ${data.personen}</p>` : ''}
    ${data.datum ? `<p><strong>Gewenste datum:</strong> ${data.datum}</p>` : ''}
    ${data.opmerkingen ? `<p><strong>Opmerkingen:</strong><br/>${data.opmerkingen.replace(/\n/g,'<br/>')}</p>` : ''}
    <hr/>
    <p style="font-size:12px;color:#666">Deze mail is automatisch verstuurd vanaf de website.</p>
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
  const subject = `Bevestiging offerte aanvraag - Technische Service Assen`;
  const html = `
    <h2>Bedankt voor uw offerte aanvraag!</h2>
    <p>Beste ${data.voornaam},</p>
    <p>We hebben uw aanvraag voor <strong>${data.service}</strong> ontvangen en nemen binnen 24 uur contact met u op.</p>
    
    <h3>Uw gegevens:</h3>
    <p><strong>Naam:</strong> ${data.voornaam} ${data.achternaam}</p>
    <p><strong>Telefoon:</strong> ${data.telefoon}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Adres:</strong> ${data.adres}, ${data.postcode} ${data.woonplaats}</p>
    ${data.personen ? `<p><strong>Aantal personen:</strong> ${data.personen}</p>` : ''}
    ${data.datum ? `<p><strong>Gewenste datum:</strong> ${data.datum}</p>` : ''}
    ${data.opmerkingen ? `<p><strong>Uw opmerkingen:</strong><br/>${data.opmerkingen.replace(/\n/g,'<br/>')}</p>` : ''}
    
    <p>Heeft u haast? Bel ons direct op <a href="tel:0658980933">06-58980933</a>.</p>
    
    <hr/>
    <p><strong>Technische Service Assen</strong><br/>
    Telefoon: 06-58980933<br/>
    Email: info@technischeservice.nl</p>
    
    <p style="font-size:12px;color:#666">Deze bevestigingsmail is automatisch verstuurd.</p>
  `;
  const text = `Bedankt voor uw offerte aanvraag!\n\nBeste ${data.voornaam},\n\nWe hebben uw aanvraag voor ${data.service} ontvangen en nemen binnen 24 uur contact met u op.\n\nUw gegevens:\nNaam: ${data.voornaam} ${data.achternaam}\nTelefoon: ${data.telefoon}\nEmail: ${data.email}\nAdres: ${data.adres}, ${data.postcode} ${data.woonplaats}\n${data.personen ? `Aantal personen: ${data.personen}\n` : ''}${data.datum ? `Gewenste datum: ${data.datum}\n` : ''}${data.opmerkingen ? `Uw opmerkingen:\n${data.opmerkingen}\n` : ''}\nHeeft u haast? Bel ons direct op 06-58980933.\n\nTechnische Service Assen\nTelefoon: 06-58980933\nEmail: info@technischeservice.nl`;

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
  if (!to) return { emailed: false, error: 'No recipient configured' };
  
  // Try SMTP first (e.g., Gmail)
  try {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || user || 'no-reply@localhost';
    if (host && port && user && pass) {
      const { createTransport } = await import('nodemailer');
      const transporter = createTransport({
        host,
        port,
        secure: port === 465, // Gmail SSL uses 465
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
      return { emailed: true, via: 'smtp' };
    }
  } catch (e) {
    // fall through to Resend
  }

  // Fallback to Resend if configured
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.OFFERTE_FROM_EMAIL || 'offerte@technischeservice.local';
    if (!apiKey) return { emailed: false };
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({ 
      to, 
      from: fromEmail, 
      subject, 
      html, 
      text, 
      reply_to: replyTo 
    });
    if (error) throw error;
    return { emailed: true, via: 'resend' };
  } catch (e) {
    return { emailed: false, error: String(e) };
  }
}

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return new Response(JSON.stringify({ ok: false, message: 'Invalid content type' }), { status: 400 });
    }
    const body = (await request.json()) as Partial<OffertePayload>;

    // Honeypot
    if (body.website && String(body.website).trim().length > 0) {
      return new Response(JSON.stringify({ ok: true, message: 'Dank je wel' }), { status: 200 });
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
    // Email (Resend if configured)
    const emailed = await maybeSendEmail(data);

    return new Response(JSON.stringify({ 
      ok: true, 
      stored: stored.stored === true, 
      emailed: emailed.emailed === true,
      notification: emailed.notification,
      confirmation: emailed.confirmation
    }), { status: 200, headers: { 'content-type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, message: 'Serverfout', error: String(e) }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
};
