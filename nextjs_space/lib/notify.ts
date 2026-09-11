/**
 * Envío de emails de NiIdea a través de la API de notificaciones.
 * Nunca lanza excepción: si falla, lo registra y devuelve success:false,
 * para que el flujo de pago/asignación no se rompa por un email.
 */

type SendArgs = {
  notificationId: string | undefined;
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

export async function sendNiIdeaEmail(args: SendArgs): Promise<{ success: boolean; error?: string }> {
  const { notificationId, to, subject, html, replyTo } = args;

  if (!notificationId) {
    console.warn('[notify] notification_id no configurado, se omite el envío');
    return { success: false, error: 'notification_id no configurado' };
  }
  if (!to) {
    return { success: false, error: 'destinatario vacío' };
  }

  const appUrl = process.env.NEXTAUTH_URL ?? '';
  let hostname = 'niidea.msxi.abacus.ai';
  try {
    if (appUrl) hostname = new URL(appUrl).hostname;
  } catch {
    /* se queda el valor por defecto */
  }

  try {
    const res = await fetch('https://msxi.abacus.ai/api/sendNotificationEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deployment_token: process.env.ABACUSAI_API_KEY,
        app_id: process.env.WEB_APP_ID,
        notification_id: notificationId,
        subject,
        body: html,
        is_html: true,
        recipient_email: to,
        sender_email: `noreply@${hostname}`,
        sender_alias: 'NiIdea',
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    const result = await res.json().catch(() => ({}));

    if (!result?.success) {
      if (result?.notification_disabled) {
        console.log('[notify] notificación desactivada por el usuario, se omite');
        return { success: false, error: 'notificación desactivada' };
      }
      const msg = result?.message ?? `HTTP ${res.status}`;
      console.error('[notify] fallo al enviar email:', msg);
      return { success: false, error: String(msg) };
    }

    return { success: true };
  } catch (err: any) {
    console.error('[notify] error de red al enviar email:', err?.message);
    return { success: false, error: err?.message ?? 'error de red' };
  }
}

/** Email de la dueña para los avisos internos de venta. */
export const OWNER_EMAIL = process.env.OWNER_EMAIL ?? 'almublanq@gmail.com';
