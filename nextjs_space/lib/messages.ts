/**
 * Plantillas de mensajes de NiIdea.
 * Marca: amarillo #FFD54F sobre negro #0B0B0B.
 */

export const LEVEL_LABELS_MSG: Record<string, string> = {
  soft: 'Soft',
  medium: 'Medium',
  full: 'Full',
};

export type RevealData = {
  time: string;
  location: string;
  neighborhood?: string | null;
  category?: string | null;
  level?: string | null;
  people?: number | null;
  dateLabel?: string | null;
};

function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function formatDateEs(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'Europe/Madrid',
  }).format(date);
}

const CATEGORY_EMOJI: Record<string, string> = {
  restaurante: '🍽️',
  teatro: '🎭',
  experiencia: '✨',
  ocio: '🎟️',
  fiesta: '🥂',
};

const CATEGORY_REVEAL: Record<string, string> = {
  restaurante: '¡Mañana os vais a cenar!',
  teatro: '¡Mañana os vais al teatro!',
  experiencia: '¡Mañana vivís una experiencia única!',
  ocio: '¡Mañana os vais de ocio!',
  fiesta: '¡Mañana lo celebráis a lo grande!',
};

/* ------------------------------------------------------------------ */
/* Envoltorio HTML común                                              */
/* ------------------------------------------------------------------ */

