import { prisma } from './prisma';
import { sendNiIdeaEmail, OWNER_EMAIL } from './notify';
import { sendTwilioMessage, twilioConfigured } from './twilio';
import {
  buildRevealEmail,
  buildRevealText,
  buildPurchaseEmail,
  buildSaleAdminEmail,
  buildOwnerAlertEmail,
  formatDateEs,
} from './messages';

function euros(cents: number): string {
  return (cents / 100).toFixed(2).replace('.', ',');
}

export type DeliveryResult = {
  success: boolean;
  email: boolean;
  message: boolean;
  errors: string[];
};

/**
 * Revela el plan al cliente. El canal principal (y hoy el único activo) es el email.
 * Marca el pedido como notificado si al menos un canal ha funcionado.
 */
export async function deliverReveal(orderId: string): Promise<DeliveryResult> {
  const errors: string[] = [];

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { assignedExperience: true },
  });

  if (!order) return { success: false, email: false, message: false, errors: ['Pedido no encontrado'] };
  const exp = order.assignedExperience;
  if (!exp) {
    return { success: false, email: false, message: false, errors: ['Sin experiencia asignada'] };
  }

  const data = {
    time: exp.time,
    location: exp.location,
    neighborhood: exp.neighborhood,
    category: exp.category,
    level: order.level,
    people: order.people,
    dateLabel: formatDateEs(order.date),
  };

  // 1) Email (canal principal, gratuito)
  const mail = buildRevealEmail(data);
  const emailRes = await sendNiIdeaEmail({
    notificationId: process.env.NOTIF_ID_REVELACIN_DEL_PLAN_SORPRESA,
    to: order.email,
    subject: mail.subject,
    html: mail.html,
  });
  if (!emailRes.success) errors.push(`email: ${emailRes.error}`);

  // 2) WhatsApp / SMS: solo si Twilio se configura algún día.
  // Hoy el canal de comunicación con el cliente es el email.
  let messageOk = false;
  if (twilioConfigured()) {
    const msgRes = await sendTwilioMessage(order.phone, buildRevealText(data));
    messageOk = msgRes.success;
    if (!msgRes.success) errors.push(`mensaje: ${msgRes.error}`);
  }

  const success = emailRes.success || messageOk;

  if (success && !order.whatsappSent) {
    await prisma.order.update({
      where: { id: order.id },
      data: { whatsappSent: true },
    });
  }

  return { success, email: emailRes.success, message: messageOk, errors };
}

/**
 * Tras el pago: confirmación al cliente + aviso interno de venta.
 * No revela el plan (eso ocurre el día de la experiencia).
 */
export async function deliverPurchaseConfirmation(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { assignedExperience: true },
  });
  if (!order) return;

  const dateLabel = formatDateEs(order.date);
  const totalEuros = euros(order.price);

  // Cliente
  const client = buildPurchaseEmail({
    dateLabel,
    people: order.people,
    level: order.level,
    totalEuros,
  });
  await sendNiIdeaEmail({
    notificationId: process.env.NOTIF_ID_CONFIRMACIN_DE_COMPRA,
    to: order.email,
    subject: client.subject,
    html: client.html,
  });

  // Dueña
  const admin = buildSaleAdminEmail({
    email: order.email,
    phone: order.phone,
    dateLabel,
    people: order.people,
    level: order.level,
    totalEuros,
    experienceName: order.assignedExperience?.name ?? null,
  });
  await sendNiIdeaEmail({
    notificationId: process.env.NOTIF_ID_NUEVA_VENTA,
    to: OWNER_EMAIL,
    subject: admin.subject,
    html: admin.html,
    replyTo: order.email,
  });

  // Aviso urgente si el pago ha entrado pero no hay plan que asignar
  if (!order.assignedExperience) {
    const alert = buildOwnerAlertEmail({
      kicker: 'Atención',
      title: 'Un pedido pagado se ha quedado sin plan',
      intro:
        'Se ha cobrado una compra pero no había ninguna experiencia libre para esa fecha y nivel. Hay que asignarla a mano desde el panel de administración cuanto antes.',
      rows: [
        ['📅', 'Fecha del plan', dateLabel],
        ['👥', 'Personas', String(order.people)],
        ['⚡', 'Nivel', order.level],
        ['✉️', 'Email cliente', order.email],
        ['📱', 'Teléfono', order.phone],
        ['💰', 'Importe', `${totalEuros} €`],
      ],
      outro:
        'Entra en el panel, pestaña Pedidos, y pulsa «Asignar» para elegir una experiencia disponible.',
      subject: `🚨 Pedido SIN PLAN · ${dateLabel} · ${order.people} pers.`,
    });
    await sendNiIdeaEmail({
      notificationId: process.env.NOTIF_ID_AVISO_PEDIDO_SIN_PLAN,
      to: OWNER_EMAIL,
      subject: alert.subject,
      html: alert.html,
    });
  }
}
