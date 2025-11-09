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
  // Send both notification to business and confirmation to customer
  const notificationResult = await sendNotificationEmail(data);
  const confirmationResult = await sendConfirmationEmail(data);
  
  console.log('[Email] Notification result:', JSON.stringify(notificationResult, null, 2));
  console.log('[Email] Confirmation result:', JSON.stringify(confirmationResult, null, 2));
  
  return {
    emailed: notificationResult.emailed || confirmationResult.emailed,
    notification: notificationResult,
    confirmation: confirmationResult
  };
}

async function sendNotificationEmail(data: Record<string, any>) {
  const subject = `🔔 Nieuwe offerte aanvraag – ${data.voornaam} ${data.achternaam}`;
  
  console.log('[Email] Received data.photos:', data.photos?.length || 0, 'photos');
  console.log('[Email] Data check:', { 
    service: data.service, 
    units: data.units, 
    indoorUnits: data['indoor-units'],
    hasContract: data.service?.includes('Onderhoudscontract'),
    hasUnits: !!data.units
  });
  
  // Convert base64 photos to attachments
  const attachments: Array<{ filename: string; content: string }> = [];
  if (data.photos && Array.isArray(data.photos)) {
    console.log('[Email] Processing', data.photos.length, 'photos for attachments');
    data.photos.forEach((photo: string, index: number) => {
      // Extract base64 data (remove data:image/...;base64, prefix)
      const base64Data = photo.split(',')[1] || photo;
      console.log('[Email] Photo', index + 1, 'base64 length:', base64Data.length);
      attachments.push({
        filename: `installatie-foto-${index + 1}.jpg`,
        content: base64Data
      });
    });
  }
  
  console.log('[Email] Total attachments prepared:', attachments.length);
  
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
                          ${data.units ? `
                          <tr>
                            <td style="color: #6c757d; font-size: 14px; font-weight: 500;">
                              ${data.service.includes('Airco') ? 'Buitenunits:' : 'Aantal units:'}
                            </td>
                            <td style="color: #2d3748; font-size: 14px; font-weight: 600;">
                              ${data.units} ${data.service.includes('Airco') ? 'buitenunit(s)' : data.service.includes('Quooker') ? 'kraan/kranen' : 'waterontharder(s)'}
                            </td>
                          </tr>
                          ` : ''}
                          ${data['indoor-units'] ? `
                          <tr>
                            <td style="color: #6c757d; font-size: 14px; font-weight: 500;">Binnenunits:</td>
                            <td style="color: #2d3748; font-size: 14px; font-weight: 600;">${data['indoor-units']} binnenunit(s)</td>
                          </tr>
                          ` : ''}
                          ${data['distance-surcharge'] ? `
                          <tr>
                            <td style="color: #6c757d; font-size: 14px; font-weight: 500;">Afstandstoeslag:</td>
                            <td style="color: #2d3748; font-size: 14px; font-weight: 600;">✓ Ja (€3,50/maand)</td>
                          </tr>
                          ` : ''}
                          ${data['accessible'] === 'on' ? `
                          <tr>
                            <td style="color: #6c757d; font-size: 14px; font-weight: 500;">Bereikbaarheid:</td>
                            <td style="color: #2d3748; font-size: 14px; font-weight: 600;">✓ Goed bereikbaar (&lt;3m)</td>
                          </tr>
                          ` : data['accessible'] !== undefined ? `
                          <tr>
                            <td style="color: #6c757d; font-size: 14px; font-weight: 500;">Bereikbaarheid:</td>
                            <td style="color: #f59e0b; font-size: 14px; font-weight: 600;">⚠️ Moeilijk bereikbaar - meerprijs in overleg (±€150-€300)</td>
                          </tr>
                          ` : ''}
                          ${data.model ? `
                          <tr>
                            <td style="color: #6c757d; font-size: 14px; font-weight: 500;">Type:</td>
                            <td style="color: #2d3748; font-size: 14px;">${data.model}</td>
                          </tr>
                          ` : ''}
                          ${data.iban ? `
                          <tr>
                            <td style="color: #6c757d; font-size: 14px; font-weight: 500;">IBAN:</td>
                            <td style="color: #2d3748; font-size: 14px; font-family: 'Courier New', monospace;">${data.iban}</td>
                          </tr>
                          <tr>
                            <td style="color: #6c757d; font-size: 14px; font-weight: 500;">Rekeninghouder:</td>
                            <td style="color: #2d3748; font-size: 14px;">${data['account-holder']}</td>
                          </tr>
                          ` : ''}
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
                    
                    ${data.service && data.service.includes('Onderhoudscontract') && data.units ? `
                    <!-- Maandelijkse Kosten -->
                    <tr>
                      <td style="padding-bottom: 25px;">
                        <h2 style="margin: 0 0 15px 0; color: #2d3748; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
                          💰 Maandelijkse Kosten
                        </h2>
                        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 8px;">
                          <table width="100%" cellpadding="6" cellspacing="0">
                            ${data.service.includes('Airco') ? `
                            <tr>
                              <td style="color: #ffffff; font-size: 14px;">Buitenunits:</td>
                              <td style="color: #ffffff; font-size: 14px; text-align: right;">${data.units} × €7,50</td>
                              <td style="color: #ffffff; font-size: 14px; text-align: right; font-weight: 600;">€${(parseFloat(data.units) * 7.50).toFixed(2).replace('.', ',')}</td>
                            </tr>
                            ${data['indoor-units'] ? `
                            <tr>
                              <td style="color: #ffffff; font-size: 14px;">Binnenunits:</td>
                              <td style="color: #ffffff; font-size: 14px; text-align: right;">${data['indoor-units']} × €2,50</td>
                              <td style="color: #ffffff; font-size: 14px; text-align: right; font-weight: 600;">€${(parseFloat(data['indoor-units']) * 2.50).toFixed(2).replace('.', ',')}</td>
                            </tr>
                            ` : ''}
                            ${data['distance-surcharge'] ? `
                            <tr>
                              <td style="color: #ffffff; font-size: 14px;">Afstandstoeslag:</td>
                              <td style="color: #ffffff; font-size: 14px; text-align: right;"></td>
                              <td style="color: #ffffff; font-size: 14px; text-align: right; font-weight: 600;">€3,50</td>
                            </tr>
                            ` : ''}
                            ` : data.service.includes('Quooker') ? `
                            <tr>
                              <td style="color: #ffffff; font-size: 14px;">Quooker units:</td>
                              <td style="color: #ffffff; font-size: 14px; text-align: right;">${data.units} × €5,00</td>
                              <td style="color: #ffffff; font-size: 14px; text-align: right; font-weight: 600;">€${(parseFloat(data.units) * 5.00).toFixed(2).replace('.', ',')}</td>
                            </tr>
                            ` : data.service.includes('Waterontharder') ? `
                            <tr>
                              <td style="color: #ffffff; font-size: 14px;">Waterontharders:</td>
                              <td style="color: #ffffff; font-size: 14px; text-align: right;">${data.units} × €7,50</td>
                              <td style="color: #ffffff; font-size: 14px; text-align: right; font-weight: 600;">€${(parseFloat(data.units) * 7.50).toFixed(2).replace('.', ',')}</td>
                            </tr>
                            ` : ''}
                            <tr>
                              <td colspan="3" style="padding-top: 10px; border-top: 2px solid rgba(255,255,255,0.3);"></td>
                            </tr>
                            <tr>
                              <td style="color: #ffffff; font-size: 16px; font-weight: 600;">Totaal per maand:</td>
                              <td></td>
                              <td style="color: #ffffff; font-size: 18px; text-align: right; font-weight: 700;">
                                €${(() => {
                                  let total = 0;
                                  if (data.service.includes('Airco')) {
                                    total = parseFloat(data.units || 0) * 7.50;
                                    if (data['indoor-units']) total += parseFloat(data['indoor-units']) * 2.50;
                                    if (data['distance-surcharge']) total += 3.50;
                                  } else if (data.service.includes('Quooker')) {
                                    total = parseFloat(data.units || 0) * 5.00;
                                  } else if (data.service.includes('Waterontharder')) {
                                    total = parseFloat(data.units || 0) * 7.50;
                                  }
                                  return total.toFixed(2).replace('.', ',');
                                })()}
                              </td>
                            </tr>
                          </table>
                        </div>
                      </td>
                    </tr>
                    ` : ''}
                    
                    ${data.opmerkingen && data.opmerkingen.trim() ? `
                    <!-- Extra Opmerkingen -->
                    <tr>
                      <td style="padding-bottom: 25px;">
                        <h2 style="margin: 0 0 15px 0; color: #2d3748; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
                          💬 Extra Opmerkingen
                        </h2>
                        <div style="background-color: #f8f9fa; padding: 15px 20px; border-radius: 6px; border: 1px solid #e2e8f0;">
                          <p style="margin: 0; color: #2d3748; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.opmerkingen}</p>
                        </div>
                      </td>
                    </tr>
                    ` : ''}
                    
                    ${attachments.length > 0 ? `
                    <!-- Bijlagen -->
                    <tr>
                      <td style="padding-bottom: 25px;">
                        <h2 style="margin: 0 0 15px 0; color: #2d3748; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
                          📎 Bijgevoegde foto's
                        </h2>
                        <div style="background-color: #f0f9ff; padding: 15px 20px; border-radius: 6px; border: 1px solid #bfdbfe;">
                          <p style="margin: 0; color: #1e40af; font-size: 14px;">
                            ${attachments.length} foto${attachments.length > 1 ? "'s" : ''} van de installatie bijgevoegd als bijlage${attachments.length > 1 ? 'n' : ''}.
                          </p>
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

  // Try multiple environment variable names for recipient
  const recipient = process.env.SMTP_TO || 
                   process.env.OFFERTE_TO_EMAIL || 
                   process.env.SEND_TO_EMAIL ||
                   process.env.TO_EMAIL ||
                   'johan@technischeservice.nl'; // hardcoded fallback
  
  console.log('[Email] Recipient resolved to:', recipient);

  return await sendEmailViaProviders({
    to: recipient,
    subject,
    html,
    text,
    replyTo: data.email,
    attachments
  });
}

async function sendConfirmationEmail(data: Record<string, any>) {
  const isContract = data.service && data.service.includes('Onderhoudscontract');
  const subject = isContract 
    ? `✅ Bevestiging onderhoudscontract aanvraag - Technische Service Assen`
    : `✅ Bevestiging offerte aanvraag - Technische Service Assen`;
    
  // Calculate monthly price for contracts
  let monthlyPrice = 0;
  let priceBreakdown = '';
  
  if (isContract) {
    if (data.service.includes('Airco')) {
      const outdoorUnits = parseInt(data.units) || 0;
      const indoorUnits = parseInt(data['indoor-units']) || 0;
      const distanceSurcharge = data['distance-surcharge'] ? 3.50 : 0;
      
      monthlyPrice = (outdoorUnits * 7.50) + (indoorUnits * 2.50) + distanceSurcharge;
      priceBreakdown = `
        <tr>
          <td style="color: #6c757d; font-size: 14px; padding: 8px;">Buitenunits:</td>
          <td style="color: #2d3748; font-size: 14px; padding: 8px; text-align: right;">${outdoorUnits} × €7,50</td>
          <td style="color: #2d3748; font-size: 14px; padding: 8px; text-align: right; font-weight: 600;">€${(outdoorUnits * 7.50).toFixed(2)}</td>
        </tr>
        <tr>
          <td style="color: #6c757d; font-size: 14px; padding: 8px;">Binnenunits:</td>
          <td style="color: #2d3748; font-size: 14px; padding: 8px; text-align: right;">${indoorUnits} × €2,50</td>
          <td style="color: #2d3748; font-size: 14px; padding: 8px; text-align: right; font-weight: 600;">€${(indoorUnits * 2.50).toFixed(2)}</td>
        </tr>
        ${distanceSurcharge > 0 ? `
        <tr>
          <td style="color: #6c757d; font-size: 14px; padding: 8px;">Afstandstoeslag (>25km):</td>
          <td style="color: #2d3748; font-size: 14px; padding: 8px; text-align: right;">1 × €3,50</td>
          <td style="color: #2d3748; font-size: 14px; padding: 8px; text-align: right; font-weight: 600;">€3,50</td>
        </tr>
        ` : ''}
      `;
    } else if (data.service.includes('Quooker')) {
      const units = parseInt(data.units) || 1;
      monthlyPrice = units * 5.00;
      priceBreakdown = `
        <tr>
          <td style="color: #6c757d; font-size: 14px; padding: 8px;">Quooker kranen:</td>
          <td style="color: #2d3748; font-size: 14px; padding: 8px; text-align: right;">${units} × €5,00</td>
          <td style="color: #2d3748; font-size: 14px; padding: 8px; text-align: right; font-weight: 600;">€${monthlyPrice.toFixed(2)}</td>
        </tr>
      `;
    } else if (data.service.includes('Waterontharder')) {
      const units = parseInt(data.units) || 1;
      monthlyPrice = units * 7.50;
      priceBreakdown = `
        <tr>
          <td style="color: #6c757d; font-size: 14px; padding: 8px;">Waterontharders:</td>
          <td style="color: #2d3748; font-size: 14px; padding: 8px; text-align: right;">${units} × €7,50</td>
          <td style="color: #2d3748; font-size: 14px; padding: 8px; text-align: right; font-weight: 600;">€${monthlyPrice.toFixed(2)}</td>
        </tr>
      `;
    }
  }
  
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
                    
                    ${isContract && monthlyPrice > 0 ? `
                    <!-- Contract Pricing -->
                    <tr>
                      <td style="padding-bottom: 25px;">
                        <h2 style="margin: 0 0 15px 0; color: #2d3748; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
                          💰 Maandelijkse Kosten
                        </h2>
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; overflow: hidden;">
                          ${priceBreakdown}
                          <tr style="border-top: 2px solid #10b981; background-color: #e6f7f1;">
                            <td colspan="2" style="color: #2d3748; font-size: 16px; padding: 12px; font-weight: 600;">Totaal per maand:</td>
                            <td style="color: #10b981; font-size: 18px; padding: 12px; text-align: right; font-weight: 700;">€${monthlyPrice.toFixed(2)}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Incasso Info -->
                    <tr>
                      <td style="padding-bottom: 25px;">
                        <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 6px;">
                          <h3 style="margin: 0 0 12px 0; color: #1e40af; font-size: 16px; font-weight: 600;">
                            🏦 Automatische Incasso
                          </h3>
                          <p style="margin: 0 0 10px 0; color: #2d3748; font-size: 14px; line-height: 1.6;">
                            Het maandelijkse bedrag van <strong>€${monthlyPrice.toFixed(2)}</strong> wordt automatisch geïncasseerd van rekening:
                          </p>
                          <p style="margin: 0 0 10px 0; color: #2d3748; font-size: 14px; font-weight: 600;">
                            ${data.iban} t.n.v. ${data['account-holder']}
                          </p>
                          <p style="margin: 0; color: #6c757d; font-size: 13px; line-height: 1.5;">
                            <strong>Incassant:</strong> Stichting Paypro namens Technische Service Assen<br>
                            <strong>Machtiging:</strong> Eenmalig, doorlopend<br>
                            <strong>Opzeggen:</strong> Maandelijks mogelijk, zonder kosten
                          </p>
                        </div>
                      </td>
                    </tr>
                    ` : ''}
                    
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
                            <td style="color: #6c757d; font-size: 14px; font-weight: 500; padding: 12px;">Gewenste ${isContract ? 'start' : ''}datum:</td>
                            <td style="color: #2d3748; font-size: 14px; padding: 12px;">${data.datum}</td>
                          </tr>
                          ` : ''}
                          ${isContract && data.units ? `
                          <tr style="border-top: 1px solid #e2e8f0;">
                            <td style="color: #6c757d; font-size: 14px; font-weight: 500; padding: 12px;">Aantal units:</td>
                            <td style="color: #2d3748; font-size: 14px; padding: 12px;">
                              ${data.units} ${data.service.includes('Airco') ? 'buitenunit(s)' : data.service.includes('Quooker') ? 'kraan/kranen' : 'waterontharder(s)'}
                              ${data['indoor-units'] ? `<br/>${data['indoor-units']} binnenunit(s)` : ''}
                            </td>
                          </tr>
                          ` : ''}
                          ${isContract && data.model ? `
                          <tr style="border-top: 1px solid #e2e8f0;">
                            <td style="color: #6c757d; font-size: 14px; font-weight: 500; padding: 12px;">Type:</td>
                            <td style="color: #2d3748; font-size: 14px; padding: 12px;">${data.model}</td>
                          </tr>
                          ` : ''}
                          ${data.opmerkingen ? `
                          <tr style="border-top: 1px solid #e2e8f0;">
                            <td colspan="2" style="padding: 12px;">
                              <div style="color: #6c757d; font-size: 14px; font-weight: 500; margin-bottom: 8px;">Opmerkingen:</div>
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

async function sendEmailViaProviders({ 
  to, 
  subject, 
  html, 
  text, 
  replyTo,
  attachments = []
}: {
  to: string | undefined;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: Array<{ filename: string; content: string }>;
}) {
  if (!to) {
    console.log('[Email] No recipient configured');
    return { emailed: false, error: 'No recipient configured' };
  }
  
  console.log('[Email] sendEmailViaProviders called with:', { to, subject, hasAttachments: attachments.length > 0 });
  
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
    // Try multiple env var sources, fallback to hardcoded
    const apiKey = process.env.RESEND_API_KEY || 
                   process.env.RESEND_KEY || 
                   're_GCEWZ6s5_7oozqF8FXXyunM17FZggNmHu'; // hardcoded fallback
    
    // Use verified domain now that DKIM is active
    const fromEmail = process.env.OFFERTE_FROM_EMAIL || 
                      process.env.FROM_EMAIL || 
                      'noreply@technischeservice.nl';  // Domain verified ✅
    
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
    
    console.log('[Email] Calling Resend API with', attachments.length, 'attachments...');
    
    const emailPayload: any = { 
      to, 
      from: fromEmail, 
      subject, 
      html, 
      text, 
      replyTo: replyTo
    };
    
    if (attachments.length > 0) {
      emailPayload.attachments = attachments;
      console.log('[Email] Attachments added to payload:', attachments.map(a => a.filename).join(', '));
    }
    
    const result = await resend.emails.send(emailPayload);
    
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