function shell(opts: { preheader: string; content: string }): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>NiIdea</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');
</style>
</head>
<body style="margin:0;padding:0;background-color:#0B0B0B;">
<div style="display:none;font-size:1px;color:#0B0B0B;max-height:0;overflow:hidden;">${esc(opts.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B0B0B;padding:32px 16px;">
  <tr>
    <td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

        <!-- Logo -->
        <tr>
          <td align="center" style="padding-bottom:24px;">
            <span style="font-family:'Caveat',cursive;font-size:40px;font-weight:700;color:#FFD54F;letter-spacing:-0.5px;line-height:1;">Niidea</span>
          </td>
        </tr>

        ${opts.content}

        <!-- Pie -->
        <tr>
          <td align="center" style="padding-top:28px;">
            <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#6B6B6B;">
              NiIdea · Experiencias sorpresa en Madrid
            </p>
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:17px;color:#4A4A4A;">
              Recibes este correo porque has reservado un plan con nosotros.
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

function card(inner: string): string {
  return `<tr>
  <td style="background-color:#141414;border-radius:20px;padding:32px 28px;">
    ${inner}
  </td>
</tr>`;
}

/** Une filas de detalle quitando el borde inferior de la última. */
function detailRows(rows: string[]): string {
  const clean = rows.filter(Boolean);
  return clean
    .map((r, i) =>
      i === clean.length - 1 ? r.replace('border-bottom:1px solid #242424;', '') : r
    )
    .join('\n');
}

function detailRow(icon: string, label: string, value: string): string {
  return `<tr>
  <td style="padding:14px 0;border-bottom:1px solid #242424;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="34" valign="top" style="font-size:20px;line-height:24px;">${icon}</td>
        <td valign="top">
          <p style="margin:0 0 3px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:15px;letter-spacing:1.2px;text-transform:uppercase;color:#8A8A8A;">${esc(label)}</p>
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:23px;font-weight:bold;color:#FFFFFF;">${esc(value)}</p>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
}

/* ------------------------------------------------------------------ */
/* 1. Revelación del plan (el día de la experiencia)                  */
/* ------------------------------------------------------------------ */

export function buildRevealEmail(d: RevealData): { subject: string; html: string } {
  const emoji = CATEGORY_EMOJI[d.category ?? ''] ?? '✨';
  const revealPhrase = CATEGORY_REVEAL[d.category ?? ''] ?? null;
  const rows = detailRows([
    detailRow('🕘', 'Hora', d.time),
    detailRow('📍', 'Dónde', d.location),
    d.neighborhood ? detailRow('🗺️', 'Barrio', d.neighborhood) : '',
    d.people ? detailRow('👥', 'Personas', String(d.people)) : '',
  ]);

  const content =
    card(`
      <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:16px;letter-spacing:2px;text-transform:uppercase;color:#FFD54F;font-weight:bold;">Ya toca</p>
      <h1 style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:29px;line-height:36px;font-weight:bold;color:#FFFFFF;">
        Tu plan de mañana ${emoji}
      </h1>
      ${revealPhrase ? `<h2 style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:26px;line-height:34px;font-weight:bold;color:#FFD54F;">${esc(revealPhrase)}</h2>` : ''}
      <p style="margin:0 0 26px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:23px;color:#A8A8A8;">
        Se acabó el misterio. Esto es lo que te hemos preparado${d.dateLabel ? ` para <strong style="color:#FFFFFF;">${esc(d.dateLabel)}</strong>` : ''}.
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B0B0B;border-radius:14px;padding:4px 18px;">
        ${rows}
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
        <tr>
          <td style="background-color:#FFD54F;border-radius:12px;padding:16px 20px;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:21px;color:#0B0B0B;font-weight:bold;">
              Todo está pagado. Llega, di tu nombre y disfruta.
            </p>
          </td>
        </tr>
      </table>

      <p style="margin:22px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:21px;color:#8A8A8A;">
        Sé puntual y pásalo bien 😏
      </p>
    `);

  return {
    subject: `Tu plan NiIdea de mañana: ${d.time} · ${d.neighborhood ?? 'Madrid'}`,
    html: shell({ preheader: `Mañana a las ${d.time} en ${d.location}`, content }),
  };
}

/** Versión corta para WhatsApp / SMS (sin HTML). */
export function buildRevealText(d: RevealData): string {
  const lines = [
    '🔥 NiIdea — tu plan de mañana',
    '',
    `🕘 ${d.time}`,
    `📍 ${d.location}`,
  ];
  if (d.neighborhood) lines.push(`🗺️ ${d.neighborhood}`);
  lines.push('', 'Todo pagado. Llega, di tu nombre y disfruta 😏');
  return lines.join('\n');
}

/* ------------------------------------------------------------------ */
/* 2. Confirmación de compra (justo después de pagar)                 */
/* ------------------------------------------------------------------ */

export function buildPurchaseEmail(d: {
  dateLabel: string;
  people: number;
  level: string;
  totalEuros: string;
}): { subject: string; html: string } {
  const content =
    card(`
      <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:16px;letter-spacing:2px;text-transform:uppercase;color:#FFD54F;font-weight:bold;">Reserva confirmada</p>
      <h1 style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:29px;line-height:36px;font-weight:bold;color:#FFFFFF;">
        Listo. No preguntes 🤫
      </h1>
      <p style="margin:0 0 26px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:23px;color:#A8A8A8;">
        Tu plan sorpresa está reservado. No te vamos a contar nada todavía: <strong style="color:#FFD54F;">el día antes</strong> te enviamos por email la hora y el sitio.
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B0B0B;border-radius:14px;padding:4px 18px;">
        ${detailRows([
          detailRow('📅', 'Fecha del plan', d.dateLabel),
          detailRow('👥', 'Personas', String(d.people)),
          detailRow('⚡', 'Nivel', LEVEL_LABELS_MSG[d.level] ?? d.level),
          detailRow('💳', 'Pagado', `${d.totalEuros} €`),
        ])}
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
        <tr>
          <td style="background-color:#FFD54F;border-radius:12px;padding:16px 20px;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:21px;color:#0B0B0B;font-weight:bold;">
              📩 El día antes del plan recibirás un email con la hora y el lugar exactos. Revisa tu bandeja (y el spam, por si acaso).
            </p>
          </td>
        </tr>
      </table>

      <p style="margin:22px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:21px;color:#8A8A8A;">
        Hasta entonces, cero pistas 😏
      </p>
    `);

  return {
    subject: `Reserva confirmada · tu plan NiIdea del ${d.dateLabel}`,
    html: shell({
      preheader: `Plan reservado para el ${d.dateLabel}. Te enviamos los detalles el día antes.`,
      content,
    }),
  };
}

/* ------------------------------------------------------------------ */
/* 3. Aviso interno de nueva venta                                    */
/* ------------------------------------------------------------------ */

export function buildSaleAdminEmail(d: {
  email: string;
  phone: string;
  dateLabel: string;
  people: number;
  level: string;
  totalEuros: string;
  experienceName?: string | null;
}): { subject: string; html: string } {
  const content =
    card(`
      <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:16px;letter-spacing:2px;text-transform:uppercase;color:#FFD54F;font-weight:bold;">Nueva venta</p>
      <h1 style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:27px;line-height:34px;font-weight:bold;color:#FFFFFF;">
        ${esc(d.totalEuros)} € cobrados 🎉
      </h1>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B0B0B;border-radius:14px;padding:4px 18px;">
        ${detailRows([
          detailRow('📅', 'Fecha del plan', d.dateLabel),
          detailRow('👥', 'Personas', String(d.people)),
          detailRow('⚡', 'Nivel', LEVEL_LABELS_MSG[d.level] ?? d.level),
          detailRow('✉️', 'Email cliente', d.email),
          detailRow('📱', 'Teléfono', d.phone),
          detailRow('🎁', 'Experiencia asignada', d.experienceName ?? 'Sin asignar todavía'),
        ])}
      </table>
    `);

  return {
    subject: `💰 Nueva venta NiIdea · ${d.totalEuros} € · ${d.people} pers. · ${d.dateLabel}`,
    html: shell({ preheader: `${d.totalEuros} € · ${d.dateLabel}`, content }),
  };
}

/* ------------------------------------------------------------------ */
/* 4. Avisos internos para la dueña                                   */
/* ------------------------------------------------------------------ */

/**
 * Email genérico de aviso interno (solo para la dueña).
 * `rows` son pares [etiqueta, valor] que se pintan como tabla de detalle.
 */
export function buildOwnerAlertEmail(d: {
  kicker: string;
  title: string;
  intro: string;
  rows?: Array<[string, string, string]>;
  outro?: string;
  subject: string;
}): { subject: string; html: string } {
  const table = d.rows?.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B0B0B;border-radius:14px;padding:4px 18px;">
        ${detailRows(d.rows.map(([icon, label, value]) => detailRow(icon, label, value)))}
      </table>`
    : '';

  const content = card(`
      <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:16px;letter-spacing:2px;text-transform:uppercase;color:#FFD54F;font-weight:bold;">${esc(d.kicker)}</p>
      <h1 style="margin:0 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:26px;line-height:33px;font-weight:bold;color:#FFFFFF;">${esc(d.title)}</h1>
      <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:23px;color:#C9C9C9;">${d.intro}</p>
      ${table}
      ${d.outro ? `<p style="margin:20px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:23px;color:#C9C9C9;">${d.outro}</p>` : ''}
    `);

  return { subject: d.subject, html: shell({ preheader: d.title, content }) };
}
