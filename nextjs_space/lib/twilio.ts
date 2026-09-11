/**
 * Envío por Twilio (WhatsApp o SMS).
 * Opcional: si no hay credenciales reales configuradas, se omite sin romper nada.
 * El canal principal de NiIdea es el email (gratis); esto es un extra.
 */

function isPlaceholder(v: string): boolean {
  return !v || v.toUpperCase().includes('PLACEHOLDER');
}

export function twilioConfigured(): boolean {
  return (
    !isPlaceholder(process.env.TWILIO_ACCOUNT_SID ?? '') &&
    !isPlaceholder(process.env.TWILIO_AUTH_TOKEN ?? '') &&
    !isPlaceholder(process.env.TWILIO_WHATSAPP_FROM ?? '')
  );
}

/** Normaliza un teléfono a formato E.164 asumiendo España si no trae prefijo. */
export function normalizePhone(raw: string): string {
  let p = (raw ?? '').replace(/[\s()-]/g, '');
  if (p.startsWith('whatsapp:')) p = p.slice('whatsapp:'.length);
  if (p.startsWith('00')) p = '+' + p.slice(2);
  if (!p.startsWith('+')) {
    p = p.length === 9 ? '+34' + p : '+' + p;
  }
  return p;
}

export type SendResult = { success: boolean; sid?: string; error?: string; channel?: string };

/**
 * Envía un mensaje de texto por Twilio.
 * Usa WhatsApp si TWILIO_WHATSAPP_FROM empieza por "whatsapp:", si no, SMS.
 */
export async function sendTwilioMessage(phone: string, text: string): Promise<SendResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID ?? '';
  const authToken = process.env.TWILIO_AUTH_TOKEN ?? '';
  const from = process.env.TWILIO_WHATSAPP_FROM ?? '';

  if (!twilioConfigured()) {
    console.log('[Twilio] Sin credenciales reales, se omite el envío');
    return { success: false, error: 'Twilio no configurado' };
  }

  const isWhatsApp = from.startsWith('whatsapp:');
  const to = normalizePhone(phone);

  const body = new URLSearchParams({
    To: isWhatsApp ? `whatsapp:${to}` : to,
    From: from,
    Body: text,
  });

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      }
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error('[Twilio] error:', data?.message);
      return { success: false, error: data?.message ?? 'Error de Twilio' };
    }
    return { success: true, sid: data?.sid, channel: isWhatsApp ? 'whatsapp' : 'sms' };
  } catch (err: any) {
    console.error('[Twilio] error de red:', err?.message);
    return { success: false, error: err?.message ?? 'Error de red' };
  }
}
